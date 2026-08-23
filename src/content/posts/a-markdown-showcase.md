---
title: A Markdown Showcase
description: A tour of the Markdown formatting this theme supports, written as an actual article instead of a test fixture.
published: 2026-06-10
updated: 2026-07-02
tags: [markdown, writing]
meta:
  topic: Writing
---

Every publishing tool eventually needs a page like this one — proof that the
basics work, written well enough that it's worth reading on its own. Here's
what Field Notes supports, in the order you'd actually reach for it.

## Headings and paragraphs

Headings break a long post into sections a reader can scan. Paragraphs do
the actual work. Neither needs decoration — just enough spacing to breathe.

## Emphasis

Sometimes a sentence needs *italics* to change its tone, and sometimes a
word needs to be **flatly bold**. Occasionally both at once, for a phrase
that's ***genuinely urgent***. Used sparingly, all three still mean
something.

## Links

Text can point elsewhere, like to the [Astro documentation](https://docs.astro.build)
or back to the [site's about page](/about). A link is just a link — no
special treatment for external versus internal.

## Lists

Unordered, for things without a natural order:

- Plain paragraphs
- A handful of headings
- Inline code and fenced code blocks
- Tables, when the data actually is tabular

Ordered, for steps that build on each other:

1. Write the draft in Markdown
2. Read it back a day later
3. Cut a third of it
4. Publish

## Blockquotes

> Simplicity is a great virtue but it requires hard work to achieve it and
> education to appreciate it.

That's Dijkstra, not this site's author, but it applies equally well to
Markdown formatting as it does to software.

## Code

Inline code like `getStaticPaths()` sits naturally in a sentence. Anything
longer gets a fenced block:

```ts
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
```

## Tables

A small comparison, because tables are the right tool exactly this often:

| Format        | Good for              | Avoid for         |
| ------------- | ---------------------- | ------------------ |
| Markdown      | Prose, structure        | Dense tabular data |
| Plain text    | Config, notes           | Anything styled    |
| Rich text/GUI | WYSIWYG editing          | Version control     |

## A horizontal rule

Sometimes a post needs a hard break between sections that aren't quite
separate topics.

---

## Images

Images belong inline, as part of the content — not bolted on as a required
cover field.

![A simple line diagram showing three boxes connected left to right, labeled Markdown, Build, and HTML](/images/posts/markdown-pipeline.svg)

## Footnotes

Markdown here also supports footnotes, for the aside that's worth including
without derailing the paragraph it interrupts[^1].

That covers the essentials. If it renders cleanly above, it'll render
cleanly in a real post too — this page and a normal article go through the
exact same pipeline.

[^1]: Which is the entire point of a footnote — say it, but not here.
