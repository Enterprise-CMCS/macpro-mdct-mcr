// components
import { Table } from "components";
// types
import { AnyObject, ReportShape, ReportType } from "types";
// utils
import { assertExhaustive, convertDateUtcToEt, useStore } from "utils";

export const ExportedReportMetadataTable = ({
  reportType,
  verbiage,
}: Props) => {
  const { report } = useStore();

  return (
    <Table
      data-testid="exportedReportMetadataTable"
      sx={sx.metadataTable}
      content={{
        caption: "Report Submission Information",
        headRow: headerRowLabels(reportType, verbiage),
        bodyRows: bodyRowContent(reportType, report),
      }}
    />
  );
};

export const headerRowLabels = (
  reportType: ReportType,
  { metadataTableHeaders: verbiage }: AnyObject
): string[] => {
  switch (reportType) {
    case ReportType.MCPAR:
      return [
        verbiage.dueDate,
        verbiage.lastEdited,
        verbiage.editedBy,
        verbiage.status,
      ];
    case ReportType.MLR:
      return [
        verbiage.submissionName,
        verbiage.lastEdited,
        verbiage.editedBy,
        verbiage.status,
      ];
    case ReportType.NAAAR:
      return [
        verbiage.submissionName,
        verbiage.planType,
        verbiage.reportingPeriodStartDate,
        verbiage.reportingPeriodEndDate,
        verbiage.lastEdited,
        verbiage.editedBy,
        verbiage.status,
      ];
    default:
      assertExhaustive(reportType);
      throw new Error(
        `The metadata table headers for report type '${reportType}' have not been implemented.`
      );
  }
};

export const bodyRowContent = (
  reportType: ReportType,
  report?: ReportShape
): string[][] => {
  if (!report) {
    return [[]];
  }
  switch (reportType) {
    case ReportType.MCPAR:
      return [
        [
          convertDateUtcToEt(report.dueDate),
          convertDateUtcToEt(report.lastAltered),
          report.lastAlteredBy,
          report.status,
        ],
      ];
    case ReportType.MLR:
      return [
        [
          report.programName,
          convertDateUtcToEt(report.lastAltered),
          report.lastAlteredBy,
          report.status,
        ],
      ];
    case ReportType.NAAAR:
      return [
        [
          report.programName ?? "",
          report["planTypeIncludedInProgram-otherText"] ??
            report.planTypeIncludedInProgram?.[0].value ??
            "",
          convertDateUtcToEt(report.reportingPeriodStartDate),
          convertDateUtcToEt(report.reportingPeriodEndDate),
          convertDateUtcToEt(report.lastAltered),
          report.lastAlteredBy,
          report.status,
        ],
      ];
    default:
      assertExhaustive(reportType);
      throw new Error(
        `The metadata table body for report type '${reportType}' has not been implemented.`
      );
  }
};

export interface Props {
  reportType: ReportType;
  verbiage: any;
}

const sx = {
  metadataTable: {
    margin: "3rem 0",
    maxWidth: "reportPageWidth",
    td: {
      paddingTop: "0rem",
      verticalAlign: "middle",
    },
    th: {
      border: "none",
      fontWeight: "bold",
      color: "gray",
    },
  },
};
