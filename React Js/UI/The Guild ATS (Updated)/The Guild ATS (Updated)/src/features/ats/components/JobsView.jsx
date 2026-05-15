import { Plus, Users, ArrowLeft } from "lucide-react";
import { KanbanBoard } from "@/features/ats/components/KanbanBoard";
import { ListView } from "@/features/ats/components/ListView";
import { PIPELINE_STATUSES } from "@/config/constants";

export function JobsView({
  selectedDepartment,
  setSelectedDepartment,
  departments,
  candidates,
  isLoading,
  setShowNewJobModal,
  activeCategory,
  setActiveCategory,
  view,
  updateCandidateStatus,
  columnRefs,
  baseFiltered
}) {
  if (!selectedDepartment) {
    return (
      <div className="p-6">
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
            {departments.map((dept) => {
              const deptCandidates = candidates.filter((c) => c.department === dept.code);
              const shortlisted = deptCandidates.filter(
                (c) => ["Technical Interview", "PTC Interview", "Founder's Interview"].includes(c.status)
              ).length;
              const interviews = deptCandidates.filter(
                (c) => ["PTC Interview", "Founder's Interview"].includes(c.status)
              ).length;
              const hires = deptCandidates.filter((c) => c.status === "Selected").length;
              const progress = dept.openRoles > 0 ? Math.min(100, Math.round(hires / dept.openRoles * 100)) : 0;
              const days = Math.floor(Math.random() * 6) + 1;
              const updated = days === 1 ? "1 day ago" : `${days} days ago`;
              
              return (
                <button
                  key={dept.id}
                  onClick={() => setSelectedDepartment(dept.id)}
                  className="p-5 rounded-xl border border-border bg-card hover:bg-muted/20 dark:hover:bg-white/[0.04] transition-all duration-200 text-left group hover:border-border/80 hover:shadow-md"
                  style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-widest bg-muted/50 text-muted-foreground mb-2">
                        {dept.code}
                      </span>
                      <h3 className="text-sm font-semibold leading-tight text-foreground group-hover:text-foreground">
                        {dept.name}
                      </h3>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-foreground">{deptCandidates.length}</div>
                      <div className="text-[10px] text-muted-foreground">applicants</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4 text-xs">
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
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold">{progress}%</span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="h-1 bg-muted/40 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-foreground/40 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-muted-foreground border-t border-border/50 pt-2.5">
                    <span>Updated {updated}</span>
                    <span className="group-hover:text-foreground transition-colors">View Pipeline →</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  const dept = departments.find((d) => d.id === selectedDepartment);
  const deptCandidates = baseFiltered.filter((c) => c.department === selectedDepartment);
  const deptFiltered = activeCategory === "All" ? deptCandidates : deptCandidates.filter((c) => c.status === activeCategory);
  const deptInterviews = deptCandidates.filter(
    (c) => ["Technical Interview", "PTC Interview", "Founder's Interview"].includes(c.status)
  ).length;

  return (
    <div className="flex flex-col h-full">
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

      <div className="flex-1 overflow-hidden p-5">
        {deptFiltered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
            <Users className="w-8 h-8 mb-2 opacity-30" />
            <p className="text-sm">No candidates for this department yet.</p>
          </div>
        ) : view === "kanban" ? (
          <KanbanBoard
            candidates={deptFiltered}
            statuses={PIPELINE_STATUSES}
            onStatusChange={updateCandidateStatus}
            columnRefs={columnRefs}
          />
        ) : (
          <ListView
            candidates={deptFiltered}
            onStatusChange={updateCandidateStatus}
          />
        )}
      </div>
    </div>
  );
}
