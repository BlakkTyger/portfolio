import dynamic from 'next/dynamic'

// Lazy load the 3D scene to prevent hydration errors
const Scene = dynamic(() => import('@/components/canvas/Scene'), { ssr: false })

export default function Home() {
  return (
    <main className="relative w-full h-screen">
      {/* The 3D Layer */}
      <Scene />
      
      {/* The DOM Layer */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full pointer-events-none">
        <h1 className="text-6xl font-bold tracking-tighter pointer-events-auto">
          HELLO, UNIVERSE
        </h1>
        <p className="mt-4 text-gray-400">System Initialization...</p>
      </div>
    </main>
  )
}