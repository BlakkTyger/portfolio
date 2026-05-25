'use client'

import React, { useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollState } from '@/components/canvas/WorldlineScene';

gsap.registerPlugin(ScrollTrigger);

// ─── Journey data (sourced from docs/JOURNEY.md) ───────────────────────────
const BLOCKS = [
  {
    year: '2018 – 2019',
    title: 'Foundations in Engineering & Advocacy',
    body: 'Started tinkering with Arduinos, developing a soil-moisture irrigation system—later upgraded with an ML weed-detection algorithm, felicitated by CSIR in 2022. Simultaneously dove into MUN, winning multiple Best Delegate awards and leading sensitization initiatives for neurodivergent children.',
  },
  {
    year: '2020',
    title: 'Sustainability, Design & Early Code',
    body: 'Learned 3D modelling in Fusion 360 to prototype ADBHUT—a bioplastic food container that secured 3rd place nationally at ATL Marathon. Interned with Tech Mahindra & MIT on go-to-market strategy. Wrote first serious Python; transitioned into web development.',
  },
  {
    year: '2020 – 2021',
    title: 'Computational Neuroscience (AIM-SIRIUS)',
    body: 'Led an Indo-Russian team of 6 under Sirius Institute researchers to build a web platform for parallel neuroimaging processing. Built EEG data pipelines, extracted source coordinates, and used Python (MNE) to visualise brain signals and evaluate connectivity metrics.',
  },
  {
    year: '2020 – 2022',
    title: 'F1 in Schools & The Quantum Spark',
    body: 'Represented India as Design Engineer & Research Analyst for Team Quantum Racing at the 2022 F1 in Schools World Finals (UK), after winning the 2021 Indian National Championship. Ran CFD & FEM simulations, devised a genetic algorithm for aerodynamic optimisation—and a DRDO article ignited a lasting fascination with Quantum Key Distribution.',
  },
  {
    year: '2023 – 2024',
    title: 'IIT Kanpur & Technical Leadership',
    body: 'Joined IIT Kanpur for a Physics degree, expanding into quantum computing, quantum optics, and condensed matter. Completed the IBM Quantum Challenge 2024 (Qiskit 1.0). Rose to Secretary of the Programming Club, overseeing ML & WebDev domains, and competed in Asian and British Parliamentary debates.',
  },
  {
    year: '2025',
    title: 'AI Internals & Quantum Research',
    body: 'Working with the LLM Center at Kyoto University on mechanistic interpretability—how language models process information internally. Completed Qiskit Global Summer School 2025. Joined IITK\'s Nanophotonics Group as an undergraduate researcher in Quantum Optics and Cavity QED.',
  },
  {
    year: '2026 & Beyond',
    title: 'Securing the Future',
    body: 'Stepped into post-quantum cryptography in March 2026, building a tool to identify PQC vulnerabilities in Indian financial institutions for the PnB Hackathon. Currently conducting research across the Nanophotonics Group (EE, IITK), Photonic Devices Lab (EE, IITK), and the LLM Center at Kyoto University.',
  },
];

// ─── Palette (Dark Academia × High-Tech) ────────────────────────────────────
const C = {
  espresso:   '#1a1208',
  parchment:  '#c8b98a',
  dim:        '#8a7a62',
  violet:     '#8F00FF',
  cyan:       '#00FF9D',
  white:      '#F0F0F0',
  orange:     '#F97316',
  grid:       'rgba(200,185,138,0.12)',
};

