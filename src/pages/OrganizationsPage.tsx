import { useState } from "react";
import { Link } from "react-router-dom";
import AgencyLayout from "@/components/layout/AgencyLayout";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Search, LayoutGrid, List, ExternalLink, MoreHorizontal, X, Plus, Upload, FolderKanban, ChevronRight } from "lucide-react";

const clients = [
  { id: '1', name: 'Acme Corp', initials: 'AC', color: 'bg-primary/80', industry: 'Retail', projects: 3, accounts: 8, members: 4, approvals: 2, status: 'active' as const, lastActive: '2 hrs ago' },
  { id: '2', name: 'Beta Foods', initials: 'BF', color: 'bg-info', industry: 'Food & Beverage', projects: 1, accounts: 5, members: 3, approvals: 5, status: 'active' as const, lastActive: '1 day ago' },
  { id: '3', name: 'TechStart', initials: 'TS', color: 'bg-warning', industry: 'Technology', projects: 2, accounts: 12, members: 6, approvals: 0, status: 'active' as const, lastActive: '30 min ago' },
  { id: '4', name: 'HealthPlus', initials: 'HP', color: 'bg-success', industry: 'Healthcare', projects: 1, accounts: 3, members: 2, approvals: 1, status: 'suspended' as const, lastActive: '5 days ago' },
];

const OrganizationsPage = () => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  const filtered = clients.filter(o => !search || o.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <AgencyLayout title="Clients">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input className="input-dark pl-9 w-64" placeholder="Search clients..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="input-dark w-32"><option>All Status</option><option>Active</option><option>Suspended</option></select>
          <select className="input-dark w-36"><option>Sort by: Recent</option><option>Sort by: Name</option><option>Sort by: Projects</option></select>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setView('grid')} className={`p-2 rounded-lg ${view === 'grid' ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}><LayoutGrid className="h-4 w-4" /></button>
          <button onClick={() => setView('list')} className={`p-2 rounded-lg ${view === 'list' ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}><List className="h-4 w-4" /></button>
          <Button onClick={() => setShowCreate(true)} className="ml-2"><Plus className="h-4 w-4" /> Add Client</Button>
        </div>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-3 gap-4">
          {filtered.map(c => (
            <Link key={c.id} to={`/agency/clients/${c.id}`} className="card-surface hover:border-primary/30 hover:shadow-md transition-all block">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-full ${c.color} flex items-center justify-center text-xs font-bold text-white`}>{c.initials}</div>
                <div>
                  <p className="text-base font-semibold text-foreground">{c.name}</p>
                  <span className="text-[11px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{c.industry}</span>
                </div>
              </div>
              <div className="flex gap-4 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1"><FolderKanban className="h-3 w-3" /> {c.projects} projects</span>
                <span>{c.accounts} accounts</span>
                <span>{c.members} members</span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <StatusBadge status={c.status} />
                <span className="text-xs text-muted-foreground">{c.lastActive}</span>
              </div>
              <div className="flex items-center gap-2 pt-3 border-t border-border">
                <span className="flex items-center gap-1.5 text-xs text-primary">
                  View Client <ChevronRight className="h-3 w-3" />
                </span>
                <button onClick={e => { e.preventDefault(); e.stopPropagation(); }} className="ml-auto text-muted-foreground hover:text-foreground"><MoreHorizontal className="h-4 w-4" /></button>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="card-surface">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {['Client', 'Industry', 'Projects', 'Accounts', 'Members', 'Status', 'Last Active', 'Actions'].map(h => (
                  <th key={h} className="text-left text-xs text-muted-foreground font-medium pb-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="py-3 text-sm font-medium text-foreground">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full ${c.color} flex items-center justify-center text-[10px] font-bold text-white`}>{c.initials}</div>
                      {c.name}
                    </div>
                  </td>
                  <td className="py-3 text-sm text-muted-foreground">{c.industry}</td>
                  <td className="py-3 text-sm text-muted-foreground">{c.projects}</td>
                  <td className="py-3 text-sm text-muted-foreground">{c.accounts}</td>
                  <td className="py-3 text-sm text-muted-foreground">{c.members}</td>
                  <td className="py-3"><StatusBadge status={c.status} /></td>
                  <td className="py-3 text-sm text-muted-foreground">{c.lastActive}</td>
                  <td className="py-3"><Link to={`/agency/clients/${c.id}`} className="text-xs text-primary hover:underline">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Client Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50" onClick={() => setShowCreate(false)}>
          <div className="w-[560px] bg-card border border-border rounded-2xl p-8" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Add Client</h2>
              <button onClick={() => setShowCreate(false)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-20 h-20 border-2 border-dashed border-border rounded-xl flex items-center justify-center shrink-0 hover:border-primary cursor-pointer">
                  <Upload className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">Client Name</label>
                    <input className="input-dark" placeholder="e.g., Acme Corp" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">Industry</label>
                    <select className="input-dark"><option>Select industry</option><option>Retail</option><option>Technology</option><option>Healthcare</option><option>Food & Beverage</option></select>
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
              <Button>Create Client</Button>
            </div>
          </div>
        </div>
      )}
    </AgencyLayout>
  );
};

export default OrganizationsPage;
