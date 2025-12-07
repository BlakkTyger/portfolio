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
// Earlier years = further away (more negative Z), recent = closer to camera
const yearToZ = (year: number): number => {
  const currentYear = new Date().getFullYear();
  const yearsAgo = currentYear - year;
  return -yearsAgo * 3;  // Each year = 3 units of depth (negative = in front of camera)
};

// Keep the interface and yearToZ exactly as they are above

const rawMilestones: Milestone[] = [
  {
    id: 'birth',
    year: 2005,
    title: 'Born',
    description: 'The journey begins',
    category: 'personal',
    position: { x: 0, z: yearToZ(2005) },
  },
  {
    id: 'first-code',
    year: 2020,
    title: 'First Code',
    description: 'Wrote first Python script',
    category: 'achievement',
    position: { x: 1.5, z: yearToZ(2020) },
  },
  {
    id: 'high-school',
    year: 2020,
    title: 'High School',
    description: 'Discovered love for physics',
    category: 'education',
    position: { x: 2, z: yearToZ(2020) },
  },
  {
    id: 'university',
    year: 2023,
    title: 'University',
    description: 'Started BS in Physics from IIT Kanpur',
    category: 'education',
    position: { x: -1, z: yearToZ(2023) },
  },
  {
    id: 'Qiskit',
    year: 2024,
    title: 'Qiskit Programming',
    description: 'Started learning Qiskit',
    category: 'education',
    position: { x: 0.5, z: yearToZ(2024) },
  },
  {
    id: 'Interpretability research',
    year: 2025,
    title: 'Research',
    description: 'Started Mechanistic Interpretability Research',
    category: 'work',
    position: { x: -2, z: yearToZ(2025) },
  },
  {
    id: 'present',
    year: 2025,
    title: 'Present',
    description: 'Building the future',
    category: 'personal',
    position: { x: 0, z: yearToZ(2025) },
  },
];

export const milestones: Milestone[] = [...rawMilestones].sort(
  (a, b) => a.position.z - b.position.z,
);