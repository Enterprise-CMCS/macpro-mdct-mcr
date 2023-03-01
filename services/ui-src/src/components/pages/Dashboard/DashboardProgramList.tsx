// components
import { Button, Image, Td, Tr } from "@chakra-ui/react";
import { Table } from "components";
import { Spinner } from "@cmsgov/design-system";
// utils
import { AnyObject, ReportMetadataShape } from "types";
import { convertDateUtcToEt } from "utils";
// assets
import editIcon from "assets/icons/icon_edit_square_gray.png";

export const DashboardList = ({
  reportsByState,
  body,
  openAddEditReportModal,
  enterSelectedReport,
  archiveReport,
  archiving,
  archivingReportId,
  sxOverride,
  isStateLevelUser,
  isAdmin,
}: DashboardTableProps) => (
  <Table content={body.table} data-testid="desktop-table" sx={sx.table}>
    {reportsByState.map((report: AnyObject) => (
      <Tr key={report.id}>
        <Td sx={sxOverride.editProgram}>
          {isStateLevelUser && (
            <button onClick={() => openAddEditReportModal(report)}>
              <Image src={editIcon} alt="Edit Report" />
            </button>
          )}
        </Td>
        <Td sx={sxOverride.programNameText}>{report.programName}</Td>
        <Td>{convertDateUtcToEt(report.dueDate)}</Td>
        <Td>{convertDateUtcToEt(report.lastAltered)}</Td>
        <Td>{report?.lastAlteredBy || "-"}</Td>
        <Td>{report?.archived ? "Archived" : report?.status}</Td>
        <Td sx={sxOverride.editReportButtonCell}>
          <Button
            variant="outline"
            data-testid="enter-report"
            onClick={() => enterSelectedReport(report)}
            isDisabled={report?.archived}
          >
            Enter
          </Button>
        </Td>
        <Td sx={sxOverride.deleteProgramCell}>
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
        </Td>
      </Tr>
    ))}
  </Table>
);

interface DashboardTableProps {
  reportsByState: ReportMetadataShape[];
  body: { table: AnyObject };
  openAddEditReportModal: Function;
  enterSelectedReport: Function;
  archiveReport: Function;
  archiving: boolean;
  archivingReportId: string | undefined;
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
      minWidth: "6rem",
      padding: "0.5rem 0.75rem",
      paddingLeft: 0,
      borderTop: "1px solid",
      borderBottom: "1px solid",
      borderColor: "palette.gray_light",
      textAlign: "left",
      "&:last-of-type": {
        paddingRight: 0,
      },
    },
  },
};
