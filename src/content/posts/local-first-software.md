---
title: Local-First Software and the Long Arc of Personal Data
description: Why plain files and local SQLite databases will outlast another decade of SaaS APIs.
published: 2024-04-18
tags: [software, notes]
meta:
  topic: Software
---

Most web applications today treat the browser as a dumb terminal. Your notes,
tasks, and memories live on someone else's computer, behind an authentication token
and an API that may disappear when a startup runs out of venture funding.

Local-first software flips this model: your data lives on your device first, in
standard formats like Markdown or SQLite, and sync is merely a transport mechanism
rather than a prerequisite for ownership.

## Files Over Endpoints

When your writing is saved as plain text files on disk, you retain ownership
across decades. A folder of Markdown files created in 2004 opens just as easily
today as it will in 2044.

> [!NOTE] The sync trade-off
> Local-first systems handle conflict resolution using algorithms like CRDTs[^crdt].
> You trade instant centralised coordination for uninterrupted offline capability
> and permanent data sovereignty.

In terms of data retention probability over a multi-year horizon $t$, cloud-dependent
services decay rapidly when service availability $\lambda$ fluctuates:

$$
P(\text{retention}) = e^{-\lambda t}
$$

Whereas local files backed up to personal storage approach near-certain durability.

This connects directly to [[On Intentional Software]]: software gets easier to maintain
when it relies on fewer remote moving parts. It is also why [[Static Sites Are Having a Moment (Again)]]
continues to resonate with builders who value durability.

[^crdt]: Conflict-free Replicated Data Types enable concurrent edits across offline devices without data loss.
