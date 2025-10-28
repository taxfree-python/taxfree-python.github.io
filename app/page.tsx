import { getSortedPostsData } from '@/lib/posts';
import { getProjectsAndActivities } from '@/lib/activities';
import { getSkillsData } from '@/lib/skills';
import HomeClient from './HomeClient';

export default function Home() {
  const recentPosts = getSortedPostsData().slice(0, 3);
  const activities = getProjectsAndActivities();
  const { skillGroups, skills } = getSkillsData();

  return (
    <HomeClient
      recentPosts={recentPosts}
      activities={activities}
      skillGroups={skillGroups}
      skills={skills}
    />
  );
}
