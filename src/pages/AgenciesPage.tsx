import { useState } from "react";
import SuperAdminLayout from "@/components/layout/SuperAdminLayout";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown, ChevronRight, X, Plus, Building2 } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const agenciesData = [
  { id: 1, name: "Digital Spark Agency", email: "hello@digitalspark.io", orgs: 12, users: 87, plan: "Enterprise", status: "active" as const, created: "Dec 15, 2025", profilesUsed: 42, profilesMax: 50, organizations: [
    { name: "RetailCo", users: 14, status: "active" as const },
    { name: "FoodieHub", users: 8, status: "active" as const },
    { name: "TechStart", users: 22, status: "pending" as const },
  ]},
  { id: 2, name: "CreativeFlow Media", email: "team@creativeflow.co", orgs: 8, users: 45, plan: "Growth", status: "active" as const, created: "Jan 3, 2026", profilesUsed: 28, profilesMax: 50, organizations: [
    { name: "BrandX", users: 10, status: "active" as const },
  ]},
  { id: 3, name: "SocialPulse Inc", email: "admin@socialpulse.com", orgs: 3, users: 22, plan: "Starter", status: "suspended" as const, created: "Nov 20, 2025", profilesUsed: 8, profilesMax: 10, organizations: [] },
  { id: 4, name: "BrandWave Digital", email: "ops@brandwave.io", orgs: 15, users: 120, plan: "Enterprise", status: "active" as const, created: "Oct 1, 2025", profilesUsed: 47, profilesMax: 50, organizations: [
    { name: "AutoZone", users: 18, status: "active" as const },
    { name: "HomePlus", users: 12, status: "active" as const },
  ]},
];

const pendingInvites = [
  { name: "NextGen Digital", email: "hello@nextgen.io", plan: "Growth", sentDate: "Mar 20, 2026", expiry: "Apr 3, 2026", status: "invited" as const },
  { name: "ViralVibe Studio", email: "team@viralvibe.com", plan: "Starter", sentDate: "Mar 22, 2026", expiry: "Apr 5, 2026", status: "invited" as const },
];

const usageBarColor = (used: number, max: number) => {
  const pct = (used / max) * 100;
  if (pct > 85) return "bg-error";
  if (pct > 60) return "bg-warning";
  return "bg-success";
};

const statusTabs = ["all", "active", "suspended", "invited"] as const;

