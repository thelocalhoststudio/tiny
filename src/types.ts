import type { CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"posts">;
export type Page = CollectionEntry<"pages">;


export interface NavItem {
  label: string;
  url: string;
}

/* -------------------------------------------------------------------------- */
/* Browse */
/* -------------------------------------------------------------------------- */

export interface BrowseDimension {
  /**
   * Built-in:
   *   published
   *   tags
   *
   * Otherwise resolves to:
   *   entry.data.meta[key]
   */
  key: string;

  /** Display title. */
  label: string;

  /** URL segment. */
  slug: string;

  sort?: "asc" | "desc";
}

export interface BrowseConfig {
  dimensions?: BrowseDimension[];
}

/* -------------------------------------------------------------------------- */

export interface UserConfig {
  // site identity
  title: string;
  description: string;
  url: string;
  locale?: string;

  // author
  author: {
    name: string;
    url?: string;
    avatar?: string;
  };

  // navigation
  headerLinks?: NavItem[];
  footerLinks?: NavItem[];
  socialLinks?: NavItem[];

  // content display
  footerCredits?: string;

  // browse
  browse?: BrowseConfig;
}