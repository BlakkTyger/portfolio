import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getAllPostSlugs, getPostBySlug } from '@/lib/mdx';
import { mdxComponents } from '@/components/mdx/MDXComponents';

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
      <article className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="mb-12">
          {/* Back link */}
          <a 
            href="/blog" 
            className="text-[var(--tungsten-gray)] hover:text-[var(--photon-white)] mb-8 inline-block"
          >
            ← Back to Blog
          </a>
          
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
          />
        </div>
      </article>
    </main>
  );
}