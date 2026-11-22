'use client';

import React, { useState } from 'react';
import {
  EvaluationReport,
  ScenarioDefinition,
  SimulationSession,
} from '@/lib/types';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Download,
  RotateCcw,
  FileText,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';

interface EvaluationDebriefProps {
  session: SimulationSession;
  scenario: ScenarioDefinition;
  report: EvaluationReport;
  onRestartScenario: () => void;
  onBackToCatalog: () => void;
}

export default function EvaluationDebrief({
  session,
  scenario,
  report,
  onRestartScenario,
  onBackToCatalog,
}: EvaluationDebriefProps) {
  const [selectedAxisIndex, setSelectedAxisIndex] = useState<number>(0);

  const axes =
    report.competencyRadar && report.competencyRadar.length === 5
      ? report.competencyRadar
      : [
          {
            axisId: 'finance',
            label: 'Rigueur KPI & Marge',
            score: report.overallScore,
            benchmark: 75,
            justification: 'Pilotage mesuré des indicateurs du Moteur d’État déterministe.',
          },
          {
            axisId: 'rag',
            label: 'Conformité RAG Interne',
            score: report.ragComplianceScore || 80,
            benchmark: 85,
            justification: 'Application des directives internes de l’organisation.',
          },
          {
            axisId: 'posture',
            label: 'Leadership & Assertivité',
            score: Math.min(100, report.overallScore + 4),
            benchmark: 75,
            justification: 'Capacité à maintenir une posture exécutive face au persona.',
          },
          {
            axisId: 'stress',
            label: 'Sang-froid & Timing',
            score: Math.max(40, report.overallScore - 3),
            benchmark: 70,
            justification: 'Gestion de la pression temporelle et émotionnelle.',
          },
          {
            axisId: 'impact',
            label: 'Impact Décisionnel',
            score: report.overallScore,
            benchmark: 78,
            justification: 'Pertinence des leviers tactiques activés.',
          },
        ];

  // SVG Pentagon Radar computation
  const center = 150;
  const maxRadius = 105;

  function getPoint(index: number, valueOutOf100: number) {
    const angle = (Math.PI * 2 * index) / 5 - Math.PI / 2;
    const r = (Math.max(0, Math.min(100, valueOutOf100)) / 100) * maxRadius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  }

  const scorePolygonPoints = axes
    .map((axis, i) => {
      const pt = getPoint(i, axis.score);
      return `${pt.x},${pt.y}`;
    })
    .join(' ');

  const benchmarkPolygonPoints = axes
    .map((axis, i) => {
      const pt = getPoint(i, axis.benchmark || 75);
      return `${pt.x},${pt.y}`;
    })
    .join(' ');

  const handleDownloadJsonReport = () => {
    const payload = {
      platform: 'MiraStudio B2B Assessment Report',
      scenarioTitle: scenario.title,
      moduleType: scenario.moduleType,
      sessionId: session.id,
      finalState: session.currentState,
      evaluationReport: report,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mirastudio-audit-${session.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const verdictLabel =
    report.verdict === 'CERTIFIED_EXCELLENCE'
      ? '▲ EXCELLENCE CERTIFIÉE'
      : report.verdict === 'OPERATIONAL_READINESS'
      ? '● APTITUDE OPÉRATIONNELLE VALIDÉE'
      : report.verdict === 'NEEDS_REINFORCEMENT'
      ? '◆ RENFORCEMENT RECOMMANDÉ'
      : '■ ÉCHEC CRITIQUE AUX SEUILS';

  const verdictColor =
    report.verdict === 'CERTIFIED_EXCELLENCE' ||
    report.verdict === 'OPERATIONAL_READINESS'
      ? 'text-emerald-400'
      : report.verdict === 'NEEDS_REINFORCEMENT'
      ? 'text-amber-400'
      : 'text-red-400';

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-slate-800">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Rapport de l’Agent Évaluateur</span>
            <span aria-hidden="true">·</span>
            <span>Session {session.id}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{report.modelUsed}</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-semibold text-white font-display tracking-tight">
            {scenario.title}
          </h1>
          <p className={`text-sm font-mono font-medium ${verdictColor}`}>
            {verdictLabel}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleDownloadJsonReport}
            className="px-4 py-2 text-xs font-medium text-slate-200 bg-slate-900 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            Exporter Audit JSON
          </button>
          <button
            onClick={onRestartScenario}
            className="px-4 py-2 text-xs font-medium text-slate-200 bg-slate-900 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Rejouer la Simulation
          </button>
          <button
            onClick={onBackToCatalog}
            className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors whitespace-nowrap shrink-0"
          >
            Retour au Catalogue
          </button>
        </div>
      </div>

      {/* Top Executive Metrics Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 bg-[#111827] border border-slate-800 rounded-xl">
          <div className="text-xs text-slate-400">Score Global Calibré</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-semibold font-mono tabular-nums text-white">
              {report.overallScore}
            </span>
            <span className="text-sm font-mono text-slate-400">/100</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Seuil de validation :{' '}
            <span className="font-mono tabular-nums text-slate-200">
              {scenario.evaluationRubric.passingScore}/100
            </span>
          </div>
        </div>

        <div className="p-5 bg-[#111827] border border-slate-800 rounded-xl">
          <div className="text-xs text-slate-400">Conformité Procédures RAG</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-semibold font-mono tabular-nums text-emerald-400">
              {report.ragComplianceScore}
            </span>
            <span className="text-sm font-mono text-slate-400">%</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Vérifié contre le référentiel documentaire
          </div>
        </div>

        <div className="p-5 bg-[#111827] border border-slate-800 rounded-xl">
          <div className="text-xs text-slate-400">Posture Finale du Persona</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-semibold font-mono text-blue-400">
              {session.currentState.personaState.mood}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Confiance finale :{' '}
            <span className="font-mono tabular-nums text-slate-200">
              {session.currentState.personaState.trustScore}/100
            </span>
          </div>
        </div>

        <div className="p-5 bg-[#111827] border border-slate-800 rounded-xl">
          <div className="text-xs text-slate-400">Séquences Exécutées</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-semibold font-mono tabular-nums text-white">
              {session.turnHistory.length}
            </span>
            <span className="text-sm font-mono text-slate-400">
              / {session.currentState.turn.max} tours
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Temps restant :{' '}
            <span className="font-mono tabular-nums text-slate-200">
              {Math.floor(session.currentState.turn.timeRemainingSeconds / 60)}m{' '}
              {session.currentState.turn.timeRemainingSeconds % 60}s
            </span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Split: 5-Axis Radar + Executive Summary & Final KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: SVG 5-Axis Competency Radar */}
        <div className="lg:col-span-5 p-6 bg-[#111827] border border-slate-800 rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-white font-display">
                01. Radar de Compétences (5 Axes)
              </h2>
              <span className="text-xs text-slate-400 font-mono">
                Bleu: Score · Gris: Benchmark
              </span>
            </div>

            <div className="my-4 flex items-center justify-center">
              <svg
                viewBox="0 0 300 300"
                className="w-full max-w-[290px] h-auto select-none"
              >
                {/* Concentric pentagon grids */}
                {[25, 50, 75, 100].map((level) => {
                  const pts = [0, 1, 2, 3, 4]
                    .map((i) => {
                      const pt = getPoint(i, level);
                      return `${pt.x},${pt.y}`;
                    })
                    .join(' ');
                  return (
                    <polygon
                      key={level}
                      points={pts}
                      fill="none"
                      stroke="#1E293B"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Axis spokes */}
                {[0, 1, 2, 3, 4].map((i) => {
                  const pt = getPoint(i, 100);
                  return (
                    <line
                      key={i}
                      x1={center}
                      y1={center}
                      x2={pt.x}
                      y2={pt.y}
                      stroke="#1E293B"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Benchmark polygon */}
                <polygon
                  points={benchmarkPolygonPoints}
                  fill="rgba(148, 163, 184, 0.08)"
                  stroke="#64748B"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />

                {/* Participant score polygon */}
                <polygon
                  points={scorePolygonPoints}
                  fill="rgba(59, 130, 246, 0.25)"
                  stroke="#3B82F6"
                  strokeWidth="2.5"
                />

                {/* Interactive nodes */}
                {axes.map((axis, i) => {
                  const pt = getPoint(i, axis.score);
                  const labelPt = getPoint(i, 122);
                  const isSelected = selectedAxisIndex === i;
                  return (
                    <g
                      key={axis.axisId}
                      onClick={() => setSelectedAxisIndex(i)}
                      className="cursor-pointer"
                    >
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isSelected ? 6 : 4.5}
                        fill={isSelected ? '#60A5FA' : '#3B82F6'}
                        stroke="#0B0F17"
                        strokeWidth="2"
                      />
                      <text
                        x={labelPt.x}
                        y={labelPt.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className={`text-[9px] font-mono ${
                          isSelected ? 'fill-blue-400 font-semibold' : 'fill-slate-400'
                        }`}
                      >
                        {axis.score}/100
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Axis details list */}
          <div className="space-y-2 pt-3 border-t border-slate-800">
            {axes.map((axis, idx) => (
              <button
                key={axis.axisId}
                onClick={() => setSelectedAxisIndex(idx)}
                className={`w-full text-left p-2.5 rounded-lg transition-colors ${
                  selectedAxisIndex === idx
                    ? 'bg-slate-800/90 text-white'
                    : 'hover:bg-slate-800/40 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">{axis.label}</span>
                  <span className="font-mono tabular-nums text-blue-400">
                    {axis.score}/100{' '}
                    <span className="text-slate-500">
                      (Cible {axis.benchmark || 75})
                    </span>
                  </span>
                </div>
                {selectedAxisIndex === idx && (
                  <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                    {axis.justification}
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Executive Summary, Final Deterministic KPIs & Actionable Takeaways */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="p-6 bg-[#111827] border border-slate-800 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-white font-display">
                02. Synthèse Exécutive & Diagnostic Comportemental
              </h2>
              <Award className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {report.executiveSummary}
            </p>

            {/* Final Deterministic KPI Table */}
            <div className="pt-4 border-t border-slate-800">
              <div className="text-xs font-medium text-slate-400 mb-3">
                État Final des Variables Chiffrées (Moteur Déterministe)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {session.currentState.metrics.map((metric) => {
                  const targetMet =
                    metric.direction === 'higher_is_better'
                      ? metric.value >= metric.targetThreshold
                      : metric.value <= metric.targetThreshold;
                  return (
                    <div
                      key={metric.id}
                      className="p-3 bg-[#0B0F17] border border-slate-800/80 rounded-lg"
                    >
                      <div className="text-xs text-slate-400 truncate">
                        {metric.label}
                      </div>
                      <div className="mt-1 flex items-baseline justify-between">
                        <span className="text-lg font-mono font-semibold tabular-nums text-white">
                          {metric.value}
                          {metric.unit}
                        </span>
                        <span
                          className={`text-xs font-mono ${
                            targetMet ? 'text-emerald-400' : 'text-amber-400'
                          }`}
                        >
                          {targetMet ? '▲ CIBLE OK' : `Cible: ${metric.targetThreshold}${metric.unit}`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Actionable Coaching Takeaways */}
          <div className="p-6 bg-[#111827] border border-slate-800 rounded-xl space-y-4 flex-1">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-white font-display">
                03. Plan d’Action Opérationnel & Axes de Progression
              </h2>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <ul className="space-y-3">
              {report.actionableTakeaways.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-sm text-slate-300 leading-relaxed"
                >
                  <span className="font-mono text-xs text-blue-400 mt-0.5">
                    0{index + 1}.
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Critical Moments Breakdown */}
      <div className="p-6 bg-[#111827] border border-slate-800 rounded-xl space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-white font-display">
              04. Analyse Séquentielle des Moments Critiques & Reformulations Recommandées
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Décryptage tour par tour des décisions ayant fait basculer les KPIs et la conformité RAG
            </p>
          </div>
          <FileText className="w-4 h-4 text-slate-400" />
        </div>

        <div className="space-y-4">
          {report.criticalMoments.map((moment, idx) => {
            const isPositive = moment.impactType === 'POSITIVE_BREAKTHROUGH';
            const isError = moment.impactType === 'CRITICAL_ERROR';
            return (
              <div
                key={idx}
                className="p-5 bg-[#0B0F17] border border-slate-800 rounded-xl space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs">
                    {isPositive ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : isError ? (
                      <XCircle className="w-4 h-4 text-red-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    )}
                    <span className="font-mono font-semibold text-white">
                      Tour #{moment.turnNumber}
                    </span>
                    <span aria-hidden="true" className="text-slate-600">
                      ·
                    </span>
                    <span
                      className={`font-mono ${
                        isPositive
                          ? 'text-emerald-400'
                          : isError
                          ? 'text-red-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {isPositive
                        ? '▲ LEVIER DÉCISIF'
                        : isError
                        ? '■ ERREUR CRITIQUE'
                        : '◆ OPPORTUNITÉ MANQUÉE'}
                    </span>
                  </div>
                  <span className="text-xs font-mono tabular-nums text-slate-400">
                    Impact KPI : {moment.kpiImpactSummary}
                  </span>
                </div>

                <div className="p-3 bg-slate-900/80 border border-slate-800/80 rounded-lg text-xs text-slate-300 italic">
                  « {moment.userQuote} »
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div>
                    <div className="text-xs font-medium text-slate-400 mb-1">
                      Diagnostic de l’Agent Évaluateur
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {moment.analysis}
                    </p>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-blue-400 mb-1 flex items-center gap-1">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      Formulation / Arbitrage Recommandé
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {moment.recommendedAlternative}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
