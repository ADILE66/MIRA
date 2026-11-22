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
  Award,
  Building2,
  Sliders,
  ChevronRight,
  BarChart3,
  Users,
  Target,
  Zap,
  TrendingUp,
  HelpCircle,
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
    <div className="relative overflow-hidden bg-[#0B0F17] text-slate-100 min-h-screen">
      {/* Background Decorative Gradient Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-blue-600/15 via-indigo-600/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[800px] right-0 w-[600px] h-[600px] bg-emerald-500/5 blur-3xl pointer-events-none -z-10" />

      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Announcement pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/60 border border-blue-800/60 text-xs font-medium text-blue-300 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Moteur Hybride Déterministe + Gemini 2.5 Flash + RAG d’Entreprise</span>
            <span className="text-blue-500">·</span>
            <span className="text-slate-300 font-mono">v2.0 Production</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-display max-w-5xl leading-[1.12]">
            Le simulateur de vol décisionnel qui transforme vos documents internes en{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
              réflexes d’excellence
            </span>.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
            Fini les formations passives et les évaluations subjectives. <strong>MiraStudio</strong> ingère
            vos playbooks et chartes d’entreprise (RAG) pour immerger vos équipes face à des personas IA
            adaptatifs, avec <strong>zéro hallucination chiffrée</strong> grâce à notre Moteur d’État déterministe.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onStartSimulation(scenarioUpskilling)}
              className="px-6 py-3.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center gap-2 group cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Lancer une Simulation Live</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigateToCatalog()}
              className="px-6 py-3.5 text-sm font-semibold text-slate-200 bg-[#111827] hover:bg-slate-800 border border-slate-700 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Layers className="w-4 h-4 text-blue-400" />
              <span>Explorer les 4 Modules</span>
            </button>

            <button
              onClick={onNavigateToStudio}
              className="px-5 py-3.5 text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Créer un scénario RAG</span>
            </button>
          </div>

          {/* Key Value Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 w-full max-w-4xl text-left">
            <div className="p-4 rounded-xl bg-[#111827]/70 border border-slate-800/80 backdrop-blur-sm space-y-1">
              <div className="text-lg font-bold text-white font-mono flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                <span>0 Hallucination</span>
              </div>
              <p className="text-xs text-slate-400 leading-snug">
                KPIs et trésorerie gérés par un moteur d'état mathématique pur.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#111827]/70 border border-slate-800/80 backdrop-blur-sm space-y-1">
              <div className="text-lg font-bold text-white font-mono flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>4 Modules Déclinés</span>
              </div>
              <p className="text-xs text-slate-400 leading-snug">
                Upskilling, Business Game, Recrutement et Onboarding.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#111827]/70 border border-slate-800/80 backdrop-blur-sm space-y-1">
              <div className="text-lg font-bold text-white font-mono flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>30 Secondes</span>
              </div>
              <p className="text-xs text-slate-400 leading-snug">
                Pour transformer un PDF interne en simulation jouable.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#111827]/70 border border-slate-800/80 backdrop-blur-sm space-y-1">
              <div className="text-lg font-bold text-white font-mono flex items-center gap-2">
                <Lock className="w-4 h-4 text-indigo-400" />
                <span>Sans Triche</span>
              </div>
              <p className="text-xs text-slate-400 leading-snug">
                Filtres anti-jailbreak et chronomètre strict côté serveur.
              </p>
            </div>
          </div>
        </div>

        {/* Hero Interactive Cockpit Preview */}
        <div className="mt-14 relative rounded-2xl border border-slate-800 bg-[#0B0F17]/90 shadow-2xl overflow-hidden backdrop-blur-xl">
          <div className="px-5 py-3 border-b border-slate-800 bg-[#111827]/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-mono text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>COCKPIT TEMPS RÉEL — SESSION INTERACTIVE</span>
              <span className="text-slate-600">|</span>
              <span className="text-blue-400">Karim Benjelloun (VP Logistique)</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400 font-mono">
              <span>Tour 2/6 · Tour sous haute tension</span>
              <span className="px-2 py-0.5 rounded bg-blue-900/40 text-blue-300 border border-blue-800">
                Loi 69-21 Délais Paiement
              </span>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left simulated chat */}
            <div className="lg:col-span-8 space-y-4">
              <div className="p-4 bg-[#111827] border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">Karim Benjelloun (Persona IA)</span>
                  <span className="text-xs font-mono text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800">
                    Humeur : SKEPTICAL (Confiance: 35/100)
                  </span>
                </div>
                <p className="text-sm text-slate-300 italic">
                  « Vos camions sont encore bloqués au terminal de Tanger Med depuis 4 heures. Si nous n'obtenons pas
                  un avoir immédiat de 25% et un report d'échéance à 120 jours, je résilie notre contrat annuel à 2,4 Millions MAD dès demain matin. »
                </p>
              </div>

              <div className="p-4 bg-blue-950/20 border border-blue-900/40 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs text-blue-400 font-mono">
                  <span>DÉCISION DU JOUEUR (AVEC LEVIER TECHNIQUE ACTIVÉ)</span>
                  <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    AUDIT RAG : RESPECTÉ (Clause 1 & 2 Playbook)
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  « Nous dépêchons un Architecte Principal sous 48h à Tanger pour sécuriser le lien PortNet et vous passons en Support Platinum 24/7 offert pendant 6 mois. Conformément à la Loi 69-21, le délai de règlement reste à 60 jours avec un geste contractuel de 8%. »
                </p>
              </div>
            </div>

            {/* Right simulated deterministic state */}
            <div className="lg:col-span-4 p-5 bg-[#111827] border border-slate-800 rounded-xl space-y-4">
              <div className="text-xs font-mono text-blue-400 border-b border-slate-800 pb-2 flex items-center justify-between">
                <span>MOTEUR D’ÉTAT (KPIs CALCULÉS)</span>
                <span className="text-emerald-400 font-semibold">+6 pts</span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Marge Contrat MAD</span>
                    <span className="font-mono text-white">22.4% (Cible 25%)</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '74%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Confiance Client B2B</span>
                    <span className="font-mono text-emerald-400">58/100 (+15)</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '58%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Conformité Procédures RAG</span>
                    <span className="font-mono text-blue-400">92/100</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-400 rounded-full" style={{ width: '92%' }} />
                  </div>
                </div>
              </div>

              <button
                onClick={() => onStartSimulation(scenarioUpskilling)}
                className="w-full py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Tester cette session</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE 4 CORE USE CASES SECTION */}
      <section className="py-20 border-t border-slate-800/80 bg-[#0E1420]">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="text-xs font-mono text-blue-400 uppercase tracking-wider">
              Une Plateforme Unique · 4 Déclinaisons Stratégiques
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-display">
              Un moteur de simulation conçu pour couvrir tous vos cycles de vie RH et managériaux
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
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
                  className={`px-4 py-2.5 text-xs font-medium rounded-xl border transition-all flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20'
                      : 'bg-[#111827] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Module Focus Card */}
          <div className="p-8 bg-[#111827] border border-slate-800 rounded-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {activeTabModule === 'upskilling' && (
              <>
                <div className="lg:col-span-7 space-y-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-blue-950/60 text-blue-400 border border-blue-800/60 text-xs font-mono">
                    USAGE 01 · TRAINING COMMERCIAL & LEADERSHIP
                  </div>
                  <h3 className="text-2xl font-bold text-white font-display">
                    Formation & Upskilling : Jeux de rôle immersifs face à des personas IA
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Entraînez vos commerciaux, acheteurs et managers face à des clients exigeants, des collaborateurs en
                    difficulté ou des comités d'audit. Le persona s'adapte en temps réel selon la qualité de l'argumentaire,
                    sans jamais s'éloigner des règles tarifaires et SLA de votre entreprise.
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Personas psychologiques avec humeur dynamique (HOSTILE à CONVINCED) et agenda caché.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Audit RAG à chaque réplique : bonus si la clause est appliquée, pénalité si la règle est violée.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Rapport de debriefing complet avec radar 5 axes et alternatives formulées.</span>
                    </li>
                  </ul>
                  <div className="pt-2">
                    <button
                      onClick={() => onStartSimulation(scenarioUpskilling)}
                      className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Lancer la simulation Formation (Tanger Med)</span>
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5 p-6 bg-[#0B0F17] border border-slate-800 rounded-xl space-y-4">
                  <div className="text-xs font-mono text-slate-400 uppercase">Cas Concret Déployé</div>
                  <div className="text-base font-semibold text-white font-display">
                    Crise Logistique Tanger Med & Loi 69-21
                  </div>
                  <div className="text-xs text-slate-400 leading-relaxed">
                    Négociation sous haute tension suite à une panne EDI bloquant des dizaines de camions à l’export. Le client réclame 25% d'avoir et un paiement différé à 120 jours (interdit par la DGI).
                  </div>
                  <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono">
                    <span className="px-2 py-1 bg-slate-800 text-slate-300 rounded">Durée : 20 min</span>
                    <span className="px-2 py-1 bg-slate-800 text-slate-300 rounded">6 Tours Max</span>
                    <span className="px-2 py-1 bg-emerald-950 text-emerald-300 rounded border border-emerald-800">Éligible CSF OFPPT</span>
                  </div>
                </div>
              </>
            )}

            {activeTabModule === 'business_game' && (
              <>
                <div className="lg:col-span-7 space-y-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-indigo-950/60 text-indigo-400 border border-indigo-800/60 text-xs font-mono">
                    USAGE 02 · GOUVERNANCE & COMITÉ EXÉCUTIF
                  </div>
                  <h3 className="text-2xl font-bold text-white font-display">
                    Simulation Stratégique : Pilotage de BU sur 4 trimestres virtuels
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Mettez vos hauts potentiels et dirigeants dans le fauteuil de Directeur Général. Chaque trimestre
                    impose d'arbitrer les investissements R&D, l'effort commercial, le BFR et la masse salariale. L'IA
                    génère des chocs macroéconomiques réalistes à chaque passage de trimestre.
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Suivi rigoureux de la trésorerie nette (en kMAD / Euros) et du seuil de runway critique.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Aléas de marché imprévisibles : contre-attaque concurrentielle, inflation, défaillance fournisseur.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Évaluation devant le Conseil d'Administration en fin d'exercice fiscal.</span>
                    </li>
                  </ul>
                  <div className="pt-2">
                    <button
                      onClick={() => onStartSimulation(scenarioBusiness)}
                      className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Lancer le Business Game (4 Trimestres)</span>
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5 p-6 bg-[#0B0F17] border border-slate-800 rounded-xl space-y-4">
                  <div className="text-xs font-mono text-slate-400 uppercase">Cas Concret Déployé</div>
                  <div className="text-base font-semibold text-white font-display">
                    Business Game CFC & Expansion Régionale
                  </div>
                  <div className="text-xs text-slate-400 leading-relaxed">
                    Arbitrez vos budgets d'acquisition à Casablanca, de R&D à Technopolis et maintenez la trésorerie au-dessus de 4 500 kMAD face à la concurrence et aux exigences des actionnaires.
                  </div>
                  <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono">
                    <span className="px-2 py-1 bg-slate-800 text-slate-300 rounded">Durée : 30 min</span>
                    <span className="px-2 py-1 bg-slate-800 text-slate-300 rounded">4 Trimestres (Q1-Q4)</span>
                    <span className="px-2 py-1 bg-indigo-950 text-indigo-300 rounded border border-indigo-800">Niveau : Expert</span>
                  </div>
                </div>
              </>
            )}

            {activeTabModule === 'recruitment' && (
              <>
                <div className="lg:col-span-7 space-y-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-amber-950/60 text-amber-400 border border-amber-800/60 text-xs font-mono">
                    USAGE 03 · ASSESSMENT RH & TALENT ACQUISITION
                  </div>
                  <h3 className="text-2xl font-bold text-white font-display">
                    Recrutement : Mises en situation chronométrées sans triche possible
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Fini les CVs gonflés et les réponses standardisées rédigées par ChatGPT. Placez les candidats dans
                    un cockpit sous contrainte de temps (20 min) face à un interlocuteur complexe. Le moteur analyse la
                    posture, la réactivité, le sang-froid et le respect des normes sans aucun biais humain.
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Protection anti-triche : filtres d'injection de prompt et chronomètre strict non modifiable.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Benchmark automatisé des candidats sur une grille de compétences harmonisée.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Génération instantanée du rapport d'entretien pour le Talent Acquisition Lead.</span>
                    </li>
                  </ul>
                  <div className="pt-2">
                    <button
                      onClick={() => onStartSimulation(scenarioRecruitment)}
                      className="px-5 py-2.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Tester l'Assessment Candidat</span>
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5 p-6 bg-[#0B0F17] border border-slate-800 rounded-xl space-y-4">
                  <div className="text-xs font-mono text-slate-400 uppercase">Cas Concret Déployé</div>
                  <div className="text-base font-semibold text-white font-display">
                    Évaluation Management Tech & Fuite des Talents
                  </div>
                  <div className="text-xs text-slate-400 leading-relaxed">
                    Un Tech Lead stratégique menace de partir chez un concurrent offshore. Le candidat doit désamorcer la tension, analyser la charge de travail et appliquer la charte RH sans céder au chantage financier.
                  </div>
                  <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono">
                    <span className="px-2 py-1 bg-slate-800 text-slate-300 rounded">Durée : 20 min</span>
                    <span className="px-2 py-1 bg-slate-800 text-slate-300 rounded">Anti-Jailbreak Actif</span>
                    <span className="px-2 py-1 bg-amber-950 text-amber-300 rounded border border-amber-800">Score & Benchmark Auto</span>
                  </div>
                </div>
              </>
            )}

            {activeTabModule === 'onboarding' && (
              <>
                <div className="lg:col-span-7 space-y-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 text-xs font-mono">
                    USAGE 04 · ONBOARDING & CONDUITE DU CHANGEMENT
                  </div>
                  <h3 className="text-2xl font-bold text-white font-display">
                    Onboarding : Parcours gamifiés fondés sur les procédures internes
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Les nouveaux collaborateurs retiennent moins de 10% d'un PDF de 80 pages lu passivement. Avec
                    MiraStudio, ils apprennent vos procédures en les pratiquant dans des scénarios réalistes : déclaration
                    d'incident sécurité, conformité des données personnelles (CNDP / RGPD) ou politique d'éthique.
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Assimilation active : chaque décision renvoie immédiatement à la clause exacte du document.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Suivi automatique du taux de complétion et de maîtrise pour la Direction des Ressources Humaines.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Mise à jour instantanée dès qu'une nouvelle version de procédure est importée dans le Studio.</span>
                    </li>
                  </ul>
                  <div className="pt-2">
                    <button
                      onClick={() => onStartSimulation(scenarioOnboarding)}
                      className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Tester le Parcours Onboarding</span>
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5 p-6 bg-[#0B0F17] border border-slate-800 rounded-xl space-y-4">
                  <div className="text-xs font-mono text-slate-400 uppercase">Cas Concret Déployé</div>
                  <div className="text-base font-semibold text-white font-display">
                    Crise Fuite de Données & Conformité CNDP
                  </div>
                  <div className="text-xs text-slate-400 leading-relaxed">
                    Détection d’une fuite potentielle de CIN/RIB clients sur un canal non sécurisé. Le nouvel arrivant doit appliquer le protocole d'alerte DPO et l'isolement des systèmes sous 15 minutes.
                  </div>
                  <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono">
                    <span className="px-2 py-1 bg-slate-800 text-slate-300 rounded">Durée : 15 min</span>
                    <span className="px-2 py-1 bg-slate-800 text-slate-300 rounded">Procédure CNDP 09-08</span>
                    <span className="px-2 py-1 bg-emerald-950 text-emerald-300 rounded border border-emerald-800">Certification Immédiate</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 3. THE HYBRID ENGINE ARCHITECTURE */}
      <section className="py-20 max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="text-xs font-mono text-blue-400 uppercase tracking-wider">
            Architecture Système & Zéro Hallucination
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-display">
            Pourquoi MiraStudio n’est pas un simple wrapper d’IA générative
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Les LLMs seuls ne savent pas compter et inventent des chiffres. Notre moteur hybride sépare
            l'intelligence émotionnelle de l'arithmétique d'entreprise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-[#111827] border border-slate-800 rounded-2xl space-y-4 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-800 flex items-center justify-center text-blue-400">
              <Layers className="w-5 h-5" />
            </div>
            <div className="text-xs font-mono text-blue-400">PILIER 01</div>
            <h3 className="text-lg font-bold text-white font-display">
              Moteur d'État Déterministe
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Un réducteur d'état pur en TypeScript qui gère les KPIs financiers (Trésorerie, ARR, Marge EBITDA, Churn).
              Il applique des plafonds stricts et vérifie en permanence les seuils critiques et les conditions d'échec ou de victoire.
            </p>
            <div className="text-[11px] font-mono text-slate-400 bg-[#0B0F17] p-3 rounded-lg border border-slate-800/80">
              ✓ Calculs mathématiques stricts<br />
              ✓ Bornes min/max infranchissables<br />
              ✓ Zéro dérive arithmétique
            </div>
          </div>

          <div className="p-6 bg-[#111827] border border-slate-800 rounded-2xl space-y-4 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-800 flex items-center justify-center text-emerald-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="text-xs font-mono text-emerald-400">PILIER 02</div>
            <h3 className="text-lg font-bold text-white font-display">
              Moteur Narratif & Function Calling
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Propulsé par Google Gemini 2.5 Flash avec l'outil obligatoire <code className="text-emerald-300 font-mono">recordSimulationTurnImpact</code>.
              L'IA est forcée de séparer son discours direct du calcul de ses propositions de deltas sur les indicateurs.
            </p>
            <div className="text-[11px] font-mono text-slate-400 bg-[#0B0F17] p-3 rounded-lg border border-slate-800/80">
              ✓ Personas adaptatifs et crédibles<br />
              ✓ Événements et imprévus contextuels<br />
              ✓ Structured Outputs d'évaluation
            </div>
          </div>

          <div className="p-6 bg-[#111827] border border-slate-800 rounded-2xl space-y-4 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-800 flex items-center justify-center text-amber-400">
              <Shield className="w-5 h-5" />
            </div>
            <div className="text-xs font-mono text-amber-400">PILIER 03</div>
            <h3 className="text-lg font-bold text-white font-display">
              Audit RAG en Temps Réel
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              À chaque tour de dialogue, le moteur vectoriel extrait les clauses applicables des documents internes
              et oblige l'IA à qualifier la conformité (<code className="text-amber-300 font-mono">RESPECTED</code> ou <code className="text-amber-300 font-mono">VIOLATED</code>) avec citation de preuve.
            </p>
            <div className="text-[11px] font-mono text-slate-400 bg-[#0B0F17] p-3 rounded-lg border border-slate-800/80">
              ✓ Ingestion directe de PDF et Playbooks<br />
              ✓ Rapprochement sémantique instantané<br />
              ✓ Impact direct sur le score de conformité
            </div>
          </div>
        </div>
      </section>

      {/* 4. STUDIO RAG : 3 STEPS TO CREATE A SIMULATION */}
      <section className="py-20 border-t border-slate-800/80 bg-[#0E1420]">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
              Studio RAG & Automatisation
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-display">
              Du document interne à la simulation interactive en 3 étapes simples
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Plus besoin de passer des semaines avec une agence de serious gaming. Votre documentation interne devient un jeu d'entraînement en quelques clics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-[#111827] border border-slate-800 rounded-xl space-y-4">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                1
              </div>
              <h3 className="text-base font-semibold text-white font-display">
                Importez vos documents internes
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Glissez-déposez vos playbooks de négociation, chartes de télétravail, réglementations fiscales (Loi 69-21) ou directives de cybersécurité en PDF ou Markdown.
              </p>
            </div>

            <div className="p-6 bg-[#111827] border border-slate-800 rounded-xl space-y-4">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">
                2
              </div>
              <h3 className="text-base font-semibold text-white font-display">
                L’Architecte IA structure le scénario
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Le moteur RAG découpe le document, extrait les règles obligatoires et configure automatiquement le persona, ses objectifs et le contrat de KPIs chiffrés.
              </p>
            </div>

            <div className="p-6 bg-[#111827] border border-slate-800 rounded-xl space-y-4">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
                3
              </div>
              <h3 className="text-base font-semibold text-white font-display">
                Lancez et évaluez vos collaborateurs
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Vos collaborateurs ou candidats jouent la simulation. À l'issue de la session, l'Agent Évaluateur produit un audit certifié et des axes de progrès personnalisés.
              </p>
            </div>
          </div>

          <div className="text-center pt-4">
            <button
              onClick={onNavigateToStudio}
              className="px-6 py-3 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors inline-flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/20"
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
        <div className="p-8 lg:p-12 bg-gradient-to-br from-[#111827] to-[#0E1524] border border-slate-800 rounded-3xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-indigo-950/60 text-indigo-400 border border-indigo-800/60 text-xs font-mono">
              ENTREPRISE & PARTENAIRES · MODE MARQUE BLANCHE
            </div>
            <h2 className="text-3xl font-bold text-white font-display">
              Pensé pour les ETI, DRH et Cabinets de Conseil en Marque Blanche
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              MiraStudio a été conçu dès le premier jour avec une isolation multi-tenant totale (RLS PostgreSQL).
              Les cabinets de conseil et business schools peuvent déployer des environnements dédiés sous leur propre marque
              pour accompagner leurs clients d'entreprise.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-slate-300">Portail White-Label aux couleurs de votre cabinet ou entreprise.</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-slate-300">Éligibilité aux fonds de formation professionnelle (OPCO / CSF).</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-slate-300">Schéma PostgreSQL avec Row-Level Security et Drizzle ORM.</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-slate-300">Exports de rapports d'évaluation en JSON et PDF certifiés.</span>
              </div>
            </div>
            <div className="pt-2">
              <button
                onClick={onNavigateToArchitecture}
                className="px-5 py-2.5 text-xs font-semibold text-slate-200 bg-[#0B0F17] hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-blue-400" />
                <span>Consulter les spécifications d'architecture & DDL SQL</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 bg-[#0B0F17] border border-slate-800 rounded-2xl space-y-4">
            <div className="text-xs font-mono text-slate-400 flex items-center justify-between border-b border-slate-800 pb-2">
              <span>TENANTS DE DÉMONSTRATION ACTIFS</span>
              <span className="text-emerald-400 font-semibold">2 Instances</span>
            </div>
            <div className="p-3.5 bg-[#111827] border border-slate-800 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">Atlas Tech & Industrie Group</span>
                <span className="font-mono text-blue-400 text-[11px]">Tier Enterprise</span>
              </div>
              <div className="text-[11px] text-slate-400">185 apprenants actifs · Siège CFC Casablanca</div>
            </div>
            <div className="p-3.5 bg-[#111827] border border-slate-800 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">Toubkal Executive Advisory</span>
                <span className="font-mono text-emerald-400 text-[11px]">Mode Marque Blanche</span>
              </div>
              <div className="text-[11px] text-slate-400">420 cadres formés · Cabinet Rabat & Benguérir</div>
            </div>
            <div className="text-xs text-slate-500 italic pt-1">
              Basculez d'un profil à l'autre en un clic dans la vue Architecture pour tester l'isolation des données.
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section className="py-20 border-t border-slate-800/80 bg-[#0B0F17]">
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          <div className="text-center space-y-3">
            <div className="text-xs font-mono text-blue-400 uppercase tracking-wider">
              Questions Fréquentes
            </div>
            <h2 className="text-3xl font-bold text-white font-display">
              Tout comprendre sur le fonctionnement de MiraStudio
            </h2>
          </div>

          <div className="space-y-4 pt-4">
            {faqs.map((faq, index) => {
              const isOpen = selectedFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-slate-800 bg-[#111827] overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setSelectedFaq(isOpen ? null : index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 text-sm font-semibold text-white hover:text-blue-300 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronRight
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        isOpen ? 'rotate-90 text-blue-400' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60">
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
      <section className="py-20 border-t border-slate-800 bg-gradient-to-b from-[#0E1524] to-[#0B0F17]">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-950/80 text-blue-300 border border-blue-800 text-xs font-mono">
            DÉPLOIEMENT RAPIDE & SANS RISQUE
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold text-white font-display tracking-tight max-w-3xl mx-auto leading-tight">
            Prêt à transformer vos savoirs internes en simulations immersives ?
          </h2>

          <p className="text-slate-300 text-base max-w-2xl mx-auto leading-relaxed">
            Testez immédiatement l’un des scénarios phares de notre catalogue ou créez le vôtre en 30 secondes à partir d’une simple note de cadrage.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onStartSimulation(scenarioUpskilling)}
              className="px-8 py-4 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-xl shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Démarrer une Simulation Immédiatement</span>
            </button>

            <button
              onClick={() => onNavigateToCatalog()}
              className="px-8 py-4 text-sm font-semibold text-slate-200 bg-[#111827] hover:bg-slate-800 border border-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              <span>Voir le Catalogue Complet</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
