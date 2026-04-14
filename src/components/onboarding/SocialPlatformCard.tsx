import { CheckCircle2, LucideIcon } from "lucide-react";

interface SocialPlatformCardProps {
  name: string;
  icon: LucideIcon;
  color: string;
  isConnected: boolean;
  onClick: () => void;
  compact?: boolean;
}

const SocialPlatformCard = ({ name, icon: Icon, color, isConnected, onClick, compact }: SocialPlatformCardProps) => {
  if (compact) {
    return (
      <button
        onClick={onClick}
        className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 ${
          isConnected
            ? "border-primary bg-primary/5 shadow-sm"
            : "border-border hover:border-primary/40 hover:bg-muted/50"
        }`}
      >
        <Icon className={`h-5 w-5 ${color}`} />
        <span className="text-sm font-medium text-foreground">{name}</span>
        {isConnected && <CheckCircle2 className="h-4 w-4 text-primary ml-auto" />}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 group ${
        isConnected
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-border hover:border-primary/40 hover:shadow-sm"
      }`}
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
        isConnected ? "bg-primary/10" : "bg-muted group-hover:bg-primary/5"
      }`}>
        <Icon className={`h-5 w-5 ${color}`} />
      </div>
      <div className="flex-1 text-left">
        <p className="text-sm font-medium text-foreground">{name}</p>
        <p className="text-xs text-muted-foreground">
          {isConnected ? "Connected ✓" : "Click to connect via OAuth"}
        </p>
      </div>
      {isConnected && <CheckCircle2 className="h-5 w-5 text-primary" />}
    </button>
  );
};

export default SocialPlatformCard;
