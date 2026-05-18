import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles, Check, ChevronRight, ChevronLeft, AlertCircle, X,
  Copy, Upload, BarChart2, Search, ChevronDown, Calendar, Eye,
  Hash, Wand2, SkipForward, GripVertical, Music, ArrowLeft, Edit2,
  Save, MoreHorizontal, MessageCircle, Send, ImageIcon, Loader2,
  RefreshCw, Globe2, Heart, Repeat2, Instagram, Facebook, Linkedin,
  Twitter, Plus,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ── Platform model (mirrors CreatePage) ──────────────────────────────────────

type PlatformKey = "instagram" | "facebook" | "linkedin" | "twitter";
type AspectOption = { ratio: string; label: string; size: string };
const PLATFORMS: Record<PlatformKey, {
  name: string; icon: typeof Instagram; color: string; charLimit: number;
  aspects?: AspectOption[];
}> = {
  instagram: { name: "Instagram", icon: Instagram, color: "bg-[hsl(var(--instagram))]", charLimit: 2200,
    aspects: [{ ratio: "4 / 5", label: "4:5 Vertical", size: "1080×1350" }, { ratio: "1 / 1", label: "1:1 Square", size: "1080×1080" }, { ratio: "1.91 / 1", label: "1.91:1 Landscape", size: "1080×566" }] },
  facebook:  { name: "Facebook",  icon: Facebook,  color: "bg-[hsl(var(--facebook))]",  charLimit: 63206,
    aspects: [{ ratio: "4 / 5", label: "4:5 Vertical", size: "1080×1350" }, { ratio: "1 / 1", label: "1:1 Square", size: "1080×1080" }, { ratio: "1.91 / 1", label: "1.91:1 Landscape", size: "1200×630" }] },
  linkedin:  { name: "LinkedIn",  icon: Linkedin,  color: "bg-[hsl(var(--linkedin))]",  charLimit: 3000,
    aspects: [{ ratio: "1.91 / 1", label: "1.91:1 Landscape", size: "1200×627" }, { ratio: "1 / 1", label: "1:1 Square", size: "1080×1080" }] },
  twitter:   { name: "X",         icon: Twitter,   color: "bg-[hsl(var(--twitter))]",   charLimit: 280,
    aspects: [{ ratio: "16 / 9", label: "16:9 Landscape", size: "1600×900" }, { ratio: "1 / 1", label: "1:1 Square", size: "1080×1080" }] },
};

type Account = { id: string; platform: PlatformKey; handle: string; name: string };
const MOCK_ACCOUNTS: Account[] = [
  { id: "fb-1", platform: "facebook",  handle: "AI trial",       name: "AI trial"       },
  { id: "fb-2", platform: "facebook",  handle: "AI Page trial",  name: "AI Page trial"  },
  { id: "fb-3", platform: "facebook",  handle: "@AI trial",      name: "AI trial"       },
  { id: "fb-4", platform: "facebook",  handle: "@AI Page trial", name: "AI Page trial"  },
  { id: "ig-1", platform: "instagram", handle: "@pank_aaj2000",  name: "pank_aaj2000"   },
  { id: "li-1", platform: "linkedin",  handle: "Harsh Kewalramani", name: "Harsh Kewalramani" },
  { id: "tw-1", platform: "twitter",   handle: "@HangerMaan",    name: "Hanger Maan"    },
];

// ── AI-module constants ───────────────────────────────────────────────────────

const AI_TONES = [
  "Professional/Formal", "Friendly/Casual", "Enthusiastic/Excited", "Humorous/Playful",
  "Inspirational/Motivational", "Educational/Informative", "Conversational",
  "Empathetic/Caring", "Bold/Confident", "Custom",
];
const AI_STYLES = ["Short and punchy", "Detailed and Descriptive", "Question-based (engaging)", "Story-driven", "Direct and promotional"];
const STEPS = ["Topic & Tone", "Caption", "Visuals", "Hashtags"] as const;

const MOCK_HASHTAGS = [
  { tag: "#NewLaunch",           reach: "HIGH",   postsLabel: "9.9M",   postsNum: 9_900_000 },
  { tag: "#ComingSoon",          reach: "HIGH",   postsLabel: "2.3M",   postsNum: 2_300_000 },
  { tag: "#ExcitingNews",        reach: "HIGH",   postsLabel: "7.2M",   postsNum: 7_200_000 },
  { tag: "#ExclusiveExperience", reach: "HIGH",   postsLabel: "1.8M",   postsNum: 1_800_000 },
  { tag: "#LimitedEdition",      reach: "HIGH",   postsLabel: "6.5M",   postsNum: 6_500_000 },
  { tag: "#JoinTheMovement",     reach: "HIGH",   postsLabel: "8.4M",   postsNum: 8_400_000 },
  { tag: "#SpecialAnnouncement", reach: "MEDIUM", postsLabel: "204.5K", postsNum: 204_500   },
  { tag: "#ExperienceMore",      reach: "MEDIUM", postsLabel: "521.6K", postsNum: 521_600   },
  { tag: "#SomethingNew",        reach: "MEDIUM", postsLabel: "905.1K", postsNum: 905_100   },
  { tag: "#StayTuned",           reach: "MEDIUM", postsLabel: "700.8K", postsNum: 700_800   },
];
const GENERATED_VISUALS = [
  "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=600&h=600&fit=crop",
];
const REFINE_OPTIONS = ["Make it shorter", "Make it longer", "More formal", "More casual", "Add a question", "Add call-to-action"];
const DISPLAY_MODES  = ["Curated Rank", "Relevancy Score", "Reach Potential"];
const REACH_FILTERS  = ["All Reach Levels", "High Reach (1M+)", "Medium Reach (100K+)", "Low Reach (Under 100K)"];
const RAPID_PRESETS  = ["Recommended AI Mix", "Top 5 Relevant", "Select All Suggested", "Clear All Selected"];
const MAX_CHARS = 63_206;

// ── Small helpers ─────────────────────────────────────────────────────────────

