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
  postType?: "post" | "reel" | "carousel"; // content format
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
    postType: "carousel",
    status: "pending_approval",
    publishMode: "immediate",
    createdBy: "Priya Sharma",
    createdAt: iso(-1, 9, 30),
    approvalToken: "tok_spring_2026_a1",
    reviewers: ["client.lead@retailco.com"],
    comments: [
      { id: "c1", author: "Priya Sharma", text: "Hero shot uses the approved lifestyle imagery.", at: iso(-1, 9, 31) },
    ],
    audit: [
      { id: "a1", at: iso(-3, 9, 30), actor: "Priya Sharma", actorRole: "agency", action: "Created draft" },
      { id: "a2", at: iso(-3, 9, 35), actor: "Priya Sharma", actorRole: "agency", action: "Sent for approval", detail: "Notified 1 reviewer" },
      { id: "a3", at: iso(-2, 15, 10), actor: "Anita Rao (Client)", actorRole: "client-reviewer", action: "Rejected", detail: "Please use a brighter hero image and reduce hashtags" },
      { id: "a4", at: iso(-1, 9, 30), actor: "Priya Sharma", actorRole: "agency", action: "Edited & resubmitted", detail: "Swapped hero image, trimmed hashtags, updated caption tone" },
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
      { id: "a1", at: iso(-2, 11, 0),  actor: "Priya Sharma",          actorRole: "agency",           action: "Created draft" },
      { id: "a2", at: iso(-2, 11, 5),  actor: "Priya Sharma",          actorRole: "agency",           action: "Sent for approval", detail: "Notified 1 reviewer" },
      { id: "a3", at: iso(-1, 16, 12), actor: "Anita Rao (Client)",    actorRole: "client-reviewer",  action: "Approved", detail: "Approved via public link" },
      { id: "a4", at: iso(-1, 16, 13), actor: "System",                actorRole: "system",           action: "Scheduled", detail: "Queued for scheduled time" },
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
    postType: "reel",
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
      { id: "a1", at: iso(-3, 14, 0),  actor: "Mike Torres",            actorRole: "agency",            action: "Created draft" },
      { id: "a2", at: iso(-3, 14, 5),  actor: "Mike Torres",            actorRole: "agency",            action: "Sent for approval" },
      { id: "a3", at: iso(-2, 8, 22),  actor: "Chef Daniela (Client)",  actorRole: "client-reviewer",   action: "Rejected", detail: "Caption tone is too casual — see brand voice guide §3" },
      { id: "a4", at: iso(-1, 10, 0),  actor: "Mike Torres",            actorRole: "agency",            action: "Edited & resubmitted", detail: "Rewrote caption with formal tone; kept the hook" },
      { id: "a5", at: iso(0, 8, 22),   actor: "Chef Daniela (Client)",  actorRole: "client-reviewer",   action: "Rejected", detail: "Still doesn't align with brand voice — needs more warmth" },
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
      { id: "a1", at: iso(-5, 10, 0),  actor: "Priya Sharma",          actorRole: "agency",          action: "Created draft" },
      { id: "a2", at: iso(-5, 10, 2),  actor: "Priya Sharma",          actorRole: "agency",          action: "Sent for approval", detail: "Notified client.lead@retailco.com" },
      { id: "a3", at: iso(-4, 14, 30), actor: "Anita Rao (Client)",    actorRole: "client-reviewer", action: "Rejected", detail: "Caption feels generic — add UGC credit" },
      { id: "a4", at: iso(-3, 9, 10),  actor: "Priya Sharma",          actorRole: "agency",          action: "Edited & resubmitted", detail: "Added @mention and updated caption" },
      { id: "a5", at: iso(-2, 9, 15),  actor: "Anita Rao (Client)",    actorRole: "client-reviewer", action: "Approved" },
      { id: "a6", at: iso(-2, 9, 16),  actor: "System",                actorRole: "system",          action: "Scheduled", detail: "Queued for Mar 27, 1:00 PM" },
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
      { id: "a1", at: iso(-6, 9, 0),  actor: "Mike Torres",           actorRole: "agency",          action: "Created draft" },
      { id: "a2", at: iso(-6, 9, 5),  actor: "Mike Torres",           actorRole: "agency",          action: "Sent for approval", detail: "Notified chef@foodiehub.com" },
      { id: "a3", at: iso(-5, 11, 0), actor: "Chef Daniela (Client)", actorRole: "client-reviewer", action: "Rejected", detail: "Needs a video, not a static image" },
      { id: "a4", at: iso(-4, 10, 0), actor: "Mike Torres",           actorRole: "agency",          action: "Edited & resubmitted", detail: "Replaced image with video, updated caption" },
      { id: "a5", at: iso(-3, 10, 0), actor: "Chef Daniela (Client)", actorRole: "client-reviewer", action: "Approved" },
      { id: "a6", at: iso(-3, 10, 1), actor: "System",                actorRole: "system",          action: "Scheduled", detail: "Queued for publish" },
      { id: "a7", at: iso(-1, 11, 0), actor: "System",                actorRole: "system",          action: "Published", detail: "Published to Facebook + Instagram" },
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
    audit: [
      { id: "a1", at: iso(0, 8, 0),  actor: "Priya Sharma", actorRole: "agency", action: "Created draft" },
      { id: "a2", at: iso(0, 8, 45), actor: "Priya Sharma", actorRole: "agency", action: "Edited & resubmitted", detail: "Revised caption, waiting on offer code confirmation" },
    ],
  },
];

