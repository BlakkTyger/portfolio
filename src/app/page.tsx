import StellarIntro from '@/components/dom/StellarIntro';
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
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Himanshu Sharma',
    jobTitle: 'Physicist & Developer',
    url: 'https://himanshu.be',
    sameAs: [
      'https://github.com/BlakkTyger',
      'https://www.linkedin.com/in/himanshu-sharma-152282217/',
      'https://x.com/blakktyger'
    ],
    email: 'himans23@iitk.ac.in',
    affiliation: [
      {
        '@type': 'EducationalOrganization',
        name: 'Indian Institute of Technology, Kanpur',
        alternateName: 'IIT Kanpur'
      },
      {
        '@type': 'Organization',
        name: 'Kyoto University LLM Center'
      }
    ],
    description: 'Physicist and developer working at the intersection of quantum light-matter interaction and classical AI.'
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Himanshu Sharma | The Coherent State',
    url: 'https://himanshu.be',
    description: 'Personal portfolio showcasing physics research and software development.'
  };

  return (
    <main className="relative w-full max-w-[100vw] ">
      {/* Structured SEO Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd).replace(/</g, '\\u003c') }}
      />

      {/* Stellar Collapse → Black Hole Intro (plays once, skips on repeat visits) */}
      <StellarIntro />
      
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
        <div className="pointer-events-auto">
          <WhoAmI />
        </div>
        
        {/* CV Section */}
        <div className="pointer-events-auto">
          <CV />
        </div>
        
        {/* Projects Section */}
        <div className="pointer-events-auto">
          <ProjectsSection />
        </div>
        
        {/* Worldline Timeline Section */}
        <WorldlineSection />
        
        {/* Interests Manifold Section */}
        <div className="pointer-events-auto">
          <ManifoldSection />
        </div>
        
        {/* Contact Section */}
        <div className="pointer-events-auto">
          <Contact />
        </div>
        
      </div>
    </main>
  );
}