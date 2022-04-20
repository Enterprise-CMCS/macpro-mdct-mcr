import { Route, Routes } from "react-router-dom";
import * as Views from "views";

export const AppRoutes = () => (
  <main id="main-wrapper">
    <Routes>
      <Route path="/" element={<Views.Home />} />
      <Route path="*" element={<Views.NotFound />} />
    </Routes>
  </main>
);
