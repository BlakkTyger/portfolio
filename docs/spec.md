# Project Specification: The Coherent State

## 1\. Project Overview

**Title:** The Coherent State

**Type:** High-Performance Personal Portfolio & Research Showcase

**Core Metaphor:** The Lifecycle of Information. The user observes the site, collapsing "Probabilistic Interests" (Quantum Physics) into "Structured Knowledge" (AI/Graph) and finally "Concrete Output" (Projects/Prism).

**User Identity:** Himanshu Sharma (Physicist, Developer, Philosopher).

## 2\. Technical Stack

  * **Framework:** Next.js 14+ (App Router, TypeScript).
  * **Styling:** Tailwind CSS + `clsx` / `tailwind-merge`.
  * **3D Engine:** React Three Fiber (R3F) ecosystem:
      * `@react-three/fiber` (Renderer)
      * `@react-three/drei` (Helpers: Text, Float, OrbitControls, TransmissionMaterial)
      * `@react-three/rapier` (Physics for the "Manifold" graph)
  * **Animation:** GSAP (GreenSock) + `@gsap/react` (for DOM-based ScrollTriggers and timeline management).
  * **State Management:** Zustand (for global UI states like "Simple Mode" vs "3D Mode").
  * **Content:** MDX (Markdown + React components) for Blogs.
  * **Compiler:** React Compiler (Experimental) enabled via `next.config.mjs`.

## 3\. Design System

### 3.1 Color Palette

  * **Void Black:** `#050505` (Global Background)
  * **Event Horizon:** `#121212` (Card/Modal Backgrounds)
  * **Spectral Violet:** `#8F00FF` (Accent: Physics/Quantum context)
  * **Terminal Cyan:** `#00FF9D` (Accent: Code/AI context)
  * **Photon White:** `#F0F0F0` (Primary Text)
  * **Tungsten Gray:** `#888888` (Secondary Text / Metadata)

### 3.2 Typography

  * **Primary/Headers:** `Space Grotesk` or `Syncopate` (Futuristic, wide stance).
  * **Body/Content:** `Satoshi` or `Inter` (Clean geometric sans-serif).
  * **Code/UI Data:** `JetBrains Mono` (Monospaced, used for navigation and technical specs).

-----

## 4\. Architecture & File Structure

```text
/src
 ├── app
 │    ├── layout.tsx       # Root Layout (Fonts, Metadata)
 │    ├── page.tsx         # Main Scroll Container (Home)
 │    ├── work             # Dynamic Route for Projects
 │    └── blogs            # Dynamic Route for MDX Blogs
 ├── components
 │    ├── canvas           # CLIENT-SIDE ONLY (3D Scenes)
 │    │    ├── Scene.tsx   # <Canvas> Wrapper
 │    │    ├── SceneWrapper.tsx # Dynamic Import Boundary (Fixes SSR)
 │    │    ├── Hero.tsx    # Particle Cloud
 │    │    ├── Manifold.tsx# Physics Graph (Rapier)
 │    │    └── Prism.tsx   # Glass Beam Splitter
 │    ├── dom              # SERVER or CLIENT (HTML Overlays)
 │    │    ├── Navbar.tsx
 │    │    ├── HeroText.tsx
 │    │    └── ProjectCard.tsx
 │    └── layout           # Layout Wrappers
 │         └── SmoothScroll.tsx
 ├── store
 │    └── useStore.ts      # Zustand Store
 └── lib                   # Utils (Math helpers, formatting)
```

-----

## 5\. Detailed Component Specifications

### 5.0 Pre Landing Page Animation
"Hello, Universe" text appears and fills the whole page. "Hello" in one line and "Universe" in the other line. First, "Hello" and then "Universe" with an appropriate in-place annimation. The whole text,after 1 second lag animates along a curved path (pendulum motion) to the left using GSAP.

### 5.1 WhoAmI and Landing Page
All the subsections of this sections are arranged in a linear fasion and separated via scrolling, they are not separate subpages


#### 5.1.1 The Landing Page ("Superposition")

**Concept:** A void filled with potential. A particle cloud exists in a high-entropy state until the user interacts.

  * **DOM Element (`HeroText.tsx`):**
      * **Animation:** Center text "Himanshu Sharma" in small and non-bold font. Below it, in bold and heading font, "Student", and below that a rotating role descriptor: "+ STUDENT" -\> "+ PHYSICIST" -\> "+ DEVELOPER". Each change is accompanied by a `clip-path` swipe animation (Cyan color block).
  * **3D Element (`Hero.tsx`):**
      * **Particles:** Use `InstancedMesh` for 1,000+ particles (Based on the backend processing and rendering capabilities of vercel free version).
      * **Behavior:** Particles float in Brownian motion. On mouse move, they gently attract to the cursor (inverse square law).
      * **Click Event:** A "shockwave" effect pushes particles outward radially.

