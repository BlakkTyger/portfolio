'use client'

import { useState, useEffect } from 'react';

const SECTIONS = ['hero', 'whoami', 'cv', 'worldline', 'manifold'];

export function useActiveSection() {
  const [activeSection, setActiveSection] = useState<string>('hero');
  
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    
    SECTIONS.forEach(sectionId => {
      const element = document.getElementById(sectionId);
      if (!element) return;
      
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(sectionId);
          }
        },
        {
          threshold: 0.3,  // 30% visible
          rootMargin: '-10% 0px -10% 0px',
        }
      );
      
      observer.observe(element);
      observers.push(observer);
    });
    
    return () => {
      observers.forEach(obs => obs.disconnect());
    };
  }, []);
  
  return activeSection;
}