import { useMemo, useState } from "react";
import {
  Inbox, KanbanSquare, MessageSquare, AlertTriangle, Clock, CheckCircle2,
  Facebook, Instagram, Linkedin, Twitter, Send, Sparkles, Filter, Search,
  ArrowRight, MoreVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Stage = "new" | "triaging" | "in_progress" | "waiting_customer" | "escalated" | "resolved";
type Priority = "low" | "medium" | "high" | "urgent";

interface Ticket {
  id: string;
  customer: { name: string; avatar: string };
  platform: "Instagram" | "Facebook" | "LinkedIn" | "Twitter";
  subject: string;
  preview: string;
  stage: Stage;
  priority: Priority;
  assignee?: string;
  sentiment: "positive" | "neutral" | "negative";
  age: string;
  sla: { dueIn: string; breached: boolean };
  tag: string;
  thread: { author: string; text: string; at: string; isOwn?: boolean }[];
}

const STAGES: { id: Stage; label: string; color: string }[] = [
  { id: "new", label: "New", color: "bg-info" },
  { id: "triaging", label: "Triaging", color: "bg-warning" },
  { id: "in_progress", label: "In Progress", color: "bg-primary" },
  { id: "waiting_customer", label: "Waiting on customer", color: "bg-muted-foreground" },
  { id: "escalated", label: "Escalated", color: "bg-error" },
  { id: "resolved", label: "Resolved", color: "bg-success" },
];

const priorityStyles: Record<Priority, string> = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-info/15 text-info",
  high: "bg-warning/15 text-warning",
  urgent: "bg-error/15 text-error",
};

const sentimentStyles = {
  positive: "text-success",
  neutral: "text-muted-foreground",
  negative: "text-error",
};

const platformIcon = (name: string) => {
  switch (name) {
    case "Instagram": return <Instagram className="w-3.5 h-3.5 text-instagram" />;
    case "Facebook": return <Facebook className="w-3.5 h-3.5 text-facebook" />;
    case "LinkedIn": return <Linkedin className="w-3.5 h-3.5 text-linkedin" />;
    default: return <Twitter className="w-3.5 h-3.5 text-twitter" />;
  }
};

const SEED: Ticket[] = [
  {
    id: "T-1042", customer: { name: "Sarah Johnson", avatar: "SJ" }, platform: "Instagram",
    subject: "Feature request: bulk export", preview: "Love this new feature! When will it be available for all users?",
    stage: "new", priority: "medium", sentiment: "positive", age: "2m", tag: "Feature",
    sla: { dueIn: "3h 58m", breached: false },
    thread: [{ author: "Sarah Johnson", text: "Love this new feature! When will it be available for all users?", at: "2m ago" }],
  },
  {
    id: "T-1041", customer: { name: "Mike Chen", avatar: "MC" }, platform: "Facebook",
    subject: "Account connection error 403", preview: "Having trouble connecting my account. Getting error code 403...",
    stage: "triaging", priority: "high", sentiment: "negative", assignee: "Priya S.", age: "15m", tag: "Bug",
    sla: { dueIn: "45m", breached: false },
    thread: [
      { author: "Mike Chen", text: "Having trouble connecting my account. Getting error code 403 every time I try.", at: "15m ago" },
      { author: "Priya S.", text: "Hi Mike, looking into this now. Could you share which browser you're using?", at: "10m ago", isOwn: true },
    ],
  },
  {
    id: "T-1040", customer: { name: "Emma Wilson", avatar: "EW" }, platform: "LinkedIn",
    subject: "Collaboration inquiry", preview: "Great article! Would love to collaborate on something similar.",
    stage: "in_progress", priority: "low", sentiment: "positive", assignee: "Mike T.", age: "1h", tag: "Partnership",
    sla: { dueIn: "1d 4h", breached: false },
    thread: [{ author: "Emma Wilson", text: "Great article! Would love to collaborate on something similar.", at: "1h ago" }],
  },
  {
    id: "T-1039", customer: { name: "Alex Rivera", avatar: "AR" }, platform: "Instagram",
    subject: "Enterprise pricing", preview: "What's the pricing for the enterprise plan? We have 50+ users.",
    stage: "waiting_customer", priority: "high", sentiment: "neutral", assignee: "You", age: "2h", tag: "Sales",
    sla: { dueIn: "Waiting", breached: false },
    thread: [
      { author: "Alex Rivera", text: "What's the pricing for the enterprise plan? We have 50+ users.", at: "2h ago" },
      { author: "You", text: "Hi Alex! Enterprise starts at $299/mo for up to 100 users. I'd love to set up a demo — would that work?", at: "1h ago", isOwn: true },
      { author: "Alex Rivera", text: "That sounds great! Can we schedule something for next week?", at: "45m ago" },
    ],
  },
  {
    id: "T-1038", customer: { name: "Jordan Patel", avatar: "JP" }, platform: "Twitter",
    subject: "Service down — losing revenue", preview: "Posts haven't published in 2 hours. We're losing $$$. ESCALATE.",
    stage: "escalated", priority: "urgent", sentiment: "negative", assignee: "Sarah C.", age: "2h", tag: "Outage",
    sla: { dueIn: "OVERDUE 22m", breached: true },
    thread: [{ author: "Jordan Patel", text: "Posts haven't published in 2 hours. We're losing $$$. ESCALATE.", at: "2h ago" }],
  },
  {
    id: "T-1037", customer: { name: "Lisa Park", avatar: "LP" }, platform: "Facebook",
    subject: "Working now — thanks!", preview: "Thanks for the quick response! Everything is working now.",
    stage: "resolved", priority: "low", sentiment: "positive", assignee: "Priya S.", age: "3h", tag: "Bug",
    sla: { dueIn: "—", breached: false },
    thread: [{ author: "Lisa Park", text: "Thanks for the quick response! Everything is working now.", at: "3h ago" }],
  },
  {
    id: "T-1036", customer: { name: "David Kim", avatar: "DK" }, platform: "Twitter",
    subject: "Praise for the latest post", preview: "Your latest post was incredibly insightful. Shared it with my team!",
    stage: "resolved", priority: "low", sentiment: "positive", age: "5h", tag: "Praise",
    sla: { dueIn: "—", breached: false },
    thread: [{ author: "David Kim", text: "Your latest post was incredibly insightful. Shared it with my team!", at: "5h ago" }],
  },
];

