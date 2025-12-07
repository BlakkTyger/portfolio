'use client'

import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'

export default function Scene({ children, ...props }: any) {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none">
      <Canvas {...props}>
        {/* Helper lights for development */}
        <directionalLight position={[-5, 5, 5]} intensity={4} />
        {children}
        <Preload all />
      </Canvas>
    </div>
  )
}