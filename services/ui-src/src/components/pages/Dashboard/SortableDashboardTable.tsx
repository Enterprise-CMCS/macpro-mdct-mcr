import { useMemo } from "react";
// components
import { Box, Button, Spinner } from "@chakra-ui/react";
import { SortableTable } from "components";
// types
import { ReportMetadataShape, ReportStatus } from "types";
// utils
import { convertDateUtcToEt, otherSpecify } from "utils";
import {
  AdminArchiveButton,
  AdminReleaseButton,
  DashboardTableProps,
  EditReportButton,
  getStatus,
} from "./DashboardTableUtils";
import { generateColumns } from "components/tables/SortableTable";

export const SortableDashboardTable = ({
  archiveReport,
  archiving,
  body,
  entering,
  enterSelectedReport,
  isAdmin,
  isStateLevelUser,
  openAddEditReportModal,
  releaseReport,
  releasing,
  reportId,
  reportsByState,
  reportType,
  sxOverride,
}: DashboardTableProps) => {
  const content = body.table;
  const data = useMemo(
    () =>
      reportsByState.map((report) => {
        const {
          dueDate,
          lastAltered,
          lastAlteredBy,
          programName,
          status,
          submissionCount,
          submissionName,
        } = report;
        return {
          // Return only fields visible in table
          name: submissionName || programName,
          dueDate,
          lastAltered,
          editedBy: lastAlteredBy || "-",
          planType: otherSpecify(
            report.planTypeIncludedInProgram?.[0].value,
            report["planTypeIncludedInProgram-otherText"]
          ),
          status: getStatus(status, report.archived, submissionCount),
          submissionCount: submissionCount === 0 ? 1 : submissionCount,
          // Original report shape to pass to cell buttons
          report,
        };
      }),
    [reportsByState]
  );

  const customCells = (
    headKey: keyof SortableTableDataShape,
    value: any,
    originalRowData: SortableTableDataShape
  ) => {
    const { report } = originalRowData;

    switch (headKey) {
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
          <Box as="span" sx={sxOverride.editReportButtonCell}>
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

  const columns = generateColumns<SortableTableDataShape>(
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

interface SortableTableDataShape {
  name: string;
  dueDate: number;
  lastAltered: number;
  editedBy: string;
  planType?: string;
  status: ReportStatus;
  submissionCount: number;
  report: ReportMetadataShape;
  // Columns with buttons
  edit?: null;
  actions?: null;
  adminRelease?: null;
  adminArchive?: null;
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
