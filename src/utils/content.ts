import { getAssetPath } from './url.ts';
import { slugify, countWords, readingMinutes } from './text.ts';
import { linkedIds } from '../plugins/satteri-note-links.ts';
import type { Post, Page } from '../types.ts';

export const POSTS_PATH = 'src/content/posts/';
export const PAGES_PATH = 'src/content/pages/';

let postsCache: Post[] | null = null;
let pagesCache: Page[] | null = null;
let inboundLinksIndex: Map<string, Post[]> | null = null;

// ── Posts ──────────────────────────────────────────────────────────────────────

function isVisiblePost(post: Post): boolean {
  // Show everything in development
  if (import.meta.env.DEV) {
    return true;
  }

  const isDraft = post.data.draft;

  const isFuturePost =
    new Date(post.data.published).getTime() >
    Date.now();

  return !isDraft && !isFuturePost;
}

function sortPosts(posts: Post[]): Post[] {
  return posts.sort((a, b) => {
    const aDate = new Date(
      a.data.updated ?? a.data.published,
    ).getTime();

    const bDate = new Date(
      b.data.updated ?? b.data.published,
    ).getTime();

    return bDate - aDate;
  });
}

export async function getAllPosts(): Promise<Post[]> {
  if (postsCache) {
    return postsCache;
  }

  const { getCollection } = await import('astro:content');
  const posts = await getCollection(
    'posts',
    isVisiblePost,
  );

  postsCache = sortPosts(posts);

  return postsCache;
}

/**
 * Remove hidden folders and normalize directory segments.
 */
export function getPostPathSegments(
  filePath?: string,
): string[] {
  if (!filePath) {
    return [];
  }

  const parts = filePath.replace(POSTS_PATH, '').split('/').filter(Boolean);
  const isIndexFile = /^index\.(md|mdx)$/i.test(parts.at(-1) ?? '');
  const dropCount = isIndexFile ? 2 : 1;

  return parts
    .slice(0, parts.length - dropCount)
    .filter((segment) => !segment.startsWith('_'))
    .map((s) => slugify(s));
}

/**
 * Get the final slug segment from Astro content entry ID.
 */
export function getPostSlugSegment(id: string): string {
  const segments = id.split('/');
  return segments.at(-1) ?? id;
}

/**
 * Generate nested slug path from file structure.
 */
export function getPostSlugPath(
  id: string,
  filePath?: string,
): string {
  const segments = getPostPathSegments(filePath);
  const slug = slugify(getPostSlugSegment(id));

  return segments.length > 0
    ? [...segments, slug].join('/')
    : slug;
}

/**
 * Full post URL.
 */
export function getPostUrl(
  id: string,
  filePath?: string,
): string {
  return getAssetPath(
    `posts/${getPostSlugPath(id, filePath)}`,
  );
}

export function getPostsGroupedByYear(
  entries: Post[],
): [string, Post[]][] {
  const grouped = entries.reduce<Record<string, Post[]>>((acc, entry) => {
    const year = entry.data.published.getFullYear().toString();
    (acc[year] ??= []).push(entry);
    return acc;
  }, {});

  for (const year in grouped) {
    grouped[year].sort(
      (a, b) => b.data.published.valueOf() - a.data.published.valueOf(),
    );
  }

  return Object.entries(grouped).sort(
    ([a], [b]) => Number(b) - Number(a),
  );
}

/**
 * Get word count and estimated reading time for a post.
 */
export function getPostStats(post: Post): { words: number; readingMinutes: number } {
  const body = post.body ?? '';
  const words = countWords(body);
  const minutes = readingMinutes(words);
  return { words, readingMinutes: minutes };
}

/**
 * Compute or retrieve inbound links (backlinks) index across all posts.
 */
