import Image from 'next/image';
import Link from 'next/link';
import CodeBlock from './CodeBlock';

// === COMPONENT MAP ===

export const mdxComponents = {
  // Override default elements
  h1: (props: any) => (
    <h1 
      className="font-heading text-4xl md:text-5xl text-[var(--photon-white)] mt-12 mb-6"
      {...props}
    />
  ),
  
  h2: (props: any) => (
    <h2 
      className="font-heading text-3xl text-[var(--photon-white)] mt-10 mb-4 border-b border-[var(--tungsten-gray)]/20 pb-2"
      {...props}
    />
  ),
  
  h3: (props: any) => (
    <h3 
      className="font-heading text-2xl text-[var(--photon-white)] mt-8 mb-3"
      {...props}
    />
  ),
  
  p: (props: any) => (
    <p 
      className="text-[var(--photon-white)]/90 leading-relaxed mb-6"
      {...props}
    />
  ),
  
  a: (props: any) => (
    <Link 
      className="text-[var(--terminal-cyan)] hover:underline"
      {...props}
    />
  ),
  
  ul: (props: any) => (
    <ul 
      className="list-disc list-inside space-y-2 mb-6 text-[var(--photon-white)]/90"
      {...props}
    />
  ),
  
  ol: (props: any) => (
    <ol 
      className="list-decimal list-inside space-y-2 mb-6 text-[var(--photon-white)]/90"
      {...props}
    />
  ),
  
  blockquote: (props: any) => (
    <blockquote 
      className="border-l-4 border-[var(--spectral-violet)] pl-4 italic text-[var(--tungsten-gray)] my-6"
      {...props}
    />
  ),
  
  // Code blocks with syntax highlighting
  pre: (props: any) => <CodeBlock {...props} />,
  
  code: (props: any) => {
    // Inline code (no language)
    if (!props.className) {
      return (
        <code className="px-1.5 py-0.5 bg-[var(--event-horizon)] rounded text-[var(--terminal-cyan)] font-mono text-sm">
          {props.children}
        </code>
      );
    }
    // Code block (handled by pre/CodeBlock)
    return <code {...props} />;
  },
  
  // Images with Next.js optimization
  img: (props: any) => (
    <span className="block my-8">
      <Image
        src={props.src}
        alt={props.alt || ''}
        width={800}
        height={400}
        className="rounded-xl"
      />
      {props.alt && (
        <span className="block text-center text-sm text-[var(--tungsten-gray)] mt-2">
          {props.alt}
        </span>
      )}
    </span>
  ),
  
  // Custom components available in MDX
  Alert: ({ type = 'info', children }: { type?: 'info' | 'warning' | 'error'; children: React.ReactNode }) => {
    const colors = {
      info: 'border-[var(--terminal-cyan)] bg-[var(--terminal-cyan)]/10',
      warning: 'border-yellow-500 bg-yellow-500/10',
      error: 'border-red-500 bg-red-500/10',
    };
    
    return (
      <div className={`border-l-4 p-4 my-6 rounded-r-lg ${colors[type]}`}>
        {children}
      </div>
    );
  },
  
  Callout: ({ emoji = '💡', children }: { emoji?: string; children: React.ReactNode }) => (
    <div className="flex gap-4 p-4 my-6 bg-[var(--event-horizon)] rounded-xl">
      <span className="text-2xl">{emoji}</span>
      <div>{children}</div>
    </div>
  ),
};