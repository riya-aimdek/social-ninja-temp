import SuperAdminLayout from "@/components/layout/SuperAdminLayout";
import StatusBadge from "@/components/StatusBadge";
import { CreditCard, TrendingUp, DollarSign, Users } from "lucide-react";

const stats = [
  { label: "Monthly Revenue", value: "$12,450", icon: DollarSign, color: "text-green-600" },
  { label: "Active Subscriptions", value: "142", icon: CreditCard, color: "text-primary" },
  { label: "Growth Rate", value: "+12%", icon: TrendingUp, color: "text-blue-600" },
  { label: "Paying Agencies", value: "24", icon: Users, color: "text-purple-600" },
];

const subscriptions = [
  { agency: "Digital Spark Agency", plan: "Enterprise", amount: "$299/mo", users: 87, status: "active" as const, nextBilling: "Apr 1, 2026" },
  { agency: "CreativeFlow Media", plan: "Growth", amount: "$99/mo", users: 45, status: "active" as const, nextBilling: "Apr 1, 2026" },
  { agency: "SocialPulse Inc", plan: "Starter", amount: "$29/mo", users: 22, status: "suspended" as const, nextBilling: "—" },
  { agency: "BrandWave Digital", plan: "Enterprise", amount: "$299/mo", users: 120, status: "active" as const, nextBilling: "Apr 1, 2026" },
  { agency: "PixelForge Studio", plan: "Growth", amount: "$99/mo", users: 31, status: "active" as const, nextBilling: "Apr 1, 2026" },
  { agency: "LocalBites (Standalone)", plan: "Starter", amount: "$29/mo", users: 8, status: "active" as const, nextBilling: "Apr 5, 2026" },
  { agency: "FitnessPro (Standalone)", plan: "Growth", amount: "$99/mo", users: 14, status: "active" as const, nextBilling: "Apr 10, 2026" },
];

const SuperAdminBilling = () => {
  return (
    <SuperAdminLayout title="Billing & Plans">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {stats.map(s => (
            <div key={s.label} className="card-surface">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className={`text-2xl font-semibold ${s.color}`}>{s.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Subscriptions Table */}
        <div className="card-surface">
          <h2 className="text-base font-semibold text-foreground mb-4">All Subscriptions</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {["Agency / Org", "Plan", "Amount", "Users", "Next Billing", "Status"].map(h => (
                  <th key={h} className="text-left text-xs text-muted-foreground font-medium pb-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subscriptions.map(s => (
                <tr key={s.agency} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="py-3 text-sm text-foreground font-medium">{s.agency}</td>
                  <td className="py-3 text-sm text-muted-foreground">{s.plan}</td>
                  <td className="py-3 text-sm text-foreground font-medium">{s.amount}</td>
                  <td className="py-3 text-sm text-muted-foreground">{s.users}</td>
                  <td className="py-3 text-sm text-muted-foreground">{s.nextBilling}</td>
                  <td className="py-3"><StatusBadge status={s.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default SuperAdminBilling;
