import OrgLayout from "@/components/layout/OrgLayout";
import StatusBadge from "@/components/StatusBadge";
import RoleBadge from "@/components/RoleBadge";
import { Button } from "@/components/ui/button";

const members = [
  { name: "Sarah Chen", email: "sarah@retailco.com", avatar: "SC", role: "content-creator" as const, status: "active" as const, lastActive: "Online" },
  { name: "James Wilson", email: "james@retailco.com", avatar: "JW", role: "approver" as const, status: "active" as const, lastActive: "2 hrs ago" },
  { name: "Priya Sharma", email: "priya@retailco.com", avatar: "PS", role: "analyst" as const, status: "active" as const, lastActive: "1 hr ago" },
  { name: "Guest User", email: "guest@retailco.com", avatar: "GU", role: "guest" as const, status: "pending" as const, lastActive: "Invited" },
];

const OrgTeam = () => {
  return (
    <OrgLayout title="Team Members">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <div className="bg-card border border-border rounded-lg px-4 py-2 text-sm"><span className="text-muted-foreground">Total: </span><span className="text-foreground font-semibold">{members.length}</span></div>
            <div className="bg-card border border-border rounded-lg px-4 py-2 text-sm"><span className="text-muted-foreground">Active: </span><span className="text-green-600 font-semibold">3</span></div>
            <div className="bg-card border border-border rounded-lg px-4 py-2 text-sm"><span className="text-muted-foreground">Pending: </span><span className="text-amber-600 font-semibold">1</span></div>
          </div>
          <Button>Invite Member</Button>
        </div>

        <div className="card-surface">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {["Member", "Role", "Status", "Last Active", "Actions"].map(h => (
                  <th key={h} className="text-left text-xs text-muted-foreground font-medium pb-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {members.map(m => (
                <tr key={m.email} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground">{m.avatar}</div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{m.name}</p>
                        <p className="text-xs text-muted-foreground">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3"><RoleBadge role={m.role} /></td>
                  <td className="py-3"><StatusBadge status={m.status} /></td>
                  <td className="py-3 text-sm text-muted-foreground">{m.lastActive}</td>
                  <td className="py-3">
                    <button className="text-xs text-primary hover:underline mr-3">Edit</button>
                    <button className="text-xs text-muted-foreground hover:text-red-500">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </OrgLayout>
  );
};

export default OrgTeam;
