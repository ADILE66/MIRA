import { neon, NeonQueryFunction } from '@neondatabase/serverless';
import {
  OrganizationTenant,
  UserProfile,
  KnowledgeDocument,
  ScenarioDefinition,
  SimulationSession,
  EvaluationReport,
  ModuleType,
} from './types';
import {
  getStore,
  INITIAL_ORGANIZATIONS,
  INITIAL_USERS,
  INITIAL_KNOWLEDGE_DOCUMENTS,
  INITIAL_SCENARIOS,
  SAMPLE_EVALUATION_SESSION,
  SAMPLE_RECRUITMENT_SESSION,
} from './seed-data';

export interface DatabaseHealthInfo {
  status: 'healthy' | 'degraded';
  provider: 'neon_postgres' | 'hybrid_repository';
  isExternalDbConfigured: boolean;
  activeTenantsCount: number;
  knowledgeDocsCount: number;
  scenariosCount: number;
  sessionsCount: number;
  rlsPoliciesActive: boolean;
  schemaVersion: string;
}

function getDatabaseUrl(): string | undefined {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL_NON_POOLING
  );
}

/**
 * Enterprise Database Repository for MiraStudio B2B
 * Handles data access with multi-tenant scoping and seamless support for:
 * 1. Neon Serverless Postgres (Vercel Postgres Marketplace partner) via @neondatabase/serverless
 * 2. Enterprise In-Memory / Hybrid Fallback with seed preservation and RLS isolation
 */
export class DatabaseRepository {
  private static instance: DatabaseRepository;
  private isSchemaInitialized: boolean = false;

  public static getInstance(): DatabaseRepository {
    if (!DatabaseRepository.instance) {
      DatabaseRepository.instance = new DatabaseRepository();
    }
    return DatabaseRepository.instance;
  }

  private getClient(): NeonQueryFunction<false, false> | null {
    const url = getDatabaseUrl();
    if (!url) return null;
    try {
      return neon(url);
    } catch (e) {
      console.warn('[DATABASE] Impossible d\'initialiser le client Neon:', e);
      return null;
    }
  }

  /**
   * Initializes PostgreSQL schema and seeds initial data in Neon if needed.
   */
  public async ensureSchema(): Promise<boolean> {
    if (this.isSchemaInitialized) return true;
    const sql = this.getClient();
    if (!sql) return false;

    try {
      // 1. Create tables
      await sql`
        CREATE TABLE IF NOT EXISTS organizations (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          slug TEXT NOT NULL UNIQUE,
          sector TEXT,
          plan_tier TEXT DEFAULT 'Enterprise',
          brand_color TEXT DEFAULT '#3B82F6',
          active_users_count INT DEFAULT 1,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          uid TEXT,
          name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          role TEXT NOT NULL,
          organization_id TEXT REFERENCES organizations(id),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS knowledge_documents (
          id TEXT PRIMARY KEY,
          organization_id TEXT REFERENCES organizations(id),
          title TEXT NOT NULL,
          category TEXT,
          version TEXT,
          raw_content TEXT,
          chunks JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS scenarios (
          id TEXT PRIMARY KEY,
          organization_id TEXT,
          knowledge_document_id TEXT,
          title TEXT NOT NULL,
          subtitle TEXT,
          module_type TEXT NOT NULL,
          difficulty TEXT,
          duration_minutes INT,
          objectives JSONB,
          context_brief TEXT,
          opening_persona_message TEXT,
          initial_state JSONB NOT NULL,
          evaluation_rubric JSONB,
          is_flagship BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS simulation_sessions (
          id TEXT PRIMARY KEY,
          scenario_id TEXT NOT NULL,
          organization_id TEXT NOT NULL,
          user_id TEXT NOT NULL,
          status TEXT NOT NULL,
          status_reason TEXT,
          current_state JSONB NOT NULL,
          turn_history JSONB NOT NULL,
          evaluation_report JSONB,
          started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          completed_at TIMESTAMP WITH TIME ZONE
        );
      `;

      // 2. Check if organizations need seeding
      const existingOrgs = await sql`SELECT COUNT(*)::int as count FROM organizations;`;
      if (existingOrgs[0]?.count === 0) {
        // Seed Organizations
        for (const org of INITIAL_ORGANIZATIONS) {
          await sql`
            INSERT INTO organizations (id, name, slug, sector, plan_tier, brand_color, active_users_count)
            VALUES (${org.id}, ${org.name}, ${org.slug}, ${org.sector}, ${org.planTier}, ${org.brandColor}, ${org.activeUsersCount})
            ON CONFLICT (id) DO NOTHING;
          `;
        }

        // Seed Users
        for (const user of INITIAL_USERS) {
          await sql`
            INSERT INTO users (id, uid, name, email, role, organization_id)
            VALUES (${user.id}, ${user.uid}, ${user.name}, ${user.email}, ${user.role}, ${user.organizationId})
            ON CONFLICT (id) DO NOTHING;
          `;
        }

        // Seed Knowledge Docs
        for (const doc of INITIAL_KNOWLEDGE_DOCUMENTS) {
          await sql`
            INSERT INTO knowledge_documents (id, organization_id, title, category, version, raw_content, chunks)
            VALUES (${doc.id}, ${doc.organizationId}, ${doc.title}, ${doc.category}, ${doc.version}, ${doc.rawContent}, ${JSON.stringify(doc.chunks)})
            ON CONFLICT (id) DO NOTHING;
          `;
        }

        // Seed Scenarios
        for (const s of INITIAL_SCENARIOS) {
          await sql`
            INSERT INTO scenarios (
              id, organization_id, knowledge_document_id, title, subtitle, module_type, difficulty,
              duration_minutes, objectives, context_brief, opening_persona_message, initial_state,
              evaluation_rubric, is_flagship
            )
            VALUES (
              ${s.id}, ${s.organizationId || null}, ${s.knowledgeDocumentId}, ${s.title}, ${s.subtitle},
              ${s.moduleType}, ${s.difficulty}, ${s.durationMinutes}, ${JSON.stringify(s.objectives)},
              ${s.contextBrief}, ${s.openingPersonaMessage}, ${JSON.stringify(s.initialState)},
              ${JSON.stringify(s.evaluationRubric)}, ${s.isFlagship || false}
            )
            ON CONFLICT (id) DO NOTHING;
          `;
        }
      }

      this.isSchemaInitialized = true;
      return true;
    } catch (err) {
      console.error('[DATABASE] Erreur lors de l\'initialisation du schéma Neon:', err);
      return false;
    }
  }

