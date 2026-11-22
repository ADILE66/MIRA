'use client';

import React, { useState } from 'react';
import {
  EvaluationReport,
  ScenarioDefinition,
  SimulationSession,
} from '@/lib/types';
import {
  Download,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface EvaluationDebriefProps {
  session: SimulationSession;
  scenario: ScenarioDefinition;
  report: EvaluationReport;
  onRestartScenario: () => void;
  onBackToCatalog: () => void;
  availableEvaluations?: Array<{
    session: SimulationSession;
    scenario: ScenarioDefinition;
    report: EvaluationReport;
    candidateName: string;
  }>;
  onSelectEvaluation?: (
    session: SimulationSession,
    scenario: ScenarioDefinition,
    report: EvaluationReport
  ) => void;
}

export default function EvaluationDebrief({
  session,
  scenario,
  report,
  onRestartScenario,
  onBackToCatalog,
  availableEvaluations,
  onSelectEvaluation,
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

  const verdictBadgeClass =
    report.verdict === 'CERTIFIED_EXCELLENCE' ||
    report.verdict === 'OPERATIONAL_READINESS'
      ? 'bg-success-container text-on-success-container border-success/30'
      : report.verdict === 'NEEDS_REINFORCEMENT'
      ? 'bg-warning-container text-on-warning-container border-warning/30'
      : 'bg-light-error-container text-light-error border-light-error/30';

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 bg-light-surface text-light-on-surface">
      {/* Assessment Campaign / Evaluation Selector Bar */}
      {availableEvaluations && availableEvaluations.length > 1 && (
        <div className="p-3 bg-light-surface-container-low border border-light-outline-variant rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-light-primary">
            <ShieldCheck className="w-4 h-4 text-light-primary" />
            <span>CENTRE D’ÉVALUATION · BILANS CERTIFIÉS DISPONIBLES :</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {availableEvaluations.map((item) => {
              const isCurrent = item.session.id === session.id;
              return (
                <button
                  key={item.session.id}
                  onClick={() =>
                    onSelectEvaluation &&
                    onSelectEvaluation(item.session, item.scenario, item.report)
                  }
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 shadow-2xs ${
                    isCurrent
                      ? 'bg-light-primary text-white shadow-xs'
                      : 'bg-light-surface-container-lowest text-light-on-surface-variant hover:text-light-on-surface hover:bg-light-surface-container border border-light-outline-variant'
                  }`}
                >
                  <span>{item.candidateName}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                      isCurrent
                        ? 'bg-white/20 text-white'
                        : 'bg-light-surface-container text-light-primary'
                    }`}
                  >
                    {item.report.overallScore}/100
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Header Bar — Stitch Report Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-light-outline-variant">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-light-on-surface-variant font-medium">
            <span className="font-bold text-light-primary">Rapport de l’Agent Évaluateur</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">Session #{session.id.slice(0, 8)}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{report.modelUsed}</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl lg:text-3xl font-bold text-light-on-surface font-headline tracking-tight">
              {scenario.title}
            </h1>
            <span className={`px-3 py-1 rounded-full border text-xs font-mono font-bold ${verdictBadgeClass}`}>
              {verdictLabel}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleDownloadJsonReport}
            className="px-4 py-2 text-xs font-semibold text-light-on-surface bg-light-surface-container-lowest border border-light-outline-variant rounded hover:bg-light-surface-container transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exporter Audit JSON</span>
          </button>
          <button
            onClick={onRestartScenario}
            className="px-4 py-2 text-xs font-semibold text-light-on-surface bg-light-surface-container-lowest border border-light-outline-variant rounded hover:bg-light-surface-container transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Rejouer la Simulation</span>
          </button>
          <button
            onClick={onBackToCatalog}
            className="px-4 py-2 text-xs font-bold text-light-on-primary bg-light-primary rounded hover:bg-light-primary-container transition-colors whitespace-nowrap shrink-0 shadow-xs cursor-pointer"
          >
            Retour au Catalogue
          </button>
        </div>
      </div>

      {/* Top Executive Metrics Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 bg-light-surface-container-lowest border border-light-outline-variant rounded-xl shadow-xs space-y-1">
          <div className="text-xs font-semibold text-light-on-surface-variant">Score Global Calibré</div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-bold font-mono tabular-nums text-light-on-surface font-headline">
              {report.overallScore}
            </span>
            <span className="text-xs font-mono text-light-on-surface-variant">/ 100</span>
          </div>
          <div className="text-[11px] text-light-on-surface-variant pt-1 font-mono">
            Seuil validation : {scenario.evaluationRubric.passingScore}/100
          </div>
        </div>

        <div className="p-5 bg-light-surface-container-lowest border border-light-outline-variant rounded-xl shadow-xs space-y-1">
          <div className="text-xs font-semibold text-light-on-surface-variant">Conformité Procédures RAG</div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-bold font-mono tabular-nums text-success font-headline">
              {report.ragComplianceScore}
            </span>
            <span className="text-xs font-mono text-light-on-surface-variant">%</span>
          </div>
          <div className="text-[11px] text-light-on-surface-variant pt-1">
            Vérifié contre le référentiel interne
          </div>
        </div>

        <div className="p-5 bg-light-surface-container-lowest border border-light-outline-variant rounded-xl shadow-xs space-y-1">
          <div className="text-xs font-semibold text-light-on-surface-variant">Posture Finale du Persona</div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-light-primary font-headline">
              {session.currentState.personaState.mood}
            </span>
          </div>
          <div className="text-[11px] text-light-on-surface-variant pt-1 font-mono">
            Confiance finale : {session.currentState.personaState.trustScore} %
          </div>
        </div>

        <div className="p-5 bg-light-surface-container-lowest border border-light-outline-variant rounded-xl shadow-xs space-y-1">
          <div className="text-xs font-semibold text-light-on-surface-variant">Séquences Exécutées</div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-bold font-mono tabular-nums text-light-on-surface font-headline">
              {session.turnHistory.length}
            </span>
            <span className="text-xs font-mono text-light-on-surface-variant">/ {session.currentState.turn.max} tours</span>
          </div>
          <div className="text-[11px] text-light-on-surface-variant pt-1 font-mono">
            Temps restant : {Math.floor(session.currentState.turn.timeRemainingSeconds / 60)}m {session.currentState.turn.timeRemainingSeconds % 60}s
          </div>
        </div>
      </div>

      {/* Main 2-Column Split: 5-Axis Radar + Executive Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: SVG 5-Axis Competency Radar */}
        <div className="lg:col-span-5 p-6 bg-light-surface-container-lowest border border-light-outline-variant rounded-xl shadow-xs flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between border-b border-light-outline-variant pb-3">
              <h2 className="text-base font-bold text-light-on-surface font-headline">
                01. Radar de Compétences (5 Axes)
              </h2>
              <span className="text-xs text-light-on-surface-variant font-mono">
                Cobalt: Candidat · Gris: Benchmark
              </span>
            </div>

            <div className="my-4 flex items-center justify-center">
              <svg
                viewBox="0 0 300 300"
                className="w-full max-w-[280px] h-auto select-none"
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
                      stroke="#C4C6D3"
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
                      stroke="#C4C6D3"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Benchmark polygon */}
                <polygon
                  points={benchmarkPolygonPoints}
                  fill="rgba(82, 93, 128, 0.08)"
                  stroke="#747783"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />

                {/* Participant score polygon */}
                <polygon
                  points={scorePolygonPoints}
                  fill="rgba(0, 44, 118, 0.2)"
                  stroke="#002C76"
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
                        fill={isSelected ? '#1B4396' : '#002C76'}
                        stroke="#FAF8FF"
                        strokeWidth="2"
                      />
                      <text
                        x={labelPt.x}
                        y={labelPt.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className={`text-[9px] font-mono font-bold ${
                          isSelected ? 'fill-light-primary font-bold' : 'fill-light-on-surface-variant'
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
          <div className="space-y-2 pt-3 border-t border-light-outline-variant">
            {axes.map((axis, idx) => (
              <button
                key={axis.axisId}
                onClick={() => setSelectedAxisIndex(idx)}
                className={`w-full text-left p-2.5 rounded transition-colors cursor-pointer ${
                  selectedAxisIndex === idx
                    ? 'bg-light-secondary-container text-light-on-secondary-container font-semibold shadow-xs'
                    : 'hover:bg-light-surface-container text-light-on-surface-variant'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span>{axis.label}</span>
                  <span className="font-mono tabular-nums font-bold">
                    {axis.score}/100 <span className="text-light-on-surface-variant font-normal">(Cible {axis.benchmark || 75})</span>
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Executive Summary & Actionable Takeaways */}
        <div className="lg:col-span-7 p-6 bg-light-surface-container-lowest border border-light-outline-variant rounded-xl shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-light-outline-variant pb-3">
              <h2 className="text-base font-bold text-light-on-surface font-headline">
                02. Synthèse Exécutive & Justification de l'Axe Sélectionné
              </h2>
              <ShieldCheck className="w-4 h-4 text-light-primary" />
            </div>

            <div className="p-4 bg-light-surface-container-low border border-light-outline-variant rounded-lg space-y-2">
              <span className="text-xs font-bold text-light-primary font-headline uppercase">
                Avis sur l'axe : {axes[selectedAxisIndex]?.label}
              </span>
              <p className="text-xs text-light-on-surface leading-relaxed">
                {axes[selectedAxisIndex]?.justification}
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-light-on-surface font-headline">
                Note de Cadrage pour la Direction :
              </span>
              <p className="text-xs text-light-on-surface-variant leading-relaxed p-4 bg-light-surface-container-low border border-light-outline-variant rounded-lg">
                {report.executiveSummary}
              </p>
            </div>
          </div>

          {/* Actionable Takeaways Strip */}
          <div className="space-y-3 pt-3 border-t border-light-outline-variant">
            <span className="text-xs font-bold text-light-on-surface font-headline flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-success" />
              <span>Axes d'amélioration prioritaires pour les prochaines simulations :</span>
            </span>
            <div className="space-y-2">
              {report.actionableTakeaways.map((takeaway, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-light-surface-container-low border border-light-outline-variant rounded-lg text-xs text-light-on-surface leading-relaxed flex items-start gap-2.5"
                >
                  <span className="font-mono text-light-primary font-bold">0{idx + 1}.</span>
                  <span>{takeaway}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Critical Moments Analysis Section */}
      <div className="p-6 bg-light-surface-container-lowest border border-light-outline-variant rounded-xl shadow-xs space-y-5">
        <div className="border-b border-light-outline-variant pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-light-on-surface font-headline">
              03. Analyse des Moments Critiques & Citations Exactes
            </h2>
            <p className="text-xs text-light-on-surface-variant mt-0.5">
              Confrontation de vos répliques aux règles documentaires et solutions idéales
            </p>
          </div>
          <span className="font-mono text-xs text-light-on-surface-variant font-medium">
            {report.criticalMoments.length} moments audités
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.criticalMoments.map((moment, idx) => (
            <div
              key={idx}
              className="p-4 bg-light-surface-container-low border border-light-outline-variant rounded-lg space-y-3"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-light-primary px-2 py-0.5 rounded bg-light-secondary-container">
                  Tour #{moment.turnNumber}
                </span>
                <span
                  className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                    moment.impactType === 'POSITIVE_BREAKTHROUGH'
                      ? 'bg-success-container text-on-success-container'
                      : moment.impactType === 'CRITICAL_ERROR'
                      ? 'bg-light-error-container text-light-error'
                      : 'bg-warning-container text-on-warning-container'
                  }`}
                >
                  {moment.impactType === 'POSITIVE_BREAKTHROUGH'
                    ? '▲ SUCCÈS TACTIQUE'
                    : moment.impactType === 'CRITICAL_ERROR'
                    ? '■ ERREUR CRITIQUE'
                    : '◆ OPPORTUNITÉ MANQUÉE'}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-light-on-surface-variant font-medium">Citation du joueur :</span>
                <p className="text-xs font-mono p-2.5 bg-light-surface-container-lowest border border-light-outline-variant rounded text-light-on-surface">
                  « {moment.userQuote} »
                </p>
              </div>

              <p className="text-xs text-light-on-surface-variant leading-relaxed">
                {moment.analysis}
              </p>

              <div className="p-3 bg-success-container/30 border border-success/30 rounded text-xs space-y-1">
                <span className="font-bold text-on-success-container font-headline">
                  Reformulation Idéale Conseillée :
                </span>
                <p className="text-on-success-container leading-relaxed">
                  « {moment.recommendedAlternative} »
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
