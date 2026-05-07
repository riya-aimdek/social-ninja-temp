import { useState } from "react";
import AgencyLayout from "@/components/layout/AgencyLayout";
import { Button } from "@/components/ui/button";
import { Upload, AlertTriangle } from "lucide-react";
import { WorkflowSettings } from "@/components/settings/WorkflowSettings";

const settingsTabs = ['General', 'Notifications', 'Security', 'Workflows', 'Danger Zone'];

const agencyNotifications = [
  "New client created",
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
  const [activeTab, setActiveTab] = useState('General');
  const [agencyToggles, setAgencyToggles] = useState<Record<string, { email: boolean; inApp: boolean }>>(
    Object.fromEntries(agencyNotifications.map(n => [n, { email: true, inApp: true }]))
  );
  const [orgToggles, setOrgToggles] = useState<Record<string, { email: boolean; inApp: boolean }>>(
    Object.fromEntries(orgNotifications.map(n => [n, { email: false, inApp: true }]))
  );
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button onClick={onChange} className={`w-9 h-5 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-border'} relative`}>
      <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${checked ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
    </button>
  );

  return (
    <AgencyLayout title="Settings">
      <div className="flex gap-0 border-b border-border mb-6">
        {settingsTabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2.5 text-sm transition-colors ${activeTab === tab ? 'text-foreground border-b-2 border-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'General' && (
        <div className="space-y-6 max-w-2xl">
          <div className="card-surface space-y-4">
            <h3 className="text-base font-semibold text-foreground">Agency Profile</h3>
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 border-2 border-dashed border-border rounded-xl flex items-center justify-center hover:border-primary cursor-pointer transition-colors">
                <Upload className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 space-y-4">
                <div><label className="text-sm text-muted-foreground mb-1.5 block">Agency Name</label><input className="input-dark" defaultValue="Digital Spark Agency" /></div>
                <div><label className="text-sm text-muted-foreground mb-1.5 block">Industry</label>
                  <select className="input-dark"><option>Marketing Agency</option><option>Creative Agency</option><option>Digital Agency</option><option>PR Agency</option></select>
                </div>
              </div>
            </div>
            <div><label className="text-sm text-muted-foreground mb-1.5 block">Website URL</label><input className="input-dark" defaultValue="https://digitalspark.io" /></div>
            <div><label className="text-sm text-muted-foreground mb-1.5 block">Notes</label><textarea className="input-dark h-20 py-2 resize-none" defaultValue="Leading digital marketing agency specializing in social media management." /></div>
            <div className="flex justify-end"><Button>Save Changes</Button></div>
          </div>
        </div>
      )}

      {activeTab === 'Notifications' && (
        <div className="space-y-6 max-w-3xl">
          <div className="card-surface">
            <h3 className="text-base font-semibold text-foreground mb-4">Agency Notifications</h3>
            {/* Desktop */}
            <div className="hidden md:block">
              <table className="w-full">
                <thead><tr className="border-b border-border">
                  <th className="text-left text-xs text-muted-foreground font-medium pb-3 w-1/2">Notification</th>
                  <th className="text-center text-xs text-muted-foreground font-medium pb-3">Email</th>
                  <th className="text-center text-xs text-muted-foreground font-medium pb-3">In-App</th>
                </tr></thead>
                <tbody>
                  {agencyNotifications.map(n => (
                    <tr key={n} className="border-b border-border last:border-0">
                      <td className="py-3 text-sm text-foreground">{n}</td>
                      <td className="py-3 text-center"><div className="flex justify-center"><Toggle checked={agencyToggles[n].email} onChange={() => setAgencyToggles(prev => ({ ...prev, [n]: { ...prev[n], email: !prev[n].email } }))} /></div></td>
                      <td className="py-3 text-center"><div className="flex justify-center"><Toggle checked={agencyToggles[n].inApp} onChange={() => setAgencyToggles(prev => ({ ...prev, [n]: { ...prev[n], inApp: !prev[n].inApp } }))} /></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile */}
            <div className="md:hidden space-y-3">
              {agencyNotifications.map(n => (
                <div key={n} className="border border-border rounded-lg p-3">
                  <p className="text-sm text-foreground mb-2">{n}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2"><span className="text-xs text-muted-foreground">Email</span><Toggle checked={agencyToggles[n].email} onChange={() => setAgencyToggles(prev => ({ ...prev, [n]: { ...prev[n], email: !prev[n].email } }))} /></div>
                    <div className="flex items-center gap-2"><span className="text-xs text-muted-foreground">In-App</span><Toggle checked={agencyToggles[n].inApp} onChange={() => setAgencyToggles(prev => ({ ...prev, [n]: { ...prev[n], inApp: !prev[n].inApp } }))} /></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-surface">
             <h3 className="text-base font-semibold text-foreground mb-2">Business-Level Alerts</h3>
             <p className="text-sm text-muted-foreground mb-4">Receive alerts for activity within your businesses.</p>
            <div className="hidden md:block">
              <table className="w-full">
                <thead><tr className="border-b border-border">
                  <th className="text-left text-xs text-muted-foreground font-medium pb-3 w-1/2">Notification</th>
                  <th className="text-center text-xs text-muted-foreground font-medium pb-3">Email</th>
                  <th className="text-center text-xs text-muted-foreground font-medium pb-3">In-App</th>
                </tr></thead>
                <tbody>
                  {orgNotifications.map(n => (
                    <tr key={n} className="border-b border-border last:border-0">
                      <td className="py-3 text-sm text-foreground">{n}</td>
                      <td className="py-3 text-center"><div className="flex justify-center"><Toggle checked={orgToggles[n].email} onChange={() => setOrgToggles(prev => ({ ...prev, [n]: { ...prev[n], email: !prev[n].email } }))} /></div></td>
                      <td className="py-3 text-center"><div className="flex justify-center"><Toggle checked={orgToggles[n].inApp} onChange={() => setOrgToggles(prev => ({ ...prev, [n]: { ...prev[n], inApp: !prev[n].inApp } }))} /></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="md:hidden space-y-3">
              {orgNotifications.map(n => (
                <div key={n} className="border border-border rounded-lg p-3">
                  <p className="text-sm text-foreground mb-2">{n}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2"><span className="text-xs text-muted-foreground">Email</span><Toggle checked={orgToggles[n].email} onChange={() => setOrgToggles(prev => ({ ...prev, [n]: { ...prev[n], email: !prev[n].email } }))} /></div>
                    <div className="flex items-center gap-2"><span className="text-xs text-muted-foreground">In-App</span><Toggle checked={orgToggles[n].inApp} onChange={() => setOrgToggles(prev => ({ ...prev, [n]: { ...prev[n], inApp: !prev[n].inApp } }))} /></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end"><Button>Save Preferences</Button></div>
        </div>
      )}

      {activeTab === 'Security' && (
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
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-foreground">{s.device}</p>
                    <p className="text-xs text-muted-foreground">{s.location} · {s.time}</p>
                  </div>
                  {s.current ? (
                    <span className="text-xs text-success bg-success/10 px-2 py-0.5 rounded-full">Current</span>
                  ) : (
                    <button className="text-xs text-error hover:underline">Revoke</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Workflows' && (
        <div className="py-1">
          <WorkflowSettings scope="agency" />
        </div>
      )}

      {activeTab === 'Danger Zone' && (
        <div className="card-surface border-error/30 max-w-2xl">
          <h3 className="text-base font-semibold text-foreground mb-3">Danger Zone</h3>
          <p className="text-sm text-muted-foreground mb-4">Irreversible actions. Proceed with caution.</p>
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-warning/30 rounded-lg gap-3">
              <div>
                <p className="text-sm font-medium text-foreground">Suspend Agency</p>
                <p className="text-xs text-muted-foreground">Temporarily disable this agency and all its organizations.</p>
              </div>
              <Button variant="outline" className="border-warning text-warning hover:bg-warning/10 shrink-0" size="sm" onClick={() => setShowDeactivateConfirm(true)}>Suspend</Button>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-error/30 rounded-lg gap-3">
              <div>
                <p className="text-sm font-medium text-foreground">Delete Agency</p>
                <p className="text-xs text-muted-foreground">Permanently delete this agency, all organizations, and all data. This cannot be undone.</p>
              </div>
              <Button variant="outline" className="border-error text-error hover:bg-error/10 shrink-0" size="sm" onClick={() => setShowDeleteConfirm(true)}>Delete</Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modals */}
      {(showDeactivateConfirm || showDeleteConfirm) && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50" onClick={() => { setShowDeactivateConfirm(false); setShowDeleteConfirm(false); setConfirmText(""); }}>
          <div className="w-[440px] bg-card border border-border rounded-2xl p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-full ${showDeleteConfirm ? 'bg-error/10' : 'bg-warning/10'}`}>
                <AlertTriangle className={`h-5 w-5 ${showDeleteConfirm ? 'text-error' : 'text-warning'}`} />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{showDeleteConfirm ? 'Delete Agency' : 'Suspend Agency'}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {showDeleteConfirm
                ? 'This will permanently delete your agency, all organizations, and all data. This action cannot be undone.'
                : 'This will temporarily disable your agency and all its organizations. You can reactivate later.'}
            </p>
            <div className="mb-4">
              <label className="text-sm text-muted-foreground mb-1.5 block">Type <strong>Digital Spark Agency</strong> to confirm</label>
              <input className="input-dark" value={confirmText} onChange={e => setConfirmText(e.target.value)} placeholder="Type agency name..." />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => { setShowDeactivateConfirm(false); setShowDeleteConfirm(false); setConfirmText(""); }}>Cancel</Button>
              <Button
                className={showDeleteConfirm ? 'bg-error hover:bg-error/90' : 'bg-warning hover:bg-warning/90'}
                disabled={confirmText !== "Digital Spark Agency"}
              >
                {showDeleteConfirm ? 'Delete Permanently' : 'Suspend Agency'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AgencyLayout>
  );
};

export default AgencySettings;
