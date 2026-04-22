import { useState } from "react";
import { X, Copy, Check, Send, ThumbsUp, ThumbsDown, Calendar, Users } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import PostPreview from "./PostPreview";
import AuditTrail from "./AuditTrail";
import { PLATFORM_META, STATUS_META, formatDateTime, type PostDraft } from "@/data/publishMockData";
import { cn } from "@/lib/utils";

interface Props {
  post: PostDraft | null;
  onClose: () => void;
  onAction?: (postId: string, action: "approve" | "reject" | "send" | "schedule", payload?: { reason?: string }) => void;
}

export default function PostDetailDrawer({ post, onClose, onAction }: Props) {
  const [activePlatform, setActivePlatform] = useState(0);
  const [rejectReason, setRejectReason] = useState("");
  const [showReject, setShowReject] = useState(false);

  if (!post) return null;
  const status = STATUS_META[post.status];
  const platform = post.platforms[activePlatform] || post.platforms[0];
  const approvalUrl = `${window.location.origin}/approve/${post.approvalToken}`;

  const copyLink = () => {
    navigator.clipboard.writeText(approvalUrl);
    toast.success("Approval link copied");
  };

  return (
    <Sheet open={!!post} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-3xl p-0 overflow-y-auto">
        {/* Context header (per MoM #16) */}
        <div className="sticky top-0 z-10 bg-card border-b border-border px-5 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-xs font-bold text-primary-foreground">
            {post.clientName.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-foreground truncate">{post.clientName} · {post.projectName}</div>
            <div className="text-[11px] text-muted-foreground">Created by {post.createdBy} · {formatDateTime(post.createdAt)}</div>
          </div>
          <span className={cn("text-[11px] px-2 py-1 rounded-full font-medium", status.classes)}>{status.label}</span>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-accent">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="p-5 grid lg:grid-cols-[1fr_320px] gap-6">
          {/* Left: preview + tabs */}
          <div className="space-y-4">
            <div className="flex items-center gap-1 border-b border-border">
              {post.platforms.map((p, i) => {
                const m = PLATFORM_META[p];
                return (
                  <button
                    key={p}
                    onClick={() => setActivePlatform(i)}
                    className={cn(
                      "px-3 py-2 text-xs font-medium border-b-2 transition-colors",
                      i === activePlatform ? `${m.color} border-current` : "text-muted-foreground border-transparent hover:text-foreground",
                    )}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>
            <PostPreview
              platform={platform}
              caption={post.caption}
              media={post.media}
              brand={{ name: post.clientName }}
            />
            <div className="bg-muted/40 rounded-lg p-3 text-xs text-muted-foreground flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              Scheduled for <span className="text-foreground font-medium">{formatDateTime(post.scheduledFor)}</span>
            </div>

            {post.status === "rejected" && post.rejectionReason && (
              <div className="bg-error/10 border border-error/30 rounded-lg p-3 text-xs text-error">
                <div className="font-semibold mb-1">Rejection reason</div>
                {post.rejectionReason}
              </div>
            )}
          </div>

          {/* Right: tabs (audit, approval) */}
          <div>
            <Tabs defaultValue="audit">
              <TabsList className="w-full">
                <TabsTrigger value="audit" className="flex-1">Audit trail</TabsTrigger>
                <TabsTrigger value="approval" className="flex-1">Approval</TabsTrigger>
              </TabsList>
              <TabsContent value="audit" className="mt-4">
                <AuditTrail events={post.audit} />
              </TabsContent>
              <TabsContent value="approval" className="mt-4 space-y-3">
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
                    <Users className="w-3 h-3" /> Reviewers
                  </div>
                  {post.reviewers.length ? (
                    <ul className="space-y-1">
                      {post.reviewers.map((r) => (
                        <li key={r} className="text-sm text-foreground bg-muted/40 rounded px-2 py-1">{r}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-muted-foreground">No reviewers assigned.</p>
                  )}
                </div>
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-1.5">Public approval link</div>
                  <div className="flex gap-2">
                    <input
                      readOnly
                      value={approvalUrl}
                      className="flex-1 text-[11px] bg-muted/40 border border-border rounded px-2 py-1.5 font-mono text-muted-foreground"
                    />
                    <Button size="sm" variant="outline" onClick={copyLink}>
                      <Copy className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">Reviewers can approve or reject without logging in.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Footer actions */}
        <div className="sticky bottom-0 bg-card border-t border-border px-5 py-3 flex items-center gap-2">
          {showReject ? (
            <div className="flex-1 flex gap-2 items-start">
              <Textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Reason for rejection..."
                className="flex-1 min-h-[60px] text-sm"
              />
              <div className="flex flex-col gap-1.5">
                <Button size="sm" variant="outline" onClick={() => setShowReject(false)}>Cancel</Button>
                <Button size="sm" variant="destructive" onClick={() => { onAction?.(post.id, "reject", { reason: rejectReason }); setShowReject(false); setRejectReason(""); }}>
                  Confirm
                </Button>
              </div>
            </div>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={copyLink}>
                <Copy className="w-3.5 h-3.5" /> Copy link
              </Button>
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
                  <Calendar className="w-3.5 h-3.5" /> Schedule now
                </Button>
              )}
              {(post.status === "scheduled" || post.status === "published") && (
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
