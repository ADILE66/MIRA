import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db-client';
import { resolveAuthContext, enforceTenantIsolation } from '@/lib/auth';
import { SimulationSession } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const auth = resolveAuthContext(req);
    const body = await req.json();
    const { scenarioId, organizationId, userId } = body;

    const targetOrgId = organizationId || auth.organizationId;
    enforceTenantIsolation(auth, targetOrgId, 'Session de simulation');

    const scenario = await db.getScenarioById(scenarioId, targetOrgId);
    if (!scenario) {
      return NextResponse.json(
        { error: 'Scénario introuvable ou non autorisé pour cette organisation.' },
        { status: 404 }
      );
    }

    const sessionId = `sim-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newSession: SimulationSession = {
      id: sessionId,
      scenarioId: scenario.id,
      organizationId: targetOrgId,
      userId: userId || auth.user.id,
      status: 'active',
      currentState: JSON.parse(JSON.stringify(scenario.initialState)),
      turnHistory: [],
      startedAt: new Date().toISOString(),
    };

    await db.saveSimulationSession(newSession);

    return NextResponse.json({
      session: newSession,
      tenantScoping: {
        organizationId: targetOrgId,
        authorizedUser: auth.user.name,
      },
    });
  } catch (error: unknown) {
    const status = (error as { status?: number }).status || 500;
    const msg = error instanceof Error ? error.message : 'Impossible de démarrer la session.';
    return NextResponse.json({ error: msg }, { status });
  }
}
