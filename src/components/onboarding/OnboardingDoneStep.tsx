import { CheckCircle2, BarChart3, Sparkles, CalendarDays, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OnboardingDoneStepProps {
  isAgency: boolean;
  onGoDashboard: () => void;
}

const OnboardingDoneStep = ({ isAgency, onGoDashboard }: OnboardingDoneStepProps) => (
  <div className="space-y-6 max-w-md mx-auto text-center animate-step-in">
    {/* Animated success icon */}
    <div className="relative mx-auto w-20 h-20">
      <div className="absolute inset-0 gradient-coral rounded-full opacity-20 animate-ping-slow" />
      <div className="relative w-20 h-20 gradient-coral rounded-full flex items-center justify-center shadow-coral animate-bounce-in">
        <CheckCircle2 className="h-10 w-10 text-white" />
      </div>
    </div>

    <div className="space-y-2">
      <h2 className="text-2xl font-bold text-foreground">
        {isAgency ? "Your agency is ready! 🎉" : "You're all set! 🎉"}
      </h2>
      <p className="text-sm text-muted-foreground">
        {isAgency
          ? "Start managing clients, scheduling content, and growing brands."
          : "Dive in — your workspace is ready to go."}
      </p>
    </div>

    {!isAgency && (
      <>
        <div className="flex justify-center gap-6 mt-4">
          {[
            { icon: BarChart3, label: "Analyze" },
            { icon: Sparkles, label: "Create" },
            { icon: CalendarDays, label: "Publish" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-1.5 group cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                {label}
              </span>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          <a href="/client/team" className="text-primary hover:underline">
            + Add team members
          </a>
        </p>
      </>
    )}

    <Button className="w-full shadow-coral mt-2" size="lg" onClick={onGoDashboard}>
      Go to Dashboard <ArrowRight className="h-4 w-4 ml-1" />
    </Button>
  </div>
);

export default OnboardingDoneStep;
