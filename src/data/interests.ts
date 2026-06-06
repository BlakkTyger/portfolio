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
  { id: 'programming', label: 'Programming', description: 'The unreasonable effectiveness of telling rocks to do math', category: 'tech', size: 1.5, isHub: true },
  { id: 'physics', label: 'Physics', description: 'Reality\'s source code : still poorly documented', category: 'science', size: 1.5, isHub: true },
  { id: 'philosophy', label: 'Philosophy', description: 'The discipline of asking questions that dissolve into harder questions', category: 'philosophy', size: 1.5, isHub: true },
 
  // === AI/ML CLUSTER ===
  { id: 'ml', label: 'Machine Learning', description: 'Gradient descent as a lifestyle', category: 'tech', size: 1.1 },
  { id: 'cv', label: 'Computer Vision', description: 'Forcing convolutions to care about raccoons', category: 'tech', size: 0.6 },
  { id: 'nlp', label: 'NLP', description: 'Statistical sorcery applied to human babble', category: 'tech', size: 0.6 },
  { id: 'interp', label: 'Mech. Interp.', description: 'Reverse-engineering the neural ghosts inside transformers', category: 'tech', size: 0.5 },
  { id: 'gnn', label: 'Graph NNs', description: 'When your data has the audacity to have structure', category: 'tech', size: 0.5 },
  { id: 'agents', label: 'AI Agents', description: 'Autonomous systems that reason, act, and occasionally hallucinate', category: 'tech', size: 0.5 },
 
  // === QUANTUM CLUSTER ===
  { id: 'qc', label: 'Quantum Computing', description: 'Superposition of "it works" and "it doesn\'t" until you measure', category: 'science', size: 1.1 },
  { id: 'qalgos', label: 'Quantum Algorithms', description: 'Shor, Grover, et al. : polynomial speedups and existential dread for cryptographers', category: 'science', size: 0.5 },
  { id: 'cQED', label: 'Cavity QED', description: 'Trapping photons in tiny mirrors until the atom confesses its quantum state', category: 'science', size: 0.5 },
  { id: 'qml', label: 'Quantum ML', description: 'Classical ML but with exponential Hilbert space and exponential headaches', category: 'science', size: 0.5 },
  { id: 'qoptics', label: 'Quantum Optics', description: 'Where photons stop being waves and start being weird', category: 'science', size: 0.5 },
  { id: 'nanophotonics', label: 'Nanophotonics', description: 'Bullying Maxwell\'s equations at sub-wavelength scales', category: 'science', size: 0.5 },
 
  // === PHILOSOPHY CLUSTER ===
  { id: 'nihilism', label: 'Nihilism', description: 'The vertigo of a universe indifferent to your pull requests', category: 'philosophy', size: 0.6 },
  { id: 'absurdism', label: 'Absurdism', description: 'Sisyphean defiance: one must imagine the optimizer happy', category: 'philosophy', size: 0.6 },
  { id: 'existentialism', label: 'Existentialism', description: 'Condemned to be free : and to choose your own tech stack', category: 'philosophy', size: 0.6 },
];
 
export const edges: InterestEdge[] = [
  // === Hub interconnections ===
  { from: 'programming', to: 'physics', strength: 0.7, description: 'Numerical simulation: where differential equations meet floating-point regret' },
  { from: 'physics', to: 'philosophy', strength: 0.6, description: 'Quantum mechanics broke ontology first; philosophy is still filing the incident report' },
  { from: 'programming', to: 'philosophy', strength: 0.4, description: 'Type theory, formal logic, and the haunting question of whether P = NP has meaning' },
 
  // === AI/ML to Programming hub ===
  { from: 'programming', to: 'ml', strength: 0.9, description: 'Backpropagation is just the chain rule wearing a GPU' },
  { from: 'programming', to: 'agents', strength: 0.75, description: 'Tool-calling LLMs in a while loop : welcome to agentic systems' },
  { from: 'ml', to: 'cv', strength: 0.85, description: 'Hierarchical feature extraction from pixels, all the way up to "it\'s a raccoon"' },
  { from: 'ml', to: 'nlp', strength: 0.85, description: 'Attention is all you need : and also terabytes of Common Crawl' },
  { from: 'ml', to: 'interp', strength: 0.7, description: 'Superposition, circuits, and the archaeology of learned representations' },
  { from: 'ml', to: 'gnn', strength: 0.65, description: 'Message passing on non-Euclidean domains where CNNs fear to tread' },
  { from: 'agents', to: 'nlp', strength: 0.6, description: 'Language as the universal API for reasoning and action' },
 
  // === Quantum to Physics hub ===
  { from: 'physics', to: 'qc', strength: 0.9, description: 'Quantum coherence as a computational resource : Feynman\'s revenge' },
  { from: 'physics', to: 'qoptics', strength: 0.75, description: 'Quantum electrodynamics distilled to photons, beam splitters, and wonder' },
  { from: 'physics', to: 'nanophotonics', strength: 0.65, description: 'Plasmonics and photonic crystals: light squeezed into geometries it finds objectionable' },
  { from: 'qc', to: 'qalgos', strength: 0.85, description: 'Shor factorises; Grover searches; both keep cryptographers up at night' },
  { from: 'qc', to: 'qml', strength: 0.8, description: 'Variational quantum circuits as parameterised ansätze : quantum gradient descent, basically' },
  { from: 'qml', to: 'ml', strength: 0.6, description: 'Hybrid classical–quantum models: outsource the hard parts to Hilbert space' },
  { from: 'qoptics', to: 'nanophotonics', strength: 0.7, description: 'Purcell enhancement, cavity modes, and photonic quantum devices at the nanoscale' },
 
  // === Cavity QED edges ===
  { from: 'cQED', to: 'qc', strength: 0.8, description: 'Strong-coupling regime: single photons as quantum bus between stationary qubits' },
  { from: 'cQED', to: 'qoptics', strength: 0.85, description: 'Jaynes–Cummings Hamiltonian: the hydrogen atom of quantum optics' },
  { from: 'cQED', to: 'nanophotonics', strength: 0.75, description: 'Photonic crystal nanocavities: shrinking mode volume until the vacuum fluctuations notice' },
  { from: 'cQED', to: 'physics', strength: 0.7, description: 'Vacuum Rabi splitting as experimental proof that the electromagnetic vacuum is genuinely weird' },
  { from: 'cQED', to: 'qalgos', strength: 0.45, description: 'Cavity-mediated gates: photon-shuttling as a physical substrate for quantum logic' },
 
  // === Philosophy cluster ===
  { from: 'philosophy', to: 'nihilism', strength: 0.8, description: 'Analytic philosophy asked about intrinsic value; nihilism answered bluntly' },
  { from: 'philosophy', to: 'absurdism', strength: 0.8, description: 'Camus: revolt is the only coherent response to an irrational universe' },
  { from: 'philosophy', to: 'existentialism', strength: 0.75, description: 'Existence precedes essence : your identity is a pull request you keep amending' },
  { from: 'nihilism', to: 'absurdism', strength: 0.7, description: 'Nihilism sees the void; absurdism shrugs and keeps going anyway' },
  { from: 'existentialism', to: 'absurdism', strength: 0.65, description: 'Sartre and Camus disagreed on rebellion; both agreed the universe owes you nothing' },
 
  // === Cross-domain connections ===
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