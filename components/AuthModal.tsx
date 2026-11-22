'use client';

import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  Building,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  Briefcase,
  KeyRound,
  Sparkles,
} from 'lucide-react';
import { UserProfile, OrganizationTenant } from '@/lib/types';
import { DEMO_ENTERPRISE_PERSONAS, DemoEnterprisePersona } from '@/lib/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserProfile, organization: OrganizationTenant) => void;
  initialMode?: 'login' | 'register';
  targetFeatureLabel?: string;
}

export default function AuthModal({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'login',
  targetFeatureLabel,
}: AuthModalProps) {
  const [tab, setTab] = useState<'login' | 'register'>(initialMode);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Persona quick login loading state
  const [loadingPersonaId, setLoadingPersonaId] = useState<string | null>(null);

  // Register form state
  const [regOrgName, setRegOrgName] = useState('');
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regSector, setRegSector] = useState('ETI Marocaine & Grands Comptes');
  const [regRole, setRegRole] = useState<UserProfile['role']>('Directeur Commercial');
  const [regPlanTier, setRegPlanTier] = useState<'Enterprise' | 'WhiteLabel' | 'Growth'>('Enterprise');
  const [isSubmittingRegister, setIsSubmittingRegister] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registerSuccess, setRegisterSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handler: Standard Login
  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsSubmittingLogin(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Échec de connexion');
      }

      onAuthSuccess(data.user, data.organization);
      onClose();
    } catch (err: unknown) {
      setLoginError(err instanceof Error ? err.message : 'Erreur de connexion');
    } finally {
      setIsSubmittingLogin(false);
    }
  };

  // Handler: 1-Click Persona Login
  const handlePersonaLogin = async (persona: DemoEnterprisePersona) => {
    setLoginError(null);
    setLoadingPersonaId(persona.id);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ personaId: persona.id }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Échec de connexion au persona');
      }

      onAuthSuccess(data.user, data.organization);
      onClose();
    } catch (err: unknown) {
      setLoginError(err instanceof Error ? err.message : 'Erreur de connexion');
    } finally {
      setLoadingPersonaId(null);
    }
  };

  // Handler: Register New Enterprise Organization
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError(null);
    setRegisterSuccess(null);
    setIsSubmittingRegister(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationName: regOrgName,
          fullName: regFullName,
          email: regEmail,
          password: regPassword,
          sector: regSector,
          role: regRole,
          planTier: regPlanTier,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Échec de création de l'espace");
      }

      setRegisterSuccess(data.message);
      setTimeout(() => {
        onAuthSuccess(data.user, data.organization);
        onClose();
      }, 700);
    } catch (err: unknown) {
      setRegisterError(err instanceof Error ? err.message : "Erreur lors de l'inscription");
    } finally {
      setIsSubmittingRegister(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-light-surface-container-lowest rounded-xl shadow-2xl border border-light-outline-variant overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 py-4 bg-light-surface-container-low border-b border-light-outline-variant flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-light-primary text-light-on-primary flex items-center justify-center font-bold text-sm shadow-xs">
              <span className="material-symbols-outlined text-lg" aria-hidden="true">
                lock
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-light-on-surface font-headline tracking-tight">
                  Authentification Entreprise MiraStudio
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-light-secondary-container text-light-on-secondary-container font-mono text-[10px] font-semibold">
                  Multi-Tenant B2B
                </span>
              </div>
              <p className="text-xs text-light-on-surface-variant">
                {targetFeatureLabel
                  ? `Connexion requise pour accéder à : ${targetFeatureLabel}`
                  : 'Accédez à votre cockpit de simulation ou déployez votre tenant dédié'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-light-on-surface-variant hover:text-light-on-surface hover:bg-light-surface-container transition-colors cursor-pointer"
            aria-label="Fermer la modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-light-outline-variant bg-light-surface-container-lowest px-6 pt-3 gap-6 shrink-0">
          <button
            onClick={() => setTab('login')}
            className={`pb-3 text-xs font-bold transition-all relative cursor-pointer flex items-center gap-2 ${
              tab === 'login'
                ? 'text-light-primary border-b-2 border-light-primary'
                : 'text-light-on-surface-variant hover:text-light-on-surface'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Connexion & Personas Démo</span>
          </button>

          <button
            onClick={() => setTab('register')}
            className={`pb-3 text-xs font-bold transition-all relative cursor-pointer flex items-center gap-2 ${
              tab === 'register'
                ? 'text-light-primary border-b-2 border-light-primary'
                : 'text-light-on-surface-variant hover:text-light-on-surface'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Créer un Espace Entreprise (Tenant)</span>
          </button>
        </div>

        {/* Content Body (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: LOGIN */}
          {tab === 'login' && (
            <div className="space-y-6">
              {loginError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* QUICK DEMO PERSONAS CARDS */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-light-on-surface-variant flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-light-primary" />
                    <span>Connexion Rapide Démo (1-Clic sans mot de passe)</span>
                  </label>
                  <span className="text-[11px] text-light-on-surface-variant font-mono">
                    4 Personas B2B
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {DEMO_ENTERPRISE_PERSONAS.map((persona) => {
                    const isLoading = loadingPersonaId === persona.id;
                    return (
                      <button
                        key={persona.id}
                        type="button"
                        onClick={() => handlePersonaLogin(persona)}
                        disabled={loadingPersonaId !== null}
                        className="text-left p-3.5 rounded-lg border border-light-outline-variant bg-light-surface-container-low hover:bg-light-surface-container hover:border-light-primary transition-all group cursor-pointer relative flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-light-primary text-light-on-primary font-bold text-xs flex items-center justify-center shrink-0">
                                {persona.avatarText}
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-xs font-bold text-light-on-surface truncate group-hover:text-light-primary transition-colors">
                                  {persona.name}
                                </h4>
                                <p className="text-[10px] text-light-on-surface-variant font-mono truncate">
                                  {persona.email}
                                </p>
                              </div>
                            </div>
                            <span
                              className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border whitespace-nowrap shrink-0 ${persona.badgeColor}`}
                            >
                              {persona.role}
                            </span>
                          </div>

                          <p className="text-[11px] text-light-on-surface-variant line-clamp-2 leading-snug">
                            {persona.description}
                          </p>
                        </div>

                        <div className="mt-3 pt-2 border-t border-light-outline-variant/60 flex items-center justify-between text-[11px]">
                          <span className="text-light-on-surface-variant text-[10px] truncate max-w-[170px]">
                            {persona.organizationName.split(' (')[0]}
                          </span>
                          <span className="text-light-primary font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                            {isLoading ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <>
                                <span>Activer</span>
                                <ArrowRight className="w-3 h-3" />
                              </>
                            )}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* DIVIDER */}
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-light-outline-variant"></div>
                </div>
                <div className="relative px-3 bg-light-surface-container-lowest text-[11px] font-semibold uppercase tracking-wider text-light-on-surface-variant">
                  Ou connexion par identifiants B2B
                </div>
              </div>

              {/* STANDARD FORM */}
              <form onSubmit={handleStandardLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-light-on-surface flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-light-on-surface-variant" />
                    <span>Email professionnel</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="ex: y.berrada@atlastech.ma"
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-light-outline-variant bg-light-surface-container-lowest text-light-on-surface focus:outline-none focus:ring-2 focus:ring-light-primary focus:border-transparent"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-light-on-surface flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-light-on-surface-variant" />
                      <span>Mot de passe</span>
                    </label>
                    <span className="text-[11px] text-light-on-surface-variant">
                      Démo : <code className="bg-light-surface-container px-1 py-0.5 rounded font-mono">Atlas2026!</code>
                    </span>
                  </div>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-light-outline-variant bg-light-surface-container-lowest text-light-on-surface focus:outline-none focus:ring-2 focus:ring-light-primary focus:border-transparent"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-light-on-surface-variant">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Session sécurisée JWT & RLS</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingLogin}
                    className="px-5 py-2 text-xs font-semibold text-light-on-primary bg-light-primary hover:bg-light-primary-container rounded transition-colors flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    {isSubmittingLogin ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Vérification...</span>
                      </>
                    ) : (
                      <>
                        <span>Se connecter</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: REGISTER */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              {registerError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{registerError}</span>
                </div>
              )}

              {registerSuccess && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{registerSuccess}</span>
                </div>
              )}

              <div className="p-3.5 rounded-lg bg-blue-50/70 border border-blue-200/80 text-blue-900 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Provisionnement Automatique d&apos;un Tenant Isolé (RLS)</span>
                </div>
                <p className="text-[11px] text-blue-800/90 leading-relaxed">
                  Votre espace d&apos;entreprise est créé avec sa propre base documentaire RAG, ses scénarios dédiés et son cloisonnement PostgreSQL conforme à la CNDP 09-08 et DGSSI.
                </p>
              </div>

              {/* Organization Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-light-on-surface flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-light-on-surface-variant" />
                    <span>Nom de votre Organisation / ETI *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={regOrgName}
                    onChange={(e) => setRegOrgName(e.target.value)}
                    placeholder="ex: Attijariwafa Bank - Dir. Formation"
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-light-outline-variant bg-light-surface-container-lowest text-light-on-surface focus:outline-none focus:ring-2 focus:ring-light-primary focus:border-transparent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-light-on-surface flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-light-on-surface-variant" />
                    <span>Secteur d&apos;activité</span>
                  </label>
                  <select
                    value={regSector}
                    onChange={(e) => setRegSector(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-light-outline-variant bg-light-surface-container-lowest text-light-on-surface focus:outline-none focus:ring-2 focus:ring-light-primary focus:border-transparent"
                  >
                    <option value="Banque, Finance & Assurance">Banque, Finance & Assurance</option>
                    <option value="Industrie, Aéronautique & Automobile">Industrie, Aéronautique & Automobile (Tanger Med)</option>
                    <option value="Télécoms & Cloud Souverain">Télécoms & Cloud Souverain</option>
                    <option value="Conseil, ESN & Business School">Conseil, ESN & Business School</option>
                    <option value="Grande Distribution & Logistique">Grande Distribution & Logistique</option>
                    <option value="Santé & Pharma">Santé & Pharma</option>
                    <option value="Secteur Public & Semi-Public">Secteur Public & Collectivités</option>
                  </select>
                </div>
              </div>

              {/* User Admin Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-light-on-surface flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-light-on-surface-variant" />
                    <span>Nom & Prénom de l&apos;Administrateur *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="ex: Driss Benjelloun"
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-light-outline-variant bg-light-surface-container-lowest text-light-on-surface focus:outline-none focus:ring-2 focus:ring-light-primary focus:border-transparent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-light-on-surface flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-light-on-surface-variant" />
                    <span>Email professionnel *</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="ex: d.benjelloun@entreprise.ma"
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-light-outline-variant bg-light-surface-container-lowest text-light-on-surface focus:outline-none focus:ring-2 focus:ring-light-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Password & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-light-on-surface flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-light-on-surface-variant" />
                    <span>Mot de passe sécurisé (min. 6 caract.) *</span>
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-light-outline-variant bg-light-surface-container-lowest text-light-on-surface focus:outline-none focus:ring-2 focus:ring-light-primary focus:border-transparent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-light-on-surface flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-light-on-surface-variant" />
                    <span>Rôle initial</span>
                  </label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as UserProfile['role'])}
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-light-outline-variant bg-light-surface-container-lowest text-light-on-surface focus:outline-none focus:ring-2 focus:ring-light-primary focus:border-transparent"
                  >
                    <option value="Directeur Commercial">Directeur Commercial / Ventes</option>
                    <option value="DRH / Talent Lead">DRH / Talent Lead (Éligible GIAC/OFPPT)</option>
                    <option value="Consultant / Coach">Consultant / Coach / Business School</option>
                    <option value="Candidat / Apprenant">Candidat / Apprenant</option>
                  </select>
                </div>
              </div>

              {/* Plan Tier Selection */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-semibold text-light-on-surface">
                  Formule d&apos;hébergement souhaitée
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'Growth', label: 'Starter ETI', desc: '1-50 users' },
                    { id: 'Enterprise', label: 'Business & ETI', desc: 'Souverain RLS' },
                    { id: 'WhiteLabel', label: 'Marque Blanche', desc: 'Domaine dédié' },
                  ].map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setRegPlanTier(tier.id as 'Enterprise' | 'WhiteLabel' | 'Growth')}
                      className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                        regPlanTier === tier.id
                          ? 'border-light-primary bg-light-secondary-container/30 text-light-primary font-bold shadow-xs'
                          : 'border-light-outline-variant bg-light-surface-container-low text-light-on-surface hover:bg-light-surface-container'
                      }`}
                    >
                      <div className="text-xs">{tier.label}</div>
                      <div className="text-[10px] text-light-on-surface-variant font-normal">
                        {tier.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Moroccan Compliance Badge */}
              <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200/80 text-emerald-900 text-[11px] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Éligible aux financements <strong>CSF (OFPPT &amp; GIAC)</strong> au Maroc. Hébergement souverain conforme CNDP 09-08 &amp; Loi 69-21.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setTab('login')}
                  className="text-xs text-light-primary hover:underline cursor-pointer"
                >
                  Vous avez déjà un compte ? Se connecter
                </button>

                <button
                  type="submit"
                  disabled={isSubmittingRegister}
                  className="px-5 py-2.5 text-xs font-semibold text-light-on-primary bg-light-primary hover:bg-light-primary-container rounded transition-colors flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {isSubmittingRegister ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Provisionnement du Tenant...</span>
                    </>
                  ) : (
                    <>
                      <span>Créer mon Tenant &amp; Démarrer</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-light-surface-container-low border-t border-light-outline-variant flex items-center justify-between text-[11px] text-light-on-surface-variant shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>RLS Multi-Tenant Actif</span>
          </div>
          <span className="font-mono text-[10px]">MiraStudio Platform © 2026</span>
        </div>
      </div>
    </div>
  );
}
