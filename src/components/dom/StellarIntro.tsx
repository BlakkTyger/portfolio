'use client'

import { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload, PerformanceMonitor } from '@react-three/drei';
import { useStore } from '@/store/useStore';
import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues
const StellarIntroScene = dynamic(
  () => import('@/components/canvas/StellarIntroScene'),
  { ssr: false }
);

const LOCALSTORAGE_KEY = 'stellar-intro-seen';

// Phase labels for the cinematic experience
const PHASE_LABELS = [
  '',                        // 0: Living star (no text)
  '',                        // 1: Fuel depletion (no text)
  'Gravitational Collapse',  // 2: Collapse
  'Supernova',               // 3: Explosion
  '',                        // 4: Black hole (immersion)
];

export default function StellarIntro() {
  const [hasMounted, setHasMounted] = useState(false);
  const [flashVisible, setFlashVisible] = useState(false);
  const [fadeToBlack, setFadeToBlack] = useState(false);
  const [fadeOutIntro, setFadeOutIntro] = useState(false); // Buttery-smooth transition to landing page
  const [dismissed, setDismissed] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [phaseLabel, setPhaseLabel] = useState('');
  const [labelVisible, setLabelVisible] = useState(false);
  const [dpr, setDpr] = useState<[number, number]>([1, 1.5]);
  const containerRef = useRef<HTMLDivElement>(null);
  const labelTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const setIntroComplete = useStore((state) => state.setIntroComplete);
  const isComplete = useStore((state) => state.isIntroComplete);

  // ── DEVELOPER REFERENCE: INTRO REPEAT VISITS BYPASS ──
  // By default, the intro animation is shown only ONCE per user. A key is saved in localStorage.
  // -> To force the intro on EVERY refresh: Comment out lines 47-49.
  // -> To restore showing it only once: Uncomment lines 47-49.
  useEffect(() => {
    setHasMounted(true);
    try {
      if (localStorage.getItem(LOCALSTORAGE_KEY) === 'true') {
        setIntroComplete(true);
      }
    } catch {}
  }, [setIntroComplete]);

  // Supernova flash handler — warm white with longer duration
  const handleFlash = useCallback(() => {
    setFlashVisible(true);
    setTimeout(() => setFlashVisible(false), 500);
  }, []);

  // Phase change handler — show labels for collapse/supernova
  const handlePhaseChange = useCallback((phase: number) => {
    setCurrentPhase(phase);
    const label = PHASE_LABELS[phase] || '';

    if (label) {
      if (labelTimeoutRef.current) clearTimeout(labelTimeoutRef.current);

      setPhaseLabel(label);
      setTimeout(() => setLabelVisible(true), 100);
      labelTimeoutRef.current = setTimeout(() => {
        setLabelVisible(false);
      }, 2000);
    } else {
      setLabelVisible(false);
    }
  }, []);

  // Animation complete handler — radial wipe transition
  const handleComplete = useCallback(() => {
    // 1. Camera is deep inside the black hole (singularity is pure black).
    // Start CSS fade-out of the entire intro page to let landing page appear.
    setFadeOutIntro(true);
    
    // 2. Mark complete in global state (renders landing page components underneath)
    setIntroComplete(true);

    // ── DEVELOPER REFERENCE: SAVE SEEN STATE IN LOCALSTORAGE ──
    // -> Comment out the line below to stop saving 'seen' state (intro will play on every reload).
    try { localStorage.setItem(LOCALSTORAGE_KEY, 'true'); } catch {}

    // 3. Completely unmount intro component once the 1.2s CSS transition completes
    setTimeout(() => {
      setDismissed(true);
    }, 1200);
  }, [setIntroComplete]);

  // Skip handler
  const handleSkip = useCallback(() => {
    setFadeOutIntro(true);
    setIntroComplete(true);
    try { localStorage.setItem(LOCALSTORAGE_KEY, 'true'); } catch {}
    
    setTimeout(() => {
      setDismissed(true);
    }, 1000);
  }, [setIntroComplete]);

  // Performance handler — degrade gracefully
  const handlePerformanceDecline = useCallback(() => {
    setDpr([0.75, 1]);
  }, []);

  // Don't render anything if complete or not mounted
  if (!hasMounted || isComplete || dismissed) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] overflow-hidden bg-black transition-opacity duration-1000 ease-out"
      style={{
        opacity: fadeOutIntro ? 0 : 1,
        pointerEvents: fadeOutIntro ? 'none' : 'auto',
      }}
    >
      {/* Three.js Canvas */}
      <Canvas
        camera={{
          position: [0, 0, 5],
          fov: 50,
          near: 0.01,
          far: 100,
        }}
        dpr={dpr}
        gl={{
          antialias: false,
          powerPreference: 'high-performance',
          alpha: false,
        }}
        style={{ background: '#000000' }}
      >
        <PerformanceMonitor
          onDecline={handlePerformanceDecline}
          flipflops={2}
          factor={0.5}
        />
        <StellarIntroScene
          onFlash={handleFlash}
          onComplete={handleComplete}
          onPhaseChange={handlePhaseChange}
        />
        <Preload all />
      </Canvas>

      {/* Supernova flash overlay — warm white tint */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundColor: '#FFF8E7',
          opacity: flashVisible ? 1 : 0,
          transition: flashVisible
            ? 'opacity 80ms ease-in'
            : 'opacity 420ms ease-out',
        }}
      />

      {/* Fade-to-black / radial wipe overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: fadeToBlack
            ? 'radial-gradient(circle at center, #000000 0%, #000000 100%)'
            : 'radial-gradient(circle at center, transparent 0%, transparent 60%, #000000 100%)',
          opacity: fadeToBlack ? 1 : 0,
          transition: 'opacity 700ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />

      {/* Phase label overlay — lower-third cinematic text */}
      {phaseLabel && (
        <div
          className="absolute left-0 right-0 bottom-24 flex justify-center z-10 pointer-events-none"
          style={{
            opacity: labelVisible ? 1 : 0,
            transform: labelVisible ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 600ms ease-out, transform 600ms ease-out',
          }}
        >
          <span
            className="text-xs font-mono uppercase tracking-[0.35em] px-6 py-2"
            style={{
              color: 'rgba(255, 255, 255, 0.45)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {phaseLabel}
          </span>
        </div>
      )}

      {/* Skip button - Made larger and more visible */}
      <button
        onClick={handleSkip}
        className="absolute bottom-8 right-8 z-20 px-6 py-3 text-sm font-mono uppercase tracking-widest text-white/70 border border-white/20 bg-white/5 rounded-full backdrop-blur-md transition-all duration-300 hover:text-white hover:border-white/50 hover:bg-white/10 cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.1)]"
      >
        Skip ›
      </button>

      {/* Phase indicator dots — active dot highlights */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2.5 z-10">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-500"
            style={{
              width:  currentPhase === i ? '6px' : '3px',
              height: currentPhase === i ? '6px' : '3px',
              backgroundColor: currentPhase === i
                ? 'rgba(255, 255, 255, 0.6)'
                : currentPhase > i
                  ? 'rgba(255, 255, 255, 0.25)'
                  : 'rgba(255, 255, 255, 0.1)',
              boxShadow: currentPhase === i
                ? '0 0 8px rgba(255, 255, 255, 0.3)'
                : 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
}
