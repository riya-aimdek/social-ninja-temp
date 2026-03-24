import { ReactNode, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { LayoutDashboard, Building, Users, CreditCard, Settings, ChevronDown, ExternalLink, Bell, Search, Check } from "lucide-react";
import SocialNinjaLogo from "@/components/SocialNinjaLogo";

const navItems = [
  { title: "Dashboard", path: "/agency/dashboard", icon: LayoutDashboard },
  { title: "Organizations", path: "/agency/organizations", icon: Building },
  { title: "Team Members", path: "/agency/team", icon: Users },
  { title: "Billing", path: "/agency/billing", icon: CreditCard },
  { title: "Settings", path: "/agency/settings", icon: Settings },
];

const mockOrgs = [
  { id: '1', name: 'RetailCo', initials: 'RC', color: 'bg-organization', industry: 'Retail', active: true },
  { id: '2', name: 'TechStart', initials: 'TS', color: 'bg-info', industry: 'Technology', active: true },
  { id: '3', name: 'FoodieHub', initials: 'FH', color: 'bg-warning', industry: 'Food & Beverage', active: true },
  { id: '4', name: 'HealthPlus', initials: 'HP', color: 'bg-success', industry: 'Healthcare', active: false },
];

interface AgencyLayoutProps {
  children: ReactNode;
  title?: string;
}

const AgencyLayout = ({ children, title }: AgencyLayoutProps) => {
  const location = useLocation();
  const [selectedOrg, setSelectedOrg] = useState(mockOrgs[0]);
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
  const [orgSearch, setOrgSearch] = useState('');

  const filteredOrgs = mockOrgs.filter(o => o.name.toLowerCase().includes(orgSearch.toLowerCase()));

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar - dark */}
      <aside className="w-60 shrink-0 bg-sidebar flex flex-col">
        <div className="p-5 border-b border-sidebar-border">
          <SocialNinjaLogo badge="Agency" badgeColor="text-agency" darkBg />
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? 'nav-item-active border-primary' : ''}`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 shrink-0 border-b border-border bg-card flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            {/* Org Switcher */}
            <div className="relative">
              <button
                onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
                className="flex items-center gap-2 h-9 px-3 bg-background border border-border rounded-lg hover:border-primary transition-colors"
              >
                <div className={`w-6 h-6 rounded-full ${selectedOrg.color} flex items-center justify-center text-[10px] font-bold text-white`}>
                  {selectedOrg.initials}
                </div>
                <span className="text-sm font-semibold text-foreground">{selectedOrg.name}</span>
                <ChevronDown className="h-3.5 w-3.5 text-text-secondary" />
              </button>
              {orgDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-card border border-border rounded-xl p-2 z-50 shadow-lg">
                  <div className="p-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
                      <input
                        className="input-dark h-8 pl-8 text-xs"
                        placeholder="Search organizations..."
                        value={orgSearch}
                        onChange={(e) => setOrgSearch(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="max-h-80 overflow-auto space-y-0.5">
                    {filteredOrgs.map((org) => (
                      <button
                        key={org.id}
                        onClick={() => { setSelectedOrg(org); setOrgDropdownOpen(false); setOrgSearch(''); }}
                        className={`w-full flex items-center gap-3 h-10 px-2 rounded-lg transition-colors ${selectedOrg.id === org.id ? 'bg-primary/10 border-l-2 border-primary' : 'hover:bg-muted'}`}
                      >
                        <div className={`w-7 h-7 rounded-full ${org.color} flex items-center justify-center text-[10px] font-bold text-white`}>
                          {org.initials}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="text-[13px] font-semibold text-foreground">{org.name}</div>
                          <div className="flex items-center gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${org.active ? 'bg-success' : 'bg-text-muted'}`} />
                            <span className="text-[11px] text-text-muted">{org.industry}</span>
                          </div>
                        </div>
                        {selectedOrg.id === org.id && <Check className="h-4 w-4 text-primary" />}
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-border mt-2 pt-2">
                    <Link to="/agency/organizations" onClick={() => setOrgDropdownOpen(false)} className="flex items-center gap-2 px-2 py-1.5 text-sm text-primary hover:bg-muted rounded-lg">
                      + Add Organization
                    </Link>
                  </div>
                </div>
              )}
            </div>
            {title && <h1 className="text-base font-semibold text-foreground">{title}</h1>}
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`https://social-ninja.lovable.app?org=${selectedOrg.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 h-9 px-3 border border-border rounded-lg text-sm text-foreground hover:bg-muted transition-colors"
            >
              Open {selectedOrg.name} in SocialNinja
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
              <Bell className="h-4 w-4 text-text-secondary" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-text-secondary">Agency Admin</span>
              <div className="w-8 h-8 rounded-full bg-agency/15 flex items-center justify-center text-agency text-xs font-semibold">AA</div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {location.pathname === '/agency/dashboard' && (
            <div className="text-xs text-text-secondary mb-4">Viewing: {selectedOrg.name}</div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
};

export default AgencyLayout;
