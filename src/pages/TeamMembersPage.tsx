import { useState } from "react";
import AgencyLayout from "@/components/layout/AgencyLayout";
import StatusBadge from "@/components/StatusBadge";
import RoleBadge from "@/components/RoleBadge";
import { Button } from "@/components/ui/button";
import { Search, X, ChevronDown, ChevronRight, Check } from "lucide-react";

const members = [
  { name: "Sarah Chen", email: "sarah@agency.com", avatar: "SC", role: "content-creator" as const, orgs: ["RetailCo", "TechStart", "FoodieHub"], status: "active" as const, lastActive: "Online",
    permissions: ["Create posts", "Edit own posts", "View analytics", "Manage inbox"],
    orgDetails: [{ name: "RetailCo", role: "Content Creator" }, { name: "TechStart", role: "Approver" }, { name: "FoodieHub", role: "Content Creator" }]
  },
  { name: "James Wilson", email: "james@agency.com", avatar: "JW", role: "approver" as const, orgs: ["RetailCo"], status: "active" as const, lastActive: "2 hrs ago",
    permissions: ["Create posts", "Edit posts", "Approve posts", "Publish posts", "View analytics"],
    orgDetails: [{ name: "RetailCo", role: "Approver" }]
  },
  { name: "Priya Sharma", email: "priya@agency.com", avatar: "PS", role: "analyst" as const, orgs: ["TechStart", "FoodieHub"], status: "active" as const, lastActive: "1 hr ago",
    permissions: ["View analytics", "Generate reports", "Export data"],
    orgDetails: [{ name: "TechStart", role: "Analyst" }, { name: "FoodieHub", role: "Analyst" }]
  },
  { name: "Alex Rivera", email: "alex@agency.com", avatar: "AR", role: "engagement" as const, orgs: ["FoodieHub"], status: "pending" as const, lastActive: "Invited",
    permissions: ["Manage inbox", "Reply to comments", "View analytics"],
    orgDetails: [{ name: "FoodieHub", role: "Engagement Specialist" }]
  },
];

const roles = [
  { id: 'content-creator', name: 'Content Creator', desc: 'Create and edit posts, manage content calendar' },
  { id: 'approver', name: 'Approver', desc: 'Review and approve content before publishing' },
  { id: 'engagement', name: 'Engagement Specialist', desc: 'Manage inbox, reply to comments and messages' },
  { id: 'analyst', name: 'Analyst', desc: 'View analytics, generate reports, export data' },
  { id: 'guest', name: 'Guest', desc: 'View-only access to selected areas' },
];

const permissionMatrix = [
  { perm: "Create Posts", cc: true, app: true, eng: false, ana: false, guest: false },
  { perm: "Edit Posts", cc: true, app: true, eng: false, ana: false, guest: false },
  { perm: "Approve Posts", cc: false, app: true, eng: false, ana: false, guest: false },
  { perm: "Publish Posts", cc: false, app: true, eng: false, ana: false, guest: false },
  { perm: "View Analytics", cc: true, app: true, eng: true, ana: true, guest: true },
  { perm: "Manage Inbox", cc: false, app: false, eng: true, ana: false, guest: false },
  { perm: "Boost Posts", cc: false, app: true, eng: false, ana: false, guest: false },
  { perm: "Manage Profiles", cc: false, app: true, eng: false, ana: false, guest: false },
];

