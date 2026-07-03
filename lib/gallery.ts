import fs from 'node:fs';
import path from 'node:path';
import { cache } from 'react';
import YAML from 'yaml';

import type { GalleryData, GalleryWork } from '@/types/gallery';
import { assert } from '@/lib/assert';
import {
  ensureObject,
  toOptionalString,
  toOptionalStringArray,
  toString,
} from '@/lib/validation';

const galleryFilePath = path.join(process.cwd(), 'data', 'gallery.yaml');

function validateGalleryWork(raw: unknown, index: number): GalleryWork {
  const context = `works[${index}]`;
  const obj = ensureObject(raw, context);

  const work: GalleryWork = {
    id: toString(obj.id, `${context}.id`),
    title: toString(obj.title, `${context}.title`),
    date: toString(obj.date, `${context}.date`),
    media: toString(obj.media, `${context}.media`),
  };

  const description = toOptionalString(obj.description, `${context}.description`);
  if (description !== undefined) {
    work.description = description;
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
