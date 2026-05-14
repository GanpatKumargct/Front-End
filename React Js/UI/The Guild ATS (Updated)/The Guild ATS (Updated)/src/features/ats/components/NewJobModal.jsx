import { X } from "lucide-react";
import { useState } from "react";
function NewJobModal({ onClose }) {
  const [formData, setFormData] = useState({
    jobTitle: "",
    department: "",
    employmentType: "",
    location: "",
    experienceMin: "",
    experienceMax: "",
    skillsRequired: "",
    responsibilities: "",
    requirements: "",
    hiringManager: "",
    interviewProcess: "",
    salaryMin: "",
    salaryMax: ""
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Job created:", formData);
    onClose();
  };
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
    onClick={onClose}
    className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
  />
      <div className="relative bg-card border border-border rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold">Create New Job</h2>
            <button
    onClick={onClose}
    className="p-1.5 hover:bg-accent/10 rounded-md transition-colors"
  >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-2 gap-4">
              {
    /* Job Title */
  }
              <div className="col-span-2">
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Job Title *</label>
                <input
    type="text"
    required
    value={formData.jobTitle}
    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
    placeholder="e.g., Senior Software Engineer"
    className="w-full px-3 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all shadow-sm hover:shadow-md"
  />
              </div>

              {
    /* Department */
  }
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Department *</label>
                <select
    required
    value={formData.department}
    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
    className="w-full px-3 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all shadow-sm hover:shadow-md"
  >
                  <option value="">Select Department</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Product">Product</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>

              {
    /* Employment Type */
  }
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Employment Type *</label>
                <select
    required
    value={formData.employmentType}
    onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
    className="w-full px-3 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all shadow-sm hover:shadow-md"
  >
                  <option value="">Select Type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              {
    /* Location */
  }
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Location *</label>
                <input
    type="text"
    required
    value={formData.location}
    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
    placeholder="e.g., Bangalore, Remote"
    className="w-full px-3 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all shadow-sm hover:shadow-md"
  />
              </div>

              {
    /* Experience Range */
  }
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Experience Range</label>
                <div className="flex gap-2">
                  <input
    type="number"
    value={formData.experienceMin}
    onChange={(e) => setFormData({ ...formData, experienceMin: e.target.value })}
    placeholder="Min"
    className="w-full px-3 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all shadow-sm hover:shadow-md"
  />
                  <span className="self-center text-sm text-muted-foreground">to</span>
                  <input
    type="number"
    value={formData.experienceMax}
    onChange={(e) => setFormData({ ...formData, experienceMax: e.target.value })}
    placeholder="Max"
    className="w-full px-3 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all shadow-sm hover:shadow-md"
  />
                  <span className="self-center text-sm text-muted-foreground">years</span>
                </div>
              </div>

              {
    /* Skills Required */
  }
              <div className="col-span-2">
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Skills Required</label>
                <input
    type="text"
    value={formData.skillsRequired}
    onChange={(e) => setFormData({ ...formData, skillsRequired: e.target.value })}
    placeholder="e.g., React, TypeScript, Node.js (comma separated)"
    className="w-full px-3 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all shadow-sm hover:shadow-md"
  />
              </div>

              {
    /* Responsibilities */
  }
              <div className="col-span-2">
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Responsibilities</label>
                <textarea
    value={formData.responsibilities}
    onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
    placeholder="List key responsibilities..."
    rows={3}
    className="w-full px-3 py-1.5 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
  />
              </div>

              {
    /* Requirements */
  }
              <div className="col-span-2">
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Requirements</label>
                <textarea
    value={formData.requirements}
    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
    placeholder="List requirements and qualifications..."
    rows={3}
    className="w-full px-3 py-1.5 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
  />
              </div>

              {
    /* Hiring Manager */
  }
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Hiring Manager</label>
                <input
    type="text"
    value={formData.hiringManager}
    onChange={(e) => setFormData({ ...formData, hiringManager: e.target.value })}
    placeholder="e.g., John Doe"
    className="w-full px-3 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all shadow-sm hover:shadow-md"
  />
              </div>

              {
    /* Interview Process */
  }
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Interview Process</label>
                <select
    value={formData.interviewProcess}
    onChange={(e) => setFormData({ ...formData, interviewProcess: e.target.value })}
    className="w-full px-3 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all shadow-sm hover:shadow-md"
  >
                  <option value="">Select Process</option>
                  <option value="standard">Standard (3 rounds)</option>
                  <option value="extended">Extended (5 rounds)</option>
                  <option value="fast-track">Fast Track (2 rounds)</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              {
    /* Salary Range */
  }
              <div className="col-span-2">
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Salary Range (Annual)</label>
                <div className="flex gap-2 items-center">
                  <span className="text-sm text-muted-foreground">$</span>
                  <input
    type="number"
    value={formData.salaryMin}
    onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
    placeholder="Min"
    className="w-full px-3 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all shadow-sm hover:shadow-md"
  />
                  <span className="text-sm text-muted-foreground">to</span>
                  <span className="text-sm text-muted-foreground">$</span>
                  <input
    type="number"
    value={formData.salaryMax}
    onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
    placeholder="Max"
    className="w-full px-3 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all shadow-sm hover:shadow-md"
  />
                </div>
              </div>
            </div>
          </form>

          <div className="p-4 border-t border-border bg-muted/20">
            <div className="flex items-center justify-end gap-2">
              <button
    type="button"
    onClick={onClose}
    className="px-4 py-2 text-sm bg-muted/50 hover:bg-muted rounded-md transition-colors"
  >
                Cancel
              </button>
              <button
    onClick={handleSubmit}
    className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
  >
                Publish Job
              </button>
            </div>
          </div>
        </div>
      </div>;
}
export {
  NewJobModal
};
