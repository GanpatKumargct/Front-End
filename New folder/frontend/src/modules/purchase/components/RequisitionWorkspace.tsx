import { useMemo, useState } from 'react';
import { LayoutGrid, List, Search } from 'lucide-react';

import { BackButton } from '@/shared/components/ui/BackButton';
import { requisitionData } from './requisitionData';
import type { RequisitionStage } from './requisitionTypes';

const stages: RequisitionStage[] = [
  'Draft',
  'Requisition',
  'Under Review',
  'Open',
  'Closed',
];

interface Props {
  category: string;
  onBack: () => void;
}

export default function RequisitionWorkspace({
  category,
  onBack,
}: Props) {
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [search, setSearch] = useState('');

  const filteredData = useMemo(() => {
    return requisitionData.filter((item) => {
      const matchesCategory =
        category === 'All Requests'
          ? true
          : item.category === category;

      const matchesSearch =
        item.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        item.id.toLowerCase().includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  return (
    <div className="px-6 py-6">
      <BackButton onClick={onBack} label="Back to Categories" className="mb-4" />

      {/* Header */}

      <div className="flex items-end justify-between mb-6">
        <div>
          <h1
            className="text-[28px] tracking-[0.04em] leading-none text-foreground"
            style={{
              fontFamily: 'Fauna Thin, serif',
              fontWeight: 100,
            }}
          >
            {category}
          </h1>

          <p className="mt-2 text-xs tracking-wide text-muted-foreground">
            Procurement workflow and operational requisitions
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* search */}

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search requisitions..."
              className="
                h-10
                w-[240px]
                rounded-xl
                border
                border-white/[0.05]
                bg-[#101012]
                pl-9
                pr-4
                text-sm
                text-white
                outline-none
                transition-all
                focus:border-white/[0.12]
              "
            />
          </div>

          {/* toggle */}

          <div className="flex items-center rounded-xl border border-white/[0.05] bg-[#101012] p-1">
            <button
              onClick={() => setView('kanban')}
              className={`
                rounded-lg
                px-3
                py-2
                transition-all
                ${
                  view === 'kanban'
                    ? 'bg-white/10 text-white'
                    : 'text-zinc-500 hover:text-white'
                }
              `}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>

            <button
              onClick={() => setView('list')}
              className={`
                rounded-lg
                px-3
                py-2
                transition-all
                ${
                  view === 'list'
                    ? 'bg-white/10 text-white'
                    : 'text-zinc-500 hover:text-white'
                }
              `}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* CONTENT */}

      {view === 'kanban' ? (
        <div className="grid grid-cols-5 gap-4 overflow-x-auto pb-4">
          {stages.map((stage) => {
            const stageItems = filteredData.filter(
              (item) => item.status === stage
            );

            return (
              <div
                key={stage}
                className="rounded-2xl border border-white/[0.05] bg-[#0E0E10] min-h-[680px]"
              >
                {/* column header */}

                <div className="sticky top-0 z-10 border-b border-white/[0.05] bg-[#0E0E10]/95 backdrop-blur-xl px-4 py-4 rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-medium text-white">
                        {stage}
                      </h2>

                      <p className="mt-1 text-[11px] text-zinc-500">
                        {stageItems.length} requisitions
                      </p>
                    </div>

                    <div className="rounded-full bg-white/[0.04] px-2 py-1 text-[10px] text-zinc-400">
                      {stageItems.length}
                    </div>
                  </div>
                </div>

                {/* cards */}

                <div className="space-y-3 p-3">
                  {stageItems.map((item) => (
                    <button
                      key={item.id}
                      className="
                        w-full
                        rounded-xl
                        border
                        border-white/[0.05]
                        bg-[#131315]
                        p-4
                        text-left
                        transition-all
                        hover:border-white/[0.10]
                        hover:bg-[#17171A]
                      "
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs text-zinc-500">
                            {item.id}
                          </p>

                          <h3 className="mt-2 text-sm font-medium leading-relaxed text-white">
                            {item.title}
                          </h3>
                        </div>

                        <div
                          className={`
                            rounded-full
                            px-2
                            py-1
                            text-[10px]
                            font-medium
                            ${
                              item.priority === 'Critical'
                                ? 'bg-red-500/10 text-red-300'
                                : item.priority === 'High'
                                ? 'bg-orange-500/10 text-orange-300'
                                : item.priority === 'Medium'
                                ? 'bg-amber-500/10 text-amber-300'
                                : 'bg-zinc-500/10 text-zinc-400'
                            }
                          `}
                        >
                          {item.priority}
                        </div>
                      </div>

                      <div className="mt-5 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-500">
                            Department
                          </span>

                          <span className="text-zinc-300">
                            {item.department}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-500">
                            Budget
                          </span>

                          <span className="text-zinc-300">
                            {item.budget}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-500">
                            Vendor
                          </span>

                          <span className="text-zinc-300">
                            {item.vendor}
                          </span>
                        </div>
                      </div>

                      <div className="mt-5 border-t border-white/[0.04] pt-3 flex items-center justify-between">
                        <span className="text-[11px] text-zinc-500">
                          {item.owner}
                        </span>

                        <span className="text-[11px] text-zinc-600">
                          Due {item.dueDate}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/[0.05] bg-[#0E0E10]">
          {/* header */}

          <div className="grid grid-cols-6 border-b border-white/[0.05] px-5 py-4 text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            <div>Request</div>
            <div>Department</div>
            <div>Status</div>
            <div>Priority</div>
            <div>Budget</div>
            <div>Due Date</div>
          </div>

          {filteredData.map((item) => (
            <button
              key={item.id}
              className="
                grid
                w-full
                grid-cols-6
                border-b
                border-white/[0.04]
                px-5
                py-5
                text-left
                transition-all
                hover:bg-white/[0.03]
              "
            >
              <div>
                <p className="text-sm font-medium text-white">
                  {item.title}
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  {item.id}
                </p>
              </div>

              <div className="text-sm text-zinc-300">
                {item.department}
              </div>

              <div>
                <span className="rounded-full bg-white/[0.05] px-2 py-1 text-[11px] text-zinc-300">
                  {item.status}
                </span>
              </div>

              <div className="text-sm text-zinc-300">
                {item.priority}
              </div>

              <div className="text-sm text-zinc-300">
                {item.budget}
              </div>

              <div className="text-sm text-zinc-500">
                {item.dueDate}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}