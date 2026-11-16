---
title: Markdown Features
description: Full reference for Tiny's Sätteri Markdown pipeline.
group: Authoring
order: 4
---

## Source Gutter

Tiny features a structural Markdown source gutter inspired by Monoline. On desktop screens, structural markers appear alongside rendered blocks:

- `#`, `##`, `###` for headings
- `-` for bullet lists
- `1.`, `2.` for ordered items
- `>` for blockquotes
- `[!note]`, `[!tip]`, etc. for callouts
- ` ``` ` for code fences
- `|` for tables
- `![]` for single images
- `$$` for display math
- `[^1]` for footnotes

## Callouts (Obsidian-Compatible)

Tiny supports native, build-time callouts using Obsidian syntax. Callouts are statically pre-rendered as semantic `<aside>` elements with zero client-side JavaScript.

### Basic Syntax

```markdown
> [!NOTE]
> This is a general supplementary note.
```

### Custom Titles

Add custom title text on the header line after the type:

```markdown
> [!TIP] Photography tip
> Shoot in RAW when you want more flexibility in post-processing.
```

### Supported Types

Tiny provides 10 built-in callout types (matched case-insensitively):

| Type | Intended Use | Default Title |
| :--- | :--- | :--- |
| `NOTE` | General supplementary information | `NOTE` |
| `INFO` | Contextual and informational notes | `INFO` |
| `TIP` | Practical advice and techniques | `TIP` |
| `IMPORTANT` | Crucial supporting information | `IMPORTANT` |
| `WARNING` | Cautions or potential issues | `WARNING` |
| `CAUTION` | Advice requiring care | `CAUTION` |
| `DANGER` | Significant risks or breaking changes | `DANGER` |
| `SUCCESS` | Confirmations and positive outcomes | `SUCCESS` |
| `QUESTION` | Queries and points for consideration | `QUESTION` |
| `ABSTRACT` | Summaries and overviews | `ABSTRACT` |

### Rich Markdown Inside Callouts

Callouts fully support rich Markdown content across multiple paragraphs:

```markdown
> [!WARNING] Before proceeding
> Back up your existing database before running this command.
>
> 1. Run `pnpm backup`
> 2. Verify archive integrity
>
> Review the [documentation](/docs) if you experience issues.
```

### Ordinary Blockquotes

Standard blockquotes continue to render with restrained, muted colors:

```markdown
> A quote is just another sentence, given room to breathe.
> — Author Name
```

Unrecognized or malformed callout syntax gracefully falls back to standard blockquote rendering.

## Math Rendering

Fast build-time KaTeX math rendering:

Inline math: $E = mc^2$

Display math:

$$
\frac{1}{2\pi} \int_{-\infty}^{\infty} e^{-x^2/2} dx = \frac{1}{\sqrt{2\pi}}
$$

## Galleries and Lightbox

Consecutive image paragraphs automatically group into a pure CSS masonry grid. Clicking any image opens the pure CSS lightbox overlay without requiring JavaScript.

## Wikilinks and Note Links

Link to notes or posts by title `[[Post Title]]` or with relative links `[notes](./another-note.md)`. For aliases, section anchors, and backlink behavior, see the dedicated [Wikilinks and Backlinks guide](/docs/wikilinks-and-backlinks).
