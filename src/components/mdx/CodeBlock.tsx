'use client'

import { useState } from 'react';

interface CodeBlockProps {
  children: React.ReactNode;
}

export default function CodeBlock({ children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  
  // Extract code content and language
  const codeElement = children as React.ReactElement;
  const className = codeElement?.props?.className || '';
  const language = className.replace('language-', '');
  const code = codeElement?.props?.children || '';
  
  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="relative my-6 rounded-xl overflow-hidden">
      {/* Language label */}
      {language && (
        <div className="flex items-center justify-between px-4 py-2 bg-[var(--event-horizon)] border-b border-[var(--tungsten-gray)]/20">
          <span className="text-xs font-mono text-[var(--tungsten-gray)] uppercase">
            {language}
          </span>
          <button
            onClick={copyToClipboard}
            className="text-xs text-[var(--tungsten-gray)] hover:text-[var(--photon-white)]"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      )}
      
      {/* Code content */}
      <pre className="p-4 bg-[var(--void-black)] overflow-x-auto">
        <code className={`text-sm font-mono ${className}`}>
          {code}
        </code>
      </pre>
    </div>
  );
}