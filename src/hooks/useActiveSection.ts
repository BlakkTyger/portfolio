'use client'

import { useState, useEffect, useCallback } from 'react';

const SECTIONS = ['hero', 'whoami', 'cv', 'worldline', 'manifold', 'projects', 'contact'];

// Tall sections that need special handling (scroll-based rather than intersection)
const TALL_SECTIONS = ['worldline'];

export function useActiveSection() {
  const [activeSection, setActiveSection] = useState<string>('hero');
  
  // Check if viewport center is within a section
  const checkSectionInView = useCallback(() => {
    const viewportCenter = window.scrollY + window.innerHeight / 2;
    
    for (const sectionId of SECTIONS) {
      const element = document.getElementById(sectionId);
      if (!element) continue;
      
      const rect = element.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const sectionBottom = sectionTop + element.offsetHeight;
      
      // Check if viewport center is within this section
      if (viewportCenter >= sectionTop && viewportCenter < sectionBottom) {
        setActiveSection(sectionId);
        return;
      }
    }
  }, []);
  
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    
    // Handle scroll-based detection for tall sections and as fallback
    const handleScroll = () => {
      checkSectionInView();
    };
    
    // Use intersection observer for regular sections
    SECTIONS.forEach(sectionId => {
      const element = document.getElementById(sectionId);
      if (!element) return;
      
      // Skip tall sections - they're handled by scroll listener
      if (TALL_SECTIONS.includes(sectionId)) return;
      
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            // Double-check with scroll position for accuracy
            checkSectionInView();
          }
        },
        {
          threshold: 0.3,
          rootMargin: '-10% 0px -10% 0px',
        }
      );
      
      observer.observe(element);
      observers.push(observer);
    });
    
    // Add scroll listener for tall sections and smooth updates
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    
    return () => {
      observers.forEach(obs => obs.disconnect());
      window.removeEventListener('scroll', handleScroll);
    };
  }, [checkSectionInView]);
  
  return activeSection;
}