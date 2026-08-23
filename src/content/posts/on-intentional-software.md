---
title: On Intentional Software
description: Software gets easier to maintain when it does less on purpose.
published: 2026-08-18
tags: [software]
---

Most software doesn't fail because it's too small. It fails because it grew
past the point where anyone fully understands it, one reasonable feature at
a time.

Intentional software starts from the opposite question: not "what could
this do," but "what does this actually need to do, for the people actually
using it." Everything else is a future maintenance cost wearing the
disguise of a feature.

This site is a small example. It has posts, pages, and a way to browse both
— and stops there. No search index, no tagging UI beyond plain links, no
admin dashboard nobody but its author will ever see. Not because those
things are bad ideas everywhere, but because none of them were needed here,
and unneeded code is still code someone has to carry.
