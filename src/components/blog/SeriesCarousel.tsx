'use client'

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Layers, BookOpen } from 'lucide-react';
import type { Series } from '@/lib/series';

interface SeriesCarouselProps {
  series: Series[];
}

/**
 * Horizontal-scroll showcase of blog series.
 * - 30vh tall on desktop, 45vh on mobile (taller for thumb readability).
 * - Snap scrolling, drag-to-scroll, keyboard left/right, scroll buttons, edge gradient.
 * - Each card mimics a stack of papers via layered ::before / ::after pseudo-elements
 *   to visually suggest "a series of posts".
 */
export default function SeriesCarousel({ series }: SeriesCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const updateScrollState = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateScrollState();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [series.length]);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  // Drag-to-scroll for mouse users
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let startScroll = 0;

    const handleDown = (e: MouseEvent) => {
      isDown = true;
      setIsDragging(true);
      startX = e.pageX - el.offsetLeft;
      startScroll = el.scrollLeft;
    };
    const handleLeave = () => {
      isDown = false;
      setIsDragging(false);
    };
    const handleUp = () => {
      isDown = false;
      setIsDragging(false);
    };
    const handleMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 1.2;
      el.scrollLeft = startScroll - walk;
    };

    el.addEventListener('mousedown', handleDown);
    el.addEventListener('mouseleave', handleLeave);
    el.addEventListener('mouseup', handleUp);
    el.addEventListener('mousemove', handleMove);
    return () => {
      el.removeEventListener('mousedown', handleDown);
      el.removeEventListener('mouseleave', handleLeave);
      el.removeEventListener('mouseup', handleUp);
      el.removeEventListener('mousemove', handleMove);
    };
  }, []);

  // Keyboard support when carousel is focused
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollBy(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollBy(-1);
    }
  };

  if (series.length === 0) return null;

  return (
    <section className="mb-16" aria-labelledby="series-heading">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Layers className="text-amber-400" size={24} />
          <h2 id="series-heading" className="font-heading text-3xl text-[var(--photon-white)]">
            Series
          </h2>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            disabled={!canScrollLeft}
            aria-label="Scroll series left"
            className="p-2 rounded-full border border-[var(--tungsten-gray)]/20 text-[var(--tungsten-gray)] enabled:hover:text-[var(--terminal-cyan)] enabled:hover:border-[var(--terminal-cyan)]/40 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            disabled={!canScrollRight}
            aria-label="Scroll series right"
            className="p-2 rounded-full border border-[var(--tungsten-gray)]/20 text-[var(--tungsten-gray)] enabled:hover:text-[var(--terminal-cyan)] enabled:hover:border-[var(--terminal-cyan)]/40 disabled:opacity-30 transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="relative">
        {/* Edge gradients */}
        <div
          aria-hidden
          className={`pointer-events-none absolute left-0 top-0 bottom-0 w-12 z-10 transition-opacity ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`}
          style={{ background: 'linear-gradient(to right, var(--void-black), transparent)' }}
        />
        <div
          aria-hidden
          className={`pointer-events-none absolute right-0 top-0 bottom-0 w-12 z-10 transition-opacity ${canScrollRight ? 'opacity-100' : 'opacity-0'}`}
          style={{ background: 'linear-gradient(to left, var(--void-black), transparent)' }}
        />

        <div
          ref={scrollerRef}
          onKeyDown={handleKey}
          tabIndex={0}
          role="region"
          aria-label="Blog series carousel"
          className={`
            flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 pr-4
            scroll-smooth no-scrollbar focus:outline-none
            ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}
          `}
          style={{ height: 'clamp(280px, 30vh, 360px)' }}
        >
          {series.map(s => (
            <SeriesCard key={s.id} series={s} dragging={isDragging} />
          ))}
        </div>

        {/* Mobile fallback height (taller) */}
        <style jsx>{`
          @media (max-width: 768px) {
            div[role='region'] {
              height: clamp(360px, 45vh, 480px) !important;
            }
          }
        `}</style>
      </div>
    </section>
  );
}

function SeriesCard({ series, dragging }: { series: Series; dragging: boolean }) {
  const accent = series.accent || 'var(--terminal-cyan)';
  return (
    <Link
      href={`/blog/series/${series.id}`}
      onClick={e => {
        // Suppress navigation if the user just finished dragging
        if (dragging) e.preventDefault();
      }}
      className="snap-start shrink-0 group relative"
      style={{ width: 'min(82vw, 28rem)' }}
    >
      {/* Layered "stack of papers" effect */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-2xl bg-[var(--event-horizon)]/40 border border-[var(--tungsten-gray)]/10 translate-x-2 translate-y-2 rotate-1 transition-transform group-hover:translate-x-3 group-hover:translate-y-3 group-hover:rotate-2"
      />
      <div
        aria-hidden
        className="absolute inset-0 rounded-2xl bg-[var(--event-horizon)]/60 border border-[var(--tungsten-gray)]/10 translate-x-1 translate-y-1 -rotate-1 transition-transform group-hover:translate-x-1.5 group-hover:translate-y-1.5 group-hover:-rotate-2"
      />

      <article
        className="relative h-full rounded-2xl overflow-hidden border border-[var(--tungsten-gray)]/15 bg-[var(--event-horizon)] transition-all group-hover:border-[color:var(--accent)]/50 group-hover:shadow-2xl group-hover:shadow-[color:var(--accent)]/10"
        style={{ ['--accent' as never]: accent }}
      >
        {/* Background cover */}
        {series.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={series.cover}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700"
            draggable={false}
          />
        ) : (
          <div
            className="absolute inset-0 opacity-60"
            style={{
              background: `radial-gradient(circle at 30% 20%, ${accent}33, transparent 60%), radial-gradient(circle at 80% 80%, var(--spectral-violet)33, transparent 60%)`,
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--void-black)] via-[var(--void-black)]/70 to-transparent" />

        {/* Content */}
        <div className="relative z-10 h-full p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono uppercase tracking-wider border"
              style={{ color: accent, borderColor: `${accent}55`, backgroundColor: `${accent}10` }}
            >
              <Layers size={12} /> Series
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-mono text-[var(--tungsten-gray)]">
              <BookOpen size={12} />
              {series.posts.length} {series.posts.length === 1 ? 'part' : 'parts'}
            </span>
          </div>

          <div>
            {series.tagline && (
              <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: accent }}>
                {series.tagline}
              </p>
            )}
            <h3 className="font-heading text-2xl md:text-3xl text-[var(--photon-white)] mb-2 line-clamp-2">
              {series.title}
            </h3>
            <p className="text-sm text-[var(--tungsten-gray)] line-clamp-2 mb-3">
              {series.description}
            </p>

            {/* Preview of post titles */}
            <ul className="space-y-1 text-xs text-[var(--tungsten-gray)]/80 max-h-16 overflow-hidden">
              {series.posts.slice(0, 3).map((p, i) => (
                <li key={p.slug} className="truncate">
                  <span className="font-mono text-[var(--tungsten-gray)]/60 mr-2">{String(i + 1).padStart(2, '0')}</span>
                  {p.title}
                </li>
              ))}
              {series.posts.length > 3 && (
                <li className="text-[var(--tungsten-gray)]/60 italic">
                  + {series.posts.length - 3} more…
                </li>
              )}
            </ul>
          </div>
        </div>
      </article>
    </Link>
  );
}