// ─── Component ───────────────────────────────────────────────────────────────
export default function WorldlineSection() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const canvasRef   = useRef<SVGSVGElement>(null);

  // Keep the 3-D scene aware of scroll progress
  useEffect(() => {
    const onScroll = () => {
      scrollState.pageScrollY = window.scrollY;
      if (!sectionRef.current) return;
      const rect   = sectionRef.current.getBoundingClientRect();
      const h      = sectionRef.current.offsetHeight;
      const vh     = window.innerHeight;
      const scrolled = -rect.top;
      scrollState.progress = Math.max(0, Math.min(1, scrolled / (h - vh)));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── GSAP ScrollTrigger master timeline ──────────────────────────────────
  useGSAP(() => {
    if (!sectionRef.current || !canvasRef.current) return;

    const section = sectionRef.current;

    // Helper: return a ScrollTrigger config anchored to the section
    const st = (start: string, end: string) => ({
      trigger: section,
      start,
      end,
      scrub: 1.2,
    });

    /* ── Utility: set everything hidden at start ── */
    gsap.set([
      '#jny-arduino-group',
      '#jny-container-group',
      '#jny-neural-group',
      '#jny-f1-group',
      '#jny-quantum-group',
      '#jny-lens-group',
      '#jny-shield-group',
    ], { autoAlpha: 0 });

    /* ═══════════════════════════════════════════
       BLOCK 1  Arduino + circuit traces (0–14%)
    ═══════════════════════════════════════════ */
    const tl1 = gsap.timeline({ scrollTrigger: st('top top', '14% top') });

    tl1
      .to('#jny-arduino-group', { autoAlpha: 1, duration: 0.3 })
      .fromTo('#jny-arduino-board',
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 0.6, ease: 'power2.out' }, 0.1)
      .fromTo('.jny-trace',
        { strokeDashoffset: 200, opacity: 0 },
        { strokeDashoffset: 0, opacity: 0.7, duration: 0.8, stagger: 0.05, ease: 'none' }, 0.3)
      .fromTo('.jny-comp',
        { scale: 0, transformOrigin: 'center center', opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, stagger: 0.06, ease: 'back.out(1.7)' }, 0.5)
      .fromTo('.jny-pulse-dot',
        { scale: 0 },
        { scale: 1, duration: 0.3, stagger: 0.04, ease: 'elastic.out(1,0.5)' }, 0.9);

    /* fade out at end of block 1 */
    gsap.timeline({ scrollTrigger: st('12% top', '16% top') })
      .to('#jny-arduino-group', { autoAlpha: 0, duration: 0.5 });

    /* ═══════════════════════════════════════════
       BLOCK 2  Wireframe container + code spirals (14–28%)
    ═══════════════════════════════════════════ */
    const tl2 = gsap.timeline({ scrollTrigger: st('14% top', '28% top') });

    tl2
      .to('#jny-container-group', { autoAlpha: 1, duration: 0.3 })
      .fromTo('#jny-container-body',
        { scaleY: 0, transformOrigin: 'center bottom', opacity: 0 },
        { scaleY: 1, opacity: 1, duration: 0.7, ease: 'power3.out' }, 0.2)
      .fromTo('.jny-code-line',
        { opacity: 0, x: (i) => (i % 2 === 0 ? -80 : 80), scale: 0.5 },
        { opacity: 0.55, x: 0, scale: 1, duration: 0.5, stagger: 0.07, ease: 'power2.out' }, 0.4);

    /* Continuous container rotation — separate non-scrubbed tween */
    gsap.to('#jny-container-body', {
      rotationY: 360, svgOrigin: '500 300', duration: 5, ease: 'none', repeat: -1,
      scrollTrigger: {
        trigger: section, start: '14% top', end: '28% top',
        toggleActions: 'play pause resume pause',
      },
    });

    gsap.timeline({ scrollTrigger: st('26% top', '30% top') })
      .to('#jny-container-group', { autoAlpha: 0, duration: 0.5 });

    /* ═══════════════════════════════════════════
       BLOCK 3  Neural network (28–42%)
    ═══════════════════════════════════════════ */
    const tl3 = gsap.timeline({ scrollTrigger: st('28% top', '42% top') });

    tl3
      .to('#jny-neural-group', { autoAlpha: 1, duration: 0.3 })
      .fromTo('.jny-node',
        { scale: 0, transformOrigin: 'center center', opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, stagger: { each: 0.04, from: 'random' }, ease: 'back.out(2)' }, 0.2)
      .fromTo('.jny-edge',
        { strokeDashoffset: 150, opacity: 0 },
        { strokeDashoffset: 0, opacity: 0.35, duration: 0.6, stagger: 0.03, ease: 'none' }, 0.5)
      .to('#jny-neural-group', { rotation: 3, svgOrigin: '500 300', duration: 1.5, ease: 'sine.inOut' }, 1.0);

    /* Continuous neural sway */
    gsap.to('#jny-neural-group', {
      rotation: -3, svgOrigin: '500 300', duration: 2.5, ease: 'sine.inOut', yoyo: true, repeat: -1,
      scrollTrigger: {
        trigger: section, start: '28% top', end: '42% top',
        toggleActions: 'play pause resume pause',
      },
    });

    gsap.timeline({ scrollTrigger: st('40% top', '44% top') })
      .to('#jny-neural-group', { autoAlpha: 0, duration: 0.5 });

    /* ═══════════════════════════════════════════
       BLOCK 4  F1 car + wind lines (42–56%)
    ═══════════════════════════════════════════ */
    const tl4 = gsap.timeline({ scrollTrigger: st('42% top', '56% top') });

    tl4
      .to('#jny-f1-group', { autoAlpha: 1, duration: 0.2 })
      /* car streaks in from right */
      .fromTo('#jny-f1-car',
        { x: 600, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, 0.1)
      /* wind lines draw in behind the car */
      .fromTo('.jny-wind',
        { strokeDashoffset: 300, opacity: 0 },
        { strokeDashoffset: 0, opacity: 0.5, duration: 0.7, stagger: 0.04, ease: 'none' }, 0.4)
      /* car slowly drifts across viewport */
      .to('#jny-f1-car',
        { x: -120, duration: 3, ease: 'none' }, 0.9);

    gsap.timeline({ scrollTrigger: st('54% top', '58% top') })
      .to('#jny-f1-group', { autoAlpha: 0, duration: 0.5 });

    /* ═══════════════════════════════════════════
       BLOCK 5  Quantum circuit + gavel (56–70%)
    ═══════════════════════════════════════════ */
    const tl5 = gsap.timeline({ scrollTrigger: st('56% top', '70% top') });

    tl5
      .to('#jny-quantum-group', { autoAlpha: 1, duration: 0.3 })
      /* qubit rails draw in */
      .fromTo('.jny-qubit-rail',
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 0.8, stagger: 0.08, ease: 'power2.out' }, 0.1)
      /* gates appear */
      .fromTo('.jny-gate',
        { scale: 0, transformOrigin: 'center center', opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.35, stagger: 0.05, ease: 'back.out(1.7)' }, 0.6)
      /* gavel swings in */
      .fromTo('#jny-gavel',
        { rotation: -70, transformOrigin: '80% 20%', opacity: 0 },
        { rotation: 15, opacity: 1, duration: 0.5, ease: 'power4.in' }, 1.2)
      /* circuit shatters → bits scatter */
      .to('.jny-gate',
        { scale: 0, opacity: 0, x: () => gsap.utils.random(-160, 160), y: () => gsap.utils.random(-100, 100), duration: 0.5, stagger: 0.03, ease: 'power2.in' }, 1.6)
      .to('.jny-qubit-rail',
        { scaleX: 0, duration: 0.4, stagger: 0.04, ease: 'power2.in' }, 1.7)
      .fromTo('.jny-bit',
        { opacity: 0, scale: 0 },
        { opacity: 0.7, scale: 1, x: () => gsap.utils.random(-200, 200), y: () => gsap.utils.random(-120, 120), duration: 0.6, stagger: 0.04, ease: 'power2.out' }, 1.9);

    gsap.timeline({ scrollTrigger: st('68% top', '72% top') })
      .to('#jny-quantum-group', { autoAlpha: 0, duration: 0.5 });

    /* ═══════════════════════════════════════════
       BLOCK 6  Optical lens + laser (70–84%)
    ═══════════════════════════════════════════ */
    const tl6 = gsap.timeline({ scrollTrigger: st('70% top', '84% top') });

    tl6
      .to('#jny-lens-group', { autoAlpha: 1, duration: 0.3 })
      /* bits converge to form the lens */
      .to('.jny-bit',
        { x: 0, y: 0, opacity: 0, scale: 0, duration: 0.6, stagger: 0.03, ease: 'power2.in' }, 0.1)
      .fromTo('#jny-lens',
        { scale: 0, opacity: 0, transformOrigin: 'center center' },
        { scale: 1, opacity: 1, duration: 0.7, ease: 'elastic.out(1,0.6)' }, 0.6)
      /* laser fires */
      .fromTo('#jny-laser-beam',
        { strokeDashoffset: 500, opacity: 0 },
        { strokeDashoffset: 0, opacity: 1, duration: 0.8, ease: 'none' }, 1.1);

    /* Continuous laser flicker */
    gsap.to('#jny-laser-beam', {
      opacity: 0.5, duration: 0.35, ease: 'sine.inOut', yoyo: true, repeat: -1,
      scrollTrigger: {
        trigger: section, start: '70% top', end: '84% top',
        toggleActions: 'play pause resume pause',
      },
    });

    gsap.timeline({ scrollTrigger: st('82% top', '86% top') })
      .to('#jny-lens-group', { autoAlpha: 0, duration: 0.5 });

    /* ═══════════════════════════════════════════
       BLOCK 7  Padlock → Shield (84–100%)
    ═══════════════════════════════════════════ */
    const tl7 = gsap.timeline({ scrollTrigger: st('84% top', '100% top') });

    tl7
      .to('#jny-shield-group', { autoAlpha: 1, duration: 0.3 })
      /* padlock falls in */
      .fromTo('#jny-padlock',
        { y: -60, opacity: 0, scale: 1.2 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'bounce.out' }, 0.2)
      /* laser hits → flash */
      .to('#jny-hit-flash',
        { opacity: 1, duration: 0.1, ease: 'none' }, 1.0)
      .to('#jny-hit-flash',
        { opacity: 0, duration: 0.15 }, 1.1)
      /* padlock morphs to shield */
      .to('#jny-padlock',
        { scale: 0, opacity: 0, duration: 0.3, ease: 'power2.in' }, 1.1)
      .fromTo('#jny-shield',
        { scale: 0, opacity: 0, transformOrigin: 'center center' },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }, 1.3);

    /* Continuous shield pulse and rings */
    gsap.to('#jny-shield', {
      filter: 'drop-shadow(0 0 22px #00FF9D)', scale: 1.06,
      duration: 1.1, ease: 'sine.inOut', yoyo: true, repeat: -1, transformOrigin: 'center center',
      scrollTrigger: {
        trigger: section, start: '84% top', end: '100% top',
        toggleActions: 'play pause resume pause',
      },
    });
    gsap.to('.jny-shield-ring', {
      scale: 2.8, opacity: 0, duration: 1.6, ease: 'power1.out', repeat: -1,
      stagger: { each: 0.5, repeat: -1 },
      scrollTrigger: {
        trigger: section, start: '84% top', end: '100% top',
        toggleActions: 'play pause resume pause',
      },
    });

  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="worldline"
      className="relative"
      style={{ height: '700vh', background: C.espresso }}
    >
      {/* ── Section header ────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-0 h-screen w-full overflow-hidden pointer-events-none">

        {/* Subtle parchment-grain texture overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 50% 50%, #26190a 0%, ${C.espresso} 100%)`,
          }}
        />

        {/* ── SVG Animation Canvas ────────────────────────────────────────── */}
        <svg
          ref={canvasRef}
          viewBox="0 0 1000 600"
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 w-full h-full"
          aria-hidden="true"
        >
          <defs>
            {/* Glow filter — cyan */}
            <filter id="glow-cyan" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            {/* Glow filter — violet */}
            <filter id="glow-violet" x="-40%" y="-40%" width="180%" height="180%">
              <feColorMatrix type="matrix"
                values="0.2 0 0 0 0.56  0 0 0 0 0  0 0.8 0 0 1  0 0 0 1 0" result="colored"/>
              <feGaussianBlur in="colored" stdDeviation="6" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            {/* Glow filter — orange */}
            <filter id="glow-orange" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="4" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            {/* Laser gradient */}
            <linearGradient id="laser-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={C.cyan} stopOpacity="1" />
              <stop offset="100%" stopColor={C.violet} stopOpacity="0.4" />
            </linearGradient>
            {/* Shield gradient */}
            <linearGradient id="shield-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={C.cyan} stopOpacity="0.9" />
              <stop offset="100%" stopColor={C.violet} stopOpacity="0.7" />
            </linearGradient>
          </defs>

          {/* ─────────────────────────────────────────────────────────────
              STAGE 1 — Arduino board + circuit traces
              Positioned: right side (x 540–860), y 150–420
          ───────────────────────────────────────────────────────────── */}
          <g id="jny-arduino-group">
            {/* Board body */}
            <rect id="jny-arduino-board" x="540" y="200" width="280" height="170"
              rx="8" fill="#1e3a2f" stroke={C.cyan} strokeWidth="1.5" />
            {/* USB connector */}
            <rect x="540" y="232" width="24" height="40" rx="3"
              fill="#2a2a2a" stroke={C.parchment} strokeWidth="1" opacity="0.8" />
            {/* Reset button */}
            <circle className="jny-comp" cx="590" cy="215" r="7"
              fill="#c0392b" stroke={C.parchment} strokeWidth="1" />
            {/* Main MCU chip */}
            <rect className="jny-comp" x="640" y="230" width="70" height="70"
              rx="4" fill="#111" stroke={C.cyan} strokeWidth="1.2" />
            <text x="675" y="272" textAnchor="middle" fontSize="7"
              fill={C.cyan} opacity="0.8" fontFamily="monospace">ATmega</text>
            {/* Crystal */}
            <rect className="jny-comp" x="730" y="245" width="22" height="10"
              rx="2" fill="#444" stroke={C.parchment} strokeWidth="0.8" />
            {/* Capacitors */}
            {[750, 770, 790].map((cx, i) => (
              <circle key={i} className="jny-comp" cx={cx} cy="335" r="5"
                fill="#1a1a2e" stroke={C.cyan} strokeWidth="0.8" opacity="0.9" />
            ))}
            {/* Pin headers */}
            {Array.from({ length: 8 }, (_, i) => (
              <rect key={i} className="jny-comp"
                x={558 + i * 14} y="358" width="8" height="12"
                rx="1" fill="#333" stroke={C.parchment} strokeWidth="0.6" opacity="0.8" />
            ))}
            {/* Circuit traces radiating out */}
            {[
              'M540,270 L460,270 L420,230',
              'M540,310 L480,310 L450,350 L400,350',
              'M540,340 L500,340 L500,400 L440,400',
              'M820,265 L880,265 L920,240',
              'M820,300 L870,300 L900,340 L950,340',
              'M820,330 L860,330 L860,390 L920,390',
              'M680,200 L680,170 L640,140',
              'M720,200 L720,155 L780,130',
            ].map((d, i) => (
              <path key={i} className="jny-trace"
                d={d}
                fill="none" stroke={C.cyan} strokeWidth="1.2" opacity="0.6"
                strokeDasharray="200" strokeDashoffset="200" />
            ))}
            {/* Endpoint dots on traces */}
            {[
              [420,230],[400,350],[440,400],[920,240],[950,340],[920,390],[640,140],[780,130]
            ].map(([cx,cy], i) => (
              <circle key={i} className="jny-pulse-dot"
                cx={cx} cy={cy} r="3.5"
                fill={C.cyan} filter="url(#glow-cyan)" opacity="0.8" />
            ))}
          </g>

          {/* ─────────────────────────────────────────────────────────────
              STAGE 2 — Wireframe food container + code strings
              Positioned: centre (x 380–620), y 100–480
          ───────────────────────────────────────────────────────────── */}
          <g id="jny-container-group">
            {/* Wireframe bowl — top ellipse */}
            <g id="jny-container-body">
              <ellipse cx="500" cy="210" rx="120" ry="30"
                fill="none" stroke={C.parchment} strokeWidth="1.2" opacity="0.7" />
              {/* Side lines */}
              {[-120,-80,-40,0,40,80,120].map((dx, i) => (
                <line key={i}
                  x1={500+dx} y1="210" x2={500 + dx * 0.6} y2="400"
                  stroke={C.parchment} strokeWidth="0.8" opacity="0.4" />
              ))}
              {/* Bottom ellipse */}
              <ellipse cx="500" cy="400" rx="72" ry="18"
                fill="none" stroke={C.parchment} strokeWidth="1.2" opacity="0.7" />
              {/* Horizontal rings */}
              {[250,300,350].map((cy, i) => {
                const scale = 1 - (cy - 210) / 240;
                return (
                  <ellipse key={i} cx="500" cy={cy}
                    rx={120 * scale} ry={30 * scale}
                    fill="none" stroke={C.parchment} strokeWidth="0.7" opacity="0.3" />
                );
              })}
              {/* Bioplastic label */}
              <text x="500" y="308" textAnchor="middle" fontSize="9"
                fill={C.cyan} opacity="0.6" fontFamily="monospace">BIOPLASTIC</text>
            </g>

            {/* Code strings spiralling around */}
            {[
              { x: 300, y: 170, t: 'def solve():' },
              { x: 680, y: 200, t: 'import numpy as np' },
              { x: 260, y: 310, t: 'model.fit(X, y)' },
              { x: 690, y: 340, t: 'return output' },
              { x: 320, y: 430, t: 'torch.nn.Linear' },
              { x: 640, y: 460, t: 'grad.backward()' },
            ].map(({ x, y, t }, i) => (
              <text key={i} className="jny-code-line"
                x={x} y={y} fontSize="11" fontFamily="monospace"
                fill={C.violet} opacity="0.55">{t}</text>
            ))}
          </g>

          {/* ─────────────────────────────────────────────────────────────
              STAGE 3 — Neural network graph
              Positioned: spread across canvas
          ───────────────────────────────────────────────────────────── */}
          <g id="jny-neural-group">
            {/* Layers: input(3), hidden1(4), hidden2(4), output(2) */}
            {(() => {
              const layers = [
                { x: 200, ys: [180, 300, 420] },
                { x: 370, ys: [150, 250, 350, 450] },
                { x: 600, ys: [150, 250, 350, 450] },
                { x: 780, ys: [220, 380] },
              ];
              const edges: React.ReactElement[] = [];
              const nodes: React.ReactElement[] = [];
              const colors = [C.cyan, C.violet, C.parchment, C.orange];

              layers.forEach((layer, li) => {
                layer.ys.forEach((y, ni) => {
                  nodes.push(
                    <circle key={`n${li}-${ni}`} className="jny-node"
                      cx={layer.x} cy={y} r="10"
                      fill={C.espresso} stroke={colors[li]} strokeWidth="1.5"
                      filter="url(#glow-cyan)" />
                  );
                  if (li < layers.length - 1) {
                    layers[li + 1].ys.forEach((y2, ni2) => {
                      edges.push(
                        <line key={`e${li}-${ni}-${ni2}`} className="jny-edge"
                          x1={layer.x} y1={y} x2={layers[li+1].x} y2={y2}
                          stroke={C.parchment} strokeWidth="0.6"
                          strokeDasharray="150" strokeDashoffset="150" />
                      );
                    });
                  }
                });
              });

              return <>{edges}{nodes}</>;
            })()}
          </g>

          {/* ─────────────────────────────────────────────────────────────
              STAGE 4 — F1 car + aerodynamic wind lines
              Positioned: lower half of canvas, car travels right-to-left
          ───────────────────────────────────────────────────────────── */}
          <g id="jny-f1-group">
            {/* Wind tunnel lines — drawn from right, trailing behind car */}
            {[200, 230, 255, 280, 305, 325, 345].map((y, i) => (
              <path key={i} className="jny-wind"
                d={`M1020,${y} C900,${y} 820,${y + (i % 2 === 0 ? 8 : -8)} 700,${y}`}
                fill="none" stroke={C.parchment} strokeWidth={0.8 - i * 0.05}
                opacity="0.45"
                strokeDasharray="300" strokeDashoffset="300" />
            ))}

            {/* F1 car placeholder — profile view, facing left */}
            <g id="jny-f1-car" transform="translate(200, 260)">
              {/* Main body */}
              <path d="M30,30 L380,30 Q420,30 430,50 L430,70 Q420,90 380,90 L30,90 Q0,90 0,70 L0,50 Q0,30 30,30Z"
                fill="#1a1a2e" stroke={C.cyan} strokeWidth="1.5" />
              {/* Cockpit */}
              <path d="M160,30 Q190,8 230,8 Q270,8 290,30Z"
                fill="#0d1117" stroke={C.cyan} strokeWidth="1.2" />
              {/* Front wing */}
              <path d="M360,70 L440,60 L445,80 L360,85Z"
                fill="#1e2a3a" stroke={C.parchment} strokeWidth="1" />
              {/* Rear wing */}
              <path d="M10,18 L60,18 L60,32 L10,32Z"
                fill="#1e2a3a" stroke={C.parchment} strokeWidth="1" />
              {/* Rear wing pillar */}
              <line x1="35" y1="32" x2="35" y2="50" stroke={C.parchment} strokeWidth="1" />
              {/* Rear wheel */}
              <circle cx="90" cy="90" r="24" fill="#111" stroke={C.violet} strokeWidth="2" />
              <circle cx="90" cy="90" r="12" fill="#1a1a2e" stroke={C.violet} strokeWidth="1" />
              {/* Front wheel */}
              <circle cx="340" cy="90" r="20" fill="#111" stroke={C.violet} strokeWidth="2" />
              <circle cx="340" cy="90" r="10" fill="#1a1a2e" stroke={C.violet} strokeWidth="1" />
              {/* Number */}
              <text x="200" y="68" textAnchor="middle" fontSize="14"
                fill={C.cyan} fontFamily="monospace" fontWeight="bold">QR·01</text>
              {/* Exhaust glow */}
              <path d="M0,55 L-30,50 L-40,60 L-30,70 L0,65"
                fill={C.orange} opacity="0.5" filter="url(#glow-orange)" />
            </g>
          </g>

          {/* ─────────────────────────────────────────────────────────────
              STAGE 5 — Quantum circuit + gavel + shattered bits
              Positioned: centre-left
          ───────────────────────────────────────────────────────────── */}
          <g id="jny-quantum-group">
            {/* Qubit rails */}
            {[180, 250, 320, 390].map((y, i) => (
              <line key={i} className="jny-qubit-rail"
                x1="150" y1={y} x2="820" y2={y}
                stroke={C.parchment} strokeWidth="1.2" opacity="0.5" />
            ))}
            {/* Gate labels */}
            {[
              { x: 220, y: 180, label: 'H' },
              { x: 350, y: 250, label: 'X' },
              { x: 480, y: 320, label: 'CNOT' },
              { x: 610, y: 250, label: 'T' },
              { x: 480, y: 180, label: 'Z' },
              { x: 350, y: 390, label: 'S' },
              { x: 610, y: 390, label: 'H' },
              { x: 740, y: 250, label: 'M' },
            ].map(({ x, y, label }, i) => (
              <g key={i} className="jny-gate" transform={`translate(${x},${y})`}>
                <rect x="-18" y="-14" width="36" height="28"
                  rx="3" fill={C.espresso} stroke={C.violet} strokeWidth="1.2" />
                <text x="0" y="5" textAnchor="middle" fontSize="10"
                  fill={C.violet} fontFamily="monospace">{label}</text>
              </g>
            ))}

            {/* Gavel */}
            <g id="jny-gavel" transform="translate(700, 80)">
              {/* Handle */}
              <rect x="-6" y="30" width="12" height="90"
                rx="4" fill={C.parchment} opacity="0.8" />
              {/* Head */}
              <rect x="-24" y="0" width="48" height="34"
                rx="5" fill={C.parchment} opacity="0.9" />
              {/* Strike mark */}
              <line x1="0" y1="34" x2="0" y2="50"
                stroke={C.orange} strokeWidth="2" opacity="0.6" />
            </g>

            {/* Floating 0s and 1s — scattered after shattering */}
            {Array.from({ length: 16 }, (_, i) => (
              <text key={i} className="jny-bit"
                x={300 + (i % 4) * 80} y={230 + Math.floor(i / 4) * 70}
                fontSize="13" fontFamily="monospace"
                fill={i % 2 === 0 ? C.cyan : C.violet}
                opacity="0">{i % 2 === 0 ? '0' : '1'}</text>
            ))}
          </g>

          {/* ─────────────────────────────────────────────────────────────
              STAGE 6 — Optical lens + laser zigzag
              Positioned: centre
          ───────────────────────────────────────────────────────────── */}
          <g id="jny-lens-group">
            {/* Lens shape — biconvex */}
            <g id="jny-lens" filter="url(#glow-cyan)">
              {/* Left arc */}
              <path d="M460,220 Q390,300 460,380"
                fill="none" stroke={C.cyan} strokeWidth="2" opacity="0.8" />
              {/* Right arc */}
              <path d="M540,220 Q610,300 540,380"
                fill="none" stroke={C.cyan} strokeWidth="2" opacity="0.8" />
              {/* Fill */}
              <path d="M460,220 Q390,300 460,380 Q500,400 540,380 Q610,300 540,220 Q500,200 460,220Z"
                fill={C.cyan} opacity="0.07" />
              {/* Optical axis */}
              <line x1="200" y1="300" x2="800" y2="300"
                stroke={C.parchment} strokeWidth="0.7" strokeDasharray="8 4" opacity="0.4" />
            </g>

            {/* Laser beam — shoots down and zigzags */}
            <path id="jny-laser-beam"
              d="M500,0 L500,220 L460,300 L540,300 L500,380 L500,600"
              fill="none" stroke="url(#laser-grad)" strokeWidth="2.5"
              filter="url(#glow-cyan)"
              strokeDasharray="500" strokeDashoffset="500" />

            {/* Laser entry glow dot */}
            <circle cx="500" cy="18" r="6"
              fill={C.cyan} opacity="0.9" filter="url(#glow-cyan)" />
          </g>

          {/* ─────────────────────────────────────────────────────────────
              STAGE 7 — Padlock → Shield
              Positioned: centre
          ───────────────────────────────────────────────────────────── */}
          <g id="jny-shield-group">
            {/* Hit flash */}
            <rect id="jny-hit-flash" x="0" y="0" width="1000" height="600"
              fill="white" opacity="0" />

            {/* Padlock */}
            <g id="jny-padlock" transform="translate(500,300)">
              {/* Shackle */}
              <path d="M-28,-50 Q-28,-90 0,-90 Q28,-90 28,-50 L28,-25 L-28,-25Z"
                fill="none" stroke={C.parchment} strokeWidth="5" strokeLinecap="round" />
              {/* Body */}
              <rect x="-40" y="-25" width="80" height="65"
                rx="6" fill={C.espresso} stroke={C.parchment} strokeWidth="2" />
              {/* Keyhole */}
              <circle cx="0" cy="15" r="9"
                fill="none" stroke={C.parchment} strokeWidth="1.5" />
              <line x1="0" y1="24" x2="0" y2="38"
                stroke={C.parchment} strokeWidth="1.5" />
            </g>

            {/* Shield (hidden until morph) */}
            <g id="jny-shield" transform="translate(500,300)" filter="url(#glow-cyan)">
              <path d="M0,-90 L70,-60 L70,10 Q70,70 0,95 Q-70,70 -70,10 L-70,-60Z"
                fill="url(#shield-grad)" opacity="0.3" />
              <path d="M0,-90 L70,-60 L70,10 Q70,70 0,95 Q-70,70 -70,10 L-70,-60Z"
                fill="none" stroke={C.cyan} strokeWidth="2.5" />
              {/* Check mark inside shield */}
              <path d="M-25,10 L-8,28 L30,-15"
                fill="none" stroke={C.cyan} strokeWidth="3" strokeLinecap="round" />
            </g>

            {/* Expanding ring pulses */}
            {[0, 1, 2].map(i => (
              <circle key={i} className="jny-shield-ring"
                cx="500" cy="300" r="50"
                fill="none" stroke={C.cyan} strokeWidth="1.5" opacity="0" />
            ))}
          </g>
        </svg>
      </div>

      {/* ── Text Layer ────────────────────────────────────────────────────── */}
      <div
        className="relative z-10 pointer-events-none"
        style={{ marginTop: '-100vh' }}
      >
        {BLOCKS.map((block, i) => (
          <div
            key={i}
            className="jny-text-block relative flex items-center"
            style={{
              minHeight: '100vh',
              padding: '0 clamp(24px, 8vw, 120px)',
              justifyContent: i % 2 === 0 ? 'flex-start' : 'flex-end',
            }}
          >
            <div
              className="max-w-[420px] pointer-events-auto"
              style={{
                paddingLeft:  i % 2 === 0 ? 0     : '0',
                paddingRight: i % 2 !== 0 ? 0 : '0',
              }}
            >
              {/* Year tag */}
              <span
                className="block mb-4 tracking-[0.2em] uppercase"
                style={{
                  fontFamily: 'Georgia, "Cormorant Garamond", serif',
                  fontSize: 'clamp(10px, 1.1vw, 13px)',
                  color: C.parchment,
                  opacity: 0.6,
                  letterSpacing: '0.22em',
                }}
              >
                {block.year}
              </span>

              {/* Rule */}
              <div
                style={{
                  width: 32,
                  height: 1,
                  background: C.parchment,
                  opacity: 0.35,
                  marginBottom: 20,
                }}
              />

              {/* Title */}
              <h3
                style={{
                  fontFamily: 'Georgia, "Cormorant Garamond", serif',
                  fontWeight: 400,
                  fontSize: 'clamp(22px, 2.8vw, 36px)',
                  color: C.white,
                  lineHeight: 1.25,
                  marginBottom: 16,
                  letterSpacing: '-0.01em',
                }}
              >
                {block.title}
              </h3>

              {/* Body */}
              <p
                style={{
                  fontFamily: 'var(--font-body), system-ui, sans-serif',
                  fontSize: 'clamp(13px, 1.15vw, 15px)',
                  color: C.parchment,
                  opacity: 0.72,
                  lineHeight: 1.75,
                  maxWidth: 400,
                }}
              >
                {block.body}
              </p>

              {/* Block number indicator */}
              <div
                style={{
                  marginTop: 28,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 10,
                    color: C.cyan,
                    opacity: 0.5,
                    letterSpacing: '0.1em',
                  }}
                >
                  {String(i + 1).padStart(2, '0')} / 07
                </span>
                <div style={{ flex: 1, maxWidth: 60, height: 1, background: C.cyan, opacity: 0.2 }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Vertical progress rail ────────────────────────────────────────── */}
      <div
        className="fixed left-5 top-1/2 -translate-y-1/2 z-20 pointer-events-none"
        style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
      >
        {BLOCKS.map((_, i) => (
          <div
            key={i}
            style={{
              width: 3, height: 3, borderRadius: '50%',
              background: C.parchment, opacity: 0.3,
            }}
          />
        ))}
      </div>
    </section>
  );
}
