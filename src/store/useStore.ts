import { create } from 'zustand';

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

interface UIState {
  isIntroComplete: boolean;
  isSimpleMode: boolean;
  currentSection: SectionName;
  isMobileMenuOpen: boolean;
  cameraPosition: [number, number, number];
  scrollProgress: number;
  activeProjectCategory: ProjectCategory;
  
  // ============ ACTIONS ============ 
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


export const useStore = create<UIState>((set) => ({  
  isIntroComplete: false,           // Intro hasn't played yet
  isSimpleMode: false,              // Start with full 3D
  currentSection: 'intro',          // Start at intro
  isMobileMenuOpen: false,          // Menu starts closed
  cameraPosition: [0, 0, 5],        // Camera starts at z=5
  scrollProgress: 0,                // Start at top
  activeProjectCategory: null,      // No filter initially
  
  // ============ ACTION IMPLEMENTATIONS ============
  
  setIntroComplete: (complete) => set({ 
    isIntroComplete: complete,
    // When intro completes, we're now in the 'hero' section
    currentSection: complete ? 'hero' : 'intro'
  }),
  
  toggleSimpleMode: () => set((state) => ({ 
    isSimpleMode: !state.isSimpleMode 
  })),
  
  setSection: (section) => set({ currentSection: section }),
  
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  
  setCameraPosition: (pos) => set({ cameraPosition: pos }),
  
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  
  setProjectCategory: (cat) => set({ activeProjectCategory: cat }),
}));


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