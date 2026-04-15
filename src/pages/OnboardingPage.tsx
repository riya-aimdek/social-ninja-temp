import { useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  User, Link2, Users, CheckCircle2, Upload, ArrowRight, ArrowLeft,
  Instagram, Facebook, Linkedin, Twitter, Plus, X, Building2, Palette,
  FolderOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SocialNinjaLogo from "@/components/SocialNinjaLogo";

const STORAGE_KEY = "sn_onboarding_state";
function markOnboardingStep(stepId: string) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const completed: string[] = raw ? JSON.parse(raw) : [];
    if (!completed.includes(stepId)) {
      completed.push(stepId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
    }
  } catch {}
}

import OnboardingStepper from "@/components/onboarding/OnboardingStepper";
import OnboardingStepWrapper from "@/components/onboarding/OnboardingStepWrapper";
import SocialPlatformCard from "@/components/onboarding/SocialPlatformCard";
import OnboardingDoneStep from "@/components/onboarding/OnboardingDoneStep";
import { Progress } from "@/components/ui/progress";

const socialPlatforms = [
  { name: "Facebook", icon: Facebook, color: "text-facebook" },
  { name: "Instagram", icon: Instagram, color: "text-instagram" },
  { name: "LinkedIn", icon: Linkedin, color: "text-linkedin" },
  { name: "Twitter/X", icon: Twitter, color: "text-twitter" },
];

const agencySteps = [
  { label: "Agency", icon: Building2 },
  { label: "First Client", icon: Users },
  { label: "Connect", icon: Link2 },
  { label: "Team", icon: User },
  { label: "Done", icon: CheckCircle2 },
];

