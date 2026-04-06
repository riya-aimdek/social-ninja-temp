import { ReactNode, useState, useRef, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Globe, Users, ChevronDown, ChevronUp,
  Bell, Check, LogOut, Search,
} from "lucide-react";
import SocialNinjaLogo from "@/components/SocialNinjaLogo";

const navItems = [
  { title: "Dashboard", path: "/agency/dashboard", icon: LayoutDashboard },
  { title: "Clients", path: "/agency/clients", icon: Globe },
  { title: "Users", path: "/agency/team", icon: Users },
];

const mockAgencies = [
  { id: "1", name: "Agency", icon: "🏢" },
];

interface AgencyLayoutProps {
  children: ReactNode;
  title?: string;
}

const AgencyLayout = ({ children, title }: AgencyLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedAgency, setSelectedAgency] = useState(mockAgencies[0]);
  const [switcherOpen, setSwitcherOpen] = useState(false);
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

  // Derive breadcrumb from path
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const breadcrumbLabel = title || (pathSegments[1] ? pathSegments[1].charAt(0).toUpperCase() + pathSegments[1].slice(1) : "Dashboard");

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <aside className="w-[200px] shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="p-4 border-b border-sidebar-border/50">
          <SocialNinjaLogo size="sm" darkBg />
        </div>

        {/* Agency Switcher */}
        <div className="px-3 pt-3 relative" ref={switcherRef}>
          <button
            onClick={() => setSwitcherOpen(!switcherOpen)}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-sidebar-accent hover:bg-sidebar-accent/80 transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center text-sm shrink-0">🏢</div>
            <span className="text-[13px] font-semibold text-white truncate flex-1 text-left">{selectedAgency.name}</span>
            {switcherOpen ? <ChevronUp className="h-3.5 w-3.5 text-sidebar-foreground shrink-0" /> : <ChevronDown className="h-3.5 w-3.5 text-sidebar-foreground shrink-0" />}
          </button>

          {switcherOpen && (
            <div className="absolute left-3 right-3 top-full mt-1 w-[220px] bg-sidebar-accent border border-sidebar-border rounded-xl shadow-lg z-50 py-1">
              {mockAgencies.map(agency => (
                <button
                  key={agency.id}
                  onClick={() => { setSelectedAgency(agency); setSwitcherOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-sidebar-border/50 transition-colors"
                >
                  <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center text-xs">🏢</div>
                  <span className="text-white text-[13px]">{agency.name}</span>
                  {selectedAgency.id === agency.id && <Check className="h-4 w-4 text-primary ml-auto" />}
                </button>
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
            <div className="w-8 h-8 rounded-full gradient-coral flex items-center justify-center text-white text-xs font-semibold shrink-0">R</div>
            <div>
              <p className="text-sm font-semibold text-white">Riya Shah</p>
              <p className="text-[11px] text-sidebar-foreground">Xyz</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 shrink-0 border-b border-border bg-card flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Agency</span>
            <span className="text-sm text-muted-foreground">{'>'}</span>
            <span className="text-sm text-foreground font-medium">{breadcrumbLabel}</span>
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
                <p className="text-sm font-medium text-foreground">Riya Shah</p>
                <p className="text-[11px] text-muted-foreground">xyz</p>
              </div>
              <div className="w-8 h-8 rounded-full gradient-coral flex items-center justify-center text-white text-xs font-semibold">R</div>
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
