import { useState } from "react";
import { Outlet, useLocation, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, FolderOpen, Users, Link2, Sparkles, CalendarDays, MessageSquare,
  BarChart3, Megaphone, Ear, Settings, Bell, ChevronDown, ChevronUp, ChevronRight,
  LogOut, Globe, Palette, KanbanSquare, FileText, ShieldAlert, Bot
} from "lucide-react";
import SocialNinjaLogo from "@/components/SocialNinjaLogo";
import acmeCorpLogoSrc from "@/assets/logos/acme-corp-logo.svg";
import sansLogoSrc from "@/assets/logos/sans-logo.svg";
import socialCampaignLogoSrc from "@/assets/logos/social-campaign-logo.svg";
import websiteRedesignLogoSrc from "@/assets/logos/website-redesign-logo.svg";
import brandLaunchLogoSrc from "@/assets/logos/brand-launch-logo.svg";

const mockClients = [
  { id: "c1", name: "Sans", initial: "S", logo: sansLogoSrc },
  { id: "c2", name: "Acme Corp", initial: "A", logo: acmeCorpLogoSrc },
];

const mockProjectsByClient: Record<string, { id: string; name: string; logo: string }[]> = {
  c1: [
    { id: "p1", name: "Website Redesign", logo: websiteRedesignLogoSrc },
    { id: "p2", name: "Social Campaign", logo: socialCampaignLogoSrc },
  ],
  c2: [
    { id: "p3", name: "Brand Launch", logo: brandLaunchLogoSrc },
  ],
};

// Client-level nav (no project selected)
const clientNavItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/client/dashboard" },
  { label: "Projects", icon: FolderOpen, path: "/client/projects" },
  { label: "Team", icon: Users, path: "/client/team" },
  { label: "Settings", icon: Settings, path: "/client/settings" },
];

type NavItem = {
  label: string;
  icon: any;
  path: string;
  children?: { label: string; icon: any; path: string }[];
};

// Project-level nav (project selected)
const projectNavItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/client/project/dashboard" },
  { label: "Team", icon: Users, path: "/client/project/team" },
  { label: "Social Profiles", icon: Globe, path: "/client/connect" },
  { label: "Create", icon: Sparkles, path: "/client/create" },
  { label: "Publish", icon: CalendarDays, path: "/client/publish" },
  {
    label: "Engage", icon: MessageSquare, path: "/client/engage",
    children: [
      { label: "Comment Board", icon: KanbanSquare, path: "/client/engage" },
      { label: "Posts", icon: FileText, path: "/client/engage/posts" },
      { label: "Spam Queue", icon: ShieldAlert, path: "/client/engage/spam" },
      { label: "Auto Replies", icon: Bot, path: "/client/engage/auto-replies" },
    ],
  },
  { label: "Analyze", icon: BarChart3, path: "/client/analyze" },
  { label: "Promote", icon: Megaphone, path: "/client/promote" },
  { label: "Listen", icon: Ear, path: "/client/listen" },
];

export default function ClientLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedClient, setSelectedClient] = useState(mockClients[0]);
  const [selectedProject, setSelectedProject] = useState<{ id: string; name: string; logo: string } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set(["Engage"]));

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

  // Breadcrumb — children before parent so child label wins on exact path match
  const allNavItems = [
    ...clientNavItems,
    ...projectNavItems.flatMap(n => n.children ? [...n.children, n] : [n]),
    { label: "My Profile", path: "/client/profile" },
  ];
  const currentNav = allNavItems.find(n => location.pathname === n.path)
    ?? allNavItems.find(n => location.pathname.startsWith(n.path + "/"));
  const breadcrumbLabel = currentNav?.label || "Dashboard";

  // Find parent nav item (for sub-pages like Engage children)
  const parentNav = projectNavItems.find(n =>
    n.children?.some(c => location.pathname === c.path)
  );

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
          {(navItems as NavItem[]).map((item) => {
            const hasChildren = !!item.children?.length;
            const isActive = hasChildren
              ? item.children!.some(c => location.pathname === c.path)
              : location.pathname === item.path || location.pathname.startsWith(item.path + "/");
            const isExpanded = expandedMenus.has(item.label);

            return (
              <div key={item.label}>
                {hasChildren ? (
                  <button
                    onClick={() => setExpandedMenus(prev => {
                      const next = new Set(prev);
                      next.has(item.label) ? next.delete(item.label) : next.add(item.label);
                      return next;
                    })}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                      ${isActive
                        ? "text-primary"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      }`}
                  >
                    <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                    <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                  </button>
                ) : (
                  <Link
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
                )}

                {hasChildren && isExpanded && (
                  <div className="mt-0.5 ml-3 pl-3 border-l border-sidebar-border space-y-0.5">
                    {item.children!.map((child) => {
                      const childActive = location.pathname === child.path;
                      return (
                        <Link
                          key={child.label}
                          to={child.path}
                          className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all duration-200
                            ${childActive
                              ? "bg-primary text-white"
                              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                            }`}
                        >
                          <child.icon className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{child.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
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
        <header className="py-5 border-b border-border bg-card flex items-center px-6 gap-5 flex-shrink-0">
          {/* Context identifier */}
          <div className="flex items-center gap-3 shrink-0 min-w-0 max-w-[200px]">
            <img
              src={selectedProject ? selectedProject.logo : selectedClient.logo}
              alt={selectedProject ? selectedProject.name : selectedClient.name}
              className="w-10 h-10 rounded-xl object-cover shrink-0"
            />
            <div className="min-w-0">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1">
                {selectedProject ? 'Project' : 'Business'}
              </p>
              <p className="text-sm font-semibold text-foreground truncate">
                {selectedProject ? selectedProject.name : selectedClient.name}
              </p>
            </div>
          </div>
          <div className="w-px self-stretch bg-border shrink-0" />
          {/* Page title + breadcrumbs */}
          <div className="flex-1 min-w-0 flex flex-col gap-1.5">
            <h1 className="text-xl font-bold text-foreground truncate">{breadcrumbLabel}</h1>
            <div className="flex items-center gap-1 overflow-hidden whitespace-nowrap">
              <span className="text-xs text-muted-foreground shrink-0">Business</span>
              <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />
              {selectedProject && (
                <>
                  <button onClick={handleBackToClient} className="text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0">{selectedClient.name}</button>
                  <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />
                  <span className="text-xs text-muted-foreground truncate">{selectedProject.name}</span>
                  <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />
                </>
              )}
              {parentNav && (
                <>
                  <span className="text-xs text-muted-foreground shrink-0">{parentNav.label}</span>
                  <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />
                </>
              )}
              <span className="text-xs text-foreground font-medium truncate">{breadcrumbLabel}</span>
            </div>
          </div>
          {/* Right: notifications + logout */}
          <div className="flex items-center gap-2 shrink-0">
            <button className="relative p-2 rounded-lg hover:bg-accent transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
            </button>
            <button className="p-2 rounded-lg hover:bg-accent transition-colors border-l border-border ml-1 pl-3" title="Logout">
              <LogOut className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </header>



        {/* Content */}
        <main className="flex-1 overflow-y-auto px-8 pt-6 pb-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
