function MetricCard({ label, value, sub }) {
  return <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-1.5">
      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">{label}</span>
      <span className="text-2xl font-bold text-foreground tracking-tight">{value}</span>
      {sub && <span className="text-[11px] text-muted-foreground">{sub}</span>}
    </div>;
}
function HBar({ label, value, max, sub }) {
  const pct = max > 0 ? Math.round(value / max * 100) : 0;
  return <div className="flex items-center gap-3">
      <span className="text-[10px] text-muted-foreground w-32 flex-shrink-0 truncate">{label}</span>
      <div className="flex-1 h-1.5 bg-muted/30 rounded-full overflow-hidden">
        <div className="h-full bg-foreground/55 rounded-full" style={{ width: `${pct}%`, transition: "width 0.5s ease" }} />
      </div>
      <span className="text-[10px] font-semibold text-muted-foreground w-6 text-right">{value}</span>
      {sub && <span className="text-[10px] text-muted-foreground/60 w-12">{sub}</span>}
    </div>;
}
function VBars({ data, labelKey, valueKey, height = 140 }) {
  const max = Math.max(...data.map((d) => d[valueKey]), 1);
  return <div className="flex items-end gap-1.5" style={{ height }}>
      {data.map((d, i) => {
    const pct = d[valueKey] / max * 100;
    return <div key={`${d[labelKey]}-${i}`} className="flex-1 flex flex-col items-center gap-1 group">
            <span className="text-[9px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
              {d[valueKey]}
            </span>
            <div className="w-full bg-muted/30 rounded-sm overflow-hidden" style={{ height: height - 24 }}>
              <div
      className="w-full bg-foreground/55 rounded-sm"
      style={{ height: `${pct}%`, marginTop: `${100 - pct}%`, transition: "height 0.5s ease" }}
    />
            </div>
            <span className="text-[8px] text-muted-foreground truncate w-full text-center">{d[labelKey]}</span>
          </div>;
  })}
    </div>;
}
function SparkLine({ data, valueKey }) {
  const values = data.map((d) => d[valueKey]);
  const max = Math.max(...values, 1);
  const min = Math.min(...values);
  const W = 320;
  const H = 80;
  const pad = 8;
  const points = values.map((v, i) => {
    const x = pad + i / (values.length - 1) * (W - pad * 2);
    const y = H - pad - (v - min) / (max - min || 1) * (H - pad * 2);
    return `${x},${y}`;
  });
  const polyline = points.join(" ");
  const areaClose = `${points[points.length - 1].split(",")[0]},${H} ${pad},${H}`;
  return <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }}>
      <polyline
    points={`${pad},${H} ${polyline} ${areaClose}`}
    fill="var(--foreground)"
    fillOpacity={0.06}
    stroke="none"
  />
      <polyline
    points={polyline}
    fill="none"
    stroke="var(--foreground)"
    strokeOpacity={0.55}
    strokeWidth={1.5}
    strokeLinejoin="round"
    strokeLinecap="round"
  />
      {values.map((v, i) => {
    const [x, y] = points[i].split(",").map(Number);
    return <circle key={i} cx={x} cy={y} r={3} fill="var(--foreground)" fillOpacity={0.7} />;
  })}
    </svg>;
}
function AnalyticsPage({ candidates }) {
  const total = candidates.length;
  const active = candidates.filter((c) => !["Selected", "Rejected"].includes(c.status)).length;
  const shortlisted = candidates.filter(
    (c) => ["Technical Interview", "PTC Interview", "Founder's Interview"].includes(c.status)
  ).length;
  const hires = candidates.filter((c) => c.status === "Selected").length;
  const multiRole = candidates.filter((c) => c.multipleRoles && c.multipleRoles.length > 1).length;
  const conversionRate = total > 0 ? (hires / total * 100).toFixed(1) : "0";
  const avgExp = (candidates.reduce((s, c) => s + c.experience, 0) / total).toFixed(1);
  const stages = ["Screening", "Fitment Evaluation", "Technical Interview", "PTC Interview", "Founder's Interview", "Selected", "Rejected"];
  const stageData = stages.map((s) => ({
    stage: s,
    short: s.length > 14 ? s.slice(0, 13) + "\u2026" : s,
    count: candidates.filter((c) => c.status === s).length
  }));
  const deptMap = {};
  candidates.forEach((c) => {
    deptMap[c.department] = (deptMap[c.department] || 0) + 1;
  });
  const deptData = Object.entries(deptMap).map(([dept, count]) => ({ dept, count })).sort((a, b) => b.count - a.count).slice(0, 12);
  const expData = [
    { range: "0\u20133y", count: candidates.filter((c) => c.experience <= 3).length },
    { range: "4\u20136y", count: candidates.filter((c) => c.experience >= 4 && c.experience <= 6).length },
    { range: "7\u201310y", count: candidates.filter((c) => c.experience >= 7 && c.experience <= 10).length },
    { range: "11\u201315y", count: candidates.filter((c) => c.experience >= 11 && c.experience <= 15).length },
    { range: "16+y", count: candidates.filter((c) => c.experience >= 16).length }
  ];
  const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May"];
  const monthMap = {};
  candidates.forEach((c) => {
    const m = c.appliedDate.split(" ")[0];
    if (monthOrder.includes(m)) monthMap[m] = (monthMap[m] || 0) + 1;
  });
  const monthData = monthOrder.map((m) => ({ month: m, count: monthMap[m] || 0 }));
  const roleMap = {};
  candidates.forEach((c) => {
    roleMap[c.role] = (roleMap[c.role] || 0) + 1;
  });
  const roleData = Object.entries(roleMap).map(([role, count]) => ({ role, count })).sort((a, b) => b.count - a.count);
  const maxRole = Math.max(...roleData.map((r) => r.count), 1);
  const deptExpMap = {};
  candidates.forEach((c) => {
    if (!deptExpMap[c.department]) deptExpMap[c.department] = [];
    deptExpMap[c.department].push(c.experience);
  });
  const deptExpData = Object.entries(deptExpMap).map(([dept, exps]) => ({
    dept,
    avg: parseFloat((exps.reduce((s, e) => s + e, 0) / exps.length).toFixed(1))
  })).sort((a, b) => b.avg - a.avg).slice(0, 10);
  const maxAvgExp = Math.max(...deptExpData.map((d) => d.avg), 1);
  return <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight mb-0.5">Analytics</h2>
        <p className="text-xs text-muted-foreground">Hiring intelligence across all departments · May 2026</p>
      </div>

      {
    /* Metric Cards */
  }
      <div className="grid grid-cols-6 gap-3">
        <MetricCard label="Total Applicants" value={total} sub="All departments" />
        <MetricCard label="Active Pipeline" value={active} sub="Not yet closed" />
        <MetricCard label="Shortlisted" value={shortlisted} sub="In interviews" />
        <MetricCard label="Hires Completed" value={hires} sub={`${conversionRate}% conversion`} />
        <MetricCard label="Avg Experience" value={`${avgExp}y`} sub="Across all candidates" />
        <MetricCard label="Multi-Role" value={multiRole} sub="Applying to 2+ roles" />
      </div>

      {
    /* Row 1: Pipeline + Monthly Trend */
  }
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-4">Pipeline Stages</h3>
          <div className="space-y-2.5">
            {stageData.map(({ stage, short, count }) => <div key={stage} className="flex items-center gap-3">
                <span className="text-[10px] text-muted-foreground w-36 flex-shrink-0 truncate">{short}</span>
                <div className="flex-1 h-1.5 bg-muted/30 rounded-full overflow-hidden">
                  <div
    className="h-full bg-foreground/55 rounded-full"
    style={{ width: `${total > 0 ? count / total * 100 : 0}%`, transition: "width 0.5s ease" }}
  />
                </div>
                <span className="text-[10px] font-semibold text-muted-foreground w-5 text-right">{count}</span>
              </div>)}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">Monthly Application Trend</h3>
          <SparkLine data={monthData} valueKey="count" />
          <div className="flex justify-between mt-1">
            {monthData.map(({ month, count }) => <div key={month} className="flex flex-col items-center gap-0.5">
                <span className="text-[9px] font-semibold text-muted-foreground">{count}</span>
                <span className="text-[8px] text-muted-foreground/60">{month}</span>
              </div>)}
          </div>
        </div>
      </div>

      {
    /* Row 2: Dept Applicants + Experience Distribution */
  }
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-4">Applicants by Department</h3>
          <VBars data={deptData} labelKey="dept" valueKey="count" height={160} />
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-4">Experience Distribution</h3>
          <VBars data={expData} labelKey="range" valueKey="count" height={160} />
        </div>
      </div>

      {
    /* Row 3: Role Demand + Avg Exp by Dept */
  }
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-4">Role Demand</h3>
          <div className="space-y-2.5">
            {roleData.map(({ role, count }) => <HBar key={role} label={role} value={count} max={maxRole} />)}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-4">Avg Experience by Department</h3>
          <div className="space-y-2.5">
            {deptExpData.map(({ dept, avg }) => <HBar key={dept} label={dept} value={avg} max={maxAvgExp} sub="yrs avg" />)}
          </div>
        </div>
      </div>

      {
    /* Conversion Summary */
  }
      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-4">Stage Conversion Rates</h3>
        <div className="grid grid-cols-7 gap-2">
          {stageData.map(({ stage, short, count }) => {
    const rate = total > 0 ? Math.round(count / total * 100) : 0;
    return <div key={stage} className="text-center">
                <div className="text-lg font-bold text-foreground">{rate}%</div>
                <div className="text-[9px] text-muted-foreground mt-0.5 leading-tight">{short}</div>
                <div className="text-[9px] text-muted-foreground/60">{count}</div>
              </div>;
  })}
        </div>
      </div>
    </div>;
}
export {
  AnalyticsPage
};