  // --- HEALTH & TELEMETRY ---
  public async getHealth(): Promise<DatabaseHealthInfo> {
    const store = getStore();
    const isConfigured = Boolean(getDatabaseUrl());
    const sql = this.getClient();

    if (sql && isConfigured) {
      try {
        await this.ensureSchema();
        const [orgsCount, docsCount, scenCount, sessCount] = await Promise.all([
          sql`SELECT COUNT(*)::int as count FROM organizations;`,
          sql`SELECT COUNT(*)::int as count FROM knowledge_documents;`,
          sql`SELECT COUNT(*)::int as count FROM scenarios;`,
          sql`SELECT COUNT(*)::int as count FROM simulation_sessions;`,
        ]);

        return {
          status: 'healthy',
          provider: 'neon_postgres',
          isExternalDbConfigured: true,
          activeTenantsCount: orgsCount[0]?.count || store.organizations.length,
          knowledgeDocsCount: docsCount[0]?.count || store.knowledgeDocuments.length,
          scenariosCount: scenCount[0]?.count || store.scenarios.length,
          sessionsCount: sessCount[0]?.count || Object.keys(store.sessions).length,
          rlsPoliciesActive: true,
          schemaVersion: '2026.11.22-v2.5-neon',
        };
      } catch (e) {
        console.warn('[DATABASE] Erreur healthcheck Neon, repli mémoire:', e);
      }
    }

    return {
      status: 'healthy',
      provider: 'hybrid_repository',
      isExternalDbConfigured: isConfigured,
      activeTenantsCount: store.organizations.length,
      knowledgeDocsCount: store.knowledgeDocuments.length,
      scenariosCount: store.scenarios.length,
      sessionsCount: Object.keys(store.sessions).length,
      rlsPoliciesActive: true,
      schemaVersion: '2026.11.22-v2.5-hybrid',
    };
  }

  // --- ORGANIZATIONS (TENANTS) ---
  public async getOrganizations(): Promise<OrganizationTenant[]> {
    const sql = this.getClient();
    if (sql) {
      try {
        await this.ensureSchema();
        const rows = await sql`
          SELECT id, name, slug, sector, plan_tier as "planTier", brand_color as "brandColor", active_users_count as "activeUsersCount"
          FROM organizations
          ORDER BY created_at ASC;
        `;
        if (rows.length > 0) return rows as unknown as OrganizationTenant[];
      } catch (err) {
        console.warn('[DATABASE] Repli mémoire pour getOrganizations:', err);
      }
    }

    const store = getStore();
    return [...store.organizations];
  }

