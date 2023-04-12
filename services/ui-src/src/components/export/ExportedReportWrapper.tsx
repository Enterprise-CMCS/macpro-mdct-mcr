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
  ModalOverlayReportPageShape,
  PageTypes,
  ReportRouteWithForm,
  StandardReportPageShape,
} from "types";
import { ExportedModalOverlayReportSection } from "./ExportedModalOverlayReportSection";

export const ExportedReportWrapper = ({ section }: Props) => {
  return section.pageType === PageTypes.STANDARD ? (
    <Box data-testid="exportedStandardReportSection" mt="2rem">
      <ExportedReportFieldTable section={section as StandardReportPageShape} />
    </Box>
  ) : section.pageType === PageTypes.DRAWER ? (
    <Box data-testid="exportedDrawerReportSection" mt="2rem">
      <ExportedReportFieldTable section={section as DrawerReportPageShape} />
    </Box>
  ) : section.pageType === PageTypes.MODAL_DRAWER ? (
    <ExportedModalDrawerReportSection
      section={section as ModalDrawerReportPageShape}
    />
  ) : section.pageType === PageTypes.MODAL_OVERLAY ? (
    <ExportedModalOverlayReportSection
      section={section as ModalOverlayReportPageShape}
    />
  ) : (
    <></>
  );
};

export interface Props {
  section: ReportRouteWithForm;
}
