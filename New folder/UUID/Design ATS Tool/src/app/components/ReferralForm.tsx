import { useState } from 'react';
import { X, Upload, FileText } from 'lucide-react';
import { BackButton } from './ui/BackButton';
import { mockJobs } from '../../Data/Jobs';
import { mockCandidates } from '../../Data/Candidates';

interface ReferralFormProps {
  onClose: () => void;
  onSubmit: (duplicate: boolean) => void;
}

export function ReferralForm({ onClose, onSubmit }: ReferralFormProps) {
  const [formData, setFormData] = useState({
    candidateName: '',
    referringEmployee: '',
    phone: '',
    email: '',
    positionReferredFor: '',
    howDoYouKnowThem: '',
    whyGoodFit: '',
    resumeFile: null as File | null,
  });

  const [isDragging, setIsDragging] = useState(false);

  const openJobs = mockJobs.filter(j => j.status === 'open');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, resumeFile: e.target.files[0] });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFormData({ ...formData, resumeFile: e.dataTransfer.files[0] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if candidate email already exists in system
    const duplicate = mockCandidates.some(c =>
      c.email?.toLowerCase() === formData.email.toLowerCase()
    );

    onSubmit(duplicate);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto p-6">
      <div className="w-full max-w-2xl my-8">
        <div className="bg-card border border-border rounded-xl shadow-2xl">
          {/* Header */}
          <div className="px-6 py-4 border-b border-border">
            <BackButton onClick={onClose} label="Back to Referrals" />
            <div className="flex items-center justify-between mt-1">
              <div>
                <h2 className="text-base font-semibold">Referral Form</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Submit a candidate referral</p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-muted/20 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Name of the Candidate */}
            <div>
              <label className="block text-xs font-medium text-foreground mb-2">
                Name of the Candidate
              </label>
              <input
                type="text"
                value={formData.candidateName}
                onChange={(e) => setFormData({ ...formData, candidateName: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"
                placeholder="Enter full name"
                required
              />
            </div>

            {/* Referring Employee */}
            <div>
              <label className="block text-xs font-medium text-foreground mb-2">
                Referring Employee ID
              </label>
              <input
                type="text"
                value={formData.referringEmployee}
                onChange={(e) => setFormData({ ...formData, referringEmployee: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"
                placeholder="e.g., EMP-12345"
                required
              />
            </div>

            {/* Phone & Email Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"
                  placeholder="+91-XXXXXXXXXX"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"
                  placeholder="candidate@email.com"
                  required
                />
              </div>
            </div>

            {/* Position Referred For */}
            <div>
              <label className="block text-xs font-medium text-foreground mb-2">
                Position Referred For
              </label>
              <select
                value={formData.positionReferredFor}
                onChange={(e) => setFormData({ ...formData, positionReferredFor: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"
                required
              >
                <option value="">Select position</option>
                {openJobs.map(job => (
                  <option key={job.id} value={job.id}>
                    {job.title} — {job.departmentCode}
                  </option>
                ))}
              </select>
            </div>

            {/* How do you know them? */}
            <div>
              <label className="block text-xs font-medium text-foreground mb-2">
                How do you know them?
              </label>
              <input
                type="text"
                value={formData.howDoYouKnowThem}
                onChange={(e) => setFormData({ ...formData, howDoYouKnowThem: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"
                placeholder="e.g., Former colleague, University classmate"
                required
              />
            </div>

            {/* Why is your referrer a good fit? */}
            <div>
              <label className="block text-xs font-medium text-foreground mb-2">
                Why is your referrer a good fit for our Organization?
              </label>
              <textarea
                value={formData.whyGoodFit}
                onChange={(e) => setFormData({ ...formData, whyGoodFit: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20 resize-none"
                placeholder="Describe their qualifications, experience, and why they would be a great addition to the team"
                required
              />
            </div>

            {/* Resume Upload */}
            <div>
              <label className="block text-xs font-medium text-foreground mb-2">
                Please attach CV/CV of the referred candidate
              </label>
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-4 transition-all ${
                  isDragging
                    ? 'border-foreground/40 bg-foreground/5'
                    : 'border-border bg-background'
                }`}
              >
                {formData.resumeFile ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="w-4 h-4 text-foreground" />
                      <span className="text-foreground">{formData.resumeFile.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({(formData.resumeFile.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, resumeFile: null })}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center gap-2 cursor-pointer">
                    <Upload className="w-5 h-5 text-muted-foreground" />
                    <div className="text-center">
                      <p className="text-xs text-foreground">
                        <span className="font-medium">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        PDF, DOC, DOCX (max 5MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      required
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted/20 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-all duration-200"
              >
                Add Referral
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
