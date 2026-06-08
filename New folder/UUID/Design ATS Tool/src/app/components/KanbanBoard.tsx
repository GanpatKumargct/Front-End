import { useState } from 'react';
import { useDrop } from 'react-dnd';
import { CandidateCard } from './CandidateCard';
import { StageTransitionModal } from './StageTransitionModal';
import type { Candidate, CandidateStatus } from '../App';

interface KanbanBoardProps {
  candidates: Candidate[];
  statuses: CandidateStatus[];
  onStatusChange: (candidateId: string, newStatus: CandidateStatus) => void;
  columnRefs: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>;
  onCandidateClick?: (candidate: Candidate) => void;
}

interface PendingTransition {
  candidateId: string;
  candidateName: string;
  fromStatus: CandidateStatus;
  toStatus: CandidateStatus;
  type: 'forward' | 'backward';
}

interface ColumnProps {
  status: CandidateStatus;
  candidates: Candidate[];
  onDrop: (candidateId: string, newStatus: CandidateStatus) => void;
  onCardClick: (candidate: Candidate) => void;
  columnRef: (ref: HTMLDivElement | null) => void;
}

function Column({ status, candidates, onDrop, onCardClick, columnRef }: ColumnProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'CANDIDATE',
    drop: (item: { id: string; status: CandidateStatus; name: string }) => {
      if (item.status !== status) {
        onDrop(item.id, status);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={(node) => {
        drop(node);
        columnRef(node);
      }}
      className={`flex-1 min-w-[270px] bg-muted/[0.08] dark:bg-muted/[0.05] rounded-xl p-5 transition-all duration-300 ease-out ${
        isOver ? 'bg-accent/[0.12] dark:bg-accent/[0.08] ring-2 ring-accent/40 shadow-xl' : ''
      }`}
      style={{
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
      }}
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-semibold uppercase text-xs tracking-wider text-muted-foreground/90">
          {status}
        </h2>
        <span className="px-2.5 py-1 bg-foreground/10 border border-border/50 rounded-full text-xs font-semibold">
          {candidates.length}
        </span>
      </div>

      <div className="space-y-3.5 overflow-y-auto overflow-x-visible max-h-[calc(100vh-260px)] pr-3 pb-2 -mr-1 custom-scrollbar">
        {candidates.map((candidate) => (
          <CandidateCard
            key={candidate.id}
            candidate={candidate}
            onClick={() => onCardClick(candidate)}
          />
        ))}
      </div>
    </div>
  );
}

export function KanbanBoard({ candidates, statuses, onStatusChange, columnRefs, onCandidateClick }: KanbanBoardProps) {
  const [pendingTransition, setPendingTransition] = useState<PendingTransition | null>(null);

  const getStageIndex = (status: CandidateStatus): number => {
    return statuses.indexOf(status);
  };

  const handleDrop = (candidateId: string, newStatus: CandidateStatus) => {
    const candidate = candidates.find(c => c.id === candidateId);
    if (!candidate) return;

    const fromIndex = getStageIndex(candidate.status);
    const toIndex = getStageIndex(newStatus);

    // Determine if moving forward or backward
    const transitionType = toIndex > fromIndex ? 'forward' : 'backward';

    // Show confirmation modal
    setPendingTransition({
      candidateId,
      candidateName: candidate.name,
      fromStatus: candidate.status,
      toStatus: newStatus,
      type: transitionType,
    });
  };

  const handleConfirmTransition = () => {
    if (pendingTransition) {
      onStatusChange(pendingTransition.candidateId, pendingTransition.toStatus);
      setPendingTransition(null);
    }
  };

  const handleCancelTransition = () => {
    setPendingTransition(null);
  };

  const handleCardClick = (candidate: Candidate) => {
    if (onCandidateClick) {
      onCandidateClick(candidate);
    }
  };

  return (
    <>
      <div className="flex gap-4 overflow-x-auto pb-4 px-1 -mx-1">

  {statuses
    .filter((status) => status !== 'Talent Pool')
    .map((status) => (
      <Column
        key={status}
        status={status}
        candidates={candidates.filter(
          (c) => c.status === status
        )}
        onDrop={handleDrop}
        onCardClick={handleCardClick}
        columnRef={(ref) => {
          columnRefs.current[status] = ref;
        }}
      />
    ))}

  {/* Visual Separator */}
  <div className="w-px bg-border mx-2 self-stretch opacity-40" />

  {/* Talent Pool */}
  <div className="min-w-[320px] max-w-[320px] flex-shrink-0">
    <Column
      status={'Talent Pool' as CandidateStatus}
      candidates={candidates.filter(
        (c) => c.status === 'Talent Pool'
      )}
      onDrop={handleDrop}
      onCardClick={handleCardClick}
      columnRef={(ref) => {
        columnRefs.current['Talent Pool'] = ref;
      }}
    />
  </div>

</div>

      {/* Stage Transition Confirmation Modal */}
      {pendingTransition && (
        <StageTransitionModal
          type={pendingTransition.type}
          candidateName={pendingTransition.candidateName}
          fromStage={pendingTransition.fromStatus}
          toStage={pendingTransition.toStatus}
          onConfirm={handleConfirmTransition}
          onCancel={handleCancelTransition}
        />
      )}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(128, 128, 128, 0.3);
          border-radius: 2.5px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(128, 128, 128, 0.5);
        }
      `}</style>
    </>
  );
}
