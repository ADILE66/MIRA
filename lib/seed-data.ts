import {
  OrganizationTenant,
  UserProfile,
  KnowledgeDocument,
  ScenarioDefinition,
  SimulationSession,
  EvaluationReport,
} from './types';

export const INITIAL_ORGANIZATIONS: OrganizationTenant[] = [
  {
    id: 'org-atlas-holding',
    name: 'Atlas Tech & Industrie Group (CFC Casablanca)',
    slug: 'atlas-group-ma',
    sector: 'ETI Marocaine — FinTech, Cloud Souverain & Logistique (Tanger Med / Casa)',
    planTier: 'Enterprise',
    brandColor: '#3B82F6',
    activeUsersCount: 185,
  },
  {
    id: 'org-toubkal-advisory',
    name: 'Toubkal Executive Advisory & Business School (Rabat / Benguérir)',
    slug: 'toubkal-advisory',
    sector: 'Cabinet de Conseil & Grande École Marocaine (Mode Marque Blanche / Remboursement GIAC-OFPPT)',
    planTier: 'WhiteLabel',
    brandColor: '#10B981',
    activeUsersCount: 420,
  },
];

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'usr-sales-vp',
    uid: 'firebase-uid-sales-vp',
    name: 'Youssef Berrada',
    email: 'y.berrada@atlastech.ma',
    role: 'Directeur Commercial',
    organizationId: 'org-atlas-holding',
  },
  {
    id: 'usr-hr-director',
    uid: 'firebase-uid-hr-dir',
    name: 'Salma El Fassi',
    email: 's.elfassi@atlastech.ma',
    role: 'DRH / Talent Lead',
    organizationId: 'org-atlas-holding',
  },
  {
    id: 'usr-partner-coach',
    uid: 'firebase-uid-partner',
    name: 'Pr. Karim Tazi',
    email: 'k.tazi@toubkal-executive.ma',
    role: 'Consultant / Coach',
    organizationId: 'org-toubkal-advisory',
  },
];

