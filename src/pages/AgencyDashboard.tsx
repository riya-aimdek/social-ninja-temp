import AgencyLayout from "@/components/layout/AgencyLayout";
import StatusBadge from "@/components/StatusBadge";
import { ExternalLink, MoreHorizontal, Wifi, Users, Clock } from "lucide-react";

const usageBars = [
  { label: "Social Profiles", used: 22, total: 50 },
  { label: "Team Members", used: 6, total: 10 },
  { label: "Competitor Slots", used: 8, total: 20 },
];

const orgMetrics = [
  { label: "Social Profiles", value: "8", icon: Wifi },
  { label: "Team Members", value: "4", icon: Users },
  { label: "Pending Approvals", value: "3", icon: Clock },
];

const orgCards = [
  { id: '1', name: 'RetailCo', initials: 'RC', color: 'bg-organization', industry: 'Retail', group: 'E-commerce', profiles: 8, members: 4, lastActive: '2 hrs ago', active: true, viewing: true },
  { id: '2', name: 'TechStart', initials: 'TS', color: 'bg-info', industry: 'Technology', group: 'SaaS', profiles: 12, members: 6, lastActive: '30 min ago', active: true, viewing: false },
  { id: '3', name: 'FoodieHub', initials: 'FH', color: 'bg-warning', industry: 'Food & Beverage', group: 'Hospitality', profiles: 5, members: 3, lastActive: '1 day ago', active: true, viewing: false },
];

const teamMembers = [
  { name: "Sarah Chen", avatar: "SC", role: "Content Creator", orgs: ["RetailCo", "TechStart"], lastActive: "Online" },
  { name: "James Wilson", avatar: "JW", role: "Approver", orgs: ["RetailCo"], lastActive: "2 hrs ago" },
  { name: "Priya Sharma", avatar: "PS", role: "Analyst", orgs: ["TechStart", "FoodieHub"], lastActive: "1 hr ago" },
  { name: "Mike Torres", avatar: "MT", role: "Engagement", orgs: ["FoodieHub"], lastActive: "3 hrs ago" },
];

const AgencyDashboard = () => {
  return (
    <AgencyLayout>
      {/* Plan Usage */}
      <div className="card-surface mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-foreground">Plan Usage</h2>
          <button className="text-sm text-primary hover:underline">Upgrade Plan</button>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {usageBars.map(bar => (
            <div key={bar.label}>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-text-secondary">{bar.label}</span>
                <span className="text-text-muted">{bar.used} of {bar.total}</span>
              </div>
              <div className="h-2 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(bar.used / bar.total) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Org Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {orgMetrics.map(m => (
          <div key={m.label} className="card-surface flex items-center gap-3">
            <div className="p-2 rounded-lg bg-elevated">
              <m.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-text-secondary">{m.label}</p>
              <p className="text-xl font-semibold text-foreground">{m.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Org Cards */}
      <h2 className="text-base font-semibold text-foreground mb-4">Organizations</h2>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {orgCards.map(org => (
          <div key={org.id} className={`card-surface relative ${org.viewing ? 'border-primary' : ''}`}>
            {org.viewing && <span className="absolute top-3 right-3 text-[10px] text-primary bg-primary/10 rounded px-1.5 py-0.5">Viewing</span>}
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-full ${org.color} flex items-center justify-center text-xs font-bold text-foreground`}>{org.initials}</div>
              <div>
                <p className="text-[15px] font-semibold text-foreground">{org.name}</p>
                <span className="text-[11px] text-text-muted">{org.industry}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-text-muted mb-3">
              <span>{org.profiles} profiles</span>
              <span>·</span>
              <span>{org.members} members</span>
              <span>·</span>
              <span>{org.lastActive}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] bg-elevated text-text-secondary px-2 py-0.5 rounded-full">{org.group}</span>
              <div className={`w-1.5 h-1.5 rounded-full ${org.active ? 'bg-success' : 'bg-text-muted'}`} />
            </div>
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
              <a href={`https://social-ninja.lovable.app?org=${org.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-primary hover:underline">
                <ExternalLink className="h-3 w-3" /> Open in SocialNinja
              </a>
              <button className="ml-auto text-text-muted hover:text-foreground"><MoreHorizontal className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Team Overview */}
      <div className="card-surface">
        <h2 className="text-base font-semibold text-foreground mb-4">Team Overview</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs text-text-muted font-medium pb-3">Member</th>
              <th className="text-left text-xs text-text-muted font-medium pb-3">Role</th>
              <th className="text-left text-xs text-text-muted font-medium pb-3">Assigned Orgs</th>
              <th className="text-left text-xs text-text-muted font-medium pb-3">Last Active</th>
            </tr>
          </thead>
          <tbody>
            {teamMembers.map(m => (
              <tr key={m.name} className="border-b border-border last:border-0 hover:bg-elevated transition-colors">
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-elevated flex items-center justify-center text-[10px] font-semibold text-text-secondary">{m.avatar}</div>
                    <span className="text-sm text-foreground">{m.name}</span>
                  </div>
                </td>
                <td className="py-3 text-sm text-text-secondary">{m.role}</td>
                <td className="py-3">
                  <div className="flex gap-1">
                    {m.orgs.map(o => <span key={o} className="text-[11px] bg-elevated text-text-secondary rounded px-2 py-0.5">{o}</span>)}
                  </div>
                </td>
                <td className="py-3 text-sm text-text-muted">{m.lastActive}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AgencyLayout>
  );
};

export default AgencyDashboard;
