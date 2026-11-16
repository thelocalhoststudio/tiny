# Changelog

All notable changes to **Tiny** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2027-01-01

### Added
- **Native Obsidian Callouts**: Statically compiled callout engine (`satteri-callout.ts`) supporting 10 standard types (`NOTE`, `INFO`, `TIP`, `IMPORTANT`, `WARNING`, `CAUTION`, `DANGER`, `SUCCESS`, `QUESTION`, `ABSTRACT`) with custom headers and nested rich Markdown. Zero client-side JavaScript.
- **Contextual Browse Breadcrumbs**: Compact, clickable breadcrumb paths above post titles (`notes / <year> / #tag`) derived dynamically from configured Browse dimensions.
- **Multi-Year Post Archive**: Chronological post archive on `/posts` grouped by publication year, featuring fixed date columns, horizontal year jumps, and inbound reference indicators.
- **Reciprocal Inbound References (Backlinks)**: Bi-directional note-linking engine computed during static generation. Displays reference counts and lists citing articles in post footers.
- **Structured Documentation Suite**: Expanded `/docs` collection covering Getting Started, Configuration, Content Structure, Markdown Guide, Wikilinks & Backlinks, and Deployment.
- **Multi-Year Demo Content**: Realistic demo articles spanning 2023 through 2026 demonstrating photography galleries, KaTeX math, callouts, and mutual cross-linking.
- **Automated Verification Suite**: Comprehensive test runner (`tests/tiny.check.ts`) covering gutter markers, KaTeX math, note links, text utilities, breadcrumbs, configuration merging, and callout rendering.

### Changed
- **Typography Standardization**: Locked theme to two self-hosted variable typefaces: Geist Sans for body text, headings, and interface; Geist Mono for dates, metadata, code blocks, and the Markdown source gutter.
- **Modular Configuration Architecture**: Restructured configuration into 9 distinct domains (Site Identity, Navigation, Browse, SEO, Theme, Features, Search, Analytics, and UI Text) with deep-merging defaults and backward compatibility.
- **Muted Blockquotes**: Restyled standard blockquotes with subtle, muted borders and secondary text colors to cleanly distinguish quotes from callouts.
- **Editorial Footer Refinement**: Restructured the footer into three balanced, accessible content zones (site attribution with optional description, internal navigation, and external social links), replacing decorative dot separators with clean CSS flex spacing, distinguishing external connections via Geist Mono, and optimizing vertical reflow for mobile devices.
- **Markdown Pipeline Ordering**: Optimized Sätteri MDAST and HAST plugin execution sequence to ensure source gutter markers (`data-md`) attach cleanly to all block elements.

### Fixed
- Resolved date column misalignment and metadata wrapping on narrow viewports in the post index.
- Refined About page avatar dimensions and aesthetic subtle tilt.
- Corrected test runner string assertion anchors and regex escape sequences.

---

## [0.0.2] - 2026-08-25

### Added
- Astro Content Collections for posts, pages, docs, and site configuration.
- Sätteri Markdown processor integration with experimental source gutter.
- Basic Wikilink resolution to `/posts/<slug>`.
- Full-text static search (`/search`) powered by `/search.json`.
- Pure CSS image lightbox and automatic gallery grouping.
- Light, Dark, and System theme toggle with localStorage persistence.
- RSS feed (`/rss.xml`) and XML sitemap generation.
