import { Route, Routes } from "react-router-dom";
import { Home, NotFound } from "../../views";

export const AppRoutes = () => (
  <main id="main-wrapper">
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </main>
);
