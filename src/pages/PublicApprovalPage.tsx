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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SocialNinjaLogo />
          <div className="h-5 w-px bg-border" />
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>{post.clientName}</span>
            <span className="text-border">›</span>
            <span className="text-foreground font-medium">{post.projectName}</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <span className={cn("text-[11px] px-2.5 py-1 rounded-full font-semibold border", status.classes)}>{status.label}</span>
          <Link
            to="/"
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors"
          >
            <Home className="w-3.5 h-3.5" /> Home
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 grid lg:grid-cols-[1fr_320px] gap-6 items-start">

        {/* ── Left: preview ── */}
        <div className="space-y-4">
          {/* Meta row */}
          <div className="bg-card border border-border rounded-xl px-5 py-4 flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Submitted for review</p>
              <p className="text-sm font-semibold text-foreground truncate">{post.createdBy}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{formatDateTime(post.createdAt)}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/60 rounded-lg px-3 py-1.5">
                {post.publishMode === "immediate"
                  ? <><Zap className="w-3.5 h-3.5 text-warning" /><span>Immediate on approval</span></>
                  : <><Calendar className="w-3.5 h-3.5" /><span>{formatDateTime(post.scheduledFor)}</span></>
                }
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/60 rounded-lg px-3 py-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{post.platforms.map((p) => PLATFORM_META[p].label).join(", ")}</span>
              </div>
            </div>
          </div>

          {/* Platform tabs + preview */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            {/* Tab bar */}
            <div className="flex items-center gap-0.5 px-4 pt-3 border-b border-border">
              {post.platforms.map((p, i) => {
                const m = PLATFORM_META[p];
                return (
                  <button
                    key={p}
                    onClick={() => setActivePlatform(i)}
                    className={cn(
                      "px-3.5 py-2 text-xs font-medium border-b-2 -mb-px transition-colors rounded-t-sm",
                      i === activePlatform
                        ? `${m.color} border-current`
                        : "text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/50",
                    )}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>

            {/* Constrained preview */}
            <div className="p-5 flex justify-center bg-muted/20">
              <div className="w-full max-w-[360px] rounded-xl border border-border overflow-hidden shadow-sm bg-white">
                <PostPreview platform={platform} caption={post.caption} media={post.media} brand={{ name: post.clientName }} />
              </div>
            </div>
          </div>

          {post.publishMode === "immediate" && (
            <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl border-2 border-warning/30 bg-warning/8">
              <div className="w-8 h-8 rounded-lg bg-warning/20 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 text-warning" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Immediate posting on approval</p>
                <p className="text-xs text-muted-foreground mt-0.5">Once approved, this post will go live instantly with no delay.</p>
              </div>
            </div>
          )}
        </div>

        {/* ── Right: decision + info ── */}
        <aside className="space-y-4">

          {/* Decision card */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">Your decision</h2>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Approve to schedule this post, or reject with feedback so the agency can revise.
              </p>
            </div>

            <div className="p-4">
              {!showReject ? (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setShowReject(true)}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-border bg-background text-sm font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    <XCircle className="w-4 h-4 text-error" /> Reject
                  </button>
                  <button
                    onClick={handleApprove}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl gradient-coral text-primary-foreground text-sm font-semibold shadow-coral hover:opacity-90 active:scale-[0.98] transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Approve
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1.5">Tell the agency what to change</label>
                    <Textarea
                      autoFocus
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="e.g. Tone is too casual, please align with brand voice."
                      className="min-h-[90px] text-sm resize-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setShowReject(false); setReason(""); }}
                      className="flex-1 py-2.5 rounded-xl border border-border bg-background text-sm font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReject}
                      className="flex-1 py-2.5 rounded-xl bg-error text-white text-sm font-semibold hover:bg-error/90 transition-colors"
                    >
                      Submit rejection
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Post details card */}
          <div className="bg-card border border-border rounded-xl p-4 space-y-3">
            <p className="text-xs font-semibold text-foreground">Post details</p>
            {[
              {
                icon: Calendar,
                label: "Schedule",
                value: post.publishMode === "immediate" ? "Immediate on approval" : formatDateTime(post.scheduledFor),
              },
              {
                icon: Clock,
                label: "Platforms",
                value: post.platforms.map((p) => PLATFORM_META[p].label).join(", "),
              },
              {
                icon: ShieldCheck,
                label: "Submitted by",
                value: post.createdBy,
              },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">{label}</p>
                  <p className="text-xs text-foreground font-medium mt-0.5">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Security note */}
          <div className="flex items-start gap-2.5 px-4 py-3.5 rounded-xl bg-muted/50 border border-border">
            <ShieldCheck className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              This link is unique to this post and is logged in the audit trail when used.
            </p>
          </div>

          <Link
            to="/login"
            className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
          >
            Open SocialNinja <ExternalLink className="w-3 h-3" />
          </Link>
        </aside>
      </main>
    </div>
  );
}
