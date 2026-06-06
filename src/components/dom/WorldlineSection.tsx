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
      { subtitle: 'Electronics & Machine Learning:', text: 'Started tinkering with electronics and Arduinos, developing a soil-moisture-based automated irrigation system. Upgraded it over the years to include an evapotranspiration-based scheduling algorithm and automated ML weed detection.' },
      { subtitle: 'Leadership:', text: 'Dove into debating and Model United Nations, winning multiple Best Delegate awards and hosting several school-wide MUN conferences.' },
      { subtitle: 'Social Impact:', text: 'Led tangible sensitization initiatives to integrate children with special needs into mainstream society, which included training professionals (like hairstylists) to adapt their techniques for neurodivergent children.' },
    ],
  },
  {
    year: '2020',
    title: 'Sustainability, Design & Early Code',
    body: [
      { subtitle: '3D Modelling & Sustainability:', text: 'Learned 3D modelling (Fusion 360) to design and prototype a sustainable, bioplastic-based food container. Secured 3rd place nationally in the ATL Marathon.' },
      { subtitle: 'Entrepreneurship:', text: 'Interned with Tech Mahindra and MIT to develop a working prototype and business plan, receiving extensive training in go-to-market strategies, company setup, and legalities.' },
      { subtitle: 'The Programming Shift:', text: 'Began serious software development, building a foundation in Python and transitioning into web development.' },
    ],
  },
  {
    year: '2020 – 2021',
    title: 'Computational Neuroscience (AIM-SIRIUS)',
    body: [
      { subtitle: 'Global Collaboration:', text: 'Led an Indo-Russian team of 6 students under researchers from the Sirius Institute to develop a web platform for the parallel processing of neuroimaging data.' },
      { subtitle: 'Data Pipeline Construction:', text: 'Built pipelines to clean EEG Time Series data, obtain source coordinates, and convert data into graphs.' },
      { subtitle: 'Algorithmic Optimization:', text: 'Later interned for the same lab to optimize the algorithms. Used Python (MNE library), data analysis tools, and graphing libraries to visualize brain signals and evaluate connectivity/clustering metrics for researchers.' },
    ],
  },
  {
    year: '2020 – 2022',
    title: 'F1 in Schools & The Quantum Spark',
    body: [
      { subtitle: 'Engineering an F1 Car:', text: 'Represented India as Design Engineer & Research Analyst for Team Quantum Racing at the 2022 F1 in Schools World Finals (UK). Won the 2021 Indian National Championship, sweeping awards for Best Pit Display, Enterprise Portfolio, and Innovative Thinking.' },
      { subtitle: 'Aerodynamics & Simulation:', text: 'Modelled miniature F1 cars in Fusion 360, iteratively testing them using Computational Fluid Dynamics (CFD), Finite Element Method (FEM), and physical wind/smoke tunnels. Devised a genetic algorithm to find the ideal aerodynamic configuration under strict weight constraints.' },
      { subtitle: 'A New Interest:', text: 'A 2020 DRDO milestone article sparked a deep, lasting fascination with Quantum Computing and Quantum Key Distribution (QKD).' },
    ],
  },
  {
    year: '2023 – 2024',
    title: 'IIT Kanpur & Technical Leadership',
    body: [
      { subtitle: 'Physics Major:', text: 'Joined IIT Kanpur to formally pursue a degree in Physics. Later expanded my academic focus with advanced courses in quantum computing, quantum optics, and condensed matter physics.' },
      { subtitle: 'Quantum Milestones:', text: 'Completed the IBM Quantum Challenge 2024, demonstrating proficiency in Qiskit 1.0 for utility-scale quantum experiments. Later became a finalist in the IIT Bombay TechFest Quant Challenge (Dec 2024).' },
      { subtitle: 'Campus Leadership:', text: 'Rose from Coordinator to Secretary of the Programming Club, overseeing the Machine Learning and Web Development domains. Additionally, joined the college Debating Society, participating in Asian and British Parliamentary formats.' },
    ],
  },
  {
    year: '2025',
    title: 'AI Internals & Quantum Research',
    body: [
      { subtitle: 'Mechanistic Interpretability:', text: 'Began working with the Large Language Model Center at Kyoto University (Dept. of Intelligence Science and Technology), researching LLM internals and how these models process information.' },
      { subtitle: 'Advanced Quantum Circuits:', text: 'Completed the intensive Qiskit Global Summer School 2025, bridging physics, chemistry, and Python to work on state-of-the-art quantum computation.' },
      { subtitle: 'Nanophotonics Group:', text: 'Joined IITK’s Nanophotonics Group as an undergraduate researcher in December, diving into Quantum Optics and Cavity QED.' },
    ],
  },
  {
    year: '2026 & Beyond',
    title: 'Lattices & The Quantum Frontier',
    body: [
      { subtitle: 'Lattice-Based Cryptography:', text: 'Stepped into post-quantum security in March 2026, building a tool to identify post-quantum (lattice-based) vulnerabilities within Indian financial institutions for the PnB Hackathon.' },
      { subtitle: 'Current Endeavors:', text: 'Actively working as a student researcher across three distinct labs: the Nanophotonics Group (EE, IITK), the Photonic Devices Lab (EE, IITK), and the Large Language Model Center at Kyoto University — synthesizing my expertise in classical AI and quantum physics.' },
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
      style={{ height: '700vh', background: 'transparent' }}
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
            className="relative flex items-center"
            style={{
              minHeight: '100vh',
              padding: '0 clamp(24px, 8vw, 120px)',
              justifyContent: i % 2 === 0 ? 'flex-start' : 'flex-end',
            }}
          >
            <div
              className="jny-card max-w-[600px] pointer-events-auto relative overflow-hidden"
              style={{
                background: 'rgba(6, 7, 12, 0.72)',
                backdropFilter: 'blur(22px)',
                WebkitBackdropFilter: 'blur(22px)',
                padding: 'clamp(32px, 3.2vw, 52px)',
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
                className="jny-reveal inline-block mb-5 font-bold"
                style={{
                  fontFamily: 'monospace',
                  fontSize: 'clamp(13px, 1.4vw, 16px)',
                  color: C.cyan,
                  letterSpacing: '0.28em',
                  padding: '6px 14px',
                  borderRadius: 999,
                  border: `1px solid ${C.cyan}33`,
                  background: 'rgba(0,255,157,0.06)',
                  textShadow: `0 0 16px ${C.cyan}66`,
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
                  fontSize: 'clamp(30px, 3.8vw, 50px)',
                  color: '#ffffff',
                  lineHeight: 1.15,
                  marginBottom: 28,
                  letterSpacing: '0.01em',
                  textShadow: '0 2px 18px rgba(0,0,0,0.85), 0 0 28px rgba(0,255,157,0.12)',
                }}
              >
                {block.title}
              </h3>

              {/* Body — each entry as a labelled mini-block to break up the text */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {block.body.map((item, idx) => (
                  <div key={idx} className="jny-reveal">
                    <span
                      style={{
                        display: 'block',
                        fontFamily: 'monospace',
                        fontSize: 'clamp(11px, 1.1vw, 13px)',
                        color: C.parchment,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        marginBottom: 6,
                      }}
                    >
                      {item.subtitle.replace(/:$/, '')}
                    </span>
                    <p
                      style={{
                        fontFamily: 'system-ui, sans-serif',
                        fontSize: 'clamp(14px, 1.25vw, 16.5px)',
                        color: '#d6d6dc',
                        lineHeight: 1.65,
                        margin: 0,
                      }}
                    >
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Index indicator */}
              <div
                className="jny-reveal"
                style={{ marginTop: 26, display: 'flex', alignItems: 'center', gap: 10 }}
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
