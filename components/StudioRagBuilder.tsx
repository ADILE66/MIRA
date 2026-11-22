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
        throw new Error(data.error || 'Échec de la génération du scénario.');
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
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
      {/* Studio Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="text-xs text-blue-400 font-mono">
          Studio d’Ingénierie Pédagogique & Base Documentaire RAG
        </div>
        <h1 className="text-2xl lg:text-3xl font-semibold text-white font-display mt-1">
          Module « Conformité Maroc » & Studio de Création de Scénarios sur-mesure
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          Importez vos textes réglementaires (PDF / Markdown) pour la Loi 69-21,
          la Loi 09-08 CNDP et la DGSSI, pré-visualisez les templates conformes
          générés par l’IA, ou indexez vos playbooks métiers internes.
        </p>
      </div>

      {/* DEDICATED COMPONENT: MOROCCAN COMPLIANCE MODULE (PDF/MD Upload, Regulatory Selector, AI Template Previewer) */}
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
        <div className="p-4 bg-red-950/50 border border-red-800 rounded-xl text-xs text-red-200">
          {studioError}
        </div>
      )}

      {/* General Corporate Playbook Studio Section */}
      <div className="space-y-4">
        <div className="border-b border-slate-800 pb-3">
          <h2 className="text-lg font-semibold text-white font-display">
            Studio Général : Playbooks Métiers Internes (Vente, Finance CFC, DRH)
          </h2>
          <p className="text-xs text-slate-400">
            Indexez vos procédures internes non-législatives et inspectez le
            découpage en segments RAG.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN (6 cols): General RAG Document Ingestion & Chunk Inspector */}
          <div className="lg:col-span-6 space-y-6">
            <form
              onSubmit={handleIngestDocument}
              className="p-6 bg-[#111827] border border-slate-800 rounded-xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-white font-display">
                  01. Ingesteur Playbook Interne (.md / .txt)
                </h3>
                <button
                  type="button"
                  onClick={loadSamplePlaybook}
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Charger Playbook Commercial
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs text-slate-400 mb-1">
                    Intitulé du Document Interne
                  </label>
                  <input
                    type="text"
                    value={docTitle}
                    onChange={(e) => setDocTitle(e.target.value)}
                    placeholder="Ex: Charte Commerciale & Plafonds SLA 2026"
                    className="w-full bg-[#0B0F17] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
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
                    className="w-full bg-[#0B0F17] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="sales_playbook">Playbook Vente & SLA</option>
                    <option value="finance_rules">Gouvernance Finance BU</option>
                    <option value="hr_policy">Charte RH & Management</option>
                    <option value="cyber_procedure">Procédure Cyber / SOC</option>
                    <option value="moroccan_compliance">Conformité Maroc</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-slate-400">
                    Contenu des Règles (découpage auto par # RÈGLE ou # ARTICLE)
                  </label>
                  <label className="text-xs text-blue-400 hover:text-blue-300 cursor-pointer flex items-center gap-1">
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
                  className="w-full bg-[#0B0F17] border border-slate-700 rounded-lg p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              {docSuccessMsg && (
                <div className="p-3 bg-emerald-950/40 border border-emerald-800/70 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{docSuccessMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={
                  isIngestingDoc || !docTitle.trim() || !docRawContent.trim()
                }
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isIngestingDoc ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Découpage & Indexation RAG...
                  </>
                ) : (
                  <>
                    <Layers className="w-4 h-4" />
                    Indexer dans la Base de Connaissances RAG
                  </>
                )}
              </button>
            </form>

            {/* Active RAG Chunks Explorer */}
            <div className="p-6 bg-[#111827] border border-slate-800 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white font-display">
                    Inspecteur des Segments RAG ({activeDoc?.chunks.length || 0}{' '}
                    chunks)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {activeDoc?.title}
                  </p>
                </div>
                <FileText className="w-4 h-4 text-slate-400" />
              </div>

              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {activeDoc?.chunks.map((chunk) => (
                  <div
                    key={chunk.id}
                    className="p-3.5 bg-[#0B0F17] border border-slate-800 rounded-lg space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-white">
                        {chunk.title}
                      </span>
                      <span className="font-mono text-[10px] text-slate-500">
                        {chunk.id}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {chunk.content}
                    </p>
                    <div className="text-[11px] font-mono text-amber-400">
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
              className="p-6 bg-[#111827] border border-slate-800 rounded-xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-white font-display">
                  02. Architecte de Scénario Multi-Modules par IA
                </h3>
                <Sparkles className="w-4 h-4 text-blue-400" />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  1. Document Source RAG à Auditer
                </label>
                <select
                  value={selectedDocId}
                  onChange={(e) => setSelectedDocId(e.target.value)}
                  className="w-full bg-[#0B0F17] border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  {knowledgeDocuments.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.category === 'moroccan_compliance'
                        ? '[CONFORMITÉ MAROC] '
                        : ''}
                      {doc.title} ({doc.chunks.length} segments)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  2. Module Métier Cible
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      {
                        id: 'upskilling',
                        label: '01. Formation & Négociation',
                      },
                      {
                        id: 'business_game',
                        label: '02. Business Game (4 Trimestres)',
                      },
                      {
                        id: 'recruitment',
                        label: '03. Recrutement Chronométré',
                      },
                      {
                        id: 'onboarding',
                        label: '04. Onboarding & Conformité',
                      },
                    ] as const
                  ).map((m) => (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => setTargetModule(m.id)}
                      className={`p-2.5 rounded-lg border text-xs font-medium text-left transition-colors ${
                        targetModule === m.id
                          ? 'bg-blue-950/60 border-blue-500 text-white'
                          : 'bg-[#0B0F17] border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  3. Brief de Mise en Situation
                </label>
                <textarea
                  rows={4}
                  value={customBrief}
                  onChange={(e) => setCustomBrief(e.target.value)}
                  className="w-full bg-[#0B0F17] border border-slate-700 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={isGeneratingScenario || !customBrief.trim()}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isGeneratingScenario ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Compilation du Contrat JSON Déterministe via Gemini...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Générer le Scénario Sur-Mesure
                  </>
                )}
              </button>
            </form>

            {lastGeneratedScenario && (
              <div className="p-6 bg-[#111827] border border-blue-500/50 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-400">
                    ▲ NOUVEAU SCÉNARIO COMPILÉ AVEC SUCCÈS
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {lastGeneratedScenario.initialState.metrics.length} KPIs ·{' '}
                    {lastGeneratedScenario.initialState.tacticalLevers.length}{' '}
                    Leviers
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white font-display">
                    {lastGeneratedScenario.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    {lastGeneratedScenario.subtitle}
                  </p>
                </div>

                <button
                  onClick={() => onScenarioGenerated(lastGeneratedScenario, true)}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Play className="w-3.5 h-3.5" />
                  Lancer Immédiatement dans le Cockpit
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
