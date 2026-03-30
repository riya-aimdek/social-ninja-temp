import { useState } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard, Link2, Sparkles, CalendarDays, MessageSquare,
  BarChart3, Megaphone, Ear, MapPin, Settings, Search, Bell, ChevronDown, Menu,
  User, CreditCard, Users, BellRing, Hash, Shield, FolderKanban
} from "lucide-react";
import logoSvg from "@/assets/logo.svg";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/client/dashboard" },
  { label: "Connect", icon: Link2, path: "/client/connect" },
  { label: "Create", icon: Sparkles, path: "/client/create" },
  { label: "Publish", icon: CalendarDays, path: "/client/publish" },
  { label: "Engage", icon: MessageSquare, path: "/client/engage" },
  { label: "Analyze", icon: BarChart3, path: "/client/analyze" },
  { label: "Promote", icon: Megaphone, path: "/client/promote" },
  { label: "Listen", icon: Ear, path: "/client/listen" },
  { label: "Locations", icon: MapPin, path: "/client/locations" },
];

const settingsSubItems = [
  { label: "Profile", icon: User, path: "/client/settings/profile" },
  { label: "Billing", icon: CreditCard, path: "/client/settings/billing" },
  { label: "Team", icon: Users, path: "/client/settings/team" },
  { label: "Notifications", icon: BellRing, path: "/client/settings/notifications" },
  { label: "Hashtags", icon: Hash, path: "/client/settings/hashtags" },
  { label: "Security", icon: Shield, path: "/client/settings/security" },
];

const mockProjects = [
  { id: "p1", name: "Acme Sneakers" },
  { id: "p2", name: "Acme Apparel" },
  { id: "p3", name: "Acme Lifestyle Blog" },
];

export default function ClientLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(mockProjects[0]);
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const isSettingsActive = location.pathname.startsWith("/client/settings");

  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-[240px]" : "w-0 -ml-[240px]"} transition-all duration-200 bg-sidebar flex flex-col flex-shrink-0 border-r border-sidebar-border`}
      >
        <div className="p-5 flex items-center gap-2">
          <img src={logoSvg} alt="SocialNinja" className="h-8 w-auto" />
        </div>

        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive
                    ? "bg-sidebar-accent text-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`}
              >
                <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Settings with expandable sub-menu */}
        <div className="px-3 pb-2 border-t border-sidebar-border pt-2">
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 w-full
              ${isSettingsActive
                ? "bg-sidebar-accent text-primary"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
          >
            <Settings className="w-[18px] h-[18px] flex-shrink-0" />
            <span className="flex-1 text-left">Settings</span>
            <ChevronDown className={`w-3.5 h-3.5 opacity-50 transition-transform ${settingsOpen || isSettingsActive ? "rotate-180" : ""}`} />
          </button>

          {(settingsOpen || isSettingsActive) && (
            <div className="mt-1 space-y-0.5 pl-3">
              {settingsSubItems.map((sub) => {
                const isSubActive = location.pathname === sub.path;
                return (
                  <Link
                    key={sub.label}
                    to={sub.path}
                    className={`flex items-center gap-2.5 px-3 py-2 text-xs font-medium transition-colors rounded-md
                      ${isSubActive
                        ? "bg-sidebar-accent text-primary"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      }`}
                  >
                    <sub.icon className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{sub.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full gradient-coral flex items-center justify-center text-primary-foreground text-xs font-bold">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-sidebar-accent-foreground truncate">John Doe</p>
              <p className="text-[11px] text-sidebar-foreground truncate">Pro Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
            >
              <Menu className="w-4 h-4 text-muted-foreground" />
            </button>
            <div className="flex items-center gap-2 bg-accent/50 rounded-lg px-3 py-2 w-72">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                className="text-sm outline-none bg-transparent w-full placeholder:text-muted-foreground"
                placeholder="Search anything..."
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Project Switcher */}
            <div className="relative">
              <button
                onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-sm hover:bg-accent transition-colors"
              >
                <FolderKanban className="w-3.5 h-3.5 text-primary" />
                <span className="text-foreground font-medium">{selectedProject.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
              {projectDropdownOpen && (
                <div className="absolute right-0 top-full mt-1 w-56 bg-card border border-border rounded-xl shadow-lg z-50">
                  <div className="p-2 border-b border-border">
                    <p className="text-[11px] text-muted-foreground font-medium px-2 py-1">Acme Corp — Projects</p>
                  </div>
                  <div className="py-1">
                    {mockProjects.map(p => (
                      <button
                        key={p.id}
                        onClick={() => { setSelectedProject(p); setProjectDropdownOpen(false); }}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors ${selectedProject.id === p.id ? 'text-primary font-medium' : 'text-foreground'}`}
                      >
                        <FolderKanban className="w-3.5 h-3.5" />
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button className="relative p-2 rounded-lg hover:bg-accent transition-colors">
              <Bell className="w-[18px] h-[18px] text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary" />
            </button>
            <div className="w-8 h-8 rounded-full gradient-coral flex items-center justify-center text-primary-foreground text-xs font-bold cursor-pointer">
              JD
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
