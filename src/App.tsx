import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import OnboardingPage from "./pages/OnboardingPage";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import SuperAdminOrganizations from "./pages/SuperAdminOrganizations";
import SuperAdminUsers from "./pages/SuperAdminUsers";
import SuperAdminBilling from "./pages/SuperAdminBilling";
import AgenciesPage from "./pages/AgenciesPage";
import AuditLogPage from "./pages/AuditLogPage";
import SuperAdminSettings from "./pages/SuperAdminSettings";

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
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/register/agency" element={<AgencyRegistration />} />
          <Route path="/register/client" element={<StandaloneOrgRegistration />} />
          <Route path="/onboarding" element={<OnboardingPage />} />

          {/* Super Admin */}
          <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} />
          <Route path="/super-admin/agencies" element={<AgenciesPage />} />
          <Route path="/super-admin/clients" element={<SuperAdminOrganizations />} />
          <Route path="/super-admin/users" element={<SuperAdminUsers />} />
          <Route path="/super-admin/billing" element={<SuperAdminBilling />} />
          <Route path="/super-admin/audit-log" element={<AuditLogPage />} />
          <Route path="/super-admin/settings" element={<SuperAdminSettings />} />

          {/* Agency */}
          <Route path="/agency/dashboard" element={<AgencyDashboard />} />
          <Route path="/agency/clients" element={<OrganizationsPage />} />
          <Route path="/agency/clients/:id" element={<OrganizationDetail />} />
          <Route path="/agency/team" element={<TeamMembersPage />} />
          <Route path="/agency/billing" element={<BillingPage />} />
          <Route path="/agency/settings" element={<AgencySettings />} />

          {/* Client (formerly Organization) */}
          <Route path="/client/dashboard" element={<OrgDashboard />} />
          <Route path="/client/profiles" element={<OrgProfiles />} />
          <Route path="/client/team" element={<OrgTeam />} />
          <Route path="/client/analytics" element={<OrgAnalytics />} />
          <Route path="/client/inbox" element={<OrgInbox />} />
          <Route path="/client/settings" element={<OrgSettings />} />

          {/* Legacy org routes → redirect */}
          <Route path="/org/dashboard" element={<Navigate to="/client/dashboard" replace />} />
          <Route path="/org/profiles" element={<Navigate to="/client/profiles" replace />} />
          <Route path="/org/team" element={<Navigate to="/client/team" replace />} />
          <Route path="/org/analytics" element={<Navigate to="/client/analytics" replace />} />
          <Route path="/org/inbox" element={<Navigate to="/client/inbox" replace />} />
          <Route path="/org/settings" element={<Navigate to="/client/settings" replace />} />

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