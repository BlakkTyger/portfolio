'use client'

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, X, Filter, Tag, BookOpen } from 'lucide-react';
import type { PostMeta } from '@/lib/mdx';

interface BlogPageClientProps {
  posts: PostMeta[];
  allTags: string[];
  allTopics: string[];
}

export default function BlogPageClient({ posts, allTags, allTopics }: BlogPageClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter posts based on search and filters
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Tag filter
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.every(tag => post.tags?.includes(tag));
      
      // Topic filter
      const matchesTopic = !selectedTopic || 
        (post as any).topic === selectedTopic;
      
      return matchesSearch && matchesTags && matchesTopic;
    });
  }, [posts, searchQuery, selectedTags, selectedTopic]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
    setSelectedTopic(null);
  };

  const hasActiveFilters = searchQuery || selectedTags.length > 0 || selectedTopic;

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background elements */}
      <div className="fixed inset-0 -z-10">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--void-black)] via-[#0a0a1a] to-[var(--void-black)]" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(var(--terminal-cyan) 1px, transparent 1px),
              linear-gradient(90deg, var(--terminal-cyan) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
        
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 py-16 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Navigation */}
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-[var(--tungsten-gray)] hover:text-[var(--terminal-cyan)] mb-12 transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-mono">Back to Portfolio</span>
          </Link>
          
          {/* Header */}
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-[var(--terminal-cyan)]" />
              <span className="text-[var(--terminal-cyan)] text-sm font-mono uppercase tracking-widest">
                Written Words
              </span>
            </div>
            <h1 className="font-heading text-5xl md:text-7xl text-[var(--photon-white)] mb-4">
              Blog
            </h1>
            <p className="text-lg md:text-xl text-[var(--tungsten-gray)] max-w-2xl">
              Explorations at the intersection of physics, code, and philosophy. 
              Deep dives into quantum mechanics, programming tutorials, and philosophical musings.
            </p>
          </header>

          {/* Search and Filter Bar */}
          <div className="mb-8 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--tungsten-gray)]" />
              <input
                type="text"
                placeholder="Search posts by title, description, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-[var(--event-horizon)] border border-[var(--tungsten-gray)]/20 
                         rounded-xl text-[var(--photon-white)] placeholder-[var(--tungsten-gray)]/50
                         focus:outline-none focus:border-[var(--terminal-cyan)]/50 focus:ring-1 focus:ring-[var(--terminal-cyan)]/30
                         transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--tungsten-gray)] hover:text-[var(--photon-white)]"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`
                  inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-mono
                  transition-all
                  ${showFilters 
                    ? 'bg-[var(--terminal-cyan)]/10 text-[var(--terminal-cyan)] border border-[var(--terminal-cyan)]/30' 
                    : 'bg-[var(--event-horizon)] text-[var(--tungsten-gray)] hover:text-[var(--photon-white)] border border-transparent'
                  }
                `}
              >
                <Filter size={16} />
                Filters
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-[var(--terminal-cyan)]" />
                )}
              </button>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-[var(--tungsten-gray)] hover:text-[var(--terminal-cyan)] transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="p-6 bg-[var(--event-horizon)] rounded-xl border border-[var(--tungsten-gray)]/10 space-y-6 animate-in slide-in-from-top-2">
                {/* Tags */}
                {allTags.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Tag size={14} className="text-[var(--terminal-cyan)]" />
                      <span className="text-sm font-mono text-[var(--tungsten-gray)]">Tags</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {allTags.map(tag => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`
                            px-3 py-1.5 text-sm rounded-full transition-all
                            ${selectedTags.includes(tag)
                              ? 'bg-[var(--terminal-cyan)] text-black'
                              : 'bg-[var(--void-black)] text-[var(--tungsten-gray)] hover:text-[var(--photon-white)] hover:bg-[var(--void-black)]/80'
                            }
                          `}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Topics */}
                {allTopics.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen size={14} className="text-purple-400" />
                      <span className="text-sm font-mono text-[var(--tungsten-gray)]">Topics</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {allTopics.map(topic => (
                        <button
                          key={topic}
                          onClick={() => setSelectedTopic(selectedTopic === topic ? null : topic)}
                          className={`
                            px-3 py-1.5 text-sm rounded-full transition-all
                            ${selectedTopic === topic
                              ? 'bg-purple-500 text-white'
                              : 'bg-[var(--void-black)] text-[var(--tungsten-gray)] hover:text-[var(--photon-white)]'
                            }
                          `}
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Results count */}
          <div className="mb-6 text-sm text-[var(--tungsten-gray)] font-mono">
            {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'} found
          </div>

          {/* Posts Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {filteredPosts.length > 0 ? (
              filteredPosts.map(post => (
                <Link key={post.slug} href={`/blog/${post.slug}`}>
                  <article className="group h-full p-6 bg-[var(--event-horizon)]/80 backdrop-blur-sm rounded-2xl border border-[var(--tungsten-gray)]/10 hover:border-[var(--terminal-cyan)]/30 transition-all hover:shadow-lg hover:shadow-[var(--terminal-cyan)]/5">
                    {/* Date and reading time */}
                    <div className="flex items-center gap-3 text-xs text-[var(--tungsten-gray)] mb-4 font-mono">
                      <time>{new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}</time>
                      <span className="w-1 h-1 rounded-full bg-[var(--tungsten-gray)]" />
                      <span>{post.readingTime}</span>
                    </div>
                    
                    {/* Title */}
                    <h2 className="font-heading text-xl md:text-2xl text-[var(--photon-white)] mb-3 group-hover:text-[var(--terminal-cyan)] transition-colors">
                      {post.title}
                    </h2>
                    
                    {/* Description */}
                    <p className="text-[var(--tungsten-gray)] mb-4 line-clamp-2 text-sm leading-relaxed">
                      {post.description}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {post.tags?.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-xs rounded-full bg-[var(--void-black)] text-[var(--tungsten-gray)]"
                        >
                          {tag}
                        </span>
                      ))}
                      {(post.tags?.length || 0) > 3 && (
                        <span className="px-2 py-0.5 text-xs text-[var(--tungsten-gray)]">
                          +{post.tags!.length - 3}
                        </span>
                      )}
                    </div>
                  </article>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl text-[var(--photon-white)] mb-2">No posts found</h3>
                <p className="text-[var(--tungsten-gray)]">
                  {hasActiveFilters 
                    ? 'Try adjusting your filters or search query.'
                    : 'Check back soon for new content!'}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 px-4 py-2 text-sm bg-[var(--terminal-cyan)]/10 text-[var(--terminal-cyan)] rounded-lg hover:bg-[var(--terminal-cyan)]/20 transition-colors"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Footer stats */}
          <footer className="mt-16 pt-8 border-t border-[var(--tungsten-gray)]/10">
            <div className="flex flex-wrap gap-8 text-sm text-[var(--tungsten-gray)]">
              <div>
                <span className="font-mono text-[var(--terminal-cyan)]">{posts.length}</span> total posts
              </div>
              <div>
                <span className="font-mono text-purple-400">{allTags.length}</span> tags
              </div>
              {allTopics.length > 0 && (
                <div>
                  <span className="font-mono text-amber-400">{allTopics.length}</span> topics
                </div>
              )}
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}
