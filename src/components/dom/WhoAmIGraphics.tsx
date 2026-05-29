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
  { s: 'ψ', x: '82%', y: '22%', sz: '2.4rem', d: '0s', dur: '12s', c: 'var(--spectral-violet)', a: 'whoami-drift-1' },
  { s: 'χ', x: '94%', y: '28%', sz: '2.0rem', d: '2s', dur: '10s', c: 'var(--terminal-cyan)', a: 'whoami-drift-2' },
  { s: '|0⟩', x: '85%', y: '38%', sz: '1.4rem', d: '1s', dur: '14s', c: 'var(--spectral-violet)', a: 'whoami-drift-3' },
  { s: '|1⟩', x: '91%', y: '12%', sz: '1.4rem', d: '3s', dur: '11s', c: 'var(--terminal-cyan)', a: 'whoami-drift-1' },
  { s: 'ℏ', x: '88%', y: '26%', sz: '2.2rem', d: '1.5s', dur: '13s', c: 'var(--quantum-purple)', a: 'whoami-drift-2' },
  { s: '⟨φ|', x: '95%', y: '18%', sz: '1.2rem', d: '4s', dur: '16s', c: 'var(--terminal-cyan)', a: 'whoami-drift-3' },
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
      style={{ left: '38%', top: '13.8%', width: '180px', height: '60px', opacity: isHovered ? 1 : 0.6 }}
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
            fill="none" stroke="var(--terminal-cyan)" strokeWidth={isHovered ? 2.5 : 1.8} opacity="0.8" />
          <path d="M 20 30 Q 37.5 55 55 30 T 90 30 T 125 30 T 160 30"
            fill="none" stroke="var(--spectral-violet)" strokeWidth={isHovered ? 2 : 1.4} opacity="0.75" />
          {isHovered && (
            <path d="M 20 30 Q 37.5 30 55 30 T 90 30 T 125 30 T 160 30"
              fill="none" stroke="#fff" strokeWidth="1" opacity="0.6" strokeDasharray="5 5">
              <animate attributeName="stroke-dashoffset" values="10;0" dur="0.5s" repeatCount="indefinite" />
            </path>
          )}
        </g>

        {/* Atom at center of cavity */}
        <circle cx="90" cy="30" r="4.5" fill={isHovered ? '#fff' : 'var(--terminal-cyan)'} filter="url(#glow)" className="transition-all duration-300">
          {isHovered && <animate attributeName="r" values="4.5;7;4.5" dur="1.2s" repeatCount="indefinite" />}
        </circle>

        {/* Energy state transition arrows */}
        <g opacity={isHovered ? 0.95 : 0.5} className="transition-opacity duration-300">
          <path d="M 90 12 L 90 22 M 90 22 L 87 19 M 90 22 L 93 19" fill="none" stroke="var(--spectral-violet)" strokeWidth="1" />
          <path d="M 90 48 L 90 38 M 90 38 L 87 41 M 90 38 L 93 41" fill="none" stroke="var(--spectral-violet)" strokeWidth="1" />
        </g>
      </svg>
    </div>
  );
}

