import SuperAdminLayout from "@/components/layout/SuperAdminLayout";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";

const tabs = ["General", "Security", "Notifications"] as const;

const SuperAdminSettings = () => {
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>("General");

  return (
    <SuperAdminLayout title="Settings">
      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 border-b border-border">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab ? 'text-primary border-primary' : 'text-muted-foreground border-transparent hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "General" && (
        <div className="card-surface max-w-2xl space-y-5">
          <h2 className="text-base font-semibold text-foreground">Platform Settings</h2>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Platform Name</label>
            <input className="input-dark" defaultValue="SocialNinja" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Support Email</label>
            <input className="input-dark" defaultValue="support@socialninja.com" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Default Timezone</label>
            <select className="input-dark">
              <option>UTC</option>
              <option>America/New_York</option>
              <option>Europe/London</option>
              <option>Asia/Tokyo</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Maintenance Mode</p>
              <p className="text-xs text-muted-foreground">Temporarily disable access for non-admins</p>
            </div>
            <Switch />
          </div>
          <div className="pt-4 border-t border-border flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </div>
      )}

      {activeTab === "Security" && (
        <div className="space-y-6 max-w-2xl">
          <div className="card-surface space-y-5">
            <h2 className="text-base font-semibold text-foreground">Password Policy</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Require 2FA for all admins</p>
                <p className="text-xs text-muted-foreground">Force two-factor authentication for Super Admin accounts</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Enforce strong passwords</p>
                <p className="text-xs text-muted-foreground">Minimum 12 characters, mixed case, numbers, symbols</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Session Timeout (minutes)</label>
              <input className="input-dark w-32" type="number" defaultValue={30} />
            </div>
          </div>
          <div className="card-surface space-y-4">
            <h2 className="text-base font-semibold text-foreground">Active Sessions</h2>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm text-foreground">Chrome on macOS — 192.168.1.1</p>
                <p className="text-xs text-muted-foreground">Current session · Started 2 hours ago</p>
              </div>
              <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded-full">Active</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Notifications" && (
        <div className="card-surface max-w-2xl">
          <h2 className="text-base font-semibold text-foreground mb-4">Notification Preferences</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-[11px] uppercase text-muted-foreground font-medium pb-3">Event</th>
                <th className="text-center text-[11px] uppercase text-muted-foreground font-medium pb-3">Email</th>
                <th className="text-center text-[11px] uppercase text-muted-foreground font-medium pb-3">In-App</th>
              </tr>
            </thead>
            <tbody>
              {[
                "New agency registered",
                "Agency suspended",
                "New standalone org registered",
                "Subscription limit reached",
                "Security alert detected",
                "System health warning",
              ].map(event => (
                <tr key={event} className="border-b border-border/50 last:border-0">
                  <td className="py-3 text-sm text-foreground">{event}</td>
                  <td className="py-3 text-center"><Switch defaultChecked /></td>
                  <td className="py-3 text-center"><Switch defaultChecked /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pt-4 border-t border-border flex justify-end mt-4">
            <Button>Save Preferences</Button>
          </div>
        </div>
      )}
    </SuperAdminLayout>
  );
};

export default SuperAdminSettings;
