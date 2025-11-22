import fs from 'node:fs';
import path from 'node:path';
import { cache } from 'react';
import YAML from 'yaml';

import { SkillDetail } from '@/types/skills';

const skillsFilePath = path.join(process.cwd(), 'data', 'skills.yaml');

interface SkillsData {
  skills: SkillDetail[];
}

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

function validateSkillDetail(raw: unknown, index: number): SkillDetail {
  const context = `skills[${index}]`;
  const obj = ensureObject(raw, context);

  const name = toString(obj.name, `${context}.name`);

  const detail: SkillDetail = { name };

  const experience = toOptionalString(obj.experience, `${context}.experience`);
  if (experience !== undefined) {
    detail.experience = experience;
  }

  return detail;
}

function readSkillsFile(): SkillsData {
  const fileContents = fs.readFileSync(skillsFilePath, 'utf-8');
  const parsed = YAML.parse(fileContents);
  const root = ensureObject(parsed, 'skills.yaml');

  const rawSkills = root.skills;

  assert(Array.isArray(rawSkills), 'skills.yaml.skills must be an array');

  const skills = rawSkills.map((item, index) => validateSkillDetail(item, index));

  return { skills };
}

export const getSkillsData = cache((): SkillsData => {
  return readSkillsFile();
});
