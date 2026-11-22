import { NextRequest } from 'next/server';
import { UserProfile } from './types';
import { INITIAL_USERS, INITIAL_ORGANIZATIONS } from './seed-data';

export interface AuthContext {
  user: UserProfile;
  organizationId: string;
  isSuperAdmin: boolean;
  tenantSlug?: string;
  tokenType: 'supabase_jwt' | 'nextauth_session' | 'tenant_header_dev';
}

/**
 * Resolves the authenticated user and tenant context from request headers/cookies.
 * Supports:
 * 1. Supabase Auth / NextAuth Bearer token in Authorization header
 * 2. NextAuth session cookie
 * 3. x-tenant-id / x-user-id headers (for B2B API integrations and development)
 */
export function resolveAuthContext(req: NextRequest): AuthContext {
  const authHeader = req.headers.get('authorization');
  const tenantHeader = req.headers.get('x-tenant-id');
  const userHeader = req.headers.get('x-user-id');

  // 1. Supabase / NextAuth JWT inspection if present
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      // Decode JWT payload without external heavy library to prevent dependencies bottleneck
      const parts = token.split('.');
      if (parts.length === 3) {
        const payloadJson = Buffer.from(parts[1], 'base64').toString('utf-8');
        const payload = JSON.parse(payloadJson);
        const orgId = payload.organization_id || payload.org_id || tenantHeader || INITIAL_ORGANIZATIONS[0].id;
        const uid = payload.sub || payload.uid || 'usr-jwt-user';
        const email = payload.email || 'user@aegissim.com';
        const role = payload.role || 'Candidat / Apprenant';

        return {
          user: {
            id: uid,
            uid,
            name: payload.name || payload.user_metadata?.full_name || email.split('@')[0],
            email,
            role,
            organizationId: orgId,
          },
          organizationId: orgId,
          isSuperAdmin: role === 'admin' || payload.is_super_admin === true,
          tokenType: 'supabase_jwt',
        };
      }
    } catch {
      // Malformed JWT fallback to tenant header
    }
  }

  // 2. Resolve via Tenant / User Header (B2B multi-tenant context)
  const resolvedOrg =
    INITIAL_ORGANIZATIONS.find((o) => o.id === tenantHeader || o.slug === tenantHeader) ||
    INITIAL_ORGANIZATIONS[0];

  const resolvedUser =
    INITIAL_USERS.find((u) => u.id === userHeader || u.organizationId === resolvedOrg.id) ||
    INITIAL_USERS[0];

  return {
    user: resolvedUser,
    organizationId: resolvedOrg.id,
    tenantSlug: resolvedOrg.slug,
    isSuperAdmin: resolvedUser.role === 'Directeur Commercial', // or admin
    tokenType: 'tenant_header_dev',
  };
}

/**
 * Enforces strict multi-tenant isolation.
 * Throws an Error with 403 status if a user from Tenant A tries to access Tenant B's resource.
 */
export function enforceTenantIsolation(
  auth: AuthContext,
  resourceOrgId?: string,
  resourceName: string = 'Ressource'
): void {
  if (!resourceOrgId) return; // Public/Global scenario

  if (!auth.isSuperAdmin && auth.organizationId !== resourceOrgId) {
    const errorMsg = `Accès interdit (IDOR Guard) : votre organisation (${auth.organizationId}) n'est pas autorisée à manipuler cette ${resourceName} appartenant à (${resourceOrgId}).`;
    console.error(`[SECURITY ALERT] ${errorMsg}`);
    const forbiddenError = new Error(errorMsg);
    (forbiddenError as unknown as { status: number }).status = 403;
    throw forbiddenError;
  }
}
