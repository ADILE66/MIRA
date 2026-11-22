import { KnowledgeChunk, KnowledgeDocument } from './types';

/**
 * Splits a raw internal corporate document (Markdown or plain text) into structured
 * RAG chunks with automatically extracted keywords and compliance rules.
 */
export function parseDocumentIntoRagChunks(
  docId: string,
  title: string,
  rawContent: string
): KnowledgeChunk[] {
  const sections = rawContent
    .split(/\n(?=#{1,3}\s|RÈGLE\s|ARTICLE\s|SECTION\s|\d+\.\s)/i)
    .map((s) => s.trim())
    .filter((s) => s.length > 25);

  if (sections.length === 0) {
    return [
      {
        id: `${docId}-chunk-1`,
        title: `${title} — Directive Générale`,
        content: rawContent.trim(),
        keywords: extractKeywords(rawContent),
        mandatoryRule: extractMandatoryRule(rawContent),
      },
    ];
  }

  return sections.map((section, idx) => {
    const lines = section.split('\n');
    const firstLine = lines[0].replace(/^#{1,3}\s*/, '').trim();
    const chunkTitle = firstLine.length > 5 && firstLine.length < 95 ? firstLine : `${title} — Clause #${idx + 1}`;
    const body = lines.slice(1).join('\n').trim() || section;

    return {
      id: `${docId}-chunk-${idx + 1}`,
      title: chunkTitle,
      content: body,
      keywords: extractKeywords(section),
      mandatoryRule: extractMandatoryRule(section),
    };
  });
}

function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    'dans', 'avec', 'pour', 'sans', 'sous', 'vers', 'chez', 'plus', 'moins',
    'cette', 'sont', 'etre', 'avoir', 'faire', 'tout', 'tous', 'toute', 'elle',
    'nous', 'vous', 'leur', 'leurs', 'mais', 'donc', 'alors', 'comme', 'peut',
    'doit', 'entre', 'apres', 'avant',
  ]);

  const words = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s%€]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 4 && !stopWords.has(w));

  return Array.from(new Set(words)).slice(0, 12);
}

function extractMandatoryRule(text: string): string {
  const lines = text.split('\n').map((l) => l.trim());
  const ruleLine = lines.find((l) =>
    /interdit|obligatoire|maximum|minimum|plafond|jamais|toujours|doit|sla|remise|delai/i.test(l)
  );
  if (ruleLine) {
    return ruleLine.replace(/^[-*•]\s*/, '');
  }
  return lines[lines.length - 1]?.slice(0, 160) || 'Respecter scrupuleusement la procédure interne.';
}

/**
 * Retrieves the top K most relevant chunks from a KnowledgeDocument given the current
 * user message and turn context.
 */
export function retrieveRelevantRagChunks(
  document: KnowledgeDocument | undefined,
  userMessage: string,
  topK: number = 3
): KnowledgeChunk[] {
  if (!document || !document.chunks || document.chunks.length === 0) {
    return [];
  }

  const queryTokens = extractKeywords(userMessage);

  const scored = document.chunks.map((chunk, index) => {
    let score = 0;
    const normalizedContent = chunk.content
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    for (const token of queryTokens) {
      if (chunk.keywords.includes(token)) {
        score += 3;
      }
      if (normalizedContent.includes(token)) {
        score += 1.5;
      }
    }

    // Slight tie-breaker bonus to ensure deterministic coverage even on short prompts
    score += Math.max(0, 0.5 - index * 0.1);

    return { chunk, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK).map((s) => s.chunk);
}
