'use client'

import SectionWrapper from './SectionWrapper';

// === MAIN COMPONENT ===

export default function CV() {
    return (
        <SectionWrapper id="cv" animation="fade-up" stagger={true}>
            <div className="max-w-4xl mx-auto text-center">

                {/* Section Label */}
                <span className="animate-item text-[var(--spectral-violet)] text-sm font-mono uppercase tracking-widest mb-4 block">
                    Curriculum Vitae
                </span>

                {/* Main Heading */}
                <h2 className="animate-item font-heading text-5xl md:text-6xl lg:text-7xl mb-8 text-[var(--photon-white)]">
                    My CV
                </h2>

                {/* Description */}
                <p className="animate-item text-lg md:text-xl text-[var(--tungsten-gray)] mb-12 max-w-2xl mx-auto">
                    View my full curriculum vitae for a detailed overview of my
                    education, experience, skills, and accomplishments.
                </p>

                {/* CV Button */}
                <a
                    href="/cv.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="animate-item inline-flex items-center justify-center gap-3
             px-6 py-3 rounded-full
             bg-[var(--spectral-violet)] text-[var(--photon-white)]
             font-heading text-lg
             transition-transform transition-shadow transition-colors duration-300
             hover:bg-[var(--spectral-violet)]/80
             hover:scale-105 hover:shadow-lg hover:shadow-[var(--spectral-violet)]/25"
                >
                    <svg
                        className="w-5 h-5"
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
                </a>

            </div>
        </SectionWrapper>
    );
}