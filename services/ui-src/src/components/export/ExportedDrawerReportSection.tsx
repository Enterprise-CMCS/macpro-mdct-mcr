// components
import { Box, Heading } from "@chakra-ui/react";
import { ReportContext, SpreadsheetWidget, Table } from "components";
import { useContext } from "react";
import { FormJson, ReportPageVerbiage } from "types";
import {
  parseCustomHtml,
  parseDynamicFieldData,
  parseFieldData,
  parseFieldLabel,
} from "utils";
// utils

export const ExportedDrawerReportSection = ({
  section: { drawerForm, form, name, verbiage },
}: ExportedDrawerReportSectionProps) => {
  const { report } = useContext(ReportContext);
  const sectionHeading = verbiage?.intro.subsection || name;
  const isDynamicField = form?.fields.filter(
    (f) => f.type === "dynamic"
  ).length;

  const headRowItems = isDynamicField
    ? ["Indicator", "Response"]
    : ["Number", "Indicator", "Response"];

  const fieldRowsItems = (field: any) => {
    const drawerData =
      report?.fieldData.plans !== undefined &&
      report?.fieldData.plans
        .map((plan: any) => {
          return `<p><strong>{${plan.name}}</strong></p><p>${parseFieldData({
            data: plan[field.id],
            mask: field.props.mask,
            validation: field.validation,
          })}</p><br>`;
        })
        .join(" ");

    if (isDynamicField) {
      return [
        `<strong>${field.props.label}</strong>`,
        parseDynamicFieldData(report?.fieldData[field.id]),
      ];
    }

    return [
      `<strong>${parseFieldLabel(field.props).indicator}</strong>`,
      parseFieldLabel(field.props).label,
      parseFieldData({ data: drawerData }),
    ];
  };

  const formFields = drawerForm.fields;

  return (
    <Box data-testid="fieldsSubSection" mt="2rem">
      <p>Drawer Report Section</p>
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

interface ExportedDrawerReportSectionProps {
  section: {
    drawerForm: FormJson;
    name: string;
    form?: FormJson;
    verbiage?: ReportPageVerbiage;
  };
}

const sx = {
  dataTable: {
    marginBottom: "1rem",
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
