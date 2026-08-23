# Tiny

A tiny publishing theme for Astro.

## Philosophy

Tiny is built around one idea: a personal site should be mostly content,
not chrome. In practice that means:

- Minimal HTML, minimal CSS, no design-token system
- Zero unnecessary client-side JavaScript
- Few dependencies — Astro, one Markdown processor, RSS, sitemap
- System fonts by default, no font loading pipeline
- No cards, no badges, no pills, no decorative UI
- No CSS framework, no JS framework, no client router
- A simple Astro architecture: content collections in, static HTML out

This isn't a claim about being the fastest Astro theme, just a theme that
tries hard not to add anything a small personal site doesn't need.

## Features

- **Posts and pages** as Astro content collections, with a browse system for
  tags, years, and any custom frontmatter metadata you define
- **Markdown and MDX** support for both posts and pages
- **RSS feed** (`/rss.xml`) and **XML sitemap**
- **Site configuration as content** — `src/content/site/config.md`, not a
  code file
- **Sätteri**-powered Markdown pipeline: GFM tables and footnotes,
  wikilinks (`[[Post Title]]`), container directives (`:::aside`,
  `:::annotation`), smart punctuation, subscript/superscript, and
  Obsidian-style `==highlights==` and `%%inline comments%%`
- **Image support** in post/page body content, with consecutive images
  automatically grouped into a simple CSS grid gallery — no JS, no
  lightbox library
- **Dark mode** via `prefers-color-scheme`, no toggle, no stored preference
- Canonical URLs, Open Graph/Twitter meta, and JSON-LD structured data
- Fully static output — no server required at runtime

## Requirements

- Node.js >= 22.12.0
- [pnpm](https://pnpm.io) (the project ships a `pnpm-lock.yaml`)

## Installation

```sh
git clone <your-fork-url>
cd tiny
pnpm install
cp .env.example .env
```

Set `SITE_URL` in `.env` to your site's real URL, then edit
`src/content/site/config.md` with your own title, description, and links
(see [Configuration](#configuration) below).

```sh
pnpm dev      # start the dev server
pnpm build    # build to ./dist
pnpm preview  # preview the production build locally
```

## Configuration

Tiny separates two kinds of configuration:

**`SITE_URL`** (in `.env`) — deployment configuration. It's the absolute
URL Astro needs to build canonical links, the sitemap, and RSS item links.
It is not content, and it isn't checked into git (`.env` is gitignored;
`.env.example` documents the variable for anyone cloning the repo).

**`src/content/site/config.md`** — content-facing site configuration: your
site's title, description, author, navigation links, and browse
dimensions. Edit this like any other piece of content.

A minimal example:

```yaml
---
title: My Site
description: Notes and short essays.
locale: en
author:
  name: Jane Doe
headerLinks:
  - label: Blog
    url: /posts
  - label: About
    url: /about
browse:
  dimensions:
    - key: tags
      slug: tags
      label: Tags
---
```

## Content

- **Posts** live in `src/content/posts/` as `.md` or `.mdx` files. Nested
  folders become part of the URL (`posts/travel/tokyo.md` →
  `/posts/travel/tokyo`); a folder prefixed with `_` is used for
  organization only and is left out of the URL.
- **Pages** live in `src/content/pages/` and are served at the site root
  (`pages/about.md` → `/about`).

Post frontmatter:

```yaml
---
title: A short post
description: One sentence, optional.
published: 2026-01-10
updated: 2026-02-01     # optional
draft: false            # drafts are hidden from production builds
tags: [notes, writing]  # letters only, lowercased automatically
meta:
  topic: Essays          # optional — becomes a browse dimension if configured
---

Ordinary Markdown content goes here.
```

Pages use the same idea with a smaller frontmatter: `title`, an optional
`description`, and an optional `updated` date.

## Images

Drop an image into a post with standard Markdown syntax:

```md
![A photo of the harbor at dusk](/images/posts/harbor.jpg)
```

Store images under `public/images/` and reference them with a root-relative
path. When two or more images appear back to back with nothing but
whitespace between them, Tiny groups them into a lightweight CSS grid
automatically — no gallery component or client-side script involved.

## Markdown

The Markdown pipeline is powered by **Sätteri** (`@astrojs/markdown-satteri`)
with a few extras enabled on top of standard GFM (tables, footnotes,
strikethrough):

- **Wikilinks** — `[[Post Title]]` links to that post by title
- **Directives** — `:::aside` and `:::annotation{date="2026-01-01"}` render
  as labeled callout blocks
- **Highlights and comments** — `==highlighted text==` renders as
  `<mark>`; `%%a note to self%%` is stripped from the output entirely
- **Smart punctuation, subscript, superscript** — plain ASCII in, typeset
  output out (`"quotes"` → “quotes”, `H~2~O`, `E=mc^2^`)

None of this is required — a post that never uses any of it reads exactly
the same as one that does.

## Development

```sh
pnpm dev       # dev server
pnpm build     # production build to ./dist
pnpm preview   # preview the production build
```

## Deployment

Tiny builds to plain static files (`astro build` → `./dist`), so it runs on
any static host — Cloudflare Pages, Netlify, Vercel, GitHub Pages, or your
own server. Cloudflare Pages is one option, not a requirement; there's no
adapter tying the project to a specific platform.

Whichever platform you use, set `SITE_URL` as a build-time environment
variable there too — it's read at build time, not runtime, so it has to be
present when `astro build` runs on the deploy platform, not just in your
local `.env`.

## Project structure

```text
src/
├── content/
│   ├── posts/        # blog posts (.md / .mdx)
│   ├── pages/         # standalone pages (.md / .mdx)
│   └── site/
│       └── config.md  # site-facing configuration
├── components/         # Header, Footer, PostList, etc.
├── layouts/
│   └── Base.astro      # the one shared page layout
├── pages/               # Astro routes
├── plugins/              # Sätteri mdast/hast plugins
├── styles/
│   └── global.css        # the entire stylesheet
└── utils/                 # content, browse, and URL helpers
```

## Non-goals

Tiny deliberately does not try to be:

- a CMS
- a page builder
- a design system
- a component-heavy theme
- an Obsidian-specific theme (it happens to read Obsidian-flavored
  Markdown quietly well, but that isn't its identity)
- a JavaScript application
