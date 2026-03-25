import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: 'active' | 'pending' | 'suspended' | 'paid' | 'unpaid' | 'invited';
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const styles: Record<string, string> = {
    active: 'status-active',
    pending: 'status-pending',
    suspended: 'status-suspended',
    paid: 'status-active',
    unpaid: 'status-pending',
    invited: 'status-invited',
  };

  return (
    <span className={cn(styles[status] || 'status-pending', className)}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default StatusBadge;
