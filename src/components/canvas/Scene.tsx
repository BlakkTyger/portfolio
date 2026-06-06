'use client'

import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import Hero from './Hero';
import WorldlineScene from './WorldlineScene';
import { useActiveSection } from '@/hooks/useActiveSection';

interface SceneProps {
  children?: React.ReactNode;
}

export default function Scene({ children }: SceneProps) {
  const activeSection = useActiveSection();
  const isManifold = activeSection === 'manifold';

  useEffect(() => {
    console.log('[Scene] mounted')
  }, [])

  return (
    <div className="fixed inset-0 -z-10" style={{ background: '#020204' }}>
      <div 
        className="w-full h-full transition-opacity duration-1000"
        style={{ opacity: isManifold ? 0.08 : 1 }}
      >
        <Canvas
          camera={{
            position: [0, 0, 10],
            fov: 50,
            near: 0.1,
            far: 200,
          }}
          dpr={[1, 2]}
        >
          <ambientLight intensity={0.5} />

          {/* Hero particles for landing */}
          <Hero />

          {/* Worldline timeline */}
          <WorldlineScene />

          {children}

          <Preload all />
        </Canvas>
      </div>
    </div>
  );
}