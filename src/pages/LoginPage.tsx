import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import SocialNinjaLogo from "@/components/SocialNinjaLogo";
import { useNavigate, Link } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo: route based on email pattern
    if (email.includes("admin") || email.includes("super")) {
      navigate("/super-admin/dashboard");
    } else if (email.includes("agency")) {
      navigate("/agency/dashboard");
    } else {
      navigate("/client/dashboard");
    }
  };

  return (
    <div className="min-h-screen gradient-mesh bg-background flex items-center justify-center p-4">
      <div className="w-[440px] bg-card border border-border rounded-2xl p-10 shadow-card animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <SocialNinjaLogo size="lg" />
          <p className="text-sm text-muted-foreground mt-3">Social Media Management Platform</p>
        </div>

        <h1 className="text-2xl font-semibold text-foreground mb-2">Welcome back</h1>
        <p className="text-sm text-muted-foreground mb-8">Sign in to your account to continue</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Email Address</label>
            <input
              className="input-dark"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Password</label>
            <div className="relative">
              <input
                className="input-dark pr-10"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <div className="flex justify-end mt-1.5">
              <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
            </div>
          </div>
          <Button type="submit" className="w-full mt-2">
            Sign In
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground text-center mb-3">Demo quick access:</p>
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/super-admin/dashboard")}
              className="flex-1 text-xs py-2 rounded-lg border border-border hover:border-super-admin text-super-admin bg-super-admin/5 hover:bg-super-admin/10 transition-colors"
            >
              Super Admin
            </button>
            <button
              onClick={() => navigate("/agency/dashboard")}
              className="flex-1 text-xs py-2 rounded-lg border border-border hover:border-agency text-agency bg-agency/5 hover:bg-agency/10 transition-colors"
            >
              Agency
            </button>
            <button
              onClick={() => navigate("/client/dashboard")}
              className="flex-1 text-xs py-2 rounded-lg border border-border hover:border-client text-client bg-client/5 hover:bg-client/10 transition-colors"
            >
              Client
            </button>
          </div>
        </div>

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline">Create an account</Link>
          </p>
          <a href="https://social-ninja.lovable.app" className="text-xs text-muted-foreground hover:text-foreground transition-colors block">
            Back to main app
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
