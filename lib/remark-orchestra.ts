import { visit } from 'unist-util-visit';
import type { Html, Paragraph, Root } from 'mdast';

/** Widget names that lib/../components/orchestra/PostContent.tsx knows how to render. */
const KNOWN_WIDGETS = new Set(['LayoutViewer', 'EvolutionReplay', 'ABPlayer']);

/**
 * Remark plugin: turn `{{<orchestra name="LayoutViewer">}}` shortcodes into a
 * placeholder `<div data-orchestra-widget="LayoutViewer">`. The client
 * component PostContent later swaps each placeholder for the React island.
 */
export function remarkOrchestra(): (tree: Root) => void {
  return (tree: Root) => {
    visit(tree, 'paragraph', (node: Paragraph, index, parent) => {
      if (!parent || index === undefined) return;

      const combinedText = node.children
        .map((child) =>
          (child.type === 'text' || child.type === 'html') && 'value' in child ? child.value : '',
        )
        .join('')
        .trim();

      const match = combinedText.match(/^\{\{<\s*orchestra\s+name="([^"]+)"\s*>\}\}$/);
      if (!match) return;

      const name = match[1];
      if (name === undefined || !KNOWN_WIDGETS.has(name)) return;

      const htmlNode: Html = {
        type: 'html',
        value: `<div data-orchestra-widget="${name}"></div>`,
      };
      parent.children[index] = htmlNode;
    });
  };
}
