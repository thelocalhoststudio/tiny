/**
 * Links between posts and notes:
 * Resolves relative markdown links (`./file.md`) and wikilinks (`[[target]]`)
 * to `/posts/<slug>` paths.
 */
import { slugify } from '../utils/text.ts';

/**
 * Resolve relative markdown file links (`./design.md`, `../posts/design.md#heading`)
 * to `/posts/<slug>#heading`.
 */
export const resolveFileLink = (href: string): string | null => {
  if (!href) return null;
  if (/^([a-z][a-z\d+.-]*:|\/|#)/i.test(href)) return null;

  const m = /^(?:\.{1,2}\/)*(?:posts\/)?([^#?]+?)\.mdx?(#[^?]*)?$/.exec(href);
  if (!m) return null;

  const pathParts = decodeURI(m[1]!).split('/');
  const slug = pathParts.map(slugify).join('/');
  return `/posts/${slug}${m[2] ?? ''}`;
};

/**
 * Regular expression matching `[[target]]`, `[[target|label]]`, `[[target#Heading]]`, `[[target#Heading|label]]`.
 */
export const WIKILINK = /\[\[([^\]|#]+)(?:#([^\]|]*))?(?:\|([^\]]+))?\]\]/g;

/**
 * Extract all post slugs referenced in a Markdown document (via wikilinks or relative file links).
 */
export const linkedIds = (body: string): string[] => {
  const ids: string[] = [];
  const postPath = /^\/posts\/([^/#?]+)/;

  for (const m of body.matchAll(/(?:\]\(|href=["'])([^)"'\s]+)/g)) {
    const href = m[1]!;
    const path = postPath.test(href) ? href : resolveFileLink(href);
    const id = path && postPath.exec(path)?.[1];
    if (id) ids.push(decodeURIComponent(id));
  }

  for (const m of body.matchAll(WIKILINK)) {
    ids.push(slugify(m[1]!.trim()));
  }

  return [...new Set(ids)];
};

/**
 * MDAST plugin to normalize relative `.md` / `.mdx` file links to site routes.
 */
export const noteFileLinks = {
  name: 'tiny-note-file-links',
  link(node: any, ctx: any) {
    const to = resolveFileLink(node.url);
    if (to !== null) {
      ctx.setProperty(node, 'url', to);
    }
  },
};
