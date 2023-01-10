// components
import { Box } from "@chakra-ui/react";
import { ExportedReportFieldTable } from "components";
// types, utils
import { StandardReportPageShape } from "types";

export const ExportedStandardReportSection = ({ section }: Props) => {
  return (
    <Box data-testid="exportedStandardReportSection" mt="2rem">
      <ExportedReportFieldTable section={section} />
    </Box>
  );
};

export interface Props {
  section: StandardReportPageShape;
}
