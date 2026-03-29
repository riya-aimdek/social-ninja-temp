import { useState } from "react";
import { CalendarDays, List, ChevronLeft, ChevronRight, Plus, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const currentMonth = "March 2026";

const generateDays = () => {
  const days: { day: number; posts: { platform: string; color: string }[] }[] = [];
  for (let i = 1; i <= 31; i++) {
    const posts: { platform: string; color: string }[] = [];
    if (i === 3) posts.push({ platform: "IG", color: "bg-instagram" });
    if (i === 5) posts.push({ platform: "FB", color: "bg-facebook" }, { platform: "LI", color: "bg-linkedin" });
    if (i === 8) posts.push({ platform: "IG", color: "bg-instagram" });
    if (i === 10) posts.push({ platform: "FB", color: "bg-facebook" });
    if (i === 12) posts.push({ platform: "IG", color: "bg-instagram" }, { platform: "X", color: "bg-twitter" });
    if (i === 15) posts.push({ platform: "FB", color: "bg-facebook" });
    if (i === 18) posts.push({ platform: "IG", color: "bg-instagram" }, { platform: "LI", color: "bg-linkedin" });
    if (i === 20) posts.push({ platform: "FB", color: "bg-facebook" });
    if (i === 22) posts.push({ platform: "IG", color: "bg-instagram" });
    if (i === 25) posts.push({ platform: "X", color: "bg-twitter" }, { platform: "FB", color: "bg-facebook" });
    if (i === 28) posts.push({ platform: "LI", color: "bg-linkedin" });
    days.push({ day: i, posts });
  }
  return days;
};

const scheduledPosts = [
  { platform: "Instagram", caption: "New feature spotlight: AI Content Generator", time: "Mar 18, 2:00 PM", status: "Scheduled" },
  { platform: "Facebook", caption: "Weekly tips: Engagement strategies", time: "Mar 18, 5:00 PM", status: "Scheduled" },
  { platform: "LinkedIn", caption: "Case study: How we grew 300%", time: "Mar 19, 9:00 AM", status: "Scheduled" },
  { platform: "Instagram", caption: "User spotlight: @designstudio", time: "Mar 19, 1:00 PM", status: "Draft" },
  { platform: "Facebook", caption: "Product update announcement", time: "Mar 20, 10:00 AM", status: "Scheduled" },
  { platform: "Instagram", caption: "Behind the scenes at SocialNinja HQ", time: "Mar 22, 3:00 PM", status: "Published" },
];

const platformIcon = (name: string) => {
  switch (name) {
    case "Instagram": return <Instagram className="w-4 h-4 text-instagram" />;
    case "Facebook": return <Facebook className="w-4 h-4 text-facebook" />;
    case "LinkedIn": return <Linkedin className="w-4 h-4 text-linkedin" />;
    default: return <Twitter className="w-4 h-4 text-twitter" />;
  }
};

const statusStyles: Record<string, string> = {
  Published: "badge-published",
  Scheduled: "badge-scheduled",
  Draft: "badge-draft",
};

export default function PublishPage() {
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const days = generateDays();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Publish</h1>
          <p className="text-sm text-muted-foreground mt-1">Schedule and manage your content calendar.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => setView("calendar")}
              className={`px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 transition-colors ${view === "calendar" ? "bg-foreground text-card" : "bg-card text-foreground hover:bg-accent"}`}
            >
              <CalendarDays className="w-3.5 h-3.5" /> Calendar
            </button>
            <button
              onClick={() => setView("list")}
              className={`px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 transition-colors ${view === "list" ? "bg-foreground text-card" : "bg-card text-foreground hover:bg-accent"}`}
            >
              <List className="w-3.5 h-3.5" /> List
            </button>
          </div>
          <button className="px-4 py-2 rounded-lg gradient-coral text-primary-foreground text-sm font-medium shadow-coral hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Post
          </button>
        </div>
      </div>

      {view === "calendar" ? (
        <div className="bg-card rounded-xl shadow-card p-5">
          <div className="flex items-center justify-between mb-4">
            <button className="p-1.5 rounded-lg hover:bg-accent transition-colors"><ChevronLeft className="w-4 h-4 text-muted-foreground" /></button>
            <h2 className="text-sm font-semibold text-foreground">{currentMonth}</h2>
            <button className="p-1.5 rounded-lg hover:bg-accent transition-colors"><ChevronRight className="w-4 h-4 text-muted-foreground" /></button>
          </div>
          <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
            {daysOfWeek.map((d) => (
              <div key={d} className="bg-accent p-2 text-center text-[11px] font-medium text-muted-foreground">{d}</div>
            ))}
            {days.map((d) => (
              <div key={d.day} className={`bg-card p-2 min-h-[80px] hover:bg-accent/30 transition-colors cursor-pointer ${d.day === 18 ? "ring-2 ring-primary ring-inset" : ""}`}>
                <span className={`text-xs font-medium ${d.day === 18 ? "text-primary" : "text-foreground"}`}>{d.day}</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {d.posts.map((p, i) => (
                    <span key={i} className={`${p.color} text-[9px] text-primary-foreground px-1.5 py-0.5 rounded font-medium`}>{p.platform}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-xl shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-border">
                <th className="px-5 py-3 font-medium">Platform</th>
                <th className="px-5 py-3 font-medium">Caption</th>
                <th className="px-5 py-3 font-medium">Scheduled Time</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {scheduledPosts.map((post, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                  <td className="px-5 py-3">{platformIcon(post.platform)}</td>
                  <td className="px-5 py-3 max-w-sm truncate text-foreground">{post.caption}</td>
                  <td className="px-5 py-3 text-muted-foreground text-xs tabular-nums">{post.time}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyles[post.status]}`}>{post.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
