/**
 * Shared mock data for the Business module.
 * Every Business-side page pulls from here so numbers stay in sync.
 */

// ── Team Members ──────────────────────────────────────────────
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  roleId: string;
  permissions: string[];
  status: "active" | "invited";
  avatar: string;
  lastActive: string;
  projects: number;
}

export const teamMembers: TeamMember[] = [
  { id: "u1", name: "John Smith", email: "john@business.com", role: "Business Admin", roleId: "business-admin", permissions: ["Engage", "Listen", "Boost", "Analyze"], status: "active", avatar: "JS", lastActive: "Online", projects: 3 },
  { id: "u2", name: "Emily Davis", email: "emily@business.com", role: "Content Creator", roleId: "content-creator", permissions: ["Engage"], status: "active", avatar: "ED", lastActive: "2h ago", projects: 2 },
  { id: "u3", name: "Mike Wilson", email: "mike@business.com", role: "Approver", roleId: "approver", permissions: ["Analyze"], status: "active", avatar: "MW", lastActive: "5h ago", projects: 1 },
  { id: "u4", name: "Lisa Chen", email: "lisa@business.com", role: "Social Media Manager", roleId: "social-media-manager", permissions: ["Engage", "Listen", "Boost", "Analyze"], status: "invited", avatar: "LC", lastActive: "Invited", projects: 0 },
  { id: "u5", name: "Sarah Park", email: "sarah@business.com", role: "Content Creator", roleId: "content-creator", permissions: ["Engage"], status: "active", avatar: "SP", lastActive: "1d ago", projects: 2 },
  { id: "u6", name: "David Lee", email: "david@business.com", role: "Social Media Manager", roleId: "social-media-manager", permissions: ["Engage", "Listen", "Boost", "Analyze"], status: "active", avatar: "DL", lastActive: "3h ago", projects: 3 },
];

// ── Projects ──────────────────────────────────────────────────
export interface Project {
  id: string;
  name: string;
  status: "Active" | "Inactive";
  created: string;
  posts: number;
  accounts: number;
  members: number;
  lastActive: string;
  description: string;
}

export const projects: Project[] = [
  { id: "p1", name: "Social Campaign", status: "Active", created: "Jan 12, 2026", posts: 142, accounts: 4, members: 3, lastActive: "2h ago", description: "Main social media campaign across all platforms" },
  { id: "p2", name: "Website Redesign", status: "Active", created: "Feb 3, 2026", posts: 67, accounts: 2, members: 2, lastActive: "1d ago", description: "Content for the new website launch" },
  { id: "p3", name: "Brand Launch", status: "Active", created: "Mar 15, 2026", posts: 23, accounts: 3, members: 4, lastActive: "3h ago", description: "New brand identity rollout on social channels" },
  { id: "p4", name: "Holiday Promo", status: "Inactive", created: "Dec 1, 2025", posts: 89, accounts: 3, members: 2, lastActive: "2mo ago", description: "Seasonal holiday promotional content" },
  { id: "p5", name: "Product Launch Q1", status: "Inactive", created: "Nov 20, 2025", posts: 54, accounts: 2, members: 3, lastActive: "3mo ago", description: "Q1 product launch social strategy" },
];

// ── Connected Social Accounts ─────────────────────────────────
export interface SocialAccount {
  name: string;
  connected: boolean;
  profile: string;
  lastSync: string;
}

export const socialAccounts: SocialAccount[] = [
  { name: "Facebook", connected: true, profile: "Acme Business Page", lastSync: "2 min ago" },
  { name: "Instagram", connected: true, profile: "@acmebusiness", lastSync: "5 min ago" },
  { name: "LinkedIn", connected: true, profile: "Acme Business Inc.", lastSync: "10 min ago" },
  { name: "Twitter / X", connected: false, profile: "", lastSync: "" },
  { name: "Pinterest", connected: false, profile: "", lastSync: "" },
  { name: "YouTube", connected: false, profile: "", lastSync: "" },
  { name: "Shopify", connected: false, profile: "", lastSync: "" },
];

// ── Derived stats (computed once, reusable) ───────────────────
export const activeProjects = projects.filter(p => p.status === "Active");
export const inactiveProjects = projects.filter(p => p.status === "Inactive");
export const totalPosts = projects.reduce((sum, p) => sum + p.posts, 0);
export const connectedAccounts = socialAccounts.filter(a => a.connected);
export const activeMembers = teamMembers.filter(m => m.status === "active");
export const invitedMembers = teamMembers.filter(m => m.status === "invited");

// ── Activity feed ─────────────────────────────────────────────
export const activities = [
  { time: "2h ago", text: "Emily Davis published 3 posts to Instagram for Social Campaign", dot: "bg-emerald-500" },
  { time: "5h ago", text: "Mike Wilson approved the weekly content batch", dot: "bg-blue-500" },
  { time: "1d ago", text: "New project 'Brand Launch' was created", dot: "bg-primary" },
  { time: "1d ago", text: "Sarah Park drafted 5 posts for Website Redesign", dot: "bg-violet-500" },
  { time: "2d ago", text: "Lisa Chen was invited to join the team", dot: "bg-amber-500" },
  { time: "3d ago", text: "David Lee connected the LinkedIn account", dot: "bg-sky-500" },
];

// ── Permission + Role helpers ─────────────────────────────────
export const permissionList = ["Engage", "Listen", "Boost", "Analyze"] as const;

export const defaultPermissions: Record<string, string[]> = {
  "business-admin": ["Engage", "Listen", "Boost", "Analyze"],
  "content-creator": ["Engage"],
  "approver": ["Analyze"],
  "social-media-manager": ["Engage", "Listen", "Boost", "Analyze"],
};

export const permissionColors: Record<string, string> = {
  Engage: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  Listen: "bg-blue-500/10 text-blue-700 border-blue-200",
  Boost: "bg-primary/10 text-primary border-primary/20",
  Analyze: "bg-violet-500/10 text-violet-700 border-violet-200",
};

export const roleCards = [
  { id: "business-admin", name: "Business Admin", desc: "Manages one business's projects. Creates projects, adds social accounts, and invites business team members." },
  { id: "content-creator", name: "Content Creator", desc: 'Can draft posts for specific social accounts within a project but cannot hit "Publish".' },
  { id: "approver", name: "Approver", desc: "Usually a contact at the business. Can log in to see their specific project to review and approve posts." },
  { id: "social-media-manager", name: "Social Media Manager", desc: "Can draft, schedule, and publish posts, and view analytics for their specific project." },
];
