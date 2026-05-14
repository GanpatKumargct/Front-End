import { useState, useEffect, useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { KanbanBoard } from "@/features/ats/components/KanbanBoard";
import { ListView } from "@/features/ats/components/ListView";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { FilterPanel } from "@/features/ats/components/FilterPanel";
import { NewJobModal } from "@/features/ats/components/NewJobModal";
import { GuildLogo } from "@/components/common/GuildLogo";
import { AnalyticsPage } from "@/pages/AnalyticsPage";
import { getDepartments, getCandidates, updateCandidateStatus as apiUpdateStatus } from "@/services/api";
import {
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
  ArrowLeft
} from "lucide-react";
function App() {
  const [activeTab, setActiveTab] = useState("candidates");
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState("kanban");
  const [theme, setTheme] = useState("dark");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showNewJobModal, setShowNewJobModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const columnRefs = useRef({});
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [deptsData, candsData] = await Promise.all([
          getDepartments(),
          getCandidates()
        ]);
        setDepartments(deptsData);
        setCandidates(candsData);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  const updateCandidateStatus = async (candidateId, newStatus) => {
    // Optimistic UI update
    setCandidates(
      (prev) => prev.map((c) => c.id === candidateId ? { ...c, status: newStatus } : c)
    );
    // API Call
    try {
      await apiUpdateStatus(candidateId, newStatus);
    } catch (error) {
      console.error("Failed to update status:", error);
      // Revert in real world
    }
  };
  const statuses = [
    "Screening",
    "Fitment Evaluation",
    "Technical Interview",
    "PTC Interview",
    "Founder's Interview",
    "Selected",
    "Rejected"
  ];
  const baseFiltered = candidates.filter(
    (c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.id.toLowerCase().includes(searchQuery.toLowerCase()) || c.role.toLowerCase().includes(searchQuery.toLowerCase()) || c.department.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredByCategory = activeCategory === "All" ? baseFiltered : baseFiltered.filter((c) => c.status === activeCategory);
  const statusCounts = statuses.reduce((acc, status) => {
    acc[status] = candidates.filter((c) => c.status === status).length;
    return acc;
  }, {});
  const scrollToColumn = (status) => {
    const el = columnRefs.current[status];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };
  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    if (category !== "All" && view === "kanban") scrollToColumn(category);
  };
  const showPipelineHeader = activeTab === "candidates";
  const renderJobsView = () => {
    if (!selectedDepartment) {
      return <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold tracking-tight mb-0.5">Departments</h2>
              <p className="text-xs text-muted-foreground">{departments.length} departments · {candidates.length} total applicants</p>
            </div>
            <button
        onClick={() => setShowNewJobModal(true)}
        className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 flex items-center gap-2 shadow-sm"
      >
              <Plus className="w-3.5 h-3.5" />
              New Opening
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center p-12"><div className="animate-pulse text-muted-foreground">Loading departments...</div></div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {departments.map((dept2) => {
        const deptCandidates2 = candidates.filter((c) => c.department === dept2.code);
        const shortlisted = deptCandidates2.filter(
          (c) => ["Technical Interview", "PTC Interview", "Founder's Interview"].includes(c.status)
        ).length;
        const interviews = deptCandidates2.filter(
          (c) => ["PTC Interview", "Founder's Interview"].includes(c.status)
        ).length;
        const hires = deptCandidates2.filter((c) => c.status === "Selected").length;
        const progress = dept2.openRoles > 0 ? Math.min(100, Math.round(hires / dept2.openRoles * 100)) : 0;
        const now = /* @__PURE__ */ new Date();
        const days = Math.floor(Math.random() * 6) + 1;
        const updated = days === 1 ? "1 day ago" : `${days} days ago`;
        return <button
          key={dept2.id}
          onClick={() => setSelectedDepartment(dept2.id)}
          className="p-5 rounded-xl border border-border bg-card hover:bg-muted/20 dark:hover:bg-white/[0.04] transition-all duration-200 text-left group hover:border-border/80 hover:shadow-md"
          style={{
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
          }}
        >
                  {
          /* Header */
        }
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-widest bg-muted/50 text-muted-foreground mb-2">
                        {dept2.code}
                      </span>
                      <h3 className="text-sm font-semibold leading-tight text-foreground group-hover:text-foreground">
                        {dept2.name}
                      </h3>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-foreground">{deptCandidates2.length}</div>
                      <div className="text-[10px] text-muted-foreground">applicants</div>
                    </div>
                  </div>

                  {
          /* Stats grid */
        }
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Open Roles</span>
                      <span className="font-semibold">{dept2.openRoles}</span>
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
                      <span className="font-semibold">{dept2.pendingApprovals}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Hires</span>
                      <span className="font-semibold text-foreground">{hires}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold">{progress}%</span>
                    </div>
                  </div>

                  {
          /* Progress bar */
        }
                  <div className="mb-3">
                    <div className="h-1 bg-muted/40 rounded-full overflow-hidden">
                      <div
          className="h-full bg-foreground/40 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
                    </div>
                  </div>

                  {
          /* Footer */
        }
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground border-t border-border/50 pt-2.5">
                    <span>Updated {updated}</span>
                    <span className="group-hover:text-foreground transition-colors">View Pipeline →</span>
                  </div>
                </button>;
      })}
            </div>
          )}
        </div>;
    }
    const dept = departments.find((d) => d.id === selectedDepartment);
    const deptCandidates = baseFiltered.filter((c) => c.department === selectedDepartment);
    const deptFiltered = activeCategory === "All" ? deptCandidates : deptCandidates.filter((c) => c.status === activeCategory);
    const deptInterviews = deptCandidates.filter(
      (c) => ["Technical Interview", "PTC Interview", "Founder's Interview"].includes(c.status)
    ).length;
    return <div className="flex flex-col h-full">
        {
      /* Dept subheading */
    }
        <div className="px-5 pt-4 pb-3 border-b border-border/40">
          <button
      onClick={() => {
        setSelectedDepartment(null);
        setActiveCategory("All");
      }}
      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-2 group"
    >
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
            All Departments
          </button>
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-base font-semibold">{dept?.name} Department</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {dept?.openRoles} Open Roles · {deptCandidates.length} Applicants · {deptInterviews} Active Interviews
              </p>
            </div>
          </div>
        </div>

        {
      /* Body */
    }
        <div className="flex-1 overflow-hidden p-5">
          {deptFiltered.length === 0 ? <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
              <Users className="w-8 h-8 mb-2 opacity-30" />
              <p className="text-sm">No candidates for this department yet.</p>
            </div> : view === "kanban" ? <KanbanBoard
      candidates={deptFiltered}
      statuses={statuses}
      onStatusChange={updateCandidateStatus}
      columnRefs={columnRefs}
    /> : <ListView
      candidates={deptFiltered}
      onStatusChange={updateCandidateStatus}
    />}
        </div>
      </div>;
  };
  const renderCandidatesView = () => <div className="p-5">
      {isLoading ? (
        <div className="flex justify-center p-12"><div className="animate-pulse text-muted-foreground">Loading candidates...</div></div>
      ) : view === "kanban" ? <KanbanBoard
    candidates={filteredByCategory}
    statuses={statuses}
    onStatusChange={updateCandidateStatus}
    columnRefs={columnRefs}
  /> : <ListView
    candidates={filteredByCategory}
    onStatusChange={updateCandidateStatus}
  />}
    </div>;
  const renderPlaceholder = (label, icon) => <div className="flex flex-col items-center justify-center h-64 text-muted-foreground gap-3">
      <div className="opacity-30">{icon}</div>
      <p className="text-sm">{label} — coming soon.</p>
    </div>;
  const sidebarItems = [
    { icon: Home, label: "Dashboard", tab: "dashboard" },
    { icon: Briefcase, label: "Jobs", tab: "jobs" },
    { icon: Users, label: "Candidates", tab: "candidates" },
    { icon: CalendarDays, label: "Interviews", tab: "interviews" },
    { icon: BarChart3, label: "Analytics", tab: "analytics" },
    { icon: Settings, label: "Settings", tab: "settings" }
  ];
  return <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
        {
    /* Engineering Drawing Background */
  }
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02] z-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] bg-repeat" />
          <svg className="absolute top-1/4 left-1/4 w-96 h-96 opacity-20" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <line x1="20" y1="100" x2="180" y2="100" stroke="currentColor" strokeWidth="0.5" />
            <line x1="100" y1="20" x2="100" y2="180" stroke="currentColor" strokeWidth="0.5" />
          </svg>
          <svg className="absolute bottom-1/4 right-1/4 w-80 h-80 opacity-20" viewBox="0 0 200 200">
            <rect x="40" y="40" width="120" height="120" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <rect x="60" y="60" width="80" height="80" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <line x1="40" y1="40" x2="160" y2="160" stroke="currentColor" strokeWidth="0.5" />
            <line x1="160" y1="40" x2="40" y2="160" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </div>

        {
    /* Main Layout */
  }
        <div className="relative z-10 flex min-h-screen overflow-hidden">
          {
    /* Sidebar */
  }
          <div className="w-[220px] flex-shrink-0 min-h-screen border-r border-border bg-card backdrop-blur-xl flex flex-col justify-between px-3 py-6">
            <div>
              {
    /* Logo */
  }
              <div className="mb-10 flex items-center justify-center px-2">
                <GuildLogo className="h-16 w-16" theme={theme} />
              </div>

              <nav className="space-y-1">
                {sidebarItems.map((item) => <button
    key={item.label}
    onClick={() => {
      setActiveTab(item.tab);
      if (item.tab !== "jobs") setSelectedDepartment(null);
    }}
    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all duration-200 group
                      ${item.tab === activeTab ? "bg-foreground/10 text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.06]"}`}
  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    <span className="tracking-wide">{item.label}</span>
                  </button>)}
              </nav>
            </div>

            {
    /* Bottom Profile */
  }
            <div className="border-t border-border pt-4">
              <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-foreground/[0.06] transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted/60 flex items-center justify-center text-[11px] font-semibold text-foreground">
                    RO
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-medium text-foreground">Rohan Okafor</p>
                    <p className="text-[10px] text-muted-foreground">HR Director</p>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {
    /* Content */
  }
          <div className="flex-1 min-w-0 flex flex-col overflow-hidden">

            {
    /* Header */
  }
            <header className="border-b border-border/50 bg-card/60 backdrop-blur-md shadow-sm flex-shrink-0">
              <div className="px-5 py-3">
                <div className="flex items-center justify-between">
                  <h1
    className="text-xl tracking-tight"
    style={{ fontFamily: "Fauna Thin, serif", fontWeight: 100, letterSpacing: "0.02em" }}
  >
                    The Guild ATS
                  </h1>

                  <div className="flex items-center gap-2">
                    {
    /* Search */
  }
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

                    {
    /* Filter */
  }
                    <button
    onClick={() => setShowFilterPanel(!showFilterPanel)}
    className={`p-1.5 rounded-lg transition-all duration-200 ${showFilterPanel ? "bg-foreground/15 shadow-sm" : "hover:bg-foreground/[0.07]"}`}
  >
                      <Filter className="w-4 h-4" />
                    </button>

                    {
    /* View Toggle — only for pipeline views */
  }
                    {(activeTab === "candidates" || activeTab === "jobs" && selectedDepartment) && <div className="flex items-center gap-0.5 bg-muted/30 rounded-lg p-0.5">
                        <button
    onClick={() => setView("kanban")}
    className={`p-1.5 rounded-md transition-all duration-200 ${view === "kanban" ? "bg-card shadow-sm" : "hover:bg-foreground/[0.06]"}`}
    title="Kanban View"
  >
                          <LayoutGrid className="w-3.5 h-3.5" />
                        </button>
                        <button
    onClick={() => setView("list")}
    className={`p-1.5 rounded-md transition-all duration-200 ${view === "list" ? "bg-card shadow-sm" : "hover:bg-foreground/[0.06]"}`}
    title="List View"
  >
                          <List className="w-3.5 h-3.5" />
                        </button>
                      </div>}

                    <ThemeToggle theme={theme} setTheme={setTheme} />

                    <button
    onClick={() => setShowNewJobModal(true)}
    className="px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 flex items-center gap-1.5 shadow-sm"
  >
                      <Plus className="w-3.5 h-3.5" />
                      New Job
                    </button>
                  </div>
                </div>

                {
    /* Pipeline Status Tabs — only for candidates view */
  }
                {showPipelineHeader && <div className="flex items-center gap-1 mt-3 overflow-x-auto pb-1 scrollbar-thin">
                    <button
    onClick={() => handleCategoryClick("All")}
    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap ${activeCategory === "All" ? "bg-foreground/15 text-foreground shadow-sm" : "hover:bg-foreground/[0.07] text-muted-foreground hover:text-foreground"}`}
  >
                      All · {candidates.length}
                    </button>
                    {statuses.map((status) => <button
    key={status}
    onClick={() => handleCategoryClick(status)}
    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap ${activeCategory === status ? "bg-foreground/15 text-foreground shadow-sm" : "hover:bg-foreground/[0.07] text-muted-foreground hover:text-foreground"}`}
  >
                        {status} · {statusCounts[status]}
                      </button>)}
                  </div>}
              </div>
            </header>

            {
    /* Main Content */
  }
            <main className="flex-1 overflow-auto">
              {activeTab === "jobs" && renderJobsView()}
              {activeTab === "candidates" && renderCandidatesView()}
              {activeTab === "analytics" && <AnalyticsPage candidates={candidates} />}
              {activeTab === "dashboard" && <div className="p-6">
                  {renderPlaceholder("Dashboard", <Home className="w-10 h-10" />)}
                </div>}
              {activeTab === "interviews" && <div className="p-6">
                  {renderPlaceholder("Interviews", <CalendarDays className="w-10 h-10" />)}
                </div>}
              {activeTab === "settings" && <div className="p-6">
                  {renderPlaceholder("Settings", <Settings className="w-10 h-10" />)}
                </div>}
            </main>
          </div>
        </div>
      </div>

      {showFilterPanel && <FilterPanel onClose={() => setShowFilterPanel(false)} />}
      {showNewJobModal && <NewJobModal onClose={() => setShowNewJobModal(false)} />}
    </DndProvider>;
}
export {
  App as default
};
