// Import the 3D scene wrapper
import SceneWrapper from '@/components/canvas/SceneWrapper'

// Import the intro animation component
import IntroAnimation from '@/components/dom/IntroAnimation';

export default function Home() {
  return (
    <main className="relative w-full min-h-screen">
      { }
      <IntroAnimation />

      { }
      <SceneWrapper />

      { }
      <div className="relative z-10 pointer-events-none">
        <section className="h-screen flex items-center justify-center">
          <h1 className="text-6xl font-heading">Welcome</h1>
        </section>
      </div>

    </main>
  );
}
