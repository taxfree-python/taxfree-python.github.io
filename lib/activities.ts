import fs from 'node:fs';
import path from 'node:path';
import { cache } from 'react';
import YAML from 'yaml';

import { Activity } from '@/types/activities';
import { validateActivity } from './activityPeriod';

const activitiesFilePath = path.join(process.cwd(), 'data', 'activities.yaml');

function readActivitiesFile(): Activity[] {
  const fileContents = fs.readFileSync(activitiesFilePath, 'utf-8');
  const parsed = YAML.parse(fileContents);

  if (!Array.isArray(parsed)) {
    throw new Error('Activities data must be an array of activities');
  }

  return parsed.map((item, index) => {
    try {
      return validateActivity(item as Activity);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown validation error';
      throw new Error(`Invalid activity at index ${index}: ${message}`);
    }
  });
}

export const getActivities = cache((): Activity[] => {
  return readActivitiesFile();
});

// 後方互換性のための関数エイリアス
export const getProjectsAndActivities = getActivities;

