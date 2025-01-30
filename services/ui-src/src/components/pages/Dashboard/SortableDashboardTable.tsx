import { useMemo } from "react";
// components
import { Box, Button, Spinner } from "@chakra-ui/react";
import { SortableTable } from "components";
// types
import { ReportMetadataShape } from "types";
// utils
import { convertDateUtcToEt } from "utils";
import {
  AdminArchiveButton,
  AdminReleaseButton,
  DashboardTableProps,
  EditReportButton,
  getStatus,
} from "./DashboardTableUtils";
import { generateColumns } from "components/tables/SortableTable";

export const SortableDashboardTable = ({
  reportsByState,
  reportType,
  reportId,
  body,
  openAddEditReportModal,
  enterSelectedReport,
  archiveReport,
  archiving,
  entering,
  releaseReport,
  releasing,
  sxOverride,
  isStateLevelUser,
  isAdmin,
}: DashboardTableProps) => {
  const content = body.table;
  const data = useMemo(
    () =>
      reportsByState.map((report) => {
        const {
          lastAlteredBy,
          programName,
          submissionCount,
          submissionName,
          status,
          ...rest
        } = report;
        return {
          editedBy: lastAlteredBy || "-",
          name: submissionName || programName,
          planType:
            report["planTypeIncludedInProgram"]?.[0].value === "Other, specify"
              ? report["planTypeIncludedInProgram-otherText"]
              : report.planTypeIncludedInProgram?.[0].value,
          status: getStatus(status, report.archived, submissionCount),
          submissionCount: submissionCount === 0 ? 1 : submissionCount,
          // Original report shape to pass to cell components
          originalReportData: report,
          ...rest,
        };
      }),
    [reportsByState]
  );

  const generateCells = (
    headerId: string,
    cellValue: any,
    originalRowData: SortableReportShape
  ) => {
    const { originalReportData } = originalRowData;

    switch (headerId) {
      case "edit": {
        return isStateLevelUser && !originalReportData.locked ? (
          <EditReportButton
            report={originalReportData}
            openAddEditReportModal={openAddEditReportModal}
            sxOverride={sxOverride}
          />
        ) : null;
      }
      case "name":
        return (
          <Box as="span" sx={sxOverride.programNameText}>
            {cellValue}
          </Box>
        );
      case "dueDate":
      case "lastAltered":
        return convertDateUtcToEt(cellValue);
      case "actions": {
        return (
          <Box display="inline" sx={sxOverride.editReportButtonCell}>
            <Button
              variant="outline"
              data-testid="enter-report"
              onClick={() => enterSelectedReport(originalReportData)}
              isDisabled={originalReportData.archived}
            >
              {entering && reportId === originalReportData.id ? (
                <Spinner size="md" />
              ) : isStateLevelUser && !originalReportData.locked ? (
                "Edit"
              ) : (
                "View"
              )}
            </Button>
          </Box>
        );
      }
      case "adminRelease": {
        return (
          <AdminReleaseButton
            report={originalReportData}
            reportType={reportType}
            reportId={reportId}
            releaseReport={releaseReport}
            releasing={releasing}
            sxOverride={sxOverride}
          />
        );
      }
      case "adminArchive": {
        return (
          <AdminArchiveButton
            report={originalReportData}
            reportType={reportType}
            reportId={reportId}
            archiveReport={archiveReport}
            archiving={archiving}
            sxOverride={sxOverride}
          />
        );
      }
      default:
        return cellValue;
    }
  };

  const columns = generateColumns<SortableReportShape>(
    content.sortableHeadRow,
    isAdmin,
    generateCells
  );

  return (
    <SortableTable
      columns={columns}
      data={data}
      content={content}
      initialSorting={[{ id: "name", desc: false }]}
      sxOverride={sxOverride}
      sx={sx.table}
    />
  );
};

interface SortableReportShape extends ReportMetadataShape {
  editedBy: string;
  name: string;
  planType?: string;
  originalReportData: ReportMetadataShape;
}

const sx = {
  table: {
    marginBottom: "2.5rem",
    th: {
      padding: "0.5rem 0.75rem",
      borderBottom: "1px solid",
      borderColor: "palette.gray_light",
      color: "palette.gray_medium",
      fontWeight: "bold",
    },
    tr: {
      borderBottom: "1px solid",
      borderColor: "palette.gray_light",
    },
    td: {
      padding: "0.5rem 0.75rem",
      borderTop: "1px solid",
      borderBottom: "1px solid",
      borderColor: "palette.gray_light",
      textAlign: "left",
      "&:last-of-type": {
        paddingRight: 0,
      },
    },
  },
};
