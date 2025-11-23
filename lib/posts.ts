import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';
import sanitizeHtml from 'sanitize-html';
import { remarkEmbedPdf } from './remark-embed-pdf';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export interface PostData {
  slug: string;
  title: string;
  date: string;
  contentHtml?: string;
  draft?: boolean;
  math?: boolean;
  description?: string;
}

export function getSortedPostsData(): PostData[] {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);

      return {
        slug,
        title: matterResult.data.title || slug,
        date: matterResult.data.date ? new Date(matterResult.data.date).toISOString() : '',
        draft: matterResult.data.draft || false,
        math: matterResult.data.math || false,
        description: matterResult.data.description,
      };
    })
    .filter((post) => !post.draft); // ドラフトを除外

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostSlugs(): { params: { slug: string } }[] {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .filter((fileName) => {
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);
      return matterResult.data.draft !== true;
    })
    .map((fileName) => {
      return {
        params: {
          slug: fileName.replace(/\.md$/, ''),
        },
      };
    });
}

export async function getPostData(slug: string): Promise<PostData> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(remarkEmbedPdf)
    .use(remarkMath)
    .use(remarkGfm)
    // Allow raw HTML from remark plugins (e.g., remarkEmbedPdf) to pass through.
    // This is required for custom PDF embedding, and the output is sanitized below.
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeKatex, {
      strict: false,
      macros: {
        '\\*': '\\ast',
      },
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(matterResult.content);
  const rawContentHtml = processedContent.toString();
  const contentHtml = sanitizeHtml(rawContentHtml, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'span',
      'math',
      'semantics',
      'mrow',
      'mi',
      'mo',
      'mn',
      'msup',
      'msub',
      'msubsup',
      'mfrac',
      'msqrt',
      'mroot',
      'mtext',
      'annotation',
      'mtable',
      'mtr',
      'mtd',
      'mspace',
      'ms',
      'mover',
      'munder',
      'munderover',
      'iframe',
      'div',
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      '*': ['class', 'style', 'aria-hidden', 'aria-label'],
      a: ['href', 'name', 'target', 'rel'],
      img: ['src', 'alt'],
      math: ['xmlns', 'display'],
      annotation: ['encoding'],
      iframe: ['src', 'width', 'height', 'style', 'title'],
      div: ['style'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    // Restrict CSS properties on div elements to prevent CSS injection attacks
    allowedStyles: {
      div: {
        width: [/^[\d.]+(%|px|rem|em)?$/],
        height: [/^[\d.]+(%|px|rem|em)?$/],
        margin: [/^[\d.\s]+(%|px|rem|em)?$/],
      },
    },
    // Validate iframe src to only allow relative paths (for local PDF files)
    transformTags: {
      iframe: (tagName, attribs) => {
        // Only allow relative paths starting with '/'
        if (attribs.src && !attribs.src.startsWith('/')) {
          return { tagName: 'div', attribs: {} };
        }
        return { tagName, attribs };
      },
    },
  });

  return {
    slug,
    title: matterResult.data.title || slug,
    date: matterResult.data.date ? new Date(matterResult.data.date).toISOString() : '',
    contentHtml,
    draft: matterResult.data.draft || false,
    math: matterResult.data.math || false,
    description: matterResult.data.description,
  };
}
