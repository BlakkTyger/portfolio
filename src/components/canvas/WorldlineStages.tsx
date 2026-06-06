'use client'

/*
 * WorldlineStages — seven fully procedural Three.js stages for the Journey
 * section, plus a persistent ambient field so the scene never reads as a flat
 * black void. No images are used.
 *
 * Each stage owns 1/7 of the section's scroll progress and computes its own
 * local progress `t` and visibility `vis`. Compact stages are offset to the
 * side opposite their narrative card; field stages stay centered. Big faint
 * year numerals are projected directly into 3D space (drei <Text>).
 */

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { scrollState } from './worldlineState';

// ─── Palette ────────────────────────────────────────────────────────────────
const COL = {
  cyan: new THREE.Color('#00FF9D'),
  violet: new THREE.Color('#8F00FF'),
  parchment: new THREE.Color('#c8b98a'),
  orange: new THREE.Color('#F97316'),
  white: new THREE.Color('#F0F0F0'),
  blue: new THREE.Color('#3b6fff'),
};

const STAGE_COUNT = 7;

// ─── Math helpers ─────────────────────────────────────────────────────────────
function smoothstep(a: number, b: number, x: number) {
  const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
}

function stageWindow(progress: number, index: number) {
  const width = 1 / STAGE_COUNT;
  const start = index * width;
  const t = THREE.MathUtils.clamp((progress - start) / width, 0, 1);
  const fadeIn = smoothstep(0.0, 0.16, t);
  const fadeOut = index === STAGE_COUNT - 1 ? 1 : 1 - smoothstep(0.82, 1.0, t);
  return { t, vis: fadeIn * fadeOut };
}

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
//  AMBIENT FIELD — always-on faint nebula + grid so the scene has depth
// ════════════════════════════════════════════════════════════════════════════
function AmbientField() {
  const neb = useRef<THREE.Points>(null!);
  const grid = useRef<THREE.LineSegments>(null!);

  const { nebGeo, gridGeo } = useMemo(() => {
    const N = 900;
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      // eslint-disable-next-line react-hooks/purity
      pos[i * 3] = (Math.random() - 0.5) * 26;
      // eslint-disable-next-line react-hooks/purity
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      // eslint-disable-next-line react-hooks/purity
      pos[i * 3 + 2] = -9 + Math.random() * 11;
      // eslint-disable-next-line react-hooks/purity
      const c = Math.random() < 0.5 ? COL.cyan : COL.violet;
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    const nebGeo = new THREE.BufferGeometry();
    nebGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    nebGeo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));

    // faint perspective grid far behind
    const seg: number[] = [];
    const span = 30, step = 2, z = -8;
    for (let x = -span; x <= span; x += step) { seg.push(x, -span, z, x, span, z); }
    for (let y = -span; y <= span; y += step) { seg.push(-span, y, z, span, y, z); }
    const gridGeo = new THREE.BufferGeometry();
    gridGeo.setAttribute('position', new THREE.Float32BufferAttribute(seg, 3));
    return { nebGeo, gridGeo };
  }, []);

  useFrame((state) => {
    const p = scrollState.progress;
    const vis = smoothstep(0.0, 0.04, p) * (1 - smoothstep(0.97, 1.0, p));
    const time = state.clock.elapsedTime;
    if (neb.current) {
      neb.current.visible = vis > 0.001;
      neb.current.rotation.z = time * 0.01;
      (neb.current.material as THREE.PointsMaterial).opacity = vis * 0.5;
    }
    if (grid.current) {
      grid.current.visible = vis > 0.001;
      grid.current.rotation.z = Math.sin(time * 0.05) * 0.05;
      (grid.current.material as THREE.LineBasicMaterial).opacity = vis * 0.05;
    }
  });

  return (
    <group>
      <points ref={neb} geometry={nebGeo}>
        <pointsMaterial size={0.06} sizeAttenuation vertexColors transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
      <lineSegments ref={grid} geometry={gridGeo}>
        <lineBasicMaterial color={COL.parchment} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </lineSegments>
    </group>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  STAGE 1 — Electronics & Foundations (circuit board) · drifts in (PATH)
// ════════════════════════════════════════════════════════════════════════════
function CircuitStage({ index }: StageProps) {
  const group = useRef<THREE.Group>(null!);
  const flowRef = useRef<THREE.Points>(null!);

  const { traceGeo, flowPaths, chips } = useMemo(() => {
    const segs: number[] = [];
    const paths: THREE.Vector3[][] = [];
    // eslint-disable-next-line react-hooks/purity
    const rng = (a: number, b: number) => a + Math.random() * (b - a);
    for (let i = 0; i < 22; i++) {
      const z = 0.09;
      const x0 = rng(-2.7, 2.7);
      const y0 = rng(-1.6, 1.6);
      const midX = THREE.MathUtils.clamp(x0 + rng(-1.3, 1.3), -2.9, 2.9);
      const y1 = THREE.MathUtils.clamp(y0 + rng(-1.3, 1.3), -1.7, 1.7);
      const x1 = THREE.MathUtils.clamp(midX + rng(-1.3, 1.3), -2.9, 2.9);
      const p0 = new THREE.Vector3(x0, y0, z);
      const p1 = new THREE.Vector3(midX, y0, z);
      const p2 = new THREE.Vector3(midX, y1, z);
      const p3 = new THREE.Vector3(x1, y1, z);
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

  useFrame((state) => {
    const { t, vis } = stageWindow(scrollState.progress, index);
    const g = group.current;
    g.visible = vis > 0.002;
    if (!g.visible) return;
    const time = state.clock.elapsedTime;
    const settle = smoothstep(0, 0.32, t);
    g.position.x = THREE.MathUtils.lerp(-7, 2.6, settle);
    g.position.y = THREE.MathUtils.lerp(-3.5, 0.2, settle);
    g.rotation.x = -0.5 + 0.06 * Math.sin(time * 0.5);
    g.rotation.y = (1 - settle) * 1.0 - 0.45 + 0.18 * Math.sin(time * 0.35);
    g.rotation.z = 0.04 * Math.sin(time * 0.4);

    const pos = flowGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < flowPaths.length; i++) {
      const pts = flowPaths[i];
      const f = (time * 0.4 + i * 0.111) % 1;
      const p = pts[Math.floor(f * (pts.length - 1))];
      pos.setXYZ(i, p.x, p.y, p.z);
    }
    // eslint-disable-next-line react-hooks/immutability
    pos.needsUpdate = true;
    if (flowRef.current) (flowRef.current.material as THREE.PointsMaterial).opacity = vis * (0.6 + 0.4 * Math.sin(time * 4));

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
        <mesh key={i} position={c.pos} userData={{ baseOpacity: 1 }}>
          <boxGeometry args={c.size} />
          <meshStandardMaterial color={'#11151a'} emissive={COL.violet} emissiveIntensity={0.3} metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
      <BigYear text="2018" position={[0, 0, -1.2]} size={1.6} color={COL.cyan} opacity={0.14} />
    </group>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  STAGE 2 — 3D Modelling & Sustainability (wireframe solid) · in place
// ════════════════════════════════════════════════════════════════════════════
function ModellingStage({ index }: StageProps) {
  const group = useRef<THREE.Group>(null!);
  const edges = useRef<THREE.LineSegments>(null!);
  const solid = useRef<THREE.Mesh>(null!);

  const { edgeGeo, solidGeo, edgeCount } = useMemo(() => {
    const solidGeo = new THREE.IcosahedronGeometry(2.6, 1);
    const edgeGeo = new THREE.EdgesGeometry(solidGeo, 1);
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
    g.rotation.y = time * 0.35;
    g.rotation.x = 0.25 * Math.sin(time * 0.4);

    const build = smoothstep(0.05, 0.55, t);
    edges.current.geometry.setDrawRange(0, Math.floor(edgeCount * build));
    const s = 0.9 + 0.06 * Math.sin(time * 1.4);
    solid.current.scale.setScalar(build * s);

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
      <mesh userData={{ baseOpacity: 0.9 }}>
        <icosahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial color={COL.cyan} emissive={COL.cyan} emissiveIntensity={1.3} />
      </mesh>
      <BigYear text="2020" position={[0, 0, -2.4]} size={1.8} color={COL.parchment} opacity={0.14} />
    </group>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  STAGE 3 — Computational Neuroscience (particle brain) · in place, overwhelming
// ════════════════════════════════════════════════════════════════════════════
function NeuroStage({ index }: StageProps) {
  const group = useRef<THREE.Group>(null!);
  const signalsRef = useRef<THREE.Points>(null!);
  const N = 1300;

  const { pointGeo, edgeGeo, signalGeo, signalPairs } = useMemo(() => {
    const verts: THREE.Vector3[] = [];
    const pp = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      // eslint-disable-next-line react-hooks/purity
      const u = Math.random();
      // eslint-disable-next-line react-hooks/purity
      const v = Math.random();
      const theta = u * Math.PI * 2;
      const phi = Math.acos(2 * v - 1);
      // eslint-disable-next-line react-hooks/purity
      const r = 2.5 + (Math.random() - 0.5) * 0.4;
      const x = r * 1.3 * Math.sin(phi) * Math.cos(theta);
      const y = r * 0.95 * Math.cos(phi);
      const z = r * 1.0 * Math.sin(phi) * Math.sin(theta);
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
    const edgeGeo = new THREE.BufferGeometry();
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
    g.position.set(0, 0.1 + 0.14 * Math.sin(time * 0.6), 0);
    g.rotation.y = time * 0.22;
    const pulse = 1 + 0.03 * Math.sin(time * 2.2);
    g.scale.setScalar(THREE.MathUtils.lerp(0.5, 1, smoothstep(0, 0.3, t)) * pulse);

    const pos = signalGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < signalPairs.length; i++) {
      const [a, b] = signalPairs[i];
      const f = (time * 0.8 + i * 0.083) % 1;
      pos.setXYZ(i, a.x + (b.x - a.x) * f, a.y + (b.y - a.y) * f, a.z + (b.z - a.z) * f);
    }
    // eslint-disable-next-line react-hooks/immutability
    pos.needsUpdate = true;
    if (signalsRef.current) (signalsRef.current.material as THREE.PointsMaterial).opacity = vis;

    applyOpacity(g, vis);
  });

  return (
    <group ref={group}>
      <points geometry={pointGeo} userData={{ baseOpacity: 0.8 }}>
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
//  STAGE 4 — F1 Aero → Quantum Spark · low-poly car on a curved path (PATH)
// ════════════════════════════════════════════════════════════════════════════
function F1Car() {
  return (
    <group>
      {/* chassis */}
      <mesh userData={{ baseOpacity: 1 }}>
        <boxGeometry args={[2.6, 0.32, 0.7]} />
        <meshStandardMaterial color={'#11161f'} emissive={COL.cyan} emissiveIntensity={0.12} metalness={0.7} roughness={0.3} />
      </mesh>
      {/* nose cone */}
      <mesh position={[1.7, -0.02, 0]} rotation={[0, 0, -Math.PI / 2]} userData={{ baseOpacity: 1 }}>
        <coneGeometry args={[0.22, 1.0, 8]} />
        <meshStandardMaterial color={'#161c28'} emissive={COL.orange} emissiveIntensity={0.18} metalness={0.7} roughness={0.3} />
      </mesh>
      {/* cockpit halo */}
      <mesh position={[-0.1, 0.28, 0]} userData={{ baseOpacity: 1 }}>
        <sphereGeometry args={[0.34, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={'#0d1117'} emissive={COL.cyan} emissiveIntensity={0.2} metalness={0.6} roughness={0.35} />
      </mesh>
      {/* front wing */}
      <mesh position={[1.5, -0.2, 0]} userData={{ baseOpacity: 1 }}>
        <boxGeometry args={[0.4, 0.05, 1.5]} />
        <meshStandardMaterial color={'#1e2a3a'} emissive={COL.parchment} emissiveIntensity={0.1} metalness={0.6} roughness={0.4} />
      </mesh>
      {/* rear wing */}
      <mesh position={[-1.25, 0.28, 0]} userData={{ baseOpacity: 1 }}>
        <boxGeometry args={[0.34, 0.42, 1.3]} />
        <meshStandardMaterial color={'#1e2a3a'} emissive={COL.violet} emissiveIntensity={0.18} metalness={0.6} roughness={0.4} />
      </mesh>
      {/* wheels */}
      {[[0.95, 0.62], [0.95, -0.62], [-0.95, 0.62], [-0.95, -0.62]].map(([x, z], i) => (
        <mesh key={i} position={[x, -0.18, z]} rotation={[Math.PI / 2, 0, 0]} userData={{ baseOpacity: 1 }}>
          <cylinderGeometry args={[0.34, 0.34, 0.26, 16]} />
          <meshStandardMaterial color={'#0a0a0a'} emissive={COL.cyan} emissiveIntensity={0.08} metalness={0.5} roughness={0.5} />
        </mesh>
      ))}
      {/* exhaust glow */}
      <mesh position={[-1.5, 0.05, 0]} userData={{ baseOpacity: 0.7 }}>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshBasicMaterial color={COL.orange} blending={THREE.AdditiveBlending} transparent depthWrite={false} />
      </mesh>
    </group>
  );
}

function FlowStage({ index }: StageProps) {
  const group = useRef<THREE.Group>(null!);
  const carRef = useRef<THREE.Group>(null!);
  const streamRef = useRef<THREE.Points>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);
  const coreRef = useRef<THREE.Mesh>(null!);
  const M = 1800;

  const { streamGeo, seeds } = useMemo(() => {
    const seeds: { y: number; z: number; off: number; speed: number }[] = [];
    for (let i = 0; i < M; i++) {
      // eslint-disable-next-line react-hooks/purity
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

    // PATH: car streaks in from the right, brakes/hovers at centre, exits left.
    const carX = t < 0.4
      ? THREE.MathUtils.lerp(7.5, 0, smoothstep(0, 0.4, t))
      : THREE.MathUtils.lerp(0, -8, smoothstep(0.6, 1, t));
    const carY = Math.sin(t * Math.PI) * 0.6 - 0.2 + 0.1 * Math.sin(time * 3);
    carRef.current.position.set(carX, carY, 0);
    carRef.current.rotation.z = (t < 0.4 ? -0.06 : 0.05) + 0.03 * Math.sin(time * 5);
    carRef.current.rotation.y = 0.15 * Math.sin(time * 0.6);

    const collapse = smoothstep(0.62, 0.96, t);

    // aerodynamic streamlines flowing past, deflecting around the car
    const pos = streamGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < M; i++) {
      const s = seeds[i];
      const f = (time * s.speed * 0.28 + s.off) % 1;
      let x = THREE.MathUtils.lerp(8, -8, f);
      const rel = x - carX;
      const bodyMask = Math.exp(-(rel * rel) * 0.18);
      const yDefl = s.y + Math.sign(s.y || 1) * bodyMask * 1.0 + 0.15 * Math.sin(x * 1.5 + time * 4);
      const zDefl = s.z + Math.sign(s.z || 1) * bodyMask * 0.6;
      x = THREE.MathUtils.lerp(x, carX, collapse);
      pos.setXYZ(i, x, THREE.MathUtils.lerp(yDefl, carY, collapse), THREE.MathUtils.lerp(zDefl, 0, collapse));
    }
    // eslint-disable-next-line react-hooks/immutability
    pos.needsUpdate = true;

    // quantum spark ring + core at the car as it dematerialises
    ringRef.current.position.set(carX, carY, 0);
    coreRef.current.position.set(carX, carY, 0);
    ringRef.current.scale.setScalar(0.001 + collapse * (2.0 + 0.7 * Math.sin(time * 3)));
    coreRef.current.scale.setScalar(0.001 + collapse * (0.9 + 0.25 * Math.sin(time * 6)));
    ringRef.current.rotation.z = time * 0.8;

    applyOpacity(g, vis);
    (streamRef.current.material as THREE.PointsMaterial).opacity = vis * (1 - collapse * 0.7);
    (ringRef.current.material as THREE.MeshBasicMaterial).opacity = vis * collapse;
    (coreRef.current.material as THREE.MeshBasicMaterial).opacity = vis * collapse;
    // car fades out as it converts into the spark
    carRef.current.traverse((c) => {
      const mat = (c as THREE.Mesh).material as (THREE.Material & { opacity: number }) | undefined;
      if (mat) { mat.transparent = true; mat.opacity = ((c.userData.baseOpacity as number) ?? 1) * vis * (1 - collapse); }
    });
  });

  return (
    <group ref={group} scale={1.15}>
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
//  STAGE 5 — Quantum Computing (Bloch sphere) · gyroscopic, in place
// ════════════════════════════════════════════════════════════════════════════
function BlochStage({ index }: StageProps) {
  const group = useRef<THREE.Group>(null!);
  const vector = useRef<THREE.Group>(null!);
  const gatesRef = useRef<THREE.Group>(null!);
  const R = 2.4;

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
    g.rotation.y = time * 0.3;
    g.rotation.z = 0.12 * Math.sin(time * 0.5);
    g.scale.setScalar(THREE.MathUtils.lerp(0.5, 1, smoothstep(0, 0.3, t)));

    const polar = Math.PI * (0.3 + 0.35 * (0.5 + 0.5 * Math.sin(time * 0.7)));
    vector.current.rotation.set(0, time * 1.2, 0);
    vector.current.children[0].rotation.z = polar;

    gatesRef.current.rotation.y = -time * 0.6;
    gatesRef.current.rotation.x = 0.4;

    applyOpacity(g, vis);
  });

  return (
    <group ref={group}>
      <lineSegments geometry={latLong} userData={{ baseOpacity: 0.3 }}>
        <lineBasicMaterial color={COL.violet} blending={THREE.AdditiveBlending} />
      </lineSegments>
      <lineSegments geometry={axes} userData={{ baseOpacity: 0.4 }}>
        <lineBasicMaterial color={COL.parchment} blending={THREE.AdditiveBlending} />
      </lineSegments>
      <mesh userData={{ baseOpacity: 0.05 }}>
        <sphereGeometry args={[R - 0.02, 32, 32]} />
        <meshBasicMaterial color={COL.violet} transparent depthWrite={false} />
      </mesh>
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
      <group ref={gatesRef}>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} rotation={[Math.PI / 2, 0, (i / 4) * Math.PI * 2]} position={[Math.cos((i / 4) * Math.PI * 2) * (R + 0.9), 0, Math.sin((i / 4) * Math.PI * 2) * (R + 0.9)]} userData={{ baseOpacity: 0.8 }}>
            <torusGeometry args={[0.3, 0.04, 12, 32]} />
            <meshBasicMaterial color={i % 2 ? COL.cyan : COL.orange} blending={THREE.AdditiveBlending} />
          </mesh>
        ))}
      </group>
      <BigYear text="2024" position={[0, 0, -R - 0.6]} size={1.6} color={COL.violet} opacity={0.13} />
    </group>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  STAGE 6 — Optical Resonator Cavity (Cavity QED + LLM attention) · PATH-ish
// ════════════════════════════════════════════════════════════════════════════
function CavityStage({ index }: StageProps) {
  const group = useRef<THREE.Group>(null!);
  const photon = useRef<THREE.Mesh>(null!);
  const beam = useRef<THREE.Mesh>(null!);
  const standing = useRef<THREE.Mesh>(null!);
  const gridRef = useRef<THREE.Points>(null!);

  const MX = 2.7; // mirror x positions ±MX
  const { gridGeo, gridCoords, GX, GY } = useMemo(() => {
    const GX = 18, GY = 11;
    const pos: number[] = [];
    const coords: { col: number }[] = [];
    for (let i = 0; i < GX; i++) {
      for (let j = 0; j < GY; j++) {
        pos.push((i / (GX - 1) - 0.5) * 4.8, (j / (GY - 1) - 0.5) * 3.0, -1.6);
        coords.push({ col: i });
      }
    }
    const gridGeo = new THREE.BufferGeometry();
    gridGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    gridGeo.setAttribute('color', new THREE.Float32BufferAttribute(new Float32Array(pos.length), 3));
    return { gridGeo, gridCoords: coords, GX, GY };
  }, []);

  useFrame((state) => {
    const { t, vis } = stageWindow(scrollState.progress, index);
    const g = group.current;
    g.visible = vis > 0.002;
    if (!g.visible) return;
    const time = state.clock.elapsedTime;
    const settle = smoothstep(0, 0.3, t);
    g.position.x = THREE.MathUtils.lerp(-3.0, -2.6, settle);
    g.position.y = 0.1;
    g.rotation.y = 0.18 * Math.sin(time * 0.3);

    // photon bounces between the mirrors; beam follows it; standing wave pulses
    const innerX = MX - 0.35;
    const bounce = Math.sin(time * 2.2) * innerX;
    photon.current.position.x = bounce;
    beam.current.scale.y = Math.abs(bounce) + 0.05;
    beam.current.position.x = bounce / 2;
    (beam.current.material as THREE.MeshBasicMaterial).opacity = vis * (0.45 + 0.3 * Math.abs(Math.sin(time * 2.2)));
    (standing.current.material as THREE.MeshBasicMaterial).opacity = vis * (0.12 + 0.06 * Math.sin(time * 6));

    // LLM attention grid: a luminous wave sweeps column by column
    const colAttr = gridGeo.attributes.color as THREE.BufferAttribute;
    const sweep = ((time * 0.5) % 1) * GX;
    for (let k = 0; k < gridCoords.length; k++) {
      const d = Math.abs(gridCoords[k].col - sweep);
      const dd = Math.min(d, GX - d);
      const b = Math.exp(-dd * dd * 0.5);
      colAttr.setXYZ(k, COL.violet.r * 0.4 + COL.cyan.r * b, COL.violet.g * 0.4 + COL.cyan.g * b, COL.violet.b * 0.4 + COL.cyan.b * b);
    }
    // eslint-disable-next-line react-hooks/immutability
    colAttr.needsUpdate = true;
    void GY;

    applyOpacity(g, vis);
  });

  return (
    <group ref={group} scale={1.1}>
      {/* concave spherical-cap mirrors facing each other */}
      <mesh position={[-MX, 0, 0]} rotation={[0, Math.PI / 2, 0]} userData={{ baseOpacity: 0.95 }}>
        <sphereGeometry args={[2.6, 40, 24, 0, Math.PI * 2, 0, Math.PI * 0.32]} />
        <meshStandardMaterial color={'#aeb8c4'} emissive={COL.cyan} emissiveIntensity={0.22} metalness={0.85} roughness={0.18} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[MX, 0, 0]} rotation={[0, -Math.PI / 2, 0]} userData={{ baseOpacity: 0.95 }}>
        <sphereGeometry args={[2.6, 40, 24, 0, Math.PI * 2, 0, Math.PI * 0.32]} />
        <meshStandardMaterial color={'#aeb8c4'} emissive={COL.cyan} emissiveIntensity={0.22} metalness={0.85} roughness={0.18} side={THREE.DoubleSide} />
      </mesh>

      {/* standing-wave glow (Gaussian mode) */}
      <mesh ref={standing} rotation={[0, 0, Math.PI / 2]} userData={{ baseOpacity: 1 }}>
        <cylinderGeometry args={[0.5, 0.5, MX * 2, 24, 1, true]} />
        <meshBasicMaterial color={COL.cyan} blending={THREE.AdditiveBlending} transparent depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      {/* travelling beam segment */}
      <mesh ref={beam} rotation={[0, 0, Math.PI / 2]} userData={{ baseOpacity: 1 }}>
        <cylinderGeometry args={[0.07, 0.07, 1, 12]} />
        <meshBasicMaterial color={COL.white} blending={THREE.AdditiveBlending} transparent depthWrite={false} />
      </mesh>
      {/* bouncing photon */}
      <mesh ref={photon} userData={{ baseOpacity: 1 }}>
        <sphereGeometry args={[0.18, 20, 20]} />
        <meshBasicMaterial color={COL.white} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* LLM attention-layer grid */}
      <points ref={gridRef} geometry={gridGeo} userData={{ baseOpacity: 0.85 }}>
        <pointsMaterial size={0.1} sizeAttenuation vertexColors blending={THREE.AdditiveBlending} depthWrite={false} transparent />
      </points>
      <BigYear text="2025" position={[0, 2.7, -2.5]} size={1.6} color={COL.cyan} opacity={0.16} />
    </group>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  STAGE 7 — Lattices & Quantum (crystal lattice) · breathes, expands & dissolves
// ════════════════════════════════════════════════════════════════════════════
function LatticeStage({ index }: StageProps) {
  const group = useRef<THREE.Group>(null!);
  const pointsRef = useRef<THREE.Points>(null!);
  const linesRef = useRef<THREE.LineSegments>(null!);
  const starsRef = useRef<THREE.Points>(null!);
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
      // eslint-disable-next-line react-hooks/purity
      const r = 9 + Math.random() * 16;
      // eslint-disable-next-line react-hooks/purity
      const th = Math.random() * Math.PI * 2;
      // eslint-disable-next-line react-hooks/purity
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

    // as the lattice expands it DISSOLVES, so by the time we reach later
    // sections it has faded to a calm, faint cosmic backdrop (item 3 fix).
    const grow = smoothstep(0.55, 1, t);
    const expand = 1 + grow * 2.4;
    const dissolve = 1 - grow * 0.82; // structure fades out as it spreads

    const ppos = pointGeo.attributes.position as THREE.BufferAttribute;
    const lattice: THREE.Vector3[] = [];
    for (let i = 0; i < base.length; i++) {
      const p = base[i];
      const dx = 0.09 * Math.sin(time * 2 + p.y * 3 + p.z);
      const dy = 0.09 * Math.sin(time * 2.2 + p.x * 3 + p.z);
      const dz = 0.09 * Math.sin(time * 1.8 + p.x * 3 + p.y);
      const v = new THREE.Vector3((p.x + dx) * expand, (p.y + dy) * expand, (p.z + dz) * expand);
      lattice.push(v);
      ppos.setXYZ(i, v.x, v.y, v.z);
    }
    // eslint-disable-next-line react-hooks/immutability
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
    // eslint-disable-next-line react-hooks/immutability
    lpos.needsUpdate = true;

    (pointsRef.current.material as THREE.PointsMaterial).color.setHSL(0.45 + 0.12 * Math.sin(time * 0.3), 0.9, 0.6);

    applyOpacity(g, vis);
    // structure dissolves; faint stars persist as the cosmic backdrop
    (pointsRef.current.material as THREE.PointsMaterial).opacity = vis * dissolve;
    (linesRef.current.material as THREE.LineBasicMaterial).opacity = vis * 0.3 * dissolve;
    starsRef.current.rotation.y = time * 0.02;
    // keep the lingering cosmic dust subtle so it doesn't disturb later sections
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
      <pointLight position={[5, 5, 7]} intensity={55} color={'#ffffff'} distance={50} />
      <pointLight position={[-6, -3, 5]} intensity={30} color={'#8F00FF'} distance={50} />
      <pointLight position={[0, 2, 6]} intensity={25} color={'#00FF9D'} distance={40} />
      <AmbientField />
      <CircuitStage index={0} />
      <ModellingStage index={1} />
      <NeuroStage index={2} />
      <FlowStage index={3} />
      <BlochStage index={4} />
      <CavityStage index={5} />
      <LatticeStage index={6} />
    </group>
  );
}
