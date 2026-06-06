'use client'

import { useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollState } from '@/components/canvas/WorldlineScene';

gsap.registerPlugin(ScrollTrigger);

{/*─── Journey data (sourced from docs/JOURNEY.md) ────────────────────────────── */}
const BLOCKS = [
  {
    year: '2018 – 2019',
    title: 'Foundations in Engineering & Advocacy',
    body: [
      { subtitle: 'Electronics & Machine Learning', text: 'Tinkered with electronics and Arduinos, developing automated soil-moisture and ML weed detection systems.' },
      { subtitle: 'Leadership & MUNs', text: 'Chaired and hosted school-wide Model United Nations (MUN) debating conferences, securing multiple Best Delegate awards.' },
      { subtitle: 'Social Impact', text: 'Led advocacy initiatives integrating neurodivergent children into mainstream society via adaptive sensory techniques.' },
    ],
  },
  {
    year: '2020',
    title: 'Sustainability, Design & Early Code',
    body: [
      { subtitle: '3D Modelling & Prototyping', text: 'Modelled sustainable bioplastic structures in Fusion 360, winning 3rd place nationally in the ATL Marathon.' },
      { subtitle: 'Tech Entrepreneurship', text: 'Trained with Tech Mahindra and MIT to build go-to-market strategies, business plans, and commercial frameworks.' },
      { subtitle: 'Programming & Software Shift', text: 'Began rigorous software engineering, establishing core competencies in Python and web architectures.' },
    ],
  },
  {
    year: '2020 – 2021',
    title: 'Computational Neuroscience (AIM-SIRIUS)',
    body: [
      { subtitle: 'Global Neuroimaging Platform', text: 'Led an Indo-Russian team of 6 under researchers from the Sirius Institute, designing a web platform for EEG signal analysis.' },
      { subtitle: 'Data Pipelines', text: 'Engineered pipeline architectures to clean EEG Time Series streams, compute brain source coordinates, and construct functional graph maps.' },
      { subtitle: 'Algorithmic Optimization', text: 'Optimized neuroimaging pipelines using Python MNE to extract and visualize neural connectivity clusters for scientific analysis.' },
    ],
  },
  {
    year: '2020 – 2022',
    title: 'F1 in Schools & The Quantum Spark',
    body: [
      { subtitle: 'Engineering an F1 Car', text: 'Served as Design Engineer and Research Analyst for Team Quantum Racing at the 2022 F1 in Schools World Finals (UK) after winning the Indian National Championship.' },
      { subtitle: 'Aerodynamics & Simulation', text: 'Iterated aerodynamic models in Fusion 360. Conducted Computational Fluid Dynamics (CFD), FEM structural analysis, and physical wind tunnel tests. Optimized airflow using genetic algorithms.' },
      { subtitle: 'The Quantum Spark', text: 'Read a DRDO milestone article that ignited a deep, lifelong fascination with Quantum Computing and Quantum Key Distribution (QKD).' },
    ],
  },
  {
    year: '2023 – 2024',
    title: 'IIT Kanpur & Technical Leadership',
    body: [
      { subtitle: 'Physics Major at IIT Kanpur', text: 'Enrolled in Physics at IIT Kanpur, focusing coursework on Quantum Computing, Quantum Optics, and Condensed Matter Physics.' },
      { subtitle: 'Quantum Milestones & Qiskit', text: 'Completed the IBM Quantum Challenge 2024 using Qiskit 1.0. Placed as a finalist in the IIT Bombay TechFest Quant Challenge.' },
      { subtitle: 'Campus & Tech Leadership', text: 'Served as Secretary of the Programming Club, coordinating the Machine Learning domain, and debated in parliamentary formats.' },
    ],
  },
  {
    year: '2025',
    title: 'AI Internals & Quantum Research',
    body: [
      { subtitle: 'Mechanistic Interpretability', text: 'Researched LLM internals and information processing representations at the Kyoto University Large Language Model Center.' },
      { subtitle: 'Advanced Quantum Circuits', text: 'Completed the Qiskit Global Summer School 2025, bridging quantum algorithms, chemistry simulation, and hardware implementation.' },
      { subtitle: 'Quantum Optics & Nanophotonics', text: 'Joined the Nanophotonics Group at IITK as an undergraduate researcher in Quantum Optics and Cavity QED.' },
    ],
  },
  {
    year: '2026 & Beyond',
    title: 'Lattices & The Quantum Frontier',
    body: [
      { subtitle: 'Lattice-Based Cryptography', text: 'Built post-quantum security assessment tools to identify lattice-based cryptographic vulnerabilities for the PnB Hackathon.' },
      { subtitle: 'Current Academic Research', text: 'Actively publishing research across three labs: Nanophotonics (IITK), Photonic Devices (IITK), and the Kyoto University LLM Center, bridging classical AI and Quantum Physics.' },
    ],
  },
];

