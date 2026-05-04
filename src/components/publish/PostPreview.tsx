import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, ThumbsUp, Repeat2 } from "lucide-react";
import { PLATFORM_META, type Platform } from "@/data/publishMockData";
import { cn } from "@/lib/utils";

interface Props {
  platform: Platform;
  caption: string;
  media: { type: "image" | "video"; url: string }[];
  brand: { name: string; handle?: string; avatar?: string };
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

const MediaBlock = ({ media, rounded = false }: { media: Props["media"]; rounded?: boolean }) => {
  if (!media.length) {
    return (
      <div className={cn("aspect-square bg-muted flex items-center justify-center text-xs text-muted-foreground", rounded && "rounded-xl overflow-hidden")}>
        No media
      </div>
    );
  }
  return (
    <div className={cn("relative bg-muted overflow-hidden", rounded ? "rounded-xl aspect-square" : "aspect-square")}>
      <img src={media[0].url} alt="" className="w-full h-full object-cover" />
      {media.length > 1 && (
        <span className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-medium px-1.5 py-0.5 rounded-md">
          1/{media.length}
        </span>
      )}
    </div>
  );
};

export default function PostPreview({ platform, caption, media, brand }: Props) {
  const handle = brand.handle || brand.name.toLowerCase().replace(/\s+/g, "");
  const meta = PLATFORM_META[platform];

  if (platform === "instagram") {
    return (
      <div className="w-full bg-white dark:bg-zinc-950 font-sans">
        {/* Header */}
        <div className="flex items-center gap-2.5 px-3 py-2.5">
          <Avatar name={brand.name} src={brand.avatar} />
          <span className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100 flex-1 leading-none">{handle}</span>
          <MoreHorizontal className="w-4 h-4 text-zinc-500" />
        </div>
        {/* Media */}
        <MediaBlock media={media} />
        {/* Actions */}
        <div className="flex items-center px-3 pt-2.5 pb-1 gap-3.5">
          <Heart className="w-[22px] h-[22px] text-zinc-900 dark:text-zinc-100" />
          <MessageCircle className="w-[22px] h-[22px] text-zinc-900 dark:text-zinc-100" />
          <Send className="w-[22px] h-[22px] text-zinc-900 dark:text-zinc-100" />
          <Bookmark className="w-[22px] h-[22px] text-zinc-900 dark:text-zinc-100 ml-auto" />
        </div>
        {/* Caption */}
        <div className="px-3 pb-3 pt-0.5">
          <p className="text-[13px] text-zinc-900 dark:text-zinc-100 leading-snug">
            <span className="font-semibold mr-1">{handle}</span>
            {caption}
          </p>
        </div>
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
        <div className="px-3 pb-2.5 text-[13px] text-zinc-900 dark:text-zinc-100 leading-snug">{caption}</div>
        <MediaBlock media={media} />
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
        <div className="px-3 pb-2.5 text-[13px] text-zinc-900 dark:text-zinc-100 leading-snug whitespace-pre-line">{caption}</div>
        <MediaBlock media={media} />
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
                <img src={media[0].url} alt="" className="w-full max-h-64 object-cover" />
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
      <MediaBlock media={media} />
      <div className="px-3 py-2.5">
        <p className="text-[12px] font-semibold text-zinc-500 uppercase tracking-wide mb-1">{meta.label}</p>
        <p className="text-[13px] text-zinc-900 dark:text-zinc-100 leading-snug">
          <span className="font-semibold">@{handle}</span>{" "}
          {caption}
        </p>
      </div>
    </div>
  );
}
