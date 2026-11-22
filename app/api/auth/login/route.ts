import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db-client';
import {
  signSessionToken,
  SESSION_COOKIE_NAME,
  DEMO_ENTERPRISE_PERSONAS,
} from '@/lib/auth';
import { UserProfile, OrganizationTenant } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { personaId, email, password } = body;

    let targetUser: UserProfile | null = null;
    let targetOrg: OrganizationTenant | null = null;

    // A. 1-Click Persona Login
    if (personaId) {
      const persona = DEMO_ENTERPRISE_PERSONAS.find((p) => p.id === personaId);
      if (!persona) {
        return NextResponse.json(
          { error: 'Profil persona introuvable.' },
          { status: 404 }
        );
      }

      targetUser = await db.getUserById(persona.userId);
      if (!targetUser) {
        targetUser = {
          id: persona.userId,
          uid: persona.userId,
          name: persona.name,
          email: persona.email,
          role: persona.role,
          organizationId: persona.organizationId,
        };
        await db.createUser(targetUser);
      }

      targetOrg = await db.getOrganizationById(targetUser.organizationId);
      if (!targetOrg) {
        const orgs = await db.getOrganizations();
        targetOrg = orgs[0];
      }
    }
    // B. Standard Credentials Login
    else if (email) {
      const normalizedEmail = email.toLowerCase().trim();
      targetUser = await db.getUserByEmail(normalizedEmail);

      // Check if matches one of our demo personas by email
      if (!targetUser) {
        const matchingPersona = DEMO_ENTERPRISE_PERSONAS.find(
          (p) => p.email.toLowerCase() === normalizedEmail
        );
        if (matchingPersona) {
          targetUser = {
            id: matchingPersona.userId,
            uid: matchingPersona.userId,
            name: matchingPersona.name,
            email: matchingPersona.email,
            role: matchingPersona.role,
            organizationId: matchingPersona.organizationId,
          };
          await db.createUser(targetUser);
        }
      }

      if (!targetUser) {
        return NextResponse.json(
          {
            error:
              'Identifiants introuvables. Vérifiez votre adresse email ou utilisez un des profils de démonstration préconfigurés.',
          },
          { status: 401 }
        );
      }

      // Check password if provided (minimal mock check: password must be at least 4 chars)
      if (password && password.length < 4) {
        return NextResponse.json(
          { error: 'Le mot de passe doit comporter au moins 4 caractères.' },
          { status: 400 }
        );
      }

      targetOrg = await db.getOrganizationById(targetUser.organizationId);
      if (!targetOrg) {
        const orgs = await db.getOrganizations();
        targetOrg = orgs[0];
      }
    } else {
      return NextResponse.json(
        { error: 'Email ou profil requis pour la connexion.' },
        { status: 400 }
      );
    }

    if (!targetUser || !targetOrg) {
      return NextResponse.json(
        { error: 'Impossible de résoudre la session utilisateur.' },
        { status: 500 }
      );
    }

    // Generate signed session token
    const token = signSessionToken({
      userId: targetUser.id,
      email: targetUser.email,
      name: targetUser.name,
      role: targetUser.role,
      organizationId: targetOrg.id,
      tenantSlug: targetOrg.slug,
    });

    const response = NextResponse.json({
      success: true,
      message: `Connexion réussie en tant que ${targetUser.name} (${targetUser.role}).`,
      user: targetUser,
      organization: targetOrg,
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
    console.error('Login error:', error);
    const msg = error instanceof Error ? error.message : 'Erreur interne de connexion.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
