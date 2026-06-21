import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Layers, BookOpen, ArrowRight } from 'lucide-react';
import { getAllSeriesIds, getSeries } from '@/lib/series';

export async function generateStaticParams() {
  return getAllSeriesIds().map(id => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const series = getSeries(id);
  if (!series) return { title: 'Series' };
  return {
    title: `${series.title} — Series`,
    description: series.description,
    alternates: { canonical: `/blog/series/${id}` },
  };
}

export default async function SeriesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const series = getSeries(id);
  if (!series) notFound();

  const accent = series.accent || 'var(--terminal-cyan)';

  return (
    <main className="min-h-screen relative">
      <div
        className="absolute inset-x-0 top-0 h-[60vh] -z-10 opacity-50"
        style={{
          background: series.cover
            ? `linear-gradient(to bottom, transparent, var(--void-black)), url('${series.cover}') center/cover`
            : `radial-gradient(circle at 30% 20%, ${accent}33, transparent 60%), radial-gradient(circle at 80% 80%, var(--spectral-violet)33, transparent 60%)`,
        }}
      />

      <div className="relative max-w-4xl mx-auto px-6 py-16">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-[var(--tungsten-gray)] hover:text-[var(--terminal-cyan)] mb-12 transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-mono">Back to Blog</span>
        </Link>

        <header className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Layers size={20} style={{ color: accent }} />
            <span className="text-sm font-mono uppercase tracking-widest" style={{ color: accent }}>
              {series.tagline || 'Blog Series'}
            </span>
          </div>
          <h1 className="font-heading text-5xl md:text-6xl text-[var(--photon-white)] mb-4">
            {series.title}
          </h1>
          <p className="text-lg text-[var(--tungsten-gray)] max-w-2xl mb-4">
            {series.description}
          </p>
          <div className="inline-flex items-center gap-2 text-sm font-mono text-[var(--tungsten-gray)]">
            <BookOpen size={14} />
            {series.posts.length} {series.posts.length === 1 ? 'part' : 'parts'}
          </div>
        </header>

        <ol className="space-y-4">
          {series.posts.map((post, i) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex gap-6 p-6 bg-[var(--event-horizon)]/80 backdrop-blur-sm rounded-2xl border border-[var(--tungsten-gray)]/10 hover:border-[color:var(--accent)]/40 transition-all"
                style={{ ['--accent' as never]: accent }}
              >
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-mono text-sm border"
                  style={{ color: accent, borderColor: `${accent}55`, backgroundColor: `${accent}10` }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-heading text-xl md:text-2xl text-[var(--photon-white)] mb-2 group-hover:text-[color:var(--accent)] transition-colors" style={{ ['--accent' as never]: accent }}>
                    {post.title}
                  </h2>
                  <p className="text-sm text-[var(--tungsten-gray)] mb-2 line-clamp-2">
                    {post.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs font-mono text-[var(--tungsten-gray)]/70">
                    <time>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</time>
                    <span>•</span>
                    <span>{post.readingTime}</span>
                  </div>
                </div>
                <ArrowRight className="self-center text-[var(--tungsten-gray)]/40 group-hover:text-[color:var(--accent)] group-hover:translate-x-1 transition-all" size={20} style={{ ['--accent' as never]: accent }} />
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}
