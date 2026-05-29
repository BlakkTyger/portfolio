'use client'

import { useState } from 'react';
import { personalInfo } from '@/data/content';
import SectionWrapper from './SectionWrapper';
import {
  QuantumSymbolsCloud, CoffeeCupGraphic, NeuralNetworkGraphic,
  PhilosophyBookGraphic, BlochSphereGraphic, CavityQEDGraphic,
} from './WhoAmIGraphics';

export default function WhoAmI() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const hp = (key: string) => ({
    onMouseEnter: () => setHoveredItem(key),
    onMouseLeave: () => setHoveredItem(null),
  });

  const graphicHover = (key: string) => (h: boolean) => setHoveredItem(h ? key : null);

  // Dynamic style builder for emphasis text that pushes surrounding text on hover
  const em = (key: string, color: string, hoverColor: string) => {
    const isHovered = hoveredItem === key;
    return {
      className: 'inline-block cursor-pointer font-mono font-bold text-lg md:text-xl lg:text-2xl rounded px-1 transition-all duration-300',
      style: {
        color: isHovered ? hoverColor : color,
        textShadow: isHovered ? `0 0 20px ${color}, 0 0 40px ${color}` : 'none',
        background: isHovered ? `rgba(255,255,255,0.03)` : 'transparent',
        borderBottom: isHovered ? `2px solid ${hoverColor}` : '2px solid transparent',
        // Space expansion on hover to prevent clashing with surrounding text
        paddingLeft: isHovered ? '10px' : '4px',
        paddingRight: isHovered ? '10px' : '4px',
        marginLeft: isHovered ? '8px' : '2px',
        marginRight: isHovered ? '8px' : '2px',
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
      },
      ...hp(key),
    };
  };

  const isQ = hoveredItem === 'qc' || hoveredItem === 'qed' || hoveredItem === 'open';
  const isML = hoveredItem === 'llm' || hoveredItem === 'interpret';
  const isQED = hoveredItem === 'qed';

  return (
    <SectionWrapper id="whoami" animation="fade-up" stagger={true} className="!px-2 md:!px-4 lg:!px-6 !py-10 md:!py-14">
      <div className="w-full max-w-[1500px] mx-auto px-3 md:px-4 flex flex-col justify-center min-h-[calc(100vh-80px)] relative">

        {/* ===== Background Graphics (desktop, right margin) ===== */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-visible hidden md:block">
          <QuantumSymbolsCloud isHovered={isQ} onHoverChange={graphicHover('qc')} />
          <BlochSphereGraphic isHovered={hoveredItem === 'open'} onHoverChange={graphicHover('open')} />
          <CavityQEDGraphic isHovered={isQED} onHoverChange={graphicHover('qed')} />
          <NeuralNetworkGraphic isHovered={isML} onHoverChange={graphicHover('llm')} />
          <PhilosophyBookGraphic isHovered={hoveredItem === 'philosophy'} onHoverChange={graphicHover('philosophy')} />
          <CoffeeCupGraphic isHovered={hoveredItem === 'coffee'} onHoverChange={graphicHover('coffee')} />
        </div>

        {/* ===== Text Content (left side, leaves right margin for graphics) ===== */}
        <div className="relative z-10 md:pr-[30%] lg:pr-[28%]" style={{ pointerEvents: 'auto' }}>

          {/* Section Label */}
          <span className="animate-item text-[var(--terminal-cyan)] text-xs md:text-sm font-mono uppercase tracking-widest mb-3 block">
            About Me
          </span>

          {/* Heading with subtle gradient */}
          <h2 className="animate-item font-heading font-light text-4xl md:text-5xl lg:text-6xl mb-4 tracking-tight"
            style={{ background: 'linear-gradient(135deg, var(--photon-white) 60%, var(--terminal-cyan) 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Who Am I?
          </h2>

          {/* Tagline */}
          <p className="animate-item font-mono text-base md:text-lg text-[var(--terminal-cyan)] mb-7 leading-relaxed">
            {personalInfo.tagline}
          </p>

          {/* Bio paragraphs — reduced gaps (space-y-4 md:space-y-5) */}
          <div className="animate-item space-y-4 md:space-y-5"
            style={{ textShadow: '0 0 20px rgba(2,2,4,0.6), 0 0 40px rgba(2,2,4,0.4)' }}>

            {/* P1: Quantum */}
            <p className="text-[var(--photon-white)]/90 text-base md:text-lg lg:text-xl leading-relaxed md:leading-[1.9] font-body tracking-wide">
              I&apos;m a third-year Physics major at IIT Kanpur driven by the ambition of building a fault-tolerant, practically useful{' '}
              <span {...em('qc', 'var(--spectral-violet)', 'var(--terminal-cyan)')}>Quantum Computer</span>
              . Fascinated by the fundamental laws of the universe and computer systems, my research sits at their intersection, currently focusing on{' '}
              <span {...em('qed', 'var(--terminal-cyan)', '#ffffff')}>Cavity Quantum Electrodynamics</span>{' '}
              and the simulation of{' '}
              <span {...em('open', 'var(--terminal-cyan)', '#ffffff')}>open quantum systems</span>{' '}
              for information processing.
            </p>

            {/* Decorative divider with tight padding */}
            <div className="flex items-center gap-3 opacity-20 my-1 md:my-2">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--terminal-cyan)] to-transparent" />
              <span className="text-[var(--terminal-cyan)] text-xs font-mono">◇</span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--quantum-purple)] to-transparent" />
            </div>

            {/* P2: ML */}
            <p className="text-[var(--photon-white)]/90 text-base md:text-lg lg:text-xl leading-relaxed md:leading-[1.9] font-body tracking-wide">
              I have an insatiable desire to understand this world, its workings and its purpose; and wish to acquire as much knowledge about as many things possible. Beyond physics, my intellectual curiosity frequently spills over into Statistics, Machine Learning,{' '}
              <span {...em('llm', 'var(--quantum-purple)', '#ffffff')}>Large Language Models</span>{' '}
              and their{' '}
              <span {...em('interpret', 'var(--quantum-purple)', '#ffffff')}>interpretability</span>.
            </p>

            {/* Decorative divider with tight padding */}
            <div className="flex items-center gap-3 opacity-20 my-1 md:my-2">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--quantum-purple)] to-transparent" />
              <span className="text-[var(--quantum-purple)] text-xs font-mono">◇</span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#D2B48C] to-transparent" />
            </div>

            {/* P3: Philosophy & Coffee */}
            <p className="text-[var(--photon-white)]/90 text-base md:text-lg lg:text-xl leading-relaxed md:leading-[1.9] font-body tracking-wide">
              When I&apos;m not running quantum circuits or debugging neural networks, you&apos;ll likely find me actively debating social issues, or exploring the philosophies of{' '}
              <span
                className="inline-block cursor-pointer font-heading italic font-semibold text-lg md:text-xl lg:text-2xl rounded px-1 transition-all duration-300"
                style={{
                  color: hoveredItem === 'philosophy' ? 'var(--quantum-purple)' : 'var(--photon-white)',
                  textShadow: hoveredItem === 'philosophy' ? '0 0 16px var(--quantum-purple)' : 'none',
                  background: hoveredItem === 'philosophy' ? 'rgba(255,255,255,0.03)' : 'transparent',
                  borderBottom: hoveredItem === 'philosophy' ? '2px solid var(--quantum-purple)' : '2px solid transparent',
                  paddingLeft: hoveredItem === 'philosophy' ? '10px' : '4px',
                  paddingRight: hoveredItem === 'philosophy' ? '10px' : '4px',
                  marginLeft: hoveredItem === 'philosophy' ? '8px' : '2px',
                  marginRight: hoveredItem === 'philosophy' ? '8px' : '2px',
                  transform: hoveredItem === 'philosophy' ? 'scale(1.05)' : 'scale(1)',
                  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                }}
                {...hp('philosophy')}
              >Camus and Nietzsche</span>{' '}
              while sipping on a cup of{' '}
              <span
                className="inline-block cursor-pointer transition-all duration-300 text-2xl md:text-3xl lg:text-4xl rounded px-1"
                style={{
                  fontFamily: 'var(--font-cursive), cursive',
                  color: hoveredItem === 'coffee' ? '#ffe0b2' : '#D2B48C',
                  textShadow: hoveredItem === 'coffee' ? '0 0 20px rgba(210,180,140,0.7), 0 0 40px rgba(210,180,140,0.4)' : 'none',
                  background: hoveredItem === 'coffee' ? 'rgba(255,255,255,0.03)' : 'transparent',
                  borderBottom: hoveredItem === 'coffee' ? '2px solid #D2B48C' : '2px solid transparent',
                  paddingLeft: hoveredItem === 'coffee' ? '14px' : '4px',
                  paddingRight: hoveredItem === 'coffee' ? '14px' : '4px',
                  marginLeft: hoveredItem === 'coffee' ? '10px' : '2px',
                  marginRight: hoveredItem === 'coffee' ? '10px' : '2px',
                  transform: hoveredItem === 'coffee' ? 'scale(1.08)' : 'scale(1)',
                  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                }}
                {...hp('coffee')}
              >cappuccino</span>.
            </p>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
