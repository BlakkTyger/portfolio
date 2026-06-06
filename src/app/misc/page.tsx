import Link from 'next/link';
import { ArrowLeft, BookOpen, GraduationCap, FileQuestion, ScrollText } from 'lucide-react';

export const metadata = {
  title: 'Misc | Himanshu Sharma',
  description: 'Books, courses, problem statements, and research articles.',
};

const books = [
  {
    title: 'On the Genealogy of Morals',
    author: 'Friedrich Nietzsche',
    year: 1887,
    link: ''
  },
  {
    title: 'Think: A Compelling Introduction to Philosophy',
    author: 'Simon Blackburn',
    year: 1999,
    link: ''
  },
  {
    title: 'What do you care what other people think?',
    author: 'Richard Feynman',
    year: 1988,
    link: ''
  },
];

const courses = [
  { name: 'Quantum Computing and Communications', institution: 'IIT Kanpur', link: 'https://github.com/Himanshu2909/EE798V-2025-Spring' },
  { name: 'Quantum Optics', institution: 'IIT Kanpur', link: 'github.com/Himanshu2909/EE698Y-2026-Spring' },
  { name: 'Quantum Processes for Low Dimensional Semiconductors', institution: 'IIT Kanpur', link: 'https://github.com/Himanshu2909/PHY312-2025-Fall' },
  { name: 'Nanophotonics', institution: 'IIT Kanpur', link: 'https://github.com/Himanshu2909/EE798I-2025-Fall' },
  { name: 'Quantu Mechanics I', institution: 'IIT Kanpur', link: 'https://github.com/Himanshu2909/PHY431-2025-Fall' },
  { name: 'Quantum Physics', institution: 'IIT Kanpur', link: 'https://github.com/Himanshu2909/PSO201-2025-Spring' },
  { name: 'Optics Lab', institution: 'IIT Kanpur', link: 'https://github.com/Himanshu2909/PHY224-2024-Fall' },
  { name: 'Functional Spaces and the Basic Formalism of Quantum Mechanics', institution: 'IIT Kanpur', link: 'https://github.com/Himanshu2909/PHY686-2026-Spring/' },
  { name: 'Classical Electrodynamics', institution: 'IIT Kanpur', link: 'https://github.com/Himanshu2909/PHY552-2026-Spring' },
  { name: 'Quantum Processes in Low Dimensional Semiconductors', institution: 'IIT Kanpur', link: 'https://github.com/Himanshu2909/PHY312-2025-Fall' },
  { name: 'Modern Physics Lab', institution: 'IIT Kanpur', link: 'https://github.com/Himanshu2909/PHY315-2025-Fall' },
  { name: 'Introduction to Electronics', institution: 'IIT Kanpur', link: 'https://github.com/Himanshu2909/ESC201-2025-Spring' },
  { name: 'Digital Signal Processing', institution: 'IIT Kanpur', link: '' },
  { name: 'Introduction to Probability Theory', institution: 'IIT Kanpur', link: 'https://github.com/Himanshu2909/MSO205-2024-Fall' },
  { name: 'Introduction to Stochastic Processes', institution: 'IIT Kanpur', link: 'https://github.com/Himanshu2909/DMS625-2024-Fall' },
  { name: 'Mathematical Methods for Physicists I', institution: 'IIT Kanpur', link: 'https://github.com/Himanshu2909/PHY421-2025-Fall' },
  { name: 'Classical Mechanics', institution: 'IIT Kanpur', link: 'https://github.com/Himanshu2909/PHY401-2024-Fall' },
  { name: 'Statistical Mechanics', institution: 'IIT Kanpur', link: 'https://github.com/Himanshu2909/PHY412-2026-Spring' },
  { name: 'Matrix Algebra and Linear Estimation', institution: 'IIT Kanpur', link: 'https://github.com/Himanshu2909/MTH207-2024-Fall' },
  { name: 'Special Relativity', institution: 'IIT Kanpur', link: 'https://github.com/Himanshu2909/PHY226M-2025-Spring' },
  { name: 'Thermal Physics', institution: 'IIT Kanpur', link: 'https://github.com/Himanshu2909/PHY210M-2025-Spring' },
  { name: 'Introduction to Philosophy', institution: 'IIT Kanpur', link: 'https://github.com/Himanshu2909/PHI141-2025-Spring' },
  { name: 'Sociology of the New Media', institution: 'IIT Kanpur', link: 'https://github.com/Himanshu2909/SOC484-2025-Fall' },
  { name: 'Economics, Society and Public Policy', institution: 'IIT Kanpur', link: 'https://github.com/Himanshu2909/ECO111-2024-Fall' },
  { name: 'Indian Society and Culture', institution: 'IIT Kanpur', link: '' },
  { name: 'Principles of Biotechnology', institution: 'IIT Kanpur', link: '' },
];

const interestingResources = [
  {
    title: 'Technical Roadmaps for Programming Domains',
    author: 'Programming Club, IIT Kanpur',
    description: '13 end-to-end roadmaps covering various programming domains, developed by the members of Programming Club, IIT Kanpur.',
    link: 'https://pclub.in/roadmaps'
  },
  {
    title: 'Quantum Technology Research Papers',
    author: 'Maria Gragera Garces',
    description: 'A curated list of research papers in the field of quantum technology.',
    link: 'https://github.com/grageragarces/Quantum-tech-papers'
  },
  {
    title: 'OSSU curriculum for Computer Science Education',
    author: 'Open Source',
    description: 'A detailed and guided coursework, containing links to freely available textbooks, lecture notes, assignments and projects, for self-studying computer science.',
    link: 'https://github.com/ossu/computer-science'
  },
];

