import SuperAdminLayout from "@/components/layout/SuperAdminLayout";
import StatusBadge from "@/components/StatusBadge";
import RoleBadge from "@/components/RoleBadge";
import { Input } from "@/components/ui/input";
import { Search, Users } from "lucide-react";
import { useState } from "react";

const users = [
  { name: "John Doe", email: "john@digitalspark.com", role: "super-admin" as const, agency: "—", org: "—", status: "active" as const, lastActive: "Just now" },
  { name: "Sarah Chen", email: "sarah@digitalspark.com", role: "agency" as const, agency: "Digital Spark Agency", org: "—", status: "active" as const, lastActive: "2 min ago" },
  { name: "Mike Rivera", email: "mike@creativeflow.com", role: "agency" as const, agency: "CreativeFlow Media", org: "—", status: "active" as const, lastActive: "1 hr ago" },
  { name: "Priya Sharma", email: "priya@retailco.com", role: "organization" as const, agency: "Digital Spark Agency", org: "RetailCo", status: "active" as const, lastActive: "3 hrs ago" },
  { name: "Alex Kim", email: "alex@fashionhub.com", role: "user" as const, agency: "Digital Spark Agency", org: "FashionHub", status: "active" as const, lastActive: "Yesterday" },
  { name: "Jordan Lee", email: "jordan@localbites.com", role: "organization" as const, agency: "— (Standalone)", org: "LocalBites", status: "active" as const, lastActive: "5 hrs ago" },
  { name: "Taylor Smith", email: "taylor@socialpulse.com", role: "agency" as const, agency: "SocialPulse Inc", org: "—", status: "suspended" as const, lastActive: "2 weeks ago" },
  { name: "Emma Wilson", email: "emma@fitnesspro.com", role: "user" as const, agency: "— (Standalone)", org: "FitnessPro", status: "pending" as const, lastActive: "Never" },
];

const SuperAdminUsers = () => {
  const [search, setSearch] = useState("");
  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <SuperAdminLayout title="Users">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search users..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{users.length} total users</span>
          </div>
        </div>

        <div className="card-surface">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {["User", "Email", "Role", "Agency", "Business", "Status", "Last Active"].map(h => (
                  <th key={h} className="text-left text-[11px] uppercase text-muted-foreground font-medium pb-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.email} className={`border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors ${u.status === 'suspended' ? 'border-l-[3px] border-l-error' : ''}`}>
                  <td className="py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                        {u.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <span className="text-sm font-medium text-foreground">{u.name}</span>
                    </div>
                  </td>
                  <td className="py-3 text-sm text-muted-foreground">{u.email}</td>
                  <td className="py-3"><RoleBadge role={u.role} /></td>
                  <td className="py-3">
                    {u.agency !== "—" ? (
                      <span className="text-xs bg-agency/10 text-agency px-2 py-0.5 rounded-full">{u.agency}</span>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="py-3">
                    {u.org !== "—" ? (
                      <span className="text-xs bg-organization/10 text-organization px-2 py-0.5 rounded-full">{u.org}</span>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="py-3"><StatusBadge status={u.status} /></td>
                  <td className="py-3 text-sm text-muted-foreground">{u.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default SuperAdminUsers;
