'use client'

import SectionWrapper from './SectionWrapper';
import SocialLinks from './SocialLinks';
import { personalInfo } from '@/data/content';

export default function Contact() {
  return (
    <SectionWrapper id="contact" animation="fade-up">
      <div className="max-w-4xl mx-auto">
        <div className="relative bg-[var(--event-horizon)]/20 backdrop-blur-md border border-[var(--tungsten-gray)]/10 p-10 md:p-16 rounded-2xl overflow-hidden">
          
          {/* Minimalist Ambient Light */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-px bg-gradient-to-r from-transparent via-[var(--terminal-cyan)]/20 to-transparent"></div>
          
          {/* Header */}
          <span className="animate-item inline-block text-[var(--terminal-cyan)] text-xs md:text-sm font-mono uppercase tracking-widest mb-4">
            Get in Touch
          </span>
          
          <h2 className="animate-item font-heading font-light text-4xl md:text-5xl lg:text-6xl text-[var(--photon-white)] mb-6 tracking-wide">
            Contact
          </h2>
          
          <p className="animate-item text-lg text-[var(--tungsten-gray)]/80 mb-12 max-w-xl leading-relaxed">
            Have a question or want to collaborate? Feel free to reach out through any of these channels.
          </p>
          
          {/* Social Links */}
          <div className="animate-item mb-12">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--tungsten-gray)]/60 mb-6">
              Connect
            </h3>
            <SocialLinks />
          </div>
          
          {/* Location */}
          <div className="animate-item pt-8 border-t border-[var(--tungsten-gray)]/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500/80 animate-pulse" />
              <p className="text-[var(--tungsten-gray)]/80 font-mono text-sm tracking-wide">
                Based in {personalInfo.location}
              </p>
            </div>
            <div className="text-[var(--tungsten-gray)]/40 text-xs font-mono uppercase tracking-widest">
              System Online
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
