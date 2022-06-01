import { Navigate, Route, Routes } from "react-router-dom";
import { Admin, Help, Home, NotFound, Profile } from "../../views";
// utils
import { AdminBannerShape, UserRoles } from "utils/types/types";

export const AppRoutes = ({ adminBanner, userRole }: Props) => {
  const isAdmin = userRole === UserRoles.ADMIN;
  return (
    <main id="main-wrapper">
      <Routes>
        <Route path="/" element={<Home adminBanner={adminBanner} />} />
        <Route
          path="/admin"
          element={
            !isAdmin ? (
              <Navigate to="/profile" />
            ) : (
              <Admin adminBanner={adminBanner} />
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
  adminBanner: AdminBannerShape;
  userRole: string;
}
