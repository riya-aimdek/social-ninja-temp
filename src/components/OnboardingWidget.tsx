import { useState, useEffect } from "react";
import { CheckCircle2, ChevronUp, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  link: string;
}

const STORAGE_KEY = "sn_onboarding_state";
const DISMISSED_KEY = "sn_onboarding_dismissed";

function loadState(): { completed: string[]; dismissed: boolean } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const dismissed = localStorage.getItem(DISMISSED_KEY) === "true";
    return { completed: raw ? JSON.parse(raw) : [], dismissed };
  } catch {
    return { completed: [], dismissed: false };
  }
}

function saveCompleted(ids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function markOnboardingStep(stepId: string) {
  const state = loadState();
  if (!state.completed.includes(stepId)) {
    state.completed.push(stepId);
    saveCompleted(state.completed);
  }
}

export function isOnboardingDismissed() {
  return localStorage.getItem(DISMISSED_KEY) === "true";
}

const defaultSteps: Omit<OnboardingStep, "completed">[] = [
  { id: "brand", title: "Set up your brand", description: "Add your business name and logo", link: "/onboarding?type=client&step=0" },
  { id: "project", title: "Create a project", description: "Organise your social accounts", link: "/client/projects" },
  { id: "connect", title: "Connect social accounts", description: "Link your platforms", link: "/client/connect" },
  { id: "team", title: "Add team members", description: "Invite your team to collaborate", link: "/client/team" },
];

export default function OnboardingWidget() {
  const navigate = useNavigate();
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [dismissed, setDismissed] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [allDone, setAllDone] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const state = loadState();
    setCompletedIds(state.completed);
    setDismissed(state.dismissed);
  }, []);

  useEffect(() => {
    if (completedIds.length === 4 && !allDone) {
      setAllDone(true);
      setShowSuccess(true);
    }
  }, [completedIds, allDone]);

  // Listen for storage changes (from other parts of the app marking steps complete)
  useEffect(() => {
    const interval = setInterval(() => {
      const state = loadState();
      setCompletedIds(state.completed);
      if (state.dismissed) setDismissed(true);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (dismissed) return null;

  const steps: OnboardingStep[] = defaultSteps.map((s) => ({
    ...s,
    completed: completedIds.includes(s.id),
  }));

  const completedCount = steps.filter((s) => s.completed).length;

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, "true");
    setDismissed(true);
  };

  // Collapsed pill
  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-white border border-[#E5E5E5] rounded-lg px-3 py-2.5 shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
          <span className="text-[10px] font-bold text-white">{completedCount}</span>
        </div>
        <span className="text-xs font-medium text-foreground">Setup checklist</span>
        <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
      </button>
    );
  }

  // Success state
  if (showSuccess) {
    return (
      <div className="w-[280px] shrink-0">
        <div className="bg-white border border-[#E5E5E5] rounded-xl p-5 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="text-[15px] font-semibold text-foreground">You're all set! 🎉</h3>
          <p className="text-xs text-muted-foreground">Your workspace is ready.</p>
          <button
            onClick={handleDismiss}
            className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[280px] shrink-0">
      <div className="bg-white border border-[#E5E5E5] rounded-xl p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[15px] font-semibold text-foreground">Get started</h3>
          <span className="text-xs text-muted-foreground">{completedCount} of 4 complete</span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 bg-[#F0F0F0] rounded-full mb-4 overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${(completedCount / 4) * 100}%` }}
          />
        </div>

        {/* Steps */}
        <div className="divide-y divide-[#F5F5F5]">
          {steps.map((step) => (
            <div key={step.id} className="flex items-center gap-3 py-3.5 first:pt-0 last:pb-0" style={{ minHeight: 56 }}>
              {/* Icon */}
              <div className="shrink-0">
                {step.completed ? (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-[#D4D4D4]" />
                )}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-foreground">{step.title}</p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>

              {/* Go link */}
              {!step.completed && (
                <button
                  onClick={() => navigate(step.link)}
                  className="text-xs font-medium text-primary hover:underline shrink-0 flex items-center gap-0.5"
                >
                  Go <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-4 text-center">
          <button
            onClick={() => setCollapsed(true)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Hide checklist
          </button>
        </div>
      </div>
    </div>
  );
}
