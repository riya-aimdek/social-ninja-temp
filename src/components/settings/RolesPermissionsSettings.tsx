import React, { useState, useEffect } from "react";
import {
  Plus, Check, ShieldCheck, Pencil, Trash2,
  Link2, PenLine, Send, BadgeCheck, BarChart2,
  MessageCircle, Ear, Zap, Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ROLES, type Permission } from "@/data/roles";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";

export type RoleScope = "agency" | "client";

/* ── Permissions shown as columns ────────────────────────────────── */
const COLS: Permission[] = ["Connect", "Create", "Publish", "Approve", "Analyze", "Engage", "Listen", "Boost", "ORM"];

/* ── Internal row type ───────────────────────────────────────────── */
interface RoleRow {
  id: string;
  name: string;
  isCustom: boolean;
  perms: Record<Permission, boolean>;
}

/* ── Explicit ordered role IDs per scope ─────────────────────────── */
const AGENCY_ROLE_ORDER = [
  "agency-admin",
  "agency-account-manager",
  "business-admin",
  "content-creator",
  "social-media-manager",
  "approver",
  "viewer",
  "client",
  "orm",
];

const CLIENT_ROLE_ORDER = [
  "business-admin-local",
  "content-creator",
  "social-media-manager",
  "approver",
  "viewer",
  "client",
  "orm",
];

const AGENCY_CLIENT_ROLE_ORDER = [
  "business-admin",       // "Client Admin" — shown when inside agency
  "content-creator",
  "social-media-manager",
  "approver",
  "viewer",
  "client",
  "orm",
];

/* ── Build initial rows from roles.ts ────────────────────────────── */
function buildRows(scope: RoleScope, agencyManaged = false): RoleRow[] {
  const order = scope === "agency"
    ? AGENCY_ROLE_ORDER
    : agencyManaged ? AGENCY_CLIENT_ROLE_ORDER : CLIENT_ROLE_ORDER;
  return order
    .map((id) => ROLES.find((r) => r.id === id))
    .filter(Boolean)
    .map((r) => ({
      id: r!.id,
      name: r!.name,
      isCustom: false,
      perms: Object.fromEntries(
        COLS.map((p) => [p, r!.defaultPermissions.includes(p)]),
      ) as Record<Permission, boolean>,
    }));
}

