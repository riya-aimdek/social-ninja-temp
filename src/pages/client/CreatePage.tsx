import { useState, useMemo, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles, Image as ImageIcon, Facebook, Instagram, Linkedin, Twitter,
  AlertCircle, RefreshCw, Check, X, Upload, Loader2, Save, Hash,
  Calendar as CalendarIcon, Clock, Eye, ChevronDown, ChevronRight, Plus,
  MoreHorizontal, Heart, MessageCircle, Repeat2, Send, Settings2, Trash2,
  CheckCircle2, Globe2,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/* ---------------- Platform model ---------------- */
type PlatformKey = "instagram" | "facebook" | "linkedin" | "twitter";

const PLATFORMS: Record<PlatformKey, {
  name: string; icon: typeof Instagram; color: string; charLimit: number;
  hashtagLimit: number; aspect: string; aspectLabel: string; recSize: string;
}> = {
  instagram: { name: "Instagram", icon: Instagram, color: "bg-[hsl(var(--instagram))]", charLimit: 2200, hashtagLimit: 30, aspect: "1 / 1", aspectLabel: "1:1 Square", recSize: "1080×1080" },
  facebook:  { name: "Facebook",  icon: Facebook,  color: "bg-[hsl(var(--facebook))]",  charLimit: 63206, hashtagLimit: 30, aspect: "1.91 / 1", aspectLabel: "1.91:1 Landscape", recSize: "1200×630" },
  linkedin:  { name: "LinkedIn",  icon: Linkedin,  color: "bg-[hsl(var(--linkedin))]",  charLimit: 3000,  hashtagLimit: 5,  aspect: "1.91 / 1", aspectLabel: "1.91:1 Landscape", recSize: "1200×627" },
  twitter:   { name: "X",         icon: Twitter,   color: "bg-[hsl(var(--twitter))]",   charLimit: 280,   hashtagLimit: 10, aspect: "16 / 9", aspectLabel: "16:9 Landscape",  recSize: "1600×900" },
};

/* ---------------- Mock connected accounts ---------------- */
type Account = { id: string; platform: PlatformKey; handle: string; name: string; avatar?: string };
const MOCK_ACCOUNTS: Account[] = [
  { id: "ig-1", platform: "instagram", handle: "@aimdek",       name: "Aimdek Official" },
  { id: "ig-2", platform: "instagram", handle: "@aimdek.team",  name: "Aimdek Team" },
  { id: "fb-1", platform: "facebook",  handle: "Aimdek Page",   name: "Aimdek" },
  { id: "fb-2", platform: "facebook",  handle: "Aimdek Studio", name: "Aimdek Studio" },
  { id: "li-1", platform: "linkedin",  handle: "Aimdek Inc",    name: "Aimdek Inc" },
  { id: "tw-1", platform: "twitter",   handle: "@aimdek",       name: "Aimdek" },
];

const TONES = ["Professional", "Casual", "Creative", "Promotional"];
const HASHTAG_GROUPS: Record<string, string[]> = {
  "High Reach": ["#socialmedia", "#marketing", "#AI", "#growth", "#trending"],
  "Niche": ["#socialninja", "#aimarketing", "#smm2026"],
};

/* ---------------- Types ---------------- */
type PlatformMedia = Partial<Record<PlatformKey, string>>; // platform → image url
type CaptionVariant = { caption: string; useShared: boolean };
type PlatformOverrides = Partial<Record<PlatformKey, CaptionVariant>>;

export default function CreatePage() {
  const navigate = useNavigate();
  /* ---- selection state ---- */
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>(["ig-1", "fb-1"]);
  const [accountPickerOpen, setAccountPickerOpen] = useState(false);

  /* ---- composer ---- */
  const [sharedCaption, setSharedCaption] = useState("");
  const [overrides, setOverrides] = useState<PlatformOverrides>({});
  const [customizePerNetwork, setCustomizePerNetwork] = useState(false);
  const [activeOverrideTab, setActiveOverrideTab] = useState<PlatformKey | null>(null);

  /* ---- media (per-platform variants) ---- */
  const [sharedMedia, setSharedMedia] = useState<string | null>(null);
  const [platformMedia, setPlatformMedia] = useState<PlatformMedia>({});
  const [mediaVariantsOpen, setMediaVariantsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<PlatformKey | "shared">("shared");

  /* ---- AI ---- */
  const [aiOpen, setAiOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiTone, setAiTone] = useState("Professional");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  /* ---- hashtags ---- */
  const [hashtagsOpen, setHashtagsOpen] = useState(false);
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [customHashtag, setCustomHashtag] = useState("");

  /* ---- schedule ---- */
  const [scheduleMode, setScheduleMode] = useState<"now" | "schedule">("now");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  /* ---- preview ---- */
  const [previewMode, setPreviewMode] = useState<"tabs" | "grid">("tabs");
  const [activePreview, setActivePreview] = useState<PlatformKey>("instagram");

  /* ---- derived ---- */
  const selectedAccounts = useMemo(
    () => MOCK_ACCOUNTS.filter((a) => selectedAccountIds.includes(a.id)),
    [selectedAccountIds]
  );
  const selectedPlatforms = useMemo(
    () => Array.from(new Set(selectedAccounts.map((a) => a.platform))) as PlatformKey[],
    [selectedAccounts]
  );

  const getCaptionFor = (p: PlatformKey) => {
    if (customizePerNetwork && overrides[p] && !overrides[p]!.useShared) return overrides[p]!.caption;
    return sharedCaption;
  };
  const getMediaFor = (p: PlatformKey) => platformMedia[p] ?? sharedMedia ?? null;

  /* ---- account toggle ---- */
  const toggleAccount = (id: string) =>
    setSelectedAccountIds((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);

  /* ---- caption override ---- */
  const setOverrideCaption = (p: PlatformKey, caption: string) =>
    setOverrides((prev) => ({ ...prev, [p]: { caption, useShared: false } }));

  const resetOverride = (p: PlatformKey) =>
    setOverrides((prev) => {
      const n = { ...prev };
      delete n[p];
      return n;
    });

  /* ---- media upload (mock) ---- */
  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      if (uploadTarget === "shared") setSharedMedia(url);
      else setPlatformMedia((prev) => ({ ...prev, [uploadTarget]: url }));
      toast.success(uploadTarget === "shared" ? "Media added" : `${PLATFORMS[uploadTarget as PlatformKey].name} variant added`);
    };
    reader.readAsDataURL(file);
  };
  const triggerUpload = (target: PlatformKey | "shared") => {
    setUploadTarget(target);
    fileInputRef.current?.click();
  };
  const removeMedia = (target: PlatformKey | "shared") => {
    if (target === "shared") setSharedMedia(null);
    else setPlatformMedia((prev) => { const n = { ...prev }; delete n[target]; return n; });
  };

  /* ---- AI generate ---- */
  const handleAiGenerate = useCallback(() => {
    if (aiPrompt.trim().split(/\s+/).filter(Boolean).length < 4) {
      toast.error("Please enter at least 4 words"); return;
    }
    setAiLoading(true); setAiSuggestions([]);
    setTimeout(() => {
      setAiSuggestions([
        `🚀 ${aiPrompt} — discover how AI is reshaping the way teams create and publish content. #SocialMedia #AI`,
        `Stop guessing, start knowing. ${aiPrompt} Ready to level up your social game? 📈`,
        `Here's why ${aiPrompt.toLowerCase()} matters in 2026 — and how to act on it in under 5 minutes. ⚡`,
      ]);
      setAiLoading(false);
    }, 1500);
  }, [aiPrompt]);

  const useAiSuggestion = (text: string) => {
    setSharedCaption(text);
    setAiOpen(false);
    toast.success("Caption applied");
  };

  /* ---- hashtag select ---- */
  const toggleHashtag = (tag: string) =>
    setSelectedHashtags((p) => p.includes(tag) ? p.filter((t) => t !== tag) : [...p, tag]);
  const insertHashtagsToCaption = () => {
    if (!selectedHashtags.length) return;
    setSharedCaption((c) => `${c}${c ? "\n\n" : ""}${selectedHashtags.join(" ")}`);
    setHashtagsOpen(false);
    toast.success("Hashtags added");
  };
  const addCustomHashtag = () => {
    const t = customHashtag.trim().replace(/^#?/, "#");
    if (t.length < 2) return;
    if (!selectedHashtags.includes(t)) setSelectedHashtags((p) => [...p, t]);
    setCustomHashtag("");
  };

  /* ---- publish ---- */
  const handlePublish = () => {
    if (!selectedAccountIds.length) return toast.error("Select at least one account");
    if (!sharedCaption.trim() && !Object.values(overrides).some((v) => v?.caption.trim()))
      return toast.error("Caption is empty");
    toast.success(scheduleMode === "now" ? "Publishing…" : "Scheduled");
  };

  return (
    <div className="space-y-5 animate-fade-in pb-8 pt-4">
      {/* ============ Page header: title + mode switcher + actions ============ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold leading-tight">Create Post</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Compose manually or let AI guide you through it.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Segmented mode switcher */}
          <div className="inline-flex items-center p-1 rounded-lg bg-muted border border-border">
            <button
              type="button"
              aria-pressed="true"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-card text-foreground shadow-sm"
            >
              <Settings2 className="w-3.5 h-3.5" /> Manual
            </button>
            <button
              type="button"
              onClick={() => navigate("/client/create/ai")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" /> AI Assistant
            </button>
          </div>

          <button
            onClick={() => toast.success("Draft saved")}
            className="px-3 py-1.5 rounded-md text-xs font-medium border border-border bg-card text-foreground hover:bg-accent transition-colors flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" /> Save Draft
          </button>
        </div>
      </div>

      {/* ============ 3-col Layout ============ */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* ===== LEFT: Connected Accounts ===== */}
        <aside className="xl:col-span-3 space-y-4">
          <ConnectedAccountsPanel
            accounts={MOCK_ACCOUNTS}
            selectedIds={selectedAccountIds}
            onToggle={toggleAccount}
            onClearAll={() => setSelectedAccountIds([])}
          />

          <div className="bg-card rounded-xl shadow-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-primary" /> Media
              </h3>
              {selectedPlatforms.length > 1 && (
                <button
                  onClick={() => setMediaVariantsOpen(true)}
                  className="text-[11px] font-medium text-primary hover:underline"
                >
                  Customize per platform
                </button>
              )}
            </div>

            {sharedMedia ? (
              <div className="relative group">
                <img src={sharedMedia} alt="Shared media" className="w-full rounded-lg border border-border aspect-video object-cover" />
                <button
                  onClick={() => removeMedia("shared")}
                  className="absolute top-2 right-2 p-1 rounded-full bg-card/90 hover:bg-card border border-border opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => triggerUpload("shared")}
                className="w-full border-2 border-dashed border-border rounded-lg p-6 hover:border-primary hover:bg-accent/40 transition-all flex flex-col items-center gap-2 text-muted-foreground"
              >
                <Upload className="w-6 h-6" />
                <span className="text-xs font-medium">Upload shared media</span>
                <span className="text-[10px]">JPG, PNG, WEBP — max 10MB</span>
              </button>
            )}

            {/* per-platform variant chips */}
            {selectedPlatforms.length > 0 && Object.keys(platformMedia).length > 0 && (
              <div className="space-y-1.5 pt-1">
                <p className="text-[10px] uppercase tracking-wide font-semibold text-muted-foreground">Platform variants</p>
                {selectedPlatforms.filter((p) => platformMedia[p]).map((p) => {
                  const meta = PLATFORMS[p]; const Icon = meta.icon;
                  return (
                    <div key={p} className="flex items-center gap-2 p-1.5 pl-2 rounded-md bg-accent/50 text-xs">
                      <span className={cn("w-5 h-5 rounded flex items-center justify-center text-white", meta.color)}>
                        <Icon className="w-3 h-3" />
                      </span>
                      <span className="flex-1 font-medium truncate">{meta.name}</span>
                      <span className="text-muted-foreground text-[10px]">{meta.recSize}</span>
                      <button onClick={() => removeMedia(p)} className="p-0.5 hover:text-destructive">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </aside>

        {/* ===== CENTER: Composer ===== */}
        <section className="xl:col-span-5 space-y-4">
          <div className="bg-card rounded-xl shadow-card overflow-hidden">
            {/* Editor */}
            <div className="p-4 space-y-3">
              <textarea
                value={sharedCaption}
                onChange={(e) => setSharedCaption(e.target.value)}
                placeholder="Start writing your post…"
                className="w-full min-h-[180px] resize-none text-sm text-foreground placeholder:text-muted-foreground outline-none bg-transparent leading-relaxed"
              />

              {/* Character meters */}
              {selectedPlatforms.length > 0 && (
                <div className="space-y-1.5 pt-1 border-t border-border">
                  {selectedPlatforms.map((p) => {
                    const meta = PLATFORMS[p];
                    const text = getCaptionFor(p);
                    const len = text.length;
                    const pct = Math.min((len / meta.charLimit) * 100, 100);
                    const over = len > meta.charLimit;
                    const Icon = meta.icon;
                    return (
                      <div key={p} className="flex items-center gap-2 text-[11px]">
                        <Icon className="w-3 h-3 text-muted-foreground" />
                        <span className="w-20 text-muted-foreground">{meta.name}</span>
                        <div className="flex-1 h-1 rounded-full bg-accent overflow-hidden">
                          <div className={cn("h-full rounded-full transition-all", over ? "bg-destructive" : "gradient-coral")} style={{ width: `${pct}%` }} />
                        </div>
                        <span className={cn("tabular-nums w-20 text-right", over ? "text-destructive font-semibold" : "text-muted-foreground")}>
                          {len.toLocaleString()}/{meta.charLimit.toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Toolbar */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="flex items-center gap-1">
                  <button onClick={() => triggerUpload("shared")} className="p-2 rounded-md hover:bg-accent transition-colors text-muted-foreground" title="Add image">
                    <ImageIcon className="w-4 h-4" />
                  </button>
                  <button onClick={() => setHashtagsOpen(true)} className="p-2 rounded-md hover:bg-accent transition-colors text-muted-foreground" title="Hashtags">
                    <Hash className="w-4 h-4" />
                  </button>
                  <button onClick={() => setAiOpen(true)} className="p-2 rounded-md hover:bg-accent transition-colors text-primary" title="AI Assist">
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>

                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <Settings2 className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">Customize per network</span>
                  <input
                    type="checkbox"
                    checked={customizePerNetwork}
                    onChange={(e) => {
                      setCustomizePerNetwork(e.target.checked);
                      if (e.target.checked && selectedPlatforms.length) setActiveOverrideTab(selectedPlatforms[0]);
                    }}
                    className="sr-only peer"
                  />
                  <span className="relative w-9 h-5 bg-accent peer-checked:bg-primary rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:w-4 after:h-4 after:rounded-full after:transition-transform peer-checked:after:translate-x-4" />
                </label>
              </div>

              {/* Per-network override editor */}
              {customizePerNetwork && selectedPlatforms.length > 0 && (
                <div className="rounded-lg border border-border overflow-hidden">
                  <div className="flex border-b border-border bg-muted/30 overflow-x-auto">
                    {selectedPlatforms.map((p) => {
                      const meta = PLATFORMS[p]; const Icon = meta.icon;
                      const customized = overrides[p] && !overrides[p]!.useShared;
                      return (
                        <button
                          key={p}
                          onClick={() => setActiveOverrideTab(p)}
                          className={cn(
                            "flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap",
                            activeOverrideTab === p ? "border-primary text-foreground bg-card" : "border-transparent text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <Icon className="w-3.5 h-3.5" /> {meta.name}
                          {customized && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                        </button>
                      );
                    })}
                  </div>
                  {activeOverrideTab && (
                    <div className="p-3 space-y-2">
                      <textarea
                        value={overrides[activeOverrideTab]?.caption ?? sharedCaption}
                        onChange={(e) => setOverrideCaption(activeOverrideTab, e.target.value)}
                        placeholder={`Custom ${PLATFORMS[activeOverrideTab].name} caption…`}
                        className="w-full min-h-[100px] resize-none text-sm bg-transparent outline-none"
                      />
                      <div className="flex justify-between items-center text-[11px]">
                        <button
                          onClick={() => resetOverride(activeOverrideTab)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          Reset to shared
                        </button>
                        <span className="text-muted-foreground">
                          Recommended: {PLATFORMS[activeOverrideTab].recSize} · {PLATFORMS[activeOverrideTab].aspectLabel}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Scheduling */}
          <div className="bg-card rounded-xl shadow-card p-4 space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-primary" /> Scheduling
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setScheduleMode("now")}
                className={cn(
                  "py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5 border",
                  scheduleMode === "now" ? "gradient-coral text-primary-foreground border-transparent shadow-coral" : "bg-card border-border text-foreground hover:bg-accent"
                )}
              >
                <Send className="w-3.5 h-3.5" /> Send Now
              </button>
              <button
                onClick={() => setScheduleMode("schedule")}
                className={cn(
                  "py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5 border",
                  scheduleMode === "schedule" ? "gradient-coral text-primary-foreground border-transparent shadow-coral" : "bg-card border-border text-foreground hover:bg-accent"
                )}
              >
                <Clock className="w-3.5 h-3.5" /> Schedule
              </button>
            </div>
            {scheduleMode === "schedule" && (
              <div className="grid grid-cols-2 gap-2">
                <input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="px-3 py-2 rounded-lg border border-input text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                <input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} className="px-3 py-2 rounded-lg border border-input text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              </div>
            )}
          </div>

          {/* Action bar */}
          <div className="flex items-center justify-between gap-2">
            <button className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-accent transition-colors">
              Send for Approval
            </button>
            <button
              onClick={handlePublish}
              className="px-5 py-2.5 rounded-lg gradient-coral text-primary-foreground font-semibold text-sm shadow-coral hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-2"
            >
              {scheduleMode === "now" ? <><Send className="w-4 h-4" /> Publish Now</> : <><Clock className="w-4 h-4" /> Schedule Post</>}
            </button>
          </div>
        </section>

        {/* ===== RIGHT: Live Preview ===== */}
        <aside className="xl:col-span-4 space-y-4">
          <div className="bg-card rounded-xl shadow-card overflow-hidden sticky top-4">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Eye className="w-4 h-4 text-primary" /> Live Preview
              </h3>
              <div className="flex bg-accent rounded-md p-0.5 text-[11px] font-medium">
                <button
                  onClick={() => setPreviewMode("tabs")}
                  className={cn("px-2 py-1 rounded", previewMode === "tabs" ? "bg-card shadow-sm" : "text-muted-foreground")}
                >Tabs</button>
                <button
                  onClick={() => setPreviewMode("grid")}
                  className={cn("px-2 py-1 rounded", previewMode === "grid" ? "bg-card shadow-sm" : "text-muted-foreground")}
                >Side-by-side</button>
              </div>
            </div>

            {selectedPlatforms.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                <Globe2 className="w-10 h-10 mx-auto mb-2 opacity-30" />
                Select an account to see a live preview.
              </div>
            ) : previewMode === "tabs" ? (
              <>
                <div className="flex border-b border-border overflow-x-auto bg-muted/20">
                  {selectedPlatforms.map((p) => {
                    const meta = PLATFORMS[p]; const Icon = meta.icon;
                    return (
                      <button
                        key={p}
                        onClick={() => setActivePreview(p)}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap",
                          activePreview === p ? "border-primary text-foreground bg-card" : "border-transparent text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Icon className="w-3.5 h-3.5" /> {meta.name}
                      </button>
                    );
                  })}
                </div>
                <div className="p-4">
                  <PlatformPreview
                    platform={activePreview}
                    caption={getCaptionFor(activePreview)}
                    media={getMediaFor(activePreview)}
                    handle={selectedAccounts.find((a) => a.platform === activePreview)?.handle ?? ""}
                  />
                </div>
              </>
            ) : (
              <div className="p-3 space-y-3 max-h-[700px] overflow-y-auto">
                {selectedPlatforms.map((p) => (
                  <details key={p} open className="rounded-lg border border-border overflow-hidden group">
                    <summary className="flex items-center gap-2 px-3 py-2 bg-muted/30 cursor-pointer text-xs font-semibold list-none">
                      <ChevronRight className="w-3.5 h-3.5 transition-transform group-open:rotate-90" />
                      {(() => { const Icon = PLATFORMS[p].icon; return <Icon className="w-3.5 h-3.5" />; })()}
                      {PLATFORMS[p].name}
                    </summary>
                    <div className="p-3">
                      <PlatformPreview
                        platform={p}
                        caption={getCaptionFor(p)}
                        media={getMediaFor(p)}
                        handle={selectedAccounts.find((a) => a.platform === p)?.handle ?? ""}
                      />
                    </div>
                  </details>
                ))}
              </div>
            )}

            <div className="px-4 py-2.5 border-t border-border bg-muted/20 text-[11px] text-muted-foreground text-center">
              Preview approximates how content will display. Actual rendering may differ.
            </div>
          </div>
        </aside>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
      />

      {/* ============ Account Picker Dialog ============ */}
      <Dialog open={accountPickerOpen} onOpenChange={setAccountPickerOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Select accounts to publish to</DialogTitle></DialogHeader>
          <ConnectedAccountsPanel
            accounts={MOCK_ACCOUNTS}
            selectedIds={selectedAccountIds}
            onToggle={toggleAccount}
            onClearAll={() => setSelectedAccountIds([])}
            embedded
          />
          <button onClick={() => setAccountPickerOpen(false)} className="mt-2 w-full py-2 rounded-lg gradient-coral text-primary-foreground text-sm font-medium hover:opacity-90 transition-all">
            Done · {selectedAccountIds.length} selected
          </button>
        </DialogContent>
      </Dialog>

      {/* ============ Per-Platform Media Variants Dialog ============ */}
      <Dialog open={mediaVariantsOpen} onOpenChange={setMediaVariantsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-primary" /> Platform-specific media
            </DialogTitle>
            <p className="text-xs text-muted-foreground">Each platform has different optimal dimensions. Upload tailored variants or fall back to the shared image.</p>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
            {selectedPlatforms.map((p) => {
              const meta = PLATFORMS[p]; const Icon = meta.icon;
              const url = platformMedia[p] ?? sharedMedia;
              const isVariant = !!platformMedia[p];
              return (
                <div key={p} className="rounded-lg border border-border p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={cn("w-6 h-6 rounded flex items-center justify-center text-white", meta.color)}>
                        <Icon className="w-3.5 h-3.5" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold leading-tight">{meta.name}</p>
                        <p className="text-[10px] text-muted-foreground">{meta.recSize} · {meta.aspectLabel}</p>
                      </div>
                    </div>
                    {isVariant && <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-primary/10 text-primary">Custom</span>}
                  </div>
                  <div className="rounded-md border border-dashed border-border bg-muted/30 overflow-hidden flex items-center justify-center" style={{ aspectRatio: meta.aspect }}>
                    {url ? <img src={url} alt={meta.name} className="w-full h-full object-cover" /> : <span className="text-[11px] text-muted-foreground">No image</span>}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => triggerUpload(p)}
                      className="flex-1 px-2 py-1.5 rounded-md border border-border text-xs font-medium hover:bg-accent transition-colors flex items-center justify-center gap-1"
                    >
                      <Upload className="w-3 h-3" /> {isVariant ? "Replace" : "Upload variant"}
                    </button>
                    {isVariant && (
                      <button onClick={() => removeMedia(p)} className="px-2 py-1.5 rounded-md border border-border text-xs hover:bg-destructive/10 hover:text-destructive transition-colors">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <button onClick={() => setMediaVariantsOpen(false)} className="mt-2 w-full py-2 rounded-lg gradient-coral text-primary-foreground text-sm font-medium hover:opacity-90 transition-all">Done</button>
        </DialogContent>
      </Dialog>

      {/* ============ AI Assist Dialog ============ */}
      <Dialog open={aiOpen} onOpenChange={setAiOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary" /> AI Caption Assistant</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Describe your post… e.g., Announce our new AI scheduling feature for marketing teams"
              className="w-full min-h-[80px] resize-none px-3 py-2.5 rounded-lg border border-input text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Tone</p>
              <div className="flex gap-2 flex-wrap">
                {TONES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setAiTone(t)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                      aiTone === t ? "gradient-coral text-primary-foreground shadow-coral" : "bg-accent text-foreground hover:bg-accent/80"
                    )}
                  >{t}</button>
                ))}
              </div>
            </div>
            <button
              onClick={handleAiGenerate}
              disabled={aiLoading}
              className="w-full py-2.5 rounded-lg gradient-coral text-primary-foreground font-medium text-sm shadow-coral hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {aiLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</> : <><Sparkles className="w-4 h-4" /> Generate Suggestions</>}
            </button>
            {aiSuggestions.length > 0 && (
              <div className="space-y-2">
                {aiSuggestions.map((s, i) => (
                  <div key={i} className="p-3 rounded-lg border border-border hover:border-primary/40 transition-colors">
                    <p className="text-sm leading-relaxed mb-2">{s}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] text-muted-foreground">{s.length} chars</span>
                      <button onClick={() => useAiSuggestion(s)} className="px-3 py-1 rounded-md gradient-coral text-primary-foreground text-xs font-medium hover:opacity-90">Use this</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* ============ Hashtags Dialog ============ */}
      <Dialog open={hashtagsOpen} onOpenChange={setHashtagsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Hash className="w-5 h-5 text-primary" /> Hashtag Suggestions</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {Object.entries(HASHTAG_GROUPS).map(([group, tags]) => (
              <div key={group}>
                <p className="text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">{group}</p>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleHashtag(tag)}
                      className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-medium transition-all",
                        selectedHashtags.includes(tag) ? "gradient-coral text-primary-foreground" : "bg-accent text-foreground hover:bg-accent/80"
                      )}
                    >{tag}</button>
                  ))}
                </div>
              </div>
            ))}
            <div className="flex gap-2 pt-2 border-t border-border">
              <input
                value={customHashtag}
                onChange={(e) => setCustomHashtag(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCustomHashtag()}
                placeholder="Add custom…"
                className="flex-1 px-3 py-2 rounded-lg border border-input text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <button onClick={addCustomHashtag} className="px-3 py-2 rounded-lg bg-accent hover:bg-accent/80 text-sm font-medium flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
            {selectedHashtags.length > 0 && (
              <div className="pt-2 border-t border-border">
                <p className="text-[11px] font-semibold text-muted-foreground mb-1.5">Selected ({selectedHashtags.length})</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedHashtags.map((t) => (
                    <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {t}<button onClick={() => toggleHashtag(t)}><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              </div>
            )}
            <button onClick={insertHashtagsToCaption} disabled={!selectedHashtags.length} className="w-full py-2 rounded-lg gradient-coral text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-all">
              Insert into caption
            </button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}

/* ================================================================
   Sub-components
   ================================================================ */

function ConnectedAccountsPanel({
  accounts, selectedIds, onToggle, onClearAll, embedded,
}: {
  accounts: Account[]; selectedIds: string[]; onToggle: (id: string) => void;
  onClearAll: () => void; embedded?: boolean;
}) {
  const grouped = useMemo(() => {
    const m: Record<PlatformKey, Account[]> = { instagram: [], facebook: [], linkedin: [], twitter: [] };
    accounts.forEach((a) => m[a.platform].push(a));
    return m;
  }, [accounts]);

  // Auto-collapse once user has selected accounts (unless embedded in dialog)
  const [open, setOpen] = useState(embedded ? true : selectedIds.length === 0);
  const selectedAccounts = accounts.filter((a) => selectedIds.includes(a.id));

  const Body = (
    <>
      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
        {(Object.keys(grouped) as PlatformKey[]).map((p) => {
          if (!grouped[p].length) return null;
          const meta = PLATFORMS[p]; const Icon = meta.icon;
          const allSelected = grouped[p].every((a) => selectedIds.includes(a.id));
          return (
            <div key={p}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                  <Icon className="w-3 h-3" /> {meta.name}
                </div>
                <button
                  onClick={() => grouped[p].forEach((a) => {
                    if (allSelected ? selectedIds.includes(a.id) : !selectedIds.includes(a.id)) onToggle(a.id);
                  })}
                  className="text-[10px] font-medium text-primary hover:underline"
                >
                  {allSelected ? "Deselect all" : "Select all"}
                </button>
              </div>
              <div className="space-y-1">
                {grouped[p].map((a) => {
                  const checked = selectedIds.includes(a.id);
                  return (
                    <button
                      key={a.id}
                      onClick={() => onToggle(a.id)}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-2 py-2 rounded-lg border transition-all text-left",
                        checked ? "border-primary bg-primary/5" : "border-transparent hover:bg-accent/60"
                      )}
                    >
                      <div className="relative">
                        <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold", meta.color)}>
                          {a.name.charAt(0)}
                        </div>
                        <span className={cn("absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-card flex items-center justify-center", meta.color)}>
                          <Icon className="w-2 h-2 text-white" />
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{a.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{a.handle}</p>
                      </div>
                      <span className={cn("w-4 h-4 rounded border flex items-center justify-center transition-all", checked ? "bg-primary border-primary" : "border-border")}>
                        {checked && <Check className="w-3 h-3 text-primary-foreground" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {!embedded && (
        <div className="flex items-center gap-2 pt-2">
          <button className="flex-1 py-2 rounded-lg border border-dashed border-border text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-1.5">
            <Plus className="w-3.5 h-3.5" /> Connect new
          </button>
          {selectedIds.length > 0 && (
            <button
              onClick={() => setOpen(false)}
              className="px-3 py-2 rounded-lg gradient-coral text-primary-foreground text-xs font-semibold hover:opacity-90 transition-all flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" /> Done
            </button>
          )}
        </div>
      )}
    </>
  );

  if (embedded) return <div className="space-y-3">{Body}</div>;

  return (
    <div className="bg-card rounded-xl shadow-card overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 px-4 py-3 hover:bg-accent/40 transition-colors text-left"
      >
        <Globe2 className="w-4 h-4 text-primary flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">Accounts</span>
            <span className="text-[11px] font-medium text-muted-foreground">
              {selectedIds.length}/{accounts.length}
            </span>
          </div>
          {!open && selectedAccounts.length > 0 && (
            <div className="flex items-center gap-1 mt-1.5 flex-wrap">
              {selectedAccounts.slice(0, 4).map((a) => {
                const meta = PLATFORMS[a.platform]; const Icon = meta.icon;
                return (
                  <span key={a.id} className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-accent text-[10px] font-medium">
                    <span className={cn("w-3 h-3 rounded-sm flex items-center justify-center text-white", meta.color)}>
                      <Icon className="w-2 h-2" />
                    </span>
                    <span className="truncate max-w-[80px]">{a.handle}</span>
                  </span>
                );
              })}
              {selectedAccounts.length > 4 && (
                <span className="text-[10px] text-muted-foreground">+{selectedAccounts.length - 4}</span>
              )}
            </div>
          )}
          {!open && selectedAccounts.length === 0 && (
            <p className="text-[11px] text-muted-foreground mt-0.5">No accounts selected — tap to choose</p>
          )}
        </div>
        {selectedIds.length > 0 && open && (
          <span
            role="button"
            onClick={(e) => { e.stopPropagation(); onClearAll(); }}
            className="text-[11px] font-medium text-muted-foreground hover:text-destructive px-1"
          >
            Clear
          </span>
        )}
        <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform flex-shrink-0", open && "rotate-180")} />
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
          {Body}
        </div>
      )}
    </div>
  );
}

function SelectedAccountsBar({ accounts, onOpen }: { accounts: Account[]; onOpen: () => void }) {
  if (!accounts.length) {
    return (
      <button onClick={onOpen} className="w-full px-3 py-2 rounded-lg border border-dashed border-border text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-1.5">
        <Plus className="w-3.5 h-3.5" /> Select accounts
      </button>
    );
  }
  return (
    <button onClick={onOpen} className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg border border-border hover:border-primary/40 hover:bg-accent/40 transition-all flex-wrap">
      {accounts.slice(0, 5).map((a) => {
        const meta = PLATFORMS[a.platform]; const Icon = meta.icon;
        return (
          <span key={a.id} className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-accent text-[11px] font-medium">
            <span className={cn("w-3.5 h-3.5 rounded-sm flex items-center justify-center text-white", meta.color)}>
              <Icon className="w-2 h-2" />
            </span>
            {a.handle}
          </span>
        );
      })}
      {accounts.length > 5 && <span className="text-[11px] text-muted-foreground">+{accounts.length - 5} more</span>}
      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground ml-auto" />
    </button>
  );
}

/* ---------------- Platform Previews ---------------- */
function PlatformPreview({ platform, caption, media, handle }: { platform: PlatformKey; caption: string; media: string | null; handle: string }) {
  const meta = PLATFORMS[platform];
  const Icon = meta.icon;
  const initial = handle.replace(/^@/, "").charAt(0).toUpperCase() || "N";

  const Header = (
    <div className="flex items-center gap-2 p-3">
      <div className={cn("w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold", meta.color)}>{initial}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">{handle || "Your account"}</p>
        <p className="text-[11px] text-muted-foreground">Just now · <Globe2 className="inline w-2.5 h-2.5" /></p>
      </div>
      <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
    </div>
  );

  const Caption = caption ? (
    <p className="px-3 pb-3 text-sm leading-relaxed whitespace-pre-wrap break-words">{caption}</p>
  ) : (
    <p className="px-3 pb-3 text-sm text-muted-foreground italic">Your caption will appear here…</p>
  );

  const Media = media && (
    <div className="w-full bg-muted overflow-hidden" style={{ aspectRatio: meta.aspect }}>
      <img src={media} alt="Preview" className="w-full h-full object-cover" />
    </div>
  );

  if (platform === "twitter") {
    return (
      <div className="rounded-xl border border-border bg-card overflow-hidden max-w-md mx-auto">
        <div className="flex gap-3 p-3">
          <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0", meta.color)}>{initial}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm"><span className="font-semibold">{handle.replace(/^@/, "") || "Your account"}</span> <span className="text-muted-foreground">{handle.startsWith("@") ? handle : `@${handle}`} · now</span></p>
            <p className="text-sm leading-relaxed mt-0.5 whitespace-pre-wrap break-words">{caption || <span className="text-muted-foreground italic">Your tweet will appear here…</span>}</p>
            {media && (
              <div className="mt-2 rounded-2xl overflow-hidden border border-border bg-muted" style={{ aspectRatio: meta.aspect }}>
                <img src={media} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex justify-between mt-2 max-w-xs text-muted-foreground text-xs">
              <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> 0</span>
              <span className="flex items-center gap-1"><Repeat2 className="w-3.5 h-3.5" /> 0</span>
              <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> 0</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (platform === "instagram") {
    return (
      <div className="rounded-xl border border-border bg-card overflow-hidden max-w-md mx-auto">
        {Header}
        {media ? Media : (
          <div className="w-full bg-muted flex items-center justify-center text-muted-foreground text-xs" style={{ aspectRatio: meta.aspect }}>
            <ImageIcon className="w-10 h-10 opacity-30" />
          </div>
        )}
        <div className="flex items-center gap-3 p-3 text-foreground">
          <Heart className="w-5 h-5" /><MessageCircle className="w-5 h-5" /><Send className="w-5 h-5" />
        </div>
        {Caption}
      </div>
    );
  }

  if (platform === "linkedin") {
    return (
      <div className="rounded-xl border border-border bg-card overflow-hidden max-w-md mx-auto">
        {Header}
        {Caption}
        {Media}
        <div className="border-t border-border px-3 py-2 flex justify-around text-xs text-muted-foreground">
          <span className="flex items-center gap-1">👍 Like</span>
          <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> Comment</span>
          <span className="flex items-center gap-1"><Repeat2 className="w-3.5 h-3.5" /> Repost</span>
          <span className="flex items-center gap-1"><Send className="w-3.5 h-3.5" /> Send</span>
        </div>
      </div>
    );
  }

  // Facebook
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden max-w-md mx-auto">
      {Header}
      {Caption}
      {Media}
      <div className="px-3 py-1.5 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border">
        <span>0 reactions</span><span>0 comments</span>
      </div>
      <div className="border-t border-border px-3 py-1.5 flex justify-around text-sm text-muted-foreground">
        <span className="flex items-center gap-1">👍 Like</span>
        <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> Comment</span>
        <span className="flex items-center gap-1"><Send className="w-3.5 h-3.5" /> Share</span>
      </div>
    </div>
  );
}


