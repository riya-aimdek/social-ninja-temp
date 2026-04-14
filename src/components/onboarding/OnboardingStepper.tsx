import { CheckCircle2, LucideIcon } from "lucide-react";

interface Step {
  label: string;
  icon: LucideIcon;
}

interface OnboardingStepperProps {
  steps: Step[];
  currentStep: number;
}

const OnboardingStepper = ({ steps, currentStep }: OnboardingStepperProps) => (
  <div className="flex items-center justify-center gap-0 mb-8">
    {steps.map((step, idx) => (
      <div key={step.label} className="flex items-center">
        <div className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              idx < currentStep
                ? "bg-emerald-500 text-white shadow-sm"
                : idx === currentStep
                ? "gradient-coral text-white shadow-coral scale-110"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {idx < currentStep ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <step.icon className="h-5 w-5" />
            )}
          </div>
          <span
            className={`text-xs mt-1.5 font-medium transition-colors duration-300 ${
              idx <= currentStep ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            {step.label}
          </span>
        </div>
        {idx < steps.length - 1 && (
          <div className="relative w-12 h-0.5 mx-1.5 rounded-full bg-border overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: idx < currentStep ? "100%" : "0%" }}
            />
          </div>
        )}
      </div>
    ))}
  </div>
);

export default OnboardingStepper;
