import { useState } from "react";
import AgencyLayout from "@/components/layout/AgencyLayout";
import ClientLogo from "@/components/ClientLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Plus,
  Clock,
  FileText,
  History,
  Filter,
  Download,
  CheckCircle2,
  Circle,
  AlertCircle,
  Eye,
  ArrowUpRight,
  Calendar,
  User,
  TrendingUp,
  DollarSign,
  PlayCircle,
  PauseCircle,
} from "lucide-react";
import StatusBadge from "@/components/StatusBadge";

type Tab = "deliverables" | "versions" | "time";

const clients = [
  { id: "all", name: "All clients" },
  { id: "acme", name: "Acme Corp" },
  { id: "techstart", name: "TechStart" },
  { id: "freshbrew", name: "FreshBrew" },
  { id: "stylehaus", name: "StyleHaus" },
];

const deliverables = [
  { id: "d1", title: "March Content Calendar", client: "Acme Corp", owner: "Sarah K.", status: "delivered" as const, due: "Mar 28, 2026", value: "$2,400", progress: 100 },
  { id: "d2", title: "Brand Refresh — Logo & Guidelines", client: "TechStart", owner: "James L.", status: "in-review" as const, due: "Apr 15, 2026", value: "$5,800", progress: 75 },
  { id: "d3", title: "Spring Campaign Creatives (12 posts)", client: "FreshBrew", owner: "Priya M.", status: "in-progress" as const, due: "Apr 22, 2026", value: "$3,200", progress: 40 },
  { id: "d4", title: "Performance Report — Q1", client: "Acme Corp", owner: "Sarah K.", status: "delivered" as const, due: "Apr 5, 2026", value: "$800", progress: 100 },
  { id: "d5", title: "TikTok Strategy Document", client: "StyleHaus", owner: "Alex C.", status: "blocked" as const, due: "Apr 12, 2026", value: "$1,500", progress: 20 },
  { id: "d6", title: "Reels Pack — May (8 reels)", client: "TechStart", owner: "James L.", status: "in-progress" as const, due: "May 10, 2026", value: "$4,000", progress: 25 },
];

const versions = [
  { id: "v1", deliverable: "March Content Calendar", client: "Acme Corp", version: "v3.0", status: "approved" as const, sharedAt: "Mar 26, 2026", sharedBy: "Sarah K.", note: "Final version with client edits incorporated" },
  { id: "v2", deliverable: "March Content Calendar", client: "Acme Corp", version: "v2.0", status: "revisions" as const, sharedAt: "Mar 22, 2026", sharedBy: "Sarah K.", note: "Adjusted hashtag strategy per client feedback" },
  { id: "v3", deliverable: "March Content Calendar", client: "Acme Corp", version: "v1.0", status: "revisions" as const, sharedAt: "Mar 18, 2026", sharedBy: "Sarah K.", note: "Initial draft" },
  { id: "v4", deliverable: "Brand Refresh", client: "TechStart", version: "v2.1", status: "in-review" as const, sharedAt: "Apr 10, 2026", sharedBy: "James L.", note: "Updated color palette options" },
  { id: "v5", deliverable: "Spring Campaign Creatives", client: "FreshBrew", version: "v1.0", status: "in-review" as const, sharedAt: "Apr 8, 2026", sharedBy: "Priya M.", note: "First batch of 4 posts for review" },
];

