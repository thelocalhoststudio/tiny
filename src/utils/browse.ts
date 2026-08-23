import { getConfig } from "@/utils/config";
import { slugify } from "@/utils/text"
import type { Post } from "@/types";

export interface BrowseValue {
  value: string;
  slug: string;
  count: number;
}

type Entry = Post;
type BrowseExtractor = (entry: Entry) => string[];

const siteConfig = await getConfig();

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
    return siteConfig.browse?.dimensions ?? [];
}