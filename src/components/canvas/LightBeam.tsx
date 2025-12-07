'use client'

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface LightBeamProps {
  start: THREE.Vector3;
  end: THREE.Vector3;
  color: string;
  animated?: boolean;
  onClick?: () => void;
}

export default function LightBeam({
  start,
  end,
  color,
  animated = true,
  onClick,
}: LightBeamProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Create tube geometry along curve
  const geometry = useMemo(() => {
    const curve = new THREE.LineCurve3(start, end);
    return new THREE.TubeGeometry(curve, 32, 0.05, 8, false);
  }, [start, end]);
  
  // Animate beam intensity
  useFrame((state) => {
    if (!meshRef.current || !animated) return;
    
    const material = meshRef.current.material as THREE.MeshBasicMaterial;
    material.opacity = 0.6 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
  });
  
  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      onClick={onClick}
    >
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}