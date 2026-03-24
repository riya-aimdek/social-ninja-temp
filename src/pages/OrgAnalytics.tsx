import OrgLayout from "@/components/layout/OrgLayout";
import { TrendingUp, TrendingDown, Eye, Heart, MessageCircle, Share2 } from "lucide-react";

const overviewStats = [
  { label: "Total Reach", value: "124.5K", change: "+12.3%", up: true, icon: Eye },
  { label: "Engagement", value: "18.2K", change: "+8.7%", up: true, icon: Heart },
  { label: "Comments", value: "2,341", change: "-3.2%", up: false, icon: MessageCircle },
  { label: "Shares", value: "1,567", change: "+15.1%", up: true, icon: Share2 },
];

const platformBreakdown = [
  { platform: "Instagram", reach: "52.3K", engagement: "4.2%", posts: 45, bestTime: "6:00 PM" },
  { platform: "Twitter/X", reach: "28.1K", engagement: "2.8%", posts: 32, bestTime: "12:00 PM" },
  { platform: "Facebook", reach: "31.4K", engagement: "3.1%", posts: 28, bestTime: "9:00 AM" },
  { platform: "LinkedIn", reach: "12.7K", engagement: "5.6%", posts: 12, bestTime: "8:00 AM" },
];

const topPosts = [
  { title: "Summer Sale Announcement", platform: "Instagram", reach: "12.4K", engagement: "8.2%", date: "Mar 20" },
  { title: "Product Launch Video", platform: "TikTok", reach: "45.2K", engagement: "12.1%", date: "Mar 18" },
  { title: "Customer Success Story", platform: "LinkedIn", reach: "8.9K", engagement: "6.4%", date: "Mar 15" },
  { title: "Behind the Scenes", platform: "Facebook", reach: "5.6K", engagement: "4.8%", date: "Mar 12" },
];

const OrgAnalytics = () => {
  return (
    <OrgLayout title="Analytics">
      <div className="space-y-6">
        {/* Overview */}
        <div className="grid grid-cols-4 gap-4">
          {overviewStats.map(s => (
            <div key={s.label} className="card-surface">
              <div className="flex items-center justify-between mb-2">
                <s.icon className="h-5 w-5 text-muted-foreground" />
                <span className={`text-xs flex items-center gap-0.5 ${s.up ? "text-green-600" : "text-red-500"}`}>
                  {s.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {s.change}
                </span>
              </div>
              <p className="text-2xl font-semibold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Platform Breakdown */}
        <div className="card-surface">
          <h2 className="text-base font-semibold text-foreground mb-4">Platform Breakdown</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {["Platform", "Reach", "Engagement Rate", "Posts", "Best Post Time"].map(h => (
                  <th key={h} className="text-left text-xs text-muted-foreground font-medium pb-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {platformBreakdown.map(p => (
                <tr key={p.platform} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="py-3 text-sm font-medium text-foreground">{p.platform}</td>
                  <td className="py-3 text-sm text-muted-foreground">{p.reach}</td>
                  <td className="py-3 text-sm text-green-600 font-medium">{p.engagement}</td>
                  <td className="py-3 text-sm text-muted-foreground">{p.posts}</td>
                  <td className="py-3 text-sm text-muted-foreground">{p.bestTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top Posts */}
        <div className="card-surface">
          <h2 className="text-base font-semibold text-foreground mb-4">Top Performing Posts</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {["Post", "Platform", "Reach", "Engagement", "Date"].map(h => (
                  <th key={h} className="text-left text-xs text-muted-foreground font-medium pb-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topPosts.map(p => (
                <tr key={p.title} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="py-3 text-sm font-medium text-foreground">{p.title}</td>
                  <td className="py-3 text-sm text-muted-foreground">{p.platform}</td>
                  <td className="py-3 text-sm text-muted-foreground">{p.reach}</td>
                  <td className="py-3 text-sm text-green-600 font-medium">{p.engagement}</td>
                  <td className="py-3 text-sm text-muted-foreground">{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </OrgLayout>
  );
};

export default OrgAnalytics;
