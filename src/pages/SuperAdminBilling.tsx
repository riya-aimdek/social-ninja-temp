import SuperAdminLayout from "@/components/layout/SuperAdminLayout";
import { CreditCard, Users, Image, Zap } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$29/mo",
    activeCount: 8,
    limits: { orgs: 5, users: 20, profiles: 10, competitors: 0 },
    features: ["Basic analytics", "Email support", "5 organizations", "20 users", "10 social profiles"],
  },
  {
    name: "Growth",
    price: "$99/mo",
    activeCount: 14,
    limits: { orgs: 25, users: 100, profiles: 50, competitors: 5 },
    features: ["Advanced analytics", "Priority support", "25 organizations", "100 users", "50 social profiles", "5 competitor slots", "Post scheduling"],
  },
  {
    name: "Enterprise",
    price: "$299/mo",
    activeCount: 6,
    limits: { orgs: -1, users: -1, profiles: -1, competitors: 20 },
    features: ["Full analytics suite", "Dedicated support", "Unlimited organizations", "Unlimited users", "Unlimited social profiles", "20 competitor slots", "API access", "White-label options"],
  },
];

const planColors = ["bg-info/10 text-info", "bg-warning/10 text-warning", "bg-primary/10 text-primary"];

const SuperAdminBilling = () => {
  return (
    <SuperAdminLayout title="Plan Management">
      <div className="space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          {plans.map((plan, i) => (
            <div key={plan.name} className="card-surface">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${planColors[i]}`}>{plan.name}</span>
                  <p className="text-2xl font-bold text-foreground mt-2">{plan.price}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground">{plan.activeCount}</p>
                  <p className="text-xs text-muted-foreground">active subscribers</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Plan Details Table */}
        <div className="card-surface">
          <h2 className="text-base font-semibold text-foreground mb-4">Plan Tier Comparison</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-[11px] uppercase text-muted-foreground font-medium pb-3">Limit</th>
                {plans.map(p => (
                  <th key={p.name} className="text-left text-[11px] uppercase text-muted-foreground font-medium pb-3">{p.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: "Organizations", key: "orgs", icon: CreditCard },
                { label: "Users", key: "users", icon: Users },
                { label: "Social Profiles", key: "profiles", icon: Image },
                { label: "Competitor Slots", key: "competitors", icon: Zap },
              ].map(row => (
                <tr key={row.key} className="border-b border-border/50 last:border-0">
                  <td className="py-3 text-sm text-foreground font-medium flex items-center gap-2">
                    <row.icon className="h-4 w-4 text-muted-foreground" />
                    {row.label}
                  </td>
                  {plans.map(p => (
                    <td key={p.name} className="py-3 text-sm text-muted-foreground">
                      {(p.limits as any)[row.key] === -1 ? (
                        <span className="text-primary font-medium">Unlimited</span>
                      ) : (
                        (p.limits as any)[row.key]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Features */}
        <div className="card-surface">
          <h2 className="text-base font-semibold text-foreground mb-4">Features by Plan</h2>
          <div className="grid grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <div key={plan.name}>
                <h3 className="text-sm font-semibold text-foreground mb-3">{plan.name}</h3>
                <ul className="space-y-2">
                  {plan.features.map(f => (
                    <li key={f} className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default SuperAdminBilling;