#### 5.1.2 A more detailed WhoAmI?

#### 5.1.3 CV

#### 5.1.2 The Worldline Trajectory

**The Concept:**
In relativity, a "worldline" is the unique path an object takes through 4D spacetime. This section treats your biography not as a static CV, but as a continuous trajectory. It tells the story of your evolution from a state of rigid, classical education to the probabilistic, complex world of quantum research. You are the particle, and the user is tracing your path through time.

**Design & Animation Execution:**
* **The Camera Fly-Through:**
    * The user does not scroll "down" a page; they scroll *forward* into the screen.
    * We use `GSAP ScrollTrigger` pinned to the Z-axis of the `Three.js` camera. As the scrollbar moves down, the camera advances at a constant velocity through the 3D void.
    * **Visual Metaphor:** The particle cloud from the landing page disperses, leaving a trail of "Event Markers" (your life milestones).

* **Phase 1: The Euclidean Past (School Era)**
    * **Background:** The 3D environment renders a faint, glowing 3D grid (Euclidean space). This represents the structured, deterministic environment of early education.
    * **Elements:** Milestones appear as floating, solid cubes on the left and right. They are rigid and perfectly aligned with the grid.
    * **Typography:** The text is serif, stable, and static.

* **Phase 2: The Non-Linear Present (College & Research)**
    * **The Warp:** As the camera passes the "Graduation" marker, the environment shifts. The rigid grid begins to warp and twist (using a vertex shader), mimicking gravitational lensing or a manifold.
    * **Elements:** The milestone markers are no longer cubes; they morph into floating, abstract shapes (tetrahedrons, fluid blobs). They don't sit on a grid; they float in superposition, bobbing slightly.
    * **Typography:** The text headers might "glitch" or separate into RGB channels slightly on hover, representing quantum uncertainty.

### 5.1.3 The Interests Section: The Mechanistic Manifold

**The Concept:**
Your interests—Quantum Computing, AI, Philosophy - are not isolated lists; they are a dense, interconnected neural topology. This section visualizes your brain's "latent space." It draws directly from **Mechanistic Interpretability**: we are opening the "black box" of your mind to show the user not just *what* you know, but *how* those concepts connect (e.g., how "Linear Algebra" feeds into both "Quantum State" and "Machine Learning").

**Design & Animation Execution:**
* **The Physics Simulation (`react-three-rapier`):**
    * We do not hard-code positions. We spawn 15-20 "Nodes" (spheres) and let a physics engine position them.
    * **Coulomb Repulsion:** Every node pushes every other node away. This prevents clutter.
    * **Hooke’s Law (Springs):** Related nodes (e.g., "PyTorch" and "AI") are tethered by invisible springs. They try to stay close.
    * **Result:** The graph feels "alive." It gently breathes and reorganizes itself if disturbed.

* **Visual Style:**
    * **Nodes:** Glass-like spheres with a glowing core.
    * **Edges:** Thin, pulsing lines that only appear when nodes are close enough or connected. Data "packets" (small glowing dots) travel along these lines, symbolizing active thought.
    * **Interaction:** This is a "toy" for the user. They can grab a node (like "Philosophy") and drag it. The entire network stretches and jiggles in response, demonstrating the elasticity of your knowledge.

##### The Transition: The Collapse

**Concept:**
How do we move from the *History* (Worldline) to the *Network* (Manifold)? The transition represents the realization that your past experiences (the timeline) have coalesced to form your current knowledge base (the graph).

**Animation Sequence:**
1.  **The Stop:** The camera reaches the end of the "Worldline" (current day) and slows to a halt.
2.  **The Dissolve:** The "Event Markers" from the timeline don't just disappear. They break apart into small glowing particles.
3.  **The Re-assembly:** These particles flow toward the center of the screen.
4.  **The Expansion:** Suddenly, the particles "ignite" and expand outward, snapping into the positions of the **Manifold Nodes**.
    * *Visual cue:* The background grid fades away completely into the "Void Black," leaving only the glowing, breathing network of your interests.
5.  **The Sidebar:** As the 3D graph stabilizes, the 2D HTML overlay for the "Interests" section (title and instructions) fades in smoothly.

Here is the simplified, high-usability version of the **"Beam Splitter"** section.

This version prioritizes **readability**. The 3D physics serves as the "Menu Selection" animation, but once a choice is made, the interface prioritizes a clean, stable reading experience.

