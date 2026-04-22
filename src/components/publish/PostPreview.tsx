import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, ThumbsUp, Repeat2 } from "lucide-react";
import { PLATFORM_META, type Platform } from "@/data/publishMockData";
import { cn } from "@/lib/utils";

interface Props {
  platform: Platform;
  caption: string;
  media: { type: "image" | "video"; url: string }[];
  brand: { name: string; handle?: string; avatar?: string };
}

const Avatar = ({ name, src }: { name: string; src?: string }) =>
  src ? (
    <img src={src} alt={name} className="w-8 h-8 rounded-full object-cover" />
  ) : (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-[11px] font-semibold text-primary-foreground">
      {name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
    </div>
  );

const MediaBlock = ({ media }: { media: Props["media"] }) => {
  if (!media.length) return <div className="aspect-square bg-muted flex items-center justify-center text-xs text-muted-foreground">No media</div>;
  return (
    <div className="relative aspect-square bg-muted overflow-hidden">
      <img src={media[0].url} alt="" className="w-full h-full object-cover" />
      {media.length > 1 && (
        <span className="absolute top-2 right-2 bg-foreground/70 text-card text-[10px] px-1.5 py-0.5 rounded">1/{media.length}</span>
      )}
    </div>
  );
};

export default function PostPreview({ platform, caption, media, brand }: Props) {
  const handle = brand.handle || brand.name.toLowerCase().replace(/\s+/g, "");
  const meta = PLATFORM_META[platform];

  if (platform === "instagram") {
    return (
      <div className="w-full max-w-[360px] mx-auto bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="flex items-center gap-2 px-3 py-2.5">
          <Avatar name={brand.name} src={brand.avatar} />
          <span className="text-sm font-semibold text-foreground flex-1">{handle}</span>
          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
        </div>
        <MediaBlock media={media} />
        <div className="px-3 py-2 flex items-center gap-3">
          <Heart className="w-5 h-5 text-foreground" />
          <MessageCircle className="w-5 h-5 text-foreground" />
          <Send className="w-5 h-5 text-foreground" />
          <Bookmark className="w-5 h-5 text-foreground ml-auto" />
        </div>
        <div className="px-3 pb-3 text-xs text-foreground">
          <span className="font-semibold mr-1">{handle}</span>
          {caption}
        </div>
      </div>
    );
  }

  if (platform === "facebook") {
    return (
      <div className="w-full max-w-[420px] mx-auto bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="flex items-center gap-2 px-3 py-2.5">
          <Avatar name={brand.name} src={brand.avatar} />
          <div className="flex-1">
            <div className="text-sm font-semibold text-foreground">{brand.name}</div>
            <div className="text-[11px] text-muted-foreground">Sponsored · 🌐</div>
          </div>
          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="px-3 pb-2 text-sm text-foreground">{caption}</div>
        <MediaBlock media={media} />
        <div className="px-3 py-2 flex items-center gap-4 border-t border-border text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><ThumbsUp className="w-4 h-4" /> Like</span>
          <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4" /> Comment</span>
          <span className="flex items-center gap-1"><Send className="w-4 h-4" /> Share</span>
        </div>
      </div>
    );
  }

  if (platform === "linkedin") {
    return (
      <div className="w-full max-w-[420px] mx-auto bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="flex items-center gap-2 px-3 py-2.5">
          <Avatar name={brand.name} src={brand.avatar} />
          <div className="flex-1">
            <div className="text-sm font-semibold text-foreground">{brand.name}</div>
            <div className="text-[11px] text-muted-foreground">Brand Page · Promoted</div>
          </div>
        </div>
        <div className="px-3 pb-2 text-sm text-foreground whitespace-pre-line">{caption}</div>
        <MediaBlock media={media} />
        <div className="px-3 py-2 flex items-center gap-4 border-t border-border text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><ThumbsUp className="w-4 h-4" /> Like</span>
          <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4" /> Comment</span>
          <span className="flex items-center gap-1"><Repeat2 className="w-4 h-4" /> Repost</span>
        </div>
      </div>
    );
  }

  if (platform === "twitter") {
    return (
      <div className="w-full max-w-[420px] mx-auto bg-card border border-border rounded-xl p-3 shadow-sm">
        <div className="flex gap-2">
          <Avatar name={brand.name} src={brand.avatar} />
          <div className="flex-1 min-w-0">
            <div className="text-sm">
              <span className="font-semibold text-foreground">{brand.name}</span>{" "}
              <span className="text-muted-foreground">@{handle}</span>
            </div>
            <div className="text-sm text-foreground mt-1 whitespace-pre-line">{caption}</div>
            {media.length > 0 && (
              <div className="mt-2 rounded-xl overflow-hidden border border-border">
                <img src={media[0].url} alt="" className="w-full max-h-72 object-cover" />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Generic fallback (TikTok / YouTube)
  return (
    <div className="w-full max-w-[360px] mx-auto bg-card border border-border rounded-xl overflow-hidden shadow-sm">
      <div className={cn("h-1.5", meta.bg)} />
      <MediaBlock media={media} />
      <div className="px-3 py-2 text-xs text-foreground">
        <span className="font-semibold">@{handle}</span> · {meta.label}
        <p className="mt-1 text-muted-foreground">{caption}</p>
      </div>
    </div>
  );
}
