// @ts-check
import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import {
  wikilinkResolver,
  directiveToHtml,
  obsidianTextFormatting,
  blockquoteAttribution,
} from './src/plugins/satteri.ts';
import {
  resolveVaultImagePaths,
  imageAttributes,
  galleryGrouping,
  imageCaption,
} from './src/plugins/satteri-gallery.ts';
import { sourceGutter } from './src/plugins/satteri-gutter.ts';
import { math } from './src/plugins/satteri-math.ts';
import { noteFileLinks } from './src/plugins/satteri-note-links.ts';
import { callout } from './src/plugins/satteri-callout.ts';

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
        callout,
        math,
        directiveToHtml,
        obsidianTextFormatting,
        resolveVaultImagePaths,
        noteFileLinks,
      ],
      hastPlugins: [
        wikilinkResolver,
        imageAttributes,
        galleryGrouping,
        imageCaption,
        blockquoteAttribution,
        sourceGutter,
      ],
      features: {
        math: true,
        wikilinks: true,
        directive: true,
        smartPunctuation: { quotes: true, dashes: true, ellipses: true },
        gfm: {
          footnotes: {
            label: "Footnotes",
            backContent: "↑",
            backLabel: "Back to reference {reference}",
          },
        },
        subscript: true,
        superscript: true,
      },
    }),
  },
});
