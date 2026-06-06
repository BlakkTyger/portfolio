'use client'

import SectionWrapper from './SectionWrapper';
import SocialLinks from './SocialLinks';
import { personalInfo } from '@/data/content';

export default function Contact() {
  return (
    <SectionWrapper id="contact" animation="fade-up">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        
        {/* Interactive Command Dashboard Wrapper */}
        <div className="relative bg-gradient-to-b from-[var(--event-horizon)]/40 to-transparent backdrop-blur-md border border-[var(--tungsten-gray)]/10 p-8 md:p-16 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,255,157,0.01)]">
          
          {/* Ambient top light guide */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-[var(--terminal-cyan)]/30 to-transparent"></div>
          
          {/* Dashboard corner grid SVG - decorative background */}
          <div className="absolute top-4 right-4 opacity-10 pointer-events-none">
            <svg className="w-32 h-32 text-[var(--terminal-cyan)]" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="50" cy="50" r="8" fill="currentColor" className="animate-pulse" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.8" />
              <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeWidth="0.8" />
            </svg>
          </div>

          <div className="relative z-10">
            {/* Header */}
            <span className="animate-item inline-block text-[var(--terminal-cyan)] text-sm font-mono uppercase tracking-widest mb-4">
              Get in Touch
            </span>
            
            <h2 className="animate-item font-heading font-light text-5xl md:text-6xl text-[var(--photon-white)] mb-6 tracking-wide">
              Contact
            </h2>
            
            <p className="animate-item text-lg text-[var(--tungsten-gray)]/85 mb-12 max-w-xl leading-relaxed">
              Have an open problem to solve, a quantum simulation to debug, or want to collaborate? Connect with my nodes across the network.
            </p>

            {/* Dashboard Two-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-4">
              
              {/* Left Column: Social Nodes */}
              <div className="flex flex-col space-y-6">
                <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--tungsten-gray)]/60">
                  Connect Nodes
                </h3>
                <div className="bg-black/20 rounded-2xl border border-[var(--tungsten-gray)]/10 p-8 shadow-inner h-full flex items-center">
                  <SocialLinks />
                </div>
              </div>

              {/* Right Column: System Status Display Card — desktop only */}
              <div className="hidden lg:flex flex-col space-y-6">
                <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--tungsten-gray)]/60 opacity-0 hidden lg:block">
                  System Status
                </h3>
                <div className="bg-black/40 rounded-2xl border border-[var(--tungsten-gray)]/10 p-8 font-mono text-sm text-[var(--tungsten-gray)]/70 space-y-4 relative overflow-hidden h-full flex flex-col justify-center">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[var(--terminal-cyan)]/5 to-transparent rounded-bl-full pointer-events-none"></div>
                  <div className="text-[var(--terminal-cyan)] font-bold mb-2 text-base">SYSTEM STATE TELEMETRY:</div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    IP LINK: SECURE TUNNEL
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[var(--spectral-violet)] animate-pulse"></span>
                    QUANTUM CHANNELS: COHERENT
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[var(--terminal-cyan)] animate-pulse"></span>
                    COORDINATES: IIT KANPUR (26.5126° N, 80.2329° E)
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Status Panel */}
            <div className="animate-item mt-16 pt-8 border-t border-[var(--tungsten-gray)]/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500/80 animate-pulse" />
                <p className="text-[var(--tungsten-gray)]/85 font-mono text-sm tracking-wide">
                  Based in {personalInfo.location}
                </p>
              </div>
              <div className="text-[var(--tungsten-gray)]/50 text-xs font-mono uppercase tracking-widest">
                Nodes Synced // Quantum Ready
              </div>
            </div>

          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
