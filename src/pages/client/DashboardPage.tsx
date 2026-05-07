import {
  TrendingUp, TrendingDown, Users, FileText, Clock, Activity,
  Facebook, Instagram, Linkedin, Twitter
} from "lucide-react";

const kpis = [
  { label: "Total Followers", value: "24.8K", change: "+3.2%", up: true, icon: Users },
  { label: "Posts This Week", value: "18", change: "+12%", up: true, icon: FileText },
  { label: "Queued Posts", value: "7", change: "3 due today", up: true, icon: Clock },
  { label: "Connected Accounts", value: "3", change: "1 disconnected", up: false, icon: Activity },
];

const connectedAccounts = [
  { name: "Facebook", icon: Facebook, color: "text-facebook", connected: true, handle: "@socialninja" },
  { name: "Instagram", icon: Instagram, color: "text-instagram", connected: true, handle: "@socialninja" },
  { name: "LinkedIn", icon: Linkedin, color: "text-linkedin", connected: true, handle: "SocialNinja Inc." },
  { name: "Twitter/X", icon: Twitter, color: "text-twitter", connected: false, handle: "" },
];

const recentPosts = [
  { platform: "Instagram", caption: "🚀 Excited to announce our new AI-powered scheduling feature...", status: "Published", likes: 342, comments: 28 },
  { platform: "Facebook", caption: "Join us for a live Q&A session this Friday at 3 PM EST...", status: "Scheduled", likes: 0, comments: 0 },
  { platform: "LinkedIn", caption: "We're hiring! Looking for a talented Social Media Manager...", status: "Published", likes: 189, comments: 45 },
  { platform: "Instagram", caption: "Behind the scenes of our latest product photoshoot 📸...", status: "Draft", likes: 0, comments: 0 },
  { platform: "Facebook", caption: "5 tips to boost your engagement rate in 2026...", status: "Published", likes: 567, comments: 82 },
];

const upcomingPosts = [
  { platform: "Instagram", caption: "New feature spotlight: AI Content Generator", time: "Today, 2:00 PM" },
  { platform: "Facebook", caption: "Weekly tips: Engagement strategies", time: "Today, 5:00 PM" },
  { platform: "LinkedIn", caption: "Case study: How we grew 300%", time: "Tomorrow, 9:00 AM" },
  { platform: "Instagram", caption: "User spotlight: @designstudio", time: "Tomorrow, 1:00 PM" },
  { platform: "Facebook", caption: "Product update announcement", time: "Mar 20, 10:00 AM" },
];

const statusStyles: Record<string, string> = {
  Published: "badge-published",
  Scheduled: "badge-scheduled",
  Draft: "badge-draft",
  Failed: "badge-failed",
};

const platformIcon = (name: string) => {
  switch (name) {
    case "Facebook": return <Facebook className="w-4 h-4 text-facebook" />;
    case "Instagram": return <Instagram className="w-4 h-4 text-instagram" />;
    case "LinkedIn": return <Linkedin className="w-4 h-4 text-linkedin" />;
    default: return <Twitter className="w-4 h-4 text-twitter" />;
  }
};

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div className="gradient-coral rounded-2xl p-6 text-primary-foreground">
        <h1 className="text-2xl font-bold tracking-tight">Welcome back, John! 👋</h1>
        <p className="text-primary-foreground/80 text-sm mt-1">Here's what's happening with your social accounts today, March 18, 2026.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-card rounded-xl shadow-card p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <kpi.icon className="w-4 h-4 text-primary" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${kpi.up ? "text-emerald-600" : "text-rose-500"}`}>
                {kpi.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {kpi.change}
              </div>
            </div>
            <p className="text-2xl font-bold tracking-tight text-foreground tabular-nums">{kpi.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Connected Accounts */}
      <div className="bg-card rounded-xl shadow-card p-5">
        <h2 className="text-sm font-semibold text-foreground mb-4">Connected Accounts</h2>
        <div className="flex gap-4 flex-wrap">
          {connectedAccounts.map((acc) => (
            <div key={acc.name} className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-border hover:bg-accent/50 transition-colors">
              <div className="relative">
                <acc.icon className={`w-5 h-5 ${acc.color}`} />
                <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-card ${acc.connected ? "bg-emerald-500" : "bg-muted-foreground"}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{acc.name}</p>
                {acc.connected && <p className="text-[11px] text-muted-foreground">{acc.handle}</p>}
              </div>
              {!acc.connected && (
                <span className="text-xs text-primary font-medium ml-2 cursor-pointer hover:underline">Connect</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Posts */}
        <div className="lg:col-span-2 bg-card rounded-xl shadow-card overflow-hidden">
          <div className="p-5 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Recent Posts</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground border-b border-border">
                  <th className="px-5 py-3 font-medium">Platform</th>
                  <th className="px-5 py-3 font-medium">Caption</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Engagement</th>
                </tr>
              </thead>
              <tbody>
                {recentPosts.map((post, i) => (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                    <td className="px-5 py-3">{platformIcon(post.platform)}</td>
                    <td className="px-5 py-3 max-w-xs truncate text-foreground">{post.caption}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyles[post.status]}`}>{post.status}</span>
                    </td>
                    <td className="px-5 py-3 text-right text-muted-foreground tabular-nums">
                      {post.likes > 0 ? `${post.likes} ❤️ ${post.comments} 💬` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming */}
        <div className="bg-card rounded-xl shadow-card">
          <div className="p-5 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Upcoming Posts</h2>
          </div>
          <div className="divide-y divide-border">
            {upcomingPosts.map((post, i) => (
              <div key={i} className="px-5 py-3 hover:bg-accent/30 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  {platformIcon(post.platform)}
                  <span className="text-xs text-muted-foreground">{post.time}</span>
                </div>
                <p className="text-sm text-foreground truncate">{post.caption}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
