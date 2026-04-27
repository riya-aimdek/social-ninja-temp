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
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

/** Format a count with thousand-separators — show exact value, never truncate */
const fmt = (n: number) => n.toLocaleString();

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
      {
        id: "C-4", author: "Aisha Rahman", avatar: "AR",
        text: "5 years already?? Time flies — congrats to the whole team 🥂", at: "28m",
        sentiment: "positive", likes: 12, trigger: "anniversary",
        aiDraft: "Aisha, thank you! 🥂 Hard to believe ourselves. Cheers to the next chapter — couldn't do it without you.",
        stage: "pending", priority: "low",
        sla: { dueIn: "3h 22m", breached: false },
      },
      {
        id: "C-5", author: "Tomás García", avatar: "TG",
        text: "Wishing you another 5! Loved the new product line btw 💫", at: "35m",
        sentiment: "positive", likes: 5, trigger: "anniversary",
        aiDraft: "Tomás 🙌 thanks for the love — and for noticing the new line! More good things on the way.",
        stage: "pending", priority: "low",
        sla: { dueIn: "3h 15m", breached: false },
      },
      {
        id: "C-6", author: "Hannah Becker", avatar: "HB",
        text: "Congrats! Quick Q — do you ship internationally yet?", at: "48m",
        sentiment: "neutral", likes: 1, trigger: "product_inquiry",
        aiDraft: "Hi Hannah! 🌍 Yes — we ship to 32 countries. Tap the link in bio to see the full list and rates.",
        stage: "pending", priority: "medium",
        sla: { dueIn: "3h 02m", breached: false },
      },
      {
        id: "C-7", author: "Devon Ríos", avatar: "DR",
        text: "How do I enter the giveaway?", at: "1h",
        sentiment: "neutral", likes: 0, trigger: "product_inquiry",
        aiDraft: "Hey Devon! 🎁 The giveaway runs through Friday — full rules are in the pinned story. Good luck!",
        stage: "in_review", priority: "medium", assignee: "Mike T.",
        sla: { dueIn: "2h 50m", breached: false },
      },
    ],
  },
  {
    id: "P-200", platform: "GBP",
    title: "Downtown location — new hours announcement",
    thumbnail: "📍", publishedAt: "5h ago",
    commentCount: 128, newCount: 24,
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
      {
        id: "C-12", author: "Marcus Lee", avatar: "ML",
        text: "Best espresso in the neighborhood, hands down ☕", at: "2h",
        sentiment: "positive", likes: 4, trigger: "praise",
        aiDraft: "Marcus, you're the best 🙏 — we'll let the baristas know they've got a fan!",
        stage: "pending", priority: "high",
        sla: { dueIn: "1h 12m", breached: false },
      },
      {
        id: "C-13", author: "Riya Pillai", avatar: "RP",
        text: "Are the new hours permanent or seasonal?", at: "2h",
        sentiment: "neutral", likes: 0, trigger: "product_inquiry",
        aiDraft: "Hi Riya! These hours are permanent through the season — we'll review again in spring.",
        stage: "pending", priority: "high",
        sla: { dueIn: "1h 05m", breached: false },
      },
      {
        id: "C-14", author: "Anonymous", avatar: "AN",
        text: "★ rude staff", at: "8h",
        sentiment: "negative", likes: 0, trigger: "complaint",
        aiDraft: "We're really sorry to hear this. Could you share more about your visit so we can look into it?",
        stage: "pending", priority: "urgent",
        sla: { dueIn: "OVERDUE 2h", breached: true },
      },
    ],
  },
  {
    id: "P-199", platform: "LinkedIn",
    title: "We're hiring: Senior Product Designer",
    thumbnail: "💼", publishedAt: "1d ago",
    commentCount: 312, newCount: 47,
    comments: [
      {
        id: "C-20", author: "Alex Rivera", avatar: "AR",
        text: "Just applied! Excited about this opportunity.", at: "2h",
        sentiment: "positive", likes: 3, trigger: "job_application",
        aiDraft: "Thanks for applying, Alex! 🙌 Our talent team will review your application within 5 business days. In the meantime, feel free to check out our team page.",
        stage: "replied", priority: "medium", assignee: "Mike T.",
        sla: { dueIn: "—", breached: false },
      },
      {
        id: "C-21", author: "Naomi Bellweather", avatar: "NB",
        text: "Is this role open to remote candidates in Europe?", at: "3h",
        sentiment: "neutral", likes: 6, trigger: "product_inquiry",
        aiDraft: "Hi Naomi! Yes — this role is open to EU-based remote candidates. The job spec link has the full timezone overlap requirements.",
        stage: "pending", priority: "medium",
        sla: { dueIn: "2h 30m", breached: false },
      },
      {
        id: "C-22", author: "Yusuf Khan", avatar: "YK",
        text: "Just submitted — fingers crossed 🤞", at: "4h",
        sentiment: "positive", likes: 2, trigger: "job_application",
        aiDraft: "Application received, Yusuf 🙌 our talent team will be in touch shortly!",
        stage: "in_review", priority: "medium", assignee: "Priya S.",
        sla: { dueIn: "1h 50m", breached: false },
      },
      {
        id: "C-23", author: "Elena Costa", avatar: "EC",
        text: "Will there be a portfolio review round?", at: "6h",
        sentiment: "neutral", likes: 1, trigger: "product_inquiry",
        aiDraft: "Yes Elena — round 2 is a 45-min portfolio walkthrough with the design team. Full process is in the JD.",
        stage: "pending", priority: "low",
        sla: { dueIn: "5h 10m", breached: false },
      },
    ],
  },
  {
    id: "P-198", platform: "Facebook",
    title: "New product launch — Spring Collection ‘26",
    thumbnail: "🌸", publishedAt: "1d ago",
    commentCount: 96, newCount: 15,
    comments: [
      {
        id: "C-30", author: "Megan Liu", avatar: "ML",
        text: "Does the green one come in size XL?", at: "4h",
        sentiment: "neutral", likes: 0, trigger: "product_inquiry",
        aiDraft: "Hi Megan! 👋 Yes — the Sage Green is available in XS through XXL. You can grab one at the link in our bio. Let us know if you need a size guide!",
        stage: "pending", priority: "high",
        sla: { dueIn: "1h 22m", breached: false },
      },
      {
        id: "C-31", author: "Priya Sundaram", avatar: "PS",
        text: "Loving the colour palette this season 😍", at: "5h",
        sentiment: "positive", likes: 9, trigger: "praise",
        aiDraft: "Thanks Priya 💐 — our design team poured a lot into this palette, glad it's landing!",
        stage: "pending", priority: "medium",
        sla: { dueIn: "55m", breached: false },
      },
      {
        id: "C-32", author: "Brett Lawson", avatar: "BL",
        text: "When does the bundle deal end?", at: "6h",
        sentiment: "neutral", likes: 1, trigger: "product_inquiry",
        aiDraft: "Hey Brett! 🛍️ Bundle pricing runs through Sunday 11:59pm PT.",
        stage: "in_review", priority: "high", assignee: "Sarah C.",
        sla: { dueIn: "40m", breached: false },
      },
    ],
  },
  {
    id: "P-197", platform: "Twitter",
    title: "Hot take: design systems are products, not deliverables 🧵",
    thumbnail: "🧵", publishedAt: "1d ago",
    commentCount: 184, newCount: 38,
    comments: [
      {
        id: "C-40", author: "Jamal Otieno", avatar: "JO",
        text: "100%. Treat the consumers (other teams) like users and you win.", at: "5h",
        sentiment: "positive", likes: 22, trigger: "praise",
        aiDraft: "Exactly, Jamal — couldn't have said it better.",
        stage: "pending", priority: "medium",
        sla: { dueIn: "2h 10m", breached: false },
      },
      {
        id: "C-41", author: "Sasha Vargas", avatar: "SV",
        text: "Counterpoint: most orgs aren't ready to staff a product team for tokens.", at: "4h",
        sentiment: "neutral", likes: 14, trigger: "general",
        aiDraft: "Fair point, Sasha — even one part-time owner shifts the outcome dramatically.",
        stage: "in_review", priority: "medium", assignee: "Mike T.",
        sla: { dueIn: "1h 35m", breached: false },
      },
      {
        id: "C-42", author: "Ade Bankole", avatar: "AB",
        text: "Saving this thread, going to share with my lead Monday 🙌", at: "3h",
        sentiment: "positive", likes: 7, trigger: "praise",
        aiDraft: "Love that Ade — let us know how the convo goes!",
        stage: "replied", priority: "low", assignee: "Priya S.",
        sla: { dueIn: "—", breached: false },
      },
    ],
  },
  {
    id: "P-196", platform: "Instagram",
    title: "Behind the scenes — our packaging redesign ✂️",
    thumbnail: "📦", publishedAt: "2d ago",
    commentCount: 421, newCount: 53,
    comments: [
      {
        id: "C-50", author: "Karen Mwangi", avatar: "KM",
        text: "The minimal kraft look is *chef's kiss* 🤌", at: "6h",
        sentiment: "positive", likes: 31, trigger: "praise",
        aiDraft: "Karen 🤍 thank you! Kraft was a bit of a gamble — so glad it's landing.",
        stage: "pending", priority: "low",
        sla: { dueIn: "5h 00m", breached: false },
      },
      {
        id: "C-51", author: "Theo Nakamura", avatar: "TN",
        text: "Is the new packaging actually recyclable end-to-end?", at: "5h",
        sentiment: "neutral", likes: 12, trigger: "product_inquiry",
        aiDraft: "Great question Theo — yes, every layer is curbside-recyclable.",
        stage: "in_review", priority: "high", assignee: "Priya S.",
        sla: { dueIn: "45m", breached: false },
      },
      {
        id: "C-52", author: "Mona Eliasson", avatar: "ME",
        text: "Mine arrived crushed last week tbh 😬", at: "4h",
        sentiment: "negative", likes: 3, trigger: "complaint",
        aiDraft: "Mona, that's not on — DM us your order # and we'll get a replacement out today.",
        stage: "escalated", priority: "urgent", assignee: "Sarah C.",
        sla: { dueIn: "OVERDUE 22m", breached: true },
      },
    ],
  },
  {
    id: "P-195", platform: "LinkedIn",
    title: "Q3 wrap: what worked, what didn't, what's next",
    thumbnail: "📊", publishedAt: "2d ago",
    commentCount: 256, newCount: 19,
    comments: [
      {
        id: "C-60", author: "Felix Andersen", avatar: "FA",
        text: "The candor here is refreshing — most Q3 posts are pure spin.", at: "8h",
        sentiment: "positive", likes: 18, trigger: "praise",
        aiDraft: "Thanks Felix 🙏 — being honest about misses helps more than another victory lap.",
        stage: "replied", priority: "medium", assignee: "Mike T.",
        sla: { dueIn: "—", breached: false },
      },
      {
        id: "C-61", author: "Harini Subramanian", avatar: "HS",
        text: "Curious what tooling you used for the attribution piece?", at: "7h",
        sentiment: "neutral", likes: 6, trigger: "product_inquiry",
        aiDraft: "Hi Harini! Mix of Dreamdata + a bit of internal SQL on the warehouse.",
        stage: "pending", priority: "medium",
        sla: { dueIn: "2h 50m", breached: false },
      },
    ],
  },
  {
    id: "P-194", platform: "GBP",
    title: "Westside branch — now open Saturdays",
    thumbnail: "🏪", publishedAt: "3d ago",
    commentCount: 64, newCount: 9,
    comments: [
      {
        id: "C-70", author: "Owen Pritchard", avatar: "OP",
        text: "Finally! Used to drive across town just for the Saturday hours.", at: "10h",
        sentiment: "positive", likes: 5, trigger: "praise",
        aiDraft: "So glad to hear that, Owen 🙌 — see you on a Saturday soon!",
        stage: "replied", priority: "low", assignee: "Mike T.",
        sla: { dueIn: "—", breached: false },
      },
      {
        id: "C-71", author: "Carla Núñez", avatar: "CN",
        text: "Are walk-ins okay on Saturdays or do I need to book?", at: "9h",
        sentiment: "neutral", likes: 1, trigger: "product_inquiry",
        aiDraft: "Hi Carla! Walk-ins are welcome — bookings just guarantee a slot if it's busy.",
        stage: "pending", priority: "medium",
        sla: { dueIn: "1h 25m", breached: false },
      },
    ],
  },
  {
    id: "P-193", platform: "Facebook",
    title: "Customer story: how Acme Co cut onboarding time by 60%",
    thumbnail: "📈", publishedAt: "3d ago",
    commentCount: 142, newCount: 11,
    comments: [
      {
        id: "C-80", author: "Iris Whitlock", avatar: "IW",
        text: "Would love a deeper case study PDF on this one.", at: "12h",
        sentiment: "positive", likes: 9, trigger: "product_inquiry",
        aiDraft: "Iris, perfect timing — the long-form PDF drops next Tuesday.",
        stage: "in_review", priority: "medium", assignee: "Priya S.",
        sla: { dueIn: "2h 00m", breached: false },
      },
      {
        id: "C-81", author: "Ravi Deshpande", avatar: "RD",
        text: "60% feels generous — what was the baseline?", at: "11h",
        sentiment: "neutral", likes: 5, trigger: "general",
        aiDraft: "Fair pushback Ravi — baseline was their pre-rollout 4-week onboarding cycle.",
        stage: "pending", priority: "medium",
        sla: { dueIn: "1h 45m", breached: false },
      },
    ],
  },
  {
    id: "P-192", platform: "Instagram",
    title: "Giveaway 🎁 — win a year of our Pro plan",
    thumbnail: "🎁", publishedAt: "4d ago",
    commentCount: 1284, newCount: 87,
    comments: [
      {
        id: "C-90", author: "Mae Olusanya", avatar: "MO",
        text: "Tagging @nina @sam @jules 🤞🤞", at: "1d",
        sentiment: "positive", likes: 2, trigger: "general",
        aiDraft: "Good luck Mae! 🍀 Make sure you're following so we can DM the winner.",
        stage: "pending", priority: "low",
        sla: { dueIn: "6h 00m", breached: false },
      },
      {
        id: "C-91", author: "Peter Rookwood", avatar: "PR",
        text: "How do you pick the winner — random or judged?", at: "1d",
        sentiment: "neutral", likes: 14, trigger: "product_inquiry",
        aiDraft: "Hey Peter — fully random pick from valid entries, drawn live on Friday's story.",
        stage: "in_review", priority: "medium", assignee: "Priya S.",
        sla: { dueIn: "4h 30m", breached: false },
      },
      {
        id: "C-92", author: "GIVEAWAY-BOT-9921", avatar: "GB",
        text: "WIN $$$$ FREE iPhone click >> bit.ly/xxxx", at: "23h",
        sentiment: "neutral", likes: 0, isSpam: true,
        stage: "pending", priority: "low",
        sla: { dueIn: "—", breached: false },
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
  const [platformFilter, setPlatformFilter] = useState<"all" | Platform>("all");
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setLastRefresh(new Date());
      toast.success("Inbox refreshed");
    }, 700);
  };

  // Flatten non-spam comments for queue/board/sentiment views
  const allCommentsRaw = useMemo(() => {
    const out: (Comment & { post: Post })[] = [];
    posts.forEach((p) => p.comments.forEach((c) => {
      if (!c.isSpam) out.push({ ...c, post: p });
      c.replies?.forEach((r) => !r.isSpam && out.push({ ...r, post: p }));
    }));
    return out;
  }, [posts]);

  const spamCommentsRaw = useMemo(
    () => posts.flatMap((p) => p.comments.filter((c) => c.isSpam).map((c) => ({ ...c, post: p }))),
    [posts],
  );

  const matchPlatform = <T extends { post: Post }>(arr: T[]) =>
    platformFilter === "all" ? arr : arr.filter((c) => c.post.platform === platformFilter);

  const allComments = useMemo(() => matchPlatform(allCommentsRaw), [allCommentsRaw, platformFilter]);
  const spamComments = useMemo(() => matchPlatform(spamCommentsRaw), [spamCommentsRaw, platformFilter]);
  const filteredPosts = useMemo(
    () => platformFilter === "all" ? posts : posts.filter((p) => p.platform === platformFilter),
    [posts, platformFilter],
  );

  /** Unfiltered platform counts — drives the filter pills */
  const platformCounts = useMemo(() => {
    const counts: Record<"all" | Platform, number> = {
      all: allCommentsRaw.length,
      Instagram: 0, Facebook: 0, LinkedIn: 0, Twitter: 0, GBP: 0,
    };
    allCommentsRaw.forEach((c) => { counts[c.post.platform]++; });
    return counts;
  }, [allCommentsRaw]);

  const summary = useMemo(() => ({
    pending: allComments.filter((c) => c.stage === "pending").length + 14,
    urgent: allComments.filter((c) => c.priority === "urgent" && c.stage !== "replied").length + 3,
    breached: allComments.filter((c) => c.sla.breached).length + 5,
    replied: allComments.filter((c) => c.stage === "replied").length + 142,
    spam: spamComments.length + 27,
  }), [allComments, spamComments]);

  /* mutate helpers — recursive so nested replies at any depth update correctly */
  const patchTree = (list: Comment[], id: string, patch: Partial<Comment>): Comment[] =>
    list.map((c) => {
      if (c.id === id) return { ...c, ...patch };
      if (c.replies?.length) return { ...c, replies: patchTree(c.replies, id, patch) };
      return c;
    });

  const updateComment = (id: string, patch: Partial<Comment>) => {
    setPosts((prev) => prev.map((p) => ({ ...p, comments: patchTree(p.comments, id, patch) })));
  };

  /**
   * Instagram-style threading — replies always attach to the TOP-LEVEL parent.
   * If the user replies to a nested reply, we resolve the top-level ancestor
   * and prefix the text with @author so context is preserved.
   */
  const findTopLevelParent = (
    list: Comment[],
    id: string,
  ): { top: Comment; target: Comment } | null => {
    for (const c of list) {
      if (c.id === id) return { top: c, target: c };
      if (c.replies?.length) {
        const hit = c.replies.find((r) => r.id === id);
        if (hit) return { top: c, target: hit };
      }
    }
    return null;
  };

  const addReply = (parentId: string, text: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        const found = findTopLevelParent(p.comments, parentId);
        if (!found) return p;
        const isNested = found.top.id !== found.target.id;
        const reply: Comment = {
          id: `R-${Date.now()}`,
          author: "You",
          avatar: "YO",
          text: isNested ? `@${found.target.author} ${text}` : text,
          at: "just now",
          sentiment: "positive",
          likes: 0,
          stage: "replied",
          priority: "low",
          sla: { dueIn: "—", breached: false },
        };
        return {
          ...p,
          comments: p.comments.map((c) =>
            c.id === found.top.id ? { ...c, replies: [...(c.replies ?? []), reply] } : c,
          ),
        };
      }),
    );
    toast.success("Reply posted");
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

      {/* Global toolbar: platform filter + refresh */}
      <div className="bg-card rounded-xl border border-border p-3 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Platform</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {(["all", "Instagram", "Facebook", "LinkedIn", "Twitter", "GBP"] as const).map((p) => {
            const active = platformFilter === p;
            const count = platformCounts[p];
            return (
              <button
                key={p}
                onClick={() => setPlatformFilter(p)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors",
                  active
                    ? "bg-foreground text-background border-foreground shadow-sm"
                    : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-foreground/30",
                )}
              >
                {p !== "all" && <PlatformIcon name={p as Platform} className="w-3 h-3" />}
                {p === "all" ? "All platforms" : p}
                <span className={cn(
                  "text-[10px] tabular-nums px-1.5 rounded-full font-semibold",
                  active ? "bg-background/20 text-background" : "bg-muted text-muted-foreground",
                )}>
                  {fmt(count)}
                </span>
              </button>
            );
          })}
        </div>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-[10px] text-muted-foreground hidden sm:inline">
            Updated {lastRefresh.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing} className="gap-1.5 h-8">
            <RefreshCw className={cn("w-3.5 h-3.5", refreshing && "animate-spin")} />
            Refresh
          </Button>
        </div>
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
              <span className="ml-0.5 text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">{fmt(summary.spam)}</span>
            )}
            {t.id === "queue" && summary.pending > 0 && (
              <span className="ml-0.5 text-[10px] bg-primary/15 text-primary px-1.5 py-0.5 rounded-full font-semibold">{fmt(summary.pending)}</span>
            )}
          </button>
        ))}
      </div>

      {/* Active filter banner */}
      {platformFilter !== "all" && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 rounded-lg px-3 py-2 border border-border">
          <PlatformIcon name={platformFilter as Platform} className="w-3.5 h-3.5" />
          Filtered by <span className="font-semibold text-foreground">{platformFilter}</span> · {platformCounts[platformFilter]} comments
          <button onClick={() => setPlatformFilter("all")} className="ml-auto text-primary hover:underline inline-flex items-center gap-1">
            <X className="w-3 h-3" /> Clear filter
          </button>
        </div>
      )}

      {tab === "queue" && <ReplyQueueView comments={allComments} updateComment={updateComment} />}
      {tab === "board" && <BoardView comments={allComments} updateComment={updateComment} />}
      {tab === "threads" && <ThreadsView posts={filteredPosts.filter((p) => p.comments.some((c) => !c.isSpam))} updateComment={updateComment} addReply={addReply} />}
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
  const queue = useMemo(
    () => comments.filter((c) => c.stage === "pending" || c.stage === "in_review"),
    [comments],
  );
  const [activeId, setActiveId] = useState<string | null>(queue[0]?.id ?? null);

  // Re-sync active card when the queue changes (e.g. platform filter / spam / approve)
  const active = queue.find((c) => c.id === activeId) ?? queue[0];
  const effectiveActiveId = active?.id ?? null;

  const [draft, setDraft] = useState(active?.aiDraft ?? "");
  const [lastDraftFor, setLastDraftFor] = useState<string | null>(effectiveActiveId);
  if (effectiveActiveId !== lastDraftFor) {
    // Active card swapped out from under us — refresh draft to match.
    setLastDraftFor(effectiveActiveId);
    setDraft(active?.aiDraft ?? "");
  }

  const switchTo = (id: string) => {
    setActiveId(id);
    const next = comments.find((c) => c.id === id);
    setDraft(next?.aiDraft ?? "");
    setLastDraftFor(id);
  };

  const advance = () => {
    const next = queue.find((c) => c.id !== active?.id);
    if (next) switchTo(next.id);
    else setActiveId(null);
  };

  const approve = () => {
    if (!active) return;
    updateComment(active.id, { stage: "replied" });
    toast.success("Reply approved & sent");
    advance();
  };

  const escalate = () => {
    if (!active) return;
    updateComment(active.id, { stage: "escalated" });
    toast.warning("Escalated to senior ORM");
    advance();
  };

  const markSpam = () => {
    if (!active) return;
    updateComment(active.id, { isSpam: true });
    toast.success("Marked as spam");
    advance();
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
        <div className="px-4 py-2.5 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
          <span className="text-xs font-semibold text-foreground">Awaiting review</span>
          <span className="text-[10px] text-muted-foreground">
            <span className="font-bold text-foreground tabular-nums">{fmt(queue.length)}</span> comments
          </span>
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
              <Button variant="ghost" size="sm" onClick={markSpam} className="gap-1.5 text-muted-foreground">
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
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<Stage | null>(null);

  const handleDrop = (stage: Stage) => {
    if (draggingId) {
      const card = comments.find((c) => c.id === draggingId);
      if (card && card.stage !== stage) {
        updateComment(draggingId, { stage });
        toast.success(`Moved to ${STAGES.find((s) => s.id === stage)?.label}`);
      }
    }
    setDraggingId(null);
    setDropTarget(null);
  };

  return (
    <div className="space-y-4">
      {/* Workload */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex items-start gap-2 mb-3">
          <Users className="w-3.5 h-3.5 text-muted-foreground mt-0.5" />
          <div className="flex-1">
            <h3 className="text-xs font-semibold text-foreground">Team workload</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Active comments currently assigned to each ORM team member. Use this to rebalance — drag cards below to reassign or move stages.
            </p>
          </div>
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

      {/* Drag hint */}
      <div className="flex items-center justify-end">
        <span className="text-[10px] text-muted-foreground inline-flex items-center gap-1">
          <Zap className="w-3 h-3" /> Drag cards between columns — or use the ⋯ menu on each card to move or mark spam
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {STAGES.map((stage) => {
          const items = comments.filter((c) => c.stage === stage.id);
          const isDropTarget = dropTarget === stage.id;
          return (
            <div
              key={stage.id}
              onDragOver={(e) => { e.preventDefault(); setDropTarget(stage.id); }}
              onDragLeave={(e) => {
                // Only clear if leaving the column entirely
                if (!e.currentTarget.contains(e.relatedTarget as Node)) setDropTarget(null);
              }}
              onDrop={() => handleDrop(stage.id)}
              className={cn(
                "bg-muted/40 rounded-xl p-3 min-h-[480px] transition-colors",
                isDropTarget && "bg-primary/10 ring-2 ring-primary/40",
              )}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className={cn("w-2 h-2 rounded-full", stage.dot)} />
                <h3 className="text-xs font-semibold text-foreground">{stage.label}</h3>
                <span className="text-[10px] text-muted-foreground bg-card px-1.5 py-0.5 rounded">{fmt(items.length)}</span>
              </div>
              <div className="space-y-2">
                {items.map((c) => {
                  const sm = sentimentMeta[c.sentiment];
                  const dragging = draggingId === c.id;
                  return (
                    <div
                      key={c.id}
                      draggable
                      onDragStart={(e) => {
                        setDraggingId(c.id);
                        e.dataTransfer.effectAllowed = "move";
                      }}
                      onDragEnd={() => { setDraggingId(null); setDropTarget(null); }}
                      className={cn(
                        "group bg-card border rounded-lg p-2.5 transition-all cursor-grab active:cursor-grabbing select-none",
                        c.sla.breached ? "border-l-2 border-l-error border-border" : "border-border",
                        dragging ? "opacity-40 rotate-1 shadow-lg" : "hover:border-border-hover hover:shadow-sm",
                      )}
                    >
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="text-[10px] font-mono text-muted-foreground">{c.id}</span>
                        <PlatformIcon name={c.post.platform} className="w-3 h-3" />
                        <span className={cn("text-[9px] px-1.5 py-0.5 rounded-full font-medium capitalize ml-auto", priorityStyles[c.priority])}>
                          {c.priority}
                        </span>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={(e) => e.stopPropagation()}
                            className="w-5 h-5 rounded hover:bg-muted text-muted-foreground hover:text-foreground inline-flex items-center justify-center -my-1 -mr-1"
                            aria-label="Card actions"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">
                              Move to
                            </DropdownMenuLabel>
                            {STAGES.map((s) => (
                              <DropdownMenuItem
                                key={s.id}
                                disabled={s.id === c.stage}
                                onClick={() => {
                                  updateComment(c.id, { stage: s.id });
                                  toast.success(`Moved to ${s.label}`);
                                }}
                                className="text-xs gap-2"
                              >
                                <span className={cn("w-2 h-2 rounded-full", s.dot)} />
                                {s.label}
                                {s.id === c.stage && <Check className="w-3 h-3 ml-auto text-muted-foreground" />}
                              </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                updateComment(c.id, { isSpam: true });
                                toast.success("Marked as spam — moved to Spam Queue");
                              }}
                              className="text-xs gap-2 text-error focus:text-error"
                            >
                              <Shield className="w-3 h-3" /> Mark as spam
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
                    </div>
                  );
                })}
                {items.length === 0 && (
                  <div className={cn(
                    "text-[11px] text-center py-6 rounded-lg border border-dashed transition-colors",
                    isDropTarget ? "border-primary text-primary bg-primary/5" : "border-border text-muted-foreground",
                  )}>
                    {isDropTarget ? "Drop here" : "Empty"}
                  </div>
                )}
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

type ThreadFilter = "all" | "new" | "awaiting" | "replied";

const FILLER_SAMPLES: { author: string; avatar: string; text: string; sentiment: Sentiment }[] = [
  { author: "Aria Patel", avatar: "AP", text: "Love this 🙌 keep it up!", sentiment: "positive" },
  { author: "Noah Kim", avatar: "NK", text: "Just shared with my team — super helpful.", sentiment: "positive" },
  { author: "Lia Romano", avatar: "LR", text: "Quick q — does this apply to enterprise plans too?", sentiment: "neutral" },
  { author: "Ben Carter", avatar: "BC", text: "Been waiting for this update for ages 🎉", sentiment: "positive" },
  { author: "Sana Iqbal", avatar: "SI", text: "How does this compare to last year's release?", sentiment: "neutral" },
  { author: "Owen Reyes", avatar: "OR", text: "Following along — keep them coming.", sentiment: "neutral" },
  { author: "Mira Chen", avatar: "MC", text: "Honestly the best update so far this year.", sentiment: "positive" },
  { author: "Jacob Hill", avatar: "JH", text: "Tagging the team — we should try this.", sentiment: "positive" },
  { author: "Eva Mendes", avatar: "EM", text: "When will EU customers see this rolled out?", sentiment: "neutral" },
  { author: "Tariq Yusuf", avatar: "TY", text: "Could the docs link be added to the post?", sentiment: "neutral" },
  { author: "Hana Kobayashi", avatar: "HK", text: "Beautiful work — visuals are 🔥", sentiment: "positive" },
  { author: "Diego Salas", avatar: "DS", text: "Took me 5 mins to set up. Smooth.", sentiment: "positive" },
  { author: "Lukas Weber", avatar: "LW", text: "Not sure I agree with the pricing change tbh.", sentiment: "negative" },
  { author: "Yara Haddad", avatar: "YH", text: "Will there be a webinar walkthrough?", sentiment: "neutral" },
  { author: "Sven Eriksson", avatar: "SE", text: "Big upgrade from last quarter, well done team.", sentiment: "positive" },
];

/** Build a realistic dense thread for a post — pads up to commentCount with synthetic items.
 *  Stage mix is roughly: 65% replied (older), 10% in_review, 25% pending (the "new" bucket). */
function buildDenseThread(p: Post): { items: Comment[]; isNewById: Set<string> } {
  const real = p.comments.filter((c) => !c.isSpam);
  const isNewById = new Set<string>();
  // Real "new" items = pending or in_review (not yet handled)
  real.forEach((c) => {
    if (c.stage === "pending" || c.stage === "in_review") isNewById.add(c.id);
  });
  const target = Math.max(real.length, p.commentCount);
  const fillerNeeded = Math.max(0, target - real.length);
  // newCount drives how many filler items should appear as "new" (pending)
  const fillerNewSlots = Math.max(0, p.newCount - Array.from(isNewById).length);

  const filler: Comment[] = Array.from({ length: fillerNeeded }, (_, i) => {
    const s = FILLER_SAMPLES[i % FILLER_SAMPLES.length];
    const id = `${p.id}-F-${i}`;
    let stage: Stage;
    if (i < fillerNewSlots) {
      // First N filler items are the "new" backlog — split between pending & in_review
      stage = i % 4 === 0 ? "in_review" : "pending";
      isNewById.add(id);
    } else {
      // Older comments — mostly already replied
      stage = i % 9 === 0 ? "in_review" : "replied";
    }
    const ageHours = i + 1;
    const age = ageHours < 24 ? `${ageHours}h` : `${Math.floor(ageHours / 24)}d`;
    return {
      id,
      author: s.author, avatar: s.avatar, text: s.text,
      at: age,
      sentiment: s.sentiment,
      likes: ((i * 5) % 18),
      stage,
      assignee: stage === "in_review" ? "Priya S." : stage === "replied" ? "Mike T." : undefined,
      priority: "low",
      sla: { dueIn: stage === "replied" ? "—" : `${1 + (i % 6)}h ${(i * 7) % 60}m`, breached: false },
    };
  });
  return { items: [...real, ...filler], isNewById };
}

function ThreadsView({
  posts, updateComment, addReply,
}: {
  posts: Post[];
  updateComment: (id: string, patch: Partial<Comment>) => void;
  addReply: (parentId: string, text: string) => void;
}) {
  // Default: every post expanded
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set(posts.map((p) => p.id)));

  const toggle = (id: string) =>
    setOpenIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const allOpen = posts.length > 0 && posts.every((p) => openIds.has(p.id));
  const totalNew = posts.reduce((s, p) => s + p.newCount, 0);
  const totalAwaiting = posts.reduce(
    (s, p) => s + p.comments.filter((c) => !c.isSpam && (c.stage === "pending" || c.stage === "in_review")).length + p.newCount,
    0,
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground tabular-nums">{fmt(posts.length)}</span> posts ·{" "}
          <span className="font-semibold text-foreground tabular-nums">{fmt(totalNew)}</span> new ·{" "}
          <span className="font-semibold text-foreground tabular-nums">{fmt(totalAwaiting)}</span> awaiting reply
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpenIds(allOpen ? new Set() : new Set(posts.map((p) => p.id)))}
          className="h-7 text-[11px] gap-1.5"
        >
          {allOpen ? "Collapse all" : "Expand all"}
        </Button>
      </div>

      {posts.map((p) => (
        <PostThread
          key={p.id}
          post={p}
          open={openIds.has(p.id)}
          onToggle={() => toggle(p.id)}
          updateComment={updateComment}
          addReply={addReply}
        />
      ))}
    </div>
  );
}

function PostThread({
  post: p, open, onToggle, updateComment, addReply,
}: {
  post: Post;
  open: boolean;
  onToggle: () => void;
  updateComment: (id: string, patch: Partial<Comment>) => void;
  addReply: (parentId: string, text: string) => void;
}) {
  const [filter, setFilter] = useState<ThreadFilter>("all");
  const { items, isNewById } = useMemo(() => buildDenseThread(p), [p]);

  const counts = useMemo(() => {
    const newCnt = items.filter((c) => isNewById.has(c.id)).length;
    const awaiting = items.filter((c) => c.stage === "pending" || c.stage === "in_review").length;
    const replied = items.filter((c) => c.stage === "replied").length;
    return { all: items.length, new: newCnt, awaiting, replied };
  }, [items, isNewById]);

  const filtered = useMemo(() => {
    switch (filter) {
      case "new": return items.filter((c) => isNewById.has(c.id));
      case "awaiting": return items.filter((c) => c.stage === "pending" || c.stage === "in_review");
      case "replied": return items.filter((c) => c.stage === "replied");
      default: return items;
    }
  }, [filter, items, isNewById]);

  const chips: { id: ThreadFilter; label: string; count: number; tone: string }[] = [
    { id: "all", label: "All", count: counts.all, tone: "bg-muted text-muted-foreground" },
    { id: "new", label: "New", count: counts.new, tone: "bg-primary/15 text-primary" },
    { id: "awaiting", label: "Awaiting reply", count: counts.awaiting, tone: "bg-warning/15 text-warning" },
    { id: "replied", label: "Replied", count: counts.replied, tone: "bg-success/15 text-success" },
  ];

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <button
        onClick={onToggle}
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
        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 text-muted-foreground" title="Total comments on this post">
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="font-semibold text-foreground tabular-nums">{fmt(p.commentCount)}</span>
          </span>
          <span className="text-muted-foreground">·</span>
          <span
            className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground font-bold tabular-nums"
            title={`${fmt(p.newCount)} new comments since last visit`}
          >
            {fmt(p.newCount)} new
          </span>
          {counts.awaiting > 0 && (
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full bg-warning/15 text-warning font-semibold tabular-nums"
              title="Awaiting your reply"
            >
              {fmt(counts.awaiting)} to reply
            </span>
          )}
        </div>
      </button>

      {open && (
        <div className="border-t border-border bg-muted/20">
          {/* Filter chip row — explains the 247-vs-32 relationship */}
          <div className="px-4 py-2.5 border-b border-border bg-card/60 flex items-center gap-2 flex-wrap">
            <Filter className="w-3.5 h-3.5 text-muted-foreground" />
            {chips.map((ch) => {
              const active = filter === ch.id;
              return (
                <button
                  key={ch.id}
                  onClick={() => setFilter(ch.id)}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium transition-colors",
                    active
                      ? "bg-foreground text-background border-foreground"
                      : "bg-card text-muted-foreground border-border hover:text-foreground",
                  )}
                >
                  {ch.label}
                  <span className={cn("text-[10px] tabular-nums px-1.5 rounded-full font-semibold", active ? "bg-background/20 text-background" : ch.tone)}>
                    {fmt(ch.count)}
                  </span>
                </button>
              );
            })}
            <span className="ml-auto text-[10px] text-muted-foreground tabular-nums">
              Showing <span className="font-semibold text-foreground">{fmt(filtered.length)}</span> of {fmt(p.commentCount)}
            </span>
          </div>

          {/* Inner-scrollable thread */}
          <div className="p-4 space-y-3 max-h-[520px] overflow-y-auto">
            {filtered.map((c) => (
              <div key={c.id} className="relative">
                {isNewById.has(c.id) && (
                  <span className="absolute -left-1 top-3 w-1.5 h-1.5 rounded-full bg-primary" title="New since last visit" />
                )}
                <CommentNode
                  comment={c}
                  depth={0}
                  updateComment={updateComment}
                  addReply={addReply}
                />
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-[11px] text-center py-8 text-muted-foreground">
                No comments match this filter.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CommentNode({
  comment, depth, updateComment, addReply,
}: {
  comment: Comment; depth: number;
  updateComment: (id: string, patch: Partial<Comment>) => void;
  addReply: (parentId: string, text: string) => void;
}) {
  const sm = sentimentMeta[comment.sentiment];
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState(comment.aiDraft ?? "");

  const submit = () => {
    const text = replyText.trim();
    if (!text) return;
    addReply(comment.id, text);
    setReplyText("");
    setReplyOpen(false);
  };

  return (
    <div className="relative">

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
              <button onClick={() => setReplyOpen((o) => !o)} className="inline-flex items-center gap-1 hover:text-foreground">
                <ArrowRight className="w-3 h-3" />{replyOpen ? "Cancel" : "Reply"}
              </button>
              {comment.aiDraft && !replyOpen && (
                <button
                  onClick={() => { setReplyText(comment.aiDraft!); setReplyOpen(true); }}
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                >
                  <Bot className="w-3 h-3" />Use AI draft
                </button>
              )}
            </div>

            {replyOpen && (
              <div className="mt-3 space-y-2">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                    YO
                  </div>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Reply to ${comment.author}…`}
                    rows={2}
                    autoFocus
                    className="flex-1 px-3 py-2 rounded-lg border border-input text-sm bg-background outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                </div>
                <div className="flex items-center gap-2 justify-end">
                  {comment.aiDraft && (
                    <button
                      onClick={() => setReplyText(comment.aiDraft!)}
                      className="text-[11px] text-primary inline-flex items-center gap-1 hover:underline"
                    >
                      <Sparkles className="w-3 h-3" />Insert AI draft
                    </button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => { setReplyOpen(false); setReplyText(""); }}>Cancel</Button>
                  <Button size="sm" onClick={submit} disabled={!replyText.trim()} className="gap-1.5">
                    <Send className="w-3 h-3" /> Reply
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {depth === 0 && comment.replies && comment.replies.length > 0 && (
        <div className="mt-2 space-y-2 ml-10 pl-3 border-l border-border">
          {/* Instagram-style: all replies in a single flat thread under the top comment */}
          {comment.replies.map((r) => (
            <CommentNode key={r.id} comment={r} depth={1} updateComment={updateComment} addReply={addReply} />
          ))}
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
  const filtered = comments.filter((c) => filter === "all" || c.sentiment === filter);

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

      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mr-1">Sentiment</span>
        {(["all", "positive", "neutral", "negative"] as const).map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={cn(
              "px-2.5 py-1 rounded-full border text-xs font-medium capitalize transition-colors",
              filter === s ? "bg-foreground text-background border-foreground" : "bg-card text-muted-foreground border-border hover:text-foreground",
            )}>
            {s === "all" ? "All" : s}
          </button>
        ))}
        <span className="ml-auto text-[10px] text-muted-foreground tabular-nums">
          Showing <span className="font-semibold text-foreground">{fmt(filtered.length)}</span> of {fmt(comments.length)}
        </span>
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
              <Switch checked={t.enabled} onCheckedChange={() => toggle(t.id)} className="flex-shrink-0" />

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
