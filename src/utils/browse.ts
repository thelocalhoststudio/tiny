import { getConfig } from "./config.ts";
import { defaultConfig } from "../site.config.ts";
import { slugify } from "./text.ts";
import type { Post, UserConfig } from "../types.ts";

export interface BrowseValue {
  value: string;
  slug: string;
  count: number;
}

export interface BreadcrumbItem {
  label: string;
  href: string;
  isMono?: boolean;
  isTag?: boolean;
}

export type BreadcrumbLevel = BreadcrumbItem[];

type Entry = Post;
type BrowseExtractor = (entry: Entry) => string[];

/* -------------------------------------------------------------------------- */
/* Built-in extractors                                                        */
/* -------------------------------------------------------------------------- */

const extractors: Record<string, BrowseExtractor> = {
  published(entry) {
    return [String(new Date(entry.data.published).getFullYear())];
  },

  tags(entry) {
    return entry.data.tags ?? [];
  },
};

/* -------------------------------------------------------------------------- */
/* Extractor                                                                  */
/* -------------------------------------------------------------------------- */

function metaExtractor(key: string): BrowseExtractor {
  return (entry) => {
    const value = entry.data.meta?.[key];

    if (value == null) {
      return [];
    }

    if (Array.isArray(value)) {
      return value.filter(Boolean).map(String);
    }

    return [String(value)];
  };
}

function getExtractor(key: string): BrowseExtractor {
  return extractors[key] ?? metaExtractor(key);
}

/* -------------------------------------------------------------------------- */
/* Public                                                                     */
/* -------------------------------------------------------------------------- */

export function getBrowseValues(
  entries: Entry[],
  key: string,
): BrowseValue[] {
  const extract = getExtractor(key);

  const counts = new Map<string, number>();

  for (const entry of entries) {
    for (const value of extract(entry)) {
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([value, count]) => ({
      value,
      slug: slugify(value),
      count,
    }))
    .sort((a, b) => a.value.localeCompare(b.value));
}

export function filterBrowseEntries<T extends Entry>(
  entries: T[],
  key: string,
  slug: string,
): T[] {
  const extract = getExtractor(key);

  return entries.filter((entry) =>
    extract(entry).some((value) => slugify(value) === slug),
  );
}

export async function getBrowseDimensions() {
  const cfg = await getConfig();
  return cfg.browse?.dimensions ?? [];
}

/**
 * Derives contextual Browse-driven breadcrumb levels for a post from the site's
 * Browse configuration and the post's metadata.
 *
 * Example structure:
 *   notes / 2026 / #photography #travel
 */
export function getPostBreadcrumbs(
  post: Entry,
  config?: UserConfig,
): BreadcrumbLevel[] {
  const activeConfig = config ?? defaultConfig;
  const dimensions = activeConfig?.browse?.dimensions ?? [];
  const levels: BreadcrumbLevel[] = [];

  // 1. Root / Content-type segment (e.g. 'notes')
  let rootSegment: BreadcrumbItem | null = null;
  const typeDimension = dimensions.find((d) =>
    ["notes", "type", "content_type", "kind", "section", "collection"].includes(d.key.toLowerCase()) ||
    ["notes", "types", "kinds", "sections"].includes(d.slug.toLowerCase()),
  );

  if (typeDimension) {
    const extract = getExtractor(typeDimension.key);
    const values = extract(post);
    if (values.length > 0) {
      rootSegment = {
        label: values[0].toLowerCase(),
        href: `/browse/${typeDimension.slug}/${slugify(values[0])}`,
      };
    } else {
      rootSegment = {
        label: (typeDimension.slug || typeDimension.label).toLowerCase(),
        href: `/browse/${typeDimension.slug}`,
      };
    }
  }

  if (!rootSegment) {
    const postsLink = activeConfig?.headerLinks?.find((l) => l.url === "/posts");
    const label = postsLink
      ? postsLink.label.toLowerCase() === "blog"
        ? "notes"
        : postsLink.label.toLowerCase()
      : "notes";
    rootSegment = {
      label,
      href: "/posts",
    };
  }

  levels.push([rootSegment]);

  // 2. Custom metadata dimensions (e.g. topic, category)
  const customDimensions = dimensions.filter((d) => {
    const k = d.key.toLowerCase();
    const s = d.slug.toLowerCase();
    const isType = ["notes", "type", "content_type", "kind", "section", "collection"].includes(k) || s === "notes";
    const isYear = ["published", "year", "date"].includes(k) || ["years", "year"].includes(s);
    const isTags = ["tags", "tag"].includes(k) || s === "tags";
    return !isType && !isYear && !isTags;
  });

  for (const customDim of customDimensions) {
    const extract = getExtractor(customDim.key);
    const values = extract(post);
    if (values.length > 0) {
      levels.push(
        values.map((v) => ({
          label: v.toLowerCase(),
          href: `/browse/${customDim.slug}/${slugify(v)}`,
        })),
      );
    }
  }

  // 3. Year / Publication Date dimension (e.g. '2026')
  const yearDimension = dimensions.find((d) =>
    ["published", "year", "date"].includes(d.key.toLowerCase()) ||
    ["years", "year"].includes(d.slug.toLowerCase()),
  );

  if (post.data.published) {
    const yearStr = String(new Date(post.data.published).getFullYear());
    const yearSlug = yearDimension?.slug || "years";
    levels.push([
      {
        label: yearStr,
        href: `/browse/${yearSlug}/${yearStr}`,
        isMono: true,
      },
    ]);
  }

  // 4. Tags dimension (e.g. '#photography #travel')
  const tagDimension = dimensions.find((d) =>
    ["tags", "tag"].includes(d.key.toLowerCase()) ||
    ["tags", "tag"].includes(d.slug.toLowerCase()),
  );

  const tags = post.data.tags ?? [];
  if (tags.length > 0) {
    const tagSlug = tagDimension?.slug || "tags";
    levels.push(
      tags.map((t) => ({
        label: `#${t}`,
        href: `/browse/${tagSlug}/${slugify(t)}`,
        isTag: true,
        isMono: true,
      })),
    );
  }

  return levels;
}
