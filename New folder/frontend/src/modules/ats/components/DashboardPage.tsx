import { useCandidatesQuery, useJobsQuery, useInterviewsQuery } from '../hooks/useATS';
import { mockRecruiters } from '../../../shared/api/mocks/Recruiters';
import { departments } from '../../../shared/api/mocks/Departments';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Briefcase,
  CalendarDays,
  FileCheck,
  Clock,
  AlertCircle,
  CheckCircle2,
  UserCheck,
  Target,
  Activity,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Circle
} from 'lucide-react';

export function DashboardPage({
  setActiveTab,
  setSelectedCandidate,
  setCandidateStageFilter,
}: {
  setActiveTab: (tab: any) => void;
  setSelectedCandidate: (candidate: any) => void;
  setCandidateStageFilter: (stage: string | null) => void;
}) {
  // Fetch real-time caching values
  const { data: candidates = [] } = useCandidatesQuery();
  const { data: jobs = [] } = useJobsQuery();
  const { data: interviews = [] } = useInterviewsQuery();

  // Calculate metrics
  const totalApplicants = candidates.length;
  const activeRequisitions = jobs.filter(j => j.status === 'open').length;
  const interviewsInProgress = interviews.filter(
    i => i.status === 'scheduled' || i.status === 'pending_feedback'
  ).length;
  const offersPending = candidates.filter(c => c.status === "Founders' Interview").length;
  const hiresMade = candidates.filter(c => c.status === 'Selected').length;

  // Hiring velocity (avg time to hire)
  const avgTimeToHire = mockRecruiters.length > 0 ? Math.round(
    mockRecruiters.reduce((acc, r) => acc + r.avgTimeToHire, 0) / mockRecruiters.length
  ) : 0;

  // Conversion funnel
  const screening = candidates.filter(c => c.status === 'Screening').length;
  const fitment = candidates.filter(c => c.status === 'Fitment Evaluation').length;
  const technical = candidates.filter(c => c.status === 'Technical Interview').length;
  const ptc = candidates.filter(c => c.status === 'PTC Interview').length;
  const founders = candidates.filter(c => c.status === "Founders' Interview").length;
  const selected = candidates.filter(c => c.status === 'Selected').length;

  // Department pipeline health
  const deptHealth = departments.map(dept => {
    const deptCandidates = candidates.filter(c => c.department === dept.code);
    const deptJobs = jobs.filter(j => j.departmentCode === dept.code && j.status === 'open');
    const avgProgress = deptJobs.length > 0
      ? Math.round((deptCandidates.filter(c => c.status === 'Selected').length / dept.openRoles) * 100)
      : 0;

    return {
      ...dept,
      progress: Math.min(100, avgProgress),
      applicants: deptCandidates.length,
      jobs: deptJobs.length
    };
  }).sort((a, b) => b.progress - a.progress).slice(0, 8);

  // Upcoming interviews (next 7 days)
  const upcomingInterviews = interviews
    .filter(i => i.status === 'scheduled')
    .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
    .slice(0, 5);

  // Bottleneck alerts
  const bottlenecks = [
    {
      type: 'aging',
      message: 'REQ-1012: Lead Aerodynamics Engineer aging 134 days',
      priority: 'high' as const
    },
    {
      type: 'feedback',
      message: '3 interviews pending feedback submission',
      priority: 'medium' as const
    },
    {
      type: 'pipeline',
      message: 'CFD department has 6 candidates in Technical Interview stage',
      priority: 'low' as const
    }
  ];

  // Priority roles
  const priorityRoles = jobs
    .filter(j => j.priority === 'urgent' && j.status === 'open')
    .slice(0, 5);

  // Recruiter workload
  const recruiterWorkload = mockRecruiters
    .filter(r => r.status === 'active')
    .sort((a, b) => b.activeRequisitions - a.activeRequisitions)
    .slice(0, 5);

  // Role demand trends (top roles by applicant volume)
  const roleDemand = jobs
    .filter(j => j.status === 'open')
    .sort((a, b) => b.applicants - a.applicants)
    .slice(0, 6);

  // Recent recruiter activity
  const recruiterActivity = [
    { recruiter: 'Rohan Okafor', action: 'Shortlisted candidate for Lead Aerodynamics Engineer', time: '5 min ago', type: 'shortlist' },
    { recruiter: 'Priya Sharma', action: 'Scheduled technical interview with Elena Petrova', time: '12 min ago', type: 'interview' },
    { recruiter: 'Marcus Johnson', action: 'Submitted offer for Senior GNC Engineer position', time: '28 min ago', type: 'offer' },
    { recruiter: 'Rohan Okafor', action: 'Moved Daniel Müller to Founders Interview stage', time: '1 hr ago', type: 'stage_change' },
    { recruiter: 'Priya Sharma', action: 'Added new requisition for Materials Engineer', time: '2 hr ago', type: 'requisition' },
    { recruiter: 'Marcus Johnson', action: 'Updated feedback for Kwame Asante technical round', time: '3 hr ago', type: 'feedback' },
  ];

  // Aging requisitions
  const agingReqs = jobs
    .filter(j => j.status === 'open' && j.daysOpen > 90)
    .sort((a, b) => b.daysOpen - a.daysOpen)
    .slice(0, 5);

  // Pipeline health metrics
  const conversionRate = totalApplicants > 0 ? ((selected / totalApplicants) * 100).toFixed(1) : '0';
  const interviewRate = totalApplicants > 0 ? (((technical + ptc + founders) / totalApplicants) * 100).toFixed(1) : '0';

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight mb-1">Recruitment Operations</h2>
          <p className="text-xs text-muted-foreground">
            Real-time hiring intelligence · {mockRecruiters.filter(r => r.status === 'active').length} active recruiters · {departments.length} departments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-2">
              <Circle className="w-2 h-2 fill-green-500 text-green-500" />
              <span className="text-xs text-muted-foreground">System Operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-6 gap-4">
        <MetricCard
          icon={<Users className="w-4 h-4" />}
          label="Total Applicants"
          value={totalApplicants}
          change="+12%"
          trend="up"
          onClick={() => setActiveTab('candidates')}
        />
        <MetricCard
          icon={<Briefcase className="w-4 h-4" />}
          label="Active Requisitions"
          value={activeRequisitions}
          change="+3"
          trend="up"
          onClick={() => setActiveTab('jobs')}
        />
        <MetricCard
          icon={<CalendarDays className="w-4 h-4" />}
          label="Interviews In Progress"
          value={interviewsInProgress}
          change="+5"
          trend="up"
          onClick={() => setActiveTab('interviews')}
        />
        <MetricCard
          icon={<FileCheck className="w-4 h-4" />}
          label="Offers Pending"
          value={offersPending}
          change="0"
          trend="neutral"
        />
        <MetricCard
          icon={<CheckCircle2 className="w-4 h-4" />}
          label="Hires Made"
          value={hiresMade}
          change="+2"
          trend="up"
        />
        <MetricCard
          icon={<Clock className="w-4 h-4" />}
          label="Avg Time to Hire"
          value={`${avgTimeToHire}d`}
          change="-5d"
          trend="down"
          onClick={() => setActiveTab('analytics')}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-4">
        {/* Conversion Funnel */}
        <div className="col-span-2 p-5 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Candidate Conversion Funnel</h3>
            <span className="text-[10px] text-muted-foreground">Last 30 days</span>
          </div>
          <div className="space-y-3">
            <FunnelStage
  label="Screening"
  count={screening}
  total={totalApplicants}
  onClick={() => {
    setCandidateStageFilter('Screening');
    setActiveTab('candidates');
  }}
/>
            <FunnelStage
  label="Fitment Evaluation"
  count={fitment}
  total={totalApplicants}
  onClick={() => {
    setCandidateStageFilter('Fitment Evaluation');
    setActiveTab('candidates');
  }}
/>
            <FunnelStage
  label="Technical Interview"
  count={technical}
  total={totalApplicants}
  onClick={() => {
    setCandidateStageFilter('Technical Interview');
    setActiveTab('candidates');
  }}
/>
            <FunnelStage
  label="PTC Interview"
  count={ptc}
  total={totalApplicants}
  onClick={() => {
    setCandidateStageFilter('PTC Interview');
    setActiveTab('candidates');
  }}
/>
            <FunnelStage
  label="Founders Interview"
  count={founders}
  total={totalApplicants}
  onClick={() => {
    setCandidateStageFilter("Founders' Interview");
    setActiveTab('candidates');
  }}
/>
            <FunnelStage
  label="Selected"
  count={selected}
  total={totalApplicants}
  onClick={() => {
    setCandidateStageFilter('Selected');
    setActiveTab('candidates');
  }}
/>
          </div>
          <div className="mt-4 pt-4 border-t border-border/50 grid grid-cols-3 gap-4">
            <div>
              <p className="text-[10px] text-muted-foreground mb-0.5">Conversion Rate</p>
              <p className="text-sm font-bold text-foreground">{conversionRate}%</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground mb-0.5">Interview Rate</p>
              <p className="text-sm font-bold text-foreground">{interviewRate}%</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground mb-0.5">Avg. Time</p>
              <p className="text-sm font-bold text-foreground">{avgTimeToHire}d</p>
            </div>
          </div>
        </div>

        {/* Bottleneck Alerts */}
        <div className="p-5 rounded-xl border border-border bg-card">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            Bottleneck Alerts
          </h3>
          <div className="space-y-3">
            {bottlenecks.map((alert, i) => (
              <div
                key={i}
                className="p-3 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-2">
                  <div
                    className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                      alert.priority === 'high'
                        ? 'bg-red-500'
                        : alert.priority === 'medium'
                        ? 'bg-amber-500'
                        : 'bg-foreground/40'
                    }`}
                  />
                  <p className="text-xs text-foreground leading-relaxed">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Department Pipeline Health */}
        <div className="col-span-2 p-5 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Department Pipeline Health</h3>
            <span className="text-[10px] text-muted-foreground">Top 8 by progress</span>
          </div>
          <div className="space-y-3">
            {deptHealth.map((dept) => (
              <div key={dept.id} className="space-y-1.5 hover:opacity-80 transition-opacity cursor-pointer">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{dept.name}</span>
                    <span className="text-muted-foreground text-[10px]">({dept.code})</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                    <span>{dept.jobs} roles</span>
                    <span>{dept.applicants} candidates</span>
                    <span className="font-bold text-foreground text-xs">{dept.progress}%</span>
                  </div>
                </div>
                <div className="h-1.5 bg-muted/40 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 bg-foreground/60"
                    style={{ width: `${dept.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Interviews */}
        <div className="p-5 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Upcoming Interviews</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-foreground/10 text-foreground font-medium border border-border/50">
              {upcomingInterviews.length}
            </span>
          </div>
          <div className="space-y-2.5">
            {upcomingInterviews.map((interview) => (
              <div
                key={interview.id}
                onClick={() => {
                  const candidate = candidates.find(
                    c => c.name === interview.candidateName
                  );
                  if (candidate) {
                    setSelectedCandidate(candidate);
                  }
                }}
                className="p-3 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-1">
                  <p className="text-xs font-medium text-foreground">{interview.candidateName}</p>
                  <span className="text-[10px] px-1.5 py-0.5 rounded border border-border/50 bg-muted/30 text-muted-foreground uppercase tracking-wider">
                    {interview.type}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground mb-1.5">{interview.jobTitle}</p>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span className="font-medium">{new Date(interview.scheduledDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  <span>{interview.scheduledTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Third Row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Priority Hiring Roles */}
        <div className="p-5 rounded-xl border border-border bg-card">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-red-500" />
            Priority Hiring Roles
          </h3>
          <div className="space-y-2.5">
            {priorityRoles.map((job) => (
              <div
                key={job.id}
                className="p-3 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <p className="text-xs font-medium text-foreground">{job.title}</p>
                    <p className="text-[10px] text-muted-foreground">{job.department}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-red-500/10 text-red-500 font-medium border border-red-500/20">
                    URGENT
                  </span>
                </div>
                <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                  <span>{job.applicants} applicants</span>
                  <span>{job.daysOpen}d open</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Role Demand Trends */}
        <div className="p-5 rounded-xl border border-border bg-card">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Role Demand Trends
          </h3>
          <div className="space-y-2.5">
            {roleDemand.map((job, index) => (
              <div
                key={job.id}
                className="flex items-center justify-between p-2.5 rounded-lg border border-border/50 bg-muted/20"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-muted-foreground w-4">#{index + 1}</span>
                  <div>
                    <p className="text-xs font-medium text-foreground">{job.title}</p>
                    <p className="text-[10px] text-muted-foreground">{job.departmentCode}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-foreground">{job.applicants}</p>
                  <p className="text-[10px] text-muted-foreground">applicants</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recruiter Workload */}
        <div className="p-5 rounded-xl border border-border bg-card">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <UserCheck className="w-4 h-4" />
            Recruiter Workload
          </h3>
          <div className="space-y-2.5">
            {recruiterWorkload.map((recruiter) => (
              <div
                key={recruiter.id}
                className="p-3 rounded-lg border border-border/50 bg-muted/20"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-xs font-medium text-foreground">{recruiter.name}</p>
                    <p className="text-[10px] text-muted-foreground capitalize">{recruiter.role.replace(/_/g, ' ')}</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${
                    recruiter.status === 'active' ? 'bg-green-500' : 'bg-amber-500'
                  }`} />
                </div>
                <div className="grid grid-cols-3 gap-2 text-[10px]">
                  <div>
                    <p className="text-muted-foreground">Active</p>
                    <p className="font-semibold text-foreground">{recruiter.activeRequisitions}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Int.</p>
                    <p className="font-semibold text-foreground">{recruiter.interviewsScheduled}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Hires</p>
                    <p className="font-semibold text-foreground">{recruiter.hiresMade}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fourth Row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Aging Requisitions */}
        <div className="p-5 rounded-xl border border-border bg-card">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />
            Aging Requisitions
          </h3>
          <div className="space-y-2.5">
            {agingReqs.map((job) => (
              <div
                key={job.id}
                className="p-3 rounded-lg border border-border/50 bg-muted/20"
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-foreground">{job.title}</p>
                    <p className="text-[10px] text-muted-foreground">{job.departmentCode} · {job.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-amber-500">{job.daysOpen}d</p>
                    <p className="text-[10px] text-muted-foreground">open</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                  <span>{job.applicants} applicants</span>
                  <span>{job.shortlisted} shortlisted</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recruiter Activity Feed */}
        <div className="col-span-2 p-5 rounded-xl border border-border bg-card">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Recruiter Activity Feed
          </h3>
          <div className="space-y-2">
            {recruiterActivity.map((activity, i) => (
              <div
                key={i}
                className="p-3 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${
                    activity.type === 'offer' ? 'bg-green-500' :
                    activity.type === 'requisition' ? 'bg-amber-500' :
                    'bg-foreground/40'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-foreground">
                          <span className="font-semibold">{activity.recruiter}</span>
                          {' '}
                          <span className="text-muted-foreground">{activity.action}</span>
                        </p>
                      </div>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">{activity.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pipeline Health KPIs */}
      <div className="grid grid-cols-6 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card hover:bg-muted/20 transition-all duration-200 cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Conversion Rate</p>
            <Zap className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <p className="text-2xl font-bold">{conversionRate}%</p>
            <span className="text-xs text-green-500 flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />
              +0.3%
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground">screening → selected</p>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card hover:bg-muted/20 transition-all duration-200 cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Interview Rate</p>
            <CalendarDays className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <p className="text-2xl font-bold">{interviewRate}%</p>
            <span className="text-xs text-green-500 flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />
              +1.2%
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground">reaching interviews</p>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card hover:bg-muted/20 transition-all duration-200 cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Time to Hire</p>
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <p className="text-2xl font-bold">{avgTimeToHire}d</p>
            <span className="text-xs text-green-500 flex items-center gap-0.5">
              <ArrowDownRight className="w-3 h-3" />
              -5d
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground">average velocity</p>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card hover:bg-muted/20 transition-all duration-200 cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Active Pipeline</p>
            <Users className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <p className="text-2xl font-bold">{screening + fitment + technical + ptc + founders}</p>
            <span className="text-xs text-green-500 flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />
              +8
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground">in active stages</p>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card hover:bg-muted/20 transition-all duration-200 cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Open Positions</p>
            <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <p className="text-2xl font-bold">{activeRequisitions}</p>
            <span className="text-xs text-green-500 flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />
              +3
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground">across {departments.length} depts</p>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card hover:bg-muted/20 transition-all duration-200 cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Fill Rate</p>
            <CheckCircle2 className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <p className="text-2xl font-bold">{Math.round((hiresMade / activeRequisitions) * 100)}%</p>
            <span className="text-xs text-green-500 flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />
              +2%
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground">positions filled</p>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function MetricCard({
  icon,
  label,
  value,
  change,
  trend,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  onClick?: () => void;
}) {
  return (
<div
  onClick={onClick}
  className="p-4 rounded-xl border border-border bg-card hover:bg-muted/20 transition-all duration-200 cursor-pointer group"
>
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 rounded-lg bg-muted/40 group-hover:bg-muted/60 transition-colors">
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-[10px] font-medium ${
          trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-muted-foreground'
        }`}>
          {trend === 'up' && <TrendingUp className="w-3 h-3" />}
          {trend === 'down' && <TrendingDown className="w-3 h-3" />}
          {change}
        </div>
      </div>
      <div className="text-2xl font-bold mb-0.5 group-hover:text-foreground/90 transition-colors">{value}</div>
      <div className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</div>
    </div>
  );
}

function FunnelStage({
  label,
  count,
  total,
  onClick,
}: {
  label: string;
  count: number;
  total: number;
  onClick?: () => void;
}) {
  const percentage = ((count / total) * 100).toFixed(1);
  const width = Math.max(5, (count / total) * 100);

  return (
    <div
  onClick={onClick}
  className="space-y-1.5 cursor-pointer hover:opacity-80 transition-opacity"
>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <div className="flex items-center gap-3">
          <span className="font-semibold text-foreground">{count}</span>
          <span className="text-muted-foreground w-12 text-right">{percentage}%</span>
        </div>
      </div>
      <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
        <div
          className="h-full bg-foreground/50 rounded-full transition-all duration-500"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}
