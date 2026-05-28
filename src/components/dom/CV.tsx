'use client'

import SectionWrapper from './SectionWrapper';

// === MAIN COMPONENT ===

export default function CV() {
    return (
        <SectionWrapper id="cv" animation="fade-up" stagger={true}>
            <div className="relative w-full max-w-4xl mx-auto py-24 px-8 md:px-12 rounded-2xl border border-[var(--tungsten-gray)]/10 bg-[var(--event-horizon)]/20 backdrop-blur-md overflow-hidden">

                {/* Minimalist Ambient Light */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-[var(--terminal-cyan)]/20 to-transparent"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-[var(--spectral-violet)]/20 to-transparent"></div>

                <div className="relative z-10 text-center flex flex-col items-center">


                    {/* Main Heading */}
                    <h2 className="animate-item font-heading font-light text-4xl md:text-5xl lg:text-6xl mb-6 text-[var(--photon-white)] tracking-wide">
                        Curriculum Vitae
                    </h2>

                    {/* Description */}
                    <p className="animate-item text-base md:text-lg text-[var(--tungsten-gray)]/80 mb-12 max-w-xl mx-auto leading-relaxed">
                        A detailed exposition of my academic background, technical expertise, and professional evolution.
                    </p>

                    {/* CV Button */}
                    <div className="animate-item">
                        <a
                            href="/cv.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-full bg-[var(--void-black)] border border-[var(--tungsten-gray)]/30 text-[var(--photon-white)] font-mono text-sm tracking-wide transition-all duration-300 hover:border-[var(--photon-white)]/60 hover:bg-[var(--photon-white)]/5"
                        >
                            <svg
                                className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform duration-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
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