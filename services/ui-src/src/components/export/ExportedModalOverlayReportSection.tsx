import React, { useContext } from "react";
// components
import { ReportContext, Table } from "components";
// types, utils
import { EntityShape, ModalOverlayReportPageShape, ReportType } from "types";
// verbiage
import mcparVerbiage from "../../verbiage/pages/mcpar/mcpar-export";
import mlrVerbiage from "../../verbiage/pages/mlr/mlr-export";
import { Box, Image, Td, Text, Tr } from "@chakra-ui/react";
import { assertExhaustive } from "utils/other/typing";
import unfinishedIcon from "assets/icons/icon_error_circle_bright.png";
import finishedIcon from "assets/icons/icon_check_circle.png";
import { getEntityDetailsMLR } from "utils";

const exportVerbiageMap: { [key in ReportType]: any } = {
  MCPAR: mcparVerbiage,
  MLR: mlrVerbiage,
  NAAAR: undefined,
};

export const ExportedModalOverlayReportSection = ({ section }: Props) => {
  const { report } = useContext(ReportContext);
  const entityType = section.entityType;

  const verbiage = exportVerbiageMap[report?.reportType as ReportType];

  const { modalOverlayTableHeaders } = verbiage;

  const headerLabels = Object.values(
    modalOverlayTableHeaders as Record<string, string>
  );

  return (
    <Box>
      <Table
        sx={sx.root}
        content={{
          headRow: headerLabels,
        }}
        data-testid="exportTable"
      >
        {report?.fieldData[entityType] &&
          renderModalOverlayTableBody(
            report?.reportType as ReportType,
            report?.fieldData[entityType]
          )}
      </Table>
      {(!report?.fieldData[entityType] ||
        report?.fieldData[entityType].length === 0) && (
        <Text sx={sx.emptyState}> No entities found.</Text>
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

// render '<' special character
export function renderHTML(rawHTML: string) {
  const specialChar = React.createElement("span", {
    dangerouslySetInnerHTML: { __html: rawHTML },
  });
  return specialChar;
}

export function renderModalOverlayTableBody(
  reportType: ReportType,
  entities: EntityShape[]
) {
  switch (reportType) {
    case ReportType.MLR:
      return entities.map((entity, idx) => {
        const { report_programName, eligibilityGroup, reportingPeriod } =
          getEntityDetailsMLR(entity);
        return (
          <Tr key={idx}>
            <Td sx={sx.statusIcon}>{renderStatusIcon(false)}</Td>
            <Td>
              <Text sx={sx.tableIndex}>{idx + 1}</Text>
            </Td>
            <Td>
              <Text>
                {report_programName} <br />
                {eligibilityGroup()} <br />
                {reportingPeriod} <br />
                {entity.report_planName ?? "Not entered"}
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
    case ReportType.MCPAR:
    case ReportType.NAAAR:
      throw new Error(
        `The modal overlay table headers for report type '${reportType}' have not been implemented.`
      );
    default:
      assertExhaustive(reportType);
      throw new Error(
        `The modal overlay table headers for report type '${reportType}' have not been implemented.`
      );
  }
}

const sx = {
  root: {
    marginBottom: "1rem",
    "tr, th": {
      verticalAlign: "bottom",
      lineHeight: "base",
      borderBottom: "1px solid",
      borderColor: "palette.gray_lighter",
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
      color: "palette.base",
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
      color: "palette.gray_medium",
      ".shrink &": {
        padding: "0.375rem 0rem",
      },
      "&:first-of-type": {
        paddingLeft: 0,
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
  tableIndex: {
    color: "palette.gray_medium",
    fontWeight: "bold",
  },
  statusIcon: {
    paddingLeft: "1rem",
    img: {
      maxWidth: "fit-content",
    },
  },
  emptyState: {
    width: "150%",
    margin: "0 auto",
    textAlign: "center",
    paddingBottom: "5rem",
  },
};
