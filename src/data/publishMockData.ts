export type PostStatus =
  | "draft"
  | "pending_approval"
  | "approved"
  | "rejected"
  | "scheduled"
  | "published"
  | "failed";

export type Platform = "instagram" | "facebook" | "linkedin" | "twitter" | "youtube" | "tiktok";

export interface AuditEvent {
  id: string;
  at: string; // ISO
  actor: string;
  actorRole: "agency" | "client-reviewer" | "client-live" | "orm" | "system";
  action: string;
  detail?: string;
}

export interface PostDraft {
  id: string;
  clientId: string;
  clientName: string;
  projectName: string;
  platforms: Platform[];
  caption: string;
  media: { type: "image" | "video"; url: string }[];
  scheduledFor: string; // ISO
  publishMode?: "scheduled" | "immediate"; // immediate = publish as soon as approved
  status: PostStatus;
  createdBy: string;
  createdAt: string;
  approvalToken: string; // used in /approve/:token public URL
  reviewers: string[];
  comments: { id: string; author: string; text: string; at: string }[];
  audit: AuditEvent[];
  rejectionReason?: string;
}

const today = new Date();
const iso = (daysFromNow: number, hour = 10, min = 0) => {
  const d = new Date(today);
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hour, min, 0, 0);
  return d.toISOString();
};

const img = (seed: string) => `https://picsum.photos/seed/${seed}/640/640`;

export const MOCK_POSTS: PostDraft[] = [
  {
    id: "p1",
    clientId: "retailco",
    clientName: "RetailCo",
    projectName: "Spring Launch",
    platforms: ["instagram", "facebook"],
    caption: "Spring drop is here 🌸 Discover the new pastel collection — limited time only. #SpringStyle #NewArrivals",
    media: [{ type: "image", url: img("spring1") }, { type: "image", url: img("spring2") }],
    scheduledFor: iso(2, 14, 0),
    status: "pending_approval",
    createdBy: "Priya Sharma",
    createdAt: iso(-1, 9, 30),
    approvalToken: "tok_spring_2026_a1",
    reviewers: ["client.lead@retailco.com"],
    comments: [
      { id: "c1", author: "Priya Sharma", text: "Hero shot uses the approved lifestyle imagery.", at: iso(-1, 9, 31) },
    ],
    audit: [
      { id: "a1", at: iso(-1, 9, 30), actor: "Priya Sharma", actorRole: "agency", action: "Created draft" },
      { id: "a2", at: iso(-1, 9, 35), actor: "Priya Sharma", actorRole: "agency", action: "Sent for approval", detail: "Notified 1 reviewer" },
    ],
  },
  {
    id: "p2",
    clientId: "retailco",
    clientName: "RetailCo",
    projectName: "Spring Launch",
    platforms: ["linkedin"],
    caption: "Behind the scenes: how our design team curated the Spring 2026 palette.",
    media: [{ type: "image", url: img("bts1") }],
    scheduledFor: iso(3, 9, 0),
    status: "approved",
    createdBy: "Priya Sharma",
    createdAt: iso(-2, 11, 0),
    approvalToken: "tok_bts_a2",
    reviewers: ["client.lead@retailco.com"],
    comments: [],
    audit: [
      { id: "a1", at: iso(-2, 11, 0), actor: "Priya Sharma", actorRole: "agency", action: "Created draft" },
      { id: "a2", at: iso(-2, 11, 5), actor: "Priya Sharma", actorRole: "agency", action: "Sent for approval" },
      { id: "a3", at: iso(-1, 16, 12), actor: "Anita Rao (Client)", actorRole: "client-reviewer", action: "Approved", detail: "Approved via public link" },
    ],
  },
  {
    id: "p3",
    clientId: "foodiehub",
    clientName: "FoodieHub",
    projectName: "Weekly Recipes",
    platforms: ["instagram", "tiktok"],
    caption: "30-second pasta hack you'll wish you knew sooner 🍝 Save for later!",
    media: [{ type: "video", url: img("pasta1") }],
    scheduledFor: iso(1, 18, 30),
    status: "rejected",
    createdBy: "Mike Torres",
    createdAt: iso(-1, 14, 0),
    approvalToken: "tok_pasta_a3",
    reviewers: ["chef@foodiehub.com"],
    rejectionReason: "Caption tone is too casual — please align with brand voice guide.",
    comments: [
      { id: "c1", author: "Chef Daniela", text: "Love the visual! Caption needs a rework — see brand voice doc §3.", at: iso(0, 8, 22) },
    ],
    audit: [
      { id: "a1", at: iso(-1, 14, 0), actor: "Mike Torres", actorRole: "agency", action: "Created draft" },
      { id: "a2", at: iso(-1, 14, 5), actor: "Mike Torres", actorRole: "agency", action: "Sent for approval" },
      { id: "a3", at: iso(0, 8, 22), actor: "Chef Daniela (Client)", actorRole: "client-reviewer", action: "Rejected", detail: "Caption tone is too casual" },
    ],
  },
  {
    id: "p4",
    clientId: "retailco",
    clientName: "RetailCo",
    projectName: "Spring Launch",
    platforms: ["instagram"],
    caption: "Customer love 💕 @sarah_styles wearing the Sunset Dress.",
    media: [{ type: "image", url: img("ugc1") }],
    scheduledFor: iso(5, 13, 0),
    status: "scheduled",
    createdBy: "Priya Sharma",
    createdAt: iso(-3, 10, 0),
    approvalToken: "tok_ugc_a4",
    reviewers: ["client.lead@retailco.com"],
    comments: [],
    audit: [
      { id: "a1", at: iso(-3, 10, 0), actor: "Priya Sharma", actorRole: "agency", action: "Created draft" },
      { id: "a2", at: iso(-3, 10, 2), actor: "Priya Sharma", actorRole: "agency", action: "Sent for approval" },
      { id: "a3", at: iso(-2, 9, 15), actor: "Anita Rao (Client)", actorRole: "client-reviewer", action: "Approved" },
      { id: "a4", at: iso(-2, 9, 16), actor: "System", actorRole: "system", action: "Scheduled", detail: "Queued for Mar 27, 1:00 PM" },
    ],
  },
  {
    id: "p5",
    clientId: "foodiehub",
    clientName: "FoodieHub",
    projectName: "Weekly Recipes",
    platforms: ["facebook", "instagram"],
    caption: "Sunday brunch goals 🥑🍳 Full recipe in bio.",
    media: [{ type: "image", url: img("brunch1") }],
    scheduledFor: iso(-1, 11, 0),
    status: "published",
    createdBy: "Mike Torres",
    createdAt: iso(-4, 9, 0),
    approvalToken: "tok_brunch_a5",
    reviewers: ["chef@foodiehub.com"],
    comments: [],
    audit: [
      { id: "a1", at: iso(-4, 9, 0), actor: "Mike Torres", actorRole: "agency", action: "Created draft" },
      { id: "a2", at: iso(-4, 9, 5), actor: "Mike Torres", actorRole: "agency", action: "Sent for approval" },
      { id: "a3", at: iso(-3, 10, 0), actor: "Chef Daniela (Client)", actorRole: "client-reviewer", action: "Approved" },
      { id: "a4", at: iso(-1, 11, 0), actor: "System", actorRole: "system", action: "Published", detail: "Published to Facebook + Instagram" },
    ],
  },
  {
    id: "p6",
    clientId: "retailco",
    clientName: "RetailCo",
    projectName: "Spring Launch",
    platforms: ["twitter"],
    caption: "Working draft — need to confirm offer code with marketing.",
    media: [],
    scheduledFor: iso(4, 12, 0),
    status: "draft",
    createdBy: "Priya Sharma",
    createdAt: iso(0, 8, 0),
    approvalToken: "tok_draft_a6",
    reviewers: [],
    comments: [],
    audit: [{ id: "a1", at: iso(0, 8, 0), actor: "Priya Sharma", actorRole: "agency", action: "Created draft" }],
  },
];

