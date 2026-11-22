import { NextRequest } from 'next/server';
import crypto from 'crypto';
import { UserProfile, OrganizationTenant } from './types';
import { INITIAL_USERS, INITIAL_ORGANIZATIONS, getStore } from './seed-data';

export const SESSION_COOKIE_NAME = 'mirastudio-session';
const SESSION_SECRET = process.env.AUTH_SECRET || 'mirastudio-super-secret-enterprise-key-2026';

export interface SessionPayload {
  userId: string;
  email: string;
  role: UserProfile['role'];
  organizationId: string;
  tenantSlug?: string;
  name: string;
  exp: number; // Unix timestamp seconds
}

export interface AuthContext {
  user: UserProfile;
  organizationId: string;
  isSuperAdmin: boolean;
  tenantSlug?: string;
  tokenType: 'bearer_jwt' | 'cookie_session' | 'tenant_header_dev';
}

export interface DemoEnterprisePersona {
  id: string;
  userId: string;
  name: string;
  email: string;
  passwordHint: string;
  role: UserProfile['role'];
  organizationId: string;
  organizationName: string;
  organizationSlug: string;
  avatarText: string;
  badgeColor: string;
  description: string;
  keyFeatures: string[];
}

export const DEMO_ENTERPRISE_PERSONAS: DemoEnterprisePersona[] = [
  {
    id: 'persona-sales-vp',
    userId: 'usr-sales-vp',
    name: 'Youssef Berrada',
    email: 'y.berrada@atlastech.ma',
    passwordHint: 'Atlas2026!',
    role: 'Directeur Commercial',
    organizationId: 'org-atlas-holding',
    organizationName: 'Atlas Tech & Industrie Group (CFC Casablanca)',
    organizationSlug: 'atlas-group-ma',
    avatarText: 'YB',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    description: 'Pilotage commercial grands comptes, négociation sous tension et simulation Business Game.',
    keyFeatures: ['Cockpit Négociation Commerciale', 'Pilotage Marge & Délais Loi 69-21', 'Rapports Exécutifs'],
  },
  {
    id: 'persona-hr-dir',
    userId: 'usr-hr-director',
    name: 'Salma El Fassi',
    email: 's.elfassi@atlastech.ma',
    passwordHint: 'Atlas2026!',
    role: 'DRH / Talent Lead',
    organizationId: 'org-atlas-holding',
    organizationName: 'Atlas Tech & Industrie Group (CFC Casablanca)',
    organizationSlug: 'atlas-group-ma',
    avatarText: 'SF',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    description: 'Recrutement gamifié, matrice de compétences et gestion des subventions GIAC / OFPPT.',
    keyFeatures: ['Recrutement Gamified Assessment', 'Rapports Radar Compétences', 'Dossiers Remboursement CSF'],
  },
  {
    id: 'persona-partner-coach',
    userId: 'usr-partner-coach',
    name: 'Pr. Karim Tazi',
    email: 'k.tazi@toubkal-executive.ma',
    passwordHint: 'Toubkal2026!',
    role: 'Consultant / Coach',
    organizationId: 'org-toubkal-advisory',
    organizationName: 'Toubkal Executive Advisory & Business School',
    organizationSlug: 'toubkal-advisory',
    avatarText: 'KT',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    description: 'Conseil stratégique et Business School en marque blanche personnalisée.',
    keyFeatures: ['Studio RAG & Scénarios Sur-Mesure', 'Portail Marque Blanche', 'Supervision Multi-Tenants'],
  },
  {
    id: 'persona-candidate',
    userId: 'usr-candidate-amina',
    name: 'Amina Bennani',
    email: 'a.bennani@candidat.ma',
    passwordHint: 'Mira2026!',
    role: 'Candidat / Apprenant',
    organizationId: 'org-atlas-holding',
    organizationName: 'Atlas Tech & Industrie Group (CFC Casablanca)',
    organizationSlug: 'atlas-group-ma',
    avatarText: 'AB',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    description: 'Apprenant ou candidat en situation de test et immersion tactique.',
    keyFeatures: ['Immersion Simulation Active', 'Auto-évaluation Immédiate', 'Débriefing Pédagogique'],
  },
];

/**
 * Signs a session token using HMAC-SHA256
 */
