import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useFlags } from "launchdarkly-react-client-sdk";
import { Fragment, useContext } from "react";
import { Box, Flex, Spinner } from "@chakra-ui/react";
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
  ComponentInventoryPage,
} from "components";
// types
import { ReportRoute, ReportType } from "types";
// utils
import { ScrollToTopComponent, useStore } from "utils";

export const AppRoutes = () => {
  const { userIsAdmin } = useStore().user ?? {};
  const { report } = useStore();
  const { contextIsLoaded, isReportPage } = useContext(ReportContext);

  const { pathname } = useLocation();
  const isExportPage = pathname.includes("/export");
  const hasNav = isReportPage && !isExportPage;
  const boxElement = hasNav ? "div" : "main";

  // LaunchDarkly
  const naaarReport = useFlags()?.naaarReport;
  const componentInventoryEnabled = useFlags()?.componentInventory;

  return (
    <Box
      as={boxElement}
      id="main-content"
      data-testid="main-content"
      sx={sx.mainContainer}
      tabIndex={-1}
    >
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
          <Route path="/mlr" element={<DashboardPage reportType="MLR" />} />
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
                    <Navigate to="/naaar" />
                  )
                }
              />
            </Fragment>
          )}

          {/* Component Inventory Routes */}
          {componentInventoryEnabled && (
            <Route
              path="/component-inventory"
              element={<ComponentInventoryPage />}
            />
          )}
        </Routes>
      </AdminBannerProvider>
    </Box>
  );
};

const sx = {
  mainContainer: {
    maxWidth: "100%",
  },
  spinnerContainer: {
    alignItems: "center",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    padding: "10",

    ".ds-c-spinner": {
      "&:before": {
        borderColor: "black",
      },
      "&:after": {
        borderLeftColor: "black",
      },
    },
  },
};
