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
    title: 'Early Years: Circuits, Debate Floors & Social Work',
    body: [
      { subtitle: 'Electronics', text: 'Played around with electronics, broke hundreds of jumper wires and eventally built an Arduino based soil-moisture and weed-detection systems before fully understanding why or how they worked.' },
      { subtitle: 'Debate & Public Speaking', text: "Ran school-wide MUN conferences as chair and host. Collected Best Delegate awards; more importantly, learned to argue for positions I didn't believe in :)" },
      { subtitle: 'Social Impact', text: 'Led a social initiative helping integrate neurodivergent children into the mainstream society by working with NGOs, clinics, schools, hair salons, cafes etc.' },
    ],
  },
  {
    year: '2020',
    title: 'Sustainable Design, Bioplastics & First Real Code',
    body: [
      { subtitle: '3D Modelling & Prototyping', text: 'Designed sustainable bioplastic structures in Fusion 360, winning 3rd nationally at the ATL Marathon.' },
      { subtitle: 'Tech Entrepreneurship', text: 'Trained with Tech Mahindra on go-to-market strategy and commercial frameworks. Briefly entertained the idea of becoming a founder; but academia won <3' },
      { subtitle: 'Programming & The Shift', text: 'Started exploring programming during COVID: Python, web architectures, the fundamentals. The beginning of building things that live inside computers.' },
    ],
  },
  {
    year: '2020 – 2021',
    title: 'Computational Neuroscience (AIM-SIRIUS)',
    body: [
      { subtitle: 'Global Neuroimaging Platform', text: 'Led an Indo-Russian team of 6 under Sirius Institute researchers to build a web platform for EEG signal analysis.' },
      { subtitle: 'Data Pipelines', text: 'Engineered pipelines to clean EEG time-series streams, compute brain source coordinates, and construct functional graph maps of neural activity.' },
      { subtitle: 'Algorithmic Optimization', text: 'Used Python MNE to extract and visualize neural connectivity clusters. The brain, it turns out, is also just a graph problem.' },
    ],
  },
  {
    year: '2020 – 2022',
    title: 'F1 in Schools & The Quantum Spark',
    body: [
      { subtitle: 'Engineering an F1 Car', text: 'Design Engineer and Research Analyst for Team Quantum Racing: Indian National Champions, then 2022 F1 in Schools World Finalists in the UK. A lot of carbon fibre and lost sleep.' },
      { subtitle: 'Aerodynamics & Simulation', text: 'Ran CFD, FEM structural analysis, and physical wind tunnel tests. Optimized airflow geometries using genetic algorithms. Combined computation and physics in a way that felt truly powerful.' },
      { subtitle: 'The Quantum Spark', text: 'A DRDO article on Quantum Key Distribution landed at exactly the right moment. Everything since has been downstream of that paragraph.' },
    ],
  },
  {
    year: '2023 – 2024',
    title: 'IIT Kanpur & Technical Leadership',
    body: [
      { subtitle: 'Physics at IIT Kanpur', text: 'Enrolled in Physics at IIT Kanpur and centred my coursework on Quantum Computing, Quantum Optics, and Condensed Matter.' },
      { subtitle: 'Quantum Milestones & Qiskit', text: 'Completed IBM Quantum Challenge 2024 on Qiskit 1.0; started studying quantum algorithms and the QC God Book: Nielsen-Chuang' },
      { subtitle: 'Campus & Tech Leadership', text: 'Actively involved in the Debating and Programming Clubs of the institute. Physics by day, programming and rhetoric by night :)' },
    ],
  },
  {
    year: '2025',
    title: 'Quantum Research & AI Internals  ',
    body: [
      { subtitle: 'Mechanistic Interpretability', text: 'Researched how LLMs represent and process information internally at the Kyoto University LLM Center. Asking "how does the model actually know?" turns out to be surprisingly hard.' },
      { subtitle: 'Quantum Algorithms & Hardware', text: 'Completed Qiskit Global Summer School 2025: quantum algorithms, chemistry simulation on real hardware. The gap between theory and reality due to decoherence is very real.' },
      { subtitle: 'Quantum Optics & Cavity QED', text: 'Joined the Nanophotonics Group at IITK as an undergrad researcher in Quantum Optics and Cavity QED. Now officially spending time thinking about single photons for a living.' },
    ],
  },
  {
    year: '2026 & Beyond',
    title: 'Committed to Research',
    body: [
      { subtitle: 'Post-Quantum Cryptography', text: 'Built security assessment tools for lattice-based cryptographic vulnerabilities at the PnB Hackathon.' },
      { subtitle: 'Current Research', text: 'Actively working across three labs - Nanophotonics (IITK), Photonic Devices (IITK), and Kyoto University\'s LLM Center - sitting at the intersection of quantum light-matter interaction and classical AI. Actively working on Cavity-QED, Single Photon Sources, and Mechanistic Interpretabiliy' },
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
    const regex = /(Quantum Computing|Quantum Optics|Quantum Key Distribution|QKD|Post-Quantum|Quantum|Physics|Research|Computational Neuroscience|Lattice-Based Cryptography|Qiskit|Nanophotonics|Cavity QED|Arduino|Machine Learning|ML|EEG|Aerodynamics)/g;
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
