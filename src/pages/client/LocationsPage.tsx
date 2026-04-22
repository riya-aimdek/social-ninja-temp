import { MapPin, Check, AlertCircle, Star, Phone, Navigation, Eye, Plus } from "lucide-react";

const locations = [
  { name: "SocialNinja HQ", address: "123 Market St, San Francisco, CA", platforms: 4, verified: true, lastUpdated: "2h ago", rating: 4.8, reviews: 124 },
  { name: "SocialNinja NYC", address: "456 Broadway, New York, NY", platforms: 3, verified: true, lastUpdated: "1d ago", rating: 4.6, reviews: 89 },
  { name: "SocialNinja London", address: "78 Oxford St, London, UK", platforms: 2, verified: false, lastUpdated: "3d ago", rating: 4.2, reviews: 45 },
  { name: "SocialNinja Tokyo", address: "5-1 Shibuya, Tokyo, JP", platforms: 3, verified: true, lastUpdated: "5h ago", rating: 4.9, reviews: 67 },
];

const insights = [
  { label: "Total Views", value: "24.5K", icon: Eye },
  { label: "Direction Requests", value: "1,234", icon: Navigation },
  { label: "Phone Calls", value: "567", icon: Phone },
  { label: "Avg Rating", value: "4.6", icon: Star },
];

export default function LocationsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-end">
        <button className="px-4 py-2 rounded-lg gradient-coral text-primary-foreground text-sm font-medium shadow-coral hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Location
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {insights.map((ins) => (
          <div key={ins.label} className="bg-card rounded-xl shadow-card p-4">
            <ins.icon className="w-4 h-4 text-primary mb-2" />
            <p className="text-2xl font-bold tracking-tighter text-foreground tabular-nums">{ins.value}</p>
            <p className="text-[11px] text-muted-foreground">{ins.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl shadow-card p-3 flex items-center gap-3 flex-wrap">
        <button className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-accent transition-colors">Select All</button>
        <button className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-accent transition-colors">Edit Hours</button>
        <button className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-accent transition-colors">Update Photos</button>
        <button className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-accent transition-colors">Publish Post</button>
      </div>

      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted-foreground border-b border-border">
              <th className="px-5 py-3 font-medium">Location</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-center">Platforms</th>
              <th className="px-5 py-3 font-medium text-right">Rating</th>
              <th className="px-5 py-3 font-medium text-right">Reviews</th>
              <th className="px-5 py-3 font-medium text-right">Updated</th>
            </tr>
          </thead>
          <tbody>
            {locations.map((loc) => (
              <tr key={loc.name} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors cursor-pointer">
                <td className="px-5 py-3">
                  <p className="font-medium text-foreground">{loc.name}</p>
                  <p className="text-[11px] text-muted-foreground">{loc.address}</p>
                </td>
                <td className="px-5 py-3">
                  {loc.verified ? (
                    <span className="badge-active text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 w-fit">
                      <Check className="w-3 h-3" /> Verified
                    </span>
                  ) : (
                    <span className="badge-scheduled text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 w-fit">
                      <AlertCircle className="w-3 h-3" /> Pending
                    </span>
                  )}
                </td>
                <td className="px-5 py-3 text-center tabular-nums text-muted-foreground">{loc.platforms}</td>
                <td className="px-5 py-3 text-right">
                  <span className="flex items-center justify-end gap-1 text-foreground font-medium">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {loc.rating}
                  </span>
                </td>
                <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">{loc.reviews}</td>
                <td className="px-5 py-3 text-right text-xs text-muted-foreground">{loc.lastUpdated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
