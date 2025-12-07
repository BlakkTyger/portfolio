export interface Skill {
  name: string;
  level: number;  // 0-100 (proficiency percentage)
  category: 'development' | 'research' | 'tools';
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
  { name: 'GitHub', url: 'https://github.com/BlakkTyger', icon: 'Github' },
  { name: 'LinkedIn', url: 'https://linkedin.com/in/yourusername', icon: 'Linkedin' },
  { name: 'Twitter', url: 'https://twitter.com/yourusername', icon: 'Twitter' },
  { name: 'Email', url: 'mailto:your.email@example.com', icon: 'Mail' },
];