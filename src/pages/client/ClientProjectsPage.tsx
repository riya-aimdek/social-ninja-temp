import { useState } from "react";
import { FolderOpen, CheckCircle2, XCircle, Search, Plus, Link2, Pencil, Power, Trash2, FileText, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/StatusBadge";
import { projects, activeProjects, inactiveProjects, totalPosts } from "@/data/businessMockData";

export default function ClientProjectsPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");

  const filtered = projects.filter(p => {
    if (activeTab === "active" && p.status !== "Active") return false;
    if (activeTab === "inactive" && p.status !== "Inactive") return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const tabs = [
    { key: "all", label: "All", count: projects.length },
    { key: "active", label: "Active", count: activeProjects.length },
    { key: "inactive", label: "Inactive", count: inactiveProjects.length },
  ];

  const statCards = [
    { label: "Total Projects", value: projects.length.toString(), sub: `${activeProjects.length} active`, icon: FolderOpen, iconBg: "bg-primary/10", iconColor: "text-primary" },
    { label: "Active Projects", value: activeProjects.length.toString(), sub: "+1 this week", icon: CheckCircle2, iconBg: "bg-emerald-500/10", iconColor: "text-emerald-600" },
    { label: "Total Posts", value: totalPosts.toString(), sub: "Across all projects", icon: FileText, iconBg: "bg-blue-500/10", iconColor: "text-blue-600" },
    { label: "Inactive Projects", value: inactiveProjects.length.toString(), sub: "Archived", icon: XCircle, iconBg: "bg-muted", iconColor: "text-muted-foreground" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="bg-card rounded-xl border border-border p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${card.iconBg}`}>
                <card.icon className={`w-4 h-4 ${card.iconColor}`} />
              </div>
              <span className="text-xs text-muted-foreground">{card.sub}</span>
            </div>
            <p className="text-2xl font-bold text-foreground tabular-nums">{card.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Search + New Project */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2 w-72">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input className="text-sm outline-none bg-transparent w-full placeholder:text-muted-foreground" placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button onClick={() => setShowModal(true)} className="gap-2"><Plus className="w-4 h-4" /> New Project</Button>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="border-b border-border px-5">
          <div className="flex gap-6">
            {tabs.map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground uppercase tracking-wider border-b border-border">
                <th className="px-5 py-3 font-medium">Project</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Posts</th>
                <th className="px-5 py-3 font-medium">Accounts</th>
                <th className="px-5 py-3 font-medium">Members</th>
                <th className="px-5 py-3 font-medium">Last Active</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-muted-foreground">No records found</td></tr>
              ) : (
                filtered.map((project) => (
                  <tr key={project.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center"><FolderOpen className="w-4 h-4 text-primary" /></div>
                        <div>
                          <span className="font-medium text-foreground">{project.name}</span>
                          <p className="text-[11px] text-muted-foreground mt-0.5">{project.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3"><StatusBadge status={project.status === "Active" ? "active" : "suspended"} /></td>
                    <td className="px-5 py-3"><div className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-muted-foreground" /><span className="text-foreground tabular-nums">{project.posts}</span></div></td>
                    <td className="px-5 py-3"><div className="flex items-center gap-1.5"><Link2 className="w-3.5 h-3.5 text-muted-foreground" /><span className="text-foreground tabular-nums">{project.accounts}</span></div></td>
                    <td className="px-5 py-3"><div className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-muted-foreground" /><span className="text-foreground tabular-nums">{project.members}</span></div></td>
                    <td className="px-5 py-3"><div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-muted-foreground" /><span className="text-muted-foreground">{project.lastActive}</span></div></td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button className="p-1.5 hover:bg-accent rounded-lg transition-colors" title="Connect accounts"><Link2 className="w-4 h-4 text-muted-foreground" /></button>
                        <button className="p-1.5 hover:bg-accent rounded-lg transition-colors" title="Edit"><Pencil className="w-4 h-4 text-muted-foreground" /></button>
                        <button className="p-1.5 hover:bg-accent rounded-lg transition-colors" title="Toggle status"><Power className="w-4 h-4 text-muted-foreground" /></button>
                        <button className="p-1.5 hover:bg-accent rounded-lg transition-colors" title="Delete"><Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" /></button>
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

      {/* New Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-card rounded-2xl border border-border p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-foreground mb-4">Create New Project</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Project Name *</label>
                <input className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:border-primary" placeholder="Enter project name" value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Description</label>
                <textarea className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:border-primary resize-none" rows={3} placeholder="What is this project about? (Optional)" value={newProjectDesc} onChange={(e) => setNewProjectDesc(e.target.value)} />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button onClick={() => setShowModal(false)} disabled={!newProjectName.trim()}>Create Project</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
