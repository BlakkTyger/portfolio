'use client'

import { useRef, ReactNode } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register the ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);


// === TYPE DEFINITIONS ===
interface SectionWrapperProps {
  children: ReactNode;
  id: string;
  className?: string;
  animation?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'none';
  stagger?: boolean;
  threshold?: number;
}

// === COMPONENT ===

export default function SectionWrapper({
  children,
  id,
  className = '',
  animation = 'fade-up',
  stagger = true,
  threshold = 80,
}: SectionWrapperProps) {
  
  const sectionRef = useRef<HTMLElement>(null);
  
  // === ANIMATION SETUP ===
  useGSAP(() => {
    if (animation === 'none') return;
    const section = sectionRef.current;
    if (!section) return;
    
    // Define animation properties based on type
    const animationProps = {
      'fade-up': { opacity: 0, y: 60 },
      'fade-in': { opacity: 0 },
      'slide-left': { opacity: 0, x: -100 },
      'slide-right': { opacity: 0, x: 100 },
    }[animation];
    
    if (stagger) {
      // Animate each .animate-item child with stagger
      gsap.from(section.querySelectorAll('.animate-item'), {
        ...animationProps,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.15,  // 150ms between each element
        scrollTrigger: {
          trigger: section,
          start: `top ${threshold}%`,
          once: true,  // Only trigger once
        },
      });
    } else {
      // Animate the whole section as one unit
      gsap.from(section, {
        ...animationProps,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: `top ${threshold}%`,
          once: true,
        },
      });
    }
    
  }, { scope: sectionRef, dependencies: [animation, stagger, threshold] });
  
  // === RENDER ===
  
  return (
    <section
      ref={sectionRef}
      id={id}
      className={`
        relative
        min-h-screen
        py-20 px-6
        md:py-32 md:px-12
        lg:px-24
        ${className}
      `}
    >
      {children}
    </section>
  );
}