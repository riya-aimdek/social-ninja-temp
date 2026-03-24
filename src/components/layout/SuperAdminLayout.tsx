import { ReactNode, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard, Building2, Building, Users, CreditCard, ScrollText, Shield, Settings,
  Bell, Menu, ChevronLeft,
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

interface SuperAdminLayoutProps {
  children: ReactNode;
  title: string;
}

const SuperAdminLayout = ({ children, title }: SuperAdminLayoutProps) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <aside className={`${collapsed ? 'w-16' : 'w-[180px]'} shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-200`}>
        <div className={`p-4 border-b border-sidebar-border/50 ${collapsed ? 'flex justify-center' : ''}`}>
          {collapsed ? (
            <span className="text-primary font-bold text-lg">N</span>
          ) : (
            <SocialNinjaLogo size="sm" darkBg />
          )}
        </div>

        <nav className={`flex-1 ${collapsed ? 'px-2' : 'px-3'} py-3 space-y-1`}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? 'nav-item-active' : ''} ${collapsed ? 'justify-center px-0' : ''}`}
                title={collapsed ? item.title : undefined}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{item.title}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Settings - regular nav item */}
        <div className={`${collapsed ? 'px-2' : 'px-3'} pb-2 border-t border-sidebar-border/50 pt-2`}>
          <Link
            to="/super-admin/settings"
            className={`nav-item ${location.pathname === '/super-admin/settings' ? 'nav-item-active' : ''} ${collapsed ? 'justify-center px-0' : ''}`}
            title={collapsed ? 'Settings' : undefined}
          >
            <Settings className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Settings</span>}
          </Link>
        </div>

        {/* User */}
        <div className={`${collapsed ? 'px-2' : 'px-3'} py-3 border-t border-sidebar-border/50`}>
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-semibold shrink-0">SA</div>
            {!collapsed && (
              <div>
                <p className="text-sm font-semibold text-white">John Doe</p>
                <p className="text-[11px] text-sidebar-foreground">Super Admin</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 shrink-0 border-b border-border bg-card flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 hover:bg-muted rounded-lg transition-colors">
              {collapsed ? <Menu className="h-4 w-4 text-text-secondary" /> : <ChevronLeft className="h-4 w-4 text-text-secondary" />}
            </button>
            <h1 className="text-base font-semibold text-foreground">{title}</h1>
          </div>

          <div className="flex items-center gap-3">
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
