-- ============================================================================
-- AEGISSIM B2B — SCHÉMA POSTGRESQL & SUPABASE PRODUCTION AVEC RLS (ROW LEVEL SECURITY)
-- ============================================================================

-- Extensions requises
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Énumérations
DO $$ BEGIN
  CREATE TYPE module_type AS ENUM ('upskilling', 'business_game', 'recruitment', 'onboarding');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'sales_director', 'hr_director', 'coach_partner', 'candidate');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE session_status AS ENUM ('active', 'won', 'lost', 'completed', 'timeout');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 1. Table des Organisations (Tenants B2B & Marque Blanche)
CREATE TABLE IF NOT EXISTS organizations (
  id TEXT PRIMARY KEY DEFAULT ('org-' || encode(gen_random_bytes(6), 'hex')),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  sector TEXT NOT NULL,
  plan_tier TEXT NOT NULL DEFAULT 'Enterprise', -- 'Enterprise', 'WhiteLabel', 'Growth'
  brand_color TEXT NOT NULL DEFAULT '#3B82F6',
  logo_url TEXT,
  active_users_count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Table des Utilisateurs (Synchronisés avec NextAuth / Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT ('usr-' || encode(gen_random_bytes(6), 'hex')),
  uid TEXT NOT NULL UNIQUE,
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'candidate',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Base Documentaire Interne (RAG Multi-Tenant)
CREATE TABLE IF NOT EXISTS knowledge_documents (
  id TEXT PRIMARY KEY DEFAULT ('doc-' || encode(gen_random_bytes(6), 'hex')),
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  version TEXT NOT NULL DEFAULT 'v1.0',
  raw_content TEXT NOT NULL,
  chunks_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Table des Scénarios & Templates de Serious Games
CREATE TABLE IF NOT EXISTS scenarios (
  id TEXT PRIMARY KEY DEFAULT ('scen-' || encode(gen_random_bytes(6), 'hex')),
  organization_id TEXT REFERENCES organizations(id) ON DELETE CASCADE, -- NULL si scénario public global
  knowledge_document_id TEXT REFERENCES knowledge_documents(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  module_type module_type NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'Avancé',
  duration_minutes INTEGER NOT NULL DEFAULT 20,
  objectives_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  context_brief TEXT NOT NULL,
  opening_persona_message TEXT NOT NULL,
  initial_state_json JSONB NOT NULL, -- Contrat strict SimulationStateContract
  evaluation_rubric_json JSONB NOT NULL,
  is_flagship BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Table des Sessions de Simulation & Rapports Déterministes
CREATE TABLE IF NOT EXISTS simulation_sessions (
  id TEXT PRIMARY KEY DEFAULT ('sim-' || encode(gen_random_bytes(6), 'hex')),
  scenario_id TEXT NOT NULL REFERENCES scenarios(id) ON DELETE CASCADE,
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status session_status NOT NULL DEFAULT 'active',
  status_reason TEXT,
  current_state_json JSONB NOT NULL, -- État exact du Moteur d'État
  turn_history_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  evaluation_report_json JSONB,      -- Rapport Agent Évaluateur & Radar 5 axes
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Index pour performances et isolation multi-tenant
CREATE INDEX IF NOT EXISTS idx_users_org ON users(organization_id);
CREATE INDEX IF NOT EXISTS idx_docs_org ON knowledge_documents(organization_id);
CREATE INDEX IF NOT EXISTS idx_scenarios_org ON scenarios(organization_id, module_type);
CREATE INDEX IF NOT EXISTS idx_sessions_org ON simulation_sessions(organization_id, status);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON simulation_sessions(user_id);

-- Activation de Row Level Security (RLS) sur toutes les tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulation_sessions ENABLE ROW LEVEL SECURITY;

-- Politiques RLS (Exemple standard Supabase / NextAuth context)
-- 1. Isolation stricte des documents de connaissances
CREATE POLICY rls_knowledge_docs_isolation ON knowledge_documents
  FOR ALL
  USING (
    organization_id = NULLIF(current_setting('app.current_tenant_id', true), '')
    OR auth.jwt() ->> 'organization_id' = organization_id
  );

-- 2. Isolation des sessions de simulation
CREATE POLICY rls_simulation_sessions_isolation ON simulation_sessions
  FOR ALL
  USING (
    organization_id = NULLIF(current_setting('app.current_tenant_id', true), '')
    OR auth.jwt() ->> 'organization_id' = organization_id
  );

-- 3. Scénarios : accessibles si publics (org_id IS NULL) ou si appartenant au tenant
CREATE POLICY rls_scenarios_access ON scenarios
  FOR SELECT
  USING (
    organization_id IS NULL
    OR organization_id = NULLIF(current_setting('app.current_tenant_id', true), '')
    OR auth.jwt() ->> 'organization_id' = organization_id
  );
