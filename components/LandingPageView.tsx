'use client';

import React, { useState, useMemo } from 'react';
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
  TrendingUp,
  Calculator,
  Award,
  Zap,
  HelpCircle,
  Briefcase,
  Sliders,
  Compass,
  AlertTriangle,
  RotateCcw,
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
  // State for interactive sections
  const [selectedFaq, setSelectedFaq] = useState<number | null>(0);
  const [activeTabModule, setActiveTabModule] = useState<ModuleType>('upskilling');
  const [heroShowcaseTab, setHeroShowcaseTab] = useState<'dialogue' | 'telemetry' | 'eval'>('dialogue');
  const [heroLeverActive, setHeroLeverActive] = useState<boolean>(false);

  // State for Interactive ROI Calculator
  const [roiCollaborators, setRoiCollaborators] = useState<number>(120);
  const [roiExternalCost, setRoiExternalCost] = useState<number>(12000); // en MAD (ou ~1200 €)
  const [roiSessionsPerYear, setRoiSessionsPerYear] = useState<number>(3);

  // Scenarios for each module
  const scenarioUpskilling = scenarios.find((s) => s.moduleType === 'upskilling') || scenarios[0];
  const scenarioBusiness = scenarios.find((s) => s.moduleType === 'business_game') || scenarios[1] || scenarios[0];
  const scenarioRecruitment = scenarios.find((s) => s.moduleType === 'recruitment') || scenarios[2] || scenarios[0];
  const scenarioOnboarding = scenarios.find((s) => s.moduleType === 'onboarding') || scenarios[3] || scenarios[0];

  // Dynamic calculations for ROI
  const calculatedSavings = useMemo(() => {
    // Coût méthode traditionnelle = formation physique externe pour tous
    const totalTraditionalCost = (roiCollaborators / 10) * roiExternalCost * roiSessionsPerYear;
    // Coût estimé MiraStudio = abonnement SaaS / coût par siège (~75% d'économie)
    const miraCost = totalTraditionalCost * 0.22;
    const savings = Math.max(0, totalTraditionalCost - miraCost);
    const practiceHours = roiCollaborators * roiSessionsPerYear * 2.5; // 2.5h de pratique immersive par session
    const retentionRate = 88; // 88% vs 12% passif

    return {
      traditional: Math.round(totalTraditionalCost),
      mira: Math.round(miraCost),
      savings: Math.round(savings),
      percent: 78,
      practiceHours: Math.round(practiceHours),
      retentionRate,
    };
  }, [roiCollaborators, roiExternalCost, roiSessionsPerYear]);

  // Dynamic values in Hero Cockpit Interactive Preview
  const heroMetrics = useMemo(() => {
    if (heroLeverActive) {
      return {
        margin: 40.0,
        marginLabel: '40.0 % (Objectif ≥ 35 %)',
        marginDelta: '-2.0 %',
        trust: 68,
        trustLabel: '68 / 100',
        trustDelta: '+33 pts',
        arr: 1800,
        ragStatus: 'Clause 2 Playbook Respectée (Architecte 48h sur site Tanger)',
        isSuccess: true,
      };
    }
    return {
      margin: 42.0,
      marginLabel: '42.0 % (Marge brute initiale)',
      marginDelta: '0 %',
      trust: 35,
      trustLabel: '35 / 100 (Hostile / Sceptique)',
      trustDelta: '0 pt',
      arr: 1800,
      ragStatus: 'En attente de proposition réglementaire',
      isSuccess: false,
    };
  }, [heroLeverActive]);

  const faqs = [
    {
      q: "Comment garantissez-vous zéro hallucination sur les chiffres et les KPIs ?",
      a: "Contrairement aux simulateurs 100% LLM, MiraStudio découple strictement la narration du calcul. Le Moteur d'État est un réducteur déterministe en code dur. L'IA ne manipule jamais les variables de trésorerie, de marge ou de churn directement : elle propose des deltas via Function Calling obligatoire, qui sont validés, bornés et appliqués par le moteur mathématique côté serveur."
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
      a: "Oui, nativement. MiraStudio intègre une architecture multi-tenant avec isolation stricte des données (RLS PostgreSQL). Les cabinets de conseil, organismes de formation et business schools peuvent personnaliser l'univers de marque, les couleurs et les scénarios pour leurs propres clients d'entreprise."
    },
    {
      q: "Les formations réalisées sur MiraStudio sont-elles éligibles aux financements légaux ?",
      a: "Absolument. Grâce à la traçabilité intégrale des sessions, aux métriques objectives de début/fin et à l'Agent Évaluateur certifié, MiraStudio fournit tous les éléments de preuve requis par les dispositifs d'ingénierie financière de formation (OPCO, CSF / OFPPT, GIAC)."
    },
    {
      q: "En combien de temps une entreprise peut-elle créer son premier scénario personnalisé ?",
      a: "Moins de 2 minutes. Vous importez un document interne (ex: politique commerciale ou procédure cyber) dans le Studio RAG. L'Architecte IA extrait instantanément les règles obligatoires, génère le persona adverse, configure les jauges mathématiques et produit un scénario immédiatement jouable."
    }
  ];

  return (
    <div className="relative overflow-hidden bg-light-surface text-light-on-surface min-h-screen selection:bg-light-secondary-container selection:text-light-primary">
      {/* Background Subtle Ambience & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#C4C6D3_1px,transparent_1px)] [background-size:28px_28px] opacity-40 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-[#CBD6FE]/30 via-[#FAF8FF]/10 to-transparent blur-3xl pointer-events-none" />

      {/* =========================================================================
          1. HERO SECTION : HIGH-PRECISION VALUE PROPOSITION & LIVE COCKPIT
         ========================================================================= */}
      <section className="relative max-w-7xl mx-auto px-6 pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="flex flex-col items-center text-center space-y-7">
          
          {/* Executive Live Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-light-surface-container-lowest border border-light-outline-variant shadow-xs text-xs font-semibold text-light-primary">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
            </span>
            <span className="font-mono tracking-wide">MOTEUR HYBRIDE DÉTERMINISTE + RAG TEMPS RÉEL</span>
            <span className="text-light-outline-variant">·</span>
            <span className="font-mono text-[11px] text-light-on-surface-variant font-bold">Zéro Hallucination</span>
          </div>

          {/* Main Title with Executive Typography */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-light-on-surface font-headline max-w-5xl leading-[1.12]">
            Le simulateur de vol décisionnel qui transforme vos documents internes en{' '}
            <span className="bg-gradient-to-r from-light-primary via-[#1B4396] to-light-secondary bg-clip-text text-transparent underline decoration-light-secondary-container decoration-wavy underline-offset-8">
              réflexes d’excellence
            </span>.
          </h1>

          {/* Value Subtitle */}
          <p className="text-base sm:text-lg text-light-on-surface-variant max-w-3xl leading-relaxed">
            Fini les formations passives que tout le monde oublie et les entretiens subjectifs. <strong>MiraStudio</strong> ingère
            vos playbooks et chartes d’entreprise (RAG) pour immerger vos équipes face à des personas IA
            adaptatifs, avec <strong>zéro dérive chiffrée</strong> grâce à notre Moteur d’État déterministe.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
            <button
              onClick={() => onStartSimulation(scenarioUpskilling)}
              className="px-7 py-4 text-xs font-bold text-light-on-primary bg-light-primary hover:bg-[#1B4396] rounded-lg shadow-md transition-all flex items-center gap-2.5 group cursor-pointer hover:shadow-lg active:scale-98"
            >
              <span className="material-symbols-outlined text-base">flight_takeoff</span>
              <span>Lancer une Simulation Live</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigateToCatalog()}
              className="px-6 py-4 text-xs font-bold text-light-on-surface bg-light-surface-container-lowest hover:bg-light-surface-container-low border border-light-outline-variant rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs active:scale-98"
            >
              <Layers className="w-4 h-4 text-light-primary" />
              <span>Explorer les 4 Modules Opérationnels</span>
            </button>

            <button
              onClick={onNavigateToStudio}
              className="px-5 py-4 text-xs font-semibold text-light-primary hover:text-[#1B4396] transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-success" />
              <span>Créer un scénario RAG (30s)</span>
            </button>
          </div>

          {/* 4 Trust Metrics Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 w-full max-w-5xl text-left">
            <div className="p-4 rounded-xl bg-light-surface-container-lowest border border-light-outline-variant shadow-xs space-y-1 hover:border-light-primary/50 transition-colors">
              <div className="text-sm font-bold text-light-on-surface font-headline flex items-center gap-2">
                <Shield className="w-4 h-4 text-light-primary" />
                <span>0 % Hallucination</span>
              </div>
              <p className="text-xs text-light-on-surface-variant leading-snug">
                KPIs, trésorerie et marges gérés par un moteur mathématique pur.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-light-surface-container-lowest border border-light-outline-variant shadow-xs space-y-1 hover:border-light-primary/50 transition-colors">
              <div className="text-sm font-bold text-light-on-surface font-headline flex items-center gap-2">
                <Cpu className="w-4 h-4 text-success" />
                <span>4 Cas d'Usage</span>
              </div>
              <p className="text-xs text-light-on-surface-variant leading-snug">
                Formation, Business Game, Recrutement, Onboarding.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-light-surface-container-lowest border border-light-outline-variant shadow-xs space-y-1 hover:border-light-primary/50 transition-colors">
              <div className="text-sm font-bold text-light-on-surface font-headline flex items-center gap-2">
                <Clock className="w-4 h-4 text-warning" />
                <span>30 Secondes</span>
              </div>
              <p className="text-xs text-light-on-surface-variant leading-snug">
                Pour convertir un PDF interne en simulation jouable.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-light-surface-container-lowest border border-light-outline-variant shadow-xs space-y-1 hover:border-light-primary/50 transition-colors">
              <div className="text-sm font-bold text-light-on-surface font-headline flex items-center gap-2">
                <Lock className="w-4 h-4 text-light-secondary" />
                <span>Conforme & Sécurisé</span>
              </div>
              <p className="text-xs text-light-on-surface-variant leading-snug">
                RLS PostgreSQL, souveraineté Cloud, anti-prompt injection.
              </p>
            </div>
          </div>
        </div>

        {/* =========================================================================
            HERO SHOWCASE WIDGET: INTERACTIVE COCKPIT TELEMETRY & DIALOGUE PREVIEW
           ========================================================================= */}
        <div className="mt-14 relative rounded-2xl border border-light-outline-variant bg-light-surface-container-lowest shadow-xl overflow-hidden">
          {/* Top telemetry bar */}
          <div className="px-5 py-3.5 border-b border-light-outline-variant bg-light-surface-container-low flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 font-mono text-light-on-surface-variant font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse" />
              <span className="font-bold text-light-on-surface">COCKPIT INTERACTIF EN DIRECT</span>
              <span className="text-light-outline-variant">|</span>
              <span className="text-light-primary font-semibold">Driss Chraïbi (DSI Maghreb Fret & Logistique)</span>
            </div>
            
            {/* Interactive Showcase Tabs */}
            <div className="flex items-center gap-1 p-1 bg-light-surface-container rounded-lg border border-light-outline-variant">
              <button
                onClick={() => setHeroShowcaseTab('dialogue')}
                className={`px-3 py-1 text-xs font-semibold rounded transition-all cursor-pointer ${
                  heroShowcaseTab === 'dialogue'
                    ? 'bg-light-surface-container-lowest text-light-primary shadow-xs'
                    : 'text-light-on-surface-variant hover:text-light-on-surface'
                }`}
              >
                1. Dialogue & Persona
              </button>
              <button
                onClick={() => setHeroShowcaseTab('telemetry')}
                className={`px-3 py-1 text-xs font-semibold rounded transition-all cursor-pointer ${
                  heroShowcaseTab === 'telemetry'
                    ? 'bg-light-surface-container-lowest text-light-primary shadow-xs'
                    : 'text-light-on-surface-variant hover:text-light-on-surface'
                }`}
              >
                2. Moteur Mathématique
              </button>
              <button
                onClick={() => setHeroShowcaseTab('eval')}
                className={`px-3 py-1 text-xs font-semibold rounded transition-all cursor-pointer ${
                  heroShowcaseTab === 'eval'
                    ? 'bg-light-surface-container-lowest text-light-primary shadow-xs'
                    : 'text-light-on-surface-variant hover:text-light-on-surface'
                }`}
              >
                3. Audit & Radar 5 Axes
              </button>
            </div>
          </div>

          <div className="p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 cols: Content of the active showcase tab */}
            <div className="lg:col-span-7 space-y-4">
              {heroShowcaseTab === 'dialogue' && (
                <>
                  <div className="p-4 bg-light-surface-container-low border border-light-outline-variant rounded-xl space-y-2 shadow-xs">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-light-on-surface flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                        Driss Chraïbi (Persona IA Adaptatif)
                      </span>
                      <span className="text-[11px] font-mono font-bold text-on-warning-container bg-warning-container px-2 py-0.5 rounded">
                        Posture : HOSTILE (Tension Portuaire)
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-light-on-surface italic leading-relaxed">
                      « Vos serveurs ont subi 4 heures d’interruption pendant le dédouanement à Tanger Med. J'ai 38 camions bloqués !
                      Mon Président exige une remise immédiate de 30% sur les 1,8 Millions MAD annuels et un étalement de facturation à 120 jours,
                      sinon nous résilions le contrat dès ce soir. »
                    </p>
                  </div>

                  <div className={`p-4 rounded-xl border transition-all ${
                    heroLeverActive
                      ? 'bg-emerald-50/70 border-emerald-300'
                      : 'bg-light-secondary-container/30 border-light-secondary-container'
                  }`}>
                    <div className="flex items-center justify-between text-xs font-mono mb-2">
                      <span className="text-light-primary font-bold">RÉPONSE DÉCISIONNELLE DU JOUEUR</span>
                      <span className={`flex items-center gap-1 font-bold ${
                        heroLeverActive ? 'text-emerald-700' : 'text-amber-700'
                      }`}>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {heroMetrics.ragStatus}
                      </span>
                    </div>
                    <p className="text-xs text-light-on-surface leading-relaxed">
                      {heroLeverActive
                        ? "« Nous vous présentons nos excuses pour l'impact opérationnel. Plutôt qu'une remise tarifaire destructive, nous détachons un Architecte Principal sous 48h sur site à Tanger Med et vous offrons 6 mois de Support Platinum. Conformément à la Loi 69-21, le délai légal reste fixé à 60 jours avec un geste d'avoir plafonné à 8%. »"
                        : "Cliquez sur le levier tactique à droite pour injecter la solution conforme au Playbook Vente et observer la réaction en temps réel du moteur d'état !"}
                    </p>
                  </div>

                  {/* Interactive Trigger Button */}
                  <div className="pt-1 flex items-center gap-3">
                    <button
                      onClick={() => setHeroLeverActive(!heroLeverActive)}
                      className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
                        heroLeverActive
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-light-surface-container-lowest border-light-outline-variant text-light-primary hover:bg-light-surface-container-low'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>{heroLeverActive ? '✓ Levier Tactique Appliqué (Réinitialiser)' : '⚡ Activer le levier : "Détacher Architecte 48h sur site"'}</span>
                    </button>
                    <span className="text-[11px] text-light-on-surface-variant font-mono">
                      (Modifie les KPIs en direct)
                    </span>
                  </div>
                </>
              )}

              {heroShowcaseTab === 'telemetry' && (
                <div className="space-y-4">
                  <div className="text-xs font-mono font-bold text-light-primary uppercase">
                    Découplage Strict : Arithmétique vs LLM
                  </div>
                  <h4 className="text-lg font-bold text-light-on-surface font-headline">
                    Le Moteur d'État refuse tout chiffre non audité
                  </h4>
                  <p className="text-xs text-light-on-surface-variant leading-relaxed">
                    Chez MiraStudio, le modèle de langage (Gemini 2.5 Flash) n’a aucun droit d’écriture sur les variables de gestion.
                    Il émet un appel de fonction structuré <code>recordSimulationTurnImpact</code>. Le moteur vérifie les plafonds
                    contractuels (max 10% d'avoir, délai max 60 jours) avant d'autoriser l'impact.
                  </p>
                  <div className="p-4 bg-light-surface-container-low border border-light-outline-variant rounded-xl font-mono text-[11px] text-light-on-surface space-y-1">
                    <div className="text-success font-semibold">// Contrat d'état garanti par TypeScript</div>
                    <div>{`function reduceSimulationState(current, impact) {`}</div>
                    <div className="pl-4 text-light-primary">{`const verifiedDelta = Math.min(impact.slaCredit, MAX_CREDIT_10PCT);`}</div>
                    <div className="pl-4">{`return { ...current, margin: current.margin - verifiedDelta };`}</div>
                    <div>{`}`}</div>
                  </div>
                </div>
              )}

              {heroShowcaseTab === 'eval' && (
                <div className="space-y-4">
                  <div className="text-xs font-mono font-bold text-success uppercase">
                    Agent Évaluateur Indépendant
                  </div>
                  <h4 className="text-lg font-bold text-light-on-surface font-headline">
                    Bilan d'évaluation certifié et radar de compétences
                  </h4>
                  <p className="text-xs text-light-on-surface-variant leading-relaxed">
                    À la fin de la session, un agent Gemini Pro analyse la transcription complète et confronte chaque décision aux clauses du RAG.
                    Il produit un radar de compétences 5 axes et des reformulations personnalisées.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                    <div className="p-3 bg-light-surface-container-low border border-light-outline-variant rounded-lg text-center">
                      <div className="text-[10px] font-mono text-light-on-surface-variant">Respect RAG</div>
                      <div className="text-base font-bold font-mono text-emerald-700">92 / 100</div>
                    </div>
                    <div className="p-3 bg-light-surface-container-low border border-light-outline-variant rounded-lg text-center">
                      <div className="text-[10px] font-mono text-light-on-surface-variant">Préservation Marge</div>
                      <div className="text-base font-bold font-mono text-light-primary">88 / 100</div>
                    </div>
                    <div className="p-3 bg-light-surface-container-low border border-light-outline-variant rounded-lg text-center">
                      <div className="text-[10px] font-mono text-light-on-surface-variant">Gestion Émotionnelle</div>
                      <div className="text-base font-bold font-mono text-amber-700">76 / 100</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right 5 cols: Live Telemetry Instrument Panel */}
            <div className="lg:col-span-5 p-6 bg-light-surface-container-low border border-light-outline-variant rounded-xl space-y-5">
              <div className="text-xs font-mono text-light-primary font-bold border-b border-light-outline-variant pb-2.5 flex items-center justify-between">
                <span>INDICATEURS DÉTERMINISTES</span>
                <span className="text-success font-bold font-mono">Status: ACTIF</span>
              </div>

              <div className="space-y-4 text-xs">
                {/* Metric 1 */}
                <div>
                  <div className="flex justify-between text-light-on-surface font-medium mb-1.5">
                    <span>Marge Brute Contrat</span>
                    <span className="font-mono font-bold text-light-on-surface">{heroMetrics.marginLabel}</span>
                  </div>
                  <div className="h-2.5 w-full bg-light-surface-container-highest rounded-full overflow-hidden">
                    <div
                      className="h-full bg-light-primary rounded-full transition-all duration-500"
                      style={{ width: `${(heroMetrics.margin / 50) * 100}%` }}
                    />
                  </div>
                  <div className="mt-1 flex justify-between text-[10px] font-mono text-light-on-surface-variant">
                    <span>Seuil critique: 28%</span>
                    <span className="text-light-primary font-semibold">Cible: ≥ 35%</span>
                  </div>
                </div>

                {/* Metric 2 */}
                <div>
                  <div className="flex justify-between text-light-on-surface font-medium mb-1.5">
                    <span>Confiance & Satisfaction Client</span>
                    <span className="font-mono font-bold text-success">{heroMetrics.trustLabel}</span>
                  </div>
                  <div className="h-2.5 w-full bg-light-surface-container-highest rounded-full overflow-hidden">
                    <div
                      className="h-full bg-success rounded-full transition-all duration-500"
                      style={{ width: `${heroMetrics.trust}%` }}
                    />
                  </div>
                  <div className="mt-1 flex justify-between text-[10px] font-mono text-light-on-surface-variant">
                    <span>Posture: Hostile</span>
                    <span className="text-success font-semibold">Cible: ≥ 75/100</span>
                  </div>
                </div>

                {/* Metric 3 */}
                <div>
                  <div className="flex justify-between text-light-on-surface font-medium mb-1.5">
                    <span>ARR Contrat Sécurisé</span>
                    <span className="font-mono font-bold text-light-primary">1 800 kMAD</span>
                  </div>
                  <div className="h-2.5 w-full bg-light-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full bg-light-primary rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>
              </div>

              {/* Call to test session */}
              <button
                onClick={() => onStartSimulation(scenarioUpskilling)}
                className="w-full py-3 text-xs font-bold text-light-on-primary bg-light-primary hover:bg-[#1B4396] rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98"
              >
                <span>Entrer dans ce cockpit en direct</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. THE 4 STRATEGIC CORE MODULES (INTERACTIVE TABBED EXPLORATION)
         ========================================================================= */}
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

          {/* Module Selector Segmented Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {[
              { id: 'upskilling', label: '01. Formation & Upskilling', icon: Target },
              { id: 'business_game', label: '02. Simulation Stratégique (Business Game)', icon: BarChart3 },
              { id: 'recruitment', label: '03. Recrutement (Gamified Assessment)', icon: Users },
              { id: 'onboarding', label: '04. Onboarding & Conduite du Changement', icon: FileCheck },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTabModule === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabModule(tab.id as ModuleType)}
                  className={`px-4 py-3 text-xs font-semibold rounded-lg border transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
                    isSelected
                      ? 'bg-light-primary border-light-primary text-white shadow-sm'
                      : 'bg-light-surface-container-lowest border-light-outline-variant text-light-on-surface-variant hover:text-light-on-surface hover:bg-light-surface-container-lowest/80'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Module Focus Card */}
          <div className="p-8 lg:p-10 bg-light-surface-container-lowest border border-light-outline-variant rounded-2xl shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {activeTabModule === 'upskilling' && (
              <>
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-light-secondary-container text-light-primary text-xs font-mono font-bold">
                    USAGE 01 · TRAINING COMMERCIAL, MANAGEMENT & NÉGOCIATION
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-light-on-surface font-headline">
                    Formation & Upskilling : Jeux de rôle immersifs face à des personas IA adaptatifs
                  </h3>
                  <p className="text-sm text-light-on-surface-variant leading-relaxed">
                    Entraînez vos commerciaux, acheteurs et managers face à des clients exigeants, des collaborateurs en
                    difficulté ou des comités d'audit. Le persona réagit émotionnellement en temps réel selon la qualité de l'argumentaire,
                    sans jamais s'éloigner des règles tarifaires, des SLAs et des lois applicables à votre entreprise.
                  </p>
                  <ul className="space-y-2.5 text-xs text-light-on-surface-variant">
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-success shrink-0" />
                      <span>Personas psychologiques avec humeur dynamique (HOSTILE à CONVAINCU) et agenda caché.</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-success shrink-0" />
                      <span>Audit RAG à chaque réplique : bonus si la clause est appliquée, pénalité si la règle est violée.</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-success shrink-0" />
                      <span>Rapport de debriefing complet avec radar 5 axes et alternatives formulées.</span>
                    </li>
                  </ul>
                  <div className="pt-2">
                    <button
                      onClick={() => onStartSimulation(scenarioUpskilling)}
                      className="px-6 py-3.5 text-xs font-bold text-light-on-primary bg-light-primary hover:bg-[#1B4396] rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs active:scale-98"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Lancer la simulation Formation (Crise Logistique Tanger Med)</span>
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5 p-6 bg-light-surface-container-low border border-light-outline-variant rounded-xl space-y-3.5">
                  <div className="text-xs font-mono font-bold text-light-primary uppercase tracking-wider">Cas Concret Déployé</div>
                  <div className="text-base font-bold text-light-on-surface font-headline">
                    Crise Logistique Grands Comptes & Loi 69-21
                  </div>
                  <div className="text-xs text-light-on-surface-variant leading-relaxed">
                    Négociation sous haute tension suite à un blocage technique. Le DSI réclame 30% d'avoir et un paiement différé à 120 jours (illégal en droit marocain).
                  </div>
                  <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono">
                    <span className="px-2.5 py-1 bg-light-surface-container-lowest border border-light-outline-variant text-light-on-surface rounded-md">Durée : 20 min</span>
                    <span className="px-2.5 py-1 bg-light-surface-container-lowest border border-light-outline-variant text-light-on-surface rounded-md">6 Tours Max</span>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-semibold rounded-md">Éligible Financement</span>
                  </div>
                </div>
              </>
            )}

            {activeTabModule === 'business_game' && (
              <>
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-light-secondary-container text-light-primary text-xs font-mono font-bold">
                    USAGE 02 · GOUVERNANCE, FINANCE & COMITÉ EXÉCUTIF
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-light-on-surface font-headline">
                    Simulation Stratégique : Pilotage d'une Business Unit sur 4 trimestres virtuels
                  </h3>
                  <p className="text-sm text-light-on-surface-variant leading-relaxed">
                    Mettez vos hauts potentiels et dirigeants dans le fauteuil de Directeur Général. Chaque trimestre
                    impose d'arbitrer les investissements R&D, l'effort commercial, le BFR et la masse salariale. L'IA
                    génère des chocs macroéconomiques réalistes à chaque passage de trimestre (inflation, riposte concurrentielle, retards clients).
                  </p>
                  <ul className="space-y-2.5 text-xs text-light-on-surface-variant">
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-success shrink-0" />
                      <span>Suivi rigoureux de la trésorerie nette et du seuil de runway critique.</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-success shrink-0" />
                      <span>Aléas de marché imprévisibles : contre-attaque concurrentielle, défaillance fournisseur.</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-success shrink-0" />
                      <span>Évaluation devant le Conseil d'Administration en fin d'exercice fiscal.</span>
                    </li>
                  </ul>
                  <div className="pt-2">
                    <button
                      onClick={() => onStartSimulation(scenarioBusiness)}
                      className="px-6 py-3.5 text-xs font-bold text-light-on-primary bg-light-primary hover:bg-[#1B4396] rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs active:scale-98"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Lancer le Business Game (Q1 à Q4)</span>
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5 p-6 bg-light-surface-container-low border border-light-outline-variant rounded-xl space-y-3.5">
                  <div className="text-xs font-mono font-bold text-light-primary uppercase tracking-wider">Cas Concret Déployé</div>
                  <div className="text-base font-bold text-light-on-surface font-headline">
                    Business Game BU Cloud & Expansion Régionale
                  </div>
                  <div className="text-xs text-light-on-surface-variant leading-relaxed">
                    Arbitrez vos budgets d'acquisition, de R&D et maintenez la trésorerie au-dessus du plancher de 4 500 kMAD face à la concurrence.
                  </div>
                  <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono">
                    <span className="px-2.5 py-1 bg-light-surface-container-lowest border border-light-outline-variant text-light-on-surface rounded-md">Durée : 30 min</span>
                    <span className="px-2.5 py-1 bg-light-surface-container-lowest border border-light-outline-variant text-light-on-surface rounded-md">4 Trimestres Virtuels</span>
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-800 font-semibold rounded-md">Niveau : Dirigeants</span>
                  </div>
                </div>
              </>
            )}

            {activeTabModule === 'recruitment' && (
              <>
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-warning-container text-on-warning-container text-xs font-mono font-bold">
                    USAGE 03 · ASSESSMENT RH & TALENT ACQUISITION
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-light-on-surface font-headline">
                    Recrutement : Mises en situation chronométrées sans triche possible
                  </h3>
                  <p className="text-sm text-light-on-surface-variant leading-relaxed">
                    Fini les CVs gonflés et les réponses standardisées rédigées par ChatGPT. Placez les candidats dans
                    un cockpit sous contrainte de temps (20 min) face à un interlocuteur complexe. Le moteur analyse la
                    posture, la réactivité, le sang-froid et le respect des normes sans aucun biais humain.
                  </p>
                  <ul className="space-y-2.5 text-xs text-light-on-surface-variant">
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-success shrink-0" />
                      <span>Protection anti-triche : filtres d'injection de prompt et chronomètre strict.</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-success shrink-0" />
                      <span>Benchmark automatisé des candidats sur une grille de compétences harmonisée.</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-success shrink-0" />
                      <span>Génération instantanée du rapport d'entretien pour le Talent Acquisition Lead.</span>
                    </li>
                  </ul>
                  <div className="pt-2">
                    <button
                      onClick={() => onStartSimulation(scenarioRecruitment)}
                      className="px-6 py-3.5 text-xs font-bold text-light-on-primary bg-light-primary hover:bg-[#1B4396] rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs active:scale-98"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Tester l'Assessment Candidat (Tech Lead)</span>
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5 p-6 bg-light-surface-container-low border border-light-outline-variant rounded-xl space-y-3.5">
                  <div className="text-xs font-mono font-bold text-light-primary uppercase tracking-wider">Cas Concret Déployé</div>
                  <div className="text-base font-bold text-light-on-surface font-headline">
                    Évaluation Management Tech & Fuite des Talents
                  </div>
                  <div className="text-xs text-light-on-surface-variant leading-relaxed">
                    Un profil clé menace de partir chez un concurrent. Le candidat doit désamorcer la tension, analyser la charge et appliquer la charte RH.
                  </div>
                  <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono">
                    <span className="px-2.5 py-1 bg-light-surface-container-lowest border border-light-outline-variant text-light-on-surface rounded-md">Durée : 20 min</span>
                    <span className="px-2.5 py-1 bg-light-surface-container-lowest border border-light-outline-variant text-light-on-surface rounded-md">Anti-Jailbreak Actif</span>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-semibold rounded-md">Rapport Automatique</span>
                  </div>
                </div>
              </>
            )}

            {activeTabModule === 'onboarding' && (
              <>
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-success-container text-on-success-container text-xs font-mono font-bold">
                    USAGE 04 · ONBOARDING & CONDUITE DU CHANGEMENT
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-light-on-surface font-headline">
                    Onboarding : Parcours gamifiés fondés sur les procédures internes
                  </h3>
                  <p className="text-sm text-light-on-surface-variant leading-relaxed">
                    Les nouveaux collaborateurs retiennent moins de 10% d'un PDF de 80 pages lu passivement. Avec
                    MiraStudio, ils apprennent vos procédures en les pratiquant dans des scénarios réalistes : déclaration
                    d'incident sécurité (Loi 05-20 / maCERT), conformité des données (CNDP 09-08) ou politique d'éthique.
                  </p>
                  <ul className="space-y-2.5 text-xs text-light-on-surface-variant">
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-success shrink-0" />
                      <span>Assimilation active : chaque décision renvoie immédiatement à la clause exacte du document.</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-success shrink-0" />
                      <span>Suivi automatique du taux de complétion et de maîtrise pour la Direction RH.</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-success shrink-0" />
                      <span>Mise à jour instantanée dès qu'une nouvelle version de document est importée dans le Studio.</span>
                    </li>
                  </ul>
                  <div className="pt-2">
                    <button
                      onClick={() => onStartSimulation(scenarioOnboarding)}
                      className="px-6 py-3.5 text-xs font-bold text-light-on-primary bg-light-primary hover:bg-[#1B4396] rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs active:scale-98"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Tester le Parcours Onboarding Cyber</span>
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5 p-6 bg-light-surface-container-low border border-light-outline-variant rounded-xl space-y-3.5">
                  <div className="text-xs font-mono font-bold text-light-primary uppercase tracking-wider">Cas Concret Déployé</div>
                  <div className="text-base font-bold text-light-on-surface font-headline">
                    Incident Cybersécurité & Données Souveraines
                  </div>
                  <div className="text-xs text-light-on-surface-variant leading-relaxed">
                    Détection d’une fuite potentielle de données. Le nouvel arrivant doit appliquer le protocole d'alerte et l'isolement sous 15 minutes.
                  </div>
                  <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono">
                    <span className="px-2.5 py-1 bg-light-surface-container-lowest border border-light-outline-variant text-light-on-surface rounded-md">Durée : 15 min</span>
                    <span className="px-2.5 py-1 bg-light-surface-container-lowest border border-light-outline-variant text-light-on-surface rounded-md">Charte DNSSI / DGSSI</span>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-semibold rounded-md">Certification Immédiate</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. INTERACTIVE ROI & FINANCIAL IMPACT CALCULATOR (NEW)
         ========================================================================= */}
      <section className="py-20 max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold">
            <Calculator className="w-3.5 h-3.5 text-emerald-600" />
            <span>SIMULATEUR D'ÉCONOMIES & ROI</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-light-on-surface font-headline">
            Mesurez le retour sur investissement pour votre organisation
          </h2>
          <p className="text-light-on-surface-variant text-sm sm:text-base">
            Découvrez combien d'heures de coaching et de budget formation externe MiraStudio vous permet d'optimiser chaque année.
          </p>
        </div>

        <div className="p-8 lg:p-12 bg-light-surface-container-lowest border border-light-outline-variant rounded-2xl shadow-md grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left 6 cols: Interactive Sliders */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-light-on-surface">Nombre de collaborateurs à former / évaluer :</span>
                <span className="font-mono font-bold text-light-primary text-sm">{roiCollaborators} personnes</span>
              </div>
              <input
                type="range"
                min={20}
                max={500}
                step={10}
                value={roiCollaborators}
                onChange={(e) => setRoiCollaborators(Number(e.target.value))}
                className="w-full h-2 bg-light-surface-container rounded-lg appearance-none cursor-pointer accent-light-primary"
              />
              <div className="flex justify-between text-[10px] font-mono text-light-on-surface-variant">
                <span>20 collab.</span>
                <span>500 collab.</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-light-on-surface">Coût moyen d'un jour de formation externe traditionnel :</span>
                <span className="font-mono font-bold text-light-primary text-sm">{roiExternalCost.toLocaleString()} MAD</span>
              </div>
              <input
                type="range"
                min={5000}
                max={30000}
                step={1000}
                value={roiExternalCost}
                onChange={(e) => setRoiExternalCost(Number(e.target.value))}
                className="w-full h-2 bg-light-surface-container rounded-lg appearance-none cursor-pointer accent-light-primary"
              />
              <div className="flex justify-between text-[10px] font-mono text-light-on-surface-variant">
                <span>5 000 MAD</span>
                <span>30 000 MAD (~3 000 €)</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-light-on-surface">Nombre d'entraînements / assessments par collaborateur :</span>
                <span className="font-mono font-bold text-light-primary text-sm">{roiSessionsPerYear} sessions / an</span>
              </div>
              <input
                type="range"
                min={1}
                max={6}
                step={1}
                value={roiSessionsPerYear}
                onChange={(e) => setRoiSessionsPerYear(Number(e.target.value))}
                className="w-full h-2 bg-light-surface-container rounded-lg appearance-none cursor-pointer accent-light-primary"
              />
              <div className="flex justify-between text-[10px] font-mono text-light-on-surface-variant">
                <span>1 session</span>
                <span>6 sessions</span>
              </div>
            </div>

            <div className="p-3.5 bg-light-surface-container-low border border-light-outline-variant rounded-xl text-xs text-light-on-surface-variant flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-light-primary shrink-0 mt-0.5" />
              <span>
                Hypothèse basée sur un ratio moyen de 1 formateur externe pour 10 apprenants en présentiel versus un accès illimité 24/7 sur MiraStudio.
              </span>
            </div>
          </div>

          {/* Right 6 cols: Real-Time Results Card */}
          <div className="lg:col-span-6 p-7 bg-gradient-to-br from-[#002C76] to-[#1B4396] text-white rounded-2xl shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/20 pb-4">
              <div className="space-y-0.5">
                <div className="text-xs font-mono text-light-secondary-container tracking-wider uppercase">Économies Annuelles Estimées</div>
                <div className="text-3xl sm:text-4xl font-extrabold font-headline">
                  {calculatedSavings.savings.toLocaleString()} MAD
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-400 text-emerald-950 rounded-full font-mono font-bold text-xs">
                - {calculatedSavings.percent} % de coût
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-white/10 rounded-xl space-y-1">
                <div className="text-white/70">Coût Traditionnel Externe :</div>
                <div className="text-lg font-bold font-mono">{calculatedSavings.traditional.toLocaleString()} MAD</div>
              </div>
              <div className="p-3.5 bg-white/10 rounded-xl space-y-1">
                <div className="text-white/70">Volume de Pratique Réel :</div>
                <div className="text-lg font-bold font-mono">{calculatedSavings.practiceHours} h d'immersion</div>
              </div>
            </div>

            <div className="space-y-2 pt-1 text-xs">
              <div className="flex justify-between items-center text-white/90">
                <span>Taux de rétention des procédures (Mise en situation) :</span>
                <span className="font-mono font-bold text-emerald-300">88 % vs 14 % (Passif)</span>
              </div>
              <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: '88%' }} />
              </div>
            </div>

            <button
              onClick={() => onStartSimulation(scenarioUpskilling)}
              className="w-full py-3.5 text-xs font-bold text-[#002C76] bg-white hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span>Déployer ce modèle pour votre organisation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. COMPARATIVE MATRIX : WHY TRADITIONAL METHODS ARE BROKEN
         ========================================================================= */}
      <section className="py-20 border-t border-light-outline-variant bg-light-surface-container-low">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="text-xs font-mono font-bold text-light-primary uppercase tracking-wider">
              Analyse Comparative des Méthodes
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-light-on-surface font-headline">
              Pourquoi les approches traditionnelles ne suffisent plus
            </h2>
            <p className="text-light-on-surface-variant text-sm sm:text-base">
              Comparatif objectif entre le e-learning passif, les formations physiques et la simulation hybride MiraStudio.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-light-outline-variant rounded-2xl bg-light-surface-container-lowest shadow-sm overflow-hidden">
              <thead className="bg-light-surface-container text-light-on-surface font-headline border-b border-light-outline-variant text-[13px]">
                <tr>
                  <th className="p-4 sm:p-5 font-bold">Critères d'Évaluation</th>
                  <th className="p-4 sm:p-5 text-light-on-surface-variant font-medium">E-Learning Passif (QCM / Vidéos)</th>
                  <th className="p-4 sm:p-5 text-light-on-surface-variant font-medium">Jeux de Rôle Physiques / Formateur</th>
                  <th className="p-4 sm:p-5 bg-light-primary text-white font-bold">MiraStudio (Hybride Déterministe + IA)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-outline-variant">
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-light-on-surface">Rétention & Réflexes</td>
                  <td className="p-4 sm:p-5 text-red-600 font-medium">Faible (8-14%) · Oubli rapide</td>
                  <td className="p-4 sm:p-5 text-amber-700 font-medium">Moyenne · Dépend du groupe</td>
                  <td className="p-4 sm:p-5 bg-emerald-50 font-bold text-emerald-800">Maximale (88%) · Apprentissage actif</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-light-on-surface">Précision des Chiffres & KPIs</td>
                  <td className="p-4 sm:p-5 text-light-on-surface-variant">Théorique uniquement</td>
                  <td className="p-4 sm:p-5 text-light-on-surface-variant">Approximatif / Calculs manuels</td>
                  <td className="p-4 sm:p-5 bg-emerald-50 font-bold text-emerald-800">0% Hallucination · Moteur mathématique pur</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-light-on-surface">Ancrage sur vos Vrais Documents</td>
                  <td className="p-4 sm:p-5 text-red-600 font-medium">Non · Contenus génériques</td>
                  <td className="p-4 sm:p-5 text-amber-700 font-medium">Partiel · Lecture de polycopiés</td>
                  <td className="p-4 sm:p-5 bg-emerald-50 font-bold text-emerald-800">RAG Vectoriel en direct sur vos PDF</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-light-on-surface">Scalabilité & Disponibilité</td>
                  <td className="p-4 sm:p-5 text-emerald-700 font-medium">Scalable mais inefficace</td>
                  <td className="p-4 sm:p-5 text-red-600 font-medium">Limitée · 10 à 15 personnes / jour</td>
                  <td className="p-4 sm:p-5 bg-emerald-50 font-bold text-emerald-800">Illimitée 24/7 · Sans contrainte logistique</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-light-on-surface">Objectivité du Debriefing</td>
                  <td className="p-4 sm:p-5 text-light-on-surface-variant">Score QCM binaire</td>
                  <td className="p-4 sm:p-5 text-amber-700 font-medium">Biais subjectif du formateur</td>
                  <td className="p-4 sm:p-5 bg-emerald-50 font-bold text-emerald-800">Radar 5 axes neutre + Preuves RAG citées</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. THE HYBRID ENGINE ARCHITECTURE (3 PILLARS)
         ========================================================================= */}
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
          <div className="p-7 bg-light-surface-container-lowest border border-light-outline-variant rounded-2xl shadow-xs space-y-4 hover:border-light-primary/50 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-light-primary text-white flex items-center justify-center shadow-xs">
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
            <div className="text-[11px] font-mono text-light-on-surface-variant bg-light-surface-container-low p-3.5 rounded-xl border border-light-outline-variant space-y-1">
              <div>✓ Calculs mathématiques stricts</div>
              <div>✓ Bornes min/max infranchissables</div>
              <div>✓ Zéro dérive arithmétique</div>
            </div>
          </div>

          <div className="p-7 bg-light-surface-container-lowest border border-light-outline-variant rounded-2xl shadow-xs space-y-4 hover:border-light-primary/50 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-light-primary text-white flex items-center justify-center shadow-xs">
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
            <div className="text-[11px] font-mono text-light-on-surface-variant bg-light-surface-container-low p-3.5 rounded-xl border border-light-outline-variant space-y-1">
              <div>✓ Personas adaptatifs et crédibles</div>
              <div>✓ Événements et imprévus contextuels</div>
              <div>✓ Structured Outputs d'évaluation</div>
            </div>
          </div>

          <div className="p-7 bg-light-surface-container-lowest border border-light-outline-variant rounded-2xl shadow-xs space-y-4 hover:border-light-primary/50 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-light-primary text-white flex items-center justify-center shadow-xs">
              <Shield className="w-5 h-5" />
            </div>
            <div className="text-xs font-mono font-bold text-light-primary">PILIER 03</div>
            <h3 className="text-lg font-bold text-light-on-surface font-headline">
              Audit RAG en Temps Réel
            </h3>
            <p className="text-xs text-light-on-surface-variant leading-relaxed">
              À chaque tour de dialogue, le moteur vectoriel extrait les clauses applicables des documents internes
              et oblige l'IA à qualifier la conformité (<code className="text-emerald-700 font-mono font-bold">RESPECTED</code> ou <code className="text-red-700 font-mono font-bold">VIOLATED</code>) avec citation de preuve.
            </p>
            <div className="text-[11px] font-mono text-light-on-surface-variant bg-light-surface-container-low p-3.5 rounded-xl border border-light-outline-variant space-y-1">
              <div>✓ Ingestion directe de PDF et Playbooks</div>
              <div>✓ Rapprochement sémantique instantané</div>
              <div>✓ Impact direct sur le score de conformité</div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. STUDIO RAG : 3 STEPS WORKFLOW TO DEPLOY SCENARIOS
         ========================================================================= */}
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
            <div className="p-7 bg-light-surface-container-lowest border border-light-outline-variant rounded-2xl shadow-xs space-y-3.5">
              <div className="w-9 h-9 rounded-xl bg-light-primary text-white font-bold flex items-center justify-center text-sm font-headline">
                1
              </div>
              <h3 className="text-base font-bold text-light-on-surface font-headline">
                Importez vos documents internes
              </h3>
              <p className="text-xs text-light-on-surface-variant leading-relaxed">
                Glissez-déposez vos playbooks de négociation, chartes de télétravail ou directives de cybersécurité en PDF ou Markdown.
              </p>
            </div>

            <div className="p-7 bg-light-surface-container-lowest border border-light-outline-variant rounded-2xl shadow-xs space-y-3.5">
              <div className="w-9 h-9 rounded-xl bg-[#1B4396] text-white font-bold flex items-center justify-center text-sm font-headline">
                2
              </div>
              <h3 className="text-base font-bold text-light-on-surface font-headline">
                L’Architecte IA structure le scénario
              </h3>
              <p className="text-xs text-light-on-surface-variant leading-relaxed">
                Le moteur RAG découpe le document, extrait les règles impératives et configure automatiquement le persona, ses objectifs et le contrat de KPIs.
              </p>
            </div>

            <div className="p-7 bg-light-surface-container-lowest border border-light-outline-variant rounded-2xl shadow-xs space-y-3.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-sm font-headline">
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
              className="px-7 py-3.5 text-xs font-bold text-light-on-primary bg-light-primary hover:bg-[#1B4396] rounded-lg transition-colors inline-flex items-center gap-2 cursor-pointer shadow-xs active:scale-98"
            >
              <Sparkles className="w-4 h-4" />
              <span>Accéder au Studio RAG pour créer un scénario</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. MULTI-TENANT & WHITE LABEL ARCHITECTURE
         ========================================================================= */}
      <section className="py-20 max-w-7xl mx-auto px-6 space-y-12">
        <div className="p-8 lg:p-12 bg-light-surface-container-lowest border border-light-outline-variant rounded-3xl shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-light-secondary-container text-light-primary text-xs font-mono font-bold">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 text-xs">
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                <span className="text-light-on-surface-variant">Portail White-Label aux couleurs de votre cabinet.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                <span className="text-light-on-surface-variant">Éligibilité aux fonds de formation professionnelle (OPCO).</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                <span className="text-light-on-surface-variant">Schéma PostgreSQL avec Row-Level Security et Drizzle ORM.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                <span className="text-light-on-surface-variant">Exports de rapports d'évaluation certifiés.</span>
              </div>
            </div>
            <div className="pt-2">
              <button
                onClick={onNavigateToArchitecture}
                className="px-5 py-3 text-xs font-bold text-light-on-surface bg-light-surface-container-low hover:bg-light-surface-container border border-light-outline-variant rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs active:scale-98"
              >
                <Building2 className="w-4 h-4 text-light-primary" />
                <span>Consulter les spécifications d'architecture & DDL SQL</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 bg-light-surface-container-low border border-light-outline-variant rounded-2xl space-y-3.5">
            <div className="text-xs font-mono font-bold text-light-primary flex items-center justify-between border-b border-light-outline-variant pb-2.5">
              <span>TENANTS DE DÉMONSTRATION ACTIFS</span>
              <span className="text-success font-bold font-mono">2 Instances</span>
            </div>
            <div className="p-4 bg-light-surface-container-lowest border border-light-outline-variant rounded-xl space-y-1 shadow-xs">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-light-on-surface">Atlas Tech & Industrie Group</span>
                <span className="font-mono text-light-primary font-semibold text-[11px]">Tier Enterprise</span>
              </div>
              <div className="text-[11px] text-light-on-surface-variant">185 apprenants actifs · Grand Compte ETI</div>
            </div>
            <div className="p-4 bg-light-surface-container-lowest border border-light-outline-variant rounded-xl space-y-1 shadow-xs">
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

      {/* =========================================================================
          8. TESTIMONIALS & EXECUTIVE QUOTES
         ========================================================================= */}
      <section className="py-20 border-t border-light-outline-variant bg-light-surface-container-low">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="text-xs font-mono font-bold text-light-primary uppercase tracking-wider">
              Témoignages & Retours d'Expérience
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-light-on-surface font-headline">
              Ce que disent les Directions RH et Comités de Direction
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-7 bg-light-surface-container-lowest border border-light-outline-variant rounded-2xl shadow-xs space-y-4 flex flex-col justify-between">
              <p className="text-xs text-light-on-surface italic leading-relaxed">
                « Nos commerciaux réclamaient des cas pratiques réalistes. Avec MiraStudio, ils s'entraînent face à des personas qui poussent dans les retranchements sans jamais violer nos règles de remises et la Loi 69-21. La rétention a été multipliée par 3. »
              </p>
              <div className="pt-2 border-t border-light-outline-variant flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-light-primary text-white font-bold flex items-center justify-center text-xs font-mono">
                  YB
                </div>
                <div>
                  <div className="text-xs font-bold text-light-on-surface">Youssef Berrada</div>
                  <div className="text-[11px] text-light-on-surface-variant">Directeur Commercial · Groupe Atlas Tech</div>
                </div>
              </div>
            </div>

            <div className="p-7 bg-light-surface-container-lowest border border-light-outline-variant rounded-2xl shadow-xs space-y-4 flex flex-col justify-between">
              <p className="text-xs text-light-on-surface italic leading-relaxed">
                « En recrutement, éliminer la triche ChatGPT est devenu vital. Les candidats sont chronométrés sur un scénario imprévu. Le rapport d'évaluation nous fournit une analyse objective de leurs réflexes sans aucun biais humain. »
              </p>
              <div className="pt-2 border-t border-light-outline-variant flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs font-mono">
                  SF
                </div>
                <div>
                  <div className="text-xs font-bold text-light-on-surface">Salma El Fassi</div>
                  <div className="text-[11px] text-light-on-surface-variant">DRH & Talent Acquisition Lead</div>
                </div>
              </div>
            </div>

            <div className="p-7 bg-light-surface-container-lowest border border-light-outline-variant rounded-2xl shadow-xs space-y-4 flex flex-col justify-between">
              <p className="text-xs text-light-on-surface italic leading-relaxed">
                « Le mode Marque Blanche nous a permis de déployer notre propre plateforme d'évaluation pour nos clients dirigeants. La rigueur du moteur d'état déterministe rassure les directeurs financiers les plus exigeants. »
              </p>
              <div className="pt-2 border-t border-light-outline-variant flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-light-secondary text-white font-bold flex items-center justify-center text-xs font-mono">
                  KT
                </div>
                <div>
                  <div className="text-xs font-bold text-light-on-surface">Pr. Karim Tazi</div>
                  <div className="text-[11px] text-light-on-surface-variant">Associé · Toubkal Executive Advisory</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          9. FAQ ACCORDION SECTION
         ========================================================================= */}
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
                  className="rounded-xl border border-light-outline-variant bg-light-surface-container-lowest shadow-xs overflow-hidden transition-colors"
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

      {/* =========================================================================
          10. FINAL CALL TO ACTION BANNER (HIGH CONVERTING)
         ========================================================================= */}
      <section className="py-24 border-t border-light-outline-variant bg-gradient-to-b from-light-surface-container-low via-light-surface-container-lowest to-light-surface-container-low">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-7">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-light-secondary-container text-light-primary text-xs font-mono font-bold">
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
              className="px-8 py-4 text-xs font-bold text-light-on-primary bg-light-primary hover:bg-[#1B4396] rounded-lg shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-98"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Démarrer une Simulation Immédiatement</span>
            </button>

            <button
              onClick={() => onNavigateToCatalog()}
              className="px-8 py-4 text-xs font-bold text-light-on-surface bg-light-surface-container-lowest hover:bg-light-surface-container-low border border-light-outline-variant rounded-lg transition-colors cursor-pointer shadow-xs active:scale-98"
            >
              <span>Voir le Catalogue Complet (4 Modules)</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
