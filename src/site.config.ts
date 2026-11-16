import type { UserConfig } from './types.ts';

export const defaultConfig: UserConfig = {
  // A. Site Identity
  title:       'Tiny',
  description: 'A tiny publishing theme for Astro.',
  locale:      'en',

  author: {
    name: 'Your Name',
  },

  // B. Navigation
  headerLinks: [
    { label: 'Blog',   url: '/posts' },
    { label: 'Browse', url: '/browse' },
    { label: 'Search', url: '/search' },
    { label: 'About',  url: '/about' },
  ],

  footerLinks: [
    { label: 'Now',      url: '/now' },
    { label: 'Colophon', url: '/colophon' },
    { label: 'Docs',     url: '/docs' },
    { label: 'RSS',      url: '/rss.xml' },
  ],

  socialLinks: [],

  footerCredits: 'Built with Tiny',

  // C. Browse
  browse: {
    dimensions: [],
  },

  // D. SEO
  seo: {
    siteUrl: '',
    defaultOgImage: '',
    titleTemplate: '%s | %s',
    twitterHandle: '',
  },

  // E. Theme
  theme: {
    enabled: true,
    default: 'system',
  },

  // F. Features
  features: {
    sourceGutter: true,
    backlinks: true,
    math: true,
    search: true,
    docs: true,
    toc: true,
  },

  // G. Search
  search: {
    enabled: true,
  },

  // H. Analytics (Disabled by default)
  analytics: {
    provider: null,
    id: '',
    host: '',
  },

  // I. UI Text and Localisation
  ui: {
    skipToContent: 'Skip to content',
    older: 'Older',
    newer: 'Newer',
    search: 'Search',
    notFound: 'Page not found',
    backHome: 'Go back home',
    tableOfContents: 'Table of Contents',
    inboundReferences: 'Inbound References',
    writing: 'Writing',
    allPosts: 'All posts',
  },
};