const AgenciesPage = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
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
      {/* Pending Invitations */}
      {pendingInvites.length > 0 && (
        <Collapsible className="mb-6">
          <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors mb-2">
            <ChevronRight className="h-4 w-4 transition-transform data-[state=open]:rotate-90" />
            Pending Invitations ({pendingInvites.length})
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="card-surface">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {['Agency Name', 'Email', 'Plan', 'Sent', 'Expires', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left text-[11px] uppercase text-muted-foreground font-medium pb-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pendingInvites.map(inv => (
                    <tr key={inv.email} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="py-3 text-sm font-medium text-foreground">{inv.name}</td>
                      <td className="py-3 text-sm text-muted-foreground">{inv.email}</td>
                      <td className="py-3 text-sm text-muted-foreground">{inv.plan}</td>
                      <td className="py-3 text-sm text-muted-foreground">{inv.sentDate}</td>
                      <td className="py-3 text-sm text-muted-foreground">{inv.expiry}</td>
                      <td className="py-3"><StatusBadge status={inv.status} /></td>
                      <td className="py-3">
                        <button className="text-xs text-primary hover:underline mr-3">Resend</button>
                        <button className="text-xs text-muted-foreground hover:text-error">Revoke</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Top actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input className="input-dark pl-9 w-64" placeholder="Search agencies..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4" /> Invite Agency
        </Button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1 mb-4 border-b border-border">
        {statusTabs.map(tab => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
              statusFilter === tab
                ? 'text-primary border-primary'
                : 'text-muted-foreground border-transparent hover:text-foreground'
            }`}
          >
            {tab === 'all' ? 'All' : tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card-surface">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Building2 className="h-10 w-10 text-muted-foreground/40 mb-3" />
            <p className="text-sm font-medium text-foreground">No agencies yet</p>
            <button className="mt-3 text-sm text-primary hover:underline" onClick={() => setShowCreateModal(true)}>Invite your first agency</button>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {['', 'Agency Name', 'Contact Email', '# Orgs', '# Users', 'Plan', 'Profiles', 'Status', 'Created', 'Actions'].map(h => (
                    <th key={h} className="text-left text-[11px] uppercase text-muted-foreground font-medium pb-3 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <>
                    <tr key={a.id} className={`border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer ${a.status === 'suspended' ? 'border-l-[3px] border-l-error' : ''}`} onClick={() => setExpandedId(expandedId === a.id ? null : a.id)}>
                      <td className="py-3 w-8">
                        {a.organizations.length > 0 && (expandedId === a.id ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />)}
                      </td>
                      <td className="py-3 text-sm text-foreground font-medium">
                        <span className="inline-block w-2 h-2 rounded-full bg-agency mr-2" />{a.name}
                      </td>
                      <td className="py-3 text-sm text-muted-foreground">{a.email}</td>
                      <td className="py-3 text-sm text-muted-foreground">{a.orgs}</td>
                      <td className="py-3 text-sm text-muted-foreground">{a.users}</td>
                      <td className="py-3 text-sm text-muted-foreground">{a.plan}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div className={`h-full rounded-full ${usageBarColor(a.profilesUsed, a.profilesMax)}`} style={{ width: `${(a.profilesUsed / a.profilesMax) * 100}%` }} />
                          </div>
                          <span className="text-[11px] text-muted-foreground">{a.profilesUsed}/{a.profilesMax}</span>
                        </div>
                      </td>
                      <td className="py-3"><StatusBadge status={a.status} /></td>
                      <td className="py-3 text-sm text-muted-foreground">{a.created}</td>
                      <td className="py-3">
                        <button className="text-xs text-primary hover:underline mr-3" onClick={e => e.stopPropagation()}>View</button>
                        {a.status === 'active' ? (
                          <button className="text-xs text-muted-foreground hover:text-warning" onClick={e => e.stopPropagation()}>Suspend</button>
                        ) : (
                          <button className="text-xs text-muted-foreground hover:text-success" onClick={e => e.stopPropagation()}>Reactivate</button>
                        )}
                      </td>
                    </tr>
                    {expandedId === a.id && a.organizations.length > 0 && (
                      <tr key={`${a.id}-exp`}>
                        <td colSpan={10} className="py-0">
                          <div className="ml-10 py-3 border-b border-border/50">
                            {a.organizations.map(org => (
                              <div key={org.name} className="flex items-center gap-6 py-2 text-sm">
                                <span className="text-muted-foreground pl-4 border-l-2 border-border">{org.name}</span>
                                <span className="text-muted-foreground">{org.users} users</span>
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
              <span className="text-xs text-muted-foreground">Showing {filtered.length} of {agenciesData.length} agencies</span>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" disabled>Previous</Button>
                <Button variant="ghost" size="sm">Next</Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50" onClick={() => setShowCreateModal(false)}>
          <div className="w-[560px] bg-card border border-border rounded-xl p-8" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Invite New Agency</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Agency Name</label>
                <input className="input-dark" placeholder="Enter agency name" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Contact Email</label>
                <input className="input-dark" type="email" placeholder="contact@agency.com" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Contact Person Name</label>
                <input className="input-dark" placeholder="Full name" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Plan</label>
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
                      <div className="text-[11px] text-muted-foreground mt-1">{p.limits}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Notes (optional)</label>
                <textarea className="input-dark h-20 py-2 resize-none" placeholder="Any additional notes..." />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
              <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
              <Button>Send Invite</Button>
            </div>
          </div>
        </div>
      )}
    </SuperAdminLayout>
  );
};

export default AgenciesPage;
