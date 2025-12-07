'use client'

interface NavLinkProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export default function NavLink({ label, isActive, onClick }: NavLinkProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative py-2 font-mono text-sm uppercase tracking-widest
        transition-colors duration-300
        ${isActive 
          ? 'text-[var(--terminal-cyan)]' 
          : 'text-[var(--tungsten-gray)] hover:text-[var(--photon-white)]'
        }
      `}
    >
      {label}
      
      {/* Active indicator */}
      <span
        className={`
          absolute bottom-0 left-0 right-0 h-0.5
          bg-[var(--terminal-cyan)]
          transition-transform duration-300 origin-left
          ${isActive ? 'scale-x-100' : 'scale-x-0'}
        `}
      />
    </button>
  );
}