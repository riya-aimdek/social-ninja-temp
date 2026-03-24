import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import LoginPage from "./pages/LoginPage";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import SuperAdminOrganizations from "./pages/SuperAdminOrganizations";
import SuperAdminUsers from "./pages/SuperAdminUsers";
import SuperAdminBilling from "./pages/SuperAdminBilling";
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
import StandaloneOrgRegistration from "./pages/StandaloneOrgRegistration";
import OrgDashboard from "./pages/OrgDashboard";
import OrgProfiles from "./pages/OrgProfiles";
import OrgTeam from "./pages/OrgTeam";
import OrgAnalytics from "./pages/OrgAnalytics";
import OrgInbox from "./pages/OrgInbox";
import OrgSettings from "./pages/OrgSettings";
import OrgSwitcher from "./pages/OrgSwitcher";
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
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register/agency" element={<AgencyRegistration />} />
          <Route path="/register/organization" element={<StandaloneOrgRegistration />} />

          {/* Super Admin */}
          <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} />
          <Route path="/super-admin/agencies" element={<AgenciesPage />} />
          <Route path="/super-admin/organizations" element={<SuperAdminOrganizations />} />
          <Route path="/super-admin/users" element={<SuperAdminUsers />} />
          <Route path="/super-admin/billing" element={<SuperAdminBilling />} />
          <Route path="/super-admin/audit-log" element={<AuditLogPage />} />
          <Route path="/super-admin/permissions" element={<PermissionsConfig />} />

          {/* Agency */}
          <Route path="/agency/dashboard" element={<AgencyDashboard />} />
          <Route path="/agency/organizations" element={<OrganizationsPage />} />
          <Route path="/agency/organizations/:id" element={<OrganizationDetail />} />
          <Route path="/agency/team" element={<TeamMembersPage />} />
          <Route path="/agency/billing" element={<BillingPage />} />
          <Route path="/agency/settings" element={<AgencySettings />} />

          {/* Organization */}
          <Route path="/org/dashboard" element={<OrgDashboard />} />
          <Route path="/org/profiles" element={<OrgProfiles />} />
          <Route path="/org/team" element={<OrgTeam />} />
          <Route path="/org/analytics" element={<OrgAnalytics />} />
          <Route path="/org/inbox" element={<OrgInbox />} />
          <Route path="/org/settings" element={<OrgSettings />} />

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
