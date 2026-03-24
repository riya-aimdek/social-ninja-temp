import { useState } from "react";
import AgencyLayout from "@/components/layout/AgencyLayout";
import { Button } from "@/components/ui/button";

const settingsTabs = ['General', 'Notifications', 'Security', 'Danger Zone'];

const agencyNotifications = [
  "New organization created",
  "Team member invited",
  "Team member removed",
  "Subscription limit approaching (80%)",
  "Subscription limit reached (100%)",
  "Failed OAuth connection on any org",
  "Audit log alert (suspicious activity)",
];

const orgNotifications = [
  "New post published",
  "Approval pending (> 24hrs)",
  "Inbox message SLA breached",
  "Social profile disconnected",
];

const AgencySettings = () => {
  const [activeTab, setActiveTab] = useState('Notifications');
  const [agencyToggles, setAgencyToggles] = useState<Record<string, { email: boolean; inApp: boolean }>>(
    Object.fromEntries(agencyNotifications.map(n => [n, { email: true, inApp: true }]))
  );
  const [orgToggles, setOrgToggles] = useState<Record<string, { email: boolean; inApp: boolean }>>(
    Object.fromEntries(orgNotifications.map(n => [n, { email: false, inApp: true }]))
  );

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button onClick={onChange} className={`w-9 h-5 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-border'} relative`}>
      <div className={`w-3.5 h-3.5 rounded-full bg-foreground absolute top-0.5 transition-transform ${checked ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
    </button>
  );

  return (
    <AgencyLayout title="Settings">
      {/* Sub-nav */}
      <div className="flex gap-0 border-b border-border mb-6">
        {settingsTabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2.5 text-sm transition-colors ${activeTab === tab ? 'text-foreground border-b-2 border-primary' : 'text-text-secondary hover:text-foreground'}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Notifications' && (
        <div className="space-y-6 max-w-3xl">
          {/* Agency Notifications */}
          <div className="card-surface">
            <h3 className="text-base font-semibold text-foreground mb-4">Agency Notifications</h3>
            <table className="w-full">
              <thead><tr className="border-b border-border">
                <th className="text-left text-xs text-text-muted font-medium pb-3 w-1/2">Notification</th>
                <th className="text-center text-xs text-text-muted font-medium pb-3">Email</th>
                <th className="text-center text-xs text-text-muted font-medium pb-3">In-App</th>
              </tr></thead>
              <tbody>
                {agencyNotifications.map(n => (
                  <tr key={n} className="border-b border-border last:border-0">
                    <td className="py-3 text-sm text-foreground">{n}</td>
                    <td className="py-3 text-center">
                      <div className="flex justify-center"><Toggle checked={agencyToggles[n].email} onChange={() => setAgencyToggles(prev => ({ ...prev, [n]: { ...prev[n], email: !prev[n].email } }))} /></div>
                    </td>
                    <td className="py-3 text-center">
                      <div className="flex justify-center"><Toggle checked={agencyToggles[n].inApp} onChange={() => setAgencyToggles(prev => ({ ...prev, [n]: { ...prev[n], inApp: !prev[n].inApp } }))} /></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Org Notifications */}
          <div className="card-surface">
            <h3 className="text-base font-semibold text-foreground mb-2">Org-Level Alerts</h3>
            <p className="text-sm text-text-secondary mb-4">Receive alerts for activity within your organizations.</p>
            <table className="w-full">
              <thead><tr className="border-b border-border">
                <th className="text-left text-xs text-text-muted font-medium pb-3 w-1/2">Notification</th>
                <th className="text-center text-xs text-text-muted font-medium pb-3">Email</th>
                <th className="text-center text-xs text-text-muted font-medium pb-3">In-App</th>
              </tr></thead>
              <tbody>
                {orgNotifications.map(n => (
                  <tr key={n} className="border-b border-border last:border-0">
                    <td className="py-3 text-sm text-foreground">{n}</td>
                    <td className="py-3 text-center">
                      <div className="flex justify-center"><Toggle checked={orgToggles[n].email} onChange={() => setOrgToggles(prev => ({ ...prev, [n]: { ...prev[n], email: !prev[n].email } }))} /></div>
                    </td>
                    <td className="py-3 text-center">
                      <div className="flex justify-center"><Toggle checked={orgToggles[n].inApp} onChange={() => setOrgToggles(prev => ({ ...prev, [n]: { ...prev[n], inApp: !prev[n].inApp } }))} /></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <Button>Save Preferences</Button>
          </div>
        </div>
      )}

      {activeTab === 'General' && <div className="card-surface"><p className="text-text-secondary text-sm">General settings coming soon.</p></div>}
      {activeTab === 'Security' && <div className="card-surface"><p className="text-text-secondary text-sm">Security settings coming soon.</p></div>}
      {activeTab === 'Danger Zone' && (
        <div className="card-surface border-error/30 max-w-3xl">
          <h3 className="text-base font-semibold text-foreground mb-3">Danger Zone</h3>
          <p className="text-sm text-text-secondary mb-4">Irreversible actions. Proceed with caution.</p>
          <div className="flex gap-3">
            <Button variant="outline" className="border-warning text-warning hover:bg-warning/10">Deactivate Agency</Button>
            <Button variant="outline" className="border-error text-error hover:bg-error/10">Delete Agency</Button>
          </div>
        </div>
      )}
    </AgencyLayout>
  );
};

export default AgencySettings;
