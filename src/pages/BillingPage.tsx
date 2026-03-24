import { useState } from "react";
import AgencyLayout from "@/components/layout/AgencyLayout";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Download, X, Check, CreditCard, Wifi, Users, TrendingUp } from "lucide-react";

const usageBars = [
  { label: "Social Profiles", used: 22, total: 50, icon: Wifi },
  { label: "Team Members", used: 6, total: 10, icon: Users },
  { label: "Competitor Slots", used: 8, total: 20, icon: TrendingUp },
];

const getBarColor = (pct: number) => pct > 85 ? "bg-error" : pct > 60 ? "bg-warning" : "bg-success";
const getBarTextColor = (pct: number) => pct > 85 ? "text-error" : pct > 60 ? "text-warning" : "text-success";

const invoices = [
  { date: "Mar 1, 2026", desc: "Growth Plan — Monthly", amount: "$99.00", status: "paid" as const },
  { date: "Feb 1, 2026", desc: "Growth Plan — Monthly", amount: "$99.00", status: "paid" as const },
  { date: "Jan 1, 2026", desc: "Growth Plan — Monthly", amount: "$99.00", status: "paid" as const },
  { date: "Dec 1, 2025", desc: "Growth Plan — Monthly", amount: "$99.00", status: "paid" as const },
  { date: "Nov 1, 2025", desc: "Starter → Growth Upgrade", amount: "$49.00", status: "paid" as const },
];

const plans = [
  { name: "Starter", price: "$29", features: ["5 organizations", "20 team members", "10 social profiles", "Basic analytics", "Email support"] },
  { name: "Growth", price: "$99", popular: true, current: true, features: ["25 organizations", "100 team members", "50 social profiles", "Advanced analytics", "Priority support", "Competitor tracking"] },
  { name: "Enterprise", price: "$299", features: ["Unlimited organizations", "Unlimited team members", "Unlimited social profiles", "Custom analytics", "Dedicated support", "API access", "White-label option"] },
];

const BillingPage = () => {
  const [showUpgrade, setShowUpgrade] = useState(false);

  return (
    <AgencyLayout title="Billing & Plan">
      <div className="space-y-6">
        {/* Current Plan */}
        <div className="card-surface">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-2xl font-bold text-foreground">Growth Plan</h2>
                <span className="text-xs font-semibold bg-primary/10 text-primary px-2.5 py-1 rounded-full">Pro Plan</span>
              </div>
              <p className="text-sm text-muted-foreground">Billed monthly · Next billing Jan 1, 2026</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Button onClick={() => setShowUpgrade(true)}>Upgrade Plan</Button>
              <button className="text-xs text-error/70 hover:text-error transition-colors">Cancel subscription</button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {usageBars.map(bar => {
              const pct = Math.round((bar.used / bar.total) * 100);
              return (
                <div key={bar.label} className="border border-border rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <bar.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{bar.label}</span>
                  </div>
                  <p className="text-xl font-bold text-foreground mb-1">{bar.used} <span className="text-sm font-normal text-muted-foreground">of {bar.total} used</span></p>
                  <div className="h-2 bg-border rounded-full overflow-hidden mb-1">
                    <div className={`h-full rounded-full transition-all ${getBarColor(pct)}`} style={{ width: `${pct}%` }} />
                  </div>
                  <p className={`text-[11px] font-medium ${getBarTextColor(pct)}`}>{bar.total - bar.used} remaining</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Method */}
        <div className="card-surface">
          <h3 className="text-base font-semibold text-foreground mb-4">Payment Method</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-8 bg-muted rounded-lg flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Visa ending in 4242</p>
                <p className="text-xs text-muted-foreground">Expires 12/2027</p>
              </div>
            </div>
            <button className="text-sm text-primary hover:underline font-medium">Update</button>
          </div>
        </div>

        {/* Invoices */}
        <div className="card-surface">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-foreground">Invoices</h3>
            <button className="text-sm text-muted-foreground hover:text-foreground">Export all</button>
          </div>
          {/* Desktop table */}
          <div className="hidden md:block">
            <table className="w-full">
              <thead><tr className="border-b border-border">
                {['Date', 'Description', 'Amount', 'Status', ''].map(h => (
                  <th key={h} className="text-left text-xs text-muted-foreground font-medium pb-3">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {invoices.map((inv, i) => (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="py-3 text-sm text-muted-foreground">{inv.date}</td>
                    <td className="py-3 text-sm text-foreground">{inv.desc}</td>
                    <td className="py-3 text-sm font-medium text-foreground">{inv.amount}</td>
                    <td className="py-3"><StatusBadge status={inv.status} /></td>
                    <td className="py-3 text-right"><button className="text-muted-foreground hover:text-foreground"><Download className="h-4 w-4" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {invoices.map((inv, i) => (
              <div key={i} className="border border-border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{inv.amount}</span>
                  <StatusBadge status={inv.status} />
                </div>
                <p className="text-sm text-foreground">{inv.desc}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">{inv.date}</span>
                  <button className="text-muted-foreground hover:text-foreground"><Download className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
          <button className="text-sm text-primary hover:underline mt-4 block">Load more</button>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgrade && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50" onClick={() => setShowUpgrade(false)}>
          <div className="w-[640px] bg-card border border-border rounded-2xl p-8" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Choose a Plan</h2>
              <button onClick={() => setShowUpgrade(false)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {plans.map(p => (
                <div key={p.name} className={`p-5 rounded-xl border ${p.current ? 'border-primary' : 'border-border'} relative`}>
                  {p.current && <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] bg-card text-muted-foreground px-2 rounded-full border border-border">Current</span>}
                  {p.popular && <span className="absolute -top-2.5 right-3 text-[10px] bg-primary text-white px-2 rounded-full">Popular</span>}
                  <h3 className="text-lg font-semibold text-foreground">{p.name}</h3>
                  <div className="mt-2 mb-4"><span className="text-3xl font-bold text-foreground">{p.price}</span><span className="text-muted-foreground text-sm">/mo</span></div>
                  <ul className="space-y-2 mb-4">
                    {p.features.map(f => <li key={f} className="text-[13px] text-muted-foreground flex items-center gap-1.5"><Check className="h-3 w-3 text-success" />{f}</li>)}
                  </ul>
                  <Button variant={p.current ? 'secondary' : 'default'} className="w-full" size="sm" disabled={p.current}>
                    {p.current ? 'Current Plan' : 'Select Plan'}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </AgencyLayout>
  );
};

export default BillingPage;