export const INITIAL_KNOWLEDGE_DOCUMENTS: KnowledgeDocument[] = [
  {
    id: 'doc-sales-sla-2026',
    organizationId: 'org-atlas-holding',
    title: 'Politique Grands Comptes Maroc : Remises, SLA & Loi 69-21 Délais de Paiement',
    category: 'sales_playbook',
    version: 'v3.4 — Direction Générale Casablanca',
    createdAt: '2026-10-15T09:00:00Z',
    rawContent: `# RÈGLE 1 : Plafond d'Avoir SLA & Loi 69-21 sur les Délais de Paiement
Toute remise commerciale ou avoir suite à un incident technique de Sévérité 1 sur un corridor logistique (Tanger Med / Nouaceur) est strictement plafonnée à 10% du contrat annuel (en MAD) par un Key Account Manager. Conformément à la Loi 69-21 au Maroc, le délai de règlement de 60 jours est impératif : il est formellement interdit d'accepter un gel des factures ou un délai à 120 jours sous peine d'amendes fiscales DGI.

# RÈGLE 2 : Compensation par Valeur Technique (Ingénierie Dédiée sur Site)
Face à une menace de résiliation client liée à une panne de production douanière/PortNet, privilégier le détachement d'un Architecte Principal sur site à Tanger ou Casablanca pendant 48h ainsi que le passage gratuit au tier "Support Platinum 24/7" pendant 6 mois (impact marge : -2% seulement) plutôt qu'une remise tarifaire destructrice de marge.

# RÈGLE 3 : Transparence RCA & Souveraineté Cloud Maroc
Ne jamais minimiser l'incident ni accuser un opérateur télécom tiers. Présenter systématiquement le rapport RCA factuel sous 24h avec le plan de redondance Active-Active hébergé sur deux datacenters souverains au Maroc (Casablanca & Rabat) conformes aux directives DGSSI.`,
    chunks: [
      {
        id: 'doc-sales-sla-2026-chunk-1',
        title: 'RÈGLE 1 : Plafond Avoir SLA (Max 10%) & Respect Loi 69-21 (60 jours max)',
        content:
          "Tout avoir suite à un incident Sévérité 1 est plafonné à 10% du contrat annuel en MAD. En vertu de la Loi 69-21 au Maroc, il est interdit d'accorder un report d'échéance de facturation au-delà de 60 jours.",
        keywords: ['remise', 'avoir', 'plafond', '10%', 'mad', '69-21', 'delai', 'paiement', 'sla', 'dgi'],
        mandatoryRule: "Plafond strict de 10% d'avoir SLA et respect impératif du délai légal de paiement 60 jours (Loi 69-21).",
      },
      {
        id: 'doc-sales-sla-2026-chunk-2',
        title: 'RÈGLE 2 : Compensation par Valeur Technique (Architecte Tanger/Casa + Support Platinum)',
        content:
          "Face à une menace de résiliation, privilégier le détachement d'un Architecte Principal sur site (Tanger Med / Casa) pendant 48h et l'upgrade gratuit au Support Platinum 24/7 pendant 6 mois (impact marge -2%).",
        keywords: ['architecte', 'support', 'platinum', 'resiliation', 'tanger', 'casa', 'marge', 'technique'],
        mandatoryRule: 'Proposer un Architecte dédié 48h sur site et le Support Platinum plutôt que détruire la marge.',
      },
      {
        id: 'doc-sales-sla-2026-chunk-3',
        title: 'RÈGLE 3 : Transparence RCA & Redondance Souveraine Maroc (Casa / Rabat)',
        content:
          'Ne jamais minimiser la panne. Engager la livraison du rapport RCA sous 24h avec redondance Active-Active sur deux datacenters souverains au Maroc.',
        keywords: ['rca', 'panne', 'transparence', 'active', 'souverain', 'dgssi', 'confiance', 'dsi'],
        mandatoryRule: 'Assumer la responsabilité technique et présenter le plan RCA Active-Active souverain sous 24h.',
      },
    ],
  },
  {
    id: 'doc-bu-finance-governance',
    organizationId: 'org-atlas-holding',
    title: 'Directives Comité Exécutif CFC : Pilotage Financier BU Maroc & Expansion Afrique (MAD)',
    category: 'finance_rules',
    version: 'v2.1 — Direction Financière Casablanca Finance City',
    createdAt: '2026-10-20T14:30:00Z',
    rawContent: `# RÈGLE 1 : Seuil de Trésorerie Nette & Runway Minimum (4 500 kMAD)
Chaque Business Unit opérant depuis Casablanca Finance City doit maintenir en permanence une trésorerie nette supérieure à 4 500 kMAD (4,5 Millions de Dirhams). Tout passage sous le seuil critique de 3 500 kMAD déclenche une mise sous tutelle immédiate par le Conseil d'Administration.

# RÈGLE 2 : Discipline BFR, Délais de Recouvrement & Rétention Grands Comptes
Une hausse du budget Acquisition Commerciale (Casablanca / Rabat / Abidjan) de plus de 800 kMAD par trimestre doit obligatoirement être accompagnée d'une taskforce Customer Success & Recouvrement pour contenir le Churn sous 7% et sécuriser les encaissements clients dans le cadre de la Loi 69-21.

# RÈGLE 3 : Politique de Pricing Souverain & R&D IA (Pôle Technopolis / Benguérir)
L'introduction d'une offre Enterprise IA & Cloud Souverain (conforme CNDP/DGSSI) permet d'augmenter l'ARPU de +15% auprès des banques et holdings marocaines, à condition d'allouer au moins 700 kMAD en R&D locale pour éviter la dette technique.`,
    chunks: [
      {
        id: 'doc-bu-finance-governance-chunk-1',
        title: 'RÈGLE 1 : Seuil de Trésorerie & Runway Minimum (4 500 kMAD / Critique 3 500 kMAD)',
        content:
          'La BU doit maintenir une trésorerie nette supérieure à 4 500 kMAD. Tout passage sous 3 500 kMAD entraîne un arrêt critique.',
        keywords: ['tresorerie', 'runway', 'cash', 'kmad', 'dirhams', '4500', '3500', 'budget'],
        mandatoryRule: 'Maintenir la trésorerie au-dessus de 3 500 kMAD en toute circonstance.',
      },
      {
        id: 'doc-bu-finance-governance-chunk-2',
        title: "RÈGLE 2 : Équilibre Acquisition Commerciale, BFR & Customer Success",
        content:
          "Une hausse massive du budget commercial sans renforcement Customer Success dégrade le recouvrement, le churn et l'EBITDA.",
        keywords: ['commercial', 'acquisition', 'bfr', 'churn', 'retention', 'customer', 'success'],
        mandatoryRule: 'Équilibrer tout investissement commercial avec la capacité Customer Success & Recouvrement.',
      },
      {
        id: 'doc-bu-finance-governance-chunk-3',
        title: 'RÈGLE 3 : Monétisation Offre Souveraine IA & Investissement R&D Maroc',
        content:
          "Augmenter les prix grâce à l'offre Enterprise Souveraine exige un investissement R&D simultané d'au moins 700 kMAD.",
        keywords: ['pricing', 'prix', 'arpu', 'r&d', 'souverain', 'cndp', 'ia', 'kmad'],
        mandatoryRule: 'Soutenir toute hausse tarifaire Enterprise par un investissement R&D local adéquat (700 kMAD).',
      },
    ],
  },
  {
    id: 'doc-hr-management-charter',
    organizationId: 'org-atlas-holding',
    title: 'Charte DRH Maroc : Rétention des Talents Tech (Casa Nearshore) & Code du Travail',
    category: 'hr_policy',
    version: 'v4.0 — DRH Groupe & Relations Sociales',
    createdAt: '2026-11-01T10:00:00Z',
    rawContent: `# RÈGLE 1 : Écoute Active & Diagnostic Charge face à la Chasse Offshore
Lorsqu'un profil clé (Tech Lead / Ingénieur Principal à Casanearshore ou Technopolis) exprime un risque d'épuisement ou sollicite un départ face à une offre concurrente, le manager doit impérativement traiter la surcharge opérationnelle et les astreintes avant de parler de contre-offre salariale.

# RÈGLE 2 : Arbitrage Priorités & Protection de la Squad (Dépriorisation 20%)
Le manager évalué doit démontrer sa capacité à déprioriser ou reporter au moins 20% du scope non critique en accord avec la Direction Produit pour protéger la vélocité durable de l'équipe et la conformité au Code du Travail marocain sur les heures de repos.

# RÈGLE 3 : Tolérance Zéro sur la Pression Toxique ou Menace sur Prime d'Objectifs
Toute menace implicite sur la prime annuelle (13e mois / bonus de performance) ou sur l'évolution de carrière en réponse à une alerte de surcharge est éliminatoire lors du Gamified Assessment.`,
    chunks: [
      {
        id: 'doc-hr-management-charter-chunk-1',
        title: 'RÈGLE 1 : Écoute Active avant Contre-Offre Financière (Casanearshore)',
        content:
          'Identifier et résoudre la cause racine de la surcharge opérationnelle et des astreintes avant de parler de prime.',
        keywords: ['ecoute', 'surcharge', 'burnout', 'demission', 'prime', 'casanearshore', 'astreinte'],
        mandatoryRule: 'Diagnostiquer la charge opérationnelle et les astreintes avant toute promesse financière.',
      },
      {
        id: 'doc-hr-management-charter-chunk-2',
        title: 'RÈGLE 2 : Arbitrage du Scope & Dépriorisation (20%)',
        content:
          'Le manager doit alléger ou réallouer 20% des tâches non critiques pour sécuriser la livraison et le repos légal.',
        keywords: ['scope', 'priorite', 'arbitrage', 'livraison', 'equipe', 'charge'],
        mandatoryRule: 'Proposer un arbitrage concret de périmètre (20%) et une rotation des astreintes.',
      },
      {
        id: 'doc-hr-management-charter-chunk-3',
        title: 'RÈGLE 3 : Tolérance Zéro sur le Chantage à la Prime ou au 13e Mois',
        content:
          "Interdiction stricte d'utiliser la menace sur le bonus ou la carrière face à une alerte de surcharge.",
        keywords: ['menace', 'bonus', 'prime', 'pression', 'eliminatoire', 'respect'],
        mandatoryRule: 'Ne jamais exercer de chantage au bonus face à une alerte de surcharge.',
      },
    ],
  },
  {
    id: 'doc-cyber-nis2-protocol',
    organizationId: 'org-atlas-holding',
    title: 'Protocole Cybersécurité Maroc : Directive Nationale DGSSI (DNSSI) & Loi 09-08 CNDP',
    category: 'cyber_procedure',
    version: 'v5.2 — RSSI & Conformité CNDP/DGSSI',
    createdAt: '2026-11-10T08:15:00Z',
    rawContent: `# RÈGLE 1 : Isolation Immédiate en Cas d'Exfiltration sur Infrastructure d'Importance Vitale
Dès la détection d'un jeton API compromis ou d'une exfiltration anormale sur un serveur de production au Maroc, isoler le conteneur et révoquer les clés IAM dans les 15 premières minutes, avant même la fin de l'analyse forensique.

# RÈGLE 2 : Notification Officielle maCERT (DGSSI) & CNDP (Loi 09-08)
Alerter immédiatement le RSSI et le DPO pour notifier le maCERT (Direction Générale de la Sécurité des Systèmes d'Information - DGSSI) ainsi que la CNDP (Commission Nationale de contrôle de la protection des Données à caractère Personnel - Loi 09-08) si des données clients (CIN, RIB, téléphones) sont impactées. Silence radio externe sans validation ComEx.

# RÈGLE 3 : Interdiction Absolue de Transfert Illicite ou Paiement de Rançon
Conformément aux directives de la DGSSI et de la Loi 05-20 sur la cybersécurité au Maroc, aucun contact financier ni négociation de rançon n'est autorisé.`,
    chunks: [
      {
        id: 'doc-cyber-nis2-protocol-chunk-1',
        title: 'RÈGLE 1 : Isolation Serveur & Révocation IAM (< 15 min — Loi 05-20)',
        content:
          'Isoler le segment affecté et révoquer les clés IAM compromises immédiatement sans attendre.',
        keywords: ['isolation', 'iam', 'cle', 'token', 'conteneur', 'revocation', '05-20', 'urgence'],
        mandatoryRule: 'Révoquer les accès IAM et isoler le serveur dès le premier tour.',
      },
      {
        id: 'doc-cyber-nis2-protocol-chunk-2',
        title: 'RÈGLE 2 : Notification maCERT (DGSSI) & CNDP (Loi 09-08)',
        content:
          'Saisir immédiatement le RSSI et le DPO pour déclaration réglementaire au maCERT (DGSSI) et à la CNDP (Loi 09-08).',
        keywords: ['dgssi', 'macert', 'cndp', '09-08', 'rssi', 'dpo', 'notification'],
        mandatoryRule: 'Saisir le RSSI et le DPO pour la déclaration réglementaire maCERT (DGSSI) et CNDP.',
      },
    ],
  },
  {
    id: 'doc-loi-69-21-dgi',
    organizationId: 'org-atlas-holding',
    title: 'Texte Officiel Loi n° 69-21 (DGI Maroc) : Délais de Paiement & Sanctions Pécuniaires',
    category: 'moroccan_compliance',
    version: 'B.O. n° 7204 — Direction Générale des Impôts',
    createdAt: '2026-11-12T09:00:00Z',
    rawContent: `# ARTICLE 78-2 : Délai Légal par Défaut (60 Jours) & Plafond Contractuel (120 Jours)
Lorsque le délai de paiement n'est pas convenu entre les parties, il est fixé à 60 jours à compter de la date de facturation. Lorsqu'il est convenu par contrat signé avant prestation, il ne peut en aucun cas dépasser 120 jours. Toute clause ou pression visant à dépasser 120 jours ou à antidater la réception de facture est nulle de plein droit.

# ARTICLE 78-3 : Amende Pécuniaire DGI (Taux Directeur Bank Al-Maghrib + 0,85%/mois)
Tout retard de paiement au-delà du délai légal expose le débiteur à une amende pécuniaire recouvrée par la DGI égale au taux directeur de Bank Al-Maghrib pour le premier mois de retard, majorée de 0,85% par mois ou fraction de mois supplémentaire.

# ARTICLE 78-4 : Déclaration Trimestrielle Obligatoire & Interdiction de Renonciation
Les entreprises réalisant un chiffre d'affaires supérieur à 2 Millions MAD HT ont l'obligation de télédéclarer trimestriellement à la DGI toutes les factures en retard (visées par un commissaire aux comptes ou expert-comptable). Il est formellement interdit au fournisseur de renoncer aux pénalités ou d'accepter un « gel informel » de facturation.`,
    chunks: [
      {
        id: 'doc-loi-69-21-dgi-chunk-1',
        title: 'ARTICLE 78-2 : Délai Légal 60 Jours (Max 120j par accord préalable écrit)',
        content:
          "Le délai de paiement légal par défaut est de 60 jours date de facturation. Il est strictement interdit de différer l'émission de la facture (émise au plus tard le dernier jour du mois de livraison) ou d'accepter un délai hors cadre légal.",
        keywords: ['69-21', '60', '120', 'facturation', 'delai', 'paiement', 'article', '78-2'],
        mandatoryRule: 'Maintenir le délai légal de 60 jours et refuser tout différé de facturation.',
      },
      {
        id: 'doc-loi-69-21-dgi-chunk-2',
        title: 'ARTICLE 78-3 & 78-4 : Amendes DGI (Taux BAM + 0,85%/mois) & Télédéclaration',
        content:
          "Toute facture impayée à l'échéance doit obligatoirement figurer dans la télédéclaration trimestrielle DGI certifiée par le CAC. Aucune remise gracieuse ou dissimulation de retard n'est autorisée.",
        keywords: ['amende', 'dgi', 'bam', '0,85%', 'teledeclaration', 'cac', 'penalite', 'retard'],
        mandatoryRule: 'Refuser toute dissimulation de retard dans la déclaration trimestrielle DGI.',
      },
    ],
  },
  {
    id: 'doc-loi-09-08-cndp',
    organizationId: 'org-atlas-holding',
    title: 'Texte Officiel Loi n° 09-08 (CNDP Maroc) : Protection des Données Personnelles & Transfert',
    category: 'moroccan_compliance',
    version: 'Dahir n° 1-09-15 — Délibérations CNDP',
    createdAt: '2026-11-14T11:00:00Z',
    rawContent: `# ARTICLE 3 & 4 : Consentement Explicite & Finalité Déterminée (CIN / Biométrie / RIB)
Le traitement de données à caractère personnel au Maroc ne peut être effectué qu'avec le consentement indubitable de la personne concernée et pour une finalité déclarée à la CNDP. La collecte systématique de copies de CIN ou de données biométriques sans autorisation préalable de la CNDP est strictement prohibée (principe de proportionnalité).

# ARTICLE 12 & 21 : Déclaration Préalable vs Demande d'Autorisation CNDP
Tout traitement automatisé de données sensibles, d'interconnexion de fichiers ou d'évaluation du crédit exige une Autorisation préalable formelle de la CNDP avant toute mise en production (et non une simple déclaration a posteriori).

# ARTICLE 43 & 44 : Transfert de Données vers l'Étranger & Cloud Souverain
Aucun transfert de données personnelles de résidents marocains vers un serveur ou sous-traitant hébergé hors du Royaume du Maroc n'est autorisé sans notification et validation par la CNDP d'un niveau de protection suffisant (Formulaire T118) ou hébergement sur Cloud Souverain au Maroc.`,
    chunks: [
      {
        id: 'doc-loi-09-08-cndp-chunk-1',
        title: 'ARTICLE 3, 4 & 12 : Proportionnalité (CIN/Biométrie) & Autorisation Préalable CNDP',
        content:
          "Interdiction de mettre en production un traitement de données sensibles, biométriques ou copies de CIN sans récépissé d'autorisation préalable de la CNDP.",
        keywords: ['09-08', 'cndp', 'cin', 'biometrie', 'consentement', 'autorisation', 'proportionnalite'],
        mandatoryRule: "Exiger l'autorisation préalable CNDP avant tout traitement de CIN ou données sensibles.",
      },
      {
        id: 'doc-loi-09-08-cndp-chunk-2',
        title: "ARTICLE 43 & 44 : Interdiction de Transfert Hors Maroc sans Autorisation CNDP",
        content:
          "L'hébergement ou le traitement de données personnelles marocaines sur un cloud étranger exige une demande de transfert international validée par la CNDP ou un rapatriement sur Cloud Souverain au Maroc.",
        keywords: ['transfert', 'etranger', 'cloud', 'souverain', 'article', '43', '44', 'cndp'],
        mandatoryRule: 'Bloquer tout transfert de données clients hors du Maroc sans autorisation formelle CNDP.',
      },
    ],
  },
];

