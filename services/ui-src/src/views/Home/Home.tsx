/* eslint-disable */
import { Navigate } from "react-router-dom";
// components
import { Box, Flex, Text } from "@chakra-ui/react";
import { InfoBanner, TemplateCard } from "../../components/index";
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
          <InfoBanner />
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
  },
  leadTextBox: {
    maxW: "45.75rem",
    marginBottom: "2.25rem",
  },
  headerText: {
    fontWeight: "normal",
    fontSize: "2rem",
  },
  downloadCardStack: {
    // textAlign: "left",
    // py: 6,
    // color: "palette.gray",
    // align: "left",
    // width: "46rem",
    // boxShadow: "0px 3px 9px rgba(0, 0, 0, 0.2)",
    // direction: "row",
  },
  spreadsheetIconFlex: {
    // justify: "center",
    // width: "9.5rem",
  },
  spreadsheetIcon: {
    // boxSize: "5.5rem",
  },
  cardContentFlex: {
    // flexDirection: "column",
    // gap: "0.5rem",
  },
  templateNameText: {
    // fontSize: "lg",
    // fontWeight: "bold",
    // color: "palette.gray_darkest",
    // rounded: "full",
  },
  templateFileStack: {
    // direction: "row",
    // align: "center",
  },
  templateDescriptionText: {
    // fontSize: "md",
    // fontWeight: "normal",
    // color: "palette.gray_darkest",
    // width: "33.5rem",
  },
  templateDownloadButton: {
    // borderRadius: "0.25rem",
    // color: "palette.white",
    // bg: "palette.main",
    // width: "18.5rem",
    // fontWeight: "bold",
    // _hover: {
    //   bg: "palette.main_darker",
    // },
  },
};
