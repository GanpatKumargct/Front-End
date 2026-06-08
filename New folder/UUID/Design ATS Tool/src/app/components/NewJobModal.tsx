import {
  X,
  Upload,
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { BackButton } from "./ui/BackButton";
import { departments } from "../../Data/Departments";
import { mockRecruiters } from "../../Data/Recruiters";

interface NewJobModalProps {
  onClose: () => void;
}

export function NewJobModal({ onClose }: NewJobModalProps) {
  const [formData, setFormData] = useState({
    // Requisition Metadata
    requisitionId: `REQ-${Math.floor(Math.random() * 9000) + 1000}`,
    jobTitle: "",
    department: "",
    departmentCode: "",
    employmentType: "full_time",
    location: "",
    hiringManagers: [] as string[],
    supportingManagers: [] as string[],
    recruiterAssigned: "",
    targetJoiningDate: "",
    hiringPriority: "medium",
    roleType: "new",
    approvalStatus: "pending",

    // Job Details
    experienceMin: "",
    experienceMax: "",
    skillsRequired: "",

    // Business Justification
    businessJustification: "",

    // Workforce Capacity
    capacityAssessmentCompleted: false,

    // Scope of Work
    scopeOfWork: "",

    // Technical Evaluation
    technicalQuestion1: "",
    technicalQuestion2: "",
    technicalQuestion3: "",

    // Portfolio/Projects
    portfolioLinks: "",

    // Resume
    resumeFile: null as File | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Requisition submitted:", formData);
    onClose();
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        resumeFile: e.target.files[0],
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "high":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      default:
        return "bg-foreground/5 text-foreground border-border";
    }
  };

  const getApprovalColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "pending":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "rejected":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-foreground/5 text-foreground border-border";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      />
      <div className="relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border/50 bg-card/60 backdrop-blur-sm">
          <BackButton onClick={onClose} label="Back to Jobs" className="mb-2" />
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                Hiring Requisition Request
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Submit a new role requisition for approval
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted/20 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto"
        >
          <div className="p-5 space-y-6">
            {/* Requisition Metadata */}
            <div className="p-4 rounded-xl border border-border bg-muted/10">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Requisition Metadata
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                    Requisition ID
                  </label>
                  <div className="px-3 py-2 text-sm bg-muted/40 border border-border/50 rounded-lg font-mono text-foreground">
                    {formData.requisitionId}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                    Approval Status
                  </label>
                  <div
                    className={`px-3 py-2 text-xs font-medium rounded-lg flex items-center gap-2 border ${getApprovalColor(formData.approvalStatus)}`}
                  >
                    <Clock className="w-3 h-3" />
                    Pending Review
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                    Priority Level
                  </label>
                  <Select
                    value={formData.hiringPriority}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        hiringPriority: value,
                      })
                    }
                  >
                    <SelectTrigger
                      className={`w-full text-xs font-semibold ${getPriorityColor(formData.hiringPriority)}`}
                    >
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="low">LOW</SelectItem>
                      <SelectItem value="medium">
                        MEDIUM
                      </SelectItem>
                      <SelectItem value="high">HIGH</SelectItem>
                      <SelectItem value="urgent">
                        URGENT
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Job Details */}
            <div className="p-4 rounded-xl border border-border bg-card">
              <h3 className="text-sm font-semibold mb-4">
                Job Details
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.jobTitle}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          jobTitle: e.target.value,
                        })
                      }
                      placeholder="e.g., Senior Propulsion Engineer"
                      className="w-full px-3 py-2 text-sm bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-foreground/20 focus:border-foreground/20 transition-all placeholder:text-muted-foreground/50"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                      Department *
                    </label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) => {
                        const dept = departments.find(
                          (d) => d.name === value,
                        );

                        setFormData({
                          ...formData,
                          department: value,
                          departmentCode: dept?.code || "",
                        });
                      }}
                    >
                      <SelectTrigger className="w-full bg-muted/30 border-border">
                        <SelectValue placeholder="Select Department" />
                      </SelectTrigger>

                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem
                            key={dept.id}
                            value={dept.name}
                          >
                            {dept.name} ({dept.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                      Employment Type *
                    </label>
                    <Select
                      value={formData.employmentType}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          employmentType: value,
                        })
                      }
                    >
                      <SelectTrigger className="w-full bg-muted/30 border-border">
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="full_time">
                          Full-time
                        </SelectItem>

                        <SelectItem value="contract">
                          Contract
                        </SelectItem>

                        <SelectItem value="internship">
                          Internship
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                      Location *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          location: e.target.value,
                        })
                      }
                      placeholder="e.g., BASE 003"
                      className="w-full px-3 py-2 text-sm bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-foreground/20 transition-all placeholder:text-muted-foreground/50"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                      Role Type
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            roleType: "new",
                          })
                        }
                        className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                          formData.roleType === "new"
                            ? "bg-foreground/10 border-foreground/20 text-foreground"
                            : "bg-muted/20 border-border text-muted-foreground hover:bg-muted/30"
                        }`}
                      >
                        New Role
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            roleType: "replacement",
                          })
                        }
                        className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                          formData.roleType === "replacement"
                            ? "bg-foreground/10 border-foreground/20 text-foreground"
                            : "bg-muted/20 border-border text-muted-foreground hover:bg-muted/30"
                        }`}
                      >
                        Replacement
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4"></div>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                  Recruiter Assigned
                </label>

                <Select
                  value={formData.recruiterAssigned}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      recruiterAssigned: value,
                    })
                  }
                >
                  <SelectTrigger className="w-full bg-muted/30 border-border">
                    <SelectValue placeholder="Auto-assign" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="auto">
                      Auto-assign
                    </SelectItem>

                    {mockRecruiters.map((recruiter) => (
                      <SelectItem
                        key={recruiter.id}
                        value={recruiter.name}
                      >
                        {recruiter.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                      Target Joining Date
                    </label>
                    <input
                      type="date"
                      value={formData.targetJoiningDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          targetJoiningDate: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-sm bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-foreground/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                    Experience Range
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={formData.experienceMin}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          experienceMin: e.target.value,
                        })
                      }
                      placeholder="Min"
                      className="w-24 px-3 py-2 text-sm bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-foreground/20 transition-all placeholder:text-muted-foreground/50"
                    />
                    <span className="text-xs text-muted-foreground">
                      to
                    </span>
                    <input
                      type="number"
                      value={formData.experienceMax}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          experienceMax: e.target.value,
                        })
                      }
                      placeholder="Max"
                      className="w-24 px-3 py-2 text-sm bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-foreground/20 transition-all placeholder:text-muted-foreground/50"
                    />
                    <span className="text-xs text-muted-foreground">
                      years
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                    Skills Required
                  </label>
                  <input
                    type="text"
                    value={formData.skillsRequired}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        skillsRequired: e.target.value,
                      })
                    }
                    placeholder="e.g., CFD, ANSYS Fluent, Python"
                    className="w-full px-3 py-2 text-sm bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-foreground/20 transition-all placeholder:text-muted-foreground/50"
                  />
                </div>
              </div>
            </div>
            {/* People Assignment */}

            <div className="p-4 rounded-xl border border-border bg-card">
              <h3 className="text-sm font-semibold mb-4">
                People Assignment
              </h3>

              <div className="grid grid-cols-2 gap-6">
                {/* Hiring Managers */}
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                    Hiring Managers
                  </label>

                  <Select
                    onValueChange={(value) => {
                      if (
                        !formData.hiringManagers.includes(value)
                      ) {
                        setFormData({
                          ...formData,
                          hiringManagers: [
                            ...formData.hiringManagers,
                            value,
                          ],
                        });
                      }
                    }}
                  >
                    <SelectTrigger className="w-full bg-muted/30 border-border">
                      <SelectValue placeholder="Add Hiring Manager" />
                    </SelectTrigger>

                    <SelectContent>
                      {mockRecruiters.map((person) => (
                        <SelectItem
                          key={person.id}
                          value={person.name}
                        >
                          {person.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.hiringManagers.map((manager) => (
                      <div
                        key={manager}
                        className="px-3 py-1.5 rounded-lg border border-border bg-muted/20 text-xs font-medium flex items-center gap-2"
                      >
                        {manager}

                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              hiringManagers:
                                formData.hiringManagers.filter(
                                  (m) => m !== manager,
                                ),
                            })
                          }
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Supporting Managers */}
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                    Supporting Managers
                  </label>

                  <Select
                    onValueChange={(value) => {
                      if (
                        !formData.supportingManagers.includes(
                          value,
                        )
                      ) {
                        setFormData({
                          ...formData,
                          supportingManagers: [
                            ...formData.supportingManagers,
                            value,
                          ],
                        });
                      }
                    }}
                  >
                    <SelectTrigger className="w-full bg-muted/30 border-border">
                      <SelectValue placeholder="Add Supporting Manager" />
                    </SelectTrigger>

                    <SelectContent>
                      {mockRecruiters.map((person) => (
                        <SelectItem
                          key={person.id}
                          value={person.name}
                        >
                          {person.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.supportingManagers.map(
                      (manager) => (
                        <div
                          key={manager}
                          className="px-3 py-1.5 rounded-lg border border-border bg-muted/20 text-xs font-medium flex items-center gap-2"
                        >
                          {manager}

                          <button
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                supportingManagers:
                                  formData.supportingManagers.filter(
                                    (m) => m !== manager,
                                  ),
                              })
                            }
                          >
                            ×
                          </button>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Business Justification */}
            <div className="p-4 rounded-xl border border-border bg-card">
              <h3 className="text-sm font-semibold mb-2">
                Business Justification
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                Clearly state why hiring in this role is
                required
              </p>
              <textarea
                value={formData.businessJustification}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    businessJustification: e.target.value,
                  })
                }
                placeholder="Explain the business need, impact on deliverables, and strategic importance of this hire. Include any project dependencies or capacity constraints requiring this resource..."
                rows={4}
                className="w-full px-3 py-2 text-sm bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-foreground/20 resize-none placeholder:text-muted-foreground/50"
              />
            </div>

            {/* Workforce Capacity Validation */}
            <div className="p-4 rounded-xl border border-border bg-card">
              <h3 className="text-sm font-semibold mb-3">
                Workforce Capacity Validation
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Has a two-quarter workload and capacity
                    assessment been completed?
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          capacityAssessmentCompleted: true,
                        })
                      }
                      className={`flex-1 px-4 py-2.5 text-xs font-medium rounded-lg border transition-all flex items-center justify-center gap-2 ${
                        formData.capacityAssessmentCompleted
                          ? "bg-green-500/10 border-green-500/20 text-green-500"
                          : "bg-muted/20 border-border text-muted-foreground hover:bg-muted/30"
                      }`}
                    >
                      {formData.capacityAssessmentCompleted && (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      )}
                      Yes, Completed
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          capacityAssessmentCompleted: false,
                        })
                      }
                      className={`flex-1 px-4 py-2.5 text-xs font-medium rounded-lg border transition-all flex items-center justify-center gap-2 ${
                        !formData.capacityAssessmentCompleted
                          ? "bg-red-500/10 border-red-500/20 text-red-500"
                          : "bg-muted/20 border-border text-muted-foreground hover:bg-muted/30"
                      }`}
                    >
                      {!formData.capacityAssessmentCompleted && (
                        <AlertCircle className="w-3.5 h-3.5" />
                      )}
                      No, Not Yet
                    </button>
                  </div>
                </div>
                {!formData.capacityAssessmentCompleted && (
                  <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                    <p className="text-xs text-red-500">
                      Capacity assessment is required before
                      submitting this requisition. Please
                      complete a two-quarter workload evaluation
                      before proceeding.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Scope of Work */}
            <div className="p-4 rounded-xl border border-border bg-card">
              <h3 className="text-sm font-semibold mb-2">
                Scope of Work
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                This section must reflect what the individual
                will actually spend time doing, not aspirational
                or generic responsibilities
              </p>
              <textarea
                value={formData.scopeOfWork}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    scopeOfWork: e.target.value,
                  })
                }
                placeholder="e.g., Modeling turbulent flow in propellant feed systems..."
                rows={4}
                className="w-full px-3 py-2 text-sm bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-foreground/20 resize-none placeholder:text-muted-foreground/50"
              />
            </div>

            {/* Technical Evaluation Questions */}
            <div className="p-4 rounded-xl border border-border bg-card">
              <h3 className="text-sm font-semibold mb-4">
                Technical Evaluation Questions
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">
                    Question No. 1
                  </label>
                  <input
                    type="text"
                    value={formData.technicalQuestion1}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        technicalQuestion1: e.target.value,
                      })
                    }
                    placeholder="Answer here..."
                    className="w-full px-3 py-2 text-sm bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-foreground/20 transition-all placeholder:text-muted-foreground/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">
                    Question No. 2
                  </label>
                  <input
                    type="text"
                    value={formData.technicalQuestion2}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        technicalQuestion2: e.target.value,
                      })
                    }
                    placeholder="Answer here..."
                    className="w-full px-3 py-2 text-sm bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-foreground/20 transition-all placeholder:text-muted-foreground/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">
                    Question No. 3
                  </label>
                  <input
                    type="text"
                    value={formData.technicalQuestion3}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        technicalQuestion3: e.target.value,
                      })
                    }
                    placeholder="Answer here..."
                    className="w-full px-3 py-2 text-sm bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-foreground/20 transition-all placeholder:text-muted-foreground/50"
                  />
                </div>
              </div>
            </div>

            {/* Portfolio/Project Links */}
            <div className="p-4 rounded-xl border border-border bg-card">
              <h3 className="text-sm font-semibold mb-2">
                Portfolio / Project Links
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                Please add DIRECT links to your portfolio,
                published projects or repositories. Paste URLs
                here and hit ENTER once we are available.
              </p>
              <textarea
                value={formData.portfolioLinks}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    portfolioLinks: e.target.value,
                  })
                }
                placeholder="Paste URLs here"
                rows={3}
                className="w-full px-3 py-2 text-sm bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-foreground/20 resize-none placeholder:text-muted-foreground/50"
              />
            </div>

            {/* Resume Attachment */}
            <div className="p-4 rounded-xl border border-border bg-card">
              <h3 className="text-sm font-semibold mb-3">
                Resume Attachment
              </h3>
              <div
                className="relative border-2 border-dashed border-border rounded-lg p-8 hover:border-foreground/20 transition-all cursor-pointer group"
                onClick={() =>
                  document
                    .getElementById("resume-upload")
                    ?.click()
                }
              >
                <input
                  id="resume-upload"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-3">
                  {formData.resumeFile ? (
                    <>
                      <FileText className="w-8 h-8 text-foreground" />
                      <div className="text-center">
                        <p className="text-sm font-medium text-foreground">
                          {formData.resumeFile.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {(
                            formData.resumeFile.size / 1024
                          ).toFixed(2)}{" "}
                          KB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFormData({
                            ...formData,
                            resumeFile: null,
                          });
                        }}
                        className="text-xs text-red-500 hover:text-red-400"
                      >
                        Remove file
                      </button>
                    </>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-muted-foreground group-hover:text-foreground transition-colors" />
                      <div className="text-center">
                        <p className="text-sm font-medium text-foreground">
                          Upload Resume
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Click to browse or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PDF, DOC, DOCX (Max 5MB)
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-border/50 bg-muted/10">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Form will be reviewed by{" "}
              {formData.recruiterAssigned || "recruiting team"}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-muted/20 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 text-sm font-medium bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-all flex items-center gap-2"
              >
                Submit for Approval
                <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}