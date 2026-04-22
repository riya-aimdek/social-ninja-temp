import { useState } from "react";
import {
  BarChart3, TrendingUp, Eye, Users, FileText, Facebook, Instagram, Linkedin, Twitter,
  Trophy, Calendar, FileDown, Mail, Plus, Trash2, Clock,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, Legend, LineChart, Line,
} from "recharts";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// ---------- Performance data ----------
const growthData = [
  { date: "Mar 1", followers: 23200 }, { date: "Mar 4", followers: 23450 },
  { date: "Mar 7", followers: 23800 }, { date: "Mar 10", followers: 24100 },
  { date: "Mar 13", followers: 24350 }, { date: "Mar 16", followers: 24600 },
  { date: "Mar 18", followers: 24800 },
];

const engagementData = [
  { day: "Mon", likes: 120, comments: 45, shares: 28 },
  { day: "Tue", likes: 180, comments: 62, shares: 35 },
  { day: "Wed", likes: 95, comments: 38, shares: 22 },
  { day: "Thu", likes: 210, comments: 78, shares: 41 },
  { day: "Fri", likes: 165, comments: 55, shares: 30 },
  { day: "Sat", likes: 140, comments: 48, shares: 25 },
  { day: "Sun", likes: 88, comments: 32, shares: 18 },
];

const kpis = [
  { label: "Followers", value: "24.8K", change: "+3.2%", icon: Users },
  { label: "Engagement Rate", value: "4.7%", change: "+0.5%", icon: TrendingUp },
  { label: "Reach", value: "89.2K", change: "+12.4%", icon: Eye },
  { label: "Impressions", value: "142K", change: "+8.1%", icon: BarChart3 },
  { label: "Published", value: "18", change: "+6", icon: FileText },
];

const topPosts = [
  { platform: "Instagram", caption: "🚀 New AI feature launch!", likes: 567, comments: 82, shares: 45, reach: "12.4K" },
  { platform: "Facebook", caption: "5 tips to boost engagement", likes: 342, comments: 56, shares: 38, reach: "8.9K" },
  { platform: "LinkedIn", caption: "We're hiring! Join our team", likes: 189, comments: 45, shares: 23, reach: "6.2K" },
];

// ---------- Competitor data ----------
const competitors = [
  { name: "You", followers: 24800, engagement: 4.7, posts: 18, shareOfVoice: 28, color: "hsl(var(--primary))" },
  { name: "BrandRival", followers: 31200, engagement: 3.9, posts: 22, shareOfVoice: 34, color: "hsl(var(--info))" },
  { name: "MarketLead", followers: 18900, engagement: 5.4, posts: 14, shareOfVoice: 22, color: "hsl(var(--success))" },
  { name: "Newcomer Co.", followers: 9400, engagement: 6.2, posts: 26, shareOfVoice: 16, color: "hsl(var(--warning))" },
];

const benchmarkRadar = [
  { metric: "Followers", You: 70, BrandRival: 88, MarketLead: 53 },
  { metric: "Engagement", You: 78, BrandRival: 65, MarketLead: 90 },
  { metric: "Frequency", You: 64, BrandRival: 78, MarketLead: 50 },
  { metric: "Reach", You: 82, BrandRival: 90, MarketLead: 68 },
  { metric: "Sentiment", You: 88, BrandRival: 72, MarketLead: 80 },
];

const sovTrend = [
  { week: "W1", You: 24, BrandRival: 38, MarketLead: 24, "Newcomer Co.": 14 },
  { week: "W2", You: 26, BrandRival: 36, MarketLead: 23, "Newcomer Co.": 15 },
  { week: "W3", You: 27, BrandRival: 35, MarketLead: 22, "Newcomer Co.": 16 },
  { week: "W4", You: 28, BrandRival: 34, MarketLead: 22, "Newcomer Co.": 16 },
];

