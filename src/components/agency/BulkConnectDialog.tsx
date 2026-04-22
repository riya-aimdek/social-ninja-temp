import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Mail,
  Search,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Loader2,
  CheckCircle2,
  Sparkles,
  Building2,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

interface BulkConnectDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

type Platform = "Meta" | "Twitter" | "LinkedIn" | "GBP" | "YouTube";

interface DiscoveredAccount {
  id: string;
  platform: Platform;
  subPlatform: "Facebook" | "Instagram" | "Twitter" | "LinkedIn" | "GBP" | "YouTube";
  name: string;
  handle: string;
  /** detected client/brand grouping */
  brand: string;
}

const ICON_MAP = {
  Facebook,
  Instagram,
  Twitter,
  LinkedIn: Linkedin,
  GBP: Building2,
  YouTube: Youtube,
} as const;

// Mock discovery — pretends "master email" gave us access to N accounts grouped by Meta/X/GBP
const mockDiscover = (): DiscoveredAccount[] => [
  // Meta — Acme Corp
  { id: "d1", platform: "Meta", subPlatform: "Facebook", name: "Acme Corp", handle: "AcmeOfficial", brand: "Acme Corp" },
  { id: "d2", platform: "Meta", subPlatform: "Instagram", name: "Acme Corp", handle: "@acmeofficial", brand: "Acme Corp" },
  // Meta — TechStart
  { id: "d3", platform: "Meta", subPlatform: "Facebook", name: "TechStart", handle: "TechStartHQ", brand: "TechStart" },
  { id: "d4", platform: "Meta", subPlatform: "Instagram", name: "TechStart", handle: "@techstart", brand: "TechStart" },
  // Meta — FreshBrew
  { id: "d5", platform: "Meta", subPlatform: "Facebook", name: "FreshBrew Coffee", handle: "FreshBrewCo", brand: "FreshBrew" },
  // Twitter / X
  { id: "d6", platform: "Twitter", subPlatform: "Twitter", name: "Acme Corp", handle: "@acme", brand: "Acme Corp" },
  { id: "d7", platform: "Twitter", subPlatform: "Twitter", name: "TechStart", handle: "@techstart_io", brand: "TechStart" },
  // LinkedIn
  { id: "d8", platform: "LinkedIn", subPlatform: "LinkedIn", name: "Acme Corp", handle: "acme-corp", brand: "Acme Corp" },
  { id: "d9", platform: "LinkedIn", subPlatform: "LinkedIn", name: "FreshBrew", handle: "freshbrew-coffee", brand: "FreshBrew" },
  // GBP
  { id: "d10", platform: "GBP", subPlatform: "GBP", name: "Acme HQ — New York", handle: "acme-hq-ny", brand: "Acme Corp" },
  { id: "d11", platform: "GBP", subPlatform: "GBP", name: "FreshBrew Coffee — Portland", handle: "freshbrew-pdx", brand: "FreshBrew" },
  // YouTube
  { id: "d12", platform: "YouTube", subPlatform: "YouTube", name: "TechStart Channel", handle: "TechStartTV", brand: "TechStart" },
];

type Step = "email" | "discovering" | "select" | "projects" | "done";

const platformOrder: Platform[] = ["Meta", "Twitter", "LinkedIn", "GBP", "YouTube"];

