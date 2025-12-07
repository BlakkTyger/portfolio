import Link from 'next/link';
import { getAllPostsMeta } from '@/lib/mdx';
import BlogCard from '@/components/mdx/BlogCard';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Blog | Himanshu Sharma',
  description: 'Thoughts on physics, programming, and philosophy.',
};

export default function BlogPage() {
  const posts = getAllPostsMeta();
  
  return (
    <main className="min-h-screen py-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-[var(--tungsten-gray)] hover:text-[var(--photon-white)] mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Portfolio
        </Link>
        
        {/* Header */}
        <div className="mb-12">
          <span className="text-[var(--terminal-cyan)] text-sm font-mono uppercase tracking-widest mb-4 block">
            Written Words
          </span>
          <h1 className="font-heading text-5xl md:text-6xl text-[var(--photon-white)] mb-4">
            Blog
          </h1>
          <p className="text-xl text-[var(--tungsten-gray)]">
            Thoughts, tutorials, and explorations.
          </p>
        </div>
        
        {/* Posts grid */}
        <div className="space-y-6">
          {posts.length > 0 ? (
            posts.map(post => (
              <BlogCard key={post.slug} post={post} />
            ))
          ) : (
            <p className="text-[var(--tungsten-gray)]">
              No posts yet. Check back soon!
            </p>
          )}
        </div>
      </div>
    </main>
  );
}