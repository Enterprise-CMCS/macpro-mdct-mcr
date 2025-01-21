import { Box, Button, Image, Td, Spinner } from "@chakra-ui/react";

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
  sxOverride: AnyObject;
}

export interface EditReportProps {
  report: ReportMetadataShape;
  openAddEditReportModal: Function;
  sxOverride: AnyObject;
}

export interface DateFieldProps {
  report: ReportMetadataShape;
  reportType: string;
}

export interface AdminActionButtonProps {
  report: ReportMetadataShape;
  reportType: string;
  reportId: string | undefined;
  archiving?: boolean;
  releasing?: boolean;
  sxOverride: AnyObject;
}

export interface AdminReleaseActionButtonProps extends AdminActionButtonProps {
  releasing?: boolean;
  releaseReport: Function;
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
  const tableContent = body;
  if (!isAdmin && tableContent.headRow) {
    tableContent.headRow = tableContent.headRow.filter((e) => e !== "#");
    return tableContent;
  }
  return body;
};

export const EditReportButton = ({
  report,
  openAddEditReportModal,
  sxOverride,
}: EditReportProps) => {
  return (
    <Box display="inline" sx={sxOverride.editReport}>
      <button onClick={() => openAddEditReportModal(report)}>
        <Image src={editIcon} alt="Edit Report" />
      </button>
    </Box>
  );
};

export const DateFields = ({ report, reportType }: DateFieldProps) => {
  return (
    <>
      {reportType !== ReportType.MLR && (
        <Td>{convertDateUtcToEt(report.dueDate)}</Td>
      )}
      <Td>{convertDateUtcToEt(report.lastAltered)}</Td>
    </>
  );
};

export const AdminReleaseButton = ({
  report,
  reportId,
  releasing,
  releaseReport,
  sxOverride,
}: AdminReleaseActionButtonProps) => {
  return (
    <Button
      variant="link"
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
  reportId,
  archiveReport,
  archiving,
  sxOverride,
}: AdminArchiveActionButtonProps) => {
  return (
    <Button
      variant="link"
      sx={sxOverride.adminActionButton}
      onClick={() => archiveReport(report)}
    >
      {archiving && reportId === report.id ? (
        <Spinner size="md" />
      ) : report?.archived ? (
        "Unarchive"
      ) : (
        "Archive"
      )}
    </Button>
  );
};
