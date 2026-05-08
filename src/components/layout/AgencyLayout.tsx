import { ReactNode, useState, useRef, useEffect } from "react";
import { useLocation, Link, useNavigate, Outlet } from "react-router-dom";
import {
  LayoutDashboard, Globe, Users, ChevronDown, ChevronUp, ChevronRight,
  Bell, Check, LogOut, FolderOpen, Settings, Link2 as LinkIcon,
  Receipt, Sparkles, CalendarDays, MessageSquare, BarChart3, Megaphone, Ear, Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import SocialNinjaLogo from "@/components/SocialNinjaLogo";
import agencyLogoSrc           from "@/assets/logos/agency-logo.svg";
import acmeCorpLogoSrc         from "@/assets/logos/acme-corp-logo.svg";
import client1LogoSrc          from "@/assets/logos/client-1-logo.svg";
import socialCampaignLogoSrc   from "@/assets/logos/social-campaign-logo.svg";
import websiteRedesignLogoSrc  from "@/assets/logos/website-redesign-logo.svg";
import brandLaunchLogoSrc      from "@/assets/logos/brand-launch-logo.svg";

/* ── Static data ─────────────────────────────────────────────────── */
const AGENCY = { id: "ag1", name: "Agency", logo: agencyLogoSrc };

const CLIENTS = [
  { id: "c1", name: "client-1",  logo: client1LogoSrc  },
  { id: "c2", name: "Acme Corp", logo: acmeCorpLogoSrc },
];

const PROJECTS: Record<string, { id: string; name: string; logo: string }[]> = {
  c1: [
    { id: "p1", name: "Social Campaign",  logo: socialCampaignLogoSrc  },
    { id: "p2", name: "Website Redesign", logo: websiteRedesignLogoSrc },
  ],
  c2: [
    { id: "p3", name: "Brand Launch", logo: brandLaunchLogoSrc },
  ],
};

type Client  = typeof CLIENTS[0];
type Project = { id: string; name: string; logo: string };

/* ── Nav item lists ──────────────────────────────────────────────── */
const agencyNav = [
  { title: "Dashboard",      path: "/agency/dashboard",       icon: LayoutDashboard },
  { title: "Clients",        path: "/agency/clients",         icon: Globe           },
  { title: "Users",          path: "/agency/team",            icon: Users           },
  { title: "Social Accounts",path: "/agency/social-accounts", icon: LinkIcon        },
  { title: "Client Billing", path: "/agency/client-billing",  icon: Receipt         },
  { title: "Settings",       path: "/agency/settings",        icon: Settings        },
];

const clientNav = [
  { title: "Dashboard", path: "/agency/client/business/dashboard", icon: LayoutDashboard },
  { title: "Projects",  path: "/agency/client/business/projects",  icon: FolderOpen      },
  { title: "Team",      path: "/agency/client/business/team",      icon: Users           },
  { title: "Settings",  path: "/agency/client/settings",           icon: Settings        },
];

const projectNav = [
  { title: "Dashboard",       path: "/agency/client/project/dashboard", icon: LayoutDashboard },
  { title: "Team",            path: "/agency/client/project/team",      icon: Users           },
  { title: "Social Profiles", path: "/agency/client/connect",           icon: Globe           },
  { title: "Create",          path: "/agency/client/create",            icon: Sparkles        },
  { title: "Publish",         path: "/agency/client/publish",           icon: CalendarDays    },
  { title: "Engage",          path: "/agency/client/engage",            icon: MessageSquare   },
  { title: "Analyze",         path: "/agency/client/analyze",           icon: BarChart3       },
  { title: "Promote",         path: "/agency/client/promote",           icon: Megaphone       },
  { title: "Listen",          path: "/agency/client/listen",            icon: Ear             },
];

/* ── Session helpers ─────────────────────────────────────────────── */
const ss = {
  getClient:  ()  => sessionStorage.getItem("ag_client"),
  getProject: ()  => sessionStorage.getItem("ag_project"),
  setClient:  (id: string) => { sessionStorage.setItem("ag_client", id); sessionStorage.removeItem("ag_project"); },
  setProject: (id: string) => sessionStorage.setItem("ag_project", id),
  clearAll:   ()  => { sessionStorage.removeItem("ag_client"); sessionStorage.removeItem("ag_project"); },
};

function initClient(): Client | null {
  const id = ss.getClient();
  return id ? CLIENTS.find(c => c.id === id) ?? null : null;
}
function initProject(clientId: string | null): Project | null {
  if (!clientId) return null;
  const id = ss.getProject();
  return id ? (PROJECTS[clientId]?.find(p => p.id === id) ?? null) : null;
}

/* ── Component ───────────────────────────────────────────────────── */
interface AgencyLayoutProps { children?: ReactNode; title?: string; defaultClientId?: string; }

const AgencyLayout = ({ children, title, defaultClientId }: AgencyLayoutProps) => {
  const location = useLocation();
  const navigate  = useNavigate();

  const [client,  setClient]  = useState<Client | null>(() => initClient() ?? (defaultClientId ? CLIENTS.find(c => c.id === defaultClientId) ?? null : null));
  const [project, setProject] = useState<Project | null>(() => {
    const cid = ss.getClient() ?? defaultClientId ?? null;
    return initProject(cid);
  });

  const [switcherOpen,    setSwitcherOpen]    = useState(false);
  const [expandedClients, setExpandedClients] = useState<Set<string>>(
    () => new Set(client ? [client.id] : []),
  );
  const switcherRef = useRef<HTMLDivElement>(null);

  // Close switcher on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (switcherRef.current && !switcherRef.current.contains(e.target as Node))
        setSwitcherOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Detect context from URL to fix back-navigation
  const path = location.pathname;
  const isClientRoute  = path.startsWith("/agency/client/");
  const isProjectRoute = isClientRoute && !path.startsWith("/agency/client/business/") && !path.startsWith("/agency/client/settings");

  // If URL says we're NOT in a client route but we have a client selected, stay — user may have
  // navigated to agency pages while a client was selected. Only force-clear if on pure agency routes.
  const isAgencyOnlyRoute = !isClientRoute;

  const isClientCtx  = isClientRoute ? !!client  : false;
  const isProjectCtx = isProjectRoute ? !!project : false;

  const navItems = isProjectCtx ? projectNav : isClientCtx ? clientNav : agencyNav;

  /* ── Handlers ── */
  function selectAgency() {
    setClient(null);
    setProject(null);
    ss.clearAll();
    setSwitcherOpen(false);
    navigate("/agency/dashboard");
  }

  function selectClient(c: Client) {
    setClient(c);
    setProject(null);
    ss.setClient(c.id);
    setExpandedClients(prev => new Set([...prev, c.id]));
    setSwitcherOpen(false);
    navigate("/agency/client/business/dashboard");
  }

  function selectProject(c: Client, p: Project) {
    setClient(c);
    setProject(p);
    ss.setClient(c.id);
    ss.setProject(p.id);
    setSwitcherOpen(false);
    navigate("/agency/client/project/dashboard");
  }

  function backToClient() {
    setProject(null);
    sessionStorage.removeItem("ag_project");
    navigate("/agency/client/business/dashboard");
  }

  function toggleExpand(clientId: string, e: React.MouseEvent) {
    e.stopPropagation();
    setExpandedClients(prev => {
      const n = new Set(prev);
      n.has(clientId) ? n.delete(clientId) : n.add(clientId);
      return n;
    });
  }

  /* ── Labels & assets ── */
  const switcherLabel = isProjectCtx ? project!.name : isClientCtx ? client!.name : AGENCY.name;
  const switcherLogo  = isProjectCtx ? project!.logo : isClientCtx ? client!.logo  : AGENCY.logo;
  const contextLabel  = isProjectCtx ? "Project" : isClientCtx ? "Client" : "Agency";

  const currentNav     = navItems.find(n => path === n.path || path.startsWith(n.path + "/"));
  const breadcrumbPage = title || currentNav?.title || "Dashboard";

  /* ── Render ── */
  return (
    <div className="flex min-h-screen w-full">

      {/* ── Sidebar ── */}
      <aside className="w-[210px] shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col">

        {/* Logo */}
        <div className="p-4 border-b border-sidebar-border/50">
          <SocialNinjaLogo size="sm" darkBg />
        </div>

        {/* Context switcher */}
        <div className="px-3 pt-3 relative" ref={switcherRef}>
          <button
            onClick={() => setSwitcherOpen(v => !v)}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-sidebar-accent hover:bg-sidebar-accent/80 transition-colors"
          >
            <img src={switcherLogo} alt={switcherLabel} className="w-7 h-7 rounded-lg object-cover shrink-0" />
            <div className="flex-1 min-w-0 text-left">
              <p className="text-[10px] text-sidebar-foreground/60 uppercase tracking-widest leading-none mb-0.5">{contextLabel}</p>
              <p className="text-[13px] font-semibold text-white truncate leading-tight">{switcherLabel}</p>
            </div>
            {switcherOpen
              ? <ChevronUp className="h-3.5 w-3.5 text-sidebar-foreground shrink-0" />
              : <ChevronDown className="h-3.5 w-3.5 text-sidebar-foreground shrink-0" />
            }
          </button>

          {/* Dropdown */}
          {switcherOpen && (
            <div className="absolute left-3 right-0 top-full mt-1 w-[220px] bg-sidebar-accent border border-sidebar-border rounded-xl shadow-xl z-50 py-1.5 max-h-[420px] overflow-y-auto">

              {/* Agency */}
              <button
                onClick={selectAgency}
                className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-white/5 transition-colors"
              >
                <img src={AGENCY.logo} alt="Agency" className="w-6 h-6 rounded-lg object-cover shrink-0" />
                <span className="text-white text-[13px] flex-1 text-left font-medium">{AGENCY.name}</span>
                {!isClientCtx && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
              </button>

              <div className="h-px bg-sidebar-border/50 mx-2 my-1" />

              {/* Clients + Projects */}
              {CLIENTS.map(c => {
                const projects   = PROJECTS[c.id] || [];
                const isExpanded = expandedClients.has(c.id);
                const isSelected = client?.id === c.id;

                return (
                  <div key={c.id}>
                    {/* Client row */}
                    <div className="flex items-center">
                      <button
                        onClick={() => selectClient(c)}
                        className="flex-1 flex items-center gap-2.5 px-3 py-2 hover:bg-white/5 transition-colors min-w-0"
                      >
                        <img src={c.logo} alt={c.name} className="w-6 h-6 rounded-lg object-cover shrink-0" />
                        <span className={cn("text-[13px] flex-1 text-left truncate font-medium", isSelected ? "text-primary" : "text-white")}>
                          {c.name}
                        </span>
                        {isSelected && !isProjectCtx && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                      </button>
                      {projects.length > 0 && (
                        <button
                          onClick={(e) => toggleExpand(c.id, e)}
                          className="px-2.5 py-2 hover:bg-white/5 transition-colors text-sidebar-foreground/60 hover:text-sidebar-foreground"
                        >
                          {isExpanded
                            ? <ChevronUp className="w-3.5 h-3.5" />
                            : <ChevronDown className="w-3.5 h-3.5" />
                          }
                        </button>
                      )}
                    </div>

                    {/* Projects */}
                    {isExpanded && projects.map(p => {
                      const isProjSelected = project?.id === p.id;
                      return (
                        <button
                          key={p.id}
                          onClick={() => selectProject(c, p)}
                          className="w-full flex items-center gap-2 pl-10 pr-3 py-1.5 hover:bg-white/5 transition-colors"
                        >
                          <FolderOpen className={cn("w-3.5 h-3.5 shrink-0", isProjSelected ? "text-primary" : "text-sidebar-foreground/50")} />
                          <span className={cn("text-[12px] flex-1 text-left truncate", isProjSelected ? "text-primary font-semibold" : "text-white/70")}>
                            {p.name}
                          </span>
                          {isProjSelected && <Check className="h-3 w-3 text-primary shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = path === item.path || path.startsWith(item.path + "/");
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-white",
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* User profile */}
        <div className="px-3 py-3 border-t border-sidebar-border/50">
          <button
            onClick={() => navigate("/agency/profile")}
            className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-sidebar-accent/60 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-full gradient-coral flex items-center justify-center text-white text-xs font-semibold shrink-0">A</div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">agency</p>
              <p className="text-[11px] text-sidebar-foreground/60">Agency Admin</p>
            </div>
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <header className="h-16 shrink-0 border-b border-border bg-card flex items-center px-6 gap-4">

          {/* Context logo + label */}
          <div className="flex items-center gap-3 shrink-0">
            <img src={switcherLogo} alt={switcherLabel} className="w-9 h-9 rounded-xl object-cover shadow-sm" />
            <div className="hidden md:block">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest leading-none">{contextLabel}</p>
              <p className="text-sm font-semibold text-foreground leading-tight mt-0.5">{switcherLabel}</p>
            </div>
          </div>

          <div className="w-px self-stretch bg-border shrink-0" />

          {/* Breadcrumb */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
              {isClientCtx ? (
                <>
                  <button onClick={selectAgency} className="hover:text-foreground transition-colors">Agency</button>
                  <ChevronRight className="w-3 h-3 shrink-0" />
                  {isProjectCtx ? (
                    <>
                      <button onClick={backToClient} className="hover:text-foreground transition-colors truncate max-w-[120px]">{client!.name}</button>
                      <ChevronRight className="w-3 h-3 shrink-0" />
                      <span className="text-muted-foreground truncate max-w-[120px]">{project!.name}</span>
                      <ChevronRight className="w-3 h-3 shrink-0" />
                    </>
                  ) : (
                    <>
                      <span className="text-muted-foreground truncate max-w-[120px]">{client!.name}</span>
                      <ChevronRight className="w-3 h-3 shrink-0" />
                    </>
                  )}
                  <span className="font-semibold text-foreground">{breadcrumbPage}</span>
                </>
              ) : (
                <>
                  <span>Agency</span>
                  <ChevronRight className="w-3 h-3 shrink-0" />
                  <span className="font-semibold text-foreground">{breadcrumbPage}</span>
                </>
              )}
            </div>
          </div>

          {/* Right: notifications + user */}
          <div className="flex items-center gap-2 shrink-0">
            <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
            </button>
            <button onClick={() => navigate("/login")} className="p-1.5 hover:bg-muted rounded-lg transition-colors" title="Sign out">
              <LogOut className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto bg-muted/30">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default AgencyLayout;
