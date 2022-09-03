import { Navigate, Route, Routes } from "react-router-dom";
// components
import {
  Admin,
  Dashboard,
  GetStarted,
  Help,
  Home,
  McparReportPage,
  NotFound,
  Profile,
  ReviewSubmit,
} from "routes";
import { AdminBannerProvider } from "components";
import { mcparRoutesFlatArray as mcparRoutes } from "forms/mcpar";

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
          <Route path="/mcpar/dashboard" element={<Dashboard />} />
          <Route path="/mcpar/get-started" element={<GetStarted />} />
          {mcparRoutes.map((route: ReportRoute) => {
            return (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <McparReportPage
                    path={route.path}
                    page={route.page || undefined}
                    form={route.form || undefined}
                  />
                }
              />
            );
          })}
          <Route path="/mcpar/review-and-submit" element={<ReviewSubmit />} />
          <Route path="/mcpar" element={<Navigate to="/mcpar/dashboard" />} />
          <Route path="/mcpar/*" element={<Navigate to="/mcpar/dashboard" />} />

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
