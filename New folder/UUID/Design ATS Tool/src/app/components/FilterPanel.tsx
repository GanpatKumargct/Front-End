import { X, Search } from 'lucide-react';
import { useState } from 'react';

interface FilterPanelProps {
  onClose: () => void;
}

export function FilterPanel({ onClose }: FilterPanelProps) {
  const [filters, setFilters] = useState({
    jobRole: '',
    experienceRange: '',
    interviewStage: '',
    skills: [] as string[],
    recruiter: '',
    location: '',
    availability: '',
    education: '',
    noticePeriod: '',
    dateStart: '',
    dateEnd: '',
    datePreset: ''
  });

  const datePresets = [
    { label: 'Last 7 Days', value: '7days' },
    { label: 'Last 30 Days', value: '30days' },
    { label: 'This Month', value: 'thismonth' },
  ];

  const handlePresetClick = (preset: string) => {
    const today = new Date();
    let startDate = '';

    switch (preset) {
      case '7days':
        startDate = new Date(today.setDate(today.getDate() - 7)).toISOString().split('T')[0];
        break;
      case '30days':
        startDate = new Date(today.setDate(today.getDate() - 30)).toISOString().split('T')[0];
        break;
      case 'thismonth':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
        break;
    }

    setFilters({
      ...filters,
      dateStart: startDate,
      dateEnd: new Date().toISOString().split('T')[0],
      datePreset: preset
    });
  };

  const jobRoles = ['Software Engineer', 'Product Manager', 'Designer', 'Data Scientist', 'DevOps Engineer'];
  const experienceRanges = ['0-2 years', '2-5 years', '5-10 years', '10+ years'];
  const interviewStages = ['Screening', 'Fitment Evaluation', 'Technical Interview', 'PTC Interview', "Founder's Interview"];
  const availableSkills = ['React', 'TypeScript', 'Python', 'Go', 'AWS', 'Docker', 'Figma', 'UI/UX'];
  const recruiters = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams'];
  const locations = ['Bangalore', 'Mumbai', 'Delhi', 'Remote', 'Hybrid'];
  const educationLevels = ["Bachelor's", "Master's", 'PhD', 'Bootcamp'];
  const noticePeriods = ['Immediate', '15 days', '30 days', '60 days', '90 days'];

  const toggleSkill = (skill: string) => {
    setFilters(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      />
      <div className="relative bg-card border-l border-border w-full max-w-md h-full overflow-hidden flex flex-col animate-in slide-in-from-right duration-300">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold">Filters</h2>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-accent/10 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Job Role */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">Job Role</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search roles..."
                  value={filters.jobRole}
                  onChange={(e) => setFilters({ ...filters, jobRole: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all shadow-sm"
                />
              </div>
              <div className="mt-2 space-y-1">
                {jobRoles.filter(role => role.toLowerCase().includes(filters.jobRole.toLowerCase())).map((role) => (
                  <button
                    key={role}
                    className="w-full text-left px-3 py-1.5 text-sm hover:bg-accent/10 rounded-md transition-colors"
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Experience Range */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">Experience Range</label>
              <select
                value={filters.experienceRange}
                onChange={(e) => setFilters({ ...filters, experienceRange: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all shadow-sm hover:shadow-md"
              >
                <option value="">All Levels</option>
                {experienceRanges.map((range) => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
            </div>

            {/* Interview Stage */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">Interview Stage</label>
              <select
                value={filters.interviewStage}
                onChange={(e) => setFilters({ ...filters, interviewStage: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all shadow-sm hover:shadow-md"
              >
                <option value="">All Stages</option>
                {interviewStages.map((stage) => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>

            {/* Skills */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">Skills</label>
              <div className="flex flex-wrap gap-1.5">
                {availableSkills.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                      filters.skills.includes(skill)
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-muted/30 hover:bg-muted/50'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            {/* Recruiter Assigned */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">Recruiter Assigned</label>
              <select
                value={filters.recruiter}
                onChange={(e) => setFilters({ ...filters, recruiter: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all shadow-sm hover:shadow-md"
              >
                <option value="">All Recruiters</option>
                {recruiters.map((recruiter) => (
                  <option key={recruiter} value={recruiter}>{recruiter}</option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">Location</label>
              <select
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all shadow-sm hover:shadow-md"
              >
                <option value="">All Locations</option>
                {locations.map((location) => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            {/* Availability */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">Availability</label>
              <input
                type="text"
                placeholder="e.g., Immediate, 2 weeks"
                value={filters.availability}
                onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all shadow-sm hover:shadow-md"
              />
            </div>

            {/* Education */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">Education</label>
              <select
                value={filters.education}
                onChange={(e) => setFilters({ ...filters, education: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all shadow-sm hover:shadow-md"
              >
                <option value="">All Levels</option>
                {educationLevels.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            {/* Notice Period */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">Notice Period</label>
              <select
                value={filters.noticePeriod}
                onChange={(e) => setFilters({ ...filters, noticePeriod: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all shadow-sm hover:shadow-md"
              >
                <option value="">All Periods</option>
                {noticePeriods.map((period) => (
                  <option key={period} value={period}>{period}</option>
                ))}
              </select>
            </div>

            {/* Date Applied Range */}
            <div className="space-y-3">
              <label className="text-xs font-medium text-muted-foreground block">Date Applied Range</label>

              {/* Quick Presets */}
              <div className="flex flex-wrap gap-2">
                {datePresets.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => handlePresetClick(preset.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                      filters.datePreset === preset.value
                        ? 'bg-accent/30 text-foreground shadow-sm'
                        : 'bg-muted/30 hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Date Range Inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-muted-foreground mb-1.5 block">Start Date</label>
                  <input
                    type="date"
                    value={filters.dateStart}
                    onChange={(e) => setFilters({ ...filters, dateStart: e.target.value, datePreset: '' })}
                    className="w-full px-3 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all shadow-sm hover:shadow-md cursor-pointer"
                    style={{
                      colorScheme: document.documentElement.classList.contains('dark') ? 'dark' : 'light'
                    }}
                  />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground mb-1.5 block">End Date</label>
                  <input
                    type="date"
                    value={filters.dateEnd}
                    onChange={(e) => setFilters({ ...filters, dateEnd: e.target.value, datePreset: '' })}
                    className="w-full px-3 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all shadow-sm hover:shadow-md cursor-pointer"
                    style={{
                      colorScheme: document.documentElement.classList.contains('dark') ? 'dark' : 'light'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-border bg-muted/20">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilters({
                  jobRole: '',
                  experienceRange: '',
                  interviewStage: '',
                  skills: [],
                  recruiter: '',
                  location: '',
                  availability: '',
                  education: '',
                  noticePeriod: '',
                  dateStart: '',
                  dateEnd: '',
                  datePreset: ''
                })}
                className="flex-1 px-4 py-2 text-sm bg-muted/50 hover:bg-muted rounded-lg transition-all duration-200"
              >
                Clear All
              </button>
              <button className="flex-1 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-md">
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}
