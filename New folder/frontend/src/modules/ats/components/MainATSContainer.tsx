import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Search,
  Filter,
  LayoutGrid,
  List,
  Plus,
  Users,
} from 'lucide-react';
import type { RootState } from '@/app/store';
import { setActiveTab } from '@/shared/store/uiSlice';
import type { ActiveTab } from '@/shared/store/uiSlice';
import { useCandidatesQuery, useUpdateCandidateStatusMutation } from '../hooks/useATS';
import type { Candidate, CandidateStatus } from '@/shared/types';

// Component Imports
import { KanbanBoard } from './KanbanBoard';
import { ListView } from './ListView';
import { DashboardPage } from './DashboardPage';
import { AnalyticsPage } from './AnalyticsPage';
import RequisitionPage from './RequisitionPage';
import { InterviewsPage } from './InterviewsPage';
import { ReferralsPage } from './ReferralsPage';
import { SettingsPage } from './SettingsPage';
import { FilterPanel } from './FilterPanel';
import { NewJobModal } from './NewJobModal';
import { CandidateProfile } from './CandidateProfile';
import { RolesView } from './RolesView';
import { BackButton } from '@/shared/components/ui/BackButton';

export default function MainATSContainer() {
  const dispatch = useDispatch();
  const activeTab = useSelector((state: RootState) => state.ui.activeTab);

  // Queries & Mutations
  const { data: candidates = [], isLoading, isError, refetch } = useCandidatesQuery();
  const updateStatusMutation = useUpdateCandidateStatusMutation();

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CandidateStatus | 'All'>('All');
  const [candidateStageFilter, setCandidateStageFilter] = useState<string | null>(null);

  // Views & Modals
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showNewJobModal, setShowNewJobModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  // Nested Job/Role Views
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<{ id: string; title: string } | null>(null);

  const columnRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

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

  // Auto-sync activeCategory with dashboard filter clicks
  useEffect(() => {
    if (candidateStageFilter) {
      setActiveCategory(candidateStageFilter as CandidateStatus);
    }
  }, [candidateStageFilter]);

  const updateCandidateStatus = (candidateId: string, newStatus: CandidateStatus) => {
    updateStatusMutation.mutate({ id: candidateId, status: newStatus });
    if (selectedCandidate && selectedCandidate.id === candidateId) {
      setSelectedCandidate({ ...selectedCandidate, status: newStatus });
    }
  };

  const handleCandidateClick = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
  };

  const scrollToColumn = (status: CandidateStatus) => {
    const el = columnRefs.current[status];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  };

  const handleCategoryClick = (category: CandidateStatus | 'All') => {
    setActiveCategory(category);
    if (category !== 'All' && view === 'kanban') scrollToColumn(category);
  };

  // Filtering candidates
  const baseFiltered = candidates.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const dashboardFilteredCandidates = candidateStageFilter
    ? baseFiltered.filter((c) => c.status === candidateStageFilter)
    : baseFiltered;

  const filteredByCategory =
    activeCategory === 'All'
      ? dashboardFilteredCandidates
      : dashboardFilteredCandidates.filter((c) => c.status === activeCategory);

  const statusCounts = statuses.reduce((acc, status) => {
    acc[status] = candidates.filter((c) => c.status === status).length;
    return acc;
  }, {} as Record<CandidateStatus, number>);

  const showPipelineHeader = activeTab === 'candidates';

  // Jobs Nesting renderer
  const renderJobsView = () => {
    if (selectedRole && selectedDepartment) {
      const roleCandidates = baseFiltered.filter(
        (c) => c.department === selectedDepartment && c.role === selectedRole.title
      );
      const roleFiltered =
        activeCategory === 'All'
          ? roleCandidates
          : roleCandidates.filter((c) => c.status === activeCategory);

      return (
        <div className="flex flex-col h-full">
          <div className="px-5 pt-4 pb-3 border-b border-border/40 bg-card">
            <BackButton onClick={() => setSelectedRole(null)} label="Back to Roles" className="mb-2" />
            <div>
              <h2 className="text-base font-semibold">{selectedRole.title}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {selectedDepartment} · {roleCandidates.length} Applicants
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-hidden p-5">
            {roleFiltered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-muted-foreground bg-card rounded-xl border border-border">
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

    if (selectedDepartment) {
      return (
        <RolesView
          departmentId={selectedDepartment}
          departmentName={selectedDepartment}
          onBack={() => {
            setSelectedDepartment(null);
            setActiveCategory('All');
          }}
          onRoleClick={(jobId, jobTitle) => setSelectedRole({ id: jobId, title: jobTitle })}
        />
      );
    }

    // Default Departments List
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold tracking-tight mb-0.5">Department Hiring</h2>
            <p className="text-xs text-muted-foreground">
              {candidates.length} total applicants under tracking
            </p>
          </div>
          <button
            onClick={() => setShowNewJobModal(true)}
            className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            New Job
          </button>
        </div>

        {/* Static list cards based on original layout */}
        <div className="grid grid-cols-3 gap-4">
          {['AER', 'AVI', 'CFD', 'SYS', 'STR', 'NIT', 'FIN', 'PTC'].map((deptCode) => {
            const deptCandidates = candidates.filter((c) => c.department === deptCode);
            const urgentRoles = 1;
            const hires = deptCandidates.filter((c) => c.status === 'Selected').length;

            return (
              <button
                key={deptCode}
                onClick={() => setSelectedDepartment(deptCode)}
                className="p-5 rounded-xl border border-border bg-card hover:bg-muted/20 dark:hover:bg-white/[0.04] transition-all duration-200 text-left group hover:border-border/80 hover:shadow-md cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-widest bg-muted/50 text-muted-foreground">
                        {deptCode}
                      </span>
                      {urgentRoles > 0 && (
                        <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-semibold bg-red-500/10 text-red-500 border border-red-500/20">
                          URGENT
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold leading-tight text-foreground">
                      {deptCode === 'AER' ? 'Aerodynamics' :
                       deptCode === 'AVI' ? 'Avionics' :
                       deptCode === 'CFD' ? 'Computational Fluid Dynamics' :
                       deptCode === 'SYS' ? 'Systems' :
                       deptCode === 'STR' ? 'Structures' :
                       deptCode === 'NIT' ? 'Networks & IT' :
                       deptCode === 'FIN' ? 'Finance & Compliance' : 'People, Talent & Culture'}
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-foreground">{deptCandidates.length}</div>
                    <div className="text-[10px] text-muted-foreground font-light">applicants</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3 text-xs border-t border-border/20 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Shortlisted</span>
                    <span className="font-semibold">
                      {deptCandidates.filter((c) => c.status === 'Technical Interview').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Hires</span>
                    <span className="font-semibold text-emerald-500">{hires}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Sub-header controls */}
      <div className="border-b border-border/30 bg-card/40 px-5 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold capitalize tracking-wide text-muted-foreground">
              ATS Operations / {activeTab}
            </h2>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Search Input */}
            {(activeTab === 'candidates' || activeTab === 'jobs') && (
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search candidates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-muted/30 border border-border rounded-lg w-64 focus:outline-none focus:ring-1 focus:ring-foreground/20 focus:bg-card transition-all duration-200"
                />
              </div>
            )}

            {/* Filter Toggle */}
            {activeTab === 'candidates' && (
              <button
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                className={`p-1.5 rounded-lg border border-border transition-all duration-200 cursor-pointer ${
                  showFilterPanel ? 'bg-foreground/15 shadow-sm' : 'hover:bg-foreground/[0.07] bg-card'
                }`}
                title="Toggle Filters"
              >
                <Filter className="w-4 h-4" />
              </button>
            )}

            {/* Kanban/List View Switch */}
            {(activeTab === 'candidates' || (activeTab === 'jobs' && selectedRole)) && (
              <div className="flex items-center gap-0.5 bg-muted/30 rounded-lg p-0.5 border border-border">
                <button
                  onClick={() => setView('kanban')}
                  className={`p-1.5 rounded-md transition-all duration-200 cursor-pointer ${
                    view === 'kanban' ? 'bg-card shadow-sm' : 'hover:bg-foreground/[0.06]'
                  }`}
                  title="Kanban View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`p-1.5 rounded-md transition-all duration-200 cursor-pointer ${
                    view === 'list' ? 'bg-card shadow-sm' : 'hover:bg-foreground/[0.06]'
                  }`}
                  title="List View"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Contextual Action Button */}
            {activeTab === 'dashboard' && (
              <button
                onClick={() => setShowNewJobModal(true)}
                className="px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                New Job
              </button>
            )}

            {activeTab === 'requisitions' && (
              <button
                onClick={() => setShowNewJobModal(true)}
                className="px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                New Job
              </button>
            )}
          </div>
        </div>

        {/* Pipeline Status Counters Header */}
        {showPipelineHeader && (
          <div className="flex items-center gap-1 mt-3 overflow-x-auto pb-1 scrollbar-thin">
            <button
              onClick={() => handleCategoryClick('All')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap cursor-pointer ${
                activeCategory === 'All'
                  ? 'bg-foreground/15 text-foreground shadow-sm'
                  : 'hover:bg-foreground/[0.07] text-muted-foreground hover:text-foreground'
              }`}
            >
              All · {candidates.length}
            </button>
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => handleCategoryClick(status)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap cursor-pointer ${
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

      {/* Main Tab Render Body */}
      <div className="flex-1 overflow-auto">
        {isLoading && (
          <div className="p-6 space-y-4">
            <div className="h-6 w-1/4 bg-muted animate-pulse rounded" />
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-muted animate-pulse rounded-xl" />
              ))}
            </div>
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center justify-center p-10 text-center gap-3">
            <p className="text-sm text-red-500 font-medium">Failed to load candidates data.</p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-primary text-primary-foreground text-xs rounded-lg hover:bg-primary/90"
            >
              Retry Loading
            </button>
          </div>
        )}

        {!isLoading && !isError && (
          <>
            {activeTab === 'dashboard' && (
              <DashboardPage
                setActiveTab={(tab: ActiveTab) => dispatch(setActiveTab(tab))}
                setSelectedCandidate={setSelectedCandidate}
                setCandidateStageFilter={setCandidateStageFilter}
              />
            )}

            {activeTab === 'candidates' && (
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
            )}

            {activeTab === 'jobs' && renderJobsView()}

            {activeTab === 'requisitions' && <RequisitionPage />}

            {activeTab === 'interviews' && <InterviewsPage />}

            {activeTab === 'referrals' && <ReferralsPage />}

            {activeTab === 'analytics' && <AnalyticsPage candidates={candidates} />}

            {activeTab === 'settings' && <SettingsPage />}
          </>
        )}
      </div>

      {/* Modal Overlays */}
      {showFilterPanel && <FilterPanel onClose={() => setShowFilterPanel(false)} />}
      {showNewJobModal && <NewJobModal onClose={() => setShowNewJobModal(false)} />}
      {selectedCandidate && (
        <CandidateProfile
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          onStatusChange={(newStatus) => updateCandidateStatus(selectedCandidate.id, newStatus)}
        />
      )}
    </div>
  );
}
