'use client'

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TransitionConfig {
  enter?: gsap.TweenVars;    // Animation when entering view
  exit?: gsap.TweenVars;     // Animation when exiting view
  scrub?: boolean | number;  // Link to scroll
  pin?: boolean;             // Pin during animation
  markers?: boolean;         // Show debug markers
}

export function useScrollTransition(
  ref: React.RefObject<HTMLElement>,
  config: TransitionConfig = {}
) {
  const {
    enter = { opacity: 0, y: 50 },
    exit = {},
    scrub = false,
    pin = false,
    markers = false,
  } = config;
  
  useGSAP(() => {
    if (!ref.current) return;
    
    const element = ref.current;
    
    // Create enter animation
    gsap.from(element, {
      ...enter,
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        end: 'top 20%',
        scrub,
        pin,
        markers,
        toggleActions: 'play none none reverse',
      },
    });
    
    // Create exit animation if specified
    if (Object.keys(exit).length > 0) {
      gsap.to(element, {
        ...exit,
        scrollTrigger: {
          trigger: element,
          start: 'bottom 50%',
          end: 'bottom top',
          scrub: true,
        },
      });
    }
    
  }, { scope: ref });
}