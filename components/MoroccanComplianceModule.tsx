'use client';

import React, { useState } from 'react';
import {
  KnowledgeDocument,
  ModuleType,
  ScenarioDefinition,
} from '@/lib/types';
import {
  Scale,
  Upload,
  FileText,
  Sparkles,
  CheckCircle2,
  Loader2,
  Play,
  Eye,
  Code2,
  Sliders,
  BookOpen,
} from 'lucide-react';

export type MoroccanRegulatoryCategory = 'LOI_69_21' | 'LOI_09_08' | 'DGSSI';

interface MoroccanComplianceModuleProps {
  organizationId: string;
  knowledgeDocuments: KnowledgeDocument[];
  scenarios: ScenarioDefinition[];
  onDocumentCreated: (doc: KnowledgeDocument) => void;
  onScenarioGenerated: (scenario: ScenarioDefinition, autoStart: boolean) => void;
  onLaunchScenario: (scenario: ScenarioDefinition) => void;
}

const REGULATORY_SPECS: Record<
  MoroccanRegulatoryCategory,
  {
    code: MoroccanRegulatoryCategory;
    shortLabel: string;
    fullTitle: string;
    authority: string;
    defaultDocId: string;
    defaultScenarioId: string;
    recommendedModule: ModuleType;
    sampleMarkdown: string;
    defaultAiBrief: string;
  }
> = {
  LOI_69_21: {
    code: 'LOI_69_21',
    shortLabel: 'Loi 69-21 (Délais de Paiement)',
    fullTitle: 'Loi n° 69-21 modifiant le Code de Commerce — Délais de Paiement & Amendes DGI',
    authority: 'Direction Générale des Impôts (DGI) & Bank Al-Maghrib',
    defaultDocId: 'doc-loi-69-21-dgi',
    defaultScenarioId: 'scen-compliance-loi-69-21',
    recommendedModule: 'upskilling',
    defaultAiBrief:
      "Un grand compte BTP à Casablanca exige un avoir fictif pour décaler à 120 jours une facture échue de 3,2 Millions MAD à 48h de la télédéclaration trimestrielle SIMPL-DGI.",
    sampleMarkdown: `# ARTICLE 78-2 : Délai Légal par Défaut (60 Jours) & Plafond Contractuel (120 Jours)
Lorsque le délai de paiement n'est pas convenu entre les parties, il est fixé à 60 jours à compter de la date de facturation. Lorsqu'il est convenu par contrat signé avant prestation, il ne peut en aucun cas dépasser 120 jours. La facture doit obligatoirement être émise au plus tard le dernier jour du mois de la livraison.

# ARTICLE 78-3 : Amende Pécuniaire DGI (Taux Directeur Bank Al-Maghrib + 0,85%/mois)
Tout retard de paiement au-delà du délai légal expose le débiteur à une amende pécuniaire recouvrée par la DGI égale au taux directeur de Bank Al-Maghrib pour le premier mois de retard, majorée de 0,85% par mois ou fraction de mois supplémentaire.

# ARTICLE 78-4 : Télédéclaration Trimestrielle SIMPL-DGI & Visa CAC
Les entreprises réalisant un chiffre d'affaires supérieur à 2 Millions MAD HT ont l'obligation de télédéclarer trimestriellement à la DGI toutes les factures en retard (état visé par le Commissaire aux Comptes). Il est formellement interdit de renoncer aux pénalités ou d'accepter un avoir fictif.`,
  },
  LOI_09_08: {
    code: 'LOI_09_08',
    shortLabel: 'Loi 09-08 (CNDP Données)',
    fullTitle: 'Loi n° 09-08 relative à la protection des personnes physiques à l’égard du traitement des données à caractère personnel',
    authority: 'CNDP (Commission Nationale de contrôle de la protection des Données à caractère Personnel)',
    defaultDocId: 'doc-loi-09-08-cndp',
    defaultScenarioId: 'scen-compliance-loi-09-08-cndp',
    recommendedModule: 'onboarding',
    defaultAiBrief:
      "L'équipe Produit d'une FinTech à Rabat souhaite lancer demain une collecte de copies de CIN et de biométrie faciale hébergée sur un serveur cloud hors du Maroc sans autorisation préalable de la CNDP.",
    sampleMarkdown: `# ARTICLE 3 & 4 : Consentement Explicite & Principe de Proportionnalité (CIN / Biométrie)
Le traitement de données à caractère personnel au Maroc ne peut être effectué qu'avec le consentement indubitable de la personne concernée et pour une finalité légitime déclarée à la CNDP. La collecte systématique de copies de CIN ou de données biométriques sans autorisation préalable de la CNDP est strictement prohibée.

# ARTICLE 12 & 21 : Régime d'Autorisation Préalable CNDP vs Déclaration
Tout traitement automatisé portant sur des données sensibles, des données biométriques, le numéro de CIN ou l'interconnexion de fichiers exige une Autorisation préalable formelle de la CNDP avant toute mise en production.

# ARTICLE 43 & 44 : Transfert de Données vers l'Étranger & Hébergement Cloud Souverain
Aucun transfert de données personnelles de résidents marocains vers un serveur ou sous-traitant hébergé hors du Royaume du Maroc n'est autorisé sans validation préalable par la CNDP (Formulaire T118) ou hébergement sur Cloud Souverain au Maroc.`,
  },
  DGSSI: {
    code: 'DGSSI',
    shortLabel: 'DGSSI (Loi 05-20 & DNSSI)',
    fullTitle: 'Loi n° 05-20 relative à la Cybersécurité & Directive Nationale de la Sécurité des SI (DNSSI)',
    authority: 'DGSSI (Direction Générale de la Sécurité des Systèmes d’Information — maCERT)',
    defaultDocId: 'doc-cyber-nis2-protocol',
    defaultScenarioId: 'scen-onboarding-cyber-nis2',
    recommendedModule: 'onboarding',
    defaultAiBrief:
      "Un serveur d'une Infrastructure d'Importance Vitale (IIV) à Casablanca subit une exfiltration via un token IAM compromis. Le responsable d'exploitation hésite à couper le serveur et à déclarer l'incident au maCERT (DGSSI).",
    sampleMarkdown: `# ARTICLE 10 & 12 (Loi 05-20) : Hébergement National des Données Sensibles & IIV
Les entités et Infrastructures d'Importance Vitale (IIV) au Maroc ont l'obligation d'héberger leurs données et systèmes d'information sensibles exclusivement sur le territoire national marocain et de faire auditer leur sécurité par des prestataires qualifiés par la DGSSI.

# ARTICLE 15 (Loi 05-20) : Notification Immédiate au maCERT (DGSSI)
Tout incident de cybersécurité affectant la confidentialité, l'intégrité ou la continuité d'un système critique doit faire l'objet d'une isolation immédiate (< 15 min) et d'une déclaration obligatoire sans délai au maCERT (DGSSI).`,
  },
};

