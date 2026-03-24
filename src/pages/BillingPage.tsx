import { useState } from "react";
import AgencyLayout from "@/components/layout/AgencyLayout";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Download, X, Check } from "lucide-react";

const usageBars = [
  { label: "Social Profiles", used: 22, total: 50 },
  { label: "Team Members", used: 6, total: 10 },
  { label: "Competitor Slots", used: 8, total: 20 },
];

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
      <div className="space-y-6 max-w-4xl">
        {/* Current Plan */}
        <div className="card-surface">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-[22px] font-semibold text-foreground">Growth Plan</h2>
              <p className="text-sm text-text-secondary mt-1">Ideal for growing agencies managing multiple brands</p>
            </div>
            <div className="text-right">
              <Button onClick={() => setShowUpgrade(true)}>Upgrade Plan</Button>
              <p className="text-xs text-text-muted mt-2">Next billing date: Jan 1, 2026</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {usageBars.map(bar => (
              <div key={bar.label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-text-secondary">{bar.label}</span>
                  <span className="text-text-muted">{bar.used} of {bar.total} used</span>
                </div>
                <div className="h-2 bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${(bar.used / bar.total) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        <div className="card-surface">
          <h3 className="text-base font-semibold text-foreground mb-4">Payment Method</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-7 bg-elevated rounded flex items-center justify-center text-[10px] font-bold text-text-secondary">VISA</div>
              <div>
                <p className="text-sm text-foreground">Visa ending in 4242</p>
                <p className="text-xs text-text-muted">Expires 12/2027</p>
              </div>
            </div>
            <button className="text-sm text-primary hover:underline">Update</button>
          </div>
        </div>

        {/* Invoices */}
        <div className="card-surface">
          <h3 className="text-base font-semibold text-foreground mb-4">Invoices</h3>
          <table className="w-full">
            <thead><tr className="border-b border-border">
              {['Date', 'Description', 'Amount', 'Status', ''].map(h => (
                <th key={h} className="text-left text-xs text-text-muted font-medium pb-3">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {invoices.map((inv, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  <td className="py-3 text-sm text-text-secondary">{inv.date}</td>
                  <td className="py-3 text-sm text-foreground">{inv.desc}</td>
                  <td className="py-3 text-sm text-foreground">{inv.amount}</td>
                  <td className="py-3"><StatusBadge status={inv.status} /></td>
                  <td className="py-3 text-right"><button className="text-text-muted hover:text-foreground"><Download className="h-4 w-4" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgrade && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50" onClick={() => setShowUpgrade(false)}>
          <div className="w-[640px] bg-elevated border border-border-hover rounded-2xl p-8" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Choose a Plan</h2>
              <button onClick={() => setShowUpgrade(false)} className="text-text-muted hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {plans.map(p => (
                <div key={p.name} className={`p-5 rounded-xl border ${p.current ? 'border-primary' : 'border-border'} relative`}>
                  {p.current && <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] bg-card text-text-muted px-2 rounded-full border border-border">Current</span>}
                  {p.popular && <span className="absolute -top-2.5 right-3 text-[10px] bg-primary text-foreground px-2 rounded-full">Most Popular</span>}
                  <h3 className="text-lg font-semibold text-foreground">{p.name}</h3>
                  <div className="mt-2 mb-4"><span className="text-3xl font-bold text-foreground">{p.price}</span><span className="text-text-muted text-sm">/mo</span></div>
                  <ul className="space-y-2 mb-4">
                    {p.features.map(f => <li key={f} className="text-[13px] text-text-secondary flex items-center gap-1.5"><Check className="h-3 w-3 text-success" />{f}</li>)}
                  </ul>
                  <Button variant={p.current ? 'secondary' : 'default'} className="w-full" size="sm" disabled={p.current}>
                    {p.current ? 'Current Plan' : 'Select Plan'}
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-6 pt-4 border-t border-border">
              <Button variant="secondary" onClick={() => setShowUpgrade(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </AgencyLayout>
  );
};

export default BillingPage;
