import SuperAdminLayout from "@/components/layout/SuperAdminLayout";
import StatusBadge from "@/components/StatusBadge";
import { Building2, Building, Users, CreditCard, MoreHorizontal, TrendingUp, ArrowUpRight, ArrowDownRight, Activity, Globe, ShieldCheck } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from "recharts";

const stats = [
  { label: "Total Agencies", value: "24", change: "+3", trend: "up", icon: Building2, color: "text-agency", bg: "bg-agency/10" },
  { label: "Total Organizations", value: "156", change: "+12", trend: "up", icon: Building, color: "text-organization", bg: "bg-organization/10" },
  { label: "Total Users", value: "1,847", change: "+89", trend: "up", icon: Users, color: "text-user-role", bg: "bg-user-role/10" },
  { label: "Active Subscriptions", value: "142", change: "-2", trend: "down", icon: CreditCard, color: "text-success", bg: "bg-success/10" },
];

const revenueData = [
  { month: "Oct", value: 8200 }, { month: "Nov", value: 9100 }, { month: "Dec", value: 8800 },
  { month: "Jan", value: 10400 }, { month: "Feb", value: 11200 }, { month: "Mar", value: 12450 },
];

const agencies = [
  { name: "Digital Spark Agency", orgs: 12, users: 87, plan: "Enterprise", status: "active" as const, revenue: "$299/mo" },
  { name: "CreativeFlow Media", orgs: 8, users: 45, plan: "Growth", status: "active" as const, revenue: "$99/mo" },
  { name: "SocialPulse Inc", orgs: 3, users: 22, plan: "Starter", status: "suspended" as const, revenue: "$29/mo" },
  { name: "BrandWave Digital", orgs: 15, users: 120, plan: "Enterprise", status: "active" as const, revenue: "$299/mo" },
  { name: "PixelForge Studio", orgs: 5, users: 31, plan: "Growth", status: "active" as const, revenue: "$99/mo" },
];

const activities = [
  { time: "2 min ago", text: "Agency XYZ created org RetailCo", avatar: "AX", type: "create" },
  { time: "15 min ago", text: "User Priya invited to SaaS Inc", avatar: "PI", type: "invite" },
  { time: "1 hr ago", text: "DigitalSpark upgraded to Enterprise", avatar: "DS", type: "upgrade" },
  { time: "3 hrs ago", text: "BrandWave added 3 social profiles", avatar: "BW", type: "update" },
  { time: "5 hrs ago", text: "CreativeFlow suspended user John", avatar: "CF", type: "alert" },
  { time: "8 hrs ago", text: "New standalone org ArtHaven registered", avatar: "AH", type: "create" },
];

const systemHealth = [
  { label: "API Uptime", value: "99.98%", icon: Activity, status: "healthy" },
  { label: "Active Connections", value: "342", icon: Globe, status: "healthy" },
  { label: "Security Score", value: "A+", icon: ShieldCheck, status: "healthy" },
];

const standaloneOrgs = [
  { name: "LocalBites", users: 8, plan: "Starter", status: "active" as const, profiles: 4 },
  { name: "FitnessPro", users: 14, plan: "Growth", status: "active" as const, profiles: 12 },
  { name: "ArtHaven", users: 3, plan: "Starter", status: "pending" as const, profiles: 1 },
];

const SuperAdminDashboard = () => {
  return (
    <SuperAdminLayout title="Platform Overview">
      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="card-surface hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${stat.trend === "up" ? "text-success" : "text-error"}`}>
                {stat.trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {stat.change}
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Revenue Chart + System Health */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="col-span-2 card-surface">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-foreground">Revenue Overview</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Monthly recurring revenue trend</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground">$12,450</p>
              <p className="text-xs text-success flex items-center gap-1 justify-end"><TrendingUp className="h-3 w-3" /> +11.2% from last month</p>
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(358, 98%, 68%)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="hsl(358, 98%, 68%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(220, 9%, 62%)' }} />
                <Tooltip
                  contentStyle={{ background: 'white', border: '1px solid hsl(220, 13%, 88%)', borderRadius: '8px', fontSize: '13px' }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="value" stroke="hsl(358, 98%, 68%)" strokeWidth={2} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          {systemHealth.map(h => (
            <div key={h.label} className="card-surface">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <h.icon className="h-4 w-4 text-success" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">{h.label}</p>
                  <p className="text-lg font-bold text-foreground">{h.value}</p>
                </div>
                <span className="text-[10px] bg-success/10 text-success px-2 py-0.5 rounded-full font-medium">Healthy</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agencies + Activity */}
      <div className="grid grid-cols-5 gap-6 mb-6">
        <div className="col-span-3 card-surface">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-foreground">Top Agencies</h2>
            <a href="/super-admin/agencies" className="text-xs text-primary hover:underline">View all →</a>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs text-muted-foreground font-medium pb-3">Agency</th>
                <th className="text-left text-xs text-muted-foreground font-medium pb-3">Orgs</th>
                <th className="text-left text-xs text-muted-foreground font-medium pb-3">Users</th>
                <th className="text-left text-xs text-muted-foreground font-medium pb-3">Revenue</th>
                <th className="text-left text-xs text-muted-foreground font-medium pb-3">Status</th>
                <th className="text-right text-xs text-muted-foreground font-medium pb-3"></th>
              </tr>
            </thead>
            <tbody>
              {agencies.map((a) => (
                <tr key={a.name} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-agency/10 flex items-center justify-center text-[10px] font-bold text-agency">
                        {a.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{a.name}</p>
                        <p className="text-[11px] text-muted-foreground">{a.plan}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-sm text-muted-foreground">{a.orgs}</td>
                  <td className="py-3 text-sm text-muted-foreground">{a.users}</td>
                  <td className="py-3 text-sm font-medium text-foreground">{a.revenue}</td>
                  <td className="py-3"><StatusBadge status={a.status} /></td>
                  <td className="py-3 text-right">
                    <button className="text-muted-foreground hover:text-foreground"><MoreHorizontal className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="col-span-2 card-surface">
          <h2 className="text-base font-semibold text-foreground mb-4">Recent Activity</h2>
          <div className="space-y-0">
            {activities.map((a, i) => (
              <div key={i} className="flex items-start gap-3 py-3 border-b border-border last:border-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0 ${
                  a.type === 'create' ? 'bg-success/10 text-success' :
                  a.type === 'upgrade' ? 'bg-primary/10 text-primary' :
                  a.type === 'alert' ? 'bg-error/10 text-error' :
                  'bg-muted text-muted-foreground'
                }`}>{a.avatar}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground leading-snug">{a.text}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Standalone Orgs */}
      <div className="card-surface">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-foreground">Standalone Organizations</h2>
          <span className="text-xs text-muted-foreground">{standaloneOrgs.length} organizations</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {standaloneOrgs.map((o) => (
            <div key={o.name} className="border border-border rounded-xl p-4 hover:border-primary/30 hover:shadow-sm transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-organization/10 flex items-center justify-center text-sm font-bold text-organization">
                  {o.name.slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{o.name}</p>
                  <p className="text-[11px] text-muted-foreground">{o.plan} Plan</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{o.users} users · {o.profiles} profiles</span>
                <StatusBadge status={o.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default SuperAdminDashboard;
