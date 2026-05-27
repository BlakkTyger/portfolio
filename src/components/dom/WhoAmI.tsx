'use client'

import { personalInfo } from '@/data/content';
import SectionWrapper from './SectionWrapper';

// === COMPONENT ===

export default function WhoAmI() {
  return (
    <SectionWrapper id="whoami" animation="fade-up" stagger={true}>
            
      <div className="max-w-4xl mx-auto">
        
        
        {/* Section Label */}
        <span className="animate-item text-[var(--terminal-cyan)] text-sm font-mono uppercase tracking-widest mb-4 block">
          About Me
        </span>
        
        {/* Main Heading */}
        <h2 className="animate-item font-heading text-5xl md:text-6xl lg:text-7xl mb-8 text-[var(--photon-white)]">
          Who Am I?
        </h2>
        
        {/* Tagline */}
        <p className="animate-item text-xl md:text-2xl text-[var(--tungsten-gray)] mb-12">
          {personalInfo.tagline}
        </p>
        
        {/* Bio Card */}
        <div className="animate-item bg-gradient-to-b from-[var(--event-horizon)] to-transparent rounded-2xl border border-[var(--tungsten-gray)]/10 shadow-[0_0_40px_rgba(143,0,255,0.05)] backdrop-blur-sm p-8 md:p-12 mb-12">
          
          <div className="prose prose-invert prose-lg max-w-none">
            
            {personalInfo.bio.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-6 text-[var(--photon-white)] leading-relaxed">
                {paragraph.trim()}
              </p>
            ))}
            
          </div>
        </div>
        

      </div>
    </SectionWrapper>
  );
}