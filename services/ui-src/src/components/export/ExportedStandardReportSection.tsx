// components
import { Box } from "@chakra-ui/react";
import { ExportedSectionHeading, ExportedReportFieldTable } from "components";
// types, utils
import { StandardReportPageShape } from "types";

export const ExportedStandardReportSection = ({ section }: Props) => {
  const { verbiage, name } = section;
  return (
    <Box data-testid="exportedStandardReportSection" mt="2rem">
      <ExportedSectionHeading
        heading={verbiage?.intro.subsection || name}
        verbiage={verbiage}
      />
      <ExportedReportFieldTable section={section} />
    </Box>
  );
};

export interface Props {
  section: StandardReportPageShape;
}
