import fs from 'node:fs';
import path from 'node:path';
import { cache } from 'react';

import type { WeatheringData, WeatheringWork } from '@/types';
import { assert } from '@/lib/assert';
import { ensureObject, toNumber, toOptionalString, toString } from '@/lib/validation';

const weatheringFilePath = path.join(process.cwd(), 'data', 'weathering.json');

function validateWork(raw: unknown, index: number): WeatheringWork {
  const context = `weathering.json.works[${index}]`;
  const obj = ensureObject(raw, context);
  const event = ensureObject(obj.event, `${context}.event`);
  const source = ensureObject(obj.source, `${context}.source`);

  const work: WeatheringWork = {
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

function readWeatheringFile(): WeatheringData {
  const fileContents = fs.readFileSync(weatheringFilePath, 'utf-8');
  const parsed: unknown = JSON.parse(fileContents);
  const root = ensureObject(parsed, 'weathering.json');

  const rawWorks = root.works;
  assert(Array.isArray(rawWorks), 'weathering.json.works must be an array');
  assert(rawWorks.length > 0, 'weathering.json.works must not be empty');

  return {
    date: toString(root.date, 'weathering.json.date'),
    works: rawWorks.map((item, index) => validateWork(item, index)),
  };
}

export const getWeatheringData = cache((): WeatheringData => {
  return readWeatheringFile();
});
