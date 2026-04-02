import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import SocialNinjaLogo from "@/components/SocialNinjaLogo";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSent(true);
  };

  return (
    <div className="min-h-screen gradient-mesh bg-background flex items-center justify-center p-4">
      <div className="w-[440px] bg-card border border-border rounded-2xl p-10 shadow-card animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <SocialNinjaLogo size="lg" />
        </div>

        {!sent ? (
          <>
            <h1 className="text-2xl font-semibold text-foreground mb-2">Forgot password?</h1>
            <p className="text-sm text-muted-foreground mb-6">Enter the email address associated with your account. We'll send you a link to reset your password.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Email Address</label>
                <input className="input-dark" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
              </div>
              <Button type="submit" className="w-full">Send Reset Link</Button>
            </form>
          </>
        ) : (
          <div className="text-center space-y-4">
            <div className="w-14 h-14 gradient-coral rounded-full flex items-center justify-center mx-auto shadow-coral">
              <CheckCircle2 className="h-7 w-7 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Check your email</h2>
            <p className="text-sm text-muted-foreground">
              We've sent a password reset link to <span className="font-medium text-foreground">{email}</span>. The link will expire in 60 minutes.
            </p>
            <p className="text-xs text-muted-foreground">
              Didn't receive it? <button onClick={() => setSent(false)} className="text-primary hover:underline font-medium">Try again</button>
            </p>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
