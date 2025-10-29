import { getSortedPostsData } from '@/lib/posts';
import { getFeaturedWorks } from '@/lib/gallery';
import HomeClient from './HomeClient';

export default function Home() {
  const recentPosts = getSortedPostsData().slice(0, 3);
  const featuredWorks = getFeaturedWorks();

  return <HomeClient recentPosts={recentPosts} featuredWorks={featuredWorks} />;
}
