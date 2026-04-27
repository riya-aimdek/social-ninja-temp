import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { CheckCircle2, XCircle, Calendar, Clock, ShieldCheck, ExternalLink, Zap, Home, LogIn, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import PostPreview from "@/components/publish/PostPreview";
import { getPostByToken, PLATFORM_META, STATUS_META, formatDateTime } from "@/data/publishMockData";
import SocialNinjaLogo from "@/components/SocialNinjaLogo";
import { cn } from "@/lib/utils";

type Decision = "pending" | "approved" | "rejected";

const APPROVER_SESSION_KEY = "approverSession";

export default function PublicApprovalPage() {
  const { token = "" } = useParams();
  const navigate = useNavigate();
  const post = useMemo(() => getPostByToken(token), [token]);
  const [activePlatform, setActivePlatform] = useState(0);
  const [decision, setDecision] = useState<Decision>("pending");
  const [reason, setReason] = useState("");
  const [showReject, setShowReject] = useState(false);

  // Approver login gate — clients must authenticate before reviewing
  const [isAuthed, setIsAuthed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(APPROVER_SESSION_KEY) === token;
  });
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      toast.error("Enter your email and password");
      return;
    }
    sessionStorage.setItem(APPROVER_SESSION_KEY, token);
    setIsAuthed(true);
    toast.success("Signed in. You can now review this post.");
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="bg-card border border-border rounded-xl p-8 text-center max-w-md">
          <ShieldCheck className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <h1 className="text-lg font-semibold text-foreground">Approval link invalid</h1>
          <p className="text-sm text-muted-foreground mt-2">This link has expired or is no longer valid. Please contact your agency for a new link.</p>
          <Link to="/login" className="text-sm text-primary mt-4 inline-block">Go to login</Link>
        </div>
      </div>
    );
  }

  const status = STATUS_META[post.status];
  const platform = post.platforms[activePlatform];

  // Approver login gate — must sign in before reviewing
  if (!isAuthed) {
    const reviewerHint = post.reviewers?.[0];
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="bg-card border-b border-border px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SocialNinjaLogo />
            <div className="hidden sm:block h-6 w-px bg-border" />
            <span className="hidden sm:block text-xs text-muted-foreground">Reviewer sign-in</span>
          </div>
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5">
            <Home className="w-3.5 h-3.5" /> Home
          </Link>
        </header>

        <main className="flex-1 flex items-center justify-center px-4 py-10">
          <div className="w-full max-w-md bg-card border border-border rounded-xl p-6 sm:p-8">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
              <Lock className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-semibold text-foreground">Sign in to review</h1>
            <p className="text-sm text-muted-foreground mt-1">
              For security, please sign in before approving content for{" "}
              <span className="text-foreground font-medium">{post.clientName}</span>.
            </p>

            <form onSubmit={handleLogin} className="mt-5 space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs">Work email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder={reviewerHint || "you@company.com"}
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                <LogIn className="w-4 h-4" /> Sign in & continue
              </Button>
              <p className="text-[11px] text-muted-foreground text-center">
                This post has already passed internal review and is now ready for your final approval.
              </p>
            </form>
          </div>
        </main>
      </div>
    );
  }

  const handleApprove = () => {
    setDecision("approved");
    toast.success("Approved! The agency has been notified.");
  };
  const handleReject = () => {
    if (!reason.trim()) {
      toast.error("Please add a reason");
      return;
    }
    setDecision("rejected");
    toast.success("Rejection recorded. The agency has been notified.");
  };

  if (decision !== "pending") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="bg-card border border-border rounded-xl p-8 text-center max-w-md">
          {decision === "approved" ? (
            <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-3" />
          ) : (
            <XCircle className="w-12 h-12 text-error mx-auto mb-3" />
          )}
          <h1 className="text-lg font-semibold text-foreground">
            Post {decision === "approved" ? "approved" : "rejected"}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Your decision has been logged in the audit trail. You can close this page.
          </p>
          {decision === "rejected" && reason && (
            <div className="mt-4 text-left bg-muted/40 rounded p-3 text-xs text-foreground">
              <div className="font-medium text-muted-foreground mb-1">Your feedback</div>
              {reason}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="bg-card border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SocialNinjaLogo />
          <div className="hidden sm:block h-6 w-px bg-border" />
          <span className="hidden sm:block text-xs text-muted-foreground">Post approval</span>
        </div>
        <span className={cn("text-[11px] px-2 py-1 rounded-full font-medium", status.classes)}>{status.label}</span>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 grid lg:grid-cols-[1fr_360px] gap-8">
        {/* Preview side */}
        <div>
          <div className="mb-4">
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Review for</div>
            <h1 className="text-xl font-bold text-foreground mt-0.5">{post.clientName} · {post.projectName}</h1>
            <p className="text-xs text-muted-foreground mt-1">
              Submitted by {post.createdBy} · {formatDateTime(post.createdAt)}
            </p>
          </div>

          <div className="flex items-center gap-1 border-b border-border mb-4">
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

          <PostPreview platform={platform} caption={post.caption} media={post.media} brand={{ name: post.clientName }} />

          {post.publishMode === "immediate" && (
            <div
              role="status"
              className="mt-4 rounded-lg border-2 border-warning/40 bg-warning/10 p-4 flex items-start gap-3"
            >
              <div className="w-9 h-9 rounded-lg bg-warning/20 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 text-warning" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">Scheduled for Immediate Posting</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Once you approve, this post will be published right away — there is no delay or scheduled time.
                </p>
              </div>
            </div>
          )}

          <div className="mt-4 bg-card border border-border rounded-lg p-4 space-y-2 text-sm">
            {post.publishMode === "immediate" ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Zap className="w-3.5 h-3.5 text-warning" />
                Publishes <span className="text-foreground font-medium">immediately on approval</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                Scheduled for <span className="text-foreground font-medium">{formatDateTime(post.scheduledFor)}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              Will publish to <span className="text-foreground font-medium">{post.platforms.map((p) => PLATFORM_META[p].label).join(", ")}</span>
            </div>
          </div>
        </div>

        {/* Decision panel */}
        <aside className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="text-sm font-semibold text-foreground">Your decision</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Approve to schedule this post, or reject with feedback so the agency can revise.
            </p>

            {!showReject ? (
              <div className="grid grid-cols-2 gap-2 mt-4">
                <Button variant="outline" onClick={() => setShowReject(true)}>
                  <XCircle className="w-4 h-4" /> Reject
                </Button>
                <Button onClick={handleApprove}>
                  <CheckCircle2 className="w-4 h-4" /> Approve
                </Button>
              </div>
            ) : (
              <div className="mt-4 space-y-2">
                <label className="text-xs font-medium text-foreground">Tell the agency what to change</label>
                <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Tone is too casual, please align with brand voice."
                  className="min-h-[100px] text-sm"
                />
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => { setShowReject(false); setReason(""); }}>
                    Cancel
                  </Button>
                  <Button variant="destructive" className="flex-1" onClick={handleReject}>
                    Submit rejection
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-muted/40 border border-border rounded-xl p-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5 text-foreground font-medium mb-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Secure approval link
            </div>
            This link is unique to this post and is logged in the audit trail when used. No login required.
          </div>

          <Link to="/login" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
            Open SocialNinja <ExternalLink className="w-3 h-3" />
          </Link>
        </aside>
      </main>
    </div>
  );
}
