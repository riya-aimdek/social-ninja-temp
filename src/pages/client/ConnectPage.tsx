import { Facebook, Instagram, Linkedin, Twitter, Youtube, ShoppingBag, Image, Check, ExternalLink } from "lucide-react";

const platforms = [
  { name: "Facebook", icon: Facebook, color: "text-facebook", bg: "bg-blue-50", connected: true, profile: "SocialNinja Marketing", lastSync: "2 min ago" },
  { name: "Instagram", icon: Instagram, color: "text-instagram", bg: "bg-pink-50", connected: true, profile: "@socialninja", lastSync: "5 min ago" },
  { name: "LinkedIn", icon: Linkedin, color: "text-linkedin", bg: "bg-sky-50", connected: true, profile: "SocialNinja Inc.", lastSync: "10 min ago" },
  { name: "Twitter / X", icon: Twitter, color: "text-twitter", bg: "bg-gray-50", connected: false, profile: "", lastSync: "" },
  { name: "Pinterest", icon: Image, color: "text-pinterest", bg: "bg-red-50", connected: false, profile: "", lastSync: "" },
  { name: "YouTube", icon: Youtube, color: "text-youtube", bg: "bg-red-50", connected: false, profile: "", lastSync: "" },
  { name: "Shopify", icon: ShoppingBag, color: "text-emerald-600", bg: "bg-emerald-50", connected: false, profile: "", lastSync: "" },
];

export default function ConnectPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Connect Accounts</h1>
        <p className="text-sm text-muted-foreground mt-1">Link your social media profiles to start managing them from one place.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {platforms.map((p) => (
          <div key={p.name} className="bg-card rounded-xl shadow-card p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl ${p.bg} flex items-center justify-center`}>
                <p.icon className={`w-5 h-5 ${p.color}`} />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">{p.name}</p>
                {p.connected && <p className="text-[11px] text-muted-foreground">{p.profile}</p>}
              </div>
            </div>

            {p.connected ? (
              <div className="mt-auto space-y-3">
                <div className="flex items-center gap-2">
                  <span className="badge-active text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                    <Check className="w-3 h-3" /> Connected
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">Last synced: {p.lastSync}</p>
                <div className="flex gap-2">
                  <button className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" /> View
                  </button>
                  <button className="text-xs text-destructive hover:underline">Disconnect</button>
                </div>
              </div>
            ) : (
              <div className="mt-auto">
                <button className="w-full py-2 rounded-lg gradient-coral text-primary-foreground text-sm font-medium shadow-coral hover:opacity-90 active:scale-[0.98] transition-all">
                  Connect
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
