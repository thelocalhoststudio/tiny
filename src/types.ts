import type { CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"posts">;
export type Page = CollectionEntry<"pages">;

export interface NavItem {
  label: string;
  url: string;
}

export interface AuthorConfig {
  name: string;
  url?: string;
  avatar?: string;
  bio?: string;
}

/* -------------------------------------------------------------------------- */
/* Browse                                                                     */
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
}

export interface BrowseConfig {
  dimensions?: BrowseDimension[];
}

/* -------------------------------------------------------------------------- */
/* Domains                                                                    */
/* -------------------------------------------------------------------------- */

export type ThemeMode = 'system' | 'light' | 'dark';

export interface ThemeConfig {
  enabled?: boolean;
  default?: ThemeMode;
}

export interface SeoConfig {
  siteUrl?: string;
  defaultOgImage?: string;
  titleTemplate?: string;
  twitterHandle?: string;
}

export interface FeatureFlags {
  sourceGutter?: boolean;
  backlinks?: boolean;
  math?: boolean;
  search?: boolean;
  docs?: boolean;
  toc?: boolean;
}

export interface SearchConfig {
  enabled?: boolean;
}

export type AnalyticsProvider = 'plausible' | 'fathom' | 'umami' | null;

export interface AnalyticsConfig {
  provider?: AnalyticsProvider;
  id?: string;
  host?: string;
}

export interface UiTextConfig {
  skipToContent?: string;
  older?: string;
  newer?: string;
  search?: string;
  notFound?: string;
  backHome?: string;
  tableOfContents?: string;
  inboundReferences?: string;
  writing?: string;
  allPosts?: string;
}

/* -------------------------------------------------------------------------- */
/* User Configuration                                                         */
/* -------------------------------------------------------------------------- */

export interface UserConfig {
  // A. Site Identity
  title: string;
  description: string;
  locale?: string;
  author: AuthorConfig;

  // B. Navigation
  headerLinks?: NavItem[];
  footerLinks?: NavItem[];
  socialLinks?: NavItem[];
  footerCredits?: string;

  // C. Browse
  browse?: BrowseConfig;

  // D. SEO
  seo?: SeoConfig;

  // E. Theme
  theme?: ThemeConfig;

  // F. Features
  features?: FeatureFlags;

  // G. Search
  search?: SearchConfig;

  // H. Analytics
  analytics?: AnalyticsConfig;

  // I. UI Text and Localisation
  ui?: UiTextConfig;
}
