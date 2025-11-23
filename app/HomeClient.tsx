'use client';

import { HeroSection } from '@/components/HeroSection';
import { heroContent } from '@/data/profile';

export default function HomeClient() {
  return (
    <div>
      <HeroSection content={heroContent} />
    </div>
  );
}
