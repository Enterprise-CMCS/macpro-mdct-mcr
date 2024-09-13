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
  ReportContext,
} from "components";
// utils
import { ReportRoute, ReportType } from "types";
import { ScrollToTopComponent, useStore } from "utils";
import { Fragment, useContext } from "react";
import { Flex, Spinner } from "@chakra-ui/react";

export const AppRoutes = () => {
  const { userIsAdmin } = useStore().user ?? {};
  const { report } = useStore();
  const { contextIsLoaded } = useContext(ReportContext);

  // LaunchDarkly
  const mlrReport = useFlags()?.mlrReport;
  const naaarReport = useFlags()?.naaarReport;

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
          <Route path="/mcpar" element={<DashboardPage reportType="MCPAR" />} />
          <Route
            path="/mcpar/get-started"
            element={<ReportGetStartedPage reportType="MCPAR" />}
          />
          {report?.reportType === ReportType.MCPAR && (
            <>
              {(report.formTemplate.flatRoutes ?? []).map(
                (route: ReportRoute) => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={<ReportPageWrapper />}
                  />
                )
              )}
              <Route path="/mcpar/export" element={<ExportedReportPage />} />
            </>
          )}
          <Route
            path="/mcpar/*"
            element={
              !contextIsLoaded ? (
                <Flex sx={sx.spinnerContainer}>
                  <Spinner size="lg" />
                </Flex>
              ) : (
                <Navigate to="/mcpar" />
              )
            }
          />

          {/* MLR ROUTES */}
          {mlrReport && (
            <Fragment>
              <Route path="/mlr" element={<DashboardPage reportType="MLR" />} />
              {report?.reportType === ReportType.MLR && (
                <>
                  {(report.formTemplate.flatRoutes ?? []).map(
                    (route: ReportRoute) => (
                      <Route
                        key={route.path}
                        path={route.path}
                        element={<ReportPageWrapper />}
                      />
                    )
                  )}
                  <Route path="/mlr/export" element={<ExportedReportPage />} />
                </>
              )}
              <Route
                path="/mlr/*"
                element={
                  !contextIsLoaded ? (
                    <Flex sx={sx.spinnerContainer}>
                      <Spinner size="lg" />
                    </Flex>
                  ) : (
                    <Navigate to="/mlr" />
                  )
                }
              />
            </Fragment>
          )}

          {/* NAAAR Routes */}
          {naaarReport && (
            <Fragment>
              <Route
                path="/naaar"
                element={<DashboardPage reportType="NAAAR" />}
              />
              {report?.reportType === ReportType.NAAAR && (
                <>
                  {(report.formTemplate.flatRoutes ?? []).map(
                    (route: ReportRoute) => (
                      <Route
                        key={route.path}
                        path={route.path}
                        element={<ReportPageWrapper />}
                      />
                    )
                  )}
                  <Route
                    path="/naaar/export"
                    element={<ExportedReportPage />}
                  />
                </>
              )}
              <Route
                path="/naaar/*"
                element={
                  !contextIsLoaded ? (
                    <Flex sx={sx.spinnerContainer}>
                      <Spinner size="lg" />
                    </Flex>
                  ) : (
                    <Navigate to="/mlr" />
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

const sx = {
  spinnerContainer: {
    alignItems: "center",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    padding: "10",

    ".ds-c-spinner": {
      "&:before": {
        borderColor: "palette.black",
      },
      "&:after": {
        borderLeftColor: "palette.black",
      },
    },
  },
};
