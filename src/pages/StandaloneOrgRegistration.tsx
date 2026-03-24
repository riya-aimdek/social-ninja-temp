import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import SocialNinjaLogo from "@/components/SocialNinjaLogo";

const StandaloneOrgRegistration = () => {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-[520px] bg-card border border-border rounded-2xl p-12 shadow-sm">
        <div className="flex flex-col items-center mb-6">
          <SocialNinjaLogo size="lg" />
          <p className="text-sm text-text-secondary mt-3">Setting up your organization directly</p>
          <span className="mt-2 text-[11px] text-organization bg-organization/10 border border-organization/30 rounded-full px-3 py-1">Direct Path</span>
        </div>
        <h1 className="text-2xl font-semibold text-foreground mb-6">Create your organization account</h1>
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className={`w-2.5 h-2.5 rounded-full ${step === 1 ? 'bg-primary' : 'bg-border'}`} />
          <div className={`w-2.5 h-2.5 rounded-full ${step === 2 ? 'bg-primary' : 'bg-border'}`} />
        </div>
        {step === 1 && (
          <div className="space-y-4">
            <div><label className="text-sm text-text-secondary mb-1.5 block">Full Name</label><input className="input-dark" placeholder="Enter your full name" /></div>
            <div><label className="text-sm text-text-secondary mb-1.5 block">Email Address</label><input className="input-dark" type="email" placeholder="you@company.com" /></div>
            <div><label className="text-sm text-text-secondary mb-1.5 block">Password</label>
              <div className="relative"><input className="input-dark pr-10" type={showPassword ? 'text' : 'password'} placeholder="Create a password" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>
            </div>
            <div><label className="text-sm text-text-secondary mb-1.5 block">Confirm Password</label>
              <div className="relative"><input className="input-dark pr-10" type={showConfirm ? 'text' : 'password'} placeholder="Confirm password" /><button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">{showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>
            </div>
            <div><label className="text-sm text-text-secondary mb-1.5 block">Phone Number</label><input className="input-dark" placeholder="+1 (555) 000-0000" /></div>
            <Button className="w-full mt-2" onClick={() => setStep(2)}>Continue</Button>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <div><label className="text-sm text-text-secondary mb-1.5 block">Organization Name</label><input className="input-dark" placeholder="Your organization name" /></div>
            <div><label className="text-sm text-text-secondary mb-1.5 block">Industry</label><select className="input-dark"><option value="">Select industry</option><option>Retail</option><option>Technology</option><option>Healthcare</option></select></div>
            <div><label className="text-sm text-text-secondary mb-1.5 block">Website URL (optional)</label><input className="input-dark" placeholder="https://" /></div>
            <div><label className="text-sm text-text-secondary mb-1.5 block">Logo (optional)</label>
              <div className="w-20 h-20 border-2 border-dashed border-border rounded-xl flex items-center justify-center hover:border-border-hover cursor-pointer"><Upload className="h-5 w-5 text-text-muted" /></div>
            </div>
            <Button className="w-full mt-2">Create Organization</Button>
            <button onClick={() => setStep(1)} className="w-full text-sm text-text-secondary hover:text-foreground text-center mt-2">Back</button>
          </div>
        )}
        <p className="text-sm text-muted-foreground text-center mt-6">Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link></p>
      </div>
    </div>
  );
};

export default StandaloneOrgRegistration;
