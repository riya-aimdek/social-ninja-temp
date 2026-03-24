import { useState } from "react";
import SuperAdminLayout from "@/components/layout/SuperAdminLayout";
import { Button } from "@/components/ui/button";

const permissions = [
  "Create posts",
  "Edit posts",
  "Approve posts",
  "Publish posts",
  "View analytics",
  "Manage inbox",
  "Boost posts",
  "Manage social profiles",
  "Manage team",
];

const PermissionsConfig = () => {
  const [agencyPerms, setAgencyPerms] = useState<Record<string, { agency: boolean; orgRestrict: boolean }>>(
    Object.fromEntries(permissions.map(p => [p, { agency: true, orgRestrict: true }]))
  );
  const [directPerms, setDirectPerms] = useState<Record<string, boolean>>(
    Object.fromEntries(permissions.map(p => [p, true]))
  );

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button onClick={onChange} className={`w-9 h-5 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-border'} relative`}>
      <div className={`w-3.5 h-3.5 rounded-full bg-foreground absolute top-0.5 transition-transform ${checked ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
    </button>
  );

  return (
    <SuperAdminLayout title="Permissions Configuration">
      <div className="grid grid-cols-2 gap-6 max-w-5xl">
        {/* Agency path */}
        <div className="bg-elevated border border-agency rounded-xl p-6">
          <h2 className="text-base font-semibold text-agency mb-1">Agency ceiling + org grant</h2>
          <p className="text-sm text-text-secondary mb-4">Agency sets the maximum. Org can grant up to that ceiling. User gets intersection.</p>
          <table className="w-full">
            <thead><tr className="border-b border-border">
              <th className="text-left text-xs text-text-muted font-medium pb-3">Permission</th>
              <th className="text-center text-xs text-text-muted font-medium pb-3">Agency can grant</th>
              <th className="text-center text-xs text-text-muted font-medium pb-3">Org can restrict</th>
            </tr></thead>
            <tbody>
              {permissions.map(p => (
                <tr key={p} className="border-b border-border last:border-0">
                  <td className="py-2.5 text-[13px] text-foreground">{p}</td>
                  <td className="py-2.5 text-center">
                    <div className="flex justify-center"><Toggle checked={agencyPerms[p].agency} onChange={() => setAgencyPerms(prev => ({ ...prev, [p]: { ...prev[p], agency: !prev[p].agency } }))} /></div>
                  </td>
                  <td className="py-2.5 text-center">
                    <div className="flex justify-center"><Toggle checked={agencyPerms[p].orgRestrict} onChange={() => setAgencyPerms(prev => ({ ...prev, [p]: { ...prev[p], orgRestrict: !prev[p].orgRestrict } }))} /></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Direct path */}
        <div className="bg-elevated border border-organization rounded-xl p-6">
          <h2 className="text-base font-semibold text-organization mb-1">Org sets permissions directly</h2>
          <p className="text-sm text-text-secondary mb-4">No agency ceiling. Organization has full control over what users can do.</p>
          <table className="w-full">
            <thead><tr className="border-b border-border">
              <th className="text-left text-xs text-text-muted font-medium pb-3">Permission</th>
              <th className="text-center text-xs text-text-muted font-medium pb-3">Org can grant</th>
            </tr></thead>
            <tbody>
              {permissions.map(p => (
                <tr key={p} className="border-b border-border last:border-0">
                  <td className="py-2.5 text-[13px] text-foreground">{p}</td>
                  <td className="py-2.5 text-center">
                    <div className="flex justify-center"><Toggle checked={directPerms[p]} onChange={() => setDirectPerms(prev => ({ ...prev, [p]: !prev[p] }))} /></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-6">
        <button className="text-sm text-text-secondary hover:text-foreground">Reset to defaults</button>
        <Button>Save Permission Rules</Button>
      </div>
    </SuperAdminLayout>
  );
};

export default PermissionsConfig;
