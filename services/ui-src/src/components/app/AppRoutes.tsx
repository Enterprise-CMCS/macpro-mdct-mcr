import { Navigate, Route, Routes } from "react-router-dom";
import {
  Admin,
  Dashboard,
  Help,
  Home,
  McparReportPage,
  NotFound,
  Profile,
} from "routes";
// components
import { AdminBannerProvider } from "components";
// utils
import { UserRoles } from "types";
import { ScrollToTopComponent } from "utils";

import { mcparReportPages } from "verbiage/forms/mcparPages";

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
          <Route path="/mcpar" element={<Dashboard />} />
          {mcparReportPages.map((page) => (
            <Route
              key={page.path}
              path={`/mcpar${page.path}`}
              element={<McparReportPage pageJson={page} />}
            />
          ))}
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
