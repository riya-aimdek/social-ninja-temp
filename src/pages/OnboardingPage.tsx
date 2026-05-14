import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check, ChevronRight, ChevronLeft, Upload,
  FolderOpen, Link2, Sparkles, MessageCircle, BarChart3, FileText, Zap,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

/* ── Step metadata ─────────────────────────────────────────────── */
const STEP_META = [
  {
    tag: "01",
    headline: "Your brand\nstarts here.",
    sub: "Set up your identity so the world recognises you instantly.",
  },
  {
    tag: "02",
    headline: "Organise\nyour world.",
    sub: "Projects keep your campaigns, accounts & content tidy.",
  },
  {
    tag: "03",
    headline: "Go where your\naudience lives.",
    sub: "Connect the platforms that matter most to your growth.",
  },
  {
    tag: "04",
    headline: "Ready to\nlaunch 🚀",
    sub: "Everything's connected. Time to make some noise.",
  },
];

/* ── Social platforms ──────────────────────────────────────────── */
const SOCIALS = [
  { id: "facebook",  label: "Facebook",  letter: "f",  gradient: "from-blue-500 to-blue-600" },
  { id: "instagram", label: "Instagram", letter: "ig", gradient: "from-pink-500 to-purple-500" },
  { id: "linkedin",  label: "LinkedIn",  letter: "in", gradient: "from-sky-500 to-sky-600" },
  { id: "twitter",   label: "Twitter/X", letter: "X",  gradient: "from-zinc-700 to-zinc-900" },
];

