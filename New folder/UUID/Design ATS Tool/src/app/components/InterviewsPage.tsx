import { useState } from 'react';
import { mockInterviews } from '../../Data/Interviews';
import { mockCandidates } from '../../Data/Candidates';
import {
  Calendar,
  Clock,
  Video,
  Users,
  FileText,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Filter,
  ChevronDown
} from 'lucide-react';

type InterviewFilter = 'all' | 'scheduled' | 'pending_feedback' | 'completed';

export function InterviewsPage() {
  const [filter, setFilter] = useState<InterviewFilter>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredInterviews = mockInterviews.filter(interview => {
    if (filter !== 'all' && interview.status !== filter) return false;
    if (selectedType !== 'all' && interview.type !== selectedType) return false;
    return true;
  });

  const upcomingInterviews = filteredInterviews.filter(i => i.status === 'scheduled');
  const pendingFeedback = filteredInterviews.filter(i => i.status === 'pending_feedback');
  const completedInterviews = filteredInterviews.filter(i => i.status === 'completed');

  // Statistics
  const totalScheduled = mockInterviews.filter(i => i.status === 'scheduled').length;
  const totalPending = mockInterviews.filter(i => i.status === 'pending_feedback').length;
  const totalCompleted = mockInterviews.filter(i => i.status === 'completed').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight mb-1">Interviews</h2>
          <p className="text-xs text-muted-foreground">
            {totalScheduled} scheduled · {totalPending} pending feedback · {totalCompleted} completed
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-1.5 text-xs bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-foreground/20"
          >
            <option value="all">All Types</option>
            <option value="screening">Screening</option>
            <option value="fitment">Fitment</option>
            <option value="technical">Technical</option>
            <option value="ptc">PTC</option>
            <option value="founders">Founders</option>
          </select>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
            filter === 'all'
              ? 'bg-foreground/15 text-foreground shadow-sm'
              : 'hover:bg-foreground/[0.07] text-muted-foreground hover:text-foreground'
          }`}
        >
          All · {mockInterviews.length}
        </button>
        <button
          onClick={() => setFilter('scheduled')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
            filter === 'scheduled'
              ? 'bg-foreground/15 text-foreground shadow-sm'
              : 'hover:bg-foreground/[0.07] text-muted-foreground hover:text-foreground'
          }`}
        >
          Scheduled · {totalScheduled}
        </button>
        <button
          onClick={() => setFilter('pending_feedback')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
            filter === 'pending_feedback'
              ? 'bg-foreground/15 text-foreground shadow-sm'
              : 'hover:bg-foreground/[0.07] text-muted-foreground hover:text-foreground'
          }`}
        >
          Pending Feedback · {totalPending}
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
            filter === 'completed'
              ? 'bg-foreground/15 text-foreground shadow-sm'
              : 'hover:bg-foreground/[0.07] text-muted-foreground hover:text-foreground'
          }`}
        >
          Completed · {totalCompleted}
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-4">
        {filter === 'all' || filter === 'scheduled' ? (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Upcoming Interviews ({upcomingInterviews.length})
            </h3>
            {upcomingInterviews.length === 0 ? (
              <div className="p-8 rounded-xl border border-border bg-card flex flex-col items-center justify-center text-muted-foreground">
                <Calendar className="w-8 h-8 mb-2 opacity-30" />
                <p className="text-sm">No upcoming interviews</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {upcomingInterviews.map((interview) => (
                  <InterviewCard key={interview.id} interview={interview} />
                ))}
              </div>
            )}
          </div>
        ) : null}

        {filter === 'all' || filter === 'pending_feedback' ? (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              Pending Feedback ({pendingFeedback.length})
            </h3>
            {pendingFeedback.length === 0 ? (
              <div className="p-8 rounded-xl border border-border bg-card flex flex-col items-center justify-center text-muted-foreground">
                <CheckCircle2 className="w-8 h-8 mb-2 opacity-30" />
                <p className="text-sm">All interviews have feedback</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {pendingFeedback.map((interview) => (
                  <InterviewCard key={interview.id} interview={interview} />
                ))}
              </div>
            )}
          </div>
        ) : null}

        {filter === 'all' || filter === 'completed' ? (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Completed Interviews ({completedInterviews.length})
            </h3>
            {completedInterviews.length === 0 ? (
              <div className="p-8 rounded-xl border border-border bg-card flex flex-col items-center justify-center text-muted-foreground">
                <FileText className="w-8 h-8 mb-2 opacity-30" />
                <p className="text-sm">No completed interviews</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {completedInterviews.map((interview) => (
                  <InterviewCard key={interview.id} interview={interview} />
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function InterviewCard({ interview }: { interview: typeof mockInterviews[0] }) {
  const formatDate = (date: string) => {
    const d = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getStatusBadge = () => {
    switch (interview.status) {
      case 'scheduled':
        return (
          <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-foreground/5 text-foreground font-medium border border-border/50">
            <Clock className="w-3 h-3" />
            Scheduled
          </span>
        );
      case 'pending_feedback':
        return (
          <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 font-medium border border-amber-500/20">
            <AlertCircle className="w-3 h-3" />
            Pending Feedback
          </span>
        );
      case 'completed':
        return (
          <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-green-500/10 text-green-500 font-medium border border-green-500/20">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </span>
        );
      default:
        return null;
    }
  };

  const getTypeBadge = () => {
    return (
      <span className="text-[10px] px-2 py-0.5 rounded-md font-medium bg-muted/40 text-muted-foreground border border-border/50">
        {interview.type.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="p-4 rounded-xl border border-border bg-card hover:bg-muted/20 transition-colors cursor-pointer">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-foreground mb-1">{interview.candidateName}</h4>
          <p className="text-xs text-muted-foreground">{interview.jobTitle}</p>
        </div>
        {getStatusBadge()}
      </div>

      {/* Details */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-xs">
          <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wider bg-muted/50 text-muted-foreground">
            {interview.departmentCode}
          </span>
          {getTypeBadge()}
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(interview.scheduledDate)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{interview.scheduledTime}</span>
          </div>
        </div>

        {interview.location === 'Virtual' && interview.meetingLink && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Video className="w-3.5 h-3.5" />
            <span>Virtual Meeting</span>
          </div>
        )}
      </div>

      {/* Interviewers */}
      <div className="pt-3 border-t border-border/50">
        <div className="flex items-center gap-2 text-xs">
          <Users className="w-3.5 h-3.5 text-muted-foreground" />
          <div className="flex-1 text-muted-foreground">
            <span className="font-medium text-foreground">{interview.interviewer[0]}</span>
            {interview.interviewer.length > 1 && (
              <span> +{interview.interviewer.length - 1} more</span>
            )}
          </div>
        </div>
        <div className="mt-2 text-[10px] text-muted-foreground">
          Coordinator: {interview.recruiterCoordinator}
        </div>
      </div>

      {/* Notes */}
      {interview.notes && (
        <div className="mt-3 pt-3 border-t border-border/50">
          <p className="text-xs text-muted-foreground italic">{interview.notes}</p>
        </div>
      )}
    </div>
  );
}
