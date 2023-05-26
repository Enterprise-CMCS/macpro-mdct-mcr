import { Navigate, Route, Routes } from "react-router-dom";
import { useFlags } from "launchdarkly-react-client-sdk";
// components
import {
  AdminBannerProvider,
  AdminPage,
  DashboardPage,
  ExportedReportPage,
  HelpPage,
  HomePage,
  ReportGetStartedPage,
  NotFoundPage,
  ProfilePage,
  ReportPageWrapper,
} from "components";
import { mcparReportJson } from "forms/mcpar";
import { mlrReportJson } from "forms/mlr";
// utils
import { ReportRoute } from "types";
import { ScrollToTopComponent, useUser } from "utils";
import { Fragment } from "react";

export const AppRoutes = () => {
  const { userIsAdmin, userReports } = useUser().user ?? {};
  const mlrReport = useFlags()?.mlrReport;
  // determine if the user has access to specific reports
  const userReportAccess = {
    MCPAR: userReports?.includes("MCPAR") || userIsAdmin,
    MLR: userReports?.includes("MLR") || userIsAdmin,
  };

  return (
    <main id="main-content" tabIndex={-1}>
      <ScrollToTopComponent />
      <AdminBannerProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/admin"
            element={!userIsAdmin ? <Navigate to="/profile" /> : <AdminPage />}
          />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />

          {/* MCPAR ROUTES */}
          <Route
            path="/mcpar"
            element={
              userReportAccess["MCPAR"] ? (
                <DashboardPage reportType="MCPAR" />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/mcpar/get-started"
            element={
              userReportAccess["MCPAR"] ? (
                <ReportGetStartedPage reportType="MCPAR" />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          {mcparReportJson.flatRoutes.map((route: ReportRoute) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                userReportAccess["MCPAR"] ? (
                  <ReportPageWrapper />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
          ))}
          <Route
            path="/mcpar/export"
            element={
              userReportAccess["MCPAR"] ? (
                <ExportedReportPage />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/mcpar/*"
            element={
              userReportAccess["MCPAR"] ? (
                <Navigate to="/mcpar" />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          {/* MLR ROUTES */}
          {mlrReport && (
            <Fragment>
              <Route
                path="/mlr"
                element={
                  userReportAccess["MLR"] ? (
                    <DashboardPage reportType="MLR" />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
              <Route
                path="/mlr/get-started"
                element={
                  userReportAccess["MLR"] ? (
                    <ReportGetStartedPage reportType="MLR" />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
              {mlrReportJson.flatRoutes.map((route: ReportRoute) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    userReportAccess["MLR"] ? (
                      <ReportPageWrapper />
                    ) : (
                      <Navigate to="/" />
                    )
                  }
                />
              ))}
              <Route
                path="/mlr/export"
                element={
                  userReportAccess["MLR"] ? (
                    <ExportedReportPage />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
            </Fragment>
          )}
        </Routes>
      </AdminBannerProvider>
    </main>
  );
};