export default function MoroccanComplianceModule({
  organizationId,
  knowledgeDocuments,
  scenarios,
  onDocumentCreated,
  onScenarioGenerated,
  onLaunchScenario,
}: MoroccanComplianceModuleProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<MoroccanRegulatoryCategory>('LOI_69_21');

  const currentSpec = REGULATORY_SPECS[selectedCategory];

  // Upload & Ingestion state (PDF / Markdown)
  const [uploadTitle, setUploadTitle] = useState<string>(currentSpec.fullTitle);
  const [uploadMarkdown, setUploadMarkdown] = useState<string>(
    currentSpec.sampleMarkdown
  );
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isParsingPdf, setIsParsingPdf] = useState(false);
  const [isIndexingRag, setIsIndexingRag] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // AI Scenario Generation & Preview state
  const [aiBrief, setAiBrief] = useState<string>(currentSpec.defaultAiBrief);
  const [isGeneratingScenario, setIsGeneratingScenario] = useState(false);

  // Preview Inspector state (allows inspecting pre-configured or newly AI-generated templates)
  const defaultPreviewScenario =
    scenarios.find((s) => s.id === currentSpec.defaultScenarioId) ||
    scenarios[0];
  const [previewScenario, setPreviewScenario] = useState<ScenarioDefinition>(
    defaultPreviewScenario
  );
  const [previewTab, setPreviewTab] = useState<
    'overview' | 'metrics_levers' | 'json_contract'
  >('overview');

  const handleSelectCategory = (cat: MoroccanRegulatoryCategory) => {
    setSelectedCategory(cat);
    const spec = REGULATORY_SPECS[cat];
    setUploadTitle(spec.fullTitle);
    setUploadMarkdown(spec.sampleMarkdown);
    setAiBrief(spec.defaultAiBrief);
    setUploadedFileName(null);
    setStatusMessage(null);
    setErrorMessage(null);

    const matchingScenario = scenarios.find(
      (s) => s.id === spec.defaultScenarioId
    );
    if (matchingScenario) {
      setPreviewScenario(matchingScenario);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setErrorMessage(null);
    setStatusMessage(null);

    const cleanName = file.name.replace(/\.(pdf|md|markdown|txt)$/i, '');
    setUploadTitle(`${currentSpec.shortLabel} — ${cleanName}`);

    const isPdf =
      file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

    if (isPdf) {
      setIsParsingPdf(true);
      try {
        const arrayBuffer = await file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64Data = btoa(binary);

        const res = await fetch('/api/knowledge/parse-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            base64Data,
            fileName: file.name,
            regulatoryCategory: currentSpec.shortLabel,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(
            data.error || 'Impossible d’extraire les articles du PDF.'
          );
        }
        setUploadMarkdown(data.extractedMarkdown);
        setStatusMessage(
          `PDF "${file.name}" analysé et structuré en articles Markdown via Gemini.`
        );
      } catch (err: unknown) {
        setErrorMessage(
          err instanceof Error
            ? err.message
            : 'Erreur lors de la lecture du fichier PDF.'
        );
      } finally {
        setIsParsingPdf(false);
      }
    } else {
      // Markdown / Text file
      const text = await file.text();
      setUploadMarkdown(text);
      setStatusMessage(`Fichier Markdown "${file.name}" chargé avec succès.`);
    }
  };

  const handleIndexRegulatoryDocument = async () => {
    if (!uploadTitle.trim() || !uploadMarkdown.trim()) return;
    setIsIndexingRag(true);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const response = await fetch('/api/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId,
          title: `[${currentSpec.code}] ${uploadTitle.trim()}`,
          category: 'moroccan_compliance',
          rawContent: uploadMarkdown.trim(),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Échec de l’indexation RAG.');
      }

      onDocumentCreated(data.document);
      setStatusMessage(
        `Texte réglementaire indexé en ${data.document.chunks.length} articles RAG prêts pour l'audit.`
      );
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Erreur lors de l’indexation RAG.'
      );
    } finally {
      setIsIndexingRag(false);
    }
  };

  const handleGenerateAndPreviewScenario = async () => {
    if (!aiBrief.trim()) return;
    setIsGeneratingScenario(true);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      // Find the most relevant document for the selected regulatory category
      const matchingDoc =
        knowledgeDocuments.find((d) =>
          d.title.includes(currentSpec.code)
        ) ||
        knowledgeDocuments.find((d) => d.id === currentSpec.defaultDocId) ||
        knowledgeDocuments[0];

      const response = await fetch('/api/studio/generate-scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId,
          knowledgeDocumentId: matchingDoc.id,
          moduleType: currentSpec.recommendedModule,
          customBrief: `[Réglementation ${currentSpec.fullTitle}] ${aiBrief}`,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.error || 'Erreur lors de la génération du template conforme.'
        );
      }

      onScenarioGenerated(data.scenario, false);
      setPreviewScenario(data.scenario);
      setStatusMessage(
        'Nouveau template de scénario conforme généré par Gemini et chargé dans la pré-visualisation.'
      );
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Erreur lors de la génération par Gemini.'
      );
    } finally {
      setIsGeneratingScenario(false);
    }
  };

  // All compliance templates available for preview
  const complianceTemplates = scenarios.filter(
    (s) =>
      s.id === 'scen-compliance-loi-69-21' ||
      s.id === 'scen-compliance-loi-09-08-cndp' ||
      s.id === 'scen-onboarding-cyber-nis2' ||
      s.knowledgeDocumentId === 'doc-loi-69-21-dgi' ||
      s.knowledgeDocumentId === 'doc-loi-09-08-cndp'
  );

  const previewAttachedDoc = knowledgeDocuments.find(
    (d) => d.id === previewScenario?.knowledgeDocumentId
  );

  return (
    <section className="p-6 bg-light-surface-container-lowest border border-light-outline-variant rounded-xl shadow-xs space-y-6">
      {/* Header & Regulatory Category Selector (Loi 69-21, Loi 09-08, DGSSI) */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-light-outline-variant">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-light-primary">
            <Scale className="w-4 h-4 text-light-primary" />
            <span className="tracking-wide">COMPOSANT DÉDIÉ : MODULE « CONFORMITÉ MAROC »</span>
          </div>
          <h2 className="text-xl font-semibold text-light-on-surface font-display">
            Upload Législatif (PDF / Markdown), Sélecteur Réglementaire &
            Pré-visualisation IA
          </h2>
          <p className="text-xs text-light-on-surface-variant">
            Autorité de référence :{' '}
            <span className="text-light-on-surface font-medium">
              {currentSpec.authority}
            </span>
          </p>
        </div>

        {/* 3-Option Regulatory Category Segmented Selector */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-light-surface-container-high border border-light-outline-variant rounded-lg">
          {(
            ['LOI_69_21', 'LOI_09_08', 'DGSSI'] as MoroccanRegulatoryCategory[]
          ).map((catKey) => {
            const spec = REGULATORY_SPECS[catKey];
            const isActive = selectedCategory === catKey;
            return (
              <button
                type="button"
                key={catKey}
                onClick={() => handleSelectCategory(catKey)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-light-primary text-white shadow-xs'
                    : 'text-light-on-surface-variant hover:text-light-on-surface hover:bg-light-surface-container-lowest/60'
                }`}
              >
                {spec.shortLabel}
              </button>
            );
          })}
        </div>
      </div>

      {errorMessage && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800">
          {errorMessage}
        </div>
      )}

      {statusMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Main 2-Column Split inside Moroccan Compliance Module */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN (6 cols): PDF / Markdown Upload & AI Compliance Generator */}
        <div className="lg:col-span-6 space-y-5">
          {/* Step 1: PDF / Markdown Upload Zone */}
          <div className="p-5 bg-light-surface-container-low border border-light-outline-variant rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-light-on-surface font-display">
                1. Interface d’Upload Réglementaire (PDF / Markdown)
              </h3>
              <span className="text-xs font-mono text-light-primary font-semibold">
                Catégorie : {currentSpec.code}
              </span>
            </div>

            {/* File Dropzone / Button */}
            <label className="block p-4 border border-dashed border-light-outline-variant hover:border-light-primary bg-light-surface-container-lowest rounded-xl cursor-pointer transition-colors text-center space-y-1.5 shadow-2xs">
              <div className="flex items-center justify-center gap-2 text-xs font-medium text-light-primary">
                {isParsingPdf ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>
                      Extraction multimodale des articles du PDF via Gemini...
                    </span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>
                      {uploadedFileName
                        ? `Fichier chargé : ${uploadedFileName}`
                        : 'Cliquez pour importer un Bulletin Officiel / Loi (.pdf, .md, .txt)'}
                    </span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-light-on-surface-variant">
                Les fichiers PDF sont automatiquement analysés et structurés en
                articles Markdown par Gemini.
              </p>
              <input
                type="file"
                accept=".pdf,.md,.markdown,.txt,application/pdf,text/markdown,text/plain"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            <div>
              <label className="block text-xs font-medium text-light-on-surface-variant mb-1">
                Intitulé Officiel du Texte Réglementaire
              </label>
              <input
                type="text"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                className="w-full bg-light-surface-container-lowest border border-light-outline-variant rounded-lg px-3 py-2 text-xs text-light-on-surface focus:outline-none focus:ring-1 focus:ring-light-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-light-on-surface-variant mb-1">
                Articles extraits / Markdown structuré pour l’audit RAG
              </label>
              <textarea
                rows={6}
                value={uploadMarkdown}
                onChange={(e) => setUploadMarkdown(e.target.value)}
                className="w-full bg-light-surface-container-lowest border border-light-outline-variant rounded-lg p-3 text-xs font-mono text-light-on-surface focus:outline-none focus:ring-1 focus:ring-light-primary"
              />
            </div>

            <button
              type="button"
              onClick={handleIndexRegulatoryDocument}
              disabled={
                isIndexingRag ||
                isParsingPdf ||
                !uploadTitle.trim() ||
                !uploadMarkdown.trim()
              }
              className="w-full py-2.5 px-4 bg-light-surface-container-highest hover:bg-light-outline-variant disabled:opacity-40 text-light-on-surface text-xs font-medium rounded-lg border border-light-outline-variant transition-colors flex items-center justify-center gap-2"
            >
              {isIndexingRag ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-light-primary" />
                  Indexation RAG en cours...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 text-light-primary" />
                  Indexer ce Texte dans le Référentiel « {currentSpec.shortLabel}{' '}
                  »
                </>
              )}
            </button>
          </div>

          {/* Step 2: AI Generator for Compliant Scenario Templates */}
          <div className="p-5 bg-light-surface-container-low border border-light-outline-variant rounded-xl space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-light-on-surface font-display">
                2. Générer un Nouveau Template Conforme via l’IA
              </h3>
              <Sparkles className="w-4 h-4 text-light-primary" />
            </div>

            <textarea
              rows={3}
              value={aiBrief}
              onChange={(e) => setAiBrief(e.target.value)}
              placeholder="Décrivez le cas de contrôle ou de négociation réglementaire au Maroc..."
              className="w-full bg-light-surface-container-lowest border border-light-outline-variant rounded-lg p-3 text-xs text-light-on-surface focus:outline-none focus:ring-1 focus:ring-light-primary placeholder:text-light-on-surface-variant/50"
            />

            <button
              type="button"
              onClick={handleGenerateAndPreviewScenario}
              disabled={isGeneratingScenario || !aiBrief.trim()}
              className="w-full py-2.5 px-4 bg-light-primary hover:bg-[#1B4396] disabled:opacity-40 text-white text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              {isGeneratingScenario ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  Génération & Chargement dans la Pré-visualisation...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  Générer & Pré-visualiser le Template ({currentSpec.shortLabel})
                </>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN (6 cols): Interactive Scenario Template Previewer */}
        <div className="lg:col-span-6 p-5 bg-light-surface-container-low border border-light-outline-variant rounded-xl space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-light-outline-variant">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-light-primary" />
              <h3 className="text-sm font-semibold text-light-on-surface font-display">
                3. Pré-visualisation des Templates de Scénarios Conformes
              </h3>
            </div>

            {/* Template Selector Dropdown */}
            <select
              value={previewScenario?.id || ''}
              onChange={(e) => {
                const found = scenarios.find((s) => s.id === e.target.value);
                if (found) setPreviewScenario(found);
              }}
              className="bg-light-surface-container-lowest border border-light-outline-variant rounded-lg px-2.5 py-1.5 text-xs text-light-on-surface focus:outline-none focus:ring-1 focus:ring-light-primary max-w-[270px] truncate"
            >
              {complianceTemplates.map((scen) => (
                <option key={scen.id} value={scen.id}>
                  {scen.title}
                </option>
              ))}
            </select>
          </div>

          {previewScenario && (
            <>
              {/* Preview Sub-Tabs */}
              <div className="flex items-center gap-1 p-1 bg-light-surface-container-high border border-light-outline-variant rounded-lg">
                <button
                  type="button"
                  onClick={() => setPreviewTab('overview')}
                  className={`flex-1 py-1.5 px-2.5 text-xs font-medium rounded-md transition-all flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 ${
                    previewTab === 'overview'
                      ? 'bg-light-surface-container-lowest text-light-primary shadow-2xs font-semibold'
                      : 'text-light-on-surface-variant hover:text-light-on-surface'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Brief & Persona IA
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab('metrics_levers')}
                  className={`flex-1 py-1.5 px-2.5 text-xs font-medium rounded-md transition-all flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 ${
                    previewTab === 'metrics_levers'
                      ? 'bg-light-surface-container-lowest text-light-primary shadow-2xs font-semibold'
                      : 'text-light-on-surface-variant hover:text-light-on-surface'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  KPIs & Leviers ({previewScenario.initialState.metrics.length})
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab('json_contract')}
                  className={`flex-1 py-1.5 px-2.5 text-xs font-medium rounded-md transition-all flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 ${
                    previewTab === 'json_contract'
                      ? 'bg-light-surface-container-lowest text-light-primary shadow-2xs font-semibold'
                      : 'text-light-on-surface-variant hover:text-light-on-surface'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  Contrat JSON
                </button>
              </div>

              {/* TAB A: OVERVIEW, PERSONA & OPENING STATEMENT */}
              {previewTab === 'overview' && (
                <div className="space-y-4">
                  <div>
                    <div className="text-xs font-mono font-semibold text-light-primary">
                      {previewAttachedDoc?.title || currentSpec.fullTitle}
                    </div>
                    <h4 className="text-base font-semibold text-light-on-surface font-display mt-1">
                      {previewScenario.title}
                    </h4>
                    <p className="text-xs text-light-on-surface-variant mt-1 leading-relaxed">
                      {previewScenario.subtitle}
                    </p>
                  </div>

                  <div className="p-3.5 bg-light-surface-container-lowest border border-light-outline-variant rounded-lg space-y-2 text-xs shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-light-on-surface-variant">Persona Simulé :</span>
                      <span className="font-semibold text-light-on-surface">
                        {previewScenario.initialState.personaState.name} —{' '}
                        {previewScenario.initialState.personaState.role}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-light-on-surface-variant">Organisation :</span>
                      <span className="text-light-on-surface">
                        {previewScenario.initialState.personaState.company}
                      </span>
                    </div>
                    <div className="flex items-center justify-between font-mono tabular-nums">
                      <span className="text-light-on-surface-variant">Posture Initiale :</span>
                      <span className="text-amber-700 font-medium">
                        {previewScenario.initialState.personaState.mood}{' '}
                        (Confiance{' '}
                        {previewScenario.initialState.personaState.trustScore}
                        /100)
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-xs font-medium text-light-on-surface-variant">
                      Réplique d’Ouverture Générée :
                    </div>
                    <div className="p-3.5 bg-light-surface-container-lowest border border-light-outline-variant rounded-lg text-xs text-light-on-surface italic leading-relaxed shadow-2xs">
                      {previewScenario.openingPersonaMessage}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-xs font-medium text-light-on-surface-variant">
                      Objectifs Réglementaires Audités :
                    </div>
                    <ul className="space-y-1.5">
                      {previewScenario.objectives.map((obj, idx) => (
                        <li
                          key={idx}
                          className="text-xs text-light-on-surface flex items-start gap-2"
                        >
                          <span className="font-mono text-light-primary font-semibold">
                            0{idx + 1}.
                          </span>
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB B: DETERMINISTIC KPIS & TACTICAL LEVERS PREVIEW */}
              {previewTab === 'metrics_levers' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-light-on-surface-variant">
                      Indicateurs Déterministes du Moteur d’État :
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {previewScenario.initialState.metrics.map((m) => (
                        <div
                          key={m.id}
                          className="p-3 bg-light-surface-container-lowest border border-light-outline-variant rounded-lg shadow-2xs"
                        >
                          <div className="text-[11px] text-light-on-surface-variant truncate">
                            {m.label}
                          </div>
                          <div className="mt-1 text-base font-mono font-semibold tabular-nums text-light-on-surface">
                            {m.value}
                            {m.unit}
                          </div>
                          <div className="mt-1 text-[10px] font-mono tabular-nums text-light-on-surface-variant">
                            Critique: {m.criticalThreshold}
                            {m.unit} · Cible: {m.targetThreshold}
                            {m.unit}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-medium text-light-on-surface-variant">
                      Leviers Tactiques de Mise en Conformité :
                    </div>
                    <div className="space-y-2">
                      {previewScenario.initialState.tacticalLevers.map(
                        (lever) => (
                          <div
                            key={lever.id}
                            className="p-3 bg-light-surface-container-lowest border border-light-outline-variant rounded-lg space-y-1 shadow-2xs"
                          >
                            <div className="text-xs font-medium text-light-on-surface">
                              {lever.label}
                            </div>
                            <p className="text-[11px] text-light-on-surface-variant">
                              {lever.description}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB C: FULL JSON STATE CONTRACT PREVIEW */}
              {previewTab === 'json_contract' && (
                <pre className="p-4 bg-light-surface-container-lowest border border-light-outline-variant rounded-lg text-[11px] font-mono text-light-on-surface overflow-x-auto max-h-[340px] overflow-y-auto leading-relaxed shadow-2xs">
                  {JSON.stringify(previewScenario.initialState, null, 2)}
                </pre>
              )}

              {/* Action CTA to Launch the Previewed Scenario */}
              <div className="pt-3 border-t border-light-outline-variant flex items-center justify-between gap-4">
                <span className="text-xs text-light-on-surface-variant font-mono tabular-nums">
                  Durée : {previewScenario.durationMinutes} min ·{' '}
                  {previewScenario.initialState.turn.max} séquences
                </span>
                <button
                  type="button"
                  onClick={() => onLaunchScenario(previewScenario)}
                  className="px-4 py-2.5 bg-light-primary hover:bg-[#1B4396] text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 shadow-xs"
                >
                  <Play className="w-3.5 h-3.5" />
                  Lancer ce Scénario Pré-visualisé dans le Cockpit
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
