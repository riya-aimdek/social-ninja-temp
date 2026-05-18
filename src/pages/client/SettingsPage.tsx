import { useState } from "react";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";
import {
  User, Bell, Shield, Save,
  Upload, Plus, Trash2, Check, AlertCircle,
  X, CheckCircle2, Settings,
  Link2, Eye, EyeOff, Camera, GitBranch,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { connectedAccounts, totalPosts, socialAccounts } from "@/data/businessMockData";
import { WorkflowSettings } from "@/components/settings/WorkflowSettings";
import { RolesPermissionsSettings } from "@/components/settings/RolesPermissionsSettings";
/* ─── Nav ─────────────────────────────────────────────────────── */
const navItems = [
  { id: "profile",       label: "Profile Settings",      icon: User },
  { id: "notifications", label: "Notification Settings", icon: Bell },
  { id: "security",      label: "Security Settings",     icon: Shield },
  { id: "general",       label: "General Settings",      icon: Settings },
  { id: "workflows",     label: "Workflows",             icon: GitBranch },
  { id: "roles",         label: "Roles & Permissions",   icon: Shield },
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
  <button
    onClick={() => toast.success("Changes saved successfully.")}
    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
  >
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
                  <button aria-label="Change photo" onClick={() => toast.info("Photo upload coming soon.")} className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-md">
                    <Camera className="w-3 h-3 text-white" />
                  </button>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Profile Photo</p>
                  <p className="text-xs text-muted-foreground mb-2">JPG, PNG or GIF. Max 2MB.</p>
                  <button onClick={() => toast.info("Photo upload coming soon.")} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-muted transition-colors">
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
                <button onClick={() => toast.info("Bitly connected.")} className="px-5 py-2 rounded-full bg-primary text-white text-xs font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors">
                  Connect
                </button>
              </div>
            </div>
          </SectionCard>
        )}

        {/* ── Workflows ───────────────────────────────────────── */}
        {activeTab === "workflows" && (
          <WorkflowSettings scope="client" standalone={!isAgencyManaged} />
        )}

        {/* ── Roles & Permissions ──────────────────────────────── */}
        {activeTab === "roles" && (
          <SectionCard className="p-0 overflow-hidden">
            <RolesPermissionsSettings scope="client" agencyManaged={isAgencyManaged} />
          </SectionCard>
        )}

        {/* ── Hashtags ─────────────────────────────────────────── */}
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
                onClick={() => { toast.success("Account deleted."); setShowDeleteModal(false); }}
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
