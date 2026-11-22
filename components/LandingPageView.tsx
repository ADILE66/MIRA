'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Play,
  ArrowRight,
  Shield,
  Cpu,
  Layers,
  FileText,
  CheckCircle2,
  Lock,
  Clock,
  Building2,
  ChevronRight,
  BarChart3,
  Users,
  Target,
  FileCheck,
  Check,
} from 'lucide-react';
import { ModuleType, ScenarioDefinition, OrganizationTenant } from '@/lib/types';

interface LandingPageViewProps {
  onStartSimulation: (scenario: ScenarioDefinition) => void;
  onNavigateToCatalog: (moduleFilter?: ModuleType) => void;
  onNavigateToStudio: () => void;
  onNavigateToArchitecture: () => void;
  scenarios: ScenarioDefinition[];
  activeOrg: OrganizationTenant;
}

export default function LandingPageView({
  onStartSimulation,
  onNavigateToCatalog,
  onNavigateToStudio,
  onNavigateToArchitecture,
  scenarios,
  activeOrg,
}: LandingPageViewProps) {
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null);
  const [activeTabModule, setActiveTabModule] = useState<ModuleType>('upskilling');

  const scenarioUpskilling = scenarios.find((s) => s.moduleType === 'upskilling') || scenarios[0];
  const scenarioBusiness = scenarios.find((s) => s.moduleType === 'business_game') || scenarios[1] || scenarios[0];
  const scenarioRecruitment = scenarios.find((s) => s.moduleType === 'recruitment') || scenarios[2] || scenarios[0];
  const scenarioOnboarding = scenarios.find((s) => s.moduleType === 'onboarding') || scenarios[3] || scenarios[0];

  const faqs = [
    {
      q: "Comment garantissez-vous zéro hallucination sur les chiffres et les KPIs ?",
      a: "Contrairement aux simulateurs 100% LLM, MiraStudio découple strictement la narration du calcul. Le Moteur d'État est un réducteur déterministe en code dur. L'IA ne manipule jamais les variables de trésorerie, de marge ou de churn directement : elle propose des deltas via Function Calling, qui sont validés, bornés et appliqués par le moteur mathématique côté serveur."
    },
    {
      q: "Les candidats ou apprenants peuvent-ils tricher en tentant des injections de prompt ?",
      a: "Impossible. Chaque message utilisateur passe par un filtre de sécurité adversarial qui neutralise les patterns de jailbreak ('ignore all instructions', forçage de deltas, usurpation d'état). De plus, les règles de fin de partie et le calcul des scores sont hermétiques et calculés côté serveur."
    },
    {
      q: "Quels types de documents internes l'entreprise peut-elle ingérer (RAG) ?",
      a: "Le Studio RAG accepte les PDF, documents Markdown ou texte brut : playbooks de vente grands comptes, politiques de remises, chartes RH et de télétravail, procédures de réponse à incident cyber, réglementations fiscales et légales (Loi 69-21, RGPD, CNDP 09-08, DGSSI). L'Architecte IA extrait automatiquement les règles impératives pour les confronter aux décisions du joueur."
    },
    {
      q: "La plateforme peut-elle être déployée en Marque Blanche (White-Label) ?",
      a: "Oui, nativement. MiraStudio intègre une architecture multi-tenant avec isolation stricte des données (RLS). Les cabinets de conseil, organismes de formation et business schools peuvent personnaliser l'univers de marque, les couleurs et les scénarios pour leurs propres clients d'entreprise."
    },
    {
      q: "Les formations réalisées sur MiraStudio sont-elles éligibles aux financements légaux ?",
      a: "Absolument. Grâce à la traçabilité intégrale des sessions, aux métriques objectives de début/fin et à l'Agent Évaluateur certifié, MiraStudio fournit tous les éléments de preuve requis par les dispositifs d'ingénierie financière de formation (OPCO, CSF / OFPPT, GIAC)."
    }
  ];

  return (
    <div className="relative overflow-hidden bg-light-surface text-light-on-surface min-h-screen">
      {/* 1. HERO SECTION — STITCH CORPORATE MODERN */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="flex flex-col items-center text-center space-y-7">
          {/* Announcement pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-light-surface-container-lowest border border-light-outline-variant text-xs font-semibold text-light-primary shadow-xs">
            <span className="material-symbols-outlined text-sm text-light-primary">flight_takeoff</span>
            <span>Moteur Hybride Déterministe + Gemini 2.5 Flash + RAG d’Entreprise</span>
            <span className="text-light-outline-variant">·</span>
            <span className="font-mono text-[11px] text-light-on-surface-variant font-bold">Design System Stitch</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-light-on-surface font-headline max-w-5xl leading-[1.12]">
            Le simulateur de vol décisionnel qui transforme vos documents internes en{' '}
            <span className="text-light-primary underline decoration-light-secondary-container decoration-wavy underline-offset-8">
              réflexes d’excellence
            </span>.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-light-on-surface-variant max-w-3xl leading-relaxed">
            Fini les formations passives et les évaluations subjectives. <strong>MiraStudio</strong> ingère
            vos playbooks et chartes d’entreprise (RAG) pour immerger vos équipes face à des personas IA
            adaptatifs, avec <strong>zéro hallucination chiffrée</strong> grâce à notre Moteur d’État déterministe.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
            <button
              onClick={() => onStartSimulation(scenarioUpskilling)}
              className="px-6 py-3.5 text-xs font-bold text-light-on-primary bg-light-primary hover:bg-light-primary-container rounded shadow-xs transition-all flex items-center gap-2 group cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">flight_takeoff</span>
              <span>Lancer une Simulation Live</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigateToCatalog()}
              className="px-6 py-3.5 text-xs font-bold text-light-on-surface bg-light-surface-container-lowest hover:bg-light-surface-container border border-light-outline-variant rounded transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Layers className="w-4 h-4 text-light-primary" />
              <span>Explorer les 4 Modules</span>
            </button>

            <button
              onClick={onNavigateToStudio}
              className="px-5 py-3.5 text-xs font-semibold text-light-primary hover:text-light-primary-container transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-success" />
              <span>Créer un scénario RAG</span>
            </button>
          </div>

          {/* Key Value Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 w-full max-w-4xl text-left">
            <div className="p-4 rounded-lg bg-light-surface-container-lowest border border-light-outline-variant shadow-xs space-y-1">
              <div className="text-sm font-bold text-light-on-surface font-headline flex items-center gap-2">
                <Shield className="w-4 h-4 text-light-primary" />
                <span>0 Hallucination</span>
              </div>
              <p className="text-xs text-light-on-surface-variant leading-snug">
                KPIs et trésorerie gérés par un moteur mathématique pur.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-light-surface-container-lowest border border-light-outline-variant shadow-xs space-y-1">
              <div className="text-sm font-bold text-light-on-surface font-headline flex items-center gap-2">
                <Cpu className="w-4 h-4 text-success" />
                <span>4 Modules Déclinés</span>
              </div>
              <p className="text-xs text-light-on-surface-variant leading-snug">
                Formation, Business Game, Recrutement, Onboarding.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-light-surface-container-lowest border border-light-outline-variant shadow-xs space-y-1">
              <div className="text-sm font-bold text-light-on-surface font-headline flex items-center gap-2">
                <Clock className="w-4 h-4 text-warning" />
                <span>30 Secondes</span>
              </div>
              <p className="text-xs text-light-on-surface-variant leading-snug">
                Pour convertir un PDF interne en simulation jouable.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-light-surface-container-lowest border border-light-outline-variant shadow-xs space-y-1">
              <div className="text-sm font-bold text-light-on-surface font-headline flex items-center gap-2">
                <Lock className="w-4 h-4 text-light-secondary" />
                <span>Sans Triche</span>
              </div>
              <p className="text-xs text-light-on-surface-variant leading-snug">
                Protection anti-jailbreak et chronomètre strict.
              </p>
            </div>
          </div>
        </div>

        {/* Hero Interactive Cockpit Preview — Matching Stitch Interface */}
        <div className="mt-14 relative rounded-xl border border-light-outline-variant bg-light-surface-container-lowest shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-light-outline-variant bg-light-surface-container-low flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-mono text-light-on-surface-variant font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse" />
              <span>COCKPIT TEMPS RÉEL — SESSION INTERACTIVE</span>
              <span className="text-light-outline-variant">|</span>
              <span className="text-light-primary font-bold">François Delmas (Directeur Financier)</span>
            </div>
            <div className="flex items-center gap-4 text-light-on-surface-variant font-mono text-xs">
              <span>Tour 2 / 6</span>
              <span className="px-2 py-0.5 rounded-full bg-warning-container text-on-warning-container font-semibold">
                Contrat Grand Compte
              </span>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left simulated chat */}
            <div className="lg:col-span-8 space-y-3.5">
              <div className="p-4 bg-light-surface-container-low border border-light-outline-variant rounded-lg space-y-1.5 shadow-xs">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-light-on-surface">François Delmas (Persona IA)</span>
                  <span className="text-xs font-mono font-bold text-on-warning-container bg-warning-container px-2 py-0.5 rounded">
                    Humeur : SCEPTIQUE (Confiance : 35 %)
                  </span>
                </div>
                <p className="text-sm text-light-on-surface italic leading-relaxed">
                  « Vos serveurs ont subi 4 heures d’interruption pendant notre clôture mensuelle. Si nous n'obtenons pas
                  un avoir immédiat de 25% et un report d'échéance à 120 jours, je résilie notre contrat annuel à 420 k€ dès demain matin. »
                </p>
              </div>

              <div className="p-4 bg-light-secondary-container/40 border border-light-secondary-container rounded-lg space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-light-primary font-bold">DÉCISION DU JOUEUR (AVEC LEVIER TECHNIQUE ACTIVÉ)</span>
                  <span className="text-success flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    AUDIT RAG : RESPECTÉ (Clause 1 Playbook)
                  </span>
                </div>
                <p className="text-xs text-light-on-surface leading-relaxed">
                  « Nous dépêchons un Architecte Principal sous 48h sur votre site et vous offrons 6 mois de Support Platinum 24/7. Conformément à nos procédures, le délai reste fixé à 60 jours avec un geste contractuel de 8%. »
                </p>
              </div>
            </div>

            {/* Right simulated deterministic state */}
            <div className="lg:col-span-4 p-5 bg-light-surface-container-low border border-light-outline-variant rounded-lg space-y-4">
              <div className="text-xs font-mono text-light-primary font-bold border-b border-light-outline-variant pb-2 flex items-center justify-between">
                <span>MOTEUR D’ÉTAT (DÉTERMINISTE)</span>
                <span className="text-success font-bold">+6 pts</span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-light-on-surface font-medium mb-1">
                    <span>Marge Contrat</span>
                    <span className="font-mono font-bold text-light-on-surface">22.4 % (Cible 25 %)</span>
                  </div>
                  <div className="h-2 w-full bg-light-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full bg-light-primary rounded-full" style={{ width: '74%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-light-on-surface font-medium mb-1">
                    <span>Confiance Client B2B</span>
                    <span className="font-mono font-bold text-success">58 % (+15)</span>
                  </div>
                  <div className="h-2 w-full bg-light-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full bg-success rounded-full" style={{ width: '58%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-light-on-surface font-medium mb-1">
                    <span>Conformité Procédures RAG</span>
                    <span className="font-mono font-bold text-light-primary">92 %</span>
                  </div>
                  <div className="h-2 w-full bg-light-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full bg-light-primary rounded-full" style={{ width: '92%' }} />
                  </div>
                </div>
              </div>

              <button
                onClick={() => onStartSimulation(scenarioUpskilling)}
                className="w-full py-2.5 text-xs font-bold text-light-on-primary bg-light-primary hover:bg-light-primary-container rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Tester cette session en direct</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE 4 CORE USE CASES SECTION */}
      <section className="py-20 border-t border-light-outline-variant bg-light-surface-container-low">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="text-xs font-mono font-bold text-light-primary uppercase tracking-wider">
              Une Plateforme Unique · 4 Déclinaisons Stratégiques
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-light-on-surface font-headline">
              Un moteur de simulation conçu pour couvrir tous vos cycles de vie RH et managériaux
            </h2>
            <p className="text-light-on-surface-variant text-sm sm:text-base">
              Du recrutement des talents au pilotage de BU par le Comex, MiraStudio adapte son Moteur d’État
              et ses personas à vos objectifs réels.
            </p>
          </div>

          {/* Module Selection Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'upskilling', label: '01. Formation & Upskilling', icon: Target },
              { id: 'business_game', label: '02. Simulation Stratégique (Business Game)', icon: BarChart3 },
              { id: 'recruitment', label: '03. Recrutement (Gamified Assessment)', icon: Users },
              { id: 'onboarding', label: '04. Onboarding & Changement', icon: FileCheck },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTabModule === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabModule(tab.id as ModuleType)}
                  className={`px-4 py-2.5 text-xs font-semibold rounded border transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
                    isSelected
                      ? 'bg-light-primary border-light-primary text-light-on-primary'
                      : 'bg-light-surface-container-lowest border-light-outline-variant text-light-on-surface-variant hover:text-light-on-surface hover:bg-light-surface-container'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Module Focus Card */}
          <div className="p-8 bg-light-surface-container-lowest border border-light-outline-variant rounded-xl shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {activeTabModule === 'upskilling' && (
              <>
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-light-secondary-container text-light-on-secondary-container text-xs font-mono font-bold">
                    USAGE 01 · TRAINING COMMERCIAL & LEADERSHIP
                  </div>
                  <h3 className="text-2xl font-bold text-light-on-surface font-headline">
                    Formation & Upskilling : Jeux de rôle immersifs face à des personas IA
                  </h3>
                  <p className="text-sm text-light-on-surface-variant leading-relaxed">
                    Entraînez vos commerciaux, acheteurs et managers face à des clients exigeants, des collaborateurs en
                    difficulté ou des comités d'audit. Le persona s'adapte en temps réel selon la qualité de l'argumentaire,
                    sans jamais s'éloigner des règles tarifaires et SLA de votre entreprise.
                  </p>
                  <ul className="space-y-2 text-xs text-light-on-surface-variant">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-success shrink-0" />
                      <span>Personas psychologiques avec humeur dynamique (HOSTILE à CONVAINCU) et agenda caché.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-success shrink-0" />
                      <span>Audit RAG à chaque réplique : bonus si la clause est appliquée, pénalité si la règle est violée.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-success shrink-0" />
                      <span>Rapport de debriefing complet avec radar 5 axes et alternatives formulées.</span>
                    </li>
                  </ul>
                  <div className="pt-2">
                    <button
                      onClick={() => onStartSimulation(scenarioUpskilling)}
                      className="px-5 py-2.5 text-xs font-bold text-light-on-primary bg-light-primary hover:bg-light-primary-container rounded transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Lancer la simulation Formation (Crise Logistique)</span>
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5 p-6 bg-light-surface-container-low border border-light-outline-variant rounded-lg space-y-3">
                  <div className="text-xs font-mono font-bold text-light-primary uppercase">Cas Concret Déployé</div>
                  <div className="text-base font-bold text-light-on-surface font-headline">
                    Crise Logistique Grands Comptes & SLA
                  </div>
                  <div className="text-xs text-light-on-surface-variant leading-relaxed">
                    Négociation sous haute tension suite à un blocage technique impactant les livraisons. Le client réclame 25% d'avoir et un paiement différé hors contrat.
                  </div>
                  <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono">
                    <span className="px-2 py-1 bg-light-surface-container-lowest border border-light-outline-variant text-light-on-surface rounded">Durée : 20 min</span>
                    <span className="px-2 py-1 bg-light-surface-container-lowest border border-light-outline-variant text-light-on-surface rounded">6 Tours Max</span>
                    <span className="px-2 py-1 bg-success-container text-on-success-container font-semibold rounded">Éligible Financement</span>
                  </div>
                </div>
              </>
            )}

            {activeTabModule === 'business_game' && (
              <>
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-light-secondary-container text-light-on-secondary-container text-xs font-mono font-bold">
                    USAGE 02 · GOUVERNANCE & COMITÉ EXÉCUTIF
                  </div>
                  <h3 className="text-2xl font-bold text-light-on-surface font-headline">
                    Simulation Stratégique : Pilotage de BU sur 4 trimestres virtuels
                  </h3>
                  <p className="text-sm text-light-on-surface-variant leading-relaxed">
                    Mettez vos hauts potentiels et dirigeants dans le fauteuil de Directeur Général. Chaque trimestre
                    impose d'arbitrer les investissements R&D, l'effort commercial, le BFR et la masse salariale. L'IA
                    génère des chocs macroéconomiques réalistes à chaque passage de trimestre.
                  </p>
                  <ul className="space-y-2 text-xs text-light-on-surface-variant">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-success shrink-0" />
                      <span>Suivi rigoureux de la trésorerie nette et du seuil de runway critique.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-success shrink-0" />
                      <span>Aléas de marché imprévisibles : contre-attaque concurrentielle, inflation, défaillance fournisseur.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-success shrink-0" />
                      <span>Évaluation devant le Conseil d'Administration en fin d'exercice fiscal.</span>
                    </li>
                  </ul>
                  <div className="pt-2">
                    <button
                      onClick={() => onStartSimulation(scenarioBusiness)}
                      className="px-5 py-2.5 text-xs font-bold text-light-on-primary bg-light-primary hover:bg-light-primary-container rounded transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Lancer le Business Game (4 Trimestres)</span>
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5 p-6 bg-light-surface-container-low border border-light-outline-variant rounded-lg space-y-3">
                  <div className="text-xs font-mono font-bold text-light-primary uppercase">Cas Concret Déployé</div>
                  <div className="text-base font-bold text-light-on-surface font-headline">
                    Business Game BU Cloud & Expansion
                  </div>
                  <div className="text-xs text-light-on-surface-variant leading-relaxed">
                    Arbitrez vos budgets d'acquisition, de R&D et maintenez la trésorerie au-dessus du plancher critique face à la concurrence.
                  </div>
                  <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono">
                    <span className="px-2 py-1 bg-light-surface-container-lowest border border-light-outline-variant text-light-on-surface rounded">Durée : 30 min</span>
                    <span className="px-2 py-1 bg-light-surface-container-lowest border border-light-outline-variant text-light-on-surface rounded">4 Trimestres (Q1-Q4)</span>
                    <span className="px-2 py-1 bg-warning-container text-on-warning-container font-semibold rounded">Niveau : Expert</span>
                  </div>
                </div>
              </>
            )}

            {activeTabModule === 'recruitment' && (
              <>
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-warning-container text-on-warning-container text-xs font-mono font-bold">
                    USAGE 03 · ASSESSMENT RH & TALENT ACQUISITION
                  </div>
                  <h3 className="text-2xl font-bold text-light-on-surface font-headline">
                    Recrutement : Mises en situation chronométrées sans triche possible
                  </h3>
                  <p className="text-sm text-light-on-surface-variant leading-relaxed">
                    Fini les CVs gonflés et les réponses standardisées rédigées par ChatGPT. Placez les candidats dans
                    un cockpit sous contrainte de temps (20 min) face à un interlocuteur complexe. Le moteur analyse la
                    posture, la réactivité, le sang-froid et le respect des normes sans aucun biais humain.
                  </p>
                  <ul className="space-y-2 text-xs text-light-on-surface-variant">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-success shrink-0" />
                      <span>Protection anti-triche : filtres d'injection de prompt et chronomètre strict.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-success shrink-0" />
                      <span>Benchmark automatisé des candidats sur une grille de compétences harmonisée.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-success shrink-0" />
                      <span>Génération instantanée du rapport d'entretien pour le Talent Acquisition Lead.</span>
                    </li>
                  </ul>
                  <div className="pt-2">
                    <button
                      onClick={() => onStartSimulation(scenarioRecruitment)}
                      className="px-5 py-2.5 text-xs font-bold text-light-on-primary bg-light-primary hover:bg-light-primary-container rounded transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Tester l'Assessment Candidat</span>
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5 p-6 bg-light-surface-container-low border border-light-outline-variant rounded-lg space-y-3">
                  <div className="text-xs font-mono font-bold text-light-primary uppercase">Cas Concret Déployé</div>
                  <div className="text-base font-bold text-light-on-surface font-headline">
                    Évaluation Management Tech & Fuite des Talents
                  </div>
                  <div className="text-xs text-light-on-surface-variant leading-relaxed">
                    Un profil clé menace de partir chez un concurrent. Le candidat doit désamorcer la tension, analyser la charge de travail et appliquer la charte RH.
                  </div>
                  <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono">
                    <span className="px-2 py-1 bg-light-surface-container-lowest border border-light-outline-variant text-light-on-surface rounded">Durée : 20 min</span>
                    <span className="px-2 py-1 bg-light-surface-container-lowest border border-light-outline-variant text-light-on-surface rounded">Anti-Jailbreak Actif</span>
                    <span className="px-2 py-1 bg-success-container text-on-success-container font-semibold rounded">Rapport Automatique</span>
                  </div>
                </div>
              </>
            )}

            {activeTabModule === 'onboarding' && (
              <>
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-success-container text-on-success-container text-xs font-mono font-bold">
                    USAGE 04 · ONBOARDING & CONDUITE DU CHANGEMENT
                  </div>
                  <h3 className="text-2xl font-bold text-light-on-surface font-headline">
                    Onboarding : Parcours gamifiés fondés sur les procédures internes
                  </h3>
                  <p className="text-sm text-light-on-surface-variant leading-relaxed">
                    Les nouveaux collaborateurs retiennent moins de 10% d'un PDF de 80 pages lu passivement. Avec
                    MiraStudio, ils apprennent vos procédures en les pratiquant dans des scénarios réalistes : déclaration
                    d'incident sécurité, conformité des données ou politique d'éthique.
                  </p>
                  <ul className="space-y-2 text-xs text-light-on-surface-variant">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-success shrink-0" />
                      <span>Assimilation active : chaque décision renvoie immédiatement à la clause exacte du document.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-success shrink-0" />
                      <span>Suivi automatique du taux de complétion et de maîtrise pour la Direction RH.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-success shrink-0" />
                      <span>Mise à jour instantanée dès qu'une nouvelle version de document est importée dans le Studio.</span>
                    </li>
                  </ul>
                  <div className="pt-2">
                    <button
                      onClick={() => onStartSimulation(scenarioOnboarding)}
                      className="px-5 py-2.5 text-xs font-bold text-light-on-primary bg-light-primary hover:bg-light-primary-container rounded transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Tester le Parcours Onboarding</span>
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5 p-6 bg-light-surface-container-low border border-light-outline-variant rounded-lg space-y-3">
                  <div className="text-xs font-mono font-bold text-light-primary uppercase">Cas Concret Déployé</div>
                  <div className="text-base font-bold text-light-on-surface font-headline">
                    Incident Sécurité & Conformité Données
                  </div>
                  <div className="text-xs text-light-on-surface-variant leading-relaxed">
                    Détection d’une fuite potentielle de données sur un canal non sécurisé. Le nouvel arrivant doit appliquer le protocole d'alerte et l'isolement sous 15 minutes.
                  </div>
                  <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono">
                    <span className="px-2 py-1 bg-light-surface-container-lowest border border-light-outline-variant text-light-on-surface rounded">Durée : 15 min</span>
                    <span className="px-2 py-1 bg-light-surface-container-lowest border border-light-outline-variant text-light-on-surface rounded">Charte Données & Sécurité</span>
                    <span className="px-2 py-1 bg-success-container text-on-success-container font-semibold rounded">Certification Immédiate</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 3. THE HYBRID ENGINE ARCHITECTURE */}
      <section className="py-20 max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="text-xs font-mono font-bold text-light-primary uppercase tracking-wider">
            Architecture Système & Zéro Hallucination
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-light-on-surface font-headline">
            Pourquoi MiraStudio n’est pas un simple wrapper d’IA générative
          </h2>
          <p className="text-light-on-surface-variant text-sm sm:text-base">
            Les LLMs seuls ne savent pas compter et inventent des chiffres. Notre moteur hybride sépare
            l'intelligence émotionnelle de l'arithmétique d'entreprise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-light-surface-container-lowest border border-light-outline-variant rounded-xl shadow-xs space-y-4">
            <div className="w-10 h-10 rounded bg-light-primary text-light-on-primary flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div className="text-xs font-mono font-bold text-light-primary">PILIER 01</div>
            <h3 className="text-lg font-bold text-light-on-surface font-headline">
              Moteur d'État Déterministe
            </h3>
            <p className="text-xs text-light-on-surface-variant leading-relaxed">
              Un réducteur d'état pur en TypeScript qui gère les KPIs financiers (Trésorerie, ARR, Marge EBITDA, Churn).
              Il applique des plafonds stricts et vérifie en permanence les seuils critiques et les conditions d'échec ou de victoire.
            </p>
            <div className="text-[11px] font-mono text-light-on-surface-variant bg-light-surface-container-low p-3 rounded border border-light-outline-variant">
              ✓ Calculs mathématiques stricts<br />
              ✓ Bornes min/max infranchissables<br />
              ✓ Zéro dérive arithmétique
            </div>
          </div>

          <div className="p-6 bg-light-surface-container-lowest border border-light-outline-variant rounded-xl shadow-xs space-y-4">
            <div className="w-10 h-10 rounded bg-light-primary text-light-on-primary flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="text-xs font-mono font-bold text-light-primary">PILIER 02</div>
            <h3 className="text-lg font-bold text-light-on-surface font-headline">
              Moteur Narratif & Function Calling
            </h3>
            <p className="text-xs text-light-on-surface-variant leading-relaxed">
              Propulsé par Google Gemini 2.5 Flash avec l'outil obligatoire <code className="text-light-primary font-mono font-semibold">recordSimulationTurnImpact</code>.
              L'IA est forcée de séparer son discours direct du calcul de ses propositions de deltas sur les indicateurs.
            </p>
            <div className="text-[11px] font-mono text-light-on-surface-variant bg-light-surface-container-low p-3 rounded border border-light-outline-variant">
              ✓ Personas adaptatifs et crédibles<br />
              ✓ Événements et imprévus contextuels<br />
              ✓ Structured Outputs d'évaluation
            </div>
          </div>

          <div className="p-6 bg-light-surface-container-lowest border border-light-outline-variant rounded-xl shadow-xs space-y-4">
            <div className="w-10 h-10 rounded bg-light-primary text-light-on-primary flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div className="text-xs font-mono font-bold text-light-primary">PILIER 03</div>
            <h3 className="text-lg font-bold text-light-on-surface font-headline">
              Audit RAG en Temps Réel
            </h3>
            <p className="text-xs text-light-on-surface-variant leading-relaxed">
              À chaque tour de dialogue, le moteur vectoriel extrait les clauses applicables des documents internes
              et oblige l'IA à qualifier la conformité (<code className="text-success font-mono font-bold">RESPECTED</code> ou <code className="text-light-error font-mono font-bold">VIOLATED</code>) avec citation de preuve.
            </p>
            <div className="text-[11px] font-mono text-light-on-surface-variant bg-light-surface-container-low p-3 rounded border border-light-outline-variant">
              ✓ Ingestion directe de PDF et Playbooks<br />
              ✓ Rapprochement sémantique instantané<br />
              ✓ Impact direct sur le score de conformité
            </div>
          </div>
        </div>
      </section>

      {/* 4. STUDIO RAG : 3 STEPS TO CREATE A SIMULATION */}
      <section className="py-20 border-t border-light-outline-variant bg-light-surface-container-low">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="text-xs font-mono font-bold text-success uppercase tracking-wider">
              Studio RAG & Automatisation
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-light-on-surface font-headline">
              Du document interne à la simulation interactive en 3 étapes simples
            </h2>
            <p className="text-light-on-surface-variant text-sm sm:text-base">
              Plus besoin de passer des semaines avec une agence. Votre documentation interne devient un jeu d'entraînement en quelques secondes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-light-surface-container-lowest border border-light-outline-variant rounded-xl shadow-xs space-y-3">
              <div className="w-8 h-8 rounded bg-light-primary text-light-on-primary font-bold flex items-center justify-center text-sm font-headline">
                1
              </div>
              <h3 className="text-base font-bold text-light-on-surface font-headline">
                Importez vos documents internes
              </h3>
              <p className="text-xs text-light-on-surface-variant leading-relaxed">
                Glissez-déposez vos playbooks de négociation, chartes de télétravail ou directives de cybersécurité en PDF ou Markdown.
              </p>
            </div>

            <div className="p-6 bg-light-surface-container-lowest border border-light-outline-variant rounded-xl shadow-xs space-y-3">
              <div className="w-8 h-8 rounded bg-light-primary-container text-light-on-primary font-bold flex items-center justify-center text-sm font-headline">
                2
              </div>
              <h3 className="text-base font-bold text-light-on-surface font-headline">
                L’Architecte IA structure le scénario
              </h3>
              <p className="text-xs text-light-on-surface-variant leading-relaxed">
                Le moteur RAG découpe le document, extrait les règles impératives et configure automatiquement le persona, ses objectifs et le contrat de KPIs.
              </p>
            </div>

            <div className="p-6 bg-light-surface-container-lowest border border-light-outline-variant rounded-xl shadow-xs space-y-3">
              <div className="w-8 h-8 rounded bg-success text-white font-bold flex items-center justify-center text-sm font-headline">
                3
              </div>
              <h3 className="text-base font-bold text-light-on-surface font-headline">
                Lancez et évaluez vos collaborateurs
              </h3>
              <p className="text-xs text-light-on-surface-variant leading-relaxed">
                Vos collaborateurs ou candidats jouent la simulation. À l'issue de la session, l'Agent Évaluateur produit un audit certifié.
              </p>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={onNavigateToStudio}
              className="px-6 py-3 text-xs font-bold text-light-on-primary bg-light-primary hover:bg-light-primary-container rounded transition-colors inline-flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Sparkles className="w-4 h-4" />
              <span>Accéder au Studio RAG pour créer un scénario</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. MULTI-TENANT & WHITE LABEL */}
      <section className="py-20 max-w-7xl mx-auto px-6 space-y-12">
        <div className="p-8 lg:p-12 bg-light-surface-container-lowest border border-light-outline-variant rounded-2xl shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-light-secondary-container text-light-on-secondary-container text-xs font-mono font-bold">
              ENTREPRISE & PARTENAIRES · MODE MARQUE BLANCHE
            </div>
            <h2 className="text-3xl font-extrabold text-light-on-surface font-headline">
              Pensé pour les ETI, DRH et Cabinets de Conseil en Marque Blanche
            </h2>
            <p className="text-sm text-light-on-surface-variant leading-relaxed">
              MiraStudio a été conçu dès le premier jour avec une isolation multi-tenant totale (RLS PostgreSQL).
              Les cabinets de conseil et business schools peuvent déployer des environnements dédiés sous leur propre marque
              pour accompagner leurs clients d'entreprise.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                <span className="text-light-on-surface-variant">Portail White-Label aux couleurs de votre cabinet.</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                <span className="text-light-on-surface-variant">Éligibilité aux fonds de formation professionnelle (OPCO).</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                <span className="text-light-on-surface-variant">Schéma PostgreSQL avec Row-Level Security et Drizzle ORM.</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                <span className="text-light-on-surface-variant">Exports de rapports d'évaluation certifiés.</span>
              </div>
            </div>
            <div className="pt-2">
              <button
                onClick={onNavigateToArchitecture}
                className="px-5 py-2.5 text-xs font-bold text-light-on-surface bg-light-surface-container-low hover:bg-light-surface-container border border-light-outline-variant rounded transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Building2 className="w-4 h-4 text-light-primary" />
                <span>Consulter les spécifications d'architecture & DDL SQL</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 bg-light-surface-container-low border border-light-outline-variant rounded-xl space-y-3">
            <div className="text-xs font-mono font-bold text-light-primary flex items-center justify-between border-b border-light-outline-variant pb-2">
              <span>TENANTS DE DÉMONSTRATION ACTIFS</span>
              <span className="text-success font-bold">2 Instances</span>
            </div>
            <div className="p-3.5 bg-light-surface-container-lowest border border-light-outline-variant rounded-lg space-y-1 shadow-xs">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-light-on-surface">Atlas Tech & Industrie Group</span>
                <span className="font-mono text-light-primary font-semibold text-[11px]">Tier Enterprise</span>
              </div>
              <div className="text-[11px] text-light-on-surface-variant">185 apprenants actifs · Grand Compte ETI</div>
            </div>
            <div className="p-3.5 bg-light-surface-container-lowest border border-light-outline-variant rounded-lg space-y-1 shadow-xs">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-light-on-surface">Toubkal Executive Advisory</span>
                <span className="font-mono text-success font-semibold text-[11px]">Mode Marque Blanche</span>
              </div>
              <div className="text-[11px] text-light-on-surface-variant">420 cadres formés · Cabinet de Conseil</div>
            </div>
            <div className="text-xs text-light-on-surface-variant italic pt-1">
              Basculez d'un profil à l'autre en un clic dans la vue Architecture pour tester l'isolation des données.
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section className="py-20 border-t border-light-outline-variant bg-light-surface">
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          <div className="text-center space-y-3">
            <div className="text-xs font-mono font-bold text-light-primary uppercase tracking-wider">
              Questions Fréquentes
            </div>
            <h2 className="text-3xl font-extrabold text-light-on-surface font-headline">
              Tout comprendre sur le fonctionnement de MiraStudio
            </h2>
          </div>

          <div className="space-y-3.5 pt-2">
            {faqs.map((faq, index) => {
              const isOpen = selectedFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-lg border border-light-outline-variant bg-light-surface-container-lowest shadow-xs overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setSelectedFaq(isOpen ? null : index)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 text-sm font-bold text-light-on-surface hover:text-light-primary transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronRight
                      className={`w-4 h-4 text-light-on-surface-variant transition-transform ${
                        isOpen ? 'rotate-90 text-light-primary' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-light-on-surface-variant leading-relaxed border-t border-light-outline-variant/60">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. FINAL CALL TO ACTION BANNER */}
      <section className="py-20 border-t border-light-outline-variant bg-light-surface-container-low">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-light-secondary-container text-light-on-secondary-container text-xs font-mono font-bold">
            DÉPLOIEMENT RAPIDE & SANS RISQUE
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-light-on-surface font-headline tracking-tight max-w-3xl mx-auto leading-tight">
            Prêt à transformer vos savoirs internes en simulations immersives ?
          </h2>

          <p className="text-light-on-surface-variant text-base max-w-2xl mx-auto leading-relaxed">
            Testez immédiatement l’un des scénarios phares de notre catalogue ou créez le vôtre en 30 secondes à partir d’une simple note de cadrage.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onStartSimulation(scenarioUpskilling)}
              className="px-8 py-4 text-xs font-bold text-light-on-primary bg-light-primary hover:bg-light-primary-container rounded shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Démarrer une Simulation Immédiatement</span>
            </button>

            <button
              onClick={() => onNavigateToCatalog()}
              className="px-8 py-4 text-xs font-bold text-light-on-surface bg-light-surface-container-lowest hover:bg-light-surface-container border border-light-outline-variant rounded transition-colors cursor-pointer shadow-xs"
            >
              <span>Voir le Catalogue Complet</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
