// components
import {
    Box,
    Button,
    Flex,
    Image,
    Text,
} from "@chakra-ui/react";
import { AnyObject, UserRoles } from "types";
import {
convertDateUtcToEt,
} from "utils";
import cancelIcon from "assets/icons/icon_cancel_x_circle.png";
import editIcon from "assets/icons/icon_edit.png";


export const MobileDashboardList = ({
    reportsByState,
    userRole,
    openAddEditProgramModal,
    enterSelectedReport,
    openDeleteProgramModal,
  }: MobileDashboardRowProps) => (
    <>
      {reportsByState.map((report: AnyObject) => (
        <Box data-testid="mobile-row" sx={sx.mobileTable} key={report.reportId}>
          <Box sx={sx.labelGroup}>
            <Text sx={sx.label}>Program name</Text>
            <Flex alignContent="flex-start">
              {(userRole === UserRoles.STATE_REP ||
                userRole === UserRoles.STATE_USER) && (
                <Box sx={sx.editProgram}>
                  <button onClick={() => openAddEditProgramModal(report)}>
                    <Image
                      src={editIcon}
                      data-testid="mobile-edit-program"
                      alt="Edit Program"
                    />
                  </button>
                </Box>
              )}
              <Text sx={sx.programNameText}>{report.programName}</Text>
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
            <Box sx={sx.editReportButtonCell}>
              <Button
                variant="outline"
                onClick={() => enterSelectedReport(report)}
              >
                Enter
              </Button>
            </Box>
            <Box sx={sx.deleteProgramCell}>
              {userRole === UserRoles.ADMIN && (
                <button onClick={() => openDeleteProgramModal(report)}>
                  <Image
                    src={cancelIcon}
                    alt="Delete Program"
                    sx={sx.deleteProgramButtonImage}
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
    userRole: any;
    openAddEditProgramModal: Function;
    enterSelectedReport: Function;
    openDeleteProgramModal: Function;
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
    editReportButtonCell: {
      width: "6.875rem",
      padding: 0,
      button: {
        width: "6.875rem",
        height: "1.75rem",
        borderRadius: "0.25rem",
        textAlign: "center",
        fontSize: "sm",
        fontWeight: "normal",
        color: "palette.primary",
      },
    },
    editProgram: {
      padding: "0",
      width: "2.5rem",
      ".tablet &, .mobile &": {
        width: "2rem",
      },
      img: {
        height: "1.5rem",
        minWidth: "21px",
        marginLeft: "0.5rem",
        ".tablet &, .mobile &": {
          marginLeft: 0,
        },
      },
    },
    programNameText: {
      fontSize: "md",
      fontWeight: "bold",
      width: "13rem",
      ".tablet &, .mobile &": {
        width: "100%",
      },
    },
    deleteProgramCell: {
      width: "2.5rem",
    },
    deleteProgramButtonImage: {
      height: "1.75rem",
      width: "1.75rem",
      minWidth: "28px",
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