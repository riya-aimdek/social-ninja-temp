import { ReactNode, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Building,
  Users,
  CreditCard,
  ScrollText,
  Shield,
  ChevronDown,
  Search,
  Check,
  Bell,
  Settings,
} from "lucide-react";
import SocialNinjaLogo from "@/components/SocialNinjaLogo";

const navItems = [
  { title: "Dashboard", path: "/super-admin/dashboard", icon: LayoutDashboard },
  { title: "Agencies", path: "/super-admin/agencies", icon: Building2 },
  { title: "Organizations", path: "/super-admin/organizations", icon: Building },
  { title: "Users", path: "/super-admin/users", icon: Users },
  { title: "Billing & Plans", path: "/super-admin/billing", icon: CreditCard },
  { title: "Audit Log", path: "/super-admin/audit-log", icon: ScrollText },
  { title: "Permissions", path: "/super-admin/permissions", icon: Shield },
];

const mockOrgs = [
  { id: "1", name: "Global Marketing", initials: "GM", color: "bg-primary" },
  { id: "2", name: "Platform Core", initials: "PC", color: "bg-super-admin" },
  { id: "3", name: "Enterprise Ops", initials: "EO", color: "bg-info" },
  { id: "4", name: "Growth Team", initials: "GT", color: "bg-warning" },
];

interface SuperAdminLayoutProps {
  children: ReactNode;
  title: string;
}

const SuperAdminLayout = ({ children, title }: SuperAdminLayoutProps) => {
  const location = useLocation();
  const [selectedOrg, setSelectedOrg] = useState(mockOrgs[0]);
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
  const [orgSearch, setOrgSearch] = useState("");

  const filteredOrgs = mockOrgs.filter((o) => o.name.toLowerCase().includes(orgSearch.toLowerCase()));

  return (
    <div className="flex min-h-screen w-full">
      <aside className="w-[300px] shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="p-5 border-b border-sidebar-border/50">
          <SocialNinjaLogo badge="Super Admin" badgeColor="text-super-admin" darkBg />
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} className={`nav-item ${isActive ? "nav-item-active" : ""}`}>
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-4 pb-3 border-t border-sidebar-border/50 pt-3">
          <Link to="/super-admin/settings" className="nav-item w-full justify-between">
            <span className="flex items-center gap-3">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </span>
            <ChevronDown className="h-4 w-4 opacity-70" />
          </Link>
        </div>

        <div className="px-4 py-4 border-t border-sidebar-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-sm font-semibold">SA</div>
            <div>
              <p className="text-sm font-semibold text-white">John Doe</p>
              <p className="text-xs text-sidebar-foreground">Super Admin</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 shrink-0 border-b border-border bg-card flex items-center justify-between px-6">
          <h1 className="text-base font-semibold text-foreground">{title}</h1>

          <div className="flex items-center gap-3">
            {/* Yes — this is a real Super Admin org dropdown */}
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
                      <input
                        className="input-dark h-8 pl-8 text-xs"
                        placeholder="Search organizations..."
                        value={orgSearch}
                        onChange={(e) => setOrgSearch(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="max-h-60 overflow-auto space-y-0.5">
                    {filteredOrgs.map((org) => (
                      <button
                        key={org.id}
                        onClick={() => {
                          setSelectedOrg(org);
                          setOrgDropdownOpen(false);
                          setOrgSearch("");
                        }}
                        className={`w-full flex items-center gap-3 h-10 px-2 rounded-lg transition-colors ${selectedOrg.id === org.id ? "bg-primary/10" : "hover:bg-muted"}`}
                      >
                        <div className={`w-7 h-7 rounded-full ${org.color} flex items-center justify-center text-[10px] font-bold text-white`}>
                          {org.initials}
                        </div>
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

        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
