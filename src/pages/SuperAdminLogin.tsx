import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import SocialNinjaLogo from "@/components/SocialNinjaLogo";
import { useNavigate } from "react-router-dom";

const SuperAdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/super-admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-[440px] bg-card border border-border rounded-2xl p-10">
        <div className="flex flex-col items-center mb-8">
          <SocialNinjaLogo size="lg" />
          <span className="mt-3 text-[11px] text-super-admin border border-super-admin rounded-full px-3 py-1 bg-elevated">
            Super Admin Portal
          </span>
        </div>

        <h1 className="text-2xl font-semibold text-foreground mb-2">Platform Administration</h1>
        <p className="text-sm text-text-secondary mb-8">Full platform control. Restricted access only.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-text-secondary mb-1.5 block">Email Address</label>
            <input className="input-dark" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@socialninja.com" />
          </div>
          <div>
            <label className="text-sm text-text-secondary mb-1.5 block">Password</label>
            <div className="relative">
              <input className="input-dark pr-10" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <Button type="submit" variant="superAdmin" className="w-full mt-2">
            Sign In to Admin Portal
          </Button>
        </form>

        <div className="mt-6 text-center">
          <a href="https://social-ninja.lovable.app" className="text-sm text-text-secondary hover:text-foreground transition-colors">
            Back to main app
          </a>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLogin;
