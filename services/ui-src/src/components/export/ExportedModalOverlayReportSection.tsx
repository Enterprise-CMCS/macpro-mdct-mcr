// components
import { EntityStatusIcon, Table } from "components";
import { Box, Image, Td, Text, Tr } from "@chakra-ui/react";
// types
import {
  EntityShape,
  EntityType,
  ModalOverlayReportPageShape,
  NaaarStandardsTableShape,
  ReportShape,
  ReportType,
} from "types";
// utils
import {
  getEntityDetailsMLR,
  getEntityStatus,
  getReportVerbiage,
  mapNaaarStandardsData,
  useStore,
} from "utils";
// assets
import unfinishedIcon from "assets/icons/icon_error_circle_bright.png";
import finishedIcon from "assets/icons/icon_check_circle.png";

export const ExportedModalOverlayReportSection = ({ section }: Props) => {
  const { report } = useStore();
  const entityType = section.entityType;
  const entities = report?.fieldData?.[entityType];
  const entityCount = entities?.length;

  const { exportVerbiage } = getReportVerbiage(report?.reportType);

  const { emptyEntityMessage, modalOverlayTableHeaders } = exportVerbiage;

  const headerLabels = Object.values(
    modalOverlayTableHeaders as Record<string, string>
  );

  return (
    <Box data-testid="exportedModalOverlayReportSection">
      {entityType === EntityType.STANDARDS && (
        <Text sx={sx.standardCount}>
          Standard total count:{" "}
          {entityCount > 0 ? entityCount : emptyEntityMessage[entityType]}
        </Text>
      )}
      {entityType === EntityType.STANDARDS && !entityCount ? null : (
        <>
          <Table
            sx={sx.root}
            content={{
              caption: "Reporting Overview",
              headRow: headerLabels,
            }}
            data-testid="exportTable"
          >
            {entities &&
              renderModalOverlayTableBody(report, entityType, entities)}
          </Table>
          {(!entities || entityCount === 0) && (
            <Text sx={sx.emptyState}> No entities found.</Text>
          )}
        </>
      )}
    </Box>
  );
};

export interface Props {
  section: ModalOverlayReportPageShape;
}

export function renderStatusIcon(status: boolean) {
  if (status) {
    return <Image src={finishedIcon} alt="success icon" boxSize="xl" />;
  }
  return <Image src={unfinishedIcon} alt="warning icon" boxSize="xl" />;
}

export function renderModalOverlayTableBody(
  report: ReportShape,
  entityType: EntityType,
  entities: EntityShape[]
) {
  const reportType = report.reportType;
  switch (reportType) {
    case ReportType.MLR:
      return entities.map((entity, idx) => {
        const { report_programName, mlrEligibilityGroup, reportingPeriod } =
          getEntityDetailsMLR(entity);
        const entityComplete = getEntityStatus(entity, report, entityType);

        return (
          <Tr key={idx}>
            <Td sx={sx.statusIcon}>
              <EntityStatusIcon isComplete={!!entityComplete} isPdf={true} />
            </Td>
            <Td>
              <Text sx={sx.tableIndex}>{idx + 1}</Text>
            </Td>
            <Td>
              <Text sx={sx.entityList}>
                {entity.report_planName ?? "Not entered"} <br />
                {report_programName} <br />
                {mlrEligibilityGroup} <br />
                {reportingPeriod}
              </Text>
            </Td>
            <Td>
              <Text>
                {entity.report_programType[0].value
                  ? entity.report_programType[0].value
                  : "Not entered"}
              </Text>
            </Td>
            <Td>
              <Text>
                {entity["report_reportingPeriodDiscrepancyExplanation"]
                  ? entity["report_reportingPeriodDiscrepancyExplanation"]
                  : "N/A"}
              </Text>
            </Td>
            <Td>
              <Text>
                {entity.report_miscellaneousNotes
                  ? entity.report_miscellaneousNotes
                  : "N/A"}
              </Text>
            </Td>
          </Tr>
        );
      });
    case ReportType.NAAAR:
      // render pattern for NAAAR Standards
      return entities.map((entity, idx) => {
        const {
          provider,
          standardType,
          description,
          analysisMethods,
          population,
          region,
        } = mapNaaarStandardsData<NaaarStandardsTableShape>([entity])[0];
        return (
          <Tr key={idx}>
            <Td>
              <Text sx={sx.tableIndex}>{idx + 1}</Text>
            </Td>
            {[
              provider,
              standardType,
              description,
              analysisMethods,
              population,
              region,
            ].map((value) => (
              <Td key={`${value}-${idx}`}>
                <Text>{value}</Text>
              </Td>
            ))}
          </Tr>
        );
      });
    default:
      throw new Error(
        `The modal overlay table headers for report type '${reportType}' have not been implemented.`
      );
  }
}

const sx = {
  root: {
    "@media print": {
      pageBreakInside: "avoid",
    },
    marginBottom: "spacer2",
    "tr, th": {
      verticalAlign: "bottom",
      lineHeight: "base",
      borderBottom: "1px solid",
      borderColor: "gray_lighter",
    },
    "th:nth-of-type(3)": {
      width: "15rem",
    },
    thead: {
      //this will prevent generating a new header whenever the table spills over in another page
      display: "table-row-group",
    },
    td: {
      p: {
        lineHeight: "1.25rem",
      },
      padding: "0.75rem 0.5rem",
      borderStyle: "none",
      fontWeight: "normal",
      color: "base",
      ".shrink &": {
        padding: "0.375rem 0rem",
      },
      ".mobile &": {
        fontSize: "xs",
      },
      verticalAlign: "middle",
    },
    th: {
      maxWidth: "100%",
      paddingBottom: "0.375rem",
      fontWeight: "bold",
      lineHeight: "lg",
      color: "gray",
      ".shrink &": {
        padding: "0.375rem 0rem",
      },
      "&:first-of-type": {
        textAlign: "center",
      },
    },
    ".desktop &": {
      "&.two-column": {
        "th:first-of-type": {
          paddingLeft: "6rem",
        },
      },
    },
  },
  standardCount: {
    display: "block",
    fontSize: "md",
    fontWeight: "bold",
    marginTop: "spacer1",
  },
  entityList: {
    wordBreak: "break-word",
  },
  tableIndex: {
    color: "gray",
    fontWeight: "bold",
  },
  statusIcon: {
    paddingLeft: "spacer2",
    img: {
      maxWidth: "fit-content",
    },
  },
  emptyState: {
    width: "100%",
    margin: "0 auto",
    textAlign: "center",
    paddingBottom: "5rem",
  },
};
