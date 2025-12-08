'use client'

import { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useStore } from '@/store/useStore';

// Cursive SVG paths for "Hello Universe" - handwritten style
const HELLO_PATH = "M10,60 Q15,30 30,40 T50,35 Q55,40 60,30 L65,55 M75,35 Q85,25 95,35 Q105,45 95,55 Q85,65 75,55 M115,60 L115,30 M115,45 L130,45 M150,60 L150,30 M150,45 L165,45 M185,35 Q195,25 205,35 Q215,50 195,60 Q180,55 185,35";
const UNIVERSE_PATH = "M10,120 L10,80 Q25,90 30,80 L30,120 M50,80 L50,120 M50,100 Q65,80 80,100 Q95,120 80,100 M100,120 L100,80 M115,120 L130,80 L145,120 M165,80 Q175,70 185,80 Q195,90 185,100 L165,100 Q175,110 185,120 M205,80 Q215,70 225,80 Q235,95 220,105 Q210,115 225,120 M245,80 Q255,70 265,80 Q275,95 260,105 Q250,115 265,120";

export default function IntroAnimation() {
  const [hasMounted, setHasMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const helloPathRef = useRef<SVGPathElement>(null);
  const universePathRef = useRef<SVGPathElement>(null);
  const setIntroComplete = useStore((state) => state.setIntroComplete);
  const isComplete = useStore((state) => state.isIntroComplete);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Initialize path lengths for stroke animation
  useEffect(() => {
    if (!hasMounted) return;
    
    if (helloPathRef.current) {
      const length = helloPathRef.current.getTotalLength();
      helloPathRef.current.style.strokeDasharray = `${length}`;
      helloPathRef.current.style.strokeDashoffset = `${length}`;
    }
    if (universePathRef.current) {
      const length = universePathRef.current.getTotalLength();
      universePathRef.current.style.strokeDasharray = `${length}`;
      universePathRef.current.style.strokeDashoffset = `${length}`;
    }
  }, [hasMounted]);
  
  useGSAP(() => {
    if (!hasMounted || isComplete) return;
    
    const tl = gsap.timeline({
      onComplete: () => setIntroComplete(true)
    });
    
    // Initial states
    gsap.set('.intro-star', { scale: 0, opacity: 0 });
    gsap.set('.intro-orbit', { scale: 0.5, opacity: 0 });
    gsap.set('.intro-glow', { scale: 0, opacity: 0 });

    // PHASE 1: Stars appear
    tl.to('.intro-star', {
      scale: 1,
      opacity: 1,
      duration: 0.8,
      stagger: { each: 0.03, from: 'random' },
      ease: 'back.out(2)',
    })

    // PHASE 2: Central glow expands
    .to('.intro-glow', {
      scale: 1,
      opacity: 0.8,
      duration: 1,
      ease: 'power2.out',
    }, '-=0.5')

    // PHASE 3: Orbits appear
    .to('.intro-orbit', {
      scale: 1,
      opacity: 0.3,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power2.out',
    }, '-=0.8')

    // PHASE 4: Write "Hello" with stroke animation
    .to(helloPathRef.current, {
      strokeDashoffset: 0,
      duration: 1.5,
      ease: 'power2.inOut',
    }, '-=0.3')

    // PHASE 5: Write "Universe" 
    .to(universePathRef.current, {
      strokeDashoffset: 0,
      duration: 2,
      ease: 'power2.inOut',
    }, '-=0.8')

    // PHASE 6: Fill in the text
    .to('.intro-text-fill', {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out',
    })

    // PHASE 7: Pause to admire
    .to({}, { duration: 0.6 })

    // PHASE 8: Everything implodes to center
    .to('.intro-star', {
      x: () => (Math.random() - 0.5) * -200,
      y: () => (Math.random() - 0.5) * -200,
      scale: 0,
      opacity: 0,
      duration: 0.8,
      stagger: { each: 0.02, from: 'edges' },
      ease: 'power3.in',
    })

    .to('.intro-orbit', {
      scale: 3,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.in',
    }, '-=0.6')

    .to('.intro-svg-container', {
      scale: 0.5,
      opacity: 0,
      filter: 'blur(20px)',
      duration: 0.8,
      ease: 'power3.in',
    }, '-=0.5')

    // PHASE 9: Flash and fade
    .to('.intro-flash', {
      opacity: 1,
      duration: 0.1,
    })
    .to('.intro-flash', {
      opacity: 0,
      duration: 0.4,
    })

    .to('.intro-glow', {
      scale: 5,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.in',
    }, '-=0.5')

    .to(containerRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.out',
      onComplete: () => {
        if (containerRef.current) {
          containerRef.current.style.display = 'none';
        }
      }
    });
    
  }, { scope: containerRef, dependencies: [hasMounted, isComplete] });
  
  if (!hasMounted || isComplete) {
    return null;
  }
  
  // Generate stars
  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: 1 + Math.random() * 3,
    color: ['#00FF9D', '#8F00FF', '#00D4FF', '#FBBF24', '#FFFFFF'][Math.floor(Math.random() * 5)],
  }));

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[#030308]" />
      
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

      {/* Orbital rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[200, 300, 400].map((size, i) => (
          <div
            key={i}
            className="intro-orbit absolute rounded-full border border-[var(--terminal-cyan)]"
            style={{
              width: size,
              height: size,
              animation: `spin ${20 + i * 10}s linear infinite${i % 2 ? ' reverse' : ''}`,
            }}
          />
        ))}
      </div>
      
      {/* Central glow */}
      <div 
        className="intro-glow absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0,255,157,0.3) 0%, rgba(143,0,255,0.1) 50%, transparent 70%)',
        }}
      />

      {/* Flash overlay */}
      <div className="intro-flash absolute inset-0 bg-white opacity-0 pointer-events-none" />
      
      {/* SVG Text Container */}
      <div className="intro-svg-container relative z-10">
        <svg 
          viewBox="0 0 280 150" 
          className="w-[80vw] max-w-[600px] h-auto"
          style={{ overflow: 'visible' }}
        >
          {/* Glow filter */}
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* "Hello" - stroke animation */}
          <path
            ref={helloPathRef}
            d={HELLO_PATH}
            fill="none"
            stroke="url(#strokeGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
          />
          
          {/* "Universe" - stroke animation */}
          <path
            ref={universePathRef}
            d={UNIVERSE_PATH}
            fill="none"
            stroke="url(#strokeGradient2)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
          />

          {/* Gradients */}
          <defs>
            <linearGradient id="strokeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00FF9D" />
              <stop offset="100%" stopColor="#FFFFFF" />
            </linearGradient>
            <linearGradient id="strokeGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8F00FF" />
              <stop offset="50%" stopColor="#00FF9D" />
              <stop offset="100%" stopColor="#00D4FF" />
            </linearGradient>
          </defs>

          {/* Fill text that fades in after stroke */}
          <text
            x="140"
            y="55"
            textAnchor="middle"
            className="intro-text-fill opacity-0"
            style={{
              fontFamily: 'cursive, serif',
              fontSize: '36px',
              fill: 'white',
              fontWeight: 300,
            }}
          >
            Hello
          </text>
          <text
            x="140"
            y="115"
            textAnchor="middle"
            className="intro-text-fill opacity-0"
            style={{
              fontFamily: 'cursive, serif',
              fontSize: '32px',
              fill: 'url(#strokeGradient2)',
              fontWeight: 300,
            }}
          >
            Universe
          </text>
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
