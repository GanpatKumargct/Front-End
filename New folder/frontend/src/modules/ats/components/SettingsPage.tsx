import { useState } from 'react';
import { mockRecruiters } from '@/shared/api/mocks/Recruiters';
import { departments } from '@/shared/api/mocks/Departments';
import {
  Users,
  Briefcase,
  Bell,
  Settings as SettingsIcon,
  Shield,
  Zap,
  ChevronRight,
  Check,
  Plus
} from 'lucide-react';

type SettingsTab = 'recruiters' | 'departments' | 'workflows' | 'notifications' | 'automation' | 'permissions';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('recruiters');

  const tabs = [
    { id: 'recruiters' as const, label: 'Recruiters & Team', icon: Users },
    { id: 'departments' as const, label: 'Departments', icon: Briefcase },
    { id: 'workflows' as const, label: 'Hiring Workflows', icon: SettingsIcon },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'automation' as const, label: 'Automation', icon: Zap },
    { id: 'permissions' as const, label: 'Permissions', icon: Shield },
  ];

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 border-r border-border bg-card/60 p-4">
        <h3 className="text-sm font-semibold mb-4 px-2">ATS Settings</h3>
        <nav className="space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-foreground/10 text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-foreground/[0.06]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {activeTab === tab.id && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'recruiters' && <RecruitersSettings />}
        {activeTab === 'departments' && <DepartmentsSettings />}
        {activeTab === 'workflows' && <WorkflowsSettings />}
        {activeTab === 'notifications' && <NotificationsSettings />}
        {activeTab === 'automation' && <AutomationSettings />}
        {activeTab === 'permissions' && <PermissionsSettings />}
      </div>
    </div>
  );
}

function RecruitersSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight mb-1">Recruiters & Team</h2>
        <p className="text-xs text-muted-foreground">Manage recruiter access and assignments</p>
      </div>

      <div className="space-y-3">
        {mockRecruiters.map((recruiter) => (
          <div
            key={recruiter.id}
            className="p-4 rounded-xl border border-border bg-card hover:bg-muted/20 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-muted/60 flex items-center justify-center text-sm font-semibold">
                  {recruiter.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">{recruiter.name}</h4>
                  <p className="text-xs text-muted-foreground capitalize">{recruiter.role.replace(/_/g, ' ')}</p>
                  <p className="text-xs text-muted-foreground">{recruiter.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Active Requisitions</p>
                  <p className="text-sm font-semibold">{recruiter.activeRequisitions}</p>
                </div>
                <div className={`w-2 h-2 rounded-full ${
                  recruiter.status === 'active' ? 'bg-green-500' :
                  recruiter.status === 'away' ? 'bg-amber-500' : 'bg-foreground/40'
                }`} />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border/50">
              <p className="text-xs text-muted-foreground mb-2">Assigned Departments:</p>
              <div className="flex flex-wrap gap-1.5">
                {recruiter.departments.map((dept) => (
                  <span
                    key={dept}
                    className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider bg-muted/50 text-muted-foreground"
                  >
                    {dept}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DepartmentsSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight mb-1">Departments</h2>
        <p className="text-xs text-muted-foreground">Configure department settings and hiring managers</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className="p-4 rounded-xl border border-border bg-card hover:bg-muted/20 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-widest bg-muted/50 text-muted-foreground mb-2">
                  {dept.code}
                </span>
                <h4 className="text-sm font-semibold text-foreground">{dept.name}</h4>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-muted-foreground">Open Roles</p>
                <p className="font-semibold">{dept.openRoles}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Candidates</p>
                <p className="font-semibold">{dept.candidates}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Pending</p>
                <p className="font-semibold">{dept.pendingApprovals}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WorkflowsSettings() {
  const workflows = [
    {
      name: 'Standard Engineering Hiring',
      stages: ['Screening', 'Fitment Evaluation', 'Technical Interview', 'PTC Interview', 'Founders Interview', 'Selected'],
      departments: ['AER', 'AVI', 'CFD', 'NGC', 'STR', 'SYS', 'TCA', 'TBM', 'MME'],
      active: true
    },
    {
      name: 'Business Functions Hiring',
      stages: ['Screening', 'Fitment Evaluation', 'Manager Interview', 'PTC Interview', 'Selected'],
      departments: ['ADM', 'BDL', 'FIN', 'LEG', 'PTC', 'OPS'],
      active: true
    },
    {
      name: 'Executive Hiring',
      stages: ['Screening', 'Panel Interview', 'Founders Interview', 'Board Review', 'Selected'],
      departments: ['EXO', 'FDR', 'FOO'],
      active: true
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold tracking-tight mb-1">Hiring Workflows</h2>
          <p className="text-xs text-muted-foreground">Configure interview stages and approval processes</p>
        </div>
        <button
          onClick={() => {/* TODO: workflow creation */}}
          className="px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Workflow
        </button>
      </div>

      <div className="space-y-3">
        {workflows.map((workflow, i) => (
          <div
            key={i}
            className="p-5 rounded-xl border border-border bg-card"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-1">{workflow.name}</h4>
                <p className="text-xs text-muted-foreground">{workflow.stages.length} stages</p>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                workflow.active ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'
              }`}>
                {workflow.active ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="mb-3">
              <p className="text-xs text-muted-foreground mb-2">Pipeline Stages:</p>
              <div className="flex items-center gap-2 flex-wrap">
                {workflow.stages.map((stage, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded-md text-[10px] font-medium bg-muted/40 text-foreground">
                      {stage}
                    </span>
                    {j < workflow.stages.length - 1 && (
                      <ChevronRight className="w-3 h-3 text-muted-foreground" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-border/50">
              <p className="text-xs text-muted-foreground mb-2">Applied to Departments:</p>
              <div className="flex flex-wrap gap-1.5">
                {workflow.departments.map((dept) => (
                  <span
                    key={dept}
                    className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider bg-muted/50 text-muted-foreground"
                  >
                    {dept}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotificationsSettings() {
  const notificationSettings = [
    { label: 'New Application Received', description: 'Notify recruiter when new candidate applies', enabled: true },
    { label: 'Interview Scheduled', description: 'Send confirmation to candidate and interviewers', enabled: true },
    { label: 'Feedback Reminder', description: 'Remind interviewers to submit feedback after 24 hours', enabled: true },
    { label: 'Candidate Status Change', description: 'Notify hiring manager of pipeline movements', enabled: true },
    { label: 'Requisition Aging Alert', description: 'Alert when requisition exceeds 90 days', enabled: true },
    { label: 'Weekly Pipeline Summary', description: 'Send weekly summary to all recruiters', enabled: false },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight mb-1">Notifications</h2>
        <p className="text-xs text-muted-foreground">Configure email and system notifications</p>
      </div>

      <div className="space-y-2">
        {notificationSettings.map((setting, i) => (
          <div
            key={i}
            className="p-4 rounded-xl border border-border bg-card hover:bg-muted/20 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-foreground mb-0.5">{setting.label}</h4>
                <p className="text-xs text-muted-foreground">{setting.description}</p>
              </div>
              <button
                className={`w-12 h-6 rounded-full transition-colors ${
                  setting.enabled ? 'bg-green-500' : 'bg-muted'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                  setting.enabled ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AutomationSettings() {
  const automations = [
    { label: 'Auto-screen applications', description: 'Automatically move candidates with 5+ years experience to Fitment stage', enabled: false },
    { label: 'Smart candidate matching', description: 'Suggest candidates from other requisitions based on skills', enabled: true },
    { label: 'Interview scheduling assistant', description: 'Auto-suggest meeting times based on availability', enabled: true },
    { label: 'Requisition expiry', description: 'Automatically close requisitions after 120 days', enabled: false },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight mb-1">Automation</h2>
        <p className="text-xs text-muted-foreground">Configure automated ATS workflows and actions</p>
      </div>

      <div className="space-y-2">
        {automations.map((automation, i) => (
          <div
            key={i}
            className="p-4 rounded-xl border border-border bg-card hover:bg-muted/20 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-foreground mb-0.5">{automation.label}</h4>
                <p className="text-xs text-muted-foreground">{automation.description}</p>
              </div>
              <button
                className={`w-12 h-6 rounded-full transition-colors ${
                  automation.enabled ? 'bg-green-500' : 'bg-muted'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                  automation.enabled ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PermissionsSettings() {
  const roles = [
    {
      name: 'HR Director',
      permissions: ['Full system access', 'Manage users', 'Configure workflows', 'View all departments', 'Approve offers'],
      users: ['Rohan Okafor']
    },
    {
      name: 'Senior Recruiter',
      permissions: ['Manage candidates', 'Schedule interviews', 'View assigned departments', 'Create requisitions'],
      users: ['Priya Sharma', 'Marcus Johnson']
    },
    {
      name: 'Recruiter',
      permissions: ['View candidates', 'Schedule interviews', 'View assigned departments'],
      users: ['Sarah Chen', 'David Okonkwo']
    },
    {
      name: 'Hiring Manager',
      permissions: ['View department candidates', 'Provide interview feedback', 'Approve candidates'],
      users: ['All department heads']
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold tracking-tight mb-1">Permissions & Roles</h2>
          <p className="text-xs text-muted-foreground">Configure role-based access control</p>
        </div>
        <button
          onClick={() => {/* TODO: permission creation */}}
          className="px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Permission
        </button>
      </div>

      <div className="space-y-3">
        {roles.map((role, i) => (
          <div
            key={i}
            className="p-5 rounded-xl border border-border bg-card"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-1">{role.name}</h4>
                <p className="text-xs text-muted-foreground">
                  {role.users.length === 1 ? role.users[0] : `${role.users.length} users`}
                </p>
              </div>
              <Shield className="w-4 h-4 text-muted-foreground" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-2">Permissions:</p>
              <div className="space-y-1.5">
                {role.permissions.map((permission, j) => (
                  <div key={j} className="flex items-center gap-2 text-xs">
                    <Check className="w-3 h-3 text-green-500" />
                    <span className="text-foreground">{permission}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
