import { getAllPostsMeta, getCategoryHierarchy } from '@/lib/mdx';
import BlogPageClient from './BlogPageClient';

export const metadata = {
  title: 'Blog | Himanshu Sharma',
  description: 'Thoughts on physics, programming, and philosophy.',
};

export default function BlogPage() {
  const posts = getAllPostsMeta();
  const categoryHierarchy = getCategoryHierarchy();
  
  // Extract all unique tags - topics are optional and may not exist in PostMeta
  const allTags = [...new Set(posts.flatMap(post => post.tags || []))];
  
  return <BlogPageClient posts={posts} allTags={allTags} categoryHierarchy={categoryHierarchy} />;
}