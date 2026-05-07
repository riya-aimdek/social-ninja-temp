import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  User, CreditCard, Users, Bell, Hash, Shield, Save,
  Upload, Plus, Trash2, MessageSquare, Tag, Check, AlertCircle,
  Download, X, CheckCircle2, Clock, Zap, BellRing, Settings,
  Link2, Eye, EyeOff, Camera, GitBranch,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { teamMembers, connectedAccounts, totalPosts, socialAccounts } from "@/data/businessMockData";
import { WorkflowSettings } from "@/components/settings/WorkflowSettings";
import { RolesPermissionsSettings } from "@/components/settings/RolesPermissionsSettings";
import { TimePickerPopup } from "@/components/ui/TimePickerPopup";

/* ─── Nav ─────────────────────────────────────────────────────── */
const navItems = [
  { id: "profile",       label: "Profile Settings",      icon: User },
  { id: "notifications", label: "Notification Settings", icon: Bell },
  { id: "security",      label: "Security Settings",     icon: Shield },
  { id: "general",       label: "General Settings",      icon: Settings },
  { id: "approvals",     label: "Approvals",             icon: CheckCircle2 },
  { id: "queue",         label: "Queue Times",           icon: Clock },
  { id: "workflows",     label: "Workflows",             icon: GitBranch },
  { id: "roles",         label: "Roles & Permissions",  icon: Shield },
];

/* ─── Mock data ───────────────────────────────────────────────── */
const notifications = [
  { label: "Profile updates",              email: true,  inApp: true },
  { label: "New user added",               email: true,  inApp: true },
  { label: "New social profile connected", email: true,  inApp: true },
  { label: "New post created",             email: false, inApp: true },
  { label: "Approval requested",           email: true,  inApp: true },
  { label: "Approval accepted",            email: false, inApp: true },
  { label: "Approval rejected",            email: true,  inApp: true },
];

const hashtagSuites = [
  { name: "Coffee",           tags: ["#coffee","#coffeetime","#coffeelover","#cafe","#coffeeshop","#coffeeaddict","#espresso","#barista","#latte"] },
  { name: "Social Marketing", tags: ["#socialmedia","#marketing","#digitalmarketing","#smm","#contentcreation"] },
  { name: "Growth",           tags: ["#growth","#startup","#entrepreneur","#business","#success"] },
];

const savedReplies = [
  { name: "Thank You",     text: "Thank you for reaching out! We'll get back to you shortly." },
  { name: "Price Request", text: "Thanks for your interest! Please visit our website for the latest pricing details." },
  { name: "Complaint",     text: "We're sorry to hear about your experience. Could you DM us the details so we can help resolve this?" },
];

const messageTags = [
  { name: "Complaint",          color: "bg-red-50 text-red-700 border-red-200" },
  { name: "Price Request",      color: "bg-blue-50 text-blue-700 border-blue-200" },
  { name: "Product Inquiry",    color: "bg-purple-50 text-purple-700 border-purple-200" },
  { name: "Potential Lead",     color: "bg-green-50 text-green-700 border-green-200" },
  { name: "Positive Feedback",  color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;
type Day = typeof DAYS[number];

const passwordRules = [
  { label: "At least 8 characters",  test: (p: string) => p.length >= 8 },
  { label: "1 uppercase letter",     test: (p: string) => /[A-Z]/.test(p) },
  { label: "1 number",               test: (p: string) => /\d/.test(p) },
  { label: "1 special character",    test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];


/* ─── Reusable atoms ──────────────────────────────────────────── */
const SectionCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("bg-card rounded-2xl border border-border p-6", className)}>{children}</div>
);

const SectionTitle = ({ children, sub }: { children: React.ReactNode; sub?: string }) => (
  <div className="mb-5">
    <h2 className="text-base font-semibold text-foreground">{children}</h2>
    {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
  </div>
);

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{children}</label>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={cn(
      "w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all",
      props.className,
    )}
  />
);

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={cn("relative w-11 h-6 rounded-full transition-colors flex-shrink-0", checked ? "bg-primary" : "bg-muted")}
  >
    <span className={cn("block w-5 h-5 bg-white rounded-full shadow-sm absolute top-0.5 transition-transform", checked ? "translate-x-5" : "translate-x-0.5")} />
  </button>
);

