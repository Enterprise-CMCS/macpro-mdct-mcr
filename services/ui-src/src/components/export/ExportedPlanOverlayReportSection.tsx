// components
import { Box, Text } from "@chakra-ui/react";
// types
import { PlanOverlayReportPageShape } from "types";

export const ExportedPlanOverlayReportSection = ({ section }: Props) => {
  return (
    <Box data-testid="exportedPlanOverlayReportSection">
      <Text>{section.name}</Text>
    </Box>
  );
};

export interface Props {
  section: PlanOverlayReportPageShape;
}
