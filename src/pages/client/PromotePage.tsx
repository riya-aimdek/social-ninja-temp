import { useState } from "react";
import {
  Megaphone, Target, DollarSign, Eye, MousePointer, Facebook, Instagram, Linkedin,
  Handshake, Plus, ExternalLink, Mail, CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const postsToBoost = [
  { platform: "Instagram", caption: "🚀 New AI feature launch!", engagement: "4.7%", likes: 567, img: "🖼️" },
  { platform: "Facebook", caption: "5 tips to boost engagement", engagement: "3.2%", likes: 342, img: "📊" },
  { platform: "Instagram", caption: "Behind the scenes at HQ", engagement: "5.1%", likes: 234, img: "📸" },
  { platform: "Facebook", caption: "Product update announcement", engagement: "2.8%", likes: 189, img: "📢" },
];

const activeBoosts = [
  { name: "AI Feature Launch", platform: "Instagram", status: "Active", spend: "$45.20", impressions: "12.4K", ctr: "3.2%" },
  { name: "Engagement Tips", platform: "Facebook", status: "Active", spend: "$32.80", impressions: "8.9K", ctr: "2.8%" },
  { name: "Hiring Post", platform: "LinkedIn", status: "Completed", spend: "$50.00", impressions: "15.2K", ctr: "4.1%" },
  { name: "Q1 Results", platform: "Facebook", status: "Paused", spend: "$18.50", impressions: "5.1K", ctr: "1.9%" },
];

const statusStyles: Record<string, string> = {
  Active: "bg-success/15 text-success",
  Completed: "bg-info/15 text-info",
  Paused: "bg-muted text-muted-foreground",
};

const goals = [
  { icon: Eye, label: "Engagement" },
  { icon: MousePointer, label: "Website Visits" },
  { icon: Target, label: "Leads" },
  { icon: DollarSign, label: "Conversions" },
];

// ---------- Ad partnerships ----------
interface AdPartner {
  id: string;
  name: string;
  type: "Influencer" | "Publisher" | "Affiliate" | "Co-marketing";
  audience: string;
  rate: string;
  reachEstimate: string;
  status: "Pitched" | "Negotiating" | "Active" | "Completed";
  contact: string;
  logo: string;
}

const initialPartners: AdPartner[] = [
  { id: "p1", name: "Jessica Martinez", type: "Influencer", audience: "245K · DTC fashion", rate: "$1,200 / post", reachEstimate: "~80K", status: "Active", contact: "jess@martinez.co", logo: "JM" },
  { id: "p2", name: "TechCrunch Sponsored", type: "Publisher", audience: "12M · B2B SaaS", rate: "$8,500 / article", reachEstimate: "~250K", status: "Negotiating", contact: "ads@techcrunch.com", logo: "TC" },
  { id: "p3", name: "Refer & Earn Network", type: "Affiliate", audience: "Performance · CPL", rate: "20% rev share", reachEstimate: "Variable", status: "Active", contact: "partners@refer.io", logo: "RE" },
  { id: "p4", name: "BrandX Co-marketing", type: "Co-marketing", audience: "Mutual audience swap", rate: "Barter", reachEstimate: "~45K", status: "Pitched", contact: "growth@brandx.com", logo: "BX" },
  { id: "p5", name: "Tom Nguyen", type: "Influencer", audience: "95K · creators", rate: "$650 / reel", reachEstimate: "~28K", status: "Completed", contact: "tom@ng.media", logo: "TN" },
];

const partnerStatusStyle: Record<AdPartner["status"], string> = {
  Pitched: "bg-muted text-muted-foreground",
  Negotiating: "bg-warning/15 text-warning",
  Active: "bg-success/15 text-success",
  Completed: "bg-info/15 text-info",
};

const partnerSummary = (partners: AdPartner[]) => ({
  active: partners.filter((p) => p.status === "Active").length,
  pipeline: partners.filter((p) => p.status === "Pitched" || p.status === "Negotiating").length,
  spend: "$10,350",
  reach: "~403K",
});

export default function PromotePage() {
  const [partners, setPartners] = useState<AdPartner[]>(initialPartners);
  const [newOpen, setNewOpen] = useState(false);
  const [draft, setDraft] = useState({ name: "", type: "Influencer" as AdPartner["type"], audience: "", rate: "", contact: "" });
  const summary = partnerSummary(partners);

  const addPartner = () => {
    if (!draft.name || !draft.contact) return toast.error("Add a name and contact");
    setPartners([
      {
        id: `p${Date.now()}`,
        name: draft.name,
        type: draft.type,
        audience: draft.audience || "—",
        rate: draft.rate || "TBD",
        reachEstimate: "TBD",
        status: "Pitched",
        contact: draft.contact,
        logo: draft.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase(),
      },
      ...partners,
    ]);
    setNewOpen(false);
    setDraft({ name: "", type: "Influencer", audience: "", rate: "", contact: "" });
    toast.success("Partner added to pipeline");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
          <Megaphone className="w-6 h-6 text-primary" /> Promote
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Boost organic posts, run paid campaigns, and manage ad partnerships.</p>
      </div>

      <Tabs defaultValue="boost">
        <TabsList>
          <TabsTrigger value="boost">Boost & campaigns</TabsTrigger>
          <TabsTrigger value="partnerships">Ad partnerships</TabsTrigger>
        </TabsList>

        <TabsContent value="boost" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {postsToBoost.map((post, i) => (
              <div key={i} className="bg-card rounded-xl shadow-card p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                <div className="w-full h-28 bg-accent rounded-lg flex items-center justify-center text-3xl mb-3">{post.img}</div>
                <div className="flex items-center gap-2 mb-2">
                  {post.platform === "Instagram"
                    ? <Instagram className="w-3.5 h-3.5 text-instagram" />
                    : <Facebook className="w-3.5 h-3.5 text-facebook" />}
                  <span className="text-xs text-muted-foreground">{post.engagement} engagement</span>
                </div>
                <p className="text-sm text-foreground font-medium truncate mb-3">{post.caption}</p>
                <Button size="sm" className="w-full">Boost This</Button>
              </div>
            ))}
          </div>

          <div className="bg-card rounded-xl shadow-card p-5">
            <h2 className="text-sm font-semibold text-foreground mb-4">Select Campaign Goal</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {goals.map((g) => (
                <button key={g.label} className="p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all text-center">
                  <g.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-xs font-medium text-foreground">{g.label}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-xl shadow-card overflow-hidden">
            <div className="p-5 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">Active Boosts</h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground border-b border-border">
                  <th className="px-5 py-3 font-medium">Campaign</th>
                  <th className="px-5 py-3 font-medium">Platform</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Spend</th>
                  <th className="px-5 py-3 font-medium text-right">Impressions</th>
                  <th className="px-5 py-3 font-medium text-right">CTR</th>
                </tr>
              </thead>
              <tbody>
                {activeBoosts.map((b, i) => (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                    <td className="px-5 py-3 font-medium text-foreground">{b.name}</td>
                    <td className="px-5 py-3 text-muted-foreground text-xs">{b.platform}</td>
                    <td className="px-5 py-3">
                      <span className={cn("text-xs px-2 py-1 rounded-full font-medium", statusStyles[b.status])}>{b.status}</span>
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums text-foreground">{b.spend}</td>
                    <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">{b.impressions}</td>
                    <td className="px-5 py-3 text-right tabular-nums text-foreground font-medium">{b.ctr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* PARTNERSHIPS */}
        <TabsContent value="partnerships" className="space-y-6 mt-6">
          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { I: CheckCircle2, label: "Active partners", value: summary.active, tone: "text-success bg-success/10" },
              { I: Handshake, label: "In pipeline", value: summary.pipeline, tone: "text-warning bg-warning/10" },
              { I: DollarSign, label: "Spend this month", value: summary.spend, tone: "text-primary bg-primary/10" },
              { I: Eye, label: "Estimated reach", value: summary.reach, tone: "text-info bg-info/10" },
            ].map((s) => (
              <div key={s.label} className="bg-card rounded-xl border border-border p-4">
                <div className="flex items-center justify-between">
                  <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", s.tone)}>
                    <s.I className="w-4 h-4" />
                  </div>
                  <span className="text-2xl font-bold text-foreground tabular-nums">{s.value}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-2">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-foreground">Partnership pipeline</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Track influencer, publisher, affiliate, and co-marketing deals.</p>
            </div>
            <Dialog open={newOpen} onOpenChange={setNewOpen}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="w-3.5 h-3.5" /> Add partner</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Add ad partner</DialogTitle></DialogHeader>
                <div className="space-y-3 py-2">
                  <div>
                    <Label>Partner name</Label>
                    <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="e.g. Jessica Martinez" />
                  </div>
                  <div>
                    <Label>Type</Label>
                    <select
                      value={draft.type}
                      onChange={(e) => setDraft({ ...draft, type: e.target.value as AdPartner["type"] })}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm"
                    >
                      <option>Influencer</option>
                      <option>Publisher</option>
                      <option>Affiliate</option>
                      <option>Co-marketing</option>
                    </select>
                  </div>
                  <div>
                    <Label>Audience description</Label>
                    <Input value={draft.audience} onChange={(e) => setDraft({ ...draft, audience: e.target.value })} placeholder="e.g. 245K · DTC fashion" />
                  </div>
                  <div>
                    <Label>Rate</Label>
                    <Input value={draft.rate} onChange={(e) => setDraft({ ...draft, rate: e.target.value })} placeholder="e.g. $1,200 / post" />
                  </div>
                  <div>
                    <Label>Contact email</Label>
                    <Input value={draft.contact} onChange={(e) => setDraft({ ...draft, contact: e.target.value })} placeholder="contact@example.com" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setNewOpen(false)}>Cancel</Button>
                  <Button onClick={addPartner}>Add to pipeline</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {partners.map((p) => (
              <div key={p.id} className="bg-card border border-border rounded-xl p-4 hover:border-border-hover transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-xs font-bold text-primary-foreground">
                    {p.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-foreground truncate">{p.name}</div>
                    <div className="text-[11px] text-muted-foreground">{p.type}</div>
                  </div>
                  <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", partnerStatusStyle[p.status])}>{p.status}</span>
                </div>
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  <div><span className="text-foreground font-medium">Audience:</span> {p.audience}</div>
                  <div><span className="text-foreground font-medium">Rate:</span> {p.rate}</div>
                  <div><span className="text-foreground font-medium">Reach:</span> {p.reachEstimate}</div>
                </div>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                  <a href={`mailto:${p.contact}`} className="text-[11px] text-muted-foreground hover:text-primary inline-flex items-center gap-1 truncate">
                    <Mail className="w-3 h-3" /> {p.contact}
                  </a>
                  <select
                    value={p.status}
                    onChange={(e) => setPartners(partners.map((x) => x.id === p.id ? { ...x, status: e.target.value as AdPartner["status"] } : x))}
                    className="ml-auto text-[11px] px-2 py-1 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option>Pitched</option><option>Negotiating</option><option>Active</option><option>Completed</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
