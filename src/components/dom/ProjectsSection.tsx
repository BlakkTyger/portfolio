'use client'

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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
          <feGaussianBlur stdDeviation="1" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
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
  const sectionRef = useRef<HTMLDivElement>(null);
  const [streamsActive, setStreamsActive] = useState(false);

  useGSAP(() => {
    if (!sectionRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 60%",
      }
    });

    // Reset initial states
    gsap.set('.proj-laser-source', { boxShadow: 'none' });
    gsap.set('.proj-laser-led', { backgroundColor: '#3f3f46', boxShadow: 'none' }); // zinc-700
    gsap.set('.proj-laser-aperture', { opacity: 0 });
    gsap.set('.proj-input-beam', { scaleX: 0 });
    gsap.set('.proj-splitter-ring', { opacity: 0 });
    gsap.set('.proj-splitter-cube', { scale: 1, borderColor: 'rgba(255,255,255,0)' });
    gsap.set('.proj-splitter-surface', { opacity: 0.2 });
    gsap.set('.proj-transmitted-beam', { scaleX: 0 });
    gsap.set('.proj-reflected-beam', { scaleY: 0, opacity: 0 });
    gsap.set('.proj-cs-card', { backgroundColor: 'rgba(10,10,15,0.5)', borderColor: '#27272a', boxShadow: 'none' });
    gsap.set('.proj-cs-icon', { backgroundColor: '#27272a', borderColor: '#3f3f46', boxShadow: 'none' });
    gsap.set('.proj-cs-title', { color: '#888888' });
    gsap.set('.proj-cs-text', { opacity: 0 });
    gsap.set('.proj-physics-card', { backgroundColor: 'rgba(10,10,15,0.5)', borderColor: '#27272a', boxShadow: 'none' });
    gsap.set('.proj-physics-icon', { backgroundColor: '#27272a', borderColor: '#3f3f46', boxShadow: 'none' });
    gsap.set('.proj-physics-title', { color: '#888888' });
    gsap.set('.proj-physics-text', { opacity: 0 });

    tl.to('.proj-laser-source', { boxShadow: '0 0 40px rgba(0,255,157,0.6)', duration: 0.5 })
      .to('.proj-laser-led', { backgroundColor: '#4ade80', boxShadow: '0 0 12px #00FF9D', duration: 0.3 }, "<")
      .to('.proj-laser-aperture', { opacity: 1, duration: 0.3 }, "<")
      .to('.proj-input-beam', { scaleX: 1, duration: 0.8, ease: "power2.out" })
      .to('.proj-splitter-ring', { opacity: 1, duration: 0.5 })
      .to('.proj-splitter-cube', { scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.4)', duration: 0.5 }, "<")
      .to('.proj-splitter-surface', { opacity: 1, duration: 0.5 }, "<")
      .add(() => setStreamsActive(true))
      .to('.proj-transmitted-beam', { scaleX: 1, duration: 0.8, ease: "power2.out" }, "+=0.2")
      .to('.proj-reflected-beam', { scaleY: 1, opacity: 1, duration: 0.8, ease: "power2.out" }, "<")
      .to('.proj-cs-card', { backgroundColor: 'rgba(10,10,15,0.9)', borderColor: CYAN, boxShadow: '0 0 60px rgba(0,255,157,0.5)', duration: 0.5 })
      .to('.proj-cs-icon', { backgroundColor: CYAN, borderColor: CYAN, boxShadow: `0 0 40px ${CYAN}`, duration: 0.5 }, "<")
      .to('.proj-cs-title', { color: CYAN, duration: 0.5 }, "<")
      .to('.proj-cs-text', { opacity: 1, duration: 0.5 }, "<")
      .to('.proj-physics-card', { backgroundColor: 'rgba(10,10,15,0.9)', borderColor: '#a855f7', boxShadow: '0 0 50px rgba(168,85,247,0.4)', duration: 0.5 }, "<")
      .to('.proj-physics-icon', { backgroundColor: '#a855f7', borderColor: '#a855f7', boxShadow: '0 0 40px #a855f7', duration: 0.5 }, "<")
      .to('.proj-physics-title', { color: '#c084fc', duration: 0.5 }, "<")
      .to('.proj-physics-text', { opacity: 1, duration: 0.5 }, "<");

  }, { scope: sectionRef });

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
      <div className="hidden md:block relative w-full h-full">

        {/* === LASER SOURCE (Left Edge) === */}
        <div className="absolute left-[calc(15vw-6rem)] top-[70%] -translate-y-1/2 z-20">
          <div className="proj-laser-source relative w-16 md:w-24 h-10 md:h-14 bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-r-lg border-2 border-zinc-700">
            {/* LED indicators */}
            <div className="absolute top-1.5 left-2 w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-900" />
            <div className="proj-laser-led absolute top-1.5 left-5 md:left-7 w-1.5 h-1.5 md:w-2 md:h-2 rounded-full" />
            {/* Aperture */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-5 md:h-7 bg-zinc-950 rounded-r">
              <div className="proj-laser-aperture w-full h-full rounded-r bg-gradient-to-r from-cyan-400/60 to-cyan-300" />
            </div>
          </div>
        </div>

        {/* === INPUT BEAM (Laser to Center) === */}
        <div
          className="proj-input-beam absolute top-[70%] h-1.5 sm:h-2 md:h-3 -translate-y-1/2 origin-left"
          style={{
            left: '15vw',
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
            className="proj-splitter-ring absolute -inset-8 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(0,255,157,0.2) 0%, rgba(143,0,255,0.1) 50%, transparent 70%)',
              animation: 'pulse 2s ease-in-out infinite',
            }}
          />

          <div
            className="proj-splitter-cube relative w-20 h-20 md:w-28 md:h-28"
            style={{ transform: 'rotate(45deg)' }}
          >
            {/* Glass cube with rainbow edges */}
            <div
              className="absolute inset-0 rounded-xl bg-gradient-to-br from-zinc-800/60 to-zinc-900/60"
              style={{ backdropFilter: 'blur(12px)', border: 'inherit' }}
            />

            {/* Diagonal splitter surface */}
            <div
              className="proj-splitter-surface absolute inset-0"
              style={{ background: 'linear-gradient(135deg, transparent 35%, rgba(255,255,255,0.9) 50%, transparent 65%)' }}
            />
          </div>

          {/* Label */}
          <span
            className="proj-splitter-surface absolute -bottom-10 left-1/2 -translate-x-1/2 text-xs font-mono tracking-wider text-white/60 whitespace-nowrap"
            style={{ transform: 'translateX(-50%) rotate(-45deg)' }}
          >
          </span>
        </div>

        {/* === TRANSMITTED BEAM (to CS Projects - Right) with PROMINENT Binary Stream === */}
        <div
          className="proj-transmitted-beam absolute top-[70%] h-3 md:h-4 -translate-y-1/2 origin-left"
          style={{
            left: 'calc(50% + 2.5rem)',
            right: '15vw',
            background: `linear-gradient(90deg, white, ${CYAN}30)`,
            boxShadow: `0 0 15px ${CYAN}, 0 0 30px ${CYAN}80`,
            borderRadius: '4px',
          }}
        >
          <BinaryStream active={streamsActive} />
        </div>

        {/* === REFLECTED BEAM (to Physics - Up) with Wave Pattern === */}
        <div
          className="proj-reflected-beam absolute left-1/2 -translate-x-1/2 w-4 md:w-5 origin-bottom"
          style={{
            top: '6rem',
            bottom: '30%',
            marginBottom: '0.5rem',
          }}
        >
          <WaveBeam active={streamsActive} />
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
          className="proj-cs-card absolute right-[calc(15vw-10rem)] top-[70%] -translate-y-1/2 z-20 flex flex-col items-center gap-2 p-2 sm:p-3 md:p-5 rounded-2xl cursor-pointer w-28 md:w-40 border-2 transition-transform hover:scale-105"
        >
          <div className="proj-cs-icon w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center border">
            <span className="font-mono text-lg md:text-xl text-[var(--photon-white)]">{'{ }'}</span>
          </div>

          <div className="text-center">
            <h3 className="proj-cs-title font-heading text-lg md:text-xl">
              CS Projects
            </h3>
            <span className="proj-cs-text text-xs font-mono text-[var(--terminal-cyan)]">
              01010101
            </span>
          </div>

          <span className="proj-cs-text text-[10px] md:text-xs text-[var(--tungsten-gray)] animate-pulse">
            Click to explore →
          </span>
        </Link>

        {/* === PHYSICS RESEARCH TARGET (Top) === */}
        <Link
          href="/research"
          className="proj-physics-card absolute top-20 md:top-24 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 md:gap-3 p-2 sm:p-4 md:p-6 rounded-2xl cursor-pointer w-36 md:w-48 border-2 transition-transform hover:scale-105"
        >
          <div className="proj-physics-icon w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center border">
            <span className="font-mono text-lg md:text-xl text-white">ψ</span>
          </div>

          <div className="text-center">
            <h3 className="proj-physics-title font-heading text-lg md:text-xl">
              Physics Research
            </h3>
            <span className="proj-physics-text text-xs font-mono text-purple-400">
              ∇²ψ + k²ψ = 0
            </span>
          </div>

          <span className="proj-physics-text text-[10px] md:text-xs text-[var(--tungsten-gray)] animate-pulse">
            Click to explore ↑
          </span>
        </Link>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-[var(--terminal-cyan)]/20"
              style={{
                left: `${10 + (Math.sin(i * 12.3) * 0.5 + 0.5) * 80}%`,
                top: `${10 + (Math.cos(i * 45.6) * 0.5 + 0.5) * 80}%`,
                animation: `float ${4 + (Math.sin(i * 78.9) * 0.5 + 0.5) * 3}s ease-in-out infinite`,
                animationDelay: `${(Math.cos(i * 12.3) * 0.5 + 0.5) * 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Mobile View */}
      <div className="absolute inset-0 pt-24 pb-8 px-6 flex flex-col justify-center gap-6 md:hidden z-20 overflow-y-auto">
        <Link
          href="/cs-projects"
          className="group relative flex flex-col p-6 rounded-2xl bg-gradient-to-br from-[var(--event-horizon)] to-[var(--void-black)] border border-zinc-800 hover:border-[var(--terminal-cyan)] transition-all shadow-lg"
        >
          <div className="w-12 h-12 rounded-full bg-[var(--terminal-cyan)]/10 border border-[var(--terminal-cyan)] flex items-center justify-center mb-4">
            <span className="font-mono text-xl text-[var(--terminal-cyan)]">{'{ }'}</span>
          </div>
          <h3 className="font-heading text-2xl text-white mb-2 group-hover:text-[var(--terminal-cyan)] transition-colors">CS Projects</h3>
          <p className="text-[var(--tungsten-gray)] text-sm mb-4">Software development, machine learning, and web applications</p>
          <div className="font-mono text-xs text-[var(--terminal-cyan)] opacity-60">01010101 →</div>
        </Link>

        <Link
          href="/research"
          className="group relative flex flex-col p-6 rounded-2xl bg-gradient-to-br from-[var(--event-horizon)] to-[var(--void-black)] border border-zinc-800 hover:border-[#8F00FF] transition-all shadow-lg"
        >
          <div className="w-12 h-12 rounded-full bg-[#8F00FF]/10 border border-[#8F00FF] flex items-center justify-center mb-4">
            <span className="font-mono text-xl text-[#8F00FF]">ψ</span>
          </div>
          <h3 className="font-heading text-2xl text-white mb-2 group-hover:text-[#8F00FF] transition-colors">Physics Research</h3>
          <p className="text-[var(--tungsten-gray)] text-sm mb-4">Quantum computing, optics, and computational physics</p>
          <div className="font-mono text-xs text-[#8F00FF] opacity-60">∇²ψ + k²ψ = 0 →</div>
        </Link>
      </div>
    </section>
  );
}
