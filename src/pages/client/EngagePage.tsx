import { useEffect, useMemo, useRef, useState } from "react";
import {
  Inbox, KanbanSquare, MessageSquare, AlertTriangle, Clock, CheckCircle2,
  Facebook, Instagram, Linkedin, Twitter, Send, Sparkles, Filter, Search,
  ArrowRight, MoreVertical, MapPin, Shield, Shuffle, Trash2, Plus,
  ThumbsUp, ThumbsDown, Edit3, RefreshCw, Smile, Meh, Frown, ListTree,
  Bot, Users, Zap, X, Check, AtSign, Mail, Star, ArrowDownUp, ChevronDown,
  ExternalLink, Image as ImageIcon, Heart, Bookmark, Share2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
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

type Stage = "pending" | "in_review" | "replied";
type Priority = "low" | "medium" | "high";
type Sentiment = "positive" | "neutral" | "negative";
type Platform = "Instagram" | "Facebook" | "LinkedIn" | "Twitter" | "GBP";
type Trigger = "anniversary" | "product_inquiry" | "job_application" | "praise" | "complaint" | "general" | "price_request" | "discount_request" | "order_status" | "return_exchange" | "potential_lead" | "question" | "negative_comment";

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
  imageUrl?: string;
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
];

const priorityStyles: Record<Priority, string> = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-info/15 text-info",
  high: "bg-warning/15 text-warning",
};

const sentimentMeta: Record<Sentiment, { color: string; bg: string; Icon: typeof Smile; label: string }> = {
  positive: { color: "text-success", bg: "bg-success/10", Icon: Smile, label: "Positive" },
  neutral: { color: "text-muted-foreground", bg: "bg-muted", Icon: Meh, label: "Neutral" },
  negative: { color: "text-error", bg: "bg-error/10", Icon: Frown, label: "Negative" },
};

