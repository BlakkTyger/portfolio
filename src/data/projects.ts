export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'cs' | 'physics';
  tags: string[];
  image?: string;
  links?: {
    github?: string;
    website?: string;
    paper?: string;
    presentation?: string;
    docs?: string;
  };
  year?: number;
}

export const projects: Project[] = [
  // CS Projects (Binary/Digital)
  {
    id: 'portfolio',
    title: 'This Portfolio',
    description: 'A 3D interactive portfolio built with Next.js, Three.js, and GSAP.',
    category: 'cs',
    tags: ['Next.js', 'Three.js', 'GSAP', 'TypeScript'],
    links: {
      github: 'https://github.com/yourusername/portfolio',
      website: 'https://yourportfolio.com',
    },
    year: 2024,
  },
  {
    id: 'ml-framework',
    title: 'Neural Network Framework',
    description: 'Custom deep learning framework built from scratch in Python.',
    category: 'cs',
    tags: ['Python', 'NumPy', 'CUDA'],
    links: {
      github: 'https://github.com/yourusername/ml-framework',
      docs: 'https://ml-framework.readthedocs.io',
    },
    year: 2024,
  },
  {
    id: 'nlp-chatbot',
    title: 'Conversational AI Bot',
    description: 'NLP-powered chatbot with transformer architecture.',
    category: 'cs',
    tags: ['Python', 'PyTorch', 'Transformers'],
    links: {
      github: 'https://github.com/yourusername/nlp-chatbot',
      presentation: 'https://slides.com/yourusername/nlp-chatbot',
    },
    year: 2023,
  },
  // Physics Research
  {
    id: 'quantum-sim',
    title: 'Quantum Circuit Simulator',
    description: 'Python library for simulating quantum circuits and algorithms.',
    category: 'physics',
    tags: ['Python', 'Qiskit', 'NumPy', 'Quantum Computing'],
    links: {
      github: 'https://github.com/yourusername/quantum-sim',
      paper: 'https://arxiv.org/abs/xxxx.xxxxx',
      presentation: 'https://slides.com/yourusername/quantum-sim',
    },
    year: 2024,
  },
  {
    id: 'optics-lab',
    title: 'Optical Interferometry Analysis',
    description: 'Research on optical interference patterns and data analysis tools.',
    category: 'physics',
    tags: ['Python', 'MATLAB', 'Optics', 'Data Analysis'],
    links: {
      paper: 'https://arxiv.org/abs/xxxx.xxxxx',
    },
    year: 2023,
  },
  {
    id: 'particle-dynamics',
    title: 'N-Body Simulation',
    description: 'Gravitational n-body simulation with relativistic corrections.',
    category: 'physics',
    tags: ['C++', 'OpenGL', 'Physics Simulation'],
    links: {
      github: 'https://github.com/yourusername/nbody',
      website: 'https://nbody-demo.vercel.app',
    },
    year: 2023,
  },
];

// Binary beam colors (0s and 1s style)
export const binaryColors = {
  primary: '#00FF9D',    // terminal-cyan
  secondary: '#00CC7D',  // darker cyan
  glow: '#00FF9D33',     // transparent glow
};

// Physics beam color (solid purple)
export const physicsColor = '#8F00FF';

export const categoryInfo = {
  cs: {
    label: 'CS Projects',
    description: 'Software development, machine learning, and web applications',
    route: '/cs-projects',
    color: binaryColors.primary,
  },
  physics: {
    label: 'Physics Research',
    description: 'Quantum computing, optics, and computational physics',
    route: '/research',
    color: physicsColor,
  },
};
