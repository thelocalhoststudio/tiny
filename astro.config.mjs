// @ts-check
import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import { wikilinkResolver, directiveToHtml, obsidianTextFormatting } from './src/plugins/satteri.ts';
import { resolveVaultImagePaths, imageAttributes, galleryGrouping } from './src/plugins/satteri-gallery.ts';

// astro:env isn't available yet at config-load time, so read .env directly.
try {
  process.loadEnvFile();
} catch {
  // no .env file — SITE_URL must already be set in the environment
}

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL,
  experimental: {
    contentIntellisense: true,
  },
  integrations: [mdx(), sitemap()],

  markdown: {
    processor: satteri({
      mdastPlugins: [
        directiveToHtml,
        obsidianTextFormatting,
        resolveVaultImagePaths,
      ],
      hastPlugins: [
        wikilinkResolver,
        imageAttributes,
        galleryGrouping,
      ],
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