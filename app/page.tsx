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
import LandingPageView from '@/components/LandingPageView';
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

type MainView = 'landing' | 'catalog' | 'cockpit' | 'studio' | 'debrief' | 'architecture';

export default function MiraStudioPlatformPage() {
  const [activeView, setActiveView] = useState<MainView>('landing');
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
    <div className="min-h-screen flex flex-col bg-light-surface text-light-on-surface">
      {/* STRICT 3-ZONE TOP BAR CONTRACT — STITCH CORPORATE STYLE */}
      <header className="bg-light-surface-container-lowest border-b border-light-outline-variant px-6 py-3 flex items-center justify-between gap-6 sticky top-0 z-30 shadow-xs backdrop-blur-md">
        {/* Zone 1: Single text element wordmark + Aviation / Simulation Mark */}
        <button
          onClick={() => setActiveView('landing')}
          className="flex items-center gap-3 text-left cursor-pointer group"
        >
          <div className="w-8 h-8 rounded bg-light-primary text-light-on-primary flex items-center justify-center font-bold text-sm shadow-xs group-hover:bg-light-primary-container transition-colors">
            <span className="material-symbols-outlined text-lg" aria-hidden="true">flight_takeoff</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-headline text-lg font-bold text-light-on-surface tracking-tight">
                MiraStudio
              </span>
              <span className="px-2 py-0.5 rounded-full bg-light-secondary-container text-light-on-secondary-container font-mono text-[11px] font-semibold">
                Simulateur B2B
              </span>
            </div>
            <span className="text-[11px] text-light-on-surface-variant font-medium">
              Tenant : {activeOrg.name.split(' (')[0]}
            </span>
          </div>
        </button>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-1.5 text-xs font-semibold">
          {[
            { id: 'landing', label: 'Accueil' },
            { id: 'catalog', label: 'Catalogue des 4 Modules' },
            { id: 'cockpit', label: 'Cockpit Simulation' },
            { id: 'studio', label: 'Studio RAG' },
            { id: 'debrief', label: 'Évaluations' },
            { id: 'architecture', label: 'Marque Blanche & RLS' },
          ].map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'cockpit') {
                    if (activeSession) setActiveView('cockpit');
                    else handleStartSimulation(scenarios[0]);
                  } else if (item.id === 'debrief') {
                    if (activeSession?.evaluationReport) setActiveView('debrief');
                    else setActiveView('architecture');
                  } else {
                    setActiveView(item.id as MainView);
                  }
                }}
                className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                  isActive
                    ? 'bg-light-secondary-container text-light-primary font-bold shadow-xs'
                    : 'text-light-on-surface-variant hover:text-light-on-surface hover:bg-light-surface-container'
                }`}
              >
                {item.label}
              </button>
            );
          })}
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
            className="px-4 py-2 text-xs font-semibold text-light-on-primary bg-light-primary rounded hover:bg-light-primary-container transition-colors whitespace-nowrap shrink-0 shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">play_arrow</span>
            <span>
              {activeSession && activeSession.status === 'active'
                ? 'Reprendre la Simulation'
                : 'Lancer Simulation'}
            </span>
          </button>
        </div>
      </header>

      {/* MAIN VIEWPORT CONTENT */}
      <main className="flex-1">
        {/* VIEW 0: LANDING PAGE */}
        {activeView === 'landing' && (
          <LandingPageView
            onStartSimulation={handleStartSimulation}
            onNavigateToCatalog={(moduleFilter) => {
              if (moduleFilter) setSelectedModuleFilter(moduleFilter);
              setActiveView('catalog');
            }}
            onNavigateToStudio={() => setActiveView('studio')}
            onNavigateToArchitecture={() => setActiveView('architecture')}
            scenarios={scenarios}
            activeOrg={activeOrg}
          />
        )}

        {/* VIEW 1: CATALOG & HERO (1 ENGINE, 4 MODULES) */}
        {activeView === 'catalog' && (
          <div className="max-w-[1440px] mx-auto px-6 py-10 space-y-12">
            {/* Hero Section */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pb-10 border-b border-light-outline-variant">
              <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-light-on-surface-variant font-medium">
                    <span className="px-2 py-0.5 rounded bg-light-surface-container-low border border-light-outline-variant font-mono">
                      Tenant Actif : {activeOrg.name.split(' (')[0]}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="text-success font-semibold">Éligible CSF (OFPPT / GIAC)</span>
                    <span aria-hidden="true">·</span>
                    <span>Conformité Loi 69-21, CNDP 09-08 & DGSSI</span>
                  </div>

                  <h1
                    className="text-3xl sm:text-4xl lg:text-5xl font-bold text-light-on-surface font-headline tracking-tight leading-[1.15]"
                    style={{ textWrap: 'balance' }}
                  >
                    Le simulateur de vol tactique pour les entreprises, ETI et Business Schools.
                  </h1>

                  <p className="text-base text-light-on-surface-variant leading-relaxed max-w-2xl">
                    Remplacez les formations passives et les recrutements subjectifs par des mises en situation réalistes.
                    Notre moteur hybride sépare le{' '}
                    <strong className="text-light-on-surface font-semibold">
                      Moteur d’État déterministe (KPIs stricts sans hallucination)
                    </strong>{' '}
                    du{' '}
                    <strong className="text-light-on-surface font-semibold">
                      Moteur Narratif IA (Gemini 2.5 Flash)
                    </strong>{' '}
                    adossé à vos référentiels et documents internes RAG.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    onClick={() => handleStartSimulation(scenarios[0])}
                    disabled={isStartingSessionId !== null}
                    className="px-5 py-3 text-xs font-semibold text-light-on-primary bg-light-primary hover:bg-light-primary-container rounded transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 shadow-xs cursor-pointer"
                  >
                    {isStartingSessionId === scenarios[0].id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <span className="material-symbols-outlined text-base">flight_takeoff</span>
                    )}
                    <span>Lancer Module #1 : Crise Logistique & SLA</span>
                  </button>

                  <button
                    onClick={() =>
                      handleStartSimulation(scenarios[1] || scenarios[0])
                    }
                    disabled={isStartingSessionId !== null}
                    className="px-5 py-3 text-xs font-semibold text-light-on-surface bg-light-surface-container-lowest hover:bg-light-surface-container border border-light-outline-variant rounded transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 shadow-xs cursor-pointer"
                  >
                    {isStartingSessionId === scenarios[1]?.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <span className="material-symbols-outlined text-base text-light-primary">bar_chart</span>
                    )}
                    <span>Lancer Module #2 : Business Game (4 Trimestres)</span>
                  </button>

                  <button
                    onClick={() => setActiveView('studio')}
                    className="px-4 py-3 text-xs font-semibold text-light-primary hover:text-light-primary-container transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>Ouvrir le Studio RAG</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Right Column of Hero: Live Hybrid Architecture Preview Card */}
              <div className="lg:col-span-5 p-6 bg-light-surface-container-lowest border border-light-outline-variant rounded-xl shadow-xs flex flex-col justify-between space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-light-primary font-semibold">
                      ARCHITECTURE MOTEUR HYBRIDE
                    </span>
                    <span className="px-2 py-0.5 rounded bg-success-container text-on-success-container font-mono text-[11px] font-semibold">
                      Zéro Hallucination KPI
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-light-on-surface font-headline">
                    Ancrage Documentaire & Rigueur Décisionnelle
                  </h2>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 bg-light-surface-container-low border border-light-outline-variant rounded-lg space-y-1">
                    <div className="flex items-center justify-between font-mono">
                      <span className="text-success font-semibold">
                        01. Moteur d’État Déterministe
                      </span>
                      <span className="text-light-on-surface-variant font-medium">TypeScript Reducer</span>
                    </div>
                    <p className="text-light-on-surface-variant">
                      Calcule la trésorerie, la marge brute, les seuils critiques et le chronomètre avec plafonds stricts.
                    </p>
                  </div>

                  <div className="p-3.5 bg-light-surface-container-low border border-light-outline-variant rounded-lg space-y-1">
                    <div className="flex items-center justify-between font-mono">
                      <span className="text-light-primary font-semibold">
                        02. Moteur Narratif & RAG
                      </span>
                      <span className="text-light-on-surface-variant font-medium">Gemini 2.5 Flash</span>
                    </div>
                    <p className="text-light-on-surface-variant">
                      Incarne des personas adaptatifs et audite en temps réel vos politiques et procédures internes.
                    </p>
                  </div>

                  <div className="p-3.5 bg-light-surface-container-low border border-light-outline-variant rounded-lg space-y-1">
                    <div className="flex items-center justify-between font-mono">
                      <span className="text-warning font-semibold">
                        03. Agent Évaluateur Structuré
                      </span>
                      <span className="text-light-on-surface-variant font-medium">Radar 5 Axes</span>
                    </div>
                    <p className="text-light-on-surface-variant">
                      Génère le bilan d’évaluation individuel certifié avec moments critiques et reformulations idéales.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-light-outline-variant text-xs text-light-on-surface-variant">
                  <span>{knowledgeDocuments.length} référentiels RAG actifs</span>
                  <button
                    onClick={() => setActiveView('architecture')}
                    className="text-light-primary hover:underline font-semibold"
                  >
                    Inspecter le Schéma PostgreSQL →
                  </button>
                </div>
              </div>
            </section>

            {/* Full-Width 4-Column Architecture Overview Strip (1 Engine, 4 Modules) */}
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-light-on-surface font-headline">
                    Un Moteur Unique, 4 Modules Opérationnels
                  </h2>
                  <p className="text-xs text-light-on-surface-variant mt-1">
                    Filtrez le catalogue de simulations par cas d’usage B2B ou créez votre propre scénario dans le Studio RAG.
                  </p>
                </div>

                {/* Interactive Segmented Filter Controls */}
                <div className="flex flex-wrap items-center gap-1 p-1 bg-light-surface-container border border-light-outline-variant rounded-lg">
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
                      className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        selectedModuleFilter === tab.id
                          ? 'bg-light-primary text-light-on-primary shadow-xs'
                          : 'text-light-on-surface-variant hover:text-light-on-surface hover:bg-light-surface-container-low'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scenarios Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredScenarios.map((scenario) => {
                  const attachedDoc = knowledgeDocuments.find(
                    (d) => d.id === scenario.knowledgeDocumentId
                  );
                  const isStarting = isStartingSessionId === scenario.id;

                  return (
                    <article
                      key={scenario.id}
                      className="p-6 bg-light-surface-container-lowest border border-light-outline-variant rounded-xl shadow-xs flex flex-col justify-between space-y-6 hover:border-light-primary transition-colors"
                    >
                      <div className="space-y-4">
                        {/* Unboxed Metadata Line with typographic separators */}
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-light-on-surface-variant">
                          <div className="flex items-center gap-2 font-medium">
                            <span className="px-2 py-0.5 rounded-full bg-light-secondary-container text-light-on-secondary-container font-mono text-[11px] font-semibold">
                              {getModuleLabel(scenario.moduleType)}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>Difficulté {scenario.difficulty}</span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono tabular-nums flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {scenario.durationMinutes} min ({scenario.initialState.turn.max} séquences)
                            </span>
                          </div>
                          {scenario.isFlagship && (
                            <span className="font-mono text-success font-semibold px-2 py-0.5 rounded bg-success-container text-on-success-container text-[11px]">
                              ★ Scénario Phare
                            </span>
                          )}
                        </div>

                        <div>
                          <h3 className="text-xl font-bold text-light-on-surface font-headline">
                            {scenario.title}
                          </h3>
                          <p className="text-xs text-light-on-surface-variant mt-1.5 leading-relaxed">
                            {scenario.subtitle}
                          </p>
                        </div>

                        {/* Persona & RAG Document Link */}
                        <div className="p-3.5 bg-light-surface-container-low border border-light-outline-variant rounded-lg space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-light-on-surface-variant">
                              Persona IA Adaptatif :
                            </span>
                            <span className="font-semibold text-light-on-surface">
                              {scenario.initialState.personaState.name} — {scenario.initialState.personaState.role}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-light-on-surface-variant flex items-center gap-1.5">
                              <BookOpen className="w-3.5 h-3.5 text-light-primary" />
                              Référentiel RAG Audité :
                            </span>
                            <span className="text-light-on-surface font-medium truncate max-w-[260px]">
                              {attachedDoc?.title || 'Procédure Interne'}
                            </span>
                          </div>
                        </div>

                        {/* Deterministic KPIs Preview */}
                        <div className="space-y-2">
                          <div className="text-xs font-semibold text-light-on-surface-variant">
                            Variables Chiffrées du Moteur d’État :
                          </div>
                          <div className="grid grid-cols-3 gap-2.5">
                            {scenario.initialState.metrics
                              .slice(0, 3)
                              .map((metric) => (
                                <div
                                  key={metric.id}
                                  className="p-2.5 bg-light-surface-container-low border border-light-outline-variant rounded-lg"
                                >
                                  <div className="text-[11px] text-light-on-surface-variant truncate">
                                    {metric.label}
                                  </div>
                                  <div className="mt-1 flex items-baseline justify-between font-mono tabular-nums">
                                    <span className="text-sm font-bold text-light-on-surface">
                                      {metric.value}
                                      {metric.unit}
                                    </span>
                                    <span className="text-[10px] text-light-primary font-medium">
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
                      <div className="pt-4 border-t border-light-outline-variant flex items-center justify-between gap-4">
                        <div className="text-xs text-light-on-surface-variant font-mono tabular-nums">
                          {scenario.initialState.tacticalLevers.length} leviers tactiques · Seuil réussite{' '}
                          {scenario.evaluationRubric.passingScore}/100
                        </div>

                        <button
                          onClick={() => handleStartSimulation(scenario)}
                          disabled={isStarting}
                          className="px-4 py-2 bg-light-primary hover:bg-light-primary-container disabled:opacity-50 text-light-on-primary text-xs font-semibold rounded transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 shadow-xs cursor-pointer"
                        >
                          {isStarting ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Initialisation...</span>
                            </>
                          ) : (
                            <>
                              <span className="material-symbols-outlined text-base">flight_takeoff</span>
                              <span>Entrer dans le Cockpit</span>
                            </>
                          )}
                        </button>
                      </div>
                    </article>
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

      {/* Clean Corporate Footer — Stitch Design System */}
      <footer className="bg-light-surface-container-lowest border-t border-light-outline-variant px-6 py-4 text-xs text-light-on-surface-variant flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-light-primary text-light-on-primary flex items-center justify-center text-[10px]">
            <span className="material-symbols-outlined text-xs">flight_takeoff</span>
          </div>
          <span className="font-bold text-light-on-surface font-headline">
            MiraStudio
          </span>
          <span aria-hidden="true">·</span>
          <span>
            Simulateur B2B Haute Précision (Moteur d’État Déterministe + Gemini 2.5 Flash + RAG)
          </span>
        </div>
        <div className="flex items-center gap-5 font-medium">
          <button
            onClick={() => setActiveView('landing')}
            className="hover:text-light-primary transition-colors cursor-pointer"
          >
            Accueil
          </button>
          <button
            onClick={() => setActiveView('catalog')}
            className="hover:text-light-primary transition-colors cursor-pointer"
          >
            Catalogue (4 Modules)
          </button>
          <button
            onClick={() => setActiveView('studio')}
            className="hover:text-light-primary transition-colors cursor-pointer"
          >
            Studio RAG
          </button>
          <button
            onClick={() => setActiveView('architecture')}
            className="hover:text-light-primary transition-colors cursor-pointer"
          >
            Architecture & Marque Blanche
          </button>
        </div>
      </footer>
    </div>
  );
}
