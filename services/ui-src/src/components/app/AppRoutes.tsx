import { Navigate, Route, Routes } from "react-router-dom";
import { Admin, Dashboard, Help, Home, NotFound, Profile } from "routes";
// components
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
          {/* TODO: Change /mcpar element during program creation ticket work */}
          <Route path="/mcpar" element={<Dashboard />} />
          <Route
            path="/mcpar/program-information/point-of-contact"
            element={<Dashboard />}
          />
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
