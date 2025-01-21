// components
import { Box, Button, Flex, Image, Text, Spinner } from "@chakra-ui/react";
// types
import { AnyObject, ReportMetadataShape, ReportType } from "types";
// utils
import { convertDateUtcToEt } from "utils";
import { getStatus } from "./DashboardTable";
// assets
import editIcon from "assets/icons/icon_edit_square_gray.png";

export const MobileDashboardTable = ({
  reportsByState,
  reportId,
  reportType,
  openAddEditReportModal,
  enterSelectedReport,
  archiveReport,
  archiving,
  entering,
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
              <Box sx={sxOverride.editReport}>
                <button onClick={() => openAddEditReportModal(report)}>
                  <Image
                    src={editIcon}
                    data-testid="mobile-edit-report"
                    alt="Edit Report"
                  />
                </button>
              </Box>
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
        <Box sx={sx.labelGroup}>
          <Text sx={sx.label}>
            {report.submissionCount === 0 ? 1 : report.submissionCount}
          </Text>
        </Box>
        <Flex alignContent="flex-start" gap={2}>
          <Box sx={sxOverride.editReportButtonCell}>
            <Button
              variant="outline"
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
          </Box>
          <Box sx={sxOverride.adminActionCell}>
            {isAdmin && (
              <>
                <AdminReleaseButton
                  report={report}
                  reportId={reportId}
                  releaseReport={releaseReport}
                  releasing={releasing}
                  sxOverride={sxOverride}
                />
                <AdminArchiveButton
                  report={report}
                  reportId={reportId}
                  archiveReport={archiveReport}
                  archiving={archiving}
                  sxOverride={sxOverride}
                />
              </>
            )}
          </Box>
        </Flex>
      </Box>
    ))}
  </>
);

interface MobileDashboardTableProps {
  reportsByState: ReportMetadataShape[];
  reportId: string | undefined;
  reportType: string;
  openAddEditReportModal: Function;
  enterSelectedReport: Function;
  archiveReport: Function;
  archiving: boolean;
  entering: boolean;
  releaseReport?: Function | undefined;
  releasing?: boolean | undefined;
  isAdmin: boolean;
  isStateLevelUser: boolean;
  sxOverride: AnyObject;
}

const DateFields = ({ report, reportType }: DateFieldProps) => {
  return (
    <>
      {reportType !== ReportType.MLR && (
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

interface DateFieldProps {
  report: ReportMetadataShape;
  reportType: string;
}

const AdminReleaseButton = ({
  report,
  reportId,
  releasing,
  releaseReport,
  sxOverride,
}: AdminActionButtonProps) => {
  return (
    <Button
      variant="link"
      disabled={report.locked === false || report.archived === true}
      sx={sxOverride.adminActionButton}
      onClick={() => releaseReport!(report)}
    >
      {releasing && reportId === report.id ? <Spinner size="md" /> : "Unlock"}
    </Button>
  );
};

const AdminArchiveButton = ({
  report,
  reportId,
  archiveReport,
  archiving,
  sxOverride,
}: AdminActionButtonProps) => {
  return (
    <Button
      variant="link"
      sx={sxOverride.adminActionButton}
      onClick={() => archiveReport!(report)}
    >
      {archiving && reportId === report.id ? (
        <Spinner size="md" />
      ) : report?.archived ? (
        "Unarchive"
      ) : (
        "Archive"
      )}
    </Button>
  );
};

interface AdminActionButtonProps {
  report: ReportMetadataShape;
  reportId: string | undefined;
  archiveReport?: Function;
  archiving?: boolean;
  releasing?: boolean;
  releaseReport?: Function;
  sxOverride: AnyObject;
}

const sx = {
  mobileTable: {
    padding: "1rem 0",
    borderBottom: "1px solid",
    borderColor: "palette.gray_light",
  },
  labelGroup: {
    marginBottom: "0.5rem",
  },
  label: {
    fontSize: "sm",
    fontWeight: "bold",
    color: "palette.gray_medium",
  },
  editDate: {
    marginRight: "3rem",
  },
};
