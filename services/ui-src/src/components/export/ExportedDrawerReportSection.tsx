// components
import { Box } from "@chakra-ui/react";
import { ExportedReportFieldTable } from "components";
// types, utils
import { DrawerReportPageShape } from "types";

export const ExportedDrawerReportSection = ({ section }: Props) => {
  return (
    <Box data-testid="exportedDrawerReportSection" mt="2rem">
      <ExportedReportFieldTable section={section} />
    </Box>
  );
};

export interface Props {
  section: DrawerReportPageShape;
}
