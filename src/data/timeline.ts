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
// Earlier years = further away (larger Z), recent = closer (smaller Z)
const yearToZ = (year: number): number => {
  const currentYear = new Date().getFullYear();
  const yearsAgo = currentYear - year;
  return yearsAgo * 5;  // Each year = 5 units of depth
};

export const milestones: Milestone[] = [
  {
    id: 'birth',
    year: 2000,
    title: 'Born',
    description: 'The journey begins',
    category: 'personal',
    position: { x: 0, z: yearToZ(2000) },
  },
  {
    id: 'high-school',
    year: 2016,
    title: 'High School',
    description: 'Discovered love for physics',
    category: 'education',
    position: { x: 2, z: yearToZ(2016) },
  },
  {
    id: 'university',
    year: 2018,
    title: 'University',
    description: 'Started BSc in Physics',
    category: 'education',
    position: { x: -1, z: yearToZ(2018) },
  },
  {
    id: 'first-code',
    year: 2019,
    title: 'First Code',
    description: 'Wrote first Python script',
    category: 'achievement',
    position: { x: 1.5, z: yearToZ(2019) },
  },
  {
    id: 'research',
    year: 2021,
    title: 'Research',
    description: 'Started quantum computing research',
    category: 'work',
    position: { x: -2, z: yearToZ(2021) },
  },
  {
    id: 'graduation',
    year: 2022,
    title: 'Graduation',
    description: 'BSc with First Class Honours',
    category: 'education',
    position: { x: 0.5, z: yearToZ(2022) },
  },
  {
    id: 'present',
    year: 2024,
    title: 'Present',
    description: 'Building the future',
    category: 'personal',
    position: { x: 0, z: yearToZ(2024) },
  },
].sort((a, b) => a.position.z - b.position.z);  // Sort by Z (furthest first)