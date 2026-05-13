import { useState } from "react";
import {
  Plus, CheckCircle2, X, User, Users, RotateCcw, Zap,
  GitBranch, ChevronDown, ChevronUp, Trash2, Pencil, Check, Save,
  AlertTriangle, Globe, Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Types ──────────────────────────────────────────────────────── */
export type WorkflowScope = "client" | "agency";

interface WfStep {
  id: string;
  type: "user" | "role";
  assigneeId: string;
  approval: "any" | "all";
}

interface Workflow {
  id: string;
  name: string;
  isActive: boolean;
  steps: WfStep[];
}

/* ── Mock data ───────────────────────────────────────────────────── */
const CLIENT_ROLES = [
  { id: "business-admin",       name: "Client Admin"         },
  { id: "social-media-manager", name: "Social Media Manager" },
  { id: "content-creator",      name: "Content Creator"      },
  { id: "approver",             name: "Approver"             },
  { id: "orm",                  name: "ORM Specialist"       },
  { id: "client-reviewer",      name: "Client Reviewer"      },
];

const CLIENT_USERS = [
  { id: "u1", name: "John Smith",  role: "Client Admin"    },
  { id: "u2", name: "Emily Davis", role: "Content Creator" },
  { id: "u3", name: "Mike Wilson", role: "Approver"        },
  { id: "u5", name: "Sarah Park",  role: "Content Creator" },
  { id: "u6", name: "David Lee",   role: "SMM"             },
];

const DEFAULT_WORKFLOWS: Workflow[] = [
  {
    id: "wf-default",
    name: "Default Approval",
    isActive: true,
    steps: [
      { id: "s1", type: "role", assigneeId: "approver",             approval: "any" },
      { id: "s2", type: "role", assigneeId: "social-media-manager", approval: "any" },
    ],
  },
];

const MAX_WORKFLOWS = 3;
const uid   = () => `s${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
const wfUid = () => `wf${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

/* ── Toggle switch ───────────────────────────────────────────────── */
function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onChange(); }}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200",
        on ? "bg-success" : "bg-muted-foreground/30",
      )}
    >
      <span className={cn(
        "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200",
        on ? "translate-x-5" : "translate-x-0",
      )} />
    </button>
  );
}

