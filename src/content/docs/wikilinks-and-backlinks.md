---
title: Wikilinks and Backlinks
description: Interconnecting notes with Obsidian-style wikilinks, relative paths, and automatic reciprocal backlink discovery.
group: Authoring
order: 5
---

Tiny provides first-class support for interconnected personal notes. Writing links between articles feels native to Obsidian or Roam, while compiling to standard, accessible HTML links at build time with zero client JavaScript.

## Supported Wikilink Syntax

Tiny's Markdown pipeline recognises standard Obsidian-compatible wikilinks:

| Syntax | Output Route | Example |
| :--- | :--- | :--- |
| `[[Post Title]]` | `/posts/post-title` | `[[Autumn in Kyoto]]` |
| `[[Post Title\|Custom Label]]` | `/posts/post-title` with alias text | `[[Autumn in Kyoto\|Kyoto morning]]` |
| `[[Post Title#Section Heading]]` | `/posts/post-title#section-heading` | `[[Autumn in Kyoto#Fushimi in the Mist]]` |
| `[[#Section Heading]]` | `#section-heading` (same-page jump) | `[[#supported-wikilink-syntax]]` |

### Important: Route Scope Limitation

> [!WARNING] Resolution Scope
> Wikilinks resolve exclusively to blog post routes under `/posts/`.
> 
> Writing `[[About]]` resolves to `/posts/about`. It will **not** resolve to a static top-level page at `/about`.
> To link to static pages (`about`, `now`, `colophon`, `docs`), use standard Markdown links: `[About](/about)`.

## Relative Markdown File Links

If your notes are authored in a local folder with relative file links, Tiny automatically converts them during build:

```markdown
See [local software](./local-first-software.md) or the [guide](../posts/autumn-in-kyoto.md#fushimi-in-the-mist).
```

This compiles cleanly to:

```html
<a href="/posts/local-first-software">local software</a>
```

You can keep your links working both inside your local Markdown editor and on the published web.

## Inbound References (Backlinks)

When one post links to another (via a wikilink, relative Markdown link, or root-relative post path), Tiny builds an in-memory bi-directional link graph during static compilation.

### Matching Criteria

When calculating backlinks for a post, Tiny matches references against:
1. The post's file slug path (e.g. `autumn-in-kyoto`)
2. The final segment of the file path
3. The slugified title of the post
4. The content collection ID

### Where Backlinks Appear

1. **Header Metadata**: If a post has inbound references, the total count appears in the post header metadata.
2. **Post Footer Section**: At the end of the post, an `Inbound References` section lists all referring articles with direct links.
3. **Archive Index**: The post index on `/posts` displays an inbound reference badge for linked articles.

### Disabling Backlinks

Backlinks can be toggled in your site configuration:

```yaml
features:
  backlinks: false # Default is true
```

The UI heading can be customized in the `ui` configuration domain:

```yaml
ui:
  inboundReferences: "Mentioned In"
```
