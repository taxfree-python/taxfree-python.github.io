import { getSortedPostsData } from '@/lib/posts';
import { BlogList } from './BlogList';
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

const blogDescription = 'Technical blog posts about software engineering, AI, and optimization';

export const metadata: Metadata = {
  title: `Blog - ${siteConfig.name}`,
  description: blogDescription,
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: `${siteConfig.url}/blog`,
    title: `Blog - ${siteConfig.name}`,
    description: blogDescription,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage.url,
        width: siteConfig.ogImage.width,
        height: siteConfig.ogImage.height,
        alt: `${siteConfig.name} Blog`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: siteConfig.social.twitter,
    creator: siteConfig.social.twitter,
    title: `Blog - ${siteConfig.name}`,
    description: blogDescription,
    images: [siteConfig.ogImage.url],
  },
};

export default function BlogPage() {
  const posts = getSortedPostsData();
  return <BlogList posts={posts} />;
}
