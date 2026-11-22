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
  Flag,
  ChevronRight,
  Sparkles,
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
  const [rightTab, setRightTab] = useState<'telemetry' | 'rag' | 'json'>('telemetry');
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
      "Conformément à la Loi 69-21 (DGI), un délai de paiement à 120 jours nous exposerait tous deux à des pénalités légales. En revanche, je vous offre 6 mois de Support Platinum 24/7 et une présence ingénierie dédiée à Tanger Med et Nouaceur dès demain matin.",
    ],
    business_game: [
      "Monsieur le Président, pour ce Q1 à Casablanca Finance City, nous allouons 700 kMAD en R&D sur le module IA & Cloud Souverain (Rabat Technopolis) et 400 kMAD sur la Taskforce Customer Success & Recouvrement pour abaisser le churn sous 9% tout en préservant 5 700 kMAD de trésorerie.",
      "Nous lançons l'offre Enterprise Souveraine certifiée CNDP/DGSSI (+15% ARPU) auprès des banques de la place casablancaise pour générer +1 600 kMAD d'ARR et renforcer l'EBITDA.",
    ],
    recruitment: [
      "Merci pour ta franchise Zineb. Ta santé et la stabilité de la Squad Monétique à Casanearshore sont ma priorité : nous gelons immédiatement 20% du scope secondaire du go-live CMI du 15 et je transfère dès ce soir l'astreinte nuit sur l'équipe Plateforme de Rabat Technopolis.",
      "Faisons le point sur les goulots d'étranglement techniques avant toute chose : hors de question que tu quittes l'équipe à cause d'une surcharge d'astreinte non régulée.",
    ],
    onboarding: [
      "J'applique immédiatement la Règle #1 de la directive DGSSI (Loi 05-20) : j'ordonne l'isolation du conteneur Casa-DC1 et la révocation des clés IAM compromises, puis je saisis le RSSI et le DPO pour notifier le maCERT et la CNDP au titre de la Loi 09-08.",
      "Avec des copies de CIN et de RIB clients exfiltrées, la Loi 09-08 CNDP est formelle : on coupe immédiatement l'accès IAM compromis sur Casa-DC1 et on ouvre la procédure réglementaire.",
    ],
  };

  const handleSendTurn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userMessage.trim() || isSendingTurn || session.status !== 'active') return;

    setIsSendingTurn(true);
    setErrorMessage(null);
    const elapsedSeconds = Math.max(15, elapsedTurnSeconds);

    try {
      const response = await fetch('/api/simulation/turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.id,
          userMessage: userMessage.trim(),
          appliedLeverIds: selectedLevers,
          elapsedSeconds,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors du traitement du tour.');
      }

      setUserMessage('');
      setSelectedLevers([]);
      setElapsedTurnSeconds(0);
      onSessionUpdated(data.session);
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Erreur réseau avec le moteur hybride.'
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
        return { label: '■ HOSTILE', color: 'text-red-400' };
      case 'SKEPTICAL':
        return { label: '◆ SCEPTIQUE', color: 'text-amber-400' };
      case 'NEUTRAL':
        return { label: '● NEUTRE', color: 'text-slate-300' };
      case 'OPEN':
        return { label: '▲ OUVERT', color: 'text-blue-400' };
      case 'CONVINCED':
        return { label: '▲ CONVAINCU', color: 'text-emerald-400' };
    }
  };

  const moodInfo = getMoodIndicator(session.currentState.personaState.mood);

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-6">
      {/* Top Cockpit Status Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-mono text-blue-400">
              {session.currentState.turn.periodLabel}
            </span>
            <span aria-hidden="true">·</span>
            <span>{scenario.title}</span>
          </div>
          <h1 className="text-xl font-semibold text-white font-display mt-1">
            {session.currentState.personaState.name} —{' '}
            <span className="text-slate-400 font-normal">
              {session.currentState.personaState.role} (
              {session.currentState.personaState.company})
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-6">
          {/* Chronometer */}
          <div className="flex items-center gap-2.5 px-3.5 py-2 bg-[#111827] border border-slate-800 rounded-lg">
            <Clock className="w-4 h-4 text-blue-400" />
            <div>
              <div className="text-[10px] text-slate-400">Temps Restant</div>
              <div className="text-sm font-mono font-semibold tabular-nums text-white">
                {formatClock(liveTimerSeconds)}
              </div>
            </div>
          </div>

          {/* Turn Progress */}
          <div className="px-3.5 py-2 bg-[#111827] border border-slate-800 rounded-lg">
            <div className="text-[10px] text-slate-400">Séquence</div>
            <div className="text-sm font-mono font-semibold tabular-nums text-white">
              Tour {session.currentState.turn.current} /{' '}
              {session.currentState.turn.max}
            </div>
          </div>

          {/* End & Evaluate Trigger */}
          <button
            onClick={() => onTriggerEvaluation(session.id)}
            disabled={isEvaluating || session.turnHistory.length === 0}
            className="px-4 py-2.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 disabled:opacity-40 transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            {isEvaluating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Audit IA en cours...
              </>
            ) : (
              <>
                <Flag className="w-3.5 h-3.5" />
                Clôturer & Lancer l’Agent Évaluateur
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Split-Screen Cockpit (65% Narrative Stage / 35% Deterministic Telemetry & RAG) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN (7 cols): Narrative Conversation & Tactical Decision Console */}
        <div className="lg:col-span-7 flex flex-col bg-[#111827] border border-slate-800 rounded-xl overflow-hidden">
          {/* Persona Psychological Telemetry Bar */}
          <div className="px-5 py-3.5 bg-[#0B0F17]/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-xs">
              <span className="text-slate-400">Canal :</span>
              <span className="text-slate-200 font-medium">
                {session.currentState.personaState.channel}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono tabular-nums">
              <span className={moodInfo.color}>{moodInfo.label}</span>
              <span aria-hidden="true" className="text-slate-700">
                |
              </span>
              <span className="text-slate-300">
                Confiance : {session.currentState.personaState.trustScore}/100
              </span>
              <span aria-hidden="true" className="text-slate-700">
                |
              </span>
              <span className="text-slate-300">
                Stress : {session.currentState.personaState.stressLevel}%
              </span>
            </div>
          </div>

          {/* Context Brief Callout */}
          <div className="px-5 py-3 bg-slate-900/50 border-b border-slate-800/80 text-xs text-slate-300 leading-relaxed">
            <span className="font-semibold text-white">Brief de Mission : </span>
            {scenario.contextBrief}
          </div>

          {/* Conversation & Turn Feed */}
          <div className="p-5 space-y-5 max-h-[460px] overflow-y-auto">
            {/* Opening Persona Statement */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="font-semibold text-white">
                  {session.currentState.personaState.name}
                </span>
                <span aria-hidden="true">·</span>
                <span>Ouverture de session</span>
              </div>
              <div className="p-4 bg-[#0B0F17] border border-slate-800 rounded-xl text-sm text-slate-200 leading-relaxed">
                {scenario.openingPersonaMessage}
              </div>
            </div>

            {/* Turn History */}
            {session.turnHistory.map((turn) => (
              <div key={turn.turnNumber} className="space-y-4">
                {/* User Decision Bubble */}
                <div className="pl-8 space-y-1.5">
                  <div className="flex items-center justify-end gap-2 text-xs text-slate-400">
                    <span className="font-mono">{turn.periodLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-blue-400 font-medium">
                      Votre Décision (Tour #{turn.turnNumber})
                    </span>
                  </div>
                  <div className="p-4 bg-blue-950/40 border border-blue-800/60 rounded-xl text-sm text-slate-100 leading-relaxed">
                    {turn.userMessage}
                  </div>
                  {turn.appliedLeverIds.length > 0 && (
                    <div className="text-right text-xs text-blue-300 font-mono">
                      Leviers déterministes exécutés :{' '}
                      {turn.appliedLeverIds.length}
                    </div>
                  )}
                </div>

                {/* Persona Response & Deterministic Deltas */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">
                        {session.currentState.personaState.name}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-slate-300">
                        Humeur : {turn.personaMoodAfter}
                      </span>
                    </div>
                    {turn.tacticalEventTitle && (
                      <span className="font-mono text-amber-400">
                        ◆ {turn.tacticalEventTitle}
                      </span>
                    )}
                  </div>

                  <div className="p-4 bg-[#0B0F17] border border-slate-800 rounded-xl text-sm text-slate-200 leading-relaxed">
                    {turn.aiNarrativeReply}
                  </div>

                  {/* Deterministic Deltas & RAG Audit Strip */}
                  <div className="p-3 bg-slate-900/70 border border-slate-800/80 rounded-lg space-y-2">
                    <div className="flex flex-wrap items-center gap-3 text-xs font-mono tabular-nums">
                      <span className="text-slate-400">
                        Mutations Moteur d’État :
                      </span>
                      {turn.metricDeltas.map((d, i) => (
                        <span
                          key={i}
                          className={
                            d.delta > 0
                              ? 'text-emerald-400'
                              : d.delta < 0
                              ? 'text-amber-400'
                              : 'text-slate-400'
                          }
                        >
                          {d.metricLabel}: {d.delta > 0 ? '+' : ''}
                          {d.delta}
                          {d.unit} ({d.newValue}
                          {d.unit})
                        </span>
                      ))}
                    </div>

                    {turn.ragAssessment && (
                      <div className="flex items-start gap-2 text-xs pt-1 border-t border-slate-800/80">
                        {turn.ragAssessment.status === 'RESPECTED' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        ) : turn.ragAssessment.status === 'VIOLATED' ? (
                          <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        )}
                        <div className="text-slate-300">
                          <span className="font-medium text-white">
                            Audit RAG ({turn.ragAssessment.ruleTitle}) :{' '}
                          </span>
                          {turn.ragAssessment.explanation}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isSendingTurn && (
              <div className="p-4 bg-[#0B0F17] border border-slate-800 rounded-xl flex items-center gap-3 text-xs text-slate-300">
                <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                <span>
                  Exécution Function Calling Gemini + Calcul des transitions du
                  Moteur d’État déterministe...
                </span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Session Termination Banner OR Active Decision Console */}
          {session.status !== 'active' ? (
            <div className="p-5 bg-[#0B0F17] border-t border-slate-800 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div
                    className={`text-xs font-mono font-semibold ${
                      session.status === 'won'
                        ? 'text-emerald-400'
                        : session.status === 'lost'
                        ? 'text-red-400'
                        : 'text-blue-400'
                    }`}
                  >
                    {session.status === 'won'
                      ? '▲ OBJECTIFS STRATÉGIQUES ATTEINTS'
                      : session.status === 'lost'
                      ? '■ SEUIL CRITIQUE FRANCHI — ARRÊT DU SIMULATEUR'
                      : '● FIN DES SÉQUENCES RÉGLEMENTAIRES'}
                  </div>
                  <p className="text-sm text-slate-200 mt-1">
                    {session.statusReason}
                  </p>
                </div>
                <button
                  onClick={() => onTriggerEvaluation(session.id)}
                  disabled={isEvaluating}
                  className="px-5 py-2.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
                >
                  {isEvaluating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Génération du Rapport...
                    </>
                  ) : (
                    <>
                      Générer le Rapport de l’Agent Évaluateur
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSendTurn}
              className="p-5 bg-[#0B0F17] border-t border-slate-800 space-y-4"
            >
              {/* Deterministic Tactical Levers Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-300">
                    Leviers Tactiques Déterministes (Optionnel — combinables avec
                    votre réponse)
                  </span>
                  <span className="text-slate-500 font-mono">
                    {selectedLevers.length} sélectionné(s)
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {session.currentState.tacticalLevers.map((lever) => {
                    const isChecked = selectedLevers.includes(lever.id);
                    return (
                      <button
                        type="button"
                        key={lever.id}
                        disabled={lever.applied}
                        onClick={() => toggleLeverSelection(lever.id)}
                        className={`text-left p-3 rounded-lg border text-xs transition-colors flex items-start justify-between gap-3 ${
                          lever.applied
                            ? 'bg-slate-900/30 border-slate-800/60 text-slate-500 cursor-not-allowed'
                            : isChecked
                            ? 'bg-blue-950/50 border-blue-500 text-white'
                            : 'bg-[#111827] border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="font-medium">
                            {lever.applied ? '✓ [Déjà exécuté] ' : ''}
                            {lever.label}
                          </div>
                          <div className="text-slate-400 text-[11px]">
                            {lever.description}
                          </div>
                        </div>
                        <span className="font-mono text-[11px] text-blue-400 whitespace-nowrap shrink-0">
                          {lever.applied
                            ? 'Actif'
                            : isChecked
                            ? 'Sélectionné'
                            : 'Activer'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Suggested Quick Prompts for Fast Testing */}
              <div className="space-y-1.5">
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-blue-400" />
                  <span>Suggestions de réponses types (clic pour pré-remplir) :</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(
                    quickPromptsByScenarioId[scenario.id] ||
                    quickPromptsByModule[scenario.moduleType] ||
                    quickPromptsByModule.upskilling
                  ).map((sample, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setUserMessage(sample)}
                      className="text-left text-[11px] px-2.5 py-1.5 bg-[#111827] hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-md transition-colors truncate max-w-full"
                    >
                      Ex #{idx + 1} : « {sample.slice(0, 78)}... »
                    </button>
                  ))}
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-950/50 border border-red-800 rounded-lg text-xs text-red-300">
                  {errorMessage}
                </div>
              )}

              {/* Text Input & Send CTA */}
              <div className="flex gap-3">
                <textarea
                  rows={3}
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  placeholder="Formulez votre argumentaire, vos arbitrages chiffrés ou votre décision opérationnelle..."
                  className="flex-1 bg-[#111827] border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={isSendingTurn || !userMessage.trim()}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-medium rounded-lg transition-colors flex flex-col items-center justify-center gap-1.5 shrink-0"
                >
                  {isSendingTurn ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>Valider Tour</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* RIGHT COLUMN (5 cols): Real-Time Telemetry, RAG Playbook & JSON State Contract */}
        <div className="lg:col-span-5 flex flex-col bg-[#111827] border border-slate-800 rounded-xl overflow-hidden">
          {/* Segmented Control Tabs */}
          <div className="p-2 bg-[#0B0F17] border-b border-slate-800 flex items-center gap-1">
            <button
              onClick={() => setRightTab('telemetry')}
              className={`flex-1 py-2 px-3 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 ${
                rightTab === 'telemetry'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              Jauges KPI
            </button>
            <button
              onClick={() => setRightTab('rag')}
              className={`flex-1 py-2 px-3 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 ${
                rightTab === 'rag'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Playbook RAG
            </button>
            <button
              onClick={() => setRightTab('json')}
              className={`flex-1 py-2 px-3 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 ${
                rightTab === 'json'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              Contrat JSON
            </button>
          </div>

          {/* TAB 1: DETERMINISTIC KPI TELEMETRY */}
          {rightTab === 'telemetry' && (
            <div className="p-5 space-y-6">
              <div>
                <h2 className="text-sm font-semibold text-white font-display">
                  Télémétrie du Moteur d’État (Déterministe)
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Variables chiffrées calculées sans hallucination par le réducteur
                  TypeScript
                </p>
              </div>

              <div className="space-y-4">
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
                    <div
                      key={metric.id}
                      className="p-4 bg-[#0B0F17] border border-slate-800 rounded-xl space-y-2.5"
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-xs font-medium text-slate-200">
                          {metric.label}
                        </span>
                        <span className="text-lg font-mono font-semibold tabular-nums text-white">
                          {metric.value}
                          {metric.unit}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            isHealthy
                              ? 'bg-emerald-500'
                              : isDanger
                              ? 'bg-red-500'
                              : 'bg-blue-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-mono tabular-nums text-slate-400">
                        <span>
                          Seuil critique : {metric.criticalThreshold}
                          {metric.unit}
                        </span>
                        <span
                          className={
                            isHealthy
                              ? 'text-emerald-400'
                              : isDanger
                              ? 'text-red-400'
                              : 'text-amber-400'
                          }
                        >
                          {isHealthy
                            ? '▲ NOMINAL'
                            : isDanger
                            ? '■ CRITIQUE'
                            : '◆ SOUS CIBLE'}{' '}
                          (Cible {metric.targetThreshold}
                          {metric.unit})
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Objectives Checklist */}
              <div className="pt-4 border-t border-slate-800 space-y-2.5">
                <div className="text-xs font-semibold text-white">
                  Objectifs de Validation du Scénario
                </div>
                <ul className="space-y-2">
                  {scenario.objectives.map((obj, i) => (
                    <li
                      key={i}
                      className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed"
                    >
                      <span className="font-mono text-blue-400">0{i + 1}.</span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: RAG INTERNAL PLAYBOOK */}
          {rightTab === 'rag' && (
            <div className="p-5 space-y-4 max-h-[580px] overflow-y-auto">
              <div>
                <div className="text-xs text-blue-400 font-mono">
                  Document RAG Attaché
                </div>
                <h2 className="text-sm font-semibold text-white font-display mt-0.5">
                  {knowledgeDocument?.title || 'Référentiel Interne'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Ces segments sont injectés dynamiquement dans le contexte de
                  Gemini et vérifiés à chaque tour.
                </p>
              </div>

              <div className="space-y-3">
                {knowledgeDocument?.chunks.map((chunk) => (
                  <div
                    key={chunk.id}
                    className="p-4 bg-[#0B0F17] border border-slate-800 rounded-xl space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white">
                        {chunk.title}
                      </span>
                      <span className="font-mono text-[10px] text-slate-500">
                        {chunk.id}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {chunk.content}
                    </p>
                    <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono text-amber-400">
                      Invariant : {chunk.mandatoryRule}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: LIVE DETERMINISTIC JSON STATE INSPECTOR */}
          {rightTab === 'json' && (
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-white font-display">
                    Contrat JSON Temps Réel
                  </h2>
                  <p className="text-xs text-slate-400">
                    État immuable persisté après validation des Function Calls
                  </p>
                </div>
                <span className="text-xs font-mono text-emerald-400">
                  v{session.currentState.schemaVersion}
                </span>
              </div>
              <pre className="p-4 bg-[#0B0F17] border border-slate-800 rounded-xl text-[11px] font-mono text-slate-300 overflow-x-auto max-h-[500px] overflow-y-auto leading-relaxed">
                {JSON.stringify(session.currentState, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
