import { Search, Filter, LayoutGrid, List, Plus } from "lucide-react";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { PIPELINE_STATUSES } from "@/config/constants";

export function Header({
  searchQuery,
  setSearchQuery,
  showFilterPanel,
  setShowFilterPanel,
  activeTab,
  selectedDepartment,
  view,
  setView,
  theme,
  setTheme,
  setShowNewJobModal,
  showPipelineHeader,
  activeCategory,
  setActiveCategory,
  candidatesLength,
  statusCounts
}) {
  return (
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

            <button
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className={`p-1.5 rounded-lg transition-all duration-200 ${showFilterPanel ? "bg-foreground/15 shadow-sm" : "hover:bg-foreground/[0.07]"}`}
            >
              <Filter className="w-4 h-4" />
            </button>

            {(activeTab === "candidates" || (activeTab === "jobs" && selectedDepartment)) && (
              <div className="flex items-center gap-0.5 bg-muted/30 rounded-lg p-0.5">
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
              </div>
            )}

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

        {showPipelineHeader && (
          <div className="flex items-center gap-1 mt-3 overflow-x-auto pb-1 scrollbar-thin">
            <button
              onClick={() => setActiveCategory("All")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap ${activeCategory === "All" ? "bg-foreground/15 text-foreground shadow-sm" : "hover:bg-foreground/[0.07] text-muted-foreground hover:text-foreground"}`}
            >
              All · {candidatesLength}
            </button>
            {PIPELINE_STATUSES.map((status) => (
              <button
                key={status}
                onClick={() => setActiveCategory(status)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap ${activeCategory === status ? "bg-foreground/15 text-foreground shadow-sm" : "hover:bg-foreground/[0.07] text-muted-foreground hover:text-foreground"}`}
              >
                {status} · {statusCounts[status] || 0}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
