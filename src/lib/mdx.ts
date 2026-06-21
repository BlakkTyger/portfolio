import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

// === TYPES ===

export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  readingTime: string;
  published: boolean;
  category: string;
  subCategory: string;
  views?: number;
  /** Cover image, optional. e.g. /images/blog/<slug>/cover.jpg */
  cover?: string;
  // === Series ===
  /** Series ID (slug). When set, post belongs to the given blog series. */
  series?: string;
  /** Position within the series (1-indexed). Lower = earlier. */
  seriesOrder?: number;
  // === Multi-page ===
  /** Enable the optional multi-page reading mode for this post. */
  multiPage?: boolean;
  /** Heading level at which automatic page splits occur. Defaults to 'h2'. */
  multiPageSplit?: HeadingLevel;
  /** If true, single-page mode is unavailable; post always opens in multi-page. */
  multiPageOnly?: boolean;
  /** If true, the reading-mode prompt highlights the multi-page option as recommended. */
  multiPageRecommended?: boolean;
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
  
  return posts.map(({ ...meta }) => meta);
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
    category: data.category || 'Miscellaneous',
    subCategory: data.subCategory || 'General',
    views: data.views || 0,
    cover: data.cover,
    series: data.series,
    seriesOrder: typeof data.seriesOrder === 'number' ? data.seriesOrder : undefined,
    multiPage: data.multiPage === true,
    multiPageSplit: (data.multiPageSplit as HeadingLevel) || 'h2',
    multiPageOnly: data.multiPageOnly === true,
    multiPageRecommended: data.multiPageRecommended === true,
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

/**
 * Get category hierarchy
 * Returns an object mapping categories to arrays of their subcategories
 */
export function getCategoryHierarchy(): Record<string, string[]> {
  const posts = getAllPostsMeta();
  const hierarchy: Record<string, Set<string>> = {};
  
  posts.forEach(post => {
    const cat = post.category || 'Miscellaneous';
    const subCat = post.subCategory || 'General';
    
    if (!hierarchy[cat]) {
      hierarchy[cat] = new Set<string>();
    }
    hierarchy[cat].add(subCat);
  });
  
  // Convert Sets to Arrays
  const result: Record<string, string[]> = {};
  Object.keys(hierarchy).forEach(cat => {
    result[cat] = Array.from(hierarchy[cat]);
  });
  
  return result;
}

/**
 * Get posts by category and optional subcategory
 */
export function getPostsByCategory(category: string, subCategory?: string): PostMeta[] {
  return getAllPostsMeta().filter(post => {
    const matchesCategory = (post.category || 'Miscellaneous').toLowerCase() === category.toLowerCase();
    const matchesSubCategory = subCategory 
      ? (post.subCategory || 'General').toLowerCase() === subCategory.toLowerCase() 
      : true;
    return matchesCategory && matchesSubCategory;
  });
}