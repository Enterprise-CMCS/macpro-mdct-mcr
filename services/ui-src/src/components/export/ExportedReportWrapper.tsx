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
    case PageTypes.REVIEW_SUBMIT:
      return <></>;
    default:
      return (
        <ExportedStandardReportSection
          section={section as StandardReportPageShape}
        />
      );
  }
};

interface Props {
  section: ReportRouteWithForm;
}
