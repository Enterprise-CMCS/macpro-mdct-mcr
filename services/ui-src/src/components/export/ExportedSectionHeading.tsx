// components
import { Box, Heading } from "@chakra-ui/react";
import { SpreadsheetWidget } from "components";
// utils
import { parseCustomHtml } from "utils";

export const ExportedSectionHeading = ({
  heading,
  verbiage,
  existingEntity,
}: any) => {
  const sectionHeading = verbiage?.intro.subsection || heading;

  return (
    <Box>
      {sectionHeading && (
        <Heading as="h3" sx={sx.childHeading}>
          {sectionHeading}
        </Heading>
      )}

      {existingEntity && verbiage?.intro?.info && (
        <Box sx={sx.intro}>{parseCustomHtml(verbiage?.intro.info)}</Box>
      )}

      {existingEntity && verbiage?.intro?.spreadsheet && (
        <Box sx={sx.spreadSheet}>
          <SpreadsheetWidget description={verbiage?.intro.spreadsheet} />
        </Box>
      )}
    </Box>
  );
};

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
    marginBottom: "1.5rem",
    fontSize: "xl",
    fontWeight: "bold",
  },
};
