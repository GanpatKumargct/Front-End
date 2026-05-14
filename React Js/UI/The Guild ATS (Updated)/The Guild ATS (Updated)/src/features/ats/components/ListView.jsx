import { useState } from "react";
import { MapPin, Calendar, Clock } from "lucide-react";
import { CandidateDetailModal } from "./CandidateDetailModal";
function ListView({ candidates, onStatusChange }) {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const getStatusStyle = (status) => {
    switch (status) {
      case "Selected":
        return "bg-soft-green text-foreground";
      case "Rejected":
        return "bg-soft-red text-foreground";
      case "Founder's Interview":
        return "bg-foreground/15 text-foreground";
      case "PTC Interview":
        return "bg-foreground/10 text-foreground";
      default:
        return "bg-muted/40 text-muted-foreground";
    }
  };
  return <>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/20 border-b border-border">
              <tr>
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">ID</th>
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Candidate</th>
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Dept</th>
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Role</th>
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Skills</th>
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Location</th>
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Applied</th>
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Exp</th>
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Stage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {candidates.map((candidate) => <tr
    key={candidate.id}
    onClick={() => setSelectedCandidate(candidate)}
    className="hover:bg-foreground/[0.04] cursor-pointer transition-colors group"
  >
                  <td className="px-4 py-3 text-[10px] text-muted-foreground font-medium">{candidate.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold group-hover:text-foreground">{candidate.name}</span>
                      {candidate.multipleRoles && candidate.multipleRoles.length > 1 && <span className="text-[8px] font-semibold text-muted-foreground border border-border/60 px-1 py-0.5 rounded leading-none">MR</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] font-bold tracking-widest px-1.5 py-0.5 bg-muted/40 rounded text-muted-foreground">
                      {candidate.department}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[11px] text-muted-foreground">{candidate.role}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-0.5">
                      {candidate.skills.slice(0, 2).map((skill) => <span key={skill} className="px-1.5 py-0.5 bg-muted/40 rounded text-[9px]">
                          {skill}
                        </span>)}
                      {candidate.skills.length > 2 && <span className="text-[9px] text-muted-foreground px-1">+{candidate.skills.length - 2}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <MapPin className="w-2.5 h-2.5 flex-shrink-0" />
                      {candidate.location}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Calendar className="w-2.5 h-2.5 flex-shrink-0" />
                      {candidate.appliedDate}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock className="w-2.5 h-2.5 flex-shrink-0" />
                      {candidate.experience}y
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold whitespace-nowrap ${getStatusStyle(candidate.status)}`}>
                      {candidate.status}
                    </span>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
      <CandidateDetailModal
    candidate={selectedCandidate}
    onClose={() => setSelectedCandidate(null)}
    onStatusChange={onStatusChange}
  />
    </>;
}
export {
  ListView
};
