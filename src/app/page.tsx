import IntroAnimation from '@/components/dom/IntroAnimation';
import SceneWrapper from '@/components/canvas/SceneWrapper';
import WhoAmI from '@/components/dom/WhoAmI';
import CV from '@/components/dom/CV';
import WorldlineSection from '@/components/dom/WorldlineSection';
import ManifoldSection from '@/components/dom/ManifoldSection';
import ProjectsSection from '@/components/dom/ProjectsSection';
import Contact from '@/components/dom/Contact';
import Navigation from '@/components/dom/Navigation';
import HeroText from '@/components/dom/HeroText';

export default function Home() {
  return (
    <main className="relative">
      {/* Intro Animation (plays once) */}
      <IntroAnimation />
      
      {/* Navigation (fixed) */}
      <Navigation />
      
      {/* 3D Background (fixed, behind everything) */}
      <SceneWrapper />
      
      {/* Content Layer */}
      <div className="relative z-10 pointer-events-none">
        {/* Hero Section (first viewport) */}
        <section id="hero" className="h-screen flex items-center justify-center">
          <HeroText />
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
        
        {/* Projects Section */}
        <div className="pointer-events-auto">
          <ProjectsSection />
        </div>
        
        {/* Contact Section */}
        <div className="pointer-events-auto">
          <Contact />
        </div>
        
      </div>
    </main>
  );
}