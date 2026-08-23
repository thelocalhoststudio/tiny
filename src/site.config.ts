import type { UserConfig } from '@/types'

export const defaultConfig: UserConfig = {
  title:       'A Tiny Bear',
  description: 'A tiny Astro theme for people who want a website, not a web application',
  url:         'https://example.com',
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