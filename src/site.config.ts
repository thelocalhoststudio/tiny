import type { UserConfig } from '@/types'

export const defaultConfig: UserConfig = {
  title:       'Tiny',
  description: 'A tiny publishing theme for Astro.',
  locale:      'en',

  author: {
    name: 'Your Name',
  },

  headerLinks: [
    { label: 'Blog',  url: '/posts' },
    { label: 'Browse',   url: '/browse' },
    { label: 'About',   url: '/about' },
  ],

  footerLinks: [
    { label: 'Now',      url: '/now' },
    { label: 'Colophon', url: '/colophon' },
    { label: 'RSS',      url: '/rss.xml' },
  ],

  socialLinks: [],

  browse: {
    dimensions: [],
  },
}