'use client'

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Prism() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Slow rotation
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.1;
  });
  
  // Create triangular prism geometry
  const shape = new THREE.Shape();
  const size = 0.8;
  shape.moveTo(0, size);
  shape.lineTo(-size * 0.866, -size * 0.5);  // Bottom left
  shape.lineTo(size * 0.866, -size * 0.5);   // Bottom right
  shape.closePath();
  
  const extrudeSettings = {
    depth: 1.5,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
  };
  
  return (
    <mesh ref={meshRef} rotation={[0, 0, 0]}>
      <extrudeGeometry args={[shape, extrudeSettings]} />
      <meshPhysicalMaterial
        color="#FFFFFF"
        metalness={0.1}
        roughness={0.1}
        transmission={0.9}  // Glass-like transparency
        thickness={1}
        envMapIntensity={1}
        clearcoat={1}
        clearcoatRoughness={0.1}
      />
    </mesh>
  );
}