// ---------- Reports data ----------
interface ScheduledReport {
  id: string;
  name: string;
  cadence: "Daily" | "Weekly" | "Monthly";
  format: "PDF" | "CSV" | "PDF + CSV";
  recipients: string[];
  nextRun: string;
  lastSent?: string;
  active: boolean;
}

const initialReports: ScheduledReport[] = [
  {
    id: "r1", name: "Weekly performance digest", cadence: "Weekly", format: "PDF",
    recipients: ["client.lead@retailco.com", "marketing@retailco.com"], nextRun: "Mon, 9:00 AM",
    lastSent: "Mar 18", active: true,
  },
  {
    id: "r2", name: "Monthly executive summary", cadence: "Monthly", format: "PDF + CSV",
    recipients: ["ceo@retailco.com"], nextRun: "Apr 1, 8:00 AM", lastSent: "Mar 1", active: true,
  },
  {
    id: "r3", name: "Daily ORM brief", cadence: "Daily", format: "PDF",
    recipients: ["orm@agency.com"], nextRun: "Tomorrow, 7:00 AM", lastSent: "Today", active: false,
  },
];

const platformsList = ["All", "Facebook", "Instagram", "LinkedIn", "Twitter/X"];
const dateRanges = ["Last 7 days", "Last 30 days", "Last 6 months", "Custom"];

const platformIcon = (name: string) => {
  switch (name) {
    case "Instagram": return <Instagram className="w-4 h-4 text-instagram" />;
    case "Facebook": return <Facebook className="w-4 h-4 text-facebook" />;
    case "LinkedIn": return <Linkedin className="w-4 h-4 text-linkedin" />;
    default: return <Twitter className="w-4 h-4 text-twitter" />;
  }
};

