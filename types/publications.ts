import type { ActivityDate } from './activities';

export type PublicationType = 'oral' | 'poster' | 'talk';

export type PublicationLink = {
  label: string;
  url: string;
};

export type Publication = {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  type: PublicationType;
  date: ActivityDate;
  links?: PublicationLink[];
};
