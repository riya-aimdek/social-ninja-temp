import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Building2, Users, Check, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import SocialNinjaLogo from "@/components/SocialNinjaLogo";

type AccountType = "agency" | "client" | null;

const RegisterPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [accountType, setAccountType] = useState<AccountType>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthColors = ["", "bg-error", "bg-warning", "bg-success"];
  const strengthLabels = ["", "Weak", "Fair", "Strong"];

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
            {[1, 2, 3].map((s) => (
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
              <p className="text-sm text-muted-foreground text-center">Choose the type of account that best fits your needs</p>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <button
                  onClick={() => setAccountType("agency")}
                  className={`p-5 rounded-xl border-2 text-left transition-all ${
                    accountType === "agency"
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                    accountType === "agency" ? "gradient-coral" : "bg-muted"
                  }`}>
                    <Building2 className={`h-5 w-5 ${accountType === "agency" ? "text-white" : "text-muted-foreground"}`} />
                  </div>
                  <p className="text-sm font-semibold text-foreground">Agency</p>
                  <p className="text-xs text-muted-foreground mt-1">Manage multiple clients and their social media from one dashboard</p>
                </button>

                <button
                  onClick={() => setAccountType("client")}
                  className={`p-5 rounded-xl border-2 text-left transition-all ${
                    accountType === "client"
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                    accountType === "client" ? "gradient-coral" : "bg-muted"
                  }`}>
                    <Users className={`h-5 w-5 ${accountType === "client" ? "text-white" : "text-muted-foreground"}`} />
                  </div>
                  <p className="text-sm font-semibold text-foreground">Client</p>
                  <p className="text-xs text-muted-foreground mt-1">Manage your own brand's social media presence directly</p>
                </button>
              </div>

              <Button
                className="w-full mt-4"
                disabled={!accountType}
                onClick={() => setStep(2)}
              >
                Continue <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}

          {/* Step 2: Personal details */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-foreground text-center">Your details</h2>
              <p className="text-sm text-muted-foreground text-center">
                {accountType === "agency" ? "Set up your agency account" : "Set up your client account"}
              </p>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name</label>
                  <input className="input-dark" placeholder="John Doe" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
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
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {password && (
                    <div className="mt-2">
                      <div className="flex gap-1">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full ${i <= strength ? strengthColors[strength] : "bg-border"}`}
                          />
                        ))}
                      </div>
                      <span
                        className={`text-[11px] mt-1 block ${
                          strength === 1 ? "text-error" : strength === 2 ? "text-warning" : "text-success"
                        }`}
                      >
                        {strengthLabels[strength]}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Confirm Password</label>
                  <div className="relative">
                    <input
                      className="input-dark pr-10"
                      type={showConfirm ? "text" : "password"}
                      placeholder="Confirm password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Phone Number</label>
                  <input className="input-dark" placeholder="+1 (555) 000-0000" />
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

          {/* Step 3: Business details */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-foreground text-center">
                {accountType === "agency" ? "Agency details" : "Business details"}
              </h2>
              <p className="text-sm text-muted-foreground text-center">
                Tell us about your {accountType === "agency" ? "agency" : "business"}
              </p>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    {accountType === "agency" ? "Agency Name" : "Business Name"}
                  </label>
                  <input className="input-dark" placeholder={accountType === "agency" ? "Digital Spark Agency" : "RetailCo"} />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Industry</label>
                  <select className="input-dark">
                    <option value="">Select industry</option>
                    <option>Marketing Agency</option>
                    <option>Creative Agency</option>
                    <option>Retail</option>
                    <option>Technology</option>
                    <option>Healthcare</option>
                    <option>Food & Beverage</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Website URL (optional)</label>
                  <input className="input-dark" placeholder="https://" />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer mt-2">
                <button
                  onClick={() => setAgreed(!agreed)}
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    agreed ? "bg-primary border-primary" : "border-border-hover"
                  }`}
                >
                  {agreed && <Check className="h-3 w-3 text-white" />}
                </button>
                <span className="text-sm text-muted-foreground">
                  I agree to the{" "}
                  <a href="#" className="text-primary hover:underline">
                    Terms and Conditions
                  </a>
                </span>
              </label>

              <div className="flex gap-3 mt-4">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </Button>
                <Button
                  className="flex-1 shadow-coral"
                  disabled={!agreed}
                  onClick={() => navigate("/onboarding")}
                >
                  Create Account
                </Button>
              </div>
            </div>
          )}

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;