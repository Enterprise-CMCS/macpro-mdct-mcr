import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// components
import { Spinner } from "@cmsgov/design-system";
import { Flex } from "@chakra-ui/react";
import {
  ReportContext,
  McparReviewSubmitPage,
  ModalDrawerReportPage,
  DrawerReportPage,
  PageTemplate,
  Sidebar,
  StandardReportPage,
} from "components";
// utils
import { useUser } from "utils";
import {
  ModalDrawerReportPageShape,
  DrawerReportPageShape,
  PageTypes,
  ReportRoute,
  StandardReportPageShape,
} from "types";

export const ReportPageWrapper = ({ route }: Props) => {
  const { state } = useUser().user ?? {};
  const { report } = useContext(ReportContext);
  const navigate = useNavigate();

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
          <ModalDrawerReportPage route={route as ModalDrawerReportPageShape} />
        );
      case PageTypes.REVIEW_SUBMIT:
        return <McparReviewSubmitPage />;
      default:
        return <StandardReportPage route={route as StandardReportPageShape} />;
    }
  };

  return (
    <PageTemplate type="report">
      <Flex sx={sx.pageContainer}>
        {report ? (
          <>
            <Sidebar />
            <Flex id="report-content" sx={sx.reportContainer}>
              {renderPageSection(route)}
            </Flex>
          </>
        ) : (
          <Flex sx={sx.spinnerContainer}>
            <Spinner size="big" />
          </Flex>
        )}
      </Flex>
    </PageTemplate>
  );
};

interface Props {
  route: ReportRoute;
}

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
