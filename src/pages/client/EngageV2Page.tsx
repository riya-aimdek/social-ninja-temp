import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search, Filter, Send, Sparkles, Smile, Meh, Frown, Image as ImageIcon,
  Instagram, Facebook, Linkedin, Twitter, MapPin, Clock, ThumbsUp,
  ExternalLink, Inbox, AlertTriangle, CheckCircle2, X, MessageSquare,
  KanbanSquare, ListTree, Shield, Shuffle, RefreshCw, ChevronDown,
  ArrowDownUp, AtSign, Mail, Star, Bot, Check, Trash2, MoreHorizontal,
  CornerDownLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

/* ──────────────────────────────────────────────────────────────
   Types & mock data — self-contained for /engage/v2
   ────────────────────────────────────────────────────────────── */

type Platform = "Instagram" | "Facebook" | "LinkedIn" | "Twitter" | "GBP";
type Sentiment = "positive" | "neutral" | "negative";
type Stage = "pending" | "in_review" | "replied";
type Channel = "comment" | "mention" | "dm" | "review";

interface PostCtx {
  id: string;
  platform: Platform;
  caption: string;
  publishedAt: string;
  /** Optional — some posts are text-only (e.g. tweets, GBP updates) */
  image?: string;
  totalComments: number;
}

interface Interaction {
  id: string;
  postId: string;
  author: string;
  avatar: string;
  text: string;
  at: string;
  sentiment: Sentiment;
  likes: number;
  stage: Stage;
  channel: Channel;
  aiDraft?: string;
}

const POSTS: PostCtx[] = [
  {
    id: "P-201", platform: "Instagram",
    caption: "🎉 Celebrating 5 years of building together! Thank you to every customer, partner, and teammate who made this milestone possible.",
    publishedAt: "2h ago", totalComments: 247,
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=70&auto=format&fit=crop",
  },
  {
    id: "P-200", platform: "GBP",
    caption: "Downtown location — new hours announcement. Starting next Monday we'll be open 7am–10pm, seven days a week.",
    publishedAt: "5h ago", totalComments: 128,
  },
  {
    id: "P-199", platform: "LinkedIn",
    caption: "We're hiring! Senior Brand Designer to join our growing creative team. Remote-friendly, competitive comp, real ownership.",
    publishedAt: "1d ago", totalComments: 64,
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=70&auto=format&fit=crop",
  },
  {
    id: "P-198", platform: "Twitter",
    caption: "Hot take: the best brand voice is the one that sounds like a real human wrote it on their lunch break. ☕",
    publishedAt: "1d ago", totalComments: 42,
  },
  {
    id: "P-197", platform: "Facebook",
    caption: "New spring drop is live 🌸 Limited run, ships worldwide. Tap the link to shop the collection.",
    publishedAt: "2d ago", totalComments: 89,
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=70&auto=format&fit=crop",
  },
];

const INTERACTIONS: Interaction[] = [
  { id: "I-1", postId: "P-201", author: "Sarah Johnson", avatar: "SJ", text: "Happy 5 years! 🎉 Wishing you many more!", at: "12m", sentiment: "positive", likes: 4, stage: "pending", channel: "comment", aiDraft: "Thank you so much, Sarah! 💛 Five years has flown by — couldn't have done it without supporters like you." },
  { id: "I-2", postId: "P-201", author: "Emma Wilson", avatar: "EW", text: "Congrats team! Been a customer since year 1 ❤️", at: "20m", sentiment: "positive", likes: 7, stage: "in_review", channel: "comment", aiDraft: "Emma, that means the world! 🥹 Loyal supporters like you are the reason we get to celebrate years like this." },
  { id: "I-3", postId: "P-200", author: "Marcus Reid", avatar: "MR", text: "Will the Sunday hours be the same? Hoping to swing by after church.", at: "1h", sentiment: "neutral", likes: 0, stage: "pending", channel: "review", aiDraft: "Hi Marcus! Yes — Sundays are 7am–10pm too. See you then ☕" },
  { id: "I-4", postId: "P-200", author: "Diane K.", avatar: "DK", text: "Finally! The old hours never worked for my schedule.", at: "2h", sentiment: "positive", likes: 2, stage: "pending", channel: "review" },
  { id: "I-5", postId: "P-199", author: "Priya Shah", avatar: "PS", text: "@brand just applied — really excited about this role!", at: "3h", sentiment: "positive", likes: 1, stage: "in_review", channel: "mention", aiDraft: "Priya, thanks for applying! Our team will review and reach out within a week." },
  { id: "I-6", postId: "P-198", author: "Tom L.", avatar: "TL", text: "Hard agree. The polished corporate voice is so dead.", at: "5h", sentiment: "positive", likes: 18, stage: "pending", channel: "comment" },
  { id: "I-7", postId: "P-198", author: "Anonymous", avatar: "A?", text: "Disagree — sometimes professionalism matters more than personality.", at: "6h", sentiment: "negative", likes: 3, stage: "pending", channel: "comment", aiDraft: "Totally fair point — context matters. We try to balance warmth with credibility." },
  { id: "I-8", postId: "P-197", author: "Hannah Becker", avatar: "HB", text: "Do you ship to Germany? 🌍", at: "8h", sentiment: "neutral", likes: 1, stage: "pending", channel: "dm", aiDraft: "Hi Hannah! Yes — we ship to 32 countries including Germany. Standard delivery is 5–7 days." },
  { id: "I-9", postId: "P-197", author: "Lila M.", avatar: "LM", text: "Obsessed with the floral print 😍 ordered already!", at: "10h", sentiment: "positive", likes: 5, stage: "replied", channel: "comment" },
];

