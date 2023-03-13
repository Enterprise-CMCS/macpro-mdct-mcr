// components
import { Button, Image, Td, Tr } from "@chakra-ui/react";
import { Spinner } from "@cmsgov/design-system";
import { Table } from "components";
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
  releaseReport,
  releasing,
  sxOverride,
  isStateLevelUser,
  isAdmin,
}: DashboardTableProps) => (
  <Table content={body.table} data-testid="desktop-table" sx={sx.table}>
    {reportsByState.map((report: ReportMetadataShape) => (
      <Tr key={report.id}>
        {/* Edit Button */}
        {isStateLevelUser ? (
          <EditReportButton
            report={report}
            openAddEditReportModal={openAddEditReportModal}
            sxOverride={sxOverride}
          />
        ) : (
          <Td></Td>
        )}
        {/* Report Name */}
        <Td sx={sxOverride.programNameText}>
          {report.programName ?? report.submissionName}
        </Td>
        {/* Date Fields */}
        <DateFields report={report} reportType={reportType} />
        {/* Last Altered By */}
        <Td>{report?.lastAlteredBy || "-"}</Td>
        {/* Report Status */}
        <Td>{report?.archived ? "Archived" : report?.status}</Td>
        {/* MLR-ONLY: Submission count */}
        {reportType === "MLR" && <Td></Td>}
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
          <>
            {reportType === "MLR" && (
              <AdminReleaseButton
                report={report}
                reportType={reportType}
                reportId={reportId}
                releaseReport={releaseReport}
                releasing={releasing}
                sxOverride={sxOverride}
              />
            )}
            <AdminArchiveButton
              report={report}
              reportType={reportType}
              reportId={reportId}
              archiveReport={archiveReport}
              archiving={archiving}
              releaseReport={releaseReport}
              releasing={releasing}
              sxOverride={sxOverride}
            />
          </>
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
  releaseReport?: Function | undefined;
  releasing?: boolean | undefined;
  sxOverride: AnyObject;
}

const EditReportButton = ({
  report,
  openAddEditReportModal,
  sxOverride,
}: EditReportProps) => {
  return (
    <Td sx={sxOverride.editReport}>
      <button onClick={() => openAddEditReportModal(report)}>
        <Image src={editIcon} alt="Edit Report" />
      </button>
    </Td>
  );
};

interface EditReportProps {
  report: ReportMetadataShape;
  openAddEditReportModal: Function;
  sxOverride: AnyObject;
}

const DateFields = ({ report, reportType }: DateFieldProps) => {
  return (
    <>
      {reportType === "MCPAR" && <Td>{convertDateUtcToEt(report.dueDate)}</Td>}
      <Td>{convertDateUtcToEt(report.lastAltered)}</Td>
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
    <Td>
      <Button
        variant="link"
        disabled={report.locked === false}
        sx={sxOverride.adminActionButton}
        onClick={() => releaseReport!(report)}
      >
        {releasing && reportId === report.id ? (
          <Spinner size="small" />
        ) : (
          "Release"
        )}
      </Button>
    </Td>
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
    <Td>
      <Button
        variant="link"
        sx={sxOverride.adminActionButton}
        onClick={() => archiveReport!(report)}
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
  archiveReport?: Function;
  archiving?: boolean;
  releasing?: boolean;
  releaseReport?: Function;
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
