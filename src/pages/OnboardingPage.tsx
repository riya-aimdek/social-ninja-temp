import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  User, Link2, Users, CheckCircle2, Upload, ArrowRight, ArrowLeft,
  Instagram, Facebook, Linkedin, Twitter, Plus, X, Building2, Palette,
  Clock, CalendarDays, FolderOpen, BarChart3, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SocialNinjaLogo from "@/components/SocialNinjaLogo";

const socialPlatforms = [
  { name: "Facebook", icon: Facebook, color: "text-facebook" },
  { name: "Instagram", icon: Instagram, color: "text-instagram" },
  { name: "LinkedIn", icon: Linkedin, color: "text-linkedin" },
  { name: "Twitter/X", icon: Twitter, color: "text-twitter" },
];

const agencySteps = [
  { label: "Agency", icon: Building2 },
  { label: "First Business", icon: Users },
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
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);
  const [invitedEmails, setInvitedEmails] = useState<string[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("content-creator");
  const [approvalEnabled, setApprovalEnabled] = useState(false);
  const [clientName, setClientName] = useState("");
  const [industry, setIndustry] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");

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

  const dashboardPath = isAgency ? "/agency/dashboard" : "/client/dashboard";
  const totalSteps = steps.length;

  return (
    <div className="min-h-screen gradient-mesh bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl animate-fade-in">
        <div className="bg-card rounded-2xl shadow-card p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <SocialNinjaLogo size="lg" />
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-center gap-0 mb-8">
            {steps.map((step, idx) => (
              <div key={step.label} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    idx <= currentStep ? "gradient-coral text-white shadow-coral" : "bg-muted text-muted-foreground"
                  }`}>
                    <step.icon className="h-5 w-5" />
                  </div>
                  <span className={`text-xs mt-1.5 font-medium ${idx <= currentStep ? "text-foreground" : "text-muted-foreground"}`}>
                    {step.label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-1.5 rounded-full ${idx < currentStep ? "bg-primary" : "bg-border"}`} />
                )}
              </div>
            ))}
          </div>

          {/* ===== AGENCY ONBOARDING ===== */}
          {isAgency && (
            <>
              {currentStep === 0 && (
                <div className="space-y-5 max-w-md mx-auto">
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-foreground">Set up your agency workspace</h2>
                    <p className="text-sm text-muted-foreground mt-1">This will be your agency's home base</p>
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="w-20 h-20 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center hover:border-primary cursor-pointer transition-colors shrink-0">
                      <Upload className="h-5 w-5 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground mt-1">Agency Logo</span>
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
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-5 max-w-md mx-auto">
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-foreground">Create your first business</h2>
                    <p className="text-sm text-muted-foreground mt-1">Each client gets a fully isolated environment</p>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Business Name</label>
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
                    <div className="bg-muted rounded-lg p-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <button
                          onClick={() => setApprovalEnabled(!approvalEnabled)}
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${
                            approvalEnabled ? "bg-primary border-primary" : "border-border"
                          }`}
                        >
                          {approvalEnabled && <CheckCircle2 className="h-3 w-3 text-white" />}
                        </button>
                        <div>
                          <p className="text-sm font-medium text-foreground">Enable business approval workflow</p>
                          <p className="text-xs text-muted-foreground">Businesses can review and approve content before publishing</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-5 max-w-md mx-auto">
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-foreground">Connect business's social accounts</h2>
                    <p className="text-sm text-muted-foreground mt-1">Link the social profiles for this business</p>
                  </div>
                  <div className="space-y-3">
                    {socialPlatforms.map((platform) => {
                      const isConnected = connectedPlatforms.includes(platform.name);
                      return (
                        <button
                          key={platform.name}
                          onClick={() => togglePlatform(platform.name)}
                          className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                            isConnected ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                          }`}
                        >
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                            <platform.icon className={`h-5 w-5 ${platform.color}`} />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="text-sm font-medium text-foreground">{platform.name}</p>
                            <p className="text-xs text-muted-foreground">{isConnected ? "Connected ✓" : "Click to connect via OAuth"}</p>
                          </div>
                          {isConnected && <CheckCircle2 className="h-5 w-5 text-primary" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-5 max-w-md mx-auto">
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-foreground">Invite team members</h2>
                    <p className="text-sm text-muted-foreground mt-1">Assign roles scoped to this business only</p>
                  </div>
                  <div className="flex gap-2">
                    <input className="input-dark flex-1" placeholder="colleague@agency.com" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addInvite()} />
                    <select className="input-dark w-36" value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}>
                      <option value="account-manager">Account Manager</option>
                      <option value="content-creator">Content Creator</option>
                      <option value="approver">Approver</option>
                      <option value="analyst">Analyst</option>
                    </select>
                    <Button onClick={addInvite} size="sm" className="shrink-0"><Plus className="h-4 w-4" /></Button>
                  </div>
                  {invitedEmails.length > 0 && (
                    <div className="space-y-2">
                      {invitedEmails.map((email) => (
                        <div key={email} className="flex items-center justify-between px-3 py-2 bg-muted rounded-lg">
                          <span className="text-sm text-foreground">{email}</span>
                          <button onClick={() => removeInvite(email)} className="text-muted-foreground hover:text-destructive"><X className="h-4 w-4" /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-5 max-w-md mx-auto text-center">
                  <div className="w-16 h-16 gradient-coral rounded-full flex items-center justify-center mx-auto shadow-coral">
                    <CheckCircle2 className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">Your agency is ready! 🎉</h2>
                  <p className="text-sm text-muted-foreground">Start managing businesses, scheduling content, and growing brands.</p>
                </div>
              )}
            </>
          )}

          {/* ===== BUSINESS ONBOARDING (4 steps: Brand → Project → Connect → Done) ===== */}
          {!isAgency && (
            <>
              {/* Step 0: Brand Setup */}
              {currentStep === 0 && (
                <div className="space-y-5 max-w-md mx-auto">
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-foreground">Set up your brand workspace</h2>
                    <p className="text-sm text-muted-foreground mt-1">Tell us about your brand</p>
                  </div>
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
                </div>
              )}

              {/* Step 1: Create First Project */}
              {currentStep === 1 && (
                <div className="space-y-5 max-w-md mx-auto">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <FolderOpen className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground">Create your first project</h2>
                    <p className="text-sm text-muted-foreground mt-1">Projects help you organize your social media presence.</p>
                  </div>
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
                </div>
              )}

              {/* Step 2: Connect Social Accounts */}
              {currentStep === 2 && (
                <div className="space-y-5 max-w-md mx-auto">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <Link2 className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground">Connect social accounts</h2>
                    <p className="text-sm text-muted-foreground mt-1">Link your social profiles to this project's social channel.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {socialPlatforms.map((platform) => {
                      const isConnected = connectedPlatforms.includes(platform.name);
                      return (
                        <button
                          key={platform.name}
                          onClick={() => togglePlatform(platform.name)}
                          className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                            isConnected ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                          }`}
                        >
                          <platform.icon className={`h-5 w-5 ${platform.color}`} />
                          <span className="text-sm font-medium text-foreground">{platform.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 3: Done */}
              {currentStep === 3 && (
                <div className="space-y-6 max-w-md mx-auto text-center">
                  <div className="w-16 h-16 gradient-coral rounded-full flex items-center justify-center mx-auto shadow-coral">
                    <CheckCircle2 className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">You're all set!</h2>
                  <p className="text-sm text-muted-foreground">
                    Dive in, it's ready to go.
                  </p>

                  {/* Quick action icons */}
                  <div className="flex justify-center gap-8 mt-4">
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <span className="text-xs text-muted-foreground">Analyze</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <span className="text-xs text-muted-foreground">Create</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                        <CalendarDays className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <span className="text-xs text-muted-foreground">Publish</span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mt-2">
                    <a href="/client/team" className="text-primary hover:underline">+ Add team members</a>
                  </p>
                </div>
              )}
            </>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            {currentStep > 0 && currentStep < totalSteps - 1 ? (
              <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)}>
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Button>
            ) : (
              <div />
            )}

            {currentStep < totalSteps - 1 ? (
              <div className="flex gap-3">
                {currentStep > 0 && (
                  <Button variant="ghost" onClick={() => setCurrentStep(currentStep + 1)}>Skip for now</Button>
                )}
                <Button onClick={() => setCurrentStep(currentStep + 1)}>
                  Continue <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            ) : (
              <Button className="w-full shadow-coral" onClick={() => navigate(dashboardPath)}>
                Go to Dashboard <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
