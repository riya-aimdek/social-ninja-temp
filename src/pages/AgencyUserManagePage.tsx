import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AgencyLayout from "@/components/layout/AgencyLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Pencil, Trash2, Check, X, ChevronDown, Sparkles } from "lucide-react";
import { rolesForScope, defaultPermissionsFor, PERMISSIONS, getRole } from "@/data/roles";

const permissionList = [...PERMISSIONS] as string[];

const permissionColors: Record<string, { active: string; inactive: string }> = {
  Engage: { active: "bg-green-50 text-green-700 border-green-200", inactive: "bg-muted text-muted-foreground border-border" },
  Listen: { active: "bg-green-50 text-green-700 border-green-200", inactive: "bg-muted text-muted-foreground border-border" },
  Boost: { active: "bg-red-50 text-red-600 border-red-200", inactive: "bg-muted text-muted-foreground border-border" },
  Analyze: { active: "bg-green-50 text-green-700 border-green-200", inactive: "bg-muted text-muted-foreground border-border" },
  ORM: { active: "bg-violet-50 text-violet-700 border-violet-200", inactive: "bg-muted text-muted-foreground border-border" },
  Approve: { active: "bg-amber-50 text-amber-700 border-amber-200", inactive: "bg-muted text-muted-foreground border-border" },
  Publish: { active: "bg-blue-50 text-blue-700 border-blue-200", inactive: "bg-muted text-muted-foreground border-border" },
};

const roleCards = rolesForScope("client").map((r) => ({
  id: r.id,
  name: r.name,
  desc: r.desc,
  tags: r.tags,
}));

const mockClients = [
  { id: '1', name: 'client-1', initials: 'C', color: 'bg-primary' },
  { id: '2', name: 'Inactive Co', initials: 'IC', color: 'bg-muted-foreground' },
];

// Mock user data
const usersData: Record<string, { name: string; email: string; role: string; clients: { id: string; name: string; initials: string; color: string; roleId: string; roleName: string; permissions: string[] }[] }> = {
  '3': {
    name: 'User-3',
    email: 'user3@yopmail.com',
    role: '',
    clients: [],
  },
  '2': {
    name: 'User-2',
    email: 'user2@yopmail.com',
    role: '',
    clients: [],
  },
  '1': {
    name: 'User-1',
    email: 'user1@yopmail.com',
    role: 'Agency Admin',
    clients: [
      { id: '1', name: 'client-1', initials: 'C', color: 'bg-primary', roleId: 'viewer', roleName: 'Viewer', permissions: ['Analyze'] },
    ],
  },
};

const AgencyUserManagePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const user = usersData[userId || ''] || usersData['1'];
  const [editingClient, setEditingClient] = useState<typeof user.clients[0] | null>(null);
  const [showAddClient, setShowAddClient] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [addClientDropdownOpen, setAddClientDropdownOpen] = useState(false);
  const [addClientSelected, setAddClientSelected] = useState<typeof mockClients[0] | null>(null);
  const [addClientSearch, setAddClientSearch] = useState('');

  const handleEditOpen = (client: typeof user.clients[0]) => {
    setEditingClient(client);
    setSelectedRole(client.roleId);
    setSelectedPermissions([...client.permissions]);
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

  const filteredClients = mockClients.filter(c =>
    !addClientSearch || c.name.toLowerCase().includes(addClientSearch.toLowerCase())
  );

  const openAddClient = () => {
    setShowAddClient(true);
    setSelectedRole('');
    setSelectedPermissions([]);
    setAddClientSelected(null);
    setAddClientSearch('');
  };

  return (
    <AgencyLayout title="Manage">
      {/* Back + User Info */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/agency/team')} className="p-2 hover:bg-muted rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      {/* Role Badge */}
      {user.role && (
        <div className="mb-6">
          <span className="text-sm text-foreground border border-border rounded px-3 py-1">{user.role}</span>
        </div>
      )}

      {/* Client Access Section */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h3 className="text-sm font-bold text-foreground">Client Access (Auto-Saving)</h3>
          </div>
          <Button size="sm" onClick={openAddClient}>
            <Plus className="h-4 w-4" /> Add Client
          </Button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {['CLIENT', 'ROLE', 'EFFECTIVE PERMISSIONS', 'ACTIONS'].map(h => (
                <th key={h} className="text-left text-[11px] uppercase text-muted-foreground font-medium px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {user.clients.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-sm text-muted-foreground">No client access assigned</td>
              </tr>
            ) : (
              user.clients.map(c => (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg ${c.color} flex items-center justify-center text-xs font-bold text-white`}>{c.initials}</div>
                      <span className="text-sm font-medium text-foreground">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium px-2 py-0.5 rounded border border-green-200 bg-green-50 text-green-700">{c.roleName}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {permissionList.map(p => {
                        const active = c.permissions.includes(p);
                        const colors = permissionColors[p];
                        return (
                          <span key={p} className={`text-xs font-medium px-2 py-0.5 rounded border ${active ? colors.active : colors.inactive}`}>
                            {p}
                          </span>
                        );
                      })}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEditOpen(c)} className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"><Pencil className="h-4 w-4" /></button>
                      <button className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Client Role Modal */}
      {editingClient && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50" onClick={() => setEditingClient(null)}>
          <div className="w-[600px] bg-card border border-border rounded-2xl p-8 max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-foreground">Edit — {editingClient.name}</h2>
              <button onClick={() => setEditingClient(null)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>

            <div className="mb-6">
              <label className="text-sm font-semibold text-foreground mb-3 block">Assign Role <span className="text-primary">*</span></label>
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
            </div>

            {selectedRole && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-foreground">Permissions</label>
                </div>
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
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button variant="outline" onClick={() => setEditingClient(null)} className="px-8 flex-1">Cancel</Button>
              <Button className="px-8 flex-1">Save</Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Client Modal */}
      {showAddClient && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50" onClick={() => setShowAddClient(false)}>
          <div className="w-[600px] bg-card border border-border rounded-2xl p-8 max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-foreground">Add Client</h2>
              <button onClick={() => setShowAddClient(false)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>

            {/* Select Client Dropdown */}
            <div className="mb-6">
              <label className="text-sm font-semibold text-foreground mb-1.5 block">Select Client <span className="text-primary">*</span></label>
              <div className="relative">
                <button
                  onClick={() => setAddClientDropdownOpen(!addClientDropdownOpen)}
                  className="h-10 w-full px-4 border border-border rounded-lg bg-background text-sm flex items-center justify-between focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {addClientSelected ? (
                    <span className="text-foreground">{addClientSelected.name}</span>
                  ) : (
                    <span className="text-muted-foreground">Select a client...</span>
                  )}
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
                {addClientDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden">
                    <div className="p-2 border-b border-border">
                      <input
                        className="h-8 w-full px-3 border border-border rounded-lg bg-background text-sm placeholder:text-muted-foreground focus:outline-none"
                        placeholder="Search clients..."
                        value={addClientSearch}
                        onChange={e => setAddClientSearch(e.target.value)}
                        autoFocus
                      />
                    </div>
                    <div className="max-h-[200px] overflow-y-auto">
                      {filteredClients.map(c => (
                        <button
                          key={c.id}
                          onClick={() => { setAddClientSelected(c); setAddClientDropdownOpen(false); setAddClientSearch(''); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted/50 transition-colors text-left"
                        >
                          <div className={`w-7 h-7 rounded-lg ${c.color} flex items-center justify-center text-xs font-bold text-white`}>
                            {c.initials}
                          </div>
                          <span className="text-sm font-medium text-foreground">{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Role Cards */}
            <div className="mb-6">
              <label className="text-sm font-semibold text-foreground mb-3 block">Assign Role <span className="text-primary">*</span></label>
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
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button variant="outline" onClick={() => setShowAddClient(false)} className="px-8 flex-1">Cancel</Button>
              <Button className="px-8 flex-1">Add Client</Button>
            </div>
          </div>
        </div>
      )}
    </AgencyLayout>
  );
};

export default AgencyUserManagePage;
