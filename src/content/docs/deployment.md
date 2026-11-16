---
title: Deployment & Production
description: Building static output, configuring site environment variables, and deploying to static hosting platforms.
group: Operations
order: 6
---

Tiny generates 100% static HTML, CSS, and images. It does not require a Node.js runtime, serverless functions, or a database in production.

## Building the Site

To create an optimized production build:

```sh
pnpm build
```

This compiles your content into the `./dist` directory:

```
dist/
├── index.html
├── posts/
│   ├── index.html
│   └── ...
├── browse/
├── docs/
├── rss.xml
├── sitemap-index.xml
└── ...
```

To test the compiled production site locally before deploying:

```sh
pnpm preview
```

## Environment Variables

Tiny requires one critical environment variable: `SITE_URL`.

| Variable | Description | Example |
| :--- | :--- | :--- |
| `SITE_URL` | Canonical URL of your site (without trailing slash) | `https://fieldnotes.example` |

`SITE_URL` is used to generate:
- Canonical link tags `<link rel="canonical">`
- Absolute links in the RSS feed (`/rss.xml`)
- Sitemaps (`/sitemap-index.xml`)
- Open Graph and Twitter share card URLs

### Local Development vs Production

In local development, define `SITE_URL` in `.env`:

```sh
SITE_URL=http://localhost:4321
```

In production, set `SITE_URL` in your hosting platform's environment variables dashboard.

## Deployment Platforms

### Cloudflare Pages

1. Create a new Cloudflare Pages project connected to your Git repository.
2. Configure build settings:
   - **Framework preset**: None / Astro
   - **Build command**: `pnpm build`
   - **Build output directory**: `dist`
3. In **Environment Variables**, set:
   - `NODE_VERSION`: `22.12.0`
   - `SITE_URL`: `https://your-site.pages.dev`

### Vercel

1. Import your repository into Vercel.
2. Vercel automatically detects Astro.
3. In **Project Settings** &rarr; **Environment Variables**, add `SITE_URL`.

### Netlify

1. Link your repository in Netlify.
2. Build settings:
   - **Build command**: `pnpm build`
   - **Publish directory**: `dist`
3. In **Site Configuration** &rarr; **Environment variables**, set `SITE_URL` and `NODE_VERSION: 22.12.0`.

### GitHub Pages

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
        env:
          SITE_URL: https://yourusername.github.io/tiny
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```
