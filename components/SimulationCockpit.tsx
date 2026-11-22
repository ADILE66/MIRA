'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  ScenarioDefinition,
  SimulationSession,
  KnowledgeDocument,
  PersonaMood,
} from '@/lib/types';
import {
  Send,
  Sliders,
  BookOpen,
  Code2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  ChevronRight,
  Sparkles,
  Check,
} from 'lucide-react';

interface SimulationCockpitProps {
  session: SimulationSession;
  scenario: ScenarioDefinition;
  knowledgeDocument?: KnowledgeDocument;
  onSessionUpdated: (updated: SimulationSession) => void;
  onTriggerEvaluation: (sessionId: string) => Promise<void>;
  isEvaluating: boolean;
}

export default function SimulationCockpit({
  session,
  scenario,
  knowledgeDocument,
  onSessionUpdated,
  onTriggerEvaluation,
  isEvaluating,
}: SimulationCockpitProps) {
  const [userMessage, setUserMessage] = useState('');
  const [selectedLevers, setSelectedLevers] = useState<string[]>([]);
  const [isSendingTurn, setIsSendingTurn] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [leftTab, setLeftTab] = useState<'kpis' | 'levers' | 'rag' | 'json'>('kpis');
  const [elapsedTurnSeconds, setElapsedTurnSeconds] = useState<number>(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Real-time countdown timer when session is active
  useEffect(() => {
    if (session.status !== 'active') return;
    const interval = setInterval(() => {
      setElapsedTurnSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [session.status, session.id, session.turnHistory.length]);

  const liveTimerSeconds = Math.max(
    0,
    session.currentState.turn.timeRemainingSeconds - elapsedTurnSeconds
  );

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session.turnHistory.length, isSendingTurn]);

  const toggleLeverSelection = (leverId: string) => {
    setSelectedLevers((prev) =>
      prev.includes(leverId)
        ? prev.filter((id) => id !== leverId)
        : [...prev, leverId]
    );
  };

  const quickPromptsByScenarioId: Record<string, string[]> = {
    'scen-compliance-loi-69-21': [
      "Monsieur Benjelloun, conformément à l'Article 78-4 de la Loi 69-21, notre télédéclaration trimestrielle SIMPL-DGI est obligatoirement visée par notre Commissaire aux Comptes : il est légalement impossible d'émettre un avoir fictif. En revanche, si vous émettez un virement irrévocable sous 24h avant l'arrêté de vendredi, le retard est éteint et aucune amende DGI (Taux BAM + 0,85%) ne sera déclenchée.",
      "La Loi 69-21 est d'ordre public : un délai à 120 jours ne peut s'appliquer rétroactivement sur une facture déjà échue. Soldons les 3,2 Millions MAD avant vendredi pour éviter la déclaration DGI.",
    ],
    'scen-compliance-loi-09-08-cndp': [
      "Nadia, en vertu des Articles 12, 43 et 44 de la Loi 09-08, le traitement de données biométriques et de copies de CIN exige une Autorisation préalable formelle de la CNDP (et non une simple déclaration) et interdit tout transfert vers l'Irlande sans validation CNDP. Pour ne pas bloquer le lancement, nous basculons immédiatement le bucket OCR sur notre Cloud Souverain à Casablanca et déposons la demande d'autorisation CNDP.",
      "Envoyer des scans de CIN et de biométrie hors du Maroc sans autorisation CNDP nous expose à des sanctions immédiates au titre de la Loi 09-08. Rapatrions le stockage sur notre datacenter souverain Casa/Rabat dès aujourd'hui.",
    ],
  };

  const quickPromptsByModule: Record<string, string[]> = {
    upskilling: [
      "Monsieur Chraïbi, je comprends l'impact critique sur vos 38 camions à Tanger Med. Je vous livre le rapport RCA officiel sous 24h avec redondance Active-Active sur nos deux datacenters souverains (Casa/Rabat), je détache un Architecte Principal 48h sur site à Tanger et j'active un avoir SLA de 8% (-144 kMAD), tout en maintenant le paiement à 60 jours exigé par la Loi 69-21.",
      "Conformément à la Loi 69-21 (DGI), un délai de paiement à 120 jours nous exposerait tous deux à des pénalités légales. En revanche, je vous offre 6 mois de Support Platinum 24/7 et une présence ingénierie dédiée à Tanger Med dès demain matin.",
    ],
    business_game: [
      "Monsieur le Président, pour ce Q1, nous allouons 700 kMAD en R&D sur le module IA & Cloud Souverain et 400 kMAD sur la Taskforce Customer Success & Recouvrement pour abaisser le churn sous 9% tout en préservant 5 700 kMAD de trésorerie.",
      "Nous lançons l'offre Enterprise Souveraine certifiée CNDP/DGSSI (+15% ARPU) auprès des banques pour générer +1 600 kMAD d'ARR et renforcer l'EBITDA.",
    ],
    recruitment: [
      "Merci pour ta franchise Zineb. Ta santé et la stabilité de l'équipe sont ma priorité : nous gelons immédiatement 20% du scope secondaire et je transfère dès ce soir l'astreinte nuit sur l'équipe Plateforme.",
      "Faisons le point sur les goulots d'étranglement techniques avant toute chose : hors de question que tu quittes l'équipe à cause d'une surcharge d'astreinte non régulée.",
    ],
    onboarding: [
      "Conformément à la procédure interne de Sécurité, j'isole immédiatement la machine compromise du réseau d'entreprise et j'alerte le Responsable Sécurité sous 15 minutes avec les journaux d'accès.",
    ],
  };

  const handleSendTurn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userMessage.trim() || isSendingTurn || session.status !== 'active') return;

    setIsSendingTurn(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/simulation/turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.id,
          userMessage: userMessage.trim(),
          appliedLeverIds: selectedLevers,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors du traitement du tour.');
      }

      onSessionUpdated(data.session);
      setUserMessage('');
      setSelectedLevers([]);
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Erreur réseau ou timeout API.'
      );
    } finally {
      setIsSendingTurn(false);
    }
  };

  const formatClock = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };

  const getMoodIndicator = (mood: PersonaMood) => {
    switch (mood) {
      case 'HOSTILE':
        return { label: 'HOSTILE', badgeClass: 'bg-light-error-container text-light-error border-light-error/30' };
      case 'SKEPTICAL':
        return { label: 'SCEPTIQUE', badgeClass: 'bg-warning-container text-on-warning-container border-warning/30' };
      case 'NEUTRAL':
        return { label: 'NEUTRE', badgeClass: 'bg-light-surface-container text-light-on-surface-variant border-light-outline-variant' };
      case 'OPEN':
        return { label: 'OUVERT', badgeClass: 'bg-light-secondary-container text-light-on-secondary-container border-light-secondary/30' };
      case 'CONVINCED':
        return { label: 'CONVAINCU', badgeClass: 'bg-success-container text-on-success-container border-success/30' };
    }
  };

  const moodInfo = getMoodIndicator(session.currentState.personaState.mood);

  return (
    <div className="min-h-[calc(100vh-65px)] flex flex-col bg-light-surface text-light-on-surface">
      {/* 1. FOCUSED COCKPIT TOP BAR — MATCHING STITCH INTERFACE */}
      <header className="bg-light-surface-container-lowest border-b border-light-outline-variant px-6 py-3 flex items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded bg-light-primary text-light-on-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-lg" aria-hidden="true">flight_takeoff</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="font-headline text-base sm:text-lg font-bold text-light-on-surface">
                {scenario.title}
              </h1>
              <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full bg-light-secondary-container text-light-on-secondary-container text-[11px] font-semibold font-mono uppercase">
                {scenario.moduleType}
              </span>
            </div>
            <span className="text-xs text-light-on-surface-variant font-medium">
              Session #{session.id.slice(0, 8)} • Persona : {session.currentState.personaState.name} ({session.currentState.personaState.company})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          {/* Turn & Timer Telemetry */}
          <div className="flex items-center gap-3 px-3 py-1.5 rounded bg-light-surface-container-low border border-light-outline-variant">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-light-on-surface-variant">sync</span>
              <span className="font-mono text-xs font-semibold text-light-on-surface tabular-nums">
                Tour {session.currentState.turn.current} / {session.currentState.turn.max}
              </span>
            </div>
            <span className="text-light-outline-variant">|</span>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-light-error">timer</span>
              <span className={`font-mono text-xs font-bold tabular-nums ${liveTimerSeconds < 180 ? 'text-light-error animate-pulse' : 'text-light-on-surface'}`}>
                {formatClock(liveTimerSeconds)}
              </span>
            </div>
          </div>

          {/* End / Evaluate CTA */}
          <button
            onClick={() => onTriggerEvaluation(session.id)}
            disabled={isEvaluating || session.turnHistory.length === 0}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded bg-light-surface-container-lowest text-light-error border border-light-outline-variant hover:bg-light-error-container hover:border-light-error/40 transition-colors text-xs font-semibold disabled:opacity-40 cursor-pointer shadow-xs"
          >
            {isEvaluating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Audit IA en cours...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-base">flag</span>
                <span>Terminer la session</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* 2. MAIN COCKPIT SPLIT — 4 COLS DETERMINISTIC TELEMETRY / 8 COLS NARRATIVE STAGE */}
      <main className="flex-1 grid grid-cols-12 min-h-0">
        {/* LEFT TELEMETRY PANEL: Deterministic State Engine */}
        <aside className="col-span-12 lg:col-span-4 bg-light-surface-container-low border-r border-light-outline-variant p-6 flex flex-col gap-5 overflow-y-auto max-h-[calc(100vh-130px)]">
          <div className="flex items-center justify-between border-b border-light-outline-variant pb-3">
            <div>
              <h2 className="font-headline text-sm font-bold text-light-on-surface">
                Moteur d’état en direct
              </h2>
              <span className="text-[11px] text-light-on-surface-variant font-mono">
                {session.currentState.turn.periodLabel}
              </span>
            </div>
            <span className="font-mono text-xs font-bold text-light-primary px-2 py-0.5 rounded bg-light-surface-container-lowest border border-light-outline-variant">
              DÉTERMINISTE
            </span>
          </div>

          {/* Segmented Sub-Tabs for Left Aside */}
          <div className="flex items-center gap-1 p-1 bg-light-surface-container-highest rounded-lg text-xs font-semibold">
            <button
              onClick={() => setLeftTab('kpis')}
              className={`flex-1 py-1 px-2 rounded transition-colors text-center cursor-pointer ${
                leftTab === 'kpis'
                  ? 'bg-light-surface-container-lowest text-light-primary shadow-xs'
                  : 'text-light-on-surface-variant hover:text-light-on-surface'
              }`}
            >
              Jauges KPI
            </button>
            <button
              onClick={() => setLeftTab('levers')}
              className={`flex-1 py-1 px-2 rounded transition-colors text-center cursor-pointer ${
                leftTab === 'levers'
                  ? 'bg-light-surface-container-lowest text-light-primary shadow-xs'
                  : 'text-light-on-surface-variant hover:text-light-on-surface'
              }`}
            >
              Leviers ({session.currentState.tacticalLevers.length})
            </button>
            <button
              onClick={() => setLeftTab('rag')}
              className={`flex-1 py-1 px-2 rounded transition-colors text-center cursor-pointer ${
                leftTab === 'rag'
                  ? 'bg-light-surface-container-lowest text-light-primary shadow-xs'
                  : 'text-light-on-surface-variant hover:text-light-on-surface'
              }`}
            >
              RAG
            </button>
            <button
              onClick={() => setLeftTab('json')}
              className={`flex-1 py-1 px-2 rounded transition-colors text-center cursor-pointer ${
                leftTab === 'json'
                  ? 'bg-light-surface-container-lowest text-light-primary shadow-xs'
                  : 'text-light-on-surface-variant hover:text-light-on-surface'
              }`}
            >
              JSON
            </button>
          </div>

          {/* TAB 1: KPIS GAUGES */}
          {leftTab === 'kpis' && (
            <div className="space-y-3.5">
              {session.currentState.metrics.map((metric) => {
                const range = Math.max(1, metric.max - metric.min);
                const pct = Math.max(
                  0,
                  Math.min(100, ((metric.value - metric.min) / range) * 100)
                );
                const isHealthy =
                  metric.direction === 'higher_is_better'
                    ? metric.value >= metric.targetThreshold
                    : metric.value <= metric.targetThreshold;
                const isDanger =
                  metric.direction === 'higher_is_better'
                    ? metric.value <= metric.criticalThreshold * 1.15
                    : metric.value >= metric.criticalThreshold * 0.85;

                return (
                  <article
                    key={metric.id}
                    className="bg-light-surface-container-lowest border border-light-outline-variant rounded-md p-4 flex flex-col gap-2 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-light-on-surface">
                        {metric.label}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-sm font-bold text-light-on-surface tabular-nums">
                          {metric.value} {metric.unit}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded font-mono text-[10px] font-bold ${
                            isHealthy
                              ? 'bg-success-container text-on-success-container'
                              : isDanger
                              ? 'bg-light-error-container text-light-error'
                              : 'bg-warning-container text-on-warning-container'
                          }`}
                        >
                          {isHealthy ? 'NOMINAL' : isDanger ? 'CRITIQUE' : 'CIBLE'}
                        </span>
                      </div>
                    </div>

                    <div className="w-full h-2 rounded-full bg-light-surface-container-highest overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          isHealthy
                            ? 'bg-success'
                            : isDanger
                            ? 'bg-light-error'
                            : 'bg-light-primary'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-light-on-surface-variant">
                      <span>Seuil de rupture : {metric.criticalThreshold} {metric.unit}</span>
                      <span>Cible : {metric.targetThreshold} {metric.unit}</span>
                    </div>
                  </article>
                );
              })}

              {/* Mission Objectives checklist */}
              <div className="pt-3 border-t border-light-outline-variant space-y-2">
                <span className="text-xs font-bold text-light-on-surface font-headline uppercase tracking-wider">
                  Objectifs du Scénario
                </span>
                <ul className="space-y-1.5 text-xs text-light-on-surface-variant">
                  {scenario.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2 leading-relaxed">
                      <Check className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: TACTICAL LEVERS */}
          {leftTab === 'levers' && (
            <div className="space-y-3">
              <span className="text-xs text-light-on-surface-variant">
                Cochez les leviers que vous appliquez ce tour-ci pour impacter directement les KPIs :
              </span>
              {session.currentState.tacticalLevers.map((lever) => {
                const isChecked = selectedLevers.includes(lever.id);
                return (
                  <div
                    key={lever.id}
                    onClick={() => !lever.applied && toggleLeverSelection(lever.id)}
                    className={`p-3.5 rounded-md border text-xs transition-colors flex items-start gap-3 cursor-pointer shadow-xs ${
                      lever.applied
                        ? 'bg-light-surface-container border-light-outline-variant opacity-60 cursor-not-allowed'
                        : isChecked
                        ? 'bg-light-secondary-container/40 border-light-primary text-light-primary'
                        : 'bg-light-surface-container-lowest border-light-outline-variant text-light-on-surface hover:border-light-primary'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked || lever.applied}
                      disabled={lever.applied}
                      readOnly
                      className="mt-0.5 rounded border-light-outline-variant text-light-primary focus:ring-light-primary"
                    />
                    <div className="space-y-1 flex-1">
                      <div className="font-semibold text-light-on-surface flex items-center justify-between">
                        <span>{lever.label}</span>
                        {lever.applied && (
                          <span className="font-mono text-[10px] text-light-on-surface-variant">Déjà exécuté</span>
                        )}
                      </div>
                      <p className="text-[11px] text-light-on-surface-variant leading-snug">
                        {lever.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: RAG PLAYBOOK */}
          {leftTab === 'rag' && (
            <div className="space-y-3 text-xs">
              <div className="font-semibold text-light-on-surface">
                {knowledgeDocument?.title || 'Référentiel Interne'}
              </div>
              <div className="space-y-2.5">
                {knowledgeDocument?.chunks.map((chunk) => (
                  <div
                    key={chunk.id}
                    className="p-3 bg-light-surface-container-lowest border border-light-outline-variant rounded-md space-y-1.5 shadow-xs"
                  >
                    <div className="font-bold text-light-on-surface font-headline">{chunk.title}</div>
                    <p className="text-light-on-surface-variant text-[11px] leading-relaxed">{chunk.content}</p>
                    <div className="pt-1.5 border-t border-light-outline-variant text-[10px] font-mono text-warning font-semibold">
                      Invariant : {chunk.mandatoryRule}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: JSON STATE */}
          {leftTab === 'json' && (
            <pre className="p-3 bg-light-surface-container-lowest border border-light-outline-variant rounded-md text-[10px] font-mono text-light-on-surface overflow-x-auto max-h-[350px]">
              {JSON.stringify(session.currentState, null, 2)}
            </pre>
          )}
        </aside>

        {/* RIGHT NARRATIVE STAGE: Dialogue Feed & Interactive Player Input */}
        <section className="col-span-12 lg:col-span-8 bg-light-surface p-6 flex flex-col justify-between gap-5 overflow-y-auto max-h-[calc(100vh-130px)]">
          {/* Persona Header Card */}
          <div className="bg-light-surface-container-lowest border border-light-outline-variant rounded-lg p-4 flex flex-wrap items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-light-primary-container text-light-on-primary flex items-center justify-center font-headline font-bold text-sm">
                {session.currentState.personaState.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div className="flex flex-col">
                <span className="font-headline font-bold text-sm text-light-on-surface">
                  {session.currentState.personaState.name}
                </span>
                <span className="text-xs text-light-on-surface-variant">
                  {session.currentState.personaState.role} — {session.currentState.personaState.company}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-1 rounded-full border text-xs font-mono font-bold ${moodInfo.badgeClass}`}>
                Humeur : {moodInfo.label}
              </span>
              <div className="text-xs font-mono tabular-nums text-light-on-surface-variant">
                Confiance : <strong className="text-light-on-surface font-bold">{session.currentState.personaState.trustScore} %</strong>
              </div>
            </div>
          </div>

          {/* Mission Brief strip */}
          <div className="p-3 bg-light-surface-container-low border border-light-outline-variant rounded text-xs text-light-on-surface-variant leading-relaxed">
            <strong className="text-light-on-surface font-semibold">Contexte opérationnel : </strong>
            {scenario.contextBrief}
          </div>

          {/* Dialogue Message Stream */}
          <div className="space-y-4 flex-1">
            {/* Opening statement */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-light-on-surface-variant font-medium">
                <span className="font-bold text-light-on-surface">{session.currentState.personaState.name}</span>
                <span>·</span>
                <span className="font-mono text-[11px]">Ouverture</span>
              </div>
              <div className="p-4 bg-light-surface-container-lowest border border-light-outline-variant rounded-lg text-sm text-light-on-surface shadow-xs leading-relaxed">
                « {scenario.openingPersonaMessage} »
              </div>
            </div>

            {/* Turn History */}
            {session.turnHistory.map((turn) => (
              <div key={turn.turnNumber} className="space-y-3">
                {/* User Message */}
                <div className="pl-6 space-y-1">
                  <div className="flex items-center justify-end gap-2 text-xs text-light-on-surface-variant font-medium">
                    <span className="font-mono text-[11px]">{turn.periodLabel}</span>
                    <span>·</span>
                    <span className="text-light-primary font-bold">Votre Décision (Tour #{turn.turnNumber})</span>
                  </div>
                  <div className="p-4 bg-light-secondary-container/30 border border-light-secondary-container rounded-lg text-sm text-light-on-surface leading-relaxed">
                    {turn.userMessage}
                  </div>
                  {turn.appliedLeverIds.length > 0 && (
                    <div className="text-right text-[11px] text-light-primary font-mono font-medium">
                      ✓ {turn.appliedLeverIds.length} levier(s) déterministe(s) validé(s)
                    </div>
                  )}
                </div>

                {/* AI Response */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-light-on-surface-variant font-medium">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-light-on-surface">{session.currentState.personaState.name}</span>
                      <span>·</span>
                      <span className="font-mono text-[11px]">Humeur : {turn.personaMoodAfter}</span>
                    </div>
                    {turn.tacticalEventTitle && (
                      <span className="font-mono text-warning font-semibold">
                        ◆ {turn.tacticalEventTitle}
                      </span>
                    )}
                  </div>

                  <div className="p-4 bg-light-surface-container-lowest border border-light-outline-variant rounded-lg text-sm text-light-on-surface shadow-xs leading-relaxed">
                    « {turn.aiNarrativeReply} »
                  </div>

                  {/* Deterministic Deltas & RAG Audit Bar */}
                  <div className="p-3 bg-light-surface-container-low border border-light-outline-variant rounded-md space-y-1.5 text-xs font-mono">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-light-on-surface-variant font-semibold">Deltas calculés :</span>
                      {turn.metricDeltas.map((d, i) => (
                        <span
                          key={i}
                          className={`px-1.5 py-0.5 rounded font-bold ${
                            d.delta > 0
                              ? 'bg-success-container text-on-success-container'
                              : d.delta < 0
                              ? 'bg-warning-container text-on-warning-container'
                              : 'bg-light-surface-container text-light-on-surface-variant'
                          }`}
                        >
                          {d.metricLabel}: {d.delta > 0 ? '+' : ''}{d.delta}{d.unit}
                        </span>
                      ))}
                    </div>

                    {turn.ragAssessment && (
                      <div className="flex items-center gap-2 pt-1 border-t border-light-outline-variant text-[11px]">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold ${
                            turn.ragAssessment.status === 'RESPECTED'
                              ? 'bg-success-container text-on-success-container'
                              : turn.ragAssessment.status === 'VIOLATED'
                              ? 'bg-light-error-container text-light-error'
                              : 'bg-light-surface-container text-light-on-surface-variant'
                          }`}
                        >
                          {turn.ragAssessment.status === 'RESPECTED' ? '✓ RESPECTÉ' : '✗ VIOLÉ'}
                        </span>
                        <span className="text-light-on-surface-variant">
                          {turn.ragAssessment.ruleTitle} : {turn.ragAssessment.explanation}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isSendingTurn && (
              <div className="p-4 bg-light-surface-container-lowest border border-light-outline-variant rounded-lg flex items-center gap-3 text-xs text-light-on-surface-variant shadow-xs">
                <Loader2 className="w-4 h-4 text-light-primary animate-spin" />
                <span>Calcul des impacts du Moteur d’État et génération de la réplique du persona...</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* 3. INTERACTIVE DECISION COMPOSER */}
          {session.status !== 'active' ? (
            <div className="p-5 bg-light-surface-container-lowest border border-light-outline-variant rounded-xl shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-xs font-mono font-bold ${session.status === 'won' ? 'text-success' : 'text-light-error'}`}>
                    {session.status === 'won' ? '▲ SIMULATION RÉUSSIE' : '■ ARRÊT CRITIQUE'}
                  </div>
                  <p className="text-sm font-semibold text-light-on-surface mt-0.5">{session.statusReason}</p>
                </div>
                <button
                  onClick={() => onTriggerEvaluation(session.id)}
                  disabled={isEvaluating}
                  className="px-5 py-2.5 bg-light-primary hover:bg-light-primary-container text-light-on-primary text-xs font-bold rounded shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <span>Consulter le Rapport Évaluateur</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSendTurn} className="p-4 bg-light-surface-container-lowest border border-light-outline-variant rounded-xl shadow-xs space-y-3">
              {/* Quick Suggestion Chips */}
              <div className="space-y-1.5">
                <div className="text-[11px] text-light-on-surface-variant flex items-center gap-1 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-light-primary" />
                  <span>Suggestions d’argumentaires (clic pour remplir) :</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(
                    quickPromptsByScenarioId[scenario.id] ||
                    quickPromptsByModule[scenario.moduleType] ||
                    quickPromptsByModule.upskilling
                  ).map((sample, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setUserMessage(sample)}
                      className="text-left text-[11px] px-2.5 py-1 bg-light-surface-container-low hover:bg-light-secondary-container/50 text-light-on-surface border border-light-outline-variant rounded transition-colors truncate max-w-full cursor-pointer"
                    >
                      Ex #{idx + 1} : « {sample.slice(0, 65)}... »
                    </button>
                  ))}
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 bg-light-error-container text-light-error border border-light-error/30 rounded text-xs">
                  {errorMessage}
                </div>
              )}

              {/* Textarea & Submit Button */}
              <div className="flex gap-3">
                <textarea
                  rows={3}
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  placeholder="Formulez votre argumentaire, vos arbitrages chiffrés ou votre décision opérationnelle..."
                  className="flex-1 bg-light-surface-container-lowest border border-light-outline-variant rounded-md p-3 text-xs sm:text-sm text-light-on-surface placeholder:text-light-outline-variant focus:outline-none focus:border-light-primary focus:ring-1 focus:ring-light-primary"
                />
                <button
                  type="submit"
                  disabled={isSendingTurn || !userMessage.trim()}
                  className="px-5 py-2.5 bg-light-primary hover:bg-light-primary-container disabled:opacity-40 text-light-on-primary text-xs font-bold rounded transition-colors flex flex-col items-center justify-center gap-1 shrink-0 cursor-pointer shadow-xs"
                >
                  {isSendingTurn ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span className="material-symbols-outlined text-lg">send</span>
                  )}
                  <span>Valider le Tour</span>
                </button>
              </div>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}
