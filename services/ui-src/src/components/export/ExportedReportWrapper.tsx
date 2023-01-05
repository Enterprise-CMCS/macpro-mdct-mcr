// components
import {
  ExportedDrawerReportSection,
  ExportedModalDrawerReportSection,
  ExportedStandardReportSection,
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
        <ExportedStandardReportSection
          section={section as StandardReportPageShape}
        />
      );
    case PageTypes.DRAWER:
      return (
        <ExportedDrawerReportSection
          section={section as DrawerReportPageShape}
        />
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
