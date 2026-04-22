import { cn } from "@/lib/utils";
import { Eye, Shield, Headphones } from "lucide-react";

interface RoleBadgeProps {
  /** A role id from `data/roles.ts` OR a legacy alias. */
  role: string;
  className?: string;
  /** Compact mode hides the icon. */
  compact?: boolean;
}

interface BadgeStyle {
  label: string;
  color: string;
  bg: string;
  ring?: string;
  icon?: typeof Eye;
}

const roleConfig: Record<string, BadgeStyle> = {
  // Super Admin
  "super-admin": { label: "Super Admin", color: "text-super-admin", bg: "bg-super-admin/15", ring: "ring-super-admin/20" },

  // Agency
  "agency-admin": { label: "Agency Admin", color: "text-agency", bg: "bg-agency/15", ring: "ring-agency/20" },
  "agency-account-manager": { label: "Account Manager", color: "text-info", bg: "bg-info/15" },

  // Client / Business
  "business-admin": { label: "Client Admin", color: "text-client", bg: "bg-client/15", ring: "ring-client/20" },
  "social-media-manager": { label: "Social Media Manager", color: "text-primary", bg: "bg-primary/15" },
  "content-creator": { label: "Content Creator", color: "text-user-role", bg: "bg-user-role/15" },
  approver: { label: "Approver", color: "text-warning", bg: "bg-warning/15" },

  // NEW: ORM
  orm: { label: "ORM Specialist", color: "text-violet-700 dark:text-violet-300", bg: "bg-violet-100 dark:bg-violet-500/20", ring: "ring-violet-300/40", icon: Headphones },

  // NEW: Normal User (read-only)
  "normal-user": { label: "Normal User", color: "text-muted-foreground", bg: "bg-muted", ring: "ring-border", icon: Eye },

  // NEW: Client posting modes
  "client-scheduled": { label: "Client · Scheduled", color: "text-client", bg: "bg-client/15", ring: "ring-client/20" },
  "client-immediate": { label: "Client · Live", color: "text-success", bg: "bg-success/15", ring: "ring-success/30" },

  // NEW: Client Reviewer (approval-only)
  "client-reviewer": { label: "Client Reviewer", color: "text-amber-700 dark:text-amber-300", bg: "bg-amber-100 dark:bg-amber-500/20", ring: "ring-amber-300/40", icon: Shield },

  // Guest
  guest: { label: "Guest", color: "text-muted-foreground", bg: "bg-muted" },

  // Legacy aliases — keep for backward compat
  agency: { label: "Agency", color: "text-agency", bg: "bg-agency/15" },
  organization: { label: "Business", color: "text-client", bg: "bg-client/15" },
  business: { label: "Business", color: "text-client", bg: "bg-client/15" },
  user: { label: "User", color: "text-user-role", bg: "bg-user-role/15" },
  engagement: { label: "Engagement", color: "text-agency", bg: "bg-agency/15" },
  analyst: { label: "Analyst", color: "text-super-admin", bg: "bg-super-admin/15" },
};

const RoleBadge = ({ role, className, compact = false }: RoleBadgeProps) => {
  const config = roleConfig[role] || roleConfig["user"];
  const Icon = config.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap",
        config.bg,
        config.color,
        config.ring && "ring-1",
        config.ring,
        className,
      )}
    >
      {Icon && !compact && <Icon className="h-3 w-3" />}
      {config.label}
    </span>
  );
};

export default RoleBadge;
