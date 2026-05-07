import { ReactNode, useState, useRef, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Globe, Users, ChevronDown, ChevronUp, ChevronRight,
  Bell, Check, LogOut, FolderOpen, Sparkles, CalendarDays,
  MessageSquare, BarChart3, Megaphone, Ear, Settings, Palette, Link2 as LinkIcon,
  Receipt,
} from "lucide-react";
import SocialNinjaLogo from "@/components/SocialNinjaLogo";
import agencyLogoSrc from "@/assets/logos/agency-logo.svg";
import acmeCorpLogoSrc from "@/assets/logos/acme-corp-logo.svg";
import client1LogoSrc from "@/assets/logos/client-1-logo.svg";
import socialCampaignLogoSrc from "@/assets/logos/social-campaign-logo.svg";
import websiteRedesignLogoSrc from "@/assets/logos/website-redesign-logo.svg";
import brandLaunchLogoSrc from "@/assets/logos/brand-launch-logo.svg";

const agencyNavItems = [
  { title: "Dashboard", path: "/agency/dashboard", icon: LayoutDashboard },
  { title: "Clients", path: "/agency/clients", icon: Globe },
  { title: "Users", path: "/agency/team", icon: Users },
  { title: "Social Accounts", path: "/agency/social-accounts", icon: LinkIcon },
  { title: "Client Billing", path: "/agency/client-billing", icon: Receipt },
  { title: "Settings", path: "/agency/settings", icon: Settings },
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
  { id: "1", name: "Agency", icon: "🏢", logo: agencyLogoSrc },
];

const mockClients = [
  { id: "1", name: "client-1", initials: "C", logo: client1LogoSrc },
  { id: "2", name: "Acme Corp", initials: "A", logo: acmeCorpLogoSrc },
];

const mockProjectsByClient: Record<string, { id: string; name: string; logo: string }[]> = {
  "1": [
    { id: "p1", name: "Social Campaign", logo: socialCampaignLogoSrc },
    { id: "p2", name: "Website Redesign", logo: websiteRedesignLogoSrc },
  ],
  "2": [
    { id: "p3", name: "Brand Launch", logo: brandLaunchLogoSrc },
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
  const [selectedProject, setSelectedProject] = useState<{ id: string; name: string; logo: string } | null>(null);
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
          <button
            onClick={() => navigate("/agency/profile")}
            className="w-full flex items-center gap-3 p-1.5 rounded-lg hover:bg-sidebar-accent/60 transition-colors text-left"
            title="View profile & settings"
          >
            <div className="w-8 h-8 rounded-full gradient-coral flex items-center justify-center text-white text-xs font-semibold shrink-0">A</div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{selectedAgency.name.toLowerCase()}</p>
              <p className="text-[11px] text-sidebar-foreground">Agency</p>
            </div>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="py-5 shrink-0 border-b border-border bg-card flex items-center px-6 gap-5">
          {/* Context identifier */}
          <div className="flex items-center gap-3 shrink-0 min-w-0 max-w-[200px]">
            <img
              src={
                isProjectContext
                  ? selectedProject!.logo
                  : isClientContext
                  ? selectedClient!.logo
                  : selectedAgency.logo
              }
              alt={switcherLabel}
              className="w-10 h-10 rounded-xl object-cover shrink-0"
            />
            <div className="min-w-0">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1">
                {isProjectContext ? 'Project' : isClientContext ? 'Client' : 'Agency'}
              </p>
              <p className="text-sm font-semibold text-foreground truncate">{switcherLabel}</p>
            </div>
          </div>
          <div className="w-px self-stretch bg-border shrink-0" />
          {/* Page title + breadcrumbs */}
          <div className="flex-1 min-w-0 flex flex-col gap-1.5">
            <h1 className="text-xl font-bold text-foreground truncate">{breadcrumbLabel}</h1>
            <div className="flex items-center gap-1 overflow-hidden whitespace-nowrap">
              {isClientContext ? (
                <>
                  <span className="text-xs text-muted-foreground shrink-0">Client</span>
                  <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />
                  {isProjectContext ? (
                    <>
                      <button onClick={handleBackToClient} className="text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0">{selectedClient!.name}</button>
                      <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />
                      <span className="text-xs text-muted-foreground truncate">{selectedProject!.name}</span>
                      <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />
                    </>
                  ) : null}
                  <span className="text-xs text-foreground font-medium truncate">{breadcrumbLabel}</span>
                </>
              ) : (
                <>
                  <span className="text-xs text-muted-foreground shrink-0">Agency</span>
                  <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />
                  <span className="text-xs text-foreground font-medium truncate">{breadcrumbLabel}</span>
                </>
              )}
            </div>
          </div>
          {/* Right: user + notifications */}
          <div className="flex items-center gap-2 shrink-0">
            <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-border">
              <div className="w-8 h-8 rounded-full gradient-coral flex items-center justify-center text-white text-xs font-semibold shrink-0">A</div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-medium text-foreground">{selectedAgency.name}</p>
                <p className="text-[11px] text-muted-foreground">Agency</p>
              </div>
              <button onClick={() => navigate("/login")} className="p-1.5 hover:bg-muted rounded-lg transition-colors ml-1">
                <LogOut className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto bg-muted/30">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AgencyLayout;
