'use client'

import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import WorldlineGrid from './WorldlineGrid';

// Store scroll progress globally (updated from DOM)
// progress: worldline section progress (0-1)
// pageScrollY: raw page scroll position for early particle fade
export const scrollState = { progress: 0, pageScrollY: 0 };

export default function WorldlineScene() {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  // Camera path parameters - subtle movement during worldline section
  const startZ = 10;
  const endZ = 5;

  useFrame(() => {
    const progress = scrollState.progress;

    // Subtle camera movement when scrolling through Worldline section
    if (progress > 0.01) {
      camera.position.z = startZ + (endZ - startZ) * progress;
      camera.position.y = Math.sin(progress * Math.PI) * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.4} />
      <WorldlineGrid scrollProgress={scrollState.progress} />
    </group>
  );
}
