import { useEffect, useMemo, useState } from "react";
import AgencyLayout from "@/components/layout/AgencyLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  FolderKanban,
  Settings2,
  Trash2,
  Unplug,
  ChevronRight,
  ChevronLeft,
  X,
  ArrowLeft,
  Check,
  Building2,
  MoreHorizontal,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

// ───────────────────────── Types & mock data ─────────────────────────
type Platform = "Facebook" | "Instagram" | "LinkedIn" | "Twitter" | "YouTube" | "Pinterest";
type AccountStatus = "connected" | "reconnect";

interface SocialAccount {
  id: string;
  name: string;
  handle: string;
  platform: Platform;
  status: AccountStatus;
  assignments: { clientId: string; projectIds: string[] }[];
}

interface Client {
  id: string;
  name: string;
  projects: { id: string; name: string }[];
}

const mockClients: Client[] = [
  {
    id: "c1",
    name: "client-2",
    projects: [
      { id: "p1-c2", name: "p1-c2" },
      { id: "p2-c2", name: "p2-c2" },
    ],
  },
  {
    id: "c2",
    name: "acme prop",
    projects: [{ id: "project-1", name: "project-1" }],
  },
  {
    id: "c3",
    name: "Northwind Co",
    projects: [
      { id: "nw-launch", name: "Spring Launch" },
      { id: "nw-always", name: "Always-On" },
    ],
  },
  {
    id: "c4",
    name: "Globex Retail",
    projects: [
      { id: "gx-blackfri", name: "Black Friday" },
      { id: "gx-loyalty", name: "Loyalty Program" },
      { id: "gx-brand", name: "Brand Awareness" },
    ],
  },
];

const seedAccounts: Omit<SocialAccount, "id">[] = [
  { name: "AI Page trial", handle: "@aipagetrial", platform: "Facebook", status: "connected", assignments: [{ clientId: "c1", projectIds: ["p1-c2", "p2-c2"] }, { clientId: "c2", projectIds: ["project-1"] }] },
  { name: "born._to_code_", handle: "@born._to_code_", platform: "Instagram", status: "connected", assignments: [{ clientId: "c1", projectIds: ["p1-c2", "p2-c2"] }, { clientId: "c2", projectIds: ["project-1"] }] },
  { name: "Just JS", handle: "@justjs", platform: "Facebook", status: "connected", assignments: [{ clientId: "c1", projectIds: ["p1-c2"] }] },
  { name: "Test hack", handle: "@testhack", platform: "Facebook", status: "connected", assignments: [] },
  { name: "Trials AI", handle: "@trialsai", platform: "Facebook", status: "reconnect", assignments: [{ clientId: "c2", projectIds: ["project-1"] }] },
  { name: "Northwind Official", handle: "@northwind", platform: "Instagram", status: "connected", assignments: [{ clientId: "c3", projectIds: ["nw-launch", "nw-always"] }] },
  { name: "Northwind LinkedIn", handle: "northwind-co", platform: "LinkedIn", status: "connected", assignments: [{ clientId: "c3", projectIds: ["nw-always"] }] },
  { name: "Globex Retail", handle: "@globex", platform: "Facebook", status: "connected", assignments: [{ clientId: "c4", projectIds: ["gx-blackfri", "gx-loyalty", "gx-brand"] }] },
  { name: "Globex IG", handle: "@globex.shop", platform: "Instagram", status: "connected", assignments: [{ clientId: "c4", projectIds: ["gx-blackfri", "gx-brand"] }] },
  { name: "Globex on X", handle: "@globex_x", platform: "Twitter", status: "reconnect", assignments: [{ clientId: "c4", projectIds: ["gx-brand"] }] },
  { name: "Globex Tube", handle: "GlobexTV", platform: "YouTube", status: "connected", assignments: [{ clientId: "c4", projectIds: ["gx-brand"] }] },
  { name: "Acme Pinterest", handle: "@acme.pin", platform: "Pinterest", status: "connected", assignments: [{ clientId: "c2", projectIds: ["project-1"] }] },
  { name: "Acme LinkedIn", handle: "acme-prop", platform: "LinkedIn", status: "connected", assignments: [] },
  { name: "Sanskruti Studio", handle: "@sanskruti.studio", platform: "Instagram", status: "connected", assignments: [{ clientId: "c1", projectIds: ["p2-c2"] }] },
  { name: "Sanskruti FB", handle: "SanskrutiPage", platform: "Facebook", status: "connected", assignments: [] },
  { name: "Brand Studio X", handle: "@brand_studio_x", platform: "Twitter", status: "connected", assignments: [{ clientId: "c3", projectIds: ["nw-launch"] }] },
  { name: "Holiday Drop", handle: "@holidaydrop", platform: "Instagram", status: "reconnect", assignments: [] },
  { name: "Press Page", handle: "PressPage", platform: "Facebook", status: "connected", assignments: [{ clientId: "c4", projectIds: ["gx-loyalty"] }] },
];