/* ── View-only flow diagram ──────────────────────────────────────── */
function FlowDiagramView({
  wf, roles, users,
}: {
  wf: Workflow;
  roles: typeof CLIENT_ROLES;
  users: typeof CLIENT_USERS;
}) {
  return (
    <div className="relative">
      {/* Trigger */}
      <div className="flex gap-4">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-sm">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="w-0.5 bg-border flex-1 min-h-[32px]" />
        </div>
        <div className="flex-1 pb-8 pt-1.5">
          <p className="text-sm font-semibold text-foreground">Post Submitted for Approval</p>
          <p className="text-xs text-muted-foreground mt-0.5">Workflow starts automatically</p>
        </div>
      </div>

      {/* Steps */}
      {wf.steps.map((step, i) => {
        const label = step.type === "role"
          ? (roles.find((r) => r.id === step.assigneeId)?.name ?? step.assigneeId)
          : (users.find((u) => u.id === step.assigneeId)?.name ?? step.assigneeId);
        return (
          <div key={step.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-xl bg-card border-2 border-border flex items-center justify-center shrink-0 text-sm font-bold text-foreground">
                {i + 1}
              </div>
              <div className="w-0.5 bg-border flex-1 min-h-[32px]" />
            </div>
            <div className="flex-1 pb-4">
              <div className="bg-card border border-border rounded-xl px-4 py-3 flex items-center gap-2.5 shadow-sm">
                <div className={cn(
                  "flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold shrink-0",
                  step.type === "role" ? "bg-primary/10 text-primary" : "bg-info/10 text-info",
                )}>
                  {step.type === "role" ? <Users className="w-3 h-3" /> : <User className="w-3 h-3" />}
                  {step.type === "role" ? "Role" : "User"}
                </div>
                <span className="text-sm text-foreground font-medium flex-1">{label}</span>
                {step.type === "role" && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border shrink-0">
                    {(step.approval ?? "any") === "any" ? "Any One" : "All"}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Terminal */}
      <div className="flex gap-4">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-xl bg-success/10 border-2 border-success/30 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4 text-success" />
          </div>
        </div>
        <div className="flex-1 pt-1.5">
          <p className="text-sm font-semibold text-success">Approve &amp; Publish</p>
          <p className="text-xs text-muted-foreground mt-0.5">Post goes live after all approvals</p>
        </div>
      </div>
    </div>
  );
}

/* ── Editable flow diagram ───────────────────────────────────────── */
function FlowDiagramEdit({
  wf, scope, roles, users,
  onPatchStep, onAddStep, onRemoveStep,
}: {
  wf: Workflow;
  scope: WorkflowScope;
  roles: typeof CLIENT_ROLES;
  users: typeof CLIENT_USERS;
  onPatchStep: (stepId: string, changes: Partial<WfStep>) => void;
  onAddStep: () => void;
  onRemoveStep: (stepId: string) => void;
}) {
  return (
    <div className="relative">
      {/* Trigger */}
      <div className="flex gap-4">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-sm">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="w-0.5 bg-border flex-1 min-h-[32px]" />
        </div>
        <div className="flex-1 pb-8 pt-1.5">
          <p className="text-sm font-semibold text-foreground">Post Submitted for Approval</p>
          <p className="text-xs text-muted-foreground mt-0.5">Workflow starts automatically</p>
        </div>
      </div>

      {/* Steps */}
      {wf.steps.map((step, i) => (
        <div key={step.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-card border-2 border-border flex items-center justify-center shrink-0 text-sm font-bold text-foreground">
              {i + 1}
            </div>
            <div className="w-0.5 bg-border flex-1 min-h-[32px]" />
          </div>
          <div className="flex-1 pb-4">
            <div className="bg-card border border-border rounded-xl p-3.5 flex items-center gap-3 shadow-sm">

              {/* Type toggle */}
              <div className="flex rounded-lg border border-border overflow-hidden shrink-0">
                {(scope === "client" ? ["role", "user"] as const : ["role"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => onPatchStep(step.id, { type: t })}
                    className={cn(
                      "flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold transition-colors",
                      step.type === t
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted",
                    )}
                  >
                    {t === "role" ? <Users className="w-3 h-3" /> : <User className="w-3 h-3" />}
                    {t === "role" ? "Role" : "User"}
                  </button>
                ))}
              </div>

              {/* Assignee dropdown */}
              <div className="relative flex-1">
                <select
                  value={step.assigneeId}
                  onChange={(e) => onPatchStep(step.id, { assigneeId: e.target.value })}
                  className="w-full h-8 pl-2.5 pr-8 rounded-lg border border-border bg-background text-sm text-foreground outline-none focus:border-primary appearance-none cursor-pointer transition-colors"
                >
                  {(step.type === "role" ? roles : users).map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
              </div>

              {/* Any One / All — role steps only */}
              {step.type === "role" && (
                <div className="flex items-center rounded-lg border border-border overflow-hidden shrink-0">
                  {(["any", "all"] as const).map((a, idx) => (
                    <>
                      {idx === 1 && <div key="sep" className="w-px h-5 bg-border shrink-0" />}
                      <button
                        key={a}
                        type="button"
                        onClick={() => onPatchStep(step.id, { approval: a })}
                        className={cn(
                          "px-2.5 py-1.5 text-xs font-semibold transition-colors",
                          (step.approval ?? "any") === a
                            ? "bg-primary text-primary-foreground"
                            : "bg-background text-muted-foreground hover:text-foreground hover:bg-muted",
                        )}
                      >
                        {a === "any" ? "Any One" : "All"}
                      </button>
                    </>
                  ))}
                </div>
              )}

              {/* Remove step */}
              {wf.steps.length > 1 && (
                <button
                  onClick={() => onRemoveStep(step.id)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-error hover:bg-error/10 transition-colors shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Add step */}
      <div className="flex gap-4">
        <div className="flex flex-col items-center">
          <button
            onClick={onAddStep}
            className="w-10 h-10 rounded-xl border-2 border-dashed border-border flex items-center justify-center shrink-0 hover:border-primary hover:bg-primary/5 transition-colors group"
          >
            <Plus className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
          <div className="w-0.5 bg-border flex-1 min-h-[32px]" />
        </div>
        <div className="flex-1 pb-8 flex items-center">
          <button onClick={onAddStep} className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors">
            Add approval step
          </button>
        </div>
      </div>

      {/* Terminal */}
      <div className="flex gap-4">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-xl bg-success/10 border-2 border-success/30 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4 text-success" />
          </div>
        </div>
        <div className="flex-1 pt-1.5">
          <p className="text-sm font-semibold text-success">Approve &amp; Publish</p>
          <p className="text-xs text-muted-foreground mt-0.5">Post goes live after all approvals</p>
        </div>
      </div>
    </div>
  );
}

/* ── Agency propagation modal ────────────────────────────────────── */
function PropagationModal({
  onOverrideAll,
  onDefaultOnly,
  onClose,
}: {
  onOverrideAll: () => void;
  onDefaultOnly: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Dialog */}
      <div className="relative bg-card border border-border rounded-2xl shadow-lg w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="flex items-start gap-3 px-5 pt-5 pb-4">
          <div className="w-9 h-9 rounded-xl bg-warning/10 flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle className="w-4.5 h-4.5 text-warning" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">Apply Workflow Changes</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Choose how you want to propagate this updated workflow to your clients.
            </p>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 pb-5 space-y-3">
          {/* Option 1 — override all */}
          <button
            onClick={onOverrideAll}
            className="w-full text-left flex items-start gap-3.5 p-4 rounded-xl border-2 border-border hover:border-primary/50 hover:bg-primary/5 transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary/20 transition-colors">
              <Globe className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Apply to all clients</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Override every client's workflow — including those who have set a custom one — with this updated default.
              </p>
            </div>
          </button>

          {/* Option 2 — default-only */}
          <button
            onClick={onDefaultOnly}
            className="w-full text-left flex items-start gap-3.5 p-4 rounded-xl border-2 border-border hover:border-primary/50 hover:bg-primary/5 transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary/10 transition-colors">
              <Building2 className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Update agency default only</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Only update clients still following the agency default. Clients with a custom workflow will not be affected.
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main export ─────────────────────────────────────────────────── */
export function WorkflowSettings({ scope, standalone = false }: { scope: WorkflowScope; standalone?: boolean }) {
  const roles = CLIENT_ROLES;
  const users = CLIENT_USERS;

  const [agencyWorkflows, setAgencyWorkflows] = useState<Workflow[]>(DEFAULT_WORKFLOWS);
  const [clientWorkflows, setClientWorkflows] = useState<Workflow[] | null>(null);
  const [expandedId,    setExpandedId]    = useState<string | null>("wf-default");
  const [editingIds,    setEditingIds]    = useState<Set<string>>(new Set());
  const [editingNameId, setEditingNameId] = useState<string | null>(null);
  const [draftName,     setDraftName]     = useState("");
  const [savedIds,      setSavedIds]      = useState<Set<string>>(new Set());
  const [showPropModal, setShowPropModal] = useState(false);
  const [pendingSaveId, setPendingSaveId] = useState<string | null>(null);

  const isOverridden = !standalone && scope === "client" && clientWorkflows !== null;
  const workflows    = isOverridden ? clientWorkflows! : agencyWorkflows;

  function setWorkflows(updater: (prev: Workflow[]) => Workflow[]) {
    if (!standalone && scope === "client") {
      setClientWorkflows((prev) => updater(prev ?? agencyWorkflows));
    } else {
      setAgencyWorkflows(updater);
    }
  }

  function resetToDefault() { setClientWorkflows(null); setExpandedId("wf-default"); setEditingIds(new Set()); }

  function addWorkflow() {
    if (workflows.length >= MAX_WORKFLOWS) return;
    const id = wfUid();
    setWorkflows((prev) => [...prev, { id, name: "New Workflow", isActive: false, steps: [{ id: uid(), type: "role", assigneeId: roles[0].id, approval: "any" }] }]);
    setExpandedId(id);
    setEditingNameId(id);
    setDraftName("New Workflow");
    setEditingIds((prev) => new Set(prev).add(id));
  }

  function removeWorkflow(id: string) {
    setWorkflows((prev) => prev.filter((wf) => wf.id !== id));
    if (expandedId === id) setExpandedId(null);
    setEditingIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
  }

  function activateWorkflow(id: string) {
    setWorkflows((prev) => prev.map((wf) => ({ ...wf, isActive: wf.id === id ? !wf.isActive : false })));
  }

  function patchWorkflow(id: string, changes: Partial<Workflow>) {
    setWorkflows((prev) => prev.map((wf) => (wf.id === id ? { ...wf, ...changes } : wf)));
  }

  function commitName(id: string) {
    const trimmed = draftName.trim();
    if (trimmed) patchWorkflow(id, { name: trimmed });
    setEditingNameId(null);
  }

  function patchStep(wfId: string, stepId: string, changes: Partial<WfStep>) {
    setWorkflows((prev) =>
      prev.map((wf) => {
        if (wf.id !== wfId) return wf;
        return {
          ...wf,
          steps: wf.steps.map((s) => {
            if (s.id !== stepId) return s;
            const merged = { ...s, ...changes };
            if (changes.type && changes.type !== s.type) {
              merged.assigneeId = changes.type === "role" ? roles[0].id : users[0].id;
            }
            return merged;
          }),
        };
      }),
    );
  }

  function addStep(wfId: string) {
    setWorkflows((prev) =>
      prev.map((wf) => wf.id !== wfId ? wf : { ...wf, steps: [...wf.steps, { id: uid(), type: "role", assigneeId: roles[0].id, approval: "any" }] }),
    );
  }

  function removeStep(wfId: string, stepId: string) {
    setWorkflows((prev) =>
      prev.map((wf) => wf.id !== wfId ? wf : { ...wf, steps: wf.steps.filter((s) => s.id !== stepId) }),
    );
  }

  function enterEdit(id: string) {
    setEditingIds((prev) => new Set(prev).add(id));
    setExpandedId(id);
  }

  function saveWorkflow(id: string) {
    if (scope === "agency") {
      // For agency, show propagation choice before committing
      setPendingSaveId(id);
      setShowPropModal(true);
      return;
    }
    commitSave(id);
  }

  function commitSave(id: string) {
    setEditingIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
    setSavedIds((prev) => new Set(prev).add(id));
    setTimeout(() => setSavedIds((prev) => { const n = new Set(prev); n.delete(id); return n; }), 2000);
  }

  function handlePropagateAll() {
    if (pendingSaveId) commitSave(pendingSaveId);
    setShowPropModal(false);
    setPendingSaveId(null);
    // In a real app: push updated workflow to ALL clients
  }

  function handlePropagateDefault() {
    if (pendingSaveId) commitSave(pendingSaveId);
    setShowPropModal(false);
    setPendingSaveId(null);
    // In a real app: push only to clients where isOverridden === false
  }

  const atLimit = workflows.length >= MAX_WORKFLOWS;

  /* ── Shared workflow card renderer ─────────────────────────────── */
  function WorkflowCard({ wf }: { wf: Workflow }) {
    const isExpanded    = expandedId === wf.id;
    const isEditingName = editingNameId === wf.id;
    const isEditing     = editingIds.has(wf.id);

    return (
      <div
        className={cn(
          "rounded-xl border transition-colors",
          wf.isActive ? "border-success/40 bg-success/5" : "border-border bg-card",
        )}
      >
        {/* Header row */}
        <div
          className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none"
          onClick={() => setExpandedId(isExpanded ? null : wf.id)}
        >
          <Toggle on={wf.isActive} onChange={() => activateWorkflow(wf.id)} />

          {/* Name */}
          <div className="flex-1 min-w-0" onClick={(e) => e.stopPropagation()}>
            {isEditingName ? (
              <input
                autoFocus
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                onBlur={() => commitName(wf.id)}
                onKeyDown={(e) => { if (e.key === "Enter") commitName(wf.id); if (e.key === "Escape") setEditingNameId(null); }}
                className="text-sm font-semibold bg-background border border-primary rounded-lg px-2 py-0.5 outline-none w-full max-w-[200px]"
              />
            ) : (
              <div className="flex items-center gap-1.5 group/name">
                <span className="text-sm font-semibold text-foreground truncate">{wf.name}</span>
                {isEditing && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditingNameId(wf.id); setDraftName(wf.name); }}
                    className="opacity-0 group-hover/name:opacity-100 transition-opacity p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}
          </div>

          {wf.isActive && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-success/15 text-success border border-success/30 shrink-0">
              Active
            </span>
          )}

          {/* Edit button (view mode only) */}
          {!isEditing && isExpanded && (
            <button
              onClick={(e) => { e.stopPropagation(); enterEdit(wf.id); }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
            >
              <Pencil className="w-3 h-3" /> Edit
            </button>
          )}

          {workflows.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); removeWorkflow(wf.id); }}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-error hover:bg-error/10 transition-colors shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          {isExpanded
            ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
            : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
          }
        </div>

        {/* Expanded body */}
        {isExpanded && (
          <div className="px-4 pb-4 pt-1 border-t border-border">
            <div className="mt-4">
              {isEditing ? (
                <FlowDiagramEdit
                  wf={wf}
                  scope={scope}
                  roles={roles}
                  users={users}
                  onPatchStep={(stepId, changes) => patchStep(wf.id, stepId, changes)}
                  onAddStep={() => addStep(wf.id)}
                  onRemoveStep={(stepId) => removeStep(wf.id, stepId)}
                />
              ) : (
                <FlowDiagramView wf={wf} roles={roles} users={users} />
              )}
            </div>

            {isEditing && (
              <div className="flex justify-end pt-3 border-t border-border mt-2">
                <button
                  onClick={() => saveWorkflow(wf.id)}
                  className={cn(
                    "flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-200",
                    savedIds.has(wf.id)
                      ? "bg-success/15 text-success border border-success/30"
                      : "gradient-coral text-primary-foreground shadow-sm hover:opacity-90",
                  )}
                >
                  {savedIds.has(wf.id)
                    ? <><Check className="w-3.5 h-3.5" /> Saved</>
                    : <><Save className="w-3.5 h-3.5" /> Save Workflow</>
                  }
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  /* ════════════════════════════════════════════════════════════════
     AGENCY VIEW — single fixed default workflow, edit-only
  ═══════════════════════════════════════════════════════════════ */
  if (scope === "agency") {
    const wf = agencyWorkflows[0];
    const isEditing = editingIds.has(wf.id);
    return (
      <>
      {showPropModal && (
        <PropagationModal
          onOverrideAll={handlePropagateAll}
          onDefaultOnly={handlePropagateDefault}
          onClose={() => { setShowPropModal(false); setPendingSaveId(null); }}
        />
      )}
      <div className="p-6 space-y-5">
        <div>
          <p className="text-base font-semibold text-foreground">Default Approval Workflow</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            This workflow applies to all clients by default. Clients may override it for their account.
          </p>
        </div>

        <div className={cn("rounded-xl border transition-colors", wf.isActive ? "border-success/40 bg-success/5" : "border-border bg-card")}>
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3">
            <Toggle on={wf.isActive} onChange={() => activateWorkflow(wf.id)} />
            <span className="text-sm font-semibold text-foreground flex-1">{wf.name}</span>
            {wf.isActive && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-success/15 text-success border border-success/30 shrink-0">
                Active
              </span>
            )}
            {!isEditing && (
              <button
                onClick={() => enterEdit(wf.id)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
              >
                <Pencil className="w-3 h-3" /> Edit
              </button>
            )}
          </div>

          {/* Body */}
          <div className="px-4 pb-4 pt-1 border-t border-border">
            <div className="mt-4">
              {isEditing ? (
                <FlowDiagramEdit
                  wf={wf}
                  scope="agency"
                  roles={roles}
                  users={users}
                  onPatchStep={(stepId, changes) => patchStep(wf.id, stepId, changes)}
                  onAddStep={() => addStep(wf.id)}
                  onRemoveStep={(stepId) => removeStep(wf.id, stepId)}
                />
              ) : (
                <FlowDiagramView wf={wf} roles={roles} users={users} />
              )}
            </div>
            {isEditing && (
              <div className="flex justify-end pt-3 border-t border-border mt-2">
                <button
                  onClick={() => saveWorkflow(wf.id)}
                  className={cn(
                    "flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-200",
                    savedIds.has(wf.id)
                      ? "bg-success/15 text-success border border-success/30"
                      : "gradient-coral text-primary-foreground shadow-sm hover:opacity-90",
                  )}
                >
                  {savedIds.has(wf.id) ? <><Check className="w-3.5 h-3.5" /> Saved</> : <><Save className="w-3.5 h-3.5" /> Save Workflow</>}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-muted/50 border border-border">
          <CheckCircle2 className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            This workflow is used as the default for all clients. Clients can override it individually from their settings.
          </p>
        </div>
      </div>
      </>
    );
  }

  /* ════════════════════════════════════════════════════════════════
     CLIENT / BUSINESS VIEW — multiple workflows, max 3
  ═══════════════════════════════════════════════════════════════ */
  return (
    <div className="p-6 space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-base font-semibold text-foreground">Approval Workflows</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Create multiple workflows — only one can be active at a time. Up to {MAX_WORKFLOWS} allowed.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {isOverridden && (
            <button
              onClick={resetToDefault}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reset to Default
            </button>
          )}
          <button
            onClick={addWorkflow}
            disabled={atLimit}
            className={cn(
              "flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-opacity",
              atLimit
                ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                : "gradient-coral text-primary-foreground shadow-sm hover:opacity-90",
            )}
          >
            <Plus className="w-3.5 h-3.5" />
            {atLimit ? `Max ${MAX_WORKFLOWS} reached` : "Add Workflow"}
          </button>
        </div>
      </div>

      {/* Override badge (client non-standalone) */}
      {!standalone && (
        <div className="flex items-center gap-2">
          <GitBranch className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Workflows</span>
          {isOverridden
            ? <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-warning/10 text-warning border border-warning/20">Customized</span>
            : <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">Agency Default</span>
          }
        </div>
      )}

      {/* Workflow list */}
      <div className="space-y-3">
        {workflows.map((wf) => <WorkflowCard key={wf.id} wf={wf} />)}
      </div>

      {/* Info note */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-muted/50 border border-border">
        <CheckCircle2 className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          {standalone
            ? "Only one workflow can be active at a time. The active workflow applies to all content submitted for approval."
            : isOverridden
              ? "This is a client-level customization. Agency defaults are unchanged. Use Reset to revert."
              : "Using agency-defined workflows. Any change here creates a client-specific override."
          }
        </p>
      </div>
    </div>
  );
}
