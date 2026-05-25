export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'cs' | 'physics';
  tags: string[];
  image?: string;
  assets?: {
    ppt?: string;
    document?: string;
    link?: string;
  };
  links?: {
    github?: string;
    website?: string;
    paper?: string;
    presentation?: string;
    docs?: string;
  };
  year?: number | string;
}

export const projects: Project[] = [
  // CS Projects
  {
    id: 'transformer-dynamics',
    title: 'Geometric and Dynamical Analysis of Function Vector Representations in Transformer Models',
    description: 'Modeled internal transformer representations as trajectory dynamics in high-dimensional state space. Demonstrated representations lie on low-dimensional manifold, enabling long-horizon forecasting with low-rank state-space predictors, reducing compute by 22-50%. Developed orthogonal projection framework for behavioral steering.',
    category: 'cs',
    tags: ['Machine Learning', 'Transformers', 'NLP', 'State-Space'],
    year: 2025,
    image: '/images/projects/transformer.png',
    assets: {
        document: '/docs/my-project-report.pdf',
        ppt: '/docs/my-project-slides.pptx',
        link: 'https://example.com'
      },
      links: {
        github: 'https://github.com/user/repo',
        website: 'https://demo.example.com',
        paper: '/docs/research-paper.pdf',
        presentation: '/docs/slides.pdf'
      }
  },
  {
    id: 'web-server-nfs',
    title: 'Web Server and NFS Development',
    description: 'Developed a Single Threaded Web server in Rust parsing HTTP requests. Extended to multi-threaded server. Implemented a Distributed File System based on Sun Microsystems’ NFS enabling remote file access and seamless data sharing. Integrated an RPC layer for low-latency client-server communication.',
    category: 'cs',
    tags: ['Rust', 'C', 'Networking', 'NFS', 'RPC'],
    year: '2024',
    image: '/images/projects/nfs.png',
    assets: {
        document: '/docs/my-project-report.pdf',
        ppt: '/docs/my-project-slides.pptx',
        link: 'https://example.com'
      },
      links: {
        github: 'https://github.com/user/repo',
        website: 'https://demo.example.com',
        paper: '/docs/research-paper.pdf',
        presentation: '/docs/slides.pdf'
      }
  },
  {
    id: 'facial-reconstruction',
    title: 'Facial Reconstruction from low-quality CCTV footages',
    description: 'Implemented zero-reference deep curve estimation for frame-wise video light enhancement. Retrained YOLOv7 for real-time face detection and DeepSort for multi-object tracking. Applied GANs for landmark detection, frontalization, and reconstructed latent facial details using GFG-GAN restoring high-fidelity facial textures.',
    category: 'cs',
    tags: ['Computer Vision', 'GAN', 'YOLOv7', 'DeepSort', 'Deep Learning'],
    year: '2023 - 2024',
    image: '/images/projects/cctv.png',
    assets: {
        document: '/docs/my-project-report.pdf',
        ppt: '/docs/my-project-slides.pptx',
        link: 'https://example.com'
      },
      links: {
        github: 'https://github.com/user/repo',
        website: 'https://demo.example.com',
        paper: '/docs/research-paper.pdf',
        presentation: '/docs/slides.pdf'
      }
  },
  {
    id: 'up-police-attendance',
    title: 'Attendance App for Uttar Pradesh Police',
    description: 'Developed cross-platform app allowing facial recognition for attendance, geolocation recording, events management. Implemented Face Detection using HOG and SVM, and Anti-Spoofing using Gesture Detection via MediaPipe. Integrated containerized models within a Flutter app using Flask and Docker.',
    category: 'cs',
    tags: ['Flutter', 'Docker', 'Python', 'Machine Learning', 'MediaPipe'],
    year: '2024',
    image: '/images/projects/police.png',
    assets: {
        document: '/docs/my-project-report.pdf',
        ppt: '/docs/my-project-slides.pptx',
        link: 'https://example.com'
      },
      links: {
        github: 'https://github.com/user/repo',
        website: 'https://demo.example.com',
        paper: '/docs/research-paper.pdf',
        presentation: '/docs/slides.pdf'
      }
  },
  {
    id: 'agentic-rag',
    title: 'Dynamic Agentic RAG for Financial and Legal Use Cases',
    description: 'Developed a robust RAG application based on dynamic retrieval strategies and multi-agent orchestration for analytics and compliance. Implemented Graph-Based Text Indexing and MCTS/Markov Chain algorithms to optimize workflows. Prototyped advanced frameworks like MetaGPT, AFlow, and Hybrid RAG.',
    category: 'cs',
    tags: ['RAG', 'LLM', 'Multi-Agent', 'LangGraph', 'MetaGPT'],
    year: '2024',
    image: '/images/projects/rag.png',
    assets: {
        document: '/docs/my-project-report.pdf',
        ppt: '/docs/my-project-slides.pptx',
        link: 'https://example.com'
      },
      links: {
        github: 'https://github.com/user/repo',
        website: 'https://demo.example.com',
        paper: '/docs/research-paper.pdf',
        presentation: '/docs/slides.pdf'
      }
  },
  {
    id: 'steps-ai',
    title: 'StepsAI',
    description: 'Developed a production-grade, modular and autonomous Agents framework orchestrating OAuth flows for GitHub, Jira, Gmail, etc. Implemented stateful session management via Rclone and dynamic agentic workflows. Architected scalable ETL pipelines and leveraged Milvus and mem0 for advanced vector search and long-term memory.',
    category: 'cs',
    tags: ['LlamaIndex', 'LangGraph', 'ETL', 'Milvus', 'Celery'],
    year: '2024 - 2025',
    image: '/images/projects/stepsai.png',
    assets: {
        document: '/docs/my-project-report.pdf',
        ppt: '/docs/my-project-slides.pptx',
        link: 'https://example.com'
      },
      links: {
        github: 'https://github.com/user/repo',
        website: 'https://demo.example.com',
        paper: '/docs/research-paper.pdf',
        presentation: '/docs/slides.pdf'
      }
  },

  // Physics Research
  {
    id: 'quantum-optics-simulations',
    title: 'Quantum Optics Simulations, Cavity-QED Research',
    description: 'Developed a unified framework to study light-matter interaction in confined quantum systems. Analyzed RWA breakdown in driven regimes. Compared Rabi Hamiltonian with Jaynes-Cummings model. Studied open quantum dynamics via Lindblad master equations. Constructed photonic qubit representations.',
    category: 'physics',
    tags: ['Quantum Optics', 'Cavity-QED', 'Lindblad', 'Schrödinger Evolution'],
    year: '2025 - Ongoing',
    image: '/images/projects/cavity-qed.png',
    assets: {
        document: '/docs/my-project-report.pdf',
        ppt: '/docs/my-project-slides.pptx',
        link: 'https://example.com'
      },
      links: {
        github: 'https://github.com/user/repo',
        website: 'https://demo.example.com',
        paper: '/docs/research-paper.pdf',
        presentation: '/docs/slides.pdf'
      }
  },
  {
    id: 'ibm-qgss',
    title: 'IBM Quantum Global Summer School 2025',
    description: 'Developed understanding of Quantum Computing Hardware, Noise, Error Correction, and Benchmarking. Engineered QEC stabilizer parity check matrices for Toric code and Gross code. Mitigated errors via Zero Noise Extrapolation. Determined ground state energy of N2 using hybrid Sample-based Quantum Diagonalization.',
    category: 'physics',
    tags: ['Qiskit', 'Quantum Error Correction', 'VQE', 'Benchmarking'],
    year: '2025',
    image: '/images/projects/ibm-qgss.png',
    assets: {
        document: '/docs/my-project-report.pdf',
        ppt: '/docs/my-project-slides.pptx',
        link: 'https://example.com'
      },
      links: {
        github: 'https://github.com/user/repo',
        website: 'https://demo.example.com',
        paper: '/docs/research-paper.pdf',
        presentation: '/docs/slides.pdf'
      }
  },
  {
    id: 'wgm-microring',
    title: 'Micro-Ring Resonators for NV Centers',
    description: 'Implemented a 2D axisymmetric eigenfrequency FEM model in COMSOL with PML boundaries to compute whispering-gallery modes and quantify radiative loss. Achieved Q ≈ 1.7 × 10^5 with Purcell enhancement Fp ≈ 3.9.',
    category: 'physics',
    tags: ['COMSOL', 'Nanophotonics', 'Quantum Optics'],
    year: 2024,
    image: '/images/projects/wgm.png',
    assets: {
        document: '/docs/my-project-report.pdf',
        ppt: '/docs/my-project-slides.pptx',
        link: 'https://example.com'
      },
      links: {
        github: 'https://github.com/user/repo',
        website: 'https://demo.example.com',
        paper: '/docs/research-paper.pdf',
        presentation: '/docs/slides.pdf'
      }
  },
  {
    id: 'nbni2te2-synthesis',
    title: 'Synthesis and Discovery of Electronic Phase Transitions in Te-Rich NbNi2Te2 Crystals',
    description: 'Synthesized layered Ni-Nb-Te single crystals using chemical vapor transport and characterized structure/transport properties. Observed bad-metallic behavior with anomalies at 275K and a resistivity minimum near 111.5K.',
    category: 'physics',
    tags: ['Condensed Matter', 'Crystal Growth', 'Transport Properties'],
    year: 2025,
    image: '/images/projects/nbni2te2.png',
    assets: {
        document: '/docs/my-project-report.pdf',
        ppt: '/docs/my-project-slides.pptx',
        link: 'https://example.com'
      },
      links: {
        github: 'https://github.com/user/repo',
        website: 'https://demo.example.com',
        paper: '/docs/research-paper.pdf',
        presentation: '/docs/slides.pdf'
      }
  },
  {
    id: 'vqe-qml',
    title: 'Variational Circuits and Quantum Machine Learning',
    description: 'Studied variational quantum circuits and VQE. Analyzed quantum clustering algorithms (k-means, k-median) and designed quantum pipelines for distance estimation via amplitude and angle embedding. Evaluated trade-offs for NISQ hardware feasibility.',
    category: 'physics',
    tags: ['Quantum Computing', 'Qiskit', 'QML'],
    year: 2025,
    image: '/images/projects/vqe.png',
    assets: {
        document: '/docs/my-project-report.pdf',
        ppt: '/docs/my-project-slides.pptx',
        link: 'https://example.com'
      },
      links: {
        github: 'https://github.com/user/repo',
        website: 'https://demo.example.com',
        paper: '/docs/research-paper.pdf',
        presentation: '/docs/slides.pdf'
      }
  },
  {
    id: 'point-groups',
    title: 'Point Groups in 3D Crystal Structures',
    description: 'Presented crystallographic point groups governing anisotropy in optical, electrical, and mechanical properties. Derived IR/Raman selection rules and compared symmetry breaking in monolayer MoS2 enabling spin-valley physics.',
    category: 'physics',
    tags: ['Crystallography', 'Group Theory', 'Semiconductors'],
    year: 2025,
    image: '/images/projects/point-groups.png',
    assets: {
        document: '/docs/my-project-report.pdf',
        ppt: '/docs/my-project-slides.pptx',
        link: 'https://example.com'
      },
      links: {
        github: 'https://github.com/user/repo',
        website: 'https://demo.example.com',
        paper: '/docs/research-paper.pdf',
        presentation: '/docs/slides.pdf'
      }
  }
];

export const binaryColors = {
  primary: '#00FF9D',    
  secondary: '#00CC7D',  
  glow: '#00FF9D33',     
};

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
