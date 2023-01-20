// components
import { Box } from "@chakra-ui/react";
import {
  ExportedModalDrawerReportSection,
  ExportedReportFieldTable,
} from "components";
// types
import {
  DrawerReportPageShape,
  ModalDrawerReportPageShape,
  PageTypes,
  ReportRouteWithForm,
  StandardReportPageShape,
} from "types";

export const ExportedReportWrapper = ({ section }: Props) => {
  return section.pageType === PageTypes.STANDARD ? (
    <Box data-testid="exportedStandardReportSection" mt="2rem">
      <ExportedReportFieldTable section={section as StandardReportPageShape} />
    </Box>
  ) : section.pageType === PageTypes.DRAWER ? (
    <Box data-testid="exportedDrawerReportSection" mt="2rem">
      <ExportedReportFieldTable section={section as DrawerReportPageShape} />
    </Box>
  ) : (
    <ExportedModalDrawerReportSection
      section={section as ModalDrawerReportPageShape}
    />
  );
};

export interface Props {
  section: ReportRouteWithForm;
}
