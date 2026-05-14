import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Building2, ShieldCheck, Upload, Check, ChevronDown, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const APPROVAL_ROLES = ["Approver", "Social Media Manager", "Client Admin", "Client"];

const CLIENTS: Record<string, { name: string; description: string }> = {
  "1": { name: "client-1",  description: "" },
  "2": { name: "Acme Corp", description: "" },
};

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={cn(
      "w-full h-10 px-3.5 rounded-lg border border-border bg-background text-sm text-foreground",
      "placeholder:text-muted-foreground/40 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all",
      props.className,
    )}
  />
);

export default function AgencyClientProfilePage() {
  const { id } = useParams<{ id: string }>();
  const client = CLIENTS[id ?? "1"] ?? CLIENTS["1"];

  const logoRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState(client.name);
  const [description, setDescription] = useState(client.description);
  const [approvalEnabled, setApprovalEnabled] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const roleDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(e.target as Node))
        setRoleDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleRole = (role: string) =>
    setSelectedRoles(prev => prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]);

  const handleSave = () => toast.success("Client profile saved.");

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">

      {/* Header row */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">{businessName}</p>
          <p className="text-xs text-muted-foreground">Client profile &amp; settings</p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full border bg-rose-50 text-rose-600 border-rose-200">
          Client
        </span>
      </div>

      <div className="px-6 py-6 space-y-8">

        {/* Brand Details */}
        <div>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-4 rounded-full bg-gradient-to-b from-rose-500 to-pink-600" />
            <Building2 className="w-4 h-4 text-muted-foreground" />
            <p className="text-sm font-semibold text-foreground">Brand Details</p>
          </div>

          {/* Logo + Business Name row */}
          <div className="flex items-start gap-4 mb-4">
            {/* Logo upload */}
            <input
              ref={logoRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => {
                const f = e.target.files?.[0];
                if (f) setLogoPreview(URL.createObjectURL(f));
              }}
            />
            <button
              type="button"
              onClick={() => logoRef.current?.click()}
              className="w-24 h-24 rounded-xl border-2 border-dashed border-border hover:border-primary/40 hover:bg-muted/30 flex flex-col items-center justify-center gap-1.5 transition-all shrink-0"
            >
              {logoPreview ? (
                <img src={logoPreview} alt="Logo" className="w-full h-full object-cover rounded-xl" />
              ) : (
                <>
                  <Upload className="w-5 h-5 text-muted-foreground" />
                  <span className="text-[11px] text-muted-foreground">Logo</span>
                </>
              )}
            </button>

            {/* Business Name */}
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Business Name <span className="text-primary">*</span>
              </label>
              <Input
                value={businessName}
                onChange={e => setBusinessName(e.target.value)}
                placeholder="e.g. Acme Corp"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Description <span className="text-xs text-muted-foreground font-normal">(optional)</span>
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Brief description of this client's business..."
              className="w-full px-3.5 py-3 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none"
            />
          </div>
        </div>

        <div className="h-px bg-border" />

        {/* Approval Workflow */}
        <div>
          {/* Header row */}
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 rounded-full bg-gradient-to-b from-rose-500 to-pink-600" />
              <ShieldCheck className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm font-semibold text-foreground">Approval Workflow</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {approvalEnabled ? "Enabled" : "Disabled"}
              </span>
              <button
                type="button"
                onClick={() => { setApprovalEnabled(v => !v); setRoleDropdownOpen(false); }}
                className={cn(
                  "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none",
                  approvalEnabled ? "bg-primary" : "bg-muted-foreground/30",
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200",
                    approvalEnabled ? "translate-x-5" : "translate-x-0",
                  )}
                />
              </button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-3 ml-7">
            Posts created by selected roles will require approval before publishing.
          </p>

          {/* Role multi-select — only visible when enabled */}
          {approvalEnabled && (
            <div className="relative ml-7" ref={roleDropdownRef}>
              {/* Trigger */}
              <button
                type="button"
                onClick={() => setRoleDropdownOpen(v => !v)}
                className={cn(
                  "w-full min-h-[42px] px-3 py-2 flex items-center flex-wrap gap-1.5 rounded-lg border bg-background text-sm text-left transition-all",
                  roleDropdownOpen ? "border-primary ring-2 ring-primary/10" : "border-border hover:border-primary/40",
                )}
              >
                {selectedRoles.length === 0 ? (
                  <span className="text-muted-foreground/50 text-sm">Select roles that require approval...</span>
                ) : (
                  selectedRoles.map(role => (
                    <span
                      key={role}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium"
                    >
                      {role}
                      <button
                        type="button"
                        onClick={e => { e.stopPropagation(); toggleRole(role); }}
                        className="hover:text-primary/60 transition-colors"
                        aria-label={`Remove ${role}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                )}
                <ChevronDown className={cn("w-4 h-4 text-muted-foreground ml-auto shrink-0 transition-transform", roleDropdownOpen && "rotate-180")} />
              </button>

              {/* Dropdown */}
              {roleDropdownOpen && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-card border border-border rounded-xl shadow-lg z-20 overflow-hidden">
                  {APPROVAL_ROLES.map(role => {
                    const selected = selectedRoles.includes(role);
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => toggleRole(role)}
                        className={cn(
                          "w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors text-left",
                          selected ? "bg-primary/5 text-primary" : "text-foreground hover:bg-muted/50",
                        )}
                      >
                        {role}
                        {selected && (
                          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 text-white" strokeWidth={3} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
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
}
