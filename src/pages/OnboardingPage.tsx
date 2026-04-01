import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  User, Link2, Users, CheckCircle2, Upload, ArrowRight, ArrowLeft,
  Instagram, Facebook, Linkedin, Twitter, Plus, X, Building2, Palette,
  Clock, CalendarDays
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SocialNinjaLogo from "@/components/SocialNinjaLogo";

const socialPlatforms = [
  { name: "Instagram", icon: Instagram, color: "text-instagram" },
  { name: "Facebook", icon: Facebook, color: "text-facebook" },
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
  { label: "Connect", icon: Link2 },
  { label: "Team", icon: Users },
  { label: "Schedule", icon: Clock },
  { label: "Done", icon: CheckCircle2 },
];

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const accountType = searchParams.get("type") || "client";
  const isAgency = accountType === "agency";
  const steps = isAgency ? agencySteps : clientSteps;

  const [currentStep, setCurrentStep] = useState(0);
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);
  const [invitedEmails, setInvitedEmails] = useState<string[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("content-creator");
  const [approvalEnabled, setApprovalEnabled] = useState(false);

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
              {/* Step 0: Agency Setup */}
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
                  <p className="text-xs text-muted-foreground">Your agency logo will appear on white-label reports sent to clients.</p>
                </div>
              )}

              {/* Step 1: Create First Client */}
              {currentStep === 1 && (
                <div className="space-y-5 max-w-md mx-auto">
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-foreground">Create your first client</h2>
                    <p className="text-sm text-muted-foreground mt-1">Each client gets a fully isolated environment</p>
                  </div>
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
                        <option>Real Estate</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-lg border-2 border-dashed border-border flex items-center justify-center hover:border-primary cursor-pointer transition-colors shrink-0">
                        <Upload className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <p className="text-xs text-muted-foreground">Upload client logo (optional)</p>
                    </div>
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <button
                        onClick={() => setApprovalEnabled(!approvalEnabled)}
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${
                          approvalEnabled ? "bg-primary border-primary" : "border-border-hover"
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
              )}

              {/* Step 2: Connect client social profiles */}
              {currentStep === 2 && (
                <div className="space-y-5 max-w-md mx-auto">
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-foreground">Connect client's social accounts</h2>
                    <p className="text-sm text-muted-foreground mt-1">Link the social profiles for this client</p>
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

              {/* Step 3: Invite team to this client */}
              {currentStep === 3 && (
                <div className="space-y-5 max-w-md mx-auto">
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-foreground">Invite team members</h2>
                    <p className="text-sm text-muted-foreground mt-1">Assign roles scoped to this client only</p>
                  </div>
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
                        <div key={email} className="flex items-center justify-between px-3 py-2 bg-muted rounded-lg">
                          <span className="text-sm text-foreground">{email}</span>
                          <button onClick={() => removeInvite(email)} className="text-muted-foreground hover:text-error">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground text-center">Team members will only see this client's data — no cross-client access.</p>
                </div>
              )}

              {/* Step 4: Done */}
              {currentStep === 4 && (
                <div className="space-y-5 max-w-md mx-auto text-center">
                  <div className="w-16 h-16 gradient-coral rounded-full flex items-center justify-center mx-auto shadow-coral">
                    <CheckCircle2 className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">Your agency is ready! 🎉</h2>
                  <p className="text-sm text-muted-foreground">
                    Your Agency Dashboard will show all clients as summary cards. Use the "Add New Client" button to onboard more clients.
                  </p>
                  <div className="bg-muted rounded-xl p-4 text-left space-y-2">
                    <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Setup Summary</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                      <span>Agency workspace created</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                      <span>First client account created</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className={`h-4 w-4 shrink-0 ${connectedPlatforms.length > 0 ? "text-success" : "text-muted-foreground"}`} />
                      <span>{connectedPlatforms.length > 0 ? `${connectedPlatforms.length} social account(s) connected` : "No social accounts connected yet"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className={`h-4 w-4 shrink-0 ${invitedEmails.length > 0 ? "text-success" : "text-muted-foreground"}`} />
                      <span>{invitedEmails.length > 0 ? `${invitedEmails.length} team invite(s) queued` : "No team invites sent"}</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ===== CLIENT / ORGANISATION ONBOARDING ===== */}
          {!isAgency && (
            <>
              {/* Step 0: Brand Setup */}
              {currentStep === 0 && (
                <div className="space-y-5 max-w-md mx-auto">
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-foreground">Set up your brand workspace</h2>
                    <p className="text-sm text-muted-foreground mt-1">Tell us about your brand</p>
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="w-20 h-20 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center hover:border-primary cursor-pointer transition-colors shrink-0">
                      <Upload className="h-5 w-5 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground mt-1">Brand Logo</span>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1 block">Brand Name</label>
                        <input className="input-dark" placeholder="Your brand name" />
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
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1: Connect social profiles */}
              {currentStep === 1 && (
                <div className="space-y-5 max-w-md mx-auto">
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-foreground">Connect your social accounts</h2>
                    <p className="text-sm text-muted-foreground mt-1">Link your profiles to start managing them</p>
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
                            <p className="text-xs text-muted-foreground">{isConnected ? "Connected ✓" : "Click to connect"}</p>
                          </div>
                          {isConnected && <CheckCircle2 className="h-5 w-5 text-primary" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 2: Invite team */}
              {currentStep === 2 && (
                <div className="space-y-5 max-w-md mx-auto">
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-foreground">Invite your team</h2>
                    <p className="text-sm text-muted-foreground mt-1">Collaborate on content with your team</p>
                  </div>
                  <div className="flex gap-2">
                    <input
                      className="input-dark flex-1"
                      placeholder="colleague@company.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addInvite()}
                    />
                    <select className="input-dark w-28" value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}>
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="content-creator">Creator</option>
                      <option value="analyst">Analyst</option>
                      <option value="viewer">Viewer</option>
                    </select>
                    <Button onClick={addInvite} size="sm" className="shrink-0">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {invitedEmails.length > 0 && (
                    <div className="space-y-2">
                      {invitedEmails.map((email) => (
                        <div key={email} className="flex items-center justify-between px-3 py-2 bg-muted rounded-lg">
                          <span className="text-sm text-foreground">{email}</span>
                          <button onClick={() => removeInvite(email)} className="text-muted-foreground hover:text-error">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground text-center">You can invite more people later from Settings.</p>
                </div>
              )}

              {/* Step 3: Configure publishing schedule */}
              {currentStep === 3 && (
                <div className="space-y-5 max-w-md mx-auto">
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-foreground">Set your publishing schedule</h2>
                    <p className="text-sm text-muted-foreground mt-1">Configure default time slots for auto-scheduling posts</p>
                  </div>
                  <div className="space-y-3">
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
                      <div key={day} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <span className="text-sm font-medium text-foreground w-24">{day}</span>
                        <div className="flex gap-2 flex-1">
                          <input className="input-dark text-xs py-1.5 w-24" type="time" defaultValue="09:00" />
                          <input className="input-dark text-xs py-1.5 w-24" type="time" defaultValue="12:00" />
                          <input className="input-dark text-xs py-1.5 w-24" type="time" defaultValue="17:00" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground text-center">You can customise this per profile later.</p>
                </div>
              )}

              {/* Step 4: Done */}
              {currentStep === 4 && (
                <div className="space-y-5 max-w-md mx-auto text-center">
                  <div className="w-16 h-16 gradient-coral rounded-full flex items-center justify-center mx-auto shadow-coral">
                    <CheckCircle2 className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">You're all set! 🎉</h2>
                  <p className="text-sm text-muted-foreground">
                    Your Brand Dashboard is ready — start creating content, scheduling posts, and growing your social presence.
                  </p>
                  <div className="bg-muted rounded-xl p-4 text-left space-y-2">
                    <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Setup Summary</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                      <span>Brand workspace created</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className={`h-4 w-4 shrink-0 ${connectedPlatforms.length > 0 ? "text-success" : "text-muted-foreground"}`} />
                      <span>{connectedPlatforms.length > 0 ? `${connectedPlatforms.length} social account(s) connected` : "No social accounts connected yet"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className={`h-4 w-4 shrink-0 ${invitedEmails.length > 0 ? "text-success" : "text-muted-foreground"}`} />
                      <span>{invitedEmails.length > 0 ? `${invitedEmails.length} team invite(s) queued` : "No team invites sent"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                      <span>Publishing schedule configured</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            {currentStep > 0 && currentStep < steps.length - 1 ? (
              <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)}>
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Button>
            ) : (
              <div />
            )}

            {currentStep < steps.length - 1 ? (
              <div className="flex gap-3">
                {currentStep > 0 && (
                  <Button variant="ghost" onClick={() => setCurrentStep(currentStep + 1)}>Skip</Button>
                )}
                <Button onClick={() => setCurrentStep(currentStep + 1)}>
                  Continue <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            ) : (
              <Button className="w-full shadow-coral" onClick={() => navigate(dashboardPath)}>
                Go to {isAgency ? "Agency" : "Brand"} Dashboard <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
