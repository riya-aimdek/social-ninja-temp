import { useState } from "react";
import { format } from "date-fns";
import {
  X, Send, ThumbsUp, ThumbsDown, Calendar as CalendarIcon,
  Users, Pencil, CalendarClock, Check, ChevronDown, Globe,
  Clock, AlertCircle, FileEdit, Link2,
} from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import PostPreview from "./PostPreview";
import {
  PLATFORM_META, STATUS_META, formatDateTime,
  type PostDraft, type AuditEvent, type Platform,
} from "@/data/publishMockData";
import { cn } from "@/lib/utils";
import { TimePickerPopup } from "@/components/ui/TimePickerPopup";

export type PostAction = "approve" | "reject" | "send" | "schedule" | "edit_resubmit" | "reschedule";

interface Props {
  post: PostDraft | null;
  onClose: () => void;
  onAction?: (
    postId: string,
    action: PostAction,
    payload?: { reason?: string; caption?: string; scheduledFor?: string },
  ) => void;
}

const isContentChange = (action: string) => {
  const a = action.toLowerCase();
  return a.includes("edit") || a.includes("resubmit") || a.includes("caption");
};

const iconFor = (action: string) => {
  const a = action.toLowerCase();
  if (a.includes("approved"))  return { I: Check,       color: "text-success",          bg: "bg-success/15",  dot: "bg-success"  };
  if (a.includes("rejected"))  return { I: ThumbsDown,  color: "text-error",            bg: "bg-error/15",    dot: "bg-error"    };
  if (a.includes("sent"))      return { I: Send,         color: "text-info",             bg: "bg-info/15",     dot: "bg-info"     };
  if (a.includes("scheduled")) return { I: Clock,        color: "text-info",             bg: "bg-info/15",     dot: "bg-info"     };
  if (a.includes("published")) return { I: Globe,        color: "text-success",          bg: "bg-success/15",  dot: "bg-success"  };
  if (a.includes("failed"))    return { I: AlertCircle,  color: "text-error",            bg: "bg-error/15",    dot: "bg-error"    };
  if (isContentChange(action)) return { I: FileEdit,     color: "text-primary",          bg: "bg-primary/10",  dot: "bg-primary"  };
  return                              { I: FileEdit,     color: "text-muted-foreground", bg: "bg-muted",       dot: "bg-muted-foreground" };
};

