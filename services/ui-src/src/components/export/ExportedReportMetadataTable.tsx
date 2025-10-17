// components
import { Table } from "components";
// types
import {
  McparMetadataHeaders,
  MlrMetadataHeaders,
  NaaarMetadataHeaders,
  ReportMetadataTableVerbiage,
  ReportShape,
  ReportType,
} from "types";
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
  {
    metadataTableHeaders: verbiage,
  }: { metadataTableHeaders: ReportMetadataTableVerbiage }
): string[] => {
  switch (reportType) {
    case ReportType.MCPAR: {
      const v = verbiage as McparMetadataHeaders;
      return [v.dueDate, v.lastEdited, v.editedBy, v.status];
    }
    case ReportType.MLR: {
      const v = verbiage as MlrMetadataHeaders;
      return [v.submissionName, v.lastEdited, v.editedBy, v.status];
    }
    case ReportType.NAAAR: {
      const v = verbiage as NaaarMetadataHeaders;
      return [
        v.submissionName,
        v.planType,
        v.reportingPeriodStartDate,
        v.reportingPeriodEndDate,
        v.lastEdited,
        v.editedBy,
        v.status,
      ];
    }
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
  verbiage: {
    metadataTableHeaders: ReportMetadataTableVerbiage;
  };
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
