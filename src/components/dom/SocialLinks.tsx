'use client'

import { useState } from 'react';
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Mail, 
  ExternalLink,
  Check,
  Copy,
} from 'lucide-react';
import { socialLinks } from '@/data/content';

// Map icon names to components
const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Github,
  Linkedin,
  Twitter,
  Mail,
};

export default function SocialLinks() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  
  const copyEmail = async (email: string) => {
    const cleanEmail = email.replace('mailto:', '');
    await navigator.clipboard.writeText(cleanEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
      {socialLinks.map(link => {
        const IconComponent = iconMap[link.icon] || ExternalLink;
        const isEmail = link.url.startsWith('mailto:');
        
        return (
          <div key={link.name} className="relative group w-full">
            {isEmail ? (
              // Email with copy functionality
              <button
                onClick={() => copyEmail(link.url)}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-[var(--event-horizon)] hover:bg-[var(--event-horizon)]/80 transition-all group w-full cursor-pointer"
              >
                <IconComponent 
                  size={20} 
                  className="text-[var(--tungsten-gray)] group-hover:text-[var(--terminal-cyan)] transition-colors shrink-0"
                />
                <span className="text-[var(--photon-white)] text-sm md:text-base">{link.name}</span>
                {copiedEmail ? (
                  <Check size={16} className="text-green-500 ml-auto shrink-0" />
                ) : (
                  <Copy size={16} className="text-[var(--tungsten-gray)] opacity-0 group-hover:opacity-100 transition-opacity ml-auto shrink-0" />
                )}
              </button>
            ) : (
              // Regular link
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-[var(--event-horizon)] hover:bg-[var(--event-horizon)]/80 transition-all group w-full cursor-pointer"
              >
                <IconComponent 
                  size={20} 
                  className="text-[var(--tungsten-gray)] group-hover:text-[var(--terminal-cyan)] transition-colors shrink-0"
                />
                <span className="text-[var(--photon-white)] text-sm md:text-base">{link.name}</span>
                <ExternalLink 
                  size={16} 
                  className="text-[var(--tungsten-gray)] opacity-0 group-hover:opacity-100 transition-opacity ml-auto shrink-0"
                />
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}