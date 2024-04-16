// components
import { Table } from "components";
// types
import { ReportShape, ReportType } from "types";
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
        headRow: headerRowLabels(reportType, verbiage),
        bodyRows: bodyRowContent(reportType, report),
      }}
    />
  );
};

export const headerRowLabels = (
  reportType: ReportType,
  verbiage: any
): string[] => {
  switch (reportType) {
    case ReportType.MCPAR:
      return [
        verbiage.metadataTableHeaders.dueDate,
        verbiage.metadataTableHeaders.lastEdited,
        verbiage.metadataTableHeaders.editedBy,
        verbiage.metadataTableHeaders.status,
      ];
    case ReportType.MLR:
    case ReportType.NAAAR:
      return [
        verbiage.metadataTableHeaders.submissionName,
        verbiage.metadataTableHeaders.lastEdited,
        verbiage.metadataTableHeaders.editedBy,
        verbiage.metadataTableHeaders.status,
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
    case ReportType.NAAAR:
      return [
        [
          report?.programName ?? "",
          convertDateUtcToEt(report?.lastAltered),
          report?.lastAlteredBy,
          report?.status,
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
      color: "palette.gray_medium",
    },
  },
};
