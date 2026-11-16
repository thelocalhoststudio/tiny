# Tiny — Engineering Guide & Operational Manual

This document is the authoritative engineering guide for developers and AI agents working on **Tiny**.

## 1. Development & Operations

### Background Development Server

> [!IMPORTANT]
> When starting the development server, you **MUST** use background mode:
> ```sh
> astro dev --background
> ```
> Manage the background process with:
> - `astro dev status` — check whether the server is running
> - `astro dev logs` — view server logs and output
> - `astro dev stop` — terminate the background server

### Development Workflow

- **Package Manager**: `pnpm` (lockfile: `pnpm-lock.yaml`)
- **Node.js**: `>= 22.12.0`
- **Installation**: `pnpm install`
- **Development**: `pnpm dev` (or `astro dev --background`)
- **Production Build**: `pnpm build` (outputs static files to `./dist`)
- **Preview Build**: `pnpm preview`
- **Test Suite**: `pnpm test` (executes `node --experimental-strip-types ./tests/tiny.check.ts`)

---

## 2. Product Philosophy & Design Principles

Tiny is an editorial publishing theme for Astro inspired by Bearblog and Monoline.

- **Content-First**: Interfaces prioritize reading comfort. No decorative cards, gradients, pills, or container boxes.
- **Minimal JavaScript**: Static HTML generation by default. Client-side JS is strictly limited to theme persistence and static search filtering (vanilla JS, under 80 lines).
- **Build-Time Processing**: Markdown transformations, syntax gutter annotations, math rendering, wikilink resolution, and backlink graph construction happen entirely during the Astro build.
- **Typography**: Strictly two self-hosted variable typefaces:
  - **Geist Sans**: Body text, post titles, section headings, navigation, search.
  - **Geist Mono**: Dates, metadata, reading time, code blocks, and source gutter.
- **Accessibility & Standards**: Semantic HTML (`<article>`, `<aside>`, `<nav>`, `<details>`), WCAG AA color contrast, and keyboard navigation (`/` for search).

---

## 3. Project Structure

```
├── src/
│   ├── content/
│   │   ├── posts/         # Markdown/MDX articles and notes
│   │   ├── pages/         # Top-level static pages (about, colophon, now)
│   │   ├── docs/          # Documentation collection
│   │   └── site/          # Vault config override (config.md)
│   ├── components/        # Header, Footer, PostList, TableOfContents, ThemeToggle, Search
│   ├── layouts/
│   │   └── Base.astro     # Core layout wrapper with head, navigation, and theme script
│   ├── pages/
│   │   ├── posts/         # /posts and /posts/[...slug]
│   │   ├── browse/        # /browse and /browse/[dimension]/[value]
│   │   ├── docs/          # /docs and /docs/[...slug]
│   │   ├── search/        # /search and search.json.ts
│   │   ├── rss.xml.ts     # RSS feed generator
│   │   └── index.astro    # Home page
│   ├── plugins/
│   │   ├── satteri.ts            # Wikilink resolver, directives, highlights, quotes
│   │   ├── satteri-callout.ts    # Native Obsidian callout parser (MDAST)
│   │   ├── satteri-gutter.ts     # Markdown source gutter HAST markers (data-md)
│   │   ├── satteri-math.ts       # KaTeX build-time math parser
│   │   ├── satteri-note-links.ts # Relative file link resolution and backlink indexing
│   │   └── satteri-gallery.ts    # Consecutive image grouping and lightbox slides
│   ├── styles/
│   │   └── global.css     # Design tokens, themes, typography, and layout styles
│   ├── utils/
│   │   ├── config.ts      # Configuration loading and deep-merging
│   │   ├── content.ts     # Post sorting, slug helpers, and backlink graph
│   │   ├── browse.ts      # Multi-dimensional taxonomy and contextual breadcrumbs
│   │   └── text.ts        # Slugify, word counting, reading minutes, excerpting
│   ├── site.config.ts     # Default configuration schema (9 domains)
│   ├── content.config.ts  # Astro Content Collections schemas (Zod)
│   └── env.d.ts           # Ambient type declarations
└── tests/
    └── tiny.check.ts      # Unit and integration test suite
```

---

## 4. Architecture & Data Flow

### A. Configuration Pipeline
Configuration is organized into 9 domains: Site Identity, Navigation, Browse, SEO, Theme, Features, Search, Analytics, and UI Text.
- Default values are defined in `src/site.config.ts`.
- User overrides are specified in `src/content/site/config.md`.
- `getConfig()` in `src/utils/config.ts` merges user settings over defaults:
  - **Object domains** (`seo`, `theme`, `features`, `search`, `analytics`, `ui`) merge deeply.
  - **Array lists** (`headerLinks`, `footerLinks`, `socialLinks`, `browse.dimensions`) are replaced completely.

