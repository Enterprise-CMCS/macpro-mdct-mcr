// components
import { Box, Button, Flex, Td, Tr } from "@chakra-ui/react";
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
              <Td className="submission-count-cell">
                {report.submissionCount === 0 ? 1 : report.submissionCount}
              </Td>
            </>
          )}
          {/* Actions */}
          <Td sx={sxOverride.editReportButtonCell}>
            <Flex align="center" justify="center" gap="0.5rem">
              {isStateLevelUser && (
                <Box width="7rem" display="flex" justifyContent="flex-end">
                  {!report?.locked && (
                    <Button
                      variant="link"
                      onClick={() => openAddEditReportModal(report)}
                    >
                      Edit reporting
                    </Button>
                  )}
                </Box>
              )}
              <ActionButton
                report={report}
                reportType={reportType}
                reportId={reportId}
                isStateLevelUser={isStateLevelUser}
                entering={entering}
                enterSelectedReport={enterSelectedReport}
              />
              {isAdmin && (
                <AdminReleaseButton
                  report={report}
                  reportType={reportType}
                  reportId={reportId}
                  releaseReport={releaseReport}
                  releasing={releasing}
                  sxOverride={sxOverride}
                />
              )}
              {isAdmin && (
                <AdminArchiveButton
                  report={report}
                  reportType={reportType}
                  reportId={reportId}
                  archiveReport={archiveReport}
                  archiving={archiving}
                  sxOverride={sxOverride}
                />
              )}
            </Flex>
          </Td>
        </Tr>
      );
    })}
  </Table>
);

const sx = {
  table: {
    marginBottom: "spacer5",
    th: {
      padding: "0.5rem 0",
      borderBottom: "1px solid",
      borderColor: "gray_light",
      color: "gray",
      fontWeight: "bold",
      "&:last-of-type": {
        textAlign: "center",
      },
    },
    tr: {
      borderBottom: "1px solid",
      borderColor: "gray_light",
    },
    td: {
      minWidth: "6rem",
      padding: "0.5rem",
      paddingLeft: 0,
      borderTop: "1px solid",
      borderBottom: "1px solid",
      borderColor: "gray_light",
      textAlign: "left",
      "&:last-of-type": {
        paddingRight: 0,
      },
      "&.submission-count-cell": {
        minWidth: "auto",
      },
    },
  },
};
