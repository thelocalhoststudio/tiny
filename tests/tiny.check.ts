import assert from 'node:assert/strict';
import { markdownToHtml, type MarkdownToHtmlResult } from 'satteri';
import { sourceGutter } from '../src/plugins/satteri-gutter.ts';
import { math } from '../src/plugins/satteri-math.ts';
import { noteFileLinks, resolveFileLink, linkedIds } from '../src/plugins/satteri-note-links.ts';
import {
  countWords,
  excerpt,
  isoDate,
  readingMinutes,
  slugify,
} from '../src/utils/text.ts';

console.log('── Running Tiny 2027 Test Suite ──');

// 1. Source Gutter Tests
const doc = `Plain paragraph.[^why]

# Top Title

## Heading

### Smaller

> Quoted.

* star bullet
  1. nested ordered

3. third
4. fourth

---

\`\`\`js
let a;
\`\`\`

Second reference.[^a]

| a | b |
| - | - |
| 1 | 2 |

![A sketch](pic.png)

Text with ![x](inline.png) inside.

[^a]: Defined first, referenced second.
[^why]: Referenced first.
`;

const gutterHtml = (
  markdownToHtml(doc, { hastPlugins: [sourceGutter] }) as MarkdownToHtmlResult
).html;

assert.match(gutterHtml, /<p>Plain paragraph/);
assert.match(gutterHtml, /<h1 data-md="#">/);
assert.match(gutterHtml, /<h2 data-md="##">/);
assert.match(gutterHtml, /<h3 data-md="###">/);
assert.match(gutterHtml, /<blockquote data-md=">">/);
assert.match(gutterHtml, /<hr data-md="---">/);
assert.match(gutterHtml, /<pre data-md="&#x60;&#x60;&#x60;">/);
assert.match(gutterHtml, /<li data-md="-">star bullet/);
assert.match(gutterHtml, /<li data-md="1.">nested ordered/);
assert.match(gutterHtml, /<li data-md="3.">third<\/li>\s*<li data-md="4.">fourth/);
assert.match(gutterHtml, /<li id="user-content-fn-why" data-md="\[\^1\]">/);
assert.match(gutterHtml, /<li id="user-content-fn-a" data-md="\[\^2\]">/);
assert.match(gutterHtml, /<h2 class="sr-only" id="footnote-label">/);
assert.match(gutterHtml, /<div class="table-block" data-md="\|"><div class="table-scroll"><table>/);
assert.match(gutterHtml, /<p data-md="!\[\]"><img src="pic.png" alt="A sketch"><\/p>/);
assert.match(gutterHtml, /<p>Text with <img src="inline.png" alt="x"> inside.<\/p>/);
console.log('✓ source gutter: ok');

// 2. Math Plugin Tests
const mathDoc = 'A gap $g$ here.\n\n$$\nx\n$$\n';
const mathRes = (
  markdownToHtml(mathDoc, {
    features: { math: true },
    mdastPlugins: [math],
    hastPlugins: [sourceGutter],
  }) as MarkdownToHtmlResult
).html;

assert.match(mathRes, /<p>A gap <span class="katex">/);
assert.match(mathRes, /<div class="math-display" data-md="\$\$"><span class="katex-display">/);
console.log('✓ math: ok');

// 3. Note links & relative file links
assert.equal(resolveFileLink('./design-review-rules.md'), '/posts/design-review-rules');
assert.equal(resolveFileLink('../posts/travel/tokyo.md#temple'), '/posts/travel/tokyo#temple');
assert.equal(resolveFileLink('https://example.com/test.md'), null);
assert.equal(resolveFileLink('/about'), null);

const linkSample = '[a](/posts/a) [b](./b.md) [[C note]] [[a]]';
assert.deepEqual(linkedIds(linkSample), ['a', 'b', 'c-note']);

const linkedDoc = 'See [the guide](./quick-start.md#setup) and [web](https://example.com).';
const linkedHtml = (
  markdownToHtml(linkedDoc, { mdastPlugins: [noteFileLinks] }) as MarkdownToHtmlResult
).html;
assert.match(linkedHtml, /<a href="\/posts\/quick-start#setup">the guide<\/a>/);
assert.match(linkedHtml, /<a href="https:\/\/example.com">web<\/a>/);
console.log('✓ note links: ok');

