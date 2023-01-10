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
    default:
      return <></>;
  }
};

export interface Props {
  section: ReportRouteWithForm;
}
