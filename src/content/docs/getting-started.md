---
title: Getting Started
description: Installation, prerequisites, and quick setup instructions for Tiny.
group: Guide
order: 1
---

Tiny is a minimal, content-first publishing theme for [Astro](https://astro.build). It is designed for personal essays, working notes, and field observations with zero unnecessary client-side JavaScript.

## Prerequisites

Tiny requires Node.js and the `pnpm` package manager:

- **Node.js**: version `22.12.0` or newer
- **pnpm**: version `9.x` or newer recommended

Check your current installed versions:

```sh
node -v
pnpm -v
```

## Installation

Clone the repository and install project dependencies:

```sh
git clone https://github.com/thelocalhoststudio/tiny.git
cd tiny
pnpm install
```

Copy the environment template:

```sh
cp .env.example .env
```

In `.env`, configure your site URL (used for canonical links, sitemaps, and RSS feeds):

```sh
SITE_URL=https://your-domain.example
```

## Available Scripts

Tiny provides straightforward scripts via `package.json`:

| Command | Action |
| :--- | :--- |
| `pnpm dev` | Starts the Astro development server with live reload |
| `pnpm build` | Compiles your Markdown content into static HTML in `./dist` |
| `pnpm preview` | Serves the production build locally for verification |
| `pnpm test` | Runs the full unit and integration test suite (`tests/tiny.check.ts`) |

## Repository Overview

```
├── src/
│   ├── content/
│   │   ├── posts/        # Blog posts and long-form essays
│   │   ├── pages/        # Static pages (about, colophon, now)
│   │   ├── docs/         # Documentation collection
│   │   └── site/         # Vault config override (config.md)
│   ├── layouts/          # Base, Post, Page, and Doc layouts
│   ├── plugins/          # Sätteri Markdown plugins (callout, gutter, math)
│   ├── utils/            # Content, Browse, SEO, and text utilities
│   ├── site.config.ts    # Default configuration schema and fallbacks
│   └── styles/           # Global CSS, typography, and theme variables
└── tests/                # Automated verification suite
```

## Next Steps

1. Configure site identity and navigation in [Configuration](/docs/configuration).
2. Learn how to organise posts and pages in [Content Structure](/docs/content-structure).
3. Explore supported syntax and callouts in the [Markdown Guide](/docs/markdown-guide).
4. Understand cross-linking in [Wikilinks and Backlinks](/docs/wikilinks-and-backlinks).