export const INITIAL_SCENARIOS: ScenarioDefinition[] = [
  {
    id: 'scen-flagship-crisis-sales',
    organizationId: 'org-atlas-holding',
    knowledgeDocumentId: 'doc-sales-sla-2026',
    title: 'Crise Grands Comptes : Menace de Résiliation Maghreb Fret & Logistique (Tanger Med)',
    subtitle: 'Négociation sous haute tension après un blocage EDI/PortNet de 4 heures impactant les camions à Tanger Med et Nouaceur.',
    moduleType: 'upskilling',
    difficulty: 'Avancé',
    durationMinutes: 20,
    isFlagship: true,
    objectives: [
      "Désamorcer la colère du DSI sans dépasser le plafond d'avoir SLA de 10% ni violer la Loi 69-21 (60j max)",
      "Préserver une marge brute contrat supérieure ou égale à 35%",
      "Restaurer le score de confiance client au-dessus de 75/100 en 6 échanges maximum",
    ],
    contextBrief:
      "Vous êtes Key Account Director chez Atlas Tech à Casablanca. Maghreb Fret & Logistique (contrat de 1 800 000 MAD/an) a subi une coupure d'interfaçage EDI/PortNet de 4h hier soir. Leur DSI, Driss Chraïbi, exige une visioconférence d'urgence : il menace de résilier le contrat, réclame 30% de remise immédiate et veut bloquer le règlement de vos factures à 120 jours (en violation de la Loi 69-21).",
    openingPersonaMessage:
      "« Écoutez-moi bien : vos excuses par email ne m'intéressent pas ! Hier soir, votre passerelle EDI/PortNet est tombée pendant 4 heures en plein pic d'export. J'avais 38 camions bloqués au port de Tanger Med et à la zone industrielle de Nouaceur ! Mon Président me demande de résilier votre contrat dès aujourd'hui, sauf si vous m'accordez 30% de remise immédiate sur les 1,8 Million de Dirhams annuels et que j'étale nos paiements à 120 jours. Qu'est-ce que vous mettez sur la table maintenant ? »",
    evaluationRubric: {
      criteria: [
        "Respect strict du plafond d'avoir SLA de 10% et refus du délai de paiement 120 jours (Loi 69-21 : 60j max)",
        'Utilisation de la valeur ajoutée technique (Architecte dédié sur site Tanger/Casa + RCA Souverain 24h) plutôt que la destruction de marge',
        'Leadership, courtoisie professionnelle et maîtrise émotionnelle face à un DSI grand compte marocain sous pression',
      ],
      passingScore: 75,
    },
    initialState: {
      schemaVersion: '1.0',
      moduleType: 'upskilling',
      turn: {
        current: 1,
        max: 6,
        timeRemainingSeconds: 1200,
        periodLabel: 'Phase de Négociation 1/6 — Appel d’escalade DSI Tanger Med',
      },
      personaState: {
        name: 'Driss Chraïbi',
        role: 'Directeur des Systèmes d’Information (DSI)',
        company: 'Maghreb Fret & Logistique (Tanger Med / Casablanca)',
        channel: 'Visioconférence d’Urgence — Cellule Exploitation',
        mood: 'HOSTILE',
        trustScore: 25,
        stressLevel: 85,
        hiddenAgenda:
          'Sous forte pression de son PDG suite aux pénalités de retard portuaire. Il sait qu’une migration vers un autre éditeur prendrait 8 mois et qu’un délai de paiement à 120 jours est illégal (Loi 69-21). Il veut surtout un rapport RCA solide pour son Comité de Direction et un architecte sur site.',
      },
      metrics: [
        {
          id: 'client_satisfaction',
          label: 'Confiance & Satisfaction DSI',
          unit: '/100',
          value: 25,
          min: 0,
          max: 100,
          criticalThreshold: 12,
          targetThreshold: 75,
          direction: 'higher_is_better',
        },
        {
          id: 'contract_margin',
          label: 'Marge Brute Contrat',
          unit: '%',
          value: 42,
          min: 0,
          max: 60,
          criticalThreshold: 28,
          targetThreshold: 35,
          direction: 'higher_is_better',
        },
        {
          id: 'arr_retained',
          label: 'ARR Sécurisé (en kMAD)',
          unit: ' kMAD',
          value: 1800,
          min: 0,
          max: 2400,
          criticalThreshold: 1200,
          targetThreshold: 1620,
          direction: 'higher_is_better',
        },
      ],
      tacticalLevers: [
        {
          id: 'lever-rca-24h',
          label: 'Livrer le Rapport RCA 24h + Redondance Active-Active Souveraine (Casa/Rabat)',
          description: 'Garantie de haute disponibilité sur 2 datacenters marocains conformes DGSSI.',
          applied: false,
          impacts: [
            { metricId: 'client_satisfaction', delta: 15 },
          ],
          ragRuleId: 'doc-sales-sla-2026-chunk-3',
        },
        {
          id: 'lever-architect-48h',
          label: 'Détacher un Architecte Principal 48h sur site (Tanger Med) + Support Platinum',
          description: 'Compensation par valeur technique conforme à la Règle 2 du Playbook (-2% Marge, +18 Confiance).',
          applied: false,
          impacts: [
            { metricId: 'client_satisfaction', delta: 18 },
            { metricId: 'contract_margin', delta: -2 },
          ],
          ragRuleId: 'doc-sales-sla-2026-chunk-2',
        },
        {
          id: 'lever-sla-credit-8pct',
          label: 'Accorder un Avoir SLA Réglementaire de 8% (-144 kMAD) & Maintien Paiement 60j (Loi 69-21)',
          description: 'Geste commercial dans la limite autorisée des 10% tout en respectant le délai légal DGI.',
          applied: false,
          impacts: [
            { metricId: 'client_satisfaction', delta: 12 },
            { metricId: 'contract_margin', delta: -4 },
            { metricId: 'arr_retained', delta: -144 },
          ],
          ragRuleId: 'doc-sales-sla-2026-chunk-1',
        },
      ],
      ragComplianceLog: [],
      terminationRules: {
        instantFailureCondition: 'Confiance <= 12/100 ou Marge Brute <= 28%',
        instantSuccessCondition: 'Confiance >= 75/100 avec Marge >= 35% et ARR >= 1620 kMAD',
      },
    },
  },
  {
    id: 'scen-flagship-business-game',
    organizationId: 'org-atlas-holding',
    knowledgeDocumentId: 'doc-bu-finance-governance',
    title: 'Business Game Stratégique : Pilotage BU FinTech Maroc & Expansion Afrique (4 Trimestres)',
    subtitle: 'Arbitrez vos budgets R&D (Technopolis), Acquisition CFC et Trésorerie (en kMAD) face au Board et aux chocs de marché.',
    moduleType: 'business_game',
    difficulty: 'Expert',
    durationMinutes: 30,
    isFlagship: true,
    objectives: [
      'Franchir le cap des 24 000 kMAD (24 Millions DH) d’ARR d’ici la fin du Trimestre Q4',
      'Maintenir impérativement la Trésorerie Nette au-dessus du seuil critique de 3 500 kMAD (Règle RAG #1)',
      'Abaisser le Churn Annuel sous la barre des 7% tout en visant 16% de marge EBITDA',
    ],
    contextBrief:
      "Vous êtes nommé Directeur Général de la Business Unit 'Atlas FinOps' basée à Casablanca Finance City (CFC). Vous disposez de 4 trimestres (Q1 à Q4) pour accélérer la croissance auprès des banques et grands comptes au Maroc et en Afrique de l'Ouest (UEMOA), tout en prouvant la solidité de votre trésorerie au Président du Conseil d'Administration, Moulay Ahmed Kettani.",
    openingPersonaMessage:
      "« Bienvenue au Conseil d'Administration d'ouverture du Trimestre Q1 à Casablanca Finance City. Notre BU affiche actuellement 18 000 kMAD d'ARR (18 Millions de Dirhams), une trésorerie de 6 800 kMAD et un taux de churn préoccupant de 11%. Un éditeur étranger vient d'entrer sur le marché casablancais avec des remises agressives, tandis que plusieurs grands comptes exigent un hébergement Cloud Souverain certifié CNDP/DGSSI. Quelle est votre allocation budgétaire pour ce Q1 ? »",
    evaluationRubric: {
      criteria: [
        'Respect du seuil de sécurité de 4 500 kMAD de trésorerie nette et maîtrise du BFR',
        'Cohérence entre investissement R&D Cloud Souverain (700 kMAD), hausse de pricing Enterprise et rétention Customer Success',
        'Capacité à défendre des arbitrages financiers rigoureux devant un Conseil d’Administration marocain',
      ],
      passingScore: 78,
    },
    initialState: {
      schemaVersion: '1.0',
      moduleType: 'business_game',
      turn: {
        current: 1,
        max: 4,
        timeRemainingSeconds: 1800,
        periodLabel: 'Trimestre Q1 / Q4 — Conseil d’Administration CFC',
      },
      personaState: {
        name: 'Moulay Ahmed Kettani',
        role: 'Président du Conseil d’Administration & Fonds d’Investissement',
        company: 'Atlas Holding Casablanca Finance City',
        channel: 'Salle du Conseil CFC — Revue Trimestrielle',
        mood: 'SKEPTICAL',
        trustScore: 45,
        stressLevel: 60,
        hiddenAgenda:
          'Exige une discipline stricte sur la trésorerie en Dirhams et le recouvrement client (Loi 69-21). Soutiendra l’expansion Afrique de l’Ouest uniquement si le socle R&D souverain et le churn au Maroc sont maîtrisés.',
      },
      metrics: [
        {
          id: 'bu_treasury',
          label: 'Trésorerie Nette BU',
          unit: ' kMAD',
          value: 6800,
          min: 0,
          max: 18000,
          criticalThreshold: 3500,
          targetThreshold: 6000,
          direction: 'higher_is_better',
        },
        {
          id: 'bu_arr',
          label: 'ARR Récurrent Annuel',
          unit: ' kMAD',
          value: 18000,
          min: 8000,
          max: 40000,
          criticalThreshold: 13000,
          targetThreshold: 24000,
          direction: 'higher_is_better',
        },
        {
          id: 'annual_churn',
          label: 'Taux de Churn Annuel',
          unit: '%',
          value: 11,
          min: 2,
          max: 25,
          criticalThreshold: 17,
          targetThreshold: 7,
          direction: 'lower_is_better',
        },
        {
          id: 'ebitda_margin',
          label: 'Marge EBITDA',
          unit: '%',
          value: 8,
          min: -30,
          max: 40,
          criticalThreshold: -12,
          targetThreshold: 16,
          direction: 'higher_is_better',
        },
      ],
      tacticalLevers: [
        {
          id: 'lever-rd-ai-module',
          label: 'Investir 700 kMAD en R&D Module IA & Cloud Souverain (Rabat Technopolis)',
          description: 'Certifie l’offre CNDP/DGSSI, ouvre le secteur bancaire marocain et réduit le churn (-700 kMAD Cash, +2 200 kMAD ARR, -2% Churn).',
          applied: false,
          impacts: [
            { metricId: 'bu_treasury', delta: -700 },
            { metricId: 'bu_arr', delta: 2200 },
            { metricId: 'annual_churn', delta: -2 },
          ],
          ragRuleId: 'doc-bu-finance-governance-chunk-3',
        },
        {
          id: 'lever-cs-taskforce',
          label: 'Déployer la Taskforce Customer Success & Recouvrement Casa/Rabat (-400 kMAD)',
          description: 'Sécurise les grands comptes et accélère les encaissements (-400 kMAD Cash, -2.5% Churn, +1 200 kMAD ARR, +3% EBITDA).',
          applied: false,
          impacts: [
            { metricId: 'bu_treasury', delta: -400 },
            { metricId: 'annual_churn', delta: -2.5 },
            { metricId: 'bu_arr', delta: 1200 },
            { metricId: 'ebitda_margin', delta: 3 },
          ],
          ragRuleId: 'doc-bu-finance-governance-chunk-2',
        },
        {
          id: 'lever-pricing-uplift',
          label: 'Lancer l’Offre Enterprise Souveraine Banques & Holdings (+15% ARPU)',
          description: 'Génère +900 kMAD de cash net, +1 600 kMAD d’ARR et +4% d’EBITDA si la R&D souveraine est activée.',
          applied: false,
          impacts: [
            { metricId: 'bu_treasury', delta: 900 },
            { metricId: 'bu_arr', delta: 1600 },
            { metricId: 'ebitda_margin', delta: 4 },
          ],
          ragRuleId: 'doc-bu-finance-governance-chunk-3',
        },
      ],
      ragComplianceLog: [],
      terminationRules: {
        instantFailureCondition: 'Trésorerie <= 3 500 kMAD ou Churn >= 17%',
        instantSuccessCondition: 'Fin Q4 avec ARR >= 24 000 kMAD, Trésorerie >= 6 000 kMAD et Churn <= 7%',
      },
    },
  },
  {
    id: 'scen-recruitment-assessment',
    organizationId: 'org-atlas-holding',
    knowledgeDocumentId: 'doc-hr-management-charter',
    title: 'Gamified Assessment : Rétention d’une Tech Lead à Casanearshore Chassée en Offshore',
    subtitle: 'Évaluation chronométrée (20 min) des soft skills managériales face à la fuite des talents tech au Maroc.',
    moduleType: 'recruitment',
    difficulty: 'Intermédiaire',
    durationMinutes: 20,
    isFlagship: false,
    objectives: [
      'Diagnostiquer la surcharge opérationnelle et les astreintes sans recourir à la pression toxique',
      'Abaisser l’indice de surcharge de Zineb sous les 35% en 5 séquences',
      'Rétablir son engagement au-dessus de 78/100 tout en sécurisant la mise en production',
    ],
    contextBrief:
      "Mise en situation de recrutement pour un poste d'Engineering Manager à Casanearshore (Casablanca). Zineb Bennani, Tech Lead principale de la Squad Monétique, vous demande un entretien confidentiel à 3 semaines d'un go-live bancaire critique. Épuisée par les astreintes nocturnes, elle vient de recevoir une offre en full-remote d'un cabinet européen.",
    openingPersonaMessage:
      "« Merci de me recevoir. Je préfère être transparente avec toi : je suis au bord de l'épuisement. Depuis le départ des deux développeurs seniors le mois dernier, j'assure toutes les astreintes de nuit en plus de l'intégration monétique CMI. Un chasseur de têtes m'a proposé hier un contrat offshore avec des horaires normaux. Je ne vois pas comment tenir le go-live du 15 sans y laisser ma santé. »",
    evaluationRubric: {
      criteria: [
        'Écoute empathique et traitement immédiat des astreintes nocturnes (Règle RH Maroc #1)',
        'Arbitrage concret de dépriorisation de 20% du scope non critique (Règle RH Maroc #2)',
        'Respect absolu du collaborateur sans menace sur la prime annuelle ou le 13e mois (Règle RH Maroc #3)',
      ],
      passingScore: 75,
    },
    initialState: {
      schemaVersion: '1.0',
      moduleType: 'recruitment',
      turn: {
        current: 1,
        max: 5,
        timeRemainingSeconds: 1200,
        periodLabel: 'Séquence d’Évaluation 1/5 — Entretien 1-to-1 Casanearshore',
      },
      personaState: {
        name: 'Zineb Bennani',
        role: 'Principal Tech Lead — Squad Monétique & Core Banking',
        company: 'Atlas Engineering (Casanearshore)',
        channel: 'Bureau Confidentiel — Site Casanearshore Shore 4',
        mood: 'SKEPTICAL',
        trustScore: 35,
        stressLevel: 90,
        hiddenAgenda:
          'Très attachée à son équipe à Casablanca, elle ne souhaite pas réellement quitter le Maroc ou son projet, mais exige une décision immédiate sur la rotation des astreintes et le gel des fonctionnalités secondaires.',
      },
      metrics: [
        {
          id: 'retention_confidence',
          label: 'Engagement & Volonté de Rester',
          unit: '/100',
          value: 30,
          min: 0,
          max: 100,
          criticalThreshold: 15,
          targetThreshold: 78,
          direction: 'higher_is_better',
        },
        {
          id: 'burnout_risk',
          label: 'Indice de Surcharge & Stress',
          unit: '%',
          value: 85,
          min: 0,
          max: 100,
          criticalThreshold: 95,
          targetThreshold: 35,
          direction: 'lower_is_better',
        },
        {
          id: 'roadmap_viability',
          label: 'Soutenabilité Go-Live Bancaire',
          unit: '/100',
          value: 50,
          min: 0,
          max: 100,
          criticalThreshold: 25,
          targetThreshold: 75,
          direction: 'higher_is_better',
        },
      ],
      tacticalLevers: [
        {
          id: 'lever-descope-20pct',
          label: 'Geler 20% des fonctionnalités secondaires du Go-Live du 15',
          description: 'Arbitrage conforme à la Règle RH #2 (-25% Surcharge, +20 Soutenabilité, +18 Engagement).',
          applied: false,
          impacts: [
            { metricId: 'burnout_risk', delta: -25 },
            { metricId: 'roadmap_viability', delta: 20 },
            { metricId: 'retention_confidence', delta: 18 },
          ],
          ragRuleId: 'doc-hr-management-charter-chunk-2',
        },
        {
          id: 'lever-oncall-rotation',
          label: 'Transférer l’astreinte nuit sur la Squad Plateforme Rabat Technopolis',
          description: 'Supprime la surcharge nocturne conformément au repos légal (-20% Surcharge, +15 Engagement).',
          applied: false,
          impacts: [
            { metricId: 'burnout_risk', delta: -20 },
            { metricId: 'retention_confidence', delta: 15 },
          ],
          ragRuleId: 'doc-hr-management-charter-chunk-1',
        },
      ],
      ragComplianceLog: [],
      terminationRules: {
        instantFailureCondition: 'Engagement <= 15/100 ou Surcharge >= 95%',
        instantSuccessCondition: 'Engagement >= 78/100 et Surcharge <= 35%',
      },
    },
  },
  {
    id: 'scen-onboarding-cyber-nis2',
    organizationId: 'org-atlas-holding',
    knowledgeDocumentId: 'doc-cyber-nis2-protocol',
    title: 'Onboarding & Conformité : Incident Cyber DGSSI (maCERT) & Loi 09-08 CNDP',
    subtitle: 'Parcours immersif basé sur la réglementation marocaine (Loi 05-20 & CNDP) face à une fuite de données CIN/RIB.',
    moduleType: 'onboarding',
    difficulty: 'Intermédiaire',
    durationMinutes: 15,
    isFlagship: false,
    objectives: [
      'Appliquer la Règle #1 du protocole RSSI : isolation du serveur Casablanca et révocation IAM immédiate',
      'Réduire la surface d’exfiltration active sous 15%',
      'Saisir officiellement le maCERT (DGSSI) et la CNDP (Loi 09-08) sans fuite externe',
    ],
    contextBrief:
      "Dans le cadre de votre onboarding SecOps & Conformité au Maroc, l'alerte SIEM #904 se déclenche au SOC de Casablanca : une clé API de service exfiltre des archives contenant des copies de CIN et de RIB clients. Le Responsable Exploitation, Mehdi Alaoui, hésite à isoler le serveur pour ne pas interrompre les agences.",
    openingPersonaMessage:
      "« Alerte critique sur le cluster Casa-DC1 ! On observe une extraction massive de fichiers clients (CIN et RIB) via un token IAM compromis. Si on isole le conteneur maintenant pour révoquer les clés, le portail des agences de Casablanca et Marrakech sera coupé pendant 20 minutes. Est-ce qu'on attend d'en savoir plus ou tu ordonnes l'isolation immédiate et l'ouverture de la procédure DGSSI / CNDP ? »",
    evaluationRubric: {
      criteria: [
        'Isolation immédiate du serveur Casa-DC1 et révocation IAM en moins de 15 minutes (Loi 05-20 / Règle #1)',
        'Déclaration réglementaire au maCERT (DGSSI) et à la CNDP au titre de la Loi 09-08 (Règle #2)',
        'Fermeté face à la pression opérationnelle pour stopper l’exfiltration de données personnelles marocaines',
      ],
      passingScore: 80,
    },
    initialState: {
      schemaVersion: '1.0',
      moduleType: 'onboarding',
      turn: {
        current: 1,
        max: 5,
        timeRemainingSeconds: 900,
        periodLabel: 'Étape Procédurale 1/5 — T+00m Détection SOC Casablanca',
      },
      personaState: {
        name: 'Mehdi Alaoui',
        role: 'Responsable Exploitation Cloud — Datacenter Casablanca',
        company: 'Atlas SecOps Center',
        channel: 'War Room Sécurité — Pont Audio SOC Casa',
        mood: 'NEUTRAL',
        trustScore: 50,
        stressLevel: 75,
        hiddenAgenda:
          'Craint de se faire reprocher une coupure de service par les directeurs d’agence, mais appliquera immédiatement la coupure si vous invoquez l’obligation légale DGSSI (Loi 05-20) et CNDP (Loi 09-08).',
      },
      metrics: [
        {
          id: 'nis2_compliance',
          label: 'Conformité DGSSI (Loi 05-20) & CNDP (09-08)',
          unit: '/100',
          value: 45,
          min: 0,
          max: 100,
          criticalThreshold: 20,
          targetThreshold: 85,
          direction: 'higher_is_better',
        },
        {
          id: 'data_exposure_risk',
          label: 'Surface d’Exfiltration Active (CIN/RIB)',
          unit: '%',
          value: 55,
          min: 0,
          max: 100,
          criticalThreshold: 85,
          targetThreshold: 15,
          direction: 'lower_is_better',
        },
      ],
      tacticalLevers: [
        {
          id: 'lever-isolate-revoke',
          label: 'Isoler le Conteneur Casa-DC1 & Révoquer les Tokens IAM',
          description: 'Application stricte de la Règle #1 de la directive DGSSI (-35% Exfiltration, +25 Conformité).',
          applied: false,
          impacts: [
            { metricId: 'data_exposure_risk', delta: -35 },
            { metricId: 'nis2_compliance', delta: 25 },
          ],
          ragRuleId: 'doc-cyber-nis2-protocol-chunk-1',
        },
        {
          id: 'lever-notify-dpo-ciso',
          label: 'Notifier le RSSI/DPO pour Déclaration maCERT (DGSSI) & CNDP (Loi 09-08)',
          description: 'Active la conformité légale marocaine sur les données personnelles (+20 Conformité).',
          applied: false,
          impacts: [
            { metricId: 'nis2_compliance', delta: 20 },
          ],
          ragRuleId: 'doc-cyber-nis2-protocol-chunk-2',
        },
      ],
      ragComplianceLog: [],
      terminationRules: {
        instantFailureCondition: 'Surface d’Exfiltration >= 85% ou Conformité <= 20/100',
        instantSuccessCondition: 'Conformité DGSSI/CNDP >= 85/100 et Exfiltration <= 15%',
      },
    },
  },
  {
    id: 'scen-compliance-loi-69-21',
    organizationId: 'org-atlas-holding',
    knowledgeDocumentId: 'doc-loi-69-21-dgi',
    title: 'Conformité Loi 69-21 (DGI) : Audit Délais de Paiement & Télédéclaration Trimestrielle',
    subtitle: 'Résistez à la pression d’un grand donneur d’ordres casablancais exigeant de différer la facturation et d’omettre un retard de 3,2 Millions MAD à la DGI.',
    moduleType: 'upskilling',
    difficulty: 'Avancé',
    durationMinutes: 20,
    isFlagship: true,
    objectives: [
      'Refuser catégoriquement toute omission dans la télédéclaration trimestrielle DGI (Article 78-4 Loi 69-21)',
      'Maintenir la conformité fiscale DGI au-dessus de 85/100 pour éviter les sanctions du Commissaire aux Comptes',
      'Sécuriser le recouvrement d’au moins 2 800 kMAD sans rompre la relation commerciale',
    ],
    contextBrief:
      "Vous êtes Directeur Administratif & Financier (DAF) / Key Account Director à Casablanca. Votre client historique, Somagec & BTP Maroc, affiche 3 200 kMAD de factures échues au-delà des 60 jours légaux. À 48h de la clôture trimestrielle DGI, leur Directeur des Achats, Rachid Benjelloun, vous appelle pour exiger un 'arrangement à l'amiable' : ne pas déclarer ces factures en retard à la DGI et antidater un avoir pour repartir sur 120 jours.",
    openingPersonaMessage:
      "« Écoutez, on travaille ensemble depuis 6 ans à Casablanca. Si vous déclarez nos 3,2 Millions de Dirhams de factures échues sur la plateforme SIMPL de la DGI vendredi, votre déclaration va déclencher automatiquement l'amende de Bank Al-Maghrib + 0,85% par mois chez nous ! Je vous demande un geste commercial simple : annulez la facture d'octobre par un avoir fictif et réémettez-la aujourd'hui avec un délai de 120 jours. Si vous nous déclarez à la DGI, vous êtes rayés de notre panel fournisseurs dès lundi ! »",
    evaluationRubric: {
      criteria: [
        'Refus absolu d’émettre un avoir fictif ou d’omettre la facture dans la déclaration DGI visée par le CAC (Art. 78-4)',
        'Rappel pédagogique du caractère d’ordre public de la Loi 69-21 et du taux d’amende DGI (Taux BAM + 0,85%/mois)',
        'Proposition d’un règlement immédiat avant la clôture trimestrielle ou d’un avenant légal pour les commandes futures uniquement',
      ],
      passingScore: 78,
    },
    initialState: {
      schemaVersion: '1.0',
      moduleType: 'upskilling',
      turn: {
        current: 1,
        max: 5,
        timeRemainingSeconds: 1200,
        periodLabel: 'Séquence Conformité 1/5 — Clôture Trimestrielle DGI (H-48)',
      },
      personaState: {
        name: 'Rachid Benjelloun',
        role: 'Directeur des Achats & Approvisionnements',
        company: 'Groupe BTP & Infrastructures Casablanca',
        channel: 'Appel Confidentiel — Direction Achats / DAF',
        mood: 'HOSTILE',
        trustScore: 30,
        stressLevel: 85,
        hiddenAgenda:
          'Son propre Directeur Général lui reproche de ne pas avoir payé à 60 jours. Il tente un coup de bluff pour éviter l’amende DGI, mais il sait que votre Commissaire aux Comptes refusera de certifier une fausse déclaration.',
      },
      metrics: [
        {
          id: 'dgi_compliance_score',
          label: 'Conformité Fiscale Loi 69-21 (DGI / CAC)',
          unit: '/100',
          value: 60,
          min: 0,
          max: 100,
          criticalThreshold: 35,
          targetThreshold: 85,
          direction: 'higher_is_better',
        },
        {
          id: 'cash_recovered_kmad',
          label: 'Encaissement Sécurisé avant Clôture',
          unit: ' kMAD',
          value: 1600,
          min: 0,
          max: 3200,
          criticalThreshold: 900,
          targetThreshold: 2800,
          direction: 'higher_is_better',
        },
        {
          id: 'client_relationship',
          label: 'Préservation Relation Commerciale',
          unit: '/100',
          value: 40,
          min: 0,
          max: 100,
          criticalThreshold: 15,
          targetThreshold: 70,
          direction: 'higher_is_better',
        },
      ],
      tacticalLevers: [
        {
          id: 'lever-cac-attestation',
          label: 'Opposer le Visa Obligatoire du Commissaire aux Comptes (Art. 78-4)',
          description: 'Démontre l’impossibilité légale d’omettre la facture sur SIMPL-DGI (+20 Conformité DGI, +10 Relation).',
          applied: false,
          impacts: [
            { metricId: 'dgi_compliance_score', delta: 20 },
            { metricId: 'client_relationship', delta: 10 },
          ],
          ragRuleId: 'doc-loi-69-21-dgi-chunk-2',
        },
        {
          id: 'lever-instant-wire-settlement',
          label: 'Proposer un Virement Irrévocable Sous 24h avant Télédéclaration Trimestrielle',
          description: 'Éteint légalement le retard avant l’arrêté trimestriel DGI (+900 kMAD Encaissés, +15 Relation, +10 Conformité).',
          applied: false,
          impacts: [
            { metricId: 'cash_recovered_kmad', delta: 900 },
            { metricId: 'client_relationship', delta: 15 },
            { metricId: 'dgi_compliance_score', delta: 10 },
          ],
          ragRuleId: 'doc-loi-69-21-dgi-chunk-1',
        },
      ],
      ragComplianceLog: [],
      terminationRules: {
        instantFailureCondition: 'Conformité DGI <= 35/100 ou Relation <= 15/100',
        instantSuccessCondition: 'Conformité DGI >= 85/100 et Encaissement >= 2 800 kMAD',
      },
    },
  },
  {
    id: 'scen-compliance-loi-09-08-cndp',
    organizationId: 'org-atlas-holding',
    knowledgeDocumentId: 'doc-loi-09-08-cndp',
    title: 'Conformité Loi 09-08 (CNDP) : Audit Données Personnelles (CIN/Biométrie) & Transfert Cloud',
    subtitle: 'Encadrez le lancement d’une application mobile bancaire au Maroc collectant des scans de CIN et hébergée hors du Royaume.',
    moduleType: 'onboarding',
    difficulty: 'Avancé',
    durationMinutes: 20,
    isFlagship: true,
    objectives: [
      'Bloquer tout transfert de données personnelles vers un serveur étranger sans autorisation préalable CNDP (Art. 43-44)',
      'Appliquer le principe de proportionnalité sur la collecte biométrique et CIN (Art. 3-4 Loi 09-08)',
      'Atteindre un score de conformité CNDP supérieur à 85/100 tout en maintenant la vélocité de lancement',
    ],
    contextBrief:
      "Vous êtes DPO / Responsable Conformité d'une FinTech à Rabat. La Directrice Produit & Croissance, Nadia Lahlou, veut lancer dès demain matin une nouvelle fonctionnalité d'ouverture de compte instantanée qui exige le scan biométrique du visage + la copie recto-verso de la CIN des clients marocains, en envoyant ces fichiers sur un serveur cloud hébergé hors du Maroc sans avoir déposé de demande d'autorisation préalable auprès de la CNDP.",
    openingPersonaMessage:
      "« Tout est prêt pour le lancement marketing de demain à 9h ! Notre campagne publicitaire à Casablanca a déjà coûté 600 000 DH. L'application mobile capture la vidéo biométrique et la CIN de l'utilisateur et les envoie directement sur notre bucket cloud en Irlande pour le traitement OCR. Ne me dis pas qu'on doit tout bloquer pour de la paperasse CNDP : on fera une simple déclaration la semaine prochaine après le lancement ! »",
    evaluationRubric: {
      criteria: [
        'Distinction stricte entre Déclaration et Autorisation préalable obligatoire pour la biométrie/CIN (Art. 12 Loi 09-08)',
        'Interdiction du transfert de données hors du Maroc sans notification de transfert international CNDP ou bascule Cloud Souverain (Art. 43-44)',
        'Proposition d’une architecture conforme (hébergement souverain Maroc + consentement explicite opt-in)',
      ],
      passingScore: 80,
    },
    initialState: {
      schemaVersion: '1.0',
      moduleType: 'onboarding',
      turn: {
        current: 1,
        max: 5,
        timeRemainingSeconds: 1200,
        periodLabel: 'Séquence Conformité CNDP 1/5 — Comité Go/No-Go Produit',
      },
      personaState: {
        name: 'Nadia Lahlou',
        role: 'Directrice Produit & Growth Marketing',
        company: 'Atlas Pay FinTech (Rabat / Casablanca)',
        channel: 'Comité Go-Live Produit & Conformité',
        mood: 'SKEPTICAL',
        trustScore: 40,
        stressLevel: 80,
        hiddenAgenda:
          'Subit une pression énorme sur ses objectifs d’acquisition trimestriels, mais redoute par-dessus tout un contrôle de la CNDP ou une sanction pénale et médiatique au Maroc.',
      },
      metrics: [
        {
          id: 'cndp_compliance_index',
          label: 'Conformité Loi 09-08 (CNDP Maroc)',
          unit: '/100',
          value: 35,
          min: 0,
          max: 100,
          criticalThreshold: 20,
          targetThreshold: 85,
          direction: 'higher_is_better',
        },
        {
          id: 'sanction_exposure_risk',
          label: 'Risque de Contrôle & Sanction CNDP',
          unit: '%',
          value: 75,
          min: 0,
          max: 100,
          criticalThreshold: 90,
          targetThreshold: 15,
          direction: 'lower_is_better',
        },
        {
          id: 'launch_readiness',
          label: 'Viabilité Déploiement Produit',
          unit: '/100',
          value: 55,
          min: 0,
          max: 100,
          criticalThreshold: 25,
          targetThreshold: 75,
          direction: 'higher_is_better',
        },
      ],
      tacticalLevers: [
        {
          id: 'lever-sovereign-hosting-ma',
          label: 'Basculer le Bucket OCR sur le Cloud Souverain Maroc (Casa/Rabat)',
          description: 'Supprime le transfert illicite à l’étranger (Art. 43-44) sans retarder la campagne (+30 Conformité CNDP, -35% Risque Sanction).',
          applied: false,
          impacts: [
            { metricId: 'cndp_compliance_index', delta: 30 },
            { metricId: 'sanction_exposure_risk', delta: -35 },
            { metricId: 'launch_readiness', delta: 15 },
          ],
          ragRuleId: 'doc-loi-09-08-cndp-chunk-2',
        },
        {
          id: 'lever-cndp-prior-authorization',
          label: 'Déposer la Demande d’Autorisation Préalable CNDP & Activer le Consentement Explicite',
          description: 'Mise en conformité Art. 3, 4 et 12 sur les données CIN/Biométrie (+25 Conformité CNDP, -25% Risque Sanction).',
          applied: false,
          impacts: [
            { metricId: 'cndp_compliance_index', delta: 25 },
            { metricId: 'sanction_exposure_risk', delta: -25 },
          ],
          ragRuleId: 'doc-loi-09-08-cndp-chunk-1',
        },
      ],
      ragComplianceLog: [],
      terminationRules: {
        instantFailureCondition: 'Risque Sanction CNDP >= 90% ou Conformité <= 20/100',
        instantSuccessCondition: 'Conformité CNDP >= 85/100 et Risque Sanction <= 15%',
      },
    },
  },
];

