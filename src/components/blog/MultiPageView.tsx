'use client'

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import {
  ArrowLeft, ArrowRight, BookOpen, FileText, List, Layers, Settings2, ChevronRight,
} from 'lucide-react';
import type { HeadingLevel, PostMeta } from '@/lib/mdx';
import type { Series } from '@/lib/series';
import ReadingModePrompt, {
  getStoredReadingMode,
  setStoredReadingMode,
  type ReadingMode,
} from './ReadingModePrompt';
import SeriesNavigation from './SeriesNavigation';

interface MultiPageViewProps {
  /** Post slug (used for localStorage keys) */
  slug: string;
  /** Force-only multi-page (no single-page option) */
  multiPageOnly?: boolean;
  /** Highlight multi-page as recommended in the prompt */
  multiPageRecommended?: boolean;
  /** Header level for automatic page splits */
  splitLevel: HeadingLevel;
  /** Reading time for the prompt UX */
  readingTime?: string;
  /** Series context (for cross-blog navigation at page boundaries) */
  series?: Series | null;
  seriesIndex?: number;
  seriesPrev?: PostMeta | null;
  seriesNext?: PostMeta | null;
  /** Server-rendered MDX article body */
  children: ReactNode;
}

interface PageInfo {
  index: number;
  title: string;
  /** Anchor id of the heading the page is keyed off, when applicable. */
  anchor?: string;
}

/**
 * Client-side wrapper that splits a server-rendered MDX article into pages.
 *
 * Strategy
 * --------
 * 1. We render the article exactly once (server-side via <MDXRemote>).
 * 2. On mount, we walk the rendered DOM and group direct children of the
 *    article into pages based on:
 *      a) `<hr data-page-break>` markers (from <PageBreak /> in MDX), OR
 *      b) headings matching `splitLevel`.
 *    Custom markers take priority; if any are present, header-based splits
 *    are ignored, letting the author mix split granularities.
 * 3. We wrap each page's elements in a container <div data-page="N">. Active
 *    page is visible, others get `display:none`. This preserves all original
 *    DOM (hashes, IDs, code highlighting) without re-rendering.
 * 4. Switching modes (single ↔ multi) toggles every page container's display.
 */
