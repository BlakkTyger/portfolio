'use client'

interface GraphicProps {
  isHovered: boolean;
  onHoverChange?: (h: boolean) => void;
}
const hh = (cb?: (h: boolean) => void) => ({
  onMouseEnter: () => cb?.(true),
  onMouseLeave: () => cb?.(false),
});

// ---- Quantum Symbols ---- (shifted down slightly to balance spacing)
const QS = [
  { s: 'ψ', x: '18%', y: '25%', sz: '2.4rem', d: '0s', dur: '12s', c: 'var(--spectral-violet, #8F00FF)', a: 'whoami-drift-1' },
  { s: 'χ', x: '82%', y: '35%', sz: '2.0rem', d: '2s', dur: '10s', c: 'var(--terminal-cyan, #00FF9D)', a: 'whoami-drift-2' },
  { s: '|0⟩', x: '28%', y: '75%', sz: '1.4rem', d: '1s', dur: '14s', c: 'var(--spectral-violet, #8F00FF)', a: 'whoami-drift-3' },
  { s: '|1⟩', x: '72%', y: '15%', sz: '1.4rem', d: '3s', dur: '11s', c: 'var(--terminal-cyan, #00FF9D)', a: 'whoami-drift-1' },
  { s: 'ℏ', x: '50%', y: '48%', sz: '2.2rem', d: '1.5s', dur: '13s', c: 'var(--quantum-purple, #A855F7)', a: 'whoami-drift-2' },
  { s: '⟨φ|', x: '82%', y: '72%', sz: '1.2rem', d: '4s', dur: '16s', c: 'var(--terminal-cyan, #00FF9D)', a: 'whoami-drift-3' },
];

export function QuantumSymbolsCloud({ isHovered, onHoverChange }: GraphicProps) {
  return <>
    {QS.map((q, i) => (
      <span key={i}
        className={`absolute font-mono select-none pointer-events-auto cursor-default transition-all duration-500 ${q.a} ${isHovered ? 'whoami-quantum-active' : ''}`}
        style={{
          left: q.x, top: q.y, fontSize: q.sz, color: q.c, animationDelay: q.d, animationDuration: q.dur,
          filter: `drop-shadow(0 0 ${isHovered ? '20px' : '6px'} ${q.c})`, opacity: isHovered ? 1 : 0.65
        }}
        {...hh(onHoverChange)}
      >{q.s}</span>
    ))}
  </>;
}

