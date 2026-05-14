import { useState, useRef } from "react";
import { FolderOpen, CheckCircle2, XCircle, Search, Plus, Link2, Pencil, Power, Trash2, FileText, Users, Clock, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import StatusBadge from "@/components/StatusBadge";
import { projects as initialProjects, activeProjects, inactiveProjects, totalPosts } from "@/data/businessMockData";

type Project = typeof initialProjects[0];

export default function ClientProjectsPage() {
  const [allProjects, setAllProjects] = useState<Project[]>(initialProjects);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setLogoPreview(URL.createObjectURL(file));
  };

  const closeModal = () => {
    setShowModal(false);
    setNewProjectName("");
    setNewProjectDesc("");
    setLogoPreview(null);
  };

  const createProject = () => {
    if (!newProjectName.trim()) return;
    const newProj: Project = {
      id: `p${Date.now()}`, name: newProjectName.trim(),
      description: newProjectDesc.trim(), status: "Active",
      posts: 0, accounts: 0, members: 1,
    };
    setAllProjects(prev => [newProj, ...prev]);
    toast.success(`Project "${newProj.name}" created.`);
    closeModal();
  };

  // Edit modal state
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editLogo, setEditLogo] = useState<string | null>(null);
  const editLogoInputRef = useRef<HTMLInputElement>(null);

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setEditName(project.name);
    setEditDesc(project.description || "");
    setEditLogo(null);
  };

  const closeEditModal = () => {
    setEditingProject(null);
    setEditName("");
    setEditDesc("");
    setEditLogo(null);
  };

  const saveEdit = () => {
    if (!editingProject || !editName.trim()) return;
    setAllProjects(prev => prev.map(p =>
      p.id === editingProject.id ? { ...p, name: editName.trim(), description: editDesc.trim() } : p
    ));
    toast.success("Project updated.");
    closeEditModal();
  };

  const toggleStatus = (id: string) => {
    setAllProjects(prev => prev.map(p =>
      p.id === id ? { ...p, status: p.status === "Active" ? "Inactive" : "Active" } : p
    ));
  };

  const deleteProject = (id: string) => {
    setAllProjects(prev => prev.filter(p => p.id !== id));
    toast.success("Project deleted.");
  };

  const handleEditLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setEditLogo(URL.createObjectURL(file));
  };

  const projects = allProjects;
  const filtered = allProjects.filter(p => {
    if (activeTab === "active" && p.status !== "Active") return false;
    if (activeTab === "inactive" && p.status !== "Inactive") return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const tabs = [
    { key: "all", label: "All", count: allProjects.length },
    { key: "active", label: "Active", count: allProjects.filter(p => p.status === "Active").length },
    { key: "inactive", label: "Inactive", count: allProjects.filter(p => p.status === "Inactive").length },
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
                        <button className="p-1.5 hover:bg-accent rounded-lg transition-colors" title="Edit" onClick={() => openEditModal(project)}><Pencil className="w-4 h-4 text-muted-foreground" /></button>
                        <button aria-label="Toggle status" className="p-1.5 hover:bg-accent rounded-lg transition-colors" title="Toggle status" onClick={() => toggleStatus(project.id)}><Power className="w-4 h-4 text-muted-foreground" /></button>
                        <button aria-label="Delete project" className="p-1.5 hover:bg-accent rounded-lg transition-colors group/del" title="Delete" onClick={() => deleteProject(project.id)}><Trash2 className="w-4 h-4 text-muted-foreground group-hover/del:text-destructive transition-colors" /></button>
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={closeModal}>
          <div className="bg-white dark:bg-card rounded-2xl w-full max-w-md shadow-2xl flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            {/* Sticky Header */}
            <div className="flex items-center justify-between px-7 py-5 border-b border-border flex-shrink-0">
              <h3 className="text-lg font-semibold text-foreground">Create Project</h3>
              <button onClick={closeModal} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto flex-1 px-7 py-6 space-y-5">
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                  Project Name <span className="text-error">*</span>
                </label>
                <input
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:border-primary placeholder:text-muted-foreground/60"
                  placeholder="e.g. Acme Campaign"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                  Description
                </label>
                <input
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:border-primary placeholder:text-muted-foreground/60"
                  placeholder="Optional description"
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                  Project Logo
                </label>
                <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="w-full rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-colors py-8 flex flex-col items-center justify-center gap-2 bg-muted/20"
                >
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo preview" className="w-16 h-16 rounded-lg object-cover" />
                  ) : (
                    <>
                      <Upload className="w-5 h-5 text-muted-foreground" />
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Click to upload logo</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="flex items-center justify-end gap-4 px-7 py-5 border-t border-border flex-shrink-0">
              <button onClick={closeModal} className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors px-2">
                Cancel
              </button>
              <button
                onClick={createProject}
                disabled={!newProjectName.trim()}
                className="px-6 py-2.5 rounded-full bg-primary text-white text-[11px] font-semibold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {editingProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={closeEditModal}>
          <div className="bg-white dark:bg-card rounded-2xl w-full max-w-md shadow-2xl flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            {/* Sticky Header */}
            <div className="flex items-center justify-between px-7 py-5 border-b border-border flex-shrink-0">
              <h3 className="text-lg font-semibold text-foreground">Edit Project</h3>
              <button onClick={closeEditModal} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto flex-1 px-7 py-6 space-y-5">
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                  Project Name <span className="text-error">*</span>
                </label>
                <input
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:border-primary placeholder:text-muted-foreground/60"
                  placeholder="e.g. Acme Campaign"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                  Description
                </label>
                <input
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:border-primary placeholder:text-muted-foreground/60"
                  placeholder="Optional description"
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                  Project Logo
                </label>
                <input ref={editLogoInputRef} type="file" accept="image/*" className="hidden" onChange={handleEditLogoChange} />
                <button
                  type="button"
                  onClick={() => editLogoInputRef.current?.click()}
                  className="w-full rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-colors py-8 flex flex-col items-center justify-center gap-2 bg-muted/20"
                >
                  {editLogo ? (
                    <img src={editLogo} alt="Logo preview" className="w-16 h-16 rounded-lg object-cover" />
                  ) : (
                    <>
                      <Upload className="w-5 h-5 text-muted-foreground" />
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Click to upload logo</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="flex items-center justify-end gap-4 px-7 py-5 border-t border-border flex-shrink-0">
              <button onClick={closeEditModal} className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors px-2">
                Cancel
              </button>
              <button
                onClick={saveEdit}
                disabled={!editName.trim()}
                className="px-6 py-2.5 rounded-full bg-primary text-white text-[11px] font-semibold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
