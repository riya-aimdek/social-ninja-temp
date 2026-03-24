import SuperAdminLayout from "@/components/layout/SuperAdminLayout";
import StatusBadge from "@/components/StatusBadge";
import RoleBadge from "@/components/RoleBadge";
import { Input } from "@/components/ui/input";
import { Search, MoreHorizontal, Users } from "lucide-react";
import { useState } from "react";

const users = [
  { name: "John Doe", email: "john@digitalspark.com", role: "super_admin" as const, agency: "—", status: "active" as const },
  { name: "Sarah Chen", email: "sarah@digitalspark.com", role: "agency_admin" as const, agency: "Digital Spark Agency", status: "active" as const },
  { name: "Mike Rivera", email: "mike@creativeflow.com", role: "agency_admin" as const, agency: "CreativeFlow Media", status: "active" as const },
  { name: "Priya Sharma", email: "priya@retailco.com", role: "org_admin" as const, agency: "Digital Spark Agency", status: "active" as const },
  { name: "Alex Kim", email: "alex@fashionhub.com", role: "member" as const, agency: "Digital Spark Agency", status: "active" as const },
  { name: "Jordan Lee", email: "jordan@localbites.com", role: "org_admin" as const, agency: "—", status: "active" as const },
  { name: "Taylor Smith", email: "taylor@socialpulse.com", role: "agency_admin" as const, agency: "SocialPulse Inc", status: "suspended" as const },
  { name: "Emma Wilson", email: "emma@fitnesspro.com", role: "member" as const, agency: "—", status: "pending" as const },
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
                {["User", "Email", "Role", "Agency / Org", "Status", ""].map(h => (
                  <th key={h} className="text-left text-xs text-muted-foreground font-medium pb-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.email} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
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
                  <td className="py-3 text-sm text-muted-foreground">{u.agency}</td>
                  <td className="py-3"><StatusBadge status={u.status} /></td>
                  <td className="py-3 text-right">
                    <button className="text-muted-foreground hover:text-foreground"><MoreHorizontal className="h-4 w-4" /></button>
                  </td>
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