const TeamMembersPage = () => {
  const [expandedMember, setExpandedMember] = useState<string | null>(null);
  const [showInvite, setShowInvite] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');

  return (
    <AgencyLayout title="Team Members">
      {/* Summary */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-3">
          <div className="bg-card border border-border rounded-lg px-4 py-2 text-sm"><span className="text-text-muted">Total: </span><span className="text-foreground font-semibold">{members.length}</span></div>
          <div className="bg-card border border-border rounded-lg px-4 py-2 text-sm"><span className="text-text-muted">Active: </span><span className="text-success font-semibold">3</span></div>
          <div className="bg-card border border-border rounded-lg px-4 py-2 text-sm"><span className="text-text-muted">Pending: </span><span className="text-warning font-semibold">1</span></div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowMatrix(true)} className="text-sm text-primary hover:underline">View permissions matrix</button>
          <Button onClick={() => setShowInvite(true)}>Invite Member</Button>
        </div>
      </div>

      {/* Table */}
      <div className="card-surface">
        <table className="w-full">
          <thead><tr className="border-b border-border">
            {['Member', 'Role', 'Assigned Clients', 'Status', 'Last Active', 'Actions'].map(h => (
              <th key={h} className="text-left text-xs text-text-muted font-medium pb-3">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {members.map(m => (
              <>
                <tr key={m.name} className="border-b border-border hover:bg-elevated transition-colors cursor-pointer" onClick={() => setExpandedMember(expandedMember === m.name ? null : m.name)}>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-elevated flex items-center justify-center text-[10px] font-semibold text-text-secondary">{m.avatar}</div>
                      <div>
                        <p className="text-sm text-foreground">{m.name}</p>
                        <p className="text-xs text-text-muted">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3"><RoleBadge role={m.role} /></td>
                  <td className="py-3">
                    <div className="flex gap-1 flex-wrap">
                      {m.orgs.slice(0, 3).map(o => <span key={o} className="text-[11px] bg-elevated text-text-secondary rounded px-2 py-0.5">{o}</span>)}
                      {m.orgs.length > 3 && <span className="text-[11px] text-text-muted">+{m.orgs.length - 3}</span>}
                    </div>
                  </td>
                  <td className="py-3"><StatusBadge status={m.status} /></td>
                  <td className="py-3 text-sm text-text-muted">{m.lastActive}</td>
                  <td className="py-3">
                    <button className="text-xs text-primary hover:underline mr-3">Edit</button>
                    <button className="text-xs text-text-muted hover:text-error">Remove</button>
                  </td>
                </tr>
                {expandedMember === m.name && (
                  <tr key={`${m.name}-exp`}>
                    <td colSpan={6} className="py-0">
                      <div className="grid grid-cols-2 gap-6 p-4 bg-elevated/50 border-b border-border">
                        <div>
                          <h4 className="text-xs font-semibold text-text-secondary mb-2">Permissions</h4>
                          <ul className="space-y-1">
                            {m.permissions.map(p => <li key={p} className="text-[13px] text-text-secondary flex items-center gap-1.5"><Check className="h-3 w-3 text-success" />{p}</li>)}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-text-secondary mb-2">Client Assignments</h4>
                          {m.orgDetails.map(od => (
                            <div key={od.name} className="flex items-center justify-between py-1.5">
                              <span className="text-[13px] text-foreground">{od.name}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] text-text-muted">{od.role}</span>
                                <button className="text-text-muted hover:text-error"><X className="h-3 w-3" /></button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invite Modal */}
      {showInvite && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50" onClick={() => setShowInvite(false)}>
          <div className="w-[560px] bg-elevated border border-border-hover rounded-2xl p-8 max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Invite Team Member</h2>
              <button onClick={() => setShowInvite(false)} className="text-text-muted hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="text-sm text-text-secondary mb-1.5 block">Email Address</label><input className="input-dark" placeholder="member@email.com" /></div>
              <div><label className="text-sm text-text-secondary mb-1.5 block">Full Name</label><input className="input-dark" placeholder="Enter full name" /></div>
              <div>
                <label className="text-sm text-text-secondary mb-1.5 block">Global Role</label>
                <div className="space-y-2">
                  {roles.map(r => (
                    <button key={r.id} onClick={() => setSelectedRole(r.id)} className={`w-full p-3 rounded-lg border text-left transition-colors ${selectedRole === r.id ? 'border-primary bg-primary/5' : 'border-border hover:border-border-hover'}`}>
                      <div className="text-sm font-semibold text-foreground">{r.name}</div>
                      <div className="text-xs text-text-muted mt-0.5">{r.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
              <Button variant="secondary" onClick={() => setShowInvite(false)}>Cancel</Button>
              <Button>Send Invite</Button>
            </div>
          </div>
        </div>
      )}

      {/* Permissions Matrix Modal */}
      {showMatrix && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50" onClick={() => setShowMatrix(false)}>
          <div className="w-[800px] bg-elevated border border-border-hover rounded-2xl p-8" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Permissions Matrix</h2>
              <button onClick={() => setShowMatrix(false)} className="text-text-muted hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <table className="w-full">
              <thead><tr className="border-b border-border">
                <th className="text-left text-xs text-text-muted font-medium pb-3">Permission</th>
                <th className="text-center text-xs text-text-muted font-medium pb-3">Creator</th>
                <th className="text-center text-xs text-text-muted font-medium pb-3">Approver</th>
                <th className="text-center text-xs text-text-muted font-medium pb-3">Engagement</th>
                <th className="text-center text-xs text-text-muted font-medium pb-3">Analyst</th>
                <th className="text-center text-xs text-text-muted font-medium pb-3">Guest</th>
              </tr></thead>
              <tbody>
                {permissionMatrix.map(row => (
                  <tr key={row.perm} className="border-b border-border">
                    <td className="py-2.5 text-sm text-foreground">{row.perm}</td>
                    {[row.cc, row.app, row.eng, row.ana, row.guest].map((v, i) => (
                      <td key={i} className="py-2.5 text-center">
                        {v ? <Check className="h-4 w-4 text-success mx-auto" /> : <span className="text-text-muted">—</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AgencyLayout>
  );
};

export default TeamMembersPage;
