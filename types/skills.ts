export type SkillCategory =
  | 'technical'
  | 'language'
  | 'communication'
  | 'other';

export const skillCategoryLabels: Record<SkillCategory, string> = {
  technical: 'Technical',
  language: 'Languages & Credentials',
  communication: 'Communication',
  other: 'Other',
};

export interface SkillDetail {
  name: string;
  icon?: string;
  category: SkillCategory;
  description: string;
  experience?: string;
  level?: string;
  highlights?: string[];
  relatedItemIds?: string[];
  filterable?: boolean;
  achievements?: SkillAchievement[];
}

export interface SkillGroup {
  id: SkillCategory;
  title: string;
}

export interface SkillAchievement {
  label: string;
  value: string;
  description?: string;
  link?: string;
}
