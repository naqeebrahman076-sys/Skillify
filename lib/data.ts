export type Role = 'trainee' | 'trainer' | 'admin'

export type Domain =
  | 'Oceanography'
  | 'AI'
  | 'Governance'
  | 'Data Analytics'
  | 'Cybersecurity'

export type Course = {
  id: string
  title: string
  description: string
  domain: Domain
  durationHours: number
  modules: number
  trainer: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  rating: number
  learners: number
}

export const DOMAINS: Domain[] = [
  'Oceanography',
  'AI',
  'Governance',
  'Data Analytics',
  'Cybersecurity',
]

export const COURSES: Course[] = [
  {
    id: 'ocean-1',
    title: 'Coastal Monitoring with Satellite Data',
    description:
      'Interpret sea surface temperature and chlorophyll datasets to support fisheries and disaster planning.',
    domain: 'Oceanography',
    durationHours: 12,
    modules: 8,
    trainer: 'Dr. Meera Nair',
    level: 'Intermediate',
    rating: 4.8,
    learners: 1240,
  },
  {
    id: 'ocean-2',
    title: 'Fundamentals of Marine Resource Policy',
    description:
      'Understand exclusive economic zones, blue economy frameworks and sustainable harvesting policy.',
    domain: 'Oceanography',
    durationHours: 6,
    modules: 5,
    trainer: 'Capt. Arjun Menon',
    level: 'Beginner',
    rating: 4.6,
    learners: 860,
  },
  {
    id: 'ai-1',
    title: 'Responsible AI in Public Services',
    description:
      'Evaluate bias, transparency and accountability when deploying AI systems for citizen-facing services.',
    domain: 'AI',
    durationHours: 10,
    modules: 7,
    trainer: 'Priya Raghavan',
    level: 'Intermediate',
    rating: 4.9,
    learners: 3120,
  },
  {
    id: 'ai-2',
    title: 'Prompt Engineering for Administrators',
    description:
      'Draft briefs, summarise files and automate routine correspondence safely with generative AI tools.',
    domain: 'AI',
    durationHours: 4,
    modules: 4,
    trainer: 'Rahul Verma',
    level: 'Beginner',
    rating: 4.7,
    learners: 4580,
  },
  {
    id: 'gov-1',
    title: 'Digital Governance and e-Office',
    description:
      'Streamline file movement, approvals and record keeping using digital governance platforms.',
    domain: 'Governance',
    durationHours: 8,
    modules: 6,
    trainer: 'Anita Deshpande',
    level: 'Beginner',
    rating: 4.5,
    learners: 5210,
  },
  {
    id: 'gov-2',
    title: 'Evidence-Based Policy Design',
    description:
      'Design, pilot and evaluate public programmes with clear outcome indicators and feedback loops.',
    domain: 'Governance',
    durationHours: 14,
    modules: 9,
    trainer: 'Prof. S. Iyer',
    level: 'Advanced',
    rating: 4.8,
    learners: 980,
  },
  {
    id: 'data-1',
    title: 'Data Analytics for Decision Makers',
    description:
      'Clean, visualise and interpret departmental datasets to build dashboards that drive decisions.',
    domain: 'Data Analytics',
    durationHours: 16,
    modules: 10,
    trainer: 'Kavya Sharma',
    level: 'Intermediate',
    rating: 4.9,
    learners: 2740,
  },
  {
    id: 'cyber-1',
    title: 'Cyber Hygiene for Government Offices',
    description:
      'Recognise phishing, protect classified information and follow incident reporting protocols.',
    domain: 'Cybersecurity',
    durationHours: 5,
    modules: 5,
    trainer: 'Lt. Col. Vikram Singh',
    level: 'Beginner',
    rating: 4.7,
    learners: 6320,
  },
]

export type Question = {
  id: string
  prompt: string
  options: string[]
}

export const ASSESSMENT = {
  title: 'Data Analytics for Decision Makers',
  subtitle: 'Module 4 Assessment',
  durationSeconds: 10 * 60,
  questions: [
    {
      id: 'q1',
      prompt:
        'Which chart type is most appropriate for showing the trend of monthly grievance filings over two years?',
      options: ['Pie chart', 'Line chart', 'Scatter plot', 'Treemap'],
    },
    {
      id: 'q2',
      prompt: 'What does the median of a dataset represent?',
      options: [
        'The most frequently occurring value',
        'The average of all values',
        'The middle value when data is sorted',
        'The difference between the highest and lowest values',
      ],
    },
    {
      id: 'q3',
      prompt:
        'A district dataset has missing values in the "income" column. What is the most defensible first step?',
      options: [
        'Delete the entire column',
        'Replace all missing values with zero',
        'Investigate the pattern and reason for missingness',
        'Ignore them during analysis',
      ],
    },
    {
      id: 'q4',
      prompt: 'Which of the following is a key performance indicator (KPI)?',
      options: [
        'Number of staff in a department',
        'Average time to resolve a citizen complaint',
        'Name of the scheme',
        'Office address',
      ],
    },
    {
      id: 'q5',
      prompt:
        'Correlation between two variables in a dataset implies that:',
      options: [
        'One variable causes the other',
        'The variables move together in some pattern',
        'The data has no outliers',
        'The sample size is large enough',
      ],
    },
  ] satisfies Question[],
  answerKey: { q1: 1, q2: 2, q3: 2, q4: 1, q5: 1 } as Record<string, number>,
}

export const TRAINEE = {
  name: 'Aditi Kulkarni',
  designation: 'Assistant Section Officer',
  department: 'Ministry of Earth Sciences',
  employeeId: 'GOV-MoES-20417',
  completedCourses: 14,
  certificates: 9,
  learningHours: 126,
  badges: [
    { label: 'Data Literate', tier: 'Gold' },
    { label: 'AI Explorer', tier: 'Silver' },
    { label: 'Cyber Safe', tier: 'Gold' },
    { label: 'Policy Thinker', tier: 'Bronze' },
  ],
}