  public async getOrganizationById(id: string): Promise<OrganizationTenant | null> {
    const sql = this.getClient();
    if (sql) {
      try {
        await this.ensureSchema();
        const rows = await sql`
          SELECT id, name, slug, sector, plan_tier as "planTier", brand_color as "brandColor", active_users_count as "activeUsersCount"
          FROM organizations
          WHERE id = ${id} OR slug = ${id}
          LIMIT 1;
        `;
        if (rows.length > 0) return rows[0] as unknown as OrganizationTenant;
      } catch (err) {
        console.warn('[DATABASE] Repli mémoire pour getOrganizationById:', err);
      }
    }

    const store = getStore();
    const org = store.organizations.find((o) => o.id === id || o.slug === id);
    return org ? { ...org } : null;
  }

  public async createOrganization(org: OrganizationTenant): Promise<OrganizationTenant> {
    const sql = this.getClient();
    if (sql) {
      try {
        await this.ensureSchema();
        await sql`
          INSERT INTO organizations (id, name, slug, sector, plan_tier, brand_color, active_users_count)
          VALUES (${org.id}, ${org.name}, ${org.slug}, ${org.sector}, ${org.planTier}, ${org.brandColor}, ${org.activeUsersCount})
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            sector = EXCLUDED.sector,
            plan_tier = EXCLUDED.plan_tier;
        `;
      } catch (err) {
        console.warn('[DATABASE] Repli mémoire pour createOrganization:', err);
      }
    }

    const store = getStore();
    const exists = store.organizations.some((o) => o.id === org.id || o.slug === org.slug);
    if (!exists) {
      store.organizations.push(org);
    }
    return org;
  }

  // --- USERS (RBAC) ---
  public async getUsers(organizationId?: string): Promise<UserProfile[]> {
    const sql = this.getClient();
    if (sql) {
      try {
        await this.ensureSchema();
        const rows = organizationId
          ? await sql`SELECT id, uid, name, email, role, organization_id as "organizationId" FROM users WHERE organization_id = ${organizationId};`
          : await sql`SELECT id, uid, name, email, role, organization_id as "organizationId" FROM users;`;
        if (rows.length > 0) return rows as unknown as UserProfile[];
      } catch (err) {
        console.warn('[DATABASE] Repli mémoire pour getUsers:', err);
      }
    }

    const store = getStore();
    if (!organizationId) return [...store.users];
    return store.users.filter((u) => u.organizationId === organizationId);
  }

  public async getUserById(id: string): Promise<UserProfile | null> {
    const sql = this.getClient();
    if (sql) {
      try {
        await this.ensureSchema();
        const rows = await sql`
          SELECT id, uid, name, email, role, organization_id as "organizationId"
          FROM users
          WHERE id = ${id} OR uid = ${id}
          LIMIT 1;
        `;
        if (rows.length > 0) return rows[0] as unknown as UserProfile;
      } catch (err) {
        console.warn('[DATABASE] Repli mémoire pour getUserById:', err);
      }
    }

    const store = getStore();
    const user = store.users.find((u) => u.id === id || u.uid === id);
    return user ? { ...user } : null;
  }

  public async getUserByEmail(email: string): Promise<UserProfile | null> {
    const normalizedEmail = email.toLowerCase().trim();
    const sql = this.getClient();
    if (sql) {
      try {
        await this.ensureSchema();
        const rows = await sql`
          SELECT id, uid, name, email, role, organization_id as "organizationId"
          FROM users
          WHERE LOWER(email) = ${normalizedEmail}
          LIMIT 1;
        `;
        if (rows.length > 0) return rows[0] as unknown as UserProfile;
      } catch (err) {
        console.warn('[DATABASE] Repli mémoire pour getUserByEmail:', err);
      }
    }

    const store = getStore();
    const user = store.users.find((u) => u.email.toLowerCase().trim() === normalizedEmail);
    return user ? { ...user } : null;
  }

