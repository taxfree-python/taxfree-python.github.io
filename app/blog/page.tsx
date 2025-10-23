import Link from 'next/link';
import { getSortedPostsData } from '@/lib/posts';
import { BlogPostCard } from '@/components/BlogPostCard';

export default function BlogPage() {
  const posts = getSortedPostsData();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header Section */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-5xl font-bold mb-4 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              tax_free
            </h1>
          </Link>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Software Engineer & Researcher
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 pb-20">
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
            Blog Posts
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {posts.length} articles
          </p>
        </div>

        <div className="space-y-4">
          {posts.map((post) => (
            <BlogPostCard
              key={post.slug}
              slug={post.slug}
              title={post.title}
              date={new Date(post.date).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
