export interface Job {
  id: string;
  title: string;
  department: string;
  departmentCode: string;
  hiringManager: string;
  recruiterAssigned: string;
  status: 'open' | 'on_hold' | 'filled' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  openedDate: string;
  targetCloseDate: string;
  daysOpen: number;
  applicants: number;
  shortlisted: number;
  interviewed: number;
  offered: number;
  minExperience: number;
  maxExperience: number;
  location: string;
  employmentType: 'full_time' | 'contract' | 'internship';
  referrals: number;
  roleOverview: string;
  scopeOfWork: string[];
  requirements: string[];
  workModel: 'Onsite' | 'Hybrid' | 'Remote';
  compensationRange: string;
}

export const mockJobs: Job[] = [
  // ADM
  {
    id: 'REQ-1001', title: 'Senior Associate', department: 'Admin', departmentCode: 'ADM',
    hiringManager: 'Sarah Mitchell', recruiterAssigned: 'Rohan Okafor', status: 'open',
    priority: 'medium', openedDate: '2026-02-15', targetCloseDate: '2026-06-15', daysOpen: 93,
    applicants: 12, shortlisted: 3, interviewed: 1, offered: 0,
    minExperience: 5, maxExperience: 8, location: 'Chennai, IN', employmentType: 'full_time', referrals: 2,

roleOverview:
  'Support mission-critical administrative operations across enterprise aerospace programs and high-performance operational workflows.',

scopeOfWork: [
  'Coordinate operational activities across engineering and business teams',
  'Support leadership communication and workflow tracking',
  'Manage reporting, documentation, and governance processes',
  'Collaborate with HR, finance, and operations stakeholders'
],

requirements: [
  'Strong operational coordination experience',
  'Excellent communication and documentation skills',
  'Ability to manage multiple workflows simultaneously',
  'Experience in structured enterprise environments preferred'
],

workModel: 'Onsite',

compensationRange: '₹14L - ₹20L'
  },
  {
    id: 'REQ-1002', title: 'Manager', department: 'Admin', departmentCode: 'ADM',
    hiringManager: 'Sarah Mitchell', recruiterAssigned: 'Priya Sharma', status: 'open',
    priority: 'high', openedDate: '2026-01-22', targetCloseDate: '2026-05-22', daysOpen: 117,
    applicants: 8, shortlisted: 2, interviewed: 1, offered: 0,
    minExperience: 8, maxExperience: 12, location: 'Milan, IT', employmentType: 'full_time', referrals: 1,

roleOverview:
  'Support mission-critical administrative operations across enterprise aerospace programs and high-performance operational workflows.',

scopeOfWork: [
  'Coordinate operational activities across engineering and business teams',
  'Support leadership communication and workflow tracking',
  'Manage reporting, documentation, and governance processes',
  'Collaborate with HR, finance, and operations stakeholders'
],

requirements: [
  'Strong operational coordination experience',
  'Excellent communication and documentation skills',
  'Ability to manage multiple workflows simultaneously',
  'Experience in structured enterprise environments preferred'
],

workModel: 'Onsite',

compensationRange: '₹14L - ₹20L'
  },

  // AER
  {
    id: 'REQ-1010', title: 'Aerodynamics Engineer', department: 'Aerodynamics', departmentCode: 'AER',
    hiringManager: 'Dr. James Chen', recruiterAssigned: 'Rohan Okafor', status: 'open',
    priority: 'high', openedDate: '2026-03-01', targetCloseDate: '2026-07-01', daysOpen: 79,
    applicants: 24, shortlisted: 6, interviewed: 3, offered: 1,
    minExperience: 3, maxExperience: 6, location: 'Bengaluru, IN',employmentType: 'full_time',referrals: 4,

roleOverview:
  'Lead mission-critical aerospace engineering initiatives across advanced subsystem development, integration, testing, and high-performance launch vehicle programs.',

scopeOfWork: [
  'Drive subsystem engineering and cross-functional execution activities',
  'Collaborate with propulsion, avionics, systems, and manufacturing teams',
  'Support rapid engineering iteration, testing, and validation workflows',
  'Contribute to technical reviews, qualification activities, and mission readiness programs'
],

requirements: [
  'Strong aerospace or deep-tech engineering background',
  'Experience working in multidisciplinary technical environments',
  'Strong analytical and systems-level engineering fundamentals',
  'Ability to manage technical execution and documentation workflows'
],

workModel: 'Onsite',

compensationRange: '₹24L - ₹36L'
      
  },
  {
    id: 'REQ-1011', title: 'Senior Aerodynamics Engineer', department: 'Aerodynamics', departmentCode: 'AER',
    hiringManager: 'Dr. James Chen', recruiterAssigned: 'Marcus Johnson', status: 'open',
    priority: 'urgent', openedDate: '2026-02-10', targetCloseDate: '2026-06-10', daysOpen: 98,
    applicants: 19, shortlisted: 5, interviewed: 2, offered: 1,
      minExperience: 7, maxExperience: 10, location: 'Munich, DE', employmentType: 'full_time', referrals: 3,

roleOverview:
  'Lead mission-critical aerospace engineering initiatives across advanced subsystem development, integration, testing, and high-performance launch vehicle programs.',

scopeOfWork: [
  'Drive subsystem engineering and cross-functional execution activities',
  'Collaborate with propulsion, avionics, systems, and manufacturing teams',
  'Support rapid engineering iteration, testing, and validation workflows',
  'Contribute to technical reviews, qualification activities, and mission readiness programs'
],

requirements: [
  'Strong aerospace or deep-tech engineering background',
  'Experience working in multidisciplinary technical environments',
  'Strong analytical and systems-level engineering fundamentals',
  'Ability to manage technical execution and documentation workflows'
],

workModel: 'Onsite',

compensationRange: '₹24L - ₹36L',

  },
 {
id: 'REQ-1012',
title: 'Lead Aerodynamics Engineer',
department: 'Aerodynamics',
departmentCode: 'AER',

hiringManager: 'Dr. James Chen',
recruiterAssigned: 'Rohan Okafor',

status: 'open',
priority: 'urgent',

openedDate: '2026-01-05',
targetCloseDate: '2026-05-05',
daysOpen: 134,

applicants: 15,
shortlisted: 4,
interviewed: 2,
offered: 0,

minExperience: 12,
maxExperience: 18,

location: 'Nagoya, JP',

employmentType: 'full_time',

referrals: 2,

roleOverview:
'Lead aerodynamic architecture, stability analysis, and vehicle performance optimization initiatives across advanced launch vehicle development programs.',

scopeOfWork: [
'Drive aerodynamic design reviews and performance studies',
'Lead flow-field optimization and validation activities',
'Coordinate CFD, propulsion, and systems engineering interfaces',
'Support wind tunnel correlation and flight-readiness assessments'
],

requirements: [
'12+ years of aerospace engineering experience',
'Strong understanding of compressible and hypersonic flow physics',
'Experience leading aerodynamic development programs',
'Ability to mentor multidisciplinary engineering teams'
],

workModel: 'Onsite',

compensationRange: '₹48L - ₹68L'
},


  // AVI
  {
id: 'REQ-1020',
title: 'Avionics Engineer',
department: 'Avionics',
departmentCode: 'AVI',

hiringManager: 'Linda Torres',
recruiterAssigned: 'Priya Sharma',

status: 'open',
priority: 'high',

openedDate: '2026-03-15',
targetCloseDate: '2026-07-15',
daysOpen: 65,

applicants: 18,
shortlisted: 4,
interviewed: 2,
offered: 0,

minExperience: 2,
maxExperience: 5,

location: 'Hyderabad, IN',

employmentType: 'full_time',

referrals: 3,

roleOverview:
'Support development of mission-critical avionics, telemetry, and embedded flight systems for advanced aerospace vehicles.',

scopeOfWork: [
'Support avionics integration and electronics validation activities',
'Develop telemetry and embedded systems interfaces',
'Participate in hardware-in-loop testing workflows',
'Collaborate with systems and flight software teams'
],

requirements: [
'Experience with embedded systems or avionics development',
'Knowledge of flight electronics and telemetry systems',
'Understanding of aerospace hardware integration workflows',
'Strong debugging and testing skills'
],

workModel: 'Onsite',

compensationRange: '₹18L - ₹26L'
},

  {
    id: 'REQ-1021', title: 'Senior Avionics Engineer', department: 'Avionics', departmentCode: 'AVI',
    hiringManager: 'Linda Torres', recruiterAssigned: 'Marcus Johnson', status: 'open',
    priority: 'urgent', openedDate: '2026-02-20', targetCloseDate: '2026-06-20', daysOpen: 88,
    applicants: 14, shortlisted: 3, interviewed: 1, offered: 0,
    minExperience: 6, maxExperience: 10, location: 'Monterrey, MX', employmentType: 'full_time', referrals: 2
  },

  // CFD
  {
    id: 'REQ-1040', title: 'CFD Engineer', department: 'Computational Fluid Dynamics', departmentCode: 'CFD',
    hiringManager: 'Dr. Vikram Patel', recruiterAssigned: 'Rohan Okafor', status: 'open',
    priority: 'high', openedDate: '2026-03-20', targetCloseDate: '2026-07-20', daysOpen: 60,
    applicants: 16, shortlisted: 5, interviewed: 1, offered: 0,
    minExperience: 3, maxExperience: 6, location: 'Pune, IN', employmentType: 'full_time', referrals: 3
  },
  {
    id: 'REQ-1041', title: 'Senior CFD Engineer', department: 'Computational Fluid Dynamics', departmentCode: 'CFD',
    hiringManager: 'Dr. Vikram Patel', recruiterAssigned: 'Priya Sharma', status: 'open',
    priority: 'urgent', openedDate: '2026-01-28', targetCloseDate: '2026-05-28', daysOpen: 111,
    applicants: 21, shortlisted: 6, interviewed: 3, offered: 1,
    minExperience: 7, maxExperience: 12, location: 'Moscow, RU', employmentType: 'full_time', referrals: 4
  },

  // TCA
  {
    id: 'REQ-1200', title: 'Propulsion Engineer (TCA)', department: 'Propulsion — Thrust Chamber Assembly', departmentCode: 'TCA',
    hiringManager: 'Dr. Ahmed Hassan', recruiterAssigned: 'Marcus Johnson', status: 'open',
    priority: 'urgent', openedDate: '2026-03-25', targetCloseDate: '2026-08-25', daysOpen: 55,
    applicants: 22, shortlisted: 5, interviewed: 2, offered: 1,
    minExperience: 3, maxExperience: 6, location: 'Thiruvananthapuram, IN', employmentType: 'full_time', referrals: 5
  },
  {
    id: 'REQ-1201', title: 'Senior Propulsion Engineer (TCA)', department: 'Propulsion — Thrust Chamber Assembly', departmentCode: 'TCA',
    hiringManager: 'Dr. Ahmed Hassan', recruiterAssigned: 'Rohan Okafor', status: 'open',
    priority: 'urgent', openedDate: '2026-02-01', targetCloseDate: '2026-06-01', daysOpen: 107,
    applicants: 19, shortlisted: 4, interviewed: 2, offered: 0,
    minExperience: 7, maxExperience: 12, location: 'Xi\'an, CN', employmentType: 'full_time', referrals: 3
  },
  {
    id: 'REQ-1202', title: 'Lead Propulsion Engineer (TCA)', department: 'Propulsion — Thrust Chamber Assembly', departmentCode: 'TCA',
    hiringManager: 'Dr. Ahmed Hassan', recruiterAssigned: 'Priya Sharma', status: 'open',
    priority: 'high', openedDate: '2026-01-10', targetCloseDate: '2026-05-10', daysOpen: 129,
    applicants: 14, shortlisted: 3, interviewed: 2, offered: 1,
    minExperience: 13, maxExperience: 18, location: 'Tehran, IR', employmentType: 'full_time', referrals: 2
  },

  // STR
  {
    id: 'REQ-1220', title: 'Structures Engineer', department: 'Structures', departmentCode: 'STR',
    hiringManager: 'Maria Gonzalez', recruiterAssigned: 'Marcus Johnson', status: 'open',
    priority: 'medium', openedDate: '2026-04-01', targetCloseDate: '2026-08-01', daysOpen: 48,
    applicants: 17, shortlisted: 4, interviewed: 1, offered: 0,
    minExperience: 3, maxExperience: 6, location: 'Jaipur, IN', employmentType: 'full_time', referrals: 3
  },
  {
    id: 'REQ-1221', title: 'Senior Structures Engineer', department: 'Structures', departmentCode: 'STR',
    hiringManager: 'Maria Gonzalez', recruiterAssigned: 'Rohan Okafor', status: 'open',
    priority: 'high', openedDate: '2026-02-14', targetCloseDate: '2026-06-14', daysOpen: 94,
    applicants: 13, shortlisted: 3, interviewed: 2, offered: 0,
    minExperience: 8, maxExperience: 12, location: 'Vienna, AT', employmentType: 'full_time', referrals: 2
  },

  // NGC
  {
    id: 'REQ-1120', title: 'GNC Engineer', department: 'Navigation, Guidance & Control', departmentCode: 'NGC',
    hiringManager: 'Dr. Kenji Yamamoto', recruiterAssigned: 'Priya Sharma', status: 'open',
    priority: 'urgent', openedDate: '2026-03-10', targetCloseDate: '2026-07-10', daysOpen: 70,
    applicants: 20, shortlisted: 5, interviewed: 3, offered: 1,
    minExperience: 3, maxExperience: 6, location: 'Tokyo, JP', employmentType: 'full_time', referrals: 4
  },
  {
    id: 'REQ-1121', title: 'Senior GNC Engineer', department: 'Navigation, Guidance & Control', departmentCode: 'NGC',
    hiringManager: 'Dr. Kenji Yamamoto', recruiterAssigned: 'Marcus Johnson', status: 'open',
    priority: 'urgent', openedDate: '2026-01-20', targetCloseDate: '2026-05-20', daysOpen: 119,
    applicants: 16, shortlisted: 4, interviewed: 2, offered: 1,
    minExperience: 6, maxExperience: 10, location: 'Conakry, GN', employmentType: 'full_time', referrals: 3
  },

  // MME
  {
    id: 'REQ-1110', title: 'Materials Engineer', department: 'Materials & Manufacturing', departmentCode: 'MME',
    hiringManager: 'Robert Kim', recruiterAssigned: 'Rohan Okafor', status: 'open',
    priority: 'high', openedDate: '2026-03-05', targetCloseDate: '2026-07-05', daysOpen: 75,
    applicants: 18, shortlisted: 4, interviewed: 2, offered: 1,
    minExperience: 3, maxExperience: 6, location: 'Ahmedabad, IN', employmentType: 'full_time', referrals: 3
  },
  {
    id: 'REQ-1111', title: 'Senior Materials Engineer', department: 'Materials & Manufacturing', departmentCode: 'MME',
    hiringManager: 'Robert Kim', recruiterAssigned: 'Priya Sharma', status: 'open',
    priority: 'medium', openedDate: '2026-02-18', targetCloseDate: '2026-06-18', daysOpen: 90,
    applicants: 14, shortlisted: 3, interviewed: 1, offered: 0,
    minExperience: 7, maxExperience: 10, location: 'Kobe, JP', employmentType: 'full_time', referrals: 2
  },

  // SYS
  {
    id: 'REQ-1230', title: 'Systems Engineer', department: 'Systems', departmentCode: 'SYS',
    hiringManager: 'Thomas Berg', recruiterAssigned: 'Marcus Johnson', status: 'open',
    priority: 'high', openedDate: '2026-03-22', targetCloseDate: '2026-07-22', daysOpen: 58,
    applicants: 15, shortlisted: 4, interviewed: 1, offered: 0,
    minExperience: 3, maxExperience: 6, location: 'Cairo, EG', employmentType: 'full_time', referrals: 3
  },
  {
    id: 'REQ-1231', title: 'Senior Systems Engineer', department: 'Systems', departmentCode: 'SYS',
    hiringManager: 'Thomas Berg', recruiterAssigned: 'Rohan Okafor', status: 'open',
    priority: 'urgent', openedDate: '2026-02-05', targetCloseDate: '2026-06-05', daysOpen: 103,
    applicants: 12, shortlisted: 3, interviewed: 2, offered: 1,
    minExperience: 7, maxExperience: 12, location: 'Bengaluru, IN', employmentType: 'full_time', referrals: 2
  },

  // Additional roles across other departments
  {
    id: 'REQ-1030', title: 'Business Development Associate', department: 'Business Development', departmentCode: 'BDL',
    hiringManager: 'Elena Rossi', recruiterAssigned: 'Priya Sharma', status: 'open',
    priority: 'medium', openedDate: '2026-03-28', targetCloseDate: '2026-07-28', daysOpen: 52,
    applicants: 11, shortlisted: 3, interviewed: 1, offered: 0,
    minExperience: 2, maxExperience: 4, location: 'Shanghai, CN', employmentType: 'full_time', referrals: 2
  },
  {
    id: 'REQ-1060', title: 'Finance Associate', department: 'Finance & Compliance', departmentCode: 'FIN',
    hiringManager: 'David Okonkwo', recruiterAssigned: 'Marcus Johnson', status: 'open',
    priority: 'low', openedDate: '2026-04-10', targetCloseDate: '2026-08-10', daysOpen: 39,
    applicants: 9, shortlisted: 2, interviewed: 1, offered: 0,
    minExperience: 2, maxExperience: 5, location: 'Abuja, NG', employmentType: 'full_time', referrals: 1
  },
  {
    id: 'REQ-1100', title: 'Legal Associate', department: 'Legal', departmentCode: 'LEG',
    hiringManager: 'Catherine Moore', recruiterAssigned: 'Rohan Okafor', status: 'open',
    priority: 'medium', openedDate: '2026-03-18', targetCloseDate: '2026-07-18', daysOpen: 62,
    applicants: 7, shortlisted: 2, interviewed: 1, offered: 0,
    minExperience: 3, maxExperience: 6, location: 'Enugu, NG', employmentType: 'full_time', referrals: 1
  },
  {
    id: 'REQ-1150', title: 'Talent Acquisition Associate', department: 'People, Talent and Culture', departmentCode: 'PTC',
    hiringManager: 'Jennifer Liu', recruiterAssigned: 'Priya Sharma', status: 'open',
    priority: 'high', openedDate: '2026-04-05', targetCloseDate: '2026-08-05', daysOpen: 44,
    applicants: 13, shortlisted: 3, interviewed: 2, offered: 0,
    minExperience: 2, maxExperience: 4, location: 'Lahore, PK', employmentType: 'full_time', referrals: 2
  },
  {
    id: 'REQ-1250', title: 'AIT Engineer', department: 'Technology, Engineering & AIT', departmentCode: 'AIT',
    hiringManager: 'Sandeep Reddy', recruiterAssigned: 'Marcus Johnson', status: 'open',
    priority: 'urgent', openedDate: '2026-04-01', targetCloseDate: '2026-08-01', daysOpen: 48,
    applicants: 23, shortlisted: 6, interviewed: 3, offered: 1,
    minExperience: 3, maxExperience: 6, location: 'Pune, IN', employmentType: 'full_time', referrals: 5
  },
];