// ---- New Cavity QED Standalone Graphic ---- (positioned to the right of "Who Am I" heading)
export function CavityQEDGraphic({ isHovered, onHoverChange }: GraphicProps) {
  return (
    <div className="absolute pointer-events-auto cursor-pointer transition-all duration-500"
      style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '260px', height: '100px', opacity: isHovered ? 1 : 0.6 }}
      {...hh(onHoverChange)}>
      <svg viewBox="0 0 180 60" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="mirrorGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#888" />
            <stop offset="50%" stopColor="#ddd" />
            <stop offset="100%" stopColor="#555" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Left Curved Mirror */}
        <path d="M 20 5 C 12 15 12 45 20 55 L 14 55 C 6 45 6 15 14 5 Z" fill="url(#mirrorGrad)" stroke="#666" strokeWidth="1" />

        {/* Right Curved Mirror */}
        <path d="M 160 5 C 168 15 168 45 160 55 L 166 55 C 174 45 174 15 166 5 Z" fill="url(#mirrorGrad)" stroke="#666" strokeWidth="1" />

        {/* Standing Wave / Resonant Laser Mode (Multiple overlapping transparent paths) */}
        <g filter="url(#glow)">
          <path d="M 20 30 Q 37.5 5 55 30 T 90 30 T 125 30 T 160 30"
            fill="none" stroke="var(--terminal-cyan, #00FF9D)" strokeWidth={isHovered ? 2.5 : 1.8} opacity="0.8" />
          <path d="M 20 30 Q 37.5 55 55 30 T 90 30 T 125 30 T 160 30"
            fill="none" stroke="var(--spectral-violet, #8F00FF)" strokeWidth={isHovered ? 2 : 1.4} opacity="0.75" />
          {isHovered && (
            <path d="M 20 30 Q 37.5 30 55 30 T 90 30 T 125 30 T 160 30"
              fill="none" stroke="#fff" strokeWidth="1" opacity="0.6" strokeDasharray="5 5">
              <animate attributeName="stroke-dashoffset" values="10;0" dur="0.5s" repeatCount="indefinite" />
            </path>
          )}
        </g>

        {/* Atom at center of cavity */}
        <circle cx="90" cy="30" r="4.5" fill={isHovered ? '#fff' : 'var(--terminal-cyan, #00FF9D)'} filter="url(#glow)" className="transition-all duration-300">
          {isHovered && <animate attributeName="r" values="4.5;7;4.5" dur="1.2s" repeatCount="indefinite" />}
        </circle>

        {/* Energy state transition arrows */}
        <g opacity={isHovered ? 0.95 : 0.5} className="transition-opacity duration-300">
          <path d="M 90 12 L 90 22 M 90 22 L 87 19 M 90 22 L 93 19" fill="none" stroke="var(--spectral-violet, #8F00FF)" strokeWidth="1" />
          <path d="M 90 48 L 90 38 M 90 38 L 87 41 M 90 38 L 93 41" fill="none" stroke="var(--spectral-violet, #8F00FF)" strokeWidth="1" />
        </g>
      </svg>
    </div>
  );
}

// ---- Bloch Sphere ---- (shifted down slightly to balance spacing)
export function BlochSphereGraphic({ isHovered, onHoverChange }: GraphicProps) {
  return (
    <div className="absolute pointer-events-auto cursor-pointer transition-all duration-500"
      style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '220px', height: '220px', opacity: isHovered ? 1 : 0.65 }}
      {...hh(onHoverChange)}>
      <svg viewBox="0 0 150 150" className="w-full h-full">
        <circle cx="75" cy="75" r="60" fill="none" stroke="var(--terminal-cyan, #00FF9D)" strokeWidth="1.5" opacity="0.45" />
        <ellipse cx="75" cy="75" rx="60" ry="18" fill="none" stroke="var(--terminal-cyan, #00FF9D)" strokeWidth="1" opacity="0.25" strokeDasharray="6 4" />
        <ellipse cx="75" cy="75" rx="18" ry="60" fill="none" stroke="var(--terminal-cyan, #00FF9D)" strokeWidth="1" opacity="0.2" strokeDasharray="6 4" />
        <line x1="75" y1="12" x2="75" y2="138" stroke="var(--terminal-cyan, #00FF9D)" strokeWidth="1" opacity="0.25" />
        <line x1="12" y1="75" x2="138" y2="75" stroke="var(--terminal-cyan, #00FF9D)" strokeWidth="1" opacity="0.25" />
        <text x="80" y="12" fontSize="9" fill="var(--terminal-cyan, #00FF9D)" opacity="0.5" fontFamily="monospace">|0⟩</text>
        <text x="80" y="145" fontSize="9" fill="var(--terminal-cyan, #00FF9D)" opacity="0.5" fontFamily="monospace">|1⟩</text>
        <g style={{ transformOrigin: '75px 75px', animation: `whoami-bloch-rotate ${isHovered ? '3s' : '10s'} linear infinite` }}>
          <line x1="75" y1="75" x2="110" y2="35" stroke="var(--spectral-violet, #8F00FF)" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="110" cy="35" r="3.5" fill="var(--spectral-violet, #8F00FF)">
            {isHovered && <animate attributeName="r" values="3.5;6;3.5" dur="1s" repeatCount="indefinite" />}
          </circle>
        </g>
        <circle cx="75" cy="75" r="2" fill="var(--terminal-cyan, #00FF9D)" opacity="0.6" />
        {isHovered && <circle cx="75" cy="75" r="65" fill="none" stroke="var(--spectral-violet, #8F00FF)" strokeWidth="1.2" opacity="0.45" className="animate-pulse" />}
      </svg>
    </div>
  );
}

