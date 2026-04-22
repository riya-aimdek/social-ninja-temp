import { useState } from "react";
import { useParams } from "react-router-dom";
import AgencyLayout from "@/components/layout/AgencyLayout";
import StatusBadge from "@/components/StatusBadge";
import RoleBadge from "@/components/RoleBadge";
import { Button } from "@/components/ui/button";
import { Search, X, Plus, Pencil, Trash2, Check, ChevronDown, Sparkles } from "lucide-react";
import { rolesForScope, defaultPermissionsFor, PERMISSIONS, getRole } from "@/data/roles";

const permissionList = [...PERMISSIONS] as string[];

const permissionColors: Record<string, string> = {
  Engage: "bg-green-50 text-green-700 border-green-200",
  Listen: "bg-green-50 text-green-700 border-green-200",
  Boost: "bg-red-50 text-red-600 border-red-200",
  Analyze: "bg-green-50 text-green-700 border-green-200",
  ORM: "bg-violet-50 text-violet-700 border-violet-200",
  Approve: "bg-amber-50 text-amber-700 border-amber-200",
  Publish: "bg-blue-50 text-blue-700 border-blue-200",
};

const roleCards = rolesForScope("client").map((r) => ({
  id: r.id,
  name: r.name,
  desc: r.desc,
  tags: r.tags,
}));

const mockAgencyUsers = [
  { id: '1', name: 'user-1', email: 'user1@yopmail.com' },
  { id: '2', name: 'user-3', email: 'user3@yopmail.com' },
  { id: '3', name: 'useer', email: 'useer@yopmail.com' },
];

const initialMembers = [
  { id: '1', name: 'useer', email: 'useer@yopmail.com', role: 'Social Media Manager', roleId: 'social-media-manager', permissions: ['Engage', 'Listen', 'Boost', 'Analyze'], status: 'active' as const },
];

