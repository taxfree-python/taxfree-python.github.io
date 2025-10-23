import { getSortedPostsData } from '@/lib/posts';
import HomeClient from './HomeClient';

export default function Home() {
  const recentPosts = getSortedPostsData().slice(0, 3);

  return <HomeClient recentPosts={recentPosts} />;
}
