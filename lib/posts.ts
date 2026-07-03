import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';
import sanitizeHtml from 'sanitize-html';
import { remarkEmbedPdf } from './remark-embed-pdf';
import { assert } from '@/lib/assert';
import { ensureObject, toOptionalBoolean, toOptionalString } from '@/lib/validation';
import type { Post, PostMeta } from '@/types';

const postsDirectory = path.join(process.cwd(), 'content/posts');
const markdownFilePattern = /\.md$/;

type PostFrontmatter = Omit<PostMeta, 'slug'>;

type MarkdownPost = {
  metadata: PostFrontmatter;
  content: string;
};

function getPostFileNames(): string[] {
  return fs.readdirSync(postsDirectory).filter((fileName) => fileName.endsWith('.md'));
}

function getSlugFromFileName(fileName: string): string {
  return fileName.replace(markdownFilePattern, '');
}

function toDateIsoString(value: unknown, context: string): string {
  if (value === undefined || value === null) {
    return '';
  }

  assert(
    value instanceof Date || typeof value === 'string' || typeof value === 'number',
    `${context} must be a date string, timestamp, or Date`,
  );

  const date = value instanceof Date ? value : new Date(value);
  assert(!Number.isNaN(date.getTime()), `${context} must be a valid date`);
  return date.toISOString();
}

function parsePostMetadata(raw: unknown, slug: string, fileName: string): PostFrontmatter {
  const context = `${fileName} frontmatter`;
  const obj = ensureObject(raw, context);
  const description = toOptionalString(obj.description, `${context}.description`);

  const metadata: PostFrontmatter = {
    title: toOptionalString(obj.title, `${context}.title`) ?? slug,
    date: toDateIsoString(obj.date, `${context}.date`),
    draft: toOptionalBoolean(obj.draft, `${context}.draft`) ?? false,
    math: toOptionalBoolean(obj.math, `${context}.math`) ?? false,
  };

  if (description !== undefined) {
    metadata.description = description;
  }

  return metadata;
}

function readMarkdownPost(fileName: string): MarkdownPost {
  const slug = getSlugFromFileName(fileName);
  const fullPath = path.join(postsDirectory, fileName);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  return {
    metadata: parsePostMetadata(matterResult.data, slug, fileName),
    content: matterResult.content,
  };
}

/** All published posts, newest first. */
export function getPosts(): PostMeta[] {
  const posts = getPostFileNames()
    .map((fileName) => {
      const { metadata } = readMarkdownPost(fileName);

      return {
        slug: getSlugFromFileName(fileName),
        ...metadata,
      };
    })
    .filter((post) => !post.draft); // ドラフトを除外

  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

export function getPostSlugs(): { slug: string }[] {
  return getPostFileNames()
    .filter((fileName) => {
      const { metadata } = readMarkdownPost(fileName);
      return !metadata.draft;
    })
    .map((fileName) => ({
      slug: getSlugFromFileName(fileName),
    }));
}

export async function getPost(slug: string): Promise<Post> {
  const { metadata, content } = readMarkdownPost(`${slug}.md`);

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
    .process(content);
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
      iframe: ['src', 'width', 'height', 'style', 'title', 'aria-label'],
      div: ['style'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    // Restrict CSS properties on div and iframe elements to prevent CSS injection attacks
    allowedStyles: {
      div: {
        width: [/^[\d]+(\.\d+)?(%|px|rem|em)$/],
        height: [/^[\d]+(\.\d+)?(%|px|rem|em)$/],
        margin: [/^[\d]+(\.\d+)?(\s+[\d]+(\.\d+)?)*(%|px|rem|em)$/],
      },
      iframe: {
        border: [/^[\d]+(\.\d+)?px solid #([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/],
        'border-radius': [/^[\d]+(\.\d+)?px$/],
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
    contentHtml,
    ...metadata,
  };
}
