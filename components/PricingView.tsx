'use client';

import React, { useState } from 'react';
import {
  Check,
  Sparkles,
  Shield,
  Zap,
  Building2,
  HelpCircle,
  ArrowRight,
  ChevronRight,
  Award,
  FileText,
  Users,
  Lock,
  Scale,
  CreditCard,
  PhoneCall,
  RotateCcw,
} from 'lucide-react';
import { ScenarioDefinition } from '@/lib/types';

interface PricingViewProps {
  onStartSimulation: (scenario: ScenarioDefinition) => void;
  onNavigateToCatalog: () => void;
  onNavigateToArchitecture: () => void;
  flagshipScenario: ScenarioDefinition;
}

export default function PricingView({
  onStartSimulation,
  onNavigateToCatalog,
  onNavigateToArchitecture,
  flagshipScenario,
}: PricingViewProps) {
  const [billingCycle, setBillingCycle] = useState<'annual' | 'monthly'>('annual');
  const [currency, setCurrency] = useState<'EUR' | 'MAD'>('MAD');
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null);

  // Exchange rate approximation: 1 EUR ~ 10 MAD
  const currencySymbol = currency === 'MAD' ? 'MAD' : '€';
  const discountRate = billingCycle === 'annual' ? 0.8 : 1.0; // 20% discount on annual

  const plans = [
    {
      id: 'starter',
      name: 'Starter Équipe',
      badge: 'PME & ÉQUIPES LOCALES',
      badgeClass: 'bg-light-surface-container text-light-on-surface-variant border-light-outline-variant',
      description: 'Idéal pour initier vos équipes à la simulation de vol décisionnelle sur un premier périmètre.',
      priceMadMonth: Math.round(4900 * discountRate),
      priceEurMonth: Math.round(490 * discountRate),
      highlight: false,
      ctaText: 'Commencer l’Essai Gratuit',
      features: [
        'Jusqu’à 50 apprenants ou candidats actifs / mois',
        'Accès aux 4 modules (Formation, Business Game, Recrutement, Onboarding)',
        'Moteur d’État Déterministe (0% Hallucination mathématique)',
        'Studio RAG : 5 documents internes indexables (PDF / Markdown)',
        'Bilans d’évaluation individuels certifiés & Radar 5 axes',
        'Filtre anti-triche et anti-prompt injection de base',
        'Support standard par email (temps de réponse < 24h)',
      ],
      notIncluded: [
        'Mode Marque Blanche (White-Label) & domaine personnalisé',
        'Module de conformité réglementaire Maroc (Loi 69-21, CNDP, DGSSI)',
        'Multi-tenants cloisonnés par filiale ou client',
        'Accompagnement ingénierie de financement (OPCO / CSF)',
      ],
    },
    {
      id: 'business',
      name: 'Business & ETI',
      badge: '★ LE PLUS POPULAIRE',
      badgeClass: 'bg-light-primary text-white font-bold shadow-xs',
      description: 'Pour les entreprises et directions RH qui déploient la simulation active à grande échelle.',
      priceMadMonth: Math.round(12900 * discountRate),
      priceEurMonth: Math.round(1290 * discountRate),
      highlight: true,
      ctaText: 'Déployer sur votre Entreprise',
      features: [
        'Jusqu’à 250 apprenants ou candidats actifs / mois',
        'Studio RAG Illimité : Ingestion automatique de tous vos playbooks',
        'Création de scénarios personnalisés en 30 secondes par l’IA',
        'Module dédié Conformité Maroc (Loi 69-21, CNDP 09-08, DGSSI / DNSSI)',
        'Cloisonnement multi-tenants : jusqu’à 5 entités ou départements',
        'Dossier de preuve complet pour financements CSF / OFPPT, GIAC et OPCO',
        'Exports d’audits certifiés en JSON et fiches d’évaluation RH',
        'Support prioritaire dédié avec Customer Success Manager',
      ],
      notIncluded: [
        'Portail 100% Marque Blanche pour revente à des tiers',
        'Hébergement Cloud Souverain dédié sur infrastructure privée',
      ],
    },
    {
      id: 'enterprise',
      name: 'Marque Blanche & Grand Compte',
      badge: 'CABINETS, ECOLES & GROUPES',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold',
      description: 'Pour les cabinets de conseil, business schools et grands groupes souhaitant leur propre plateforme.',
      priceMadMonth: 'Sur Devis',
      priceEurMonth: 'Sur Devis',
      highlight: false,
      ctaText: 'Contacter un Expert B2B',
      features: [
        'Nombre illimité d’apprenants et de candidats',
        'Mode Marque Blanche totale (White-Label) : logo, domaine dédié, CSS sur-mesure',
        'Cloisonnement multi-tenant illimité avec Row-Level Security (PostgreSQL RLS)',
        'Intégration SIRH / LMS (Workday, SuccessFactors, Talentsoft, Lucca) via API',
        'Clonage de personas sur-mesure avec ingestion de données hautement confidentielles',
        'Hébergement souverain garanti sur datacenters au Maroc ou dans l’Union Européenne',
        'Garantie de SLA 99.9% avec astreinte technique dédiée',
        'Formations certifiantes des formateurs internes et consultants',
      ],
      notIncluded: [],
    },
  ];

  const pricingFaqs = [
    {
      q: "Comment sont comptabilisés les 'apprenants ou candidats actifs' ?",
      a: "Un apprenant ou candidat est considéré comme actif uniquement lorsqu'il lance au moins une simulation au cours du mois de facturation. Vous pouvez créer autant de comptes que vous le souhaitez dans votre organisation sans surcoût : seule l'activité réelle est décomptée."
    },
    {
      q: "Les formations sur MiraStudio sont-elles éligibles aux financements légaux (OPCO / CSF / GIAC) ?",
      a: "Oui, à 100%. Grâce au Moteur d'État déterministe et à l'Agent Évaluateur, MiraStudio génère des feuilles d'émargement numériques, des relevés de temps de connexion et des bilans de progression avant/après conformes aux exigences des organismes de financement de la formation professionnelle."
    },
    {
      q: "Comment fonctionne le mode Marque Blanche pour les cabinets de conseil et business schools ?",
      a: "Le forfait Marque Blanche vous permet de déployer MiraStudio sous votre propre nom de marque, avec votre logo, vos couleurs et votre propre nom de domaine (ex: simulateur.votre-cabinet.com). Grâce à notre architecture multi-tenant RLS, vous créez des sous-environnements isolés et étanches pour chacun de vos clients d'entreprise."
    },
    {
      q: "Nos documents internes (PDF, playbooks de vente, chartes) sont-ils protégés ?",
      a: "Absolument. Vos documents sont vectorisés et cloisonnés avec des politiques strictes de Row-Level Security (RLS). Aucune donnée interne n'est utilisée pour entraîner des modèles publics tiers. Pour les secteurs sensibles, nous proposons également des déploiements sur Cloud Souverain au Maroc ou dans l'Union Européenne."
    },
    {
      q: "Puis-je changer de forfait ou résilier à tout moment ?",
      a: "Oui. En facturation mensuelle, vous êtes libre de faire évoluer votre palier ou d'interrompre votre abonnement d'un mois sur l'autre. En facturation annuelle, vous bénéficiez de 20% de remise immédiate (2 mois offerts)."
    },
  ];

  return (
    <div className="relative overflow-hidden bg-light-surface text-light-on-surface min-h-screen py-16 lg:py-24 selection:bg-light-secondary-container selection:text-light-primary">
      {/* Background Subtle Ambiance */}
      <div className="absolute inset-0 bg-[radial-gradient(#C4C6D3_1px,transparent_1px)] [background-size:28px_28px] opacity-40 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-[#CBD6FE]/30 via-[#FAF8FF]/10 to-transparent blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 space-y-16">
        
        {/* =========================================================================
            HEADER & VALUE BANNER
           ========================================================================= */}
        <div className="text-center space-y-5 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-light-surface-container-lowest border border-light-outline-variant shadow-xs text-xs font-semibold text-light-primary">
            <CreditCard className="w-4 h-4 text-light-primary" />
            <span className="font-mono tracking-wide uppercase">Tarification Transparente & Sans Surprise</span>
            <span className="text-light-outline-variant">·</span>
            <span className="font-mono text-[11px] text-light-on-surface-variant font-bold">Éligible Financement Pro</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-light-on-surface font-headline leading-[1.12]">
            Investissez dans des compétences réelles, pas dans du temps de formation passif.
          </h1>

          <p className="text-base sm:text-lg text-light-on-surface-variant max-w-3xl mx-auto leading-relaxed">
            Choisissez l’offre adaptée à la taille de vos équipes. Tous nos forfaits intègrent notre{' '}
            <strong className="text-light-on-surface">Moteur d’État Déterministe</strong> (0% hallucination)
            et l’accès à nos 4 modules opérationnels.
          </p>

          {/* Dual Toggle Controls: Billing (Monthly/Annual) & Currency (MAD/EUR) */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6">
            
            {/* Billing Cycle Toggle */}
            <div className="inline-flex items-center gap-1.5 p-1.5 bg-light-surface-container-lowest border border-light-outline-variant rounded-xl shadow-xs">
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                  billingCycle === 'annual'
                    ? 'bg-light-primary text-white shadow-xs font-bold'
                    : 'text-light-on-surface-variant hover:text-light-on-surface'
                }`}
              >
                <span>Facturation Annuelle</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                  billingCycle === 'annual' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800 font-bold'
                }`}>
                  - 20 % (2 mois offerts)
                </span>
              </button>
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-light-primary text-white shadow-xs font-bold'
                    : 'text-light-on-surface-variant hover:text-light-on-surface'
                }`}
              >
                Facturation Mensuelle
              </button>
            </div>

            {/* Currency Switcher */}
            <div className="inline-flex items-center gap-1 p-1 bg-light-surface-container-lowest border border-light-outline-variant rounded-xl shadow-xs text-xs font-mono">
              <button
                onClick={() => setCurrency('MAD')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  currency === 'MAD'
                    ? 'bg-light-secondary-container text-light-primary font-bold shadow-2xs'
                    : 'text-light-on-surface-variant hover:text-light-on-surface'
                }`}
              >
                MAD (Dirham)
              </button>
              <button
                onClick={() => setCurrency('EUR')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  currency === 'EUR'
                    ? 'bg-light-secondary-container text-light-primary font-bold shadow-2xs'
                    : 'text-light-on-surface-variant hover:text-light-on-surface'
                }`}
              >
                EUR (€)
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            PRICING CARDS (3 TIERS)
           ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch pt-4">
          {plans.map((plan) => {
            const isCustom = typeof plan.priceMadMonth === 'string';
            const displayPrice = currency === 'MAD' ? plan.priceMadMonth : plan.priceEurMonth;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                  plan.highlight
                    ? 'bg-light-surface-container-lowest border-2 border-light-primary shadow-xl ring-4 ring-light-primary/10'
                    : 'bg-light-surface-container-lowest border border-light-outline-variant shadow-sm hover:border-light-primary/40'
                }`}
              >
                {/* Popular pill if highlighted */}
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-light-primary text-white text-xs font-mono font-bold rounded-full shadow-sm">
                    RECOMMANDÉ PAR LES DIRECTIONS RH & ETI
                  </div>
                )}

                <div className="space-y-6">
                  {/* Tier Header */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-light-on-surface font-headline">
                        {plan.name}
                      </h3>
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider ${plan.badgeClass}`}>
                        {plan.badge}
                      </span>
                    </div>
                    <p className="text-xs text-light-on-surface-variant leading-relaxed">
                      {plan.description}
                    </p>
                  </div>

                  {/* Price Block */}
                  <div className="pt-2 pb-4 border-b border-light-outline-variant">
                    {isCustom ? (
                      <div className="space-y-1">
                        <div className="text-3xl font-extrabold text-light-on-surface font-headline">
                          Sur Devis
                        </div>
                        <div className="text-xs text-light-on-surface-variant font-mono">
                          Déploiement sur-mesure & SLA garanti
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl lg:text-5xl font-extrabold font-mono tabular-nums text-light-on-surface font-headline">
                            {Number(displayPrice).toLocaleString()}
                          </span>
                          <span className="text-sm font-bold text-light-primary font-mono">
                            {currencySymbol} / mois
                          </span>
                        </div>
                        <div className="text-[11px] text-light-on-surface-variant font-mono">
                          {billingCycle === 'annual'
                            ? `Facturé annuellement (${(Number(displayPrice) * 12).toLocaleString()} ${currencySymbol}/an)`
                            : 'Sans engagement annuel · Résiliable mensuellement'}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3">
                    <div className="text-xs font-mono font-bold text-light-primary uppercase tracking-wider">
                      Inclus dans cette offre :
                    </div>
                    <ul className="space-y-2.5 text-xs text-light-on-surface">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 leading-snug">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Excluded items if any */}
                    {plan.notIncluded.length > 0 && (
                      <div className="pt-3 border-t border-light-outline-variant/60 space-y-2">
                        <div className="text-[11px] font-mono text-light-on-surface-variant font-medium">
                          Non inclus :
                        </div>
                        <ul className="space-y-1.5 text-xs text-light-on-surface-variant/70">
                          {plan.notIncluded.map((feat, idx) => (
                            <li key={idx} className="flex items-start gap-2 leading-snug line-through">
                              <span className="text-light-outline-variant shrink-0 mt-0.5">✕</span>
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card CTA */}
                <div className="pt-8 mt-6 border-t border-light-outline-variant">
                  {plan.id === 'enterprise' ? (
                    <button
                      onClick={onNavigateToArchitecture}
                      className="w-full py-3.5 px-4 rounded-xl text-xs font-bold text-light-on-surface bg-light-surface-container-low hover:bg-light-surface-container border border-light-outline-variant transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Building2 className="w-4 h-4 text-light-primary" />
                      <span>{plan.ctaText}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onStartSimulation(flagshipScenario)}
                      className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98 ${
                        plan.highlight
                          ? 'bg-light-primary hover:bg-[#1B4396] text-white'
                          : 'bg-light-surface-container-lowest hover:bg-light-surface-container-low text-light-on-surface border border-light-outline-variant'
                      }`}
                    >
                      <Zap className="w-4 h-4" />
                      <span>{plan.ctaText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* =========================================================================
            FEATURE COMPARISON TABLE
           ========================================================================= */}
        <div className="space-y-6 pt-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-light-on-surface font-headline">
              Comparatif Détaillé des Fonctionnalités
            </h2>
            <p className="text-xs sm:text-sm text-light-on-surface-variant">
              Toutes les capacités techniques et managériales comparées point par point.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-light-outline-variant rounded-2xl bg-light-surface-container-lowest shadow-sm overflow-hidden">
              <thead className="bg-light-surface-container text-light-on-surface font-headline border-b border-light-outline-variant text-[13px]">
                <tr>
                  <th className="p-4 sm:p-5 font-bold">Capacité / Module</th>
                  <th className="p-4 sm:p-5 text-center font-bold">Starter</th>
                  <th className="p-4 sm:p-5 text-center bg-light-primary/5 text-light-primary font-bold">Business & ETI</th>
                  <th className="p-4 sm:p-5 text-center font-bold">Marque Blanche</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-outline-variant">
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-light-on-surface">Apprenants / Candidats actifs par mois</td>
                  <td className="p-4 sm:p-5 text-center font-mono">50</td>
                  <td className="p-4 sm:p-5 text-center font-mono bg-light-primary/5 font-bold text-light-primary">250</td>
                  <td className="p-4 sm:p-5 text-center font-mono font-bold text-emerald-700">Illimité</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-light-on-surface">Moteur d’État Déterministe (0% Hallucination)</td>
                  <td className="p-4 sm:p-5 text-center text-emerald-600 font-bold">✓ Inclus</td>
                  <td className="p-4 sm:p-5 text-center bg-light-primary/5 text-emerald-600 font-bold">✓ Inclus</td>
                  <td className="p-4 sm:p-5 text-center text-emerald-600 font-bold">✓ Inclus</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-light-on-surface">Nombre de Référentiels RAG Indexables</td>
                  <td className="p-4 sm:p-5 text-center font-mono">5 documents</td>
                  <td className="p-4 sm:p-5 text-center bg-light-primary/5 font-mono font-bold text-light-primary">Illimité</td>
                  <td className="p-4 sm:p-5 text-center font-mono font-bold text-emerald-700">Illimité</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-light-on-surface">Module de Conformité Maroc (Loi 69-21, CNDP, DGSSI)</td>
                  <td className="p-4 sm:p-5 text-center text-light-outline-variant">✕</td>
                  <td className="p-4 sm:p-5 text-center bg-light-primary/5 text-emerald-600 font-bold">✓ Inclus</td>
                  <td className="p-4 sm:p-5 text-center text-emerald-600 font-bold">✓ Inclus</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-light-on-surface">Radar de Compétences 5 Axes & Debriefing</td>
                  <td className="p-4 sm:p-5 text-center text-emerald-600 font-bold">✓ Inclus</td>
                  <td className="p-4 sm:p-5 text-center bg-light-primary/5 text-emerald-600 font-bold">✓ Inclus</td>
                  <td className="p-4 sm:p-5 text-center text-emerald-600 font-bold">✓ Inclus</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-light-on-surface">Mode Marque Blanche (Domaine & Univers Dédié)</td>
                  <td className="p-4 sm:p-5 text-center text-light-outline-variant">✕</td>
                  <td className="p-4 sm:p-5 text-center bg-light-primary/5 text-light-outline-variant">✕</td>
                  <td className="p-4 sm:p-5 text-center text-emerald-600 font-bold">✓ Inclus</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-light-on-surface">Isolation des Données & RLS PostgreSQL</td>
                  <td className="p-4 sm:p-5 text-center text-light-on-surface-variant font-mono">Partagé</td>
                  <td className="p-4 sm:p-5 text-center bg-light-primary/5 font-mono font-bold text-light-primary">Multi-Tenant Cloisonné</td>
                  <td className="p-4 sm:p-5 text-center font-mono font-bold text-emerald-700">RLS Dédié / Souverain</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-light-on-surface">Éligibilité Financements Formation (OPCO / CSF / GIAC)</td>
                  <td className="p-4 sm:p-5 text-center text-light-outline-variant">✕</td>
                  <td className="p-4 sm:p-5 text-center bg-light-primary/5 text-emerald-600 font-bold">✓ Dossier Certifié</td>
                  <td className="p-4 sm:p-5 text-center text-emerald-600 font-bold">✓ Dossier Certifié</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* =========================================================================
            ENTERPRISE ASSURANCE STRIP (LEGAL & COMPLIANCE)
           ========================================================================= */}
        <div className="p-8 bg-light-surface-container-low border border-light-outline-variant rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="flex items-start gap-3">
            <Scale className="w-5 h-5 text-light-primary shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-light-on-surface">Conformité Loi 69-21 & DGI</div>
              <p className="text-light-on-surface-variant mt-0.5 leading-snug">
                Simulations intégrant les plafonds stricts de délais de paiement et sanctions pécuniaires marocaines.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-light-on-surface">Souveraineté CNDP & DGSSI</div>
              <p className="text-light-on-surface-variant mt-0.5 leading-snug">
                Isolation stricte des données d'entreprise et respect de la Loi 09-08 sur la protection des données.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Award className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-light-on-surface">Prise en Charge CSF & OPCO</div>
              <p className="text-light-on-surface-variant mt-0.5 leading-snug">
                Rapports de formation certifiés avec feuilles d'émargement numériques pour vos dossiers de remboursement.
              </p>
            </div>
          </div>
        </div>

        {/* =========================================================================
            PRICING FAQ ACCORDION
           ========================================================================= */}
        <div className="max-w-4xl mx-auto space-y-6 pt-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-light-on-surface font-headline">
              Questions Fréquentes sur les Tarifs
            </h2>
            <p className="text-xs text-light-on-surface-variant">
              Tout ce que vous devez savoir avant de déployer MiraStudio dans votre organisation.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {pricingFaqs.map((faq, index) => {
              const isOpen = selectedFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-light-outline-variant bg-light-surface-container-lowest shadow-xs overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setSelectedFaq(isOpen ? null : index)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 text-xs sm:text-sm font-bold text-light-on-surface hover:text-light-primary transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronRight
                      className={`w-4 h-4 text-light-on-surface-variant transition-transform shrink-0 ${
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

        {/* =========================================================================
            BOTTOM CALL TO ACTION BANNER
           ========================================================================= */}
        <div className="p-8 lg:p-12 rounded-3xl bg-gradient-to-br from-[#002C76] to-[#1B4396] text-white shadow-xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 text-light-secondary-container text-xs font-mono font-bold">
            ESSAI PILOTE SANS ENGAGEMENT
          </div>

          <h3 className="text-2xl sm:text-4xl font-extrabold font-headline max-w-2xl mx-auto leading-tight">
            Envie de tester MiraStudio sur un cas d'usage concret de votre entreprise ?
          </h3>

          <p className="text-white/80 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Importez un document interne dans notre Studio RAG ou lancez immédiatement l'une de nos simulations de démonstration.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onStartSimulation(flagshipScenario)}
              className="px-6 py-3.5 text-xs font-bold text-[#002C76] bg-white hover:bg-slate-100 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>Lancer une Simulation Gratuite</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onNavigateToCatalog}
              className="px-6 py-3.5 text-xs font-bold text-white bg-white/15 hover:bg-white/20 border border-white/30 rounded-xl transition-colors cursor-pointer"
            >
              Explorer les 4 Modules Opérationnels
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
