import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload, ArrowRight, ArrowLeft, FolderOpen, Link2,
  ClipboardCheck, Sparkles, Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SocialNinjaLogo from "@/components/SocialNinjaLogo";

/* ── Types ─────────────────────────────────────────────────────── */
type StepKey = "brand" | "project" | "connect" | "done";

/* ── Left-panel copy ───────────────────────────────────────────── */
const STEP_META: Record<StepKey, { eyebrow: string; title: string; subtitle: string }> = {
  brand: {
    eyebrow: "STEP 01 OF 04",
    title: "Your brand\nstarts here.",
    subtitle: "Set up your identity so your audience recognises you the moment they land on your profiles.",
  },
  project: {
    eyebrow: "STEP 02 OF 04",
    title: "Organise\nyour world.",
    subtitle: "Projects keep your campaigns, social accounts, and scheduled content in one clean place.",
  },
  connect: {
    eyebrow: "STEP 03 OF 04",
    title: "Go where your\naudience lives.",
    subtitle: "Connect the platforms that matter most. You can always add more later from Settings.",
  },
  done: {
    eyebrow: "STEP 04 OF 04",
    title: "Ready to\nlaunch 🚀",
    subtitle: "Your workspace is live. Start creating content, publishing posts, and tracking your growth.",
  },
};

/* ── Social platforms (4 only for 2×2 grid) ───────────────────── */
const SOCIALS = [
  { id: "facebook",  label: "Facebook",  letter: "f",  bg: "#1877F2" },
  { id: "instagram", label: "Instagram", letter: "ig", bg: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" },
  { id: "linkedin",  label: "LinkedIn",  letter: "in", bg: "#0A66C2" },
  { id: "twitter",   label: "Twitter/X", letter: "X",  bg: "#000000" },
];

/* ── Chip (done-step skip reminder) ────────────────────────────── */
const AmberChip = ({ label }: { label: string }) => (
  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">
    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
    {label}
  </span>
);

/* ── Field label ───────────────────────────────────────────────── */
const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="text-xs font-semibold tracking-wider text-foreground mb-1.5 block uppercase">
    {children}
  </label>
);

const inputCls =
  "w-full h-11 px-4 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring focus:border-transparent outline-none text-sm";

