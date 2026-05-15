import { useState, RefObject } from "react";
import { Bold, Italic, Underline, Smile, Link2, List, Sparkles } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

/**
 * Unicode style maps — used to "format" text for platforms that strip HTML
 * (Instagram, X, LinkedIn captions, etc.). This is the standard approach used
 * by tools like Buffer / Hootsuite for caption styling.
 */
const STYLE_MAPS = {
  bold: {
    upper: "𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭",
    lower: "𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇",
    digit: "𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵",
  },
  italic: {
    upper: "𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡",
    lower: "𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻",
    digit: "0123456789",
  },
};

const transform = (text: string, style: "bold" | "italic"): string => {
  const map = STYLE_MAPS[style];
  return [...text].map((ch) => {
    const code = ch.charCodeAt(0);
    if (code >= 65 && code <= 90) return [...map.upper][code - 65] ?? ch;
    if (code >= 97 && code <= 122) return [...map.lower][code - 97] ?? ch;
    if (code >= 48 && code <= 57) return [...map.digit][code - 48] ?? ch;
    return ch;
  }).join("");
};

const EMOJI_GROUPS: Record<string, string[]> = {
  Smileys: ["😀","😃","😄","😁","😆","😊","🙂","😉","😍","🥰","😘","😎","🤩","🥳","😇","🤔","🙃","😅","😂","🤣"],
  Gestures: ["👍","👎","👏","🙌","🤝","🙏","✌️","🤞","💪","👌","👋","🫶","🤟","🫡","👇","👆","☝️","👉","👈","🤙"],
  Hearts: ["❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💖","💕","💞","💓","💗","💘","💝","💟","♥️","💔","❣️"],
  Objects: ["🔥","✨","⭐","🌟","💯","🎉","🎊","🚀","💡","📢","📣","📌","🎯","💎","🏆","🥇","📈","📊","💼","💰"],
  Nature: ["🌸","🌺","🌻","🌼","🌷","🌹","🌿","🍀","🌈","☀️","⚡","❄️","🌊","🌍","🌙","🪐","☁️","🔮","🌪️","🌞"],
};

interface Props {
  textareaRef: RefObject<HTMLTextAreaElement>;
  value: string;
  onChange: (next: string) => void;
  onAiClick?: () => void;
  className?: string;
}

const RichTextToolbar = ({ textareaRef, value, onChange, onAiClick, className }: Props) => {
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [emojiGroup, setEmojiGroup] = useState<string>("Smileys");

  const getSelection = () => {
    const el = textareaRef.current;
    if (!el) return { start: value.length, end: value.length, selected: "" };
    return { start: el.selectionStart, end: el.selectionEnd, selected: value.slice(el.selectionStart, el.selectionEnd) };
  };

  const replaceSelection = (replacement: string, cursorOffset?: number) => {
    const { start, end } = getSelection();
    const next = value.slice(0, start) + replacement + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      const el = textareaRef.current;
      if (!el) return;
      const pos = start + (cursorOffset ?? replacement.length);
      el.focus();
      el.setSelectionRange(pos, pos);
    });
  };

  const applyStyle = (style: "bold" | "italic") => {
    const { selected } = getSelection();
    if (!selected) return;
    replaceSelection(transform(selected, style));
  };

  const applyUnderline = () => {
    const { selected } = getSelection();
    if (!selected) return;
    // Combining low line for underline effect
    const underlined = [...selected].map((ch) => ch + "\u0332").join("");
    replaceSelection(underlined);
  };

  const applyList = () => {
    const { start, end } = getSelection();
    const slice = value.slice(start, end) || "Item";
    const lines = slice.split("\n").map((l) => (l.trim() ? `• ${l.replace(/^•\s*/, "")}` : l));
    replaceSelection(lines.join("\n"));
  };

  const insertEmoji = (emoji: string) => {
    replaceSelection(emoji);
    setEmojiOpen(false);
  };

  const insertLink = () => {
    if (!linkUrl) return;
    const display = linkText || linkUrl;
    replaceSelection(`${display} (${linkUrl})`);
    setLinkUrl(""); setLinkText(""); setLinkOpen(false);
  };

  const btn = "p-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground";

  return (
    <div className={cn("flex items-center gap-0.5 flex-wrap", className)}>
      <button type="button" onClick={() => applyStyle("bold")} className={btn} title="Bold">
        <Bold className="w-4 h-4" />
      </button>

      <span className="w-px h-4 bg-border mx-1" />

      <button type="button" onClick={applyList} className={btn} title="Bullet list">
        <List className="w-4 h-4" />
      </button>

      <Popover open={emojiOpen} onOpenChange={setEmojiOpen}>
        <PopoverTrigger asChild>
          <button type="button" className={btn} title="Emoji">
            <Smile className="w-4 h-4" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-0" align="start">
          <div className="flex items-center gap-1 p-2 border-b border-border overflow-x-auto">
            {Object.keys(EMOJI_GROUPS).map((g) => (
              <button
                key={g}
                onClick={() => setEmojiGroup(g)}
                className={cn(
                  "px-2 py-1 text-[11px] font-medium rounded-md whitespace-nowrap transition-colors",
                  emojiGroup === g ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent",
                )}
              >
                {g}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-8 gap-1 p-2 max-h-48 overflow-y-auto">
            {EMOJI_GROUPS[emojiGroup].map((e) => (
              <button
                key={e}
                onClick={() => insertEmoji(e)}
                className="text-lg hover:bg-accent rounded p-1 transition-colors"
              >
                {e}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <Popover open={linkOpen} onOpenChange={setLinkOpen}>
        <PopoverTrigger asChild>
          <button type="button" className={btn} title="Insert link">
            <Link2 className="w-4 h-4" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-3 space-y-2" align="start">
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-muted-foreground">URL</label>
            <input
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-2 py-1.5 text-xs rounded-md border border-input bg-background outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button
            onClick={insertLink}
            disabled={!linkUrl}
            className="w-full px-3 py-1.5 text-xs font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary-hover disabled:opacity-50"
          >
            Insert link
          </button>
        </PopoverContent>
      </Popover>

      {onAiClick && (
        <>
          <span className="w-px h-4 bg-border mx-1" />
          <button type="button" onClick={onAiClick} className={cn(btn, "text-primary hover:text-primary inline-flex flex-row items-center gap-1 px-2")} title="AI Assist">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-medium">AI</span>
          </button>
        </>
      )}
    </div>
  );
};

export default RichTextToolbar;
