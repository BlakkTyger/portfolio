'use client'

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const PURPLE = '#8F00FF';
const CYAN = '#00FF9D';

// Binary stream component for CS beam - VERY PROMINENT flowing data
function BinaryStream({ active }: { active: boolean }) {
  const [bits, setBits] = useState<Array<{ char: string; key: number }>>([]);
  const keyRef = useRef(0);
  
  useEffect(() => {
    if (!active) return;
    
    // Generate initial bits
    const initial = Array.from({ length: 40 }, () => ({
      char: Math.random() > 0.5 ? '1' : '0',
      key: keyRef.current++,
    }));
    setBits(initial);
    
    // Continuously add new bits
    const interval = setInterval(() => {
      setBits(prev => {
        const newBits = [...prev.slice(1), {
          char: Math.random() > 0.5 ? '1' : '0',
          key: keyRef.current++,
        }];
        return newBits;
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, [active]);
  
  if (!active) return null;
  
  return (
    <div className="absolute inset-0 flex items-center overflow-hidden" style={{ height: '40px', top: '-18px' }}>
      <div className="flex items-center gap-1 animate-pulse">
        {bits.map((bit, i) => (
          <span
            key={bit.key}
            className="text-lg md:text-2xl font-mono font-black"
            style={{
              color: bit.char === '1' ? '#00FF9D' : '#00AA7D',
              textShadow: bit.char === '1' 
                ? `0 0 15px ${CYAN}, 0 0 30px ${CYAN}, 0 0 45px ${CYAN}` 
                : `0 0 8px ${CYAN}`,
              opacity: 0.95,
              animation: `fadeIn 0.2s ease-out`,
            }}
          >
            {bit.char}
          </span>
        ))}
      </div>
    </div>
  );
}

// Wave beam component for Physics
function WaveBeam({ active }: { active: boolean }) {
  if (!active) return null;
  
  return (
    <svg 
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 10 100"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="waveGradient" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor={PURPLE} />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <path
        d="M5,100 Q0,90 5,80 Q10,70 5,60 Q0,50 5,40 Q10,30 5,20 Q0,10 5,0"
        stroke="url(#waveGradient)"
        strokeWidth="2"
        fill="none"
        filter="url(#glow)"
        className="animate-pulse"
      />
      {/* Traveling wave particles */}
      {[0, 20, 40, 60, 80].map((offset) => (
        <circle
          key={offset}
          r="1.5"
          fill={PURPLE}
          className="animate-bounce"
          style={{ animationDelay: `${offset * 10}ms` }}
        >
          <animateMotion
            dur="2s"
            repeatCount="indefinite"
            path="M5,100 Q0,90 5,80 Q10,70 5,60 Q0,50 5,40 Q10,30 5,20 Q0,10 5,0"
            begin={`${offset * 40}ms`}
          />
        </circle>
      ))}
    </svg>
  );
}

export default function ProjectsSection() {
  const [animationPhase, setAnimationPhase] = useState(0);
  const [csLit, setCsLit] = useState(false);
  const [physicsLit, setPhysicsLit] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          setAnimationPhase(1);
          setTimeout(() => setAnimationPhase(2), 600);
          setTimeout(() => setAnimationPhase(3), 1400);
          setTimeout(() => setAnimationPhase(4), 1800);
          setTimeout(() => {
            setCsLit(true);
            setPhysicsLit(true);
          }, 2600);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="projects" 
      className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-[var(--void-black)]"
    >
      {/* Background grid */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, var(--terminal-cyan) 1px, transparent 1px),
            linear-gradient(to bottom, var(--terminal-cyan) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }} />
      </div>

      {/* Header - positioned at top with ample spacing */}
      <div className="absolute top-4 md:top-6 left-0 right-0 z-10 text-center">
        <span className="text-[var(--terminal-cyan)] text-xs font-mono uppercase tracking-widest mb-1 block">
          What I&apos;ve Built
        </span>
        <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl text-[var(--photon-white)]">
          Projects
        </h2>
      </div>

      {/* Main Animation Container - Full screen */}
      <div className="relative w-full h-full">
        
        {/* === LASER SOURCE (Left Edge) === */}
        <div className="absolute left-4 md:left-8 top-[70%] -translate-y-1/2 z-20">
          <div className={`
            relative w-16 md:w-24 h-10 md:h-14 bg-gradient-to-r from-zinc-900 to-zinc-800 
            rounded-r-lg border-2 border-zinc-700
            transition-all duration-500
            ${animationPhase >= 1 ? 'shadow-[0_0_40px_rgba(0,255,157,0.6)]' : ''}
          `}>
            {/* LED indicators */}
            <div className="absolute top-1.5 left-2 w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-900" />
            <div className={`
              absolute top-1.5 left-5 md:left-7 w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-300
              ${animationPhase >= 1 ? 'bg-green-400 shadow-[0_0_12px_#00FF9D]' : 'bg-zinc-700'}
            `} />
            {/* Aperture */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-5 md:h-7 bg-zinc-950 rounded-r">
              <div className={`
                w-full h-full rounded-r
                ${animationPhase >= 1 ? 'bg-gradient-to-r from-cyan-400/60 to-cyan-300' : ''}
              `} />
            </div>
            <span className="absolute -bottom-5 left-0 text-[10px] md:text-xs font-mono text-[var(--tungsten-gray)] tracking-wider">
              
            </span>
          </div>
        </div>

        {/* === INPUT BEAM (Laser to Center) === */}
        <div 
          className={`
            absolute top-[70%] h-2 md:h-3 -translate-y-1/2
            transition-all duration-700 ease-out origin-left
            ${animationPhase >= 2 ? 'scale-x-100' : 'scale-x-0'}
          `}
          style={{ 
            left: '5rem',
            right: '50%',
            marginRight: '-1.5rem',
            background: `linear-gradient(90deg, ${CYAN}, white)`,
            boxShadow: `0 0 20px ${CYAN}, 0 0 40px ${CYAN}, 0 0 60px ${CYAN}80`,
            borderRadius: '4px',
          }}
        />

        {/* === BEAM SPLITTER (Center) - More elaborate prism design === */}
        <div 
          className="absolute left-1/2 top-[70%] -translate-x-1/2 -translate-y-1/2 z-10"
        >
          {/* Outer glow ring */}
          <div 
            className={`
              absolute -inset-8 rounded-full transition-all duration-700
              ${animationPhase >= 3 ? 'opacity-100' : 'opacity-0'}
            `}
            style={{
              background: 'radial-gradient(circle, rgba(0,255,157,0.2) 0%, rgba(143,0,255,0.1) 50%, transparent 70%)',
              animation: 'pulse 2s ease-in-out infinite',
            }}
          />
          
          <div 
            className={`
              relative w-20 h-20 md:w-28 md:h-28 transition-all duration-500
              ${animationPhase >= 3 ? 'scale-110' : ''}
            `}
            style={{ transform: 'rotate(45deg)' }}
          >
            {/* Glass cube with rainbow edges */}
            <div 
              className={`
                absolute inset-0 rounded-xl transition-all duration-500
                ${animationPhase >= 3 
                  ? 'bg-gradient-to-br from-cyan-400/50 via-white/40 to-purple-500/50 shadow-[0_0_100px_rgba(0,255,157,0.5),0_0_50px_rgba(143,0,255,0.5)]' 
                  : 'bg-gradient-to-br from-zinc-800/60 to-zinc-900/60'
                }
              `}
              style={{
                backdropFilter: 'blur(12px)',
                border: '3px solid rgba(255,255,255,0.4)',
              }}
            />
            
            {/* Inner prism refraction lines */}
            {animationPhase >= 3 && (
              <>
                <div className="absolute inset-2 border border-white/20 rounded-lg" />
                <div className="absolute inset-4 border border-cyan-400/30 rounded" />
              </>
            )}
            
            {/* Diagonal splitter surface */}
            <div 
              className={`
                absolute inset-0 transition-opacity duration-500
                ${animationPhase >= 3 ? 'opacity-100' : 'opacity-20'}
              `}
              style={{
                background: 'linear-gradient(135deg, transparent 35%, rgba(255,255,255,0.9) 50%, transparent 65%)',
              }}
            />
          </div>
          
          {/* Impact glow effects */}
          {animationPhase >= 3 && (
            <>
              <div 
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full animate-ping"
                style={{
                  background: 'radial-gradient(circle, white 0%, transparent 70%)',
                }}
              />
              <div 
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full"
                style={{
                  background: 'radial-gradient(circle, white 0%, cyan 50%, transparent 100%)',
                  animation: 'pulse 1s ease-in-out infinite',
                }}
              />
            </>
          )}
          
          {/* Label */}
          <span 
            className={`
              absolute -bottom-10 left-1/2 -translate-x-1/2 text-xs font-mono tracking-wider
              transition-opacity duration-500 whitespace-nowrap
              ${animationPhase >= 3 ? 'text-white/60' : 'text-white/20'}
            `}
            style={{ transform: 'translateX(-50%) rotate(-45deg)' }}
          >
            BEAM SPLITTER
          </span>
        </div>

        {/* === TRANSMITTED BEAM (to CS Projects - Right) with PROMINENT Binary Stream === */}
        <div 
          className={`
            absolute top-[70%] h-3 md:h-4 -translate-y-1/2
            transition-all duration-700 ease-out origin-left
            ${animationPhase >= 4 ? 'scale-x-100' : 'scale-x-0'}
          `}
          style={{ 
            left: 'calc(50% + 2rem)',
            right: '9rem',
            background: `linear-gradient(90deg, white, ${CYAN}30)`,
            boxShadow: `0 0 15px ${CYAN}, 0 0 30px ${CYAN}80`,
            borderRadius: '4px',
          }}
        >
          <BinaryStream active={animationPhase >= 4} />
        </div>

        {/* === REFLECTED BEAM (to Physics - Up) with Wave Pattern === */}
        <div 
          className={`
            absolute left-1/2 -translate-x-1/2 w-4 md:w-5
            transition-all duration-700 ease-out origin-bottom
            ${animationPhase >= 4 ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'}
          `}
          style={{ 
            top: '6rem',
            bottom: '30%',
            marginBottom: '0.5rem',
          }}
        >
          <WaveBeam active={animationPhase >= 4} />
          {/* Base glow */}
          <div 
            className="absolute inset-0 opacity-50"
            style={{
              background: `linear-gradient(to top, white, ${PURPLE})`,
              filter: 'blur(4px)',
            }}
          />
        </div>

        {/* === CS PROJECTS TARGET (Right Edge) === */}
        <Link 
          href="/cs-projects"
          className={`
            absolute right-2 md:right-6 top-[70%] -translate-y-1/2 z-20
            flex flex-col items-center gap-2 p-3 md:p-5 rounded-2xl
            transition-all duration-500 cursor-pointer w-28 md:w-40
            ${csLit 
              ? 'bg-[var(--event-horizon)]/90 border-2 border-[var(--terminal-cyan)] shadow-[0_0_60px_rgba(0,255,157,0.5)]' 
              : 'bg-[var(--event-horizon)]/50 border-2 border-zinc-800'
            }
            hover:scale-105 hover:shadow-[0_0_80px_rgba(0,255,157,0.7)]
          `}
        >
          <div className={`
            w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center
            transition-all duration-500
            ${csLit 
              ? 'bg-[var(--terminal-cyan)] shadow-[0_0_40px_var(--terminal-cyan)]' 
              : 'bg-zinc-800 border border-zinc-700'
            }
          `}>
            <span className="font-mono text-lg md:text-xl text-black">{'{ }'}</span>
          </div>
          
          <div className="text-center">
            <h3 className={`
              font-heading text-lg md:text-xl transition-colors duration-500
              ${csLit ? 'text-[var(--terminal-cyan)]' : 'text-[var(--tungsten-gray)]'}
            `}>
              CS Projects
            </h3>
            <span className={`
              text-xs font-mono transition-all duration-500
              ${csLit ? 'opacity-100 text-[var(--terminal-cyan)]' : 'opacity-0'}
            `}>
              01010101
            </span>
          </div>
          
          {csLit && (
            <span className="text-[10px] md:text-xs text-[var(--tungsten-gray)] animate-pulse">
              Click to explore →
            </span>
          )}
        </Link>

        {/* === PHYSICS RESEARCH TARGET (Top) === */}
        <Link 
          href="/research"
          className={`
            absolute top-20 md:top-24 left-1/2 -translate-x-1/2 z-20
            flex flex-col items-center gap-2 md:gap-3 p-4 md:p-6 rounded-2xl
            transition-all duration-500 cursor-pointer w-36 md:w-48
            ${physicsLit 
              ? 'bg-[var(--event-horizon)]/90 border-2 border-purple-500 shadow-[0_0_50px_rgba(139,92,246,0.4)]' 
              : 'bg-[var(--event-horizon)]/50 border-2 border-zinc-800'
            }
            hover:scale-105 hover:shadow-[0_0_70px_rgba(139,92,246,0.6)]
          `}
        >
          <div className={`
            w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center
            transition-all duration-500
            ${physicsLit 
              ? 'bg-purple-500 shadow-[0_0_40px_#8F00FF]' 
              : 'bg-zinc-800 border border-zinc-700'
            }
          `}>
            <span className="font-mono text-lg md:text-xl text-white">ψ</span>
          </div>
          
          <div className="text-center">
            <h3 className={`
              font-heading text-lg md:text-xl transition-colors duration-500
              ${physicsLit ? 'text-purple-400' : 'text-[var(--tungsten-gray)]'}
            `}>
              Physics Research
            </h3>
            <span className={`
              text-xs font-mono transition-all duration-500
              ${physicsLit ? 'opacity-100 text-purple-400' : 'opacity-0'}
            `}>
              ∇²ψ + k²ψ = 0
            </span>
          </div>
          
          {physicsLit && (
            <span className="text-[10px] md:text-xs text-[var(--tungsten-gray)] animate-pulse">
              Click to explore ↑
            </span>
          )}
        </Link>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-[var(--terminal-cyan)]/20"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
                animation: `float ${4 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Mobile buttons */}
      <div className="absolute bottom-8 left-0 right-0 flex flex-wrap justify-center gap-4 md:hidden px-4 z-20">
        <Link
          href="/cs-projects"
          className={`
            flex items-center gap-2 px-4 py-2 rounded-full transition-all text-sm
            ${csLit 
              ? 'bg-[var(--terminal-cyan)]/20 border border-[var(--terminal-cyan)]' 
              : 'bg-[var(--event-horizon)]'
            }
          `}
        >
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: CYAN }} />
          <span className="text-[var(--photon-white)]">CS Projects</span>
        </Link>
        <Link
          href="/research"
          className={`
            flex items-center gap-2 px-4 py-2 rounded-full transition-all text-sm
            ${physicsLit 
              ? 'bg-purple-500/20 border border-purple-500' 
              : 'bg-[var(--event-horizon)]'
            }
          `}
        >
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: PURPLE }} />
          <span className="text-[var(--photon-white)]">Physics Research</span>
        </Link>
      </div>
    </section>
  );
}
