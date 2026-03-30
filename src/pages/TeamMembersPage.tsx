import { useState } from "react";
import AgencyLayout from "@/components/layout/AgencyLayout";
import StatusBadge from "@/components/StatusBadge";
import RoleBadge from "@/components/RoleBadge";
import { Button } from "@/components/ui/button";
import { Search, X, Check } from "lucide-react";

const members = [
  {
    name: "Sarah Chen", email: "sarah@agency.com", avatar: "SC",
    role: "agency-admin" as const, clients: ["Acme Corp", "TechStart", "Beta Foods"],
    status: "active" as const, lastActive: "Online",
    permissions: ["Full agency control", "Create clients", "Delete projects", "Manage billing"],
    clientDetails: [
      { name: "Acme Corp", projects: ["Acme Sneakers", "Acme Apparel"] },
      { name: "TechStart", projects: ["TechStart Blog"] },
      { name: "Beta Foods", projects: ["Beta Snacks"] },
    ]
  },
  {
    name: "James Wilson", email: "james@agency.com", avatar: "JW",
    role: "agency-account-manager" as const, clients: ["Acme Corp", "Beta Foods"],
    status: "active" as const, lastActive: "2 hrs ago",
    permissions: ["Manage assigned clients", "Edit posts/schedules", "Invite client users", "View analytics"],
    clientDetails: [
      { name: "Acme Corp", projects: ["Acme Sneakers", "Acme Apparel"] },
      { name: "Beta Foods", projects: ["Beta Snacks"] },
    ]
  },
  {
    name: "Priya Sharma", email: "priya@acmecorp.com", avatar: "PS",
    role: "client-admin" as const, clients: ["Acme Corp"],
    status: "active" as const, lastActive: "1 hr ago",
    permissions: ["Create projects", "Add social accounts", "Invite client team", "Manage project teams"],
    clientDetails: [
      { name: "Acme Corp", projects: ["Acme Sneakers", "Acme Apparel", "Acme Lifestyle Blog"] },
    ]
  },
  {
    name: "Mike Torres", email: "mike@agency.com", avatar: "MT",
    role: "social-media-manager" as const, clients: ["Beta Foods"],
    status: "active" as const, lastActive: "3 hrs ago",
    permissions: ["Draft posts", "Schedule posts", "Publish posts", "View analytics"],
    clientDetails: [
      { name: "Beta Foods", projects: ["Beta Snacks"] },
    ]
  },
  {
    name: "Lisa Park", email: "lisa@acmecorp.com", avatar: "LP",
    role: "content-creator" as const, clients: ["Acme Corp"],
    status: "active" as const, lastActive: "5 hrs ago",
    permissions: ["Draft posts", "Edit own posts", "Cannot publish"],
    clientDetails: [
      { name: "Acme Corp", projects: ["Acme Sneakers"] },
    ]
  },
  {
    name: "Tom Client", email: "tom@betafoods.com", avatar: "TC",
    role: "approver" as const, clients: ["Beta Foods"],
    status: "pending" as const, lastActive: "Invited",
    permissions: ["View project content", "Review posts", "Approve posts"],
    clientDetails: [
      { name: "Beta Foods", projects: ["Beta Snacks"] },
    ]
  },
];

const roles = [
  { id: 'agency-admin', name: 'Agency Admin', desc: 'Full control over agency. Can create clients, delete projects, see everything.' },
  { id: 'agency-account-manager', name: 'Agency Account Manager', desc: 'Manages day-to-day for assigned clients. Can edit posts, schedules, and invite client users.' },
  { id: 'client-admin', name: 'Client Admin', desc: 'Manages one client\'s projects. Creates projects, adds social accounts, invites team.' },
  { id: 'content-creator', name: 'Content Creator', desc: 'Drafts posts for specific projects but cannot publish.' },
  { id: 'approver', name: 'Approver', desc: 'Reviews and approves posts within their assigned project.' },
  { id: 'social-media-manager', name: 'Social Media Manager', desc: 'Drafts, schedules, publishes posts, and views analytics for a project.' },
];

const permissionMatrix = [
  { perm: "Create Clients", aa: true, aam: false, ca: false, cc: false, app: false, smm: false },
  { perm: "Delete Projects", aa: true, aam: false, ca: false, cc: false, app: false, smm: false },
  { perm: "Create Projects", aa: true, aam: false, ca: true, cc: false, app: false, smm: false },
  { perm: "Add Social Accounts", aa: true, aam: true, ca: true, cc: false, app: false, smm: false },
  { perm: "Invite Users", aa: true, aam: true, ca: true, cc: false, app: false, smm: false },
  { perm: "Draft Posts", aa: true, aam: true, ca: true, cc: true, app: false, smm: true },
  { perm: "Approve Posts", aa: true, aam: true, ca: true, cc: false, app: true, smm: false },
  { perm: "Publish Posts", aa: true, aam: true, ca: true, cc: false, app: false, smm: true },
  { perm: "View Analytics", aa: true, aam: true, ca: true, cc: false, app: false, smm: true },
  { perm: "Manage Billing", aa: true, aam: false, ca: false, cc: false, app: false, smm: false },
];

