import { useState } from "react";
import { Search, Plus, X, Check, Pencil, Trash2, Users, UserCheck, UserPlus, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/StatusBadge";
import { toast } from "sonner";
import {
  teamMembers as initialMembers,
  permissionList, defaultPermissions, permissionColors, roleCards,
} from "@/data/businessMockData";

export default function ClientTeamPage() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [manageUser, setManageUser] = useState<typeof initialMembers[0] | null>(null);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [members, setMembers] = useState(initialMembers);
  const [activeTab, setActiveTab] = useState<"all" | "active" | "pending">("all");

  const filtered = members.filter(u => {
    if (activeTab === "active" && u.status !== "active") return false;
    if (activeTab === "pending" && u.status !== "pending") return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const allCount = members.length;
  const activeCount = members.filter(u => u.status === "active").length;
  const pendingCount = members.filter(u => u.status === "pending").length;

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

  const statCards = [
    { label: "Total Members", value: members.length.toString(), sub: "+2 this month", icon: Users, iconBg: "bg-primary/10", iconColor: "text-primary" },
    { label: "Active", value: members.filter(m => m.status === "active").length.toString(), sub: "Currently active", icon: UserCheck, iconBg: "bg-emerald-500/10", iconColor: "text-emerald-600" },
    { label: "Invited", value: members.filter(m => m.status === "pending").length.toString(), sub: "Pending acceptance", icon: UserPlus, iconBg: "bg-amber-500/10", iconColor: "text-amber-600" },
    { label: "Roles in Use", value: new Set(members.map(m => m.roleId)).size.toString(), sub: "Across team", icon: Shield, iconBg: "bg-violet-500/10", iconColor: "text-violet-600" },
  ];

  const sendInvitation = () => {
    if (!inviteName.trim() || !inviteEmail.trim() || !selectedRole) return;
    const role = roleCards.find(r => r.id === selectedRole);
    const newMember = {
      id: `m${Date.now()}`,
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      avatar: inviteName.trim().split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2),
      role: role?.name || selectedRole,
      roleId: selectedRole,
      status: "pending" as const,
      permissions: selectedPermissions,
      projects: 0,
      lastActive: "Just invited",
    };
    setMembers(prev => [...prev, newMember]);
    toast.success(`Invitation sent to ${newMember.email}.`);
    setShowModal(false);
  };

  const saveManage = () => {
    if (!manageUser) return;
    const role = roleCards.find(r => r.id === selectedRole);
    setMembers(prev => prev.map(m =>
      m.id === manageUser.id ? { ...m, role: role?.name || m.role, roleId: selectedRole, permissions: selectedPermissions } : m
    ));
    toast.success("Member updated.");
    setManageUser(null);
  };

  const deleteMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    toast.success("Member removed.");
  };

  const RoleCardsGrid = () => (
    <div className="grid grid-cols-2 gap-3">
      {roleCards.map(r => {
        const active = selectedRole === r.id;
        return (
          <button
            key={r.id}
            onClick={() => handleRoleSelect(r.id)}
            className={`p-4 rounded-xl border text-left transition-all ${active ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-muted-foreground bg-background"}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <span className={`text-sm font-bold ${active ? "text-primary" : "text-foreground"}`}>{r.name}</span>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1">{r.desc}</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${active ? "border-primary bg-primary" : "border-muted-foreground/40"}`}>
                {active && <Check className="h-3 w-3 text-white" />}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );

  const PermissionsGrid = () => {
    const roleDefaults = defaultPermissions[selectedRole] || [];
    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-bold text-foreground">Permissions</label>
          <span className="text-xs text-muted-foreground">Click to grant extra or revoke defaults</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {permissionList.map(perm => {
            const isDefault = roleDefaults.includes(perm);
            const isChecked = selectedPermissions.includes(perm);
            const isExtra = isChecked && !isDefault;
            const isRevoked = !isChecked && isDefault;
            return (
              <button
                key={perm}
                onClick={() => togglePermission(perm)}
                className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-muted-foreground bg-background transition-all"
              >
                <div className={`w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-colors ${isChecked ? "bg-primary border-primary" : "border-muted-foreground/40"}`}>
                  {isChecked && <Check className="h-3 w-3 text-white" />}
                </div>
                <span className={`text-sm font-medium flex-1 text-left ${isRevoked ? "line-through text-muted-foreground" : "text-foreground"}`}>{perm}</span>
                {isExtra && <span className="text-[10px] font-semibold text-emerald-600">+extra</span>}
                {isRevoked && <span className="text-[10px] font-semibold text-error">revoked</span>}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-2.5">
          <span className="text-emerald-600 font-semibold">+extra</span> = added beyond role &nbsp;·&nbsp; <span className="text-error font-semibold line-through">revoked</span> = removed from role default
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="bg-card rounded-xl border border-border p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${card.iconBg}`}><card.icon className={`w-4 h-4 ${card.iconColor}`} /></div>
              <span className="text-xs text-muted-foreground">{card.sub}</span>
            </div>
            <p className="text-2xl font-bold text-foreground tabular-nums">{card.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Search + Invite */}
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input className="h-10 pl-9 pr-4 w-[280px] border border-border rounded-lg bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Search team members..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button onClick={openInvite} className="gap-2"><Plus className="w-4 h-4" /> Invite User</Button>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-border px-5">
          <div className="flex gap-6">
            {([
              { key: "all", label: "All", count: allCount },
              { key: "active", label: "Active", count: activeCount },
              { key: "pending", label: "Pending", count: pendingCount },
            ] as const).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 ${activeTab === tab.key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
              >
                {tab.label}
                <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-full min-w-[20px] text-center ${activeTab === tab.key ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground uppercase tracking-wider border-b border-border">
                <th className="px-5 py-3 font-medium">Member</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Permissions</th>
                <th className="px-5 py-3 font-medium">Projects</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Last Active</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-muted-foreground">No records found</td></tr>
              ) : (
                filtered.map(u => (
                  <tr key={u.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-[11px] font-bold text-primary">{u.avatar}</div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{u.name}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3"><span className="text-sm text-foreground border border-border rounded px-2 py-0.5">{u.role}</span></td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {u.permissions.map(p => (
                          <span key={p} className={`text-xs font-medium px-2 py-0.5 rounded border ${permissionColors[p] || 'bg-muted text-muted-foreground border-border'}`}>{p}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-foreground tabular-nums">{u.projects}</td>
                    <td className="px-5 py-3"><StatusBadge status={u.status} /></td>
                    <td className="px-5 py-3 text-sm text-muted-foreground">{u.lastActive}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button aria-label="Edit member" onClick={() => openManage(u)} className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"><Pencil className="h-4 w-4" /></button>
                        <button aria-label="Remove member" onClick={() => deleteMember(u.id)} className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-border text-sm text-muted-foreground">Showing 1-{filtered.length} of {filtered.length} results</div>
        )}
      </div>

      {/* Invite User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-2xl bg-white dark:bg-card rounded-2xl shadow-2xl flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            {/* Sticky Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-border flex-shrink-0">
              <h2 className="text-lg font-semibold text-foreground">Invite User</h2>
              <button onClick={() => setShowModal(false)} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-muted-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto flex-1 px-8 py-6">
              {/* Name + Email */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    Full Name <span className="text-error">*</span>
                  </label>
                  <input
                    className="h-10 w-full px-4 border border-border rounded-lg bg-background text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary"
                    placeholder="Jane Doe"
                    value={inviteName}
                    onChange={e => setInviteName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    Email Address <span className="text-error">*</span>
                  </label>
                  <input
                    className="h-10 w-full px-4 border border-border rounded-lg bg-background text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary"
                    placeholder="jane@company.com"
                    type="email"
                    value={inviteEmail}
                    onChange={e => setInviteEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Assign Role */}
              <div className="mb-6">
                <label className="text-sm font-bold text-foreground mb-3 block">
                  Assign Role <span className="text-error">*</span>
                </label>
                <RoleCardsGrid />
              </div>

              {/* Permissions (shown when role selected) */}
              {selectedRole && <PermissionsGrid />}
            </div>

            {/* Sticky Footer */}
            <div className="flex items-center justify-end gap-4 px-8 py-5 border-t border-border flex-shrink-0">
              <button
                onClick={() => setShowModal(false)}
                className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors px-2"
              >
                Cancel
              </button>
              <button
                onClick={sendInvitation}
                disabled={!inviteName.trim() || !inviteEmail.trim() || !selectedRole}
                className="px-8 py-2.5 rounded-full bg-primary text-white text-[11px] font-semibold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
              >
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage User Modal */}
      {manageUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setManageUser(null)}>
          <div className="w-full max-w-2xl bg-white dark:bg-card rounded-2xl shadow-2xl flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            {/* Sticky Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-border flex-shrink-0">
              <h2 className="text-lg font-semibold text-foreground">Manage — {manageUser.name}</h2>
              <button onClick={() => setManageUser(null)} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-muted-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto flex-1 px-8 py-6">
              <div className="mb-6">
                <label className="text-sm font-bold text-foreground mb-3 block">Assign Role <span className="text-error">*</span></label>
                <RoleCardsGrid />
              </div>
              {selectedRole && <PermissionsGrid />}
            </div>

            {/* Sticky Footer */}
            <div className="flex items-center justify-end gap-4 px-8 py-5 border-t border-border flex-shrink-0">
              <button
                onClick={() => setManageUser(null)}
                className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors px-2"
              >
                Cancel
              </button>
              <button
                onClick={saveManage}
                className="px-8 py-2.5 rounded-full bg-primary text-white text-[11px] font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
