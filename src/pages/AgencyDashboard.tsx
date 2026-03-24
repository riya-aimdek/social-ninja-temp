import AgencyLayout from "@/components/layout/AgencyLayout";
import { ExternalLink, Wifi, Users, Clock, TrendingUp, ArrowUpRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const usageBars = [
  { label: "Social Profiles", used: 22, total: 50, icon: Wifi },
  { label: "Team Members", used: 6, total: 10, icon: Users },
  { label: "Competitor Slots", used: 8, total: 20, icon: TrendingUp },
];

const getBarColor = (pct: number) => pct > 85 ? "bg-error" : pct > 60 ? "bg-warning" : "bg-success";
const getBarTextColor = (pct: number) => pct > 85 ? "text-error" : pct > 60 ? "text-warning" : "text-success";

const orgMetrics = [
  { label: "Social Profiles", value: "8", note: "across 3 orgs", icon: Wifi, color: "bg-primary/10 text-primary" },
  { label: "Team Members", value: "4", note: "2 pending invites", icon: Users, color: "bg-info/10 text-info" },
  { label: "Pending Approvals", value: "3", note: "3 awaiting review", icon: Clock, color: "bg-warning/10 text-warning" },
];

const orgColors = ["border-t-primary", "border-t-info", "border-t-warning", "border-t-success"];

const orgCards = [
  { id: '1', name: 'RetailCo', initials: 'RC', color: 'bg-organization', industry: 'Retail', profiles: 8, members: 4, lastActive: '2 hrs ago', sparkline: [30, 45, 38, 52, 48, 60] },
  { id: '2', name: 'TechStart', initials: 'TS', color: 'bg-info', industry: 'Technology', profiles: 12, members: 6, lastActive: '30 min ago', sparkline: [20, 28, 35, 42, 55, 70] },
  { id: '3', name: 'FoodieHub', initials: 'FH', color: 'bg-warning', industry: 'Food & Beverage', profiles: 5, members: 3, lastActive: '1 day ago', sparkline: [40, 35, 45, 38, 42, 40] },
];

const roleColors: Record<string, string> = {
  "Content Creator": "bg-info/10 text-info",
  "Approver": "bg-warning/10 text-warning",
  "Engagement Specialist": "bg-agency/10 text-agency",
  "Analyst": "bg-super-admin/10 text-super-admin",
  "Guest": "bg-muted text-muted-foreground",
};

const teamMembers = [
  { name: "Sarah Chen", avatar: "SC", role: "Content Creator", orgs: ["RetailCo", "TechStart"], lastActive: "Online", online: true },
  { name: "James Wilson", avatar: "JW", role: "Approver", orgs: ["RetailCo"], lastActive: "2 hrs ago", online: false },
  { name: "Priya Sharma", avatar: "PS", role: "Analyst", orgs: ["TechStart", "FoodieHub"], lastActive: "1 hr ago", online: false },
  { name: "Mike Torres", avatar: "MT", role: "Engagement Specialist", orgs: ["FoodieHub"], lastActive: "3 hrs ago", online: true },
];

const Sparkline = ({ data }: { data: number[] }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const h = 24;
  const w = 60;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / (max - min || 1)) * h}`).join(" ");
  return (
    <svg width={w} height={h} className="text-primary">
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const AgencyDashboard = () => {
  return (
    <AgencyLayout>
      {/* Plan Usage */}
      <div className="card-surface mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-foreground">Plan Usage</h2>
          <button className="text-sm text-primary hover:underline font-medium">Upgrade Plan</button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {usageBars.map(bar => {
            const pct = Math.round((bar.used / bar.total) * 100);
            return (
              <div key={bar.label} className="border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <bar.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{bar.label}</span>
                </div>
                <p className="text-xl font-bold text-foreground mb-1">{bar.used} <span className="text-sm font-normal text-muted-foreground">of {bar.total}</span></p>
                <div className="h-2 bg-border rounded-full overflow-hidden mb-1">
                  <div className={`h-full rounded-full transition-all ${getBarColor(pct)}`} style={{ width: `${pct}%` }} />
                </div>
                <p className={`text-[11px] font-medium ${getBarTextColor(pct)}`}>{bar.total - bar.used} remaining</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Org Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {orgMetrics.map(m => (
          <div key={m.label} className="card-surface hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2.5 rounded-xl ${m.color}`}>
                <m.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{m.value}</p>
                <p className="text-xs text-muted-foreground">{m.label}</p>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">{m.note}</p>
          </div>
        ))}
      </div>

      {/* Org Cards */}
      <h2 className="text-base font-semibold text-foreground mb-4">Organizations</h2>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {orgCards.map((org, idx) => (
          <div key={org.id} className={`card-surface border-t-2 ${orgColors[idx % orgColors.length]} hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${org.color} flex items-center justify-center text-xs font-bold text-white`}>{org.initials}</div>
                <div>
                  <p className="text-[15px] font-semibold text-foreground">{org.name}</p>
                  <span className="text-[11px] text-muted-foreground">{org.industry}</span>
                </div>
              </div>
              <Sparkline data={org.sparkline} />
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
              <span>{org.profiles} profiles</span>
              <span>·</span>
              <span>{org.members} members</span>
              <span>·</span>
              <span>{org.lastActive}</span>
            </div>
            <a
              href={`https://social-ninja.lovable.app?org=${org.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-1.5 text-sm font-medium text-primary border border-primary/30 rounded-lg py-2 hover:bg-primary/5 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Open in SocialNinja
            </a>
          </div>
        ))}
      </div>

      {/* Team Overview */}
      <div className="card-surface">
        <h2 className="text-base font-semibold text-foreground mb-4">Team Overview</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs text-muted-foreground font-medium pb-3">Member</th>
              <th className="text-left text-xs text-muted-foreground font-medium pb-3">Role</th>
              <th className="text-left text-xs text-muted-foreground font-medium pb-3">Assigned Orgs</th>
              <th className="text-left text-xs text-muted-foreground font-medium pb-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {teamMembers.map(m => (
              <tr key={m.name} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                <td className="py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-semibold text-primary">{m.avatar}</div>
                      {m.online && <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-success rounded-full border-2 border-card" />}
                    </div>
                    <span className="text-sm font-medium text-foreground">{m.name}</span>
                  </div>
                </td>
                <td className="py-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${roleColors[m.role] || 'bg-muted text-muted-foreground'}`}>{m.role}</span>
                </td>
                <td className="py-3">
                  <div className="flex gap-1">
                    {m.orgs.map(o => <span key={o} className="text-[11px] bg-muted text-muted-foreground rounded px-2 py-0.5">{o}</span>)}
                  </div>
                </td>
                <td className="py-3 text-sm text-muted-foreground">{m.lastActive}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AgencyLayout>
  );
};

export default AgencyDashboard;
