import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
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

import ClientLayout from "./components/layout/ClientLayout";
import ClientDashboardPage from "./pages/client/ClientDashboardPage";
import ClientProjectsPage from "./pages/client/ClientProjectsPage";
import ClientTeamPage from "./pages/client/ClientTeamPage";
import DashboardPage from "./pages/client/DashboardPage";
import ConnectPage from "./pages/client/ConnectPage";
import CreatePage from "./pages/client/CreatePage";
import PublishPage from "./pages/client/PublishPage";
import EngagePage from "./pages/client/EngagePage";
import AnalyzePage from "./pages/client/AnalyzePage";
import PromotePage from "./pages/client/PromotePage";
import ListenPage from "./pages/client/ListenPage";
import LocationsPage from "./pages/client/LocationsPage";
import ClientSettingsPage from "./pages/client/SettingsPage";

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
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
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

          {/* Client — two-level navigation */}
          <Route element={<ClientLayout />}>
            {/* Client-level pages (no project selected) */}
            <Route path="/client/dashboard" element={<ClientDashboardPage />} />
            <Route path="/client/projects" element={<ClientProjectsPage />} />
            <Route path="/client/team" element={<ClientTeamPage />} />

            {/* Project-level pages (project selected from dropdown) */}
            <Route path="/client/project/dashboard" element={<DashboardPage />} />
            <Route path="/client/project/team" element={<ClientTeamPage />} />
            <Route path="/client/connect" element={<ConnectPage />} />
            <Route path="/client/create" element={<CreatePage />} />
            <Route path="/client/publish" element={<PublishPage />} />
            <Route path="/client/engage" element={<EngagePage />} />
            <Route path="/client/analyze" element={<AnalyzePage />} />
            <Route path="/client/promote" element={<PromotePage />} />
            <Route path="/client/listen" element={<ListenPage />} />
            <Route path="/client/locations" element={<LocationsPage />} />
            <Route path="/client/settings" element={<ClientSettingsPage />} />
            <Route path="/client/settings/profile" element={<ClientSettingsPage defaultTab="profile" />} />
            <Route path="/client/settings/billing" element={<ClientSettingsPage defaultTab="billing" />} />
            <Route path="/client/settings/team" element={<ClientSettingsPage defaultTab="team" />} />
            <Route path="/client/settings/notifications" element={<ClientSettingsPage defaultTab="notifications" />} />
            <Route path="/client/settings/hashtags" element={<ClientSettingsPage defaultTab="hashtags" />} />
            <Route path="/client/settings/saved-replies" element={<ClientSettingsPage defaultTab="saved-replies" />} />
            <Route path="/client/settings/tags" element={<ClientSettingsPage defaultTab="tags" />} />
            <Route path="/client/settings/security" element={<ClientSettingsPage defaultTab="security" />} />
            <Route path="/client/customization" element={<div className="text-muted-foreground">Customization settings coming soon.</div>} />
          </Route>

          {/* Legacy org routes → redirect */}
          <Route path="/org/dashboard" element={<Navigate to="/client/dashboard" replace />} />
          <Route path="/org/profiles" element={<Navigate to="/client/connect" replace />} />
          <Route path="/org/team" element={<Navigate to="/client/settings/team" replace />} />
          <Route path="/org/analytics" element={<Navigate to="/client/analyze" replace />} />
          <Route path="/org/inbox" element={<Navigate to="/client/engage" replace />} />
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