const timeLogs = [
  { id: "t1", task: "Content writing — March posts", client: "Acme Corp", user: "Sarah K.", duration: "4h 15m", date: "Mar 25, 2026", billable: true, rate: "$85/hr" },
  { id: "t2", task: "Logo iterations", client: "TechStart", user: "James L.", duration: "6h 30m", date: "Apr 9, 2026", billable: true, rate: "$120/hr" },
  { id: "t3", task: "Client call — strategy review", client: "FreshBrew", user: "Priya M.", duration: "1h 00m", date: "Apr 7, 2026", billable: true, rate: "$95/hr" },
  { id: "t4", task: "Internal QA — March calendar", client: "Acme Corp", user: "Alex C.", duration: "0h 45m", date: "Mar 27, 2026", billable: false, rate: "—" },
  { id: "t5", task: "Reels editing — concepts", client: "TechStart", user: "James L.", duration: "3h 20m", date: "Apr 11, 2026", billable: true, rate: "$120/hr" },
  { id: "t6", task: "Spring campaign briefing", client: "FreshBrew", user: "Priya M.", duration: "2h 00m", date: "Apr 4, 2026", billable: true, rate: "$95/hr" },
];

const statusMap = {
  delivered: { label: "Delivered", icon: CheckCircle2, color: "text-success bg-success/10 border-success/20" },
  "in-review": { label: "In review", icon: Eye, color: "text-blue-600 bg-blue-50 border-blue-200" },
  "in-progress": { label: "In progress", icon: Circle, color: "text-primary bg-primary/10 border-primary/20" },
  blocked: { label: "Blocked", icon: AlertCircle, color: "text-warning bg-warning/10 border-warning/20" },
  approved: { label: "Approved", icon: CheckCircle2, color: "text-success bg-success/10 border-success/20" },
  revisions: { label: "Revisions", icon: AlertCircle, color: "text-warning bg-warning/10 border-warning/20" },
};

