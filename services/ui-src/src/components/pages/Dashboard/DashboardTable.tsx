// components
import { Button, Td, Tr, Spinner } from "@chakra-ui/react";
import { Table } from "components";
// types
import { ReportMetadataShape, ReportType } from "types";
// utils
import {
  AdminArchiveButton,
  AdminReleaseButton,
  DashboardTableProps,
  DateFields,
  EditReportButton,
  getStatus,
  tableBody,
} from "./DashboardTableUtils";

export const DashboardTable = ({
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
}: DashboardTableProps) => (
  <Table content={tableBody(body.table, isAdmin)} sx={sx.table}>
    {reportsByState.map((report: ReportMetadataShape) => (
      <Tr key={report.id}>
        {/* Edit Button */}
        <Td>
          {isStateLevelUser && !report?.locked && (
            <EditReportButton
              report={report}
              openAddEditReportModal={openAddEditReportModal}
              sxOverride={sxOverride}
            />
          )}
        </Td>
        {/* Report Name */}
        <Td sx={sxOverride.programNameText}>
          {report.submissionName || report.programName}
        </Td>
        {/* Plan type (NAAAR only) */}
        {report.reportType === ReportType.NAAAR && (
          <Td>
            {report["planTypeIncludedInProgram"]?.[0].value === "Other, specify"
              ? report["planTypeIncludedInProgram-otherText"]
              : report.planTypeIncludedInProgram?.[0].value}
          </Td>
        )}
        {/* Date Fields */}
        <DateFields report={report} reportType={reportType} />
        {/* Last Altered By */}
        <Td>{report?.lastAlteredBy || "-"}</Td>
        {/* Report Status */}
        <Td>
          {getStatus(report.status, report.archived, report.submissionCount)}
        </Td>
        {/* ADMIN ONLY: Submission count */}
        {isAdmin && (
          <Td>{report.submissionCount === 0 ? 1 : report.submissionCount}</Td>
        )}
        {/* Action Buttons */}
        <Td sx={sxOverride.editReportButtonCell}>
          <Button
            variant="outline"
            data-testid="enter-report"
            onClick={() => enterSelectedReport(report)}
            isDisabled={report?.archived}
          >
            {entering && reportId == report.id ? (
              <Spinner size="md" />
            ) : isStateLevelUser && !report?.locked ? (
              "Edit"
            ) : (
              "View"
            )}
          </Button>
        </Td>
        {isAdmin && (
          <Td>
            <AdminReleaseButton
              report={report}
              reportType={reportType}
              reportId={reportId}
              releaseReport={releaseReport}
              releasing={releasing}
              sxOverride={sxOverride}
            />
          </Td>
        )}
        {isAdmin && (
          <Td>
            <AdminArchiveButton
              report={report}
              reportType={reportType}
              reportId={reportId}
              archiveReport={archiveReport}
              archiving={archiving}
              sxOverride={sxOverride}
            />
          </Td>
        )}
      </Tr>
    ))}
  </Table>
);

const sx = {
  table: {
    marginBottom: "2.5rem",
    th: {
      padding: "0.5rem 0",
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
      minWidth: "6rem",
      padding: "0.5rem 0.75rem",
      paddingLeft: 0,
      borderTop: "1px solid",
      borderBottom: "1px solid",
      borderColor: "palette.gray_light",
      textAlign: "left",
      "&:last-of-type": {
        paddingRight: 0,
      },
      "&:first-of-type": {
        width: "2rem",
        minWidth: "2rem",
      },
    },
  },
};
