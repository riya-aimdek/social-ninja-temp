import { useState } from "react";
import {
  Plus, Trash2, ArrowDown, ChevronLeft, Pencil,
  GitBranch, Zap, CheckCircle2, X, User, Users,
  Building2, RotateCcw, Lock, AlertCircle, Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/* ── Types ──────────────────────────────────────────────────────── */
export type WorkflowScope = "client" | "agency";

/** Where this workflow originates */
type WorkflowSource =
  | "agency"           // defined at agency level (default for all clients)
  | "client-override"  // client customized an agency workflow
  | "client-only";     // client created, no agency counterpart

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
  source: WorkflowSource;
  overridesId?: string; // for client-override: the agency workflow id this replaces
  overrideCount?: number; // for agency: how many clients have customized this
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
  { id: "post_submitted_any",   label: "Post Submitted (Any Client)"  },
  { id: "client_onboarded",     label: "New Client Onboarded"         },
  { id: "account_disconnected", label: "Social Account Disconnected"  },
  { id: "report_generated",     label: "Monthly Report Generated"     },
];

const NON_TERMINAL: { id: NonTerminalAction; label: string; needsUser: boolean }[] = [
  { id: "pass_to_user",  label: "Pass to User",               needsUser: true  },
  { id: "pass_to_role",  label: "Pass to Role",               needsUser: false },
  { id: "notify_user",   label: "Notify User",                needsUser: true  },
  { id: "notify_role",   label: "Notify Role",                needsUser: false },
  { id: "revision_user", label: "Request Revision from User", needsUser: true  },
  { id: "revision_role", label: "Request Revision from Role", needsUser: false },
];

const TERMINAL: { id: TerminalAction; label: string; color: string; bg: string; border: string }[] = [
  { id: "approve_publish",  label: "Approve & Publish",  color: "text-success", bg: "bg-success/10", border: "border-success/40"  },
  { id: "approve_schedule", label: "Approve & Schedule", color: "text-info",    bg: "bg-info/10",    border: "border-info/40"     },
  { id: "request_changes",  label: "Request Changes",    color: "text-warning", bg: "bg-warning/10", border: "border-warning/40"  },
  { id: "reject",           label: "Reject Post",        color: "text-error",   bg: "bg-error/10",   border: "border-error/40"    },
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
  { id: "u1", name: "John Smith",  role: "Client Admin"    },
  { id: "u2", name: "Emily Davis", role: "Content Creator" },
  { id: "u3", name: "Mike Wilson", role: "Approver"        },
  { id: "u5", name: "Sarah Park",  role: "Content Creator" },
  { id: "u6", name: "David Lee",   role: "SMM"             },
];

const AGENCY_USERS = [
  { id: "a1", name: "Alex Morgan", role: "Agency Admin"    },
  { id: "a2", name: "Sam Patel",   role: "Account Manager" },
  { id: "a3", name: "Jordan Kim",  role: "Account Manager" },
];

/* ── Simulated agency-level defaults (shared source of truth) ───── */
const AGENCY_WORKFLOWS: Workflow[] = [
  {
    id: "ag-wf1",
    name: "Content Approval Flow",
    trigger: "post_submitted",
    steps: [
      { id: "s1", action: "pass_to_role", assigneeId: "approver"             },
      { id: "s2", action: "notify_role",  assigneeId: "social-media-manager" },
      { id: "s3", action: "approve_publish", assigneeId: ""                  },
    ],
    isActive: true,
    source: "agency",
    overrideCount: 1, // 1 client has customized this (mock)
  },
  {
    id: "ag-wf2",
    name: "Draft Review Process",
    trigger: "draft_created",
    steps: [
      { id: "s1", action: "pass_to_role",     assigneeId: "content-creator"      },
      { id: "s2", action: "revision_role",    assigneeId: "social-media-manager" },
      { id: "s3", action: "approve_schedule", assigneeId: ""                     },
    ],
    isActive: true,
    source: "agency",
    overrideCount: 0,
  },
];

