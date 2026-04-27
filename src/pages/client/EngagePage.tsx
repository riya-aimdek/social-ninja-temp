import { useMemo, useState } from "react";
import {
  Inbox, KanbanSquare, MessageSquare, AlertTriangle, Clock, CheckCircle2,
  Facebook, Instagram, Linkedin, Twitter, Send, Sparkles, Filter, Search,
  ArrowRight, MoreVertical, MapPin, Shield, Shuffle, Trash2, Plus,
  ThumbsUp, ThumbsDown, Edit3, RefreshCw, Smile, Meh, Frown, ListTree,
  Bot, Users, Zap, X, Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

/** Cap a number for compact display (e.g. 10+) */
const cap = (n: number, max = 10) => (n > max ? `${max}+` : `${n}`);

/* ──────────────────────────────────────────────────────────────
   Types
   ────────────────────────────────────────────────────────────── */

type Stage = "pending" | "in_review" | "replied" | "escalated";
type Priority = "low" | "medium" | "high" | "urgent";
type Sentiment = "positive" | "neutral" | "negative";
type Platform = "Instagram" | "Facebook" | "LinkedIn" | "Twitter" | "GBP";
type Trigger = "anniversary" | "product_inquiry" | "job_application" | "praise" | "complaint" | "general";

interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  at: string;
  sentiment: Sentiment;
  likes: number;
  isSpam?: boolean;
  trigger?: Trigger;
  aiDraft?: string;
  stage: Stage;
  assignee?: string;
  priority: Priority;
  sla: { dueIn: string; breached: boolean };
  replies?: Comment[];
}

interface Post {
  id: string;
  platform: Platform;
  title: string;
  thumbnail: string;
  publishedAt: string;
  commentCount: number;
  newCount: number;
  comments: Comment[];
}

interface ReplyVariant {
  id: string;
  text: string;
  uses: number;
}

interface ReplyTemplate {
  id: string;
  trigger: Trigger;
  label: string;
  description: string;
  variants: ReplyVariant[];
  enabled: boolean;
}

/* ──────────────────────────────────────────────────────────────
   Tokens & helpers
   ────────────────────────────────────────────────────────────── */

const STAGES: { id: Stage; label: string; dot: string }[] = [
  { id: "pending", label: "Pending", dot: "bg-info" },
  { id: "in_review", label: "In Review", dot: "bg-warning" },
  { id: "replied", label: "Replied", dot: "bg-success" },
  { id: "escalated", label: "Escalated", dot: "bg-error" },
];

const priorityStyles: Record<Priority, string> = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-info/15 text-info",
  high: "bg-warning/15 text-warning",
  urgent: "bg-error/15 text-error",
};

const sentimentMeta: Record<Sentiment, { color: string; bg: string; Icon: typeof Smile; label: string }> = {
  positive: { color: "text-success", bg: "bg-success/10", Icon: Smile, label: "Positive" },
  neutral: { color: "text-muted-foreground", bg: "bg-muted", Icon: Meh, label: "Neutral" },
  negative: { color: "text-error", bg: "bg-error/10", Icon: Frown, label: "Negative" },
};

const triggerLabel: Record<Trigger, string> = {
  anniversary: "Anniversary",
  product_inquiry: "Product inquiry",
  job_application: "Job application",
  praise: "Praise",
  complaint: "Complaint",
  general: "General",
};

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

/* ──────────────────────────────────────────────────────────────
   Mock data
   ────────────────────────────────────────────────────────────── */

