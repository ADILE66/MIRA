'use client';

import React, { useState, useEffect } from 'react';
import {
  OrganizationTenant,
  UserProfile,
  KnowledgeDocument,
  ScenarioDefinition,
  SimulationSession,
  ModuleType,
} from '@/lib/types';
import {
  INITIAL_ORGANIZATIONS,
  INITIAL_USERS,
  INITIAL_KNOWLEDGE_DOCUMENTS,
  INITIAL_SCENARIOS,
} from '@/lib/seed-data';
import { POSTGRES_MULTI_TENANT_DDL } from '@/lib/db-schema-reference';
import SimulationCockpit from '@/components/SimulationCockpit';
import StudioRagBuilder from '@/components/StudioRagBuilder';
import EvaluationDebrief from '@/components/EvaluationDebrief';
import ArchitectureBlueprintView from '@/components/ArchitectureBlueprintView';
import {
  Play,
  Clock,
  BookOpen,
  Sliders,
  Loader2,
  ArrowRight,
  Layers,
  Award,
} from 'lucide-react';

type MainView = 'catalog' | 'cockpit' | 'studio' | 'debrief' | 'architecture';

export default function MiraStudioPlatformPage() {
  const [activeView, setActiveView] = useState<MainView>('catalog');
  const [selectedModuleFilter, setSelectedModuleFilter] = useState<
    'all' | ModuleType
  >('all');

  const [organizations, setOrganizations] = useState<OrganizationTenant[]>(
    INITIAL_ORGANIZATIONS
  );
  const [activeOrg, setActiveOrg] = useState<OrganizationTenant>(
    INITIAL_ORGANIZATIONS[0]
  );
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_USERS);
  const [knowledgeDocuments, setKnowledgeDocuments] = useState<
    KnowledgeDocument[]
  >(INITIAL_KNOWLEDGE_DOCUMENTS);
  const [scenarios, setScenarios] =
    useState<ScenarioDefinition[]>(INITIAL_SCENARIOS);
  const [postgresSchemaDdl, setPostgresSchemaDdl] = useState<string>(
    POSTGRES_MULTI_TENANT_DDL
  );

  const [activeSession, setActiveSession] = useState<SimulationSession | null>(
    null
  );
  const [isStartingSessionId, setIsStartingSessionId] = useState<string | null>(
    null
  );
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Sync with server-side bootstrap store
  useEffect(() => {
    async function loadBootstrap() {
      try {
        const res = await fetch('/api/bootstrap');
        if (res.ok) {
          const data = await res.json();
          if (data.organizations?.length) setOrganizations(data.organizations);
          if (data.users?.length) setUsers(data.users);
          if (data.knowledgeDocuments?.length)
            setKnowledgeDocuments(data.knowledgeDocuments);
          if (data.scenarios?.length) setScenarios(data.scenarios);
          if (data.postgresSchemaDdl)
            setPostgresSchemaDdl(data.postgresSchemaDdl);
        }
      } catch {
        // Fallback to local seed state already initialized
      }
    }
    loadBootstrap();
  }, []);

  const handleStartSimulation = async (scenario: ScenarioDefinition) => {
    setIsStartingSessionId(scenario.id);
    try {
      const response = await fetch('/api/simulation/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioId: scenario.id,
          organizationId: activeOrg.id,
          userId: users[0]?.id || 'usr-sales-vp',
        }),
      });
      const data = await response.json();
      if (response.ok && data.session) {
        setActiveSession(data.session);
        setActiveView('cockpit');
      }
    } finally {
      setIsStartingSessionId(null);
    }
  };

  const handleTriggerEvaluation = async (sessionId: string) => {
    setIsEvaluating(true);
    try {
      const response = await fetch('/api/simulation/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });
      const data = await response.json();
      if (response.ok && data.session) {
        setActiveSession(data.session);
        setActiveView('debrief');
      }
    } finally {
      setIsEvaluating(false);
    }
  };

  const filteredScenarios =
    selectedModuleFilter === 'all'
      ? scenarios
      : scenarios.filter((s) => s.moduleType === selectedModuleFilter);

  const activeScenario = activeSession
    ? scenarios.find((s) => s.id === activeSession.scenarioId) || scenarios[0]
    : scenarios[0];

  const activeKnowledgeDoc = knowledgeDocuments.find(
    (d) => d.id === activeScenario?.knowledgeDocumentId
  );

  const getModuleLabel = (m: ModuleType) => {
    switch (m) {
      case 'upskilling':
        return '01. Formation & Upskilling';
      case 'business_game':
        return '02. Simulation Stratégique (Business Game)';
      case 'recruitment':
        return '03. Recrutement (Gamified Assessment)';
      case 'onboarding':
        return '04. Onboarding & Conduite du Changement';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F17] text-slate-100">
      {/* STRICT 3-ZONE TOP BAR CONTRACT */}
      <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-slate-800 bg-[#0B0F17]/95 sticky top-0 z-30 backdrop-blur-md">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveView('catalog')}
          className="text-lg font-bold tracking-tight text-white font-display whitespace-nowrap shrink-0 cursor-pointer"
        >
          MiraStudio
        </button>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={() => setActiveView('catalog')}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              activeView === 'catalog'
                ? 'text-white underline underline-offset-8 decoration-blue-500'
                : ''
            }`}
          >
            Modules
          </button>
          <button
            onClick={() => {
              if (activeSession) {
                setActiveView('cockpit');
              } else {
                handleStartSimulation(scenarios[0]);
              }
            }}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              activeView === 'cockpit'
                ? 'text-white underline underline-offset-8 decoration-blue-500'
                : ''
            }`}
          >
            Cockpit
          </button>
          <button
            onClick={() => setActiveView('studio')}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              activeView === 'studio'
                ? 'text-white underline underline-offset-8 decoration-blue-500'
                : ''
            }`}
          >
            Studio RAG
          </button>
          <button
            onClick={() => {
              if (activeSession?.evaluationReport) {
                setActiveView('debrief');
              } else {
                setActiveView('architecture');
              }
            }}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              activeView === 'debrief'
                ? 'text-white underline underline-offset-8 decoration-blue-500'
                : ''
            }`}
          >
            Évaluations
          </button>
          <button
            onClick={() => setActiveView('architecture')}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              activeView === 'architecture'
                ? 'text-white underline underline-offset-8 decoration-blue-500'
                : ''
            }`}
          >
            Architecture
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              if (activeSession && activeSession.status === 'active') {
                setActiveView('cockpit');
              } else {
                handleStartSimulation(scenarios[0]);
              }
            }}
            className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors whitespace-nowrap shrink-0"
          >
            {activeSession && activeSession.status === 'active'
              ? 'Reprendre la Simulation'
              : 'Lancer Simulation'}
          </button>
        </div>
      </header>

      {/* MAIN VIEWPORT CONTENT */}
      <main className="flex-1">
        {/* VIEW 1: CATALOG & HERO (1 ENGINE, 4 MODULES) */}
        {activeView === 'catalog' && (
          <div className="max-w-[1440px] mx-auto px-6 py-10 space-y-12">
            {/* Hero Section */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pb-10 border-b border-slate-800">
              <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    <span>Tenant Actif : {activeOrg.name}</span>
                    <span aria-hidden="true">·</span>
                    <span>Éligible CSF (OFPPT / GIAC)</span>
                    <span aria-hidden="true">·</span>
                    <span>Conformité Loi 69-21, CNDP 09-08 & DGSSI</span>
                  </div>

                  <h1
                    className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white font-display tracking-tight leading-[1.12]"
                    style={{ textWrap: 'balance' }}
                  >
                    Le simulateur de vol tactique pour les entreprises, ETI et
                    Business Schools au Maroc.
                  </h1>

                  <p className="text-base text-slate-300 leading-relaxed max-w-2xl">
                    Remplacez les formations passives et les recrutements
                    subjectifs par des mises en situation ancrées dans la réalité
                    économique marocaine (Casablanca Finance City, Tanger Med,
                    Casanearshore). Notre moteur hybride sépare le{' '}
                    <strong className="text-white font-medium">
                      Moteur d’État déterministe (KPIs en MAD/Dirhams)
                    </strong>{' '}
                    du{' '}
                    <strong className="text-white font-medium">
                      Moteur Narratif IA
                    </strong>{' '}
                    adossé à vos référentiels internes (Loi 69-21 délais de
                    paiement, Loi 09-08 CNDP, DGSSI).
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    onClick={() => handleStartSimulation(scenarios[0])}
                    disabled={isStartingSessionId !== null}
                    className="px-5 py-3 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
                  >
                    {isStartingSessionId === scenarios[0].id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                    Lancer Template #1 : Crise Logistique Tanger Med (MAD)
                  </button>

                  <button
                    onClick={() =>
                      handleStartSimulation(scenarios[1] || scenarios[0])
                    }
                    disabled={isStartingSessionId !== null}
                    className="px-5 py-3 text-xs font-medium text-slate-200 bg-[#111827] hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
                  >
                    {isStartingSessionId === scenarios[1]?.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sliders className="w-4 h-4 text-blue-400" />
                    )}
                    Lancer Template #2 : Business Game CFC & Afrique (4 Trimestres)
                  </button>

                  <button
                    onClick={() => setActiveView('studio')}
                    className="px-4 py-3 text-xs font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
                  >
                    <span>Ouvrir le Studio RAG Maroc</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Right Column of Hero: Live Hybrid Architecture Preview Card */}
              <div className="lg:col-span-5 p-6 bg-[#111827] border border-slate-800 rounded-xl flex flex-col justify-between space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-blue-400">
                      ARCHITECTURE MOTEUR HYBRIDE MAROC
                    </span>
                    <span className="font-mono text-slate-400">
                      Zéro Hallucination KPI
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold text-white font-display">
                    Ancrage Réglementaire & Économique Marocain
                  </h2>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 bg-[#0B0F17] border border-slate-800 rounded-lg space-y-1">
                    <div className="flex items-center justify-between font-mono">
                      <span className="text-emerald-400">
                        01. Moteur d’État Déterministe (MAD / kMAD)
                      </span>
                      <span className="text-slate-500">TypeScript Reducer</span>
                    </div>
                    <p className="text-slate-400">
                      Calcule la trésorerie en Dirhams, la marge brute, le BFR
                      (Loi 69-21 : 60j max) et le chronomètre avec plafonds
                      stricts.
                    </p>
                  </div>

                  <div className="p-3.5 bg-[#0B0F17] border border-slate-800 rounded-lg space-y-1">
                    <div className="flex items-center justify-between font-mono">
                      <span className="text-blue-400">
                        02. Moteur Narratif & RAG (CNDP / DGSSI)
                      </span>
                      <span className="text-slate-500">gemini-4-hydrogen</span>
                    </div>
                    <p className="text-slate-400">
                      Incarne un DSI à Tanger Med, un Board à Casablanca Finance
                      City ou une Tech Lead à Casanearshore et audite vos lois
                      et procédures.
                    </p>
                  </div>

                  <div className="p-3.5 bg-[#0B0F17] border border-slate-800 rounded-lg space-y-1">
                    <div className="flex items-center justify-between font-mono">
                      <span className="text-amber-400">
                        03. Agent Évaluateur & Dossier CSF / GIAC
                      </span>
                      <span className="text-slate-500">Radar 5 Axes</span>
                    </div>
                    <p className="text-slate-400">
                      Génère le bilan d’évaluation individuel exploitable par
                      les DRH et Cabinets pour les bilans de compétences et
                      dossiers OFPPT.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400">
                  <span>
                    {knowledgeDocuments.length} référentiels RAG actifs
                  </span>
                  <button
                    onClick={() => setActiveView('architecture')}
                    className="text-blue-400 hover:text-blue-300 font-medium"
                  >
                    Inspecter le Schéma PostgreSQL →
                  </button>
                </div>
              </div>
            </section>

            {/* Full-Width 4-Column Architecture Overview Strip (1 Engine, 4 Modules) */}
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-white font-display">
                    Un Moteur Unique, 4 Modules Opérationnels
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Filtrez le catalogue de simulations par cas d’usage B2B ou
                    créez votre propre scénario dans le Studio RAG
                  </p>
                </div>

                {/* Interactive Segmented Filter Controls */}
                <div className="flex flex-wrap items-center gap-1 p-1 bg-[#111827] border border-slate-800 rounded-lg">
                  {(
                    [
                      { id: 'all', label: 'Tous les Modules (4)' },
                      { id: 'upskilling', label: '01. Formation' },
                      { id: 'business_game', label: '02. Business Game' },
                      { id: 'recruitment', label: '03. Recrutement' },
                      { id: 'onboarding', label: '04. Onboarding' },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedModuleFilter(tab.id)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                        selectedModuleFilter === tab.id
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scenarios Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                {filteredScenarios.map((scenario) => {
                  const attachedDoc = knowledgeDocuments.find(
                    (d) => d.id === scenario.knowledgeDocumentId
                  );
                  const isStarting = isStartingSessionId === scenario.id;

                  return (
                    <div
                      key={scenario.id}
                      className="p-6 bg-[#111827] border border-slate-800 rounded-xl flex flex-col justify-between space-y-6 hover:border-slate-700 transition-colors"
                    >
                      <div className="space-y-4">
                        {/* Unboxed Metadata Line with typographic separators */}
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                          <div className="flex items-center gap-2">
                            <span className="text-blue-400 font-medium">
                              {getModuleLabel(scenario.moduleType)}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>Difficulté {scenario.difficulty}</span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono tabular-nums flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {scenario.durationMinutes} min (
                              {scenario.initialState.turn.max} séquences)
                            </span>
                          </div>
                          {scenario.isFlagship && (
                            <span className="font-mono text-emerald-400">
                              ★ Scénario Phare MVP
                            </span>
                          )}
                        </div>

                        <div>
                          <h3 className="text-xl font-semibold text-white font-display">
                            {scenario.title}
                          </h3>
                          <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                            {scenario.subtitle}
                          </p>
                        </div>

                        {/* Persona & RAG Document Link */}
                        <div className="p-4 bg-[#0B0F17] border border-slate-800/90 rounded-lg space-y-2.5 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">
                              Persona IA Adaptatif :
                            </span>
                            <span className="font-medium text-white">
                              {scenario.initialState.personaState.name} —{' '}
                              {scenario.initialState.personaState.role}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400 flex items-center gap-1.5">
                              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                              Référentiel RAG Audité :
                            </span>
                            <span className="text-slate-200 truncate max-w-[260px]">
                              {attachedDoc?.title || 'Procédure Interne'}
                            </span>
                          </div>
                        </div>

                        {/* Deterministic KPIs Preview */}
                        <div className="space-y-2">
                          <div className="text-xs font-medium text-slate-400">
                            Variables Chiffrées du Moteur d’État :
                          </div>
                          <div className="grid grid-cols-3 gap-2.5">
                            {scenario.initialState.metrics
                              .slice(0, 3)
                              .map((metric) => (
                                <div
                                  key={metric.id}
                                  className="p-2.5 bg-[#0B0F17] border border-slate-800/80 rounded-lg"
                                >
                                  <div className="text-[11px] text-slate-400 truncate">
                                    {metric.label}
                                  </div>
                                  <div className="mt-1 flex items-baseline justify-between font-mono tabular-nums">
                                    <span className="text-sm font-semibold text-white">
                                      {metric.value}
                                      {metric.unit}
                                    </span>
                                    <span className="text-[10px] text-blue-400">
                                      Cible {metric.targetThreshold}
                                      {metric.unit}
                                    </span>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
                        <div className="text-xs text-slate-400 font-mono tabular-nums">
                          {scenario.initialState.tacticalLevers.length} leviers
                          tactiques · Seuil réussite{' '}
                          {scenario.evaluationRubric.passingScore}/100
                        </div>

                        <button
                          onClick={() => handleStartSimulation(scenario)}
                          disabled={isStarting}
                          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
                        >
                          {isStarting ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              Initialisation...
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5" />
                              Entrer dans le Cockpit
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: ACTIVE SIMULATION COCKPIT */}
        {activeView === 'cockpit' && activeSession && activeScenario && (
          <SimulationCockpit
            session={activeSession}
            scenario={activeScenario}
            knowledgeDocument={activeKnowledgeDoc}
            onSessionUpdated={(updated) => setActiveSession(updated)}
            onTriggerEvaluation={handleTriggerEvaluation}
            isEvaluating={isEvaluating}
          />
        )}

        {/* VIEW 3: STUDIO RAG & AI SCENARIO ARCHITECT */}
        {activeView === 'studio' && (
          <StudioRagBuilder
            organizationId={activeOrg.id}
            knowledgeDocuments={knowledgeDocuments}
            scenarios={scenarios}
            onDocumentCreated={(newDoc) =>
              setKnowledgeDocuments((prev) => [newDoc, ...prev])
            }
            onScenarioGenerated={(newScen, autoStart) => {
              setScenarios((prev) => {
                const exists = prev.some((s) => s.id === newScen.id);
                return exists ? prev : [newScen, ...prev];
              });
              if (autoStart) {
                handleStartSimulation(newScen);
              }
            }}
            onLaunchExistingScenario={(scen) => handleStartSimulation(scen)}
          />
        )}

        {/* VIEW 4: EVALUATOR AGENT DEBRIEFING & 5-AXIS RADAR */}
        {activeView === 'debrief' &&
          activeSession &&
          activeSession.evaluationReport &&
          activeScenario && (
            <EvaluationDebrief
              session={activeSession}
              scenario={activeScenario}
              report={activeSession.evaluationReport}
              onRestartScenario={() => handleStartSimulation(activeScenario)}
              onBackToCatalog={() => setActiveView('catalog')}
            />
          )}

        {/* VIEW 5: MULTI-TENANT ARCHITECTURE & POSTGRESQL DDL BLUEPRINT */}
        {activeView === 'architecture' && (
          <ArchitectureBlueprintView
            postgresSchemaDdl={postgresSchemaDdl}
            organizations={organizations}
            users={users}
            activeOrg={activeOrg}
            onSelectOrg={(org) => setActiveOrg(org)}
          />
        )}
      </main>

      {/* Quiet Footer */}
      <footer className="px-6 py-5 border-t border-slate-800/80 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-300 font-display">
            MiraStudio
          </span>
          <span aria-hidden="true">·</span>
          <span>
            Simulateur B2B Hybride (Moteur d’État Déterministe + Moteur Narratif
            Gemini + RAG)
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveView('catalog')}
            className="hover:text-slate-300 transition-colors"
          >
            Catalogue des 4 Modules
          </button>
          <button
            onClick={() => setActiveView('studio')}
            className="hover:text-slate-300 transition-colors"
          >
            Studio RAG
          </button>
          <button
            onClick={() => setActiveView('architecture')}
            className="hover:text-slate-300 transition-colors"
          >
            Schéma Multi-Tenant PostgreSQL
          </button>
        </div>
      </footer>
    </div>
  );
}
