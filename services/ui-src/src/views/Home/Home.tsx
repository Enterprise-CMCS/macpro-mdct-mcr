/* eslint-disable */
import { Navigate } from "react-router-dom";
// components
import { Box, Flex, Text } from "@chakra-ui/react";
import { Banner, TemplateCard } from "../../components/index";
// utils
import { UserRoles } from "utils/types/types";
import { useUser } from "utils/auth";

export default () => {
  const { userRole, userState } = useUser();
  const isAdminUser = userRole && userRole !== UserRoles.STATE;

  if (isAdminUser) {
    return <Navigate to={`/admin`} />;
  }

  return (
    <section>
      {userState ? (
        <Box sx={sx.root} data-testid="home-view">
          <Banner
            // status="info"
            bgColor="palette.alt_lightest"
            accentColor="palette.alt"
            title="Welcome to the new Managed Care Reporting tool!"
            description="Each state must submit one report per program."
          />
          <Flex sx={sx.mainContentFlex}>
            <Box sx={sx.leadTextBox}>
              <Box textStyle="h1" sx={sx.headerText}>
                Your fiscal year 2022 templates
              </Box>
              <Box textStyle="body">
                Download these templates to begin gathering administrative data
                for your Medicaid managed care program. Submit your completed
                report to the Centers for Medicare and Medicaid Services (CMS)
                through this website beginning October 2022.
              </Box>
            </Box>
            <TemplateCard templateName="MCPAR"></TemplateCard>
          </Flex>
        </Box>
      ) : (
        <Box data-testid="home-view">
          <Text>You are not authorized to view this page</Text>
        </Box>
      )}
    </section>
  );
};

const sx = {
  root: {
    flexShrink: "0",
  },
  mainContentFlex: {
    alignItems: "center",
    flexDirection: "column",
    maxWidth: "46rem",
    margin: "0 auto",
  },
  leadTextBox: {
    marginBottom: "2.25rem",
  },
  headerText: {
    fontWeight: "normal",
    fontSize: "2rem",
  },
};