export function signSessionToken(payload: Omit<SessionPayload, 'exp'> & { exp?: number }): string {
  const exp = payload.exp || Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days expiration
  const fullPayload: SessionPayload = { ...payload, exp };
  const payloadBase64 = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payloadBase64)
    .digest('base64url');
  return `${payloadBase64}.${signature}`;
}

/**
 * Verifies and parses a signed session token
 */
export function verifySessionToken(token: string): SessionPayload | null {
  if (!token || !token.includes('.')) return null;
  const [payloadBase64, signature] = token.split('.');
  if (!payloadBase64 || !signature) return null;

  try {
    const expectedSignature = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(payloadBase64)
      .digest('base64url');

    if (signature.length !== expectedSignature.length) return null;

    const isValid = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
    if (!isValid) return null;

    const payloadJson = Buffer.from(payloadBase64, 'base64url').toString('utf-8');
    const payload = JSON.parse(payloadJson) as SessionPayload;

    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }
    return payload;
  } catch {
    return null;
  }
}

/**
 * Resolves the authenticated user and tenant context from request headers/cookies.
 * Priority:
 * 1. mirastudio-session HTTP-only / standard cookie
 * 2. Enterprise Bearer JWT token in Authorization header
 * 3. x-tenant-id / x-user-id headers (for B2B API integrations and development fallback)
 */
export function resolveAuthContext(req: NextRequest): AuthContext {
  const store = getStore();

  // 1. Session cookie inspection
  const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (sessionCookie) {
    const session = verifySessionToken(sessionCookie);
    if (session) {
      const user =
        store.users.find((u) => u.id === session.userId || u.email.toLowerCase() === session.email.toLowerCase()) || {
          id: session.userId,
          uid: session.userId,
          name: session.name,
          email: session.email,
          role: session.role,
          organizationId: session.organizationId,
        };

      const org =
        store.organizations.find((o) => o.id === session.organizationId || o.slug === session.tenantSlug) ||
        store.organizations[0];

      return {
        user,
        organizationId: org.id,
        tenantSlug: org.slug,
        isSuperAdmin: user.role === 'Directeur Commercial' || user.role === 'Consultant / Coach',
        tokenType: 'cookie_session',
      };
    }
  }

  // 2. Enterprise Bearer JWT inspection if present in Authorization header
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);

    // First check if token is our internal signed session token
    const internalSession = verifySessionToken(token);
    if (internalSession) {
      const user =
        store.users.find((u) => u.id === internalSession.userId) || {
          id: internalSession.userId,
          uid: internalSession.userId,
          name: internalSession.name,
          email: internalSession.email,
          role: internalSession.role,
          organizationId: internalSession.organizationId,
        };

      const org =
        store.organizations.find((o) => o.id === internalSession.organizationId) ||
        store.organizations[0];

      return {
        user,
        organizationId: org.id,
        tenantSlug: org.slug,
        isSuperAdmin: user.role === 'Directeur Commercial' || user.role === 'Consultant / Coach',
        tokenType: 'cookie_session',
      };
    }

    // Try standard JWT decode
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payloadJson = Buffer.from(parts[1], 'base64').toString('utf-8');
        const payload = JSON.parse(payloadJson);
        const orgId = payload.organization_id || payload.org_id || store.organizations[0].id;
        const uid = payload.sub || payload.uid || 'usr-jwt-user';
        const email = payload.email || 'user@mirastudio.com';
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
          tokenType: 'bearer_jwt',
        };
      }
    } catch {
      // Malformed JWT fallback
    }
  }

  // 3. Resolve via Tenant / User Header (B2B multi-tenant context)
  const tenantHeader = req.headers.get('x-tenant-id');
  const userHeader = req.headers.get('x-user-id');

  const resolvedOrg =
    store.organizations.find((o) => o.id === tenantHeader || o.slug === tenantHeader) ||
    store.organizations[0];

  const resolvedUser =
    store.users.find((u) => u.id === userHeader || u.organizationId === resolvedOrg.id) ||
    store.users[0];

  return {
    user: resolvedUser,
    organizationId: resolvedOrg.id,
    tenantSlug: resolvedOrg.slug,
    isSuperAdmin: resolvedUser.role === 'Directeur Commercial' || resolvedUser.role === 'Consultant / Coach',
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