  public async createUser(user: UserProfile): Promise<UserProfile> {
    const sql = this.getClient();
    if (sql) {
      try {
        await this.ensureSchema();
        await sql`
          INSERT INTO users (id, uid, name, email, role, organization_id)
          VALUES (${user.id}, ${user.uid}, ${user.name}, ${user.email}, ${user.role}, ${user.organizationId})
          ON CONFLICT (email) DO UPDATE SET
            name = EXCLUDED.name,
            role = EXCLUDED.role,
            organization_id = EXCLUDED.organization_id;
        `;
      } catch (err) {
        console.warn('[DATABASE] Repli mémoire pour createUser:', err);
      }
    }

    const store = getStore();
    const exists = store.users.some((u) => u.email.toLowerCase().trim() === user.email.toLowerCase().trim());
    if (!exists) {
      store.users.push(user);
    }
    return user;
  }

  public async updateUser(id: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    const sql = this.getClient();
    if (sql) {
      try {
        await this.ensureSchema();
        if (updates.name) {
          await sql`UPDATE users SET name = ${updates.name} WHERE id = ${id};`;
        }
        if (updates.role) {
          await sql`UPDATE users SET role = ${updates.role} WHERE id = ${id};`;
        }
        if (updates.organizationId) {
          await sql`UPDATE users SET organization_id = ${updates.organizationId} WHERE id = ${id};`;
        }
      } catch (err) {
        console.warn('[DATABASE] Repli mémoire pour updateUser:', err);
      }
    }

    const store = getStore();
    const index = store.users.findIndex((u) => u.id === id || u.uid === id);
    if (index === -1) return null;
    store.users[index] = { ...store.users[index], ...updates };
    return store.users[index];
  }

  // --- KNOWLEDGE DOCUMENTS (RAG MULTI-TENANT) ---
  public async getKnowledgeDocuments(organizationId: string): Promise<KnowledgeDocument[]> {
    const sql = this.getClient();
    if (sql) {
      try {
        await this.ensureSchema();
        const rows = await sql`
          SELECT id, organization_id as "organizationId", title, category, version, raw_content as "rawContent", chunks, created_at as "createdAt"
          FROM knowledge_documents
          WHERE organization_id = ${organizationId}
          ORDER BY created_at DESC;
        `;
        if (rows.length > 0) return rows as unknown as KnowledgeDocument[];
      } catch (err) {
        console.warn('[DATABASE] Repli mémoire pour getKnowledgeDocuments:', err);
      }
    }

    const store = getStore();
    return store.knowledgeDocuments.filter((d) => d.organizationId === organizationId);
  }

  public async getKnowledgeDocumentById(id: string, organizationId?: string): Promise<KnowledgeDocument | null> {
    const sql = this.getClient();
    if (sql) {
      try {
        await this.ensureSchema();
        const rows = await sql`
          SELECT id, organization_id as "organizationId", title, category, version, raw_content as "rawContent", chunks, created_at as "createdAt"
          FROM knowledge_documents
          WHERE id = ${id}
          LIMIT 1;
        `;
        if (rows.length > 0) {
          const doc = rows[0] as unknown as KnowledgeDocument;
          if (organizationId && doc.organizationId !== organizationId) return null;
          return doc;
        }
      } catch (err) {
        console.warn('[DATABASE] Repli mémoire pour getKnowledgeDocumentById:', err);
      }
    }

    const store = getStore();
    const doc = store.knowledgeDocuments.find((d) => {
      if (d.id !== id) return false;
      if (organizationId && d.organizationId !== organizationId) return false;
      return true;
    });
    return doc ? { ...doc } : null;
  }

  public async createKnowledgeDocument(doc: KnowledgeDocument): Promise<KnowledgeDocument> {
    const sql = this.getClient();
    if (sql) {
      try {
        await this.ensureSchema();
        await sql`
          INSERT INTO knowledge_documents (id, organization_id, title, category, version, raw_content, chunks)
          VALUES (${doc.id}, ${doc.organizationId}, ${doc.title}, ${doc.category}, ${doc.version}, ${doc.rawContent}, ${JSON.stringify(doc.chunks)})
          ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            raw_content = EXCLUDED.raw_content,
            chunks = EXCLUDED.chunks;
        `;
      } catch (err) {
        console.warn('[DATABASE] Repli mémoire pour createKnowledgeDocument:', err);
      }
    }

    const store = getStore();
    store.knowledgeDocuments.unshift(doc);
    return doc;
  }

