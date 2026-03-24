import { cn } from "@/lib/utils";

interface RoleBadgeProps {
  role: 'super-admin' | 'agency' | 'organization' | 'user' | 'content-creator' | 'approver' | 'engagement' | 'analyst' | 'guest';
  className?: string;
}

const roleConfig: Record<string, { label: string; color: string; bg: string }> = {
  'super-admin': { label: 'Super Admin', color: 'text-super-admin', bg: 'bg-super-admin/15' },
  'agency': { label: 'Agency', color: 'text-agency', bg: 'bg-agency/15' },
  'organization': { label: 'Organization', color: 'text-organization', bg: 'bg-organization/15' },
  'user': { label: 'User', color: 'text-user-role', bg: 'bg-user-role/15' },
  'content-creator': { label: 'Content Creator', color: 'text-user-role', bg: 'bg-user-role/15' },
  'approver': { label: 'Approver', color: 'text-warning', bg: 'bg-warning/15' },
  'engagement': { label: 'Engagement', color: 'text-agency', bg: 'bg-agency/15' },
  'analyst': { label: 'Analyst', color: 'text-super-admin', bg: 'bg-super-admin/15' },
  'guest': { label: 'Guest', color: 'text-text-muted', bg: 'bg-muted' },
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
