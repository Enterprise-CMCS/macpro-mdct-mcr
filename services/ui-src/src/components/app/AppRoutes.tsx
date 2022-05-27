import { Navigate, Route, Routes } from "react-router-dom";
import { Admin, Help, Home, NotFound, Profile } from "../../views";
// utils
import { UserRoles } from "utils/types/types";
import {
  AdminBannerProvider,
  AdminBannerContext,
} from "components/banners/AdminBannerProvider";

export const AppRoutes = ({ userRole }: Props) => {
  const isAdmin = userRole === UserRoles.ADMIN;

  return (
    <main id="main-wrapper">
      <AdminBannerProvider>
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
      </AdminBannerProvider>
    </main>
  );
};

interface Props {
  userRole: string;
}
