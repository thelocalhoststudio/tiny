---
title: Introducing Field Notes
description: A small, deliberately lightweight home for writing on the web.
published: 2026-06-01
tags: [publishing, notes]
meta:
  topic: Publishing
---

Field Notes is a new site with an old idea behind it: a personal page where
writing is the point, not the platform around it.

There's no analytics dashboard, no comment system, no algorithmic feed
deciding what gets seen first. Posts are listed in the order they were
written, and that's the whole sorting mechanism.

## Why build another blog theme

Most publishing software optimizes for things this site doesn't need —
multi-author workflows, plugin ecosystems, admin panels. Every one of those
is a dependency, and every dependency is something that can break, go
unmaintained, or quietly change how the site behaves.

Field Notes takes the opposite approach:

- Pages are generated once, at build time, and served as plain files.
- There is no database and no server-rendered request path.
- The CSS is small enough to read in one sitting.
- JavaScript is used only where the browser genuinely can't do the job.

None of this is a technical statement. It's just what happens when you
optimize for the site still working the same way in five years.

## What to expect

Posts here will mostly be about software, the web, and the practice of
publishing on it. Some will be short, some longer, and a few will wander off
topic entirely — that's allowed on a personal site.

If you're curious how the site itself works, the [colophon](/colophon) has
the details.
