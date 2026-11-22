import { NextRequest, NextResponse } from 'next/server';
import { resolveAuthContext, SESSION_COOKIE_NAME, DEMO_ENTERPRISE_PERSONAS } from '@/lib/auth';
import { db } from '@/lib/db-client';

export async function GET(req: NextRequest) {
  try {
    const auth = resolveAuthContext(req);
    const org = (await db.getOrganizationById(auth.organizationId)) || {
      id: auth.organizationId,
      name: 'Atlas Tech & Industrie Group (CFC Casablanca)',
      slug: 'atlas-group-ma',
      sector: 'ETI Marocaine',
      planTier: 'Enterprise' as const,
      brandColor: '#3B82F6',
      activeUsersCount: 185,
    };

    const hasCookie = Boolean(req.cookies.get(SESSION_COOKIE_NAME)?.value);
    const isAuthenticated = auth.tokenType === 'cookie_session' || auth.tokenType === 'supabase_jwt' || hasCookie;

    return NextResponse.json({
      isAuthenticated,
      user: auth.user,
      organization: org,
      tokenType: auth.tokenType,
      isSuperAdmin: auth.isSuperAdmin,
      demoPersonas: DEMO_ENTERPRISE_PERSONAS,
    });
  } catch (error: unknown) {
    console.error('Error in /api/auth/me:', error);
    const msg = error instanceof Error ? error.message : 'Erreur de vérification de session.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