// 4. Text Utilities
assert.equal(countWords('Two words.\n\n```\nnot these\n```\n\n[link](/x) here[^1]\n'), 4);
assert.equal(isoDate(new Date('2026-09-02')), '2026-09-02');
assert.equal(countWords('今日は晴れ。 Then English. \uC624\uB298\uC740 \uB9D1\uC74C'), 5 + 2 + 2);
assert.equal(readingMinutes(800, 800), 2);
assert.equal(
  excerpt('## Heading\n\n- list\n\nThe *first* [real](/x) paragraph.[^1]\n\nSecond.'),
  'The first real paragraph.',
);
assert.match(excerpt('word '.repeat(60), 40), /^(word ){6}word…$/);
console.log('✓ text utils: ok');

// 5. Contextual Browse Breadcrumbs
import { getPostBreadcrumbs } from '../src/utils/browse.ts';

const mockPost = {
  id: 'test-post',
  filePath: 'src/content/posts/test-post.md',
  data: {
    title: 'A quiet morning in the mountains',
    published: new Date('2026-11-16'),
    tags: ['photography', 'travel'],
    meta: {
      topic: 'Outdoors',
    },
  },
} as any;

const mockConfig = {
  title: 'Test',
  description: 'Test',
  headerLinks: [{ label: 'Notes', url: '/posts' }],
  browse: {
    dimensions: [
      { key: 'tags', slug: 'tags', label: 'Tags' },
      { key: 'published', slug: 'years', label: 'Years' },
      { key: 'topic', slug: 'topics', label: 'Topics' },
    ],
  },
} as any;

const crumbs = getPostBreadcrumbs(mockPost, mockConfig);
assert.equal(crumbs.length, 4); // [notes], [outdoors], [2026], [#photography, #travel]
assert.deepEqual(crumbs[0], [{ label: 'notes', href: '/posts' }]);
assert.deepEqual(crumbs[1], [{ label: 'outdoors', href: '/browse/topics/outdoors' }]);
assert.deepEqual(crumbs[2], [{ label: '2026', href: '/browse/years/2026', isMono: true }]);
assert.deepEqual(crumbs[3], [
  { label: '#photography', href: '/browse/tags/photography', isTag: true, isMono: true },
  { label: '#travel', href: '/browse/tags/travel', isTag: true, isMono: true },
]);
console.log('✓ contextual breadcrumbs: ok');

// 6. Inbound Links Count
import { getInboundLinksCount } from '../src/utils/content.ts';

const mockTarget = {
  id: 'japan/tokyo-guide',
  filePath: 'src/content/posts/japan/tokyo-guide.md',
  data: {
    title: 'Tokyo Travel Guide',
  },
} as any;

const mockSource = {
  id: 'kyoto-note',
  filePath: 'src/content/posts/kyoto-note.md',
  data: { title: 'Kyoto' },
} as any;

const mockIndex = new Map<string, any[]>([
  ['tokyo-guide', [mockSource]],
]);

assert.equal(getInboundLinksCount(mockTarget, mockIndex), 1);
assert.equal(getInboundLinksCount({ id: 'other', filePath: 'other.md', data: { title: 'Other' } } as any, mockIndex), 0);
console.log('✓ inbound links count: ok');

// 7. Configuration Architecture & Merging Tests
import { defaultConfig } from '../src/site.config.ts';
import { mergeConfig } from '../src/utils/config.ts';

// 7.1 Defaults validation
assert.equal(defaultConfig.title, 'Tiny');
assert.equal(defaultConfig.locale, 'en');
assert.equal(defaultConfig.theme?.enabled, true);
assert.equal(defaultConfig.theme?.default, 'system');
assert.equal(defaultConfig.features?.backlinks, true);
assert.equal(defaultConfig.features?.math, true);
assert.equal(defaultConfig.features?.sourceGutter, true);
assert.equal(defaultConfig.features?.search, true);
assert.equal(defaultConfig.features?.docs, true);
assert.equal(defaultConfig.features?.toc, true);
assert.equal(defaultConfig.search?.enabled, true);
assert.equal(defaultConfig.analytics?.provider, null);
assert.equal(defaultConfig.seo?.titleTemplate, '%s | %s');
assert.equal(defaultConfig.ui?.skipToContent, 'Skip to content');
assert.equal(defaultConfig.ui?.notFound, 'Page not found');

