import { Table, SpreadsheetWidget } from "components";
import { Box, Heading } from "@chakra-ui/react";
import { parseCustomHtml, pdfPreviewTableNumberParse } from "utils";
import { sxDataTable } from "components/pages/ReviewSubmit/McparPdfExport";
import { CustomHtmlElement } from "types";

const FieldsSubsection = ({ content }: FieldsSubsectionProps) => {
  const sectionHeading = content.verbiage?.intro.subsection || content.name;

  return (
    <Box data-testid="fieldsSubSection" mt="2rem" key={content.path}>
      <Heading as="h3" sx={sx.childHeading}>
        {sectionHeading}
      </Heading>

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
          sx={sxDataTable}
          className="standard"
          content={{
            headRow: ["Number", "Indicator", "Response"],
            bodyRows: content.form?.fields.map((field: any) =>
              field.props
                ? [
                    `<strong>${
                      pdfPreviewTableNumberParse(field.props).prefix
                    }</strong>`,
                    pdfPreviewTableNumberParse(field.props).suffix,
                    "response",
                  ]
                : []
            ),
          }}
        />
      )}
    </Box>
  );
};

export { FieldsSubsection };

interface FieldsSubsectionProps {
  content: {
    path: string;
    name: string;
    form?: {
      fields: {
        props?: {
          label: string;
          hint?: string;
        };
      }[];
    };
    verbiage?: {
      intro: {
        subsection?: string;
        info?: string | CustomHtmlElement[];
        spreadsheet?: string;
      };
    };
  };
}

const sx = {
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
