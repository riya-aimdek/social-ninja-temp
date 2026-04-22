/**
 * Single source of truth for roles & permissions.
 * Used by RoleBadge, team management screens, and onboarding.
 */

export type RoleScope = "agency" | "client" | "either";
export type PostingMode = "scheduled" | "immediate" | "both";

export interface RoleDef {
  id: string;
  name: string;
  shortName: string;
  scope: RoleScope;
  desc: string;
  /** Higher = more powerful. Used for sorting in pickers. */
  level: number;
  /** Default permissions granted at creation. */
  defaultPermissions: string[];
  /** Tag chips shown on role cards (e.g. "ORM", "Read-only"). */
  tags?: string[];
  /** For Client roles only — which posting mode they have. */
  postingMode?: PostingMode;
  /** Whether this role can ONLY see resources scoped to themselves. */
  selfScopedOnly?: boolean;
}

export const PERMISSIONS = [
  "Engage",
  "Listen",
  "Boost",
  "Analyze",
  "ORM",
  "Approve",
  "Publish",
] as const;
export type Permission = (typeof PERMISSIONS)[number];

/** All roles available across the platform. */
export const ROLES: RoleDef[] = [
  // ─── Agency-level ──────────────────────────────────────────
  {
    id: "agency-admin",
    name: "Agency Admin",
    shortName: "Admin",
    scope: "agency",
    desc: "Full control. Creates clients, manages billing, and accesses everything across the agency.",
    level: 100,
    defaultPermissions: ["Engage", "Listen", "Boost", "Analyze", "ORM", "Approve", "Publish"],
    tags: ["Full access"],
  },
  {
    id: "agency-account-manager",
    name: "Account Manager",
    shortName: "Acct Mgr",
    scope: "agency",
    desc: "Day-to-day work across multiple clients. No billing or client deletion.",
    level: 80,
    defaultPermissions: ["Engage", "Listen", "Analyze", "Approve", "Publish"],
  },

  // ─── Client (project) team ─────────────────────────────────
  {
    id: "business-admin",
    name: "Client Admin",
    shortName: "Client Admin",
    scope: "client",
    desc: "Manages one client's projects, social accounts, and team.",
    level: 70,
    defaultPermissions: ["Engage", "Listen", "Boost", "Analyze", "Approve", "Publish"],
  },
  {
    id: "social-media-manager",
    name: "Social Media Manager",
    shortName: "SMM",
    scope: "client",
    desc: "Drafts, schedules, and publishes posts. Views analytics for the project.",
    level: 60,
    defaultPermissions: ["Engage", "Listen", "Analyze", "Publish"],
  },
  {
    id: "content-creator",
    name: "Content Creator",
    shortName: "Creator",
    scope: "client",
    desc: 'Drafts posts within a project but cannot hit "Publish".',
    level: 40,
    defaultPermissions: ["Engage"],
  },
  {
    id: "approver",
    name: "Approver",
    shortName: "Approver",
    scope: "client",
    desc: "Reviews and approves posts. Typically the client contact.",
    level: 50,
    defaultPermissions: ["Approve", "Analyze"],
  },

  // ─── New: ORM ──────────────────────────────────────────────
  {
    id: "orm",
    name: "ORM Specialist",
    shortName: "ORM",
    scope: "either",
    desc: "Monitors and replies to comments, reviews, and messages — especially Google Business. Billing tied to assigned account count.",
    level: 55,
    defaultPermissions: ["Engage", "ORM", "Listen"],
    tags: ["New", "ORM"],
  },

  // ─── New: read-only Normal User ────────────────────────────
  {
    id: "normal-user",
    name: "Normal User",
    shortName: "Read-only",
    scope: "either",
    desc: "Read-only stakeholder access — dashboards, posts, analytics. Cannot create, edit, approve, or publish.",
    level: 20,
    defaultPermissions: ["Analyze"],
    tags: ["Read-only"],
  },

  // ─── Client direct posting modes ───────────────────────────
  {
    id: "client-scheduled",
    name: "Client (Scheduled)",
    shortName: "Client · Scheduled",
    scope: "client",
    desc: "Client posts go through the approval workflow + calendar. Safe default for most clients.",
    level: 35,
    defaultPermissions: ["Approve", "Analyze"],
    tags: ["Approval flow"],
    postingMode: "scheduled",
  },
  {
    id: "client-immediate",
    name: "Client (Immediate)",
    shortName: "Client · Live",
    scope: "client",
    desc: "Client can publish instantly without scheduler — for events and real-time moments.",
    level: 38,
    defaultPermissions: ["Publish", "Analyze"],
    tags: ["Live posting"],
    postingMode: "immediate",
  },

  // ─── New: Client Reviewer (approval-only view) ─────────────
  {
    id: "client-reviewer",
    name: "Client Reviewer",
    shortName: "Reviewer",
    scope: "client",
    desc: "Sees only their own posts. Can approve or reject and view basic analytics. Nothing else.",
    level: 25,
    defaultPermissions: ["Approve", "Analyze"],
    tags: ["New", "Approval only", "Self-scoped"],
    selfScopedOnly: true,
  },

  // ─── Generic guest ──────────────────────────────────────────
  {
    id: "guest",
    name: "Guest",
    shortName: "Guest",
    scope: "either",
    desc: "Limited preview access. No edits.",
    level: 10,
    defaultPermissions: [],
  },
];

export const getRole = (id: string): RoleDef | undefined =>
  ROLES.find((r) => r.id === id);

export const rolesForScope = (scope: "agency" | "client"): RoleDef[] =>
  ROLES.filter((r) => r.scope === scope || r.scope === "either").sort(
    (a, b) => b.level - a.level,
  );

export const defaultPermissionsFor = (id: string): string[] =>
  getRole(id)?.defaultPermissions || [];