// 7.2 Partial nested configuration overrides
const partialOverride = {
  theme: { default: 'dark' as const },
  seo: { twitterHandle: '@thelocalhoststudio' },
  features: { math: false },
};
const mergedPartial = mergeConfig(defaultConfig, partialOverride);
assert.equal(mergedPartial.theme?.default, 'dark');
assert.equal(mergedPartial.theme?.enabled, true); // Retained from defaults!
assert.equal(mergedPartial.seo?.twitterHandle, '@thelocalhoststudio');
assert.equal(mergedPartial.seo?.titleTemplate, '%s | %s'); // Retained from defaults!
assert.equal(mergedPartial.features?.math, false);
assert.equal(mergedPartial.features?.backlinks, true); // Retained from defaults!
assert.equal(mergedPartial.features?.sourceGutter, true); // Retained from defaults!
assert.equal(mergedPartial.title, 'Tiny'); // Root retained!

// 7.3 Array full replacement
const arrayOverride = {
  headerLinks: [{ label: 'Custom', url: '/custom' }],
  socialLinks: [],
};
const mergedArrays = mergeConfig(defaultConfig, arrayOverride);
assert.equal(mergedArrays.headerLinks?.length, 1);
assert.equal(mergedArrays.headerLinks?.[0]?.label, 'Custom');
assert.equal(mergedArrays.socialLinks?.length, 0);

// 7.4 Author deep merge
const authorOverride = {
  author: { name: 'Alice', avatar: '/alice.png' },
};
const mergedAuthor = mergeConfig(defaultConfig, authorOverride);
assert.equal(mergedAuthor.author.name, 'Alice');
assert.equal(mergedAuthor.author.avatar, '/alice.png');

// 7.5 Full backward compatibility with legacy configuration shape
const legacyConfig = {
  title: 'My Legacy Blog',
  description: 'A legacy blog description',
  locale: 'en',
  author: {
    name: 'Old Author',
  },
  headerLinks: [
    { label: 'Home', url: '/' },
    { label: 'Notes', url: '/posts' },
  ],
  footerLinks: [
    { label: 'RSS', url: '/rss.xml' },
  ],
  socialLinks: [],
  browse: {
    dimensions: [
      { key: 'tags', slug: 'tags', label: 'Tags' },
    ],
  },
};
const mergedLegacy = mergeConfig(defaultConfig, legacyConfig as any);
assert.equal(mergedLegacy.title, 'My Legacy Blog');
assert.equal(mergedLegacy.description, 'A legacy blog description');
assert.equal(mergedLegacy.author.name, 'Old Author');
assert.equal(mergedLegacy.headerLinks?.length, 2);
assert.equal(mergedLegacy.browse?.dimensions?.length, 1);
// Ensure new domains exist with valid defaults even for legacy user config
assert.equal(mergedLegacy.theme?.enabled, true);
assert.equal(mergedLegacy.theme?.default, 'system');
assert.equal(mergedLegacy.features?.backlinks, true);
assert.equal(mergedLegacy.search?.enabled, true);
assert.equal(mergedLegacy.analytics?.provider, null);
assert.equal(mergedLegacy.ui?.skipToContent, 'Skip to content');
assert.equal(mergedLegacy.footerCredits, 'Built with Tiny');

console.log('✓ configuration architecture & merging: ok');

// 8. Native Markdown Callout Support Tests
import { callout, CALLOUT_TYPES } from '../src/plugins/satteri-callout.ts';

// 8.1 Every supported callout type renders <aside class="callout callout-<type>">
for (const type of CALLOUT_TYPES) {
  const md = `> [!${type}]\n> Content for ${type}.`;
  const html = (markdownToHtml(md, { mdastPlugins: [callout] }) as MarkdownToHtmlResult).html;
  assert.match(html, new RegExp(`<aside class="callout callout-${type}" data-callout="${type}" data-md="\\[!${type}\\]">`));
  assert.match(html, new RegExp(`<div class="callout-title">\\s*${type.toUpperCase()}\\s*</div>`));
  assert.match(html, new RegExp(`<div class="callout-content">\\s*<p>Content for ${type}\\.</p>\\s*</div>`));
}

