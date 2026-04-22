import { useState } from "react";
import { Link } from "react-router-dom";
import AgencyLayout from "@/components/layout/AgencyLayout";
import StatusBadge from "@/components/StatusBadge";
import ClientLogo from "@/components/ClientLogo";
import { Button } from "@/components/ui/button";
import { Search, X, Plus, Building2, CheckCircle, XCircle, Users, FolderOpen, Pencil, Power, Trash2, RefreshCw, TrendingUp, Globe, BarChart3 } from "lucide-react";

const initialClients = [
  { id: '1', name: 'Acme Corp', initials: 'A', color: 'bg-primary', owner: 'Sarah K.', members: 4, status: 'active' as const, created: 'Apr 13, 2026', projects: 3, posts: 142, socials: 5 },
  { id: '2', name: 'TechStart', initials: 'T', color: 'bg-blue-500', owner: 'James L.', members: 3, status: 'active' as const, created: 'Mar 28, 2026', projects: 2, posts: 89, socials: 4 },
  { id: '3', name: 'FreshBrew', initials: 'F', color: 'bg-emerald-500', owner: 'Priya M.', members: 2, status: 'active' as const, created: 'Mar 15, 2026', projects: 1, posts: 67, socials: 3 },
  { id: '4', name: 'StyleHaus', initials: 'S', color: 'bg-amber-500', owner: '—', members: 0, status: 'pending' as const, created: 'Apr 10, 2026', projects: 0, posts: 0, socials: 0 },
  { id: '5', name: 'GreenLeaf Co', initials: 'G', color: 'bg-emerald-600', owner: 'Sarah K.', members: 3, status: 'active' as const, created: 'Feb 20, 2026', projects: 2, posts: 54, socials: 3 },
  { id: '6', name: 'PixelForge', initials: 'P', color: 'bg-violet-500', owner: 'James L.', members: 2, status: 'active' as const, created: 'Jan 12, 2026', projects: 1, posts: 38, socials: 2 },
  { id: '7', name: 'NovaBrand', initials: 'N', color: 'bg-sky-500', owner: 'Priya M.', members: 1, status: 'active' as const, created: 'Feb 5, 2026', projects: 1, posts: 22, socials: 2 },
  { id: '8', name: 'Dormant LLC', initials: 'D', color: 'bg-muted-foreground', owner: '—', members: 0, status: 'suspended' as const, created: 'Dec 1, 2025', projects: 0, posts: 0, socials: 0 },
];

const OrganizationsPage = () => {
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [clients] = useState(initialClients);

  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.status === 'active').length;
  const pendingClients = clients.filter(c => c.status === 'pending').length;
  const inactiveClients = clients.filter(c => c.status === 'suspended').length;
  const totalMembers = clients.reduce((sum, c) => sum + c.members, 0);
  const totalPosts = clients.reduce((sum, c) => sum + c.posts, 0);

  const filtered = clients.filter(c => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (activeTab === 'active' && c.status !== 'active') return false;
    if (activeTab === 'pending' && c.status !== 'pending') return false;
    if (activeTab === 'inactive' && c.status !== 'suspended') return false;
    return true;
  });

  const tabs = [
    { id: 'all', label: 'All', count: totalClients },
    { id: 'active', label: 'Active', count: activeClients },
    { id: 'pending', label: 'Pending', count: pendingClients },
    { id: 'inactive', label: 'Inactive', count: inactiveClients },
  ];

  return (
    <AgencyLayout title="Clients">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Clients', value: totalClients, icon: Building2, iconBg: 'bg-primary/10', iconColor: 'text-primary' },
          { label: 'Active', value: activeClients, icon: CheckCircle, iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-600' },
          { label: 'Inactive / Suspended', value: inactiveClients, icon: XCircle, iconBg: 'bg-destructive/10', iconColor: 'text-destructive' },
          { label: 'Total Members', value: totalMembers, icon: Users, iconBg: 'bg-blue-500/10', iconColor: 'text-blue-600' },
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

      {/* Search + Add Client */}
      <div className="flex items-center justify-between mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input className="h-10 pl-9 pr-4 w-[280px] border border-border rounded-lg bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Search clients..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4" /> Add Client
        </Button>
      </div>

      {/* Table Card */}
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

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {['CLIENT', 'OWNER', 'MEMBERS', 'PROJECTS', 'POSTS', 'SOCIALS', 'STATUS', 'CREATED', 'ACTIONS'].map(h => (
                  <th key={h} className="text-left text-[11px] uppercase text-muted-foreground font-medium px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-sm text-muted-foreground">
                    <Building2 className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
                    No clients found
                  </td>
                </tr>
              ) : (
                filtered.map(c => (
                  <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <ClientLogo name={c.name} color={c.color} size="sm" rounded="lg" />
                        <span className="text-sm font-medium text-foreground">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{c.owner}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Users className="h-3.5 w-3.5" /> {c.members}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <FolderOpen className="h-3.5 w-3.5" /> {c.projects}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-foreground tabular-nums">{c.posts}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Globe className="h-3.5 w-3.5" /> {c.socials}
                      </div>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                    <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">{c.created}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Link to={`/agency/clients/${c.id}/team`} className="flex items-center gap-1 text-xs text-primary hover:underline font-medium whitespace-nowrap">
                          <RefreshCw className="h-3.5 w-3.5" /> Manage
                        </Link>
                        <button className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground" title="Edit"><Pencil className="h-3.5 w-3.5" /></button>
                        <button className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground" title={c.status === 'suspended' ? 'Activate' : 'Suspend'}><Power className="h-3.5 w-3.5" /></button>
                        <button className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-destructive" title="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-border text-xs text-muted-foreground flex items-center justify-between">
            <span>Showing {filtered.length} of {totalClients} clients</span>
            <span className="flex items-center gap-1"><BarChart3 className="h-3 w-3" /> {totalPosts} total posts</span>
          </div>
        )}
      </div>

      {/* Add Client Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowCreate(false)}>
          <div className="w-[480px] bg-card border border-border rounded-2xl p-8 shadow-xl animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-foreground">Add Client</h2>
              <button onClick={() => setShowCreate(false)} className="text-muted-foreground hover:text-foreground transition-colors"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-5">
              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">Client Name <span className="text-primary">*</span></label>
                <input className="h-10 w-full px-4 border border-border rounded-lg bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Client organization name" />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">Description</label>
                <textarea className="w-full px-4 py-3 border border-border rounded-lg bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary h-24 resize-none" placeholder="Brief description of this client..." />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
              <Button variant="outline" onClick={() => setShowCreate(false)} className="px-8">CANCEL</Button>
              <Button className="px-8">CREATE CLIENT</Button>
            </div>
          </div>
        </div>
      )}
    </AgencyLayout>
  );
};

export default OrganizationsPage;
