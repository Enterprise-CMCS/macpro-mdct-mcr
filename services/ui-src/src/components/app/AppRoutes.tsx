import { Navigate, Route, Routes, useLocation } from "react-router";
import { Fragment, useContext } from "react";
import { Box, Flex, Spinner } from "@chakra-ui/react";
// components
import {
  AdminBannerProvider,
  AdminPage,
  DashboardPage,
  HelpPage,
  HomePage,
  ReportGetStartedPage,
  NotFoundPage,
  ProfilePage,
  ReportContext,
  ComponentInventoryPage,
} from "components";
// utils
import { ScrollToTopComponent, useStore } from "utils";
import { useFlags } from "launchdarkly-react-client-sdk";
import { ReportLoader } from "./ReportLoader";

export const AppRoutes = () => {
  const { userIsAdmin } = useStore().user ?? {};
  const { contextIsLoaded, isReportPage } = useContext(ReportContext);

  const { pathname } = useLocation();
  const isExportPage = pathname.includes("/export");
  const hasNav = isReportPage && !isExportPage;
  const boxElement = hasNav ? "div" : "main";

  // LaunchDarkly
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

          {/* Reports */}
          <Route
            path="/report/:reportType/:state/:reportId/:pageId?/*"
            element={<ReportLoader />}
          />
          <Route
            path="/export/:reportType/:state/:reportId"
            element={<ReportLoader exportView={true} />}
          />

          {/* MCPAR ROUTES */}
          <Route path="/mcpar" element={<DashboardPage reportType="MCPAR" />} />
          <Route
            path="/mcpar/get-started"
            element={<ReportGetStartedPage reportType="MCPAR" />}
          />
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
          <Fragment>
            <Route
              path="/naaar"
              element={<DashboardPage reportType="NAAAR" />}
            />
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
