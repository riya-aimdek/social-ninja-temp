import { useState } from "react";
import { Eye, EyeOff, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import SocialNinjaLogo from "@/components/SocialNinjaLogo";

const AgencyRegistration = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthColors = ['', 'bg-error', 'bg-warning', 'bg-success'];
  const strengthLabels = ['', 'Weak', 'Fair', 'Strong'];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-[520px] bg-card border border-border rounded-2xl p-12">
        <div className="flex flex-col items-center mb-6">
          <SocialNinjaLogo size="lg" />
          <p className="text-sm text-text-secondary mt-3 text-center">You've been invited to join SocialNinja as an Agency</p>
          <span className="mt-2 text-xs text-text-secondary bg-elevated rounded-full px-3 py-1">invited@agency.com</span>
        </div>

        <h1 className="text-2xl font-semibold text-foreground mb-6">Set up your agency account</h1>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-text-secondary mb-1.5 block">Agency Name</label>
            <input className="input-dark" defaultValue="Digital Spark Agency" />
          </div>
          <div>
            <label className="text-sm text-text-secondary mb-1.5 block">Your Full Name</label>
            <input className="input-dark" placeholder="Enter your full name" />
          </div>
          <div>
            <label className="text-sm text-text-secondary mb-1.5 block">Password</label>
            <div className="relative">
              <input className="input-dark pr-10" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {password && (
              <div className="mt-2">
                <div className="flex gap-1">
                  {[1, 2, 3].map(i => (
                    <div key={i} className={`h-1 flex-1 rounded-full ${i <= strength ? strengthColors[strength] : 'bg-border'}`} />
                  ))}
                </div>
                <span className={`text-[11px] mt-1 block ${strength === 1 ? 'text-error' : strength === 2 ? 'text-warning' : 'text-success'}`}>{strengthLabels[strength]}</span>
              </div>
            )}
          </div>
          <div>
            <label className="text-sm text-text-secondary mb-1.5 block">Confirm Password</label>
            <div className="relative">
              <input className="input-dark pr-10" type={showConfirm ? 'text' : 'password'} placeholder="Confirm your password" />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm text-text-secondary mb-1.5 block">Phone Number</label>
            <input className="input-dark" placeholder="+1 (555) 000-0000" />
          </div>

          <label className="flex items-center gap-2 cursor-pointer mt-2">
            <button onClick={() => setAgreed(!agreed)} className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${agreed ? 'bg-primary border-primary' : 'border-border-hover'}`}>
              {agreed && <Check className="h-3 w-3 text-foreground" />}
            </button>
            <span className="text-sm text-text-secondary">I agree to <a href="#" className="text-primary hover:underline">Terms and Conditions</a></span>
          </label>

          <Button className="w-full mt-2" disabled={!agreed}>
            Create Agency Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AgencyRegistration;
