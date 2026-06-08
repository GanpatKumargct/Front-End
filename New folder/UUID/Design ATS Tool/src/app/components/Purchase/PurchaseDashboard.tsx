export default function PurchaseDashboard() {
  const kpis = [
    {
      title: 'Active Requests',
      value: '42',
      change: '+6',
      subtitle: 'Across propulsion, avionics, GSE',
    },
    {
      title: 'Pending Approvals',
      value: '11',
      change: '+2',
      subtitle: 'Awaiting technical review',
    },
    {
      title: 'Open RFQs',
      value: '18',
      change: '+4',
      subtitle: 'Vendor quotations in progress',
    },
    {
      title: 'Delayed Deliveries',
      value: '3',
      change: '-1',
      subtitle: 'Critical procurement delays',
    },
    {
      title: 'Incoming Shipments',
      value: '9',
      change: '+3',
      subtitle: 'Expected within 72 hours',
    },
    {
      title: 'Procurement Cycle',
      value: '14d',
      change: '-2d',
      subtitle: 'Average approval-to-receipt time',
    },
  ]

  const urgentRequests = [
    {
      id: 'PR-2042',
      item: 'Cryogenic Feed Valve Assembly',
      department: 'Propulsion',
      priority: 'Critical',
      due: 'Jun 12',
    },
    {
      id: 'PR-2091',
      item: 'TVC Actuator Housing',
      department: 'Avionics & Controls',
      priority: 'High',
      due: 'Jun 16',
    },
    {
      id: 'PR-2118',
      item: 'Carbon Fiber Composite Sheets',
      department: 'Structures',
      priority: 'Critical',
      due: 'Jun 18',
    },
  ]

  const vendorAlerts = [
    {
      vendor: 'Moog Aerospace',
      issue: 'RFQ response pending for 4 days',
      status: 'Awaiting Response',
    },
    {
      vendor: 'Hexcel Composites',
      issue: 'Shipment delayed due to export clearance',
      status: 'Delayed',
    },
    {
      vendor: 'Parker Hannifin',
      issue: 'Certification renewal expiring in 12 days',
      status: 'Compliance',
    },
  ]

  const procurementPipeline = [
    {
      stage: 'Requests',
      count: 42,
      width: '78%',
    },
    {
      stage: 'Technical Review',
      count: 28,
      width: '56%',
    },
    {
      stage: 'RFQ Issued',
      count: 18,
      width: '44%',
    },
    {
      stage: 'Vendor Evaluation',
      count: 11,
      width: '30%',
    },
    {
      stage: 'Purchase Orders',
      count: 9,
      width: '22%',
    },
    {
      stage: 'Receiving',
      count: 6,
      width: '14%',
    },
  ]

  const incomingDeliveries = [
    {
      po: 'PO-4821',
      item: 'High-Pressure Regulators',
      eta: 'Today · 14:30',
      warehouse: 'Cryogenic Storage',
    },
    {
      po: 'PO-4812',
      item: 'Inconel Turbine Rings',
      eta: 'Tomorrow · 09:00',
      warehouse: 'Materials Receiving',
    },
    {
      po: 'PO-4788',
      item: 'Flight Computer Boards',
      eta: 'Jun 12 · 11:00',
      warehouse: 'Avionics Inspection',
    },
  ]

  return (
    <div className="p-8 space-y-6 bg-background min-h-full">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-['Space_Grotesk'] text-[40px] tracking-[0.04em] text-foreground leading-none">
            Procurement Operations
          </h2>

          <p className="text-muted-foreground mt-1 text-sm">
            Aerospace procurement intelligence · supplier operations · acquisition workflows
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-sm text-emerald-300">
            Procurement Network Operational
          </span>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-4">
          {kpis.map((kpi) => (
            <div
              key={kpi.title}
              className="rounded-2xl border border-border/40 bg-card/40 p-5 backdrop-blur-sm"
            >
              <div className="flex items-start justify-between">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">
                  {kpi.title}
                </span>

                <span className="text-xs text-emerald-400">
                  {kpi.change}
                </span>
              </div>

              <div className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
                {kpi.value}
              </div>

              <div className="mt-2 text-xs text-muted-foreground leading-relaxed">
                {kpi.subtitle}
              </div>
            </div>
          ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-semibold">
                Procurement Pipeline
              </h3>

                <p className="text-sm text-muted-foreground mt-1">
                  Operational acquisition flow across all departments
                </p>
              </div>

              <span className="text-xs text-muted-foreground">
                Last 30 days
              </span>
            </div>

            <div className="space-y-6">
              {procurementPipeline.map((stage) => (
                <div key={stage.stage}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-foreground/80">
                      {stage.stage}
                    </span>

                    <span className="text-sm text-muted-foreground">
                      {stage.count}
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-zinc-300"
                      style={{ width: stage.width }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-6 mt-10 pt-6 border-t border-border/50">
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">
                  Approval Rate
                </div>

                <div className="mt-2 text-2xl font-semibold">
                  91%
                </div>
              </div>

              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">
                  Vendor Response
                </div>

                <div className="mt-2 text-2xl font-semibold">
                  82%
                </div>
              </div>

              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">
                  Compliance Pass
                </div>

                <div className="mt-2 text-2xl font-semibold">
                  97%
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">
                Vendor Alerts
              </h3>

              <span className="text-xs text-muted-foreground">
                3 active
              </span>
            </div>

            <div className="space-y-4">
              {vendorAlerts.map((alert) => (
                <div
                  key={alert.vendor}
                  className="rounded-xl border border-border/30 bg-background/40 p-4"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground text-sm">
                      {alert.vendor}
                    </h4>

                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      {alert.status}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                    {alert.issue}
                  </p>
                </div>
              ))}
            </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold">
                Critical Procurement Requests
              </h3>

                <p className="text-sm text-muted-foreground mt-1">
                  High-priority aerospace acquisition operations
                </p>
              </div>

              <button className="text-sm text-muted-foreground hover:text-white transition">
                View all
              </button>
            </div>

            <div className="space-y-4">
              {urgentRequests.map((request) => (
                <div
                  key={request.id}
                  className="rounded-xl border border-border/30 bg-background/40 p-5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs uppercase tracking-widest text-muted-foreground">
                          {request.id}
                        </span>

                        <span className="rounded-md bg-red-500/10 border border-red-500/20 px-2 py-1 text-[10px] uppercase tracking-widest text-red-300">
                          {request.priority}
                        </span>
                      </div>

                      <h4 className="mt-3 text-lg font-medium text-foreground">
                        {request.item}
                      </h4>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-muted-foreground uppercase tracking-widest">
                        Due
                      </div>

                      <div className="mt-1 text-sm text-foreground/80">
                        {request.due}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
                    <div>
                      <div className="text-xs uppercase tracking-widest text-muted-foreground">
                        Department
                      </div>

                      <div className="mt-1 text-sm text-foreground/80">
                        {request.department}
                      </div>
                    </div>

                    <button className="rounded-lg border border-border/50 px-4 py-2 text-sm text-foreground/80 hover:bg-zinc-800 transition">
                      Open Request
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        <div className="rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">
                Incoming Deliveries
              </h3>

              <span className="text-xs text-muted-foreground">
                Next 72h
              </span>
            </div>

            <div className="space-y-4">
              {incomingDeliveries.map((delivery) => (
                <div
                  key={delivery.po}
                  className="rounded-xl border border-border/30 bg-background/40 p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-widest text-muted-foreground">
                      {delivery.po}
                    </span>

                    <span className="text-xs text-muted-foreground">
                      {delivery.eta}
                    </span>
                  </div>

                  <h4 className="mt-3 font-medium text-foreground leading-relaxed">
                    {delivery.item}
                  </h4>

                  <div className="mt-4 border-t border-white/5 pt-3">
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">
                      Receiving Zone
                    </div>

                    <div className="mt-1 text-sm text-foreground/80">
                      {delivery.warehouse}
                    </div>
                  </div>
                </div>
              ))}
            </div>
        </div>
      </div>
    </div>
  )
}
