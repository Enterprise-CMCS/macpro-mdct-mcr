import { Navigate, Route, Routes } from "react-router-dom";
import { Admin, Help, Home, NotFound, Profile } from "../../views";
// components
import { AdminBannerContext } from "components";
// utils
import { UserRoles } from "utils/types/types";

export const AppRoutes = ({ userRole }: Props) => {
  const isAdmin = userRole === UserRoles.ADMIN;

  return (
    <main id="main-wrapper">
      <Routes>
        <Route
          path="/"
          element={
            <AdminBannerContext.Consumer>
              {(adminBanner) => <Home adminBanner={adminBanner} />}
            </AdminBannerContext.Consumer>
          }
        />
        <Route
          path="/admin"
          element={
            !isAdmin ? (
              <Navigate to="/profile" />
            ) : (
              <AdminBannerContext.Consumer>
                {(adminBanner) => <Admin adminBanner={adminBanner} />}
              </AdminBannerContext.Consumer>
            )
          }
        />
        <Route path="/help" element={<Help />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  );
};

interface Props {
  userRole: string;
}
