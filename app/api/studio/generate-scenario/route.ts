import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db-client';
import { resolveAuthContext, enforceTenantIsolation } from '@/lib/auth';
import { generateCustomScenarioFromRag } from '@/lib/gemini-engine';
import { ModuleType } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const auth = resolveAuthContext(req);
    const body = await req.json();
    const { organizationId, knowledgeDocumentId, moduleType, customBrief } = body;

    const targetOrgId = organizationId || auth.organizationId;
    enforceTenantIsolation(auth, targetOrgId, 'Générateur de scénarios Studio');

    if (!knowledgeDocumentId || !customBrief) {
      return NextResponse.json(
        { error: 'Veuillez sélectionner un document RAG et décrire le brief du scénario.' },
        { status: 400 }
      );
    }

    const doc = await db.getKnowledgeDocumentById(knowledgeDocumentId, targetOrgId);
    if (!doc) {
      return NextResponse.json(
        { error: 'Document RAG introuvable ou non autorisé pour cette organisation.' },
        { status: 404 }
      );
    }

    const generatedScenario = await generateCustomScenarioFromRag({
      organizationId: targetOrgId,
      knowledgeDocumentId: doc.id,
      documentTitle: doc.title,
      documentContent: doc.rawContent,
      moduleType: (moduleType as ModuleType) || 'upskilling',
      customBrief,
    });

    const savedScenario = await db.createScenario(generatedScenario);

    return NextResponse.json({ scenario: savedScenario });
  } catch (error: unknown) {
    console.error('Failed to generate scenario with Gemini:', error);
    const status = (error as { status?: number }).status || 500;
    const msg =
      error instanceof Error
        ? error.message
        : 'Erreur lors de la génération du scénario par Gemini.';
    return NextResponse.json({ error: msg }, { status });
  }
}
