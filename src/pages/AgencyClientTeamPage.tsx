import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AgencyLayout from "@/components/layout/AgencyLayout";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Search, X, Plus, Pencil, Trash2, Check, ChevronDown, Sparkles, ArrowLeft, Users } from "lucide-react";
import { toast } from "sonner";
import { rolesForScope, defaultPermissionsFor, PERMISSIONS } from "@/data/roles";
import { cn } from "@/lib/utils";

const permissionList = [...PERMISSIONS] as string[];

const permissionColors: Record<string, string> = {
  Connect: "bg-sky-50 text-sky-700 border-sky-200",
  Create:  "bg-violet-50 text-violet-700 border-violet-200",
  Publish: "bg-blue-50 text-blue-700 border-blue-200",
  Approve: "bg-amber-50 text-amber-700 border-amber-200",
  Analyze: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Engage:  "bg-green-50 text-green-700 border-green-200",
  Listen:  "bg-cyan-50 text-cyan-700 border-cyan-200",
  Boost:   "bg-red-50 text-red-600 border-red-200",
  ORM:     "bg-purple-50 text-purple-700 border-purple-200",
};

const roleCards = rolesForScope("client").map((r) => ({
  id: r.id,
  name: r.name,
  desc: r.desc,
  tags: r.tags,
}));

const mockAgencyUsers = [
  { id: "1", name: "Sarah Kim",   email: "sarah@agency.com",  initials: "SK" },
  { id: "2", name: "James Lee",   email: "james@agency.com",  initials: "JL" },
  { id: "3", name: "Priya Mehta", email: "priya@agency.com",  initials: "PM" },
  { id: "5", name: "Maria Lopez", email: "maria@agency.com",  initials: "ML" },
  { id: "6", name: "Tom Wilson",  email: "tom@agency.com",    initials: "TW" },
];

const clientsData: Record<string, { name: string; initials: string; color: string }> = {
  "1": { name: "client-1",  initials: "C",  color: "bg-primary"     },
  "2": { name: "Acme Corp", initials: "AC", color: "bg-violet-500"  },
};

const initialMembers = [
  {
    id: "1", name: "Riya Shah", email: "riya.shah@aimdek.com", initials: "RS",
    role: "Client Admin", roleId: "client-admin",
    permissions: ["Connect", "Create", "Publish", "Approve", "Analyze", "Engage", "Listen", "Boost"],
    status: "active" as const,
  },
];

const AgencyClientTeamPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const client = clientsData[id ?? "1"] ?? clientsData["1"];

  const [search, setSearch]   = useState("");
  const [members]             = useState(initialMembers);
  const [showAddUser, setShowAddUser]   = useState(false);
  const [editUser,   setEditUser]       = useState<typeof initialMembers[0] | null>(null);
  const [selectedRole,        setSelectedRole]        = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [userDropdownOpen,    setUserDropdownOpen]    = useState(false);
  const [selectedUser,        setSelectedUser]        = useState<typeof mockAgencyUsers[0] | null>(null);
  const [userSearch,          setUserSearch]          = useState("");

  const filtered = members.filter(u =>
    !search ||
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const filteredAgencyUsers = mockAgencyUsers.filter(u =>
    !userSearch ||
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
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

  const openAddUser = () => {
    setShowAddUser(true);
    setSelectedRole("");
    setSelectedPermissions([]);
    setSelectedUser(null);
    setUserSearch("");
  };

  /* ── Shared role picker ── */
  const RolePicker = () => (
    <div className="grid grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
      {roleCards.map(r => {
        const active = selectedRole === r.id;
        return (
          <button
            key={r.id}
            onClick={() => handleRoleSelect(r.id)}
            className={cn(
              "p-4 rounded-xl border text-left transition-all",
              active ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-muted-foreground/50",
            )}
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <span className={cn("text-sm font-semibold leading-tight", active ? "text-primary" : "text-foreground")}>{r.name}</span>
              <div className={cn("w-5 h-5 rounded-full shrink-0 flex items-center justify-center mt-0.5", active ? "bg-primary" : "border-2 border-border")}>
                {active && <Check className="h-3 w-3 text-white" />}
              </div>
            </div>
            {r.tags && r.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-1.5">
                {r.tags.map(t => (
                  <span key={t} className={cn("inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded", t === "New" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>
                    {t === "New" && <Sparkles className="h-2.5 w-2.5" />}{t}
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

  /* ── Shared permission picker ── */
  const PermissionPicker = () => (
    <div className="grid grid-cols-2 gap-2.5">
      {permissionList.map(perm => {
        const active = selectedPermissions.includes(perm);
        return (
          <button
            key={perm}
            onClick={() => togglePermission(perm)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all",
              active ? "border-primary/30 bg-primary/5" : "border-border hover:border-muted-foreground/40",
            )}
          >
            <div className={cn("w-5 h-5 rounded-md shrink-0 flex items-center justify-center", active ? "bg-primary" : "border-2 border-border")}>
              {active && <Check className="h-3 w-3 text-white" />}
            </div>
            <span className={cn("text-sm font-medium", active ? "text-foreground" : "text-muted-foreground")}>{perm}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <AgencyLayout title="Team">

      {/* ── Client identity header ── */}
      <div className="bg-card border border-border rounded-2xl flex items-center gap-4 px-5 py-4 mb-6">
        <button
          onClick={() => navigate("/agency/clients")}
          className="w-9 h-9 flex items-center justify-center rounded-xl border border-border hover:bg-muted transition-colors shrink-0"
        >
          <ArrowLeft className="h-4 w-4 text-muted-foreground" />
        </button>
        <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0", client.color)}>
          {client.initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base font-semibold text-foreground">{client.name}</p>
          <p className="text-sm text-muted-foreground">Users assigned to this client</p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 shrink-0">
          <Users className="h-3.5 w-3.5" /> {members.length} member{members.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Team table ── */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h3 className="text-sm font-semibold text-foreground">{client.name} — Team</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Manage roles and permissions for this client.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                className="h-9 pl-9 pr-4 w-[220px] border border-border rounded-xl bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="Search users..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button
              onClick={openAddUser}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" /> Add Users
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["NAME", "ROLE", "PERMISSIONS", "STATUS", "ACTIONS"].map(h => (
                  <th key={h} className="text-left text-[11px] uppercase tracking-wide text-muted-foreground font-medium px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-14 text-sm text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <Users className="h-5 w-5 text-muted-foreground/50" />
                      </div>
                      No users assigned to this client yet
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map(u => (
                  <tr key={u.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-[11px] font-bold text-primary shrink-0">
                          {u.initials}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{u.name}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-violet-50 text-violet-700 border border-violet-200">
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {u.permissions.map(p => (
                          <span key={p} className={cn("text-[11px] font-medium px-2 py-0.5 rounded border", permissionColors[p] ?? "bg-muted text-muted-foreground border-border")}>
                            {p}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={u.status} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleEditOpen(u)} className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground" title="Edit">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => toast.success(`${u.name} removed.`)} className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-destructive" title="Remove">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-border text-xs text-muted-foreground">
            Showing {filtered.length} of {members.length} member{members.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* ── Edit User Modal ── */}
      {editUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setEditUser(null)}>
          <div className="w-[600px] bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-auto animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <h2 className="text-base font-bold text-foreground">Edit — {editUser.name}</h2>
              <button onClick={() => setEditUser(null)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-6">
              <div>
                <label className="text-sm font-semibold text-foreground mb-3 block">Assign Role <span className="text-primary">*</span></label>
                <RolePicker />
              </div>
              {selectedRole && (
                <div>
                  <label className="text-sm font-semibold text-foreground mb-3 block">Permissions</label>
                  <PermissionPicker />
                </div>
              )}
            </div>

            <div className="flex gap-3 px-6 py-4 border-t border-border">
              <Button variant="outline" onClick={() => setEditUser(null)} className="flex-1 h-11 rounded-xl">Cancel</Button>
              <Button onClick={() => { toast.success("Role saved."); setEditUser(null); }} className="flex-1 h-11 rounded-xl">Save Changes</Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Users Modal ── */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowAddUser(false)}>
          <div className="w-[600px] bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-auto animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <h2 className="text-base font-bold text-foreground">Add Users</h2>
              <button onClick={() => setShowAddUser(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-6">
              {/* Select User */}
              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">Select User <span className="text-primary">*</span></label>
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="h-11 w-full px-4 border border-border rounded-xl bg-background text-sm flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  >
                    {selectedUser
                      ? <span className="text-foreground font-medium">{selectedUser.name} ({selectedUser.email})</span>
                      : <span className="text-muted-foreground">Search agency users...</span>
                    }
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                  {userDropdownOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden">
                      <div className="p-2 border-b border-border">
                        <input
                          className="h-9 w-full px-3 border border-border rounded-lg bg-background text-sm placeholder:text-muted-foreground focus:outline-none"
                          placeholder="Search agency users..."
                          value={userSearch}
                          onChange={e => setUserSearch(e.target.value)}
                          autoFocus
                        />
                      </div>
                      <div className="max-h-[200px] overflow-y-auto py-1">
                        {filteredAgencyUsers.map(u => (
                          <button
                            key={u.id}
                            onClick={() => { setSelectedUser(u); setUserDropdownOpen(false); setUserSearch(""); }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-colors text-left"
                          >
                            <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                              {u.initials}
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

              {/* Role */}
              <div>
                <label className="text-sm font-semibold text-foreground mb-3 block">Assign Role <span className="text-primary">*</span></label>
                <RolePicker />
              </div>

              {/* Permissions */}
              {selectedRole && (
                <div>
                  <label className="text-sm font-semibold text-foreground mb-3 block">Permissions</label>
                  <PermissionPicker />
                </div>
              )}
            </div>

            <div className="flex gap-3 px-6 py-4 border-t border-border">
              <Button variant="outline" onClick={() => setShowAddUser(false)} className="flex-1 h-11 rounded-xl">Cancel</Button>
              <Button onClick={() => { toast.success("User added to client team."); setShowAddUser(false); }} className="flex-1 h-11 rounded-xl">Add User</Button>
            </div>
          </div>
        </div>
      )}
    </AgencyLayout>
  );
};

export default AgencyClientTeamPage;