// ---- Neural Network ---- (shifted left to 26% to create text edge overlap)
const NN = [
  { x: 25, y: 35 }, { x: 25, y: 85 }, { x: 25, y: 135 },
  { x: 80, y: 20 }, { x: 80, y: 65 }, { x: 80, y: 110 }, { x: 80, y: 155 },
  { x: 135, y: 40 }, { x: 135, y: 90 }, { x: 135, y: 140 },
  { x: 190, y: 65 }, { x: 190, y: 115 },
];
const NE: [number, number][] = [
  [0, 3], [0, 4], [0, 5], [1, 3], [1, 4], [1, 5], [1, 6], [2, 4], [2, 5], [2, 6],
  [3, 7], [3, 8], [4, 7], [4, 8], [4, 9], [5, 8], [5, 9], [6, 8], [6, 9],
  [7, 10], [7, 11], [8, 10], [8, 11], [9, 10], [9, 11],
];

export function NeuralNetworkGraphic({ isHovered, onHoverChange }: GraphicProps) {
  return (
    <div className="absolute pointer-events-auto cursor-pointer transition-all duration-500"
      style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '240px', height: '220px', opacity: isHovered ? 1 : 0.55 }}
      {...hh(onHoverChange)}>
      <svg viewBox="0 0 215 175" className="w-full h-full">
        {NE.map(([f, t], i) => {
          const a = NN[f], b = NN[t];
          return <g key={i}>
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={isHovered ? 'var(--quantum-purple, #A855F7)' : 'rgba(168,85,247,0.4)'}
              strokeWidth={isHovered ? 1.8 : 1} className="transition-all duration-500" />
            {isHovered && <line x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke="var(--terminal-cyan, #00FF9D)" strokeWidth={1.8}
              className="whoami-signal" style={{ animationDelay: `${(i * 0.15) % 2}s` }} />}
          </g>;
        })}
        {NN.map((n, i) => <circle key={i} cx={n.x} cy={n.y}
          r={i === 4 || i === 8 ? 6.5 : 4.5}
          fill={isHovered ? 'var(--quantum-purple, #A855F7)' : 'rgba(168,85,247,0.5)'}
          className="transition-all duration-500">
          {(i === 4 || i === 8) && isHovered && <animate attributeName="r" values="6.5;9;6.5" dur="1.5s" repeatCount="indefinite" />}
        </circle>)}
      </svg>
    </div>
  );
}

// ---- Philosophy Book ---- (positioned on the bottom left, below paragraph 2 & 3)
export function PhilosophyBookGraphic({ isHovered, onHoverChange }: GraphicProps) {
  return (
    <div className={`absolute pointer-events-auto cursor-pointer transition-all duration-700 ${isHovered ? 'scale-105' : ''}`}
      style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '200px', height: '230px', opacity: isHovered ? 1 : 0.5 }}
      {...hh(onHoverChange)}>
      <svg viewBox="0 0 140 160" className="w-full h-full overflow-visible">
        <rect x="65" y="20" width="8" height="120" rx="2" fill="#2a1a30" stroke="var(--quantum-purple, #A855F7)" strokeWidth="1" opacity="0.6" />
        <path d="M 65 20 L 15 25 L 15 135 L 65 140 Z" fill="#160e1b" stroke="var(--quantum-purple, #A855F7)" strokeWidth="1" opacity="0.6"
          className={isHovered ? 'whoami-page-flutter' : ''} style={{ transformOrigin: '65px 80px' }} />
        <path d="M 73 20 L 125 25 L 125 135 L 73 140 Z" fill="#160e1b" stroke="var(--quantum-purple, #A855F7)" strokeWidth="1" opacity="0.6"
          className={isHovered ? 'whoami-page-flutter' : ''} style={{ transformOrigin: '73px 80px', animationDelay: '0.5s', animationDirection: 'reverse' }} />
        {[40, 52, 64, 76, 88, 100, 112].map((y, i) => <g key={i}>
          <line x1="25" y1={y} x2="58" y2={y - 1} stroke="rgba(168,85,247,0.22)" strokeWidth="1" />
          <line x1="80" y1={y - 1} x2="118" y2={y} stroke="rgba(168,85,247,0.22)" strokeWidth="1" />
        </g>)}
        {isHovered && ['∃', '∀', 'Σ', '∞'].map((sym, i) =>
          <text key={i} x={30 + i * 25} y={10} fontSize="12" fill="var(--quantum-purple, #A855F7)" opacity="0.65"
            className="whoami-drift-2" style={{ animationDelay: `${i * 0.4}s`, animationDuration: '4s' }}>{sym}</text>
        )}
      </svg>
    </div>
  );
}