export async function getInboundLinksIndex(): Promise<Map<string, Post[]>> {
  if (inboundLinksIndex) {
    return inboundLinksIndex;
  }

  const posts = await getAllPosts();
  const index = new Map<string, Post[]>();

  for (const sourcePost of posts) {
    if (!sourcePost.body) continue;
    const targets = linkedIds(sourcePost.body);

    for (const target of targets) {
      const list = index.get(target) ?? [];
      list.push(sourcePost);
      index.set(target, list);
    }
  }

  inboundLinksIndex = index;
  return inboundLinksIndex;
}

/**
 * Get all posts linking to a given post.
 */
export async function getInboundLinks(targetPost: Post): Promise<Post[]> {
  const index = await getInboundLinksIndex();
  const slug = getPostSlugPath(targetPost.id, targetPost.filePath);
  const segment = getPostSlugSegment(targetPost.id);
  const titleSlug = slugify(targetPost.data.title);

  // Check matching by nested slug, segment, or title slug
  const matched = new Set<Post>();
  for (const key of [slug, segment, titleSlug, targetPost.id]) {
    const found = index.get(key);
    if (found) {
      for (const p of found) {
        if (p.id !== targetPost.id) matched.add(p);
      }
    }
  }

  return [...matched];
}

/**
 * Fast synchronous count of inbound links for a post using a pre-fetched index.
 */
export function getInboundLinksCount(targetPost: Post, index: Map<string, Post[]>): number {
  const slug = getPostSlugPath(targetPost.id, targetPost.filePath);
  const segment = getPostSlugSegment(targetPost.id);
  const titleSlug = slugify(targetPost.data.title);

  const matched = new Set<string>();
  for (const key of [slug, segment, titleSlug, targetPost.id]) {
    const found = index.get(key);
    if (found) {
      for (const p of found) {
        if (p.id !== targetPost.id) matched.add(p.id);
      }
    }
  }

  return matched.size;
}

/**
 * Get chronological previous and next posts (older and newer).
 */
export function getAdjacentPosts(
  currentPost: Post,
  allPosts: Post[],
): { prev?: Post; next?: Post } {
  const currentIndex = allPosts.findIndex((p) => p.id === currentPost.id);
  if (currentIndex === -1) return {};

  // allPosts is sorted newest first.
  // Next in time (newer) is at index - 1.
  // Prev in time (older) is at index + 1.
  const next = currentIndex > 0 ? allPosts[currentIndex - 1] : undefined;
  const prev = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : undefined;

  return { prev, next };
}

// ── Pages ──────────────────────────────────────────────────────────────────────

function sortPages(pages: Page[]): Page[] {
  return pages.sort((a, b) => {
    const aDate = new Date(a.data.updated ?? 0).getTime();
    const bDate = new Date(b.data.updated ?? 0).getTime();
    return bDate - aDate;
  });
}

export async function getAllPages(): Promise<Page[]> {
  if (pagesCache) {
    return pagesCache;
  }

  const { getCollection } = await import('astro:content');
  const pages = await getCollection('pages');
  pagesCache = sortPages(pages);

  return pagesCache;
}

export function getPagePathSegments(
  filePath?: string,
): string[] {
  if (!filePath) {
    return [];
  }

  const parts = filePath.replace(PAGES_PATH, '').split('/').filter(Boolean);
  const isIndexFile = /^index\.(md|mdx)$/i.test(parts.at(-1) ?? '');
  const dropCount = isIndexFile ? 2 : 1;

  return parts
    .slice(0, parts.length - dropCount)
    .filter((segment) => !segment.startsWith('_'))
    .map((s) => slugify(s));
}

export function getPageSlugPath(
  id: string,
  filePath?: string,
): string {
  const segments = getPagePathSegments(filePath);
  const slug = slugify(getPostSlugSegment(id));

  return segments.length > 0
    ? [...segments, slug].join('/')
    : slug;
}

/**
 * Full page URL — pages are served at the root (no /pages/ prefix).
 */
export function getPageUrl(
  id: string,
  filePath?: string,
): string {
  return getAssetPath(getPageSlugPath(id, filePath));
}
