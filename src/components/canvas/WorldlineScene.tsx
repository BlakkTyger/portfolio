'use client'

import { useRef } from 'react';
import * as THREE from 'three';
import WorldlineStages from './WorldlineStages';
import { scrollState } from './worldlineState';

// Re-export so existing imports (e.g. WorldlineSection) keep working.
export { scrollState };

export default function WorldlineScene() {
  const groupRef = useRef<THREE.Group>(null);

  // The 7 procedural stages drive all of their own animation from scroll
  // progress; the shared camera is intentionally left untouched so it does not
  // conflict with the Hero / intro scenes.
  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.35} />
      <WorldlineStages />
    </group>
  );
}
