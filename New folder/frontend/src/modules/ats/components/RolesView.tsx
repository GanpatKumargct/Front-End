import { useState } from 'react';
import { useJobsQuery, useCandidatesQuery } from '../hooks/useATS';
import { BackButton } from '../../../shared/components/ui/BackButton';
import {
  Users,
  Clock,
  AlertTriangle,
  Link2,
  FileText
} from 'lucide-react';

interface RolesViewProps {
  departmentId: string;
  departmentName: string;
  onBack: () => void;
  onRoleClick: (jobId: string, jobTitle: string) => void;
}

export function RolesView({ departmentId, departmentName, onBack, onRoleClick }: RolesViewProps) {
  const { data: jobs = [] } = useJobsQuery();
  const { data: candidates = [] } = useCandidatesQuery();
  const deptJobs = jobs.filter(j => j.departmentCode === departmentId && j.status === 'open');
  const deptCandidates = candidates.filter(c => c.department === departmentId);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div>
        <BackButton onClick={onBack} label="Back to All Departments" />
        <h2 className="text-xl font-semibold tracking-tight mb-1">{departmentName} — Open Roles</h2>
        <p className="text-xs text-muted-foreground">
          {deptJobs.length} open requisitions · {deptCandidates.length} total applicants
        </p>
      </div>

      {/* Roles Grid */}
      {deptJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <Users className="w-8 h-8 mb-2 opacity-30" />
          <p className="text-sm">No open roles for this department</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {deptJobs.map((job) => {


            const getPriorityColor = () => {
              switch(job.priority) {
                case 'urgent': return 'bg-red-500/10 text-red-500 border-red-500/20';
                case 'high': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
                default: return 'bg-foreground/5 text-foreground border-border';
              }
            };

            const getAgingColor = () => {
              if (job.daysOpen > 120) return 'text-red-500';
              if (job.daysOpen > 90) return 'text-amber-500';
              return 'text-muted-foreground';
            };

            return (
              <div
                key={job.id}
                onClick={() => onRoleClick(job.id, job.title)}
                className="p-5 rounded-xl border border-border bg-card hover:bg-muted/20 dark:hover:bg-white/[0.04] transition-all duration-200 text-left group hover:border-border/80 hover:shadow-md cursor-pointer"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold uppercase tracking-wider border ${getPriorityColor()}`}>
                        {job.priority}
                      </span>
                      {job.daysOpen > 90 && (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                      )}
                    </div>
                    <h3 className="text-sm font-semibold leading-tight text-foreground group-hover:text-foreground mb-1">
                      {job.title}
                    </h3>
                    <p className="text-[10px] text-muted-foreground">{job.id}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-foreground">{job.applicants}</div>
                    <div className="text-[10px] text-muted-foreground">applicants</div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Shortlisted</span>
                    <span className="font-semibold">{job.shortlisted}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Interviews</span>
                    <span className="font-semibold">{job.interviewed}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Experience</span>
                    <span className="font-semibold">{job.minExperience}-{job.maxExperience}y</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Referrals</span>
                    <span className="font-semibold">{job.referrals}</span>
                  </div>
                </div>

                {/* Team */}
                <div className="space-y-2 mb-3 pb-3 border-b border-border/50">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-muted-foreground">Hiring Manager</span>
                    <span className="font-medium text-foreground">{job.hiringManager}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-muted-foreground">Recruiter</span>
                    <span className="font-medium text-foreground">{job.recruiterAssigned}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">

  <div className="flex items-center gap-1">
    <Clock className="w-3 h-3" />
    <span className={getAgingColor()}>
      {job.daysOpen}d open
    </span>
  </div>

 <div className="flex items-center gap-3">

  {/* View Details */}

  <button
    title="View Details"
    onClick={(e) => {
      e.stopPropagation();
      setSelectedJob(job);
    }}
    className="relative group/icon p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-all"
  >
    <FileText className="w-4 h-4" />
  </button>

  {/* Copy Application Link */}

  <button
    title="Copy Application Link"
    onClick={(e) => {
      e.stopPropagation();

      navigator.clipboard.writeText(
        `https://careers.guild.com/apply/${job.id}`
      );
    }}
    className="relative group/icon p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-all"
  >
    <Link2 className="w-4 h-4" />
  </button>

  {/* Pipeline */}

  <button
    title="View Pipeline"
    onClick={(e) => {
      e.stopPropagation();
      onRoleClick(job.id, job.title);
    }}
    className="relative group/icon p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-all"
  >
    →
  </button>

</div>

</div>
              </div>
            );
          })}
        </div>
      )}

      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-6">
          <div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl">

            <div className="sticky top-0 bg-card border-b border-border px-8 py-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">{selectedJob.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {selectedJob.department}
                </p>
              </div>

              <button
                onClick={() => setSelectedJob(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                Close
              </button>
            </div>

            <div className="p-8 space-y-8">

              <div>
                <h3 className="font-semibold mb-3">Role Overview</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedJob.roleOverview}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Scope of Work</h3>
                <ul className="space-y-2">
                  {selectedJob.scopeOfWork?.map((item: string, idx: number) => (
                    <li key={idx} className="text-sm text-muted-foreground">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Requirements</h3>
                <ul className="space-y-2">
                  {selectedJob.requirements?.map((item: string, idx: number) => (
                    <li key={idx} className="text-sm text-muted-foreground">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Work Model
                  </p>
                  <p>{selectedJob.workModel}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Compensation
                  </p>
                  <p>{selectedJob.compensationRange}</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
