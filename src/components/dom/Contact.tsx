'use client'

import SectionWrapper from './SectionWrapper';
import SocialLinks from './SocialLinks';
import { personalInfo } from '@/data/content';
import { useEffect, useRef, useState } from 'react';

export default function Contact() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      // Calculate relative mouse position (0 to 1)
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMousePos({ x, y });
    };

    const card = cardRef.current;
    if (card) {
      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseenter', () => setIsHovering(true));
      card.addEventListener('mouseleave', () => {
        setIsHovering(false);
        // Reset position on leave
        setMousePos({ x: 0.5, y: 0.5 });
      });
    }

    return () => {
      if (card) {
        card.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  return (
    <SectionWrapper id="contact" animation="fade-up">
      <div className="max-w-4xl mx-auto relative perspective-1000">
        
        {/* Dynamic 3D Card Container */}
        <div 
          ref={cardRef}
          className="relative transition-transform duration-300 ease-out preserve-3d"
          style={{
            transform: isHovering 
              ? `rotateY(${(mousePos.x - 0.5) * 10}deg) rotateX(${-(mousePos.y - 0.5) * 10}deg)`
              : 'rotateY(0deg) rotateX(0deg)'
          }}
        >
          {/* Glowing Aura behind card */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[var(--terminal-cyan)] via-purple-500 to-[var(--laser-orange)] rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000 animate-pulse"></div>

          <div className="relative bg-[var(--event-horizon)]/60 backdrop-blur-xl border border-[var(--tungsten-gray)]/30 p-10 md:p-16 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            
            {/* Interactive Spotlight Effect */}
            <div 
              className="absolute pointer-events-none opacity-50 mix-blend-screen transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(0,255,157,0.15) 0%, transparent 50%)`,
                inset: 0,
                opacity: isHovering ? 1 : 0
              }}
            />

            {/* Header */}
            <span className="animate-item inline-block px-3 py-1 mb-4 rounded-full bg-[var(--terminal-cyan)]/10 text-[var(--terminal-cyan)] border border-[var(--terminal-cyan)]/30 text-sm font-mono uppercase tracking-widest">
              Get in Touch
            </span>
            
            <h2 className="animate-item font-heading text-5xl md:text-6xl text-[var(--photon-white)] mb-6 drop-shadow-md">
              Contact
            </h2>
            
            <p className="animate-item text-xl text-[var(--tungsten-gray)] mb-12 max-w-2xl leading-relaxed">
              Have a question or want to collaborate? Feel free to reach out through any of these channels.
            </p>
            
            {/* Social Links */}
            <div className="animate-item mb-12 bg-black/20 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
              <h3 className="text-sm font-mono uppercase tracking-widest text-[var(--tungsten-gray)] mb-6">
                Connect
              </h3>
              <SocialLinks />
            </div>
            
            {/* Location */}
            <div className="animate-item pt-6 border-t border-[var(--tungsten-gray)]/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                <p className="text-[var(--tungsten-gray)] font-mono text-sm">
                  Based in {personalInfo.location}
                </p>
              </div>
              <div className="text-[var(--tungsten-gray)]/50 text-xs font-mono">
                System Online
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