export default function AnalyzePage() {
  const [activePlatform, setActivePlatform] = useState("All");
  const [dateRange, setDateRange] = useState("Last 7 days");
  const [reports, setReports] = useState<ScheduledReport[]>(initialReports);
  const [newReportOpen, setNewReportOpen] = useState(false);
  const [newReport, setNewReport] = useState({ name: "", cadence: "Weekly" as ScheduledReport["cadence"], recipients: "" });

  const addReport = () => {
    if (!newReport.name || !newReport.recipients) return toast.error("Fill all fields");
    setReports([
      ...reports,
      {
        id: `r${Date.now()}`,
        name: newReport.name,
        cadence: newReport.cadence,
        format: "PDF",
        recipients: newReport.recipients.split(",").map((s) => s.trim()),
        nextRun: "Tomorrow, 9:00 AM",
        active: true,
      },
    ]);
    toast.success("Scheduled report created");
    setNewReportOpen(false);
    setNewReport({ name: "", cadence: "Weekly", recipients: "" });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Analyze</h1>
          <p className="text-sm text-muted-foreground mt-1">Performance, competitor benchmarks, and scheduled reports.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium bg-card outline-none"
          >
            {dateRanges.map((r) => <option key={r}>{r}</option>)}
          </select>
          <div className="flex rounded-lg border border-border overflow-hidden">
            {platformsList.map((p) => (
              <button
                key={p}
                onClick={() => setActivePlatform(p)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium transition-colors",
                  activePlatform === p ? "bg-foreground text-card" : "bg-card text-foreground hover:bg-accent",
                )}
              >
                {p}
              </button>
            ))}
          </div>
          <Button size="sm" variant="outline" onClick={() => toast.success("Export started — check Downloads")}>
            <FileDown className="w-3.5 h-3.5" /> Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="performance">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="competitors">Competitor benchmarking</TabsTrigger>
          <TabsTrigger value="reports">Scheduled reports</TabsTrigger>
        </TabsList>

        {/* PERFORMANCE */}
        <TabsContent value="performance" className="space-y-6 mt-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="bg-card rounded-xl shadow-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <kpi.icon className="w-4 h-4 text-primary" />
                  <span className="text-[11px] text-muted-foreground">{kpi.label}</span>
                </div>
                <p className="text-3xl font-bold tracking-tighter text-foreground tabular-nums">{kpi.value}</p>
                <span className="text-xs text-success font-medium">{kpi.change}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card rounded-xl shadow-card p-5">
              <h2 className="text-sm font-semibold text-foreground mb-4">Audience Growth</h2>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={growthData}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip />
                  <Area type="monotone" dataKey="followers" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#g1)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-card rounded-xl shadow-card p-5">
              <h2 className="text-sm font-semibold text-foreground mb-4">Engagement Breakdown</h2>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip />
                  <Bar dataKey="likes" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="comments" fill="hsl(var(--coral-light))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="shares" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-card rounded-xl shadow-card overflow-hidden">
            <div className="p-5 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">Top Performing Posts</h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground border-b border-border">
                  <th className="px-5 py-3 font-medium">Platform</th>
                  <th className="px-5 py-3 font-medium">Caption</th>
                  <th className="px-5 py-3 font-medium text-right">Likes</th>
                  <th className="px-5 py-3 font-medium text-right">Comments</th>
                  <th className="px-5 py-3 font-medium text-right">Shares</th>
                  <th className="px-5 py-3 font-medium text-right">Reach</th>
                </tr>
              </thead>
              <tbody>
                {topPosts.map((post, i) => (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                    <td className="px-5 py-3">{platformIcon(post.platform)}</td>
                    <td className="px-5 py-3 text-foreground">{post.caption}</td>
                    <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">{post.likes}</td>
                    <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">{post.comments}</td>
                    <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">{post.shares}</td>
                    <td className="px-5 py-3 text-right tabular-nums font-medium text-foreground">{post.reach}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* COMPETITORS */}
        <TabsContent value="competitors" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {competitors.map((c) => (
              <div key={c.name} className={cn(
                "bg-card rounded-xl border p-4",
                c.name === "You" ? "border-primary" : "border-border",
              )}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    {c.name === "You" && <Trophy className="w-3.5 h-3.5 text-primary" />}
                    {c.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground">SoV {c.shareOfVoice}%</span>
                </div>
                <div className="text-2xl font-bold text-foreground tabular-nums">{(c.followers / 1000).toFixed(1)}K</div>
                <div className="text-[11px] text-muted-foreground">followers · {c.engagement}% eng</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card rounded-xl shadow-card p-5">
              <h2 className="text-sm font-semibold text-foreground mb-4">Benchmark vs. competitors</h2>
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={benchmarkRadar}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
                  <Radar name="You" dataKey="You" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
                  <Radar name="BrandRival" dataKey="BrandRival" stroke="hsl(var(--info))" fill="hsl(var(--info))" fillOpacity={0.15} />
                  <Radar name="MarketLead" dataKey="MarketLead" stroke="hsl(var(--success))" fill="hsl(var(--success))" fillOpacity={0.15} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-card rounded-xl shadow-card p-5">
              <h2 className="text-sm font-semibold text-foreground mb-4">Share of Voice trend</h2>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={sovTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" unit="%" />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="You" stroke="hsl(var(--primary))" strokeWidth={2} />
                  <Line type="monotone" dataKey="BrandRival" stroke="hsl(var(--info))" strokeWidth={2} />
                  <Line type="monotone" dataKey="MarketLead" stroke="hsl(var(--success))" strokeWidth={2} />
                  <Line type="monotone" dataKey="Newcomer Co." stroke="hsl(var(--warning))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-card rounded-xl shadow-card overflow-hidden">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">Competitor leaderboard</h2>
              <Button size="sm" variant="outline">+ Add competitor</Button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground border-b border-border bg-muted/40">
                  <th className="px-5 py-3 font-medium">Brand</th>
                  <th className="px-5 py-3 font-medium text-right">Followers</th>
                  <th className="px-5 py-3 font-medium text-right">Engagement</th>
                  <th className="px-5 py-3 font-medium text-right">Posts / wk</th>
                  <th className="px-5 py-3 font-medium text-right">Share of Voice</th>
                </tr>
              </thead>
              <tbody>
                {[...competitors].sort((a, b) => b.shareOfVoice - a.shareOfVoice).map((c) => (
                  <tr key={c.name} className={cn("border-b border-border last:border-0 hover:bg-accent/30 transition-colors",
                    c.name === "You" && "bg-primary/5")}>
                    <td className="px-5 py-3 font-medium text-foreground flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                      {c.name}
                      {c.name === "You" && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/15 text-primary">You</span>}
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums text-foreground">{c.followers.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">{c.engagement}%</td>
                    <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">{c.posts}</td>
                    <td className="px-5 py-3 text-right tabular-nums font-semibold text-foreground">{c.shareOfVoice}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* SCHEDULED REPORTS */}
        <TabsContent value="reports" className="space-y-4 mt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-foreground">Scheduled reports</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Auto-deliver performance digests to clients on a schedule.</p>
            </div>
            <Dialog open={newReportOpen} onOpenChange={setNewReportOpen}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="w-3.5 h-3.5" /> New schedule</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>New scheduled report</DialogTitle></DialogHeader>
                <div className="space-y-3 py-2">
                  <div>
                    <Label>Report name</Label>
                    <Input value={newReport.name} onChange={(e) => setNewReport({ ...newReport, name: e.target.value })} placeholder="e.g. Weekly performance digest" />
                  </div>
                  <div>
                    <Label>Cadence</Label>
                    <select
                      value={newReport.cadence}
                      onChange={(e) => setNewReport({ ...newReport, cadence: e.target.value as ScheduledReport["cadence"] })}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm"
                    >
                      <option>Daily</option><option>Weekly</option><option>Monthly</option>
                    </select>
                  </div>
                  <div>
                    <Label>Recipients (comma separated)</Label>
                    <Input value={newReport.recipients} onChange={(e) => setNewReport({ ...newReport, recipients: e.target.value })} placeholder="ceo@brand.com, marketing@brand.com" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setNewReportOpen(false)}>Cancel</Button>
                  <Button onClick={addReport}>Create</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="bg-card rounded-xl shadow-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground border-b border-border bg-muted/40">
                  <th className="px-5 py-3 font-medium">Report</th>
                  <th className="px-5 py-3 font-medium">Cadence</th>
                  <th className="px-5 py-3 font-medium">Format</th>
                  <th className="px-5 py-3 font-medium">Recipients</th>
                  <th className="px-5 py-3 font-medium">Next run</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                    <td className="px-5 py-3">
                      <div className="font-medium text-foreground">{r.name}</div>
                      {r.lastSent && <div className="text-[11px] text-muted-foreground">Last sent {r.lastSent}</div>}
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" /> {r.cadence}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-muted-foreground">{r.format}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1 text-xs text-foreground">
                        <Mail className="w-3 h-3 text-muted-foreground" /> {r.recipients.length}
                      </div>
                      <div className="text-[10px] text-muted-foreground truncate max-w-[180px]">{r.recipients.join(", ")}</div>
                    </td>
                    <td className="px-5 py-3 text-xs text-muted-foreground tabular-nums">
                      <Clock className="w-3 h-3 inline mr-1" />{r.nextRun}
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => setReports(reports.map((x) => x.id === r.id ? { ...x, active: !x.active } : x))}
                        className={cn(
                          "text-[11px] px-2 py-1 rounded-full font-medium",
                          r.active ? "bg-success/15 text-success" : "bg-muted text-muted-foreground",
                        )}
                      >
                        {r.active ? "Active" : "Paused"}
                      </button>
                    </td>
                    <td className="px-5 py-3">
                      <button onClick={() => { setReports(reports.filter((x) => x.id !== r.id)); toast.success("Deleted"); }} className="text-muted-foreground hover:text-error">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