// ---- Extra sample posts spread across the current month to populate the calendar ----
const _now = new Date();
const _yr = _now.getFullYear();
const _mo = _now.getMonth();
const _isoOn = (day: number, hour = 10, min = 0) =>
  new Date(_yr, _mo, day, hour, min, 0, 0).toISOString();

const _extra: Array<{
  day: number; hour?: number; status: PostStatus; client: string; project: string;
  platforms: Platform[]; caption: string; seed: string;
}> = [
  { day: 2,  hour: 9,  status: "published",        client: "FoodieHub", project: "Weekly Recipes", platforms: ["instagram"],            caption: "Mood: Monday matcha ☕✨",                          seed: "matcha" },
  { day: 4,  hour: 15, status: "published",        client: "RetailCo",  project: "Spring Launch",  platforms: ["facebook", "instagram"],caption: "Recap: our Spring preview event in 30 seconds.", seed: "recap"  },
  { day: 6,  hour: 11, status: "published",        client: "RetailCo",  project: "Spring Launch",  platforms: ["instagram"],            caption: "Top 3 looks from this week's drop 👗",            seed: "looks"  },
  { day: 8,  hour: 18, status: "scheduled",        client: "FoodieHub", project: "Weekly Recipes", platforms: ["tiktok"],               caption: "60-second weeknight curry 🌶️",                  seed: "curry"  },
  { day: 10, hour: 13, status: "scheduled",        client: "RetailCo",  project: "Spring Launch",  platforms: ["linkedin"],             caption: "How we built the Spring 2026 lookbook.",         seed: "lookbk" },
  { day: 12, hour: 17, status: "scheduled",        client: "FoodieHub", project: "Weekly Recipes", platforms: ["instagram"],            caption: "Pantry essentials checklist ✅",                  seed: "pantry" },
  { day: 14, hour: 10, status: "scheduled",        client: "RetailCo",  project: "Spring Launch",  platforms: ["instagram", "facebook"],caption: "Weekend sale teaser — 48 hours only ⏰",         seed: "sale"   },
  { day: 16, hour: 12, status: "pending_approval", client: "RetailCo",  project: "Spring Launch",  platforms: ["instagram"],            caption: "New arrivals carousel — please review.",         seed: "newarr" },
  { day: 18, hour: 14, status: "pending_approval", client: "FoodieHub", project: "Weekly Recipes", platforms: ["facebook"],             caption: "Recipe of the week: lemon herb chicken.",        seed: "lemon"  },
  { day: 20, hour: 9,  status: "scheduled",        client: "FoodieHub", project: "Weekly Recipes", platforms: ["instagram"],            caption: "Brunch board inspiration 🥐🍓",                  seed: "board"  },
  { day: 22, hour: 16, status: "scheduled",        client: "RetailCo",  project: "Spring Launch",  platforms: ["twitter"],              caption: "Quick poll: which color drops next? 🎨",          seed: "poll"   },
  { day: 24, hour: 11, status: "rejected",         client: "FoodieHub", project: "Weekly Recipes", platforms: ["tiktok"],               caption: "Trend remix attempt — needs rework.",            seed: "trend"  },
  { day: 26, hour: 19, status: "scheduled",        client: "RetailCo",  project: "Spring Launch",  platforms: ["instagram"],            caption: "Customer spotlight 💫 @maya.styled",              seed: "spot"   },
  { day: 28, hour: 10, status: "published",        client: "FoodieHub", project: "Weekly Recipes", platforms: ["instagram", "facebook"],caption: "Sunday loaf — sourdough win 🍞",                 seed: "loaf"   },
];

_extra.forEach((e, idx) => {
  const id = `pe${idx + 1}`;
  MOCK_POSTS.push({
    id,
    clientId: e.client.toLowerCase(),
    clientName: e.client,
    projectName: e.project,
    platforms: e.platforms,
    caption: e.caption,
    media: [{ type: "image", url: img(e.seed) }],
    scheduledFor: _isoOn(e.day, e.hour ?? 10, 0),
    status: e.status,
    createdBy: "Priya Sharma",
    createdAt: _isoOn(Math.max(1, e.day - 1), 9, 0),
    approvalToken: `tok_${id}`,
    reviewers: ["client.lead@example.com"],
    comments: [],
    audit: [
      { id: "a1", at: _isoOn(Math.max(1, e.day - 1), 9, 0), actor: "Priya Sharma", actorRole: "agency", action: "Created draft" },
    ],
  });
});

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
