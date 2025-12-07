'use client'

import { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useStore } from '@/store/useStore';

export default function IntroAnimation() {
  const [hasMounted, setHasMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const setIntroComplete = useStore((state) => state.setIntroComplete);
  const isComplete = useStore((state) => state.isIntroComplete);

  // After hydration completes, mark as mounted
  useEffect(() => {
    setHasMounted(true);
  }, []);
  
  useGSAP(() => {
    if (!hasMounted || isComplete) return;
    
    const tl = gsap.timeline({
      onComplete: () => setIntroComplete(true)
    });
    
    tl.from('.intro-hello', {
      opacity: 0,        // Start invisible
      y: 40,             // Start 40px below final position
      duration: 0.8,     // Animate over 0.8 seconds
      ease: 'power3.out' // Fast start, smooth end
    })
    
    // ANIMATION 2: Fade in "Universe" (overlaps with previous)
    .from('.intro-universe', {
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.4')
    
    
    // ANIMATION 3: Pause for reading
    .to({}, { duration: 1 })
    
    // ANIMATION 4: Pendulum swing away
    .to('.intro-text', {
      x: '-100vw',       // Move 100% of viewport width to the left
      rotation: -15,     // Rotate 15 degrees counter-clockwise
      opacity: 0,        // Fade out
      duration: 1.2,     // Over 1.2 seconds
      ease: 'power2.inOut'  // Slow start, fast middle, slow end
    })
    
    
    // ANIMATION 5: Fade out background container
    .to(containerRef.current, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        // After fading out, remove from layout entirely
        if (containerRef.current) {
          containerRef.current.style.display = 'none';
        }
      }
    }, '-=0.3')
    
    
  }, { scope: containerRef, dependencies: [hasMounted, isComplete] });
  
  
  if (!hasMounted || isComplete) {
    return null;
  }

  
  
    return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--void-black)]"
    >
      <div className="intro-text" style={{ transformOrigin: 'top right' }}>
        <h1 className="intro-hello font-heading text-[12vw] leading-none text-[var(--photon-white)]">
          Hello
        </h1>
        <h1 className="intro-universe font-heading text-[12vw] leading-none text-[var(--photon-white)]">
          Universe
        </h1>
      </div>
    </div>
  );
}
