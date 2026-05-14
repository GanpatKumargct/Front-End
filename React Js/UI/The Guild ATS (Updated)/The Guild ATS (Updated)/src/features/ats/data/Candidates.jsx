const mockCandidates = [
  // ─── ADM — Admin ─────────────────────────────────────────────
  {
    id: "TG-1001",
    name: "Preethi Nair",
    role: "Senior Associate",
    department: "ADM",
    skills: ["Office Management", "HRMS", "Documentation"],
    location: "Chennai, IN",
    appliedDate: "Mar 15",
    experience: 6,
    status: "Screening"
  },
  {
    id: "TG-1002",
    name: "Samuel Osei",
    role: "Associate",
    department: "ADM",
    skills: ["Calendar Management", "Vendor Coordination", "Compliance"],
    location: "Accra, GH",
    appliedDate: "Mar 22",
    experience: 3,
    status: "Fitment Evaluation"
  },
  {
    id: "TG-1003",
    name: "Giulia Ferretti",
    role: "Manager",
    department: "ADM",
    skills: ["Operations Management", "Budgeting", "Team Leadership"],
    location: "Milan, IT",
    appliedDate: "Feb 28",
    experience: 10,
    status: "Technical Interview"
  },
  // ─── AER — Aerodynamics ───────────────────────────────────────
  {
    id: "TG-1010",
    name: "Arjun Krishnamurti",
    role: "Engineer",
    department: "AER",
    skills: ["CFD", "MATLAB", "Airfoil Design"],
    location: "Bengaluru, IN",
    appliedDate: "Apr 2",
    experience: 4,
    status: "Screening"
  },
  {
    id: "TG-1011",
    name: "Hannah Schmidt",
    role: "Senior Engineer",
    department: "AER",
    skills: ["ANSYS", "Wind Tunnel Analysis", "Python"],
    location: "Munich, DE",
    appliedDate: "Mar 18",
    experience: 8,
    status: "Fitment Evaluation"
  },
  {
    id: "TG-1012",
    name: "Makoto Fujiwara",
    role: "Lead Engineer",
    department: "AER",
    skills: ["Aerodynamic Optimization", "CFD", "DATCOM"],
    location: "Nagoya, JP",
    appliedDate: "Feb 14",
    experience: 13,
    status: "Technical Interview"
  },
  {
    id: "TG-1013",
    name: "Idris Ayoola",
    role: "Engineer",
    department: "AER",
    skills: ["Lift/Drag Analysis", "MATLAB", "Flow Simulation"],
    location: "Lagos, NG",
    appliedDate: "Apr 9",
    experience: 3,
    status: "PTC Interview"
  },
  {
    id: "TG-1014",
    name: "Sophia van der Berg",
    role: "Senior Engineer",
    department: "AER",
    skills: ["Computational Aerodynamics", "OpenFOAM", "ANSYS Fluent"],
    location: "Delft, NL",
    appliedDate: "Mar 5",
    experience: 7,
    status: "Selected",
    multipleRoles: ["Engineer", "Senior Engineer"]
  },
  // ─── AVI — Avionics ───────────────────────────────────────────
  {
    id: "TG-1020",
    name: "Rahul Gupta",
    role: "Engineer",
    department: "AVI",
    skills: ["Embedded C", "RTOS", "ARM Cortex"],
    location: "Hyderabad, IN",
    appliedDate: "Apr 5",
    experience: 3,
    status: "Screening"
  },
  {
    id: "TG-1021",
    name: "Valentina Cruz",
    role: "Senior Engineer",
    department: "AVI",
    skills: ["PCB Design", "FPGA", "DO-178C"],
    location: "Monterrey, MX",
    appliedDate: "Mar 12",
    experience: 7,
    status: "Fitment Evaluation"
  },
  {
    id: "TG-1022",
    name: "Kwame Asante",
    role: "Lead Engineer",
    department: "AVI",
    skills: ["Avionics Architecture", "Signal Processing", "Verilog"],
    location: "Kumasi, GH",
    appliedDate: "Jan 29",
    experience: 12,
    status: "Technical Interview"
  },
  {
    id: "TG-1023",
    name: "Fatima Al-Rashid",
    role: "Engineer",
    department: "AVI",
    skills: ["Sensor Integration", "CAN Bus", "ARINC 429"],
    location: "Dubai, AE",
    appliedDate: "Apr 16",
    experience: 2,
    status: "Rejected"
  },
  // ─── BDL — Business Development ──────────────────────────────
  {
    id: "TG-1030",
    name: "Ling Wei",
    role: "Associate",
    department: "BDL",
    skills: ["Market Analysis", "CRM", "Research"],
    location: "Shanghai, CN",
    appliedDate: "Apr 12",
    experience: 2,
    status: "Screening"
  },
  {
    id: "TG-1031",
    name: "Marcus Johansson",
    role: "Senior Associate",
    department: "BDL",
    skills: ["Partnership Development", "Contract Negotiation", "Strategy"],
    location: "Stockholm, SE",
    appliedDate: "Mar 28",
    experience: 6,
    status: "Fitment Evaluation"
  },
  {
    id: "TG-1032",
    name: "Amina Diop",
    role: "Manager",
    department: "BDL",
    skills: ["Business Strategy", "Deal Structuring", "P&L Management"],
    location: "Dakar, SN",
    appliedDate: "Feb 18",
    experience: 11,
    status: "PTC Interview",
    multipleRoles: ["Senior Associate", "Manager"]
  },
  // ─── CFD — Computational Fluid Dynamics ──────────────────────
  {
    id: "TG-1040",
    name: "Ravi Shankar",
    role: "Engineer",
    department: "CFD",
    skills: ["ANSYS Fluent", "OpenFOAM", "MATLAB"],
    location: "Pune, IN",
    appliedDate: "Apr 20",
    experience: 4,
    status: "Screening"
  },
  {
    id: "TG-1041",
    name: "Elena Petrova",
    role: "Senior Engineer",
    department: "CFD",
    skills: ["Turbulence Modeling", "Mesh Generation", "Python"],
    location: "Moscow, RU",
    appliedDate: "Mar 9",
    experience: 8,
    status: "Technical Interview"
  },
  {
    id: "TG-1042",
    name: "Daniel M\xFCller",
    role: "Lead Engineer",
    department: "CFD",
    skills: ["High-Fidelity CFD", "CFD Post", "Reacting Flow"],
    location: "Stuttgart, DE",
    appliedDate: "Jan 22",
    experience: 14,
    status: "Founder's Interview"
  },
  {
    id: "TG-1043",
    name: "Yemi Adeyemi",
    role: "Engineer",
    department: "CFD",
    skills: ["OpenFOAM", "SU2", "Python"],
    location: "Ibadan, NG",
    appliedDate: "Apr 23",
    experience: 5,
    status: "Screening",
    multipleRoles: ["Engineer", "Senior Engineer"]
  },
  // ─── EXO — Executive Office ───────────────────────────────────
  {
    id: "TG-1050",
    name: "Catherine Fontaine",
    role: "Vice President",
    department: "EXO",
    skills: ["Corporate Strategy", "P&L Management", "Board Relations"],
    location: "Paris, FR",
    appliedDate: "Jan 15",
    experience: 18,
    status: "Technical Interview"
  },
  {
    id: "TG-1051",
    name: "Aditya Mehrotra",
    role: "Principal",
    department: "EXO",
    skills: ["Stakeholder Management", "M&A", "Org Design"],
    location: "Delhi, IN",
    appliedDate: "Feb 3",
    experience: 14,
    status: "PTC Interview"
  },
  // ─── FIN — Finance & Compliance ───────────────────────────────
  {
    id: "TG-1060",
    name: "Nkechi Okafor",
    role: "Associate",
    department: "FIN",
    skills: ["Financial Modeling", "Excel", "IFRS"],
    location: "Abuja, NG",
    appliedDate: "Apr 26",
    experience: 3,
    status: "Screening"
  },
  {
    id: "TG-1061",
    name: "Thomas Bergmann",
    role: "Senior Associate",
    department: "FIN",
    skills: ["SAP FI/CO", "Risk Management", "Budgeting"],
    location: "Frankfurt, DE",
    appliedDate: "Mar 23",
    experience: 7,
    status: "Fitment Evaluation"
  },
  {
    id: "TG-1062",
    name: "Priya Krishnan",
    role: "Manager",
    department: "FIN",
    skills: ["Compliance", "Audit", "Financial Reporting"],
    location: "Mumbai, IN",
    appliedDate: "Feb 7",
    experience: 12,
    status: "PTC Interview"
  },
  // ─── FDR — Founder Directors ──────────────────────────────────
  {
    id: "TG-1070",
    name: "Roland Chen",
    role: "Group Director",
    department: "FDR",
    skills: ["Corporate Governance", "Investment Strategy", "Board Leadership"],
    location: "Singapore, SG",
    appliedDate: "Jan 8",
    experience: 20,
    status: "Founder's Interview"
  },
  {
    id: "TG-1071",
    name: "Ingrid Larsen",
    role: "Vice President",
    department: "FDR",
    skills: ["Governance", "Risk Management", "Strategic Leadership"],
    location: "Oslo, NO",
    appliedDate: "Jan 29",
    experience: 16,
    status: "Technical Interview"
  },
  // ─── FOO — Founders' Office ───────────────────────────────────
  {
    id: "TG-1080",
    name: "Kofi Mensah",
    role: "Chief of Staff",
    department: "FOO",
    skills: ["Executive Operations", "Strategic Planning", "Leadership"],
    location: "Accra, GH",
    appliedDate: "Feb 12",
    experience: 13,
    status: "Founder's Interview"
  },
  {
    id: "TG-1081",
    name: "Aisha Kamara",
    role: "Head",
    department: "FOO",
    skills: ["Stakeholder Relations", "Team Leadership", "Communications"],
    location: "Freetown, SL",
    appliedDate: "Feb 24",
    experience: 11,
    status: "PTC Interview"
  },
  // ─── HNS — Hospitality & Security ────────────────────────────
  {
    id: "TG-1090",
    name: "Jorge Castillo",
    role: "Associate",
    department: "HNS",
    skills: ["Security Protocols", "Access Control", "Crisis Management"],
    location: "Seville, ES",
    appliedDate: "Apr 28",
    experience: 3,
    status: "Screening"
  },
  {
    id: "TG-1091",
    name: "Mei Suzuki",
    role: "Senior Associate",
    department: "HNS",
    skills: ["Event Management", "Logistics", "Hospitality Operations"],
    location: "Osaka, JP",
    appliedDate: "Mar 28",
    experience: 6,
    status: "Fitment Evaluation"
  },
  {
    id: "TG-1092",
    name: "Tariq Hassan",
    role: "Manager",
    department: "HNS",
    skills: ["Security Management", "Facilities", "SLA Management"],
    location: "Karachi, PK",
    appliedDate: "Mar 1",
    experience: 9,
    status: "Rejected"
  },
  // ─── LEG — Legal ──────────────────────────────────────────────
  {
    id: "TG-1100",
    name: "Adaeze Eze",
    role: "Associate",
    department: "LEG",
    skills: ["Contract Law", "Corporate Law", "GDPR"],
    location: "Enugu, NG",
    appliedDate: "Apr 23",
    experience: 3,
    status: "Screening"
  },
  {
    id: "TG-1101",
    name: "Viktor Sokolov",
    role: "Senior Associate",
    department: "LEG",
    skills: ["Regulatory Compliance", "IP Law", "Litigation"],
    location: "Kyiv, UA",
    appliedDate: "Mar 14",
    experience: 7,
    status: "Technical Interview"
  },
  // ─── MME — Materials & Manufacturing ─────────────────────────
  {
    id: "TG-1110",
    name: "Sanjay Patel",
    role: "Engineer",
    department: "MME",
    skills: ["Materials Science", "NDT", "ASTM Standards"],
    location: "Ahmedabad, IN",
    appliedDate: "Apr 9",
    experience: 4,
    status: "Screening"
  },
  {
    id: "TG-1111",
    name: "Yuki Yamamoto",
    role: "Senior Engineer",
    department: "MME",
    skills: ["Additive Manufacturing", "Composite Materials", "Heat Treatment"],
    location: "Kobe, JP",
    appliedDate: "Mar 18",
    experience: 8,
    status: "Fitment Evaluation"
  },
  {
    id: "TG-1112",
    name: "Isabel Rodrigues",
    role: "Lead Engineer",
    department: "MME",
    skills: ["Metallurgy", "FEA", "Process Development"],
    location: "S\xE3o Paulo, BR",
    appliedDate: "Feb 3",
    experience: 13,
    status: "Technical Interview"
  },
  {
    id: "TG-1113",
    name: "Chukwuemeka Ibe",
    role: "Engineer",
    department: "MME",
    skills: ["Fracture Mechanics", "Material Characterization", "Python"],
    location: "Port Harcourt, NG",
    appliedDate: "Apr 5",
    experience: 5,
    status: "PTC Interview",
    multipleRoles: ["Engineer", "Senior Engineer"]
  },
  {
    id: "TG-1114",
    name: "Leila Ahmadi",
    role: "Senior Engineer",
    department: "MME",
    skills: ["Titanium Alloys", "Superalloys", "Welding Metallurgy"],
    location: "Tehran, IR",
    appliedDate: "Jan 22",
    experience: 9,
    status: "Selected"
  },
  // ─── NGC — Navigation, Guidance & Control ────────────────────
  {
    id: "TG-1120",
    name: "Daisuke Nakamura",
    role: "Engineer",
    department: "NGC",
    skills: ["Control Systems", "MATLAB/Simulink", "Python"],
    location: "Tokyo, JP",
    appliedDate: "Apr 16",
    experience: 4,
    status: "Screening"
  },
  {
    id: "TG-1121",
    name: "Amara Balde",
    role: "Senior Engineer",
    department: "NGC",
    skills: ["GNC Algorithms", "Kalman Filter", "Navigation Systems"],
    location: "Conakry, GN",
    appliedDate: "Mar 5",
    experience: 7,
    status: "Fitment Evaluation"
  },
  {
    id: "TG-1122",
    name: "Ivan Petrov",
    role: "Lead Engineer",
    department: "NGC",
    skills: ["Flight Mechanics", "Attitude Determination", "C++"],
    location: "St. Petersburg, RU",
    appliedDate: "Jan 15",
    experience: 15,
    status: "Technical Interview"
  },
  {
    id: "TG-1123",
    name: "Nadia Osei",
    role: "Engineer",
    department: "NGC",
    skills: ["Inertial Navigation", "Python", "MATLAB"],
    location: "Cape Coast, GH",
    appliedDate: "Apr 20",
    experience: 3,
    status: "PTC Interview"
  },
  {
    id: "TG-1124",
    name: "Sebasti\xE3o Lima",
    role: "Senior Engineer",
    department: "NGC",
    skills: ["Trajectory Optimization", "ROS", "Embedded Systems"],
    location: "Bras\xEDlia, BR",
    appliedDate: "Feb 18",
    experience: 8,
    status: "Founder's Interview",
    multipleRoles: ["Engineer", "Senior Engineer"]
  },
  // ─── NIT — Networks & IT ──────────────────────────────────────
  {
    id: "TG-1130",
    name: "Ayaan Kapoor",
    role: "Engineer",
    department: "NIT",
    skills: ["Network Architecture", "Linux", "DevOps"],
    location: "Gurgaon, IN",
    appliedDate: "Apr 26",
    experience: 3,
    status: "Screening"
  },
  {
    id: "TG-1131",
    name: "Zofia Kowalska",
    role: "Senior Engineer",
    department: "NIT",
    skills: ["Cybersecurity", "SIEM", "Cloud (AWS)"],
    location: "Warsaw, PL",
    appliedDate: "Mar 14",
    experience: 7,
    status: "Technical Interview"
  },
  {
    id: "TG-1132",
    name: "Emeka Nwosu",
    role: "Engineer",
    department: "NIT",
    skills: ["Firewall Management", "VMware", "Python Automation"],
    location: "Lagos, NG",
    appliedDate: "Mar 28",
    experience: 4,
    status: "Fitment Evaluation"
  },
  // ─── OPS — Operations ─────────────────────────────────────────
  {
    id: "TG-1140",
    name: "Hassan Al-Farsi",
    role: "Engineer",
    department: "OPS",
    skills: ["Launch Operations", "Safety Protocols", "Lean Operations"],
    location: "Muscat, OM",
    appliedDate: "Apr 12",
    experience: 4,
    status: "Screening"
  },
  {
    id: "TG-1141",
    name: "Pita Havili",
    role: "Senior Engineer",
    department: "OPS",
    skills: ["Ground Support", "FRACAS", "ISO 9001"],
    location: "Suva, FJ",
    appliedDate: "Mar 23",
    experience: 8,
    status: "Fitment Evaluation"
  },
  {
    id: "TG-1142",
    name: "Claudia Reyes",
    role: "Lead Engineer",
    department: "OPS",
    skills: ["Operations Research", "Process Optimization", "KPI Reporting"],
    location: "Bogot\xE1, CO",
    appliedDate: "Feb 7",
    experience: 12,
    status: "Technical Interview"
  },
  {
    id: "TG-1143",
    name: "Tobias Fischer",
    role: "Senior Engineer",
    department: "OPS",
    skills: ["Logistics", "Supply Chain", "ERP Systems"],
    location: "Hamburg, DE",
    appliedDate: "Mar 5",
    experience: 9,
    status: "PTC Interview"
  },
  // ─── PTC — People, Talent and Culture ────────────────────────
  {
    id: "TG-1150",
    name: "Zara Ahmed",
    role: "Associate",
    department: "PTC",
    skills: ["Talent Acquisition", "HRIS", "Onboarding"],
    location: "Lahore, PK",
    appliedDate: "Apr 28",
    experience: 2,
    status: "Screening"
  },
  {
    id: "TG-1151",
    name: "Oluwafemi Adesanya",
    role: "Senior Associate",
    department: "PTC",
    skills: ["Employee Relations", "L&D", "Compensation Design"],
    location: "Lagos, NG",
    appliedDate: "Mar 18",
    experience: 6,
    status: "Fitment Evaluation"
  },
  {
    id: "TG-1152",
    name: "Keiko Tanaka",
    role: "Lead Associate",
    department: "PTC",
    skills: ["Org Design", "Culture Programs", "HR Strategy"],
    location: "Kyoto, JP",
    appliedDate: "Feb 24",
    experience: 10,
    status: "PTC Interview"
  },
  // ─── PRC — Process ────────────────────────────────────────────
  {
    id: "TG-1160",
    name: "Maxime Dubois",
    role: "Engineer",
    department: "PRC",
    skills: ["Lean Six Sigma", "Process Engineering", "PDCA"],
    location: "Lyon, FR",
    appliedDate: "Apr 20",
    experience: 4,
    status: "Screening"
  },
  {
    id: "TG-1161",
    name: "Aditi Singh",
    role: "Senior Engineer",
    department: "PRC",
    skills: ["Value Stream Mapping", "Root Cause Analysis", "Kaizen"],
    location: "Noida, IN",
    appliedDate: "Mar 9",
    experience: 7,
    status: "Fitment Evaluation"
  },
  {
    id: "TG-1162",
    name: "Carlos Mendez",
    role: "Lead Engineer",
    department: "PRC",
    skills: ["Process Automation", "Statistical Analysis", "Industry 4.0"],
    location: "Guadalajara, MX",
    appliedDate: "Feb 14",
    experience: 12,
    status: "Technical Interview",
    multipleRoles: ["Senior Engineer", "Lead Engineer"]
  },
  // ─── PNC — Procurement & Commissioning ───────────────────────
  {
    id: "TG-1170",
    name: "Lena Weber",
    role: "Engineer",
    department: "PNC",
    skills: ["Procurement", "Vendor Management", "SAP MM"],
    location: "Berlin, DE",
    appliedDate: "Apr 26",
    experience: 3,
    status: "Screening"
  },
  {
    id: "TG-1171",
    name: "Olusegun Bello",
    role: "Senior Engineer",
    department: "PNC",
    skills: ["Supply Chain", "Contract Management", "AS9100"],
    location: "Abuja, NG",
    appliedDate: "Mar 23",
    experience: 8,
    status: "Fitment Evaluation"
  },
  {
    id: "TG-1172",
    name: "Park Ji-Yeon",
    role: "Engineer",
    department: "PNC",
    skills: ["Strategic Sourcing", "Commissioning", "Supplier Qualification"],
    location: "Seoul, KR",
    appliedDate: "Mar 14",
    experience: 4,
    status: "Technical Interview"
  },
  // ─── PRJ — Projects ───────────────────────────────────────────
  {
    id: "TG-1180",
    name: "Miriam Khoury",
    role: "Engineer",
    department: "PRJ",
    skills: ["Project Management", "MS Project", "Agile/Scrum"],
    location: "Beirut, LB",
    appliedDate: "May 1",
    experience: 4,
    status: "Screening"
  },
  {
    id: "TG-1181",
    name: "Anders Holm",
    role: "Senior Engineer",
    department: "PRJ",
    skills: ["Risk Management", "Stakeholder Management", "PMP"],
    location: "Copenhagen, DK",
    appliedDate: "Mar 28",
    experience: 9,
    status: "Fitment Evaluation"
  },
  {
    id: "TG-1182",
    name: "Yasmin Osman",
    role: "Lead Engineer",
    department: "PRJ",
    skills: ["Programme Management", "EVM", "PMI"],
    location: "Khartoum, SD",
    appliedDate: "Feb 3",
    experience: 14,
    status: "PTC Interview"
  },
  {
    id: "TG-1183",
    name: "Kavya Rao",
    role: "Senior Engineer",
    department: "PRJ",
    skills: ["Project Controls", "Scheduling", "PRINCE2"],
    location: "Bengaluru, IN",
    appliedDate: "Feb 28",
    experience: 8,
    status: "Founder's Interview",
    multipleRoles: ["Engineer", "Senior Engineer"]
  },
  // ─── PRI — Projects, Infrastructure ──────────────────────────
  {
    id: "TG-1190",
    name: "Olga Kuznetsova",
    role: "Engineer",
    department: "PRI",
    skills: ["Infrastructure Planning", "Civil Engineering", "Facilities"],
    location: "Novosibirsk, RU",
    appliedDate: "May 5",
    experience: 4,
    status: "Screening"
  },
  {
    id: "TG-1191",
    name: "Ahmad Mansouri",
    role: "Senior Engineer",
    department: "PRI",
    skills: ["Capex Management", "Construction Management", "AutoCAD"],
    location: "Isfahan, IR",
    appliedDate: "Mar 9",
    experience: 8,
    status: "Technical Interview"
  },
  {
    id: "TG-1192",
    name: "Njoku Eze",
    role: "Lead Engineer",
    department: "PRI",
    skills: ["Infrastructure Strategy", "BIM", "Site Development"],
    location: "Enugu, NG",
    appliedDate: "Jan 29",
    experience: 13,
    status: "PTC Interview"
  },
  // ─── TCA — Propulsion, Thrust Chamber Assembly ───────────────
  {
    id: "TG-1200",
    name: "Sreejith Nambiar",
    role: "Engineer",
    department: "TCA",
    skills: ["Combustion Analysis", "Thermal Analysis", "CFD"],
    location: "Thiruvananthapuram, IN",
    appliedDate: "May 3",
    experience: 4,
    status: "Screening"
  },
  {
    id: "TG-1201",
    name: "Xian Zhao",
    role: "Senior Engineer",
    department: "TCA",
    skills: ["Propellant Systems", "Injector Design", "Heat Transfer"],
    location: "Xi'an, CN",
    appliedDate: "Apr 28",
    experience: 8,
    status: "Screening"
  },
  {
    id: "TG-1202",
    name: "Reza Hosseini",
    role: "Lead Engineer",
    department: "TCA",
    skills: ["Rocket Propulsion", "Nozzle Design", "Combustion Instability"],
    location: "Tehran, IR",
    appliedDate: "Feb 7",
    experience: 14,
    status: "Fitment Evaluation"
  },
  {
    id: "TG-1203",
    name: "Olumide Adegoke",
    role: "Senior Engineer",
    department: "TCA",
    skills: ["Thrust Chamber Design", "Regenerative Cooling", "FEA"],
    location: "Ibadan, NG",
    appliedDate: "Mar 18",
    experience: 9,
    status: "Technical Interview"
  },
  {
    id: "TG-1204",
    name: "Felipe Morales",
    role: "Lead Engineer",
    department: "TCA",
    skills: ["Propulsion Architecture", "Test Operations", "System Integration"],
    location: "Santiago, CL",
    appliedDate: "Jan 8",
    experience: 15,
    status: "Founder's Interview",
    multipleRoles: ["Senior Engineer", "Lead Engineer"]
  },
  {
    id: "TG-1205",
    name: "Tanveer Ahmed",
    role: "Engineer",
    department: "TCA",
    skills: ["Cryogenic Systems", "Propellant Feed", "CAD Modelling"],
    location: "Dhaka, BD",
    appliedDate: "Mar 5",
    experience: 3,
    status: "Selected"
  },
  // ─── TBM — Propulsion, Turbomachinery ────────────────────────
  {
    id: "TG-1210",
    name: "Haruto Kobayashi",
    role: "Engineer",
    department: "TBM",
    skills: ["Turbomachinery Design", "Fluid Mechanics", "CFD"],
    location: "Yokohama, JP",
    appliedDate: "May 7",
    experience: 3,
    status: "Screening"
  },
  {
    id: "TG-1211",
    name: "Sinead O'Brien",
    role: "Senior Engineer",
    department: "TBM",
    skills: ["Compressor Design", "Rotordynamics", "ANSYS"],
    location: "Dublin, IE",
    appliedDate: "Mar 28",
    experience: 8,
    status: "Fitment Evaluation"
  },
  {
    id: "TG-1212",
    name: "Raj Krishnamurthy",
    role: "Lead Engineer",
    department: "TBM",
    skills: ["Pump Design", "Bearing Analysis", "FEA"],
    location: "Chennai, IN",
    appliedDate: "Feb 12",
    experience: 13,
    status: "Technical Interview"
  },
  {
    id: "TG-1213",
    name: "Oumar Diallo",
    role: "Senior Engineer",
    department: "TBM",
    skills: ["Turbine Aerodynamics", "Thermal Analysis", "MATLAB"],
    location: "Bamako, ML",
    appliedDate: "Mar 14",
    experience: 7,
    status: "PTC Interview",
    multipleRoles: ["Engineer", "Senior Engineer"]
  },
  {
    id: "TG-1214",
    name: "Fernanda Costa",
    role: "Engineer",
    department: "TBM",
    skills: ["Impeller Design", "Computational Methods", "Python"],
    location: "Curitiba, BR",
    appliedDate: "Apr 16",
    experience: 4,
    status: "Rejected"
  },
  // ─── STR — Structures ─────────────────────────────────────────
  {
    id: "TG-1220",
    name: "Aarav Sharma",
    role: "Engineer",
    department: "STR",
    skills: ["FEA", "NASTRAN", "Load Analysis"],
    location: "Jaipur, IN",
    appliedDate: "May 9",
    experience: 4,
    status: "Screening"
  },
  {
    id: "TG-1221",
    name: "Julia Braun",
    role: "Senior Engineer",
    department: "STR",
    skills: ["Composite Structures", "Fatigue Analysis", "CATIA"],
    location: "Vienna, AT",
    appliedDate: "Mar 18",
    experience: 9,
    status: "Fitment Evaluation"
  },
  {
    id: "TG-1222",
    name: "Kwabena Asare",
    role: "Lead Engineer",
    department: "STR",
    skills: ["Structural Architecture", "Buckling Analysis", "ABAQUS"],
    location: "Accra, GH",
    appliedDate: "Jan 22",
    experience: 14,
    status: "Technical Interview"
  },
  {
    id: "TG-1223",
    name: "Lyudmila Volkova",
    role: "Senior Engineer",
    department: "STR",
    skills: ["Dynamic Analysis", "Stress Analysis", "NASTRAN"],
    location: "Minsk, BY",
    appliedDate: "Feb 7",
    experience: 10,
    status: "Founder's Interview"
  },
  {
    id: "TG-1224",
    name: "Babatunde Williams",
    role: "Engineer",
    department: "STR",
    skills: ["Topology Optimization", "Python", "CAD Modelling"],
    location: "Ibadan, NG",
    appliedDate: "Apr 9",
    experience: 3,
    status: "Rejected"
  },
  // ─── SYS — Systems ────────────────────────────────────────────
  {
    id: "TG-1230",
    name: "Omar Mansour",
    role: "Engineer",
    department: "SYS",
    skills: ["Systems Engineering", "MBSE", "SysML"],
    location: "Cairo, EG",
    appliedDate: "May 3",
    experience: 4,
    status: "Screening"
  },
  {
    id: "TG-1231",
    name: "Shreya Iyer",
    role: "Senior Engineer",
    department: "SYS",
    skills: ["Requirements Management", "DOORS", "Interface Control"],
    location: "Bengaluru, IN",
    appliedDate: "Mar 22",
    experience: 8,
    status: "Fitment Evaluation"
  },
  {
    id: "TG-1232",
    name: "Benedikt Wagner",
    role: "Lead Engineer",
    department: "SYS",
    skills: ["System Architecture", "V&V", "Trade Study Analysis"],
    location: "Zurich, CH",
    appliedDate: "Jan 29",
    experience: 14,
    status: "Technical Interview"
  },
  {
    id: "TG-1233",
    name: "Afolabi Bakare",
    role: "Senior Engineer",
    department: "SYS",
    skills: ["Systems Integration", "Failure Analysis", "Python"],
    location: "Abuja, NG",
    appliedDate: "Mar 1",
    experience: 9,
    status: "Selected",
    multipleRoles: ["Senior Engineer", "Lead Engineer"]
  },
  // ─── SRQ — Systems Reliability & Quality ─────────────────────
  {
    id: "TG-1240",
    name: "Roshni Pillai",
    role: "Engineer",
    department: "SRQ",
    skills: ["Quality Management", "FMEA", "ISO 9001"],
    location: "Kochi, IN",
    appliedDate: "May 7",
    experience: 3,
    status: "Screening"
  },
  {
    id: "TG-1241",
    name: "Kazuki Ito",
    role: "Senior Engineer",
    department: "SRQ",
    skills: ["Reliability Engineering", "AS9100", "Root Cause Analysis"],
    location: "Nagoya, JP",
    appliedDate: "Mar 28",
    experience: 7,
    status: "Fitment Evaluation"
  },
  {
    id: "TG-1242",
    name: "Amaru Condori",
    role: "Lead Engineer",
    department: "SRQ",
    skills: ["FRACAS", "Failure Investigation", "Statistical Analysis"],
    location: "Lima, PE",
    appliedDate: "Feb 18",
    experience: 12,
    status: "Technical Interview"
  },
  // ─── AIT — Technology, Engineering & AIT ─────────────────────
  {
    id: "TG-1250",
    name: "Divya Nair",
    role: "Engineer",
    department: "AIT",
    skills: ["Systems Integration", "Hardware Qualification", "Python"],
    location: "Pune, IN",
    appliedDate: "May 9",
    experience: 4,
    status: "Screening"
  },
  {
    id: "TG-1251",
    name: "Samuel Ekwueme",
    role: "Technician",
    department: "AIT",
    skills: ["Avionics Checkout", "Cable Harness", "Assembly"],
    location: "Enugu, NG",
    appliedDate: "Apr 23",
    experience: 5,
    status: "Fitment Evaluation"
  },
  {
    id: "TG-1252",
    name: "Hiroshi Tanaka",
    role: "Senior Engineer",
    department: "AIT",
    skills: ["Test Systems", "GSE Development", "Integration Planning"],
    location: "Tsukuba, JP",
    appliedDate: "Mar 5",
    experience: 8,
    status: "Technical Interview"
  },
  {
    id: "TG-1253",
    name: "Layla Hassan",
    role: "Technician",
    department: "AIT",
    skills: ["Electrical Testing", "Connector Assembly", "Quality Inspection"],
    location: "Alexandria, EG",
    appliedDate: "Apr 16",
    experience: 4,
    status: "PTC Interview",
    multipleRoles: ["Technician", "Engineer"]
  },
  {
    id: "TG-1254",
    name: "Vikram Mehta",
    role: "Lead Engineer",
    department: "AIT",
    skills: ["AIT Programme Management", "Launch Campaign", "Risk Mitigation"],
    location: "Bengaluru, IN",
    appliedDate: "Jan 15",
    experience: 15,
    status: "Selected"
  }
];
export {
  mockCandidates
};
