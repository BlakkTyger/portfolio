'use client'

import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import Hero from './Hero';

interface SceneProps {
  children?: React.ReactNode;
}

export default function Scene({ children }: SceneProps) {
  return (
    <div className="fixed inset-0 -z-10">
      {}
      
      <Canvas
        camera={{
          position: [0, 0, 10],  // Camera 10 units back
          fov: 50,               // 50° field of view
          near: 0.1,             // Don't render closer than 0.1
          far: 100,              // Don't render farther than 100
        }}
        dpr={[1, 2]}  // Pixel ratio: 1x to 2x (for retina)
      >
        {}
        
        {}
        <ambientLight intensity={0.5} />
        
        {}
        <Hero />
        
        {}
        {children}
        
        {}
        <Preload all />
      </Canvas>
    </div>
  );
}