// ---- Bloch Sphere ---- (shifted down slightly to balance spacing)
export function BlochSphereGraphic({ isHovered, onHoverChange }: GraphicProps) {
  return (
    <div className="absolute pointer-events-auto cursor-pointer transition-all duration-500"
      style={{ right: '4%', top: '12%', width: '130px', height: '130px', opacity: isHovered ? 1 : 0.6 }}
      {...hh(onHoverChange)}>
      <svg viewBox="0 0 150 150" className="w-full h-full">
        <circle cx="75" cy="75" r="60" fill="none" stroke="var(--terminal-cyan)" strokeWidth="1.5" opacity="0.45" />
        <ellipse cx="75" cy="75" rx="60" ry="18" fill="none" stroke="var(--terminal-cyan)" strokeWidth="1" opacity="0.25" strokeDasharray="6 4" />
        <ellipse cx="75" cy="75" rx="18" ry="60" fill="none" stroke="var(--terminal-cyan)" strokeWidth="1" opacity="0.2" strokeDasharray="6 4" />
        <line x1="75" y1="12" x2="75" y2="138" stroke="var(--terminal-cyan)" strokeWidth="1" opacity="0.25" />
        <line x1="12" y1="75" x2="138" y2="75" stroke="var(--terminal-cyan)" strokeWidth="1" opacity="0.25" />
        <text x="80" y="12" fontSize="9" fill="var(--terminal-cyan)" opacity="0.5" fontFamily="monospace">|0⟩</text>
        <text x="80" y="145" fontSize="9" fill="var(--terminal-cyan)" opacity="0.5" fontFamily="monospace">|1⟩</text>
        <g style={{ transformOrigin: '75px 75px', animation: `whoami-bloch-rotate ${isHovered ? '3s' : '10s'} linear infinite` }}>
          <line x1="75" y1="75" x2="110" y2="35" stroke="var(--spectral-violet)" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="110" cy="35" r="3.5" fill="var(--spectral-violet)">
            {isHovered && <animate attributeName="r" values="3.5;6;3.5" dur="1s" repeatCount="indefinite" />}
          </circle>
        </g>
        <circle cx="75" cy="75" r="2" fill="var(--terminal-cyan)" opacity="0.6" />
        {isHovered && <circle cx="75" cy="75" r="65" fill="none" stroke="var(--spectral-violet)" strokeWidth="1.2" opacity="0.45" className="animate-pulse" />}
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
      style={{ right: '26%', top: '38%', width: '165px', height: '150px', opacity: isHovered ? 1 : 0.55 }}
      {...hh(onHoverChange)}>
      <svg viewBox="0 0 215 175" className="w-full h-full">
        {NE.map(([f, t], i) => {
          const a = NN[f], b = NN[t];
          return <g key={i}>
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={isHovered ? 'var(--quantum-purple)' : 'rgba(168,85,247,0.4)'}
              strokeWidth={isHovered ? 1.8 : 1} className="transition-all duration-500" />
            {isHovered && <line x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke="var(--terminal-cyan)" strokeWidth={1.8}
              className="whoami-signal" style={{ animationDelay: `${(i * 0.15) % 2}s` }} />}
          </g>;
        })}
        {NN.map((n, i) => <circle key={i} cx={n.x} cy={n.y}
          r={i === 4 || i === 8 ? 6.5 : 4.5}
          fill={isHovered ? 'var(--quantum-purple)' : 'rgba(168,85,247,0.5)'}
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
      style={{ left: '4%', bottom: '4%', width: '120px', height: '140px', opacity: isHovered ? 1 : 0.5 }}
      {...hh(onHoverChange)}>
      <svg viewBox="0 0 140 160" className="w-full h-full overflow-visible">
        <rect x="65" y="20" width="8" height="120" rx="2" fill="#2a1a30" stroke="var(--quantum-purple)" strokeWidth="1" opacity="0.6" />
        <path d="M 65 20 L 15 25 L 15 135 L 65 140 Z" fill="#160e1b" stroke="var(--quantum-purple)" strokeWidth="1" opacity="0.6"
          className={isHovered ? 'whoami-page-flutter' : ''} style={{ transformOrigin: '65px 80px' }} />
        <path d="M 73 20 L 125 25 L 125 135 L 73 140 Z" fill="#160e1b" stroke="var(--quantum-purple)" strokeWidth="1" opacity="0.6"
          className={isHovered ? 'whoami-page-flutter' : ''} style={{ transformOrigin: '73px 80px', animationDelay: '0.5s', animationDirection: 'reverse' }} />
        {[40, 52, 64, 76, 88, 100, 112].map((y, i) => <g key={i}>
          <line x1="25" y1={y} x2="58" y2={y - 1} stroke="rgba(168,85,247,0.22)" strokeWidth="1" />
          <line x1="80" y1={y - 1} x2="118" y2={y} stroke="rgba(168,85,247,0.22)" strokeWidth="1" />
        </g>)}
        {isHovered && ['∃', '∀', 'Σ', '∞'].map((sym, i) =>
          <text key={i} x={30 + i * 25} y={10} fontSize="12" fill="var(--quantum-purple)" opacity="0.65"
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
      style={{ right: '0%', bottom: '12%', width: '310px', height: '390px' }}
      {...hh(onHoverChange)}>
      <svg viewBox="0 0 320 400" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="metallicKettle" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8e8e93" />
            <stop offset="25%" stopColor="#c7c7cc" />
            <stop offset="50%" stopColor="#aeaeae" />
            <stop offset="75%" stopColor="#5b5b5c" />
            <stop offset="100%" stopColor="#3a3a3c" />
          </linearGradient>
          <linearGradient id="ceramicCup" x1="0" y1="0" x2="1" y2="0.6">
            <stop offset="0%" stopColor="#2c1e17" />
            <stop offset="40%" stopColor="#3d2a20" />
            <stop offset="70%" stopColor="#241812" />
            <stop offset="100%" stopColor="#140d0a" />
          </linearGradient>
          <linearGradient id="espressoLiquid" x1="0" y1="0" x2="1" y2="0.3">
            <stop offset="0%" stopColor="#2b1a13" />
            <stop offset="50%" stopColor="#4e342e" />
            <stop offset="100%" stopColor="#1d0f0a" />
          </linearGradient>
          <linearGradient id="coffeeStreamGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8d6e63" />
            <stop offset="50%" stopColor="#d7ccc8" />
            <stop offset="100%" stopColor="#5d4037" />
          </linearGradient>
        </defs>

        {/* Kettle */}
        <g style={{
          transform: isHovered ? 'rotate(-30deg)' : 'rotate(-16deg)', transformOrigin: '85px 100px',
          transition: 'transform 0.85s cubic-bezier(0.25, 1, 0.5, 1)'
        }}>
          <path d="M 55 65 Q 53 68 52 130 Q 52 145 68 145 L 102 145 Q 118 145 118 130 L 116 65 Z"
            fill="url(#metallicKettle)" stroke="#6c6c70" strokeWidth="1.2" />
          <ellipse cx="85" cy="62" rx="32" ry="7" fill="#8e8e93" stroke="#6c6c70" strokeWidth="1" />
          <rect x="79" y="50" width="12" height="7" rx="2" fill="#3a3a3c" />
          <circle cx="85" cy="48" r="4.5" fill="#2c2c2e" />
          <path d="M 118 85 Q 132 82 142 70 Q 154 54 156 38 Q 158 28 153 22"
            fill="none" stroke="url(#metallicKettle)" strokeWidth="6.5" strokeLinecap="round" />
          <path d="M 118 85 Q 132 82 142 70 Q 154 54 156 38 Q 158 28 153 22"
            fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 55 78 Q 26 80 23 108 Q 22 125 38 132 Q 46 135 55 130"
            fill="none" stroke="#2c2c2e" strokeWidth="5.5" strokeLinecap="round" />
        </g>

        {/* Pour Stream */}
        <g opacity={isHovered ? 1 : 0.5} className="transition-opacity duration-500">
          <path d="M 154 34 Q 170 80 182 140 Q 190 190 188 248"
            fill="none" stroke="url(#coffeeStreamGrad)" strokeWidth={isHovered ? 4.5 : 3} strokeLinecap="round" className="transition-all duration-500" />
          <path d="M 154 34 Q 170 80 182 140 Q 190 190 188 248"
            fill="none" stroke="#ffe0b2" strokeWidth="1.2" strokeDasharray="4 9" strokeLinecap="round" opacity="0.7">
            <animate attributeName="stroke-dashoffset" values="13;0" dur="0.25s" repeatCount="indefinite" />
          </path>
          <path d="M 155 36 Q 171 82 183 142 Q 191 190 189 246"
            fill="none" stroke="#d7ccc8" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
          {[0, 1, 2].map(i => (
            <circle key={i} r={0.7 + i * 0.2} fill="#ffcc80" opacity="0.6">
              <animateMotion dur={`${0.6 + i * 0.12}s`} begin={`${i * 0.2}s`} repeatCount="indefinite"
                path="M 154 34 Q 170 80 182 140 Q 190 190 188 248" />
            </circle>
          ))}
        </g>

        {/* Splash */}
        {[0, 1].map(i => (
          <ellipse key={i} cx="188" cy="252" rx="2" ry="0.8" fill="none" stroke="#ffe0b2" strokeWidth="0.8" opacity="0.6">
            <animate attributeName="rx" values="2;22" dur={`${1.1 + i * 0.3}s`} begin={`${i * 0.4}s`} repeatCount="indefinite" />
            <animate attributeName="ry" values="0.8;6.5" dur={`${1.1 + i * 0.3}s`} begin={`${i * 0.4}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0" dur={`${1.1 + i * 0.3}s`} begin={`${i * 0.4}s`} repeatCount="indefinite" />
          </ellipse>
        ))}

        {isHovered && [0, 1, 2, 3].map(i => {
          const angle = (i / 4) * Math.PI * 2 + 0.5;
          return (
            <circle key={`splash${i}`} cx={188} cy={252} r={1.2} fill="#ffe0b2">
              <animate attributeName="cx" values={`188;${188 + Math.cos(angle) * 14}`} dur="0.6s" repeatCount="indefinite" />
              <animate attributeName="cy" values={`252;${252 + Math.sin(angle) * 7 - 5}`} dur="0.6s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0" dur="0.6s" repeatCount="indefinite" />
            </circle>
          );
        })}

        {/* Cup */}
        <ellipse cx="188" cy="358" rx="102" ry="18" fill="#140d0a" stroke="#d7ccc8" strokeWidth="1.5" />
        <ellipse cx="188" cy="356" rx="80" ry="12" fill="#1c120e" opacity="0.6" />
        <path d="M 132 252 C 130 326 150 342 188 342 C 226 342 246 326 244 252 Z"
          fill="url(#ceramicCup)" stroke="#d7ccc8" strokeWidth="2" />
        <path d="M 132 252 C 150 255 226 255 244 252" fill="none" stroke="#ffcc80" strokeWidth="1" opacity="0.4" />
        <path d="M 144 265 C 142 312 150 328 166 334" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" strokeLinecap="round" />
        <path d="M 244 268 C 272 265 276 310 244 308" fill="none" stroke="#d7ccc8" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 246 274 C 264 272 266 302 246 301" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1.2" strokeLinecap="round" />
        <ellipse cx="188" cy="252" rx="58" ry="18" fill="#321e16" stroke="#d7ccc8" strokeWidth="2" />
        <ellipse cx="188" cy="254" rx="52" ry="15" fill="url(#espressoLiquid)" />
        <ellipse cx="176" cy="250" rx="18" ry="4.5" fill="rgba(255,255,255,0.05)" transform="rotate(-8 176 250)" />
        <ellipse cx="188" cy="254" rx="34" ry="9" fill="none" stroke="#8d6e63" strokeWidth="0.8" opacity="0.45" strokeDasharray="10 14">
          <animateTransform attributeName="transform" type="rotate" values="0 188 254;360 188 254" dur={isHovered ? '3.5s' : '10s'} repeatCount="indefinite" />
        </ellipse>
        <path d="M 188 261 C 188 261 177 251 172 255 C 167 259 172 265 188 272 C 204 265 209 259 204 255 C 199 251 188 261 188 261 Z"
          fill="#DFC5A0" opacity="0.85" className={isHovered ? 'whoami-latte-heart' : ''} style={{ transformOrigin: '188px 261px' }} />
        {[0, 1, 2].map(i => (
          <path key={i}
            d={`M ${172 + i * 14} 234 C ${166 + i * 14 + (i % 2 ? 6 : -6)} 210 ${178 + i * 14 + (i % 2 ? -5 : 5)} 190 ${172 + i * 14} 168`}
            fill="none" stroke={`rgba(255,255,255,${isHovered ? 0.4 : 0.22})`} strokeWidth="1.5" strokeLinecap="round"
            className="whoami-steam" style={{ animationDelay: `${i * 0.6}s`, animationDuration: `${2.3 + i * 0.4}s` }} />
        ))}
        {[{ x: 104, y: 363, r: -22 }, { x: 270, y: 366, r: 32 }, { x: 138, y: 371, r: 52 }].map((bean, i) => (
          <g key={`bean${i}`} transform={`translate(${bean.x},${bean.y}) rotate(${bean.r})`}>
            <ellipse rx="5.5" ry="3.5" fill="#2b1a13" stroke="#160e0a" strokeWidth="0.8" />
            <line x1="-2.2" y1="0" x2="2.2" y2="0" stroke="#160e0a" strokeWidth="0.6" />
          </g>
        ))}
      </svg>
    </div>
  );
}
