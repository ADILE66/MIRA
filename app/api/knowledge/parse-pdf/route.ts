import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { FAST_MODEL } from '@/lib/gemini-engine';

function getAiClient(): GoogleGenAI {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { base64Data, fileName, regulatoryCategory } = body;

    if (!base64Data) {
      return NextResponse.json(
        { error: 'Aucune donnée PDF fournie.' },
        { status: 400 }
      );
    }

    const ai = getAiClient();
    const modelToUse = process.env.GEMINI_FAST_MODEL || FAST_MODEL || 'gemini-2.5-flash';

    let response;
    try {
      response = await ai.models.generateContent({
        model: modelToUse,
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: 'application/pdf',
                data: base64Data,
              },
            },
            {
              text: `Extrais et structure en Markdown propre les articles de loi, règles de conformité et obligations légales contenus dans ce document PDF ("${fileName || 'Document.pdf'}", catégorie réglementaire: ${regulatoryCategory || 'Conformité Maroc'}).
Formate chaque article ou règle avec un titre "# ARTICLE ..." ou "# RÈGLE ..." suivi de son contenu exact et de l'obligation impérative pour faciliter l'indexation RAG.`,
            },
          ],
        },
      });
    } catch (parseError: unknown) {
      console.warn(
        `[PDF PARSE FALLBACK] Échec modèle ${modelToUse}, repli sur gemini-1.5-flash:`,
        parseError
      );
      response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: 'application/pdf',
                data: base64Data,
              },
            },
            {
              text: `Extrais et structure en Markdown propre les articles de loi, règles de conformité et obligations légales contenus dans ce document PDF ("${fileName || 'Document.pdf'}", catégorie réglementaire: ${regulatoryCategory || 'Conformité Maroc'}).
Formate chaque article ou règle avec un titre "# ARTICLE ..." ou "# RÈGLE ..." suivi de son contenu exact et de l'obligation impérative pour faciliter l'indexation RAG.`,
            },
          ],
        },
      });
    }

    const extractedText = (response.text ?? '').trim();
    if (!extractedText) {
      return NextResponse.json(
        { error: 'Impossible d’extraire le texte du PDF.' },
        { status: 422 }
      );
    }

    return NextResponse.json({
      extractedMarkdown: extractedText,
    });
  } catch (error: unknown) {
    console.error('Error extracting PDF with Gemini:', error);
    const msg =
      error instanceof Error
        ? error.message
        : 'Erreur lors de l’analyse du fichier PDF par Gemini.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
