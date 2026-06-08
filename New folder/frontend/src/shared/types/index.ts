export type CandidateStatus =
  | 'Screening'
  | 'Fitment Evaluation'
  | 'Technical Interview'
  | 'PTC Interview'
  | "Founders' Interview"
  | 'Selected'
  | 'Rejected'
  | 'Talent Pool';

export interface Candidate {
  id: string;
  name: string;
  role: string;
  department: string;
  skills: string[];
  location: string;
  appliedDate: string;
  experience: number;
  status: CandidateStatus;
  applicationSource?: 'Inbound' | 'Outbound';
  multipleRoles?: string[];
  referralSource?: string;
  noticePeriod?: string;
  expectedCompensation?: string;
  recruiterAssigned?: string;
  email?: string;
  phone?: string;
  linkedIn?: string;
  education?: string;
  currentCompany?: string;
  fitmentScore?: number;
}

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
    hiringManager: 'Pending' | 'Approved' | 'Rejected';
    departmentHead: 'Pending' | 'Approved' | 'Rejected';
    recruiter: 'Pending' | 'Approved' | 'Rejected';
    hr: 'Pending' | 'Approved' | 'Rejected';
    founder: 'Pending' | 'Approved' | 'Rejected';
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

export interface Department {
  id: string;
  name: string;
  code: string;
  openRoles: number;
  candidates: number;
  pendingApprovals: number;
}
