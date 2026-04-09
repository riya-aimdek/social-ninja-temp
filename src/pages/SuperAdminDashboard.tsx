import SuperAdminLayout from "@/components/layout/SuperAdminLayout";
import StatusBadge from "@/components/StatusBadge";
import { Building2, Building, Users, CreditCard, TrendingUp, ArrowUpRight, ArrowDownRight, Activity, Globe, ShieldCheck } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { Progress } from "@/components/ui/progress";

const stats = [
  { label: "Total Agencies", value: "24", change: "+3 this month", trend: "up", icon: Building2, color: "text-agency", bg: "bg-agency/10" },
  { label: "Total Businesses", value: "156", change: "+12% vs last month", trend: "up", icon: Building, color: "text-client", bg: "bg-client/10" },
  { label: "Total Users", value: "1,847", change: "+89 this month", trend: "up", icon: Users, color: "text-user-role", bg: "bg-user-role/10" },
  { label: "Active Subscriptions", value: "142", change: "-2 this month", trend: "down", icon: CreditCard, color: "text-success", bg: "bg-success/10" },
];

const revenueData = [
  { month: "Oct", value: 8200 }, { month: "Nov", value: 9100 }, { month: "Dec", value: 8800 },
  { month: "Jan", value: 10400 }, { month: "Feb", value: 11200 }, { month: "Mar", value: 12450 },
];

const agencies = [
  { name: "Digital Spark Agency", orgs: 12, users: 87, plan: "Enterprise", status: "active" as const, revenue: "$299/mo", profilesUsed: 42, profilesMax: 50 },
  { name: "CreativeFlow Media", orgs: 8, users: 45, plan: "Growth", status: "active" as const, revenue: "$99/mo", profilesUsed: 28, profilesMax: 50 },
  { name: "SocialPulse Inc", orgs: 3, users: 22, plan: "Starter", status: "suspended" as const, revenue: "$29/mo", profilesUsed: 8, profilesMax: 10 },
  { name: "BrandWave Digital", orgs: 15, users: 120, plan: "Enterprise", status: "active" as const, revenue: "$299/mo", profilesUsed: 47, profilesMax: 50 },
  { name: "PixelForge Studio", orgs: 5, users: 31, plan: "Growth", status: "active" as const, revenue: "$99/mo", profilesUsed: 12, profilesMax: 50 },
];

const activities = [
  { time: "2 min ago", text: "Agency XYZ created org RetailCo", avatar: "AX", type: "create", group: "Today" },
  { time: "15 min ago", text: "User Priya invited to SaaS Inc", avatar: "PI", type: "invite", group: "Today" },
  { time: "1 hr ago", text: "DigitalSpark upgraded to Enterprise", avatar: "DS", type: "upgrade", group: "Today" },
  { time: "3 hrs ago", text: "BrandWave added 3 social profiles", avatar: "BW", type: "update", group: "Today" },
  { time: "Yesterday 4:30 PM", text: "CreativeFlow suspended user John", avatar: "CF", type: "alert", group: "Yesterday" },
  { time: "Yesterday 10:00 AM", text: "New standalone org ArtHaven registered", avatar: "AH", type: "create", group: "Yesterday" },
];

const systemHealth = [
  { label: "API Uptime", value: "99.98%", icon: Activity, status: "healthy" },
  { label: "Active Connections", value: "342", icon: Globe, status: "healthy" },
  { label: "Security Score", value: "A+", icon: ShieldCheck, status: "healthy" },
];

const standaloneOrgs = [
  { name: "LocalBites", users: 8, plan: "Starter", status: "active" as const, profilesUsed: 4, profilesMax: 10 },
  { name: "FitnessPro", users: 14, plan: "Growth", status: "active" as const, profilesUsed: 12, profilesMax: 50 },
  { name: "ArtHaven", users: 3, plan: "Starter", status: "pending" as const, profilesUsed: 1, profilesMax: 10 },
];

const usageBarColor = (used: number, max: number) => {
  const pct = (used / max) * 100;
  if (pct > 85) return "bg-error";
  if (pct > 60) return "bg-warning";
  return "bg-success";
};

