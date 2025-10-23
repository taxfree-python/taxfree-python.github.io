export type ActivityKind = 'project' | 'internship' | 'competition' | 'research' | 'other';

export interface ProjectActivity {
  id: string;
  title: string;
  date: string;
  description: string;
  skills: string[];
  kind?: ActivityKind;
  link?: string;
  detailedDescription?: string;
  achievements?: string[];
  links?: { label: string; url: string }[];
}
