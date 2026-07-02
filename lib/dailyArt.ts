import fs from 'node:fs';
import path from 'node:path';
import { cache } from 'react';

import type { DailyArt, DailyArtWork } from '@/types/dailyArt';
import { assert } from '@/lib/assert';
import { ensureObject, toNumber, toOptionalString, toString } from '@/lib/validation';

const dailyArtFilePath = path.join(process.cwd(), 'data', 'daily-art.json');

function validateWork(raw: unknown, index: number): DailyArtWork {
  const context = `daily-art.json.works[${index}]`;
  const obj = ensureObject(raw, context);
  const event = ensureObject(obj.event, `${context}.event`);
  const source = ensureObject(obj.source, `${context}.source`);

  const work: DailyArtWork = {
    image: toString(obj.image, `${context}.image`),
    event: {
      text: toString(event.text, `${context}.event.text`),
      pageTitle: toString(event.pageTitle, `${context}.event.pageTitle`),
      pageUrl: toString(event.pageUrl, `${context}.event.pageUrl`),
    },
    source: {
      fileTitle: toString(source.fileTitle, `${context}.source.fileTitle`),
      filePageUrl: toString(source.filePageUrl, `${context}.source.filePageUrl`),
      license: toString(source.license, `${context}.source.license`),
    },
  };

  if (event.year !== undefined && event.year !== null) {
    work.event.year = toNumber(event.year, `${context}.event.year`);
  }

  const licenseUrl = toOptionalString(source.licenseUrl, `${context}.source.licenseUrl`);
  if (licenseUrl !== undefined) {
    work.source.licenseUrl = licenseUrl;
  }

  const artist = toOptionalString(source.artist, `${context}.source.artist`);
  if (artist !== undefined) {
    work.source.artist = artist;
  }

  return work;
}

function readDailyArtFile(): DailyArt {
  const fileContents = fs.readFileSync(dailyArtFilePath, 'utf-8');
  const parsed: unknown = JSON.parse(fileContents);
  const root = ensureObject(parsed, 'daily-art.json');

  const rawWorks = root.works;
  assert(Array.isArray(rawWorks), 'daily-art.json.works must be an array');
  assert(rawWorks.length > 0, 'daily-art.json.works must not be empty');

  return {
    date: toString(root.date, 'daily-art.json.date'),
    seed: toNumber(root.seed, 'daily-art.json.seed'),
    thumbnail: toString(root.thumbnail, 'daily-art.json.thumbnail'),
    works: rawWorks.map((item, index) => validateWork(item, index)),
  };
}

export const getDailyArt = cache((): DailyArt => {
  return readDailyArtFile();
});
