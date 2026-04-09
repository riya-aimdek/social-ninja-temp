import { Users, FileText, Clock, Link2 } from "lucide-react";
import OnboardingWidget from "@/components/OnboardingWidget";

const statCards = [
  { label: "Team Members", value: "0", icon: Users, iconBg: "bg-primary/10", iconColor: "text-primary" },
  { label: "Scheduled Posts", value: "0", icon: FileText, iconBg: "bg-primary/10", iconColor: "text-primary" },
  { label: "Pending Approvals", value: "0", icon: Clock, iconBg: "bg-primary/10", iconColor: "text-primary" },
  { label: "Connected Accounts", value: "0", icon: Link2, iconBg: "bg-primary/10", iconColor: "text-primary" },
];

export default function ClientDashboardPage() {
  return (
    <div className="flex gap-6 animate-fade-in">
      {/* Main dashboard content */}
      <div className="flex-1 space-y-6 min-w-0">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <div key={card.label} className="bg-card rounded-xl border border-border p-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <p className="text-3xl font-bold text-foreground mt-1">{card.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                <card.icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Team Members Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-5 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Team Members</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground uppercase tracking-wider border-b border-border">
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Role</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Last Active</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-muted-foreground">
                    No records found
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Onboarding widget */}
      <OnboardingWidget />
    </div>
  );
}