// ---- Premium Realistic Coffee Cup ---- (shifted up slightly to bottom: 12% to balance reduced gaps)
export function CoffeeCupGraphic({ isHovered, onHoverChange }: GraphicProps) {
  return (
    <div className="absolute pointer-events-auto cursor-pointer transition-all duration-500"
      style={{ left: '50%', top: '50%', transform: 'translate(-50%, -46%)', width: '260px', height: '320px' }}
      {...hh(onHoverChange)}>
      <svg viewBox="0 0 320 400" className="w-full h-full overflow-visible">
        <defs>
          {/* Royal Obsidian/Navy Ceramic Gradient */}
          <linearGradient id="ceramicObsidian" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1e2235" />
            <stop offset="30%" stopColor="#0f111c" />
            <stop offset="70%" stopColor="#06070a" />
            <stop offset="100%" stopColor="#010204" />
          </linearGradient>

          {/* Premium Royal Gold Metallic Gradient */}
          <linearGradient id="royalGold" x1="0" y1="0" x2="1" y2="0.4">
            <stop offset="0%" stopColor="#c5a059" />
            <stop offset="20%" stopColor="#fdf3cd" />
            <stop offset="40%" stopColor="#d4af37" />
            <stop offset="60%" stopColor="#fdf3cd" />
            <stop offset="80%" stopColor="#b59049" />
            <stop offset="100%" stopColor="#996515" />
          </linearGradient>

          {/* Crema / Espresso surface gradient */}
          <radialGradient id="espressoSurface" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
            <stop offset="0%" stopColor="#4a2e1b" />
            <stop offset="60%" stopColor="#2c160a" />
            <stop offset="100%" stopColor="#120803" />
          </radialGradient>

          <filter id="softGlow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Saucer shadow */}
        <ellipse cx="160" cy="335" rx="100" ry="14" fill="rgba(0,0,0,0.65)" filter="url(#softGlow)" />

        {/* Saucer Outer Gold Rim */}
        <ellipse cx="160" cy="330" rx="105" ry="20" fill="url(#royalGold)" />

        {/* Saucer Obsidian Plate Body */}
        <ellipse cx="160" cy="330" rx="101" ry="17" fill="url(#ceramicObsidian)" />

        {/* Saucer Inner Gold Accent Ring */}
        <ellipse cx="160" cy="330" rx="65" ry="10" fill="none" stroke="url(#royalGold)" strokeWidth="1" opacity="0.6" />

        {/* Cup Handle (Gold, layered behind the cup body) */}
        <path d="M 235 210 C 275 210 285 275 230 285" fill="none" stroke="url(#royalGold)" strokeWidth="11" strokeLinecap="round" />
        <path d="M 235 210 C 275 210 285 275 230 285" fill="none" stroke="#000" strokeWidth="3" opacity="0.15" strokeLinecap="round" />

        {/* Cup base stand (Gold) */}
        <ellipse cx="160" cy="302" rx="46" ry="8" fill="url(#royalGold)" />

        {/* Cup base stand (Obsidian inner) */}
        <ellipse cx="160" cy="301" rx="43" ry="6" fill="url(#ceramicObsidian)" />

        {/* Cup Body (Ceramic Obsidian) */}
        <path d="M 75 180 C 75 275 110 300 160 300 C 210 300 245 275 245 180 Z" fill="url(#ceramicObsidian)" stroke="#0e101a" strokeWidth="0.5" />

        {/* Cup Body Gold Rim (Rim outline) */}
        <ellipse cx="160" cy="180" rx="85" ry="18" fill="url(#royalGold)" />

        {/* Inside Cup Rim (Obsidian Inner Wall) */}
        <ellipse cx="160" cy="180" rx="82" ry="15" fill="#0d0e14" />

        {/* Espresso Liquid Level */}
        <ellipse cx="160" cy="184" rx="77" ry="12" fill="url(#espressoSurface)" />

        {/* Quantum Swirl Latte Art (Gold-tinted Crema Waves) */}
        <g opacity={isHovered ? 0.95 : 0.75} className="transition-opacity duration-300">
          {/* Swirling Quantum Probabilistic Wave */}
          <path d="M 160 184 C 190 180 215 188 175 192 C 135 196 115 178 160 176 C 205 174 210 192 165 190 C 130 188 140 180 160 182"
            fill="none" stroke="#ffe0b2" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M 160 184 C 190 180 215 188 175 192 C 135 196 115 178 160 176 C 205 174 210 192 165 190 C 130 188 140 180 160 182"
            fill="none" stroke="url(#royalGold)" strokeWidth="1" strokeLinecap="round" opacity="0.7" />

          {/* Small orbital particle details */}
          <circle cx="130" cy="183" r="1.5" fill="#ffe0b2" opacity="0.6" />
          <circle cx="195" cy="186" r="1" fill="#ffe0b2" opacity="0.6" />
          <circle cx="170" cy="179" r="0.8" fill="#ffe0b2" opacity="0.4" />
        </g>

        {/* Glass gloss/reflection overlay on cup side (makes it look 3D and shiny) */}
        <path d="M 85 190 C 85 245 110 282 135 293 C 115 285 98 250 98 190 Z" fill="#ffffff" opacity="0.08" />

        {/* Animated Steam rising from coffee cup */}
        <g opacity={isHovered ? 0.6 : 0.3} className="transition-opacity duration-500">
          {[0, 1, 2].map(i => (
            <path key={i}
              d={`M ${135 + i * 25} 165 C ${128 + i * 25 + (i % 2 ? 8 : -8)} 135 ${142 + i * 25 + (i % 2 ? -7 : 7)} 105 ${135 + i * 25} 70`}
              fill="none" stroke="#ffe0b2" strokeWidth="1.8" strokeLinecap="round"
              className="whoami-steam" style={{ animationDelay: `${i * 0.6}s`, animationDuration: `${2.4 + i * 0.3}s` }} />
          ))}
        </g>

        {/* Floating aroma/sparkle particles (royal physics accent) */}
        <g opacity={isHovered ? 1 : 0.4} className="transition-all duration-500">
          {[{ x: 120, y: 140, r: 1.5, d: '0s' }, { x: 190, y: 110, r: 2, d: '1s' }, { x: 155, y: 95, r: 1.2, d: '0.5s' }, { x: 210, y: 150, r: 1, d: '1.5s' }].map((pt, i) => (
            <circle key={i} cx={pt.x} cy={pt.y} r={pt.r} fill="url(#royalGold)" className="whoami-drift-1" style={{ animationDelay: pt.d, animationDuration: '6s' }} />
          ))}
        </g>
      </svg>
    </div>
  );
}
