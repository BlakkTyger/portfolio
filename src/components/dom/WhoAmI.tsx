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

  // Dynamic style builder for emphasis text that pushes surrounding text on hover
  const em = (key: string, color: string, hoverColor: string) => {
    const isHovered = hoveredItem === key;
    return {
      className: 'inline-block cursor-pointer font-mono font-bold rounded px-1 transition-all duration-300',
      style: {
        fontSize: 'var(--whoami-body-size)',
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

  return (
    <SectionWrapper id="whoami" animation="fade-up" stagger={true} className="!px-2 md:!px-4 lg:!px-6 !py-10 md:!py-14 relative overflow-hidden">

      {/* Ambient Graphics Layer positioned absolutely relative to the entire screen-width SectionWrapper */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
        
        {/* Bloch Sphere (1.5x bigger, top-right margin) */}
        <div className="absolute left-[80%] top-[8%] lg:left-[85%] lg:top-[14%] transform -translate-x-1/2 -translate-y-1/2 scale-[0.35] md:scale-[0.6] lg:scale-[1.2] opacity-10 md:opacity-20 lg:opacity-100 transition-all duration-500">
          <BlochSphereGraphic isHovered={true} />
        </div>

        {/* Cavity QED (1.5x bigger, top-left margin behind text) */}
        <div className="absolute left-[15%] top-[14%] lg:left-[10%] lg:top-[10%] transform -translate-x-1/2 -translate-y-1/2 scale-[0.35] md:scale-[0.6] lg:scale-[1.25] opacity-10 md:opacity-[0.35] transition-all duration-500">
          <CavityQEDGraphic isHovered={true} />
        </div>

        {/* Neural Network (1.5x bigger, right margin center) */}
        <div className="absolute left-[85%] top-[40%] lg:left-[78%] lg:top-[38%] transform -translate-x-1/2 -translate-y-1/2 scale-[0.35] md:scale-[0.6] lg:scale-[1.25] opacity-10 md:opacity-100 transition-all duration-500">
          <NeuralNetworkGraphic isHovered={true} />
        </div>

        {/* Philosophy Book (maintained scale, left center background behind text) */}
        <div className="absolute left-[25%] top-[55%] lg:left-[18%] lg:top-[50%] transform -translate-x-1/2 -translate-y-1/2 scale-[0.25] md:scale-[0.4] lg:scale-[0.7] opacity-10 md:opacity-[0.25] transition-all duration-500">
          <PhilosophyBookGraphic isHovered={true} />
        </div>

        {/* Coffee Cup / Mug (extremely large, bottom-right margin) */}
        <div className="absolute left-[78%] top-[82%] lg:left-[82%] lg:top-[72%] transform -translate-x-1/2 -translate-y-1/2 scale-[0.35] md:scale-[0.55] lg:scale-[1.35] opacity-10 md:opacity-100 transition-all duration-500">
          <CoffeeCupGraphic isHovered={true} />
        </div>

        {/* Quantum Symbols Cloud (Main - 1.5x bigger, right center space) */}
        <div className="absolute left-[70%] top-[25%] lg:left-[68%] lg:top-[24%] transform -translate-x-1/2 -translate-y-1/2 scale-[0.4] md:scale-[0.65] lg:scale-[1.3] opacity-10 md:opacity-100 transition-all duration-500">
          <QuantumSymbolsCloud isHovered={true} />
        </div>

        {/* Background Quantum Cloud Copies (5 copies scattered around all margins) - Hidden on smaller screens */}
        {/* Copy 1: Far Left Upper margin (below Cavity QED) */}
        <div className="hidden lg:block absolute left-[8%] top-[22%] lg:left-[6%] lg:top-[28%] transform -translate-x-1/2 -translate-y-1/2 scale-[0.6] lg:scale-[0.85] opacity-[0.2] lg:opacity-[0.35] transition-all duration-500">
          <QuantumSymbolsCloud isHovered={true} />
        </div>

        {/* Copy 2: Mid Left background (behind text paragraphs 1-2) */}
        <div className="hidden lg:block absolute left-[30%] top-[18%] lg:left-[32%] lg:top-[15%] transform -translate-x-1/2 -translate-y-1/2 scale-[0.5] lg:scale-[0.7] opacity-[0.15] lg:opacity-[0.25] transition-all duration-500">
          <QuantumSymbolsCloud isHovered={true} />
        </div>

        {/* Copy 3: Far Right Mid-lower margin (below Neural Network) */}
        <div className="hidden lg:block absolute left-[88%] top-[60%] lg:left-[92%] lg:top-[55%] transform -translate-x-1/2 -translate-y-1/2 scale-[0.7] lg:scale-[1.0] opacity-[0.25] lg:opacity-[0.4] transition-all duration-500">
          <QuantumSymbolsCloud isHovered={true} />
        </div>

        {/* Copy 4: Bottom Left Background (behind text paragraph 3) */}
        <div className="hidden lg:block absolute left-[15%] top-[80%] lg:left-[12%] lg:top-[82%] transform -translate-x-1/2 -translate-y-1/2 scale-[0.65] lg:scale-[0.95] opacity-[0.15] lg:opacity-[0.3] transition-all duration-500">
          <QuantumSymbolsCloud isHovered={true} />
        </div>

        {/* Copy 5: Bottom Center-Right Background (under Coffee Cup area) */}
        <div className="hidden lg:block absolute left-[50%] top-[88%] lg:left-[62%] lg:top-[88%] transform -translate-x-1/2 -translate-y-1/2 scale-[0.55] lg:scale-[0.8] opacity-[0.15] lg:opacity-[0.25] transition-all duration-500">
          <QuantumSymbolsCloud isHovered={true} />
        </div>

      </div>

      <div className="w-full max-w-[1400px] mx-auto px-3 md:px-4 flex flex-col justify-center min-h-[calc(100vh-80px)] relative z-10">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center relative z-10">

          {/* Left Column: Bio Content (7/12 cols) */}
          <div className="md:col-span-7 relative z-10 flex flex-col justify-center" style={{ pointerEvents: 'auto' }}>
            {/* Section Label */}
            <span className="animate-item text-[var(--terminal-cyan)] text-xs md:text-sm font-mono uppercase tracking-widest mb-3 block">
              About Me
            </span>

            {/* Heading with subtle gradient */}
            <h2 className="animate-item font-heading font-light mb-4 tracking-tight"
              style={{
                fontSize: 'var(--whoami-heading-size)',
                background: 'linear-gradient(135deg, var(--photon-white) 60%, var(--terminal-cyan) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
              Who Am I?
            </h2>

            {/* Tagline */}
            <p className="animate-item font-mono text-[var(--terminal-cyan)] mb-7 leading-relaxed"
              style={{ fontSize: 'var(--whoami-tagline-size)' }}>
              {personalInfo.tagline}
            </p>

            {/* Bio paragraphs */}
            <div className="animate-item flex flex-col"
              style={{ gap: 'var(--whoami-spacing)', textShadow: '0 0 20px rgba(2,2,4,0.6), 0 0 40px rgba(2,2,4,0.4)' }}>

              {/* P1: Quantum */}
              <p className="text-[var(--photon-white)]/90 leading-relaxed md:leading-[1.9] font-body tracking-wide"
                style={{ fontSize: 'var(--whoami-body-size)' }}>
                I&apos;m a third-year Physics major at IIT Kanpur driven by the ambition of building a fault-tolerant, practically useful{' '}
                <span {...em('qc', 'var(--spectral-violet)', 'var(--terminal-cyan)')}>Quantum Computer</span>
                . Fascinated by the fundamental laws of the universe and computer systems, my research sits at their intersection, currently focusing on{' '}
                <span {...em('qed', 'var(--terminal-cyan)', '#ffffff')}>Cavity Quantum Electrodynamics</span>{' '}
                and the simulation of{' '}
                <span {...em('open', 'var(--terminal-cyan)', '#ffffff')}>open quantum systems</span>{' '}
                for information processing.
              </p>

              {/* Decorative divider */}
              <div className="flex items-center gap-3 opacity-20 my-1 md:my-2">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--terminal-cyan)] to-transparent" />
                <span className="text-[var(--terminal-cyan)] text-xs font-mono">◇</span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--quantum-purple)] to-transparent" />
              </div>

              {/* P2: ML */}
              <p className="text-[var(--photon-white)]/90 leading-relaxed md:leading-[1.9] font-body tracking-wide"
                style={{ fontSize: 'var(--whoami-body-size)' }}>
                I have an insatiable desire to understand this world, its workings and its purpose; and wish to acquire as much knowledge about as many things possible. Beyond physics, my intellectual curiosity frequently spills over into Statistics, Machine Learning,{' '}
                <span {...em('llm', 'var(--quantum-purple)', '#ffffff')}>Large Language Models</span>{' '}
                and their{' '}
                <span {...em('interpret', 'var(--quantum-purple)', '#ffffff')}>interpretability</span>.
              </p>

              {/* Decorative divider */}
              <div className="flex items-center gap-3 opacity-20 my-1 md:my-2">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--quantum-purple)] to-transparent" />
                <span className="text-[var(--quantum-purple)] text-xs font-mono">◇</span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#D2B48C] to-transparent" />
              </div>

              {/* P3: Philosophy & Coffee */}
              <p className="text-[var(--photon-white)]/90 leading-relaxed md:leading-[1.9] font-body tracking-wide"
                style={{ fontSize: 'var(--whoami-body-size)' }}>
                When I&apos;m not running quantum circuits or debugging neural networks, you&apos;ll likely find me actively debating social issues, or exploring the philosophies of{' '}
                <span
                  className="inline-block cursor-pointer font-heading italic font-semibold rounded px-1 transition-all duration-300"
                  style={{
                    fontSize: 'var(--whoami-body-size)',
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
                  className="inline-block cursor-pointer transition-all duration-300 rounded px-1"
                  style={{
                    fontFamily: 'var(--font-cursive), cursive',
                    fontSize: 'var(--whoami-cappuccino-size)',
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

      </div>
    </SectionWrapper>
  );
}
