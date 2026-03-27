import { ReactNode, useState, useRef, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Building, Users, CreditCard, Settings,
  ChevronDown, ExternalLink, Bell, Check, Monitor, UserPlus,
  LogOut, Settings as SettingsIcon, Mail,
} from "lucide-react";
import SocialNinjaLogo from "@/components/SocialNinjaLogo";

const navItems = [
  { title: "Dashboard", path: "/agency/dashboard", icon: LayoutDashboard },
  { title: "Clients", path: "/agency/clients", icon: Building },
  { title: "Team Members", path: "/agency/team", icon: Users },
  { title: "Billing", path: "/agency/billing", icon: CreditCard },
  { title: "Settings", path: "/agency/settings", icon: Settings },
];

const mockClients = [
  { id: "1", name: "RetailCo", initials: "RC", color: "bg-client", industry: "Retail", active: true },
  { id: "2", name: "TechStart", initials: "TS", color: "bg-info", industry: "Technology", active: true },
  { id: "3", name: "FoodieHub", initials: "FH", color: "bg-warning", industry: "Food & Beverage", active: true },
  { id: "4", name: "HealthPlus", initials: "HP", color: "bg-success", industry: "Healthcare", active: false },
];

interface AgencyLayoutProps {
  children: ReactNode;
  title?: string;
}

const AgencyLayout = ({ children, title }: AgencyLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedClient, setSelectedClient] = useState(mockClients[0]);
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

  return (
    <div className="flex min-h-screen w-full">
      <aside className="w-[200px] shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="p-4 border-b border-sidebar-border/50">
          <SocialNinjaLogo size="sm" darkBg />
        </div>

        {/* Client Switcher */}
        <div className="px-3 pt-3 relative" ref={switcherRef}>
          <button
            onClick={() => setSwitcherOpen(!switcherOpen)}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-sidebar-accent hover:bg-sidebar-accent/80 transition-colors"
          >
            <div className={`w-7 h-7 rounded-full ${selectedClient.color} flex items-center justify-center text-[10px] font-bold text-white shrink-0`}>
              {selectedClient.initials}
            </div>
            <span className="text-[13px] font-semibold text-white truncate flex-1 text-left">{selectedClient.name}</span>
            <ChevronDown className="h-3.5 w-3.5 text-sidebar-foreground shrink-0" />
          </button>

          {switcherOpen && (
            <div className="absolute left-3 right-3 top-full mt-1 w-[280px] bg-card border border-border rounded-xl shadow-lg z-50">
              <div className="p-3 border-b border-border">
                <p className="text-sm font-semibold text-foreground">{selectedClient.name}</p>
                <p className="text-[11px] text-muted-foreground">Admin · Pro Plan</p>
              </div>
              <div className="py-1 border-b border-border">
                <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                  <Monitor className="h-4 w-4 text-muted-foreground" />
                  <span>App usage</span>
                  <span className="ml-auto text-xs text-muted-foreground">22 of 50 profiles</span>
                </button>
                <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                  <UserPlus className="h-4 w-4 text-muted-foreground" />
                  <span>Invite team members</span>
                </button>
              </div>
              <div className="py-1 border-b border-border max-h-48 overflow-auto">
                {mockClients.map(client => (
                  <button
                    key={client.id}
                    onClick={() => { setSelectedClient(client); setSwitcherOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-muted transition-colors"
                  >
                    {selectedClient.id === client.id ? (
                      <Check className="h-4 w-4 text-primary shrink-0" />
                    ) : (
                      <span className="w-4" />
                    )}
                    <span className={`text-foreground ${selectedClient.id === client.id ? 'font-medium' : ''}`}>{client.name}</span>
                  </button>
                ))}
              </div>
              <div className="py-1 border-b border-border">
                <Link to="/agency/billing" onClick={() => setSwitcherOpen(false)} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span>Billing</span>
                </Link>
              </div>
              <div className="p-3 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full gradient-coral flex items-center justify-center text-xs font-semibold text-white">JD</div>
                  <div>
                    <p className="text-sm font-medium text-foreground">john@agency.com</p>
                    <p className="text-[11px] text-muted-foreground">Admin</p>
                  </div>
                </div>
              </div>
              <div className="py-1">
                <Link to="/agency/settings" onClick={() => setSwitcherOpen(false)} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                  <SettingsIcon className="h-4 w-4 text-muted-foreground" />
                  <span>Manage account</span>
                </Link>
                <button onClick={() => { setSwitcherOpen(false); navigate("/login"); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                  <LogOut className="h-4 w-4 text-muted-foreground" />
                  <span>Log out</span>
                </button>
              </div>
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

        <div className="px-3 py-3 border-t border-sidebar-border/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full gradient-coral flex items-center justify-center text-white text-xs font-semibold shrink-0">JD</div>
            <div>
              <p className="text-sm font-semibold text-white">John Doe</p>
              <p className="text-[11px] text-sidebar-foreground">Pro Plan</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 shrink-0 border-b border-border bg-card flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            {title && <h1 className="text-base font-semibold text-foreground">{title}</h1>}
          </div>
          <div className="flex items-center gap-3">
            <a href={`https://social-ninja.lovable.app?org=${selectedClient.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 h-9 px-3 border border-border rounded-lg text-sm text-foreground hover:bg-muted transition-colors">
              Open in SocialNinja <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </button>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          {location.pathname === "/agency/dashboard" && <div className="text-xs text-muted-foreground mb-4">Viewing: {selectedClient.name}</div>}
          {children}
        </main>
      </div>
    </div>
  );
};

export default AgencyLayout;