import { useState } from "react";
import AgencyLayout from "@/components/layout/AgencyLayout";
import {
  Settings, Bell, Shield, GitBranch, Save,
  Upload, Eye, EyeOff, Check, AlertCircle,
  Monitor, Smartphone, X, Clock, Plus,
} from "lucide-react";
import { toast } from "sonner";
import { WorkflowSettings } from "@/components/settings/WorkflowSettings";
import { RolesPermissionsSettings } from "@/components/settings/RolesPermissionsSettings";
import { TimePickerPopup } from "@/components/ui/TimePickerPopup";
import { cn } from "@/lib/utils";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;
type Day = typeof DAYS[number];

/* ── Nav ──────────────────────────────────────────────────────────── */
const navItems = [
  { id: "general",       label: "General Settings",     icon: Settings   },
  { id: "notifications", label: "Notification Settings",icon: Bell       },
  { id: "security",      label: "Security Settings",    icon: Shield     },
  { id: "queue",         label: "Queue Times",          icon: Clock      },
  { id: "workflows",     label: "Workflows",             icon: GitBranch  },
  { id: "roles",         label: "Roles & Permissions",  icon: Shield     },
];

/* ── Mock data ────────────────────────────────────────────────────── */
const AGENCY_NOTIFS = [
  { label: "New client created",                    email: true,  inApp: true  },
  { label: "Team member invited",                   email: true,  inApp: true  },
  { label: "Team member removed",                   email: true,  inApp: true  },
  { label: "Subscription limit approaching (80%)",  email: true,  inApp: true  },
  { label: "Subscription limit reached (100%)",     email: true,  inApp: true  },
  { label: "Failed OAuth connection on any client", email: false, inApp: true  },
  { label: "Audit log alert (suspicious activity)", email: true,  inApp: true  },
];

const CLIENT_NOTIFS = [
  { label: "New post published",           email: false, inApp: true },
  { label: "Approval pending (> 24 hrs)",  email: true,  inApp: true },
  { label: "Inbox message SLA breached",   email: false, inApp: true },
  { label: "Social profile disconnected",  email: true,  inApp: true },
];

