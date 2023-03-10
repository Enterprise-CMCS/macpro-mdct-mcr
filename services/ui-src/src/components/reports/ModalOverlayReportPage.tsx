import { useContext } from "react";
// components
import { Box, Button, Heading } from "@chakra-ui/react";
import { ReportContext, ReportPageFooter, ReportPageIntro } from "components";
// utils
import { ModalOverlayReportPageShape } from "types";
// verbiage
import accordionVerbiage from "../../verbiage/pages/mlr/mlr-accordions";

export const ModalOverlayReportPage = ({ route }: Props) => {
  const { verbiage } = route;

  const { report } = useContext(ReportContext);
  const reportFieldDataEntities = report?.fieldData["program"] || [];

  const dashTitle = `${verbiage.dashboardTitle}${
    verbiage.countEntitiesInTitle ? ` ${reportFieldDataEntities.length}` : ""
  }`;

  return (
    <Box data-testid="modal-overlay-report-page">
      {verbiage.intro && (
        <ReportPageIntro
          text={verbiage.intro}
          accordion={accordionVerbiage.formIntro}
        />
      )}
      {/* TODO: Table for MLR reporting programs */}
      <Box sx={sx.dashboardBox}>
        <Heading as="h3" sx={sx.dashboardTitle}>
          {dashTitle}
        </Heading>
        {reportFieldDataEntities.length === 0 && (
          <Box>{verbiage.emptyDashboardText}</Box>
        )}
        <Button sx={sx.addEntityButton}>{verbiage.addEntityButtonText}</Button>
      </Box>
      <ReportPageFooter />
    </Box>
  );
};

interface Props {
  route: ModalOverlayReportPageShape;
}

const sx = {
  dashboardBox: { textAlign: "center" },
  dashboardTitle: {
    marginBottom: "1.25rem",
    fontSize: "md",
    fontWeight: "bold",
    color: "palette.gray_medium",
    textAlign: "left",
  },

  addEntityButton: {
    marginTop: "1.5rem",
    marginBottom: "2rem",
  },
  bottomAddEntityButton: {
    marginTop: "2rem",
    marginBottom: "0",
  },
};
