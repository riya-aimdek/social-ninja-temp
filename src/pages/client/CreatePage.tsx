import { useState, useMemo, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles, Image as ImageIcon, Facebook, Instagram, Linkedin, Twitter,
  AlertCircle, RefreshCw, Check, X, Upload, Loader2, Save, Hash,
  Calendar as CalendarIcon, Clock, Eye, ChevronDown, ChevronRight, Plus,
  MoreHorizontal, Heart, MessageCircle, Repeat2, Send, Settings2, Trash2,
  CheckCircle2, Globe2, GalleryVertical, Play, AlignLeft, Music,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import RichTextToolbar from "@/components/composer/RichTextToolbar";
import { TimePickerPopup } from "@/components/ui/TimePickerPopup";

/* ---------------- Platform model ---------------- */
type PlatformKey = "instagram" | "facebook" | "linkedin" | "twitter";
type AspectOption = { ratio: string; label: string; size: string };

const PLATFORMS: Record<PlatformKey, {
  name: string; icon: typeof Instagram; color: string; charLimit: number;
  hashtagLimit: number; aspect: string; aspectLabel: string; recSize: string;
  aspects?: AspectOption[];
}> = {
  instagram: { name: "Instagram", icon: Instagram, color: "bg-[hsl(var(--instagram))]", charLimit: 2200, hashtagLimit: 30, aspect: "4 / 5", aspectLabel: "4:5 Vertical", recSize: "1080×1350",
    aspects: [
      { ratio: "4 / 5",    label: "4:5 Vertical",    size: "1080×1350" },
      { ratio: "1 / 1",    label: "1:1 Square",       size: "1080×1080" },
      { ratio: "1.91 / 1", label: "1.91:1 Landscape", size: "1080×566"  },
    ],
  },
  facebook:  { name: "Facebook",  icon: Facebook,  color: "bg-[hsl(var(--facebook))]",  charLimit: 63206, hashtagLimit: 30, aspect: "4 / 5", aspectLabel: "4:5 Vertical", recSize: "1080×1350",
    aspects: [
      { ratio: "4 / 5",    label: "4:5 Vertical",    size: "1080×1350" },
      { ratio: "1 / 1",    label: "1:1 Square",       size: "1080×1080" },
      { ratio: "1.91 / 1", label: "1.91:1 Landscape", size: "1200×630"  },
    ],
  },
  linkedin:  { name: "LinkedIn",  icon: Linkedin,  color: "bg-[hsl(var(--linkedin))]",  charLimit: 3000,  hashtagLimit: 5,  aspect: "1.91 / 1", aspectLabel: "1.91:1 Landscape", recSize: "1200×627",
    aspects: [
      { ratio: "1.91 / 1", label: "1.91:1 Landscape", size: "1200×627"  },
      { ratio: "1 / 1",    label: "1:1 Square",        size: "1080×1080" },
      { ratio: "4 / 5",    label: "4:5 Vertical",      size: "1080×1350" },
    ],
  },
  twitter:   { name: "X",         icon: Twitter,   color: "bg-[hsl(var(--twitter))]",   charLimit: 280,   hashtagLimit: 10, aspect: "16 / 9", aspectLabel: "16:9 Landscape",  recSize: "1600×900",
    aspects: [
      { ratio: "16 / 9", label: "16:9 Landscape", size: "1600×900"  },
      { ratio: "1 / 1",  label: "1:1 Square",      size: "1080×1080" },
    ],
  },
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
type MediaItem = { url: string; type: "image" | "video" };
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

  /* ---- media (carousel + per-platform variants) ---- */
  const [sharedMediaList, setSharedMediaList] = useState<MediaItem[]>([]);
  const [platformMediaList, setPlatformMediaList] = useState<Partial<Record<PlatformKey, MediaItem[]>>>({});
  const [mediaVariantsOpen, setMediaVariantsOpen] = useState(false);
  const [dialogCarouselIdx, setDialogCarouselIdx] = useState<Partial<Record<PlatformKey, number>>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<PlatformKey | "shared">("shared");
  const sharedTextareaRef = useRef<HTMLTextAreaElement>(null);
  const overrideTextareaRef = useRef<HTMLTextAreaElement>(null);
  const storyFileInputRef = useRef<HTMLInputElement>(null);
  const reelFileInputRef = useRef<HTMLInputElement>(null);

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

  /* ---- content type ---- */
  const [contentType, setContentType] = useState<"post" | "story" | "reel">("post");
  const [storyMedia, setStoryMedia] = useState<MediaItem | null>(null);
  const [storyCaption, setStoryCaption] = useState("");
  const [reelVideo, setReelVideo] = useState<MediaItem | null>(null);
  const [reelCaption, setReelCaption] = useState("");

  /* ---- story ---- */
  const [publishAsStory, setPublishAsStory] = useState(false);

  /* ---- preview ---- */
  const [previewMode, setPreviewMode] = useState<"tabs" | "grid">("tabs");
  const [activePreview, setActivePreview] = useState<PlatformKey>("instagram");
  const [platformAspect, setPlatformAspect] = useState<Partial<Record<PlatformKey, string>>>({});

  /* ---- derived ---- */
  const selectedAccounts = useMemo(
    () => MOCK_ACCOUNTS.filter((a) => selectedAccountIds.includes(a.id)),
    [selectedAccountIds]
  );
  const selectedPlatforms = useMemo(
    () => Array.from(new Set(selectedAccounts.map((a) => a.platform))) as PlatformKey[],
    [selectedAccounts]
  );

  const storyEligible = selectedPlatforms.some((p) => p === "instagram" || p === "facebook");
  const hasMedia = sharedMediaList.length > 0 || Object.values(platformMediaList).some((arr) => arr && arr.length > 0);

  const getCaptionFor = (p: PlatformKey) => {
    if (customizePerNetwork && overrides[p] && !overrides[p]!.useShared) return overrides[p]!.caption;
    return sharedCaption;
  };
  const getMediaListFor = (p: PlatformKey): MediaItem[] => platformMediaList[p] ?? sharedMediaList;
  const getMediaFor = (p: PlatformKey): MediaItem | null => getMediaListFor(p)[0] ?? null;
  const getAspectFor = (p: PlatformKey): string => platformAspect[p] ?? PLATFORMS[p].aspect;

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
    const isVideo = file.type.startsWith("video/");
    const reader = new FileReader();
    reader.onload = (e) => {
      const item: MediaItem = { url: e.target?.result as string, type: isVideo ? "video" : "image" };
      if (uploadTarget === "shared") {
        setSharedMediaList((prev) => [...prev, item]);
      } else {
        setPlatformMediaList((prev) => ({
          ...prev,
          [uploadTarget]: [...(prev[uploadTarget as PlatformKey] ?? []), item],
        }));
      }
      toast.success(uploadTarget === "shared" ? `${isVideo ? "Video" : "Image"} added to carousel` : `${PLATFORMS[uploadTarget as PlatformKey].name} variant added`);
    };
    reader.readAsDataURL(file);
  };
  const triggerUpload = (target: PlatformKey | "shared") => {
    setUploadTarget(target);
    fileInputRef.current?.click();
  };
  const removeMediaItem = (target: PlatformKey | "shared", index: number) => {
    if (target === "shared") {
      setSharedMediaList((prev) => prev.filter((_, i) => i !== index));
    } else {
      setPlatformMediaList((prev) => {
        const list = (prev[target as PlatformKey] ?? []).filter((_, i) => i !== index);
        const n = { ...prev };
        if (list.length === 0) delete n[target as PlatformKey];
        else n[target as PlatformKey] = list;
        return n;
      });
    }
  };
  const clearPlatformVariant = (p: PlatformKey) => {
    setPlatformMediaList((prev) => { const n = { ...prev }; delete n[p]; return n; });
  };

  const handleStoryFile = (file: File) => {
    const isVideo = file.type.startsWith("video/");
    const reader = new FileReader();
    reader.onload = (e) => {
      setStoryMedia({ url: e.target?.result as string, type: isVideo ? "video" : "image" });
      toast.success(isVideo ? "Story video added" : "Story image added");
    };
    reader.readAsDataURL(file);
  };

  const handleReelFile = (file: File) => {
    if (!file.type.startsWith("video/")) { toast.error("Reels require a video file"); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
      setReelVideo({ url: e.target?.result as string, type: "video" });
      toast.success("Reel video added");
    };
    reader.readAsDataURL(file);
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
      {/* ============ Action bar + Content Type Picker ============ */}
      <div className="flex items-center justify-between gap-2">
        <div className="inline-flex items-center bg-card border border-border rounded-lg p-1 gap-0.5">
          {([
            { id: "post" as const, label: "Post", icon: AlignLeft },
            { id: "story" as const, label: "Story", icon: GalleryVertical },
            { id: "reel" as const, label: "Reel", icon: Play },
          ]).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setContentType(id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap",
                contentType === id
                  ? "gradient-coral text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-3.5 h-3.5" /> {label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => toast.success("Draft saved")}
            className="px-3.5 py-2 rounded-lg text-xs font-medium border border-border bg-card text-foreground hover:bg-accent transition-colors flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" /> Save Draft
          </button>
          <button
            onClick={() => navigate("/client/create/ai")}
            className="px-3.5 py-2 rounded-lg gradient-coral text-primary-foreground text-xs font-semibold shadow-coral hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" /> Create with AI
          </button>
        </div>
      </div>

      {/* ============ 2-col Layout ============ */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* ===== LEFT: Accounts + Media + Composer ===== */}
        <section className="xl:col-span-8 space-y-4">
          <ConnectedAccountsPanel
            accounts={MOCK_ACCOUNTS}
            selectedIds={selectedAccountIds}
            onToggle={toggleAccount}
            onClearAll={() => setSelectedAccountIds([])}
          />

          {/* ---- Story-specific section ---- */}
          {contentType === "story" && (
            <>
              <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-800 text-xs text-pink-700 dark:text-pink-300">
                <GalleryVertical className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>Stories are vertical (9:16) and visible for 24 hours. Supported on Instagram and Facebook.</span>
              </div>
              <div className="bg-card rounded-xl shadow-card p-4 space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-primary" /> Story Media
                  <span className="text-[11px] font-normal text-muted-foreground">Image or video · 9:16 vertical</span>
                </h3>
                {storyMedia ? (
                  <div className="relative group rounded-xl overflow-hidden bg-black mx-auto" style={{ aspectRatio: "9/16", maxHeight: 340 }}>
                    {storyMedia.type === "video"
                      ? <video src={storyMedia.url} className="w-full h-full object-cover" muted playsInline controls />
                      : <img src={storyMedia.url} alt="Story" className="w-full h-full object-cover" />}
                    <button
                      onClick={() => setStoryMedia(null)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => storyFileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-border rounded-lg p-8 hover:border-primary hover:bg-accent/40 transition-all flex flex-col items-center gap-2 text-muted-foreground"
                  >
                    <Upload className="w-7 h-7" />
                    <span className="text-sm font-medium">Upload Story media</span>
                    <span className="text-xs">Image or short video (up to 15s) · 9:16 recommended</span>
                  </button>
                )}
              </div>
              <div className="bg-card rounded-xl shadow-card p-4 space-y-2">
                <h3 className="text-sm font-semibold">Text Overlay <span className="text-[11px] font-normal text-muted-foreground ml-1">Optional</span></h3>
                <textarea
                  value={storyCaption}
                  onChange={(e) => setStoryCaption(e.target.value)}
                  placeholder="Add text shown on your story…"
                  className="w-full min-h-[80px] resize-none text-sm text-foreground placeholder:text-muted-foreground outline-none bg-transparent leading-relaxed"
                  maxLength={200}
                />
                <p className="text-[11px] text-muted-foreground text-right">{storyCaption.length}/200</p>
              </div>
            </>
          )}

          {/* ---- Reel-specific section ---- */}
          {contentType === "reel" && (
            <>
              <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800 text-xs text-violet-700 dark:text-violet-300">
                <Play className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>Reels are short vertical videos (9:16). Supported on Instagram and Facebook. Max 90 seconds on Instagram.</span>
              </div>
              <div className="bg-card rounded-xl shadow-card p-4 space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Play className="w-4 h-4 text-primary" /> Reel Video
                  <span className="text-[11px] font-normal text-muted-foreground">MP4 or MOV · 9:16 · up to 90s</span>
                </h3>
                {reelVideo ? (
                  <div className="relative group rounded-xl overflow-hidden bg-black mx-auto" style={{ aspectRatio: "9/16", maxHeight: 340 }}>
                    <video src={reelVideo.url} className="w-full h-full object-cover" muted playsInline controls />
                    <button
                      onClick={() => setReelVideo(null)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => reelFileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-border rounded-lg p-8 hover:border-primary hover:bg-accent/40 transition-all flex flex-col items-center gap-2 text-muted-foreground"
                  >
                    <Play className="w-7 h-7" />
                    <span className="text-sm font-medium">Upload Reel video</span>
                    <span className="text-xs">MP4, MOV, WEBM — 9:16 vertical recommended</span>
                  </button>
                )}
              </div>
              <div className="bg-card rounded-xl shadow-card overflow-hidden">
                <div className="p-4 space-y-3">
                  <textarea
                    value={reelCaption}
                    onChange={(e) => setReelCaption(e.target.value)}
                    placeholder="Write a caption for your Reel…"
                    className="w-full min-h-[120px] resize-none text-sm text-foreground placeholder:text-muted-foreground outline-none bg-transparent leading-relaxed"
                  />
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <p className="text-[11px] text-muted-foreground">{reelCaption.length}/2200</p>
                    <button
                      onClick={() => setAiOpen(true)}
                      className="text-[11px] font-medium text-primary flex items-center gap-1 hover:underline"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Generate with AI
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ---- Post-specific section ---- */}
          {contentType === "post" && <>
          <div className="bg-card rounded-xl shadow-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-primary" /> Media
                {sharedMediaList.length > 0 && (
                  <span className="text-[11px] font-normal text-muted-foreground">{sharedMediaList.length} item{sharedMediaList.length > 1 ? "s" : ""}</span>
                )}
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

            {/* Thumbnail strip */}
            <div className="flex items-center gap-2 flex-wrap">
              {sharedMediaList.map((item, i) => (
                <div key={i} className="relative group w-16 h-16 rounded-lg overflow-hidden border border-border shrink-0 bg-black">
                  {item.type === "video"
                    ? <video src={item.url} className="w-full h-full object-cover opacity-80" muted playsInline />
                    : <img src={item.url} alt="" className="w-full h-full object-cover" />
                  }
                  {item.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <Play className="w-5 h-5 text-white drop-shadow" />
                    </div>
                  )}
                  <button
                    onClick={() => removeMediaItem("shared", i)}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}
              {sharedMediaList.length === 0 ? (
                <button
                  onClick={() => triggerUpload("shared")}
                  className="w-full border-2 border-dashed border-border rounded-lg p-6 hover:border-primary hover:bg-accent/40 transition-all flex flex-col items-center gap-2 text-muted-foreground"
                >
                  <Upload className="w-6 h-6" />
                  <span className="text-xs font-medium">Upload media</span>
                  <span className="text-[10px]">JPG, PNG, WEBP, MP4, MOV — up to 10 items</span>
                </button>
              ) : sharedMediaList.length < 10 && (
                <button
                  onClick={() => triggerUpload("shared")}
                  className="w-16 h-16 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-accent/40 transition-all flex items-center justify-center text-muted-foreground shrink-0"
                >
                  <Plus className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          <div className="bg-card rounded-xl shadow-card overflow-hidden">
            {/* Editor */}
            <div className="p-4 space-y-3">
              <textarea
                ref={sharedTextareaRef}
                value={sharedCaption}
                onChange={(e) => setSharedCaption(e.target.value)}
                placeholder="Start writing your post…"
                className="w-full min-h-[180px] resize-none text-sm text-foreground placeholder:text-muted-foreground outline-none bg-transparent leading-relaxed"
              />

              {/* Character counter pills */}
              {selectedPlatforms.length > 0 && (
                <div className="flex items-center gap-2 pt-2 border-t border-border flex-wrap">
                  {selectedPlatforms.map((p) => {
                    const meta = PLATFORMS[p];
                    const text = getCaptionFor(p);
                    const len = text.length;
                    const pct = Math.min((len / meta.charLimit) * 100, 100);
                    const over = len > meta.charLimit;
                    const near = !over && pct >= 85;
                    const Icon = meta.icon;
                    return (
                      <div
                        key={p}
                        title={`${meta.name}: ${len.toLocaleString()} / ${meta.charLimit.toLocaleString()} characters`}
                        className={cn(
                          "flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-full border text-xs font-medium transition-colors select-none",
                          over
                            ? "border-destructive/40 bg-destructive/5 text-destructive"
                            : near
                            ? "border-amber-300 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:border-amber-700"
                            : "border-border bg-background text-muted-foreground"
                        )}
                      >
                        <span className={cn("w-5 h-5 rounded-full flex items-center justify-center shrink-0", meta.color)}>
                          <Icon className="w-3 h-3 text-white" />
                        </span>
                        <span className="tabular-nums">{len.toLocaleString()}/{meta.charLimit.toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Toolbar */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-border flex-wrap">
                <RichTextToolbar
                  textareaRef={sharedTextareaRef}
                  value={sharedCaption}
                  onChange={setSharedCaption}
                  onAiClick={() => setAiOpen(true)}
                />
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <Settings2 className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">Customize per platform</span>
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
                        ref={overrideTextareaRef}
                        value={overrides[activeOverrideTab]?.caption ?? sharedCaption}
                        onChange={(e) => setOverrideCaption(activeOverrideTab, e.target.value)}
                        placeholder={`Custom ${PLATFORMS[activeOverrideTab].name} caption…`}
                        className="w-full min-h-[100px] resize-none text-sm bg-transparent outline-none"
                      />
                      <RichTextToolbar
                        textareaRef={overrideTextareaRef}
                        value={overrides[activeOverrideTab]?.caption ?? sharedCaption}
                        onChange={(v) => setOverrideCaption(activeOverrideTab!, v)}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          </>}

          {/* Scheduling */}
          <div className="bg-card rounded-xl shadow-card p-4 space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-primary" /> Scheduling
            </h3>
            <div className="flex items-center bg-muted rounded-lg p-1 gap-0">
              {([
                { id: "now",      label: "Send Now",     icon: Send },
                { id: "schedule", label: "Schedule",     icon: Clock },
              ] as const).map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setScheduleMode(id)}
                  className={cn(
                    "flex-1 py-1.5 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-1.5",
                    scheduleMode === id
                      ? "gradient-coral text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" /> {label}
                </button>
              ))}
            </div>
            {scheduleMode === "schedule" && (
              <div className="grid grid-cols-2 gap-2">
                <input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="px-3 py-2 rounded-lg border border-input text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                <TimePickerPopup value={scheduleTime} onChange={setScheduleTime} />
              </div>
            )}

          </div>

          {/* Also publish as Story */}
          {contentType === "post" && storyEligible && (
            <div className="bg-card rounded-xl shadow-card p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-pink-50 dark:bg-pink-950/40 shrink-0">
                  <GalleryVertical className="w-4 h-4 text-pink-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">Also publish as Story</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    Posts the first image as a Story for selected Instagram and Facebook accounts.
                  </p>
                  {!hasMedia && (
                    <p className="text-xs font-medium text-amber-600 mt-1.5">Add an image to enable story publishing.</p>
                  )}
                </div>
                <label className={cn("relative inline-flex items-center shrink-0 mt-0.5", !hasMedia && "cursor-not-allowed opacity-50")}>
                  <input
                    type="checkbox"
                    checked={publishAsStory}
                    disabled={!hasMedia}
                    onChange={(e) => setPublishAsStory(e.target.checked)}
                    className="sr-only peer"
                  />
                  <span className="w-11 h-6 rounded-full border-2 border-transparent bg-accent peer-checked:bg-primary transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-primary/30 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:w-5 after:h-5 after:rounded-full after:shadow-sm after:transition-transform peer-checked:after:translate-x-5" />
                </label>
              </div>
            </div>
          )}

          {/* Action bar */}
          <div className="flex items-center justify-between gap-2">
            <button onClick={() => toast.success("Post sent for approval.")} className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-accent transition-colors">
              Send for Approval
            </button>
            <button
              onClick={handlePublish}
              className="px-5 py-2.5 rounded-lg gradient-coral text-primary-foreground font-semibold text-sm shadow-coral hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-2"
            >
              {scheduleMode === "now"
              ? <><Send className="w-4 h-4" /> {contentType === "story" ? "Publish Story" : contentType === "reel" ? "Publish Reel" : "Publish Now"}</>
              : <><Clock className="w-4 h-4" /> {contentType === "story" ? "Schedule Story" : contentType === "reel" ? "Schedule Reel" : "Schedule Post"}</>
            }
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
              {contentType === "post" && (
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
              )}
            </div>

            {selectedPlatforms.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                <Globe2 className="w-10 h-10 mx-auto mb-2 opacity-30" />
                Select an account to see a live preview.
              </div>
            ) : contentType === "story" ? (
              <>
                <div className="flex border-b border-border overflow-x-auto bg-muted/20">
                  {selectedPlatforms.filter(p => p === "instagram" || p === "facebook").map((p) => {
                    const meta = PLATFORMS[p]; const Icon = meta.icon;
                    return (
                      <button key={p} onClick={() => setActivePreview(p)}
                        className={cn("flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap",
                          activePreview === p ? "border-primary text-foreground bg-card" : "border-transparent text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Icon className="w-3.5 h-3.5" /> {meta.name}
                      </button>
                    );
                  })}
                  {!selectedPlatforms.some(p => p === "instagram" || p === "facebook") && (
                    <p className="px-4 py-2 text-xs text-muted-foreground">Select Instagram or Facebook for Story preview</p>
                  )}
                </div>
                <div className="p-5">
                  <StoryPreview
                    platform={activePreview}
                    media={storyMedia}
                    caption={storyCaption}
                    handle={selectedAccounts.find((a) => a.platform === activePreview)?.handle ?? ""}
                  />
                </div>
              </>
            ) : contentType === "reel" ? (
              <>
                <div className="flex border-b border-border overflow-x-auto bg-muted/20">
                  {selectedPlatforms.filter(p => p === "instagram" || p === "facebook").map((p) => {
                    const meta = PLATFORMS[p]; const Icon = meta.icon;
                    return (
                      <button key={p} onClick={() => setActivePreview(p)}
                        className={cn("flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap",
                          activePreview === p ? "border-primary text-foreground bg-card" : "border-transparent text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Icon className="w-3.5 h-3.5" /> {meta.name}
                      </button>
                    );
                  })}
                  {!selectedPlatforms.some(p => p === "instagram" || p === "facebook") && (
                    <p className="px-4 py-2 text-xs text-muted-foreground">Select Instagram or Facebook for Reel preview</p>
                  )}
                </div>
                <div className="p-5">
                  <ReelPreview
                    platform={activePreview}
                    media={reelVideo}
                    caption={reelCaption}
                    handle={selectedAccounts.find((a) => a.platform === activePreview)?.handle ?? ""}
                  />
                </div>
              </>
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
                <div className="p-5">
                  <PlatformPreview
                    platform={activePreview}
                    caption={getCaptionFor(activePreview)}
                    mediaList={getMediaListFor(activePreview)}
                    handle={selectedAccounts.find((a) => a.platform === activePreview)?.handle ?? ""}
                    aspectOverride={getAspectFor(activePreview)}
                  />
                </div>
              </>
            ) : (
              <div className="p-3 space-y-3">
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
                        mediaList={getMediaListFor(p)}
                        handle={selectedAccounts.find((a) => a.platform === p)?.handle ?? ""}
                        aspectOverride={getAspectFor(p)}
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

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime,video/webm"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
      />
      <input
        ref={storyFileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleStoryFile(f); e.target.value = ""; }}
      />
      <input
        ref={reelFileInputRef}
        type="file"
        accept="video/mp4,video/quicktime,video/webm"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleReelFile(f); e.target.value = ""; }}
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
          </DialogHeader>

          {/* Info banner */}
          <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-700 dark:text-blue-300">
            <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span>If you don't upload an image here, the common image you selected will be used for all platforms.</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
            {selectedPlatforms.map((p) => {
              const meta = PLATFORMS[p]; const Icon = meta.icon;
              const variantList = platformMediaList[p];
              const displayList = variantList ?? sharedMediaList;
              const isVariant = !!variantList && variantList.length > 0;
              const idx = dialogCarouselIdx[p] ?? 0;
              const safeIdx = Math.min(idx, displayList.length - 1);
              const currentItem = displayList[safeIdx] ?? null;
              const canPrev = safeIdx > 0;
              const canNext = safeIdx < displayList.length - 1;

              return (
                <div key={p} className="rounded-lg border border-border p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={cn("w-6 h-6 rounded flex items-center justify-center text-white", meta.color)}>
                        <Icon className="w-3.5 h-3.5" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold leading-tight">{meta.name}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {meta.aspects
                            ? (meta.aspects.find((o) => o.ratio === getAspectFor(p))?.size ?? meta.recSize)
                            : meta.recSize} · {meta.aspects
                            ? (meta.aspects.find((o) => o.ratio === getAspectFor(p))?.label ?? meta.aspectLabel)
                            : meta.aspectLabel}
                        </p>
                      </div>
                    </div>
                    {isVariant && <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-primary/10 text-primary">Custom</span>}
                  </div>
                  {/* Per-platform aspect ratio picker */}
                  {meta.aspects && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {meta.aspects.map((opt) => {
                        const active = getAspectFor(p) === opt.ratio;
                        return (
                          <button
                            key={opt.ratio}
                            onClick={() => setPlatformAspect((prev) => ({ ...prev, [p]: opt.ratio }))}
                            className={cn(
                              "px-2 py-0.5 rounded text-[10px] font-medium border transition-all",
                              active
                                ? "gradient-coral text-primary-foreground border-transparent"
                                : "bg-background text-muted-foreground border-border hover:border-primary/40"
                            )}
                          >{opt.label}</button>
                        );
                      })}
                    </div>
                  )}

                  {displayList.length > 0 && (
                    <p className="text-[10px] text-muted-foreground">{displayList.length} shared item{displayList.length > 1 ? "s" : ""}</p>
                  )}

                  {/* Carousel preview */}
                  <div className="relative rounded-md border border-border bg-muted/30 overflow-hidden flex items-center justify-center" style={{ aspectRatio: getAspectFor(p) }}>
                    {currentItem
                      ? currentItem.type === "video"
                        ? <video src={currentItem.url} className="w-full h-full object-cover" muted autoPlay loop playsInline />
                        : <img src={currentItem.url} alt={meta.name} className="w-full h-full object-cover" />
                      : <span className="text-[11px] text-muted-foreground">No media</span>
                    }
                    {displayList.length > 1 && (
                      <>
                        <button
                          onClick={() => setDialogCarouselIdx((prev) => ({ ...prev, [p]: Math.max(0, safeIdx - 1) }))}
                          disabled={!canPrev}
                          className="absolute left-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center disabled:opacity-30 hover:bg-black/70 transition-colors"
                        >
                          <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                        </button>
                        <button
                          onClick={() => setDialogCarouselIdx((prev) => ({ ...prev, [p]: Math.min(displayList.length - 1, safeIdx + 1) }))}
                          disabled={!canNext}
                          className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center disabled:opacity-30 hover:bg-black/70 transition-colors"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                        {/* Dot indicators */}
                        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1">
                          {displayList.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setDialogCarouselIdx((prev) => ({ ...prev, [p]: i }))}
                              className={cn("w-1.5 h-1.5 rounded-full transition-colors", i === safeIdx ? "bg-white" : "bg-white/50")}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => triggerUpload(p)}
                      className="flex-1 px-2 py-1.5 rounded-md border border-border text-xs font-medium hover:bg-accent transition-colors flex items-center justify-center gap-1"
                    >
                      <Upload className="w-3 h-3" /> Upload variant
                    </button>
                    {isVariant && (
                      <button onClick={() => clearPlatformVariant(p)} className="px-2 py-1.5 rounded-md border border-border text-xs hover:bg-destructive/10 hover:text-destructive transition-colors">
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
          <button onClick={() => navigate('/client/connect')} className="flex-1 py-2 rounded-lg border border-dashed border-border text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-1.5">
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
function PlatformPreview({ platform, caption, mediaList, handle, aspectOverride }: { platform: PlatformKey; caption: string; mediaList: MediaItem[]; handle: string; aspectOverride?: string }) {
  const [idx, setIdx] = useState(0);
  const safeIdx = Math.min(idx, Math.max(0, mediaList.length - 1));
  const currentItem = mediaList[safeIdx] ?? null;
  const isCarousel = mediaList.length > 1;

  const meta = PLATFORMS[platform];
  const aspect = aspectOverride ?? meta.aspect;
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

  const MediaSlot = (
    <div className="relative w-full bg-muted overflow-hidden" style={{ aspectRatio: aspect }}>
      {currentItem
        ? currentItem.type === "video"
          ? <video src={currentItem.url} className="w-full h-full object-cover" muted autoPlay loop playsInline />
          : <img src={currentItem.url} alt="Preview" className="w-full h-full object-cover" />
        : <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-10 h-10 opacity-30 text-muted-foreground" /></div>
      }
      {isCarousel && (
        <>
          <button
            onClick={() => setIdx((i) => Math.max(0, i - 1))}
            disabled={safeIdx === 0}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center disabled:opacity-30 hover:bg-black/70 transition-colors"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
          </button>
          <button
            onClick={() => setIdx((i) => Math.min(mediaList.length - 1, i + 1))}
            disabled={safeIdx === mediaList.length - 1}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center disabled:opacity-30 hover:bg-black/70 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {mediaList.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)} className={cn("w-1.5 h-1.5 rounded-full transition-colors", i === safeIdx ? "bg-white" : "bg-white/50")} />
            ))}
          </div>
        </>
      )}
    </div>
  );

  if (platform === "twitter") {
    return (
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex gap-3 p-3">
          <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0", meta.color)}>{initial}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm"><span className="font-semibold">{handle.replace(/^@/, "") || "Your account"}</span> <span className="text-muted-foreground">{handle.startsWith("@") ? handle : `@${handle}`} · now</span></p>
            <p className="text-sm leading-relaxed mt-0.5 whitespace-pre-wrap break-words">{caption || <span className="text-muted-foreground italic">Your tweet will appear here…</span>}</p>
            {currentItem && (
              <div className="mt-2 rounded-2xl overflow-hidden border border-border">{MediaSlot}</div>
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
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {Header}
        {MediaSlot}
        <div className="flex items-center gap-3 p-3 text-foreground">
          <Heart className="w-5 h-5" /><MessageCircle className="w-5 h-5" /><Send className="w-5 h-5" />
        </div>
        {Caption}
      </div>
    );
  }

  if (platform === "linkedin") {
    return (
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {Header}
        {Caption}
        {MediaSlot}
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
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {Header}
      {Caption}
      {MediaSlot}
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

function StoryPreview({ platform, media, caption, handle }: {
  platform: PlatformKey; media: MediaItem | null; caption: string; handle: string;
}) {
  const meta = PLATFORMS[platform];
  const initial = handle.replace(/^@/, "").charAt(0).toUpperCase() || "N";

  return (
    <div className="relative rounded-2xl overflow-hidden bg-black w-full" style={{ aspectRatio: "9/16" }}>
      {media ? (
        media.type === "video"
          ? <video src={media.url} className="absolute inset-0 w-full h-full object-cover" muted autoPlay loop playsInline />
          : <img src={media.url} alt="Story" className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
          <GalleryVertical className="w-14 h-14 text-white/15" />
        </div>
      )}

      {/* Top: progress bars + user */}
      <div className="absolute top-0 left-0 right-0 p-3 z-10">
        <div className="flex gap-0.5 mb-2.5">
          <div className="flex-1 h-0.5 rounded-full bg-white/80" />
          <div className="flex-1 h-0.5 rounded-full bg-white/30" />
          <div className="flex-1 h-0.5 rounded-full bg-white/30" />
        </div>
        <div className="flex items-center gap-2">
          <div className={cn("w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] font-bold shrink-0", meta.color)}>
            {initial}
          </div>
          <span className="text-white text-xs font-semibold drop-shadow">{handle || "Your account"}</span>
          <span className="text-white/60 text-[10px]">· now</span>
        </div>
      </div>

      {/* Text overlay */}
      {caption && (
        <div className="absolute bottom-14 left-0 right-0 px-4 z-10">
          <p className="text-white text-sm text-center bg-black/50 rounded-xl px-3 py-2 backdrop-blur-sm leading-relaxed">
            {caption}
          </p>
        </div>
      )}
      {!caption && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <p className="text-white/30 text-xs italic">Your story will appear here…</p>
        </div>
      )}

      {/* Bottom reply bar */}
      <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center gap-2 z-10">
        <div className="flex-1 rounded-full border border-white/30 px-3 py-1.5">
          <span className="text-white/40 text-xs">Reply…</span>
        </div>
        <Heart className="w-5 h-5 text-white" />
        <Send className="w-5 h-5 text-white" />
      </div>
    </div>
  );
}

function ReelPreview({ platform, media, caption, handle }: {
  platform: PlatformKey; media: MediaItem | null; caption: string; handle: string;
}) {
  const meta = PLATFORMS[platform];
  const initial = handle.replace(/^@/, "").charAt(0).toUpperCase() || "N";

  return (
    <div className="relative rounded-2xl overflow-hidden bg-black w-full" style={{ aspectRatio: "9/16" }}>
      {media ? (
        <video src={media.url} className="absolute inset-0 w-full h-full object-cover" muted autoPlay loop playsInline />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
          <Play className="w-14 h-14 text-white/15" />
        </div>
      )}

      {/* Right side interaction icons */}
      <div className="absolute right-3 bottom-24 z-10 flex flex-col items-center gap-5">
        <div className="flex flex-col items-center gap-0.5">
          <Heart className="w-6 h-6 text-white" />
          <span className="text-white text-[10px]">0</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <MessageCircle className="w-6 h-6 text-white" />
          <span className="text-white text-[10px]">0</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <Send className="w-6 h-6 text-white" />
          <span className="text-white text-[10px]">0</span>
        </div>
        <MoreHorizontal className="w-6 h-6 text-white" />
      </div>

      {/* Bottom: user info + caption + audio */}
      <div className="absolute bottom-0 left-0 right-14 p-3 z-10">
        <div className="flex items-center gap-2 mb-1.5">
          <div className={cn("w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold shrink-0", meta.color)}>
            {initial}
          </div>
          <span className="text-white text-sm font-semibold drop-shadow">{handle || "Your account"}</span>
          <span className="border border-white/50 rounded text-white/80 text-[10px] px-1.5 py-0.5">Follow</span>
        </div>
        {caption ? (
          <p className="text-white text-xs leading-relaxed line-clamp-2 drop-shadow">{caption}</p>
        ) : (
          <p className="text-white/30 text-xs italic">Your caption will appear here…</p>
        )}
        <div className="flex items-center gap-1.5 mt-1.5">
          <Music className="w-3 h-3 text-white/60" />
          <span className="text-white/50 text-[10px] truncate">Original audio · {handle || "your account"}</span>
        </div>
      </div>
    </div>
  );
}


