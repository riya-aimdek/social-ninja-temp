import { useState } from "react";
import {
  Facebook, Instagram, Linkedin, Twitter, Youtube, ShoppingBag, Image,
  Check, ExternalLink, Clock, RefreshCw, LogOut, Trash2, Plus,
  Search, Wifi, WifiOff, AlertCircle, X, Users, FileText,
  ChevronLeft, CheckCircle2, Link2, Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { socialAccounts } from "@/data/businessMockData";
import type { SocialAccount } from "@/data/businessMockData";

// ── Platform meta ──────────────────────────────────────────────
const platformMeta: Record<string, {
  icon: typeof Facebook;
  color: string;
  bg: string;
  label: string;
}> = {
  "Facebook":    { icon: Facebook,    color: "text-blue-600",    bg: "bg-blue-50 dark:bg-blue-950/40",       label: "Facebook Profile"  },
  "Instagram":   { icon: Instagram,   color: "text-pink-500",    bg: "bg-pink-50 dark:bg-pink-950/40",       label: "Instagram Profile" },
  "LinkedIn":    { icon: Linkedin,    color: "text-blue-700",    bg: "bg-sky-50 dark:bg-sky-950/40",         label: "LinkedIn Profile"  },
  "Twitter / X": { icon: Twitter,     color: "text-sky-500",     bg: "bg-sky-50 dark:bg-sky-950/40",         label: "Twitter/X Profile" },
  "Pinterest":   { icon: Image,       color: "text-red-500",     bg: "bg-red-50 dark:bg-red-950/40",         label: "Pinterest Profile" },
  "YouTube":     { icon: Youtube,     color: "text-red-600",     bg: "bg-red-50 dark:bg-red-950/40",         label: "YouTube Channel"   },
  "Shopify":     { icon: ShoppingBag, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/40", label: "Shopify Store"     },
};

// ── Available channel definitions for the Connect flow ─────────
type Category = "All" | "Social Media" | "E-Commerce" | "Video" | "Visual";

const availableChannels: {
  id: string;
  name: string;
  accountType: string;
  description: string;
  icon: typeof Facebook;
  iconBg: string;
  iconColor: string;
  category: Category;
}[] = [
  {
    id: "twitter",   name: "Twitter / X",   accountType: "Twitter Profile",
    description: "Connect your Twitter profile to schedule tweets and analyze engagement.",
    icon: Twitter,     iconBg: "bg-sky-100",      iconColor: "text-sky-500",    category: "Social Media",
  },
  {
    id: "linkedin",  name: "LinkedIn",      accountType: "LinkedIn Page / Profile",
    description: "Connect your LinkedIn page or profile to publish content and track professional engagement.",
    icon: Linkedin,    iconBg: "bg-blue-100",     iconColor: "text-blue-700",   category: "Social Media",
  },
  {
    id: "instagram", name: "Instagram",     accountType: "Instagram Business Account",
    description: "Connect your Instagram business account to schedule posts and analyze engagement.",
    icon: Instagram,   iconBg: "bg-pink-100",     iconColor: "text-pink-500",   category: "Social Media",
  },
  {
    id: "facebook",  name: "Facebook",      accountType: "Facebook Page / Group",
    description: "Connect your Facebook page or group to publish content and engage with your audience.",
    icon: Facebook,    iconBg: "bg-blue-100",     iconColor: "text-blue-600",   category: "Social Media",
  },
  {
    id: "pinterest", name: "Pinterest",     accountType: "Pinterest Business",
    description: "Connect your Pinterest business account to schedule pins and analyze traffic.",
    icon: Image,       iconBg: "bg-red-100",      iconColor: "text-red-500",    category: "Visual",
  },
  {
    id: "youtube",   name: "YouTube",       accountType: "YouTube Channel",
    description: "Connect your YouTube channel to manage video content and track performance.",
    icon: Youtube,     iconBg: "bg-red-100",      iconColor: "text-red-600",    category: "Video",
  },
  {
    id: "shopify",   name: "Shopify",       accountType: "Shopify Store",
    description: "Connect your Shopify store to integrate product information and track conversions.",
    icon: ShoppingBag, iconBg: "bg-emerald-100",  iconColor: "text-emerald-600", category: "E-Commerce",
  },
];

const CATEGORIES: Category[] = ["All", "Social Media", "E-Commerce", "Visual", "Video"];

// ── Shared action button ───────────────────────────────────────
function ActionBtn({
  icon: Icon, label, onClick, active, variant = "default",
}: {
  icon: typeof ExternalLink;
  label: string;
  onClick?: () => void;
  active?: boolean;
  variant?: "default" | "warning" | "danger" | "primary";
}) {
  const cls = {
    default: "text-muted-foreground hover:text-foreground hover:bg-muted",
    warning: active ? "bg-amber-100 text-amber-600 dark:bg-amber-950/60" : "text-muted-foreground hover:text-amber-600 hover:bg-amber-50",
    danger:  active ? "bg-red-100 text-red-600 dark:bg-red-950/60"       : "text-muted-foreground hover:text-red-500 hover:bg-red-50",
    primary: active ? "bg-primary/10 text-primary"                       : "text-muted-foreground hover:text-primary hover:bg-primary/10",
  }[variant];
  return (
    <button aria-label={label} title={label} onClick={onClick}
      className={cn("w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0", cls)}>
      <Icon className="w-3.5 h-3.5" />
    </button>
  );
}

// ── Connect New Channel view ───────────────────────────────────
function ConnectNewChannelView({
  onBack,
  onConnect,
  connectedNames,
}: {
  onBack: () => void;
  onConnect: (name: string) => void;
  connectedNames: Set<string>;
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category>("All");
  const [connecting, setConnecting] = useState<string | null>(null);

  const filtered = availableChannels.filter(ch => {
    const matchSearch = !search ||
      ch.name.toLowerCase().includes(search.toLowerCase()) ||
      ch.accountType.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || ch.category === category;
    return matchSearch && matchCat;
  });

  function handleConnect(ch: typeof availableChannels[0]) {
    setConnecting(ch.id);
    setTimeout(() => {
      onConnect(ch.name);
      setConnecting(null);
      onBack();
    }, 900);
  }

  return (
    <div className="animate-fade-in">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground">Connect to Social Network</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Connect your social media accounts to schedule posts and analyze engagement.
        </p>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
          {/* Panel header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Connect New Channel</h2>
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Back To Channels
            </button>
          </div>

          {/* Search + category */}
          <div className="flex items-center gap-3 px-5 pt-4 pb-3 flex-wrap">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search channels..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-border bg-background outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as Category)}
              className="px-3 py-2 text-sm rounded-lg border border-border bg-background outline-none focus:border-primary/50 transition-colors"
            >
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          {/* Help text */}
          <div className="mx-5 mb-4 px-4 py-3 bg-primary/5 border border-primary/15 rounded-lg text-xs text-muted-foreground">
            Looking for step-by-step instructions? Visit our{" "}
            <button onClick={() => toast.info("Help Center coming soon.")} className="text-primary font-medium hover:underline">Help Center</button>
            {" "}to read our Getting Started guides and learn about supported channel types.
          </div>

          {/* Channel cards grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-5 pb-5">
              {filtered.map(ch => {
                const isConnected = connectedNames.has(ch.name);
                const isConnecting = connecting === ch.id;
                return (
                  <div
                    key={ch.id}
                    className={cn(
                      "rounded-xl border p-5 flex flex-col items-center text-center gap-3 transition-all",
                      isConnected
                        ? "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20"
                        : "border-border hover:border-primary/30 hover:shadow-sm",
                    )}
                  >
                    {/* Icon */}
                    <div className={cn("w-14 h-14 rounded-full flex items-center justify-center", ch.iconBg)}>
                      <ch.icon className={cn("w-7 h-7", ch.iconColor)} />
                    </div>

                    {/* Name + description */}
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">{ch.accountType}</p>
                      <p className="text-[11px] text-muted-foreground leading-snug">{ch.description}</p>
                    </div>

                    {/* Action */}
                    {isConnected ? (
                      <span className="text-xs font-semibold text-green-600 flex items-center gap-1.5 mt-auto">
                        <Check className="w-3.5 h-3.5" /> Connected
                      </span>
                    ) : (
                      <button
                        onClick={() => handleConnect(ch)}
                        disabled={isConnecting}
                        className={cn(
                          "mt-auto w-full py-2 rounded-lg border-2 border-primary text-primary text-xs font-bold uppercase tracking-wide transition-all",
                          isConnecting
                            ? "opacity-60 cursor-not-allowed"
                            : "hover:bg-primary hover:text-primary-foreground",
                        )}
                      >
                        {isConnecting ? "Connecting…" : "Connect"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground text-sm px-5 pb-5">
              No channels match your search.
            </div>
          )}
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────
type FilterTab = "all" | "connected" | "available";

export default function ConnectPage() {
  const [accounts, setAccounts] = useState<SocialAccount[]>(socialAccounts);
  const [showConnect, setShowConnect]         = useState(false);
  const [search, setSearch]                   = useState("");
  const [filter, setFilter]                   = useState<FilterTab>("all");
  const [confirmDisconnect, setConfirmDisconnect] = useState<string | null>(null);
  const [confirmRemove, setConfirmRemove]         = useState<string | null>(null);
  const [queueOpen, setQueueOpen]                 = useState<string | null>(null);
  const [queueDraft, setQueueDraft]               = useState<Record<string, string>>({});

  const connected = accounts.filter(a =>  a.connected);
  const available = accounts.filter(a => !a.connected);

  const connectedNames = new Set(connected.map(a => a.name));

  const visibleAccounts = accounts.filter(a => {
    const matchSearch = !search ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.profile.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" ? true : filter === "connected" ? a.connected : !a.connected;
    return matchSearch && matchFilter;
  });

  const connectedVisible = visibleAccounts.filter(a =>  a.connected);
  const availableVisible = visibleAccounts.filter(a => !a.connected);

  function disconnect(id: string) {
    setAccounts(prev => prev.map(a => a.id === id ? { ...a, connected: false, lastSync: "" } : a));
    setConfirmDisconnect(null);
  }

  function reconnect(id: string) {
    setAccounts(prev => prev.map(a => a.id === id ? { ...a, connected: true, lastSync: "Just now" } : a));
  }

  function remove(id: string) {
    setAccounts(prev => prev.filter(a => a.id !== id));
    setConfirmRemove(null);
  }

  function saveQueue(id: string) {
    const val = queueDraft[id];
    if (val !== undefined) {
      setAccounts(prev => prev.map(a => a.id === id ? { ...a, queueTime: val } : a));
    }
    setQueueOpen(null);
  }

  function handleNewConnect(name: string) {
    setAccounts(prev => prev.map(a =>
      a.name === name ? { ...a, connected: true, lastSync: "Just now" } : a
    ));
  }

  // ── Connect New Channel view ───────────────────────────────
  if (showConnect) {
    return (
      <ConnectNewChannelView
        onBack={() => setShowConnect(false)}
        onConnect={handleNewConnect}
        connectedNames={connectedNames}
      />
    );
  }

  // ── Main accounts view ─────────────────────────────────────
  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">Social Profiles</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your connected social accounts</p>
        </div>
        <Button
          onClick={() => setShowConnect(true)}
          className="gradient-coral text-primary-foreground shadow-coral hover:opacity-90"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Connect Account
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card border border-border rounded-xl px-4 py-3.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4.5 h-4.5 text-success" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground leading-none">{connected.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Connected</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl px-4 py-3.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
            <Link2 className="w-4.5 h-4.5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground leading-none">{available.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Available</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl px-4 py-3.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Globe className="w-4.5 h-4.5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground leading-none">{accounts.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Total Platforms</p>
          </div>
        </div>
      </div>

      {/* Search + filter tabs */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search accounts..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-border bg-card outline-none focus:border-primary/50 transition-colors"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="flex items-center border border-border rounded-lg overflow-hidden shrink-0">
          {([
            { key: "all",       label: `All (${accounts.length})`        },
            { key: "connected", label: `Connected (${connected.length})` },
            { key: "available", label: `Available (${available.length})` },
          ] as { key: FilterTab; label: string }[]).map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={cn(
                "px-3 py-2 text-xs font-medium transition-colors",
                filter === tab.key
                  ? "bg-foreground text-background"
                  : "bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Connected accounts */}
      {connectedVisible.length > 0 && (
        <div className="space-y-2.5">
          {filter === "all" && (
            <div className="flex items-center gap-2 mb-1">
              <Wifi className="w-3.5 h-3.5 text-green-500" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Connected Accounts</span>
            </div>
          )}

          {connectedVisible.map(acct => {
            const meta = platformMeta[acct.name] ?? { icon: Image, color: "text-muted-foreground", bg: "bg-muted", label: "Profile" };
            const Icon = meta.icon;
            const isDisconnecting = confirmDisconnect === acct.id;
            const isRemoving      = confirmRemove    === acct.id;
            const isQueueOpen     = queueOpen        === acct.id;

            return (
              <div
                key={acct.id}
                className={cn(
                  "bg-card rounded-xl border transition-all",
                  isDisconnecting ? "border-amber-300 dark:border-amber-700"
                  : isRemoving    ? "border-red-300 dark:border-red-700"
                  : "border-border hover:border-primary/30 hover:shadow-sm",
                )}
              >
                {/* Main row */}
                <div className="flex items-center gap-4 px-4 py-3.5">
                  <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />

                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", meta.bg)}>
                    <Icon className={cn("w-5 h-5", meta.color)} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-foreground leading-none">{acct.profile || acct.name}</span>
                      <span className="text-[10px] font-medium bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-400 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="w-2.5 h-2.5" /> Connected
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-xs text-muted-foreground">{meta.label}</span>
                      {acct.lastSync && (
                        <>
                          <span className="text-muted-foreground/30">·</span>
                          <span className="text-xs text-muted-foreground">Synced {acct.lastSync}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {acct.followers && (
                    <div className="hidden md:flex items-center gap-5 shrink-0 mr-2">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Users className="w-3.5 h-3.5" />
                        <span className="font-semibold text-foreground">{acct.followers}</span>
                        <span>followers</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <FileText className="w-3.5 h-3.5" />
                        <span className="font-semibold text-foreground">{acct.postsCount}</span>
                        <span>posts</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-0.5 shrink-0">
                    <ActionBtn icon={ExternalLink} label="View Profile"    variant="default" onClick={() => toast.info(`Opening ${acct.handle} profile...`)} />
                    <ActionBtn
                      icon={Clock}      label="Manage Queue Time"
                      variant="primary" active={isQueueOpen}
                      onClick={() => { setQueueOpen(isQueueOpen ? null : acct.id); setConfirmDisconnect(null); setConfirmRemove(null); }}
                    />
                    <ActionBtn
                      icon={RefreshCw}  label="Reconnect"
                      variant="default"
                      onClick={() => reconnect(acct.id)}
                    />
                    <span className="w-px h-4 bg-border mx-1" />
                    <ActionBtn
                      icon={LogOut}     label="Disconnect"
                      variant="warning" active={isDisconnecting}
                      onClick={() => { setConfirmDisconnect(isDisconnecting ? null : acct.id); setConfirmRemove(null); setQueueOpen(null); }}
                    />
                    <ActionBtn
                      icon={Trash2}     label="Remove Channel"
                      variant="danger"  active={isRemoving}
                      onClick={() => { setConfirmRemove(isRemoving ? null : acct.id); setConfirmDisconnect(null); setQueueOpen(null); }}
                    />
                  </div>
                </div>

                {/* Queue time editor */}
                {isQueueOpen && (
                  <div className="border-t border-border px-4 py-3 bg-muted/30 rounded-b-xl">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        <span className="text-xs font-semibold text-foreground">Queue Posting Window</span>
                        {acct.queueTime && (
                          <span className="text-xs text-muted-foreground">
                            Currently: <span className="font-medium text-foreground">{acct.queueTime}</span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          defaultValue={acct.queueTime}
                          onChange={e => setQueueDraft(prev => ({ ...prev, [acct.id]: e.target.value }))}
                          placeholder="e.g. 9:00 AM – 11:00 AM"
                          className="text-xs px-3 py-1.5 rounded-lg border border-border bg-card outline-none focus:border-primary/50 w-48"
                        />
                        <Button size="sm" onClick={() => saveQueue(acct.id)}>Save</Button>
                        <button onClick={() => setQueueOpen(null)} className="text-muted-foreground hover:text-foreground transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Disconnect confirmation */}
                {isDisconnecting && (
                  <div className="border-t border-warning/20 px-4 py-3 bg-warning/5 rounded-b-xl flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-2 text-xs text-warning">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      Disconnecting will pause all scheduled posts for this account.
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setConfirmDisconnect(null)}
                        className="text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg border border-border bg-card transition-colors">
                        Cancel
                      </button>
                      <button onClick={() => disconnect(acct.id)}
                        className="text-xs text-white bg-warning hover:bg-warning/90 px-3 py-1.5 rounded-lg transition-colors">
                        Disconnect
                      </button>
                    </div>
                  </div>
                )}

                {/* Remove confirmation */}
                {isRemoving && (
                  <div className="border-t border-destructive/20 px-4 py-3 bg-destructive/5 rounded-b-xl flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-2 text-xs text-destructive">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      Removing this channel will delete all queued posts. This cannot be undone.
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setConfirmRemove(null)}
                        className="text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg border border-border bg-card transition-colors">
                        Cancel
                      </button>
                      <button onClick={() => remove(acct.id)}
                        className="text-xs text-white bg-destructive hover:bg-destructive/90 px-3 py-1.5 rounded-lg transition-colors">
                        Remove Channel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Available platforms grid */}
      {availableVisible.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <WifiOff className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Available Platforms</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {availableVisible.map(acct => {
              const meta = platformMeta[acct.name] ?? { icon: Image, color: "text-muted-foreground", bg: "bg-muted", label: "Profile" };
              const Icon = meta.icon;
              return (
                <div key={acct.id}
                  className="bg-card rounded-xl border border-dashed border-border p-4 flex items-center gap-3 hover:border-primary/40 hover:bg-primary/5 transition-colors group">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 opacity-50 group-hover:opacity-100 transition-opacity", meta.bg)}>
                    <Icon className={cn("w-5 h-5", meta.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{acct.name}</p>
                    <p className="text-xs text-muted-foreground">{meta.label}</p>
                  </div>
                  <button
                    onClick={() => setShowConnect(true)}
                    className="shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Connect
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {visibleAccounts.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <Search className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">No accounts found</p>
          <p className="text-xs text-muted-foreground">Try a different search term or filter</p>
        </div>
      )}
    </div>
  );
}
