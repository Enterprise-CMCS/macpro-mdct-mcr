import { useContext } from "react";
// components
import { Box, Image, Flex, Heading, Text } from "@chakra-ui/react";
import { ReportContext, ReportPage, Sidebar } from "components";
//utils
import { useUser } from "utils";
// form data
import verbiage from "verbiage/pages/mcpar/mcpar-successful-submit";
// assets
import checkIcon from "assets/icons/icon_check_circle.png";

export const SuccessfullySubmitted = () => {
  const { reportData } = useContext(ReportContext);
  const { user } = useUser();

  const { intro } = verbiage;

  return (
    <ReportPage data-testid="success-submit-view">
      <Flex sx={sx.pageContainer}>
        <Sidebar />
        <Flex sx={sx.reviewContainer}>
          <Box sx={sx.leadTextBox}>
            <Heading as="h1" sx={sx.headerText}>
              <span>
                <Image
                  src={checkIcon}
                  alt="Checkmark Icon"
                  sx={sx.headerImage}
                />
              </span>
              {intro.header}
            </Heading>
            <Box sx={sx.infoTextBox}>
              <Text sx={sx.infoHeading}>{intro.infoHeader}</Text>
              <Text>{`MCPAR report for ${reportData?.programName} was submitted on ${reportData?.createdAt} by ${user?.given_name} ${user?.family_name}`}</Text>
            </Box>
          </Box>
          <Box>
            <Text sx={sx.additionalInfoHeader}>
              {intro.additionalInfoHeader}
            </Text>
            <Text sx={sx.additionalInfo}>{intro.additionalInfo}</Text>
          </Box>
        </Flex>
      </Flex>
    </ReportPage>
  );
};

const sx = {
  pageContainer: {
    width: "100%",
  },
  reviewContainer: {
    flexDirection: "column",
    width: "100%",
    maxWidth: "reportPageWidth",
    marginY: "3.5rem",
    marginLeft: "3.5rem",
  },
  leadTextBox: {
    width: "100%",
    paddingBottom: "1.5rem",
    marginBottom: "1.5rem",
    borderBottom: "1px solid",
    borderColor: "palette.gray_lighter",
  },
  headerText: {
    marginBottom: "1rem",
    fontSize: "4xl",
    fontWeight: "normal",
  },
  headerImage: {
    display: "inline-block",
    marginRight: "1rem",
    height: "1.72rem",
  },
  infoTextBox: {
    marginTop: "2rem",
  },
  infoHeading: {
    fontWeight: "bold",
    marginBottom: ".5rem",
  },
  additionalInfoHeader: {
    color: "palette.gray",
    fontWeight: "bold",
    marginBottom: ".5rem",
  },
  additionalInfo: {
    color: "palette.gray",
  },
};
