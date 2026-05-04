import { ReactNode } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Building2, Building, Users, CreditCard, ScrollText,
  Bell, Settings, ChevronRight,
} from "lucide-react";
import SocialNinjaLogo from "@/components/SocialNinjaLogo";

const navItems = [
  { title: "Dashboard", path: "/super-admin/dashboard", icon: LayoutDashboard },
  { title: "Agencies", path: "/super-admin/agencies", icon: Building2 },
  { title: "Businesses", path: "/super-admin/clients", icon: Building },
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
  const navigate = useNavigate();
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
          <button
            onClick={() => navigate("/super-admin/profile")}
            className="w-full flex items-center gap-3 p-1.5 rounded-lg hover:bg-sidebar-accent/60 transition-colors text-left"
            title="View profile & settings"
          >
            <div className="w-8 h-8 rounded-full gradient-coral flex items-center justify-center text-white text-xs font-semibold shrink-0">SA</div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">John Doe</p>
              <p className="text-[11px] text-sidebar-foreground">Super Admin</p>
            </div>
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="py-5 shrink-0 border-b border-border bg-card flex items-center px-6 gap-5">
          {/* Context identifier */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1">Platform</p>
              <p className="text-sm font-semibold text-foreground">Super Admin</p>
            </div>
          </div>
          <div className="w-px self-stretch bg-border shrink-0" />
          {/* Page title + breadcrumb */}
          <div className="flex-1 min-w-0 flex flex-col gap-1.5">
            <h1 className="text-xl font-bold text-foreground truncate">{title}</h1>
            <div className="flex items-center gap-1 overflow-hidden whitespace-nowrap">
              <span className="text-xs text-muted-foreground shrink-0">Super Admin</span>
              <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />
              <span className="text-xs text-foreground font-medium truncate">{title}</span>
            </div>
          </div>
          {/* Notifications */}
          <div className="flex items-center gap-2 shrink-0">
            {notificationCount > 0 && (
              <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
                <Bell className="h-5 w-5 text-muted-foreground" />
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