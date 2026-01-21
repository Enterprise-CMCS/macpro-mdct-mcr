// components
import { Box, Flex, Text } from "@chakra-ui/react";
// types
import { ReportMetadataShape, ReportType } from "types";
// utils
import { convertDateUtcToEt } from "utils";
import {
  ActionButton,
  AdminArchiveButton,
  AdminReleaseButton,
  DashboardTableProps,
  DateFieldProps,
  EditReportButton,
  getStatus,
} from "./DashboardTableUtils";

export const MobileDashboardTable = ({
  reportsByState,
  reportId,
  reportType,
  openAddEditReportModal,
  enterSelectedReport,
  archiveReport,
  archiving,
  releaseReport,
  releasing,
  isStateLevelUser,
  isAdmin,
  sxOverride,
}: MobileDashboardTableProps) => (
  <>
    {reportsByState.map((report: ReportMetadataShape) => (
      <Box data-testid="mobile-row" sx={sx.mobileTable} key={report.id}>
        <Box sx={sx.labelGroup}>
          <Text sx={sx.label}>
            {reportType === ReportType.MLR ? "Submission name" : "Program name"}
          </Text>
          <Flex alignContent="flex-start">
            {isStateLevelUser && !report?.locked && (
              <EditReportButton
                report={report}
                reportType={report.reportType}
                openAddEditReportModal={openAddEditReportModal}
                sxOverride={sxOverride}
              />
            )}
            <Text sx={sxOverride.programNameText}>{report.programName}</Text>
          </Flex>
        </Box>
        {reportType === ReportType.NAAAR && (
          <Box sx={sx.labelGroup}>
            <Text sx={sx.label}>Plan type</Text>
            <Text>
              {report["planTypeIncludedInProgram-otherText"]
                ? report["planTypeIncludedInProgram-otherText"]
                : report.planTypeIncludedInProgram?.[0].value}
            </Text>
          </Box>
        )}

        <Box sx={sx.labelGroup}>
          <Flex alignContent="flex-start">
            <DateFields report={report} reportType={reportType} />
          </Flex>
        </Box>
        <Box sx={sx.labelGroup}>
          <Text sx={sx.label}>Edited by</Text>
          <Text>{report?.lastAlteredBy || "-"}</Text>
        </Box>
        <Box sx={sx.labelGroup}>
          <Text sx={sx.label}>Status</Text>
          <Text>
            {getStatus(report.status, report.archived, report.submissionCount)}
          </Text>
        </Box>
        {isAdmin && (
          <Box sx={sx.labelGroup}>
            <Text sx={sx.label}>
              {report.submissionCount === 0 ? 1 : report.submissionCount}
            </Text>
          </Box>
        )}
        <Flex alignContent="flex-start" gap={2}>
          <Box sx={sxOverride.editReportButtonCell}>
            <ActionButton
              report={report}
              reportType={reportType}
              reportId={reportId}
              isStateLevelUser={isStateLevelUser}
              enterSelectedReport={enterSelectedReport}
            />
          </Box>
          {isAdmin && (
            <Box sx={sxOverride.adminActionCell}>
              <AdminReleaseButton
                report={report}
                reportType={reportType}
                reportId={reportId}
                releaseReport={releaseReport}
                releasing={releasing}
                sxOverride={sxOverride}
              />
              <AdminArchiveButton
                report={report}
                reportType={reportType}
                reportId={reportId}
                archiveReport={archiveReport}
                archiving={archiving}
                sxOverride={sxOverride}
              />
            </Box>
          )}
        </Flex>
      </Box>
    ))}
  </>
);

interface MobileDashboardTableProps extends Omit<DashboardTableProps, "body"> {}

const DateFields = ({ report, reportType }: DateFieldProps) => {
  return (
    <>
      {reportType === ReportType.MCPAR && (
        <Box sx={sx.editDate}>
          <Text sx={sx.label}>Due date</Text>
          <Text>{convertDateUtcToEt(report.dueDate)}</Text>
        </Box>
      )}
      <Box>
        <Text sx={sx.label}>Last edited</Text>
        <Text>{convertDateUtcToEt(report.lastAltered)}</Text>
      </Box>
    </>
  );
};

const sx = {
  mobileTable: {
    padding: "1rem 0",
    borderBottom: "1px solid",
    borderColor: "gray_light",
  },
  labelGroup: {
    marginBottom: "spacer1",
  },
  label: {
    fontSize: "sm",
    fontWeight: "bold",
    color: "gray",
  },
  editDate: {
    marginRight: "spacer6",
  },
};
