import { useContext } from "react";
// components
import { Box, Button, Heading } from "@chakra-ui/react";
import {
  FormIntroAccordion,
  ReportContext,
  ReportPageFooter,
  ReportPageIntro,
} from "components";
// utils
import { ModalOverlayReportPageShape } from "types";
// verbiage
import accordion from "../../verbiage/pages/mlr/mlr-accordions";

export const ModalOverlayReportPage = ({ route }: Props) => {
  const { verbiage } = route;

  const { report } = useContext(ReportContext);
  const reportFieldDataEntities = report?.fieldData["program"] || [];

  const dashTitle = `${verbiage.dashboardTitle}${
    verbiage.countEntitiesInTitle ? ` ${reportFieldDataEntities.length}` : ""
  }`;

  return (
    <Box data-testid="modal-overlay-report-page">
      {verbiage.intro && <ReportPageIntro text={verbiage.intro} />}
      <Box>
        <Button sx={sx.topAddEntityButton}>
          {verbiage.addEntityButtonText}
        </Button>
        {reportFieldDataEntities.length !== 0 && (
          <Heading as="h3" sx={sx.dashboardTitle}>
            {dashTitle}
          </Heading>
        )}
        <FormIntroAccordion verbiage={accordion} />
        {reportFieldDataEntities.length > 1 && (
          <Button sx={sx.bottomAddEntityButton}>
            {verbiage.addEntityButtonText}
          </Button>
        )}
      </Box>
      <ReportPageFooter />
    </Box>
  );
};

interface Props {
  route: ModalOverlayReportPageShape;
}

const sx = {
  dashboardTitle: {
    marginBottom: "1.25rem",
    fontSize: "md",
    fontWeight: "bold",
    color: "palette.gray_medium",
  },
  topAddEntityButton: {
    marginTop: "1.5rem",
    marginBottom: "2rem",
  },
  bottomAddEntityButton: {
    marginTop: "2rem",
    marginBottom: "0",
  },
};
