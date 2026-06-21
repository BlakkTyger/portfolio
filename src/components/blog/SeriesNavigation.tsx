import Link from 'next/link';
import { ArrowLeft, ArrowRight, Layers } from 'lucide-react';
import type { PostMeta } from '@/lib/mdx';
import type { Series } from '@/lib/series';

interface SeriesNavigationProps {
  series: Series;
  index: number;
  prev: PostMeta | null;
  next: PostMeta | null;
}

/**
 * Bottom-of-post navigation for blogs that belong to a series.
 * Each side shows a rich card (image, title, description preview)
 * for the previous / next post in the same series.
 */
export default function SeriesNavigation({ series, index, prev, next }: SeriesNavigationProps) {
  const accent = series.accent || 'var(--terminal-cyan)';

  return (
    <nav
      aria-label={`${series.title} navigation`}
      className="mt-16 pt-12 border-t border-[var(--tungsten-gray)]/15"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-sm font-mono uppercase tracking-widest" style={{ color: accent }}>
          <Layers size={14} />
          <span>{series.title}</span>
        </div>
        <Link
          href={`/blog/series/${series.id}`}
          className="text-xs font-mono text-[var(--tungsten-gray)] hover:text-[var(--photon-white)] transition-colors"
        >
          Part {index + 1} of {series.posts.length} · View all →
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <NeighborCard post={prev} direction="prev" accent={accent} />
        <NeighborCard post={next} direction="next" accent={accent} />
      </div>
    </nav>
  );
}

function NeighborCard({
  post,
  direction,
  accent,
}: {
  post: PostMeta | null;
  direction: 'prev' | 'next';
  accent: string;
}) {
  if (!post) {
    return (
      <div
        className={`p-5 rounded-2xl border border-dashed border-[var(--tungsten-gray)]/15 text-[var(--tungsten-gray)]/50 text-sm font-mono ${
          direction === 'next' ? 'md:text-right' : ''
        }`}
      >
        {direction === 'prev' ? '— Beginning of series —' : '— End of series —'}
      </div>
    );
  }

  const isPrev = direction === 'prev';
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`
        group relative p-5 rounded-2xl border border-[var(--tungsten-gray)]/15
        bg-[var(--event-horizon)]/80 backdrop-blur-sm transition-all
        hover:border-[color:var(--accent)]/40 hover:shadow-lg hover:shadow-[color:var(--accent)]/5
        flex gap-4 ${isPrev ? '' : 'md:flex-row-reverse md:text-right'}
      `}
      style={{ ['--accent' as never]: accent }}
    >
      {/* Thumbnail */}
      <div
        className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-[var(--tungsten-gray)]/10"
        aria-hidden
      >
        {post.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.cover}
            alt=""
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 40% 40%, ${accent}55, transparent 70%), var(--void-black)`,
            }}
          />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div
          className={`flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest mb-1.5 ${
            isPrev ? '' : 'md:justify-end'
          }`}
          style={{ color: accent }}
        >
          {isPrev ? (
            <>
              <ArrowLeft size={12} /> Previous blog
            </>
          ) : (
            <>
              Next blog <ArrowRight size={12} />
            </>
          )}
        </div>
        <h3 className="font-heading text-base md:text-lg text-[var(--photon-white)] group-hover:text-[color:var(--accent)] transition-colors line-clamp-2 mb-1"
            style={{ ['--accent' as never]: accent }}>
          {post.title}
        </h3>
        <p className="text-xs text-[var(--tungsten-gray)] line-clamp-2">
          {post.description}
        </p>
      </div>
    </Link>
  );
}
