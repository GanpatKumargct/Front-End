export type RequisitionStatus =
  | 'Draft'
  | 'Under Review'
  | 'Open'
  | 'Fulfilled'
  | 'Cancelled'
  | 'Rejected'
  | 'On Hold';

export type RequisitionPriority =
  | 'Critical'
  | 'High'
  | 'Medium'
  | 'Low';

export interface Requisition {
  id: string;
  title: string;
  department: string;
  requester: string;
  hiringManagers: string[];
  supportingManagers?: string[];
  recruiterAssigned?: string;
  status: RequisitionStatus;
  priority: RequisitionPriority;
  headcount: number;
  employmentType: 'Full Time' | 'Contract' | 'Internship';
  workModel: 'Onsite' | 'Hybrid' | 'Remote';
  location: string;
  compensationRange: string;
  roleOverview: string;
  scopeOfWork: string[];
  requirements: string[];
  businessJustification: string;
  createdDate: string;
  targetHireDate: string;
  notes?: string;
  experienceRange: string;
  candidateCount: number;
  interviewCount: number;
  selectedCount: number;
  rejectedCount: number;

  skills: string[];

approvalStatus:
  | 'Pending Review'
  | 'Department Approved'
  | 'Recruiting Approved'
  | 'Finance Approved'
  | 'Rejected';

roleType:
  | 'New Role'
  | 'Replacement';

replacementFor?: string;

departmentCode?: string;

  approvalWorkflow?: {
    hiringManager:
      | 'Pending'
      | 'Approved'
      | 'Rejected';

    departmentHead:
      | 'Pending'
      | 'Approved'
      | 'Rejected';

    recruiter:
      | 'Pending'
      | 'Approved'
      | 'Rejected';

    hr:
      | 'Pending'
      | 'Approved'
      | 'Rejected';

    founder:
      | 'Pending'
      | 'Approved'
      | 'Rejected';
  };

  activityLog?: {
    date: string;
    action: string;
    user: string;
  }[];

  comments?: {
    user: string;
    date: string;
    message: string;
  }[];
}

export const requisitionStatuses: RequisitionStatus[] = [
  'Draft',
  'Under Review',
  'Open',
  'Fulfilled',
  'Cancelled',
  'Rejected',
  'On Hold',
];


