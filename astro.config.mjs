// @ts-check
import { readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import { wikilinkResolver, directiveToHtml, obsidianTextFormatting } from './src/plugins/satteri.ts';
import { resolveVaultImagePaths, imageAttributes, galleryGrouping } from './src/plugins/satteri-gallery.ts';


// astro:content isn't available yet at config-load time, so the site URL is
// read straight out of the siteConfig frontmatter instead of hardcoding it.
const siteConfigMd = readFileSync(
  new URL('./src/content/site/config.md', import.meta.url),
  'utf-8',
);
const site = siteConfigMd.match(/^url:\s*['"]?([^'"\n]+)['"]?\s*$/m)?.[1];

// https://astro.build/config
export default defineConfig({
  site,
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