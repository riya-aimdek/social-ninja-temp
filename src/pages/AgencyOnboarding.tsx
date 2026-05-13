import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, ArrowRight, ArrowLeft, Building2, ClipboardCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import SocialNinjaLogo from "@/components/SocialNinjaLogo";
import AIWebsiteScanStep, { type ScanResult } from "@/components/onboarding/AIWebsiteScanStep";

type StepKey = "scan" | "agency" | "client" | "team" | "done";

const stepMeta: Record<Exclude<StepKey, "done">, { eyebrow: string; title: string; subtitle: string }> = {
  scan: {
    eyebrow: "STEP 01 OF 05",
    title: "Skip the\nsetup grind.",
    subtitle: "Drop your website and let AI fetch your agency name, logo, and brand details — so you can get to work faster.",
  },
  agency: {
    eyebrow: "STEP 02 OF 05",
    title: "Set up your\nagency.",
    subtitle: "This is your agency's home base — where you'll manage every client, project, and social account in one place.",
  },
  client: {
    eyebrow: "STEP 03 OF 05",
    title: "Add your first\nclient.",
    subtitle: "Each client gets a fully isolated workspace for their brand, projects, and connected social accounts.",
  },
  team: {
    eyebrow: "STEP 04 OF 05",
    title: "Build your team.",
    subtitle: "Invite teammates and assign roles so everyone has the right level of access across your clients.",
  },
};

const roles = [
  {
    id: "agency-admin",
    name: "Agency Admin",
    desc: "Full control. Can create clients, manage billing, and access everything across the agency.",
  },
  {
    id: "agency-account-manager",
    name: "Agency Account Manager",
    desc: "Handles day-to-day work across multiple clients. Cannot access billing or delete clients.",
  },
];

const AgencyOnboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0..4
  const stepKeys: StepKey[] = ["scan", "agency", "client", "team", "done"];
  const current = stepKeys[step];

  // form state
  const [agencyName, setAgencyName] = useState("");
  const [agencyDesc, setAgencyDesc] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientDesc, setClientDesc] = useState("");
  const [memberName, setMemberName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [assignRole, setAssignRole] = useState(true);
  const [selectedRole, setSelectedRole] = useState("account-manager");

  // skipped tracking for done summary
  const [skipped, setSkipped] = useState<Record<string, boolean>>({});

  const goNext = () => setStep((s) => Math.min(s + 1, 4));
  const goBack = () => setStep((s) => Math.max(s - 1, 0));
  const skip = () => {
    if (current === "scan") setSkipped((p) => ({ ...p, scan: true }));
    if (current === "agency") setSkipped((p) => ({ ...p, agency: !agencyName.trim() }));
    if (current === "client") setSkipped((p) => ({ ...p, client: !clientName.trim() }));
    if (current === "team") setSkipped((p) => ({ ...p, team: !memberEmail.trim() }));
    goNext();
  };

  const handleScanComplete = (result: ScanResult) => {
    setAgencyName(result.companyName);
    setAgencyDesc(result.description);
    setSkipped((p) => ({ ...p, scan: false }));
    goNext();
  };

  const continueDisabled =
    (current === "agency" && !agencyName.trim()) ||
    (current === "client" && !clientName.trim());

  const leftCopy = current === "done"
    ? { eyebrow: "STEP 05 OF 05", title: "Ready to go 🚀", subtitle: "Your agency workspace is live. Time to plan, publish, and grow your clients' brands." }
    : stepMeta[current as Exclude<StepKey, "done">];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* LEFT — dark panel */}
      <div className="relative md:w-1/2 bg-[hsl(0_0%_8%)] text-white p-8 md:p-14 flex flex-col justify-between min-h-[280px] md:min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-primary/10 pointer-events-none" />
        <div className="relative z-10">
          <SocialNinjaLogo size="lg" />
        </div>

        <div className="relative z-10 max-w-md">
          <p className="text-primary text-xs font-bold tracking-[0.2em] mb-4">{leftCopy.eyebrow}</p>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight whitespace-pre-line mb-4">
            {leftCopy.title}
          </h1>
          <p className="text-white/70 text-base leading-relaxed">{leftCopy.subtitle}</p>
        </div>

        {/* Progress dots */}
        <div className="relative z-10 flex gap-2">
          {stepKeys.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? "w-10 bg-primary" : i < step ? "w-6 bg-primary/60" : "w-6 bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>

      {/* RIGHT — light card */}
      <div className="md:w-1/2 flex items-center justify-center p-6 md:p-12 bg-gradient-to-br from-orange-50/40 via-background to-rose-50/30">
        <div className="w-full max-w-md bg-card rounded-2xl shadow-card p-8 md:p-10 animate-fade-in">
          {current === "scan" && (
            <AIWebsiteScanStep onSkip={skip} onContinue={handleScanComplete} />
          )}

          {current === "agency" && (
            <>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-foreground">Tell us about your agency</h2>
                <p className="text-sm text-muted-foreground mt-1">This appears on client invites and reports</p>
              </div>
              <div className="flex gap-4 mb-4">
                <button className="w-24 h-24 rounded-xl border-2 border-dashed border-border hover:border-primary flex flex-col items-center justify-center transition-all shrink-0 group">
                  <Upload className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                  <span className="text-[10px] uppercase tracking-wide text-muted-foreground mt-1 text-center px-1">Agency Logo</span>
                </button>
                <div className="flex-1">
                  <label className="text-xs font-semibold tracking-wider text-foreground mb-1.5 block">AGENCY NAME</label>
                  <input
                    className="w-full h-11 px-4 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring focus:border-transparent outline-none"
                    placeholder="e.g. Digital Spark Agency"
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold tracking-wider text-foreground mb-1.5 block">
                  DESCRIPTION <span className="text-muted-foreground font-normal normal-case">(optional)</span>
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring focus:border-transparent outline-none resize-none"
                  placeholder="What does your agency do? (e.g. Full-service social media for D2C brands)"
                  value={agencyDesc}
                  onChange={(e) => setAgencyDesc(e.target.value)}
                />
              </div>
            </>
          )}

          {current === "client" && (
            <>
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-foreground">Create your first client workspace</h2>
                <p className="text-sm text-muted-foreground mt-1">You can add projects and social accounts after this</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold tracking-wider text-foreground mb-1.5 block">CLIENT NAME</label>
                  <input
                    className="w-full h-11 px-4 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring focus:border-transparent outline-none"
                    placeholder="e.g. Bright Studio"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold tracking-wider text-foreground mb-1.5 block">
                    DESCRIPTION <span className="text-muted-foreground font-normal normal-case">(optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring focus:border-transparent outline-none resize-none"
                    placeholder="A short note about this client's brand or industry"
                    value={clientDesc}
                    onChange={(e) => setClientDesc(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          {current === "team" && (
            <>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-foreground">Invite your first teammate</h2>
                <p className="text-sm text-muted-foreground mt-1">They'll get an email to join your agency workspace</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold tracking-wider text-foreground mb-1.5 block">
                    FULL NAME <span className="text-muted-foreground font-normal normal-case">(optional)</span>
                  </label>
                  <input
                    className="w-full h-11 px-4 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring focus:border-transparent outline-none"
                    placeholder="e.g. Jane Doe"
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold tracking-wider text-foreground mb-1.5 block">EMAIL ADDRESS</label>
                  <input
                    type="email"
                    className="w-full h-11 px-4 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring focus:border-transparent outline-none"
                    placeholder="jane@youragency.com"
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <button
                    type="button"
                    onClick={() => setAssignRole(!assignRole)}
                    className={`w-5 h-5 rounded flex items-center justify-center transition-all shrink-0 ${
                      assignRole ? "bg-primary" : "border-2 border-border"
                    }`}
                  >
                    {assignRole && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                  </button>
                  <span className="text-sm font-medium text-foreground">Assign an agency role</span>
                </label>
                {assignRole && (
                  <div className="space-y-2 animate-fade-in">
                    {roles.map((r) => {
                      const active = selectedRole === r.id;
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => setSelectedRole(r.id)}
                          className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                            active ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                          }`}
                        >
                          <p className={`text-sm font-semibold ${active ? "text-primary" : "text-foreground"}`}>{r.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{r.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}

          {current === "done" && (
            <>
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center">
                  <ClipboardCheck className="h-7 w-7 text-amber-600" />
                </div>
              </div>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  {Object.values(skipped).some(Boolean) ? "Almost there" : "Your agency is ready! 🎉"}
                </h2>
                <p className="text-sm text-muted-foreground mt-2">
                  {Object.values(skipped).some(Boolean) ? (
                    <>You skipped a few steps. Finish them anytime to get the most out of <span className="font-semibold text-foreground">{agencyName || "your agency"}</span>.</>
                  ) : (
                    <><span className="font-semibold text-foreground">{agencyName}</span> is set up. Start managing clients, scheduling content, and tracking results.</>
                  )}
                </p>
              </div>
              {Object.values(skipped).some(Boolean) && (
                <div className="flex flex-wrap gap-2 justify-center mb-6">
                  {skipped.agency && <Chip label="Finish agency setup" />}
                  {skipped.client && <Chip label="Add your first client" />}
                  {skipped.team && <Chip label="Invite a teammate" />}
                </div>
              )}
              <Button className="w-full shadow-coral" size="lg" onClick={() => navigate("/agency/dashboard")}>
                {Object.values(skipped).some(Boolean) ? "Go to Dashboard anyway" : "Go to Dashboard"}
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </>
          )}

          {/* Footer nav */}
          {current !== "done" && current !== "scan" && (
            <div className="flex items-center justify-between mt-8">
              {step > 0 ? (
                <button onClick={goBack} className="text-muted-foreground hover:text-foreground transition-colors p-2">
                  <ArrowLeft className="h-4 w-4" />
                </button>
              ) : <div className="w-8" />}
              <div className="flex items-center gap-4">
                <button onClick={skip} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Skip
                </button>
                <Button onClick={goNext} disabled={continueDisabled} size="lg" className="shadow-coral px-6">
                  Continue <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Chip = ({ label }: { label: string }) => (
  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">
    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
    {label}
  </span>
);

export default AgencyOnboarding;
