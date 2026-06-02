import { assert } from '@/lib/assert';

export type UnknownRecord = Record<string, unknown>;

function isUnknownRecord(value: unknown): value is UnknownRecord {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function ensureObject(value: unknown, context: string): UnknownRecord {
  assert(isUnknownRecord(value), `${context} must be an object`);
  return value;
}

export function toString(value: unknown, context: string): string {
  assert(typeof value === 'string', `${context} must be a string`);
  return value;
}

export function toOptionalString(value: unknown, context: string): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  return toString(value, context);
}

export function toStringArray(value: unknown, context: string): string[] {
  assert(Array.isArray(value), `${context} must be an array`);
  return value.map((item, index) => toString(item, `${context}[${index}]`));
}

export function toOptionalStringArray(value: unknown, context: string): string[] | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  return toStringArray(value, context);
}

export function toBoolean(value: unknown, context: string): boolean {
  assert(typeof value === 'boolean', `${context} must be a boolean`);
  return value;
}

export function toOptionalBoolean(value: unknown, context: string): boolean | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  return toBoolean(value, context);
}

export function toNumber(value: unknown, context: string): number {
  assert(typeof value === 'number' && Number.isFinite(value), `${context} must be a finite number`);
  return value;
}
