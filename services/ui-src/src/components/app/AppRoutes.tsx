import { Route, Routes } from "react-router-dom";
import { Admin, Help, Home, NotFound, Profile } from "../../views";
import { AdminBannerShape } from "utils/types/types";

export const AppRoutes = ({ adminBanner }: Props) => (
  <main id="main-wrapper">
    <Routes>
      <Route path="/" element={<Home adminBanner={adminBanner} />} />
      <Route path="/admin" element={<Admin adminBanner={adminBanner} />} />
      <Route path="/help" element={<Help />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </main>
);

interface Props {
  adminBanner: AdminBannerShape;
}
