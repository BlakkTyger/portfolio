

I've read the full specification. Now I'll create a comprehensive development plan.

---

# Development Plan: "The Coherent State" Portfolio

## Overview

Based on [spec.md](cci:7://file:///home/blakktyger/Documents/BlakkTyger/Projects/portfolio/portfolio/docs/spec.md:0:0-0:0), the project has **4 main pages** and several interconnected 3D/DOM components. The current repo has basic scaffolding only.

---

# Part 1: Macroscopic Division & Sequence

| Order | Component/Page | Type | Dependencies |
|-------|----------------|------|--------------|
| **1** | Foundation & Design System | Setup | None |
| **2** | Pre-Landing Animation | DOM + GSAP | Foundation |
| **3** | Landing Page (Superposition) | 3D + DOM | Pre-Landing |
| **4** | WhoAmI: Detailed Section | DOM | Landing |
| **5** | WhoAmI: CV Section | DOM | Landing |
| **6** | Worldline Trajectory | 3D + DOM + ScrollTrigger | Landing |
| **7** | Interests Manifold | 3D + Physics + DOM | Worldline |
| **8** | Worldline→Manifold Transition | 3D Animation | Both above |
| **9** | Navigation System | DOM + Layout | All WhoAmI sections |
| **10** | Projects: Beam Splitter | 3D + DOM | Navigation |
| **11** | Archive/Blogs Page | DOM + MDX | Navigation |
| **12** | Contact Page | DOM | Navigation |
| **13** | Final Integration & Polish | All | Everything |

---

# Part 2: Detailed Plans Per Component

## Phase 1: Foundation & Design System

### 1.1 Update Global Styles ([globals.css](cci:7://file:///home/blakktyger/Documents/BlakkTyger/Projects/portfolio/portfolio/src/app/globals.css:0:0-0:0))

```css
/* Add full color palette */
:root {
  --void-black: #050505;
  --event-horizon: #121212;
  --spectral-violet: #8F00FF;
  --terminal-cyan: #00FF9D;
  --photon-white: #F0F0F0;
  --tungsten-gray: #888888;
}
```

### 1.2 Configure Fonts

**Files:** [src/app/layout.tsx](cci:7://file:///home/blakktyger/Documents/BlakkTyger/Projects/portfolio/portfolio/src/app/layout.tsx:0:0-0:0)

- Replace Geist with:
  - **Headers:** `Space Grotesk` or `Syncopate`
  - **Body:** `Satoshi` or `Inter`
  - **Code/UI:** `JetBrains Mono`
- Use `next/font/google` for optimization

### 1.3 Extend Zustand Store

**File:** [src/store/useStore.ts](cci:7://file:///home/blakktyger/Documents/BlakkTyger/Projects/portfolio/portfolio/src/store/useStore.ts:0:0-0:0)

```typescript
interface UIState {
  isSimpleMode: boolean;
  currentSection: 'hero' | 'whoami' | 'worldline' | 'manifold' | 'projects' | 'archive' | 'contact';
  cameraPosition: [number, number, number];
  activeProjectCategory: 'development' | 'research' | null;
  // Actions
  toggleSimpleMode: () => void;
  setSection: (section: string) => void;
  setCameraPosition: (pos: [number, number, number]) => void;
  setProjectCategory: (cat: 'development' | 'research' | null) => void;
}
```

### 1.4 Create Utility Files

**File:** `src/lib/utils.ts`
- `cn()` function (clsx + tailwind-merge)
- Math helpers for 3D (lerp, clamp, map range)

---

## Phase 2: Pre-Landing Animation

### 2.1 Create `HeroText.tsx`

**File:** `src/components/dom/HeroText.tsx`

**Implementation:**
1. Create full-screen overlay with `position: fixed`
2. Render two text elements: "Hello" and "Universe"
3. Use `useGSAP` hook from `@gsap/react`
4. **Animation timeline:**
   - `t=0`: "Hello" fades in with slight scale
   - `t=0.5s`: "Universe" fades in below
   - `t=1.5s`: Entire text group animates on curved pendulum path
     - `x: -40vw`
     - `rotation: -10deg`
     - `opacity: 0`
     - Use `ease: "power2.inOut"` for pendulum feel
5. `onComplete`: Set store state to reveal main content

### 2.2 State Management

- Add `isIntroComplete: boolean` to store
- Main page content renders after intro completes

---

## Phase 3: Landing Page (Superposition)

### 3.1 Update `Hero.tsx` (3D Particles)

**File:** `src/components/canvas/Hero.tsx`

**Implementation:**
1. **Setup:**
   - Use `useRef` for `InstancedMesh`
   - Create 1000+ particles using `BufferGeometry` with random positions
   
2. **Brownian Motion:**
   - In `useFrame`, add small random velocity changes
   - Apply dampening to prevent runaway speeds
   
3. **Mouse Interaction:**
   - Track normalized mouse position via `useThree`
   - Apply inverse-square attraction force toward cursor
   
4. **Click Shockwave:**
   - On click, calculate radial direction for each particle
   - Apply impulse force proportional to `1/distance²`
   - Add GSAP timeline for color flash

```typescript
// Core structure
function Hero() {
  const meshRef = useRef<InstancedMesh>(null);
  const mouse = useRef(new Vector2());
  const particles = useMemo(() => initParticles(1000), []);
  
  useFrame((state, delta) => {
    // Update particle positions with Brownian + attraction
  });
  
  return (
    <instancedMesh ref={meshRef} args={[null, null, 1000]}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshBasicMaterial color="#F0F0F0" />
    </instancedMesh>
  );
}
```

### 3.2 Create `HeroOverlay.tsx` (DOM Layer)

**File:** `src/components/dom/HeroOverlay.tsx`

**Implementation:**
1. Center "Himanshu Sharma" (small, non-bold)
2. Below: Large bold "Student" 
3. Below: Rotating role with clip-path animation

**Role Rotation Logic:**
```typescript
const roles = ["+ STUDENT", "+ PHYSICIST", "+ DEVELOPER"];
const [roleIndex, setRoleIndex] = useState(0);

// GSAP animation for clip-path swipe
useGSAP(() => {
  const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
  tl.to(".role-text", {
    clipPath: "inset(0 0 0 100%)",
    duration: 0.3,
    onComplete: () => setRoleIndex((i) => (i + 1) % roles.length)
  })
  .set(".role-text", { clipPath: "inset(0 100% 0 0)" })
  .to(".role-text", { clipPath: "inset(0 0 0 0)", duration: 0.3 });
}, []);
```

---

## Phase 4: WhoAmI Detailed Section

### 4.1 Create `WhoAmI.tsx`

**File:** `src/components/dom/WhoAmI.tsx`

- Biographical text content
- Photo/avatar (optional)
- Brief introduction paragraph
- Styled with Event Horizon background cards
- Smooth scroll-linked fade-in animations

---

## Phase 5: CV Section

### 5.1 Create `CV.tsx`

**File:** `src/components/dom/CV.tsx`

- Education timeline
- Skills grid
- Download CV button
- Use monospace font for technical data
- Minimal 3D—focus on readability

---

## Phase 6: Worldline Trajectory

### 6.1 Create `Worldline.tsx` (3D)

**File:** `src/components/canvas/Worldline.tsx`

**Implementation:**

1. **Camera Setup:**
   - Position camera at origin looking down +Z axis
   - Use `ScrollTrigger` to move camera forward on scroll

2. **Environment:**
   - Create procedural 3D grid using `LineSegments`
   - Shader for grid that can warp (Phase 2 transition)

3. **Event Markers:**
   - Array of milestone objects with `{year, title, description, type}`
   - **Phase 1 (School):** Render as `BoxGeometry` cubes, aligned to grid
   - **Phase 2 (College):** Morph to `TetrahedronGeometry`, floating with `Float` from drei

4. **Grid Warp Shader:**
```glsl
// Vertex shader - apply warp after graduation milestone
uniform float warpAmount;
vec3 pos = position;
pos.y += sin(pos.x * 2.0 + time) * warpAmount * 0.5;
pos.x += cos(pos.z * 2.0 + time) * warpAmount * 0.3;
gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
```

### 6.2 Create `WorldlineOverlay.tsx` (DOM)

**File:** `src/components/dom/WorldlineOverlay.tsx`

- Milestone info cards that appear as camera passes markers
- Phase 1: Serif typography, static
- Phase 2: Sans-serif with RGB glitch on hover (CSS filter or canvas effect)

---

## Phase 7: Interests Manifold

### 7.1 Create `Manifold.tsx` (3D Physics Graph)

**File:** `src/components/canvas/Manifold.tsx`

**Implementation:**

1. **Physics Setup:**
```typescript
import { Physics, RigidBody, useSpring } from '@react-three/rapier';

const nodes = [
  { id: 'quantum', label: 'Quantum Computing', connections: ['linear-algebra', 'physics'] },
  { id: 'ai', label: 'AI/ML', connections: ['linear-algebra', 'pytorch'] },
  // ... 15-20 nodes
];
```

2. **Force Simulation:**
   - **Repulsion:** Apply Coulomb-like force between all nodes in `useFrame`
   - **Springs:** Use Rapier spring joints for connected nodes
   
3. **Visual Style:**
   - Nodes: `MeshTransmissionMaterial` for glass effect
   - Edges: `Line` from drei with animated dash offset
   - Data packets: Small `Sphere` moving along edges using `lerp`

4. **Interaction:**
   - Use `useDrag` from `@use-gesture/react`
   - On drag: Apply force to RigidBody, network responds

### 7.2 Create `ManifoldOverlay.tsx`

**File:** `src/components/dom/ManifoldOverlay.tsx`

- Section title and instructions
- Selected node detail panel (shows on node click)

---

## Phase 8: Worldline → Manifold Transition

### 8.1 Transition Animation

**File:** `src/components/canvas/WorldlineToManifold.tsx`

**Sequence:**
1. Camera stops at "current day"
2. Event markers dissolve into particles (`PointsMaterial`)
3. Particles flow to center (GSAP `to` with stagger)
4. Flash/ignite effect
5. Particles snap to Manifold node positions
6. Grid fades to void black
7. Manifold physics activates

```typescript
const transitionTimeline = gsap.timeline({ paused: true });
transitionTimeline
  .to(markers, { scale: 0, opacity: 0, duration: 0.5, stagger: 0.05 })
  .to(particles, { x: 0, y: 0, z: 0, duration: 1, ease: "power2.in" })
  .call(() => activateManifold())
  .to(gridMaterial, { opacity: 0, duration: 0.5 }, "-=0.3");
```

---

## Phase 9: Navigation System

### 9.1 Create `Navbar.tsx`

**File:** `src/components/dom/Navbar.tsx`

**Implementation:**
- Fixed position (top or side based on viewport)
- Links: WhoAmI, Projects, Archive, Contact
- Active state indicator
- Monospace font (`JetBrains Mono`)
- Semi-transparent backdrop

### 9.2 Create `SmoothScroll.tsx`

**File:** `src/components/layout/SmoothScroll.tsx`

- GSAP ScrollSmoother or native CSS `scroll-behavior: smooth`
- ScrollTrigger setup for section-based animations

---

## Phase 10: Projects - Beam Splitter

### 10.1 Create Route

**File:** `src/app/work/page.tsx`

### 10.2 Create `Prism.tsx` (3D)

**File:** `src/components/canvas/Prism.tsx`

**Implementation:**

1. **Glass Cube:**
```typescript
<mesh>
  <boxGeometry args={[1, 1, 1]} />
  <MeshTransmissionMaterial
    backside
    samples={4}
    thickness={0.5}
    chromaticAberration={0.2}
    transmission={0.95}
  />
</mesh>
```

2. **Laser Beams:**
   - Input beam (white): `CylinderGeometry` horizontal
   - Output beams: Two cylinders (up + right), initially invisible
   
3. **State-Based Animation:**
   - `activeBeam: 'development' | 'research' | null`
   - On "DEVELOPMENT": Animate green beam appearing upward, camera pans down
   - On "RESEARCH": Animate violet beam appearing right, camera pans left

### 10.3 Create `ProjectGrid.tsx` (DOM)

**File:** `src/components/dom/ProjectGrid.tsx`

- 2-column CSS Grid
- Cards with: thumbnail, title, tech stack icons, description
- Border glow on hover (color matches active beam)
- Filter by category (development/research)

### 10.4 Project Data

**File:** `src/lib/projects.ts`

```typescript
export const projects = [
  {
    id: 'qec',
    title: 'Quantum Error Correction',
    category: 'research',
    stack: ['Python', 'Qiskit'],
    description: '...',
    thumbnail: '/projects/qec.png',
    link: '...'
  },
  // ...
];
```

---

## Phase 11: Archive/Blogs Page

### 11.1 Create Route

**File:** `src/app/blogs/page.tsx`

### 11.2 MDX Setup

- Install `@next/mdx` and configure in [next.config.ts](cci:7://file:///home/blakktyger/Documents/BlakkTyger/Projects/portfolio/portfolio/next.config.ts:0:0-0:0)
- Create `src/app/blogs/[slug]/page.tsx` for dynamic routes

### 11.3 Sections

**Competitions:**
- Static list or JSON-driven
- Card grid with event names, dates, descriptions

**Library (Books):**
- JSON file: `src/lib/books.json`
- Display as list with cover images

**Courses:**
- GitHub pinned repos (can use GitHub API or static list)
- Card with repo name, description, link

### 11.4 Layout

- Clean grid, minimal 3D
- Event Horizon colored cards
- Consistent typography

---

## Phase 12: Contact Page

### 12.1 Create Route

**File:** `src/app/contact/page.tsx`

### 12.2 Implementation

- Social links: GitHub, LinkedIn, Twitter, Email
- Icon buttons with hover effects
- Optional: Simple contact form (no backend needed—use Formspree or similar)
- Subtle background animation (reuse simplified particle effect)

---

## Phase 13: Final Integration & Polish

### 13.1 Performance Optimization
- Implement "Simple Mode" toggle that disables 3D
- Add `Suspense` boundaries with loading states
- Use `useIntersectionObserver` to pause off-screen animations
- Optimize Three.js: `dispose()` geometries, reduce draw calls

### 13.2 Accessibility
- Add `aria-labels` to interactive elements
- Keyboard navigation for 3D interactions
- Reduced motion media query support

### 13.3 SEO & Metadata
- Update [layout.tsx](cci:7://file:///home/blakktyger/Documents/BlakkTyger/Projects/portfolio/portfolio/src/app/layout.tsx:0:0-0:0) metadata
- Add OpenGraph images
- Create `robots.txt` and `sitemap.xml`

### 13.4 Responsive Design
- Test all breakpoints
- Adjust 3D camera for mobile
- Simplify complex animations on smaller screens

### 13.5 Testing & Deployment
- Cross-browser testing
- Lighthouse audit
- Deploy to Vercel

---

# Summary: File Creation Checklist

| File | Status |
|------|--------|
| `src/lib/utils.ts` | 🔴 Create |
| `src/lib/projects.ts` | 🔴 Create |
| `src/lib/books.json` | 🔴 Create |
| [src/store/useStore.ts](cci:7://file:///home/blakktyger/Documents/BlakkTyger/Projects/portfolio/portfolio/src/store/useStore.ts:0:0-0:0) | 🟡 Extend |
| [src/app/globals.css](cci:7://file:///home/blakktyger/Documents/BlakkTyger/Projects/portfolio/portfolio/src/app/globals.css:0:0-0:0) | 🟡 Extend |
| [src/app/layout.tsx](cci:7://file:///home/blakktyger/Documents/BlakkTyger/Projects/portfolio/portfolio/src/app/layout.tsx:0:0-0:0) | 🟡 Update fonts |
| [src/app/page.tsx](cci:7://file:///home/blakktyger/Documents/BlakkTyger/Projects/portfolio/portfolio/src/app/page.tsx:0:0-0:0) | 🟡 Restructure |
| `src/app/work/page.tsx` | 🔴 Create |
| `src/app/blogs/page.tsx` | 🔴 Create |
| `src/app/blogs/[slug]/page.tsx` | 🔴 Create |
| `src/app/contact/page.tsx` | 🔴 Create |
| `src/components/dom/HeroText.tsx` | 🔴 Create |
| `src/components/dom/HeroOverlay.tsx` | 🔴 Create |
| `src/components/dom/WhoAmI.tsx` | 🔴 Create |
| `src/components/dom/CV.tsx` | 🔴 Create |
| `src/components/dom/WorldlineOverlay.tsx` | 🔴 Create |
| `src/components/dom/ManifoldOverlay.tsx` | 🔴 Create |
| `src/components/dom/Navbar.tsx` | 🔴 Create |
| `src/components/dom/ProjectGrid.tsx` | 🔴 Create |
| `src/components/canvas/Hero.tsx` | 🔴 Create |
| `src/components/canvas/Worldline.tsx` | 🔴 Create |
| `src/components/canvas/Manifold.tsx` | 🔴 Create |
| `src/components/canvas/Prism.tsx` | 🔴 Create |
| `src/components/canvas/WorldlineToManifold.tsx` | 🔴 Create |
| `src/components/layout/SmoothScroll.tsx` | 🔴 Create |
