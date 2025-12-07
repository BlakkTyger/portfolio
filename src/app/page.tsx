import SceneWrapper from '@/components/canvas/SceneWrapper'

export default function Home() {
  return (
    <main className="relative w-full h-screen">
      {/* Now we use the wrapper, which is safe for Server Components */}
      <SceneWrapper />
      
      {/* The DOM Layer (Text) remains Server-Side Rendered for SEO */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full pointer-events-none">
        <h1 className="text-6xl font-bold tracking-tighter pointer-events-auto mix-blend-difference">
          HELLO, UNIVERSE
        </h1>
        <p className="mt-4 text-gray-400">System Initialization...</p>
      </div>
    </main>
  )
}