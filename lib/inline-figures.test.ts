import { describe, expect, it } from 'vitest';
import { inlineArticleFigures, sanitizeFigureSvg } from './inline-figures';

describe('inline article figures', () => {
  it('isolates glyphs and clipping paths while stripping active or external content', () => {
    const source = `<svg viewBox="0 0 100 80" onload="alert(1)">
      <style>* { display: none }</style><script>alert(1)</script>
      <defs><path id="glyph" d="M 1 2"/><clipPath id="clip"><rect width="10" height="10"/></clipPath></defs>
      <g clip-path="url(#clip)" style="fill: #deded8; fill-opacity: 0.65; stroke-dasharray: 3, 2; stroke-dashoffset: 0; position: fixed">
        <use xlink:href="#glyph"/><use href="https://example.com/icon.svg#x"/>
      </g><foreignObject><div>unsafe</div></foreignObject>
    </svg>`;
    const first = sanitizeFigureSvg(source, 'figure-1', 'A < B');
    const second = sanitizeFigureSvg(source, 'figure-2', 'Other figure');
    expect(first).toContain('viewBox="0 0 100 80"');
    expect(first).toContain('aria-label="A &lt; B"');
    expect(first).toContain('id="figure-1-glyph"');
    expect(first).toContain('xlink:href="#figure-1-glyph"');
    expect(first).toContain('url(#figure-1-clip)');
    expect(first).toContain('clipPath');
    expect(first).toContain('fill:#deded8');
    expect(first).toContain('fill-opacity:0.65');
    expect(first).toMatch(/stroke-dasharray:3,\s*2/);
    expect(first).toContain('stroke-dashoffset:0');
    expect(first).not.toMatch(/<style|<script|onload|position:|https:|foreignObject/);
    expect(second).toContain('id="figure-2-glyph"');
    expect(second).not.toContain('figure-1');
  });
  it('leaves other posts and non-allowlisted image paths unchanged', () => {
    const html = '<picture><img src="/images/blog/attention-memory/../../private.svg" alt="x"></picture>';
    expect(inlineArticleFigures(html, '2026-09-14-attention-memory')).toBe(html);
    expect(inlineArticleFigures(html, 'other-post')).toBe(html);
  });
});
