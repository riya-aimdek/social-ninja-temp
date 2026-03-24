import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import SuperAdminLogin from "./pages/SuperAdminLogin";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import AgenciesPage from "./pages/AgenciesPage";
import AuditLogPage from "./pages/AuditLogPage";
import PermissionsConfig from "./pages/PermissionsConfig";
import AgencyRegistration from "./pages/AgencyRegistration";
import AgencyDashboard from "./pages/AgencyDashboard";
import OrganizationsPage from "./pages/OrganizationsPage";
import OrganizationDetail from "./pages/OrganizationDetail";
import TeamMembersPage from "./pages/TeamMembersPage";
import BillingPage from "./pages/BillingPage";
import AgencySettings from "./pages/AgencySettings";
import OrgSwitcher from "./pages/OrgSwitcher";
import StandaloneOrgRegistration from "./pages/StandaloneOrgRegistration";
import OrgSelector from "./pages/OrgSelector";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/super-admin/login" replace />} />

          {/* Super Admin */}
          <Route path="/super-admin/login" element={<SuperAdminLogin />} />
          <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} />
          <Route path="/super-admin/agencies" element={<AgenciesPage />} />
          <Route path="/super-admin/audit-log" element={<AuditLogPage />} />
          <Route path="/super-admin/permissions" element={<PermissionsConfig />} />
          <Route path="/super-admin/settings" element={<PermissionsConfig />} />

          {/* Registration flows */}
          <Route path="/register/agency" element={<AgencyRegistration />} />
          <Route path="/register/organization" element={<StandaloneOrgRegistration />} />

          {/* Agency */}
          <Route path="/agency/dashboard" element={<AgencyDashboard />} />
          <Route path="/agency/organizations" element={<OrganizationsPage />} />
          <Route path="/agency/organizations/:id" element={<OrganizationDetail />} />
          <Route path="/agency/team" element={<TeamMembersPage />} />
          <Route path="/agency/billing" element={<BillingPage />} />
          <Route path="/agency/settings" element={<AgencySettings />} />

          {/* Transition screens */}
          <Route path="/switch-org" element={<OrgSwitcher />} />
          <Route path="/select-org" element={<OrgSelector />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
