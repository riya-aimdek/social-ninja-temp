import { useMemo, useState } from "react";
import {
  Search, Filter, Send, Sparkles, Smile, Meh, Frown, Image as ImageIcon,
  Instagram, Facebook, Linkedin, Twitter, MapPin, Clock, ThumbsUp,
  ChevronRight, ExternalLink, Inbox, AlertTriangle, CheckCircle2, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

/* ──────────────────────────────────────────────────────────────
   Types & mock data — self-contained for /engage/v2
   ────────────────────────────────────────────────────────────── */

type Platform = "Instagram" | "Facebook" | "LinkedIn" | "Twitter" | "GBP";
type Sentiment = "positive" | "neutral" | "negative";
type Stage = "pending" | "in_review" | "replied";

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
  { id: "I-1", postId: "P-201", author: "Sarah Johnson", avatar: "SJ", text: "Happy 5 years! 🎉 Wishing you many more!", at: "12m", sentiment: "positive", likes: 4, stage: "pending", aiDraft: "Thank you so much, Sarah! 💛 Five years has flown by — couldn't have done it without supporters like you." },
  { id: "I-2", postId: "P-201", author: "Emma Wilson", avatar: "EW", text: "Congrats team! Been a customer since year 1 ❤️", at: "20m", sentiment: "positive", likes: 7, stage: "in_review", aiDraft: "Emma, that means the world! 🥹 Loyal supporters like you are the reason we get to celebrate years like this." },
  { id: "I-3", postId: "P-200", author: "Marcus Reid", avatar: "MR", text: "Will the Sunday hours be the same? Hoping to swing by after church.", at: "1h", sentiment: "neutral", likes: 0, stage: "pending", aiDraft: "Hi Marcus! Yes — Sundays are 7am–10pm too. See you then ☕" },
  { id: "I-4", postId: "P-200", author: "Diane K.", avatar: "DK", text: "Finally! The old hours never worked for my schedule.", at: "2h", sentiment: "positive", likes: 2, stage: "pending" },
  { id: "I-5", postId: "P-199", author: "Priya Shah", avatar: "PS", text: "Just applied — really excited about this role!", at: "3h", sentiment: "positive", likes: 1, stage: "in_review", aiDraft: "Priya, thanks for applying! Our team will review and reach out within a week." },
  { id: "I-6", postId: "P-198", author: "Tom L.", avatar: "TL", text: "Hard agree. The polished corporate voice is so dead.", at: "5h", sentiment: "positive", likes: 18, stage: "pending" },
  { id: "I-7", postId: "P-198", author: "Anonymous", avatar: "A?", text: "Disagree — sometimes professionalism matters more than personality.", at: "6h", sentiment: "negative", likes: 3, stage: "pending", aiDraft: "Totally fair point — context matters. We try to balance warmth with credibility." },
  { id: "I-8", postId: "P-197", author: "Hannah Becker", avatar: "HB", text: "Do you ship to Germany? 🌍", at: "8h", sentiment: "neutral", likes: 1, stage: "pending", aiDraft: "Hi Hannah! Yes — we ship to 32 countries including Germany. Standard delivery is 5–7 days." },
  { id: "I-9", postId: "P-197", author: "Lila M.", avatar: "LM", text: "Obsessed with the floral print 😍 ordered already!", at: "10h", sentiment: "positive", likes: 5, stage: "replied" },
];

/* ──────────────────────────────────────────────────────────────
   Helpers
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

/* ──────────────────────────────────────────────────────────────
   Sub-components
   ────────────────────────────────────────────────────────────── */

/**
 * The defining piece of v2 — a compact "Original Post" card shown next to
 * every comment so the user instantly knows what triggered it.
 *
 * Adapts to two shapes:
 *   • With image  → thumbnail on the left, caption on the right
 *   • Text-only   → icon placeholder + full caption (no awkward empty box)
 */
