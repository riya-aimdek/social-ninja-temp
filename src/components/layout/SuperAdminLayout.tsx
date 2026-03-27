import { ReactNode, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard, Building2, Building, Users, CreditCard, ScrollText,
  Bell, Search, Settings,
} from "lucide-react";
import SocialNinjaLogo from "@/components/SocialNinjaLogo";

const navItems = [
  { title: "Dashboard", path: "/super-admin/dashboard", icon: LayoutDashboard },
  { title: "Agencies", path: "/super-admin/agencies", icon: Building2 },
  { title: "Clients", path: "/super-admin/clients", icon: Building },
  { title: "Users", path: "/super-admin/users", icon: Users },
  { title: "Billing & Plans", path: "/super-admin/billing", icon: CreditCard },
  { title: "Audit Log", path: "/super-admin/audit-log", icon: ScrollText },
  { title: "Settings", path: "/super-admin/settings", icon: Settings },
];

interface SuperAdminLayoutProps {
  children: ReactNode;
  title: string;
}

const SuperAdminLayout = ({ children, title }: SuperAdminLayoutProps) => {
  const location = useLocation();
  const [globalSearch, setGlobalSearch] = useState("");
  const notificationCount = 3;

  return (
    <div className="flex min-h-screen w-full">
      <aside className="w-[200px] shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="p-4 border-b border-sidebar-border/50">
          <SocialNinjaLogo size="sm" darkBg />
        </div>
        <nav className="flex-1 px-3 py-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
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
            <div className="w-8 h-8 rounded-full gradient-coral flex items-center justify-center text-white text-xs font-semibold shrink-0">SA</div>
            <div>
              <p className="text-sm font-semibold text-white">John Doe</p>
              <p className="text-[11px] text-sidebar-foreground">Super Admin</p>
            </div>
          </div>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 shrink-0 border-b border-border bg-card flex items-center justify-between px-6">
          <h1 className="text-base font-semibold text-foreground">{title}</h1>
          <div className="relative w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-muted/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors"
              placeholder="Search agencies, clients, users..."
              value={globalSearch}
              onChange={e => setGlobalSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            {notificationCount > 0 && (
              <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-primary rounded-full text-[10px] font-semibold text-primary-foreground flex items-center justify-center px-1">
                  {notificationCount}
                </span>
              </button>
            )}
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;