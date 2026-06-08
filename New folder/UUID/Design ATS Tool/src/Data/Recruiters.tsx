export interface Recruiter {
  id: string;
  name: string;
  email: string;
  role: 'recruiter' | 'senior_recruiter' | 'recruiting_manager' | 'hr_director';
  departments: string[];
  activeRequisitions: number;
  candidatesScreened: number;
  interviewsScheduled: number;
  offersExtended: number;
  hiresMade: number;
  avgTimeToHire: number; // days
  status: 'active' | 'away' | 'offline';
}

export const mockRecruiters: Recruiter[] = [
  {
    id: 'REC-001',
    name: 'Rohan Okafor',
    email: 'rohan.okafor@guild.com',
    role: 'hr_director',
    departments: ['ADM', 'AER', 'AVI', 'CFD', 'LEG', 'MME', 'NGC', 'STR', 'SYS', 'TCA'],
    activeRequisitions: 12,
    candidatesScreened: 127,
    interviewsScheduled: 34,
    offersExtended: 8,
    hiresMade: 6,
    avgTimeToHire: 87,
    status: 'active'
  },
  {
    id: 'REC-002',
    name: 'Priya Sharma',
    email: 'priya.sharma@guild.com',
    role: 'senior_recruiter',
    departments: ['ADM', 'BDL', 'CFD', 'FIN', 'MME', 'NGC', 'PTC'],
    activeRequisitions: 8,
    candidatesScreened: 94,
    interviewsScheduled: 28,
    offersExtended: 5,
    hiresMade: 4,
    avgTimeToHire: 92,
    status: 'active'
  },
  {
    id: 'REC-003',
    name: 'Marcus Johnson',
    email: 'marcus.johnson@guild.com',
    role: 'senior_recruiter',
    departments: ['AER', 'AVI', 'FIN', 'NGC', 'SYS', 'TCA', 'TBM', 'AIT'],
    activeRequisitions: 9,
    candidatesScreened: 103,
    interviewsScheduled: 31,
    offersExtended: 6,
    hiresMade: 5,
    avgTimeToHire: 89,
    status: 'active'
  },
  {
    id: 'REC-004',
    name: 'Sarah Chen',
    email: 'sarah.chen@guild.com',
    role: 'recruiter',
    departments: ['STR', 'SYS', 'SRQ', 'PRC', 'PNC'],
    activeRequisitions: 5,
    candidatesScreened: 67,
    interviewsScheduled: 18,
    offersExtended: 3,
    hiresMade: 2,
    avgTimeToHire: 95,
    status: 'active'
  },
  {
    id: 'REC-005',
    name: 'David Okonkwo',
    email: 'david.okonkwo@guild.com',
    role: 'recruiter',
    departments: ['TBM', 'OPS', 'PRI', 'PRJ', 'HNS'],
    activeRequisitions: 4,
    candidatesScreened: 58,
    interviewsScheduled: 15,
    offersExtended: 2,
    hiresMade: 2,
    avgTimeToHire: 98,
    status: 'away'
  },
];
