/**
 * Sätteri plugins for inline body images and galleries.
 *
 * resolveVaultImagePaths — normalizes Obsidian vault-absolute image paths
 *   (mdast, runs before Astro's built-in image collector).
 * imageAttributes        — lazy loading + title-as-caption (hast).
 * galleryGrouping         — merges consecutive image-only paragraphs into a
 *   `.gallery-single`/`.gallery-grid` div of `.gallery-item` images (hast),
 *   for pure CSS lightbox to attach to.
 * imageCaption           — adds `.editorial-caption` to italicized caption paragraphs
 *   immediately following an image or gallery.
 */

import { fileURLToPath } from 'node:url';
import { posix as pathPosix } from 'node:path';
import type { Element, ElementContent, Text as HastText } from 'hast';

// ── MDAST plugin: normalize vault-absolute image paths ───────────────────────
function resolveVaultImageUrl(url: string, fileURL: URL | undefined): string {
  if (/^https?:\/\//.test(url)) return url;
  if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) return url;

  // Bare filename — no path separators.
  if (!url.includes('/')) return `./attachments/${url}`;

  if (url.startsWith('attachments/') || url.startsWith('images/')) return `./${url}`;

  if (fileURL) {
    const filePath = fileURLToPath(fileURL).replace(/\\/g, '/');
    const contentIndex = filePath.indexOf('/src/content/');
    if (contentIndex !== -1) {
      const relFromContentRoot = filePath.slice(contentIndex + '/src/content/'.length);
      const collection = relFromContentRoot.split('/')[0];
      if (url.startsWith(`${collection}/`)) {
        const fileDir = pathPosix.dirname(relFromContentRoot);
        const relative = pathPosix.relative(fileDir, url);
        return relative.startsWith('.') ? relative : `./${relative}`;
      }
    }
  }

  return `./${url}`;
}

export const resolveVaultImagePaths = {
  name: 'resolve-vault-image-paths',
  image(node: any, ctx: any) {
    if (!node.url) return;
    const resolved = resolveVaultImageUrl(node.url, ctx.fileURL);
    if (resolved !== node.url) ctx.setProperty(node, 'url', resolved);
  },
};

// ── HAST plugin: lazy loading + caption ──────────────────────────────────────
export const imageAttributes = {
  name: 'image-attributes',
  element: {
    filter: ['img'],
    visit(node: Element, ctx: any) {
      const props = node.properties ?? {};
      if (!props.loading) ctx.setProperty(node, 'loading', 'lazy');
      if (!props.decoding) ctx.setProperty(node, 'decoding', 'async');
      if (props.title && !props['data-caption']) ctx.setProperty(node, 'data-caption', props.title);
    },
  },
};

// ── HAST plugin: gallery grouping ────────────────────────────────────────────
function isImageOnlyParagraph(node: Element): boolean {
  if (!node.children.length) return false;
  return node.children.every(
    (child) =>
      (child.type === 'element' && child.tagName === 'img') ||
      (child.type === 'text' && (child as HastText).value.trim() === ''),
  );
}

function collectImages(node: Element): Element[] {
  return node.children.filter(
    (child): child is Element => child.type === 'element' && child.tagName === 'img',
  );
}

function galleryItem(img: Element, id: string): Element {
  return {
    type: 'element',
    tagName: 'div',
    properties: { class: 'gallery-item' },
    children: [
      {
        type: 'element',
        tagName: 'a',
        properties: {
          href: `#${id}`,
          class: 'gallery-item__link',
          'aria-label': 'Open image in lightbox',
        },
        children: [{ ...img, properties: { ...img.properties, class: 'gallery-item__image' } }],
      },
    ],
  };
}

function lightboxSlide(img: Element, id: string): Element {
  const props = img.properties ?? {};
  const captionText = (props['data-caption'] || props.title || props.alt) as string | undefined;

  const children: ElementContent[] = [
    {
      type: 'element',
      tagName: 'a',
      properties: {
        href: '#!',
        class: 'gallery-lightbox__close-area',
        'aria-label': 'Close lightbox',
      },
      children: [],
    },
    {
      ...img,
      properties: {
        ...img.properties,
        class: 'gallery-lightbox__image',
        loading: 'lazy',
      },
    },
  ];

  if (captionText && typeof captionText === 'string' && captionText.trim() !== '') {
    children.push({
      type: 'element',
      tagName: 'span',
      properties: { class: 'gallery-lightbox__caption' },
      children: [{ type: 'text', value: captionText }],
    });
  }

  return {
    type: 'element',
    tagName: 'div',
    properties: { class: 'gallery-lightbox__slide', id },
    children,
  };
}

