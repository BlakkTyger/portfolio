import Link from 'next/link';
import { ArrowLeft, BookOpen, GraduationCap, FileQuestion, ScrollText } from 'lucide-react';

export const metadata = {
  title: 'Misc | Himanshu Sharma',
  description: 'Books, courses, problem statements, and research articles.',
};

// Sample data - replace with your actual data
const books = [
  { title: 'On the Geneology of Morals', author: 'Friedrich Nietzsche', year: 1887 },
  { title: 'Think: A Compelling Introduction to Philosophy', author: 'Simon Blackburn', year: 1999 },
  { title: 'What do you care what other people think?', author: 'Richard Feynman', year: 1988 },
];

const courses = [
  { name: 'Quantum Computing and Communications', institution: 'IIT Kanpur', link: '' },
  { name: 'Quantum Optics', institution: 'IIT Kanpur', link: '' },
  { name: 'Quantum Processes for Low Dimensional Semiconductors', institution: 'IIT Kanpur', link: '' },
];

const problemStatements = [
  { title: '', event: '', description: '' },
  { title: '', event: '', description: '' },
  { title: '', event: '', description: '' },
];

const researchArticles = [
  { title: '', authors: '', year: 2017, field: '' },
  { title: '', authors: '', year: 2015, field: '' },
  { title: '', authors: '', year: 2019, field: '' },
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
            A collection of books, courses, problem statements, and research articles.
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
            <ul className="space-y-4">
              {books.map((book, i) => (
                <li key={i} className="border-b border-[var(--tungsten-gray)]/10 pb-3 last:border-0">
                  <p className="text-[var(--photon-white)] font-medium">{book.title}</p>
                  <p className="text-sm text-[var(--tungsten-gray)]">
                    {book.author} • {book.year}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {/* Courses Section */}
          <section className="bg-[var(--event-horizon)] rounded-xl p-6 border border-[var(--tungsten-gray)]/10">
            <div className="flex items-center gap-3 mb-6">
              <GraduationCap className="text-[var(--spectral-violet)]" size={24} />
              <h2 className="font-heading text-2xl text-[var(--photon-white)]">Courses I&apos;ve Taken</h2>
            </div>
            <ul className="space-y-4">
              {courses.map((course, i) => (
                <li key={i} className="border-b border-[var(--tungsten-gray)]/10 pb-3 last:border-0">
                  <a
                    href={course.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--photon-white)] font-medium hover:text-[var(--terminal-cyan)] transition-colors"
                  >
                    {course.name}
                  </a>
                  <p className="text-sm text-[var(--tungsten-gray)]">{course.institution}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* Problem Statements Section */}
          <section className="bg-[var(--event-horizon)] rounded-xl p-6 border border-[var(--tungsten-gray)]/10">
            <div className="flex items-center gap-3 mb-6">
              <FileQuestion className="text-yellow-500" size={24} />
              <h2 className="font-heading text-2xl text-[var(--photon-white)]">Problem Statements</h2>
            </div>
            <ul className="space-y-4">
              {problemStatements.map((ps, i) => (
                <li key={i} className="border-b border-[var(--tungsten-gray)]/10 pb-3 last:border-0">
                  <p className="text-[var(--photon-white)] font-medium">{ps.title}</p>
                  <p className="text-sm text-[var(--terminal-cyan)]">{ps.event}</p>
                  <p className="text-sm text-[var(--tungsten-gray)] mt-1">{ps.description}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* Research Articles Section */}
          <section className="bg-[var(--event-horizon)] rounded-xl p-6 border border-[var(--tungsten-gray)]/10">
            <div className="flex items-center gap-3 mb-6">
              <ScrollText className="text-red-400" size={24} />
              <h2 className="font-heading text-2xl text-[var(--photon-white)]">Research Articles</h2>
            </div>
            <ul className="space-y-4">
              {researchArticles.map((article, i) => (
                <li key={i} className="border-b border-[var(--tungsten-gray)]/10 pb-3 last:border-0">
                  <p className="text-[var(--photon-white)] font-medium">{article.title}</p>
                  <p className="text-sm text-[var(--tungsten-gray)]">
                    {article.authors} • {article.year}
                  </p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-[var(--void-black)] text-[var(--tungsten-gray)]">
                    {article.field}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
