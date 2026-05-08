import { useState, useRef, useEffect } from "react";
import { Outlet, useLocation, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, FolderOpen, Users, Link2, Sparkles, CalendarDays, MessageSquare,
  BarChart3, Megaphone, Ear, Settings, Bell, ChevronDown, ChevronUp, ChevronRight,
  LogOut, Globe, KanbanSquare, FileText, ShieldAlert, Bot, Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import SocialNinjaLogo from "@/components/SocialNinjaLogo";
import acmeCorpLogoSrc        from "@/assets/logos/acme-corp-logo.svg";
import sansLogoSrc            from "@/assets/logos/sans-logo.svg";
import socialCampaignLogoSrc  from "@/assets/logos/social-campaign-logo.svg";
import websiteRedesignLogoSrc from "@/assets/logos/website-redesign-logo.svg";
import brandLaunchLogoSrc     from "@/assets/logos/brand-launch-logo.svg";

/* ── Static data ─────────────────────────────────────────────────── */
const BUSINESSES = [
  { id: "b1", name: "Sans",      logo: sansLogoSrc     },
  { id: "b2", name: "Acme Corp", logo: acmeCorpLogoSrc },
];

const PROJECTS: Record<string, { id: string; name: string; logo: string }[]> = {
  b1: [
    { id: "p1", name: "Website Redesign", logo: websiteRedesignLogoSrc },
    { id: "p2", name: "Social Campaign",  logo: socialCampaignLogoSrc  },
  ],
  b2: [
    { id: "p3", name: "Brand Launch", logo: brandLaunchLogoSrc },
  ],
};

type Business = typeof BUSINESSES[0];
type Project  = { id: string; name: string; logo: string };

/* ── Nav lists ───────────────────────────────────────────────────── */
const businessNav = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/client/dashboard" },
  { label: "Projects",  icon: FolderOpen,      path: "/client/projects"  },
  { label: "Team",      icon: Users,           path: "/client/team"      },
  { label: "Settings",  icon: Settings,        path: "/client/settings"  },
];

type NavItem = {
  label: string;
  icon: React.FC<{ className?: string }>;
  path: string;
  children?: { label: string; icon: React.FC<{ className?: string }>; path: string }[];
};

const projectNav: NavItem[] = [
  { label: "Dashboard",      icon: LayoutDashboard, path: "/client/project/dashboard" },
  { label: "Team",           icon: Users,           path: "/client/project/team"      },
  { label: "Social Profiles",icon: Globe,           path: "/client/connect"           },
  { label: "Create",         icon: Sparkles,        path: "/client/create"            },
  { label: "Publish",        icon: CalendarDays,    path: "/client/publish"           },
  {
    label: "Engage", icon: MessageSquare, path: "/client/engage",
    children: [
      { label: "Comment Board", icon: KanbanSquare, path: "/client/engage"             },
      { label: "Posts",         icon: FileText,     path: "/client/engage/posts"       },
      { label: "Spam Queue",    icon: ShieldAlert,  path: "/client/engage/spam"        },
      { label: "Auto Replies",  icon: Bot,          path: "/client/engage/auto-replies"},
    ],
  },
  { label: "Analyze", icon: BarChart3, path: "/client/analyze" },
  { label: "Promote", icon: Megaphone, path: "/client/promote" },
  { label: "Listen",  icon: Ear,       path: "/client/listen"  },
];

/* ── Session helpers ─────────────────────────────────────────────── */
const ss = {
  getBusiness: ()  => sessionStorage.getItem("cl_business"),
  getProject:  ()  => sessionStorage.getItem("cl_project"),
  setBusiness: (id: string) => { sessionStorage.setItem("cl_business", id); sessionStorage.removeItem("cl_project"); },
  setProject:  (id: string) => sessionStorage.setItem("cl_project", id),
  clearProject: () => sessionStorage.removeItem("cl_project"),
};

function initBusiness(): Business {
  const id = ss.getBusiness();
  return (id ? BUSINESSES.find(b => b.id === id) : null) ?? BUSINESSES[0];
}
function initProject(bizId: string): Project | null {
  const id = ss.getProject();
  return id ? (PROJECTS[bizId]?.find(p => p.id === id) ?? null) : null;
}

