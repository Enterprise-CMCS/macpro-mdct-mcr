// components
import {
    Box,
    Button,
    Flex,
    Image,
    Text,
} from "@chakra-ui/react";
import { AnyObject } from "types";
import {
convertDateUtcToEt,
} from "utils";
import cancelIcon from "assets/icons/icon_cancel_x_circle.png";
import editIcon from "assets/icons/icon_edit.png";


export const MobileDashboardList = ({
    reportsByState,
    openAddEditProgramModal,
    enterSelectedReport,
    openDeleteProgramModal,
    sxOverride,
    isStateUser,
    isAdmin,
  }: MobileDashboardRowProps) => (
    <>
      {reportsByState.map((report: AnyObject) => (
        <Box data-testid="mobile-row" sx={sx.mobileTable} key={report.id}>
          <Box sx={sx.labelGroup}>
            <Text sx={sx.label}>Program name</Text>
            <Flex alignContent="flex-start">
              { isStateUser && (
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
            <Text>{report?.status}</Text>
          </Box>
          <Flex alignContent="flex-start" gap={2}>
            <Box sx={sxOverride.editReportButtonCell}>
              <Button
                variant="outline"
                onClick={() => enterSelectedReport(report)}
              >
                Enter
              </Button>
            </Box>
            <Box sx={sxOverride.deleteProgramCell}>
              {isAdmin && (
                <button onClick={() => openDeleteProgramModal(report)}>
                  <Image
                    src={cancelIcon}
                    alt="Delete Program"
                    sx={sxOverride.deleteProgramButtonImage}
                  />
                </button>
              )}
            </Box>
          </Flex>
        </Box>
      ))}
    </>
  );
  
interface MobileDashboardRowProps {
    reportsByState: any;
    openAddEditProgramModal: Function;
    enterSelectedReport: Function;
    openDeleteProgramModal: Function;
    sxOverride: AnyObject;
    isAdmin: boolean;
    isStateUser: boolean;
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