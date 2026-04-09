import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Building2, Check, ArrowRight, ArrowLeft, Globe, Phone, Mail, User as UserIcon, Lock, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import SocialNinjaLogo from "@/components/SocialNinjaLogo";

type AccountType = "agency" | "business" | null;

const agencyPlans = [
  { id: "starter", name: "Starter", price: "$49", period: "/mo", clients: "Up to 5 businesses", profiles: "15 social profiles", users: "3 team members", highlight: false },
  { id: "professional", name: "Professional", price: "$99", period: "/mo", clients: "Up to 15 businesses", profiles: "50 social profiles", users: "10 team members", highlight: true },
  { id: "agency-plus", name: "Agency+", price: "$199", period: "/mo", clients: "Unlimited businesses", profiles: "Unlimited profiles", users: "Unlimited team members", highlight: false },
];

const clientPlans = [
  { id: "free", name: "Free", price: "$0", period: "", clients: "1 brand", profiles: "3 social profiles", users: "1 user", highlight: false },
  { id: "essentials", name: "Essentials", price: "$19", period: "/mo", clients: "1 brand", profiles: "8 social profiles", users: "3 users", highlight: false },
  { id: "team", name: "Team", price: "$49", period: "/mo", clients: "1 brand", profiles: "20 social profiles", users: "10 users", highlight: true },
];

