import { Button, Td, Spinner } from "@chakra-ui/react";
// types
import {
  AnyObject,
  ReportMetadataShape,
  ReportType,
  SxObject,
  TableContentShape,
} from "types";
// utils
import { convertDateUtcToEt } from "utils";

export interface DashboardTableProps {
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
  releaseReport: Function;
  releasing?: boolean | undefined;
  sxOverride: SxObject;
}

export interface EditReportProps {
  report: ReportMetadataShape;
  reportType: string;
  openAddEditReportModal: Function;
  sxOverride: SxObject;
}

export interface ActionButtonProps {
  report: ReportMetadataShape;
  reportType: string;
  reportId: string | undefined;
  isStateLevelUser: boolean;
  entering: boolean;
  enterSelectedReport: Function;
}

export interface DateFieldProps {
  report: ReportMetadataShape;
  reportType: string;
}

export interface AdminActionButtonProps {
  report: ReportMetadataShape;
  reportType: string;
  sxOverride: SxObject;
  reportId?: string;
}

export interface AdminReleaseActionButtonProps extends AdminActionButtonProps {
  releaseReport: Function;
  releasing?: boolean;
}

export interface AdminArchiveActionButtonProps extends AdminActionButtonProps {
  archiveReport: Function;
  archiving?: boolean;
}

export const getStatus = (
  status: string,
  archived?: boolean,
  submissionCount?: number
) => {
  if (archived) {
    return "Archived";
  }
  if (
    submissionCount &&
    submissionCount >= 1 &&
    !status.includes("Submitted")
  ) {
    return "In revision";
  }
  return status;
};

export const tableBody = (body: TableContentShape, isAdmin: boolean) => {
  const tableContent = { ...body };
  let headRow = tableContent.headRow ?? [];
  if (!isAdmin) {
    headRow = headRow.filter(
      (e) => !["Initial Submission", "#"].includes(e as string)
    );
  }
  headRow = headRow.map((cell) => {
    if (cell === "Actions") {
      return {
        name: "Actions",
        align: "center" as const,
        colSpan: isAdmin ? 3 : 2,
      };
    }
    if (cell === "#") {
      return { name: "#", width: "3rem" };
    }
    return cell;
  });
  tableContent.headRow = headRow;
  return tableContent;
};

export const EditReportButton = ({
  report,
  reportType,
  openAddEditReportModal,
  sxOverride,
}: EditReportProps) => {
  return (
    <Button
      variant="link"
      sx={sxOverride.editReport}
      onClick={() => openAddEditReportModal(report)}
      aria-label={
        reportType !== ReportType.MLR
          ? `Edit ${report.programName} due ${convertDateUtcToEt(
              report.dueDate
            )} report submission set-up information`
          : `Edit ${report.programName} report submission set-up information`
      }
    >
      Edit reporting
    </Button>
  );
};

export const ActionButton = ({
  report,
  reportType,
  reportId,
  isStateLevelUser,
  entering,
  enterSelectedReport,
}: ActionButtonProps) => {
  const editOrView = isStateLevelUser && !report?.locked ? "Edit" : "View";

  return (
    <Button
      variant="outline"
      size="md"
      sx={{ width: "100%", minWidth: 0, paddingX: "0.5rem" }}
      aria-label={
        reportType !== ReportType.MLR
          ? `${editOrView} ${report.programName} due ${convertDateUtcToEt(
              report.dueDate
            )} report`
          : `${editOrView} ${report.programName} report`
      }
      data-testid="enter-report"
      onClick={() => enterSelectedReport(report)}
      isDisabled={report?.archived}
    >
      {entering && reportId == report.id ? <Spinner size="md" /> : editOrView}
    </Button>
  );
};

export const DateFields = ({ report, reportType }: DateFieldProps) => {
  return (
    <>
      {reportType === ReportType.MCPAR && (
        <Td>{convertDateUtcToEt(report.dueDate)}</Td>
      )}
      <Td>{convertDateUtcToEt(report.lastAltered)}</Td>
    </>
  );
};

export const AdminReleaseButton = ({
  report,
  reportType,
  reportId,
  releasing,
  releaseReport,
  sxOverride,
}: AdminReleaseActionButtonProps) => {
  return (
    <Button
      variant="link"
      aria-label={
        reportType !== ReportType.MLR
          ? `Unlock ${report.programName} due ${convertDateUtcToEt(
              report.dueDate
            )} report`
          : `Unlock ${report.programName} report`
      }
      disabled={report?.locked === false || report?.archived === true}
      sx={sxOverride.adminActionButton}
      onClick={() => releaseReport(report)}
    >
      {releasing && reportId === report?.id ? <Spinner size="md" /> : "Unlock"}
    </Button>
  );
};

export const AdminArchiveButton = ({
  report,
  reportType,
  reportId,
  archiveReport,
  archiving,
  sxOverride,
}: AdminArchiveActionButtonProps) => {
  const buttonText = report?.archived ? "Unarchive" : "Archive";
  return (
    <Button
      variant="link"
      sx={sxOverride.adminActionButton}
      onClick={() => archiveReport(report)}
      aria-label={
        reportType !== ReportType.MLR
          ? `${buttonText} ${report.programName} due ${convertDateUtcToEt(
              report.dueDate
            )} report`
          : `${buttonText} ${report.programName} report`
      }
    >
      {archiving && reportId === report.id ? <Spinner size="md" /> : buttonText}
    </Button>
  );
};
