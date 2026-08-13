// Pipeline stage config for the project kanban/list dashboard. Mirrors the
// frontend constant that used to live at src/features/projects/stages.ts.
export const PROJECT_STAGES = [
  { id: "new", title: "New", color: "#EF4444", avgDays: 6 },
  { id: "proposal-req", title: "Proposal Req", color: "#F59E0B", avgDays: 6 },
  { id: "design", title: "Design", color: "#3B82F6", avgDays: 6 },
  { id: "design-hold", title: "Design Hold", color: "#8B5CF6", avgDays: 9 },
  { id: "permitting", title: "Permitting", color: "#12B968", avgDays: 12 },
  { id: "install-scheduled", title: "Install Scheduled", color: "#0EA5E9", avgDays: 7 },
  { id: "site-survey", title: "Site Survey", color: "#14B8A6", avgDays: 4 },
  { id: "ntp", title: "NTP", color: "#6366F1", avgDays: 5 },
  { id: "financing", title: "Financing", color: "#EC4899", avgDays: 10 },
  { id: "onboarding", title: "Onboarding", color: "#F97316", avgDays: 3 },
  { id: "closed", title: "Closed", color: "#64748B", avgDays: 0 },
  { id: "cancelled", title: "Cancelled", color: "#94A3B8", avgDays: 0 },
  { id: "archived", title: "Archived", color: "#A8A29E", avgDays: 0 },
];
