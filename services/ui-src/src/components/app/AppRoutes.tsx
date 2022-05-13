import { Route, Routes } from "react-router-dom";
import { Help, Home, NotFound, Profile } from "../../views";

export const AppRoutes = () => (
  <main id="main-wrapper">
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/help" element={<Help />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </main>
);