// 8.2 Uppercase and lowercase type names
const lowerHtml = (markdownToHtml('> [!note]\n> Lowercase type', { mdastPlugins: [callout] }) as MarkdownToHtmlResult).html;
assert.match(lowerHtml, /<aside class="callout callout-note"/);
const mixedHtml = (markdownToHtml('> [!WaRnInG]\n> Mixed type', { mdastPlugins: [callout] }) as MarkdownToHtmlResult).html;
assert.match(mixedHtml, /<aside class="callout callout-warning"/);

// 8.3 Custom titles
const customTitleHtml = (markdownToHtml('> [!TIP] Photography tip\n> Shoot in RAW.', { mdastPlugins: [callout] }) as MarkdownToHtmlResult).html;
assert.match(customTitleHtml, /<div class="callout-title">\s*Photography tip\s*<\/div>/);
assert.match(customTitleHtml, /<p>Shoot in RAW\./);

// 8.4 Missing custom titles (defaults to uppercase type)
const defaultTitleHtml = (markdownToHtml('> [!DANGER]\n> Take care.', { mdastPlugins: [callout] }) as MarkdownToHtmlResult).html;
assert.match(defaultTitleHtml, /<div class="callout-title">\s*DANGER\s*<\/div>/);

// 8.5 Multiple paragraphs
const multiParaHtml = (markdownToHtml('> [!INFO]\n> Paragraph 1.\n>\n> Paragraph 2.', { mdastPlugins: [callout] }) as MarkdownToHtmlResult).html;
assert.match(multiParaHtml, /<p>Paragraph 1\.<\/p>\s*<p>Paragraph 2\.<\/p>/);

// 8.6 Bold, italic and inline code
const richInlineHtml = (markdownToHtml('> [!NOTE]\n> *Italic* and **bold** with `inline code`.', { mdastPlugins: [callout] }) as MarkdownToHtmlResult).html;
assert.match(richInlineHtml, /<em>Italic<\/em>/);
assert.match(richInlineHtml, /<strong>bold<\/strong>/);
assert.match(richInlineHtml, /<code>inline code<\/code>/);

// 8.7 Links
const linkCalloutHtml = (markdownToHtml('> [!NOTE]\n> Visit [Tiny Home](https://example.com).', { mdastPlugins: [callout] }) as MarkdownToHtmlResult).html;
assert.match(linkCalloutHtml, /<a href="https:\/\/example\.com">Tiny Home<\/a>/);

// 8.8 Ordered and unordered lists
const listCalloutHtml = (markdownToHtml('> [!NOTE]\n> - Bullet 1\n> - Bullet 2\n>\n> 1. Number 1\n> 2. Number 2', { mdastPlugins: [callout] }) as MarkdownToHtmlResult).html;
assert.match(listCalloutHtml, /<ul>\s*<li>Bullet 1<\/li>\s*<li>Bullet 2<\/li>\s*<\/ul>/);
assert.match(listCalloutHtml, /<ol>\s*<li>Number 1<\/li>\s*<li>Number 2<\/li>\s*<\/ol>/);

// 8.9 Nested blockquotes
const nestedBqHtml = (markdownToHtml('> [!NOTE]\n> Text before\n>\n> > A quote inside\n>\n> Text after', { mdastPlugins: [callout] }) as MarkdownToHtmlResult).html;
assert.match(nestedBqHtml, /<blockquote>\s*<p>A quote inside<\/p>\s*<\/blockquote>/);

// 8.10 Code blocks
const codeBlockCalloutHtml = (markdownToHtml('> [!TIP] Code sample\n> ```js\n> const msg = "hi";\n> ```', { mdastPlugins: [callout] }) as MarkdownToHtmlResult).html;
assert.match(codeBlockCalloutHtml, /<pre><code class="language-js">const msg = "hi";\s*<\/code><\/pre>/);

