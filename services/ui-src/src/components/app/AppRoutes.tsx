import { Navigate, Route, Routes } from "react-router-dom";
// components
import {
  Admin,
  Dashboard,
  Help,
  Home,
  McparReportPage,
  NotFound,
  Profile,
} from "routes";
import { mcparRoutes } from "forms/mcpar";
import { AdminBannerProvider } from "components";
// utils
import { UserRoles } from "types";
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

          {/* MCPAR REPORT */}
          <Route path="/mcpar" element={<Dashboard />} />
          {mcparRoutes.map((route: any) =>
            // render form pages
            !route.children ? (
              <Route
                key={route.path}
                path={route.path}
                element={<McparReportPage pageJson={route.pageJson} />}
              />
            ) : (
              // render parent pages
              route.children.map((childRoute: any) => (
                <Route
                  key={childRoute.path}
                  path={childRoute.path}
                  element={<McparReportPage pageJson={childRoute.pageJson} />}
                />
              ))
            )
          )}

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
