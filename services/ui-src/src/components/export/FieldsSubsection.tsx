import { useContext } from "react";
// components
import { Box, Heading } from "@chakra-ui/react";
import { Table, SpreadsheetWidget, ReportContext } from "components";
// utils
import {
  pareseFieldData,
  parseCustomHtml,
  pdfPreviewTableNumberParse,
} from "utils";
// types
import { FormJson, ReportPageVerbiage } from "types";

export const FieldsSubsection = ({ content }: FieldsSubsectionProps) => {
  const data = useContext(ReportContext);
  const sectionHeading = content.verbiage?.intro.subsection || content.name;
  const isNotDynamicField =
    content.form?.fields.filter((f) => f.type !== "dynamic").length !== 0;

  const headRowItems = isNotDynamicField
    ? ["Number", "Indicator", "Response"]
    : ["Indicator", "Response"];

  const fieldRowsItems = (field: any) => {
    if (isNotDynamicField) {
      return [
        `<strong>${pdfPreviewTableNumberParse(field.props).prefix}</strong>`,
        pdfPreviewTableNumberParse(field.props).suffix,
        pareseFieldData(data.report?.fieldData[field.id]),
      ];
    }

    return [`<strong>${field.props.label}</strong>`, pareseFieldData(field.id)];
  };

  return (
    <Box data-testid="fieldsSubSection" mt="2rem" key={content.path}>
      {sectionHeading && (
        <Heading as="h3" sx={sx.childHeading}>
          {sectionHeading}
        </Heading>
      )}

      {content.verbiage?.intro.info && (
        <Box sx={sx.intro}>{parseCustomHtml(content.verbiage?.intro.info)}</Box>
      )}

      {content.verbiage?.intro.spreadsheet && (
        <Box sx={sx.spreadSheet}>
          <SpreadsheetWidget
            description={content.verbiage?.intro.spreadsheet}
          />
        </Box>
      )}

      {content.form?.fields && (
        <Table
          sx={sx.dataTable}
          className={isNotDynamicField ? "standard" : "short"}
          content={{
            headRow: headRowItems,
            bodyRows: content.form?.fields
              .filter((f) => f.props)
              .map((field: any) => fieldRowsItems(field)),
          }}
        />
      )}
    </Box>
  );
};

interface FieldsSubsectionProps {
  content: {
    path: string;
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
        fontSize: "1rem",
        marginBottom: "0.5rem",
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
    fontWeight: "bold",
    fontSize: "1.3rem",
    marginBottom: "1.5rem",
  },
};
