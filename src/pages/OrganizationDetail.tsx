import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import AgencyLayout from "@/components/layout/AgencyLayout";
import StatusBadge from "@/components/StatusBadge";
import RoleBadge from "@/components/RoleBadge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Users, Clock, BarChart3, ChevronRight, Plus, FolderKanban, Wifi, MoreHorizontal, X, Upload } from "lucide-react";

const tabs = ['Overview', 'Projects', 'Team Members', 'Settings'];

const metrics = [
  { label: "Projects", value: "3", icon: FolderKanban },
  { label: "Social Accounts", value: "8", icon: Wifi },
  { label: "Pending Approvals", value: "3", icon: Clock },
  { label: "Total Engagement", value: "12.4K", icon: BarChart3 },
];

const projects = [
  {
    id: 'p1', name: 'Acme Sneakers', status: 'active' as const, accounts: 4,
    socials: [
      { platform: 'Instagram', handle: '@acmesneakers', connected: true },
      { platform: 'Twitter/X', handle: '@acmesneakers', connected: true },
      { platform: 'TikTok', handle: '@acmesneakers', connected: true },
      { platform: 'Facebook', handle: 'AcmeSneakersPage', connected: false },
    ],
    members: 3, lastActive: '30 min ago'
  },
  {
    id: 'p2', name: 'Acme Apparel', status: 'active' as const, accounts: 3,
    socials: [
      { platform: 'Facebook', handle: 'AcmeApparelPage', connected: true },
      { platform: 'LinkedIn', handle: 'Acme-Apparel', connected: true },
      { platform: 'Instagram', handle: '@acmeapparel', connected: true },
    ],
    members: 2, lastActive: '2 hrs ago'
  },
  {
    id: 'p3', name: 'Acme Lifestyle Blog', status: 'active' as const, accounts: 1,
    socials: [
      { platform: 'Instagram', handle: '@acmelifestyle', connected: true },
    ],
    members: 1, lastActive: '1 day ago'
  },
];

const teamMembers = [
  { name: "Sarah Chen", avatar: "SC", role: "business-admin" as const, status: "active" as const, projects: ["Acme Sneakers", "Acme Apparel"] },
  { name: "James Wilson", avatar: "JW", role: "approver" as const, status: "active" as const, projects: ["Acme Sneakers"] },
  { name: "Priya Sharma", avatar: "PS", role: "social-media-manager" as const, status: "active" as const, projects: ["Acme Apparel", "Acme Lifestyle Blog"] },
  { name: "Guest User", avatar: "GU", role: "content-creator" as const, status: "pending" as const, projects: ["Acme Sneakers"] },
];

const activities = [
  { time: "30 min ago", text: "Sarah published 'Summer Sale Campaign' to Acme Sneakers Instagram" },
  { time: "2 hrs ago", text: "James approved 3 scheduled posts for Acme Apparel" },
  { time: "5 hrs ago", text: "New project 'Acme Lifestyle Blog' created" },
  { time: "1 day ago", text: "Priya generated monthly analytics report for Acme Apparel" },
];

