import { ReactNode } from "react";
import { useLocation, Link } from "react-router-dom";
import { LayoutDashboard, Building2, Building, Users, CreditCard, ScrollText, Settings, Shield } from "lucide-react";
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

interface SuperAdminLayoutProps {
  children: ReactNode;
  title: string;
}

const SuperAdminLayout = ({ children, title }: SuperAdminLayoutProps) => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 border-r border-border bg-background flex flex-col">
        <div className="p-5 border-b border-border">
          <SocialNinjaLogo badge="Super Admin" badgeColor="text-super-admin" />
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? 'nav-item-active border-super-admin' : ''}`}
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
        <header className="h-14 shrink-0 border-b border-border bg-background flex items-center justify-between px-6">
          <h1 className="text-base font-semibold text-foreground">{title}</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-text-secondary">Admin User</span>
            <RoleBadge role="super-admin" />
            <div className="w-8 h-8 rounded-full bg-super-admin/20 flex items-center justify-center text-super-admin text-xs font-semibold">SA</div>
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
