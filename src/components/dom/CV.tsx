'use client'

import SectionWrapper from './SectionWrapper';
import { useEffect, useRef } from 'react';

// === MAIN COMPONENT ===

export default function CV() {
    const bgRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!bgRef.current) return;
            const { clientX, clientY } = e;
            const x = (clientX / window.innerWidth - 0.5) * 40;
            const y = (clientY / window.innerHeight - 0.5) * 40;
            
            bgRef.current.style.transform = `translate(${x}px, ${y}px)`;
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <SectionWrapper id="cv" animation="fade-up" stagger={true}>
            <div className="relative w-full max-w-5xl mx-auto py-20 px-8 rounded-3xl border border-[var(--tungsten-gray)]/20 bg-[var(--event-horizon)]/40 backdrop-blur-xl overflow-hidden shadow-2xl">
                
                {/* Animated Background Elements */}
                <div ref={bgRef} className="absolute inset-0 pointer-events-none transition-transform duration-700 ease-out z-0">
                    <div className="absolute top-10 left-[10%] w-64 h-64 bg-[var(--spectral-violet)]/10 rounded-full blur-[80px] animate-pulse" style={{ animationDuration: '4s' }} />
                    <div className="absolute bottom-10 right-[10%] w-72 h-72 bg-[var(--terminal-cyan)]/10 rounded-full blur-[80px] animate-pulse" style={{ animationDuration: '6s' }} />
                </div>

                <div className="relative z-10 text-center flex flex-col items-center">
                    {/* Section Label */}
                    <span className="animate-item inline-block px-4 py-1.5 rounded-full bg-[var(--spectral-violet)]/10 border border-[var(--spectral-violet)]/30 text-[var(--spectral-violet)] text-sm font-mono uppercase tracking-widest mb-6 shadow-[0_0_15px_rgba(138,43,226,0.2)]">
                        Curriculum Vitae
                    </span>

                    {/* Main Heading */}
                    <h2 className="animate-item font-heading text-5xl md:text-6xl lg:text-7xl mb-8 text-[var(--photon-white)] drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                        My Journey on Paper
                    </h2>

                    {/* Description */}
                    <p className="animate-item text-lg md:text-xl text-[var(--tungsten-gray)] mb-12 max-w-2xl mx-auto leading-relaxed">
                        A detailed exposition of my academic background, technical expertise, and professional evolution. 
                        Download the full document to explore my trajectory.
                    </p>

                    {/* CV Button */}
                    <div className="animate-item relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[var(--spectral-violet)] to-[var(--terminal-cyan)] rounded-full blur opacity-40 group-hover:opacity-70 transition duration-500"></div>
                        <a
                            href="/cv.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[var(--void-black)] border border-[var(--spectral-violet)]/50 text-[var(--photon-white)] font-heading text-lg transition-all duration-300 group-hover:bg-[var(--spectral-violet)]/10 hover:scale-[1.02]"
                        >
                            <svg
                                className="w-5 h-5 group-hover:-translate-y-1 transition-transform duration-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                            View Full CV
                            <span className="absolute inset-0 rounded-full ring-1 ring-white/20 scale-100 opacity-0 group-hover:scale-110 group-hover:opacity-100 transition-all duration-500"></span>
                        </a>
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
}