// components
import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import { Spinner } from "@cmsgov/design-system";
// utils
import { AnyObject, ReportMetadataShape } from "types";
import { convertDateUtcToEt } from "utils";
// assets
import editIcon from "assets/icons/icon_edit_square_gray.png";

export const MobileDashboardList = ({
  reportsByState,
  openAddEditProgramModal,
  enterSelectedReport,
  archiveReport,
  archiving,
  archivingReportId,
  sxOverride,
  isStateLevelUser,
  isAdmin,
}: MobileDashboardListProps) => (
  <>
    {reportsByState.map((report: AnyObject) => (
      <Box data-testid="mobile-row" sx={sx.mobileTable} key={report.id}>
        <Box sx={sx.labelGroup}>
          <Text sx={sx.label}>Program name</Text>
          <Flex alignContent="flex-start">
            {isStateLevelUser && (
              <Box sx={sxOverride.editProgram}>
                <button onClick={() => openAddEditProgramModal(report)}>
                  <Image
                    src={editIcon}
                    data-testid="mobile-edit-program"
                    alt="Edit Program"
                  />
                </button>
              </Box>
            )}
            <Text sx={sxOverride.programNameText}>{report.programName}</Text>
          </Flex>
        </Box>
        <Box sx={sx.labelGroup}>
          <Flex alignContent="flex-start">
            <Box sx={sx.editDate}>
              <Text sx={sx.label}>Due date</Text>
              <Text>{convertDateUtcToEt(report.dueDate)}</Text>
            </Box>
            <Box>
              <Text sx={sx.label}>Last edited</Text>
              <Text>{convertDateUtcToEt(report.lastAltered)}</Text>
            </Box>
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
          <Box sx={sxOverride.deleteProgramCell}>
            {isAdmin && (
              <Button
                variant="link"
                sx={sxOverride.archiveReportButton}
                onClick={() => archiveReport(report)}
              >
                {archiving && archivingReportId === report.id ? (
                  <Spinner size="small" />
                ) : report?.archived ? (
                  "Unarchive"
                ) : (
                  "Archive"
                )}
              </Button>
            )}
          </Box>
        </Flex>
      </Box>
    ))}
  </>
);

interface MobileDashboardListProps {
  reportsByState: ReportMetadataShape[];
  openAddEditProgramModal: Function;
  enterSelectedReport: Function;
  archiveReport: Function;
  archiving: boolean;
  archivingReportId: string | undefined;
  sxOverride: AnyObject;
  isAdmin: boolean;
  isStateLevelUser: boolean;
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
