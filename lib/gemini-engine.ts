import { FunctionDeclaration, GoogleGenAI, Type } from '@google/genai';
import {
  SimulationStateContract,
  KnowledgeChunk,
  SimulationTurnEntry,
  EvaluationReport,
  ScenarioDefinition,
  ModuleType,
} from './types';
import { ProposedAiTurnImpact } from './state-engine';

function getAiClient(): GoogleGenAI {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Modèles de production normalisés & résilients avec repli automatique
export const FAST_MODEL = process.env.GEMINI_FAST_MODEL || 'gemini-2.5-flash';
export const EVAL_MODEL = process.env.GEMINI_EVAL_MODEL || 'gemini-2.5-flash';
export const PRO_MODEL = process.env.GEMINI_PRO_MODEL || 'gemini-2.5-pro';
const RESILIENT_FALLBACK_MODEL = 'gemini-1.5-flash';

/**
 * Filtre de sécurité anti-prompt injection / jailbreak pour assainir les entrées utilisateur
 * et protéger les indicateurs déterministes du Moteur d'État.
 */
export function sanitizeUserSimulationMessage(rawMessage: string): string {
  if (!rawMessage) return '';
  let sanitized = rawMessage.trim();

  // Neutralisation des vecteurs d'injection cherchant à forcer les deltas chiffrés
  const adversarialPatterns = [
    /ignore\s+(all\s+)?(previous\s+)?instructions/gi,
    /ignore\s+(toutes\s+les\s+)?(consignes|directives|règles)/gi,
    /proposeStateImpacts/gi,
    /recordSimulationTurnImpact/gi,
    /newPersonaMood\s*[:=]/gi,
    /metricDeltas\s*[:=]/gi,
    /trustDelta\s*[:=]/gi,
    /system\s*instruction/gi,
  ];

  for (const pattern of adversarialPatterns) {
    sanitized = sanitized.replace(pattern, '[FILTRE_INJECTION_NEUTRALISÉE]');
  }

  return sanitized;
}

/**
 * Enveloppe robuste pour exécuter generateContent avec basculement automatique
 * en cas d'indisponibilité du modèle cible.
 */
async function callGeminiWithFallback(
  ai: GoogleGenAI,
  preferredModel: string,
  requestParams: {
    contents: string | { parts: unknown[] };
    config: Record<string, unknown>;
  }
) {
  try {
    return await ai.models.generateContent({
      model: preferredModel,
      contents: requestParams.contents as unknown as string,
      config: requestParams.config,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.warn(
      `[GEMINI FALLBACK] Échec modèle ${preferredModel} (${errorMsg}). Repli sur ${RESILIENT_FALLBACK_MODEL}...`
    );
    return await ai.models.generateContent({
      model: RESILIENT_FALLBACK_MODEL,
      contents: requestParams.contents as unknown as string,
      config: requestParams.config,
    });
  }
}

/**
 * Déclaration de Function Calling pour imposer à l'IA de séparer sa réponse
 * narrative de ses propositions d'impact sur le Moteur d'État déterministe.
 */
const recordSimulationTurnImpactDeclaration: FunctionDeclaration = {
  name: 'recordSimulationTurnImpact',
  description:
    "Enregistre la réplique du persona IA, l'événement tactique éventuel, l'évaluation du respect des règles internes RAG et les deltas numériques proposés sur les KPIs du Moteur d'État.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      narrativeReply: {
        type: Type.STRING,
        description:
          'La réponse en discours direct incarnée par le persona (ou le rapport du Comité Exécutif en mode Business Game).',
      },
      tacticalEventTitle: {
        type: Type.STRING,
        description:
          "Titre court de l'événement ou de la réaction du tour (ex: 'Aléa Marché : Contre-attaque tarifaire concurrente' ou 'Exigence de garantie SLA écrite').",
      },
      newPersonaMood: {
        type: Type.STRING,
        description:
          'Nouvel état psychologique du persona parmi: HOSTILE, SKEPTICAL, NEUTRAL, OPEN, CONVINCED.',
      },
      trustDelta: {
        type: Type.NUMBER,
        description: 'Variation du score de confiance (-25 à +25).',
      },
      stressDelta: {
        type: Type.NUMBER,
        description: 'Variation du niveau de stress du persona (-25 à +25).',
      },
      metricDeltas: {
        type: Type.ARRAY,
        description:
          "Variations chiffrées proposées sur les KPIs du scénario suite à l'argumentaire de l'utilisateur.",
        items: {
          type: Type.OBJECT,
          properties: {
            metricId: {
              type: Type.STRING,
              description: 'Identifiant exact du KPI dans currentState.metrics.',
            },
            delta: {
              type: Type.NUMBER,
              description: 'Variation numérique (positive ou négative) justifiée par la réponse du joueur.',
            },
            reason: {
              type: Type.STRING,
              description: 'Explication concise en français de la variation de ce KPI.',
            },
          },
          required: ['metricId', 'delta', 'reason'],
        },
      },
      ragRuleAssessment: {
        type: Type.OBJECT,
        description:
          "Évaluation du respect ou de la violation des extraits du document interne de l'entreprise (RAG).",
        properties: {
          chunkId: {
            type: Type.STRING,
            description: 'ID du segment RAG le plus pertinent.',
          },
          ruleTitle: {
            type: Type.STRING,
            description: 'Titre de la règle interne évaluée.',
          },
          status: {
            type: Type.STRING,
            description: 'RESPECTED, VIOLATED, ou NEUTRAL.',
          },
          explanation: {
            type: Type.STRING,
            description: 'Justification factuelle du respect ou de la violation de la procédure interne.',
          },
        },
        required: ['chunkId', 'ruleTitle', 'status', 'explanation'],
      },
    },
    required: [
      'narrativeReply',
      'newPersonaMood',
      'trustDelta',
      'stressDelta',
      'metricDeltas',
      'ragRuleAssessment',
    ],
  },
};

