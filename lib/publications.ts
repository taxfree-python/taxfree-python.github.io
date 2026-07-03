import fs from 'node:fs';
import path from 'node:path';
import { cache } from 'react';
import YAML from 'yaml';

import { PUBLICATION_TYPES, type LabeledLink, type Publication } from '@/types';
import { assert } from '@/lib/assert';
import { ensureObject, toEnum, toString, toStringArray } from '@/lib/validation';
import { validateCalendarDate } from '@/lib/date';

const publicationsFilePath = path.join(process.cwd(), 'data', 'publications.yaml');

const validateLink = (raw: unknown, context: string): LabeledLink => {
  const obj = ensureObject(raw, context);
  return {
    label: toString(obj.label, `${context}.label`),
    url: toString(obj.url, `${context}.url`),
  };
};

export const validatePublication = (raw: unknown): Publication => {
  const obj = ensureObject(raw, 'Publication');
  const id = toString(obj.id, 'Publication.id');
  const context = `Publication(${id})`;
  const authors = toStringArray(obj.authors, `${context}.authors`);

  assert(authors.length > 0, `${context}.authors must not be empty`);

  const publication: Publication = {
    id,
    title: toString(obj.title, `${context}.title`),
    authors,
    venue: toString(obj.venue, `${context}.venue`),
    type: toEnum(obj.type, PUBLICATION_TYPES, `${context}.type`),
    date: validateCalendarDate(obj.date, `${context}.date`),
  };

  if (obj.links !== undefined && obj.links !== null) {
    assert(Array.isArray(obj.links), `${context}.links must be an array`);
    publication.links = obj.links.map((item, index) =>
      validateLink(item, `${context}.links[${index}]`),
    );
  }

  return publication;
};

function readPublicationsFile(): Publication[] {
  const fileContents = fs.readFileSync(publicationsFilePath, 'utf-8');
  const parsed = YAML.parse(fileContents);

  if (!Array.isArray(parsed)) {
    throw new Error('Publications data must be an array of publications');
  }

  return parsed.map((item, index) => {
    try {
      return validatePublication(item);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown validation error';
      throw new Error(`Invalid publication at index ${index}: ${message}`);
    }
  });
}

export const getPublications = cache((): Publication[] => {
  return readPublicationsFile();
});
