import { useState } from "react";
import OrgLayout from "@/components/layout/OrgLayout";
import { Search, Star, Archive } from "lucide-react";

const conversations = [
  { id: 1, name: "Jessica M.", platform: "Instagram", message: "Love your new summer collection! Where can I find...", time: "2 min ago", unread: true, starred: false },
  { id: 2, name: "Mike T.", platform: "Twitter/X", message: "Hey @RetailCo, I had an issue with my order #4521...", time: "15 min ago", unread: true, starred: true },
  { id: 3, name: "Sarah L.", platform: "Facebook", message: "Do you ship internationally? I'm based in the UK and...", time: "1 hr ago", unread: true, starred: false },
  { id: 4, name: "David K.", platform: "Instagram", message: "Amazing products! Can you recommend something for...", time: "2 hrs ago", unread: false, starred: false },
  { id: 5, name: "Emily R.", platform: "LinkedIn", message: "Would love to discuss a potential partnership...", time: "3 hrs ago", unread: false, starred: true },
  { id: 6, name: "Tom B.", platform: "Facebook", message: "Thanks for the quick response! I'll check it out.", time: "5 hrs ago", unread: false, starred: false },
  { id: 7, name: "Ana P.", platform: "Instagram", message: "Your packaging is so eco-friendly! Love it 🌱", time: "1 day ago", unread: false, starred: false },
];

const OrgInbox = () => {
  const [selected, setSelected] = useState<number | null>(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "starred">("all");

  const filtered = conversations.filter(c => {
    if (filter === "unread" && !c.unread) return false;
    if (filter === "starred" && !c.starred) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.message.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const selectedConvo = conversations.find(c => c.id === selected);

  return (
    <OrgLayout title="Inbox">
      <div className="flex gap-0 h-[calc(100vh-140px)] rounded-xl border border-border overflow-hidden">
        {/* Conversation List */}
        <div className="w-80 border-r border-border bg-card flex flex-col">
          <div className="p-3 border-b border-border">
            <div className="relative mb-2">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input className="input-dark h-8 pl-8 text-xs" placeholder="Search messages..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="flex gap-1">
              {(["all", "unread", "starred"] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`text-xs px-2.5 py-1 rounded-full transition-colors ${filter === f ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"}`}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            {filtered.map(c => (
              <button
                key={c.id}
                onClick={() => setSelected(c.id)}
                className={`w-full text-left px-3 py-3 border-b border-border transition-colors ${selected === c.id ? "bg-primary/5" : "hover:bg-muted"}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    {c.unread && <div className="w-2 h-2 rounded-full bg-primary" />}
                    <span className={`text-sm ${c.unread ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{c.name}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{c.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground truncate pr-4">{c.message}</p>
                  <span className="text-[10px] text-muted-foreground shrink-0">{c.platform}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Conversation Detail */}
        <div className="flex-1 bg-background flex flex-col">
          {selectedConvo ? (
            <>
              <div className="p-4 border-b border-border bg-card flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">{selectedConvo.name}</p>
                  <p className="text-xs text-muted-foreground">via {selectedConvo.platform} · {selectedConvo.time}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-1.5 hover:bg-muted rounded-lg transition-colors">
                    <Star className={`h-4 w-4 ${selectedConvo.starred ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
                  </button>
                  <button className="p-1.5 hover:bg-muted rounded-lg transition-colors">
                    <Archive className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
              <div className="flex-1 p-6">
                <div className="max-w-lg">
                  <div className="bg-muted rounded-xl rounded-tl-sm px-4 py-3 mb-4">
                    <p className="text-sm text-foreground">{selectedConvo.message}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{selectedConvo.time}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-border bg-card">
                <div className="flex gap-2">
                  <input className="input-dark flex-1" placeholder="Type your reply..." />
                  <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-colors">Send</button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
              Select a conversation
            </div>
          )}
        </div>
      </div>
    </OrgLayout>
  );
};

export default OrgInbox;
