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

          {/* MCPAR ROUTES */}
          <Route
            path="/mcpar"
            element={
              userHasAccess ? (
                <DashboardPage reportType="MCPAR" />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/mcpar/get-started"
            element={
              userHasAccess ? (
                <ReportGetStartedPage reportType="MCPAR" />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          {report?.reportType === ReportType.MCPAR && (
            <>
              {(report.formTemplate.flatRoutes ?? []).map(
                (route: ReportRoute) => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={
                      userHasAccess ? (
                        <ReportPageWrapper />
                      ) : (
                        <Navigate to="/" />
                      )
                    }
                  />
                )
              )}
              <Route
                path="/mcpar/export"
                element={
                  userHasAccess ? <ExportedReportPage /> : <Navigate to="/" />
                }
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
              ) : userHasAccess ? (
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
                  userHasAccess ? (
                    <DashboardPage reportType="MLR" />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
              <Route
                path="/mlr/get-started"
                element={
                  userHasAccess ? (
                    <ReportGetStartedPage reportType="MLR" />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
              {report?.reportType === ReportType.MLR && (
                <>
                  {(report.formTemplate.flatRoutes ?? []).map(
                    (route: ReportRoute) => (
                      <Route
                        key={route.path}
                        path={route.path}
                        element={
                          userHasAccess ? (
                            <ReportPageWrapper />
                          ) : (
                            <Navigate to="/" />
                          )
                        }
                      />
                    )
                  )}
                  <Route
                    path="/mlr/export"
                    element={
                      userHasAccess ? (
                        <ExportedReportPage />
                      ) : (
                        <Navigate to="/" />
                      )
                    }
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
                  ) : userHasAccess ? (
                    <Navigate to="/mlr" />
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
