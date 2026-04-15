import { Users, FolderOpen, Clock, Link2, TrendingUp, TrendingDown, ArrowRight, MoreHorizontal, Plus } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

import StatusBadge from "@/components/StatusBadge";

const sparkTeam = [{ v: 1 }, { v: 2 }, { v: 2 }, { v: 3 }, { v: 4 }, { v: 5 }, { v: 6 }];
const sparkProjects = [{ v: 0 }, { v: 1 }, { v: 1 }, { v: 2 }, { v: 2 }, { v: 3 }, { v: 3 }];
const sparkPending = [{ v: 5 }, { v: 4 }, { v: 3 }, { v: 3 }, { v: 2 }, { v: 2 }, { v: 1 }];
const sparkAccounts = [{ v: 2 }, { v: 3 }, { v: 4 }, { v: 5 }, { v: 5 }, { v: 6 }, { v: 7 }];

const statCards = [
  { label: "Team Members", value: "6", change: "+2 this month", up: true, icon: Users, spark: sparkTeam, color: "hsl(358, 97%, 68%)" },
  { label: "Active Projects", value: "3", change: "+1 this week", up: true, icon: FolderOpen, spark: sparkProjects, color: "hsl(217, 91%, 60%)" },
  { label: "Pending Approvals", value: "1", change: "-4 from last week", up: false, icon: Clock, spark: sparkPending, color: "hsl(38, 92%, 50%)" },
  { label: "Connected Accounts", value: "7", change: "+1 today", up: true, icon: Link2, spark: sparkAccounts, color: "hsl(142, 71%, 45%)" },
];

const projects = [
  { name: "Social Campaign", status: "active" as const, posts: 142, accounts: 4, lastActive: "2h ago" },
  { name: "Website Redesign", status: "active" as const, posts: 67, accounts: 2, lastActive: "1d ago" },
  { name: "Brand Launch", status: "pending" as const, posts: 0, accounts: 0, lastActive: "3d ago" },
];

const teamMembers = [
  { name: "John Smith", email: "john@business.com", role: "Admin", status: "active" as const, avatar: "JS" },
  { name: "Emily Davis", email: "emily@business.com", role: "Content Creator", status: "active" as const, avatar: "ED" },
  { name: "Mike Wilson", email: "mike@business.com", role: "Approver", status: "active" as const, avatar: "MW" },
  { name: "Lisa Chen", email: "lisa@business.com", role: "Social Manager", status: "invited" as const, avatar: "LC" },
];

const activities = [
  { time: "2h ago", text: "Emily published 3 posts to Instagram for Social Campaign", dot: "bg-emerald-500" },
  { time: "5h ago", text: "Mike approved the weekly content batch", dot: "bg-blue-500" },
  { time: "1d ago", text: "New project 'Brand Launch' was created", dot: "bg-primary" },
  { time: "2d ago", text: "Lisa Chen was invited to join the team", dot: "bg-purple-500" },
];

export default function ClientDashboardPage() {
  return (
    <div className="flex gap-6 animate-fade-in">
      {/* Main dashboard content */}
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
                  <card.icon className="w-4 h-4" style={{ color: card.color }} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${card.up ? "text-emerald-600" : "text-amber-600"}`}>
                  {card.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {card.change}
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground tabular-nums">{card.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{card.label}</p>
              <div className="h-10 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={card.spark}>
                    <defs>
                      <linearGradient id={`biz-spark-${card.label}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={card.color} stopOpacity={0.3} />
                        <stop offset="100%" stopColor={card.color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="v" stroke={card.color} strokeWidth={2} fill={`url(#biz-spark-${card.label})`} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>

        {/* Projects + Team */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Projects */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">Projects</h2>
              <button className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
                <Plus className="w-3 h-3" /> New Project
              </button>
            </div>
            <div className="divide-y divide-border">
              {projects.map((p) => (
                <div key={p.name} className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/30 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FolderOpen className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{p.name}</p>
                      <p className="text-[11px] text-muted-foreground">{p.posts} posts · {p.accounts} accounts</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={p.status} />
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
              <button className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
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
