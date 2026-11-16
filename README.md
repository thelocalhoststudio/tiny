# Tiny

A minimalist, content-first publishing theme for [Astro](https://astro.build).

Designed for independent writers, researchers, and builders who value clean typography, thoughtful reading experiences, and durable plain-text authoring.

## Philosophy

Tiny is built around one idea: a personal publishing site should be mostly content, not chrome.

- **Content-first editorial layout**: Minimal HTML and CSS, restrained design tokens, and no decorative cards, gradients, or pills.
- **Zero unnecessary client JavaScript**: Static HTML generation by default; only client theme switching and fast search use minimal vanilla JS.
- **Durable Markdown authoring**: Full support for Obsidian-compatible wikilinks, native callouts, KaTeX math, and relative note links.
- **Self-hosted variable typography**: Typeset exclusively in Geist Sans (body, headings, UI) and Geist Mono (metadata, dates, code, source gutter). Zero external CDN font requests.
- **Metadata-driven discovery**: Configurable multi-dimensional Browse engine for tags, years, topics, and author metadata.

## Feature Overview

- **Posts, Pages, and Docs Collections** — Statically verified through Astro Content Collections schemas.
- **Native Obsidian Callouts** — Build-time semantic `<aside>` callouts supporting 10 standard types (`NOTE`, `INFO`, `TIP`, `IMPORTANT`, `WARNING`, `CAUTION`, `DANGER`, `SUCCESS`, `QUESTION`, `ABSTRACT`) with custom titles and nested Markdown.
- **Markdown Source Gutter** — Build-time syntax markers (`#`, `##`, `-`, `1.`, `>`, `[!tip]`, ` ``` `, `$$`, `![]`, `|`) rendered in a dedicated left gutter on desktop and inline on mobile via semantic `data-md` HAST attributes.
- **Fast Build-Time Math** — KaTeX rendering for `$inline$` and `$$display$$` math expressions with zero client-side math script.
- **Wikilinks, Relative Note Links & Inbound Backlinks** — `[[Post Title]]`, `[[Post Title|Alias]]`, `[[Post Title#Section]]`, and relative `./note.md` links resolved at build time; inbound references automatically indexed and displayed.
- **Contextual Browse Breadcrumbs** — Compact, clickable breadcrumb paths above post titles (`notes / 2026 / #tag`) derived directly from configured Browse dimensions.
- **Multi-Year Post Archive** — Chronological post index grouped by year with fixed date columns, horizontal year jumps, and inbound reference badges.
- **Fast Static Search** (`/search`) — Full-text search over a static JSON index (`/search.json`) with live `<mark>` keyword highlighting and `/` keyboard shortcut.
- **Light, Dark, and System Theme Modes** — Pure CSS variables with a zero-flash inline script and accessible header toggle.
- **Editorial Images & Pure CSS Lightbox** — Automatic responsive CSS grid gallery grouping for consecutive images, pure CSS zero-JS modal lightbox (`:target`), and editorial captions (`*caption*`).
- **Standard Feeds** — RSS feed (`/rss.xml`) and sitemap (`/sitemap-index.xml`).

## Requirements

- **Node.js**: `>= 22.12.0`
- **pnpm**: `>= 9.0.0` recommended (repository includes `pnpm-lock.yaml`)

## Quick Start

```sh
# Clone the repository
git clone https://github.com/thelocalhoststudio/tiny.git
cd tiny

# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env

# Start local development server
pnpm dev
```

Visit `http://localhost:4321` in your browser.

## Development Scripts

| Command | Action |
| :--- | :--- |
| `pnpm dev` | Start development server |
| `pnpm build` | Compile static production build to `./dist` |
| `pnpm preview` | Preview production build locally |
| `pnpm test` | Run complete unit and integration test suite (`tests/tiny.check.ts`) |

> [!NOTE] Background Development Server
> When running Astro in background automation, use:
> ```sh
> astro dev --background
> ```
> Manage the process with `astro dev status`, `astro dev logs`, and `astro dev stop`.

## Configuration Architecture

Tiny organizes configuration into clear, modular domains defined in `src/site.config.ts` and customizable in `src/content/site/config.md`:

1. **Site Identity**: `title`, `description`, `locale`, `author` (name, url, avatar).
2. **Navigation**: `headerLinks`, `footerLinks`, `socialLinks`, `footerCredits`.
3. **Browse**: Configurable dimensions mapping frontmatter keys to URL paths (e.g., `tags`, `published` as `years`, `topic` as `topics`).
4. **SEO**: `siteUrl`, `defaultOgImage`, `titleTemplate`, `twitterHandle`.
5. **Theme**: `enabled`, `default` (`system` | `light` | `dark`).
6. **Features**: Feature flags for `sourceGutter`, `backlinks`, `math`, `search`, `docs`, `toc`.
7. **Search**: `enabled`.
8. **Analytics**: Privacy-respecting analytics provider (`plausible`, `fathom`, `umami`, or `null`).
9. **UI Text**: Localized interface strings (`skipToContent`, `older`, `newer`, `search`, `inboundReferences`, etc.).

Read the [Configuration Guide](src/content/docs/configuration.md) for full reference.

## Content Structure

- **Posts** (`src/content/posts/`): Long-form articles and notes. Nested folders become URL segments (`posts/essays/deep-work.md` &rarr; `/posts/essays/deep-work`); folders prefixed with `_` are omitted from the URL.
- **Pages** (`src/content/pages/`): Top-level static pages (`about.md`, `colophon.md`, `now.md`).
- **Docs** (`src/content/docs/`): Grouped documentation entries (`getting-started.md`, `configuration.md`, etc.).

Example post frontmatter:

```yaml
---
title: Autumn in Kyoto
description: Morning light, temples, and shooting with a fixed prime lens.
published: 2025-11-12
tags: [photography, travel]
meta:
  topic: Photography
---
```

Read [Content Structure & Authoring](src/content/docs/content-structure.md) for complete details.

## Markdown & Sätteri Pipeline

Tiny's Markdown pipeline is powered by **Sätteri** (`@astrojs/markdown-satteri`) with custom AST plugins:

```
Markdown Source
  │
  ├── MDAST Plugins (Callouts, Math, Directives, Vault Images, Note Links)
  │
  ├── Sätteri Core Transform
  │
  └── HAST Plugins (Wikilinks, Image Attributes, Gallery, Captions, Source Gutter)
```

- **Callouts**:
  ```markdown
  > [!TIP] Photography Tip
  > Meter for the highlights when shooting morning mist.
  ```
- **Math**: `$E = mc^2$` and `$$\int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}$$`.
- **Wikilinks**: `[[Post Title]]`, `[[Post Title|Alias]]`, `[[Post Title#Heading]]`. (Resolves to `/posts/<slug>`).
- **Galleries**: Consecutive image paragraphs automatically group into a CSS grid with a pure CSS lightbox.

Read the [Markdown Features Guide](src/content/docs/markdown-guide.md) and [Wikilinks & Backlinks](src/content/docs/wikilinks-and-backlinks.md).

## Project Documentation

Full documentation is available directly within the theme at `/docs` (and in source under `src/content/docs/`):

- [Getting Started](src/content/docs/getting-started.md)
- [Configuration Reference](src/content/docs/configuration.md)
- [Content Structure & Authoring](src/content/docs/content-structure.md)
- [Markdown Features](src/content/docs/markdown-guide.md)
- [Wikilinks and Backlinks](src/content/docs/wikilinks-and-backlinks.md)
- [Deployment & Production](src/content/docs/deployment.md)

## License

MIT License. See [LICENSE](LICENSE) for details.
