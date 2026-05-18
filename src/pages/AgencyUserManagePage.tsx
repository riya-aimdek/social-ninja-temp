import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AgencyLayout from "@/components/layout/AgencyLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Pencil, Trash2, Check, X, ChevronDown, Sparkles } from "lucide-react";
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

const mockClients = [
  { id: "1", name: "client-1",  initials: "C",  color: "bg-primary" },
  { id: "2", name: "Acme Corp", initials: "AC", color: "bg-violet-500" },
];

const usersData: Record<string, {
  name: string; email: string; role: string; initials: string;
  clients: { id: string; name: string; initials: string; color: string; roleId: string; roleName: string; permissions: string[] }[];
}> = {
  "1": {
    name: "Sarah Kim", email: "sarah@agency.com", role: "Agency Admin", initials: "SK",
    clients: [
      { id: "1", name: "client-1", initials: "C", color: "bg-primary", roleId: "client-admin", roleName: "Client Admin", permissions: ["Connect", "Create", "Publish", "Approve", "Analyze", "Engage", "Listen", "Boost"] },
    ],
  },
  "2": {
    name: "James Lee", email: "james@agency.com", role: "Content Creator", initials: "JL",
    clients: [],
  },
  "3": {
    name: "Priya Mehta", email: "priya@agency.com", role: "Account Manager", initials: "PM",
    clients: [],
  },
  "4": {
    name: "Alex Chen", email: "alex@agency.com", role: "Social Manager", initials: "AC",
    clients: [],
  },
  "5": {
    name: "Maria Lopez", email: "maria@agency.com", role: "Content Creator", initials: "ML",
    clients: [],
  },
  "6": {
    name: "Tom Wilson", email: "tom@agency.com", role: "Approver", initials: "TW",
    clients: [],
  },
};

const AgencyUserManagePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const user = usersData[userId ?? ""] ?? usersData["1"];

  const [editingClient, setEditingClient]         = useState<typeof user.clients[0] | null>(null);
  const [showAddClient, setShowAddClient]         = useState(false);
  const [selectedRole, setSelectedRole]           = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [addClientDropdownOpen, setAddClientDropdownOpen] = useState(false);
  const [addClientSelected, setAddClientSelected] = useState<typeof mockClients[0] | null>(null);
  const [addClientSearch, setAddClientSearch]     = useState("");

  const handleEditOpen = (c: typeof user.clients[0]) => {
    setEditingClient(c);
    setSelectedRole(c.roleId);
    setSelectedPermissions([...c.permissions]);
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

  const openAddClient = () => {
    setShowAddClient(true);
    setSelectedRole("");
    setSelectedPermissions([]);
    setAddClientSelected(null);
    setAddClientSearch("");
  };

  const filteredClients = mockClients.filter(c =>
    !addClientSearch || c.name.toLowerCase().includes(addClientSearch.toLowerCase())
  );

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
    <AgencyLayout title="Manage">

      {/* ── User identity header ── */}
      <div className="bg-card border border-border rounded-2xl flex items-center gap-4 px-5 py-4 mb-6">
        <button
          onClick={() => navigate("/agency/team")}
          className="w-9 h-9 flex items-center justify-center rounded-xl border border-border hover:bg-muted transition-colors shrink-0"
        >
          <ArrowLeft className="h-4 w-4 text-muted-foreground" />
        </button>
        <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold shrink-0">
          {user.initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base font-semibold text-foreground">{user.name}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        {user.role && (
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 shrink-0">
            {user.role}
          </span>
        )}
      </div>

      {/* ── Client access table ── */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Client Access</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Changes are saved automatically.</p>
          </div>
          <button
            onClick={openAddClient}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" /> Add Client
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["CLIENT", "ROLE", "PERMISSIONS", "ACTIONS"].map(h => (
                  <th key={h} className="text-left text-[11px] uppercase tracking-wide text-muted-foreground font-medium px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {user.clients.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-14 text-sm text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <Plus className="h-5 w-5 text-muted-foreground/50" />
                      </div>
                      No client access assigned yet
                    </div>
                  </td>
                </tr>
              ) : (
                user.clients.map(c => (
                  <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0", c.color)}>
                          {c.initials}
                        </div>
                        <span className="text-sm font-medium text-foreground">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-violet-50 text-violet-700 border border-violet-200">
                        {c.roleName.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {c.permissions.map(p => (
                          <span key={p} className={cn("text-[11px] font-medium px-2 py-0.5 rounded border", permissionColors[p] ?? "bg-muted text-muted-foreground border-border")}>
                            {p}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleEditOpen(c)} className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground" title="Edit">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-destructive" title="Remove">
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
      </div>

      {/* ── Edit Client Modal ── */}
      {editingClient && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setEditingClient(null)}>
          <div className="w-[600px] bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-auto animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <h2 className="text-base font-bold text-foreground">Edit — {editingClient.name}</h2>
              <button onClick={() => setEditingClient(null)} className="text-muted-foreground hover:text-foreground transition-colors">
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
              <Button variant="outline" onClick={() => setEditingClient(null)} className="flex-1 h-11 rounded-xl">Cancel</Button>
              <Button onClick={() => setEditingClient(null)} className="flex-1 h-11 rounded-xl">Save Changes</Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Client Modal ── */}
      {showAddClient && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowAddClient(false)}>
          <div className="w-[600px] bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-auto animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <h2 className="text-base font-bold text-foreground">Add Client</h2>
              <button onClick={() => setShowAddClient(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-6">
              {/* Select Client */}
              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">Select Client <span className="text-primary">*</span></label>
                <div className="relative">
                  <button
                    onClick={() => setAddClientDropdownOpen(!addClientDropdownOpen)}
                    className="h-11 w-full px-4 border border-border rounded-xl bg-background text-sm flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  >
                    {addClientSelected
                      ? <span className="text-foreground font-medium">{addClientSelected.name}</span>
                      : <span className="text-muted-foreground">Select a client...</span>
                    }
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                  {addClientDropdownOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden">
                      <div className="p-2 border-b border-border">
                        <input
                          className="h-9 w-full px-3 border border-border rounded-lg bg-background text-sm placeholder:text-muted-foreground focus:outline-none"
                          placeholder="Search clients..."
                          value={addClientSearch}
                          onChange={e => setAddClientSearch(e.target.value)}
                          autoFocus
                        />
                      </div>
                      <div className="max-h-[200px] overflow-y-auto py-1">
                        {filteredClients.map(c => (
                          <button
                            key={c.id}
                            onClick={() => { setAddClientSelected(c); setAddClientDropdownOpen(false); setAddClientSearch(""); }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted/50 transition-colors text-left"
                          >
                            <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0", c.color)}>
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
              <Button variant="outline" onClick={() => setShowAddClient(false)} className="flex-1 h-11 rounded-xl">Cancel</Button>
              <Button onClick={() => setShowAddClient(false)} className="flex-1 h-11 rounded-xl">Add Client</Button>
            </div>
          </div>
        </div>
      )}
    </AgencyLayout>
  );
};

export default AgencyUserManagePage;
