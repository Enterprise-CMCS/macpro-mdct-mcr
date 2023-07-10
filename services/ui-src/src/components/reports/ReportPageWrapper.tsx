import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// components
import { Flex, Spinner } from "@chakra-ui/react";
import {
  ReportContext,
  ReviewSubmitPage,
  ModalDrawerReportPage,
  DrawerReportPage,
  PageTemplate,
  Sidebar,
  StandardReportPage,
  ModalOverlayReportPage,
} from "components";
// utils
import { useUser } from "utils";
import {
  ModalDrawerReportPageShape,
  ModalOverlayReportPageShape,
  DrawerReportPageShape,
  PageTypes,
  ReportRoute,
  StandardReportPageShape,
  AnyObject,
} from "types";

export const ReportPageWrapper = () => {
  const { state } = useUser().user ?? {};
  const { report } = useContext(ReportContext);
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

  const renderPageSection = (route: ReportRoute) => {
    switch (route.pageType) {
      case PageTypes.DRAWER:
        return <DrawerReportPage route={route as DrawerReportPageShape} />;
      case PageTypes.MODAL_DRAWER:
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
      case PageTypes.REVIEW_SUBMIT:
        return <ReviewSubmitPage />;
      default:
        return (
          <StandardReportPage
            route={route as StandardReportPageShape}
            validateOnRender={locationState?.validateOnRender}
          />
        );
    }
  };

  const reportTemplate = report?.formTemplate.flatRoutes!.find(
    (route: ReportRoute) => route.path === pathname
  );

  return (
    <PageTemplate type="report">
      <Flex sx={sx.pageContainer}>
        {report ? (
          <>
            <Sidebar isHidden={sidebarHidden} />
            <Flex id="report-content" sx={sx.reportContainer}>
              {reportTemplate && renderPageSection(reportTemplate)}
            </Flex>
          </>
        ) : (
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
    maxWidth: "reportPageWidth",
    marginY: "3.5rem",
    marginLeft: "3.5rem",
    ".mobile &": {
      marginX: "0rem",
    },
    h3: {
      paddingBottom: "0.75rem",
      fontSize: "lg",
      fontWeight: "bold",
    },
  },
  spinnerContainer: {
    alignItems: "center",
    width: "100%",
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
