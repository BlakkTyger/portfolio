'use client'

import { useRef, useMemo, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import {
  starVertexShader, starFragmentShader,
  glowVertexShader, glowFragmentShader,
  shockwaveVertexShader, shockwaveFragmentShader,
  bgStarVertexShader, bgStarFragmentShader,
  blackholeVertexShader, blackholeFragmentShader,
} from './shaders/stellarShaders';

// ─── Timeline (seconds) ───
const T = {
  STAR_FADEIN:     0.2,   // Delay to allow shader compilation on frame 1 (prevents starting lag)
  STAR_STABLE:     0.8,   // Star fully visible
  DEPLETION_START: 2.8,   // Star is stable for a full 2.0 seconds!
  DEPLETION_END:   4.2,   // Fully depleted (red/orange)
  SHRINK_START:    3.9,   // Pre-collapse contraction begins
  COLLAPSE_START:  4.2,   // Core collapse begins
  COLLAPSE_END:    4.8,   // Core fully collapsed
  FLASH_PEAK:      4.85,  // Supernova flash
  EXPLOSION_START: 4.8,   // Supernova begins
  EXPLOSION_END:   5.8,   // Debris fully dispersed
  SHOCKWAVE_START: 4.8,   // Shockwave ring appears
  SHOCKWAVE_END:   6.2,   // Shockwave fades
  BH_START:        5.5,   // Black hole begins forming
  BH_FORMED:       6.6,   // Black hole fully formed
  FALL_START:      6.6,   // Camera begins falling
  FALL_END:        7.8,   // Camera enters event horizon
};

// ─── Helpers ───
const lerp = (a: number, b: number, t: number) => a + (b - a) * Math.min(Math.max(t, 0), 1);
const remap = (v: number, lo: number, hi: number) => Math.min(Math.max((v - lo) / (hi - lo), 0), 1);
const smoothRemap = (v: number, lo: number, hi: number) => {
  const t = remap(v, lo, hi);
  return t * t * (3 - 2 * t); // smoothstep
};
const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 768;

// ───────────────────────────────────────────────
// BACKGROUND STARS (static starfield with twinkle)
// ───────────────────────────────────────────────
function BackgroundStars({ time, cameraDistance }: { time: React.MutableRefObject<number>, cameraDistance: React.MutableRefObject<number> }) {
  const COUNT = isMobile() ? 400 : 800;
  const SPREAD = 25;

  const [geometry, uniforms] = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);
    const phases = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = SPREAD * (0.5 + Math.random() * 0.5);

      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      sizes[i] = 0.8 + Math.random() * 2.0;
      phases[i] = Math.random();
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));

    const u = { 
      uTime: { value: 0 },
      uCameraDistance: { value: 1.0 }, // Added uniform to fade out stars inside event horizon
    };
    return [geo, u];
  }, [COUNT]);

  useFrame(() => {
    uniforms.uTime.value = time.current;
    uniforms.uCameraDistance.value = cameraDistance.current;
  });

  return (
    <points geometry={geometry} renderOrder={-10}>
      <shaderMaterial
        vertexShader={bgStarVertexShader}
        fragmentShader={bgStarFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ───────────────────────────────────────────────
// STAR PARTICLES (main body of the star)
// ───────────────────────────────────────────────
function StarParticles({ uniforms }: { uniforms: Record<string, THREE.IUniform> }) {
  const COUNT = isMobile() ? 800 : 2500; // Reduced for performance
  const RADIUS = 1.5;

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(COUNT * 3);
    const dir = new Float32Array(COUNT * 3);
    const spd = new Float32Array(COUNT);
    const off = new Float32Array(COUNT);
    const siz = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = RADIUS * Math.cbrt(Math.random()); // uniform volume

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      pos[i * 3]     = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      // Explosion direction with jitter
      const jx = x + (Math.random() - 0.5) * 0.4;
      const jy = y + (Math.random() - 0.5) * 0.4;
      const jz = z + (Math.random() - 0.5) * 0.4;
      const len = Math.sqrt(jx * jx + jy * jy + jz * jz) || 1;
      dir[i * 3]     = jx / len;
      dir[i * 3 + 1] = jy / len;
      dir[i * 3 + 2] = jz / len;

      spd[i] = 0.3 + Math.random() * 1.8;
      off[i] = Math.random() * Math.PI * 2;
      siz[i] = 1.5 + Math.random() * 4.0;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aDirection', new THREE.BufferAttribute(dir, 3));
    geo.setAttribute('aSpeed', new THREE.BufferAttribute(spd, 1));
    geo.setAttribute('aOffset', new THREE.BufferAttribute(off, 1));
    geo.setAttribute('aBaseSize', new THREE.BufferAttribute(siz, 1));
    return geo;
  }, [COUNT]);

  return (
    <points geometry={geometry}>
      <shaderMaterial
        vertexShader={starVertexShader}
        fragmentShader={starFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ───────────────────────────────────────────────
// CORONA PARTICLES (larger, softer outer glow)
// ───────────────────────────────────────────────
function CoronaParticles({ uniforms }: { uniforms: Record<string, THREE.IUniform> }) {
  const COUNT = isMobile() ? 100 : 300; // Reduced for performance
  const RADIUS = 2.2;

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(COUNT * 3);
    const dir = new Float32Array(COUNT * 3);
    const spd = new Float32Array(COUNT);
    const off = new Float32Array(COUNT);
    const siz = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = RADIUS * (0.7 + Math.random() * 0.3); // shell

      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const jx = pos[i * 3] + (Math.random() - 0.5) * 0.5;
      const jy = pos[i * 3 + 1] + (Math.random() - 0.5) * 0.5;
      const jz = pos[i * 3 + 2] + (Math.random() - 0.5) * 0.5;
      const len = Math.sqrt(jx * jx + jy * jy + jz * jz) || 1;
      dir[i * 3]     = jx / len;
      dir[i * 3 + 1] = jy / len;
      dir[i * 3 + 2] = jz / len;

      spd[i] = 0.5 + Math.random() * 1.4;
      off[i] = Math.random() * Math.PI * 2;
      siz[i] = 5.0 + Math.random() * 10.0;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aDirection', new THREE.BufferAttribute(dir, 3));
    geo.setAttribute('aSpeed', new THREE.BufferAttribute(spd, 1));
    geo.setAttribute('aOffset', new THREE.BufferAttribute(off, 1));
    geo.setAttribute('aBaseSize', new THREE.BufferAttribute(siz, 1));
    return geo;
  }, [COUNT]);

  return (
    <points geometry={geometry}>
      <shaderMaterial
        vertexShader={starVertexShader}
        fragmentShader={starFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ───────────────────────────────────────────────
// STAR GLOW CORE (billboard volumetric glow)
// ───────────────────────────────────────────────
function StarGlowCore({ uniforms }: { uniforms: Record<string, THREE.IUniform> }) {
  return (
    <mesh renderOrder={1}>
      <planeGeometry args={[6, 6]} />
      <shaderMaterial
        vertexShader={glowVertexShader}
        fragmentShader={glowFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending} // Changed to NormalBlending to prevent blowouts
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ───────────────────────────────────────────────
// SHOCKWAVE RING (expanding supernova ring)
// ───────────────────────────────────────────────
function ShockwaveRing({ uniforms }: { uniforms: Record<string, THREE.IUniform> }) {
  return (
    <mesh renderOrder={2}>
      <planeGeometry args={[12, 12]} />
      <shaderMaterial
        vertexShader={shockwaveVertexShader}
        fragmentShader={shockwaveFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ───────────────────────────────────────────────
// BLACK HOLE FULLSCREEN QUAD
// ───────────────────────────────────────────────
function BlackHoleQuad({ uniforms }: { uniforms: Record<string, THREE.IUniform> }) {
  return (
    <mesh frustumCulled={false} renderOrder={-1}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={blackholeVertexShader}
        fragmentShader={blackholeFragmentShader}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

// ───────────────────────────────────────────────
// MAIN SCENE ORCHESTRATOR
// ───────────────────────────────────────────────
interface Props {
  onFlash: () => void;
  onComplete: () => void;
  onPhaseChange: (phase: number) => void;
}

export default function StellarIntroScene({ onFlash, onComplete, onPhaseChange }: Props) {
  const { size, camera } = useThree();
  const elapsed = useRef(0);
  const flashFired = useRef(false);
  const completeFired = useRef(false);
  const lastPhase = useRef(-1);

  // Camera shake state
  const baseCamera = useRef(new THREE.Vector3(0, 0, 5));
  const shakeIntensity = useRef(0);
  const cameraDistance = useRef(1.0); // Track camera distance to feed background stars

  // ── Shared uniforms ──
  const starUniforms = useMemo(() => ({
    uTime:       { value: 0 },
    uColorPhase: { value: 0 },
    uCollapse:   { value: 0 },
    uExplosion:  { value: 0 },
    uFadeOut:    { value: 0 },
    uShrink:     { value: 0 },
    uFadeIn:     { value: 0 }, // Synchronized particle fade-in
  }), []);

  const coronaUniforms = useMemo(() => ({
    uTime:       { value: 0 },
    uColorPhase: { value: 0 },
    uCollapse:   { value: 0 },
    uExplosion:  { value: 0 },
    uFadeOut:    { value: 0 },
    uShrink:     { value: 0 },
    uFadeIn:     { value: 0 }, // Synchronized corona fade-in
  }), []);

  const glowUniforms = useMemo(() => ({
    uTime:       { value: 0 },
    uColorPhase: { value: 0 },
    uCollapse:   { value: 0 },
    uExplosion:  { value: 0 },
    uIntensity:  { value: 0 },
  }), []);

  const shockwaveUniforms = useMemo(() => ({
    uProgress: { value: 0 },
    uOpacity:  { value: 0 },
  }), []);

  const bhUniforms = useMemo(() => ({
    uTime:           { value: 0 },
    uFormation:      { value: 0 },
    uCameraDistance: { value: 1 },
    uCameraAngle:    { value: 0 },
    uResolution:     { value: new THREE.Vector2(size.width, size.height) },
  }), []);

  // Bloom ref for dynamic intensity
  const bloomIntensityRef = useRef(1.0);

  // Keep resolution in sync
  useFrame(() => {
    bhUniforms.uResolution.value.set(size.width, size.height);
  });

  // ─── ANIMATION LOOP ───
  useFrame((state, delta) => {
    elapsed.current += delta;
    const t = elapsed.current;

    // ── Determine current phase ──
    let phase = 0;
    if (t < T.STAR_STABLE) phase = 0;        // Living star fade-in
    else if (t < T.DEPLETION_END) phase = 1;  // Fuel depletion
    else if (t < T.EXPLOSION_START) phase = 2; // Gravitational collapse
    else if (t < T.BH_FORMED) phase = 3;      // Supernova
    else phase = 4;                            // Black hole + fall-in

    if (phase !== lastPhase.current) {
      lastPhase.current = phase;
      onPhaseChange(phase);
    }

    // ── Star uniforms ──
    starUniforms.uTime.value = t;
    coronaUniforms.uTime.value = t;
    glowUniforms.uTime.value = t;

    // Color phase: 0→1 during depletion
    const colorPhase = smoothRemap(t, T.DEPLETION_START, T.DEPLETION_END);
    starUniforms.uColorPhase.value = colorPhase;
    coronaUniforms.uColorPhase.value = colorPhase;
    glowUniforms.uColorPhase.value = colorPhase;

    // Pre-collapse shrink
    const shrink = smoothRemap(t, T.SHRINK_START, T.COLLAPSE_START);
    starUniforms.uShrink.value = shrink;
    coronaUniforms.uShrink.value = shrink;

    // Collapse: 0→1
    const collapse = smoothRemap(t, T.COLLAPSE_START, T.COLLAPSE_END);
    starUniforms.uCollapse.value = collapse;
    coronaUniforms.uCollapse.value = collapse;
    glowUniforms.uCollapse.value = collapse;

    // Explosion: 0→1
    const explosion = remap(t, T.EXPLOSION_START, T.EXPLOSION_END);
    starUniforms.uExplosion.value = explosion;
    coronaUniforms.uExplosion.value = explosion;
    glowUniforms.uExplosion.value = explosion;

    // Glow intensity
    const fadeIn = smoothRemap(t, T.STAR_FADEIN, T.STAR_STABLE);
    const glowFadeOut = smoothRemap(t, T.EXPLOSION_START, T.BH_START);
    const collapseBright = collapse * (1 - explosion) * 2.0;
    glowUniforms.uIntensity.value = fadeIn * (1 - glowFadeOut) * (1 + collapseBright);

    // Particle fade in/out
    starUniforms.uFadeIn.value = fadeIn;
    coronaUniforms.uFadeIn.value = fadeIn;

    // Fade out particles
    const fadeOut = smoothRemap(t, T.EXPLOSION_END, T.BH_FORMED);
    starUniforms.uFadeOut.value = fadeOut;

    // Corona fades earlier
    const coronaFade = Math.max(smoothRemap(t, T.DEPLETION_START, T.DEPLETION_END) * 0.6, fadeOut);
    coronaUniforms.uFadeOut.value = coronaFade;

    // ── Shockwave ──
    const shockProgress = smoothRemap(t, T.SHOCKWAVE_START, T.SHOCKWAVE_END);
    const shockOpacity = t >= T.SHOCKWAVE_START && t <= T.SHOCKWAVE_END
      ? (1 - shockProgress) * smoothRemap(t, T.SHOCKWAVE_START, T.SHOCKWAVE_START + 0.3)
      : 0;
    shockwaveUniforms.uProgress.value = shockProgress;
    shockwaveUniforms.uOpacity.value = shockOpacity;

    // ── Black hole ──
    bhUniforms.uTime.value = t;
    bhUniforms.uFormation.value = smoothRemap(t, T.BH_START, T.BH_FORMED);
    
    // Fall progress for camera distance and spiral angle
    const fallProgress = smoothRemap(t, T.FALL_START, T.FALL_END);
    const distVal = 1 - fallProgress;
    bhUniforms.uCameraDistance.value = distVal;
    cameraDistance.current = distVal; // Update ref to fade background stars in sync
    // Spiral the camera 1.5 full rotations (3 * PI) as it falls in
    bhUniforms.uCameraAngle.value = fallProgress * Math.PI * 3.0;

    // ── Camera 3D Curvature (Fall phase) ──
    if (t >= T.FALL_START) {
      const fallProgress = smoothRemap(t, T.FALL_START, T.FALL_END);
      
      // Hyper-exponential gravitational Z-acceleration as the camera is pulled in
      const zProgress = Math.pow(fallProgress, 2.5);
      const currentZ = 5.0 * (1.0 - zProgress) + 0.02 * zProgress;
      
      const sweepAngle = fallProgress * Math.PI * 0.8; // Gentle sweep
      const curveRadius = Math.sin(fallProgress * Math.PI) * 1.2; 
      
      camera.position.x = Math.cos(sweepAngle) * curveRadius;
      camera.position.y = Math.sin(sweepAngle) * curveRadius;
      camera.position.z = currentZ;
      
      // Relativistic tidal forces: intense jitter and shake as you approach singularity
      const spaghettificationShake = Math.pow(fallProgress, 4.0) * 0.14;
      camera.position.x += (Math.random() - 0.5) * spaghettificationShake;
      camera.position.y += (Math.random() - 0.5) * spaghettificationShake;
      camera.position.z += (Math.random() - 0.5) * spaghettificationShake;
      
      camera.lookAt(0, 0, 0);
    } else if (t >= T.COLLAPSE_END && t <= T.EXPLOSION_END + 0.5) {
      const shakePhase = remap(t, T.COLLAPSE_END, T.EXPLOSION_END + 0.5);
      // Strong at start, fading out
      shakeIntensity.current = (1 - shakePhase) * 0.08;

      if (shakeIntensity.current > 0.001) {
        const shake = shakeIntensity.current;
        camera.position.x = baseCamera.current.x + (Math.random() - 0.5) * shake;
        camera.position.y = baseCamera.current.y + (Math.random() - 0.5) * shake;
        camera.position.z = baseCamera.current.z + (Math.random() - 0.5) * shake * 0.5;
      }
    } else {
      shakeIntensity.current *= 0.9; // decay
      camera.position.copy(baseCamera.current);
      camera.rotation.set(0, 0, 0);
    }

    // ── Dynamic bloom ──
    if (t >= T.COLLAPSE_END && t <= T.EXPLOSION_END) {
      // Bloom ramps up for supernova
      const supernovaPhase = remap(t, T.COLLAPSE_END, T.EXPLOSION_END);
      bloomIntensityRef.current = lerp(1.2, 3.0, Math.sin(supernovaPhase * Math.PI));
    } else if (t > T.BH_FORMED) {
      // Subtle glow for black hole
      bloomIntensityRef.current = lerp(bloomIntensityRef.current, 0.8, delta * 2);
    } else {
      bloomIntensityRef.current = lerp(bloomIntensityRef.current, 1.2, delta * 3);
    }

    // ── Supernova flash ──
    if (t >= T.FLASH_PEAK && !flashFired.current) {
      flashFired.current = true;
      onFlash();
    }

    // ── Completion ──
    if (t >= T.FALL_END && !completeFired.current) {
      completeFired.current = true;
      onComplete();
    }
  });

  // Calculate dynamic scale factor: shrink star on mobile so it doesn't overflow phone screens
  const starScale = useMemo(() => {
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth < 768;
      return isMobile ? 0.55 : 1.0;
    }
    return 1.0;
  }, []);

  return (
    <>
      {/* Background + black hole (rendered behind everything) */}
      <BlackHoleQuad uniforms={bhUniforms} />

      {/* Background starfield */}
      <BackgroundStars time={elapsed} cameraDistance={cameraDistance} />

      {/* Responsive star group */}
      <group scale={starScale}>
        {/* Star glow core */}
        <StarGlowCore uniforms={glowUniforms} />

        {/* Shockwave ring */}
        <ShockwaveRing uniforms={shockwaveUniforms} />

        {/* Star particle systems */}
        <CoronaParticles uniforms={coronaUniforms} />
        <StarParticles uniforms={starUniforms} />
      </group>

      {/* Post-processing: Dynamic Bloom */}
      <EffectComposer>
        <Bloom
          intensity={bloomIntensityRef.current}
          luminanceThreshold={0.08}
          luminanceSmoothing={0.3}
          radius={0.7}
        />
      </EffectComposer>
    </>
  );
}
