import { Flex, Spinner } from "@chakra-ui/react";
import { ExportedReportPage } from "components/pages/Export/ExportedReportPage";
import { NotFoundPage } from "components/pages/NotFound/NotFoundPage";
import { ReportPageWrapper } from "components/reports/ReportPageWrapper";
import { ReportContext } from "components/reports/ReportProvider";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ReportKeys, ReportShape } from "types";
import { removeReportSpecificPath } from "utils/reports/pathFormatter";

export const ReportLoader = ({ exportView = false }) => {
  const { reportType, state, reportId, pageId } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { fetchReport, setReportSelection } = useContext(ReportContext);
  const navigate = useNavigate();

  const loadAndEnter = async () => {
    if (!reportId || !state || !reportType) {
      return;
    }
    setIsLoading(true);
    const reportKeys: ReportKeys = {
      reportType: reportType,
      state: state,
      id: reportId,
    };
    const selectedReport: ReportShape = await fetchReport(reportKeys);
    // if no page provided, find first page
    if (!exportView && (!pageId || pageId === "")) {
      const firstReportPagePath =
        selectedReport.formTemplate.flatRoutes![0].path;

      const path = removeReportSpecificPath(firstReportPagePath);
      navigate(`/report/${reportType}/${state}/${reportId}/${path}`);
    }
    setReportSelection(selectedReport);
    setIsLoading(false);
  };

  useEffect(() => {
    loadAndEnter();
  }, []);

  if (isLoading)
    return (
      <Flex sx={sx.spinnerContainer}>
        <Spinner size="lg" />
      </Flex>
    );
  return exportView ? <ExportedReportPage /> : <ReportPageWrapper />;
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
        borderColor: "black",
      },
      "&:after": {
        borderLeftColor: "black",
      },
    },
  },
};
