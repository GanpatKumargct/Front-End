import {
  Home,
  Briefcase,
  Users,
  CalendarDays,
  BarChart3,
  Settings
} from "lucide-react";

export const PIPELINE_STATUSES = [
  "Screening",
  "Fitment Evaluation",
  "Technical Interview",
  "PTC Interview",
  "Founder's Interview",
  "Selected",
  "Rejected"
];

export const SIDEBAR_ITEMS = [
  { icon: Home, label: "Dashboard", tab: "dashboard" },
  { icon: Briefcase, label: "Jobs", tab: "jobs" },
  { icon: Users, label: "Candidates", tab: "candidates" },
  { icon: CalendarDays, label: "Interviews", tab: "interviews" },
  { icon: BarChart3, label: "Analytics", tab: "analytics" },
  { icon: Settings, label: "Settings", tab: "settings" }
];
