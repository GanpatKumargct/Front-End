import { useDrag } from 'react-dnd';
import { Calendar, Users, User, Briefcase } from 'lucide-react';
import type { Requisition } from '../Data/Requisitions';

interface RequisitionCardProps {
  requisition: Requisition;
  onClick: () => void;
}

export function RequisitionCard({
  requisition,
  onClick,
}: RequisitionCardProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'REQUISITION',
    item: {
      id: requisition.id,
      status: requisition.status,
      title: requisition.title,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const getPriorityStyle = () => {
    switch (requisition.priority) {
      case 'Critical':
        return 'bg-red-500/10 text-red-400 border-red-500/20';

      case 'High':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';

      case 'Medium':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';

      default:
        return 'bg-muted/30 text-muted-foreground border-border';
    }
  };

  return (
  <div
    ref={drag}
    onClick={onClick}
    className={`bg-card/90 border border-border/60 rounded-xl p-3.5 cursor-pointer transition-all duration-300 ease-out hover:scale-[1.012] hover:border-border/90 hover:-translate-y-0.5 ${
      isDragging ? 'opacity-40 scale-95' : 'opacity-100'
    } backdrop-blur-sm will-change-transform`}
    style={{
      boxShadow: isDragging
        ? 'none'
        : '0 1px 3px rgba(0,0,0,0.05)',
    }}
  >
    {/* Row 1 */}
    <div className="flex items-center justify-between mb-2">
      <span className="text-[10px] text-muted-foreground font-medium tracking-wider">
        {requisition.id}
      </span>

      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold tracking-widest bg-muted/50 text-muted-foreground">
        {requisition.department}
      </span>
    </div>

    {/* Row 2 */}
    <div className="flex items-start justify-between mb-1.5">
      <h3 className="text-sm font-semibold leading-tight flex-1 pr-2">
        {requisition.title}
      </h3>

      <div className="text-[10px] text-muted-foreground whitespace-nowrap">
        {requisition.headcount} HC
      </div>
    </div>

    {/* Row 3 */}
    <div className="flex items-center gap-1 mb-2.5">
      <Briefcase className="w-2.5 h-2.5 text-muted-foreground flex-shrink-0" />

      <p className="text-[11px] text-muted-foreground leading-tight">
        Hiring Requisition
      </p>
    </div>

    {/* Priority + Meta */}
    <div className="flex items-center justify-between gap-2 mb-2.5">
      <span
        className={`inline-flex items-center px-2 py-1 rounded-md text-[9px] font-semibold tracking-wide border whitespace-nowrap ${getPriorityStyle()}`}
      >
        {requisition.priority}
      </span>

      <div className="flex flex-wrap justify-end gap-1 max-w-[65%]">
        <span className="px-1.5 py-0.5 bg-muted/30 rounded text-[9px] font-medium text-muted-foreground">
          {requisition.workModel}
        </span>

        <span className="px-1.5 py-0.5 bg-muted/30 rounded text-[9px] font-medium text-muted-foreground">
          {requisition.employmentType}
        </span>
      </div>
    </div>

    {/* Requester */}
    <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-2">
      <User className="w-2.5 h-2.5" />
      <span>{requisition.requester}</span>
    </div>

    {/* Footer */}
    <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-2 border-t border-border/30">
      <div className="flex items-center gap-1">
        <Calendar className="w-2.5 h-2.5" />
        <span>{requisition.createdDate}</span>
      </div>

      <span>
        {requisition.targetHireDate}
      </span>
    </div>
  </div>
  );
}