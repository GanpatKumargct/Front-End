import { Briefcase } from 'lucide-react';

interface ERPModuleCatalogProps {
  onModuleSelect: (moduleId: string) => void;
  currentModule?: string;
}

export function ERPModuleCatalog({ onModuleSelect }: ERPModuleCatalogProps) {
  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-6">
      <div className="w-full max-w-5xl">
        {/* Title Block */}
        <div className="mb-14 text-center">
          <h1
            className="text-4xl text-zinc-100 mb-3 tracking-wide"
            style={{
              fontFamily: 'Fauna One, serif',
              fontWeight: 300,
              letterSpacing: '0.06em',
            }}
          >
            Enterprise Modules
          </h1>
          <p className="text-zinc-500 text-sm font-medium tracking-wide">
            Select an operational system
          </p>
        </div>

        {/* 3-Column Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: ATS Platform */}
          <button
            onClick={() => onModuleSelect('ats')}
            className="group relative p-8 rounded-2xl border border-zinc-800/80 bg-[#121214]/60 hover:bg-[#121214]/90 hover:border-zinc-700/80 transition-all duration-300 text-left cursor-pointer flex flex-col justify-between h-[280px] w-full focus:outline-none focus:ring-1 focus:ring-zinc-700"
          >
            <div>
              <div className="mb-6 text-zinc-400 group-hover:text-zinc-200 transition-colors">
                <Briefcase className="w-7 h-7" strokeWidth={1.5} />
              </div>
              <h2 className="text-lg font-semibold text-zinc-100 mb-3 tracking-wide">
                ATS Platform
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed font-light">
                Recruitment operations, hiring pipelines, referrals, interviews, and workforce acquisition.
              </p>
            </div>
          </button>

          {/* Card 2: HRMS (Coming Soon) */}
          <div className="p-8 rounded-2xl border border-zinc-900/60 bg-[#121214]/20 opacity-40 text-left flex flex-col justify-start h-[280px]">
            <div>
              <h2 className="text-lg font-semibold text-zinc-500 mb-2 tracking-wide">
                HRMS
              </h2>
              <p className="text-sm text-zinc-600 font-light">
                Coming soon
              </p>
            </div>
          </div>

          {/* Card 3: Procurement */}
          <button
            onClick={() => onModuleSelect('procurement')}
            className="group relative p-8 rounded-2xl border border-zinc-800/80 bg-[#121214]/60 hover:bg-[#121214]/90 hover:border-zinc-700/80 transition-all duration-300 text-left cursor-pointer flex flex-col justify-between h-[280px] w-full focus:outline-none focus:ring-1 focus:ring-zinc-700"
          >
            <div>
              <div className="mb-6 text-zinc-400 group-hover:text-zinc-200 transition-colors">
                <Briefcase className="w-7 h-7" strokeWidth={1.5} />
              </div>
              <h2 className="text-lg font-semibold text-zinc-100 mb-3 tracking-wide">
                Procurement
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed font-light">
                Vendor management, RFQs, procurement operations, supplier workflows, and acquisition systems.
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
