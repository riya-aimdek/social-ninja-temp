import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Check, ChevronRight, ChevronLeft, RefreshCw, AlertCircle, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const AI_TONES = [
  "Professional/Formal", "Friendly/Casual", "Enthusiastic/Excited", "Humorous/Playful",
  "Inspirational/Motivational", "Educational/Informative", "Conversational",
  "Empathetic/Caring", "Bold/Confident",
];
const AI_STYLES = [
  "Short and punchy", "Detailed and Descriptive", "Question-based (engaging)",
  "Story-driven", "Direct and promotional",
];

const STEPS = ["Topic & Tone", "Caption", "Visuals", "Hashtags", "Review"];

export default function CreateAiPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  // Step 1
  const [description, setDescription] = useState("");
  const [tones, setTones] = useState<string[]>([]);
  const [style, setStyle] = useState<string>("Short and punchy");
  const [audience, setAudience] = useState("");
  const [keywords, setKeywords] = useState("");

  // Step 2
  const [captionLoading, setCaptionLoading] = useState(false);
  const [captionOptions, setCaptionOptions] = useState<string[]>([]);
  const [chosenCaption, setChosenCaption] = useState("");

  // Step 3
  const [visualLoading, setVisualLoading] = useState(false);
  const [visualOptions, setVisualOptions] = useState<string[]>([]);
  const [chosenVisual, setChosenVisual] = useState<string | null>(null);

  // Step 4
  const [hashtagOptions, setHashtagOptions] = useState<string[]>([]);
  const [chosenHashtags, setChosenHashtags] = useState<string[]>([]);

  const wordCount = description.trim().split(/\s+/).filter(Boolean).length;
  const canProceedFromTopic = wordCount >= 4 && tones.length > 0;

  const generateCaptions = () => {
    setCaptionLoading(true); setCaptionOptions([]);
    setTimeout(() => {
      setCaptionOptions([
        `🚀 ${description} — here's why it matters for ${audience || "your audience"}.`,
        `Stop guessing, start knowing. ${description} Ready to level up? 📈`,
        `Here's the playbook: ${description.toLowerCase()}. Action steps inside. ⚡`,
      ]);
      setCaptionLoading(false);
    }, 1200);
  };

  const generateVisuals = () => {
    setVisualLoading(true); setVisualOptions([]);
    setTimeout(() => {
      setVisualOptions([
        "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=600&h=600&fit=crop",
      ]);
      setVisualLoading(false);
    }, 1500);
  };

  const generateHashtags = () => {
    const kw = keywords.split(",").map((s) => s.trim()).filter(Boolean);
    setHashtagOptions([
      "#socialmedia", "#marketing", "#AI", "#growth", "#contentcreation",
      "#trending", "#smm2026", "#digitalmarketing", "#branding",
      ...kw.map((k) => `#${k.replace(/\s+/g, "")}`),
    ]);
  };

  const next = () => {
    if (step === 0 && !canProceedFromTopic) return toast.error("Need 4+ words and at least one tone");
    if (step === 1 && !chosenCaption) return toast.error("Pick a caption to continue");
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  // Auto-trigger generation when entering steps
  useMemo(() => {
    if (step === 1 && captionOptions.length === 0 && !captionLoading) generateCaptions();
    if (step === 2 && visualOptions.length === 0 && !visualLoading) generateVisuals();
    if (step === 3 && hashtagOptions.length === 0) generateHashtags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const finish = () => {
    toast.success("AI content sent to composer");
    navigate("/client/create");
  };

  return (
    <div className="space-y-5 animate-fade-in pb-8 pt-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-card rounded-xl shadow-card border border-border overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-primary/5 to-transparent border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg gradient-coral flex items-center justify-center shadow-coral">
                <Sparkles className="w-4.5 h-4.5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-base font-semibold leading-tight">Create with AI</h1>
                <p className="text-xs text-muted-foreground">Guided 4-step content creation</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/client/create")}
              className="text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 px-2 py-1 rounded hover:bg-accent transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Exit
            </button>
          </div>
          {/* Stepper */}
          <div className="flex items-center gap-1.5">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center gap-1.5 flex-1 last:flex-initial">
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold flex-shrink-0",
                  i < step ? "bg-primary text-primary-foreground" :
                  i === step ? "gradient-coral text-primary-foreground shadow-coral" :
                  "bg-accent text-muted-foreground"
                )}>
                  {i < step ? <Check className="w-3 h-3" /> : i + 1}
                </div>
                <span className={cn("text-[11px] font-medium hidden sm:inline", i === step ? "text-foreground" : "text-muted-foreground")}>{label}</span>
                {i < STEPS.length - 1 && <div className={cn("flex-1 h-px", i < step ? "bg-primary" : "bg-border")} />}
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-5 min-h-[400px]">
          {step === 0 && (
            <>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-semibold flex items-center gap-1.5">
                    Primary Post Description
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-destructive/10 text-destructive">REQUIRED</span>
                  </label>
                  <span className="text-[11px] text-muted-foreground">{wordCount} words</span>
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What should this post be about? e.g., A limited-time summer sale for 20% off all sneakers"
                  className="w-full min-h-[100px] resize-none px-3 py-2.5 rounded-lg border border-input text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background"
                />
                <p className="text-[11px] text-muted-foreground mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> The more specific your description, the better the AI results.
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold mb-2">Select tone <span className="text-[11px] font-normal text-muted-foreground">(choose 1 or more)</span></p>
                <div className="flex flex-wrap gap-2">
                  {AI_TONES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTones((p) => p.includes(t) ? p.filter((x) => x !== t) : [...p, t])}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                        tones.includes(t) ? "gradient-coral text-primary-foreground border-transparent shadow-coral" : "bg-card border-border text-foreground hover:bg-accent"
                      )}
                    >{t}</button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold mb-2">Style preferences</p>
                <div className="flex flex-wrap gap-2">
                  {AI_STYLES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setStyle(s)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                        style === s ? "border-primary text-primary bg-primary/5" : "bg-card border-border text-foreground hover:bg-accent"
                      )}
                    >{s}</button>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-border p-4 bg-muted/20">
                <p className="text-sm font-semibold mb-3">Fine-tune targeting <span className="text-[11px] font-normal text-muted-foreground">(optional)</span></p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] uppercase tracking-wide font-semibold text-muted-foreground">Target audience</label>
                    <input value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g., Young professionals" className="mt-1 w-full px-3 py-2 rounded-lg border border-input text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background" />
                  </div>
                  <div>
                    <label className="text-[11px] uppercase tracking-wide font-semibold text-muted-foreground">Specific keywords</label>
                    <input value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="e.g., AI, automation, growth" className="mt-1 w-full px-3 py-2 rounded-lg border border-input text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background" />
                  </div>
                </div>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Pick a caption</p>
                <button onClick={generateCaptions} disabled={captionLoading} className="text-xs font-medium text-primary hover:underline flex items-center gap-1 disabled:opacity-50">
                  <RefreshCw className={cn("w-3 h-3", captionLoading && "animate-spin")} /> Regenerate
                </button>
              </div>
              {captionLoading ? (
                <div className="space-y-2">
                  {[1,2,3].map((i) => <div key={i} className="h-20 rounded-lg bg-accent animate-pulse" />)}
                </div>
              ) : (
                <div className="space-y-2">
                  {captionOptions.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => setChosenCaption(c)}
                      className={cn(
                        "w-full text-left p-3 rounded-lg border transition-all",
                        chosenCaption === c ? "border-primary bg-primary/5 shadow-coral/30 shadow-sm" : "border-border hover:border-primary/40 hover:bg-accent/30"
                      )}
                    >
                      <p className="text-sm leading-relaxed">{c}</p>
                      <div className="flex justify-between items-center mt-2 text-[11px] text-muted-foreground">
                        <span>{c.length} chars</span>
                        {chosenCaption === c && <span className="flex items-center gap-1 text-primary font-semibold"><Check className="w-3 h-3" /> Selected</span>}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {step === 2 && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">Choose a visual</p>
                  <p className="text-[11px] text-muted-foreground">Optional — skip if you'll upload your own.</p>
                </div>
                <button onClick={generateVisuals} disabled={visualLoading} className="text-xs font-medium text-primary hover:underline flex items-center gap-1 disabled:opacity-50">
                  <RefreshCw className={cn("w-3 h-3", visualLoading && "animate-spin")} /> Regenerate
                </button>
              </div>
              {visualLoading ? (
                <div className="grid grid-cols-2 gap-3">
                  {[1,2,3,4].map((i) => <div key={i} className="aspect-square rounded-lg bg-accent animate-pulse" />)}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {visualOptions.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => setChosenVisual(chosenVisual === url ? null : url)}
                      className={cn(
                        "relative rounded-lg overflow-hidden border-2 transition-all",
                        chosenVisual === url ? "border-primary shadow-coral" : "border-border hover:border-primary/40"
                      )}
                    >
                      <img src={url} alt={`Option ${i + 1}`} className="w-full aspect-square object-cover" />
                      {chosenVisual === url && (
                        <span className="absolute top-2 right-2 w-6 h-6 rounded-full gradient-coral flex items-center justify-center shadow-coral">
                          <Check className="w-3.5 h-3.5 text-primary-foreground" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {step === 3 && (
            <>
              <div>
                <p className="text-sm font-semibold mb-1">Pick hashtags</p>
                <p className="text-[11px] text-muted-foreground mb-3">Selected hashtags will be appended to your caption.</p>
                <div className="flex flex-wrap gap-2">
                  {hashtagOptions.map((tag) => {
                    const sel = chosenHashtags.includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => setChosenHashtags((p) => sel ? p.filter((t) => t !== tag) : [...p, tag])}
                        className={cn(
                          "px-2.5 py-1 rounded-full text-xs font-medium border transition-all",
                          sel ? "gradient-coral text-primary-foreground border-transparent" : "bg-card border-border text-foreground hover:bg-accent"
                        )}
                      >{tag}</button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold mb-1">Review your post</p>
                <p className="text-[11px] text-muted-foreground">Confirm before sending to the composer.</p>
              </div>
              <div className="rounded-lg border border-border p-4 bg-muted/20 space-y-3">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {chosenCaption}
                  {chosenHashtags.length > 0 && `\n\n${chosenHashtags.join(" ")}`}
                </p>
                {chosenVisual && <img src={chosenVisual} alt="Selected" className="w-40 rounded-md border border-border" />}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-border bg-muted/10 flex items-center justify-between">
          <button
            onClick={back}
            disabled={step === 0}
            className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/client/create")}
              className="px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              Cancel
            </button>
            {step < STEPS.length - 1 ? (
              <button
                onClick={next}
                className="px-5 py-2 rounded-lg gradient-coral text-primary-foreground text-sm font-semibold shadow-coral hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-1.5"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={finish}
                className="px-5 py-2 rounded-lg gradient-coral text-primary-foreground text-sm font-semibold shadow-coral hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" /> Send to composer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
