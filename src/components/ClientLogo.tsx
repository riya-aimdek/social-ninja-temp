import { cn } from "@/lib/utils";

interface ClientLogoProps {
  name: string;
  logoUrl?: string;
  /** Tailwind background class (used when no logoUrl). Defaults to a hashed brand tint. */
  color?: string;
  /** px size — controls width/height/text */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  rounded?: "md" | "lg" | "xl" | "full";
}

const sizeMap = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-lg",
} as const;

const roundedMap = {
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
} as const;

const palette = [
  "bg-primary",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-violet-500",
  "bg-sky-500",
  "bg-rose-500",
  "bg-teal-500",
];

const hash = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

const getInitials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "?";

const ClientLogo = ({
  name,
  logoUrl,
  color,
  size = "md",
  className,
  rounded = "lg",
}: ClientLogoProps) => {
  const bg = color || palette[hash(name) % palette.length];
  const initials = getInitials(name);

  return (
    <div
      className={cn(
        sizeMap[size],
        roundedMap[rounded],
        "shrink-0 overflow-hidden flex items-center justify-center font-bold text-white ring-1 ring-border/40 shadow-sm",
        !logoUrl && bg,
        className,
      )}
      title={name}
    >
      {logoUrl ? (
        <img src={logoUrl} alt={`${name} logo`} className="w-full h-full object-cover" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};

export default ClientLogo;
