import { useState, useCallback, useEffect, useRef } from "react";
import {
  Sparkles, Copy, Edit3, Hash, Image, Facebook, Instagram, Linkedin, Twitter,
  AlertCircle, RefreshCw, Check, Undo2, Plus, X, Upload, Loader2, Save
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

const tones = ["Professional", "Casual", "Creative", "Promotional"];
const platformOptions = [
  { label: "IG", icon: Instagram, charLimit: 2200, hashtagLimit: 30 },
  { label: "FB", icon: Facebook, charLimit: 63206, hashtagLimit: 30 },
  { label: "LinkedIn", icon: Linkedin, charLimit: 3000, hashtagLimit: 5 },
  { label: "X", icon: Twitter, charLimit: 280, hashtagLimit: 10 },
];

const imageStyles = ["Photorealistic", "Illustrative", "Minimalist", "Branded"];

const defaultCaptions = [
  { text: "🚀 Transform your social media game with AI-powered automation. Spend less time posting, more time growing. #SocialMedia #AI #Marketing", chars: 138 },
  { text: "Stop guessing, start knowing. Our AI analyzes your audience behavior to find the perfect posting times. Ready to level up? 📈", chars: 122 },
  { text: "Your competitors are already using AI for social media. Here's why you should too — and how to get started in under 5 minutes. ⚡", chars: 131 },
];

const hashtagGroups = {
  "High Reach": ["#socialmedia", "#marketing", "#AI", "#digitalmarketing", "#growth", "#trending", "#business", "#branding", "#strategy", "#viral"],
  "Medium Reach": ["#contentcreation", "#socialstrategy", "#marketingtips", "#automation", "#contentmarketing", "#socialmediamanager", "#onlinemarketing"],
  "Niche": ["#socialninja", "#aimarketing", "#smm2026", "#postautomation", "#schedulingtools", "#marketingautomation"],
};

type CaptionItem = { text: string; chars: number; originalText: string; isEditing: boolean };
type GenerationState = "idle" | "loading" | "success" | "error";

export default function CreatePage() {
  const [selectedTone, setSelectedTone] = useState("Professional");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["IG", "FB"]);
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>(["#socialmedia", "#AI"]);
  const [promptText, setPromptText] = useState("");
  const [genState, setGenState] = useState<GenerationState>("idle");
  const [captions, setCaptions] = useState<CaptionItem[]>([]);
  const [customHashtag, setCustomHashtag] = useState("");
  const [autoSaveStatus, setAutoSaveStatus] = useState<"saved" | "saving" | "idle">("idle");
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageStyle, setImageStyle] = useState("Photorealistic");
  const [imageGenState, setImageGenState] = useState<GenerationState>("idle");
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activePlatformLimit = Math.min(...selectedPlatforms.map((p) => platformOptions.find((po) => po.label === p)?.charLimit ?? 9999));
  const activeHashtagLimit = Math.min(...selectedPlatforms.map((p) => platformOptions.find((po) => po.label === p)?.hashtagLimit ?? 30));
  const wordCount = promptText.trim().split(/\s+/).filter(Boolean).length;
  const isPromptValid = wordCount >= 4;

  useEffect(() => {
    if (captions.length === 0 && selectedHashtags.length === 0) return;
    setAutoSaveStatus("saving");
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      setAutoSaveStatus("saved");
      setTimeout(() => setAutoSaveStatus("idle"), 2000);
    }, 1500);
    return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current); };
  }, [captions, selectedHashtags]);

  const togglePlatform = (label: string) => setSelectedPlatforms((prev) => prev.includes(label) ? prev.filter((p) => p !== label) : [...prev, label]);
  const toggleHashtag = (tag: string) => {
    if (!selectedHashtags.includes(tag) && selectedHashtags.length >= activeHashtagLimit) { toast.error(`Maximum ${activeHashtagLimit} hashtags allowed.`); return; }
    setSelectedHashtags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  };
  const addCustomHashtag = () => {
    const tag = customHashtag.trim().startsWith("#") ? customHashtag.trim() : `#${customHashtag.trim()}`;
    if (!tag || tag === "#") return;
    if (selectedHashtags.length >= activeHashtagLimit) { toast.error(`Maximum ${activeHashtagLimit} hashtags allowed.`); return; }
    if (!selectedHashtags.includes(tag)) setSelectedHashtags((prev) => [...prev, tag]);
    setCustomHashtag("");
  };

  const handleGenerate = useCallback(() => {
    if (!isPromptValid) { toast.error("Please enter at least 4 words."); return; }
    setGenState("loading"); setCaptions([]);
    setTimeout(() => {
      if (Math.random() > 0.1) {
        setCaptions(defaultCaptions.map((c) => ({ ...c, originalText: c.text, isEditing: false })));
        setGenState("success");
      } else setGenState("error");
    }, 2000);
  }, [isPromptValid]);

  const handleCaptionEdit = (index: number, newText: string) => setCaptions((prev) => prev.map((c, i) => i === index ? { ...c, text: newText, chars: newText.length } : c));
  const toggleEditMode = (index: number) => setCaptions((prev) => prev.map((c, i) => i === index ? { ...c, isEditing: !c.isEditing } : c));
  const undoEdit = (index: number) => setCaptions((prev) => prev.map((c, i) => i === index ? { ...c, text: c.originalText, chars: c.originalText.length, isEditing: false } : c));
  const copyCaption = (text: string) => { navigator.clipboard.writeText(text); toast.success("Copied!"); };

  const handleImageGenerate = () => {
    if (!imagePrompt.trim()) { toast.error("Please enter an image prompt."); return; }
    setImageGenState("loading"); setGeneratedImages([]); setSelectedImage(null);
    setTimeout(() => {
      if (Math.random() > 0.1) {
        setGeneratedImages(["https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=400&fit=crop", "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=400&fit=crop"]);
        setImageGenState("success");
      } else setImageGenState("error");
    }, 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" /> Create Content
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Generate AI-powered content for your social channels.</p>
        </div>
        {autoSaveStatus !== "idle" && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {autoSaveStatus === "saving" ? <><Loader2 className="w-3 h-3 animate-spin" /> Saving...</> : <><Save className="w-3 h-3 text-emerald-500" /> Draft saved</>}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-card rounded-xl shadow-card p-5 space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Describe your post idea</label>
              <textarea value={promptText} onChange={(e) => setPromptText(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-input bg-card text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none h-28" placeholder="E.g., Announce our new AI scheduling feature..." />
              <div className="flex items-center justify-between">
                <span className={`text-[11px] ${isPromptValid ? "text-emerald-600" : "text-muted-foreground"}`}>{wordCount}/4 words minimum</span>
                {!isPromptValid && wordCount > 0 && <span className="text-[11px] text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Need at least 4 words</span>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">Target Audience</label><input className="w-full px-3 py-2 rounded-lg border border-input text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="e.g., Marketers" /></div>
              <div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">Keywords</label><input className="w-full px-3 py-2 rounded-lg border border-input text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="e.g., AI, social" /></div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Tone</label>
              <div className="flex gap-2 flex-wrap">
                {tones.map((tone) => (<button key={tone} onClick={() => setSelectedTone(tone)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedTone === tone ? "gradient-coral text-primary-foreground shadow-coral" : "bg-accent text-foreground hover:bg-accent/80"}`}>{tone}</button>))}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Platforms</label>
              <div className="flex gap-2">
                {platformOptions.map((p) => (<button key={p.label} onClick={() => togglePlatform(p.label)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedPlatforms.includes(p.label) ? "bg-foreground text-card" : "bg-accent text-foreground hover:bg-accent/80"}`}><p.icon className="w-3.5 h-3.5" />{p.label}</button>))}
              </div>
            </div>
            <button onClick={handleGenerate} disabled={genState === "loading" || !isPromptValid} className="w-full py-2.5 rounded-lg gradient-coral text-primary-foreground font-medium text-sm shadow-coral hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
              {genState === "loading" ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><Sparkles className="w-4 h-4" /> Generate with AI</>}
            </button>
          </div>
          <div className="bg-card rounded-xl shadow-card p-5">
            <button onClick={() => { if (captions.length > 0 && !imagePrompt) setImagePrompt(captions[0].text.slice(0, 100)); setImageModalOpen(true); }} className="w-full py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-accent transition-colors flex items-center justify-center gap-2">
              <Image className="w-4 h-4" /> Generate Image with AI
            </button>
            {selectedImage !== null && generatedImages[selectedImage] && (
              <div className="mt-3 relative">
                <img src={generatedImages[selectedImage]} alt="Selected AI image" className="w-full rounded-lg border border-border" />
                <button onClick={() => setSelectedImage(null)} className="absolute top-2 right-2 p-1 rounded-full bg-card/80 hover:bg-card text-muted-foreground"><X className="w-4 h-4" /></button>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-3 space-y-5">
          <div className="bg-card rounded-xl shadow-card p-5">
            <h2 className="text-sm font-semibold text-foreground mb-4">Generated Captions</h2>
            {genState === "loading" && <div className="space-y-3">{[1, 2, 3].map((i) => (<div key={i} className="border border-border rounded-xl p-4"><div className="skeleton-shimmer h-4 rounded w-full mb-2" /><div className="skeleton-shimmer h-4 rounded w-3/4 mb-2" /><div className="skeleton-shimmer h-4 rounded w-1/2" /></div>))}</div>}
            {genState === "error" && (
              <div className="border border-destructive/30 bg-destructive/5 rounded-xl p-5 flex flex-col items-center gap-3 text-center">
                <AlertCircle className="w-8 h-8 text-destructive" /><p className="text-sm font-medium text-foreground">Content generation failed</p>
                <button onClick={handleGenerate} className="px-4 py-2 rounded-lg gradient-coral text-primary-foreground text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-all"><RefreshCw className="w-3.5 h-3.5" /> Retry</button>
              </div>
            )}
            {genState === "success" && captions.length > 0 && (
              <div className="space-y-3">
                {captions.map((cap, i) => (
                  <div key={i} className="border border-border rounded-xl p-4 hover:border-primary/30 transition-colors">
                    {cap.isEditing ? <textarea value={cap.text} onChange={(e) => handleCaptionEdit(i, e.target.value)} className="w-full text-sm text-foreground leading-relaxed bg-accent/30 rounded-lg p-2 outline-none focus:ring-2 focus:ring-primary/20 resize-none min-h-[80px]" autoFocus /> : <p className="text-sm text-foreground leading-relaxed">{cap.text}</p>}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-3">
                        <span className={`text-[11px] tabular-nums ${cap.chars > activePlatformLimit ? "text-destructive font-medium" : "text-muted-foreground"}`}>{cap.chars}/{activePlatformLimit} chars</span>
                        <div className="w-20 h-1.5 rounded-full bg-accent overflow-hidden"><div className={`h-full rounded-full ${cap.chars > activePlatformLimit ? "bg-destructive" : "gradient-coral"}`} style={{ width: `${Math.min((cap.chars / activePlatformLimit) * 100, 100)}%` }} /></div>
                      </div>
                      <div className="flex gap-1.5">
                        <button onClick={() => copyCaption(cap.text)} className="p-1.5 rounded-md hover:bg-accent transition-colors"><Copy className="w-3.5 h-3.5 text-muted-foreground" /></button>
                        <button onClick={() => toggleEditMode(i)} className="p-1.5 rounded-md hover:bg-accent transition-colors">{cap.isEditing ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Edit3 className="w-3.5 h-3.5 text-muted-foreground" />}</button>
                        {cap.text !== cap.originalText && <button onClick={() => undoEdit(i)} className="p-1.5 rounded-md hover:bg-accent transition-colors"><Undo2 className="w-3.5 h-3.5 text-muted-foreground" /></button>}
                        <button className="px-3 py-1 rounded-lg gradient-coral text-primary-foreground text-xs font-medium hover:opacity-90 transition-all">Use This</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {genState === "idle" && <div className="text-center py-8 text-muted-foreground"><Sparkles className="w-10 h-10 mx-auto mb-3 opacity-20" /><p className="text-sm">Enter your post idea and click "Generate with AI" to get started.</p></div>}
          </div>

          <div className="bg-card rounded-xl shadow-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2"><Hash className="w-4 h-4 text-primary" /> AI Hashtag Suggestions</h2>
              <span className={`text-[11px] font-medium tabular-nums px-2 py-0.5 rounded-full ${selectedHashtags.length >= activeHashtagLimit ? "bg-destructive/10 text-destructive" : "bg-accent text-muted-foreground"}`}>{selectedHashtags.length}/{activeHashtagLimit} hashtags</span>
            </div>
            {Object.entries(hashtagGroups).map(([group, tags]) => (
              <div key={group} className="mb-3">
                <p className="text-[11px] font-medium text-muted-foreground mb-2">{group}</p>
                <div className="flex flex-wrap gap-2">{tags.map((tag) => (<button key={tag} onClick={() => toggleHashtag(tag)} className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${selectedHashtags.includes(tag) ? "gradient-coral text-primary-foreground" : "bg-accent text-foreground hover:bg-accent/80"}`}>{tag}</button>))}</div>
              </div>
            ))}
            <div className="mt-4 flex gap-2">
              <input value={customHashtag} onChange={(e) => setCustomHashtag(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addCustomHashtag()} className="flex-1 px-3 py-2 rounded-lg border border-input text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Add custom hashtag..." />
              <button onClick={addCustomHashtag} className="px-3 py-2 rounded-lg bg-accent hover:bg-accent/80 text-foreground text-sm font-medium transition-colors flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Add</button>
            </div>
            {selectedHashtags.length > 0 && (
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-[11px] font-medium text-muted-foreground mb-2">Selected</p>
                <div className="flex flex-wrap gap-1.5">{selectedHashtags.map((tag) => (<span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">{tag}<button onClick={() => toggleHashtag(tag)} className="hover:text-destructive transition-colors"><X className="w-3 h-3" /></button></span>))}</div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-accent transition-colors">Save Draft</button>
            <button className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-accent transition-colors">Send for Approval</button>
            <button className="px-4 py-2 rounded-lg gradient-coral text-primary-foreground text-sm font-medium shadow-coral hover:opacity-90 transition-all">Go to Publish</button>
          </div>
        </div>
      </div>

      <Dialog open={imageModalOpen} onOpenChange={setImageModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Image className="w-5 h-5 text-primary" /> Generate Image with AI</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Image Prompt</label>
              <textarea value={imagePrompt} onChange={(e) => setImagePrompt(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-input bg-card text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none h-20" placeholder="Describe the image you want to generate..." />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Image Style</label>
              <div className="flex gap-2 flex-wrap">{imageStyles.map((style) => (<button key={style} onClick={() => setImageStyle(style)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${imageStyle === style ? "gradient-coral text-primary-foreground shadow-coral" : "bg-accent text-foreground hover:bg-accent/80"}`}>{style}</button>))}</div>
            </div>
            <button onClick={handleImageGenerate} disabled={imageGenState === "loading" || !imagePrompt.trim()} className="w-full py-2.5 rounded-lg gradient-coral text-primary-foreground font-medium text-sm shadow-coral hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
              {imageGenState === "loading" ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating images...</> : <><Sparkles className="w-4 h-4" /> Generate Images</>}
            </button>
            {imageGenState === "loading" && <div className="grid grid-cols-2 gap-3"><div className="skeleton-shimmer aspect-square rounded-xl" /><div className="skeleton-shimmer aspect-square rounded-xl" /></div>}
            {imageGenState === "error" && <div className="border border-destructive/30 bg-destructive/5 rounded-xl p-4 flex flex-col items-center gap-2 text-center"><AlertCircle className="w-6 h-6 text-destructive" /><p className="text-sm font-medium text-foreground">Image generation failed</p><button onClick={handleImageGenerate} className="px-4 py-1.5 rounded-lg gradient-coral text-primary-foreground text-xs font-medium flex items-center gap-1.5 hover:opacity-90 transition-all"><RefreshCw className="w-3 h-3" /> Retry</button></div>}
            {imageGenState === "success" && generatedImages.length > 0 && (
              <div className="grid grid-cols-2 gap-3">{generatedImages.map((img, i) => (<button key={i} onClick={() => setSelectedImage(i)} className={`relative rounded-xl overflow-hidden border-2 transition-all ${selectedImage === i ? "border-primary shadow-coral" : "border-border hover:border-primary/30"}`}><img src={img} alt={`Variation ${i + 1}`} className="w-full aspect-square object-cover" />{selectedImage === i && <div className="absolute top-2 right-2 w-6 h-6 rounded-full gradient-coral flex items-center justify-center"><Check className="w-3.5 h-3.5 text-primary-foreground" /></div>}</button>))}</div>
            )}
            {imageGenState === "success" && <button onClick={handleImageGenerate} className="w-full py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-accent transition-colors flex items-center justify-center gap-2"><RefreshCw className="w-3.5 h-3.5" /> Regenerate</button>}
            <div className="flex gap-3 pt-2 border-t border-border">
              <button onClick={() => setImageModalOpen(false)} disabled={selectedImage === null} className="flex-1 py-2 rounded-lg gradient-coral text-primary-foreground text-sm font-medium hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"><Check className="w-4 h-4" /> Use Selected</button>
              <button className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-accent transition-colors flex items-center gap-2"><Upload className="w-4 h-4" /> Upload Own</button>
              <button onClick={() => { setSelectedImage(null); setImageModalOpen(false); }} className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent transition-colors">Skip</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