function approxReadTime(text: string) {
  const secs = Math.round((text.trim().split(/\s+/).filter(Boolean).length / 200) * 60);
  return secs <= 1 ? "~1 sec read" : `~${secs} sec read`;
}
function fmtReach(n: number) {
  if (n >= 1_000_000) return `~${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `~${(n / 1_000).toFixed(1)}K`;
  return `~${n}`;
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="relative inline-flex items-center shrink-0 cursor-pointer">
      <input
        type="checkbox"
        checked={on}
        onChange={e => onChange(e.target.checked)}
        className="sr-only peer"
      />
      <span className="w-11 h-6 rounded-full border-2 border-transparent bg-muted-foreground/30 peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:w-5 after:h-5 after:rounded-full after:shadow-sm after:transition-transform peer-checked:after:translate-x-5" />
    </label>
  );
}

interface DropProps { label?: string; value: string; options: string[]; open: boolean; onToggle: () => void; onChange: (v: string) => void; dark?: boolean; }
function Drop({ label, value, options, open, onToggle, onChange, dark }: DropProps) {
  return (
    <div className="relative">
      {label && <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">{label}</div>}
      <button onClick={onToggle} className={cn("flex items-center justify-between gap-2 w-full px-3 py-2 rounded-lg border text-sm font-medium transition-colors",
        dark ? "bg-slate-900 border-slate-700 text-white hover:bg-slate-800" : "bg-card border-border text-foreground hover:bg-accent")}>
        <span className="truncate">{value}</span><ChevronDown className="w-3.5 h-3.5 shrink-0" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-card border border-border rounded-xl shadow-xl overflow-hidden min-w-full w-max max-w-[240px]">
          {options.map(opt => (
            <button key={opt} onClick={() => { onChange(opt); onToggle(); }}
              className={cn("w-full text-left px-3 py-2 text-sm transition-colors", opt === value ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent")}>
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Platform post preview (same quality as CreatePage) ────────────────────────

function PlatformPreview({ platform, caption, handle, visualUrl, aspectOverride }: {
  platform: PlatformKey; caption: string; handle: string; visualUrl: string | null; aspectOverride?: string;
}) {
  const meta   = PLATFORMS[platform];
  const aspect = aspectOverride ?? (meta.aspects?.[0].ratio ?? "1 / 1");
  const Icon   = meta.icon;
  const initial = handle.replace(/^@/, "").charAt(0).toUpperCase() || "A";

  const Header = (
    <div className="flex items-center gap-2.5 p-3">
      <div className={cn("w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0", meta.color)}>{initial}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate leading-tight">{handle || "Your account"}</p>
        <p className="text-[11px] text-muted-foreground flex items-center gap-0.5">Just now · <Globe2 className="w-2.5 h-2.5 inline" /></p>
      </div>
      <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
    </div>
  );

  const Caption = caption
    ? <p className="px-3 pb-3 text-sm leading-relaxed whitespace-pre-wrap break-words">{caption}</p>
    : <p className="px-3 pb-3 text-sm text-muted-foreground italic">Your caption will appear here…</p>;

  const MediaSlot = (
    <div className="w-full bg-muted overflow-hidden" style={{ aspectRatio: aspect }}>
      {visualUrl
        ? <img src={visualUrl} alt="Preview" className="w-full h-full object-cover" />
        : <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-10 h-10 opacity-20 text-muted-foreground" /></div>
      }
    </div>
  );

  if (platform === "twitter") return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex gap-3 p-3">
        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0", meta.color)}>{initial}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm"><span className="font-semibold">{handle.replace(/^@/, "")}</span> <span className="text-muted-foreground text-xs">{handle.startsWith("@") ? handle : `@${handle}`} · now</span></p>
          <p className="text-sm leading-relaxed mt-0.5 whitespace-pre-wrap break-words">{caption || <span className="text-muted-foreground italic">Your tweet will appear here…</span>}</p>
          {visualUrl && <div className="mt-2 rounded-2xl overflow-hidden border border-border">{MediaSlot}</div>}
          <div className="flex justify-between mt-2 max-w-xs text-muted-foreground text-xs">
            <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> 0</span>
            <span className="flex items-center gap-1"><Repeat2 className="w-3.5 h-3.5" /> 0</span>
            <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> 0</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (platform === "instagram") return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {Header}{MediaSlot}
      <div className="flex items-center gap-3 px-3 py-2 text-foreground">
        <Heart className="w-5 h-5" /><MessageCircle className="w-5 h-5" /><Send className="w-5 h-5" />
      </div>
      {Caption}
    </div>
  );

  if (platform === "linkedin") return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {Header}{Caption}{MediaSlot}
      <div className="border-t border-border px-3 py-2 flex justify-around text-xs text-muted-foreground">
        <span>👍 Like</span>
        <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> Comment</span>
        <span className="flex items-center gap-1"><Repeat2 className="w-3.5 h-3.5" /> Repost</span>
        <span className="flex items-center gap-1"><Send className="w-3.5 h-3.5" /> Send</span>
      </div>
    </div>
  );

  // Facebook
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {Header}{Caption}{MediaSlot}
      <div className="px-3 py-1.5 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border">
        <span>0 reactions</span><span>0 comments</span>
      </div>
      <div className="border-t border-border px-3 py-1.5 flex justify-around text-sm text-muted-foreground">
        <button className="flex items-center gap-1 hover:text-foreground transition-colors text-xs">👍 Like</button>
        <button className="flex items-center gap-1 hover:text-foreground transition-colors text-xs"><MessageCircle className="w-3.5 h-3.5" /> Comment</button>
        <button className="flex items-center gap-1 hover:text-foreground transition-colors text-xs"><Send className="w-3.5 h-3.5" /> Share</button>
      </div>
    </div>
  );
}

// ── Accounts Panel (mirrors CreatePage) ───────────────────────────────────────

function AccountsPanel({ selectedIds, onToggle, onClearAll, collapsed, onToggleCollapse }: {
  selectedIds: string[]; onToggle: (id: string) => void; onClearAll: () => void;
  collapsed: boolean; onToggleCollapse: () => void;
}) {
  const grouped = useMemo(() => {
    const m: Record<PlatformKey, Account[]> = { instagram: [], facebook: [], linkedin: [], twitter: [] };
    MOCK_ACCOUNTS.forEach(a => m[a.platform].push(a));
    return m;
  }, []);

  const selectedAccounts = MOCK_ACCOUNTS.filter(a => selectedIds.includes(a.id));

  return (
    <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
      <button onClick={onToggleCollapse}
        className="w-full flex items-center gap-2 px-4 py-3 hover:bg-accent/40 transition-colors text-left">
        <Globe2 className="w-4 h-4 text-primary shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">Accounts</span>
            <span className="text-[11px] font-medium text-muted-foreground">{selectedIds.length}/{MOCK_ACCOUNTS.length}</span>
          </div>
          {collapsed && selectedAccounts.length > 0 && (
            <div className="flex items-center gap-1 mt-1.5 flex-wrap">
              {selectedAccounts.slice(0, 5).map(a => {
                const meta = PLATFORMS[a.platform]; const Icon = meta.icon;
                return (
                  <span key={a.id} className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-accent text-[10px] font-medium">
                    <span className={cn("w-3 h-3 rounded-sm flex items-center justify-center text-white", meta.color)}><Icon className="w-2 h-2" /></span>
                    <span className="truncate max-w-[72px]">{a.handle}</span>
                  </span>
                );
              })}
              {selectedAccounts.length > 5 && <span className="text-[10px] text-muted-foreground">+{selectedAccounts.length - 5}</span>}
            </div>
          )}
          {collapsed && selectedAccounts.length === 0 && (
            <p className="text-[11px] text-muted-foreground mt-0.5">No accounts selected — tap to choose</p>
          )}
        </div>
        {selectedIds.length > 0 && !collapsed && (
          <span role="button" onClick={e => { e.stopPropagation(); onClearAll(); }}
            className="text-[11px] font-medium text-muted-foreground hover:text-destructive px-1">Clear</span>
        )}
        <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform shrink-0", !collapsed && "rotate-180")} />
      </button>

      {!collapsed && (
        <div className="px-4 pb-4 space-y-3 border-t border-border pt-3 max-h-[420px] overflow-y-auto">
          {(Object.keys(grouped) as PlatformKey[]).map(p => {
            if (!grouped[p].length) return null;
            const meta = PLATFORMS[p]; const Icon = meta.icon;
            const allSel = grouped[p].every(a => selectedIds.includes(a.id));
            return (
              <div key={p}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                    <Icon className="w-3.5 h-3.5" /> {meta.name}
                  </div>
                  <button
                    onClick={() => grouped[p].forEach(a => { if (allSel ? selectedIds.includes(a.id) : !selectedIds.includes(a.id)) onToggle(a.id); })}
                    className="text-[11px] font-medium text-primary hover:underline">
                    {allSel ? "Deselect all" : "Select all"}
                  </button>
                </div>
                <div className="space-y-1">
                  {grouped[p].map(a => {
                    const checked = selectedIds.includes(a.id);
                    return (
                      <button key={a.id} onClick={() => onToggle(a.id)}
                        className={cn("w-full flex items-center gap-2.5 px-2 py-2 rounded-lg border transition-all text-left",
                          checked ? "border-primary bg-primary/5" : "border-transparent hover:bg-accent/60")}>
                        <div className="relative shrink-0">
                          <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold", meta.color)}>
                            {a.name.charAt(0).toUpperCase()}
                          </div>
                          <span className={cn("absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-card flex items-center justify-center", meta.color)}>
                            <Icon className="w-2 h-2 text-white" />
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{a.name}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{a.handle}</p>
                        </div>
                        <span className={cn("w-4 h-4 rounded border flex items-center justify-center transition-all shrink-0",
                          checked ? "bg-primary border-primary" : "border-border")}>
                          {checked && <Check className="w-3 h-3 text-primary-foreground" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
          <button className="w-full py-2 rounded-lg border border-dashed border-border text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-1.5">
            <Plus className="w-3.5 h-3.5" /> Connect new account
          </button>
          {selectedIds.length > 0 && (
            <button onClick={onToggleCollapse}
              className="w-full py-2 rounded-lg gradient-coral text-primary-foreground text-xs font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-1.5">
              <Check className="w-3.5 h-3.5" /> Done · {selectedIds.length} selected
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Live Preview Panel (full quality, matches CreatePage) ─────────────────────

function LivePreviewPanel({ caption, visualUrl, selectedAccountIds }: {
  caption: string; visualUrl: string | null; selectedAccountIds: string[];
}) {
  const selectedAccounts = MOCK_ACCOUNTS.filter(a => selectedAccountIds.includes(a.id));
  const platforms = useMemo(
    () => Array.from(new Set(selectedAccounts.map(a => a.platform))) as PlatformKey[],
    [selectedAccounts]
  );

  const [previewMode, setPreviewMode] = useState<"tabs" | "grid">("tabs");
  const [activeTab, setActiveTab]     = useState<PlatformKey>("facebook");

  // Keep activeTab valid
  useEffect(() => {
    if (platforms.length > 0 && !platforms.includes(activeTab)) setActiveTab(platforms[0]);
  }, [platforms, activeTab]);

  const getHandle = (p: PlatformKey) => selectedAccounts.find(a => a.platform === p)?.handle ?? "";

  return (
    <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Eye className="w-4 h-4 text-primary" /> Live Preview
        </h3>
        <div className="flex bg-accent rounded-md p-0.5 text-[11px] font-medium">
          <button onClick={() => setPreviewMode("tabs")}
            className={cn("px-2 py-1 rounded transition-colors", previewMode === "tabs" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground")}>
            Tabs
          </button>
          <button onClick={() => setPreviewMode("grid")}
            className={cn("px-2 py-1 rounded transition-colors", previewMode === "grid" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground")}>
            Side-by-side
          </button>
        </div>
      </div>

      {platforms.length === 0 ? (
        <div className="p-8 text-center text-sm text-muted-foreground">
          <Globe2 className="w-10 h-10 mx-auto mb-2 opacity-20" />
          Select an account above to see a live preview.
        </div>
      ) : previewMode === "tabs" ? (
        <>
          {/* Platform tabs */}
          <div className="flex border-b border-border overflow-x-auto bg-muted/20">
            {platforms.map(p => {
              const meta = PLATFORMS[p]; const Icon = meta.icon;
              return (
                <button key={p} onClick={() => setActiveTab(p)}
                  className={cn("flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap",
                    activeTab === p ? "border-primary text-foreground bg-card" : "border-transparent text-muted-foreground hover:text-foreground")}>
                  <Icon className="w-3.5 h-3.5" /> {meta.name}
                </button>
              );
            })}
          </div>

          <div className="p-5">
            <PlatformPreview platform={activeTab} caption={caption} handle={getHandle(activeTab)}
              visualUrl={visualUrl} />
          </div>
        </>
      ) : (
        <div className="p-3 space-y-3 max-h-[600px] overflow-y-auto">
          {platforms.map(p => {
            const meta = PLATFORMS[p]; const Icon = meta.icon;
            return (
              <details key={p} open className="rounded-lg border border-border overflow-hidden group">
                <summary className="flex items-center gap-2 px-3 py-2 bg-muted/30 cursor-pointer text-xs font-semibold list-none">
                  <ChevronRight className="w-3.5 h-3.5 transition-transform group-open:rotate-90" />
                  <Icon className="w-3.5 h-3.5" /> {meta.name}
                </summary>
                <div className="p-3">
                  <PlatformPreview platform={p} caption={caption} handle={getHandle(p)}
                    visualUrl={visualUrl} />
                </div>
              </details>
            );
          })}
        </div>
      )}

      <div className="px-4 py-2.5 border-t border-border bg-muted/20 text-[11px] text-muted-foreground text-center">
        Preview approximates how content will display. Actual rendering may differ.
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function CreateAiPage() {
  const navigate   = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(0);

  // Accounts
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>(["fb-1", "ig-1", "li-1", "tw-1"]);
  const [accountsCollapsed, setAccountsCollapsed]   = useState(true);

  // Step 0
  const [description, setDescription]   = useState("");
  const [tones, setTones]               = useState<string[]>([]);
  const [style, setStyle]               = useState("Short and punchy");
  const [audience, setAudience]         = useState("");
  const [keywords, setKeywords]         = useState("");
  const [aiPlan, setAiPlan]             = useState<"free" | "premium">("free");
  const [emojiEnabled, setEmojiEnabled] = useState(true);

  // Step 1
  const [captionLoading, setCaptionLoading] = useState(false);
  const [captionOptions, setCaptionOptions] = useState<string[]>([]);
  const [chosenIdx, setChosenIdx]           = useState(-1);
  const [refineOpen, setRefineOpen]         = useState(-1);
  const [refiningIdx, setRefiningIdx]       = useState(-1);
  const [editingIdx, setEditingIdx]         = useState(-1);
  const [editingText, setEditingText]       = useState("");
  const [writingOwn, setWritingOwn]         = useState(false);
  const [ownCaptionText, setOwnCaptionText] = useState("");
  const [variationsUsed, setVariationsUsed] = useState(3);

  // Step 2
  const [visualSubStep, setVisualSubStep]     = useState<"pick" | "generating" | "results" | "done">("pick");
  const [generatedVisuals, setGeneratedVisuals] = useState<string[]>([]);
  const [chosenVisualIdx, setChosenVisualIdx] = useState(-1);
  const [uploadedVisual, setUploadedVisual]   = useState<string | null>(null);

  // Step 3
  const [hashSearch, setHashSearch]     = useState("");
  const [displayMode, setDisplayMode]   = useState("Curated Rank");
  const [reachFilter, setReachFilter]   = useState("All Reach Levels");
  const [displayOpen, setDisplayOpen]   = useState(false);
  const [reachOpen, setReachOpen]       = useState(false);
  const [rapidOpen, setRapidOpen]       = useState(false);
  const [chosenTags, setChosenTags]     = useState<string[]>(["#NewLaunch", "#ComingSoon", "#ExcitingNews", "#ExclusiveExperience", "#LimitedEdition"]);
  const [customTag, setCustomTag]       = useState("");
  const [personalTags, setPersonalTags] = useState<string[]>([]);
  const [scheduleMode, setScheduleMode] = useState<"now" | "schedule">("now");
  const [publishAsStory, setPublishAsStory] = useState(false);

  // Derived
  const wordCount     = description.trim().split(/\s+/).filter(Boolean).length;
  const charCount     = description.length;
  const canGenerate   = wordCount >= 4;
  const chosenCaption = chosenIdx >= 0 ? (captionOptions[chosenIdx] ?? "") : "";
  const activeVisualUrl: string | null = uploadedVisual ?? (chosenVisualIdx >= 0 ? generatedVisuals[chosenVisualIdx] ?? null : null);

  const filteredTags = useMemo(() => {
    let list = [...MOCK_HASHTAGS, ...personalTags.map(t => ({ tag: t, reach: "CUSTOM", postsLabel: "—", postsNum: 0 }))];
    if (hashSearch)  list = list.filter(h => h.tag.toLowerCase().includes(hashSearch.toLowerCase()));
    if (reachFilter === "High Reach (1M+)")         list = list.filter(h => h.postsNum >= 1_000_000);
    if (reachFilter === "Medium Reach (100K+)")     list = list.filter(h => h.postsNum >= 100_000 && h.postsNum < 1_000_000);
    if (reachFilter === "Low Reach (Under 100K)")   list = list.filter(h => h.postsNum < 100_000);
    return list;
  }, [hashSearch, reachFilter, personalTags]);

  const totalReach = useMemo(() =>
    fmtReach(chosenTags.reduce((s, tag) => s + (MOCK_HASHTAGS.find(x => x.tag === tag)?.postsNum ?? 0), 0)),
    [chosenTags]);

  // Effects
  useEffect(() => {
    if (step === 1 && captionOptions.length === 0 && !captionLoading) generateCaptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // Actions
  function toggleAccount(id: string) {
    setSelectedAccountIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  }

  function generateCaptions() {
    setCaptionLoading(true); setCaptionOptions([]); setChosenIdx(-1);
    setTimeout(() => {
      const base = description.trim() || "your topic";
      setCaptionOptions([
        `Ready to experience ${base}? ✨ We have something amazing waiting for you! Who's excited to join in? 😊`,
        `Ready for ${base}? ✨ Get yours today and join the excitement! Who's in? 🚀`,
        `Ready to transform your experience with ${base}? 🚀 We are bringing you something truly special that you won't want to miss! Whether you're looking for a fresh start or a professional upgrade, we've got you covered.\n\nAre you ready to see the difference for yourself? Let us know in the comments! 👇 ✨`,
      ]);
      setCaptionLoading(false);
    }, 1200);
  }

  function refineCaption(idx: number, opt: string) {
    setRefineOpen(-1);
    setRefiningIdx(idx);
    setTimeout(() => {
      const base = captionOptions[idx];
      let refined = base;
      if (opt === "Make it shorter")        refined = base.split(/[.!?]/)[0].trim() + ".";
      else if (opt === "Make it longer")    refined = base + "\n\nWe can't wait to share this with you! Stay tuned for more updates and exciting details coming your way. 🎉";
      else if (opt === "More formal")       refined = base.replace(/[!😊🚀✨👇🎉💬]/g, "").replace(/\s+/g, " ").trim() + ".";
      else if (opt === "More casual")       refined = base + "\n\nDrop a comment below — we'd love to hear your thoughts! 👇";
      else if (opt === "Add a question")    refined = base + "\n\nWhat do you think? Let us know in the comments! 💬";
      else if (opt === "Add call-to-action") refined = base + "\n\n👉 Click the link in bio to learn more and get started today!";
      setCaptionOptions(p => p.map((c, i) => i === idx ? refined : c));
      setRefiningIdx(-1);
    }, 900);
  }

  function startEdit(i: number) {
    setEditingIdx(i);
    setEditingText(captionOptions[i]);
  }

  function saveEdit() {
    if (editingIdx < 0) return;
    const trimmed = editingText.trim();
    setCaptionOptions(p => p.map((c, i) => i === editingIdx ? (trimmed || c) : c));
    setEditingIdx(-1);
    toast.success("Caption updated");
  }

  function addOwnCaption() {
    const text = ownCaptionText.trim();
    if (!text) return;
    const newIdx = captionOptions.length;
    setCaptionOptions(p => [...p, text]);
    setChosenIdx(newIdx);
    setWritingOwn(false);
    setOwnCaptionText("");
    toast.success("Caption added");
  }

  function triggerAiVisuals() {
    setVisualSubStep("generating"); setGeneratedVisuals([]); setChosenVisualIdx(-1);
    setTimeout(() => { setGeneratedVisuals(GENERATED_VISUALS); setVisualSubStep("results"); }, 1800);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { setUploadedVisual(ev.target?.result as string); setChosenVisualIdx(-1); setVisualSubStep("done"); };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function handleRapidPreset(preset: string) {
    setRapidOpen(false);
    if (preset === "Recommended AI Mix")      setChosenTags(MOCK_HASHTAGS.filter((_, i) => [0,1,2,4,6].includes(i)).map(h => h.tag));
    else if (preset === "Top 5 Relevant")     setChosenTags(MOCK_HASHTAGS.slice(0, 5).map(h => h.tag));
    else if (preset === "Select All Suggested") setChosenTags(MOCK_HASHTAGS.map(h => h.tag));
    else if (preset === "Clear All Selected")   setChosenTags([]);
  }

  function addPersonalTag() {
    const raw = customTag.trim(); if (!raw) return;
    const tag = raw.startsWith("#") ? raw : `#${raw}`;
    if (!personalTags.includes(tag)) { setPersonalTags(p => [...p, tag]); setChosenTags(p => [...p, tag]); }
    setCustomTag("");
  }

  function goNext() {
    if (step === 0 && !canGenerate) return toast.error("Add at least 4 words to generate captions");
    if (step === 0 && selectedAccountIds.length === 0) return toast.error("Select at least one account");
    if (step === 1 && chosenIdx < 0) return toast.error("Select a caption to continue");
    setStep(s => Math.min(s + 1, STEPS.length - 1));
  }
  function goBack() {
    if (step === 2 && visualSubStep !== "pick") { setVisualSubStep("pick"); return; }
    setStep(s => Math.max(s - 1, 0));
  }
  function handlePublish()   { toast.success("Post published successfully!"); navigate("/client/publish"); }
  function handleSaveDraft() { toast.success("Saved as draft"); navigate("/client/publish"); }

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="animate-fade-in pb-8 pt-4">
      {/* Page header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold">Create with AI</h1>
          <p className="text-sm text-muted-foreground">Let AI help you create engaging social media content.</p>
        </div>
        <button onClick={() => navigate("/client/create")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-accent transition-colors">
          <Edit2 className="w-4 h-4" /> Manual Compose
        </button>
      </div>

      {/* Stepper */}
      <div className="bg-card rounded-xl border border-border p-4 mb-5">
        <div className="flex items-center">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-2 shrink-0">
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
                  i < step ? "bg-primary/10 text-primary border-2 border-primary" : i === step ? "gradient-coral text-primary-foreground shadow-coral" : "bg-accent text-muted-foreground border-2 border-border")}>
                  {i < step ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className={cn("text-sm font-medium hidden md:block",
                  i < step ? "text-primary" : i === step ? "text-foreground" : "text-muted-foreground")}>{label}</span>
              </div>
              {i < STEPS.length - 1 && <div className={cn("flex-1 h-px mx-3", i < step ? "bg-primary" : "bg-border")} />}
            </div>
          ))}
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">

        {/* ── Left: form ── */}
        <div className="xl:col-span-8 space-y-4">

          {/* Accounts panel — visible on steps 0 and 1 */}
          {step <= 1 && (
            <AccountsPanel
              selectedIds={selectedAccountIds}
              onToggle={toggleAccount}
              onClearAll={() => setSelectedAccountIds([])}
              collapsed={accountsCollapsed}
              onToggleCollapse={() => setAccountsCollapsed(v => !v)}
            />
          )}

          {/* ══════════ STEP 0: Topic & Tone ══════════ */}
          {step === 0 && (
            <div className="bg-card rounded-xl border border-border shadow-card p-5 space-y-5">
              {/* Description */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    Primary Post Description
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-destructive/10 text-destructive border border-destructive/20">REQUIRED</span>
                  </label>
                  <span className="text-[11px] text-muted-foreground">{wordCount} {wordCount === 1 ? "word" : "words"}</span>
                </div>
                <div className="relative">
                  <textarea value={description} onChange={e => setDescription(e.target.value)}
                    placeholder="What should this post be about? For example: 'A limited-time summer sale for 20% off all sneakers'..."
                    className={cn("w-full min-h-[96px] resize-none px-3 py-2.5 rounded-lg border text-sm outline-none focus:ring-2 bg-background transition-colors",
                      description.length > 0 && !canGenerate
                        ? "border-destructive focus:ring-destructive/20 focus:border-destructive"
                        : "border-input focus:ring-primary/20 focus:border-primary")} />
                  {description.length > 0 && !canGenerate && (
                    <span className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded bg-destructive text-white text-[10px] font-bold uppercase tracking-wide pointer-events-none">
                      Min 4 words required ({wordCount}/4)
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> The more specific, the better the AI results.
                  </p>
                  <button className="text-[11px] text-primary hover:underline flex items-center gap-1">
                    <Save className="w-3 h-3" /> Save as Template
                  </button>
                </div>
              </div>

              {/* Tones */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
                  Select tone <span className="normal-case text-[11px] font-normal">(choose 1 or more)</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {AI_TONES.map(t => (
                    <button key={t} onClick={() => setTones(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t])}
                      className={cn("px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                        tones.includes(t) ? "gradient-coral text-primary-foreground border-transparent shadow-coral" : "bg-card border-border text-foreground hover:bg-accent")}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">Style preferences</p>
                <div className="flex flex-wrap gap-2">
                  {AI_STYLES.map(s => (
                    <button key={s} onClick={() => setStyle(s)}
                      className={cn("px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                        style === s ? "border-primary text-primary bg-primary/5" : "bg-card border-border text-foreground hover:bg-accent")}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Targeting */}
              <div className="rounded-xl border border-border p-4 bg-muted/20">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Fine-tune targeting <span className="normal-case font-normal">(optional)</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Target audience</label>
                    <input value={audience} onChange={e => setAudience(e.target.value)} placeholder="e.g., Young sneakerheads in India"
                      className="mt-1 w-full px-3 py-2 rounded-lg border border-input text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Specific keywords</label>
                    <input value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="e.g., street style, limited edition, kicks"
                      className="mt-1 w-full px-3 py-2 rounded-lg border border-input text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background" />
                  </div>
                </div>
              </div>

              {/* AI Plan */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">AI Content Generation</p>
                <div className="space-y-2">
                  {(["free", "premium"] as const).map(plan => (
                    <button key={plan} onClick={() => setAiPlan(plan)}
                      className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left",
                        aiPlan === plan ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/30")}>
                      <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0", aiPlan === plan ? "border-primary" : "border-muted-foreground")}>
                        {aiPlan === plan && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                      </div>
                      <div className="flex items-center gap-2">
                        {plan === "free" ? <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600"><Check className="w-3 h-3" /></span> : <Sparkles className="w-4 h-4 text-amber-500" />}
                        <span className="text-sm font-semibold">{plan === "premium" ? "Premium" : "Free"}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Emoji */}
              <div className="rounded-xl border border-border p-4 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Emoji usage</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Control whether AI-generated captions include emojis.</p>
                  </div>
                  <Toggle on={emojiEnabled} onChange={setEmojiEnabled} />
                </div>
                {emojiEnabled && (
                  <div className="bg-emerald-50 text-emerald-700 text-xs rounded-lg px-3 py-2 border border-emerald-200">
                    AI can use platform-appropriate emojis when they improve the caption.
                  </div>
                )}
              </div>

              <button onClick={goNext} disabled={!canGenerate}
                className={cn("w-full py-3 rounded-xl text-sm font-bold tracking-wide transition-all",
                  canGenerate ? "gradient-coral text-primary-foreground shadow-coral hover:opacity-90 active:scale-[0.99]" : "bg-muted text-muted-foreground cursor-not-allowed")}>
                GENERATE CAPTIONS →
              </button>
            </div>
          )}

          {/* ══════════ STEP 1: Caption ══════════ */}
          {step === 1 && (
            <div className="bg-card rounded-xl border border-border shadow-card p-5 space-y-5">
              <div className="text-center space-y-1">
                <h2 className="text-lg font-bold">Choose Your Perfect Caption</h2>
                <p className="text-sm text-muted-foreground">Select a caption, edit it, or write your own</p>
              </div>

              {/* Platform guidelines */}
              <div className="flex items-center gap-2 flex-wrap">
                {(Array.from(new Set(MOCK_ACCOUNTS.filter(a => selectedAccountIds.includes(a.id)).map(a => a.platform))) as PlatformKey[]).map(p => {
                  const meta = PLATFORMS[p]; const Icon = meta.icon;
                  const len = chosenCaption.length;
                  const over = len > meta.charLimit;
                  const near = !over && len / meta.charLimit >= 0.85;
                  return (
                    <div
                      key={p}
                      title={`${meta.name}: ${len.toLocaleString()} / ${meta.charLimit.toLocaleString()} characters`}
                      className={cn(
                        "flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-full border text-xs font-medium select-none",
                        over ? "border-destructive/40 bg-destructive/5 text-destructive"
                          : near ? "border-amber-300 bg-amber-50 text-amber-700"
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

              {/* Caption cards */}
              {captionLoading ? (
                <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-24 rounded-xl bg-accent animate-pulse" />)}</div>
              ) : (
                <div className="space-y-3">
                  {captionOptions.map((c, i) => {
                    const selected = chosenIdx === i;
                    const isEditing = editingIdx === i;
                    const isRefining = refiningIdx === i;
                    return (
                      <div key={i} className={cn("rounded-xl border-2 transition-all", selected ? "border-primary" : "border-border hover:border-primary/30")}>
                        <div className="flex items-center justify-between gap-2 px-3 pt-3 pb-1">
                          <span className={cn("text-[10px] font-bold uppercase tracking-wider", selected ? "text-primary" : "text-muted-foreground")}>Option {i + 1}</span>
                          <div className="flex items-center gap-1.5">
                            {!isEditing && (
                              <>
                                <div className="relative">
                                  <button onClick={() => setRefineOpen(refineOpen === i ? -1 : i)} disabled={isRefining}
                                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border text-xs font-medium hover:bg-accent transition-colors disabled:opacity-50">
                                    {isRefining ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                                    Refine <ChevronDown className="w-3 h-3" />
                                  </button>
                                  {refineOpen === i && (
                                    <div className="absolute right-0 top-full mt-1 z-50 bg-card border border-border rounded-xl shadow-xl overflow-hidden w-48">
                                      {REFINE_OPTIONS.map(opt => (
                                        <button key={opt} onClick={() => refineCaption(i, opt)}
                                          className="w-full text-left px-3 py-2 text-xs hover:bg-accent text-foreground transition-colors">{opt}</button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <button onClick={() => { navigator.clipboard?.writeText(c); toast.success("Copied!"); }}
                                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border text-xs font-medium hover:bg-accent transition-colors">
                                  <Copy className="w-3 h-3" /> Copy
                                </button>
                                <button onClick={() => { setChosenIdx(i); startEdit(i); }}
                                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border text-xs font-medium hover:bg-accent transition-colors">
                                  <Edit2 className="w-3 h-3" /> Edit
                                </button>
                                <button onClick={() => setChosenIdx(i)}
                                  className={cn("flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all",
                                    selected ? "gradient-coral text-primary-foreground shadow-coral" : "border border-border hover:border-primary/50 hover:text-primary")}>
                                  {selected ? <><Check className="w-3 h-3" /> Selected</> : "Use this"}
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        {isRefining ? (
                          <div className="px-3 pb-4 flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="w-4 h-4 animate-spin text-primary" />
                            Refining caption…
                          </div>
                        ) : isEditing ? (
                          <div className="px-3 pb-3 space-y-2">
                            <textarea value={editingText} onChange={e => setEditingText(e.target.value)}
                              rows={4}
                              className="w-full resize-none px-3 py-2 rounded-lg border border-input text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background" />
                            <div className="flex gap-2 justify-end">
                              <button onClick={() => setEditingIdx(-1)}
                                className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-accent transition-colors">
                                Cancel
                              </button>
                              <button onClick={saveEdit}
                                className="px-3 py-1.5 rounded-lg gradient-coral text-primary-foreground text-xs font-semibold shadow-coral hover:opacity-90 transition-all flex items-center gap-1">
                                <Check className="w-3 h-3" /> Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="px-3 pb-2 text-sm leading-relaxed whitespace-pre-wrap">{c}</p>
                            <div className="px-3 pb-3 text-[10px] text-muted-foreground">
                              {c.length} chars · {approxReadTime(c)}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Write your own */}
              {writingOwn ? (
                <div className="rounded-xl border-2 border-dashed border-primary/40 p-4 space-y-3">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wide">Write Your Own</p>
                  <textarea value={ownCaptionText} onChange={e => setOwnCaptionText(e.target.value)}
                    placeholder="Write your caption here…"
                    rows={4}
                    className="w-full resize-none px-3 py-2 rounded-lg border border-input text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background" />
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => { setWritingOwn(false); setOwnCaptionText(""); }}
                      className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-accent transition-colors">
                      Cancel
                    </button>
                    <button onClick={addOwnCaption} disabled={!ownCaptionText.trim()}
                      className="px-4 py-1.5 rounded-lg gradient-coral text-primary-foreground text-xs font-semibold shadow-coral hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1">
                      <Check className="w-3 h-3" /> Use this caption
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  {variationsUsed < 10 && (
                    <button onClick={() => { generateCaptions(); setVariationsUsed(v => v + 1); }}
                      className="flex-1 py-2.5 rounded-lg border border-dashed border-border text-xs text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors flex items-center justify-center gap-1">
                      <RefreshCw className="w-3 h-3" /> More variations ({variationsUsed}/10)
                    </button>
                  )}
                  <button onClick={() => setWritingOwn(true)}
                    className="flex-1 py-2.5 rounded-lg border border-dashed border-border text-xs text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors flex items-center justify-center gap-1">
                    <Plus className="w-3 h-3" /> Write your own
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between pt-1 border-t border-border">
                <button onClick={goBack} className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-accent transition-colors">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button onClick={goNext} disabled={chosenIdx < 0}
                  className={cn("px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2",
                    chosenIdx >= 0 ? "gradient-coral text-primary-foreground shadow-coral hover:opacity-90" : "bg-muted text-muted-foreground cursor-not-allowed")}>
                  Choose &amp; Generate Visuals <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ══════════ STEP 2: Visuals ══════════ */}
          {step === 2 && (
            <div className="bg-card rounded-xl border border-border shadow-card p-6 space-y-5">
              {visualSubStep === "pick" && (
                <>
                  <div className="text-center space-y-1">
                    <h2 className="text-xl font-bold">Add a Visual</h2>
                    <p className="text-sm text-muted-foreground">Choose how you'd like to add media to your post</p>
                  </div>

                  <div className="space-y-3">
                    {/* Generate with AI */}
                    <button onClick={triggerAiVisuals}
                      className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-primary/20 bg-primary/5 hover:border-primary/50 hover:bg-primary/10 transition-all group text-left">
                      <div className="w-11 h-11 rounded-xl gradient-coral flex items-center justify-center shrink-0 shadow-coral">
                        <Wand2 className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold">Generate with AI</p>
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">Recommended</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">Create unique images tailored to your caption and topic</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                    </button>

                    {/* Upload Your Own */}
                    <button onClick={() => fileInputRef.current?.click()}
                      className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-border hover:border-primary/30 hover:bg-accent/50 transition-all group text-left">
                      <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center shrink-0">
                        <Upload className="w-5 h-5 text-blue-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold">Upload Your Own</p>
                        <p className="text-xs text-muted-foreground mt-0.5">JPG, PNG, WEBP, MP4 — up to 10 items from your device</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                    </button>

                    {/* Skip */}
                    <button onClick={() => { setUploadedVisual(null); setChosenVisualIdx(-1); goNext(); }}
                      className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-dashed border-border hover:border-muted-foreground/40 hover:bg-accent/30 transition-all group text-left">
                      <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center shrink-0">
                        <SkipForward className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-muted-foreground">Skip for Now</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Publish text-only and add a visual later</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <button onClick={goBack} className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-accent transition-colors">
                      <ChevronLeft className="w-4 h-4" /> Back
                    </button>
                  </div>
                </>
              )}

              {visualSubStep === "generating" && (
                <div className="flex flex-col items-center justify-center py-16 gap-4">
                  <div className="w-16 h-16 rounded-2xl gradient-coral flex items-center justify-center shadow-coral">
                    <Loader2 className="w-8 h-8 text-primary-foreground animate-spin" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-base font-semibold">Generating visuals…</p>
                    <p className="text-sm text-muted-foreground">Creating images based on your topic and tone</p>
                  </div>
                  <div className="flex gap-1 mt-2">
                    {[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />)}
                  </div>
                </div>
              )}

              {visualSubStep === "results" && (
                <>
                  <div className="flex items-center justify-between">
                    <div><h2 className="text-base font-bold">Choose a Visual</h2><p className="text-xs text-muted-foreground">Select one of the AI-generated options</p></div>
                    <button onClick={triggerAiVisuals} className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline">
                      <RefreshCw className="w-3.5 h-3.5" /> Regenerate
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {generatedVisuals.map((url, i) => {
                      const selected = chosenVisualIdx === i;
                      return (
                        <button key={i} onClick={() => setChosenVisualIdx(i)}
                          className={cn("relative rounded-xl overflow-hidden border-2 transition-all", selected ? "border-primary shadow-coral" : "border-border hover:border-primary/40")}>
                          <img src={url} alt={`Option ${i + 1}`} className="w-full aspect-square object-cover" />
                          {selected && (
                            <span className="absolute top-2 right-2 w-7 h-7 rounded-full gradient-coral flex items-center justify-center shadow-coral">
                              <Check className="w-4 h-4 text-primary-foreground" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-between">
                    <button onClick={() => setVisualSubStep("pick")} className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-accent transition-colors">
                      <ChevronLeft className="w-4 h-4" /> Back
                    </button>
                    <div className="flex gap-2">
                      <button onClick={() => { setChosenVisualIdx(-1); goNext(); }}
                        className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-accent transition-colors">Skip visual</button>
                      <button onClick={goNext} disabled={chosenVisualIdx < 0}
                        className={cn("px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2",
                          chosenVisualIdx >= 0 ? "gradient-coral text-primary-foreground shadow-coral hover:opacity-90" : "bg-muted text-muted-foreground cursor-not-allowed")}>
                        Use this visual <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              )}

              {visualSubStep === "done" && uploadedVisual && (
                <>
                  <div className="text-center space-y-1">
                    <h2 className="text-base font-bold">Visual Ready</h2>
                    <p className="text-xs text-muted-foreground">Your uploaded image will be used for this post</p>
                  </div>
                  <div className="relative rounded-xl overflow-hidden border border-border">
                    <img src={uploadedVisual} alt="Uploaded" className="w-full max-h-64 object-cover" />
                    <button onClick={() => { setUploadedVisual(null); setVisualSubStep("pick"); }}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => fileInputRef.current?.click()}
                      className="flex-1 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-accent transition-colors flex items-center justify-center gap-2">
                      <Upload className="w-3.5 h-3.5" /> Change image
                    </button>
                    <button onClick={goNext}
                      className="flex-1 py-2.5 rounded-lg gradient-coral text-primary-foreground text-sm font-semibold shadow-coral hover:opacity-90 transition-all flex items-center justify-center gap-2">
                      Continue <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ══════════ STEP 3: Hashtags ══════════ */}
          {step === 3 && (
            <div className="space-y-4">
              {/* Intelligence banner */}
              <div className="rounded-xl bg-card border border-border p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <BarChart2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-bold uppercase tracking-widest text-foreground">Hashtag Intelligence</div>
                      <div className="text-xs text-muted-foreground mt-0.5">Potential combined reach: <span className="text-foreground font-semibold">{totalReach}</span></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold tabular-nums text-foreground">{chosenTags.length} <span className="text-muted-foreground text-base font-normal">/ 10</span></div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Tags selected</div>
                  </div>
                </div>
              </div>

              {/* Search + filters */}
              <div className="bg-card rounded-xl border border-border p-4 space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input value={hashSearch} onChange={e => setHashSearch(e.target.value)} placeholder="Filter suggestions by name or topic..."
                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-input text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <Drop label="Display mode" value={displayMode} options={DISPLAY_MODES} open={displayOpen}
                    onToggle={() => { setDisplayOpen(v => !v); setReachOpen(false); setRapidOpen(false); }} onChange={setDisplayMode} />
                  <Drop label="Reach filter" value={reachFilter} options={REACH_FILTERS} open={reachOpen}
                    onToggle={() => { setReachOpen(v => !v); setDisplayOpen(false); setRapidOpen(false); }} onChange={setReachFilter} />
                  <div className="relative">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Rapid select</div>
                    <button onClick={() => { setRapidOpen(v => !v); setDisplayOpen(false); setReachOpen(false); }}
                      className="flex items-center justify-between gap-2 w-full px-3 py-2 rounded-lg border border-input text-sm font-medium bg-card text-foreground hover:bg-accent transition-colors">
                      <span>Select Preset…</span><ChevronDown className="w-3.5 h-3.5 shrink-0" />
                    </button>
                    {rapidOpen && (
                      <div className="absolute top-full left-0 mt-1 z-50 bg-card border border-border rounded-xl shadow-xl overflow-hidden min-w-full">
                        {RAPID_PRESETS.map(opt => (
                          <button key={opt} onClick={() => handleRapidPreset(opt)}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-accent text-foreground transition-colors">{opt}</button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Tag grid */}
              <div className="bg-card rounded-xl border border-border p-4">
                <div className="grid grid-cols-3 gap-2">
                  {filteredTags.map(h => {
                    const selected = chosenTags.includes(h.tag);
                    const reachCls = h.reach === "HIGH" ? "bg-amber-100 text-amber-700 border-amber-200" : h.reach === "MEDIUM" ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-600 border-slate-200";
                    return (
                      <button key={h.tag} onClick={() => setChosenTags(p => selected ? p.filter(t => t !== h.tag) : [...p, h.tag])}
                        className={cn("relative flex flex-col gap-1.5 p-3 rounded-xl border-2 text-left transition-all",
                          selected ? "border-primary bg-primary/5" : "border-border hover:border-primary/30 bg-card")}>
                        {selected && <div className="absolute top-2 right-2 w-5 h-5 rounded-full gradient-coral flex items-center justify-center"><Check className="w-2.5 h-2.5 text-white" /></div>}
                        <span className="text-xs font-semibold truncate pr-5">{h.tag}</span>
                        <span className={cn("text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border self-start", reachCls)}>{h.reach} REACH</span>
                        <span className="text-[10px] text-muted-foreground">{h.postsLabel} posts</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected tags */}
              <div className="bg-card rounded-xl border border-border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Selected Tags</p>
                  {chosenTags.length > 0 && (
                    <button onClick={() => setChosenTags([])} className="text-[11px] text-muted-foreground hover:text-destructive transition-colors">Clear all</button>
                  )}
                </div>
                {chosenTags.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-1">No tags selected yet. Pick from the suggestions above.</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {chosenTags.map(t => (
                      <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-medium">
                        {t}
                        <button onClick={() => setChosenTags(p => p.filter(x => x !== t))} className="hover:text-destructive transition-colors"><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Personal library */}
              <div className="rounded-xl bg-card border border-border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-foreground">Personal Library</span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Hit enter to add</span>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg border border-input bg-background">
                    <Hash className="w-3.5 h-3.5 text-muted-foreground" />
                    <input value={customTag} onChange={e => setCustomTag(e.target.value)} onKeyDown={e => e.key === "Enter" && addPersonalTag()}
                      placeholder="newtrend" className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none" />
                  </div>
                  <button onClick={addPersonalTag} className="px-4 py-2 rounded-lg gradient-coral text-primary-foreground text-xs font-bold uppercase shadow-coral">Add Tag</button>
                </div>
                {personalTags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {personalTags.map(t => (
                      <div key={t} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent text-foreground text-xs border border-border">
                        {t}<button onClick={() => setPersonalTags(p => p.filter(x => x !== t))} className="hover:text-destructive ml-1"><X className="w-3 h-3" /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Scheduling */}
              <div className="bg-card rounded-xl border border-border p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-semibold">Scheduling</span>
                </div>
                <div className="flex gap-2">
                  {(["now", "schedule"] as const).map(mode => (
                    <button key={mode} onClick={() => setScheduleMode(mode)}
                      className={cn("flex-1 py-2 rounded-lg text-sm font-medium border transition-all",
                        scheduleMode === mode ? "gradient-coral text-primary-foreground border-transparent shadow-coral" : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground")}>
                      {mode === "now" ? "Send Now" : "Schedule"}
                    </button>
                  ))}
                </div>
                {scheduleMode === "schedule" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] uppercase font-semibold text-muted-foreground">Date</label>
                      <input type="date" className="mt-1 w-full px-3 py-2 rounded-lg border border-input text-sm outline-none focus:ring-2 focus:ring-primary/20 bg-background" />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-semibold text-muted-foreground">Time</label>
                      <input type="time" className="mt-1 w-full px-3 py-2 rounded-lg border border-input text-sm outline-none focus:ring-2 focus:ring-primary/20 bg-background" />
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between gap-3 pt-1 border-t border-border">
                  <div>
                    <div className="text-sm font-medium">Also publish as Story</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">Post first image as a Story on Instagram and Facebook.</div>
                  </div>
                  <Toggle on={publishAsStory} onChange={setPublishAsStory} />
                </div>
                <div className="flex items-start gap-1.5 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-700">
                  <Music className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>Music cannot be added via API. <span className="underline font-medium">Add it manually after publishing.</span></span>
                </div>
              </div>

              {/* Publish actions + back */}
              <div className="bg-card rounded-xl border border-border p-3 flex items-center justify-between gap-3">
                <button onClick={goBack}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-accent transition-colors">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <div className="flex items-center gap-2">
                  <button onClick={handleSaveDraft}
                    className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-accent transition-colors">
                    Save as Draft
                  </button>
                  <button onClick={handlePublish}
                    className="flex items-center gap-2 px-5 py-2 rounded-lg gradient-coral text-primary-foreground text-sm font-semibold shadow-coral hover:opacity-90 active:scale-[0.99] transition-all">
                    Publish Now <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Right: Live Preview (all steps) ── */}
        <aside className="xl:col-span-4 sticky top-4">
          <LivePreviewPanel
            caption={chosenCaption + (step === 3 && chosenTags.length > 0 ? "\n\n" + chosenTags.join(" ") : "")}
            visualUrl={activeVisualUrl}
            selectedAccountIds={selectedAccountIds}
          />
        </aside>
      </div>

      <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleFileChange} />
    </div>
  );
}
