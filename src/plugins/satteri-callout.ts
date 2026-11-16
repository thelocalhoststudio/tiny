/**
 * Sätteri MDAST plugin for native Obsidian-compatible callout rendering.
 *
 * Supports built-in callout types:
 * NOTE, INFO, TIP, IMPORTANT, WARNING, CAUTION, DANGER, SUCCESS, QUESTION, ABSTRACT.
 *
 * Syntax:
 * > [!NOTE]
 * > Optional title or content
 *
 * Unknown callout types and malformed syntax remain ordinary Markdown blockquotes.
 */

export const CALLOUT_TYPES = new Set([
  'note',
  'info',
  'tip',
  'important',
  'warning',
  'caution',
  'danger',
  'success',
  'question',
  'abstract',
]);

export const callout = {
  name: 'tiny-callout',
  blockquote(node: any, ctx: any) {
    if (!node.children || !node.children.length) return;

    const firstChild = node.children[0];
    if (firstChild.type !== 'paragraph' || !firstChild.children || !firstChild.children.length) {
      return;
    }

    const firstText = firstChild.children[0];
    if (firstText.type !== 'text' || typeof firstText.value !== 'string') {
      return;
    }

    const val = firstText.value;
    const newlineIdx = val.indexOf('\n');
    const firstLine = newlineIdx === -1 ? val : val.slice(0, newlineIdx);
    const restText = newlineIdx === -1 ? '' : val.slice(newlineIdx + 1);

    const match = firstLine.match(/^\[!([a-zA-Z]+)\][ \t]*(.*)$/);
    if (!match) return;

    const rawType = match[1]!;
    const lowerType = rawType.toLowerCase();
    if (!CALLOUT_TYPES.has(lowerType)) return;

    const customTitle = match[2]?.trim() ?? '';
    const titleText = customTitle || rawType.toUpperCase();

    // Reconstruct first paragraph children without the [!TYPE] header
    const newFirstKids: any[] = [];
    if (restText.length > 0) {
      newFirstKids.push({ type: 'text', value: restText });
    }
    if (firstChild.children.length > 1) {
      newFirstKids.push(...firstChild.children.slice(1));
    }

    const contentNodes: any[] = [];
    if (newFirstKids.length > 0) {
      contentNodes.push({
        ...firstChild,
        children: newFirstKids,
      });
    }
    if (node.children.length > 1) {
      contentNodes.push(...node.children.slice(1));
    }

    const asideNode = {
      type: 'blockquote',
      data: {
        hName: 'aside',
        hProperties: {
          className: ['callout', `callout-${lowerType}`],
          dataCallout: lowerType,
          dataMd: `[!${lowerType}]`,
        },
      },
      children: [
        {
          type: 'blockquote',
          data: {
            hName: 'div',
            hProperties: { className: ['callout-title'] },
          },
          children: [{ type: 'text', value: titleText }],
        },
        {
          type: 'blockquote',
          data: {
            hName: 'div',
            hProperties: { className: ['callout-content'] },
          },
          children: contentNodes,
        },
      ],
    };

    ctx.replaceNode(node, asideNode);
  },
};
