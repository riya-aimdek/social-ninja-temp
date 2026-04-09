import { useState } from "react";
import OrgLayout from "@/components/layout/OrgLayout";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

const settingsTabs = ["General", "Notifications", "Security", "Danger Zone"];

const notifications = [
  "New post published",
  "Approval pending (> 24hrs)",
  "Inbox message SLA breached",
  "Social profile disconnected",
  "New team member added",
  "Weekly analytics report",
];

const OrgSettings = () => {
  const [activeTab, setActiveTab] = useState("General");
  const [notifToggles, setNotifToggles] = useState<Record<string, { email: boolean; inApp: boolean }>>(
    Object.fromEntries(notifications.map(n => [n, { email: true, inApp: true }]))
  );

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button onClick={onChange} className={`w-9 h-5 rounded-full transition-colors ${checked ? "bg-primary" : "bg-border"} relative`}>
      <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${checked ? "translate-x-[18px]" : "translate-x-0.5"}`} />
    </button>
  );

  return (
    <OrgLayout title="Settings">
      <div className="flex gap-0 border-b border-border mb-6">
        {settingsTabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2.5 text-sm transition-colors ${activeTab === tab ? "text-foreground border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "General" && (
        <div className="space-y-6 max-w-2xl">
          <div className="card-surface space-y-4">
            <h3 className="text-base font-semibold text-foreground">Business Details</h3>
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 border-2 border-dashed border-border rounded-xl flex items-center justify-center hover:border-primary cursor-pointer transition-colors">
                <Upload className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 space-y-4">
                <div><label className="text-sm text-muted-foreground mb-1.5 block">Business Name</label><input className="input-dark" defaultValue="RetailCo" /></div>
                <div><label className="text-sm text-muted-foreground mb-1.5 block">Industry</label>
                  <select className="input-dark"><option>Retail</option><option>Technology</option><option>Healthcare</option><option>Food & Beverage</option></select>
                </div>
              </div>
            </div>
            <div><label className="text-sm text-muted-foreground mb-1.5 block">Website URL</label><input className="input-dark" defaultValue="https://retailco.com" /></div>
            <div><label className="text-sm text-muted-foreground mb-1.5 block">Description</label><textarea className="input-dark h-20 py-2 resize-none" defaultValue="Leading retail company specializing in sustainable products." /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm text-muted-foreground mb-1.5 block">Contact Email</label><input className="input-dark" defaultValue="hello@retailco.com" /></div>
              <div><label className="text-sm text-muted-foreground mb-1.5 block">Phone</label><input className="input-dark" defaultValue="+1 (555) 123-4567" /></div>
            </div>
            <div><label className="text-sm text-muted-foreground mb-1.5 block">Timezone</label>
              <select className="input-dark"><option>UTC-05:00 Eastern Time</option><option>UTC-06:00 Central Time</option><option>UTC-08:00 Pacific Time</option></select>
            </div>
            <div className="flex justify-end"><Button>Save Changes</Button></div>
          </div>
        </div>
      )}

      {activeTab === "Notifications" && (
        <div className="space-y-6 max-w-3xl">
          <div className="card-surface">
            <h3 className="text-base font-semibold text-foreground mb-4">Notification Preferences</h3>
            <table className="w-full">
              <thead><tr className="border-b border-border">
                <th className="text-left text-xs text-muted-foreground font-medium pb-3 w-1/2">Notification</th>
                <th className="text-center text-xs text-muted-foreground font-medium pb-3">Email</th>
                <th className="text-center text-xs text-muted-foreground font-medium pb-3">In-App</th>
              </tr></thead>
              <tbody>
                {notifications.map(n => (
                  <tr key={n} className="border-b border-border last:border-0">
                    <td className="py-3 text-sm text-foreground">{n}</td>
                    <td className="py-3 text-center">
                      <div className="flex justify-center"><Toggle checked={notifToggles[n].email} onChange={() => setNotifToggles(prev => ({ ...prev, [n]: { ...prev[n], email: !prev[n].email } }))} /></div>
                    </td>
                    <td className="py-3 text-center">
                      <div className="flex justify-center"><Toggle checked={notifToggles[n].inApp} onChange={() => setNotifToggles(prev => ({ ...prev, [n]: { ...prev[n], inApp: !prev[n].inApp } }))} /></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end mt-4"><Button>Save Preferences</Button></div>
          </div>
        </div>
      )}

      {activeTab === "Security" && (
        <div className="space-y-6 max-w-2xl">
          <div className="card-surface space-y-4">
            <h3 className="text-base font-semibold text-foreground">Change Password</h3>
            <div><label className="text-sm text-muted-foreground mb-1.5 block">Current Password</label><input className="input-dark" type="password" placeholder="••••••••" /></div>
            <div><label className="text-sm text-muted-foreground mb-1.5 block">New Password</label><input className="input-dark" type="password" placeholder="••••••••" /></div>
            <div><label className="text-sm text-muted-foreground mb-1.5 block">Confirm New Password</label><input className="input-dark" type="password" placeholder="••••••••" /></div>
            <div className="flex justify-end"><Button>Update Password</Button></div>
          </div>

          <div className="card-surface space-y-4">
            <h3 className="text-base font-semibold text-foreground">Two-Factor Authentication</h3>
            <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="text-sm font-medium text-foreground">Authenticator App</p>
                <p className="text-xs text-muted-foreground">Use Google Authenticator or similar app</p>
              </div>
              <Button variant="outline" size="sm">Enable</Button>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="text-sm font-medium text-foreground">SMS Verification</p>
                <p className="text-xs text-muted-foreground">Receive codes via text message</p>
              </div>
              <Button variant="outline" size="sm">Enable</Button>
            </div>
          </div>

          <div className="card-surface space-y-4">
            <h3 className="text-base font-semibold text-foreground">Active Sessions</h3>
            <div className="space-y-3">
              {[
                { device: "Chrome on MacOS", location: "New York, US", time: "Current session", current: true },
                { device: "Safari on iPhone", location: "New York, US", time: "2 hrs ago", current: false },
                { device: "Firefox on Windows", location: "Los Angeles, US", time: "1 day ago", current: false },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-foreground">{s.device}</p>
                    <p className="text-xs text-muted-foreground">{s.location} · {s.time}</p>
                  </div>
                  {s.current ? (
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Current</span>
                  ) : (
                    <button className="text-xs text-red-500 hover:underline">Revoke</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "Danger Zone" && (
        <div className="card-surface border-red-200 max-w-2xl">
          <h3 className="text-base font-semibold text-foreground mb-3">Danger Zone</h3>
          <p className="text-sm text-muted-foreground mb-4">Irreversible actions. Proceed with caution.</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border border-amber-200 rounded-lg">
              <div>
                <p className="text-sm font-medium text-foreground">Archive Organization</p>
                <p className="text-xs text-muted-foreground">Disable all activity. Data will be preserved.</p>
              </div>
              <Button variant="outline" className="border-amber-500 text-amber-600 hover:bg-amber-50" size="sm">Archive</Button>
            </div>
            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
              <div>
                <p className="text-sm font-medium text-foreground">Delete Organization</p>
                <p className="text-xs text-muted-foreground">Permanently delete all data. This cannot be undone.</p>
              </div>
              <Button variant="outline" className="border-red-500 text-red-600 hover:bg-red-50" size="sm">Delete</Button>
            </div>
          </div>
        </div>
      )}
    </OrgLayout>
  );
};

export default OrgSettings;