const SaveBtn = ({ label = "Save Changes", icon = true }: { label?: string; icon?: boolean }) => (
  <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors">
    {icon && <Save className="w-3.5 h-3.5" />} {label}
  </button>
);

const SettingRow = ({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) => (
  <div className="flex items-center justify-between py-4 border-b border-border last:border-0">
    <div className="flex-1 min-w-0 pr-6">
      <p className="text-sm font-medium text-foreground">{title}</p>
      {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
    </div>
    {children}
  </div>
);

/* ─── Page ────────────────────────────────────────────────────── */
export default function SettingsPage({ defaultTab = "profile" }: { defaultTab?: string }) {
  const location = useLocation();
  const isAgencyManaged = location.pathname.startsWith("/agency/");
  const [activeTab, setActiveTab] = useState(defaultTab);

  // profile
  const [showPwdNew, setShowPwdNew] = useState(false);

  // security
  const [newPassword, setNewPassword] = useState("");
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [activityLogs, setActivityLogs] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // approvals
  const [autoPublish, setAutoPublish] = useState(false);
  const [autoPublishHours, setAutoPublishHours] = useState(24);
  const [autoPublishFallback, setAutoPublishFallback] = useState<"publish"|"skip"|"reschedule">("publish");
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderFirst, setReminderFirst] = useState(4);
  const [reminderRepeat, setReminderRepeat] = useState(12);
  const [reminderChannels, setReminderChannels] = useState({ email: true, inApp: true, sms: false });
  const [escalationEnabled, setEscalationEnabled] = useState(false);
  const [requireMultiApprover, setRequireMultiApprover] = useState(false);
  const [allowSelfApprove, setAllowSelfApprove] = useState(true);
  const [weekendsCount, setWeekendsCount] = useState(false);

  // queue times
  const [queueSlots, setQueueSlots] = useState<Record<Day, string[]>>({
    Monday:    ["09:00", "13:00", "18:00"],
    Tuesday:   ["09:00", "13:00", "18:00"],
    Wednesday: ["09:00", "13:00"],
    Thursday:  ["09:00", "13:00", "18:00"],
    Friday:    ["09:00", "17:00"],
    Saturday:  ["11:00"],
    Sunday:    [],
  });
  const [queueEnabled, setQueueEnabled] = useState<Record<Day, boolean>>({
    Monday: true, Tuesday: true, Wednesday: true, Thursday: true,
    Friday: true, Saturday: false, Sunday: false,
  });

  const addQueueSlot = (day: Day) =>
    setQueueSlots((prev) => ({ ...prev, [day]: [...prev[day], "09:00"] }));

  const removeQueueSlot = (day: Day, idx: number) =>
    setQueueSlots((prev) => ({ ...prev, [day]: prev[day].filter((_, i) => i !== idx) }));

  const updateQueueSlot = (day: Day, idx: number, val: string) =>
    setQueueSlots((prev) => {
      const slots = [...prev[day]];
      slots[idx] = val;
      return { ...prev, [day]: slots };
    });

  const connectedCount = connectedAccounts.length;
  const totalPlatforms = socialAccounts.length;

  return (
    <div className="flex gap-6 animate-fade-in min-h-0">

      {/* ── Left sidebar ───────────────────────────────────────── */}
      <div className="w-56 flex-shrink-0">
        <div className="bg-card rounded-2xl border border-border overflow-hidden sticky top-4">
          <div className="px-4 py-4 border-b border-border">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Account Settings</p>
          </div>
          <nav className="p-2">
            {navItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* ── Right content ──────────────────────────────────────── */}
      <div className="flex-1 min-w-0 space-y-5">

        {/* ── Profile ─────────────────────────────────────────── */}
        {activeTab === "profile" && (
          <>
            <SectionCard>
              <SectionTitle sub="Manage your personal information and preferences.">Profile Settings</SectionTitle>

              {/* Avatar */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full gradient-coral flex items-center justify-center text-primary-foreground text-xl font-bold">JS</div>
                  <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-md">
                    <Camera className="w-3 h-3 text-white" />
                  </button>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Profile Photo</p>
                  <p className="text-xs text-muted-foreground mb-2">JPG, PNG or GIF. Max 2MB.</p>
                  <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-muted transition-colors">
                    <Upload className="w-3 h-3" /> Upload Photo
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel>Full Name</FieldLabel>
                  <Input defaultValue="John Smith" />
                </div>
                <div>
                  <FieldLabel>Email Address</FieldLabel>
                  <div className="relative">
                    <Input defaultValue="john@business.com" className="pr-20" />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded font-semibold">Verified</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">Email verification required upon change</p>
                </div>
                <div>
                  <FieldLabel>Phone Number</FieldLabel>
                  <Input defaultValue="+1 (555) 123-4567" />
                </div>
                <div>
                  <FieldLabel>Timezone</FieldLabel>
                  <select className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground outline-none focus:border-primary transition-all">
                    <option>Asia/Kolkata (IST)</option>
                    <option>America/New_York (EST)</option>
                    <option>America/Los_Angeles (PST)</option>
                    <option>Europe/London (GMT)</option>
                  </select>
                </div>
              </div>
            </SectionCard>

            <SectionCard>
              <SectionTitle sub="Choose the default emoji behavior for AI-generated captions per connected account.">AI Emoji Preference</SectionTitle>
              <div className="mb-4">
                <FieldLabel>Connected Account</FieldLabel>
                <select className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground outline-none focus:border-primary transition-all">
                  <option>facebook - AI trial</option>
                  <option>instagram - AI trial</option>
                </select>
              </div>
              <SettingRow
                title="Allow emojis in AI-generated content"
                sub="Applies to AI-generated captions for the selected account."
              >
                <Toggle checked={true} onChange={() => {}} />
              </SettingRow>
              <div className="mt-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                <p className="text-xs text-emerald-700 dark:text-emerald-400">AI may use tasteful, platform-appropriate emojis for this account by default.</p>
              </div>
            </SectionCard>

            <div className="flex justify-end">
              <SaveBtn />
            </div>
          </>
        )}

        {/* ── Notifications ───────────────────────────────────── */}
        {activeTab === "notifications" && (
          <SectionCard>
            <SectionTitle sub="Configure which events trigger email and in-app notifications.">Notification Settings</SectionTitle>
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="grid grid-cols-[1fr_80px_80px] text-[11px] uppercase tracking-wider text-muted-foreground font-semibold px-4 py-2.5 bg-muted/40 border-b border-border">
                <span>Event</span>
                <span className="text-center">Email</span>
                <span className="text-center">In-App</span>
              </div>
              {notifications.map((n, i) => (
                <div key={n.label} className={cn("grid grid-cols-[1fr_80px_80px] items-center px-4 py-3 text-sm", i > 0 && "border-t border-border")}>
                  <span className="text-foreground">{n.label}</span>
                  <div className="flex justify-center">
                    <input type="checkbox" defaultChecked={n.email} className="w-4 h-4 accent-primary" />
                  </div>
                  <div className="flex justify-center">
                    <input type="checkbox" defaultChecked={n.inApp} className="w-4 h-4 accent-primary" />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-5">
              <SaveBtn label="Save Preferences" />
            </div>
          </SectionCard>
        )}

        {/* ── Security ────────────────────────────────────────── */}
        {activeTab === "security" && (
          <>
            <SectionCard>
              <SectionTitle sub="These settings will help you keep your account secure.">Security Settings</SectionTitle>
              <SettingRow title="Save my activity logs" sub="Save all activity including any unusual activity detected.">
                <Toggle checked={activityLogs} onChange={setActivityLogs} />
              </SettingRow>
            </SectionCard>

            <SectionCard>
              <SectionTitle sub="Set a unique password to protect your account.">Change Password</SectionTitle>
              <div className="space-y-3 mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FieldLabel>Current Password</FieldLabel>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <div>
                    <FieldLabel>New Password</FieldLabel>
                    <div className="relative">
                      <Input
                        type={showPwdNew ? "text" : "password"}
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="pr-10"
                      />
                      <button type="button" onClick={() => setShowPwdNew(!showPwdNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPwdNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
                {newPassword && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {passwordRules.map((rule) => (
                      <div key={rule.label} className={cn("flex items-center gap-2 text-xs", rule.test(newPassword) ? "text-emerald-600" : "text-muted-foreground")}>
                        {rule.test(newPassword) ? <Check className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                        {rule.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">Last changed: Never</p>
                <SaveBtn label="Update Password" />
              </div>
            </SectionCard>

            <SectionCard>
              <SettingRow
                title="2 Factor Authentication"
                sub="Secure your account with 2FA. You'll need to enter a special code from your mobile app at login."
              >
                <div className="flex items-center gap-3">
                  {twoFAEnabled
                    ? <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">Enabled</span>
                    : <span className="text-[11px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Disabled</span>
                  }
                  <button
                    onClick={() => setTwoFAEnabled(!twoFAEnabled)}
                    className={cn("px-4 py-1.5 rounded-full text-xs font-semibold transition-colors", twoFAEnabled ? "bg-muted text-foreground hover:bg-muted/80" : "bg-primary text-white hover:bg-primary/90")}
                  >
                    {twoFAEnabled ? "Disable" : "Enable"}
                  </button>
                </div>
              </SettingRow>
            </SectionCard>

            <SectionCard className="border-destructive/20">
              <h3 className="text-sm font-semibold text-destructive mb-1">Danger Zone</h3>
              <p className="text-xs text-muted-foreground mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
              <button onClick={() => setShowDeleteModal(true)} className="px-4 py-2 rounded-full bg-destructive text-white text-sm font-semibold hover:opacity-90 transition-all">
                Delete Account
              </button>
            </SectionCard>
          </>
        )}

        {/* ── General ─────────────────────────────────────────── */}
        {activeTab === "general" && (
          <SectionCard>
            <SectionTitle sub="Connect other applications to extend product capabilities.">General Settings</SectionTitle>
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="px-5 py-4 border-b border-border bg-muted/20">
                <p className="text-sm font-semibold text-foreground">URL Shortening</p>
                <p className="text-xs text-muted-foreground mt-0.5">Connect an app to shorten URLs in your posts automatically.</p>
              </div>
              <div className="px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <Link2 className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Bitly</p>
                    <p className="text-xs text-muted-foreground">bit.ly — URL shortener</p>
                  </div>
                </div>
                <button className="px-5 py-2 rounded-full bg-primary text-white text-xs font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors">
                  Connect
                </button>
              </div>
            </div>
          </SectionCard>
        )}

        {/* ── Billing ─────────────────────────────────────────── */}
        {activeTab === "billing" && (
          <>
            <SectionCard>
              <SectionTitle>Subscription & Billing</SectionTitle>
              <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/20 mb-5">
                <div>
                  <p className="text-sm font-semibold text-foreground">Pro Plan</p>
                  <p className="text-xs text-muted-foreground">$49 / month · Renews Mar 28, 2026</p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-semibold">Active</span>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">Accounts Connected</span>
                    <span className="font-semibold text-foreground">{connectedCount} / {totalPlatforms}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(connectedCount / totalPlatforms) * 100}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">Total Posts</span>
                    <span className="font-semibold text-foreground">{totalPosts}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${Math.min((totalPosts / 500) * 100, 100)}%` }} />
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard>
              <SectionTitle>Invoices</SectionTitle>
              <div className="space-y-1">
                {["Mar 2026","Feb 2026","Jan 2026"].map((month) => (
                  <div key={month} className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-muted/40 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-foreground">{month}</p>
                      <p className="text-xs text-muted-foreground">Pro Plan — $49.00</p>
                    </div>
                    <button className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline">
                      <Download className="w-3.5 h-3.5" /> Download
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-border flex justify-end">
                <button className="px-5 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors">
                  Upgrade Plan
                </button>
              </div>
            </SectionCard>
          </>
        )}

        {/* ── Team ────────────────────────────────────────────── */}
        {activeTab === "team" && (
          <SectionCard>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-semibold text-foreground">Team Members</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Manage team access and permissions.</p>
              </div>
              <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors">
                <Plus className="w-3.5 h-3.5" /> Invite
              </button>
            </div>
            <div className="space-y-1.5">
              {teamMembers.map((m) => (
                <div key={m.email} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/40 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{m.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{m.name}</p>
                    <p className="text-[11px] text-muted-foreground">{m.email}</p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-foreground font-medium border border-border">{m.role}</span>
                  <button className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {/* ── Approvals ───────────────────────────────────────── */}
        {activeTab === "approvals" && (
          <>
            <SectionCard>
              <SectionTitle sub="Configure how posts move through approval. These rules apply to all posts requiring client sign-off.">
                Approval Workflow Rules
              </SectionTitle>

              {/* Auto-publish */}
              <div className="rounded-xl border border-border p-4 mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Zap className="w-4 h-4 text-warning" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-foreground">Auto-publish if not approved in time</p>
                      <input type="checkbox" checked={autoPublish} onChange={e => setAutoPublish(e.target.checked)} className="w-4 h-4 accent-primary" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">If approval isn't received within the defined window, the system will act automatically.</p>
                    {autoPublish && (
                      <div className="mt-4 pt-4 border-t border-border space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <FieldLabel>Wait time before action</FieldLabel>
                            <div className="flex items-center gap-2">
                              <input type="number" min={1} value={autoPublishHours} onChange={e => setAutoPublishHours(Number(e.target.value))}
                                className="w-20 h-9 px-3 rounded-lg border border-border bg-background text-sm outline-none focus:border-primary" />
                              <span className="text-xs text-muted-foreground">hours</span>
                            </div>
                          </div>
                          <div>
                            <FieldLabel>Action on timeout</FieldLabel>
                            <select value={autoPublishFallback} onChange={e => setAutoPublishFallback(e.target.value as typeof autoPublishFallback)}
                              className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm outline-none focus:border-primary">
                              <option value="publish">Auto-approve & publish</option>
                              <option value="reschedule">Reschedule by 24h</option>
                              <option value="skip">Skip & mark expired</option>
                            </select>
                          </div>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={weekendsCount} onChange={e => setWeekendsCount(e.target.checked)} className="w-4 h-4 accent-primary" />
                          <span className="text-xs text-foreground">Count weekends in the wait window</span>
                        </label>
                        <div className="flex items-start gap-2 p-3 rounded-lg bg-warning/5 border border-warning/20">
                          <AlertCircle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                          <p className="text-xs text-foreground">Auto-published posts are tagged in the audit trail and a confirmation is sent to all approvers.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Reminders */}
              <div className="rounded-xl border border-border p-4 mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-info/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <BellRing className="w-4 h-4 text-info" />
                  </div>
                  <div className="flex-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={reminderEnabled} onChange={e => setReminderEnabled(e.target.checked)} className="w-4 h-4 accent-primary shrink-0" />
                      <p className="text-sm font-semibold text-foreground">Send reminders for pending approvals</p>
                    </label>
                    <p className="text-xs text-muted-foreground mt-0.5">Nudge approvers automatically so posts don't sit idle in the queue.</p>
                    {reminderEnabled && (
                      <div className="mt-4 pt-4 border-t border-border space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <FieldLabel>First reminder after</FieldLabel>
                            <div className="flex items-center gap-2">
                              <input type="number" min={1} value={reminderFirst} onChange={e => setReminderFirst(Number(e.target.value))}
                                className="w-20 h-9 px-3 rounded-lg border border-border bg-background text-sm outline-none focus:border-primary" />
                              <span className="text-xs text-muted-foreground">hours</span>
                            </div>
                          </div>
                          <div>
                            <FieldLabel>Repeat every</FieldLabel>
                            <div className="flex items-center gap-2">
                              <input type="number" min={1} value={reminderRepeat} onChange={e => setReminderRepeat(Number(e.target.value))}
                                className="w-20 h-9 px-3 rounded-lg border border-border bg-background text-sm outline-none focus:border-primary" />
                              <span className="text-xs text-muted-foreground">hours</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <FieldLabel>Notify approvers via</FieldLabel>
                          <div className="flex gap-2">
                            {([{ key: "email", label: "Email" },{ key: "inApp", label: "In-app" },{ key: "sms", label: "SMS" }] as const).map(c => (
                              <label key={c.key} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background cursor-pointer hover:bg-muted text-xs">
                                <input type="checkbox" checked={reminderChannels[c.key]} onChange={e => setReminderChannels({ ...reminderChannels, [c.key]: e.target.checked })} className="w-4 h-4 accent-primary" />
                                {c.label}
                              </label>
                            ))}
                          </div>
                        </div>
                        <label className="flex items-start gap-3 cursor-pointer pt-3 border-t border-border">
                          <input type="checkbox" checked={escalationEnabled} onChange={e => setEscalationEnabled(e.target.checked)} className="mt-0.5 w-4 h-4 accent-primary" />
                          <div>
                            <p className="text-sm font-medium text-foreground">Escalate to backup approver after 2 reminders</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Route request to team lead if primary approver doesn't respond.</p>
                          </div>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Approver rules */}
              <div className="rounded-xl border border-border p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-4 h-4 text-primary" />
                  <p className="text-sm font-semibold text-foreground">Approver Rules</p>
                </div>
                <div className="space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={requireMultiApprover} onChange={e => setRequireMultiApprover(e.target.checked)} className="mt-0.5 w-4 h-4 accent-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Require approval from 2+ reviewers</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Posts only move forward once multiple approvers have signed off.</p>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={allowSelfApprove} onChange={e => setAllowSelfApprove(e.target.checked)} className="mt-0.5 w-4 h-4 accent-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Allow content creators to self-approve their own drafts</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Useful for trusted internal teams. Disable for stricter compliance workflows.</p>
                    </div>
                  </label>
                </div>
              </div>
            </SectionCard>

            <div className="flex items-center justify-end gap-3">
              <button className="px-4 py-2.5 rounded-full border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors">
                Reset to defaults
              </button>
              <SaveBtn label="Save Approval Rules" />
            </div>
          </>
        )}

        {/* ── Queue Times ─────────────────────────────────────── */}
        {activeTab === "queue" && (
          <>
            <SectionCard>
              <SectionTitle sub="Set the times your posts will be automatically queued for publishing each day.">
                Queue Times
              </SectionTitle>
              <div className="space-y-3">
                {DAYS.map((day) => {
                  const enabled = queueEnabled[day];
                  const slots = queueSlots[day];
                  return (
                    <div key={day} className={cn("rounded-xl border border-border p-4 transition-colors", !enabled && "opacity-50")}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Toggle checked={enabled} onChange={(v) => setQueueEnabled((prev) => ({ ...prev, [day]: v }))} />
                          <span className="text-sm font-semibold text-foreground w-24">{day}</span>
                          <span className="text-xs text-muted-foreground">{slots.length} slot{slots.length !== 1 ? "s" : ""}</span>
                        </div>
                        <button
                          disabled={!enabled}
                          onClick={() => addQueueSlot(day)}
                          className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:text-primary/70 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add slot
                        </button>
                      </div>
                      {enabled && slots.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {slots.map((t, i) => (
                            <div key={i} className="flex items-center gap-1">
                              <TimePickerPopup
                                value={t}
                                onChange={(val) => updateQueueSlot(day, i, val)}
                              />
                              <button onClick={() => removeQueueSlot(day, i)} className="text-muted-foreground hover:text-error transition-colors">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      {enabled && slots.length === 0 && (
                        <p className="text-xs text-muted-foreground italic">No slots — posts won't be queued on this day.</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </SectionCard>
            <div className="flex justify-end mt-2">
              <SaveBtn label="Save Queue Times" />
            </div>
          </>
        )}

        {/* ── Workflows ───────────────────────────────────────── */}
        {activeTab === "workflows" && (
          <SectionCard className="p-0 overflow-hidden">
            <WorkflowSettings scope="client" standalone={!isAgencyManaged} />
          </SectionCard>
        )}

        {/* ── Roles & Permissions ──────────────────────────────── */}
        {activeTab === "roles" && (
          <SectionCard className="p-0 overflow-hidden">
            <RolesPermissionsSettings scope="client" />
          </SectionCard>
        )}

        {/* ── Hashtags ─────────────────────────────────────────── */}
        {activeTab === "hashtags" && (
          <SectionCard>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-semibold text-foreground">Hashtag Suites</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Create reusable hashtag collections for quick insertion during content creation.</p>
              </div>
              <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors">
                <Plus className="w-3.5 h-3.5" /> New Suite
              </button>
            </div>
            <div className="space-y-3">
              {hashtagSuites.map((suite) => (
                <div key={suite.name} className="rounded-xl border border-border p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-foreground">{suite.name}</p>
                    <div className="flex items-center gap-2">
                      <button className="text-xs text-primary font-medium hover:underline">Edit</button>
                      <span className="text-muted-foreground">·</span>
                      <button className="text-xs text-destructive font-medium hover:underline">Delete</button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {suite.tags.map((tag) => (
                      <span key={tag} className="px-2.5 py-1 rounded-full bg-primary/8 text-primary text-xs font-medium border border-primary/15">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {/* ── Saved Replies ────────────────────────────────────── */}
        {activeTab === "saved-replies" && (
          <SectionCard>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-semibold text-foreground">Saved Replies</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Pre-written templates for consistent, rapid replies in the Engage module.</p>
              </div>
              <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors">
                <Plus className="w-3.5 h-3.5" /> New Reply
              </button>
            </div>
            <div className="space-y-3">
              {savedReplies.map((reply) => (
                <div key={reply.name} className="rounded-xl border border-border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-foreground">{reply.name}</p>
                    <div className="flex items-center gap-2">
                      <button className="text-xs text-primary font-medium hover:underline">Edit</button>
                      <span className="text-muted-foreground">·</span>
                      <button className="text-xs text-destructive font-medium hover:underline">Delete</button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{reply.text}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {/* ── Tags ─────────────────────────────────────────────── */}
        {activeTab === "tags" && (
          <SectionCard>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-semibold text-foreground">Message Tags</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Tags for message filtering in Engage. AI auto-tagging uses these labels.</p>
              </div>
              <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors">
                <Plus className="w-3.5 h-3.5" /> New Tag
              </button>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {messageTags.map((tag) => (
                <div key={tag.name} className={cn("flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm font-medium", tag.color)}>
                  <Tag className="w-3.5 h-3.5" />
                  {tag.name}
                  <button className="ml-0.5 opacity-50 hover:opacity-100 transition-opacity">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </SectionCard>
        )}
      </div>

      {/* ── Delete Account Modal ─────────────────────────────── */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowDeleteModal(false)}>
          <div className="w-full max-w-md bg-white dark:bg-card rounded-2xl shadow-2xl flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <h3 className="text-base font-semibold text-destructive">Delete Account</h3>
              <button onClick={() => setShowDeleteModal(false)} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-6 py-6">
              <p className="text-sm text-muted-foreground mb-4">
                This will permanently delete your account and all data. Type <strong className="text-foreground">DELETE</strong> to confirm.
              </p>
              <Input
                placeholder='Type "DELETE"'
                value={deleteConfirm}
                onChange={e => setDeleteConfirm(e.target.value)}
                className="focus:border-destructive focus:ring-destructive/10"
              />
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-5 border-t border-border">
              <button onClick={() => setShowDeleteModal(false)} className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors px-2">
                Cancel
              </button>
              <button
                disabled={deleteConfirm !== "DELETE"}
                className="px-6 py-2.5 rounded-full bg-destructive text-white text-[11px] font-semibold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all"
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