type View = "inbox" | "board";

export default function EngagePage() {
  const [tickets, setTickets] = useState<Ticket[]>(SEED);
  const [view, setView] = useState<View>("board");
  const [selected, setSelected] = useState<Ticket | null>(SEED[1]);
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState<"all" | Priority>("all");
  const [reply, setReply] = useState("");

  const filtered = useMemo(
    () =>
      tickets.filter(
        (t) =>
          (filterPriority === "all" || t.priority === filterPriority) &&
          (!search ||
            `${t.subject} ${t.customer.name} ${t.preview}`.toLowerCase().includes(search.toLowerCase())),
      ),
    [tickets, filterPriority, search],
  );

  const summary = useMemo(() => {
    const open = tickets.filter((t) => t.stage !== "resolved").length;
    const overdue = tickets.filter((t) => t.sla.breached).length;
    const urgent = tickets.filter((t) => t.priority === "urgent" && t.stage !== "resolved").length;
    const resolvedToday = tickets.filter((t) => t.stage === "resolved").length;
    return { open, overdue, urgent, resolvedToday };
  }, [tickets]);

  const moveTicket = (id: string, stage: Stage) => {
    setTickets((p) => p.map((t) => (t.id === id ? { ...t, stage } : t)));
    if (selected?.id === id) setSelected({ ...selected, stage });
    toast.success(`Moved ${id} to ${STAGES.find((s) => s.id === stage)?.label}`);
  };

  const sendReply = () => {
    if (!reply.trim() || !selected) return;
    const updated: Ticket = {
      ...selected,
      thread: [...selected.thread, { author: "You", text: reply, at: "Just now", isOwn: true }],
      stage: "waiting_customer",
    };
    setTickets((p) => p.map((t) => (t.id === selected.id ? updated : t)));
    setSelected(updated);
    setReply("");
    toast.success("Reply sent");
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-end gap-3 flex-wrap">
        <div className="flex rounded-lg border border-border overflow-hidden bg-card">
          <button
            onClick={() => setView("board")}
            className={cn(
              "px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 transition-colors",
              view === "board" ? "bg-foreground text-card" : "text-foreground hover:bg-accent",
            )}
          >
            <KanbanSquare className="w-3.5 h-3.5" /> Board
          </button>
          <button
            onClick={() => setView("inbox")}
            className={cn(
              "px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 transition-colors",
              view === "inbox" ? "bg-foreground text-card" : "text-foreground hover:bg-accent",
            )}
          >
            <Inbox className="w-3.5 h-3.5" /> Inbox
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { I: MessageSquare, label: "Open tickets", value: summary.open, tone: "text-info bg-info/10" },
          { I: AlertTriangle, label: "Urgent", value: summary.urgent, tone: "text-error bg-error/10" },
          { I: Clock, label: "SLA breached", value: summary.overdue, tone: "text-warning bg-warning/10" },
          { I: CheckCircle2, label: "Resolved today", value: summary.resolvedToday, tone: "text-success bg-success/10" },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center justify-between">
              <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", s.tone)}>
                <s.I className="w-4 h-4" />
              </div>
              <span className="text-2xl font-bold text-foreground tabular-nums">{s.value}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-2">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tickets..."
            className="pl-8 pr-3 py-1.5 text-xs bg-card border border-border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex items-center gap-1 text-xs">
          <Filter className="w-3.5 h-3.5 text-muted-foreground" />
          {(["all", "urgent", "high", "medium", "low"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={cn(
                "px-2.5 py-1 rounded-full border text-xs font-medium capitalize transition-colors",
                filterPriority === p
                  ? "bg-foreground text-card border-foreground"
                  : "bg-card text-muted-foreground border-border hover:text-foreground",
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {view === "board" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {STAGES.map((stage) => {
            const items = filtered.filter((t) => t.stage === stage.id);
            return (
              <div key={stage.id} className="bg-muted/40 rounded-xl p-3 min-h-[420px]">
                <div className="flex items-center gap-2 mb-3">
                  <span className={cn("w-2 h-2 rounded-full", stage.color)} />
                  <h3 className="text-xs font-semibold text-foreground">{stage.label}</h3>
                  <span className="text-[10px] text-muted-foreground bg-card px-1.5 py-0.5 rounded">{items.length}</span>
                </div>
                <div className="space-y-2">
                  {items.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelected(t)}
                      className={cn(
                        "w-full text-left bg-card border rounded-lg p-2.5 hover:border-border-hover transition-colors",
                        selected?.id === t.id ? "border-primary" : "border-border",
                        t.sla.breached && "border-l-2 border-l-error",
                      )}
                    >
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="text-[10px] font-mono text-muted-foreground">{t.id}</span>
                        <span className={cn("text-[9px] px-1.5 py-0.5 rounded-full font-medium capitalize ml-auto", priorityStyles[t.priority])}>
                          {t.priority}
                        </span>
                      </div>
                      <div className="text-xs font-medium text-foreground line-clamp-2 mb-2">{t.subject}</div>
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          {platformIcon(t.platform)}
                          <span className={cn("ml-0.5 capitalize", sentimentStyles[t.sentiment])}>● </span>
                          {t.customer.avatar}
                        </span>
                        <span className={cn("tabular-nums", t.sla.breached && "text-error font-semibold")}>{t.sla.dueIn}</span>
                      </div>
                    </button>
                  ))}
                  {items.length === 0 && <div className="text-[11px] text-muted-foreground text-center py-6">Empty</div>}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-4 h-[calc(100vh-360px)] min-h-[500px]">
          <div className="col-span-5 bg-card rounded-xl shadow-card overflow-y-auto">
            {filtered.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelected(t)}
                className={cn(
                  "w-full text-left px-4 py-3 border-b border-border hover:bg-accent/30 transition-colors",
                  selected?.id === t.id && "bg-primary/5 border-l-2 border-l-primary",
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-[10px] font-bold text-foreground">
                    {t.customer.avatar}
                  </div>
                  <span className="text-xs font-semibold text-foreground truncate">{t.customer.name}</span>
                  {platformIcon(t.platform)}
                  <span className="text-[10px] text-muted-foreground ml-auto">{t.age}</span>
                </div>
                <p className="text-xs text-foreground font-medium line-clamp-1 pl-9">{t.subject}</p>
                <p className="text-[11px] text-muted-foreground line-clamp-1 pl-9">{t.preview}</p>
                <div className="flex items-center gap-1.5 mt-1.5 pl-9">
                  <span className={cn("text-[9px] px-1.5 py-0.5 rounded-full font-medium capitalize", priorityStyles[t.priority])}>{t.priority}</span>
                  <span className="text-[10px] text-muted-foreground">{STAGES.find((s) => s.id === t.stage)?.label}</span>
                </div>
              </button>
            ))}
          </div>
          {selected && <DetailPanel ticket={selected} reply={reply} setReply={setReply} sendReply={sendReply} moveTicket={moveTicket} />}
        </div>
      )}

      {/* Detail drawer (board view) */}
      {view === "board" && selected && (
        <div className="bg-card rounded-xl shadow-card border border-border">
          <DetailPanel ticket={selected} reply={reply} setReply={setReply} sendReply={sendReply} moveTicket={moveTicket} embedded />
        </div>
      )}
    </div>
  );
}

function DetailPanel({
  ticket, reply, setReply, sendReply, moveTicket, embedded,
}: {
  ticket: Ticket; reply: string; setReply: (v: string) => void; sendReply: () => void;
  moveTicket: (id: string, s: Stage) => void; embedded?: boolean;
}) {
  return (
    <div className={cn("flex flex-col", embedded ? "min-h-[420px]" : "col-span-7 bg-card rounded-xl shadow-card overflow-hidden")}>
      <div className="p-4 border-b border-border flex items-center gap-3 flex-wrap">
        <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-foreground">
          {ticket.customer.avatar}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-foreground">{ticket.customer.name}</p>
            <span className="text-[10px] font-mono text-muted-foreground">{ticket.id}</span>
          </div>
          <p className="text-[11px] text-muted-foreground flex items-center gap-1">
            {platformIcon(ticket.platform)} {ticket.platform} · {ticket.tag}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className={cn("text-[10px] px-2 py-1 rounded-full font-medium capitalize", priorityStyles[ticket.priority])}>
            {ticket.priority}
          </span>
          <select
            value={ticket.stage}
            onChange={(e) => moveTicket(ticket.id, e.target.value as Stage)}
            className="text-xs px-2 py-1 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {STAGES.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
          <Button size="sm" variant="outline"><MoreVertical className="w-3.5 h-3.5" /></Button>
        </div>
      </div>

      <div className="px-4 py-2 bg-muted/30 border-b border-border flex items-center gap-3 text-[11px] text-muted-foreground">
        <span>SLA: <span className={cn(ticket.sla.breached ? "text-error font-semibold" : "text-foreground font-medium")}>{ticket.sla.dueIn}</span></span>
        <span>·</span>
        <span>Assignee: <span className="text-foreground font-medium">{ticket.assignee || "Unassigned"}</span></span>
        <span>·</span>
        <span>Sentiment: <span className={cn("capitalize font-medium", sentimentStyles[ticket.sentiment])}>{ticket.sentiment}</span></span>
      </div>

      {/* Comment tree */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {ticket.thread.map((m, i) => (
          <div key={i} className={cn("flex gap-2", m.isOwn && "flex-row-reverse")}>
            <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0",
              m.isOwn ? "bg-primary text-primary-foreground" : "bg-accent text-foreground")}>
              {m.author.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div className={cn("max-w-[75%]", m.isOwn && "text-right")}>
              <div className="text-[10px] text-muted-foreground mb-0.5">{m.author} · {m.at}</div>
              <div className={cn("px-3 py-2 rounded-xl text-sm",
                m.isOwn ? "bg-primary/10 text-foreground" : "bg-accent text-foreground")}>
                {m.text}
              </div>
              {!m.isOwn && i === ticket.thread.length - 1 && (
                <button className="text-[10px] text-primary mt-1 inline-flex items-center gap-1 hover:underline">
                  <ArrowRight className="w-2.5 h-2.5" /> Reply in thread
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-border space-y-2">
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <Sparkles className="w-3 h-3 text-primary" /> AI suggestions:
          {["Acknowledge & investigate", "Request screenshot", "Escalate to engineering"].map((s) => (
            <button key={s} onClick={() => setReply(s)} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20">
              {s}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Type a reply... (⌘ + Enter to send)"
            className="flex-1 px-3 py-2 rounded-lg border border-input text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <Button onClick={sendReply}><Send className="w-4 h-4" /></Button>
        </div>
      </div>
    </div>
  );
}
