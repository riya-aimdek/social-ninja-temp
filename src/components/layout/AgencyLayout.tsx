import { ReactNode, useState, useRef, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Globe, Users, ChevronDown, ChevronUp,
  Bell, Check, LogOut, Search, FolderOpen, Sparkles, CalendarDays,
  MessageSquare, BarChart3, Megaphone, Ear, Settings, Palette,
} from "lucide-react";
import SocialNinjaLogo from "@/components/SocialNinjaLogo";

const agencyNavItems = [
  { title: "Dashboard", path: "/agency/dashboard", icon: LayoutDashboard },
  { title: "Clients", path: "/agency/clients", icon: Globe },
  { title: "Users", path: "/agency/team", icon: Users },
];

const clientNavItems = [
  { title: "Dashboard", path: "/client/dashboard", icon: LayoutDashboard },
  { title: "Projects", path: "/client/projects", icon: FolderOpen },
  { title: "Team", path: "/client/team", icon: Users },
];

const projectNavItems = [
  { title: "Dashboard", path: "/client/project/dashboard", icon: LayoutDashboard },
  { title: "Team", path: "/client/project/team", icon: Users },
  { title: "Social Profiles", path: "/client/connect", icon: Globe },
  { title: "Create", path: "/client/create", icon: Sparkles },
  { title: "Publish", path: "/client/publish", icon: CalendarDays },
  { title: "Engage", path: "/client/engage", icon: MessageSquare },
  { title: "Analyze", path: "/client/analyze", icon: BarChart3 },
  { title: "Promote", path: "/client/promote", icon: Megaphone },
  { title: "Listen", path: "/client/listen", icon: Ear },
  { title: "Settings", path: "/client/settings", icon: Settings },
  { title: "Customization", path: "/client/customization", icon: Palette },
];

const mockAgencies = [
  { id: "1", name: "Agency", icon: "🏢" },
];

const mockClients = [
  { id: "1", name: "client-1", initials: "C" },
  { id: "2", name: "Acme Corp", initials: "A" },
];

const mockProjectsByClient: Record<string, { id: string; name: string }[]> = {
  "1": [
    { id: "p1", name: "Social Campaign" },
    { id: "p2", name: "Website Redesign" },
  ],
  "2": [
    { id: "p3", name: "Brand Launch" },
  ],
};

interface AgencyLayoutProps {
  children: ReactNode;
  title?: string;
}

