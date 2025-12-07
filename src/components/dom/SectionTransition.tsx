'use client'

import { useRef, ReactNode } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SectionTransitionProps {
  children: ReactNode;
  id: string;
  type?: 'fade' | 'slide-up' | 'slide-left' | 'zoom' | 'parallax';
  duration?: number;
}

export default function SectionTransition({
  children,
  id,
  type = 'fade',
  duration = 1,
}: SectionTransitionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    if (!sectionRef.current) return;
    
    const section = sectionRef.current;
    
    // Define animation based on type
    const animations: Record<string, gsap.TweenVars> = {
      'fade': { opacity: 0 },
      'slide-up': { opacity: 0, y: 100 },
      'slide-left': { opacity: 0, x: -100 },
      'zoom': { opacity: 0, scale: 0.8 },
      'parallax': { y: 100 },  // No opacity change
    };
    
    const animationProps = animations[type] || animations['fade'];
    
    // Enter animation
    gsap.from(section, {
      ...animationProps,
      duration,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'top 30%',
        scrub: type === 'parallax' ? 1 : false,
        toggleActions: type === 'parallax' 
          ? undefined 
          : 'play none none reverse',
      },
    });
    
    // Parallax exit
    if (type === 'parallax') {
      gsap.to(section, {
        y: -50,
        scrollTrigger: {
          trigger: section,
          start: 'bottom bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }
    
  }, { scope: sectionRef, dependencies: [type, duration] });
  
  return (
    <div ref={sectionRef} id={id} className="relative">
      {children}
    </div>
  );
}