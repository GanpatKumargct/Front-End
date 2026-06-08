import { useMemo, useRef, useState } from 'react';
import { LayoutGrid, List, Search } from 'lucide-react';

import {
  mockRequisitions,
  requisitionStatuses,
  Requisition,
  RequisitionStatus,
} from '../../Data/Requisitions';

import { RequisitionKanbanBoard } from './RequisitionKanbanBoard';
import { RequisitionDetailModal } from './RequisitionDetailModal';

export function RequisitionPage() {
  const [requisitions, setRequisitions] =
    useState(mockRequisitions);

  const [searchTerm, setSearchTerm] =
    useState('');

  const [viewMode, setViewMode] =
    useState<'kanban' | 'list'>('kanban');
  const [selectedRequisition, setSelectedRequisition] =
  useState<Requisition | null>(null);

  const columnRefs = useRef<{
    [key: string]: HTMLDivElement | null;
  }>({});

  const filteredRequisitions = useMemo(() => {
    return requisitions.filter((req) =>
      [
        req.id,
        req.title,
        req.department,
        req.requester,
      ]
        .join(' ')
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [requisitions, searchTerm]);

  const handleStatusChange = (
    requisitionId: string,
    newStatus: RequisitionStatus
  ) => {
    setRequisitions((prev) =>
      prev.map((req) =>
        req.id === requisitionId
          ? {
              ...req,
              status: newStatus,
            }
          : req
      )
    );
  };

  return (
  <div className="h-full flex flex-col bg-background">
      {/* ATS Header */}

<div className="border-b border-border/40">
  <div className="flex items-center justify-between px-5 py-4">

    <div>
      <h1 className="text-2xl font-light tracking-wide">
        The Guild ATS
      </h1>

      <div className="flex items-center gap-6 mt-3 text-xs">

        <span className="px-3 py-1 rounded-md bg-muted/50 font-semibold">
          All · {requisitions.length}
        </span>

        {requisitionStatuses.map((status) => (
          <span
            key={status}
            className="text-muted-foreground font-medium"
          >
            {status} · {
              requisitions.filter(
                (r) => r.status === status
              ).length
            }
          </span>
        ))}
      </div>
    </div>

    <div className="flex items-center gap-3">

      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />

        <input
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
          placeholder="Search requisitions..."
          className="w-[260px] pl-10 pr-4 py-2 rounded-lg border border-border bg-card"
        />
      </div>

      <button
        onClick={() =>
          setViewMode('kanban')
        }
        className={`p-2 rounded-lg ${
          viewMode === 'kanban'
            ? 'bg-muted'
            : ''
        }`}
      >
        <LayoutGrid className="w-4 h-4" />
      </button>

      <button
        onClick={() =>
          setViewMode('list')
        }
        className={`p-2 rounded-lg ${
          viewMode === 'list'
            ? 'bg-muted'
            : ''
        }`}
      >
        <List className="w-4 h-4" />
      </button>
    </div>
  </div>
</div>
      {/* View */}

      <div className="flex-1 min-h-0 px-4 pt-5">
        {viewMode === 'kanban' && (
         <RequisitionKanbanBoard
  requisitions={
    filteredRequisitions
  }
  statuses={
    requisitionStatuses
  }
  onStatusChange={
    handleStatusChange
  }
  columnRefs={columnRefs}
  onRequisitionClick={
    setSelectedRequisition
  }
/>
        )}

        {viewMode === 'list' && (
          <div className="p-6 border border-border rounded-xl">
            Requisition List View
          </div>
        )}
           </div>

      {selectedRequisition && (
        <RequisitionDetailModal
          requisition={selectedRequisition}
          onClose={() =>
            setSelectedRequisition(null)
          }
          onStatusChange={(status) => {
            handleStatusChange(
              selectedRequisition.id,
              status
            );

            setSelectedRequisition({
              ...selectedRequisition,
              status,
            });
          }}
        />
      )}

    </div>
  );
}

export default RequisitionPage;