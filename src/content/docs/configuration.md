---
title: Configuration
description: Customizing site metadata, navigation, SEO, theme, features, and browse taxonomy.
group: Guide
order: 2
---

## Overview

Tiny 2027 separates configuration into clear, modular domains while maintaining 100% backward compatibility with existing configurations.

Configuration can be set globally in `src/site.config.ts` (theme defaults) or customized in your vault note at `src/content/site/config.md`.

## Configuration Domains

### 1. Site Identity

Basic site and author metadata:

```yaml
title: Field Notes
description: A small independent space for notes, essays, and experiments.
locale: en
author:
  name: John Doe
  url: https://fieldnotes.example
  avatar: /images/avatar.svg
```

### 2. Navigation

Header, footer, and social links:

```yaml
headerLinks:
  - label: Blog
    url: /posts
  - label: Browse
    url: /browse
  - label: Docs
    url: /docs
  - label: Search
    url: /search
  - label: About
    url: /about

footerLinks:
  - label: Now
    url: /now
  - label: Colophon
    url: /colophon
  - label: RSS
    url: /rss.xml

socialLinks:
  - label: Mastodon
    url: https://mastodon.social/@fieldnotes
  - label: GitHub
    url: https://github.com/fieldnotes

footerCredits: Built with Tiny
```

### 3. Browse Engine

Multi-dimensional taxonomy indexing:

```yaml
browse:
  dimensions:
    - key: tags
      slug: tags
      label: Tags
    - key: published
      slug: years
      label: Years
    - key: topic
      slug: topics
      label: Topics
```

### 4. SEO

Open Graph, Twitter cards, and title templating:

```yaml
seo:
  siteUrl: https://fieldnotes.example
  defaultOgImage: /images/og-default.png
  titleTemplate: "%s | %s"
  twitterHandle: "@fieldnotes"
```

### 5. Theme

Control theme availability and initial mode:

```yaml
theme:
  enabled: true
  default: system # 'system' | 'light' | 'dark'
```

### 6. Features

Feature switches for optional components and capabilities:

```yaml
features:
  sourceGutter: true # Markdown source gutter
  backlinks: true    # Inbound reference discovery & badges
  math: true         # KaTeX build-time math
  search: true       # Static search indexing
  docs: true         # Documentation section
  toc: true          # Table of Contents
```

### 7. Search

Control search availability:

```yaml
search:
  enabled: true
```

### 8. Analytics

Privacy-respecting, zero-cookie analytics (disabled by default):

```yaml
analytics:
  provider: null # 'plausible' | 'fathom' | 'umami' | null
  id: ""
  host: ""       # Optional custom proxy host
```

When `provider` is `null` or omitted, zero tracking scripts are emitted.

### 9. UI Text

Centralized user interface strings:

```yaml
ui:
  skipToContent: Skip to content
  older: Older
  newer: Newer
  search: Search
  notFound: Page not found
  backHome: Go back home
  tableOfContents: Table of Contents
  inboundReferences: Inbound References
  writing: Writing
  allPosts: All posts
```

## How Configuration Merging Works

- **Deep Merge on Object Domains**: Settings in `author`, `seo`, `theme`, `features`, `search`, `analytics`, and `ui` merge deeply. Overriding a single property (e.g. `theme.default: dark`) preserves all sibling defaults.
- **Full Replacement on Arrays**: Lists (`headerLinks`, `footerLinks`, `socialLinks`, `browse.dimensions`) are replaced entirely to provide full control over item ordering.
- **Backward Compatibility**: Existing configuration files without the new domains continue to run without any modification.
