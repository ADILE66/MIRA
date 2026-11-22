import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db-client';
import { resolveAuthContext, enforceTenantIsolation } from '@/lib/auth';
import { parseDocumentIntoRagChunks } from '@/lib/rag-engine';
import { KnowledgeDocument } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const auth = resolveAuthContext(req);
    const searchParams = req.nextUrl.searchParams;
    const targetOrgId = searchParams.get('organizationId') || auth.organizationId;

    enforceTenantIsolation(auth, targetOrgId, 'Base documentaire RAG');

    const documents = await db.getKnowledgeDocuments(targetOrgId);
    return NextResponse.json({ documents });
  } catch (error: unknown) {
    const status = (error as { status?: number }).status || 500;
    const msg = error instanceof Error ? error.message : 'Impossible de récupérer les documents RAG.';
    return NextResponse.json({ error: msg }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = resolveAuthContext(req);
    const body = await req.json();
    const { organizationId, title, category, rawContent } = body;

    const targetOrgId = organizationId || auth.organizationId;
    enforceTenantIsolation(auth, targetOrgId, 'Base documentaire RAG');

    if (!title || !rawContent || rawContent.trim().length < 20) {
      return NextResponse.json(
        { error: 'Le titre et le contenu du document interne (min 20 caractères) sont requis.' },
        { status: 400 }
      );
    }

    const docId = `doc-custom-${Date.now()}`;
    const chunks = parseDocumentIntoRagChunks(docId, title, rawContent);

    const newDoc: KnowledgeDocument = {
      id: docId,
      organizationId: targetOrgId,
      title: title.trim(),
      category: category || 'sales_playbook',
      version: 'v1.0 — Ingestion Studio RAG',
      rawContent: rawContent.trim(),
      chunks,
      createdAt: new Date().toISOString(),
    };

    const savedDoc = await db.createKnowledgeDocument(newDoc);

    return NextResponse.json({ document: savedDoc });
  } catch (error: unknown) {
    const status = (error as { status?: number }).status || 500;
    const msg = error instanceof Error ? error.message : 'Erreur lors de l’indexation RAG.';
    return NextResponse.json({ error: msg }, { status });
  }
}
