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
  const { userIsAdmin, userIsEndUser } = useStore().user ?? {};
  const { report, contextIsLoaded } = useContext(ReportContext);

  // LaunchDarkly
  const mlrReport = useFlags()?.mlrReport;

  /*
   * Verifying whether a user has the required roles / access to MCR reports
   * NOTE: It is possible for a user to be authorized via IDM, but not have an end-user (state) role OR an admin-type role
   * due to their role type being deprecated, for example, such as with the STATE REP role.
   */
  const userHasAccess = userIsAdmin || userIsEndUser;

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

          {!userHasAccess ? (
            <Navigate to="/" />
          ) : (
            <>
              {/* MCPAR ROUTES */}
              <Route
                path="/mcpar"
                element={<DashboardPage reportType="MCPAR" />}
              />
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
                  <Route
                    path="/mcpar/export"
                    element={<ExportedReportPage />}
                  />
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
                  <Route
                    path="/mlr"
                    element={<DashboardPage reportType="MLR" />}
                  />
                  <Route
                    path="/mlr/get-started"
                    element={<ReportGetStartedPage reportType="MLR" />}
                  />
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
                      <Route
                        path="/mlr/export"
                        element={<ExportedReportPage />}
                      />
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
            </>
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
