import { KanbanBoard } from "@/features/ats/components/KanbanBoard";
import { ListView } from "@/features/ats/components/ListView";
import { PIPELINE_STATUSES } from "@/config/constants";

export function CandidatesView({
  isLoading,
  view,
  filteredByCategory,
  updateCandidateStatus,
  columnRefs
}) {
  return (
    <div className="p-5 h-full">
      {isLoading ? (
        <div className="flex justify-center p-12"><div className="animate-pulse text-muted-foreground">Loading candidates...</div></div>
      ) : view === "kanban" ? (
        <KanbanBoard
          candidates={filteredByCategory}
          statuses={PIPELINE_STATUSES}
          onStatusChange={updateCandidateStatus}
          columnRefs={columnRefs}
        />
      ) : (
        <ListView
          candidates={filteredByCategory}
          onStatusChange={updateCandidateStatus}
        />
      )}
    </div>
  );
}
