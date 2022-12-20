// components
import { Box, Heading } from "@chakra-ui/react";
import { ReportContext, SpreadsheetWidget, Table } from "components";
import { useContext } from "react";
import { StandardReportPageShape } from "types";
import {
  parseAllLevels,
  parseCustomHtml,
  parseDynamicFieldData,
  parseFieldLabel,
} from "utils";
// utils

export const ExportedStandardReportSection = ({
  section: { form, name, verbiage },
}: ExportedStandardReportSectionProps) => {
  const { report } = useContext(ReportContext);
  const sectionHeading = verbiage?.intro.subsection || name;
  const formFields = form?.fields;
  const isDynamicField = form?.fields.filter(
    (f: { type: string }) => f.type === "dynamic"
  ).length;

  const headRowItems = isDynamicField
    ? ["Indicator", "Response"]
    : ["Number", "Indicator", "Response"];

  const fieldRowsItems = (field: any) => {
    if (isDynamicField) {
      return [
        field.props ? `<strong>${field.props.label}</strong>` : "",
        parseDynamicFieldData(report?.fieldData[field.id]),
      ];
    }
    return [
      field.props
        ? `<strong>${parseFieldLabel(field.props).indicator}</strong>`
        : "",
      field.props ? parseFieldLabel(field.props).label : "",
      `<div class="answers">${parseAllLevels({
        ...field,
        fieldData: report?.fieldData,
      })}</div>`,
    ];
  };

  return (
    <Box data-testid="exportedStandardReportSection" mt="2rem">
      {sectionHeading && (
        <Heading as="h3" sx={sx.childHeading}>
          {sectionHeading}
        </Heading>
      )}

      {verbiage?.intro?.info && (
        <Box sx={sx.intro}>{parseCustomHtml(verbiage.intro.info)}</Box>
      )}

      {verbiage?.intro?.spreadsheet && (
        <Box sx={sx.spreadSheet}>
          <SpreadsheetWidget description={verbiage.intro.spreadsheet} />
        </Box>
      )}

      {formFields && (
        <Table
          sx={sx.dataTable}
          className={isDynamicField ? "short" : "standard"}
          content={{
            headRow: headRowItems,
            bodyRows: formFields.map((field: any) => {
              return fieldRowsItems(field);
            }),
          }}
        />
      )}
    </Box>
  );
};

export interface ExportedStandardReportSectionProps {
  section: StandardReportPageShape;
}

const sx = {
  dataTable: {
    marginBottom: "1rem",
    ".answers": {
      p: {
        margin: "0 0 1rem",
      },
    },
    p: {
      strong: {
        display: "inline-block",
        marginBottom: "0.5rem",
        fontSize: "1rem",
      },
    },
    "th, td": {
      verticalAlign: "top",
      lineHeight: "base",
      borderBottom: "1px solid",
      borderColor: "palette.gray_lighter",
    },
    "&.standard": {
      "th, td": {
        "&:first-of-type": {
          width: "5.5rem",
        },
        "&:nth-last-of-type(2)": {
          width: "14rem",
        },
      },
    },
    "&.short": {
      tr: {
        p: {
          marginBottom: "1rem",
          "&:last-of-type": {
            marginBottom: 0,
          },
        },
        "th, td": {
          "&:first-of-type": {
            ".desktop &": {
              paddingLeft: "6rem",
            },
          },
          "&:nth-last-of-type(2)": {
            width: "19.5rem",
          },
        },
      },
    },
  },
  intro: {
    p: {
      margin: "1.5rem 0",
    },
  },
  spreadSheet: {
    marginBottom: "1.5rem",
  },
  childHeading: {
    marginBottom: "1.5rem",
    fontSize: "xl",
    fontWeight: "bold",
  },
};