const AgencyClientBilling = () => {
  const [tab, setTab] = useState<Tab>("deliverables");
  const [client, setClient] = useState("all");
  const [search, setSearch] = useState("");
  const [tracking, setTracking] = useState(false);

  const filterRow = <T extends { client: string }>(rows: T[]) =>
    rows.filter((r) => {
      if (client !== "all" && r.client.toLowerCase().replace(/\s/g, "") !== client) return false;
      if (search) {
        const q = search.toLowerCase();
        const hay = JSON.stringify(r).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

  // Stats
  const totalBillable = timeLogs
    .filter((t) => t.billable)
    .reduce((sum, t) => {
      const [h, m] = t.duration.split(/h|m/).map((s) => parseInt(s.trim()) || 0);
      return sum + h + m / 60;
    }, 0);
  const deliverableValue = deliverables.reduce(
    (s, d) => s + parseFloat(d.value.replace(/[$,]/g, "")),
    0,
  );
  const inProgressCount = deliverables.filter((d) => d.status !== "delivered").length;

  return (
    <AgencyLayout title="Client Billing">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-end gap-2 flex-wrap">
          <Button
            variant={tracking ? "destructive" : "outline"}
            onClick={() => setTracking(!tracking)}
            className="gap-1.5"
          >
            {tracking ? (
              <>
                <PauseCircle className="h-4 w-4" /> Stop tracking · 00:12:34
              </>
            ) : (
              <>
                <PlayCircle className="h-4 w-4" /> Start time tracker
              </>
            )}
          </Button>
          <Button className="gap-1.5 shadow-coral">
            <Plus className="h-4 w-4" /> New deliverable
          </Button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Active deliverables", value: inProgressCount, icon: FileText, color: "text-primary bg-primary/10" },
            { label: "Pipeline value", value: `$${deliverableValue.toLocaleString()}`, icon: DollarSign, color: "text-success bg-success/10" },
            { label: "Billable hours (mo)", value: `${totalBillable.toFixed(1)}h`, icon: Clock, color: "text-blue-600 bg-blue-50" },
            { label: "Versions in review", value: versions.filter((v) => v.status === "in-review").length, icon: TrendingUp, color: "text-warning bg-warning/10" },
          ].map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.color}`}>
                  <s.icon className="h-4 w-4" />
                </div>
              </div>
              <p className="text-xl font-bold text-foreground tabular-nums">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs + filters */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-4">
            <div className="flex">
              {[
                { id: "deliverables" as const, label: "Deliverables", icon: FileText, count: deliverables.length },
                { id: "versions" as const, label: "Version history", icon: History, count: versions.length },
                { id: "time" as const, label: "Time logs", icon: Clock, count: timeLogs.length },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
                    tab === t.id
                      ? "text-primary border-primary"
                      : "text-muted-foreground border-transparent hover:text-foreground"
                  }`}
                >
                  <t.icon className="h-3.5 w-3.5" />
                  {t.label}
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                    {t.count}
                  </span>
                </button>
              ))}
            </div>
            <button className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mr-2">
              <Download className="h-3.5 w-3.5" /> Export
            </button>
          </div>

          <div className="p-3 border-b border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${tab}…`}
                className="pl-9 h-9 bg-background"
              />
            </div>
            <Select value={client} onValueChange={setClient}>
              <SelectTrigger className="h-9 w-full sm:w-[180px]">
                <Filter className="h-3.5 w-3.5 mr-1.5" />
                <SelectValue placeholder="Client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* DELIVERABLES */}
          {tab === "deliverables" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/20">
                    {["Deliverable", "Client", "Owner", "Status", "Progress", "Due", "Value", ""].map((h) => (
                      <th key={h} className="text-left text-[11px] uppercase text-muted-foreground font-medium px-4 py-3 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filterRow(deliverables).map((d) => {
                    const s = statusMap[d.status];
                    return (
                      <tr key={d.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-foreground">{d.title}</p>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <ClientLogo name={d.client} size="xs" rounded="md" />
                            <span className="text-sm text-foreground">{d.client}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{d.owner}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${s.color}`}>
                            <s.icon className="h-3 w-3" />
                            {s.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 min-w-[120px]">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full transition-all"
                                style={{ width: `${d.progress}%` }}
                              />
                            </div>
                            <span className="text-[11px] text-muted-foreground tabular-nums">{d.progress}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">{d.due}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-foreground tabular-nums">{d.value}</td>
                        <td className="px-4 py-3">
                          <button className="text-muted-foreground hover:text-primary transition-colors">
                            <ArrowUpRight className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* VERSIONS */}
          {tab === "versions" && (
            <div className="divide-y divide-border">
              {filterRow(versions).map((v) => {
                const s = statusMap[v.status];
                return (
                  <div key={v.id} className="px-4 py-4 hover:bg-muted/20 transition-colors flex items-start gap-3">
                    <ClientLogo name={v.client} size="sm" rounded="md" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-foreground">{v.deliverable}</p>
                        <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                          {v.version}
                        </span>
                        <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${s.color}`}>
                          <s.icon className="h-3 w-3" />
                          {s.label}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{v.note}</p>
                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-2">
                        <span className="inline-flex items-center gap-1">
                          <User className="h-3 w-3" /> {v.sharedBy}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> Shared {v.sharedAt}
                        </span>
                        <span>· {v.client}</span>
                      </div>
                    </div>
                    <button className="text-xs text-primary hover:underline font-medium shrink-0 inline-flex items-center gap-1">
                      View <ArrowUpRight className="h-3 w-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* TIME LOGS */}
          {tab === "time" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/20">
                    {["Task", "Client", "User", "Duration", "Rate", "Date", "Billable"].map((h) => (
                      <th key={h} className="text-left text-[11px] uppercase text-muted-foreground font-medium px-4 py-3 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filterRow(timeLogs).map((t) => (
                    <tr key={t.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-sm text-foreground font-medium">{t.task}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <ClientLogo name={t.client} size="xs" rounded="md" />
                          <span className="text-sm text-foreground">{t.client}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{t.user}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-foreground tabular-nums">{t.duration}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{t.rate}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">{t.date}</td>
                      <td className="px-4 py-3">
                        {t.billable ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-success/10 text-success border border-success/20">
                            <CheckCircle2 className="h-3 w-3" /> Billable
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                            Non-billable
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AgencyLayout>
  );
};

export default AgencyClientBilling;
