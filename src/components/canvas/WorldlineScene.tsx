'use client'

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { milestones } from '@/data/timeline';
import TimelineMarker from './TimelineMarker';
import WorldlineGrid from './WorldlineGrid';

// Store scroll progress globally (updated from DOM)
export const scrollState = { progress: 0 };

export default function WorldlineScene() {
  const groupRef = useRef<THREE.Group>(null);
  const activeIndexRef = useRef(0);
  const { camera } = useThree();

  // Camera path parameters
  const startZ = 10;
  const endZ = -80;

  useFrame(() => {
    const progress = scrollState.progress;

    // Only move camera when user has scrolled into Worldline section
    if (progress > 0.01) {
      camera.position.z = startZ + (endZ - startZ) * progress;
      camera.position.y = 2 + Math.sin(progress * Math.PI) * 1;
    }

    // Find closest milestone to camera
    let closestIndex = 0;
    let closestDistance = Infinity;

    milestones.forEach((m, i) => {
      const distance = Math.abs(camera.position.z - m.position.z);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i;
      }
    });

    activeIndexRef.current = closestIndex;
  });

  return (
    <group ref={groupRef}>
      {/* Ambient lighting */}
      <ambientLight intensity={0.4} />
      
      {/* Point light */}
      <pointLight position={[0, 5, 0]} intensity={1} />

      {/* Background grid */}
      <WorldlineGrid scrollProgress={scrollState.progress} />

      {/* Timeline markers - only show when scrolled into Worldline section */}
      {scrollState.progress > 0.01 && milestones.map((milestone, index) => (
        <TimelineMarker
          key={milestone.id}
          milestone={milestone}
          isActive={index === activeIndexRef.current}
        />
      ))}
    </group>
  );
}