/* ──────────────────────────────────────────────────────────────
   Tokens
   ────────────────────────────────────────────────────────────── */

const PlatformIcon = ({ name, className }: { name: Platform; className?: string }) => {
  const cls = cn("w-3.5 h-3.5", className);
  switch (name) {
    case "Instagram": return <Instagram className={cn(cls, "text-instagram")} />;
    case "Facebook": return <Facebook className={cn(cls, "text-facebook")} />;
    case "LinkedIn": return <Linkedin className={cn(cls, "text-linkedin")} />;
    case "Twitter": return <Twitter className={cn(cls, "text-twitter")} />;
    case "GBP": return <MapPin className={cn(cls, "text-warning")} />;
  }
};

const sentimentMeta: Record<Sentiment, { color: string; bg: string; Icon: typeof Smile; label: string }> = {
  positive: { color: "text-success", bg: "bg-success/10", Icon: Smile, label: "Positive" },
  neutral: { color: "text-muted-foreground", bg: "bg-muted", Icon: Meh, label: "Neutral" },
  negative: { color: "text-error", bg: "bg-error/10", Icon: Frown, label: "Negative" },
};

const stageMeta: Record<Stage, { label: string; cls: string }> = {
  pending: { label: "Pending", cls: "bg-info/15 text-info" },
  in_review: { label: "In review", cls: "bg-warning/15 text-warning" },
  replied: { label: "Replied", cls: "bg-success/15 text-success" },
};

const PLATFORMS: Platform[] = ["Instagram", "Facebook", "LinkedIn", "Twitter", "GBP"];

/* ──────────────────────────────────────────────────────────────
   PostContextCard — defining v2 element
   ────────────────────────────────────────────────────────────── */

