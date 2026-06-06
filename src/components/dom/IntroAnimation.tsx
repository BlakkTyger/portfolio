'use client'

import { useRef, useState, useEffect, useMemo } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useStore } from '@/store/useStore';

export default function IntroAnimation() {
  const [hasMounted, setHasMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<SVGTextElement>(null);
  const setIntroComplete = useStore((state) => state.setIntroComplete);
  const isComplete = useStore((state) => state.isIntroComplete);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useGSAP(() => {
    if (!hasMounted || isComplete) return;

    const tl = gsap.timeline({
      onComplete: () => setIntroComplete(true)
    });

    // Initial states
    gsap.set('.intro-star', { scale: 0, opacity: 0 });
    gsap.set('.intro-glow', { scale: 0, opacity: 0 });

    if (textRef.current) {
      gsap.set(textRef.current, {
        strokeDasharray: 800,
        strokeDashoffset: 800,
        fillOpacity: 0,
        scale: 0.95,
        transformOrigin: '50% 50%'
      });
    }

    // SPEED UP EVERYTHING BY 2X or more
    // PHASE 1: Stars appear quickly
    tl.to('.intro-star', {
      scale: 1,
      opacity: 0.6,
      duration: 0.6,
      stagger: { each: 0.01, from: 'random' },
      ease: 'power2.out',
    })

      // PHASE 2: Central glow expands quickly
      .to('.intro-glow', {
        scale: 1,
        opacity: 0.8,
        duration: 0.5,
        ease: 'power2.out',
      }, '-=0.4')

      // PHASE 3: Stroke animation of the text - Much faster drawing
      .to(textRef.current, {
        strokeDashoffset: 0,
        scale: 1.05,
        duration: 0.8,
        ease: 'power2.out',
      }, '-=0.3')

      // PHASE 4: Fill in the text very fast
      .to(textRef.current, {
        fillOpacity: 1,
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      }, '-=0.2')

      // Sparkle particles behind text
      .to('.intro-text-particles', {
        opacity: 0.8,
        duration: 0.2,
        ease: 'power2.out',
      }, '-=0.2')
      .to('.intro-text-particles circle', {
        x: "random(-20, 20)",
        y: "random(-20, 20)",
        duration: 0.6,
        ease: 'power1.out',
      }, '-=0.3')

      // PHASE 5: Pause to admire - very briefly
      .to({}, { duration: 0.3 })

      // PHASE 6: Everything implodes to center extremely fast
      .to('.intro-star', {
        x: () => (Math.random() - 0.5) * -200,
        y: () => (Math.random() - 0.5) * -200,
        scale: 0,
        opacity: 0,
        duration: 0.4,
        stagger: { each: 0.005, from: 'center' },
        ease: 'power2.inOut',
      })

      .to('.intro-svg-container', {
        scale: 0.5,
        opacity: 0,
        filter: 'blur(10px)',
        duration: 0.4,
        ease: 'power3.in',
      }, '-=0.3')

      // PHASE 7: Flash and fade out entirely
      .to('.intro-flash', {
        opacity: 1,
        duration: 0.1,
      }, '-=0.1')
      .to('.intro-flash', {
        opacity: 0,
        duration: 0.2,
      })

      .to('.intro-glow', {
        scale: 2,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
      }, '-=0.3')

      .to(containerRef.current, {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.out',
        onComplete: () => {
          if (containerRef.current) {
            containerRef.current.style.display = 'none';
          }
        }
      });

  }, { scope: containerRef, dependencies: [hasMounted, isComplete] });

  // Generate stars
  const stars = useMemo(() => Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: 1 + Math.random() * 2,
    color: ['#00FF9D', '#8F00FF', '#FFFFFF'][Math.floor(Math.random() * 3)],
  })), []);

  if (!hasMounted || isComplete) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-black" />

      {/* Stars */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.map((star) => (
          <div
            key={star.id}
            className="intro-star absolute rounded-full"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              backgroundColor: star.color,
              boxShadow: `0 0 ${star.size * 3}px ${star.color}`,
            }}
          />
        ))}
      </div>

      {/* Central glow */}
      <div
        className="intro-glow absolute w-[800px] h-[800px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(143,0,255,0.4) 0%, rgba(0,255,157,0.2) 40%, transparent 70%)',
        }}
      />

      {/* Flash overlay */}
      <div className="intro-flash absolute inset-0 bg-white opacity-0 pointer-events-none" />

      {/* SVG Text Container */}
      <div className="intro-svg-container relative z-10 w-full flex justify-center">
        <svg
          viewBox="0 0 400 150"
          className="w-[90vw] max-w-[800px] h-auto"
          style={{ overflow: 'visible' }}
        >
          {/* Glow filter */}
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00FF9D" />
              <stop offset="50%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#8F00FF" />
            </linearGradient>
          </defs>

          <text
            ref={textRef}
            x="200"
            y="90"
            textAnchor="middle"
            filter="url(#glow)"
            stroke="url(#textGradient)"
            strokeWidth="2"
            fill="url(#textGradient)"
            style={{
              fontFamily: 'var(--font-cursive), cursive',
              fontSize: "clamp(32px, 20vw, 98px)",
              fontWeight: 400,
            }}
          >
            Hello Universe
          </text>
          {/* Subtle trailing particles behind text */}
          <g className="intro-text-particles opacity-0">
            {Array.from({ length: 15 }).map((_, i) => (
              <circle
                key={i}
                cx={200 + (Math.sin(i * 45) * 80)}
                cy={90 + (Math.cos(i * 45) * 20)}
                r={Math.abs(Math.sin(i)) * 2 + 1}
                fill={['#00FF9D', '#8F00FF', '#FFFFFF'][i % 3]}
                filter="url(#glow)"
              />
            ))}
          </g>
        </svg>
      </div>

      {/* Keyframes */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
