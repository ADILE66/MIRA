import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db-client';
import { resolveAuthContext, enforceTenantIsolation } from '@/lib/auth';
import { generateSessionEvaluationReport } from '@/lib/gemini-engine';

export async function POST(req: NextRequest) {
  try {
    const auth = resolveAuthContext(req);
    const body = await req.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json({ error: 'Identifiant de session manquant.' }, { status: 400 });
    }

    const session = await db.getSimulationSession(sessionId);
    if (!session) {
      return NextResponse.json({ error: 'Session introuvable.' }, { status: 404 });
    }

    enforceTenantIsolation(auth, session.organizationId, 'Session de simulation');

    const scenario = await db.getScenarioById(session.scenarioId, session.organizationId);
    if (!scenario) {
      return NextResponse.json({ error: 'Scénario introuvable.' }, { status: 404 });
    }

    const knowledgeDoc = scenario.knowledgeDocumentId
      ? await db.getKnowledgeDocumentById(scenario.knowledgeDocumentId, session.organizationId)
      : null;

    const report = await generateSessionEvaluationReport({
      scenario,
      finalState: session.currentState,
      turnHistory: session.turnHistory,
      ragChunks: knowledgeDoc?.chunks || [],
    });

    const updatedSession = await db.saveEvaluationReport(sessionId, report, session.organizationId);

    return NextResponse.json({
      session: updatedSession || session,
      evaluationReport: report,
    });
  } catch (error: unknown) {
    console.error('Error in /api/simulation/evaluate:', error);
    const status = (error as { status?: number }).status || 500;
    const msg =
      error instanceof Error
        ? error.message
        : "Erreur lors de la génération du rapport par l'Agent Évaluateur.";
    return NextResponse.json({ error: msg }, { status });
  }
}
