import fs from 'node:fs';
import path from 'node:path';
import { cache } from 'react';
import YAML from 'yaml';

import { mediaTypeValues } from '@/types/gallery';
import type { GalleryData, GalleryWork, MediaType } from '@/types/gallery';
import { assert } from '@/lib/assert';
import {
  ensureObject,
  toOptionalString,
  toOptionalStringArray,
  toString,
} from '@/lib/validation';

const galleryFilePath = path.join(process.cwd(), 'data', 'gallery.yaml');

const mediaTypeSet: ReadonlySet<string> = new Set(mediaTypeValues);

const isMediaType = (value: string): value is MediaType => mediaTypeSet.has(value);

function validateGalleryWork(raw: unknown, index: number): GalleryWork {
  const context = `works[${index}]`;
  const obj = ensureObject(raw, context);

  const id = toString(obj.id, `${context}.id`);
  const title = toString(obj.title, `${context}.title`);
  const date = toString(obj.date, `${context}.date`);
  const media = toString(obj.media, `${context}.media`);
  const thumbnail = toString(obj.thumbnail, `${context}.thumbnail`);
  const mediaTypeValue = toString(obj.mediaType, `${context}.mediaType`);

  assert(
    isMediaType(mediaTypeValue),
    `${context}.mediaType must be one of: ${mediaTypeValues.join(', ')}`,
  );

  const work: GalleryWork = {
    id,
    title,
    date,
    media,
    thumbnail,
    mediaType: mediaTypeValue,
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
