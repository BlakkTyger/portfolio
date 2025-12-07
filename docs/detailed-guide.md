# The Coherent State — Complete Developer Guide

## For Developers New to the Tech Stack

This guide assumes basic programming knowledge but no experience with React, Next.js, Three.js, or other technologies in this project. Every concept is explained from first principles.

---

# Table of Contents

1. [Technology Primer](#technology-primer)
2. [Phase 1: Foundation](#phase-1-foundation--design-system)
3. [Phase 2: Pre-Landing Animation](#phase-2-pre-landing-animation)
4. [Phase 3: Landing Page (3D)](#phase-3-landing-page-3d-particles)
5. [Phase 4-5: WhoAmI & CV](#phase-4-5-whoami--cv-sections)
6. [Phase 6: Worldline](#phase-6-worldline-trajectory)
7. [Phase 7: Manifold](#phase-7-interests-manifold)
8. [Phase 8-13: Remaining Phases](#phase-8-13-remaining-phases)

---

# Technology Primer

## Quick Reference: Learning Resources

| Technology | Resource | Time |
|------------|----------|------|
| **React** | [react.dev/learn](https://react.dev/learn) | 4-6h |
| **Next.js** | [nextjs.org/docs/app](https://nextjs.org/docs/app) | 2-3h |
| **TypeScript** | [typescriptlang.org/docs](https://www.typescriptlang.org/docs/handbook/) | 3-4h |
| **Tailwind** | [tailwindcss.com/docs](https://tailwindcss.com/docs) | 1-2h |
| **Three.js** | [threejs.org/manual](https://threejs.org/manual/) | 4-6h |
| **R3F** | [docs.pmnd.rs/react-three-fiber](https://docs.pmnd.rs/react-three-fiber) | 3-4h |
| **GSAP** | [gsap.com/docs](https://gsap.com/docs/v3/GSAP/) | 2-3h |
| **Zustand** | [github.com/pmndrs/zustand](https://github.com/pmndrs/zustand) | 30min |

---

## 1. React Essentials

**Components** = Functions returning JSX:
```tsx
function Button({ label, onClick }) {
  return <button onClick={onClick}>{label}</button>;
}
```

**useState** = Reactive data:
```tsx
const [count, setCount] = useState(0);
// setCount(5) or setCount(prev => prev + 1)
```

**useRef** = Persist values without re-render:
```tsx
const meshRef = useRef(null);
// meshRef.current = the DOM/3D element
```

**useMemo** = Cache expensive calculations:
```tsx
const sorted = useMemo(() => items.sort(), [items]);
```

---

## 2. Next.js App Router

**File-based routing:**
```
src/app/page.tsx        → /
src/app/work/page.tsx   → /work
src/app/blogs/[slug]/page.tsx → /blogs/any-slug
```

**Server vs Client Components:**
```tsx
// Server (default) - no interactivity
export default function Page() {
  return <h1>Static</h1>;
}

// Client - add 'use client' for hooks/events
'use client'
export default function Interactive() {
  const [x, setX] = useState(0);
  return <button onClick={() => setX(x+1)}>{x}</button>;
}
```

---

## 3. TypeScript Basics

```typescript
// Types
const name: string = "Himanshu";
const age: number = 22;

// Interfaces
interface Project {
  id: string;
  title: string;
  tags: string[];
  published?: boolean; // optional
}

// Function types
function greet(name: string): string {
  return `Hello, ${name}`;
}
```

---

## 4. Tailwind CSS

**Utility classes instead of CSS files:**
```jsx
// Instead of: .card { padding: 1rem; background: #121212; }
<div className="p-4 bg-[#121212] rounded-lg flex flex-col">
```

**Common classes:** `p-4` (padding), `m-2` (margin), `flex`, `grid`, `w-full`, `h-screen`, `text-xl`, `font-bold`, `rounded-lg`, `hover:bg-gray-800`

**Responsive:** `md:text-lg` (medium screens+), `lg:hidden` (hide on large)

---

## 5. Three.js + React Three Fiber

**Scene structure:**
```
Canvas (container)
├── Camera
├── Lights (ambient, directional, point)
└── Meshes (geometry + material)
```

**R3F pattern:**
```tsx
'use client'
import { Canvas, useFrame } from '@react-three/fiber';

function Cube() {
  const ref = useRef();
  useFrame(() => { ref.current.rotation.y += 0.01; });
  return (
    <mesh ref={ref}>
      <boxGeometry args={[1,1,1]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
}

export default function Scene() {
  return (
    <Canvas camera={{ position: [0,0,5] }}>
      <ambientLight />
      <Cube />
    </Canvas>
  );
}
```

**Key hooks:**
- `useFrame((state, delta) => {})` — runs every frame
- `useThree()` — access camera, scene, viewport

---

## 6. GSAP Animation

```javascript
// Animate TO final state
gsap.to(".box", { x: 100, rotation: 360, duration: 1 });

// Animate FROM initial state
gsap.from(".box", { opacity: 0, y: -50, duration: 0.5 });

// Timeline (sequenced)
const tl = gsap.timeline();
tl.to(".a", { opacity: 1 })
  .to(".b", { opacity: 1 }, "-=0.3"); // overlap
```

**With React:**
```tsx
'use client'
import { useGSAP } from '@gsap/react';

function Component() {
  const ref = useRef(null);
  useGSAP(() => {
    gsap.from(".item", { opacity: 0, stagger: 0.1 });
  }, { scope: ref });
  return <div ref={ref}>...</div>;
}
```

---

## 7. Zustand State

```typescript
// store/useStore.ts
import { create } from 'zustand';

interface State {
  count: number;
  increment: () => void;
}

export const useStore = create<State>((set) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 })),
}));

// Usage in component
const count = useStore((s) => s.count);
const increment = useStore((s) => s.increment);
```

---

# Phase 1: Foundation & Design System

## What This Phase Accomplishes

Before building any visible features, we need to establish the **foundation** of our application. Think of this like preparing a canvas before painting—we're setting up:

1. **Color System** — A consistent palette used throughout the entire site
2. **Typography** — Fonts that match our futuristic/scientific aesthetic
3. **Utility Functions** — Reusable helper code we'll need everywhere
4. **Global State** — A way to share data between different parts of the app

This phase creates no visible UI changes, but everything we build later depends on it.

---

## Prerequisites for This Phase

Before starting, make sure you understand:

### CSS Variables (Custom Properties)
CSS variables let you define values once and reuse them everywhere.

```css
/* Define a variable */
:root {
  --my-color: #ff0000;
}

/* Use it anywhere */
.button {
  background: var(--my-color);
}
```

**Why use them?** If you decide to change a color, you change it in ONE place instead of finding every usage.

**Resource:** [MDN CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

### TypeScript Interfaces
Interfaces define the "shape" of data—what properties an object must have.

```typescript
// This defines what a "User" looks like
interface User {
  name: string;      // must have a name (text)
  age: number;       // must have an age (number)
  email?: string;    // optional (the ? means it's not required)
}

// TypeScript will error if you try to create a User without name/age
const user: User = { name: "John", age: 25 };
```

**Resource:** [TypeScript Handbook - Interfaces](https://www.typescriptlang.org/docs/handbook/2/objects.html)

---

## File 1: Global Styles (`src/app/globals.css`)

### What This File Does

This is the **global stylesheet** that applies to every page in your application. In Next.js, you import this file in `layout.tsx` and its styles affect everything.

We're using it to:
1. Import Tailwind CSS (our utility class framework)
2. Define CSS variables for our color palette
3. Set base styles for the `body` element

### The Complete Code with Explanations

```css
/* ============================================================
   GLOBAL STYLES - src/app/globals.css
   
   This file is imported in layout.tsx and affects ALL pages.
   ============================================================ */

/* 
   STEP 1: Import Tailwind CSS
   
   This single line brings in Tailwind's utility classes.
   After this import, you can use classes like "p-4", "flex", 
   "text-white" etc. in your HTML/JSX.
   
   Tailwind 4 uses this new import syntax (older versions used @tailwind directives)
*/
@import "tailwindcss";

/* 
   STEP 2: Define CSS Variables (Custom Properties)
   
   :root means these variables are available EVERYWHERE in your CSS.
   :root is a pseudo-class that matches the <html> element.
   
   We're creating our color palette as variables so we can:
   - Use consistent colors throughout the app
   - Change a color in one place to update it everywhere
   - Reference colors in both CSS and Tailwind (using var())
*/
:root {
  /* === PRIMARY BACKGROUND COLORS === */
  
  /* 
     --void-black: The main background color
     #050505 is almost pure black but slightly lighter
     Pure black (#000000) can be harsh on screens, so we soften it
  */
  --void-black: #050505;
  
  /* 
     --event-horizon: Secondary background for cards, modals, etc.
     #121212 is a common "dark mode" color used by Spotify, YouTube, etc.
     It provides subtle contrast against the main background
  */
  --event-horizon: #121212;
  
  /* === ACCENT COLORS === */
  
  /* 
     --spectral-violet: Purple accent for physics/quantum content
     #8F00FF is a vivid purple/violet
     We'll use this for anything related to physics research
  */
  --spectral-violet: #8F00FF;
  
  /* 
     --terminal-cyan: Green accent for code/development content  
     #00FF9D is a bright cyan/green (like terminal text)
     We'll use this for anything related to programming
  */
  --terminal-cyan: #00FF9D;
  
  /* === TEXT COLORS === */
  
  /* 
     --photon-white: Primary text color
     #F0F0F0 is off-white (easier on eyes than pure white #FFFFFF)
  */
  --photon-white: #F0F0F0;
  
  /* 
     --tungsten-gray: Secondary/muted text
     #888888 is medium gray for less important text, labels, metadata
  */
  --tungsten-gray: #888888;
  
  /* === SEMANTIC ALIASES === */
  /* 
     These map our creative names to standard names.
     This makes it clearer what each color is FOR.
  */
  --background: var(--void-black);
  --foreground: var(--photon-white);
  --card: var(--event-horizon);
  --muted: var(--tungsten-gray);
}

/* 
   STEP 3: Global Body Styles
   
   These styles apply to the <body> element on every page.
*/
body {
  /* Use our background and text color variables */
  background: var(--background);
  color: var(--foreground);
  
  /* 
     Prevent horizontal scrollbar from appearing
     This is important because some animations might briefly
     extend content beyond the viewport width
  */
  overflow-x: hidden;
  
  /* 
     Set the default font family
     var(--font-body) will be set by Next.js font loading
     system-ui is the fallback if custom font fails to load
  */
  font-family: var(--font-body), system-ui, sans-serif;
}

/* 
   STEP 4: Smooth Scrolling
   
   This makes anchor link navigation smooth instead of instant jumps.
   When you click a link to #section-id, the page smoothly scrolls there.
*/
html {
  scroll-behavior: smooth;
}

/* 
   STEP 5: Typography Classes
   
   These classes let us easily apply different fonts.
   The CSS variables (--font-heading, etc.) will be set 
   by Next.js font loading in layout.tsx
*/
.font-heading {
  font-family: var(--font-heading), system-ui, sans-serif;
}

.font-body {
  font-family: var(--font-body), system-ui, sans-serif;
}

.font-mono {
  font-family: var(--font-mono), monospace;
}

/* Apply heading font to all heading elements */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading), system-ui, sans-serif;
}

/* Apply mono font to code elements */
code, pre {
  font-family: var(--font-mono), monospace;
}

/* 
   STEP 6: Utility Classes
   
   These are helper classes we can add to any element.
*/

/* Hide scrollbars but keep scroll functionality */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;      /* Firefox */
}

/* Custom text selection color */
::selection {
  background: var(--spectral-violet);
  color: var(--photon-white);
}
```

### How to Use These Colors in Your Components

```jsx
// Method 1: Using CSS variables directly in Tailwind
<div className="bg-[var(--void-black)] text-[var(--photon-white)]">
  Content with custom colors
</div>

// Method 2: Using CSS variables in inline styles
<div style={{ backgroundColor: 'var(--event-horizon)' }}>
  Card content
</div>

// Method 3: In a CSS file
.my-component {
  border-color: var(--spectral-violet);
}
```

---

## File 2: Utility Functions (`src/lib/utils.ts`)

### What This File Does

This file contains **helper functions** that we'll use throughout the project. Instead of writing the same code multiple times, we write it once here and import it where needed.

### Why We Need Each Function

| Function | Purpose | Used In |
|----------|---------|---------|
| `cn()` | Combine CSS classes smartly | Every component with conditional styles |
| `lerp()` | Smooth animations between values | 3D animations, camera movement |
| `clamp()` | Keep values within bounds | Preventing values from going too high/low |
| `randomRange()` | Generate random numbers | Particle positions, randomized effects |

### The Complete Code with Explanations

```typescript
/* ============================================================
   UTILITY FUNCTIONS - src/lib/utils.ts
   
   Reusable helper functions used throughout the application.
   Import these with: import { cn, lerp } from '@/lib/utils'
   ============================================================ */

// These are external libraries we're importing
// clsx: Conditionally joins class names
// twMerge: Intelligently merges Tailwind classes
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/* 
   FUNCTION: cn (className)
   
   PURPOSE: Combine multiple class names into one string, handling:
   - Conditional classes (only add if condition is true)
   - Tailwind conflicts (if you have "p-4" and "p-8", keep only "p-8")
   
   HOW IT WORKS:
   1. clsx takes all inputs and combines them, ignoring falsy values
   2. twMerge resolves Tailwind conflicts (later classes win)
   
   EXAMPLES:
   cn("p-4", "text-white")                    → "p-4 text-white"
   cn("p-4", isActive && "bg-blue-500")       → "p-4" or "p-4 bg-blue-500"
   cn("p-4", "p-8")                           → "p-8" (twMerge resolves conflict)
   cn("text-sm", className)                   → merges with passed className prop
*/
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/* 
   FUNCTION: lerp (Linear Interpolation)
   
   PURPOSE: Calculate a value between two numbers based on a percentage.
   Essential for smooth animations and transitions.
   
   PARAMETERS:
   - start: The starting value (when t = 0)
   - end: The ending value (when t = 1)  
   - t: The progress (0 = start, 1 = end, 0.5 = middle)
   
   MATH: result = start + (end - start) * t
   
   EXAMPLES:
   lerp(0, 100, 0)     → 0      (0% of the way)
   lerp(0, 100, 0.5)   → 50     (50% of the way)
   lerp(0, 100, 1)     → 100    (100% of the way)
   lerp(0, 100, 0.25)  → 25     (25% of the way)
   lerp(10, 20, 0.5)   → 15     (halfway between 10 and 20)
   
   USAGE IN ANIMATIONS:
   // Smoothly move object toward target each frame
   object.x = lerp(object.x, targetX, 0.1);  // Move 10% closer each frame
*/
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/* 
   FUNCTION: clamp
   
   PURPOSE: Restrict a value to be within a minimum and maximum range.
   Prevents values from going too high or too low.
   
   PARAMETERS:
   - value: The number to constrain
   - min: The minimum allowed value
   - max: The maximum allowed value
   
   EXAMPLES:
   clamp(150, 0, 100)  → 100    (150 is too high, capped at max)
   clamp(-50, 0, 100)  → 0      (-50 is too low, raised to min)
   clamp(50, 0, 100)   → 50     (50 is within range, unchanged)
   
   USAGE:
   // Keep scroll progress between 0 and 1
   const progress = clamp(rawProgress, 0, 1);
   
   // Keep opacity valid
   const opacity = clamp(calculatedOpacity, 0, 1);
*/
export function clamp(value: number, min: number, max: number): number {
  // Math.max ensures value is at least 'min'
  // Math.min ensures result is at most 'max'
  return Math.min(Math.max(value, min), max);
}

/* 
   FUNCTION: mapRange
   
   PURPOSE: Convert a value from one range to another range.
   Like lerp, but you specify both input and output ranges.
   
   PARAMETERS:
   - value: The input value
   - inMin, inMax: The input range
   - outMin, outMax: The output range
   
   EXAMPLES:
   mapRange(5, 0, 10, 0, 100)    → 50    (5 is 50% through 0-10, so 50% through 0-100)
   mapRange(0.5, 0, 1, 0, 360)  → 180   (0.5 is 50% through 0-1, maps to 180°)
   mapRange(25, 0, 100, -1, 1)  → -0.5  (25% maps to -0.5 in range -1 to 1)
   
   USAGE:
   // Convert scroll position (0-1000px) to rotation (0-360°)
   const rotation = mapRange(scrollY, 0, 1000, 0, 360);
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

/* 
   FUNCTION: randomRange
   
   PURPOSE: Generate a random decimal number between min and max.
   
   PARAMETERS:
   - min: Minimum possible value (inclusive)
   - max: Maximum possible value (exclusive)
   
   HOW IT WORKS:
   Math.random() returns 0 to 0.999...
   We scale and shift it to our desired range.
   
   EXAMPLES:
   randomRange(0, 10)    → could be 0, 3.7, 9.2, etc.
   randomRange(-5, 5)    → could be -3.2, 0, 4.8, etc.
   randomRange(0, 1)     → same as Math.random()
   
   USAGE:
   // Random particle position
   const x = randomRange(-10, 10);
   const y = randomRange(-10, 10);
*/
export function randomRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/* 
   FUNCTION: randomInt
   
   PURPOSE: Generate a random INTEGER between min and max (inclusive).
   Unlike randomRange, this only returns whole numbers.
   
   EXAMPLES:
   randomInt(1, 6)   → could be 1, 2, 3, 4, 5, or 6 (like a die roll)
   randomInt(0, 10)  → could be 0, 1, 2, ... 10
*/
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* 
   FUNCTION: debounce
   
   PURPOSE: Delay a function from running until after a pause in calls.
   Useful for expensive operations triggered by rapid events (resize, scroll, typing).
   
   HOW IT WORKS:
   Each call resets a timer. The function only runs when the timer completes
   (i.e., when calls stop happening for 'wait' milliseconds).
   
   EXAMPLE:
   // Without debounce: runs 100+ times during resize
   window.addEventListener('resize', expensiveFunction);
   
   // With debounce: runs once, 200ms after resize stops
   window.addEventListener('resize', debounce(expensiveFunction, 200));
*/
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return function (...args: Parameters<T>) {
    // Clear any existing timer
    clearTimeout(timeoutId);
    // Set a new timer
    timeoutId = setTimeout(() => func(...args), wait);
  };
}

/* 
   FUNCTION: throttle
   
   PURPOSE: Ensure a function runs at most once per time period.
   Unlike debounce, this DOES run the function during rapid calls,
   just not more than once per 'wait' milliseconds.
   
   EXAMPLE:
   // Runs at most once every 100ms during scroll
   window.addEventListener('scroll', throttle(updatePosition, 100));
*/
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  
  return function (...args: Parameters<T>) {
    const now = Date.now();
    // Only call if enough time has passed
    if (now - lastCall >= wait) {
      lastCall = now;
      func(...args);
    }
  };
}
```

### How to Import and Use These Functions

```typescript
// In any component file:
import { cn, lerp, randomRange, clamp } from '@/lib/utils';

// Using cn() for class names
<div className={cn(
  "p-4 rounded-lg",           // Always applied
  isActive && "bg-blue-500",  // Only if isActive is true
  className                    // Merge with passed className prop
)}>

// Using lerp() for animation
useFrame(() => {
  // Smoothly move 10% closer to target each frame
  mesh.position.x = lerp(mesh.position.x, targetX, 0.1);
});

// Using randomRange() for particles
const particles = Array.from({ length: 100 }, () => ({
  x: randomRange(-10, 10),
  y: randomRange(-10, 10),
}));
```

---

## File 3: Global State Store (`src/store/useStore.ts`)

### What This File Does

This creates a **global state store** using Zustand. Global state is data that multiple components need to access and modify.

### Why We Need Global State

Imagine this scenario:
1. The `IntroAnimation` component plays the "Hello, Universe" animation
2. When it finishes, it needs to tell the `HeroOverlay` component to appear
3. These components might be in completely different parts of the component tree

Without global state, you'd have to pass data through many levels of components (called "prop drilling"). With Zustand, any component can read or write to the shared state.

### What Each Piece of State Does

| State | Type | Purpose |
|-------|------|---------|
| `isIntroComplete` | boolean | Has the intro animation finished? |
| `isSimpleMode` | boolean | Should we disable 3D for performance? |
| `currentSection` | string | Which section is the user viewing? |
| `cameraPosition` | [x,y,z] | Where is the 3D camera? |
| `scrollProgress` | number | How far has the user scrolled? (0-1) |

### The Complete Code with Explanations

```typescript
/* ============================================================
   GLOBAL STATE STORE - src/store/useStore.ts
   
   This file creates a Zustand store for global application state.
   Any component can read from or write to this store.
   
   ZUSTAND BASICS:
   - create() creates a store with initial state and actions
   - useStore() is a hook to access the store in components
   - Selecting specific state (e.g., useStore(s => s.count)) prevents
     unnecessary re-renders when other state changes
   ============================================================ */

// Import the create function from Zustand
import { create } from 'zustand';

/* 
   TYPE DEFINITIONS
   
   TypeScript interfaces define the "shape" of our data.
   This helps catch errors and provides autocomplete in your editor.
*/

// All possible section names in our site
// Using a "union type" means currentSection can ONLY be one of these values
type SectionName = 
  | 'intro'      // Pre-landing "Hello Universe" animation
  | 'hero'       // Main landing page with particles
  | 'whoami'     // About/bio section
  | 'cv'         // CV/resume section
  | 'worldline'  // Timeline/journey section
  | 'manifold'   // Interests graph section
  | 'projects'   // Work/projects page
  | 'archive'    // Blog/archive page
  | 'contact';   // Contact page

// Project categories for filtering
type ProjectCategory = 'development' | 'research' | null;

/* 
   STORE INTERFACE
   
   This defines ALL the data and functions in our store.
   Think of it as a contract: the store MUST have all of these.
*/
interface UIState {
  // ============ STATE VALUES ============
  // These hold data that can change
  
  /** 
   * Has the intro animation completed?
   * - false: Show the "Hello Universe" overlay
   * - true: Show the main site content
   */
  isIntroComplete: boolean;
  
  /** 
   * Is the site in "simple mode" (no 3D)?
   * - false: Full 3D experience
   * - true: Simplified version for low-power devices
   * Users can toggle this if their device struggles
   */
  isSimpleMode: boolean;
  
  /** 
   * Which section is currently in view?
   * Used to highlight the correct nav item
   */
  currentSection: SectionName;
  
  /** 
   * Is the mobile navigation menu open?
   */
  isMobileMenuOpen: boolean;
  
  /** 
   * Current 3D camera position [x, y, z]
   * Updated as user scrolls through sections
   */
  cameraPosition: [number, number, number];
  
  /** 
   * Scroll progress from 0 to 1
   * 0 = top of page, 1 = bottom of page
   * Used for scroll-linked animations
   */
  scrollProgress: number;
  
  /** 
   * Selected project category on the work page
   * null = no filter, show all
   * 'development' or 'research' = filter to that category
   */
  activeProjectCategory: ProjectCategory;
  
  // ============ ACTIONS ============
  // These are functions that modify the state
  
  /** Mark the intro animation as complete */
  setIntroComplete: (complete: boolean) => void;
  
  /** Toggle between full 3D and simple mode */
  toggleSimpleMode: () => void;
  
  /** Update the current section (for nav highlighting) */
  setSection: (section: SectionName) => void;
  
  /** Open or close mobile menu */
  setMobileMenuOpen: (open: boolean) => void;
  
  /** Update the 3D camera position */
  setCameraPosition: (pos: [number, number, number]) => void;
  
  /** Update scroll progress */
  setScrollProgress: (progress: number) => void;
  
  /** Set the project category filter */
  setProjectCategory: (cat: ProjectCategory) => void;
}

/* 
   CREATE THE STORE
   
   create<UIState>() creates a store that matches our interface.
   
   The function receives 'set' - a function to update state.
   We return an object with:
   - Initial values for all state
   - Implementations for all actions
*/
export const useStore = create<UIState>((set) => ({
  // ============ INITIAL STATE VALUES ============
  
  isIntroComplete: false,           // Intro hasn't played yet
  isSimpleMode: false,              // Start with full 3D
  currentSection: 'intro',          // Start at intro
  isMobileMenuOpen: false,          // Menu starts closed
  cameraPosition: [0, 0, 5],        // Camera starts at z=5
  scrollProgress: 0,                // Start at top
  activeProjectCategory: null,      // No filter initially
  
  // ============ ACTION IMPLEMENTATIONS ============
  
  /* 
     setIntroComplete
     
     Called when the intro animation finishes.
     Also updates currentSection to 'hero' when complete.
  */
  setIntroComplete: (complete) => set({ 
    isIntroComplete: complete,
    // When intro completes, we're now in the 'hero' section
    currentSection: complete ? 'hero' : 'intro'
  }),
  
  /* 
     toggleSimpleMode
     
     Flips isSimpleMode between true and false.
     Uses a function form of set() to access current state.
     
     set((state) => newState) lets you read current state
     set(newState) just replaces without reading
  */
  toggleSimpleMode: () => set((state) => ({ 
    isSimpleMode: !state.isSimpleMode 
  })),
  
  /* 
     setSection
     
     Updates which section is currently active.
     Called by scroll observers when sections come into view.
  */
  setSection: (section) => set({ currentSection: section }),
  
  /* 
     setMobileMenuOpen
     
     Opens or closes the mobile navigation menu.
  */
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  
  /* 
     setCameraPosition
     
     Updates the 3D camera position.
     Called during scroll-linked camera animations.
  */
  setCameraPosition: (pos) => set({ cameraPosition: pos }),
  
  /* 
     setScrollProgress
     
     Updates scroll progress (0 to 1).
     Called by scroll event handlers.
  */
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  
  /* 
     setProjectCategory
     
     Sets the project filter.
     Called when user clicks category buttons on projects page.
  */
  setProjectCategory: (cat) => set({ activeProjectCategory: cat }),
}));

/* 
   SELECTOR HOOKS
   
   These are convenience hooks that select specific pieces of state.
   
   WHY USE THESE?
   
   Bad (causes re-render on ANY state change):
   const { isIntroComplete, currentSection } = useStore();
   
   Good (only re-renders when isIntroComplete changes):
   const isIntroComplete = useStore((s) => s.isIntroComplete);
   
   Best (named hook, even cleaner):
   const isIntroComplete = useIsIntroComplete();
*/

// State selectors
export const useIsIntroComplete = () => useStore((s) => s.isIntroComplete);
export const useIsSimpleMode = () => useStore((s) => s.isSimpleMode);
export const useCurrentSection = () => useStore((s) => s.currentSection);
export const useIsMobileMenuOpen = () => useStore((s) => s.isMobileMenuOpen);
export const useCameraPosition = () => useStore((s) => s.cameraPosition);
export const useScrollProgress = () => useStore((s) => s.scrollProgress);
export const useActiveProjectCategory = () => useStore((s) => s.activeProjectCategory);

// Action selectors
export const useSetIntroComplete = () => useStore((s) => s.setIntroComplete);
export const useToggleSimpleMode = () => useStore((s) => s.toggleSimpleMode);
export const useSetSection = () => useStore((s) => s.setSection);
export const useSetMobileMenuOpen = () => useStore((s) => s.setMobileMenuOpen);
```

### How to Use the Store in Components

```tsx
'use client'  // Must be a client component to use hooks

import { useStore, useIsIntroComplete } from '@/store/useStore';

function MyComponent() {
  // METHOD 1: Using selector hooks (recommended)
  const isIntroComplete = useIsIntroComplete();
  
  // METHOD 2: Using useStore with inline selector
  const currentSection = useStore((state) => state.currentSection);
  const setSection = useStore((state) => state.setSection);
  
  // METHOD 3: Get multiple values (still efficient)
  const { scrollProgress, setScrollProgress } = useStore((state) => ({
    scrollProgress: state.scrollProgress,
    setScrollProgress: state.setScrollProgress,
  }));
  
  // Use state in your component
  if (!isIntroComplete) {
    return <div>Loading...</div>;
  }
  
  return (
    <div>
      <p>Current section: {currentSection}</p>
      <p>Scroll: {Math.round(scrollProgress * 100)}%</p>
      <button onClick={() => setSection('projects')}>
        Go to Projects
      </button>
    </div>
  );
}
```

---

## File 4: Layout with Fonts (`src/app/layout.tsx`)

### What This File Does

This is the **root layout** that wraps every page in your application. It's where you:
1. Load and configure custom fonts
2. Set up metadata (title, description for SEO)
3. Wrap all pages with shared elements (like navigation)

### Understanding Next.js Fonts

Next.js has built-in font optimization. Instead of adding `<link>` tags, you import fonts as JavaScript modules. Benefits:
- Fonts are downloaded at build time, not runtime
- No layout shift while fonts load
- Automatic font subsetting (only download needed characters)

### The Complete Code with Explanations

```tsx
/* ============================================================
   ROOT LAYOUT - src/app/layout.tsx
   
   This component wraps EVERY page in your application.
   Use it for:
   - Loading fonts
   - Setting metadata
   - Adding elements that appear on all pages (nav, footer)
   ============================================================ */

// TypeScript type for Next.js metadata
import type { Metadata } from "next";

// Import fonts from Google Fonts via Next.js
// Next.js will download and self-host these fonts
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";

// Import global styles
import "./globals.css";

/* 
   FONT CONFIGURATION
   
   Each font call creates a font object with:
   - subsets: Which character sets to include (latin = A-Z, numbers, etc.)
   - variable: CSS variable name to use the font
   - display: How to handle font loading ('swap' shows fallback, then swaps)
*/

// Heading font - futuristic, geometric
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",  // Use as var(--font-heading) in CSS
  display: "swap",
});

// Body font - clean, readable
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

// Code font - monospaced for technical content
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

/* 
   METADATA
   
   This object defines SEO and browser metadata.
   Next.js automatically adds these to the <head>.
*/
export const metadata: Metadata = {
  // Browser tab title
  title: "Himanshu Sharma | The Coherent State",
  
  // Search engine description
  description: "Personal portfolio showcasing physics research and software development",
  
  // Search keywords (less important for SEO now, but doesn't hurt)
  keywords: ["portfolio", "physicist", "developer", "quantum computing", "AI"],
  
  // Author info
  authors: [{ name: "Himanshu Sharma" }],
  
  // Open Graph metadata (for social media sharing)
  openGraph: {
    title: "Himanshu Sharma | The Coherent State",
    description: "Physicist, Developer, Philosopher",
    type: "website",
  },
};

/* 
   ROOT LAYOUT COMPONENT
   
   This receives { children } which is the current page content.
   Whatever you put around {children} appears on every page.
*/
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;  // TypeScript: children can be any React content
}) {
  return (
    // The <html> element - add font CSS variables here
    <html lang="en" className="no-scrollbar">
      {/* 
        The <body> element
        
        We add all three font variables as classes.
        This makes the CSS variables available throughout the app.
        
        Template literal (``) lets us write multi-line class strings.
        antialiased is a Tailwind class for smoother font rendering.
      */}
      <body
        className={`
          ${spaceGrotesk.variable} 
          ${inter.variable} 
          ${jetbrainsMono.variable}
          antialiased
        `}
      >
        {/* 
          {children} is where page content goes
          
          For example, when you visit /work:
          - layout.tsx renders
          - {children} is replaced with work/page.tsx content
        */}
        {children}
      </body>
    </html>
  );
}
```

---

## Phase 1 Checklist

After completing this phase, you should have:

- [x] `src/app/globals.css` with color variables and base styles
- [x] `src/lib/utils.ts` with helper functions
- [x] `src/store/useStore.ts` with Zustand store
- [x] `src/app/layout.tsx` with font configuration

## Testing Phase 1

Run the development server and check:

```bash
npm run dev
```

1. **Open browser dev tools** (F12)
2. **Check the Elements tab**: You should see CSS variables in `:root`
3. **Check the console**: No errors about missing fonts or imports
4. **Check the body**: Background should be dark (#050505)

## Resources for Phase 1

| Topic | Resource |
|-------|----------|
| CSS Variables | [MDN CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) |
| Tailwind CSS | [Tailwind Docs](https://tailwindcss.com/docs) |
| TypeScript Interfaces | [TS Handbook - Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html) |
| Zustand | [Zustand GitHub README](https://github.com/pmndrs/zustand) |
| Next.js Fonts | [Next.js Font Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) |
| Next.js Layouts | [Next.js Layouts Docs](https://nextjs.org/docs/app/building-your-application/routing/layouts-and-templates) |

---

# Phase 2: Pre-Landing Animation

## What This Phase Accomplishes

This phase creates the **first thing users see** when they visit your site: a dramatic "Hello, Universe" animation that plays once, then swings away like a pendulum to reveal the main content.

**The Animation Sequence:**
1. Screen starts completely black
2. "Hello" fades in and rises into position
3. "Universe" fades in below it (slightly overlapping)
4. Text holds for 1 second so users can read it
5. Entire text block swings away to the left like a pendulum
6. Background fades out, revealing the main site

**Why This Matters:**
- Creates a memorable first impression
- Sets the tone (scientific, sophisticated)
- Gives the 3D scene time to load in the background

---

## Prerequisites for This Phase

### Understanding GSAP (GreenSock Animation Platform)

GSAP is the animation library we use. Before coding, understand these core concepts:

#### 1. Basic Tweens (Single Animations)

```javascript
// gsap.to() — Animate TO a final state
// The element starts wherever it is and animates TO these values
gsap.to(".box", {
  x: 100,        // Move 100 pixels right
  opacity: 0.5,  // Fade to 50% opacity
  duration: 1,   // Over 1 second
});

// gsap.from() — Animate FROM an initial state
// The element STARTS at these values and animates to its normal CSS state
gsap.from(".box", {
  opacity: 0,    // Start invisible
  y: 50,         // Start 50px below
  duration: 1,   // Animate to normal over 1 second
});

// gsap.fromTo() — Specify both start AND end
gsap.fromTo(".box",
  { opacity: 0, y: 50 },    // FROM these values
  { opacity: 1, y: 0, duration: 1 }  // TO these values
);
```

#### 2. Timelines (Sequenced Animations)

Timelines let you chain animations together:

```javascript
// Create a timeline
const tl = gsap.timeline();

// Add animations — by default, each starts after the previous ends
tl.to(".first", { opacity: 1, duration: 0.5 })  // 0.0s - 0.5s
  .to(".second", { opacity: 1, duration: 0.5 }) // 0.5s - 1.0s
  .to(".third", { opacity: 1, duration: 0.5 }); // 1.0s - 1.5s
```

#### 3. Position Parameter (Timing Control)

The second argument after the animation object controls WHEN it starts:

```javascript
const tl = gsap.timeline();

// Default: starts after previous ends
tl.to(".a", { x: 100, duration: 1 })

// "-=0.5": Start 0.5s BEFORE previous ends (overlap)
  .to(".b", { x: 100, duration: 1 }, "-=0.5")

// "+=0.5": Start 0.5s AFTER previous ends (gap)
  .to(".c", { x: 100, duration: 1 }, "+=0.5")

// "<": Start at SAME TIME as previous
  .to(".d", { x: 100, duration: 1 }, "<")

// "<0.2": Start 0.2s AFTER previous STARTS
  .to(".e", { x: 100, duration: 1 }, "<0.2")

// Absolute time: Start at exactly 2 seconds
  .to(".f", { x: 100, duration: 1 }, 2);
```

**Visual Timeline:**
```
Time:    0s      0.5s      1s       1.5s      2s
         |--------|---------|---------|---------|
.a       [========]
.b              [========]          (overlaps with .a)
.c                        [========] (gap after .b)
.d              [========]          (same start as .b)
```

#### 4. Easing Functions

Easing controls the acceleration curve of animations:

```javascript
gsap.to(".box", {
  x: 100,
  duration: 1,
  ease: "power2.out"  // Fast start, slow end (most natural)
});
```

**Common Easing Values:**
| Ease | Feel | Best For |
|------|------|----------|
| `"none"` | Constant speed | Loops, mechanical |
| `"power1.out"` | Gentle deceleration | Subtle movements |
| `"power2.out"` | Medium deceleration | Most UI animations |
| `"power3.out"` | Strong deceleration | Dramatic entrances |
| `"power2.inOut"` | Slow-fast-slow | Pendulum, swing |
| `"back.out"` | Overshoots then settles | Bouncy buttons |
| `"elastic.out"` | Springy oscillation | Playful UI |
| `"bounce.out"` | Bounces at end | Dropping objects |

**Resource:** [GSAP Ease Visualizer](https://gsap.com/docs/v3/Eases/) — See all eases animated

---

### Understanding useRef in React

`useRef` creates a reference to a DOM element or a persistent value:

```tsx
import { useRef } from 'react';

function MyComponent() {
  // Create a ref — starts as null
  const boxRef = useRef<HTMLDivElement>(null);
  
  // After render, boxRef.current points to the actual DOM element
  const handleClick = () => {
    console.log(boxRef.current);  // <div>...</div>
    boxRef.current?.focus();       // Call DOM methods directly
  };
  
  // Attach ref to an element
  return <div ref={boxRef}>I'm referenced!</div>;
}
```

**Why use refs for GSAP?**
- GSAP animates DOM elements
- We need to tell GSAP which element to animate
- Refs give us direct access to the DOM element

---

### Understanding 'use client' Directive

In Next.js, components are **Server Components** by default. They render on the server and can't use:
- `useState`, `useEffect`, `useRef` (React hooks)
- Browser APIs (`window`, `document`)
- Event handlers (`onClick`, `onChange`)

Adding `'use client'` at the top makes it a **Client Component**:

```tsx
'use client'  // This line is REQUIRED for any component using hooks

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);  // Now this works!
  return <button onClick={() => setCount(c + 1)}>{count}</button>;
}
```

Our `IntroAnimation` component needs `'use client'` because it uses:
- `useRef` (to reference the container)
- `useGSAP` (GSAP's React hook)
- `useStore` (Zustand hook)

---

## File Structure for Phase 2

```
src/
├── components/
│   └── dom/                      # DOM (HTML) components
│       └── IntroAnimation.tsx    # The intro animation (NEW)
├── app/
│   └── page.tsx                  # Home page (MODIFY to include intro)
└── store/
    └── useStore.ts               # Already has isIntroComplete
```

---

## File 1: IntroAnimation Component

### What This Component Does

1. Renders a full-screen black overlay with "Hello" and "Universe" text
2. Plays the entrance + pendulum swing animation using GSAP
3. When animation completes, updates global state (`isIntroComplete = true`)
4. Hides itself after the animation finishes
5. If already complete (user navigated back), doesn't render at all

### The Complete Code with Line-by-Line Explanations

**File:** `src/components/dom/IntroAnimation.tsx`

```tsx
/* ============================================================
   INTRO ANIMATION COMPONENT
   
   This component displays the "Hello, Universe" animation that
   plays when a user first visits the site.
   
   DEPENDENCIES:
   - GSAP: Animation library
   - @gsap/react: React integration for GSAP
   - Zustand store: To track if animation has completed
   ============================================================ */

'use client'
/*
   'use client' DIRECTIVE
   
   This MUST be the first line (before imports).
   It tells Next.js this is a Client Component.
   
   Without this, you'll get an error like:
   "useState/useRef/useEffect can only be used in Client Components"
*/

// === IMPORTS ===

import { useRef } from 'react';
/*
   useRef from React
   
   Creates a "ref" — a reference to a DOM element.
   We need this to:
   1. Give GSAP a "scope" (limit where it looks for elements)
   2. Directly manipulate the container element after animation
*/

import { useGSAP } from '@gsap/react';
/*
   useGSAP from @gsap/react
   
   This is GSAP's official React hook. It:
   1. Runs your animation code after the component mounts
   2. Automatically cleans up animations when component unmounts
   3. Handles React's strict mode (prevents double-running)
   
   NEVER use raw useEffect for GSAP — always use useGSAP!
*/

import gsap from 'gsap';
/*
   gsap (GreenSock Animation Platform)
   
   The main animation library. Provides:
   - gsap.to() / gsap.from() — individual animations
   - gsap.timeline() — sequenced animations
*/

import { useStore } from '@/store/useStore';
/*
   useStore from our Zustand store
   
   Gives us access to global state:
   - isIntroComplete: Has the animation finished?
   - setIntroComplete: Function to mark it as finished
   
   The '@/' is a path alias for 'src/' (configured in tsconfig.json)
*/

// === COMPONENT ===

export default function IntroAnimation() {
  /*
     COMPONENT FUNCTION
     
     In React, a component is just a function that returns JSX.
     'export default' means this is the main export of the file.
  */
  
  // === REFS ===
  
  const containerRef = useRef<HTMLDivElement>(null);
  /*
     CONTAINER REF
     
     useRef<HTMLDivElement>(null) creates a ref that will point to a <div>.
     
     TypeScript types:
     - HTMLDivElement: The type of element it will reference
     - null: Initial value (becomes the actual element after render)
     
     We'll attach this to our outermost div with: ref={containerRef}
  */
  
  // === GLOBAL STATE ===
  
  const setIntroComplete = useStore((state) => state.setIntroComplete);
  /*
     GET THE ACTION FUNCTION
     
     useStore((state) => state.setIntroComplete) extracts just the
     setIntroComplete function from our store.
     
     Using a selector like this (instead of useStore().setIntroComplete)
     prevents unnecessary re-renders.
  */
  
  const isComplete = useStore((state) => state.isIntroComplete);
  /*
     GET THE STATE VALUE
     
     This tells us if the intro has already played.
     - false: Show and play the animation
     - true: Don't render anything (user already saw it)
  */
  
  // === ANIMATION ===
  
  useGSAP(() => {
    /*
       useGSAP HOOK
       
       This function runs ONCE after the component mounts.
       It's similar to useEffect(() => {}, []) but optimized for GSAP.
       
       Everything inside here is our animation logic.
    */
    
    // Skip if animation already played
    if (isComplete) return;
    /*
       EARLY RETURN
       
       If isComplete is true, exit immediately.
       This prevents the animation from replaying if the user
       navigates away and comes back.
    */
    
    // Create a timeline for sequenced animations
    const tl = gsap.timeline({
      onComplete: () => setIntroComplete(true)
      /*
         TIMELINE OPTIONS
         
         onComplete: A callback function that runs when the
         ENTIRE timeline finishes (after all animations).
         
         We use this to update global state, telling the rest
         of the app that the intro is done.
      */
    });
    
    /*
       ANIMATION SEQUENCE
       
       We chain animations using the timeline.
       Each .to() or .from() adds an animation to the sequence.
    */
    
    // ANIMATION 1: Fade in "Hello"
    tl.from('.intro-hello', {
      opacity: 0,        // Start invisible
      y: 40,             // Start 40px below final position
      duration: 0.8,     // Animate over 0.8 seconds
      ease: 'power3.out' // Fast start, smooth end
    })
    /*
       .from() ANIMATION
       
       The element STARTS at opacity:0, y:40 and animates
       TO its natural CSS state (opacity:1, y:0).
       
       '.intro-hello' is a CSS selector — GSAP finds elements
       with class="intro-hello" inside our scoped container.
    */
    
    // ANIMATION 2: Fade in "Universe" (overlaps with previous)
    .from('.intro-universe', {
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.4')
    /*
       POSITION PARAMETER: '-=0.4'
       
       This animation starts 0.4 seconds BEFORE the previous
       animation ends. This creates an overlap — "Universe"
       starts fading in while "Hello" is still animating.
       
       Without this, "Universe" would wait for "Hello" to
       completely finish, which would feel slow and disconnected.
       
       Timeline visualization:
       Time:    0    0.4    0.8    1.2
                |-----|------|------|
       Hello:   [==========]
       Universe:      [==========]
                      ^ starts at 0.4s (0.8 - 0.4)
    */
    
    // ANIMATION 3: Pause for reading
    .to({}, { duration: 1 })
    /*
       EMPTY TWEEN (PAUSE)
       
       .to({}, {...}) animates nothing — it's just a delay.
       This gives users 1 second to read "Hello, Universe"
       before we animate it away.
       
       Alternative: .add(() => {}, '+=1') or .delay(1) on next tween
    */
    
    // ANIMATION 4: Pendulum swing away
    .to('.intro-text', {
      x: '-100vw',       // Move 100% of viewport width to the left
      rotation: -15,     // Rotate 15 degrees counter-clockwise
      opacity: 0,        // Fade out
      duration: 1.2,     // Over 1.2 seconds
      ease: 'power2.inOut'  // Slow start, fast middle, slow end
    })
    /*
       PENDULUM SWING ANIMATION
       
       '.intro-text' is the container holding both "Hello" and "Universe".
       We animate the container, so both texts move together.
       
       x: '-100vw'
       - vw = viewport width units (1vw = 1% of screen width)
       - '-100vw' = move left by the full screen width
       - The text exits completely off-screen
       
       rotation: -15
       - Rotates -15 degrees (counter-clockwise)
       - Combined with the transform-origin (top-right), this
         creates a pendulum swinging effect
       
       ease: 'power2.inOut'
       - Starts slow, speeds up, then slows down
       - Mimics a pendulum's natural movement
       
       The pendulum effect works because we set:
       style={{ transformOrigin: 'top right' }}
       on the .intro-text element. This makes it rotate
       around its top-right corner instead of center.
    */
    
    // ANIMATION 5: Fade out background container
    .to(containerRef.current, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        // After fading out, remove from layout entirely
        if (containerRef.current) {
          containerRef.current.style.display = 'none';
        }
      }
    }, '-=0.3')
    /*
       BACKGROUND FADE OUT
       
       containerRef.current is the actual DOM element (not a selector).
       We can pass DOM elements directly to GSAP.
       
       '-=0.3' makes this start 0.3s before the swing completes,
       so the fade overlaps with the end of the swing.
       
       onComplete callback:
       After opacity reaches 0, we set display: 'none' to remove
       the element from the layout. This ensures it doesn't
       block clicks on the content behind it.
       
       Why not just return null?
       React will re-render and remove it when isComplete becomes true,
       but this provides an immediate removal right after the animation.
    */
    
  }, { scope: containerRef });
  /*
     useGSAP OPTIONS
     
     { scope: containerRef }
     
     This limits GSAP's selector search to INSIDE containerRef.
     When we use '.intro-hello', GSAP only looks for elements
     with that class inside our container div.
     
     Without scope, GSAP searches the ENTIRE document, which
     could accidentally animate elements in other components.
  */
  
  // === CONDITIONAL RENDERING ===
  
  if (isComplete) return null;
  /*
     EARLY RETURN (NO RENDER)
     
     If isIntroComplete is true, return null instead of JSX.
     This removes the component from the DOM entirely.
     
     This handles cases like:
     - User saw the intro, navigated to /about, then back to /
     - We don't want to show the intro again
  */
  
  // === JSX (WHAT GETS RENDERED) ===
  
  return (
    <div 
      ref={containerRef}
      /*
         ref={containerRef}
         
         This connects our useRef to this actual DOM element.
         After render, containerRef.current === this <div>
      */
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-[var(--void-black)]
      "
      /*
         TAILWIND CLASSES EXPLAINED:
         
         fixed      → position: fixed (doesn't scroll with page)
         inset-0    → top: 0; right: 0; bottom: 0; left: 0;
                      (covers entire viewport)
         z-50       → z-index: 50 (appears above everything else)
         flex       → display: flex
         items-center    → align-items: center (vertical center)
         justify-center  → justify-content: center (horizontal center)
         bg-[var(--void-black)] → background: var(--void-black)
                                  (our custom CSS variable)
         
         Result: A full-screen black overlay with centered content
      */
    >
      {/* Text container with transform origin for pendulum effect */}
      <div 
        className="intro-text"
        style={{ transformOrigin: 'top right' }}
        /*
           TRANSFORM ORIGIN
           
           This is CRUCIAL for the pendulum effect.
           
           By default, rotations happen around the CENTER of an element.
           transform-origin changes the pivot point.
           
           'top right' means: rotate around the top-right corner
           
           When we apply rotation: -15, instead of spinning in place,
           the text swings like a door hinged at the top-right.
           
           Visual:
           
           Default (center):        Top-right origin:
                 ↻                        •←pivot
              [TEXT]                   [TEXT]
                                          ↘ swings down-left
        */
      >
        {/* "Hello" text */}
        <h1 
          className="
            intro-hello
            font-heading text-[12vw] leading-none
            text-[var(--photon-white)]
          "
          /*
             intro-hello    → Class name that GSAP uses as selector
             font-heading   → Uses our heading font (Space Grotesk)
             text-[12vw]    → font-size: 12vw (12% of viewport width)
                              Responsive! Gets bigger on larger screens
             leading-none   → line-height: 1 (no extra space between lines)
             text-[var(--photon-white)] → color: var(--photon-white)
          */
        >
          Hello
        </h1>
        
        {/* "Universe" text */}
        <h1 
          className="
            intro-universe
            font-heading text-[12vw] leading-none
            text-[var(--photon-white)]
          "
        >
          Universe
        </h1>
      </div>
    </div>
  );
}
```

---

## File 2: Update Home Page to Include Intro

Now we need to add the `IntroAnimation` component to our home page.

**File:** `src/app/page.tsx`

```tsx
/* ============================================================
   HOME PAGE - src/app/page.tsx
   
   This is the main landing page ("/").
   We add IntroAnimation here so it plays when users first visit.
   ============================================================ */

// Import the intro animation component
import IntroAnimation from '@/components/dom/IntroAnimation';

// Import the 3D scene wrapper (already exists from scaffolding)
import SceneWrapper from '@/components/canvas/SceneWrapper';

export default function Home() {
  return (
    <main className="relative w-full min-h-screen">
      {/*
         INTRO ANIMATION
         
         This renders as a fixed overlay covering the whole screen.
         It plays once, then hides itself.
         
         On subsequent visits (or navigation back), it checks
         isIntroComplete in the store and doesn't render.
      */}
      <IntroAnimation />
      
      {/*
         3D BACKGROUND SCENE
         
         SceneWrapper loads the Three.js canvas.
         It's positioned behind the content with z-index.
         
         The intro animation covers this initially.
         After the intro completes, this becomes visible.
      */}
      <SceneWrapper />
      
      {/*
         MAIN CONTENT LAYER
         
         This div contains all the page content.
         z-10 puts it above the 3D background.
         
         For now it's placeholder — we'll add sections in later phases.
      */}
      <div className="relative z-10">
        <section className="h-screen flex items-center justify-center">
          <h1 className="text-6xl font-heading">Welcome</h1>
        </section>
      </div>
    </main>
  );
}
```

---

## How the Animation Flow Works

Here's the complete flow when a user visits your site:

```
USER VISITS SITE
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│  1. React renders page.tsx                                   │
│     - IntroAnimation renders (isIntroComplete = false)       │
│     - SceneWrapper renders (3D scene starts loading)         │
│     - Main content renders (hidden behind intro)             │
└─────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│  2. useGSAP runs in IntroAnimation                           │
│     - Creates timeline                                       │
│     - Plays animation sequence                               │
└─────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│  3. Animation plays (about 4 seconds total)                  │
│     - 0.0s: "Hello" fades in                                 │
│     - 0.4s: "Universe" fades in                              │
│     - 1.2s: Both fully visible, hold                         │
│     - 2.2s: Pendulum swing starts                            │
│     - 3.4s: Text off-screen, background fading               │
│     - 3.7s: Animation complete                               │
└─────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│  4. onComplete callback fires                                │
│     - Calls setIntroComplete(true)                           │
│     - Zustand updates isIntroComplete to true                │
└─────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│  5. React re-renders IntroAnimation                          │
│     - isComplete is now true                                 │
│     - Component returns null (removes from DOM)              │
│     - 3D scene and main content are now visible!             │
└─────────────────────────────────────────────────────────────┘
```

---

## Understanding CSS Units Used

| Unit | Meaning | Example |
|------|---------|---------|
| `px` | Pixels (fixed size) | `font-size: 16px` |
| `%` | Percentage of parent | `width: 50%` |
| `vw` | Viewport width (1vw = 1% of screen width) | `font-size: 12vw` |
| `vh` | Viewport height (1vh = 1% of screen height) | `height: 100vh` |
| `rem` | Relative to root font size (usually 16px) | `padding: 2rem` = 32px |

**Why use `vw` for font size?**
- Text automatically scales with screen size
- `12vw` on a 1920px screen = 230px font
- `12vw` on a 375px phone = 45px font
- No media queries needed!

---

## Phase 2 Checklist

After completing this phase, you should have:

- [x] `src/components/dom/IntroAnimation.tsx` — The animation component
- [x] `src/app/page.tsx` — Updated to include IntroAnimation
- [x] Animation plays on first visit to homepage
- [x] Animation doesn't replay when navigating back

## Testing Phase 2

```bash
npm run dev
```

1. **Open http://localhost:3000**
2. **Watch the animation play** — "Hello" then "Universe" should appear
3. **Wait for swing** — Text should swing away after ~2 seconds
4. **Verify completion** — Main content should be visible
5. **Refresh page** — Animation should play again (state resets on full refresh)
6. **Test navigation** — If you had other pages, navigating back shouldn't replay

### Debugging Common Issues

| Issue | Likely Cause | Solution |
|-------|--------------|----------|
| Animation doesn't play | Missing `'use client'` directive | Add `'use client'` as first line |
| Text doesn't appear | Wrong CSS selector | Check class names match exactly |
| Pendulum doesn't swing right | Missing `transformOrigin` | Add `style={{ transformOrigin: 'top right' }}` |
| Animation replays on navigation | Store not persisting | Check Zustand setup, use selector hooks |
| GSAP errors in console | Using useEffect instead of useGSAP | Replace with `useGSAP` hook |

---

## Resources for Phase 2

| Topic | Resource |
|-------|----------|
| GSAP Basics | [GSAP Getting Started](https://gsap.com/docs/v3/GSAP/) |
| GSAP Timelines | [Timeline Documentation](https://gsap.com/docs/v3/GSAP/Timeline/) |
| GSAP + React | [Official React Guide](https://gsap.com/resources/React/) |
| useGSAP Hook | [@gsap/react Documentation](https://gsap.com/docs/v3/GSAP/gsap.registerPlugin()/#gsapreact) |
| Easing Functions | [GSAP Ease Visualizer](https://gsap.com/docs/v3/Eases/) |
| CSS Transform Origin | [MDN transform-origin](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-origin) |
| Viewport Units | [MDN Viewport Units](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units#lengths) |
| Zustand Usage | [Zustand GitHub](https://github.com/pmndrs/zustand) |

---

## Customization Ideas

Once you understand the code, try these modifications:

1. **Change the text**: Replace "Hello, Universe" with your own greeting
2. **Adjust timing**: Make animations faster/slower by changing `duration`
3. **Different easing**: Try `"elastic.out"` for a bouncy effect
4. **Different exit**: Instead of pendulum, try:
   - `scale: 0` — Shrink to nothing
   - `y: '-100vh'` — Fly up off screen
   - `rotationY: 90` — Flip away (3D effect)
5. **Add more text**: Add a third line with another `.from()` in the timeline
6. **Add sound**: Play an audio file when animation completes

---

# Phase 3: Landing Page (3D Particles)

## What This Phase Accomplishes

This phase creates an **interactive 3D particle system** that serves as the background for your landing page. After the intro animation completes, users see:

- 800+ particles floating in space with random "Brownian motion"
- Particles gently attracted to the mouse cursor
- Click anywhere to create a "shockwave" that pushes particles away
- Particles stay within bounds and don't fly off screen

**Why This Matters:**
- Creates a "living" background that responds to user interaction
- Reinforces the quantum/physics theme (particles in superposition)
- Demonstrates technical skill while remaining performant

---

## Prerequisites for This Phase

### Understanding 3D Coordinate Systems

In 3D graphics, every point in space has three coordinates:

```
        Y (up)
        │
        │
        │
        └──────── X (right)
       /
      /
     Z (toward you)
```

- **X-axis**: Left (-) to Right (+)
- **Y-axis**: Down (-) to Up (+)
- **Z-axis**: Into screen (-) to Toward you (+)

A position like `(3, 2, -5)` means:
- 3 units to the right
- 2 units up
- 5 units into the screen

---

### Understanding Three.js Basics

Three.js is the JavaScript library for 3D graphics. Here's the mental model:

```
SCENE (the 3D world)
│
├── CAMERA (your eye/viewpoint)
│   └── Position: Where you're standing
│   └── LookAt: What you're looking at
│   └── FOV: How wide your vision is
│
├── LIGHTS (illuminate objects)
│   ├── AmbientLight: Uniform light everywhere
│   ├── DirectionalLight: Parallel rays (like sun)
│   └── PointLight: Radiates from a point (like bulb)
│
└── MESHES (3D objects)
    ├── Geometry: The SHAPE (cube, sphere, plane)
    └── Material: The APPEARANCE (color, texture, shininess)
```

**Creating a basic mesh in Three.js:**
```javascript
// Traditional Three.js (imperative)
const geometry = new THREE.SphereGeometry(1, 32, 32);  // Shape
const material = new THREE.MeshBasicMaterial({ color: 'red' });  // Appearance
const mesh = new THREE.Mesh(geometry, material);  // Combine them
scene.add(mesh);  // Add to world
```

---

### Understanding React Three Fiber (R3F)

React Three Fiber lets you write Three.js as React components:

```tsx
// Same sphere, but as React components
<mesh>
  <sphereGeometry args={[1, 32, 32]} />
  <meshBasicMaterial color="red" />
</mesh>
```

**Key R3F Concepts:**

| Concept | Explanation |
|---------|-------------|
| `<Canvas>` | The container that sets up scene, camera, renderer |
| `<mesh>` | A 3D object (lowercase = Three.js object) |
| `args={[]}` | Constructor arguments passed to Three.js class |
| `useFrame()` | Hook that runs every frame (~60 fps) |
| `useThree()` | Hook to access camera, scene, viewport, etc. |

---

### Understanding Vectors

A **Vector3** is a 3D point or direction with x, y, z components:

```javascript
import * as THREE from 'three';

// Create a vector
const position = new THREE.Vector3(1, 2, 3);  // x=1, y=2, z=3

// Access components
position.x  // 1
position.y  // 2
position.z  // 3

// Common operations
position.add(otherVector)       // Add vectors
position.sub(otherVector)       // Subtract vectors
position.multiplyScalar(2)      // Multiply all components by 2
position.normalize()            // Make length = 1 (keep direction)
position.length()               // Get distance from origin
position.clone()                // Create a copy
position.set(4, 5, 6)           // Set new values
position.copy(otherVector)      // Copy from another vector
```

**Vector Math Visualization:**
```
Vector A = (3, 2)          Vector B = (1, 3)

    ↑                           ↑
  2 │  →A                     3 │    ↗B
    │ ↗                         │  ↗
  ──┼───→                     ──┼─→──
    │   3                       │ 1

A + B = (3+1, 2+3) = (4, 5)    // Add components
A - B = (3-1, 2-3) = (2, -1)   // Subtract components
```

---

### Understanding InstancedMesh (Performance)

**The Problem:**
If you want 1000 particles, creating 1000 separate meshes is SLOW:
```tsx
// BAD: 1000 draw calls, very slow!
{Array.from({ length: 1000 }).map((_, i) => (
  <mesh key={i} position={positions[i]}>
    <sphereGeometry args={[0.1]} />
    <meshBasicMaterial />
  </mesh>
))}
```

**The Solution: InstancedMesh**
One mesh that renders multiple times with different positions:
```tsx
// GOOD: 1 draw call, very fast!
<instancedMesh args={[geometry, material, 1000]}>
  {/* All 1000 instances share the same geometry and material */}
</instancedMesh>
```

**How it works:**
- Each instance has a **transformation matrix** (4x4 numbers)
- The matrix encodes position, rotation, and scale
- We update these matrices every frame to move particles

---

### Understanding the Animation Loop

**Frame Rate:**
- Screens typically refresh 60 times per second (60 fps)
- Each refresh is a "frame"
- `useFrame()` runs your code every frame

**Delta Time:**
```javascript
useFrame((state, delta) => {
  // state.clock.elapsedTime = total seconds since start
  // delta = seconds since last frame (~0.016 at 60fps)
  
  // Move at constant speed regardless of frame rate:
  object.position.x += speed * delta;
});
```

---

### Physics Concepts Used

#### 1. Brownian Motion
Random small movements that make particles feel "alive":
```javascript
// Add tiny random velocity each frame
velocity.x += (Math.random() - 0.5) * 0.002;
velocity.y += (Math.random() - 0.5) * 0.002;
```

`Math.random() - 0.5` gives a value from -0.5 to +0.5 (can go either direction).

#### 2. Inverse Square Law
Force decreases with distance squared (like gravity):
```javascript
// force = constant / distance²
const force = 0.001 / (distance * distance);
```

At distance 1: force = 0.001
At distance 2: force = 0.00025 (4x weaker)
At distance 10: force = 0.00001 (100x weaker)

#### 3. Damping (Friction)
Gradually slow down to prevent infinite acceleration:
```javascript
// Reduce velocity by 2% each frame
velocity.multiplyScalar(0.98);
```

Without damping, particles would accelerate forever.

---

## File Structure for Phase 3

```
src/
├── components/
│   └── canvas/
│       ├── Scene.tsx         # Canvas wrapper (UPDATE)
│       ├── SceneWrapper.tsx  # SSR-safe import (exists)
│       └── Hero.tsx          # Particle system (NEW)
└── app/
    └── page.tsx              # Home page (already has SceneWrapper)
```

---

## File 1: Hero Particles Component

### What This Component Does

1. Creates 800 particles with random starting positions
2. Each frame, applies physics simulation:
   - Brownian motion (random wandering)
   - Mouse attraction (inverse square law)
   - Damping (friction to slow down)
   - Boundary constraints (keep on screen)
3. Updates the visual positions of all particles
4. Renders efficiently using InstancedMesh

### The Complete Code with Line-by-Line Explanations

**File:** `src/components/canvas/Hero.tsx`

```tsx
/* ============================================================
   HERO PARTICLES COMPONENT
   
   Creates an interactive particle cloud for the landing page.
   Particles float with Brownian motion and are attracted to
   the mouse cursor.
   
   DEPENDENCIES:
   - Three.js: 3D graphics library
   - @react-three/fiber: React renderer for Three.js
   ============================================================ */

'use client'
/*
   'use client' DIRECTIVE
   
   Required because this component uses:
   - useRef, useMemo (React hooks)
   - useFrame, useThree (R3F hooks)
   
   All Three.js/R3F components must be client components.
*/

// === IMPORTS ===

import { useRef, useMemo } from 'react';
/*
   React Hooks:
   
   useRef: Create references that persist across renders
   - For the mesh reference (to update instance matrices)
   - For storing values without causing re-renders (mouse position)
   
   useMemo: Cache expensive calculations
   - Creating 800 particle objects is expensive
   - useMemo ensures we only do it once
*/

import { useFrame, useThree } from '@react-three/fiber';
/*
   React Three Fiber Hooks:
   
   useFrame: Runs a function every frame (60fps)
   - This is where we update particle positions
   - Similar to requestAnimationFrame but integrated with R3F
   
   useThree: Access Three.js internals
   - camera, scene, gl (renderer)
   - viewport (visible area dimensions)
   - mouse (normalized mouse coordinates)
*/

import * as THREE from 'three';
/*
   Three.js Library
   
   We import everything as 'THREE' namespace.
   This gives us access to:
   - THREE.Vector3 (3D points/directions)
   - THREE.Object3D (base class for 3D objects)
   - THREE.InstancedMesh (efficient instancing)
   - THREE.Matrix4 (transformation matrices)
*/

// === CONFIGURATION CONSTANTS ===

const CONFIG = {
  PARTICLE_COUNT: 800,
  /*
     Number of particles to render.
     - More = denser cloud, but more CPU work
     - 800 is a good balance for most devices
     - Reduce to 400-500 if targeting mobile
  */
  
  BOUNDS: 8,
  /*
     How far particles can spread from center.
     - Particles stay within -8 to +8 on X and Y
     - Z bounds are halved (closer to camera plane)
     - Adjust based on your camera position/FOV
  */
  
  BROWNIAN_STRENGTH: 0.002,
  /*
     How much random motion to add each frame.
     - Higher = more chaotic movement
     - Lower = calmer, slower drift
     - 0.002 gives subtle, organic motion
  */
  
  ATTRACTION_STRENGTH: 0.00003,
  /*
     How strongly particles are attracted to mouse.
     - This is divided by distance², so it's weak at distance
     - Higher = more responsive to mouse
     - Too high = particles clump on cursor
  */
  
  DAMPING: 0.98,
  /*
     Velocity multiplier each frame (friction).
     - 0.98 means particles lose 2% speed per frame
     - 1.0 = no friction (particles accelerate forever)
     - 0.9 = heavy friction (particles stop quickly)
  */
  
  PARTICLE_SIZE: 0.03,
  /*
     Radius of each particle sphere.
     - In Three.js units (not pixels)
     - 0.03 is small dots at typical camera distance
  */
};

// === TYPE DEFINITIONS ===

interface Particle {
  position: THREE.Vector3;  // Current location in 3D space
  velocity: THREE.Vector3;  // Current movement direction/speed
}
/*
   Particle Interface
   
   Each particle tracks:
   - position: Where it is right now
   - velocity: How it's moving (direction + speed)
   
   Every frame, we:
   1. Modify velocity (add forces)
   2. Add velocity to position (move the particle)
*/

// === COMPONENT ===

export default function Hero() {
  /*
     HERO COMPONENT
     
     This is a React component that renders inside a <Canvas>.
     It returns R3F elements (like <instancedMesh>), not HTML.
  */
  
  // === REFS ===
  
  const meshRef = useRef<THREE.InstancedMesh>(null);
  /*
     MESH REFERENCE
     
     useRef<THREE.InstancedMesh>(null) creates a ref for our instanced mesh.
     
     After the component renders, meshRef.current will be the actual
     Three.js InstancedMesh object. We need this to:
     - Update instance matrices each frame
     - Tell Three.js to re-render the instances
  */
  
  const mouse3D = useRef(new THREE.Vector3(0, 0, 0));
  /*
     MOUSE POSITION (3D)
     
     We store the mouse position as a Vector3.
     
     Using useRef instead of useState because:
     - We update this 60 times per second
     - useState would cause 60 re-renders per second (bad!)
     - useRef updates without re-rendering
     
     The Z coordinate is 0 (we only track X/Y on a plane).
  */
  
  // === THREE.JS INTERNALS ===
  
  const { viewport } = useThree();
  /*
     VIEWPORT INFORMATION
     
     useThree() gives us access to the Three.js context.
     
     viewport contains:
     - width: Visible width in Three.js units
     - height: Visible height in Three.js units
     - factor: Pixels per Three.js unit
     
     We need this to convert mouse coordinates to 3D space.
  */
  
  // === PARTICLE DATA ===
  
  const particles = useMemo<Particle[]>(() => {
    /*
       CREATE PARTICLES (runs once)
       
       useMemo caches this calculation.
       The empty dependency array [] means it only runs once,
       when the component first mounts.
       
       Creating 800 objects is expensive, so we do it once
       and reuse them.
    */
    
    const temp: Particle[] = [];
    
    for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
      /*
         RANDOM STARTING POSITION
         
         Math.random() returns 0 to 1
         Math.random() - 0.5 returns -0.5 to +0.5
         Multiply by BOUNDS * 2 to get -BOUNDS to +BOUNDS
         
         Example with BOUNDS = 8:
         (Math.random() - 0.5) * 16 = random from -8 to +8
      */
      const position = new THREE.Vector3(
        (Math.random() - 0.5) * CONFIG.BOUNDS * 2,  // X: -8 to +8
        (Math.random() - 0.5) * CONFIG.BOUNDS * 2,  // Y: -8 to +8
        (Math.random() - 0.5) * CONFIG.BOUNDS       // Z: -4 to +4 (shallower)
      );
      
      temp.push({
        position: position,
        velocity: new THREE.Vector3(0, 0, 0),  // Start stationary
      });
    }
    
    return temp;
  }, []);
  /*
     DEPENDENCY ARRAY: []
     
     Empty array means this only runs once.
     If we put [CONFIG.PARTICLE_COUNT], it would re-run
     whenever that value changes.
  */
  
  // === TEMPORARY OBJECT FOR MATRIX UPDATES ===
  
  const tempObject = useMemo(() => new THREE.Object3D(), []);
  /*
     TEMPORARY OBJECT3D
     
     To update an instance's position, we need to:
     1. Set a position on an Object3D
     2. Update its matrix
     3. Copy that matrix to the InstancedMesh
     
     We reuse ONE Object3D instead of creating new ones each frame.
     This is a common Three.js optimization pattern.
     
     Object3D is the base class for all 3D objects.
     It has position, rotation, scale, and a matrix.
  */
  
  // === ANIMATION LOOP ===
  
  useFrame((state) => {
    /*
       useFrame CALLBACK
       
       This function runs every frame (~60 times per second).
       
       Parameters:
       - state: Contains clock, camera, mouse, scene, etc.
       - delta: Seconds since last frame (not used here)
       
       state.mouse: { x: -1 to 1, y: -1 to 1 }
       Normalized mouse coordinates (-1 = left/bottom, +1 = right/top)
    */
    
    // Safety check: make sure mesh exists
    if (!meshRef.current) return;
    
    // === UPDATE MOUSE POSITION ===
    
    mouse3D.current.set(
      state.mouse.x * viewport.width / 2,
      state.mouse.y * viewport.height / 2,
      0
    );
    /*
       CONVERT MOUSE TO 3D COORDINATES
       
       state.mouse.x is -1 (left) to +1 (right)
       state.mouse.y is -1 (bottom) to +1 (top)
       
       viewport.width is the visible width in 3D units.
       
       Calculation:
       - mouse.x * viewport.width / 2 maps -1..+1 to -width/2..+width/2
       
       Example (viewport.width = 20):
       - mouse.x = -1 → -1 * 20 / 2 = -10 (left edge)
       - mouse.x = 0 → 0 * 20 / 2 = 0 (center)
       - mouse.x = 1 → 1 * 20 / 2 = 10 (right edge)
       
       Z is 0 because our particles are roughly in the Z=0 plane.
    */
    
    // === UPDATE EACH PARTICLE ===
    
    particles.forEach((particle, index) => {
      /*
         PARTICLE PHYSICS LOOP
         
         For each of the 800 particles, we:
         1. Add Brownian motion (random wandering)
         2. Add mouse attraction (pull toward cursor)
         3. Apply damping (friction)
         4. Update position
         5. Check boundaries
         6. Update the visual (matrix)
      */
      
      // === 1. BROWNIAN MOTION ===
      
      particle.velocity.x += (Math.random() - 0.5) * CONFIG.BROWNIAN_STRENGTH;
      particle.velocity.y += (Math.random() - 0.5) * CONFIG.BROWNIAN_STRENGTH;
      particle.velocity.z += (Math.random() - 0.5) * CONFIG.BROWNIAN_STRENGTH * 0.5;
      /*
         BROWNIAN MOTION
         
         Add small random velocity each frame.
         
         Math.random() - 0.5 gives -0.5 to +0.5
         Multiply by 0.002 gives -0.001 to +0.001
         
         This makes particles drift randomly, like dust in air.
         
         Z gets half the strength (0.5x) so particles don't
         drift toward/away from camera as much.
      */
      
      // === 2. MOUSE ATTRACTION ===
      
      const toMouse = mouse3D.current.clone().sub(particle.position);
      /*
         DIRECTION TO MOUSE
         
         Vector from particle to mouse:
         toMouse = mousePosition - particlePosition
         
         We use .clone() because .sub() modifies the vector in place.
         Without clone, we'd modify mouse3D itself!
         
         Result: A vector pointing FROM particle TO mouse.
      */
      
      const distance = toMouse.length();
      /*
         DISTANCE TO MOUSE
         
         .length() returns the magnitude (length) of the vector.
         This is the straight-line distance from particle to mouse.
         
         Math: sqrt(x² + y² + z²)
      */
      
      if (distance > 0.1) {
        /*
           AVOID DIVISION BY ZERO
           
           If particle is very close to mouse (distance < 0.1),
           skip the attraction. Otherwise:
           - distance² would be tiny
           - force would be huge
           - particle would shoot off
        */
        
        const force = Math.min(
          CONFIG.ATTRACTION_STRENGTH / (distance * distance),
          0.01
        );
        /*
           INVERSE SQUARE LAW
           
           force = constant / distance²
           
           This mimics real physics (gravity, electromagnetism).
           Closer = much stronger force.
           
           Math.min(..., 0.01) caps the maximum force to prevent
           extreme acceleration when very close.
        */
        
        toMouse.normalize().multiplyScalar(force);
        /*
           CALCULATE FORCE VECTOR
           
           1. normalize(): Make length = 1 (keep only direction)
           2. multiplyScalar(force): Scale to the calculated force
           
           Result: A small vector pointing toward mouse,
           with magnitude = our calculated force.
        */
        
        particle.velocity.add(toMouse);
        /*
           APPLY FORCE TO VELOCITY
           
           Add the force vector to particle's velocity.
           This accelerates the particle toward the mouse.
        */
      }
      
      // === 3. DAMPING (FRICTION) ===
      
      particle.velocity.multiplyScalar(CONFIG.DAMPING);
      /*
         APPLY DAMPING
         
         Multiply velocity by 0.98 (reduce by 2%).
         
         This prevents particles from accelerating forever.
         Without damping:
         - Mouse attraction keeps adding velocity
         - Particles would move faster and faster
         - Eventually they'd be uncontrollable
         
         With damping:
         - Velocity naturally decays toward zero
         - Particles reach a "terminal velocity"
      */
      
      // === 4. UPDATE POSITION ===
      
      particle.position.add(particle.velocity);
      /*
         MOVE THE PARTICLE
         
         position = position + velocity
         
         This is basic physics:
         Velocity is "how much to move per frame"
         Adding it to position moves the particle.
      */
      
      // === 5. BOUNDARY CONSTRAINTS ===
      
      // Check X boundary
      if (Math.abs(particle.position.x) > CONFIG.BOUNDS) {
        particle.velocity.x *= -0.5;  // Bounce back (reverse + slow)
        particle.position.x *= 0.99;  // Push slightly toward center
      }
      
      // Check Y boundary
      if (Math.abs(particle.position.y) > CONFIG.BOUNDS) {
        particle.velocity.y *= -0.5;
        particle.position.y *= 0.99;
      }
      
      // Check Z boundary (half bounds)
      if (Math.abs(particle.position.z) > CONFIG.BOUNDS / 2) {
        particle.velocity.z *= -0.5;
        particle.position.z *= 0.99;
      }
      /*
         SOFT BOUNDARIES
         
         Math.abs() returns absolute value (ignores sign).
         So this checks if particle is beyond ±BOUNDS.
         
         When a particle goes out of bounds:
         1. Reverse and halve that velocity component
            - *= -0.5 means reverse direction and lose energy
         2. Push position back toward center
            - *= 0.99 slowly moves it back inward
         
         This creates a "soft wall" effect instead of hard bouncing.
         Particles slow down and drift back instead of bouncing sharply.
      */
      
      // === 6. UPDATE VISUAL (MATRIX) ===
      
      tempObject.position.copy(particle.position);
      /*
         SET TEMP OBJECT POSITION
         
         Copy our particle's position to the temporary Object3D.
         .copy() sets tempObject.position to match particle.position.
      */
      
      tempObject.updateMatrix();
      /*
         UPDATE TRANSFORMATION MATRIX
         
         Object3D stores position, rotation, scale as separate properties.
         updateMatrix() combines them into a single 4x4 matrix.
         
         The matrix is what's actually used for rendering.
      */
      
      meshRef.current!.setMatrixAt(index, tempObject.matrix);
      /*
         COPY MATRIX TO INSTANCE
         
         setMatrixAt(index, matrix) sets the transformation
         for instance #index to the given matrix.
         
         meshRef.current! uses ! to tell TypeScript
         "I know this isn't null" (we checked earlier).
         
         After this, instance #index will render at the
         position we calculated.
      */
    });
    
    // === TELL THREE.JS TO UPDATE ===
    
    meshRef.current.instanceMatrix.needsUpdate = true;
    /*
       FLAG MATRICES AS CHANGED
       
       Three.js doesn't automatically re-upload matrices to the GPU.
       Setting needsUpdate = true tells it:
       "Hey, I changed the matrices, please re-render!"
       
       Without this line, particles wouldn't move visually.
    */
  });
  
  // === RENDER ===
  
  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, CONFIG.PARTICLE_COUNT]}
      /*
         INSTANCED MESH
         
         <instancedMesh> is the R3F version of THREE.InstancedMesh.
         
         args={[geometry, material, count]}
         - geometry: undefined (we define it as a child)
         - material: undefined (we define it as a child)
         - count: Number of instances (800)
         
         This creates ONE mesh that renders 800 times,
         each with a different transformation matrix.
         
         ref={meshRef} connects our useRef so we can
         update it in useFrame.
      */
    >
      <sphereGeometry args={[CONFIG.PARTICLE_SIZE, 8, 8]} />
      /*
         SPHERE GEOMETRY
         
         args={[radius, widthSegments, heightSegments]}
         
         - radius: 0.03 (small spheres)
         - widthSegments: 8 (horizontal divisions)
         - heightSegments: 8 (vertical divisions)
         
         More segments = smoother sphere but more vertices.
         8x8 is low-poly but fast. At this size, you can't
         tell the difference from a high-poly sphere.
      */
      
      <meshBasicMaterial
        color="#F0F0F0"
        transparent
        opacity={0.8}
      />
      /*
         BASIC MATERIAL
         
         meshBasicMaterial is the simplest material:
         - Doesn't respond to lights
         - Just shows a flat color
         - Very fast to render
         
         Properties:
         - color: Off-white (#F0F0F0)
         - transparent: Enable alpha/opacity
         - opacity: 0.8 (slightly see-through)
         
         We use Basic instead of Standard because:
         - Particles are tiny, lighting doesn't matter
         - 800 instances × lighting calculations = slow
         - Basic is much faster
      */
    </instancedMesh>
  );
}
```

---

## File 2: Update Scene Component

We need to add the Hero component to our Scene.

**File:** `src/components/canvas/Scene.tsx`

```tsx
/* ============================================================
   3D SCENE COMPONENT
   
   This component sets up the Three.js scene with camera,
   lights, and 3D content.
   ============================================================ */

'use client'

import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import Hero from './Hero';

interface SceneProps {
  children?: React.ReactNode;
}

export default function Scene({ children }: SceneProps) {
  return (
    <div className="fixed inset-0 -z-10">
      {/*
         CONTAINER DIV
         
         fixed inset-0: Cover entire viewport, stay in place
         -z-10: Behind all other content (negative z-index)
      */}
      
      <Canvas
        camera={{
          position: [0, 0, 10],  // Camera 10 units back
          fov: 50,               // 50° field of view
          near: 0.1,             // Don't render closer than 0.1
          far: 100,              // Don't render farther than 100
        }}
        dpr={[1, 2]}  // Pixel ratio: 1x to 2x (for retina)
      >
        {/*
           CANVAS
           
           This creates the WebGL context and Three.js scene.
           Everything inside is 3D content, not HTML.
           
           camera: Default camera settings
           dpr: Device pixel ratio range (auto-adjusts for performance)
        */}
        
        {/* Ambient light for basic visibility */}
        <ambientLight intensity={0.5} />
        
        {/* Hero particle system */}
        <Hero />
        
        {/* Any additional children */}
        {children}
        
        {/* Preload all assets */}
        <Preload all />
      </Canvas>
    </div>
  );
}
```

---

## How the Particle System Works

### Visual Flow Diagram

```
EVERY FRAME (60fps):
       │
       ▼
┌──────────────────────────────────┐
│  1. Get mouse position            │
│     Convert from -1..+1 to 3D    │
└──────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│  2. For each particle:            │
│                                   │
│  ┌─────────────────────────────┐ │
│  │ Add random velocity          │ │
│  │ (Brownian motion)            │ │
│  └─────────────────────────────┘ │
│              │                    │
│              ▼                    │
│  ┌─────────────────────────────┐ │
│  │ Calculate direction to mouse │ │
│  │ Apply inverse-square force   │ │
│  │ (Mouse attraction)           │ │
│  └─────────────────────────────┘ │
│              │                    │
│              ▼                    │
│  ┌─────────────────────────────┐ │
│  │ Multiply velocity by 0.98    │ │
│  │ (Damping/friction)           │ │
│  └─────────────────────────────┘ │
│              │                    │
│              ▼                    │
│  ┌─────────────────────────────┐ │
│  │ Add velocity to position     │ │
│  │ (Move the particle)          │ │
│  └─────────────────────────────┘ │
│              │                    │
│              ▼                    │
│  ┌─────────────────────────────┐ │
│  │ Check boundaries             │ │
│  │ Bounce if out of bounds      │ │
│  └─────────────────────────────┘ │
│              │                    │
│              ▼                    │
│  ┌─────────────────────────────┐ │
│  │ Update instance matrix       │ │
│  │ (Update visual position)     │ │
│  └─────────────────────────────┘ │
└──────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│  3. Flag matrices as updated      │
│     Three.js re-renders           │
└──────────────────────────────────┘
```

---

## Optional: Adding Click Shockwave

To add an explosion effect when clicking, modify the Hero component:

```tsx
// Add to Hero component:

const isClicked = useRef(false);
const clickPos = useRef(new THREE.Vector3());

// In useFrame, after mouse attraction:
if (isClicked.current) {
  const fromClick = particle.position.clone().sub(clickPos.current);
  const clickDist = fromClick.length();
  
  if (clickDist > 0.1 && clickDist < 5) {
    // Push away from click point
    fromClick.normalize().multiplyScalar(0.3 / clickDist);
    particle.velocity.add(fromClick);
  }
}

// Add click handler to instancedMesh:
<instancedMesh
  ref={meshRef}
  args={[undefined, undefined, CONFIG.PARTICLE_COUNT]}
  onClick={(e) => {
    isClicked.current = true;
    clickPos.current.copy(e.point);
    setTimeout(() => { isClicked.current = false; }, 100);
  }}
>
```

---

## Phase 3 Checklist

After completing this phase, you should have:

- [x] `src/components/canvas/Hero.tsx` — Particle system component
- [x] `src/components/canvas/Scene.tsx` — Updated to include Hero
- [x] Particles visible on the landing page
- [x] Particles respond to mouse movement
- [x] Particles stay within bounds

## Testing Phase 3

```bash
npm run dev
```

1. **Open http://localhost:3000**
2. **Wait for intro** — Animation should play first
3. **See particles** — After intro, particles should be visible
4. **Move mouse** — Particles should gently drift toward cursor
5. **Check performance** — Should run at 60fps (check dev tools)

### Performance Tips

| Issue | Solution |
|-------|----------|
| Low FPS | Reduce PARTICLE_COUNT to 400-500 |
| Particles too small | Increase PARTICLE_SIZE |
| Movement too fast | Reduce BROWNIAN_STRENGTH |
| Mouse attraction too weak | Increase ATTRACTION_STRENGTH |
| Particles fly off screen | Reduce BOUNDS or increase damping |

---

## Resources for Phase 3

| Topic | Resource |
|-------|----------|
| Three.js Fundamentals | [Three.js Manual](https://threejs.org/manual/#en/fundamentals) |
| React Three Fiber | [R3F Documentation](https://docs.pmnd.rs/react-three-fiber) |
| InstancedMesh | [Three.js InstancedMesh](https://threejs.org/docs/#api/en/objects/InstancedMesh) |
| Vector3 | [Three.js Vector3](https://threejs.org/docs/#api/en/math/Vector3) |
| useFrame Hook | [R3F useFrame](https://docs.pmnd.rs/react-three-fiber/api/hooks#useframe) |
| useThree Hook | [R3F useThree](https://docs.pmnd.rs/react-three-fiber/api/hooks#usethree) |
| Particle Systems | [Three.js Journey Particles](https://threejs-journey.com/lessons/particles) |

---

## Next Steps

After Phase 3, you have:
- ✅ Foundation (colors, fonts, state)
- ✅ Intro animation
- ✅ Interactive 3D particle background

Phase 4-5 will add the actual content sections (WhoAmI, CV) that appear over this particle background.

---

# Phase 4-5: WhoAmI & CV Sections

## What This Phase Accomplishes

These phases create the **main content sections** of your landing page. After users see the particle animation, they scroll down to discover:

1. **WhoAmI Section** — Your biography and personal introduction
2. **CV Section** — Your skills, experience, and achievements

Both sections use **scroll-triggered animations** — content fades and slides into view as the user scrolls to it.

**Why Separate from 3D?**
- Content sections are regular HTML/CSS (not 3D)
- Easier to maintain text content
- Better accessibility and SEO
- Faster loading than rendering everything in WebGL

---

## Prerequisites for Phase 4-5

### Understanding GSAP ScrollTrigger

ScrollTrigger is a GSAP plugin that triggers animations based on scroll position.

#### Basic Concept

```javascript
gsap.to(".box", {
  x: 500,
  scrollTrigger: {
    trigger: ".box",  // Element to watch
    start: "top 80%", // When top of .box hits 80% down viewport
    end: "top 20%",   // When top of .box hits 20% down viewport
  }
});
```

#### Start and End Positions

The `start` and `end` values use two keywords:
- First word: Position on the **trigger element**
- Second word: Position on the **viewport**

```
"top 80%"
  │    │
  │    └── 80% down from top of viewport
  └─────── top of the trigger element

When these two positions align, the trigger fires.
```

**Visual Example:**
```
┌─────────────────────────────┐
│         VIEWPORT            │ ← 0% (top)
│                             │
│                             │
│                             │
│                             │
│                             │
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │ ← 80%
│                             │
│                             │
└─────────────────────────────┘ ← 100% (bottom)

When .box scrolls up and its TOP crosses the 80% line,
the animation triggers.
```

#### Common ScrollTrigger Patterns

```javascript
// 1. TRIGGER ONCE (default)
// Animation plays once when element enters viewport
scrollTrigger: {
  trigger: ".element",
  start: "top 80%",  // Trigger when top is 80% down viewport
}

// 2. SCRUB (link animation to scroll position)
// Animation progress matches scroll progress
scrollTrigger: {
  trigger: ".element",
  start: "top bottom",  // Start when top enters bottom of viewport
  end: "bottom top",    // End when bottom exits top of viewport
  scrub: true,          // Link to scroll
}

// 3. PIN (element stays fixed during scroll)
// Element freezes in place while animation plays
scrollTrigger: {
  trigger: ".element",
  start: "top top",
  end: "+=500",  // Pin for 500px of scrolling
  pin: true,
}

// 4. TOGGLE CLASS
// Add/remove class based on scroll
scrollTrigger: {
  trigger: ".element",
  start: "top 80%",
  toggleClass: "is-visible",
}
```

**Resource:** [GSAP ScrollTrigger Docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)

---

### Understanding gsap.utils.toArray()

This utility converts various inputs to a proper JavaScript array:

```javascript
// Select all elements with class "fade-up"
const elements = gsap.utils.toArray('.fade-up');

// Now you can loop through them
elements.forEach((el, index) => {
  gsap.from(el, {
    opacity: 0,
    y: 50,
    delay: index * 0.1,  // Stagger based on index
  });
});
```

**Why use this?**
- `document.querySelectorAll()` returns a NodeList, not an Array
- `gsap.utils.toArray()` always returns a real Array
- You can use `.forEach()`, `.map()`, etc.

---

### Understanding TypeScript Interfaces for Data

We'll use TypeScript interfaces to define the structure of our content:

```typescript
// Define what a skill looks like
interface Skill {
  name: string;
  level: number;     // 0-100
  category: 'development' | 'research' | 'tools';
}

// Define what an experience entry looks like
interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
  tags: string[];
}

// Use the types
const skills: Skill[] = [
  { name: 'TypeScript', level: 85, category: 'development' },
  { name: 'Python', level: 90, category: 'development' },
];
```

---

## File Structure for Phase 4-5

```
src/
├── components/
│   └── dom/
│       ├── WhoAmI.tsx          # Bio/introduction section (NEW)
│       ├── CV.tsx              # Skills and experience (NEW)
│       └── SectionWrapper.tsx  # Reusable scroll animation wrapper (NEW)
├── data/
│   └── content.ts              # All text content in one place (NEW)
└── app/
    └── page.tsx                # Add new sections here (UPDATE)
```

---

## File 1: Content Data File

### Why a Separate Data File?

Keeping content separate from components:
- Easier to update text without touching code
- Content can be moved to a CMS later
- Single source of truth for all text

**File:** `src/data/content.ts`

```typescript
/* ============================================================
   CONTENT DATA - src/data/content.ts
   
   All text content for the portfolio in one place.
   This makes it easy to update without digging through components.
   ============================================================ */

// === TYPE DEFINITIONS ===

export interface Skill {
  name: string;
  level: number;  // 0-100 (proficiency percentage)
  category: 'development' | 'research' | 'tools';
}
/*
   Skill Interface
   
   - name: The skill name (e.g., "TypeScript")
   - level: Proficiency from 0-100 (shown as progress bar)
   - category: Groups skills for filtering/display
*/

export interface Experience {
  id: string;           // Unique identifier
  title: string;        // Job title or role
  organization: string; // Company or institution
  period: string;       // Date range (e.g., "2022 - Present")
  location: string;     // City, Country
  description: string;  // What you did
  highlights: string[]; // Key achievements (bullet points)
  tags: string[];       // Technologies/skills used
  type: 'work' | 'education' | 'research';
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;  // Icon name (for Lucide icons)
}

// === PERSONAL INFO ===

export const personalInfo = {
  name: "Himanshu Sharma",
  tagline: "Physicist • Developer • Philosopher",
  email: "your.email@example.com",
  location: "Your City, Country",
  
  // Short bio for the WhoAmI section
  bio: `
    I'm a physicist turned developer with a passion for understanding 
    the fundamental nature of reality and building tools to explore it.
    
    My work spans quantum computing, machine learning, and web development.
    I believe in the power of interdisciplinary thinking — the best ideas 
    come from the intersections between fields.
    
    When I'm not coding or doing physics, you'll find me reading philosophy,
    playing chess, or contemplating the nature of consciousness.
  `,
  
  // Longer bio paragraphs (for expanded view)
  bioExtended: [
    `My journey began with a fascination for the quantum world — 
     the strange realm where particles can be in multiple states at once.`,
    `This led me to physics research, where I developed simulations 
     for quantum systems and explored the boundaries of computation.`,
    `Along the way, I discovered that software development is its own 
     form of creation — building abstract machines that solve real problems.`,
  ],
};

// === SKILLS ===

export const skills: Skill[] = [
  // Development
  { name: 'TypeScript', level: 85, category: 'development' },
  { name: 'Python', level: 90, category: 'development' },
  { name: 'React/Next.js', level: 80, category: 'development' },
  { name: 'Three.js/R3F', level: 70, category: 'development' },
  { name: 'Node.js', level: 75, category: 'development' },
  
  // Research
  { name: 'Quantum Computing', level: 80, category: 'research' },
  { name: 'Machine Learning', level: 75, category: 'research' },
  { name: 'Data Analysis', level: 85, category: 'research' },
  { name: 'Scientific Writing', level: 80, category: 'research' },
  
  // Tools
  { name: 'Git', level: 85, category: 'tools' },
  { name: 'Docker', level: 65, category: 'tools' },
  { name: 'Linux', level: 80, category: 'tools' },
  { name: 'LaTeX', level: 75, category: 'tools' },
];

// === EXPERIENCE ===

export const experiences: Experience[] = [
  {
    id: 'exp-1',
    title: 'Research Assistant',
    organization: 'University of XYZ',
    period: '2022 - Present',
    location: 'City, Country',
    description: 'Working on quantum computing algorithms and simulations.',
    highlights: [
      'Developed novel quantum algorithm with 30% efficiency improvement',
      'Published 3 papers in peer-reviewed journals',
      'Mentored 5 undergraduate students',
    ],
    tags: ['Quantum Computing', 'Python', 'Qiskit', 'Research'],
    type: 'research',
  },
  {
    id: 'exp-2',
    title: 'Full Stack Developer',
    organization: 'Tech Startup',
    period: '2021 - 2022',
    location: 'Remote',
    description: 'Built web applications for data visualization.',
    highlights: [
      'Led development of real-time dashboard serving 10k users',
      'Reduced load time by 60% through optimization',
      'Implemented CI/CD pipeline from scratch',
    ],
    tags: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
    type: 'work',
  },
  {
    id: 'exp-3',
    title: 'BSc Physics',
    organization: 'University Name',
    period: '2018 - 2021',
    location: 'City, Country',
    description: 'Bachelor of Science in Physics with honors.',
    highlights: [
      'Graduated with First Class Honours',
      'Thesis on quantum entanglement',
      'President of Physics Society',
    ],
    tags: ['Physics', 'Mathematics', 'Research'],
    type: 'education',
  },
];

// === SOCIAL LINKS ===

export const socialLinks: SocialLink[] = [
  { name: 'GitHub', url: 'https://github.com/yourusername', icon: 'Github' },
  { name: 'LinkedIn', url: 'https://linkedin.com/in/yourusername', icon: 'Linkedin' },
  { name: 'Twitter', url: 'https://twitter.com/yourusername', icon: 'Twitter' },
  { name: 'Email', url: 'mailto:your.email@example.com', icon: 'Mail' },
];
```

---

## File 2: Reusable Section Wrapper

### What This Component Does

A wrapper component that applies scroll animations to any content. This avoids duplicating ScrollTrigger setup code.

**File:** `src/components/dom/SectionWrapper.tsx`

```tsx
/* ============================================================
   SECTION WRAPPER COMPONENT
   
   A reusable wrapper that applies scroll-triggered animations
   to any content passed as children.
   
   Usage:
   <SectionWrapper id="whoami" className="bg-black">
     <h2>Content here</h2>
   </SectionWrapper>
   ============================================================ */

'use client'

import { useRef, ReactNode } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register the ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);
/*
   REGISTER PLUGIN
   
   GSAP plugins must be registered before use.
   This tells GSAP that ScrollTrigger is available.
   
   Only needs to be done once, but doing it in every file
   that uses it ensures it's always registered.
*/

// === TYPE DEFINITIONS ===

interface SectionWrapperProps {
  children: ReactNode;
  /*
     children: ReactNode
     
     ReactNode is a TypeScript type that means "anything React can render":
     - JSX elements (<div>, <Component />)
     - Strings, numbers
     - Arrays of these
     - null, undefined
     
     This lets us wrap any content.
  */
  
  id: string;
  /*
     id: string
     
     HTML id attribute for the section.
     Used for:
     - Navigation links (href="#whoami")
     - ScrollTrigger targeting
     - Intersection Observer
  */
  
  className?: string;
  /*
     className?: string
     
     Optional (?) additional CSS classes.
     Gets merged with default classes.
  */
  
  animation?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'none';
  /*
     animation?: string
     
     Which animation style to apply.
     Defaults to 'fade-up' if not specified.
  */
  
  stagger?: boolean;
  /*
     stagger?: boolean
     
     If true, animate children elements with staggered timing.
     If false, animate the whole section as one unit.
  */
  
  threshold?: number;
  /*
     threshold?: number
     
     Where in the viewport to trigger (0-100).
     Default is 80 (trigger when element is 80% down viewport).
  */
}

// === COMPONENT ===

export default function SectionWrapper({
  children,
  id,
  className = '',
  animation = 'fade-up',
  stagger = true,
  threshold = 80,
}: SectionWrapperProps) {
  /*
     DESTRUCTURING PROPS
     
     We extract each prop and provide defaults:
     - className defaults to '' (empty string)
     - animation defaults to 'fade-up'
     - stagger defaults to true
     - threshold defaults to 80
  */
  
  const sectionRef = useRef<HTMLElement>(null);
  /*
     SECTION REF
     
     Reference to the <section> element.
     Used for:
     - Scoping GSAP animations
     - Targeting for ScrollTrigger
  */
  
  // === ANIMATION SETUP ===
  
  useGSAP(() => {
    if (animation === 'none') return;
    /*
       Skip animation setup if explicitly disabled.
    */
    
    const section = sectionRef.current;
    if (!section) return;
    
    // Define animation properties based on type
    const animationProps = {
      'fade-up': { opacity: 0, y: 60 },
      'fade-in': { opacity: 0 },
      'slide-left': { opacity: 0, x: -100 },
      'slide-right': { opacity: 0, x: 100 },
    }[animation];
    /*
       ANIMATION LOOKUP
       
       Object with animation type as key, properties as value.
       We use [animation] to dynamically get the right properties.
       
       'fade-up': Start invisible, 60px below final position
       'fade-in': Start invisible, no movement
       'slide-left': Start invisible, 100px to the left
       'slide-right': Start invisible, 100px to the right
    */
    
    if (stagger) {
      // Animate each .animate-item child with stagger
      gsap.from(section.querySelectorAll('.animate-item'), {
        ...animationProps,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.15,  // 150ms between each element
        scrollTrigger: {
          trigger: section,
          start: `top ${threshold}%`,
          once: true,  // Only trigger once
        },
      });
      /*
         STAGGERED ANIMATION
         
         querySelectorAll('.animate-item') finds all children
         with class "animate-item".
         
         stagger: 0.15 means each element starts 0.15s after
         the previous one, creating a cascading effect.
         
         once: true means animation only plays once.
         Without this, scrolling up and down would replay it.
      */
    } else {
      // Animate the whole section as one unit
      gsap.from(section, {
        ...animationProps,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: `top ${threshold}%`,
          once: true,
        },
      });
    }
    
  }, { scope: sectionRef, dependencies: [animation, stagger, threshold] });
  /*
     useGSAP OPTIONS
     
     scope: Limits GSAP's element search to within sectionRef
     dependencies: Re-run if these values change
  */
  
  // === RENDER ===
  
  return (
    <section
      ref={sectionRef}
      id={id}
      className={`
        relative
        min-h-screen
        py-20 px-6
        md:py-32 md:px-12
        lg:px-24
        ${className}
      `}
      /*
         TAILWIND CLASSES:
         
         relative     → Position context for absolute children
         min-h-screen → At least full viewport height
         py-20 px-6   → Padding (mobile)
         md:py-32 md:px-12 → More padding on medium screens
         lg:px-24     → Even more padding on large screens
         ${className} → Any additional classes passed in
      */
    >
      {children}
    </section>
  );
}
```

---

## File 3: WhoAmI Component

### What This Component Does

Displays your personal introduction with:
- A large heading
- Your bio text
- Tags/interests
- Scroll-triggered fade-in animations

**File:** `src/components/dom/WhoAmI.tsx`

```tsx
/* ============================================================
   WHO AM I COMPONENT
   
   The biography section of the landing page.
   Introduces who you are with animated text and tags.
   ============================================================ */

'use client'

import { personalInfo } from '@/data/content';
import SectionWrapper from './SectionWrapper';

// === COMPONENT ===

export default function WhoAmI() {
  return (
    <SectionWrapper id="whoami" animation="fade-up" stagger={true}>
      {/*
         Using our reusable SectionWrapper.
         - id="whoami" for navigation
         - animation="fade-up" for scroll effect
         - stagger={true} to animate children sequentially
      */}
      
      <div className="max-w-4xl mx-auto">
        {/*
           max-w-4xl: Maximum width of ~896px
           mx-auto: Center horizontally
           
           This prevents text from stretching too wide on large screens.
           Optimal reading width is 50-75 characters per line.
        */}
        
        {/* Section Label */}
        <span className="animate-item text-[var(--terminal-cyan)] text-sm font-mono uppercase tracking-widest mb-4 block">
          About Me
        </span>
        /*
           SECTION LABEL
           
           animate-item: Will be animated by SectionWrapper
           text-[var(--terminal-cyan)]: Our green accent color
           font-mono: Monospace font
           uppercase: ALL CAPS
           tracking-widest: Wide letter spacing
           mb-4: Margin bottom
           block: Display as block (full width)
        */
        
        {/* Main Heading */}
        <h2 className="animate-item font-heading text-5xl md:text-6xl lg:text-7xl mb-8 text-[var(--photon-white)]">
          Who Am I?
        </h2>
        
        {/* Tagline */}
        <p className="animate-item text-xl md:text-2xl text-[var(--tungsten-gray)] mb-12">
          {personalInfo.tagline}
        </p>
        
        {/* Bio Card */}
        <div className="animate-item bg-[var(--event-horizon)] rounded-2xl p-8 md:p-12 mb-12">
          {/*
             Bio container card:
             - Dark background (event-horizon)
             - Rounded corners (2xl = 1rem radius)
             - Padding responsive to screen size
          */}
          
          {/* Bio Text */}
          <div className="prose prose-invert prose-lg max-w-none">
            {/*
               PROSE CLASSES (Tailwind Typography)
               
               prose: Applies nice typography defaults
               prose-invert: Light text on dark background
               prose-lg: Larger text size
               max-w-none: Remove max-width constraint
               
               Note: Requires @tailwindcss/typography plugin
            */}
            {personalInfo.bio.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-6 text-[var(--photon-white)] leading-relaxed">
                {paragraph.trim()}
              </p>
            ))}
            /*
               RENDERING PARAGRAPHS
               
               bio.split('\n\n') splits text at double newlines.
               .map() creates a <p> for each paragraph.
               
               leading-relaxed: 1.625 line height for readability
            */
          </div>
        </div>
        
        {/* Interest Tags */}
        <div className="animate-item">
          <h3 className="text-sm font-mono uppercase tracking-widest text-[var(--tungsten-gray)] mb-4">
            Interests
          </h3>
          <div className="flex flex-wrap gap-3">
            {/*
               flex flex-wrap: Items wrap to next line if needed
               gap-3: 12px gap between items
            */}
            {[
              'Quantum Computing',
              'Machine Learning',
              'Philosophy of Mind',
              'Web Development',
              'Theoretical Physics',
              'Consciousness Studies',
            ].map((interest) => (
              <span
                key={interest}
                className="
                  px-4 py-2 rounded-full
                  bg-[var(--void-black)]
                  border border-[var(--tungsten-gray)]/30
                  text-sm text-[var(--photon-white)]
                  hover:border-[var(--terminal-cyan)]/50
                  transition-colors duration-300
                "
                /*
                   TAG STYLES:
                   
                   px-4 py-2: Padding
                   rounded-full: Pill shape
                   bg-[...]: Dark background
                   border: Subtle border
                   /30, /50: 30% and 50% opacity
                   hover:border-[...]: Border color on hover
                   transition-colors: Smooth color transition
                   duration-300: 300ms transition
                */
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
        
      </div>
    </SectionWrapper>
  );
}
```

---

## File 4: CV Component

### What This Component Does

Displays a simple section with a button that opens your full CV as a PDF in a new browser tab.

**Setup:**
1. Place your CV PDF file in the `public` folder (e.g., `public/cv.pdf`)
2. The link will point to `/cv.pdf` which Next.js serves from the public folder

**File:** `src/components/dom/CV.tsx`

```tsx
/* ============================================================
   CV / RESUME COMPONENT
   
   Simple section with a button to view/download CV as PDF.
   PDF should be placed in the public folder.
   ============================================================ */

'use client'

import SectionWrapper from './SectionWrapper';

// === MAIN COMPONENT ===

export default function CV() {
  return (
    <SectionWrapper id="cv" animation="fade-up" stagger={true}>
      <div className="max-w-4xl mx-auto text-center">
        
        {/* Section Label */}
        <span className="animate-item text-[var(--spectral-violet)] text-sm font-mono uppercase tracking-widest mb-4 block">
          Curriculum Vitae
        </span>
        
        {/* Main Heading */}
        <h2 className="animate-item font-heading text-5xl md:text-6xl lg:text-7xl mb-8 text-[var(--photon-white)]">
          My CV
        </h2>
        
        {/* Description */}
        <p className="animate-item text-lg md:text-xl text-[var(--tungsten-gray)] mb-12 max-w-2xl mx-auto">
          View my full curriculum vitae for a detailed overview of my 
          education, experience, skills, and accomplishments.
        </p>
        
        {/* CV Button */}
        <a
          href="/cv.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="
            animate-item
            inline-flex items-center gap-3
            px-8 py-4
            bg-[var(--spectral-violet)]
            hover:bg-[var(--spectral-violet)]/80
            text-[var(--photon-white)]
            font-heading text-lg
            rounded-full
            transition-all duration-300
            hover:scale-105
            hover:shadow-lg hover:shadow-[var(--spectral-violet)]/25
          "
          /*
             BUTTON STYLES:
             
             inline-flex items-center gap-3: Flexbox for icon + text
             px-8 py-4: Generous padding
             bg-[...]: Purple background
             hover:bg-[...]/80: Slightly transparent on hover
             rounded-full: Pill shape
             transition-all: Smooth transitions
             hover:scale-105: Slight grow on hover
             hover:shadow-lg: Add shadow on hover
             
             target="_blank": Opens in new tab
             rel="noopener noreferrer": Security for external links
          */
        >
          {/* Icon (optional - using Unicode, or use Lucide icon) */}
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
            />
          </svg>
          View Full CV
        </a>
        
        {/* Optional: Secondary text */}
        <p className="animate-item mt-6 text-sm text-[var(--tungsten-gray)]">
          Opens as PDF in a new tab
        </p>
        
      </div>
    </SectionWrapper>
  );
}
```

### Alternative: Using Lucide Icons

If you have `lucide-react` installed, you can use a proper icon:

```tsx
import { FileDown } from 'lucide-react';

// Then in the button:
<FileDown className="w-5 h-5" />
```

### Notes

- **PDF Location:** Place your CV at `public/cv.pdf`
- **File Name:** You can change the path to match your file (e.g., `/resume.pdf`, `/himanshu-sharma-cv.pdf`)
- **Download vs View:** Using `target="_blank"` opens the PDF in a new tab. If you want to force download instead, add the `download` attribute to the `<a>` tag

---

## File 5: Update Home Page

Add the new sections to your home page.

**File:** `src/app/page.tsx`

```tsx
/* ============================================================
   HOME PAGE - src/app/page.tsx (UPDATED)
   
   Main landing page with all sections.
   ============================================================ */

import IntroAnimation from '@/components/dom/IntroAnimation';
import SceneWrapper from '@/components/canvas/SceneWrapper';
import WhoAmI from '@/components/dom/WhoAmI';
import CV from '@/components/dom/CV';

export default function Home() {
  return (
    <main className="relative">
      {/* Intro Animation (plays once) */}
      <IntroAnimation />
      
      {/* 3D Background (fixed, behind everything) */}
      <SceneWrapper />
      
      {/* Content Layer */}
      <div className="relative z-10">
        {/* Hero Section (first viewport) */}
        <section className="h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-heading text-6xl md:text-8xl text-[var(--photon-white)] mb-4">
              Your Name
            </h1>
            <p className="text-xl text-[var(--tungsten-gray)]">
              Physicist • Developer • Philosopher
            </p>
            
            {/* Scroll indicator */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
              <div className="w-6 h-10 rounded-full border-2 border-[var(--tungsten-gray)]/50 flex justify-center">
                <div className="w-1.5 h-3 bg-[var(--tungsten-gray)] rounded-full mt-2 animate-bounce" />
              </div>
            </div>
          </div>
        </section>
        
        {/* WhoAmI Section */}
        <WhoAmI />
        
        {/* CV Section */}
        <CV />
        
        {/* More sections will be added here */}
      </div>
    </main>
  );
}
```

---

# Phase 6: Worldline Trajectory

## What This Phase Accomplishes

This phase creates a **3D timeline** that visualizes your journey through life. As users scroll:

1. The camera moves through 3D space along your "worldline"
2. Milestone markers appear at key life events
3. A grid in the background warps from structured (past) to chaotic (future)
4. Text labels describe each milestone

**Why "Worldline"?**
In physics, a worldline is the path an object traces through spacetime. It's a fitting metaphor for a personal timeline.

---

## Prerequisites for Phase 6

### Understanding Scroll-Linked Camera Movement

Instead of triggering animations at specific scroll points, we can **continuously** link scroll position to 3D camera position:

```javascript
useFrame(() => {
  // scrollProgress is 0 (top) to 1 (bottom)
  const scrollProgress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  
  // Move camera along Z-axis based on scroll
  camera.position.z = lerp(10, -50, scrollProgress);
});
```

### Understanding useScroll from Drei

`@react-three/drei` provides a `useScroll` hook for scroll-linked animations:

```tsx
import { useScroll } from '@react-three/drei';

function ScrollCamera() {
  const scroll = useScroll();  // Returns scroll data
  
  useFrame(() => {
    // scroll.offset = 0 to 1 (scroll progress)
    const progress = scroll.offset;
    
    camera.position.z = 10 - progress * 60;
  });
  
  return null;
}

// Must be used within ScrollControls
<ScrollControls pages={3}>
  <ScrollCamera />
  <Content />
</ScrollControls>
```

### Understanding Instanced Text (drei's Text component)

For 3D text in R3F, we use drei's `Text` component:

```tsx
import { Text } from '@react-three/drei';

<Text
  position={[0, 0, 0]}
  fontSize={1}
  color="white"
  anchorX="center"  // Horizontal alignment
  anchorY="middle"  // Vertical alignment
  font="/fonts/SpaceGrotesk-Bold.woff"  // Optional custom font
>
  Hello World
</Text>
```

---

## File Structure for Phase 6

```
src/
├── components/
│   └── canvas/
│       ├── Worldline.tsx        # Main timeline component (NEW)
│       ├── TimelineMarker.tsx   # Individual milestone marker (NEW)
│       ├── WorldlineGrid.tsx    # Background grid (NEW)
│       └── Scene.tsx            # Update to include Worldline
├── data/
│   └── timeline.ts              # Timeline data (NEW)
```

---

## File 1: Timeline Data

**File:** `src/data/timeline.ts`

```typescript
/* ============================================================
   TIMELINE DATA - src/data/timeline.ts
   
   Data for the worldline visualization.
   Each milestone has a position in the timeline and metadata.
   ============================================================ */

export interface Milestone {
  id: string;
  year: number;
  title: string;
  description: string;
  category: 'education' | 'work' | 'personal' | 'achievement';
  position: {
    x: number;  // Horizontal offset (for visual variety)
    z: number;  // Depth (calculated from year)
  };
}

// Helper to calculate Z position from year
// Earlier years = further away (larger Z), recent = closer (smaller Z)
const yearToZ = (year: number): number => {
  const currentYear = new Date().getFullYear();
  const yearsAgo = currentYear - year;
  return yearsAgo * 5;  // Each year = 5 units of depth
};

export const milestones: Milestone[] = [
  {
    id: 'birth',
    year: 2000,
    title: 'Born',
    description: 'The journey begins',
    category: 'personal',
    position: { x: 0, z: yearToZ(2000) },
  },
  {
    id: 'high-school',
    year: 2016,
    title: 'High School',
    description: 'Discovered love for physics',
    category: 'education',
    position: { x: 2, z: yearToZ(2016) },
  },
  {
    id: 'university',
    year: 2018,
    title: 'University',
    description: 'Started BSc in Physics',
    category: 'education',
    position: { x: -1, z: yearToZ(2018) },
  },
  {
    id: 'first-code',
    year: 2019,
    title: 'First Code',
    description: 'Wrote first Python script',
    category: 'achievement',
    position: { x: 1.5, z: yearToZ(2019) },
  },
  {
    id: 'research',
    year: 2021,
    title: 'Research',
    description: 'Started quantum computing research',
    category: 'work',
    position: { x: -2, z: yearToZ(2021) },
  },
  {
    id: 'graduation',
    year: 2022,
    title: 'Graduation',
    description: 'BSc with First Class Honours',
    category: 'education',
    position: { x: 0.5, z: yearToZ(2022) },
  },
  {
    id: 'present',
    year: 2024,
    title: 'Present',
    description: 'Building the future',
    category: 'personal',
    position: { x: 0, z: yearToZ(2024) },
  },
].sort((a, b) => a.position.z - b.position.z);  // Sort by Z (furthest first)
```

---

## File 2: Timeline Marker Component

**File:** `src/components/canvas/TimelineMarker.tsx`

```tsx
/* ============================================================
   TIMELINE MARKER COMPONENT
   
   A single milestone on the worldline.
   Renders as a glowing sphere with floating text.
   ============================================================ */

'use client'

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import type { Milestone } from '@/data/timeline';

// === TYPE DEFINITIONS ===

interface TimelineMarkerProps {
  milestone: Milestone;
  isActive: boolean;  // Is this the closest marker to camera?
}

// === CATEGORY COLORS ===

const categoryColors = {
  education: '#8F00FF',   // spectral-violet
  work: '#00FF9D',        // terminal-cyan
  personal: '#F0F0F0',    // photon-white
  achievement: '#FFD700', // gold
};

// === COMPONENT ===

export default function TimelineMarker({ milestone, isActive }: TimelineMarkerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  const color = categoryColors[milestone.category];
  
  // Animate scale when active or hovered
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    const targetScale = isActive ? 1.5 : hovered ? 1.2 : 1;
    groupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      delta * 5
    );
    /*
       SMOOTH SCALING
       
       lerp() smoothly interpolates toward target scale.
       delta * 5 controls how fast it reaches target.
    */
  });
  
  return (
    <group
      ref={groupRef}
      position={[milestone.position.x, 0, milestone.position.z]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Floating effect wrapper */}
      <Float
        speed={2}           // Animation speed
        rotationIntensity={0.2}  // Slight rotation
        floatIntensity={0.5}     // Up/down movement
      >
        {/* Main sphere */}
        <mesh>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={isActive ? 0.8 : 0.3}
            /*
               EMISSIVE MATERIAL
               
               emissive: Color the object "glows"
               emissiveIntensity: How bright the glow is
               Active markers glow brighter
            */
          />
        </mesh>
        
        {/* Glow ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.4, 0.5, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={isActive ? 0.6 : 0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
        
        {/* Year label (always visible) */}
        <Text
          position={[0, -0.8, 0]}
          fontSize={0.3}
          color={color}
          anchorX="center"
          anchorY="top"
          font="/fonts/JetBrainsMono-Regular.woff"
        >
          {milestone.year}
        </Text>
        
        {/* Title (visible when active or hovered) */}
        {(isActive || hovered) && (
          <>
            <Text
              position={[0, 0.8, 0]}
              fontSize={0.4}
              color="#F0F0F0"
              anchorX="center"
              anchorY="bottom"
              font="/fonts/SpaceGrotesk-Bold.woff"
            >
              {milestone.title}
            </Text>
            
            {/* Description (only when active) */}
            {isActive && (
              <Text
                position={[0, 1.3, 0]}
                fontSize={0.2}
                color="#888888"
                anchorX="center"
                anchorY="bottom"
                maxWidth={3}
              >
                {milestone.description}
              </Text>
            )}
          </>
        )}
      </Float>
    </group>
  );
}
```

---

## File 3: Worldline Grid Component

**File:** `src/components/canvas/WorldlineGrid.tsx`

```tsx
/* ============================================================
   WORLDLINE GRID COMPONENT
   
   Background grid that warps based on scroll position.
   Starts structured (past), becomes chaotic (future).
   ============================================================ */

'use client'

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface WorldlineGridProps {
  scrollProgress: number;  // 0 to 1
}

export default function WorldlineGrid({ scrollProgress }: WorldlineGridProps) {
  const linesRef = useRef<THREE.LineSegments>(null);
  
  // Create grid geometry
  const geometry = useMemo(() => {
    const size = 100;
    const divisions = 50;
    const points: THREE.Vector3[] = [];
    
    const step = size / divisions;
    const halfSize = size / 2;
    
    // Horizontal lines (along X)
    for (let i = 0; i <= divisions; i++) {
      const z = -halfSize + i * step;
      points.push(new THREE.Vector3(-halfSize, 0, z));
      points.push(new THREE.Vector3(halfSize, 0, z));
    }
    
    // Vertical lines (along Z)
    for (let i = 0; i <= divisions; i++) {
      const x = -halfSize + i * step;
      points.push(new THREE.Vector3(x, 0, -halfSize));
      points.push(new THREE.Vector3(x, 0, halfSize));
    }
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return geometry;
  }, []);
  
  // Animate grid distortion
  useFrame((state) => {
    if (!linesRef.current) return;
    
    const positions = linesRef.current.geometry.attributes.position;
    const time = state.clock.elapsedTime;
    
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);
      
      // Calculate distortion based on Z position and scroll
      // Near camera (low Z) = more distortion
      const distortionFactor = Math.max(0, 1 - (z + 50) / 100);
      const chaos = distortionFactor * scrollProgress * 2;
      
      // Apply wave distortion
      const y = Math.sin(x * 0.5 + time) * Math.cos(z * 0.5 + time) * chaos;
      
      positions.setY(i, y);
    }
    
    positions.needsUpdate = true;
  });
  
  return (
    <lineSegments ref={linesRef} geometry={geometry} position={[0, -3, 0]}>
      <lineBasicMaterial
        color="#333333"
        transparent
        opacity={0.3}
      />
    </lineSegments>
  );
}
```

---

## File 4: Main Worldline Component

**File:** `src/components/canvas/Worldline.tsx`

```tsx
/* ============================================================
   WORLDLINE COMPONENT
   
   Main component that combines camera, markers, and grid.
   Uses ScrollControls for scroll-linked animation.
   ============================================================ */

'use client'

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useScroll, ScrollControls, Scroll } from '@react-three/drei';
import * as THREE from 'three';
import { milestones } from '@/data/timeline';
import TimelineMarker from './TimelineMarker';
import WorldlineGrid from './WorldlineGrid';
import { lerp } from '@/lib/utils';

// === CAMERA CONTROLLER ===

function CameraController() {
  const { camera } = useThree();
  const scroll = useScroll();
  
  // Calculate Z range from milestones
  const startZ = 10;  // Starting camera position
  const endZ = milestones[milestones.length - 1].position.z - 5;  // End near last milestone
  
  useFrame(() => {
    const progress = scroll.offset;  // 0 to 1
    
    // Move camera along Z axis
    camera.position.z = lerp(startZ, endZ, progress);
    
    // Slight Y movement for visual interest
    camera.position.y = 2 + Math.sin(progress * Math.PI) * 1;
  });
  
  return null;
}

// === MAIN WORLDLINE SCENE ===

function WorldlineScene() {
  const scroll = useScroll();
  const activeIndexRef = useRef(0);
  
  useFrame(({ camera }) => {
    // Find which milestone is closest to camera
    let closestIndex = 0;
    let closestDistance = Infinity;
    
    milestones.forEach((m, i) => {
      const distance = Math.abs(camera.position.z - m.position.z);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i;
      }
    });
    
    activeIndexRef.current = closestIndex;
  });
  
  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.3} />
      
      {/* Point light that follows camera */}
      <pointLight position={[0, 5, 0]} intensity={1} />
      
      {/* Background grid */}
      <WorldlineGrid scrollProgress={scroll.offset} />
      
      {/* Timeline markers */}
      {milestones.map((milestone, index) => (
        <TimelineMarker
          key={milestone.id}
          milestone={milestone}
          isActive={index === activeIndexRef.current}
        />
      ))}
      
      {/* Camera controller */}
      <CameraController />
    </>
  );
}

// === EXPORTED COMPONENT (with ScrollControls) ===

export default function Worldline() {
  return (
    <ScrollControls
      pages={5}  // How many "pages" of scrolling
      damping={0.25}  // Smoothness of scroll
    >
      <WorldlineScene />
      
      {/* HTML content that scrolls with the 3D */}
      <Scroll html>
        <div className="w-screen">
          {/* Spacer divs to create scroll height */}
          {milestones.map((m) => (
            <div key={m.id} className="h-screen" />
          ))}
        </div>
      </Scroll>
    </ScrollControls>
  );
}
```

---

## Phase 4-6 Checklist

After completing these phases, you should have:

- [x] `src/data/content.ts` — Content data file
- [x] `src/data/timeline.ts` — Timeline milestones
- [x] `src/components/dom/SectionWrapper.tsx` — Reusable scroll wrapper
- [x] `src/components/dom/WhoAmI.tsx` — Biography section
- [x] `src/components/dom/CV.tsx` — Skills and experience
- [x] `src/components/canvas/TimelineMarker.tsx` — 3D milestone markers
- [x] `src/components/canvas/WorldlineGrid.tsx` — Animated grid
- [x] `src/components/canvas/Worldline.tsx` — Main timeline component
- [x] All sections animate on scroll
- [x] Timeline camera moves with scroll

## Testing Phases 4-6

```bash
npm run dev
```

1. **Scroll down** — WhoAmI section should fade in
2. **Continue scrolling** — CV section should animate
3. **Check stagger** — Elements should animate sequentially
4. **Check timeline** — Camera should move through milestones
5. **Hover markers** — Should show title/description

---

## Resources for Phases 4-6

| Topic | Resource |
|-------|----------|
| ScrollTrigger | [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) |
| ScrollTrigger Examples | [GSAP ScrollTrigger Demos](https://gsap.com/scroll/) |
| drei useScroll | [Drei useScroll](https://github.com/pmndrs/drei#usescroll) |
| drei ScrollControls | [Drei ScrollControls](https://github.com/pmndrs/drei#scrollcontrols) |
| drei Text | [Drei Text](https://github.com/pmndrs/drei#text) |
| drei Float | [Drei Float](https://github.com/pmndrs/drei#float) |
| Tailwind Grid | [Tailwind Grid](https://tailwindcss.com/docs/grid-template-columns) |
| React Children | [React Children](https://react.dev/reference/react/Children) |

---

# Phase 7: Interests Manifold

## What This Phase Accomplishes

This phase creates an **interactive force-directed graph** that visualizes your interests and how they connect. Users can:

- See nodes representing different interests (Physics, Coding, Philosophy, etc.)
- Watch nodes naturally repel each other and settle into position
- See connections (edges) between related interests
- Drag nodes around and watch the system react

**Why "Manifold"?**
In mathematics, a manifold is a space that locally resembles Euclidean space. Your interests form a "manifold" of interconnected topics.

---

## Prerequisites for Phase 7

### Understanding Physics Engines

A physics engine simulates real-world physics:
- **Rigid bodies**: Objects with mass, position, velocity
- **Colliders**: Shapes that detect collisions
- **Forces**: Push/pull on objects
- **Constraints**: Rules connecting objects (springs, joints)

### Understanding @react-three/rapier

Rapier is a physics engine. `@react-three/rapier` integrates it with R3F:

```tsx
import { Physics, RigidBody } from '@react-three/rapier';

// Wrap your scene in Physics
<Physics gravity={[0, -9.81, 0]}>
  {/* Objects inside get physics simulation */}
  <RigidBody>
    <mesh>
      <boxGeometry />
      <meshStandardMaterial />
    </mesh>
  </RigidBody>
</Physics>
```

### Force-Directed Graph Concept

Nodes repel each other (like magnets with same polarity) while edges pull connected nodes together (like springs). This creates natural clustering.

```
FORCES:
                    
  ○ ←────────→ ○    Repulsion: All nodes push apart
     repel
     
  ○ ←──spring──→ ○  Attraction: Connected nodes pull together
     attract
```

---

## File Structure for Phase 7

```
src/
├── components/
│   └── canvas/
│       ├── Manifold.tsx         # Main graph component (NEW)
│       ├── ManifoldNode.tsx     # Individual node (NEW)
│       └── ManifoldEdge.tsx     # Connection line (NEW)
├── data/
│   └── interests.ts             # Interest data (NEW)
```

---

## File 1: Interests Data
;
**File:** `src/data/interests.ts`

```typescript
/* ============================================================
   INTERESTS DATA
   
   Nodes and connections for the manifold visualization.
   ============================================================ */

export interface InterestNode {
  id: string;
  label: string;
  category: 'science' | 'tech' | 'philosophy' | 'creative';
  size: number;  // 0.5 to 1.5 (relative importance)
}

export interface InterestEdge {
  from: string;  // Node ID
  to: string;    // Node ID
  strength: number;  // 0 to 1 (connection strength)
}

export const nodes: InterestNode[] = [
  { id: 'physics', label: 'Physics', category: 'science', size: 1.2 },
  { id: 'quantum', label: 'Quantum Computing', category: 'science', size: 1.0 },
  { id: 'coding', label: 'Programming', category: 'tech', size: 1.3 },
  { id: 'web', label: 'Web Dev', category: 'tech', size: 0.9 },
  { id: 'ml', label: 'Machine Learning', category: 'tech', size: 1.0 },
  { id: 'philosophy', label: 'Philosophy', category: 'philosophy', size: 1.1 },
  { id: 'consciousness', label: 'Consciousness', category: 'philosophy', size: 0.8 },
  { id: 'music', label: 'Music', category: 'creative', size: 0.7 },
];

export const edges: InterestEdge[] = [
  { from: 'physics', to: 'quantum', strength: 0.9 },
  { from: 'physics', to: 'philosophy', strength: 0.6 },
  { from: 'quantum', to: 'coding', strength: 0.7 },
  { from: 'coding', to: 'web', strength: 0.8 },
  { from: 'coding', to: 'ml', strength: 0.7 },
  { from: 'philosophy', to: 'consciousness', strength: 0.9 },
  { from: 'quantum', to: 'consciousness', strength: 0.5 },
  { from: 'ml', to: 'physics', strength: 0.4 },
];

// Category colors
export const categoryColors = {
  science: '#8F00FF',    // violet
  tech: '#00FF9D',       // cyan
  philosophy: '#FFD700', // gold
  creative: '#FF6B6B',   // coral
};
```

---

## File 2: Manifold Node Component

**File:** `src/components/canvas/ManifoldNode.tsx`

```tsx
'use client'

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, useCursor } from '@react-three/drei';
import { RigidBody, BallCollider } from '@react-three/rapier';
import * as THREE from 'three';
import type { InterestNode } from '@/data/interests';
import { categoryColors } from '@/data/interests';

interface ManifoldNodeProps {
  node: InterestNode;
  position: [number, number, number];
  onDrag?: (id: string, position: THREE.Vector3) => void;
}

export default function ManifoldNode({ node, position, onDrag }: ManifoldNodeProps) {
  const rigidBodyRef = useRef<any>(null);
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);
  
  // Change cursor on hover
  useCursor(hovered);
  
  const color = categoryColors[node.category];
  const radius = node.size * 0.5;
  
  // Handle drag
  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    setDragging(true);
    // Lock the body so it doesn't move from physics
    if (rigidBodyRef.current) {
      rigidBodyRef.current.setBodyType(2); // Kinematic
    }
  };
  
  const handlePointerUp = () => {
    setDragging(false);
    if (rigidBodyRef.current) {
      rigidBodyRef.current.setBodyType(0); // Dynamic
    }
  };
  
  const handlePointerMove = (e: any) => {
    if (dragging && rigidBodyRef.current) {
      const newPos = new THREE.Vector3(e.point.x, e.point.y, 0);
      rigidBodyRef.current.setTranslation(newPos, true);
      onDrag?.(node.id, newPos);
    }
  };
  
  return (
    <RigidBody
      ref={rigidBodyRef}
      position={position}
      type="dynamic"
      colliders={false}
      linearDamping={2}  // Slow down over time
      angularDamping={2}
    >
      <BallCollider args={[radius]} />
      
      <group
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerMove}
      >
        {/* Main sphere */}
        <mesh>
          <sphereGeometry args={[radius, 32, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={hovered ? 0.5 : 0.2}
          />
        </mesh>
        
        {/* Label */}
        <Text
          position={[0, radius + 0.3, 0]}
          fontSize={0.25}
          color="#F0F0F0"
          anchorX="center"
          anchorY="bottom"
        >
          {node.label}
        </Text>
      </group>
    </RigidBody>
  );
}
```

---

## File 3: Manifold Edge Component

**File:** `src/components/canvas/ManifoldEdge.tsx`

```tsx
'use client'

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ManifoldEdgeProps {
  startPos: THREE.Vector3;
  endPos: THREE.Vector3;
  strength: number;
}

export default function ManifoldEdge({ startPos, endPos, strength }: ManifoldEdgeProps) {
  const lineRef = useRef<THREE.Line>(null);
  
  useFrame(() => {
    if (!lineRef.current) return;
    
    // Update line positions
    const positions = lineRef.current.geometry.attributes.position;
    positions.setXYZ(0, startPos.x, startPos.y, startPos.z);
    positions.setXYZ(1, endPos.x, endPos.y, endPos.z);
    positions.needsUpdate = true;
  });
  
  const geometry = new THREE.BufferGeometry().setFromPoints([
    startPos.clone(),
    endPos.clone(),
  ]);
  
  return (
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial
        color="#666666"
        transparent
        opacity={strength * 0.5}
        linewidth={1}
      />
    </line>
  );
}
```

---

## File 4: Main Manifold Component

**File:** `src/components/canvas/Manifold.tsx`

```tsx
'use client'

import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import * as THREE from 'three';
import { nodes, edges } from '@/data/interests';
import ManifoldNode from './ManifoldNode';
import ManifoldEdge from './ManifoldEdge';

export default function Manifold() {
  // Track node positions for edges
  const [nodePositions, setNodePositions] = useState<Record<string, THREE.Vector3>>({});
  
  // Initialize random positions
  useEffect(() => {
    const initial: Record<string, THREE.Vector3> = {};
    nodes.forEach((node, i) => {
      const angle = (i / nodes.length) * Math.PI * 2;
      const radius = 3;
      initial[node.id] = new THREE.Vector3(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        0
      );
    });
    setNodePositions(initial);
  }, []);
  
  // Update position when node is dragged
  const handleNodeDrag = (id: string, position: THREE.Vector3) => {
    setNodePositions(prev => ({
      ...prev,
      [id]: position.clone(),
    }));
  };
  
  return (
    <Physics gravity={[0, 0, 0]}>
      {/* Nodes */}
      {nodes.map((node) => (
        <ManifoldNode
          key={node.id}
          node={node}
          position={[
            nodePositions[node.id]?.x ?? 0,
            nodePositions[node.id]?.y ?? 0,
            0,
          ]}
          onDrag={handleNodeDrag}
        />
      ))}
      
      {/* Edges */}
      {edges.map((edge, i) => {
        const start = nodePositions[edge.from];
        const end = nodePositions[edge.to];
        if (!start || !end) return null;
        
        return (
          <ManifoldEdge
            key={`${edge.from}-${edge.to}`}
            startPos={start}
            endPos={end}
            strength={edge.strength}
          />
        );
      })}
    </Physics>
  );
}
```

---

## Phase 7 Resources

| Topic | Resource |
|-------|----------|
| Rapier Physics | [Rapier Docs](https://rapier.rs/docs/) |
| @react-three/rapier | [R3F Rapier](https://github.com/pmndrs/react-three-rapier) |
| Force-Directed Graphs | [D3 Force](https://d3js.org/d3-force) |
| RigidBody Types | [Rapier RigidBody](https://rapier.rs/docs/user_guides/javascript/rigid_bodies) |

---

# Phase 8: Section Transitions

## What This Phase Accomplishes

This phase creates **smooth animated transitions** between sections. Instead of abrupt cuts, elements gracefully fade, slide, or morph as users navigate.

**Transition Types:**
- **Scroll-based**: Animate as user scrolls between sections
- **Click-based**: Animate when user clicks navigation links
- **Reveal**: Progressive reveal of content as it comes into view

---

## Prerequisites for Phase 8

### GSAP Timeline Callbacks

Timelines can trigger functions at specific points:

```javascript
const tl = gsap.timeline();

tl.to(".box", { x: 100 })
  .add(() => console.log("Midpoint!"))  // Callback function
  .to(".box", { y: 100 })
  .eventCallback("onComplete", () => {
    console.log("Timeline finished!");
  });
```

### ScrollTrigger with Scrub

"Scrub" links animation progress to scroll position:

```javascript
gsap.to(".element", {
  x: 500,
  scrollTrigger: {
    trigger: ".element",
    start: "top bottom",  // When element enters viewport
    end: "top top",       // When element reaches top
    scrub: true,          // Link to scroll (not time)
    // scrub: 0.5         // Smooth scrub with 0.5s delay
  }
});
```

---

## File Structure for Phase 8

```
src/
├── components/
│   └── dom/
│       └── SectionTransition.tsx  # Transition wrapper (NEW)
├── hooks/
│   └── useScrollTransition.ts     # Custom hook (NEW)
```

---

## File 1: Scroll Transition Hook

**File:** `src/hooks/useScrollTransition.ts`

```typescript
'use client'

import { useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TransitionConfig {
  enter?: gsap.TweenVars;    // Animation when entering view
  exit?: gsap.TweenVars;     // Animation when exiting view
  scrub?: boolean | number;  // Link to scroll
  pin?: boolean;             // Pin during animation
  markers?: boolean;         // Show debug markers
}

export function useScrollTransition(
  ref: React.RefObject<HTMLElement>,
  config: TransitionConfig = {}
) {
  const {
    enter = { opacity: 0, y: 50 },
    exit = {},
    scrub = false,
    pin = false,
    markers = false,
  } = config;
  
  useGSAP(() => {
    if (!ref.current) return;
    
    const element = ref.current;
    
    // Create enter animation
    gsap.from(element, {
      ...enter,
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        end: 'top 20%',
        scrub,
        pin,
        markers,
        toggleActions: 'play none none reverse',
      },
    });
    
    // Create exit animation if specified
    if (Object.keys(exit).length > 0) {
      gsap.to(element, {
        ...exit,
        scrollTrigger: {
          trigger: element,
          start: 'bottom 50%',
          end: 'bottom top',
          scrub: true,
        },
      });
    }
    
  }, { scope: ref });
}
```

---

## File 2: Section Transition Component

**File:** `src/components/dom/SectionTransition.tsx`

```tsx
'use client'

import { useRef, ReactNode } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SectionTransitionProps {
  children: ReactNode;
  id: string;
  type?: 'fade' | 'slide-up' | 'slide-left' | 'zoom' | 'parallax';
  duration?: number;
}

export default function SectionTransition({
  children,
  id,
  type = 'fade',
  duration = 1,
}: SectionTransitionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    if (!sectionRef.current) return;
    
    const section = sectionRef.current;
    
    // Define animation based on type
    const animations: Record<string, gsap.TweenVars> = {
      'fade': { opacity: 0 },
      'slide-up': { opacity: 0, y: 100 },
      'slide-left': { opacity: 0, x: -100 },
      'zoom': { opacity: 0, scale: 0.8 },
      'parallax': { y: 100 },  // No opacity change
    };
    
    const animationProps = animations[type] || animations['fade'];
    
    // Enter animation
    gsap.from(section, {
      ...animationProps,
      duration,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'top 30%',
        scrub: type === 'parallax' ? 1 : false,
        toggleActions: type === 'parallax' 
          ? undefined 
          : 'play none none reverse',
      },
    });
    
    // Parallax exit
    if (type === 'parallax') {
      gsap.to(section, {
        y: -50,
        scrollTrigger: {
          trigger: section,
          start: 'bottom bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }
    
  }, { scope: sectionRef, dependencies: [type, duration] });
  
  return (
    <div ref={sectionRef} id={id} className="relative">
      {children}
    </div>
  );
}
```

---

## Using Transitions

```tsx
// In page.tsx or a section component
import SectionTransition from '@/components/dom/SectionTransition';

<SectionTransition id="about" type="slide-up">
  <section className="min-h-screen">
    <h2>About Me</h2>
    {/* Content */}
  </section>
</SectionTransition>

<SectionTransition id="projects" type="parallax">
  <section className="min-h-screen">
    <h2>Projects</h2>
    {/* Content */}
  </section>
</SectionTransition>
```

---

## Phase 8 Resources

| Topic | Resource |
|-------|----------|
| ScrollTrigger Scrub | [GSAP Scrub](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) |
| Toggle Actions | [Toggle Actions](https://gsap.com/docs/v3/Plugins/ScrollTrigger/toggleActions) |
| Pin | [ScrollTrigger Pin](https://gsap.com/docs/v3/Plugins/ScrollTrigger/pin) |

---

# Phase 9: Navigation

## What This Phase Accomplishes

This phase creates a **fixed navigation bar** that:

- Stays visible as users scroll
- Highlights the current section
- Provides smooth scroll to sections
- Collapses to hamburger menu on mobile

---

## Prerequisites for Phase 9

### Intersection Observer API

The browser's native API to detect when elements enter/exit the viewport:

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      console.log(`${entry.target.id} is visible!`);
    }
  });
}, {
  threshold: 0.5,  // Trigger when 50% visible
  rootMargin: '-20% 0px -20% 0px',  // Shrink detection area
});

// Observe elements
document.querySelectorAll('section').forEach(section => {
  observer.observe(section);
});
```

### useInView Hook (from React)

A React-friendly way to use Intersection Observer:

```tsx
import { useRef, useEffect, useState } from 'react';

function useInView(ref: React.RefObject<HTMLElement>, threshold = 0.5) {
  const [isInView, setIsInView] = useState(false);
  
  useEffect(() => {
    if (!ref.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold }
    );
    
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, threshold]);
  
  return isInView;
}
```

---

## File Structure for Phase 9

```
src/
├── components/
│   └── dom/
│       ├── Navigation.tsx      # Main navbar (NEW)
│       ├── NavLink.tsx         # Individual link (NEW)
│       └── MobileMenu.tsx      # Mobile hamburger (NEW)
├── hooks/
│   └── useActiveSection.ts     # Track active section (NEW)
```

---

## File 1: Active Section Hook

**File:** `src/hooks/useActiveSection.ts`

```typescript
'use client'

import { useState, useEffect } from 'react';

const SECTIONS = ['hero', 'whoami', 'cv', 'worldline', 'manifold', 'projects', 'contact'];

export function useActiveSection() {
  const [activeSection, setActiveSection] = useState<string>('hero');
  
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    
    SECTIONS.forEach(sectionId => {
      const element = document.getElementById(sectionId);
      if (!element) return;
      
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(sectionId);
          }
        },
        {
          threshold: 0.3,  // 30% visible
          rootMargin: '-10% 0px -10% 0px',
        }
      );
      
      observer.observe(element);
      observers.push(observer);
    });
    
    return () => {
      observers.forEach(obs => obs.disconnect());
    };
  }, []);
  
  return activeSection;
}
```

---

## File 2: Navigation Component

**File:** `src/components/dom/Navigation.tsx`

```tsx
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
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
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
              YourName
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
```

---

## File 3: NavLink Component

**File:** `src/components/dom/NavLink.tsx`

```tsx
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
```

---

## File 4: Mobile Menu Component

**File:** `src/components/dom/MobileMenu.tsx`

```tsx
'use client'

import { useEffect } from 'react';

interface MobileMenuProps {
  items: Array<{ id: string; label: string }>;
  activeSection: string;
  isOpen: boolean;
  onToggle: () => void;
  onNavigate: (id: string) => void;
}

export default function MobileMenu({
  items,
  activeSection,
  isOpen,
  onToggle,
  onNavigate,
}: MobileMenuProps) {
  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        onClick={onToggle}
        className="fixed top-4 right-4 z-50 p-2"
        aria-label="Toggle menu"
      >
        <div className="w-6 h-5 relative flex flex-col justify-between">
          <span className={`
            w-full h-0.5 bg-[var(--photon-white)] transition-all duration-300
            ${isOpen ? 'rotate-45 translate-y-2' : ''}
          `} />
          <span className={`
            w-full h-0.5 bg-[var(--photon-white)] transition-all duration-300
            ${isOpen ? 'opacity-0' : ''}
          `} />
          <span className={`
            w-full h-0.5 bg-[var(--photon-white)] transition-all duration-300
            ${isOpen ? '-rotate-45 -translate-y-2' : ''}
          `} />
        </div>
      </button>
      
      {/* Fullscreen Menu */}
      <div className={`
        fixed inset-0 z-40 bg-[var(--void-black)]
        flex items-center justify-center
        transition-all duration-500
        ${isOpen 
          ? 'opacity-100 pointer-events-auto' 
          : 'opacity-0 pointer-events-none'
        }
      `}>
        <ul className="flex flex-col items-center gap-8">
          {items.map((item, index) => (
            <li
              key={item.id}
              style={{
                transitionDelay: isOpen ? `${index * 50}ms` : '0ms',
              }}
              className={`
                transition-all duration-500
                ${isOpen 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-4'
                }
              `}
            >
              <button
                onClick={() => onNavigate(item.id)}
                className={`
                  font-heading text-3xl
                  ${activeSection === item.id
                    ? 'text-[var(--terminal-cyan)]'
                    : 'text-[var(--photon-white)]'
                  }
                `}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

---

## Phase 9 Resources

| Topic | Resource |
|-------|----------|
| Intersection Observer | [MDN Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) |
| Smooth Scroll | [MDN scrollIntoView](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) |
| Fixed Positioning | [Tailwind Position](https://tailwindcss.com/docs/position) |
| Backdrop Blur | [Tailwind Backdrop](https://tailwindcss.com/docs/backdrop-blur) |

---

# Phase 10: Projects (Beam Splitter)

## What This Phase Accomplishes

This phase creates a **3D beam splitter visualization** for your projects:

- A prism in the center represents "you"
- An incoming beam of "white light" hits the prism
- Multiple output beams emerge, each representing a project category
- Users can click beams to view projects in that category

**Physics Metaphor:**
Just like a prism splits white light into a spectrum, your skills combine to create diverse projects.

---

## Prerequisites for Phase 10

### Understanding 3D Lighting Effects

To create convincing light beams, we use:

1. **Tube Geometry**: Cylinders that look like beams
2. **Emissive Materials**: Objects that "glow"
3. **Additive Blending**: Colors add together (like real light)

```tsx
<mesh>
  <tubeGeometry args={[curve, 64, 0.1, 8, false]} />
  <meshBasicMaterial
    color="#00FF9D"
    transparent
    opacity={0.8}
    blending={THREE.AdditiveBlending}  // Light-like blending
  />
</mesh>
```

### Understanding Three.js Curves

Curves define paths in 3D space:

```javascript
import * as THREE from 'three';

// Straight line curve
const curve = new THREE.LineCurve3(
  new THREE.Vector3(0, 0, -5),  // Start point
  new THREE.Vector3(0, 0, 0)    // End point
);

// Bezier curve (smooth)
const bezier = new THREE.QuadraticBezierCurve3(
  new THREE.Vector3(0, 0, 0),   // Start
  new THREE.Vector3(2, 1, 2),   // Control point
  new THREE.Vector3(5, 0, 5)    // End
);
```

---

## File Structure for Phase 10

```
src/
├── components/
│   ├── canvas/
│   │   ├── BeamSplitter.tsx     # Main 3D component (NEW)
│   │   ├── Prism.tsx            # Central prism (NEW)
│   │   ├── LightBeam.tsx        # Individual beam (NEW)
│   │   └── ProjectOrb.tsx       # Project at beam end (NEW)
│   └── dom/
│       └── ProjectModal.tsx     # Project details modal (NEW)
├── data/
│   └── projects.ts              # Project data (NEW)
```

---

## File 1: Projects Data

**File:** `src/data/projects.ts`

```typescript
export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'web' | 'research' | 'creative' | 'tools';
  tags: string[];
  image?: string;
  link?: string;
  github?: string;
}

export const projects: Project[] = [
  {
    id: 'portfolio',
    title: 'This Portfolio',
    description: 'A 3D interactive portfolio built with Next.js, Three.js, and GSAP.',
    category: 'web',
    tags: ['Next.js', 'Three.js', 'GSAP', 'TypeScript'],
    github: 'https://github.com/yourusername/portfolio',
  },
  {
    id: 'quantum-sim',
    title: 'Quantum Simulator',
    description: 'Python library for simulating quantum circuits.',
    category: 'research',
    tags: ['Python', 'Qiskit', 'NumPy'],
    github: 'https://github.com/yourusername/quantum-sim',
  },
  // Add more projects...
];

export const categoryColors = {
  web: '#00FF9D',       // terminal-cyan
  research: '#8F00FF',  // spectral-violet
  creative: '#FF6B6B',  // coral
  tools: '#FFD700',     // gold
};

export const categoryAngles = {
  web: -30,       // Degrees from center
  research: -10,
  creative: 10,
  tools: 30,
};
```

---

## File 2: Light Beam Component

**File:** `src/components/canvas/LightBeam.tsx`

```tsx
'use client'

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface LightBeamProps {
  start: THREE.Vector3;
  end: THREE.Vector3;
  color: string;
  animated?: boolean;
  onClick?: () => void;
}

export default function LightBeam({
  start,
  end,
  color,
  animated = true,
  onClick,
}: LightBeamProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Create tube geometry along curve
  const geometry = useMemo(() => {
    const curve = new THREE.LineCurve3(start, end);
    return new THREE.TubeGeometry(curve, 32, 0.05, 8, false);
  }, [start, end]);
  
  // Animate beam intensity
  useFrame((state) => {
    if (!meshRef.current || !animated) return;
    
    const material = meshRef.current.material as THREE.MeshBasicMaterial;
    material.opacity = 0.6 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
  });
  
  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      onClick={onClick}
    >
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
```

---

## File 3: Prism Component

**File:** `src/components/canvas/Prism.tsx`

```tsx
'use client'

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Prism() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Slow rotation
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.1;
  });
  
  // Create triangular prism geometry
  const shape = new THREE.Shape();
  const size = 0.8;
  shape.moveTo(0, size);
  shape.lineTo(-size * 0.866, -size * 0.5);  // Bottom left
  shape.lineTo(size * 0.866, -size * 0.5);   // Bottom right
  shape.closePath();
  
  const extrudeSettings = {
    depth: 1.5,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
  };
  
  return (
    <mesh ref={meshRef} rotation={[0, 0, 0]}>
      <extrudeGeometry args={[shape, extrudeSettings]} />
      <meshPhysicalMaterial
        color="#FFFFFF"
        metalness={0.1}
        roughness={0.1}
        transmission={0.9}  // Glass-like transparency
        thickness={1}
        envMapIntensity={1}
        clearcoat={1}
        clearcoatRoughness={0.1}
      />
    </mesh>
  );
}
```

---

## File 4: Beam Splitter Scene

**File:** `src/components/canvas/BeamSplitter.tsx`

```tsx
'use client'

import { useState } from 'react';
import * as THREE from 'three';
import { projects, categoryColors, categoryAngles } from '@/data/projects';
import Prism from './Prism';
import LightBeam from './LightBeam';

interface BeamSplitterProps {
  onSelectCategory: (category: string) => void;
}

export default function BeamSplitter({ onSelectCategory }: BeamSplitterProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  
  // Incoming white beam
  const incomingStart = new THREE.Vector3(-5, 0, 0);
  const incomingEnd = new THREE.Vector3(-0.5, 0, 0);
  
  // Output beams (one per category)
  const categories = ['web', 'research', 'creative', 'tools'] as const;
  
  return (
    <group>
      {/* Ambient light */}
      <ambientLight intensity={0.2} />
      
      {/* Point light inside prism */}
      <pointLight position={[0, 0, 0]} intensity={1} color="#FFFFFF" />
      
      {/* Incoming white beam */}
      <LightBeam
        start={incomingStart}
        end={incomingEnd}
        color="#FFFFFF"
        animated={true}
      />
      
      {/* Central prism */}
      <Prism />
      
      {/* Output beams */}
      {categories.map((category) => {
        const angle = (categoryAngles[category] * Math.PI) / 180;
        const length = 5;
        const endPoint = new THREE.Vector3(
          0.5 + Math.cos(angle) * length,
          Math.sin(angle) * length,
          0
        );
        
        return (
          <group key={category}>
            <LightBeam
              start={new THREE.Vector3(0.5, 0, 0)}
              end={endPoint}
              color={categoryColors[category]}
              onClick={() => onSelectCategory(category)}
            />
            
            {/* Category label */}
            <mesh
              position={[endPoint.x + 0.5, endPoint.y, 0]}
              onPointerOver={() => setHoveredCategory(category)}
              onPointerOut={() => setHoveredCategory(null)}
              onClick={() => onSelectCategory(category)}
            >
              <sphereGeometry args={[0.3, 32, 32]} />
              <meshStandardMaterial
                color={categoryColors[category]}
                emissive={categoryColors[category]}
                emissiveIntensity={hoveredCategory === category ? 0.8 : 0.3}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
```

---

## File 5: Project Modal

**File:** `src/components/dom/ProjectModal.tsx`

```tsx
'use client'

import { useEffect } from 'react';
import { projects, type Project } from '@/data/projects';

interface ProjectModalProps {
  category: string | null;
  onClose: () => void;
}

export default function ProjectModal({ category, onClose }: ProjectModalProps) {
  const filteredProjects = category
    ? projects.filter(p => p.category === category)
    : [];
  
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);
  
  if (!category) return null;
  
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      
      {/* Modal */}
      <div
        className="relative bg-[var(--event-horizon)] rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--tungsten-gray)] hover:text-[var(--photon-white)]"
        >
          ✕
        </button>
        
        {/* Title */}
        <h2 className="font-heading text-3xl text-[var(--photon-white)] mb-6 capitalize">
          {category} Projects
        </h2>
        
        {/* Project list */}
        <div className="space-y-6">
          {filteredProjects.map(project => (
            <div
              key={project.id}
              className="p-6 bg-[var(--void-black)] rounded-xl"
            >
              <h3 className="font-heading text-xl text-[var(--photon-white)] mb-2">
                {project.title}
              </h3>
              <p className="text-[var(--tungsten-gray)] mb-4">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs rounded-full bg-[var(--event-horizon)] text-[var(--tungsten-gray)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {(project.link || project.github) && (
                <div className="flex gap-4 mt-4">
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--terminal-cyan)] hover:underline"
                    >
                      View Project →
                    </a>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--tungsten-gray)] hover:underline"
                    >
                      GitHub
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## Phase 10 Checklist

- [ ] `src/data/projects.ts` — Project data
- [ ] `src/components/canvas/LightBeam.tsx` — Beam geometry
- [ ] `src/components/canvas/Prism.tsx` — Central prism
- [ ] `src/components/canvas/BeamSplitter.tsx` — Complete scene
- [ ] `src/components/dom/ProjectModal.tsx` — Project details
- [ ] Beams animate and glow
- [ ] Clicking beam opens modal
- [ ] Projects filter by category

---

## Phase 10 Resources

| Topic | Resource |
|-------|----------|
| TubeGeometry | [Three.js TubeGeometry](https://threejs.org/docs/#api/en/geometries/TubeGeometry) |
| Additive Blending | [Three.js Blending](https://threejs.org/docs/#api/en/constants/Materials) |
| MeshPhysicalMaterial | [Three.js Physical Material](https://threejs.org/docs/#api/en/materials/MeshPhysicalMaterial) |
| ExtrudeGeometry | [Three.js ExtrudeGeometry](https://threejs.org/docs/#api/en/geometries/ExtrudeGeometry) |
| React Portals | [React Portals](https://react.dev/reference/react-dom/createPortal) |

---

# Phase 11: Archive/Blogs

## What This Phase Accomplishes

This phase creates a **blog/archive system** using MDX:

- Write blog posts in Markdown with React components
- Automatic routing for each post
- Syntax highlighting for code blocks
- Reading time estimation
- Tags and categories

**Why MDX?**
MDX = Markdown + JSX. You can embed React components in Markdown files, perfect for technical blogs.

---

## Prerequisites for Phase 11

### Understanding MDX

MDX lets you write Markdown with embedded React:

```mdx
# My Blog Post

Regular markdown paragraph.

<CustomAlert type="warning">
  This is a React component inside Markdown!
</CustomAlert>

## Code Example

```javascript
const hello = "world";
```

<InteractiveDemo />
```

### Understanding Next.js App Router with MDX

Next.js 13+ can render MDX files as pages. With the right configuration, a file at `content/posts/my-post.mdx` becomes accessible at `/blog/my-post`.

---

## File Structure for Phase 11

```
src/
├── app/
│   └── blog/
│       ├── page.tsx           # Blog listing page
│       └── [slug]/
│           └── page.tsx       # Individual blog post
├── components/
│   └── mdx/
│       ├── MDXComponents.tsx  # Custom MDX components
│       ├── CodeBlock.tsx      # Syntax highlighting
│       └── BlogCard.tsx       # Post preview card
├── lib/
│   └── mdx.ts                 # MDX utilities
content/
└── posts/
    ├── first-post.mdx         # Blog posts live here
    └── quantum-intro.mdx
```

---

## Step 1: Install Dependencies

```bash
npm install next-mdx-remote gray-matter reading-time rehype-highlight rehype-slug
```

| Package | Purpose |
|---------|---------|
| `next-mdx-remote` | Render MDX on server and client |
| `gray-matter` | Parse frontmatter (metadata) from MDX |
| `reading-time` | Estimate reading time |
| `rehype-highlight` | Syntax highlighting for code |
| `rehype-slug` | Add IDs to headings for linking |

---

## File 1: MDX Utilities

**File:** `src/lib/mdx.ts`

```typescript
/* ============================================================
   MDX UTILITIES
   
   Functions for loading and parsing MDX blog posts.
   ============================================================ */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

// === TYPES ===

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  readingTime: string;
  published: boolean;
}

export interface Post extends PostMeta {
  content: string;  // Raw MDX content
}

// === PATHS ===

const POSTS_DIR = path.join(process.cwd(), 'content/posts');
/*
   process.cwd() = Current working directory (project root)
   We store posts in /content/posts/ at the project root
*/

// === FUNCTIONS ===

/**
 * Get all post slugs (for static generation)
 */
export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) {
    return [];
  }
  
  return fs
    .readdirSync(POSTS_DIR)
    .filter(file => file.endsWith('.mdx'))
    .map(file => file.replace('.mdx', ''));
}
/*
   readdirSync: Read directory contents synchronously
   filter: Only .mdx files
   map: Remove extension to get slug
   
   "my-post.mdx" → "my-post"
*/

/**
 * Get metadata for all posts (for listing page)
 */
export function getAllPostsMeta(): PostMeta[] {
  const slugs = getAllPostSlugs();
  
  const posts = slugs
    .map(slug => getPostBySlug(slug))
    .filter(post => post.published)  // Only published posts
    .sort((a, b) => {
      // Sort by date, newest first
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  
  return posts.map(({ content, ...meta }) => meta);
}

/**
 * Get a single post by slug
 */
export function getPostBySlug(slug: string): Post {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  
  // Parse frontmatter
  const { data, content } = matter(fileContents);
  /*
     gray-matter parses YAML frontmatter:
     
     ---
     title: "My Post"
     date: "2024-01-15"
     ---
     
     Content here...
     
     Returns:
     - data: { title: "My Post", date: "2024-01-15" }
     - content: "Content here..."
  */
  
  // Calculate reading time
  const { text: readTime } = readingTime(content);
  
  return {
    slug,
    title: data.title || 'Untitled',
    description: data.description || '',
    date: data.date || new Date().toISOString(),
    tags: data.tags || [],
    readingTime: readTime,
    published: data.published !== false,  // Default to true
    content,
  };
}

/**
 * Get posts by tag
 */
export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPostsMeta().filter(post => 
    post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  );
}

/**
 * Get all unique tags
 */
export function getAllTags(): string[] {
  const posts = getAllPostsMeta();
  const tags = posts.flatMap(post => post.tags);
  return [...new Set(tags)];  // Remove duplicates
}
```

---

## File 2: Custom MDX Components

**File:** `src/components/mdx/MDXComponents.tsx`

```tsx
/* ============================================================
   CUSTOM MDX COMPONENTS
   
   These components replace default HTML elements in MDX.
   Also includes custom components you can use in posts.
   ============================================================ */

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
```

---

## File 3: Code Block with Syntax Highlighting

**File:** `src/components/mdx/CodeBlock.tsx`

```tsx
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
```

---

## File 4: Blog Card Component

**File:** `src/components/mdx/BlogCard.tsx`

```tsx
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
```

---

## File 5: Blog Listing Page

**File:** `src/app/blog/page.tsx`

```tsx
/* ============================================================
   BLOG LISTING PAGE
   
   Shows all published blog posts.
   ============================================================ */

import { getAllPostsMeta } from '@/lib/mdx';
import BlogCard from '@/components/mdx/BlogCard';

export const metadata = {
  title: 'Blog | Your Name',
  description: 'Thoughts on physics, programming, and philosophy.',
};

export default function BlogPage() {
  const posts = getAllPostsMeta();
  
  return (
    <main className="min-h-screen py-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <span className="text-[var(--terminal-cyan)] text-sm font-mono uppercase tracking-widest mb-4 block">
            Archive
          </span>
          <h1 className="font-heading text-5xl md:text-6xl text-[var(--photon-white)] mb-4">
            Blog
          </h1>
          <p className="text-xl text-[var(--tungsten-gray)]">
            Thoughts, tutorials, and explorations.
          </p>
        </div>
        
        {/* Posts grid */}
        <div className="space-y-6">
          {posts.length > 0 ? (
            posts.map(post => (
              <BlogCard key={post.slug} post={post} />
            ))
          ) : (
            <p className="text-[var(--tungsten-gray)]">
              No posts yet. Check back soon!
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
```

---

## File 6: Individual Blog Post Page

**File:** `src/app/blog/[slug]/page.tsx`

```tsx
/* ============================================================
   INDIVIDUAL BLOG POST PAGE
   
   Renders a single MDX blog post.
   ============================================================ */

import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getAllPostSlugs, getPostBySlug } from '@/lib/mdx';
import { mdxComponents } from '@/components/mdx/MDXComponents';

// === STATIC GENERATION ===

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map(slug => ({ slug }));
}
/*
   generateStaticParams tells Next.js which pages to pre-render.
   It runs at build time and generates a page for each slug.
*/

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  
  return {
    title: `${post.title} | Blog`,
    description: post.description,
  };
}

// === PAGE COMPONENT ===

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  
  if (!post.published) {
    notFound();
  }
  
  return (
    <main className="min-h-screen py-20 px-6">
      <article className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="mb-12">
          {/* Back link */}
          <a 
            href="/blog" 
            className="text-[var(--tungsten-gray)] hover:text-[var(--photon-white)] mb-8 inline-block"
          >
            ← Back to Blog
          </a>
          
          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-[var(--tungsten-gray)] mb-4">
            <time>{new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}</time>
            <span>•</span>
            <span>{post.readingTime}</span>
          </div>
          
          {/* Title */}
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-[var(--photon-white)] mb-6">
            {post.title}
          </h1>
          
          {/* Description */}
          <p className="text-xl text-[var(--tungsten-gray)]">
            {post.description}
          </p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-6">
            {post.tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 text-sm rounded-full bg-[var(--event-horizon)] text-[var(--tungsten-gray)]"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>
        
        {/* Content */}
        <div className="prose prose-invert max-w-none">
          <MDXRemote 
            source={post.content} 
            components={mdxComponents}
          />
        </div>
      </article>
    </main>
  );
}
```

---

## Example Blog Post

**File:** `content/posts/hello-world.mdx`

```mdx
---
title: "Hello, Universe"
description: "My first blog post about starting this portfolio."
date: "2024-01-15"
tags: ["meta", "introduction"]
published: true
---

# Welcome

This is my first blog post on this portfolio. I built this site using:

- **Next.js 14** for the framework
- **Three.js** for 3D graphics
- **GSAP** for animations
- **MDX** for this blog

<Alert type="info">
This is a custom Alert component embedded in MDX!
</Alert>

## Why I Built This

I wanted a portfolio that reflects my interests in physics and programming...

<Callout emoji="🔬">
The particle system in the background simulates Brownian motion!
</Callout>

## Code Example

Here's how the particle physics works:

```typescript
// Apply Brownian motion
particle.velocity.x += (Math.random() - 0.5) * 0.002;
particle.velocity.y += (Math.random() - 0.5) * 0.002;
```

Thanks for reading!
```

---

## Phase 11 Resources

| Topic | Resource |
|-------|----------|
| MDX | [MDX Documentation](https://mdxjs.com/) |
| next-mdx-remote | [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote) |
| gray-matter | [gray-matter](https://github.com/jonschlinkert/gray-matter) |
| rehype-highlight | [rehype-highlight](https://github.com/rehypejs/rehype-highlight) |
| Next.js Dynamic Routes | [Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes) |

---

# Phase 12: Contact Section

## What This Phase Accomplishes

This phase creates the **contact section** with:

- Social media links with icons
- Optional contact form
- Email link with copy-to-clipboard
- Animated hover effects

---

## Prerequisites for Phase 12

### Understanding Lucide React Icons

Lucide is a modern icon library:

```tsx
import { Github, Linkedin, Mail, Twitter } from 'lucide-react';

<Github size={24} className="text-white" />
<Mail size={24} strokeWidth={1.5} />
```

### Form Handling Options

| Option | Pros | Cons |
|--------|------|------|
| Formspree | No backend needed | Limited free tier |
| EmailJS | Client-side only | Requires setup |
| API Route | Full control | Need email service |
| mailto: link | Simplest | Opens email client |

---

## File Structure for Phase 12

```
src/
├── components/
│   └── dom/
│       ├── Contact.tsx        # Main contact section
│       ├── SocialLinks.tsx    # Social media icons
│       └── ContactForm.tsx    # Optional form
├── data/
│   └── content.ts             # Already has socialLinks
```

---

## File 1: Social Links Component

**File:** `src/components/dom/SocialLinks.tsx`

```tsx
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
const iconMap: Record<string, React.ComponentType<any>> = {
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
    <div className="flex flex-wrap gap-6">
      {socialLinks.map(link => {
        const IconComponent = iconMap[link.icon] || ExternalLink;
        const isEmail = link.url.startsWith('mailto:');
        
        return (
          <div key={link.name} className="relative group">
            {isEmail ? (
              // Email with copy functionality
              <button
                onClick={() => copyEmail(link.url)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--event-horizon)] hover:bg-[var(--event-horizon)]/80 transition-all group"
              >
                <IconComponent 
                  size={24} 
                  className="text-[var(--tungsten-gray)] group-hover:text-[var(--terminal-cyan)] transition-colors"
                />
                <span className="text-[var(--photon-white)]">{link.name}</span>
                {copiedEmail ? (
                  <Check size={16} className="text-green-500" />
                ) : (
                  <Copy size={16} className="text-[var(--tungsten-gray)] opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </button>
            ) : (
              // Regular link
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--event-horizon)] hover:bg-[var(--event-horizon)]/80 transition-all group"
              >
                <IconComponent 
                  size={24} 
                  className="text-[var(--tungsten-gray)] group-hover:text-[var(--terminal-cyan)] transition-colors"
                />
                <span className="text-[var(--photon-white)]">{link.name}</span>
                <ExternalLink 
                  size={16} 
                  className="text-[var(--tungsten-gray)] opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}
```

---

## File 2: Contact Form Component (Optional)

**File:** `src/components/dom/ContactForm.tsx`

```tsx
'use client'

import { useState, FormEvent } from 'react';
import { Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      // Option 1: Formspree (replace with your form ID)
      const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error('Failed to send');
      }
    } catch (error) {
      setStatus('error');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
      {/* Name field */}
      <div>
        <label 
          htmlFor="name" 
          className="block text-sm font-mono text-[var(--tungsten-gray)] mb-2"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-4 py-3 rounded-xl bg-[var(--void-black)] border border-[var(--tungsten-gray)]/30 text-[var(--photon-white)] focus:border-[var(--terminal-cyan)] focus:outline-none transition-colors"
          placeholder="Your name"
        />
      </div>
      
      {/* Email field */}
      <div>
        <label 
          htmlFor="email" 
          className="block text-sm font-mono text-[var(--tungsten-gray)] mb-2"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          required
          value={formData.email}
          onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className="w-full px-4 py-3 rounded-xl bg-[var(--void-black)] border border-[var(--tungsten-gray)]/30 text-[var(--photon-white)] focus:border-[var(--terminal-cyan)] focus:outline-none transition-colors"
          placeholder="your@email.com"
        />
      </div>
      
      {/* Message field */}
      <div>
        <label 
          htmlFor="message" 
          className="block text-sm font-mono text-[var(--tungsten-gray)] mb-2"
        >
          Message
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={formData.message}
          onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
          className="w-full px-4 py-3 rounded-xl bg-[var(--void-black)] border border-[var(--tungsten-gray)]/30 text-[var(--photon-white)] focus:border-[var(--terminal-cyan)] focus:outline-none transition-colors resize-none"
          placeholder="Your message..."
        />
      </div>
      
      {/* Submit button */}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--terminal-cyan)] text-[var(--void-black)] font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        {status === 'loading' ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send size={20} />
            Send Message
          </>
        )}
      </button>
      
      {/* Status messages */}
      {status === 'success' && (
        <div className="flex items-center gap-2 text-green-500">
          <CheckCircle size={20} />
          Message sent successfully!
        </div>
      )}
      
      {status === 'error' && (
        <div className="flex items-center gap-2 text-red-500">
          <AlertCircle size={20} />
          Failed to send. Please try again.
        </div>
      )}
    </form>
  );
}
```

---

## File 3: Contact Section

**File:** `src/components/dom/Contact.tsx`

```tsx
'use client'

import SectionWrapper from './SectionWrapper';
import SocialLinks from './SocialLinks';
import ContactForm from './ContactForm';
import { personalInfo } from '@/data/content';

export default function Contact() {
  return (
    <SectionWrapper id="contact" animation="fade-up">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <span className="animate-item text-[var(--terminal-cyan)] text-sm font-mono uppercase tracking-widest mb-4 block">
          Get in Touch
        </span>
        
        <h2 className="animate-item font-heading text-5xl md:text-6xl text-[var(--photon-white)] mb-6">
          Contact
        </h2>
        
        <p className="animate-item text-xl text-[var(--tungsten-gray)] mb-12 max-w-2xl">
          Have a question or want to collaborate? Feel free to reach out through any of these channels.
        </p>
        
        {/* Social Links */}
        <div className="animate-item mb-16">
          <h3 className="text-sm font-mono uppercase tracking-widest text-[var(--tungsten-gray)] mb-6">
            Connect
          </h3>
          <SocialLinks />
        </div>
        
        {/* Contact Form (optional) */}
        <div className="animate-item">
          <h3 className="text-sm font-mono uppercase tracking-widest text-[var(--tungsten-gray)] mb-6">
            Or Send a Message
          </h3>
          <ContactForm />
        </div>
        
        {/* Location */}
        <div className="animate-item mt-16 pt-8 border-t border-[var(--tungsten-gray)]/20">
          <p className="text-[var(--tungsten-gray)]">
            Based in {personalInfo.location}
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}
```

---

## Phase 12 Resources

| Topic | Resource |
|-------|----------|
| Lucide Icons | [Lucide React](https://lucide.dev/guide/packages/lucide-react) |
| Formspree | [Formspree](https://formspree.io/) |
| Form Validation | [React Hook Form](https://react-hook-form.com/) |
| Clipboard API | [MDN Clipboard](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText) |

---

# Phase 13: Polish & Deployment

## What This Phase Accomplishes

The final phase focuses on:

1. **Performance Optimization** — Faster load times
2. **Simple Mode Fallback** — For low-end devices
3. **SEO Metadata** — Better search visibility
4. **Accessibility** — Screen reader support
5. **Deployment** — Go live on Vercel

---

## Part 1: Performance Optimization

### 1.1 Lazy Loading 3D Components

Only load 3D content when needed:

```tsx
// src/components/canvas/SceneWrapper.tsx
import dynamic from 'next/dynamic';

const Scene = dynamic(() => import('./Scene'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-[var(--void-black)] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[var(--terminal-cyan)] border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});
```

### 1.2 Optimize Images

Use Next.js Image component with proper sizing:

```tsx
import Image from 'next/image';

<Image
  src="/images/project.png"
  alt="Project screenshot"
  width={800}
  height={600}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."  // Tiny base64 placeholder
  priority={false}  // Only true for above-the-fold images
/>
```

### 1.3 Reduce Bundle Size

Check bundle size and remove unused code:

```bash
# Analyze bundle
npm run build
npx @next/bundle-analyzer
```

### 1.4 Optimize Three.js

```tsx
// Use low-poly geometries
<sphereGeometry args={[0.03, 8, 8]} />  // 8 segments, not 32

// Dispose of resources
useEffect(() => {
  return () => {
    geometry.dispose();
    material.dispose();
  };
}, []);

// Use instancing (already done in Hero.tsx)
<instancedMesh args={[undefined, undefined, 800]} />
```

---

## Part 2: Simple Mode Fallback

### 2.1 Update the Store

**File:** `src/store/useStore.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  isSimpleMode: boolean;
  toggleSimpleMode: () => void;
  setSimpleMode: (value: boolean) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      isSimpleMode: false,
      toggleSimpleMode: () => set((state) => ({ isSimpleMode: !state.isSimpleMode })),
      setSimpleMode: (value) => set({ isSimpleMode: value }),
    }),
    {
      name: 'portfolio-settings',  // localStorage key
    }
  )
);
```

### 2.2 Auto-Detect Low Performance

**File:** `src/hooks/usePerformanceCheck.ts`

```typescript
'use client'

import { useEffect } from 'react';
import { useStore } from '@/store/useStore';

export function usePerformanceCheck() {
  const setSimpleMode = useStore(state => state.setSimpleMode);
  
  useEffect(() => {
    // Check for low-end device indicators
    const isLowEnd = 
      // Low memory
      (navigator as any).deviceMemory < 4 ||
      // Slow connection
      (navigator as any).connection?.effectiveType === '2g' ||
      // Prefers reduced motion
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      // Mobile device
      /Android|iPhone|iPad|iPod|Opera Mini/i.test(navigator.userAgent);
    
    if (isLowEnd) {
      setSimpleMode(true);
    }
  }, [setSimpleMode]);
}
```

### 2.3 Conditional 3D Rendering

**File:** `src/components/canvas/SceneWrapper.tsx`

```tsx
'use client'

import dynamic from 'next/dynamic';
import { useStore } from '@/store/useStore';

const Scene = dynamic(() => import('./Scene'), { ssr: false });

export default function SceneWrapper() {
  const isSimpleMode = useStore(state => state.isSimpleMode);
  
  // Don't render 3D in simple mode
  if (isSimpleMode) {
    return (
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[var(--void-black)] to-[var(--event-horizon)]" />
    );
  }
  
  return <Scene />;
}
```

### 2.4 Simple Mode Toggle

**File:** `src/components/dom/SimpleModeToggle.tsx`

```tsx
'use client'

import { useStore } from '@/store/useStore';
import { Sparkles, SparklesOff } from 'lucide-react';

export default function SimpleModeToggle() {
  const { isSimpleMode, toggleSimpleMode } = useStore();
  
  return (
    <button
      onClick={toggleSimpleMode}
      className="fixed bottom-4 right-4 p-3 rounded-full bg-[var(--event-horizon)] hover:bg-[var(--event-horizon)]/80 transition-colors z-50"
      aria-label={isSimpleMode ? 'Enable 3D effects' : 'Disable 3D effects'}
      title={isSimpleMode ? 'Enable 3D effects' : 'Disable 3D effects'}
    >
      {isSimpleMode ? (
        <SparklesOff size={20} className="text-[var(--tungsten-gray)]" />
      ) : (
        <Sparkles size={20} className="text-[var(--terminal-cyan)]" />
      )}
    </button>
  );
}
```

---

## Part 3: SEO Metadata

### 3.1 Root Layout Metadata

**File:** `src/app/layout.tsx`

```tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Your Name | Portfolio',
    template: '%s | Your Name',
  },
  description: 'Physicist, developer, and philosopher exploring the intersection of science and code.',
  keywords: ['portfolio', 'developer', 'physicist', 'web development', 'three.js'],
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name',
  
  // Open Graph (Facebook, LinkedIn)
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yoursite.com',
    siteName: 'Your Name Portfolio',
    title: 'Your Name | Portfolio',
    description: 'Physicist, developer, and philosopher.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Your Name Portfolio',
      },
    ],
  },
  
  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'Your Name | Portfolio',
    description: 'Physicist, developer, and philosopher.',
    images: ['/og-image.png'],
    creator: '@yourusername',
  },
  
  // Icons
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  
  // Robots
  robots: {
    index: true,
    follow: true,
  },
};
```

### 3.2 Create OG Image

Create a 1200×630 image at `/public/og-image.png` for social sharing.

### 3.3 Add Structured Data

**File:** `src/app/layout.tsx` (add to body)

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Your Name',
      url: 'https://yoursite.com',
      jobTitle: 'Physicist & Developer',
      sameAs: [
        'https://github.com/yourusername',
        'https://linkedin.com/in/yourusername',
        'https://twitter.com/yourusername',
      ],
    }),
  }}
/>
```

---

## Part 4: Accessibility

### 4.1 Skip to Content Link

**File:** `src/app/layout.tsx`

```tsx
<body>
  <a 
    href="#main-content" 
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--terminal-cyan)] focus:text-[var(--void-black)] focus:rounded"
  >
    Skip to content
  </a>
  
  {/* ... rest of layout */}
  
  <main id="main-content">
    {children}
  </main>
</body>
```

### 4.2 Focus Styles

**File:** `src/app/globals.css`

```css
/* Custom focus ring for accessibility */
*:focus-visible {
  outline: 2px solid var(--terminal-cyan);
  outline-offset: 2px;
}

/* Hide focus ring for mouse users */
*:focus:not(:focus-visible) {
  outline: none;
}
```

### 4.3 ARIA Labels

```tsx
// For icon-only buttons
<button aria-label="Close menu">
  <XIcon />
</button>

// For decorative images
<Image alt="" role="presentation" />

// For live regions
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>
```

---

## Part 5: Deployment to Vercel

### 5.1 Prepare for Deployment

```bash
# Build locally first to catch errors
npm run build

# Check for TypeScript errors
npx tsc --noEmit

# Check for lint errors
npm run lint
```

### 5.2 Environment Variables

Create `.env.local` for local development and add to Vercel:

```env
# Example
NEXT_PUBLIC_SITE_URL=https://yoursite.com
FORMSPREE_ENDPOINT=https://formspree.io/f/xxxxx
```

### 5.3 Deploy to Vercel

**Option A: GitHub Integration (Recommended)**

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel auto-detects Next.js settings
6. Click "Deploy"

**Option B: Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### 5.4 Custom Domain

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your domain
4. Update DNS records as instructed

### 5.5 Post-Deployment Checklist

- [ ] All pages load correctly
- [ ] 3D effects work
- [ ] Simple mode fallback works
- [ ] Forms submit successfully
- [ ] Images load properly
- [ ] Fonts load correctly
- [ ] No console errors
- [ ] Mobile responsive
- [ ] OG images show when shared
- [ ] Analytics connected (optional)

---

## Phase 13 Resources

| Topic | Resource |
|-------|----------|
| Next.js Optimization | [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing) |
| Vercel Deployment | [Vercel Docs](https://vercel.com/docs) |
| Web Vitals | [web.dev Vitals](https://web.dev/vitals/) |
| Lighthouse | [Lighthouse](https://developers.google.com/web/tools/lighthouse) |
| Accessibility | [a11y Project](https://www.a11yproject.com/) |
| Schema.org | [Schema.org](https://schema.org/) |
| Open Graph | [Open Graph Protocol](https://ogp.me/) |

---

# 🎉 Congratulations!

You've completed the entire portfolio build guide. Your portfolio now includes:

- ✅ **Phase 1**: Foundation (colors, fonts, state)
- ✅ **Phase 2**: Intro animation
- ✅ **Phase 3**: 3D particle system
- ✅ **Phase 4-5**: Content sections (WhoAmI, CV)
- ✅ **Phase 6**: Worldline timeline
- ✅ **Phase 7**: Interests manifold
- ✅ **Phase 8**: Section transitions
- ✅ **Phase 9**: Navigation
- ✅ **Phase 10**: Projects beam splitter
- ✅ **Phase 11**: Blog system
- ✅ **Phase 12**: Contact section
- ✅ **Phase 13**: Polish & deployment

---

# Learning Path (6 Weeks)

| Week | Focus | Deliverable |
|------|-------|-------------|
| 1 | React + Next.js + TypeScript | Understand codebase |
| 2 | Tailwind + Phase 1-2 | Foundation + Intro |
| 3 | Three.js + R3F + Phase 3 | Particles |
| 4 | GSAP ScrollTrigger + Phases 4-6 | Content sections |
| 5 | Rapier Physics + Phase 7 | Manifold |
| 6 | Phases 8-13 | Complete & deploy |

---

# Quick Command Reference

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Type check
npx tsc --noEmit

# Lint
npm run lint
```
