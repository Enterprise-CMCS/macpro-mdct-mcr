import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
// components
import { Flex, Spinner } from "@chakra-ui/react";
import {
  ReviewSubmitPage,
  ModalDrawerReportPage,
  DrawerReportPage,
  PageTemplate,
  Sidebar,
  StandardReportPage,
  ModalOverlayReportPage,
  OverlayProvider,
  NotFoundPage,
} from "components";
// types
import {
  ModalDrawerReportPageShape,
  ModalOverlayReportPageShape,
  DrawerReportPageShape,
  PageTypes,
  ReportRoute,
  StandardReportPageShape,
  AnyObject,
  OverlayReportPageShape,
} from "types";
// utils
import { useStore } from "utils";
import { OverlayReportPage } from "./OverlayReportPage";
import {
  removeReportSpecificPath,
  uriPathToPagePath,
} from "utils/reports/pathFormatter";

export const ReportPageWrapper = () => {
  const { user: state, report } = useStore();
  const [sidebarHidden, setSidebarHidden] = useState<boolean>(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const locationState = useLocation().state as AnyObject;

  // get state and id from context or storage
  const reportId = report?.id || localStorage.getItem("selectedReport");
  const reportState = state || localStorage.getItem("selectedState");
  const reportBasePath =
    report?.formTemplate.basePath ||
    localStorage.getItem("selectedReportBasePath");

  useEffect(() => {
    // if no report, redirect to report base path or homepage
    if (!reportId || !reportState || report?.archived) {
      navigate(reportBasePath || "/");
    }
  }, [report, reportId, reportState]);

  const showSidebar = () => {
    if (sidebarHidden) setSidebarHidden(false);
  };

  const renderPageSection = (route: ReportRoute) => {
    switch (route.pageType) {
      case PageTypes.DRAWER:
        showSidebar();
        return (
          <DrawerReportPage
            route={route as DrawerReportPageShape}
            validateOnRender={locationState?.validateOnRender}
          />
        );
      case PageTypes.MODAL_DRAWER:
        showSidebar();
        return (
          <ModalDrawerReportPage
            route={route as ModalDrawerReportPageShape}
            validateOnRender={locationState?.validateOnRender}
          />
        );
      case PageTypes.MODAL_OVERLAY:
        return (
          <ModalOverlayReportPage
            route={route as ModalOverlayReportPageShape}
            setSidebarHidden={setSidebarHidden}
            validateOnRender={locationState?.validateOnRender}
          />
        );
      case PageTypes.PLAN_OVERLAY:
        return (
          <OverlayProvider>
            <OverlayReportPage
              route={route as OverlayReportPageShape}
              setSidebarHidden={setSidebarHidden}
              validateOnRender={locationState?.validateOnRender}
            />
          </OverlayProvider>
        );
      case PageTypes.REVIEW_SUBMIT:
        showSidebar();
        return <ReviewSubmitPage />;
      default:
        showSidebar();
        return (
          <StandardReportPage
            route={route as StandardReportPageShape}
            validateOnRender={locationState?.validateOnRender}
          />
        );
    }
  };

  // There is implied logic here based on transforming the path listed in the template against the url
  const pagePath = uriPathToPagePath(pathname);
  const reportTemplate = report?.formTemplate.flatRoutes!.find(
    (route: ReportRoute) => removeReportSpecificPath(route.path) === pagePath
  );
  if (!reportTemplate) {
    return <NotFoundPage />;
  }

  return (
    <PageTemplate section={false} type="report">
      <Flex sx={sx.pageContainer}>
        {report ? (
          <>
            <Sidebar isHidden={sidebarHidden} />
            <Flex
              as="main"
              id="report-content"
              sx={{
                ...sx.reportContainer,
                ...(sidebarHidden ? sx.reportWideWidth : sx.reportWidth),
              }}
            >
              {reportTemplate && renderPageSection(reportTemplate)}
            </Flex>
          </>
        ) : (
          /*
           * This spinner is a fallback; it should never show.
           * We only render ReportPageWrapper inside report routes,
           * and we can only know report routes by looking at
           * the currently-loaded report.
           */
          <Flex sx={sx.spinnerContainer}>
            <Spinner size="lg" />
          </Flex>
        )}
      </Flex>
    </PageTemplate>
  );
};

const sx = {
  pageContainer: {
    width: "100%",
    height: "100%",
  },
  reportContainer: {
    flexDirection: "column",
    width: "100%",
    marginY: "spacer7",
    marginLeft: "spacer7",
    ".mobile &": {
      marginX: "0rem",
    },
    h3: {
      paddingBottom: "0.75rem",
      fontSize: "lg",
      fontWeight: "bold",
    },
  },
  reportWidth: {
    maxWidth: "reportPageWidth",
  },
  reportWideWidth: {
    maxWidth: "45rem",
  },
  spinnerContainer: {
    alignItems: "center",
    width: "100%",
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
