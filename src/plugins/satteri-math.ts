/**
 * Sätteri MDAST plugin for build-time KaTeX math rendering.
 *
 * Transforms inlineMath ($...$) and block math ($$...$$) into static KaTeX HTML.
 * Display equations receive data-md="$$" for the source gutter.
 */
import katex from 'katex';

export const math = {
  name: 'tiny-math',
  inlineMath(node: any, ctx: any) {
    try {
      const rendered = katex.renderToString(node.value ?? '', {
        displayMode: false,
        throwOnError: false,
      });
      ctx.replaceNode(node, { raw: rendered, mdxExpressions: false });
    } catch {
      // Keep original on fatal error
    }
  },
  math(node: any, ctx: any) {
    try {
      const rendered = katex.renderToString(node.value ?? '', {
        displayMode: true,
        throwOnError: false,
      });
      ctx.replaceNode(node, {
        raw: `<div class="math-display" data-md="$$">${rendered}</div>`,
        mdxExpressions: false,
      });
    } catch {
      // Keep original on fatal error
    }
  },
};
