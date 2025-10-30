import { useContext } from "react";
import { Link as RouterLink } from "react-router-dom";
// components
import { UsaBanner } from "@cmsgov/design-system";
import { Box, Container, Flex, Image, Link, Text } from "@chakra-ui/react";
import { Menu, MenuOption, ReportContext } from "components";
// utils
import { useBreakpoint, useStore } from "utils";
// assets
import appLogo from "assets/logos/logo_mcr.png";
import getHelpIcon from "assets/icons/icon_help.png";
import checkIcon from "assets/icons/icon_check_gray.png";
import closeIcon from "assets/icons/icon_cancel_x_circle.png";
import { ReportType } from "types";

export const Header = () => {
  const { isMobile } = useBreakpoint();
  const { isReportPage } = useContext(ReportContext);

  // state management
  const { lastSavedTime, report } = useStore();

  const saveStatusText = "Last saved " + lastSavedTime;
  const getHeaderText = () => {
    if (report?.reportType === ReportType.MCPAR) {
      return `Program: ${report.programName}`;
    } else if (report?.reportType === ReportType.MLR) {
      return `Submission: ${report.programName}`;
    } else {
      return `${report?.programName}`;
    }
  };

  return (
    <Box sx={sx.root} id="header">
      <UsaBanner />
      <Flex sx={sx.headerBar} role="navigation">
        <Container sx={sx.headerContainer}>
          <Flex sx={sx.headerFlex}>
            <Link as={RouterLink} to="/" variant="unstyled">
              <Image src={appLogo} alt="MCR logo" sx={sx.appLogo} />
            </Link>
            <Flex sx={sx.menuFlex}>
              <Link
                as={RouterLink}
                to="/help"
                variant="unstyled"
                aria-label="Get Help"
              >
                <MenuOption
                  icon={getHelpIcon}
                  text="Get Help"
                  altText="Help"
                  role="group"
                  hideText={isMobile}
                />
              </Link>
              <Menu />
            </Flex>
          </Flex>
        </Container>
      </Flex>
      {isReportPage && (
        <Flex sx={sx.subnavBar}>
          <Container sx={sx.subnavContainer}>
            <Flex sx={sx.subnavFlex}>
              <Flex>
                <Text sx={sx.headerNameText}>{getHeaderText()}</Text>
              </Flex>
              <Flex sx={sx.subnavFlexRight}>
                {lastSavedTime && (
                  <>
                    <Image
                      src={checkIcon}
                      alt="gray checkmark icon"
                      sx={sx.checkIcon}
                    />
                    <Text sx={sx.saveStatusText}>{saveStatusText}</Text>
                  </>
                )}
                <Link
                  as={RouterLink}
                  to={report?.formTemplate.basePath || "/"}
                  sx={sx.leaveFormLink}
                  variant="unstyled"
                >
                  {!isMobile ? (
                    <Text sx={sx.leaveFormText}>Leave form</Text>
                  ) : (
                    <Image src={closeIcon} alt="Close" sx={sx.closeIcon} />
                  )}
                </Link>
              </Flex>
            </Flex>
          </Container>
        </Flex>
      )}
    </Box>
  );
};

const sx = {
  root: {
    position: "sticky",
    top: 0,
    zIndex: "sticky",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    "@media print": {
      display: "none",
    },
    ".tablet &, .mobile &": {
      position: "static",
    },
  },
  headerBar: {
    minHeight: "4rem",
    alignItems: "center",
    bg: "primary_darkest",
  },
  headerContainer: {
    maxW: "appMax",
    ".desktop &": {
      padding: "0 2rem",
    },
  },
  headerFlex: {
    justifyContent: "space-between",
    alignItems: "center",
  },
  menuFlex: {
    alignItems: "center",
  },
  appLogo: {
    maxWidth: "200px",
    marginTop: "spacer1",
  },
  subnavBar: {
    bg: "secondary_lightest",
  },
  subnavContainer: {
    maxW: "appMax",
    ".desktop &": {
      padding: "0 2rem",
    },
  },
  subnavFlex: {
    height: "60px",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerNameText: {
    fontWeight: "bold",
  },
  subnavFlexRight: {
    alignItems: "center",
    paddingRight: "spacer1",
  },
  checkIcon: {
    marginRight: "spacer1",
    boxSize: "1rem",
    ".mobile &": {
      display: "none",
    },
  },
  saveStatusText: {
    fontSize: "sm",
    ".mobile &": {
      width: "5rem",
      textAlign: "right",
    },
  },
  leaveFormLink: {
    marginLeft: "spacer2",
  },
  closeIcon: {
    width: "2rem",
  },
  leaveFormText: {
    border: "1px solid",
    padding: "0.5rem 1rem",
    borderRadius: "5px",
    color: "primary",
    fontWeight: "bold",
  },
};
