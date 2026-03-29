import { useState } from "react";
import { MessageSquare, Send, Check, Clock, AlertCircle, Facebook, Instagram, Linkedin, Twitter, Sparkles } from "lucide-react";

const filters = [
  { label: "All", count: 47 },
  { label: "Comments", count: 23 },
  { label: "DMs", count: 12 },
  { label: "Mentions", count: 8 },
  { label: "Reviews", count: 4 },
];

const messages = [
  { id: 1, sender: "Sarah Johnson", avatar: "SJ", platform: "Instagram", preview: "Love this new feature! When will it be available for all users?", time: "2m ago", status: "Open", tag: "Feature Request", tagColor: "bg-blue-50 text-blue-700" },
  { id: 2, sender: "Mike Chen", avatar: "MC", platform: "Facebook", preview: "Having trouble connecting my account. Getting error code 403...", time: "15m ago", status: "Open", tag: "Complaint 82%", tagColor: "bg-rose-50 text-rose-700" },
  { id: 3, sender: "Emma Wilson", avatar: "EW", platform: "LinkedIn", preview: "Great article! Would love to collaborate on something similar.", time: "1h ago", status: "In Progress", tag: "Collaboration", tagColor: "bg-purple-50 text-purple-700" },
  { id: 4, sender: "Alex Rivera", avatar: "AR", platform: "Instagram", preview: "What's the pricing for the enterprise plan? We have 50+ users.", time: "2h ago", status: "Open", tag: "Price Request", tagColor: "bg-amber-50 text-amber-700" },
  { id: 5, sender: "Lisa Park", avatar: "LP", platform: "Facebook", preview: "Thanks for the quick response! Everything is working now.", time: "3h ago", status: "Completed", tag: "Positive", tagColor: "bg-emerald-50 text-emerald-700" },
  { id: 6, sender: "David Kim", avatar: "DK", platform: "Twitter", preview: "Your latest post was incredibly insightful. Shared it with my team!", time: "5h ago", status: "Completed", tag: "Positive", tagColor: "bg-emerald-50 text-emerald-700" },
];

const thread = [
  { sender: "Alex Rivera", avatar: "AR", text: "What's the pricing for the enterprise plan? We have 50+ users.", time: "2h ago", isOwn: false },
  { sender: "You", avatar: "SN", text: "Hi Alex! Thanks for your interest. Our enterprise plan starts at $299/mo for up to 100 users. I'd love to set up a demo call — would that work for you?", time: "1h ago", isOwn: true },
  { sender: "Alex Rivera", avatar: "AR", text: "That sounds great! Can we schedule something for next week?", time: "45m ago", isOwn: false },
];

const platformIcon = (name: string) => {
  switch (name) {
    case "Instagram": return <Instagram className="w-3.5 h-3.5 text-instagram" />;
    case "Facebook": return <Facebook className="w-3.5 h-3.5 text-facebook" />;
    case "LinkedIn": return <Linkedin className="w-3.5 h-3.5 text-linkedin" />;
    default: return <Twitter className="w-3.5 h-3.5 text-twitter" />;
  }
};

const statusIcon = (status: string) => {
  switch (status) {
    case "Open": return <AlertCircle className="w-3 h-3 text-primary" />;
    case "In Progress": return <Clock className="w-3 h-3 text-amber-500" />;
    default: return <Check className="w-3 h-3 text-emerald-500" />;
  }
};

export default function EngagePage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedMessage, setSelectedMessage] = useState(4);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Engage</h1>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-primary font-medium"><AlertCircle className="w-3.5 h-3.5" /> 12 Open</span>
          <span className="flex items-center gap-1.5 text-amber-500 font-medium"><Clock className="w-3.5 h-3.5" /> 5 In Progress</span>
          <span className="flex items-center gap-1.5 text-emerald-600 font-medium"><Check className="w-3.5 h-3.5" /> 30 Today</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 h-[calc(100vh-220px)]">
        {/* Filters */}
        <div className="col-span-2 bg-card rounded-xl shadow-card p-3 space-y-1 overflow-y-auto">
          {filters.map((f) => (
            <button
              key={f.label}
              onClick={() => setActiveFilter(f.label)}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                activeFilter === f.label ? "bg-primary/10 text-primary" : "text-foreground hover:bg-accent"
              }`}
            >
              {f.label}
              <span className="text-[10px] bg-accent px-1.5 py-0.5 rounded-full text-muted-foreground">{f.count}</span>
            </button>
          ))}
          <div className="pt-3 border-t border-border mt-3">
            <p className="text-[10px] text-muted-foreground font-medium mb-2 px-3">PLATFORMS</p>
            {["Instagram", "Facebook", "LinkedIn", "Twitter"].map((p) => (
              <button key={p} className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-foreground hover:bg-accent transition-colors flex items-center gap-2">
                {platformIcon(p)} {p}
              </button>
            ))}
          </div>
        </div>

        {/* Message List */}
        <div className="col-span-4 bg-card rounded-xl shadow-card overflow-y-auto">
          {messages.map((msg) => (
            <button
              key={msg.id}
              onClick={() => setSelectedMessage(msg.id)}
              className={`w-full text-left px-4 py-3 border-b border-border hover:bg-accent/30 transition-colors ${
                selectedMessage === msg.id ? "bg-primary/5 border-l-2 border-l-primary" : ""
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-[10px] font-bold text-foreground flex-shrink-0">
                  {msg.avatar}
                </div>
                <span className="text-xs font-semibold text-foreground truncate">{msg.sender}</span>
                {platformIcon(msg.platform)}
                <span className="text-[10px] text-muted-foreground ml-auto flex-shrink-0">{msg.time}</span>
              </div>
              <p className="text-xs text-muted-foreground truncate pl-9">{msg.preview}</p>
              <div className="flex items-center gap-2 mt-1.5 pl-9">
                <span className="flex items-center gap-1 text-[10px]">{statusIcon(msg.status)} {msg.status}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${msg.tagColor}`}>
                  <Sparkles className="w-2.5 h-2.5 inline mr-0.5" />{msg.tag}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Detail */}
        <div className="col-span-6 bg-card rounded-xl shadow-card flex flex-col overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-foreground">AR</div>
              <div>
                <p className="text-sm font-semibold text-foreground">Alex Rivera</p>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1"><Instagram className="w-3 h-3 text-instagram" /> Instagram</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded-lg text-xs font-medium border border-border hover:bg-accent transition-colors">Assign</button>
              <button className="px-3 py-1.5 rounded-lg text-xs font-medium gradient-coral text-primary-foreground hover:opacity-90 transition-all flex items-center gap-1">
                <Check className="w-3 h-3" /> Mark Complete
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {thread.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.isOwn ? "flex-row-reverse" : ""}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${msg.isOwn ? "gradient-coral text-primary-foreground" : "bg-accent text-foreground"}`}>
                  {msg.avatar}
                </div>
                <div className={`max-w-[70%] ${msg.isOwn ? "text-right" : ""}`}>
                  <div className={`px-3 py-2 rounded-xl text-sm ${msg.isOwn ? "bg-primary/10 text-foreground" : "bg-accent text-foreground"}`}>
                    {msg.text}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <input className="flex-1 px-3 py-2 rounded-lg border border-input text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Type your reply... (⌘ + Enter to send)" />
              <button className="px-4 py-2 rounded-lg gradient-coral text-primary-foreground text-sm font-medium hover:opacity-90 active:scale-[0.98] transition-all">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
