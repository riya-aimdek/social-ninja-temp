import { useState } from "react";
import { Link } from "react-router-dom";
import AgencyLayout from "@/components/layout/AgencyLayout";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Search, X, Plus, Pencil, Trash2, RefreshCw, RotateCw, Users, UserCheck, UserPlus, Shield } from "lucide-react";

const permissionList = ['Engage', 'Listen', 'Boost', 'Analyze'];

const permissionColors: Record<string, string> = {
  Engage: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
  Listen: 'bg-blue-500/10 text-blue-700 border-blue-200',
  Boost: 'bg-destructive/10 text-destructive border-destructive/20',
  Analyze: 'bg-violet-500/10 text-violet-700 border-violet-200',
};

const initialUsers = [
  {
    id: '1', name: 'Sarah Kim', email: 'sarah@agency.com', avatar: 'SK',
    role: 'Agency Admin', permissions: ['Engage', 'Listen', 'Boost', 'Analyze'],
    status: 'active' as const, pending: false, clients: 3, lastActive: '2h ago',
  },
  {
    id: '2', name: 'James Lee', email: 'james@agency.com', avatar: 'JL',
    role: 'Content Creator', permissions: ['Engage', 'Analyze'],
    status: 'active' as const, pending: false, clients: 2, lastActive: '5h ago',
  },
  {
    id: '3', name: 'Priya Mehta', email: 'priya@agency.com', avatar: 'PM',
    role: 'Account Manager', permissions: ['Engage', 'Listen', 'Analyze'],
    status: 'active' as const, pending: false, clients: 3, lastActive: '1d ago',
  },
  {
    id: '4', name: 'Alex Chen', email: 'alex@agency.com', avatar: 'AC',
    role: 'Social Manager', permissions: ['Engage', 'Listen'],
    status: 'invited' as const, pending: true, clients: 0, lastActive: '—',
  },
  {
    id: '5', name: 'Maria Lopez', email: 'maria@agency.com', avatar: 'ML',
    role: 'Content Creator', permissions: ['Engage'],
    status: 'active' as const, pending: false, clients: 1, lastActive: '3h ago',
  },
  {
    id: '6', name: 'Tom Wilson', email: 'tom@agency.com', avatar: 'TW',
    role: 'Approver', permissions: ['Analyze'],
    status: 'active' as const, pending: false, clients: 2, lastActive: '4d ago',
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
      { id: 'business-admin', name: 'Client Admin', desc: "Manages one client's projects. Creates projects, adds social accounts, and invites client team members." },
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
  const [activeTab, setActiveTab] = useState('all');
  const [users] = useState(initialUsers);

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const pendingUsers = users.filter(u => u.pending).length;
  const uniqueRoles = new Set(users.map(u => u.role)).size;

  const filtered = users.filter(u => {
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    if (activeTab === 'active' && u.status !== 'active') return false;
    if (activeTab === 'pending' && !u.pending) return false;
    return true;
  });

  const tabs = [
    { id: 'all', label: 'All', count: totalUsers },
    { id: 'active', label: 'Active', count: activeUsers },
    { id: 'pending', label: 'Pending', count: pendingUsers },
  ];

  return (
    <AgencyLayout title="Users">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Users', value: totalUsers, icon: Users, iconBg: 'bg-primary/10', iconColor: 'text-primary' },
          { label: 'Active', value: activeUsers, icon: UserCheck, iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-600' },
          { label: 'Pending Invites', value: pendingUsers, icon: UserPlus, iconBg: 'bg-amber-500/10', iconColor: 'text-amber-600' },
          { label: 'Unique Roles', value: uniqueRoles, icon: Shield, iconBg: 'bg-violet-500/10', iconColor: 'text-violet-600' },
        ].map(card => (
          <div key={card.label} className="bg-card border border-border rounded-xl p-5 flex items-center justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <div>
              <p className="text-xs text-muted-foreground">{card.label}</p>
              <p className="text-2xl font-bold text-foreground mt-1 tabular-nums">{card.value}</p>
            </div>
            <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center`}>
              <card.icon className={`h-5 w-5 ${card.iconColor}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Search + Add User */}
      <div className="flex items-center justify-between mb-4">
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
        {/* Tabs */}
        <div className="flex items-center gap-1 px-4 border-b border-border">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab.id
                  ? 'text-primary border-primary'
                  : 'text-muted-foreground border-transparent hover:text-foreground'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {['USER', 'ROLE', 'PERMISSIONS', 'CLIENTS', 'LAST ACTIVE', 'STATUS', 'ACTIONS'].map(h => (
                  <th key={h} className="text-left text-[11px] uppercase text-muted-foreground font-medium px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-sm text-muted-foreground">
                    <Users className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
                    No users found
                  </td>
                </tr>
              ) : (
                filtered.map(u => (
                  <tr key={u.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-[11px] font-bold text-primary shrink-0">
                          {u.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{u.name}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-foreground">{u.role}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {u.permissions.map(p => (
                          <span key={p} className={`text-[11px] font-medium px-2 py-0.5 rounded border ${permissionColors[p] || 'bg-muted text-muted-foreground border-border'}`}>
                            {p}
                          </span>
                        ))}
                        {u.permissions.length === 0 && <span className="text-xs text-muted-foreground italic">No access</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground tabular-nums">{u.clients}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{u.lastActive}</td>
                    <td className="px-4 py-3"><StatusBadge status={u.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {u.pending ? (
                          <>
                            <button className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground" title="Resend invitation">
                              <RotateCw className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-[11px] font-medium text-amber-600 bg-amber-500/10 border border-amber-200 px-2 py-0.5 rounded">Pending</span>
                            <button className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-destructive" title="Remove"><Trash2 className="h-3.5 w-3.5" /></button>
                          </>
                        ) : (
                          <>
                            <Link to={`/agency/team/${u.id}/manage`} className="flex items-center gap-1 text-xs text-primary hover:underline font-medium whitespace-nowrap">
                              <RefreshCw className="h-3.5 w-3.5" /> Manage
                            </Link>
                            <button className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground" title="Edit"><Pencil className="h-3.5 w-3.5" /></button>
                            <button className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-destructive" title="Remove"><Trash2 className="h-3.5 w-3.5" /></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-border text-xs text-muted-foreground">
            Showing {filtered.length} of {totalUsers} users
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowAddUser(false)}>
          <div className="w-[600px] bg-card border border-border rounded-2xl p-8 max-h-[90vh] overflow-auto shadow-xl animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-foreground">Add User</h2>
              <button onClick={() => setShowAddUser(false)} className="text-muted-foreground hover:text-foreground transition-colors"><X className="h-5 w-5" /></button>
            </div>
            <hr className="border-border mb-6" />

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
