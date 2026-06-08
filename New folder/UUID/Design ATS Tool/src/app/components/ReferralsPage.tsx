import { useState } from 'react';
import { mockCandidates } from '../../Data/Candidates';
import { Users, TrendingUp, CheckCircle2, Clock, Award, Mail, Send, UserPlus } from 'lucide-react';
import { ReferralForm } from './ReferralForm';
import { ReferralConfirmation } from './ReferralConfirmation';

type ViewState = 'list' | 'form' | 'success' | 'duplicate';

export function ReferralsPage() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'interviewed' | 'hired'>('all');
  const [viewState, setViewState] = useState<ViewState>('list');

  // Get referred candidates
  const referredCandidates = mockCandidates.filter(c => c.referralSource === 'Employee Referral');

  const pendingReferrals = referredCandidates.filter(c =>
    ['Screening', 'Fitment Evaluation'].includes(c.status)
  );
  const interviewedReferrals = referredCandidates.filter(c =>
    ['Technical Interview', 'PTC Interview', 'Founders Interview'].includes(c.status)
  );
  const hiredReferrals = referredCandidates.filter(c => c.status === 'Selected');

  const filteredReferrals =
    filter === 'pending' ? pendingReferrals :
    filter === 'interviewed' ? interviewedReferrals :
    filter === 'hired' ? hiredReferrals :
    referredCandidates;

  // Mock referral data
  const referralStats = {
    totalReferrals: referredCandidates.length,
    pending: pendingReferrals.length,
    interviewed: interviewedReferrals.length,
    hired: hiredReferrals.length,
    conversionRate: ((hiredReferrals.length / referredCandidates.length) * 100).toFixed(1),
  };

  const topReferrers = [
    { name: 'Sarah Mitchell', department: 'AER', referrals: 4, hired: 2, pending: 1 },
    { name: 'Dr. James Chen', department: 'CFD', referrals: 3, hired: 1, pending: 2 },
    { name: 'Linda Torres', department: 'AVI', referrals: 3, hired: 1, pending: 1 },
    { name: 'Dr. Vikram Patel', department: 'TCA', referrals: 2, hired: 1, pending: 0 },
    { name: 'Robert Kim', department: 'MME', referrals: 2, hired: 1, pending: 1 },
  ];

  const handleSubmitReferral = (duplicate: boolean) => {
    if (duplicate) {
      setViewState('duplicate');
    } else {
      setViewState('success');
    }
  };

  const handleReturnToDashboard = () => {
    setViewState('list');
  };

  // Show confirmation screens
  if (viewState === 'success' || viewState === 'duplicate') {
    return (
      <ReferralConfirmation
        type={viewState === 'success' ? 'success' : 'duplicate'}
        onReturn={handleReturnToDashboard}
      />
    );
  }

  // Show referral form
  if (viewState === 'form') {
    return (
      <ReferralForm
        onClose={handleReturnToDashboard}
        onSubmit={handleSubmitReferral}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight mb-1">Employee Referrals</h2>
          <p className="text-xs text-muted-foreground">
            {referralStats.totalReferrals} total referrals · {referralStats.conversionRate}% conversion rate
          </p>
        </div>
        <button
          onClick={() => setViewState('form')}
          className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 flex items-center gap-2 shadow-sm"
        >
          <UserPlus className="w-3.5 h-3.5" />
          Submit Referral
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card hover:bg-muted/20 transition-colors cursor-pointer">
          <div className="flex items-center justify-between mb-3">
            <Users className="w-4 h-4 text-muted-foreground" />
            <TrendingUp className="w-3 h-3 text-green-500" />
          </div>
          <div className="text-2xl font-bold mb-0.5">{referralStats.totalReferrals}</div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Total Referrals</div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card hover:bg-muted/20 transition-colors cursor-pointer">
          <div className="flex items-center justify-between mb-3">
            <Clock className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold mb-0.5">{referralStats.pending}</div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Pending Review</div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card hover:bg-muted/20 transition-colors cursor-pointer">
          <div className="flex items-center justify-between mb-3">
            <Users className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold mb-0.5">{referralStats.interviewed}</div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wide">In Interviews</div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card hover:bg-muted/20 transition-colors cursor-pointer">
          <div className="flex items-center justify-between mb-3">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold mb-0.5">{referralStats.hired}</div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Successfully Hired</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-4">
        {/* Referred Candidates */}
        <div className="col-span-2 space-y-4">
          {/* Filter Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                filter === 'all'
                  ? 'bg-foreground/15 text-foreground shadow-sm'
                  : 'hover:bg-foreground/[0.07] text-muted-foreground hover:text-foreground'
              }`}
            >
              All · {referralStats.totalReferrals}
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                filter === 'pending'
                  ? 'bg-foreground/15 text-foreground shadow-sm'
                  : 'hover:bg-foreground/[0.07] text-muted-foreground hover:text-foreground'
              }`}
            >
              Pending · {referralStats.pending}
            </button>
            <button
              onClick={() => setFilter('interviewed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                filter === 'interviewed'
                  ? 'bg-foreground/15 text-foreground shadow-sm'
                  : 'hover:bg-foreground/[0.07] text-muted-foreground hover:text-foreground'
              }`}
            >
              Interviewed · {referralStats.interviewed}
            </button>
            <button
              onClick={() => setFilter('hired')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                filter === 'hired'
                  ? 'bg-foreground/15 text-foreground shadow-sm'
                  : 'hover:bg-foreground/[0.07] text-muted-foreground hover:text-foreground'
              }`}
            >
              Hired · {referralStats.hired}
            </button>
          </div>

          {/* Candidates List */}
          <div className="space-y-3">
            {filteredReferrals.map((candidate) => (
              <div
                key={candidate.id}
                className="p-4 rounded-xl border border-border bg-card hover:bg-muted/20 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">{candidate.name}</h4>
                    <p className="text-xs text-muted-foreground">{candidate.role} · {candidate.department}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-medium border ${
                    candidate.status === 'Selected' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                    candidate.status === 'Rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                    ['Technical Interview', 'PTC Interview', 'Founders Interview'].includes(candidate.status)
                      ? 'bg-foreground/5 text-foreground border-border'
                      : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                  }`}>
                    {candidate.status}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <p className="text-muted-foreground mb-0.5">Experience</p>
                    <p className="font-medium">{candidate.experience} years</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-0.5">Location</p>
                    <p className="font-medium">{candidate.location}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-0.5">Applied</p>
                    <p className="font-medium">{candidate.appliedDate}</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-border/50 text-[10px] text-muted-foreground">
                  Referred by employee · {candidate.recruiterAssigned}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Referrers */}
        <div className="space-y-4">
          <div className="p-5 rounded-xl border border-border bg-card">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-muted-foreground" />
              Top Referrers
            </h3>
            <div className="space-y-3">
              {topReferrers.map((referrer, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg border border-border/50 bg-muted/20"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-xs font-medium text-foreground">{referrer.name}</p>
                      <p className="text-[10px] text-muted-foreground">{referrer.department}</p>
                    </div>
                    <span className="text-[10px] font-bold text-foreground">#{i + 1}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[10px]">
                    <div>
                      <p className="text-muted-foreground">Total</p>
                      <p className="font-semibold text-foreground">{referrer.referrals}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Hired</p>
                      <p className="font-semibold text-green-500">{referrer.hired}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Pending</p>
                      <p className="font-semibold text-amber-500">{referrer.pending}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-xl border border-border bg-card">
            <h3 className="text-sm font-semibold mb-4">Referral Program</h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-muted/20">
                <p className="font-medium text-foreground mb-1">Bonus Structure</p>
                <p className="text-[10px] text-muted-foreground">
                  ₹50K for successful hire<br />
                  ₹25K after 6 months retention
                </p>
              </div>
              <button className="w-full px-3 py-2 text-xs font-medium border border-border rounded-lg hover:bg-muted/20 transition-all duration-200 flex items-center justify-center gap-2">
                <Send className="w-3 h-3" />
                Share Program Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
