import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User, Link2, Users, CheckCircle2, Upload, ArrowRight, ArrowLeft,
  Instagram, Facebook, Linkedin, Twitter, Plus, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SocialNinjaLogo from "@/components/SocialNinjaLogo";

const steps = [
  { label: "Profile", icon: User },
  { label: "Connect", icon: Link2 },
  { label: "Team", icon: Users },
  { label: "Done", icon: CheckCircle2 },
];

const socialPlatforms = [
  { name: "Instagram", icon: Instagram, color: "text-instagram", connected: false },
  { name: "Facebook", icon: Facebook, color: "text-facebook", connected: false },
  { name: "LinkedIn", icon: Linkedin, color: "text-linkedin", connected: false },
  { name: "Twitter/X", icon: Twitter, color: "text-twitter", connected: false },
];

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);
  const [invitedEmails, setInvitedEmails] = useState<string[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");

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
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      idx <= currentStep
                        ? "gradient-coral text-white shadow-coral"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <step.icon className="h-5 w-5" />
                  </div>
                  <span
                    className={`text-xs mt-1.5 font-medium ${
                      idx <= currentStep ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`w-16 h-0.5 mx-2 rounded-full ${
                      idx < currentStep ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 0: Complete Profile */}
          {currentStep === 0 && (
            <div className="space-y-5 max-w-md mx-auto">
              <div className="text-center">
                <h2 className="text-xl font-bold text-foreground">Complete your profile</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Add a photo and verify your details
                </p>
              </div>

              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-border flex items-center justify-center hover:border-primary cursor-pointer transition-colors shrink-0">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Display Name</label>
                    <input className="input-dark" defaultValue="John Doe" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Job Title</label>
                    <input className="input-dark" placeholder="e.g. Marketing Manager" />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Bio (optional)</label>
                <textarea className="input-dark h-20 py-2 resize-none" placeholder="Tell us a bit about yourself..." />
              </div>
            </div>
          )}

          {/* Step 1: Connect Social Profiles */}
          {currentStep === 1 && (
            <div className="space-y-5 max-w-md mx-auto">
              <div className="text-center">
                <h2 className="text-xl font-bold text-foreground">Connect your social accounts</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Link your social media profiles to start managing them
                </p>
              </div>

              <div className="space-y-3">
                {socialPlatforms.map((platform) => {
                  const isConnected = connectedPlatforms.includes(platform.name);
                  return (
                    <button
                      key={platform.name}
                      onClick={() => togglePlatform(platform.name)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                        isConnected
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/40"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center`}>
                        <platform.icon className={`h-5 w-5 ${platform.color}`} />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-foreground">{platform.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {isConnected ? "Connected ✓" : "Click to connect"}
                        </p>
                      </div>
                      {isConnected && (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      )}
                    </button>
                  );
                })}
              </div>

              <p className="text-xs text-muted-foreground text-center">
                You can connect more accounts later from Settings
              </p>
            </div>
          )}

          {/* Step 2: Invite Team */}
          {currentStep === 2 && (
            <div className="space-y-5 max-w-md mx-auto">
              <div className="text-center">
                <h2 className="text-xl font-bold text-foreground">Invite your team</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Collaborate with your team members on content
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  className="input-dark flex-1"
                  placeholder="colleague@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addInvite()}
                />
                <Button onClick={addInvite} size="sm" className="shrink-0">
                  <Plus className="h-4 w-4" /> Add
                </Button>
              </div>

              {invitedEmails.length > 0 && (
                <div className="space-y-2">
                  {invitedEmails.map((email) => (
                    <div
                      key={email}
                      className="flex items-center justify-between px-3 py-2 bg-muted rounded-lg"
                    >
                      <span className="text-sm text-foreground">{email}</span>
                      <button
                        onClick={() => removeInvite(email)}
                        className="text-muted-foreground hover:text-error"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-xs text-muted-foreground text-center">
                Invites will be sent when you complete setup. You can also invite people later.
              </p>
            </div>
          )}

          {/* Step 3: Done */}
          {currentStep === 3 && (
            <div className="space-y-5 max-w-md mx-auto text-center">
              <div className="w-16 h-16 gradient-coral rounded-full flex items-center justify-center mx-auto shadow-coral">
                <CheckCircle2 className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-foreground">You're all set! 🎉</h2>
              <p className="text-sm text-muted-foreground">
                Your account is ready. Start creating amazing content and growing your social presence.
              </p>

              <div className="bg-muted rounded-xl p-4 text-left space-y-2">
                <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Setup Summary</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                  <span>Profile completed</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className={`h-4 w-4 shrink-0 ${connectedPlatforms.length > 0 ? "text-success" : "text-muted-foreground"}`} />
                  <span>
                    {connectedPlatforms.length > 0
                      ? `${connectedPlatforms.length} social account${connectedPlatforms.length > 1 ? "s" : ""} connected`
                      : "No social accounts connected yet"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className={`h-4 w-4 shrink-0 ${invitedEmails.length > 0 ? "text-success" : "text-muted-foreground"}`} />
                  <span>
                    {invitedEmails.length > 0
                      ? `${invitedEmails.length} team invite${invitedEmails.length > 1 ? "s" : ""} queued`
                      : "No team invites sent"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            {currentStep > 0 && currentStep < 3 ? (
              <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)}>
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Button>
            ) : (
              <div />
            )}

            {currentStep < 3 ? (
              <div className="flex gap-3">
                {currentStep > 0 && (
                  <Button variant="ghost" onClick={() => setCurrentStep(currentStep + 1)}>
                    Skip
                  </Button>
                )}
                <Button onClick={() => setCurrentStep(currentStep + 1)}>
                  Continue <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            ) : (
              <Button
                className="w-full shadow-coral"
                onClick={() => navigate("/agency/dashboard")}
              >
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