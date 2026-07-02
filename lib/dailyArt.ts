import fs from 'node:fs';
import path from 'node:path';
import { cache } from 'react';

import type { DailyArt } from '@/types/dailyArt';
import { ensureObject, toNumber, toOptionalString, toString } from '@/lib/validation';

const dailyArtFilePath = path.join(process.cwd(), 'data', 'daily-art.json');

function readDailyArtFile(): DailyArt {
  const fileContents = fs.readFileSync(dailyArtFilePath, 'utf-8');
  const parsed: unknown = JSON.parse(fileContents);
  const root = ensureObject(parsed, 'daily-art.json');
  const event = ensureObject(root.event, 'daily-art.json.event');
  const source = ensureObject(root.source, 'daily-art.json.source');

  const dailyArt: DailyArt = {
    date: toString(root.date, 'daily-art.json.date'),
    seed: toNumber(root.seed, 'daily-art.json.seed'),
    image: toString(root.image, 'daily-art.json.image'),
    thumbnail: toString(root.thumbnail, 'daily-art.json.thumbnail'),
    event: {
      year: toNumber(event.year, 'daily-art.json.event.year'),
      text: toString(event.text, 'daily-art.json.event.text'),
      pageTitle: toString(event.pageTitle, 'daily-art.json.event.pageTitle'),
      pageUrl: toString(event.pageUrl, 'daily-art.json.event.pageUrl'),
    },
    source: {
      fileTitle: toString(source.fileTitle, 'daily-art.json.source.fileTitle'),
      filePageUrl: toString(source.filePageUrl, 'daily-art.json.source.filePageUrl'),
      license: toString(source.license, 'daily-art.json.source.license'),
    },
  };

  const licenseUrl = toOptionalString(source.licenseUrl, 'daily-art.json.source.licenseUrl');
  if (licenseUrl !== undefined) {
    dailyArt.source.licenseUrl = licenseUrl;
  }

  const artist = toOptionalString(source.artist, 'daily-art.json.source.artist');
  if (artist !== undefined) {
    dailyArt.source.artist = artist;
  }

  return dailyArt;
}

export const getDailyArt = cache((): DailyArt => {
  return readDailyArtFile();
});
