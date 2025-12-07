import IntroAnimation from '@/components/dom/IntroAnimation';
import SceneWrapper from '@/components/canvas/SceneWrapper';
import WhoAmI from '@/components/dom/WhoAmI';
import CV from '@/components/dom/CV';
import WorldlineSection from '@/components/dom/WorldlineSection';
import ManifoldSection from '@/components/dom/ManifoldSection';

export default function Home() {
  return (
    <main className="relative">
      {/* Intro Animation (plays once) */}
      <IntroAnimation />
      
      {/* 3D Background (fixed, behind everything) */}
      <SceneWrapper />
      
      {/* Content Layer */}
      <div className="relative z-10 pointer-events-none">
        {/* Hero Section (first viewport) */}
        <section className="h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-heading text-6xl md:text-8xl text-[var(--photon-white)] mb-4">
              Himanshu Sharma
            </h1>
            <p className="text-xl text-[var(--tungsten-gray)]">
              Physicist • Developer • Philosopher
            </p>
            
            {/* Scroll indicator */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
              <div className="w-6 h-10 rounded-full border-2 border-[var(--tungsten-gray)]/50 flex justify-center">
                <div className="w-1.5 h-3 bg-[var(--tungsten-gray)] rounded-full mt-2 animate-bounce" />
              </div>
            </div>
          </div>
        </section>
        
        {/* WhoAmI Section */}
        <WhoAmI />
        
        {/* CV Section */}
        <div className="pointer-events-auto">
          <CV />
        </div>
        
        {/* Worldline Timeline Section */}
        <WorldlineSection />
        
        {/* Interests Manifold Section */}
        <div className="pointer-events-auto">
          <ManifoldSection />
        </div>
        
      </div>
    </main>
  );
}