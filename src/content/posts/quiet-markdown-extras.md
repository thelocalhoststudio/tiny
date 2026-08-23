---
title: Quiet Markdown Extras
description: The formatting this theme supports beyond standard Markdown — wikilinks, highlights, callouts, and a couple of typesetting tricks.
published: 2026-08-22
tags: [markdown, writing]
meta:
  topic: Writing
---

The [previous showcase](/posts/a-markdown-showcase) covered standard
Markdown — headings, lists, tables, the usual set. This post covers what's
layered on top of it. None of it changes how a post is written day to day;
it's there for the times it's useful and invisible otherwise.

## Wikilinks

Writing `[[On Intentional Software]]` links straight to that post by title,
no need to look up its URL or nest it in a folder first: [[On Intentional
Software]]. Handy for cross-referencing older posts while drafting, without
breaking flow to go find the exact path.

## Highlights and comments

Two bits of Obsidian-style inline syntax carry over. Wrapping text in double
equals signs turns it into a ==highlight==, useful for calling out the one
sentence in a paragraph that matters most.

Wrapping something in double percent signs — like this: %%this note isn't
meant for readers, only for future-me while drafting%% — removes it
entirely from the rendered post. It exists in the source file, for the
author's own benefit, and nowhere else.

## Callouts

Container directives turn a fenced block into a labeled callout:

:::aside
A side note that's related to the main text but not part of its argument —
useful for a tangent that would otherwise interrupt the paragraph it sits
next to.
:::

:::annotation{date="2026-08-22"}
Annotations work the same way, with an optional date attached — for a
follow-up thought added after the fact, without rewriting the original
paragraph.
:::

## Subscript and superscript

Chemical formulas and footnote-style references read properly instead of
looking like stray punctuation: water is H~2~O, and this is the 21^st^
post-formatting feature covered in this pair of showcase posts.

## Typography

Nothing to type for this one — it happens automatically. A paragraph
written with plain ASCII quotes, a double-dash, and three dots -- "like
this one" -- ends up with proper curly quotes, an en dash, and a real
ellipsis instead of periods stacked in a row...

That's the full list. All of it is optional syntax on top of ordinary
Markdown — a post that never uses any of it reads exactly the same as one
that does.
