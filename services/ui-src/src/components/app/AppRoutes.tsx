import { Navigate, Route, Routes } from "react-router-dom";
// components
import {
  Admin,
  GetStarted,
  Help,
  Home,
  NotFound,
  Profile,
  ReviewSubmit,
} from "routes";
import { AdminBannerProvider, DashboardPage, ReportPage } from "components";
import { mcparReportRoutesFlat } from "forms/mcpar";
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
          <Route path="/" element={<Home />} />
          <Route
            path="/admin"
            element={!userIsAdmin ? <Navigate to="/profile" /> : <Admin />}
          />
          <Route path="/help" element={<Help />} />

          {/* MCPAR ROUTES */}
          <Route path="/mcpar" element={<DashboardPage />} />
          <Route path="/mcpar/get-started" element={<GetStarted />} />
          {mcparReportRoutesFlat.map((route: ReportRoute) => {
            return (
              route.form &&
              route.page && (
                <Route
                  key={route.path}
                  path={route.path}
                  element={<ReportPage route={route} />}
                />
              )
            );
          })}
          <Route path="/mcpar/review-and-submit" element={<ReviewSubmit />} />
          <Route path="/mcpar/*" element={<Navigate to="/mcpar" />} />

          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AdminBannerProvider>
    </main>
  );
};
