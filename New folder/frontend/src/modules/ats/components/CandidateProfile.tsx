import { useState } from 'react';
import {
  X,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  FileText,
  ChevronRight,
  ChevronDown,
  Plus,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { BackButton } from '@/shared/components/ui/BackButton';
import type { Candidate, CandidateStatus } from '@/shared/types';

interface CandidateProfileProps {
  candidate: Candidate;
  onClose: () => void;
  onStatusChange: (newStatus: CandidateStatus) => void;
}

export function CandidateProfile({ candidate, onClose, onStatusChange }: CandidateProfileProps) {
  const [activeTab, setActiveTab] =
useState<'overview' | 'records' | 'emails'>('overview');
  const [expandedRecord, setExpandedRecord] =
  useState<string | null>('application');
  const [expandedPTCSection, setExpandedPTCSection] =
  useState<string | null>('background');
  const [customRecords, setCustomRecords] = useState<{
  id: number;
  type: string;
  title: string;
  status: string;
  createdAt: string;
  version: string;
}[]>([]);
  const [recordTypeToAdd, setRecordTypeToAdd] =
  useState('');
  const stageOrder = [
  'Screening',
  'Fitment Evaluation',
  'Technical Interview',
  'PTC Interview',
  "Founders' Interview",
];

const currentStageIndex = stageOrder.indexOf(candidate.status);

const visibleRecords = {
  screening: currentStageIndex >= 0,
  fitment: currentStageIndex >= 1,
  technical: currentStageIndex >= 2,
  ptc: currentStageIndex >= 3,
  founder: currentStageIndex >= 4,
};
  const statusOptions: CandidateStatus[] = [
  'Screening',
  'Fitment Evaluation',
  'Technical Interview',
  'PTC Interview',
  "Founders' Interview",
  'Selected',
  'Rejected',
];

  const RecordBadge = ({
    label,
  }: {
    label: string;
  }) => (
    <span className="px-2 py-0.5 rounded-md text-[10px] font-medium border border-border bg-muted/20 text-muted-foreground">
      {label}
    </span>
  );

  const getStatusColor = (status: CandidateStatus) => {
    switch (status) {
      case 'Selected': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'Rejected': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'Fitment Evaluation': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default: return 'bg-foreground/5 text-foreground border-border';
    }
  };

  const hiringTimeline = [
    { stage: 'Applied', date: candidate.appliedDate, status: 'completed' },
    { stage: 'Screening', date: 'May 2', status: candidate.status === 'Screening' ? 'current' : 'completed' },
    { stage: 'Technical Interview', date: candidate.status === 'Technical Interview' ? 'In Progress' : 'Pending', status: candidate.status === 'Technical Interview' ? 'current' : 'pending' },
    { stage: 'Final Review', date: 'Pending', status: 'pending' },
  ];
const handleAddRecord = (recordType: string) => {

  const existingCount =
    customRecords.filter(
      (r) => r.type === recordType
    ).length;

  const version =
    String.fromCharCode(
      65 + existingCount
    );

  const titles: Record<string, string> = {
    screening: 'Screening',
    fitment: 'Fitment Evaluation',
    technical: 'Technical Interview',
    ptc: 'PTC Evaluation',
    founder: "Founders Interview",
  };

  const newRecord = {
  id: Date.now(),
  type: recordType,
  title: `${titles[recordType]} (${version})`,
  version,
  status: 'Pending',
  createdAt: new Date().toLocaleDateString(),
};

  setCustomRecords((prev) => [
    ...prev,
    newRecord,
  ]);
};
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-5xl h-[90vh] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col">
       
       {/* Header */}
<div className="border-b border-border/50 bg-card flex-shrink-0">
  <div className="px-6 pt-4 pb-3">
    <BackButton onClick={onClose} label="Back to Candidates" />
    <div className="flex items-start justify-between">
      <div>
        <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-muted/60 flex items-center justify-center text-lg font-semibold">
          {candidate.name.split(' ').map(n => n[0]).join('')}
        </div>

        <div>
          <h2 className="text-lg font-semibold">
            {candidate.name}
          </h2>

          <p className="text-xs text-muted-foreground">
            {candidate.id} · Applied {candidate.appliedDate}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-8 mt-4 ml-0">

  <button
    onClick={() => setActiveTab('overview')}
    className={`relative pb-2 text-sm transition-colors ${
      activeTab === 'overview'
        ? 'text-foreground'
        : 'text-muted-foreground'
    }`}
  >
    Overview

    {activeTab === 'overview' && (
      <span className="absolute left-0 right-0 bottom-0 h-[2px] bg-foreground rounded-full" />
    )}
  </button>

  <button
    onClick={() => setActiveTab('records')}
    className={`relative pb-2 text-sm transition-colors ${
      activeTab === 'records'
        ? 'text-foreground'
        : 'text-muted-foreground'
    }`}
  >
    Records

    {activeTab === 'records' && (
      <span className="absolute left-0 right-0 bottom-0 h-[2px] bg-foreground rounded-full" />
    )}
  </button>

  <button
    onClick={() => setActiveTab('emails')}
    className={`relative pb-2 text-sm transition-colors ${
      activeTab === 'emails'
        ? 'text-foreground'
        : 'text-muted-foreground'
    }`}
  >
    Emails

    {activeTab === 'emails' && (
      <span className="absolute left-0 right-0 bottom-0 h-[2px] bg-foreground rounded-full" />
    )}
  </button>

</div>
      </div>

      <button
        onClick={onClose}
        className="p-2 rounded-lg hover:bg-muted/20 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  </div>
</div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
         <div className="p-6">

{activeTab === 'overview' && (
<div className="space-y-6">
            {/* Overview Section */}
            <div className="grid grid-cols-3 gap-4">
              {/* Left Column - Profile Info */}
              <div className="col-span-2 space-y-4">
                {/* Role & Department */}
                <div className="p-4 rounded-xl border border-border bg-card">
                  <h3 className="text-sm font-semibold mb-3">Application Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Role Applied</p>
                        <p className="text-sm font-semibold">{candidate.role}</p>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-medium border ${getStatusColor(candidate.status)}`}>
                        {candidate.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border/50">
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Department</p>
                        <p className="text-sm font-medium">{candidate.department}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Experience</p>
                        <p className="text-sm font-medium">{candidate.experience} years</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="p-4 rounded-xl border border-border bg-card">
                  <h3 className="text-sm font-semibold mb-3">Contact Information</h3>
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-3 text-xs">
                      <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-foreground">{candidate.email || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-foreground">{candidate.phone || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-foreground">{candidate.location}</span>
                    </div>
                  </div>
                </div>

                {/* Professional Background */}
                <div className="p-4 rounded-xl border border-border bg-card">
                  <h3 className="text-sm font-semibold mb-3">Professional Background</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">Current Company</p>
                      </div>
                      <p className="text-sm font-medium">{candidate.currentCompany || 'Not provided'}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <GraduationCap className="w-3.5 h-3.5 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">Education</p>
                      </div>
                      <p className="text-sm font-medium">{candidate.education || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="p-4 rounded-xl border border-border bg-card">
                  <h3 className="text-sm font-semibold mb-3">Technical Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md text-xs font-medium bg-muted/40 text-foreground border border-border/50"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Hiring Timeline */}
                <div className="p-4 rounded-xl border border-border bg-card">
                  <h3 className="text-sm font-semibold mb-4">Hiring Timeline</h3>
                  <div className="space-y-3">
                    {hiringTimeline.map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-2 h-2 rounded-full ${
                            item.status === 'completed' ? 'bg-green-500' :
                            item.status === 'current' ? 'bg-foreground/60' :
                            'bg-muted'
                          }`} />
                          {i < hiringTimeline.length - 1 && (
                            <div className="w-px h-6 bg-border/50 my-0.5" />
                          )}
                        </div>
                        <div className="flex-1 pb-2">
                          <p className="text-xs font-medium text-foreground">{item.stage}</p>
                          <p className="text-[10px] text-muted-foreground">{item.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Actions & Status */}
              <div className="space-y-4">
                {/* Quick Actions */}
                <div className="p-4 rounded-xl border border-border bg-card">
                  <h3 className="text-sm font-semibold mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    <button className="w-full px-3 py-2 text-xs font-medium border border-border
bg-card
hover:bg-muted/20
text-foreground rounded-lg hover:bg-primary/90 transition-all duration-200">
                      Schedule Interview
                    </button>
                    <button className="w-full px-3 py-2 text-xs font-medium border border-border rounded-lg hover:bg-muted/20 transition-all duration-200">
                      Add Note
                    </button>
                    <button className="w-full px-3 py-2 text-xs font-medium border border-border rounded-lg hover:bg-muted/20 transition-all duration-200">
                      View Resume
                    </button>
                  </div>
                </div>

                {/* Status Change */}
                <div className="p-4 rounded-xl border border-border bg-card">
                  <h3 className="text-sm font-semibold mb-3">Change Status</h3>
                 <Select
  value={candidate.status}
  onValueChange={(value) =>
    onStatusChange(value as CandidateStatus)
  }
>
  <SelectTrigger className="w-full bg-muted/20 border-border hover:bg-muted/30 text-xs">
    <SelectValue />
  </SelectTrigger>

  <SelectContent>
    {statusOptions.map((status) => (
      <SelectItem
        key={status}
        value={status}
      >
        {status}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
                </div>

                {/* Key Details */}
                <div className="p-4 rounded-xl border border-border bg-card">
                  <h3 className="text-sm font-semibold mb-3">Key Details</h3>
                  <div className="space-y-3 text-xs">
                    <div>
                      <p className="text-muted-foreground mb-0.5">Referral Source</p>
                      <p className="font-medium">{candidate.referralSource || 'Direct Apply'}</p>
                      {candidate.referralSource && (
  <div className="pt-3 border-t border-border/50">
    <p className="text-muted-foreground mb-0.5">
      Referred By
    </p>

    <p className="font-medium">
      {candidate.referralSource}
    </p>

    <p className="text-[10px] text-muted-foreground mt-1">
      Internal Employee Referral
    </p>
  </div>
)}
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-0.5">Notice Period</p>
                      <p className="font-medium">{candidate.noticePeriod || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-0.5">Expected Comp.</p>
                      <p className="font-medium">{candidate.expectedCompensation || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-0.5">Fitment Score</p>
                      <p className="font-bold text-foreground">{candidate.fitmentScore || 'N/A'}/100</p>
                    </div>
                  </div>
                </div>

                {/* Assigned To */}
                <div className="p-4 rounded-xl border border-border bg-card">
                  <h3 className="text-sm font-semibold mb-3">Assignment</h3>
                  <div className="text-xs">
                    <p className="text-muted-foreground mb-0.5">Recruiter</p>
                    <p className="font-medium">{candidate.recruiterAssigned || 'Unassigned'}</p>
                  </div>
                </div>

                {/* Multiple Roles Badge */}
                {candidate.multipleRoles && candidate.multipleRoles.length > 0 && (
                  <div className="p-4 rounded-xl border border-border bg-muted/20">
                    <h3 className="text-sm font-semibold mb-2">Multi-Role Application</h3>
                    <p className="text-xs text-muted-foreground mb-2">
                      Also applied to {candidate.multipleRoles.length} other role(s)
                    </p>
                    <div className="space-y-1">
                      {candidate.multipleRoles.map((role, i) => (
                        <div key={i} className="text-xs text-foreground flex items-center gap-1">
                          <ChevronRight className="w-3 h-3" />
                          {role}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
)}

{activeTab === 'records' && (
  <div className="space-y-4">

    {/* Header */}
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-sm font-semibold">
          Records
        </h3>

        <p className="text-xs text-muted-foreground mt-1">
          Candidate hiring artifacts and evaluation history
        </p>
      </div>
      <Select
  value={recordTypeToAdd}
  onValueChange={(value) => {
    handleAddRecord(value);
    setRecordTypeToAdd('');
  }}
>
  <SelectTrigger className="w-[180px] h-8 text-xs border border-border bg-card hover:bg-muted/20">
    <div className="flex items-center gap-1.5">
      <Plus className="w-3 h-3" />
      Add Record
    </div>
  </SelectTrigger>

  <SelectContent>
  <SelectItem value="screening">
  Screening
</SelectItem>

<SelectItem value="fitment">
  Fitment Evaluation
</SelectItem>

<SelectItem value="technical">
  Technical Interview
</SelectItem>

<SelectItem value="ptc">
  PTC Evaluation
</SelectItem>

<SelectItem value="founder">
  Founders Interview
</SelectItem>
  </SelectContent>
        </Select>
    </div>

    {/* APPLICATION PACKAGE */}
    <div className="rounded-xl border border-border bg-card overflow-hidden">

      <button
        onClick={() =>
          setExpandedRecord(
            expandedRecord === 'application'
              ? null
              : 'application'
          )
        }
        className="w-full px-4 py-4 flex items-center justify-between hover:bg-muted/10 transition-all"
      >
        <div className="text-left">
          <h4 className="text-sm font-semibold">
            Application Package
          </h4>

          <p className="text-xs text-muted-foreground mt-1">
            Candidate Form • Resume • Job Description
          </p>
        </div>

        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            expandedRecord === 'application'
              ? 'rotate-180'
              : ''
          }`}
        />
      </button>

      {expandedRecord === 'application' && (
        <div className="px-4 pb-4 border-t border-border">

          <div className="pt-4 space-y-3">

            <button className="w-full flex items-center justify-between px-3 py-3 rounded-lg border border-border hover:bg-muted/20">
              <span className="text-xs">
                Candidate Application Form
              </span>
              <FileText className="w-4 h-4" />
            </button>

            <button className="w-full flex items-center justify-between px-3 py-3 rounded-lg border border-border hover:bg-muted/20">
              <span className="text-xs">
                Job Description
              </span>
              <FileText className="w-4 h-4" />
            </button>

          </div>

        </div>
      )}
    </div>
{visibleRecords.screening && (
<div className="rounded-xl border border-border bg-card overflow-hidden">

  <button
    onClick={() =>
      setExpandedRecord(
        expandedRecord === 'screening'
          ? null
          : 'screening'
      )
    }
    className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/10 transition-all"
  >
    <div className="text-left">
      <div className="flex items-center gap-2">
        <h4 className="text-sm font-semibold">
          Screening
        </h4>

        <RecordBadge label="Completed" />
      </div>

      <p className="text-xs text-muted-foreground mt-1">
        Recruiter screening notes
      </p>
    </div>

    <ChevronDown
      className={`w-4 h-4 transition-transform ${
        expandedRecord === 'screening'
          ? 'rotate-180'
          : ''
      }`}
    />
  </button>

  {expandedRecord === 'screening' && (
    <div className="px-4 pb-4 border-t border-border">

      <div className="pt-4 space-y-3">

        <textarea
          rows={6}
          placeholder="Add screening observations..."
          className="w-full rounded-lg border border-border bg-muted/20 p-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-foreground/20"
        />

      </div>

    </div>
  )}
</div>
)}
   
{visibleRecords.fitment && (
<div className="rounded-xl border border-border bg-card overflow-hidden">

  <button
    onClick={() =>
      setExpandedRecord(
        expandedRecord === 'fitment'
          ? null
          : 'fitment'
      )
    }
    className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/10 transition-all"
  >
    <div className="text-left">
      <div className="flex items-center gap-2">
        <h4 className="text-sm font-semibold">
          Fitment Evaluation
        </h4>

        <RecordBadge label="Completed" />
      </div>

      <p className="text-xs text-muted-foreground mt-1">
        Assessment report and recruiter review
      </p>
    </div>

    <ChevronDown
      className={`w-4 h-4 transition-transform ${
        expandedRecord === 'fitment'
          ? 'rotate-180'
          : ''
      }`}
    />
  </button>

  {expandedRecord === 'fitment' && (
    <div className="px-4 pb-4 border-t border-border">

      <div className="pt-4 space-y-4">

        <button className="w-full flex items-center justify-between px-3 py-3 rounded-lg border border-border hover:bg-muted/20">
          <span className="text-xs">
            Open Evaluation PDF
          </span>

          <FileText className="w-4 h-4" />
        </button>

        <div>
          <label className="block text-xs text-muted-foreground mb-2">
            Overall Score
          </label>

          <input
            type="text"
            placeholder="84 / 100"
            className="w-full rounded-lg border border-border bg-muted/20 p-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
          />
        </div>

        <div>
          <label className="block text-xs text-muted-foreground mb-2">
            Comments
          </label>

          <textarea
            rows={5}
            placeholder="Fitment evaluation summary..."
            className="w-full rounded-lg border border-border bg-muted/20 p-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-foreground/20"
          />
        </div>

      </div>

    </div>
  )}
</div>
)}
    
    {customRecords
  .filter((record) => record.type === 'fitment')
  .map((record) => (
    <div
      key={record.id}
      className="ml-6 mt-2 rounded-xl border border-border bg-card overflow-hidden"
    >
      <button
        onClick={() =>
          setExpandedRecord(
            expandedRecord === `custom-${record.id}`
              ? null
              : `custom-${record.id}`
          )
        }
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/10"
      >
        <div className="text-left">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold">
              {record.title}
            </h4>

            <RecordBadge label="Added" />
          </div>

          <p className="text-xs text-muted-foreground mt-1">
            Created {record.createdAt}
          </p>
        </div>

        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            expandedRecord === `custom-${record.id}`
              ? 'rotate-180'
              : ''
          }`}
        />
      </button>

      {expandedRecord === `custom-${record.id}` && (
        <div className="px-4 pb-4 border-t border-border">

          <div className="pt-4 space-y-4">

            <button className="w-full flex items-center justify-between px-3 py-3 rounded-lg border border-border hover:bg-muted/20">
              <span className="text-xs">
                Open Evaluation PDF
              </span>

              <FileText className="w-4 h-4" />
            </button>

            <div>
              <label className="block text-xs text-muted-foreground mb-2">
                Overall Score
              </label>

              <input
                type="text"
                placeholder="84 / 100"
                className="w-full rounded-lg border border-border bg-muted/20 p-3 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-muted-foreground mb-2">
                Comments
              </label>

              <textarea
                rows={5}
                placeholder="Fitment evaluation summary..."
                className="w-full rounded-lg border border-border bg-muted/20 p-3 text-sm resize-none"
              />
            </div>

          </div>

        </div>
      )}

    </div>
  ))}
{visibleRecords.technical && (
<div className="rounded-xl border border-border bg-card overflow-hidden">

  <button
    onClick={() =>
      setExpandedRecord(
        expandedRecord === 'technical'
          ? null
          : 'technical'
      )
    }
    className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/10 transition-all"
  >
    <div className="text-left">
      <div className="flex items-center gap-2">
        <h4 className="text-sm font-semibold">
          Technical Interview
        </h4>

        <RecordBadge label="Pending" />
      </div>

      <p className="text-xs text-muted-foreground/70 mt-1">
        Technical assessment and interviewer feedback
      </p>
    </div>

    <ChevronDown
      className={`w-4 h-4 transition-transform ${
        expandedRecord === 'technical'
          ? 'rotate-180'
          : ''
      }`}
    />
  </button>

  {expandedRecord === 'technical' && (
    <div className="px-4 pb-4 border-t border-border">

      <div className="pt-4 space-y-4">

        <div>
          <label className="block text-xs text-muted-foreground mb-2">
            Technical Competency
          </label>

          <textarea
            rows={4}
            placeholder="Technical strengths and weaknesses..."
            className="w-full rounded-lg border border-border bg-muted/20 p-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-foreground/20"
          />
        </div>

        <div>
          <label className="block text-xs text-muted-foreground mb-2">
            Problem Solving
          </label>

          <textarea
            rows={4}
            placeholder="Problem solving assessment..."
            className="w-full rounded-lg border border-border bg-muted/20 p-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-foreground/20"
          />
        </div>

        <div>
          <label className="block text-xs text-muted-foreground mb-2">
            Communication
          </label>

          <textarea
            rows={4}
            placeholder="Communication and collaboration..."
            className="w-full rounded-lg border border-border bg-muted/20 p-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-foreground/20"
          />
        </div>

        <div>
          <label className="block text-xs text-muted-foreground mb-2">
            Overall Assessment
          </label>

          <textarea
            rows={5}
            placeholder="Overall technical interview recommendation..."
            className="w-full rounded-lg border border-border bg-muted/20 p-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-foreground/20"
          />
        </div>

        <button className="px-4 py-2 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all">
          Save Evaluation
        </button>

      </div>

    </div>
  )}
</div>
)}
    {customRecords
  .filter(
    (record) =>
      record.type === 'technical'
  )
  .map((record) => (
    <div
      key={record.id}
      className="ml-4 rounded-xl border border-border bg-card overflow-hidden"
    >
      <button
        onClick={() =>
          setExpandedRecord(
            expandedRecord === `custom-${record.id}`
              ? null
              : `custom-${record.id}`
          )
        }
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/10"
      >
        <div className="text-left">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold">
              {record.title}
            </h4>

            <RecordBadge label="Added" />
          </div>

          <p className="text-xs text-muted-foreground mt-1">
            Created {record.createdAt}
          </p>
        </div>

        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            expandedRecord === `custom-${record.id}`
              ? 'rotate-180'
              : ''
          }`}
        />
      </button>

      {expandedRecord === `custom-${record.id}` && (
  <div className="px-4 pb-4 border-t border-border">

    <div className="pt-4 space-y-4">

      <div className="grid grid-cols-1 gap-4">

        <div>
          <label className="block text-xs text-muted-foreground mb-2">
            Created
          </label>

          <div className="text-sm">
            {record.createdAt}
          </div>
        </div>

      </div>

      <div>
        <label className="block text-xs text-muted-foreground mb-2">
          Technical Competency
        </label>

        <textarea
          rows={4}
          placeholder="Technical strengths and weaknesses..."
          className="w-full rounded-lg border border-border bg-muted/20 p-3 text-sm resize-none"
        />
      </div>

      <div>
        <label className="block text-xs text-muted-foreground mb-2">
          Problem Solving
        </label>

        <textarea
          rows={4}
          placeholder="Problem solving assessment..."
          className="w-full rounded-lg border border-border bg-muted/20 p-3 text-sm resize-none"
        />
      </div>

      <div>
        <label className="block text-xs text-muted-foreground mb-2">
          Communication
        </label>

        <textarea
          rows={4}
          placeholder="Communication assessment..."
          className="w-full rounded-lg border border-border bg-muted/20 p-3 text-sm resize-none"
        />
      </div>

      <div>
        <label className="block text-xs text-muted-foreground mb-2">
          Overall Assessment
        </label>

        <textarea
          rows={5}
          placeholder="Overall recommendation..."
          className="w-full rounded-lg border border-border bg-muted/20 p-3 text-sm resize-none"
        />
      </div>

      <div className="flex justify-end">
        <button className="px-4 py-2 text-xs font-medium bg-primary text-primary-foreground rounded-lg">
          Save Evaluation
        </button>
      </div>

    </div>

  </div>
)}
    </div>
  ))}
    
{visibleRecords.ptc && (
<div className="rounded-xl border border-border bg-card overflow-hidden">

  <button
    onClick={() =>
      setExpandedRecord(
        expandedRecord === 'ptc'
          ? null
          : 'ptc'
      )
    }
    className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/10 transition-all"
  >
    <div className="text-left">
      <div className="flex items-center gap-2">

        <h4 className="text-sm font-semibold">
          PTC Evaluation
        </h4>

        <RecordBadge label="Pending" />

      </div>

      <p className="text-xs text-muted-foreground/70 mt-1">
        People, culture and organizational assessment
      </p>
    </div>

    <ChevronDown
      className={`w-4 h-4 transition-transform ${
        expandedRecord === 'ptc'
          ? 'rotate-180'
          : ''
      }`}
    />
  </button>

  {expandedRecord === 'ptc' && (
    <div className="px-4 pb-4 border-t border-border">

      <div className="pt-4">

       <button
  onClick={() =>
    setExpandedPTCSection(
      expandedPTCSection === 'background'
        ? null
        : 'background'
    )
  }
  className="w-full rounded-lg border border-border p-4 flex items-center justify-between hover:bg-muted/10 transition-all"
>
  <div className="text-left">
    <h5 className="text-sm font-medium">
      Background
    </h5>

    <p className="text-xs text-muted-foreground mt-1">
      Career motivation and opportunity alignment
    </p>
  </div>

  <ChevronDown
    className={`w-4 h-4 transition-transform ${
      expandedPTCSection === 'background'
        ? 'rotate-180'
        : ''
    }`}
  />
</button>
        {expandedPTCSection === 'background' && (
<div className="mt-4 space-y-6">

  <div>
    <label className="block text-xs text-muted-foreground mb-2">
      Can you briefly walk me through your career so far,
      and what brought you to explore this opportunity?
    </label>

    <textarea
      rows={5}
      className="w-full min-h-[120px] rounded-lg border border-border bg-muted/20 p-3 text-sm resize-y"
    />
  </div>

  <div>
    <label className="block text-xs text-muted-foreground mb-2">
      What drew you to this role and our company?
    </label>

    <textarea
      rows={5}
      className="w-full min-h-[120px] rounded-lg border border-border bg-muted/20 p-3 text-sm resize-y"
    />
  </div>

  <div>
    <label className="block text-xs text-muted-foreground mb-2">
      What are you hoping to find in your next role that you felt was missing in the past?
    </label>

    <textarea
      rows={5}
      className="w-full min-h-[120px] rounded-lg border border-border bg-muted/20 p-3 text-sm resize-y"
    />
  </div>

</div>
)}
        
        <button
  onClick={() =>
    setExpandedPTCSection(
      expandedPTCSection === 'core'
        ? null
        : 'core'
    )
  }
  className="w-full mt-4 rounded-lg border border-border p-4 flex items-center justify-between hover:bg-muted/10 transition-all"
>
  <div className="text-left">
    <h5 className="text-sm font-medium">
      Core Assessment
    </h5>

    <p className="text-xs text-muted-foreground mt-1">
      Motivation, ownership, collaboration and values
    </p>
  </div>

  <ChevronDown
    className={`w-4 h-4 transition-transform ${
      expandedPTCSection === 'core'
        ? 'rotate-180'
        : ''
    }`}
  />
</button>
        {expandedPTCSection === 'core' && (
<div className="mt-4 space-y-6">

  <div>
    <label className="block text-xs text-muted-foreground mb-2">
      How do you keep yourself motivated, especially when you're not being directly supervised?
    </label>

    <textarea
      rows={5}
      className="w-full min-h-[120px] rounded-lg border border-border bg-muted/20 p-3 text-sm resize-y"
    />
  </div>

  <div>
    <label className="block text-xs text-muted-foreground mb-2">
      Can you describe a time you took full ownership of a project and saw it through despite roadblocks?
    </label>

    <textarea
      rows={5}
      className="w-full min-h-[120px] rounded-lg border border-border bg-muted/20 p-3 text-sm resize-y"
    />
  </div>

  <div>
    <label className="block text-xs text-muted-foreground mb-2">
      How do you handle high-pressure environments or fast turnarounds?
    </label>

    <textarea
      rows={5}
      className="w-full min-h-[120px] rounded-lg border border-border bg-muted/20 p-3 text-sm resize-y"
    />
  </div>
<div>
  <label className="block text-xs text-muted-foreground mb-2">
    How do you define being a team player? Can you give an example?
  </label>

  <textarea
    rows={5}
    className="w-full min-h-[120px] rounded-lg border border-border bg-muted/20 p-3 text-sm resize-y"
  />
</div>

<div>
  <label className="block text-xs text-muted-foreground mb-2">
    How do you usually function in team settings? Can you share an example of navigating competition or conflict?
  </label>

  <textarea
    rows={5}
    className="w-full min-h-[120px] rounded-lg border border-border bg-muted/20 p-3 text-sm resize-y"
  />
</div>

<div>
  <label className="block text-xs text-muted-foreground mb-2">
    How do you balance collaboration and ambition?
  </label>

  <textarea
    rows={5}
    className="w-full min-h-[120px] rounded-lg border border-border bg-muted/20 p-3 text-sm resize-y"
  />
</div>

<div>
  <label className="block text-xs text-muted-foreground mb-2">
    What do you think could be a challenge that others face when working with you?
  </label>

  <textarea
    rows={5}
    className="w-full min-h-[120px] rounded-lg border border-border bg-muted/20 p-3 text-sm resize-y"
  />
</div>

<div>
  <label className="block text-xs text-muted-foreground mb-2">
    What does inclusivity mean to you, and how have you contributed to fostering it?
  </label>

  <textarea
    rows={5}
    className="w-full min-h-[120px] rounded-lg border border-border bg-muted/20 p-3 text-sm resize-y"
  />
</div>

<div>
  <label className="block text-xs text-muted-foreground mb-2">
    What personal or professional values are non-negotiable for you?
  </label>

  <textarea
    rows={5}
    className="w-full min-h-[120px] rounded-lg border border-border bg-muted/20 p-3 text-sm resize-y"
  />
</div>

<div>
  <label className="block text-xs text-muted-foreground mb-2">
    Can you share a moment where you had to make a difficult decision that tested your values?
  </label>

  <textarea
    rows={5}
    className="w-full min-h-[120px] rounded-lg border border-border bg-muted/20 p-3 text-sm resize-y"
  />
</div>

<div>
  <label className="block text-xs text-muted-foreground mb-2">
    Who are you outside of your CV?
  </label>

  <textarea
    rows={5}
    className="w-full min-h-[120px] rounded-lg border border-border bg-muted/20 p-3 text-sm resize-y"
  />
</div>

<div>
  <label className="block text-xs text-muted-foreground mb-2">
    What's something you've learned recently that changed the way you see the world or your work?
  </label>

  <textarea
    rows={5}
    className="w-full min-h-[120px] rounded-lg border border-border bg-muted/20 p-3 text-sm resize-y"
  />
</div>

<div>
  <label className="block text-xs text-muted-foreground mb-2">
    We operate on a six-day work week. How do you feel about that?
  </label>

  <textarea
    rows={5}
    className="w-full min-h-[120px] rounded-lg border border-border bg-muted/20 p-3 text-sm resize-y"
  />
</div>
</div>
)}
        <button
  onClick={() =>
    setExpandedPTCSection(
      expandedPTCSection === 'compensation'
        ? null
        : 'compensation'
    )
  }
  className="w-full mt-4 rounded-lg border border-border p-4 flex items-center justify-between hover:bg-muted/10 transition-all"
>
  <div className="text-left">
    <h5 className="text-sm font-medium">
      Compensation & Logistics
    </h5>

    <p className="text-xs text-muted-foreground mt-1">
      Compensation expectations and logistics
    </p>
  </div>

  <ChevronDown
    className={`w-4 h-4 transition-transform ${
      expandedPTCSection === 'compensation'
        ? 'rotate-180'
        : ''
    }`}
  />
</button>
        {expandedPTCSection === 'compensation' && (
<div className="mt-4 space-y-6">

  <div>
    <label className="block text-xs leading-relaxed text-muted-foreground mb-2">
      Current Compensation
    </label>

    <textarea
      rows={4}
      className="w-full min-h-[100px] rounded-lg border border-border bg-muted/20 p-3 text-sm resize-y"
    />
  </div>

  <div>
    <label className="block text-xs leading-relaxed text-muted-foreground mb-2">
      Expected Compensation
    </label>

    <textarea
      rows={4}
      className="w-full min-h-[100px] rounded-lg border border-border bg-muted/20 p-3 text-sm resize-y"
    />
  </div>

  <div>
    <label className="block text-xs leading-relaxed text-muted-foreground mb-2">
      Notice Period
    </label>

    <textarea
      rows={4}
      className="w-full min-h-[100px] rounded-lg border border-border bg-muted/20 p-3 text-sm resize-y"
    />
  </div>

  <div>
    <label className="block text-xs leading-relaxed text-muted-foreground mb-2">
      Office Location / Commute Comfort
    </label>

    <textarea
      rows={4}
      className="w-full min-h-[100px] rounded-lg border border-border bg-muted/20 p-3 text-sm resize-y"
    />
  </div>

</div>
)}
        <button
  onClick={() =>
    setExpandedPTCSection(
      expandedPTCSection === 'notes'
        ? null
        : 'notes'
    )
  }
  className="w-full mt-4 rounded-lg border border-border p-4 flex items-center justify-between hover:bg-muted/10 transition-all"
>
  <div className="text-left">
    <h5 className="text-sm font-medium">
      Additional Notes
    </h5>

    <p className="text-xs text-muted-foreground mt-1">
      Final recommendation and observations
    </p>
  </div>

  <ChevronDown
    className={`w-4 h-4 transition-transform ${
      expandedPTCSection === 'notes'
        ? 'rotate-180'
        : ''
    }`}
  />
</button>

{expandedPTCSection === 'notes' && (
<div className="mt-4 space-y-6">

  <div>
    <label className="block text-xs leading-relaxed text-muted-foreground mb-2">
      General Interview Notes
    </label>

    <textarea
      rows={5}
      className="w-full min-h-[120px] rounded-lg border border-border bg-muted/20 p-3 text-sm resize-y"
    />
  </div>

  <div>
    <label className="block text-xs leading-relaxed text-muted-foreground mb-2">
      PTC Recommendation
    </label>

    <textarea
      rows={5}
      className="w-full min-h-[120px] rounded-lg border border-border bg-muted/20 p-3 text-sm resize-y"
    />
  </div>

  <div>
    <label className="block text-xs leading-relaxed text-muted-foreground mb-2">
      Final Comments
    </label>

    <textarea
      rows={5}
      className="w-full min-h-[120px] rounded-lg border border-border bg-muted/20 p-3 text-sm resize-y"
    />
  </div>

</div>
)}
        <div className="flex justify-end pt-6 border-t border-border mt-6">
  <button className="px-4 py-2 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all">
    Save PTC Evaluation
  </button>
</div>

      </div>

    </div>
  )}
</div>
)}
    {customRecords
  .filter((record) => record.type === 'ptc')
  .map((record) => (
    <div
      key={record.id}
      className="ml-6 mt-3 rounded-xl border border-border bg-card overflow-hidden"
    >
      <button
        onClick={() =>
          setExpandedRecord(
            expandedRecord === `custom-${record.id}`
              ? null
              : `custom-${record.id}`
          )
        }
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/10"
      >
        <div className="text-left">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold">
              {record.title}
            </h4>

            <RecordBadge label="Added" />
          </div>

          <p className="text-xs text-muted-foreground mt-1">
            Created {record.createdAt}
          </p>
        </div>

        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            expandedRecord === `custom-${record.id}`
              ? 'rotate-180'
              : ''
          }`}
        />
      </button>

      {expandedRecord === `custom-${record.id}` && (
        <div className="px-4 pb-4 border-t border-border">
          <div className="pt-4 space-y-4">

            <button className="w-full rounded-lg border border-border p-4 flex items-center justify-between">
              <div className="text-left">
                <h5 className="text-sm font-medium">
                  Background
                </h5>

                <p className="text-xs text-muted-foreground mt-1">
                  Career motivation and opportunity alignment
                </p>
              </div>
            </button>

            <button className="w-full rounded-lg border border-border p-4 flex items-center justify-between">
              <div className="text-left">
                <h5 className="text-sm font-medium">
                  Core Assessment
                </h5>

                <p className="text-xs text-muted-foreground mt-1">
                  Motivation, ownership, collaboration and values
                </p>
              </div>
            </button>

            <button className="w-full rounded-lg border border-border p-4 flex items-center justify-between">
              <div className="text-left">
                <h5 className="text-sm font-medium">
                  Compensation & Logistics
                </h5>

                <p className="text-xs text-muted-foreground mt-1">
                  Compensation expectations and logistics
                </p>
              </div>
            </button>

            <button className="w-full rounded-lg border border-border p-4 flex items-center justify-between">
              <div className="text-left">
                <h5 className="text-sm font-medium">
                  Additional Notes
                </h5>

                <p className="text-xs text-muted-foreground mt-1">
                  Final recommendation and observations
                </p>
              </div>
            </button>

            <div className="flex justify-end pt-4 border-t border-border">
              <button className="px-4 py-2 text-xs font-medium bg-primary text-primary-foreground rounded-lg">
                Save PTC Evaluation
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  ))}
    {visibleRecords.founder && (
<div className="rounded-xl border border-border bg-card overflow-hidden">

  <button
    onClick={() =>
      setExpandedRecord(
        expandedRecord === 'founder'
          ? null
          : 'founder'
      )
    }
    className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/10 transition-all"
  >
    <div className="text-left">
      <div className="flex items-center gap-2">

        <h4 className="text-sm font-semibold">
          Founders' Interview
        </h4>

        <RecordBadge label="Pending" />

      </div>

      <p className="text-xs text-muted-foreground/70 mt-1">
        Founder assessment and hiring recommendation
      </p>
    </div>

    <ChevronDown
      className={`w-4 h-4 transition-transform ${
        expandedRecord === 'founder'
          ? 'rotate-180'
          : ''
      }`}
    />
  </button>

  {expandedRecord === 'founder' && (
    <div className="px-4 pb-4 border-t border-border">

      <div className="pt-4 space-y-6">

        <div>
          <label className="block text-xs leading-relaxed text-muted-foreground mb-2">
            Founder Assessment Notes
          </label>

          <textarea
            rows={10}
            placeholder="Document founder observations, concerns, hiring rationale and final recommendation..."
            className="w-full min-h-[220px] rounded-lg border border-border bg-muted/20 p-4 text-sm resize-y"
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-border">
          <button className="px-4 py-2 text-xs font-medium border border-border rounded-lg hover:bg-muted/20 transition-all">
            Save Founder Assessment
          </button>
        </div>

      </div>

    </div>
  )}
  {customRecords
  .filter((record) => record.type === 'founder')
  .map((record) => (
    <div
      key={record.id}
      className="ml-4 rounded-xl border border-border bg-card overflow-hidden"
    >
      <button className="w-full px-4 py-3 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold">
            {record.title}
          </h4>

          <p className="text-xs text-muted-foreground">
            Created {record.createdAt}
          </p>
        </div>
      </button>
    </div>
  ))}

    </div>
  )}
</div>
)}
           {activeTab === 'emails' && (
  <div className="space-y-4">

    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-sm font-semibold">
          Email Communication
        </h3>

        <p className="text-xs text-muted-foreground mt-1">
          8 messages • Last activity 2 days ago
        </p>
      </div>

      <button className="px-3 py-2 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all">
        <Mail className="w-3 h-3 inline mr-2" />
        Send Email
      </button>
    </div>

    <div className="rounded-xl border border-border bg-card p-4">
      <input
        type="text"
        placeholder="Search emails..."
        className="w-full rounded-lg border border-border bg-muted/20 p-3 text-sm"
      />
    </div>

    <div className="space-y-3">

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex justify-between mb-2">
          <h4 className="text-sm font-semibold">
            Application Received
          </h4>

          <span className="text-xs text-muted-foreground">
            Apr 14 • Sent
          </span>
        </div>

        <p className="text-xs text-muted-foreground mb-3">
          recruitment@theguild.ai → {candidate.email}
        </p>

        <p className="text-sm">
          Thank you for applying. We have successfully received your application.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-muted/20 p-4">
        <div className="flex justify-between mb-2">
          <h4 className="text-sm font-semibold">
            Candidate Reply
          </h4>

          <span className="text-xs text-muted-foreground">
            Apr 14 • Received
          </span>
        </div>

        <p className="text-xs text-muted-foreground mb-3">
          {candidate.email} → recruitment@theguild.ai
        </p>

        <p className="text-sm">
          Thank you. Please let me know if any additional documents are required.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex justify-between mb-2">
          <h4 className="text-sm font-semibold">
            Screening Interview Scheduled
          </h4>

          <span className="text-xs text-muted-foreground">
            Apr 17 • Sent
          </span>
        </div>

        <p className="text-sm">
          Your screening interview has been scheduled for April 20 at 11:00 AM.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-muted/20 p-4">
        <div className="flex justify-between mb-2">
          <h4 className="text-sm font-semibold">
            Interview Confirmation
          </h4>

          <span className="text-xs text-muted-foreground">
            Apr 17 • Received
          </span>
        </div>

        <p className="text-sm">
          Confirmed. Looking forward to speaking with the team.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex justify-between mb-2">
          <h4 className="text-sm font-semibold">
            Technical Interview Invitation
          </h4>

          <span className="text-xs text-muted-foreground">
            Apr 23 • Sent
          </span>
        </div>

        <p className="text-sm">
          Congratulations. You have progressed to the Technical Interview stage.
        </p>

        <div className="mt-3 flex gap-2">
          <span className="px-2 py-1 text-xs rounded border border-border">
            📎 Technical_Assessment.pdf
          </span>

          <span className="px-2 py-1 text-xs rounded border border-border">
            📎 Interview_Guide.pdf
          </span>
        </div>
      </div>

    </div>

  </div>
)}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     

        </div>
      </div>
    </div>
    </div>
  );
}