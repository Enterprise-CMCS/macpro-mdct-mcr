/* eslint-disable */
import { Navigate } from "react-router-dom";
// components
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Flex,
  Icon as ChakraIcon,
  Stack,
  Text,
} from "@chakra-ui/react";
import { DueDateTable, Icon } from "../../components/index";
// utils
import { UserRoles } from "utils/types/types";
import { useUser } from "utils/auth";
import { useBreakpoint } from "../../utils/useBreakpoint";
// assets
import { BsFileEarmarkSpreadsheetFill } from "react-icons/bs";

export default () => {
  const { isTablet, isDesktop } = useBreakpoint();
  const { userRole, userState } = useUser();
  const isAdminUser = userRole && userRole !== UserRoles.STATE;

  if (isAdminUser) {
    return <Navigate to={`/admin`} />;
  }

  const getTemplateSize = (templateName: string) => {
    // fetch file size from local or s3 for display
    console.log("Searching S3 for %s template: ", templateName); // eslint-disable-line
    return "1.2MB";
  };

  return (
    <section>
      {userState ? (
        <Box sx={sx.root} data-testid="home-view">
          <Flex sx={sx.infoFlex}>
            <Alert sx={sx.info} status="info" variant="left-accent">
              <AlertIcon />
              <AlertTitle>
                Welcome to the new Managed Care Reporting tool!
              </AlertTitle>
              <AlertDescription>
                Each state must submit one report per program.
              </AlertDescription>
            </Alert>
          </Flex>
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
            <Stack
              textAlign="left"
              py={6}
              color={"palette.gray"}
              justify="center"
              width="46rem"
              boxShadow="0px 3px 9px rgba(0, 0, 0, 0.2)"
              direction="row"
              // sx={sx.downloadCardStack}
            >
              {isDesktop && (
                <Flex
                  sx={sx.spreadsheetIconFlex}
                  justify="center"
                  width="9.5rem"
                >
                  <ChakraIcon
                    as={BsFileEarmarkSpreadsheetFill}
                    sx={sx.spreadsheetIcon}
                    boxSize="5.5rem"
                  />
                </Flex>
              )}
              <Flex sx={sx.cardContentFlex} flexDirection="column" gap="0.5rem">
                <Text
                  sx={sx.templateNameText}
                  fontSize={"lg"}
                  fontWeight={"bold"}
                  color={"palette.gray_darkest"}
                  rounded={"full"}
                >
                  Managed Care Program Annual Report (MCPAR)
                </Text>
                {!isDesktop && (
                  <Text
                    fontSize={"md"}
                    fontWeight={"normal"}
                    color={"palette.gray_darkest"}
                  >
                    Due date: Varies, see below
                  </Text>
                )}
                <Text
                  sx={sx.templateDescriptionText}
                  fontSize={"md"}
                  fontWeight={"normal"}
                  color={"palette.gray_darkest"}
                  width="33.5rem"
                >
                  The MCPAR online form will be available on this website in
                  October 2022.{" "}
                  {isDesktop
                    ? "Note: Every state must submit one report per program."
                    : ""}
                </Text>
                <Button
                  sx={sx.templateDownloadButton}
                  leftIcon={<Icon icon="downloadArrow" />}
                  borderRadius="0.25rem"
                  color={"palette.white"}
                  bg={"palette.main"}
                  width="18.5rem"
                  fontWeight={"bold"}
                  _hover={{ bg: "palette.main_darker" }}
                >
                  Download Excel Template {getTemplateSize("MCPAR")}
                </Button>
                {isTablet && (
                  <Flex flexDirection={"column"}>
                    <Text
                      sx={sx.templateNameText}
                      fontSize={"lg"}
                      fontWeight={"bold"}
                      color={"palette.gray_darkest"}
                      rounded={"full"}
                    >
                      MCPAR Due Dates
                    </Text>
                    <Text
                      sx={sx.templateDescriptionText}
                      fontSize={"md"}
                      fontWeight={"normal"}
                      color={"palette.gray_darkest"}
                      width="33.5rem"
                    >
                      Due dates vary based on contract year of the managed care
                      program and contract period for the first report.
                    </Text>
                  </Flex>
                )}
                {isDesktop && (
                  <Text
                    //no sx because this will become an accordion
                    fontSize={"md"}
                    fontWeight={"normal"}
                    color={"palette.gray_darkest"}
                    width="33.5rem"
                    marginTop="3rem"
                    bg={"palette.gray_lightest"}
                    h="3.5rem"
                    paddingLeft="1.5rem"
                  >
                    One day I'll be an accordion +
                  </Text>
                )}
                {!isDesktop && <DueDateTable templateName={"MCPAR"} />}
              </Flex>
            </Stack>
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
  infoFlex: {
    marginTop: "1.25rem",
    marginBottom: "2.5rem",
  },
  info: {
    height: "5.25rem",
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
