import { ReactNode, useState, useRef, useEffect } from "react";
import AgencyOnboardingWidget from "@/components/onboarding/AgencyOnboardingWidget";
import { useLocation, Link, useNavigate, Outlet } from "react-router-dom";
import {
  LayoutDashboard, Globe, Users, ChevronDown, ChevronUp, ChevronRight,
  Bell, Check, LogOut, FolderOpen, Settings, Link2 as LinkIcon,
  Sparkles, CalendarDays, MessageSquare, BarChart3, Megaphone, Ear,
  KanbanSquare, FileText, ShieldAlert, Bot,
  TrendingUp, Trophy, FileDown,
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

type NavChild = { title: string; path: string; icon: React.FC<{ className?: string }> };
type NavItem  = { title: string; path: string; icon: React.FC<{ className?: string }>; children?: NavChild[] };

/* ── Nav item lists ──────────────────────────────────────────────── */
const agencyNav: NavItem[] = [
  { title: "Dashboard",      path: "/agency/dashboard",       icon: LayoutDashboard },
  { title: "Clients",        path: "/agency/clients",         icon: Globe           },
  { title: "Users",          path: "/agency/team",            icon: Users           },
  { title: "Social Accounts",path: "/agency/social-accounts", icon: LinkIcon        },
  { title: "Settings",       path: "/agency/settings",        icon: Settings        },
];

const clientNav: NavItem[] = [
  { title: "Dashboard", path: "/agency/client/business/dashboard", icon: LayoutDashboard },
  { title: "Projects",  path: "/agency/client/business/projects",  icon: FolderOpen      },
  { title: "Team",      path: "/agency/client/business/team",      icon: Users           },
  { title: "Settings",  path: "/agency/client/settings",           icon: Settings        },
];

const projectNav: NavItem[] = [
  { title: "Dashboard",       path: "/agency/client/project/dashboard", icon: LayoutDashboard },
  { title: "Team",            path: "/agency/client/project/team",      icon: Users           },
  { title: "Social Profiles", path: "/agency/client/connect",           icon: Globe           },
  { title: "Create",          path: "/agency/client/create",            icon: Sparkles        },
  { title: "Publish",         path: "/agency/client/publish",           icon: CalendarDays    },
  {
    title: "Engage", path: "/agency/client/engage", icon: MessageSquare,
    children: [
      { title: "Comment Board", path: "/agency/client/engage",             icon: KanbanSquare },
      { title: "Posts",         path: "/agency/client/engage/posts",       icon: FileText     },
      { title: "Spam Queue",    path: "/agency/client/engage/spam",        icon: ShieldAlert  },
      { title: "Auto Replies",  path: "/agency/client/engage/auto-replies",icon: Bot          },
    ],
  },
  {
    title: "Analyze", path: "/agency/client/analyze", icon: BarChart3,
    children: [
      { title: "Intelligence Layer",   icon: Sparkles,   path: "/agency/client/analyze?view=intelligence" },
      { title: "Post Performance",     icon: FileText,   path: "/agency/client/analyze?view=posts"        },
      { title: "Growth Insights", icon: TrendingUp, path: "/agency/client/analyze?view=growth"       },
      { title: "Competitor Analysis",  icon: Trophy,     path: "/agency/client/analyze?view=competitors"  },
      { title: "Create Report",        icon: FileDown,   path: "/agency/client/analyze?view=report"       },
    ],
  },
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

/* ── User menu ───────────────────────────────────────────────────── */
const AGENCY_USER = { name: "Riya Shah", role: "Agency", initials: "RS" };

function UserMenu({ onLogout }: { onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
      >
        <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white text-[11px] font-bold shrink-0">
          {AGENCY_USER.initials}
        </div>
        <div className="text-left leading-none">
          <div className="flex items-center gap-1">
            <p className="text-[13px] font-semibold text-foreground">{AGENCY_USER.name}</p>
            <ChevronDown className={cn("w-3 h-3 text-muted-foreground transition-transform shrink-0", open && "rotate-180")} />
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">{AGENCY_USER.role}</p>
        </div>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-48 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
              {AGENCY_USER.initials}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground leading-tight">{AGENCY_USER.name}</p>
              <p className="text-[11px] text-muted-foreground">{AGENCY_USER.role}</p>
            </div>
          </div>
          <button
            onClick={() => { setOpen(false); onLogout(); }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

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
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set(["Engage", "Analyze"]));
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
  const { pathname: path, search: locationSearch } = location;
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
    <div className="flex bg-background font-sans">

      {/* ── Sidebar ── */}
      <aside className="sticky top-0 h-screen w-[220px] shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col">

        {/* Logo */}
        <div className="p-4 border-b border-sidebar-border/50">
          <SocialNinjaLogo size="sm" darkBg />
        </div>

        {/* Context switcher */}
        <div className="px-3 py-3 relative" ref={switcherRef}>
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
            <div className="absolute left-3 right-3 top-full mt-1 bg-sidebar-accent border border-sidebar-border rounded-xl shadow-xl z-50 py-2 max-h-[420px] overflow-y-auto">

              {/* Agency workspace section */}
              <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">Workspace</p>
              <button
                onClick={selectAgency}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 hover:bg-white/5 transition-colors rounded-lg mx-0",
                  !isClientCtx && "bg-white/5",
                )}
              >
                <img src={AGENCY.logo} alt="Agency" className="w-6 h-6 rounded-lg object-cover shrink-0" />
                <span className={cn("text-[13px] flex-1 text-left font-medium truncate", !isClientCtx ? "text-primary" : "text-white")}>
                  {AGENCY.name}
                </span>
                {!isClientCtx && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
              </button>

              <div className="h-px bg-sidebar-border/50 mx-2 my-2" />

              {/* Clients section */}
              <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">Clients</p>
              {CLIENTS.map(c => {
                const projects   = PROJECTS[c.id] || [];
                const isExpanded = expandedClients.has(c.id);
                const isSelected = client?.id === c.id;

                return (
                  <div key={c.id}>
                    <div className="flex items-center">
                      <button
                        onClick={() => selectClient(c)}
                        className={cn(
                          "flex-1 flex items-center gap-2.5 px-3 py-2 hover:bg-white/5 transition-colors min-w-0",
                          isSelected && !isProjectCtx && "bg-white/5",
                        )}
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
                          className={cn(
                            "w-full flex items-center gap-2 pl-10 pr-3 py-1.5 hover:bg-white/5 transition-colors",
                            isProjSelected && "bg-white/5",
                          )}
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
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto min-h-0">
          {navItems.map((item) => {
            const activeViaChild = item.children?.some(c => (path + locationSearch) === c.path) ?? false;
            const active = activeViaChild || path === item.path || path.startsWith(item.path + "/");
            if (item.children?.length) {
              const isOpen = expandedMenus.has(item.title);
              return (
                <div key={item.path}>
                  <button
                    onClick={() => {
                      navigate(item.path);
                      setExpandedMenus(prev => { const next = new Set(prev); next.add(item.title); return next; });
                    }}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                      active
                        ? "text-primary"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-white",
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1 text-left">{item.title}</span>
                    <span
                      onClick={e => {
                        e.stopPropagation();
                        setExpandedMenus(prev => {
                          const next = new Set(prev);
                          next.has(item.title) ? next.delete(item.title) : next.add(item.title);
                          return next;
                        });
                      }}
                      className="p-0.5 rounded hover:bg-white/10"
                    >
                      <ChevronDown className={cn("h-3.5 w-3.5 shrink-0 transition-transform", isOpen && "rotate-180")} />
                    </span>
                  </button>
                  {isOpen && (
                    <div className="mt-0.5 ml-3 pl-3 border-l border-sidebar-border/50 space-y-0.5">
                      {item.children.map(child => {
                        const childActive = (path + locationSearch) === child.path;
                        return (
                          <Link
                            key={child.path}
                            to={child.path}
                            className={cn(
                              "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all",
                              childActive
                                ? "bg-primary text-primary-foreground"
                                : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-white",
                            )}
                          >
                            <child.icon className="h-3.5 w-3.5 shrink-0" />
                            <span>{child.title}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }
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

        {/* Context info */}
        <div className="px-3 py-3 border-t border-sidebar-border/50">
          {isClientCtx ? (
            <button
              onClick={() => navigate(`/agency/clients/${client!.id}/profile`)}
              className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-sidebar-accent/60 transition-colors text-left"
            >
              <img src={client!.logo} alt={client!.name} className="w-8 h-8 rounded-lg object-cover shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white truncate">{client!.name}</p>
                <p className="text-[11px] text-sidebar-foreground/60">Client</p>
              </div>
            </button>
          ) : (
            <button
              onClick={() => navigate("/agency/profile")}
              className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-sidebar-accent/60 transition-colors text-left"
            >
              <img src={AGENCY.logo} alt={AGENCY.name} className="w-8 h-8 rounded-lg object-cover shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white truncate">{AGENCY.name}</p>
                <p className="text-[11px] text-sidebar-foreground/60">Agency Admin</p>
              </div>
            </button>
          )}
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <header className="sticky top-0 z-10 h-16 shrink-0 border-b border-border bg-card flex items-center px-6 gap-4">

          {/* Context logo + label */}
          <div className="flex items-center gap-3 shrink-0">
            <img src={switcherLogo} alt={switcherLabel} className="w-9 h-9 rounded-xl object-cover shadow-sm" />
            <div className="hidden md:block">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest leading-none">{contextLabel}</p>
              <p className="text-sm font-semibold text-foreground leading-tight mt-0.5">{switcherLabel}</p>
            </div>
          </div>

          <div className="w-px self-stretch bg-border shrink-0" />

          {/* Title + Breadcrumb */}
          <div className="flex-1 min-w-0">
            <p className="text-xl font-bold text-foreground leading-tight truncate">{breadcrumbPage}</p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5 flex-wrap">
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
                  <span className="text-foreground">{breadcrumbPage}</span>
                </>
              ) : (
                <>
                  <span>Agency</span>
                  <ChevronRight className="w-3 h-3 shrink-0" />
                  <span className="text-foreground">{breadcrumbPage}</span>
                </>
              )}
            </div>
          </div>

          {/* Right: notifications + user */}
          <div className="flex items-center gap-3 shrink-0">
            <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
            </button>
            <div className="w-px h-6 bg-border" />
            <UserMenu onLogout={() => navigate("/login")} />
          </div>
        </header>

        <main className="flex-1 p-6 bg-muted/30">
          {children ?? <Outlet />}
        </main>
      </div>

      {/* Floating onboarding checklist — fixed bottom-right */}
      <AgencyOnboardingWidget />
    </div>
  );
};

export default AgencyLayout;
