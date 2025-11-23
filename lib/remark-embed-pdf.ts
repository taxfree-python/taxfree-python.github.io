import { visit } from 'unist-util-visit';
import type { Root, Text } from 'mdast';

/**
 * Remark plugin to transform {{<embed-pdf url="...">}} syntax to iframe HTML
 */
export function remarkEmbedPdf() {
  return (tree: Root) => {
    visit(tree, 'text', (node: Text, index, parent) => {
      if (!parent || index === undefined) return;

      const text = node.value;
      // Match {{<embed-pdf url="...">}} or {{< embed-pdf url="..." >}}
      const pdfRegex = /\{\{<\s*embed-pdf\s+url="([^"]+)"\s*>\}\}/g;
      const matches = Array.from(text.matchAll(pdfRegex));

      if (matches.length === 0) return;

      const newNodes: Array<Text | { type: 'html'; value: string }> = [];
      let lastIndex = 0;

      for (const match of matches) {
        const fullMatch = match[0];
        const url = match[1];
        const matchIndex = match.index!;

        // Add text before the match
        if (matchIndex > lastIndex) {
          newNodes.push({
            type: 'text',
            value: text.slice(lastIndex, matchIndex),
          });
        }

        // Add iframe HTML
        newNodes.push({
          type: 'html',
          value: `<div style="width: 100%; height: 600px; margin: 2rem 0;">
  <iframe src="${url}" width="100%" height="100%" style="border: 1px solid #ccc; border-radius: 8px;"></iframe>
</div>`,
        });

        lastIndex = matchIndex + fullMatch.length;
      }

      // Add remaining text
      if (lastIndex < text.length) {
        newNodes.push({
          type: 'text',
          value: text.slice(lastIndex),
        });
      }

      // Replace the node with new nodes
      if (newNodes.length > 0) {
        parent.children.splice(index, 1, ...newNodes);
      }
    });
  };
}