const BulkConnectDialog = ({ open, onOpenChange }: BulkConnectDialogProps) => {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [accounts, setAccounts] = useState<DiscoveredAccount[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState<Set<Platform>>(new Set());
  // step "projects": which detected brands to auto-create as clients/projects
  const [autoCreate, setAutoCreate] = useState<Set<string>>(new Set());

  const reset = () => {
    setStep("email");
    setEmail("");
    setAccounts([]);
    setSelected(new Set());
    setSearch("");
    setCollapsed(new Set());
    setAutoCreate(new Set());
  };

  const close = () => {
    onOpenChange(false);
    setTimeout(reset, 200);
  };

  const handleDiscover = () => {
    if (!email.trim()) return;
    setStep("discovering");
    setTimeout(() => {
      const found = mockDiscover();
      setAccounts(found);
      // Pre-select all
      setSelected(new Set(found.map((a) => a.id)));
      setStep("select");
    }, 1600);
  };

  const grouped = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = q
      ? accounts.filter(
          (a) =>
            a.name.toLowerCase().includes(q) ||
            a.handle.toLowerCase().includes(q) ||
            a.brand.toLowerCase().includes(q),
        )
      : accounts;
    const map: Record<Platform, DiscoveredAccount[]> = {
      Meta: [],
      Twitter: [],
      LinkedIn: [],
      GBP: [],
      YouTube: [],
    };
    filtered.forEach((a) => map[a.platform].push(a));
    return map;
  }, [accounts, search]);

  const togglePlatform = (p: Platform) => {
    const ids = grouped[p].map((a) => a.id);
    const allSelected = ids.length > 0 && ids.every((id) => selected.has(id));
    setSelected((prev) => {
      const next = new Set(prev);
      if (allSelected) ids.forEach((id) => next.delete(id));
      else ids.forEach((id) => next.add(id));
      return next;
    });
  };

  const toggleOne = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleCollapse = (p: Platform) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.has(p) ? next.delete(p) : next.add(p);
      return next;
    });

  const selectedAccounts = accounts.filter((a) => selected.has(a.id));
  const detectedBrands = useMemo(() => {
    const set = new Map<string, number>();
    selectedAccounts.forEach((a) => set.set(a.brand, (set.get(a.brand) || 0) + 1));
    return Array.from(set.entries()).map(([brand, count]) => ({ brand, count }));
  }, [selectedAccounts]);

  const toggleAutoCreate = (b: string) =>
    setAutoCreate((prev) => {
      const next = new Set(prev);
      next.has(b) ? next.delete(b) : next.add(b);
      return next;
    });

  const goToProjects = () => {
    if (selected.size === 0) {
      toast.error("Select at least one account to connect");
      return;
    }
    // Pre-select all detected brands for auto-creation
    setAutoCreate(new Set(detectedBrands.map((d) => d.brand)));
    setStep("projects");
  };

  const handleFinish = () => {
    setStep("done");
    setTimeout(() => {
      toast.success(
        `Connected ${selected.size} accounts · auto-created ${autoCreate.size} client${
          autoCreate.size !== 1 ? "s" : ""
        }`,
      );
      close();
    }, 1500);
  };

  // ─── Renderers per step ───

  const renderEmail = () => (
    <div className="py-2">
      <div className="text-center mb-5">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-3">
          <Mail className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-lg font-bold text-foreground">Connect everything at once</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
          Sign in with the master email that has access to all your client social accounts. We'll discover and let you pick which ones to bring in.
        </p>
      </div>

      <div>
        <label className="text-xs font-semibold tracking-wider text-foreground mb-1.5 block">
          MASTER EMAIL
        </label>
        <Input
          type="email"
          placeholder="agency@youragency.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11"
        />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {[
          { Icon: Facebook, label: "Meta", color: "text-[#1877F2]" },
          { Icon: Twitter, label: "Twitter / X", color: "text-foreground" },
          { Icon: Building2, label: "GBP", color: "text-[#4285F4]" },
        ].map(({ Icon, label, color }) => (
          <div
            key={label}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-muted/30"
          >
            <Icon className={`h-3.5 w-3.5 ${color}`} />
            <span className="text-xs font-medium text-foreground">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDiscovering = () => (
    <div className="py-12 text-center">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
        <Loader2 className="h-6 w-6 text-primary animate-spin" />
      </div>
      <h3 className="text-base font-bold text-foreground">Discovering accounts…</h3>
      <p className="text-sm text-muted-foreground mt-1.5">
        Checking <span className="font-medium text-foreground">{email}</span> for connected social profiles.
      </p>
      <div className="mt-6 max-w-xs mx-auto space-y-2">
        {["Meta", "Twitter / X", "LinkedIn", "Google Business", "YouTube"].map((p, i) => (
          <div
            key={p}
            className="flex items-center gap-2 text-xs text-muted-foreground animate-pulse"
            style={{ animationDelay: `${i * 200}ms` }}
          >
            <Loader2 className="h-3 w-3 animate-spin" />
            Checking {p}…
          </div>
        ))}
      </div>
    </div>
  );

  const renderSelect = () => (
    <div className="py-2">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-bold text-foreground">
            Found {accounts.length} accounts across {platformOrder.filter((p) => grouped[p].length > 0).length} platforms
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Pick the ones you want to bring into your agency. You can always add more later.
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-2xl font-bold text-primary tabular-nums leading-none">{selected.size}</p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">selected</p>
        </div>
      </div>

      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, handle, or brand…"
          className="pl-9 h-9"
        />
      </div>

      <div className="max-h-[380px] overflow-y-auto pr-1 -mr-1 space-y-3">
        {platformOrder.map((p) => {
          const list = grouped[p];
          if (list.length === 0) return null;
          const Icon = ICON_MAP[p === "Meta" ? "Facebook" : p];
          const allSelected = list.every((a) => selected.has(a.id));
          const someSelected = list.some((a) => selected.has(a.id));
          const isCollapsed = collapsed.has(p);

          return (
            <div key={p} className="border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleCollapse(p)}
                className="w-full flex items-center gap-3 px-3 py-2.5 bg-muted/40 hover:bg-muted transition-colors"
              >
                <Checkbox
                  checked={allSelected ? true : someSelected ? "indeterminate" : false}
                  onCheckedChange={() => togglePlatform(p)}
                  onClick={(e) => e.stopPropagation()}
                  className="h-[18px] w-[18px] rounded-[4px]"
                />
                <Icon className="h-4 w-4 text-foreground" />
                <span className="text-sm font-semibold text-foreground">{p}</span>
                <span className="text-[11px] text-muted-foreground">
                  {list.filter((a) => selected.has(a.id)).length} of {list.length} selected
                </span>
                <span className="ml-auto">
                  {isCollapsed ? (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </span>
              </button>

              {!isCollapsed && (
                <div className="divide-y divide-border">
                  {list.map((a) => {
                    const SubIcon = ICON_MAP[a.subPlatform];
                    const isSel = selected.has(a.id);
                    return (
                      <label
                        key={a.id}
                        className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors ${
                          isSel ? "bg-primary/[0.03]" : "hover:bg-muted/30"
                        }`}
                      >
                        <Checkbox
                          checked={isSel}
                          onCheckedChange={() => toggleOne(a.id)}
                          className="h-[18px] w-[18px] rounded-[4px]"
                        />
                        <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center text-xs font-semibold text-foreground shrink-0">
                          {a.name.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground truncate">{a.name}</p>
                          <p className="text-[11px] text-muted-foreground truncate flex items-center gap-1">
                            <SubIcon className="h-2.5 w-2.5" />
                            {a.subPlatform} · {a.handle}
                          </p>
                        </div>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground shrink-0">
                          {a.brand}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="py-2">
      <div className="text-center mb-5">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-3">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-lg font-bold text-foreground">Auto-create clients & projects?</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
          We detected {detectedBrands.length} distinct brand{detectedBrands.length !== 1 ? "s" : ""} in your selected accounts. We can spin up a client + starter project for each — pre-filled with logo & details.
        </p>
      </div>

      <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1 -mr-1">
        {detectedBrands.map(({ brand, count }) => {
          const checked = autoCreate.has(brand);
          return (
            <label
              key={brand}
              className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                checked
                  ? "border-primary bg-primary/[0.03]"
                  : "border-border hover:border-border-hover"
              }`}
            >
              <Checkbox
                checked={checked}
                onCheckedChange={() => toggleAutoCreate(brand)}
                className="h-[18px] w-[18px] rounded-[4px]"
              />
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/20 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                {brand.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{brand}</p>
                <p className="text-[11px] text-muted-foreground">
                  {count} account{count > 1 ? "s" : ""} · 1 starter project will be created
                </p>
              </div>
              {checked && <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />}
            </label>
          );
        })}
      </div>

      <div className="mt-4 p-3 rounded-lg bg-muted/40 border border-border text-[11px] text-muted-foreground flex items-start gap-2">
        <Sparkles className="h-3.5 w-3.5 text-primary shrink-0 mt-px" />
        <span>
          Each new client will get its logo and basic details auto-fetched from the connected social profile. You can edit anything later.
        </span>
      </div>
    </div>
  );

  const renderDone = () => (
    <div className="py-12 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-success/10 mb-4">
        <CheckCircle2 className="h-7 w-7 text-success" />
      </div>
      <h3 className="text-lg font-bold text-foreground">All set! 🎉</h3>
      <p className="text-sm text-muted-foreground mt-1.5">
        Connecting {selected.size} accounts and creating {autoCreate.size} client workspaces…
      </p>
    </div>
  );

  // Footer per step
  const renderFooter = () => {
    if (step === "email")
      return (
        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={close}>Cancel</Button>
          <Button onClick={handleDiscover} disabled={!email.trim()} className="shadow-coral">
            Discover accounts <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </DialogFooter>
      );
    if (step === "select")
      return (
        <DialogFooter className="gap-2 sm:justify-between">
          <Button variant="ghost" onClick={() => setStep("email")}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <Button onClick={goToProjects} disabled={selected.size === 0} className="shadow-coral">
            Continue with {selected.size} account{selected.size !== 1 ? "s" : ""}{" "}
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </DialogFooter>
      );
    if (step === "projects")
      return (
        <DialogFooter className="gap-2 sm:justify-between">
          <Button variant="ghost" onClick={() => setStep("select")}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => { setAutoCreate(new Set()); handleFinish(); }}>
              Skip auto-creation
            </Button>
            <Button onClick={handleFinish} className="shadow-coral">
              Connect & create <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </DialogFooter>
      );
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? onOpenChange(true) : close())}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <DialogTitle>Bulk connect via master email</DialogTitle>
          </div>
          <DialogDescription className="text-xs">
            Connect every social account your agency manages in one flow.
          </DialogDescription>
          {step !== "discovering" && step !== "done" && (
            <div className="flex items-center gap-1.5 mt-3">
              {(["email", "select", "projects"] as const).map((s, i) => {
                const idx = ["email", "select", "projects"].indexOf(step);
                const isActive = step === s;
                const isPast = i < idx;
                return (
                  <div key={s} className="flex items-center gap-1.5 flex-1">
                    <div
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        isActive || isPast ? "bg-primary" : "bg-border"
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {step === "email" && renderEmail()}
          {step === "discovering" && renderDiscovering()}
          {step === "select" && renderSelect()}
          {step === "projects" && renderProjects()}
          {step === "done" && renderDone()}
        </div>

        {renderFooter()}
      </DialogContent>
    </Dialog>
  );
};

export default BulkConnectDialog;
