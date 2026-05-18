import { useState } from "react";
import { Bell, Monitor, Globe, Clock, Mail, Smartphone, Sun, Moon, Laptop } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import AgencyLayout from "@/components/layout/AgencyLayout";
import ClientLayout from "@/components/layout/ClientLayout";

type Role = "agency" | "client";

const TIMEZONES = [
  "UTC", "America/New_York", "America/Chicago", "America/Denver",
  "America/Los_Angeles", "Europe/London", "Europe/Paris", "Asia/Kolkata",
  "Asia/Tokyo", "Australia/Sydney",
];

const LANGUAGES = ["English", "Spanish", "French", "German", "Portuguese", "Hindi", "Japanese"];
const DATE_FORMATS = ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"];

const SectionHeader = ({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) => (
  <div className="flex items-start gap-3 mb-5">
    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
      {icon}
    </div>
    <div>
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
    </div>
  </div>
);

const Toggle = ({ on, onChange }: { on: boolean; onChange: () => void }) => (
  <button
    type="button"
    onClick={onChange}
    className={cn(
      "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200",
      on ? "bg-primary" : "bg-muted-foreground/30",
    )}
  >
    <span className={cn(
      "pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200",
      on ? "translate-x-4" : "translate-x-0",
    )} />
  </button>
);

const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    {...props}
    className="h-9 px-3 rounded-lg border border-border bg-background text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
  />
);

interface NotifRow { label: string; email: boolean; inApp: boolean; }

const NOTIF_ROWS: NotifRow[] = [
  { label: "Approval requested on a post",        email: true,  inApp: true  },
  { label: "Approval decision (accepted/rejected)",email: false, inApp: true  },
  { label: "Post published successfully",          email: false, inApp: true  },
  { label: "Comment or mention on a post",         email: true,  inApp: true  },
  { label: "Team member adds you to a project",    email: true,  inApp: true  },
  { label: "Weekly performance digest",            email: true,  inApp: false },
];

function PreferencesContent() {
  const [theme,      setTheme]      = useState<"light" | "dark" | "system">("system");
  const [language,   setLanguage]   = useState("English");
  const [timezone,   setTimezone]   = useState("Asia/Kolkata");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  const [notifs, setNotifs] = useState<NotifRow[]>(NOTIF_ROWS);

  const toggleNotif = (idx: number, channel: "email" | "inApp") => {
    setNotifs(prev => prev.map((r, i) => i === idx ? { ...r, [channel]: !r[channel] } : r));
  };

  const themeOpts: { key: "light" | "dark" | "system"; label: string; icon: React.ReactNode }[] = [
    { key: "light",  label: "Light",  icon: <Sun  className="w-4 h-4" /> },
    { key: "dark",   label: "Dark",   icon: <Moon className="w-4 h-4" /> },
    { key: "system", label: "System", icon: <Laptop className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-5">

      {/* Display Preferences */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <SectionHeader
          icon={<Monitor className="w-4 h-4 text-primary" />}
          title="Display Preferences"
          sub="Customize how the app looks and feels for you"
        />

        <div className="space-y-5">
          {/* Theme */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2.5">Theme</p>
            <div className="flex gap-2">
              {themeOpts.map(opt => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setTheme(opt.key)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-colors",
                    theme === opt.key
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-muted-foreground hover:bg-muted",
                  )}
                >
                  {opt.icon}
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Language & Date */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5">Language</p>
              <Select value={language} onChange={e => setLanguage(e.target.value)} className="w-full">
                {LANGUAGES.map(l => <option key={l}>{l}</option>)}
              </Select>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5">Timezone</p>
              <Select value={timezone} onChange={e => setTimezone(e.target.value)} className="w-full">
                {TIMEZONES.map(t => <option key={t}>{t}</option>)}
              </Select>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5">Date Format</p>
              <Select value={dateFormat} onChange={e => setDateFormat(e.target.value)} className="w-full">
                {DATE_FORMATS.map(f => <option key={f}>{f}</option>)}
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <SectionHeader
          icon={<Bell className="w-4 h-4 text-primary" />}
          title="Notification Preferences"
          sub="Choose how and when you want to be notified"
        />

        {/* Channel header */}
        <div className="grid grid-cols-[1fr_auto_auto] gap-4 pb-2 mb-1 border-b border-border">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Event</span>
          <div className="flex items-center gap-1 w-20 justify-center">
            <Mail className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Email</span>
          </div>
          <div className="flex items-center gap-1 w-20 justify-center">
            <Smartphone className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">In-App</span>
          </div>
        </div>

        <div className="divide-y divide-border">
          {notifs.map((row, i) => (
            <div key={row.label} className="grid grid-cols-[1fr_auto_auto] gap-4 items-center py-3">
              <p className="text-sm text-foreground">{row.label}</p>
              <div className="w-20 flex justify-center">
                <Toggle on={row.email}  onChange={() => toggleNotif(i, "email")}  />
              </div>
              <div className="w-20 flex justify-center">
                <Toggle on={row.inApp} onChange={() => toggleNotif(i, "inApp")} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-muted/50 border border-border">
          <Globe className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            Email notifications are sent to <span className="font-medium text-foreground">riya@agency.com</span>. In-app alerts appear in your notification bell.
          </p>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button
          onClick={() => toast.success("Preferences saved")}
          className="px-6 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
}

export default function UserPreferencesPage({ role }: { role: Role }) {
  if (role === "agency") {
    return (
      <AgencyLayout title="Preferences">
        <PreferencesContent />
      </AgencyLayout>
    );
  }
  return <PreferencesContent />;
}