### B. Markdown Pipeline (Sätteri)
The Markdown pipeline executes inside `@astrojs/markdown-satteri` (`astro.config.mjs`):
1. **MDAST Phase**:
   - `callout`: Identifies `> [!TYPE]` blockquotes and converts them to semantic `<aside class="callout callout-type">` containers.
   - `math`: Parses `$inline$` and `$$display$$` math.
   - `directiveToHtml`: Translates generic directives.
   - `obsidianTextFormatting`: Handles `==highlights==` and `%%comments%%`.
   - `resolveVaultImagePaths`: Rewrites vault-relative image paths.
   - `noteFileLinks`: Rewrites `./file.md` relative links to `/posts/<slug>`.
2. **HAST Phase**:
   - `wikilinkResolver`: Normalizes `[[Target]]` hrefs to `/posts/<slug>`.
   - `imageAttributes`: Adds lazy loading, decoding async, and captions.
   - `galleryGrouping`: Merges consecutive image paragraphs into `.gallery-grid` with pure CSS `:target` lightbox overlays.
   - `imageCaption`: Applies `.editorial-caption` to italicized lines following images.
   - `blockquoteAttribution`: Formats `-- Author` citations.
   - `sourceGutter`: Appends `data-md` attributes to blocks for desktop gutter rendering.

### C. Browse Engine & Breadcrumbs
- `src/utils/browse.ts` extracts dimension values dynamically using configured keys (`tags`, `published`, `topic`).
- Routes are generated at `/browse/[dimension]/` and `/browse/[dimension]/[value]`.
- Post breadcrumbs (`notes / 2026 / #tag`) are generated by `getPostBreadcrumbs()` matching post frontmatter against configured dimensions.

### D. Inbound Backlink Graph
- `src/plugins/satteri-note-links.ts` extracts referenced slugs using `linkedIds()`.
- `src/utils/content.ts` creates an inverted index mapping target slugs & titles to referring posts.
- `getInboundLinks(post)` matches against target ID, slug, and title, excluding self-links.

---

## 5. Content Conventions

### Collections and Schemas
- **Posts** (`src/content/posts/`): Requires `title`, `published` (`YYYY-MM-DD`). Optional: `description`, `updated`, `draft` (boolean), `tags` (lowercase letters and hyphens only), `meta` (record for Browse dimensions).
- **Pages** (`src/content/pages/`): Requires `title`. Optional: `description`, `updated`. Served at root URL (`/about`).
- **Docs** (`src/content/docs/`): Requires `title`. Optional: `description`, `group`, `order`, `updated`. Served at `/docs/[slug]`.

### Slug Rules
- Nested directories are preserved in URLs: `src/content/posts/essays/deep-work.md` &rarr; `/posts/essays/deep-work`.
- Folders prefixed with `_` are omitted from the URL path: `src/content/posts/_notebook/idea.md` &rarr; `/posts/idea`.

### Wikilink Scope Limitation
- Wikilinks resolve **exclusively** to post routes (`/posts/<slug>`).
- To link to static pages (`/about`, `/colophon`, `/docs`), use standard Markdown links (`[About](/about)`).

---

## 6. The 10 Development Guardrails

1. **Do not break existing content or frontmatter compatibility**: Existing Markdown files and metadata keys must continue to render correctly.
2. **Do not change public URLs without an explicit requirement**: Preserve existing routes for posts, pages, and browse dimensions.
3. **Do not bypass or duplicate the metadata-driven Browse engine**: Always register dimensions via configuration and use `src/utils/browse.ts`.
4. **Do not hardcode Browse dimensions or generated routes**: Derive navigation and breadcrumbs dynamically from config.
5. **Keep Markdown processing in the established Sätteri pipeline**: Add plugins to `astro.config.mjs` rather than preprocessing files with ad-hoc scripts.
6. **Preserve existing wikilink and backlink behaviour**: Maintain bidirectional link extraction through `linkedIds()` and `getInboundLinks()`.
7. **Prefer build-time processing over client-side JavaScript**: Precompute everything during static compilation.
8. **Do not introduce a frontend framework or unnecessary runtime dependencies**: Keep the output 100% static HTML and CSS.
9. **Reuse existing design tokens and components**: Adhere to the Geist typography rules and CSS variables in `global.css`.
10. **Add or update tests when changing content processing or routing behaviour**: Keep `tests/tiny.check.ts` passing at all times.
