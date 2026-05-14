import { useDrag } from "react-dnd";
import { MapPin, Calendar, Briefcase, Clock } from "lucide-react";
function CandidateCard({ candidate, onClick }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "CANDIDATE",
    item: { id: candidate.id, status: candidate.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }));
  const isMultiRole = candidate.multipleRoles && candidate.multipleRoles.length > 1;
  return <div
    ref={drag}
    onClick={onClick}
    className={`bg-card/90 border border-border/60 rounded-xl p-3.5 cursor-pointer transition-all duration-300 ease-out hover:scale-[1.012] hover:border-border/90 hover:-translate-y-0.5 ${isDragging ? "opacity-40 scale-95" : "opacity-100"} backdrop-blur-sm will-change-transform`}
    style={{
      boxShadow: isDragging ? "none" : "0 1px 3px rgba(0, 0, 0, 0.05)"
    }}
    onMouseEnter={(e) => {
      if (!isDragging) {
        e.currentTarget.style.boxShadow = document.documentElement.classList.contains("dark") ? "0 10px 24px rgba(0,0,0,0.28), 0 3px 8px rgba(0,0,0,0.18)" : "0 8px 20px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)";
      }
    }}
    onMouseLeave={(e) => {
      if (!isDragging) e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)";
    }}
  >
      {
    /* Row 1: ID + dept tag */
  }
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-muted-foreground font-medium tracking-wider">{candidate.id}</span>
        <div className="flex items-center gap-1.5">
          {isMultiRole && <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold tracking-wide border border-border/60 text-muted-foreground bg-muted/20">
              MULTI-ROLE
            </span>}
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold tracking-widest bg-muted/50 text-muted-foreground">
            {candidate.department}
          </span>
        </div>
      </div>

      {
    /* Row 2: Name + experience */
  }
      <div className="flex items-start justify-between mb-1.5">
        <h3 className="text-sm font-semibold leading-tight flex-1 pr-2">{candidate.name}</h3>
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground whitespace-nowrap">
          <Clock className="w-2.5 h-2.5 flex-shrink-0" />
          <span className="font-medium">{candidate.experience}y exp</span>
        </div>
      </div>

      {
    /* Row 3: Role */
  }
      <div className="flex items-center gap-1 mb-2.5">
        <Briefcase className="w-2.5 h-2.5 text-muted-foreground flex-shrink-0" />
        <p className="text-[11px] text-muted-foreground leading-tight">{candidate.role}</p>
      </div>

      {
    /* Skills */
  }
      <div className="flex flex-wrap gap-1 mb-2.5">
        {candidate.skills.slice(0, 3).map((skill) => <span
    key={skill}
    className="px-1.5 py-0.5 bg-muted/40 rounded text-[10px] font-medium"
  >
            {skill}
          </span>)}
      </div>

      {
    /* Row 4: Location + date */
  }
      <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-2 border-t border-border/30">
        <div className="flex items-center gap-1">
          <MapPin className="w-2.5 h-2.5" />
          <span>{candidate.location}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-2.5 h-2.5" />
          <span>{candidate.appliedDate}</span>
        </div>
      </div>
    </div>;
}
export {
  CandidateCard
};