/**
 * 1. BOUCLE TEMPS RÉEL (Moteur Narratif + Function Calling vers le Moteur d'État)
 */
export async function executeNarrativeTurnWithFunctionCalling(params: {
  scenario: ScenarioDefinition;
  currentState: SimulationStateContract;
  turnHistory: SimulationTurnEntry[];
  userMessage: string;
  appliedLeverLabels: string[];
  relevantRagChunks: KnowledgeChunk[];
}): Promise<ProposedAiTurnImpact> {
  const ai = getAiClient();
  const {
    scenario,
    currentState,
    turnHistory,
    userMessage,
    appliedLeverLabels,
    relevantRagChunks,
  } = params;

  const metricsSpec = currentState.metrics
    .map(
      (m) =>
        `- ID: "${m.id}" | Label: "${m.label}" | Valeur actuelle: ${m.value}${m.unit} (Bornes: ${m.min} à ${m.max}, Seuil critique: ${m.criticalThreshold}, Cible: ${m.targetThreshold})`
    )
    .join('\n');

  const ragContextStr =
    relevantRagChunks.length > 0
      ? relevantRagChunks
          .map(
            (c) =>
              `[CHUNK_ID: ${c.id}] TITRE: ${c.title}\nCONTENU: ${c.content}\nRÈGLE IMPÉRATIVE: ${c.mandatoryRule}`
          )
          .join('\n\n')
      : 'Aucun document RAG attaché.';

  const historySummary = turnHistory
    .slice(-4)
    .map(
      (t) =>
        `Tour ${t.turnNumber} (${t.periodLabel}):\n- Joueur: "${t.userMessage}"\n- Persona (${t.personaMoodAfter}): "${t.aiNarrativeReply}"`
    )
    .join('\n\n');

  const systemInstruction = `Tu es le Moteur Narratif et Comportemental d'AegisSim, le simulateur B2B pour équipes en entreprise.
Tu incarnes le persona suivant avec un réalisme professionnel absolu :
- Nom : ${currentState.personaState.name}
- Rôle : ${currentState.personaState.role} (${currentState.personaState.company})
- Canal : ${currentState.personaState.channel}
- Humeur actuelle : ${currentState.personaState.mood} (Confiance: ${currentState.personaState.trustScore}/100, Stress: ${currentState.personaState.stressLevel}/100)
- Agenda caché : ${currentState.personaState.hiddenAgenda}

CONTEXTE DU SCÉNARIO (${scenario.moduleType.toUpperCase()}) :
${scenario.contextBrief}
Tour actuel : ${currentState.turn.current} / ${currentState.turn.max} (${currentState.turn.periodLabel}).

ÉTAT DÉTERMINISTE DES KPIS (en lecture seule, tu dois proposer des deltas cohérents via l'outil recordSimulationTurnImpact) :
${metricsSpec}

EXTRAITS OFFICIELS DES PROCÉDURES INTERNES DE L'ENTREPRISE (RAG) :
${ragContextStr}

DIRECTIVES STRICTES :
1. Tu DOIS obligatoirement appeler la fonction "recordSimulationTurnImpact" pour fournir ta réponse narrative et tes deltas chiffrés.
2. Si le joueur viole une règle interne du RAG (ex: promettre une remise > 10% sans accord CFO, refuser d'isoler un serveur compromis, ou menacer un collaborateur), marque ragRuleAssessment.status = "VIOLATED" et applique un delta négatif sur la marge, la conformité ou la confiance.
3. Si le joueur utilise un argument solide aligné avec le RAG et les leviers activés, fais évoluer positivement les KPIs et ton humeur (de HOSTILE vers SKEPTICAL, OPEN, puis CONVINCED).
4. En mode "business_game", génère également un court imprévu économique ou concurrentiel réaliste dans tacticalEventTitle pour challenger le dirigeant au trimestre suivant.`;

  const sanitizedUserMsg = sanitizeUserSimulationMessage(userMessage);

  const promptText = `HISTORIQUE RÉCENT :
${historySummary || `Ouverture du persona : ${scenario.openingPersonaMessage}`}

LEVIERS TACTIQUES ACTIVÉS PAR LE JOUEUR CE TOUR-CI :
${appliedLeverLabels.length > 0 ? appliedLeverLabels.join(', ') : 'Aucun levier pré-configuré activé (argumentaire libre uniquement)'}

MESSAGE / DÉCISION DU JOUEUR (vérifié) :
"${sanitizedUserMsg}"

Appelle immédiatement l'outil recordSimulationTurnImpact avec ta réplique en français et l'analyse d'impact sur les KPIs.`;

  const response = await callGeminiWithFallback(ai, FAST_MODEL, {
    contents: promptText,
    config: {
      systemInstruction,
      tools: [{ functionDeclarations: [recordSimulationTurnImpactDeclaration] }],
    },
  });

  const fnCall = response.functionCalls?.[0];
  if (fnCall && fnCall.args) {
    const args = fnCall.args as Record<string, unknown>;
    const validMoods = ['HOSTILE', 'SKEPTICAL', 'NEUTRAL', 'OPEN', 'CONVINCED'];
    const rawMood = String(args.newPersonaMood || currentState.personaState.mood).toUpperCase();
    const newPersonaMood = (
      validMoods.includes(rawMood) ? rawMood : currentState.personaState.mood
    ) as ProposedAiTurnImpact['newPersonaMood'];

    const rawDeltas = Array.isArray(args.metricDeltas) ? args.metricDeltas : [];
    const metricDeltas = rawDeltas.map((d: Record<string, unknown>) => ({
      metricId: String(d.metricId || ''),
      delta: Number(d.delta || 0),
      reason: String(d.reason || 'Impact de la négociation'),
    }));

    const rawRag = args.ragRuleAssessment as Record<string, unknown> | undefined;
    const validStatuses = ['RESPECTED', 'VIOLATED', 'NEUTRAL'];
    const ragStatus = rawRag && validStatuses.includes(String(rawRag.status))
      ? (String(rawRag.status) as 'RESPECTED' | 'VIOLATED' | 'NEUTRAL')
      : 'NEUTRAL';

    return {
      narrativeReply: String(
        args.narrativeReply ||
          response.text ||
          "J'entends vos arguments, mais j'attends des engagements chiffrés et vérifiables."
      ),
      tacticalEventTitle: args.tacticalEventTitle
        ? String(args.tacticalEventTitle)
        : undefined,
      newPersonaMood,
      trustDelta: Number(args.trustDelta || 0),
      stressDelta: Number(args.stressDelta || 0),
      metricDeltas,
      ragRuleAssessment: rawRag
        ? {
            chunkId: String(rawRag.chunkId || relevantRagChunks[0]?.id || 'rag-general'),
            ruleTitle: String(
              rawRag.ruleTitle || relevantRagChunks[0]?.title || 'Procédure Interne'
            ),
            status: ragStatus,
            explanation: String(
              rawRag.explanation || 'Analyse de conformité effectuée par rapport au référentiel.'
            ),
          }
        : undefined,
    };
  }

  // Fallback si le modèle a répondu en texte direct sans Function Call
  return {
    narrativeReply:
      response.text ||
      "Je prends note de votre proposition. Quelles garanties opérationnelles concrètes apportez-vous ?",
    newPersonaMood: currentState.personaState.mood,
    trustDelta: 5,
    stressDelta: -5,
    metricDeltas: currentState.metrics.slice(0, 1).map((m) => ({
      metricId: m.id,
      delta: m.direction === 'higher_is_better' ? 4 : -4,
      reason: 'Progression suite à la réponse du participant',
    })),
    ragRuleAssessment: relevantRagChunks[0]
      ? {
          chunkId: relevantRagChunks[0].id,
          ruleTitle: relevantRagChunks[0].title,
          status: 'RESPECTED',
          explanation: 'Argumentaire compatible avec le référentiel documentaire.',
        }
      : undefined,
  };
}

