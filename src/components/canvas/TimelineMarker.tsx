'use client'

import * as THREE from 'three';
import type { Milestone } from '@/data/timeline';

interface TimelineMarkerProps {
  milestone: Milestone;
  isActive: boolean;
}

const categoryColors: Record<string, string> = {
  education: '#8F00FF',
  work: '#00FF9D',
  personal: '#F0F0F0',
  achievement: '#FFD700',
};

export default function TimelineMarker({ milestone, isActive }: TimelineMarkerProps) {
  const color = categoryColors[milestone.category];
  const scale = isActive ? 1.5 : 1;
  
  return (
    <group position={[milestone.position.x, 0, milestone.position.z]}>
      {/* Simple sphere marker */}
      <mesh scale={scale}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={isActive ? 1 : 0.6} />
      </mesh>
      
      {/* Glow ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.4, 0.5, 16]} />
        <meshBasicMaterial color={color} transparent opacity={isActive ? 0.5 : 0.2} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}