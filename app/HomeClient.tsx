'use client';

import { useState } from 'react';
import { HeroSection } from '@/components/HeroSection';
import { AboutSection } from '@/components/AboutSection';
import { RecentPostsSection } from '@/components/RecentPostsSection';
import { SkillsSection } from '@/components/SkillsSection';
import { ActivitiesSection } from '@/components/ActivitiesSection';
import { heroContent, aboutContent } from '@/data/profile';
import type { PostData } from '@/lib/posts';

interface HomeClientProps {
  recentPosts: PostData[];
}

export default function HomeClient({ recentPosts }: HomeClientProps) {
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
      <AboutSection content={aboutContent} />
      <RecentPostsSection posts={recentPosts} />

      <SkillsSection selectedSkill={selectedSkill} onSkillClick={handleSkillClick} />
      <div id="activities-section">
        <ActivitiesSection selectedSkill={selectedSkill} />
      </div>
    </div>
  );
}
