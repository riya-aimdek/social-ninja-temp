import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: 'active' | 'pending' | 'suspended' | 'paid' | 'unpaid';
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const styles = {
    active: 'status-active',
    pending: 'status-pending',
    suspended: 'status-suspended',
    paid: 'status-active',
    unpaid: 'status-pending',
  };

  return (
    <span className={cn(styles[status], className)}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default StatusBadge;