const passwordRules = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "1 uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "1 number", test: (p: string) => /\d/.test(p) },
  { label: "1 special character", test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [accountType, setAccountType] = useState<AccountType>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", password: "", confirmPassword: "", companyName: "", industry: "", website: "", clientCount: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  const passedRules = passwordRules.filter((r) => r.test(formData.password));
  const allRulesPassed = passedRules.length === passwordRules.length;
  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword.length > 0;

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!formData.name.trim()) e.name = "Name is required";
    if (!formData.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = "Invalid email address";
    if (!formData.phone.trim()) e.phone = "Phone number is required";
    if (!allRulesPassed) e.password = "Password does not meet requirements";
    if (!passwordsMatch) e.confirmPassword = "Passwords do not match";
    if (!formData.companyName.trim()) e.companyName = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const plans = accountType === "agency" ? agencyPlans : clientPlans;

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
              We've sent a verification link to <span className="font-medium text-foreground">{formData.email}</span>. Please check your inbox and click the link to activate your account.
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
          <div className="flex flex-col items-center">
            <SocialNinjaLogo size="lg" />
            <p className="text-sm text-muted-foreground mt-2">Create your account</p>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className={`h-1.5 rounded-full transition-all ${s === step ? "w-8 bg-primary" : s < step ? "w-8 bg-primary/40" : "w-8 bg-border"}`} />
            ))}
          </div>

          {/* Step 1: Choose account type */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-foreground text-center">How will you use SocialNinja?</h2>
              <p className="text-sm text-muted-foreground text-center">This determines your workspace structure and dashboard layout</p>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <button onClick={() => { setAccountType("agency"); setSelectedPlan(""); }} className={`p-5 rounded-xl border-2 text-left transition-all ${accountType === "agency" ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/40"}`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${accountType === "agency" ? "gradient-coral" : "bg-muted"}`}>
                    <Building2 className={`h-6 w-6 ${accountType === "agency" ? "text-white" : "text-muted-foreground"}`} />
                  </div>
                  <p className="text-sm font-semibold text-foreground">Agency</p>
                  <p className="text-xs text-muted-foreground mt-1">I manage social media for multiple businesses</p>
                  <div className="mt-3 space-y-1">
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1"><Check className="h-3 w-3 text-success" /> Multi-client dashboard</p>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1"><Check className="h-3 w-3 text-success" /> Business isolation</p>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1"><Check className="h-3 w-3 text-success" /> Approval workflows</p>
                  </div>
                </button>
                <button onClick={() => { setAccountType("business"); setSelectedPlan(""); }} className={`p-5 rounded-xl border-2 text-left transition-all ${accountType === "business" ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/40"}`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${accountType === "business" ? "gradient-coral" : "bg-muted"}`}>
                    <Globe className={`h-6 w-6 ${accountType === "business" ? "text-white" : "text-muted-foreground"}`} />
                  </div>
                  <p className="text-sm font-semibold text-foreground">Organisation</p>
                  <p className="text-xs text-muted-foreground mt-1">I manage my own brand's social media</p>
                  <div className="mt-3 space-y-1">
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1"><Check className="h-3 w-3 text-success" /> Brand dashboard</p>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1"><Check className="h-3 w-3 text-success" /> Content calendar</p>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1"><Check className="h-3 w-3 text-success" /> Team collaboration</p>
                  </div>
                </button>
              </div>
              <Button className="w-full mt-4" disabled={!accountType} onClick={() => setStep(2)}>
                Continue <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}

          {/* Step 2: Personal details per SRS 2.1 */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-foreground text-center">Your details</h2>
              <p className="text-sm text-muted-foreground text-center">{accountType === "agency" ? "Set up your agency account" : "Set up your account"}</p>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block flex items-center gap-1"><UserIcon className="h-3.5 w-3.5" /> Full Name *</label>
                  <input className="input-dark" value={formData.name} onChange={(e) => updateField("name", e.target.value)} placeholder="John Doe" />
                  {errors.name && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors.name}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> Email Address *</label>
                  <input className="input-dark" type="email" value={formData.email} onChange={(e) => updateField("email", e.target.value)} placeholder="you@company.com" />
                  {errors.email && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors.email}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> Phone Number *</label>
                  <input className="input-dark" type="tel" value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="+1 (555) 123-4567" />
                  {errors.phone && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors.phone}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block flex items-center gap-1"><Lock className="h-3.5 w-3.5" /> Password *</label>
                  <div className="relative">
                    <input className="input-dark pr-10" type={showPassword ? "text" : "password"} value={formData.password} onChange={(e) => updateField("password", e.target.value)} placeholder="Create a password" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {formData.password && (
                    <div className="mt-2 space-y-1">
                      {passwordRules.map((rule) => (
                        <div key={rule.label} className={`flex items-center gap-1.5 text-[11px] ${rule.test(formData.password) ? "text-success" : "text-muted-foreground"}`}>
                          {rule.test(formData.password) ? <Check className="h-3 w-3" /> : <div className="w-3 h-3 rounded-full border border-current" />}
                          {rule.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Confirm Password *</label>
                  <div className="relative">
                    <input className="input-dark pr-10" type={showConfirm ? "text" : "password"} value={formData.confirmPassword} onChange={(e) => updateField("confirmPassword", e.target.value)} placeholder="Confirm password" />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {formData.confirmPassword && !passwordsMatch && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Passwords do not match</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">{accountType === "agency" ? "Agency Name *" : "Company / Brand Name *"}</label>
                  <input className="input-dark" value={formData.companyName} onChange={(e) => updateField("companyName", e.target.value)} placeholder={accountType === "agency" ? "Digital Spark Agency" : "Acme Inc."} />
                  {errors.companyName && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors.companyName}</p>}
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1"><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>
                <Button onClick={() => { if (validateStep2()) setStep(3); }} className="flex-1">Continue <ArrowRight className="h-4 w-4 ml-1" /></Button>
              </div>
            </div>
          )}

          {/* Step 3: Plan selection */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-foreground text-center">Choose your plan</h2>
              <p className="text-sm text-muted-foreground text-center">{accountType === "agency" ? "Flat-rate pricing — no per-user fees" : "Start free, upgrade when you're ready"}</p>
              <div className="space-y-3 mt-4">
                {plans.map((plan) => (
                  <button key={plan.id} onClick={() => setSelectedPlan(plan.id)} className={`w-full p-4 rounded-xl border-2 text-left transition-all relative ${selectedPlan === plan.id ? "border-primary bg-primary/5" : plan.highlight ? "border-primary/30 bg-primary/[0.02]" : "border-border hover:border-primary/40"}`}>
                    {plan.highlight && <span className="absolute -top-2.5 right-3 text-[10px] font-bold bg-primary text-white px-2 py-0.5 rounded-full">POPULAR</span>}
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-lg font-bold text-foreground">{plan.price}</span>
                      <span className="text-xs text-muted-foreground">{plan.period}</span>
                      <span className="text-sm font-semibold text-foreground ml-2">{plan.name}</span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1">
                      <span className="text-xs text-muted-foreground">{plan.clients}</span>
                      <span className="text-xs text-muted-foreground">{plan.profiles}</span>
                      <span className="text-xs text-muted-foreground">{plan.users}</span>
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground text-center">No credit card required. 14-day free trial on all paid plans.</p>
              <div className="flex gap-3 mt-4">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1"><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>
                <Button onClick={() => setStep(4)} className="flex-1" disabled={!selectedPlan}>Continue <ArrowRight className="h-4 w-4 ml-1" /></Button>
              </div>
            </div>
          )}

          {/* Step 4: Final details + T&C per SRS 2.1 */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-foreground text-center">{accountType === "agency" ? "Agency details" : "Business details"}</h2>
              <p className="text-sm text-muted-foreground text-center">Almost there — tell us about your {accountType === "agency" ? "agency" : "business"}</p>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Industry</label>
                  <select className="input-dark" value={formData.industry} onChange={(e) => updateField("industry", e.target.value)}>
                    <option value="">Select industry</option>
                    {accountType === "agency" ? (
                      <><option>Marketing Agency</option><option>Creative Agency</option><option>Digital Agency</option><option>PR & Communications</option><option>Freelancer</option><option>Other</option></>
                    ) : (
                      <><option>Retail & E-commerce</option><option>Technology</option><option>Healthcare</option><option>Food & Beverage</option><option>Real Estate</option><option>Education</option><option>Other</option></>
                    )}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Website URL (optional)</label>
                  <input className="input-dark" value={formData.website} onChange={(e) => updateField("website", e.target.value)} placeholder="https://" />
                </div>
                {accountType === "agency" && (
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">How many clients do you manage?</label>
                    <select className="input-dark" value={formData.clientCount} onChange={(e) => updateField("clientCount", e.target.value)}>
                      <option value="">Select range</option>
                      <option>1–5 businesses</option><option>6–15 businesses</option><option>16–50 businesses</option><option>50+ businesses</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="bg-muted/50 rounded-xl p-4 text-xs text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Timezone auto-detected</p>
                <p>Your timezone has been set to <span className="font-medium text-foreground">{Intl.DateTimeFormat().resolvedOptions().timeZone}</span> based on your system settings. You can change this later in Account Settings.</p>
              </div>

              <label className="flex items-start gap-2 cursor-pointer mt-2">
                <button onClick={() => setAgreed(!agreed)} className={`w-4 h-4 rounded border flex items-center justify-center transition-colors mt-0.5 shrink-0 ${agreed ? "bg-primary border-primary" : "border-border-hover"}`}>
                  {agreed && <Check className="h-3 w-3 text-white" />}
                </button>
                <span className="text-sm text-muted-foreground">
                  I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                </span>
              </label>

              <div className="flex gap-3 mt-4">
                <Button variant="outline" onClick={() => setStep(3)} className="flex-1"><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>
                <Button className="flex-1 shadow-coral" disabled={!agreed} onClick={() => setShowVerification(true)}>
                  Create Account
                </Button>
              </div>
            </div>
          )}

          <p className="text-center text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