function lightboxContainer(images: Element[], galleryId: string): Element {
  return {
    type: 'element',
    tagName: 'div',
    properties: { class: 'gallery-lightbox' },
    children: [
      {
        type: 'element',
        tagName: 'a',
        properties: {
          href: '#!',
          class: 'gallery-lightbox__close',
          'aria-label': 'Close lightbox',
        },
        children: [{ type: 'text', value: '×' }],
      },
      {
        type: 'element',
        tagName: 'div',
        properties: { class: 'gallery-lightbox__track' },
        children: images.map((img, i) =>
          lightboxSlide(img, `${galleryId}-img-${i + 1}`),
        ) as ElementContent[],
      },
    ],
  };
}

function galleryDiv(images: Element[], galleryId: string): Element {
  const isSingle = images.length === 1;
  const items: ElementContent[] = images.map((img, i) =>
    galleryItem(img, `${galleryId}-img-${i + 1}`),
  );
  items.push(lightboxContainer(images, galleryId));

  return {
    type: 'element',
    tagName: 'div',
    properties: {
      class: isSingle ? 'gallery-single' : 'gallery-grid',
      dataMd: '![]',
    },
    children: items,
  };
}

export function galleryGrouping() {
  const consumedIndices = new WeakMap<object, Set<number>>();
  let galleryCounter = 0;

  return {
    name: 'gallery-grouping',
    element: {
      filter: ['p'],
      visit(node: Element, ctx: any) {
        const parent = ctx.parent(node);
        const index = ctx.indexOf(node);
        if (!parent || index === undefined) return;

        const consumed = consumedIndices.get(parent);
        if (consumed?.has(index)) return;
        if (!isImageOnlyParagraph(node)) return;

        const group = [index];
        let i = index + 1;
        while (i < parent.children.length) {
          const sibling = parent.children[i];
          if (sibling.type === 'text' && sibling.value.trim() === '') {
            i++;
            continue;
          }
          if (sibling.type === 'element' && sibling.tagName === 'p' && isImageOnlyParagraph(sibling)) {
            group.push(i);
            i++;
            continue;
          }
          break;
        }

        const set = consumed ?? new Set<number>();
        for (const idx of group) set.add(idx);
        consumedIndices.set(parent, set);

        const images = group.flatMap((idx) => collectImages(parent.children[idx] as Element));
        for (const idx of group.slice(1)) ctx.removeNode(parent.children[idx]);

        galleryCounter++;
        return galleryDiv(images, `g${galleryCounter}`);
      },
    },
  };
}

// ── HAST plugin: image caption ───────────────────────────────────────────────
function isEmphasisOnlyParagraph(node: Element): boolean {
  if (node.tagName !== 'p') return false;
  const nonWhitespace = (node.children || []).filter(
    (c) => !(c.type === 'text' && (c as HastText).value.trim() === ''),
  );
  return (
    nonWhitespace.length === 1 &&
    nonWhitespace[0].type === 'element' &&
    (nonWhitespace[0] as Element).tagName === 'em'
  );
}

export const imageCaption = {
  name: 'image-caption',
  element: {
    filter: ['p'],
    visit(node: Element, ctx: any) {
      if (!isEmphasisOnlyParagraph(node)) return;
      const parent = ctx.parent(node);
      const index = ctx.indexOf(node);
      if (!parent || index === undefined || index === 0) return;

      let prevIdx = index - 1;
      while (
        prevIdx >= 0 &&
        parent.children[prevIdx].type === 'text' &&
        (parent.children[prevIdx] as HastText).value.trim() === ''
      ) {
        prevIdx--;
      }
      if (prevIdx < 0) return;
      const prev = parent.children[prevIdx];
      if (prev.type === 'element') {
        const classes = Array.isArray(prev.properties?.className)
          ? prev.properties.className.join(' ')
          : String(prev.properties?.class || '');
        const isGallery =
          prev.tagName === 'div' &&
          (classes.includes('gallery-single') || classes.includes('gallery-grid'));
        const isImgP =
          prev.tagName === 'p' &&
          prev.children.some((c: any) => c.type === 'element' && c.tagName === 'img');
        if (isGallery || isImgP) {
          const existing = Array.isArray(node.properties?.className)
            ? node.properties.className
            : [];
          ctx.setProperty(node, 'className', [...existing, 'editorial-caption']);
        }
      }
    },
  },
};
