import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Check, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState<"agency" | "business">("business");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [formData, setFormData] = useState({
    name: "", companyName: "", email: "", phone: "", password: "", confirmPassword: "",
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    setShowVerification(true);
  };

  if (showVerification) {
    return (
      <div className="min-h-screen gradient-mesh bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-fade-in">
          <div className="bg-card rounded-2xl shadow-card p-8 text-center space-y-5">
            <div className="w-16 h-16 gradient-coral rounded-full flex items-center justify-center mx-auto shadow-coral">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Verify your email</h2>
            <p className="text-sm text-muted-foreground">
              We've sent a verification link to <span className="font-medium text-foreground">{formData.email || "xyz@example.com"}</span>.
              Please check your inbox and click the link to activate your account.
            </p>
            <div className="bg-muted rounded-xl p-4 text-left space-y-2">
              <p className="text-xs font-semibold text-foreground uppercase tracking-wider">What's next?</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-success shrink-0" /> <span>Check your email inbox</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-muted-foreground shrink-0" /> <span>Click the verification link</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-muted-foreground shrink-0" /> <span>Log in and start your onboarding</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Didn't receive the email? <button className="text-primary hover:underline font-medium">Resend verification</button></p>
            <Button variant="outline" onClick={() => navigate("/login")} className="w-full">
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-mesh bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg animate-fade-in">
        <div className="bg-card rounded-2xl shadow-card p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-foreground">Start your free trial</h2>
            <p className="text-sm text-muted-foreground mt-1">No credit card required. Cancel anytime.</p>
          </div>

          {/* Account Type Toggle */}
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Account Type</p>
            <div className="grid grid-cols-2 gap-0 border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setAccountType("agency")}
                className={`py-2.5 text-sm font-medium transition-colors ${
                  accountType === "agency"
                    ? "bg-primary/10 text-primary border-r border-border"
                    : "text-muted-foreground hover:text-foreground border-r border-border"
                }`}
              >
                <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${accountType === "agency" ? "bg-primary" : "bg-border"}`} />
                Agency
              </button>
              <button
                onClick={() => setAccountType("business")}
                className={`py-2.5 text-sm font-medium transition-colors ${
                  accountType === "business"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${accountType === "business" ? "bg-primary" : "bg-border"}`} />
                Business
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Your Name <span className="text-primary">*</span></label>
                <input className="input-dark" placeholder="John Doe" value={formData.name} onChange={e => updateField("name", e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">{accountType === "agency" ? "Agency Name" : "Business Name"} <span className="text-primary">*</span></label>
                <input className="input-dark" placeholder={accountType === "agency" ? "Agency Name" : "Business Name"} value={formData.companyName} onChange={e => updateField("companyName", e.target.value)} />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Your Email Address <span className="text-primary">*</span></label>
              <input className="input-dark" type="email" placeholder="john@example.com" value={formData.email} onChange={e => updateField("email", e.target.value)} />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Mobile Number</label>
              <input className="input-dark" type="tel" placeholder="+1 234 567 8900" value={formData.phone} onChange={e => updateField("phone", e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Password <span className="text-primary">*</span></label>
                <div className="relative">
                  <input className="input-dark pr-10" type={showPassword ? "text" : "password"} placeholder="Min. 8 chars" value={formData.password} onChange={e => updateField("password", e.target.value)} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Confirm Password <span className="text-primary">*</span></label>
                <div className="relative">
                  <input className="input-dark pr-10" type={showConfirm ? "text" : "password"} placeholder="Re-enter password" value={formData.confirmPassword} onChange={e => updateField("confirmPassword", e.target.value)} />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* T&C */}
          <label className="flex items-start gap-2 cursor-pointer">
            <button onClick={() => setAgreed(!agreed)} className={`w-4 h-4 rounded border flex items-center justify-center transition-colors mt-0.5 shrink-0 ${agreed ? "bg-primary border-primary" : "border-border"}`}>
              {agreed && <Check className="h-3 w-3 text-white" />}
            </button>
            <span className="text-sm text-muted-foreground">
              I agree to MAT's <a href="#" className="text-primary hover:underline">Terms & Conditions</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
            </span>
          </label>

          <Button className="w-full" disabled={!agreed} onClick={handleSubmit}>
            Create Account
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
