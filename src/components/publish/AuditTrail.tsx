import { Check, X, Clock, Send, FileEdit, Globe, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDateTime, type AuditEvent } from "@/data/publishMockData";

const iconFor = (action: string) => {
  const a = action.toLowerCase();
  if (a.includes("approved")) return { I: Check, color: "text-success", bg: "bg-success/15" };
  if (a.includes("rejected")) return { I: X, color: "text-error", bg: "bg-error/15" };
  if (a.includes("sent")) return { I: Send, color: "text-info", bg: "bg-info/15" };
  if (a.includes("scheduled")) return { I: Clock, color: "text-info", bg: "bg-info/15" };
  if (a.includes("published")) return { I: Globe, color: "text-success", bg: "bg-success/15" };
  if (a.includes("failed")) return { I: AlertCircle, color: "text-error", bg: "bg-error/15" };
  return { I: FileEdit, color: "text-muted-foreground", bg: "bg-muted" };
};

export default function AuditTrail({ events }: { events: AuditEvent[] }) {
  return (
    <ol className="relative ml-2 border-l border-border space-y-4">
      {events.map((e) => {
        const { I, color, bg } = iconFor(e.action);
        return (
          <li key={e.id} className="ml-4 relative">
            <span className={cn("absolute -left-[26px] top-0.5 w-5 h-5 rounded-full flex items-center justify-center", bg)}>
              <I className={cn("w-3 h-3", color)} />
            </span>
            <div className="text-sm text-foreground">
              <span className="font-medium">{e.actor}</span>{" "}
              <span className="text-muted-foreground">{e.action.toLowerCase()}</span>
            </div>
            {e.detail && <div className="text-xs text-muted-foreground mt-0.5">{e.detail}</div>}
            <div className="text-[11px] text-muted-foreground mt-0.5 tabular-nums">{formatDateTime(e.at)}</div>
          </li>
        );
      })}
    </ol>
  );
}