export default function PostDetailDrawer({ post, onClose, onAction }: Props) {
  const [activePlatformIdx, setActivePlatformIdx]     = useState(0);
  const [rejectReason, setRejectReason]               = useState("");
  const [showReject, setShowReject]                   = useState(false);
  const [editing, setEditing]                         = useState(false);
  const [draftCaption, setDraftCaption]               = useState("");
  const [expandedSnapshots, setExpandedSnapshots]     = useState<Set<string>>(new Set());
  const [snapshotPlatformIdx, setSnapshotPlatformIdx] = useState<Record<string, number>>({});
  const [rescheduleOpen, setRescheduleOpen]           = useState(false);
  const [newDate, setNewDate]                         = useState<Date | undefined>(undefined);
  const [newTime, setNewTime]                         = useState("10:00");

  if (!post) return null;

  const status         = STATUS_META[post.status];
  const activePlatform = post.platforms[activePlatformIdx] || post.platforms[0];
  const approvalUrl    = `${window.location.origin}/approve/${post.approvalToken}`;
  const auditNewest    = [...post.audit].reverse();

  const copyLink   = () => { navigator.clipboard.writeText(approvalUrl); toast.success("Approval link copied"); };
  const startEdit  = () => { setDraftCaption(post.caption); setEditing(true); };
  const submitEdit = () => {
    if (!draftCaption.trim()) { toast.error("Caption can't be empty"); return; }
    onAction?.(post.id, "edit_resubmit", { caption: draftCaption.trim() });
    setEditing(false);
  };

  const toggleSnapshot = (id: string) =>
    setExpandedSnapshots(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const getSnapshotPlatform = (eventId: string): Platform =>
    post.platforms[snapshotPlatformIdx[eventId] ?? 0] || post.platforms[0];

  const setSnapshotPlatform = (eventId: string, idx: number) =>
    setSnapshotPlatformIdx(prev => ({ ...prev, [eventId]: idx }));

  const startReschedule = () => {
    const d = new Date(post.scheduledFor);
    setNewDate(d);
    setNewTime(`${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`);
    setRescheduleOpen(true);
  };
  const submitReschedule = () => {
    if (!newDate) { toast.error("Pick a date"); return; }
    const [h, m] = newTime.split(":").map(Number);
    const merged = new Date(newDate);
    merged.setHours(h || 0, m || 0, 0, 0);
    if (merged.getTime() < Date.now()) { toast.error("Pick a future date and time"); return; }
    onAction?.(post.id, "reschedule", { scheduledFor: merged.toISOString() });
    setRescheduleOpen(false);
  };

  return (
    <Sheet open={!!post} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-[480px] p-0 flex flex-col overflow-hidden">

        {/* ── Sticky header ── */}
        <div className="shrink-0 border-b border-border bg-card px-4 py-3 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0">
            {post.clientName.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-foreground truncate">{post.clientName} · {post.projectName}</div>
            <div className="text-[11px] text-muted-foreground">by {post.createdBy} · {formatDateTime(post.createdAt)}</div>
          </div>
          <span className={cn("text-[11px] px-2.5 py-1 rounded-full font-medium shrink-0", status.classes)}>{status.label}</span>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-accent shrink-0">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto">

          {/* ── Meta bar: schedule + approval ── */}
          <div className="px-4 pt-3 pb-3 border-b border-border space-y-2">
            {/* Row 1: scheduled date + copy link */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-1 min-w-0">
                <CalendarIcon className="w-3.5 h-3.5 shrink-0" />
                {post.scheduledFor
                  ? <><span className="shrink-0">Scheduled for</span><span className="text-foreground font-medium ml-1 truncate">{formatDateTime(post.scheduledFor)}</span></>
                  : <span className="italic">Not scheduled yet</span>}
              </div>
              <Button size="sm" variant="outline" onClick={copyLink} className="h-7 text-xs gap-1.5 shrink-0 px-2.5">
                <Link2 className="w-3 h-3" /> Copy approval link
              </Button>
            </div>
            {/* Row 2: assignees */}
            {post.reviewers.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <Users className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span className="text-[11px] text-muted-foreground shrink-0">Assigned:</span>
                {post.reviewers.map((r) => (
                  <span key={r} className="text-[11px] bg-muted px-2 py-0.5 rounded-full text-foreground font-medium">{r}</span>
                ))}
              </div>
            )}
          </div>

          {/* ── Rejection reason banner ── */}
          {post.status === "rejected" && post.rejectionReason && (
            <div className="mx-4 mt-3 bg-error/8 border border-error/25 rounded-lg px-3 py-2.5 text-xs text-error flex items-start justify-between gap-3">
              <div>
                <span className="font-semibold block mb-0.5">Rejected</span>
                {post.rejectionReason}
              </div>
              {!editing && (
                <button onClick={startEdit} className="text-[11px] underline font-medium hover:opacity-80 shrink-0 mt-0.5">
                  Fix & resubmit
                </button>
              )}
            </div>
          )}

          {/* ── Unified timeline ── */}
          <div className="px-4 pt-4 pb-6">
            <ol>
              {auditNewest.map((e: AuditEvent, idx) => {
                const { dot }        = iconFor(e.action);
                const contentChanged = isContentChange(e.action);
                const isLatest       = idx === 0;
                const isLast         = idx === auditNewest.length - 1;
                const snapshotOpen   = expandedSnapshots.has(e.id);
                const snapPlatform   = getSnapshotPlatform(e.id);

                return (
                  <li key={e.id} className="flex gap-3">
                    {/* Left: dot + line */}
                    <div className="flex flex-col items-center shrink-0 pt-[5px]">
                      <span className={cn("w-2.5 h-2.5 rounded-full shrink-0", dot)} />
                      {!isLast && <div className="w-px flex-1 min-h-[16px] mt-1 bg-border" />}
                    </div>

                    {/* Right: content */}
                    <div className={cn("flex-1 min-w-0", isLast ? "pb-0" : "pb-4")}>
                      <div className="text-sm leading-snug">
                        <span className="font-semibold text-foreground">{e.actor}</span>{" "}
                        <span className="text-muted-foreground">{e.action.toLowerCase()}</span>
                      </div>
                      {e.detail && (
                        <p className="text-xs text-muted-foreground mt-0.5">{e.detail}</p>
                      )}
                      <p className="text-[11px] text-muted-foreground/70 tabular-nums mt-0.5">
                        {formatDateTime(e.at)}
                      </p>

                      {/* Latest: inline post preview */}
                      {isLatest && (
                        <div className="mt-2.5">
                          {editing ? (
                            <div className="border border-border rounded-xl p-3 bg-muted/30 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-foreground">Edit caption</span>
                                <span className="text-[11px] text-muted-foreground">{draftCaption.length} chars</span>
                              </div>
                              <Textarea
                                value={draftCaption}
                                onChange={(ev) => setDraftCaption(ev.target.value)}
                                className="min-h-[90px] text-sm"
                                placeholder="Update the caption..."
                              />
                              <div className="flex gap-2 justify-end">
                                <Button size="sm" variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
                                <Button size="sm" onClick={submitEdit}>
                                  <Send className="w-3.5 h-3.5" /> Save & resubmit
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="rounded-xl overflow-hidden border border-border shadow-sm">
                              {/* Platform tabs */}
                              <div className="flex items-center gap-0.5 border-b border-border px-2 pt-1 bg-zinc-50 dark:bg-zinc-900">
                                {post.platforms.map((p, i) => {
                                  const m = PLATFORM_META[p];
                                  return (
                                    <button
                                      key={p}
                                      onClick={() => setActivePlatformIdx(i)}
                                      className={cn(
                                        "px-2.5 py-1.5 text-[11px] font-medium border-b-2 -mb-px transition-colors whitespace-nowrap",
                                        i === activePlatformIdx
                                          ? `${m.color} border-current`
                                          : "text-muted-foreground border-transparent hover:text-foreground",
                                      )}
                                    >
                                      {m.label}
                                    </button>
                                  );
                                })}
                              </div>
                              <PostPreview
                                platform={activePlatform}
                                caption={post.caption}
                                media={post.media}
                                brand={{ name: post.clientName }}
                                postType={post.postType}
                              />
                            </div>
                          )}
                        </div>
                      )}

                      {/* Older edit events: collapsible snapshot */}
                      {contentChanged && !isLatest && (
                        <div className="mt-1.5">
                          <button
                            onClick={() => toggleSnapshot(e.id)}
                            className="flex items-center gap-1 text-[11px] text-primary font-medium hover:underline"
                          >
                            <ChevronDown className={cn("w-3 h-3 transition-transform duration-150", snapshotOpen && "rotate-180")} />
                            {snapshotOpen ? "Hide" : "View"} post at this version
                          </button>

                          {snapshotOpen && (
                            <div className="mt-2 rounded-xl overflow-hidden border border-border shadow-sm">
                              {post.platforms.length > 0 && (
                                <div className="flex items-center gap-0.5 border-b border-border px-2 pt-1 bg-zinc-50 dark:bg-zinc-900">
                                  {post.platforms.map((p, i) => {
                                    const m = PLATFORM_META[p];
                                    return (
                                      <button
                                        key={p}
                                        onClick={() => setSnapshotPlatform(e.id, i)}
                                        className={cn(
                                          "px-2.5 py-1.5 text-[11px] font-medium border-b-2 -mb-px transition-colors whitespace-nowrap",
                                          (snapshotPlatformIdx[e.id] ?? 0) === i
                                            ? `${m.color} border-current`
                                            : "text-muted-foreground border-transparent hover:text-foreground",
                                        )}
                                      >
                                        {m.label}
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                              <PostPreview
                                platform={snapPlatform}
                                caption={post.caption}
                                media={post.media}
                                brand={{ name: post.clientName }}
                                postType={post.postType}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

        </div>

        {/* ── Sticky footer ── */}
        <div className="shrink-0 border-t border-border bg-card px-4 py-3 flex items-center gap-2 flex-wrap">
          {showReject ? (
            <div className="flex-1 flex gap-2 items-start">
              <Textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Reason for rejection..."
                className="flex-1 min-h-[56px] text-sm"
              />
              <div className="flex flex-col gap-1.5">
                <Button size="sm" variant="outline" onClick={() => setShowReject(false)}>Cancel</Button>
                <Button size="sm" variant="destructive" onClick={() => {
                  onAction?.(post.id, "reject", { reason: rejectReason });
                  setShowReject(false); setRejectReason("");
                }}>Confirm</Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1" />
              {post.status === "draft" && (
                <Button size="sm" onClick={() => onAction?.(post.id, "send")}>
                  <Send className="w-3.5 h-3.5" /> Send for approval
                </Button>
              )}
              {post.status === "pending_approval" && (
                <>
                  <Button size="sm" variant="outline" onClick={() => setShowReject(true)}>
                    <ThumbsDown className="w-3.5 h-3.5" /> Reject
                  </Button>
                  <Button size="sm" onClick={() => onAction?.(post.id, "approve")}>
                    <ThumbsUp className="w-3.5 h-3.5" /> Approve
                  </Button>
                </>
              )}
              {post.status === "approved" && (
                <Button size="sm" onClick={() => onAction?.(post.id, "schedule")}>
                  <CalendarIcon className="w-3.5 h-3.5" /> Schedule now
                </Button>
              )}
              {post.status === "rejected" && !editing && (
                <>
                  <ReschedulePopover
                    open={rescheduleOpen} onOpenChange={setRescheduleOpen}
                    date={newDate} setDate={setNewDate} time={newTime} setTime={setNewTime}
                    onOpen={startReschedule} onSubmit={submitReschedule}
                  />
                  <Button size="sm" onClick={startEdit}>
                    <Pencil className="w-3.5 h-3.5" /> Edit & resubmit
                  </Button>
                </>
              )}
              {post.status === "scheduled" && (
                <ReschedulePopover
                  open={rescheduleOpen} onOpenChange={setRescheduleOpen}
                  date={newDate} setDate={setNewDate} time={newTime} setTime={setNewTime}
                  onOpen={startReschedule} onSubmit={submitReschedule}
                />
              )}
              {post.status === "published" && (
                <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-success" /> No actions required
                </span>
              )}
            </>
          )}
        </div>

      </SheetContent>
    </Sheet>
  );
}

function ReschedulePopover({
  open, onOpenChange, date, setDate, time, setTime, onOpen, onSubmit,
}: {
  open: boolean; onOpenChange: (v: boolean) => void;
  date: Date | undefined; setDate: (d: Date | undefined) => void;
  time: string; setTime: (t: string) => void;
  onOpen: () => void; onSubmit: () => void;
}) {
  return (
    <Popover open={open} onOpenChange={(v) => { if (v) onOpen(); else onOpenChange(false); }}>
      <PopoverTrigger asChild>
        <Button size="sm" variant="outline"><CalendarClock className="w-3.5 h-3.5" /> Reschedule</Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-auto p-0">
        <Calendar
          mode="single" selected={date} onSelect={setDate}
          disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
          initialFocus className={cn("p-3 pointer-events-auto")}
        />
        <div className="border-t border-border p-3 flex items-center gap-2">
          <label className="text-xs text-muted-foreground">Time</label>
          <TimePickerPopup value={time} onChange={setTime} className="flex-1" />
          <Button size="sm" onClick={onSubmit}>{date ? format(date, "MMM d") : "Pick"} · {time}</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
