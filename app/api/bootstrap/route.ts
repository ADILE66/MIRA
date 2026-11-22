import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db-client';
import { resolveAuthContext } from '@/lib/auth';
import { POSTGRES_MULTI_TENANT_DDL } from '@/lib/db-schema-reference';

export async function GET(req: NextRequest) {
  try {
    const auth = resolveAuthContext(req);
    const searchParams = req.nextUrl.searchParams;
    const requestedTenantId = searchParams.get('tenantId') || auth.organizationId;

    // Retrieve scoped tenant data
    const allOrganizations = await db.getOrganizations();
    const activeTenant =
      allOrganizations.find((o) => o.id === requestedTenantId || o.slug === requestedTenantId) ||
      allOrganizations[0];

    const users = await db.getUsers(activeTenant.id);
    const knowledgeDocuments = await db.getKnowledgeDocuments(activeTenant.id);
    const scenarios = await db.getScenarios({ organizationId: activeTenant.id });
    const dbHealth = await db.getHealth();

    return NextResponse.json({
      activeTenant,
      organizations: allOrganizations,
      users,
      knowledgeDocuments,
      scenarios,
      auth: {
        currentUserId: auth.user.id,
        currentUserRole: auth.user.role,
        organizationId: activeTenant.id,
        isSuperAdmin: auth.isSuperAdmin,
        tokenType: auth.tokenType,
      },
      dbHealth,
      postgresSchemaDdl: POSTGRES_MULTI_TENANT_DDL,
    });
  } catch (error: unknown) {
    console.error('Error in /api/bootstrap:', error);
    const msg = error instanceof Error ? error.message : 'Erreur lors du chargement des données.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
