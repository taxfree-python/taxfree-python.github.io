import { getSortedPostsData } from '@/lib/posts';
import { BlogList } from './BlogList';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - tax_free',
  description: 'Technical blog posts about software engineering, AI, and optimization',
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://taxfree.dev/blog',
    title: 'Blog - tax_free',
    description: 'Technical blog posts about software engineering, AI, and optimization',
    siteName: 'tax_free',
    images: [
      {
        url: '/icon.png',
        width: 1706,
        height: 1669,
        alt: 'tax_free Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@taxfree_python',
    creator: '@taxfree_python',
    title: 'Blog - tax_free',
    description: 'Technical blog posts about software engineering, AI, and optimization',
    images: ['/icon.png'],
  },
};

export default function BlogPage() {
  const posts = getSortedPostsData();
  return <BlogList posts={posts} />;
}
