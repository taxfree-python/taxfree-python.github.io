'use client';

import { useState } from 'react';
import { HeroSection } from '@/components/HeroSection';
import { RecentPostsSection } from '@/components/RecentPostsSection';
import { SkillsSection } from '@/components/SkillsSection';
import { ActivitiesSection } from '@/components/ActivitiesSection';
import { QualificationsSection } from '@/components/QualificationsSection';
import { heroContent, qualificationsContent } from '@/data/profile';
import type { PostData } from '@/lib/posts';
import type { ProjectActivity } from '@/types/activities';
import type { SkillDetail, SkillGroup } from '@/types/skills';

interface HomeClientProps {
  recentPosts: PostData[];
  activities: ProjectActivity[];
  skillGroups: SkillGroup[];
  skills: SkillDetail[];
}

export default function HomeClient({ recentPosts, activities, skillGroups, skills }: HomeClientProps) {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  const handleSkillClick = (skill: string) => {
    if (selectedSkill === skill) {
      setSelectedSkill(null);
    } else {
      setSelectedSkill(skill);
      const activitiesSection = document.getElementById('activities-section');
      if (activitiesSection) {
        activitiesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <HeroSection content={heroContent} />
      <RecentPostsSection posts={recentPosts} />

      <SkillsSection
        selectedSkill={selectedSkill}
        onSkillClick={handleSkillClick}
        activities={activities}
        skillGroups={skillGroups}
        skills={skills}
      />
      <div id="activities-section">
        <ActivitiesSection selectedSkill={selectedSkill} activities={activities} />
      </div>
      <QualificationsSection content={qualificationsContent} />
    </div>
  );
}
