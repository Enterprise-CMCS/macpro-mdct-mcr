import { Navigate, Route, Routes } from "react-router-dom";
// components
import {
  Admin,
  Dashboard,
  GetStarted,
  Help,
  Home,
  NotFound,
  Profile,
  ReportPage,
  ReviewSubmit,
} from "routes";
import { AdminBannerProvider } from "components";
import { mcparReportJsonFlat as mcparReportJson } from "forms/mcpar";

// utils
import { ReportRoute, UserRoles } from "types";
import { ScrollToTopComponent } from "utils";

export const AppRoutes = ({ userRole }: Props) => {
  const isAdmin = userRole === UserRoles.ADMIN;

  return (
    <main id="main-content" tabIndex={-1}>
      <ScrollToTopComponent />
      <AdminBannerProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/admin"
            element={!isAdmin ? <Navigate to="/profile" /> : <Admin />}
          />
          <Route path="/help" element={<Help />} />

          {/* MCPAR ROUTES */}
          <Route path="/mcpar" element={<Dashboard />} />
          <Route path="/mcpar/get-started" element={<GetStarted />} />
          {mcparReportJson.routes.map((route: ReportRoute) => {
            return (
              route.form &&
              route.page && (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <ReportPage reportJson={mcparReportJson} route={route} />
                  }
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

interface Props {
  userRole?: string;
}
