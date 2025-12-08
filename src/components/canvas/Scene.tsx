'use client'

import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import Hero from './Hero';
import WorldlineScene from './WorldlineScene';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

interface SceneProps {
  children?: React.ReactNode;
}

export default function Scene({ children }: SceneProps) {
  return (
    <div className="fixed inset-0 -z-10">
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

        {/*
        <EffectComposer>
          <Bloom
            intensity={0.4}          // how strong the glow is
            luminanceThreshold={0.0} // 0 = glow even on darker stuff
            luminanceSmoothing={0.6}
            radius={0.5}             // how wide/soft the halo is
          />
        </EffectComposer>*/}

        <Preload all />
      </Canvas>
    </div>
  );
}