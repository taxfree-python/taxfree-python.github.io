import { Metadata } from 'next';
import { getProjectsAndActivities } from '@/lib/activities';
import { getSkillsData } from '@/lib/skills';
import { qualificationsContent } from '@/data/profile';
import CVClient from './CVClient';

export const metadata: Metadata = {
  title: 'CV - tax_free',
  description: 'Curriculum Vitae - Skills, Experience, and Qualifications',
};

export default function CVPage() {
  const activities = getProjectsAndActivities();
  const { skillGroups, skills } = getSkillsData();

  return (
    <CVClient
      activities={activities}
      skillGroups={skillGroups}
      skills={skills}
      qualifications={qualificationsContent}
    />
  );
}
