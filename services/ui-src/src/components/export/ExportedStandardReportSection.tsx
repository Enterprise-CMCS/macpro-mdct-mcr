import { useContext } from "react";
// components
import { Box } from "@chakra-ui/react";
import { ExportedSectionHeading, ReportContext, Table } from "components";
// utils
import { parseAllLevels, parseDynamicFieldData, parseFieldLabel } from "utils";
// types
import { FormField, StandardReportPageShape } from "types";

export const ExportedStandardReportSection = ({
  section: { form, name, verbiage },
}: Props) => {
  const { report } = useContext(ReportContext);
  const sectionHeading: string = verbiage?.intro.subsection || name;
  const formFields = form?.fields;
  const formHasOnlyDynamicFields = form?.fields.every(
    (field) => field.type === "dynamic"
  );

  const headRowItems = formHasOnlyDynamicFields
    ? ["Indicator", "Response"]
    : ["Number", "Indicator", "Response"];

  const renderFieldRow = (field: FormField) => {
    if (field.type === "dynamic") {
      // if field is dynamic, return data in 2 columns
      return [
        field.props ? `<strong>${field.props.label}</strong>` : "",
        parseDynamicFieldData(report?.fieldData[field.id]),
      ];
    }
    // otherwise, return data in standard 3 columns
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
        <ExportedSectionHeading heading={sectionHeading} verbiage={verbiage} />
      )}
      {formFields && (
        <Table
          sx={sx.dataTable}
          className={formHasOnlyDynamicFields ? "two-column" : "three-column"}
          content={{
            headRow: headRowItems,
            bodyRows: formFields.map((field: FormField) =>
              renderFieldRow(field)
            ),
          }}
        />
      )}
    </Box>
  );
};

export interface Props {
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
    "&.three-column": {
      "th, td": {
        "&:first-of-type": {
          width: "5.5rem",
        },
        "&:nth-last-of-type(2)": {
          width: "14rem",
        },
      },
    },
    "&.two-column": {
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
