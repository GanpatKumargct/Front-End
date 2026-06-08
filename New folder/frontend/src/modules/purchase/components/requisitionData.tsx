import type { RequisitionItem } from './requisitionTypes';

export const requisitionData: RequisitionItem[] = [
  {
    id: 'REQ-1001',
    title: 'Flight Control Software Licensing',
    category: 'Software',
    owner: 'Digital Systems',
    department: 'Avionics',
    priority: 'High',
    vendor: 'MathWorks India',
    budget: '₹39,50,000',
    createdDate: 'May 12',
    dueDate: 'Jun 04',
    status: 'Draft',
    description:
      'Procurement request for MATLAB and Simulink enterprise licensing.',
    tags: ['MATLAB', 'Simulation', 'Controls'],
  },

  {
    id: 'REQ-1002',
    title: 'Composite Material Sheets',
    category: 'Hardware',
    owner: 'Structures Division',
    department: 'Airframe',
    priority: 'Critical',
    vendor: 'Tata Advanced Materials',
    budget: '₹1,74,00,000',
    createdDate: 'May 02',
    dueDate: 'May 28',
    status: 'Under Review',
    description:
      'Carbon composite procurement for wing structure manufacturing.',
    tags: ['Composite', 'Carbon Fiber', 'Airframe'],
  },

  {
    id: 'REQ-1003',
    title: 'Wind Tunnel Calibration',
    category: 'Facility',
    owner: 'Operations',
    department: 'Aerodynamics',
    priority: 'Medium',
    vendor: 'Siemens India',
    budget: '₹13,20,000',
    createdDate: 'Apr 28',
    dueDate: 'May 30',
    status: 'Open',
    description:
      'Calibration and certification of subsonic tunnel systems.',
    tags: ['Wind Tunnel', 'Testing', 'Calibration'],
  },

  {
    id: 'REQ-1004',
    title: 'MIL-STD Documentation Archive',
    category: 'Literature',
    owner: 'Documentation Office',
    department: 'Compliance',
    priority: 'Low',
    vendor: 'GlobalSpec',
    budget: '₹3,80,000',
    createdDate: 'May 08',
    dueDate: 'Jun 10',
    status: 'Requisition',
    description:
      'Acquisition of military and aerospace standards archive access.',
    tags: ['MIL-STD', 'Documentation', 'Compliance'],
  },

  {
    id: 'REQ-1005',
    title: 'Secure Network Switches',
    category: 'Network & IT',
    owner: 'IT Infrastructure',
    department: 'Cybersecurity',
    priority: 'High',
    vendor: 'Cisco India',
    budget: '₹52,00,000',
    createdDate: 'May 01',
    dueDate: 'May 26',
    status: 'Open',
    description:
      'Replacement of procurement network switching hardware.',
    tags: ['Cisco', 'Network', 'Security'],
  },

  {
    id: 'REQ-1006',
    title: 'Hydraulic Actuation Systems',
    category: 'Hardware',
    owner: 'Propulsion Systems',
    department: 'Mechanical',
    priority: 'Critical',
    vendor: 'Parker Hannifin India',
    budget: '₹1,48,00,000',
    createdDate: 'Apr 25',
    dueDate: 'May 24',
    status: 'Closed',
    description:
      'Hydraulic actuation assemblies for thrust vectoring system.',
    tags: ['Hydraulics', 'Actuators', 'TVC'],
  },

  {
    id: 'REQ-1007',
    title: 'Satellite Telemetry Workstations',
    category: 'Hardware',
    owner: 'Mission Control',
    department: 'Systems',
    priority: 'High',
    vendor: 'HP Enterprise',
    budget: '₹26,50,000',
    createdDate: 'May 11',
    dueDate: 'Jun 01',
    status: 'Requisition',
    description:
      'High-performance telemetry processing workstations.',
    tags: ['Telemetry', 'Ground Systems', 'Workstations'],
  },

  {
    id: 'REQ-1008',
    title: 'Thermal Simulation Software',
    category: 'Software',
    owner: 'Thermal Engineering',
    department: 'Propulsion',
    priority: 'Medium',
    vendor: 'ANSYS India',
    budget: '₹21,00,000',
    createdDate: 'May 06',
    dueDate: 'Jun 12',
    status: 'Under Review',
    description:
      'Simulation suite for propulsion thermal analysis.',
    tags: ['ANSYS', 'Thermal', 'Simulation'],
  },
];