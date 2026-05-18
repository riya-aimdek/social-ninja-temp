import { useState, useRef, useEffect } from "react";
import { Outlet, useLocation, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, FolderOpen, Users, Link2, Sparkles, CalendarDays, MessageSquare,
  BarChart3, Megaphone, Ear, Settings, Bell, ChevronDown, ChevronUp, ChevronRight,
  LogOut, Globe, KanbanSquare, FileText, ShieldAlert, Bot, Check,
  TrendingUp, Trophy, FileDown,
  UserCircle, SlidersHorizontal, Building2, CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import SocialNinjaLogo from "@/components/SocialNinjaLogo";
import OnboardingWidget from "@/components/onboarding/OnboardingWidget";
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
  {
    label: "Analyze", icon: BarChart3, path: "/client/analyze",
    children: [
      { label: "Intelligence Layer",   icon: Sparkles,   path: "/client/analyze?view=intelligence" },
      { label: "Post Performance",     icon: FileText,   path: "/client/analyze?view=posts"        },
      { label: "Growth Insights", icon: TrendingUp, path: "/client/analyze?view=growth"       },
      { label: "Competitor Analysis",  icon: Trophy,     path: "/client/analyze?view=competitors"  },
      { label: "Create Report",        icon: FileDown,   path: "/client/analyze?view=report"       },
    ],
  },
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

/* ── User menu ───────────────────────────────────────────────────── */
const LOGGED_IN_USER = { name: "Riya Shah", role: "Business Admin", initials: "RS" };
const ADMIN_ROLES = ["Business Admin", "Client Admin", "Super Admin"];

function UserMenu({ onLogout }: { onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const isAdmin = ADMIN_ROLES.includes(LOGGED_IN_USER.role);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const keyHandler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", keyHandler);
    return () => { document.removeEventListener("mousedown", handler); document.removeEventListener("keydown", keyHandler); };
  }, []);

  const menuItem = (icon: React.ReactNode, label: string, _sub: string, href: string) => (
    <button
      onClick={() => { setOpen(false); navigate(href); }}
      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#F5F5F5] transition-colors text-left text-muted-foreground hover:text-foreground"
    >
      {icon}
      <p className="text-[13px] font-medium text-foreground leading-tight">{label}</p>
    </button>
  );

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
      >
        <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-[11px] font-bold shrink-0">
          {LOGGED_IN_USER.initials}
        </div>
        <div className="text-left leading-none">
          <div className="flex items-center gap-1">
            <p className="text-[13px] font-semibold text-foreground">{LOGGED_IN_USER.name}</p>
            <ChevronDown className={cn("w-3 h-3 text-muted-foreground transition-transform shrink-0", open && "rotate-180")} />
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">{LOGGED_IN_USER.role}</p>
        </div>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-[260px] bg-white border border-border rounded-xl shadow-xl z-50 p-2 overflow-hidden">

          {/* Identity block */}
          <div className="flex items-center gap-3 px-3 py-3 mb-1 rounded-lg bg-[#F8F9FA]">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold shrink-0">
              {LOGGED_IN_USER.initials}
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-foreground leading-tight">{LOGGED_IN_USER.name}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{LOGGED_IN_USER.role}</p>
            </div>
          </div>

          {/* MY ACCOUNT */}
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#888888] px-3 pt-3 pb-1">My Account</p>
          {menuItem(<UserCircle className="w-4 h-4" />, "My Profile", "", "/client/profile")}
          {menuItem(<SlidersHorizontal className="w-4 h-4" />, "Preferences", "", "/client/preferences")}

          {/* BUSINESS — admin only */}
          {isAdmin && (
            <>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#888888] px-3 pt-3 pb-1">Business</p>
              {menuItem(<CreditCard className="w-4 h-4" />, "Business Settings", "", "/client/settings")}
            </>
          )}

          {/* Divider + Logout */}
          <div className="border-t border-[#EEEEEE] mt-2 pt-1">
            <button
              onClick={() => { setOpen(false); onLogout(); }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#F5F5F5] transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
                <LogOut className="w-4 h-4 text-destructive" />
              </div>
              <p className="text-[13px] font-medium text-destructive">Log out</p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Component ───────────────────────────────────────────────────── */
export default function ClientLayout() {
  const location = useLocation();
  const navigate  = useNavigate();

  const [business, setBusiness] = useState<Business>(() => initBusiness());
  const [project,  setProject]  = useState<Project | null>(() => initProject(initBusiness().id));
  const [switcherOpen,    setSwitcherOpen]    = useState(false);
  const [expandedBiz,     setExpandedBiz]     = useState<Set<string>>(() => new Set([initBusiness().id]));
  const [expandedMenus,   setExpandedMenus]   = useState<Set<string>>(new Set(["Engage", "Analyze"]));

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
    <div className="flex bg-background font-sans">

      {/* ── Sidebar ── */}
      <aside className="w-[220px] bg-sidebar flex flex-col flex-shrink-0 border-r border-sidebar-border sticky top-0 h-screen">

        {/* Logo */}
        <div className="p-4 border-b border-sidebar-border/50">
          <SocialNinjaLogo size="sm" darkBg />
        </div>

        {/* Switcher */}
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
              ? <ChevronUp className="w-3.5 h-3.5 text-sidebar-foreground shrink-0" />
              : <ChevronDown className="w-3.5 h-3.5 text-sidebar-foreground shrink-0" />
            }
          </button>

          {/* Dropdown */}
          {switcherOpen && (
            <div className="absolute left-3 right-3 top-full mt-1 bg-sidebar-accent border border-sidebar-border rounded-xl shadow-xl z-50 py-2 max-h-[380px] overflow-y-auto">
              {BUSINESSES.map((b, bIdx) => {
                const projects    = PROJECTS[b.id] || [];
                const isExpanded  = expandedBiz.has(b.id);
                const isSelected  = business.id === b.id;

                return (
                  <div key={b.id}>
                    {/* Section label per business */}
                    {bIdx === 0 && (
                      <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">Business</p>
                    )}

                    {/* Business row */}
                    <div className="flex items-center">
                      <button
                        onClick={() => selectBusiness(b)}
                        className={cn(
                          "flex-1 flex items-center gap-2.5 px-3 py-2 hover:bg-white/5 transition-colors min-w-0",
                          isSelected && !isProjectCtx && "bg-white/5",
                        )}
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

                    {/* Projects under this business */}
                    {isExpanded && projects.length > 0 && (
                      <>
                        <p className="px-3 pt-1.5 pb-0.5 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">Projects</p>
                        {projects.map(p => {
                          const isProj = project?.id === p.id;
                          return (
                            <button
                              key={p.id}
                              onClick={() => selectProject(b, p)}
                              className={cn(
                                "w-full flex items-center gap-2 pl-6 pr-3 py-1.5 hover:bg-white/5 transition-colors",
                                isProj && "bg-white/5",
                              )}
                            >
                              <FolderOpen className={cn("w-3.5 h-3.5 shrink-0", isProj ? "text-primary" : "text-sidebar-foreground/50")} />
                              <span className={cn("text-[12px] flex-1 text-left truncate", isProj ? "text-primary font-semibold" : "text-white/70")}>
                                {p.name}
                              </span>
                              {isProj && <Check className="h-3 w-3 text-primary shrink-0" />}
                            </button>
                          );
                        })}
                      </>
                    )}

                    {/* Divider between businesses */}
                    {bIdx < BUSINESSES.length - 1 && (
                      <div className="h-px bg-sidebar-border/50 mx-2 my-2" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto min-h-0">
          {(navItems as NavItem[]).map(item => {
            const hasChildren = !!item.children?.length;
            const isActive    = hasChildren
              ? item.children!.some(c => (location.pathname + location.search) === c.path)
              : location.pathname === item.path || location.pathname.startsWith(item.path + "/");
            const isExpanded  = expandedMenus.has(item.label);

            return (
              <div key={item.label}>
                {hasChildren ? (
                  <>
                    <button
                      onClick={() => {
                        navigate(item.path);
                        setExpandedMenus(prev => { const n = new Set(prev); n.add(item.label); return n; });
                      }}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                        isActive
                          ? "text-primary"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-white",
                      )}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <span className="flex-1 text-left">{item.label}</span>
                      <span
                        onClick={e => {
                          e.stopPropagation();
                          setExpandedMenus(prev => {
                            const n = new Set(prev);
                            n.has(item.label) ? n.delete(item.label) : n.add(item.label);
                            return n;
                          });
                        }}
                        className="p-0.5 rounded hover:bg-white/10"
                      >
                        <ChevronDown className={cn("w-3.5 h-3.5 shrink-0 transition-transform duration-200", isExpanded && "rotate-180")} />
                      </span>
                    </button>
                    {isExpanded && (
                      <div className="mt-0.5 ml-3 pl-3 border-l border-sidebar-border/50 space-y-0.5">
                        {item.children!.map(child => {
                          const childActive = (location.pathname + location.search) === child.path;
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

      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <header className="sticky top-0 z-10 h-16 shrink-0 border-b border-border bg-card flex items-center px-6 gap-4">

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
          <div className="flex items-center gap-3 shrink-0">
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
            </button>
            <div className="w-px h-6 bg-border" />
            <UserMenu onLogout={() => navigate("/login")} />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 bg-muted/30">
          <Outlet />
        </main>
      </div>

      {/* Floating onboarding checklist — fixed bottom-right, never affects layout */}
      <OnboardingWidget />
    </div>
  );
}
