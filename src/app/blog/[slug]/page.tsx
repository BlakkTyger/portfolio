import { notFound } from 'next/navigation';
import Link from 'next/link';
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
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: `${post.title} | Himanshu Sharma Blog`,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: ['Himanshu Sharma'],
      url: `https://himanshu.be/blog/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    }
  };
}

// === PAGE COMPONENT ===

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  
  if (!post.published) {
    notFound();
  }
  
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://himanshu.be'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://himanshu.be/blog'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `https://himanshu.be/blog/${slug}`
      }
    ]
  };

  const blogPostJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      '@type': 'Person',
      name: 'Himanshu Sharma',
      url: 'https://himanshu.be'
    },
    publisher: {
      '@type': 'Person',
      name: 'Himanshu Sharma',
      url: 'https://himanshu.be'
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://himanshu.be/blog/${slug}`
    }
  };
  
  return (
    <main className="min-h-screen py-20 px-6">
      {/* Structured SEO Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostJsonLd).replace(/</g, '\\u003c') }}
      />
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
            <Link 
              href="/blog" 
              className="text-[var(--tungsten-gray)] hover:text-[var(--photon-white)] transition-colors text-sm font-mono tracking-wide"
            >
              ← Blog Home
            </Link>
            <Link 
              href="/" 
              className="text-[var(--tungsten-gray)] hover:text-[var(--photon-white)] transition-colors text-sm font-mono tracking-wide"
            >
              Back to Portfolio →
            </Link>
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