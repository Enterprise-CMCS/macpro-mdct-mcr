// components
import { Box, Heading, Text } from "@chakra-ui/react";
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
  text = {},
  accordion,
  reportType,
  hasIlos,
  sxOverride,
  table,
  formRequiredText,
  ...props
}: Props) => {
  const { section, subsection, eyebrow, hint, info, spreadsheet, alert } = text;
  const sectionDForIlos = subsection === "Topic XI. ILOS";
  const showAlert = sectionDForIlos ? !hasIlos : alert;

  return (
    <Box sx={sx.introBox} {...props}>
      {eyebrow && (
        <Box>
          <Text as="p" sx={sx.eyebrow}>
            {eyebrow}
          </Text>
          <Heading as="h1" sx={sx.sectionHeading}>
            {section}
          </Heading>
        </Box>
      )}
      {!eyebrow && section && (
        <Heading as="h1" sx={subsection ? sx.eyebrow : sx.sectionHeading}>
          {section}
        </Heading>
      )}
      {subsection && (
        <Heading as="h2" sx={sx.sectionHeading}>
          {subsection}
        </Heading>
      )}
      {table && (
        <Table content={table} sx={{ ...sx.table, ...sxOverride?.table }} />
      )}
      {hint && <Box sx={sx.hintTextBox}>{parseCustomHtml(hint)}</Box>}
      {/* If there's a hint, put the form required text after hint */}
      {hint && formRequiredText && (
        <Text sx={sx.formRequiredText}>{formRequiredText}</Text>
      )}
      {spreadsheet && (
        <Box sx={sx.spreadsheetWidgetBox}>
          <SpreadsheetWidget
            description={spreadsheet}
            reportType={reportType}
          />
        </Box>
      )}
      {info && <Box sx={sx.infoTextBox}>{parseCustomHtml(info)}</Box>}
      {/* If there's no hint, put the form required text after info */}
      {!hint && formRequiredText && (
        <Text sx={sx.formRequiredText}>{formRequiredText}</Text>
      )}
      {showAlert && <Alert status={AlertTypes.WARN} description={alert} />}
      {accordion && <InstructionsAccordion verbiage={accordion} />}
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
  formRequiredText?: string;
  [key: string]: any;
}

const sx = {
  introBox: {
    marginBottom: "spacer4",
  },
  eyebrow: {
    color: "gray",
    fontSize: "md",
    marginBottom: "spacer1",
  },
  sectionHeading: {
    fontWeight: "normal",
    fontSize: "4xl",
  },
  hintTextBox: {
    color: "#5B616B",
    paddingTop: "spacer3",
    a: {
      color: "primary",
      textDecoration: "underline",
      "&:hover": {
        color: "primary_darker",
      },
    },
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
    "p + h4": {
      marginTop: "spacer2",
    },
    "p + ol": {
      marginTop: "spacer2",
    },
    "ol, li": {
      color: "gray",
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
  formRequiredText: {
    color: "gray",
    marginTop: "spacer2",
  },
  table: {
    marginTop: "spacer3",
  },
};
