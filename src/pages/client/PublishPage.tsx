import { useMemo, useState } from "react";
import {
  CalendarDays, List as ListIcon, LayoutGrid, ChevronLeft, ChevronRight, Plus,
  Clock, CheckCircle2, AlertCircle, Send as SendIcon, Search,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import PostDetailDrawer from "@/components/publish/PostDetailDrawer";
import {
  MOCK_POSTS, PLATFORM_META, STATUS_META, formatDateTime,
  type PostDraft, type PostStatus,
} from "@/data/publishMockData";
import { cn } from "@/lib/utils";

type View = "calendar" | "list" | "board";
type Filter = "all" | PostStatus;

const ALL_FILTER_TABS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "draft", label: "Drafts" },
  { id: "pending_approval", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "scheduled", label: "Scheduled" },
  { id: "published", label: "Published" },
  { id: "rejected", label: "Rejected" },
];

// Drafts have no schedule date and Approved is a transient state — hide from calendar
const CALENDAR_HIDDEN_FILTERS: Filter[] = ["draft", "approved"];

const BOARD_COLUMNS: PostStatus[] = ["draft", "pending_approval", "approved", "scheduled", "published"];

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function PublishPage() {
  const [posts, setPosts] = useState<PostDraft[]>(MOCK_POSTS);
  const [view, setView] = useState<View>("calendar");
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<PostDraft | null>(null);
  const [cursor, setCursor] = useState(() => new Date());

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      if (filter !== "all" && p.status !== filter) return false;
      if (search && !`${p.caption} ${p.clientName} ${p.projectName}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [posts, filter, search]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: posts.length };
    posts.forEach((p) => { c[p.status] = (c[p.status] || 0) + 1; });
    return c;
  }, [posts]);

  const summary = useMemo(() => ({
    pending: counts.pending_approval || 0,
    scheduled: counts.scheduled || 0,
    published: counts.published || 0,
    rejected: counts.rejected || 0,
  }), [counts]);

  // Filter tabs visible for the current view (drafts/approved hidden in calendar)
  const visibleFilterTabs = useMemo(
    () => view === "calendar"
      ? ALL_FILTER_TABS.filter((t) => !CALENDAR_HIDDEN_FILTERS.includes(t.id))
      : ALL_FILTER_TABS,
    [view],
  );

  // If user switches to calendar while a hidden filter is active, fall back to "all"
  const handleViewChange = (next: View) => {
    if (next === "calendar" && CALENDAR_HIDDEN_FILTERS.includes(filter)) {
      setFilter("all");
    }
    setView(next);
  };

  const handleAction = (
    id: string,
    action: "approve" | "reject" | "send" | "schedule" | "edit_resubmit" | "reschedule",
    payload?: { reason?: string; caption?: string; scheduledFor?: string },
  ) => {
    setPosts((prev) => prev.map((p) => {
      if (p.id !== id) return p;
      const now = new Date().toISOString();
      const audit = [...p.audit];
      let next: PostDraft = { ...p };
      if (action === "approve") {
        next.status = "approved";
        audit.push({ id: `a${audit.length + 1}`, at: now, actor: "You", actorRole: "agency", action: "Approved" });
        toast.success("Post approved");
      } else if (action === "reject") {
        next.status = "rejected";
        next.rejectionReason = payload?.reason || "No reason provided";
        audit.push({ id: `a${audit.length + 1}`, at: now, actor: "You", actorRole: "agency", action: "Rejected", detail: next.rejectionReason });
        toast.error("Post rejected");
      } else if (action === "send") {
        next.status = "pending_approval";
        audit.push({ id: `a${audit.length + 1}`, at: now, actor: "You", actorRole: "agency", action: "Sent for approval" });
        toast.success("Sent for approval");
      } else if (action === "schedule") {
        next.status = "scheduled";
        audit.push({ id: `a${audit.length + 1}`, at: now, actor: "System", actorRole: "system", action: "Scheduled", detail: `Queued for ${formatDateTime(p.scheduledFor)}` });
        toast.success("Post scheduled");
      } else if (action === "edit_resubmit") {
        if (payload?.caption) next.caption = payload.caption;
        next.status = "pending_approval";
        next.rejectionReason = undefined;
        audit.push({ id: `a${audit.length + 1}`, at: now, actor: "You", actorRole: "agency", action: "Edited & resubmitted", detail: "Caption updated; sent for approval" });
        toast.success("Edited and resent for approval");
      } else if (action === "reschedule") {
        if (payload?.scheduledFor) next.scheduledFor = payload.scheduledFor;
        // Keep status as-is (rejected stays rejected; scheduled stays scheduled)
        audit.push({ id: `a${audit.length + 1}`, at: now, actor: "You", actorRole: "agency", action: "Rescheduled", detail: `New time: ${formatDateTime(next.scheduledFor)}` });
        toast.success(`Rescheduled to ${formatDateTime(next.scheduledFor)}`);
      }
      next.audit = audit;
      setSelected(next);
      return next;
    }));
  };


  // Calendar grid — drafts have no schedule date, so always exclude from calendar
  const calendarCells = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const first = new Date(year, month, 1);
    const startDay = first.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: { date: Date | null; posts: PostDraft[] }[] = [];
    const calendarPosts = filtered.filter((p) => p.status !== "draft");
    for (let i = 0; i < startDay; i++) cells.push({ date: null, posts: [] });
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const dayPosts = calendarPosts.filter((p) => {
        const pd = new Date(p.scheduledFor);
        return pd.getFullYear() === year && pd.getMonth() === month && pd.getDate() === d;
      });
      cells.push({ date, posts: dayPosts });
    }
    return cells;
  }, [cursor, filtered]);


  const monthLabel = cursor.toLocaleString(undefined, { month: "long", year: "numeric" });
  const today = new Date();
  const isToday = (d: Date) => d.toDateString() === today.toDateString();

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-end gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-border overflow-hidden bg-card">
            {([
              { id: "calendar" as View, I: CalendarDays, label: "Calendar" },
              { id: "list" as View, I: ListIcon, label: "List" },
              { id: "board" as View, I: LayoutGrid, label: "Board" },
            ]).map((v) => (
              <button
                key={v.id}
                onClick={() => handleViewChange(v.id)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 transition-colors",
                  view === v.id ? "bg-foreground text-card" : "text-foreground hover:bg-accent",
                )}
              >
                <v.I className="w-3.5 h-3.5" /> {v.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary banner — Published first, then Awaiting approval, Scheduled, Rejected */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Published", value: summary.published, I: CheckCircle2, tone: "text-success bg-success/10", filter: "published" as Filter },
          { label: "Awaiting approval", value: summary.pending, I: Clock, tone: "text-warning bg-warning/10", filter: "pending_approval" as Filter },
          { label: "Scheduled", value: summary.scheduled, I: SendIcon, tone: "text-info bg-info/10", filter: "scheduled" as Filter },
          { label: "Rejected", value: summary.rejected, I: AlertCircle, tone: "text-error bg-error/10", filter: "rejected" as Filter },
        ].map((s) => (
          <button
            key={s.label}
            onClick={() => setFilter(s.filter)}
            className="bg-card rounded-xl border border-border p-4 text-left hover:border-border-hover transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", s.tone)}>
                <s.I className="w-4 h-4" />
              </div>
              <span className="text-2xl font-bold text-foreground tabular-nums">{s.value}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-2">{s.label}</div>
          </button>
        ))}
      </div>

      {/* Filter tabs + search */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex flex-wrap gap-1.5">
          {visibleFilterTabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-full border transition-colors",
                filter === t.id
                  ? "bg-foreground text-card border-foreground"
                  : "bg-card text-muted-foreground border-border hover:text-foreground",
              )}
            >
              {t.label}
              <span className="ml-1.5 text-[10px] opacity-70">{counts[t.id] ?? 0}</span>
            </button>
          ))}
        </div>
        <div className="relative ml-auto">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search caption, client..."
            className="pl-8 pr-3 py-1.5 text-xs bg-card border border-border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Content */}
      {view === "calendar" && (
        <div className="bg-card rounded-xl shadow-card p-5">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))} className="p-1.5 rounded-lg hover:bg-accent">
              <ChevronLeft className="w-4 h-4 text-muted-foreground" />
            </button>
            <h2 className="text-sm font-semibold text-foreground">{monthLabel}</h2>
            <button onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))} className="p-1.5 rounded-lg hover:bg-accent">
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
            {daysOfWeek.map((d) => (
              <div key={d} className="bg-accent p-2 text-center text-[11px] font-medium text-muted-foreground">{d}</div>
            ))}
            {calendarCells.map((cell, i) => (
              <div key={i} className={cn("bg-card p-2 min-h-[92px] transition-colors", cell.date && "hover:bg-accent/30")}>
                {cell.date && (
                  <>
                    <span className={cn(
                      "inline-flex items-center justify-center w-5 h-5 text-[11px] font-medium rounded-full",
                      isToday(cell.date) ? "bg-primary text-primary-foreground" : "text-foreground",
                    )}>
                      {cell.date.getDate()}
                    </span>
                    <div className="space-y-1 mt-1">
                      {cell.posts.slice(0, 3).map((p) => {
                        const status = STATUS_META[p.status];
                        return (
                          <button
                            key={p.id}
                            onClick={() => setSelected(p)}
                            className="w-full text-left text-[10px] px-1.5 py-1 rounded bg-muted/60 hover:bg-muted flex items-center gap-1 truncate"
                          >
                            <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", status.dot)} />
                            <span className="truncate text-foreground">{p.caption.slice(0, 24)}</span>
                          </button>
                        );
                      })}
                      {cell.posts.length > 3 && (
                        <span className="text-[10px] text-muted-foreground">+{cell.posts.length - 3} more</span>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {view === "calendar" && (
        <p className="text-[11px] text-muted-foreground -mt-2 px-1">
          Drafts aren't shown here — they have no schedule date. View them in{" "}
          <button onClick={() => handleViewChange("list")} className="underline hover:text-foreground">List</button>
          {" "}or{" "}
          <button onClick={() => handleViewChange("board")} className="underline hover:text-foreground">Board</button>.
        </p>
      )}

      {view === "list" && (
        <div className="bg-card rounded-xl shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-border bg-muted/40">
                <th className="px-5 py-3 font-medium">Client / Project</th>
                <th className="px-5 py-3 font-medium">Caption</th>
                <th className="px-5 py-3 font-medium">Platforms</th>
                <th className="px-5 py-3 font-medium">Scheduled</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const status = STATUS_META[p.status];
                return (
                  <tr key={p.id} onClick={() => setSelected(p)} className="border-b border-border last:border-0 hover:bg-accent/30 cursor-pointer transition-colors">
                    <td className="px-5 py-3">
                      <div className="text-sm font-medium text-foreground">{p.clientName}</div>
                      <div className="text-[11px] text-muted-foreground">{p.projectName}</div>
                    </td>
                    <td className="px-5 py-3 max-w-sm truncate text-foreground">{p.caption}</td>
                    <td className="px-5 py-3">
                      <div className="flex gap-1">
                        {p.platforms.map((pl) => (
                          <span key={pl} className={cn("w-5 h-5 rounded text-[9px] font-bold text-primary-foreground flex items-center justify-center", PLATFORM_META[pl].bg)}>
                            {PLATFORM_META[pl].label[0]}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground text-xs tabular-nums whitespace-nowrap">{formatDateTime(p.scheduledFor)}</td>
                    <td className="px-5 py-3">
                      <span className={cn("text-[11px] px-2 py-1 rounded-full font-medium inline-flex items-center gap-1", status.classes)}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", status.dot)} />
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-sm text-muted-foreground">No posts match this filter.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {view === "board" && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {BOARD_COLUMNS.map((col) => {
            const colPosts = filtered.filter((p) => p.status === col);
            const status = STATUS_META[col];
            return (
              <div key={col} className="bg-muted/40 rounded-xl p-3 min-h-[300px]">
                <div className="flex items-center gap-2 mb-3">
                  <span className={cn("w-2 h-2 rounded-full", status.dot)} />
                  <h3 className="text-xs font-semibold text-foreground">{status.label}</h3>
                  <span className="text-[10px] text-muted-foreground bg-card px-1.5 py-0.5 rounded">{colPosts.length}</span>
                </div>
                <div className="space-y-2">
                  {colPosts.map((p) => (
                    <button key={p.id} onClick={() => setSelected(p)} className="w-full text-left bg-card border border-border rounded-lg p-2.5 hover:border-border-hover transition-colors">
                      <div className="text-[11px] font-medium text-muted-foreground mb-1">{p.clientName}</div>
                      <div className="text-xs text-foreground line-clamp-2 mb-2">{p.caption}</div>
                      {p.media[0] && <img src={p.media[0].url} alt="" className="w-full h-20 object-cover rounded mb-2" />}
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                          {p.platforms.map((pl) => (
                            <span key={pl} className={cn("w-3.5 h-3.5 rounded-sm", PLATFORM_META[pl].bg)} />
                          ))}
                        </div>
                        <span className="text-[10px] text-muted-foreground tabular-nums">{formatDateTime(p.scheduledFor)}</span>
                      </div>
                    </button>
                  ))}
                  {colPosts.length === 0 && <div className="text-[11px] text-muted-foreground text-center py-6">No posts</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <PostDetailDrawer post={selected} onClose={() => setSelected(null)} onAction={handleAction} />
    </div>
  );
}
