// components
import { Button, Image, Td, Tr } from "@chakra-ui/react";
import { Table } from "components";
import { Spinner } from "@cmsgov/design-system";
// utils
import { AnyObject, ReportMetadataShape } from "types";
import { convertDateUtcToEt } from "utils";
// assets
import editIcon from "assets/icons/icon_edit_square_gray.png";

export const DashboardTable = ({
  reportsByState,
  reportType,
  reportId,
  body,
  openAddEditReportModal,
  enterSelectedReport,
  archiveReport,
  archiving,
  lockReport,
  locking,
  sxOverride,
  isStateLevelUser,
  isAdmin,
}: DashboardTableProps) => (
  <Table content={body.table} data-testid="desktop-table" sx={sx.table}>
    {reportsByState.map((report: ReportMetadataShape) => (
      <Tr key={report.id}>
        {/* Edit Button */}
        <Td sx={sxOverride.editReport}>
          {isStateLevelUser && (
            <button onClick={() => openAddEditReportModal(report)}>
              <Image src={editIcon} alt="Edit Report" />
            </button>
          )}
        </Td>
        {/* Report Name */}
        <Td sx={sxOverride.reportNameText}>{report.reportName}</Td>
        {/* Date Fields */}
        <Td>{convertDateUtcToEt(report.dueDate)}</Td>
        <Td>{convertDateUtcToEt(report.lastAltered)}</Td>
        {/* Last Altered By */}
        <Td>{report?.lastAlteredBy || "-"}</Td>
        {/* Report Status */}
        <Td>{report?.archived ? "Archived" : report?.status}</Td>
        {/* Action Buttons */}
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
        {isAdmin && (
          <AdminActionButtons
            report={report}
            reportType={reportType}
            archiveReport={archiveReport}
            archiving={archiving}
            lockReport={lockReport}
            locking={locking}
            reportId={reportId}
            sxOverride={sxOverride}
          />
        )}
      </Tr>
    ))}
  </Table>
);

interface DashboardTableProps {
  reportsByState: ReportMetadataShape[];
  body: { table: AnyObject };
  reportType: string;
  reportId: string | undefined;
  openAddEditReportModal: Function;
  enterSelectedReport: Function;
  archiveReport: Function;
  archiving: boolean;
  isAdmin: boolean;
  isStateLevelUser: boolean;
  lockReport?: Function | undefined;
  locking?: boolean | undefined;
  sxOverride: AnyObject;
}

const AdminActionButtons = ({
  report,
  reportType,
  reportId,
  archiveReport,
  archiving,
  locking,
  lockReport,
  sxOverride,
}: AdminActionButtonProps) => {
  return (
    <Td sx={sxOverride.deleteReportCell}>
      {reportType === "MLR" && lockReport && (
        <Button
          variant="link"
          sx={sxOverride.adminActionButton}
          onClick={() => lockReport(report)}
        >
          {locking && reportId === report.id ? (
            <Spinner size="small" />
          ) : report?.locked ? (
            "Unlock"
          ) : (
            "Lock"
          )}
        </Button>
      )}
      <Button
        variant="link"
        sx={sxOverride.adminActionButton}
        onClick={() => archiveReport(report)}
      >
        {archiving && reportId === report.id ? (
          <Spinner size="small" />
        ) : report?.archived ? (
          "Unarchive"
        ) : (
          "Archive"
        )}
      </Button>
    </Td>
  );
};

interface AdminActionButtonProps {
  report: ReportMetadataShape;
  reportType: string;
  reportId: string | undefined;
  archiveReport: Function;
  archiving: boolean;
  locking?: boolean;
  lockReport?: Function;
  sxOverride: AnyObject;
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
