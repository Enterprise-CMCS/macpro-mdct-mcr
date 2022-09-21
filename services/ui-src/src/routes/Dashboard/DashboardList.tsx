import {
    Button,
    Image,
    Td,
    Tr,
  } from "@chakra-ui/react";
  import {
    Table,
  } from "components";
import { AnyObject, UserRoles } from "types";
import {
    convertDateUtcToEt
} from "utils";
import cancelIcon from "assets/icons/icon_cancel_x_circle.png";
import editIcon from "assets/icons/icon_edit.png";

export const DashboardList = ({
    reportsByState,
    userRole,
    body,
    openAddEditProgramModal,
    enterSelectedReport,
    openDeleteProgramModal,
  }: DashboardTableProps) => (
    <Table content={body.table} sxOverride={sx.table} data-testid="desktop-table">
      {reportsByState.map((report: AnyObject) => (
        <Tr key={report.reportId}>
          <Td sx={sx.editProgram}>
            {(userRole === UserRoles.STATE_REP ||
              userRole === UserRoles.STATE_USER) && (
              <button onClick={() => openAddEditProgramModal(report)}>
                <Image src={editIcon} alt="Edit Program" />
              </button>
            )}
          </Td>
          <Td sx={sx.programNameText}>{report.programName}</Td>
          <Td>{convertDateUtcToEt(report.dueDate)}</Td>
          <Td>{convertDateUtcToEt(report.lastAltered)}</Td>
          <Td>{report?.lastAlteredBy || "-"}</Td>
          <Td>{report?.status}</Td>
          <Td sx={sx.editReportButtonCell}>
            <Button
              variant="outline"
              data-testid="enter-program"
              onClick={() => enterSelectedReport(report)}
            >
              Enter
            </Button>
          </Td>
          <Td sx={sx.deleteProgramCell}>
            {userRole === UserRoles.ADMIN && (
              <button onClick={() => openDeleteProgramModal(report)}>
                <Image
                  src={cancelIcon}
                  data-testid="delete-program"
                  alt="Delete Program"
                  sx={sx.deleteProgramButtonImage}
                />
              </button>
            )}
          </Td>
        </Tr>
      ))}
    </Table>
  );
  
  interface DashboardTableProps {
    reportsByState: AnyObject[];
    userRole: string;
    body: { table: AnyObject };
    openAddEditProgramModal: Function;
    enterSelectedReport: Function;
    openDeleteProgramModal: Function;
  }

  const sx = {
    table: {
      marginBottom: "2.5rem",
      th: {
        padding: "0.5rem 0 0.5rem 0",
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
        paddingLeft: 0,
        borderTop: "1px solid",
        borderBottom: "1px solid",
        borderColor: "palette.gray_light",
        textAlign: "left",
      },
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
  };
  