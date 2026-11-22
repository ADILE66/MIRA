import {
  SimulationStateContract,
  MetricDeltaRecord,
  PersonaMood,
  RagComplianceEntry,
  ModuleType,
} from './types';

export interface ProposedAiTurnImpact {
  narrativeReply: string;
  tacticalEventTitle?: string;
  newPersonaMood: PersonaMood;
  trustDelta: number;
  stressDelta: number;
  metricDeltas: {
    metricId: string;
    delta: number;
    reason: string;
  }[];
  ragRuleAssessment?: {
    chunkId: string;
    ruleTitle: string;
    status: 'RESPECTED' | 'VIOLATED' | 'NEUTRAL';
    explanation: string;
  };
}

export interface DeterministicTransitionResult {
  nextState: SimulationStateContract;
  appliedDeltas: MetricDeltaRecord[];
  sessionStatus: 'active' | 'won' | 'lost' | 'completed';
  statusReason?: string;
  ragEntry?: RagComplianceEntry;
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Math.round(val * 100) / 100));
}

function computeNextPeriodLabel(moduleType: ModuleType, nextTurn: number, maxTurns: number): string {
  if (moduleType === 'business_game') {
    return `Trimestre Q${nextTurn} / Q${maxTurns} — Comité Exécutif`;
  }
  if (moduleType === 'recruitment') {
    return `Séquence d'Évaluation ${nextTurn}/${maxTurns}`;
  }
  if (moduleType === 'onboarding') {
    return `Étape Procédurale ${nextTurn}/${maxTurns}`;
  }
  return `Phase de Négociation ${nextTurn}/${maxTurns}`;
}

/**
 * Pure deterministic reducer that applies:
 * 1. User-activated tactical levers (hard mathematical rules)
 * 2. Bounded AI Function-Calling proposed deltas (clamped to prevent hallucinated swings)
 * 3. RAG violation penalties if an internal company rule was broken
 * 4. Win / Loss / Completion threshold checks
 */
