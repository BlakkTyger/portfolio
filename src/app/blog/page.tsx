import { getAllPostsMeta } from '@/lib/mdx';
import BlogPageClient from './BlogPageClient';

export const metadata = {
  title: 'Blog | Himanshu Sharma',
  description: 'Thoughts on physics, programming, and philosophy.',
};

export default function BlogPage() {
  const posts = getAllPostsMeta();
  
  // Extract all unique tags - topics are optional and may not exist in PostMeta
  const allTags = [...new Set(posts.flatMap(post => post.tags || []))];
  const allTopics: string[] = []; // Topics can be added to PostMeta later if needed
  
  return <BlogPageClient posts={posts} allTags={allTags} allTopics={allTopics} />;
}