const uid = () => `custom-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
const emptyPerms = () => Object.fromEntries(COLS.map((p) => [p, false])) as Record<Permission, boolean>;

/* ── Read-only indicator dot ─────────────────────────────────────── */
function PermDot({ checked }: { checked: boolean }) {
  return (
    <div className="flex items-center justify-center">
      <div className={cn(
        "w-5 h-5 rounded border-2 flex items-center justify-center",
        checked ? "bg-primary border-primary text-primary-foreground" : "border-border bg-background",
      )}>
        {checked && <Check className="w-3 h-3 stroke-[3]" />}
      </div>
    </div>
  );
}

/* ── Modal checkbox ──────────────────────────────────────────────── */
function ModalCheck({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={cn(
        "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
        checked ? "bg-primary border-primary text-primary-foreground" : "border-border bg-background hover:border-primary/60",
      )}
    >
      {checked && <Check className="w-3 h-3 stroke-[3]" />}
    </button>
  );
}

/* ── Permission metadata ─────────────────────────────────────────── */
const PERM_META: Record<Permission, { icon: React.ElementType; desc: string; color: string }> = {
  Connect:  { icon: Link2,        desc: "Link and manage social media accounts",        color: "bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400" },
  Create:   { icon: PenLine,      desc: "Draft and compose posts and content",           color: "bg-violet-100 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400" },
  Publish:  { icon: Send,         desc: "Publish and schedule content live",             color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400" },
  Approve:  { icon: BadgeCheck,   desc: "Review and approve posts before publishing",   color: "bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400" },
  Analyze:  { icon: BarChart2,    desc: "View analytics, reports, and insights",        color: "bg-cyan-100 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400" },
  Engage:   { icon: MessageCircle, desc: "Reply to comments and messages",              color: "bg-pink-100 text-pink-600 dark:bg-pink-950/40 dark:text-pink-400" },
  Listen:   { icon: Ear,          desc: "Monitor mentions, keywords, and trends",       color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400" },
  Boost:    { icon: Zap,          desc: "Manage paid promotions and ad campaigns",      color: "bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400" },
  ORM:      { icon: Star,         desc: "Online reputation monitoring and management",  color: "bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400" },
};

/* ── Edit / Create modal ─────────────────────────────────────────── */
function RoleModal({
  open, onClose, initial, onSave, isNew,
}: {
  open: boolean;
  onClose: () => void;
  initial: RoleRow;
  onSave: (row: RoleRow) => void;
  isNew: boolean;
}) {
  const [draft, setDraft] = useState<RoleRow>(initial);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (open) { setDraft({ ...initial, perms: { ...initial.perms } }); setTouched(false); }
  }, [open]);

  const selectedCount = COLS.filter((p) => draft.perms[p]).length;
  const allSelected = selectedCount === COLS.length;
  const nameError = touched && !draft.name.trim();

  function toggle(p: Permission) {
    setDraft((prev) => ({ ...prev, perms: { ...prev.perms, [p]: !prev.perms[p] } }));
  }

  function toggleAll() {
    const val = !allSelected;
    setDraft((prev) => ({ ...prev, perms: Object.fromEntries(COLS.map((p) => [p, val])) as Record<Permission, boolean> }));
  }

  function handleSave() {
    setTouched(true);
    if (!draft.name.trim()) return;
    onSave(draft);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-md p-0 overflow-hidden gap-0">

        {/* Modal header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <DialogTitle className="flex items-center gap-2.5 text-base">
            <div className="w-8 h-8 rounded-lg gradient-coral flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{isNew ? "Create New Role" : "Edit Role"}</p>
              {!isNew && <p className="text-xs font-normal text-muted-foreground mt-0.5">{initial.name}</p>}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-5 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* Role name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Role Name <span className="text-destructive">*</span>
            </label>
            <input
              value={draft.name}
              onChange={(e) => { setDraft((prev) => ({ ...prev, name: e.target.value })); setTouched(true); }}
              placeholder="e.g. Senior Editor"
              autoFocus
              className={cn(
                "w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-colors",
                nameError
                  ? "border-destructive bg-destructive/5 focus:ring-2 focus:ring-destructive/20"
                  : "border-input focus:ring-2 focus:ring-primary/20 focus:border-primary",
              )}
            />
            {nameError && <p className="text-xs text-destructive">Role name is required.</p>}
          </div>

          {/* Permissions */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground">
                Permissions
                <span className="ml-2 text-[11px] font-normal text-muted-foreground">
                  {selectedCount} of {COLS.length} selected
                </span>
              </label>
              <button
                type="button"
                onClick={toggleAll}
                className="text-[11px] font-medium text-primary hover:underline"
              >
                {allSelected ? "Deselect all" : "Select all"}
              </button>
            </div>

            <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
              {COLS.map((p) => {
                const meta = PERM_META[p];
                const Icon = meta.icon;
                const isChecked = draft.perms[p];
                return (
                  <div
                    key={p}
                    onClick={() => toggle(p)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors select-none",
                      isChecked ? "bg-primary/5 hover:bg-primary/8" : "hover:bg-muted/40",
                    )}
                  >
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", meta.color)}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground leading-tight">{p}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{meta.desc}</p>
                    </div>
                    <div className={cn(
                      "w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all",
                      isChecked ? "bg-primary border-primary text-primary-foreground" : "border-border bg-background",
                    )}>
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-muted/20 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-accent transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-lg gradient-coral text-primary-foreground text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all shadow-sm"
          >
            {isNew
              ? selectedCount > 0 ? `Create Role · ${selectedCount} permissions` : "Create Role"
              : "Save Changes"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ── Main component ──────────────────────────────────────────────── */
export function RolesPermissionsSettings({ scope, agencyManaged = false }: { scope: RoleScope; agencyManaged?: boolean }) {
  const [rows, setRows] = useState<RoleRow[]>(() => buildRows(scope, agencyManaged));
  const [editingRow, setEditingRow] = useState<RoleRow | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const newRoleTemplate: RoleRow = { id: uid(), name: "", isCustom: true, perms: emptyPerms() };

  function openEdit(row: RoleRow) {
    setEditingRow({ ...row, perms: { ...row.perms } });
  }

  function saveEdit(updated: RoleRow) {
    setRows((prev) => prev.map((r) => r.id === updated.id ? updated : r));
    setEditingRow(null);
  }

  function saveNew(row: RoleRow) {
    setRows((prev) => [...prev, { ...row, id: uid(), isCustom: true }]);
    setIsCreating(false);
  }

  function deleteRole(id: string) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-base font-semibold text-foreground">Roles &amp; Permissions</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {scope === "agency"
              ? "Define what each agency team member can do across all client accounts."
              : "Manage what each role can do within this business account."}
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg gradient-coral text-primary-foreground shadow-sm hover:opacity-90 transition-opacity shrink-0"
        >
          <Plus className="w-3.5 h-3.5" /> Create New Role
        </button>
      </div>

      {/* Read-only table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[780px]">
            <thead>
              <tr className="bg-muted/60 border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 w-52">
                  Role Name
                </th>
                {COLS.map((p) => (
                  <th key={p} className="text-center text-xs font-semibold text-muted-foreground px-3 py-3">
                    {p}
                  </th>
                ))}
                <th className="w-20 text-center text-xs font-semibold text-muted-foreground px-3 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.id}
                  className={cn(
                    "border-b border-border last:border-0",
                    i % 2 === 0 ? "bg-card" : "bg-muted/20",
                  )}
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground leading-tight">{row.name}</p>
                    {row.isCustom && (
                      <span className="text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded-full mt-0.5 inline-block">Custom</span>
                    )}
                  </td>

                  {/* Read-only permission indicators */}
                  {COLS.map((p) => (
                    <td key={p} className="px-3 py-3">
                      <PermDot checked={row.perms[p]} />
                    </td>
                  ))}

                  {/* Actions */}
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => openEdit(row)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                        title="Edit permissions"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      {row.isCustom && (
                        <button
                          onClick={() => deleteRole(row.id)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          title="Delete role"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info note */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-muted/50 border border-border">
        <ShieldCheck className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          {scope === "agency"
            ? "Click the pencil icon to edit permissions for any role. Custom roles can be deleted."
            : "Click the pencil icon to edit permissions for any role. Custom roles can be deleted."}
        </p>
      </div>

      {/* Edit modal */}
      {editingRow && (
        <RoleModal
          open={!!editingRow}
          onClose={() => setEditingRow(null)}
          initial={editingRow}
          onSave={saveEdit}
          isNew={false}
        />
      )}

      {/* Create modal */}
      <RoleModal
        open={isCreating}
        onClose={() => setIsCreating(false)}
        initial={newRoleTemplate}
        onSave={saveNew}
        isNew={true}
      />
    </div>
  );
}
