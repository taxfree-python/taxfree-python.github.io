export type ActivityKind = 'project' | 'internship' | 'competition' | 'research' | 'other';
export type ActivityCategory = 'work' | 'personal';

export interface ProjectActivity {
  id: string;
  title: string;
  date: string;
  description: string;
  skills: string[];
  kind?: ActivityKind;
  category: ActivityCategory;
  link?: string;
  detailedDescription?: string;
  achievements?: string[];
  links?: { label: string; url: string }[];
}
