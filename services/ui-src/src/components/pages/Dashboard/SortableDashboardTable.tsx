import { useMemo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
// components
import { Box, Button, Spinner, VisuallyHidden } from "@chakra-ui/react";
import { SortableTable } from "components";
// utils
import { ReportMetadataShape } from "types";
import { convertDateUtcToEt } from "utils";
import {
  AdminArchiveButton,
  AdminReleaseButton,
  DashboardTableProps,
  EditReportButton,
  getStatus,
} from "./DashboardTableUtils";

interface SortableReportShape extends ReportMetadataShape {
  editedBy: string;
  name: string;
  planType?: string;
  report: ReportMetadataShape;
}

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
  const columnHelper = createColumnHelper<SortableReportShape>();
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
          report,
          ...rest,
        };
      }),
    [reportsByState]
  );

  const cells = (id: string, value?: string | number | ReportMetadataShape) => {
    if (!value) {
      // Undefined must return null or cell won't render
      return null;
    }

    switch (id) {
      case "edit": {
        const report = value as ReportMetadataShape;
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
        return convertDateUtcToEt(value as number);
      case "actions": {
        const report = value as ReportMetadataShape;
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
        const report = value as ReportMetadataShape;
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
        const report = value as ReportMetadataShape;
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

  const columns = Object.keys(content.sortableHeadRow)
    .filter((id) => {
      const { admin, stateUser } = content.sortableHeadRow[id];
      if ((!isAdmin && admin === true) || (isAdmin && stateUser)) {
        return;
      }
      return id;
    })
    .map((id: any) => {
      const { header, hidden } = content.sortableHeadRow[id];

      if (hidden === true) {
        return columnHelper.display({
          id,
          header: () => <VisuallyHidden>{header}</VisuallyHidden>,
          cell: ({ row }) => cells(id, row.original.report),
        });
      }
      return columnHelper.accessor(id, {
        header,
        cell: (info) => cells(id, info.getValue()),
      });
    });

  return (
    <SortableTable
      columns={columns}
      data={data}
      content={content}
      sxOverride={sxOverride}
      sx={sx.table}
    />
  );
};

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
