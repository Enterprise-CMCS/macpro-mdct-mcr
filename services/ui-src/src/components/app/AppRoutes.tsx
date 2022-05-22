import { Route, Routes } from "react-router-dom";
import { Admin, Help, Home, NotFound, Profile } from "../../views";
import { AdminBanner } from "components/banners/AdminBanner";

export const AppRoutes = () => (
  <main id="main-wrapper">
    <Routes>
      <Route path="/" element={<Home adminBanner={AdminBanner()} />} />
      <Route path="/admin" element={<Admin adminBanner={AdminBanner()} />} />
      <Route path="/help" element={<Help />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </main>
);
