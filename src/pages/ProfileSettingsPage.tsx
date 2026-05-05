import { useState, useRef } from "react";
import { Mail, Phone, CheckCircle2, Upload, Building2, Globe } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import SuperAdminLayout from "@/components/layout/SuperAdminLayout";
import AgencyLayout from "@/components/layout/AgencyLayout";

type Role = "super-admin" | "agency" | "client";

const roleConfig: Record<Role, {
  name: string; roleLabel: string; initials: string;
  email: string; colorFrom: string; colorTo: string;
}> = {
  "super-admin": { name: "John Doe",       roleLabel: "Super Admin",    initials: "SA", email: "john.doe@socialninja.com", colorFrom: "from-violet-500", colorTo: "to-purple-600" },
  agency:        { name: "Agency Admin",   roleLabel: "Agency Admin",   initials: "A",  email: "admin@agency.com",        colorFrom: "from-sky-500",    colorTo: "to-blue-600"   },
  client:        { name: "Business Owner", roleLabel: "Business Admin", initials: "B",  email: "owner@business.com",      colorFrom: "from-rose-500",   colorTo: "to-pink-600"   },
};

const roleBadge: Record<Role, string> = {
  "super-admin": "bg-violet-50 text-violet-600 border-violet-200",
  agency:        "bg-sky-50 text-sky-600 border-sky-200",
  client:        "bg-rose-50 text-rose-600 border-rose-200",
};

const industries = [
  "Technology", "Retail & E-Commerce", "Food & Beverage", "Healthcare",
  "Finance & Banking", "Education", "Real Estate", "Media & Entertainment",
  "Travel & Hospitality", "Non-Profit", "Other",
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

const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    {...props}
    className={cn(
      "w-full h-10 px-3.5 rounded-lg border border-border bg-background text-sm text-foreground",
      "outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all",
      props.className,
    )}
  />
);


export default function ProfileSettingsPage({ role }: { role: Role }) {
  const cfg = roleConfig[role];
  const logoRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [personal, setPersonal] = useState({ fullName: cfg.name, email: cfg.email, phone: "" });
  const [business, setBusiness] = useState({ name: "Business", industry: "", website: "" });

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

        {/* Personal Info */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className={cn("w-1 h-4 rounded-full bg-gradient-to-b", cfg.colorFrom, cfg.colorTo)} />
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

        {/* Business Info */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className={cn("w-1 h-4 rounded-full bg-gradient-to-b", cfg.colorFrom, cfg.colorTo)} />
            <p className="text-sm font-semibold text-foreground">Business Information</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Logo */}
            <div className="col-span-2">
              <label className="text-sm font-medium text-foreground block mb-1.5">Business Logo</label>
              <input ref={logoRef} type="file" accept="image/*" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) setLogoPreview(URL.createObjectURL(f)); }} />
              <button type="button" onClick={() => logoRef.current?.click()}
                className="flex items-center gap-3.5 px-4 py-3 w-full rounded-xl border-2 border-dashed border-border hover:border-primary/40 hover:bg-muted/30 transition-all text-left">
                {logoPreview ? (
                  <>
                    <img src={logoPreview} alt="Logo" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Logo uploaded</p>
                      <p className="text-xs text-muted-foreground">Click to replace</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Upload your logo</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG or SVG · Max 2MB</p>
                    </div>
                  </>
                )}
              </button>
            </div>

            <Field label="Business Name">
              <Input value={business.name} onChange={e => setBusiness({ ...business, name: e.target.value })} placeholder="e.g. Acme Corp" />
            </Field>
            <Field label="Industry">
              <Select value={business.industry} onChange={e => setBusiness({ ...business, industry: e.target.value })}>
                <option value="">Select industry</option>
                {industries.map(i => <option key={i} value={i}>{i}</option>)}
              </Select>
            </Field>
            <Field label="Website" hint="Optional">
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input value={business.website} onChange={e => setBusiness({ ...business, website: e.target.value })} placeholder="https://yourwebsite.com" className="pl-9" />
              </div>
            </Field>
          </div>
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

  if (role === "super-admin") return <SuperAdminLayout title="My Profile">{content}</SuperAdminLayout>;
  if (role === "agency") return <AgencyLayout title="My Profile">{content}</AgencyLayout>;
  return content;
}
