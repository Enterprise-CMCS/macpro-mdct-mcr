import { useContext } from "react";
// components
import { Box } from "@chakra-ui/react";
import { ExportedSectionHeading, ReportContext, Table } from "components";
// types
import { DrawerReportPageShape, FormField } from "types";
// utils
import { parseAllLevels, parseFieldLabel } from "utils";

export const ExportedDrawerReportSection = ({
  section,
  section: { drawerForm, name, verbiage },
}: Props) => {
  const { report } = useContext(ReportContext);
  const sectionHeading = verbiage?.intro.subsection || name;

  const renderFieldRow = (field: FormField, entityType: string) => {
    const drawerData =
      report?.fieldData[entityType] !== undefined &&
      report?.fieldData[entityType]
        .map((plan: any) => {
          return `<div class="plan-answers"><p><strong>${
            plan.name
          }</strong></p>${parseAllLevels({
            ...field,
            fieldData: plan,
          })}</div>`;
        })
        .join(" ");

    return [
      field.props
        ? `<strong>${parseFieldLabel(field.props).indicator}</strong>`
        : "",
      field.props ? parseFieldLabel(field.props).label : "",
      drawerData || `<p style="color:#9F142B">Not Answered</p>`,
    ];
  };

  const formFields = drawerForm.fields;

  return (
    <Box data-testid="exportedDrawerReportSection" mt="2rem">
      {sectionHeading && (
        <ExportedSectionHeading heading={sectionHeading} verbiage={verbiage} />
      )}
      {formFields && (
        <Table
          sx={sx.dataTable}
          className="standard"
          content={{
            headRow: ["Number", "Indicator", "Response"],
            bodyRows: formFields.map((field: FormField) =>
              renderFieldRow(field, section.entityType)
            ),
          }}
        />
      )}
    </Box>
  );
};

export interface Props {
  section: DrawerReportPageShape;
}

const sx = {
  dataTable: {
    marginBottom: "1rem",
    ".plan-answers": {
      marginBottom: "1.5rem",
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
