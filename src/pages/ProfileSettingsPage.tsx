import { useState, useRef } from "react";
import { Phone, CheckCircle2, Camera, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import AgencyLayout from "@/components/layout/AgencyLayout";

type Role = "agency" | "client";

const roleConfig: Record<Role, {
  name: string; roleLabel: string; initials: string;
  email: string; accentFrom: string; accentTo: string;
}> = {
  agency: { name: "Riya Shah",      roleLabel: "Agency Admin",   initials: "RS", email: "riya@agency.com",    accentFrom: "from-sky-500",  accentTo: "to-blue-600"  },
  client: { name: "Riya Shah",      roleLabel: "Business Admin", initials: "RS", email: "riya@business.com",  accentFrom: "from-rose-500", accentTo: "to-pink-600"  },
};

const roleBadge: Record<Role, string> = {
  agency: "bg-sky-50 text-sky-600 border-sky-200",
  client: "bg-rose-50 text-rose-600 border-rose-200",
};

const passwordRules = [
  { label: "At least 8 characters",  test: (p: string) => p.length >= 8 },
  { label: "1 uppercase letter",     test: (p: string) => /[A-Z]/.test(p) },
  { label: "1 number",               test: (p: string) => /\d/.test(p) },
  { label: "1 special character",    test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
  <div>
    <div className="flex items-center justify-between mb-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </div>
    {children}
  </div>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={cn(
      "w-full h-10 px-3.5 rounded-lg border border-border bg-background text-sm text-foreground",
      "placeholder:text-muted-foreground/40 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all",
      props.disabled && "bg-muted/50 cursor-not-allowed text-muted-foreground",
      props.className,
    )}
  />
);

export default function ProfileSettingsPage({ role }: { role: Role }) {
  const cfg = roleConfig[role];
  const photoRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [personal, setPersonal] = useState({ fullName: cfg.name, email: cfg.email, phone: "" });
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd,     setNewPwd]     = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew,     setShowNew]     = useState(false);

  const handleSave = () => toast.success("Profile updated successfully");

  const content = (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">

      {/* Top identity row */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">{personal.fullName}</p>
          <p className="text-xs text-muted-foreground">{personal.email}</p>
        </div>
        <span className={cn("text-xs font-semibold px-3 py-1 rounded-full border", roleBadge[role])}>
          {cfg.roleLabel}
        </span>
      </div>

      <div className="px-6 py-6 space-y-8">

        {/* Profile Photo */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className={cn("w-1 h-4 rounded-full bg-gradient-to-b", cfg.accentFrom, cfg.accentTo)} />
            <p className="text-sm font-semibold text-foreground">Profile Photo</p>
          </div>
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              {photoPreview ? (
                <img src={photoPreview} alt="Avatar" className="w-16 h-16 rounded-full object-cover ring-2 ring-border" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold ring-2 ring-border">
                  {cfg.initials}
                </div>
              )}
              <button
                type="button"
                onClick={() => photoRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center shadow-sm hover:bg-muted transition-colors"
              >
                <Camera className="w-3 h-3 text-muted-foreground" />
              </button>
              <input ref={photoRef} type="file" accept="image/*" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) setPhotoPreview(URL.createObjectURL(f)); }} />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{personal.fullName}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{cfg.roleLabel}</p>
              <button
                type="button"
                onClick={() => photoRef.current?.click()}
                className="mt-2 text-xs font-medium text-primary hover:underline"
              >
                Change photo
              </button>
            </div>
          </div>
        </div>

        <div className="h-px bg-border" />

        {/* Personal Info */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className={cn("w-1 h-4 rounded-full bg-gradient-to-b", cfg.accentFrom, cfg.accentTo)} />
            <p className="text-sm font-semibold text-foreground">Personal Information</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Full Name">
              <Input value={personal.fullName} onChange={e => setPersonal({ ...personal, fullName: e.target.value })} placeholder="Your full name" />
            </Field>
            <Field label="Email Address" hint="Read only">
              <div className="relative">
                <Input value={personal.email} disabled className="pr-24" />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                  <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                </span>
              </div>
            </Field>
            <Field label="Phone Number">
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input value={personal.phone} onChange={e => setPersonal({ ...personal, phone: e.target.value })} placeholder="+1 (555) 000-0000" className="pl-9" />
              </div>
            </Field>
          </div>
        </div>

        <div className="h-px bg-border" />

        {/* Change Password */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className={cn("w-1 h-4 rounded-full bg-gradient-to-b", cfg.accentFrom, cfg.accentTo)} />
            <p className="text-sm font-semibold text-foreground">Change Password</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Current Password">
              <div className="relative">
                <Input type={showCurrent ? "text" : "password"} value={currentPwd} onChange={e => setCurrentPwd(e.target.value)} placeholder="Enter current password" className="pr-10" />
                <button type="button" onClick={() => setShowCurrent(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </Field>
            <Field label="New Password">
              <div className="relative">
                <Input type={showNew ? "text" : "password"} value={newPwd} onChange={e => setNewPwd(e.target.value)} placeholder="Enter new password" className="pr-10" />
                <button type="button" onClick={() => setShowNew(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </Field>
          </div>
          {newPwd && (
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5">
              {passwordRules.map(r => (
                <div key={r.label} className={cn("flex items-center gap-1.5 text-xs", r.test(newPwd) ? "text-emerald-600" : "text-muted-foreground")}>
                  <CheckCircle2 className="w-3 h-3 shrink-0" />
                  {r.label}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Save footer */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/30">
        <p className="text-xs text-muted-foreground">Changes are saved to your account immediately.</p>
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all"
        >
          Save Changes
        </button>
      </div>
    </div>
  );

  if (role === "agency") return <AgencyLayout title="My Profile">{content}</AgencyLayout>;
  return content;
}
