// components
import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import { AdminActionButtons } from "./AdminActionButtons";
// utils
import { AnyObject, ReportMetadataShape } from "types";
import { convertDateUtcToEt } from "utils";
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
  lockReport,
  locking,
  isStateLevelUser,
  isAdmin,
  sxOverride,
}: MobileDashboardTableProps) => (
  <>
    {reportsByState.map((report: ReportMetadataShape) => (
      <Box data-testid="mobile-row" sx={sx.mobileTable} key={report.id}>
        <Box sx={sx.labelGroup}>
          <Text sx={sx.label}>
            {reportType === "MCPAR" ? "Program name" : "Submission name"}
          </Text>
          <Flex alignContent="flex-start">
            {isStateLevelUser && (
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
            <Text sx={sxOverride.reportNameText}>{report.reportName}</Text>
          </Flex>
        </Box>
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
          <Text>{report?.archived ? "Archived" : report?.status}</Text>
        </Box>
        {reportType === "MLR" && (
          <Box sx={sx.labelGroup}>
            <Text sx={sx.label}>#</Text>
            <Text>placeholder</Text>
          </Box>
        )}
        <Flex alignContent="flex-start" gap={2}>
          <Box sx={sxOverride.editReportButtonCell}>
            <Button
              variant="outline"
              onClick={() => enterSelectedReport(report)}
              isDisabled={report?.archived}
            >
              Enter
            </Button>
          </Box>
          <Box sx={sxOverride.adminActionCell}>
            {isAdmin && (
              <AdminActionButtons
                report={report}
                reportType={reportType}
                reportId={reportId}
                archiveReport={archiveReport}
                archiving={archiving}
                lockReport={lockReport}
                locking={locking}
                sxOverride={sxOverride}
              />
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
  lockReport?: Function | undefined;
  locking?: boolean | undefined;
  isAdmin: boolean;
  isStateLevelUser: boolean;
  sxOverride: AnyObject;
}

const DateFields = ({ report, reportType }: DateFieldProps) => {
  return (
    <>
      {reportType === "MCPAR" && (
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
