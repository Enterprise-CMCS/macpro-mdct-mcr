import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
// components
import {
  Admin,
  Dashboard,
  Help,
  Home,
  McparReportPage,
  NotFound,
  Profile,
} from "routes";
import { mcparRoutes } from "forms/mcpar";
import { AdminBannerProvider } from "components";
// utils
import { UserRoles } from "types";
import { ScrollToTopComponent } from "utils";

export const AppRoutes = ({ userRole }: Props) => {
  const isAdmin = userRole === UserRoles.ADMIN;

  const elementToComponentMap: any = {
    NotFound: NotFound,
  };

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

          {/* MCPAR REPORT */}
          <Route path="/mcpar" element={<Dashboard />} />
          {mcparRoutes.map((route: any) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                route.element ? (
                  React.createElement(elementToComponentMap[route.element])
                ) : (
                  <McparReportPage pageJson={route.pageJson} />
                )
              }
            />
          ))}
          <Route path="/mcpar/*" element={<Navigate to="/mcpar" />} />

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