const POSTS: Post[] = [
  {
    id: "P-201", platform: "Instagram",
    title: "🎉 Celebrating 5 years of building together!",
    thumbnail: "🎂", publishedAt: "2h ago",
    commentCount: 247, newCount: 32,
    comments: [
      {
        id: "C-1", author: "Sarah Johnson", avatar: "SJ",
        text: "Happy 5 years! 🎉 Wishing you many more!", at: "12m",
        sentiment: "positive", likes: 4, trigger: "anniversary",
        aiDraft: "Thank you so much, Sarah! 💛 Five years has flown by — couldn't have done it without supporters like you. Here's to many more!",
        stage: "pending", priority: "low",
        sla: { dueIn: "3h 48m", breached: false },
        replies: [
          { id: "C-1a", author: "Mike Chen", avatar: "MC", text: "Seconded! Such an inspiring journey.", at: "8m",
            sentiment: "positive", likes: 1, stage: "pending", priority: "low", sla: { dueIn: "3h", breached: false } },
        ],
      },
      {
        id: "C-2", author: "Emma Wilson", avatar: "EW",
        text: "Congrats team! Been a customer since year 1 ❤️", at: "20m",
        sentiment: "positive", likes: 7, trigger: "anniversary",
        aiDraft: "Emma, that means the world! 🥹 Loyal supporters like you are the reason we get to celebrate years like this. Thank you!",
        stage: "in_review", priority: "low", assignee: "Priya S.",
        sla: { dueIn: "3h 30m", breached: false },
      },
      {
        id: "C-3", author: "Jordan Patel", avatar: "JP",
        text: "BUY FOLLOWERS NOW >>> linkbit.ly/xxx", at: "22m",
        sentiment: "neutral", likes: 0, isSpam: true,
        stage: "pending", priority: "low",
        sla: { dueIn: "—", breached: false },
      },
    ],
  },
  {
    id: "P-200", platform: "GBP",
    title: "Downtown location — new hours announcement",
    thumbnail: "📍", publishedAt: "5h ago",
    commentCount: 23, newCount: 8,
    comments: [
      {
        id: "C-10", author: "David Kim", avatar: "DK",
        text: "Stopped by yesterday — service was incredible. 5 stars!", at: "1h",
        sentiment: "positive", likes: 2, trigger: "praise",
        aiDraft: "Thanks so much, David! ⭐ We'll pass this on to the downtown team — they'll be thrilled. See you again soon!",
        stage: "pending", priority: "high",
        sla: { dueIn: "58m", breached: false },
      },
      {
        id: "C-11", author: "Lisa Park", avatar: "LP",
        text: "Waited 40 minutes and nobody helped me. Very disappointed.", at: "3h",
        sentiment: "negative", likes: 0, trigger: "complaint",
        aiDraft: "Lisa, we're so sorry about your experience — that's not the standard we hold ourselves to. Could you DM us your visit details so our manager can make this right?",
        stage: "escalated", priority: "urgent", assignee: "Sarah C.",
        sla: { dueIn: "OVERDUE 15m", breached: true },
      },
    ],
  },
  {
    id: "P-199", platform: "LinkedIn",
    title: "We're hiring: Senior Product Designer",
    thumbnail: "💼", publishedAt: "1d ago",
    commentCount: 89, newCount: 21,
    comments: [
      {
        id: "C-20", author: "Alex Rivera", avatar: "AR",
        text: "Just applied! Excited about this opportunity.", at: "2h",
        sentiment: "positive", likes: 3, trigger: "job_application",
        aiDraft: "Thanks for applying, Alex! 🙌 Our talent team will review your application within 5 business days. In the meantime, feel free to check out our team page.",
        stage: "replied", priority: "medium", assignee: "Mike T.",
        sla: { dueIn: "—", breached: false },
      },
    ],
  },
  {
    id: "P-198", platform: "Facebook",
    title: "New product launch — Spring Collection ‘26",
    thumbnail: "🌸", publishedAt: "1d ago",
    commentCount: 34, newCount: 4,
    comments: [
      {
        id: "C-30", author: "Megan Liu", avatar: "ML",
        text: "Does the green one come in size XL?", at: "4h",
        sentiment: "neutral", likes: 0, trigger: "product_inquiry",
        aiDraft: "Hi Megan! 👋 Yes — the Sage Green is available in XS through XXL. You can grab one at the link in our bio. Let us know if you need a size guide!",
        stage: "pending", priority: "high",
        sla: { dueIn: "1h 22m", breached: false },
      },
    ],
  },
];

const REPLY_TEMPLATES: ReplyTemplate[] = [
  {
    id: "T-anni", trigger: "anniversary", label: "Anniversary thank-you",
    description: "Warm, varied responses for milestone celebration comments.",
    enabled: true,
    variants: [
      { id: "v1", text: "Thank you so much! 💛 Couldn't have reached this milestone without supporters like you.", uses: 142 },
      { id: "v2", text: "You just made our day 🥹 — here's to many more years together!", uses: 138 },
      { id: "v3", text: "We're blushing! 🎉 Truly grateful for the love.", uses: 121 },
    ],
  },
  {
    id: "T-prod", trigger: "product_inquiry", label: "Product inquiry",
    description: "Friendly answers that route customers to the right place.",
    enabled: true,
    variants: [
      { id: "v1", text: "Great question! You'll find sizing & colors at the link in our bio 👆", uses: 87 },
      { id: "v2", text: "Hi! Yes — full details (and stock) are live on our shop page. Let us know if anything's unclear!", uses: 79 },
    ],
  },
  {
    id: "T-job", trigger: "job_application", label: "Job application ack",
    description: "First-touch acknowledgment for HR / talent comments.",
    enabled: true,
    variants: [
      { id: "v1", text: "Thanks for applying! 🙌 Our talent team will be in touch within 5 business days.", uses: 56 },
      { id: "v2", text: "Application received! We review every one — expect to hear back soon.", uses: 48 },
      { id: "v3", text: "Welcome to the pipeline 👋 You'll get an update from our recruiting team shortly.", uses: 41 },
    ],
  },
];

