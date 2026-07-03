import fs from 'node:fs';
import path from 'node:path';
import { cache } from 'react';
import YAML from 'yaml';

import type { Skill } from '@/types';
import { assert } from '@/lib/assert';
import { ensureObject, toOptionalString, toString } from '@/lib/validation';

const skillsFilePath = path.join(process.cwd(), 'data', 'skills.yaml');

function validateSkill(raw: unknown, index: number): Skill {
  const context = `skills[${index}]`;
  const obj = ensureObject(raw, context);

  const skill: Skill = { name: toString(obj.name, `${context}.name`) };

  const experience = toOptionalString(obj.experience, `${context}.experience`);
  if (experience !== undefined) {
    skill.experience = experience;
  }

  return skill;
}

function readSkillsFile(): Skill[] {
  const fileContents = fs.readFileSync(skillsFilePath, 'utf-8');
  const parsed = YAML.parse(fileContents);
  const root = ensureObject(parsed, 'skills.yaml');

  const rawSkills = root.skills;
  assert(Array.isArray(rawSkills), 'skills.yaml.skills must be an array');

  return rawSkills.map((item, index) => validateSkill(item, index));
}

export const getSkills = cache((): Skill[] => {
  return readSkillsFile();
});
