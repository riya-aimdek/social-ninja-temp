import SuperAdminLayout from "@/components/layout/SuperAdminLayout";
import StatusBadge from "@/components/StatusBadge";
import { Building2, Building, Users, CreditCard, MoreHorizontal } from "lucide-react";

const stats = [
  { label: "Total Agencies", value: "24", icon: Building2, color: "text-agency" },
  { label: "Total Organizations", value: "156", icon: Building, color: "text-organization" },
  { label: "Total Users", value: "1,847", icon: Users, color: "text-user-role" },
  { label: "Active Subscriptions", value: "142", icon: CreditCard, color: "text-success" },
];

const agencies = [
  { name: "Digital Spark Agency", orgs: 12, users: 87, plan: "Enterprise", status: "active" as const },
  { name: "CreativeFlow Media", orgs: 8, users: 45, plan: "Growth", status: "active" as const },
  { name: "SocialPulse Inc", orgs: 3, users: 22, plan: "Starter", status: "suspended" as const },
  { name: "BrandWave Digital", orgs: 15, users: 120, plan: "Enterprise", status: "active" as const },
  { name: "PixelForge Studio", orgs: 5, users: 31, plan: "Growth", status: "active" as const },
];

const activities = [
  { time: "2 min ago", text: "Agency XYZ created org RetailCo", avatar: "AX" },
  { time: "15 min ago", text: "User Priya invited to SaaS Inc", avatar: "PI" },
  { time: "1 hr ago", text: "DigitalSpark upgraded to Enterprise", avatar: "DS" },
  { time: "3 hrs ago", text: "BrandWave added 3 social profiles", avatar: "BW" },
  { time: "5 hrs ago", text: "CreativeFlow suspended user John", avatar: "CF" },
];

const standaloneOrgs = [
  { name: "LocalBites", users: 8, plan: "Starter", status: "active" as const },
  { name: "FitnessPro", users: 14, plan: "Growth", status: "active" as const },
  { name: "ArtHaven", users: 3, plan: "Starter", status: "pending" as const },
];

const SuperAdminDashboard = () => {
  return (
    <SuperAdminLayout title="Platform Overview">
      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="card-surface">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-elevated`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xs text-text-secondary">{stat.label}</p>
                <p className={`text-2xl font-semibold ${stat.color}`}>{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-5 gap-6 mb-6">
        {/* Agencies Table */}
        <div className="col-span-3 card-surface">
          <h2 className="text-base font-semibold text-foreground mb-4">Agencies</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs text-text-muted font-medium pb-3">Agency Name</th>
                <th className="text-left text-xs text-text-muted font-medium pb-3"># Orgs</th>
                <th className="text-left text-xs text-text-muted font-medium pb-3"># Users</th>
                <th className="text-left text-xs text-text-muted font-medium pb-3">Plan</th>
                <th className="text-left text-xs text-text-muted font-medium pb-3">Status</th>
                <th className="text-right text-xs text-text-muted font-medium pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {agencies.map((a) => (
                <tr key={a.name} className="border-b border-border last:border-0 hover:bg-elevated transition-colors">
                  <td className="py-3 text-sm text-foreground font-medium">{a.name}</td>
                  <td className="py-3 text-sm text-text-secondary">{a.orgs}</td>
                  <td className="py-3 text-sm text-text-secondary">{a.users}</td>
                  <td className="py-3 text-sm text-text-secondary">{a.plan}</td>
                  <td className="py-3"><StatusBadge status={a.status} /></td>
                  <td className="py-3 text-right">
                    <button className="text-text-muted hover:text-foreground"><MoreHorizontal className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Activity Feed */}
        <div className="col-span-2 card-surface">
          <h2 className="text-base font-semibold text-foreground mb-4">Recent Activity</h2>
          <div className="space-y-0">
            {activities.map((a, i) => (
              <div key={i} className="flex items-start gap-3 py-3 border-b border-border last:border-0">
                <div className="w-8 h-8 rounded-full bg-elevated flex items-center justify-center text-[10px] font-semibold text-text-secondary shrink-0">{a.avatar}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-secondary">{a.text}</p>
                  <p className="text-xs text-text-muted mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Standalone Orgs */}
      <div className="card-surface">
        <h2 className="text-base font-semibold text-foreground mb-4">Standalone Organizations</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs text-text-muted font-medium pb-3">Org Name</th>
              <th className="text-left text-xs text-text-muted font-medium pb-3"># Users</th>
              <th className="text-left text-xs text-text-muted font-medium pb-3">Plan</th>
              <th className="text-left text-xs text-text-muted font-medium pb-3">Status</th>
              <th className="text-right text-xs text-text-muted font-medium pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {standaloneOrgs.map((o) => (
              <tr key={o.name} className="border-b border-border last:border-0 hover:bg-elevated transition-colors">
                <td className="py-3 text-sm text-foreground font-medium">{o.name}</td>
                <td className="py-3 text-sm text-text-secondary">{o.users}</td>
                <td className="py-3 text-sm text-text-secondary">{o.plan}</td>
                <td className="py-3"><StatusBadge status={o.status} /></td>
                <td className="py-3 text-right">
                  <button className="text-text-muted hover:text-foreground"><MoreHorizontal className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SuperAdminLayout>
  );
};

export default SuperAdminDashboard;