function SentimentBadge({ sentiment, onChange }: { sentiment: Sentiment; onChange?: (s: Sentiment) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const sm = sentimentMeta[sentiment];

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  if (!onChange) {
    return (
      <span className={cn("inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0", sm.bg, sm.color)}>
        <sm.Icon className="w-3 h-3" /> {sm.label}
      </span>
    );
  }

  return (
    <div ref={ref} className="relative inline-flex shrink-0">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        className={cn(
          "inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full transition-opacity hover:opacity-80",
          sm.bg, sm.color,
        )}
      >
        <sm.Icon className="w-3 h-3" />
        {sm.label}
        <ChevronDown className="w-2.5 h-2.5 opacity-60" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-popover border border-border rounded-xl shadow-lg overflow-hidden min-w-[130px]">
          {(["positive", "neutral", "negative"] as Sentiment[]).map((s) => {
            const meta = sentimentMeta[s];
            const active = s === sentiment;
            return (
              <button
                key={s}
                onClick={(e) => { e.stopPropagation(); onChange(s); setOpen(false); }}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 text-xs font-medium transition-colors hover:bg-muted/60",
                  active ? cn(meta.bg, meta.color) : "text-foreground",
                )}
              >
                <meta.Icon className="w-3.5 h-3.5" />
                {meta.label}
                {active && <Check className="w-3 h-3 ml-auto opacity-70" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Canonical tag labels — single source of truth for both comment badges and filter modal
const TAGS = [
  "Complaint", "Negative Comment", "Praise", "Product Inquiry", "Question",
  "Job Application", "Price Request", "Discount Request", "Order Status",
  "Return/Exchange", "Potential Lead", "Unclassified",
] as const;

// Map auto-detected trigger → canonical tag label
const triggerToTag: Record<Trigger, string> = {
  anniversary:      "Praise",
  product_inquiry:  "Product Inquiry",
  job_application:  "Job Application",
  praise:           "Praise",
  complaint:        "Complaint",
  general:          "Unclassified",
  price_request:    "Price Request",
  discount_request: "Discount Request",
  order_status:     "Order Status",
  return_exchange:  "Return/Exchange",
  potential_lead:   "Potential Lead",
  question:         "Question",
  negative_comment: "Negative Comment",
};

// Single color map keyed by tag label — used everywhere
const TAG_COLORS: Record<string, string> = {
  "Complaint":        "bg-error/10 text-error",
  "Negative Comment": "bg-error/10 text-error",
  "Praise":           "bg-success/10 text-success",
  "Potential Lead":   "bg-success/10 text-success",
  "Product Inquiry":  "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "Question":         "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "Job Application":  "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  "Price Request":    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  "Discount Request": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  "Order Status":     "bg-warning/10 text-warning",
  "Return/Exchange":  "bg-warning/10 text-warning",
  "Unclassified":     "bg-muted text-muted-foreground",
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
    thumbnail: "🎂", imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop", publishedAt: "2h ago",
    commentCount: 247, newCount: 32,
    comments: [
      {
        id: "C-1", author: "Sarah Johnson", avatar: "SJ",
        text: "Happy 5 years! 🎉 Wishing you many more!", at: "12m",
        sentiment: "positive", likes: 4, trigger: "anniversary",
        aiDraft: "Thank you so much, Sarah! 💛 Five years has flown by — couldn't have done it without supporters like you. Here's to many more!",
        stage: "pending", priority: "low",
        sla: { dueIn: "3h 48m", breached: false },
        replies: (() => {
          const seeds: Array<{ a: string; av: string; t: string; s: "positive" | "neutral" | "negative"; tr?: Trigger }> = [
            { a: "Mike Chen", av: "MC", t: "Seconded! Such an inspiring journey.", s: "positive", tr: "praise" },
            { a: "Lara Petrov", av: "LP", t: "Huge congrats — been following since the beta days 🙌", s: "positive", tr: "anniversary" },
            { a: "Noah Kimura", av: "NK", t: "5 years already? Insane growth, well deserved.", s: "positive", tr: "praise" },
            { a: "Priya Shah", av: "PS", t: "Cheers to the team behind the scenes 🥂", s: "positive", tr: "anniversary" },
            { a: "Diego Alvarez", av: "DA", t: "What a milestone — onto the next chapter!", s: "positive", tr: "praise" },
            { a: "Sofia Rossi", av: "SR", t: "Confetti everywhere 🎊 congrats!!", s: "positive", tr: "anniversary" },
            { a: "Ahmed Karim", av: "AK", t: "Quality has only gone up year over year. Respect.", s: "positive", tr: "praise" },
            { a: "Yuki Tanaka", av: "YT", t: "Five years of consistency is no small feat 👏", s: "positive", tr: "praise" },
            { a: "Ben Carter", av: "BC", t: "Will there be an anniversary drop? 👀", s: "neutral", tr: "product_inquiry" },
            { a: "Zara Hussain", av: "ZH", t: "Love the team, love the brand. Keep going!", s: "positive", tr: "praise" },
            { a: "Marco Bianchi", av: "MB", t: "Toasting from Milan tonight 🍷", s: "positive", tr: "anniversary" },
            { a: "Hannah Becker", av: "HB", t: "Such an inspiring story — congrats team!", s: "positive", tr: "praise" },
            { a: "Tariq Mensah", av: "TM", t: "5 down, 50 to go 🚀", s: "positive", tr: "praise" },
            { a: "Elena Voss", av: "EV", t: "Can we get a behind-the-scenes anniversary post? 🙏", s: "neutral", tr: "question" },
            { a: "Ravi Iyer", av: "RI", t: "Watching from day one — super proud.", s: "positive", tr: "praise" },
            { a: "Camille Dubois", av: "CD", t: "Bravo 👏 the brand has only gotten better.", s: "positive", tr: "praise" },
            { a: "Jonas Lindberg", av: "JL", t: "Anniversary giveaway? Asking for a friend 😄", s: "neutral", tr: "discount_request" },
            { a: "Isabela Costa", av: "IC", t: "Sending love from São Paulo 💛", s: "positive", tr: "anniversary" },
            { a: "Owen Walsh", av: "OW", t: "Thanks for 5 years of great products!", s: "positive", tr: "praise" },
            { a: "Mei Lin", av: "ML", t: "Here's to many more — proud customer ❤️", s: "positive", tr: "anniversary" },
          ];
          return seeds.map((r, i) => ({
            id: `C-1-r${i + 1}`,
            author: r.a, avatar: r.av, text: r.t, at: `${i + 2}m`,
            sentiment: r.s, likes: (i * 2) % 7,
            trigger: r.tr,
            stage: (i % 6 === 0 ? "pending" : "replied") as Stage,
            priority: "low" as const,
            sla: { dueIn: i % 6 === 0 ? `${2 + i}h` : "—", breached: false },
          }));
        })(),
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
      {
        id: "C-8", author: "Preethi Nair", avatar: "PN",
        text: "How much is the limited-edition anniversary box? Can't find the price anywhere 👀", at: "1h 10m",
        sentiment: "neutral", likes: 3, trigger: "price_request",
        aiDraft: "Hi Preethi! The anniversary box is $49 — link in bio to grab yours before they sell out! 🎁",
        stage: "pending", priority: "medium",
        sla: { dueIn: "2h 40m", breached: false },
      },
      {
        id: "C-9", author: "Bolu Adeyemi", avatar: "BA",
        text: "We're looking for brand partners for our upcoming campaign — who's the right person to contact?", at: "1h 20m",
        sentiment: "positive", likes: 1, trigger: "potential_lead",
        aiDraft: "Hi Bolu! Thanks for reaching out 🙌 Please DM us or email partnerships@yourbrand.com and our team will get back to you.",
        stage: "pending", priority: "medium",
        sla: { dueIn: "2h 30m", breached: false },
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
        stage: "in_review", priority: "high", assignee: "Sarah C.",
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
        sentiment: "neutral", likes: 0, trigger: "question",
        aiDraft: "Hi Riya! These hours are permanent through the season — we'll review again in spring.",
        stage: "pending", priority: "high",
        sla: { dueIn: "1h 05m", breached: false },
      },
      {
        id: "C-14", author: "Anonymous", avatar: "AN",
        text: "★ rude staff", at: "8h",
        sentiment: "negative", likes: 0, trigger: "negative_comment",
        aiDraft: "We're really sorry to hear this. Could you share more about your visit so we can look into it?",
        stage: "pending", priority: "high",
        sla: { dueIn: "OVERDUE 2h", breached: true },
      },
      {
        id: "C-15", author: "James Okafor", avatar: "JO",
        text: "I placed a click-and-collect order 2 days ago — still no confirmation. Can someone check the status?", at: "6h",
        sentiment: "neutral", likes: 0, trigger: "order_status",
        aiDraft: "Hi James, sorry for the delay! Could you DM us your order number? We'll check and get back to you within the hour.",
        stage: "pending", priority: "high",
        sla: { dueIn: "30m", breached: false },
      },
      {
        id: "C-16", author: "Nina Holst", avatar: "NH",
        text: "Do the new hours apply to the drive-through as well?", at: "5h",
        sentiment: "neutral", likes: 2, trigger: "question",
        aiDraft: "Hi Nina! Yes — drive-through follows the same updated hours. See you soon! ☕",
        stage: "pending", priority: "medium",
        sla: { dueIn: "1h 40m", breached: false },
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
        sentiment: "neutral", likes: 6, trigger: "question",
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
        sentiment: "neutral", likes: 1, trigger: "question",
        aiDraft: "Yes Elena — round 2 is a 45-min portfolio walkthrough with the design team. Full process is in the JD.",
        stage: "pending", priority: "low",
        sla: { dueIn: "5h 10m", breached: false },
      },
      {
        id: "C-24", author: "Kwame Asante", avatar: "KA",
        text: "What's the team size for this role? Would love to understand the scope before applying.", at: "7h",
        sentiment: "neutral", likes: 4, trigger: "question",
        aiDraft: "Hi Kwame! The design team is 6 people. This role partners closely with product and engineering across 3 squads.",
        stage: "pending", priority: "low",
        sla: { dueIn: "4h 50m", breached: false },
      },
      {
        id: "C-25", author: "Lucia Ferrara", avatar: "LF",
        text: "Would you consider a fractional / freelance arrangement instead of full-time? My portfolio aligns well.", at: "8h",
        sentiment: "positive", likes: 2, trigger: "potential_lead",
        aiDraft: "Hi Lucia! We're focused on full-time for now, but feel free to send your portfolio to talent@yourbrand.com — we keep a freelance bench for project work!",
        stage: "in_review", priority: "medium", assignee: "Priya S.",
        sla: { dueIn: "3h 20m", breached: false },
      },
    ],
  },
  {
    id: "P-198", platform: "Facebook",
    title: "New product launch — Spring Collection ‘26",
    thumbnail: "🌸", imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=400&fit=crop", publishedAt: "1d ago",
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
      {
        id: "C-33", author: "Amara Diallo", avatar: "AD",
        text: "I need to return the linen trousers from the last collection — they shrank after one wash 😕", at: "7h",
        sentiment: "negative", likes: 0, trigger: "return_exchange",
        aiDraft: "Hi Amara, we're really sorry about that! Please DM us your order number and we'll arrange a free return and replacement right away.",
        stage: "pending", priority: "high",
        sla: { dueIn: "1h 10m", breached: false },
      },
      {
        id: "C-34", author: "Tom Greer", avatar: "TG",
        text: "Any discount for first-time buyers? Considering grabbing 2–3 pieces.", at: "8h",
        sentiment: "neutral", likes: 3, trigger: "discount_request",
        aiDraft: "Hi Tom! Use code WELCOME15 at checkout for 15% off your first order 🎉 Enjoy the Spring Collection!",
        stage: "pending", priority: "medium",
        sla: { dueIn: "2h 00m", breached: false },
      },
      {
        id: "C-35", author: "Fatou Dieng", avatar: "FD",
        text: "What's the full price for the spring bundle — the complete 5-piece set?", at: "9h",
        sentiment: "neutral", likes: 1, trigger: "price_request",
        aiDraft: "Hi Fatou! The 5-piece spring bundle is $129 (down from $165). Tap the link in bio to see the full breakdown 💐",
        stage: "pending", priority: "medium",
        sla: { dueIn: "2h 20m", breached: false },
      },
      {
        id: "C-36", author: "Zoe Lambert", avatar: "ZL",
        text: "I'm a micro-influencer (18k followers, fashion niche) — would love to collab. Who do I DM?", at: "10h",
        sentiment: "positive", likes: 5, trigger: "potential_lead",
        aiDraft: "Hi Zoe! We'd love to hear more 🌸 Please DM us with your handle and a bit about your audience and we'll pass it to our collabs team.",
        stage: "pending", priority: "medium",
        sla: { dueIn: "3h 00m", breached: false },
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
        sentiment: "neutral", likes: 14, trigger: "negative_comment",
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
      {
        id: "C-43", author: "Daria Koval", avatar: "DK",
        text: "How do you handle dark mode tokens — separate set or semantic aliases only?", at: "2h",
        sentiment: "neutral", likes: 9, trigger: "question",
        aiDraft: "We use semantic aliases all the way — a single `color.surface.default` resolves differently in light vs dark. No parallel token sets needed.",
        stage: "pending", priority: "medium",
        sla: { dueIn: "1h 50m", breached: false },
      },
      {
        id: "C-44", author: "Piers Whitfield", avatar: "PW",
        text: "We'd love to have you speak at our design systems conf in October — DMs open!", at: "1h 30m",
        sentiment: "positive", likes: 11, trigger: "potential_lead",
        aiDraft: "Thanks Piers, honoured to be considered! Drop us a DM with the details and we'll take a look at the schedule 🙌",
        stage: "pending", priority: "low",
        sla: { dueIn: "2h 10m", breached: false },
      },
      {
        id: "C-45", author: "Chloe Marchand", avatar: "CM",
        text: "Every team I've worked with has failed at this because no one owns it post-launch. Same story everywhere.", at: "1h",
        sentiment: "negative", likes: 18, trigger: "negative_comment",
        aiDraft: "100% — the ownership gap is real. That's exactly why we argue it needs a product mindset, not just a handoff doc.",
        stage: "pending", priority: "medium",
        sla: { dueIn: "1h 30m", breached: false },
      },
    ],
  },
  {
    id: "P-196", platform: "Instagram",
    title: "Behind the scenes — our packaging redesign ✂️",
    thumbnail: "📦", imageUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=400&fit=crop", publishedAt: "2d ago",
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
        sentiment: "neutral", likes: 12, trigger: "question",
        aiDraft: "Great question Theo — yes, every layer is curbside-recyclable.",
        stage: "in_review", priority: "high", assignee: "Priya S.",
        sla: { dueIn: "45m", breached: false },
      },
      {
        id: "C-52", author: "Mona Eliasson", avatar: "ME",
        text: "Mine arrived crushed last week tbh 😬", at: "4h",
        sentiment: "negative", likes: 3, trigger: "return_exchange",
        aiDraft: "Mona, that's not on — DM us your order # and we'll get a replacement out today.",
        stage: "in_review", priority: "high", assignee: "Sarah C.",
        sla: { dueIn: "OVERDUE 22m", breached: true },
      },
      {
        id: "C-53", author: "Lena Bergstrom", avatar: "LB",
        text: "What material is the inner lining made from? Trying to check if it's safe for food items.", at: "3h",
        sentiment: "neutral", likes: 7, trigger: "question",
        aiDraft: "Great question Lena! The inner lining is unbleached kraft paper — food-safe and fully compostable.",
        stage: "pending", priority: "medium",
        sla: { dueIn: "2h 30m", breached: false },
      },
      {
        id: "C-54", author: "Ryan Osei", avatar: "RO",
        text: "The old packaging was fine honestly. This feels like change for change's sake.", at: "2h",
        sentiment: "negative", likes: 2, trigger: "negative_comment",
        aiDraft: "Totally fair to feel that way, Ryan — sustainability was the main driver. But we'd love to know what you'd improve!",
        stage: "pending", priority: "medium",
        sla: { dueIn: "1h 55m", breached: false },
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
        sentiment: "neutral", likes: 6, trigger: "question",
        aiDraft: "Hi Harini! Mix of Dreamdata + a bit of internal SQL on the warehouse.",
        stage: "pending", priority: "medium",
        sla: { dueIn: "2h 50m", breached: false },
      },
      {
        id: "C-62", author: "Marcus Obi", avatar: "MO",
        text: "We'd love to feature your company in our upcoming B2B growth report — would you be open to a quick call?", at: "6h",
        sentiment: "positive", likes: 3, trigger: "potential_lead",
        aiDraft: "Hi Marcus, thanks for thinking of us! Drop us a DM with more details and we'll connect you with the right person 🙌",
        stage: "pending", priority: "medium",
        sla: { dueIn: "2h 20m", breached: false },
      },
      {
        id: "C-63", author: "Tina Park", avatar: "TP",
        text: "Did you break out organic vs paid in the attribution model? Would change the story quite a bit.", at: "5h",
        sentiment: "neutral", likes: 8, trigger: "question",
        aiDraft: "Good call Tina — yes, organic contributed ~38% of attributed pipeline, paid the rest. Happy to share the breakdown.",
        stage: "pending", priority: "low",
        sla: { dueIn: "3h 10m", breached: false },
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
        sentiment: "neutral", likes: 1, trigger: "question",
        aiDraft: "Hi Carla! Walk-ins are welcome — bookings just guarantee a slot if it's busy.",
        stage: "pending", priority: "medium",
        sla: { dueIn: "1h 25m", breached: false },
      },
      {
        id: "C-72", author: "Steve Nwosu", avatar: "SN",
        text: "Do you still offer the loyalty stamp card here? My old card is from the old location.", at: "8h",
        sentiment: "neutral", likes: 0, trigger: "question",
        aiDraft: "Hi Steve! Yes — we accept all loyalty cards regardless of which branch issued them. See you Saturday!",
        stage: "pending", priority: "low",
        sla: { dueIn: "2h 00m", breached: false },
      },
      {
        id: "C-73", author: "Aisha Cole", avatar: "AC",
        text: "Any student discount on Saturdays? Asking for a broke uni student 😅", at: "7h",
        sentiment: "neutral", likes: 4, trigger: "discount_request",
        aiDraft: "Hey Aisha! Show your student ID for 10% off any day, including Saturdays 🎓",
        stage: "pending", priority: "low",
        sla: { dueIn: "2h 40m", breached: false },
      },
    ],
  },
  {
    id: "P-193", platform: "Facebook",
    title: "Customer story: how Acme Co cut onboarding time by 60%",
    thumbnail: "📈", imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=400&fit=crop", publishedAt: "3d ago",
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
        sentiment: "neutral", likes: 5, trigger: "negative_comment",
        aiDraft: "Fair pushback Ravi — baseline was their pre-rollout 4-week onboarding cycle.",
        stage: "pending", priority: "medium",
        sla: { dueIn: "1h 45m", breached: false },
      },
      {
        id: "C-82", author: "Claire Dupont", avatar: "CD",
        text: "This is exactly what we're trying to solve — could we get on a call to explore working together?", at: "10h",
        sentiment: "positive", likes: 6, trigger: "potential_lead",
        aiDraft: "Hi Claire, love to hear that! Please reach out at hello@yourbrand.com and our partnerships team will be in touch 🙌",
        stage: "pending", priority: "medium",
        sla: { dueIn: "2h 10m", breached: false },
      },
      {
        id: "C-83", author: "Sam Liu", avatar: "SL",
        text: "What does the enterprise package cost? Trying to pitch this internally.", at: "9h",
        sentiment: "neutral", likes: 2, trigger: "price_request",
        aiDraft: "Hi Sam! Enterprise pricing is custom — drop us a message at sales@yourbrand.com and we'll get you a tailored quote.",
        stage: "pending", priority: "medium",
        sla: { dueIn: "2h 30m", breached: false },
      },
    ],
  },
  {
    id: "P-192", platform: "Instagram",
    title: "Giveaway 🎁 — win a year of our Pro plan",
    thumbnail: "🎁", imageUrl: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&h=400&fit=crop", publishedAt: "4d ago",
    commentCount: 1284, newCount: 87,
    comments: [
      {
        id: "C-90", author: "Mae Olusanya", avatar: "MO",
        text: "Tagging @nina @sam @jules 🤞🤞", at: "1d",
        sentiment: "positive", likes: 2, trigger: "product_inquiry",
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
      {
        id: "C-93", author: "Aaliya Hussain", avatar: "AH",
        text: "Will there be a discount code for those who don't win? 😅 I really want the Pro plan.", at: "22h",
        sentiment: "neutral", likes: 8, trigger: "discount_request",
        aiDraft: "Aaliya, we love the enthusiasm! 😄 Stay tuned — we'll have a promo code dropping after the giveaway ends.",
        stage: "pending", priority: "low",
        sla: { dueIn: "5h 30m", breached: false },
      },
      {
        id: "C-94", author: "Tom Bakker", avatar: "TB",
        text: "Is this open to followers outside the US? I'm in the Netherlands 🇳🇱", at: "20h",
        sentiment: "neutral", likes: 12, trigger: "question",
        aiDraft: "Hi Tom! Yes — this giveaway is open internationally 🌍 Good luck!",
        stage: "pending", priority: "low",
        sla: { dueIn: "5h 00m", breached: false },
      },
      {
        id: "C-95", author: "Jules Fontaine", avatar: "JF",
        text: "This is the 3rd giveaway from this account and I've never once seen a real winner announced. Feels fake.", at: "18h",
        sentiment: "negative", likes: 3, trigger: "negative_comment",
        aiDraft: "Hi Jules, that's fair feedback and we hear you. We'll post the winner announcement on our story and tag them publicly — transparency matters to us.",
        stage: "in_review", priority: "high", assignee: "Sarah C.",
        sla: { dueIn: "1h 20m", breached: false },
      },
      {
        id: "C-96", author: "Nia Clarke", avatar: "NC",
        text: "How much would a monthly Pro plan cost if I just want to buy it directly?", at: "15h",
        sentiment: "neutral", likes: 5, trigger: "price_request",
        aiDraft: "Hi Nia! Pro is $29/month or $249/year. You can grab it at the link in bio — and good luck in the giveaway! 🎁",
        stage: "pending", priority: "medium",
        sla: { dueIn: "4h 00m", breached: false },
      },
      {
        id: "C-97", author: "Kofi Mensah", avatar: "KM",
        text: "I ordered last week and haven't received a shipping confirmation yet — is everything okay?", at: "12h",
        sentiment: "neutral", likes: 1, trigger: "order_status",
        aiDraft: "Hi Kofi, sorry for the delay! Please DM your order number and we'll look into it right away.",
        stage: "pending", priority: "high",
        sla: { dueIn: "45m", breached: false },
      },
      {
        id: "C-98", author: "Sophie Oran", avatar: "SO",
        text: "We bought the annual plan 2 weeks ago but I'd like to upgrade to the team version — how do I do that?", at: "10h",
        sentiment: "neutral", likes: 0, trigger: "return_exchange",
        aiDraft: "Hi Sophie! You can upgrade right from your account settings under Billing → Change Plan. Happy to walk you through it if you get stuck!",
        stage: "in_review", priority: "medium", assignee: "Mike T.",
        sla: { dueIn: "2h 00m", breached: false },
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


/* ──────────────────────────────────────────────────────────────
   Page
   ────────────────────────────────────────────────────────────── */

type Tab = "board" | "threads" | "sentiment" | "spam" | "variants";

export default function EngagePage({ view = "board" }: { view?: Tab }) {
  const tab = view;
  const [posts, setPosts] = useState<Post[]>(POSTS);
  const [templates, setTemplates] = useState<ReplyTemplate[]>(REPLY_TEMPLATES);
  const [platformFilter, setPlatformFilter] = useState<"all" | Platform>("all");
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Post-thread context sheet — opened from any view to give post context for a comment
  const [contextPair, setContextPair] = useState<{ commentId: string; postId: string } | null>(null);
  const openContext = (commentId: string, postId: string) => setContextPair({ commentId, postId });

  // Old-UI compatible filters: search + category tabs + sort + filter modal
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryTab, setCategoryTab] = useState<"all" | "comments" | "mentions" | "dms" | "reviews">("all");
  const [sortOrder, setSortOrder] = useState<"recent" | "oldest">("recent");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<Set<"open" | "in_progress" | "completed">>(new Set());
  const [tagFilter, setTagFilter] = useState<Set<string>>(new Set());
  const [dateRange, setDateRange] = useState<"all" | "today" | "7d" | "30d">("all");

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

  const platformMatched = useMemo(() => matchPlatform(allCommentsRaw), [allCommentsRaw, platformFilter]);
  const spamComments = useMemo(() => matchPlatform(spamCommentsRaw), [spamCommentsRaw, platformFilter]);

  // Map a comment's stage → status filter buckets
  const stageToStatus = (s: Stage): "open" | "in_progress" | "completed" =>
    s === "pending" ? "open" : s === "replied" ? "completed" : "in_progress";

  // Apply search + category + status + tag filters end-to-end
  const allComments = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let out = platformMatched;

    if (categoryTab === "mentions") out = out.filter((c) => c.text.includes("@"));
    else if (categoryTab === "reviews") out = out.filter((c) => c.post.platform === "GBP");
    else if (categoryTab === "dms") out = []; // no DM mock data yet

    if (q) {
      out = out.filter(
        (c) => c.author.toLowerCase().includes(q) || c.text.toLowerCase().includes(q),
      );
    }
    if (statusFilter.size > 0) {
      out = out.filter((c) => statusFilter.has(stageToStatus(c.stage)));
    }
    if (tagFilter.size > 0) {
      out = out.filter((c) => c.trigger && tagFilter.has(triggerToTag[c.trigger]));
    }
    if (sortOrder === "oldest") out = [...out].reverse();
    return out;
  }, [platformMatched, searchQuery, categoryTab, statusFilter, tagFilter, sortOrder]);

  const filteredPosts = useMemo(
    () => platformFilter === "all" ? posts : posts.filter((p) => p.platform === platformFilter),
    [posts, platformFilter],
  );

  // Apply search + status + tag filters to Spam
  const filteredSpam = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let out = spamComments;
    if (q) out = out.filter((c) => c.author.toLowerCase().includes(q) || c.text.toLowerCase().includes(q));
    if (statusFilter.size > 0) out = out.filter((c) => statusFilter.has(stageToStatus(c.stage)));
    if (tagFilter.size > 0) out = out.filter((c) => c.trigger && tagFilter.has(triggerToTag[c.trigger]));
    return out;
  }, [spamComments, searchQuery, statusFilter, tagFilter]);

  // Apply search + filters to Threads — keep only posts whose comments match
  const filteredThreadPosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const matchedIds = new Set(allComments.map((c) => c.post.id));
    return filteredPosts.filter((p) => {
      if (!p.comments.some((c) => !c.isSpam)) return false;
      if (!q && statusFilter.size === 0 && tagFilter.size === 0 && categoryTab === "all") return true;
      // Match post if its title contains query OR any of its comments matched the inbox filters
      if (q && p.title.toLowerCase().includes(q)) return true;
      return matchedIds.has(p.id);
    });
  }, [filteredPosts, allComments, searchQuery, statusFilter, tagFilter, categoryTab]);

  const activeFilterCount = statusFilter.size + tagFilter.size + (dateRange !== "all" ? 1 : 0) + (categoryTab !== "all" ? 1 : 0);
  const hasAnyFilter = activeFilterCount > 0 || searchQuery.trim().length > 0 || categoryTab !== "all";
  const clearAllFilters = () => {
    setSearchQuery(""); setCategoryTab("all"); setStatusFilter(new Set());
    setTagFilter(new Set()); setDateRange("all"); setSortOrder("recent");
  };

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
    inReview: allComments.filter((c) => c.stage === "in_review").length + 8,
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

  const [statsOpen, setStatsOpen] = useState(true);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Summary — collapsible, only on Comment Board */}
      {tab === "board" && <div className="border border-border rounded-xl bg-card overflow-hidden">
        <button
          onClick={() => setStatsOpen(o => !o)}
          className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Overview</span>
            {!statsOpen && (
              <div className="flex items-center gap-3 ml-2">
                {[
                  { label: "Pending", value: summary.pending, tone: "text-info" },
                  { label: "In Review", value: summary.inReview, tone: "text-warning" },
                  { label: "Replied", value: summary.replied, tone: "text-success" },
                  { label: "Spam", value: summary.spam, tone: "text-muted-foreground" },
                ].map(s => (
                  <span key={s.label} className={cn("text-xs font-semibold tabular-nums", s.tone)}>
                    {s.value} <span className="font-normal text-muted-foreground">{s.label}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
          <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform duration-200", statsOpen && "rotate-180")} />
        </button>
        {statsOpen && (
          <div className="border-t border-border">
            <div className="hidden md:flex divide-x divide-border">
              {[
                { I: MessageSquare, label: "Pending",       value: summary.pending,  iconTone: "text-info bg-info/10",         valueTone: "text-info" },
                { I: Clock,         label: "In Review",     value: summary.inReview, iconTone: "text-warning bg-warning/10",   valueTone: "text-warning" },
                { I: CheckCircle2,  label: "Replied",       value: summary.replied,  iconTone: "text-success bg-success/10",   valueTone: "text-success" },
                { I: Shield,        label: "Spam Filtered", value: summary.spam,     iconTone: "text-muted-foreground bg-muted", valueTone: "text-foreground" },
              ].map((s) => (
                <div key={s.label} className="flex-1 flex items-center gap-4 px-5 py-4">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", s.iconTone)}>
                    <s.I className="w-5 h-5" />
                  </div>
                  <div>
                    <div className={cn("text-2xl font-bold tabular-nums leading-none", s.valueTone)}>{s.value}</div>
                    <div className="text-xs text-muted-foreground mt-1 whitespace-nowrap">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 divide-x divide-y divide-border md:hidden">
              {[
                { I: MessageSquare, label: "Pending",       value: summary.pending,  iconTone: "text-info bg-info/10",           valueTone: "text-info" },
                { I: Clock,         label: "In Review",     value: summary.inReview, iconTone: "text-warning bg-warning/10",     valueTone: "text-warning" },
                { I: CheckCircle2,  label: "Replied",       value: summary.replied,  iconTone: "text-success bg-success/10",     valueTone: "text-success" },
                { I: Shield,        label: "Spam Filtered", value: summary.spam,     iconTone: "text-muted-foreground bg-muted", valueTone: "text-foreground" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-3 px-4 py-4">
                  <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", s.iconTone)}>
                    <s.I className="w-4 h-4" />
                  </div>
                  <div>
                    <div className={cn("text-xl font-bold tabular-nums leading-none", s.valueTone)}>{s.value}</div>
                    <div className="text-[11px] text-muted-foreground mt-1">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>}

      {/* ─── Toolbar — hidden on Variants (template manager, not comments) ─── */}
      {tab !== "variants" && (
      <div className="space-y-2">
        {/* Refresh row */}
        <div className="flex items-center justify-end gap-2">
          <span className="text-xs text-muted-foreground">
            Updated {lastRefresh.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}, {lastRefresh.toLocaleDateString([], { month: "short", day: "numeric" })}
          </span>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing} className="h-7 px-2.5 gap-1.5 text-xs">
            <RefreshCw className={cn("w-3 h-3", refreshing && "animate-spin")} />
            Refresh
          </Button>
        </div>

      <div className="bg-card rounded-xl border border-border p-2">
        <div className="flex items-center gap-1.5 flex-nowrap overflow-x-auto">

          {/* Search */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search comments, authors, keywords…"
              className="w-full pl-9 pr-8 h-10 rounded-lg bg-background border border-input shadow-sm text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground placeholder:font-normal transition-colors"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Platform filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9 px-2 gap-1.5 shrink-0 text-xs">
                {platformFilter !== "all" ? (
                  <PlatformIcon name={platformFilter as Platform} className="w-3.5 h-3.5" />
                ) : (
                  <Filter className="w-3.5 h-3.5" />
                )}
                <span className="hidden md:inline">{platformFilter === "all" ? "All platforms" : platformFilter}</span>
                <span className="text-[10px] tabular-nums px-1.5 rounded-full bg-muted text-muted-foreground font-semibold">
                  {fmt(platformCounts[platformFilter])}
                </span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {(["all", "Instagram", "Facebook", "LinkedIn", "Twitter", "GBP"] as const).map((p) => (
                <DropdownMenuItem key={p} onClick={() => setPlatformFilter(p)} className="text-xs gap-2">
                  {platformFilter === p && <Check className="w-3 h-3" />}
                  {p !== "all" && <PlatformIcon name={p as Platform} className="w-3.5 h-3.5" />}
                  <span className="flex-1">{p === "all" ? "All platforms" : p}</span>
                  <span className="text-[10px] tabular-nums text-muted-foreground">{fmt(platformCounts[p])}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sort */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9 px-2 gap-1.5 shrink-0" title="Sort order">
                <ArrowDownUp className="w-3.5 h-3.5" />
                <span className="hidden md:inline text-xs">{sortOrder === "recent" ? "Recent" : "Oldest"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => setSortOrder("recent")} className="text-xs gap-2">
                {sortOrder === "recent" && <Check className="w-3 h-3" />} Recent first
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder("oldest")} className="text-xs gap-2">
                {sortOrder === "oldest" && <Check className="w-3 h-3" />} Oldest first
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Filters */}
          <Button variant="ghost" size="sm" className="h-9 px-2 gap-1.5 shrink-0" onClick={() => setFiltersOpen(true)}>
            <Filter className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-xs">Filters</span>
            {activeFilterCount > 0 && (
              <span className="ml-0.5 text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full font-semibold">
                {activeFilterCount}
              </span>
            )}
          </Button>

        </div>

        {/* Active filter chips + result count */}
        {hasAnyFilter && (
          <div className="flex items-center gap-1.5 flex-wrap mt-2 pt-2 border-t border-border">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mr-1">
              {fmt(allComments.length)} result{allComments.length === 1 ? "" : "s"}
            </span>
            {categoryTab !== "all" && (
              <button onClick={() => setCategoryTab("all")}
                className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-muted text-foreground hover:bg-muted/70 capitalize">
                {categoryTab === "dms" ? "DMs" : categoryTab} <X className="w-3 h-3" />
              </button>
            )}
            {[...statusFilter].map((s) => (
              <button key={`s-${s}`} onClick={() => { const n = new Set(statusFilter); n.delete(s); setStatusFilter(n); }}
                className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-muted text-foreground hover:bg-muted/70">
                {s === "in_progress" ? "In Progress" : s === "open" ? "Open" : "Completed"}
                <X className="w-3 h-3" />
              </button>
            ))}
            {[...tagFilter].map((t) => (
              <button key={`t-${t}`} onClick={() => { const n = new Set(tagFilter); n.delete(t); setTagFilter(n); }}
                className={cn("inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-semibold", TAG_COLORS[t] ?? "bg-muted text-muted-foreground")}>
                {t} <X className="w-3 h-3" />
              </button>
            ))}
            {dateRange !== "all" && (
              <button onClick={() => setDateRange("all")}
                className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-muted text-foreground hover:bg-muted/70">
                {dateRange === "today" ? "Today" : dateRange === "7d" ? "Last 7 days" : "Last 30 days"} <X className="w-3 h-3" />
              </button>
            )}
            <button onClick={clearAllFilters}
              className="ml-auto text-[11px] text-primary hover:underline font-medium">
              Clear all
            </button>
          </div>
        )}
      </div>
      </div>
      )}

      {/* Filters modal (old-UI style) */}
      <Dialog open={filtersOpen} onOpenChange={setFiltersOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Filters</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-2">
            <div>
              <p className="text-xs font-semibold text-foreground mb-2">Category</p>
              <div className="flex items-center gap-2 flex-wrap">
                {([
                  { id: "all", label: "All", Icon: Inbox },
                  { id: "comments", label: "Comments", Icon: MessageSquare },
                  { id: "mentions", label: "Mentions", Icon: AtSign },
                  { id: "dms", label: "DMs", Icon: Mail },
                  { id: "reviews", label: "Reviews", Icon: Star },
                ] as const).map((c) => {
                  const active = categoryTab === c.id;
                  const count =
                    c.id === "all" ? platformMatched.length :
                    c.id === "comments" ? platformMatched.length :
                    c.id === "mentions" ? platformMatched.filter((x) => x.text.includes("@")).length :
                    c.id === "dms" ? 0 :
                    c.id === "reviews" ? platformMatched.filter((x) => x.post.platform === "GBP").length : 0;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setCategoryTab(c.id)}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors",
                        active
                          ? "bg-foreground text-background border-foreground"
                          : "bg-card text-foreground border-border hover:border-foreground/40",
                      )}
                    >
                      <c.Icon className="w-3.5 h-3.5" />
                      {c.label}
                      <span className={cn(
                        "text-[10px] tabular-nums px-1.5 rounded-full font-semibold",
                        active ? "bg-background/20" : "bg-muted text-muted-foreground",
                      )}>
                        {fmt(count)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-foreground">Tags</p>
                {tagFilter.size > 0 && (
                  <button onClick={() => setTagFilter(new Set())} className="text-[10px] text-primary hover:underline font-medium">
                    Clear ({tagFilter.size})
                  </button>
                )}
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {TAGS.map((t) => {
                  const active = tagFilter.has(t);
                  const colorCls = TAG_COLORS[t] ?? "bg-muted text-muted-foreground";
                  return (
                    <button
                      key={t}
                      onClick={() => {
                        const next = new Set(tagFilter);
                        next.has(t) ? next.delete(t) : next.add(t);
                        setTagFilter(next);
                      }}
                      className={cn(
                        "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all",
                        colorCls,
                        active ? "ring-2 ring-offset-1 ring-current opacity-100" : "opacity-60 hover:opacity-90",
                      )}
                    >
                      {active && <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />}
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-foreground mb-2">Date Range</p>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as typeof dateRange)}
                className="w-full h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
              </select>
            </div>
          </div>
          <DialogFooter className="flex items-center justify-between sm:justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setCategoryTab("all"); setStatusFilter(new Set()); setTagFilter(new Set()); setDateRange("all"); }}
            >
              Clear All
            </Button>
            <Button size="sm" onClick={() => setFiltersOpen(false)}>Apply Filters</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      
      {tab === "board" && <BoardView comments={allComments} updateComment={updateComment} addReply={addReply} openContext={openContext} />}
      {tab === "threads" && <ThreadsView posts={filteredThreadPosts} updateComment={updateComment} addReply={addReply} />}
      {tab === "sentiment" && <SentimentReviewView comments={allComments} updateComment={updateComment} openContext={openContext} />}
      {tab === "spam" && <SpamView spam={filteredSpam} unspam={(id) => updateComment(id, { isSpam: false })} openContext={openContext} />}
      {tab === "variants" && <VariantsView templates={templates} setTemplates={setTemplates} />}

      <PostThreadContextSheet
        pair={contextPair}
        posts={posts}
        onClose={() => setContextPair(null)}
        updateComment={updateComment}
        addReply={addReply}
      />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   View 1 — AI Reply Queue (queue-based review workflow)
   ────────────────────────────────────────────────────────────── */

function ReplyQueueView({
  comments, posts, updateComment, addReply,
}: {
  comments: (Comment & { post: Post })[];
  posts: Post[];
  updateComment: (id: string, patch: Partial<Comment>) => void;
  addReply: (parentId: string, text: string) => void;
  openContext: (commentId: string, postId: string) => void;
}) {
  // Posts that have at least one comment awaiting review.
  const awaitingPostIds = useMemo(() => {
    const ids = new Set<string>();
    comments.forEach((c) => {
      if (c.stage === "pending" || c.stage === "in_review") ids.add(c.post.id);
    });
    return ids;
  }, [comments]);

  const enriched = useMemo(
    () => posts
      .filter((p) => awaitingPostIds.has(p.id))
      .map((p) => ({ post: p, ...computePostStats(p) })),
    [posts, awaitingPostIds],
  );

  const [platformFilter, setPlatformFilter] = useState<"all" | Platform>("all");
  const [sort, setSort] = useState<PostSort>("awaiting");
  const [selectedPostId, setSelectedPostId] = useState<string | null>(enriched[0]?.post.id ?? null);

  const visiblePosts = useMemo(() => {
    const list = enriched.filter((e) => platformFilter === "all" || e.post.platform === platformFilter);
    const sorted = [...list];
    sorted.sort((a, b) => {
      switch (sort) {
        case "most_comments": return b.stats.total - a.stats.total;
        case "awaiting": return (b.stats.awaiting + b.stats.inReview) - (a.stats.awaiting + a.stats.inReview);
        default: return 0;
      }
    });
    return sorted;
  }, [enriched, platformFilter, sort]);

  const selected = useMemo(
    () => enriched.find((e) => e.post.id === selectedPostId) ?? visiblePosts[0] ?? null,
    [enriched, visiblePosts, selectedPostId],
  );

  // Default-highlight the first awaiting comment of the selected post so the
  // reviewer lands directly on something actionable (with its AI draft loaded).
  const highlightId = useMemo(() => {
    if (!selected) return null;
    const first = selected.items.find((c) => !c.isSpam && (c.stage === "pending" || c.stage === "in_review"));
    return first?.id ?? null;
  }, [selected]);

  if (enriched.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-12 text-center">
        <CheckCircle2 className="w-10 h-10 text-success mx-auto mb-3" />
        <p className="text-sm font-medium text-foreground">Inbox zero! 🎉</p>
        <p className="text-xs text-muted-foreground">No posts have comments awaiting review.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-4 h-[calc(100vh-200px)] min-h-[760px]">
        <PostListColumn
          posts={visiblePosts}
          totalCount={enriched.length}
          platformFilter={platformFilter}
          setPlatformFilter={setPlatformFilter}

          selectedId={selected?.post.id ?? ""}
          onSelect={setSelectedPostId}
        />
        <ThreadDetailColumn
          key={selected?.post.id ?? "empty"}
          selected={selected}
          updateComment={updateComment}
          addReply={addReply}
          highlightCommentId={highlightId}
        />
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   View 2 — ORM Board (unified list with status filter + bulk actions)
   ────────────────────────────────────────────────────────────── */

const TEAM_MEMBERS = ["Sarah C.", "Priya S.", "Mike T.", "Alex R."];

type BoardFilter = "all" | "pending" | "in_review" | "replied";
type BoardSentiment = "positive" | "neutral" | "negative";

type ReplyDraftState = {
  open: boolean;
  text: string;
  isAi: boolean;
};

function BoardView({
  comments, updateComment, addReply, openContext,
}: {
  comments: (Comment & { post: Post })[];
  updateComment: (id: string, patch: Partial<Comment>) => void;
  addReply: (parentId: string, text: string) => void;
  openContext: (commentId: string, postId: string) => void;
}) {
  const PAGE_SIZE = 10;
  const [filter, setFilter] = useState<BoardFilter>("all");
  const [sentimentFilter, setSentimentFilter] = useState<BoardSentiment | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [drafts, setDrafts] = useState<Record<string, ReplyDraftState>>({});
  const [bulkAiOpen, setBulkAiOpen] = useState(false);
  const [bulkDrafts, setBulkDrafts] = useState<Record<string, string>>({});
  const [bulkManualOpen, setBulkManualOpen] = useState(false);
  const [bulkManualDrafts, setBulkManualDrafts] = useState<Record<string, string>>({});
  const [bulkManualMode, setBulkManualMode] = useState<"individual" | "same">("individual");
  const [bulkManualSameText, setBulkManualSameText] = useState("");
  const [bulkManualExcluded, setBulkManualExcluded] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const visibleAll = useMemo(() => comments, [comments]);

  const counts = useMemo(() => {
    const byStatus = (s: Stage) => visibleAll.filter((c) => c.stage === s).length;
    const bySentiment = (s: BoardSentiment) => visibleAll.filter((c) => c.sentiment === s).length;
    return {
      all:       visibleAll.length,
      pending:   byStatus("pending"),
      in_review: byStatus("in_review"),
      replied:   byStatus("replied"),
      positive:  bySentiment("positive"),
      neutral:   bySentiment("neutral"),
      negative:  bySentiment("negative"),
    };
  }, [visibleAll]);

  const filtered = useMemo(() => {
    let out = filter === "all" ? visibleAll : visibleAll.filter((c) => c.stage === filter);
    if (sentimentFilter) out = out.filter((c) => c.sentiment === sentimentFilter);
    return out;
  }, [visibleAll, filter, sentimentFilter]);

  // Clear selections that are no longer in the visible filter
  useEffect(() => {
    setSelected((prev) => {
      const visibleIds = new Set(filtered.map((c) => c.id));
      const next = new Set<string>();
      prev.forEach((id) => { if (visibleIds.has(id)) next.add(id); });
      return next.size === prev.size ? prev : next;
    });
  }, [filtered]);

  const allSelected = filtered.length > 0 && filtered.every((c) => selected.has(c.id));
  const someSelected = selected.size > 0;

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const toggleAll = () => {
    setSelected((prev) => {
      if (allSelected) return new Set();
      const next = new Set(prev);
      filtered.forEach((c) => next.add(c.id));
      return next;
    });
  };
  const clearSelection = () => setSelected(new Set());

  const openDraft = (id: string, isAi: boolean, prefill = "") => {
    setDrafts((prev) => ({ ...prev, [id]: { open: true, text: prefill, isAi } }));
  };
  const updateDraft = (id: string, patch: Partial<ReplyDraftState>) => {
    setDrafts((prev) => ({ ...prev, [id]: { ...(prev[id] ?? { open: true, text: "", isAi: false }), ...patch } }));
  };
  const closeDraft = (id: string) => {
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const sendReply = (c: Comment & { post: Post }) => {
    const d = drafts[c.id];
    const text = d?.text?.trim();
    if (!text) {
      toast.error("Reply is empty");
      return;
    }
    addReply(c.id, text);
    updateComment(c.id, { stage: "replied" });
    closeDraft(c.id);
  };

  const saveDraft = (c: Comment & { post: Post }) => {
    const d = drafts[c.id];
    const text = d?.text?.trim() ?? "";
    if (!text) { toast.error("Nothing to save"); return; }
    updateComment(c.id, { aiDraft: text, stage: "in_review" });
    toast.success("Draft saved — moved to In Review");
    closeDraft(c.id);
  };

  // Bulk operations
  const bulkMoveInReview = (assignee?: string) => {
    selected.forEach((id) => updateComment(id, { stage: "in_review", assignee: assignee ?? "Sarah C." }));
    toast.success(`${selected.size} comment${selected.size === 1 ? "" : "s"} moved to In Review`);
    clearSelection();
  };

  const bulkAssign = (assignee: string) => {
    selected.forEach((id) => updateComment(id, { assignee }));
    toast.success(`Assigned ${selected.size} to ${assignee}`);
  };

  const bulkMarkReplied = () => {
    let blocked = 0;
    selected.forEach((id) => {
      const c = visibleAll.find((x) => x.id === id);
      if (c && (c.aiDraft || drafts[id]?.text)) {
        const text = (drafts[id]?.text ?? c.aiDraft ?? "").trim();
        if (text) {
          addReply(id, text);
          updateComment(id, { stage: "replied" });
          return;
        }
      }
      blocked++;
    });
    if (blocked > 0) toast.error(`${blocked} skipped — no draft to send`);
    clearSelection();
  };

  const bulkAiReply = () => {
    const drafts: Record<string, string> = {};
    selected.forEach((id) => {
      const c = visibleAll.find((x) => x.id === id);
      drafts[id] = c?.aiDraft ?? `Thanks for your comment, ${c?.author?.split(" ")[0] ?? "there"}! We appreciate you reaching out — we'll get back to you shortly.`;
    });
    setBulkDrafts(drafts);
    setBulkAiOpen(true);
  };

  const bulkManualReply = () => {
    const drafts: Record<string, string> = {};
    selected.forEach((id) => { drafts[id] = ""; });
    setBulkManualDrafts(drafts);
    setBulkManualOpen(true);
  };

  const bulkManualSendAll = () => {
    if (bulkManualMode === "same") {
      const text = bulkManualSameText.trim();
      if (!text) { toast.error("Write a reply before sending"); return; }
      const ids = Object.keys(bulkManualDrafts).filter((id) => !bulkManualExcluded.has(id));
      if (ids.length === 0) { toast.error("All recipients removed — add at least one"); return; }
      ids.forEach((id) => { addReply(id, text); updateComment(id, { stage: "replied" }); });
      toast.success(`Sent to ${ids.length} comment${ids.length === 1 ? "" : "s"}`);
      setBulkManualOpen(false);
      setBulkManualDrafts({});
      setBulkManualSameText("");
      setBulkManualExcluded(new Set());
      clearSelection();
      return;
    }
    let sent = 0;
    Object.entries(bulkManualDrafts).forEach(([id, text]) => {
      const t = text.trim();
      if (!t) return;
      addReply(id, t);
      updateComment(id, { stage: "replied" });
      sent++;
    });
    if (sent === 0) { toast.error("Add at least one reply before sending"); return; }
    toast.success(`Sent ${sent} repl${sent === 1 ? "y" : "ies"}`);
    setBulkManualOpen(false);
    setBulkManualDrafts({});
    clearSelection();
  };

  const bulkSendAll = () => {
    Object.entries(bulkDrafts).forEach(([id, text]) => {
      const t = text.trim();
      if (!t) return;
      addReply(id, t);
      updateComment(id, { stage: "replied" });
    });
    toast.success(`Sent ${Object.keys(bulkDrafts).length} replies`);
    setBulkAiOpen(false);
    setBulkDrafts({});
    clearSelection();
  };

  // SLA / Overdue helpers
  const isOverdue = (c: Comment) => c.sla.breached;

  const STATUS_TABS: { id: BoardFilter; label: string; count: number; dot: string }[] = [
    { id: "all",       label: "All",       count: counts.all,       dot: "bg-muted-foreground" },
    { id: "pending",   label: "Pending",   count: counts.pending,   dot: "bg-info" },
    { id: "in_review", label: "In Review", count: counts.in_review, dot: "bg-warning" },
    { id: "replied",   label: "Replied",   count: counts.replied,   dot: "bg-success" },
  ];

  const SENTIMENT_SEGS: { id: BoardSentiment; Icon: typeof Smile; label: string; count: number; activeClasses: string }[] = [
    { id: "positive", Icon: Smile, label: "Positive", count: counts.positive, activeClasses: "bg-success/15 text-success" },
    { id: "neutral",  Icon: Meh,   label: "Neutral",  count: counts.neutral,  activeClasses: "bg-muted text-foreground" },
    { id: "negative", Icon: Frown, label: "Negative", count: counts.negative, activeClasses: "bg-error/15 text-error" },
  ];

  const changeFilter = (f: BoardFilter) => { setFilter(f); setVisibleCount(PAGE_SIZE); };
  const toggleSentiment = (s: BoardSentiment) => { setSentimentFilter((prev) => prev === s ? null : s); setVisibleCount(PAGE_SIZE); };

  return (
    <div className="space-y-3">
      {/* Shared card: tabs on top, list below */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {/* Filter tab bar */}
        <div className="flex flex-wrap items-center gap-2 px-3 py-2 border-b border-border">
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Status tabs */}
          {STATUS_TABS.map((t) => {
            const active = filter === t.id;
            return (
              <button
                key={t.id}
                onClick={() => changeFilter(t.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                <span className={cn("w-1.5 h-1.5 rounded-full", active ? "bg-primary-foreground" : t.dot)} />
                {t.label}
                <span className={cn(
                  "tabular-nums text-[10px] px-1.5 py-0.5 rounded-full",
                  active ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground",
                )}>{fmt(t.count)}</span>
              </button>
            );
          })}

          {/* Separator */}
          <div className="w-[2px] h-5 bg-border mx-2 shrink-0 rounded-full" />

          {/* Sentiment — single segmented chip */}
          <div className="inline-flex items-center rounded-full border border-border bg-muted/40 overflow-hidden">
            {SENTIMENT_SEGS.map((s, i) => {
              const active = sentimentFilter === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => toggleSentiment(s.id)}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors",
                    i > 0 && "border-l border-border",
                    active ? s.activeClasses : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                  )}
                >
                  <s.Icon className="w-3 h-3" />
                  {s.label}
                  <span className={cn(
                    "tabular-nums text-[10px] px-1.5 py-0.5 rounded-full",
                    active ? "bg-current/15" : "bg-muted text-muted-foreground",
                  )}>{fmt(s.count)}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <label className="inline-flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none">
            <input
              type="checkbox"
              className="w-3.5 h-3.5 rounded border-border accent-primary"
              checked={allSelected}
              onChange={toggleAll}
              aria-label="Select all visible"
            />
            Select all
          </label>
        </div>
      </div>

      {/* Bulk action bar — only when something selected */}
      {someSelected && (
        <div className="flex flex-wrap items-center gap-2 bg-primary/5 border-b border-primary/30 px-3 py-2 animate-fade-in">
          <span className="text-xs font-semibold text-foreground inline-flex items-center gap-2">
            <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 tabular-nums">{selected.size}</span>
            selected
            <button onClick={clearSelection} className="text-muted-foreground hover:text-foreground" aria-label="Clear selection">
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
          <div className="h-4 w-px bg-border mx-1" />
          <Button size="sm" className="h-7 text-xs" onClick={bulkAiReply}>
            <Sparkles className="w-3 h-3 mr-1" /> Reply with AI
          </Button>
          <Button size="sm" variant="outline" className="h-7 text-xs" onClick={bulkManualReply}>
            <Edit3 className="w-3 h-3 mr-1" /> Reply manually
          </Button>
          <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => bulkMoveInReview()}>
            <Users className="w-3 h-3 mr-1" /> Move to In Review
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost" className="h-7 text-xs">
                Assign to <ChevronDown className="w-3 h-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="text-[10px] uppercase tracking-wider">Assign to</DropdownMenuLabel>
              {TEAM_MEMBERS.map((m) => (
                <DropdownMenuItem key={m} className="text-xs" onClick={() => bulkAssign(m)}>
                  <Users className="w-3 h-3 mr-2" /> {m}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* List (inside shared card) */}
      <div>
        {filtered.length === 0 ? (
          <BoardEmptyState filter={filter} />
        ) : (
          <ul className="divide-y divide-border">
            {filtered.slice(0, visibleCount).map((c) => {
              const isSelected = selected.has(c.id);
              const draft = drafts[c.id];
              const isLong = c.text.length > 280;
              const isExpanded = expanded.has(c.id);
              const stageMeta = STAGES.find((s) => s.id === c.stage);
              const triggerTagLabel = c.trigger ? triggerToTag[c.trigger] : null;

              return (
                <li
                  key={c.id}
                  className={cn(
                    "relative transition-colors",
                    isSelected ? "bg-primary/5" : "hover:bg-muted/30",
                  )}
                >
                  <div className="flex gap-3 px-4 py-3.5">
                    {/* Checkbox */}
                    <div className="flex-shrink-0 pt-0.5">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-border accent-primary cursor-pointer"
                        checked={isSelected}
                        onChange={() => toggleOne(c.id)}
                        aria-label={`Select comment from ${c.author}`}
                      />
                    </div>

                    {/* Author avatar */}
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-[11px] font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {c.avatar}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">

                      {/* Row 1: author · time · tags · status right */}
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-[13px] font-semibold text-foreground truncate">{c.author}</span>
                        <span className="text-muted-foreground text-xs shrink-0">· {c.at}</span>
                        {triggerTagLabel && (
                          <span className={cn("inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0", TAG_COLORS[triggerTagLabel] ?? "bg-muted text-muted-foreground")}>
                            {triggerTagLabel}
                          </span>
                        )}
                        <SentimentBadge sentiment={c.sentiment} onChange={(s) => updateComment(c.id, { sentiment: s })} />
                        <div className="ml-auto flex items-center gap-2 shrink-0">
                          {/* View thread */}
                          <button
                            onClick={() => openContext(c.id, c.post.id)}
                            className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border border-border bg-muted/50 text-foreground hover:bg-muted hover:border-primary/40 hover:text-primary transition-colors"
                          >
                            <MessageSquare className="w-2.5 h-2.5 shrink-0" /> View thread
                          </button>
                          {stageMeta && (
                            <span className={cn(
                              "inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0",
                              c.stage === "pending" && "bg-info/15 text-info",
                              c.stage === "in_review" && "bg-warning/15 text-warning",
                              c.stage === "replied" && "bg-success/15 text-success",
                            )}>
                              <span className={cn("w-1.5 h-1.5 rounded-full", stageMeta.dot)} />
                              {stageMeta.label}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Row 2: comment text */}
                      <p className={cn(
                        "mt-1.5 text-[13px] text-foreground leading-relaxed whitespace-pre-wrap",
                        !isExpanded && isLong && "line-clamp-3",
                      )}>
                        {c.text}
                      </p>
                      {isLong && (
                        <button
                          onClick={() => setExpanded((prev) => {
                            const next = new Set(prev);
                            if (next.has(c.id)) next.delete(c.id); else next.add(c.id);
                            return next;
                          })}
                          className="mt-0.5 text-[11px] text-primary hover:underline inline-flex items-center gap-0.5"
                        >
                          {isExpanded ? "Show less" : "Show more"}
                          <ChevronDown className={cn("w-3 h-3 transition-transform", isExpanded && "rotate-180")} />
                        </button>
                      )}

                      {/* Row 4: actions */}
                      <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                        {c.stage === "pending" && (
                          <>
                            <Button size="sm" className="h-7 text-xs gap-1" onClick={() => openDraft(c.id, true, c.aiDraft ?? `Thanks ${c.author.split(" ")[0]}! Appreciate you reaching out — we'll get back to you shortly.`)}>
                              <Sparkles className="w-3 h-3" /> Reply with AI
                            </Button>
                            <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => openDraft(c.id, false)}>
                              <Edit3 className="w-3 h-3" /> Write reply
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="ghost" className="h-7 text-xs gap-1">
                                  <Users className="w-3 h-3" /> Assign <ChevronDown className="w-3 h-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start">
                                <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">Assign to</DropdownMenuLabel>
                                {TEAM_MEMBERS.map((m) => (
                                  <DropdownMenuItem key={m} className="text-xs" onClick={() => { updateComment(c.id, { assignee: m, stage: "in_review" }); toast.success(`Assigned to ${m}`); }}>
                                    {m}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </>
                        )}

                        {c.stage === "in_review" && (
                          <>
                            <Button size="sm" className="h-7 text-xs gap-1" onClick={() => openDraft(c.id, true, c.aiDraft ?? `Thanks ${c.author.split(" ")[0]}! Appreciate you reaching out — we'll get back to you shortly.`)}>
                              <Sparkles className="w-3 h-3" /> Reply with AI
                            </Button>
                            <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => openDraft(c.id, false, c.aiDraft ?? "")}>
                              <Edit3 className="w-3 h-3" /> Write reply
                            </Button>
                            {c.assignee && (
                              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                                <Users className="w-3 h-3 shrink-0" />
                                Assigned to <span className="font-medium text-foreground">{c.assignee}</span>
                              </span>
                            )}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="ghost" className="h-7 text-xs">Reassign</Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start">
                                {TEAM_MEMBERS.map((m) => (
                                  <DropdownMenuItem key={m} className="text-xs" onClick={() => { updateComment(c.id, { assignee: m }); toast.success(`Reassigned to ${m}`); }}>
                                    {m}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </>
                        )}

                        {c.stage === "replied" && (
                          <>
                            <Button size="sm" variant="ghost" className="h-7 text-xs gap-1" onClick={() => openContext(c.id, c.post.id)}>
                              <ExternalLink className="w-3 h-3" /> View reply
                            </Button>
                            <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => openDraft(c.id, false)}>
                              <Edit3 className="w-3 h-3" /> Reply again
                            </Button>
                          </>
                        )}

                        {/* Three-dot menu */}
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            className="ml-auto w-7 h-7 rounded hover:bg-muted text-muted-foreground hover:text-foreground inline-flex items-center justify-center"
                            aria-label="More actions"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem className="text-xs gap-2" onClick={() => toast.success("Comment hidden")}>
                              <X className="w-3 h-3" /> Hide
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-xs gap-2 text-error focus:text-error" onClick={() => { updateComment(c.id, { isSpam: true }); toast.success("Marked as spam"); }}>
                              <Shield className="w-3 h-3" /> Mark as spam
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>

                  {/* Inline reply — Instagram style */}
                  {draft?.open && (
                    <div className="border-t border-border bg-card rounded-b-xl overflow-hidden">

                      {/* AI suggestion card */}
                      {draft.isAi && draft.text && (
                        <div className="mx-3 mt-3 p-3 rounded-2xl border border-primary/20 bg-primary/5">
                          <div className="flex items-start gap-2 mb-2.5">
                            <Sparkles className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-foreground leading-relaxed">{draft.text}</p>
                          </div>
                          <div className="flex gap-1.5 flex-wrap">
                            <Button size="sm" variant="outline" className="h-7 text-xs rounded-full px-3"
                              onClick={() => updateDraft(c.id, { text: draft.text })}>
                              Use this draft
                            </Button>
                            <Button size="sm" variant="ghost" className="h-7 text-xs rounded-full px-3"
                              onClick={() => updateDraft(c.id, { text: `Thanks for reaching out, ${c.author.split(" ")[0]}! We hear you and our team is on it. Appreciate your patience.` })}>
                              <RefreshCw className="w-3 h-3 mr-1" /> Regenerate
                            </Button>
                            <Button size="sm" variant="ghost" className="h-7 text-xs rounded-full px-3"
                              onClick={() => toast.info("Edit the draft in the box below")}>
                              Edit before sending
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Replying to strip */}
                      <div className="flex items-center gap-1.5 px-4 pt-2.5">
                        <span className="text-[11px] text-muted-foreground">Replying to</span>
                        <span className="text-[11px] font-semibold text-primary">@{c.author}</span>
                        <button onClick={() => closeDraft(c.id)} className="ml-auto text-muted-foreground hover:text-foreground p-0.5 rounded-full hover:bg-muted transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Input row */}
                      <div className="flex items-end gap-2.5 px-3 py-3">
                        <div className="w-8 h-8 rounded-full gradient-coral flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0 mb-0.5 select-none">
                          YB
                        </div>
                        <div className="flex-1 relative">
                          <textarea
                            value={draft.text}
                            onChange={(e) => updateDraft(c.id, { text: e.target.value })}
                            placeholder={`Reply to ${c.author.split(" ")[0]}…`}
                            rows={1}
                            className="w-full resize-none rounded-[22px] border border-input bg-muted/50 px-4 py-2.5 pr-20 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 leading-relaxed overflow-hidden"
                            style={{ minHeight: "42px", maxHeight: "120px" }}
                            onInput={(e) => {
                              const el = e.currentTarget;
                              el.style.height = "42px";
                              el.style.height = Math.min(el.scrollHeight, 120) + "px";
                            }}
                          />
                          <div className="absolute right-3 bottom-2.5 flex items-center gap-2.5">
                            <button onClick={() => toast.info("Attach media coming soon")} className="text-muted-foreground hover:text-foreground transition-colors" title="Attach">
                              <ImageIcon className="w-4 h-4" />
                            </button>
                            <button onClick={() => toast.info("Open Settings → Saved replies")} className="text-muted-foreground hover:text-foreground transition-colors text-base leading-none" title="Saved replies">
                              💬
                            </button>
                          </div>
                        </div>
                        <Button
                          onClick={() => sendReply(c)}
                          disabled={!draft.text.trim()}
                          className="h-9 px-4 rounded-full font-semibold text-sm flex-shrink-0 mb-0.5"
                        >
                          Post
                        </Button>
                      </div>

                      {/* Secondary toolbar */}
                      <div className="flex items-center justify-between px-4 pb-3 text-[11px] text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => openDraft(c.id, !draft.isAi, draft.isAi ? "" : (c.aiDraft ?? ""))}
                            className="inline-flex items-center gap-1 font-medium text-primary hover:text-primary/70 transition-colors">
                            <Sparkles className="w-3 h-3" />
                            {draft.isAi ? "Hide AI" : "AI reply"}
                          </button>
                          <button onClick={() => saveDraft(c)} className="hover:text-foreground transition-colors">
                            Save draft
                          </button>
                        </div>
                        <span className="tabular-nums">{draft.text.length}/2200</span>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {/* Load more */}
        {filtered.length > visibleCount && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20">
            <span className="text-xs text-muted-foreground">
              Showing <span className="font-medium text-foreground">{visibleCount}</span> of <span className="font-medium text-foreground">{filtered.length}</span> comments
            </span>
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs gap-1.5"
              onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
            >
              Load {Math.min(PAGE_SIZE, filtered.length - visibleCount)} more
              <ChevronDown className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}

        {/* All loaded indicator */}
        {filtered.length > 0 && filtered.length <= visibleCount && filtered.length > PAGE_SIZE && (
          <div className="px-4 py-2.5 border-t border-border text-center text-xs text-muted-foreground">
            All {filtered.length} comments loaded
          </div>
        )}
      </div>
      </div>

      {/* Bulk AI review modal */}
      <Dialog open={bulkAiOpen} onOpenChange={(o) => { setBulkAiOpen(o); if (!o) setBulkDrafts({}); }}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              AI replies for {Object.keys(bulkDrafts).length} selected comment{Object.keys(bulkDrafts).length === 1 ? "" : "s"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto space-y-3 -mx-2 px-2">
            {Object.entries(bulkDrafts).map(([id, text]) => {
              const c = visibleAll.find((x) => x.id === id);
              if (!c) return null;
              const regenerate = () => {
                const variants = [
                  c.aiDraft,
                  `Hey ${c.author.split(" ")[0]}! Thanks for reaching out — our team will get back to you very soon. 🙏`,
                  `Thanks for your message, ${c.author.split(" ")[0]}! We really appreciate you taking the time. We'll follow up shortly.`,
                  `Hi ${c.author.split(" ")[0]}! We saw your comment and we're on it — stay tuned! ✨`,
                ].filter(Boolean) as string[];
                const current = variants.indexOf(text);
                const next = variants[(current + 1) % variants.length];
                setBulkDrafts((prev) => ({ ...prev, [id]: next }));
                toast.success("Reply regenerated");
              };
              return (
                <div key={id} className="border border-border rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-[10px] font-semibold flex items-center justify-center shrink-0">{c.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-semibold">{c.author}</span>
                      <p className="text-[11px] text-muted-foreground italic truncate">"{c.text}"</p>
                    </div>
                    <PlatformIcon name={c.post.platform} className="w-3.5 h-3.5 shrink-0" />
                  </div>
                  <textarea
                    value={text}
                    onChange={(e) => setBulkDrafts((prev) => ({ ...prev, [id]: e.target.value }))}
                    rows={2}
                    className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground tabular-nums">{text.length}/280</span>
                    <div className="flex items-center gap-2">
                      <button onClick={regenerate} className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:text-primary/80 transition-colors">
                        <Sparkles className="w-3 h-3" />
                        Regenerate
                      </button>
                      <div className="w-px h-3 bg-border" />
                      <button
                        onClick={() => {
                          const t = text.trim();
                          if (!t) { toast.error("Reply is empty"); return; }
                          addReply(id, t);
                          updateComment(id, { stage: "replied" });
                          setBulkDrafts((prev) => { const n = { ...prev }; delete n[id]; return n; });
                          toast.success(`Replied to ${c.author.split(" ")[0]}`);
                        }}
                        title="Send this reply"
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:text-primary/80 transition-colors"
                      >
                        <Send className="w-3 h-3" />
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="ghost" size="sm" onClick={() => { setBulkAiOpen(false); setBulkDrafts({}); }}>Cancel</Button>
            <Button size="sm" onClick={bulkSendAll}>
              <Send className="w-3 h-3 mr-1" /> Send all replies
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk manual reply modal */}
      <Dialog open={bulkManualOpen} onOpenChange={(o) => { setBulkManualOpen(o); if (!o) { setBulkManualDrafts({}); setBulkManualMode("individual"); setBulkManualSameText(""); setBulkManualExcluded(new Set()); } }}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit3 className="w-4 h-4" />
              Manual replies — {Object.keys(bulkManualDrafts).length} comment{Object.keys(bulkManualDrafts).length === 1 ? "" : "s"} selected
            </DialogTitle>
          </DialogHeader>

          {/* Mode switcher */}
          <div className="flex items-center gap-1 p-1 bg-muted rounded-lg self-start">
            {([
              { id: "individual", label: "Individual replies" },
              { id: "same",       label: "Same reply for all" },
            ] as const).map((m) => (
              <button
                key={m.id}
                onClick={() => setBulkManualMode(m.id)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                  bulkManualMode === m.id
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {m.label}
              </button>
            ))}
          </div>

          {bulkManualMode === "same" ? (
            /* ── Same reply for all ── */
            <div className="flex-1 overflow-y-auto space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  This reply will be sent to <span className="font-semibold text-foreground">{Object.keys(bulkManualDrafts).length - bulkManualExcluded.size}</span> of {Object.keys(bulkManualDrafts).length} comments. Use the × button to exclude any comment before sending.
                </p>
                <textarea
                  value={bulkManualSameText}
                  onChange={(e) => setBulkManualSameText(e.target.value)}
                  rows={4}
                  placeholder="Write a reply to send to everyone…"
                  className="w-full text-sm bg-background border border-input rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground/60"
                />
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] text-muted-foreground tabular-nums">{bulkManualSameText.length}/280</span>
                </div>
              </div>

              {/* Preview of recipients */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                    Comments
                    <span className="ml-1.5 normal-case font-normal">
                      — <span className="font-semibold text-foreground">{Object.keys(bulkManualDrafts).length - bulkManualExcluded.size}</span> of {Object.keys(bulkManualDrafts).length}
                    </span>
                  </p>
                  {bulkManualExcluded.size > 0 && (
                    <button
                      onClick={() => setBulkManualExcluded(new Set())}
                      className="text-[11px] text-primary hover:underline font-medium"
                    >
                      Restore all
                    </button>
                  )}
                </div>
                <div className="space-y-1.5">
                  {Object.keys(bulkManualDrafts).map((id) => {
                    const c = visibleAll.find((x) => x.id === id);
                    if (!c) return null;
                    const excluded = bulkManualExcluded.has(id);
                    return (
                      <div
                        key={id}
                        className={cn(
                          "flex items-start gap-2.5 px-3 py-2.5 rounded-lg transition-colors",
                          excluded ? "bg-muted/20 opacity-40" : "bg-muted/50",
                        )}
                      >
                        {/* Avatar */}
                        <div className={cn(
                          "w-6 h-6 rounded-full text-[10px] font-semibold flex items-center justify-center shrink-0 mt-0.5",
                          excluded ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary",
                        )}>{c.avatar}</div>

                        {/* Comment content — primary */}
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            "text-sm leading-snug",
                            excluded ? "text-muted-foreground line-through" : "text-foreground",
                          )}>
                            {c.text}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-[11px] font-medium text-muted-foreground">{c.author}</span>
                            <span className="text-muted-foreground/40 text-[10px]">·</span>
                            <PlatformIcon name={c.post.platform} className="w-3 h-3" />
                          </div>
                        </div>

                        {/* Exclude / restore button */}
                        <button
                          onClick={() => setBulkManualExcluded((prev) => {
                            const next = new Set(prev);
                            excluded ? next.delete(id) : next.add(id);
                            return next;
                          })}
                          className={cn(
                            "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors mt-0.5",
                            excluded
                              ? "bg-primary/10 text-primary hover:bg-primary/20"
                              : "bg-muted text-muted-foreground hover:bg-error/10 hover:text-error",
                          )}
                          title={excluded ? "Restore" : "Remove"}
                        >
                          {excluded ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* ── Individual replies ── */
            <div className="flex-1 overflow-y-auto space-y-3 -mx-2 px-2">
              {Object.entries(bulkManualDrafts).map(([id, text]) => {
                const c = visibleAll.find((x) => x.id === id);
                if (!c) return null;
                return (
                  <div key={id} className="border border-border rounded-lg p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-muted text-foreground text-[10px] font-semibold flex items-center justify-center shrink-0">{c.avatar}</div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-semibold">{c.author}</span>
                        <p className="text-[11px] text-muted-foreground italic truncate">"{c.text}"</p>
                      </div>
                      <PlatformIcon name={c.post.platform} className="w-3.5 h-3.5 shrink-0" />
                    </div>
                    <textarea
                      value={text}
                      onChange={(e) => setBulkManualDrafts((prev) => ({ ...prev, [id]: e.target.value }))}
                      rows={2}
                      placeholder={`Reply to ${c.author.split(" ")[0]}…`}
                      className="w-full text-xs bg-background border border-border rounded-lg p-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground/60"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground tabular-nums">{text.length}/280</span>
                      <div className="flex items-center gap-2">
                        {text.trim().length === 0 ? (
                          <span className="text-[10px] text-muted-foreground italic">Leave empty to skip</span>
                        ) : (
                          <button
                            onClick={() => {
                              const t = text.trim();
                              if (!t) { toast.error("Reply is empty"); return; }
                              addReply(id, t);
                              updateComment(id, { stage: "replied" });
                              setBulkManualDrafts((prev) => { const n = { ...prev }; delete n[id]; return n; });
                              toast.success(`Replied to ${c.author.split(" ")[0]}`);
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:text-primary/80 transition-colors"
                          >
                            <Send className="w-3 h-3" /> Send
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="ghost" size="sm" onClick={() => { setBulkManualOpen(false); setBulkManualDrafts({}); setBulkManualSameText(""); }}>Cancel</Button>
            <Button size="sm" onClick={bulkManualSendAll} disabled={bulkManualMode === "same" && !bulkManualSameText.trim()}>
              <Send className="w-3 h-3 mr-1" />
              {bulkManualMode === "same"
                ? `Send to ${Object.keys(bulkManualDrafts).length - bulkManualExcluded.size}`
                : "Send all replies"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function BoardEmptyState({ filter }: { filter: BoardFilter }) {
  const meta: Record<BoardFilter, { Icon: typeof CheckCircle2; title: string; sub: string; iconCls: string }> = {
    all:       { Icon: Inbox,         title: "No comments",          sub: "Nothing in the board right now.",            iconCls: "text-muted-foreground" },
    pending:   { Icon: CheckCircle2,  title: "All caught up!",       sub: "No pending comments remaining.",             iconCls: "text-success" },
    in_review: { Icon: Users,         title: "No comments in review",sub: "Items moved to In Review will appear here.", iconCls: "text-muted-foreground" },
    replied:   { Icon: MessageSquare, title: "No replies sent yet",  sub: "Start from the Pending view.",               iconCls: "text-muted-foreground" },
  };
  const m = meta[filter];
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <m.Icon className={cn("w-10 h-10 mb-3", m.iconCls)} />
      <h3 className="text-sm font-semibold text-foreground">{m.title}</h3>
      <p className="text-xs text-muted-foreground mt-1">{m.sub}</p>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   View 3 — Comment threads grouped by post (with counts)
   ────────────────────────────────────────────────────────────── */

type ThreadFilter = "all" | "new" | "awaiting" | "replied";

const FILLER_SAMPLES: { author: string; avatar: string; text: string; sentiment: Sentiment; trigger: Trigger }[] = [
  { author: "Aria Patel",      avatar: "AP", text: "Love this 🙌 keep it up!",                                   sentiment: "positive", trigger: "praise" },
  { author: "Noah Kim",        avatar: "NK", text: "Just shared with my team — super helpful.",                   sentiment: "positive", trigger: "praise" },
  { author: "Lia Romano",      avatar: "LR", text: "Quick q — does this apply to enterprise plans too?",          sentiment: "neutral",  trigger: "question" },
  { author: "Ben Carter",      avatar: "BC", text: "Been waiting for this update for ages 🎉",                    sentiment: "positive", trigger: "praise" },
  { author: "Sana Iqbal",      avatar: "SI", text: "How does this compare to last year's release?",              sentiment: "neutral",  trigger: "question" },
  { author: "Owen Reyes",      avatar: "OR", text: "Following along — keep them coming.",                         sentiment: "neutral",  trigger: "praise" },
  { author: "Mira Chen",       avatar: "MC", text: "Honestly the best update so far this year.",                  sentiment: "positive", trigger: "praise" },
  { author: "Jacob Hill",      avatar: "JH", text: "Tagging the team — we should try this.",                      sentiment: "positive", trigger: "potential_lead" },
  { author: "Eva Mendes",      avatar: "EM", text: "When will EU customers see this rolled out?",                 sentiment: "neutral",  trigger: "question" },
  { author: "Tariq Yusuf",     avatar: "TY", text: "Could the docs link be added to the post?",                  sentiment: "neutral",  trigger: "question" },
  { author: "Hana Kobayashi",  avatar: "HK", text: "Beautiful work — visuals are 🔥",                            sentiment: "positive", trigger: "praise" },
  { author: "Diego Salas",     avatar: "DS", text: "Took me 5 mins to set up. Smooth.",                           sentiment: "positive", trigger: "praise" },
  { author: "Lukas Weber",     avatar: "LW", text: "Not sure I agree with the pricing change tbh.",               sentiment: "negative", trigger: "negative_comment" },
  { author: "Yara Haddad",     avatar: "YH", text: "Will there be a webinar walkthrough?",                        sentiment: "neutral",  trigger: "question" },
  { author: "Sven Eriksson",   avatar: "SE", text: "Big upgrade from last quarter, well done team.",              sentiment: "positive", trigger: "praise" },
  { author: "Priya Mehta",     avatar: "PM", text: "Is there a discount for annual plans?",                       sentiment: "neutral",  trigger: "discount_request" },
  { author: "James Wu",        avatar: "JW", text: "What's the pricing for the pro tier?",                        sentiment: "neutral",  trigger: "price_request" },
  { author: "Fatima Al-Sayed", avatar: "FA", text: "My order still hasn't shipped after 5 days 😕",              sentiment: "negative", trigger: "order_status" },
  { author: "Carlos Vega",     avatar: "CV", text: "Need to return an item — how do I start the process?",        sentiment: "neutral",  trigger: "return_exchange" },
  { author: "Anika Sharma",    avatar: "AS", text: "We'd love to partner with you on our next campaign!",          sentiment: "positive", trigger: "potential_lead" },
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

    // Every 5th filler comment becomes a "hot" thread with 12–18 nested replies
    // so the >10 replies UX is visible.
    let replies: Comment[] | undefined;
    if (i > 0 && i % 5 === 0) {
      const replyCount = 12 + (i % 7); // 12–18
      replies = Array.from({ length: replyCount }, (_, j) => {
        const rs = FILLER_SAMPLES[(i + j + 3) % FILLER_SAMPLES.length];
        // Some replies (every 3rd) get their own nested replies (depth 2),
        // and the first nested reply itself gets depth-3 children — to
        // demonstrate recursive threads at every level.
        let nested: Comment[] | undefined;
        if (j > 0 && j % 3 === 0) {
          // First nested branch is intentionally large (24) so users can see
          // the "View N more" pagination on a heavy thread; others vary 8–18.
          const nestedCount = j === 3 ? 24 : 8 + (j % 11);
          nested = Array.from({ length: nestedCount }, (_, k) => {
            const ns = FILLER_SAMPLES[(i + j + k + 5) % FILLER_SAMPLES.length];
            let deep: Comment[] | undefined;
            if (k === 0) {
              const deepCount = 4 + (k % 3);
              deep = Array.from({ length: deepCount }, (_, m) => {
                const ds = FILLER_SAMPLES[(i + j + k + m + 7) % FILLER_SAMPLES.length];
                return {
                  id: `${id}-R-${j}-N-${k}-D-${m}`,
                  author: ds.author, avatar: ds.avatar, text: ds.text,
                  at: `${m + 1}m`, sentiment: ds.sentiment,
                  trigger: ds.trigger,
                  likes: ((m * 2) % 9), stage: "replied" as Stage,
                  priority: "low", sla: { dueIn: "—", breached: false },
                };
              });
            }
            return {
              id: `${id}-R-${j}-N-${k}`,
              author: ns.author, avatar: ns.avatar, text: ns.text,
              at: `${k + 1}m`, sentiment: ns.sentiment,
              trigger: ns.trigger,
              likes: ((k * 2) % 14), stage: "replied" as Stage,
              priority: "low", sla: { dueIn: "—", breached: false },
              replies: deep,
            };
          });
        }
        return {
          id: `${id}-R-${j}`,
          author: rs.author,
          avatar: rs.avatar,
          text: rs.text,
          at: `${j + 1}h`,
          sentiment: rs.sentiment,
          trigger: rs.trigger,
          likes: ((j * 3) % 22),
          stage: "replied" as Stage,
          priority: "low",
          sla: { dueIn: "—", breached: false },
          replies: nested,
        };
      });
    }

    return {
      id,
      author: s.author, avatar: s.avatar, text: s.text,
      at: age,
      sentiment: s.sentiment,
      trigger: s.trigger,
      likes: ((i * 5) % 18),
      stage,
      assignee: undefined,
      priority: "low",
      sla: { dueIn: stage === "replied" ? "—" : `${1 + (i % 6)}h ${(i * 7) % 60}m`, breached: false },
      replies,
    };
  });
  return { items: [...real, ...filler], isNewById };
}

/** ORM Comment Threads — post-first triage workspace.
 *  Left: post list with media thumbnails + ORM status pills.
 *  Right: post context header + triage filter bar + Instagram-style threaded
 *  comments with paginated load-more and a sticky reply composer. */

type ThreadOrmFilter = "all" | "new" | "awaiting" | "in_review" | "replied" | "spam";

interface PostOrmStats {
  total: number;
  newCount: number;
  awaiting: number;
  inReview: number;
  replied: number;
  spam: number;
  allReplied: boolean;
}

function computePostStats(post: Post): { items: Comment[]; isNewById: Set<string>; stats: PostOrmStats } {
  const { items, isNewById } = buildDenseThread(post);
  let awaiting = 0, inReview = 0, replied = 0, spam = 0, newCount = 0;
  items.forEach((c) => {
    if (c.isSpam) { spam += 1; return; }
    if (isNewById.has(c.id)) newCount += 1;
    if (c.stage === "pending") awaiting += 1;
    else if (c.stage === "in_review") inReview += 1;
    else if (c.stage === "replied") replied += 1;
  });
  const nonSpam = items.filter((c) => !c.isSpam).length;
  return {
    items,
    isNewById,
    stats: {
      total: nonSpam,
      newCount,
      awaiting,
      inReview,
      replied,
      spam,
      allReplied: nonSpam > 0 && awaiting === 0 && inReview === 0,
    },
  };
}

type PostSort = "newest" | "most_comments" | "awaiting";

function ThreadsView({
  posts, updateComment, addReply,
}: {
  posts: Post[];
  updateComment: (id: string, patch: Partial<Comment>) => void;
  addReply: (parentId: string, text: string) => void;
}) {
  const enriched = useMemo(
    () => posts.map((p) => ({ post: p, ...computePostStats(p) })),
    [posts],
  );

  const [platformFilter, setPlatformFilter] = useState<"all" | Platform>("all");
  const [sort, setSort] = useState<PostSort>("newest");
  const [selectedPostId, setSelectedPostId] = useState<string>(posts[0]?.id ?? "");

  const visiblePosts = useMemo(() => {
    const list = enriched.filter((e) => platformFilter === "all" || e.post.platform === platformFilter);
    const sorted = [...list];
    sorted.sort((a, b) => {
      switch (sort) {
        case "most_comments": return b.stats.total - a.stats.total;
        case "awaiting": return b.stats.awaiting - a.stats.awaiting;
        default: return 0;
      }
    });
    return sorted;
  }, [enriched, platformFilter, sort]);

  const selected = useMemo(
    () => enriched.find((e) => e.post.id === selectedPostId) ?? visiblePosts[0] ?? null,
    [enriched, visiblePosts, selectedPostId],
  );

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-4 h-[calc(100vh-200px)] min-h-[760px]">
        <PostListColumn
          posts={visiblePosts}
          totalCount={enriched.length}
          platformFilter={platformFilter}
          setPlatformFilter={setPlatformFilter}

          selectedId={selected?.post.id ?? ""}
          onSelect={setSelectedPostId}
        />
        <ThreadDetailColumn
          key={selected?.post.id ?? "empty"}
          selected={selected}
          updateComment={updateComment}
          addReply={addReply}
        />
      </div>
    </div>
  );
}

/* ── Left column ───────────────────────────────────────────────── */

const PLATFORM_PILLS: ("all" | Platform)[] = ["all", "Instagram", "Facebook", "LinkedIn", "Twitter", "GBP"];
const SORT_OPTIONS: { id: PostSort; label: string }[] = [
  { id: "newest", label: "Newest" },
  { id: "most_comments", label: "Most comments" },
  { id: "awaiting", label: "Awaiting reply" },
];

function PostListColumn({
  posts, totalCount, platformFilter, setPlatformFilter, selectedId, onSelect,
}: {
  posts: { post: Post; stats: PostOrmStats }[];
  totalCount: number;
  platformFilter: "all" | Platform;
  setPlatformFilter: (p: "all" | Platform) => void;
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden flex flex-col">
      <div className="px-3 py-2.5 border-b border-border flex items-center">
        <span className="text-sm font-semibold text-foreground">Posts</span>
        <span className="text-xs text-muted-foreground tabular-nums ml-1.5">{fmt(totalCount)}</span>
      </div>


      <div className="overflow-y-auto flex-1">
        {posts.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">No posts match this filter.</div>
        ) : (
          posts.map(({ post, stats }) => (
            <PostListCard
              key={post.id}
              post={post}
              stats={stats}
              selected={selectedId === post.id}
              onClick={() => onSelect(post.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function PostListCard({
  post, stats, selected, onClick,
}: {
  post: Post;
  stats: PostOrmStats;
  selected: boolean;
  onClick: () => void;
}) {
  const isTextOnly = !post.thumbnail || post.thumbnail.trim() === "";
  const hasUnreplied = stats.awaiting + stats.inReview > 0;
  const dotCls = hasUnreplied ? "bg-warning" : "bg-success";

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left px-3 py-3 border-b border-border transition-colors flex gap-3 items-start",
        selected
          ? "bg-primary/5 border-l-[3px] border-l-primary pl-[9px]"
          : "hover:bg-muted/40 border-l-[3px] border-l-transparent",
      )}
    >
      {/* Thumbnail (image-style preview) */}
      <PostThumb post={post} size="sm" />

      {/* Body */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-0.5">
          <PlatformIcon name={post.platform} className="w-3 h-3" />
          <span>{post.publishedAt}</span>
          <span className={cn("ml-auto w-1.5 h-1.5 rounded-full", dotCls)} aria-hidden />
        </div>
        <p className="text-[13px] text-foreground line-clamp-2 leading-snug mb-1">{post.title}</p>
        <div className="text-[11px] text-muted-foreground inline-flex items-center gap-1 mb-1.5">
          <MessageSquare className="w-3 h-3" />
          {fmt(stats.total)} comments
        </div>
        {/* Sentiment breakdown */}
        {(() => {
          const nonSpam = post.comments.filter((c) => !c.isSpam);
          const pos = nonSpam.filter((c) => c.sentiment === "positive").length;
          const neu = nonSpam.filter((c) => c.sentiment === "neutral").length;
          const neg = nonSpam.filter((c) => c.sentiment === "negative").length;
          return (
            <div className="flex items-center gap-2.5">
              {pos > 0 && (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-success">
                  <Smile className="w-3 h-3" /> {pos}
                </span>
              )}
              {neu > 0 && (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                  <Meh className="w-3 h-3" /> {neu}
                </span>
              )}
              {neg > 0 && (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-error">
                  <Frown className="w-3 h-3" /> {neg}
                </span>
              )}
            </div>
          );
        })()}
      </div>
    </button>
  );
}

function platformBgClass(p: Platform) {
  switch (p) {
    case "Instagram": return "bg-instagram/10";
    case "Facebook": return "bg-facebook/10";
    case "LinkedIn": return "bg-linkedin/10";
    case "Twitter": return "bg-twitter/10";
    case "GBP": return "bg-warning/10";
  }
}

/** Image-style post preview with platform pin badge.
 *  Renders the post's thumbnail emoji as the "photo subject" over a soft
 *  platform-tinted gradient so it reads like a real image preview, not an icon. */
function PostThumb({ post, size = "md", className }: { post: Post; size?: "sm" | "md" | "lg"; className?: string }) {
  const sz =
    size === "sm" ? "w-12 h-12 text-xl"
    : size === "lg" ? "w-20 h-20 text-4xl"
    : "w-14 h-14 text-2xl";
  const badge =
    size === "sm" ? "w-4 h-4" : size === "lg" ? "w-6 h-6" : "w-5 h-5";
  const badgeIcon =
    size === "sm" ? "w-2.5 h-2.5" : size === "lg" ? "w-3.5 h-3.5" : "w-3 h-3";
  const hasImage = !!post.imageUrl;
  const hasEmoji = !!post.thumbnail && post.thumbnail.trim() !== "";

  return (
    <div className={cn("relative flex-shrink-0", className)}>
      <div
        className={cn(
          "rounded-lg overflow-hidden border border-border flex items-center justify-center shadow-sm",
          sz,
          !hasImage && platformBgClass(post.platform),
        )}
      >
        {hasImage ? (
          <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
        ) : hasEmoji ? (
          <span aria-hidden className="drop-shadow-sm">{post.thumbnail}</span>
        ) : (
          <PlatformIcon name={post.platform} className="w-4 h-4 text-muted-foreground" />
        )}
      </div>
      <div className={cn(
        "absolute -bottom-1 -right-1 rounded-full bg-card border border-border flex items-center justify-center",
        badge,
      )}>
        <PlatformIcon name={post.platform} className={badgeIcon} />
      </div>
    </div>
  );
}

/* ── Right column ──────────────────────────────────────────────── */

const PAGE_SIZE = 30;

function ThreadDetailColumn({
  selected, updateComment, addReply, highlightCommentId,
}: {
  selected: { post: Post; items: Comment[]; isNewById: Set<string>; stats: PostOrmStats } | null;
  updateComment: (id: string, patch: Partial<Comment>) => void;
  addReply: (parentId: string, text: string) => void;
  highlightCommentId?: string | null;
}) {
  const [filter, setFilter] = useState<ThreadOrmFilter>("all");
  const [sentimentFilter, setSentimentFilter] = useState<BoardSentiment | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [reply, setReply] = useState("");
  const [replyTarget, setReplyTarget] = useState<Comment | null>(null);
  const [showAi, setShowAi] = useState(false);
  const [showSpam, setShowSpam] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const highlightRef = useRef<HTMLDivElement | null>(null);

  // When the queue swaps the highlighted comment, scroll it into view,
  // auto-target it for reply, and pre-load its AI draft.
  useEffect(() => {
    if (highlightCommentId && highlightRef.current) {
      highlightRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    if (highlightCommentId && selected) {
      const target = selected.items.find((c) => c.id === highlightCommentId);
      if (target) {
        setReplyTarget(target);
        setReply(target.aiDraft ?? "");
        setShowAi(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlightCommentId, selected?.post.id]);

  if (!selected) {
    return (
      <div className="bg-card rounded-xl border border-border flex items-center justify-center text-center p-8">
        <div className="max-w-xs">
          <MessageSquare className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground">Select a post from the left to manage its comments</p>
          <p className="text-xs text-muted-foreground mt-1">Triage, assign and reply to every comment in one place.</p>
        </div>
      </div>
    );
  }

  const { post, items, isNewById, stats } = selected;

  const nonSpam = items.filter((c) => !c.isSpam);
  const spamItems = items.filter((c) => c.isSpam);

  const filtered = nonSpam.filter((c) => {
    const statusOk = (() => {
      switch (filter) {
        case "new": return isNewById.has(c.id);
        case "awaiting": return c.stage === "pending";
        case "in_review": return c.stage === "in_review";
        case "replied": return c.stage === "replied";
        case "spam": return false;
        default: return true;
      }
    })();
    const sentimentOk = !sentimentFilter || c.sentiment === sentimentFilter;
    return statusOk && sentimentOk;
  });

  const sorted = filter === "spam" ? spamItems : filtered;

  const sentimentCounts = {
    positive: nonSpam.filter((c) => c.sentiment === "positive").length,
    neutral:  nonSpam.filter((c) => c.sentiment === "neutral").length,
    negative: nonSpam.filter((c) => c.sentiment === "negative").length,
  };

  const visible = sorted.slice(0, visibleCount);
  const remaining = Math.max(0, sorted.length - visibleCount);

  const toggleReplies = (id: string) => {
    setExpandedReplies((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const send = () => {
    if (!reply.trim()) return;
    if (replyTarget) {
      addReply(replyTarget.id, reply.trim());
      updateComment(replyTarget.id, { stage: "replied" });
    } else {
      toast.success("Reply posted to thread");
    }
    setReply("");
    setReplyTarget(null);
    setShowAi(false);
  };


  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden flex flex-col h-full min-h-0">
      {/* ── Scrollable area: post card + filter tabs + comments ── */}
      <div className="flex-1 overflow-y-auto min-h-0">
      {/* ── Post card ── Instagram-style ── */}
      <div className="flex-shrink-0">
        {/* Full-width image banner */}
        <div className="relative w-full h-52 bg-muted overflow-hidden">
          {post.imageUrl ? (
            <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
          ) : (
            <div className={cn("w-full h-full flex items-center justify-center text-7xl", platformBgClass(post.platform))}>
              {post.thumbnail}
            </div>
          )}
          {/* Bottom gradient */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
          {/* Platform + handle badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1">
            <PlatformIcon name={post.platform} className="w-3 h-3 text-white" />
            <span className="text-white text-[11px] font-semibold">@yourbrand</span>
          </div>
          {/* Open original link */}
          <button className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm rounded-full p-1.5 text-white hover:bg-black/60 transition-colors" title="Open post">
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          {/* Published time */}
          <span className="absolute bottom-3 left-3 text-[10px] text-white/80 font-medium uppercase tracking-wide flex items-center gap-1">
            <Clock className="w-3 h-3" /> {post.publishedAt}
          </span>
        </div>

        {/* Engagement row + caption */}
        <div className="px-4 pt-3 pb-2.5 bg-card border-b border-border">
          <div className="flex items-center mb-2">
            <div className="flex items-center gap-4">
              <button className="text-foreground hover:text-error transition-colors" title="Like">
                <Heart className="w-[20px] h-[20px]" />
              </button>
              <button className="text-foreground hover:text-primary transition-colors" title="Comment">
                <MessageSquare className="w-[20px] h-[20px]" />
              </button>
              <button className="text-foreground hover:text-foreground/60 transition-colors -rotate-12" title="Share">
                <Share2 className="w-[20px] h-[20px]" />
              </button>
            </div>
            <button className="ml-auto text-foreground hover:text-foreground/60 transition-colors" title="Save">
              <Bookmark className="w-[20px] h-[20px]" />
            </button>
          </div>
          <div className="flex items-center gap-1.5 mb-1.5 text-[13px] font-semibold text-foreground">
            <span>1,247 likes</span>
            <span className="text-muted-foreground font-normal">·</span>
            <span>{fmt(post.commentCount)} comments</span>
          </div>
          <p className="text-sm text-foreground leading-relaxed line-clamp-2">
            <span className="font-semibold mr-1">yourbrand</span>
            {post.title}
          </p>
        </div>

        {/* Comment filter tabs */}
        <div className="px-3 py-2.5 bg-muted/20 border-b border-border flex items-center gap-1.5 flex-wrap">
          {/* Status pills */}
          {([
            { id: "all",       label: "All",       count: stats.total,    active: "bg-foreground text-background",        idle: "bg-muted text-foreground hover:bg-muted/70" },
            { id: "awaiting",  label: "Pending",   count: stats.awaiting, active: "bg-info text-white",                   idle: "bg-info/10 text-info hover:bg-info/20" },
            { id: "in_review", label: "In Review", count: stats.inReview, active: "bg-warning text-warning-foreground",   idle: "bg-warning/10 text-warning hover:bg-warning/20" },
            { id: "replied",   label: "Replied",   count: stats.replied,  active: "bg-success text-success-foreground",   idle: "bg-success/10 text-success hover:bg-success/20" },
          ] as { id: ThreadOrmFilter; label: string; count: number; active: string; idle: string }[]).map((p) => (
            <button
              key={p.id}
              onClick={() => { setFilter(p.id); setVisibleCount(PAGE_SIZE); }}
              className={cn(
                "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors",
                filter === p.id ? p.active : p.idle,
              )}
            >
              {p.label} <span className="opacity-70">{fmt(p.count)}</span>
            </button>
          ))}

          {/* Separator */}
          <div className="w-[2px] h-5 bg-border mx-2 shrink-0 rounded-full" />

          {/* Sentiment segmented chip */}
          <div className="inline-flex items-center rounded-full border border-border bg-muted/40 overflow-hidden">
            {([
              { id: "positive" as BoardSentiment, Icon: Smile, label: "Positive", count: sentimentCounts.positive, activeClasses: "bg-success/15 text-success" },
              { id: "neutral"  as BoardSentiment, Icon: Meh,   label: "Neutral",  count: sentimentCounts.neutral,  activeClasses: "bg-muted text-foreground" },
              { id: "negative" as BoardSentiment, Icon: Frown,  label: "Negative", count: sentimentCounts.negative, activeClasses: "bg-error/15 text-error" },
            ]).map((s, i) => {
              const active = sentimentFilter === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => { setSentimentFilter((prev) => prev === s.id ? null : s.id); setVisibleCount(PAGE_SIZE); }}
                  className={cn(
                    "inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold transition-colors",
                    i > 0 && "border-l border-border",
                    active ? s.activeClasses : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                  )}
                >
                  <s.Icon className="w-3 h-3" />
                  {s.label}
                  <span className={cn(
                    "tabular-nums text-[10px] px-1.5 py-0.5 rounded-full",
                    active ? "bg-current/15" : "bg-muted text-muted-foreground",
                  )}>{fmt(s.count)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Comment thread */}
      <div>
        {sorted.length === 0 ? (
          <ThreadEmptyState filter={filter} stats={stats} onClear={() => setFilter("all")} />
        ) : (
          <div className="divide-y divide-border/40">
            {visible.map((c) => {
              const isHighlighted = highlightCommentId === c.id;
              return (
                <div
                  key={c.id}
                  ref={isHighlighted ? highlightRef : undefined}
                  className={cn(isHighlighted && "ring-2 ring-primary/60 ring-inset bg-primary/5 transition-colors")}
                >
                  <CommentItem
                    comment={c}
                    isNew={isNewById.has(c.id)}
                    expanded={expandedReplies.has(c.id)}
                    onToggleReplies={() => toggleReplies(c.id)}
                    onReply={() => { setReplyTarget(c); setReply(""); setShowAi(false); }}
                    onAiReply={() => {
                      setReplyTarget(c);
                      setReply(c.aiDraft ?? `Thanks ${c.author.split(" ")[0]}! Appreciate you reaching out — we'll get back to you shortly.`);
                      setShowAi(true);
                      toast.success("AI draft loaded — review before sending");
                    }}
                    onAssignTo={(member) => {
                      updateComment(c.id, { stage: "in_review", assignee: member });
                      toast.success(`Assigned to ${member}`);
                    }}
                    onChangeSentiment={(s) => {
                      updateComment(c.id, { sentiment: s });
                      toast.success(`Sentiment updated to ${s}`);
                    }}
                    updateComment={updateComment}
                  />
                </div>
              );
            })}

            {(remaining > 0 || sorted.length > PAGE_SIZE) && (
              <div className="flex items-center gap-3 px-4 py-3 border-t border-border bg-muted/20">
                <span className="text-xs text-muted-foreground">
                  Showing <span className="font-medium text-foreground">{fmt(visible.length)}</span> of <span className="font-medium text-foreground">{fmt(sorted.length)}</span> comments
                </span>
                {remaining > 0 && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs gap-1.5"
                    onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
                  >
                    Load {Math.min(remaining, PAGE_SIZE)} more
                    <ChevronDown className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            )}

            {/* Spam collapsed group when not specifically filtering for spam */}
            {filter !== "spam" && spamItems.length > 0 && (
              <div className="px-4 py-3 bg-muted/30">
                <button
                  onClick={() => setShowSpam((s) => !s)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  {showSpam ? "▾" : "▸"} {fmt(spamItems.length)} spam {spamItems.length === 1 ? "comment" : "comments"} hidden — {showSpam ? "Hide" : "Show"}
                </button>
                {showSpam && (
                  <div className="mt-2 space-y-2 opacity-60">
                    {spamItems.map((c) => (
                      <div key={c.id} className="text-xs text-muted-foreground line-clamp-1">
                        <span className="font-medium">{c.author}:</span> {c.text}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      </div>{/* end outer scroll wrapper */}

      {/* ── Sticky reply composer — Instagram style ── */}
      <div className="border-t border-border bg-card flex-shrink-0">

        {/* AI suggestion card */}
        {showAi && (
          <div className="mx-3 mt-3 p-3 rounded-2xl border border-primary/20 bg-primary/5">
            <div className="flex items-start gap-2 mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-sm text-foreground leading-relaxed">
                {replyTarget?.aiDraft ?? `Thanks so much for engaging with this post! We really appreciate your support 💛`}
              </p>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              <Button size="sm" variant="outline" className="h-7 text-xs rounded-full px-3"
                onClick={() => setReply(replyTarget?.aiDraft ?? "Thanks so much for engaging with this post! We really appreciate your support 💛")}>
                Use this draft
              </Button>
              <Button size="sm" variant="ghost" className="h-7 text-xs rounded-full px-3"
                onClick={() => {
                  const fallback = replyTarget?.aiDraft ?? `Thanks ${replyTarget?.author?.split(" ")[0] ?? "for reaching out"}! Our team is on it — appreciate your patience.`;
                  setReply(fallback);
                  toast.success("Regenerated AI draft");
                }}>Regenerate</Button>
              <Button size="sm" variant="ghost" className="h-7 text-xs rounded-full px-3"
                onClick={() => { setReply(replyTarget?.aiDraft ?? ""); toast.info("Edit the draft below before sending"); }}>
                Edit before sending
              </Button>
            </div>
          </div>
        )}

        {/* Replying-to context strip */}
        {replyTarget && (
          <div className="flex items-center gap-1.5 px-4 pt-2.5">
            <span className="text-[11px] text-muted-foreground">Replying to</span>
            <span className="text-[11px] font-semibold text-primary">@{replyTarget.author}</span>
            <button onClick={() => setReplyTarget(null)} className="ml-auto text-muted-foreground hover:text-foreground p-0.5 rounded-full hover:bg-muted transition-colors">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Main input row */}
        <div className="flex items-end gap-2.5 px-3 py-3">
          {/* Brand avatar */}
          <div className="w-8 h-8 rounded-full gradient-coral flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0 mb-0.5 select-none">
            YB
          </div>

          {/* Pill input */}
          <div className="flex-1 relative">
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder={replyTarget ? `Reply to ${replyTarget.author.split(" ")[0]}…` : "Add a comment…"}
              rows={1}
              className="w-full resize-none rounded-[22px] border border-input bg-muted/50 px-4 py-2.5 pr-20 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 leading-relaxed overflow-hidden"
              style={{ minHeight: "42px", maxHeight: "120px" }}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = "42px";
                el.style.height = Math.min(el.scrollHeight, 120) + "px";
              }}
            />
            {/* Inline icon actions */}
            <div className="absolute right-3 bottom-2.5 flex items-center gap-2.5">
              <button onClick={() => toast.info("Attach media coming soon")} className="text-muted-foreground hover:text-foreground transition-colors" title="Attach">
                <ImageIcon className="w-4 h-4" />
              </button>
              <button onClick={() => toast.info("Open Settings → Saved replies")} className="text-muted-foreground hover:text-foreground transition-colors text-base leading-none" title="Saved replies">
                💬
              </button>
            </div>
          </div>

          {/* Post button */}
          <Button
            onClick={send}
            disabled={!reply.trim()}
            className="h-9 px-4 rounded-full font-semibold text-sm flex-shrink-0 mb-0.5"
          >
            Post
          </Button>
        </div>

        {/* Secondary toolbar */}
        <div className="flex items-center justify-between px-4 pb-3 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <button onClick={() => setShowAi((s) => !s)}
              className="inline-flex items-center gap-1 font-medium text-primary hover:text-primary/70 transition-colors">
              <Sparkles className="w-3 h-3" />
              {showAi ? "Hide AI" : "AI reply"}
            </button>
            <button
              onClick={() => { if (!reply.trim()) { toast.error("Nothing to save"); return; } toast.success("Draft saved"); }}
              className="hover:text-foreground transition-colors">
              Save draft
            </button>
            <button
              onClick={() => { if (!reply.trim()) { toast.error("Write a reply first"); return; } toast.success("Reply scheduled"); }}
              className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
              <Clock className="w-3 h-3" /> Schedule
            </button>
          </div>
          <span className="tabular-nums">{reply.length}/2200</span>
        </div>
      </div>
    </div>
  );
}

function ThreadEmptyState({ filter, stats, onClear }: { filter: ThreadOrmFilter; stats: PostOrmStats; onClear: () => void }) {
  if (filter === "all" && stats.total === 0) {
    return (
      <div className="p-12 text-center">
        <MessageSquare className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
        <p className="text-sm font-medium text-foreground">No comments on this post yet</p>
      </div>
    );
  }
  if (filter === "all" && stats.allReplied) {
    return (
      <div className="p-12 text-center">
        <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-3" />
        <p className="text-sm font-semibold text-foreground">All caught up!</p>
        <p className="text-xs text-muted-foreground mt-1">Every comment on this post has been replied to.</p>
      </div>
    );
  }
  return (
    <div className="p-12 text-center">
      <p className="text-sm font-medium text-foreground">No {filter.replace("_", " ")} comments</p>
      <button onClick={onClear} className="text-xs text-primary hover:underline mt-2">Clear filter</button>
    </div>
  );
}

function CommentItem({
  comment, isNew, expanded, onToggleReplies, onReply, onAiReply, onAssignTo, onChangeSentiment, updateComment,
}: {
  comment: Comment;
  isNew: boolean;
  expanded: boolean;
  onToggleReplies: () => void;
  onReply: () => void;
  onAiReply: () => void;
  onAssignTo: (member: string) => void;
  onChangeSentiment?: (s: Sentiment) => void;
  updateComment?: (id: string, patch: Partial<Comment>) => void;
}) {
  const triggerTag = comment.trigger ? triggerToTag[comment.trigger] : null;
  const stageCls =
    comment.stage === "replied" ? "bg-success/15 text-success"
    : comment.stage === "in_review" ? "bg-warning/15 text-warning"
    : "bg-info/15 text-info";
  const stageLabel =
    isNew && comment.stage === "pending"
      ? "New"
      : comment.stage === "pending" ? "Awaiting reply"
      : STAGES.find((s) => s.id === comment.stage)?.label ?? comment.stage;

  const replies = comment.replies ?? [];
  const hasReplies = replies.length > 0;
  const REPLIES_INITIAL = 10;
  const REPLIES_STEP = 10;
  const [visibleReplies, setVisibleReplies] = useState(REPLIES_INITIAL);
  const shownReplies = replies.slice(0, visibleReplies);
  const remainingReplies = Math.max(0, replies.length - visibleReplies);

  return (
    <div className="px-4 py-3">
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center flex-shrink-0">
          {comment.avatar}
        </div>
        <div className="min-w-0 flex-1">
          {/* Row 1 */}
          <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
            <span className="text-[13px] font-semibold text-foreground">{comment.author}</span>
            <span className="text-[11px] text-muted-foreground">· {comment.at}</span>
            {triggerTag && (
              <span className={cn("inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full", TAG_COLORS[triggerTag] ?? "bg-muted text-muted-foreground")}>
                {triggerTag}
              </span>
            )}
            <SentimentBadge sentiment={comment.sentiment} onChange={onChangeSentiment} />
            <span className={cn("px-1.5 py-0.5 rounded-full text-[10px] font-semibold ml-auto", stageCls)}>{stageLabel}</span>
          </div>
          {/* Row 2 */}
          <p className="text-sm text-foreground leading-snug">{comment.text}</p>
          <div className="text-[11px] text-muted-foreground mt-1 inline-flex items-center gap-1">
            <ThumbsUp className="w-3 h-3" /> {comment.likes}
          </div>
          {/* Row 3 — actions */}
          <div className="flex items-center gap-3 mt-2 text-[11px] font-medium text-muted-foreground flex-wrap">
            <button onClick={onReply} className="hover:text-foreground inline-flex items-center gap-1"><MessageSquare className="w-3 h-3" /> Reply</button>
            <button onClick={onAiReply} className="hover:text-primary text-primary inline-flex items-center gap-1"><Sparkles className="w-3 h-3" /> AI reply</button>
            {comment.assignee && (
              <span className="inline-flex items-center gap-1 text-muted-foreground">
                <Users className="w-3 h-3" /> Assigned to <span className="font-semibold text-foreground">{comment.assignee}</span>
              </span>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="hover:text-foreground inline-flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {comment.assignee ? "Reassign" : "Assign"}
                  <ChevronDown className="w-3 h-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuLabel className="text-[10px] uppercase tracking-wider">Assign to</DropdownMenuLabel>
                {TEAM_MEMBERS.map((m) => (
                  <DropdownMenuItem key={m} className="text-xs" onClick={() => onAssignTo(m)}>
                    <Users className="w-3 h-3 mr-2" />{m}
                    {comment.assignee === m && <Check className="w-3 h-3 ml-auto text-primary" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Replies (Instagram-style) */}
          {hasReplies && (
            <div className="mt-2">
              {!expanded ? (
                <button onClick={onToggleReplies} className="text-[12px] text-muted-foreground hover:text-foreground font-semibold inline-flex items-center gap-2">
                  <span className="inline-block w-6 h-px bg-muted-foreground/40" />
                  View {replies.length} {replies.length === 1 ? "reply" : "replies"}
                </button>
              ) : (
                <div className="mt-2 pl-7 space-y-3">
                  {shownReplies.map((r) => (
                    <NestedReply key={r.id} reply={r} depth={1} updateComment={updateComment} />
                  ))}
                  {remainingReplies > 0 && (
                    <button
                      onClick={() => setVisibleReplies((v) => v + REPLIES_STEP)}
                      className="text-[12px] text-muted-foreground hover:text-foreground font-semibold inline-flex items-center gap-2"
                    >
                      <span className="inline-block w-6 h-px bg-muted-foreground/40" />
                      View {Math.min(remainingReplies, REPLIES_STEP)} more {remainingReplies === 1 ? "reply" : "replies"}
                    </button>
                  )}
                  <button onClick={onToggleReplies} className="text-[12px] text-muted-foreground hover:text-foreground font-semibold inline-flex items-center gap-2">
                    <span className="inline-block w-6 h-px bg-muted-foreground/40" />
                    Hide replies
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Brand reply (when stage === replied and no explicit replies) */}
          {comment.stage === "replied" && !hasReplies && (
            <div className="mt-2 pl-4 border-l border-success/30">
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold mb-0.5">Your reply</div>
              <div className="flex items-center gap-2">
                <p className="text-[13px] text-foreground italic">Thanks so much for the kind words! 💛</p>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-success/15 text-success">Replied</span>
                <button className="text-[11px] text-muted-foreground hover:text-foreground">Edit</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** Recursive nested reply — Instagram-style flat thread.
 *  All replies (regardless of depth) render at the same indent under the
 *  top-level comment. Replies to other replies show an "@username" mention
 *  prefix instead of indenting further. */
function NestedReply({ reply, depth, mentionTo, updateComment }: { reply: Comment; depth: number; mentionTo?: string; updateComment?: (id: string, patch: Partial<Comment>) => void }) {
  // Flatten all descendants into a single list, preserving order, and remember
  // each one's parent so we can render an "@parent" mention prefix.
  const flatten = (node: Comment, parentAuthor?: string): { node: Comment; parentAuthor?: string }[] => {
    const out: { node: Comment; parentAuthor?: string }[] = [];
    (node.replies ?? []).forEach((child) => {
      out.push({ node: child, parentAuthor: node.author });
      out.push(...flatten(child, node.author));
    });
    return out;
  };
  const descendants = flatten(reply);
  const hasChildren = descendants.length > 0;
  const INITIAL = 10;
  const STEP = 10;
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(INITIAL);
  const shown = descendants.slice(0, visible);
  const remaining = Math.max(0, descendants.length - visible);

  const mentionHandle = mentionTo ? `@${mentionTo.toLowerCase().replace(/\s+/g, "")}` : null;

  // Only the first-level reply renders its own descendants list; deeper levels
  // render flat (mentionTo provided) and never recurse children themselves.
  const isTopLevel = depth === 1;

  return (
    <>
      <div className="flex gap-2.5">
        <div className="w-7 h-7 rounded-full bg-accent text-foreground text-[10px] font-semibold flex items-center justify-center flex-shrink-0">
          {reply.avatar}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[13px] font-semibold text-foreground">{reply.author}</span>
            <span className="text-[11px] text-muted-foreground">{reply.at}</span>
            {reply.trigger && (
              <span className={cn("inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full", TAG_COLORS[triggerToTag[reply.trigger]] ?? "bg-muted text-muted-foreground")}>
                {triggerToTag[reply.trigger]}
              </span>
            )}
            <SentimentBadge
              sentiment={reply.sentiment}
              onChange={updateComment ? (s) => { updateComment(reply.id, { sentiment: s }); } : undefined}
            />
          </div>
          <p className="text-[13px] text-foreground leading-snug">
            {mentionHandle && <span className="text-primary font-medium">{mentionHandle} </span>}
            {reply.text}
          </p>
          <div className="flex items-center gap-4 text-[11px] text-muted-foreground mt-1 font-medium">
            <span className="inline-flex items-center gap-1">
              <ThumbsUp className="w-3 h-3" /> {reply.likes}
            </span>
            <button onClick={() => toast.info(`Reply to @${reply.author.toLowerCase().replace(/\s+/g, "")} from the top-level composer`)} className="hover:text-foreground">Reply</button>
          </div>

          {isTopLevel && hasChildren && (
            <div className="mt-2">
              {!open ? (
                <button
                  onClick={() => setOpen(true)}
                  className="text-[12px] text-muted-foreground hover:text-foreground font-semibold inline-flex items-center gap-2"
                >
                  <span className="inline-block w-6 h-px bg-muted-foreground/40" />
                  View {descendants.length} {descendants.length === 1 ? "reply" : "replies"}
                </button>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {/* Flat descendants — same indent as their first-level ancestor */}
      {isTopLevel && open && (
        <>
          {shown.map(({ node, parentAuthor }) => (
            <NestedReply key={node.id} reply={node} depth={2} mentionTo={parentAuthor} updateComment={updateComment} />
          ))}
          {remaining > 0 && (
            <button
              onClick={() => setVisible((v) => v + STEP)}
              className="text-[12px] text-muted-foreground hover:text-foreground font-semibold inline-flex items-center gap-2"
            >
              <span className="inline-block w-6 h-px bg-muted-foreground/40" />
              View {Math.min(remaining, STEP)} more {remaining === 1 ? "reply" : "replies"}
            </button>
          )}
          <button
            onClick={() => { setOpen(false); setVisible(INITIAL); }}
            className="text-[12px] text-muted-foreground hover:text-foreground font-semibold inline-flex items-center gap-2"
          >
            <span className="inline-block w-6 h-px bg-muted-foreground/40" />
            Hide replies
          </button>
        </>
      )}
    </>
  );
}

/* ──────────────────────────────────────────────────────────────
   View 4 — Sentiment review & correction
   ────────────────────────────────────────────────────────────── */

const SENTIMENT_PAGE_SIZE = 10;

function SentimentReviewView({
  comments, updateComment, openContext,
}: {
  comments: (Comment & { post: Post })[];
  updateComment: (id: string, patch: Partial<Comment>) => void;
  openContext: (commentId: string, postId: string) => void;
}) {
  const [filter, setFilter] = useState<"all" | Sentiment>("all");
  const [visibleCount, setVisibleCount] = useState(SENTIMENT_PAGE_SIZE);

  const filtered = comments.filter((c) => filter === "all" || c.sentiment === filter);
  const visible = filtered.slice(0, visibleCount);
  const remaining = filtered.length - visibleCount;

  const changeFilter = (f: "all" | Sentiment) => {
    setFilter(f);
    setVisibleCount(SENTIMENT_PAGE_SIZE);
  };

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
          <button key={s} onClick={() => changeFilter(s)}
            className={cn(
              "px-2.5 py-1 rounded-full border text-xs font-medium capitalize transition-colors",
              filter === s ? "bg-foreground text-background border-foreground" : "bg-card text-muted-foreground border-border hover:text-foreground",
            )}>
            {s === "all" ? "All" : s}
          </button>
        ))}
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
            {visible.map((c) => {
              const sm = sentimentMeta[c.sentiment];
              return (
                <tr key={c.id} className="border-t border-border hover:bg-muted/30 cursor-pointer" onClick={() => openContext(c.id, c.post.id)}>
                  <td className="px-4 py-3 max-w-[320px]">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-foreground">{c.author}</span>
                      <PlatformIcon name={c.post.platform} className="w-3 h-3" />
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{c.text}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-primary italic max-w-[200px] truncate underline decoration-dotted underline-offset-2">{c.post.title}</td>
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
                          <button key={s} onClick={(e) => { e.stopPropagation(); correct(c.id, s); }} disabled={active}
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
        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-border flex items-center justify-between bg-muted/20">
            <span className="text-xs text-muted-foreground tabular-nums">
              Showing <span className="font-semibold text-foreground">{fmt(Math.min(visibleCount, filtered.length))}</span> of <span className="font-semibold text-foreground">{fmt(filtered.length)}</span> comments
            </span>
            {remaining > 0 && (
              <button
                onClick={() => setVisibleCount((v) => v + SENTIMENT_PAGE_SIZE)}
                className="text-xs font-medium text-primary hover:underline"
              >
                Load {fmt(Math.min(remaining, SENTIMENT_PAGE_SIZE))} more
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   View 5 — Spam queue
   ────────────────────────────────────────────────────────────── */

const SPAM_PAGE_SIZE = 10;

function SpamView({
  spam, unspam, openContext,
}: {
  spam: (Comment & { post: Post })[];
  unspam: (id: string) => void;
  openContext: (commentId: string, postId: string) => void;
}) {
  const [visibleCount, setVisibleCount] = useState(SPAM_PAGE_SIZE);
  const visible = spam.slice(0, visibleCount);
  const remaining = spam.length - visibleCount;

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
        {visible.map((c) => (
          <div
            key={c.id}
            onClick={() => openContext(c.id, c.post.id)}
            className="p-4 flex items-start gap-3 cursor-pointer hover:bg-muted/30"
          >
            <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground flex-shrink-0">
              {c.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-foreground">{c.author}</span>
                <PlatformIcon name={c.post.platform} className="w-3 h-3" />
                <span className="text-[10px] text-primary underline decoration-dotted underline-offset-2">on "{c.post.title}"</span>
                <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-error/10 text-error font-medium">SPAM</span>
              </div>
              <p className="text-sm text-muted-foreground line-through">{c.text}</p>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
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
        {spam.length > 0 && (
          <div className="px-4 py-3 flex items-center justify-between bg-muted/20">
            <span className="text-xs text-muted-foreground tabular-nums">
              Showing <span className="font-semibold text-foreground">{fmt(Math.min(visibleCount, spam.length))}</span> of <span className="font-semibold text-foreground">{fmt(spam.length)}</span> comments
            </span>
            {remaining > 0 && (
              <button
                onClick={() => setVisibleCount((v) => v + SPAM_PAGE_SIZE)}
                className="text-xs font-medium text-primary hover:underline"
              >
                Load {fmt(Math.min(remaining, SPAM_PAGE_SIZE))} more
              </button>
            )}
          </div>
        )}
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
  const [newCatOpen, setNewCatOpen] = useState(false);
  const [newCat, setNewCat] = useState<{ label: string; trigger: Trigger; description: string; firstVariant: string }>({
    label: "", trigger: "general", description: "", firstVariant: "",
  });

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

  const deleteCategory = (templateId: string) => {
    setTemplates((p) => p.filter((t) => t.id !== templateId));
    toast.success("Category removed");
  };

  const createCategory = () => {
    const label = newCat.label.trim();
    if (!label) { toast.error("Category name is required"); return; }
    const firstVar = newCat.firstVariant.trim();
    setTemplates((p) => [
      ...p,
      {
        id: `T-${Date.now()}`,
        trigger: newCat.trigger,
        label,
        description: newCat.description.trim() || "Custom auto-reply category.",
        enabled: true,
        variants: firstVar ? [{ id: `v${Date.now()}`, text: firstVar, uses: 0 }] : [],
      },
    ]);
    setNewCat({ label: "", trigger: "general", description: "", firstVariant: "" });
    setNewCatOpen(false);
    toast.success(`"${label}" category added`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex items-start gap-2.5 flex-1 min-w-[280px]">
          <Shuffle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-xs text-foreground">
            <span className="font-semibold">Humanized rotation.</span> When a trigger fires, the system picks a different variant each time —
            so two customers commenting on the same post never see identical replies.
          </div>
        </div>
        <Button size="sm" onClick={() => setNewCatOpen(true)} className="gap-1.5 h-9">
          <Plus className="w-3.5 h-3.5" /> New category
        </Button>
      </div>

      <Dialog open={newCatOpen} onOpenChange={setNewCatOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>New reply category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold text-foreground mb-1.5 block">Category name</label>
              <input
                value={newCat.label}
                onChange={(e) => setNewCat((s) => ({ ...s, label: e.target.value }))}
                placeholder="e.g. Refund request"
                className="w-full h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground mb-1.5 block">Trigger type</label>
              <select
                value={newCat.trigger}
                onChange={(e) => setNewCat((s) => ({ ...s, trigger: e.target.value as Trigger }))}
                className="w-full h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                {(Object.keys(triggerToTag) as Trigger[]).map((tr) => (
                  <option key={tr} value={tr}>{triggerToTag[tr]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground mb-1.5 block">Description</label>
              <input
                value={newCat.description}
                onChange={(e) => setNewCat((s) => ({ ...s, description: e.target.value }))}
                placeholder="Short description of when this fires"
                className="w-full h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground mb-1.5 block">First variant <span className="text-muted-foreground font-normal">(optional)</span></label>
              <textarea
                value={newCat.firstVariant}
                onChange={(e) => setNewCat((s) => ({ ...s, firstVariant: e.target.value }))}
                placeholder="Type a sample reply to seed this category…"
                rows={3}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={() => setNewCatOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={createCategory}>Create category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                  <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-semibold", TAG_COLORS[triggerToTag[t.trigger]] ?? "bg-muted text-muted-foreground")}>
                    {triggerToTag[t.trigger]}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                    {t.variants.length} variants
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{t.description}</p>
              </div>
              <Switch checked={t.enabled} onCheckedChange={() => toggle(t.id)} className="flex-shrink-0" />
              <button
                onClick={() => deleteCategory(t.id)}
                title="Delete category"
                className="flex-shrink-0 p-1.5 rounded-md text-muted-foreground hover:text-error hover:bg-error/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
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

/* ──────────────────────────────────────────────────────────────
   Shared post-thread context sheet — opened from any tab so the user
   always knows which post a comment belongs to and can see the full
   thread + AI suggested reply + composer in one place.
   ────────────────────────────────────────────────────────────── */

function findCommentDeep(list: Comment[], id: string): Comment | null {
  for (const c of list) {
    if (c.id === id) return c;
    if (c.replies?.length) {
      const found = findCommentDeep(c.replies, id);
      if (found) return found;
    }
  }
  return null;
}

function PostThreadContextSheet({
  pair, posts, onClose, updateComment, addReply,
}: {
  pair: { commentId: string; postId: string } | null;
  posts: Post[];
  onClose: () => void;
  updateComment: (id: string, patch: Partial<Comment>) => void;
  addReply: (parentId: string, text: string) => void;
}) {
  const post = pair ? posts.find((p) => p.id === pair.postId) : null;

  // Build the same enriched "selected" payload the Posts tab uses so we can
  // reuse ThreadDetailColumn (post header + threaded comments + composer).
  const selected = useMemo(() => {
    if (!post) return null;
    const enriched = computePostStats(post);
    return { post, ...enriched };
  }, [post]);

  return (
    <Sheet open={!!pair} onOpenChange={(o) => { if (!o) onClose(); }}>
      <SheetContent side="right" className="w-full sm:max-w-3xl p-0 flex flex-col overflow-hidden">
        {/* Accessible title — visually hidden so we don't duplicate the post header
            already rendered inside ThreadDetailColumn. */}
        <SheetHeader className="sr-only">
          <SheetTitle>{post?.title ?? "Post & comment thread"}</SheetTitle>
        </SheetHeader>

        {selected && pair ? (
          <div className="flex-1 min-h-0 overflow-hidden">
            <ThreadDetailColumn
              key={pair.commentId}
              selected={selected}
              updateComment={updateComment}
              addReply={addReply}
              highlightCommentId={pair.commentId}
            />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground p-10 text-center">
            Comment context unavailable.
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
