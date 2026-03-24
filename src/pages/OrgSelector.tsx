import { ChevronRight } from "lucide-react";
import SocialNinjaLogo from "@/components/SocialNinjaLogo";

const orgs = [
  { id: '1', name: 'RetailCo', initials: 'RC', color: 'bg-organization', via: 'Digital Spark Agency', viaType: 'agency', role: 'Content Creator' },
  { id: '2', name: 'TechStart', initials: 'TS', color: 'bg-info', via: 'Digital Spark Agency', viaType: 'agency', role: 'Approver' },
  { id: '3', name: 'FoodieHub', initials: 'FH', color: 'bg-warning', via: 'Digital Spark Agency', viaType: 'agency', role: 'Analyst' },
  { id: '4', name: 'LocalBites', initials: 'LB', color: 'bg-success', via: null, viaType: 'direct', role: 'Admin' },
];

const OrgSelector = () => {
  const handleSelect = (orgId: string) => {
    window.open(`https://social-ninja.lovable.app?org=${orgId}`, '_self');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-xl pt-20">
        <div className="flex justify-center mb-8">
          <SocialNinjaLogo size="lg" />
        </div>

        <h1 className="text-[28px] font-semibold text-foreground text-center mb-2">Select a workspace</h1>
        <p className="text-base text-text-secondary text-center mb-8">You have access to {orgs.length} organizations. Choose one to continue.</p>

        <div className="space-y-3 max-w-[560px] mx-auto">
          {orgs.map(org => (
            <button
              key={org.id}
              onClick={() => handleSelect(org.id)}
              className="w-full card-surface flex items-center gap-4 hover:border-primary hover:bg-elevated/50 transition-all cursor-pointer text-left"
            >
              <div className={`w-12 h-12 rounded-full ${org.color} flex items-center justify-center text-sm font-bold text-foreground shrink-0`}>
                {org.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-foreground">{org.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  {org.viaType === 'agency' ? (
                    <span className="text-xs text-agency">via {org.via}</span>
                  ) : (
                    <span className="text-xs text-organization">Direct organization</span>
                  )}
                  <span className="text-[11px] bg-elevated text-text-secondary rounded-full px-2 py-0.5">{org.role}</span>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-text-muted shrink-0" />
            </button>
          ))}
        </div>

        <div className="border-t border-border mt-8 pt-4 text-center">
          <a href="/agency/dashboard" className="text-sm text-text-secondary hover:text-foreground">Manage your organizations</a>
        </div>
      </div>
    </div>
  );
};

export default OrgSelector;
