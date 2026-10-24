import { describe, expect, it } from 'vitest';
import { splitInlineLinks } from './inline-links';

describe('splitInlineLinks', () => {
  it('returns plain text unchanged', () => {
    expect(splitInlineLinks('SQL と Python によるデータ分析')).toEqual([{ text: 'SQL と Python によるデータ分析' }]);
  });

  it('splits links out of surrounding text', () => {
    expect(splitInlineLinks('3 年生から[山下研](http://example.com/lab)に所属')).toEqual([
      { text: '3 年生から' },
      { label: '山下研', url: 'http://example.com/lab' },
      { text: 'に所属' },
    ]);
  });

  it('handles a line that is only a link, and several links', () => {
    expect(splitInlineLinks('[a](https://a.example)[b](https://b.example)')).toEqual([
      { label: 'a', url: 'https://a.example' },
      { label: 'b', url: 'https://b.example' },
    ]);
  });

  it('leaves non-http targets as text', () => {
    expect(splitInlineLinks('[x](mailto:x@example.com)')).toEqual([{ text: '[x](mailto:x@example.com)' }]);
  });
});
