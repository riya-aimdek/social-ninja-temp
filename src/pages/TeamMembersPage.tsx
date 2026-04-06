import { useState } from "react";
import AgencyLayout from "@/components/layout/AgencyLayout";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Search, X, Plus, Pencil, Trash2, RefreshCw, Mail, Users as UsersIcon } from "lucide-react";

const initialUsers = [
  {
    id: '1', name: 'Rii', email: 'riya.shah@aimdek.com',
    role: 'Content Creator', permission: 'No access',
    status: 'active' as const, inviteStatus: 'pending' as const,
  },
];

const roleCards = [
  {
    category: 'AGENCY',
    roles: [
      { id: 'agency-admin', name: 'Agency Admin', desc: 'Full control over agency. Can create new clients, delete projects, and see everything across the entire tool.' },
      { id: 'agency-account-manager', name: 'Agency Account Manager', desc: 'Handles day-to-day for all clients. Can manage multiple clients but cannot access billing or delete clients.' },
    ],
  },
  {
    category: 'CLIENT',
    roles: [
      { id: 'client-admin', name: 'Client Admin', desc: "Manages one client's projects. Creates projects, adds social accounts, and invites client team members." },
      { id: 'content-creator', name: 'Content Creator', desc: 'Can draft posts for specific social accounts within a project but cannot hit "Publish".' },
      { id: 'approver', name: 'Approver', desc: 'Usually a contact at the client company. Can log in to see only their specific project to review and approve posts.' },
      { id: 'social-media-manager', name: 'Social Media Manager', desc: 'Can draft, schedule, and publish posts, and view analytics for their specific project.' },
    ],
  },
];

const TeamMembersPage = () => {
  const [search, setSearch] = useState('');
  const [showAddUser, setShowAddUser] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [users] = useState(initialUsers);

  const filtered = users.filter(u => !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <AgencyLayout title="Users">
      {/* Search + Add User */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input className="h-10 pl-9 pr-4 w-[280px] border border-border rounded-lg bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Button onClick={() => setShowAddUser(true)}>
          <Plus className="h-4 w-4" /> Add User
        </Button>
      </div>

      {/* Users Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {['NAME', 'ROLE', 'PERMISSION', 'STATUS', 'ACTIONS'].map(h => (
                <th key={h} className="text-left text-[11px] uppercase text-muted-foreground font-medium px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-sm text-muted-foreground">No records found</td>
              </tr>
            ) : (
              filtered.map(u => (
                <tr key={u.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-foreground border border-border rounded px-2 py-0.5">{u.role}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{u.permission}</td>
                  <td className="px-4 py-3"><StatusBadge status={u.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground" title="Manage Clients">
                        <UsersIcon className="h-4 w-4" />
                      </button>
                      <button className="text-xs text-primary hover:underline font-medium">Manage Clients</button>
                      <button className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"><Pencil className="h-4 w-4" /></button>
                      <button className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-border text-xs text-muted-foreground">
            Showing 1-{filtered.length} of {filtered.length} results
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50" onClick={() => setShowAddUser(false)}>
          <div className="w-[600px] bg-card border border-border rounded-2xl p-8 max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-foreground">Add User</h2>
              <button onClick={() => setShowAddUser(false)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <hr className="border-border mb-6" />

            {/* Name & Email */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">Full Name <span className="text-primary">*</span></label>
                <input className="h-10 w-full px-4 border border-border rounded-lg bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Jane Doe" />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">Email Address <span className="text-primary">*</span></label>
                <input className="h-10 w-full px-4 border border-border rounded-lg bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" placeholder="jane@company.com" />
              </div>
            </div>

            {/* Assign Role */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-3 block">Assign Role <span className="text-primary">*</span></label>
              {roleCards.map(cat => (
                <div key={cat.category} className="mb-4">
                  <p className="text-xs font-medium text-muted-foreground tracking-wider mb-2">{cat.category}</p>
                  <div className="grid grid-cols-2 gap-3">
                    {cat.roles.map(r => (
                      <button
                        key={r.id}
                        onClick={() => setSelectedRole(r.id)}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          selectedRole === r.id
                            ? 'border-primary bg-primary/5 ring-1 ring-primary'
                            : 'border-border hover:border-muted-foreground'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold text-foreground">{r.name}</span>
                          <div className={`w-4 h-4 rounded-full border-2 ${selectedRole === r.id ? 'border-primary bg-primary' : 'border-border'}`}>
                            {selectedRole === r.id && <div className="w-full h-full rounded-full flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-white" /></div>}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{r.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
              <Button variant="outline" onClick={() => setShowAddUser(false)} className="px-8">Cancel</Button>
              <Button className="px-8">Send Invitation</Button>
            </div>
          </div>
        </div>
      )}
    </AgencyLayout>
  );
};

export default TeamMembersPage;
