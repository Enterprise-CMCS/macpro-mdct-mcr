import { Navigate, Route, Routes } from "react-router-dom";
// components
import {
  AdminBannerProvider,
  AdminPage,
  DashboardPage,
  ExportedReportPage,
  HelpPage,
  HomePage,
  ReportGetStartedPage,
  NotFoundPage,
  ProfilePage,
  ReportPageWrapper,
} from "components";
import { mcparReportJson } from "forms/mcpar";
import { mlrReportJson } from "forms/mlr";
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
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />

          {/* MCPAR ROUTES */}
          <Route path="/mcpar" element={<DashboardPage reportType="MCPAR" />} />
          <Route
            path="/mcpar/get-started"
            element={<ReportGetStartedPage reportType="MCPAR" />}
          />
          {mcparReportJson.flatRoutes.map((route: ReportRoute) => (
            <Route
              key={route.path}
              path={route.path}
              element={<ReportPageWrapper />}
            />
          ))}
          <Route path="/mcpar/export" element={<ExportedReportPage />} />
          <Route path="/mcpar/*" element={<Navigate to="/mcpar" />} />

          {/* MLR ROUTES */}
          <Route path="/mlr" element={<DashboardPage reportType="MLR" />} />
          <Route
            path="/mlr/get-started"
            element={<ReportGetStartedPage reportType="MLR" />}
          />
          {mlrReportJson.flatRoutes.map((route: ReportRoute) => (
            <Route
              key={route.path}
              path={route.path}
              element={<ReportPageWrapper />}
            />
          ))}
        </Routes>
      </AdminBannerProvider>
    </main>
  );
};
