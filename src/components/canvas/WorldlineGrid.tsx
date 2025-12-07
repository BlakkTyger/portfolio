'use client'

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface WorldlineGridProps {
  scrollProgress: number;  // 0 to 1
}

export default function WorldlineGrid({ scrollProgress }: WorldlineGridProps) {
  const linesRef = useRef<THREE.LineSegments>(null);
  
  // Create grid geometry
  const geometry = useMemo(() => {
    const size = 100;
    const divisions = 50;
    const points: THREE.Vector3[] = [];
    
    const step = size / divisions;
    const halfSize = size / 2;
    
    // Horizontal lines (along X)
    for (let i = 0; i <= divisions; i++) {
      const z = -halfSize + i * step;
      points.push(new THREE.Vector3(-halfSize, 0, z));
      points.push(new THREE.Vector3(halfSize, 0, z));
    }
    
    // Vertical lines (along Z)
    for (let i = 0; i <= divisions; i++) {
      const x = -halfSize + i * step;
      points.push(new THREE.Vector3(x, 0, -halfSize));
      points.push(new THREE.Vector3(x, 0, halfSize));
    }
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return geometry;
  }, []);
  
  // Animate grid distortion - disabled for now (performance)
  // useFrame((state) => {
  //   if (!linesRef.current) return;
  //   const positions = linesRef.current.geometry.attributes.position;
  //   const time = state.clock.elapsedTime;
  //   for (let i = 0; i < positions.count; i++) {
  //     const x = positions.getX(i);
  //     const z = positions.getZ(i);
  //     const distortionFactor = Math.max(0, 1 - (z + 50) / 100);
  //     const chaos = distortionFactor * scrollProgress * 2;
  //     const y = Math.sin(x * 0.5 + time) * Math.cos(z * 0.5 + time) * chaos;
  //     positions.setY(i, y);
  //   }
  //   positions.needsUpdate = true;
  // });
  
  return (
    <lineSegments ref={linesRef} geometry={geometry} position={[0, -3, 0]}>
      <lineBasicMaterial
        color="#333333"
        transparent
        opacity={0.3}
      />
    </lineSegments>
  );
}