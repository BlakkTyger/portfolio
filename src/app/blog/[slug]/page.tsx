import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getAllPostSlugs, getPostBySlug } from '@/lib/mdx';
import { mdxComponents } from '@/components/mdx/MDXComponents';
import ViewTracker from '@/components/mdx/ViewTracker';
import TableOfContents from '@/components/blog/TableOfContents';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import 'katex/dist/katex.min.css';

// === STATIC GENERATION ===

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map(slug => ({ slug }));
}

// === METADATA ===

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  
  return {
    title: `${post.title} | Blog`,
    description: post.description,
  };
}

// === PAGE COMPONENT ===

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  
  if (!post.published) {
    notFound();
  }
  
  return (
    <main className="min-h-screen py-20 px-6">
      <ViewTracker slug={slug} />
      <div className="max-w-[90rem] mx-auto grid grid-cols-1 xl:grid-cols-[1fr_minmax(auto,48rem)_1fr] gap-8 relative">
        {/* Left Sidebar: TOC */}
        <aside className="hidden xl:block pr-4">
          <div className="sticky top-24 h-[calc(100vh-8rem)] overflow-y-auto no-scrollbar">
            <TableOfContents />
          </div>
        </aside>

        <article className="w-full min-w-0 mx-auto max-w-3xl xl:max-w-none">
          {/* Header */}
        <header className="mb-12">
          {/* Back links */}
          <div className="flex items-center justify-between mb-8">
            <a 
              href="/blog" 
              className="text-[var(--tungsten-gray)] hover:text-[var(--photon-white)] transition-colors text-sm font-mono tracking-wide"
            >
              ← Blog Home
            </a>
            <a 
              href="/" 
              className="text-[var(--tungsten-gray)] hover:text-[var(--photon-white)] transition-colors text-sm font-mono tracking-wide"
            >
              Back to Portfolio →
            </a>
          </div>
          
          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-[var(--tungsten-gray)] mb-4">
            <time>{new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}</time>
            <span>•</span>
            <span>{post.readingTime}</span>
          </div>
          
          {/* Title */}
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-[var(--photon-white)] mb-6">
            {post.title}
          </h1>
          
          {/* Description */}
          <p className="text-xl text-[var(--tungsten-gray)]">
            {post.description}
          </p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-6">
            {post.tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 text-sm rounded-full bg-[var(--event-horizon)] text-[var(--tungsten-gray)]"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>
        
        {/* Content */}
        <div className="prose prose-invert max-w-none">
          <MDXRemote 
            source={post.content} 
            components={mdxComponents}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkMath],
                rehypePlugins: [rehypeKatex, rehypeSlug],
              }
            }}
          />
        </div>
      </article>

      {/* Right Sidebar: Empty for centering balance */}
      <div className="hidden xl:block"></div>
      </div>
    </main>
  );
}