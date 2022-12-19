// components
import {
  ExportedDrawerReportSection,
  ExportedModalDrawerReportSection,
  ExportedStandardReportSection,
} from "components";
import {
  DrawerReportPageShape,
  ModalDrawerReportPageShape,
  PageTypes,
  StandardReportPageShape,
} from "types";
// utils

export const ExportedReportWrapper = ({
  section,
}: ExportedReportWrapperProps) => {
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

interface ExportedReportWrapperProps {
  section:
    | DrawerReportPageShape
    | StandardReportPageShape
    | ModalDrawerReportPageShape;
}
