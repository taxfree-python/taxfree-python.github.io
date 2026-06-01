import { describe, expect, it } from 'vitest';

import {
  ensureObject,
  toBoolean,
  toNumber,
  toOptionalString,
  toStringArray,
} from '@/lib/validation';

describe('validation helpers', () => {
  it('narrows plain objects and rejects arrays', () => {
    expect(ensureObject({ name: 'tax_free' }, 'profile')).toEqual({ name: 'tax_free' });
    expect(() => ensureObject([], 'profile')).toThrow('profile must be an object');
  });

  it('keeps optional strings explicit', () => {
    expect(toOptionalString(undefined, 'profile.bio')).toBeUndefined();
    expect(toOptionalString(null, 'profile.bio')).toBeUndefined();
    expect(toOptionalString('hello', 'profile.bio')).toBe('hello');
    expect(() => toOptionalString(1, 'profile.bio')).toThrow('profile.bio must be a string');
  });

  it('validates arrays item by item', () => {
    expect(toStringArray(['React', 'TypeScript'], 'skills')).toEqual(['React', 'TypeScript']);
    expect(() => toStringArray(['React', 1], 'skills')).toThrow('skills[1] must be a string');
  });

  it('rejects loose primitive coercion', () => {
    expect(toBoolean(false, 'draft')).toBe(false);
    expect(toNumber(2026, 'year')).toBe(2026);
    expect(() => toBoolean('false', 'draft')).toThrow('draft must be a boolean');
    expect(() => toNumber(Number.NaN, 'year')).toThrow('year must be a finite number');
  });
});