/* ── Component ───────────────────────────────────────────────────── */
export default function ClientLayout() {
  const location = useLocation();
  const navigate  = useNavigate();

  const [business, setBusiness] = useState<Business>(() => initBusiness());
  const [project,  setProject]  = useState<Project | null>(() => initProject(initBusiness().id));
  const [switcherOpen,    setSwitcherOpen]    = useState(false);
  const [expandedBiz,     setExpandedBiz]     = useState<Set<string>>(() => new Set([initBusiness().id]));
  const [expandedMenus,   setExpandedMenus]   = useState<Set<string>>(new Set(["Engage"]));

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

  const isProjectCtx = !!project;
  const navItems     = isProjectCtx ? projectNav : businessNav;

  /* ── Handlers ── */
  function selectBusiness(b: Business) {
    setBusiness(b);
    setProject(null);
    ss.setBusiness(b.id);
    setExpandedBiz(prev => new Set([...prev, b.id]));
    setSwitcherOpen(false);
    navigate("/client/dashboard");
  }

  function selectProject(b: Business, p: Project) {
    setBusiness(b);
    setProject(p);
    ss.setBusiness(b.id);
    ss.setProject(p.id);
    setSwitcherOpen(false);
    navigate("/client/project/dashboard");
  }

  function backToBusiness() {
    setProject(null);
    ss.clearProject();
    navigate("/client/dashboard");
  }

  function toggleExpand(bizId: string, e: React.MouseEvent) {
    e.stopPropagation();
    setExpandedBiz(prev => {
      const n = new Set(prev);
      n.has(bizId) ? n.delete(bizId) : n.add(bizId);
      return n;
    });
  }

  /* ── Breadcrumb ── */
  const allItems = [
    ...businessNav,
    ...projectNav.flatMap(n => n.children ? [...n.children, n] : [n]),
    { label: "My Profile", path: "/client/profile" },
  ];
  const currentNav  = allItems.find(n => location.pathname === n.path)
    ?? allItems.find(n => location.pathname.startsWith(n.path + "/"));
  const breadcrumb  = currentNav?.label || "Dashboard";
  const parentNav   = projectNav.find(n => n.children?.some(c => location.pathname === c.path));

  const switcherLabel = isProjectCtx ? project!.name : business.name;
  const switcherLogo  = isProjectCtx ? project!.logo  : business.logo;
  const contextLabel  = isProjectCtx ? "Project" : "Business";

  /* ── Render ── */
  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans">

      {/* ── Sidebar ── */}
      <aside className="w-[220px] bg-sidebar flex flex-col flex-shrink-0 border-r border-sidebar-border">

        {/* Logo */}
        <div className="p-5 border-b border-sidebar-border/50">
          <SocialNinjaLogo size="md" darkBg />
        </div>

        {/* Switcher */}
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
              ? <ChevronUp className="w-3.5 h-3.5 text-sidebar-foreground shrink-0" />
              : <ChevronDown className="w-3.5 h-3.5 text-sidebar-foreground shrink-0" />
            }
          </button>

          {/* Dropdown */}
          {switcherOpen && (
            <div className="absolute left-3 right-0 top-full mt-1 w-[220px] bg-sidebar-accent border border-sidebar-border rounded-xl shadow-xl z-50 py-1.5 max-h-[380px] overflow-y-auto">
              {BUSINESSES.map(b => {
                const projects    = PROJECTS[b.id] || [];
                const isExpanded  = expandedBiz.has(b.id);
                const isSelected  = business.id === b.id;

                return (
                  <div key={b.id}>
                    {/* Business row */}
                    <div className="flex items-center">
                      <button
                        onClick={() => selectBusiness(b)}
                        className="flex-1 flex items-center gap-2.5 px-3 py-2 hover:bg-white/5 transition-colors min-w-0"
                      >
                        <img src={b.logo} alt={b.name} className="w-6 h-6 rounded-lg object-cover shrink-0" />
                        <span className={cn("text-[13px] flex-1 text-left truncate font-medium", isSelected ? "text-primary" : "text-white")}>
                          {b.name}
                        </span>
                        {isSelected && !isProjectCtx && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                      </button>
                      {projects.length > 0 && (
                        <button
                          onClick={e => toggleExpand(b.id, e)}
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
                      const isProj = project?.id === p.id;
                      return (
                        <button
                          key={p.id}
                          onClick={() => selectProject(b, p)}
                          className="w-full flex items-center gap-2 pl-10 pr-3 py-1.5 hover:bg-white/5 transition-colors"
                        >
                          <FolderOpen className={cn("w-3.5 h-3.5 shrink-0", isProj ? "text-primary" : "text-sidebar-foreground/50")} />
                          <span className={cn("text-[12px] flex-1 text-left truncate", isProj ? "text-primary font-semibold" : "text-white/70")}>
                            {p.name}
                          </span>
                          {isProj && <Check className="h-3 w-3 text-primary shrink-0" />}
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
          {(navItems as NavItem[]).map(item => {
            const hasChildren = !!item.children?.length;
            const isActive    = hasChildren
              ? item.children!.some(c => location.pathname === c.path)
              : location.pathname === item.path || location.pathname.startsWith(item.path + "/");
            const isExpanded  = expandedMenus.has(item.label);

            return (
              <div key={item.label}>
                {hasChildren ? (
                  <>
                    <button
                      onClick={() => setExpandedMenus(prev => {
                        const n = new Set(prev);
                        n.has(item.label) ? n.delete(item.label) : n.add(item.label);
                        return n;
                      })}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                        isActive
                          ? "text-primary"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-white",
                      )}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <span className="flex-1 text-left">{item.label}</span>
                      <ChevronDown className={cn("w-3.5 h-3.5 shrink-0 transition-transform duration-200", isExpanded && "rotate-180")} />
                    </button>
                    {isExpanded && (
                      <div className="mt-0.5 ml-3 pl-3 border-l border-sidebar-border/50 space-y-0.5">
                        {item.children!.map(child => {
                          const childActive = location.pathname === child.path;
                          return (
                            <Link
                              key={child.label}
                              to={child.path}
                              className={cn(
                                "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all",
                                childActive
                                  ? "bg-primary text-primary-foreground"
                                  : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-white",
                              )}
                            >
                              <child.icon className="w-3.5 h-3.5 flex-shrink-0" />
                              <span>{child.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-white",
                    )}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        {/* User */}
        <div className="px-3 py-3 border-t border-sidebar-border/50">
          <button
            onClick={() => navigate("/client/profile")}
            className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-sidebar-accent/60 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-full gradient-coral flex items-center justify-center text-white text-xs font-bold shrink-0">
              {business.name[0]}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">{business.name}</p>
              <p className="text-[11px] text-sidebar-foreground/60">Business</p>
            </div>
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <header className="h-16 border-b border-border bg-card flex items-center px-6 gap-4 flex-shrink-0">

          {/* Context logo */}
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
            <p className="text-xl font-bold text-foreground leading-tight truncate">{breadcrumb}</p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap mt-0.5">
              {isProjectCtx ? (
                <>
                  <button onClick={backToBusiness} className="hover:text-foreground transition-colors truncate max-w-[120px]">
                    {business.name}
                  </button>
                  <ChevronRight className="w-3 h-3 shrink-0" />
                  <span className="text-muted-foreground truncate max-w-[120px]">{project!.name}</span>
                  <ChevronRight className="w-3 h-3 shrink-0" />
                  {parentNav && (
                    <>
                      <span className="text-muted-foreground">{parentNav.label}</span>
                      <ChevronRight className="w-3 h-3 shrink-0" />
                    </>
                  )}
                </>
              ) : (
                <>
                  <span className="text-muted-foreground truncate max-w-[120px]">{business.name}</span>
                  <ChevronRight className="w-3 h-3 shrink-0" />
                </>
              )}
              <span className="text-foreground">{breadcrumb}</span>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2 shrink-0">
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
            </button>
            <button
              onClick={() => navigate("/login")}
              className="p-1.5 hover:bg-muted rounded-lg transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-6 pt-6 pb-8 bg-muted/30">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
