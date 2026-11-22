export type ModuleType = 'upskilling' | 'business_game' | 'recruitment' | 'onboarding';

export type PersonaMood = 'HOSTILE' | 'SKEPTICAL' | 'NEUTRAL' | 'OPEN' | 'CONVINCED';

export type RagComplianceStatus = 'RESPECTED' | 'VIOLATED' | 'NEUTRAL';

export interface SimulationMetric {
  id: string;
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  criticalThreshold: number;
  targetThreshold: number;
  direction: 'higher_is_better' | 'lower_is_better';
}

export interface TacticalLever {
  id: string;
  label: string;
  description: string;
  applied: boolean;
  impacts: {
    metricId: string;
    delta: number;
  }[];
  ragRuleId?: string;
}

export interface RagComplianceEntry {
  turn: number;
  chunkId: string;
  ruleTitle: string;
  status: RagComplianceStatus;
  explanation: string;
}

export interface SimulationStateContract {
  schemaVersion: '1.0';
  moduleType: ModuleType;
  turn: {
    current: number;
    max: number;
    timeRemainingSeconds: number;
    periodLabel: string;
  };
  personaState: {
    name: string;
    role: string;
    company: string;
    channel: string;
    mood: PersonaMood;
    trustScore: number;
    stressLevel: number;
    hiddenAgenda: string;
  };
  metrics: SimulationMetric[];
  tacticalLevers: TacticalLever[];
  ragComplianceLog: RagComplianceEntry[];
  terminationRules: {
    instantFailureCondition: string;
    instantSuccessCondition: string;
  };
}

export interface MetricDeltaRecord {
  metricId: string;
  metricLabel: string;
  previousValue: number;
  newValue: number;
  delta: number;
  unit: string;
  reason: string;
}

export interface SimulationTurnEntry {
  turnNumber: number;
  periodLabel: string;
  timestamp: string;
  userMessage: string;
  appliedLeverIds: string[];
  aiNarrativeReply: string;
  tacticalEventTitle?: string;
  personaMoodAfter: PersonaMood;
  metricDeltas: MetricDeltaRecord[];
  ragAssessment?: RagComplianceEntry;
}

export interface CompetencyAxisScore {
  axisId: string;
  label: string;
  score: number; // 0 to 100
  benchmark: number; // Target benchmark 0 to 100
  justification: string;
}

export interface CriticalMomentAnalysis {
  turnNumber: number;
  userQuote: string;
  impactType: 'POSITIVE_BREAKTHROUGH' | 'CRITICAL_ERROR' | 'MISSED_OPPORTUNITY';
  kpiImpactSummary: string;
  analysis: string;
  recommendedAlternative: string;
}

export interface EvaluationReport {
  generatedAt: string;
  modelUsed: string;
  overallScore: number;
  verdict: 'CERTIFIED_EXCELLENCE' | 'OPERATIONAL_READINESS' | 'NEEDS_REINFORCEMENT' | 'CRITICAL_FAILURE';
  executiveSummary: string;
  ragComplianceScore: number;
  competencyRadar: CompetencyAxisScore[];
  criticalMoments: CriticalMomentAnalysis[];
  actionableTakeaways: string[];
}

export interface KnowledgeChunk {
  id: string;
  title: string;
  content: string;
  keywords: string[];
  mandatoryRule: string;
}

export interface KnowledgeDocument {
  id: string;
  organizationId: string;
  title: string;
  category:
    | 'sales_playbook'
    | 'hr_policy'
    | 'cyber_procedure'
    | 'finance_rules'
    | 'moroccan_compliance';
  version: string;
  rawContent: string;
  chunks: KnowledgeChunk[];
  createdAt: string;
}

export interface ScenarioDefinition {
  id: string;
  organizationId: string;
  knowledgeDocumentId: string;
  title: string;
  subtitle: string;
  moduleType: ModuleType;
  difficulty: 'Intermédiaire' | 'Avancé' | 'Expert';
  durationMinutes: number;
  objectives: string[];
  contextBrief: string;
  openingPersonaMessage: string;
  initialState: SimulationStateContract;
  evaluationRubric: {
    criteria: string[];
    passingScore: number;
  };
  isFlagship?: boolean;
}

export interface OrganizationTenant {
  id: string;
  name: string;
  slug: string;
  sector: string;
  planTier: 'Enterprise' | 'WhiteLabel' | 'Growth';
  brandColor: string;
  activeUsersCount: number;
}

export interface UserProfile {
  id: string;
  uid: string;
  name: string;
  email: string;
  role: 'Directeur Commercial' | 'DRH / Talent Lead' | 'Consultant / Coach' | 'Candidat / Apprenant';
  organizationId: string;
}

export interface SimulationSession {
  id: string;
  scenarioId: string;
  organizationId: string;
  userId: string;
  status: 'active' | 'won' | 'lost' | 'completed';
  statusReason?: string;
  currentState: SimulationStateContract;
  turnHistory: SimulationTurnEntry[];
  evaluationReport?: EvaluationReport;
  startedAt: string;
  completedAt?: string;
}
