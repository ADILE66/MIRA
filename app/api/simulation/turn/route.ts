import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db-client';
import { resolveAuthContext, enforceTenantIsolation } from '@/lib/auth';
import { retrieveRelevantRagChunks } from '@/lib/rag-engine';
import { executeNarrativeTurnWithFunctionCalling } from '@/lib/gemini-engine';
import { applyDeterministicStateTransition } from '@/lib/state-engine';
import { SimulationTurnEntry } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const auth = resolveAuthContext(req);
    const body = await req.json();
    const { sessionId, userMessage, appliedLeverIds = [], elapsedSeconds = 40 } = body;

    if (!sessionId || !userMessage || !userMessage.trim()) {
      return NextResponse.json(
        { error: 'Le message ou la décision du participant est requis.' },
        { status: 400 }
      );
    }

    // 1. Isolation check & session retrieval
    const session = await db.getSimulationSession(sessionId);
    if (!session) {
      return NextResponse.json({ error: 'Session de simulation introuvable.' }, { status: 404 });
    }

    enforceTenantIsolation(auth, session.organizationId, 'Session de simulation');

    const scenario = await db.getScenarioById(session.scenarioId, session.organizationId);
    if (!scenario) {
      return NextResponse.json({ error: 'Scénario associé introuvable.' }, { status: 404 });
    }

    const knowledgeDoc = scenario.knowledgeDocumentId
      ? await db.getKnowledgeDocumentById(scenario.knowledgeDocumentId, session.organizationId)
      : null;

    // 2. Récupération RAG des segments pertinents pour ce tour
    const relevantRagChunks = retrieveRelevantRagChunks(knowledgeDoc || undefined, userMessage, 3);

    // 3. Extraction des labels des leviers tactiques activés ce tour-ci
    const appliedLeverLabels = session.currentState.tacticalLevers
      .filter((l) => appliedLeverIds.includes(l.id) && !l.applied)
      .map((l) => l.label);

    const executedTurnNumber = session.currentState.turn.current;
    const executedPeriodLabel = session.currentState.turn.periodLabel;

    // 4. Appel au Moteur Narratif IA avec Function Calling (et protection injection)
    const aiProposal = await executeNarrativeTurnWithFunctionCalling({
      scenario,
      currentState: session.currentState,
      turnHistory: session.turnHistory,
      userMessage: userMessage.trim(),
      appliedLeverLabels,
      relevantRagChunks,
    });

    // 5. Transition déterministe pure du Moteur d'État
    const transition = applyDeterministicStateTransition(
      session.currentState,
      appliedLeverIds,
      aiProposal,
      Number(elapsedSeconds) || 40
    );

    // 6. Enregistrement de l'entrée d'historique du tour
    const turnEntry: SimulationTurnEntry = {
      turnNumber: executedTurnNumber,
      periodLabel: executedPeriodLabel,
      timestamp: new Date().toISOString(),
      userMessage: userMessage.trim(),
      appliedLeverIds,
      aiNarrativeReply: aiProposal.narrativeReply,
      tacticalEventTitle: aiProposal.tacticalEventTitle,
      personaMoodAfter: transition.nextState.personaState.mood,
      metricDeltas: transition.appliedDeltas,
      ragAssessment: transition.ragEntry,
    };

    session.currentState = transition.nextState;
    session.turnHistory.push(turnEntry);
    session.status = transition.sessionStatus;
    session.statusReason = transition.statusReason;

    if (transition.sessionStatus !== 'active') {
      session.completedAt = new Date().toISOString();
    }

    await db.saveSimulationSession(session);

    return NextResponse.json({
      session,
      turnEntry,
      relevantRagChunks,
    });
  } catch (error: unknown) {
    console.error('Error in /api/simulation/turn:', error);
    const status = (error as { status?: number }).status || 500;
    const msg =
      error instanceof Error
        ? error.message
        : 'Erreur lors du traitement du tour par le moteur hybride.';
    return NextResponse.json({ error: msg }, { status });
  }
}