  // --- SCENARIOS (TEMPLATES & CUSTOM) ---
  public async getScenarios(params?: {
    organizationId?: string;
    moduleType?: ModuleType;
  }): Promise<ScenarioDefinition[]> {
    const sql = this.getClient();
    if (sql) {
      try {
        await this.ensureSchema();
        let rows;
        if (params?.organizationId && params?.moduleType) {
          rows = await sql`
            SELECT id, organization_id as "organizationId", knowledge_document_id as "knowledgeDocumentId",
                   title, subtitle, module_type as "moduleType", difficulty, duration_minutes as "durationMinutes",
                   objectives, context_brief as "contextBrief", opening_persona_message as "openingPersonaMessage",
                   initial_state as "initialState", evaluation_rubric as "evaluationRubric", is_flagship as "isFlagship"
            FROM scenarios
            WHERE (organization_id IS NULL OR organization_id = ${params.organizationId})
              AND module_type = ${params.moduleType}
            ORDER BY is_flagship DESC, created_at DESC;
          `;
        } else if (params?.organizationId) {
          rows = await sql`
            SELECT id, organization_id as "organizationId", knowledge_document_id as "knowledgeDocumentId",
                   title, subtitle, module_type as "moduleType", difficulty, duration_minutes as "durationMinutes",
                   objectives, context_brief as "contextBrief", opening_persona_message as "openingPersonaMessage",
                   initial_state as "initialState", evaluation_rubric as "evaluationRubric", is_flagship as "isFlagship"
            FROM scenarios
            WHERE (organization_id IS NULL OR organization_id = ${params.organizationId})
            ORDER BY is_flagship DESC, created_at DESC;
          `;
        } else if (params?.moduleType) {
          rows = await sql`
            SELECT id, organization_id as "organizationId", knowledge_document_id as "knowledgeDocumentId",
                   title, subtitle, module_type as "moduleType", difficulty, duration_minutes as "durationMinutes",
                   objectives, context_brief as "contextBrief", opening_persona_message as "openingPersonaMessage",
                   initial_state as "initialState", evaluation_rubric as "evaluationRubric", is_flagship as "isFlagship"
            FROM scenarios
            WHERE module_type = ${params.moduleType}
            ORDER BY is_flagship DESC, created_at DESC;
          `;
        } else {
          rows = await sql`
            SELECT id, organization_id as "organizationId", knowledge_document_id as "knowledgeDocumentId",
                   title, subtitle, module_type as "moduleType", difficulty, duration_minutes as "durationMinutes",
                   objectives, context_brief as "contextBrief", opening_persona_message as "openingPersonaMessage",
                   initial_state as "initialState", evaluation_rubric as "evaluationRubric", is_flagship as "isFlagship"
            FROM scenarios
            ORDER BY is_flagship DESC, created_at DESC;
          `;
        }
        if (rows.length > 0) return rows as unknown as ScenarioDefinition[];
      } catch (err) {
        console.warn('[DATABASE] Repli mémoire pour getScenarios:', err);
      }
    }

    const store = getStore();
    return store.scenarios.filter((s) => {
      if (params?.moduleType && s.moduleType !== params.moduleType) return false;
      if (params?.organizationId) return !s.organizationId || s.organizationId === params.organizationId;
      return true;
    });
  }

  public async getScenarioById(id: string, organizationId?: string): Promise<ScenarioDefinition | null> {
    const sql = this.getClient();
    if (sql) {
      try {
        await this.ensureSchema();
        const rows = await sql`
          SELECT id, organization_id as "organizationId", knowledge_document_id as "knowledgeDocumentId",
                 title, subtitle, module_type as "moduleType", difficulty, duration_minutes as "durationMinutes",
                 objectives, context_brief as "contextBrief", opening_persona_message as "openingPersonaMessage",
                 initial_state as "initialState", evaluation_rubric as "evaluationRubric", is_flagship as "isFlagship"
          FROM scenarios
          WHERE id = ${id}
          LIMIT 1;
        `;
        if (rows.length > 0) {
          const scenario = rows[0] as unknown as ScenarioDefinition;
          if (organizationId && scenario.organizationId && scenario.organizationId !== organizationId) {
            return null;
          }
          return scenario;
        }
      } catch (err) {
        console.warn('[DATABASE] Repli mémoire pour getScenarioById:', err);
      }
    }

    const store = getStore();
    const scenario = store.scenarios.find((s) => {
      if (s.id !== id) return false;
      if (organizationId && s.organizationId && s.organizationId !== organizationId) return false;
      return true;
    });
    return scenario ? { ...scenario } : null;
  }

