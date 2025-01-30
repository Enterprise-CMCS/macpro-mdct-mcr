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
          report,
          ...rest,
        };
      }),
    [reportsByState]
  );

  const customCells = (
    id: string,
    value: any,
    originalRowData: SortableReportShape
  ) => {
    const { report } = originalRowData;

    switch (id) {
      case "edit": {
        return isStateLevelUser && !report.locked ? (
          <EditReportButton
            report={report}
            openAddEditReportModal={openAddEditReportModal}
            sxOverride={sxOverride}
          />
        ) : null;
      }
      case "name":
        return (
          <Box as="span" sx={sxOverride.programNameText}>
            {value}
          </Box>
        );
      case "dueDate":
      case "lastAltered":
        return convertDateUtcToEt(value);
      case "actions": {
        return (
          <Box display="inline" sx={sxOverride.editReportButtonCell}>
            <Button
              variant="outline"
              data-testid="enter-report"
              onClick={() => enterSelectedReport(report)}
              isDisabled={report.archived}
            >
              {entering && reportId === report.id ? (
                <Spinner size="md" />
              ) : isStateLevelUser && !report.locked ? (
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
            report={report}
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
            report={report}
            reportType={reportType}
            reportId={reportId}
            archiveReport={archiveReport}
            archiving={archiving}
            sxOverride={sxOverride}
          />
        );
      }
      default:
        return value;
    }
  };

  const columns = generateColumns<SortableReportShape>(
    content.sortableHeadRow,
    isAdmin,
    customCells
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
  report: ReportMetadataShape;
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