/* ── Initial client state: inherits agency WFs + one client-only ── */
const CLIENT_INITIAL: Workflow[] = [
  // ag-wf1 is overridden by this client
  {
    id: "cl-ov1",
    name: "Content Approval Flow",
    trigger: "post_submitted",
    steps: [
      { id: "s1", action: "pass_to_user",     assigneeId: "u3" },
      { id: "s2", action: "notify_role",      assigneeId: "social-media-manager" },
      { id: "s3", action: "approve_publish",  assigneeId: "" },
    ],
    isActive: true,
    source: "client-override",
    overridesId: "ag-wf1",
  },
  // Client-only workflow (no agency counterpart)
  {
    id: "cl-wf1",
    name: "Comment Escalation Flow",
    trigger: "comment_escalated",
    steps: [
      { id: "s1", action: "pass_to_role",    assigneeId: "orm"          },
      { id: "s2", action: "notify_user",     assigneeId: "u1"           },
      { id: "s3", action: "approve_publish", assigneeId: ""             },
    ],
    isActive: false,
    source: "client-only",
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
  value, onChange, children, className, disabled,
}: {
  value: string; onChange: (v: string) => void;
  children: React.ReactNode; className?: string; disabled?: boolean;
}) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "h-10 px-3 pr-8 rounded-xl border border-border bg-background text-sm text-foreground",
        "outline-none focus:border-primary transition-all appearance-none",
        disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
        className,
      )}
    >
      {children}
    </select>
  );
}

