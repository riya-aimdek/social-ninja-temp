import { useState } from "react";
import SuperAdminLayout from "@/components/layout/SuperAdminLayout";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown, ChevronRight, X, Plus } from "lucide-react";

const agenciesData = [
  { id: 1, name: "Digital Spark Agency", email: "hello@digitalspark.io", orgs: 12, users: 87, plan: "Enterprise", status: "active" as const, created: "Dec 15, 2025", organizations: [
    { name: "RetailCo", users: 14, status: "active" as const },
    { name: "FoodieHub", users: 8, status: "active" as const },
    { name: "TechStart", users: 22, status: "pending" as const },
  ]},
  { id: 2, name: "CreativeFlow Media", email: "team@creativeflow.co", orgs: 8, users: 45, plan: "Growth", status: "active" as const, created: "Jan 3, 2026", organizations: [
    { name: "BrandX", users: 10, status: "active" as const },
  ]},
  { id: 3, name: "SocialPulse Inc", email: "admin@socialpulse.com", orgs: 3, users: 22, plan: "Starter", status: "suspended" as const, created: "Nov 20, 2025", organizations: [] },
  { id: 4, name: "BrandWave Digital", email: "ops@brandwave.io", orgs: 15, users: 120, plan: "Enterprise", status: "active" as const, created: "Oct 1, 2025", organizations: [
    { name: "AutoZone", users: 18, status: "active" as const },
    { name: "HomePlus", users: 12, status: "active" as const },
  ]},
];

const AgenciesPage = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');

  const filtered = agenciesData.filter(a => {
    if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    return true;
  });

  return (
    <SuperAdminLayout title="Agencies">
      {/* Top actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <input className="input-dark pl-9 w-64" placeholder="Search agencies..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="input-dark w-36" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4" /> Create Agency
        </Button>
      </div>

      {/* Table */}
      <div className="card-surface">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {['', 'Agency Name', 'Contact Email', '# Orgs', '# Users', 'Plan', 'Status', 'Created', 'Actions'].map(h => (
                <th key={h} className="text-left text-xs text-text-muted font-medium pb-3 pr-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <>
                <tr key={a.id} className="border-b border-border hover:bg-elevated transition-colors cursor-pointer" onClick={() => setExpandedId(expandedId === a.id ? null : a.id)}>
                  <td className="py-3 w-8">
                    {a.organizations.length > 0 && (expandedId === a.id ? <ChevronDown className="h-3.5 w-3.5 text-text-muted" /> : <ChevronRight className="h-3.5 w-3.5 text-text-muted" />)}
                  </td>
                  <td className="py-3 text-sm text-foreground font-medium">
                    <span className="inline-block w-2 h-2 rounded-full bg-agency mr-2" />{a.name}
                  </td>
                  <td className="py-3 text-sm text-text-secondary">{a.email}</td>
                  <td className="py-3 text-sm text-text-secondary">{a.orgs}</td>
                  <td className="py-3 text-sm text-text-secondary">{a.users}</td>
                  <td className="py-3 text-sm text-text-secondary">{a.plan}</td>
                  <td className="py-3"><StatusBadge status={a.status} /></td>
                  <td className="py-3 text-sm text-text-muted">{a.created}</td>
                  <td className="py-3">
                    <button className="text-xs text-primary hover:underline mr-3">View</button>
                    <button className="text-xs text-text-muted hover:text-warning">Suspend</button>
                  </td>
                </tr>
                {expandedId === a.id && a.organizations.length > 0 && (
                  <tr key={`${a.id}-exp`}>
                    <td colSpan={9} className="py-0">
                      <div className="ml-10 py-3 border-b border-border">
                        {a.organizations.map(org => (
                          <div key={org.name} className="flex items-center gap-6 py-2 text-sm">
                            <span className="text-text-secondary pl-4 border-l-2 border-border">{org.name}</span>
                            <span className="text-text-muted">{org.users} users</span>
                            <StatusBadge status={org.status} />
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <span className="text-xs text-text-muted">Showing {filtered.length} of {agenciesData.length} agencies</span>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" disabled>Previous</Button>
            <Button variant="ghost" size="sm">Next</Button>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50" onClick={() => setShowCreateModal(false)}>
          <div className="w-[560px] bg-elevated border border-border-hover rounded-2xl p-8" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Create New Agency</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-text-muted hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-text-secondary mb-1.5 block">Agency Name</label>
                <input className="input-dark" placeholder="Enter agency name" />
              </div>
              <div>
                <label className="text-sm text-text-secondary mb-1.5 block">Contact Email</label>
                <input className="input-dark" type="email" placeholder="contact@agency.com" />
              </div>
              <div>
                <label className="text-sm text-text-secondary mb-1.5 block">Contact Person Name</label>
                <input className="input-dark" placeholder="Full name" />
              </div>
              <div>
                <label className="text-sm text-text-secondary mb-1.5 block">Plan</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'starter', name: 'Starter', limits: '5 orgs · 20 users · 10 profiles' },
                    { id: 'growth', name: 'Growth', limits: '25 orgs · 100 users · 50 profiles' },
                    { id: 'enterprise', name: 'Enterprise', limits: 'Unlimited' },
                  ].map(p => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPlan(p.id)}
                      className={`p-3 rounded-lg border text-left transition-colors ${selectedPlan === p.id ? 'border-primary bg-primary/5' : 'border-border hover:border-border-hover'}`}
                    >
                      <div className="text-sm font-semibold text-foreground">{p.name}</div>
                      <div className="text-[11px] text-text-muted mt-1">{p.limits}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-text-secondary mb-1.5 block">Notes (optional)</label>
                <textarea className="input-dark h-20 py-2 resize-none" placeholder="Any additional notes..." />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
              <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
              <Button>Create & Send Invite</Button>
            </div>
          </div>
        </div>
      )}
    </SuperAdminLayout>
  );
};

export default AgenciesPage;
