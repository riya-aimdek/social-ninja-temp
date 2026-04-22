import { useState } from "react";
import { Ear, Star, Plus, Bell, AlertTriangle, TrendingUp, MessageCircle, X } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, XAxis, Tooltip } from "recharts";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const sentimentData = [
  { name: "Positive", value: 62, color: "hsl(var(--success))" },
  { name: "Neutral", value: 28, color: "hsl(var(--muted-foreground))" },
  { name: "Negative", value: 10, color: "hsl(var(--error))" },
];

const sentimentTrend = [
  { date: "W1", positive: 58, negative: 12 },
  { date: "W2", positive: 60, negative: 11 },
  { date: "W3", positive: 55, negative: 15 },
  { date: "W4", positive: 62, negative: 10 },
];

const trendingTopics = [
  { topic: "AI Marketing", volume: "12.4K", growth: "+34%", sentiment: "Positive" },
  { topic: "Social Automation", volume: "8.2K", growth: "+22%", sentiment: "Positive" },
  { topic: "Content Creation", volume: "6.8K", growth: "+15%", sentiment: "Neutral" },
  { topic: "Brand Safety", volume: "3.1K", growth: "+8%", sentiment: "Negative" },
  { topic: "Influencer Marketing", volume: "5.5K", growth: "+18%", sentiment: "Positive" },
];

const influencers = [
  { name: "Jessica Martinez", handle: "@jessmartz", followers: "245K", engagement: "5.8%", relevance: 94 },
  { name: "Ryan Brooks", handle: "@ryanbrooks", followers: "180K", engagement: "4.2%", relevance: 89 },
  { name: "Aisha Patel", handle: "@aishap", followers: "320K", engagement: "3.9%", relevance: 85 },
  { name: "Tom Nguyen", handle: "@tomnguyen", followers: "95K", engagement: "7.1%", relevance: 92 },
];

const initialKeywords = ["social media marketing", "AI tools", "content automation", "brand monitoring"];

interface AlertRule {
  id: string;
  name: string;
  trigger: string;
  channel: "Email" | "Slack" | "In-app";
  active: boolean;
  lastFired?: string;
}

const initialAlerts: AlertRule[] = [
  { id: "a1", name: "Negative sentiment spike", trigger: "Negative mentions > 20 in 1h", channel: "Slack", active: true, lastFired: "2h ago" },
  { id: "a2", name: "Crisis keyword", trigger: 'Mentions of "lawsuit" OR "boycott"', channel: "Email", active: true },
  { id: "a3", name: "Volume spike", trigger: "Mentions > 200% of weekly avg", channel: "In-app", active: true, lastFired: "Yesterday" },
  { id: "a4", name: "Competitor mention", trigger: "BrandRival named alongside us", channel: "Slack", active: false },
];

const sentimentBadge: Record<string, string> = {
  Positive: "bg-success/15 text-success",
  Neutral: "bg-muted text-muted-foreground",
  Negative: "bg-error/15 text-error",
};

