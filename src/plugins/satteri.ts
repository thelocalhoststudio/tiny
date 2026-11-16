/**
 * Sätteri MDAST and HAST plugins for Tiny.
 *
 * wikilinkResolver       — converts wikilink hrefs to /posts/<slug> paths.
 * directiveToHtml        — converts :::aside and :::annotation container directives to HTML.
 * obsidianTextFormatting — ==highlights==, ++underlines++, and %%comments%%.
 * blockquoteAttribution  — styles em-dash attributions in blockquotes.
 */
import { slugify } from '../utils/text.ts';

// ── HAST plugin: resolve wikilink hrefs ──────────────────────────────────────
export const wikilinkResolver = {
  name: 'wikilink-resolver',
  element: {
    filter: ['a'],
    visit(node: any, ctx: any) {
      const href = node.properties?.href as string | undefined;
      if (!href) return;

      // Skip external URLs, root-relative paths, and mailto
      if (
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('/') ||
        href.startsWith('mailto:')
      ) {
        return;
      }

      // Bare same-page anchor: [[#Heading]] -> #heading
      if (href.startsWith('#')) {
        ctx.setProperty(node, 'href', `#${slugify(decodeURIComponent(href.slice(1)))}`);
        return;
      }

      // Sätteri emits wikilink href as raw URL-encoded title, optionally with #Heading suffix
      const decoded = decodeURIComponent(href);
      const hashIndex = decoded.indexOf('#');
      const page = hashIndex === -1 ? decoded : decoded.slice(0, hashIndex);
      const heading = hashIndex === -1 ? '' : decoded.slice(hashIndex + 1);
      const slug = slugify(page);
      const anchor = heading ? `#${slugify(heading)}` : '';

      ctx.setProperty(node, 'href', `/posts/${slug}${anchor}`);
    },
  },
};

// ── Text extraction helper ───────────────────────────────────────────────────
function extractHtml(node: any): string {
  if (!node) return '';
  switch (node.type) {
    case 'text':
      return escapeHtml(node.value ?? '');
    case 'emphasis':
      return `<em>${(node.children ?? []).map(extractHtml).join('')}</em>`;
    case 'strong':
      return `<strong>${(node.children ?? []).map(extractHtml).join('')}</strong>`;
    case 'inlineCode':
      return `<code>${escapeHtml(node.value ?? '')}</code>`;
    case 'link': {
      const href = escapeAttr(node.url ?? '');
      const text = (node.children ?? []).map(extractHtml).join('');
      return `<a href="${href}">${text}</a>`;
    }
    case 'paragraph':
      return `<p>${(node.children ?? []).map(extractHtml).join('')}</p>`;
    default:
      if (Array.isArray(node.children)) return node.children.map(extractHtml).join('');
      return '';
  }
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

// ── MDAST plugin: Obsidian text formatting & Underlines ──────────────────────
const FORMAT_REGEX = /(?<=^|[\s\p{P}\p{S}])(?:==([^\s=](?:[\s\S]*?[^\s=])?)==|\+\+([^\s\+](?:[\s\S]*?[^\s\+])?)\+\+)(?=[\s\p{P}\p{S}]|$)/gu;

export function splitMarks(value: string): any[] | null {
  const stripped = value.replace(/%%[\s\S]*?%%/g, '');
  const out: any[] = [];
  let last = 0;

  for (const m of stripped.matchAll(FORMAT_REGEX)) {
    if (m.index > last) {
      out.push({ type: 'text', value: stripped.slice(last, m.index) });
    }

    const isHighlight = m[1] !== undefined;
    const content = isHighlight ? m[1] : m[2];
    const innerChildren = splitMarks(content) ?? [{ type: 'text', value: content }];

    out.push({
      type: 'emphasis',
      data: isHighlight
        ? { hName: 'mark', hProperties: { className: ['editorial-highlight'] } }
        : { hName: 'span', hProperties: { className: ['editorial-underline'] } },
      children: innerChildren,
    });

    last = m.index + m[0].length;
  }

  if (last === 0) {
    if (stripped !== value) return [{ type: 'text', value: stripped }];
    return null;
  }

  if (last < stripped.length) {
    out.push({ type: 'text', value: stripped.slice(last) });
  }

  return out;
}

export const obsidianTextFormatting = {
  name: 'obsidian-text-formatting',
  text(node: any, ctx: any) {
    const parts = splitMarks(node.value ?? '');
    if (parts) {
      ctx.replaceNode(node, parts);
    }
  },
};

// ── MDAST plugin: Container directives ───────────────────────────────────────
export const directiveToHtml = {
  name: 'directive-to-html',
  containerDirective(node: any, ctx: any) {
    const name: string = node.name;
    if (name !== 'aside' && name !== 'annotation') return;

    const children: any[] = Array.isArray(node.children) ? node.children : [];
    const innerHtml = children.map(extractHtml).join('\n');

    const label = `<span class="${name}__label marginalia__label">${name}</span>`;
    const date: string | undefined = node.attributes?.date;
    const dateHtml = date ? `\n<span class="${name}__date marginalia__date">${escapeHtml(date)}</span>` : '';

    const fullHtml = `<div class="${name} marginalia marginalia--${name}">${label}\n${innerHtml}${dateHtml}</div>`;
    ctx.replaceNode(node, { type: 'html', value: fullHtml });
  },
};

// ── HAST plugin: blockquote attribution ──────────────────────────────────────
export const blockquoteAttribution = {
  name: 'blockquote-attribution',
  element: {
    filter: ['blockquote'],
    visit(node: any, ctx: any) {
      const pElements = (node.children ?? []).filter(
        (c: any) => c.type === 'element' && c.tagName === 'p',
      );
      if (!pElements.length) return;
      const lastP = pElements[pElements.length - 1];
      const text = ctx.textContent(lastP).trim();
      if (text.startsWith('—') || text.startsWith('--')) {
        const existingClass = Array.isArray(lastP.properties?.className)
          ? lastP.properties.className
          : [];
        ctx.setProperty(lastP, 'className', [
          ...existingClass,
          'editorial-attribution',
          'blockquote__attribution',
        ]);
      }
    },
  },
};
