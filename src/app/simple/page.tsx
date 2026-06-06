import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Github, Mail, ExternalLink, FileText, Presentation } from 'lucide-react';
import { personalInfo, skills } from '@/data/content';
import { projects } from '@/data/projects';

export const metadata = {
  title: 'Himanshu Sharma | Minimal Website',
  description: 'Academic and professional profile of Himanshu Sharma.',
};

const ACADEMIC_JOURNEY = [
  {
    year: '2018 – 2019',
    title: 'Foundations in Engineering & Advocacy',
    description: 'Began tinkering with electronics and Arduinos. Chaired MUN debating conferences and led social impact initiatives for neurodivergent children.',
  },
  {
    year: '2020',
    title: 'Sustainability, Design & Early Code',
    description: 'Prototyped sustainable models in Fusion 360, winning national ATL Marathon. Trained in tech entrepreneurship and transitioned to Python programming.',
  },
  {
    year: '2020 – 2021',
    title: 'Computational Neuroscience (AIM-SIRIUS)',
    description: 'Led an Indo-Russian team under the Sirius Institute, designing a web platform and data pipelines for EEG signal processing and neural connectivity.',
  },
  {
    year: '2020 – 2022',
    title: 'F1 in Schools & The Quantum Spark',
    description: 'Served as Design Engineer for Team Quantum Racing at the F1 in Schools World Finals (UK). Sparked interest in Quantum Computing and QKD.',
  },
  {
    year: '2023 – 2024',
    title: 'IIT Kanpur & Technical Leadership',
    description: 'Enrolled in Physics at IIT Kanpur, focusing on Quantum Computing, Quantum Optics, and Machine Learning. Coordinated the Programming Club ML domain.',
  },
  {
    year: '2025',
    title: 'AI Internals & Quantum Research',
    description: 'Researched LLM mechanics at Kyoto University and Quantum Optics / Cavity QED at the Nanophotonics Group, IIT Kanpur.',
  },
  {
    year: '2026 & Beyond',
    title: 'Lattices & The Quantum Frontier',
    description: 'Assessing lattice-based cryptographic vulnerabilities and publishing research bridging classical AI and Quantum Physics.',
  },
];

