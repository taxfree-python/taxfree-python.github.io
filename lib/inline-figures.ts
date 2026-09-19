import fs from 'node:fs';
import path from 'node:path';
import sanitizeHtml from 'sanitize-html';

const articleSlug = '2026-09-14-attention-memory';
const figurePaths = [
  'draft/01-memory',
  'draft/02-online-learning',
  'olmo/06-gates',
  'olmo/10-native-loss',
  'olmo/11-future-loss',
  'olmo/04-updates',
  'olmo/07-layer-updates',
  'olmo/08-layer-interventions',
  'olmo/12-layer26-heads',
  'olmo/13-decay-functions',
  'olmo/14-qa-distribution',
  'olmo/15-qa-question-forms',
] as const;
const assetRoot = '/images/blog/attention-memory/';

/** Keep generated SVG local to its figure, including glyph and clipping IDs. */
export function sanitizeFigureSvg(source: string, prefix: string, label: string): string {
  const local = source
    .replace(/\bid="([^"]+)"/g, (_, id: string) => `id="${prefix}-${id}"`)
    .replace(/\b((?:xlink:)?href)="#([^"]+)"/g, (_, attr: string, id: string) => `${attr}="#${prefix}-${id}"`)
    .replace(/url\(#([^)]+)\)/g, (_, id: string) => `url(#${prefix}-${id})`);
  return sanitizeHtml(local, {
    parser: { lowerCaseTags: false, lowerCaseAttributeNames: false },
    allowedTags: ['svg', 'title', 'defs', 'g', 'path', 'use', 'clipPath', 'rect'],
    allowedAttributes: {
      '*': ['id', 'style', 'transform', 'clip-path'],
      svg: ['xmlns', 'xmlns:xlink', 'viewBox', 'role', 'aria-label', 'stroke-linejoin', 'stroke-linecap'],
      path: ['id', 'd', 'style', 'transform', 'clip-path'],
      use: ['href', 'xlink:href', 'x', 'y', 'style', 'transform'],
      rect: ['x', 'y', 'width', 'height'],
    },
    allowedSchemes: [],
    allowedSchemesAppliedToAttributes: ['href', 'xlink:href'],
    allowedStyles: {
      '*': {
        fill: [/^(?:none|currentColor|#[0-9a-f]{3,8})$/i],
        stroke: [/^(?:none|currentColor|#[0-9a-f]{3,8})$/i],
        'stroke-width': [/^[0-9.]+$/],
        'stroke-linecap': [/^(?:butt|round|square)$/],
        'stroke-linejoin': [/^(?:miter|round|bevel)$/],
        opacity: [/^[0-9.]+$/],
        'stroke-opacity': [/^[0-9.]+$/],
        'fill-opacity': [/^[0-9.]+$/],
        'stroke-dasharray': [/^(?:none|[0-9.]+(?:[ ,]+[0-9.]+)*)$/],
        'stroke-dashoffset': [/^-?[0-9.]+$/],
      },
    },
    transformTags: {
      svg: (tagName, attribs) => ({
        tagName,
        attribs: { ...attribs, role: 'img', 'aria-label': label, 'stroke-linejoin': 'round', 'stroke-linecap': 'butt' },
      }),
      use: (tagName, attribs) => {
        // Matplotlib's glyphs/markers may only reference this SVG's own defs.
        const target = attribs.href ?? attribs['xlink:href'];
        if (!target?.startsWith(`#${prefix}-`)) return { tagName: 'g', attribs: {} };
        return { tagName, attribs };
      },
    },
  });
}

/** Inline only allowlisted local figures after article sanitization. */
export function inlineArticleFigures(html: string, slug: string): string {
  if (slug !== articleSlug) return html;
  let index = 0;
  return html.replace(/<picture>[\s\S]*?<\/picture>/g, (picture) => {
    const source = picture.match(/<img\s[^>]*\bsrc="([^"]+)"/)?.[1];
    const figure = figurePaths.find((candidate) => source === `${assetRoot}${candidate}.svg`);
    if (!figure) return picture;
    const label = picture.match(/\balt="([^"]*)"/)?.[1] ?? '';
    const id = `${slug}-figure-${++index}`;
    const variants = ['desktop', 'mobile'].map((variant) => {
      const suffix = variant === 'mobile' ? '-mobile' : '';
      const file = path.join(process.cwd(), 'public', assetRoot, `${figure}${suffix}.svg`);
      const svg = sanitizeFigureSvg(fs.readFileSync(file, 'utf8'), `${id}-${variant}`, label);
      return `<div class="article-figure-${variant}">${svg}</div>`;
    });
    return `<div class="article-figure" data-inline-figure="${figure}">${variants.join('')}</div>`;
  });
}
