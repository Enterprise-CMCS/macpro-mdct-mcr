import { Box, Button, Image, Td, Spinner } from "@chakra-ui/react";
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
// assets
import editIcon from "assets/icons/icon_edit_square_gray.png";

export interface DashboardTableProps {
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
  if (!isAdmin && tableContent.headRow) {
    tableContent.headRow = tableContent.headRow.filter(
      (e) => !["Initial Submission", "#"].includes(e as string)
    );
    return tableContent;
  }
  return body;
};

export const EditReportButton = ({
  report,
  reportType,
  openAddEditReportModal,
  sxOverride,
}: EditReportProps) => {
  return (
    <Box display="inline" sx={sxOverride.editReport}>
      <button onClick={() => openAddEditReportModal(report)}>
        <Image
          src={editIcon}
          alt={
            reportType !== ReportType.MLR
              ? `Edit ${report.programName} due ${convertDateUtcToEt(
                  report.dueDate
                )} report submission set-up information`
              : `Edit ${report.programName} report submission set-up information`
          }
        />
      </button>
    </Box>
  );
};

export const ActionButton = ({
  report,
  reportType,
  isStateLevelUser,
  enterSelectedReport,
}: ActionButtonProps) => {
  const editOrView = isStateLevelUser && !report?.locked ? "Edit" : "View";

  return (
    <Button
      variant="outline"
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
      {editOrView}
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
