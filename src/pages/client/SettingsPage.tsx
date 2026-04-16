import { useState } from "react";
import {
  User, CreditCard, Users, Bell, Hash, Shield, Save,
  Upload, Plus, Trash2, MessageSquare, Tag, Check, AlertCircle, Download, X
} from "lucide-react";
import { teamMembers, connectedAccounts, totalPosts, socialAccounts } from "@/data/businessMockData";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "team", label: "Team", icon: Users },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "hashtags", label: "Hashtags", icon: Hash },
  { id: "saved-replies", label: "Saved Replies", icon: MessageSquare },
  { id: "tags", label: "Tags", icon: Tag },
  { id: "security", label: "Security", icon: Shield },
];

const notifications = [
  { label: "Profile updates", email: true, inApp: true },
  { label: "New user added", email: true, inApp: true },
  { label: "New social profile connected", email: true, inApp: true },
  { label: "New post created", email: false, inApp: true },
  { label: "Approval requested", email: true, inApp: true },
  { label: "Approval accepted", email: false, inApp: true },
  { label: "Approval rejected", email: true, inApp: true },
];

const hashtagSuites = [
  { name: "Coffee", tags: ["#coffee", "#coffeetime", "#coffeelover", "#cafe", "#coffeeshop", "#coffeeaddict", "#espresso", "#barista", "#latte"] },
  { name: "Social Marketing", tags: ["#socialmedia", "#marketing", "#digitalmarketing", "#smm", "#contentcreation"] },
  { name: "Growth", tags: ["#growth", "#startup", "#entrepreneur", "#business", "#success"] },
];

const savedReplies = [
  { name: "Thank You", text: "Thank you for reaching out! We'll get back to you shortly." },
  { name: "Price Request", text: "Thanks for your interest! Please visit our website for the latest pricing details." },
  { name: "Complaint", text: "We're sorry to hear about your experience. Could you DM us the details so we can help resolve this?" },
];

const messageTags = [
  { name: "Complaint", color: "bg-red-100 text-red-700" },
  { name: "Price Request", color: "bg-blue-100 text-blue-700" },
  { name: "Product Inquiry", color: "bg-purple-100 text-purple-700" },
  { name: "Potential Lead", color: "bg-green-100 text-green-700" },
  { name: "Positive Feedback", color: "bg-emerald-100 text-emerald-700" },
];

