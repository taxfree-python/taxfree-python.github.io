import fs from 'node:fs';
import path from 'node:path';
import { cache } from 'react';
import YAML from 'yaml';

import type { SkillDetail } from '@/types/skills';
import { assert } from '@/lib/assert';
import { ensureObject, toOptionalString, toString } from '@/lib/validation';

const skillsFilePath = path.join(process.cwd(), 'data', 'skills.yaml');

export type SkillsData = {
  skills: SkillDetail[];
};

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