function PostContextCard({ post, compact = false }: { post: PostCtx; compact?: boolean }) {
  const hasImage = Boolean(post.image);
  return (
    <div className="flex gap-3 p-2.5 rounded-lg border border-border bg-muted/30">
      {hasImage ? (
        <img
          src={post.image}
          alt=""
          className={cn(
            "rounded-md object-cover flex-shrink-0 border border-border",
            compact ? "w-11 h-11" : "w-16 h-16",
          )}
        />
      ) : (
        <div
          className={cn(
            "rounded-md flex-shrink-0 border border-border bg-background flex items-center justify-center",
            compact ? "w-11 h-11" : "w-16 h-16",
          )}
          aria-hidden
        >
          <ImageIcon className="w-5 h-5 text-muted-foreground/50" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-0.5">
          <PlatformIcon name={post.platform} />
          <span className="font-medium uppercase tracking-wide">Original post</span>
          <span>·</span>
          <Clock className="w-3 h-3" />
          <span>{post.publishedAt}</span>
        </div>
        <p className={cn(
          "text-xs text-foreground leading-snug",
          compact ? "line-clamp-2" : "line-clamp-3",
        )}>
          {post.caption}
        </p>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   InteractionRow — comment paired with a post-context chip
   ────────────────────────────────────────────────────────────── */

interface InteractionRowProps {
  interaction: Interaction;
  post: PostCtx;
  selected: boolean;
  showPostHeader: boolean; // first row in a post group renders the full context card
  onClick: () => void;
}

function InteractionRow({ interaction: i, post, selected, showPostHeader, onClick }: InteractionRowProps) {
  const SIcon = sentimentMeta[i.sentiment].Icon;
  return (
    <div>
      {showPostHeader && (
        <div className="px-3 pt-3 pb-2 sticky top-0 z-10 bg-card/95 backdrop-blur border-b border-border">
          <PostContextCard post={post} compact />
        </div>
      )}
      <button
        onClick={onClick}
        className={cn(
          "w-full text-left px-3 py-2.5 border-b border-border transition-colors flex gap-2.5",
          selected
            ? "bg-primary/5 border-l-2 border-l-primary"
            : "hover:bg-muted/40 border-l-2 border-l-transparent",
        )}
      >
        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-[11px] font-semibold flex items-center justify-center flex-shrink-0">
          {i.avatar}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-semibold text-foreground truncate">{i.author}</span>
            <span className="text-[11px] text-muted-foreground">{i.at}</span>
            <span className={cn("ml-auto px-1.5 py-0.5 rounded text-[10px] font-medium flex items-center gap-1", sentimentMeta[i.sentiment].bg, sentimentMeta[i.sentiment].color)}>
              <SIcon className="w-3 h-3" />
              {sentimentMeta[i.sentiment].label}
            </span>
          </div>
          <p className="text-sm text-foreground leading-snug line-clamp-2">{i.text}</p>
          <div className="flex items-center gap-2 mt-1.5 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> {i.likes}</span>
            <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-medium", stageMeta[i.stage].cls)}>
              {stageMeta[i.stage].label}
            </span>
            {i.aiDraft && (
              <span className="inline-flex items-center gap-1 text-primary">
                <Sparkles className="w-3 h-3" /> AI draft
              </span>
            )}
          </div>
        </div>
      </button>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   KPI strip (matches main Engage)
   ────────────────────────────────────────────────────────────── */

const KPIS = [
  { label: "Pending review", value: 33, Icon: MessageSquare, tone: "info" },
  { label: "Urgent", value: 6, Icon: AlertTriangle, tone: "error" },
  { label: "SLA breached", value: 8, Icon: Clock, tone: "warning" },
  { label: "Replied today", value: 146, Icon: CheckCircle2, tone: "success" },
  { label: "Spam filtered", value: 29, Icon: Shield, tone: "muted" },
] as const;

const toneStyles: Record<string, string> = {
  info: "bg-info/10 text-info",
  error: "bg-error/10 text-error",
  warning: "bg-warning/10 text-warning",
  success: "bg-success/10 text-success",
  muted: "bg-muted text-muted-foreground",
};

/* ──────────────────────────────────────────────────────────────
   Page
   ────────────────────────────────────────────────────────────── */

type PrimaryTab = "queue" | "board" | "threads" | "sentiment" | "spam" | "variants";
type CategoryTab = "all" | "comments" | "mentions" | "dms" | "reviews";

const PRIMARY_TABS: { id: PrimaryTab; label: string; Icon: typeof Inbox; count?: number }[] = [
  { id: "queue", label: "AI Reply Queue", Icon: Bot, count: 33 },
  { id: "board", label: "ORM Board", Icon: KanbanSquare },
  { id: "threads", label: "Comment Threads", Icon: ListTree },
  { id: "sentiment", label: "Sentiment Review", Icon: Smile },
  { id: "spam", label: "Spam Queue", Icon: Shield, count: 29 },
  { id: "variants", label: "Reply Variants", Icon: Shuffle },
];

const CATEGORY_TABS: { id: CategoryTab; label: string; Icon: typeof Inbox; count: number }[] = [
  { id: "all", label: "All", Icon: Inbox, count: 33 },
  { id: "comments", label: "Comments", Icon: MessageSquare, count: 33 },
  { id: "mentions", label: "Mentions", Icon: AtSign, count: 1 },
  { id: "dms", label: "DMs", Icon: Mail, count: 0 },
  { id: "reviews", label: "Reviews", Icon: Star, count: 7 },
];

export default function EngageV2Page() {
  const [primaryTab, setPrimaryTab] = useState<PrimaryTab>("queue");
  const [categoryTab, setCategoryTab] = useState<CategoryTab>("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string>(INTERACTIONS[0].id);
  const [reply, setReply] = useState("");
  const [sort, setSort] = useState<"recent" | "oldest" | "priority">("recent");
  const [activePlatforms, setActivePlatforms] = useState<Set<Platform>>(new Set(PLATFORMS));

  const postById = useMemo(() => {
    const m = new Map<string, PostCtx>();
    POSTS.forEach((p) => m.set(p.id, p));
    return m;
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = INTERACTIONS.filter((i) => {
      const post = postById.get(i.postId);
      if (!post || !activePlatforms.has(post.platform)) return false;
      if (categoryTab !== "all") {
        const map: Record<CategoryTab, Channel | null> = {
          all: null, comments: "comment", mentions: "mention", dms: "dm", reviews: "review",
        };
        if (map[categoryTab] && i.channel !== map[categoryTab]) return false;
      }
      if (primaryTab === "spam" && i.sentiment !== "negative") return false;
      if (primaryTab === "sentiment" && i.sentiment === "neutral") return false;
      if (q) {
        const hay = `${i.author} ${i.text} ${post.caption}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    if (sort === "oldest") list = [...list].reverse();
    return list;
  }, [query, postById, categoryTab, primaryTab, activePlatforms, sort]);

  const selected = filtered.find((i) => i.id === selectedId) ?? filtered[0];
  const selectedPost = selected ? postById.get(selected.postId) : undefined;

  const send = () => {
    if (!reply.trim()) return;
    toast.success("Reply sent");
    setReply("");
  };

  const allPlatformsOn = activePlatforms.size === PLATFORMS.length;

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">Engage</h1>
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-semibold uppercase tracking-wide">
              v2 · Context-first
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Every comment is paired with the original post — so you always know what you're replying to.
          </p>
        </div>
      </div>

      {/* KPI strip — matches V1 exactly */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {KPIS.map((k) => {
          const Icon = k.Icon;
          return (
            <div key={k.label} className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center justify-between">
                <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", toneStyles[k.tone])}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-2xl font-bold text-foreground tabular-nums">{k.value}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-2">{k.label}</div>
            </div>
          );
        })}
      </div>

      {/* Tabs row with platform filter + refresh — matches V1 */}
      <div className="flex items-end gap-3 border-b border-border flex-wrap">
        <div className="flex items-center gap-1 flex-wrap flex-1 min-w-0">
          {PRIMARY_TABS.map((t) => {
            const Icon = t.Icon;
            const active = primaryTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setPrimaryTab(t.id)}
                className={cn(
                  "px-4 py-2.5 text-xs font-medium flex items-center gap-1.5 border-b-2 -mb-px whitespace-nowrap transition-colors",
                  active
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="w-3.5 h-3.5" /> {t.label}
                {t.id === "spam" && (
                  <span className="ml-0.5 text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">{t.count}</span>
                )}
                {t.id === "queue" && (
                  <span className="ml-0.5 text-[10px] bg-primary/15 text-primary px-1.5 py-0.5 rounded-full font-semibold">{t.count}</span>
                )}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2 pb-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                <Filter className="w-3.5 h-3.5" />
                {allPlatformsOn ? "All platforms" : `${activePlatforms.size} platforms`}
                <span className="text-[10px] tabular-nums px-1.5 rounded-full bg-muted text-muted-foreground font-semibold">
                  {filtered.length}
                </span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Platforms</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {PLATFORMS.map((p) => (
                <DropdownMenuCheckboxItem
                  key={p}
                  checked={activePlatforms.has(p)}
                  onCheckedChange={(checked) => {
                    const next = new Set(activePlatforms);
                    if (checked) next.add(p); else next.delete(p);
                    if (next.size === 0) return;
                    setActivePlatforms(next);
                  }}
                >
                  <span className="inline-flex items-center gap-2">
                    <PlatformIcon name={p} />
                    {p}
                  </span>
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="sm" onClick={() => toast.success("Refreshed")} className="h-8 gap-1.5 text-xs">
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Inbox toolbar — matches V1 (hidden on Variants) */}
      {primaryTab !== "variants" && (
      <div className="bg-card rounded-xl border border-border p-2">
        <div className="flex items-center gap-1.5 flex-nowrap overflow-x-auto">
          {CATEGORY_TABS.map((c) => {
            const Icon = c.Icon;
            const active = categoryTab === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setCategoryTab(c.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 h-9 px-2.5 rounded-lg text-xs font-medium transition-colors shrink-0",
                  active
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {c.label}
                <span className={cn(
                  "text-[10px] tabular-nums px-1.5 rounded-full font-semibold",
                  active ? "bg-background/20" : "bg-muted text-muted-foreground",
                )}>
                  {c.count}
                </span>
              </button>
            );
          })}

          <div className="h-6 w-px bg-border mx-1 shrink-0" />

          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search comments, authors, keywords…"
              className="w-full pl-9 pr-8 h-10 rounded-lg bg-background border border-input shadow-sm text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground placeholder:font-normal transition-colors"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9 px-2 gap-1.5 shrink-0" title="Sort order">
                <ArrowDownUp className="w-3.5 h-3.5" />
                <span className="hidden md:inline text-xs">{sort === "recent" ? "Recent" : sort === "oldest" ? "Oldest" : "Priority"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => setSort("recent")} className="text-xs">Recent first</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSort("oldest")} className="text-xs">Oldest first</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSort("priority")} className="text-xs">Priority</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="sm" className="h-9 px-2 gap-1.5 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-xs">Filters</span>
          </Button>
        </div>
      </div>
      )}

      {/* Two-pane workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-4 h-[calc(100vh-440px)] min-h-[520px]">
        {/* List */}
        <div className="bg-card rounded-xl border border-border overflow-hidden flex flex-col">
          <div className="px-3 py-2 border-b border-border flex items-center justify-between text-xs text-muted-foreground bg-muted/30">
            <span className="font-medium">{filtered.length} interactions</span>
            <span className="capitalize">{sort === "recent" ? "Newest first" : sort === "oldest" ? "Oldest first" : "By priority"}</span>
          </div>
          <div className="overflow-y-auto flex-1">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No interactions match your filters.
              </div>
            ) : (
              filtered.map((i) => {
                const post = postById.get(i.postId);
                if (!post) return null;
                return (
                  <InteractionRow
                    key={i.id}
                    interaction={i}
                    post={post}
                    selected={selected?.id === i.id}
                    onClick={() => setSelectedId(i.id)}
                  />
                );
              })
            )}
          </div>
        </div>

        {/* Detail */}
        <div className="bg-card rounded-xl border border-border overflow-hidden flex flex-col">
          {selected && selectedPost ? (
            <>
              {/* Persistent post context — never scrolls away */}
              <div className="p-4 border-b border-border bg-muted/20">
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-muted-foreground font-semibold mb-2">
                  <PlatformIcon name={selectedPost.platform} />
                  Replying to your post on {selectedPost.platform}
                </div>
                <div className="flex gap-3">
                  {selectedPost.image ? (
                    <img src={selectedPost.image} alt="" className="w-24 h-24 rounded-lg object-cover border border-border flex-shrink-0" />
                  ) : (
                    <div className="w-24 h-24 rounded-lg border border-border bg-background flex items-center justify-center flex-shrink-0">
                      <ImageIcon className="w-7 h-7 text-muted-foreground/40" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-foreground leading-snug">{selectedPost.caption}</p>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />{selectedPost.publishedAt}</span>
                      <span>·</span>
                      <span>{selectedPost.totalComments} total comments</span>
                      <button className="ml-auto inline-flex items-center gap-1 text-primary hover:underline">
                        Open original <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comment thread */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 text-primary text-sm font-semibold flex items-center justify-center flex-shrink-0">
                    {selected.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-foreground">{selected.author}</span>
                      <span className="text-xs text-muted-foreground">{selected.at}</span>
                      <span className={cn("ml-auto px-2 py-0.5 rounded-full text-[10px] font-medium", stageMeta[selected.stage].cls)}>
                        {stageMeta[selected.stage].label}
                      </span>
                    </div>
                    <div className="bg-muted/50 rounded-2xl rounded-tl-sm px-4 py-3">
                      <p className="text-sm text-foreground">{selected.text}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> {selected.likes} likes</span>
                      <span className={cn("inline-flex items-center gap-1 px-1.5 py-0.5 rounded", sentimentMeta[selected.sentiment].bg, sentimentMeta[selected.sentiment].color)}>
                        <Sparkles className="w-3 h-3" />
                        {sentimentMeta[selected.sentiment].label} sentiment
                      </span>
                    </div>
                  </div>
                </div>

                {selected.aiDraft && (
                  <div className="ml-12 p-3 rounded-lg border border-dashed border-primary/30 bg-primary/5">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-primary uppercase tracking-wide mb-1">
                      <Sparkles className="w-3 h-3" /> AI suggested reply
                    </div>
                    <p className="text-sm text-foreground">{selected.aiDraft}</p>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setReply(selected.aiDraft!)}>
                        Use this draft
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 text-xs">Regenerate</Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Reply composer */}
              <div className="border-t border-border p-3 bg-card">
                <div className="flex gap-2 items-end">
                  <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder={`Reply to ${selected.author}…`}
                    rows={2}
                    className="flex-1 resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <Button onClick={send} disabled={!reply.trim()} className="gap-1.5">
                    <Send className="w-3.5 h-3.5" />
                    Send
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
              Select an interaction to view the conversation.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
