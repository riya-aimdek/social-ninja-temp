import { useState } from "react";
import {
  Plus, Trash2, ArrowDown, ChevronLeft, Pencil,
  GitBranch, Zap, CheckCircle2, X, User, Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/* ── Types ──────────────────────────────────────────────────────── */
export type WorkflowScope = "client" | "agency";

type NonTerminalAction =
  | "pass_to_user" | "pass_to_role"
  | "notify_user"  | "notify_role"
  | "revision_user" | "revision_role";

type TerminalAction =
  | "approve_publish" | "approve_schedule"
  | "request_changes" | "reject";

type StepAction = NonTerminalAction | TerminalAction;

interface WfStep {
  id: string;
  action: StepAction;
  assigneeId: string;
}

interface Workflow {
  id: string;
  name: string;
  trigger: string;
  steps: WfStep[];
  isActive: boolean;
}

/* ── Static data ────────────────────────────────────────────────── */
const CLIENT_TRIGGERS = [
  { id: "post_submitted",    label: "Post Submitted for Approval" },
  { id: "draft_created",     label: "Content Draft Created"       },
  { id: "post_rejected",     label: "Post Rejected by Approver"   },
  { id: "post_published",    label: "Post Published"              },
  { id: "comment_escalated", label: "Comment Escalated"           },
];

const AGENCY_TRIGGERS = [
  { id: "post_submitted_any",   label: "Post Submitted (Any Client)"   },
  { id: "client_onboarded",     label: "New Client Onboarded"          },
  { id: "account_disconnected", label: "Social Account Disconnected"   },
  { id: "report_generated",     label: "Monthly Report Generated"      },
];

const NON_TERMINAL: { id: NonTerminalAction; label: string; needsUser: boolean }[] = [
  { id: "pass_to_user",   label: "Pass to User",               needsUser: true  },
  { id: "pass_to_role",   label: "Pass to Role",               needsUser: false },
  { id: "notify_user",    label: "Notify User",                needsUser: true  },
  { id: "notify_role",    label: "Notify Role",                needsUser: false },
  { id: "revision_user",  label: "Request Revision from User", needsUser: true  },
  { id: "revision_role",  label: "Request Revision from Role", needsUser: false },
];

const TERMINAL: { id: TerminalAction; label: string; color: string }[] = [
  { id: "approve_publish",  label: "Approve & Publish",  color: "text-success"  },
  { id: "approve_schedule", label: "Approve & Schedule", color: "text-info"     },
  { id: "request_changes",  label: "Request Changes",    color: "text-warning"  },
  { id: "reject",           label: "Reject Post",        color: "text-error"    },
];

const CLIENT_ROLES = [
  { id: "business-admin",       name: "Client Admin"         },
  { id: "social-media-manager", name: "Social Media Manager" },
  { id: "content-creator",      name: "Content Creator"      },
  { id: "approver",             name: "Approver"             },
  { id: "orm",                  name: "ORM Specialist"       },
  { id: "client-reviewer",      name: "Client Reviewer"      },
];

const AGENCY_ROLES = [
  { id: "agency-admin",           name: "Agency Admin"    },
  { id: "agency-account-manager", name: "Account Manager" },
];

const CLIENT_USERS = [
  { id: "u1", name: "John Smith",  role: "Client Admin"   },
  { id: "u2", name: "Emily Davis", role: "Content Creator" },
  { id: "u3", name: "Mike Wilson", role: "Approver"       },
  { id: "u5", name: "Sarah Park",  role: "Content Creator" },
  { id: "u6", name: "David Lee",   role: "SMM"            },
];

const AGENCY_USERS = [
  { id: "a1", name: "Alex Morgan", role: "Agency Admin"    },
  { id: "a2", name: "Sam Patel",   role: "Account Manager" },
  { id: "a3", name: "Jordan Kim",  role: "Account Manager" },
];

/* ── Mock initial data ──────────────────────────────────────────── */
const CLIENT_DEFAULTS: Workflow[] = [
  {
    id: "wf1",
    name: "Content Approval Flow",
    trigger: "post_submitted",
    steps: [
      { id: "s1", action: "pass_to_role",  assigneeId: "approver" },
      { id: "s2", action: "approve_publish", assigneeId: "" },
    ],
    isActive: true,
  },
  {
    id: "wf2",
    name: "Draft Review Process",
    trigger: "draft_created",
    steps: [
      { id: "s1", action: "pass_to_user",  assigneeId: "u3"                    },
      { id: "s2", action: "notify_role",   assigneeId: "social-media-manager"  },
      { id: "s3", action: "approve_schedule", assigneeId: "" },
    ],
    isActive: false,
  },
];

const AGENCY_DEFAULTS: Workflow[] = [
  {
    id: "wf1",
    name: "Agency Content Review",
    trigger: "post_submitted_any",
    steps: [
      { id: "s1", action: "pass_to_role", assigneeId: "agency-account-manager" },
      { id: "s2", action: "pass_to_role", assigneeId: "agency-admin"           },
      { id: "s3", action: "approve_schedule", assigneeId: "" },
    ],
    isActive: true,
  },
];

/* ── Helpers ────────────────────────────────────────────────────── */
const isTerminalAction = (a: StepAction) => TERMINAL.some((t) => t.id === a);
const needsUser = (a: StepAction) => ["pass_to_user", "notify_user", "revision_user"].includes(a);
const needsRole = (a: StepAction) => ["pass_to_role", "notify_role", "revision_role"].includes(a);
const uid = () => `s${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

function triggerLabel(id: string, scope: WorkflowScope) {
  const list = scope === "client" ? CLIENT_TRIGGERS : AGENCY_TRIGGERS;
  return list.find((t) => t.id === id)?.label ?? id;
}

function terminalMeta(action: StepAction) {
  return TERMINAL.find((t) => t.id === action) ?? TERMINAL[0];
}

/* ── Select atom ────────────────────────────────────────────────── */
function Sel({
  value, onChange, children, className,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "h-10 px-3 pr-8 rounded-xl border border-border bg-background text-sm text-foreground",
        "outline-none focus:border-primary transition-all appearance-none cursor-pointer",
        className,
      )}
    >
      {children}
    </select>
  );
}

/* ── Step row ───────────────────────────────────────────────────── */
function StepRow({
  step, stepNum, isLast, canRemove, scope, onChange, onRemove,
}: {
  step: WfStep;
  stepNum: number;
  isLast: boolean;
  canRemove: boolean;
  scope: WorkflowScope;
  onChange: (patch: Partial<WfStep>) => void;
  onRemove: () => void;
}) {
  const roles  = scope === "client" ? CLIENT_ROLES : AGENCY_ROLES;
  const users  = scope === "client" ? CLIENT_USERS : AGENCY_USERS;
  const isT    = isTerminalAction(step.action);
  const meta   = isT ? terminalMeta(step.action) : null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Action selector */}
      {isT ? (
        <div className={cn(
          "flex items-center gap-2 h-10 px-4 rounded-xl border font-semibold text-sm",
          step.action === "approve_publish"  && "border-success/40 bg-success/10 text-success",
          step.action === "approve_schedule" && "border-info/40 bg-info/10 text-info",
          step.action === "request_changes"  && "border-warning/40 bg-warning/10 text-warning",
          step.action === "reject"           && "border-error/40 bg-error/10 text-error",
        )}>
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <select
            value={step.action}
            onChange={(e) => onChange({ action: e.target.value as StepAction, assigneeId: "" })}
            className="bg-transparent border-none outline-none text-sm font-semibold cursor-pointer"
          >
            {TERMINAL.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </div>
      ) : (
        <Sel
          value={step.action}
          onChange={(v) => onChange({ action: v as StepAction, assigneeId: "" })}
          className="min-w-[190px]"
        >
          <optgroup label="Assign">
            {NON_TERMINAL.filter((a) => !["notify_user","notify_role"].includes(a.id)).map((a) => (
              <option key={a.id} value={a.id}>{a.label}</option>
            ))}
          </optgroup>
          <optgroup label="Notify">
            {NON_TERMINAL.filter((a) => ["notify_user","notify_role"].includes(a.id)).map((a) => (
              <option key={a.id} value={a.id}>{a.label}</option>
            ))}
          </optgroup>
        </Sel>
      )}

      {/* Assignee picker */}
      {needsUser(step.action) && (
        <>
          <span className="text-muted-foreground shrink-0"><User className="w-4 h-4" /></span>
          <Sel value={step.assigneeId} onChange={(v) => onChange({ assigneeId: v })} className="min-w-[170px]">
            <option value="">Select user…</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.name} · {u.role}</option>
            ))}
          </Sel>
        </>
      )}

      {needsRole(step.action) && (
        <>
          <span className="text-muted-foreground shrink-0"><Users className="w-4 h-4" /></span>
          <Sel value={step.assigneeId} onChange={(v) => onChange({ assigneeId: v })} className="min-w-[170px]">
            <option value="">Select role…</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </Sel>
        </>
      )}

      {/* Remove button (not on terminal if only 2 steps total) */}
      {canRemove && (
        <button
          onClick={onRemove}
          className="ml-auto h-7 w-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-error hover:bg-error/10 transition-colors shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

/* ── Workflow editor ─────────────────────────────────────────────── */
function WorkflowEditor({
  initial, scope, onSave, onDelete, onCancel,
}: {
  initial: Workflow;
  scope: WorkflowScope;
  onSave: (w: Workflow) => void;
  onDelete: () => void;
  onCancel: () => void;
}) {
  const [name, setName]       = useState(initial.name);
  const [trigger, setTrigger] = useState(initial.trigger);
  const [steps, setSteps]     = useState<WfStep[]>(initial.steps);
  const [isActive, setActive] = useState(initial.isActive);

  const triggers = scope === "client" ? CLIENT_TRIGGERS : AGENCY_TRIGGERS;

  const updateStep = (id: string, patch: Partial<WfStep>) =>
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const removeStep = (id: string) =>
    setSteps((prev) => prev.filter((s) => s.id !== id));

  const addStep = () => {
    const newStep: WfStep = { id: uid(), action: "pass_to_role", assigneeId: "" };
    setSteps((prev) => {
      const last = prev[prev.length - 1];
      return [...prev.slice(0, -1), newStep, last];
    });
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ ...initial, name: name.trim(), trigger, steps, isActive });
  };

  const isNew = initial.id === "__new__";

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onCancel} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <h3 className="text-base font-semibold text-foreground">
          {isNew ? "New Workflow" : "Edit Workflow"}
        </h3>
      </div>

      {/* Name + active */}
      <div className="card-surface space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="text-sm text-muted-foreground mb-1.5 block">Workflow Name</label>
            <input
              className="input-dark"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Content Approval Flow"
            />
          </div>
          <div className="pt-6">
            <button
              onClick={() => setActive((v) => !v)}
              className={cn(
                "flex items-center gap-2 h-10 px-3 rounded-xl border text-sm font-medium transition-colors",
                isActive
                  ? "border-success/40 bg-success/10 text-success"
                  : "border-border bg-muted text-muted-foreground",
              )}
            >
              <span className={cn("w-2 h-2 rounded-full", isActive ? "bg-success" : "bg-muted-foreground")} />
              {isActive ? "Active" : "Inactive"}
            </button>
          </div>
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">Trigger</label>
          <Sel value={trigger} onChange={setTrigger} className="w-full">
            {triggers.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </Sel>
        </div>
      </div>

      {/* Visual step chain */}
      <div className="card-surface space-y-0">
        <p className="text-sm font-semibold text-foreground mb-5">Workflow Steps</p>

        {/* Trigger box (Step 1) */}
        <div className="flex items-start gap-4">
          <div className="flex flex-col items-center shrink-0 pt-3">
            <span className="text-[11px] font-semibold text-primary uppercase tracking-wide">Step 1</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-center h-11 rounded-xl bg-primary text-primary-foreground font-semibold text-sm px-5 shadow-sm">
              <Zap className="w-4 h-4 mr-2 shrink-0" />
              {triggerLabel(trigger, scope)}
            </div>
          </div>
        </div>

        {/* Dynamic steps */}
        {steps.map((step, idx) => {
          const isT      = isTerminalAction(step.action);
          const isLast   = idx === steps.length - 1;
          const stepNum  = idx + 2;
          // can remove non-terminal steps (not if only 1 non-terminal exists, keep at least 1 + terminal)
          const canRemove = !isT && steps.filter((s) => !isTerminalAction(s.action)).length > 1
                            || (!isT && steps.length > 2);

          return (
            <div key={step.id}>
              {/* Arrow connector */}
              <div className="flex justify-start pl-[52px] py-2">
                <ArrowDown className="w-4 h-4 text-muted-foreground/50" />
              </div>

              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center shrink-0 pt-2.5">
                  <span className={cn(
                    "text-[11px] font-semibold uppercase tracking-wide",
                    isT ? "text-muted-foreground" : "text-primary",
                  )}>
                    Step {stepNum}
                  </span>
                </div>
                <div className="flex-1">
                  <StepRow
                    step={step}
                    stepNum={stepNum}
                    isLast={isLast}
                    canRemove={canRemove}
                    scope={scope}
                    onChange={(patch) => updateStep(step.id, patch)}
                    onRemove={() => removeStep(step.id)}
                  />
                </div>
              </div>
            </div>
          );
        })}

        {/* Add step */}
        <div className="flex justify-start pl-[52px] py-2">
          <ArrowDown className="w-4 h-4 text-muted-foreground/30" />
        </div>
        <div className="pl-[52px]">
          <button
            onClick={addStep}
            className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors px-3 py-1.5 rounded-lg border border-dashed border-primary/40 hover:border-primary/70 hover:bg-primary/5"
          >
            <Plus className="w-3.5 h-3.5" /> Add Step
          </button>
        </div>
      </div>

      {/* Footer buttons */}
      <div className="flex items-center justify-between">
        {!isNew ? (
          <button
            onClick={onDelete}
            className="flex items-center gap-1.5 text-sm text-error hover:text-error/80 font-medium transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Delete Workflow
          </button>
        ) : <span />}
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={handleSave}>Save Workflow</Button>
        </div>
      </div>
    </div>
  );
}

/* ── Workflow list card ──────────────────────────────────────────── */
function WorkflowCard({
  wf, scope, onEdit, onToggle,
}: {
  wf: Workflow;
  scope: WorkflowScope;
  onEdit: () => void;
  onToggle: () => void;
}) {
  const nonTermSteps = wf.steps.filter((s) => !isTerminalAction(s.action));
  const termStep     = wf.steps.find((s) => isTerminalAction(s.action));
  const meta         = termStep ? terminalMeta(termStep.action) : null;

  return (
    <div className={cn(
      "rounded-2xl border p-4 transition-all",
      wf.isActive ? "border-border bg-card" : "border-border/50 bg-muted/30",
    )}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className={cn(
            "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
            wf.isActive ? "bg-primary/10" : "bg-muted",
          )}>
            <GitBranch className={cn("w-4 h-4", wf.isActive ? "text-primary" : "text-muted-foreground")} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <p className="text-sm font-semibold text-foreground">{wf.name}</p>
              <span className={cn(
                "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                wf.isActive
                  ? "bg-success/10 text-success"
                  : "bg-muted text-muted-foreground",
              )}>
                {wf.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Trigger: <span className="text-foreground font-medium">{triggerLabel(wf.trigger, scope)}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onToggle}
            className={cn(
              "text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-colors",
              wf.isActive
                ? "border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                : "border-primary/30 text-primary hover:bg-primary/5",
            )}
          >
            {wf.isActive ? "Disable" : "Enable"}
          </button>
          <button
            onClick={onEdit}
            className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Step summary */}
      <div className="mt-3 flex items-center gap-1.5 flex-wrap pl-12">
        <span className="text-[10px] text-muted-foreground font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-md">Trigger</span>
        {nonTermSteps.map((s, i) => {
          const nt = NON_TERMINAL.find((n) => n.id === s.action);
          return (
            <span key={s.id} className="flex items-center gap-1">
              <span className="text-muted-foreground text-[10px]">→</span>
              <span className="text-[10px] bg-muted text-foreground px-2 py-0.5 rounded-md">{nt?.label ?? s.action}</span>
            </span>
          );
        })}
        {meta && (
          <span className="flex items-center gap-1">
            <span className="text-muted-foreground text-[10px]">→</span>
            <span className={cn("text-[10px] px-2 py-0.5 rounded-md font-semibold bg-muted", meta.color)}>{meta.label}</span>
          </span>
        )}
      </div>
    </div>
  );
}

/* ── Main export ─────────────────────────────────────────────────── */
export function WorkflowSettings({ scope }: { scope: WorkflowScope }) {
  const [workflows, setWorkflows] = useState<Workflow[]>(
    scope === "client" ? CLIENT_DEFAULTS : AGENCY_DEFAULTS,
  );
  const [editingId, setEditingId] = useState<string | null>(null);

  const editing = editingId === "__new__"
    ? {
        id: "__new__",
        name: "",
        trigger: scope === "client" ? "post_submitted" : "post_submitted_any",
        steps: [
          { id: uid(), action: "pass_to_role" as StepAction, assigneeId: "" },
          { id: uid(), action: "approve_publish" as StepAction, assigneeId: "" },
        ],
        isActive: true,
      }
    : workflows.find((w) => w.id === editingId) ?? null;

  const handleSave = (updated: Workflow) => {
    if (updated.id === "__new__") {
      setWorkflows((prev) => [...prev, { ...updated, id: `wf${Date.now()}` }]);
    } else {
      setWorkflows((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
    }
    setEditingId(null);
  };

  const handleDelete = () => {
    setWorkflows((prev) => prev.filter((w) => w.id !== editingId));
    setEditingId(null);
  };

  const handleToggle = (id: string) =>
    setWorkflows((prev) => prev.map((w) => (w.id === id ? { ...w, isActive: !w.isActive } : w)));

  /* Editor view */
  if (editing) {
    return (
      <WorkflowEditor
        initial={editing}
        scope={scope}
        onSave={handleSave}
        onDelete={handleDelete}
        onCancel={() => setEditingId(null)}
      />
    );
  }

  /* List view */
  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">Approval Workflows</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Define how content moves through review and approval before publishing.
          </p>
        </div>
        <Button size="sm" onClick={() => setEditingId("__new__")} className="gap-1.5">
          <Plus className="w-3.5 h-3.5" /> New Workflow
        </Button>
      </div>

      {workflows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <GitBranch className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground mb-1">No workflows yet</p>
          <p className="text-xs text-muted-foreground mb-4">Create your first approval workflow to get started.</p>
          <Button size="sm" onClick={() => setEditingId("__new__")} className="gap-1.5">
            <Plus className="w-3.5 h-3.5" /> New Workflow
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {workflows.map((wf) => (
            <WorkflowCard
              key={wf.id}
              wf={wf}
              scope={scope}
              onEdit={() => setEditingId(wf.id)}
              onToggle={() => handleToggle(wf.id)}
            />
          ))}
        </div>
      )}

      <div className="flex items-start gap-2 p-3 rounded-xl bg-muted/50 border border-border">
        <CheckCircle2 className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          Workflow changes only affect new submissions. Posts already in review follow their original workflow.
        </p>
      </div>
    </div>
  );
}
