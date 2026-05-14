import { Users, FolderOpen, Clock, Link2, TrendingUp, TrendingDown, ArrowRight, MoreHorizontal, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "@/components/StatusBadge";
import {
  teamMembers, activeProjects, connectedAccounts, activities, totalPosts,
} from "@/data/businessMockData";

const statCards = [
  { label: "Team Members", value: teamMembers.length.toString(), change: "+2 this month", up: true, icon: Users },
  { label: "Active Projects", value: activeProjects.length.toString(), change: "+1 this week", up: true, icon: FolderOpen },
  { label: "Total Posts", value: totalPosts.toString(), change: `Across ${activeProjects.length} active projects`, up: true, icon: Clock },
  { label: "Connected Accounts", value: connectedAccounts.length.toString(), change: `${connectedAccounts.length} of 7 platforms`, up: true, icon: Link2 },
];

export default function ClientDashboardPage() {
  const navigate = useNavigate();
  return (
    <div className="flex gap-6 animate-fade-in">
      <div className="flex-1 space-y-6 min-w-0">
        {/* Welcome Banner */}
        <div className="gradient-coral rounded-2xl p-6 text-primary-foreground">
          <h1 className="text-2xl font-bold tracking-tight">Welcome back! 👋</h1>
          <p className="text-primary-foreground/80 text-sm mt-1">Here's an overview of your business. Manage projects, team, and social accounts all in one place.</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <div key={card.label} className="bg-card rounded-xl border border-border p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-muted">
                  <card.icon className="w-4 h-4 text-primary" />
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

        {/* Projects + Team */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Projects */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">Active Projects</h2>
              <button onClick={() => navigate("/client/projects")} className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
                <Plus className="w-3 h-3" /> New Project
              </button>
            </div>
            <div className="divide-y divide-border">
              {activeProjects.map((p) => (
                <div key={p.name} onClick={() => navigate("/client/projects")} className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/30 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FolderOpen className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{p.name}</p>
                      <p className="text-[11px] text-muted-foreground">{p.posts} posts · {p.accounts} accounts · {p.members} members</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status="active" />
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team Members */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">Team Members</h2>
              <button onClick={() => navigate("/client/settings/team")} className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
                <Plus className="w-3 h-3" /> Invite
              </button>
            </div>
            <div className="divide-y divide-border">
              {teamMembers.map((m) => (
                <div key={m.name} className="flex items-center justify-between px-5 py-3 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-[11px] font-bold text-primary">
                      {m.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{m.name}</p>
                      <p className="text-[11px] text-muted-foreground">{m.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{m.role}</span>
                    <StatusBadge status={m.status} />
                  </div>
                </div>
              ))}
            </div>
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
      </div>
    </div>
  );
}
