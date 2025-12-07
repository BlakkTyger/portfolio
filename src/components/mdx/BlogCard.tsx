import Link from 'next/link';
import type { PostMeta } from '@/lib/mdx';

interface BlogCardProps {
  post: PostMeta;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <article className="group p-6 bg-[var(--event-horizon)] rounded-xl hover:bg-[var(--event-horizon)]/80 transition-colors">
        {/* Date and reading time */}
        <div className="flex items-center gap-4 text-sm text-[var(--tungsten-gray)] mb-3">
          <time>{new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}</time>
          <span>•</span>
          <span>{post.readingTime}</span>
        </div>
        
        {/* Title */}
        <h2 className="font-heading text-2xl text-[var(--photon-white)] mb-2 group-hover:text-[var(--terminal-cyan)] transition-colors">
          {post.title}
        </h2>
        
        {/* Description */}
        <p className="text-[var(--tungsten-gray)] mb-4 line-clamp-2">
          {post.description}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {post.tags.map(tag => (
            <span
              key={tag}
              className="px-2 py-1 text-xs rounded-full bg-[var(--void-black)] text-[var(--tungsten-gray)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </article>
    </Link>
  );
}