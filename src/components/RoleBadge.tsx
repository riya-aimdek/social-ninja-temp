import { cn } from "@/lib/utils";

interface RoleBadgeProps {
  role: 'super-admin' | 'agency-admin' | 'agency-account-manager' | 'business-admin' | 'content-creator' | 'approver' | 'social-media-manager' | 'guest' | 'agency' | 'organization' | 'business' | 'user' | 'engagement' | 'analyst';
  className?: string;
}

const roleConfig: Record<string, { label: string; color: string; bg: string }> = {
  'super-admin': { label: 'Super Admin', color: 'text-super-admin', bg: 'bg-super-admin/15' },
  'agency-admin': { label: 'Agency Admin', color: 'text-agency', bg: 'bg-agency/15' },
  'agency-account-manager': { label: 'Account Manager', color: 'text-info', bg: 'bg-info/15' },
  'business-admin': { label: 'Business Admin', color: 'text-client', bg: 'bg-client/15' },
  'content-creator': { label: 'Content Creator', color: 'text-user-role', bg: 'bg-user-role/15' },
  'approver': { label: 'Approver', color: 'text-warning', bg: 'bg-warning/15' },
  'social-media-manager': { label: 'Social Media Manager', color: 'text-primary', bg: 'bg-primary/15' },
  'guest': { label: 'Guest', color: 'text-muted-foreground', bg: 'bg-muted' },
  // Legacy aliases
  'agency': { label: 'Agency', color: 'text-agency', bg: 'bg-agency/15' },
  'organization': { label: 'Business', color: 'text-client', bg: 'bg-client/15' },
  'business': { label: 'Business', color: 'text-client', bg: 'bg-client/15' },
  'user': { label: 'User', color: 'text-user-role', bg: 'bg-user-role/15' },
  'engagement': { label: 'Engagement', color: 'text-agency', bg: 'bg-agency/15' },
  'analyst': { label: 'Analyst', color: 'text-super-admin', bg: 'bg-super-admin/15' },
};

const RoleBadge = ({ role, className }: RoleBadgeProps) => {
  const config = roleConfig[role] || roleConfig['user'];
  return (
    <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', config.bg, config.color, className)}>
      {config.label}
    </span>
  );
};

export default RoleBadge;
