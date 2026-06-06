'use client'

/*
 * WorldlineStages — seven fully procedural Three.js stages for the Journey
 * section, with non-uniform scroll windows so Stage 5 (AI Internals &
 * Quantum Research) receives double the scroll time.
 *
 * STAGE WINDOWS (each fraction of total scroll):
 *   0 Foundations      0/8 → 1/8
 *   1 3D Modelling     1/8 → 2/8
 *   2 Neuro            2/8 → 3/8
 *   3 F1               3/8 → 4/8
 *   4 Bloch            4/8 → 5/8
 *   5 AI + Quantum     5/8 → 7/8  ← 2× scroll space
 *   6 Lattice          7/8 → 8/8
 */

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { scrollState } from './worldlineState';

// ─── Palette ────────────────────────────────────────────────────────────────
const COL = {
  cyan:      new THREE.Color('#00FF9D'),
  violet:    new THREE.Color('#8F00FF'),
  parchment: new THREE.Color('#c8b98a'),
  orange:    new THREE.Color('#F97316'),
  white:     new THREE.Color('#F0F0F0'),
  blue:      new THREE.Color('#3b6fff'),
  gold:      new THREE.Color('#FFD700'),
};

// ─── Non-uniform stage windows ───────────────────────────────────────────────
const STAGE_WINDOWS: [number, number][] = [
  [0 / 8, 1 / 8],
  [1 / 8, 2 / 8],
  [2 / 8, 3 / 8],
  [3 / 8, 4 / 8],
  [4 / 8, 5 / 8],
  [5 / 8, 7 / 8], // 2× space for AI+Quantum
  [7 / 8, 8 / 8],
];
const LAST_STAGE = STAGE_WINDOWS.length - 1;

// ─── Math helpers ─────────────────────────────────────────────────────────────
function smoothstep(a: number, b: number, x: number) {
  const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
}

function stageWindow(progress: number, index: number) {
  const [start, end] = STAGE_WINDOWS[index];
  const t        = THREE.MathUtils.clamp((progress - start) / (end - start), 0, 1);
  const fadeIn   = smoothstep(0.0, 0.10, t);
  const fadeOut  = index === LAST_STAGE ? 1 : 1 - smoothstep(0.88, 1.0, t);
  return { t, vis: fadeIn * fadeOut };
}

// ─── Hover: distance from pointer ray to point ────────────────────────────────
function nearRay(ray: THREE.Ray, center: THREE.Vector3, radius: number): boolean {
  const closest = new THREE.Vector3();
  ray.closestPointToPoint(center, closest);
  return closest.distanceTo(center) < radius;
}

// ─── Apply opacity to an object subtree ──────────────────────────────────────
function applyOpacity(obj: THREE.Object3D, o: number) {
  obj.traverse((c) => {
    const m = (c as THREE.Mesh).material as THREE.Material | THREE.Material[] | undefined;
    if (!m) return;
    const mats = Array.isArray(m) ? m : [m];
    mats.forEach((mat) => {
      const base = (c.userData.baseOpacity as number) ?? 1;
      mat.transparent = true;
      (mat as THREE.Material & { opacity: number }).opacity = base * o;
    });
  });
}

interface StageProps { index: number }

