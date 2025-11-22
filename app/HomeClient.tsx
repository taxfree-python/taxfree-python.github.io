'use client';

import { HeroSection } from '@/components/HeroSection';
import { RecentPostsSection } from '@/components/RecentPostsSection';
import { heroContent } from '@/data/profile';
import type { PostData } from '@/lib/posts';

interface HomeClientProps {
  recentPosts: PostData[];
}

export default function HomeClient({ recentPosts }: HomeClientProps) {
  return (
    <div>
      <HeroSection content={heroContent} />
      <RecentPostsSection posts={recentPosts} />
    </div>
  );
}
