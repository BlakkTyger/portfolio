export interface InterestNode {
  id: string;
  label: string;
  description: string;
  category: 'science' | 'tech' | 'philosophy' | 'creative';
  size: number;  // 0.5 to 2.0 (relative importance/broadness)
  isHub?: boolean; // Major hub nodes
}

export interface InterestEdge {
  from: string;
  to: string;
  strength: number;  // 0 to 1 (connection strength = line thickness)
  description?: string;  // Description of the connection
}

// Hub nodes (large, central)
// Satellite nodes (smaller, connected to hubs)
export const nodes: InterestNode[] = [
  // === MAJOR HUBS ===
  { id: 'programming', label: 'Programming', description: 'The art of instructing machines', category: 'tech', size: 1.5, isHub: true },
  { id: 'physics', label: 'Physics', description: 'Understanding the fundamental laws of nature', category: 'science', size: 1.5, isHub: true },
  { id: 'philosophy', label: 'Philosophy', description: 'Questioning existence, knowledge, and meaning', category: 'philosophy', size: 1.5, isHub: true },
  
  // === AI/ML CLUSTER (connected to Programming) ===
  { id: 'ml', label: 'Machine Learning', description: 'Teaching machines to learn from data', category: 'tech', size: 1.1 },
  { id: 'cv', label: 'Computer Vision', description: 'Enabling machines to see and understand images', category: 'tech', size: 0.6 },
  { id: 'nlp', label: 'NLP', description: 'Processing and understanding human language', category: 'tech', size: 0.6 },
  { id: 'interp', label: 'Mech. Interp.', description: 'Understanding how neural networks think', category: 'tech', size: 0.5 },
  { id: 'gnn', label: 'Graph NNs', description: 'Learning on graph-structured data', category: 'tech', size: 0.5 },
  { id: 'pinn', label: 'PINNs', description: 'Neural networks guided by physical laws', category: 'tech', size: 0.5 },
  { id: 'agents', label: 'AI Agents', description: 'Autonomous systems that reason and act', category: 'tech', size: 0.5 },
  { id: 'web', label: 'Web Dev', description: 'Building experiences for the modern web', category: 'tech', size: 0.5 },
  
  // === QUANTUM CLUSTER (connected to Physics) ===
  { id: 'qc', label: 'Quantum Computing', description: 'Harnessing quantum mechanics for computation', category: 'science', size: 1.1 },
  { id: 'qalgos', label: 'Q. Algorithms', description: 'Algorithms exploiting quantum parallelism', category: 'science', size: 0.5 },
  { id: 'qml', label: 'Quantum ML', description: 'Machine learning on quantum computers', category: 'science', size: 0.5 },
  { id: 'qoptics', label: 'Q. Optics', description: 'Light at the quantum level', category: 'science', size: 0.5 },
  { id: 'qmaterials', label: 'Q. Materials', description: 'Materials with exotic quantum properties', category: 'science', size: 0.5 },
  { id: 'qec', label: 'Q. Error Corr.', description: 'Protecting quantum information from noise', category: 'science', size: 0.5 },
  { id: 'nanophotonics', label: 'Nanophotonics', description: 'Manipulating light at the nanoscale', category: 'science', size: 0.5 },
  
  // === PHILOSOPHY CLUSTER ===
  { id: 'nihilism', label: 'Nihilism', description: 'Confronting the absence of inherent meaning', category: 'philosophy', size: 0.6 },
  { id: 'absurdism', label: 'Absurdism', description: 'Embracing life despite its absurdity', category: 'philosophy', size: 0.6 },
  { id: 'consciousness', label: 'Consciousness', description: 'The hard problem of subjective experience', category: 'philosophy', size: 0.6 },
  { id: 'existentialism', label: 'Existentialism', description: 'Creating meaning through authentic existence', category: 'philosophy', size: 0.6 },
  
  // === CREATIVE ===
  { id: 'music', label: 'Music', description: 'Finding harmony in sound and rhythm', category: 'creative', size: 0.6 },
];