const passwordRules = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "1 uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "1 number", test: (p: string) => /\d/.test(p) },
  { label: "1 special character", test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

export default function SettingsPage({ defaultTab = "profile" }: { defaultTab?: string }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [newPassword, setNewPassword] = useState("");
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const title = tabs.find(t => t.id === activeTab);

  // Use shared data for billing stats
  const connectedCount = connectedAccounts.length;
  const totalPlatforms = socialAccounts.length;

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
              <div className="w-16 h-16 rounded-full gradient-coral flex items-center justify-center text-primary-foreground text-xl font-bold">JS</div>
              <button className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-accent transition-colors flex items-center gap-1">
                <Upload className="w-3 h-3" /> Upload Photo
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Full Name</label>
                <input className="w-full px-3 py-2 rounded-lg border border-input text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" defaultValue="John Smith" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Email</label>
                <div className="relative">
                  <input className="w-full px-3 py-2 rounded-lg border border-input text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all pr-20" defaultValue="john@business.com" />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] bg-success/10 text-success px-1.5 py-0.5 rounded font-medium">Verified</span>
                </div>
                <p className="text-[10px] text-muted-foreground">Email verification required upon change</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Phone Number</label>
                <input className="w-full px-3 py-2 rounded-lg border border-input text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" defaultValue="+1 (555) 123-4567" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Timezone</label>
                <select className="w-full px-3 py-2 rounded-lg border border-input text-sm outline-none bg-card">
                  <option>{Intl.DateTimeFormat().resolvedOptions().timeZone}</option>
                  <option>America/New_York (EST)</option>
                  <option>America/Los_Angeles (PST)</option>
                  <option>Europe/London (GMT)</option>
                  <option>Asia/Kolkata (IST)</option>
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
                <span className="font-medium text-foreground">{connectedCount} / {totalPlatforms}</span>
              </div>
              <div className="w-full h-2 bg-accent rounded-full overflow-hidden">
                <div className="h-full gradient-coral rounded-full" style={{ width: `${(connectedCount / totalPlatforms) * 100}%` }} />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total Posts</span>
                <span className="font-medium text-foreground">{totalPosts}</span>
              </div>
              <div className="w-full h-2 bg-accent rounded-full overflow-hidden">
                <div className="h-full gradient-coral rounded-full" style={{ width: `${Math.min((totalPosts / 500) * 100, 100)}%` }} />
              </div>
            </div>

            {/* Invoices */}
            <div className="border-t border-border pt-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">Invoices</h3>
              <div className="space-y-2">
                {["Mar 2026", "Feb 2026", "Jan 2026"].map((month) => (
                  <div key={month} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-accent/30 transition-colors">
                    <div>
                      <p className="text-sm text-foreground">{month}</p>
                      <p className="text-xs text-muted-foreground">Pro Plan — $49.00</p>
                    </div>
                    <button className="text-xs text-primary hover:underline flex items-center gap-1">
                      <Download className="w-3 h-3" /> Download
                    </button>
                  </div>
                ))}
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
            <p className="text-xs text-muted-foreground">Manage team access. Permissions: Engage, Listen, Boost, Analyze.</p>
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
            <p className="text-xs text-muted-foreground">Configure which events trigger email and/or in-app notifications.</p>
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
            <button className="px-4 py-2 rounded-lg gradient-coral text-primary-foreground text-sm font-medium shadow-coral hover:opacity-90 transition-all flex items-center gap-2">
              <Save className="w-4 h-4" /> Save Preferences
            </button>
          </div>
        )}

        {activeTab === "hashtags" && (
          <div className="bg-card rounded-xl shadow-card p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Hashtag Suites</h2>
                <p className="text-xs text-muted-foreground mt-1">Create reusable collections of hashtags for quick insertion during content creation.</p>
              </div>
              <button className="px-3 py-1.5 rounded-lg gradient-coral text-primary-foreground text-xs font-medium shadow-coral hover:opacity-90 transition-all flex items-center gap-1">
                <Plus className="w-3 h-3" /> New Suite
              </button>
            </div>
            {hashtagSuites.map((suite) => (
              <div key={suite.name} className="border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-foreground">{suite.name}</p>
                  <div className="flex gap-1">
                    <button className="text-xs text-primary hover:underline">Edit</button>
                    <span className="text-muted-foreground">·</span>
                    <button className="text-xs text-destructive hover:underline">Delete</button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {suite.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "saved-replies" && (
          <div className="bg-card rounded-xl shadow-card p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Saved Replies</h2>
                <p className="text-xs text-muted-foreground mt-1">Pre-written response templates for consistent, rapid replies in the Engage module.</p>
              </div>
              <button className="px-3 py-1.5 rounded-lg gradient-coral text-primary-foreground text-xs font-medium shadow-coral hover:opacity-90 transition-all flex items-center gap-1">
                <Plus className="w-3 h-3" /> New Reply
              </button>
            </div>
            {savedReplies.map((reply) => (
              <div key={reply.name} className="border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-foreground">{reply.name}</p>
                  <div className="flex gap-1">
                    <button className="text-xs text-primary hover:underline">Edit</button>
                    <span className="text-muted-foreground">·</span>
                    <button className="text-xs text-destructive hover:underline">Delete</button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{reply.text}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "tags" && (
          <div className="bg-card rounded-xl shadow-card p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Message Tags</h2>
                <p className="text-xs text-muted-foreground mt-1">Tags used for message filtering in the Engage module. AI auto-tagging uses these labels.</p>
              </div>
              <button className="px-3 py-1.5 rounded-lg gradient-coral text-primary-foreground text-xs font-medium shadow-coral hover:opacity-90 transition-all flex items-center gap-1">
                <Plus className="w-3 h-3" /> New Tag
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {messageTags.map((tag) => (
                <div key={tag.name} className={`flex items-center gap-2 px-3 py-2 rounded-lg ${tag.color} border`}>
                  <Tag className="w-3.5 h-3.5" />
                  <span className="text-sm font-medium">{tag.name}</span>
                  <button className="ml-1 opacity-60 hover:opacity-100"><Trash2 className="w-3 h-3" /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-5">
            {/* 2FA */}
            <div className="bg-card rounded-xl shadow-card p-6 space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Two-Factor Authentication (2FA)</h2>
              <p className="text-xs text-muted-foreground">Add an extra layer of security using email or phone number verification.</p>
              <div className="border border-border rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Email-based 2FA</p>
                    <p className="text-xs text-muted-foreground">Receive a verification code via email at login</p>
                  </div>
                  <button
                    onClick={() => setTwoFAEnabled(!twoFAEnabled)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${twoFAEnabled ? "bg-primary" : "bg-muted"}`}
                  >
                    <span className={`block w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${twoFAEnabled ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Change Password */}
            <div className="bg-card rounded-xl shadow-card p-6 space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Change Password</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Current Password</label>
                  <input type="password" className="w-full px-3 py-2 rounded-lg border border-input text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="••••••••" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">New Password</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 rounded-lg border border-input text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>
              {newPassword && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {passwordRules.map((rule) => (
                    <div key={rule.label} className={`flex items-center gap-2 text-xs ${rule.test(newPassword) ? "text-emerald-600" : "text-muted-foreground"}`}>
                      {rule.test(newPassword) ? <Check className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                      {rule.label}
                    </div>
                  ))}
                </div>
              )}
              <button className="px-4 py-2 rounded-lg gradient-coral text-primary-foreground text-sm font-medium shadow-coral hover:opacity-90 transition-all flex items-center gap-2">
                <Save className="w-4 h-4" /> Update Password
              </button>
            </div>

            {/* Danger Zone */}
            <div className="bg-card rounded-xl shadow-card p-6 border border-destructive/20">
              <h2 className="text-lg font-semibold text-destructive mb-2">Danger Zone</h2>
              <p className="text-xs text-muted-foreground mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:opacity-90 transition-all"
              >
                Delete Account
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50" onClick={() => setShowDeleteModal(false)}>
          <div className="w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-destructive">Delete Account</h3>
              <button onClick={() => setShowDeleteModal(false)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              This will permanently delete your account and all data. Type <strong className="text-foreground">DELETE</strong> to confirm.
            </p>
            <input
              className="w-full px-3 py-2 rounded-lg border border-destructive/30 text-sm outline-none focus:ring-2 focus:ring-destructive/20 focus:border-destructive"
              placeholder='Type "DELETE"'
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
            />
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-accent transition-colors">Cancel</button>
              <button
                disabled={deleteConfirm !== "DELETE"}
                className="px-4 py-2 text-sm rounded-lg bg-destructive text-destructive-foreground font-medium disabled:opacity-50"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
