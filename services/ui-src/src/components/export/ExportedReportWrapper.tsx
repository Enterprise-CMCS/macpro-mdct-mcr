// components
import {
  ExportedDrawerReportSection,
  ExportedModalDrawerReportSection,
  ExportedStandardReportSection,
} from "components";
import { PageTypes } from "types";
// utils

export const ExportedReportWrapper = ({
  section,
}: ExportedReportWrapperProps) => {
  switch (section.pageType) {
    case PageTypes.DRAWER:
      return <ExportedDrawerReportSection section={section} />;
    case PageTypes.MODAL_DRAWER:
      return <ExportedModalDrawerReportSection section={section} />;
    case PageTypes.REVIEW_SUBMIT:
      return <></>;
    default:
      return <ExportedStandardReportSection section={section} />;
  }
};

interface ExportedReportWrapperProps {
  section: any;
}
