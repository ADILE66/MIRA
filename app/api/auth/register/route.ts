import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db-client';
import { signSessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';
import { UserProfile, OrganizationTenant } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      organizationName,
      email,
      fullName,
      password,
      sector = 'Entreprise / ETI',
      role = 'Directeur Commercial',
      planTier = 'Enterprise',
    } = body;

    // Validation
    if (!organizationName || !organizationName.trim()) {
      return NextResponse.json(
        { error: "Le nom de l'organisation est obligatoire." },
        { status: 400 }
      );
    }
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Une adresse email professionnelle valide est requise.' },
        { status: 400 }
      );
    }
    if (!fullName || fullName.trim().length < 2) {
      return NextResponse.json(
        { error: 'Votre nom complet est obligatoire (min. 2 caractères).' },
        { status: 400 }
      );
    }
    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit comporter au moins 6 caractères.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await db.getUserByEmail(normalizedEmail);
    if (existingUser) {
      return NextResponse.json(
        {
          error:
            'Un compte existe déjà avec cette adresse email. Veuillez vous connecter directement.',
        },
        { status: 409 }
      );
    }

    // Generate unique slug and IDs
    const orgSlug = organizationName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const orgId = `org-${orgSlug}-${Date.now().toString().slice(-4)}`;
    const userId = `usr-${Date.now().toString().slice(-6)}`;

    // Create new organization tenant
    const newOrg: OrganizationTenant = {
      id: orgId,
      name: organizationName.trim(),
      slug: orgSlug || `tenant-${Date.now()}`,
      sector: sector.trim(),
      planTier: planTier as 'Enterprise' | 'WhiteLabel' | 'Growth',
      brandColor: planTier === 'WhiteLabel' ? '#10B981' : '#3B82F6',
      activeUsersCount: 1,
    };
    await db.createOrganization(newOrg);

    // Create user profile
    const newUser: UserProfile = {
      id: userId,
      uid: `uid-${userId}`,
      name: fullName.trim(),
      email: normalizedEmail,
      role: role as UserProfile['role'],
      organizationId: newOrg.id,
    };
    await db.createUser(newUser);

    // Generate signed session token
    const token = signSessionToken({
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      organizationId: newOrg.id,
      tenantSlug: newOrg.slug,
    });

    const response = NextResponse.json({
      success: true,
      message: `Espace Entreprise '${newOrg.name}' créé avec succès pour ${newUser.name}.`,
      user: newUser,
      organization: newOrg,
      token,
    });

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: unknown) {
    console.error('Registration error:', error);
    const msg = error instanceof Error ? error.message : "Erreur interne lors de l'inscription.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
