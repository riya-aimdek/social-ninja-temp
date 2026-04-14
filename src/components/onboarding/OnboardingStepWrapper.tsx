import { ReactNode } from "react";

interface OnboardingStepWrapperProps {
  children: ReactNode;
  icon?: ReactNode;
  title: string;
  subtitle: string;
}

const OnboardingStepWrapper = ({ children, icon, title, subtitle }: OnboardingStepWrapperProps) => (
  <div className="space-y-5 max-w-md mx-auto animate-step-in">
    <div className="text-center">
      {icon && (
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
          {icon}
        </div>
      )}
      <h2 className="text-xl font-bold text-foreground">{title}</h2>
      <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
    </div>
    {children}
  </div>
);

export default OnboardingStepWrapper;