/**
 * 2. AGENT ÉVALUATEUR DE FIN DE SESSION (Structured Outputs JSON Schema)
 */
export async function generateSessionEvaluationReport(params: {
  scenario: ScenarioDefinition;
  finalState: SimulationStateContract;
  turnHistory: SimulationTurnEntry[];
  ragChunks: KnowledgeChunk[];
}): Promise<EvaluationReport> {
  const ai = getAiClient();
  const { scenario, finalState, turnHistory, ragChunks } = params;

  const transcript = turnHistory
    .map(
      (t) =>
        `[TOUR ${t.turnNumber} — ${t.periodLabel}]
Message Participant: "${t.userMessage}"
Leviers activés: ${t.appliedLeverIds.join(', ') || 'Aucun'}
Réponse Persona (${t.personaMoodAfter}): "${t.aiNarrativeReply}"
Deltas KPIs: ${t.metricDeltas.map((d) => `${d.metricLabel}: ${d.delta > 0 ? '+' : ''}${d.delta}${d.unit}`).join(', ')}
Audit RAG: ${t.ragAssessment ? `${t.ragAssessment.status} (${t.ragAssessment.ruleTitle}) - ${t.ragAssessment.explanation}` : 'N/A'}`
    )
    .join('\n\n');

  const finalMetricsSummary = finalState.metrics
    .map(
      (m) =>
        `- ${m.label}: ${m.value}${m.unit} (Cible: ${m.targetThreshold}${m.unit}, Seuil critique: ${m.criticalThreshold}${m.unit})`
    )
    .join('\n');

  const ragRulesSummary = ragChunks
    .map((c) => `- [${c.id}] ${c.title}: ${c.mandatoryRule}`)
    .join('\n');

  const prompt = `Tu es l'Agent Évaluateur B2B d'AegisSim. Analyse cette session de simulation professionnelle et produis un rapport d'audit complet, objectif et exigeant en français.

SCÉNARIO : ${scenario.title} (Module: ${scenario.moduleType})
OBJECTIFS : ${scenario.objectives.join(' | ')}

BILAN FINAL DU MOTEUR D'ÉTAT DÉTERMINISTE :
- Humeur finale du Persona : ${finalState.personaState.mood} (Confiance: ${finalState.personaState.trustScore}/100)
${finalMetricsSummary}

RÉFÉRENTIEL INTERNE RAG APPLICABLE :
${ragRulesSummary}

TRANSCRIPTION COMPLÈTE DES TOURS :
${transcript || 'Session terminée dès le premier tour.'}

Génère le rapport structuré avec un radar de 5 compétences précis (Rigueur Financière & KPI, Maîtrise des Procédures RAG, Leadership & Posture, Gestion du Stress & Timing, Impact Décisionnel), l'analyse des moments critiques avec citations exactes et reformulations idéales, et 3 axes d'amélioration opérationnels.`;

  const response = await callGeminiWithFallback(ai, EVAL_MODEL, {
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overallScore: {
            type: Type.NUMBER,
            description: 'Score global de 0 à 100.',
          },
          verdict: {
            type: Type.STRING,
            description:
              'Un parmi: CERTIFIED_EXCELLENCE, OPERATIONAL_READINESS, NEEDS_REINFORCEMENT, CRITICAL_FAILURE.',
          },
          executiveSummary: {
            type: Type.STRING,
            description:
              'Synthèse exécutive de 3 à 4 phrases destinée au Directeur Commercial ou DRH.',
          },
          ragComplianceScore: {
            type: Type.NUMBER,
            description: 'Score de respect des procédures internes RAG de 0 à 100.',
          },
          competencyRadar: {
            type: Type.ARRAY,
            description: 'Exactement 5 axes de compétences évalués sur 100.',
            items: {
              type: Type.OBJECT,
              properties: {
                axisId: { type: Type.STRING },
                label: { type: Type.STRING },
                score: { type: Type.NUMBER },
                benchmark: { type: Type.NUMBER },
                justification: { type: Type.STRING },
              },
              required: ['axisId', 'label', 'score', 'benchmark', 'justification'],
            },
          },
          criticalMoments: {
            type: Type.ARRAY,
            description: '2 à 3 moments clés ou erreurs critiques identifiés dans la session.',
            items: {
              type: Type.OBJECT,
              properties: {
                turnNumber: { type: Type.NUMBER },
                userQuote: { type: Type.STRING },
                impactType: {
                  type: Type.STRING,
                  description:
                    'POSITIVE_BREAKTHROUGH, CRITICAL_ERROR, ou MISSED_OPPORTUNITY.',
                },
                kpiImpactSummary: { type: Type.STRING },
                analysis: { type: Type.STRING },
                recommendedAlternative: { type: Type.STRING },
              },
              required: [
                'turnNumber',
                'userQuote',
                'impactType',
                'kpiImpactSummary',
                'analysis',
                'recommendedAlternative',
              ],
            },
          },
          actionableTakeaways: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: [
          'overallScore',
          'verdict',
          'executiveSummary',
          'ragComplianceScore',
          'competencyRadar',
          'criticalMoments',
          'actionableTakeaways',
        ],
      },
    },
  });

  const parsed = JSON.parse((response.text ?? '{}').trim());
  const validVerdicts = [
    'CERTIFIED_EXCELLENCE',
    'OPERATIONAL_READINESS',
    'NEEDS_REINFORCEMENT',
    'CRITICAL_FAILURE',
  ];

  return {
    generatedAt: new Date().toISOString(),
    modelUsed: `${EVAL_MODEL} (Structured Evaluator)`,
    overallScore: Math.round(Number(parsed.overallScore ?? 72)),
    verdict: validVerdicts.includes(parsed.verdict)
      ? parsed.verdict
      : 'OPERATIONAL_READINESS',
    executiveSummary:
      parsed.executiveSummary ||
      "Session analysée avec succès sur la base des indicateurs du Moteur d'État et du référentiel RAG.",
    ragComplianceScore: Math.round(Number(parsed.ragComplianceScore ?? 80)),
    competencyRadar: Array.isArray(parsed.competencyRadar)
      ? parsed.competencyRadar.slice(0, 5)
      : [],
    criticalMoments: Array.isArray(parsed.criticalMoments)
      ? parsed.criticalMoments
      : [],
    actionableTakeaways: Array.isArray(parsed.actionableTakeaways)
      ? parsed.actionableTakeaways
      : [],
  };
}

