import fs from 'node:fs';
import path from 'node:path';
import { cache } from 'react';
import YAML from 'yaml';

import { GalleryWork, GalleryData, MediaType } from '@/types/gallery';

const galleryFilePath = path.join(process.cwd(), 'data', 'gallery.yaml');

const mediaTypeValues: MediaType[] = ['image', 'gif', 'video'];
const mediaTypeSet = new Set<MediaType>(mediaTypeValues);

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function ensureObject(value: unknown, context: string): Record<string, unknown> {
  assert(value !== null && typeof value === 'object' && !Array.isArray(value), `${context} must be an object`);
  return value as Record<string, unknown>;
}

function toString(value: unknown, context: string): string {
  assert(typeof value === 'string', `${context} must be a string`);
  return value;
}

function toOptionalString(value: unknown, context: string): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  return toString(value, context);
}

function toStringArray(value: unknown, context: string): string[] {
  assert(Array.isArray(value), `${context} must be an array`);
  return value.map((item, index) => toString(item, `${context}[${index}]`));
}

function toOptionalStringArray(value: unknown, context: string): string[] | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  return toStringArray(value, context);
}

function validateGalleryWork(raw: unknown, index: number): GalleryWork {
  const context = `works[${index}]`;
  const obj = ensureObject(raw, context);

  const id = toString(obj.id, `${context}.id`);
  const title = toString(obj.title, `${context}.title`);
  const date = toString(obj.date, `${context}.date`);
  const media = toString(obj.media, `${context}.media`);
  const thumbnail = toString(obj.thumbnail, `${context}.thumbnail`);
  const mediaTypeValue = toString(obj.mediaType, `${context}.mediaType`);

  assert(mediaTypeSet.has(mediaTypeValue as MediaType), `${context}.mediaType must be one of: ${mediaTypeValues.join(', ')}`);
  const mediaType = mediaTypeValue as MediaType;

  const work: GalleryWork = {
    id,
    title,
    date,
    media,
    thumbnail,
    mediaType,
  };

  const description = toOptionalString(obj.description, `${context}.description`);
  if (description !== undefined) {
    work.description = description;
  }

  const category = toOptionalString(obj.category, `${context}.category`);
  if (category !== undefined) {
    work.category = category;
  }

  const tools = toOptionalStringArray(obj.tools, `${context}.tools`);
  if (tools !== undefined) {
    work.tools = tools;
  }

  return work;
}

function readGalleryFile(): GalleryData {
  const fileContents = fs.readFileSync(galleryFilePath, 'utf-8');
  const parsed = YAML.parse(fileContents);
  const root = ensureObject(parsed, 'gallery.yaml');

  const rawWorks = root.works;
  assert(Array.isArray(rawWorks), 'gallery.yaml.works must be an array');

  const works = rawWorks.map((item, index) => validateGalleryWork(item, index));

  return { works };
}

export const getGalleryData = cache((): GalleryData => {
  return readGalleryFile();
});
