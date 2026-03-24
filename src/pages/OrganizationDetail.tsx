import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import AgencyLayout from "@/components/layout/AgencyLayout";
import StatusBadge from "@/components/StatusBadge";
import RoleBadge from "@/components/RoleBadge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Wifi, Users, Clock, BarChart3, ChevronRight } from "lucide-react";

const tabs = ['Overview', 'Team Members', 'Social Profiles', 'Settings'];

const metrics = [
  { label: "Social Profiles", value: "8", icon: Wifi },
  { label: "Posts This Month", value: "142", icon: BarChart3 },
  { label: "Pending Approvals", value: "3", icon: Clock },
  { label: "Total Engagement", value: "12.4K", icon: Users },
];

const teamMembers = [
  { name: "Sarah Chen", avatar: "SC", role: "content-creator" as const, status: "active" as const },
  { name: "James Wilson", avatar: "JW", role: "approver" as const, status: "active" as const },
  { name: "Priya Sharma", avatar: "PS", role: "analyst" as const, status: "active" as const },
  { name: "Guest User", avatar: "GU", role: "guest" as const, status: "pending" as const },
];

const socialProfiles = [
  { platform: "Instagram", name: "@retailco_official", status: "connected" },
  { platform: "Twitter/X", name: "@RetailCo", status: "connected" },
  { platform: "Facebook", name: "RetailCo Page", status: "connected" },
  { platform: "LinkedIn", name: "RetailCo Inc.", status: "reconnect" },
];

const activities = [
  { time: "2 hrs ago", text: "Sarah published 'Summer Sale Campaign' post" },
  { time: "5 hrs ago", text: "James approved 3 scheduled posts" },
  { time: "1 day ago", text: "New Instagram story draft created" },
  { time: "2 days ago", text: "Priya generated monthly analytics report" },
];

const OrganizationDetail = () => {
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <AgencyLayout title="">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-text-secondary mb-4">
        <Link to="/agency/organizations" className="hover:text-foreground">Organizations</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">RetailCo</span>
      </div>

      {/* Identity Card */}
      <div className="card-surface flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-organization flex items-center justify-center text-lg font-bold text-foreground">RC</div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">RetailCo</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs bg-warning/15 text-warning rounded-full px-2 py-0.5">Retail</span>
              <span className="text-xs bg-elevated text-text-secondary rounded-full px-2 py-0.5">E-commerce</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <a href="https://social-ninja.lovable.app?org=1" target="_blank" rel="noopener noreferrer">
            <Button><ExternalLink className="h-4 w-4" /> Open in SocialNinja</Button>
          </a>
          <p className="text-xs text-text-muted mt-2">Last synced: 10 min ago</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-border mb-6">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm transition-colors ${activeTab === tab ? 'text-foreground border-b-2 border-primary' : 'text-text-secondary hover:text-foreground'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'Overview' && (
        <>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {metrics.map(m => (
              <div key={m.label} className="card-surface flex items-center gap-3">
                <div className="p-2 rounded-lg bg-elevated"><m.icon className="h-5 w-5 text-primary" /></div>
                <div>
                  <p className="text-xs text-text-secondary">{m.label}</p>
                  <p className="text-xl font-semibold text-foreground">{m.value}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="card-surface">
            <h3 className="text-sm font-semibold text-foreground mb-4">Recent Activity</h3>
            {activities.map((a, i) => (
              <div key={i} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
                <span className="text-xs text-text-muted w-20 shrink-0">{a.time}</span>
                <span className="text-sm text-text-secondary">{a.text}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'Team Members' && (
        <div className="card-surface">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Team Members</h3>
            <Button size="sm">Assign Team Member</Button>
          </div>
          <table className="w-full">
            <thead><tr className="border-b border-border">
              <th className="text-left text-xs text-text-muted font-medium pb-3">Name</th>
              <th className="text-left text-xs text-text-muted font-medium pb-3">Role</th>
              <th className="text-left text-xs text-text-muted font-medium pb-3">Status</th>
              <th className="text-right text-xs text-text-muted font-medium pb-3">Actions</th>
            </tr></thead>
            <tbody>
              {teamMembers.map(m => (
                <tr key={m.name} className="border-b border-border last:border-0 hover:bg-elevated">
                  <td className="py-3"><div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-elevated flex items-center justify-center text-[10px] font-semibold text-text-secondary">{m.avatar}</div>
                    <span className="text-sm text-foreground">{m.name}</span>
                  </div></td>
                  <td className="py-3"><RoleBadge role={m.role} /></td>
                  <td className="py-3"><StatusBadge status={m.status} /></td>
                  <td className="py-3 text-right">
                    <button className="text-xs text-primary hover:underline mr-3">Change Role</button>
                    <button className="text-xs text-text-muted hover:text-error">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'Social Profiles' && (
        <div className="card-surface">
          <p className="text-xs text-text-muted mb-4">Profiles: 4 of 50 total plan limit used</p>
          <div className="space-y-0">
            {socialProfiles.map(p => (
              <div key={p.name} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-elevated flex items-center justify-center text-xs font-semibold text-text-secondary">{p.platform[0]}</div>
                  <div>
                    <p className="text-sm text-foreground">{p.name}</p>
                    <p className="text-xs text-text-muted">{p.platform}</p>
                  </div>
                </div>
                <span className={`text-xs font-medium ${p.status === 'connected' ? 'text-success' : 'text-warning'}`}>
                  {p.status === 'connected' ? 'Connected' : 'Reconnect needed'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'Settings' && (
        <div className="space-y-6">
          <div className="card-surface space-y-4">
            <div><label className="text-sm text-text-secondary mb-1.5 block">Organization Name</label><input className="input-dark" defaultValue="RetailCo" /></div>
            <div><label className="text-sm text-text-secondary mb-1.5 block">Industry</label><input className="input-dark" defaultValue="Retail" /></div>
            <div><label className="text-sm text-text-secondary mb-1.5 block">Website</label><input className="input-dark" defaultValue="https://retailco.com" /></div>
            <div><label className="text-sm text-text-secondary mb-1.5 block">Notes</label><textarea className="input-dark h-20 py-2 resize-none" /></div>
            <Button>Save Changes</Button>
          </div>
          <div className="card-surface border-error/30">
            <h3 className="text-sm font-semibold text-foreground mb-3">Danger Zone</h3>
            <div className="flex gap-3">
              <Button variant="outline" className="border-warning text-warning hover:bg-warning/10">Archive Organization</Button>
              <Button variant="outline" className="border-error text-error hover:bg-error/10">Delete Organization</Button>
            </div>
          </div>
        </div>
      )}
    </AgencyLayout>
  );
};

export default OrganizationDetail;
