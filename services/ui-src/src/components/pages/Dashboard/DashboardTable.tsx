// components
import { Button, Image, Td, Tr, Spinner } from "@chakra-ui/react";
import { Table } from "components";
// utils
import {
  AnyObject,
  ReportMetadataShape,
  ReportType,
  TableContentShape,
} from "types";
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
  entering,
  releaseReport,
  releasing,
  sxOverride,
  isStateLevelUser,
  isAdmin,
}: DashboardTableProps) => (
  <Table content={tableBody(body.table, isAdmin)} sx={sx.table}>
    {reportsByState.map((report: ReportMetadataShape) => (
      <Tr key={report.id}>
        {/* Edit Button */}
        {isStateLevelUser && !report?.locked ? (
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
        <Td>
          {getStatus(
            reportType as ReportType,
            report.status,
            report.archived,
            report.submissionCount
          )}
        </Td>
        {/* ADMIN ONLY: Submission count */}
        {isAdmin && (
          <Td> {report.submissionCount === 0 ? 1 : report.submissionCount} </Td>
        )}
        {/* Action Buttons */}
        <Td sx={sxOverride.editReportButtonCell}>
          <Button
            variant="outline"
            data-testid="enter-report"
            onClick={() => enterSelectedReport(report)}
            isDisabled={report?.archived}
          >
            {entering && reportId == report.id ? (
              <Spinner size="md" />
            ) : isStateLevelUser && !report?.locked ? (
              "Edit"
            ) : (
              "View"
            )}
          </Button>
        </Td>
        {isAdmin && (
          <>
            <AdminReleaseButton
              report={report}
              reportType={reportType}
              reportId={reportId}
              releaseReport={releaseReport}
              releasing={releasing}
              sxOverride={sxOverride}
            />
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
  entering: boolean;
  isAdmin: boolean;
  isStateLevelUser: boolean;
  releaseReport?: Function | undefined;
  releasing?: boolean | undefined;
  sxOverride: AnyObject;
}

export const getStatus = (
  reportType: ReportType,
  status: string,
  archived?: boolean,
  submissionCount?: number
) => {
  if (archived) {
    return `Archived`;
  }
  if (reportType === "MLR") {
    if (
      submissionCount &&
      submissionCount >= 1 &&
      !status.includes("Submitted")
    ) {
      return `In revision`;
    }
  }
  return status;
};
const tableBody = (body: TableContentShape, isAdmin: boolean) => {
  var tableContent = body;
  if (!isAdmin) {
    tableContent.headRow = tableContent.headRow!.filter((e) => e !== "#");
    return tableContent;
  }
  return body;
};

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
        disabled={report.locked === false || report.archived === true}
        sx={sxOverride.adminActionButton}
        onClick={() => releaseReport!(report)}
      >
        {releasing && reportId === report.id ? <Spinner size="md" /> : "Unlock"}
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
          <Spinner size="md" />
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
      "&:first-of-type": {
        width: "2rem",
        minWidth: "2rem",
      },
    },
  },
};