const AgencyLayout = ({ children, title }: AgencyLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedAgency] = useState(mockAgencies[0]);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<typeof mockClients[0] | null>(null);
  const [selectedProject, setSelectedProject] = useState<{ id: string; name: string } | null>(null);
  const switcherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (switcherRef.current && !switcherRef.current.contains(e.target as Node)) {
        setSwitcherOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Determine context
  const isClientContext = !!selectedClient;
  const isProjectContext = !!selectedProject;

  const navItems = isProjectContext
    ? projectNavItems
    : isClientContext
    ? clientNavItems
    : agencyNavItems;

  const handleSelectAgency = () => {
    setSelectedClient(null);
    setSelectedProject(null);
    setSwitcherOpen(false);
    navigate("/agency/dashboard");
  };

  const handleSelectClient = (client: typeof mockClients[0]) => {
    setSelectedClient(client);
    setSelectedProject(null);
    setSwitcherOpen(false);
    navigate("/client/dashboard");
  };

  const handleSelectProject = (project: { id: string; name: string }) => {
    setSelectedProject(project);
    setSwitcherOpen(false);
    navigate("/client/project/dashboard");
  };

  const handleBackToClient = () => {
    setSelectedProject(null);
    navigate("/client/dashboard");
  };

  // Breadcrumb
  const currentNav = navItems.find(n => location.pathname === n.path || location.pathname.startsWith(n.path + "/"));
  const breadcrumbLabel = title || currentNav?.title || "Dashboard";

  // Switcher display
  const switcherLabel = isProjectContext
    ? selectedProject!.name
    : isClientContext
    ? selectedClient!.name
    : selectedAgency.name;

  const switcherIcon = isProjectContext
    ? <FolderOpen className="w-3.5 h-3.5 text-primary" />
    : isClientContext
    ? <Globe className="w-3.5 h-3.5 text-primary" />
    : <span className="text-sm">🏢</span>;

  const clientProjects = selectedClient ? (mockProjectsByClient[selectedClient.id] || []) : [];

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <aside className="w-[200px] shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="p-4 border-b border-sidebar-border/50">
          <SocialNinjaLogo size="sm" darkBg />
        </div>

        {/* Switcher */}
        <div className="px-3 pt-3 relative" ref={switcherRef}>
          <button
            onClick={() => setSwitcherOpen(!switcherOpen)}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-sidebar-accent hover:bg-sidebar-accent/80 transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
              {switcherIcon}
            </div>
            <span className="text-[13px] font-semibold text-white truncate flex-1 text-left">{switcherLabel}</span>
            {switcherOpen ? <ChevronUp className="h-3.5 w-3.5 text-sidebar-foreground shrink-0" /> : <ChevronDown className="h-3.5 w-3.5 text-sidebar-foreground shrink-0" />}
          </button>

          {switcherOpen && (
            <div className="absolute left-3 right-3 top-full mt-1 w-[220px] bg-sidebar-accent border border-sidebar-border rounded-xl shadow-lg z-50 py-1 max-h-[400px] overflow-y-auto">
              {/* Agency option */}
              <button
                onClick={handleSelectAgency}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-sidebar-border/50 transition-colors"
              >
                <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center text-xs">🏢</div>
                <span className="text-white text-[13px] flex-1 text-left">{selectedAgency.name}</span>
                {!isClientContext && <Check className="h-4 w-4 text-primary" />}
              </button>

              <div className="border-t border-sidebar-border/50 my-1" />

              {/* Clients */}
              {mockClients.map(client => (
                <div key={client.id}>
                  <button
                    onClick={() => handleSelectClient(client)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-sidebar-border/50 transition-colors ${
                      selectedClient?.id === client.id && !selectedProject ? 'text-primary' : ''
                    }`}
                  >
                    <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Globe className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-white text-[13px] flex-1 text-left">{client.name}</span>
                    {selectedClient?.id === client.id && !selectedProject && <Check className="h-4 w-4 text-primary" />}
                  </button>
                  {/* Projects under this client */}
                  {selectedClient?.id === client.id && (mockProjectsByClient[client.id] || []).map(project => (
                    <button
                      key={project.id}
                      onClick={() => handleSelectProject(project)}
                      className={`w-full flex items-center gap-2.5 pl-8 pr-3 py-1.5 text-sm hover:bg-sidebar-border/50 transition-colors ${
                        selectedProject?.id === project.id ? 'text-primary' : ''
                      }`}
                    >
                      <FolderOpen className="w-3.5 h-3.5 text-sidebar-foreground shrink-0" />
                      <span className="text-white text-[13px] flex-1 text-left truncate">{project.name}</span>
                      {selectedProject?.id === project.id && <Check className="h-3.5 w-3.5 text-primary" />}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        <nav className="flex-1 px-3 py-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + "/");
            return (
              <Link key={item.path} to={item.path} className={`nav-item ${isActive ? 'nav-item-active' : ''}`}>
                <item.icon className="h-4 w-4 shrink-0" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* User profile at bottom */}
        <div className="px-3 py-3 border-t border-sidebar-border/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full gradient-coral flex items-center justify-center text-white text-xs font-semibold shrink-0">A</div>
            <div>
              <p className="text-sm font-semibold text-white">{selectedAgency.name.toLowerCase()}</p>
              <p className="text-[11px] text-sidebar-foreground">Agency</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 shrink-0 border-b border-border bg-card flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            {isClientContext ? (
              <>
                <span className="text-sm text-muted-foreground">Client</span>
                <span className="text-sm text-muted-foreground">{'>'}</span>
                {isProjectContext ? (
                  <>
                    <button onClick={handleBackToClient} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {selectedClient!.name}
                    </button>
                    <span className="text-sm text-muted-foreground">{'>'}</span>
                    <span className="text-sm text-muted-foreground">{selectedProject!.name}</span>
                    <span className="text-sm text-muted-foreground">{'>'}</span>
                  </>
                ) : null}
                <span className="text-sm text-foreground font-medium">{breadcrumbLabel}</span>
              </>
            ) : (
              <>
                <span className="text-sm text-muted-foreground">Agency</span>
                <span className="text-sm text-muted-foreground">{'>'}</span>
                <span className="text-sm text-foreground font-medium">{breadcrumbLabel}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input className="h-9 pl-9 pr-4 w-[240px] border border-border rounded-lg bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Search anything..." />
            </div>
            <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </button>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{selectedAgency.name.toLowerCase()}</p>
                <p className="text-[11px] text-muted-foreground">Agency</p>
              </div>
              <div className="w-8 h-8 rounded-full gradient-coral flex items-center justify-center text-white text-xs font-semibold">A</div>
              <button onClick={() => navigate("/login")} className="p-1.5 hover:bg-muted rounded-lg transition-colors">
                <LogOut className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto bg-muted/30">
          {title && <h1 className="text-xl font-semibold text-foreground mb-6">{breadcrumbLabel}</h1>}
          {children}
        </main>
      </div>
    </div>
  );
};

export default AgencyLayout;
