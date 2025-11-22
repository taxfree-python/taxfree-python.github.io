'use client';

import { HeroSection } from '@/components/HeroSection';
import { RecentPostsSection } from '@/components/RecentPostsSection';
// import { FeaturedWorksSection } from '@/components/FeaturedWorksSection';
import { heroContent } from '@/data/profile';
import type { PostData } from '@/lib/posts';
import type { GalleryWork } from '@/types/gallery';

interface HomeClientProps {
  recentPosts: PostData[];
  featuredWorks: GalleryWork[];
}

export default function HomeClient({ recentPosts }: HomeClientProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <HeroSection content={heroContent} />
      <RecentPostsSection posts={recentPosts} />
      {/* Featured Works - 製作中のため一時的に非表示 */}
      {/* <FeaturedWorksSection works={featuredWorks} /> */}
    </div>
  );
}