export const edges: InterestEdge[] = [
  // === Hub interconnections (thick lines) ===
  { from: 'programming', to: 'physics', strength: 0.7, description: 'Computational physics and simulation' },
  { from: 'physics', to: 'philosophy', strength: 0.6, description: 'Nature of reality and existence' },
  { from: 'programming', to: 'philosophy', strength: 0.4, description: 'Logic, abstraction, and meaning' },
  
  // === AI/ML to Programming hub ===
  { from: 'programming', to: 'ml', strength: 0.9, description: 'Implementing learning algorithms' },
  { from: 'programming', to: 'web', strength: 0.8, description: 'Building digital experiences' },
  { from: 'programming', to: 'agents', strength: 0.75, description: 'Autonomous reasoning systems' },
  { from: 'ml', to: 'cv', strength: 0.85, description: 'Visual understanding through CNNs' },
  { from: 'ml', to: 'nlp', strength: 0.85, description: 'Language models and transformers' },
  { from: 'ml', to: 'interp', strength: 0.7, description: 'Understanding neural network internals' },
  { from: 'ml', to: 'gnn', strength: 0.65, description: 'Learning on relational data' },
  { from: 'ml', to: 'pinn', strength: 0.7, description: 'Physics-constrained learning' },
  { from: 'agents', to: 'nlp', strength: 0.6, description: 'Language as the interface for agents' },
  { from: 'pinn', to: 'physics', strength: 0.8, description: 'Encoding physical laws in NNs' },
  
  // === Quantum to Physics hub ===
  { from: 'physics', to: 'qc', strength: 0.9, description: 'Quantum mechanics as computation' },
  { from: 'physics', to: 'qoptics', strength: 0.75, description: 'Photons and quantum states' },
  { from: 'physics', to: 'qmaterials', strength: 0.7, description: 'Exotic quantum properties' },
  { from: 'physics', to: 'nanophotonics', strength: 0.65, description: 'Light at nanoscale' },
  { from: 'qc', to: 'qalgos', strength: 0.85, description: 'Shor, Grover, and beyond' },
  { from: 'qc', to: 'qml', strength: 0.8, description: 'Quantum advantage for ML' },
  { from: 'qc', to: 'qec', strength: 0.75, description: 'Protecting fragile qubits' },
  { from: 'qml', to: 'ml', strength: 0.6, description: 'Classical-quantum hybrid models' },
  { from: 'qoptics', to: 'nanophotonics', strength: 0.7, description: 'Photonic quantum devices' },
  
  // === Philosophy cluster ===
  { from: 'philosophy', to: 'nihilism', strength: 0.8, description: 'Confronting meaninglessness' },
  { from: 'philosophy', to: 'absurdism', strength: 0.8, description: 'Embracing the absurd' },
  { from: 'philosophy', to: 'consciousness', strength: 0.85, description: 'The hard problem' },
  { from: 'philosophy', to: 'existentialism', strength: 0.75, description: 'Creating authentic meaning' },
  { from: 'nihilism', to: 'absurdism', strength: 0.7, description: 'From despair to rebellion' },
  { from: 'existentialism', to: 'absurdism', strength: 0.65, description: 'Camus meets Sartre' },
  
  // === Cross-domain connections ===
  { from: 'consciousness', to: 'qc', strength: 0.35, description: 'Quantum theories of mind' },
  { from: 'interp', to: 'consciousness', strength: 0.4, description: 'Are neural nets conscious?' },
  { from: 'music', to: 'philosophy', strength: 0.4, description: 'Art as meaning-making' },
  { from: 'music', to: 'physics', strength: 0.3, description: 'Harmony and wave physics' },
];

// Edge description lookup
export const getEdgeDescription = (from: string, to: string): string | undefined => {
  const edge = edges.find(e => 
    (e.from === from && e.to === to) || (e.from === to && e.to === from)
  );
  return edge?.description;
};

// Category colors
export const categoryColors: Record<string, string> = {
  science: '#8F00FF',    // violet
  tech: '#00FF9D',       // cyan
  philosophy: '#FFD700', // gold
  creative: '#FF6B6B',   // coral
};