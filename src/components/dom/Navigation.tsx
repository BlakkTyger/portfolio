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
            {/* Logo */}
            <button
              onClick={() => scrollToSection('hero')}
              className="font-heading text-xl text-[var(--photon-white)]"
            >
              HS
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
              {/* Blog Link */}
              <li>
                <Link 
                  href="/blog"
                  className="text-sm text-[var(--tungsten-gray)] hover:text-[var(--photon-white)] transition-colors"
                >
                  Blog
                </Link>
              </li>
              {/* Misc Link */}
              <li>
                <Link 
                  href="/misc"
                  className="text-sm text-[var(--tungsten-gray)] hover:text-[var(--photon-white)] transition-colors"
                >
                  Misc
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