// components
import { Box, Heading } from "@chakra-ui/react";
import { SpreadsheetWidget } from "components";
// utils
import { parseCustomHtml } from "utils";
import { AnyObject } from "types";

export const ReportPageIntro = ({ text }: Props) => {
  const { section, subsection, info, spreadsheet } = text;
  return (
    <Box sx={sx.introBox}>
      <Heading as="h1" sx={sx.sectionHeading}>
        {section}
      </Heading>
      <Heading as="h2" sx={sx.subsectionHeading}>
        {subsection}
      </Heading>
      {spreadsheet && (
        <Box sx={sx.spreadsheetWidgetBox}>
          <SpreadsheetWidget content={spreadsheet} />
        </Box>
      )}
      {info && <Box sx={sx.infoTextBox}>{parseCustomHtml(info)}</Box>}
    </Box>
  );
};

interface Props {
  text: AnyObject;
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
    },
    a: {
      color: "palette.primary",
      "&:hover": {
        color: "palette.primary_darker",
      },
    },
  },
};
