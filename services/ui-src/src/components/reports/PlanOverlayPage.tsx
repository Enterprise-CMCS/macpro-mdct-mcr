/* eslint-disable @typescript-eslint/no-unused-vars */
// components
import { Box } from "@chakra-ui/react";
import { ReportPageFooter, ReportPageIntro } from "components";
// types
import { PlanOverlayReportPageShape } from "types";
// utils
import { useStore } from "utils";

export const PlanOverlayPage = ({
  route,
  setSidebarHidden,
  validateOnRender,
}: Props) => {
  // state management
  const { report } = useStore();

  return (
    <Box>
      {route.verbiage.intro && (
        <ReportPageIntro
          text={route.verbiage.intro}
          reportType={report?.reportType}
        />
      )}
      <ReportPageFooter />
    </Box>
  );
};

interface Props {
  route: PlanOverlayReportPageShape;
  setSidebarHidden: Function;
  validateOnRender?: boolean;
}