/* ── Page ──────────────────────────────────────────────────────── */
const OnboardingPage = () => {
  const navigate = useNavigate();

  const [current, setCurrent]             = useState(0);
  const [businessName, setBusinessName]   = useState("");
  const [businessDesc, setBusinessDesc]   = useState("");
  const [industry, setIndustry]           = useState("");
  const [projectName, setProjectName]     = useState("");
  const [projectDesc, setProjectDesc]     = useState("");
  const [connectedSocials, setConnectedSocials] = useState<string[]>([]);

  const toggleSocial = (id: string) =>
    setConnectedSocials((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );

  const finish = () => navigate("/client/dashboard");
  const next   = () => setCurrent((c) => Math.min(c + 1, 3));
  const back   = () => setCurrent((c) => Math.max(c - 1, 0));
  const meta   = STEP_META[current];

  return (
    <div className="min-h-screen flex bg-background">

      {/* ── LEFT PANEL ─────────────────────────────────────────── */}
      <div className="hidden md:flex w-[42%] relative overflow-hidden flex-col justify-between p-10"
        style={{ background: "#0f0e1a" }}>

        {/* Decorative blurs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl"
          style={{ background: "hsla(var(--primary)/0.18)" }} />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full blur-3xl"
          style={{ background: "hsla(var(--primary)/0.10)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border"
          style={{ borderColor: "rgba(255,255,255,0.04)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full border"
          style={{ borderColor: "rgba(255,255,255,0.03)" }} />

        {/* Logo */}
        <div className="relative z-10">
          <span className="text-xl font-bold" style={{ color: "rgba(255,255,255,0.90)" }}>Social</span>
          <span className="text-xl font-bold text-primary">Ninja</span>
        </div>

        {/* Copy */}
        <div className="relative z-10 flex-1 flex flex-col justify-center -mt-8">
          <span className="text-xs font-semibold tracking-[0.25em] uppercase text-primary mb-4">
            Step {meta.tag} of 04
          </span>
          <h1
            className="font-extrabold leading-[1.1] tracking-tight whitespace-pre-line"
            style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", color: "#fff" }}
          >
            {meta.headline}
          </h1>
          <p className="mt-4 leading-relaxed max-w-[320px]"
            style={{ fontSize: 15, color: "rgba(255,255,255,0.50)" }}>
            {meta.sub}
          </p>
        </div>

        {/* Step pills */}
        <div className="relative z-10 flex gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-1.5 rounded-full transition-all duration-500"
              style={{
                width: i === current ? 40 : 24,
                background:
                  i === current ? "hsl(var(--primary))"
                  : i < current  ? "hsla(var(--primary)/0.50)"
                  : "rgba(255,255,255,0.10)",
              }}
            />
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL ────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 overflow-y-auto"
        style={{ background: "#f8f8f8" }}>
        <div className="w-full max-w-[440px]">

          {/* Mobile header */}
          <div className="md:hidden flex items-center justify-between mb-8">
            <div>
              <span className="text-lg font-bold text-foreground">Social</span>
              <span className="text-lg font-bold text-primary">Ninja</span>
            </div>
            <span className="text-xs font-medium text-muted-foreground tracking-wider">
              {current + 1}/4
            </span>
          </div>

          {/* ── Step 1: Brand ─────────────────────────────────── */}
          {current === 0 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4"
                  style={{ background: "hsla(var(--primary)/0.10)", color: "hsl(var(--primary))" }}>
                  <Sparkles className="w-3 h-3" /> Let's begin
                </div>
                <h2 className="text-2xl font-bold tracking-tight" style={{ color: "#1a1a2e" }}>
                  Set up your business workspace
                </h2>
                <p className="text-sm text-muted-foreground mt-1.5">
                  Tell us about your business to personalise your experience.
                </p>
              </div>

              {/* Logo + business name */}
              <div className="flex items-start gap-4">
                <button className="group flex-shrink-0 w-[84px] h-[84px] rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1.5 hover:border-primary/40 hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary bg-white">
                  <Upload className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-medium">Brand Logo</span>
                </button>
                <div className="flex-1 space-y-1.5">
                  <label className="text-sm font-medium" style={{ color: "#1a1a2e" }}>Business Name</label>
                  <Input
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Acme Inc."
                    className="h-11 rounded-xl bg-white border-border/60"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium" style={{ color: "#1a1a2e" }}>
                  Description <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <Textarea
                  value={businessDesc}
                  onChange={(e) => setBusinessDesc(e.target.value)}
                  placeholder="Brief description of your business"
                  rows={3}
                  className="resize-none rounded-xl bg-white border-border/60"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium" style={{ color: "#1a1a2e" }}>Industry</label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger className="h-11 rounded-xl bg-white border-border/60">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tech">Technology</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="health">Healthcare</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* ── Step 2: Project ───────────────────────────────── */}
          {current === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
              <div>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: "hsla(var(--primary)/0.10)" }}>
                  <FolderOpen className="w-7 h-7 text-primary" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight" style={{ color: "#1a1a2e" }}>
                  Create your first project
                </h2>
                <p className="text-sm text-muted-foreground mt-1.5">
                  Projects help you organise your social accounts &amp; content.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium" style={{ color: "#1a1a2e" }}>
                  Project Name <span className="text-primary">*</span>
                </label>
                <Input
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. Main Brand, Q3 Campaign"
                  className="h-11 rounded-xl bg-white border-border/60"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium" style={{ color: "#1a1a2e" }}>
                  Description <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <Textarea
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  placeholder="What is this project about?"
                  rows={3}
                  className="resize-none rounded-xl bg-white border-border/60"
                />
              </div>

              {/* Tip */}
              <div className="flex items-start gap-3 p-4 rounded-xl"
                style={{ background: "hsla(var(--primary)/0.05)", border: "1px solid hsla(var(--primary)/0.10)" }}>
                <Zap className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <span className="font-semibold" style={{ color: "#1a1a2e" }}>Pro tip:</span>{" "}
                  Create separate projects for each brand or campaign to keep analytics clean.
                </p>
              </div>
            </div>
          )}

          {/* ── Step 3: Connect ───────────────────────────────── */}
          {current === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
              <div>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: "hsla(var(--primary)/0.10)" }}>
                  <Link2 className="w-7 h-7 text-primary" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight" style={{ color: "#1a1a2e" }}>
                  Connect social accounts
                </h2>
                <p className="text-sm text-muted-foreground mt-1.5">
                  Link your social profiles to start publishing and tracking.
                </p>
              </div>

              <div className="space-y-3">
                {SOCIALS.map((s) => {
                  const connected = connectedSocials.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      onClick={() => toggleSocial(s.id)}
                      className="w-full flex items-center gap-4 p-4 rounded-2xl border transition-all group bg-white"
                      style={{
                        borderColor: connected ? "hsl(var(--primary))" : "#e5e7eb",
                        background: connected ? "hsla(var(--primary)/0.04)" : "#fff",
                        boxShadow: connected ? "0 0 0 1px hsla(var(--primary)/0.15)" : undefined,
                      }}
                    >
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center text-white text-xs font-bold shadow-lg`}>
                        {s.letter}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-semibold" style={{ color: "#1a1a2e" }}>{s.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {connected ? "Connected" : "Click to connect"}
                        </p>
                      </div>
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center transition-all"
                        style={{
                          background: connected ? "hsl(var(--primary))" : "transparent",
                          border: connected ? "none" : "2px solid #d1d5db",
                          transform: connected ? "scale(1)" : "scale(0.9)",
                        }}
                      >
                        {connected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Step 4: Done ──────────────────────────────────── */}
          {current === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6 text-center">
              <div>
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{
                    background: "hsla(142,72%,50%,0.15)",
                    boxShadow: "0 0 0 12px hsla(142,72%,50%,0.05)",
                  }}
                >
                  <Check className="w-9 h-9" style={{ color: "hsl(142,72%,40%)" }} strokeWidth={2.5} />
                </div>
                <h2 className="text-2xl font-bold tracking-tight" style={{ color: "#1a1a2e" }}>
                  You're all set!
                </h2>
                <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
                  <span className="font-semibold" style={{ color: "#1a1a2e" }}>
                    {businessName || "Your business"}
                  </span>{" "}
                  is ready to go. Start publishing, engaging, and growing.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: FileText,     label: "Publish", desc: "Schedule posts", color: "#3b82f6" },
                  { icon: MessageCircle, label: "Engage",  desc: "Manage inbox",   color: "#8b5cf6" },
                  { icon: BarChart3,    label: "Analyze", desc: "Track growth",   color: "#10b981" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col items-center gap-2 p-5 rounded-2xl border bg-white transition-all cursor-pointer hover:shadow-lg hover:-translate-y-0.5"
                    style={{ borderColor: "#e5e7eb" }}
                  >
                    <item.icon className="w-6 h-6" style={{ color: item.color }} />
                    <span className="text-sm font-semibold" style={{ color: "#1a1a2e" }}>{item.label}</span>
                    <span className="text-[11px] text-muted-foreground">{item.desc}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={finish}
                className="w-full h-12 rounded-2xl font-semibold text-sm flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90"
                style={{
                  background: "hsl(var(--primary))",
                  color: "#fff",
                  boxShadow: "0 8px 24px hsla(var(--primary)/0.25)",
                }}
              >
                Go to Dashboard <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate("/client/settings/team")}
                className="text-sm font-medium hover:underline"
                style={{ color: "hsl(var(--primary))" }}
              >
                + Add team members
              </button>
            </div>
          )}

          {/* ── Navigation ────────────────────────────────────── */}
          {current < 3 && (
            <div className="flex items-center justify-between mt-10">
              {current > 0 ? (
                <button
                  onClick={back}
                  className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-4">
                <button
                  onClick={next}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Skip
                </button>
                <button
                  onClick={next}
                  className="flex items-center gap-1.5 h-11 px-7 rounded-2xl text-sm font-semibold transition-opacity hover:opacity-90"
                  style={{
                    background: "hsl(var(--primary))",
                    color: "#fff",
                    boxShadow: "0 4px 12px hsla(var(--primary)/0.20)",
                  }}
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