const researchArticles = [
  {
    title: 'To-Be-Updated',
    authors: '',
    year: NaN,
    field: '',
    link: ''
  },
];

export default function MiscPage() {
  return (
    <main className="min-h-screen py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[var(--tungsten-gray)] hover:text-[var(--photon-white)] mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Portfolio
        </Link>

        {/* Header */}
        <div className="mb-16">
          <span className="text-[var(--terminal-cyan)] text-sm font-mono uppercase tracking-widest mb-4 block">
            The Archive
          </span>
          <h1 className="font-heading text-5xl md:text-6xl text-[var(--photon-white)] mb-4">
            Miscellaneous
          </h1>
          <p className="text-xl text-[var(--tungsten-gray)]">
            A collection of books, courses, problem statements, resources, interesting research articles etc.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Books Section */}
          <section className="bg-[var(--event-horizon)] rounded-xl p-6 border border-[var(--tungsten-gray)]/10">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="text-[var(--terminal-cyan)]" size={24} />
              <h2 className="font-heading text-2xl text-[var(--photon-white)]">Books I&apos;ve Read</h2>
            </div>
            <div className="max-h-[400px] overflow-y-auto pr-2">
              <ul className="space-y-4">
                {books.map((book, i) => (
                  <li key={i} className="border-b border-[var(--tungsten-gray)]/10 pb-3 last:border-0">
                    {book.link ? (
                      <a
                        href={book.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--photon-white)] font-medium hover:text-[var(--terminal-cyan)] transition-colors"
                      >
                        {book.title}
                      </a>
                    ) : (
                      <p className="text-[var(--photon-white)] font-medium">{book.title}</p>
                    )}
                    <p className="text-sm text-[var(--tungsten-gray)]">
                      {book.author} • {book.year}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Courses Section */}
          <section className="bg-[var(--event-horizon)] rounded-xl p-6 border border-[var(--tungsten-gray)]/10">
            <div className="flex items-center gap-3 mb-6">
              <GraduationCap className="text-[var(--spectral-violet)]" size={24} />
              <h2 className="font-heading text-2xl text-[var(--photon-white)]">Courses I&apos;ve Taken (And their GitHub links)</h2>
            </div>
            <div className="max-h-[400px] overflow-y-auto pr-2">
              <ul className="space-y-4">
                {courses.map((course, i) => (
                  <li key={i} className="border-b border-[var(--tungsten-gray)]/10 pb-3 last:border-0">
                    {course.link ? (
                      <a
                        href={course.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--photon-white)] font-medium hover:text-[var(--terminal-cyan)] transition-colors"
                      >
                        {course.name}
                      </a>
                    ) : (
                      <p className="text-[var(--photon-white)] font-medium">{course.name}</p>
                    )}
                    <p className="text-sm text-[var(--tungsten-gray)]">{course.institution}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Resources Section */}
          <section className="bg-[var(--event-horizon)] rounded-xl p-6 border border-[var(--tungsten-gray)]/10">
            <div className="flex items-center gap-3 mb-6">
              <FileQuestion className="text-yellow-500" size={24} />
              <h2 className="font-heading text-2xl text-[var(--photon-white)]">Interesting Resources</h2>
            </div>
            <div className="max-h-[400px] overflow-y-auto pr-2">
              <ul className="space-y-4">
                {interestingResources.map((ps, i) => (
                  <li key={i} className="border-b border-[var(--tungsten-gray)]/10 pb-3 last:border-0">
                    {ps.link ? (
                      <a
                        href={ps.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--photon-white)] font-medium hover:text-[var(--terminal-cyan)] transition-colors"
                      >
                        {ps.title}
                      </a>
                    ) : (
                      <p className="text-[var(--photon-white)] font-medium">{ps.title}</p>
                    )}
                    <p className="text-sm text-[var(--terminal-cyan)]">{ps.author}</p>
                    <p className="text-sm text-[var(--tungsten-gray)] mt-1">{ps.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Research Articles Section */}
          <section className="bg-[var(--event-horizon)] rounded-xl p-6 border border-[var(--tungsten-gray)]/10">
            <div className="flex items-center gap-3 mb-6">
              <ScrollText className="text-red-400" size={24} />
              <h2 className="font-heading text-2xl text-[var(--photon-white)]">Interesting and Non-Technical Research Articles</h2>
            </div>
            <div className="max-h-[400px] overflow-y-auto pr-2">
              <ul className="space-y-4">
                {researchArticles.map((article, i) => (
                  <li key={i} className="border-b border-[var(--tungsten-gray)]/10 pb-3 last:border-0">
                    {article.link ? (
                      <a
                        href={article.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--photon-white)] font-medium hover:text-[var(--terminal-cyan)] transition-colors"
                      >
                        {article.title}
                      </a>
                    ) : (
                      <p className="text-[var(--photon-white)] font-medium">{article.title}</p>
                    )}
                    <p className="text-sm text-[var(--tungsten-gray)]">
                      {article.authors} • {article.year}
                    </p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-[var(--void-black)] text-[var(--tungsten-gray)]">
                      {article.field}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