export default function MultiPageView({
  slug,
  multiPageOnly = false,
  multiPageRecommended = false,
  splitLevel,
  readingTime,
  series,
  seriesIndex = 0,
  seriesPrev = null,
  seriesNext = null,
  children,
}: MultiPageViewProps) {
  const articleRef = useRef<HTMLDivElement>(null);
  const splitDoneRef = useRef(false);
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [mode, setMode] = useState<ReadingMode>(multiPageOnly ? 'multi' : 'single');
  const [currentPage, setCurrentPage] = useState(0);
  const [showPrompt, setShowPrompt] = useState(false);
  const [indexOpenMobile, setIndexOpenMobile] = useState(false);
  /** DOM node in the parent page where the desktop Pages index is portaled to. */
  const [indexSlot, setIndexSlot] = useState<HTMLElement | null>(null);

  // Locate the portal slot rendered by the parent server component
  useEffect(() => {
    setIndexSlot(document.getElementById('multipage-index-slot'));
  }, []);

  // --- Split DOM into pages on mount (StrictMode-safe via splitDoneRef) ---
  useLayoutEffect(() => {
    // Guard against React 18 StrictMode double-invocation in dev: only split once.
    if (splitDoneRef.current) return;
    const article = articleRef.current;
    if (!article) return;

    // Find the inner content container holding MDX-rendered children.
    const content = article.querySelector('[data-mdx-content]') as HTMLElement | null;
    if (!content) return;

    // Collect direct children
    const children = Array.from(content.children) as HTMLElement[];
    if (children.length === 0) return;

    // If the content has already been split (e.g. fast-refresh remount), bail.
    if (children.every(c => c.hasAttribute('data-page'))) {
      splitDoneRef.current = true;
      return;
    }

    // Detect explicit page-break markers anywhere in the subtree
    const hasMarkers = !!content.querySelector('hr[data-page-break]');

    const splitTag = splitLevel.toUpperCase();

    const groups: HTMLElement[][] = [[]];
    const meta: PageInfo[] = [{ index: 0, title: 'Introduction' }];

    const startNewPage = (title: string, anchor?: string) => {
      groups.push([]);
      meta.push({ index: groups.length - 1, title, anchor });
    };

    for (const el of children) {
      let isSplit = false;
      let title: string | undefined;
      let anchor: string | undefined;

      if (hasMarkers) {
        if (el.tagName === 'HR' && el.dataset.pageBreak !== undefined) {
          isSplit = true;
          title = el.dataset.pageBreakTitle || `Page ${groups.length + 1}`;
        }
      } else if (el.tagName === splitTag) {
        isSplit = true;
        title = el.textContent || `Page ${groups.length + 1}`;
        anchor = el.id || undefined;
      }

      if (isSplit) {
        // Skip the marker element itself if it's an <hr data-page-break>
        if (el.tagName === 'HR' && el.dataset.pageBreak !== undefined) {
          startNewPage(title || `Page ${groups.length + 1}`);
          continue;
        }
        // For heading-based splits, the heading IS part of the new page.
        startNewPage(title || `Page ${groups.length + 1}`, anchor);
      }
      groups[groups.length - 1].push(el);
    }

    // Drop empty leading group (e.g. when the document starts with a heading)
    if (groups[0].length === 0 && groups.length > 1) {
      groups.shift();
      meta.shift();
      meta.forEach((m, i) => (m.index = i));
      // Re-title the new first group as the heading text it starts with
      if (groups[0]?.[0]) {
        const first = groups[0][0];
        if (first.id) meta[0].anchor = first.id;
        meta[0].title = first.textContent || meta[0].title;
      }
    }

    // Wrap each group in a page container.
    const fragment = document.createDocumentFragment();
    groups.forEach((group, i) => {
      const wrap = document.createElement('div');
      wrap.setAttribute('data-page', String(i));
      wrap.className = 'mdx-page';
      group.forEach(node => wrap.appendChild(node));
      fragment.appendChild(wrap);
    });

    // Replace content children with the wrapped pages.
    content.innerHTML = '';
    content.appendChild(fragment);

    setPages(meta);

    // --- Decide initial mode ---
    let initialMode: ReadingMode = multiPageOnly ? 'multi' : 'single';
    const stored = getStoredReadingMode(slug);
    if (stored && !multiPageOnly) initialMode = stored;
    if (multiPageOnly) initialMode = 'multi';
    setMode(initialMode);

    // Show prompt if no stored preference and there is more than one page
    if (!multiPageOnly && stored === null && meta.length > 1) {
      setShowPrompt(true);
    }

    // Restore page from URL hash like #page-3
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    const pageMatch = hash.match(/^#page-(\d+)/);
    if (pageMatch) {
      const idx = Math.min(meta.length - 1, Math.max(0, parseInt(pageMatch[1], 10) - 1));
      setCurrentPage(idx);
    } else if (hash) {
      // Find which page contains the hash target and switch to it
      const id = hash.slice(1);
      const target = document.getElementById(id);
      const wrap = target?.closest('[data-page]') as HTMLElement | null;
      if (wrap) setCurrentPage(parseInt(wrap.dataset.page || '0', 10));
    }

    splitDoneRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Apply visibility based on mode + currentPage ---
  useEffect(() => {
    const content = articleRef.current?.querySelector('[data-mdx-content]');
    if (!content) return;
    const wraps = content.querySelectorAll<HTMLElement>('[data-page]');
    wraps.forEach(wrap => {
      const idx = parseInt(wrap.dataset.page || '0', 10);
      if (mode === 'single') {
        wrap.style.display = '';
      } else {
        wrap.style.display = idx === currentPage ? '' : 'none';
      }
    });
  }, [mode, currentPage, pages.length]);

  // --- Sync URL hash to current page in multi-page mode ---
  useEffect(() => {
    if (mode !== 'multi' || pages.length === 0) return;
    if (typeof window === 'undefined') return;
    const newHash = `#page-${currentPage + 1}`;
    if (window.location.hash !== newHash) {
      // Use replaceState so we don't pollute history on every page change
      window.history.replaceState(null, '', newHash);
    }
    // Scroll to top of article on page change
    articleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [currentPage, mode, pages.length]);

  // --- Handlers ---
  const goToPage = (idx: number) => {
    if (idx < 0 || idx >= pages.length) return;
    setCurrentPage(idx);
    setIndexOpenMobile(false);
  };

  const handleModeChoice = (m: ReadingMode) => {
    setMode(m);
    setStoredReadingMode(slug, m);
    setShowPrompt(false);
  };

  // No splits → render as-is (no multi-page UI)
  const isMulti = mode === 'multi' && pages.length > 1;

  const accent = series?.accent || 'var(--terminal-cyan)';

  // ============ Render ============
  return (
    <>
      {/* Reading mode prompt */}
      {!multiPageOnly && pages.length > 1 && (showPrompt) && (
        <ReadingModePrompt
          slug={slug}
          recommended={multiPageRecommended}
          readingTime={readingTime}
          pageCount={pages.length}
          onChoose={handleModeChoice}
          forceOpen={showPrompt}
          onClose={() => setShowPrompt(false)}
        />
      )}

      {/* Toolbar (visible when multi-page is possible) */}
      {pages.length > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 p-3 rounded-xl border border-[var(--tungsten-gray)]/15 bg-[var(--event-horizon)]/60 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--tungsten-gray)]">
            <Layers size={14} className="text-[var(--terminal-cyan)]" />
            {isMulti
              ? <>Page <span className="text-[var(--photon-white)]">{currentPage + 1}</span> of {pages.length}</>
              : <>{pages.length} sections · reading in single-page mode</>}
          </div>

          {!multiPageOnly && (
            <div className="flex items-center gap-1 p-1 bg-[var(--void-black)]/60 rounded-lg border border-[var(--tungsten-gray)]/10">
              <button
                type="button"
                onClick={() => { setMode('single'); setStoredReadingMode(slug, 'single'); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
                  mode === 'single'
                    ? 'bg-[var(--terminal-cyan)]/10 text-[var(--terminal-cyan)] border border-[var(--terminal-cyan)]/30'
                    : 'text-[var(--tungsten-gray)] hover:text-[var(--photon-white)] border border-transparent'
                }`}
                aria-pressed={mode === 'single'}
              >
                <FileText size={12} /> Single page
              </button>
              <button
                type="button"
                onClick={() => { setMode('multi'); setStoredReadingMode(slug, 'multi'); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
                  mode === 'multi'
                    ? 'bg-[var(--terminal-cyan)]/10 text-[var(--terminal-cyan)] border border-[var(--terminal-cyan)]/30'
                    : 'text-[var(--tungsten-gray)] hover:text-[var(--photon-white)] border border-transparent'
                }`}
                aria-pressed={mode === 'multi'}
              >
                <BookOpen size={12} /> Multi-page
              </button>
            </div>
          )}

          {/* Mobile index toggle */}
          {isMulti && (
            <button
              type="button"
              onClick={() => setIndexOpenMobile(v => !v)}
              className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono border border-[var(--tungsten-gray)]/20 text-[var(--tungsten-gray)] hover:text-[var(--photon-white)]"
              aria-expanded={indexOpenMobile}
            >
              <List size={12} /> Pages
            </button>
          )}

          {/* Reopen the prompt */}
          {!multiPageOnly && (
            <button
              type="button"
              onClick={() => setShowPrompt(true)}
              aria-label="Open reading-mode chooser"
              className="hidden md:inline-flex items-center text-[var(--tungsten-gray)] hover:text-[var(--photon-white)] transition-colors"
            >
              <Settings2 size={14} />
            </button>
          )}
        </div>
      )}

      {/* Page index drawer (mobile) */}
      {isMulti && indexOpenMobile && (
        <PageIndex
          pages={pages}
          current={currentPage}
          onPick={goToPage}
          className="md:hidden mb-4"
        />
      )}

      {/* Desktop Pages index — portaled into the parent page's left sidebar slot
          so the article stays centered (column 2) and the index lives in column 1,
          matching the position of the regular "On this page" TOC. */}
      {isMulti && indexSlot && createPortal(
        <PageIndex pages={pages} current={currentPage} onPick={goToPage} />,
        indexSlot,
      )}

      <div className="relative">
        {/* The actual article content */}
        <div ref={articleRef}>
          <div className="prose prose-invert max-w-none" data-mdx-content>
            {children}
          </div>

          {/* Bottom page navigation (multi-page only) */}
          {isMulti && (
            <BottomNavigation
              pageIndex={currentPage}
              pageCount={pages.length}
              pages={pages}
              onPrev={() => goToPage(currentPage - 1)}
              onNext={() => goToPage(currentPage + 1)}
              series={series || null}
              seriesPrev={seriesPrev}
              seriesNext={seriesNext}
              accent={accent}
            />
          )}

          {/* In single-page mode, fall back to the regular series navigation. */}
          {!isMulti && series && (seriesPrev || seriesNext) && (
            <SeriesNavigation
              series={series}
              index={seriesIndex}
              prev={seriesPrev}
              next={seriesNext}
            />
          )}
        </div>
      </div>
    </>
  );
}

// --- Subcomponents ---

function PageIndex({
  pages,
  current,
  onPick,
  className = '',
  variant = 'sidebar',
}: {
  pages: PageInfo[];
  current: number;
  onPick: (i: number) => void;
  className?: string;
  /** 'sidebar' matches the "On this page" TOC visual; 'card' is the boxed mobile drawer. */
  variant?: 'sidebar' | 'card';
}) {
  if (variant === 'card') {
    return (
      <nav className={`p-4 rounded-xl border border-[var(--tungsten-gray)]/15 bg-[var(--event-horizon)]/80 backdrop-blur-sm ${className}`}>
        <h4 className="font-heading text-sm tracking-widest uppercase text-[var(--photon-white)] mb-3 flex items-center gap-2">
          <List size={14} className="text-[var(--terminal-cyan)]" />
          Pages
        </h4>
        <ol className="space-y-1 max-h-[60vh] overflow-y-auto no-scrollbar">
          {pages.map(p => (
            <li key={p.index}>
              <button
                type="button"
                onClick={() => onPick(p.index)}
                aria-current={p.index === current ? 'page' : undefined}
                className={`
                  w-full text-left flex items-start gap-2 px-2 py-1.5 rounded-md text-sm transition-colors
                  ${p.index === current
                    ? 'bg-[var(--terminal-cyan)]/10 text-[var(--terminal-cyan)]'
                    : 'text-[var(--tungsten-gray)] hover:text-[var(--photon-white)] hover:bg-[var(--void-black)]/40'}
                `}
              >
                <span className="font-mono text-[10px] opacity-60 mt-0.5 shrink-0">
                  {String(p.index + 1).padStart(2, '0')}
                </span>
                <span className="break-words">{p.title}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>
    );
  }

  // sidebar variant — mirrors the look of <TableOfContents />
  return (
    <div className={`space-y-4 ${className}`}>
      <h4 className="font-heading text-lg text-[var(--photon-white)] tracking-wide uppercase">Pages</h4>
      <nav className="flex flex-col gap-2 border-l-2 border-[var(--tungsten-gray)]/20 pl-4">
        {pages.map(p => (
          <button
            key={p.index}
            type="button"
            onClick={() => onPick(p.index)}
            aria-current={p.index === current ? 'page' : undefined}
            className={`
              text-sm transition-colors text-left break-words
              ${p.index === current
                ? 'text-[var(--terminal-cyan)] font-medium'
                : 'text-[var(--tungsten-gray)] hover:text-[var(--photon-white)]'}
            `}
          >
            <span className="font-mono text-[10px] opacity-60 mr-2">
              {String(p.index + 1).padStart(2, '0')}
            </span>
            {p.title}
          </button>
        ))}
      </nav>
    </div>
  );
}

function BottomNavigation({
  pageIndex,
  pageCount,
  pages,
  onPrev,
  onNext,
  series,
  seriesPrev,
  seriesNext,
  accent,
}: {
  pageIndex: number;
  pageCount: number;
  pages: PageInfo[];
  onPrev: () => void;
  onNext: () => void;
  series: Series | null;
  seriesPrev: PostMeta | null;
  seriesNext: PostMeta | null;
  accent: string;
}) {
  const isFirst = pageIndex === 0;
  const isLast = pageIndex === pageCount - 1;

  // Determine what "previous" and "next" mean for the current page in series context.
  // - First page of a multi-page blog in a series: prev = previous blog, next = next page
  // - Middle page: prev = previous page, next = next page
  // - Last page in a series: prev = previous page, next = next blog
  const showPrevBlog = isFirst && series && seriesPrev;
  const showNextBlog = isLast && series && seriesNext;

  return (
    <div className="mt-12 pt-8 border-t border-[var(--tungsten-gray)]/15">
      <div className="grid gap-4 md:grid-cols-2">
        {/* Left slot */}
        {showPrevBlog ? (
          <BlogNeighborButton
            post={seriesPrev!}
            direction="prev"
            accent={accent}
            label="Previous blog"
          />
        ) : !isFirst ? (
          <PageButton
            direction="prev"
            label="Previous page"
            target={pages[pageIndex - 1]}
            onClick={onPrev}
          />
        ) : (
          <span className="hidden md:block" />
        )}

        {/* Right slot */}
        {showNextBlog ? (
          <BlogNeighborButton
            post={seriesNext!}
            direction="next"
            accent={accent}
            label="Next blog"
          />
        ) : !isLast ? (
          <PageButton
            direction="next"
            label="Next page"
            target={pages[pageIndex + 1]}
            onClick={onNext}
          />
        ) : (
          <span className="hidden md:block" />
        )}
      </div>

      {/* Page progress dots */}
      <div className="mt-6 flex items-center justify-center gap-1.5">
        {pages.map((p, i) => (
          <button
            key={p.index}
            type="button"
            onClick={() => i !== pageIndex && (i < pageIndex ? onPrev : onNext)()}
            aria-label={`Go to page ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === pageIndex
                ? 'w-8 bg-[var(--terminal-cyan)]'
                : 'w-1.5 bg-[var(--tungsten-gray)]/30 hover:bg-[var(--tungsten-gray)]/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function PageButton({
  direction,
  label,
  target,
  onClick,
}: {
  direction: 'prev' | 'next';
  label: string;
  target?: PageInfo;
  onClick: () => void;
}) {
  const isPrev = direction === 'prev';
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        group p-5 rounded-2xl border border-[var(--tungsten-gray)]/15 bg-[var(--event-horizon)]/60
        hover:border-[var(--terminal-cyan)]/40 hover:bg-[var(--event-horizon)] transition-all
        flex items-center gap-3 text-left
        ${isPrev ? '' : 'md:flex-row-reverse md:text-right'}
      `}
    >
      {isPrev ? (
        <ArrowLeft className="text-[var(--terminal-cyan)] group-hover:-translate-x-1 transition-transform" size={20} />
      ) : (
        <ArrowRight className="text-[var(--terminal-cyan)] group-hover:translate-x-1 transition-transform" size={20} />
      )}
      <div className="min-w-0 flex-1">
        <div className="text-xs font-mono uppercase tracking-widest text-[var(--terminal-cyan)] mb-0.5">
          {label}
        </div>
        <div className="font-heading text-base text-[var(--photon-white)] line-clamp-1">
          {target?.title || (isPrev ? 'Previous' : 'Next')}
        </div>
      </div>
    </button>
  );
}

function BlogNeighborButton({
  post,
  direction,
  accent,
  label,
}: {
  post: PostMeta;
  direction: 'prev' | 'next';
  accent: string;
  label: string;
}) {
  const isPrev = direction === 'prev';
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`
        group p-5 rounded-2xl border border-[var(--tungsten-gray)]/15 bg-[var(--event-horizon)]/60
        hover:border-[color:var(--accent)]/40 hover:bg-[var(--event-horizon)] transition-all
        flex items-center gap-3 ${isPrev ? '' : 'md:flex-row-reverse md:text-right'}
      `}
      style={{ ['--accent' as never]: accent }}
    >
      <div
        className="w-12 h-12 rounded-lg flex items-center justify-center border shrink-0"
        style={{ borderColor: `${accent}55`, color: accent, backgroundColor: `${accent}10` }}
      >
        {isPrev ? <ArrowLeft size={18} /> : <ChevronRight size={18} />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs font-mono uppercase tracking-widest mb-0.5" style={{ color: accent }}>
          {label}
        </div>
        <div className="font-heading text-base text-[var(--photon-white)] line-clamp-1">
          {post.title}
        </div>
        <div className="text-xs text-[var(--tungsten-gray)] line-clamp-1 mt-0.5">
          {post.description}
        </div>
      </div>
    </Link>
  );
}