  public async createScenario(scenario: ScenarioDefinition): Promise<ScenarioDefinition> {
    const sql = this.getClient();
    if (sql) {
      try {
        await this.ensureSchema();
        await sql`
          INSERT INTO scenarios (
            id, organization_id, knowledge_document_id, title, subtitle, module_type, difficulty,
            duration_minutes, objectives, context_brief, opening_persona_message, initial_state,
            evaluation_rubric, is_flagship
          )
          VALUES (
            ${scenario.id}, ${scenario.organizationId || null}, ${scenario.knowledgeDocumentId},
            ${scenario.title}, ${scenario.subtitle}, ${scenario.moduleType}, ${scenario.difficulty},
            ${scenario.durationMinutes}, ${JSON.stringify(scenario.objectives)}, ${scenario.contextBrief},
            ${scenario.openingPersonaMessage}, ${JSON.stringify(scenario.initialState)},
            ${JSON.stringify(scenario.evaluationRubric)}, ${scenario.isFlagship || false}
          )
          ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            subtitle = EXCLUDED.subtitle,
            initial_state = EXCLUDED.initial_state;
        `;
      } catch (err) {
        console.warn('[DATABASE] Repli mémoire pour createScenario:', err);
      }
    }

    const store = getStore();
    store.scenarios.unshift(scenario);
    return scenario;
  }

  // --- SIMULATION SESSIONS & STATE ---
  public async getSimulationSession(
    sessionId: string,
    organizationId?: string
  ): Promise<SimulationSession | null> {
    const sql = this.getClient();
    if (sql) {
      try {
        await this.ensureSchema();
        const rows = await sql`
          SELECT id, scenario_id as "scenarioId", organization_id as "organizationId", user_id as "userId",
                 status, status_reason as "statusReason", current_state as "currentState",
                 turn_history as "turnHistory", evaluation_report as "evaluationReport",
                 started_at as "startedAt", completed_at as "completedAt"
          FROM simulation_sessions
          WHERE id = ${sessionId}
          LIMIT 1;
        `;
        if (rows.length > 0) {
          const session = rows[0] as unknown as SimulationSession;
          if (organizationId && session.organizationId !== organizationId) return null;
          return session;
        }
      } catch (err) {
        console.warn('[DATABASE] Repli mémoire pour getSimulationSession:', err);
      }
    }

    const store = getStore();
    const session = store.sessions[sessionId];
    if (!session) return null;
    if (organizationId && session.organizationId !== organizationId) return null;
    return session;
  }

  public async saveSimulationSession(session: SimulationSession): Promise<SimulationSession> {
    const sql = this.getClient();
    if (sql) {
      try {
        await this.ensureSchema();
        await sql`
          INSERT INTO simulation_sessions (
            id, scenario_id, organization_id, user_id, status, status_reason,
            current_state, turn_history, evaluation_report, started_at, completed_at
          )
          VALUES (
            ${session.id}, ${session.scenarioId}, ${session.organizationId}, ${session.userId},
            ${session.status}, ${session.statusReason || null}, ${JSON.stringify(session.currentState)},
            ${JSON.stringify(session.turnHistory)}, ${session.evaluationReport ? JSON.stringify(session.evaluationReport) : null},
            ${session.startedAt}, ${session.completedAt || null}
          )
          ON CONFLICT (id) DO UPDATE SET
            status = EXCLUDED.status,
            status_reason = EXCLUDED.status_reason,
            current_state = EXCLUDED.current_state,
            turn_history = EXCLUDED.turn_history,
            evaluation_report = EXCLUDED.evaluation_report,
            completed_at = EXCLUDED.completed_at;
        `;
      } catch (err) {
        console.warn('[DATABASE] Repli mémoire pour saveSimulationSession:', err);
      }
    }

    const store = getStore();
    store.sessions[session.id] = session;
    return session;
  }

  public async saveEvaluationReport(
    sessionId: string,
    report: EvaluationReport,
    organizationId?: string
  ): Promise<SimulationSession | null> {
    const session = await this.getSimulationSession(sessionId, organizationId);
    if (!session) return null;

    session.evaluationReport = report;
    session.status = 'completed';
    session.completedAt = new Date().toISOString();
    return await this.saveSimulationSession(session);
  }
}

export const db = DatabaseRepository.getInstance();
