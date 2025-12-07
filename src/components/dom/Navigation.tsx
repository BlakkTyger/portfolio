'use client'

import { useState } from 'react';
import { useActiveSection } from '@/hooks/useActiveSection';
import NavLink from './NavLink';
import MobileMenu from './MobileMenu';

const NAV_ITEMS = [
  { id: 'hero', label: 'Home' },
  { id: 'whoami', label: 'About' },
  { id: 'cv', label: 'CV' },
  { id: 'worldline', label: 'Journey' },
  { id: 'manifold', label: 'Interests' },
];

export default function Navigation() {
  const activeSection = useActiveSection();
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileOpen(false);
    }
  };
  
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