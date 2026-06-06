export interface Skill {
  name: string;
  level?: number;  // 0-100 (proficiency percentage)
  category: 'programming' | 'physics' | 'ml' | 'experimental';
}

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
  email: "himans23@iitk.ac.in",
  location: "Delhi, India",

  // Short bio for the WhoAmI section
  bio: `
    I’m a third-year Physics major at IIT Kanpur driven by the ambition of building a fault-tolerant, practically useful Quantum Computer. Fascinated by the fundamental laws of the universe and computer systems, my research sits at their intersection, currently focusing on Cavity Quantum Electrodynamics and the simulation of open quantum systems for information processing.

    I have an insatiable desire to understand this world, it's workings and it's purpose; and wish to acquire as much knowledge about as many things possible. Beyond physics, my intellectual curiosity frequently spills over into the Statistics, Machine Learning, Large Lanaguage Models and thier interpretabiliy.

    When I’m not running quantum circuits or debugging neural networks, you’ll likely find me actively debating social issues, or exploring the philosophies of Camus and Nietzsche while sipping on a cup of cappuccino.`,
};

// === SKILLS ===

export const skills: Skill[] = [
  // Programming
  { name: 'Python', category: 'programming' },
  { name: 'MATLAB', category: 'programming' },
  { name: 'C', category: 'programming' },
  { name: 'C++', category: 'programming' },

  // Computational Physics & Toolkits
  { name: 'QuTiP', category: 'physics' },
  { name: 'Qiskit', category: 'physics' },
  { name: 'COMSOL Multiphysics', category: 'physics' },
  { name: 'OriginPro', category: 'physics' },

  // Machine Learning and Data Analysis
  { name: 'Tensorflow', category: 'ml' },
  { name: 'Keras', category: 'ml' },
  { name: 'PyTorch', category: 'ml' },
  { name: 'Transformerlens', category: 'ml' },
  { name: 'OpenCV', category: 'ml' },

  // Experimental Skills
  { name: 'Crystal Growth', category: 'experimental' },
  { name: 'Chemical Vapor Transport', category: 'experimental' },
  { name: 'Scanning Electron Microscopy', category: 'experimental' },
  { name: 'X-ray Diffraction', category: 'experimental' },
  { name: 'Energy-Dispersive X-ray Spectroscopy', category: 'experimental' },
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
  { name: 'GitHub', url: 'https://github.com/BlakkTyger', icon: 'Github' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/himanshu-sharma-152282217/', icon: 'Linkedin' },
  { name: 'Twitter', url: 'https://x.com/blakktyger', icon: 'Twitter' },
  { name: 'Email', url: 'mailto:himans23@iitk.ac.in', icon: 'Mail' },
];