const initialAccounts: SocialAccount[] = seedAccounts.map((a, i) => ({ ...a, id: `acc-${i + 1}` }));

// ───────────────────────── Platform meta ─────────────────────────
const platformMeta: Record<
  Platform,
  { Icon: typeof Facebook; label: string; iconColor: string; ring: string }
> = {
  Facebook: { Icon: Facebook, label: "Facebook", iconColor: "text-[#1877F2]", ring: "bg-blue-50" },
  Instagram: { Icon: Instagram, label: "Instagram", iconColor: "text-[#E4405F]", ring: "bg-pink-50" },
  LinkedIn: { Icon: Linkedin, label: "LinkedIn", iconColor: "text-[#0A66C2]", ring: "bg-sky-50" },
  Twitter: { Icon: Twitter, label: "Twitter / X", iconColor: "text-foreground", ring: "bg-muted" },
  YouTube: { Icon: Youtube, label: "YouTube", iconColor: "text-[#FF0000]", ring: "bg-red-50" },
  Pinterest: { Icon: ImageIcon, label: "Pinterest", iconColor: "text-[#E60023]", ring: "bg-red-50" },
};

const countAssignments = (a: SocialAccount) =>
  a.assignments.reduce((sum, x) => sum + x.projectIds.length, 0);

// ───────────────────────── Page ─────────────────────────
const AgencySocialAccounts = () => {
  const [accounts, setAccounts] = useState<SocialAccount[]>(initialAccounts);
  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 12;

  const [manageAccount, setManageAccount] = useState<SocialAccount | null>(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const [removeAccount, setRemoveAccount] = useState<SocialAccount | null>(null);

  const filtered = useMemo(() => {
    return accounts.filter((a) => {
      if (platformFilter !== "all" && a.platform !== platformFilter) return false;
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!a.name.toLowerCase().includes(q) && !a.handle.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [accounts, search, platformFilter, statusFilter]);

  useEffect(() => { setPage(1); }, [search, platformFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = useMemo(
    () => filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filtered, currentPage],
  );

  const allVisibleSelected = paged.length > 0 && paged.every((a) => selected.has(a.id));
  const someVisibleSelected = paged.some((a) => selected.has(a.id));

  const toggleAll = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allVisibleSelected) paged.forEach((a) => next.delete(a.id));
      else paged.forEach((a) => next.add(a.id));
      return next;
    });
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const clearSelection = () => setSelected(new Set());

  const handleRemoveAssignment = (accountId: string, clientId: string, projectId: string) => {
    setAccounts((prev) =>
      prev.map((a) => {
        if (a.id !== accountId) return a;
        const assignments = a.assignments
          .map((as) =>
            as.clientId === clientId
              ? { ...as, projectIds: as.projectIds.filter((p) => p !== projectId) }
              : as,
          )
          .filter((as) => as.projectIds.length > 0);
        return { ...a, assignments };
      }),
    );
    setManageAccount((curr) => {
      if (!curr || curr.id !== accountId) return curr;
      const assignments = curr.assignments
        .map((as) =>
          as.clientId === clientId
            ? { ...as, projectIds: as.projectIds.filter((p) => p !== projectId) }
            : as,
        )
        .filter((as) => as.projectIds.length > 0);
      return { ...curr, assignments };
    });
    toast.success("Assignment removed");
  };

  const handleBulkAssign = (selections: { clientId: string; projectIds: string[] }[]) => {
    setAccounts((prev) =>
      prev.map((a) => {
        if (!selected.has(a.id)) return a;
        const next = [...a.assignments];
        for (const sel of selections) {
          const existing = next.find((x) => x.clientId === sel.clientId);
          if (existing) {
            existing.projectIds = Array.from(new Set([...existing.projectIds, ...sel.projectIds]));
          } else {
            next.push({ clientId: sel.clientId, projectIds: [...sel.projectIds] });
          }
        }
        return { ...a, assignments: next };
      }),
    );
    const projectCount = selections.reduce((s, x) => s + x.projectIds.length, 0);
    toast.success(`Assigned ${selected.size} account${selected.size > 1 ? "s" : ""} to ${projectCount} project${projectCount > 1 ? "s" : ""}`);
    setAssignOpen(false);
    clearSelection();
  };

  const handleDisconnect = (a: SocialAccount) => {
    toast.success(`${a.name} disconnected`);
  };

  const handleRemoveAccount = () => {
    if (!removeAccount) return;
    setAccounts((prev) => prev.filter((a) => a.id !== removeAccount.id));
    setSelected((prev) => {
      const n = new Set(prev);
      n.delete(removeAccount.id);
      return n;
    });
    toast.success(`${removeAccount.name} removed from agency`);
    setRemoveAccount(null);
  };

  return (
    <AgencyLayout title="Social Accounts">
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Social Accounts</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Connect once, assign anywhere. Manage all social accounts your agency uses across clients and projects.
            </p>
          </div>
          <Button className="gap-2 shadow-coral">
            <Plus className="h-4 w-4" /> Connect Account
          </Button>
        </div>

        <div className="bg-card rounded-xl shadow-card p-3 flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex items-center gap-2 px-2">
            <Checkbox
              checked={allVisibleSelected ? true : someVisibleSelected ? "indeterminate" : false}
              onCheckedChange={toggleAll}
              aria-label="Select all on this page"
              className="h-[18px] w-[18px] rounded-[4px]"
            />
            <span className="text-xs font-medium text-muted-foreground select-none">
              {selected.size > 0 ? `${selected.size} selected` : "Select all"}
            </span>
          </div>
          <div className="h-6 w-px bg-border hidden md:block" />
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or handle…"
              className="pl-9 h-9 bg-background"
            />
          </div>
          <Select value={platformFilter} onValueChange={setPlatformFilter}>
            <SelectTrigger className="h-9 w-full md:w-[160px]">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All platforms</SelectItem>
              {(Object.keys(platformMeta) as Platform[]).map((p) => (
                <SelectItem key={p} value={p}>
                  {platformMeta[p].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-full md:w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="connected">Connected</SelectItem>
              <SelectItem value="reconnect">Needs reconnect</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-card rounded-xl shadow-card py-16 text-center">
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-3">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">No accounts match your filters</p>
            <p className="text-xs text-muted-foreground mt-1">Try clearing filters or connect a new account.</p>
          </div>
        ) : (
          <>
            {selected.size > 0 && (
              <div className="flex items-center justify-end px-1">
                <button onClick={clearSelection} className="text-xs text-primary hover:underline font-medium">
                  Clear selection
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {paged.map((a) => {
                const meta = platformMeta[a.platform];
                const PIcon = meta.Icon;
                const isSelected = selected.has(a.id);
                const assignmentCount = countAssignments(a);
                const clientCount = a.assignments.length;

                const chips: { key: string; client: string; project: string }[] = [];
                for (const as of a.assignments) {
                  const client = mockClients.find((c) => c.id === as.clientId);
                  if (!client) continue;
                  for (const pid of as.projectIds) {
                    const proj = client.projects.find((p) => p.id === pid);
                    chips.push({
                      key: `${as.clientId}-${pid}`,
                      client: client.name,
                      project: proj?.name || pid,
                    });
                  }
                }
                const visibleChips = chips.slice(0, 2);
                const hiddenChips = chips.slice(2);

                return (
                  <div
                    key={a.id}
                    onClick={() => toggleOne(a.id)}
                    className={`group relative bg-card rounded-xl border transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? "border-primary ring-2 ring-primary/20 shadow-sm"
                        : "border-border hover:border-border-hover hover:shadow-sm"
                    }`}
                  >
                    <div className="p-3 flex items-center gap-3">
                      <div className="relative shrink-0">
                        <div className={`w-10 h-10 rounded-lg ${meta.ring} flex items-center justify-center text-sm font-semibold text-foreground`}>
                          {a.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-card border border-border shadow-sm flex items-center justify-center">
                          <PIcon className={`h-2.5 w-2.5 ${meta.iconColor}`} />
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-semibold text-foreground truncate leading-tight">{a.name}</p>
                          {a.status === "connected" ? (
                            <span title="Connected" className="w-1.5 h-1.5 rounded-full bg-success shrink-0" />
                          ) : (
                            <span title="Reconnect needed" className="w-1.5 h-1.5 rounded-full bg-warning shrink-0 animate-pulse" />
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground truncate leading-tight mt-0.5">
                          <span className={`font-medium ${meta.iconColor}`}>{meta.label}</span>
                          <span className="mx-1 opacity-50">·</span>
                          {a.handle}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem onClick={() => setManageAccount(a)}>
                              <Settings2 className="h-3.5 w-3.5 mr-2" /> Manage assignments
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { setSelected(new Set([a.id])); setAssignOpen(true); }}>
                              <FolderKanban className="h-3.5 w-3.5 mr-2" /> Assign to project
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDisconnect(a)}>
                              <Unplug className="h-3.5 w-3.5 mr-2" /> Disconnect
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setRemoveAccount(a)}
                              className="text-destructive focus:text-destructive focus:bg-destructive/10"
                            >
                              <Trash2 className="h-3.5 w-3.5 mr-2" /> Remove account
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleOne(a.id)}
                          aria-label={`Select ${a.name}`}
                          className="h-[18px] w-[18px] rounded-[4px]"
                        />
                      </div>
                    </div>

                    <div className="px-3 pb-3 border-t border-border/60 mt-1 pt-2.5">
                      {chips.length === 0 ? (
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelected(new Set([a.id])); setAssignOpen(true); }}
                          className="w-full flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground bg-muted/40 hover:bg-muted rounded-md px-2 py-1.5 border border-dashed border-border transition-colors"
                        >
                          <Plus className="h-3 w-3" /> Assign to a project
                        </button>
                      ) : (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                              Assigned to
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {clientCount} {clientCount === 1 ? "client" : "clients"} · {assignmentCount} {assignmentCount === 1 ? "project" : "projects"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 flex-wrap">
                            {visibleChips.map((c) => (
                              <span
                                key={c.key}
                                title={`${c.client} → ${c.project}`}
                                className="inline-flex items-center gap-1 text-[10px] font-medium bg-muted/70 text-foreground px-1.5 py-0.5 rounded max-w-[160px]"
                              >
                                <span className="truncate">{c.client}</span>
                                <ChevronRight className="h-2.5 w-2.5 text-muted-foreground shrink-0" />
                                <span className="truncate text-muted-foreground">{c.project}</span>
                              </span>
                            ))}
                            {hiddenChips.length > 0 && (
                              <Popover>
                                <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
                                  <button className="text-[10px] font-medium text-primary hover:underline px-1 py-0.5">
                                    +{hiddenChips.length} more
                                  </button>
                                </PopoverTrigger>
                                <PopoverContent
                                  align="end"
                                  className="w-64 p-2"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-2 pt-1 pb-2">
                                    All assignments ({chips.length})
                                  </p>
                                  <div className="space-y-1 max-h-64 overflow-y-auto">
                                    {chips.map((c) => (
                                      <div
                                        key={c.key}
                                        className="flex items-center gap-1.5 text-xs px-2 py-1.5 rounded hover:bg-muted"
                                      >
                                        <Building2 className="h-3 w-3 text-muted-foreground shrink-0" />
                                        <span className="font-medium text-foreground truncate">{c.client}</span>
                                        <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
                                        <span className="text-muted-foreground truncate">{c.project}</span>
                                      </div>
                                    ))}
                                  </div>
                                  <button
                                    onClick={() => setManageAccount(a)}
                                    className="w-full text-center text-[11px] font-medium text-primary hover:underline mt-2 pt-2 border-t border-border"
                                  >
                                    Manage assignments →
                                  </button>
                                </PopoverContent>
                              </Popover>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-muted-foreground">
                  Page <span className="font-medium text-foreground">{currentPage}</span> of{" "}
                  <span className="font-medium text-foreground">{totalPages}</span>
                </p>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1"
                    disabled={currentPage === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    <ChevronLeft className="h-3.5 w-3.5" /> Previous
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                    .map((p, idx, arr) => (
                      <span key={p} className="flex items-center">
                        {idx > 0 && arr[idx - 1] !== p - 1 && (
                          <span className="px-1 text-xs text-muted-foreground">…</span>
                        )}
                        <button
                          onClick={() => setPage(p)}
                          className={`h-8 min-w-8 px-2 rounded-md text-xs font-medium transition-colors ${
                            p === currentPage
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          {p}
                        </button>
                      </span>
                    ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1"
                    disabled={currentPage === totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Next <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {selected.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-fade-in">
          <div className="bg-foreground text-background rounded-full shadow-lg flex items-center gap-2 pl-5 pr-2 py-2">
            <span className="text-sm font-medium">
              {selected.size} account{selected.size > 1 ? "s" : ""} selected
            </span>
            <Button
              size="sm"
              className="rounded-full gap-1.5 h-8 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => setAssignOpen(true)}
            >
              <FolderKanban className="h-3.5 w-3.5" /> Assign to Projects
            </Button>
            <button
              onClick={clearSelection}
              className="w-8 h-8 rounded-full hover:bg-background/10 flex items-center justify-center transition-colors"
              aria-label="Clear selection"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <ManageAssignmentsDialog
        account={manageAccount}
        clients={mockClients}
        onClose={() => setManageAccount(null)}
        onRemove={handleRemoveAssignment}
      />

      <AssignWizardDialog
        open={assignOpen}
        onOpenChange={setAssignOpen}
        clients={mockClients}
        accounts={accounts.filter((a) => selected.has(a.id))}
        onConfirm={handleBulkAssign}
      />

      <Dialog open={!!removeAccount} onOpenChange={(o) => !o && setRemoveAccount(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Remove this account?</DialogTitle>
            <DialogDescription>
              <span className="font-medium text-foreground">{removeAccount?.name}</span> will be removed from your agency
              and unassigned from all projects. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRemoveAccount(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRemoveAccount}>
              Remove account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AgencyLayout>
  );
};

function ManageAssignmentsDialog({
  account,
  clients,
  onClose,
  onRemove,
}: {
  account: SocialAccount | null;
  clients: Client[];
  onClose: () => void;
  onRemove: (accountId: string, clientId: string, projectId: string) => void;
}) {
  if (!account) return null;
  const meta = platformMeta[account.platform];
  const PIcon = meta.Icon;
  const total = countAssignments(account);

  return (
    <Dialog open={!!account} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-start gap-3">
            <div className="relative shrink-0">
              <div className={`w-10 h-10 rounded-full ${meta.ring} flex items-center justify-center text-sm font-semibold`}>
                {account.name.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-card border-2 border-card flex items-center justify-center">
                <PIcon className={`h-2.5 w-2.5 ${meta.iconColor}`} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-base">Manage Assignments</DialogTitle>
              <DialogDescription className="text-xs mt-0.5">
                {account.name} · {total} project{total !== 1 ? "s" : ""}
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="max-h-[420px] overflow-y-auto px-6 py-4 space-y-5">
          {account.assignments.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mx-auto mb-2">
                <FolderKanban className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">No projects assigned</p>
              <p className="text-xs text-muted-foreground mt-1">
                Select this account on the previous screen and use "Assign to Projects".
              </p>
            </div>
          ) : (
            account.assignments.map((as) => {
              const client = clients.find((c) => c.id === as.clientId);
              if (!client) return null;
              return (
                <div key={as.clientId}>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    {client.name}
                  </p>
                  <div className="space-y-1.5">
                    {as.projectIds.map((pid) => {
                      const project = client.projects.find((p) => p.id === pid);
                      return (
                        <div
                          key={pid}
                          className="flex items-center justify-between bg-muted/50 hover:bg-muted rounded-lg px-3 py-2.5 transition-colors group"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <FolderKanban className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span className="text-sm font-medium text-foreground truncate">
                              {project?.name || pid}
                            </span>
                          </div>
                          <button
                            onClick={() => onRemove(account.id, as.clientId, pid)}
                            className="text-xs font-medium text-destructive hover:underline shrink-0"
                          >
                            Remove
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="px-6 py-4 border-t border-border bg-muted/30 flex justify-end">
          <Button onClick={onClose}>Done</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AssignWizardDialog({
  open,
  onOpenChange,
  clients,
  accounts,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  clients: Client[];
  accounts: SocialAccount[];
  onConfirm: (selections: { clientId: string; projectIds: string[] }[]) => void;
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedClients, setSelectedClients] = useState<Set<string>>(new Set());
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set());

  const projectIsAlreadyAssigned = (clientId: string, projectId: string) => {
    if (accounts.length === 0) return false;
    return accounts.every((a) =>
      a.assignments.some((as) => as.clientId === clientId && as.projectIds.includes(projectId)),
    );
  };

  const reset = () => {
    setStep(1);
    setSelectedClients(new Set());
    setSelectedProjects(new Set());
  };

  const handleOpenChange = (o: boolean) => {
    if (!o) reset();
    onOpenChange(o);
  };

  const toggleClient = (id: string) => {
    setSelectedClients((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const toggleProject = (id: string) => {
    setSelectedProjects((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const eligibleProjects = clients
    .filter((c) => selectedClients.has(c.id))
    .flatMap((c) =>
      c.projects.map((p) => ({
        clientId: c.id,
        clientName: c.name,
        projectId: p.id,
        projectName: p.name,
        already: projectIsAlreadyAssigned(c.id, p.id),
      })),
    );

  const selectableCount = eligibleProjects.filter((p) => !p.already).length;
  const newSelectedCount = Array.from(selectedProjects).filter((pid) => {
    const ep = eligibleProjects.find((e) => e.projectId === pid);
    return ep && !ep.already;
  }).length;

  const confirm = () => {
    const grouped: Record<string, string[]> = {};
    for (const pid of selectedProjects) {
      const ep = eligibleProjects.find((e) => e.projectId === pid);
      if (!ep || ep.already) continue;
      grouped[ep.clientId] = grouped[ep.clientId] || [];
      grouped[ep.clientId].push(pid);
    }
    const selections = Object.entries(grouped).map(([clientId, projectIds]) => ({
      clientId,
      projectIds,
    }));
    onConfirm(selections);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-border">
          <DialogTitle className="text-base">Assign to Projects</DialogTitle>
          <DialogDescription className="text-xs mt-0.5">
            {accounts.length} account{accounts.length > 1 ? "s" : ""} selected
          </DialogDescription>

          <div className="flex items-center gap-2 mt-4">
            <StepPill index={1} label="Select Clients" active={step === 1} done={step === 2} />
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            <StepPill index={2} label="Select Projects" active={step === 2} done={false} />
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto px-6 py-4">
          {step === 1 ? (
            <div className="space-y-2">
              {clients.map((c) => {
                const isSel = selectedClients.has(c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => toggleClient(c.id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg border transition-all text-left ${
                      isSel
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40 hover:bg-muted/40"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                        isSel ? "bg-primary text-primary-foreground" : "border border-border"
                      }`}
                    >
                      {isSel && <Check className="h-3 w-3" />}
                    </div>
                    <span className="flex-1 text-sm font-medium text-foreground">{c.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {c.projects.length} project{c.projects.length !== 1 ? "s" : ""}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-5">
              {clients
                .filter((c) => selectedClients.has(c.id))
                .map((c) => (
                  <div key={c.id}>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                      {c.name}
                    </p>
                    <div className="space-y-1.5">
                      {c.projects.map((p) => {
                        const already = projectIsAlreadyAssigned(c.id, p.id);
                        const isSel = selectedProjects.has(p.id);
                        return (
                          <button
                            key={p.id}
                            onClick={() => !already && toggleProject(p.id)}
                            disabled={already}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all text-left ${
                              already
                                ? "border-border bg-muted/40 cursor-not-allowed opacity-70"
                                : isSel
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/40 hover:bg-muted/40"
                            }`}
                          >
                            <div
                              className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                                already
                                  ? "bg-muted border border-border"
                                  : isSel
                                  ? "bg-primary text-primary-foreground"
                                  : "border border-border"
                              }`}
                            >
                              {(isSel || already) && <Check className="h-3 w-3" />}
                            </div>
                            <FolderKanban className="h-4 w-4 text-muted-foreground" />
                            <span className="flex-1 text-sm font-medium text-foreground">
                              {p.name}
                            </span>
                            {already && (
                              <span className="text-[11px] text-muted-foreground font-medium">
                                Already assigned
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              {selectableCount === 0 && (
                <p className="text-xs text-muted-foreground text-center py-4">
                  All projects in the selected clients already have these accounts assigned.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-border bg-muted/30 flex items-center justify-between">
          {step === 2 ? (
            <button
              onClick={() => setStep(1)}
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </button>
          ) : (
            <span />
          )}
          {step === 1 ? (
            <Button
              disabled={selectedClients.size === 0}
              onClick={() => setStep(2)}
              className="gap-1.5"
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          ) : (
            <Button disabled={newSelectedCount === 0} onClick={confirm}>
              {newSelectedCount === 0
                ? "Assign"
                : `Assign to ${newSelectedCount} project${newSelectedCount > 1 ? "s" : ""}`}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function StepPill({
  index,
  label,
  active,
  done,
}: {
  index: number;
  label: string;
  active: boolean;
  done: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors ${
          active || done
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {done ? <Check className="h-3 w-3" /> : index}
      </div>
      <span
        className={`text-xs font-semibold ${
          active ? "text-foreground" : "text-muted-foreground"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

export default AgencySocialAccounts;
