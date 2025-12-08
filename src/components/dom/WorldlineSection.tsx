'use client'

import { useEffect, useRef, useState, useMemo } from 'react';
import { scrollState } from '@/components/canvas/WorldlineScene';
import { milestones } from '@/data/timeline';

// Narrative descriptions for each milestone
const narratives: Record<string, string> = {
  'birth': 'Every story has a beginning. Mine started in a small town where curiosity was my constant companion.',
  'high-school': 'The universe revealed its secrets through physics. I remember staying late in the library, captivated by quantum mechanics and the nature of reality.',
  'university': 'Formal education became my gateway to deeper understanding. The equations weren\'t just symbols—they were the language of the cosmos.',
  'first-code': 'A new superpower emerged. With a few lines of Python, I could simulate the very phenomena I was studying. Code became my laboratory.',
  'research': 'Theory met practice. Working on quantum computing research, I glimpsed the future we\'re building—one qubit at a time.',
  'graduation': 'A milestone, not an ending. Armed with knowledge and driven by questions, I stepped into the next chapter.',
  'present': 'Today, I stand at the intersection of physics, code, and philosophy. The journey continues, each day a new discovery.',
};

// Icons for each milestone type
const milestoneIcons: Record<string, string> = {
  'birth': '✦',
  'high-school': '📚',
  'university': '🎓',
  'first-code': '💻',
  'research': '🔬',
  'graduation': '🎯',
  'present': '∞',
};

export default function WorldlineSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const totalMilestones = milestones.length;

  useEffect(() => {
    const handleScroll = () => {
      scrollState.pageScrollY = window.scrollY;
      
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = sectionRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;

      const sectionTop = rect.top;
      const sectionBottom = rect.bottom;

      if (sectionTop > viewportHeight) {
        scrollState.progress = 0;
        setScrollProgress(0);
      } else if (sectionBottom < 0) {
        scrollState.progress = 1;
        setScrollProgress(1);
      } else {
        const totalScrollDistance = sectionHeight - viewportHeight;
        const scrolled = -sectionTop;
        const progress = Math.max(0, Math.min(1, scrolled / totalScrollDistance));
        scrollState.progress = progress;
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate transform for each milestone card
  const getCardTransform = (index: number) => {
    // Each card gets a segment of the total scroll
    const segmentSize = 1 / totalMilestones;
    const cardStart = index * segmentSize;
    const cardEnd = (index + 1) * segmentSize;
    
    // Card progress: 0 = entering from bottom, 0.5 = centered, 1 = exiting to top
    let cardProgress: number;
    
    if (scrollProgress < cardStart) {
      cardProgress = 0; // Below viewport
    } else if (scrollProgress > cardEnd) {
      cardProgress = 1; // Above viewport
    } else {
      cardProgress = (scrollProgress - cardStart) / segmentSize;
    }
    
    // Transform calculations
    // Enter from bottom (100vh) -> center (0) -> exit to top (-100vh)
    let translateY: number;
    let opacity: number;
    let scale: number;
    
    if (cardProgress <= 0.5) {
      // Entering phase: 100% -> 0%
      const t = cardProgress * 2; // 0 to 1
      translateY = 100 * (1 - t); // 100 -> 0
      opacity = t; // 0 -> 1
      scale = 0.8 + 0.2 * t; // 0.8 -> 1
    } else {
      // Exiting phase: 0% -> -100%
      const t = (cardProgress - 0.5) * 2; // 0 to 1
      translateY = -100 * t; // 0 -> -100
      opacity = 1 - t; // 1 -> 0
      scale = 1 - 0.2 * t; // 1 -> 0.8
    }
    
    return {
      transform: `translateY(${translateY}vh) scale(${scale})`,
      opacity: Math.max(0, Math.min(1, opacity)),
      zIndex: totalMilestones - Math.abs(index - Math.floor(scrollProgress * totalMilestones)),
    };
  };

  // Active milestone index for progress indicator
  const activeIndex = Math.min(
    Math.floor(scrollProgress * totalMilestones),
    totalMilestones - 1
  );

  return (
    <section
      ref={sectionRef}
      id="worldline"
      className="relative bg-black"
      style={{ height: `${totalMilestones * 100}vh` }}
    >
      {/* Sticky container for cards - no extra header space */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Progress line on left - minimal */}
        <div className="absolute left-6 md:left-12 top-0 bottom-0 flex flex-col items-center py-16">
          <div className="relative w-px h-full bg-white/10">
            {/* Progress fill */}
            <div 
              className="absolute top-0 left-0 w-full bg-white/40 transition-all duration-300"
              style={{ height: `${scrollProgress * 100}%` }}
            />
            
            {/* Milestone dots */}
            {milestones.map((_, i) => (
              <div
                key={i}
                className={`
                  absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full transition-all duration-300
                  ${i <= activeIndex 
                    ? 'bg-white scale-125' 
                    : 'bg-white/20'
                  }
                `}
                style={{ top: `${(i / (totalMilestones - 1)) * 100}%` }}
              />
            ))}
          </div>
        </div>

        {/* Cards container */}
        <div className="absolute inset-0 flex items-center justify-center">
          {milestones.map((milestone, index) => {
            const style = getCardTransform(index);
            
            return (
              <div
                key={milestone.id}
                className="absolute w-[85vw] md:w-[70vw] lg:w-[55vw] max-w-2xl transition-transform duration-100 ease-out"
                style={{
                  transform: style.transform,
                  opacity: style.opacity,
                  zIndex: style.zIndex,
                }}
              >
                {/* Card - clean black background */}
                <div className="relative p-8 md:p-12">
                  {/* Year */}
                  <span className="text-sm font-mono text-white/40 tracking-widest mb-4 block">
                    {milestone.year}
                  </span>
                  
                  {/* Title */}
                  <h3 
                    className="text-3xl md:text-4xl lg:text-5xl text-white/90 mb-6"
                    style={{ 
                      fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                      fontWeight: 300,
                    }}
                  >
                    {milestone.title}
                  </h3>
                  
                  {/* Narrative */}
                  <p className="text-base md:text-lg text-white/50 leading-relaxed max-w-xl">
                    {narratives[milestone.id] || milestone.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Scroll hint - minimal */}
        <div 
          className="absolute bottom-6 left-1/2 -translate-x-1/2 transition-opacity duration-500"
          style={{ opacity: scrollProgress < 0.9 ? 0.3 : 0 }}
        >
          <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </div>
    </section>
  );
}
