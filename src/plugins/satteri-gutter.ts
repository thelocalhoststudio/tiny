/**
 * Markdown source gutter: a Sätteri HAST plugin that attaches structural
 * Markdown markers to block elements as `data-md`.
 *
 * CSS renders these in a dedicated left gutter on desktop and inline on mobile.
 * Plain prose paragraphs receive no marker.
 */

type El = { type: string; tagName?: string; properties?: Record<string, unknown> };
type Parent = El & { children?: El[] };

const FIXED: Record<string, string> = {
  h1: '#',
  h2: '##',
  h3: '###',
  h4: '####',
  h5: '#####',
  h6: '######',
  blockquote: '>',
  hr: '---',
  pre: '```',
};

/**
 * Determine the Markdown source marker for a given HAST element.
 */
export const markerFor = (el: El, at: number, parent?: Parent, grandparent?: El): string | null => {
  const tag = el.tagName ?? '';

  // Skip the screen-reader-only footnote heading
  if (el.properties?.id === 'footnote-label') return null;

  // Single-image paragraph: ![alt](src)
  if (tag === 'p') {
    const kids = ((el as Parent).children ?? []).filter(
      (k) => k.type !== 'text' || /\S/.test((k as { value?: string }).value ?? ''),
    );
    return kids.length === 1 && kids[0]!.tagName === 'img' ? '![]' : null;
  }

  // Callout block: <aside class="callout ...">
  if (tag === 'aside') {
    const classes = el.properties?.className as string[] | string | undefined;
    const isCallout = Array.isArray(classes)
      ? classes.includes('callout')
      : typeof classes === 'string' && classes.includes('callout');
    if (isCallout) {
      const calloutType = (el.properties?.dataCallout as string) || 'note';
      return `[!${calloutType}]`;
    }
    return null;
  }

  if (tag !== 'li') return FIXED[tag] ?? null;

  // Unordered list item
  if (parent?.tagName === 'ul') return '-';

  // Position among element siblings
  const n = (parent?.children ?? []).slice(0, at + 1).filter((k) => k.type === 'element').length;

  // Footnote item in footnotes section
  const classes = grandparent?.properties?.className ?? grandparent?.properties?.class;
  const classList = Array.isArray(classes)
    ? classes
    : typeof classes === 'string'
      ? classes.split(' ')
      : [];
  if (classList.includes('footnotes')) return `[^${n}]`;

  // Ordered list item
  const start = Number(parent?.properties?.start ?? 1);
  return `${start + n - 1}.`;
};

export const sourceGutter = {
  name: 'tiny-source-gutter',
  element: {
    filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'hr', 'pre', 'li', 'table', 'p', 'aside'],
    visit(node: any, ctx: any) {
      // Tables scroll within a wrapper for mobile/overflow responsiveness.
      // Semantics are preserved and the marker hangs on the non-scrolling outer block.
      if (node.tagName === 'table') {
        const table = JSON.parse(JSON.stringify(node));
        const scroll = {
          type: 'element',
          tagName: 'div',
          properties: { className: ['table-scroll'] },
          children: [table],
        };
        return {
          type: 'element',
          tagName: 'div',
          properties: { className: ['table-block'], dataMd: '|' },
          children: [scroll],
        } as any;
      }

      const parent = ctx.parent(node) as Parent | undefined;
      const grandparent = parent && (ctx.parent(parent as any) as El | undefined);
      const md = markerFor(node as El, ctx.indexOf(node) ?? 0, parent, grandparent);
      if (md) ctx.setProperty(node, 'dataMd', md);
    },
  },
};