const ORM_USERS = [
  { name: "Priya S.", load: 12, color: "bg-info" },
  { name: "Mike T.", load: 7, color: "bg-success" },
  { name: "Sarah C.", load: 18, color: "bg-warning" },
  { name: "You", load: 4, color: "bg-primary" },
];

/* ──────────────────────────────────────────────────────────────
   Page
   ────────────────────────────────────────────────────────────── */

type Tab = "queue" | "board" | "threads" | "sentiment" | "spam" | "variants";

const TABS: { id: Tab; label: string; Icon: typeof Inbox; description: string }[] = [
  { id: "queue", label: "AI Reply Queue", Icon: Bot, description: "Review AI-drafted replies and send" },
  { id: "board", label: "ORM Board", Icon: KanbanSquare, description: "Jira-style workload view" },
  { id: "threads", label: "Comment Threads", Icon: ListTree, description: "Threaded comments grouped by post" },
  { id: "sentiment", label: "Sentiment Review", Icon: Smile, description: "Audit & correct AI sentiment tags" },
  { id: "spam", label: "Spam Queue", Icon: Shield, description: "Filtered comments awaiting review" },
  { id: "variants", label: "Reply Variants", Icon: Shuffle, description: "Manage humanized auto-reply templates" },
];

export default function EngagePage() {
  const [tab, setTab] = useState<Tab>("queue");
  const [posts, setPosts] = useState<Post[]>(POSTS);
  const [templates, setTemplates] = useState<ReplyTemplate[]>(REPLY_TEMPLATES);

  // Flatten non-spam comments for queue/board/sentiment views
  const allComments = useMemo(() => {
    const out: (Comment & { post: Post })[] = [];
    posts.forEach((p) => p.comments.forEach((c) => {
      if (!c.isSpam) out.push({ ...c, post: p });
      c.replies?.forEach((r) => !r.isSpam && out.push({ ...r, post: p }));
    }));
    return out;
  }, [posts]);

  const spamComments = useMemo(
    () => posts.flatMap((p) => p.comments.filter((c) => c.isSpam).map((c) => ({ ...c, post: p }))),
    [posts],
  );

  const summary = useMemo(() => ({
    pending: allComments.filter((c) => c.stage === "pending").length,
    urgent: allComments.filter((c) => c.priority === "urgent" && c.stage !== "replied").length,
    breached: allComments.filter((c) => c.sla.breached).length,
    replied: allComments.filter((c) => c.stage === "replied").length,
    spam: spamComments.length,
  }), [allComments, spamComments]);

  /* mutate helpers */
  const updateComment = (id: string, patch: Partial<Comment>) => {
    setPosts((prev) =>
      prev.map((p) => ({
        ...p,
        comments: p.comments.map((c) => {
          if (c.id === id) return { ...c, ...patch };
          if (c.replies) return { ...c, replies: c.replies.map((r) => r.id === id ? { ...r, ...patch } : r) };
          return c;
        }),
      })),
    );
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { I: MessageSquare, label: "Pending review", value: summary.pending, tone: "text-info bg-info/10" },
          { I: AlertTriangle, label: "Urgent", value: summary.urgent, tone: "text-error bg-error/10" },
          { I: Clock, label: "SLA breached", value: summary.breached, tone: "text-warning bg-warning/10" },
          { I: CheckCircle2, label: "Replied today", value: summary.replied, tone: "text-success bg-success/10" },
          { I: Shield, label: "Spam filtered", value: summary.spam, tone: "text-muted-foreground bg-muted" },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center justify-between">
              <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", s.tone)}>
                <s.I className="w-4 h-4" />
              </div>
              <span className="text-2xl font-bold text-foreground tabular-nums">{s.value}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-2">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "px-4 py-2.5 text-xs font-medium flex items-center gap-1.5 border-b-2 -mb-px whitespace-nowrap transition-colors",
              tab === t.id
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            <t.Icon className="w-3.5 h-3.5" /> {t.label}
            {t.id === "spam" && summary.spam > 0 && (
              <span className="ml-0.5 text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">{summary.spam}</span>
            )}
          </button>
        ))}
      </div>

      {tab === "queue" && <ReplyQueueView comments={allComments} updateComment={updateComment} />}
      {tab === "board" && <BoardView comments={allComments} updateComment={updateComment} />}
      {tab === "threads" && <ThreadsView posts={posts.filter((p) => p.comments.some((c) => !c.isSpam))} updateComment={updateComment} />}
      {tab === "sentiment" && <SentimentReviewView comments={allComments} updateComment={updateComment} />}
      {tab === "spam" && <SpamView spam={spamComments} unspam={(id) => updateComment(id, { isSpam: false })} />}
      {tab === "variants" && <VariantsView templates={templates} setTemplates={setTemplates} />}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   View 1 — AI Reply Queue (queue-based review workflow)
   ────────────────────────────────────────────────────────────── */

