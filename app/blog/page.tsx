import { getSortedPostsData } from '@/lib/posts';
import { BlogList } from './BlogList';

export default function BlogPage() {
  const posts = getSortedPostsData();
  return <BlogList posts={posts} />;
}
