import { useContext } from "react";
// components
import { Box, Heading } from "@chakra-ui/react";
import { ReportContext, SpreadsheetWidget, Table } from "components";
// types
import { DrawerReportPageShape } from "types";
// utils
import { parseAllLevels, parseCustomHtml, parseFieldLabel } from "utils";

export const ExportedDrawerReportSection = ({
  section: { drawerForm, name, verbiage },
}: ExportedDrawerReportSectionProps) => {
  const { report } = useContext(ReportContext);
  const sectionHeading = verbiage?.intro.subsection || name;

  const fieldRowsItems = (field: any) => {
    const drawerData =
      report?.fieldData.plans !== undefined &&
      report?.fieldData.plans
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
      `<strong>${parseFieldLabel(field.props).indicator}</strong>`,
      parseFieldLabel(field.props).label,
      drawerData,
    ];
  };

  const formFields = drawerForm.fields;

  return (
    <Box data-testid="exportedDrawerReportSection" mt="2rem">
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
          className="standard"
          content={{
            headRow: ["Number", "Indicator", "Response"],
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

export interface ExportedDrawerReportSectionProps {
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
