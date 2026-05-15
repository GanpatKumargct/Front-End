import { useState, useEffect, useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// Components
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { BackgroundGraphic } from "@/components/layout/BackgroundGraphic";
import { JobsView } from "@/features/ats/components/JobsView";
import { CandidatesView } from "@/features/ats/components/CandidatesView";
import { FilterPanel } from "@/features/ats/components/FilterPanel";
import { NewJobModal } from "@/features/ats/components/NewJobModal";
import { AnalyticsPage } from "@/pages/AnalyticsPage";

// Services and Data
import { getDepartments, getCandidates, updateCandidateStatus as apiUpdateStatus } from "@/services/api";
import { PIPELINE_STATUSES } from "@/config/constants";

// Icons for placeholders
import { Home, CalendarDays, Settings } from "lucide-react";

const PlaceholderView = ({ label, icon }) => (
  <div className="flex flex-col items-center justify-center h-64 text-muted-foreground gap-3">
    <div className="opacity-30">{icon}</div>
    <p className="text-sm">{label} — coming soon.</p>
  </div>
);

function App() {
  // State
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

  // Theme effect
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Data fetching
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

  // Actions
  const updateCandidateStatus = async (candidateId, newStatus) => {
    // Optimistic UI update
    setCandidates((prev) => 
      prev.map((c) => c.id === candidateId ? { ...c, status: newStatus } : c)
    );
    // API Call
    try {
      await apiUpdateStatus(candidateId, newStatus);
    } catch (error) {
      console.error("Failed to update status:", error);
      // In a real app, revert the UI state here
    }
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    if (category !== "All" && view === "kanban") {
      const el = columnRefs.current[category];
      if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  };

  // Derived state
  const baseFiltered = candidates.filter(
    (c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           c.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
           c.role.toLowerCase().includes(searchQuery.toLowerCase()) || 
           c.department.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredByCategory = activeCategory === "All" 
    ? baseFiltered 
    : baseFiltered.filter((c) => c.status === activeCategory);
    
  const statusCounts = PIPELINE_STATUSES.reduce((acc, status) => {
    acc[status] = candidates.filter((c) => c.status === status).length;
    return acc;
  }, {});

  const showPipelineHeader = activeTab === "candidates";

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
        <BackgroundGraphic />

        <div className="relative z-10 flex min-h-screen overflow-hidden">
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            setSelectedDepartment={setSelectedDepartment}
            theme={theme}
          />

          <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
            <Header 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              showFilterPanel={showFilterPanel}
              setShowFilterPanel={setShowFilterPanel}
              activeTab={activeTab}
              selectedDepartment={selectedDepartment}
              view={view}
              setView={setView}
              theme={theme}
              setTheme={setTheme}
              setShowNewJobModal={setShowNewJobModal}
              showPipelineHeader={showPipelineHeader}
              activeCategory={activeCategory}
              setActiveCategory={handleCategoryClick}
              candidatesLength={candidates.length}
              statusCounts={statusCounts}
            />

            <main className="flex-1 overflow-auto">
              {activeTab === "jobs" && (
                <JobsView 
                  selectedDepartment={selectedDepartment}
                  setSelectedDepartment={setSelectedDepartment}
                  departments={departments}
                  candidates={candidates}
                  isLoading={isLoading}
                  setShowNewJobModal={setShowNewJobModal}
                  activeCategory={activeCategory}
                  setActiveCategory={handleCategoryClick}
                  view={view}
                  updateCandidateStatus={updateCandidateStatus}
                  columnRefs={columnRefs}
                  baseFiltered={baseFiltered}
                />
              )}
              {activeTab === "candidates" && (
                <CandidatesView 
                  isLoading={isLoading}
                  view={view}
                  filteredByCategory={filteredByCategory}
                  updateCandidateStatus={updateCandidateStatus}
                  columnRefs={columnRefs}
                />
              )}
              {activeTab === "analytics" && <AnalyticsPage candidates={candidates} />}
              {activeTab === "dashboard" && <div className="p-6"><PlaceholderView label="Dashboard" icon={<Home className="w-10 h-10" />} /></div>}
              {activeTab === "interviews" && <div className="p-6"><PlaceholderView label="Interviews" icon={<CalendarDays className="w-10 h-10" />} /></div>}
              {activeTab === "settings" && <div className="p-6"><PlaceholderView label="Settings" icon={<Settings className="w-10 h-10" />} /></div>}
            </main>
          </div>
        </div>
      </div>

      {showFilterPanel && <FilterPanel onClose={() => setShowFilterPanel(false)} />}
      {showNewJobModal && <NewJobModal onClose={() => setShowNewJobModal(false)} />}
    </DndProvider>
  );
}

export default App;