function PostContextCard({ post, compact = false }: { post: PostCtx; compact?: boolean }) {
  const hasImage = Boolean(post.image);
  return (
    <div className="flex gap-3 p-3 rounded-lg border border-border bg-muted/30">
      {hasImage ? (
        <img
          src={post.image}
          alt=""
          className={cn(
            "rounded-md object-cover flex-shrink-0 border border-border",
            compact ? "w-12 h-12" : "w-16 h-16",
          )}
        />
      ) : (
        <div
          className={cn(
            "rounded-md flex-shrink-0 border border-border bg-background flex items-center justify-center",
            compact ? "w-12 h-12" : "w-16 h-16",
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
        <button className="text-[11px] text-primary hover:underline mt-1 inline-flex items-center gap-1">
          View post <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

interface InteractionRowProps {
  interaction: Interaction;
  post: PostCtx;
  selected: boolean;
  onClick: () => void;
}

function InteractionRow({ interaction: i, post, selected, onClick }: InteractionRowProps) {
  const SIcon = sentimentMeta[i.sentiment].Icon;
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left p-3 border-b border-border transition-colors",
        selected ? "bg-primary/5 border-l-2 border-l-primary" : "hover:bg-muted/40 border-l-2 border-l-transparent",
      )}
    >
      {/* Post context — always first, never hidden */}
      <PostContextCard post={post} compact />

      {/* The interaction itself */}
      <div className="flex gap-2.5 mt-2.5 pl-1">
        <div className="w-7 h-7 rounded-full bg-primary/10 text-primary text-[11px] font-semibold flex items-center justify-center flex-shrink-0">
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
          <p className="text-sm text-foreground leading-snug">{i.text}</p>
          <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> {i.likes}</span>
            <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-medium", stageMeta[i.stage].cls)}>
              {stageMeta[i.stage].label}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

/* ──────────────────────────────────────────────────────────────
   Page
   ────────────────────────────────────────────────────────────── */

type TabKey = "all" | "pending" | "mentions" | "resolved";

const TABS: { id: TabKey; label: string; Icon: typeof Inbox }[] = [
  { id: "all", label: "All", Icon: Inbox },
  { id: "pending", label: "Needs reply", Icon: AlertTriangle },
  { id: "mentions", label: "Mentions", Icon: Sparkles },
  { id: "resolved", label: "Resolved", Icon: CheckCircle2 },
];

export default function EngageV2Page() {
  const [tab, setTab] = useState<TabKey>("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string>(INTERACTIONS[0].id);
  const [reply, setReply] = useState("");

  const postById = useMemo(() => {
    const m = new Map<string, PostCtx>();
    POSTS.forEach((p) => m.set(p.id, p));
    return m;
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return INTERACTIONS.filter((i) => {
      if (tab === "pending" && i.stage !== "pending") return false;
      if (tab === "resolved" && i.stage !== "replied") return false;
      if (tab === "mentions" && !i.text.includes("@")) return false;
      if (q) {
        const post = postById.get(i.postId);
        const hay = `${i.author} ${i.text} ${post?.caption ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [tab, query, postById]);

  const selected = filtered.find((i) => i.id === selectedId) ?? filtered[0];
  const selectedPost = selected ? postById.get(selected.postId) : undefined;

  const send = () => {
    if (!reply.trim()) return;
    toast.success("Reply sent");
    setReply("");
  };

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

      {/* Toolbar */}
      <div className="flex items-center gap-2 bg-card rounded-xl border border-border p-2">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search comments, authors, or post captions…"
            className="w-full pl-9 pr-8 h-9 rounded-lg bg-background border border-input text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-muted">
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-1 ml-auto">
          {TABS.map((t) => {
            const Icon = t.Icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 h-9 rounded-lg text-sm font-medium transition-colors",
                  active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            );
          })}
          <Button variant="outline" size="sm" className="h-9 gap-1.5">
            <Filter className="w-3.5 h-3.5" />
            Filters
          </Button>
        </div>
      </div>

      {/* Two-pane workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-4 h-[calc(100vh-260px)] min-h-[560px]">
        {/* List */}
        <div className="bg-card rounded-xl border border-border overflow-hidden flex flex-col">
          <div className="px-3 py-2 border-b border-border flex items-center justify-between text-xs text-muted-foreground bg-muted/30">
            <span className="font-medium">{filtered.length} interactions</span>
            <span>Sorted by recency</span>
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
              {/* Persistent post context at top — never scrolls away */}
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
