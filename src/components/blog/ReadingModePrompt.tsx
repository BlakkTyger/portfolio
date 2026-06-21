'use client'

import { useEffect, useState } from 'react';
import { BookOpen, FileText, Sparkles, X } from 'lucide-react';

export type ReadingMode = 'single' | 'multi';

const storageKey = (slug: string) => `reading-mode:${slug}`;

/**
 * Read the stored reading mode for a given slug. Returns null if no choice yet.
 * Safe in SSR (returns null).
 */
export function getStoredReadingMode(slug: string): ReadingMode | null {
  if (typeof window === 'undefined') return null;
  try {
    const v = localStorage.getItem(storageKey(slug));
    return v === 'multi' || v === 'single' ? v : null;
  } catch {
    return null;
  }
}

export function setStoredReadingMode(slug: string, mode: ReadingMode) {
  try {
    localStorage.setItem(storageKey(slug), mode);
  } catch {}
}

interface ReadingModePromptProps {
  slug: string;
  /** Should we recommend the multi-page option? */
  recommended?: boolean;
  /** Approximate reading time string ("12 min read") for context. */
  readingTime?: string;
  /** Total number of pages in multi-page mode. */
  pageCount: number;
  /** Called when the user makes a choice. */
  onChoose: (mode: ReadingMode) => void;
  /** If true, prompt is forced visible (e.g. via toolbar button). */
  forceOpen?: boolean;
  /** Called when force-open prompt is dismissed. */
  onClose?: () => void;
}

/**
 * Blur-background modal asking the reader to pick single- or multi-page mode.
 * Shown on the first visit to a multi-page blog (unless `multiPageOnly`).
 * Choice is stored per-slug in localStorage so subsequent visits skip it.
 */
export default function ReadingModePrompt({
  slug,
  recommended = false,
  readingTime,
  pageCount,
  onChoose,
  forceOpen = false,
  onClose,
}: ReadingModePromptProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (forceOpen) {
      setVisible(true);
      return;
    }
    const stored = getStoredReadingMode(slug);
    if (stored === null) {
      setVisible(true);
    }
  }, [slug, forceOpen]);

  if (!visible) return null;

  const choose = (mode: ReadingMode) => {
    setStoredReadingMode(slug, mode);
    setVisible(false);
    onChoose(mode);
    onClose?.();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reading-mode-title"
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
    >
      {/* Blurred backdrop */}
      <div
        className="absolute inset-0 bg-[var(--void-black)]/70 backdrop-blur-md animate-in fade-in"
        onClick={forceOpen ? () => { setVisible(false); onClose?.(); } : undefined}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-[var(--event-horizon)] border border-[var(--tungsten-gray)]/20 rounded-2xl shadow-2xl p-8 md:p-10 animate-in fade-in zoom-in-95">
        {forceOpen && (
          <button
            type="button"
            onClick={() => { setVisible(false); onClose?.(); }}
            aria-label="Close"
            className="absolute top-4 right-4 text-[var(--tungsten-gray)] hover:text-[var(--photon-white)] transition-colors"
          >
            <X size={20} />
          </button>
        )}

        <div className="flex items-center gap-2 mb-4 text-[var(--terminal-cyan)] text-xs font-mono uppercase tracking-widest">
          <Sparkles size={14} />
          Reading experience
        </div>
        <h2 id="reading-mode-title" className="font-heading text-2xl md:text-3xl text-[var(--photon-white)] mb-3">
          How would you like to read this?
        </h2>
        <p className="text-[var(--tungsten-gray)] mb-8 leading-relaxed">
          This {readingTime ? <span className="text-[var(--photon-white)]">{readingTime}</span> : 'longer'} post supports
          a multi-page reading mode that splits it into <span className="text-[var(--photon-white)]">{pageCount} pages</span>{' '}
          for a more focused experience. You can switch between modes at any time from the toolbar.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <button
            type="button"
            onClick={() => choose('single')}
            className={`
              group text-left p-5 rounded-xl border transition-all
              ${recommended
                ? 'border-[var(--tungsten-gray)]/20 bg-[var(--void-black)]/40 hover:border-[var(--tungsten-gray)]/40'
                : 'border-[var(--terminal-cyan)]/40 bg-[var(--terminal-cyan)]/5 hover:border-[var(--terminal-cyan)]/60'}
            `}
          >
            <div className="flex items-center gap-2 mb-2">
              <FileText size={18} className="text-[var(--photon-white)]" />
              <span className="font-heading text-lg text-[var(--photon-white)]">Single page</span>
            </div>
            <p className="text-sm text-[var(--tungsten-gray)]">
              Classic scroll-through. Best for skimming or referring back to multiple sections at once.
            </p>
          </button>

          <button
            type="button"
            onClick={() => choose('multi')}
            className={`
              group text-left p-5 rounded-xl border transition-all relative
              ${recommended
                ? 'border-[var(--terminal-cyan)]/50 bg-[var(--terminal-cyan)]/10 hover:border-[var(--terminal-cyan)]/70 shadow-lg shadow-[var(--terminal-cyan)]/10'
                : 'border-[var(--tungsten-gray)]/20 bg-[var(--void-black)]/40 hover:border-[var(--tungsten-gray)]/40'}
            `}
          >
            {recommended && (
              <span className="absolute -top-2 -right-2 px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest bg-[var(--terminal-cyan)] text-black rounded-full">
                Recommended
              </span>
            )}
            <div className="flex items-center gap-2 mb-2">
              <BookOpen size={18} className="text-[var(--terminal-cyan)]" />
              <span className="font-heading text-lg text-[var(--photon-white)]">Multi-page</span>
            </div>
            <p className="text-sm text-[var(--tungsten-gray)]">
              Read one section at a time with prev / next navigation. Better for long-form material.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