export const getPostByToken = (token: string) => MOCK_POSTS.find((p) => p.approvalToken === token);

export const STATUS_META: Record<PostStatus, { label: string; classes: string; dot: string }> = {
  draft: { label: "Draft", classes: "bg-muted text-muted-foreground", dot: "bg-muted-foreground" },
  pending_approval: { label: "Pending approval", classes: "bg-warning/15 text-warning", dot: "bg-warning" },
  approved: { label: "Approved", classes: "bg-success/15 text-success", dot: "bg-success" },
  rejected: { label: "Rejected", classes: "bg-error/15 text-error", dot: "bg-error" },
  scheduled: { label: "Scheduled", classes: "bg-info/15 text-info", dot: "bg-info" },
  published: { label: "Published", classes: "bg-success/15 text-success", dot: "bg-success" },
  failed: { label: "Failed", classes: "bg-error/15 text-error", dot: "bg-error" },
};

export const PLATFORM_META: Record<Platform, { label: string; color: string; bg: string }> = {
  instagram: { label: "Instagram", color: "text-instagram", bg: "bg-instagram" },
  facebook: { label: "Facebook", color: "text-facebook", bg: "bg-facebook" },
  linkedin: { label: "LinkedIn", color: "text-linkedin", bg: "bg-linkedin" },
  twitter: { label: "X", color: "text-twitter", bg: "bg-twitter" },
  youtube: { label: "YouTube", color: "text-youtube", bg: "bg-youtube" },
  tiktok: { label: "TikTok", color: "text-tiktok", bg: "bg-tiktok" },
};

export const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
};
