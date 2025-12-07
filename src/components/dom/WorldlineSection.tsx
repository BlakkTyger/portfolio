'use client'

import { useEffect, useRef, useState } from 'react';
import { scrollState } from '@/components/canvas/WorldlineScene';
import { milestones } from '@/data/timeline';

// Narrative descriptions for each milestone (more story-like)
const narratives: Record<string, string> = {
  'birth': 'Every story has a beginning. Mine started in a small town where curiosity was my constant companion.',
  'high-school': 'The universe revealed its secrets through physics. I remember staying late in the library, captivated by quantum mechanics and the nature of reality.',
  'university': 'Formal education became my gateway to deeper understanding. The equations weren\'t just symbols—they were the language of the cosmos.',
  'first-code': 'A new superpower emerged. With a few lines of Python, I could simulate the very phenomena I was studying. Code became my laboratory.',
  'research': 'Theory met practice. Working on quantum computing research, I glimpsed the future we\'re building—one qubit at a time.',
  'graduation': 'A milestone, not an ending. Armed with knowledge and driven by questions, I stepped into the next chapter.',
  'present': 'Today, I stand at the intersection of physics, code, and philosophy. The journey continues, each day a new discovery.',
};

export default function WorldlineSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const totalMilestones = milestones.length;

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = sectionRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;

      const sectionTop = rect.top;
      const sectionBottom = rect.bottom;

      if (sectionTop > viewportHeight) {
        scrollState.progress = 0;
        setActiveIndex(0);
        setTransitionProgress(0);
      } else if (sectionBottom < 0) {
        scrollState.progress = 1;
        setActiveIndex(totalMilestones - 1);
        setTransitionProgress(1);
      } else {
        const totalScrollDistance = sectionHeight - viewportHeight;
        const scrolled = -sectionTop;
        const progress = Math.max(0, Math.min(1, scrolled / totalScrollDistance));
        scrollState.progress = progress;

        // Calculate which milestone is active
        const exactIndex = progress * (totalMilestones - 1);
        const currentIndex = Math.min(Math.floor(exactIndex), totalMilestones - 1);
        const progressWithinItem = exactIndex - currentIndex;
        
        setActiveIndex(currentIndex);
        setTransitionProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [totalMilestones]);

  // Calculate line heights and circle position based on progress
  // Circle vertical position: 
  // First item: aligned with content (around 35% from top)
  // Middle items: center (50%)
  // Last item: aligned with content (around 65% from top)
  const firstItemThreshold = 1 / (totalMilestones - 1);
  const lastItemThreshold = (totalMilestones - 2) / (totalMilestones - 1);
  
  let circleTopPercent = 50; // default center
  if (transitionProgress < firstItemThreshold) {
    // Transition from first position to center
    const t = transitionProgress / firstItemThreshold;
    circleTopPercent = 35 + (15 * t); // 35% -> 50%
  } else if (transitionProgress > lastItemThreshold) {
    // Transition from center to last position
    const t = (transitionProgress - lastItemThreshold) / (1 - lastItemThreshold);
    circleTopPercent = 50 + (15 * t); // 50% -> 65%
  }
  
  // Top line height: from circle to top
  const topLineHeight = `calc(${circleTopPercent}vh - 0.5rem)`;
  
  // Bottom line height: from circle to bottom
  const bottomLineHeight = `calc(${100 - circleTopPercent}vh - 0.5rem)`;
  
  // Opacity for lines
  const topLineOpacity = transitionProgress < 0.05 ? 0 : 0.5;
  const bottomLineOpacity = transitionProgress > 0.95 ? 0 : 0.5;

  const currentMilestone = milestones[activeIndex];

  return (
    <section
      ref={sectionRef}
      id="worldline"
      className="relative"
      style={{ height: `${totalMilestones * 100}vh` }}
    >
      {/* Sticky container for the timeline view */}
      <div className="sticky top-0 h-screen overflow-hidden">
        
        {/* Vertical line with circle - positioned at 25vw from left */}
        <div 
          className="absolute flex flex-col items-center transition-all duration-500 ease-out"
          style={{ left: '25vw' }}
        >
          {/* Top line */}
          <div 
            className="w-px bg-gradient-to-t from-[var(--terminal-cyan)] to-transparent transition-all duration-500 ease-out"
            style={{ 
              height: topLineHeight,
              opacity: topLineOpacity,
            }}
          />
          
          {/* Circle */}
          <div 
            className="w-4 h-4 rounded-full border-2 border-[var(--terminal-cyan)] bg-[var(--void-black)] flex-shrink-0 z-10"
            style={{
              boxShadow: '0 0 20px var(--terminal-cyan), 0 0 40px var(--terminal-cyan)',
            }}
          />
          
          {/* Bottom line */}
          <div 
            className="w-px bg-gradient-to-b from-[var(--terminal-cyan)] to-transparent transition-all duration-500 ease-out"
            style={{ 
              height: bottomLineHeight,
              opacity: bottomLineOpacity,
            }}
          />
        </div>

        {/* Content - right side of the line, 50vw wide */}
        <div 
          className="absolute top-1/2 -translate-y-1/2"
          style={{ 
            left: 'calc(25vw + 3rem)',
            width: '50vw',
          }}
        >
          {/* Year */}
          <span 
            key={`year-${activeIndex}`}
            className="text-sm font-mono text-[var(--terminal-cyan)] tracking-widest block animate-fade-in"
          >
            {currentMilestone.year}
          </span>
          
          {/* Title */}
          <h3 
            key={`title-${activeIndex}`}
            className="font-heading text-4xl md:text-5xl lg:text-6xl text-[var(--photon-white)] mt-3 mb-6 animate-fade-in"
          >
            {currentMilestone.title}
          </h3>
          
          {/* Narrative description */}
          <p 
            key={`desc-${activeIndex}`}
            className="text-lg md:text-xl text-[var(--tungsten-gray)] leading-relaxed animate-fade-in"
          >
            {narratives[currentMilestone.id] || currentMilestone.description}
          </p>
        </div>
      </div>
    </section>
  );
}
