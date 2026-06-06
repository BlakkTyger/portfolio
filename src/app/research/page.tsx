import Link from 'next/link';
import Image from 'next/image';
import { projects } from '@/data/projects';
import { ArrowLeft, Github, ExternalLink, FileText, Presentation } from 'lucide-react';
import { Metadata } from 'next';

const PURPLE = '#8F00FF';

export const metadata: Metadata = {
  title: 'Physics Research | Himanshu Sharma',
  description: 'Quantum computing, optics, and computational physics research.',
};

export default function ResearchPage() {
  const physicsProjects = projects.filter(p => p.category === 'physics');

  return (
    <main className="min-h-screen py-20 px-6">
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

          {/* Purple decoration */}
          <div
            className="h-1 w-48 rounded-full mb-6"
            style={{ backgroundColor: PURPLE }}
          />

          <div className="flex items-center gap-4 mb-4">
            <span
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: PURPLE }}
            />
            <span style={{ color: PURPLE }} className="text-sm font-mono uppercase tracking-widest">
              Research
            </span>
          </div>

          <h1 className="font-heading text-5xl md:text-6xl text-[var(--photon-white)] mb-4">
            Physics Research
          </h1>
          <p className="text-xl text-[var(--tungsten-gray)] max-w-2xl">
            Quantum computing, optics, and computational physics.
            Exploring the fundamental nature of reality through simulation and analysis.
          </p>

          {/* Wave equation decoration */}
          <div className="mt-6 font-mono text-sm" style={{ color: `${PURPLE}50` }}>
            ψ(x,t) = Ae^(i(kx - ωt)) • ∇²ψ + V(x)ψ = Eψ
          </div>
        </div>

        {/* Projects List */}
        <div className="space-y-8">
          {physicsProjects.map((project) => (
            <article
              key={project.id}
              className="group h-full flex flex-col p-8 bg-gradient-to-br from-[var(--event-horizon)] to-[var(--void-black)] rounded-xl border border-[var(--tungsten-gray)]/10 hover:border-[#8F00FF]/40 shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_40px_rgba(143,0,255,0.1)] transition-all"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Purple indicator */}
                <div className="flex-shrink-0">
                  <div
                    className="w-2 h-full min-h-[100px] rounded-full hidden md:block"
                    style={{ backgroundColor: PURPLE }}
                  />
                  <div
                    className="h-1 w-full rounded-full md:hidden mb-4"
                    style={{ backgroundColor: PURPLE }}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col md:flex-row gap-6 items-center">
                  {/* Image container on the left */}
                  {project.image && (
                    <div className="w-full md:w-1/3 flex-shrink-0">
                      <div className="w-full overflow-hidden rounded-lg bg-[var(--void-black)] border border-[var(--tungsten-gray)]/30">
                        <Link href={`/blog/${project.id}`} className="block w-full">
                          <Image src={project.image} alt={project.title} width={400} height={300} className="w-full h-auto object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Text content on the right */}
                  <div className="flex-1 flex flex-col">
                    {/* Year */}
                    {project.year && (
                      <span className="text-sm text-[var(--tungsten-gray)] font-mono mb-2 block">
                        {project.year}
                      </span>
                    )}

                    {/* Title */}
                    <Link href={`/blog/${project.id}`} className="block">
                      <h2 className="font-heading text-2xl md:text-3xl text-[var(--photon-white)] mb-3 transition-colors group-hover:text-[#8F00FF]">
                        {project.title}
                      </h2>
                    </Link>

                    {/* Description */}
                    <p className="text-[var(--tungsten-gray)] mb-4 text-lg">
                      {project.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-sm rounded-full bg-[var(--void-black)]"
                          style={{ color: PURPLE, borderColor: `${PURPLE}30`, borderWidth: 1 }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex-grow"></div>

                    {/* Consolidated Links */}
                    <div className="flex flex-wrap gap-6 mt-6 pt-4 border-t border-[var(--tungsten-gray)]/5">
                      {project.links?.github && (
                        <a
                          href={project.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-[var(--tungsten-gray)] hover:text-[var(--photon-white)] transition-colors"
                        >
                          <Github size={18} />
                          Repository
                        </a>
                      )}
                      {(project.links?.paper || project.assets?.document) && (
                        <a
                          href={project.links?.paper || project.assets?.document}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-[var(--tungsten-gray)] hover:text-[var(--photon-white)] transition-colors"
                        >
                          <FileText size={18} />
                          Paper
                        </a>
                      )}
                      {(project.links?.presentation || project.assets?.ppt) && (
                        <a
                          href={project.links?.presentation || project.assets?.ppt}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-[var(--tungsten-gray)] hover:text-[var(--photon-white)] transition-colors"
                        >
                          <Presentation size={18} />
                          Slides
                        </a>
                      )}
                      {(project.links?.website || project.assets?.link) && (
                        <a
                          href={project.links?.website || project.assets?.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-[var(--tungsten-gray)] hover:text-[var(--photon-white)] transition-colors"
                        >
                          <ExternalLink size={18} />
                          Demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Footer decoration */}
        <div className="mt-16 text-center">
          <div
            className="h-1 w-32 rounded-full mx-auto mb-4"
            style={{ backgroundColor: PURPLE }}
          />
          <p className="text-[var(--tungsten-gray)]/50 text-sm italic">
            &quot;Everything is interesting if you go into it deeply enough.&quot;
            <br />
            <span className="text-xs">— Richard Feynman</span>
          </p>
        </div>
      </div>
    </main>
  );
}
