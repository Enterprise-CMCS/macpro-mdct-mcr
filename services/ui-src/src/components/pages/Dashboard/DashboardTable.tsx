// components
import { Box, Td, Tr } from "@chakra-ui/react";
import { Table } from "components";
// types
import { ReportMetadataShape, ReportType } from "types";
import { convertDateUtcToEt, otherSpecify } from "utils";
// utils
import {
  AdminArchiveButton,
  AdminReleaseButton,
  DashboardTableProps,
  DateFields,
  EditReportButton,
  ActionButton,
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
    {reportsByState.map((report: ReportMetadataShape) => {
      const initialSubmissionDate =
        report.submissionDates?.[0]?.submittedOnDate ?? report.submittedOnDate;

      return (
        <Tr key={report.id}>
          {/* Report Name */}
          <Td sx={sxOverride.programNameText}>
            {report.submissionName || report.programName}
          </Td>
          {/* Plan type (NAAAR only) */}
          {report.reportType === ReportType.NAAAR && (
            <Td>
              {otherSpecify(
                report["planTypeIncludedInProgram"]?.[0].value,
                report["planTypeIncludedInProgram-otherText"]
              )}
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
            <>
              <Td>
                {initialSubmissionDate &&
                  convertDateUtcToEt(initialSubmissionDate)}
              </Td>
              <Td>
                {report.submissionCount === 0 ? 1 : report.submissionCount}
              </Td>
            </>
          )}
          {/* Action Buttons */}
          {isStateLevelUser && (
            <Td sx={sxOverride.editReportButtonCell}>
              {report?.locked ? (
                <Box sx={sxOverride.editReport} />
              ) : (
                <EditReportButton
                  report={report}
                  reportType={report.reportType}
                  openAddEditReportModal={openAddEditReportModal}
                  sxOverride={sxOverride}
                />
              )}
            </Td>
          )}
          <Td sx={sxOverride.editReportButtonCell}>
            <ActionButton
              report={report}
              reportType={reportType}
              reportId={reportId}
              isStateLevelUser={isStateLevelUser}
              entering={entering}
              enterSelectedReport={enterSelectedReport}
            />
          </Td>
          {isAdmin && (
            <Td>
              <Box sx={sx.adminActionButtonWrapper}>
                <AdminReleaseButton
                  report={report}
                  reportType={reportType}
                  reportId={reportId}
                  releaseReport={releaseReport}
                  releasing={releasing}
                  sxOverride={sxOverride}
                />
              </Box>
            </Td>
          )}
          {isAdmin && (
            <Td>
              <Box sx={sx.adminActionButtonWrapper}>
                <AdminArchiveButton
                  report={report}
                  reportType={reportType}
                  reportId={reportId}
                  archiveReport={archiveReport}
                  archiving={archiving}
                  sxOverride={sxOverride}
                />
              </Box>
            </Td>
          )}
        </Tr>
      );
    })}
  </Table>
);

const sx = {
  adminActionButtonWrapper: {
    display: "flex",
    justifyContent: "center",
  },
  table: {
    width: "100%",
    tableLayout: "fixed",
    marginBottom: "spacer5",
    "th, td": {
      padding: "0.5rem 0.25rem",
      borderBottom: "1px solid",
      borderColor: "gray_light",
      textAlign: "left",
      verticalAlign: "middle",
    },
    th: {
      color: "gray",
      fontWeight: "bold",
    },
    // Program name column is slightly wider; remaining columns share space evenly
    "th:first-of-type, td:first-of-type": {
      width: "8rem",
    },
  },
};