/* ── Step row ───────────────────────────────────────────────────── */
function StepRow({
  step, canRemove, scope, readOnly, onChange, onRemove,
}: {
  step: WfStep; canRemove: boolean; scope: WorkflowScope;
  readOnly?: boolean;
  onChange: (patch: Partial<WfStep>) => void; onRemove: () => void;
}) {
  const roles = scope === "client" ? CLIENT_ROLES : AGENCY_ROLES;
  const users = scope === "client" ? CLIENT_USERS : AGENCY_USERS;
  const isT   = isTerminalAction(step.action);
  const meta  = isT ? terminalMeta(step.action) : null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {isT ? (
        <div className={cn(
          "flex items-center gap-2 h-10 px-4 rounded-xl border font-semibold text-sm",
          meta!.bg, meta!.border, meta!.color,
        )}>
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {readOnly ? (
            <span>{meta!.label}</span>
          ) : (
            <select
              value={step.action}
              onChange={(e) => onChange({ action: e.target.value as StepAction, assigneeId: "" })}
              className="bg-transparent border-none outline-none text-sm font-semibold cursor-pointer"
            >
              {TERMINAL.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          )}
        </div>
      ) : (
        <Sel
          value={step.action}
          disabled={readOnly}
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

      {needsUser(step.action) && (
        <>
          <User className="w-4 h-4 text-muted-foreground shrink-0" />
          <Sel value={step.assigneeId} disabled={readOnly} onChange={(v) => onChange({ assigneeId: v })} className="min-w-[170px]">
            <option value="">Select user…</option>
            {users.map((u) => <option key={u.id} value={u.id}>{u.name} · {u.role}</option>)}
          </Sel>
        </>
      )}

      {needsRole(step.action) && (
        <>
          <Users className="w-4 h-4 text-muted-foreground shrink-0" />
          <Sel value={step.assigneeId} disabled={readOnly} onChange={(v) => onChange({ assigneeId: v })} className="min-w-[170px]">
            <option value="">Select role…</option>
            {roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </Sel>
        </>
      )}

      {canRemove && !readOnly && (
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

/* ── Step chain (shared renderer) ───────────────────────────────── */
function StepChain({
  trigger, steps, scope, readOnly, onChange, onRemove, onAdd,
}: {
  trigger: string; steps: WfStep[]; scope: WorkflowScope; readOnly?: boolean;
  onChange: (id: string, patch: Partial<WfStep>) => void;
  onRemove: (id: string) => void;
  onAdd: () => void;
}) {
  return (
    <div>
      {/* Trigger */}
      <div className="flex items-start gap-4">
        <span className="text-[11px] font-semibold text-primary uppercase tracking-wide shrink-0 pt-3 w-[52px]">Step 1</span>
        <div className="flex-1">
          <div className="flex items-center justify-center h-11 rounded-xl bg-primary text-primary-foreground font-semibold text-sm px-5 shadow-sm">
            <Zap className="w-4 h-4 mr-2 shrink-0" />
            {triggerLabel(trigger, scope)}
          </div>
        </div>
      </div>

      {steps.map((step, idx) => {
        const isT      = isTerminalAction(step.action);
        const stepNum  = idx + 2;
        const canRemove = !isT && (steps.filter((s) => !isTerminalAction(s.action)).length > 1 || steps.length > 2);

        return (
          <div key={step.id}>
            <div className="flex justify-start pl-[52px] py-2">
              <ArrowDown className="w-4 h-4 text-muted-foreground/50" />
            </div>
            <div className="flex items-start gap-4">
              <span className={cn(
                "text-[11px] font-semibold uppercase tracking-wide shrink-0 pt-2.5 w-[52px]",
                isT ? "text-muted-foreground" : "text-primary",
              )}>
                Step {stepNum}
              </span>
              <div className="flex-1">
                <StepRow
                  step={step} canRemove={canRemove} scope={scope} readOnly={readOnly}
                  onChange={(patch) => onChange(step.id, patch)}
                  onRemove={() => onRemove(step.id)}
                />
              </div>
            </div>
          </div>
        );
      })}

      {!readOnly && (
        <>
          <div className="flex justify-start pl-[52px] py-2">
            <ArrowDown className="w-4 h-4 text-muted-foreground/30" />
          </div>
          <div className="pl-[52px]">
            <button
              onClick={onAdd}
              className="flex items-center gap-1.5 text-xs font-semibold text-primary px-3 py-1.5 rounded-lg border border-dashed border-primary/40 hover:border-primary/70 hover:bg-primary/5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Step
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ── Editor ─────────────────────────────────────────────────────── */
function WorkflowEditor({
  initial, scope, isOverride, onSave, onDelete, onCancel,
}: {
  initial: Workflow; scope: WorkflowScope; isOverride?: boolean;
  onSave: (w: Workflow) => void; onDelete: () => void; onCancel: () => void;
}) {
  const [name,     setName]     = useState(initial.name);
  const [trigger,  setTrigger]  = useState(initial.trigger);
  const [steps,    setSteps]    = useState<WfStep[]>(initial.steps);
  const [isActive, setActive]   = useState(initial.isActive);

  const triggers = scope === "client" ? CLIENT_TRIGGERS : AGENCY_TRIGGERS;
  const isNew    = initial.id === "__new__";

  const updateStep = (id: string, patch: Partial<WfStep>) =>
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  const removeStep = (id: string) =>
    setSteps((prev) => prev.filter((s) => s.id !== id));
  const addStep = () => {
    const newStep: WfStep = { id: uid(), action: "pass_to_role", assigneeId: "" };
    setSteps((prev) => [...prev.slice(0, -1), newStep, prev[prev.length - 1]]);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Back */}
      <div className="flex items-center gap-3">
        <button onClick={onCancel} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <h3 className="text-base font-semibold text-foreground">
          {isNew ? "New Workflow" : isOverride ? "Edit Client Override" : "Edit Workflow"}
        </h3>
        {isOverride && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-warning/10 text-warning border border-warning/30">
            Overrides Agency Default
          </span>
        )}
      </div>

      {/* Agency-level save notice */}
      {scope === "agency" && !isNew && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-info/5 border border-info/20">
          <AlertCircle className="w-4 h-4 text-info shrink-0 mt-0.5" />
          <p className="text-xs text-foreground">
            Saving will update this workflow for <strong>all clients who haven't customized it</strong>. Clients with overrides won't be affected.
          </p>
        </div>
      )}

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
            {triggers.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
          </Sel>
        </div>
      </div>

      {/* Step chain */}
      <div className="card-surface">
        <p className="text-sm font-semibold text-foreground mb-5">Workflow Steps</p>
        <StepChain
          trigger={trigger} steps={steps} scope={scope}
          onChange={updateStep} onRemove={removeStep} onAdd={addStep}
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        {!isNew ? (
          <button
            onClick={onDelete}
            className="flex items-center gap-1.5 text-sm text-error hover:text-error/80 font-medium transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            {isOverride ? "Remove Override (Restore Agency Default)" : "Delete Workflow"}
          </button>
        ) : <span />}
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={() => name.trim() && onSave({ ...initial, name: name.trim(), trigger, steps, isActive })}>
            Save Workflow
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ── Inherited (agency default) card ─────────────────────────────── */
function InheritedCard({
  wf, scope, onCustomize,
}: { wf: Workflow; scope: WorkflowScope; onCustomize: () => void }) {
  const nonTermSteps = wf.steps.filter((s) => !isTerminalAction(s.action));
  const termStep     = wf.steps.find((s) => isTerminalAction(s.action));
  const meta         = termStep ? terminalMeta(termStep.action) : null;
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-2xl border border-border/60 bg-muted/20 transition-all">
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center shrink-0 mt-0.5">
              <Building2 className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-sm font-semibold text-foreground">{wf.name}</p>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                  Agency Default
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Trigger: <span className="text-foreground font-medium">{triggerLabel(wf.trigger, scope)}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setExpanded((v) => !v)}
              className="text-xs font-medium px-2.5 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              {expanded ? "Hide" : "Preview"}
            </button>
            <button
              onClick={onCustomize}
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-primary/40 text-primary hover:bg-primary/5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" /> Customize
            </button>
          </div>
        </div>

        {/* Step summary */}
        <div className="mt-3 flex items-center gap-1.5 flex-wrap pl-12">
          <span className="text-[10px] font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-md">Trigger</span>
          {nonTermSteps.map((s) => {
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

      {/* Expanded read-only preview */}
      {expanded && (
        <div className="border-t border-border px-4 pt-4 pb-4">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-3.5 h-3.5 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Read-only — click Customize to create a client-specific version</p>
          </div>
          <StepChain
            trigger={wf.trigger} steps={wf.steps} scope={scope} readOnly
            onChange={() => {}} onRemove={() => {}} onAdd={() => {}}
          />
        </div>
      )}
    </div>
  );
}

/* ── Client / override card ─────────────────────────────────────── */
function WorkflowCard({
  wf, scope, onEdit, onToggle, onReset,
}: {
  wf: Workflow; scope: WorkflowScope;
  onEdit: () => void; onToggle: () => void; onReset?: () => void;
}) {
  const nonTermSteps = wf.steps.filter((s) => !isTerminalAction(s.action));
  const termStep     = wf.steps.find((s) => isTerminalAction(s.action));
  const meta         = termStep ? terminalMeta(termStep.action) : null;
  const isOverride   = wf.source === "client-override";

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
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <p className="text-sm font-semibold text-foreground">{wf.name}</p>
              {isOverride && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-warning/10 text-warning border border-warning/20">
                  Customized
                </span>
              )}
              <span className={cn(
                "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                wf.isActive ? "bg-success/10 text-success" : "bg-muted text-muted-foreground",
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
          {isOverride && onReset && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Remove override and inherit agency default"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          )}
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
        <span className="text-[10px] font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-md">Trigger</span>
        {nonTermSteps.map((s) => {
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

/* ── Agency workflow card (with override count) ──────────────────── */
function AgencyWorkflowCard({
  wf, onEdit, onToggle,
}: { wf: Workflow; onEdit: () => void; onToggle: () => void }) {
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
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <p className="text-sm font-semibold text-foreground">{wf.name}</p>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                Default
              </span>
              <span className={cn(
                "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                wf.isActive ? "bg-success/10 text-success" : "bg-muted text-muted-foreground",
              )}>
                {wf.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-0.5">
              <p className="text-xs text-muted-foreground">
                Trigger: <span className="text-foreground font-medium">{triggerLabel(wf.trigger, "agency")}</span>
              </p>
              {(wf.overrideCount ?? 0) > 0 && (
                <span className="text-[10px] text-warning font-medium">
                  {wf.overrideCount} client{wf.overrideCount !== 1 ? "s" : ""} customized
                </span>
              )}
              {(wf.overrideCount ?? 0) === 0 && (
                <span className="text-[10px] text-muted-foreground">All clients using default</span>
              )}
            </div>
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

      <div className="mt-3 flex items-center gap-1.5 flex-wrap pl-12">
        <span className="text-[10px] font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-md">Trigger</span>
        {nonTermSteps.map((s) => {
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
  /* Agency state */
  const [agencyWfs, setAgencyWfs] = useState<Workflow[]>(AGENCY_WORKFLOWS);

  /* Client state */
  const [clientWfs, setClientWfs] = useState<Workflow[]>(CLIENT_INITIAL);

  const [editingId, setEditingId] = useState<string | null>(null);

  /* ─ Derived: which agency WFs are overridden by this client ─ */
  const overriddenAgencyIds = new Set(
    clientWfs.filter((w) => w.source === "client-override").map((w) => w.overridesId!),
  );
  const inheritedAgencyWfs = agencyWfs.filter((w) => !overriddenAgencyIds.has(w.id));

  /* ─ Editing target ─ */
  const allEditable = scope === "agency" ? agencyWfs : clientWfs;
  const editing = editingId === "__new__"
    ? {
        id: "__new__", name: "", isActive: true, source: (scope === "client" ? "client-only" : "agency") as WorkflowSource,
        trigger: scope === "client" ? "post_submitted" : "post_submitted_any",
        steps: [
          { id: uid(), action: "pass_to_role" as StepAction, assigneeId: "" },
          { id: uid(), action: "approve_publish" as StepAction, assigneeId: "" },
        ],
      }
    : allEditable.find((w) => w.id === editingId) ?? null;

  /* ─ Handlers ─ */
  const handleSave = (updated: Workflow) => {
    if (scope === "agency") {
      if (updated.id === "__new__") {
        setAgencyWfs((prev) => [...prev, { ...updated, id: `ag-wf${Date.now()}`, source: "agency", overrideCount: 0 }]);
      } else {
        setAgencyWfs((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
      }
    } else {
      if (updated.id === "__new__") {
        setClientWfs((prev) => [...prev, { ...updated, id: `cl-wf${Date.now()}` }]);
      } else {
        setClientWfs((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
      }
    }
    setEditingId(null);
  };

  const handleDelete = () => {
    if (scope === "agency") {
      setAgencyWfs((prev) => prev.filter((w) => w.id !== editingId));
    } else {
      setClientWfs((prev) => prev.filter((w) => w.id !== editingId));
    }
    setEditingId(null);
  };

  const handleToggle = (id: string) => {
    if (scope === "agency") {
      setAgencyWfs((prev) => prev.map((w) => (w.id === id ? { ...w, isActive: !w.isActive } : w)));
    } else {
      setClientWfs((prev) => prev.map((w) => (w.id === id ? { ...w, isActive: !w.isActive } : w)));
    }
  };

  /** Client: create an editable copy of an agency workflow */
  const handleCustomize = (agencyWf: Workflow) => {
    const override: Workflow = {
      ...agencyWf,
      id: `cl-ov${Date.now()}`,
      source: "client-override",
      overridesId: agencyWf.id,
      steps: agencyWf.steps.map((s) => ({ ...s, id: uid() })),
    };
    setClientWfs((prev) => [...prev, override]);
    setEditingId(override.id);
  };

  /** Client: remove override → agency default re-appears as inherited */
  const handleReset = (wf: Workflow) => {
    setClientWfs((prev) => prev.filter((w) => w.id !== wf.id));
  };

  /* ─ Editor view ─ */
  if (editing) {
    return (
      <WorkflowEditor
        initial={editing}
        scope={scope}
        isOverride={editing.source === "client-override"}
        onSave={handleSave}
        onDelete={handleDelete}
        onCancel={() => setEditingId(null)}
      />
    );
  }

  /* ─ Agency list view ─ */
  if (scope === "agency") {
    return (
      <div className="space-y-5 max-w-2xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">Approval Workflows</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Set default workflows for all clients. Clients may customize them independently.
            </p>
          </div>
          <Button size="sm" onClick={() => setEditingId("__new__")} className="gap-1.5">
            <Plus className="w-3.5 h-3.5" /> New Workflow
          </Button>
        </div>

        <div className="space-y-3">
          {agencyWfs.map((wf) => (
            <AgencyWorkflowCard
              key={wf.id} wf={wf}
              onEdit={() => setEditingId(wf.id)}
              onToggle={() => handleToggle(wf.id)}
            />
          ))}
        </div>

        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-muted/50 border border-border">
          <CheckCircle2 className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            Changes to agency workflows apply to all clients using the default. Clients who have customized a workflow won't be affected until they reset to default.
          </p>
        </div>
      </div>
    );
  }

  /* ─ Client list view ─ */
  const customClientWfs = clientWfs; // overrides + client-only

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">Approval Workflows</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage how content moves through review. Customize agency defaults or create your own.
          </p>
        </div>
        <Button size="sm" onClick={() => setEditingId("__new__")} className="gap-1.5">
          <Plus className="w-3.5 h-3.5" /> New Workflow
        </Button>
      </div>

      {/* Inherited from agency */}
      {inheritedAgencyWfs.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Inherited from Agency</p>
          </div>
          {inheritedAgencyWfs.map((wf) => (
            <InheritedCard
              key={wf.id}
              wf={wf}
              scope="client"
              onCustomize={() => handleCustomize(wf)}
            />
          ))}
        </div>
      )}

      {/* Client workflows (overrides + client-only) */}
      {customClientWfs.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <GitBranch className="w-3.5 h-3.5 text-muted-foreground" />
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Your Workflows</p>
          </div>
          {customClientWfs.map((wf) => (
            <WorkflowCard
              key={wf.id} wf={wf} scope="client"
              onEdit={() => setEditingId(wf.id)}
              onToggle={() => handleToggle(wf.id)}
              onReset={wf.source === "client-override" ? () => handleReset(wf) : undefined}
            />
          ))}
        </div>
      )}

      {inheritedAgencyWfs.length === 0 && customClientWfs.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <GitBranch className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground mb-1">No workflows</p>
          <p className="text-xs text-muted-foreground mb-4">No agency defaults or custom workflows exist yet.</p>
        </div>
      )}

      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-muted/50 border border-border">
        <CheckCircle2 className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          Customized workflows override the agency default for this client only. Use <strong>Reset</strong> to go back to the agency default at any time. Changes only affect new submissions.
        </p>
      </div>
    </div>
  );
}
