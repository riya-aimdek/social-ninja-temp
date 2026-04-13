import { Link } from "react-router-dom";
import AgencyLayout from "@/components/layout/AgencyLayout";
import { Building2, Users, Globe, Clock } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";

const statCards = [
  { label: "TOTAL CLIENTS", value: "1", icon: Building2, iconBg: "bg-purple-100", iconColor: "text-purple-600" },
  { label: "TOTAL USERS", value: "2", icon: Users, iconBg: "bg-blue-100", iconColor: "text-blue-600" },
  { label: "CAMPAIGNS", value: "0", icon: Globe, iconBg: "bg-red-100", iconColor: "text-red-500" },
  { label: "PENDING", value: "0", icon: Clock, iconBg: "bg-green-100", iconColor: "text-green-600" },
];

const recentClients = [
  { name: "Client-1", initials: "C", color: "bg-primary", owner: "—", status: "active" as const, created: "4/13/2026" },
];

const recentUsers = [
  { name: "User-1", email: "user1@yopmail.com", role: "User", status: "active" as const },
  { name: "User-2", email: "user2@yopmail.com", role: "User", status: "active" as const },
];

const AgencyDashboard = () => {
  return (
    <AgencyLayout title="Dashboard">
      <div className="grid grid-cols-4 gap-4 mb-8">
        {statCards.map(card => (
          <div key={card.label} className="bg-card border border-border rounded-xl p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground tracking-wide">{card.label}</p>
              <p className="text-2xl font-bold text-foreground mt-1">{card.value}</p>
            </div>
            <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center`}>
              <card.icon className={`h-5 w-5 ${card.iconColor}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-foreground tracking-wide">RECENT CLIENTS</h2>
            <Link to="/agency/clients" className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
              VIEW ALL →
            </Link>
          </div>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {['CLIENT', 'OWNER', 'STATUS', 'CREATED'].map(h => (
                    <th key={h} className="text-left text-[11px] uppercase text-muted-foreground font-medium px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentClients.map(c => (
                  <tr key={c.name} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg ${c.color} flex items-center justify-center text-xs font-bold text-white`}>{c.initials}</div>
                        <span className="text-sm font-medium text-foreground">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{c.owner}</td>
                    <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{c.created}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-4 py-3 border-t border-border text-xs text-muted-foreground">
              Showing 1-0 of 0 results
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-foreground tracking-wide">RECENT USERS</h2>
            <Link to="/agency/team" className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
              VIEW ALL →
            </Link>
          </div>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {['USER', 'ROLE', 'STATUS'].map(h => (
                    <th key={h} className="text-left text-[11px] uppercase text-muted-foreground font-medium px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentUsers.map(u => (
                  <tr key={u.name} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{u.name}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{u.role}</td>
                    <td className="px-4 py-3"><StatusBadge status={u.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-4 py-3 border-t border-border text-xs text-muted-foreground">
              Showing 1-0 of 0 results
            </div>
          </div>
        </div>
      </div>
    </AgencyLayout>
  );
};

export default AgencyDashboard;
