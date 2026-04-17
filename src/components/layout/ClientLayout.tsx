import { useState } from "react";
import { Outlet, useLocation, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, FolderOpen, Users, Link2, Sparkles, CalendarDays, MessageSquare,
  BarChart3, Megaphone, Ear, Settings, Search, Bell, ChevronDown, ChevronUp,
  LogOut, Globe, Palette
} from "lucide-react";
import SocialNinjaLogo from "@/components/SocialNinjaLogo";

const mockClients = [
  { id: "c1", name: "Sans", initial: "S" },
  { id: "c2", name: "Acme Corp", initial: "A" },
];

const mockProjectsByClient: Record<string, { id: string; name: string }[]> = {
  c1: [
    { id: "p1", name: "123" },
    { id: "p2", name: "Website Redesign" },
  ],
  c2: [
    { id: "p3", name: "Social Campaign" },
  ],
};

// Client-level nav (no project selected)
const clientNavItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/client/dashboard" },
  { label: "Projects", icon: FolderOpen, path: "/client/projects" },
  { label: "Team", icon: Users, path: "/client/team" },
];

// Project-level nav (project selected)
const projectNavItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/client/project/dashboard" },
  { label: "Team", icon: Users, path: "/client/project/team" },
  { label: "Social Profiles", icon: Globe, path: "/client/connect" },
  { label: "Create", icon: Sparkles, path: "/client/create" },
  { label: "Publish", icon: CalendarDays, path: "/client/publish" },
  { label: "Engage", icon: MessageSquare, path: "/client/engage" },
  { label: "Analyze", icon: BarChart3, path: "/client/analyze" },
  { label: "Promote", icon: Megaphone, path: "/client/promote" },
  { label: "Listen", icon: Ear, path: "/client/listen" },
  { label: "Settings", icon: Settings, path: "/client/settings" },
  { label: "Customization", icon: Palette, path: "/client/customization" },
];

export default function ClientLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedClient, setSelectedClient] = useState(mockClients[0]);
  const [selectedProject, setSelectedProject] = useState<{ id: string; name: string } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const clientProjects = mockProjectsByClient[selectedClient.id] || [];
  const navItems = selectedProject ? projectNavItems : clientNavItems;

  const handleSelectClient = (client: typeof mockClients[0]) => {
    setSelectedClient(client);
    setSelectedProject(null);
    setDropdownOpen(false);
    navigate("/client/dashboard");
  };

  const handleSelectProject = (project: { id: string; name: string }) => {
    setSelectedProject(project);
    setDropdownOpen(false);
    navigate("/client/project/dashboard");
  };

  const handleBackToClient = () => {
    setSelectedProject(null);
    navigate("/client/dashboard");
  };

  // Breadcrumb
  const currentNav = navItems.find(n => location.pathname === n.path || location.pathname.startsWith(n.path + "/"));
  const breadcrumbLabel = currentNav?.label || "Dashboard";

  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans">
      {/* Sidebar */}
      <aside className="w-[220px] bg-sidebar flex flex-col flex-shrink-0 border-r border-sidebar-border">
        {/* Logo */}
        <div className="p-5">
          <SocialNinjaLogo size="md" darkBg />
        </div>

        {/* Client/Project Switcher */}
        <div className="px-3 mb-2">
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-sidebar-border bg-sidebar-accent/30 hover:bg-sidebar-accent/50 transition-colors"
            >
              {selectedProject ? (
                <>
                  <FolderOpen className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-sm font-medium text-sidebar-accent-foreground truncate flex-1 text-left">{selectedProject.name}</span>
                </>
              ) : (
                <>
                  <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                    <LayoutDashboard className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-sidebar-accent-foreground truncate flex-1 text-left">{selectedClient.name}</span>
                </>
              )}
              {dropdownOpen ? (
                <ChevronUp className="w-4 h-4 text-sidebar-foreground shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-sidebar-foreground shrink-0" />
              )}
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-sidebar border border-sidebar-border rounded-xl shadow-lg z-50 overflow-hidden">
                {/* Clients */}
                {mockClients.map((client) => (
                  <div key={client.id}>
                    <button
                      onClick={() => handleSelectClient(client)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors ${
                        selectedClient.id === client.id && !selectedProject
                          ? "text-primary font-medium bg-sidebar-accent/50"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/30"
                      }`}
                    >
                      <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                        <LayoutDashboard className="w-3 h-3 text-primary" />
                      </div>
                      <span className="flex-1 text-left truncate">{client.name}</span>
                      {selectedClient.id === client.id && !selectedProject && (
                        <span className="text-primary">✓</span>
                      )}
                    </button>
                    {/* Show projects under selected client */}
                    {selectedClient.id === client.id && (mockProjectsByClient[client.id] || []).map((project) => (
                      <button
                        key={project.id}
                        onClick={() => handleSelectProject(project)}
                        className={`w-full flex items-center gap-2.5 pl-8 pr-3 py-2 text-sm transition-colors ${
                          selectedProject?.id === project.id
                            ? "text-primary font-medium bg-sidebar-accent/50"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/30"
                        }`}
                      >
                        <FolderOpen className="w-3.5 h-3.5 shrink-0" />
                        <span className="flex-1 text-left truncate">{project.name}</span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + "/");
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive
                    ? "bg-primary text-white"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`}
              >
                <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User profile at bottom */}
        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={() => navigate("/client/profile")}
            className="w-full flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-sidebar-accent/40 transition-colors text-left"
            title="View profile & settings"
          >
            <div className="w-8 h-8 rounded-full gradient-coral flex items-center justify-center text-white text-xs font-bold shrink-0">
              {selectedClient.initial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-sidebar-accent-foreground truncate">Business</p>
            </div>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-14 border-b border-border bg-card flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Business</span>
            <span className="text-sm text-muted-foreground">{">"}</span>
            {selectedProject && (
              <>
                <button onClick={handleBackToClient} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {selectedClient.name}
                </button>
                <span className="text-sm text-muted-foreground">{">"}</span>
                <span className="text-sm text-muted-foreground">{selectedProject.name}</span>
                <span className="text-sm text-muted-foreground">{">"}</span>
              </>
            )}
            <span className="text-sm text-foreground font-medium">{breadcrumbLabel}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-accent/50 rounded-lg px-3 py-2 w-64">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input className="text-sm outline-none bg-transparent w-full placeholder:text-muted-foreground" placeholder="Search anything..." />
            </div>
            <button className="relative p-2 rounded-lg hover:bg-accent transition-colors">
              <Bell className="w-[18px] h-[18px] text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-foreground font-medium">{selectedClient.name}</span>
              <span className="text-xs text-muted-foreground">Business</span>
              <div className="w-8 h-8 rounded-full gradient-coral flex items-center justify-center text-white text-xs font-bold cursor-pointer">
                {selectedClient.initial}
              </div>
            </div>
            <button className="p-2 rounded-lg hover:bg-accent transition-colors" title="Logout">
              <LogOut className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </header>

        {/* Page title */}
        <div className="px-8 pt-6 pb-2">
          <h1 className="text-2xl font-bold text-foreground">{breadcrumbLabel}</h1>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-8 pb-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