// Sample Evaluation Report for Demo & Immediate Hub Inspection
export const SAMPLE_EVALUATION_REPORT: EvaluationReport = {
  generatedAt: '2026-11-22T20:15:00Z',
  modelUsed: 'gemini-2.5-flash (Agent Évaluateur Certifié)',
  overallScore: 88,
  verdict: 'CERTIFIED_EXCELLENCE',
  ragComplianceScore: 94,
  executiveSummary:
    "Excellente maîtrise opérationnelle des leviers contractuels et réglementaires. Le candidat a su neutraliser l'agressivité du DSI de Maghreb Fret sans céder au chantage de la remise de 30% ni accepter l'infraction à la Loi 69-21 (délai 120 jours refusé avec fermeté et courtoisie). La compensation par valeur technique (détachement de l'Architecte 48h sur site Tanger Med et Support Platinum 6 mois) a permis de préserver la marge brute à 40,0% tout en restaurant le score de confiance client à 68/100.",
  competencyRadar: [
    {
      axisId: 'rag',
      label: 'Conformité RAG & Lois',
      score: 94,
      benchmark: 80,
      justification:
        "Respect strict du plafond d'avoir 10% et maintien du délai 60j conforme à l'article 78-2 de la Loi 69-21.",
    },
    {
      axisId: 'finance',
      label: 'Préservation Marge & P&L',
      score: 88,
      benchmark: 75,
      justification:
        'Marge brute contrat maintenue à 40% (au-dessus du seuil cible de 35%).',
    },
    {
      axisId: 'posture',
      label: 'Leadership & Négociation',
      score: 85,
      benchmark: 70,
      justification:
        "Désamorçage progressif de l'agressivité du persona adverse sans posture défensive.",
    },
    {
      axisId: 'stress',
      label: 'Sang-froid & Timing',
      score: 82,
      benchmark: 65,
      justification:
        'Prise de décision rapide dans le temps imparti sans précipitation.',
    },
    {
      axisId: 'impact',
      label: 'Impact Décisionnel',
      score: 91,
      benchmark: 75,
      justification:
        'Activation judicieuse du levier technique créateur de valeur sur site.',
    },
  ],
  criticalMoments: [
    {
      turnNumber: 2,
      userQuote:
        "« Nous comprenons l'urgence portuaire à Tanger Med. En revanche, la Loi 69-21 interdit formellement un délai de paiement à 120 jours. Nous maintenons l'échéance légale à 60 jours tout en étudiant un avoir plafonné. »",
      impactType: 'POSITIVE_BREAKTHROUGH',
      kpiImpactSummary: 'Confiance +12 pts, Conformité DGI 100%',
      analysis:
        'Refus net de l’infraction fiscale avec explication légale pédagogique.',
      recommendedAlternative:
        'Parfaite application de la clause 1 du Playbook Vente.',
    },
    {
      turnNumber: 4,
      userQuote:
        '« Plutôt qu’une remise tarifaire destructrice de 30%, nous détachons sous 48h un Architecte Principal sur votre site d’exploitation et vous offrons 6 mois de Support Platinum 24/7. »',
      impactType: 'POSITIVE_BREAKTHROUGH',
      kpiImpactSummary: 'Marge brute -2%, Confiance +18 pts',
      analysis:
        'Arbitrage exemplaire remplaçant une destruction de marge par un levier de valeur technique.',
      recommendedAlternative:
        'Conforme à la Règle 2 du Playbook Grands Comptes.',
    },
    {
      turnNumber: 5,
      userQuote:
        '« Nos équipes d’ingénierie livreront le rapport RCA factuel sous 24h avec le plan de bascule Active-Active sur nos datacenters souverains de Casablanca et Rabat. »',
      impactType: 'POSITIVE_BREAKTHROUGH',
      kpiImpactSummary: 'Confiance +15 pts (Total 68/100)',
      analysis:
        'Engagement transparent et concret rassurant le DSI face à son propre Comité de Direction.',
      recommendedAlternative:
        'Conforme à la directive de souveraineté DGSSI.',
    },
  ],
  actionableTakeaways: [
    'Maintenir ce niveau d’assertivité face aux tentatives de décalage de paiement à 120 jours (Loi 69-21).',
    'Systématiser l’usage du levier technique "Architecte sur site" pour protéger le pricing B2B.',
    'Formaliser l’envoi du rapport RCA certifié dès H+12 pour anticiper le Conseil d’Administration du client.',
  ],
};

