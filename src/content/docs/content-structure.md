---
title: Content Structure & Authoring
description: Organizing content collections, frontmatter schemas, directory routing, and draft workflows.
group: Authoring
order: 3
---

Tiny organizes content using Astro Content Collections with strict schema validation. All content is stored as plain Markdown or MDX files within `src/content/`.

## Content Collections

Tiny defines four collections in `src/content.config.ts`:

| Collection | Base Directory | Routing | Purpose |
| :--- | :--- | :--- | :--- |
| `posts` | `src/content/posts/` | `/posts/[...slug]` | Articles, essays, and field notes |
| `pages` | `src/content/pages/` | `/[...slug]` | Top-level static pages (`about`, `colophon`, `now`) |
| `docs` | `src/content/docs/` | `/docs/[...slug]` | User documentation and technical guides |
| `site` | `src/content/site/` | Internal | Global vault configuration override (`config.md`) |

## Post Frontmatter Schema

Posts accept the following YAML frontmatter properties:

```yaml
---
title: Autumn in Kyoto
description: Reflections on photography and light.
published: 2025-11-12
updated: 2025-11-15
draft: false
tags:
  - photography
  - travel
meta:
  topic: Photography
---
```

### Supported Fields

- `title` *(required, string)*: The title of the post.
- `published` *(required, date)*: The initial publication date (`YYYY-MM-DD`). Used for chronological sorting and year navigation.
- `description` *(optional, string)*: Short summary used in post indexes, search excerpts, and Open Graph metadata.
- `updated` *(optional, date)*: Date of the most recent revision. Displayed alongside the publication date when present.
- `draft` *(optional, boolean, default: `false`)*: When set to `true`, excludes the entry from production builds and RSS feeds.
- `tags` *(optional, array of strings)*: Taxonomy tags. Tags must contain letters only (`^[a-zA-Z]+(?:-[a-zA-Z]+)*$`) and are automatically converted to lowercase.
- `meta` *(optional, record of strings or string arrays)*: Extension point for custom Browse dimensions (e.g. `topic: Photography`).

## Pages and Docs Schema

### Pages (`src/content/pages/`)

Static pages provide standalone routes like `/about` or `/colophon`:

```yaml
---
title: About
description: Who is behind this site.
updated: 2026-08-15
---
```

### Docs (`src/content/docs/`)

Documentation entries are structured into groups with explicit ordering:

```yaml
---
title: Getting Started
description: Installation and quick setup instructions.
group: Guide
order: 1
---
```

- `group` *(optional, string, default: `"General"`)*: The section grouping displayed on `/docs`.
- `order` *(optional, number, default: `0`)*: Integer controlling display sequence within and across groups.

## URL Slug Generation and Directory Organization

Posts support nested subdirectories:

- `src/content/posts/first-post.md` &rarr; `/posts/first-post`
- `src/content/posts/essays/deep-work.md` &rarr; `/posts/essays/deep-work`
- `src/content/posts/journal/index.md` &rarr; `/posts/journal`

### Hidden Folders

Directory segments beginning with an underscore `_` are ignored when generating URL slugs:

- `src/content/posts/_notebook/quick-thought.md` &rarr; `/posts/quick-thought`

This allows you to organize files in private vaults without affecting public URLs.

## Draft Workflow

To keep work-in-progress notes in your repository without publishing them:

```yaml
---
title: Thoughts in Progress
published: 2026-11-16
draft: true
---
```

When building for production (`pnpm build`), all entries with `draft: true` are filtered out from pages, search indices, RSS feeds, and sitemaps.
