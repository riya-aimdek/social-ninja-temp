import { useState } from "react";
import SuperAdminLayout from "@/components/layout/SuperAdminLayout";
import RoleBadge from "@/components/RoleBadge";
import { Button } from "@/components/ui/button";
import { Search, Download, ChevronDown } from "lucide-react";

const logEntries = [
  { time: "Mar 24, 2026 14:32", user: "Admin User", userAvatar: "AU", role: "super-admin" as const, action: "Created agency Digital Spark", entity: "Agency", context: "Platform", ip: "192.168.1.1", type: "create" },
  { time: "Mar 24, 2026 13:15", user: "Sarah Chen", userAvatar: "SC", role: "agency" as const, action: "Created organization RetailCo", entity: "Organization", context: "Digital Spark", ip: "10.0.0.42", type: "create" },
  { time: "Mar 24, 2026 12:00", user: "James Wilson", userAvatar: "JW", role: "organization" as const, action: "Published 3 posts to Instagram", entity: "Post", context: "Digital Spark > RetailCo", ip: "172.16.0.5", type: "publish" },
  { time: "Mar 24, 2026 11:45", user: "Admin User", userAvatar: "AU", role: "super-admin" as const, action: "Suspended agency SocialPulse Inc", entity: "Agency", context: "Platform", ip: "192.168.1.1", type: "delete" },
  { time: "Mar 24, 2026 10:30", user: "Priya Sharma", userAvatar: "PS", role: "agency" as const, action: "Changed role for Mike Torres", entity: "User", context: "Digital Spark > FoodieHub", ip: "10.0.0.18", type: "permission" },
  { time: "Mar 24, 2026 09:22", user: "Admin User", userAvatar: "AU", role: "super-admin" as const, action: "Updated billing plan for BrandWave", entity: "Agency", context: "Platform", ip: "192.168.1.1", type: "edit" },
  { time: "Mar 24, 2026 08:15", user: "Alex Rivera", userAvatar: "AR", role: "organization" as const, action: "Logged in from new device", entity: "User", context: "Digital Spark > FoodieHub", ip: "203.0.113.50", type: "login" },
  { time: "Mar 23, 2026 22:00", user: "Sarah Chen", userAvatar: "SC", role: "agency" as const, action: "Invited user alex@agency.com", entity: "User", context: "Digital Spark", ip: "10.0.0.42", type: "create" },
];

const borderColors: Record<string, string> = {
  create: 'border-l-2 border-l-success',
  delete: 'border-l-2 border-l-error',
  permission: 'border-l-2 border-l-warning',
  login: '',
  edit: 'border-l-2 border-l-info',
  publish: '',
};

const entityColors: Record<string, string> = {
  Agency: 'bg-agency/15 text-agency',
  Organization: 'bg-organization/15 text-organization',
  User: 'bg-user-role/15 text-user-role',
  Post: 'bg-primary/15 text-primary',
};

const AuditLogPage = () => {
  const [search, setSearch] = useState('');

  return (
    <SuperAdminLayout title="Audit Log">
      {/* Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <input className="input-dark w-40" type="date" />
          <span className="text-text-muted text-sm">to</span>
          <input className="input-dark w-40" type="date" />
          <select className="input-dark w-36"><option>All Agencies</option></select>
          <select className="input-dark w-36"><option>All Actions</option><option>Login</option><option>Create</option><option>Edit</option><option>Delete</option><option>Approve</option><option>Publish</option><option>Invite</option><option>Permission change</option></select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <input className="input-dark pl-9 w-48" placeholder="Search user..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <Button variant="outline" size="sm"><Download className="h-4 w-4" /> Export CSV</Button>
      </div>

      {/* Table */}
      <div className="card-surface">
        <table className="w-full">
          <thead><tr className="border-b border-border">
            {['Timestamp', 'User', 'Action', 'Entity', 'Context', 'IP Address'].map(h => (
              <th key={h} className="text-left text-xs text-text-muted font-medium pb-3">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {logEntries.map((entry, i) => (
              <tr key={i} className={`border-b border-border hover:bg-elevated transition-colors ${borderColors[entry.type] || ''}`}>
                <td className="py-3 text-[13px] text-text-secondary whitespace-nowrap">{entry.time}</td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-elevated flex items-center justify-center text-[10px] font-semibold text-text-secondary">{entry.userAvatar}</div>
                    <div>
                      <span className="text-sm text-foreground">{entry.user}</span>
                      <div className="mt-0.5"><RoleBadge role={entry.role} /></div>
                    </div>
                  </div>
                </td>
                <td className="py-3 text-[13px] text-foreground">{entry.action}</td>
                <td className="py-3"><span className={`text-[11px] px-2 py-0.5 rounded-full ${entityColors[entry.entity] || ''}`}>{entry.entity}</span></td>
                <td className="py-3 text-[13px] text-text-secondary">{entry.context}</td>
                <td className="py-3 text-xs text-text-muted font-mono">{entry.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <span className="text-[13px] text-text-muted">Showing 1–8 of 1,240 entries</span>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" disabled>Previous</Button>
            <Button variant="ghost" size="sm">Next</Button>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default AuditLogPage;