function ReplyQueueView({
  comments, updateComment,
}: {
  comments: (Comment & { post: Post })[];
  updateComment: (id: string, patch: Partial<Comment>) => void;
}) {
  const queue = comments.filter((c) => c.stage === "pending" || c.stage === "in_review");
  const [activeId, setActiveId] = useState<string | null>(queue[0]?.id ?? null);
  const active = queue.find((c) => c.id === activeId) ?? queue[0];
  const [draft, setDraft] = useState(active?.aiDraft ?? "");

  const switchTo = (id: string) => {
    setActiveId(id);
    setDraft(comments.find((c) => c.id === id)?.aiDraft ?? "");
  };

  const approve = () => {
    if (!active) return;
    updateComment(active.id, { stage: "replied" });
    toast.success("Reply approved & sent");
    const next = queue.find((c) => c.id !== active.id);
    if (next) switchTo(next.id);
  };

  const escalate = () => {
    if (!active) return;
    updateComment(active.id, { stage: "escalated" });
    toast.warning("Escalated to senior ORM");
  };

  const regenerate = () => {
    if (!active) return;
    const variants = [
      `Hey ${active.author.split(" ")[0]}! Thanks for reaching out — really appreciate you taking the time. Let me look into this for you.`,
      `Thanks ${active.author.split(" ")[0]} 🙌 Great point — we'll get back to you with details shortly.`,
      `Hi ${active.author.split(" ")[0]}! Love hearing from you. Quick reply incoming with everything you need.`,
    ];
    setDraft(variants[Math.floor(Math.random() * variants.length)]);
    toast.success("New AI variant generated");
  };

  return (
    <div className="grid grid-cols-12 gap-4 h-[calc(100vh-380px)] min-h-[520px]">
      {/* Left: queue */}
      <div className="col-span-5 bg-card rounded-xl border border-border overflow-y-auto">
        <div className="px-4 py-2.5 border-b border-border bg-muted/30 flex items-center justify-between">
          <span className="text-xs font-semibold text-foreground">Awaiting review</span>
          <span className="text-[10px] text-muted-foreground">{queue.length} comments</span>
        </div>
        {queue.map((c) => {
          const sm = sentimentMeta[c.sentiment];
          return (
            <button
              key={c.id}
              onClick={() => switchTo(c.id)}
              className={cn(
                "w-full text-left px-4 py-3 border-b border-border hover:bg-accent/30 transition-colors",
                active?.id === c.id && "bg-primary/5 border-l-2 border-l-primary",
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-[10px] font-bold text-foreground">
                  {c.avatar}
                </div>
                <span className="text-xs font-semibold text-foreground truncate">{c.author}</span>
                <PlatformIcon name={c.post.platform} />
                <span className={cn("ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-medium capitalize", priorityStyles[c.priority])}>
                  {c.priority}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground line-clamp-1 pl-9 italic">on "{c.post.title}"</p>
              <p className="text-xs text-foreground line-clamp-2 pl-9 mt-1">{c.text}</p>
              <div className="flex items-center gap-2 mt-1.5 pl-9">
                <span className={cn("inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full font-medium", sm.bg, sm.color)}>
                  <sm.Icon className="w-2.5 h-2.5" /> {sm.label}
                </span>
                {c.trigger && <span className="text-[10px] text-muted-foreground">· {triggerLabel[c.trigger]}</span>}
                <span className={cn("ml-auto text-[10px] tabular-nums", c.sla.breached ? "text-error font-semibold" : "text-muted-foreground")}>
                  {c.sla.dueIn}
                </span>
              </div>
            </button>
          );
        })}
        {queue.length === 0 && (
          <div className="p-10 text-center">
            <CheckCircle2 className="w-8 h-8 text-success mx-auto mb-2" />
            <p className="text-sm font-medium text-foreground">Inbox zero! 🎉</p>
            <p className="text-xs text-muted-foreground">No comments awaiting review.</p>
          </div>
        )}
      </div>

      {/* Right: AI draft review */}
      <div className="col-span-7 bg-card rounded-xl border border-border flex flex-col overflow-hidden">
        {!active ? (
          <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">Select a comment to review</div>
        ) : (
          <>
            {/* Post context */}
            <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-card border border-border flex items-center justify-center text-lg">
                {active.post.thumbnail}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <PlatformIcon name={active.post.platform} />
                  <p className="text-xs font-semibold text-foreground truncate">{active.post.title}</p>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  {active.post.commentCount} comments · {active.post.newCount} new · {active.post.publishedAt}
                </p>
              </div>
              {active.post.platform === "GBP" && (
                <span className="text-[10px] px-2 py-1 rounded-full bg-warning/15 text-warning font-medium flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Local SEO impact
                </span>
              )}
            </div>

            {/* Comment */}
            <div className="p-4 border-b border-border">
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-foreground flex-shrink-0">
                  {active.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-foreground">{active.author}</span>
                    <span className="text-[10px] text-muted-foreground">· {active.at} ago</span>
                    {active.trigger && (
                      <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                        {triggerLabel[active.trigger]}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-foreground">{active.text}</p>
                </div>
              </div>
            </div>

            {/* AI draft */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <Bot className="w-3.5 h-3.5 text-primary" /> AI-drafted reply
                  <span className="text-[10px] font-normal text-muted-foreground">· edit before sending</span>
                </div>
                <button onClick={regenerate} className="text-[11px] text-primary inline-flex items-center gap-1 hover:underline">
                  <RefreshCw className="w-3 h-3" /> Regenerate
                </button>
              </div>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={5}
                className="w-full px-3 py-2 rounded-lg border border-input text-sm bg-background outline-none focus:ring-2 focus:ring-ring resize-none"
              />
              <div className="flex flex-wrap gap-1.5">
                {["More empathetic", "Shorter", "More formal", "Add emoji"].map((p) => (
                  <button key={p} onClick={() => toast.success(`Tone adjusted: ${p}`)}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20">
                    <Sparkles className="w-2.5 h-2.5 inline mr-1" />{p}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="p-3 border-t border-border flex items-center gap-2 bg-muted/30">
              <Button variant="outline" size="sm" onClick={escalate} className="gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-error" /> Escalate
              </Button>
              <Button variant="ghost" size="sm" onClick={() => updateComment(active.id, { isSpam: true })} className="gap-1.5 text-muted-foreground">
                <Trash2 className="w-3.5 h-3.5" /> Mark spam
              </Button>
              <div className="ml-auto flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Edit3 className="w-3.5 h-3.5" /> Save draft
                </Button>
                <Button size="sm" onClick={approve} className="gap-1.5">
                  <Check className="w-3.5 h-3.5" /> Approve & send
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   View 2 — Jira-style ORM Board
   ────────────────────────────────────────────────────────────── */

function BoardView({
  comments, updateComment,
}: {
  comments: (Comment & { post: Post })[];
  updateComment: (id: string, patch: Partial<Comment>) => void;
}) {
  return (
    <div className="space-y-4">
      {/* Workload */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-3.5 h-3.5 text-muted-foreground" />
          <h3 className="text-xs font-semibold text-foreground">ORM Workload</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {ORM_USERS.map((u) => (
            <div key={u.name} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-muted/40">
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-card", u.color)}>
                {u.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-foreground truncate">{u.name}</p>
                <p className="text-[10px] text-muted-foreground">{u.load} active</p>
              </div>
              <div className="w-12 h-1.5 rounded-full bg-border overflow-hidden">
                <div className={cn("h-full", u.color)} style={{ width: `${Math.min(u.load * 5, 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {STAGES.map((stage) => {
          const items = comments.filter((c) => c.stage === stage.id);
          return (
            <div key={stage.id} className="bg-muted/40 rounded-xl p-3 min-h-[480px]">
              <div className="flex items-center gap-2 mb-3">
                <span className={cn("w-2 h-2 rounded-full", stage.dot)} />
                <h3 className="text-xs font-semibold text-foreground">{stage.label}</h3>
                <span className="text-[10px] text-muted-foreground bg-card px-1.5 py-0.5 rounded">{items.length}</span>
              </div>
              <div className="space-y-2">
                {items.map((c) => {
                  const sm = sentimentMeta[c.sentiment];
                  return (
                    <div
                      key={c.id}
                      className={cn(
                        "bg-card border rounded-lg p-2.5 hover:border-border-hover transition-colors cursor-pointer",
                        c.sla.breached ? "border-l-2 border-l-error border-border" : "border-border",
                      )}
                    >
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="text-[10px] font-mono text-muted-foreground">{c.id}</span>
                        <PlatformIcon name={c.post.platform} className="w-3 h-3" />
                        <span className={cn("text-[9px] px-1.5 py-0.5 rounded-full font-medium capitalize ml-auto", priorityStyles[c.priority])}>
                          {c.priority}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground italic line-clamp-1 mb-1">on "{c.post.title}"</p>
                      <p className="text-xs font-medium text-foreground line-clamp-2 mb-2">{c.text}</p>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className={cn("inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full font-medium", sm.bg, sm.color)}>
                          <sm.Icon className="w-2.5 h-2.5" /> {sm.label}
                        </span>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          {c.assignee && (
                            <span className="w-4 h-4 rounded-full bg-accent flex items-center justify-center text-[8px] font-bold text-foreground">
                              {c.assignee.split(" ").map((n) => n[0]).join("")}
                            </span>
                          )}
                          <span className={cn("tabular-nums", c.sla.breached && "text-error font-semibold")}>{c.sla.dueIn}</span>
                        </div>
                      </div>
                      <select
                        value={c.stage}
                        onChange={(e) => updateComment(c.id, { stage: e.target.value as Stage })}
                        className="mt-2 w-full text-[10px] px-2 py-1 rounded border border-border bg-background outline-none focus:ring-1 focus:ring-ring"
                      >
                        {STAGES.map((s) => <option key={s.id} value={s.id}>Move to {s.label}</option>)}
                      </select>
                    </div>
                  );
                })}
                {items.length === 0 && <div className="text-[11px] text-muted-foreground text-center py-6">Empty</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   View 3 — Comment threads grouped by post (with counts)
   ────────────────────────────────────────────────────────────── */

function ThreadsView({
  posts, updateComment,
}: {
  posts: Post[];
  updateComment: (id: string, patch: Partial<Comment>) => void;
}) {
  const [openId, setOpenId] = useState<string | null>(posts[0]?.id ?? null);

  return (
    <div className="space-y-3">
      {posts.map((p) => {
        const open = openId === p.id;
        const visibleComments = p.comments.filter((c) => !c.isSpam);
        return (
          <div key={p.id} className="bg-card rounded-xl border border-border overflow-hidden">
            <button
              onClick={() => setOpenId(open ? null : p.id)}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-accent/20 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-xl flex-shrink-0">
                {p.thumbnail}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <PlatformIcon name={p.platform} />
                  <p className="text-sm font-semibold text-foreground truncate">{p.title}</p>
                  {p.platform === "GBP" && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-warning/15 text-warning font-medium">SEO</span>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground">Published {p.publishedAt}</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <MessageSquare className="w-3.5 h-3.5" /> <span className="font-semibold text-foreground tabular-nums">{p.commentCount}</span>
                </span>
                {p.newCount > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground font-bold">
                    {p.newCount} new
                  </span>
                )}
              </div>
            </button>

            {open && (
              <div className="border-t border-border p-4 space-y-3 bg-muted/20">
                {visibleComments.map((c) => (
                  <CommentNode key={c.id} comment={c} depth={0} updateComment={updateComment} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function CommentNode({
  comment, depth, updateComment,
}: {
  comment: Comment; depth: number;
  updateComment: (id: string, patch: Partial<Comment>) => void;
}) {
  const sm = sentimentMeta[comment.sentiment];
  return (
    <div style={{ marginLeft: depth * 28 }} className="relative">
      {depth > 0 && <div className="absolute -left-4 top-0 bottom-0 w-px bg-border" />}
      <div className="bg-card border border-border rounded-lg p-3">
        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-[10px] font-bold text-foreground flex-shrink-0">
            {comment.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-foreground">{comment.author}</span>
              <span className="text-[10px] text-muted-foreground">{comment.at} ago</span>
              <span className={cn("inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full font-medium", sm.bg, sm.color)}>
                <sm.Icon className="w-2.5 h-2.5" /> {sm.label}
              </span>
              <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium ml-auto", priorityStyles[comment.priority])}>
                {comment.stage === "replied" ? "✓ Replied" : STAGES.find((s) => s.id === comment.stage)?.label}
              </span>
            </div>
            <p className="text-sm text-foreground mt-1">{comment.text}</p>
            <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1"><ThumbsUp className="w-3 h-3" />{comment.likes}</span>
              <button className="inline-flex items-center gap-1 hover:text-foreground"><ArrowRight className="w-3 h-3" />Reply</button>
              {comment.aiDraft && comment.stage === "pending" && (
                <button onClick={() => updateComment(comment.id, { stage: "replied" })}
                  className="inline-flex items-center gap-1 text-primary hover:underline">
                  <Bot className="w-3 h-3" />Use AI draft
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2 space-y-2 ml-4">
          {comment.replies.map((r) => <CommentNode key={r.id} comment={r} depth={depth + 1} updateComment={updateComment} />)}
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   View 4 — Sentiment review & correction
   ────────────────────────────────────────────────────────────── */

function SentimentReviewView({
  comments, updateComment,
}: {
  comments: (Comment & { post: Post })[];
  updateComment: (id: string, patch: Partial<Comment>) => void;
}) {
  const [filter, setFilter] = useState<"all" | Sentiment>("all");
  const [platform, setPlatform] = useState<"all" | Platform>("all");
  const filtered = comments.filter(
    (c) => (filter === "all" || c.sentiment === filter) && (platform === "all" || c.post.platform === platform),
  );

  const correct = (id: string, s: Sentiment) => {
    updateComment(id, { sentiment: s });
    toast.success("Correction recorded — model accuracy improved");
  };

  return (
    <div className="space-y-4">
      <div className="bg-info/5 border border-info/20 rounded-xl p-3 flex items-start gap-2.5">
        <Bot className="w-4 h-4 text-info flex-shrink-0 mt-0.5" />
        <div className="text-xs text-foreground">
          <span className="font-semibold">Help train the AI.</span> Review sentiment classifications and correct any that look wrong.
          Your corrections are fed back to improve accuracy across all clients.
          <span className="text-muted-foreground"> · Current accuracy: <span className="font-semibold text-foreground">94.2%</span></span>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1 text-xs">
          <Filter className="w-3.5 h-3.5 text-muted-foreground" />
          {(["all", "positive", "neutral", "negative"] as const).map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={cn(
                "px-2.5 py-1 rounded-full border text-xs font-medium capitalize transition-colors",
                filter === s ? "bg-foreground text-background border-foreground" : "bg-card text-muted-foreground border-border hover:text-foreground",
              )}>
              {s}
            </button>
          ))}
        </div>
        <select value={platform} onChange={(e) => setPlatform(e.target.value as typeof platform)}
          className="text-xs px-2.5 py-1 rounded-lg border border-border bg-card outline-none focus:ring-2 focus:ring-ring">
          <option value="all">All platforms</option>
          {(["Instagram", "Facebook", "LinkedIn", "Twitter", "GBP"] as Platform[]).map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-[11px] uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-2.5 font-semibold">Comment</th>
              <th className="text-left px-4 py-2.5 font-semibold">Post</th>
              <th className="text-left px-4 py-2.5 font-semibold">AI sentiment</th>
              <th className="text-left px-4 py-2.5 font-semibold">Correct to</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => {
              const sm = sentimentMeta[c.sentiment];
              return (
                <tr key={c.id} className="border-t border-border">
                  <td className="px-4 py-3 max-w-[320px]">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-foreground">{c.author}</span>
                      <PlatformIcon name={c.post.platform} className="w-3 h-3" />
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{c.text}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground italic max-w-[200px] truncate">{c.post.title}</td>
                  <td className="px-4 py-3">
                    <span className={cn("inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full font-medium", sm.bg, sm.color)}>
                      <sm.Icon className="w-3 h-3" /> {sm.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {(["positive", "neutral", "negative"] as Sentiment[]).map((s) => {
                        const meta = sentimentMeta[s];
                        const active = c.sentiment === s;
                        return (
                          <button key={s} onClick={() => correct(c.id, s)} disabled={active}
                            title={meta.label}
                            className={cn(
                              "w-7 h-7 rounded-lg border flex items-center justify-center transition-colors",
                              active ? cn(meta.bg, meta.color, "border-transparent") : "border-border text-muted-foreground hover:bg-muted",
                            )}>
                            <meta.Icon className="w-3.5 h-3.5" />
                          </button>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="p-10 text-center text-sm text-muted-foreground">No comments match these filters.</div>}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   View 5 — Spam queue
   ────────────────────────────────────────────────────────────── */

function SpamView({
  spam, unspam,
}: {
  spam: (Comment & { post: Post })[];
  unspam: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="bg-warning/5 border border-warning/20 rounded-xl p-3 flex items-start gap-2.5">
        <Shield className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
        <div className="text-xs text-foreground">
          <span className="font-semibold">Auto-filtered spam.</span> These comments were flagged by the spam classifier and hidden from the main inbox.
          Restore any false positives to the queue.
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border divide-y divide-border">
        {spam.map((c) => (
          <div key={c.id} className="p-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground flex-shrink-0">
              {c.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-foreground">{c.author}</span>
                <PlatformIcon name={c.post.platform} className="w-3 h-3" />
                <span className="text-[10px] text-muted-foreground">on "{c.post.title}"</span>
                <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-error/10 text-error font-medium">SPAM</span>
              </div>
              <p className="text-sm text-muted-foreground line-through">{c.text}</p>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <Button variant="outline" size="sm" onClick={() => unspam(c.id)} className="gap-1">
                <RefreshCw className="w-3 h-3" /> Restore
              </Button>
              <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                <Trash2 className="w-3 h-3" /> Delete
              </Button>
            </div>
          </div>
        ))}
        {spam.length === 0 && <div className="p-10 text-center text-sm text-muted-foreground">No spam in the queue.</div>}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   View 6 — Reply variants (humanized auto-replies)
   ────────────────────────────────────────────────────────────── */

function VariantsView({
  templates, setTemplates,
}: {
  templates: ReplyTemplate[];
  setTemplates: (t: ReplyTemplate[] | ((p: ReplyTemplate[]) => ReplyTemplate[])) => void;
}) {
  const [draftVariant, setDraftVariant] = useState<Record<string, string>>({});

  const addVariant = (templateId: string) => {
    const text = draftVariant[templateId]?.trim();
    if (!text) return;
    setTemplates((p) => p.map((t) => t.id === templateId
      ? { ...t, variants: [...t.variants, { id: `v${Date.now()}`, text, uses: 0 }] }
      : t));
    setDraftVariant((d) => ({ ...d, [templateId]: "" }));
    toast.success("Variant added — system will rotate through it");
  };

  const removeVariant = (templateId: string, variantId: string) => {
    setTemplates((p) => p.map((t) => t.id === templateId
      ? { ...t, variants: t.variants.filter((v) => v.id !== variantId) } : t));
  };

  const toggle = (templateId: string) => {
    setTemplates((p) => p.map((t) => t.id === templateId ? { ...t, enabled: !t.enabled } : t));
  };

  return (
    <div className="space-y-4">
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex items-start gap-2.5">
        <Shuffle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
        <div className="text-xs text-foreground">
          <span className="font-semibold">Humanized rotation.</span> When a trigger fires, the system picks a different variant each time —
          so two customers commenting on the same anniversary post never see identical replies.
        </div>
      </div>

      <div className="space-y-3">
        {templates.map((t) => (
          <div key={t.id} className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground">{t.label}</h3>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                    Trigger: {triggerLabel[t.trigger]}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                    {t.variants.length} variants
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{t.description}</p>
              </div>
              <button onClick={() => toggle(t.id)}
                className={cn(
                  "relative w-9 h-5 rounded-full transition-colors flex-shrink-0",
                  t.enabled ? "bg-primary" : "bg-muted",
                )}>
                <span className={cn(
                  "absolute top-0.5 w-4 h-4 rounded-full bg-card shadow transition-transform",
                  t.enabled ? "translate-x-4" : "translate-x-0.5",
                )} />
              </button>
            </div>

            <div className="space-y-2">
              {t.variants.map((v, i) => (
                <div key={v.id} className="flex items-start gap-2 p-2.5 rounded-lg bg-muted/40 border border-border group">
                  <span className="text-[10px] font-mono text-muted-foreground bg-card border border-border rounded px-1.5 py-0.5 flex-shrink-0">
                    #{i + 1}
                  </span>
                  <p className="flex-1 text-sm text-foreground">{v.text}</p>
                  <span className="text-[10px] text-muted-foreground tabular-nums flex-shrink-0">{v.uses} uses</span>
                  <button onClick={() => removeVariant(t.id, v.id)}
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-error transition-opacity">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-3 flex gap-2">
              <input
                value={draftVariant[t.id] ?? ""}
                onChange={(e) => setDraftVariant((d) => ({ ...d, [t.id]: e.target.value }))}
                placeholder="Add another variant…"
                className="flex-1 px-3 py-2 rounded-lg border border-input text-sm bg-background outline-none focus:ring-2 focus:ring-ring"
              />
              <Button size="sm" onClick={() => addVariant(t.id)} className="gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Add variant
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
