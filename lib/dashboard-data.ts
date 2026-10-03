export type Participant = {
  id: string
  name: string
  employeeId: string
  department: string
  course: string
  progress: number
  avgScore: number | null
  lastActive: string
  status: 'On track' | 'At risk' | 'Completed' | 'Not started'
}

export const TRAINER_COURSES = [
  'Coastal Monitoring with Satellite Data',
  'Data Analytics for Decision Makers',
  'Responsible AI in Public Services',
]

export const PARTICIPANTS: Participant[] = [
  { id: 'p1', name: 'Ananya Sharma', employeeId: 'INC-2041', department: 'INCOIS', course: 'Data Analytics for Decision Makers', progress: 78, avgScore: 84, lastActive: '2h ago', status: 'On track' },
  { id: 'p2', name: 'Rahul Verma', employeeId: 'IIT-1187', department: 'IITM', course: 'Data Analytics for Decision Makers', progress: 32, avgScore: 58, lastActive: '5d ago', status: 'At risk' },
  { id: 'p3', name: 'Priya Iyer', employeeId: 'NIO-0932', department: 'NIOT', course: 'Coastal Monitoring with Satellite Data', progress: 100, avgScore: 92, lastActive: '1d ago', status: 'Completed' },
  { id: 'p4', name: 'Vikram Rao', employeeId: 'NCP-0415', department: 'NCPOR', course: 'Responsible AI in Public Services', progress: 64, avgScore: 71, lastActive: '6h ago', status: 'On track' },
  { id: 'p5', name: 'Sneha Pillai', employeeId: 'NCE-0778', department: 'NCESS', course: 'Coastal Monitoring with Satellite Data', progress: 0, avgScore: null, lastActive: 'Never', status: 'Not started' },
  { id: 'p6', name: 'Karthik Menon', employeeId: 'INC-2210', department: 'INCOIS', course: 'Responsible AI in Public Services', progress: 45, avgScore: 63, lastActive: '3d ago', status: 'At risk' },
  { id: 'p7', name: 'Divya Krishnan', employeeId: 'IIT-1302', department: 'IITM', course: 'Coastal Monitoring with Satellite Data', progress: 88, avgScore: 89, lastActive: '30m ago', status: 'On track' },
  { id: 'p8', name: 'Arjun Das', employeeId: 'NIO-1044', department: 'NIOT', course: 'Data Analytics for Decision Makers', progress: 100, avgScore: 95, lastActive: '2d ago', status: 'Completed' },
]

export const INSTITUTES = ['INCOIS', 'IITM', 'NIOT', 'NCPOR', 'NCESS'] as const

export const SKILL_GAP_DOMAINS = ['All domains', 'AI', 'Oceanography', 'Data Analytics', 'Governance'] as const
export type SkillGapDomain = (typeof SKILL_GAP_DOMAINS)[number]

type Proficiency = { current: number; target: number }

export const SKILL_GAP: Record<(typeof INSTITUTES)[number], Record<Exclude<SkillGapDomain, 'All domains'>, Proficiency>> = {
  INCOIS: { AI: { current: 58, target: 85 }, Oceanography: { current: 88, target: 92 }, 'Data Analytics': { current: 72, target: 90 }, Governance: { current: 64, target: 75 } },
  IITM: { AI: { current: 71, target: 85 }, Oceanography: { current: 76, target: 88 }, 'Data Analytics': { current: 80, target: 90 }, Governance: { current: 55, target: 75 } },
  NIOT: { AI: { current: 49, target: 80 }, Oceanography: { current: 84, target: 90 }, 'Data Analytics': { current: 61, target: 85 }, Governance: { current: 60, target: 70 } },
  NCPOR: { AI: { current: 44, target: 80 }, Oceanography: { current: 79, target: 90 }, 'Data Analytics': { current: 58, target: 85 }, Governance: { current: 52, target: 70 } },
  NCESS: { AI: { current: 52, target: 80 }, Oceanography: { current: 70, target: 85 }, 'Data Analytics': { current: 66, target: 85 }, Governance: { current: 68, target: 75 } },
}

export const DOMAIN_SKILLS = [
  'Machine Learning',
  'Remote Sensing',
  'Python',
  'Ocean Modelling',
  'Data Visualization',
  'Public Policy',
  'GIS Mapping',
  'Statistics',
  'Cybersecurity',
  'Climate Science',
  'Project Management',
  'Deep Learning',
]

export type TrainerCandidate = {
  id: string
  name: string
  institute: string
  title: string
  skills: Record<string, number>
  rating: number
  availability: number
}

export const TRAINER_POOL: TrainerCandidate[] = [
  { id: 't1', name: 'Dr. Meera Nair', institute: 'INCOIS', title: 'Senior Scientist', skills: { 'Remote Sensing': 96, 'Ocean Modelling': 90, Python: 78, 'GIS Mapping': 85, 'Climate Science': 82 }, rating: 4.8, availability: 70 },
  { id: 't2', name: 'Prof. Sanjay Gupta', institute: 'IITM', title: 'Principal Investigator', skills: { 'Machine Learning': 94, 'Deep Learning': 91, Python: 95, Statistics: 88, 'Data Visualization': 76 }, rating: 4.9, availability: 40 },
  { id: 't3', name: 'Dr. Kavya Reddy', institute: 'NIOT', title: 'Data Science Lead', skills: { 'Data Visualization': 93, Statistics: 90, Python: 88, 'Machine Learning': 80, 'Project Management': 70 }, rating: 4.7, availability: 85 },
  { id: 't4', name: 'Capt. Arjun Menon', institute: 'NCPOR', title: 'Operations Director', skills: { 'Public Policy': 88, 'Project Management': 92, 'Climate Science': 75, 'GIS Mapping': 60 }, rating: 4.6, availability: 90 },
  { id: 't5', name: 'Dr. Farhan Qureshi', institute: 'NCESS', title: 'Research Scientist', skills: { 'GIS Mapping': 92, 'Remote Sensing': 88, 'Climate Science': 90, Statistics: 74 }, rating: 4.5, availability: 60 },
  { id: 't6', name: 'Ms. Leela Joseph', institute: 'INCOIS', title: 'IT Security Officer', skills: { Cybersecurity: 95, Python: 80, 'Project Management': 72, 'Public Policy': 65 }, rating: 4.7, availability: 75 },
  { id: 't7', name: 'Dr. Rohan Bhat', institute: 'IITM', title: 'Climate Modeller', skills: { 'Ocean Modelling': 94, 'Climate Science': 96, Python: 86, 'Machine Learning': 70, Statistics: 82 }, rating: 4.8, availability: 55 },
]

export type RankedTrainer = TrainerCandidate & { matchScore: number; matchedSkills: string[] }

export function rankTrainers(requiredSkills: string[]): RankedTrainer[] {
  return TRAINER_POOL.map((trainer) => {
    const skillScore =
      requiredSkills.reduce((sum, skill) => sum + (trainer.skills[skill] ?? 0), 0) / requiredSkills.length
    const ratingScore = (trainer.rating / 5) * 100
    const matchScore = Math.round(skillScore * 0.7 + ratingScore * 0.15 + trainer.availability * 0.15)
    return {
      ...trainer,
      matchScore: Math.min(matchScore, 99),
      matchedSkills: requiredSkills.filter((skill) => skill in trainer.skills),
    }
  })
    .filter((trainer) => trainer.matchedSkills.length > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
}