export default function SimpleProfile() {
  const physicsProjects = projects.filter(p => p.category === 'physics');
  const csProjects = projects.filter(p => p.category === 'cs');
  
  return (
    <main className="min-h-screen bg-[#050505] text-[#F0F0F0] font-sans selection:bg-[#8F00FF] selection:text-white">
      {/* Navigation */}
      <nav className="border-b border-[#222] bg-[#050505]/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <span className="font-bold tracking-tight text-xl">Himanshu Sharma</span>
          <div className="flex gap-4 text-sm">
            <Link href="/" className="text-[#888] hover:text-[#00FF9D] transition-colors flex items-center gap-1">
              <ArrowLeft size={16} /> Interactive UI
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-24">
        
        {/* Header / Intro */}
        <section className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
            {personalInfo.name}
          </h1>
          <p className="text-xl text-[#00FF9D] font-mono">
            {personalInfo.tagline}
          </p>
          <div className="prose prose-invert max-w-none text-lg text-[#aaa] leading-relaxed">
            {personalInfo.bio.split('\n\n').map((p, i) => <p key={i}>{p.trim()}</p>)}
          </div>
          
          <div className="flex flex-wrap gap-4 pt-4">
            <a href="mailto:himans23@iitk.ac.in" className="flex items-center gap-2 px-4 py-2 bg-[#111] border border-[#333] rounded-md hover:border-[#8F00FF] hover:text-[#8F00FF] transition-all">
              <Mail size={18} /> Email
            </a>
            <a href="https://github.com/BlakkTyger" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-[#111] border border-[#333] rounded-md hover:border-[#00FF9D] hover:text-[#00FF9D] transition-all">
              <Github size={18} /> GitHub
            </a>
            <a href="/cv.pdf" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-[#111] border border-[#333] rounded-md hover:border-white hover:text-white transition-all">
              <FileText size={18} /> Full CV
            </a>
          </div>
        </section>

        {/* Physics Research */}
        <section>
          <h2 className="text-2xl font-bold border-b border-[#222] pb-4 mb-8 text-[#8F00FF] flex items-center gap-3">
            <span className="text-lg">ψ</span> Physics Research
          </h2>
          <div className="space-y-12">
            {physicsProjects.map(project => (
              <div key={project.id} className="group">
                <h3 className="text-xl font-bold text-[#eee] mb-2">{project.title}</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map(tag => (
                    <span key={tag} className="text-xs px-2 py-1 bg-[#8F00FF]/10 text-[#8F00FF] rounded border border-[#8F00FF]/20">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-[#999] leading-relaxed mb-4">{project.description}</p>
                
                {/* Consolidated Links */}
                <div className="flex flex-wrap gap-4 text-sm mt-4">
                  {project.links?.github && (
                    <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="text-[#888] hover:text-[#8F00FF] transition-colors flex items-center gap-1.5">
                      <Github size={14} /> Repository
                    </a>
                  )}
                  {(project.links?.paper || project.assets?.document) && (
                    <a href={project.links?.paper || project.assets?.document} target="_blank" rel="noopener noreferrer" className="text-[#888] hover:text-[#8F00FF] transition-colors flex items-center gap-1.5">
                      <FileText size={14} /> Paper
                    </a>
                  )}
                  {(project.links?.presentation || project.assets?.ppt) && (
                    <a href={project.links?.presentation || project.assets?.ppt} target="_blank" rel="noopener noreferrer" className="text-[#888] hover:text-[#8F00FF] transition-colors flex items-center gap-1.5">
                      <Presentation size={14} /> Slides
                    </a>
                  )}
                  {(project.links?.website || project.assets?.link) && (
                    <a href={project.links?.website || project.assets?.link} target="_blank" rel="noopener noreferrer" className="text-[#888] hover:text-[#8F00FF] transition-colors flex items-center gap-1.5">
                      <ExternalLink size={14} /> Demo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CS Projects */}
        <section>
          <h2 className="text-2xl font-bold border-b border-[#222] pb-4 mb-8 text-[#00FF9D] flex items-center gap-3">
            <span className="font-mono text-lg">{'{ }'}</span> CS Projects
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {csProjects.map(project => (
              <div key={project.id} className="p-6 bg-[#0a0a0f] border border-[#222] rounded-lg hover:border-[#00FF9D]/50 transition-colors">
                <h3 className="text-lg font-bold text-[#eee] mb-3">{project.title}</h3>
                <p className="text-[#888] text-sm mb-4 min-h-[60px]">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-xs px-2 py-1 bg-[#00FF9D]/10 text-[#00FF9D] rounded border border-[#00FF9D]/20">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Consolidated Links */}
                <div className="flex flex-wrap gap-4 text-sm mt-4">
                  {project.links?.github && (
                    <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="text-[#888] hover:text-[#00FF9D] transition-colors flex items-center gap-1.5">
                      <Github size={14} /> Repository
                    </a>
                  )}
                  {(project.links?.paper || project.assets?.document) && (
                    <a href={project.links?.paper || project.assets?.document} target="_blank" rel="noopener noreferrer" className="text-[#888] hover:text-[#00FF9D] transition-colors flex items-center gap-1.5">
                      <FileText size={14} /> Paper
                    </a>
                  )}
                  {(project.links?.presentation || project.assets?.ppt) && (
                    <a href={project.links?.presentation || project.assets?.ppt} target="_blank" rel="noopener noreferrer" className="text-[#888] hover:text-[#00FF9D] transition-colors flex items-center gap-1.5">
                      <Presentation size={14} /> Slides
                    </a>
                  )}
                  {(project.links?.website || project.assets?.link) && (
                    <a href={project.links?.website || project.assets?.link} target="_blank" rel="noopener noreferrer" className="text-[#888] hover:text-[#00FF9D] transition-colors flex items-center gap-1.5">
                      <ExternalLink size={14} /> Demo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Skills */}
        <section>
          <h2 className="text-2xl font-bold border-b border-[#222] pb-4 mb-8 text-white">Core Skills</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-[#888]">Development</h3>
              <ul className="space-y-2 text-[#aaa]">
                {skills.filter(s => s.category === 'development').map(s => <li key={s.name} className="flex items-center gap-2"><div className="w-1 h-1 bg-[#00FF9D] rounded-full"/> {s.name}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-[#888]">Research</h3>
              <ul className="space-y-2 text-[#aaa]">
                {skills.filter(s => s.category === 'research').map(s => <li key={s.name} className="flex items-center gap-2"><div className="w-1 h-1 bg-[#8F00FF] rounded-full"/> {s.name}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-[#888]">Tools</h3>
              <ul className="space-y-2 text-[#aaa]">
                {skills.filter(s => s.category === 'tools').map(s => <li key={s.name} className="flex items-center gap-2"><div className="w-1 h-1 bg-white rounded-full"/> {s.name}</li>)}
              </ul>
            </div>
          </div>
        </section>

        {/* Condensed Journey / Timeline */}
        <section>
          <h2 className="text-2xl font-bold border-b border-[#222] pb-4 mb-8 text-white">Academic Journey</h2>
          <div className="space-y-8 border-l border-[#333] pl-6 ml-3 relative">
            {ACADEMIC_JOURNEY.map((milestone, idx) => (
              <div key={idx} className="relative">
                <div className="absolute -left-[31px] top-1.5 w-3 h-3 bg-[#333] rounded-full ring-4 ring-[#050505]" />
                <span className="text-sm font-mono text-[#888] mb-1 block">{milestone.year}</span>
                <h3 className="text-xl font-semibold text-[#ddd]">{milestone.title}</h3>
                <p className="text-[#888] mt-2">{milestone.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[#222] pt-8 pb-12 text-center text-[#666] text-sm">
          <p>© {new Date().getFullYear()} Himanshu Sharma. Designed for readability.</p>
        </footer>

      </div>
    </main>
  );
}