Make all these subsections easily accessable 

### 5.4 The Projects Section: The Beam Splitter
This is a separate subpage which is accessed via the sidebar/topbar (whichever is better suited from a design perspective)
**The Concept:**
We use a **Beam Splitter** (a standard optical cube used in quantum experiments) as the navigation switch.
* **Input:** White Light (Your raw potential).
* **Output A (Reflected):** Computer Science (Green Light).
* **Output B (Transmitted):** Physics Research (Violet Light).


**Design & Animation Execution:**

* **The Apparatus (The 3D Trigger):**
    * **Visual:** A single, high-quality glass cube sits in the center of the screen. A white laser beam hits it from the left.
    * **The "Idle" State:** The beam hits the cube and scatters slightly inside, but doesn't exit yet. It waits for input.
    * **The Controls:** Two large, clear buttons at the bottom: **"DEVELOPMENT"** and **"RESEARCH"**.

* **The Interaction (The Split):**
    * **User Clicks "DEVELOPMENT":**
        * **3D Action:** The beam reflects 90° upwards. It turns **Electric Green**.
        * **Camera Move:** The camera smoothly pans down, leaving the beam splitter at the *top* of the screen (like a header), shining the green light down onto the page.
    * **User Clicks "RESEARCH":**
        * **3D Action:** The beam transmits straight through to the right. It turns **Spectral Violet**.
        * **Camera Move:** The camera pans left, leaving the beam splitter on the *left* side, shining violet light across the page background.

* **The Stable UI (The Project Display):**
    * **The Transition:** Once the beam "locks" into place, a standard HTML/CSS Grid fades in over the 3D background.
    * **The Background:** The 3D scene stays visible but is dimmed and blurred (`backdrop-filter: blur(10px)`), turning the laser light into a soft, colorful ambient glow behind the text.
    * **The Cards (Clean UX):**
        * Projects are displayed as a **2-column grid** of clean, rectangular cards.
        * **Card Style:** Minimalist, semi-transparent dark gray background (`rgba(20, 20, 20, 0.8)`).
        * **Content:**
            * **Left:** Project Thumbnail (static image or GIF).
            * **Right:** Title (e.g., "Quantum Error Correction"), Tech Stack (Icons), and a short 2-sentence description.
        * **Hover:** The card border glows faintly with the active beam color (Green or Violet).

### 5.5 The Archive (Miscellaneous & Blogs)
This is a separate subpage which is accessed via the sidebar/topbar (whichever is better suited from a design perspective)
**Concept:** The raw data repository.

  * **Layout:** A clean, grid-based layout. No heavy 3D here to ensure readability.
  * **Content:**
      * **Competitions:** List of PClub events organized.
      * **Library:** "Books I've Read" (API fetch or static JSON list).
      * **Courses:** Pinned GitHub repositories of the courses I've taken

### 5.6 Contact Page
This is a separate subpage which is accessed via the sidebar/topbar (whichever is better suited from a design perspective)

Contact page has links to my socials, email etc in case someone wants to connect

-----

## 6\. Implementation Guide for AI

*(Use these prompts to guide the AI in generating code)*

### Step 1: Global Setup

"Initialize the global Zustand store in `src/store/useStore.ts`. It should hold `isSimpleMode` (boolean), `currentSection` (string), and `cameraPosition` (Vector3)."

### Step 2: The Scene Wrapper (Crucial)

"Create `src/components/canvas/SceneWrapper.tsx`. It must be a 'use client' component. It dynamically imports `src/components/canvas/Scene.tsx` with `{ ssr: false }`. This is to prevent Next.js hydration errors with R3F."

### Step 3: The Pendulum Animation

"Create `src/components/dom/HeroText.tsx`. Use GSAP. On mount, render 'Hello, Universe' in the center. After 1s, animate it moving to `x: -40vw`, `rotation: -10deg`, and `opacity: 0.5`. It should act like a pendulum swinging out of frame."

### Step 4: The Prism Shader

"Create `src/components/canvas/Prism.tsx`. Use `@react-three/drei`'s `MeshTransmissionMaterial`. Create a layout with a `BoxGeometry` (the prism) and two `CylinderGeometry` objects (the laser beams). Pass a prop `activeBeam` ('physics' | 'code') that changes the emissive color of the cylinders."

### Step 5: The Manifold Graph

"Create `src/components/canvas/Manifold.tsx` using `@react-three/rapier`. Generate 10 random nodes (spheres). Connect them with `RapierRigidBody` and `RevoluteJoint` or simple spring constraints. The nodes should repel each other to form a self-organizing graph."