import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

export const POSTS_PATH = 'src/content/posts/';
export const PAGES_PATH = 'src/content/pages/';
export const DOCS_PATH = 'src/content/docs/';

function removeDupsAndLowerCase(array: string[]) {
  if (!array.length) return array;
  const lowercaseItems = array.map((str) => str.toLowerCase());
  const distinctItems = new Set(lowercaseItems);
  return Array.from(distinctItems);
}

// Author-defined extension point — Template assigns no meaning to any key
// inside `meta`. See site/config.md's `browse.dimensions` for how a key
// becomes a browsable dimension.
const metaSchema = z.record(z.string(), z.union([z.string(), z.array(z.string())])).optional();

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    tags: z
      .array(
        z.string().regex(
          /^[a-zA-Z]+(?:-[a-zA-Z]+)*$/,
          'Tags must contain only letters.',
        ),
      )
      .transform(removeDupsAndLowerCase)
      .default([]),
    meta: metaSchema,
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    updated: z.coerce.date().optional(),
  }),
});

const docs = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    group: z.string().default('General'),
    order: z.number().default(0),
    updated: z.coerce.date().optional(),
  }),
});

const siteConfig = defineCollection({
  loader: glob({ pattern: 'config.md', base: './src/content/site' }),
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    locale: z.string().optional(),
    author: z
      .object({
        name: z.string(),
        url: z.string().optional(),
        avatar: z.string().optional(),
      })
      .optional(),
    headerLinks: z
      .array(
        z.object({
          label: z.string(),
          url: z.string(),
        }),
      )
      .optional(),
    footerLinks: z
      .array(
        z.object({
          label: z.string(),
          url: z.string(),
        }),
      )
      .optional(),
    socialLinks: z
      .array(
        z.object({
          label: z.string(),
          url: z.string(),
        }),
      )
      .optional(),
    footerCredits: z.string().optional(),
    browse: z
      .object({
        dimensions: z
          .array(
            z.object({
              key: z.string(),
              slug: z.string(),
              label: z.string(),
            }),
          )
          .optional(),
      })
      .optional(),
    seo: z
      .object({
        siteUrl: z.string().optional(),
        defaultOgImage: z.string().optional(),
        titleTemplate: z.string().optional(),
        twitterHandle: z.string().optional(),
      })
      .optional(),
    theme: z
      .object({
        enabled: z.boolean().optional(),
        default: z.enum(['system', 'light', 'dark']).optional(),
      })
      .optional(),
    features: z
      .object({
        sourceGutter: z.boolean().optional(),
        backlinks: z.boolean().optional(),
        math: z.boolean().optional(),
        search: z.boolean().optional(),
        docs: z.boolean().optional(),
        toc: z.boolean().optional(),
      })
      .optional(),
    search: z
      .object({
        enabled: z.boolean().optional(),
      })
      .optional(),
    analytics: z
      .object({
        provider: z.enum(['plausible', 'fathom', 'umami']).nullable().optional(),
        id: z.string().optional(),
        host: z.string().optional(),
      })
      .optional(),
    ui: z.record(z.string(), z.string()).optional(),
  }).passthrough(),
});

export const collections = { posts, pages, docs, siteConfig };
