import { useState } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import {
  Sparkles, BarChart3, TrendingUp, Trophy, FileText, ChevronRight,
  FileDown, Users, Activity, Eye, Zap, RefreshCw,
  AlertTriangle, Star, Hash, Clock, ImageIcon, Heart, MessageSquare,
  Shield, Share2, Facebook, Instagram, Linkedin, Twitter,
  Flame, CheckCircle, Plus, Mail, Check,
  BarChart2, PieChart, Table2, LineChart as LineChartIcon,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// ── Mock data for all views ──────────────────────────────────────────

// Overview data
const followerGrowthData = [
  { date: "Apr 12", followers: 14 },
  { date: "Apr 15", followers: 14 },
  { date: "Apr 18", followers: 13 },
  { date: "Apr 21", followers: 13 },
  { date: "Apr 24", followers: 12 },
  { date: "Apr 27", followers: 12 },
  { date: "Apr 30", followers: 12 },
  { date: "May 3",  followers: 12 },
  { date: "May 7",  followers: 12 },
];

const engagementTrendData = [
  { date: "Apr 12", engagement: 12 },
  { date: "Apr 15", engagement: 8  },
  { date: "Apr 18", engagement: 15 },
  { date: "Apr 21", engagement: 20 },
  { date: "Apr 24", engagement: 5  },
  { date: "Apr 27", engagement: 10 },
  { date: "Apr 30", engagement: 18 },
  { date: "May 3",  engagement: 7  },
  { date: "May 7",  engagement: 9  },
];

const reachImpressionsData = [
  { date: "Apr 12", reach: 0, impressions: 0 },
  { date: "Apr 15", reach: 0, impressions: 0 },
  { date: "Apr 18", reach: 0, impressions: 0 },
  { date: "Apr 21", reach: 0, impressions: 0 },
  { date: "Apr 24", reach: 0, impressions: 0 },
  { date: "Apr 27", reach: 0, impressions: 0 },
  { date: "Apr 30", reach: 0, impressions: 0 },
  { date: "May 3",  reach: 0, impressions: 0 },
  { date: "May 7",  reach: 0, impressions: 0 },
];

const engagementRateData = [
  { name: "Facebook",  value: 2.1 },
  { name: "LinkedIn",  value: 1.4 },
  { name: "Instagram", value: 0.8 },
];

const reachData = [
  { name: "Facebook",  value: 0 },
  { name: "LinkedIn",  value: 0 },
  { name: "Instagram", value: 0 },
];

const growthRateData = [
  { name: "Facebook",  value: 0.5 },
  { name: "LinkedIn",  value: 0.3 },
  { name: "Instagram", value: 0.1 },
];

const postsData = [
  { name: "Facebook",  value: 50 },
  { name: "Instagram", value: 20 },
  { name: "LinkedIn",  value: 5  },
];

const kpis = [
  { label: "Total Followers",    value: "12",  icon: Users     },
  { label: "Net Growth",         value: "0",   icon: TrendingUp },
  { label: "Posts Published",    value: "150", icon: FileText   },
  { label: "Total Engagement",   value: "79",  icon: Activity   },
  { label: "Reach",              value: "0",   icon: Eye        },
  { label: "Impressions",        value: "0",   icon: Zap        },
];

// Intelligence data
const intelligenceTimeRanges = ["7 Days", "30 Days", "All Time"] as const;
type IntelligenceTimeRange = typeof intelligenceTimeRanges[number];

// post IDs that fall within each time range (relative to May 12, 2026)
const rangePostIds: Record<IntelligenceTimeRange, number[]> = {
  "7 Days":  [3],                           // May 5 – 12
  "30 Days": [1, 2, 3, 4],                  // Apr 12 – May 12
  "All Time":[1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
};

const intelChartData: Record<IntelligenceTimeRange, { date: string; engagement: number }[]> = {
  "7 Days": [
    { date: "May 5",  engagement: 3  },
    { date: "May 6",  engagement: 20 },
    { date: "May 7",  engagement: 11 },
    { date: "May 8",  engagement: 6  },
    { date: "May 9",  engagement: 14 },
    { date: "May 10", engagement: 8  },
    { date: "May 11", engagement: 0  },
  ],
  "30 Days": [
    { date: "Apr 12", engagement: 5  },
    { date: "Apr 15", engagement: 4  },
    { date: "Apr 21", engagement: 2  },
    { date: "Apr 24", engagement: 9  },
    { date: "Apr 27", engagement: 12 },
    { date: "Apr 30", engagement: 18 },
    { date: "May 3",  engagement: 7  },
    { date: "May 7",  engagement: 9  },
    { date: "May 11", engagement: 0  },
  ],
  "All Time": [
    { date: "Mar 5",  engagement: 10 },
    { date: "Mar 12", engagement: 7  },
    { date: "Mar 20", engagement: 17 },
    { date: "Mar 28", engagement: 24 },
    { date: "Apr 5",  engagement: 6  },
    { date: "Apr 10", engagement: 6  },
    { date: "Apr 15", engagement: 4  },
    { date: "Apr 21", engagement: 2  },
    { date: "May 1",  engagement: 17 },
    { date: "May 11", engagement: 0  },
  ],
};

interface IntelRangeData {
  momentumScore: number;
  velocityLabel: string;
  velocityBadge: string;
  acceleration: string;
  followerVelocity: string;
  engagementVelocity: string;
  contentVelocity: string;
  projectedGrowth: string;
  qualityScore: number;
  qualityLabel: string;
  qualityBadgeClass: string;
  interactionDepth: number;
  audienceRelevance: number;
  contentResonance: number;
  temporalConsistency: number;
  yourRank: string;
  vsBenchmark: string;
  alerts: number;
  highPriority: number;
  mediumPriority: number;
  competitors: number;
  totalEngagement: number;
  avgEngRate: string;
  topPlatform: string;
  bestTimeLabel: string;
  hashtags: { tag: string; count: string }[];
  contentTypes: { type: string; rate: string; note: string }[];
}

const rangeData: Record<IntelligenceTimeRange, IntelRangeData> = {
  "7 Days": {
    momentumScore: 22,
    velocityLabel: "Rising",
    velocityBadge: "bg-yellow-100 text-yellow-700",
    acceleration: "+5.3%",
    followerVelocity: "+0/day",
    engagementVelocity: "1.2/post",
    contentVelocity: "5 posts/wk",
    projectedGrowth: "+0 followers in next 7 days",
    qualityScore: 22,
    qualityLabel: "POOR",
    qualityBadgeClass: "bg-red-100 text-red-600",
    interactionDepth: 20,
    audienceRelevance: 18,
    contentResonance: 30,
    temporalConsistency: 20,
    yourRank: "#1 of 1",
    vsBenchmark: "+0 pts",
    alerts: 0,
    highPriority: 0,
    mediumPriority: 0,
    competitors: 0,
    totalEngagement: 3,
    avgEngRate: "1.2%",
    topPlatform: "Instagram",
    bestTimeLabel: "Thursday 9:00 AM",
    hashtags: [
      { tag: "#Python",   count: "3x" },
      { tag: "#AI",       count: "2x" },
      { tag: "#TechJobs", count: "2x" },
    ],
    contentTypes: [
      { type: "TEXT",  rate: "0%",    note: "no engagement" },
      { type: "IMAGE", rate: "5.89%", note: "top performer" },
    ],
  },
  "30 Days": {
    momentumScore: 8,
    velocityLabel: "Declining",
    velocityBadge: "bg-red-100 text-red-600",
    acceleration: "+0.0%",
    followerVelocity: "+0/day",
    engagementVelocity: "0/post",
    contentVelocity: "23 posts/wk",
    projectedGrowth: "+0 followers in next 30 days",
    qualityScore: 0,
    qualityLabel: "POOR",
    qualityBadgeClass: "bg-red-100 text-red-600",
    interactionDepth: 0,
    audienceRelevance: 0,
    contentResonance: 0,
    temporalConsistency: 10,
    yourRank: "#1 of 1",
    vsBenchmark: "+0 pts",
    alerts: 0,
    highPriority: 0,
    mediumPriority: 0,
    competitors: 0,
    totalEngagement: 79,
    avgEngRate: "2.1%",
    topPlatform: "Facebook",
    bestTimeLabel: "Friday 9:00 AM",
    hashtags: [
      { tag: "#Python",   count: "7x" },
      { tag: "#AI",       count: "7x" },
      { tag: "#TechJobs", count: "7x" },
    ],
    contentTypes: [
      { type: "IMAGE",    rate: "5.89%", note: "drives majority" },
      { type: "CAROUSEL", rate: "0%",    note: "redesign needed" },
    ],
  },
  "All Time": {
    momentumScore: 35,
    velocityLabel: "Stable",
    velocityBadge: "bg-blue-100 text-blue-700",
    acceleration: "+1.2%",
    followerVelocity: "+0/day",
    engagementVelocity: "8.7/post",
    contentVelocity: "18 posts/wk",
    projectedGrowth: "+2 followers in next 30 days",
    qualityScore: 35,
    qualityLabel: "AVERAGE",
    qualityBadgeClass: "bg-yellow-100 text-yellow-600",
    interactionDepth: 30,
    audienceRelevance: 25,
    contentResonance: 45,
    temporalConsistency: 40,
    yourRank: "#1 of 1",
    vsBenchmark: "+15 pts",
    alerts: 1,
    highPriority: 0,
    mediumPriority: 1,
    competitors: 0,
    totalEngagement: 79,
    avgEngRate: "3.4%",
    topPlatform: "Twitter/X",
    bestTimeLabel: "Tuesday 9:00 AM",
    hashtags: [
      { tag: "#AI",       count: "12x" },
      { tag: "#TechJobs", count: "8x"  },
      { tag: "#Python",   count: "7x"  },
    ],
    contentTypes: [
      { type: "VIRAL",    rate: "18.6%", note: "highest impact" },
      { type: "IMAGE",    rate: "5.89%", note: "consistent performer" },
    ],
  },
};

// Posts data
interface Post {
  id: number;
  type: "Image" | "Text" | "Viral";
  platform: "Facebook" | "Instagram" | "LinkedIn" | "Twitter";
  date: string;
  caption: string;
  likes: number;
  comments: number;
  shares: number;
  impressions: number;
  reach: number;
  engagementRate: number;
}

const allPosts: Post[] = [
  { id: 1,  type: "Image", platform: "Instagram", date: "May 1, 2026",  caption: "Excited to share that our AI team has been working on some incredible breakthroughs...", likes: 2,  comments: 15, shares: 0, impressions: 0, reach: 0, engagementRate: 0 },
  { id: 2,  type: "Text",  platform: "Facebook",  date: "Apr 21, 2026", caption: "schedule for 21-04-2026 at 16:00",                                                          likes: 2,  comments: 0,  shares: 0, impressions: 0, reach: 0, engagementRate: 0 },
  { id: 3,  type: "Text",  platform: "Facebook",  date: "May 11, 2026", caption: "schedule post on 89",                                                                        likes: 0,  comments: 0,  shares: 0, impressions: 0, reach: 0, engagementRate: 0 },
  { id: 4,  type: "Image", platform: "LinkedIn",  date: "Apr 15, 2026", caption: "We are hiring talented engineers! Come join our fast-growing team...",                      likes: 1,  comments: 3,  shares: 1, impressions: 0, reach: 0, engagementRate: 0 },
  { id: 5,  type: "Text",  platform: "Facebook",  date: "Apr 10, 2026", caption: "Happy to announce our new partnership with TechCorp to advance AI innovation.",            likes: 3,  comments: 2,  shares: 1, impressions: 0, reach: 0, engagementRate: 0 },
  { id: 6,  type: "Image", platform: "Instagram", date: "Apr 5, 2026",  caption: "Behind the scenes of our latest product photoshoot. The team did an amazing job!",         likes: 5,  comments: 1,  shares: 0, impressions: 0, reach: 0, engagementRate: 0 },
  { id: 7,  type: "Viral", platform: "Twitter",   date: "Mar 28, 2026", caption: "Our latest blog post on the future of AI just hit 10K reads. Thank you all! 🙏",            likes: 12, comments: 4,  shares: 8, impressions: 0, reach: 0, engagementRate: 0 },
  { id: 8,  type: "Text",  platform: "LinkedIn",  date: "Mar 20, 2026", caption: "Thought leadership: Why companies must invest in AI literacy programs for all employees.",  likes: 6,  comments: 8,  shares: 3, impressions: 0, reach: 0, engagementRate: 0 },
  { id: 9,  type: "Image", platform: "Facebook",  date: "Mar 12, 2026", caption: "Check out our new office space in downtown! We're growing fast.",                          likes: 4,  comments: 2,  shares: 1, impressions: 0, reach: 0, engagementRate: 0 },
  { id: 10, type: "Text",  platform: "Instagram", date: "Mar 5, 2026",  caption: "Spring is here and so is our new product line. Swipe to see all the new features →",      likes: 7,  comments: 3,  shares: 0, impressions: 0, reach: 0, engagementRate: 0 },
];

const topPerformers = {
  mostLiked: allPosts.find((p) => p.id === 1)!,
  mostCommented: allPosts.find((p) => p.id === 1)!,
  mostShared: allPosts.find((p) => p.id === 7)!,
};

// Growth data
const growthChartData = [
  { date: "Apr 29", current: 12, previous: 14 },
  { date: "Apr 30", current: 12, previous: 14 },
  { date: "May 1",  current: 12, previous: 13 },
  { date: "May 2",  current: 12, previous: 13 },
  { date: "May 3",  current: 12, previous: 13 },
  { date: "May 4",  current: 12, previous: 13 },
  { date: "May 5",  current: 12, previous: 13 },
  { date: "May 6",  current: 12, previous: 13 },
  { date: "May 7",  current: 12, previous: 13 },
  { date: "May 8",  current: 12, previous: 13 },
  { date: "May 9",  current: 12, previous: 13 },
  { date: "May 10", current: 12, previous: 13 },
  { date: "May 11", current: 12, previous: 14 },
];

const growthEngagementData = [
  { date: "Apr 29", engagement: 5  },
  { date: "Apr 30", engagement: 12 },
  { date: "May 1",  engagement: 18 },
  { date: "May 2",  engagement: 7  },
  { date: "May 3",  engagement: 15 },
  { date: "May 4",  engagement: 9  },
  { date: "May 5",  engagement: 3  },
  { date: "May 6",  engagement: 20 },
  { date: "May 7",  engagement: 11 },
  { date: "May 8",  engagement: 6  },
  { date: "May 9",  engagement: 14 },
  { date: "May 10", engagement: 8  },
  { date: "May 11", engagement: 10 },
];

const heatmapDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const heatmapTimes = ["12AM", "3AM", "6AM", "9AM", "12PM", "3PM", "6PM", "9PM"];

const highEngagementCells = new Set([
  "1-3", "1-4", "2-3", "2-4", "3-3", "4-3", "5-3", "5-4",
  "0-4", "6-3",
]);
const peakCells = new Set(["1-3", "2-3"]);

const bestDays = [
  { day: "Tuesday",   count: 1, color: "bg-purple-500"  },
  { day: "Wednesday", count: 1, color: "bg-blue-500"    },
  { day: "Saturday",  count: 1, color: "bg-cyan-500"    },
  { day: "Monday",    count: 1, color: "bg-green-500"   },
  { day: "Thursday",  count: 1, color: "bg-yellow-500"  },
];

const bestTimeWindows = [
  { window: "9AM – 11AM",  level: "Peak",  icon: Flame,        color: "text-red-500",    bg: "bg-red-50 dark:bg-red-950/30"    },
  { window: "11AM – 1PM",  level: "High",  icon: Zap,          color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-950/30" },
  { window: "10AM – 12PM", level: "Good",  icon: CheckCircle,  color: "text-green-500",  bg: "bg-green-50 dark:bg-green-950/30" },
];

const platformRecs = [
  {
    name: "Facebook",
    icon: Facebook,
    iconColor: "text-blue-600",
    confidence: 96,
    confidenceLabel: "High Confidence",
    confidenceColor: "bg-green-100 text-green-700",
    bestDays: ["Tuesday", "Wednesday", "Saturday"],
    bestTimes: "9:00 AM – 11:00 AM",
    peakEngagement: "Friday 9:00 AM",
  },
  {
    name: "Instagram",
    icon: Instagram,
    iconColor: "text-pink-500",
    confidence: 96,
    confidenceLabel: "High Confidence",
    confidenceColor: "bg-green-100 text-green-700",
    bestDays: ["Monday", "Thursday", "Saturday"],
    bestTimes: "10:00 AM – 12:00 PM",
    peakEngagement: "Monday 10:00 AM",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    iconColor: "text-blue-700",
    confidence: 55,
    confidenceLabel: "Moderate",
    confidenceColor: "bg-yellow-100 text-yellow-700",
    bestDays: ["Tuesday", "Wednesday", "Thursday"],
    bestTimes: "8:00 AM – 10:00 AM",
    peakEngagement: "Tuesday 9:00 AM",
  },
];

// Competitors data
const supportedPlatforms = [
  { name: "Instagram", icon: Instagram, color: "text-pink-500",  available: true  },
  { name: "Facebook",  icon: Facebook,  color: "text-blue-600",  available: true  },
  { name: "LinkedIn",  icon: Linkedin,  color: "text-blue-700",  available: false },
  { name: "Twitter/X", icon: Twitter,   color: "text-sky-500",   available: true  },
];

const filterTabs = ["All 0", "Instagram 0", "Facebook 0", "Twitter/X 0"];

// Report data
const metricsOptions = [
  { id: "total_followers",  label: "Total Followers",  defaultChecked: true  },
  { id: "follower_growth",  label: "Follower Growth",  defaultChecked: true  },
  { id: "total_engagement", label: "Total Engagement", defaultChecked: true  },
  { id: "engagement_rate",  label: "Engagement Rate",  defaultChecked: false },
  { id: "reach",            label: "Reach",            defaultChecked: false },
  { id: "impressions",      label: "Impressions",      defaultChecked: false },
  { id: "posts_published",  label: "Posts Published",  defaultChecked: false },
  { id: "comments",         label: "Comments",         defaultChecked: false },
  { id: "shares",           label: "Shares",           defaultChecked: false },
];

const reportAccounts = [
  { id: "a1", name: "AI trial",           platform: "Facebook",  icon: Facebook,  iconColor: "text-blue-600" },
  { id: "a2", name: "AI Page trial",      platform: "Facebook",  icon: Facebook,  iconColor: "text-blue-600" },
  { id: "a3", name: "pank_aaj2000",       platform: "Instagram", icon: Instagram, iconColor: "text-pink-500" },
  { id: "a4", name: "Harsh Kewalramani", platform: "LinkedIn",  icon: Linkedin,  iconColor: "text-blue-700" },
];

const vizOptions = [
  { id: "line",  label: "Line Chart",  icon: LineChartIcon, defaultChecked: true  },
  { id: "bar",   label: "Bar Chart",   icon: BarChart3,     defaultChecked: true  },
  { id: "pie",   label: "Pie Chart",   icon: PieChart,      defaultChecked: false },
  { id: "table", label: "Data Table",  icon: Table2,        defaultChecked: false },
];

// ── Shared helper components ────────────────────────────────────────

function HorizontalBar({ data, color }: { data: { name: string; value: number }[]; color: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="space-y-2">
      {data.map((item) => (
        <div key={item.name} className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground w-20 shrink-0">{item.name}</span>
          <div className="flex-1 bg-muted/40 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all"
              style={{ width: `${(item.value / max) * 100}%`, backgroundColor: color }}
            />
          </div>
          <span className="text-xs text-foreground w-10 text-right tabular-nums">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

function ScoreRing({ score, label, sub }: { score: number; label: string; sub: string }) {
  const r = 38;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const stroke = score > 60 ? "#22c55e" : score > 30 ? "#f97316" : score > 10 ? "#f59e0b" : "#6b7280";
  return (
    <div className="flex flex-col items-center gap-1 shrink-0">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
          <circle
            cx="48" cy="48" r={r} fill="none"
            stroke={stroke} strokeWidth="8"
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
            style={{ transition: "stroke-dasharray 0.5s ease, stroke 0.3s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-foreground tabular-nums">{score}</span>
        </div>
      </div>
      {label && <span className="text-xs font-semibold text-foreground uppercase tracking-wide">{label}</span>}
      {sub   && <span className="text-[11px] text-muted-foreground">{sub}</span>}
    </div>
  );
}

function QualityBar({ label, score }: { label: string; score: number }) {
  const color = score > 60 ? "#22c55e" : score > 30 ? "#f97316" : score > 10 ? "#f59e0b" : "#6b7280";
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-xs font-semibold text-foreground">{score}/100</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full">
        <div
          className="h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

const platformAvatarColors: Record<string, string> = {
  Facebook: "bg-blue-600", Instagram: "bg-pink-500", LinkedIn: "bg-blue-700", Twitter: "bg-sky-500",
};

function IntelPostCard({ post }: { post: Post }) {
  const total = post.likes + post.comments + post.shares;
  return (
    <div className="border border-border rounded-xl p-3 space-y-2.5 hover:border-primary/30 hover:bg-primary/5 transition-colors">
      <div className="flex items-start gap-2.5">
        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0", platformAvatarColors[post.platform] ?? "bg-gray-500")}>
          AT
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-foreground line-clamp-2 leading-snug">{post.caption}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <PlatformIcon platform={post.platform} className="w-3 h-3" />
            <span className="text-[11px] text-muted-foreground">{post.date}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 pt-2 border-t border-border/60 text-[11px]">
        <span className="flex items-center gap-1 text-red-500"><Heart className="w-3 h-3" /> {post.likes}</span>
        <span className="flex items-center gap-1 text-blue-500"><MessageSquare className="w-3 h-3" /> {post.comments}</span>
        <span className="flex items-center gap-1 text-muted-foreground"><Share2 className="w-3 h-3" /> {post.shares}</span>
        <span className="ml-auto text-xs font-semibold text-foreground">{total} total</span>
      </div>
    </div>
  );
}

function PlatformIcon({ platform, className }: { platform: string; className?: string }) {
  const base = cn("w-4 h-4", className);
  switch (platform) {
    case "Facebook":  return <Facebook  className={cn(base, "text-blue-600")} />;
    case "Instagram": return <Instagram className={cn(base, "text-pink-500")} />;
    case "LinkedIn":  return <Linkedin  className={cn(base, "text-blue-700")} />;
    default:          return <Twitter   className={cn(base, "text-sky-500")}  />;
  }
}

function TypeBadge({ type }: { type: Post["type"] }) {
  const styles = {
    Image:  "bg-blue-100 text-blue-700",
    Text:   "bg-gray-100 text-gray-600",
    Viral:  "bg-orange-100 text-orange-600",
  };
  return (
    <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded", styles[type])}>
      {type}
    </span>
  );
}

function TopPerformerCard({
  title,
  headerColor,
  post,
  metric,
  metricValue,
}: {
  title: string;
  headerColor: string;
  post: Post;
  metric: string;
  metricValue: number | string;
}) {
  return (
    <div className="bg-card rounded-xl shadow-card overflow-hidden">
      <div className={cn("px-4 py-3", headerColor)}>
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">{title}</h3>
      </div>
      <div className="p-4 space-y-3">
        <div className="bg-muted/40 rounded-lg p-3 min-h-[60px] flex items-center">
          {post.type === "Image" ? (
            <div className="w-full h-14 bg-gradient-to-br from-gray-200 to-gray-300 rounded flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-gray-400" />
            </div>
          ) : (
            <p className="text-xs text-foreground line-clamp-3">{post.caption}</p>
          )}
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <PlatformIcon platform={post.platform} />
          <span className="text-muted-foreground">{post.date}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-muted-foreground">{metric}: </span>
            <span className="font-semibold text-foreground">{metricValue}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Eng. Rate: </span>
            <span className="font-semibold text-foreground">0%</span>
          </div>
          <div>
            <span className="text-muted-foreground">Reach: </span>
            <span className="font-semibold text-foreground">0</span>
          </div>
          <div>
            <span className="text-muted-foreground">vs. Avg: </span>
            <span className="font-semibold text-red-500">-100%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PostGridCard({ post }: { post: Post }) {
  return (
    <div className="bg-card rounded-xl shadow-card overflow-hidden border border-border hover:border-primary/30 transition-colors">
      <div className="relative bg-muted h-28 flex items-center justify-center">
        {post.type === "Image" ? (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-blue-400" />
          </div>
        ) : post.type === "Viral" ? (
          <div className="w-full h-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
            <Zap className="w-8 h-8 text-orange-400" />
          </div>
        ) : (
          <div className="w-full h-full bg-muted/60 flex items-center justify-center p-3">
            <p className="text-[10px] text-muted-foreground text-center line-clamp-4">{post.caption}</p>
          </div>
        )}
        <div className="absolute top-2 left-2">
          <TypeBadge type={post.type} />
        </div>
      </div>
      <div className="p-3 space-y-2">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <PlatformIcon platform={post.platform} />
          <span>{post.date}</span>
        </div>
        <p className="text-[11px] text-foreground line-clamp-2">{post.caption}</p>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground pt-1 border-t border-border">
          <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {post.likes}</span>
          <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {post.comments}</span>
          <span className="flex items-center gap-1"><Share2 className="w-3 h-3" /> {post.shares}</span>
          <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {post.impressions}</span>
        </div>
      </div>
    </div>
  );
}

function HeatmapCell({ dayIdx, timeIdx }: { dayIdx: number; timeIdx: number }) {
  const key = `${dayIdx}-${timeIdx}`;
  const isPeak = peakCells.has(key);
  const isHigh = highEngagementCells.has(key);
  return (
    <div
      className={cn(
        "h-7 rounded transition-colors",
        isPeak  ? "bg-gray-800 dark:bg-gray-200"  :
        isHigh  ? "bg-gray-500 dark:bg-gray-500"  :
                  "bg-muted/40",
      )}
    />
  );
}

// ── Sub-view components ─────────────────────────────────────────────

function OverviewView({ navigate, pathname }: { navigate: (path: string) => void; pathname: string }) {
  const [platform, setPlatform] = useState("All Platforms");
  const [account, setAccount] = useState("All Accounts");
  const [timeRange, setTimeRange] = useState("All Time");

  const subPages = [
    { label: "Intelligence Layer",  icon: Sparkles,   path: `${pathname}?view=intelligence` },
    { label: "Post Performance",    icon: BarChart3,   path: `${pathname}?view=posts`        },
    { label: "Growth Insights",     icon: TrendingUp,  path: `${pathname}?view=growth`       },
    { label: "Competitor Analysis", icon: Trophy,      path: `${pathname}?view=competitors`  },
    { label: "Create Report",       icon: FileText,    path: `${pathname}?view=report`       },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">Analytics Overview</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Track performance across all your connected social media accounts
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium bg-card outline-none"
          >
            {["All Platforms", "Facebook", "Instagram", "LinkedIn", "Twitter/X"].map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
          <select
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium bg-card outline-none"
          >
            {["All Accounts", "AI trial", "AI Page trial", "pank_aaj2000", "Harsh Kewalramani"].map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium bg-card outline-none"
          >
            {["All Time", "Last 7 Days", "Last 30 Days", "Last 90 Days"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <Button size="sm" variant="outline">
            <FileDown className="w-3.5 h-3.5 mr-1" /> Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-card rounded-xl p-4 shadow-card">
            <div className="flex items-center gap-2 mb-2">
              <kpi.icon className="w-4 h-4 text-primary" />
              <span className="text-[11px] text-muted-foreground leading-tight">{kpi.label}</span>
            </div>
            <p className="text-3xl font-bold tracking-tighter text-foreground tabular-nums">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Navigation to Sub-pages */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {subPages.map((sp) => (
          <button
            key={sp.path}
            onClick={() => navigate(sp.path)}
            className="bg-card rounded-xl p-4 shadow-card border border-border hover:border-primary/40 hover:bg-primary/5 transition-colors text-left flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <sp.icon className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs font-medium text-foreground">{sp.label}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
        ))}
      </div>

      {/* Follower Growth + Engagement Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl shadow-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Follower Growth Trend</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={followerGrowthData}>
              <defs>
                <linearGradient id="followerGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" domain={[10, 16]} />
              <Tooltip />
              <Area type="monotone" dataKey="followers" stroke="#3b82f6" strokeWidth={2} fill="url(#followerGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl shadow-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Engagement Trend</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={engagementTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip />
              <Bar dataKey="engagement" fill="#a855f7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Reach & Impressions */}
      <div className="bg-card rounded-xl shadow-card p-5">
        <h2 className="text-sm font-semibold text-foreground mb-4">Reach & Impressions</h2>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={reachImpressionsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="reach" stroke="#f97316" strokeWidth={2} name="Reach" dot={false} />
            <Line type="monotone" dataKey="impressions" stroke="#3b82f6" strokeWidth={2} name="Impressions" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Platform Comparison */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-4">Platform Comparison</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-card rounded-xl shadow-card p-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Engagement Rate</h3>
              <HorizontalBar data={engagementRateData} color="#a855f7" />
            </div>
            <div className="bg-card rounded-xl shadow-card p-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Reach</h3>
              <HorizontalBar data={reachData} color="#3b82f6" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-card rounded-xl shadow-card p-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Growth Rate</h3>
              <HorizontalBar data={growthRateData} color="#22c55e" />
            </div>
            <div className="bg-card rounded-xl shadow-card p-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Posts (30 Days)</h3>
              <HorizontalBar data={postsData} color="#3b82f6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function IntelligenceView({ navigate, pathname }: { navigate: (path: string) => void; pathname: string }) {
  const [activeRange, setActiveRange] = useState<IntelligenceTimeRange>("30 Days");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const d = rangeData[activeRange];
  const chartData = intelChartData[activeRange];

  const rangePosts = allPosts.filter(p => rangePostIds[activeRange].includes(p.id));
  const topByLikes    = [...rangePosts].sort((a, b) => b.likes    - a.likes   ).slice(0, 3);
  const topByComments = [...rangePosts].sort((a, b) => b.comments - a.comments).slice(0, 3);

  function handleRefresh() {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1200);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-purple-500/15 flex items-center justify-center shrink-0">
            <Sparkles className={cn("w-4.5 h-4.5 text-purple-500", isRefreshing && "animate-spin")} />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-foreground leading-tight">Advanced Intelligence Layer</h1>
            <p className="text-xs text-muted-foreground">AI-powered insights · {activeRange}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={cn("w-3.5 h-3.5 mr-1", isRefreshing && "animate-spin")} />
            {isRefreshing ? "Refreshing…" : "Refresh"}
          </Button>
          <div className="flex items-center border border-border rounded-lg overflow-hidden">
            {intelligenceTimeRanges.map((r) => (
              <button
                key={r}
                onClick={() => setActiveRange(r)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium transition-colors",
                  activeRange === r
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alert Banner */}
      <div className={cn(
        "border rounded-xl p-4 flex items-center justify-between flex-wrap gap-3 transition-colors",
        d.alerts > 0 ? "bg-amber-500/10 border-amber-500/20" : "bg-purple-500/10 border-purple-500/20",
      )}>
        <div className="flex items-center gap-2 flex-wrap">
          <AlertTriangle className={cn("w-4 h-4", d.alerts > 0 ? "text-amber-500" : "text-purple-500")} />
          <span className="text-sm font-medium text-foreground">
            {d.alerts} Intelligence Alert{d.alerts !== 1 ? "s" : ""}
          </span>
          <span className="text-sm text-muted-foreground">
            — {d.highPriority} high priority, {d.mediumPriority} medium priority
          </span>
        </div>
        <span className="text-xs bg-purple-500/20 text-purple-600 px-3 py-1 rounded-full font-medium">
          {d.competitors} competitors monitored
        </span>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Engagement", value: d.totalEngagement.toString(), icon: Activity,   color: "text-purple-500", bg: "bg-purple-500/10" },
          { label: "Avg Eng. Rate",    value: d.avgEngRate,                  icon: TrendingUp,  color: "text-green-500",  bg: "bg-green-500/10"  },
          { label: "Top Platform",     value: d.topPlatform,                 icon: Star,        color: "text-yellow-500", bg: "bg-yellow-500/10" },
          { label: "Best Post Time",   value: d.bestTimeLabel,               icon: Clock,       color: "text-blue-500",   bg: "bg-blue-500/10"   },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-card rounded-xl shadow-card p-4 flex items-center gap-3">
            <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", kpi.bg)}>
              <kpi.icon className={cn("w-4 h-4", kpi.color)} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide leading-none mb-1">{kpi.label}</p>
              <p className="text-sm font-bold text-foreground truncate">{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Growth Velocity + Engagement Quality */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Velocity */}
        <div className="bg-card rounded-xl shadow-card p-5 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Growth Velocity Indicator</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Momentum and acceleration metrics</p>
            </div>
            <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium shrink-0", d.velocityBadge)}>
              {d.velocityLabel}
            </span>
          </div>

          <div className="flex items-center gap-5">
            <ScoreRing score={d.momentumScore} label="Momentum" sub={d.velocityLabel} />
            <div className="flex-1 space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Growth Acceleration</span>
                  <span className="font-semibold text-foreground">{d.acceleration}</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full">
                  <div
                    className="h-1.5 rounded-full bg-green-500 transition-all duration-500"
                    style={{ width: `${Math.min(Math.abs(parseFloat(d.acceleration)) * 10, 100)}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Follower",    value: d.followerVelocity    },
                  { label: "Engagement",  value: d.engagementVelocity  },
                  { label: "Content",     value: d.contentVelocity     },
                ].map((m) => (
                  <div key={m.label} className="bg-muted/40 rounded-lg p-2 text-center">
                    <div className="text-xs font-bold text-foreground leading-tight">{m.value}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mini engagement trend chart */}
          <div className="pt-2 border-t border-border">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">Engagement Trend</div>
            <ResponsiveContainer width="100%" height={64}>
              <AreaChart data={chartData} margin={{ top: 2, right: 2, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="intelGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 9 }} stroke="transparent" tickLine={false} />
                <YAxis tick={{ fontSize: 9 }} stroke="transparent" tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 11, padding: "4px 8px" }} />
                <Area type="monotone" dataKey="engagement" stroke="#a855f7" strokeWidth={1.5} fill="url(#intelGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-muted/40 rounded-lg p-3 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Projected: </span>
            {d.projectedGrowth}
          </div>
        </div>

        {/* Engagement Quality Score */}
        <div className="bg-card rounded-xl shadow-card p-5 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Engagement Quality Score</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Weighted scoring with competitor benchmarking</p>
            </div>
            <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium shrink-0", d.qualityBadgeClass)}>
              {d.qualityLabel}
            </span>
          </div>

          {/* Ring + 4 bars side-by-side */}
          <div className="flex items-center gap-5">
            <ScoreRing score={d.qualityScore} label="Quality" sub={`${d.qualityScore}/100`} />
            <div className="flex-1 space-y-2.5">
              {[
                { label: "Interaction Depth",    score: d.interactionDepth    },
                { label: "Audience Relevance",   score: d.audienceRelevance   },
                { label: "Content Resonance",    score: d.contentResonance    },
                { label: "Temporal Consistency", score: d.temporalConsistency },
              ].map((bar) => {
                const barColor = bar.score > 60 ? "#22c55e" : bar.score > 30 ? "#f97316" : bar.score > 10 ? "#f59e0b" : "#6b7280";
                return (
                  <div key={bar.label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{bar.label}</span>
                      <span className="font-semibold tabular-nums" style={{ color: barColor }}>{bar.score}/100</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full">
                      <div
                        className="h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${bar.score || 2}%`, backgroundColor: barColor }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Benchmark — same border-t section style as Growth Velocity */}
          <div className="pt-2 border-t border-border">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Competitor Benchmark</div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-muted/40 rounded-lg p-2 text-center">
                <div className="text-xs font-bold text-foreground">{d.yourRank}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">Your Rank</div>
              </div>
              <div className="bg-muted/40 rounded-lg p-2 text-center">
                <div className={cn("text-xs font-bold", d.vsBenchmark.startsWith("+") ? "text-green-600" : "text-red-500")}>{d.vsBenchmark}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">vs Average</div>
              </div>
            </div>
          </div>

          <div className="bg-muted/40 rounded-lg p-3 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Quality rating: </span>
            {d.qualityScore > 60 ? "Good engagement depth across your content." : d.qualityScore > 30 ? "Average quality — focus on replies and saves." : "Low quality — encourage comments and shares."}
          </div>
        </div>
      </div>

      {/* AI-Trained Content Insights */}
      <div className="bg-card rounded-xl shadow-card p-5 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-green-500/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-green-600" />
          </div>
          <h2 className="text-sm font-semibold text-foreground">AI-Trained Content Insights</h2>
          <span className="ml-auto text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">{activeRange}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Trending Hashtags */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 mb-2">
              <Hash className="w-3.5 h-3.5 text-primary" />
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Trending Hashtags</span>
            </div>
            {d.hashtags.map((h, i) => (
              <div key={h.tag} className="flex items-center justify-between bg-muted/40 rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-muted-foreground">#{i + 1}</span>
                  <span className="text-xs font-medium text-primary">{h.tag}</span>
                </div>
                <span className="text-[11px] font-semibold text-foreground bg-primary/10 px-1.5 py-0.5 rounded">{h.count}</span>
              </div>
            ))}
          </div>

          {/* Best Posting Time */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 mb-2">
              <Clock className="w-3.5 h-3.5 text-yellow-500" />
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Best Posting Time</span>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 flex items-start gap-2">
              <Star className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-bold text-foreground">{d.bestTimeLabel}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">Optimal window for max engagement</div>
              </div>
            </div>
            <div className="bg-muted/40 rounded-lg p-3 text-xs text-muted-foreground">
              Posting at this time can boost engagement by up to{" "}
              <span className="font-semibold text-green-600">23%</span>
            </div>
          </div>

          {/* Content Type Performance */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 mb-2">
              <BarChart2 className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Content Types</span>
            </div>
            {d.contentTypes.map((c) => (
              <div key={c.type} className="bg-muted/40 rounded-lg px-3 py-2 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">{c.type}</span>
                  <span className="text-xs font-bold text-primary">{c.rate}</span>
                </div>
                <div className="text-[11px] text-muted-foreground">{c.note}</div>
                <div className="h-1 bg-muted rounded-full">
                  <div
                    className="h-1 rounded-full bg-blue-500 transition-all duration-500"
                    style={{ width: parseFloat(c.rate) > 0 ? `${Math.min(parseFloat(c.rate) * 10, 100)}%` : "2%" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl shadow-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500" />
              <h2 className="text-sm font-semibold text-foreground">Top Posts by Likes</h2>
            </div>
            <span className="text-[10px] text-muted-foreground">{activeRange}</span>
          </div>
          {topByLikes.length > 0 ? (
            <div className="space-y-2.5">
              {topByLikes.map((post) => <IntelPostCard key={post.id} post={post} />)}
            </div>
          ) : (
            <div className="py-8 flex flex-col items-center gap-2 text-center">
              <FileText className="w-8 h-8 text-muted-foreground/40" />
              <p className="text-xs text-muted-foreground">No posts in this time range</p>
            </div>
          )}
        </div>

        <div className="bg-card rounded-xl shadow-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-500" />
              <h2 className="text-sm font-semibold text-foreground">Top Posts by Comments</h2>
            </div>
            <span className="text-[10px] text-muted-foreground">{activeRange}</span>
          </div>
          {topByComments.length > 0 ? (
            <div className="space-y-2.5">
              {topByComments.map((post) => <IntelPostCard key={post.id} post={post} />)}
            </div>
          ) : (
            <div className="py-8 flex flex-col items-center gap-2 text-center">
              <FileText className="w-8 h-8 text-muted-foreground/40" />
              <p className="text-xs text-muted-foreground">No posts in this time range</p>
            </div>
          )}
        </div>
      </div>

      {/* Competitor Panel + Optimal Window */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl shadow-card p-5 flex flex-col items-center justify-center gap-3 min-h-[172px]">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <Shield className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="text-center">
            <h3 className="text-sm font-semibold text-foreground">No Competitor Alerts</h3>
            <p className="text-xs text-muted-foreground mt-1">Add competitors to receive intelligent activity alerts</p>
          </div>
          <Button
            size="sm"
            className="bg-purple-600 hover:bg-purple-700 text-white"
            onClick={() => navigate(`${pathname}?view=competitors`)}
          >
            <Users className="w-3.5 h-3.5 mr-1" /> Add Competitors
          </Button>
        </div>

        <div className="bg-card rounded-xl shadow-card p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Optimal Posting Window</h2>
          </div>
          <div className="space-y-2">
            {bestTimeWindows.map((w) => (
              <div key={w.window} className={cn("rounded-lg p-3 flex items-center gap-3", w.bg)}>
                <w.icon className={cn("w-4 h-4 shrink-0", w.color)} />
                <div className="flex-1">
                  <div className="text-xs font-semibold text-foreground">{w.window}</div>
                  <div className={cn("text-[10px] font-medium", w.color)}>{w.level} Engagement</div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-muted/40 rounded-lg p-3 text-xs text-muted-foreground">
            Best window for {activeRange}:{" "}
            <span className="font-semibold text-foreground">{d.bestTimeLabel}</span>.
            Posting here can increase engagement by up to{" "}
            <span className="font-semibold text-green-600">23%</span>.
          </div>
        </div>
      </div>
    </div>
  );
}

function PostsView({ navigate, pathname }: { navigate: (path: string) => void; pathname: string }) {
  const [platformFilter, setPlatformFilter] = useState("All Platforms");
  const [typeFilter, setTypeFilter] = useState("All");
  const [postTypeFilter, setPostTypeFilter] = useState("All Types");
  const [sortBy, setSortBy] = useState("Highest Engagement Rate");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <h1 className="text-lg font-bold text-foreground leading-tight">Post Performance</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Analyze individual post performance and identify your best content</p>
        </div>
        <Button variant="outline" size="sm" className="shrink-0">
          <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh Data
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium bg-card outline-none"
          >
            {["All Platforms", "Facebook", "Instagram", "LinkedIn", "Twitter/X"].map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
          <div className="flex items-center border border-border rounded-lg overflow-hidden">
            {["All", "Published", "Scheduled"].map((f) => (
              <button
                key={f}
                onClick={() => setTypeFilter(f)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium transition-colors",
                  typeFilter === f
                    ? "bg-foreground text-background"
                    : "bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <select
            value={postTypeFilter}
            onChange={(e) => setPostTypeFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium bg-card outline-none"
          >
            {["All Types", "Image", "Text", "Video", "Viral"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium bg-card outline-none"
        >
          {["Highest Engagement Rate", "Most Likes", "Most Comments", "Most Shares", "Most Recent"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Top Performers */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-sm font-semibold text-foreground">Top Performers</h2>
          <span className="text-[11px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full">Auto-detected insights</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TopPerformerCard
            title="Most Liked Post"
            headerColor="bg-gradient-to-r from-pink-500 to-rose-500"
            post={topPerformers.mostLiked}
            metric="Likes"
            metricValue={2}
          />
          <TopPerformerCard
            title="Most Commented Post"
            headerColor="bg-gradient-to-r from-purple-600 to-indigo-600"
            post={topPerformers.mostCommented}
            metric="Comments"
            metricValue={15}
          />
          <TopPerformerCard
            title="Most Shared Post"
            headerColor="bg-gradient-to-r from-green-500 to-emerald-600"
            post={topPerformers.mostShared}
            metric="Shares"
            metricValue={8}
          />
        </div>
      </div>

      {/* All Posts Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground">All Posts</h2>
          <span className="text-xs text-muted-foreground">150 posts found</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {allPosts.map((post) => (
            <PostGridCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}

function GrowthView({ navigate, pathname }: { navigate: (path: string) => void; pathname: string }) {
  const [platformFilter, setPlatformFilter] = useState("All Platforms");
  const [dateFilter, setDateFilter] = useState("Last 30 Days");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <h1 className="text-lg font-bold text-foreground leading-tight">Audience Growth &amp; Posting Insights</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Real-time growth patterns and optimal posting times across your connected platforms</p>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-100 dark:bg-green-950/40 px-3 py-1 rounded-full shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Live Data
        </span>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <select
          value={platformFilter}
          onChange={(e) => setPlatformFilter(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium bg-card outline-none"
        >
          {["All Platforms", "Facebook", "Instagram", "LinkedIn"].map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium bg-card outline-none"
        >
          {["Last 7 Days", "Last 30 Days", "Last 90 Days"].map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl shadow-card p-4">
          <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Net Growth (30D)
          </div>
          <div className="text-3xl font-bold text-foreground tabular-nums">±2</div>
          <div className="text-xs text-muted-foreground mt-1">Total followers: 12</div>
        </div>
        <div className="bg-card rounded-xl shadow-card p-4">
          <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Growth Velocity
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-foreground tabular-nums">0</span>
            <span className="text-sm text-muted-foreground mb-1">/day</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-muted-foreground">avg. new followers per day</span>
            <span className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full font-medium">LOW</span>
          </div>
        </div>
        <div className="bg-card rounded-xl shadow-card p-4">
          <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Growth Health
          </div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base font-bold text-foreground">Moderate Growth</span>
            <span className="text-[10px] bg-yellow-100 dark:bg-yellow-950/40 text-yellow-700 px-2 py-0.5 rounded-full font-medium">MODERATE</span>
          </div>
          <div className="text-xs text-muted-foreground">Growth is stable but could improve with optimized posting.</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl shadow-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Daily Follower Growth</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={growthChartData}>
              <defs>
                <linearGradient id="currentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="prevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9ca3af" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#9ca3af" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" domain={[10, 16]} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="current"  stroke="#3b82f6" strokeWidth={2} fill="url(#currentGrad)" name="Current Period" />
              <Area type="monotone" dataKey="previous" stroke="#9ca3af" strokeWidth={1.5} fill="url(#prevGrad)" name="Previous Period" strokeDasharray="4 4" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl shadow-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Engagement Trend</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={growthEngagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip />
              <Bar dataKey="engagement" fill="#a855f7" radius={[4, 4, 0, 0]} name="Engagement" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Optimal Posting Times Heatmap */}
      <div className="bg-card rounded-xl shadow-card p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className="text-sm font-semibold text-foreground">Optimal Posting Times</h2>
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-muted/40 inline-block" /> Low</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-400 inline-block" /> Medium</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-600 inline-block" /> High</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-800 dark:bg-gray-200 inline-block" /> Peak</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[520px]">
            <div className="grid gap-1 mb-1" style={{ gridTemplateColumns: "60px repeat(8, 1fr)" }}>
              <div />
              {heatmapTimes.map((t) => (
                <div key={t} className="text-center text-[10px] text-muted-foreground">{t}</div>
              ))}
            </div>
            {heatmapDays.map((day, dIdx) => (
              <div key={day} className="grid gap-1 mb-1" style={{ gridTemplateColumns: "60px repeat(8, 1fr)" }}>
                <div className="text-[11px] text-muted-foreground flex items-center">{day}</div>
                {heatmapTimes.map((_, tIdx) => (
                  <HeatmapCell key={tIdx} dayIdx={dIdx} timeIdx={tIdx} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Best Days + Best Time Windows */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl shadow-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Best Days to Post</h2>
          <div className="space-y-2">
            {bestDays.map((item, i) => (
              <div key={item.day} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-4 text-right">{i + 1}</span>
                <span className="text-xs font-medium text-foreground w-24">{item.day}</span>
                <div className="flex-1 h-2 bg-muted/40 rounded-full">
                  <div
                    className={cn("h-2 rounded-full", item.color)}
                    style={{ width: `${(bestDays.length - i) * 20}%` }}
                  />
                </div>
                <span className="text-[11px] text-muted-foreground">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Best Time Windows</h2>
          <div className="space-y-3">
            {bestTimeWindows.map((item) => (
              <div key={item.window} className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5", item.bg)}>
                <item.icon className={cn("w-4 h-4 shrink-0", item.color)} />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-foreground">{item.window}</div>
                </div>
                <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", item.color === "text-red-500" ? "bg-red-100 text-red-600" : item.color === "text-yellow-500" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700")}>
                  {item.level}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Platform-Specific Recommendations */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-4">Platform-Specific Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {platformRecs.map((rec) => (
            <div key={rec.name} className="bg-card rounded-xl shadow-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <rec.icon className={cn("w-5 h-5", rec.iconColor)} />
                  <span className="text-sm font-semibold text-foreground">{rec.name}</span>
                </div>
                <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full", rec.confidenceColor)}>
                  {rec.confidence}% {rec.confidenceLabel}
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="text-muted-foreground mb-1">Best Days</div>
                  <div className="flex flex-wrap gap-1">
                    {rec.bestDays.map((d) => (
                      <span key={d} className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-[11px]">{d}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Best Times</span>
                  <span className="font-medium text-foreground">{rec.bestTimes}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Peak Engagement</span>
                  <span className="font-medium text-foreground">{rec.peakEngagement}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CompetitorsView({ navigate, pathname }: { navigate: (path: string) => void; pathname: string }) {
  const [activeTab, setActiveTab] = useState("All 0");
  const [selectedPlatform, setSelectedPlatform] = useState("Instagram");
  const [profileInput, setProfileInput] = useState("");
  const [groupSelect, setGroupSelect] = useState("No groups yet");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <h1 className="text-lg font-bold text-foreground leading-tight">Competitor Watchlist</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Monitor and analyze your competitors' social media performance</p>
        </div>
      </div>

      {/* Purple Banner */}
      <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="text-sm font-semibold text-foreground">Ready to Compare Performance?</div>
          <div className="text-xs text-muted-foreground mt-0.5">
            Benchmark your metrics against competitors and identify opportunities
          </div>
        </div>
        <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
          View Comparison Dashboard <ChevronRight className="w-3.5 h-3.5 ml-1" />
        </Button>
      </div>

      {/* Usage Bar */}
      <div className="bg-card rounded-xl shadow-card p-5">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-sm font-semibold text-foreground">0 of 10 Competitors Used</span>
            <p className="text-xs text-muted-foreground mt-0.5">10 slots remaining on your current plan</p>
          </div>
          <span className="text-xs text-muted-foreground">0%</span>
        </div>
        <div className="h-2 bg-muted/40 rounded-full">
          <div className="h-2 bg-primary rounded-full" style={{ width: "0%" }} />
        </div>
      </div>

      {/* Add Competitor */}
      <div className="bg-card rounded-xl shadow-card p-5 space-y-4">
        <h2 className="text-sm font-semibold text-foreground">Add Competitor</h2>
        <div className="flex items-end gap-2 flex-wrap">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground font-medium">Platform</label>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="px-3 py-2 rounded-lg border border-border text-xs font-medium bg-background outline-none"
            >
              {["Instagram", "Facebook", "Twitter/X"].map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1 flex-1 min-w-[180px]">
            <label className="text-xs text-muted-foreground font-medium">Profile URL / Handle / Username</label>
            <input
              type="text"
              value={profileInput}
              onChange={(e) => setProfileInput(e.target.value)}
              placeholder="@username or profile URL"
              className="px-3 py-2 rounded-lg border border-border text-xs bg-background outline-none focus:ring-1 ring-primary placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground font-medium">Group</label>
            <select
              value={groupSelect}
              onChange={(e) => setGroupSelect(e.target.value)}
              className="px-3 py-2 rounded-lg border border-border text-xs font-medium bg-background outline-none"
            >
              <option>No groups yet</option>
            </select>
          </div>
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white h-8 w-8 p-0 rounded-lg">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div>
          <div className="text-[11px] text-muted-foreground font-medium mb-2 uppercase tracking-wider">Supported Platforms</div>
          <div className="flex items-center gap-2 flex-wrap">
            {supportedPlatforms.map((p) => (
              <div
                key={p.name}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium",
                  p.available
                    ? "border-border bg-card"
                    : "border-dashed border-border bg-muted/30 opacity-60",
                )}
              >
                <p.icon className={cn("w-3.5 h-3.5", p.color)} />
                {p.name}
                {!p.available && <span className="text-[10px] text-muted-foreground">(Soon)</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter tabs + table */}
      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center border border-border rounded-lg overflow-hidden">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-1.5 text-xs font-medium transition-colors",
                  activeTab === tab
                    ? "bg-foreground text-background"
                    : "bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <select className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium bg-background outline-none">
              <option>All Groups</option>
            </select>
            <Button variant="outline" size="sm">
              <Plus className="w-3 h-3 mr-1" /> New Group
            </Button>
            <span className="text-xs text-muted-foreground">Showing 0 competitors</span>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted-foreground border-b border-border bg-muted/40">
              <th className="px-5 py-3 font-medium">Competitor</th>
              <th className="px-5 py-3 font-medium">Platform</th>
              <th className="px-5 py-3 font-medium text-right">Followers</th>
              <th className="px-5 py-3 font-medium text-right">Engagement Rate</th>
              <th className="px-5 py-3 font-medium">Group</th>
              <th className="px-5 py-3 font-medium">Last Updated</th>
              <th className="px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={7} className="px-5 py-16 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                    <Users className="w-7 h-7 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">No competitors yet</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Add your first competitor using the form above</p>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReportView({ navigate, pathname }: { navigate: (path: string) => void; pathname: string }) {
  const [reportName, setReportName] = useState("Monthly Analytics Report");
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [summary, setSummary] = useState("");
  const [selectedMetrics, setSelectedMetrics] = useState<Set<string>>(
    new Set(metricsOptions.filter((m) => m.defaultChecked).map((m) => m.id))
  );
  const [selectedAccounts, setSelectedAccounts] = useState<Set<string>>(
    new Set(reportAccounts.map((a) => a.id))
  );
  const [selectedViz, setSelectedViz] = useState<Set<string>>(
    new Set(vizOptions.filter((v) => v.defaultChecked).map((v) => v.id))
  );

  const toggleMetric = (id: string) => {
    setSelectedMetrics((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAccount = (id: string) => {
    setSelectedAccounts((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleViz = (id: string) => {
    setSelectedViz((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const deselectAllAccounts = () => setSelectedAccounts(new Set());

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <BarChart2 className="w-4.5 h-4.5 text-primary" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-foreground leading-tight">Advanced Export &amp; Reporting</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Create custom analytics reports and share insights with stakeholders</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm">
            <Mail className="w-3.5 h-3.5 mr-1" /> Email Report
          </Button>
          <Button size="sm" className="bg-foreground text-background hover:bg-foreground/90">
            <FileDown className="w-3.5 h-3.5 mr-1" /> Generate Report
          </Button>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left: 2/3 */}
        <div className="lg:col-span-2 space-y-5">

          {/* Report Details */}
          <div className="bg-card rounded-xl shadow-card p-5 space-y-4">
            <h2 className="text-sm font-semibold text-foreground">Report Details</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Report Name</label>
                <input
                  type="text"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border text-sm bg-background outline-none focus:ring-1 ring-primary"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Date Range</label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border text-sm bg-background outline-none"
                >
                  {["Last 7 Days", "Last 30 Days", "Last 90 Days", "Custom Range"].map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Executive Summary</label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  maxLength={500}
                  rows={4}
                  placeholder="Add an executive summary..."
                  className="w-full px-3 py-2 rounded-lg border border-border text-sm bg-background outline-none focus:ring-1 ring-primary resize-none placeholder:text-muted-foreground"
                />
                <div className="text-[11px] text-muted-foreground text-right mt-0.5">
                  {summary.length}/500
                </div>
              </div>
            </div>
          </div>

          {/* Select Metrics */}
          <div className="bg-card rounded-xl shadow-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">Select Metrics</h2>
              <span className="text-xs text-muted-foreground">{selectedMetrics.size} selected</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {metricsOptions.map((m) => {
                const checked = selectedMetrics.has(m.id);
                return (
                  <button
                    key={m.id}
                    onClick={() => toggleMetric(m.id)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2.5 rounded-lg border text-xs font-medium transition-colors text-left",
                      checked
                        ? "border-primary bg-primary/5 text-foreground"
                        : "border-border bg-background text-muted-foreground hover:border-primary/50",
                    )}
                  >
                    <div className={cn(
                      "w-4 h-4 rounded flex items-center justify-center border shrink-0",
                      checked ? "bg-primary border-primary" : "border-border",
                    )}>
                      {checked && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
                    </div>
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Select Accounts */}
          <div className="bg-card rounded-xl shadow-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">Select Accounts</h2>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-muted-foreground">All selected</span>
                <button onClick={deselectAllAccounts} className="text-primary hover:underline">Deselect All</button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {reportAccounts.map((acc) => {
                const checked = selectedAccounts.has(acc.id);
                return (
                  <button
                    key={acc.id}
                    onClick={() => toggleAccount(acc.id)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-colors",
                      checked
                        ? "border-primary/40 bg-primary/5"
                        : "border-border bg-background hover:border-primary/30",
                    )}
                  >
                    <div className={cn(
                      "w-4 h-4 rounded-full flex items-center justify-center border shrink-0",
                      checked ? "bg-green-500 border-green-500" : "border-border",
                    )}>
                      {checked && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <acc.icon className={cn("w-4 h-4 shrink-0", acc.iconColor)} />
                    <div>
                      <div className="text-xs font-medium text-foreground">{acc.name}</div>
                      <div className="text-[10px] text-muted-foreground">{acc.platform}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Include Competitors */}
          <div className="bg-card rounded-xl shadow-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">Include Competitors</h2>
              <span className="text-xs text-muted-foreground">0 selected</span>
            </div>
            <div className="bg-muted/40 rounded-lg p-4 text-center text-xs text-muted-foreground">
              No competitors added yet.{" "}
              <button
                onClick={() => navigate(`${pathname}?view=competitors`)}
                className="text-primary hover:underline"
              >
                Add competitors
              </button>
            </div>
          </div>

          {/* Select Visualizations */}
          <div className="bg-card rounded-xl shadow-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">Select Visualizations</h2>
              <span className="text-xs text-muted-foreground">{selectedViz.size} selected</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {vizOptions.map((v) => {
                const checked = selectedViz.has(v.id);
                return (
                  <button
                    key={v.id}
                    onClick={() => toggleViz(v.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 px-3 py-4 rounded-lg border text-xs font-medium transition-colors",
                      checked
                        ? "border-primary bg-primary/5 text-foreground"
                        : "border-border bg-background text-muted-foreground hover:border-primary/50",
                    )}
                  >
                    <v.icon className={cn("w-5 h-5", checked ? "text-primary" : "text-muted-foreground")} />
                    {v.label}
                    {checked && (
                      <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-primary-foreground" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: 1/3 sticky */}
        <div className="lg:sticky lg:top-6">
          <div className="bg-card rounded-xl shadow-card p-5 space-y-4">
            <h2 className="text-sm font-semibold text-foreground">Report Summary</h2>
            <div className="space-y-3">
              {[
                { label: "METRICS",        value: `${selectedMetrics.size} selected`  },
                { label: "PLATFORMS",      value: selectedAccounts.size === reportAccounts.length ? "All Accounts" : `${selectedAccounts.size} accounts` },
                { label: "COMPETITORS",    value: "0 included"   },
                { label: "VISUALIZATIONS", value: `${selectedViz.size} types`          },
                { label: "FORMAT",         value: "PDF"           },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between border-b border-border pb-2 last:border-0 last:pb-0">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{item.label}</span>
                  <span className="text-xs font-medium text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full text-sm">
              Preview Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main export ──────────────────────────────────────────────────────

export default function AnalyzePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const view = searchParams.get("view") ?? "overview";

  if (view === "intelligence") return <IntelligenceView navigate={navigate} pathname={pathname} />;
  if (view === "posts")        return <PostsView navigate={navigate} pathname={pathname} />;
  if (view === "growth")       return <GrowthView navigate={navigate} pathname={pathname} />;
  if (view === "competitors")  return <CompetitorsView navigate={navigate} pathname={pathname} />;
  if (view === "report")       return <ReportView navigate={navigate} pathname={pathname} />;
  return <OverviewView navigate={navigate} pathname={pathname} />;
}
