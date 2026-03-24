import OrgLayout from "@/components/layout/OrgLayout";
import StatusBadge from "@/components/StatusBadge";
import { Wifi, Users, BarChart3, Clock, MessageSquare, TrendingUp } from "lucide-react";

const stats = [
  { label: "Social Profiles", value: "8", icon: Wifi, color: "text-primary" },
  { label: "Team Members", value: "4", icon: Users, color: "text-blue-600" },
  { label: "Posts This Month", value: "142", icon: BarChart3, color: "text-green-600" },
  { label: "Pending Approvals", value: "3", icon: Clock, color: "text-amber-600" },
];

const recentPosts = [
  { title: "Summer Sale Campaign", platform: "Instagram", status: "published" as const, date: "2 hrs ago", engagement: "1.2K" },
  { title: "Product Launch Teaser", platform: "Twitter/X", status: "pending" as const, date: "5 hrs ago", engagement: "—" },
  { title: "Behind the Scenes", platform: "Facebook", status: "published" as const, date: "1 day ago", engagement: "856" },
  { title: "Customer Spotlight", platform: "LinkedIn", status: "published" as const, date: "2 days ago", engagement: "2.1K" },
];

const inboxSummary = [
  { platform: "Instagram", unread: 12, oldest: "2 hrs ago" },
  { platform: "Twitter/X", unread: 5, oldest: "30 min ago" },
  { platform: "Facebook", unread: 3, oldest: "1 day ago" },
];

const activities = [
  { time: "2 hrs ago", text: "Sarah published 'Summer Sale Campaign' to Instagram" },
  { time: "5 hrs ago", text: "James submitted 'Product Launch Teaser' for approval" },
  { time: "1 day ago", text: "Priya generated weekly analytics report" },
  { time: "2 days ago", text: "New team member Alex was added" },
  { time: "3 days ago", text: "LinkedIn profile reconnected successfully" },
];

const OrgDashboard = () => {
  return (
    <OrgLayout title="Dashboard">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map(s => (
          <div key={s.label} className="card-surface flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={`text-2xl font-semibold ${s.color}`}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-6 mb-6">
        {/* Recent Posts */}
        <div className="col-span-3 card-surface">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-foreground">Recent Posts</h2>
            <a href="#" className="text-xs text-primary hover:underline">View all</a>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {["Post", "Platform", "Status", "Date", "Engagement"].map(h => (
                  <th key={h} className="text-left text-xs text-muted-foreground font-medium pb-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentPosts.map((p, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="py-3 text-sm font-medium text-foreground">{p.title}</td>
                  <td className="py-3 text-sm text-muted-foreground">{p.platform}</td>
                  <td className="py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === "published" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                      {p.status === "published" ? "Published" : "Pending"}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-muted-foreground">{p.date}</td>
                  <td className="py-3 text-sm text-muted-foreground flex items-center gap-1">
                    {p.engagement !== "—" && <TrendingUp className="h-3 w-3 text-green-600" />}
                    {p.engagement}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Inbox Summary */}
        <div className="col-span-2 card-surface">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-foreground">Inbox</h2>
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">20 unread</span>
          </div>
          {inboxSummary.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{item.platform}</p>
                  <p className="text-xs text-muted-foreground">Oldest: {item.oldest}</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-primary">{item.unread}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Activity */}
      <div className="card-surface">
        <h2 className="text-base font-semibold text-foreground mb-4">Recent Activity</h2>
        {activities.map((a, i) => (
          <div key={i} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
            <span className="text-xs text-muted-foreground w-20 shrink-0">{a.time}</span>
            <span className="text-sm text-muted-foreground">{a.text}</span>
          </div>
        ))}
      </div>
    </OrgLayout>
  );
};

export default OrgDashboard;