const AgencyClientTeamPage = () => {
  const { id } = useParams();
  const [search, setSearch] = useState('');
  const [showAddUser, setShowAddUser] = useState(false);
  const [editUser, setEditUser] = useState<typeof initialMembers[0] | null>(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [members] = useState(initialMembers);

  // Select user dropdown state
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<typeof mockAgencyUsers[0] | null>(null);
  const [userSearch, setUserSearch] = useState('');

  const clientName = `client-${id}`;

  const filtered = members.filter(u => !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  const filteredAgencyUsers = mockAgencyUsers.filter(u =>
    !userSearch || u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const handleEditOpen = (user: typeof initialMembers[0]) => {
    setEditUser(user);
    setSelectedRole(user.roleId);
    setSelectedPermissions([...user.permissions]);
  };

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    setSelectedPermissions([...defaultPermissionsFor(roleId)]);
  };

  const togglePermission = (perm: string) => {
    setSelectedPermissions(prev =>
      prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
    );
  };

  const isDefault = (perm: string) => defaultPermissionsFor(selectedRole).includes(perm);
  const isExtra = (perm: string) => selectedPermissions.includes(perm) && !isDefault(perm);

  const openAddUser = () => {
    setShowAddUser(true);
    setSelectedRole('');
    setSelectedPermissions([]);
    setSelectedUser(null);
    setUserSearch('');
  };

  const RoleCardsGrid = () => (
    <div className="grid grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1 -mr-1">
      {roleCards.map(r => {
        const active = selectedRole === r.id;
        return (
          <button
            key={r.id}
            onClick={() => handleRoleSelect(r.id)}
            className={`p-4 rounded-xl border text-left transition-all ${
              active
                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                : 'border-border hover:border-muted-foreground'
            }`}
          >
            <div className="flex items-center justify-between mb-1 gap-2">
              <span className={`text-sm font-semibold ${active ? 'text-primary' : 'text-foreground'}`}>{r.name}</span>
              {active ? (
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0"><Check className="h-3 w-3 text-white" /></div>
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-border shrink-0" />
              )}
            </div>
            {r.tags && r.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-1.5">
                {r.tags.map((t) => (
                  <span
                    key={t}
                    className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                      t === 'New' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {t === 'New' && <Sparkles className="h-2.5 w-2.5" />}
                    {t}
                  </span>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground leading-relaxed">{r.desc}</p>
          </button>
        );
      })}
    </div>
  );

  const PermissionsGrid = () => (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-semibold text-foreground">Permissions</label>
        <span className="text-xs text-muted-foreground">Click to grant extra or revoke defaults</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {permissionList.map(perm => {
          const active = selectedPermissions.includes(perm);
          const def = isDefault(perm);
          const extra = isExtra(perm);
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
              {def && active && <span className="text-xs text-muted-foreground ml-auto">default</span>}
              {extra && <span className="text-xs text-green-600 ml-auto">+extra</span>}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <AgencyLayout title="Team">
      {/* Header */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">{clientName} — Team</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Users assigned to this client</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input className="h-10 pl-9 pr-4 w-[220px] border border-border rounded-lg bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Button onClick={openAddUser}>
              <Plus className="h-4 w-4" /> Add Users
            </Button>
          </div>
        </div>
      </div>

      {/* Members Table */}
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
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {u.permissions.map(p => (
                        <span key={p} className={`text-xs font-medium px-2 py-0.5 rounded border ${permissionColors[p] || 'bg-muted text-muted-foreground border-border'}`}>
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={u.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEditOpen(u)} className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"><Pencil className="h-4 w-4" /></button>
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

      {/* Edit User Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50" onClick={() => setEditUser(null)}>
          <div className="w-[600px] bg-card border border-border rounded-2xl p-8 max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-foreground">Edit — {editUser.name}</h2>
              <button onClick={() => setEditUser(null)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>

            <div className="mb-6">
              <label className="text-sm font-semibold text-foreground mb-3 block">Assign Role <span className="text-primary">*</span></label>
              <RoleCardsGrid />
            </div>

            {selectedRole && <PermissionsGrid />}

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button variant="outline" onClick={() => setEditUser(null)} className="px-8 flex-1">Cancel</Button>
              <Button className="px-8 flex-1">Save Changes</Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Users Modal — Select User from existing agency users */}
      {showAddUser && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50" onClick={() => setShowAddUser(false)}>
          <div className="w-[600px] bg-card border border-border rounded-2xl p-8 max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-foreground">Add Users</h2>
              <button onClick={() => setShowAddUser(false)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <hr className="border-border mb-6" />

            {/* Select User Dropdown */}
            <div className="mb-6">
              <label className="text-sm font-semibold text-foreground mb-1.5 block">Select User <span className="text-primary">*</span></label>
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="h-10 w-full px-4 border border-border rounded-lg bg-background text-sm flex items-center justify-between focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {selectedUser ? (
                    <span className="text-foreground">{selectedUser.name} ({selectedUser.email})</span>
                  ) : (
                    <span className="text-muted-foreground">Search agency users...</span>
                  )}
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
                {userDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden">
                    <div className="p-2 border-b border-border">
                      <input
                        className="h-8 w-full px-3 border border-border rounded-lg bg-background text-sm placeholder:text-muted-foreground focus:outline-none"
                        placeholder="Search agency users..."
                        value={userSearch}
                        onChange={e => setUserSearch(e.target.value)}
                        autoFocus
                      />
                    </div>
                    <div className="max-h-[200px] overflow-y-auto">
                      {filteredAgencyUsers.map(u => (
                        <button
                          key={u.id}
                          onClick={() => { setSelectedUser(u); setUserDropdownOpen(false); setUserSearch(''); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted/50 transition-colors text-left"
                        >
                          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{u.name}</p>
                            <p className="text-xs text-muted-foreground">{u.email}</p>
                          </div>
                        </button>
                      ))}
                      {filteredAgencyUsers.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">No users found</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-6">
              <label className="text-sm font-semibold text-foreground mb-3 block">Assign Role <span className="text-primary">*</span></label>
              <RoleCardsGrid />
            </div>

            {selectedRole && <PermissionsGrid />}

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button variant="outline" onClick={() => setShowAddUser(false)} className="px-8 flex-1">Cancel</Button>
              <Button className="px-8 flex-1">Save</Button>
            </div>
          </div>
        </div>
      )}
    </AgencyLayout>
  );
};

export default AgencyClientTeamPage;
