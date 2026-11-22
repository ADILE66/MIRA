/**
 * SCHÉMA MULTI-TENANT POSTGRESQL (DRIZZLE ORM REFERENCE & ARCHITECTURE CONTRACT)
 *
 * Ce fichier formalise le schéma relationnel B2B multi-tenant tel que conçu
 * pour PostgreSQL / Cloud SQL Souverain avec Drizzle ORM :
 * - organizations (Tenants B2B & Marque Blanche)
 * - users (Comptes liés à l'UID d'authentification et rôles RBAC)
 * - knowledge_documents (Base documentaire RAG et chunks JSONB)
 * - scenarios (Templates et scénarios générés dans le Studio)
 * - simulation_sessions (État déterministe JSONB, journal des tours et rapport Évaluateur)
 */

export const POSTGRES_MULTI_TENANT_DDL = `-- ============================================================================
-- MIRASTUDIO B2B — SCHÉMA POSTGRESQL MULTI-TENANT (DRIZZLE ORM / RLS NATIVE)
-- ============================================================================

CREATE TYPE module_type AS ENUM ('upskilling', 'business_game', 'recruitment', 'onboarding');
CREATE TYPE user_role AS ENUM ('admin', 'sales_director', 'hr_director', 'coach_partner', 'candidate');
CREATE TYPE session_status AS ENUM ('active', 'won', 'lost', 'completed', 'timeout');

-- 1. Table des Organisations Clientes (Multi-Tenant & Mode Marque Blanche)
CREATE TABLE organizations (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  sector TEXT NOT NULL,
  plan_tier TEXT NOT NULL DEFAULT 'enterprise',
  brand_color TEXT NOT NULL DEFAULT '#3B82F6',
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Table des Utilisateurs (Synchronisée avec l'UID Auth)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  uid TEXT NOT NULL UNIQUE,
  organization_id INTEGER NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'candidate',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Table de la Base Documentaire Interne (RAG Multi-Tenant)
CREATE TABLE knowledge_documents (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  version TEXT NOT NULL DEFAULT 'v1.0',
  raw_content TEXT NOT NULL,
  chunks_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Table des Scénarios & Templates du Studio
CREATE TABLE scenarios (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER REFERENCES organizations(id) ON DELETE CASCADE,
  knowledge_document_id INTEGER REFERENCES knowledge_documents(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  module_type module_type NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'Avancé',
  duration_minutes INTEGER NOT NULL DEFAULT 20,
  objectives_json JSONB NOT NULL,
  initial_state_json JSONB NOT NULL, -- Contrat strict SimulationStateContract
  evaluation_rubric_json JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Table des Sessions de Simulation & Rapports de l'Agent Évaluateur
CREATE TABLE simulation_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id INTEGER NOT NULL REFERENCES scenarios(id) ON DELETE CASCADE,
  organization_id INTEGER NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status session_status NOT NULL DEFAULT 'active',
  current_turn INTEGER NOT NULL DEFAULT 1,
  current_state_json JSONB NOT NULL, -- État déterministe mis à jour à chaque tour
  turn_history_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  evaluation_report_json JSONB,      -- Radar 5 axes & Moments critiques
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_sessions_org_status ON simulation_sessions(organization_id, status);
CREATE INDEX idx_scenarios_module ON scenarios(organization_id, module_type);
`;
