import { assert } from '@/lib/assert';

/** A run of detail text: plain text, or a link written as `[label](https://...)`. */
export type InlineSegment = { text: string } | { label: string; url: string };

const LINK_PATTERN = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;

/** Splits a detail line into plain text and `[label](url)` links, in order. */
export function splitInlineLinks(line: string): InlineSegment[] {
  const segments: InlineSegment[] = [];
  let cursor = 0;
  for (const match of line.matchAll(LINK_PATTERN)) {
    const [whole, label, url] = match;
    // Both groups are non-optional in LINK_PATTERN, so a match always has them.
    assert(label !== undefined && url !== undefined, `malformed link in: ${line}`);
    if (match.index > cursor) segments.push({ text: line.slice(cursor, match.index) });
    segments.push({ label, url });
    cursor = match.index + whole.length;
  }
  if (cursor < line.length) segments.push({ text: line.slice(cursor) });
  return segments;
}
