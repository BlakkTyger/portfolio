import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { projects } from '@/data/projects';

export function generateStaticParams() {
  return projects.map((project) => ({
    id: project.id,
  }));
}

export default function BlogPost({ params }: { params: { id: string } }) {
  const project = projects.find(p => p.id === params.id);
  
  if (!project) {
    return (
      <main className="min-h-screen flex items-center justify-center flex-col gap-4">
        <h1 className="text-3xl text-white">Project Not Found</h1>
        <Link href="/" className="text-[#00FF9D] hover:underline">Return Home</Link>
      </main>
    );
  }

  const primaryColor = project.category === 'cs' ? '#00FF9D' : '#8F00FF';

  return (
    <main className="min-h-screen py-20 px-6 max-w-4xl mx-auto bg-[#050505] text-[#F0F0F0] font-sans selection:bg-[#8F00FF] selection:text-white">
      <nav className="mb-12">
        <Link href={project.category === 'cs' ? "/cs-projects" : "/research"} className="text-[#888] hover:text-white transition-colors flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Projects
        </Link>
      </nav>
      
      <article className="space-y-8">
        <header className="space-y-4">
          <div className="flex items-center gap-3 text-sm font-mono tracking-widest uppercase" style={{ color: primaryColor }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
            {project.category === 'cs' ? 'Computer Science' : 'Physics Research'}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            {project.title}
          </h1>
          
          <div className="flex flex-wrap gap-2 pt-4">
            {project.tags.map(tag => (
              <span key={tag} className="text-xs px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[#aaa]">
                {tag}
              </span>
            ))}
          </div>
        </header>

        {project.image && (
          <div className="w-full aspect-video rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
            <img src={project.image} alt={project.title} className="w-full h-full object-cover"  />
          </div>
        )}

        <div className="prose prose-invert max-w-none text-[#aaa] leading-relaxed text-lg">
          <p className="text-xl text-[#ccc]">{project.description}</p>
          
          <div className="my-12 p-6 rounded-lg bg-zinc-900/50 border border-zinc-800">
            <p className="text-sm font-mono text-[#888] text-center">
              Content for this project will be manually added here.
            </p>
          </div>
        </div>
      </article>
    </main>
  );
}
