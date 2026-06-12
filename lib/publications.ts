import fs from 'node:fs';
import path from 'node:path';
import { cache } from 'react';
import YAML from 'yaml';

import type { Publication, PublicationLink, PublicationType } from '@/types/publications';
import { assert } from '@/lib/assert';
import { ensureObject, toString, toStringArray } from '@/lib/validation';
import { validateActivityDate } from '@/lib/activityPeriod';

const publicationsFilePath = path.join(process.cwd(), 'data', 'publications.yaml');

const publicationTypeValues = ['oral', 'poster', 'talk'] as const satisfies readonly PublicationType[];
const publicationTypeSet: ReadonlySet<string> = new Set(publicationTypeValues);

const isPublicationType = (value: string): value is PublicationType =>
  publicationTypeSet.has(value);

const validatePublicationLink = (raw: unknown, context: string): PublicationLink => {
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
  const title = toString(obj.title, `${context}.title`);
  const authors = toStringArray(obj.authors, `${context}.authors`);
  const venue = toString(obj.venue, `${context}.venue`);
  const typeValue = toString(obj.type, `${context}.type`);
  const date = validateActivityDate(obj.date, `${context}.date`);

  assert(
    isPublicationType(typeValue),
    `${context}.type must be one of: ${publicationTypeValues.join(', ')}`,
  );
  assert(authors.length > 0, `${context}.authors must not be empty`);

  const publication: Publication = {
    id,
    title,
    authors,
    venue,
    type: typeValue,
    date,
  };

  if (obj.links !== undefined && obj.links !== null) {
    assert(Array.isArray(obj.links), `${context}.links must be an array`);
    publication.links = obj.links.map((item, index) =>
      validatePublicationLink(item, `${context}.links[${index}]`),
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
