import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { colorCssVariables } from './tokens';

const root = path.resolve(__dirname, '..');
/** Shared code must read colours from lib/tokens.ts. articles/ is deliberately not here: each article may spell its own. */
const shared = ['app', 'components', 'lib'];
const extensions = new Set(['.ts', '.tsx', '.css', '.mjs', '.js']);
/** The one shared file allowed to spell colours. Tests are skipped so they may quote literals. */
const allowed = new Set([path.join('lib', 'tokens.ts')]);

function sourceFiles(dir: string): string[] {
  return readdirSync(path.join(root, dir)).flatMap((name) => {
    const rel = path.join(dir, name);
    if (statSync(path.join(root, rel)).isDirectory()) return sourceFiles(rel);
    if (!extensions.has(path.extname(name)) || /\.test\.tsx?$/.test(name) || allowed.has(rel)) return [];
    return [rel];
  });
}

const sharedFiles = shared.flatMap(sourceFiles);
/** Every stylesheet, articles included, for the var() check. */
const cssFiles = [...shared, 'articles'].flatMap(sourceFiles).filter((file) => file.endsWith('.css'));

const colorLiteral = [
  /(?<![&\w])#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})\b/gi,
  /\b(?:rgba?|hsla?)\(/gi,
  /['"](?:white|black)['"]/gi,
];

describe('colour literals', () => {
  it('scans the shared source tree and every stylesheet', () => {
    expect(sharedFiles).toContain(path.join('lib', 'theme.ts'));
    expect(sharedFiles.some((file) => file.startsWith(`articles${path.sep}`))).toBe(false);
    expect(cssFiles).toContain(path.join('articles', '2026-09-26', 'MemoryCard.module.css'));
  });

  it('appear in shared code only in lib/tokens.ts', () => {
    const hits = sharedFiles.flatMap((file) =>
      readFileSync(path.join(root, file), 'utf8')
        .split('\n')
        .flatMap((line, i) => colorLiteral.flatMap((re) => [...line.matchAll(re)].map((m) => `${file}:${i + 1}: ${m[0]}`))),
    );
    expect(hits).toEqual([]);
  });

  it('CSS only references --color-* variables that the tokens define', () => {
    const defined = new Set(Object.keys(colorCssVariables()));
    const unknown = cssFiles
      .flatMap((file) => [...readFileSync(path.join(root, file), 'utf8').matchAll(/var\((--color-[\w-]+)/g)].map((m) => `${file}: ${m[1]}`))
      .filter((hit) => !defined.has(hit.slice(hit.indexOf('--color-'))));
    expect(unknown).toEqual([]);
  });
});
