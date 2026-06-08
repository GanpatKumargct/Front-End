import { type MutableRefObject } from 'react';
import { useDrop } from 'react-dnd';
import { RequisitionCard } from './RequisitionCard';
import type { Requisition, RequisitionStatus } from '@/shared/types';

interface RequisitionKanbanBoardProps {
  requisitions: Requisition[];
  statuses: RequisitionStatus[];
  onStatusChange: (
    requisitionId: string,
    newStatus: RequisitionStatus
  ) => void;
  columnRefs: MutableRefObject<{
    [key: string]: HTMLDivElement | null;
  }>;
  onRequisitionClick?: (
    requisition: Requisition
  ) => void;
}

interface ColumnProps {
  status: RequisitionStatus;
  requisitions: Requisition[];
  onDrop: (
    requisitionId: string,
    newStatus: RequisitionStatus
  ) => void;
  onCardClick: (
    requisition: Requisition
  ) => void;
  columnRef: (
    ref: HTMLDivElement | null
  ) => void;
}

function Column({
  status,
  requisitions,
  onDrop,
  onCardClick,
  columnRef,
}: ColumnProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'REQUISITION',

    drop: (
      item: {
        id: string;
        status: RequisitionStatus;
      }
    ) => {
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
      className={`flex-1 min-w-[270px] bg-muted/[0.08] dark:bg-muted/[0.05] rounded-xl p-5 transition-all duration-300 ${
        isOver
          ? 'bg-accent/[0.12] dark:bg-accent/[0.08] ring-2 ring-accent/40 shadow-xl'
          : ''
      }`}
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-semibold uppercase text-xs tracking-wider text-muted-foreground/90">
          {status}
        </h2>

        <span className="px-2.5 py-1 bg-foreground/10 border border-border/50 rounded-full text-xs font-semibold">
          {requisitions.length}
        </span>
      </div>

      <div className="space-y-3.5 overflow-y-auto overflow-x-visible max-h-[calc(100vh-260px)] pr-3 pb-2 -mr-1 custom-scrollbar">
        {requisitions.map((requisition) => (
          <RequisitionCard
            key={requisition.id}
            requisition={requisition}
            onClick={() =>
              onCardClick(requisition)
            }
          />
        ))}
      </div>
    </div>
  );
}

export function RequisitionKanbanBoard({
  requisitions,
  statuses,
  onStatusChange,
  columnRefs,
  onRequisitionClick,
}: RequisitionKanbanBoardProps) {
  const handleDrop = (
    requisitionId: string,
    newStatus: RequisitionStatus
  ) => {
    onStatusChange(
      requisitionId,
      newStatus
    );
  };

  return (
    <>
      <div className="flex gap-4 overflow-x-auto pb-4 px-1 -mx-1">
        {statuses.map((status) => (
          <Column
            key={status}
            status={status}
            requisitions={requisitions.filter(
              (r) => r.status === status
            )}
            onDrop={handleDrop}
            onCardClick={(req) =>
              onRequisitionClick?.(req)
            }
            columnRef={(ref) => {
              columnRefs.current[status] =
                ref;
            }}
          />
        ))}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(128,128,128,0.3);
          border-radius: 2.5px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(128,128,128,0.5);
        }
      `}</style>
    </>
  );
}