const passwordRules = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "1 uppercase letter",    test: (p: string) => /[A-Z]/.test(p) },
  { label: "1 number",              test: (p: string) => /\d/.test(p) },
  { label: "1 special character",   test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

/* ── Reusable atoms (mirrored from client SettingsPage) ───────────── */
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

const SaveBtn = ({ label = "Save Changes" }: { label?: string }) => (
  <button onClick={() => toast.success("Changes saved successfully.")} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors">
    <Save className="w-3.5 h-3.5" /> {label}
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

/* ── Page ─────────────────────────────────────────────────────────── */
const AgencySettings = () => {
  const [activeTab, setActiveTab] = useState("general");

  // notifications
  const [agencyToggles, setAgencyToggles] = useState<Record<string, { email: boolean; inApp: boolean }>>(
    Object.fromEntries(AGENCY_NOTIFS.map((n) => [n.label, { email: n.email, inApp: n.inApp }])),
  );
  const [clientToggles, setClientToggles] = useState<Record<string, { email: boolean; inApp: boolean }>>(
    Object.fromEntries(CLIENT_NOTIFS.map((n) => [n.label, { email: n.email, inApp: n.inApp }])),
  );

  // security
  const [newPassword,    setNewPassword]    = useState("");
  const [showPwd,        setShowPwd]        = useState(false);
  const [twoFAEnabled,   setTwoFAEnabled]   = useState(false);
  const [activityLogs,   setActivityLogs]   = useState(false);

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
  const addQueueSlot    = (day: Day) => setQueueSlots((p) => ({ ...p, [day]: [...p[day], "09:00"] }));
  const removeQueueSlot = (day: Day, idx: number) => setQueueSlots((p) => ({ ...p, [day]: p[day].filter((_, i) => i !== idx) }));
  const updateQueueSlot = (day: Day, idx: number, val: string) => setQueueSlots((p) => { const s = [...p[day]]; s[idx] = val; return { ...p, [day]: s }; });


  return (
    <AgencyLayout title="Settings">
      <div className="flex gap-6 animate-fade-in min-h-0">

        {/* ── Left sidebar nav ── */}
        <div className="w-56 flex-shrink-0">
          <div className="bg-card rounded-2xl border border-border overflow-hidden sticky top-4">
            <div className="px-4 py-4 border-b border-border">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Agency Settings</p>
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

        {/* ── Right content ── */}
        <div className="flex-1 min-w-0 space-y-5">

          {/* ── General ── */}
          {activeTab === "general" && (
            <>
              <SectionCard>
                <SectionTitle sub="Update your agency's public information and branding.">Agency Profile</SectionTitle>

                <div className="flex items-start gap-5 mb-5">
                  <div className="w-20 h-20 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center hover:border-primary cursor-pointer transition-colors group shrink-0">
                    <Upload className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-[10px] text-muted-foreground mt-1">Upload Logo</span>
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div>
                      <FieldLabel>Agency Name</FieldLabel>
                      <Input defaultValue="Digital Spark Agency" />
                    </div>
                    <div>
                      <FieldLabel>Industry</FieldLabel>
                      <select className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground outline-none focus:border-primary transition-all">
                        <option>Marketing Agency</option>
                        <option>Creative Agency</option>
                        <option>Digital Agency</option>
                        <option>PR Agency</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <FieldLabel>Website URL</FieldLabel>
                    <Input defaultValue="https://digitalspark.io" />
                  </div>
                  <div>
                    <FieldLabel>Notes</FieldLabel>
                    <textarea
                      className="w-full h-24 px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none"
                      defaultValue="Leading digital marketing agency specializing in social media management."
                    />
                  </div>
                </div>
              </SectionCard>
              <div className="flex justify-end">
                <SaveBtn />
              </div>
            </>
          )}

          {/* ── Notifications ── */}
          {activeTab === "notifications" && (
            <>
              {[
                { title: "Agency Notifications", sub: "Alerts for agency-level events.", data: AGENCY_NOTIFS, state: agencyToggles, set: setAgencyToggles },
                { title: "Client-Level Alerts",  sub: "Receive alerts for activity within your managed clients.", data: CLIENT_NOTIFS, state: clientToggles, set: setClientToggles },
              ].map(({ title, sub, data, state, set }) => (
                <SectionCard key={title}>
                  <SectionTitle sub={sub}>{title}</SectionTitle>
                  <div className="rounded-xl border border-border overflow-hidden">
                    <div className="grid grid-cols-[1fr_80px_80px] text-[11px] uppercase tracking-wider text-muted-foreground font-semibold px-4 py-2.5 bg-muted/40 border-b border-border">
                      <span>Event</span>
                      <span className="text-center">Email</span>
                      <span className="text-center">In-App</span>
                    </div>
                    {data.map((n, i) => (
                      <div key={n.label} className={cn("grid grid-cols-[1fr_80px_80px] items-center px-4 py-3 text-sm", i > 0 && "border-t border-border")}>
                        <span className="text-foreground">{n.label}</span>
                        <div className="flex justify-center">
                          <input type="checkbox" checked={state[n.label].email} onChange={() => set((p) => ({ ...p, [n.label]: { ...p[n.label], email: !p[n.label].email } }))} className="w-4 h-4 accent-primary" />
                        </div>
                        <div className="flex justify-center">
                          <input type="checkbox" checked={state[n.label].inApp} onChange={() => set((p) => ({ ...p, [n.label]: { ...p[n.label], inApp: !p[n.label].inApp } }))} className="w-4 h-4 accent-primary" />
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              ))}
              <div className="flex justify-end">
                <SaveBtn label="Save Preferences" />
              </div>
            </>
          )}

          {/* ── Security ── */}
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
                          type={showPwd ? "text" : "password"}
                          placeholder="••••••••"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="pr-10"
                        />
                        <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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

              <SectionCard>
                <SectionTitle sub="Devices currently signed in to your agency account.">Active Sessions</SectionTitle>
                <div className="space-y-2.5">
                  {[
                    { device: "Chrome on MacOS",  location: "New York, US", time: "Current session", current: true,  Icon: Monitor     },
                    { device: "Safari on iPhone", location: "New York, US", time: "2 hrs ago",        current: false, Icon: Smartphone  },
                  ].map((s) => (
                    <div key={s.device} className="flex items-center gap-3 p-3.5 rounded-xl bg-muted/40 border border-border">
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        <s.Icon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{s.device}</p>
                        <p className="text-xs text-muted-foreground">{s.location} · {s.time}</p>
                      </div>
                      {s.current
                        ? <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-success/15 text-success border border-success/30">Current</span>
                        : <button className="text-xs font-medium text-error hover:text-error/80 transition-colors">Revoke</button>
                      }
                    </div>
                  ))}
                </div>
              </SectionCard>
            </>
          )}

          {/* ── Queue Times ── */}
          {activeTab === "queue" && (
            <>
              <SectionCard>
                <SectionTitle sub="Set the times posts will be automatically queued for publishing across all agency-managed clients each day.">
                  Queue Times
                </SectionTitle>
                <div className="space-y-3">
                  {DAYS.map((day) => {
                    const enabled = queueEnabled[day];
                    const slots   = queueSlots[day];
                    return (
                      <div key={day} className={cn("rounded-xl border border-border p-4 transition-colors", !enabled && "opacity-50")}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Toggle checked={enabled} onChange={(v) => setQueueEnabled((p) => ({ ...p, [day]: v }))} />
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
                                <TimePickerPopup value={t} onChange={(val) => updateQueueSlot(day, i, val)} />
                                <button onClick={() => removeQueueSlot(day, i)} className="text-muted-foreground hover:text-destructive transition-colors">
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
              <div className="flex justify-end">
                <SaveBtn label="Save Queue Times" />
              </div>
            </>
          )}

          {/* ── Workflows ── */}
          {activeTab === "workflows" && (
            <SectionCard className="p-0 overflow-hidden">
              <WorkflowSettings scope="agency" />
            </SectionCard>
          )}

          {/* ── Roles & Permissions ── */}
          {activeTab === "roles" && (
            <SectionCard className="p-0 overflow-hidden">
              <RolesPermissionsSettings scope="agency" />
            </SectionCard>
          )}


        </div>
      </div>

    </AgencyLayout>
  );
};

export default AgencySettings;
