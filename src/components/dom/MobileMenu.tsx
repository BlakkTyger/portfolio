'use client'

import { useEffect } from 'react';
import Link from 'next/link';

interface MobileMenuProps {
  items: Array<{ id: string; label: string }>;
  activeSection: string;
  isOpen: boolean;
  onToggle: () => void;
  onNavigate: (id: string) => void;
}

export default function MobileMenu({
  items,
  activeSection,
  isOpen,
  onToggle,
  onNavigate,
}: MobileMenuProps) {
  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        onClick={onToggle}
        className="fixed top-4 right-4 z-50 p-2"
        aria-label="Toggle menu"
      >
        <div className="w-6 h-5 relative flex flex-col justify-between">
          <span className={`
            w-full h-0.5 bg-[var(--photon-white)] transition-all duration-300
            ${isOpen ? 'rotate-45 translate-y-2' : ''}
          `} />
          <span className={`
            w-full h-0.5 bg-[var(--photon-white)] transition-all duration-300
            ${isOpen ? 'opacity-0' : ''}
          `} />
          <span className={`
            w-full h-0.5 bg-[var(--photon-white)] transition-all duration-300
            ${isOpen ? '-rotate-45 -translate-y-2' : ''}
          `} />
        </div>
      </button>
      
      {/* Fullscreen Menu */}
      <div className={`
        fixed inset-0 z-40 bg-[var(--void-black)]
        flex items-center justify-center
        transition-all duration-500
        ${isOpen 
          ? 'opacity-100 pointer-events-auto' 
          : 'opacity-0 pointer-events-none'
        }
      `}>
        <ul className="flex flex-col items-center gap-8">
          {items.map((item, index) => (
            <li
              key={item.id}
              style={{
                transitionDelay: isOpen ? `${index * 50}ms` : '0ms',
              }}
              className={`
                transition-all duration-500
                ${isOpen 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-4'
                }
              `}
            >
              <button
                onClick={() => onNavigate(item.id)}
                className={`
                  font-heading text-3xl
                  ${activeSection === item.id
                    ? 'text-[var(--terminal-cyan)]'
                    : 'text-[var(--photon-white)]'
                  }
                `}
              >
                {item.label}
              </button>
            </li>
          ))}
          {/* Separator */}
          <li
            style={{
              transitionDelay: isOpen ? `${items.length * 50}ms` : '0ms',
            }}
            className={`
              w-24 h-px bg-[var(--tungsten-gray)]/30
              transition-all duration-500
              ${isOpen 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-4'
              }
            `}
          />
          {/* Blog Link - External */}
          <li
            style={{
              transitionDelay: isOpen ? `${(items.length + 1) * 50}ms` : '0ms',
            }}
            className={`
              transition-all duration-500
              ${isOpen 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-4'
              }
            `}
          >
            <Link
              href="/blog"
              className="relative font-heading text-3xl text-[var(--quantum-purple)] 
                px-4 py-2 border border-[var(--quantum-purple)]/40 rounded-full
                hover:bg-[var(--quantum-purple)]/10 transition-all"
            >
              Blog
              <span className="absolute top-0 right-0 -mt-1 -mr-1 w-3 h-3 rounded-full bg-[var(--quantum-purple)] animate-pulse" />
            </Link>
          </li>
          {/* Misc Link - External */}
          <li
            style={{
              transitionDelay: isOpen ? `${(items.length + 2) * 50}ms` : '0ms',
            }}
            className={`
              transition-all duration-500
              ${isOpen 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-4'
              }
            `}
          >
            <Link
              href="/misc"
              className="relative font-heading text-3xl text-[var(--laser-orange)]
                px-4 py-2 border border-[var(--laser-orange)]/40 rounded-full
                hover:bg-[var(--laser-orange)]/10 transition-all"
            >
              Misc
              <span className="absolute top-0 right-0 -mt-1 -mr-1 w-3 h-3 rounded-full bg-[var(--laser-orange)] animate-pulse" />
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}