// ─── Big projected year numeral ───────────────────────────────────────────────
function BigYear({ text, position, size = 2.4, color = COL.parchment, opacity = 0.12 }: {
  text: string; position: [number, number, number]; size?: number; color?: THREE.Color; opacity?: number;
}) {
  return (
    <Text
      position={position}
      fontSize={size}
      color={color}
      anchorX="center"
      anchorY="middle"
      letterSpacing={0.04}
      outlineWidth={0}
      userData={{ baseOpacity: opacity }}
    >
      {text}
    </Text>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  AMBIENT FIELD — always-on faint nebula so the scene never reads as void
//  Faster fade-in (0.01 threshold) + denser particles
// ════════════════════════════════════════════════════════════════════════════
function AmbientField() {
  const neb  = useRef<THREE.Points>(null!);
  const grid = useRef<THREE.LineSegments>(null!);

  const { nebGeo, gridGeo } = useMemo(() => {
    const N = 1400;
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 28;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 2] = -9 + Math.random() * 11;
      const c = Math.random() < 0.5 ? COL.cyan : COL.violet;
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    const nebGeo = new THREE.BufferGeometry();
    nebGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    nebGeo.setAttribute('color',    new THREE.Float32BufferAttribute(col, 3));

    const seg: number[] = [];
    const span = 30, step = 2, z = -8;
    for (let x = -span; x <= span; x += step) { seg.push(x, -span, z, x, span, z); }
    for (let y = -span; y <= span; y += step) { seg.push(-span, y, z, span, y, z); }
    const gridGeo = new THREE.BufferGeometry();
    gridGeo.setAttribute('position', new THREE.Float32BufferAttribute(seg, 3));
    return { nebGeo, gridGeo };
  }, []);

  useFrame((state) => {
    const p   = scrollState.progress;
    // Faster appearance: 0.01 instead of 0.04
    const vis = smoothstep(0.0, 0.01, p) * (1 - smoothstep(0.97, 1.0, p));
    const time = state.clock.elapsedTime;
    if (neb.current) {
      neb.current.visible = vis > 0.001;
      neb.current.rotation.z = time * 0.01;
      (neb.current.material as THREE.PointsMaterial).opacity = vis * 0.58;
    }
    if (grid.current) {
      grid.current.visible = vis > 0.001;
      grid.current.rotation.z = Math.sin(time * 0.05) * 0.05;
      (grid.current.material as THREE.LineBasicMaterial).opacity = vis * 0.06;
    }
  });

  return (
    <group>
      <points ref={neb} geometry={nebGeo}>
        <pointsMaterial size={0.065} sizeAttenuation vertexColors transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
      <lineSegments ref={grid} geometry={gridGeo}>
        <lineBasicMaterial color={COL.parchment} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </lineSegments>
    </group>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  STAGE 0 — Foundations in Engineering (circuit board)
//  Fast settle (0.15 instead of 0.32). Hover: chips flare, dots speed up.
// ════════════════════════════════════════════════════════════════════════════
function CircuitStage({ index }: StageProps) {
  const group   = useRef<THREE.Group>(null!);
  const flowRef = useRef<THREE.Points>(null!);
  const hoverT  = useRef(0);

  const { traceGeo, flowPaths, chips } = useMemo(() => {
    const segs: number[] = [];
    const paths: THREE.Vector3[][] = [];
    const rng = (a: number, b: number) => a + Math.random() * (b - a);
    for (let i = 0; i < 22; i++) {
      const z  = 0.09;
      const x0 = rng(-2.7, 2.7), y0 = rng(-1.6, 1.6);
      const midX = THREE.MathUtils.clamp(x0 + rng(-1.3, 1.3), -2.9, 2.9);
      const y1   = THREE.MathUtils.clamp(y0 + rng(-1.3, 1.3), -1.7, 1.7);
      const x1   = THREE.MathUtils.clamp(midX + rng(-1.3, 1.3), -2.9, 2.9);
      const p0 = new THREE.Vector3(x0, y0, z), p1 = new THREE.Vector3(midX, y0, z);
      const p2 = new THREE.Vector3(midX, y1, z), p3 = new THREE.Vector3(x1, y1, z);
      segs.push(p0.x, p0.y, p0.z, p1.x, p1.y, p1.z, p1.x, p1.y, p1.z, p2.x, p2.y, p2.z, p2.x, p2.y, p2.z, p3.x, p3.y, p3.z);
      paths.push(new THREE.CatmullRomCurve3([p0, p1, p2, p3]).getPoints(40));
    }
    const traceGeo = new THREE.BufferGeometry();
    traceGeo.setAttribute('position', new THREE.Float32BufferAttribute(segs, 3));
    const chips: { pos: [number, number, number]; size: [number, number, number] }[] = [];
    for (let i = 0; i < 9; i++) {
      const w = rng(0.5, 1.0);
      chips.push({ pos: [rng(-2.4, 2.4), rng(-1.3, 1.3), 0.18], size: [w, rng(0.4, 0.8), 0.2] });
    }
    return { traceGeo, flowPaths: paths, chips };
  }, []);

  const flowGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(flowPaths.length * 3), 3));
    return g;
  }, [flowPaths]);

  // Refs to chip meshes for hover color animation
  const chipRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state) => {
    const { t, vis } = stageWindow(scrollState.progress, index);
    const g = group.current;
    g.visible = vis > 0.002;
    if (!g.visible) return;
    const time = state.clock.elapsedTime;

    // Faster settle: 0.15 instead of 0.32
    const settle = smoothstep(0, 0.15, t);
    g.position.x = THREE.MathUtils.lerp(-7, 2.6, settle);
    g.position.y = THREE.MathUtils.lerp(-3.5, 0.2, settle);
    g.rotation.x = -0.5 + 0.06 * Math.sin(time * 0.5);
    g.rotation.y = (1 - settle) * 1.0 - 0.45 + 0.18 * Math.sin(time * 0.35);
    g.rotation.z = 0.04 * Math.sin(time * 0.4);

    // Hover detection
    const center = g.position.clone();
    hoverT.current = THREE.MathUtils.lerp(
      hoverT.current,
      nearRay(state.raycaster.ray, center, 3.5) ? 1 : 0,
      0.08,
    );
    const h = hoverT.current;

    // Flow animation (speed up on hover)
    const flowSpeed = 0.4 + h * 1.2;
    const pos = flowGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < flowPaths.length; i++) {
      const pts = flowPaths[i];
      const f = (time * flowSpeed + i * 0.111) % 1;
      const p = pts[Math.floor(f * (pts.length - 1))];
      pos.setXYZ(i, p.x, p.y, p.z);
    }
    // eslint-disable-next-line react-hooks/immutability
    pos.needsUpdate = true;
    if (flowRef.current) {
      const mat = flowRef.current.material as THREE.PointsMaterial;
      mat.opacity  = vis * (0.6 + 0.4 * Math.sin(time * 4));
      mat.size     = 0.2 + h * 0.15;
    }

    // Chip hover: emissive flare
    chipRefs.current.forEach((mesh) => {
      if (!mesh) return;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.emissive.lerpColors(COL.violet, COL.cyan, h);
      mat.emissiveIntensity = 0.3 + h * 0.9;
    });

    // Board tilt toward pointer on hover
    g.rotation.y += h * 0.15 * Math.sin(time * 0.5);

    applyOpacity(g, vis);
  });

  return (
    <group ref={group} scale={1.35}>
      <mesh userData={{ baseOpacity: 0.95 }}>
        <boxGeometry args={[6.2, 3.8, 0.14]} />
        <meshStandardMaterial color={'#0c241c'} emissive={'#06140e'} metalness={0.5} roughness={0.55} />
      </mesh>
      <lineSegments geometry={traceGeo} userData={{ baseOpacity: 0.6 }}>
        <lineBasicMaterial color={COL.cyan} blending={THREE.AdditiveBlending} />
      </lineSegments>
      <points ref={flowRef} geometry={flowGeo}>
        <pointsMaterial color={COL.cyan} size={0.2} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>
      {chips.map((c, i) => (
        <mesh key={i} ref={(el) => { chipRefs.current[i] = el; }} position={c.pos} userData={{ baseOpacity: 1 }}>
          <boxGeometry args={c.size} />
          <meshStandardMaterial color={'#11151a'} emissive={COL.violet} emissiveIntensity={0.3} metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
      <BigYear text="2018" position={[0, 0, -1.2]} size={1.6} color={COL.cyan} opacity={0.14} />
    </group>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  STAGE 1 — 3D Modelling & Sustainability (wireframe icosahedron)
//  Hover: sphere spins 3×, edges pulse gold, inner core expands.
// ════════════════════════════════════════════════════════════════════════════
function ModellingStage({ index }: StageProps) {
  const group  = useRef<THREE.Group>(null!);
  const edges  = useRef<THREE.LineSegments>(null!);
  const solid  = useRef<THREE.Mesh>(null!);
  const inner  = useRef<THREE.Mesh>(null!);
  const hoverT = useRef(0);

  const { edgeGeo, solidGeo, edgeCount } = useMemo(() => {
    const solidGeo = new THREE.IcosahedronGeometry(2.6, 1);
    const edgeGeo  = new THREE.EdgesGeometry(solidGeo, 1);
    const edgeCount = (edgeGeo.attributes.position as THREE.BufferAttribute).count;
    return { edgeGeo, solidGeo, edgeCount };
  }, []);

  useFrame((state) => {
    const { t, vis } = stageWindow(scrollState.progress, index);
    const g = group.current;
    g.visible = vis > 0.002;
    if (!g.visible) return;
    const time = state.clock.elapsedTime;
    g.position.set(-2.8, 0.2, 0);

    hoverT.current = THREE.MathUtils.lerp(
      hoverT.current,
      nearRay(state.raycaster.ray, g.position, 3.2) ? 1 : 0,
      0.08,
    );
    const h = hoverT.current;

    const spinSpeed = 0.35 + h * 0.95;
    g.rotation.y = time * spinSpeed;
    g.rotation.x = 0.25 * Math.sin(time * 0.4);

    const build = smoothstep(0.05, 0.55, t);
    edges.current.geometry.setDrawRange(0, Math.floor(edgeCount * build));
    const s = 0.9 + 0.06 * Math.sin(time * 1.4);
    solid.current.scale.setScalar(build * s);

    // Hover effects
    const edgeMat = edges.current.material as THREE.LineBasicMaterial;
    edgeMat.color.lerpColors(COL.parchment, COL.gold, h);

    const innerScale = build * (0.5 + h * 0.6);
    if (inner.current) inner.current.scale.setScalar(innerScale);
    const innerMat = inner.current?.material as THREE.MeshStandardMaterial;
    if (innerMat) {
      innerMat.emissive.lerpColors(COL.cyan, COL.white, h);
      innerMat.emissiveIntensity = 1.3 + h * 1.2;
    }

    applyOpacity(g, vis);
  });

  return (
    <group ref={group}>
      <mesh ref={solid} geometry={solidGeo} userData={{ baseOpacity: 0.16 }}>
        <meshStandardMaterial color={COL.cyan} emissive={COL.cyan} emissiveIntensity={0.5} transparent flatShading metalness={0.2} roughness={0.5} />
      </mesh>
      <lineSegments ref={edges} geometry={edgeGeo} userData={{ baseOpacity: 0.85 }}>
        <lineBasicMaterial color={COL.parchment} blending={THREE.AdditiveBlending} />
      </lineSegments>
      <mesh ref={inner} userData={{ baseOpacity: 0.9 }}>
        <icosahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial color={COL.cyan} emissive={COL.cyan} emissiveIntensity={1.3} />
      </mesh>
      <BigYear text="2020" position={[0, 0, -2.4]} size={1.8} color={COL.parchment} opacity={0.14} />
    </group>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  STAGE 2 — Computational Neuroscience (particle brain)
//  Hover: signals fire 5×, particles shift cyan→white.
//  Outro: brain expands, then collapses outward (particles scatter away).
// ════════════════════════════════════════════════════════════════════════════
function NeuroStage({ index }: StageProps) {
  const group      = useRef<THREE.Group>(null!);
  const signalsRef = useRef<THREE.Points>(null!);
  const pointsRef  = useRef<THREE.Points>(null!);
  const hoverT     = useRef(0);
  const N = 1300;

  const { pointGeo, edgeGeo, signalGeo, signalPairs } = useMemo(() => {
    const verts: THREE.Vector3[] = [];
    const pp = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const u = Math.random(), v = Math.random();
      const theta = u * Math.PI * 2;
      const phi   = Math.acos(2 * v - 1);
      const r = 2.5 + (Math.random() - 0.5) * 0.4;
      const x = r * 1.3 * Math.sin(phi) * Math.cos(theta);
      const y = r * 0.95 * Math.cos(phi);
      const z = r * 1.0  * Math.sin(phi) * Math.sin(theta);
      pp[i * 3] = x; pp[i * 3 + 1] = y; pp[i * 3 + 2] = z;
      verts.push(new THREE.Vector3(x, y, z));
    }
    const pointGeo = new THREE.BufferGeometry();
    pointGeo.setAttribute('position', new THREE.Float32BufferAttribute(pp, 3));

    const eSeg: number[] = [];
    const signalPairs: [THREE.Vector3, THREE.Vector3][] = [];
    for (let i = 0; i < N; i += 2) {
      let nearest = -1, nd = Infinity;
      for (let j = 0; j < N; j += 3) {
        if (j === i) continue;
        const d = verts[i].distanceToSquared(verts[j]);
        if (d < nd && d > 0.05) { nd = d; nearest = j; }
      }
      if (nearest >= 0 && nd < 1.4) {
        eSeg.push(verts[i].x, verts[i].y, verts[i].z, verts[nearest].x, verts[nearest].y, verts[nearest].z);
        if (signalPairs.length < 90) signalPairs.push([verts[i], verts[nearest]]);
      }
    }
    const edgeGeo  = new THREE.BufferGeometry();
    edgeGeo.setAttribute('position', new THREE.Float32BufferAttribute(eSeg, 3));
    const signalGeo = new THREE.BufferGeometry();
    signalGeo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(signalPairs.length * 3), 3));
    return { pointGeo, edgeGeo, signalGeo, signalPairs };
  }, []);

  useFrame((state) => {
    const { t, vis } = stageWindow(scrollState.progress, index);
    const g = group.current;
    g.visible = vis > 0.002;
    if (!g.visible) return;
    const time = state.clock.elapsedTime;

    hoverT.current = THREE.MathUtils.lerp(
      hoverT.current,
      nearRay(state.raycaster.ray, new THREE.Vector3(0, 0.1, 0), 3.0) ? 1 : 0,
      0.08,
    );
    const h = hoverT.current;

    // Outro: expand then scatter outward
    const outroExpand = smoothstep(0.75, 0.92, t);  // expand phase
    const outroBurst  = smoothstep(0.88, 1.0,  t);  // scatter phase
    const expandScale = 1 + outroExpand * 1.5 + outroBurst * 3.0;
    const outroAlpha  = 1 - outroBurst;

    g.position.set(0, 0.1 + 0.14 * Math.sin(time * 0.6), 0);
    g.rotation.y = time * 0.22;
    const baseScale = THREE.MathUtils.lerp(0.5, 1, smoothstep(0, 0.3, t));
    const pulse     = 1 + 0.03 * Math.sin(time * 2.2);
    g.scale.setScalar(baseScale * pulse * expandScale);

    // Signals (speed up on hover or burst)
    const sigSpeed  = 0.8 + h * 1.6 + outroBurst * 6;
    const sigPos    = signalGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < signalPairs.length; i++) {
      const [a, b] = signalPairs[i];
      const f = (time * sigSpeed + i * 0.083) % 1;
      sigPos.setXYZ(i, a.x + (b.x - a.x) * f, a.y + (b.y - a.y) * f, a.z + (b.z - a.z) * f);
    }
    // eslint-disable-next-line react-hooks/immutability
    sigPos.needsUpdate = true;

    // Particle color shift on hover
    if (pointsRef.current) {
      const pMat = pointsRef.current.material as THREE.PointsMaterial;
      pMat.color.lerpColors(COL.violet, COL.white, h * 0.6);
    }

    if (signalsRef.current) {
      (signalsRef.current.material as THREE.PointsMaterial).opacity = vis * outroAlpha * (1 + h * 0.5);
    }

    applyOpacity(g, vis * outroAlpha);
  });

  return (
    <group ref={group}>
      <points ref={pointsRef} geometry={pointGeo} userData={{ baseOpacity: 0.8 }}>
        <pointsMaterial color={COL.violet} size={0.06} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>
      <lineSegments geometry={edgeGeo} userData={{ baseOpacity: 0.16 }}>
        <lineBasicMaterial color={COL.parchment} blending={THREE.AdditiveBlending} />
      </lineSegments>
      <points ref={signalsRef} geometry={signalGeo}>
        <pointsMaterial color={COL.cyan} size={0.16} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>
      <BigYear text="2021" position={[0, 3.4, -3]} size={1.6} color={COL.violet} opacity={0.16} />
    </group>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  STAGE 3 — F1 in Schools (realistic car + aerodynamic streamlines)
//  Car is rotated 180° so nose leads in the direction of travel.
//  Hover: streamlines accelerate, exhaust flares.
// ════════════════════════════════════════════════════════════════════════════
function F1Car() {
  return (
    // rotateY(π) so nose (-x in local space) points in travel direction (-x world)
    <group rotation={[0, Math.PI, 0]} scale={1.18}>
      {/* ── Main chassis monocoque (tapered top profile) ── */}
      {/* Front tub — narrows toward nose */}
      <mesh position={[0.95, 0.03, 0]} userData={{ baseOpacity: 1 }}>
        <boxGeometry args={[1.30, 0.22, 0.46]} />
        <meshStandardMaterial color={'#090e14'} metalness={0.90} roughness={0.10} emissive={COL.cyan} emissiveIntensity={0.05} />
      </mesh>
      {/* Centre monocoque — highest point, where driver sits */}
      <mesh position={[-0.10, 0.04, 0]} userData={{ baseOpacity: 1 }}>
        <boxGeometry args={[1.60, 0.30, 0.60]} />
        <meshStandardMaterial color={'#0c1520'} metalness={0.88} roughness={0.12} />
      </mesh>
      {/* Airbox intake scoop on top of centre */}
      <mesh position={[0.05, 0.22, 0]} userData={{ baseOpacity: 1 }}>
        <boxGeometry args={[0.55, 0.16, 0.22]} />
        <meshStandardMaterial color={'#0a1018'} metalness={0.92} roughness={0.08} emissive={COL.cyan} emissiveIntensity={0.04} />
      </mesh>
      {/* Rear engine cover — tapers down */}
      <mesh position={[-1.15, 0.01, 0]} userData={{ baseOpacity: 1 }}>
        <boxGeometry args={[0.90, 0.24, 0.50]} />
        <meshStandardMaterial color={'#090e14'} metalness={0.90} roughness={0.10} />
      </mesh>

      {/* ── Sidepods (wider, with undercut shape) ── */}
      {/* Outer upper skin */}
      <mesh position={[-0.12, -0.01, 0.44]} userData={{ baseOpacity: 1 }}>
        <boxGeometry args={[1.42, 0.22, 0.20]} />
        <meshStandardMaterial color={'#0c1828'} metalness={0.82} roughness={0.18} emissive={COL.orange} emissiveIntensity={0.10} />
      </mesh>
      <mesh position={[-0.12, -0.01, -0.44]} userData={{ baseOpacity: 1 }}>
        <boxGeometry args={[1.42, 0.22, 0.20]} />
        <meshStandardMaterial color={'#0c1828'} metalness={0.82} roughness={0.18} emissive={COL.orange} emissiveIntensity={0.10} />
      </mesh>
      {/* Undercut lower section (angled inward) */}
      <mesh position={[-0.20, -0.12, 0.44]} rotation={[0.22, 0, 0]} userData={{ baseOpacity: 1 }}>
        <boxGeometry args={[1.20, 0.10, 0.18]} />
        <meshStandardMaterial color={'#090e14'} metalness={0.90} roughness={0.10} />
      </mesh>
      <mesh position={[-0.20, -0.12, -0.44]} rotation={[-0.22, 0, 0]} userData={{ baseOpacity: 1 }}>
        <boxGeometry args={[1.20, 0.10, 0.18]} />
        <meshStandardMaterial color={'#090e14'} metalness={0.90} roughness={0.10} />
      </mesh>

      {/* ── Nose cone ── */}
      <mesh position={[1.85, -0.01, 0]} rotation={[0, 0, -Math.PI / 2]} userData={{ baseOpacity: 1 }}>
        <coneGeometry args={[0.13, 1.45, 12]} />
        <meshStandardMaterial color={'#080c12'} metalness={0.92} roughness={0.09} emissive={COL.cyan} emissiveIntensity={0.07} />
      </mesh>

      {/* ── Halo (titanium arch) ── */}
      <mesh position={[0.06, 0.31, 0]} rotation={[Math.PI / 2, 0, 0]} userData={{ baseOpacity: 1 }}>
        <torusGeometry args={[0.27, 0.024, 8, 26, Math.PI]} />
        <meshStandardMaterial color={'#8090a0'} metalness={0.96} roughness={0.04} emissive={COL.cyan} emissiveIntensity={0.12} />
      </mesh>
      {/* Halo centre pillar */}
      <mesh position={[0.06, 0.17, 0]} userData={{ baseOpacity: 1 }}>
        <cylinderGeometry args={[0.024, 0.024, 0.27, 8]} />
        <meshStandardMaterial color={'#8090a0'} metalness={0.96} roughness={0.04} />
      </mesh>

      {/* ── Cockpit ── */}
      <mesh position={[0.06, 0.24, 0]} userData={{ baseOpacity: 1 }}>
        <sphereGeometry args={[0.27, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={'#080c11'} metalness={0.70} roughness={0.30} emissive={COL.cyan} emissiveIntensity={0.16} />
      </mesh>
      {/* Visor */}
      <mesh position={[0.14, 0.26, 0]} rotation={[0, 0, -0.22]} userData={{ baseOpacity: 0.55 }}>
        <sphereGeometry args={[0.21, 12, 6, 0, Math.PI * 1.1, 0, Math.PI / 3.2]} />
        <meshStandardMaterial color={'#1a3d58'} metalness={0.30} roughness={0.08} transparent emissive={COL.blue} emissiveIntensity={0.45} />
      </mesh>

      {/* ── Front wing (3-element) ── */}
      <mesh position={[1.66, -0.22, 0]} userData={{ baseOpacity: 1 }}>
        <boxGeometry args={[0.52, 0.038, 1.58]} />
        <meshStandardMaterial color={'#0c1824'} metalness={0.82} roughness={0.18} />
      </mesh>
      <mesh position={[1.56, -0.16, 0]} userData={{ baseOpacity: 1 }}>
        <boxGeometry args={[0.32, 0.032, 1.48]} />
        <meshStandardMaterial color={'#0f1e2c'} metalness={0.82} roughness={0.18} />
      </mesh>
      <mesh position={[1.46, -0.11, 0]} userData={{ baseOpacity: 1 }}>
        <boxGeometry args={[0.22, 0.028, 1.36]} />
        <meshStandardMaterial color={'#0c1824'} metalness={0.82} roughness={0.18} />
      </mesh>
      {/* Front wing endplates */}
      <mesh position={[1.58, -0.15,  0.82]} userData={{ baseOpacity: 1 }}>
        <boxGeometry args={[0.62, 0.24, 0.032]} />
        <meshStandardMaterial color={'#090e14'} metalness={0.86} roughness={0.14} emissive={COL.cyan} emissiveIntensity={0.07} />
      </mesh>
      <mesh position={[1.58, -0.15, -0.82]} userData={{ baseOpacity: 1 }}>
        <boxGeometry args={[0.62, 0.24, 0.032]} />
        <meshStandardMaterial color={'#090e14'} metalness={0.86} roughness={0.14} emissive={COL.cyan} emissiveIntensity={0.07} />
      </mesh>

      {/* ── Rear wing (2-element + endplates) ── */}
      <mesh position={[-1.30, 0.42, 0]} userData={{ baseOpacity: 1 }}>
        <boxGeometry args={[0.46, 0.046, 1.18]} />
        <meshStandardMaterial color={'#0c1824'} metalness={0.82} roughness={0.18} emissive={COL.violet} emissiveIntensity={0.14} />
      </mesh>
      <mesh position={[-1.20, 0.52, 0]} userData={{ baseOpacity: 1 }}>
        <boxGeometry args={[0.36, 0.038, 1.12]} />
        <meshStandardMaterial color={'#0f1e2c'} metalness={0.82} roughness={0.18} emissive={COL.violet} emissiveIntensity={0.09} />
      </mesh>
      {/* Rear wing endplates */}
      <mesh position={[-1.25, 0.38,  0.61]} userData={{ baseOpacity: 1 }}>
        <boxGeometry args={[0.72, 0.34, 0.032]} />
        <meshStandardMaterial color={'#090e14'} metalness={0.86} roughness={0.14} />
      </mesh>
      <mesh position={[-1.25, 0.38, -0.61]} userData={{ baseOpacity: 1 }}>
        <boxGeometry args={[0.72, 0.34, 0.032]} />
        <meshStandardMaterial color={'#090e14'} metalness={0.86} roughness={0.14} />
      </mesh>
      {/* Rear wing pillar */}
      <mesh position={[-1.25, 0.18, 0]} userData={{ baseOpacity: 1 }}>
        <boxGeometry args={[0.07, 0.26, 0.055]} />
        <meshStandardMaterial color={'#090e14'} metalness={0.92} roughness={0.08} />
      </mesh>

      {/* ── Floor / undertray ── */}
      <mesh position={[0.18, -0.17, 0]} userData={{ baseOpacity: 1 }}>
        <boxGeometry args={[2.58, 0.038, 0.56]} />
        <meshStandardMaterial color={'#060b11'} metalness={0.92} roughness={0.08} />
      </mesh>
      {/* Rear diffuser (angled) */}
      <mesh position={[-1.06, -0.10, 0]} rotation={[0, 0, 0.42]} userData={{ baseOpacity: 1 }}>
        <boxGeometry args={[0.58, 0.036, 0.54]} />
        <meshStandardMaterial color={'#090e14'} metalness={0.86} roughness={0.14} emissive={COL.orange} emissiveIntensity={0.06} />
      </mesh>

      {/* ── Wheels (tyre + rim + hub) ── */}
      {/* Front left */}
      <group position={[1.06, -0.19,  0.66]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh userData={{ baseOpacity: 1 }}><cylinderGeometry args={[0.33, 0.33, 0.28, 20]} /><meshStandardMaterial color={'#0f0f0f'} metalness={0.28} roughness={0.82} /></mesh>
        <mesh userData={{ baseOpacity: 1 }}><cylinderGeometry args={[0.21, 0.21, 0.30, 16]} /><meshStandardMaterial color={'#18222e'} metalness={0.92} roughness={0.08} emissive={COL.cyan} emissiveIntensity={0.13} /></mesh>
        <mesh userData={{ baseOpacity: 1 }}><cylinderGeometry args={[0.07, 0.07, 0.33, 8]} /><meshStandardMaterial color={'#aaaaaa'} metalness={0.96} roughness={0.04} /></mesh>
      </group>
      {/* Front right */}
      <group position={[1.06, -0.19, -0.66]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh userData={{ baseOpacity: 1 }}><cylinderGeometry args={[0.33, 0.33, 0.28, 20]} /><meshStandardMaterial color={'#0f0f0f'} metalness={0.28} roughness={0.82} /></mesh>
        <mesh userData={{ baseOpacity: 1 }}><cylinderGeometry args={[0.21, 0.21, 0.30, 16]} /><meshStandardMaterial color={'#18222e'} metalness={0.92} roughness={0.08} emissive={COL.cyan} emissiveIntensity={0.13} /></mesh>
        <mesh userData={{ baseOpacity: 1 }}><cylinderGeometry args={[0.07, 0.07, 0.33, 8]} /><meshStandardMaterial color={'#aaaaaa'} metalness={0.96} roughness={0.04} /></mesh>
      </group>
      {/* Rear left */}
      <group position={[-0.93, -0.17,  0.70]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh userData={{ baseOpacity: 1 }}><cylinderGeometry args={[0.37, 0.37, 0.30, 20]} /><meshStandardMaterial color={'#0f0f0f'} metalness={0.28} roughness={0.82} /></mesh>
        <mesh userData={{ baseOpacity: 1 }}><cylinderGeometry args={[0.25, 0.25, 0.32, 16]} /><meshStandardMaterial color={'#18222e'} metalness={0.92} roughness={0.08} emissive={COL.violet} emissiveIntensity={0.16} /></mesh>
        <mesh userData={{ baseOpacity: 1 }}><cylinderGeometry args={[0.08, 0.08, 0.35, 8]} /><meshStandardMaterial color={'#aaaaaa'} metalness={0.96} roughness={0.04} /></mesh>
      </group>
      {/* Rear right */}
      <group position={[-0.93, -0.17, -0.70]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh userData={{ baseOpacity: 1 }}><cylinderGeometry args={[0.37, 0.37, 0.30, 20]} /><meshStandardMaterial color={'#0f0f0f'} metalness={0.28} roughness={0.82} /></mesh>
        <mesh userData={{ baseOpacity: 1 }}><cylinderGeometry args={[0.25, 0.25, 0.32, 16]} /><meshStandardMaterial color={'#18222e'} metalness={0.92} roughness={0.08} emissive={COL.violet} emissiveIntensity={0.16} /></mesh>
        <mesh userData={{ baseOpacity: 1 }}><cylinderGeometry args={[0.08, 0.08, 0.35, 8]} /><meshStandardMaterial color={'#aaaaaa'} metalness={0.96} roughness={0.04} /></mesh>
      </group>

      {/* ── Livery accent stripes ── */}
      <mesh position={[0.28, 0.14, 0]} userData={{ baseOpacity: 0.88 }}>
        <boxGeometry args={[1.75, 0.026, 0.50]} />
        <meshBasicMaterial color={COL.cyan} blending={THREE.AdditiveBlending} transparent />
      </mesh>
      <mesh position={[-0.10, -0.02,  0.36]} userData={{ baseOpacity: 0.70 }}>
        <boxGeometry args={[1.40, 0.018, 0.038]} />
        <meshBasicMaterial color={COL.orange} blending={THREE.AdditiveBlending} transparent />
      </mesh>
      <mesh position={[-0.10, -0.02, -0.36]} userData={{ baseOpacity: 0.70 }}>
        <boxGeometry args={[1.40, 0.018, 0.038]} />
        <meshBasicMaterial color={COL.orange} blending={THREE.AdditiveBlending} transparent />
      </mesh>

      {/* ── Dual exhaust glow ── */}
      <mesh position={[-1.47, 0.07,  0.14]} userData={{ baseOpacity: 0.78 }}>
        <sphereGeometry args={[0.11, 12, 12]} />
        <meshBasicMaterial color={COL.orange} blending={THREE.AdditiveBlending} transparent depthWrite={false} />
      </mesh>
      <mesh position={[-1.47, 0.07, -0.14]} userData={{ baseOpacity: 0.78 }}>
        <sphereGeometry args={[0.11, 12, 12]} />
        <meshBasicMaterial color={COL.orange} blending={THREE.AdditiveBlending} transparent depthWrite={false} />
      </mesh>
    </group>
  );
}

function FlowStage({ index }: StageProps) {
  const group     = useRef<THREE.Group>(null!);
  const carRef    = useRef<THREE.Group>(null!);
  const streamRef = useRef<THREE.Points>(null!);
  const ringRef   = useRef<THREE.Mesh>(null!);
  const coreRef   = useRef<THREE.Mesh>(null!);
  const hoverT    = useRef(0);
  const M = 1800;

  const { streamGeo, seeds } = useMemo(() => {
    const seeds: { y: number; z: number; off: number; speed: number }[] = [];
    for (let i = 0; i < M; i++) {
      seeds.push({ y: (Math.random() - 0.5) * 3.4, z: (Math.random() - 0.5) * 3.4, off: Math.random(), speed: 0.7 + Math.random() * 0.8 });
    }
    const streamGeo = new THREE.BufferGeometry();
    streamGeo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(M * 3), 3));
    return { streamGeo, seeds };
  }, []);

  useFrame((state) => {
    const { t, vis } = stageWindow(scrollState.progress, index);
    const g = group.current;
    g.visible = vis > 0.002;
    if (!g.visible) return;
    const time = state.clock.elapsedTime;
    g.position.set(0, 0, 0);

    // Car travels left (−x). Nose now leads because car is rotated π.
    const carX = t < 0.4
      ? THREE.MathUtils.lerp(7.5, 0, smoothstep(0, 0.4, t))
      : THREE.MathUtils.lerp(0, -8, smoothstep(0.6, 1, t));
    const carY = Math.sin(t * Math.PI) * 0.6 - 0.2 + 0.1 * Math.sin(time * 3);
    carRef.current.position.set(carX, carY, 0);
    carRef.current.rotation.z = (t < 0.4 ? -0.06 : 0.05) + 0.03 * Math.sin(time * 5);
    carRef.current.rotation.y = 0.15 * Math.sin(time * 0.6);

    // Hover detection at car position
    const carCenter = new THREE.Vector3(carX, carY, 0);
    hoverT.current = THREE.MathUtils.lerp(
      hoverT.current,
      nearRay(state.raycaster.ray, carCenter, 2.5) ? 1 : 0,
      0.08,
    );
    const h = hoverT.current;

    const collapse = smoothstep(0.62, 0.96, t);

    // Aerodynamic streamlines (accelerate on hover)
    const streamSpeed = 0.28 + h * 0.22;
    const pos = streamGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < M; i++) {
      const s = seeds[i];
      const f    = (time * s.speed * streamSpeed + s.off) % 1;
      let x      = THREE.MathUtils.lerp(8, -8, f);
      const rel  = x - carX;
      const bodyMask = Math.exp(-(rel * rel) * 0.18);
      const yDefl = s.y + Math.sign(s.y || 1) * bodyMask * 1.0 + 0.15 * Math.sin(x * 1.5 + time * 4);
      const zDefl = s.z + Math.sign(s.z || 1) * bodyMask * 0.6;
      x = THREE.MathUtils.lerp(x, carX, collapse);
      pos.setXYZ(i, x, THREE.MathUtils.lerp(yDefl, carY, collapse), THREE.MathUtils.lerp(zDefl, 0, collapse));
    }
    // eslint-disable-next-line react-hooks/immutability
    pos.needsUpdate = true;

    // Quantum spark ring + core
    ringRef.current.position.set(carX, carY, 0);
    coreRef.current.position.set(carX, carY, 0);
    ringRef.current.scale.setScalar(0.001 + collapse * (2.0 + 0.7 * Math.sin(time * 3)));
    coreRef.current.scale.setScalar(0.001 + collapse * (0.9 + 0.25 * Math.sin(time * 6)));
    ringRef.current.rotation.z = time * 0.8;

    applyOpacity(g, vis);
    (streamRef.current.material as THREE.PointsMaterial).opacity = vis * (1 - collapse * 0.7);
    (ringRef.current.material as THREE.MeshBasicMaterial).opacity = vis * collapse;
    (coreRef.current.material as THREE.MeshBasicMaterial).opacity = vis * collapse;
    carRef.current.traverse((c) => {
      const mat = (c as THREE.Mesh).material as (THREE.Material & { opacity: number }) | undefined;
      if (mat) { mat.transparent = true; mat.opacity = ((c.userData.baseOpacity as number) ?? 1) * vis * (1 - collapse); }
    });
  });

  return (
    <group ref={group} scale={1.28}>
      <group ref={carRef}><F1Car /></group>
      <points ref={streamRef} geometry={streamGeo}>
        <pointsMaterial color={COL.orange} size={0.07} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} transparent />
      </points>
      <mesh ref={ringRef}>
        <torusGeometry args={[1.0, 0.05, 16, 100]} />
        <meshBasicMaterial color={COL.cyan} blending={THREE.AdditiveBlending} transparent depthWrite={false} />
      </mesh>
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.4, 24, 24]} />
        <meshBasicMaterial color={COL.white} blending={THREE.AdditiveBlending} transparent depthWrite={false} />
      </mesh>
      <BigYear text="2022" position={[0, 3.2, -3]} size={1.6} color={COL.orange} opacity={0.16} />
    </group>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  STAGE 4 — Quantum Computing (Bloch sphere)
//  Hover: vector spins faster, gates glow.
//  Exit (t > 0.80): vector spins wild → sphere swells → rings fly outward →
//  white/violet flash → everything scatters.
// ════════════════════════════════════════════════════════════════════════════
function BlochStage({ index }: StageProps) {
  const group    = useRef<THREE.Group>(null!);
  const vector   = useRef<THREE.Group>(null!);
  const sphereMesh = useRef<THREE.Mesh>(null!);
  const flashRef = useRef<THREE.Mesh>(null!);
  const gateRingRefs = useRef<(THREE.Mesh | null)[]>([]);
  const hoverT   = useRef(0);
  const R = 2.4;

  // Gate ring base angles & outward dirs
  const gateAngles = useMemo(() => [0, 1, 2, 3].map((i) => (i / 4) * Math.PI * 2), []);

  const { latLong, axes } = useMemo(() => {
    const seg: number[] = [];
    for (let l = 0; l < 12; l++) {
      const phi = (l / 12) * Math.PI * 2;
      let prev: THREE.Vector3 | null = null;
      for (let i = 0; i <= 48; i++) {
        const th = (i / 48) * Math.PI;
        const p = new THREE.Vector3(R * Math.sin(th) * Math.cos(phi), R * Math.cos(th), R * Math.sin(th) * Math.sin(phi));
        if (prev) seg.push(prev.x, prev.y, prev.z, p.x, p.y, p.z);
        prev = p;
      }
    }
    for (let l = 1; l < 8; l++) {
      const th = (l / 8) * Math.PI;
      let prev: THREE.Vector3 | null = null;
      for (let i = 0; i <= 64; i++) {
        const phi = (i / 64) * Math.PI * 2;
        const p = new THREE.Vector3(R * Math.sin(th) * Math.cos(phi), R * Math.cos(th), R * Math.sin(th) * Math.sin(phi));
        if (prev) seg.push(prev.x, prev.y, prev.z, p.x, p.y, p.z);
        prev = p;
      }
    }
    const latLong = new THREE.BufferGeometry();
    latLong.setAttribute('position', new THREE.Float32BufferAttribute(seg, 3));
    const a = R + 0.6;
    const axes = new THREE.BufferGeometry();
    axes.setAttribute('position', new THREE.Float32BufferAttribute([0, -a, 0, 0, a, 0, -a, 0, 0, a, 0, 0, 0, 0, -a, 0, 0, a], 3));
    return { latLong, axes };
  }, []);

  useFrame((state) => {
    const { t, vis } = stageWindow(scrollState.progress, index);
    const g = group.current;
    g.visible = vis > 0.002;
    if (!g.visible) return;
    const time = state.clock.elapsedTime;
    g.position.set(2.8, 0.1, 0);

    hoverT.current = THREE.MathUtils.lerp(
      hoverT.current,
      nearRay(state.raycaster.ray, g.position, 3.5) ? 1 : 0,
      0.08,
    );
    const h = hoverT.current;

    // Exit animation (t > 0.78)
    const blochExit  = smoothstep(0.78, 1.0, t);
    const exitBurst  = smoothstep(0.90, 1.0, t);
    const exitFlash  = blochExit * (1 - blochExit) * 4.2; // peak around t=0.89

    // Base transform
    g.rotation.y = time * 0.3;
    g.rotation.z = 0.12 * Math.sin(time * 0.5);
    const swell = 1 + blochExit * 0.55;
    g.scale.setScalar(THREE.MathUtils.lerp(0.5, 1, smoothstep(0, 0.3, t)) * swell);

    // Quantum vector — spins faster during hover & exit
    const vecSpeed = 1.2 + h * 1.8 + blochExit * 8;
    const polar = Math.PI * (0.3 + 0.35 * (0.5 + 0.5 * Math.sin(time * 0.7)));
    vector.current.rotation.set(0, time * vecSpeed, 0);
    vector.current.children[0].rotation.z = polar + blochExit * Math.PI * 2;

    // Sphere swell colour
    if (sphereMesh.current) {
      const mat = sphereMesh.current.material as THREE.MeshBasicMaterial;
      mat.color.lerpColors(COL.violet, COL.white, blochExit * 0.5);
      mat.opacity = 0.05 + blochExit * 0.12;
    }

    // Gate rings fly outward on exit
    gateRingRefs.current.forEach((ring, i) => {
      if (!ring) return;
      const angle = gateAngles[i];
      const baseR = R + 0.9;
      const flyR  = baseR + blochExit * 4.5;
      ring.position.set(
        Math.cos(angle) * flyR,
        blochExit * (i % 2 ? 2.0 : -2.0),
        Math.sin(angle) * flyR,
      );
      ring.rotation.y = -time * (0.6 + blochExit * 3);
      ring.rotation.x = 0.4 + blochExit * Math.PI;
      const ringMat = ring.material as THREE.MeshBasicMaterial;
      ringMat.opacity = vis * (1 - exitBurst) * (0.8 + h * 0.2);
    });

    // Flash sphere
    if (flashRef.current) {
      const flashMat = flashRef.current.material as THREE.MeshBasicMaterial;
      flashMat.opacity = exitFlash * 0.9 * vis;
      flashRef.current.scale.setScalar(1 + exitFlash * 2);
    }

    // Overall opacity — let exit handle fade
    const mainVis = vis * (1 - exitBurst);
    applyOpacity(g, mainVis);
  });

  return (
    <group ref={group}>
      <lineSegments geometry={latLong} userData={{ baseOpacity: 0.3 }}>
        <lineBasicMaterial color={COL.violet} blending={THREE.AdditiveBlending} />
      </lineSegments>
      <lineSegments geometry={axes} userData={{ baseOpacity: 0.4 }}>
        <lineBasicMaterial color={COL.parchment} blending={THREE.AdditiveBlending} />
      </lineSegments>
      <mesh ref={sphereMesh} userData={{ baseOpacity: 0.05 }}>
        <sphereGeometry args={[R - 0.02, 32, 32]} />
        <meshBasicMaterial color={COL.violet} transparent depthWrite={false} />
      </mesh>
      {/* State vector */}
      <group ref={vector}>
        <group>
          <mesh position={[0, R * 0.5, 0]} userData={{ baseOpacity: 1 }}>
            <cylinderGeometry args={[0.035, 0.035, R, 12]} />
            <meshBasicMaterial color={COL.cyan} blending={THREE.AdditiveBlending} />
          </mesh>
          <mesh position={[0, R + 0.15, 0]} userData={{ baseOpacity: 1 }}>
            <coneGeometry args={[0.14, 0.4, 16]} />
            <meshBasicMaterial color={COL.cyan} blending={THREE.AdditiveBlending} />
          </mesh>
        </group>
      </group>
      {/* Gate rings (individually positioned for exit animation) */}
      {[0, 1, 2, 3].map((i) => {
        const angle = (i / 4) * Math.PI * 2;
        return (
          <mesh
            key={i}
            ref={(el) => { gateRingRefs.current[i] = el; }}
            rotation={[Math.PI / 2, 0, angle]}
            position={[Math.cos(angle) * (R + 0.9), 0, Math.sin(angle) * (R + 0.9)]}
            userData={{ baseOpacity: 0.8 }}
          >
            <torusGeometry args={[0.3, 0.04, 12, 32]} />
            <meshBasicMaterial color={i % 2 ? COL.cyan : COL.orange} blending={THREE.AdditiveBlending} transparent />
          </mesh>
        );
      })}
      {/* Exit flash sphere */}
      <mesh ref={flashRef}>
        <sphereGeometry args={[R * 0.8, 20, 20]} />
        <meshBasicMaterial color={COL.white} blending={THREE.AdditiveBlending} transparent depthWrite={false} />
      </mesh>
      <BigYear text="2024" position={[0, 0, -R - 0.6]} size={1.6} color={COL.violet} opacity={0.13} />
    </group>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  STAGE 5 — AI Internals & Quantum Research  (2× scroll window)
//
//  Split into two clearly-labelled sub-stages that share the same component:
//
//  SUB-STAGE A  (t 0.00 → 0.48): Mechanistic Interpretability
//    Visualises an LLM attention head as a glowing 8×8 heatmap grid.
//    A bright "query" sweep (row highlight) moves down each column, while
//    the attention weights (cell brightness) animate based on a cosine
//    similarity pattern — immediately recognisable to any ML researcher.
//    Labels: token indices, "ATTENTION PATTERN", "QUERY", "KEY", head colour.
//
//  SUB-STAGE B  (t 0.52 → 1.00): Quantum Circuit
//    Three horizontal qubit wires, each labelled |0⟩.
//    Animated gates (H, X, CNOT, Rz) appear as colour-coded boxes.
//    A "run" cursor sweeps left→right, triggering gate flashes in order.
//    A measurement symbol (meter) caps each wire.
//    Labels: gate names, qubit numbers, "QUANTUM CIRCUIT".
// ════════════════════════════════════════════════════════════════════════════
//
//  "Neural-Quantum Bridge": a 3-D neural network whose nodes light up as a
//  photon bounces between two cavity mirrors. The photon path visually unifies
//  LLM mechanistic interpretability with Cavity QED / quantum optics.
//
//  Timeline (t 0→1 over a DOUBLE scroll window):
//    0.00–0.15  Network forms: nodes appear, edges draw in
//    0.15–0.40  Activations propagate layer-by-layer driven by photon
//    0.40–0.65  Attention arcs ignite (skip-layer connections)
//    0.65–0.85  Quantum labels materialise; full steady-state oscillation
//    0.85–1.00  Dissolve / scatter
// ════════════════════════════════════════════════════════════════════════════
function NeuralQuantumStage({ index }: StageProps) {
  const group  = useRef<THREE.Group>(null!);
  const groupA = useRef<THREE.Group>(null!);
  const groupB = useRef<THREE.Group>(null!);
  const hoverT = useRef(0);

  // ── Sub-stage A: Attention heatmap cells ─────────────────────────────────
  const GRID = 8;
  const cellRefs = useRef<(THREE.Mesh | null)[]>([]);

  // ── Sub-stage B: Quantum circuit (3-qubit Quantum Fourier Transform) ──────
  const N_QUBITS = 3;
  const N_GATE_COLS = 8; // Slot 0 to 6 for gates, Slot 7 for measurement
  
  // QFT gates: H, controlled-R2, controlled-R3, H, controlled-R2, H, SWAP
  const GATES: { col: number; qubit: number; label: string; col3: THREE.Color }[] = [
    { col: 0, qubit: 0, label: 'H',    col3: new THREE.Color('#3b6fff') }, // H on q0
    { col: 1, qubit: 0, label: 'R2',   col3: new THREE.Color('#8F00FF') }, // CR2 on q0 (controlled by q1)
    { col: 2, qubit: 0, label: 'R3',   col3: new THREE.Color('#8F00FF') }, // CR3 on q0 (controlled by q2)
    { col: 3, qubit: 1, label: 'H',    col3: new THREE.Color('#3b6fff') }, // H on q1
    { col: 4, qubit: 1, label: 'R2',   col3: new THREE.Color('#8F00FF') }, // CR2 on q1 (controlled by q2)
    { col: 5, qubit: 2, label: 'H',    col3: new THREE.Color('#3b6fff') }, // H on q2
    { col: 6, qubit: 0, label: 'SWAP', col3: new THREE.Color('#00FF9D') }, // SWAP on q0
    { col: 6, qubit: 2, label: 'SWAP', col3: new THREE.Color('#00FF9D') }, // SWAP on q2
  ];

  const CONNECTORS = [
    { col: 1, q1: 0, q2: 1 }, // vertical connection between q0 and q1 for CR2
    { col: 2, q1: 0, q2: 2 }, // vertical connection between q0 and q2 for CR3
    { col: 4, q1: 1, q2: 2 }, // vertical connection between q1 and q2 for CR2
    { col: 6, q1: 0, q2: 2 }, // SWAP vertical line
  ];

  const CONTROL_DOTS = [
    { col: 1, qubit: 1 }, // control dot on q1 for CR2
    { col: 2, qubit: 2 }, // control dot on q2 for CR3
    { col: 4, qubit: 2 }, // control dot on q2 for CR2
  ];

  const gateRefs = useRef<(THREE.Mesh | null)[]>([]);
  const wireRefs = useRef<(THREE.LineSegments | null)[]>([]);  // one per qubit
  const cursorRef = useRef<THREE.Mesh>(null!);

  // ── Attention heatmap geometry ───────────────────────────────────────────
  const { attnWeights, wireGeos } = useMemo(() => {
    const W = GRID * GRID;
    const weights = new Float32Array(W);
    for (let row = 0; row < GRID; row++) {
      let sum = 0;
      for (let col = 0; col <= row; col++) {
        const v = Math.exp(-0.6 * (row - col)) * (1 + 0.5 * (row === col ? 1 : 0));
        weights[row * GRID + col] = v;
        sum += v;
      }
      for (let col = 0; col <= row; col++) weights[row * GRID + col] /= sum;
    }

    const WIRE_LEN = 11.0;
    const wireGeos = Array.from({ length: N_QUBITS }, (_, qi) => {
      const y = (qi - (N_QUBITS - 1) / 2) * -1.1;
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(
        [-WIRE_LEN / 2, y, 0, WIRE_LEN / 2, y, 0], 3,
      ));
      return { geo, y };
    });

    return { attnWeights: weights, wireGeos };
  }, []);

  // ── useFrame: animate both sub-stages ─────────────────────────────────────
  useFrame((state) => {
    const { t, vis } = stageWindow(scrollState.progress, index);
    const g = group.current;
    g.visible = vis > 0.002;
    if (!g.visible) return;
    const time = state.clock.elapsedTime;

    hoverT.current = THREE.MathUtils.lerp(
      hoverT.current,
      nearRay(state.raycaster.ray, new THREE.Vector3(0, 0, 0), 5.5) ? 1 : 0,
      0.06,
    );
    const h = hoverT.current;

    // Sub-stage visibility ranges
    const aVis   = smoothstep(0.00, 0.10, t) * (1 - smoothstep(0.44, 0.54, t)); // 0–0.48
    const bVis   = smoothstep(0.52, 0.62, t) * (1 - smoothstep(0.92, 1.0,  t)); // 0.52–1.0

    // Subtle ambient sway
    g.rotation.y = 0.03 * Math.sin(time * 0.2);
    g.rotation.x = 0;
    g.scale.setScalar(1.0);

    // Apply sub-group opacities
    if (groupA.current) applyOpacity(groupA.current, aVis * vis);
    if (groupB.current) applyOpacity(groupB.current, bVis * vis);

    // ── Sub-stage A: Attention heatmap ──
    const queryRow = Math.floor(((time * (0.5 + h * 0.5)) % 1) * GRID);
    cellRefs.current.forEach((cell, idx) => {
      if (!cell) return;
      const row = Math.floor(idx / GRID);
      const col = idx % GRID;
      const w = attnWeights[row * GRID + col];
      const isActive = row === queryRow;
      const glow = w * (isActive ? 2.5 + h * 1.0 : 0.9) * aVis * vis;
      const mat = cell.material as THREE.MeshStandardMaterial;
      mat.emissive.lerpColors(COL.violet, COL.cyan, Math.min(1, w * 3.5));
      mat.emissiveIntensity = glow;
      mat.opacity = (0.55 + w * 0.45) * aVis * vis;
      mat.transparent = true;
      const scY = 0.85 + (isActive ? 0.6 * w : 0) * aVis;
      cell.scale.set(1, scY, 1);
    });

    // ── Sub-stage B: Quantum circuit ──
    const cursorSpeed = 0.35 + h * 0.25;
    const cursorPos = ((time * cursorSpeed) % 1) * N_GATE_COLS;
    const GATE_PITCH = 11.0 / N_GATE_COLS;
    const GATE_X0    = -5.0;

    // Wire opacity
    wireRefs.current.forEach((wire) => {
      if (!wire) return;
      (wire.material as THREE.LineBasicMaterial).opacity = 0.55 * bVis * vis;
    });

    // Gate flash
    gateRefs.current.forEach((mesh, gi) => {
      if (!mesh) return;
      const gate = GATES[gi];
      const dist = Math.abs(cursorPos - gate.col);
      const flash = Math.exp(-dist * dist * 3.5) * (1.5 + h * 0.8);
      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.emissive.copy(gate.col3);
      mat.emissiveIntensity = 0.6 + flash;
      mat.opacity = (0.70 + flash * 0.25) * bVis * vis;
      mat.transparent = true;
    });

    // Cursor position
    if (cursorRef.current) {
      cursorRef.current.position.x = GATE_X0 + cursorPos * GATE_PITCH;
      const cursorMat = cursorRef.current.material as THREE.MeshBasicMaterial;
      cursorMat.opacity = 0.22 * bVis * vis;
    }
  });

  const CELL_SIZE = 0.44;
  const CELL_GAP  = 0.52;
  const GRID_OFFSET_X = -(GRID - 1) * CELL_GAP * 0.5;
  const GRID_OFFSET_Y =  (GRID - 1) * CELL_GAP * 0.5;

  const GATE_PITCH = 11.0 / N_GATE_COLS;
  const GATE_X0    = -5.0;
  const QUBIT_Y    = (qi: number) => (qi - (N_QUBITS - 1) / 2) * -1.1;
  const GATE_H     = 0.55;

  return (
    <group ref={group}>
      
      {/* ══ Sub-stage A: LLM Attention Pattern ══════════════════════════════ */}
      <group ref={groupA}>
        {/* Row axis label */}
        <Text
          position={[GRID_OFFSET_X - 1.3, 0, 0]}
          fontSize={0.20}
          color={COL.parchment}
          anchorX="center"
          anchorY="middle"
          rotation={[0, 0, Math.PI / 2]}
          letterSpacing={0.08}
          userData={{ baseOpacity: 0.55 }}
        >
          QUERY TOKEN
        </Text>

        {/* Col axis label */}
        <Text
          position={[0, GRID_OFFSET_Y - CELL_GAP * GRID - 0.6, 0]}
          fontSize={0.20}
          color={COL.parchment}
          anchorX="center"
          anchorY="top"
          letterSpacing={0.08}
          userData={{ baseOpacity: 0.55 }}
        >
          KEY TOKEN
        </Text>

        {/* 8×8 heatmap cells */}
        {Array.from({ length: GRID * GRID }).map((_, idx) => {
          const row = Math.floor(idx / GRID);
          const col = idx % GRID;
          const x = GRID_OFFSET_X + col * CELL_GAP;
          const y = GRID_OFFSET_Y - row * CELL_GAP;
          return (
            <mesh
              key={idx}
              ref={(el) => { cellRefs.current[idx] = el; }}
              position={[x, y, 0]}
              userData={{ baseOpacity: 1 }}
            >
              <boxGeometry args={[CELL_SIZE, CELL_SIZE, 0.12]} />
              <meshStandardMaterial
                color={'#04080f'}
                emissive={COL.violet}
                emissiveIntensity={0.1}
                metalness={0.2}
                roughness={0.6}
                transparent
              />
            </mesh>
          );
        })}

        {/* Column / Row index ticks */}
        {Array.from({ length: GRID }).map((_, i) => (
          <Text
            key={`ct${i}`}
            position={[GRID_OFFSET_X + i * CELL_GAP, GRID_OFFSET_Y + 0.65, 0.1]}
            fontSize={0.16}
            color={COL.parchment}
            anchorX="center"
            anchorY="bottom"
            userData={{ baseOpacity: 0.45 }}
          >{String(i)}</Text>
        ))}

        <BigYear text="2025" position={[5.5, GRID_OFFSET_Y + 0.5, -2]} size={1.5} color={COL.cyan} opacity={0.14} />
      </group>

      {/* ══ Sub-stage B: Quantum Fourier Transform Circuit ══════════════════ */}
      <group ref={groupB}>
        {/* Qubit wires + |0> labels */}
        {wireGeos.map(({ geo, y }, qi) => (
          <group key={`q${qi}`}>
            <lineSegments
              ref={(el) => { wireRefs.current[qi] = el; }}
              geometry={geo}
              userData={{ baseOpacity: 1 }}
            >
              <lineBasicMaterial color={COL.parchment} transparent />
            </lineSegments>
            {/* |0> initial state label */}
            <Text
              position={[GATE_X0 - 1.1, y, 0]}
              fontSize={0.28}
              color={COL.cyan}
              anchorX="right"
              anchorY="middle"
              userData={{ baseOpacity: 0.9 }}
            >
              {`|0>`}
            </Text>
            {/* Qubit index */}
            <Text
              position={[GATE_X0 - 1.1, y - 0.36, 0]}
              fontSize={0.16}
              color={COL.parchment}
              anchorX="right"
              anchorY="middle"
              userData={{ baseOpacity: 0.5 }}
            >
              {`q${qi}`}
            </Text>
            {/* Measurement symbol at end (M in a box) */}
            <mesh position={[GATE_X0 + (N_GATE_COLS - 0.5) * GATE_PITCH, y, 0]} userData={{ baseOpacity: 0.9 }}>
              <boxGeometry args={[GATE_H * 0.9, GATE_H * 0.9, 0.06]} />
              <meshStandardMaterial color={'#14202e'} emissive={COL.gold} emissiveIntensity={0.7} metalness={0.3} roughness={0.4} transparent />
            </mesh>
            <Text
              position={[GATE_X0 + (N_GATE_COLS - 0.5) * GATE_PITCH, y, 0.07]}
              fontSize={0.22}
              color={COL.gold}
              anchorX="center"
              anchorY="middle"
              userData={{ baseOpacity: 0.95 }}
            >M</Text>
          </group>
        ))}

        {/* QFT control connectors */}
        {CONNECTORS.map(({ col, q1, q2 }, ci) => {
          const x = GATE_X0 + col * GATE_PITCH;
          const y1 = QUBIT_Y(q1); const y2 = QUBIT_Y(q2);
          const mid = (y1 + y2) / 2;
          const h2  = Math.abs(y1 - y2);
          return (
            <mesh key={`qft-v${ci}`} position={[x, mid, 0.01]} userData={{ baseOpacity: 0.8 }}>
              <boxGeometry args={[0.025, h2, 0.01]} />
              <meshBasicMaterial color={COL.cyan} blending={THREE.AdditiveBlending} transparent />
            </mesh>
          );
        })}

        {/* QFT control dots */}
        {CONTROL_DOTS.map(({ col, qubit }, i) => {
          const x = GATE_X0 + col * GATE_PITCH;
          const y = QUBIT_Y(qubit);
          return (
            <mesh key={`dot-${i}`} position={[x, y, 0.05]} userData={{ baseOpacity: 0.9 }}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshBasicMaterial color={COL.cyan} transparent />
            </mesh>
          );
        })}

        {/* Gate boxes */}
        {GATES.map((gate, gi) => {
          const x = GATE_X0 + gate.col * GATE_PITCH;
          const y = QUBIT_Y(gate.qubit);
          return (
            <group key={gi}>
              <mesh
                ref={(el) => { gateRefs.current[gi] = el; }}
                position={[x, y, 0.02]}
                userData={{ baseOpacity: 1 }}
              >
                <boxGeometry args={[GATE_H * 0.85, GATE_H * 0.85, 0.10]} />
                <meshStandardMaterial
                  color={'#060d1a'}
                  emissive={gate.col3}
                  emissiveIntensity={0.8}
                  metalness={0.25}
                  roughness={0.5}
                  transparent
                />
              </mesh>
              <Text
                position={[x, y, 0.10]}
                fontSize={gate.label.length > 1 ? 0.16 : 0.22}
                color={'#ffffff'}
                anchorX="center"
                anchorY="middle"
                userData={{ baseOpacity: 0.95 }}
              >
                {gate.label}
              </Text>
            </group>
          );
        })}

        {/* Execution cursor (thin vertical plane) */}
        <mesh ref={cursorRef} userData={{ baseOpacity: 1 }}>
          <boxGeometry args={[0.04, 4.5, 0.04]} />
          <meshBasicMaterial color={COL.white} blending={THREE.AdditiveBlending} transparent depthWrite={false} />
        </mesh>
      </group>

    </group>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  STAGE 6 — Lattices & The Quantum Frontier (crystal lattice)
//  Hover: points scatter outward and re-coalesce, colour shifts cyan→white.
// ════════════════════════════════════════════════════════════════════════════
function LatticeStage({ index }: StageProps) {
  const group     = useRef<THREE.Group>(null!);
  const pointsRef = useRef<THREE.Points>(null!);
  const linesRef  = useRef<THREE.LineSegments>(null!);
  const starsRef  = useRef<THREE.Points>(null!);
  const hoverT    = useRef(0);
  const G = 6;

  const { pointGeo, lineGeo, base, starGeo } = useMemo(() => {
    const spacing = 0.95;
    const base: THREE.Vector3[] = [];
    const half = ((G - 1) * spacing) / 2;
    for (let i = 0; i < G; i++)
      for (let j = 0; j < G; j++)
        for (let k = 0; k < G; k++)
          base.push(new THREE.Vector3(i * spacing - half, j * spacing - half, k * spacing - half));

    const pPos: number[] = [];
    base.forEach((p) => pPos.push(p.x, p.y, p.z));
    const pointGeo = new THREE.BufferGeometry();
    pointGeo.setAttribute('position', new THREE.Float32BufferAttribute(pPos.slice(), 3));

    const lSeg: number[] = [];
    const idx = (i: number, j: number, k: number) => (i * G + j) * G + k;
    for (let i = 0; i < G; i++)
      for (let j = 0; j < G; j++)
        for (let k = 0; k < G; k++) {
          const a = base[idx(i, j, k)];
          if (i + 1 < G) { const b = base[idx(i + 1, j, k)]; lSeg.push(a.x, a.y, a.z, b.x, b.y, b.z); }
          if (j + 1 < G) { const b = base[idx(i, j + 1, k)]; lSeg.push(a.x, a.y, a.z, b.x, b.y, b.z); }
          if (k + 1 < G) { const b = base[idx(i, j, k + 1)]; lSeg.push(a.x, a.y, a.z, b.x, b.y, b.z); }
        }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(lSeg, 3));

    const stars: number[] = [];
    for (let i = 0; i < 1500; i++) {
      const r  = 9 + Math.random() * 16;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      stars.push(r * Math.sin(ph) * Math.cos(th), r * Math.sin(ph) * Math.sin(th), r * Math.cos(ph));
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(stars, 3));
    return { pointGeo, lineGeo, base, starGeo };
  }, []);

  useFrame((state) => {
    const { t, vis } = stageWindow(scrollState.progress, index);
    const g = group.current;
    g.visible = vis > 0.002;
    if (!g.visible) return;
    const time = state.clock.elapsedTime;
    g.position.set(0, 0.1, 0);
    g.rotation.y = time * 0.2;
    g.rotation.x = 0.2 * Math.sin(time * 0.25);

    hoverT.current = THREE.MathUtils.lerp(
      hoverT.current,
      nearRay(state.raycaster.ray, new THREE.Vector3(0, 0.1, 0), 3.5) ? 1 : 0,
      0.08,
    );
    const h = hoverT.current;

    const grow    = smoothstep(0.55, 1, t);
    // Hover causes brief extra scatter then re-coalescence
    const hoverScatter = h * Math.sin(time * 1.5) * 0.4;
    const expand  = 1 + grow * 2.4 + hoverScatter;
    const dissolve = 1 - grow * 0.82;

    const ppos = pointGeo.attributes.position as THREE.BufferAttribute;
    const lattice: THREE.Vector3[] = [];
    for (let i = 0; i < base.length; i++) {
      const p  = base[i];
      const dx = 0.09 * Math.sin(time * 2   + p.y * 3 + p.z);
      const dy = 0.09 * Math.sin(time * 2.2 + p.x * 3 + p.z);
      const dz = 0.09 * Math.sin(time * 1.8 + p.x * 3 + p.y);
      const v  = new THREE.Vector3((p.x + dx) * expand, (p.y + dy) * expand, (p.z + dz) * expand);
      lattice.push(v);
      ppos.setXYZ(i, v.x, v.y, v.z);
    }
    ppos.needsUpdate = true;

    const lpos = lineGeo.attributes.position as THREE.BufferAttribute;
    let s = 0;
    const idx = (i: number, j: number, k: number) => (i * G + j) * G + k;
    for (let i = 0; i < G; i++)
      for (let j = 0; j < G; j++)
        for (let k = 0; k < G; k++) {
          const a = lattice[idx(i, j, k)];
          if (i + 1 < G) { const b = lattice[idx(i + 1, j, k)]; lpos.setXYZ(s++, a.x, a.y, a.z); lpos.setXYZ(s++, b.x, b.y, b.z); }
          if (j + 1 < G) { const b = lattice[idx(i, j + 1, k)]; lpos.setXYZ(s++, a.x, a.y, a.z); lpos.setXYZ(s++, b.x, b.y, b.z); }
          if (k + 1 < G) { const b = lattice[idx(i, j, k + 1)]; lpos.setXYZ(s++, a.x, a.y, a.z); lpos.setXYZ(s++, b.x, b.y, b.z); }
        }
    lpos.needsUpdate = true;

    if (pointsRef.current) {
      const pMat = pointsRef.current.material as THREE.PointsMaterial;
      // Hover: shift toward white
      pMat.color.setHSL(0.45 + 0.12 * Math.sin(time * 0.3), 0.9 - h * 0.4, 0.6 + h * 0.3);
      pMat.opacity = vis * dissolve * (1 + h * 0.3);
    }

    applyOpacity(g, vis);
    (linesRef.current.material as THREE.LineBasicMaterial).opacity = vis * 0.3 * dissolve;
    starsRef.current.rotation.y = time * 0.02;
    (starsRef.current.material as THREE.PointsMaterial).opacity = vis * (0.18 + 0.17 * grow);
  });

  return (
    <group ref={group}>
      <points ref={starsRef} geometry={starGeo}>
        <pointsMaterial color={COL.white} size={0.06} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} transparent />
      </points>
      <lineSegments ref={linesRef} geometry={lineGeo} userData={{ baseOpacity: 0.3 }}>
        <lineBasicMaterial color={COL.violet} blending={THREE.AdditiveBlending} transparent />
      </lineSegments>
      <points ref={pointsRef} geometry={pointGeo} userData={{ baseOpacity: 1 }}>
        <pointsMaterial color={COL.cyan} size={0.15} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} transparent />
      </points>
      <BigYear text="2026" position={[0, 4, -4]} size={1.8} color={COL.cyan} opacity={0.16} />
    </group>
  );
}

// ════════════════════════════════════════════════════════════════════════════
export default function WorldlineStages() {
  return (
    <group>
      <pointLight position={[5, 5, 7]}   intensity={55} color={'#ffffff'} distance={50} />
      <pointLight position={[-6, -3, 5]} intensity={30} color={'#8F00FF'} distance={50} />
      <pointLight position={[0, 2, 6]}   intensity={25} color={'#00FF9D'} distance={40} />
      <AmbientField />
      <CircuitStage     index={0} />
      <ModellingStage   index={1} />
      <NeuroStage       index={2} />
      <FlowStage        index={3} />
      <BlochStage       index={4} />
      <NeuralQuantumStage index={5} />
      <LatticeStage     index={6} />
    </group>
  );
}
