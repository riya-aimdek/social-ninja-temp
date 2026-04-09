import { ReactNode } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard, Users, Wifi, BarChart3, MessageSquare, Settings,
  Bell, ExternalLink,
} from "lucide-react";
import SocialNinjaLogo from "@/components/SocialNinjaLogo";

const navItems = [
  { title: "Dashboard", path: "/client/dashboard", icon: LayoutDashboard },
  { title: "Social Profiles", path: "/client/profiles", icon: Wifi },
  { title: "Team", path: "/client/team", icon: Users },
  { title: "Analytics", path: "/client/analytics", icon: BarChart3 },
  { title: "Inbox", path: "/client/inbox", icon: MessageSquare },
  { title: "Settings", path: "/client/settings", icon: Settings },
];

interface OrgLayoutProps {
  children: ReactNode;
  title?: string;
}

const OrgLayout = ({ children, title }: OrgLayoutProps) => {
  const location = useLocation();

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
              <Link key={item.path} to={item.path} className={`nav-item ${isActive ? "nav-item-active" : ""}`}>
                <item.icon className="h-4 w-4 shrink-0" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
        <div className="px-3 py-3 border-t border-sidebar-border/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-client flex items-center justify-center text-white text-xs font-semibold shrink-0">RC</div>
            <div>
              <p className="text-sm font-semibold text-white">RetailCo</p>
              <p className="text-[11px] text-sidebar-foreground">Business</p>
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
            <a href="https://social-ninja.lovable.app?org=1" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 h-9 px-3 border border-border rounded-lg text-sm text-foreground hover:bg-muted transition-colors">
              Open in SocialNinja <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </button>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default OrgLayout;