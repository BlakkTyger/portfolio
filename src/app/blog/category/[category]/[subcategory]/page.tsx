import { getPostsByCategory } from '@/lib/mdx';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Tag, Clock } from 'lucide-react';

interface SubcategoryPageProps {
  params: Promise<{
    category: string;
    subcategory: string;
  }>;
}

export async function generateMetadata({ params }: SubcategoryPageProps) {
  const { category, subcategory } = await params;
  const decodedCat = decodeURIComponent(category);
  const decodedSub = decodeURIComponent(subcategory);
  
  return {
    title: `${decodedSub} (${decodedCat})`,
    description: `Browse posts under the subcategory ${decodedSub} within ${decodedCat}.`,
    alternates: {
      canonical: `/blog/category/${category}/${subcategory}`,
    },
  };
}

export default async function SubcategoryPage({ params }: SubcategoryPageProps) {
  const { category, subcategory } = await params;
  const decodedCat = decodeURIComponent(category);
  const decodedSub = decodeURIComponent(subcategory);
  
  const posts = getPostsByCategory(decodedCat, decodedSub);

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
        name: decodedCat,
        item: `https://himanshu.be/blog?category=${category}`
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: decodedSub,
        item: `https://himanshu.be/blog/category/${category}/${subcategory}`
      }
    ]
  };

  return (
    <main className="min-h-screen relative overflow-hidden py-16 px-4 md:px-6">
      {/* Structured SEO Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, '\\u003c') }}
      />
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--void-black)] via-[#0a0a1a] to-[var(--void-black)]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Back links */}
        <div className="flex items-center justify-between mb-12">
          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 text-[var(--tungsten-gray)] hover:text-[var(--terminal-cyan)] transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-mono">Blog Home</span>
          </Link>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-[var(--tungsten-gray)] hover:text-[var(--terminal-cyan)] transition-colors group"
          >
            <span className="text-sm font-mono">Back to Portfolio</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Tag className="w-6 h-6 text-purple-400" />
            <span className="text-purple-400 text-sm font-mono uppercase tracking-widest">
              {decodedCat}
            </span>
          </div>
          <h1 className="font-heading text-4xl md:text-5xl text-[var(--photon-white)] mb-4 capitalize">
            {decodedSub}
          </h1>
          <p className="text-[var(--tungsten-gray)] text-lg">
            Found {posts.length} {posts.length === 1 ? 'post' : 'posts'} in this subcategory.
          </p>
        </header>

        <div className="grid gap-6">
          {posts.length > 0 ? (
            posts.map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <article className="group p-6 bg-[var(--event-horizon)]/80 backdrop-blur-sm rounded-2xl border border-[var(--tungsten-gray)]/10 hover:border-[var(--terminal-cyan)]/30 transition-all hover:shadow-lg hover:shadow-[var(--terminal-cyan)]/5">
                  <div className="flex items-center gap-3 text-xs text-[var(--tungsten-gray)] mb-3 font-mono">
                    <Clock size={12} />
                    <time>{new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}</time>
                    <span className="w-1 h-1 rounded-full bg-[var(--tungsten-gray)]" />
                    <span>{post.readingTime}</span>
                  </div>
                  
                  <h2 className="font-heading text-xl md:text-2xl text-[var(--photon-white)] mb-3 group-hover:text-[var(--terminal-cyan)] transition-colors">
                    {post.title}
                  </h2>
                  
                  <p className="text-[var(--tungsten-gray)] mb-4 text-sm leading-relaxed">
                    {post.description}
                  </p>
                </article>
              </Link>
            ))
          ) : (
            <div className="text-center py-12 bg-[var(--event-horizon)]/50 rounded-2xl border border-[var(--tungsten-gray)]/10">
              <p className="text-[var(--tungsten-gray)]">No posts found in this subcategory.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
