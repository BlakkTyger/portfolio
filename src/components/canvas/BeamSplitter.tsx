'use client'

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { binaryColors } from '@/data/projects';

const PURPLE = '#8F00FF';

export default function BeamSplitter() {
  const router = useRouter();
  const inputBeamRef = useRef<THREE.Group>(null);
  const binaryDataRef = useRef<THREE.Group>(null);
  const inputParticlesRef = useRef<THREE.Points>(null);
  
  // Animation for all beams
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Animate input beam particles (moving right toward splitter)
    if (inputParticlesRef.current) {
      const positions = inputParticlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += 0.05; // Move right
        if (positions[i] > -0.8) {
          positions[i] = -5; // Reset to start
        }
      }
      inputParticlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
    
    // Animate binary data flowing along transmitted beam
    if (binaryDataRef.current) {
      binaryDataRef.current.children.forEach((child, i) => {
        child.position.x += 0.04;
        if (child.position.x > 6) {
          child.position.x = 1;
        }
      });
    }
  });
  
  // Generate input beam particles
  const inputParticleCount = 50;
  const inputParticlePositions = new Float32Array(inputParticleCount * 3);
  for (let i = 0; i < inputParticleCount; i++) {
    inputParticlePositions[i * 3] = -5 + (i / inputParticleCount) * 4; // x: spread from -5 to -1
    inputParticlePositions[i * 3 + 1] = (Math.random() - 0.5) * 0.1; // y: small variation
    inputParticlePositions[i * 3 + 2] = (Math.random() - 0.5) * 0.1; // z: small variation
  }
  
  // Generate binary particles for CS beam
  const binaryParticles = [];
  for (let i = 0; i < 15; i++) {
    binaryParticles.push({
      id: i,
      x: 1 + (i * 0.4),
      value: Math.random() > 0.5 ? '1' : '0',
    });
  }
  
  const handleCSClick = () => {
    router.push('/cs-projects');
  };
  
  const handlePhysicsClick = () => {
    router.push('/research');
  };
  
  return (
    <group position={[0, 0, 0]}>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 3]} intensity={2} color="#FFFFFF" />
      
      {/* === INPUT BEAM (from left, horizontal) === */}
      <group ref={inputBeamRef}>
        {/* Main input beam - horizontal cylinder */}
        <mesh position={[-3, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.06, 0.06, 4, 16]} />
          <meshBasicMaterial color="#FFFFFF" transparent opacity={0.9} />
        </mesh>
        
        {/* Input beam glow */}
        <mesh position={[-3, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.15, 0.15, 4, 16]} />
          <meshBasicMaterial color="#FFFFFF" transparent opacity={0.2} />
        </mesh>
        
        {/* Animated particles flowing toward splitter */}
        <points ref={inputParticlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[inputParticlePositions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial color="#FFFFFF" size={0.08} transparent opacity={0.8} />
        </points>
      </group>
      
      {/* === BEAM SPLITTER CUBE === */}
      <group position={[0, 0, 0]}>
        {/* Glass cube */}
        <mesh>
          <boxGeometry args={[1.5, 1.5, 1.5]} />
          <meshPhysicalMaterial
            color="#FFFFFF"
            metalness={0}
            roughness={0}
            transmission={0.9}
            thickness={1.5}
            clearcoat={1}
            clearcoatRoughness={0}
          />
        </mesh>
        
        {/* 45-degree diagonal splitter surface */}
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <planeGeometry args={[2, 2]} />
          <meshPhysicalMaterial
            color="#66AAFF"
            metalness={0.3}
            roughness={0}
            transmission={0.4}
            opacity={0.6}
            transparent
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
      
      {/* === TRANSMITTED BEAM (CS Projects) - continues horizontally right === */}
      <group onClick={handleCSClick}>
        {/* Main transmitted beam */}
        <mesh position={[3.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.05, 5, 16]} />
          <meshBasicMaterial color={binaryColors.primary} transparent opacity={0.9} />
        </mesh>
        
        {/* Beam glow */}
        <mesh position={[3.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.12, 0.12, 5, 16]} />
          <meshBasicMaterial color={binaryColors.primary} transparent opacity={0.15} />
        </mesh>
        
        {/* Binary data flowing */}
        <group ref={binaryDataRef}>
          {binaryParticles.map((p) => (
            <Text
              key={p.id}
              position={[p.x, 0.15, 0]}
              fontSize={0.12}
              color={binaryColors.primary}
              anchorX="center"
              anchorY="middle"
            >
              {p.value}
            </Text>
          ))}
        </group>
        
        {/* CS endpoint sphere */}
        <mesh position={[6.5, 0, 0]} onClick={handleCSClick}>
          <sphereGeometry args={[0.35, 32, 32]} />
          <meshStandardMaterial
            color={binaryColors.primary}
            emissive={binaryColors.primary}
            emissiveIntensity={0.6}
          />
        </mesh>
        
        {/* CS Labels */}
        <Text position={[6.5, 0.7, 0]} fontSize={0.25} color="#FFFFFF" anchorX="center">
          CS Projects
        </Text>
        <Text position={[6.5, 0.4, 0]} fontSize={0.12} color="#666666" anchorX="center">
          Click to explore →
        </Text>
      </group>
      
      {/* === REFLECTED BEAM (Physics Research) - goes upward at 90° === */}
      <group onClick={handlePhysicsClick}>
        {/* Main reflected beam - vertical */}
        <mesh position={[0, 3.5, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 5, 16]} />
          <meshBasicMaterial color={PURPLE} transparent opacity={0.9} />
        </mesh>
        
        {/* Beam glow */}
        <mesh position={[0, 3.5, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 5, 16]} />
          <meshBasicMaterial color={PURPLE} transparent opacity={0.15} />
        </mesh>
        
        {/* Wave pattern decoration */}
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} position={[0.2 * Math.sin(i * 0.8), 1.5 + i * 0.8, 0]}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshBasicMaterial color={PURPLE} transparent opacity={0.7} />
          </mesh>
        ))}
        
        {/* Physics endpoint sphere */}
        <mesh position={[0, 6.5, 0]} onClick={handlePhysicsClick}>
          <sphereGeometry args={[0.35, 32, 32]} />
          <meshStandardMaterial
            color={PURPLE}
            emissive={PURPLE}
            emissiveIntensity={0.6}
          />
        </mesh>
        
        {/* Physics Labels */}
        <Text position={[0.8, 6.5, 0]} fontSize={0.25} color="#FFFFFF" anchorX="left">
          Physics Research
        </Text>
        <Text position={[0.8, 6.2, 0]} fontSize={0.12} color="#666666" anchorX="left">
          Click to explore →
        </Text>
      </group>
    </group>
  );
}