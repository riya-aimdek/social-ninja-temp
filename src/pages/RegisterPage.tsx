import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Building2, Users, Check, ArrowRight, ArrowLeft, Briefcase, Globe, Zap, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import SocialNinjaLogo from "@/components/SocialNinjaLogo";

type AccountType = "agency" | "client" | null;

const agencyPlans = [
  { id: "starter", name: "Starter", price: "$49", period: "/mo", clients: "Up to 5 clients", profiles: "15 social profiles", users: "3 team members", highlight: false },
  { id: "professional", name: "Professional", price: "$99", period: "/mo", clients: "Up to 15 clients", profiles: "50 social profiles", users: "10 team members", highlight: true },
  { id: "agency-plus", name: "Agency+", price: "$199", period: "/mo", clients: "Unlimited clients", profiles: "Unlimited profiles", users: "Unlimited team members", highlight: false },
];

const clientPlans = [
  { id: "free", name: "Free", price: "$0", period: "", clients: "1 brand", profiles: "3 social profiles", users: "1 user", highlight: false },
  { id: "essentials", name: "Essentials", price: "$19", period: "/mo", clients: "1 brand", profiles: "8 social profiles", users: "3 users", highlight: false },
  { id: "team", name: "Team", price: "$49", period: "/mo", clients: "1 brand", profiles: "20 social profiles", users: "10 users", highlight: true },
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [accountType, setAccountType] = useState<AccountType>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthColors = ["", "bg-error", "bg-warning", "bg-success"];
  const strengthLabels = ["", "Weak", "Fair", "Strong"];

  const plans = accountType === "agency" ? agencyPlans : clientPlans;

  return (
    <div className="min-h-screen gradient-mesh bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg animate-fade-in">
        <div className="bg-card rounded-2xl shadow-card p-8 space-y-6">
          {/* Logo */}
          <div className="flex flex-col items-center">
            <SocialNinjaLogo size="lg" />
            <p className="text-sm text-muted-foreground mt-2">Create your account</p>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all ${
                  s === step ? "w-8 bg-primary" : s < step ? "w-8 bg-primary/40" : "w-8 bg-border"
                }`}
              />
            ))}
          </div>

          {/* Step 1: Choose account type */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-foreground text-center">How will you use SocialNinja?</h2>
              <p className="text-sm text-muted-foreground text-center">This determines your workspace structure and dashboard layout</p>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <button
                  onClick={() => { setAccountType("agency"); setSelectedPlan(""); }}
                  className={`p-5 rounded-xl border-2 text-left transition-all ${
                    accountType === "agency"
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                    accountType === "agency" ? "gradient-coral" : "bg-muted"
                  }`}>
                    <Building2 className={`h-6 w-6 ${accountType === "agency" ? "text-white" : "text-muted-foreground"}`} />
                  </div>
                  <p className="text-sm font-semibold text-foreground">Agency</p>
                  <p className="text-xs text-muted-foreground mt-1">I manage social media for multiple clients</p>
                  <div className="mt-3 space-y-1">
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1"><Check className="h-3 w-3 text-success" /> Multi-client dashboard</p>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1"><Check className="h-3 w-3 text-success" /> Client isolation</p>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1"><Check className="h-3 w-3 text-success" /> Approval workflows</p>
                  </div>
                </button>

                <button
                  onClick={() => { setAccountType("client"); setSelectedPlan(""); }}
                  className={`p-5 rounded-xl border-2 text-left transition-all ${
                    accountType === "client"
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                    accountType === "client" ? "gradient-coral" : "bg-muted"
                  }`}>
                    <Globe className={`h-6 w-6 ${accountType === "client" ? "text-white" : "text-muted-foreground"}`} />
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

          {/* Step 2: Personal details */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-foreground text-center">Your details</h2>
              <p className="text-sm text-muted-foreground text-center">
                {accountType === "agency" ? "Set up your agency account" : "Set up your account"}
              </p>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name</label>
                  <input className="input-dark" placeholder="John Doe" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Work Email</label>
                  <input className="input-dark" type="email" placeholder="you@company.com" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
                  <div className="relative">
                    <input
                      className="input-dark pr-10"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {password && (
                    <div className="mt-2">
                      <div className="flex gap-1">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className={`h-1 flex-1 rounded-full ${i <= strength ? strengthColors[strength] : "bg-border"}`} />
                        ))}
                      </div>
                      <span className={`text-[11px] mt-1 block ${strength === 1 ? "text-error" : strength === 2 ? "text-warning" : "text-success"}`}>
                        {strengthLabels[strength]}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Confirm Password</label>
                  <div className="relative">
                    <input className="input-dark pr-10" type={showConfirm ? "text" : "password"} placeholder="Confirm password" />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    {accountType === "agency" ? "Agency Name" : "Company / Brand Name"}
                  </label>
                  <input className="input-dark" placeholder={accountType === "agency" ? "Digital Spark Agency" : "Acme Inc."} />
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </Button>
                <Button onClick={() => setStep(3)} className="flex-1">
                  Continue <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Plan selection */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-foreground text-center">Choose your plan</h2>
              <p className="text-sm text-muted-foreground text-center">
                {accountType === "agency" ? "Flat-rate pricing — no per-user fees" : "Start free, upgrade when you're ready"}
              </p>

              <div className="space-y-3 mt-4">
                {plans.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all relative ${
                      selectedPlan === plan.id
                        ? "border-primary bg-primary/5"
                        : plan.highlight
                        ? "border-primary/30 bg-primary/[0.02]"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    {plan.highlight && (
                      <span className="absolute -top-2.5 right-3 text-[10px] font-bold bg-primary text-white px-2 py-0.5 rounded-full">
                        POPULAR
                      </span>
                    )}
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

              <p className="text-xs text-muted-foreground text-center">
                No credit card required. 14-day free trial on all paid plans.
              </p>

              <div className="flex gap-3 mt-4">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </Button>
                <Button onClick={() => setStep(4)} className="flex-1" disabled={!selectedPlan}>
                  Continue <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Business details + T&C */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-foreground text-center">
                {accountType === "agency" ? "Agency details" : "Business details"}
              </h2>
              <p className="text-sm text-muted-foreground text-center">
                Almost there — tell us about your {accountType === "agency" ? "agency" : "business"}
              </p>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Industry</label>
                  <select className="input-dark">
                    <option value="">Select industry</option>
                    {accountType === "agency" ? (
                      <>
                        <option>Marketing Agency</option>
                        <option>Creative Agency</option>
                        <option>Digital Agency</option>
                        <option>PR & Communications</option>
                        <option>Freelancer</option>
                        <option>Other</option>
                      </>
                    ) : (
                      <>
                        <option>Retail & E-commerce</option>
                        <option>Technology</option>
                        <option>Healthcare</option>
                        <option>Food & Beverage</option>
                        <option>Real Estate</option>
                        <option>Education</option>
                        <option>Other</option>
                      </>
                    )}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Website URL (optional)</label>
                  <input className="input-dark" placeholder="https://" />
                </div>
                {accountType === "agency" && (
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">How many clients do you manage?</label>
                    <select className="input-dark">
                      <option value="">Select range</option>
                      <option>1–5 clients</option>
                      <option>6–15 clients</option>
                      <option>16–50 clients</option>
                      <option>50+ clients</option>
                    </select>
                  </div>
                )}
              </div>

              <label className="flex items-start gap-2 cursor-pointer mt-2">
                <button
                  onClick={() => setAgreed(!agreed)}
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors mt-0.5 shrink-0 ${
                    agreed ? "bg-primary border-primary" : "border-border-hover"
                  }`}
                >
                  {agreed && <Check className="h-3 w-3 text-white" />}
                </button>
                <span className="text-sm text-muted-foreground">
                  I agree to the{" "}
                  <a href="#" className="text-primary hover:underline">Terms of Service</a>
                  {" "}and{" "}
                  <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                </span>
              </label>

              <div className="flex gap-3 mt-4">
                <Button variant="outline" onClick={() => setStep(3)} className="flex-1">
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </Button>
                <Button
                  className="flex-1 shadow-coral"
                  disabled={!agreed}
                  onClick={() => navigate(`/onboarding?type=${accountType}`)}
                >
                  Create Account
                </Button>
              </div>
            </div>
          )}

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
