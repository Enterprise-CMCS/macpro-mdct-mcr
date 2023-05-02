// components
import { Box } from "@chakra-ui/react";
import {
  ExportedModalDrawerReportSection,
  ExportedReportFieldTable,
  ExportedEntityDetailsOverlaySection,
  ExportedModalOverlayReportSection,
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

export const ExportedReportWrapper = ({ section }: Props) => {
  switch (section.pageType) {
    case PageTypes.STANDARD:
      return (
        <Box data-testid="exportedStandardReportSection" mt="2rem">
          <ExportedReportFieldTable
            section={section as StandardReportPageShape}
          />
        </Box>
      );
    case PageTypes.DRAWER:
      return (
        <Box data-testid="exportedDrawerReportSection" mt="2rem">
          <ExportedReportFieldTable
            section={section as DrawerReportPageShape}
          />
        </Box>
      );
    case PageTypes.MODAL_DRAWER:
      return (
        <ExportedModalDrawerReportSection
          section={section as ModalDrawerReportPageShape}
        />
      );
    case PageTypes.MODAL_OVERLAY:
      return (
        <>
          <ExportedModalOverlayReportSection
            section={section as ModalOverlayReportPageShape}
          />
          <ExportedEntityDetailsOverlaySection
            section={section as ModalOverlayReportPageShape}
          />
        </>
      );
    default:
      return <></>;
  }
};

export interface Props {
  section: ReportRouteWithForm;
}
