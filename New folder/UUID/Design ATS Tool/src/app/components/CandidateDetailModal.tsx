import { useState } from 'react';
import { X, MapPin, Calendar, Mail, Phone, Briefcase, Clock, Building2, Award, FileText, MessageSquare, CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react';
import { BackButton } from './ui/BackButton';
import type { Candidate, CandidateStatus } from '../App';

interface Props {
  candidate: Candidate | null;
  onClose: () => void;
  onStatusChange: (candidateId: string, newStatus: CandidateStatus) => void;
}

const statuses: CandidateStatus[] = [
  'Screening',
  'Fitment Evaluation',
  'Technical Interview',
  'PTC Interview',
  "Founders' Interview",
  'Selected',
  'Rejected',
];

const statusIndex = (s: CandidateStatus) => statuses.indexOf(s);

function getCertifications(dept: string): string[] {
  const map: Record<string, string[]> = {
    AER: ['AIAA Member', 'CFD Certified Analyst'],
    AVI: ['DO-178C Practitioner', 'DO-254 Certified'],
    BDL: ['CFA Level I', 'Certified Business Developer'],
    CFD: ['ANSYS Certified Engineer', 'OpenFOAM Certified'],
    EXO: ['Executive Leadership Certificate', 'Board Governance Diploma'],
    FIN: ['ACCA', 'CFA Level II'],
    FDR: ['Board Member Certification', 'Corporate Governance Certificate'],
    FOO: ['PMP', 'Executive Coach Certificate'],
    HNS: ['Certified Security Manager', 'ISO 28000 Lead Implementer'],
    LEG: ['Bar Council Membership', 'GDPR Practitioner'],
    MME: ['ASM International Member', 'NDT Level II'],
    NGC: ['AIAA GNC Member', 'Kalman Filter Practitioner'],
    NIT: ['CISSP', 'AWS Solutions Architect'],
    OPS: ['Lean Six Sigma Green Belt', 'ISO 9001 Lead Auditor'],
    PTC: ['SHRM-CP', 'CIPD Level 5'],
    PRC: ['Lean Six Sigma Black Belt', 'IChemE Member'],
    PNC: ['CIPS Professional', 'SAP MM Certified'],
    PRJ: ['PMP', 'PRINCE2 Practitioner'],
    PRI: ['RICS Membership', 'APM PMQ'],
    TCA: ['AIAA Propulsion Member', 'NASA CE Certified'],
    TBM: ['ASME Member', 'Turbomachinery Institute Certificate'],
    STR: ['AIAA SDM Member', 'Altair HyperWorks Certified'],
    SYS: ['INCOSE CSEP', 'SysML Certified Modeller'],
    SRQ: ['ASQ CQE', 'AS9100 Lead Auditor'],
    AIT: ['Avionics Integration Certificate', 'ESD Association Member'],
    ADM: ['Office Management Certificate', 'PRINCE2 Foundation'],
  };
  return map[dept] || ['Professional Development Certificate'];
}

function getRecruiterNotes(candidate: Candidate): string {
  const openings = [
    `${candidate.name} demonstrated strong domain knowledge throughout initial screening. Communication skills are above average for ${candidate.role} level.`,
    `Candidate shows ${candidate.experience} years of solid hands-on experience. References are pending verification. Recommended to advance.`,
    `Initial resume review is positive. ${candidate.department} hiring manager flagged this as a high-priority pipeline candidate.`,
    `Background aligns well with current ${candidate.department} team requirements. Salary expectations are within approved band.`,
    `Strong academic credentials combined with ${candidate.experience} years of industry experience. Availability confirmed for next interview slot.`,
  ];
  const idx = parseInt(candidate.id.replace('TG-', '')) % openings.length;
  return openings[idx];
}

function getHiringRecommendation(candidate: Candidate): { label: string; color: string } {
  const idx = statusIndex(candidate.status);
  if (candidate.status === 'Selected') return { label: 'Hire Recommended', color: 'text-emerald-600 dark:text-emerald-400' };
  if (candidate.status === 'Rejected') return { label: 'Not Recommended', color: 'text-red-500' };
  if (idx >= 4) return { label: 'Strong Candidate', color: 'text-foreground' };
  if (idx >= 2) return { label: 'Progressing', color: 'text-muted-foreground' };
  return { label: 'Under Evaluation', color: 'text-muted-foreground' };
}

function getAvailability(exp: number): string {
  if (exp > 10) return 'Available in 90 days (notice period)';
  if (exp > 5) return 'Available in 60 days';
  return 'Available in 30 days';
}

export function CandidateDetailModal({ candidate, onClose, onStatusChange }: Props) {
  if (!candidate) return null;
  
  const [activeTab, setActiveTab] =
  useState<'overview' | 'records'>('overview');
  const currentIdx = statusIndex(candidate.status);
  const certs = getCertifications(candidate.department);
  const notes = getRecruiterNotes(candidate);
  const recommendation = getHiringRecommendation(candidate);
  const availability = getAvailability(candidate.experience);
  const isMultiRole = candidate.multipleRoles && candidate.multipleRoles.length > 1;
  const emailLocal = candidate.name.toLowerCase().replace(/\s+/g, '.').replace(/[^a-z.]/g, '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-200"
      />
      <div className="relative bg-card border-l border-border shadow-2xl w-full max-w-lg h-screen overflow-hidden flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-border flex-shrink-0">
          <BackButton onClick={onClose} label="Back to Candidates" className="mb-2" />
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] text-muted-foreground font-medium tracking-widest">{candidate.id}</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold tracking-widest bg-muted/50 text-muted-foreground">{candidate.department}</span>
              {isMultiRole && (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold border border-border/60 text-muted-foreground bg-muted/20">
                  MULTI-ROLE
                </span>
              )}
            </div>
              <h2 className="text-lg font-semibold">{candidate.name}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{candidate.role} · {candidate.experience} Years Experience</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-muted/40 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        {/* Tabs */}
<div className="px-5 border-b border-border flex items-center gap-6 flex-shrink-0">
  <button
    onClick={() => setActiveTab('overview')}
    className={`relative py-3 text-xs font-medium transition-colors ${
      activeTab === 'overview'
        ? 'text-foreground'
        : 'text-muted-foreground hover:text-foreground'
    }`}
  >
    Overview

    {activeTab === 'overview' && (
      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground rounded-full" />
    )}
  </button>

  <button
    onClick={() => setActiveTab('records')}
    className={`relative py-3 text-xs font-medium transition-colors ${
      activeTab === 'records'
        ? 'text-foreground'
        : 'text-muted-foreground hover:text-foreground'
    }`}
  >
    Records

    {activeTab === 'records' && (
      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground rounded-full" />
    )}
  </button>
</div>

        {/* Scrollable body */}
<div className="flex-1 overflow-y-auto p-5">
  {activeTab === 'overview' && (
  <div className="space-y-5">

          {/* Hiring Pipeline Timeline */}
          <section>
            <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">Hiring Pipeline</h3>
            <div className="flex items-center gap-0">
              {statuses.slice(0, 5).map((s, i) => {
                const completed = i < currentIdx;
                const active = s === candidate.status;
                const isLast = i === 4;
                return (
                  <div key={s} className="flex items-center flex-1">
                    <div className="flex flex-col items-center gap-1 flex-1">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border flex-shrink-0 ${
                        completed ? 'bg-foreground border-foreground' :
                        active ? 'bg-foreground/20 border-foreground' :
                        'bg-muted/30 border-border'
                      }`}>
                        {completed && <CheckCircle2 className="w-3 h-3 text-background" />}
                        {active && <div className="w-2 h-2 rounded-full bg-foreground" />}
                      </div>
                      <span className={`text-[8px] text-center leading-tight max-w-[48px] ${
                        active ? 'text-foreground font-semibold' : 'text-muted-foreground'
                      }`}>{s}</span>
                    </div>
                    {!isLast && (
                      <div className={`h-px flex-1 mt-[-12px] mx-0.5 ${
                        i < currentIdx ? 'bg-foreground/50' : 'bg-border'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
            {(candidate.status === 'Selected' || candidate.status === 'Rejected') && (
              <div className={`mt-3 px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 ${
                candidate.status === 'Selected'
                  ? 'bg-soft-green text-foreground'
                  : 'bg-soft-red text-foreground'
              }`}>
                {candidate.status === 'Selected'
                  ? <CheckCircle2 className="w-3.5 h-3.5" />
                  : <AlertCircle className="w-3.5 h-3.5" />}
                {candidate.status === 'Selected' ? 'Candidate Selected — Offer Pending' : 'Application Closed — Not Progressed'}
              </div>
            )}
          </section>

          {/* Key Info */}
          <section className="grid grid-cols-2 gap-3">
            <div className="bg-muted/20 rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                <Building2 className="w-3 h-3" />
                <span className="text-[10px] uppercase tracking-widest">Department</span>
              </div>
              <p className="text-xs font-semibold">{candidate.department}</p>
            </div>
            <div className="bg-muted/20 rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                <Clock className="w-3 h-3" />
                <span className="text-[10px] uppercase tracking-widest">Experience</span>
              </div>
              <p className="text-xs font-semibold">{candidate.experience} Years</p>
            </div>
            <div className="bg-muted/20 rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                <MapPin className="w-3 h-3" />
                <span className="text-[10px] uppercase tracking-widest">Location</span>
              </div>
              <p className="text-xs font-semibold">{candidate.location}</p>
            </div>
            <div className="bg-muted/20 rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                <Calendar className="w-3 h-3" />
                <span className="text-[10px] uppercase tracking-widest">Applied</span>
              </div>
              <p className="text-xs font-semibold">{candidate.appliedDate}</p>
            </div>
          </section>

          {/* Role Applications */}
          <section>
            <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">Applied Roles</h3>
            <div className="space-y-1.5">
              {(isMultiRole ? candidate.multipleRoles! : [candidate.role]).map((r, i) => (
                <div key={r} className="flex items-center justify-between px-3 py-2 bg-muted/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs font-medium">{r}</span>
                    {i === 0 && <span className="text-[9px] text-muted-foreground bg-muted/40 px-1.5 py-0.5 rounded">Primary</span>}
                  </div>
                  <ChevronRight className="w-3 h-3 text-muted-foreground" />
                </div>
              ))}
            </div>
          </section>

          {/* Skills */}
          <section>
            <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">Skills</h3>
            <div className="flex flex-wrap gap-1.5">
              {candidate.skills.map((skill) => (
                <span key={skill} className="px-2.5 py-1 bg-muted/30 rounded-md text-[11px] font-medium border border-border/40">
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {/* Certifications */}
          <section>
            <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">Certifications</h3>
            <div className="space-y-1.5">
              {certs.map((cert) => (
                <div key={cert} className="flex items-center gap-2 px-3 py-1.5 bg-muted/20 rounded-lg">
                  <Award className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                  <span className="text-xs">{cert}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Contact */}
          <section>
            <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">Contact</h3>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/20 rounded-lg">
                <Mail className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs">{emailLocal}@email.com</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/20 rounded-lg">
                <Phone className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs">+1 (555) 0{candidate.id.split('-')[1]}</span>
              </div>
            </div>
          </section>

          {/* Availability */}
          <section>
            <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">Availability</h3>
            <div className="px-3 py-2 bg-muted/20 rounded-lg">
              <p className="text-xs">{availability}</p>
            </div>
          </section>

          {/* Recruiter Notes */}
          <section>
            <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">Recruiter Notes</h3>
            <div className="px-3 py-2.5 bg-muted/20 rounded-lg border border-border/40">
              <div className="flex items-start gap-2">
                <MessageSquare className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">{notes}</p>
              </div>
            </div>
          </section>

          {/* Hiring Recommendation */}
          <section>
            <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">Hiring Recommendation</h3>
            <div className="px-3 py-2 bg-muted/20 rounded-lg flex items-center gap-2">
              <FileText className="w-3 h-3 text-muted-foreground" />
              <span className={`text-xs font-semibold ${recommendation.color}`}>{recommendation.label}</span>
            </div>
          </section>

          {/* Update Status */}
          <section>
            <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">Move Stage</h3>
            <div className="flex flex-wrap gap-1.5">
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => { onStatusChange(candidate.id, s); onClose(); }}
                  className={`px-2.5 py-1 rounded-md text-[11px] transition-all ${
                    candidate.status === s
                      ? 'bg-foreground text-background font-semibold'
                      : 'bg-muted/30 hover:bg-muted/60 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </section>
        </div>
    </div>
)}
  {activeTab === 'records' && (
  <div className="space-y-4">

    <section>
      <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">
        Candidate Records
      </h3>

      <div className="rounded-xl border border-border bg-muted/10 p-6">
        <p className="text-sm font-medium">
          Records Module
        </p>

        <p className="text-xs text-muted-foreground mt-2">
          Interview history, evaluations, notes,
          documents, communications and activity logs
          will appear here.
        </p>
      </div>
    </section>

  </div>
)}

        {/* Footer Actions */}
        <div className="px-5 py-3.5 border-t border-border bg-card/80 flex-shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => { onStatusChange(candidate.id, 'Selected'); onClose(); }}
              className="flex-1 py-2 bg-soft-green text-foreground rounded-lg hover:opacity-80 transition-all text-xs font-semibold"
            >
              Select Candidate
            </button>
            <button
              onClick={() => { onStatusChange(candidate.id, 'Rejected'); onClose(); }}
              className="flex-1 py-2 bg-soft-red text-foreground rounded-lg hover:opacity-80 transition-all text-xs font-semibold"
            >
              Reject
            </button>
            <button className="flex-1 py-2 text-xs bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold">
              Schedule Interview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
