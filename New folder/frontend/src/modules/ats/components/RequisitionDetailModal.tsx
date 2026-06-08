import {
  X,
  Calendar,
  MapPin,
  CheckCircle,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { BackButton } from '@/shared/components/ui/BackButton';
import type { Requisition, RequisitionStatus } from '@/shared/types';

interface RequisitionDetailModalProps {
requisition: Requisition;
onClose: () => void;
onStatusChange: (
status: RequisitionStatus
) => void;
}

export function RequisitionDetailModal({
requisition,
onClose,
onStatusChange,
}: RequisitionDetailModalProps) {
const statuses: RequisitionStatus[] = [
'Draft',
'Under Review',
'Open',
'Fulfilled',
'Cancelled',
'Rejected',
'On Hold',
];

return ( <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">

```
  <div className="w-full max-w-7xl h-[92vh] bg-card border border-border rounded-2xl overflow-hidden shadow-2xl flex flex-col">

    {/* HEADER */}

    <div className="border-b border-border px-6 py-5">
      <BackButton onClick={onClose} label="Back to Requisitions" />
      <div className="flex items-center justify-between mt-1">

        <div>
          <div className="flex items-center gap-3">

            <h2 className="text-2xl font-semibold">
              {requisition.title}
            </h2>

          <span className="px-2 py-1 rounded-md text-xs bg-muted/30 border border-border">
            {requisition.status}
          </span>

          <span className="px-2 py-1 rounded-md text-xs bg-muted/30 border border-border">
            {requisition.priority}
          </span>

        </div>

        <p className="text-xs text-muted-foreground mt-1">
          {requisition.id}
        </p>

        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-muted/30"
        >
          <X className="w-5 h-5" />
        </button>

      </div>
    </div>

    {/* BODY */}

    <div className="flex-1 overflow-auto p-6">

      <div className="grid grid-cols-12 gap-6">

        {/* LEFT */}

        <div className="col-span-8 space-y-4">

          <div className="border border-border rounded-xl p-5">
            <h3 className="font-semibold mb-4">
              Requisition Details
            </h3>

            <div className="grid grid-cols-3 gap-4 text-sm">

              <div>
                <p className="text-muted-foreground">
                  Department
                </p>
                <p>{requisition.department}</p>
              </div>

              <div>
                <p className="text-muted-foreground">
                  Headcount
                </p>
                <p>{requisition.headcount}</p>
              </div>

              <div>
                <p className="text-muted-foreground">
                  Role Type
                </p>
                <p>{requisition.roleType}</p>
              </div>

              <div>
                <p className="text-muted-foreground">
                  Employment Type
                </p>
                <p>{requisition.employmentType}</p>
              </div>

              <div>
                <p className="text-muted-foreground">
                  Work Model
                </p>
                <p>{requisition.workModel}</p>
              </div>

              <div>
                <p className="text-muted-foreground">
                  Experience
                </p>
                <p>{requisition.experienceRange}</p>
              </div>

            </div>
          </div>

          <div className="border border-border rounded-xl p-5">
            <h3 className="font-semibold mb-3">
              Business Justification
            </h3>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {requisition.businessJustification}
            </p>
          </div>

          <div className="border border-border rounded-xl p-5">
            <h3 className="font-semibold mb-3">
              Role Overview
            </h3>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {requisition.roleOverview}
            </p>
          </div>

          <div className="border border-border rounded-xl p-5">
            <h3 className="font-semibold mb-3">
              Scope Of Work
            </h3>

            <ul className="space-y-2 text-sm">
              {requisition.scopeOfWork.map(
                (item, idx) => (
                  <li key={idx}>
                    • {item}
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="border border-border rounded-xl p-5">
            <h3 className="font-semibold mb-3">
              Requirements
            </h3>

            <ul className="space-y-2 text-sm">
              {requisition.requirements.map(
                (item, idx) => (
                  <li key={idx}>
                    • {item}
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="border border-border rounded-xl p-5">
            <h3 className="font-semibold mb-3">
              Required Skills
            </h3>

            <div className="flex flex-wrap gap-2">
              {requisition.skills.map(
                (skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-md border border-border bg-muted/20 text-xs"
                  >
                    {skill}
                  </span>
                )
              )}
            </div>
          </div>

        </div>

        {/* RIGHT */}

        <div className="col-span-4 space-y-4">

          <div className="border border-border rounded-xl p-5">

            <h3 className="font-semibold mb-4">
              Quick Actions
            </h3>

            <div className="grid gap-2">

  {requisition.status === 'Open' &&
 !requisition.recruiterAssigned && (
  <button className="w-full border border-border rounded-lg py-2 text-sm">
    Assign Recruiter
  </button>
)}

  <button className="w-full border border-border rounded-lg py-2 text-sm">
    Edit Requisition
  </button>

  <button className="w-full border border-border rounded-lg py-2 text-sm">
    Add Note
  </button>

</div>

          </div>

          <div className="border border-border rounded-xl p-5">

            <h3 className="font-semibold mb-3">
              Status
            </h3>

            <Select
  value={requisition.status}
  onValueChange={(value) =>
    onStatusChange(value as RequisitionStatus)
  }
>
  <SelectTrigger className="w-full bg-muted/20 border-border">
    <SelectValue />
  </SelectTrigger>

  <SelectContent>
    {statuses.map((status) => (
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

          <div className="border border-border rounded-xl p-5">

            <h3 className="font-semibold mb-4">
              Ownership
            </h3>

            <div className="space-y-4 text-sm">

              <div>
                <p className="text-muted-foreground">
                  Requester
                </p>
                <p>{requisition.requester}</p>
              </div>

              <div>
  <p className="text-muted-foreground">
    Hiring Managers
  </p>

  <div className="space-y-1">
    {requisition.hiringManagers?.map(
      (manager) => (
        <p key={manager}>
          {manager}
        </p>
      )
    )}
  </div>
</div>
              <div>
  <p className="text-muted-foreground">
    Supporting Managers
  </p>

  <div className="space-y-1">
    {requisition.supportingManagers?.length ? (
      requisition.supportingManagers.map(
        (manager) => (
          <p key={manager}>
            {manager}
          </p>
        )
      )
    ) : (
      <p className="text-muted-foreground">
        —
      </p>
    )}
  </div>
</div>

              {requisition.status === 'Open' && (
  <div>
    <p className="text-muted-foreground">
      Recruiter
    </p>
    <p>{requisition.recruiterAssigned}</p>
  </div>
)}

            </div>

          </div>

          <div className="border border-border rounded-xl p-5">

            <h3 className="font-semibold mb-4">
              Hiring Metrics
            </h3>

            <div className="space-y-3 text-sm">

              <div className="flex justify-between">
                <span>Candidates</span>
                <span>{requisition.candidateCount}</span>
              </div>

              <div className="flex justify-between">
                <span>Interviews</span>
                <span>{requisition.interviewCount}</span>
              </div>

              <div className="flex justify-between">
                <span>Selected</span>
                <span>{requisition.selectedCount}</span>
              </div>

              <div className="flex justify-between">
                <span>Rejected</span>
                <span>{requisition.rejectedCount}</span>
              </div>

            </div>

          </div>

          <div className="border border-border rounded-xl p-5">

            <h3 className="font-semibold mb-3">
              Approval Workflow
            </h3>

            <div className="flex items-center gap-2 text-sm">

              <CheckCircle className="w-4 h-4" />

              <span>
                {requisition.approvalStatus}
              </span>

            </div>

          </div>

          <div className="border border-border rounded-xl p-5">

            <h3 className="font-semibold mb-4">
              Timeline
            </h3>

            <div className="space-y-3 text-sm">

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {requisition.createdDate}
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {requisition.targetHireDate}
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {requisition.location}
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  </div>

</div>

);
}