import { useState } from "react";
import {
  Heart, MessageCircle, Send, Bookmark, MoreHorizontal,
  ThumbsUp, Repeat2, Play, Layers, ChevronLeft, ChevronRight, Music,
} from "lucide-react";
import { PLATFORM_META, type Platform } from "@/data/publishMockData";
import { cn } from "@/lib/utils";

interface Props {
  platform: Platform;
  caption: string;
  media: { type: "image" | "video"; url: string }[];
  brand: { name: string; handle?: string; avatar?: string };
  postType?: "post" | "reel" | "carousel";
}

const Avatar = ({ name, src, size = "md" }: { name: string; src?: string; size?: "sm" | "md" }) => {
  const cls = size === "sm" ? "w-7 h-7 text-[10px]" : "w-9 h-9 text-[11px]";
  return src ? (
    <img src={src} alt={name} className={cn(cls, "rounded-full object-cover shrink-0")} />
  ) : (
    <div className={cn(cls, "rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center font-semibold text-white shrink-0")}>
      {name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
    </div>
  );
};

/* ── Reel preview (9:16, centered, with reel chrome) ── */
const ReelPreview = ({ media, caption, handle }: { media: Props["media"]; caption: string; handle: string }) => (
  <div className="flex justify-center bg-black px-8 py-3">
    <div className="relative bg-zinc-900 overflow-hidden rounded-xl w-full" style={{ maxWidth: 180, aspectRatio: "9/16" }}>
      {media[0] ? (
        <img src={media[0].url} alt="" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">No media</div>
      )}
      {/* Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />
      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
          <Play className="w-5 h-5 text-white fill-white ml-0.5" />
        </div>
      </div>
      {/* Right-side actions */}
      <div className="absolute right-2 bottom-14 flex flex-col items-center gap-3">
        {([{ Icon: Heart, label: "1.2k" }, { Icon: MessageCircle, label: "247" }, { Icon: Send, label: "Share" }]).map(({ Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-0.5">
            <Icon className="w-4 h-4 text-white" />
            <span className="text-white text-[8px] leading-none">{label}</span>
          </div>
        ))}
      </div>
      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 px-2.5 pb-2.5">
        <p className="text-white text-[10px] font-semibold leading-none mb-0.5">@{handle}</p>
        <p className="text-white/80 text-[9px] leading-snug line-clamp-2">{caption}</p>
        <div className="flex items-center gap-1 mt-1">
          <Music className="w-2.5 h-2.5 text-white/70" />
          <span className="text-white/70 text-[8px]">Original audio</span>
        </div>
      </div>
      {/* Reel badge */}
      <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-black/60 backdrop-blur-sm">
        <Play className="w-2.5 h-2.5 text-white fill-white" />
        <span className="text-white text-[9px] font-semibold">Reel</span>
      </div>
    </div>
  </div>
);

/* ── Carousel image block (1:1 with nav arrows + dots) ── */
const CarouselBlock = ({ media }: { media: Props["media"] }) => {
  const [idx, setIdx] = useState(0);
  const total = media.length || 1;
  const prev = () => setIdx((i) => (i - 1 + total) % total);
  const next = () => setIdx((i) => (i + 1) % total);

  return (
    <div className="relative bg-muted overflow-hidden" style={{ aspectRatio: "1/1" }}>
      {media[idx] ? (
        <img src={media[idx].url} alt="" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No media</div>
      )}
      {total > 1 && (
        <>
          <button onClick={prev} className="absolute left-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/80 backdrop-blur-sm shadow flex items-center justify-center hover:bg-white transition-colors">
            <ChevronLeft className="w-3.5 h-3.5 text-zinc-800" />
          </button>
          <button onClick={next} className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/80 backdrop-blur-sm shadow flex items-center justify-center hover:bg-white transition-colors">
            <ChevronRight className="w-3.5 h-3.5 text-zinc-800" />
          </button>
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
            {Array.from({ length: total }).map((_, i) => (
              <div key={i} className={cn("rounded-full transition-all", i === idx ? "w-2 h-2 bg-white" : "w-1.5 h-1.5 bg-white/50")} />
            ))}
          </div>
          <div className="absolute top-2 right-2 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-black/60 backdrop-blur-sm">
            <Layers className="w-2.5 h-2.5 text-white" />
            <span className="text-white text-[9px] font-semibold">{idx + 1}/{total}</span>
          </div>
        </>
      )}
    </div>
  );
};

/* ── Standard single-image block ── */
const MediaBlock = ({ media }: { media: Props["media"] }) => {
  if (!media.length) {
    return (
      <div className="aspect-square bg-muted flex items-center justify-center text-xs text-muted-foreground">
        No media
      </div>
    );
  }
  return (
    <div className="relative bg-muted overflow-hidden aspect-square">
      <img src={media[0].url} alt="" className="w-full h-full object-cover" />
    </div>
  );
};

export default function PostPreview({ platform, caption, media, brand, postType = "post" }: Props) {
  const handle = brand.handle || brand.name.toLowerCase().replace(/\s+/g, "");
  const meta = PLATFORM_META[platform];

  /* ── Reel: replaces the media block for all platforms ── */
  const MediaSection = () => {
    if (postType === "reel") return <ReelPreview media={media} caption={caption} handle={handle} />;
    if (postType === "carousel") return <CarouselBlock media={media} />;
    return <MediaBlock media={media} />;
  };

  if (platform === "instagram") {
    return (
      <div className="w-full bg-white dark:bg-zinc-950 font-sans">
        <div className="flex items-center gap-2.5 px-3 py-2.5">
          <Avatar name={brand.name} src={brand.avatar} />
          <span className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100 flex-1 leading-none">{handle}</span>
          <MoreHorizontal className="w-4 h-4 text-zinc-500" />
        </div>
        <MediaSection />
        {postType !== "reel" && (
          <div className="flex items-center px-3 pt-2.5 pb-1 gap-3.5">
            <Heart className="w-[22px] h-[22px] text-zinc-900 dark:text-zinc-100" />
            <MessageCircle className="w-[22px] h-[22px] text-zinc-900 dark:text-zinc-100" />
            <Send className="w-[22px] h-[22px] text-zinc-900 dark:text-zinc-100" />
            <Bookmark className="w-[22px] h-[22px] text-zinc-900 dark:text-zinc-100 ml-auto" />
          </div>
        )}
        {postType !== "reel" && (
          <div className="px-3 pb-3 pt-0.5">
            <p className="text-[13px] text-zinc-900 dark:text-zinc-100 leading-snug">
              <span className="font-semibold mr-1">{handle}</span>
              {caption}
            </p>
          </div>
        )}
      </div>
    );
  }

  if (platform === "facebook") {
    return (
      <div className="w-full bg-white dark:bg-zinc-950 font-sans">
        <div className="flex items-center gap-2.5 px-3 py-2.5">
          <Avatar name={brand.name} src={brand.avatar} />
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100 leading-none">{brand.name}</div>
            <div className="text-[11px] text-zinc-500 mt-0.5">Just now · 🌐</div>
          </div>
          <MoreHorizontal className="w-4 h-4 text-zinc-500" />
        </div>
        {postType !== "reel" && (
          <div className="px-3 pb-2.5 text-[13px] text-zinc-900 dark:text-zinc-100 leading-snug">{caption}</div>
        )}
        <MediaSection />
        <div className="px-3 py-2 flex items-center gap-5 border-t border-zinc-200 dark:border-zinc-800 text-[12px] text-zinc-500 font-medium">
          <span className="flex items-center gap-1.5"><ThumbsUp className="w-4 h-4" /> Like</span>
          <span className="flex items-center gap-1.5"><MessageCircle className="w-4 h-4" /> Comment</span>
          <span className="flex items-center gap-1.5"><Send className="w-4 h-4" /> Share</span>
        </div>
      </div>
    );
  }

  if (platform === "linkedin") {
    return (
      <div className="w-full bg-white dark:bg-zinc-950 font-sans">
        <div className="flex items-center gap-2.5 px-3 py-2.5">
          <Avatar name={brand.name} src={brand.avatar} />
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100 leading-none">{brand.name}</div>
            <div className="text-[11px] text-zinc-500 mt-0.5">Brand Page · 1st</div>
          </div>
          <MoreHorizontal className="w-4 h-4 text-zinc-500" />
        </div>
        {postType !== "reel" && (
          <div className="px-3 pb-2.5 text-[13px] text-zinc-900 dark:text-zinc-100 leading-snug whitespace-pre-line">{caption}</div>
        )}
        <MediaSection />
        <div className="px-3 py-2 flex items-center gap-5 border-t border-zinc-200 dark:border-zinc-800 text-[12px] text-zinc-500 font-medium">
          <span className="flex items-center gap-1.5"><ThumbsUp className="w-4 h-4" /> Like</span>
          <span className="flex items-center gap-1.5"><MessageCircle className="w-4 h-4" /> Comment</span>
          <span className="flex items-center gap-1.5"><Repeat2 className="w-4 h-4" /> Repost</span>
        </div>
      </div>
    );
  }

  if (platform === "twitter") {
    return (
      <div className="w-full bg-white dark:bg-zinc-950 font-sans px-3 py-3">
        <div className="flex gap-2.5">
          <Avatar name={brand.name} src={brand.avatar} />
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100">{brand.name}</span>
              <span className="text-[12px] text-zinc-500">@{handle}</span>
            </div>
            <p className="text-[13px] text-zinc-900 dark:text-zinc-100 mt-1 leading-snug whitespace-pre-line">{caption}</p>
            {media.length > 0 && (
              <div className="mt-2 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
                {postType === "reel" ? (
                  <ReelPreview media={media} caption={caption} handle={handle} />
                ) : (
                  <img src={media[0].url} alt="" className="w-full max-h-64 object-cover" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Generic fallback (TikTok / YouTube / Pinterest)
  return (
    <div className="w-full bg-white dark:bg-zinc-950 font-sans">
      <div className={cn("h-1", meta.bg)} />
      <MediaSection />
      {postType !== "reel" && (
        <div className="px-3 py-2.5">
          <p className="text-[12px] font-semibold text-zinc-500 uppercase tracking-wide mb-1">{meta.label}</p>
          <p className="text-[13px] text-zinc-900 dark:text-zinc-100 leading-snug">
            <span className="font-semibold">@{handle}</span>{" "}
            {caption}
          </p>
        </div>
      )}
    </div>
  );
}
