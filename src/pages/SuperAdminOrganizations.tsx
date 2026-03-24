import SuperAdminLayout from "@/components/layout/SuperAdminLayout";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MoreHorizontal, Building } from "lucide-react";
import { useState } from "react";

const orgs = [
  { name: "RetailCo", agency: "Digital Spark Agency", users: 12, plan: "Growth", status: "active" as const, type: "Agency" },
  { name: "FashionHub", agency: "Digital Spark Agency", users: 8, plan: "Starter", status: "active" as const, type: "Agency" },
  { name: "TechStart", agency: "CreativeFlow Media", users: 15, plan: "Enterprise", status: "active" as const, type: "Agency" },
  { name: "LocalBites", agency: "—", users: 8, plan: "Starter", status: "active" as const, type: "Standalone" },
  { name: "FitnessPro", agency: "—", users: 14, plan: "Growth", status: "active" as const, type: "Standalone" },
  { name: "ArtHaven", agency: "—", users: 3, plan: "Starter", status: "pending" as const, type: "Standalone" },
  { name: "GreenLeaf", agency: "BrandWave Digital", users: 6, plan: "Growth", status: "suspended" as const, type: "Agency" },
  { name: "SaaSInc", agency: "PixelForge Studio", users: 22, plan: "Enterprise", status: "active" as const, type: "Agency" },
];

const SuperAdminOrganizations = () => {
  const [search, setSearch] = useState("");
  const filtered = orgs.filter(o => o.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <SuperAdminLayout title="Organizations">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search organizations..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building className="h-4 w-4" />
            <span>{orgs.length} total organizations</span>
          </div>
        </div>

        <div className="card-surface">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {["Organization", "Type", "Agency", "Users", "Plan", "Status", ""].map(h => (
                  <th key={h} className="text-left text-xs text-muted-foreground font-medium pb-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.name} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="py-3 text-sm text-foreground font-medium">{o.name}</td>
                  <td className="py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${o.type === "Standalone" ? "bg-orange-100 text-orange-700" : "bg-teal-100 text-teal-700"}`}>
                      {o.type}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-muted-foreground">{o.agency}</td>
                  <td className="py-3 text-sm text-muted-foreground">{o.users}</td>
                  <td className="py-3 text-sm text-muted-foreground">{o.plan}</td>
                  <td className="py-3"><StatusBadge status={o.status} /></td>
                  <td className="py-3 text-right">
                    <button className="text-muted-foreground hover:text-foreground"><MoreHorizontal className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default SuperAdminOrganizations;