/* ── Page ──────────────────────────────────────────────────────── */
const ClientOnboarding = () => {
  const navigate = useNavigate();

  const stepKeys: StepKey[] = ["brand", "project", "connect", "done"];
  const [step, setStep] = useState(0);
  const current = stepKeys[step];

  /* form state */
  const [businessName, setBusinessName] = useState("");
  const [businessDesc, setBusinessDesc] = useState("");
  const [industry, setIndustry]         = useState("");
  const [projectName, setProjectName]   = useState("");
  const [projectDesc, setProjectDesc]   = useState("");
  const [connected, setConnected]       = useState<string[]>([]);
  const [skipped, setSkipped]           = useState<Record<string, boolean>>({});

  const toggleConnect = (id: string) =>
    setConnected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);

  const goNext = () => setStep((s) => Math.min(s + 1, stepKeys.length - 1));
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const skip = () => {
    if (current === "brand")   setSkipped((p) => ({ ...p, brand:   !businessName.trim() }));
    if (current === "project") setSkipped((p) => ({ ...p, project: !projectName.trim() }));
    if (current === "connect") setSkipped((p) => ({ ...p, connect: connected.length === 0 }));
    goNext();
  };

  const continueDisabled =
    (current === "brand"   && !businessName.trim()) ||
    (current === "project" && !projectName.trim());

  const meta = STEP_META[current];
  const anySkipped = Object.values(skipped).some(Boolean);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">

      {/* ── LEFT DARK PANEL ──────────────────────────────────── */}
      <div className="relative md:w-[42%] bg-[hsl(0_0%_8%)] text-white p-8 md:p-14 flex flex-col justify-between min-h-[260px] md:min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-primary/10 pointer-events-none" />

        {/* Decorative rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-white/[0.04]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[460px] h-[460px] rounded-full border border-white/[0.025]" />

        {/* Logo */}
        <div className="relative z-10">
          <SocialNinjaLogo size="lg" />
        </div>

        {/* Copy */}
        <div className="relative z-10 max-w-md">
          <p className="text-primary text-xs font-bold tracking-[0.2em] mb-4">{meta.eyebrow}</p>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight whitespace-pre-line mb-4">
            {meta.title}
          </h1>
          <p className="text-white/70 text-base leading-relaxed">{meta.subtitle}</p>
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

      {/* ── RIGHT LIGHT PANEL ────────────────────────────────── */}
      <div className="md:w-[58%] flex items-center justify-center p-6 md:p-12 bg-gradient-to-br from-orange-50/40 via-background to-rose-50/30">
        <div className="w-full max-w-md bg-card rounded-2xl shadow-card p-8 md:p-10 animate-fade-in">

          {/* ── BRAND step ─────────────────────────────────── */}
          {current === "brand" && (
            <>
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Set up your brand</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  This is how your business will appear across the platform
                </p>
              </div>

              <div className="flex gap-4 mb-4">
                <button className="w-24 h-24 rounded-xl border-2 border-dashed border-border hover:border-primary flex flex-col items-center justify-center transition-all shrink-0 group bg-muted/20">
                  <Upload className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                  <span className="text-[10px] uppercase tracking-wide text-muted-foreground mt-1 text-center px-1 group-hover:text-primary transition-colors">
                    Brand Logo
                  </span>
                </button>
                <div className="flex-1">
                  <FieldLabel>Business Name <span className="text-primary normal-case font-normal tracking-normal">*</span></FieldLabel>
                  <input
                    className={inputCls}
                    placeholder="e.g. Acme Corp"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-4">
                <FieldLabel>Industry</FieldLabel>
                <select
                  className={inputCls}
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                >
                  <option value="">Select industry</option>
                  <option value="retail">Retail &amp; E-commerce</option>
                  <option value="tech">Technology &amp; SaaS</option>
                  <option value="health">Healthcare &amp; Wellness</option>
                  <option value="food">Food &amp; Beverage</option>
                  <option value="finance">Finance &amp; Fintech</option>
                  <option value="education">Education</option>
                  <option value="real-estate">Real Estate</option>
                  <option value="hospitality">Hospitality &amp; Travel</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <FieldLabel>
                  Description <span className="text-muted-foreground font-normal normal-case tracking-normal">(optional)</span>
                </FieldLabel>
                <textarea
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring focus:border-transparent outline-none resize-none text-sm"
                  placeholder="What does your business do? A quick summary helps personalise your experience."
                  value={businessDesc}
                  onChange={(e) => setBusinessDesc(e.target.value)}
                />
              </div>
            </>
          )}

          {/* ── PROJECT step ───────────────────────────────── */}
          {current === "project" && (
            <>
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <FolderOpen className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-foreground">Create your first project</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Group your social accounts, posts, and analytics under one project
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <FieldLabel>Project Name <span className="text-primary normal-case font-normal tracking-normal">*</span></FieldLabel>
                  <input
                    className={inputCls}
                    placeholder="e.g. Main Brand, Q3 Campaign, Product Launch"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                </div>
                <div>
                  <FieldLabel>
                    Description <span className="text-muted-foreground font-normal normal-case tracking-normal">(optional)</span>
                  </FieldLabel>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring focus:border-transparent outline-none resize-none text-sm"
                    placeholder="What is this project about? (e.g. All social channels for the main brand)"
                    value={projectDesc}
                    onChange={(e) => setProjectDesc(e.target.value)}
                  />
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <span className="font-semibold text-foreground">Pro tip:</span>{" "}
                    Create one project per brand or campaign to keep analytics clean and separate.
                  </p>
                </div>
              </div>
            </>
          )}

          {/* ── CONNECT step (2×2 grid) ─────────────────────── */}
          {current === "connect" && (
            <>
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Link2 className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-foreground">Connect social accounts</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Link your social profiles to the project you just created
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {SOCIALS.map((s) => {
                  const isConnected = connected.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => toggleConnect(s.id)}
                      className="relative flex flex-col items-center justify-center gap-2 p-5 rounded-xl border-2 text-center transition-all"
                      style={{
                        borderColor: isConnected ? "hsl(var(--primary))" : "hsl(var(--border))",
                        background: isConnected ? "hsla(var(--primary)/0.04)" : "hsl(var(--card))",
                      }}
                    >
                      {/* Connected checkmark */}
                      {isConnected && (
                        <div
                          className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ background: "hsl(var(--primary))" }}
                        >
                          <Check className="w-3 h-3 text-white" strokeWidth={3} />
                        </div>
                      )}

                      {/* Letter badge */}
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                        style={{ background: s.bg }}
                      >
                        {s.letter}
                      </div>

                      {/* Name */}
                      <p className={`text-sm font-semibold leading-tight ${isConnected ? "text-primary" : "text-foreground"}`}>
                        {s.label}
                      </p>

                      {/* Sub-label */}
                      <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                        {isConnected ? "Connected" : "Click to connect"}
                      </p>
                    </button>
                  );
                })}
              </div>

              {connected.length > 0 && (
                <p className="text-xs text-primary font-medium mt-3 text-center">
                  {connected.length} account{connected.length > 1 ? "s" : ""} selected
                </p>
              )}
            </>
          )}

          {/* ── DONE step ──────────────────────────────────── */}
          {current === "done" && (
            <>
              <div className="flex justify-center mb-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{
                    background: anySkipped ? "hsla(38,92%,50%,0.12)" : "hsla(142,72%,50%,0.12)",
                    boxShadow: anySkipped
                      ? "0 0 0 10px hsla(38,92%,50%,0.06)"
                      : "0 0 0 10px hsla(142,72%,50%,0.05)",
                  }}
                >
                  {anySkipped ? (
                    <ClipboardCheck className="h-8 w-8" style={{ color: "hsl(38,92%,45%)" }} strokeWidth={2} />
                  ) : (
                    <Check className="h-8 w-8" style={{ color: "hsl(142,72%,40%)" }} strokeWidth={2.5} />
                  )}
                </div>
              </div>

              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  {anySkipped ? "Complete your setup" : `${businessName || "Your workspace"} is ready! 🎉`}
                </h2>
                <p className="text-sm text-muted-foreground mt-2">
                  {anySkipped ? (
                    <>
                      You skipped a few steps. Finish them to get the most out of{" "}
                      <span className="font-semibold text-foreground">{businessName || "your workspace"}</span>.
                    </>
                  ) : (
                    <>
                      <span className="font-semibold text-foreground">{businessName || "Your business"}</span>{" "}
                      is set up. Start creating content, scheduling posts, and tracking your growth.
                    </>
                  )}
                </p>
              </div>

              {anySkipped && (
                <div className="flex flex-wrap gap-2 justify-center mb-6">
                  {skipped.brand   && <AmberChip label="Brand setup"             />}
                  {skipped.project && <AmberChip label="Create a project"        />}
                  {skipped.connect && <AmberChip label="Connect social accounts" />}
                </div>
              )}

              {/* Summary when all done */}
              {!anySkipped && (
                <div className="rounded-xl border border-border bg-muted/30 divide-y divide-border mb-6 text-sm">
                  {businessName && (
                    <div className="flex items-center justify-between px-4 py-3">
                      <span className="text-muted-foreground">Business</span>
                      <span className="font-medium text-foreground">{businessName}</span>
                    </div>
                  )}
                  {projectName && (
                    <div className="flex items-center justify-between px-4 py-3">
                      <span className="text-muted-foreground">Project</span>
                      <span className="font-medium text-foreground">{projectName}</span>
                    </div>
                  )}
                  {connected.length > 0 && (
                    <div className="flex items-center justify-between px-4 py-3">
                      <span className="text-muted-foreground">Connected</span>
                      <span className="font-medium text-foreground">{connected.length} account{connected.length > 1 ? "s" : ""}</span>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={() => navigate("/client/dashboard")}
                className="w-full h-12 rounded-full font-semibold text-sm text-white flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90"
                style={{ background: "#FD5C63" }}
              >
                {anySkipped ? "Go to Dashboard anyway" : "Go to Dashboard"}
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="text-center mt-4">
                <button
                  onClick={() => navigate("/client/settings/team")}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  + Add team members
                </button>
              </div>
            </>
          )}

          {/* ── Navigation ─────────────────────────────────── */}
          {current !== "done" && (
            <div className="flex items-center justify-between mt-8">
              {step > 0 ? (
                <button
                  onClick={goBack}
                  className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-muted"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
              ) : (
                <div className="w-8" />
              )}

              <div className="flex items-center gap-4">
                <button
                  onClick={skip}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Skip
                </button>
                <Button
                  onClick={goNext}
                  disabled={continueDisabled}
                  size="lg"
                  className="shadow-coral px-6"
                >
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

export default ClientOnboarding;
