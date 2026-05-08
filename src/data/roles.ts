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
  "Connect",
  "Create",
  "Publish",
  "Approve",
  "Analyze",
  "Engage",
  "Listen",
  "Boost",
  "ORM",
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
    defaultPermissions: ["Connect", "Create", "Publish", "Approve", "Analyze", "Engage", "Listen", "Boost", "ORM"],
    tags: ["Full access"],
  },
  {
    id: "agency-account-manager",
    name: "Agency Account Manager",
    shortName: "Acct Mgr",
    scope: "agency",
    desc: "Day-to-day work across multiple clients. No billing or client deletion.",
    level: 90,
    defaultPermissions: ["Connect", "Create", "Publish", "Approve", "Analyze", "Engage", "Listen"],
  },

  // ─── Shared roles (appear in both agency and client scopes) ──
  {
    id: "business-admin",
    name: "Client Admin",
    shortName: "Client Admin",
    scope: "agency",
    desc: "Manages a client's projects, social accounts, and team members.",
    level: 70,
    defaultPermissions: ["Connect", "Create", "Publish", "Approve", "Analyze", "Engage", "Listen", "Boost"],
  },
  {
    id: "business-admin-local",
    name: "Business Admin",
    shortName: "Business Admin",
    scope: "client",
    desc: "Full control over this business account — team, projects, social accounts, and settings.",
    level: 70,
    defaultPermissions: ["Connect", "Create", "Publish", "Approve", "Analyze", "Engage", "Listen", "Boost"],
  },
  {
    id: "content-creator",
    name: "Content Creator",
    shortName: "Creator",
    scope: "either",
    desc: "Drafts posts but cannot publish. Works within assigned projects.",
    level: 40,
    defaultPermissions: ["Create", "Engage"],
  },
  {
    id: "social-media-manager",
    name: "Social Media Manager",
    shortName: "SMM",
    scope: "either",
    desc: "Drafts, schedules, and publishes posts. Views analytics.",
    level: 60,
    defaultPermissions: ["Connect", "Create", "Publish", "Analyze", "Engage", "Listen"],
  },
  {
    id: "approver",
    name: "Approver",
    shortName: "Approver",
    scope: "either",
    desc: "Reviews and approves posts before they go live.",
    level: 50,
    defaultPermissions: ["Approve", "Analyze"],
  },
  {
    id: "viewer",
    name: "Viewer",
    shortName: "Viewer",
    scope: "either",
    desc: "Read-only access to dashboards, posts, and analytics. Cannot create, edit, or publish.",
    level: 20,
    defaultPermissions: ["Analyze"],
    tags: ["Read-only"],
  },
  {
    id: "client",
    name: "Client",
    shortName: "Client",
    scope: "either",
    desc: "External client contact. Can review content, approve posts, and view reports.",
    level: 35,
    defaultPermissions: ["Approve", "Analyze"],
    tags: ["Client-facing"],
    postingMode: "scheduled",
  },
  {
    id: "orm",
    name: "ORM",
    shortName: "ORM",
    scope: "either",
    desc: "Monitors and responds to comments, reviews, and messages. Focused on online reputation management.",
    level: 55,
    defaultPermissions: ["Engage", "Listen", "ORM"],
    tags: ["ORM"],
  },

  // ─── Client-only extras ────────────────────────────────────
  {
    id: "client-immediate",
    name: "Client (Immediate)",
    shortName: "Client · Live",
    scope: "client",
    desc: "Client can publish instantly without scheduler — for events and real-time moments.",
    level: 38,
    defaultPermissions: ["Create", "Publish", "Analyze"],
    tags: ["Live posting"],
    postingMode: "immediate",
  },
  {
    id: "client-reviewer",
    name: "Client Reviewer",
    shortName: "Reviewer",
    scope: "client",
    desc: "Sees only their own posts. Can approve or reject and view basic analytics.",
    level: 25,
    defaultPermissions: ["Approve", "Analyze"],
    tags: ["Approval only", "Self-scoped"],
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
