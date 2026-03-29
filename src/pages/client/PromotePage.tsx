import { Megaphone, Target, DollarSign, Eye, MousePointer, Facebook, Instagram } from "lucide-react";

const postsToBoost = [
  { platform: "Instagram", caption: "🚀 New AI feature launch!", engagement: "4.7%", likes: 567, img: "🖼️" },
  { platform: "Facebook", caption: "5 tips to boost engagement", engagement: "3.2%", likes: 342, img: "📊" },
  { platform: "Instagram", caption: "Behind the scenes at HQ", engagement: "5.1%", likes: 234, img: "📸" },
  { platform: "Facebook", caption: "Product update announcement", engagement: "2.8%", likes: 189, img: "📢" },
];

const activeBoosts = [
  { name: "AI Feature Launch", platform: "Instagram", status: "Active", spend: "$45.20", impressions: "12.4K", ctr: "3.2%" },
  { name: "Engagement Tips", platform: "Facebook", status: "Active", spend: "$32.80", impressions: "8.9K", ctr: "2.8%" },
  { name: "Hiring Post", platform: "LinkedIn", status: "Completed", spend: "$50.00", impressions: "15.2K", ctr: "4.1%" },
  { name: "Q1 Results", platform: "Facebook", status: "Paused", spend: "$18.50", impressions: "5.1K", ctr: "1.9%" },
];

const statusStyles: Record<string, string> = {
  Active: "badge-active",
  Completed: "badge-published",
  Paused: "badge-scheduled",
};

const goals = [
  { icon: Eye, label: "Engagement" },
  { icon: MousePointer, label: "Website Visits" },
  { icon: Target, label: "Leads" },
  { icon: DollarSign, label: "Conversions" },
];

export default function PromotePage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
          <Megaphone className="w-6 h-6 text-primary" /> Promote
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Boost your best-performing content to reach more people.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {postsToBoost.map((post, i) => (
          <div key={i} className="bg-card rounded-xl shadow-card p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
            <div className="w-full h-28 bg-accent rounded-lg flex items-center justify-center text-3xl mb-3">{post.img}</div>
            <div className="flex items-center gap-2 mb-2">
              {post.platform === "Instagram" ? <Instagram className="w-3.5 h-3.5 text-instagram" /> : <Facebook className="w-3.5 h-3.5 text-facebook" />}
              <span className="text-xs text-muted-foreground">{post.engagement} engagement</span>
            </div>
            <p className="text-sm text-foreground font-medium truncate mb-3">{post.caption}</p>
            <button className="w-full py-2 rounded-lg gradient-coral text-primary-foreground text-xs font-medium shadow-coral hover:opacity-90 active:scale-[0.98] transition-all">
              Boost This
            </button>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl shadow-card p-5">
        <h2 className="text-sm font-semibold text-foreground mb-4">Select Campaign Goal</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {goals.map((g) => (
            <button key={g.label} className="p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all text-center">
              <g.icon className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-xs font-medium text-foreground">{g.label}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Active Boosts</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted-foreground border-b border-border">
              <th className="px-5 py-3 font-medium">Campaign</th>
              <th className="px-5 py-3 font-medium">Platform</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-right">Spend</th>
              <th className="px-5 py-3 font-medium text-right">Impressions</th>
              <th className="px-5 py-3 font-medium text-right">CTR</th>
            </tr>
          </thead>
          <tbody>
            {activeBoosts.map((b, i) => (
              <tr key={i} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                <td className="px-5 py-3 font-medium text-foreground">{b.name}</td>
                <td className="px-5 py-3 text-muted-foreground text-xs">{b.platform}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyles[b.status]}`}>{b.status}</span>
                </td>
                <td className="px-5 py-3 text-right tabular-nums text-foreground">{b.spend}</td>
                <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">{b.impressions}</td>
                <td className="px-5 py-3 text-right tabular-nums text-foreground font-medium">{b.ctr}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