{/*─── Palette (Dark Academia × High-Tech) ──────────────────────────────────────*/}
const C = {
  espresso: '#020204',
  parchment: '#c8b98a',
  dim: '#8a7a62',
  violet: '#8F00FF',
  cyan: '#00FF9D',
  white: '#F0F0F0',
  orange: '#F97316',
};

{/*─── Component ────────────────────────────────────────────────────────────────*/}
export default function WorldlineSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const renderTextWithHighlights = (text: string) => {
    const regex = /(Quantum Computing|Quantum Optics|Quantum Key Distribution|QKD|Post-Quantum|Quantum|Physics|Research|Computational Neuroscience|Lattice-Based Cryptography|Qiskit|Nanophotonics|Cavity QED|Arduinos|Machine Learning|ML|EEG|F1 Car|Aerodynamics)/g;
    const parts = text.split(regex);
    return parts.map((part, idx) => {
      if (regex.test(part)) {
        return (
          <span
            key={idx}
            style={{
              fontFamily: 'var(--font-heading), sans-serif',
              fontWeight: 800,
              color: C.cyan,
              padding: '0 2px',
              textShadow: `0 0 12px ${C.cyan}50, 0 0 24px ${C.cyan}20`,
            }}
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  {/*Keep the 3-D scene aware of scroll progress through this section.*/}
  useEffect(() => {
    const onScroll = () => {
      scrollState.pageScrollY = window.scrollY;
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const h = sectionRef.current.offsetHeight;
      const vh = window.innerHeight;
      const scrolled = -rect.top;
      scrollState.progress = Math.max(0, Math.min(1, scrolled / (h - vh)));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  {/*── Cinematic card reveals (the 3-D graphics live in the global Canvas) ──────*/}
  useGSAP(() => {
    if (!sectionRef.current) return;

    const cards = gsap.utils.toArray<HTMLElement>('.jny-card');
    cards.forEach((card) => {
      const items = card.querySelectorAll('.jny-reveal');
      gsap.set(card, { autoAlpha: 0, y: 80, filter: 'blur(16px)' });
      gsap.set(items, { autoAlpha: 0, y: 28 });

      gsap.timeline({
        scrollTrigger: { trigger: card, start: 'top 80%', end: 'top 42%', scrub: 1 },
      })
        .to(card, { autoAlpha: 1, y: 0, filter: 'blur(0px)', ease: 'power2.out' })
        .to(items, { autoAlpha: 1, y: 0, stagger: 0.12, ease: 'power2.out' }, 0.12);
    });

    {/*Fill the vertical progress rail as the section scrolls.*/}
    gsap.utils.toArray<HTMLElement>('.jny-rail-dot').forEach((dot, i) => {
      gsap.to(dot, {
        backgroundColor: C.cyan,
        opacity: 1,
        scale: 1.6,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: `${(i / BLOCKS.length) * 100}% top`,
          end: `${((i + 1) / BLOCKS.length) * 100}% top`,
          toggleActions: 'play reverse play reverse',
        },
      });
    });
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="worldline"
      className="relative"
      style={{ height: '800vh', background: 'transparent' }}
    >
      {/* ── Sticky vignette so the WebGL stages read clearly ────────────────── */}
      <div className="sticky top-0 z-0 h-screen w-full overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 75% 75% at 50% 50%, transparent 48%, rgba(2,2,4,0.78) 100%)',
          }}
        />
      </div>

      {/* ── Cinematic narrative cards (overlap the sticky graphic) ──────────── */}
      <div className="relative z-10 pointer-events-none" style={{ marginTop: '-100vh' }}>
        {BLOCKS.map((block, i) => (
          <div
            key={i}
            className={`relative flex w-full px-6 md:px-12 lg:px-24 ${i % 2 === 0 ? 'justify-center md:justify-start' : 'justify-center md:justify-end'} ${i === 5 ? 'items-start pt-[12vh]' : 'items-center'}`}
            style={{
              // AI Internals (index 5) gets 2× scroll space to match canvas stage
              minHeight: i === 5 ? '200vh' : '100vh',
            }}
          >
            <div
              className="jny-card max-w-[700px] w-full pointer-events-auto relative overflow-hidden"
              style={{
                background: 'rgba(6, 7, 12, 0.72)',
                backdropFilter: 'blur(22px)',
                WebkitBackdropFilter: 'blur(22px)',
                padding: 'var(--jny-card-padding)',
                borderRadius: '20px',
                border: '1px solid rgba(0, 255, 157, 0.22)',
                boxShadow:
                  '0 12px 60px rgba(0,0,0,0.55), 0 0 24px rgba(0,255,157,0.06), inset 0 0 60px rgba(143,0,255,0.07)',
              }}
            >
              {/* Accent bar */}
              <div
                className="jny-reveal"
                style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
                  background: `linear-gradient(to bottom, ${C.cyan}, ${C.violet})`,
                  opacity: 0.8,
                }}
              />

              {/* Year tag */}
              <span
                className="jny-reveal inline-block font-bold"
                style={{
                  fontFamily: 'monospace',
                  fontSize: 'var(--jny-subtitle-size)',
                  color: C.cyan,
                  letterSpacing: '0.28em',
                  padding: '6px 14px',
                  borderRadius: 999,
                  border: `1px solid ${C.cyan}33`,
                  background: 'rgba(0,255,157,0.06)',
                  textShadow: `0 0 16px ${C.cyan}66`,
                  marginBottom: 'var(--jny-margin-bottom)',
                }}
              >
                {block.year}
              </span>

              {/* Title */}
              <h3
                className="jny-reveal"
                style={{
                  fontFamily: 'Georgia, "Cormorant Garamond", serif',
                  fontWeight: 600,
                  fontSize: 'var(--jny-title-size)',
                  color: '#ffffff',
                  lineHeight: 1.15,
                  marginBottom: 'var(--jny-margin-bottom)',
                  letterSpacing: '0.01em',
                  textShadow: '0 2px 18px rgba(0,0,0,0.85), 0 0 28px rgba(0,255,157,0.12)',
                }}
              >
                {block.title}
              </h3>

              {/* Body — each entry as a labelled mini-block to break up the text */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--jny-gap)' }}>
                {block.body.map((item, idx) => (
                  <div key={idx} className="jny-reveal">
                    <span
                      style={{
                        display: 'inline-block',
                        fontFamily: 'var(--font-heading), monospace',
                        fontSize: 'var(--jny-subtitle-size)',
                        fontWeight: 700,
                        color: C.parchment,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        marginBottom: 6,
                        borderBottom: '1px solid rgba(200, 185, 138, 0.22)',
                        paddingBottom: '2px',
                      }}
                    >
                      {item.subtitle.replace(/:$/, '')}
                    </span>
                    <p
                      style={{
                        fontFamily: 'system-ui, sans-serif',
                        fontSize: 'var(--jny-body-size)',
                        color: '#d6d6dc',
                        lineHeight: 1.75,
                        margin: 0,
                      }}
                    >
                      {renderTextWithHighlights(item.text)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Index indicator */}
              <div
                className="jny-reveal"
                style={{ marginTop: 'var(--jny-margin-bottom)', display: 'flex', alignItems: 'center', gap: 10 }}
              >
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 11,
                    color: C.cyan,
                    opacity: 0.7,
                    letterSpacing: '0.15em',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div style={{ flex: 1, maxWidth: 80, height: 1, background: C.cyan, opacity: 0.25 }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Vertical progress rail ──────────────────────────────────────────── */}
      <div
        className="fixed left-5 top-1/2 -translate-y-1/2 z-20 pointer-events-none"
        style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
      >
        {BLOCKS.map((_, i) => (
          <div
            key={i}
            className="jny-rail-dot"
            style={{ width: 4, height: 4, borderRadius: '50%', background: C.parchment, opacity: 0.3 }}
          />
        ))}
      </div>
    </section>
  );
}