export const SAMPLE_EVALUATION_SESSION: SimulationSession = {
  id: 'sim-audit-sample-flagship',
  scenarioId: 'scen-flagship-crisis-sales',
  organizationId: 'org-atlas-holding',
  userId: 'usr-sales-vp',
  status: 'completed',
  currentState: JSON.parse(JSON.stringify(INITIAL_SCENARIOS[0].initialState)),
  turnHistory: [],
  startedAt: '2026-11-22T19:20:00Z',
  completedAt: '2026-11-22T19:45:00Z',
  evaluationReport: SAMPLE_EVALUATION_REPORT,
};

// Second Sample for Recruitment Assessment
export const SAMPLE_RECRUITMENT_REPORT: EvaluationReport = {
  generatedAt: '2026-11-22T18:00:00Z',
  modelUsed: 'gemini-2.5-flash (Agent Évaluateur Certifié)',
  overallScore: 92,
  verdict: 'CERTIFIED_EXCELLENCE',
  ragComplianceScore: 96,
  executiveSummary:
    "Candidat d'un niveau d'assertivité et d'empathie remarquable. Face au risque de départ d'un Tech Lead critique, il a su identifier les facteurs de surcharge cognitive, proposer un aménagement conforme à la charte RH et réaligner la trajectoire produit sans surenchère salariale déstabilisatrice.",
  competencyRadar: [
    {
      axisId: 'rag',
      label: 'Conformité Charte RH',
      score: 96,
      benchmark: 80,
      justification: 'Application rigoureuse de la politique de mobilité et de bien-être au travail.',
    },
    {
      axisId: 'finance',
      label: 'Maîtrise Masse Salariale',
      score: 90,
      benchmark: 75,
      justification: 'Gestion responsable sans prime hors budget.',
    },
    {
      axisId: 'posture',
      label: 'Empathie & Écoute Active',
      score: 94,
      benchmark: 70,
      justification: 'Excellente capacité de désamorçage de la démotivation.',
    },
    {
      axisId: 'stress',
      label: 'Gestion de Crise RH',
      score: 88,
      benchmark: 65,
      justification: 'Régulation émotionnelle et neutralité exemplaires.',
    },
    {
      axisId: 'impact',
      label: 'Rétention des Talents',
      score: 92,
      benchmark: 75,
      justification: 'Solution durable validée par les deux parties.',
    },
  ],
  criticalMoments: [
    {
      turnNumber: 2,
      userQuote: "« Je comprends ton épuisement sur la release. Regardons ensemble comment réorganiser la charge plutôt que de prendre une décision hâtive. »",
      impactType: 'POSITIVE_BREAKTHROUGH',
      kpiImpactSummary: 'Motivation +22 pts, Risque de départ -35%',
      analysis: 'Écoute active créant un espace sécurisant pour le collaborateur.',
      recommendedAlternative: 'Conforme à la démarche QVT.',
    },
  ],
  actionableTakeaways: [
    'Profil hautement recommandé pour des postes de management technique ou direction de pôle.',
    'Excellente adéquation culturelle et rigueur managériale.',
  ],
};

