import { useState } from "react";
import { BarChart3, TrendingUp, Eye, Users, FileText, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";

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

const heatmapData = (() => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const data: { day: string; hour: number; value: number }[] = [];
  days.forEach((day) => {
    hours.forEach((hour) => {
      let v = Math.random() * 0.3;
      if (hour >= 9 && hour <= 11) v += 0.4;
      if (hour >= 17 && hour <= 19) v += 0.5;
      if (day === "Tue" || day === "Thu") v += 0.2;
      data.push({ day, hour, value: Math.min(v, 1) });
    });
  });
  return data;
})();

const topPosts = [
  { platform: "Instagram", caption: "🚀 New AI feature launch!", likes: 567, comments: 82, shares: 45, reach: "12.4K" },
  { platform: "Facebook", caption: "5 tips to boost engagement", likes: 342, comments: 56, shares: 38, reach: "8.9K" },
  { platform: "LinkedIn", caption: "We're hiring! Join our team", likes: 189, comments: 45, shares: 23, reach: "6.2K" },
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Analyze</h1>
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
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${activePlatform === p ? "bg-foreground text-card" : "bg-card text-foreground hover:bg-accent"}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-card rounded-xl shadow-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <kpi.icon className="w-4 h-4 text-primary" />
              <span className="text-[11px] text-muted-foreground">{kpi.label}</span>
            </div>
            <p className="text-3xl font-bold tracking-tighter text-foreground tabular-nums">{kpi.value}</p>
            <span className="text-xs text-emerald-600 font-medium">{kpi.change}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl shadow-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Audience Growth</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={growthData}>
              <defs>
                <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(358, 97%, 68%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(358, 97%, 68%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(220, 9%, 46%)" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(220, 9%, 46%)" />
              <Tooltip />
              <Area type="monotone" dataKey="followers" stroke="hsl(358, 97%, 68%)" strokeWidth={2} fill="url(#growthGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl shadow-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Engagement Breakdown</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(220, 9%, 46%)" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(220, 9%, 46%)" />
              <Tooltip />
              <Bar dataKey="likes" fill="hsl(358, 97%, 68%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="comments" fill="hsl(16, 100%, 71%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="shares" fill="hsl(220, 14%, 80%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-card p-5">
        <h2 className="text-sm font-semibold text-foreground mb-4">Optimal Posting Time</h2>
        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            <div className="flex gap-px">
              <div className="w-12" />
              {Array.from({ length: 24 }, (_, i) => (
                <div key={i} className="flex-1 text-center text-[9px] text-muted-foreground pb-1">{i}h</div>
              ))}
            </div>
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div key={day} className="flex gap-px mb-px">
                <div className="w-12 text-[11px] text-muted-foreground flex items-center">{day}</div>
                {Array.from({ length: 24 }, (_, hour) => {
                  const cell = heatmapData.find((d) => d.day === day && d.hour === hour);
                  return (
                    <div
                      key={hour}
                      className="flex-1 h-6 rounded-[2px]"
                      style={{ backgroundColor: `hsla(358, 97%, 68%, ${cell?.value || 0})` }}
                      title={`${day} ${hour}:00 — ${Math.round((cell?.value || 0) * 100)}% engagement`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
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
    </div>
  );
}