const OrganizationDetail = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [showCreateProject, setShowCreateProject] = useState(false);

  return (
    <AgencyLayout title="">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link to="/agency/clients" className="hover:text-foreground">Businesses</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">Acme Corp</span>
      </div>

      {/* Identity Card */}
      <div className="card-surface flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">AC</div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Acme Corp</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs bg-warning/15 text-warning rounded-full px-2 py-0.5">Retail</span>
              <span className="text-xs text-muted-foreground">3 Projects · 8 Social Accounts</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setShowCreateProject(true)}>
            <Plus className="h-4 w-4" /> New Project
          </Button>
          <a href="https://social-ninja.lovable.app?org=1" target="_blank" rel="noopener noreferrer">
            <Button><ExternalLink className="h-4 w-4" /> Open in SocialNinja</Button>
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-border mb-6">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm transition-colors ${activeTab === tab ? 'text-foreground border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'Overview' && (
        <>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {metrics.map(m => (
              <div key={m.label} className="card-surface flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10"><m.icon className="h-5 w-5 text-primary" /></div>
                <div>
                  <p className="text-xs text-muted-foreground">{m.label}</p>
                  <p className="text-xl font-semibold text-foreground">{m.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Projects Summary */}
          <div className="card-surface mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Projects</h3>
              <button onClick={() => setActiveTab('Projects')} className="text-xs text-primary hover:underline">View all</button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {projects.map(p => (
                <div key={p.id} className="border border-border rounded-xl p-4 hover:border-primary/30 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-foreground">{p.name}</p>
                    <StatusBadge status={p.status} />
                  </div>
                  <div className="flex gap-3 text-xs text-muted-foreground">
                    <span>{p.accounts} accounts</span>
                    <span>{p.members} members</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-surface">
            <h3 className="text-sm font-semibold text-foreground mb-4">Recent Activity</h3>
            {activities.map((a, i) => (
              <div key={i} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
                <span className="text-xs text-muted-foreground w-24 shrink-0">{a.time}</span>
                <span className="text-sm text-muted-foreground">{a.text}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Projects Tab */}
      {activeTab === 'Projects' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{projects.length} projects</p>
            <Button onClick={() => setShowCreateProject(true)}><Plus className="h-4 w-4" /> New Project</Button>
          </div>
          {projects.map(p => (
            <div key={p.id} className="card-surface">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10"><FolderKanban className="h-5 w-5 text-primary" /></div>
                  <div>
                    <p className="text-base font-semibold text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.accounts} social accounts · {p.members} members · Last active {p.lastActive}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={p.status} />
                  <button className="text-muted-foreground hover:text-foreground"><MoreHorizontal className="h-4 w-4" /></button>
                </div>
              </div>
              <div className="border-t border-border pt-3">
                <p className="text-xs font-medium text-muted-foreground mb-2">Connected Accounts</p>
                <div className="flex flex-wrap gap-2">
                  {p.socials.map(s => (
                    <div key={s.handle} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-xs">
                      <span className={`w-1.5 h-1.5 rounded-full ${s.connected ? 'bg-success' : 'bg-warning'}`} />
                      <span className="font-medium text-foreground">{s.platform}</span>
                      <span className="text-muted-foreground">{s.handle}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Team Members Tab */}
      {activeTab === 'Team Members' && (
        <div className="card-surface">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Team Members</h3>
            <Button size="sm">Invite Member</Button>
          </div>
          <table className="w-full">
            <thead><tr className="border-b border-border">
              <th className="text-left text-xs text-muted-foreground font-medium pb-3">Name</th>
              <th className="text-left text-xs text-muted-foreground font-medium pb-3">Role</th>
              <th className="text-left text-xs text-muted-foreground font-medium pb-3">Assigned Projects</th>
              <th className="text-left text-xs text-muted-foreground font-medium pb-3">Status</th>
              <th className="text-right text-xs text-muted-foreground font-medium pb-3">Actions</th>
            </tr></thead>
            <tbody>
              {teamMembers.map(m => (
                <tr key={m.name} className="border-b border-border last:border-0 hover:bg-muted/50">
                  <td className="py-3"><div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-semibold text-primary">{m.avatar}</div>
                    <span className="text-sm text-foreground">{m.name}</span>
                  </div></td>
                  <td className="py-3"><RoleBadge role={m.role} /></td>
                  <td className="py-3">
                    <div className="flex gap-1 flex-wrap">
                      {m.projects.map(p => <span key={p} className="text-[11px] bg-muted text-muted-foreground rounded px-2 py-0.5">{p}</span>)}
                    </div>
                  </td>
                  <td className="py-3"><StatusBadge status={m.status} /></td>
                  <td className="py-3 text-right">
                    <button className="text-xs text-primary hover:underline mr-3">Edit</button>
                    <button className="text-xs text-muted-foreground hover:text-destructive">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'Settings' && (
        <div className="space-y-6">
          <div className="card-surface space-y-4">
            <div><label className="text-sm text-muted-foreground mb-1.5 block">Business Name</label><input className="input-dark" defaultValue="Acme Corp" /></div>
            <div><label className="text-sm text-muted-foreground mb-1.5 block">Industry</label><input className="input-dark" defaultValue="Retail" /></div>
            <div><label className="text-sm text-muted-foreground mb-1.5 block">Website</label><input className="input-dark" defaultValue="https://acmecorp.com" /></div>
            <div><label className="text-sm text-muted-foreground mb-1.5 block">Notes</label><textarea className="input-dark h-20 py-2 resize-none" /></div>
            <Button>Save Changes</Button>
          </div>
          <div className="card-surface border-destructive/30">
            <h3 className="text-sm font-semibold text-foreground mb-3">Danger Zone</h3>
            <div className="flex gap-3">
              <Button variant="outline" className="border-warning text-warning hover:bg-warning/10">Suspend Business</Button>
              <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10">Delete Business</Button>
            </div>
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateProject && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50" onClick={() => setShowCreateProject(false)}>
          <div className="w-[560px] bg-card border border-border rounded-2xl p-8" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Create Project</h2>
              <button onClick={() => setShowCreateProject(false)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Project Name</label>
                <input className="input-dark" placeholder="e.g., Acme Sneakers" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Description</label>
                <textarea className="input-dark h-20 py-2 resize-none" placeholder="What is this project for?" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Assign Team Members</label>
                <p className="text-xs text-muted-foreground">You can assign members after creating the project.</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
              <Button variant="secondary" onClick={() => setShowCreateProject(false)}>Cancel</Button>
              <Button>Create Project</Button>
            </div>
          </div>
        </div>
      )}
    </AgencyLayout>
  );
};

export default OrganizationDetail;
