import { useState } from "react";
import { Plus, CheckCircle2, X, User, Users, RotateCcw, Zap, GitBranch, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/* ── Types ──────────────────────────────────────────────────────── */
export type WorkflowScope = "client" | "agency";

interface WfStep {
  id: string;
  type: "user" | "role";
  assigneeId: string;
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

const DEFAULT_STEPS: WfStep[] = [
  { id: "s1", type: "role", assigneeId: "approver"             },
  { id: "s2", type: "role", assigneeId: "social-media-manager" },
];

const uid = () => `s${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

function getAssigneeName(step: WfStep, scope: WorkflowScope) {
  if (step.type === "user") {
    const list = scope === "client" ? CLIENT_USERS : AGENCY_USERS;
    const u = list.find((x) => x.id === step.assigneeId);
    return u ? `${u.name} · ${u.role}` : "—";
  }
  const list = scope === "client" ? CLIENT_ROLES : AGENCY_ROLES;
  return list.find((r) => r.id === step.assigneeId)?.name ?? "—";
}

/* ── Main export ─────────────────────────────────────────────────── */
export function WorkflowSettings({ scope }: { scope: WorkflowScope }) {
  const [agencySteps, setAgencySteps] = useState<WfStep[]>(DEFAULT_STEPS);
  const [clientSteps, setClientSteps] = useState<WfStep[] | null>(null);
  const [isActive, setIsActive]       = useState(true);

  const isOverridden   = scope === "client" && clientSteps !== null;
  const steps          = isOverridden ? clientSteps! : agencySteps;
  const roles          = scope === "client" ? CLIENT_ROLES : AGENCY_ROLES;
  const users          = scope === "client" ? CLIENT_USERS : AGENCY_USERS;

  /* helpers that auto-mark override when client edits */
  function setSteps(updater: (prev: WfStep[]) => WfStep[]) {
    if (scope === "client") {
      setClientSteps((prev) => updater(prev ?? agencySteps));
    } else {
      setAgencySteps(updater);
    }
  }

  function patchStep(id: string, changes: Partial<WfStep>) {
    setSteps((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const merged = { ...s, ...changes };
        // reset assignee when type flips
        if (changes.type && changes.type !== s.type) {
          merged.assigneeId = changes.type === "role" ? roles[0].id : users[0].id;
        }
        return merged;
      }),
    );
  }

  function addStep() {
    setSteps((prev) => [
      ...prev,
      { id: uid(), type: "role", assigneeId: roles[0].id },
    ]);
  }

  function removeStep(id: string) {
    setSteps((prev) => prev.filter((s) => s.id !== id));
  }

  function resetToDefault() {
    setClientSteps(null);
  }

  /* ── Render ── */
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-base font-semibold text-foreground">Approval Workflow</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Define who must approve content before it gets published, in order.
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
            onClick={() => setIsActive((v) => !v)}
            className={cn(
              "flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors",
              isActive
                ? "border-success/40 bg-success/10 text-success hover:bg-success/20"
                : "border-border text-muted-foreground hover:bg-muted",
            )}
          >
            <span className={cn("w-1.5 h-1.5 rounded-full", isActive ? "bg-success" : "bg-muted-foreground")} />
            {isActive ? "Active" : "Inactive"}
          </button>
        </div>
      </div>

      {/* Status badges row */}
      {(scope === "client") && (
        <div className="flex items-center gap-2">
          <GitBranch className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Content Approval Workflow</span>
          {isOverridden
            ? <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-warning/10 text-warning border border-warning/20">Customized</span>
            : <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">Agency Default</span>
          }
        </div>
      )}

      {/* ── Workflow visual ── */}
      <div className="relative">

        {/* ── Trigger node ── */}
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

        {/* ── Approval steps ── */}
        {steps.map((step, i) => (
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
                  {(["role", "user"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => patchStep(step.id, { type: t })}
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

                {/* Assignee */}
                <div className="relative flex-1">
                  <select
                    value={step.assigneeId}
                    onChange={(e) => patchStep(step.id, { assigneeId: e.target.value })}
                    className="w-full h-8 pl-2.5 pr-8 rounded-lg border border-border bg-background text-sm text-foreground outline-none focus:border-primary appearance-none cursor-pointer transition-colors"
                  >
                    {(step.type === "role" ? roles : users).map((item) => (
                      <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                </div>

                {/* Remove */}
                {steps.length > 1 && (
                  <button
                    onClick={() => removeStep(step.id)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-error hover:bg-error/10 transition-colors shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* ── Add step node ── */}
        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <button
              onClick={addStep}
              className="w-10 h-10 rounded-xl border-2 border-dashed border-border flex items-center justify-center shrink-0 hover:border-primary hover:bg-primary/5 transition-colors group"
            >
              <Plus className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
            <div className="w-0.5 bg-border flex-1 min-h-[32px]" />
          </div>
          <div className="flex-1 pb-8 flex items-center">
            <button
              onClick={addStep}
              className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Add approval step
            </button>
          </div>
        </div>

        {/* ── Terminal node ── */}
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

      {/* Info note */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-muted/50 border border-border">
        <CheckCircle2 className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          {scope === "client"
            ? isOverridden
              ? "This is a client-level customization. Agency default is unchanged. Use Reset to revert."
              : "Using the agency-defined workflow. Any change here creates a client-specific override."
            : "This workflow applies to all clients by default. Clients may override it for their account."
          }
        </p>
      </div>
    </div>
  );
}
