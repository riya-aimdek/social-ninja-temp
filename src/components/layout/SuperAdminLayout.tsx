import { ReactNode, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { LayoutDashboard, Building2, Building, Users, CreditCard, ScrollText, Settings, Shield, ChevronDown, Search, Check, Bell } from "lucide-react";
import SocialNinjaLogo from "@/components/SocialNinjaLogo";
import RoleBadge from "@/components/RoleBadge";

const navItems = [
  { title: "Dashboard", path: "/super-admin/dashboard", icon: LayoutDashboard },
  { title: "Agencies", path: "/super-admin/agencies", icon: Building2 },
  { title: "Organizations", path: "/super-admin/organizations", icon: Building },
  { title: "Users", path: "/super-admin/users", icon: Users },
  { title: "Billing & Plans", path: "/super-admin/billing", icon: CreditCard },
  { title: "Audit Log", path: "/super-admin/audit-log", icon: ScrollText },
  { title: "Settings", path: "/super-admin/settings", icon: Settings },
  { title: "Permissions", path: "/super-admin/permissions", icon: Shield },
];

const mockOrgs = [
  { id: '1', name: 'Global Marketing', initials: 'GM', color: 'bg-primary' },
  { id: '2', name: 'Digital Spark', initials: 'DS', color: 'bg-agency' },
  { id: '3', name: 'BrandWave', initials: 'BW', color: 'bg-info' },
  { id: '4', name: 'CreativeFlow', initials: 'CF', color: 'bg-warning' },
];

interface SuperAdminLayoutProps {
  children: ReactNode;
  title: string;
}

const SuperAdminLayout = ({ children, title }: SuperAdminLayoutProps) => {
  const location = useLocation();
  const [selectedOrg, setSelectedOrg] = useState(mockOrgs[0]);
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
  const [orgSearch, setOrgSearch] = useState('');

  const filteredOrgs = mockOrgs.filter(o => o.name.toLowerCase().includes(orgSearch.toLowerCase()));

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar - white like SocialNinja */}
      <aside className="w-60 shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="p-5">
          <SocialNinjaLogo badge="Super Admin" badgeColor="text-super-admin" />
        </div>
        <nav className="flex-1 px-3 space-y-0.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? 'nav-item-active' : ''}`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
        {/* Bottom user section like SocialNinja */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-semibold">SA</div>
            <div>
              <p className="text-sm font-medium text-foreground">Admin User</p>
              <p className="text-xs text-text-muted">Super Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar - white like SocialNinja */}
        <header className="h-14 shrink-0 border-b border-border bg-card flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-base font-semibold text-foreground">{title}</h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Org Switcher dropdown like SocialNinja's "Global Marketing" */}
            <div className="relative">
              <button
                onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
                className="flex items-center gap-2 h-9 px-3 border border-border rounded-lg hover:border-primary transition-colors bg-card"
              >
                <span className="text-sm font-medium text-foreground">{selectedOrg.name}</span>
                <ChevronDown className="h-3.5 w-3.5 text-text-muted" />
              </button>
              {orgDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-card border border-border rounded-xl p-2 z-50 shadow-lg">
                  <div className="p-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
                      <input className="input-dark h-8 pl-8 text-xs" placeholder="Search..." value={orgSearch} onChange={e => setOrgSearch(e.target.value)} />
                    </div>
                  </div>
                  <div className="max-h-60 overflow-auto space-y-0.5">
                    {filteredOrgs.map(org => (
                      <button
                        key={org.id}
                        onClick={() => { setSelectedOrg(org); setOrgDropdownOpen(false); setOrgSearch(''); }}
                        className={`w-full flex items-center gap-3 h-10 px-2 rounded-lg transition-colors ${selectedOrg.id === org.id ? 'bg-primary/10' : 'hover:bg-muted'}`}
                      >
                        <div className={`w-7 h-7 rounded-full ${org.color} flex items-center justify-center text-[10px] font-bold text-white`}>{org.initials}</div>
                        <span className="text-[13px] font-medium text-foreground flex-1 text-left">{org.name}</span>
                        {selectedOrg.id === org.id && <Check className="h-4 w-4 text-primary" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
              <Bell className="h-4 w-4 text-text-secondary" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </button>

            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-semibold">SA</div>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