export const SAMPLE_RECRUITMENT_SESSION: SimulationSession = {
  id: 'sim-audit-sample-recruitment',
  scenarioId: 'scen-recruitment-lead-dev',
  organizationId: 'org-atlas-holding',
  userId: 'usr-hr-director',
  status: 'completed',
  currentState: JSON.parse(JSON.stringify(INITIAL_SCENARIOS[2].initialState)),
  turnHistory: [],
  startedAt: '2026-11-22T17:35:00Z',
  completedAt: '2026-11-22T18:00:00Z',
  evaluationReport: SAMPLE_RECRUITMENT_REPORT,
};

// Global server-side persistence store across Next.js route invocations
interface MultiTenantStore {
  organizations: OrganizationTenant[];
  users: UserProfile[];
  knowledgeDocuments: KnowledgeDocument[];
  scenarios: ScenarioDefinition[];
  sessions: Record<string, SimulationSession>;
}

declare global {
  var _aegisMultiTenantStoreMoroccanV2: MultiTenantStore | undefined;
}

export function getStore(): MultiTenantStore {
  if (!global._aegisMultiTenantStoreMoroccanV2) {
    global._aegisMultiTenantStoreMoroccanV2 = {
      organizations: [...INITIAL_ORGANIZATIONS],
      users: [...INITIAL_USERS],
      knowledgeDocuments: [...INITIAL_KNOWLEDGE_DOCUMENTS],
      scenarios: [...INITIAL_SCENARIOS],
      sessions: {
        'sim-audit-sample-flagship': SAMPLE_EVALUATION_SESSION,
        'sim-audit-sample-recruitment': SAMPLE_RECRUITMENT_SESSION,
      },
    };
  }
  return global._aegisMultiTenantStoreMoroccanV2;
}

