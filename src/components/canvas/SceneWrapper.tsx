'use client'

import dynamic from 'next/dynamic'

// This creates the client-only boundary
const Scene = dynamic(() => import('@/components/canvas/Scene'), { 
  ssr: false,
})

export default function SceneWrapper() {
  return <Scene />
}