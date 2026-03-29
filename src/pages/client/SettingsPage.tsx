import { useState } from "react";
import {
  User, CreditCard, Users, Bell, Hash, Shield, Save,
  Upload, Plus, Trash2
} from "lucide-react";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "team", label: "Team", icon: Users },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "hashtags", label: "Hashtags", icon: Hash },
  { id: "security", label: "Security", icon: Shield },
];

const teamMembers = [
  { name: "John Doe", email: "john@socialninja.com", role: "Admin", avatar: "JD" },
  { name: "Sarah Wilson", email: "sarah@socialninja.com", role: "Creator", avatar: "SW" },
  { name: "Mike Chen", email: "mike@socialninja.com", role: "Analyst", avatar: "MC" },
  { name: "Emma Davis", email: "emma@socialninja.com", role: "Approver", avatar: "ED" },
];

const notifications = [
  { label: "New post published", email: true, inApp: true },
  { label: "Approval request", email: true, inApp: true },
  { label: "Approval accepted", email: false, inApp: true },
  { label: "Approval rejected", email: true, inApp: true },
  { label: "New team member", email: true, inApp: false },
  { label: "Profile update", email: false, inApp: true },
];

const hashtagSuites = [
  { name: "Social Marketing", tags: ["#socialmedia", "#marketing", "#digitalmarketing", "#smm", "#contentcreation"] },
  { name: "AI & Tech", tags: ["#AI", "#machinelearning", "#automation", "#tech", "#innovation"] },
  { name: "Growth", tags: ["#growth", "#startup", "#entrepreneur", "#business", "#success"] },
];

export default function SettingsPage({ defaultTab = "profile" }: { defaultTab?: string }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const title = tabs.find(t => t.id === activeTab);

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
        {title && <title.icon className="w-6 h-6 text-primary" />} {title?.label || "Settings"}
      </h1>

      <div>
          {activeTab === "profile" && (
            <div className="bg-card rounded-xl shadow-card p-6 space-y-5">
              <h2 className="text-lg font-semibold text-foreground">Profile Settings</h2>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full gradient-coral flex items-center justify-center text-primary-foreground text-xl font-bold">JD</div>
                <button className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-accent transition-colors flex items-center gap-1">
                  <Upload className="w-3 h-3" /> Upload Photo
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Full Name</label>
                  <input className="w-full px-3 py-2 rounded-lg border border-input text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" defaultValue="John Doe" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Email</label>
                  <input className="w-full px-3 py-2 rounded-lg border border-input text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" defaultValue="john@socialninja.com" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Phone</label>
                  <input className="w-full px-3 py-2 rounded-lg border border-input text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" defaultValue="+1 (555) 123-4567" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Timezone</label>
                  <select className="w-full px-3 py-2 rounded-lg border border-input text-sm outline-none bg-card">
                    <option>America/New_York (EST)</option>
                    <option>America/Los_Angeles (PST)</option>
                    <option>Europe/London (GMT)</option>
                  </select>
                </div>
              </div>
              <button className="px-4 py-2 rounded-lg gradient-coral text-primary-foreground text-sm font-medium shadow-coral hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-2">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          )}

          {activeTab === "billing" && (
            <div className="bg-card rounded-xl shadow-card p-6 space-y-5">
              <h2 className="text-lg font-semibold text-foreground">Subscription & Billing</h2>
              <div className="border border-primary/20 rounded-xl p-4 bg-primary/5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Pro Plan</p>
                    <p className="text-xs text-muted-foreground">$49/month • Renews Mar 28, 2026</p>
                  </div>
                  <span className="badge-active text-xs px-2 py-1 rounded-full font-medium">Active</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Accounts Connected</span>
                  <span className="font-medium text-foreground">3 / 10</span>
                </div>
                <div className="w-full h-2 bg-accent rounded-full overflow-hidden">
                  <div className="h-full gradient-coral rounded-full" style={{ width: "30%" }} />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Posts This Month</span>
                  <span className="font-medium text-foreground">18 / 100</span>
                </div>
                <div className="w-full h-2 bg-accent rounded-full overflow-hidden">
                  <div className="h-full gradient-coral rounded-full" style={{ width: "18%" }} />
                </div>
              </div>
              <button className="px-4 py-2 rounded-lg gradient-coral text-primary-foreground text-sm font-medium shadow-coral hover:opacity-90 transition-all">
                Upgrade Plan
              </button>
            </div>
          )}

          {activeTab === "team" && (
            <div className="bg-card rounded-xl shadow-card p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Team Members</h2>
                <button className="px-3 py-1.5 rounded-lg gradient-coral text-primary-foreground text-xs font-medium shadow-coral hover:opacity-90 transition-all flex items-center gap-1">
                  <Plus className="w-3 h-3" /> Invite
                </button>
              </div>
              <div className="space-y-2">
                {teamMembers.map((m) => (
                  <div key={m.email} className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/30 transition-colors">
                    <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-foreground">{m.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{m.name}</p>
                      <p className="text-[11px] text-muted-foreground">{m.email}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-accent text-foreground font-medium">{m.role}</span>
                    <button className="p-1.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="bg-card rounded-xl shadow-card p-6 space-y-5">
              <h2 className="text-lg font-semibold text-foreground">Notification Preferences</h2>
              <div className="space-y-0">
                <div className="grid grid-cols-3 text-xs text-muted-foreground font-medium px-3 py-2">
                  <span>Event</span>
                  <span className="text-center">Email</span>
                  <span className="text-center">In-App</span>
                </div>
                {notifications.map((n) => (
                  <div key={n.label} className="grid grid-cols-3 items-center px-3 py-3 border-t border-border text-sm">
                    <span className="text-foreground">{n.label}</span>
                    <div className="text-center">
                      <input type="checkbox" defaultChecked={n.email} className="accent-primary" />
                    </div>
                    <div className="text-center">
                      <input type="checkbox" defaultChecked={n.inApp} className="accent-primary" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "hashtags" && (
            <div className="bg-card rounded-xl shadow-card p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Hashtag Suites</h2>
                <button className="px-3 py-1.5 rounded-lg gradient-coral text-primary-foreground text-xs font-medium shadow-coral hover:opacity-90 transition-all flex items-center gap-1">
                  <Plus className="w-3 h-3" /> New Suite
                </button>
              </div>
              {hashtagSuites.map((suite) => (
                <div key={suite.name} className="border border-border rounded-xl p-4">
                  <p className="text-sm font-semibold text-foreground mb-2">{suite.name}</p>
                  <div className="flex flex-wrap gap-2">
                    {suite.tags.map((tag) => (
                      <span key={tag} className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "security" && (
            <div className="bg-card rounded-xl shadow-card p-6 space-y-5">
              <h2 className="text-lg font-semibold text-foreground">Security Settings</h2>
              <div className="border border-border rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Two-Factor Authentication</p>
                    <p className="text-xs text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg gradient-coral text-primary-foreground text-xs font-medium shadow-coral hover:opacity-90 transition-all">
                    Enable 2FA
                  </button>
                </div>
              </div>
              <div className="border border-border rounded-xl p-4">
                <p className="text-sm font-semibold text-foreground mb-2">Change Password</p>
                <div className="space-y-3 max-w-sm">
                  <input type="password" className="w-full px-3 py-2 rounded-lg border border-input text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Current password" />
                  <input type="password" className="w-full px-3 py-2 rounded-lg border border-input text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="New password" />
                  <button className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-accent transition-colors">Update Password</button>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
