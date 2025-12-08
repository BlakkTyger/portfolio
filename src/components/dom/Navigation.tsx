'use client'

import { useState } from 'react';
import Link from 'next/link';
import { useActiveSection } from '@/hooks/useActiveSection';
import { useStore } from '@/store/useStore';
import NavLink from './NavLink';
import MobileMenu from './MobileMenu';

const NAV_ITEMS = [
  { id: 'hero', label: 'Home' },
  { id: 'whoami', label: 'About' },
  { id: 'cv', label: 'CV' },
  { id: 'worldline', label: 'Journey' },
  { id: 'manifold', label: 'Interests' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

const NAVBAR_HEIGHT = 80; // Height of navbar in pixels

export default function Navigation() {
  const activeSection = useActiveSection();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isIntroComplete = useStore((state) => state.isIntroComplete);
  
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Calculate position with offset for navbar height
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - NAVBAR_HEIGHT;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setMobileOpen(false);
    }
  };
  
  // Hide navbar during intro animation
  if (!isIntroComplete) {
    return null;
  }
  
  return (
    <>
      {/* Desktop Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 hidden md:block">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Fancy Logo */}
            <button
              onClick={() => scrollToSection('hero')}
              className="group relative"
            >
              {/* Animated glow background */}
              <div className="absolute -inset-2 bg-gradient-to-r from-[var(--terminal-cyan)] via-purple-500 to-[var(--terminal-cyan)] rounded-lg opacity-0 group-hover:opacity-30 blur-lg transition-all duration-500 group-hover:animate-pulse" />
              
              {/* Logo container */}
              <div className="relative flex items-center gap-0.5 px-3 py-1.5 rounded-lg bg-[var(--event-horizon)]/50 border border-[var(--tungsten-gray)]/20 group-hover:border-[var(--terminal-cyan)]/50 transition-all duration-300">
                {/* H */}
                <span className="font-heading text-2xl font-bold bg-gradient-to-br from-[var(--terminal-cyan)] to-purple-400 bg-clip-text text-transparent group-hover:from-[var(--photon-white)] group-hover:to-[var(--terminal-cyan)] transition-all duration-300">
                  H
                </span>
                {/* Decorative dot */}
                <span className="w-1 h-1 mx-0.5 rounded-full bg-[var(--terminal-cyan)] group-hover:scale-150 transition-transform duration-300" />
                {/* S */}
                <span className="font-heading text-2xl font-bold bg-gradient-to-br from-purple-400 to-[var(--terminal-cyan)] bg-clip-text text-transparent group-hover:from-[var(--terminal-cyan)] group-hover:to-[var(--photon-white)] transition-all duration-300">
                  S
                </span>
              </div>
              
              {/* Quantum particle orbit */}
              <div className="absolute -inset-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute top-0 left-1/2 w-1 h-1 rounded-full bg-[var(--terminal-cyan)] animate-spin" style={{ animationDuration: '3s', transformOrigin: '0 12px' }} />
              </div>
            </button>
            
            {/* Nav Links */}
            <ul className="flex items-center gap-8">
              {NAV_ITEMS.map(item => (
                <li key={item.id}>
                  <NavLink
                    label={item.label}
                    isActive={activeSection === item.id}
                    onClick={() => scrollToSection(item.id)}
                  />
                </li>
              ))}
              {/* External Links Separator */}
              <li className="h-4 w-px bg-[var(--tungsten-gray)]/30" />
              
              {/* Blog Link - External */}
              <li>
                <Link 
                  href="/blog"
                  className="group relative px-3 py-1.5 text-sm font-mono uppercase tracking-widest
                    text-[var(--quantum-purple)] hover:text-[var(--photon-white)]
                    border border-[var(--quantum-purple)]/40 rounded-full
                    hover:border-[var(--quantum-purple)] hover:bg-[var(--quantum-purple)]/10
                    transition-all duration-300"
                >
                  <span className="relative z-10">Blog</span>
                  <span className="absolute top-0 right-0 -mt-1 -mr-1 w-2 h-2 rounded-full bg-[var(--quantum-purple)] animate-pulse" />
                </Link>
              </li>
              {/* Misc Link - External */}
              <li>
                <Link 
                  href="/misc"
                  className="group relative px-3 py-1.5 text-sm font-mono uppercase tracking-widest
                    text-[var(--laser-orange)] hover:text-[var(--photon-white)]
                    border border-[var(--laser-orange)]/40 rounded-full
                    hover:border-[var(--laser-orange)] hover:bg-[var(--laser-orange)]/10
                    transition-all duration-300"
                >
                  <span className="relative z-10">Misc</span>
                  <span className="absolute top-0 right-0 -mt-1 -mr-1 w-2 h-2 rounded-full bg-[var(--laser-orange)] animate-pulse" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Backdrop blur */}
        <div className="absolute inset-0 -z-10 bg-[var(--void-black)]/80 backdrop-blur-md" />
      </nav>
      
      {/* Mobile Navigation */}
      <MobileMenu
        items={NAV_ITEMS}
        activeSection={activeSection}
        isOpen={mobileOpen}
        onToggle={() => setMobileOpen(!mobileOpen)}
        onNavigate={scrollToSection}
      />
    </>
  );
}