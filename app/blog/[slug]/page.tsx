import { getPostData, getAllPostSlugs } from '@/lib/posts';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const paths = getAllPostSlugs();
  return paths.map((path) => ({
    slug: path.params.slug,
  }));
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostData(slug);

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

      <div className="max-w-3xl mx-auto px-4 pb-20">
        <Link
          href="/blog"
          className="text-blue-600 dark:text-blue-400 hover:underline mb-6 inline-flex items-center gap-1"
        >
          <span>←</span>
          <span>Back to Blog</span>
        </Link>

        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mt-4">
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              {post.title}
            </h1>
            <time className="text-gray-500 dark:text-gray-400">
              {new Date(post.date).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </header>

          <div
            className="prose prose-lg dark:prose-invert max-w-none
              prose-headings:text-gray-900 dark:prose-headings:text-white
              prose-p:text-gray-700 dark:prose-p:text-gray-300
              prose-a:text-blue-600 dark:prose-a:text-blue-400
              prose-code:text-gray-900 dark:prose-code:text-gray-100
              prose-pre:bg-gray-100 dark:prose-pre:bg-gray-900"
            dangerouslySetInnerHTML={{ __html: post.contentHtml || '' }}
          />
        </article>
      </div>
    </div>
  );
}
