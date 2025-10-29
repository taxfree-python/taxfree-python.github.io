import fs from 'node:fs';
import path from 'node:path';
import { cache } from 'react';
import YAML from 'yaml';

import { SkillDetail, SkillGroup, SkillAchievement, SkillCategory } from '@/types/skills';

const skillsFilePath = path.join(process.cwd(), 'data', 'skills.yaml');

const skillCategoryValues: SkillCategory[] = ['technical', 'language', 'communication', 'other'];
const skillCategorySet = new Set<SkillCategory>(skillCategoryValues);

interface SkillsData {
  skillGroups: SkillGroup[];
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

function toBoolean(value: unknown, context: string): boolean {
  assert(typeof value === 'boolean', `${context} must be a boolean`);
  return value;
}

function toStringArray(value: unknown, context: string): string[] {
  assert(Array.isArray(value), `${context} must be an array`);
  return value.map((item, index) => toString(item, `${context}[${index}]`));
}

function toAchievements(value: unknown, context: string): SkillAchievement[] {
  assert(Array.isArray(value), `${context} must be an array`);
  return value.map((item, index) => {
    const achievementContext = `${context}[${index}]`;
    const obj = ensureObject(item, achievementContext);
    const label = toString(obj.label, `${achievementContext}.label`);
    const valueText = toString(obj.value, `${achievementContext}.value`);
    const achievement: SkillAchievement = { label, value: valueText };

    const description = toOptionalString(obj.description, `${achievementContext}.description`);
    if (description !== undefined) {
      achievement.description = description;
    }

    const link = toOptionalString(obj.link, `${achievementContext}.link`);
    if (link !== undefined) {
      achievement.link = link;
    }

    return achievement;
  });
}

function validateSkillGroup(raw: unknown, index: number): SkillGroup {
  const context = `skillGroups[${index}]`;
  const obj = ensureObject(raw, context);

  const idValue = toString(obj.id, `${context}.id`);
  assert(skillCategorySet.has(idValue as SkillCategory), `${context}.id must be a valid SkillCategory`);
  const id = idValue as SkillCategory;
  const title = toString(obj.title, `${context}.title`);

  return { id, title };
}

function validateSkillDetail(raw: unknown, index: number): SkillDetail {
  const context = `skills[${index}]`;
  const obj = ensureObject(raw, context);

  const name = toString(obj.name, `${context}.name`);
  const categoryValue = toString(obj.category, `${context}.category`);
  assert(skillCategorySet.has(categoryValue as SkillCategory), `${context}.category must be a valid SkillCategory`);
  const category = categoryValue as SkillCategory;
  const description = toString(obj.description, `${context}.description`);

  const detail: SkillDetail = {
    name,
    category,
    description,
  };

  const icon = toOptionalString(obj.icon, `${context}.icon`);
  if (icon !== undefined) {
    detail.icon = icon;
  }

  const experience = toOptionalString(obj.experience, `${context}.experience`);
  if (experience !== undefined) {
    detail.experience = experience;
  }

  const level = toOptionalString(obj.level, `${context}.level`);
  if (level !== undefined) {
    detail.level = level;
  }

  if (obj.highlights !== undefined) {
    detail.highlights = toStringArray(obj.highlights, `${context}.highlights`);
  }

  if (obj.relatedItemIds !== undefined) {
    detail.relatedItemIds = toStringArray(obj.relatedItemIds, `${context}.relatedItemIds`);
  }

  if (obj.filterable !== undefined) {
    detail.filterable = toBoolean(obj.filterable, `${context}.filterable`);
  }

  if (obj.achievements !== undefined) {
    detail.achievements = toAchievements(obj.achievements, `${context}.achievements`);
  }

  return detail;
}

function readSkillsFile(): SkillsData {
  const fileContents = fs.readFileSync(skillsFilePath, 'utf-8');
  const parsed = YAML.parse(fileContents);
  const root = ensureObject(parsed, 'skills.yaml');

  const rawGroups = root.skillGroups;
  const rawSkills = root.skills;

  assert(Array.isArray(rawGroups), 'skills.yaml.skillGroups must be an array');
  assert(Array.isArray(rawSkills), 'skills.yaml.skills must be an array');

  const skillGroups = rawGroups.map((item, index) => validateSkillGroup(item, index));
  const skills = rawSkills.map((item, index) => validateSkillDetail(item, index));

  return { skillGroups, skills };
}

export const getSkillsData = cache((): SkillsData => {
  return readSkillsFile();
});

