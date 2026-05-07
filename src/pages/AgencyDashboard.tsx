import { Link } from "react-router-dom";
import AgencyLayout from "@/components/layout/AgencyLayout";
import { Building2, Users, Globe, Clock, TrendingUp, TrendingDown, ArrowRight, MoreHorizontal } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import ClientLogo from "@/components/ClientLogo";
const statCards = [
  { label: "Total Clients", value: "8", change: "+2 this month", up: true, icon: Building2 },
  { label: "Total Users", value: "24", change: "+5 this month", up: true, icon: Users },
  { label: "Active Campaigns", value: "12", change: "+3 this week", up: true, icon: Globe },
  { label: "Pending Approvals", value: "3", change: "-2 from yesterday", up: false, icon: Clock },
];

const recentClients = [
  { name: "Acme Corp", initials: "A", color: "bg-primary", owner: "Sarah K.", status: "active" as const, created: "4/13/2026", posts: 142, growth: "+12%" },
  { name: "TechStart", initials: "T", color: "bg-blue-500", owner: "James L.", status: "active" as const, created: "3/28/2026", posts: 89, growth: "+8%" },
  { name: "FreshBrew", initials: "F", color: "bg-emerald-500", owner: "Priya M.", status: "active" as const, created: "3/15/2026", posts: 67, growth: "+15%" },
  { name: "StyleHaus", initials: "S", color: "bg-amber-500", owner: "—", status: "pending" as const, created: "4/10/2026", posts: 0, growth: "—" },
];

const recentUsers = [
  { name: "Sarah Kim", email: "sarah@agency.com", role: "Account Manager", status: "active" as const, avatar: "SK" },
  { name: "James Lee", email: "james@agency.com", role: "Content Creator", status: "active" as const, avatar: "JL" },
  { name: "Priya Mehta", email: "priya@agency.com", role: "Account Manager", status: "active" as const, avatar: "PM" },
  { name: "Alex Chen", email: "alex@agency.com", role: "Social Manager", status: "invited" as const, avatar: "AC" },
];

const activities = [
  { time: "2h ago", text: "Sarah published 'Summer Sale' campaign for Acme Corp", dot: "bg-emerald-500" },
  { time: "5h ago", text: "James submitted 3 posts for approval on TechStart", dot: "bg-amber-500" },
  { time: "1d ago", text: "New client StyleHaus was onboarded", dot: "bg-primary" },
  { time: "1d ago", text: "Priya generated monthly report for FreshBrew", dot: "bg-blue-500" },
  { time: "2d ago", text: "Alex Chen was invited to the team", dot: "bg-purple-500" },
];

const AgencyDashboard = () => {
  return (
    <AgencyLayout title="Dashboard">
      {/* Welcome Banner */}
      <div className="gradient-coral rounded-2xl p-6 mb-6 text-primary-foreground">
        <h1 className="text-2xl font-bold tracking-tight">Welcome back! 👋</h1>
        <p className="text-primary-foreground/80 text-sm mt-1">Here's an overview of your agency's performance across all clients.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {statCards.map(card => (
          <div key={card.label} className="bg-card border border-border rounded-xl p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-muted">
                <card.icon className="h-4 w-4 text-primary" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${card.up ? "text-emerald-600" : "text-amber-600"}`}>
                {card.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {card.change}
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground tabular-nums">{card.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Two-column: Clients + Users */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Recent Clients */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Recent Clients</h2>
            <Link to="/agency/clients" className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {['Client', 'Owner', 'Posts', 'Status'].map(h => (
                  <th key={h} className="text-left text-[11px] uppercase text-muted-foreground font-medium px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentClients.map(c => (
                <tr key={c.name} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <ClientLogo name={c.name} color={c.color} size="sm" rounded="lg" />
                      <div>
                        <span className="text-sm font-medium text-foreground">{c.name}</span>
                        <p className="text-[11px] text-muted-foreground">{c.created}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-muted-foreground">{c.owner}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium text-foreground tabular-nums">{c.posts}</span>
                      {c.growth !== "—" && <span className="text-[11px] text-emerald-600">{c.growth}</span>}
                    </div>
                  </td>
                  <td className="px-5 py-3"><StatusBadge status={c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Users */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Team Members</h2>
            <Link to="/agency/team" className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {['User', 'Role', 'Status'].map(h => (
                  <th key={h} className="text-left text-[11px] uppercase text-muted-foreground font-medium px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentUsers.map(u => (
                <tr key={u.name} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-[11px] font-bold text-primary">
                        {u.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{u.name}</p>
                        <p className="text-[11px] text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-muted-foreground">{u.role}</td>
                  <td className="px-5 py-3"><StatusBadge status={u.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Recent Activity</h2>
          <button className="p-1 hover:bg-muted rounded transition-colors">
            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <div className="divide-y divide-border">
          {activities.map((a, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/30 transition-colors">
              <div className={`w-2 h-2 rounded-full ${a.dot} shrink-0`} />
              <span className="text-sm text-foreground flex-1">{a.text}</span>
              <span className="text-xs text-muted-foreground shrink-0">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </AgencyLayout>
  );
};

export default AgencyDashboard;
