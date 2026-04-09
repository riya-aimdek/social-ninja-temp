import { useState } from "react";
import { Link } from "react-router-dom";
import AgencyLayout from "@/components/layout/AgencyLayout";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Search, X, Plus, Building2, CheckCircle, XCircle, Users, FolderOpen, Pencil, Power, Trash2 } from "lucide-react";

const initialClients = [
  { id: '1', name: 'xyzee', initials: 'X', color: 'bg-primary', owner: '-', members: 0, status: 'active' as const, created: 'Apr 6, 2026' },
  { id: '2', name: 'Inactive Co', initials: 'IC', color: 'bg-muted-foreground', owner: '-', members: 0, status: 'suspended' as const, created: 'Mar 1, 2026' },
];

const OrganizationsPage = () => {
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [clients] = useState(initialClients);

  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.status === 'active').length;
  const inactiveClients = clients.filter(c => c.status === 'suspended').length;
  const totalMembers = clients.reduce((sum, c) => sum + c.members, 0);

  const filtered = clients.filter(c => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (activeTab === 'active' && c.status !== 'active') return false;
    if (activeTab === 'inactive' && c.status !== 'suspended') return false;
    return true;
  });

  const tabs = [
    { id: 'all', label: 'All', count: totalClients },
    { id: 'active', label: 'Active', count: activeClients },
    { id: 'inactive', label: 'Inactive', count: undefined },
  ];

  return (
    <AgencyLayout title="Businesses">
      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-card border border-border rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Total Businesses</p>
            <p className="text-2xl font-bold text-foreground mt-1">{totalClients}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
            <Building2 className="h-5 w-5 text-purple-600" />
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Active</p>
            <p className="text-2xl font-bold text-foreground mt-1">{activeClients}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Inactive</p>
            <p className="text-2xl font-bold text-foreground mt-1">{inactiveClients}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
            <XCircle className="h-5 w-5 text-red-500" />
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Total Members</p>
            <p className="text-2xl font-bold text-foreground mt-1">{totalMembers}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <Users className="h-5 w-5 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Search + Add Business */}
      <div className="flex items-center justify-between mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input className="h-10 pl-9 pr-4 w-[280px] border border-border rounded-lg bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Search businesses..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4" /> Add Business
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
              {tab.label}{tab.count !== undefined ? ` (${tab.count})` : ''}
            </button>
          ))}
        </div>

        {/* Table */}
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {['BUSINESS', 'OWNER', 'MEMBERS', 'STATUS', 'CREATED', 'ACTIONS'].map(h => (
                <th key={h} className="text-left text-[11px] uppercase text-muted-foreground font-medium px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-sm text-muted-foreground">No records found</td>
              </tr>
            ) : (
              filtered.map(c => (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg ${c.color} flex items-center justify-center text-xs font-bold text-white`}>{c.initials}</div>
                      <span className="text-sm font-medium text-foreground">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{c.owner}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Users className="h-3.5 w-3.5" /> {c.members}
                    </div>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{c.created}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"><FolderOpen className="h-4 w-4" /></button>
                      <button className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"><Pencil className="h-4 w-4" /></button>
                      <button className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"><Power className="h-4 w-4" /></button>
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

      {/* Add Business Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50" onClick={() => setShowCreate(false)}>
          <div className="w-[480px] bg-card border border-border rounded-2xl p-8" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-foreground">Add Business</h2>
              <button onClick={() => setShowCreate(false)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-5">
              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">Business Name <span className="text-primary">*</span></label>
                <input className="h-10 w-full px-4 border border-border rounded-lg bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Business organization name" />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">Description</label>
                <textarea className="w-full px-4 py-3 border border-border rounded-lg bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary h-24 resize-none" placeholder="Brief description of this client..." />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
              <Button variant="outline" onClick={() => setShowCreate(false)} className="px-8">CANCEL</Button>
              <Button className="px-8">CREATE BUSINESS</Button>
            </div>
          </div>
        </div>
      )}
    </AgencyLayout>
  );
};

export default OrganizationsPage;
