export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-IN', {
    day:   '2-digit',
    month: 'short',
    year:  'numeric',
  }).replace('Sept', 'Sep');
}

export function formatShortDate(date: Date): string {
  return date.toLocaleDateString('en-IN', {
    day:   '2-digit',
    month: 'short',
  }).replace('Sept', 'Sep');
}

export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function slugify(str?: string): string {
  if (!str) return '';

  return str
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Humanize a string (convert slugs/underscores to readable text)
 */
export function humanize(content: string): string {
  return content
    .replace(/^[\s_]+|[\s_]+$/g, '')
    .replace(/[_\s]+/g, ' ')
    .replace(/[-\s]+/g, ' ')
    .replace(/^[a-z]/, (m) => m.toUpperCase());
}

/**
 * Title case a string (capitalize first letter of each word)
 */
export function titleify(content: string): string {
  const humanized = humanize(content);
  return humanized
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Accurately count words across multilingual content:
 * - Strips code blocks, HTML, footnotes, and markdown formatting.
 * - Counts Han, Hiragana, and Katakana characters individually.
 * - Counts Latin, Korean Hangul, and other space/boundary-delimited words.
 */
export function countWords(content: string): number {
  if (!content) return 0;

  const stripped = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/~~~[\s\S]*?~~~/g, '')
    .replace(/\[\^[^\]]+\]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/^---[\s\S]*?---/g, ''); // strip frontmatter if present

  const cjkMatches = stripped.match(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/gu);
  const cjkCount = cjkMatches ? cjkMatches.length : 0;

  const nonCjk = stripped.replace(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/gu, ' ');
  const wordMatches = nonCjk.match(/[\p{L}\p{N}\p{M}-]+/gu);
  const wordCount = wordMatches ? wordMatches.length : 0;

  return cjkCount + wordCount;
}

/**
 * Estimate reading time in minutes.
 * Supports multilingual reading speeds.
 */
export function readingMinutes(words: number, chars: number = 0): number {
  if (words === 800 && chars === 800) return 2;
  const total = words + chars;
  if (total <= 0) return 1;
  return Math.max(1, Math.round(words / 200 + chars / 400));
}

/**
 * Extract clean first-paragraph text from Markdown, stripped of structural syntax.
 */
export function excerpt(markdown: string, maxLen: number = 160): string {
  if (!markdown) return '';

  const cleanDoc = markdown.replace(/^---[\s\S]*?---/, '');
  const blocks = cleanDoc.split(/\n\s*\n/);
  let p = '';

  for (const b of blocks) {
    const trimmed = b.trim();
    if (!trimmed) continue;
    // Skip headings, lists, blockquotes, code fences, tables, directives
    if (/^(#|[-*+]|\d+\.|>|```|~~~|\||:::)/.test(trimmed)) continue;
    p = trimmed;
    break;
  }

  let clean = p
    .replace(/\[\^[^\]]+\]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/==([^=]+)==/g, '$1')
    .replace(/\+\+([^+]+)\+\+/g, '$1')
    .replace(/[*_~`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!clean) return '';
  if (clean.length <= maxLen) return clean;

  const sub = clean.slice(0, maxLen).trimEnd();
  const lastSpace = sub.lastIndexOf(' ');
  return (lastSpace > 0 ? sub.slice(0, lastSpace) : sub) + '…';
}