// 8.11 Images
const imgCalloutHtml = (markdownToHtml('> [!NOTE]\n> ![Photo](mountain.jpg)', { mdastPlugins: [callout] }) as MarkdownToHtmlResult).html;
assert.match(imgCalloutHtml, /<img src="mountain\.jpg" alt="Photo">/);

// 8.12 Inline and display math
const mathCalloutHtml = (markdownToHtml('> [!NOTE]\n> $E=mc^2$\n>\n> $$\nx=1\n$$', {
  features: { math: true },
  mdastPlugins: [callout, math],
}) as MarkdownToHtmlResult).html;
assert.match(mathCalloutHtml, /<span class="katex">/);
assert.match(mathCalloutHtml, /<div class="math-display" data-md="\$\$">/);

// 8.13 Footnotes
const footnoteCalloutHtml = (markdownToHtml('> [!NOTE]\n> Point[^fn]\n\n[^fn]: Footnote explanation', {
  features: { gfm: { footnotes: true } },
  mdastPlugins: [callout],
}) as MarkdownToHtmlResult).html;
assert.match(footnoteCalloutHtml, /data-footnote-ref/);
assert.match(footnoteCalloutHtml, /Footnote explanation/);

// 8.14 Unknown callout types remain blockquotes
const unknownHtml = (markdownToHtml('> [!UNKNOWN]\n> This is not a callout.', { mdastPlugins: [callout] }) as MarkdownToHtmlResult).html;
assert.match(unknownHtml.trim(), /^<blockquote>\s*<p>\[!UNKNOWN\]\s*This is not a callout\.\s*<\/p>\s*<\/blockquote>$/);

// 8.15 Malformed callout syntax remains blockquote
const malformedHtml1 = (markdownToHtml('> [!note\n> Unclosed bracket', { mdastPlugins: [callout] }) as MarkdownToHtmlResult).html;
assert.match(malformedHtml1, /^<blockquote>/);
const malformedHtml2 = (markdownToHtml('> [! 123]\n> Invalid chars', { mdastPlugins: [callout] }) as MarkdownToHtmlResult).html;
assert.match(malformedHtml2, /^<blockquote>/);

// 8.16 Ordinary blockquotes remain unchanged
const ordinaryBqHtml = (markdownToHtml('> Just a normal blockquote.\n> Second line.', { mdastPlugins: [callout] }) as MarkdownToHtmlResult).html;
assert.match(ordinaryBqHtml.trim(), /^<blockquote>\s*<p>Just a normal blockquote\.\s*Second line\.\s*<\/p>\s*<\/blockquote>$/);

// 8.17 Multiple callouts in one document
const multiCalloutDoc = `> [!NOTE] First Note\n> Content 1.\n\n> [!WARNING] Second Warning\n> Content 2.`;
const multiCalloutHtml = (markdownToHtml(multiCalloutDoc, { mdastPlugins: [callout] }) as MarkdownToHtmlResult).html;
assert.match(multiCalloutHtml, /<aside class="callout callout-note"/);
assert.match(multiCalloutHtml, /<aside class="callout callout-warning"/);

// 8.18 Callouts inside nested Markdown structures (e.g. list items)
const nestedInListDoc = `- Parent list item\n  > [!NOTE] Note in list\n  > Deep content`;
const nestedInListHtml = (markdownToHtml(nestedInListDoc, { mdastPlugins: [callout] }) as MarkdownToHtmlResult).html;
assert.match(nestedInListHtml, /<li>Parent list item\s*<aside class="callout callout-note"/);

// 8.19 Source gutter integration
const gutterCalloutHtml = (markdownToHtml('> [!TIP]\n> Gutter test\n\n> Normal quote', {
  mdastPlugins: [callout],
  hastPlugins: [sourceGutter],
}) as MarkdownToHtmlResult).html;
assert.match(gutterCalloutHtml, /<aside class="callout callout-tip" data-callout="tip" data-md="\[!tip\]">/);
assert.match(gutterCalloutHtml, /<blockquote data-md=">">/);

console.log('✓ native markdown callouts: ok');

console.log('── ALL TESTS PASSED! ──');
