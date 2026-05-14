import { useState, useEffect, useRef } from "react";
import { ChevronUp, ChevronDown, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Step {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  route: string;
}

const INITIAL_STEPS: Step[] = [
  { id: "brand",   name: "Set up your brand",        description: "Add your business name and logo", completed: false, route: "/client/onboarding"        },
  { id: "project", name: "Create a project",          description: "Organise your social accounts",  completed: false, route: "/client/projects"           },
  { id: "connect", name: "Connect social accounts",   description: "Link your platforms",             completed: false, route: "/client/connect"            },
  { id: "team",    name: "Add team members",          description: "Invite your team to collaborate", completed: false, route: "/client/settings/team"      },
];

export default function OnboardingWidget() {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);
  const [open, setOpen] = useState(false);
  const [steps, setSteps] = useState<Step[]>(INITIAL_STEPS);
  const panelRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLButtonElement>(null);

  const completedCount = steps.filter((s) => s.completed).length;
  const allDone = completedCount === steps.length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        open &&
        panelRef.current &&
        bubbleRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        !bubbleRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const toggleStep = (id: string) => {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s)));
  };

  const handleDismiss = () => {
    setDismissed(true);
  };

  if (dismissed) return null;

  const progress = (completedCount / steps.length) * 100;

  return (
    <>
      {/* Panel — opens upward */}
      {open && (
        <div
          ref={panelRef}
          className="fixed z-[100]"
          style={{
            bottom: 82,
            right: 24,
            width: 320,
            background: "#fff",
            border: "1px solid #E5E5E5",
            borderRadius: 12,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          }}
        >
          {allDone ? (
            /* All-done state */
            <div className="p-6 text-center">
              <div
                className="mx-auto mb-3 flex items-center justify-center"
                style={{ width: 48, height: 48, borderRadius: "50%", background: "hsl(var(--success))" }}
              >
                <Check className="w-6 h-6" style={{ color: "#fff" }} strokeWidth={2.5} />
              </div>
              <p style={{ fontSize: 15, fontWeight: 600, color: "#1a1a2e", marginBottom: 4 }}>
                You're all set!
              </p>
              <p style={{ fontSize: 12, color: "#888", marginBottom: 16 }}>
                All onboarding steps are complete.
              </p>
              <button
                onClick={handleDismiss}
                style={{ fontSize: 12, fontWeight: 500, color: "#FD5C63", textDecoration: "none" }}
                className="hover:underline"
              >
                Got it, hide this
              </button>
            </div>
          ) : (
            <>
              {/* Header */}
              <div style={{ padding: "16px 16px 12px" }}>
                <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: "#1a1a2e" }}>Get started</span>
                  <span style={{ fontSize: 12, color: "#888" }}>{completedCount} of {steps.length} complete</span>
                </div>
                {/* Progress bar */}
                <div style={{ height: 4, borderRadius: 4, background: "#F0F0F0", overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${progress}%`,
                      background: "#FD5C63",
                      borderRadius: 4,
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
              </div>

              {/* Steps */}
              <div>
                {steps.map((step, idx) => (
                  <div
                    key={step.id}
                    className="flex items-center gap-3"
                    style={{
                      height: 56,
                      padding: "0 16px",
                      borderBottom: idx < steps.length - 1 ? "1px solid #F5F5F5" : "none",
                    }}
                  >
                    {/* Circle toggle */}
                    <button
                      onClick={() => toggleStep(step.id)}
                      className="flex-shrink-0"
                      aria-label={step.completed ? "Mark incomplete" : "Mark complete"}
                    >
                      {step.completed ? (
                        <div
                          className="flex items-center justify-center"
                          style={{ width: 20, height: 20, borderRadius: "50%", background: "#FD5C63" }}
                        >
                          <Check className="w-3 h-3" style={{ color: "#fff" }} strokeWidth={3} />
                        </div>
                      ) : (
                        <div
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            border: "1.5px solid #D1D5DB",
                          }}
                        />
                      )}
                    </button>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <p style={{ fontSize: 13, fontWeight: 500, color: "#1a1a2e", lineHeight: 1.3 }}>
                        {step.name}
                      </p>
                      <p style={{ fontSize: 12, color: "#888", lineHeight: 1.3 }}>{step.description}</p>
                    </div>

                    {/* Go → */}
                    {!step.completed && (
                      <button
                        onClick={() => { navigate(step.route); setOpen(false); }}
                        style={{ fontSize: 12, fontWeight: 500, color: "#FD5C63", flexShrink: 0 }}
                        className="hover:underline"
                      >
                        Go →
                      </button>
                    )}
                  </div>
                ))}
              </div>

            </>
          )}
        </div>
      )}

      {/* Launcher bubble */}
      <button
        ref={bubbleRef}
        onClick={() => setOpen((o) => !o)}
        className="fixed z-[100] flex items-center gap-2 transition-shadow"
        style={{
          bottom: 24,
          right: 24,
          height: 50,
          padding: "0 20px",
          borderRadius: 25,
          background: "#fff",
          border: "1px solid #E5E5E5",
          boxShadow: open
            ? "0 6px 16px rgba(0,0,0,0.16)"
            : "0 4px 12px rgba(0,0,0,0.12)",
        }}
      >
        {/* Badge */}
        {allDone ? (
          <div
            className="flex items-center justify-center flex-shrink-0"
            style={{ width: 22, height: 22, borderRadius: "50%", background: "hsl(var(--success))" }}
          >
            <Check className="w-3 h-3" style={{ color: "#fff" }} strokeWidth={3} />
          </div>
        ) : (
          <div
            className="flex items-center justify-center flex-shrink-0"
            style={{ width: 22, height: 22, borderRadius: "50%", background: "#FD5C63" }}
          >
            <span style={{ fontSize: 11, fontWeight: 600, color: "#fff" }}>{completedCount}</span>
          </div>
        )}

        <span style={{ fontSize: 13, fontWeight: 500, color: "#1a1a2e" }}>Setup checklist</span>

        {open ? (
          <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#888" }} />
        ) : (
          <ChevronUp className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#888" }} />
        )}
      </button>
    </>
  );
}
