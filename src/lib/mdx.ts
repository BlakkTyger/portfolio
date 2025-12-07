import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

// === TYPES ===

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  readingTime: string;
  published: boolean;
}

export interface Post extends PostMeta {
  content: string;  // Raw MDX content
}

// === PATHS ===

const POSTS_DIR = path.join(process.cwd(), 'content/posts');
/*
   process.cwd() = Current working directory (project root)
   We store posts in /content/posts/ at the project root
*/

// === FUNCTIONS ===

/**
 * Get all post slugs (for static generation)
 */
export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) {
    return [];
  }
  
  return fs
    .readdirSync(POSTS_DIR)
    .filter(file => file.endsWith('.mdx'))
    .map(file => file.replace('.mdx', ''));
}
/*
   readdirSync: Read directory contents synchronously
   filter: Only .mdx files
   map: Remove extension to get slug
   
   "my-post.mdx" → "my-post"
*/

/**
 * Get metadata for all posts (for listing page)
 */
export function getAllPostsMeta(): PostMeta[] {
  const slugs = getAllPostSlugs();
  
  const posts = slugs
    .map(slug => getPostBySlug(slug))
    .filter(post => post.published)  // Only published posts
    .sort((a, b) => {
      // Sort by date, newest first
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  
  return posts.map(({ content, ...meta }) => meta);
}

/**
 * Get a single post by slug
 */
export function getPostBySlug(slug: string): Post {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  
  // Parse frontmatter
  const { data, content } = matter(fileContents);
  /*
     gray-matter parses YAML frontmatter:
     
     ---
     title: "My Post"
     date: "2024-01-15"
     ---
     
     Content here...
     
     Returns:
     - data: { title: "My Post", date: "2024-01-15" }
     - content: "Content here..."
  */
  
  // Calculate reading time
  const { text: readTime } = readingTime(content);
  
  return {
    slug,
    title: data.title || 'Untitled',
    description: data.description || '',
    date: data.date || new Date().toISOString(),
    tags: data.tags || [],
    readingTime: readTime,
    published: data.published !== false,  // Default to true
    content,
  };
}

/**
 * Get posts by tag
 */
export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPostsMeta().filter(post => 
    post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  );
}

/**
 * Get all unique tags
 */
export function getAllTags(): string[] {
  const posts = getAllPostsMeta();
  const tags = posts.flatMap(post => post.tags);
  return [...new Set(tags)];  // Remove duplicates
}