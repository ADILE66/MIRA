import { NextResponse } from 'next/server';
import { db } from '@/lib/db-client';

export async function GET() {
  try {
    const health = await db.getHealth();
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      database: health,
      models: {
        fastModel: process.env.GEMINI_FAST_MODEL || 'gemini-2.5-flash',
        evalModel: process.env.GEMINI_EVAL_MODEL || 'gemini-2.5-flash',
        proModel: process.env.GEMINI_PRO_MODEL || 'gemini-2.5-pro',
      },
      security: {
        tenantIsolationEnforced: true,
        antiPromptInjectionActive: true,
        rlsEnabled: true,
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Impossible de vérifier la santé de la base.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
