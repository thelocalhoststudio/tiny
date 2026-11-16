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
— and stops there. Not because search or databases are bad ideas everywhere,
but because each component has an ongoing cost. When software is built for durability,
such as [[local-first-software|local-first architectures]],
every dependency left out is a liability avoided.
