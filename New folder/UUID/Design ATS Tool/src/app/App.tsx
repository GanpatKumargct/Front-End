import { useState, useEffect, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { KanbanBoard } from './components/KanbanBoard';
import { ListView } from './components/ListView';
import { ThemeToggle } from './components/ThemeToggle';
import { FilterPanel } from './components/FilterPanel';
import { NewJobModal } from './components/NewJobModal';
import { GuildLogo } from './components/GuildLogo';
import { AnalyticsPage } from './components/AnalyticsPage';
import { DashboardPage } from './components/DashboardPage';
import PurchaseDashboard from './components/Purchase/PurchaseDashboard';
import PurchaseModule from './components/Purchase/PurchaseModule'
import RequisitionPage from './components/Purchase/RequisitionPage'
import RequisitionWorkspace from './components/Purchase/RequisitionWorkspace'
import { InterviewsPage } from './components/InterviewsPage';
import { SettingsPage } from './components/SettingsPage';
import { RolesView } from './components/RolesView';
import { CandidateProfile } from './components/CandidateProfile';
import { ReferralsPage } from './components/ReferralsPage';
import { BackButton } from './components/ui/BackButton';
import { ERPModuleCatalog } from './components/ERPModuleCatalog';
import ATSRequisitionPage from './components/RequisitionPage';
import { departments } from '../Data/Departments';
import { mockCandidates } from '../Data/Candidates';
import { mockJobs } from '../Data/Jobs';
import {
  FileText,
  LayoutGrid,
  List,
  Filter,
  Plus,
  Search,
  Home,
  Briefcase,
  Users,
  CalendarDays,
  BarChart3,
  Settings,
  ChevronDown,
  ArrowLeft,
  UserCheck,
  Bell,
  User,
  LogOut,
} from 'lucide-react';

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

type AppView = 'erp-access' | 'erp-modules' | 'erp-home' | 'ats' | 'purchase';
type ActiveTab =
  | 'dashboard'
  | 'requisitions'
  | 'jobs'
  | 'candidates'
  | 'interviews'
  | 'analytics'
  | 'referrals'
  | 'settings';
type PurchaseTab =
  | 'dashboard'
  | 'requisition'
  | 'sourcing'
  | 'procurement'
  | 'approvals'
  | 'payments'
  | 'vendors';

export default function App() {
  const [candidateStageFilter, setCandidateStageFilter] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [purchaseTab, setPurchaseTab] = useState<PurchaseTab>('dashboard');
  const [activeRequisitionCategory, setActiveRequisitionCategory] = useState<string | null>(null);
  const [appView, setAppView] = useState<AppView>('erp-access');
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<{ id: string; title: string } | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showNewJobModal, setShowNewJobModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CandidateStatus | 'All'>('All');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const columnRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const updateCandidateStatus = (candidateId: string, newStatus: CandidateStatus) => {
    setCandidates(prev =>
      prev.map(c => c.id === candidateId ? { ...c, status: newStatus } : c)
    );
    // Update selected candidate if it's the one being changed
    if (selectedCandidate && selectedCandidate.id === candidateId) {
      setSelectedCandidate(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleCandidateClick = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
  };

  const statuses: CandidateStatus[] = [
    'Screening',
    'Fitment Evaluation',
    'Technical Interview',
    'PTC Interview',
    "Founders' Interview",
    'Selected',
    'Rejected',
    'Talent Pool',
  ];

  const baseFiltered = candidates.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

 const dashboardFilteredCandidates = candidateStageFilter
  ? baseFiltered.filter(c => c.status === candidateStageFilter)
  : baseFiltered;

const filteredByCategory =
  activeCategory === 'All'
    ? dashboardFilteredCandidates
    : dashboardFilteredCandidates.filter(
        c => c.status === activeCategory
      );

  const statusCounts = statuses.reduce((acc, status) => {
    acc[status] = candidates.filter(c => c.status === status).length;
    return acc;
  }, {} as Record<CandidateStatus, number>);

  const scrollToColumn = (status: CandidateStatus) => {
    const el = columnRefs.current[status];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  };

  const handleCategoryClick = (category: CandidateStatus | 'All') => {
    setActiveCategory(category);
    if (category !== 'All' && view === 'kanban') scrollToColumn(category);
  };

  const showPipelineHeader =
  appView !== 'purchase' &&
  activeTab === 'candidates';

  // ── Jobs view ──────────────────────────────────────────────────────
  const renderJobsView = () => {
    // LEVEL 3: Role Candidate Pipeline
    if (selectedRole && selectedDepartment) {
      const dept = departments.find(d => d.id === selectedDepartment);
      const roleCandidates = baseFiltered.filter(c =>
        c.department === selectedDepartment &&
        c.role === selectedRole.title
      );
      const roleFiltered = activeCategory === 'All'
        ? roleCandidates
        : roleCandidates.filter(c => c.status === activeCategory);

      return (
        <div className="flex flex-col h-full">
          {/* Breadcrumb */}
          <div className="px-5 pt-4 pb-3 border-b border-border/40">
            <BackButton onClick={() => setSelectedRole(null)} label="Back to Roles" className="mb-2" />
            <div>
              <h2 className="text-base font-semibold">{selectedRole.title}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {dept?.name} · {roleCandidates.length} Applicants
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-hidden p-5">
            {roleFiltered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                <Users className="w-8 h-8 mb-2 opacity-30" />
                <p className="text-sm">No candidates for this role yet.</p>
              </div>
            ) : view === 'kanban' ? (
              <KanbanBoard
                candidates={roleFiltered}
                statuses={statuses}
                onStatusChange={updateCandidateStatus}
                columnRefs={columnRefs}
                onCandidateClick={handleCandidateClick}
              />
            ) : (
              <ListView
                candidates={roleFiltered}
                onStatusChange={updateCandidateStatus}
                onCandidateClick={handleCandidateClick}
              />
            )}
          </div>
        </div>
      );
    }

    // LEVEL 2: Department Roles View
    if (selectedDepartment) {
      const dept = departments.find(d => d.id === selectedDepartment);
      return (
        <RolesView
          departmentId={selectedDepartment}
          departmentName={dept?.name || ''}
          onBack={() => { setSelectedDepartment(null); setActiveCategory('All'); }}
          onRoleClick={(jobId, jobTitle) => setSelectedRole({ id: jobId, title: jobTitle })}
        />
      );
    }

    // LEVEL 1: Departments View
    if (!selectedDepartment) {
      return (
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold tracking-tight mb-0.5">Department Hiring</h2>
              <p className="text-xs text-muted-foreground">{departments.length} departments · {mockJobs.filter(j => j.status === 'open').length} open requisitions · {candidates.length} total applicants</p>
            </div>
            <button
              onClick={() => setShowNewJobModal(true)}
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              New Job
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {departments.map((dept) => {
              const deptCandidates = candidates.filter(c => c.department === dept.code);
              const deptJobs = mockJobs.filter(j => j.departmentCode === dept.code && j.status === 'open');
              const shortlisted = deptCandidates.filter(c =>
                ['Technical Interview', 'PTC Interview', "Founders' Interview"].includes(c.status)
              ).length;
              const interviews = deptCandidates.filter(c =>
                ['PTC Interview', "Founders' Interview"].includes(c.status)
              ).length;
              const hires = deptCandidates.filter(c => c.status === 'Selected').length;
              const progress = dept.openRoles > 0 ? Math.min(100, Math.round((hires / dept.openRoles) * 100)) : 0;

              // Calculate avg days open for this department's jobs
              const avgDaysOpen = deptJobs.length > 0
                ? Math.round(deptJobs.reduce((sum, job) => sum + job.daysOpen, 0) / deptJobs.length)
                : 0;

              // Get hiring manager from first job (in real app, would be dept-level)
              const hiringManager = deptJobs[0]?.hiringManager || 'Unassigned';
              const recruiter = deptJobs[0]?.recruiterAssigned || 'Unassigned';

              // Count urgent roles
              const urgentRoles = deptJobs.filter(j => j.priority === 'urgent').length;

              return (
                <button
                  key={dept.id}
                  onClick={() => setSelectedDepartment(dept.id)}
                  className="p-5 rounded-xl border border-border bg-card hover:bg-muted/20 dark:hover:bg-white/[0.04] transition-all duration-200 text-left group hover:border-border/80 hover:shadow-md"
                  style={{
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  }}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-widest bg-muted/50 text-muted-foreground">
                          {dept.code}
                        </span>
                        {urgentRoles > 0 && (
                          <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-semibold bg-red-500/10 text-red-500 border border-red-500/20">
                            {urgentRoles} URGENT
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-semibold leading-tight text-foreground group-hover:text-foreground">
                        {dept.name}
                      </h3>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-foreground">{deptCandidates.length}</div>
                      <div className="text-[10px] text-muted-foreground">applicants</div>
                    </div>
                  </div>

                  {/* Stats grid */}
                   <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Open Roles</span>
                      <span className="font-semibold">{dept.openRoles}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Shortlisted</span>
                      <span className="font-semibold">{shortlisted}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Interviews</span>
                      <span className="font-semibold">{interviews}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Pending</span>
                      <span className="font-semibold">{dept.pendingApprovals}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Hires</span>
                      <span className="font-semibold text-foreground">{hires}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Avg Age</span>
                      <span className={`font-semibold ${avgDaysOpen > 90 ? 'text-red-500' : avgDaysOpen > 60 ? 'text-amber-500' : ''}`}>
                        {avgDaysOpen}d
                      </span>
                    </div>
                  </div>
                  
                 {/* Application Flow */}
<div className="mb-3 border-t border-border/40 pt-2.5">
  <div className="grid grid-cols-2 gap-4 text-xs">

    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">
        Inbound
      </span>

      <span className="font-semibold text-emerald-400">
        {
          deptCandidates.filter(
            c => c.applicationSource === 'Inbound'
          ).length
        }
      </span>
    </div>

    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">
        Outbound
      </span>

      <span className="font-semibold text-amber-400">
        {
          deptCandidates.filter(
            c => c.applicationSource === 'Outbound'
          ).length
        }
      </span>
    </div>

  </div>
</div>

                  {/* Footer */}
                  <div className="flex flex-col gap-1 text-[10px] text-muted-foreground border-t border-border/50 pt-2.5">
                    <div className="flex items-center justify-between">
                      <span>Manager: {hiringManager.split(' ')[0]}</span>
                      <span>Recruiter: {recruiter.split(' ')[0]}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      );
    }
  };

  // ── Candidates view ────────────────────────────────────────────────
  const renderCandidatesView = () => (
    <div className="p-5">
      {view === 'kanban' ? (
        <KanbanBoard
          candidates={filteredByCategory}
          statuses={statuses}
          onStatusChange={updateCandidateStatus}
          columnRefs={columnRefs}
          onCandidateClick={handleCandidateClick}
        />
      ) : (
        <ListView
          candidates={filteredByCategory}
          onStatusChange={updateCandidateStatus}
          onCandidateClick={handleCandidateClick}
        />
      )}
    </div>
  );

  // ── Placeholder views ──────────────────────────────────────────────
  const renderERPAccess = () => (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
    <div className="absolute top-10 left-1/2 -translate-x-1/2">
      <GuildLogo className="h-20 w-20" theme={theme} />
    </div>

    <div className="w-[480px] rounded-2xl border border-border bg-card/60 backdrop-blur-xl p-10 flex flex-col items-center text-center shadow-2xl">
      <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
        Welcome back, Gautham
      </p>

      <h1
        className="text-3xl mb-3"
        style={{
          fontFamily: 'Fauna Thin, serif',
          fontWeight: 100,
          letterSpacing: '0.06em',
        }}
      >
        The Guild ERP
      </h1>

      <p className="text-sm text-muted-foreground max-w-sm leading-relaxed mb-10">
        Unified Enterprise Operations Platform
      </p>

      <button
  onClick={() => setAppView('erp-modules')}
  className="px-8 py-3 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-90 transition-all duration-200"
>
        Access Platform
      </button>
    </div>
    </div>
  );

  const renderERPModules = () => (
    <div className="min-h-screen bg-background flex items-center justify-center p-10">
    <div className="w-full max-w-5xl">
      <div className="mb-12 text-center">
        <h1
          className="text-3xl mb-3"
          style={{
            fontFamily: 'Fauna Thin, serif',
            fontWeight: 100,
            letterSpacing: '0.06em',
          }}
        >
          Enterprise Modules
        </h1>

        <p className="text-muted-foreground text-sm">
          Select an operational system
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <button
          onClick={() => setAppView('ats')}
          className="p-8 rounded-2xl border border-border bg-card hover:bg-muted/20 transition-all duration-200 text-left"
        >
          <div className="mb-6">
            <Briefcase className="w-8 h-8 text-foreground/80" />
          </div>

          <h2 className="text-lg font-semibold mb-2">
            ATS Platform
          </h2>

          <p className="text-sm text-muted-foreground leading-relaxed">
            Recruitment operations, hiring pipelines, referrals, interviews, and workforce acquisition.
          </p>
        </button>

        <div className="p-8 rounded-2xl border border-border bg-card/40 opacity-50">
          <h2 className="text-lg font-semibold mb-2">
            HRMS
          </h2>
          <p className="text-sm text-muted-foreground">
            Coming soon
          </p>
        </div>

        <button
  onClick={() => setAppView('purchase')}
  className="p-8 rounded-2xl border border-border bg-card hover:bg-muted/20 transition-all duration-200 text-left"
>
  <div className="mb-6">
    <Briefcase className="w-8 h-8 text-foreground/80" />
  </div>

  <h2 className="text-lg font-semibold mb-2">
    Procurement
  </h2>

  <p className="text-sm text-muted-foreground leading-relaxed">
    Vendor management, RFQs, procurement operations, supplier workflows, and acquisition systems.
  </p>
</button>
      </div>
    </div>
  </div>
);

  const renderPlaceholder = (label: string, icon: React.ReactNode) => (
    <div className="flex flex-col items-center justify-center h-64 text-muted-foreground gap-3">
      <div className="opacity-30">{icon}</div>
      <p className="text-sm">{label} — coming soon.</p>
    </div>
  );

 const sidebarItems: { icon: any; label: string; tab: ActiveTab }[] = [
  { icon: Home, label: 'Dashboard', tab: 'dashboard' },

  { icon: FileText, label: 'Requisitions', tab: 'requisitions' },

  { icon: Briefcase, label: 'Jobs', tab: 'jobs' },

  { icon: Users, label: 'Candidates', tab: 'candidates' },

  { icon: CalendarDays, label: 'Interviews', tab: 'interviews' },

  { icon: UserCheck, label: 'Referrals', tab: 'referrals' },

  { icon: BarChart3, label: 'Analytics', tab: 'analytics' },

  { icon: Settings, label: 'Settings', tab: 'settings' },
];

  const purchaseSidebarItems = [
  { icon: Home, label: 'Dashboard', tab: 'dashboard' },
  { icon: Briefcase, label: 'Requisition', tab: 'requisition' },
  { icon: Search, label: 'Sourcing', tab: 'sourcing' },
  { icon: LayoutGrid, label: 'Procurement', tab: 'procurement' },
  { icon: UserCheck, label: 'Approvals', tab: 'approvals' },
  { icon: BarChart3, label: 'Payments', tab: 'payments' },
  { icon: Users, label: 'Vendors', tab: 'vendors' },
];

  if (appView === 'erp-access') {
    return renderERPAccess();
  }

  if (appView === 'erp-modules') {
    return renderERPModules();
  }

  if (appView === 'erp-home') {
    return (
      <div className="min-h-screen bg-background">
        <ERPModuleCatalog
          onModuleSelect={(moduleId) => {
            if (moduleId === 'ats') {
              setAppView('ats');
              setActiveTab('dashboard');
            } else if (moduleId === 'procurement') {
              setAppView('purchase');
              setPurchaseTab('dashboard');
            }
            // Add more module handlers as they become available
          }}
          currentModule={appView === 'ats' ? 'ats' : appView === 'purchase' ? 'procurement' : undefined}
        />
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
        {/* Engineering Drawing Background */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02] z-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] bg-repeat" />
          <svg className="absolute top-1/4 left-1/4 w-96 h-96 opacity-20" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            <line x1="20" y1="100" x2="180" y2="100" stroke="currentColor" strokeWidth="0.5"/>
            <line x1="100" y1="20" x2="100" y2="180" stroke="currentColor" strokeWidth="0.5"/>
          </svg>
          <svg className="absolute bottom-1/4 right-1/4 w-80 h-80 opacity-20" viewBox="0 0 200 200">
            <rect x="40" y="40" width="120" height="120" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            <rect x="60" y="60" width="80" height="80" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            <line x1="40" y1="40" x2="160" y2="160" stroke="currentColor" strokeWidth="0.5"/>
            <line x1="160" y1="40" x2="40" y2="160" stroke="currentColor" strokeWidth="0.5"/>
          </svg>
        </div>

        {/* Main Layout */}
        <div className="relative z-10 flex h-screen overflow-hidden">
          {/* Sidebar */}
          <div className="w-[220px] flex-shrink-0 h-screen border-r border-border bg-card backdrop-blur-xl flex flex-col px-3 py-6 overflow-hidden">
            <div className="flex flex-col h-full">
              {/* Logo */}
              <div className="mb-10 flex items-center justify-center px-2 group">
  <button
    onClick={() => setAppView('erp-modules')}
    className="relative transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-2xl p-2"
    title="Return to ERP Home"
  >
                  <div className="absolute inset-0 rounded-2xl bg-primary/0 group-hover:bg-primary/10 transition-all duration-300 blur-xl" />
                  <GuildLogo className="h-16 w-16 relative" theme={theme} />

                  {/* Tooltip */}
                  <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-2 bg-foreground text-background text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 shadow-lg z-50">
                    <div className="font-medium mb-0.5">Return to ERP Home</div>
                    <div className="text-[10px] text-background/70">Module Catalog</div>
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-foreground" />
                  </div>
                </button>
              </div>

              <nav className="space-y-1 flex-1 overflow-y-auto scrollbar-thin pr-1">
                {(appView === 'purchase'
  ? purchaseSidebarItems
  : sidebarItems
).map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
  if (appView === 'purchase') {
    setPurchaseTab(item.tab as PurchaseTab);
  } else {
    setActiveTab(item.tab as ActiveTab);

    if (item.tab !== 'jobs') {
      setSelectedDepartment(null);
      setSelectedRole(null);
    }
  }
}}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all duration-200 group ${
                      (
                        appView === 'purchase'
                          ? purchaseTab === item.tab
                          : activeTab === item.tab
                      )
                        ? 'bg-foreground/10 text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-foreground/[0.06]'
                    }`}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    <span className="tracking-wide">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
            
            {/* Bottom Profile */}
<div className="border-t border-border pt-4 relative">
  <div className="relative">

    {/* Profile Button */}
    <button
      onClick={() => setShowProfileMenu(!showProfileMenu)}
      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-foreground/[0.06] transition-all duration-200"
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-muted/60 flex items-center justify-center text-[11px] font-semibold text-foreground">
            GM
          </div>

          {/* Online indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-background" />
        </div>

        <div className="text-left">
          <p className="text-xs font-medium text-foreground">
            Gautham Mayur N
          </p>

          <p className="text-[10px] text-muted-foreground">
            Cheif Of Staff
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-shrink-0">

  {/* Notifications */}
  <div className="relative p-1 rounded-md hover:bg-white/[0.06] transition-colors cursor-pointer">
    <Bell className="w-3.5 h-3.5 text-muted-foreground" />

    {/* Notification Dot */}
    <span className="absolute top-[3px] right-[3px] w-1.5 h-1.5 rounded-full bg-amber-400 border border-background" />
  </div>

  <ChevronDown
    className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${
      showProfileMenu ? 'rotate-180' : ''
    }`}
  />
</div>
    </button>

    {/* Dropdown */}
    {showProfileMenu && (
      <div className="absolute bottom-14 left-0 w-full rounded-xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl overflow-hidden z-50">

        {/* Header */}
        <div className="px-4 py-3 border-b border-border/60">
          <p className="text-sm font-medium text-foreground">
            Gautham Mayur N
          </p>

          <p className="text-[11px] text-muted-foreground mt-0.5">
            gauthammayur.n@etherealx.in
          </p>
        </div>

        {/* Menu Items */}
        <div className="p-1.5">

          <button
  onClick={() => {
    setAppView('erp-modules');
    setShowProfileMenu(false);
  }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs hover:bg-foreground/[0.06] transition-colors"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Module Catalog
          </button>

          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs hover:bg-foreground/[0.06] transition-colors">
            <User className="w-3.5 h-3.5" />
            View Profile
          </button>

          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs hover:bg-foreground/[0.06] transition-colors text-red-400">
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>

        </div>
      </div>
    )}
  </div>
            
</div>

</div>

{/* Content */}
<div className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">

            {/* Header */}
            <header className="border-b border-border/50 bg-card/60 backdrop-blur-md shadow-sm flex-shrink-0">
              <div className="px-5 py-3">
                <div className="flex items-center justify-between">
                  <h1
                    className="text-xl tracking-tight"
                    style={{ fontFamily: 'Fauna Thin, serif', fontWeight: 100, letterSpacing: '0.02em' }}
                  >
                    {appView === 'purchase'
                      ? 'The Guild Procurement'
                      : 'The Guild ATS'}
                  </h1>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Search — only for candidates and jobs */}
                    {(activeTab === 'candidates' || activeTab === 'jobs') && (
                      <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                        <input
                          type="text"
                          placeholder={
  appView === 'purchase'
    ? 'Search requisitions...'
    : 'Search candidates...'
}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-8 pr-3 py-1.5 text-xs bg-muted/30 border border-border rounded-lg w-64 focus:outline-none focus:ring-1 focus:ring-foreground/20 focus:bg-card transition-all duration-200"
                        />
                      </div>
                    )}

                    {/* Filter — only for candidates */}
                    {activeTab === 'candidates' && (
                      <button
                        onClick={() => setShowFilterPanel(!showFilterPanel)}
                        className={`p-1.5 rounded-lg transition-all duration-200 ${
                          showFilterPanel ? 'bg-foreground/15 shadow-sm' : 'hover:bg-foreground/[0.07]'
                        }`}
                      >
                        <Filter className="w-4 h-4" />
                      </button>
                    )}

                    {/* View Toggle — only for pipeline views */}
                    {(activeTab === 'candidates' || (activeTab === 'jobs' && selectedRole)) && (
                      <div className="flex items-center gap-0.5 bg-muted/30 rounded-lg p-0.5">
                        <button
                          onClick={() => setView('kanban')}
                          className={`p-1.5 rounded-md transition-all duration-200 ${
                            view === 'kanban' ? 'bg-card shadow-sm' : 'hover:bg-foreground/[0.06]'
                          }`}
                          title="Kanban View"
                        >
                          <LayoutGrid className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setView('list')}
                          className={`p-1.5 rounded-md transition-all duration-200 ${
                            view === 'list' ? 'bg-card shadow-sm' : 'hover:bg-foreground/[0.06]'
                          }`}
                          title="List View"
                        >
                          <List className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <ThemeToggle theme={theme} setTheme={setTheme} />

                    {/* Contextual Primary Action */}
                    {(() => {
                      // Dashboard - Show New Job
                      if (appView !== 'purchase' && activeTab === 'dashboard') {
                        return (
                          <button
                            onClick={() => setShowNewJobModal(true)}
                            className="px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 flex items-center gap-1.5 shadow-sm"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            New Job
                          </button>
                        );
                      }

                      // Jobs/Requisitions - Show New Job (at all levels)
                      if (appView !== 'purchase' && activeTab === 'jobs') {
                        return (
                          <button
                            onClick={() => setShowNewJobModal(true)}
                            className="px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 flex items-center gap-1.5 shadow-sm"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            New Job
                          </button>
                        );
                      }

                      // ATS Requisitions - Show New Job
                      if (appView !== 'purchase' && activeTab === 'requisitions') {
                        return (
                          <button
                            onClick={() => setShowNewJobModal(true)}
                            className="px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 flex items-center gap-1.5 shadow-sm"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            New Job
                          </button>
                        );
                      }

                      // Purchase module - Show New Request on dashboard and requisition
                      if (appView === 'purchase' && (purchaseTab === 'dashboard' || purchaseTab === 'requisition')) {
                        return (
                          <button
                            onClick={() => setShowNewJobModal(true)}
                            className="px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 flex items-center gap-1.5 shadow-sm"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            New Request
                          </button>
                        );
                      }

                      // All other pages - No primary action
                      return null;
                    })()}
                  </div>
                </div>

                {/* Pipeline Status Tabs — only for candidates view */}
                {showPipelineHeader && (
                  <div className="flex items-center gap-1 mt-3 overflow-x-auto pb-1 scrollbar-thin">
                    <button
                      onClick={() => handleCategoryClick('All')}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                        activeCategory === 'All'
                          ? 'bg-foreground/15 text-foreground shadow-sm'
                          : 'hover:bg-foreground/[0.07] text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      All · {candidates.length}
                    </button>
                    {statuses.map(status => (
                      <button
                        key={status}
                        onClick={() => handleCategoryClick(status)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                          activeCategory === status
                            ? 'bg-foreground/15 text-foreground shadow-sm'
                            : 'hover:bg-foreground/[0.07] text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {status} · {statusCounts[status]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
              {appView === 'purchase' ? (
                <>
                  {purchaseTab === 'dashboard' && (
                    <PurchaseDashboard />
                  )}
                  {activeTab === 'jobs' && renderJobsView()}

                  {purchaseTab === 'requisition' && (
                    activeRequisitionCategory ? (
                      <RequisitionWorkspace
                        category={activeRequisitionCategory}
                      />
                    ) : (
                      <RequisitionPage
                        onCategorySelect={(category) =>
                          setActiveRequisitionCategory(category)
                        }
                      />
                    )
                  )}

                  {purchaseTab === 'sourcing' && (
                    <div className="p-6 text-muted-foreground">
                      Sourcing module coming next
                    </div>
                  )}

                  {purchaseTab === 'procurement' && (
                    <div className="p-6 text-muted-foreground">
                      Procurement module coming next
                    </div>
                  )}

                  {purchaseTab === 'approvals' && (
                    <div className="p-6 text-muted-foreground">
                      Approval workflows coming next
                    </div>
                  )}

                  {purchaseTab === 'payments' && (
                    <div className="p-6 text-muted-foreground">
                      Payment operations coming next
                    </div>
                  )}

                  {purchaseTab === 'vendors' && (
                    <div className="p-6 text-muted-foreground">
                      Vendor management coming next
                    </div>
                  )}
                </>
              ) : (
                <>
                  {activeTab === 'jobs' && renderJobsView()}

                  {activeTab === 'candidates' && renderCandidatesView()}

                  {activeTab === 'analytics' && (
                    <AnalyticsPage candidates={candidates} />
                  )}

                  {activeTab === 'dashboard' && (
                    <DashboardPage
                      setActiveTab={setActiveTab}
                      setSelectedCandidate={setSelectedCandidate}
                      setCandidateStageFilter={setCandidateStageFilter}
                    />
                  
                  )}
                  {activeTab === 'requisitions' && (
                    <ATSRequisitionPage />
                  )}

                  {activeTab === 'interviews' && <InterviewsPage />}

                  {activeTab === 'referrals' && <ReferralsPage />}

                  {activeTab === 'settings' && <SettingsPage />}
                </>
              )}
            </main>
          </div>
        </div>
      </div>

      {showFilterPanel && <FilterPanel onClose={() => setShowFilterPanel(false)} />}
      {showNewJobModal && <NewJobModal onClose={() => setShowNewJobModal(false)} />}
      {selectedCandidate && (
        <CandidateProfile
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          onStatusChange={(newStatus) => {
            updateCandidateStatus(selectedCandidate.id, newStatus);
          }}
        />
      )}
    </DndProvider>
  );
}
