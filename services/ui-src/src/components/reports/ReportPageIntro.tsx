// components
import { Box, Heading } from "@chakra-ui/react";
import { Alert, InstructionsAccordion, SpreadsheetWidget } from "components";
// utils
import { parseCustomHtml } from "utils";
import { AlertTypes, AnyObject } from "types";

export const ReportPageIntro = ({
  text,
  accordion,
  reportType,
  ...props
}: Props) => {
  const { section, subsection, hint, info, spreadsheet, alert } = text;
  const showAlert = alert;
  return (
    <Box sx={sx.introBox} {...props}>
      <Heading as="h1" sx={sx.sectionHeading}>
        {section}
      </Heading>
      <Heading as="h2" sx={sx.subsectionHeading}>
        {subsection}
      </Heading>
      {hint && <Box sx={sx.hintTextBox}>{hint}</Box>}
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
  accordion?: AnyObject;
  reportType?: string;
  [key: string]: any;
}

const sx = {
  introBox: {
    marginBottom: "2rem",
  },
  sectionHeading: {
    color: "palette.gray",
    fontSize: "md",
  },
  subsectionHeading: {
    fontWeight: "normal",
    fontSize: "4xl",
  },
  hintTextBox: {
    color: "#5B616B",
    paddingTop: "1.5rem",
  },
  spreadsheetWidgetBox: {
    marginTop: "2rem",
  },
  infoTextBox: {
    marginTop: "2rem",
    h4: {
      fontSize: "lg",
      marginBottom: "0.75rem",
    },
    "p, span": {
      color: "palette.gray",
      marginTop: "1rem",
    },
    a: {
      color: "palette.primary",
      "&:hover": {
        color: "palette.primary_darker",
      },
    },
    strong: {
      color: "palette.base",
    },
  },
};
