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
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 bg-light-surface text-light-on-surface">
      <div className="border-b border-light-outline-variant pb-6">
        <div className="text-xs text-light-primary font-mono font-bold">
          Architecture Système & Gouvernance Multi-Tenant B2B
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-light-on-surface font-headline mt-1">
          Séparation Moteur d’État Déterministe, Routage Gemini & Schéma PostgreSQL
        </h1>
        <p className="text-sm text-light-on-surface-variant mt-1 max-w-3xl leading-relaxed">
          Spécifications techniques complètes garantissant zéro hallucination
          chiffrée, une isolation multi-tenant (PME/ETI, DRH et Cabinets en
          Marque Blanche) et une optimisation des Unit Economics IA.
        </p>
      </div>

      {/* Multi-Tenant White-Label Switcher Demo */}
      <div className="p-6 bg-light-surface-container-lowest border border-light-outline-variant rounded-xl shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-light-on-surface font-headline flex items-center gap-2">
              <Building2 className="w-4 h-4 text-light-primary" />
              <span>01. Simulation Multi-Tenant & Mode Marque Blanche</span>
            </h2>
            <p className="text-xs text-light-on-surface-variant">
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
                  className={`px-3.5 py-2 text-xs font-semibold rounded border transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs ${
                    isSelected
                      ? 'bg-light-primary border-light-primary text-light-on-primary'
                      : 'bg-light-surface-container-low border-light-outline-variant text-light-on-surface hover:border-light-outline'
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
              className="p-4 bg-light-surface-container-low border border-light-outline-variant rounded-lg space-y-1"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-light-on-surface">{u.name}</span>
                <span className="font-mono text-light-primary font-semibold">{u.role}</span>
              </div>
              <div className="text-xs text-light-on-surface-variant font-mono">{u.email}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 3 Pillars of the Hybrid Engine & Unit Economics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-light-surface-container-lowest border border-light-outline-variant rounded-xl shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-light-primary">PILIER 01</span>
            <Layers className="w-4 h-4 text-light-primary" />
          </div>
          <h3 className="text-base font-bold text-light-on-surface font-headline">
            Moteur d’État Déterministe (JSON)
          </h3>
          <p className="text-xs text-light-on-surface-variant leading-relaxed">
            Réducteur TypeScript pur (`lib/state-engine.ts`) qui encapsule les
            variables financières (ARR, Trésorerie, Marge EBITDA, Churn) et
            applique des plafonds stricts aux deltas proposés par l’IA. Aucune
            hallucination arithmétique possible.
          </p>
        </div>

        <div className="p-6 bg-light-surface-container-lowest border border-light-outline-variant rounded-xl shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-success">PILIER 02</span>
            <Cpu className="w-4 h-4 text-success" />
          </div>
          <h3 className="text-base font-bold text-light-on-surface font-headline">
            Routage Gemini & Function Calling
          </h3>
          <p className="text-xs text-light-on-surface-variant leading-relaxed">
            Optimisation des Unit Economics B2B : les dialogues en temps réel
            utilisent <code className="text-light-primary font-mono font-semibold">gemini-2.5-flash</code>{' '}
            avec l’outil structuré{' '}
            <code className="text-light-primary font-mono font-semibold">recordSimulationTurnImpact</code>.
            L’évaluation finale et le Studio utilisent{' '}
            <code className="text-light-primary font-mono font-semibold">responseSchema</code>.
          </p>
        </div>

        <div className="p-6 bg-light-surface-container-lowest border border-light-outline-variant rounded-xl shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-warning">PILIER 03</span>
            <Shield className="w-4 h-4 text-warning" />
          </div>
          <h3 className="text-base font-bold text-light-on-surface font-headline">
            Audit RAG en Temps Réel
          </h3>
          <p className="text-xs text-light-on-surface-variant leading-relaxed">
            À chaque tour, le moteur RAG extrait les clauses pertinentes des
            documents internes de l’entreprise et oblige Gemini à qualifier la
            conformité (<code className="text-success font-mono font-bold">RESPECTED</code> ou{' '}
            <code className="text-light-error font-mono font-bold">VIOLATED</code>) avec preuve
            explicite.
          </p>
        </div>
      </div>

      {/* PostgreSQL / Drizzle Multi-Tenant DDL Viewer */}
      <div className="p-6 bg-light-surface-container-lowest border border-light-outline-variant rounded-xl shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-light-on-surface font-headline flex items-center gap-2">
              <Database className="w-4 h-4 text-light-primary" />
              <span>02. Schéma Relationnel Multi-Tenant PostgreSQL / Drizzle ORM (Isolation RLS)</span>
            </h2>
            <p className="text-xs text-light-on-surface-variant">
              Script SQL complet prêt pour le déploiement en production avec
              stockage JSONB hybride du Moteur d’État.
            </p>
          </div>
          <button
            onClick={handleCopySql}
            className="px-3.5 py-2 text-xs font-semibold text-light-on-surface bg-light-surface-container-low border border-light-outline-variant rounded hover:bg-light-surface-container transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-success" />
                <span>Copié dans le presse-papiers</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copier le DDL PostgreSQL</span>
              </>
            )}
          </button>
        </div>

        <pre className="p-5 bg-light-surface-container-low border border-light-outline-variant rounded-lg text-xs font-mono text-light-on-surface overflow-x-auto max-h-[420px] overflow-y-auto leading-relaxed">
          {postgresSchemaDdl}
        </pre>
      </div>
    </div>
  );
}