const TeamMembersPage = () => {
  const [expandedMember, setExpandedMember] = useState<string | null>(null);
  const [showInvite, setShowInvite] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');

  return (
    <AgencyLayout title="Team Members">
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-3">
          <div className="bg-card border border-border rounded-lg px-4 py-2 text-sm"><span className="text-muted-foreground">Total: </span><span className="text-foreground font-semibold">{members.length}</span></div>
          <div className="bg-card border border-border rounded-lg px-4 py-2 text-sm"><span className="text-muted-foreground">Active: </span><span className="text-success font-semibold">5</span></div>
          <div className="bg-card border border-border rounded-lg px-4 py-2 text-sm"><span className="text-muted-foreground">Pending: </span><span className="text-warning font-semibold">1</span></div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowMatrix(true)} className="text-sm text-primary hover:underline">View permissions matrix</button>
          <Button onClick={() => setShowInvite(true)}>Invite Member</Button>
        </div>
      </div>

      <div className="card-surface">
        <table className="w-full">
          <thead><tr className="border-b border-border">
            {['Member', 'Role', 'Assigned Clients', 'Status', 'Last Active', 'Actions'].map(h => (
              <th key={h} className="text-left text-xs text-muted-foreground font-medium pb-3">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {members.map(m => (
              <>
                <tr key={m.name} className="border-b border-border hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setExpandedMember(expandedMember === m.name ? null : m.name)}>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-semibold text-primary">{m.avatar}</div>
                      <div>
                        <p className="text-sm text-foreground">{m.name}</p>
                        <p className="text-xs text-muted-foreground">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3"><RoleBadge role={m.role} /></td>
                  <td className="py-3">
                    <div className="flex gap-1 flex-wrap">
                      {m.clients.slice(0, 3).map(o => <span key={o} className="text-[11px] bg-muted text-muted-foreground rounded px-2 py-0.5">{o}</span>)}
                      {m.clients.length > 3 && <span className="text-[11px] text-muted-foreground">+{m.clients.length - 3}</span>}
                    </div>
                  </td>
                  <td className="py-3"><StatusBadge status={m.status} /></td>
                  <td className="py-3 text-sm text-muted-foreground">{m.lastActive}</td>
                  <td className="py-3">
                    <button className="text-xs text-primary hover:underline mr-3">Edit</button>
                    <button className="text-xs text-muted-foreground hover:text-destructive">Remove</button>
                  </td>
                </tr>
                {expandedMember === m.name && (
                  <tr key={`${m.name}-exp`}>
                    <td colSpan={6} className="py-0">
                      <div className="grid grid-cols-2 gap-6 p-4 bg-muted/30 border-b border-border">
                        <div>
                          <h4 className="text-xs font-semibold text-muted-foreground mb-2">Permissions</h4>
                          <ul className="space-y-1">
                            {m.permissions.map(p => <li key={p} className="text-[13px] text-muted-foreground flex items-center gap-1.5"><Check className="h-3 w-3 text-success" />{p}</li>)}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-muted-foreground mb-2">Client → Project Assignments</h4>
                          {m.clientDetails.map(cd => (
                            <div key={cd.name} className="mb-2">
                              <p className="text-[13px] font-medium text-foreground">{cd.name}</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {cd.projects.map(p => <span key={p} className="text-[11px] bg-primary/10 text-primary rounded px-2 py-0.5">{p}</span>)}
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
          <div className="w-[560px] bg-card border border-border rounded-2xl p-8 max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Invite Team Member</h2>
              <button onClick={() => setShowInvite(false)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="text-sm text-muted-foreground mb-1.5 block">Email Address</label><input className="input-dark" placeholder="member@email.com" /></div>
              <div><label className="text-sm text-muted-foreground mb-1.5 block">Full Name</label><input className="input-dark" placeholder="Enter full name" /></div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Role</label>
                <div className="space-y-2">
                  {roles.map(r => (
                    <button key={r.id} onClick={() => setSelectedRole(r.id)} className={`w-full p-3 rounded-lg border text-left transition-colors ${selectedRole === r.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}>
                      <div className="text-sm font-semibold text-foreground">{r.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{r.desc}</div>
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

      {/* Permissions Matrix */}
      {showMatrix && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50" onClick={() => setShowMatrix(false)}>
          <div className="w-[900px] bg-card border border-border rounded-2xl p-8" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Roles & Permissions Matrix</h2>
              <button onClick={() => setShowMatrix(false)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <p className="text-xs text-muted-foreground mb-4">Hierarchy: Agency → Client → Project → Social Accounts</p>
            <table className="w-full">
              <thead><tr className="border-b border-border">
                <th className="text-left text-xs text-muted-foreground font-medium pb-3">Permission</th>
                <th className="text-center text-xs text-muted-foreground font-medium pb-3">Agency Admin</th>
                <th className="text-center text-xs text-muted-foreground font-medium pb-3">Acct Manager</th>
                <th className="text-center text-xs text-muted-foreground font-medium pb-3">Client Admin</th>
                <th className="text-center text-xs text-muted-foreground font-medium pb-3">Creator</th>
                <th className="text-center text-xs text-muted-foreground font-medium pb-3">Approver</th>
                <th className="text-center text-xs text-muted-foreground font-medium pb-3">SM Manager</th>
              </tr></thead>
              <tbody>
                {permissionMatrix.map(row => (
                  <tr key={row.perm} className="border-b border-border">
                    <td className="py-2.5 text-sm text-foreground">{row.perm}</td>
                    {[row.aa, row.aam, row.ca, row.cc, row.app, row.smm].map((v, i) => (
                      <td key={i} className="py-2.5 text-center">
                        {v ? <Check className="h-4 w-4 text-success mx-auto" /> : <span className="text-muted-foreground">—</span>}
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
