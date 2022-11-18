import { Navigate, Route, Routes } from "react-router-dom";
// components
import {
  AdminBannerProvider,
  AdminPage,
  DashboardPage,
  HelpPage,
  HomePage,
  McparGetStartedPage,
  NotFoundPage,
  ProfilePage,
  ReportPageWrapper,
} from "components";
import { mcparReportJson } from "forms/mcpar";
// utils
import { ReportRoute } from "types";
import { ScrollToTopComponent, useUser } from "utils";

export const AppRoutes = () => {
  const { userIsAdmin } = useUser().user ?? {};
  return (
    <main id="main-content" tabIndex={-1}>
      <ScrollToTopComponent />
      <AdminBannerProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/admin"
            element={!userIsAdmin ? <Navigate to="/profile" /> : <AdminPage />}
          />
          <Route path="/help" element={<HelpPage />} />

          {/* MCPAR ROUTES */}
          <Route path="/mcpar" element={<DashboardPage reportType="MCPAR" />} />
          <Route path="/mcpar/get-started" element={<McparGetStartedPage />} />
          {mcparReportJson.flatRoutes.map((route: ReportRoute) => (
            <Route
              key={route.path}
              path={route.path}
              element={<ReportPageWrapper />}
            />
          ))}
          <Route path="/mcpar/*" element={<Navigate to="/mcpar" />} />

          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AdminBannerProvider>
    </main>
  );
};
