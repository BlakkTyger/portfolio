I'll create a comprehensive, beginner-friendly guide. This will be a detailed document explaining every concept, technology, and implementation step.

Here's a comprehensive, beginner-friendly development guide. Since this is quite long, I recommend saving this as a new file `docs/detailed-guide.md`.

---

# The Coherent State — Complete Developer Guide

## For Developers New to the Tech Stack

This guide assumes you have basic programming knowledge but are new to React, Next.js, Three.js, and the other technologies used in this project. Every concept is explained from first principles.

---

# Table of Contents

1. [Technology Primer](#technology-primer)
2. [Environment Setup](#environment-setup)
3. [Phase 1: Foundation & Design System](#phase-1-foundation--design-system)
4. [Phase 2: Pre-Landing Animation](#phase-2-pre-landing-animation)
5. [Phase 3: Landing Page (3D Particles)](#phase-3-landing-page-3d-particles)
6. [Phase 4-5: WhoAmI & CV Sections](#phase-4-5-whoami--cv-sections)
7. [Phase 6: Worldline Trajectory](#phase-6-worldline-trajectory)
8. [Phase 7: Interests Manifold](#phase-7-interests-manifold)
9. [Phase 8: Transitions](#phase-8-transitions)
10. [Phase 9: Navigation](#phase-9-navigation)
11. [Phase 10: Projects Page (Beam Splitter)](#phase-10-projects-page)
12. [Phase 11: Archive/Blogs](#phase-11-archiveblogs)
13. [Phase 12: Contact Page](#phase-12-contact-page)
14. [Phase 13: Polish & Deployment](#phase-13-polish--deployment)

---

# Technology Primer

Before writing any code, understand what each tool does and why we use it.

## 1. React (The UI Library)

**What it is:** A JavaScript library for building user interfaces using "components" — reusable, self-contained pieces of UI.

**Core Concepts:**
- **Components:** Functions that return JSX (HTML-like syntax in JavaScript)
- **Props:** Data passed from parent to child components
- **State:** Data that can change and trigger re-renders
- **Hooks:** Functions like `useState`, `useEffect` that add features to functional components

**Example:**
```tsx
// A simple React component
function Greeting({ name }) {
  const [count, setCount] = useState(0);  // State hook
  
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <button onClick={() => setCount(count + 1)}>
        Clicked {count} times
      </button>
    </div>
  );
}
```

**Learning Resources:**
- [React Official Tutorial](https://react.dev/learn) — Start here
- [React Hooks Explained](https://react.dev/reference/react/hooks)

---

## 2. Next.js (The Framework)

**What it is:** A React framework that adds routing, server-side rendering, and production optimizations.

**Why we use it:**
- **File-based routing:** Create `app/about/page.tsx` → automatically get `/about` route
- **Server Components:** Components render on the server for better SEO and performance
- **Client Components:** Add `'use client'` for interactive components
- **Built-in optimization:** Images, fonts, and code are automatically optimized

**Key Concepts:**

### App Router Structure
```
src/app/
├── layout.tsx      # Wraps ALL pages (shared header, fonts, etc.)
├── page.tsx        # The "/" home page
├── work/
│   └── page.tsx    # The "/work" page
└── blogs/
    ├── page.tsx    # The "/blogs" page
    └── [slug]/
        └── page.tsx  # Dynamic route: "/blogs/my-article"
```

### Server vs Client Components
```tsx
// SERVER COMPONENT (default) — runs on server, can't use useState/useEffect
export default function Page() {
  return <h1>I render on the server!</h1>;
}

// CLIENT COMPONENT — add 'use client' at top for interactivity
'use client'
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

**Learning Resources:**
- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Server vs Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)

---

## 3. TypeScript (The Language)

**What it is:** JavaScript with static types. Catches errors before runtime.

**Basic Syntax:**
```typescript
// Typed variables
const name: string = "Himanshu";
const age: number = 22;
const isStudent: boolean = true;

// Typed function
function greet(name: string): string {
  return `Hello, ${name}`;
}

// Interface (shape of an object)
interface Project {
  id: string;
  title: string;
  tags: string[];
  isPublished?: boolean;  // Optional property
}

// Using the interface
const project: Project = {
  id: "qec",
  title: "Quantum Error Correction",
  tags: ["Python", "Qiskit"]
};
```

**Learning Resources:**
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

---

## 4. Tailwind CSS (Styling)

**What it is:** A utility-first CSS framework. Instead of writing CSS files, you add classes directly to HTML.

**Traditional CSS:**
```css
/* styles.css */
.card {
  background-color: #121212;
  padding: 1rem;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
}
```

**Tailwind CSS:**
```jsx
<div className="bg-[#121212] p-4 rounded-lg flex flex-col">
  {/* Same result, no separate CSS file */}
</div>
```

**Common Classes:**
| Class | CSS Equivalent |
|-------|----------------|
| `p-4` | `padding: 1rem` |
| `m-2` | `margin: 0.5rem` |
| `flex` | `display: flex` |
| `justify-center` | `justify-content: center` |
| `items-center` | `align-items: center` |
| `w-full` | `width: 100%` |
| `h-screen` | `height: 100vh` |
| `text-xl` | `font-size: 1.25rem` |
| `font-bold` | `font-weight: 700` |
| `bg-black` | `background-color: black` |
| `text-white` | `color: white` |
| `rounded-lg` | `border-radius: 0.5rem` |
| `hover:bg-gray-800` | Background changes on hover |

**Custom Colors:**
```jsx
// Use arbitrary values with square brackets
<div className="bg-[#050505] text-[#F0F0F0]">
  Custom colors!
</div>
```

**Learning Resources:**
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Tailwind Cheat Sheet](https://nerdcave.com/tailwind-cheat-sheet)

---

## 5. Three.js & React Three Fiber (3D Graphics)

**What Three.js is:** A JavaScript library for creating 3D graphics in the browser using WebGL.

**What React Three Fiber (R3F) is:** A React renderer for Three.js. Write Three.js code as React components.

**Core Three.js Concepts:**

### The Scene Graph
```
Scene (the 3D world)
├── Camera (your viewpoint)
├── Lights
│   ├── AmbientLight (uniform light everywhere)
│   ├── DirectionalLight (like the sun)
│   └── PointLight (like a lightbulb)
└── Meshes (3D objects)
    ├── Geometry (the shape: cube, sphere, etc.)
    └── Material (the appearance: color, texture, shininess)
```

### Vanilla Three.js vs React Three Fiber

**Vanilla Three.js:**
```javascript
// Lots of imperative code
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
const renderer = new THREE.WebGLRenderer();

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  renderer.render(scene, camera);
}
animate();
```

**React Three Fiber (same result):**
```tsx
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';

function SpinningCube() {
  const meshRef = useRef();
  
  // useFrame runs every frame (60fps)
  useFrame(() => {
    meshRef.current.rotation.x += 0.01;
  });
  
  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="green" />
    </mesh>
  );
}

// In your page:
export default function Scene() {
  return (
    <Canvas>
      <SpinningCube />
    </Canvas>
  );
}
```

### Important R3F Hooks

```tsx
import { useFrame, useThree } from '@react-three/fiber';

function MyComponent() {
  // Access the Three.js internals
  const { camera, scene, gl } = useThree();
  
  // Runs every frame (animation loop)
  useFrame((state, delta) => {
    // state.clock.elapsedTime — total time since start
    // delta — time since last frame (~0.016s at 60fps)
  });
}
```

### @react-three/drei (Helpers)

Drei provides pre-built components that would be tedious to create:

```tsx
import { 
  OrbitControls,    // Click-and-drag camera rotation
  Text,             // 3D text
  Float,            // Makes objects float/bob
  MeshTransmissionMaterial,  // Glass/crystal material
  Environment,      // HDR environment lighting
  useGLTF,          // Load 3D models
} from '@react-three/drei';

function Scene() {
  return (
    <Canvas>
      <OrbitControls />
      <Float speed={2} floatIntensity={1}>
        <mesh>
          <sphereGeometry />
          <MeshTransmissionMaterial 
            transmission={0.95}
            thickness={0.5}
          />
        </mesh>
      </Float>
    </Canvas>
  );
}
```

**Learning Resources:**
- [Three.js Fundamentals](https://threejs.org/manual/#en/fundamentals) — Understand the basics
- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)
- [Drei Components](https://github.com/pmndrs/drei)
- [Bruno Simon's Three.js Journey](https://threejs-journey.com/) — Best comprehensive course (paid)

---

## 6. GSAP (Animation)

**What it is:** GreenSock Animation Platform — the most powerful JavaScript animation library.

**Why we use it:**
- Smooth, performant animations
- Timeline sequencing
- ScrollTrigger for scroll-based animations
- Works with DOM elements and Three.js objects

### Basic GSAP Syntax

```javascript
import gsap from 'gsap';

// Animate TO a state
gsap.to(".box", {
  x: 100,           // Move 100px right
  rotation: 360,    // Rotate 360 degrees
  duration: 1,      // Over 1 second
  ease: "power2.out" // Easing function
});

// Animate FROM a state
gsap.from(".box", {
  opacity: 0,
  y: -50,
  duration: 0.5
});
```

### GSAP Timeline (Sequenced Animations)

```javascript
const tl = gsap.timeline();

tl.to(".title", { opacity: 1, duration: 0.5 })
  .to(".subtitle", { opacity: 1, duration: 0.5 }, "-=0.2") // Start 0.2s before previous ends
  .to(".button", { scale: 1, duration: 0.3 })
  .call(() => console.log("Animation complete!"));
```

### GSAP with React (`@gsap/react`)

```tsx
'use client'
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';

function AnimatedComponent() {
  const containerRef = useRef(null);
  
  useGSAP(() => {
    // Animation code here — runs after component mounts
    gsap.from(".box", {
      opacity: 0,
      y: 50,
      stagger: 0.1  // Each .box animates 0.1s after the previous
    });
  }, { scope: containerRef }); // Only animate elements inside this ref
  
  return (
    <div ref={containerRef}>
      <div className="box">1</div>
      <div className="box">2</div>
      <div className="box">3</div>
    </div>
  );
}
```

### ScrollTrigger (Scroll-Based Animation)

```tsx
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

useGSAP(() => {
  gsap.to(".parallax-bg", {
    yPercent: -50,
    scrollTrigger: {
      trigger: ".section",    // Element that triggers the animation
      start: "top bottom",    // When top of trigger hits bottom of viewport
      end: "bottom top",      // When bottom of trigger hits top of viewport
      scrub: true,            // Animation progress tied to scroll position
    }
  });
});
```

**Learning Resources:**
- [GSAP Getting Started](https://gsap.com/docs/v3/GSAP/)
- [ScrollTrigger Docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [GSAP + React Guide](https://gsap.com/resources/React/)

---

## 7. Zustand (State Management)

**What it is:** A tiny, fast state management library. Simpler than Redux.

**Why we need it:** Share data between components without "prop drilling" (passing props through many levels).

### Creating a Store

```typescript
// src/store/useStore.ts
import { create } from 'zustand';

interface StoreState {
  // State
  count: number;
  isMenuOpen: boolean;
  
  // Actions (functions that modify state)
  increment: () => void;
  toggleMenu: () => void;
  setCount: (value: number) => void;
}

export const useStore = create<StoreState>((set) => ({
  // Initial state
  count: 0,
  isMenuOpen: false,
  
  // Actions
  increment: () => set((state) => ({ count: state.count + 1 })),
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
  setCount: (value) => set({ count: value }),
}));
```

### Using the Store in Components

```tsx
'use client'
import { useStore } from '@/store/useStore';

function Counter() {
  // Subscribe to specific state
  const count = useStore((state) => state.count);
  const increment = useStore((state) => state.increment);
  
  return (
    <button onClick={increment}>
      Count: {count}
    </button>
  );
}

function Menu() {
  const isMenuOpen = useStore((state) => state.isMenuOpen);
  const toggleMenu = useStore((state) => state.toggleMenu);
  
  return (
    <>
      <button onClick={toggleMenu}>Toggle</button>
      {isMenuOpen && <nav>Menu content...</nav>}
    </>
  );
}
```

**Learning Resources:**
- [Zustand GitHub](https://github.com/pmndrs/zustand)
- [Zustand Tutorial](https://docs.pmnd.rs/zustand/getting-started/introduction)

---

## 8. @react-three/rapier (3D Physics)

**What it is:** A physics engine for React Three Fiber. Makes objects fall, collide, and interact realistically.

### Basic Physics Setup

```tsx
import { Canvas } from '@react-three/fiber';
import { Physics, RigidBody } from '@react-three/rapier';

function PhysicsScene() {
  return (
    <Canvas>
      <Physics gravity={[0, -9.81, 0]}>
        {/* This ball will fall and bounce */}
        <RigidBody>
          <mesh position={[0, 5, 0]}>
            <sphereGeometry />
            <meshStandardMaterial />
          </mesh>
        </RigidBody>
        
        {/* Static floor (type="fixed" means it doesn't move) */}
        <RigidBody type="fixed">
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[10, 0.5, 10]} />
            <meshStandardMaterial />
          </mesh>
        </RigidBody>
      </Physics>
    </Canvas>
  );
}
```

### Applying Forces

```tsx
import { useRef } from 'react';
import { RigidBody, RapierRigidBody } from '@react-three/rapier';

function Pushable() {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  
  const push = () => {
    // Apply an impulse (instantaneous force)
    rigidBodyRef.current?.applyImpulse({ x: 10, y: 5, z: 0 }, true);
  };
  
  return (
    <RigidBody ref={rigidBodyRef}>
      <mesh onClick={push}>
        <boxGeometry />
        <meshStandardMaterial />
      </mesh>
    </RigidBody>
  );
}
```

**Learning Resources:**
- [React Three Rapier Docs](https://github.com/pmndrs/react-three-rapier)

---

# Environment Setup

## Prerequisites

1. **Node.js 18+** — Download from [nodejs.org](https://nodejs.org)
2. **VS Code** — Recommended editor with extensions:
   - ESLint
   - Tailwind CSS IntelliSense
   - TypeScript Hero
   - ES7+ React/Redux/React-Native snippets

## Project Already Initialized

Your project already has the dependencies installed. If starting fresh:

```bash
npx create-next-app@latest portfolio --typescript --tailwind --eslint --app
cd portfolio
npm install three @react-three/fiber @react-three/drei @react-three/rapier
npm install gsap @gsap/react
npm install zustand
npm install clsx tailwind-merge
```

## Running the Project

```bash
cd /home/blakktyger/Documents/BlakkTyger/Projects/portfolio/portfolio
npm run dev
```

Open http://localhost:3000 in your browser.

---

# Phase 1: Foundation & Design System

## Step 1.1: Update CSS Variables

**File:** [src/app/globals.css](cci:7://file:///home/blakktyger/Documents/BlakkTyger/Projects/portfolio/portfolio/src/app/globals.css:0:0-0:0)

**What we're doing:** Defining our color palette as CSS variables so we can use them consistently everywhere.

```css
@import "tailwindcss";

:root {
  /* Primary Colors */
  --void-black: #050505;
  --event-horizon: #121212;
  
  /* Accent Colors */
  --spectral-violet: #8F00FF;
  --terminal-cyan: #00FF9D;
  
  /* Text Colors */
  --photon-white: #F0F0F0;
  --tungsten-gray: #888888;
  
  /* Semantic aliases for Tailwind */
  --background: var(--void-black);
  --foreground: var(--photon-white);
  --card: var(--event-horizon);
  --accent-physics: var(--spectral-violet);
  --accent-code: var(--terminal-cyan);
  --muted: var(--tungsten-gray);
}

body {
  background: var(--background);
  color: var(--foreground);
  overflow-x: hidden;
}

/* Hide scrollbars but keep functionality */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Smooth scrolling globally */
html {
  scroll-behavior: smooth;
}
```

**Using in Tailwind:**
```jsx
<div className="bg-[var(--void-black)] text-[var(--photon-white)]">
  Content
</div>
```

---

## Step 1.2: Configure Custom Fonts

**File:** [src/app/layout.tsx](cci:7://file:///home/blakktyger/Documents/BlakkTyger/Projects/portfolio/portfolio/src/app/layout.tsx:0:0-0:0)

**What we're doing:** Loading Google Fonts optimized through Next.js, then making them available via CSS variables.

```tsx
import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Header font - futuristic, wide stance
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap", // Show fallback font while loading
});

// Body font - clean, readable
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

// Code/UI font - monospaced
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Himanshu Sharma | The Coherent State",
  description: "Personal portfolio showcasing physics research and software development",
  keywords: ["portfolio", "physicist", "developer", "quantum computing"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="no-scrollbar">
      <body
        className={`
          ${spaceGrotesk.variable} 
          ${inter.variable} 
          ${jetbrainsMono.variable}
          font-sans antialiased
        `}
      >
        {children}
      </body>
    </html>
  );
}
```

**Add to globals.css to use the fonts:**
```css
/* Font family utilities */
.font-heading {
  font-family: var(--font-heading), system-ui, sans-serif;
}

.font-body {
  font-family: var(--font-body), system-ui, sans-serif;
}

.font-mono {
  font-family: var(--font-mono), monospace;
}

/* Default body font */
body {
  font-family: var(--font-body), system-ui, sans-serif;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading), system-ui, sans-serif;
}

code, pre, .mono {
  font-family: var(--font-mono), monospace;
}
```

---

## Step 1.3: Create Utility Functions

**File:** `src/lib/utils.ts`

**What we're doing:** Creating reusable helper functions.

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names intelligently.
 * Uses clsx to handle conditional classes and twMerge to resolve Tailwind conflicts.
 * 
 * @example
 * cn("px-4 py-2", isActive && "bg-blue-500", className)
 * cn("p-4", "p-8") // Returns "p-8" (twMerge resolves conflict)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Linear interpolation between two values.
 * Used for smooth animations.
 * 
 * @param start - Starting value
 * @param end - Target value
 * @param t - Progress (0 to 1)
 * @returns Interpolated value
 * 
 * @example
 * lerp(0, 100, 0.5) // Returns 50
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Clamps a value between min and max.
 * 
 * @example
 * clamp(150, 0, 100) // Returns 100
 * clamp(-50, 0, 100) // Returns 0
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Maps a value from one range to another.
 * 
 * @example
 * mapRange(5, 0, 10, 0, 100) // Returns 50
 * mapRange(0.5, 0, 1, -1, 1) // Returns 0
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

/**
 * Generates a random number between min and max.
 */
export function randomRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Generates a random integer between min and max (inclusive).
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Debounce function - delays execution until after wait milliseconds 
 * have elapsed since the last time it was invoked.
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), wait);
  };
}
```

---

## Step 1.4: Extend Zustand Store

**File:** [src/store/useStore.ts](cci:7://file:///home/blakktyger/Documents/BlakkTyger/Projects/portfolio/portfolio/src/store/useStore.ts:0:0-0:0)

**What we're doing:** Creating a global state store for data that multiple components need to share.

```typescript
import { create } from 'zustand';

// Define all possible section names
type SectionName = 
  | 'intro'      // Pre-landing animation
  | 'hero'       // Landing page
  | 'whoami'     // About section
  | 'worldline'  // Timeline
  | 'manifold'   // Interests graph
  | 'projects'   // Work page
  | 'archive'    // Blogs/misc page
  | 'contact';   // Contact page

// Define the shape of our store
interface UIState {
  // === State Properties ===
  
  /** Whether intro animation has completed */
  isIntroComplete: boolean;
  
  /** Simple mode disables 3D for low-powered devices */
  isSimpleMode: boolean;
  
  /** Currently visible/active section */
  currentSection: SectionName;
  
  /** 3D camera position [x, y, z] */
  cameraPosition: [number, number, number];
  
  /** Selected project category on work page */
  activeProjectCategory: 'development' | 'research' | null;
  
  /** Scroll progress (0 to 1) for scroll-linked animations */
  scrollProgress: number;
  
  // === Actions (functions that modify state) ===
  
  setIntroComplete: (complete: boolean) => void;
  toggleSimpleMode: () => void;
  setSection: (section: SectionName) => void;
  setCameraPosition: (pos: [number, number, number]) => void;
  setProjectCategory: (cat: 'development' | 'research' | null) => void;
  setScrollProgress: (progress: number) => void;
}

export const useStore = create<UIState>((set) => ({
  // Initial state values
  isIntroComplete: false,
  isSimpleMode: false,
  currentSection: 'intro',
  cameraPosition: [0, 0, 5],
  activeProjectCategory: null,
  scrollProgress: 0,
  
  // Action implementations
  setIntroComplete: (complete) => set({ isIntroComplete: complete }),
  
  toggleSimpleMode: () => set((state) => ({ 
    isSimpleMode: !state.isSimpleMode 
  })),
  
  setSection: (section) => set({ currentSection: section }),
  
  setCameraPosition: (pos) => set({ cameraPosition: pos }),
  
  setProjectCategory: (cat) => set({ activeProjectCategory: cat }),
  
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
}));

// === Selector hooks for performance ===
// Using selectors prevents unnecessary re-renders

export const useIsIntroComplete = () => useStore((s) => s.isIntroComplete);
export const useIsSimpleMode = () => useStore((s) => s.isSimpleMode);
export const useCurrentSection = () => useStore((s) => s.currentSection);
export const useActiveProjectCategory = () => useStore((s) => s.activeProjectCategory);
```

---

# Phase 2: Pre-Landing Animation

## Concept

When the site loads, "Hello" appears, then "Universe" appears below it. After a pause, the entire text swings away like a pendulum, revealing the main content.

## Step 2.1: Create the Intro Component

**File:** `src/components/dom/IntroAnimation.tsx`

```tsx
'use client'

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useStore } from '@/store/useStore';

/**
 * IntroAnimation Component
 * 
 * Displays "Hello" then "Universe" text, then swings them away
 * in a pendulum motion to reveal the main site content.
 */
export default function IntroAnimation() {
  // Reference to the container element for GSAP targeting
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Get the action to mark intro as complete
  const setIntroComplete = useStore((state) => state.setIntroComplete);
  const isIntroComplete = useStore((state) => state.isIntroComplete);
  
  useGSAP(() => {
    // Skip animation if already completed (e.g., on navigation back)
    if (isIntroComplete) return;
    
    // Create a timeline for sequenced animations
    const tl = gsap.timeline({
      onComplete: () => {
        // Mark intro as complete when animation finishes
        setIntroComplete(true);
      }
    });
    
    // Animation sequence:
    tl
      // 1. Fade in "Hello" with slight upward movement
      .from('.intro-hello', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out'
      })
      
      // 2. Fade in "Universe" (starts 0.3s before Hello finishes)
      .from('.intro-universe', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out'
      }, '-=0.3') // Negative value = overlap with previous animation
      
      // 3. Pause for 1 second to let user read
      .to({}, { duration: 1 })
      
      // 4. Pendulum swing animation
      // Transform origin is set to top-right, so it rotates from that point
      .to('.intro-text-group', {
        x: '-100vw',           // Move off-screen to the left
        rotation: -15,          // Rotate counter-clockwise
        opacity: 0,
        duration: 1.2,
        ease: 'power2.inOut'   // Smooth acceleration and deceleration
      })
      
      // 5. Fade out the entire container
      .to(containerRef.current, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          // Remove from DOM flow after animation
          if (containerRef.current) {
            containerRef.current.style.display = 'none';
          }
        }
      }, '-=0.3');
      
  }, { scope: containerRef });
  
  // Don't render if intro already complete
  if (isIntroComplete) return null;
  
  return (
    <div 
      ref={containerRef}
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-[var(--void-black)]
      "
    >
      {/* 
        Text group - transform-origin is top-right for pendulum effect
        The group rotates around this point when swinging away
      */}
      <div 
        className="intro-text-group origin-top-right"
        style={{ transformOrigin: 'top right' }}
      >
        {/* "Hello" text */}
        <h1 className="intro-hello font-heading text-[12vw] leading-none text-[var(--photon-white)]">
          Hello
        </h1>
        
        {/* "Universe" text */}
        <h1 className="intro-universe font-heading text-[12vw] leading-none text-[var(--photon-white)]">
          Universe
        </h1>
      </div>
    </div>
  );
}
```

**Key GSAP Concepts Explained:**

1. **Timeline (`gsap.timeline()`):** Chains animations in sequence. Each animation starts after the previous one ends (unless you use position parameters like `-=0.3`).

2. **Position Parameter (`'-=0.3'`):** Controls when an animation starts relative to the timeline position:
   - `'-=0.3'` = Start 0.3 seconds before the previous animation ends (overlap)
   - `'+=0.5'` = Start 0.5 seconds after the previous animation ends (gap)
   - `'<'` = Start at the same time as the previous animation

3. **Easing (`ease: 'power2.inOut'`):** Controls acceleration:
   - `power1` = gentle, `power4` = dramatic
   - `.in` = slow start, fast end
   - `.out` = fast start, slow end
   - `.inOut` = slow start, fast middle, slow end

---

## Step 2.2: Integrate Intro into Main Page

**File:** [src/app/page.tsx](cci:7://file:///home/blakktyger/Documents/BlakkTyger/Projects/portfolio/portfolio/src/app/page.tsx:0:0-0:0)

```tsx
import IntroAnimation from '@/components/dom/IntroAnimation';
import SceneWrapper from '@/components/canvas/SceneWrapper';

export default function Home() {
  return (
    <main className="relative w-full min-h-screen">
      {/* Pre-landing animation overlay */}
      <IntroAnimation />
      
      {/* 3D Background */}
      <SceneWrapper />
      
      {/* Main content - renders behind intro until animation completes */}
      <div className="relative z-10">
        {/* Content will be added in later phases */}
        <section className="h-screen flex items-center justify-center">
          <h1 className="text-4xl font-heading">Main Content</h1>
        </section>
      </div>
    </main>
  );
}
```

---

# Phase 3: Landing Page (3D Particles)

## Concept

A cloud of particles floating in Brownian motion (random movement). They're attracted to the mouse cursor and explode outward when clicked.

## Step 3.1: Create the Hero Particles Component

**File:** `src/components/canvas/Hero.tsx`

```tsx
'use client'

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { randomRange } from '@/lib/utils';

// Configuration constants
const PARTICLE_COUNT = 800;  // Number of particles
const BOUNDS = 8;            // How far particles can spread
const ATTRACTION_STRENGTH = 0.00003;  // How strongly particles are attracted to cursor
const BROWNIAN_STRENGTH = 0.002;      // Random movement strength
const DAMPING = 0.98;                 // Velocity reduction per frame (0-1)
const SHOCKWAVE_STRENGTH = 0.5;       // Click explosion strength

// Type for our particle data
interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  originalPosition: THREE.Vector3;
}

/**
 * Hero Component
 * 
 * Creates an interactive particle cloud that responds to mouse movement and clicks.
 */
export default function Hero() {
  // Reference to the instanced mesh for direct manipulation
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  // Track mouse position in normalized coordinates (-1 to 1)
  const mouse = useRef(new THREE.Vector2(0, 0));
  const mouse3D = useRef(new THREE.Vector3(0, 0, 0));
  
  // Track click state for shockwave
  const isClicked = useRef(false);
  const clickPosition = useRef(new THREE.Vector3(0, 0, 0));
  
  // Access Three.js viewport info
  const { viewport, camera } = useThree();
  
  // Create particle data only once (useMemo prevents recreation on re-renders)
  const particles = useMemo<Particle[]>(() => {
    const temp: Particle[] = [];
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Random starting position within bounds
      const position = new THREE.Vector3(
        randomRange(-BOUNDS, BOUNDS),
        randomRange(-BOUNDS, BOUNDS),
        randomRange(-BOUNDS / 2, BOUNDS / 2)
      );
      
      temp.push({
        position: position.clone(),
        velocity: new THREE.Vector3(0, 0, 0),
        originalPosition: position.clone(),
      });
    }
    
    return temp;
  }, []);
  
  // Temporary matrix for efficient instanced mesh updates
  const tempMatrix = useMemo(() => new THREE.Matrix4(), []);
  const tempObject = useMemo(() => new THREE.Object3D(), []);
  
  // Handle mouse move - convert to 3D coordinates
  const handlePointerMove = (event: THREE.Event) => {
    // Get normalized device coordinates (-1 to 1)
    mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Convert to 3D world coordinates at z=0
    mouse3D.current.set(
      mouse.current.x * viewport.width / 2,
      mouse.current.y * viewport.height / 2,
      0
    );
  };
  
  // Handle click - trigger shockwave
  const handleClick = (event: THREE.Event) => {
    isClicked.current = true;
    clickPosition.current.copy(mouse3D.current);
    
    // Reset click state after short delay
    setTimeout(() => {
      isClicked.current = false;
    }, 100);
  };
  
  // Animation loop - runs every frame (60fps)
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Update each particle
    particles.forEach((particle, i) => {
      // === 1. BROWNIAN MOTION (random movement) ===
      particle.velocity.add(new THREE.Vector3(
        (Math.random() - 0.5) * BROWNIAN_STRENGTH,
        (Math.random() - 0.5) * BROWNIAN_STRENGTH,
        (Math.random() - 0.5) * BROWNIAN_STRENGTH * 0.5
      ));
      
      // === 2. MOUSE ATTRACTION (inverse square law) ===
      const toMouse = mouse3D.current.clone().sub(particle.position);
      const distance = toMouse.length();
      
      if (distance > 0.1) { // Avoid division by near-zero
        // Inverse square: force = 1/distance² (clamped to prevent extreme values)
        const force = Math.min(ATTRACTION_STRENGTH / (distance * distance), 0.01);
        toMouse.normalize().multiplyScalar(force);
        particle.velocity.add(toMouse);
      }
      
      // === 3. SHOCKWAVE (click explosion) ===
      if (isClicked.current) {
        const fromClick = particle.position.clone().sub(clickPosition.current);
        const clickDist = fromClick.length();
        
        if (clickDist > 0.1 && clickDist < 5) {
          // Push particles away from click point
          fromClick.normalize().multiplyScalar(SHOCKWAVE_STRENGTH / clickDist);
          particle.velocity.add(fromClick);
        }
      }
      
      // === 4. APPLY DAMPING (friction) ===
      particle.velocity.multiplyScalar(DAMPING);
      
      // === 5. UPDATE POSITION ===
      particle.position.add(particle.velocity);
      
      // === 6. SOFT BOUNDARY (keep particles in view) ===
      ['x', 'y', 'z'].forEach((axis) => {
        const bound = axis === 'z' ? BOUNDS / 2 : BOUNDS;
        if (Math.abs(particle.position[axis as 'x' | 'y' | 'z']) > bound) {
          // Gentle push back toward center
          particle.velocity[axis as 'x' | 'y' | 'z'] *= -0.5;
          particle.position[axis as 'x' | 'y' | 'z'] *= 0.99;
        }
      });
      
      // === 7. UPDATE INSTANCE MATRIX ===
      tempObject.position.copy(particle.position);
      tempObject.updateMatrix();
      meshRef.current!.setMatrixAt(i, tempObject.matrix);
    });
    
    // Tell Three.js the matrices have changed
    meshRef.current.instanceMatrix.needsUpdate = true;
  });
  
  return (
    <group
      onPointerMove={handlePointerMove as any}
      onClick={handleClick as any}
    >
      {/* Invisible plane to capture mouse events across the whole viewport */}
      <mesh visible={false}>
        <planeGeometry args={[100, 100]} />
      </mesh>
      
      {/* 
        InstancedMesh: Efficiently renders many identical objects
        Instead of creating 800 separate meshes (expensive),
        we create one mesh that renders 800 times with different positions
      */}
      <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
        {/* Small spheres for particles */}
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial 
          color="#F0F0F0" 
          transparent 
          opacity={0.8}
        />
      </instancedMesh>
    </group>
  );
}
```

**Key Concepts Explained:**

1. **InstancedMesh:** When you need many identical objects (like particles), InstancedMesh renders them all in a single draw call. Instead of telling the GPU "draw sphere, draw sphere, draw sphere..." 800 times, it says "draw 800 spheres at once."

2. **Matrix:** Each instance's position, rotation, and scale are stored in a 4x4 matrix. We update these matrices every frame.

3. **useFrame:** The animation loop hook. Runs every frame (~60 times per second). The `delta` parameter tells you how long since the last frame (useful for frame-rate-independent animation).

4. **Brownian Motion:** Small random movements that make particles feel alive.

5. **Inverse Square Law:** Force decreases with the square of distance. This is how gravity and electromagnetic forces work in real life.

---

## Step 3.2: Update Scene to Include Hero

**File:** [src/components/canvas/Scene.tsx](cci:7://file:///home/blakktyger/Documents/BlakkTyger/Projects/portfolio/portfolio/src/components/canvas/Scene.tsx:0:0-0:0)

```tsx
'use client'

import { Canvas } from '@react-three/fiber';
import { Preload, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import Hero from './Hero';

interface SceneProps {
  children?: React.ReactNode;
}

export default function Scene({ children }: SceneProps) {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        // Camera settings
        camera={{
          position: [0, 0, 10],  // Camera position [x, y, z]
          fov: 50,               // Field of view (degrees)
          near: 0.1,             // Near clipping plane
          far: 100,              // Far clipping plane
        }}
        // Performance settings
        dpr={[1, 2]}  // Device pixel ratio range (auto-adjusts)
        performance={{ min: 0.5 }}  // Target 50% of native performance minimum
      >
        {/* Adaptive performance helpers */}
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        
        {/* Ambient light for basic visibility */}
        <ambientLight intensity={0.5} />
        
        {/* Directional light (like the sun) */}
        <directionalLight position={[5, 5, 5]} intensity={1} />
        
        {/* Our particle system */}
        <Hero />
        
        {/* Additional children (for composition) */}
        {children}
        
        {/* Preload all assets */}
        <Preload all />
      </Canvas>
    </div>
  );
}
```

---

## Step 3.3: Create Hero Overlay (DOM Text)

**File:** `src/components/dom/HeroOverlay.tsx`

```tsx
'use client'

import { useState, useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useIsIntroComplete } from '@/store/useStore';

// The roles that cycle through
const ROLES = ['STUDENT', 'PHYSICIST', 'DEVELOPER'];

export default function HeroOverlay() {
  const [roleIndex, setRoleIndex] = useState(0);
  const roleRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const isIntroComplete = useIsIntroComplete();
  
  // Animate in after intro completes
  useGSAP(() => {
    if (!isIntroComplete) return;
    
    gsap.from(containerRef.current, {
      opacity: 0,
      y: 30,
      duration: 1,
      ease: 'power3.out',
      delay: 0.3,
    });
  }, { dependencies: [isIntroComplete] });
  
  // Role cycling animation
  useGSAP(() => {
    if (!isIntroComplete || !roleRef.current) return;
    
    // Create cycling timeline
    const tl = gsap.timeline({
      repeat: -1,        // Infinite repeat
      repeatDelay: 2.5,  // Pause between cycles
    });
    
    tl
      // Swipe out current role (cyan color block wipes left-to-right)
      .to(roleRef.current, {
        clipPath: 'inset(0 0 0 100%)',  // Hide from left to right
        duration: 0.4,
        ease: 'power2.in',
      })
      // Change the role index
      .call(() => {
        setRoleIndex((prev) => (prev + 1) % ROLES.length);
      })
      // Reset clip-path for reveal
      .set(roleRef.current, {
        clipPath: 'inset(0 100% 0 0)',  // Hidden from right
      })
      // Swipe in new role
      .to(roleRef.current, {
        clipPath: 'inset(0 0 0 0)',  // Fully visible
        duration: 0.4,
        ease: 'power2.out',
      });
      
  }, { dependencies: [isIntroComplete], scope: containerRef });
  
  // Don't render until intro is complete
  if (!isIntroComplete) return null;
  
  return (
    <div 
      ref={containerRef}
      className="
        absolute inset-0 z-10
        flex flex-col items-center justify-center
        pointer-events-none
      "
    >
      {/* Name */}
      <p className="font-mono text-sm tracking-widest text-[var(--tungsten-gray)] mb-4">
        HIMANSHU SHARMA
      </p>
      
      {/* Main title */}
      <h1 className="font-heading text-6xl md:text-8xl font-bold text-[var(--photon-white)] mb-6">
        {ROLES[roleIndex]}
      </h1>
      
      {/* Animated role with clip-path reveal */}
      <div className="flex items-center gap-3">
        <span className="text-[var(--terminal-cyan)] text-2xl">+</span>
        <span 
          ref={roleRef}
          className="
            font-heading text-2xl text-[var(--terminal-cyan)]
            relative
          "
          style={{ clipPath: 'inset(0 0 0 0)' }}
        >
          {/* Cyan background block for the swipe effect */}
          <span className="absolute inset-0 bg-[var(--terminal-cyan)] -z-10 opacity-20" />
          {ROLES[roleIndex]}
        </span>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
        <span className="font-mono text-xs text-[var(--tungsten-gray)] mb-2">
          SCROLL TO EXPLORE
        </span>
        <div className="w-6 h-10 border-2 border-[var(--tungsten-gray)] rounded-full flex justify-center">
          <div className="w-1 h-2 bg-[var(--photon-white)] rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </div>
  );
}
```

**Key CSS Concept - clip-path:**
```css
/* clip-path defines a visible region. Anything outside is hidden. */

/* inset(top right bottom left) - like padding, but for visibility */
clip-path: inset(0 0 0 0);     /* Fully visible */
clip-path: inset(0 100% 0 0);  /* Hidden (clipped from right) */
clip-path: inset(0 0 0 100%);  /* Hidden (clipped from left) */

/* Animating between these creates a reveal/hide effect */
```

---

# Phase 4-5: WhoAmI & CV Sections

These are primarily DOM-based content sections. I'll provide templates you can populate with your own content.

## Step 4.1: WhoAmI Section

**File:** `src/components/dom/WhoAmI.tsx`

```tsx
'use client'

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

export default function WhoAmI() {
  const sectionRef = useRef<HTMLElement>(null);
  
  useGSAP(() => {
    // Animate elements when they scroll into view
    const elements = gsap.utils.toArray('.fade-in-up');
    
    elements.forEach((el: any) => {
      gsap.from(el, {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',  // Start when element top hits 80% down the viewport
          end: 'top 20%',    // End when element top hits 20% down
          toggleActions: 'play none none reverse',
          // play = on enter, none = on leave, none = on enter back, reverse = on leave back
        }
      });
    });
  }, { scope: sectionRef });
  
  return (
    <section 
      ref={sectionRef}
      className="min-h-screen py-20 px-6 md:px-20"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section title */}
        <h2 className="fade-in-up font-heading text-5xl md:text-7xl font-bold mb-12">
          Who Am I?
        </h2>
        
        {/* Bio card */}
        <div className="fade-in-up bg-[var(--event-horizon)] rounded-2xl p-8 md:p-12 mb-8">
          <p className="font-body text-lg md:text-xl leading-relaxed text-[var(--photon-white)]">
            I&apos;m <span className="text-[var(--terminal-cyan)]">Himanshu Sharma</span>, 
            a physics student passionate about the intersection of quantum mechanics 
            and computer science. My work spans from theoretical physics research 
            to building software that pushes the boundaries of what&apos;s possible.
          </p>
        </div>
        
        {/* Quick facts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="fade-in-up bg-[var(--event-horizon)] rounded-xl p-6">
            <h3 className="font-mono text-[var(--spectral-violet)] text-sm mb-2">
              CURRENT FOCUS
            </h3>
            <p className="font-heading text-xl">Quantum Computing & AI</p>
          </div>
          
          <div className="fade-in-up bg-[var(--event-horizon)] rounded-xl p-6">
            <h3 className="font-mono text-[var(--terminal-cyan)] text-sm mb-2">
              LOCATION
            </h3>
            <p className="font-heading text-xl">Your Location Here</p>
          </div>
          
          <div className="fade-in-up bg-[var(--event-horizon)] rounded-xl p-6">
            <h3 className="font-mono text-[var(--spectral-violet)] text-sm mb-2">
              EDUCATION
            </h3>
            <p className="font-heading text-xl">Your University</p>
          </div>
          
          <div className="fade-in-up bg-[var(--event-horizon)] rounded-xl p-6">
            <h3 className="font-mono text-[var(--terminal-cyan)] text-sm mb-2">
              INTERESTS
            </h3>
            <p className="font-heading text-xl">Physics, Code, Philosophy</p>
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

## Step 5.1: CV Section

**File:** `src/components/dom/CV.tsx`

```tsx
'use client'

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Define your CV data
const education = [
  {
    period: '2022 - Present',
    title: 'B.Sc. Physics',
    institution: 'Your University',
    description: 'Specializing in quantum mechanics and computational physics.',
  },
  // Add more...
];

const skills = [
  { category: 'Languages', items: ['Python', 'TypeScript', 'C++'] },
  { category: 'Physics', items: ['Quantum Mechanics', 'QFT', 'Statistical Mechanics'] },
  { category: 'ML/AI', items: ['PyTorch', 'TensorFlow', 'JAX'] },
  { category: 'Web', items: ['React', 'Next.js', 'Three.js'] },
];

export default function CV() {
  const sectionRef = useRef<HTMLElement>(null);
  
  useGSAP(() => {
    gsap.utils.toArray('.cv-item').forEach((el: any, i) => {
      gsap.from(el, {
        x: i % 2 === 0 ? -50 : 50,  // Alternate left/right
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
        }
      });
    });
  }, { scope: sectionRef });
  
  return (
    <section 
      ref={sectionRef}
      className="min-h-screen py-20 px-6 md:px-20"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header with download button */}
        <div className="flex justify-between items-center mb-16">
          <h2 className="font-heading text-5xl md:text-7xl font-bold">
            Curriculum Vitae
          </h2>
          <a 
            href="/cv.pdf" 
            download
            className="
              font-mono text-sm px-6 py-3 
              border border-[var(--terminal-cyan)] text-[var(--terminal-cyan)]
              rounded-full
              hover:bg-[var(--terminal-cyan)] hover:text-[var(--void-black)]
              transition-colors duration-300
            "
          >
            DOWNLOAD PDF
          </a>
        </div>
        
        {/* Education Timeline */}
        <div className="mb-16">
          <h3 className="font-mono text-[var(--tungsten-gray)] text-sm mb-8 tracking-widest">
            EDUCATION
          </h3>
          
          <div className="space-y-8">
            {education.map((item, i) => (
              <div 
                key={i}
                className="cv-item flex gap-8 border-l-2 border-[var(--spectral-violet)] pl-8"
              >
                <div className="font-mono text-[var(--tungsten-gray)] text-sm whitespace-nowrap">
                  {item.period}
                </div>
                <div>
                  <h4 className="font-heading text-2xl text-[var(--photon-white)] mb-1">
                    {item.title}
                  </h4>
                  <p className="text-[var(--terminal-cyan)] mb-2">{item.institution}</p>
                  <p className="text-[var(--tungsten-gray)]">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Skills Grid */}
        <div>
          <h3 className="font-mono text-[var(--tungsten-gray)] text-sm mb-8 tracking-widest">
            SKILLS
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((skill, i) => (
              <div 
                key={i}
                className="cv-item bg-[var(--event-horizon)] rounded-xl p-6"
              >
                <h4 className="font-mono text-[var(--terminal-cyan)] text-xs mb-4">
                  {skill.category.toUpperCase()}
                </h4>
                <ul className="space-y-2">
                  {skill.items.map((item, j) => (
                    <li key={j} className="font-body text-[var(--photon-white)]">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

# Phase 6: Worldline Trajectory

This is a complex 3D section where the camera moves forward through space as the user scrolls, passing through "milestone markers" representing life events.

## Step 6.1: Worldline 3D Component

**File:** `src/components/canvas/Worldline.tsx`

```tsx
'use client'

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';

// Milestone data - your life events
const milestones = [

The detailed guide is too long for a single response. Let me provide a practical solution:

## Recommendation

I suggest creating **`docs/detailed-guide.md`** incrementally. The full guide I was writing covers:

1. **Technology Primer** (~2000 words) - React, Next.js, TypeScript, Tailwind, Three.js/R3F, GSAP, Zustand, Rapier
2. **Per-Phase Implementation** (~500-800 words each × 13 phases)

**Total: ~15,000+ words** — too large for chat.

---

## Proposed Approach

**Option A:** I create the guide in chunks across multiple messages as you request each phase.

**Option B:** Switch to **Code Mode** and I'll create the `docs/detailed-guide.md` file directly, writing it in sections.

**Option C:** I provide you with a condensed version now with:
- Key learning resources for each technology
- Critical code patterns to understand
- Phase-by-phase "what to learn before coding" checklist

---

## Quick Reference: Essential Learning Resources

| Technology | Resource | Time to Learn |
|------------|----------|---------------|
| **React** | [react.dev/learn](https://react.dev/learn) | 4-6 hours |
| **Next.js App Router** | [nextjs.org/docs/app](https://nextjs.org/docs/app) | 2-3 hours |
| **TypeScript** | [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/) | 3-4 hours |
| **Tailwind CSS** | [tailwindcss.com/docs](https://tailwindcss.com/docs) | 1-2 hours |
| **Three.js Basics** | [threejs.org/manual](https://threejs.org/manual/) | 4-6 hours |
| **React Three Fiber** | [docs.pmnd.rs/react-three-fiber](https://docs.pmnd.rs/react-three-fiber) | 3-4 hours |
| **GSAP** | [gsap.com/docs](https://gsap.com/docs/v3/GSAP/) | 2-3 hours |
| **Zustand** | [GitHub README](https://github.com/pmndrs/zustand) | 30 min |

---

## Suggested Learning Path

1. **Week 1:** React fundamentals → Next.js App Router → TypeScript basics
2. **Week 2:** Tailwind CSS → Build Phases 1-2 (Foundation + Intro Animation)
3. **Week 3:** Three.js concepts → R3F → Build Phase 3 (Particles)
4. **Week 4:** GSAP ScrollTrigger → Build Phases 4-6 (Content sections)
5. **Week 5:** Physics (Rapier) → Build Phase 7 (Manifold)
6. **Week 6:** Remaining phases + polish

---

**Which option would you prefer?** I can proceed with any of the three approaches.