const SuperAdminDashboard = () => {
  // Group activities
  const groupedActivities: { group: string; items: typeof activities }[] = [];
  activities.forEach(a => {
    const existing = groupedActivities.find(g => g.group === a.group);
    if (existing) existing.items.push(a);
    else groupedActivities.push({ group: a.group, items: [a] });
  });

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
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            <p className={`text-[12px] mt-1.5 font-medium ${stat.trend === "up" ? "text-success" : "text-error"}`}>
              {stat.trend === "up" ? <ArrowUpRight className="h-3 w-3 inline mr-0.5" /> : <ArrowDownRight className="h-3 w-3 inline mr-0.5" />}
              {stat.change}
            </p>
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
          {agencies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Building2 className="h-10 w-10 text-muted-foreground/40 mb-3" />
              <p className="text-sm font-medium text-foreground">No agencies yet</p>
              <button className="mt-3 text-sm text-primary hover:underline">Invite your first agency</button>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-[11px] uppercase text-muted-foreground font-medium pb-3">Agency</th>
                  <th className="text-left text-[11px] uppercase text-muted-foreground font-medium pb-3">Users</th>
                  <th className="text-left text-[11px] uppercase text-muted-foreground font-medium pb-3">Revenue</th>
                  <th className="text-left text-[11px] uppercase text-muted-foreground font-medium pb-3">Profiles</th>
                  <th className="text-left text-[11px] uppercase text-muted-foreground font-medium pb-3">Status</th>
                  <th className="text-right text-[11px] uppercase text-muted-foreground font-medium pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {agencies.map((a) => (
                  <tr key={a.name} className={`border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors ${a.status === 'suspended' ? 'border-l-[3px] border-l-error' : ''}`}>
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-agency/10 flex items-center justify-center text-[10px] font-bold text-agency">
                          {a.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{a.name}</p>
                          <p className="text-[11px] text-muted-foreground">{a.plan} · {a.orgs} orgs</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-sm text-muted-foreground">{a.users}</td>
                    <td className="py-3 text-sm font-medium text-foreground">{a.revenue}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div className={`h-full rounded-full ${usageBarColor(a.profilesUsed, a.profilesMax)}`} style={{ width: `${(a.profilesUsed / a.profilesMax) * 100}%` }} />
                        </div>
                        <span className="text-[11px] text-muted-foreground">{a.profilesUsed}/{a.profilesMax}</span>
                      </div>
                    </td>
                    <td className="py-3"><StatusBadge status={a.status} /></td>
                    <td className="py-3 text-right">
                      <a href="#" className="text-xs text-primary hover:underline mr-3">View</a>
                      {a.status === 'active' ? (
                        <button className="text-xs text-muted-foreground hover:text-warning">Suspend</button>
                      ) : (
                        <button className="text-xs text-muted-foreground hover:text-success">Reactivate</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="col-span-2 card-surface">
          <h2 className="text-base font-semibold text-foreground mb-4">Recent Activity</h2>
          {groupedActivities.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No recent activity</p>
          ) : (
            <div className="space-y-0">
              {groupedActivities.map((group) => (
                <div key={group.group}>
                  <p className="text-[11px] uppercase font-semibold text-muted-foreground tracking-wider pt-3 pb-1.5">{group.group}</p>
                  {group.items.map((a, i) => (
                    <div key={i} className="flex items-start gap-3 py-2.5 border-b border-border/50 last:border-0">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0 ${
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
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Standalone Businesses */}
      <div className="card-surface">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-foreground">Standalone Businesses</h2>
          <span className="text-xs text-muted-foreground">{standaloneOrgs.length} clients</span>
        </div>
        {standaloneOrgs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Building className="h-8 w-8 text-muted-foreground/40 mb-2" />
            <p className="text-sm font-medium text-foreground">No standalone businesses</p>
            <p className="text-xs text-muted-foreground mt-1">Businesses registered without an agency will appear here.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-[11px] uppercase text-muted-foreground font-medium pb-3">Business</th>
                <th className="text-left text-[11px] uppercase text-muted-foreground font-medium pb-3">Users</th>
                <th className="text-left text-[11px] uppercase text-muted-foreground font-medium pb-3">Plan</th>
                <th className="text-left text-[11px] uppercase text-muted-foreground font-medium pb-3">Profiles</th>
                <th className="text-left text-[11px] uppercase text-muted-foreground font-medium pb-3">Status</th>
                <th className="text-right text-[11px] uppercase text-muted-foreground font-medium pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {standaloneOrgs.map((o) => (
                <tr key={o.name} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-client/10 flex items-center justify-center text-[10px] font-bold text-client">
                        {o.name.slice(0, 2)}
                      </div>
                      <span className="text-sm font-medium text-foreground">{o.name}</span>
                    </div>
                  </td>
                  <td className="py-3 text-sm text-muted-foreground">{o.users}</td>
                  <td className="py-3 text-sm text-muted-foreground">{o.plan}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className={`h-full rounded-full ${usageBarColor(o.profilesUsed, o.profilesMax)}`} style={{ width: `${(o.profilesUsed / o.profilesMax) * 100}%` }} />
                      </div>
                      <span className="text-[11px] text-muted-foreground">{o.profilesUsed}/{o.profilesMax}</span>
                    </div>
                  </td>
                  <td className="py-3"><StatusBadge status={o.status} /></td>
                  <td className="py-3 text-right">
                    <a href="#" className="text-xs text-primary hover:underline mr-3">View</a>
                    {o.status === 'active' && (
                      <button className="text-xs text-muted-foreground hover:text-warning">Suspend</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </SuperAdminLayout>
  );
};

export default SuperAdminDashboard;
