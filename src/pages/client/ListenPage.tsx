import { Ear, Star, Plus } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, XAxis, Tooltip } from "recharts";

const sentimentData = [
  { name: "Positive", value: 62, color: "#10b981" },
  { name: "Neutral", value: 28, color: "#94a3b8" },
  { name: "Negative", value: 10, color: "#f43f5e" },
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

const keywords = ["social media marketing", "AI tools", "content automation", "brand monitoring"];

const sentimentBadge: Record<string, string> = {
  Positive: "bg-emerald-50 text-emerald-700",
  Neutral: "bg-muted text-muted-foreground",
  Negative: "bg-rose-50 text-rose-700",
};

export default function ListenPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
          <Ear className="w-6 h-6 text-primary" /> Listen
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Monitor brand mentions, sentiment, and trending topics.</p>
      </div>

      <div className="bg-card rounded-xl shadow-card p-5">
        <h2 className="text-sm font-semibold text-foreground mb-3">Monitored Keywords</h2>
        <div className="flex flex-wrap gap-2">
          {keywords.map((kw) => (
            <span key={kw} className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">{kw}</span>
          ))}
          <button className="px-3 py-1.5 rounded-full border border-dashed border-border text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center gap-1">
            <Plus className="w-3 h-3" /> Add Keyword
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl shadow-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Sentiment Overview</h2>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={140} height={140}>
              <PieChart>
                <Pie data={sentimentData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={2} dataKey="value">
                  {sentimentData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
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
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(220, 9%, 46%)" />
              <Tooltip />
              <Area type="monotone" dataKey="positive" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={2} />
              <Area type="monotone" dataKey="negative" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.1} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Trending Topics</h2>
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
                <td className="px-5 py-3 text-right tabular-nums text-emerald-600 font-medium">{t.growth}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${sentimentBadge[t.sentiment]}`}>{t.sentiment}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
