// components
import { Box, Heading } from "@chakra-ui/react";
import {
  Alert,
  InstructionsAccordion,
  SpreadsheetWidget,
  Table,
} from "components";
// types
import { AlertTypes, AnyObject, TableContentShape } from "types";
// utils
import { parseCustomHtml } from "utils";

export const ReportPageIntro = ({
  text,
  accordion,
  reportType,
  hasIlos,
  sxOverride,
  table,
  ...props
}: Props) => {
  const { section, subsection, hint, info, spreadsheet, alert } = text;
  const sectionDForIlos = subsection === "Topic XI. ILOS";
  const showAlert = sectionDForIlos ? !hasIlos : alert;

  return (
    <Box sx={sx.introBox} {...props}>
      <Heading as="h1" sx={sx.sectionHeading}>
        {section}
      </Heading>
      <Heading as="h2" sx={sx.subsectionHeading}>
        {subsection}
      </Heading>
      {table && (
        <Table content={table} sx={{ ...sx.table, ...sxOverride?.table }} />
      )}
      {hint && <Box sx={sx.hintTextBox}>{parseCustomHtml(hint)}</Box>}
      {accordion && <InstructionsAccordion verbiage={accordion} />}
      {spreadsheet && (
        <Box sx={sx.spreadsheetWidgetBox}>
          <SpreadsheetWidget
            description={spreadsheet}
            reportType={reportType}
          />
        </Box>
      )}
      {showAlert && <Alert status={AlertTypes.WARNING} description={alert} />}
      {info && <Box sx={sx.infoTextBox}>{parseCustomHtml(info)}</Box>}
    </Box>
  );
};

interface Props {
  text: AnyObject;
  accordion?: {
    buttonLabel: string;
    text: string;
  };
  reportType?: string;
  hasIlos?: boolean;
  table?: TableContentShape;
  [key: string]: any;
}

const sx = {
  introBox: {
    marginBottom: "spacer4",
  },
  sectionHeading: {
    color: "gray",
    fontSize: "md",
    marginBottom: "spacer1",
  },
  subsectionHeading: {
    fontWeight: "normal",
    fontSize: "4xl",
  },
  hintTextBox: {
    color: "#5B616B",
    paddingTop: "spacer3",
  },
  spreadsheetWidgetBox: {
    marginTop: "spacer4",
  },
  infoTextBox: {
    marginTop: "spacer4",
    h4: {
      fontSize: "lg",
      marginBottom: "0.75rem",
    },
    "p, span": {
      color: "gray",
      marginTop: "spacer2",
    },
    a: {
      color: "primary",
      "&:hover": {
        color: "primary_darker",
      },
    },
    "b, strong": {
      color: "base",
    },
  },
  table: {
    marginTop: "spacer3",
  },
};
