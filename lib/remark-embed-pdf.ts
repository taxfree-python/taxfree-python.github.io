import { visit } from 'unist-util-visit';
import type { Root, Paragraph } from 'mdast';

/**
 * Escapes HTML special characters to prevent XSS attacks
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * Remark plugin to transform {{<embed-pdf url="...">}} syntax to iframe HTML
 */
export function remarkEmbedPdf() {
  return (tree: Root) => {
    visit(tree, 'paragraph', (node: Paragraph, index, parent) => {
      if (!parent || index === undefined) return;

      // Combine text/html children to detect the shortcode even when the parser
      // splits `{{<embed-pdf ...>}}` into multiple nodes.
      const combinedText = node.children
        .map((child) => {
          if ((child.type === 'text' || child.type === 'html') && 'value' in child) {
            return child.value;
          }
          return '';
        })
        .join('')
        .trim();

      // Match {{<embed-pdf url="...">}} or {{< embed-pdf url="..." >}}
      const pdfRegex = /^\{\{<\s*embed-pdf\s+url="([^"]+)"\s*>\}\}$/;
      const match = combinedText.match(pdfRegex);

      if (!match) return;

      const url = match[1];

      // Escape URL and attributes to prevent XSS attacks.
      // Note: This provides defense-in-depth, but the primary security validation
      // happens in lib/posts.ts transformTags (which restricts iframe src to relative paths).
      // HTML entity escaping alone is insufficient for attribute contexts, but combined
      // with the transformTags validation, it adds an extra layer of protection.
      const escapedUrl = escapeHtml(url);

      // Extract filename from URL for accessibility attributes
      const filename = url.split('/').pop() || 'PDF document';
      const escapedTitle = escapeHtml(`Embedded PDF: ${filename}`);
      const escapedAriaLabel = escapeHtml(`PDF document viewer for ${filename}`);

      // Replace the paragraph node with an HTML node
      const htmlNode = {
        type: 'html' as const,
        value: `<div style="width: 100%; height: 600px; margin: 2rem 0;">
  <iframe src="${escapedUrl}" width="100%" height="100%" style="border: 1px solid #ccc; border-radius: 8px;" title="${escapedTitle}" aria-label="${escapedAriaLabel}"></iframe>
</div>`,
      };

      parent.children[index] = htmlNode;
    });
  };
}
