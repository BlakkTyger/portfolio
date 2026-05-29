'use client'

import SectionWrapper from './SectionWrapper';

export default function CV() {
  return (
    <SectionWrapper id="cv" animation="fade-up" stagger={true}>
      {/* max-w-5xl with glassmorphism, glowing ambient lighting, and interactive visual flow */}
      <div className="relative w-full max-w-5xl mx-auto py-24 px-8 md:px-12 rounded-3xl border border-[var(--tungsten-gray)]/10 bg-gradient-to-b from-[var(--event-horizon)]/30 to-transparent backdrop-blur-md overflow-hidden shadow-[0_0_50px_rgba(143,0,255,0.02)]">

        {/* Ambient top/bottom neon light guides */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90%] h-px bg-gradient-to-r from-transparent via-[var(--terminal-cyan)]/30 to-transparent"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] h-px bg-gradient-to-r from-transparent via-[var(--spectral-violet)]/30 to-transparent"></div>

        <div className="relative z-10 text-center flex flex-col items-center">

          {/* ── Interactive Floating Document Graphic ── */}
          <div className="animate-item mb-12 relative group cursor-pointer">
            {/* Pulsing colored glow aura in the background */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--spectral-violet)] to-[var(--terminal-cyan)] rounded-2xl filter blur-2xl opacity-10 group-hover:opacity-25 transition-opacity duration-500"></div>
            
            {/* The Document / CV Mockup */}
            <div className="relative w-40 h-52 bg-black/60 rounded-2xl border border-[var(--tungsten-gray)]/20 p-4 transition-all duration-500 ease-out transform group-hover:scale-110 group-hover:-rotate-3 group-hover:border-[var(--terminal-cyan)]/40 shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
              {/* Paper lines and abstract details */}
              <div className="flex items-center gap-2.5 mb-5">
                {/* Profile icon */}
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[var(--spectral-violet)]/40 to-[var(--terminal-cyan)]/40 border border-white/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="w-16 h-2.5 rounded bg-white/20 group-hover:bg-[var(--terminal-cyan)]/40 transition-colors duration-300"></div>
                  <div className="w-10 h-1.5 rounded bg-white/10 mt-1"></div>
                </div>
              </div>

              {/* Document skeleton body lines */}
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <div className="w-full h-1.5 rounded bg-white/10"></div>
                  <div className="w-[85%] h-1.5 rounded bg-white/10"></div>
                </div>
                <div className="pt-2 border-t border-white/5 space-y-1.5">
                  <div className="w-[90%] h-1.5 rounded bg-white/15 group-hover:bg-[var(--quantum-purple)]/40 transition-colors duration-300"></div>
                  <div className="w-[70%] h-1.5 rounded bg-white/10"></div>
                </div>
                <div className="pt-2 border-t border-white/5 space-y-1.5">
                  <div className="w-[95%] h-1.5 rounded bg-white/15 group-hover:bg-[var(--terminal-cyan)]/40 transition-colors duration-300"></div>
                  <div className="w-[60%] h-1.5 rounded bg-white/10"></div>
                </div>
              </div>

              {/* Subtle shining bar reflecting across paper */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-2xl"></div>
            </div>

            {/* Orbiting science dots */}
            <div className="absolute -top-3 -right-3 w-4 h-4 rounded-full bg-[var(--terminal-cyan)]/80 animate-ping opacity-60"></div>
            <div className="absolute -bottom-2 -left-2 w-3 h-3 rounded-full bg-[var(--spectral-violet)]/80 animate-pulse"></div>
          </div>

          {/* Main Heading */}
          <h2 className="animate-item font-heading font-light text-5xl md:text-6xl lg:text-7xl mb-6 text-[var(--photon-white)] tracking-wide">
            Curriculum Vitae
          </h2>

          {/* Description */}
          <p className="animate-item text-lg md:text-xl text-[var(--tungsten-gray)]/85 mb-14 max-w-xl mx-auto leading-relaxed font-body">
            A comprehensive exposition of my academic background, research publications, technical milestones, and professional journey.
          </p>

          {/* Prominent Large CV Button */}
          <div className="animate-item">
            <a
              href="/cv.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center gap-4 px-12 py-5 rounded-full bg-black/60 border border-[var(--tungsten-gray)]/30 text-white font-mono text-base tracking-widest transition-all duration-300 hover:border-white/60 hover:shadow-[0_0_30px_rgba(0,255,157,0.2)]"
            >
              {/* Animated hover gradient overlay inside button */}
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[var(--spectral-violet)]/10 to-[var(--terminal-cyan)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              
              <svg
                className="w-5 h-5 group-hover:-translate-y-1 transition-transform duration-300 text-[var(--terminal-cyan)]"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              VIEW FULL CV
            </a>
          </div>

        </div>
      </div>
    </SectionWrapper>
  );
}