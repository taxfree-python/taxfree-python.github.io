import fs from 'node:fs';
import path from 'node:path';
import { cache } from 'react';
import YAML from 'yaml';

import { ACTIVITY_CATEGORIES, type Activity } from '@/types';
import { ensureObject, toEnum, toOptionalBoolean, toString } from '@/lib/validation';
import { validateCalendarPeriod } from '@/lib/date';

const activitiesFilePath = path.join(process.cwd(), 'data', 'activities.yaml');

export const validateActivity = (raw: unknown): Activity => {
  const obj = ensureObject(raw, 'Activity');
  const id = toString(obj.id, 'Activity.id');
  const context = `Activity(${id})`;

  const activity: Activity = {
    id,
    title: toString(obj.title, `${context}.title`),
    period: validateCalendarPeriod(obj.period, context),
    description: toString(obj.description, `${context}.description`),
    category: toEnum(obj.category, ACTIVITY_CATEGORIES, `${context}.category`),
  };

  const featured = toOptionalBoolean(obj.featured, `${context}.featured`);
  if (featured !== undefined) {
    activity.featured = featured;
  }

  return activity;
};

function readActivitiesFile(): Activity[] {
  const fileContents = fs.readFileSync(activitiesFilePath, 'utf-8');
  const parsed = YAML.parse(fileContents);

  if (!Array.isArray(parsed)) {
    throw new Error('Activities data must be an array of activities');
  }

  return parsed.map((item, index) => {
    try {
      return validateActivity(item);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown validation error';
      throw new Error(`Invalid activity at index ${index}: ${message}`);
    }
  });
}

export const getActivities = cache((): Activity[] => {
  return readActivitiesFile();
});
