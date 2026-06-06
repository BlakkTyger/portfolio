'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const Scene = dynamic(() => import('@/components/canvas/Scene'), {
  ssr: false,
  loading: () => null,
})

export default function SceneWrapper() {
  return (
    <Suspense fallback={null}>
      <Scene />
    </Suspense>
  )
}