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
        <div className="animate-item bg-[var(--event-horizon)] rounded-2xl p-8 md:p-12 mb-12">
          
          <div className="prose prose-invert prose-lg max-w-none">
            
            {personalInfo.bio.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-6 text-[var(--photon-white)] leading-relaxed">
                {paragraph.trim()}
              </p>
            ))}
            
          </div>
        </div>
        
        <div className="animate-item">
          <h3 className="text-sm font-mono uppercase tracking-widest text-[var(--tungsten-gray)] mb-4">
            Interests
          </h3>
          <div className="flex flex-wrap gap-3">
            
            {[
              'Quantum Computing',
              'Machine Learning',
              'Philosophy of Mind',
              'Web Development',
              'Theoretical Physics',
              'Consciousness Studies',
            ].map((interest) => (
              <span
                key={interest}
                className="
                  px-4 py-2 rounded-full
                  bg-[var(--void-black)]
                  border border-[var(--tungsten-gray)]/30
                  text-sm text-[var(--photon-white)]
                  hover:border-[var(--terminal-cyan)]/50
                  transition-colors duration-300
                "
                
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
        
      </div>
    </SectionWrapper>
  );
}