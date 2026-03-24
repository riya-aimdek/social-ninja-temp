import { useState } from "react";
import AgencyLayout from "@/components/layout/AgencyLayout";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Search, LayoutGrid, List, ExternalLink, MoreHorizontal, X, Plus, Upload } from "lucide-react";

const orgs = [
  { id: '1', name: 'RetailCo', initials: 'RC', color: 'bg-organization', industry: 'Retail', profiles: 8, members: 4, approvals: 2, status: 'active' as const, lastActive: '2 hrs ago' },
  { id: '2', name: 'TechStart', initials: 'TS', color: 'bg-info', industry: 'Technology', profiles: 12, members: 6, approvals: 0, status: 'active' as const, lastActive: '30 min ago' },
  { id: '3', name: 'FoodieHub', initials: 'FH', color: 'bg-warning', industry: 'Food & Beverage', profiles: 5, members: 3, approvals: 5, status: 'active' as const, lastActive: '1 day ago' },
  { id: '4', name: 'HealthPlus', initials: 'HP', color: 'bg-success', industry: 'Healthcare', profiles: 3, members: 2, approvals: 1, status: 'suspended' as const, lastActive: '5 days ago' },
];

const OrganizationsPage = () => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  const filtered = orgs.filter(o => !search || o.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <AgencyLayout title="Organizations">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input className="input-dark pl-9 w-64" placeholder="Search organizations..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="input-dark w-32"><option>All Status</option><option>Active</option><option>Suspended</option></select>
          <select className="input-dark w-36"><option>Sort by: Recent</option><option>Sort by: Name</option><option>Sort by: Members</option></select>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setView('grid')} className={`p-2 rounded-lg ${view === 'grid' ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}><LayoutGrid className="h-4 w-4" /></button>
          <button onClick={() => setView('list')} className={`p-2 rounded-lg ${view === 'list' ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}><List className="h-4 w-4" /></button>
          <Button onClick={() => setShowCreate(true)} className="ml-2"><Plus className="h-4 w-4" /> Add Organization</Button>
        </div>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-3 gap-4">
          {filtered.map(org => (
            <div key={org.id} className="card-surface hover:border-primary/30 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-full ${org.color} flex items-center justify-center text-xs font-bold text-white`}>{org.initials}</div>
                <div>
                  <p className="text-base font-semibold text-foreground">{org.name}</p>
                  <span className="text-[11px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{org.industry}</span>
                </div>
              </div>
              <div className="flex gap-4 text-xs text-muted-foreground mb-3">
                <span>{org.profiles} profiles</span>
                <span>{org.members} members</span>
                <span>{org.approvals} pending</span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <StatusBadge status={org.status} />
                <span className="text-xs text-muted-foreground">{org.lastActive}</span>
              </div>
              <div className="flex items-center gap-2 pt-3 border-t border-border">
                <a href={`https://social-ninja.lovable.app?org=${org.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-primary hover:underline">
                  <ExternalLink className="h-3 w-3" /> Open in SocialNinja
                </a>
                <button className="ml-auto text-muted-foreground hover:text-foreground"><MoreHorizontal className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card-surface">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {['Org Name', 'Industry', 'Profiles', 'Members', 'Pending', 'Status', 'Last Active', 'Actions'].map(h => (
                  <th key={h} className="text-left text-xs text-muted-foreground font-medium pb-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(org => (
                <tr key={org.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="py-3 text-sm font-medium text-foreground">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full ${org.color} flex items-center justify-center text-[10px] font-bold text-white`}>{org.initials}</div>
                      {org.name}
                    </div>
                  </td>
                  <td className="py-3 text-sm text-muted-foreground">{org.industry}</td>
                  <td className="py-3 text-sm text-muted-foreground">{org.profiles}</td>
                  <td className="py-3 text-sm text-muted-foreground">{org.members}</td>
                  <td className="py-3 text-sm text-muted-foreground">{org.approvals}</td>
                  <td className="py-3"><StatusBadge status={org.status} /></td>
                  <td className="py-3 text-sm text-muted-foreground">{org.lastActive}</td>
                  <td className="py-3"><button className="text-xs text-primary hover:underline">View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50" onClick={() => setShowCreate(false)}>
          <div className="w-[560px] bg-card border border-border rounded-2xl p-8" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Add Organization</h2>
              <button onClick={() => setShowCreate(false)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-20 h-20 border-2 border-dashed border-border rounded-xl flex items-center justify-center shrink-0 hover:border-primary cursor-pointer">
                  <Upload className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">Organization Name</label>
                    <input className="input-dark" placeholder="Enter name" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">Industry</label>
                    <select className="input-dark"><option>Select industry</option><option>Retail</option><option>Technology</option><option>Healthcare</option></select>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Website URL</label>
                <input className="input-dark" placeholder="https://" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Notes</label>
                <textarea className="input-dark h-20 py-2 resize-none" placeholder="Additional notes..." />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
              <Button variant="secondary" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button>Create Organization</Button>
            </div>
          </div>
        </div>
      )}
    </AgencyLayout>
  );
};

export default OrganizationsPage;
