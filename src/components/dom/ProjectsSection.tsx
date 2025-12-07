'use client'

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import Link from 'next/link';
import BeamSplitter from '@/components/canvas/BeamSplitter';
import { binaryColors } from '@/data/projects';

const PURPLE = '#8F00FF';

export default function ProjectsSection() {
  return (
    <section id="projects" className="relative min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-[var(--terminal-cyan)] text-sm font-mono uppercase tracking-widest mb-4 block">
            What I&apos;ve Built
          </span>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-[var(--photon-white)] mb-4">
            Projects
          </h2>
          <p className="text-[var(--tungsten-gray)] max-w-xl mx-auto">
            Light splits into two paths: transmitted binary for CS projects, 
            reflected beam for physics research. Click a beam to explore.
          </p>
        </div>
        
        {/* 3D Beam Splitter */}
        <div className="h-[500px] w-full rounded-2xl overflow-hidden bg-[var(--void-black)]/50">
          <Canvas camera={{ position: [2, 2, 12], fov: 45 }}>
            <BeamSplitter />
            <OrbitControls 
              enableZoom={false}
              enablePan={false}
              minPolarAngle={Math.PI / 3}
              maxPolarAngle={Math.PI / 2}
            />
            <Environment preset="night" />
          </Canvas>
        </div>
        
        {/* Category Legend / Quick Links */}
        <div className="flex flex-wrap justify-center gap-6 mt-8">
          <Link
            href="/cs-projects"
            className="flex items-center gap-3 px-6 py-3 rounded-full bg-[var(--event-horizon)] hover:bg-[var(--event-horizon)]/80 transition-all hover:scale-105"
          >
            <span 
              className="w-4 h-4 rounded-full animate-pulse"
              style={{ backgroundColor: binaryColors.primary }}
            />
            <span className="text-[var(--photon-white)]">CS Projects</span>
            <span className="text-[var(--tungsten-gray)] text-sm font-mono">01010</span>
          </Link>
          <Link
            href="/research"
            className="flex items-center gap-3 px-6 py-3 rounded-full bg-[var(--event-horizon)] hover:bg-[var(--event-horizon)]/80 transition-all hover:scale-105"
          >
            <span 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: PURPLE }}
            />
            <span className="text-[var(--photon-white)]">Physics Research</span>
            <span className="text-[var(--tungsten-gray)] text-sm">λ ψ ∇</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
