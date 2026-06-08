const requisitionCategories = [
  {
    id: 'all',
    title: 'All Requests',
    requests: 42,
    pending: 11,
    critical: 4,
  },
  {
    id: 'software',
    title: 'Software',
    requests: 12,
    pending: 3,
    critical: 1,
  },
  {
    id: 'hardware',
    title: 'Hardware',
    requests: 18,
    pending: 5,
    critical: 2,
  },
  {
    id: 'facility',
    title: 'Facility',
    requests: 7,
    pending: 2,
    critical: 0,
  },
  {
    id: 'network',
    title: 'Network & IT',
    requests: 5,
    pending: 1,
    critical: 1,
  },
]

interface Props {
  onCategorySelect: (category: string) => void;
}

export default function RequisitionPage({
  onCategorySelect,
}: Props) {
  return (
   <div className="px-6 pt-6 pb-4">
  {/* Header */}

  <div className="flex items-end justify-between mb-6">
    <div>
      <h1
        className="text-[28px] tracking-[0.04em] leading-none text-foreground"
        style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 400,
        }}
      >
        Requisition Operations
      </h1>

      <p className="mt-2 text-xs text-muted-foreground tracking-wide">
        Aerospace acquisition requests across operational domains
      </p>
    </div>

    <div className="flex items-center gap-2">
     <div className="px-3 py-1.5 rounded-lg border border-white/[0.06] bg-white/[0.03] text-[11px] tracking-wide text-white/45">
  Procurement Network Stable
</div>
    </div>
  </div>

  {/* Operational Categories */}

<div className="flex items-center gap-3 mb-5 overflow-x-auto pb-1">

  {[
    {
      title: 'All Requests',
      value: '42',
      pending: '11',
    },
    {
      title: 'Software',
      value: '12',
      pending: '3',
    },
    {
      title: 'Hardware',
      value: '18',
      pending: '5',
    },
    {
      title: 'Facility',
      value: '7',
      pending: '2',
    },
    {
      title: 'Network & IT',
      value: '5',
      pending: '1',
    },
    {
      title: 'Literature',
      value: '6',
      pending: '2',
    }
  ].map((card) => (

    <button
      key={card.title}
      onClick={() => onCategorySelect(card.title)}
      className="
        group
        min-w-[190px]
        rounded-xl
        border
        border-white/[0.05]
        bg-[#101012]
        px-4
        py-3
        transition-all
        duration-200
        hover:border-white/[0.10]
        hover:bg-[#141416]
      "
    >
      <div className="flex items-start justify-between">

        <div className="text-left">
          <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">
            {card.title}
          </p>

          <div className="mt-3 flex items-end gap-2">
            <span className="text-[30px] leading-none font-semibold text-white">
              {card.value}
            </span>

            <span className="text-[11px] text-zinc-500 mb-0.5">
              active
            </span>
          </div>
        </div>

        <div className="
          rounded-full
          border
          border-amber-500/20
          bg-amber-500/10
          px-2
          py-0.5
          text-[10px]
          font-medium
          text-amber-300
        ">
          {card.pending}
        </div>

      </div>
    </button>

  ))}

</div>

{/* Placeholder Table Section */}

<div className="mt-8">
  <div className="flex gap-4 overflow-x-auto pb-4">

    {[
      'Draft',
      'Requisition',
      'Under Review',
      'Open',
      'Closed'
    ].map((stage) => (
      <div
        key={stage}
        className="
          min-w-[248px] max-w-[248px]
          bg-muted/[0.08]
          rounded-xl
          border
          border-border/40
          p-3.5
        "
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-semibold text-sm text-foreground">
              {stage}
            </h2>

            <p className="text-[11px] text-muted-foreground mt-1">
              2 requisitions
            </p>
          </div>

          <div className="
            h-6
            min-w-6
            px-2
            rounded-full
            bg-white/[0.05]
            border border-white/[0.06]
            flex items-center justify-center
            text-[11px]
            text-muted-foreground
          ">
            2
          </div>
        </div>

        <div className="space-y-2.5">

          <div className="
            rounded-xl
            border border-border/50
            bg-card/80
            p-3.5
            hover:border-border
            transition-all
            cursor-pointer
          ">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] tracking-wider text-muted-foreground">
                REQ-1001
              </span>

              <span className="
                px-2 py-0.5
                rounded-full
                text-[9px]
                bg-amber-500/10
                text-amber-400
                border border-amber-500/20
              ">
                High
              </span>
            </div>

            <h3 className="text-[13px] font-semibold leading-[1.35] mb-2.5">
              Flight Control Software Licensing
            </h3>

            <div className="space-y-1.5 text-[10px]">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Department</span>
                <span>Avionics</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Budget</span>
                <span>₹39,50,000</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Vendor</span>
                <span>MathWorks India</span>
              </div>
            </div>

            <div className="
              mt-3
              pt-3
              border-t border-border/40
              flex items-center justify-between
              text-[10px]
              text-muted-foreground
            ">
              <span>Digital Systems</span>
              <span>Due Jun 04</span>
            </div>
          </div>

        </div>
      </div>
    ))}
  </div>
</div>
</div>
  )
}