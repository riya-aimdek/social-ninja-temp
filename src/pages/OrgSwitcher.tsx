import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import SocialNinjaLogo from "@/components/SocialNinjaLogo";
import RoleBadge from "@/components/RoleBadge";

const OrgSwitcher = () => {
  const [searchParams] = useSearchParams();
  const orgName = searchParams.get('org') || 'RetailCo';
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(timer); return 100; }
        return prev + 2;
      });
    }, 30);
    return () => clearInterval(timer);
  }, [orgName]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-8"><SocialNinjaLogo size="lg" /></div>
        <h1 className="text-2xl font-semibold text-foreground mb-2">Opening <span className="text-primary">{orgName}</span>...</h1>
        <p className="text-base text-text-secondary mb-8">Loading {orgName}'s workspace in SocialNinja. You'll be redirected automatically.</p>
        <div className="h-1 bg-border rounded-full overflow-hidden mb-8">
          <div className="h-full bg-primary rounded-full transition-all duration-100" style={{ width: `${progress}%` }} />
        </div>
        <div className="card-surface max-w-sm mx-auto text-left">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-organization flex items-center justify-center text-sm font-bold text-white">RC</div>
            <div>
              <p className="text-base font-semibold text-foreground">{orgName}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-text-muted">Retail</span>
                <RoleBadge role="content-creator" />
              </div>
            </div>
          </div>
        </div>
        <Link to="/agency/dashboard" className="text-sm text-text-secondary hover:text-foreground mt-6 inline-block">Not the right org? Go back</Link>
      </div>
    </div>
  );
};

export default OrgSwitcher;
