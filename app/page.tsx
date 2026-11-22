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
  SAMPLE_EVALUATION_REPORT,
  SAMPLE_EVALUATION_SESSION,
  SAMPLE_RECRUITMENT_REPORT,
  SAMPLE_RECRUITMENT_SESSION,
} from '@/lib/seed-data';
import { POSTGRES_MULTI_TENANT_DDL } from '@/lib/db-schema-reference';
import SimulationCockpit from '@/components/SimulationCockpit';
import StudioRagBuilder from '@/components/StudioRagBuilder';
import EvaluationDebrief from '@/components/EvaluationDebrief';
import ArchitectureBlueprintView from '@/components/ArchitectureBlueprintView';
import LandingPageView from '@/components/LandingPageView';
import PricingView from '@/components/PricingView';
import AuthModal from '@/components/AuthModal';
import MiraLogo from '@/components/MiraLogo';
import { DEMO_ENTERPRISE_PERSONAS, DemoEnterprisePersona } from '@/lib/auth';
import {
  Play,
  Clock,
  BookOpen,
  Sliders,
  Loader2,
  ArrowRight,
  Layers,
  Award,
  Lock,
  User,
  LogOut,
  ChevronDown,
  Building,
  Sparkles,
  Check,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

type MainView =
  | 'landing'
  | 'catalog'
  | 'cockpit'
  | 'studio'
  | 'debrief'
  | 'pricing'
  | 'architecture';

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
  const [selectedDebriefSession, setSelectedDebriefSession] = useState<SimulationSession>(
    SAMPLE_EVALUATION_SESSION
  );
  const [isStartingSessionId, setIsStartingSessionId] = useState<string | null>(
    null
  );
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Authentication & Multi-Tenant State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(INITIAL_USERS[0]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [authTargetFeature, setAuthTargetFeature] = useState<string | undefined>(undefined);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  const [isTenantMenuOpen, setIsTenantMenuOpen] = useState<boolean>(false);

  // Sync with server-side auth & bootstrap store
  useEffect(() => {
    async function loadAuthAndBootstrap() {
      try {
        const [authRes, bootRes] = await Promise.all([
          fetch('/api/auth/me').catch(() => null),
          fetch('/api/bootstrap').catch(() => null),
        ]);

        if (authRes && authRes.ok) {
          const authData = await authRes.json();
          if (authData.user) {
            setCurrentUser(authData.user);
            setIsAuthenticated(authData.isAuthenticated);
          }
          if (authData.organization) {
            setActiveOrg(authData.organization);
          }
        }

        if (bootRes && bootRes.ok) {
          const data = await bootRes.json();
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
    loadAuthAndBootstrap();
  }, []);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside() {
      setIsUserMenuOpen(false);
      setIsTenantMenuOpen(false);
    }
    if (isUserMenuOpen || isTenantMenuOpen) {
      window.addEventListener('click', handleClickOutside);
      return () => window.removeEventListener('click', handleClickOutside);
    }
  }, [isUserMenuOpen, isTenantMenuOpen]);

  const handleAuthSuccess = (user: UserProfile, organization: OrganizationTenant) => {
    setCurrentUser(user);
    setActiveOrg(organization);
    setIsAuthenticated(true);
    setOrganizations((prev) => {
      const exists = prev.some((o) => o.id === organization.id);
      return exists ? prev : [organization, ...prev];
    });
    setUsers((prev) => {
      const exists = prev.some((u) => u.id === user.id);
      return exists ? prev : [user, ...prev];
    });
  };

  const handleSelectPersona = async (persona: DemoEnterprisePersona) => {
    setIsUserMenuOpen(false);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ personaId: persona.id }),
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        setActiveOrg(data.organization);
        setIsAuthenticated(true);
        const bootRes = await fetch(`/api/bootstrap?tenantId=${data.organization.id}`);
        if (bootRes.ok) {
          const bootData = await bootRes.json();
          if (bootData.knowledgeDocuments) setKnowledgeDocuments(bootData.knowledgeDocuments);
          if (bootData.scenarios) setScenarios(bootData.scenarios);
        }
      }
    } catch (e) {
      console.error('Failed to switch persona:', e);
    }
  };

  const handleSelectTenant = async (tenant: OrganizationTenant) => {
    setActiveOrg(tenant);
    setIsTenantMenuOpen(false);
    try {
      await fetch('/api/auth/switch-tenant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organizationId: tenant.id }),
      });
      const res = await fetch(`/api/bootstrap?tenantId=${tenant.id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.knowledgeDocuments) setKnowledgeDocuments(data.knowledgeDocuments);
        if (data.scenarios) setScenarios(data.scenarios);
      }
    } catch (e) {
      console.error('Failed to switch tenant:', e);
    }
  };

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error('Logout error:', e);
    }
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const handleStartSimulation = async (scenario: ScenarioDefinition) => {
    setIsStartingSessionId(scenario.id);
    try {
      const response = await fetch('/api/simulation/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioId: scenario.id,
          organizationId: activeOrg.id,
          userId: currentUser?.id || users[0]?.id || 'usr-sales-vp',
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
        setSelectedDebriefSession(data.session);
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
        {/* Zone 1: Wordmark + Aviation Mark + Interactive Tenant Switcher */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveView('landing')}
            className="flex items-center gap-3 text-left cursor-pointer group"
          >
            <MiraLogo size={32} className="group-hover:scale-105 transition-transform shadow-xs" />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-headline text-lg font-bold text-light-on-surface tracking-tight">
                  MiraStudio
                </span>
                <span className="px-2 py-0.5 rounded-full bg-light-secondary-container text-light-on-secondary-container font-mono text-[11px] font-semibold">
                  Simulateur B2B
                </span>
              </div>
            </div>
          </button>

          {/* Interactive Tenant Switcher Pill */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsTenantMenuOpen(!isTenantMenuOpen);
                setIsUserMenuOpen(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-light-surface-container-low hover:bg-light-surface-container border border-light-outline-variant text-[11px] text-light-on-surface font-medium transition-colors cursor-pointer"
              title="Changer d'organisation ou de tenant RLS"
            >
              <Building className="w-3.5 h-3.5 text-light-primary shrink-0" />
              <span className="max-w-[150px] sm:max-w-[180px] truncate">{activeOrg.name.split(' (')[0]}</span>
              <ChevronDown className={`w-3 h-3 text-light-on-surface-variant transition-transform ${isTenantMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Tenant Dropdown Menu */}
            {isTenantMenuOpen && (
              <div
                className="absolute left-0 mt-2 w-72 bg-light-surface-container-lowest rounded-xl shadow-xl border border-light-outline-variant p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider text-light-on-surface-variant font-bold flex items-center justify-between">
                  <span>Organisations (Tenants RLS)</span>
                  <span className="text-light-primary font-mono">{organizations.length}</span>
                </div>
                <div className="space-y-1 mt-1">
                  {organizations.map((org) => {
                    const isSelected = org.id === activeOrg.id;
                    return (
                      <button
                        key={org.id}
                        onClick={() => handleSelectTenant(org)}
                        className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-light-secondary-container/40 text-light-primary font-bold'
                            : 'hover:bg-light-surface-container text-light-on-surface'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <div className="truncate font-medium">{org.name.split(' (')[0]}</div>
                          <div className="text-[10px] text-light-on-surface-variant font-mono">
                            {org.planTier} · {org.activeUsersCount} utilisateurs
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-light-primary shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-2 pt-2 border-t border-light-outline-variant">
                  <button
                    onClick={() => {
                      setIsTenantMenuOpen(false);
                      setAuthModalMode('register');
                      setAuthTargetFeature('Création de Tenant Isolé');
                      setIsAuthModalOpen(true);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold text-light-primary hover:bg-light-surface-container flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">add_business</span>
                    <span>+ Déployer un nouveau Tenant</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-1.5 text-xs font-semibold">
          {[
            { id: 'landing', label: 'Accueil' },
            { id: 'catalog', label: 'Catalogue des 4 Modules' },
            { id: 'cockpit', label: 'Cockpit Simulation' },
            { id: 'studio', label: 'Studio RAG' },
            { id: 'debrief', label: 'Évaluations' },
            { id: 'pricing', label: 'Tarifs' },
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

        {/* Zone 3: User Auth Capsule + Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          {/* User Profile or Login Trigger */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsUserMenuOpen(!isUserMenuOpen);
                  setIsTenantMenuOpen(false);
                }}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-lg hover:bg-light-surface-container border border-light-outline-variant bg-light-surface-container-low transition-colors cursor-pointer group"
                title="Gérer votre profil et vos rôles B2B"
              >
                <div className="w-7 h-7 rounded-full bg-light-primary text-light-on-primary font-bold text-[11px] flex items-center justify-center shrink-0 relative">
                  {currentUser.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                  <span className="w-2 h-2 rounded-full bg-emerald-500 absolute -bottom-0.5 -right-0.5 ring-2 ring-white" />
                </div>
                <div className="hidden sm:flex flex-col text-left leading-tight">
                  <span className="text-xs font-bold text-light-on-surface group-hover:text-light-primary transition-colors">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-light-on-surface-variant font-mono">
                    {currentUser.role}
                  </span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-light-on-surface-variant transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-80 bg-light-surface-container-lowest rounded-xl shadow-xl border border-light-outline-variant p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Current User Card */}
                  <div className="p-3 rounded-lg bg-light-surface-container-low border border-light-outline-variant space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-light-on-surface">{currentUser.name}</span>
                      <span className="px-2 py-0.5 rounded text-[9px] font-semibold bg-light-primary/10 text-light-primary border border-light-primary/30">
                        {currentUser.role}
                      </span>
                    </div>
                    <div className="text-[11px] text-light-on-surface-variant font-mono">{currentUser.email}</div>
                    <div className="text-[10px] text-light-on-surface-variant flex items-center gap-1 pt-1">
                      <Building className="w-3 h-3 text-light-primary" />
                      <span className="truncate">{activeOrg.name.split(' (')[0]}</span>
                    </div>
                  </div>

                  {/* 1-Click Persona Switcher */}
                  <div className="mt-3 space-y-1.5">
                    <div className="px-1 text-[10px] font-mono uppercase tracking-wider text-light-on-surface-variant font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-light-primary" />
                      <span>Tester un Persona B2B (Démo 1-Clic)</span>
                    </div>

                    <div className="space-y-1">
                      {DEMO_ENTERPRISE_PERSONAS.map((p) => {
                        const isCurrent = currentUser?.id === p.userId || currentUser?.email === p.email;
                        return (
                          <button
                            key={p.id}
                            onClick={() => handleSelectPersona(p)}
                            className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                              isCurrent
                                ? 'bg-light-secondary-container/40 text-light-primary font-bold'
                                : 'hover:bg-light-surface-container text-light-on-surface'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="w-5 h-5 rounded-full bg-light-primary/10 text-light-primary text-[10px] font-bold flex items-center justify-center shrink-0">
                                {p.avatarText}
                              </span>
                              <div className="truncate">
                                <div className="font-semibold text-xs truncate">{p.name}</div>
                                <div className="text-[10px] text-light-on-surface-variant font-mono truncate">{p.role}</div>
                              </div>
                            </div>
                            {isCurrent && <Check className="w-4 h-4 text-light-primary shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions Divider */}
                  <div className="mt-3 pt-2 border-t border-light-outline-variant space-y-1">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setAuthModalMode('register');
                        setAuthTargetFeature('Créer un Espace Entreprise');
                        setIsAuthModalOpen(true);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold text-light-primary hover:bg-light-surface-container flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Building className="w-3.5 h-3.5 text-light-primary" />
                      <span>Créer un nouvel espace entreprise</span>
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5 text-red-600" />
                      <span>Se déconnecter</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setAuthModalMode('login');
                  setAuthTargetFeature(undefined);
                  setIsAuthModalOpen(true);
                }}
                className="px-3 py-1.5 text-xs font-semibold text-light-on-surface hover:text-light-primary hover:bg-light-surface-container rounded-lg border border-light-outline-variant transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Lock className="w-3.5 h-3.5 text-light-primary" />
                <span>Connexion</span>
              </button>

              <button
                onClick={() => {
                  setAuthModalMode('register');
                  setAuthTargetFeature('Création de compte entreprise');
                  setIsAuthModalOpen(true);
                }}
                className="hidden sm:flex px-3 py-1.5 text-xs font-semibold text-light-on-surface-variant hover:text-light-on-surface hover:bg-light-surface-container rounded-lg transition-colors items-center gap-1.5 cursor-pointer"
              >
                <Building className="w-3.5 h-3.5" />
                <span>Créer un Espace</span>
              </button>
            </div>
          )}

          {/* Primary Action Button */}
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
            onNavigateToPricing={() => setActiveView('pricing')}
            onOpenAuth={(mode) => {
              setAuthModalMode(mode || 'login');
              setIsAuthModalOpen(true);
            }}
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
          (() => {
            const currentDebriefSession = activeSession?.evaluationReport
              ? selectedDebriefSession?.id === activeSession.id
                ? activeSession
                : selectedDebriefSession || activeSession
              : selectedDebriefSession || SAMPLE_EVALUATION_SESSION;

            const currentReport =
              currentDebriefSession.evaluationReport ||
              SAMPLE_EVALUATION_REPORT;
            const currentScenario =
              scenarios.find(
                (s) => s.id === currentDebriefSession.scenarioId
              ) || scenarios[0];

            const availableEvaluations = [
              {
                session: SAMPLE_EVALUATION_SESSION,
                scenario:
                  scenarios.find(
                    (s) => s.id === SAMPLE_EVALUATION_SESSION.scenarioId
                  ) || scenarios[0],
                report: SAMPLE_EVALUATION_REPORT,
                candidateName:
                  'Youssef Berrada · Négociation Vente & SLA (69-21)',
              },
              {
                session: SAMPLE_RECRUITMENT_SESSION,
                scenario:
                  scenarios.find(
                    (s) => s.id === SAMPLE_RECRUITMENT_SESSION.scenarioId
                  ) ||
                  scenarios[2] ||
                  scenarios[0],
                report: SAMPLE_RECRUITMENT_REPORT,
                candidateName: 'Amine Tazi · Assessment Tech Lead RH',
              },
              ...(activeSession?.evaluationReport
                ? [
                    {
                      session: activeSession,
                      scenario: activeScenario || scenarios[0],
                      report: activeSession.evaluationReport,
                      candidateName: 'Session En Direct (Votre Simulation)',
                    },
                  ]
                : []),
            ];

            return (
              <EvaluationDebrief
                session={currentDebriefSession}
                scenario={currentScenario}
                report={currentReport}
                onRestartScenario={() =>
                  handleStartSimulation(currentScenario)
                }
                onBackToCatalog={() => setActiveView('catalog')}
                availableEvaluations={availableEvaluations}
                onSelectEvaluation={(s) => setSelectedDebriefSession(s)}
              />
            );
          })()}

        {/* VIEW 5: PRICING & B2B SUBSCRIPTION PLANS */}
        {activeView === 'pricing' && (
          <PricingView
            onStartSimulation={handleStartSimulation}
            onNavigateToCatalog={() => setActiveView('catalog')}
            onNavigateToArchitecture={() => setActiveView('architecture')}
            onOpenAuth={(mode, planTier) => {
              setAuthModalMode(mode || 'register');
              setAuthTargetFeature(planTier ? `Souscription Formule ${planTier}` : undefined);
              setIsAuthModalOpen(true);
            }}
            flagshipScenario={scenarios[0]}
          />
        )}

        {/* VIEW 6: MULTI-TENANT ARCHITECTURE & POSTGRESQL DDL BLUEPRINT */}
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
          <MiraLogo size={22} className="shadow-2xs" />
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
            onClick={() => setActiveView('debrief')}
            className="hover:text-light-primary transition-colors cursor-pointer"
          >
            Évaluations & Bilan
          </button>
          <button
            onClick={() => setActiveView('pricing')}
            className="hover:text-light-primary transition-colors cursor-pointer text-light-primary font-bold"
          >
            Tarifs
          </button>
          <button
            onClick={() => setActiveView('architecture')}
            className="hover:text-light-primary transition-colors cursor-pointer"
          >
            Architecture & Marque Blanche
          </button>
        </div>
      </footer>

      {/* AUTHENTICATION & MULTI-TENANT MODAL */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialMode={authModalMode}
        targetFeatureLabel={authTargetFeature}
      />
    </div>
  );
}