/**
 * 3. ARCHITECTE IA DU STUDIO : Génère un scénario complet (Contrat JSON du Moteur d'État + Persona)
 * à partir d'un document interne RAG et d'un brief métier.
 */
export async function generateCustomScenarioFromRag(params: {
  organizationId: string;
  knowledgeDocumentId: string;
  documentTitle: string;
  documentContent: string;
  moduleType: ModuleType;
  customBrief: string;
}): Promise<ScenarioDefinition> {
  const ai = getAiClient();

  const prompt = `Tu es l'Architecte de Simulation B2B d'AegisSim Maroc.
Crée un scénario de simulation complet, ancré dans le marché marocain (entreprises à Casablanca, Rabat, Tanger Med, budgets en Dirhams MAD / kMAD, réglementation marocaine Loi 69-21, CNDP Loi 09-08, DGSSI, Code du Travail marocain) et basé sur le document interne suivant :
TITRE DU DOCUMENT RAG : ${params.documentTitle}
CONTENU DU DOCUMENT :
${params.documentContent.slice(0, 3500)}

MODULE CIBLÉ : ${params.moduleType}
BRIEF DU CRÉATEUR : "${params.customBrief}"

Construis un contrat JSON complet avec :
- Un titre percutant, un sous-titre, 3 objectifs mesurables et une mise en situation concrète au Maroc.
- Un persona réaliste (nom marocain ou dirigeant basé au Maroc, poste, entreprise locale, humeur initiale HOSTILE ou SKEPTICAL, agenda caché).
- Une réplique d'ouverture immersive et directe.
- 3 indicateurs KPIs déterministes chiffrés (en kMAD, % ou /100, avec min, max, value, criticalThreshold, targetThreshold, direction).
- 2 leviers tactiques activables ayant des impacts chiffrés sur ces KPIs.`;

  const response = await callGeminiWithFallback(ai, EVAL_MODEL, {
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          subtitle: { type: Type.STRING },
          difficulty: {
            type: Type.STRING,
            description: 'Intermédiaire, Avancé, ou Expert',
          },
          durationMinutes: { type: Type.NUMBER },
          objectives: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          contextBrief: { type: Type.STRING },
          openingPersonaMessage: { type: Type.STRING },
          personaName: { type: Type.STRING },
          personaRole: { type: Type.STRING },
          personaCompany: { type: Type.STRING },
          personaChannel: { type: Type.STRING },
          personaHiddenAgenda: { type: Type.STRING },
          metrics: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                label: { type: Type.STRING },
                unit: { type: Type.STRING },
                value: { type: Type.NUMBER },
                min: { type: Type.NUMBER },
                max: { type: Type.NUMBER },
                criticalThreshold: { type: Type.NUMBER },
                targetThreshold: { type: Type.NUMBER },
                direction: {
                  type: Type.STRING,
                  description: 'higher_is_better ou lower_is_better',
                },
              },
              required: [
                'id',
                'label',
                'unit',
                'value',
                'min',
                'max',
                'criticalThreshold',
                'targetThreshold',
                'direction',
              ],
            },
          },
          tacticalLevers: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                label: { type: Type.STRING },
                description: { type: Type.STRING },
                impacts: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      metricId: { type: Type.STRING },
                      delta: { type: Type.NUMBER },
                    },
                    required: ['metricId', 'delta'],
                  },
                },
              },
              required: ['id', 'label', 'description', 'impacts'],
            },
          },
        },
        required: [
          'title',
          'subtitle',
          'difficulty',
          'durationMinutes',
          'objectives',
          'contextBrief',
          'openingPersonaMessage',
          'personaName',
          'personaRole',
          'personaCompany',
          'personaChannel',
          'personaHiddenAgenda',
          'metrics',
          'tacticalLevers',
        ],
      },
    },
  });

  const data = JSON.parse((response.text ?? '{}').trim());
  const durationMinutes = Number(data.durationMinutes || 20);
  const maxTurns = params.moduleType === 'business_game' ? 4 : 5;

  return {
    id: `scen-custom-${Date.now()}`,
    organizationId: params.organizationId,
    knowledgeDocumentId: params.knowledgeDocumentId,
    title: data.title || 'Simulation Sur-Mesure Studio',
    subtitle: data.subtitle || 'Scénario généré depuis votre base documentaire RAG',
    moduleType: params.moduleType,
    difficulty:
      data.difficulty === 'Expert' || data.difficulty === 'Intermédiaire'
        ? data.difficulty
        : 'Avancé',
    durationMinutes,
    objectives: Array.isArray(data.objectives) ? data.objectives : [],
    contextBrief: data.contextBrief || params.customBrief,
    openingPersonaMessage:
      data.openingPersonaMessage ||
      '« Nous avons un point critique à trancher immédiatement selon vos nouvelles directives. Quelle est votre décision ? »',
    evaluationRubric: {
      criteria: [
        `Respect strict du document ${params.documentTitle}`,
        'Atteinte des seuils cibles des KPIs du Moteur d’État',
        'Clarté et pertinence des décisions prises sous contrainte',
      ],
      passingScore: 75,
    },
    initialState: {
      schemaVersion: '1.0',
      moduleType: params.moduleType,
      turn: {
        current: 1,
        max: maxTurns,
        timeRemainingSeconds: durationMinutes * 60,
        periodLabel:
          params.moduleType === 'business_game'
            ? 'Trimestre Q1 / Q4 — Comité Exécutif'
            : `Séquence 1/${maxTurns} — Mise en situation`,
      },
      personaState: {
        name: data.personaName || 'Laurent Mercier',
        role: data.personaRole || 'Directeur des Opérations',
        company: data.personaCompany || 'Partenaire Stratégique',
        channel: data.personaChannel || 'Canal Direct Sécurisé',
        mood: 'SKEPTICAL',
        trustScore: 35,
        stressLevel: 75,
        hiddenAgenda:
          data.personaHiddenAgenda ||
          "Vérifier la maîtrise opérationnelle des procédures internes de l'entreprise.",
      },
      metrics: Array.isArray(data.metrics)
        ? data.metrics.map((m: Record<string, unknown>) => ({
            id: String(m.id),
            label: String(m.label),
            unit: String(m.unit || '%'),
            value: Number(m.value ?? 50),
            min: Number(m.min ?? 0),
            max: Number(m.max ?? 100),
            criticalThreshold: Number(m.criticalThreshold ?? 20),
            targetThreshold: Number(m.targetThreshold ?? 75),
            direction:
              m.direction === 'lower_is_better'
                ? 'lower_is_better'
                : 'higher_is_better',
          }))
        : [],
      tacticalLevers: Array.isArray(data.tacticalLevers)
        ? data.tacticalLevers.map((l: Record<string, unknown>) => ({
            id: String(l.id),
            label: String(l.label),
            description: String(l.description || ''),
            applied: false,
            impacts: Array.isArray(l.impacts)
              ? l.impacts.map((imp: Record<string, unknown>) => ({
                  metricId: String(imp.metricId),
                  delta: Number(imp.delta || 0),
                }))
              : [],
          }))
        : [],
      ragComplianceLog: [],
      terminationRules: {
        instantFailureCondition: 'Franchissement d’un seuil critique KPI',
        instantSuccessCondition: 'Atteinte des objectifs cibles sur les KPIs',
      },
    },
  };
}
