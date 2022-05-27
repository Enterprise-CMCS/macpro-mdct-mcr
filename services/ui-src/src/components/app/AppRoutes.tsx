import { Navigate, Route, Routes } from "react-router-dom";
import { Admin, Help, Home, NotFound, Profile } from "../../views";
// components
import { AdminBanner } from "components/banners/AdminBanner";
// utils
import { UserRoles } from "utils/types/types";

export const AppRoutes = ({ userRole }: Props) => {
  const isAdmin = userRole === UserRoles.ADMIN;
  const adminBanner = AdminBanner();

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
  userRole: string;
}
