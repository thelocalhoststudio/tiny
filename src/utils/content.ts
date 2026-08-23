import { getCollection } from "astro:content";
import { getAssetPath } from "./url";
import { slugify } from "./text";
import type { Post, Page } from "@/types";

import { POSTS_PATH, PAGES_PATH } from "../content.config";

let postsCache: Post[] | null = null;
let pagesCache: Page[] | null = null;

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
      a.data.updated ?? a.data.published
    ).getTime();

    const bDate = new Date(
      b.data.updated ?? b.data.published
    ).getTime();

    return bDate - aDate;
  });
}

export async function getAllPosts(): Promise<Post[]> {
  if (postsCache) {
    return postsCache;
  }

  const posts = await getCollection(
    "posts",
    isVisiblePost
  );

  postsCache = sortPosts(posts);

  return postsCache;
}

/**
 * Remove hidden folders and normalize directory segments.
 *
 * Example:
 * posts/_2026/Japan Beyond Places.md
 * -> []
 *
 * posts/travel/Japan/Tokyo.md
 * -> ["travel", "japan"]
 */
export function getPostPathSegments(
  filePath?: string
): string[] {
  if (!filePath) {
    return [];
  }

  const parts = filePath.replace(POSTS_PATH, "").split("/").filter(Boolean);
  // `<slug>/index.md` — the immediate parent directory is the entry's own
  // slug-bearing directory (captured via id), not a breadcrumb segment.
  const isIndexFile = /^index\.(md|mdx)$/i.test(parts.at(-1) ?? "");
  const dropCount = isIndexFile ? 2 : 1;

  return parts
    .slice(0, parts.length - dropCount)
    .filter((segment) => !segment.startsWith("_"))
    .map(slugify);
}

/**
 * Get the final slug segment from Astro content entry ID.
 *
 * Example:
 * "travel/tokyo-beyond-places"
 * -> "tokyo-beyond-places"
 */
export function getPostSlugSegment(id: string): string {
  const segments = id.split("/");

  return segments.at(-1) ?? id;
}

/**
 * Generate nested slug path from file structure.
 *
 * Example:
 * travel/japan/tokyo.md
 * -> "travel/japan/tokyo"
 */
export function getPostSlugPath(
  id: string,
  filePath?: string
): string {
  const segments = getPostPathSegments(filePath);

  const slug =
    slugify(getPostSlugSegment(id));

  return segments.length > 0
    ? [...segments, slug].join("/")
    : slug;
}

/**
 * Full post URL.
 *
 * Example:
 * "/posts/travel/japan/tokyo"
 */
export function getPostUrl(
  id: string,
  filePath?: string
): string {
  return getAssetPath(
    `posts/${getPostSlugPath(id, filePath)}`
  );
}

export function getPostsGroupedByYear(
  entries: Post[]
): [string, Post[]][] {
  const grouped = entries.reduce<Record<string, Post[]>>((acc, entry) => {
    const year = entry.data.published.getFullYear().toString();
    (acc[year] ??= []).push(entry);
    return acc;
  }, {});

  for (const year in grouped) {
    grouped[year].sort(
      (a, b) => b.data.published.valueOf() - a.data.published.valueOf()
    );
  }

  return Object.entries(grouped).sort(
    ([a], [b]) => Number(b) - Number(a)
  );
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

  const pages = await getCollection("pages");

  pagesCache = sortPages(pages);

  return pagesCache;
}

export function getPagePathSegments(
  filePath?: string
): string[] {
  if (!filePath) {
    return [];
  }

  const parts = filePath.replace(PAGES_PATH, "").split("/").filter(Boolean);
  const isIndexFile = /^index\.(md|mdx)$/i.test(parts.at(-1) ?? "");
  const dropCount = isIndexFile ? 2 : 1;

  return parts
    .slice(0, parts.length - dropCount)
    .filter((segment) => !segment.startsWith("_"))
    .map(slugify);
}

export function getPageSlugPath(
  id: string,
  filePath?: string
): string {
  const segments = getPagePathSegments(filePath);
  const slug = slugify(getPostSlugSegment(id));

  return segments.length > 0
    ? [...segments, slug].join("/")
    : slug;
}

/**
 * Full page URL — pages are served at the root (no /pages/ prefix).
 *
 * Example:
 * "about" -> "/about"
 */
export function getPageUrl(
  id: string,
  filePath?: string
): string {
  return getAssetPath(getPageSlugPath(id, filePath));
}