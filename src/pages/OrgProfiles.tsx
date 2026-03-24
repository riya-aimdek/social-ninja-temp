import OrgLayout from "@/components/layout/OrgLayout";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw, ExternalLink } from "lucide-react";

const profiles = [
  { platform: "Instagram", handle: "@retailco_official", followers: "24.5K", status: "connected", lastSync: "10 min ago", posts: 142 },
  { platform: "Twitter/X", handle: "@RetailCo", followers: "18.2K", status: "connected", lastSync: "15 min ago", posts: 89 },
  { platform: "Facebook", handle: "RetailCo Page", followers: "52.1K", status: "connected", lastSync: "20 min ago", posts: 234 },
  { platform: "LinkedIn", handle: "RetailCo Inc.", followers: "8.7K", status: "reconnect", lastSync: "3 days ago", posts: 56 },
  { platform: "TikTok", handle: "@retailco", followers: "12.3K", status: "connected", lastSync: "5 min ago", posts: 67 },
];

const OrgProfiles = () => {
  return (
    <OrgLayout title="Social Profiles">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">5 of 8 profile slots used</p>
          <Button><Plus className="h-4 w-4" /> Connect Profile</Button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {profiles.map(p => (
            <div key={p.handle} className="card-surface flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-lg font-bold text-muted-foreground">
                  {p.platform[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{p.handle}</p>
                    <span className="text-xs text-muted-foreground">· {p.platform}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                    <span>{p.followers} followers</span>
                    <span>{p.posts} posts</span>
                    <span>Last sync: {p.lastSync}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {p.status === "connected" ? (
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Connected</span>
                ) : (
                  <button className="text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <RefreshCw className="h-3 w-3" /> Reconnect
                  </button>
                )}
                <button className="text-muted-foreground hover:text-foreground">
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </OrgLayout>
  );
};

export default OrgProfiles;
