// components
import { Box } from "@chakra-ui/react";
import { ExportedSectionHeading, ReportContext, Table } from "components";
import { useContext } from "react";
// types
import { StandardReportPageShape } from "types";
// utils
import { parseAllLevels, parseDynamicFieldData, parseFieldLabel } from "utils";

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
        `<strong>${field.props.label}</strong>`,
        parseDynamicFieldData(report?.fieldData[field.id]),
      ];
    }
    return [
      `<strong>${parseFieldLabel(field.props).indicator}</strong>`,
      parseFieldLabel(field.props).label,
      `<div class="answers">${parseAllLevels({
        ...field,
        fieldData: report?.fieldData,
      })}</div>`,
    ];
  };

  return (
    <Box data-testid="exportedStandardReportSection" mt="2rem">
      {sectionHeading && (
        <ExportedSectionHeading heading={sectionHeading} verbiage={verbiage} />
      )}

      {formFields && (
        <Table
          sx={sx.dataTable}
          className={isDynamicField ? "short" : "standard"}
          content={{
            headRow: headRowItems,
            bodyRows: formFields
              .filter((f) => f.props)
              .map((field: any) => {
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
};