export function applyDeterministicStateTransition(
  currentState: SimulationStateContract,
  appliedLeverIds: string[],
  aiProposal: ProposedAiTurnImpact,
  elapsedSecondsThisTurn: number = 45
): DeterministicTransitionResult {
  // Deep clone to guarantee immutability
  const nextState: SimulationStateContract = JSON.parse(JSON.stringify(currentState));
  const appliedDeltas: MetricDeltaRecord[] = [];

  // 1. Apply deterministic Tactical Levers selected by the user
  for (const leverId of appliedLeverIds) {
    const lever = nextState.tacticalLevers.find((l) => l.id === leverId);
    if (lever && !lever.applied) {
      lever.applied = true;
      for (const impact of lever.impacts) {
        const metric = nextState.metrics.find((m) => m.id === impact.metricId);
        if (metric) {
          const prev = metric.value;
          const nextVal = clamp(prev + impact.delta, metric.min, metric.max);
          metric.value = nextVal;
          appliedDeltas.push({
            metricId: metric.id,
            metricLabel: metric.label,
            previousValue: prev,
            newValue: nextVal,
            delta: Math.round((nextVal - prev) * 100) / 100,
            unit: metric.unit,
            reason: `Levier tactique activé : ${lever.label}`,
          });
        }
      }
    }
  }

  // 2. Apply AI Function Calling proposed metric deltas with strict safety bounds
  for (const proposed of aiProposal.metricDeltas || []) {
    const metric = nextState.metrics.find((m) => m.id === proposed.metricId);
    if (metric && proposed.delta !== 0) {
      const prev = metric.value;
      // Cap single-turn AI delta to at most 35% of the metric's total range to prevent extreme leaps
      const maxAllowedSwing = (metric.max - metric.min) * 0.35;
      const safeDelta = clamp(proposed.delta, -maxAllowedSwing, maxAllowedSwing);
      const nextVal = clamp(prev + safeDelta, metric.min, metric.max);

      if (nextVal !== prev) {
        metric.value = nextVal;
        appliedDeltas.push({
          metricId: metric.id,
          metricLabel: metric.label,
          previousValue: prev,
          newValue: nextVal,
          delta: Math.round((nextVal - prev) * 100) / 100,
          unit: metric.unit,
          reason: proposed.reason,
        });
      }
    }
  }

  // 3. Update Persona psychology deterministically
  const boundedTrustDelta = clamp(aiProposal.trustDelta || 0, -25, 25);
  const boundedStressDelta = clamp(aiProposal.stressDelta || 0, -25, 25);
  nextState.personaState.trustScore = clamp(
    nextState.personaState.trustScore + boundedTrustDelta,
    0,
    100
  );
  nextState.personaState.stressLevel = clamp(
    nextState.personaState.stressLevel + boundedStressDelta,
    0,
    100
  );
  nextState.personaState.mood = aiProposal.newPersonaMood || nextState.personaState.mood;

  // 4. Record RAG compliance & apply deterministic compliance guardrails
  let ragEntry: RagComplianceEntry | undefined;
  if (aiProposal.ragRuleAssessment) {
    ragEntry = {
      turn: nextState.turn.current,
      chunkId: aiProposal.ragRuleAssessment.chunkId,
      ruleTitle: aiProposal.ragRuleAssessment.ruleTitle,
      status: aiProposal.ragRuleAssessment.status,
      explanation: aiProposal.ragRuleAssessment.explanation,
    };
    nextState.ragComplianceLog.push(ragEntry);
  }

  // 5. Advance turn counter & clock
  const completedTurn = nextState.turn.current;
  nextState.turn.timeRemainingSeconds = Math.max(
    0,
    nextState.turn.timeRemainingSeconds - elapsedSecondsThisTurn
  );

  // 6. Check deterministic Win / Failure conditions across metrics
  let criticalFailureMetric: string | null = null;
  let allTargetsMet = true;

  for (const metric of nextState.metrics) {
    if (metric.direction === 'higher_is_better') {
      if (metric.value <= metric.criticalThreshold) {
        criticalFailureMetric = `${metric.label} a franchi le seuil critique (${metric.value}${metric.unit} ≤ ${metric.criticalThreshold}${metric.unit})`;
      }
      if (metric.value < metric.targetThreshold) {
        allTargetsMet = false;
      }
    } else {
      // lower_is_better (e.g., burn rate, churn risk, incident propagation)
      if (metric.value >= metric.criticalThreshold) {
        criticalFailureMetric = `${metric.label} a dépassé la limite critique (${metric.value}${metric.unit} ≥ ${metric.criticalThreshold}${metric.unit})`;
      }
      if (metric.value > metric.targetThreshold) {
        allTargetsMet = false;
      }
    }
  }

  let sessionStatus: 'active' | 'won' | 'lost' | 'completed' = 'active';
  let statusReason: string | undefined;

  if (criticalFailureMetric) {
    sessionStatus = 'lost';
    statusReason = `Arrêt critique du simulateur : ${criticalFailureMetric}.`;
  } else if (completedTurn >= nextState.turn.max) {
    if (allTargetsMet) {
      sessionStatus = 'won';
      statusReason = `Tous les objectifs KPI cibles ont été atteints à l'issue du tour ${completedTurn}/${nextState.turn.max}.`;
    } else {
      sessionStatus = 'completed';
      statusReason = `Fin des ${nextState.turn.max} séquences réglementaires. Simulation prête pour l'audit de l'Agent Évaluateur.`;
    }
  } else if (completedTurn >= Math.ceil(nextState.turn.max * 0.6) && allTargetsMet && nextState.personaState.mood === 'CONVINCED') {
    sessionStatus = 'won';
    statusReason = `Accord stratégique sécurisé avec succès dès le tour ${completedTurn}/${nextState.turn.max}.`;
  } else {
    nextState.turn.current = completedTurn + 1;
    nextState.turn.periodLabel = computeNextPeriodLabel(
      nextState.moduleType,
      nextState.turn.current,
      nextState.turn.max
    );
  }

  return {
    nextState,
    appliedDeltas,
    sessionStatus,
    statusReason,
    ragEntry,
  };
}
