'use client';

import React, { useState } from 'react';
import {
  KnowledgeDocument,
  ModuleType,
  ScenarioDefinition,
} from '@/lib/types';
import MoroccanComplianceModule from '@/components/MoroccanComplianceModule';
import {
  Upload,
  FileText,
  Sparkles,
  CheckCircle2,
  Loader2,
  Play,
  Layers,
} from 'lucide-react';

interface StudioRagBuilderProps {
  organizationId: string;
  knowledgeDocuments: KnowledgeDocument[];
  scenarios: ScenarioDefinition[];
  onDocumentCreated: (doc: KnowledgeDocument) => void;
  onScenarioGenerated: (scenario: ScenarioDefinition, autoStart: boolean) => void;
  onLaunchExistingScenario: (scenario: ScenarioDefinition) => void;
}

export default function StudioRagBuilder({
  organizationId,
  knowledgeDocuments,
  scenarios,
  onDocumentCreated,
  onScenarioGenerated,
  onLaunchExistingScenario,
}: StudioRagBuilderProps) {
  // General Document ingestion form state
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState<
    | 'moroccan_compliance'
    | 'sales_playbook'
    | 'hr_policy'
    | 'cyber_procedure'
    | 'finance_rules'
  >('sales_playbook');
  const [docRawContent, setDocRawContent] = useState('');
  const [isIngestingDoc, setIsIngestingDoc] = useState(false);
  const [docSuccessMsg, setDocSuccessMsg] = useState<string | null>(null);

  // General Scenario AI generator form state
  const [selectedDocId, setSelectedDocId] = useState<string>(
    knowledgeDocuments[0]?.id || ''
  );
  const [targetModule, setTargetModule] = useState<ModuleType>('upskilling');
  const [customBrief, setCustomBrief] = useState(
    "Un client grand compte à Casablanca menace de suspendre le contrat (2,5 Millions MAD) si nous n'acceptons pas une remise hors charte."
  );
  const [isGeneratingScenario, setIsGeneratingScenario] = useState(false);
  const [studioError, setStudioError] = useState<string | null>(null);
  const [lastGeneratedScenario, setLastGeneratedScenario] =
    useState<ScenarioDefinition | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    if (!docTitle) {
      setDocTitle(file.name.replace(/\.(md|txt)$/i, ''));
    }
    setDocRawContent(text);
  };

  const loadSamplePlaybook = () => {
    setDocTitle('Playbook Grands Comptes & Financement CSF OFPPT / GIAC 2026');
    setDocCategory('sales_playbook');
    setDocRawContent(`# RÈGLE 1 : Plafond de Remise & Protection Marge en MAD
Toute remise commerciale supérieure à 10% sur un contrat annuel exige l'aval de la Direction Financière à Casablanca.

# RÈGLE 2 : Ingénierie de Formation & Remboursement CSF (OFPPT / GIAC)
Pour tout déploiement chez une ETI marocaine, proposer systématiquement le montage du dossier Contrats Spéciaux de Formation (CSF) permettant un remboursement jusqu'à 70% de l'accompagnement au changement.`);
  };

  const handleIngestDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim() || !docRawContent.trim()) return;

    setIsIngestingDoc(true);
    setDocSuccessMsg(null);
    setStudioError(null);

    try {
      const response = await fetch('/api/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId,
          title: docTitle,
          category: docCategory,
          rawContent: docRawContent,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Échec de l’ingestion documentaire.');
      }

      onDocumentCreated(data.document);
      setSelectedDocId(data.document.id);
      setDocTitle('');
      setDocRawContent('');
      setDocSuccessMsg(
        `Document indexé avec succès en ${data.document.chunks.length} segments RAG vérifiables.`
      );
    } catch (err: unknown) {
      setStudioError(
        err instanceof Error ? err.message : 'Erreur lors de l’indexation RAG.'
      );
    } finally {
      setIsIngestingDoc(false);
    }
  };

  const handleGenerateScenario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDocId || !customBrief.trim()) return;

    setIsGeneratingScenario(true);
    setStudioError(null);

    try {
      const response = await fetch('/api/studio/generate-scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId,
          knowledgeDocumentId: selectedDocId,
          moduleType: targetModule,
          customBrief,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.error || 'Échec de la génération du contrat de scénario.'
        );
      }

      setLastGeneratedScenario(data.scenario);
      onScenarioGenerated(data.scenario, false);
    } catch (err: unknown) {
      setStudioError(
        err instanceof Error
          ? err.message
          : 'Erreur lors de la génération par Gemini.'
        );
    } finally {
      setIsGeneratingScenario(false);
    }
  };

  const activeDoc =
    knowledgeDocuments.find((d) => d.id === selectedDocId) ||
    knowledgeDocuments[0];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 bg-light-surface text-light-on-surface">
      {/* Studio Header — Stitch Workspace Header */}
      <div className="border-b border-light-outline-variant pb-6">
        <div className="text-xs text-light-primary font-mono font-bold">
          Studio d’Ingénierie Pédagogique & Base Documentaire RAG
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-light-on-surface font-headline mt-1">
          Base Documentaire RAG & Studio de Création de Scénarios
        </h1>
        <p className="text-sm text-light-on-surface-variant mt-1 max-w-3xl leading-relaxed">
          Importez vos textes réglementaires (PDF / Markdown) ou vos playbooks d’entreprise,
          inspectez les segments RAG indexés et générez en 30 secondes des simulations jouables.
        </p>
      </div>

      {/* 3 Summary KPI Cards — Matching Stitch RAG Workspace */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <article className="bg-light-surface-container-lowest border border-light-outline-variant rounded-xl p-5 flex flex-col gap-1 shadow-xs">
          <span className="font-mono text-xs text-light-on-surface-variant font-medium">Documents indexés</span>
          <span className="font-headline text-3xl font-bold text-light-on-surface tabular-nums">
            {knowledgeDocuments.length}
          </span>
          <span className="text-[11px] text-light-primary font-semibold">Bases documentaires prêtes pour l'IA</span>
        </article>

        <article className="bg-light-surface-container-lowest border border-light-outline-variant rounded-xl p-5 flex flex-col gap-1 shadow-xs">
          <span className="font-mono text-xs text-light-on-surface-variant font-medium">Segments & Règles RAG</span>
          <span className="font-headline text-3xl font-bold text-success tabular-nums">
            {knowledgeDocuments.reduce((acc, d) => acc + d.chunks.length, 0)}
          </span>
          <span className="text-[11px] text-light-on-surface-variant">Règles impératives injectées en direct</span>
        </article>

        <article className="bg-light-surface-container-lowest border border-light-outline-variant rounded-xl p-5 flex flex-col gap-1 shadow-xs">
          <span className="font-mono text-xs text-light-on-surface-variant font-medium">Scénarios Opérationnels</span>
          <span className="font-headline text-3xl font-bold text-light-primary tabular-nums">
            {scenarios.length}
          </span>
          <span className="text-[11px] text-light-on-surface-variant">Générés par l'Architecte IA</span>
        </article>
      </div>

      {/* DEDICATED COMPONENT: REGULATORY COMPLIANCE MODULE */}
      <MoroccanComplianceModule
        organizationId={organizationId}
        knowledgeDocuments={knowledgeDocuments}
        scenarios={scenarios}
        onDocumentCreated={(newDoc) => {
          onDocumentCreated(newDoc);
          setSelectedDocId(newDoc.id);
        }}
        onScenarioGenerated={onScenarioGenerated}
        onLaunchScenario={onLaunchExistingScenario}
      />

      {studioError && (
        <div className="p-4 bg-light-error-container border border-light-error/30 rounded-xl text-xs text-light-error">
          {studioError}
        </div>
      )}

      {/* General Corporate Playbook Studio Section */}
      <div className="space-y-4">
        <div className="border-b border-light-outline-variant pb-3">
          <h2 className="text-lg font-bold text-light-on-surface font-headline">
            Studio Général : Playbooks Métiers Internes (Vente, Finance, RH)
          </h2>
          <p className="text-xs text-light-on-surface-variant">
            Indexez vos procédures internes et inspectez le découpage en segments RAG.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN (6 cols): General RAG Document Ingestion & Chunk Inspector */}
          <div className="lg:col-span-6 space-y-6">
            <form
              onSubmit={handleIngestDocument}
              className="p-6 bg-light-surface-container-lowest border border-light-outline-variant rounded-xl shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between border-b border-light-outline-variant pb-3">
                <h3 className="text-base font-bold text-light-on-surface font-headline">
                  01. Ingesteur Playbook Interne (.md / .txt)
                </h3>
                <button
                  type="button"
                  onClick={loadSamplePlaybook}
                  className="text-xs text-light-primary hover:underline font-semibold cursor-pointer"
                >
                  Charger Exemple Playbook
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-light-on-surface-variant mb-1">
                    Intitulé du Document Interne
                  </label>
                  <input
                    type="text"
                    value={docTitle}
                    onChange={(e) => setDocTitle(e.target.value)}
                    placeholder="Ex: Charte Commerciale & Plafonds SLA 2026"
                    className="w-full bg-light-surface-container-low border border-light-outline-variant rounded px-3 py-2 text-xs text-light-on-surface focus:outline-none focus:border-light-primary focus:ring-1 focus:ring-light-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-light-on-surface-variant mb-1">
                    Catégorie Métier
                  </label>
                  <select
                    value={docCategory}
                    onChange={(e) =>
                      setDocCategory(
                        e.target.value as
                          | 'moroccan_compliance'
                          | 'sales_playbook'
                          | 'hr_policy'
                          | 'cyber_procedure'
                          | 'finance_rules'
                      )
                    }
                    className="w-full bg-light-surface-container-low border border-light-outline-variant rounded px-3 py-2 text-xs text-light-on-surface focus:outline-none focus:border-light-primary focus:ring-1 focus:ring-light-primary"
                  >
                    <option value="sales_playbook">Playbook Vente & SLA</option>
                    <option value="finance_rules">Gouvernance Finance BU</option>
                    <option value="hr_policy">Charte RH & Management</option>
                    <option value="cyber_procedure">Procédure Cyber / SOC</option>
                    <option value="moroccan_compliance">Conformité Légale</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-light-on-surface-variant">
                    Contenu des Règles (découpage auto par # RÈGLE ou # ARTICLE)
                  </label>
                  <label className="text-xs text-light-primary hover:underline font-semibold cursor-pointer flex items-center gap-1">
                    <Upload className="w-3 h-3" />
                    <span>Importer .md / .txt</span>
                    <input
                      type="file"
                      accept=".md,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <textarea
                  rows={5}
                  value={docRawContent}
                  onChange={(e) => setDocRawContent(e.target.value)}
                  placeholder="# RÈGLE 1 : Plafond de remise&#10;Toute remise supérieure à 10% exige l'accord du CFO..."
                  className="w-full bg-light-surface-container-low border border-light-outline-variant rounded p-3 text-xs font-mono text-light-on-surface focus:outline-none focus:border-light-primary focus:ring-1 focus:ring-light-primary"
                />
              </div>

              {docSuccessMsg && (
                <div className="p-3 bg-success-container text-on-success-container border border-success/30 rounded text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{docSuccessMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={
                  isIngestingDoc || !docTitle.trim() || !docRawContent.trim()
                }
                className="w-full py-2.5 px-4 bg-light-surface-container hover:bg-light-surface-container-highest border border-light-outline-variant disabled:opacity-40 text-light-on-surface text-xs font-semibold rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                {isIngestingDoc ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-light-primary" />
                    <span>Découpage & Indexation RAG...</span>
                  </>
                ) : (
                  <>
                    <Layers className="w-4 h-4 text-light-primary" />
                    <span>Indexer dans la Base de Connaissances RAG</span>
                  </>
                )}
              </button>
            </form>

            {/* Active RAG Chunks Explorer */}
            <div className="p-6 bg-light-surface-container-lowest border border-light-outline-variant rounded-xl shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-light-outline-variant pb-3">
                <div>
                  <h3 className="text-sm font-bold text-light-on-surface font-headline">
                    Inspecteur des Segments RAG ({activeDoc?.chunks.length || 0} chunks)
                  </h3>
                  <p className="text-xs text-light-on-surface-variant mt-0.5">
                    {activeDoc?.title}
                  </p>
                </div>
                <FileText className="w-4 h-4 text-light-primary" />
              </div>

              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {activeDoc?.chunks.map((chunk) => (
                  <div
                    key={chunk.id}
                    className="p-3.5 bg-light-surface-container-low border border-light-outline-variant rounded-lg space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-light-on-surface font-headline">
                        {chunk.title}
                      </span>
                      <span className="font-mono text-[10px] text-light-on-surface-variant font-bold">
                        {chunk.id}
                      </span>
                    </div>
                    <p className="text-xs text-light-on-surface-variant leading-relaxed">
                      {chunk.content}
                    </p>
                    <div className="text-[11px] font-mono text-warning font-semibold pt-1 border-t border-light-outline-variant">
                      Invariant : {chunk.mandatoryRule}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (6 cols): AI Scenario Architect */}
          <div className="lg:col-span-6 space-y-6">
            <form
              onSubmit={handleGenerateScenario}
              className="p-6 bg-light-surface-container-lowest border border-light-outline-variant rounded-xl shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between border-b border-light-outline-variant pb-3">
                <h3 className="text-base font-bold text-light-on-surface font-headline">
                  02. Architecte de Scénario Multi-Modules par IA
                </h3>
                <Sparkles className="w-4 h-4 text-light-primary" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-light-on-surface-variant mb-1">
                  1. Document Source RAG à Auditer
                </label>
                <select
                  value={selectedDocId}
                  onChange={(e) => setSelectedDocId(e.target.value)}
                  className="w-full bg-light-surface-container-low border border-light-outline-variant rounded px-3 py-2.5 text-xs text-light-on-surface focus:outline-none focus:border-light-primary focus:ring-1 focus:ring-light-primary"
                >
                  {knowledgeDocuments.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.category === 'moroccan_compliance'
                        ? '[CONFORMITÉ] '
                        : ''}
                      {doc.title} ({doc.chunks.length} segments)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-light-on-surface-variant mb-1">
                  2. Module Métier Cible
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      { id: 'upskilling', label: '01. Formation & Upskilling' },
                      { id: 'business_game', label: '02. Business Game' },
                      { id: 'recruitment', label: '03. Recrutement' },
                      { id: 'onboarding', label: '04. Onboarding' },
                    ] as const
                  ).map((m) => (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => setTargetModule(m.id)}
                      className={`p-2.5 text-xs font-semibold rounded border text-left transition-colors cursor-pointer ${
                        targetModule === m.id
                          ? 'bg-light-secondary-container text-light-primary border-light-primary shadow-xs'
                          : 'bg-light-surface-container-low border-light-outline-variant text-light-on-surface-variant hover:text-light-on-surface'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-light-on-surface-variant mb-1">
                  3. Note de Cadrage / Brief Métier
                </label>
                <textarea
                  rows={3}
                  value={customBrief}
                  onChange={(e) => setCustomBrief(e.target.value)}
                  placeholder="Ex: Le client conteste les délais d'intervention et exige des pénalités non contractuelles..."
                  className="w-full bg-light-surface-container-low border border-light-outline-variant rounded p-3 text-xs text-light-on-surface focus:outline-none focus:border-light-primary focus:ring-1 focus:ring-light-primary"
                />
              </div>

              <button
                type="submit"
                disabled={isGeneratingScenario || !selectedDocId || !customBrief.trim()}
                className="w-full py-3 px-4 bg-light-primary hover:bg-light-primary-container disabled:opacity-40 text-light-on-primary text-xs font-bold rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                {isGeneratingScenario ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Génération du Contrat Déterministe & Persona...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Générer le Scénario Complet (IA + Moteur d’État)</span>
                  </>
                )}
              </button>
            </form>

            {/* Generated Scenario Preview & Launch */}
            {lastGeneratedScenario && (
              <div className="p-6 bg-light-surface-container-lowest border-2 border-success/40 rounded-xl shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-success font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Scénario Généré avec Succès</span>
                  </span>
                  <span className="text-xs font-mono text-light-on-surface-variant">
                    {lastGeneratedScenario.id}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-light-on-surface font-headline">
                    {lastGeneratedScenario.title}
                  </h4>
                  <p className="text-xs text-light-on-surface-variant mt-1">
                    {lastGeneratedScenario.subtitle}
                  </p>
                </div>

                <div className="p-3 bg-light-surface-container-low border border-light-outline-variant rounded text-xs space-y-1">
                  <div className="font-bold text-light-on-surface">
                    Persona : {lastGeneratedScenario.initialState.personaState.name} (
                    {lastGeneratedScenario.initialState.personaState.role})
                  </div>
                  <div className="text-light-on-surface-variant italic">
                    « {lastGeneratedScenario.openingPersonaMessage} »
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onLaunchExistingScenario(lastGeneratedScenario)}
                  className="w-full py-2.5 px-4 bg-success text-white hover:bg-success/90 text-xs font-bold rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Lancer ce Scénario Immédiatement dans le Cockpit</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
