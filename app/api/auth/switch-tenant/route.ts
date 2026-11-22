import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db-client';
import { resolveAuthContext, signSessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const auth = resolveAuthContext(req);
    const body = await req.json();
    const { organizationId } = body;

    if (!organizationId) {
      return NextResponse.json(
        { error: "L'identifiant d'organisation est requis." },
        { status: 400 }
      );
    }

    const targetOrg = await db.getOrganizationById(organizationId);
    if (!targetOrg) {
      return NextResponse.json(
        { error: 'Organisation cible introuvable.' },
        { status: 404 }
      );
    }

    // Update user's active tenant in session token
    const token = signSessionToken({
      userId: auth.user.id,
      email: auth.user.email,
      name: auth.user.name,
      role: auth.user.role,
      organizationId: targetOrg.id,
      tenantSlug: targetOrg.slug,
    });

    const response = NextResponse.json({
      success: true,
      message: `Bascule effectuée vers le tenant : ${targetOrg.name}.`,
      user: { ...auth.user, organizationId: targetOrg.id },
      organization: targetOrg,
      token,
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: unknown) {
    console.error('Switch tenant error:', error);
    const msg = error instanceof Error ? error.message : 'Erreur lors du changement de tenant.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