export const mockRequisitions: Requisition[] = [
  {
    id: 'REQ-1001',
    title: 'Senior Propulsion Engineer',
    department: 'Propulsion',
    requester: 'Arjun Menon',
   hiringManagers: [
  'Dr. Vikram Rao'
],

supportingManagers: [
  'Sarah Chen'
],
    recruiterAssigned: 'Priya Sharma',
    status: 'Open',
    priority: 'High',
    headcount: 2,
    employmentType: 'Full Time',
    workModel: 'Onsite',
    location: 'Bengaluru',
    compensationRange: '₹32L - ₹45L',
    experienceRange: '6-10 Years',

skills: [
  'Propulsion',
  'Rocket Engines',
  'CFD',
  'Thermodynamics'
],

approvalStatus: 'Recruiting Approved',

roleType: 'New Role',

candidateCount: 14,
interviewCount: 6,
selectedCount: 1,
rejectedCount: 4,
    roleOverview:
      'Lead propulsion subsystem development for reusable launch vehicle programs.',
    scopeOfWork: [
      'Propulsion architecture development',
      'Engine qualification support',
      'Hot fire campaign support',
      'Failure investigation'
    ],
    
    requirements: [
      'Liquid propulsion experience',
      'Rocket engine systems',
      'Testing experience',
      'Systems engineering'
    ],
    businessJustification:
      'Expansion of reusable launch vehicle development program.',
    createdDate: 'May 12',
    targetHireDate: 'Jul 15',
    notes: 'Critical role for upcoming test campaign.',
    departmentCode: 'PROP',

    approvalWorkflow: {
      hiringManager: 'Approved',
      departmentHead: 'Approved',
      recruiter: 'Pending',
      hr: 'Pending',
      founder: 'Pending',
    },

    activityLog: [
      {
        date: 'May 12',
        action: 'Requisition Created',
        user: 'System',
      },
    ],

    comments: [
      {
        user: 'System',
        date: 'May 12',
        message: 'Requisition created.',
      },
    ],
  },

  {
    id: 'REQ-1002',
    title: 'Avionics Engineer',
    department: 'Avionics',
    requester: 'Sarah Chen',
    hiringManagers: ['Rahul Nair'],
    supportingManagers: [],
    recruiterAssigned: 'Ananya Rao',
    status: 'Under Review',
    priority: 'Medium',
    headcount: 1,
    employmentType: 'Full Time',
    workModel: 'Onsite',
    location: 'Bengaluru',
    compensationRange: '₹18L - ₹28L',
    roleOverview:
      'Develop avionics architecture and embedded flight systems.',
    scopeOfWork: [
      'Flight computer development',
      'Sensor integration',
      'Embedded software validation'
    ],
    requirements: [
      'Embedded systems',
      'C/C++',
      'Avionics integration'
    ],
    experienceRange: '3-6 Years',

skills: [
  'Embedded Systems',
  'C++',
  'Flight Computers',
  'Sensor Integration'
],

approvalStatus:
  'Department Approved',

roleType: 'New Role',
    departmentCode: 'AVI',

approvalWorkflow: {
  hiringManager: 'Approved',
  departmentHead: 'Approved',
  recruiter: 'Pending',
  hr: 'Pending',
  founder: 'Pending',
},

activityLog: [
  {
    date: 'May 18',
    action: 'Requisition Created',
    user: 'Sarah Chen',
  },
  {
    date: 'May 19',
    action: 'Hiring Manager Approved',
    user: 'Rahul Nair',
  },
  {
    date: 'May 20',
    action: 'Department Head Approved',
    user: 'AER Leadership',
  },
],

comments: [
  {
    user: 'Rahul Nair',
    date: 'May 19',
    message:
      'Approved for Flight Vehicle 3 staffing.',
  },
  {
    user: 'Recruiting Team',
    date: 'May 21',
    message:
      'Awaiting recruiter allocation.',
  },
],
    candidateCount: 8,
interviewCount: 3,
selectedCount: 0,
rejectedCount: 1,
    businessJustification:
      'Additional support needed for next flight vehicle.',
    createdDate: 'May 18',
    targetHireDate: 'Aug 01',
  },

  {
    id: 'REQ-1003',
    title: 'CFD Engineer',
    department: 'Aerodynamics',
    requester: 'Vivek Rao',
    hiringManagers: ['Neha Iyer'],
    supportingManagers: [],
    recruiterAssigned: 'Priya Sharma',
    status: 'Draft',
    priority: 'Low',
    headcount: 1,
    employmentType: 'Full Time',
    workModel: 'Onsite',
    location: 'Bengaluru',
    compensationRange: '₹20L - ₹30L',
    roleOverview:
      'Support aerodynamic simulation activities.',
    scopeOfWork: [
      'CFD analysis',
      'Mesh generation',
      'Wind tunnel correlation'
    ],
    experienceRange: '3-6 Years',

    skills: [
      'ANSYS Fluent',
      'CFD',
      'Aerodynamics',
      'Mesh Generation'
    ],

    approvalStatus:
      'Department Approved',

    roleType: 'New Role',
    candidateCount: 0,
    interviewCount: 0,
    selectedCount: 0,
    rejectedCount: 0,
    requirements: [
      'ANSYS Fluent',
      'CFD fundamentals',
      'Aerospace background'
    ],
    businessJustification:
      'Growth of aerodynamics capability.',
    createdDate: 'May 22',
    targetHireDate: 'Aug 15',
    departmentCode: 'CFD',

    approvalWorkflow: {
      hiringManager: 'Approved',
      departmentHead: 'Approved',
      recruiter: 'Pending',
      hr: 'Pending',
      founder: 'Pending',
    },

    activityLog: [
      {
        date: 'May 12',
        action: 'Requisition Created',
        user: 'System',
      },
    ],

    comments: [
      {
        user: 'System',
        date: 'May 12',
        message: 'Requisition created.',
      },
    ],
  },

  {
    id: 'REQ-1004',
    title: 'GNC Engineer',
    department: 'GNC',
    requester: 'Rohan Iyer',
    hiringManagers: ['Dr. Karan Mehta'],
    supportingManagers: [],
    recruiterAssigned: 'Ananya Rao',
    status: 'On Hold',
    priority: 'High',
    headcount: 2,
    employmentType: 'Full Time',
    workModel: 'Onsite',
    location: 'Bengaluru',
    compensationRange: '₹28L - ₹40L',
    roleOverview:
      'Develop guidance, navigation and control algorithms.',
    scopeOfWork: [
      'Guidance development',
      'Navigation filters',
      'Flight simulation'
    ],
    requirements: [
      'MATLAB',
      'Control systems',
      'Kalman filtering'
    ],
    experienceRange: '3-6 Years',

    skills: [
      'MATLAB',
      'Simulink',
      'Control Systems',
      'Kalman Filters'
    ],

    approvalStatus:
      'Department Approved',

    roleType: 'New Role',
    candidateCount: 4,
    interviewCount: 2,
    selectedCount: 0,
    rejectedCount: 1,
    businessJustification:
      'Pending funding approval.',
    createdDate: 'May 14',
    targetHireDate: 'Sep 01',
    departmentCode: 'GNC',

    approvalWorkflow: {
      hiringManager: 'Approved',
      departmentHead: 'Approved',
      recruiter: 'Pending',
      hr: 'Pending',
      founder: 'Pending',
    },

    activityLog: [
      {
        date: 'May 12',
        action: 'Requisition Created',
        user: 'System',
      },
    ],

    comments: [
      {
        user: 'System',
        date: 'May 12',
        message: 'Requisition created.',
      },
    ],
  },

  {
    id: 'REQ-1005',
    title: 'Structures Engineer',
    department: 'Structures',
    requester: 'Ashwin Kumar',
    hiringManagers: ['Divya Menon'],
    supportingManagers: [],
    recruiterAssigned: 'Priya Sharma',
    status: 'Fulfilled',
    priority: 'Medium',
    headcount: 1,
    employmentType: 'Full Time',
    workModel: 'Onsite',
    location: 'Bengaluru',
    compensationRange: '₹22L - ₹34L',
    roleOverview:
      'Vehicle structures and stress analysis.',
    scopeOfWork: [
      'Structural design',
      'FEA analysis',
      'Design reviews'
    ],
    requirements: [
      'FEA',
      'Composite structures',
      'Mechanical design'
    ],
    experienceRange: '3-6 Years',

    skills: [
      'FEA',
      'Composite Structures',
      'Mechanical Design',
      'NX CAD'
    ],

    approvalStatus:
      'Department Approved',

    roleType: 'New Role',
    candidateCount: 18,
    interviewCount: 10,
    selectedCount: 1,
    rejectedCount: 8,
    businessJustification:
      'Role already filled.',
    createdDate: 'Apr 10',
    targetHireDate: 'Jun 01',
    departmentCode: 'STR',

    approvalWorkflow: {
      hiringManager: 'Approved',
      departmentHead: 'Approved',
      recruiter: 'Pending',
      hr: 'Pending',
      founder: 'Pending',
    },

    activityLog: [
      {
        date: 'May 12',
        action: 'Requisition Created',
        user: 'System',
      },
    ],

    comments: [
      {
        user: 'System',
        date: 'May 12',
        message: 'Requisition created.',
      },
    ],
  },
];