export default function ListenPage() {
  const [keywords, setKeywords] = useState(initialKeywords);
  const [newKw, setNewKw] = useState("");
  const [alerts, setAlerts] = useState(initialAlerts);

  const addKeyword = () => {
    if (!newKw.trim()) return;
    setKeywords([...keywords, newKw.trim()]);
    setNewKw("");
    toast.success("Keyword added");
  };

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Live alerts banner */}
      <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="text-sm font-semibold text-foreground">Negative sentiment spike detected</div>
          <p className="text-xs text-muted-foreground mt-0.5">
            42 negative mentions in the last hour (+312% vs. baseline). Mostly on X about "service outage".
          </p>
        </div>
        <Button size="sm" variant="outline">Investigate</Button>
      </div>

      {/* Keywords */}
      <div className="bg-card rounded-xl shadow-card p-5">
        <h2 className="text-sm font-semibold text-foreground mb-3">Monitored Keywords</h2>
        <div className="flex flex-wrap gap-2">
          {keywords.map((kw) => (
            <span key={kw} className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium inline-flex items-center gap-1.5">
              {kw}
              <button onClick={() => setKeywords(keywords.filter((k) => k !== kw))} className="hover:text-primary-hover">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <div className="inline-flex items-center gap-1.5">
            <input
              value={newKw}
              onChange={(e) => setNewKw(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addKeyword()}
              placeholder="Add keyword..."
              className="px-3 py-1.5 rounded-full border border-dashed border-border text-xs bg-transparent focus:outline-none focus:border-primary w-40"
            />
            <Button size="sm" variant="ghost" onClick={addKeyword}><Plus className="w-3 h-3" /></Button>
          </div>
        </div>
      </div>

      {/* Sentiment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl shadow-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Sentiment Overview</h2>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={140} height={140}>
              <PieChart>
                <Pie data={sentimentData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={2} dataKey="value">
                  {sentimentData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {sentimentData.map((s) => (
                <div key={s.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-xs text-foreground">{s.name}</span>
                  <span className="text-xs font-bold text-foreground">{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Sentiment Trend</h2>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={sentimentTrend}>
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip />
              <Area type="monotone" dataKey="positive" stroke="hsl(var(--success))" fill="hsl(var(--success))" fillOpacity={0.15} strokeWidth={2} />
              <Area type="monotone" dataKey="negative" stroke="hsl(var(--error))" fill="hsl(var(--error))" fillOpacity={0.15} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alert rules */}
      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" /> Alert rules
          </h2>
          <Button size="sm"><Plus className="w-3.5 h-3.5" /> New rule</Button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted-foreground border-b border-border">
              <th className="px-5 py-3 font-medium">Rule</th>
              <th className="px-5 py-3 font-medium">Trigger</th>
              <th className="px-5 py-3 font-medium">Channel</th>
              <th className="px-5 py-3 font-medium">Last fired</th>
              <th className="px-5 py-3 font-medium text-right">Active</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((a) => (
              <tr key={a.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                <td className="px-5 py-3 font-medium text-foreground">{a.name}</td>
                <td className="px-5 py-3 text-xs text-muted-foreground font-mono">{a.trigger}</td>
                <td className="px-5 py-3"><span className="text-[11px] px-2 py-1 rounded-full bg-muted text-muted-foreground">{a.channel}</span></td>
                <td className="px-5 py-3 text-xs text-muted-foreground">{a.lastFired || "—"}</td>
                <td className="px-5 py-3 text-right">
                  <Switch
                    checked={a.active}
                    onCheckedChange={(v) => setAlerts(alerts.map((x) => x.id === a.id ? { ...x, active: v } : x))}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Topics */}
      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" /> Trending Topics
          </h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted-foreground border-b border-border">
              <th className="px-5 py-3 font-medium">#</th>
              <th className="px-5 py-3 font-medium">Topic</th>
              <th className="px-5 py-3 font-medium text-right">Volume</th>
              <th className="px-5 py-3 font-medium text-right">Growth</th>
              <th className="px-5 py-3 font-medium">Sentiment</th>
            </tr>
          </thead>
          <tbody>
            {trendingTopics.map((t, i) => (
              <tr key={i} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                <td className="px-5 py-3 text-muted-foreground font-medium">{i + 1}</td>
                <td className="px-5 py-3 font-medium text-foreground">{t.topic}</td>
                <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">{t.volume}</td>
                <td className="px-5 py-3 text-right tabular-nums text-success font-medium">{t.growth}</td>
                <td className="px-5 py-3">
                  <span className={cn("text-xs px-2 py-1 rounded-full font-medium", sentimentBadge[t.sentiment])}>{t.sentiment}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Influencers */}
      <div className="bg-card rounded-xl shadow-card p-5">
        <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Star className="w-4 h-4 text-primary" /> Influencer Discovery
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {influencers.map((inf) => (
            <div key={inf.handle} className="border border-border rounded-xl p-4 hover:border-primary/30 transition-colors">
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-sm font-bold text-foreground mb-3">
                {inf.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <p className="text-sm font-semibold text-foreground">{inf.name}</p>
              <p className="text-[11px] text-muted-foreground mb-2">{inf.handle}</p>
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground mb-3">
                <span>{inf.followers} followers</span>
                <span>{inf.engagement} eng.</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium text-primary">{inf.relevance}% match</span>
                <button className="text-[11px] text-primary font-medium hover:underline">+ Watchlist</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
