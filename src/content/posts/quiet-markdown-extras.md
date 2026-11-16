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

## Wikilinks and note links

Writing `[[On Intentional Software]]` links straight to that post by title,
no need to look up its URL or nest it in a folder first: [[On Intentional
Software]].

You can also use aliases with `[[Target|Alias]]`, such as [[Autumn in Kyoto|reflections on Kyoto]],
or link directly to specific section anchors with `[[Target#Heading]]`, such as
[[The Craft of Functional Typography#Two Typefaces Are Enough|typographic craft]].

Relative Markdown file links are also automatically converted at build time:
see [tools we shape](./tools-we-shape.md). Every linked post automatically receives
an inbound reference in its footer, keeping your publication's web of thought connected.

## Highlights and comments

Two bits of Obsidian-style inline syntax carry over. Wrapping text in double
equals signs turns it into a ==highlight==, useful for calling out the one
sentence in a paragraph that matters most.

Wrapping something in double percent signs — like this: %%this note isn't
meant for readers, only for future-me while drafting%% — removes it
entirely from the rendered post. It exists in the source file, for the
author's own benefit, and nowhere else.

## Callouts

Native Obsidian-compatible callouts render cleanly using blockquote syntax:

> [!NOTE] Semantic asides
> Callouts compile to semantic `<aside>` HTML containers with corresponding data attributes and icons.

> [!TIP] Obsidian compatibility
> Because this syntax matches standard Obsidian callouts, notes drafted in your local vault render seamlessly on the web without translation steps.

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
