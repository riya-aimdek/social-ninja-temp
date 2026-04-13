import { useState } from "react";
import { Search, Plus, X, Check, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/StatusBadge";

const permissionList = ['Engage', 'Listen', 'Boost', 'Analyze'];

const defaultPermissions: Record<string, string[]> = {
  'business-admin': ['Engage', 'Listen', 'Boost', 'Analyze'],
  'content-creator': ['Engage'],
  'approver': ['Analyze'],
  'social-media-manager': ['Engage', 'Listen', 'Boost', 'Analyze'],
  'viewer': ['Analyze'],
};

const permissionColors: Record<string, string> = {
  Engage: 'bg-green-50 text-green-700 border-green-200',
  Listen: 'bg-green-50 text-green-700 border-green-200',
  Boost: 'bg-red-50 text-red-600 border-red-200',
  Analyze: 'bg-green-50 text-green-700 border-green-200',
};

const roleCards = [
  { id: 'business-admin', name: 'Business Admin', desc: "Manages one business's projects. Creates projects, adds social accounts, and invites business team members." },
  { id: 'content-creator', name: 'Content Creator', desc: 'Can draft posts for specific social accounts within a project but cannot hit "Publish".' },
  { id: 'approver', name: 'Approver (The Business)', desc: 'Usually a contact at the business company. Can log in to see their specific project to review and approve posts.' },
  { id: 'social-media-manager', name: 'Social Media Manager', desc: 'Can draft, schedule, and publish posts, and view analytics for their specific project.' },
];

const initialMembers: { id: string; name: string; email: string; role: string; roleId: string; permissions: string[]; status: 'active' | 'suspended' }[] = [];

export default function ClientTeamPage() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [manageUser, setManageUser] = useState<typeof initialMembers[0] | null>(null);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [members] = useState(initialMembers);

  const filtered = members.filter(u =>
    !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    setSelectedPermissions([...(defaultPermissions[roleId] || [])]);
  };

  const togglePermission = (perm: string) => {
    setSelectedPermissions(prev =>
      prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
    );
  };

  const openInvite = () => {
    setShowModal(true);
    setInviteName("");
    setInviteEmail("");
    setSelectedRole("");
    setSelectedPermissions([]);
  };

  const openManage = (user: typeof initialMembers[0]) => {
    setManageUser(user);
    setSelectedRole(user.roleId);
    setSelectedPermissions([...(defaultPermissions[user.roleId] || [])]);
  };

  const RoleCardsGrid = () => (
    <div className="grid grid-cols-2 gap-3">
      {roleCards.map(r => (
        <button
          key={r.id}
          onClick={() => handleRoleSelect(r.id)}
          className={`p-4 rounded-xl border text-left transition-all ${
            selectedRole === r.id
              ? 'border-primary bg-primary/5 ring-1 ring-primary'
              : 'border-border hover:border-muted-foreground'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className={`text-sm font-semibold ${selectedRole === r.id ? 'text-primary' : 'text-foreground'}`}>{r.name}</span>
            {selectedRole === r.id ? (
              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center"><Check className="h-3 w-3 text-white" /></div>
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-border" />
            )}
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{r.desc}</p>
        </button>
      ))}
    </div>
  );

  const PermissionsGrid = () => (
    <div className="mb-6">
      <label className="text-sm font-semibold text-foreground mb-3 block">Permissions</label>
      <div className="grid grid-cols-2 gap-3">
        {permissionList.map(perm => {
          const active = selectedPermissions.includes(perm);
          return (
            <button
              key={perm}
              onClick={() => togglePermission(perm)}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                active ? 'border-green-300 bg-green-50' : 'border-border hover:border-muted-foreground'
              }`}
            >
              <div className={`w-5 h-5 rounded flex items-center justify-center ${active ? 'bg-green-600' : 'border-2 border-border'}`}>
                {active && <Check className="h-3 w-3 text-white" />}
              </div>
              <span className={`text-sm font-medium ${active ? 'text-green-700' : 'text-foreground'}`}>{perm}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Search + Invite */}
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            className="h-10 pl-9 pr-4 w-[280px] border border-border rounded-lg bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button onClick={openInvite} className="gap-2">
          <Plus className="w-4 h-4" /> Invite User
        </Button>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground uppercase tracking-wider border-b border-border">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Permission</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-muted-foreground">
                    No records found
                  </td>
                </tr>
              ) : (
                filtered.map(u => (
                  <tr key={u.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-sm text-foreground border border-border rounded px-2 py-0.5">{u.role}</span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {u.permissions.map(p => (
                          <span key={p} className={`text-xs font-medium px-2 py-0.5 rounded border ${permissionColors[p] || 'bg-muted text-muted-foreground border-border'}`}>
                            {p}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3"><StatusBadge status={u.status} /></td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openManage(u)} className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"><Pencil className="h-4 w-4" /></button>
                        <button className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="w-[600px] bg-card border border-border rounded-2xl p-8 max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-foreground">Invite User</h2>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <hr className="border-border mb-6" />

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">Full Name <span className="text-primary">*</span></label>
                <input className="h-10 w-full px-4 border border-border rounded-lg bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Jane Doe" value={inviteName} onChange={e => setInviteName(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">Email Address <span className="text-primary">*</span></label>
                <input className="h-10 w-full px-4 border border-border rounded-lg bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" placeholder="jane@company.com" type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} />
              </div>
            </div>

            <div className="mb-6">
              <label className="text-sm font-semibold text-foreground mb-3 block">Assign Role <span className="text-primary">*</span></label>
              <RoleCardsGrid />
            </div>

            {selectedRole && <PermissionsGrid />}

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button variant="outline" onClick={() => setShowModal(false)} className="px-8 flex-1">Cancel</Button>
              <Button className="px-8 flex-1" disabled={!inviteName.trim() || !inviteEmail.trim() || !selectedRole}>Send Invitation</Button>
            </div>
          </div>
        </div>
      )}

      {/* Manage User Modal */}
      {manageUser && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50" onClick={() => setManageUser(null)}>
          <div className="w-[600px] bg-card border border-border rounded-2xl p-8 max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-foreground">Manage — {manageUser.name}</h2>
              <button onClick={() => setManageUser(null)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>

            <div className="mb-6">
              <label className="text-sm font-semibold text-foreground mb-3 block">Assign Role <span className="text-primary">*</span></label>
              <RoleCardsGrid />
            </div>

            {selectedRole && <PermissionsGrid />}

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button variant="outline" onClick={() => setManageUser(null)} className="px-8 flex-1">Cancel</Button>
              <Button className="px-8 flex-1">Save Changes</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
