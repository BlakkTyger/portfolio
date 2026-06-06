import Link from 'next/link';
import Image from 'next/image';
import { projects, binaryColors } from '@/data/projects';
import { ArrowLeft, Github, ExternalLink, FileText, Presentation } from 'lucide-react';

export const metadata = {
  title: 'CS Projects',
  description: 'Software development, machine learning, and web applications showcasing the digital side of my work.',
  alternates: {
    canonical: '/cs-projects',
  },
};

export default function CSProjectsPage() {
  const csProjects = projects.filter(p => p.category === 'cs');
  
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://himanshu.be'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'CS Projects',
        item: 'https://himanshu.be/cs-projects'
      }
    ]
  };
  
  return (
    <main className="min-h-screen py-20 px-6">
      {/* Structured SEO Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, '\\u003c') }}
      />
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link 
            href="/#projects"
            className="inline-flex items-center gap-2 text-[var(--tungsten-gray)] hover:text-[var(--photon-white)] mb-8 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Projects
          </Link>
          
          {/* Binary decoration */}
          <div className="text-[var(--terminal-cyan)]/30 font-mono text-xs mb-4 overflow-hidden">
            01001000 01100101 01101100 01101100 01101111 00100000 01010111 01101111 01110010 01101100 01100100
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <span 
              className="w-4 h-4 rounded-full animate-pulse"
              style={{ backgroundColor: binaryColors.primary }}
            />
            <span className="text-[var(--terminal-cyan)] text-sm font-mono uppercase tracking-widest">
              Binary Stream
            </span>
          </div>
          
          <h1 className="font-heading text-5xl md:text-6xl text-[var(--photon-white)] mb-4">
            CS Projects
          </h1>
          <p className="text-xl text-[var(--tungsten-gray)] max-w-2xl">
            Software development, machine learning, web applications, and everything in between.
            These projects represent the digital side of my work.
          </p>
        </div>
        
        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {csProjects.map((project, index) => (
            <article 
              key={project.id}
              className="group h-full flex flex-col p-6 bg-gradient-to-br from-[var(--event-horizon)] to-[var(--void-black)] rounded-xl border border-[var(--tungsten-gray)]/10 hover:border-[var(--terminal-cyan)]/40 shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_40px_var(--terminal-cyan)] transition-all"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Binary header decoration */}
              <div className="text-[var(--terminal-cyan)]/20 font-mono text-xs mb-4">
                {Array.from({ length: 8 }, (_, j) => Math.sin(index * 10 + j) > 0 ? '1' : '0').join('')}
              </div>
              
              {/* Year */}
              {project.year && (
                <span className="text-sm text-[var(--tungsten-gray)] font-mono">
                  {project.year}
                </span>
              )}
              
              {/* Image placeholder / Asset renderer */}
              {project.image && (
                <div className="w-full h-48 mb-4 overflow-hidden rounded-lg bg-zinc-900 border border-zinc-800">
                  {/* Replace with next/image later if optimized images exist */}
                  <Link href={`/blog/${project.id}`} className="block w-full h-full">
                    <Image src={project.image} alt={project.title} width={400} height={300} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                </div>
              )}

              {/* Title */}
              <Link href={`/blog/${project.id}`} className="block">
                <h2 className="font-heading text-2xl text-[var(--photon-white)] mt-2 mb-3 group-hover:text-[var(--terminal-cyan)] transition-colors">
                  {project.title}
                </h2>
              </Link>
              
              {/* Description */}
              <p className="text-[var(--tungsten-gray)] mb-4">
                {project.description}
              </p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs rounded-full bg-[var(--void-black)] text-[var(--terminal-cyan)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex-grow"></div>

              {/* Consolidated Links */}
              <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-[var(--tungsten-gray)]/5">
                {project.links?.github && (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-[var(--tungsten-gray)] hover:text-[var(--photon-white)] transition-colors"
                  >
                    <Github size={16} />
                    Code
                  </a>
                )}
                {project.links?.paper && (
                  <a
                    href={project.links.paper}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-[var(--tungsten-gray)] hover:text-[var(--photon-white)] transition-colors"
                  >
                    <FileText size={16} />
                    Paper
                  </a>
                )}
                {project.links?.presentation && (
                  <a
                    href={project.links.presentation}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-[var(--tungsten-gray)] hover:text-[var(--photon-white)] transition-colors"
                  >
                    <Presentation size={16} />
                    Slides
                  </a>
                )}
                {project.links?.website && (
                  <a
                    href={project.links.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-[var(--tungsten-gray)] hover:text-[var(--photon-white)] transition-colors"
                  >
                    <ExternalLink size={16} />
                    Demo
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
        
        {/* Footer decoration */}
        <div className="mt-16 text-center">
          <div className="text-[var(--terminal-cyan)]/20 font-mono text-xs">
            EOF // End of File
          </div>
        </div>
      </div>
    </main>
  );
}
