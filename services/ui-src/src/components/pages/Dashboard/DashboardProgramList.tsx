import { Button, Image, Link, Td, Tr } from "@chakra-ui/react";
import { Table } from "components";
import { AnyObject, ReportShape } from "types";
import { convertDateUtcToEt } from "utils";
import editIcon from "assets/icons/icon_edit_square_gray.png";

export const DashboardList = ({
  reportsByState,
  body,
  openAddEditProgramModal,
  enterSelectedReport,
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
          {isAdmin && <Link>Archive here</Link>}
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
