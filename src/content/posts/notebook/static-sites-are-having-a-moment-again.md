---
title: Static Sites Are Having a Moment (Again)
description: The pendulum swings back toward HTML files that exist before anyone requests them.
published: 2026-08-05
tags: [static, web]
meta:
  topic: Publishing
---

Static sites never actually left, but they spent a decade or so being
treated as the beginner option — fine for a landing page, not serious enough
for anything with real content. That framing has quietly reversed.

Part of it is practical: a site that's just files is trivial to host, cheap
to scale, and has no runtime to patch at 2am. Part of it is a reaction —
enough teams have shipped a client-side app for what was really a document,
and paid for it in load time, that "just render the HTML" stopped sounding
old-fashioned.

Field notes from that direction, on a small photo taken during a site
migration last month:

![A messy desk with a laptop, a notebook, and a cold cup of coffee, mid-migration](/images/posts/notebook-desk.svg)

Nothing glamorous about it. Most of the work was deleting a build step that
had accumulated over three years and no longer did anything useful.

## What actually changed

Not the technology, particularly — HTML files served from disk worked fine
in 2005 too. What changed is the tooling around them: content collections,
typed frontmatter, incremental builds fast enough to feel interactive during
editing. Static stopped meaning "simple tooling" and started meaning
"simple output, produced by tooling that's caught up."

That's the version of static this site is built on.
