import { Button, Image, Td, Tr } from "@chakra-ui/react";
import { Table } from "components";
import { AnyObject, ReportShape } from "types";
import { convertDateUtcToEt } from "utils";
import cancelIcon from "assets/icons/icon_cancel_x_circle.png";
import editIcon from "assets/icons/icon_edit.png";

export const DashboardList = ({
  reportsByState,
  body,
  openAddEditProgramModal,
  enterSelectedReport,
  openDeleteProgramModal,
  sxOverride,
  isStateLevelUser,
  isAdmin,
}: DashboardTableProps) => (
  <Table content={body.table} data-testid="desktop-table" sx={sx.table}>
    {reportsByState.map((report: AnyObject) => (
      <Tr key={report.id}>
        <Td sx={sxOverride.editProgram}>
          {isStateLevelUser && (
            <button onClick={() => openAddEditProgramModal(report)}>
              <Image src={editIcon} alt="Edit Program" />
            </button>
          )}
        </Td>
        <Td sx={sxOverride.programNameText}>{report.programName}</Td>
        <Td>{convertDateUtcToEt(report.dueDate)}</Td>
        <Td>{convertDateUtcToEt(report.lastAltered)}</Td>
        <Td>{report?.lastAlteredBy || "-"}</Td>
        <Td>{report?.status}</Td>
        <Td sx={sxOverride.editReportButtonCell}>
          <Button
            variant="outline"
            data-testid="enter-program"
            onClick={() => enterSelectedReport(report)}
          >
            Enter
          </Button>
        </Td>
        <Td sx={sxOverride.deleteProgramCell}>
          {isAdmin && (
            <button onClick={() => openDeleteProgramModal(report)}>
              <Image
                src={cancelIcon}
                data-testid="delete-program"
                alt="Delete Program"
                sx={sxOverride.deleteProgramButtonImage}
              />
            </button>
          )}
        </Td>
      </Tr>
    ))}
  </Table>
);

interface DashboardTableProps {
  reportsByState: ReportShape[];
  body: { table: AnyObject };
  openAddEditProgramModal: Function;
  enterSelectedReport: Function;
  openDeleteProgramModal: Function;
  sxOverride: AnyObject;
  isAdmin: boolean;
  isStateLevelUser: boolean;
}

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
      padding: "0.5rem 0.75rem",
      paddingLeft: 0,
      borderTop: "1px solid",
      borderBottom: "1px solid",
      borderColor: "palette.gray_light",
      textAlign: "left",
    },
  },
};
