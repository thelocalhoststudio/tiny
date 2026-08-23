// @ts-check
import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://fieldnotes.example',
  experimental: {
    contentIntellisense: true,
  },
  integrations: [mdx(), sitemap()],

  markdown: {
    processor: satteri({
      features: {
        wikilinks: true,
        directive: true,
        smartPunctuation: { quotes: true, dashes: true, ellipses: true },
        gfm: {
          footnotes: {
            label: "Footnotes",
            backContent: "↑",
            backLabel: "Back to reference {reference}",
          }
        },
        subscript: true,
        superscript: true,
      }
    })
  }
});