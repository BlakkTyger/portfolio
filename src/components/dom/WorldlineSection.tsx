'use client'

import { useEffect, useRef } from 'react';
import { scrollState } from '@/components/canvas/WorldlineScene';
import { milestones } from '@/data/timeline';

export default function WorldlineSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = sectionRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;

      // Calculate how far through this section we've scrolled
      // When section top hits viewport bottom: progress = 0
      // When section bottom hits viewport top: progress = 1
      const sectionTop = rect.top;
      const sectionBottom = rect.bottom;

      if (sectionTop > viewportHeight) {
        // Section is below viewport
        scrollState.progress = 0;
      } else if (sectionBottom < 0) {
        // Section is above viewport
        scrollState.progress = 1;
      } else {
        // Section is in view - calculate progress
        const totalScrollDistance = sectionHeight + viewportHeight;
        const scrolled = viewportHeight - sectionTop;
        scrollState.progress = Math.max(0, Math.min(1, scrolled / totalScrollDistance));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="worldline"
      className="relative min-h-[300vh] py-20"
    >
      {/* Section header */}
      <div className="max-w-4xl mx-auto px-6 text-center mb-12 sticky top-20">
        <span className="text-[var(--terminal-cyan)] text-sm font-mono uppercase tracking-widest mb-4 block">
          My Journey
        </span>
        <h2 className="font-heading text-5xl md:text-6xl lg:text-7xl mb-8 text-[var(--photon-white)]">
          Worldline
        </h2>
        <p className="text-lg md:text-xl text-[var(--tungsten-gray)] max-w-2xl mx-auto">
          Scroll to travel through my timeline — from past to present.
        </p>
      </div>

      {/* Milestone labels that appear as you scroll */}
      <div className="relative">
        {milestones.map((milestone, index) => (
          <div
            key={milestone.id}
            className="h-screen flex items-center justify-center"
          >
            <div className="text-center opacity-0 animate-fade-in pointer-events-none">
              <span className="text-6xl font-heading text-[var(--photon-white)]">
                {milestone.year}
              </span>
              <h3 className="text-2xl font-heading text-[var(--terminal-cyan)] mt-2">
                {milestone.title}
              </h3>
              <p className="text-[var(--tungsten-gray)] mt-2 max-w-md">
                {milestone.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
