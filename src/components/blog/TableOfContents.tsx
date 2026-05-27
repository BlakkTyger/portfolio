'use client'

import { useEffect, useState } from 'react';

export default function TableOfContents() {
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Find all headings inside the article
    const elements = Array.from(document.querySelectorAll('article h2, article h3'));
    
    const headingData = elements.map((elem) => ({
      id: elem.id,
      text: elem.textContent || '',
      level: Number(elem.tagName.substring(1)),
    }));
    
    setHeadings(headingData);
    
    // Intersection Observer for highlighting active section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '0px 0px -80% 0px' }
    );
    
    elements.forEach((elem) => observer.observe(elem));
    
    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) return null;

  return (
    <div className="space-y-4">
      <h4 className="font-heading text-lg text-[var(--photon-white)] tracking-wide uppercase">On this page</h4>
      <nav className="flex flex-col gap-2 border-l-2 border-[var(--tungsten-gray)]/20 pl-4">
        {headings.map((h) => (
          <a
            key={h.id}
            href={`#${h.id}`}
            className={`
              text-sm transition-colors text-left break-words
              ${h.level === 3 ? 'ml-4' : ''}
              ${activeId === h.id ? 'text-[var(--terminal-cyan)] font-medium' : 'text-[var(--tungsten-gray)] hover:text-[var(--photon-white)]'}
            `}
          >
            {h.text}
          </a>
        ))}
      </nav>
    </div>
  );
}