const clientSteps = [
  { label: "Brand", icon: Palette },
  { label: "Project", icon: FolderOpen },
  { label: "Connect", icon: Link2 },
  { label: "Done", icon: CheckCircle2 },
];

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const accountType = searchParams.get("type") || "business";
  const isAgency = accountType === "agency";
  const steps = isAgency ? agencySteps : clientSteps;

  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);
  const [invitedEmails, setInvitedEmails] = useState<string[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("content-creator");
  const [approvalEnabled, setApprovalEnabled] = useState(false);
  const [clientName, setClientName] = useState("");
  const [industry, setIndustry] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");

  const totalSteps = steps.length;
  const dashboardPath = isAgency ? "/agency/dashboard" : "/client/dashboard";
  const progressPercent = ((currentStep) / (totalSteps - 1)) * 100;

  const goNext = useCallback(() => {
    if (!isAgency) {
      if (currentStep === 0 && clientName.trim()) markOnboardingStep("brand");
      if (currentStep === 1 && projectName.trim()) markOnboardingStep("project");
      if (currentStep === 2 && connectedPlatforms.length > 0) markOnboardingStep("connect");
    }
    setDirection("forward");
    setCurrentStep((s) => Math.min(s + 1, totalSteps - 1));
  }, [currentStep, isAgency, clientName, projectName, connectedPlatforms, totalSteps]);

  const goBack = useCallback(() => {
    setDirection("back");
    setCurrentStep((s) => Math.max(s - 1, 0));
  }, []);

  const togglePlatform = (name: string) => {
    setConnectedPlatforms((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]
    );
  };

  const addInvite = () => {
    if (inviteEmail && !invitedEmails.includes(inviteEmail)) {
      setInvitedEmails([...invitedEmails, inviteEmail]);
      setInviteEmail("");
    }
  };

  const removeInvite = (email: string) => {
    setInvitedEmails(invitedEmails.filter((e) => e !== email));
  };

  const isDoneStep = currentStep === totalSteps - 1;

  return (
    <div className="min-h-screen gradient-mesh bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-card rounded-2xl shadow-card overflow-hidden">
          {/* Top progress bar */}
          <div className="px-0">
            <Progress value={progressPercent} className="h-1 rounded-none" />
          </div>

          <div className="p-8">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <SocialNinjaLogo size="lg" />
            </div>

            {/* Stepper */}
            <OnboardingStepper steps={steps} currentStep={currentStep} />

            {/* Step content with key-based animation */}
            <div key={`${accountType}-${currentStep}`} className={direction === "forward" ? "animate-slide-in-right" : "animate-slide-in-left"}>
              {/* ===== AGENCY FLOW ===== */}
              {isAgency && currentStep === 0 && (
                <OnboardingStepWrapper title="Set up your agency workspace" subtitle="This will be your agency's home base">
                  <div className="flex items-center gap-5">
                    <div className="w-20 h-20 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center hover:border-primary cursor-pointer transition-all hover:scale-105 shrink-0 group">
                      <Upload className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="text-[10px] text-muted-foreground group-hover:text-primary mt-1 transition-colors">Agency Logo</span>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1 block">Agency Name</label>
                        <input className="input-dark" defaultValue="Digital Spark Agency" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1 block">Agency Website</label>
                        <input className="input-dark" placeholder="https://youragency.com" />
                      </div>
                    </div>
                  </div>
                </OnboardingStepWrapper>
              )}

              {isAgency && currentStep === 1 && (
                <OnboardingStepWrapper title="Create your first client" subtitle="Each client gets a fully isolated environment">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Client Name</label>
                      <input className="input-dark" placeholder="e.g. Acme Corp" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Industry</label>
                      <select className="input-dark">
                        <option value="">Select industry</option>
                        <option>Retail & E-commerce</option>
                        <option>Technology</option>
                        <option>Healthcare</option>
                        <option>Food & Beverage</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="bg-muted rounded-lg p-3 hover:bg-muted/80 transition-colors">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <button
                          onClick={() => setApprovalEnabled(!approvalEnabled)}
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0 ${
                            approvalEnabled ? "bg-primary border-primary scale-110" : "border-border hover:border-primary/50"
                          }`}
                        >
                          {approvalEnabled && <CheckCircle2 className="h-3 w-3 text-white" />}
                        </button>
                        <div>
                          <p className="text-sm font-medium text-foreground">Enable client approval workflow</p>
                          <p className="text-xs text-muted-foreground">Clients can review and approve content before publishing</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </OnboardingStepWrapper>
              )}

              {isAgency && currentStep === 2 && (
                <OnboardingStepWrapper
                  title="Connect client's social accounts"
                  subtitle="Link the social profiles for this client"
                  icon={<Link2 className="h-6 w-6 text-primary" />}
                >
                  <div className="space-y-3">
                    {socialPlatforms.map((platform) => (
                      <SocialPlatformCard
                        key={platform.name}
                        name={platform.name}
                        icon={platform.icon}
                        color={platform.color}
                        isConnected={connectedPlatforms.includes(platform.name)}
                        onClick={() => togglePlatform(platform.name)}
                      />
                    ))}
                  </div>
                </OnboardingStepWrapper>
              )}

              {isAgency && currentStep === 3 && (
                <OnboardingStepWrapper
                  title="Invite team members"
                  subtitle="Assign roles scoped to this client only"
                  icon={<User className="h-6 w-6 text-primary" />}
                >
                  <div className="flex gap-2">
                    <input
                      className="input-dark flex-1"
                      placeholder="colleague@agency.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addInvite()}
                    />
                    <select className="input-dark w-36" value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}>
                      <option value="account-manager">Account Manager</option>
                      <option value="content-creator">Content Creator</option>
                      <option value="approver">Approver</option>
                      <option value="analyst">Analyst</option>
                    </select>
                    <Button onClick={addInvite} size="sm" className="shrink-0">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {invitedEmails.length > 0 && (
                    <div className="space-y-2">
                      {invitedEmails.map((email) => (
                        <div key={email} className="flex items-center justify-between px-3 py-2 bg-muted rounded-lg animate-step-in">
                          <span className="text-sm text-foreground">{email}</span>
                          <button onClick={() => removeInvite(email)} className="text-muted-foreground hover:text-destructive transition-colors">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </OnboardingStepWrapper>
              )}

              {isAgency && currentStep === 4 && (
                <OnboardingDoneStep isAgency onGoDashboard={() => navigate(dashboardPath)} />
              )}

              {/* ===== BUSINESS FLOW ===== */}
              {!isAgency && currentStep === 0 && (
                <OnboardingStepWrapper title="Set up your brand workspace" subtitle="Tell us about your brand">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Business Name *</label>
                      <input className="input-dark" placeholder="Your brand name" value={clientName} onChange={(e) => setClientName(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Industry</label>
                      <select className="input-dark" value={industry} onChange={(e) => setIndustry(e.target.value)}>
                        <option value="">Select Industry</option>
                        <option>Retail & E-commerce</option>
                        <option>Technology</option>
                        <option>Healthcare</option>
                        <option>Food & Beverage</option>
                        <option>Real Estate</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Description</label>
                      <textarea className="input-dark resize-none" rows={2} placeholder="Brief description (optional)" />
                    </div>
                  </div>
                </OnboardingStepWrapper>
              )}

              {!isAgency && currentStep === 1 && (
                <OnboardingStepWrapper
                  title="Create your first project"
                  subtitle="Projects help you organize your social media presence."
                  icon={<FolderOpen className="h-6 w-6 text-primary" />}
                >
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Project Name *</label>
                      <input className="input-dark" placeholder="e.g. Summer Campaign" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Description</label>
                      <textarea className="input-dark resize-none" rows={3} placeholder="What is this project about? (Optional)" value={projectDesc} onChange={(e) => setProjectDesc(e.target.value)} />
                    </div>
                  </div>
                </OnboardingStepWrapper>
              )}

              {!isAgency && currentStep === 2 && (
                <OnboardingStepWrapper
                  title="Connect social accounts"
                  subtitle="Link your social profiles to this project."
                  icon={<Link2 className="h-6 w-6 text-primary" />}
                >
                  <div className="grid grid-cols-2 gap-3">
                    {socialPlatforms.map((platform) => (
                      <SocialPlatformCard
                        key={platform.name}
                        name={platform.name}
                        icon={platform.icon}
                        color={platform.color}
                        isConnected={connectedPlatforms.includes(platform.name)}
                        onClick={() => togglePlatform(platform.name)}
                        compact
                      />
                    ))}
                  </div>
                </OnboardingStepWrapper>
              )}

              {!isAgency && currentStep === 3 && (
                <OnboardingDoneStep isAgency={false} onGoDashboard={() => navigate(dashboardPath)} />
              )}
            </div>

            {/* Navigation */}
            {!isDoneStep && (
              <div className="flex justify-between mt-8">
                {currentStep > 0 ? (
                  <Button variant="outline" onClick={goBack}>
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back
                  </Button>
                ) : (
                  <div />
                )}
                <div className="flex gap-3">
                  <Button variant="ghost" className="text-muted-foreground" onClick={() => { setDirection("forward"); setCurrentStep(currentStep + 1); }}>
                    Skip
                  </Button>
                  <Button onClick={goNext}>
                    Continue <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step indicator text */}
            {!isDoneStep && (
              <p className="text-center text-xs text-muted-foreground mt-4">
                Step {currentStep + 1} of {totalSteps - 1}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
