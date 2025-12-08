'use client'

import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';

const ROLES = ['Physicist', 'Developer', 'Philosopher'];
const CYCLE_DURATION = 2500;

export default function HeroText() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayText, setDisplayText] = useState(ROLES[0]);
  const [mounted, setMounted] = useState(false);
  const isIntroComplete = useStore((state) => state.isIntroComplete);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isIntroComplete) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % ROLES.length);
        setDisplayText(ROLES[(currentIndex + 1) % ROLES.length]);
        setIsAnimating(false);
      }, 400);
    }, CYCLE_DURATION);

    return () => clearInterval(interval);
  }, [isIntroComplete, currentIndex]);

  const getRoleStyles = () => {
    switch (displayText) {
      case 'Physicist':
        return {
          color: 'text-purple-400',
          glow: 'drop-shadow-[0_0_30px_rgba(168,85,247,0.6)]',
          icon: 'ψ',
          bg: 'from-purple-500/10 to-transparent',
        };
      case 'Developer':
        return {
          color: 'text-[var(--terminal-cyan)]',
          glow: 'drop-shadow-[0_0_30px_rgba(0,255,157,0.6)]',
          icon: '</>',
          bg: 'from-cyan-500/10 to-transparent',
        };
      case 'Philosopher':
        return {
          color: 'text-amber-400',
          glow: 'drop-shadow-[0_0_30px_rgba(251,191,36,0.6)]',
          icon: '∞',
          bg: 'from-amber-500/10 to-transparent',
        };
      default:
        return { color: '', glow: '', icon: '', bg: '' };
    }
  };

  const styles = getRoleStyles();

  return (
    <div className="text-center px-4 relative">
      {/* Ambient background glow */}
      <div 
        className={`absolute inset-0 bg-gradient-radial ${styles.bg} opacity-50 blur-3xl transition-all duration-700`}
        style={{ transform: 'scale(2)' }}
      />
      
      {/* Small greeting */}
      <p className="text-[var(--tungsten-gray)] text-sm md:text-base font-mono tracking-widest uppercase mb-4 opacity-60">
        Welcome to my universe
      </p>
      
      {/* Name - smaller, more subtle */}
      <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-[var(--photon-white)]/90 mb-8 md:mb-12 tracking-tight font-light">
        Himanshu Sharma
      </h1>
      
      {/* Main rotating title - LARGER and more prominent */}
      <div className="relative">
        {/* Static "Student" */}
        <div className="flex items-center justify-center gap-3 md:gap-5 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
          <span className="text-[var(--photon-white)] font-heading tracking-tight">Student</span>
          
          {/* Plus sign with subtle animation */}
          <span className="text-[var(--tungsten-gray)] font-light animate-pulse">+</span>
          
          {/* Rotating role with animation */}
          <div className="relative h-[1.15em] overflow-hidden">
            <span 
              className={`
                inline-block font-heading font-bold tracking-tight
                transition-all duration-500 ease-out
                ${styles.color} ${styles.glow}
                ${isAnimating 
                  ? 'opacity-0 -translate-y-full scale-95' 
                  : 'opacity-100 translate-y-0 scale-100'
                }
              `}
            >
              {displayText}
            </span>
          </div>
        </div>
        
        {/* Role icon indicator */}
        <div className="mt-6 flex items-center justify-center">
          <span 
            className={`
              font-mono text-2xl md:text-3xl transition-all duration-500
              ${styles.color} ${styles.glow}
              ${isAnimating ? 'opacity-0 scale-75' : 'opacity-80 scale-100'}
            `}
          >
            {styles.icon}
          </span>
        </div>
      </div>

      {/* Role indicator dots */}
      <div className="mt-8 flex items-center justify-center gap-3">
        {ROLES.map((role, i) => (
          <button
            key={role}
            onClick={() => {
              setIsAnimating(true);
              setTimeout(() => {
                setCurrentIndex(i);
                setDisplayText(ROLES[i]);
                setIsAnimating(false);
              }, 300);
            }}
            className={`
              w-2 h-2 rounded-full transition-all duration-300
              ${currentIndex === i 
                ? `scale-150 ${
                    role === 'Physicist' ? 'bg-purple-400' :
                    role === 'Developer' ? 'bg-[var(--terminal-cyan)]' :
                    'bg-amber-400'
                  }` 
                : 'bg-[var(--tungsten-gray)]/40 hover:bg-[var(--tungsten-gray)]/60'
              }
            `}
            aria-label={`Show ${role}`}
          />
        ))}
      </div>

      {/* Decorative elements */}
      <div className="mt-10 md:mt-14 flex items-center justify-center gap-4">
        <div className="w-16 md:w-24 h-px bg-gradient-to-r from-transparent via-[var(--tungsten-gray)]/30 to-transparent" />
        <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${
          displayText === 'Physicist' ? 'bg-purple-400' :
          displayText === 'Developer' ? 'bg-[var(--terminal-cyan)]' :
          'bg-amber-400'
        }`} />
        <div className="w-16 md:w-24 h-px bg-gradient-to-r from-transparent via-[var(--tungsten-gray)]/30 to-transparent" />
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-auto">
        <div className="flex flex-col items-center gap-2 opacity-50 hover:opacity-80 transition-opacity">
          <span className="text-[10px] text-[var(--tungsten-gray)] uppercase tracking-[0.2em]">Explore</span>
          <div className="w-5 h-8 rounded-full border border-[var(--tungsten-gray)]/40 flex justify-center p-1">
            <div className={`w-1 h-2 rounded-full transition-colors duration-500 ${
              displayText === 'Physicist' ? 'bg-purple-400' :
              displayText === 'Developer' ? 'bg-[var(--terminal-cyan)]' :
              'bg-amber-400'
            } animate-bounce`} />
          </div>
        </div>
      </div>
    </div>
  );
}
