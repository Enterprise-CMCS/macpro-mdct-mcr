// components
import { Box } from "@chakra-ui/react";
import {
  ExportedModalDrawerReportSection,
  ExportedReportFieldTable,
  ExportedEntityDetailsOverlaySection,
  ExportedModalOverlayReportSection,
  ExportedPlanOverlayReportSection,
} from "components";
// types
import {
  DrawerReportPageShape,
  EntityType,
  ModalDrawerReportPageShape,
  ModalOverlayReportPageShape,
  PageTypes,
  PlanOverlayReportPageShape,
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
      // standards uses the table pattern from the modal overlay component
      if (section.entityType === EntityType.STANDARDS) {
        return (
          <ExportedModalOverlayReportSection
            section={section as ModalOverlayReportPageShape}
          />
        );
      }
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
          {/* quality measures uses the card pattern from the modal overlay component */}
          {section.entityType === EntityType.QUALITY_MEASURES ? (
            <ExportedModalDrawerReportSection
              section={section as ModalDrawerReportPageShape}
            />
          ) : (
            <>
              <ExportedModalOverlayReportSection
                section={section as ModalOverlayReportPageShape}
              />
              <ExportedEntityDetailsOverlaySection
                section={section as ModalOverlayReportPageShape}
              />
            </>
          )}
        </>
      );
    case PageTypes.PLAN_OVERLAY:
      return (
        <ExportedPlanOverlayReportSection
          section={section as PlanOverlayReportPageShape}
        />
      );
    default:
      return <></>;
  }
};

export interface Props {
  section: ReportRouteWithForm;
}
