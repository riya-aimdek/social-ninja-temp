import { useState } from "react";
import { Plus, Trash2, Check, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROLES, type Permission } from "@/data/roles";

export type RoleScope = "agency" | "client";

/* ── Permissions shown as columns ────────────────────────────────── */
const COLS: Permission[] = ["Publish", "Approve", "Engage", "Listen", "Analyze", "Boost", "ORM"];

/* ── Internal row type ───────────────────────────────────────────── */
interface RoleRow {
  id: string;
  name: string;
  desc: string;
  isCustom: boolean;
  perms: Record<Permission, boolean>;
}

/* ── Build initial rows from roles.ts ────────────────────────────── */
function buildRows(scope: RoleScope): RoleRow[] {
  return ROLES.filter((r) => r.scope === scope || r.scope === "either")
    .sort((a, b) => b.level - a.level)
    .map((r) => ({
      id: r.id,
      name: r.name,
      desc: r.desc,
      isCustom: false,
      perms: Object.fromEntries(
        COLS.map((p) => [p, r.defaultPermissions.includes(p)]),
      ) as Record<Permission, boolean>,
    }));
}

const uid = () => `custom-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;

/* ── Checkbox cell ───────────────────────────────────────────────── */
function PermCheck({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={cn(
        "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all mx-auto",
        checked
          ? "bg-primary border-primary text-primary-foreground"
          : "border-border bg-background hover:border-primary/60",
      )}
    >
      {checked && <Check className="w-3 h-3 stroke-[3]" />}
    </button>
  );
}

/* ── Main component ──────────────────────────────────────────────── */
export function RolesPermissionsSettings({ scope }: { scope: RoleScope }) {
  const [rows, setRows] = useState<RoleRow[]>(() => buildRows(scope));

  function togglePerm(rowId: string, perm: Permission) {
    setRows((prev) =>
      prev.map((r) =>
        r.id === rowId ? { ...r, perms: { ...r.perms, [perm]: !r.perms[perm] } } : r,
      ),
    );
  }

  function setName(rowId: string, name: string) {
    setRows((prev) => prev.map((r) => (r.id === rowId ? { ...r, name } : r)));
  }

  function addRole() {
    setRows((prev) => [
      ...prev,
      {
        id: uid(),
        name: "",
        desc: "",
        isCustom: true,
        perms: Object.fromEntries(COLS.map((p) => [p, false])) as Record<Permission, boolean>,
      },
    ]);
  }

  function deleteRole(id: string) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  const scopeLabel = scope === "agency" ? "agency" : "business";

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
          onClick={addRole}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg gradient-coral text-primary-foreground shadow-sm hover:opacity-90 transition-opacity shrink-0"
        >
          <Plus className="w-3.5 h-3.5" /> Create New Role
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
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
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.id}
                  className={cn(
                    "border-b border-border last:border-0 transition-colors hover:bg-accent/30",
                    i % 2 === 0 ? "bg-card" : "bg-muted/20",
                  )}
                >
                  {/* Role name */}
                  <td className="px-4 py-3">
                    {row.isCustom ? (
                      <input
                        value={row.name}
                        onChange={(e) => setName(row.id, e.target.value)}
                        placeholder="Role name…"
                        autoFocus
                        className="w-full text-sm bg-background border border-border rounded-lg px-2.5 py-1.5 outline-none focus:border-primary transition-colors"
                      />
                    ) : (
                      <div>
                        <p className="font-medium text-foreground leading-tight">{row.name}</p>
                        {row.desc && (
                          <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug line-clamp-1">
                            {row.desc}
                          </p>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Permission checkboxes */}
                  {COLS.map((p) => (
                    <td key={p} className="px-3 py-3">
                      <PermCheck
                        checked={row.perms[p]}
                        onChange={() => togglePerm(row.id, p)}
                      />
                    </td>
                  ))}

                  {/* Delete — custom roles only */}
                  <td className="px-3 py-3">
                    {row.isCustom ? (
                      <button
                        onClick={() => deleteRole(row.id)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-error hover:bg-error/10 transition-colors mx-auto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    ) : null}
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
            ? "These permissions apply to your agency team members. Toggle to grant or restrict access per role."
            : "These permissions apply to team members in this business account. Custom roles can be created for specific needs."}
        </p>
      </div>
    </div>
  );
}
