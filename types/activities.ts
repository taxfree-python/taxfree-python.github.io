export type ActivityCategory = 'work' | 'research' | 'others';

export interface ActivityDate {
  year: number;
  month?: number;
  day?: number;
}

export interface ActivityPeriod {
  start: ActivityDate;
  end?: ActivityDate | null;
}

export interface ProjectActivity {
  id: string;
  title: string;
  period: ActivityPeriod;
  description: string;
  skills: string[];
  category: ActivityCategory;
  link?: string;
  detailedDescription?: string;
  achievements?: string[];
  links?: { label: string; url: string }[];
}
