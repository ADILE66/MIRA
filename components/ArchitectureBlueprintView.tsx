'use client';

import React, { useState } from 'react';
import {
  Database,
  Cpu,
  Shield,
  Check,
  Copy,
  Layers,
  Building2,
} from 'lucide-react';
import { OrganizationTenant, UserProfile } from '@/lib/types';

interface ArchitectureBlueprintViewProps {
  postgresSchemaDdl: string;
  organizations: OrganizationTenant[];
  users: UserProfile[];
  activeOrg: OrganizationTenant;
  onSelectOrg: (org: OrganizationTenant) => void;
}

export default function ArchitectureBlueprintView({
  postgresSchemaDdl,
  organizations,
  users,
  activeOrg,
  onSelectOrg,
}: ArchitectureBlueprintViewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopySql = () => {
    navigator.clipboard.writeText(postgresSchemaDdl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <div className="border-b border-slate-800 pb-6">
        <div className="text-xs text-blue-400 font-mono">
          Architecture Système & Gouvernance Multi-Tenant B2B
        </div>
        <h1 className="text-2xl lg:text-3xl font-semibold text-white font-display mt-1">
          Séparation Moteur d’État Déterministe, Routage Gemini & Schéma PostgreSQL
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          Spécifications techniques complètes garantissant zéro hallucination
          chiffrée, une isolation multi-tenant (PME/ETI, DRH et Cabinets en
          Marque Blanche) et une optimisation des Unit Economics IA.
        </p>
      </div>

      {/* Multi-Tenant White-Label Switcher Demo */}
      <div className="p-6 bg-[#111827] border border-slate-800 rounded-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-white font-display flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-400" />
              01. Simulation Multi-Tenant & Mode Marque Blanche
            </h2>
            <p className="text-xs text-slate-400">
              Basculez entre une ETI cliente directe et un Cabinet de Conseil /
              Grande École opérant en Marque Blanche.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {organizations.map((org) => {
              const isSelected = org.id === activeOrg.id;
              return (
                <button
                  key={org.id}
                  onClick={() => onSelectOrg(org)}
                  className={`px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-[#0B0F17] border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {org.name} ({org.planTier})
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {users.map((u) => (
            <div
              key={u.id}
              className="p-4 bg-[#0B0F17] border border-slate-800 rounded-lg space-y-1"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">{u.name}</span>
                <span className="font-mono text-blue-400">{u.role}</span>
              </div>
              <div className="text-xs text-slate-400 font-mono">{u.email}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 3 Pillars of the Hybrid Engine & Unit Economics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-[#111827] border border-slate-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-blue-400">PILIER 01</span>
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
          <h3 className="text-base font-semibold text-white font-display">
            Moteur d’État Déterministe (JSON)
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Réducteur TypeScript pur (`lib/state-engine.ts`) qui encapsule les
            variables financières (ARR, Trésorerie, Marge EBITDA, Churn) et
            applique des plafonds stricts aux deltas proposés par l’IA. Aucune
            hallucination arithmétique possible.
          </p>
        </div>

        <div className="p-6 bg-[#111827] border border-slate-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-emerald-400">PILIER 02</span>
            <Cpu className="w-4 h-4 text-emerald-400" />
          </div>
          <h3 className="text-base font-semibold text-white font-display">
            Routage Gemini & Function Calling
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Optimisation des Unit Economics B2B : les dialogues en temps réel
            utilisent <code className="text-emerald-300">gemini-2.5-flash (Production)</code>{' '}
            avec l’outil structuré{' '}
            <code className="text-emerald-300">recordSimulationTurnImpact</code>.
            L’évaluation finale et le Studio utilisent{' '}
            <code className="text-emerald-300">responseSchema</code>.
          </p>
        </div>

        <div className="p-6 bg-[#111827] border border-slate-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-amber-400">PILIER 03</span>
            <Shield className="w-4 h-4 text-amber-400" />
          </div>
          <h3 className="text-base font-semibold text-white font-display">
            Audit RAG en Temps Réel
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            À chaque tour, le moteur RAG extrait les clauses pertinentes des
            documents internes de l’entreprise et oblige Gemini à qualifier la
            conformité (<code className="text-amber-300">RESPECTED</code> ou{' '}
            <code className="text-amber-300">VIOLATED</code>) avec preuve
            explicite.
          </p>
        </div>
      </div>

      {/* PostgreSQL / Drizzle Multi-Tenant DDL Viewer */}
      <div className="p-6 bg-[#111827] border border-slate-800 rounded-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-white font-display flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-400" />
              02. Schéma Relationnel Multi-Tenant PostgreSQL / Supabase / Drizzle ORM
            </h2>
            <p className="text-xs text-slate-400">
              Script SQL complet prêt pour le déploiement en production avec
              stockage JSONB hybride du Moteur d’État.
            </p>
          </div>
          <button
            onClick={handleCopySql}
            className="px-3.5 py-2 text-xs font-medium text-slate-200 bg-[#0B0F17] border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Copié dans le presse-papiers
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copier le DDL PostgreSQL
              </>
            )}
          </button>
        </div>

        <pre className="p-5 bg-[#0B0F17] border border-slate-800 rounded-xl text-xs font-mono text-slate-300 overflow-x-auto max-h-[420px] overflow-y-auto leading-relaxed">
          {postgresSchemaDdl}
        </pre>
      </div>
    </div>
  );
}
